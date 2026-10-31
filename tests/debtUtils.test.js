import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { allocatePayment, ymdOf, todayTashkent, compareByDue, ORDER_RULE } from '@/utils/debtAllocation';
import {
  num, fmtSum, fmtMln, fmtPct, annuityPayment, annualFromMonthly, ymAdd, monthsFromMask, maskFromMonths,
  groupDigits, cleanMoney, debtFieldErrors, unwrap,
} from '@/utils/debtPlan';
import { isOpenDebt, isForgivenDebt, paidOfDebt, summarizeDebts } from '@/utils/debtSummary';

describe('debtAllocation (parity fixture shared with backend/mobile)', () => {
  const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, '../scripts/fixtures/debt_allocation_economic.json'), 'utf8'));
  it('has order rule economic_v1', () => expect(ORDER_RULE).toBe('economic_v1'));
  for (const c of fixture.cases) {
    it(c.name, () => {
      const r = allocatePayment(c.debts, c.amount, { today: fixture.today, ...(c.opts || {}) });
      expect({
        order: r.allocations.map((a) => a.debt.id),
        reasons: r.allocations.map((a) => a.reason),
        pays: r.allocations.map((a) => a.pay),
        paid: r.paid,
        total: r.total,
      }).toEqual(c.expected);
      expect(r.order_rule).toBe('economic_v1');
    });
  }
  it('todayTashkent is +5 offset', () => {
    expect(todayTashkent(Date.UTC(2026, 9, 31, 20, 0, 0))).toBe('2026-11-01');
    expect(todayTashkent(Date.UTC(2026, 9, 31, 18, 59, 0))).toBe('2026-10-31');
  });
  it('ymdOf / compareByDue are functions', () => {
    expect(typeof ymdOf).toBe('function');
    expect(typeof compareByDue).toBe('function');
  });
});

describe('debtPlan helpers', () => {
  it('num', () => {
    expect(num('1 234,5')).toBe(1234.5);
    expect(num('')).toBe(0);
    expect(num(null, 7)).toBe(7);
    expect(num('abc', 3)).toBe(3);
  });
  it('fmtSum rounds, groups, uses U+2212 minus', () => {
    expect(fmtSum(1234567.6)).toBe('1 234 568');
    expect(fmtSum(-1500)).toBe('−1 500');
    expect(fmtSum(null)).toBe('0');
  });
  it('fmtMln', () => {
    expect(fmtMln(8150000, 'uz')).toBe('8,15 mln');
    expect(fmtMln(8150000, 'en')).toBe('8.15M');
    expect(fmtMln(250000, 'ru')).toBe('250 тыс.');
    // Tuzatildi (wave B): avval '12 mln' qaytarardi
    expect(fmtMln(120000000, 'uz')).toBe('120 mln');
    expect(fmtMln(999, 'uz')).toBe('999');
    expect(fmtMln(100000000, 'uz')).toBe('100 mln');
    expect(fmtMln(250000000, 'en')).toBe('250M');
  });
  it('fmtPct', () => {
    expect(fmtPct(0.0375)).toBe('3,75');
    expect(fmtPct(0.0375, 2, 'en')).toBe('3.75');
    expect(fmtPct(0.1)).toBe('10');
  });
  it('annuity / annual', () => {
    expect(annuityPayment(1200, 0, 12)).toBe(100);
    expect(annuityPayment(0, 10, 12)).toBeNull();
    expect(Math.round(annuityPayment(1000000, 24, 12))).toBe(94560);
    expect(annualFromMonthly(0)).toBe(0);
  });
  it('ymAdd / masks', () => {
    expect(ymAdd('2026-11', 2)).toBe('2027-01');
    expect(ymAdd('2026-01', -1)).toBe('2025-12');
    expect(ymAdd('bad', 1)).toBeNull();
    expect(monthsFromMask(5)).toEqual([1, 3]);
    expect(maskFromMonths([1, 3])).toBe(5);
    expect(maskFromMonths(null)).toBe(0);
  });
  it('groupDigits / cleanMoney', () => {
    expect(groupDigits('1234567.5')).toBe('1 234 567.5');
    expect(groupDigits('-1000')).toBe('-1 000');
    expect(groupDigits(null)).toBe('');
    expect(cleanMoney('1 234,567')).toBe('1234.56');
    expect(cleanMoney('007')).toBe('7');
    expect(cleanMoney('12.5', 0)).toBe('12');
  });
  it('debtFieldErrors', () => {
    expect(debtFieldErrors({ termMonths: 601 })).toEqual({ termMonths: 'debt_plan.err.term_range' });
    expect(debtFieldErrors({ apr: 1000, cardMinPct: 101 })).toEqual({ apr: 'debt_plan.err.apr_range', cardMinPct: 'debt_plan.err.pct_range' });
    expect(debtFieldErrors({ excluded: true, termMonths: 9999 })).toEqual({});
    expect(debtFieldErrors({})).toEqual({});
  });
  it('unwrap', () => {
    expect(unwrap(null)).toBeNull();
    expect(unwrap({ success: false })).toBeNull();
    expect(unwrap({ success: true, data: { a: 1 } })).toEqual({ a: 1 });
  });
});

describe('debtSummary', () => {
  it('isOpenDebt', () => {
    expect(isOpenDebt({ status: 'active' })).toBe(true);
    expect(isOpenDebt({ status: 'overdue' })).toBe(true);
    expect(isOpenDebt({ status: 'completed' })).toBe(false);
    expect(isOpenDebt(null)).toBe(false);
  });
  it('isForgivenDebt', () => {
    expect(isForgivenDebt({ status: 'completed', payments: [{ notes: '__forgive__x' }] })).toBe(true);
    expect(isForgivenDebt({ status: 'completed', notes: 'Kechirilgan' })).toBe(true);
    expect(isForgivenDebt({ status: 'active', notes: 'Kechirilgan' })).toBe(false);
  });
  it('paidOfDebt caps at amount and ignores markers', () => {
    expect(paidOfDebt({ amount: 500, payments: [{ amount: 400 }, { amount: 240 }] })).toBe(500);
    expect(paidOfDebt({ amount: 500, payments: [{ amount: 100 }, { amount: 50, notes: '__forgive__' }] })).toBe(100);
    expect(paidOfDebt({ amount: 1000, remaining_amount: 300 })).toBe(700);
    expect(paidOfDebt({ paid_amount: '25' })).toBe(25);
    expect(paidOfDebt(null)).toBe(0);
  });
  it('summarizeDebts: per-currency rows, UZS before USD, empty -> zero UZS row', () => {
    expect(summarizeDebts([])).toEqual({
      rows: [{ currency: 'UZS', total: 0, paid: 0, left: 0, forgiven: 0 }], count: 0, openCount: 0, closedCount: 0, forgivenCount: 0,
    });
    const r = summarizeDebts([
      { currency: 'USD', amount: 100, remaining_amount: 40, status: 'active' },
      { amount: 1000, status: 'completed', notes: 'Kechirilgan', payments: [{ amount: 400 }] },
    ]);
    expect(r.rows.map((x) => x.currency)).toEqual(['UZS', 'USD']);
    expect(r.rows[0]).toEqual({ currency: 'UZS', total: 1000, paid: 400, left: 0, forgiven: 600 });
    expect(r.rows[1]).toEqual({ currency: 'USD', total: 100, paid: 60, left: 40, forgiven: 0 });
    expect([r.count, r.openCount, r.closedCount, r.forgivenCount]).toEqual([2, 1, 1, 1]);
  });
});
