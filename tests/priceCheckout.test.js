import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PricePage from '@/pages/price/index.vue';
import { createVm } from './helpers/mountOptions';

// Characterization: to'lov / tarif sotib olish URL va payload'lari. Sahifa bo'linganda ham O'ZGARMASDAN o'tishi shart.

const ORIGIN = 'https://zerox.uz';
let axios, toast, vm, win;

function make({ uid = 777, locale = 'uz', loggedIn = true, balance = 500000 } = {}) {
  axios = {
    post: vi.fn().mockResolvedValue({ data: { success: true, data: { end_date: '2026-11-30T00:00:00Z', payment_url: 'https://pay.example/x' } } }),
    $get: vi.fn().mockResolvedValue({ success: true, data: { subscription: { plan: 'start' }, sms: { remaining: 5 } } }),
    get: vi.fn(),
  };
  toast = { success: vi.fn(), error: vi.fn() };
  vm = createVm(PricePage, {
    mocks: {
      $axios: axios,
      $toast: toast,
      $auth: { loggedIn, user: { uid, balance }, setUser: vi.fn() },
      $i18n: { locale },
      $t: (k) => k,
      $router: { push: vi.fn() },
      localePath: (x) => x,
    },
  });
  return vm;
}

beforeEach(() => {
  win = { location: { origin: ORIGIN, hash: '', href: '' }, addEventListener() {}, removeEventListener() {} };
  globalThis.window = win;
});
afterEach(() => { delete globalThis.window; });

describe('price: top-up redirect URL (Click / Payme)', () => {
  it("Click: raw return_url, service/merchant ids, amount in so'm", async () => {
    make();
    vm.paymentTarget = { kind: 'topup', amount: 150000, label: 'x' };
    await vm.choosePayment('click');
    expect(win.location.href).toBe(
      'https://my.click.uz/services/pay?service_id=24899&merchant_id=17375&amount=150000&transaction_param=777&return_url=https://zerox.uz/price',
    );
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('Payme: base64 of m;ac.user_id;a=tiyin;c=returnUrl', async () => {
    make();
    vm.paymentTarget = { kind: 'topup', amount: 150000, label: 'x' };
    await vm.choosePayment('payme');
    const payload = 'm=62fa657ea12ad7a48f4b2dd9;ac.user_id=777;a=15000000;c=https://zerox.uz/price';
    expect(win.location.href).toBe('https://checkout.paycom.uz/' + Buffer.from(payload).toString('base64'));
  });

  it('return_url follows current origin', async () => {
    make();
    win.location.origin = 'https://test.zerox.uz';
    vm.paymentTarget = { kind: 'topup', amount: 2000 };
    await vm.choosePayment('click');
    expect(win.location.href).toContain('return_url=https://test.zerox.uz/price');
  });

  it('rejects amount < 1000 and missing uid (no redirect)', async () => {
    make();
    vm.paymentTarget = { kind: 'topup', amount: 999 };
    await vm.choosePayment('click');
    expect(win.location.href).toBe('');
    expect(toast.error).toHaveBeenCalledWith("Noto'g'ri ma'lumotlar");
    make({ uid: 0 });
    vm.paymentTarget = { kind: 'topup', amount: 5000 };
    await vm.choosePayment('payme');
    expect(win.location.href).toBe('');
  });

  it('openTopupFromConfirm: amount = max(1000, shortfall), label topUpBtn', () => {
    make({ balance: 100000 });
    vm.planConfirmTarget = { plan: 'premium', price: 199000, smsCount: 1100, label: 'Premium' };
    vm.openTopupFromConfirm();
    expect(vm.paymentTarget).toEqual({ kind: 'topup', amount: 99000, label: vm.texts.topUpBtn });
    make({ balance: 198500 });
    vm.planConfirmTarget = { plan: 'premium', price: 199000, smsCount: 1100, label: 'Premium' };
    vm.openTopupFromConfirm();
    expect(vm.paymentTarget.amount).toBe(1000);
  });
});

describe('price: choosePayment ignores non-topup targets (wave D: dead create-sms-package branch removed)', () => {
  it('a legacy addon target sends NO request and does not redirect', async () => {
    make();
    vm.paymentTarget = { kind: 'addon', key: 'medium', label: '200 SMS' };
    await vm.choosePayment('payme');
    expect(axios.post).not.toHaveBeenCalled();
    expect(win.location.href).toBe('');
    expect(vm.paymentLoading).toBe(false);
  });

  it('addon is bought from balance; insufficient balance opens a TOPUP target (not an addon payment)', () => {
    make({ balance: 1000 });
    vm.purchaseAddon('medium');
    expect(vm.planConfirmTarget).toMatchObject({ kind: 'addon', packageName: 'medium', price: 40000 });
    vm.openTopupFromConfirm();
    expect(vm.paymentTarget.kind).toBe('topup');
  });
});

describe('price: plan / addon purchase from balance', () => {
  it('purchasePlan targets: start 99000/500, premium 199000/1100', () => {
    make();
    vm.purchasePlan('start');
    expect(vm.planConfirmTarget).toEqual({ plan: 'start', price: 99000, smsCount: 500, label: 'Start' });
    vm.purchasePlan('premium');
    expect(vm.planConfirmTarget).toEqual({ plan: 'premium', price: 199000, smsCount: 1100, label: 'Premium' });
  });

  it('guest is redirected to login instead', () => {
    make({ loggedIn: false });
    vm.purchasePlan('start');
    expect(vm.planConfirmTarget).toBeNull();
    expect(vm.$router.push).toHaveBeenCalledWith({ name: 'auth-login' });
  });

  it('addon packages table + purchaseAddon target', () => {
    make();
    expect(vm.addonPackages).toEqual([
      { name: 'small', sms: 100, price: 21000 },
      { name: 'medium', sms: 200, price: 40000 },
      { name: 'large', sms: 300, price: 57000 },
    ]);
    vm.purchaseAddon('large');
    expect(vm.planConfirmTarget).toEqual({ kind: 'addon', packageName: 'large', price: 57000, smsCount: 300, label: '300 SMS' });
    vm.planConfirmTarget = null;
    vm.purchaseAddon('nope');
    expect(vm.planConfirmTarget).toBeNull();
  });

  it('confirm plan: POST purchase-from-balance {plan} silent, then reload subscription + /user/me', async () => {
    make();
    vm.purchasePlan('premium');
    await vm.confirmPlanPurchase();
    expect(axios.post).toHaveBeenCalledWith('/finance/subscription/purchase-from-balance', { plan: 'premium' }, { silent: true });
    expect(axios.$get).toHaveBeenCalledWith('/finance/subscription', { silent: true });
    expect(axios.$get).toHaveBeenCalledWith('/user/me', { silent: true });
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(vm.planConfirmTarget).toBeNull();
    expect(vm.purchaseLoading).toBe(false);
  });

  it('confirm addon: purchase-addon-from-balance {package_name}', async () => {
    make();
    vm.purchaseAddon('small');
    await vm.confirmPlanPurchase();
    expect(axios.post).toHaveBeenCalledWith('/finance/subscription/purchase-addon-from-balance', { package_name: 'small' }, { silent: true });
  });

  it('insufficient balance: no request, hint toast', async () => {
    make({ balance: 10 });
    vm.purchasePlan('start');
    await vm.confirmPlanPurchase();
    expect(axios.post).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(vm.texts.insufficientHint);
  });

  it('server insufficient-balance code surfaces server message', async () => {
    make();
    axios.post.mockRejectedValueOnce({ response: { data: { code: 'insufficient-balance', message: 'kam' } } });
    vm.purchasePlan('start');
    await vm.confirmPlanPurchase();
    expect(toast.error).toHaveBeenCalledWith('kam');
  });

  it('openSmsHistory GET /finance/subscription/sms-stats silent', async () => {
    make();
    axios.$get.mockResolvedValueOnce({ success: true, data: { by_type: { auto: 3, payment_link: 2 }, by_type_pool: {} } });
    await vm.openSmsHistory();
    expect(axios.$get).toHaveBeenCalledWith('/finance/subscription/sms-stats', { silent: true });
    expect(vm.smsHistoryStats).toEqual({ registration: 0, auto: 3, manual: 0, qarz_tolandi: 0, payment_link: 2 });
  });
});
