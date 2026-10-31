import { describe, it, expect } from 'vitest';
import * as C from '@/api/contracts';
import * as F from '@/api/finance';

const rec = () => {
  const calls = [];
  const mk = (m) => (...a) => { calls.push([m, ...a]); return Promise.resolve({ m }); };
  return { calls, $get: mk('$get'), get: mk('get'), post: mk('post'), put: mk('put'), delete: mk('delete') };
};

describe('api/contracts keeps URLs and configs of the pages', () => {
  it('debt-list / credit-list', async () => {
    const ax = rec();
    await C.getReturnList(ax, { type: 'debitor', page: 1, limit: 10, start: '0', end: '0' });
    await C.getReturnExport(ax, { type: 'debitor' });
    await C.getReturnList(ax, { type: 'creditor', page: 2, limit: 10, start: 'a', end: 'b' }, { silent: true });
    await C.getReturnExport(ax, { type: 'creditor' }, { silent: true });
    expect(ax.calls).toEqual([
      ['$get', '/contract/return?type=debitor&page=1&limit=10&start=0&end=0', undefined],
      ['$get', '/contract/exp-return?type=debitor', undefined],
      ['$get', '/contract/return?type=creditor&page=2&limit=10&start=a&end=b', { silent: true }],
      ['$get', '/contract/exp-return?type=creditor', { silent: true }],
    ]);
  });
  it('expired / near / report / near-notification', async () => {
    const ax = rec();
    await C.getExpiredList(ax, { type: 'debitor', page: 1, limit: 5, start: '0', end: '0' });
    await C.getExpiredExport(ax, { type: 'debitor' });
    await C.getNearList(ax, { type: 'creditor', day: '3', page: 1, limit: 5, currency: '' });
    await C.getNearExport(ax, { type: 'creditor', day: '3', currency: 'USD' });
    await C.getReportList(ax, { type: 'debitor', status: 2, page: 1, limit: 5, start: '0', end: '0' });
    await C.getReportExport(ax, { type: 'debitor', status: 2, start: '0', end: '0' });
    await C.getNearNotificationList(ax, { type: 'creditor', page: 1, limit: 5 });
    await C.getNearExportByCurrency(ax, { type: 'creditor', currency: '' });
    expect(ax.calls.map((c) => c[1])).toEqual([
      '/contract/expired?type=debitor&page=1&limit=5&start=0&end=0',
      '/contract/exp-expired?type=debitor',
      '/contract/near?type=creditor&day=3&page=1&limit=5&currency=',
      '/contract/exp-near?type=creditor&day=3&currency=USD',
      '/contract/report?type=debitor&status=2&page=1&limit=5&start=0&end=0',
      '/contract/exp-report?type=debitor&status=2&start=0&end=0',
      '/contract/near-notification?type=creditor&page=1&limit=5',
      '/contract/exp-near?type=creditor&currency=',
    ]);
  });
  it('returns the axios promise unchanged', async () => {
    const ax = rec();
    await expect(C.getReturnList(ax, { type: 'x', page: 1, limit: 1, start: 0, end: 0 })).resolves.toEqual({ m: '$get' });
  });
});

describe('api/finance keeps URLs, methods and raw get/post (full response)', () => {
  it('payments', async () => {
    const ax = rec();
    await F.listScheduledPayments(ax);
    await F.listExpenseCategories(ax);
    await F.updateScheduledPayment(ax, 7, { a: 1 });
    await F.createScheduledPayment(ax, { a: 1 });
    await F.confirmScheduledPayment(ax, 7);
    await F.skipScheduledPayment(ax, 7);
    await F.deleteScheduledPayment(ax, 7);
    await F.getScheduledPaymentHistory(ax, 7);
    expect(ax.calls).toEqual([
      ['get', '/finance/scheduled-payments'],
      ['get', '/finance/expenses/categories'],
      ['put', '/finance/scheduled-payments/7', { a: 1 }],
      ['post', '/finance/scheduled-payments', { a: 1 }],
      ['post', '/finance/scheduled-payments/7/confirm'],
      ['post', '/finance/scheduled-payments/7/skip'],
      ['delete', '/finance/scheduled-payments/7'],
      ['get', '/finance/scheduled-payments/7/history'],
    ]);
  });
  it('incomes', async () => {
    const ax = rec();
    await F.listScheduledIncomes(ax);
    await F.listIncomeCategories(ax);
    await F.updateScheduledIncome(ax, 9, { b: 2 });
    await F.createScheduledIncome(ax, { b: 2 });
    await F.confirmScheduledIncome(ax, 9);
    await F.skipScheduledIncome(ax, 9);
    await F.deleteScheduledIncome(ax, 9);
    await F.getScheduledIncomeHistory(ax, 9);
    expect(ax.calls).toEqual([
      ['get', '/finance/scheduled-incomes'],
      ['get', '/finance/incomes/categories'],
      ['put', '/finance/scheduled-incomes/9', { b: 2 }],
      ['post', '/finance/scheduled-incomes', { b: 2 }],
      ['post', '/finance/scheduled-incomes/9/confirm'],
      ['post', '/finance/scheduled-incomes/9/skip'],
      ['delete', '/finance/scheduled-incomes/9'],
      ['get', '/finance/scheduled-incomes/9/history'],
    ]);
  });
});
