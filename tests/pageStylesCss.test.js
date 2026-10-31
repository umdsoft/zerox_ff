import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { parseComponent } from 'vue-template-compiler';
import { compiledRules } from './helpers/cssRules';

// wave D: <style> bloklari tashqi faylga (`<style scoped src=...>`) ko'chirilgan sahifalar — kompilyatsiya qilingan qoidalar ro'yxati
// (kontekst|selektor|deklaratsiyalar) HEAD'dagi bilan AYNAN bir xil. Fixture: HEAD'dagi .vue <style> bloklaridan.
// Yangilash (faqat bo'lishdan oldingi manbadan!): `UPDATE_CSS=name=<eski .vue yo'li> npx vitest run tests/pageStylesCss.test.js`.
const FIXTURE = path.join(__dirname, 'fixtures', 'css', 'pageStyles.json');
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex');
const ROOT = path.join(__dirname, '..');
const asVue = (cssFile) => {
  const lang = cssFile.endsWith('.scss') ? ' lang="scss"' : '';
  return `<template><div/></template><style${lang}>${fs.readFileSync(path.join(ROOT, cssFile), 'utf8')}</style>`;
};
// wave E: umumiy stil fayllari HAR BIR bola komponentga FAQAT o'z qoidalari bilan bo'lingan (data-v scope'lar orasida CSS takrorlanmaydi).
// name -> [{ vue, css }]; qolgan (hech bir shablon ishlatmaydigan / dinamik) qoidalar sahifada qoladi — ALLOW.
const SPLIT = {
  family: [
    { vue: 'components/family/FamilyInfoModal.vue', css: 'assets/page-styles/family/FamilyInfoModal.css' },
    { vue: 'components/family/FamilyWatchSection.vue', css: 'assets/page-styles/family/FamilyWatchSection.css' },
    { vue: 'components/family/FamilyWatcherSection.vue', css: 'assets/page-styles/family/FamilyWatcherSection.css' },
  ],
  index: [
    { vue: 'pages/index.vue', css: 'assets/page-styles/index/IndexPage.css', allow: /^fade-slide-/ }, // o'lik transition qoidalari (HEAD'da ham ishlatilmagan)
    { vue: 'components/home/IndexWelcomeHeader.vue', css: 'assets/page-styles/index/IndexWelcomeHeader.css' },
    { vue: 'components/home/IndexRatioOverview.vue', css: 'assets/page-styles/index/IndexRatioOverview.css', dynamic: /^zx-(seg|card)-/ }, // :class="part.segClass|cardClass"
  ],
  login: [
    { vue: 'pages/auth/login.vue', css: 'assets/page-styles/login/LoginPage.scss', allow: /^phone-input$/ }, // register.vue dan qolgan o'lik qoida (HEAD'da ham)
    { vue: 'components/auth/LoginForgotModal.vue', css: 'assets/page-styles/login/LoginForgotModal.scss' },
    { vue: 'components/auth/LoginTestimonialsPanel.vue', css: 'assets/page-styles/login/LoginTestimonialsPanel.scss' },
  ],
};
const SINGLE = { 'active-device': 'assets/page-styles/active-device.css' };

describe('page styles moved to external files keep the same compiled rules', () => {
  const fx = fs.existsSync(FIXTURE) ? JSON.parse(fs.readFileSync(FIXTURE, 'utf8')) : {};
  if (process.env.UPDATE_CSS) {
    it('writes fixture', () => {
      const [name, file] = process.env.UPDATE_CSS.split('=');
      fx[name] = compiledRules(fs.readFileSync(file, 'utf8')).map(sha);
      fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
      fs.writeFileSync(FIXTURE, JSON.stringify(fx, null, 1));
      expect(fx[name].length).toBeGreaterThan(5);
    });
    return;
  }
  for (const [name, cssFile] of Object.entries(SINGLE)) {
    it(name, () => {
      expect(compiledRules(asVue(cssFile)).map(sha)).toEqual(fx[name]);
      expect(fx[name].length).toBeGreaterThan(5);
    });
  }
  for (const [name, parts] of Object.entries(SPLIT)) {
    describe(name + ' (split per component)', () => {
      const rulesOf = (p) => compiledRules(asVue(p.css));
      it('union of the split files == original rule set (nothing lost, nothing new)', () => {
        const union = new Set(parts.flatMap((p) => rulesOf(p).map(sha)));
        expect([...union].sort()).toEqual([...new Set(fx[name])].sort());
      });
      for (const p of parts) {
        it(p.vue + ': carries only its own rules, and all of them', () => {
          const w = templateWords(p.vue);
          const own = rulesOf(p);
          const all = parts.flatMap(rulesOf);
          const matches = (r) => {
            const cls = lastClasses(r);
            return cls.length > 0 && cls.every((c) => w.has(c) || (p.dynamic && p.dynamic.test(c)));
          };
          // 1) fayldagi har bir sinfli qoida shu komponent shablonida (yoki hujjatlangan istisno) bor
          for (const r of own) {
            const cls = lastClasses(r);
            if (!cls.length) { continue; } // @keyframes qadamlari
            expect(cls.every((c) => w.has(c) || (p.dynamic && p.dynamic.test(c)) || (p.allow && p.allow.test(c))), r).toBe(true);
          }
          // 2) shablon ishlatadigan har bir qoida (boshqa fayllarda bor bo'lsa ham) shu faylda ham bor
          for (const r of all) { if (matches(r)) { expect(own, r).toContain(r); } }
          // 3) scoped @keyframes nomi har faylda alohida qayta yoziladi: animation ishlatuvchi fayl o'z keyframes'ini ham olib yuradi
          const text = fs.readFileSync(path.join(ROOT, p.css), 'utf8');
          for (const m of text.matchAll(/animation:\s*([\w-]+)/g)) { expect(text, m[1]).toMatch(new RegExp('@keyframes\\s+' + m[1] + '\\b')); }
        });
      }
    });
  }
});

function templateWords(vueFile) {
  const { template } = parseComponent(fs.readFileSync(path.join(ROOT, vueFile), 'utf8'));
  return new Set((template ? template.content : '').match(/[A-Za-z_][\w-]*/g) || []);
}
// "ctx|selektor|decl" -> oxirgi (scope qo'yiladigan) murakkab selektordagi sinflar; ::v-deep dan oldingi qism
function lastClasses(rule) {
  const [ctx, sel] = rule.split('|');
  if (/keyframes/.test(ctx)) { return []; }
  const before = sel.split('::v-deep')[0].trim();
  const parts = before.split(/\s*[>+~]\s*|\s+/);
  return (parts[parts.length - 1].match(/\.[\w-]+/g) || []).map((c) => c.slice(1));
}
