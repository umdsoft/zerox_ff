import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseComponent } from 'vue-template-compiler';
import { undeclaredRefs } from './helpers/templateRefs';

// wave D: bo'lingan/yangi komponentlar va sahifalar — shablondagi har bir identifikator komponentda (prop/data/computed/method/mixin) e'lon
// qilingan bo'lishi shart. vitest <script>ni yuklaganda child'ga uzatilmagan prop shu tarzda ushlanadi (wave C saboqi).
const ROOT = path.join(__dirname, '..');
const FILES = [
  ...fs.readdirSync(path.join(ROOT, 'components/landing')).map((f) => `components/landing/${f}`),
  'components/LandingPage.vue',
  ...fs.readdirSync(path.join(ROOT, 'components/home')).map((f) => `components/home/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'components/auth')).map((f) => `components/auth/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'components/price')).map((f) => `components/price/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'components/contract-list')).map((f) => `components/contract-list/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'components/gap')).map((f) => `components/gap/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'components/family')).map((f) => `components/family/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'components/analytics')).map((f) => `components/analytics/${f}`),
  'pages/price/index.vue', 'pages/finance/gap/_id.vue', 'pages/finance/debts/group/_key.vue', 'pages/finance/index.vue',
  'pages/qarz-daftari/index.vue', 'pages/qarz-daftari/mijoz/_id/index.vue', 'pages/money/_type/index.vue', 'pages/finance/family/index.vue',
  'pages/finance/analytics/index.vue', 'pages/auth/login.vue', 'pages/auth/register.vue', 'pages/debt-list/index.vue', 'pages/credit-list/index.vue',
  'pages/expired/_type/index.vue', 'pages/hisobot/_type/index.vue', 'pages/near-expiration/_type/index.vue',
  'pages/near-expiration-creditor-notification/index.vue', 'pages/index.vue',
].filter((f) => f.endsWith('.vue') && fs.existsSync(path.join(ROOT, f)));

describe('template identifiers are declared (incl. mixins)', () => {
  for (const f of FILES) {
    it(f, async () => {
      const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
      const { template } = parseComponent(src);
      if (!template) { return; }
      const mod = (await import(/* @vite-ignore */ '../' + f)).default;
      expect(undeclaredRefs(`<div>${template.content}</div>`, mod), f).toEqual([]);
    });
  }
});
