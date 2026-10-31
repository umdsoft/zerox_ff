import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { templateOf, inlineChildren, canonical } from './helpers/inlineTemplate';

// wave D: sahifa shablonlari bo'linganda (child komponentlarga) shablon MATNI o'zgarmaganini isbotlaydi: child'lar joyiga qo'yilib
// kanonik AST hash'i HEAD'dagi (bo'lishdan oldingi) hash bilan solishtiriladi. Yangilash: `UPDATE_TPL=1` (faqat bo'lishdan oldingi holatda!).
const FIXTURE = path.join(__dirname, 'fixtures', 'templates.json');
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex');
const fam = ['PendingInvites', 'BudgetAnalysis', 'WatchSection', 'WatcherSection', 'OverviewModal', 'InfoModal', 'RemoveModal'];
const PAGES = {
  index: { page: 'pages/index.vue', children: ['WelcomeHeader', 'RatioOverview', 'ModuleCards'].map((n) => ({ tag: `Index${n}`, file: `components/home/Index${n}.vue` })) },
  login: { page: 'pages/auth/login.vue', children: [{ tag: 'LoginForgotModal', file: 'components/auth/LoginForgotModal.vue' }, { tag: 'LoginTestimonialsPanel', file: 'components/auth/LoginTestimonialsPanel.vue' }] },
  family: { page: 'pages/finance/family/index.vue', children: fam.map((n) => ({ tag: `Family${n}`, file: `components/family/Family${n}.vue` })) },
  analytics: {
    page: 'pages/finance/analytics/index.vue',
    children: [
      { tag: 'AnalyticsIncomesTab', file: 'components/analytics/AnalyticsIncomesTab.vue' },
      { tag: 'AnalyticsExpensesTab', file: 'components/analytics/AnalyticsExpensesTab.vue' },
      { tag: 'AnalyticsDebtsTab', file: 'components/analytics/AnalyticsDebtsTab.vue' },
      { tag: 'AnalyticsBudgetTab', file: 'components/analytics/AnalyticsBudgetTab.vue' },
      { tag: 'AnalyticsGoalsTab', file: 'components/analytics/AnalyticsGoalsTab.vue' },
      { tag: 'AnalyticsCalendarTab', file: 'components/analytics/AnalyticsCalendarTab.vue' },
      { tag: 'AnalyticsTrendTab', file: 'components/analytics/AnalyticsTrendTab.vue' },
      { tag: 'AnalyticsDayModal', file: 'components/analytics/AnalyticsDayModal.vue' },
    ],
  },
};

describe('split page templates == original (children inlined)', () => {
  const fx = fs.existsSync(FIXTURE) ? JSON.parse(fs.readFileSync(FIXTURE, 'utf8')) : {};
  for (const [name, { page, children }] of Object.entries(PAGES)) {
    it(name, () => {
      const h = sha(canonical(`<div>${inlineChildren(templateOf(page), children)}</div>`));
      if (process.env.UPDATE_TPL) {
        fx[name] = h;
        fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
        fs.writeFileSync(FIXTURE, JSON.stringify(fx, null, 1));
      }
      expect(h).toBe(fx[name]);
    });
  }
});
