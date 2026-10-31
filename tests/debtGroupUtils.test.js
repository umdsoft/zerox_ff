import { describe, it, expect, vi } from 'vitest';
import { createVm } from './helpers/mountOptions';
import { actBtnClass, isForgiven, isOpen, isOverdue, getPaidPercent } from '@/utils/debtGroupRows';
import { DEBT_GROUP_TEXTS, getDebtGroupTexts } from '@/utils/debtGroupTexts';
import Header from '@/components/debt-group/DebtGroupHeader.vue';
import Mirror from '@/components/debt-group/DebtGroupMirrorModal.vue';
import Complaint from '@/components/debt-group/DebtGroupComplaintModal.vue';
import ShopModal from '@/components/debt-group/DebtGroupShopDebtModal.vue';
import List from '@/components/debt-group/DebtGroupList.vue';

describe('debtGroupRows', () => {
  it('isOpen / isForgiven', () => {
    expect(isOpen({ status: 'active' })).toBe(true);
    expect(isOpen({ status: 'overdue' })).toBe(true);
    expect(isOpen({ status: 'completed' })).toBe(false);
    expect(isOpen(null)).toBe(false);
    expect(isForgiven(null)).toBe(false);
    expect(isForgiven({ status: 'active' })).toBe(false);
    expect(isForgiven({ status: 'completed', payments: [{ notes: '__forgive__x' }] })).toBe(true);
    expect(isForgiven({ status: 'completed', notes: 'Qarz voz kechildi' })).toBe(true);
    expect(isForgiven({ status: 'completed', notes: 'ok' })).toBe(false);
  });
  it('isOverdue uses open status + due date', () => {
    const now = new Date('2026-10-31T00:00:00Z');
    expect(isOverdue({ status: 'active', due_date: '2026-10-01' }, now)).toBe(true);
    expect(isOverdue({ status: 'active', due_date: '2026-12-01' }, now)).toBe(false);
    expect(isOverdue({ status: 'completed', due_date: '2020-01-01' }, now)).toBe(false);
    expect(isOverdue({ status: 'active' }, now)).toBe(false);
  });
  it('getPaidPercent', () => {
    expect(getPaidPercent({ amount: 0 })).toBe(0);
    expect(getPaidPercent({ amount: 1000, remaining_amount: 250 })).toBe(75);
    expect(getPaidPercent({ amount: 3, remaining_amount: 1 })).toBe(67);
    expect(getPaidPercent({ amount: 1000 })).toBe(100);
  });
  it('actBtnClass', () => {
    expect(actBtnClass('x', false)[1]).toBe('x');
    expect(actBtnClass('x', true)[1]).toContain('cursor-not-allowed');
  });
});

describe('debtGroupTexts', () => {
  it('locale fallback and key parity', () => {
    expect(getDebtGroupTexts('xx')).toBe(DEBT_GROUP_TEXTS.uz);
    expect(getDebtGroupTexts()).toBe(DEBT_GROUP_TEXTS.uz);
    const keys = Object.keys(DEBT_GROUP_TEXTS.uz).sort();
    for (const l of Object.keys(DEBT_GROUP_TEXTS)) expect(Object.keys(DEBT_GROUP_TEXTS[l]).sort()).toEqual(keys);
  });
});

function spy(vm) {
  const calls = [];
  vm.$emit = vi.fn((...a) => { calls.push(a); });
  return calls;
}

describe('debt-group child components: events', () => {
  it('header: addDebtLink builds link locally; actions emit', () => {
    const vm = createVm(Header, { propsData: { group: { name: 'Ali', phone: '+998901' }, texts: {} }, mocks: { localePath: (x) => x } });
    const calls = spy(vm);
    expect(vm.addDebtLink('lent')).toEqual({ name: 'finance-debts-add', query: { type: 'lent', name: 'Ali', phone: '+998901' } });
    vm.openActModal('pay'); vm.actDemand();
    expect(calls).toEqual([['open-act-modal', 'pay'], ['act-demand']]);
  });
  it('mirror modal: close proxy + ask events', () => {
    const vm = createVm(Mirror, { propsData: { mirrorDebt: {}, texts: {} } });
    const calls = spy(vm);
    vm.showMirror = false; vm.askMirrorForgive(); vm.askMirrorHide();
    expect(calls).toEqual([['close'], ['ask-mirror-forgive'], ['ask-mirror-hide']]);
  });
  it('complaint modal: sync proxies', () => {
    const vm = createVm(Complaint, { propsData: { complaintNoteValue: 'a', complaintReasonValue: 'r', texts: {} } });
    const calls = spy(vm);
    expect(vm.complaintNote).toBe('a');
    vm.complaintNote = 'b'; vm.complaintReason = 'x'; vm.showComplaint = false;
    expect(calls).toEqual([['update:complaintNoteValue', 'b'], ['update:complaintReasonValue', 'x'], ['close']]);
  });
  it('shop modal + list emit', () => {
    const s = createVm(ShopModal, { propsData: { shopDebt: {}, texts: {} } }); const sc = spy(s);
    s.showShopDebt = false; s.openComplaint();
    expect(sc).toEqual([['close'], ['open-complaint']]);
    const l = createVm(List, { propsData: { listItems: [], texts: {} } }); const lc = spy(l);
    l.onDebtClick({ id: 1 }); l.askRowDelete({ id: 2 });
    expect(lc).toEqual([['on-debt-click', { id: 1 }], ['ask-row-delete', { id: 2 }]]);
    expect(l.getPaidPercent({ amount: 10, remaining_amount: 5 })).toBe(50);
  });
});
