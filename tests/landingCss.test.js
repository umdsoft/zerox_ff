import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { compiledRules } from './helpers/cssRules';

// wave D: LandingPage stillari (hammasi `.download-*`) LandingDownload'ga ko'chdi — kompilyatsiya qilingan qoidalar to'plami
// (kontekst|selektor|deklaratsiyalar) HEAD bilan AYNAN bir xil bo'lishi shart. Fixture HEAD'dagi LandingPage.vue'dan olingan.
const FIXTURE = path.join(__dirname, 'fixtures', 'css', 'landing.json');
const read = (p) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex');

describe('landing css rule set', () => {
  const rules = [...compiledRules(read('components/landing/LandingDownload.vue'))];
  if (process.env.UPDATE_CSS) {
    it('writes fixture from the file given in CSS_SRC', () => {
      const src = fs.readFileSync(process.env.CSS_SRC, 'utf8');
      const r = compiledRules(src);
      fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
      fs.writeFileSync(FIXTURE, JSON.stringify({ count: r.length, rules: r.map(sha) }, null, 1));
      expect(r.length).toBeGreaterThan(50);
    });
    return;
  }
  it('same ordered rule list as the original LandingPage', () => {
    const exp = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
    expect(rules.length).toBe(exp.count);
    expect(rules.map(sha)).toEqual(exp.rules);
  });
  it('LandingPage itself no longer carries styles; no other landing section has styles', () => {
    expect(compiledRules(read('components/LandingPage.vue'))).toEqual([]);
    for (const n of ['Hero', 'Modules', 'Features', 'HowItWorks', 'Pricing', 'Cta', 'Footer']) {
      expect(compiledRules(read(`components/landing/Landing${n}.vue`))).toEqual([]);
    }
  });
  it('download section style is scoped', () => {
    expect(read('components/landing/LandingDownload.vue')).toMatch(/<style lang="scss" scoped>/);
  });
});
