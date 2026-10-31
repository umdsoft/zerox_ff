import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import createPlugin from '@/plugins/telegram-autologin.client.js';
import TgPin from '@/pages/auth/tg-pin.vue';
import { createVm } from './helpers/mountOptions';
import uz from '@/lang/uz';
import ru from '@/lang/ru';
import kr from '@/lang/kr';
import en from '@/lang/en';
import kaa from '@/lang/kaa';

// 31.10: Telegram Mini App — /telegram/auth 403 ACCOUNT_DELETED va 429 TERMINAL (xabar + qayta urinishsiz).

const MSG = { 'errors.account_deleted': 'DELETED', 'errors.too_many_attempts': 'TOO_MANY' };
const reply = (status, data) => Promise.resolve({ status, data });

function setup(responses, { contactResponse = 'contact=1&hash=x' } = {}) {
  const alerts = [];
  const tg = {
    initData: 'query_id=1',
    ready: vi.fn(),
    expand: vi.fn(),
    showAlert: (m) => alerts.push(m),
    onEvent: vi.fn(),
    requestContact: (cb) => cb(true, contactResponse ? { response: contactResponse, status: 'sent' } : { status: 'sent' }),
  };
  globalThis.window = { location: { hash: '', replace: vi.fn() }, sessionStorage: { getItem: () => null, setItem() {}, removeItem() {} }, Telegram: { WebApp: tg } };
  const post = vi.fn(() => responses.shift());
  const $auth = { loggedIn: false };
  const app = { $auth, i18n: { locale: 'uz', t: (k) => MSG[k] || k }, router: { replace: vi.fn() } };
  let injected;
  createPlugin({ app, $axios: { post } }, (name, value) => { if (name === 'tgAutologin') { injected = value; } });
  return { api: injected, post, alerts };
}

describe('telegram autologin: terminal 403 ACCOUNT_DELETED / 429', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); delete globalThis.window; });

  it('403 ACCOUNT_DELETED -> deleted-account message, a single request', async () => {
    const { api, post, alerts } = setup([reply(403, { success: false, code: 'ACCOUNT_DELETED' })]);
    expect(await api.run({})).toBe(false);
    expect(post).toHaveBeenCalledTimes(1);
    expect(alerts).toEqual(['DELETED']);
    expect(api.lastTerminal()).toBe('ACCOUNT_DELETED');
    expect(api.terminalMessage('ACCOUNT_DELETED')).toBe('DELETED');
  });

  it('429 -> "too many attempts" message, a single request', async () => {
    const { api, post, alerts } = setup([reply(429, { success: false })]);
    expect(await api.run({})).toBe(false);
    expect(post).toHaveBeenCalledTimes(1);
    expect(alerts).toEqual(['TOO_MANY']);
    expect(api.lastTerminal()).toBe('RATE_LIMIT');
  });

  it('NOT_LINKED -> contact -> 429: no retry loop (2 requests, no 2s sleeps)', async () => {
    const { api, post, alerts } = setup([reply(200, { code: 'NOT_LINKED' }), reply(429, {}), reply(200, { code: 'NOT_LINKED' })]);
    expect(await api.run({})).toBe(false);
    expect(post).toHaveBeenCalledTimes(2);
    expect(alerts).toEqual(['TOO_MANY']);
  });

  it('NOT_LINKED -> contact -> 403 ACCOUNT_DELETED: stops after the contact request', async () => {
    const { api, post, alerts } = setup([reply(200, { code: 'NOT_LINKED' }), reply(403, { code: 'ACCOUNT_DELETED' })]);
    expect(await api.run({})).toBe(false);
    expect(post).toHaveBeenCalledTimes(2);
    expect(alerts).toEqual(['DELETED']);
  });

  it('retry loop still runs on NOT_LINKED and stops at once on 429', async () => {
    const { api, post, alerts } = setup([reply(200, { code: 'NOT_LINKED' }), reply(200, { code: 'NOT_LINKED' }), reply(429, {}), reply(200, { code: 'NOT_LINKED' })], { contactResponse: null });
    const p = api.run({});
    await vi.advanceTimersByTimeAsync(2000);
    await vi.advanceTimersByTimeAsync(2000);
    expect(await p).toBe(false);
    expect(post).toHaveBeenCalledTimes(3);
    expect(alerts).toEqual(['TOO_MANY']);
  });

  it('other 403 / 4xx codes keep the old silent behaviour', async () => {
    const { api, alerts } = setup([reply(403, { code: 'SOMETHING' })]);
    expect(await api.run({})).toBe(false);
    expect(alerts).toEqual([]);
    expect(api.lastTerminal()).toBe(null);
  });
});

describe('i18n keys exist in all 5 locales', () => {
  for (const [name, l] of Object.entries({ uz, ru, kr, en, kaa })) {
    it(name, () => {
      expect(typeof l.errors.account_deleted).toBe('string');
      expect(l.errors.account_deleted.length).toBeGreaterThan(10);
      expect(typeof l.errors.too_many_attempts).toBe('string');
      expect(l.errors.too_many_attempts.length).toBeGreaterThan(10);
    });
  }
});

describe('tg-pin page: PIN submit on 403 ACCOUNT_DELETED / 429', () => {
  const t = (k) => k;
  const mk = (res) => {
    const vm = createVm(TgPin, { mocks: { $t: t, $axios: { post: vi.fn(() => Promise.resolve(res)) }, $tgAutologin: { clearPin: vi.fn(), pinState: () => null, lastTerminal: () => null } } });
    vm.ticket = 'tk'; vm.pinSet = true; vm.pin = '4827'; vm.pinLength = 4;
    return vm;
  };
  it('403 ACCOUNT_DELETED shows the deleted-account message', async () => {
    const vm = mk({ status: 403, data: { code: 'ACCOUNT_DELETED' } });
    await vm.submit();
    expect(vm.error).toBe('errors.account_deleted');
    expect(vm.busy).toBe(false);
  });
  it('429 shows the too-many-attempts message', async () => {
    const vm = mk({ status: 429, data: {} });
    await vm.submit();
    expect(vm.error).toBe('errors.too_many_attempts');
  });
  it('refreshTicket explains a terminal /auth failure instead of "no ticket"', async () => {
    const run = vi.fn(() => Promise.resolve(false));
    const vm = createVm(TgPin, { mocks: { $t: t, $tgAutologin: { run, pinState: () => null, lastTerminal: () => 'ACCOUNT_DELETED', terminalMessage: () => 'DELETED' } } });
    await vm.refreshTicket();
    expect(vm.error).toBe('DELETED');
  });
});
