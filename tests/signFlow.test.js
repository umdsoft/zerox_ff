import { describe, it, expect, vi, afterEach } from 'vitest';
import { createVm } from './helpers/mountOptions';
import {
  SIGN_TEXTS, SIGN_PURPOSES, signErrorOf, signErrorAction, signErrorText, normalizeCode, isCodeComplete,
  formatTimer, buildChallengeBody, parseChallenge, signAndSend, confirmReject, isSignRequiredError,
} from '@/utils/signFlow';
import { createSignService } from '@/plugins/sign.client';
import SignModal from '@/components/sign/SignModal.vue';
import notificationMixin from '@/mixins/notificationMixin';
import DebtExtendNotification from '@/components/notification_types/debt-extend/debt-extend.vue';

const fail = (status, data) => ({ response: { status, data } });
const LOCALES = ['uz', 'kr', 'ru', 'en', 'kaa'];

describe('SIGN_TEXTS: all 5 locales have the same keys', () => {
  const keysOf = (o) => Object.keys(o).sort();
  it.each(LOCALES)('%s', (loc) => {
    expect(keysOf(SIGN_TEXTS[loc])).toEqual(keysOf(SIGN_TEXTS.uz));
    expect(keysOf(SIGN_TEXTS[loc].docTypes)).toEqual(keysOf(SIGN_TEXTS.uz.docTypes));
    Object.entries(SIGN_TEXTS[loc]).forEach(([k, v]) => {
      if (typeof v === 'string') {expect(v.length, `${loc}.${k}`).toBeGreaterThan(0);}
    });
  });
  it('uz wording from the spec', () => {
    const T = SIGN_TEXTS.uz;
    expect(T.consent).toBe('Shartlar bilan tanishdim va elektron imzo bilan imzolayman');
    expect(T.getCode).toBe('Kod olish');
    expect(signErrorText({ code: 'SIGN_INVALID', attemptsLeft: 3 }, 'uz')).toBe("Kod noto'g'ri, 3 urinish qoldi");
    expect(signErrorText({ code: 'SIGN_EXPIRED' }, 'uz')).toBe("Kod muddati o'tdi, qaytadan oling");
    expect(signErrorText({ code: 'SIGN_LOCKED' }, 'uz')).toBe("Urinishlar tugadi, keyinroq urinib ko'ring");
    expect(signErrorText({ code: 'SIGN_DOC_CHANGED' }, 'uz')).toBe("Hujjat o'zgargan, qaytadan oching");
  });
  it('unknown locale falls back to uz', () => {
    expect(signErrorText({ code: 'SIGN_EXPIRED' }, 'xx')).toBe(SIGN_TEXTS.uz.expired);
  });
});

describe('signErrorOf / signErrorAction', () => {
  it.each([
    [fail(428, { success: false, code: 'SIGN_REQUIRED', purpose: 'act_create' }), 'SIGN_REQUIRED', 'restart'],
    [fail(428, {}), 'SIGN_REQUIRED', 'restart'],
    [fail(400, { code: 'SIGN_INVALID', attempts_left: 2 }), 'SIGN_INVALID', 'retry'],
    [fail(410, { code: 'SIGN_EXPIRED' }), 'SIGN_EXPIRED', 'restart'],
    [fail(429, { code: 'SIGN_LOCKED' }), 'SIGN_LOCKED', 'locked'],
    [fail(409, { code: 'SIGN_DOC_CHANGED' }), 'SIGN_DOC_CHANGED', 'close'],
    [fail(409, { message: 'SIGN_DOC_CHANGED' }), 'SIGN_DOC_CHANGED', 'close'],
  ])('%j', (e, code, action) => {
    const s = signErrorOf(e);
    expect(s.code).toBe(code);
    expect(signErrorAction(s.code)).toBe(action);
  });
  it('attempts_left parsed', () => {
    expect(signErrorOf(fail(400, { code: 'SIGN_INVALID', attempts_left: 2 })).attemptsLeft).toBe(2);
    expect(signErrorOf(fail(400, { code: 'SIGN_INVALID' })).attemptsLeft).toBe(null);
  });
  it('non-sign errors -> null', () => {
    expect(signErrorOf(fail(403, { code: 'FORBIDDEN', msg: 'only-lender' }))).toBe(null);
    expect(signErrorOf(fail(409, { message: 'already-processed' }))).toBe(null);
    expect(signErrorOf({ message: 'Network Error' })).toBe(null);
    expect(isSignRequiredError(fail(428, {}))).toBe(true);
  });
});

describe('helpers', () => {
  it('code normalization', () => {
    expect(normalizeCode('12 3a45678')).toBe('123456');
    expect(isCodeComplete('12345')).toBe(false);
    expect(isCodeComplete('123456')).toBe(true);
  });
  it('timer format', () => {
    expect(formatTimer(300)).toBe('05:00');
    expect(formatTimer(61)).toBe('01:01');
    expect(formatTimer(-3)).toBe('00:00');
  });
  it('challenge body only carries given fields', () => {
    expect(buildChallengeBody('repayment_confirm', { contract: 5, act: 9, notification: 77, summary: {}, submit: () => {} }))
      .toEqual({ purpose: 'repayment_confirm', contract: 5, act: 9, notification: 77 });
    expect(buildChallengeBody('contract_create', { payload: { debitor: 1, creditor: 2, amount: 10, currency: 'UZS', end_date: '2027-01-01' } }))
      .toEqual({ purpose: 'contract_create', payload: { debitor: 1, creditor: 2, amount: 10, currency: 'UZS', end_date: '2027-01-01' } });
  });
  it('parseChallenge', () => {
    expect(parseChallenge({ success: true, challenge_id: 'c1', channel: 'telegram', destination_masked: '@ab***', expires_in: 300 }))
      .toMatchObject({ challengeId: 'c1', channel: 'telegram', destination: '@ab***', expiresIn: 300 });
    expect(parseChallenge({ challenge_id: 'c1', channel: 'x' })).toMatchObject({ channel: 'sms', expiresIn: 300 });
    expect(parseChallenge({ success: false })).toBe(null);
  });
  it('signAndSend without $sign submits directly; confirmReject defaults to true', async () => {
    const submit = vi.fn(() => Promise.resolve('ok'));
    expect(await signAndSend({}, { submit })).toBe('ok');
    expect(submit).toHaveBeenCalledWith(undefined);
    expect(await confirmReject({})).toBe(true);
  });
});

describe('$sign service', () => {
  it('run resolves with done result, null on cancel, rejects on fail', async () => {
    const s = createSignService();
    const p1 = s.run({ purpose: 'x' });
    expect(s.state.request.purpose).toBe('x');
    s.done('R');
    expect(await p1).toBe('R');
    expect(s.state.request).toBe(null);

    const p2 = s.run({ purpose: 'y' });
    s.cancel();
    expect(await p2).toBe(null);

    const p3 = s.run({ purpose: 'z' });
    const err = new Error('boom');
    s.fail(err);
    await expect(p3).rejects.toBe(err);
  });
  it('confirmReject resolves with the answer', async () => {
    const s = createSignService();
    const p = s.confirmReject();
    expect(s.state.confirm).toBeTruthy();
    s.answer(true);
    expect(await p).toBe(true);
  });
});

function modal({ challenge, submit, locale = 'uz' } = {}) {
  const $axios = { $post: vi.fn(challenge || (() => Promise.resolve({ success: true, challenge_id: 'ch-1', channel: 'sms', destination_masked: '+998 ** *** ** 12', expires_in: 300 }))) };
  const toast = { error: vi.fn(), success: vi.fn() };
  const request = {
    purpose: SIGN_PURPOSES.ACT_CREATE,
    contract: 5,
    payload: { contract: 5, type: 2, refundable_amount: 1000, end_date: '2027-01-01' },
    summary: { docType: 'refund_full', lender: 'A', borrower: 'B', amount: 1000, currency: 'UZS', number: '42' },
    submit: vi.fn(submit || (() => Promise.resolve({ status: 201 }))),
  };
  const vm = createVm(SignModal, {
    propsData: { request },
    mocks: { $axios, $toast: toast, $i18n: { locale }, $formatNumber: (n) => String(n), $formatDate: (d) => d },
  });
  const emitted = [];
  vm.$emit = (name, payload) => emitted.push([name, payload]);
  return { vm, $axios, request, toast, emitted };
}

describe('SignModal', () => {
  afterEach(() => vi.useRealTimers());

  it('terms summary rows (document, number, parties, amount)', () => {
    const { vm } = modal();
    const labels = vm.rows.map((r) => r.label);
    expect(labels).toEqual(['Hujjat', 'Shartnoma raqami', 'Qarz beruvchi', 'Qarz oluvchi', 'Summa']);
    expect(vm.rows[0].value).toBe("Qarzni to'liq qaytarish dalolatnomasi");
    expect(vm.rows[4].value).toBe('1000 UZS');
  });

  it('cannot request a code without consent; then POST /sign/challenge and starts timers', async () => {
    vi.useFakeTimers();
    const { vm, $axios } = modal();
    await vm.requestCode();
    expect($axios.$post).not.toHaveBeenCalled();
    vm.agreed = true;
    await vm.requestCode();
    expect($axios.$post).toHaveBeenCalledWith('/sign/challenge', {
      purpose: 'act_create', contract: 5, payload: { contract: 5, type: 2, refundable_amount: 1000, end_date: '2027-01-01' },
    }, { silent: true });
    expect(vm.step).toBe('code');
    expect(vm.sentText).toBe('SMS orqali +998 ** *** ** 12 ga kod yuborildi');
    expect(vm.remaining).toBe(300);
    expect(vm.resendLeft).toBe(60);
    vi.advanceTimersByTime(60000);
    expect(vm.resendLeft).toBe(0);
    expect(vm.remaining).toBe(240);
    vm.stopTimer();
  });

  it('resend only after 60 s', async () => {
    vi.useFakeTimers();
    const { vm, $axios } = modal();
    vm.agreed = true;
    await vm.requestCode();
    await vm.resend();
    expect($axios.$post).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(60000);
    await vm.resend();
    expect($axios.$post).toHaveBeenCalledTimes(2);
    vm.stopTimer();
  });

  it('expiry after 5 min disables submit and shows the expired text', async () => {
    vi.useFakeTimers();
    const { vm } = modal();
    vm.agreed = true;
    await vm.requestCode();
    vm.onCodeInput('123456');
    expect(vm.canSubmit).toBe(true);
    vi.advanceTimersByTime(300000);
    expect(vm.canSubmit).toBe(false);
    expect(vm.error).toBe(SIGN_TEXTS.uz.expired);
  });

  it('submits sign {challenge_id, code} and emits done', async () => {
    const { vm, request, emitted } = modal();
    vm.agreed = true;
    await vm.requestCode();
    vm.onCodeInput('12-34-56');
    await vm.submit();
    expect(request.submit).toHaveBeenCalledWith({ challenge_id: 'ch-1', code: '123456' });
    expect(emitted).toEqual([['done', { status: 201 }]]);
  });

  it('SIGN_INVALID keeps the code step with attempts left; attempts_left 0 locks', async () => {
    const { vm, emitted } = modal({ submit: () => Promise.reject(fail(400, { code: 'SIGN_INVALID', attempts_left: 4 })) });
    vm.agreed = true;
    await vm.requestCode();
    vm.onCodeInput('111111');
    await vm.submit();
    expect(vm.step).toBe('code');
    expect(vm.error).toBe("Kod noto'g'ri, 4 urinish qoldi");
    expect(vm.code).toBe('');
    expect(emitted).toEqual([]);
    vm.request.submit.mockImplementation(() => Promise.reject(fail(400, { code: 'SIGN_INVALID', attempts_left: 0 })));
    vm.onCodeInput('222222');
    await vm.submit();
    expect(vm.locked).toBe(true);
    vm.stopTimer();
  });

  it('SIGN_EXPIRED / SIGN_REQUIRED go back to "Kod olish"', async () => {
    const { vm } = modal({ submit: () => Promise.reject(fail(410, { code: 'SIGN_EXPIRED' })) });
    vm.agreed = true;
    await vm.requestCode();
    vm.onCodeInput('111111');
    await vm.submit();
    expect(vm.step).toBe('review');
    expect(vm.challenge).toBe(null);
    expect(vm.error).toBe(SIGN_TEXTS.uz.expired);
    expect(vm.agreed).toBe(true);
  });

  it('SIGN_LOCKED locks the input', async () => {
    const { vm } = modal({ submit: () => Promise.reject(fail(429, { code: 'SIGN_LOCKED' })) });
    vm.agreed = true;
    await vm.requestCode();
    vm.onCodeInput('111111');
    await vm.submit();
    expect(vm.locked).toBe(true);
    expect(vm.error).toBe(SIGN_TEXTS.uz.locked);
  });

  it('SIGN_DOC_CHANGED closes with a toast', async () => {
    const { vm, toast, emitted } = modal({ submit: () => Promise.reject(fail(409, { code: 'SIGN_DOC_CHANGED' })) });
    vm.agreed = true;
    await vm.requestCode();
    vm.onCodeInput('111111');
    await vm.submit();
    expect(toast.error).toHaveBeenCalledWith(SIGN_TEXTS.uz.docChanged);
    expect(emitted[0][0]).toBe('cancel');
  });

  it('non-sign errors are handed to the page (failed)', async () => {
    const err = fail(403, { code: 'FORBIDDEN', msg: 'only-borrower' });
    const { vm, emitted } = modal({ submit: () => Promise.reject(err) });
    vm.agreed = true;
    await vm.requestCode();
    vm.onCodeInput('111111');
    await vm.submit();
    expect(emitted).toEqual([['failed', err]]);
  });

  it('role error on /sign/challenge -> failed; network error -> message in the modal', async () => {
    const err = fail(403, { code: 'FORBIDDEN', msg: 'only-lender' });
    const a = modal({ challenge: () => Promise.reject(err) });
    a.vm.agreed = true;
    await a.vm.requestCode();
    expect(a.emitted).toEqual([['failed', err]]);

    const b = modal({ challenge: () => Promise.reject(new Error('Network Error')) });
    b.vm.agreed = true;
    await b.vm.requestCode();
    expect(b.vm.step).toBe('review');
    expect(b.vm.error).toBe(SIGN_TEXTS.uz.challengeFailed);

    const c = modal({ challenge: () => Promise.reject(fail(429, { code: 'SIGN_LOCKED' })), locale: 'ru' });
    c.vm.agreed = true;
    await c.vm.requestCode();
    expect(c.vm.error).toBe(SIGN_TEXTS.ru.locked);
  });
});

describe('notifications: approve = signed, reject = code-free with confirm', () => {
  const item = { id: 77, debitor: 10, creditor: 20, reciver: 10, contract: 5, act: 9, amount: 5000, refundable_amount: 1000, residual_amount: 0, currency: 'UZS', number: '42', end_date: '2027-01-01' };
  function vmWith(options, { post, $sign }) {
    const toast = { success: vi.fn(), error: vi.fn() };
    const vm = createVm(options, {
      propsData: { item, getNotifications: vi.fn() },
      mocks: {
        $t: (k) => k, $toast: toast, $auth: { user: { id: 10 } }, $i18n: { locale: 'uz' }, $fio: (s) => s, $oferta: null,
        $axios: { post: vi.fn(post || (() => Promise.resolve({ status: 200, data: { success: true } }))), put: vi.fn() }, $sign,
      },
    });
    return { vm, toast };
  }

  it('full repayment confirm goes through $sign with repayment_confirm and sends sign', async () => {
    const $sign = { run: vi.fn((opts) => opts.submit({ challenge_id: 'c', code: '123456' })), confirmReject: vi.fn() };
    const { vm } = vmWith({ mixins: [notificationMixin] }, { $sign });
    await vm.fullReturn(77, 1);
    const opts = $sign.run.mock.calls[0][0];
    expect(opts).toMatchObject({ purpose: 'repayment_confirm', contract: 5, act: 9, notification: 77 });
    expect(opts.summary).toMatchObject({ docType: 'repayment_confirm_full', amount: 1000, currency: 'UZS', number: '42' });
    expect(vm.$axios.post.mock.calls[0][0]).toBe('/notification/toliq-qaytarish/77');
    expect(vm.$axios.post.mock.calls[0][1].sign).toEqual({ challenge_id: 'c', code: '123456' });
  });

  it('cancelled signing sends nothing', async () => {
    const $sign = { run: vi.fn(() => Promise.resolve(null)), confirmReject: vi.fn() };
    const { vm, toast } = vmWith({ mixins: [notificationMixin] }, { $sign });
    await vm.partialReturn(77, 1);
    expect(vm.$axios.post).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('reject asks for confirmation and sends without sign', async () => {
    const $sign = { run: vi.fn(), confirmReject: vi.fn(() => Promise.resolve(true)) };
    const { vm } = vmWith({ mixins: [notificationMixin] }, { $sign });
    await vm.fullReturn(77, 2);
    expect($sign.run).not.toHaveBeenCalled();
    expect($sign.confirmReject).toHaveBeenCalled();
    expect(vm.$axios.post.mock.calls[0][1].sign).toBeUndefined();
    expect(vm.$axios.post.mock.calls[0][1].stype).toBe(2);

    const no = { run: vi.fn(), confirmReject: vi.fn(() => Promise.resolve(false)) };
    const b = vmWith({ mixins: [notificationMixin] }, { $sign: no });
    await b.vm.fullReturn(77, 2);
    expect(b.vm.$axios.post).not.toHaveBeenCalled();
  });

  it('time-extension confirm uses time_confirm', async () => {
    const $sign = { run: vi.fn((opts) => opts.submit({ challenge_id: 'c', code: '654321' })), confirmReject: vi.fn() };
    const { vm } = vmWith(DebtExtendNotification, { $sign });
    await vm.muddatUzaytirishQabul(77, 1);
    expect($sign.run.mock.calls[0][0]).toMatchObject({ purpose: 'time_confirm', act: 9, notification: 77 });
    expect(vm.$axios.post.mock.calls[0][0]).toBe('/notification/time/77');
    expect(vm.$axios.post.mock.calls[0][1].sign.code).toBe('654321');
  });

  it('a 428 SIGN_REQUIRED outside the modal shows the localized text', () => {
    const { vm, toast } = vmWith({ mixins: [notificationMixin] }, { $sign: undefined });
    expect(vm.handleActionError(fail(428, { code: 'SIGN_REQUIRED' }))).toBe(true);
    expect(toast.error).toHaveBeenCalledWith(SIGN_TEXTS.uz.required);
  });
});
