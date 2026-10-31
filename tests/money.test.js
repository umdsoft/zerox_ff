import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { createRequire } from 'module';
import { round2, toCents } from '@/utils/money';
import { allocatePayment } from '@/utils/debtAllocation';

const require = createRequire(import.meta.url);
const backend = require('../../backend/utils/money.js');

const SAMPLES = [1.005, 2.675, 1.255, 0.1 + 0.2, 100.005, 1234.5678, -1.005, 0, NaN, Infinity, -Infinity, '1.005', '', null, undefined, 'abc', 8.345, 0.615];

describe.skipIf(!fs.existsSync(new URL('../../backend/utils/money.js', import.meta.url)))('money parity with backend utils/money', () => {
  it('round2 / toCents match backend', () => {
    for (const v of SAMPLES) {
      expect(round2(v)).toBe(backend.round2(v));
      expect(toCents(v)).toBe(backend.toCents(v));
    }
  });
  it('pinned values', () => {
    expect(toCents(1.005)).toBe(101);
    expect(round2(1.005)).toBe(1.01);
    expect(toCents(NaN)).toBe(0);
    expect(toCents(Infinity)).toBe(0);
  });
  it('allocation preview uses backend semantics for .xx5 input', () => {
    const debts = [{ id: 1, remaining_amount: 1.005, currency: 'USD', status: 'active', interest_rate: 0, due_date: null, start_date: '2026-01-01' }];
    const r = allocatePayment(debts, 1.005, { today: '2026-10-31' });
    expect(r.allocations.map((a) => a.pay)).toEqual([1.01]);
  });
});
