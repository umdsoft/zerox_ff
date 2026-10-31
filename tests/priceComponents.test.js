import { describe, it, expect, vi } from 'vitest';
import { renderToHtml, RENDER_ENABLED } from './helpers/renderSsr';
import { createVm } from './helpers/mountOptions';
import PricePage from '@/pages/price/index.vue';
import CurrentStatus from '@/components/price/PriceCurrentStatus.vue';
import DaftariPlans from '@/components/price/PriceDaftariPlans.vue';
import AddonPackages from '@/components/price/PriceAddonPackages.vue';
import ContractPlans from '@/components/price/PriceContractPlans.vue';
import { getPriceTexts } from '@/utils/priceTexts';
import { getPlans } from '@/utils/pricingPlans';

// wave D: pages/price/index.vue bo'lingan komponentlar (mahalliy ro'yxatga olish + render + hodisalar).

const texts = getPriceTexts('uz');
const plansShared = getPlans('uz');

describe('price components: local registration', () => {
  it('PriceCurrentStatus registers PriceExpiryAlert; page registers all four', () => {
    expect(Object.keys(CurrentStatus.components)).toEqual(['PriceExpiryAlert']);
    for (const n of ['PriceCurrentStatus', 'PriceDaftariPlans', 'PriceAddonPackages', 'PriceContractPlans']) {
      expect(Object.keys(PricePage.components)).toContain(n);
    }
  });
});

describe('price components: methods', () => {
  it('daftari plans: isActivePlan honours guest', () => {
    const vm = createVm(DaftariPlans, { propsData: { texts, plansShared, currentPlan: 'start', isGuest: false } });
    expect(vm.isActivePlan('start')).toBe(true);
    expect(vm.isActivePlan('premium')).toBe(false);
    const g = createVm(DaftariPlans, { propsData: { texts, plansShared, currentPlan: 'start', isGuest: true } });
    expect(g.isActivePlan('start')).toBe(false);
    expect(vm.fmtDate('2026-10-01T10:00:00Z')).toBeTypeOf('string');
  });
  it('addon packages formatPrice == groupThousands', () => {
    const vm = createVm(AddonPackages, { propsData: { texts, addonPackages: [] } });
    expect(vm.formatPrice(21000)).toBe('21 000');
  });
});

describe.skipIf(!RENDER_ENABLED)('price components: SSR render (no unknown elements / undefined props)', () => {
  const mocks = { localePath: (x) => String(x && x.name) };
  const stubs = ['nuxt-link'];
  it('current status (+slot)', async () => {
    const html = await renderToHtml(CurrentStatus, {
      mocks, stubs, propsData: { texts, currentPlan: 'start', planLabel: 'Start', smsRemaining: 5, smsTotal: 10, smsPercent: 50, smsHint: 'hint', hasPaidPeriod: true, subStart: '2026-10-01', subEnd: '2026-11-01', daysLeftText: '3 kun', periodPercent: 40, smsBurnText: 'burn' },
    });
    expect(html).toContain('Start');
    expect(html).toContain('burn');
    expect(html).toContain('01.10.2026');
  });
  it('daftari plans', async () => {
    const html = await renderToHtml(DaftariPlans, { mocks, propsData: { texts, plansShared, currentPlan: 'premium', subEnd: '2026-11-01' } });
    expect(html).toContain('199 000');
    expect(html).toContain(texts.hasHigherPlan);
  });
  it('addon packages', async () => {
    const html = await renderToHtml(AddonPackages, { mocks, propsData: { texts, addonPackages: [{ name: 'small', sms: 100, price: 21000 }] } });
    expect(html).toContain('21 000 UZS');
  });
  it('contract plans', async () => {
    const html = await renderToHtml(ContractPlans, { mocks, propsData: { texts } });
    expect(html).toContain(texts.contractSectionTitle);
  });
  it('whole page renders (logged in, start plan) with all children registered', async () => {
    const auth = { loggedIn: true, user: { uid: 1, balance: 1000 } };
    const html = await renderToHtml(PricePage, {
      stubs: ['nuxt-link', 'FinanceSmsManager'],
      mocks: { ...mocks, $auth: auth, $i18n: { locale: 'uz' }, $t: (k) => k, $route: { hash: '', query: {} }, $axios: { $get: vi.fn(), get: vi.fn(), post: vi.fn() } },
    });
    expect(html).toContain('data-stub="FinanceSmsManager"');
    expect(html).toContain('id="sms"');
    expect(html).toContain(texts.contractSectionTitle);
  });
});
