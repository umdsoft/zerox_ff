import { describe, it, expect, vi } from 'vitest';
import { createVm } from './helpers/mountOptions';

vi.mock('vue-ads-pagination', () => ({ default: { name: 'VueAdsPagination', render: () => null } }));

import DebtList from '@/pages/debt-list/index.vue';
import CreditList from '@/pages/credit-list/index.vue';
import Expired from '@/pages/expired/_type/index.vue';
import Hisobot from '@/pages/hisobot/_type/index.vue';
import Near from '@/pages/near-expiration/_type/index.vue';
import NearNotif from '@/pages/near-expiration-creditor-notification/index.vue';

// Characterization (wave C, contractListMixin): so'rov URL/config tartibi, javobni qo'llash, xato toast, qidiruv, fayl nomi.

const LIST = { data: [{ id: 1, creditor_name: 'Ali', debitor_name: 'Bobur', number: 'N-1', amount: 100, creditor_uid: 'c1', debitor_uid: 'd1' }], count: 7, act: 3, pass: 4 };
const EXP = { data: [
  { id: 1, creditor_name: 'Ali', debitor_name: 'Bobur', number: 'N-1', amount: 100, creditor_uid: 'c1', debitor_uid: 'd1' },
  { id: 2, creditor_name: 'Karim', debitor_name: 'Sanjar', number: 'X-2', amount: 2500, creditor_uid: 'c2', debitor_uid: 'd2' },
] };

function make(Page, { params = {}, query = {} } = {}) {
  const $get = vi.fn((url) => Promise.resolve(url.includes('/exp-') ? EXP : LIST));
  const $toast = { error: vi.fn() };
  const vm = createVm(Page, {
    mocks: {
      $axios: { $get },
      $toast,
      $route: { params, query },
      $t: (k) => k,
      $fioMatch: (name, q) => name.includes(q),
      $auth: { loggedIn: true, user: { is_active: 1 } },
      $store: { commit: vi.fn() },
      $router: { push: vi.fn() },
      localePath: (x) => x,
    },
  });
  return { vm, $get, $toast };
}

describe('contract list pages: getContracts()', () => {
  it('debt-list: debitor, no config, act/pass set', async () => {
    const { vm, $get } = make(DebtList);
    await vm.getContracts();
    expect($get.mock.calls).toEqual([
      ['/contract/return?type=debitor&page=1&limit=10&start=0&end=0', undefined],
      ['/contract/exp-return?type=debitor', undefined],
    ]);
    expect([vm.contracts, vm.exportss, vm.length, vm.act, vm.pass]).toEqual([LIST.data, EXP.data, 7, 3, 4]);
  });

  it('credit-list: creditor, { silent: true } on both calls', async () => {
    const { vm, $get } = make(CreditList);
    vm.page = 2; vm.limit = 20; vm.sortDate = ['2026-01-01', ''];
    await vm.getContracts();
    expect($get.mock.calls).toEqual([
      ['/contract/return?type=creditor&page=3&limit=20&start=2026-01-01&end=0', { silent: true }],
      ['/contract/exp-return?type=creditor', { silent: true }],
    ]);
    expect([vm.length, vm.act, vm.pass]).toEqual([7, 3, 4]);
  });

  it('expired: type from route, no act/pass, 429 -> no toast', async () => {
    const { vm, $get, $toast } = make(Expired, { params: { type: 'debitor' } });
    await vm.getContracts();
    expect($get.mock.calls).toEqual([
      ['/contract/expired?type=debitor&page=1&limit=10&start=0&end=0', undefined],
      ['/contract/exp-expired?type=debitor', undefined],
    ]);
    expect([vm.contracts, vm.exportss, vm.length]).toEqual([LIST.data, EXP.data, 7]);
    expect(vm.act).toBeUndefined();
    $get.mockRejectedValueOnce({ response: { status: 429 } });
    await vm.getContracts();
    expect($toast.error).not.toHaveBeenCalled();
    $get.mockRejectedValueOnce({ response: { status: 500 } });
    await vm.getContracts();
    expect($toast.error).toHaveBeenCalledWith('errors.loadFailed');
  });

  it('hisobot: status in both URLs, act/pass set, loadFailed toast', async () => {
    const { vm, $get, $toast } = make(Hisobot, { params: { type: 'creditor' } });
    vm.sortDate = ['a', 'b'];
    await vm.getContracts();
    expect($get.mock.calls).toEqual([
      ['/contract/report?type=creditor&status=all&page=1&limit=10&start=a&end=b', undefined],
      ['/contract/exp-report?type=creditor&status=all&start=a&end=b', undefined],
    ]);
    expect([vm.act, vm.pass, vm.length]).toEqual([3, 4, 7]);
    $get.mockRejectedValueOnce(new Error('x'));
    await vm.getContracts();
    expect($toast.error).toHaveBeenCalledWith('errors.loadFailed');
    vm.changeStatus('active');
    expect([vm.status, vm.page]).toEqual(['active', 0]);
  });

  it('near-expiration: day/currency from query, a1.a42 toast', async () => {
    const { vm, $get, $toast } = make(Near, { params: { type: 'debitor' }, query: { day: '5', type: 'USD' } });
    await vm.getContracts();
    expect($get.mock.calls).toEqual([
      ['/contract/near?type=debitor&day=5&page=1&limit=10&currency=USD', undefined],
      ['/contract/exp-near?type=debitor&day=5&currency=USD', undefined],
    ]);
    $get.mockRejectedValueOnce(new Error('x'));
    await vm.getContracts();
    expect($toast.error).toHaveBeenCalledWith('a1.a42');
  });

  it('near-expiration-creditor-notification: creditor, act/pass set, a1.a42 toast', async () => {
    const { vm, $get, $toast } = make(NearNotif, { query: { type: 'UZS' } });
    await vm.getContracts();
    expect($get.mock.calls).toEqual([
      ['/contract/near-notification?type=creditor&page=1&limit=10', undefined],
      ['/contract/exp-near?type=creditor&currency=UZS', undefined],
    ]);
    expect([vm.act, vm.pass, vm.length]).toEqual([3, 4, 7]);
    $get.mockRejectedValueOnce(new Error('x'));
    await vm.getContracts();
    expect($toast.error).toHaveBeenCalledWith('a1.a42');
  });
});

describe('contract list pages: search / filename / modal', () => {
  it('displayedContracts searches the page-specific name field', async () => {
    const run = async (Page, ctx, q) => {
      const { vm } = make(Page, ctx);
      await vm.getContracts();
      vm.localSearchQuery = q;
      return vm.displayedContracts.map((c) => c.id);
    };
    expect(await run(DebtList, {}, 'ali')).toEqual([1]);       // creditor_name
    expect(await run(DebtList, {}, 'bobur')).toEqual([]);       // debitor_name NOT searched
    expect(await run(CreditList, {}, 'bobur')).toEqual([1]);    // debitor_name
    expect(await run(CreditList, {}, 'ali')).toEqual([]);
    expect(await run(Expired, { params: { type: 'creditor' } }, 'karim')).toEqual([2]); // creditor || debitor
    expect(await run(Hisobot, { params: { type: 'creditor' } }, 'x-2')).toEqual([2]);   // number
    expect(await run(Near, { params: { type: 'creditor' } }, '2500')).toEqual([2]);     // amount
    expect(await run(NearNotif, {}, 'sanjar')).toEqual([2]);    // debitor || creditor
  });

  it('notification page: plain includes (no $fioMatch)', async () => {
    const { vm } = make(NearNotif);
    vm.$fioMatch = vi.fn(() => true);
    vm.exportss = EXP.data;
    vm.localSearchQuery = 'zzz';
    expect(vm.displayedContracts).toEqual([]);
    expect(vm.$fioMatch).not.toHaveBeenCalled();
  });

  it('mapped rows get cuid/duid; displayedLength follows search', async () => {
    const { vm } = make(DebtList);
    await vm.getContracts();
    expect(vm.displayedLength).toBe(7);
    vm.localSearchQuery = 'ali';
    expect(vm.displayedContracts[0]).toMatchObject({ cuid: 'c1', duid: 'd1' });
    expect(vm.displayedLength).toBe(1);
  });

  it('excel file names', () => {
    const d = new Date().toLocaleString().slice(0, 10);
    expect(make(DebtList).vm.contractExcelFileName('csv')).toBe(`Berilgan qarz (debitor) ${d}.csv`);
    expect(make(DebtList).vm.contractExcelFileName()).toBe(`Berilgan qarz (debitor) ${d}.xlsx`);
    expect(make(CreditList).vm.contractExcelFileName('xlsx')).toBe(`Olingan qarz (kreditor) ${d}.xlsx`);
    expect(make(NearNotif).vm.contractExcelFileName('xlsx')).toBe(`Muddati oz qolgan (kreditor) ${d}.xlsx`);
    expect(make(Expired, { params: { type: 'debitor' } }).vm.contractExcelFileName('csv')).toBe(`Muddati o'tgan (debitor) ${d}.xlsx`);
    expect(make(Hisobot, { params: { type: 'creditor' } }).vm.contractExcelFileName()).toBe(`Hisobot (kreditor) ${d}.xlsx`);
    expect(make(Near, { params: { type: 'creditor' } }).vm.contractExcelFileName()).toBe(`Muddati oz qolgan (kreditor) ${d}.xlsx`);
  });

  it('modal + date search + pagination', async () => {
    const { vm } = make(DebtList);
    vm.sortModal = true;
    vm.searchDateFunction();
    expect(vm.sortModal).toBe(false);
    vm.viewFullItem({ id: 9 });
    expect([vm.viewModal, vm.viewData]).toEqual([true, { id: 9 }]);
    vm.pageChange(4);
    expect(vm.page).toBe(4);
  });

  it('party helpers (isCreditor based) on expired page', () => {
    const { vm } = make(Expired, { params: { type: 'creditor' } });
    expect(vm.getPartyUid({ duid: 'd', cuid: 'c' })).toBe('d');
    expect(vm.getPartyFullName({ d_last_name: 'A', d_first_name: 'B' })).toBe('A B');
    const { vm: vm2 } = make(Expired, { params: { type: 'debitor' } });
    expect(vm2.getPartyName({ creditor_name: 'C', debitor_name: 'D' })).toBe('C');
    expect(vm2.getPartyFullName({ c_last_name: 'X', c_first_name: 'Y', c_middle_name: 'Z' })).toBe('X Y Z');
  });
});
