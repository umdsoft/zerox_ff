import { describe, it, expect, vi } from 'vitest';
import { createVm } from './helpers/mountOptions';
import {
  contractRoleOf, contractActionError, roleDeniedKey, ROLE_LENDER, ROLE_BORROWER,
} from '@/utils/contractRole';
import notificationMixin from '@/mixins/notificationMixin';
import DebtExtendNotification from '@/components/notification_types/debt-extend/debt-extend.vue';
import ContractActionLayout from '@/components/contract/ContractActionLayout.vue';
import uz from '@/lang/uz';
import kr from '@/lang/kr';
import ru from '@/lang/ru';
import en from '@/lang/en';
import kaa from '@/lang/kaa';

// 07.11 backend: contracts.debitor = QARZ BERUVCHI (lender), contracts.creditor = QARZ OLUVCHI (borrower).
const LENDER = 10;
const BORROWER = 20;
const contract = { id: 5, debitor: LENDER, creditor: BORROWER };
const fail = (status, data) => ({ response: { status, data } });

describe('contractRoleOf', () => {
  it('debitor = lender, creditor = borrower (number/string ids, object ids)', () => {
    expect(contractRoleOf(contract, LENDER)).toBe(ROLE_LENDER);
    expect(contractRoleOf(contract, String(BORROWER))).toBe(ROLE_BORROWER);
    expect(contractRoleOf({ debitor: { _id: '10' }, creditor: { id: 20 } }, 10)).toBe(ROLE_LENDER);
    expect(contractRoleOf({ debitor: { _id: '10' }, creditor: { id: 20 } }, '20')).toBe(ROLE_BORROWER);
  });
  it('not a party / missing data -> null', () => {
    expect(contractRoleOf(contract, 99)).toBe(null);
    expect(contractRoleOf(null, LENDER)).toBe(null);
    expect(contractRoleOf(contract, null)).toBe(null);
    expect(contractRoleOf({}, LENDER)).toBe(null);
  });
});

describe('roleDeniedKey', () => {
  it.each([
    [LENDER, ROLE_LENDER, null],
    [BORROWER, ROLE_BORROWER, null],
    [BORROWER, ROLE_LENDER, 'errors.only_lender'],
    [LENDER, ROLE_BORROWER, 'errors.only_borrower'],
    [99, ROLE_LENDER, 'errors.not_a_party'],
  ])('user %s, required %s -> %s', (uid, role, key) => {
    expect(roleDeniedKey(contract, uid, role)).toBe(key);
  });
  it('no requirement or contract not loaded -> null', () => {
    expect(roleDeniedKey(contract, 99, '')).toBe(null);
    expect(roleDeniedKey(null, 99, ROLE_LENDER)).toBe(null);
  });
});

describe('contractActionError (msg | message keys)', () => {
  it.each([
    [fail(403, { code: 'FORBIDDEN', msg: 'only-borrower' }), 'errors.only_borrower', false],
    [fail(403, { code: 'FORBIDDEN', msg: 'only-lender' }), 'errors.only_lender', false],
    [fail(403, { success: false, message: 'only-lender' }), 'errors.only_lender', false],
    [fail(400, { msg: 'invalid-end-date' }), 'errors.invalid_end_date', false],
    [fail(400, { message: 'invalid-end-date' }), 'errors.invalid_end_date', false],
    [fail(400, { msg: 'invalid-act-type' }), 'errors.bad_request', false],
    [fail(400, { message: 'invalid-stype' }), 'errors.bad_request', false],
    [fail(409, { message: 'already-processed' }), 'errors.already_processed', true],
    [fail(409, {}), 'errors.already_processed', true],
    [fail(403, { msg: 'creator-cannot-approve' }), 'errors.creator_cannot_approve', true],
    [fail(403, { msg: 'notification-type-mismatch' }), 'errors.notification_mismatch', true],
    [fail(403, { message: 'notification-act-mismatch' }), 'errors.notification_mismatch', true],
    [fail(403, { message: 'act-type-mismatch' }), 'errors.notification_mismatch', true],
    [fail(400, { message: 'act-required' }), 'errors.notification_mismatch', true],
    [{ success: false, msg: 'not-con-suc' }, 'errors.already_processed', true],
  ])('%j -> %s', (err, key, refresh) => {
    expect(contractActionError(err)).toMatchObject({ key, refresh });
  });
  it('unknown codes / network errors / prototype keys -> null', () => {
    expect(contractActionError(fail(403, { code: 'OFERTA_REQUIRED' }))).toBe(null);
    expect(contractActionError(fail(500, {}))).toBe(null);
    expect(contractActionError(fail(400, { msg: 'constructor' }))).toBe(null);
    expect(contractActionError({ isAxiosError: true, message: 'Network Error' })).toBe(null);
    expect(contractActionError(null)).toBe(null);
  });
});

describe('lang: every new key exists in all 5 locales', () => {
  const keys = ['only_lender', 'only_borrower', 'invalid_end_date', 'already_processed', 'creator_cannot_approve', 'notification_mismatch', 'not_a_party', 'bad_request'];
  it.each([['uz', uz], ['kr', kr], ['ru', ru], ['en', en], ['kaa', kaa]])('%s', (_, lang) => {
    keys.forEach((k) => {
      expect(typeof lang.errors[k]).toBe('string');
      expect(lang.errors[k].length).toBeGreaterThan(3);
    });
  });
  it('uz texts match the requested wording', () => {
    expect(uz.errors.only_lender).toBe('Bu amalni faqat qarz beruvchi bajara oladi');
    expect(uz.errors.only_borrower).toBe('Bu amalni faqat qarz oluvchi bajara oladi');
    expect(uz.errors.invalid_end_date).toBe("Muddat kelajakdagi sana bo'lishi kerak");
    expect(uz.errors.already_processed).toBe("Bu so'rov allaqachon ko'rib chiqilgan");
    expect(uz.errors.creator_cannot_approve).toBe("O'zingiz yaratgan shartnomani tasdiqlay olmaysiz");
  });
});

function notifVm(options, { userId, item, axios = {} }) {
  const toast = { success: vi.fn(), error: vi.fn() };
  const getNotifications = vi.fn();
  const vm = createVm(options, {
    propsData: { item, getNotifications },
    mocks: {
      $t: (k) => k, $toast: toast, $auth: { user: { id: userId } }, $i18n: { locale: 'uz' },
      $axios: { post: vi.fn(), put: vi.fn(), $put: vi.fn(), ...axios }, $oferta: null,
    },
  });
  return { vm, toast, getNotifications };
}

describe('notificationMixin roles', () => {
  const item = { id: 77, debitor: LENDER, creditor: BORROWER, reciver: LENDER, contract: 5, act: 9, csender: BORROWER };
  it('isCurrentUserLender only for contracts.debitor', () => {
    expect(notifVm({ mixins: [notificationMixin] }, { userId: LENDER, item }).vm.isCurrentUserLender).toBe(true);
    expect(notifVm({ mixins: [notificationMixin] }, { userId: BORROWER, item }).vm.isCurrentUserLender).toBe(false);
  });
  it('canDecideContract is false for the contract creator', () => {
    expect(notifVm({ mixins: [notificationMixin] }, { userId: LENDER, item }).vm.canDecideContract).toBe(true);
    expect(notifVm({ mixins: [notificationMixin] }, { userId: BORROWER, item }).vm.canDecideContract).toBe(false);
    expect(notifVm({ mixins: [notificationMixin] }, { userId: BORROWER, item: { ...item, csender: undefined } }).vm.canDecideContract).toBe(true);
  });

  it('409 already-processed on repayment confirm -> localized toast + list refresh', async () => {
    const post = vi.fn(() => Promise.reject(fail(409, { success: false, message: 'already-processed' })));
    const { vm, toast, getNotifications } = notifVm({ mixins: [notificationMixin] }, { userId: LENDER, item, axios: { post } });
    await vm.fullReturn(77, 1);
    expect(post.mock.calls[0][0]).toBe('/notification/toliq-qaytarish/77');
    expect(toast.error).toHaveBeenCalledWith('errors.already_processed');
    expect(getNotifications).toHaveBeenCalledWith(77);
  });

  it('403 only-lender on partial confirm -> localized toast, no refresh', async () => {
    const post = vi.fn(() => Promise.reject(fail(403, { success: false, message: 'only-lender' })));
    const { vm, toast, getNotifications } = notifVm({ mixins: [notificationMixin] }, { userId: BORROWER, item, axios: { post } });
    await vm.partialReturn(77, 2);
    expect(toast.error).toHaveBeenCalledWith('errors.only_lender');
    expect(getNotifications).not.toHaveBeenCalled();
  });

  it('PUT /notification/success creator-cannot-approve and 200 not-con-suc', async () => {
    const put = vi.fn(() => Promise.reject(fail(403, { success: false, msg: 'creator-cannot-approve' })));
    const a = notifVm({ mixins: [notificationMixin] }, { userId: BORROWER, item, axios: { put } });
    await a.vm.confirmContract(77, 2);
    expect(a.toast.error).toHaveBeenCalledWith('errors.creator_cannot_approve');

    const put2 = vi.fn(() => Promise.resolve({ status: 200, data: { success: false, msg: 'not-con-suc' } }));
    const b = notifVm({ mixins: [notificationMixin] }, { userId: LENDER, item, axios: { put: put2 } });
    await b.vm.confirmContractAsDebitor(77, 2);
    expect(b.toast.error).toHaveBeenCalledWith('errors.already_processed');
    expect(b.toast.success).not.toHaveBeenCalled();
    expect(b.getNotifications).toHaveBeenCalledWith(77);
  });

  it('time extension confirm: act-type-mismatch -> mismatch toast + refresh', async () => {
    const post = vi.fn(() => Promise.reject(fail(403, { success: false, message: 'act-type-mismatch' })));
    const { vm, toast, getNotifications } = notifVm(DebtExtendNotification, { userId: LENDER, item, axios: { post } });
    await vm.muddatUzaytirishQabul(77, 1);
    expect(post.mock.calls[0][0]).toBe('/notification/time/77');
    expect(toast.error).toHaveBeenCalledWith('errors.notification_mismatch');
    expect(getNotifications).toHaveBeenCalledWith(77);
  });
});

describe('ContractActionLayout requiredRole', () => {
  const mk = (userId, requiredRole) => createVm(ContractActionLayout, {
    propsData: { contract, title: 't', requiredRole },
    mocks: { $auth: { user: { id: userId } }, $i18n: { locale: 'uz' }, $formatDate: () => '' },
  });
  it('form hidden (denied key) for the wrong role', () => {
    expect(mk(LENDER, ROLE_LENDER).deniedKey).toBe(null);
    expect(mk(BORROWER, ROLE_LENDER).deniedKey).toBe('errors.only_lender');
    expect(mk(LENDER, ROLE_BORROWER).deniedKey).toBe('errors.only_borrower');
    expect(mk(LENDER, '').deniedKey).toBe(null);
  });
});
