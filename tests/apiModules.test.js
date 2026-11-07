import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import * as billing from '@/api/billing';
import * as contracts from '@/api/contracts';
import * as debtPlan from '@/api/debtPlan';
import * as finance from '@/api/finance';
import * as home from '@/api/home';
import * as notifications from '@/api/notifications';
import * as publicPages from '@/api/publicPages';
import * as qarzDaftari from '@/api/qarzDaftari';
import * as user from '@/api/user';

// wave C: har bir api funksiyasi AYNAN bitta axios chaqiruvi qiladi — metod (`$get` vs `get`), URL va argumentlar tartibi
// `tests/fixtures/apiCalls.json` bilan qotirilgan. Yangi funksiya qo'shilsa: `UPDATE_API_FIXTURE=1 npx vitest run tests/apiModules.test.js`.
const MODULES = { billing, contracts, debtPlan, finance, home, notifications, publicPages, qarzDaftari, user };
const METHODS = ['get', 'post', 'put', 'patch', 'delete', '$get', '$post', '$put', '$patch', '$delete'];

function record(fn) {
  const calls = [];
  const axios = {};
  METHODS.forEach((m) => { axios[m] = (...a) => { calls.push({ method: m, args: a }); return Promise.resolve('ok'); }; });
  const placeholders = Array.from({ length: Math.max(0, fn.length - 1) }, (_, i) => `P${i + 1}`);
  fn(axios, ...placeholders);
  return calls;
}

function snapshot() {
  const out = {};
  for (const [mod, ns] of Object.entries(MODULES)) {
    for (const [name, fn] of Object.entries(ns)) {
      if (typeof fn !== 'function') continue;
      out[`${mod}.${name}`] = record(fn);
    }
  }
  return out;
}

const FIXTURE = path.join(__dirname, 'fixtures', 'apiCalls.json');

describe('api modules: method + URL + argument order are pinned', () => {
  it('every exported function makes exactly one axios call', () => {
    for (const [name, calls] of Object.entries(snapshot())) expect(calls, name).toHaveLength(1);
  });

  it('matches tests/fixtures/apiCalls.json', () => {
    const snap = snapshot();
    if (process.env.UPDATE_API_FIXTURE) fs.writeFileSync(FIXTURE, JSON.stringify(snap, null, 1) + '\n');
    expect(JSON.parse(fs.readFileSync(FIXTURE, 'utf8'))).toEqual(JSON.parse(JSON.stringify(snap)));
  });

  it('get-style functions return the axios promise untouched', async () => {
    const axios = { $get: () => Promise.resolve('data'), get: () => Promise.resolve('resp') };
    expect(await user.getMe(axios)).toBe('data');
  });
});
