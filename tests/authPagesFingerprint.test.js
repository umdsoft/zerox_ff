import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Vue from 'vue';

// wave D: auth sahifalari (OTP/PIN/validatsiya/redirect) xavfsizlik-sezgir — ularni mixin'larga bo'lish KOD O'ZGARISHSIZ bo'lishi shart.
// Fixture: HAR BIR computed/method/watch/hook manbasining normallashtirilgan SHA-1 (bo'lishdan OLDINGI holat). Kod ataylab
// o'zgarsa: `UPDATE_FP=1 npx vitest run tests/authPagesFingerprint.test.js` (diff'ni ko'zdan kechiring!).
const FIXTURE = path.join(__dirname, 'fixtures', 'authPagesFingerprint.json');
// `{ } ;` olib tashlanadi: faqat `curly`/format (qavs qo'shish) farqi e'tiborga olinmaydi; mantiq farqi esa hash'ni o'zgartiradi.
const norm = (f) => String(f).replace(/__vite_ssr_import_[0-9]+__/g, 'IMP').replace(/[{};]/g, '').replace(/\s+/g, ' ');
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

function fingerprint(page) {
  const o = Vue.extend(page).options;
  const out = {};
  for (const sec of ['computed', 'methods', 'watch']) {
    for (const k of Object.keys(o[sec] || {}).sort()) {
      const v = o[sec][k];
      out[sec + '.' + k] = sha(norm(typeof v === 'function' ? v : JSON.stringify(Object.keys(v))));
    }
  }
  for (const h of ['beforeCreate', 'created', 'mounted', 'beforeDestroy', 'destroyed']) {
    if (o[h]) { out['hook.' + h] = sha(o[h].map(norm).join('|')); }
  }
  out['props'] = sha(JSON.stringify(Object.keys(o.props || {})));
  out['dataKeys'] = sha(JSON.stringify(Object.keys(typeof o.data === 'function' ? o.data.call(new Proxy({}, { get: () => () => ({}) })) : {}).sort()));
  return out;
}

const srcDir = process.env.FP_OLD_DIR ? process.env.FP_OLD_DIR : '../pages/auth';
// VUE_TEST_RENDER=1 rejimida shablon buble bilan kompilyatsiya qilinadi (`?.` ni tushunmaydi) — bu test faqat <script> rejimida.
const SCRIPT_ONLY = !process.env.VUE_TEST_RENDER;
const Login = !SCRIPT_ONLY ? {} : (await import(/* @vite-ignore */ `${srcDir}/login.vue`)).default;
const Register = !SCRIPT_ONLY ? {} : (await import(/* @vite-ignore */ `${srcDir}/register.vue`)).default;
const current = { login: fingerprint(Login), register: fingerprint(Register) };

describe.skipIf(!SCRIPT_ONLY)('auth pages: logic fingerprint is unchanged by file splits', () => {
  if (process.env.UPDATE_FP) {
    it('writes fixture', () => {
      fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
      fs.writeFileSync(FIXTURE, JSON.stringify(current, null, 1));
      expect(true).toBe(true);
    });
    return;
  }
  const expected = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
  for (const name of ['login', 'register']) {
    it(name + ': same computed/methods/watch/hooks source', () => {
      expect(current[name]).toEqual(expected[name]);
    });
  }
});
