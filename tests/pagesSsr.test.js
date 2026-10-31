import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { renderToHtml, RENDER_ENABLED } from './helpers/renderSsr';
import { checkOrUpdate } from './helpers/ssrCompare';

// vue-qr (async, `window` kerak) — child komponentlar ichida ham ro'yxatdan o'tadi, shuning uchun modul darajasida mock
vi.mock('vue-qr', () => ({ default: { render: (h) => h('div', { attrs: { 'data-stub': 'VueQr' } }) } }));

// wave D: sahifa shablonlari child komponentlarga bo'lingan — SSR HTML (struktura + class + matn) turli holatlarda HEAD bilan BIR XIL.
// Baseline: `SSR_OLD=1 UPDATE_SSR=1 VUE_TEST_RENDER=1 npx vitest run tests/pagesSsr.test.js` — tests/_old/<nom>.vue (HEAD nusxasi) bilan.
// Sahifalar joriy oy/kunni ko'rsatadi — baseline 2026-10-31 da yozilgan; vaqt qotiriladi (aks holda sana o'tganda hash o'zgaradi).
const FROZEN_NOW = new Date('2026-10-31T12:00:00+05:00');
beforeAll(() => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(FROZEN_NOW); });
afterAll(() => { vi.useRealTimers(); });
const OLD = Boolean(process.env.SSR_OLD);
const load = async (name, real) => (OLD ? (await import(/* @vite-ignore */ `./_old/${name}.vue`)).default : (await import(/* @vite-ignore */ real)).default);
const baseMocks = {
  $t: (k) => k, $i18n: { locale: 'uz' }, $route: { query: {}, params: {}, path: '/' }, localePath: () => '/x', $auth: { loggedIn: true, user: { id: 1, uid: 1, balance: 0 } }, $axios: {}, $toast: {}, $store: { state: {}, getters: {}, commit: () => {}, dispatch: () => {} },
};
const withData = (C, extra) => ({ ...C, data() { return { ...C.data.call(this), ...extra }; } });

const LINK = { id: 7, owner_name: 'Ali Valiyev', other_name: 'Vali Aliyev', role: 'watched', status: 'accepted', permissions: { income: { view: true, detail: 'full' }, expense: { view: true, detail: 'summary' }, goals: { view: true, detail: 'summary' }, set_limit: true }, limits: [], category_limits: [] };
const LINK2 = { ...LINK, id: 8, role: 'watcher', other_name: 'Karim', permissions: { income: { view: false } } };

const STATS = { berilgan: { shartnoma: { uzs: 5000000, usd: 100 }, daftari: { uzs: 2000000, usd: 50 } }, olingan: { shartnoma: { uzs: 1000000, usd: 0 }, daftari: { uzs: 300000, usd: 20 } } };
const ANALYTICS = { health: { score: 72, status: 'good' }, contracts: { debitor: { count: 3, amount: 1000 }, creditor: { count: 2, amount: 500 } }, debts: { total: 5 }, finance: { balance: 1000 }, alerts: [] };
const ACTIVE = { $auth: { loggedIn: true, user: { id: 1, uid: 1, is_active: 1, balance: 0, first_name: 'Ali', last_name: 'Valiyev' } }, $fio: (n) => String(n || ''), $fioJoin: (...p) => p.filter(Boolean).join(' ') };

const CASES = {
  index: {
    real: '../pages/index.vue',
    stubs: ['nuxt-link', 'LandingPage', 'IdenMessage', 'PassportExpiredMessage', 'AppFooter'],
    mocks: ACTIVE,
    cases: {
      loading: { loading: true },
      error: { loading: false, loadError: true },
      'loaded-empty': { loading: false },
      'loaded-data': { loading: false, combinedStats: STATS, analytics: ANALYTICS, daftariUsdRate: 12500 },
      'drill-olingan': { loading: false, combinedStats: STATS, analytics: ANALYTICS, mainDrill: 'olingan' },
      'drill-berilgan': { loading: false, combinedStats: STATS, analytics: ANALYTICS, mainDrill: 'berilgan', daftariUsdRate: 12500 },
      'iden-modal': { loading: false, idenNotification: true, passportExpiredModal: true },
      'ru-data': { loading: false, combinedStats: STATS, analytics: ANALYTICS, __locale: 'ru' },
      'en-data': { loading: false, combinedStats: STATS, analytics: ANALYTICS, __locale: 'en' },
    },
  },
  login: {
    real: '../pages/auth/login.vue',
    stubs: ['nuxt-link'],
    mocks: { $v: new Proxy({}, { get: () => new Proxy({}, { get: () => ({ $error: false, $dirty: false, required: true }) }) }), $auth: { loggedIn: false } },
    cases: {
      default: {},
      'password-shown': { showPassword: true },
      loading: { isLoading: true },
      iden: { idenNotification: true },
      slide2: { currentSlide: 1 },
      'ru-default': { __locale: 'ru' },
      'ru-iden': { idenNotification: true, __locale: 'ru' },
      'kr-iden': { idenNotification: true, __locale: 'kr' },
    },
  },
  family: {
    real: '../pages/finance/family/index.vue',
    stubs: ['nuxt-link'],
    cases: {
      loading: { loading: true },
      empty: { loading: false },
      populated: { loading: false, pending: [LINK, LINK2], asViewer: [LINK, LINK2], asTarget: [LINK2, LINK] },
      'info-watch': { loading: false, infoKind: 'watch' },
      'info-watcher': { loading: false, infoKind: 'watcher' },
      remove: { loading: false, showRemove: true, removeTarget: LINK },
      overview: { loading: false, showOverview: true, overviewLoading: true, overviewName: 'Ali', overviewLink: LINK },
      form: { loading: false, showForm: true },
    },
  },
  analytics: {
    real: '../pages/finance/analytics/index.vue',
    stubs: ['apexchart', 'date-picker', 'nuxt-link'],
    cases: Object.fromEntries(['incomes', 'expenses', 'debts', 'budget', 'goals', 'calendar', 'trend'].flatMap((tab) => [
      [tab, { activeTab: tab, loading: false }],
      [`${tab}+day`, { activeTab: tab, loading: false, showDayModal: true, dayDetail: { items: [] } }],
    ])),
  },
};

describe.skipIf(!RENDER_ENABLED)('pages SSR equivalence', () => {
  for (const [name, def] of Object.entries(CASES)) {
    for (const [caseName, data] of Object.entries(def.cases)) {
      it(`${name}: ${caseName}`, async () => {
        const C = await load(name, def.real);
        const { __locale: locale, ...rest } = data;
        const html = await renderToHtml(withData(C, rest), { mocks: { ...baseMocks, ...(def.mocks || {}), ...(locale ? { $i18n: { locale } } : {}) }, stubs: def.stubs || [] });
        const { h, expected } = checkOrUpdate(`page-${name}`, caseName, html);
        expect(html.length).toBeGreaterThan(200);
        expect(h).toBe(expected);
      });
    }
  }
});
