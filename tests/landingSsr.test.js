import { describe, it, expect, vi } from 'vitest';
import { renderToHtml, RENDER_ENABLED } from './helpers/renderSsr';
import { checkOrUpdate } from './helpers/ssrCompare';
// vue-qr (async, `window` kerak) — bo'lingandan keyin LandingDownload ichida ro'yxatdan o'tadi, shuning uchun modul darajasida mock
vi.mock('vue-qr', () => ({ default: { render: (h) => h('div', { attrs: { 'data-stub': 'VueQr' } }) } }));
import Landing from '@/components/LandingPage.vue';

// wave D: LandingPage bo'limlarga bo'linishi — SSR HTML (struktura + class + matn) 5 tilda HEAD bilan BIR XIL bo'lishi shart.
const LOCALES = ['uz', 'ru', 'kr', 'kaa', 'en'];

describe.skipIf(!RENDER_ENABLED)('LandingPage SSR equivalence (5 locales)', () => {
  for (const locale of LOCALES) {
    it(locale, async () => {
      // `require('@/assets/...')` (til bayrog'i) vite-node'da hal bo'lmaydi — ikkala tomonda ham bir xil stub
      const opts = { ...Landing, computed: { ...Landing.computed, currentLangFlag: () => 'FLAG', availableLanguages: () => LOCALES.map((c) => ({ code: c, label: c, flag: 'FLAG' })) } };
      const html = await renderToHtml(opts, {
        mocks: { $i18n: { locale }, $t: (k) => k, localePath: (x) => '/' + (x && x.name ? x.name : x), $route: { path: '/' }, $auth: { loggedIn: false } },
        stubs: ['nuxt-link'],
      });
      const { h, expected } = checkOrUpdate('landing', locale, html);
      expect(html.length).toBeGreaterThan(20000);
      expect(h).toBe(expected);
    });
  }
});
