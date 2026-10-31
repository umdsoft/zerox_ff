import { describe, it, expect, vi } from 'vitest';
import { createVm } from './helpers/mountOptions';
import { API_MESSAGES } from '@/utils/constants';
import Rephone from '@/pages/rephone/index.vue';
import uz from '@/lang/uz';
import ru from '@/lang/ru';
import en from '@/lang/en';
import kaa from '@/lang/kaa';
import kr from '@/lang/kr';

// Backend (userPhone.service.js) kontrakti: defisli msg ('send-code', 'no-code', ...); muddati otgan kod: `message`.

function setup({ post, locale = 'uz' } = {}) {
  const toast = { success: vi.fn(), error: vi.fn() };
  const push = vi.fn();
  const $axios = { post: vi.fn(post) };
  const vm = createVm(Rephone, {
    mocks: {
      $t: (k) => k,
      $toast: toast,
      $axios,
      $auth: { user: { phone: '+998900000000' } },
      $apiLang: () => locale,
      $i18n: { locale },
      $router: { push },
      localePath: (r) => r,
      $store: { commit: vi.fn() },
    },
  });
  vm.phone = '+998 90 123 45 67';
  vm.startTimer = vi.fn();
  return { vm, toast, push, $axios };
}
const ok = (data) => () => Promise.resolve({ status: 200, data });
const fail = (status, data) => () => Promise.reject({ response: { status, data } });
const errors = (toast) => toast.error.mock.calls.map((c) => c[0]);

describe('API_MESSAGES match backend values exactly', () => {
  it('hyphenated', () => {
    expect(API_MESSAGES).toMatchObject({
      SEND_CODE: 'send-code', NO_CODE: 'no-code', CODE_EXPIRED: 'code-expired', USER_ALLOW: 'user-allow',
      SUCCESS: 'success', PHONE_REQUIRED: 'phone-required', TOO_MANY_ATTEMPTS: 'too-many-attempts',
    });
  });
});

describe('step 1 (send code)', () => {
  it('advances to step 2 only on success + send-code', async () => {
    const { vm, toast, $axios } = setup({ post: ok({ success: true, msg: 'send-code', user: '+998900000000' }) });
    await vm.stepGo();
    expect(vm.step).toBe(2);
    expect(vm.oldPhone).toBe('+998900000000');
    expect(vm.startTimer).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect($axios.post.mock.calls[0][0]).toBe('/user/rephone');
    expect($axios.post.mock.calls[0][1]).toMatchObject({ step: 1, phone: '+998901234567' });
  });

  it.each([
    ['user-allow (200)', ok({ success: false, msg: 'user-allow' }), 'a1.a75'],
    ['send-code with success:false', ok({ success: false, msg: 'send-code' }), 'a1.a42'],
    ['unknown msg', ok({ success: true, msg: 'weird' }), 'a1.a42'],
    ['phone-required (400)', fail(400, { success: false, msg: 'phone-required' }), 'a1.a72'],
    ['too-many-attempts (429)', fail(429, { success: false, msg: 'too-many-attempts' }), 'rephone.too_many_attempts'],
    ['429 without body', fail(429, undefined), 'rephone.too_many_attempts'],
    ['500', fail(500, { success: false, msg: 'error' }), 'a1.a42'],
    ['network error', () => Promise.reject(new Error('Network Error')), 'a1.a42'],
  ])('%s -> one error toast, stays on step 1', async (_n, post, key) => {
    const { vm, toast } = setup({ post });
    await vm.stepGo();
    expect(vm.step).toBe(1);
    expect(toast.success).not.toHaveBeenCalled();
    expect(errors(toast)).toEqual([key]);
    expect(vm.isLoading).toBe(false);
  });

  it('rejects invalid phone locally without a request', async () => {
    const { vm, toast, $axios } = setup({ post: ok({}) });
    vm.phone = '+998 90';
    await vm.stepGo();
    expect($axios.post).not.toHaveBeenCalled();
    expect(errors(toast)).toEqual(['a1.a72']);
  });
});

describe('step 2 (verify code)', () => {
  const at2 = (post) => {
    const s = setup({ post });
    s.vm.step = 2;
    s.vm.code = '123456';
    s.vm.oldPhone = '+998900000000';
    return s;
  };

  it('success only on success:true + msg success', async () => {
    const { vm, toast, push, $axios } = at2(ok({ success: true, msg: 'success' }));
    await vm.stepGo2();
    expect(toast.success).toHaveBeenCalledWith('a1.a76');
    expect(push).toHaveBeenCalledTimes(1);
    expect(toast.error).not.toHaveBeenCalled();
    expect($axios.post.mock.calls[0][1]).toMatchObject({ step: 2, phone: '+998901234567', code: '123456' });
  });

  it.each([
    ['no-code (success:true!)', ok({ success: true, msg: 'no-code' }), 'a1.a89'],
    ['code-expired (message)', ok({ success: false, message: 'code-expired' }), 'a1.a90'],
    ['code-expired (msg)', ok({ success: false, msg: 'code-expired' }), 'a1.a90'],
    ['user-allow', ok({ success: false, msg: 'user-allow' }), 'a1.a75'],
    ['locked 429', fail(429, { success: false, msg: 'too-many-attempts' }), 'rephone.too_many_attempts'],
    ['invalid-step 400', fail(400, { success: false, msg: 'invalid-step' }), 'a1.a42'],
    ['500', fail(500, { success: false, msg: 'error' }), 'a1.a42'],
    ['empty body', ok(''), 'a1.a42'],
  ])('%s -> error toast, no success toast, no redirect', async (_n, post, key) => {
    const { vm, toast, push } = at2(post);
    await vm.stepGo2();
    expect(toast.success).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(errors(toast)).toEqual([key]);
    expect(vm.step).toBe(2);
    expect(vm.isLoading).toBe(false);
  });

  it('requires a code', async () => {
    const { vm, toast, $axios } = at2(ok({}));
    vm.code = '';
    await vm.stepGo2();
    expect($axios.post).not.toHaveBeenCalled();
    expect(errors(toast)).toEqual(['a1.a73']);
  });
});

describe('resend (postPhoneChange)', () => {
  it('sms-send restarts timer + success toast', async () => {
    const { vm, toast, $axios } = setup({ post: ok({ success: true, msg: 'sms-send' }) });
    vm.oldPhone = '+998900000000';
    await vm.timer();
    expect($axios.post.mock.calls[0][0]).toBe('/user/phoneChange');
    expect(vm.startTimer).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('rephone.code_resent');
  });
  it.each([
    ['user-allow', ok({ success: false, msg: 'user-allow' }), 'a1.a75'],
    ['429', fail(429, { msg: 'too-many-attempts' }), 'rephone.too_many_attempts'],
    ['400 error', fail(400, { success: false, msg: 'error' }), 'a1.a42'],
  ])('%s -> single error toast', async (_n, post, key) => {
    const { vm, toast } = setup({ post });
    await vm.timer();
    expect(vm.startTimer).not.toHaveBeenCalled();
    expect(errors(toast)).toEqual([key]);
  });
});

describe('i18n keys exist in all 5 languages', () => {
  it.each([['uz', uz], ['ru', ru], ['en', en], ['kaa', kaa], ['kr', kr]])('%s', (_l, m) => {
    expect(typeof m.rephone.too_many_attempts).toBe('string');
    for (const k of ['a42', 'a72', 'a73', 'a75', 'a76', 'a89', 'a90']) expect(typeof m.a1[k]).toBe('string');
  });
});
