import { describe, it, expect, vi } from 'vitest';
import { createVm } from './helpers/mountOptions';
import AddMember from '@/components/gap/GapAddMemberModal.vue';
import Settings from '@/components/gap/GapSettingsModal.vue';
import Remove from '@/components/gap/GapRemoveModal.vue';
import Restart from '@/components/gap/GapRestartModal.vue';
import Draft from '@/components/gap/GapMembersDraft.vue';
import Birthdays from '@/components/gap/GapBirthdays.vue';
import { isMainOrg, isCoOrg, formatThousands, canEditBirthday, fmtBirthday } from '@/utils/gapMembers';
import { getCoOrgTexts, getBirthdayTexts, getBirthdayMonths, COORG_TEXTS, BIRTHDAY_TEXTS } from '@/utils/gapTexts';

function spy(vm) {
  const calls = [];
  vm.$emit = vi.fn((...a) => { calls.push(a); });
  return calls;
}

describe('gap child components: events / v-model proxies', () => {
  it('add-member modal: v-model proxies emit update:*; showAddMember=false emits close', () => {
    const vm = createVm(AddMember, { propsData: { nameValue: 'a', uniformValue: true, newPhone: '', newAmount: '', busy: false } });
    const calls = spy(vm);
    expect(vm.newName).toBe('a');
    vm.newName = 'b';
    vm.newUniform = false;
    vm.showAddMember = false;
    vm.addMember();
    vm.onNewAmountInput({ x: 1 });
    vm.onPhoneInput({ y: 2 });
    expect(calls).toEqual([
      ['update:nameValue', 'b'], ['update:uniformValue', false], ['close'], ['add'], ['amount-input', { x: 1 }], ['phone-input', { y: 2 }],
    ]);
    expect(vm.formatThousands(1234567)).toBe(formatThousands(1234567));
  });

  it('settings / restart / remove modals emit', () => {
    const s = createVm(Settings, { propsData: { gap: {}, settingsForm: {} } }); const sc = spy(s);
    s.saveSettings(); s.onSettingsAmount('e'); s.showSettings = false;
    expect(sc).toEqual([['save'], ['amount-input', 'e'], ['close']]);
    const r = createVm(Restart, { propsData: { gap: {}, restartForm: {} } }); const rc = spy(r);
    r.submitRestart(); r.onRestartAmount('e'); r.showRestart = false;
    expect(rc).toEqual([['submit'], ['amount-input', 'e'], ['close']]);
    const d = createVm(Remove, {}); const dc = spy(d);
    d.removeGap(); d.showRemove = false;
    expect(dc).toEqual([['remove'], ['close']]);
  });

  it('draft members: order mode proxy + action emits', () => {
    const vm = createVm(Draft, { propsData: { gap: { organizer_id: 1, members: [] }, coOrgT: {}, modeValue: 'random' } });
    const calls = spy(vm);
    vm.orderMode = 'manual';
    vm.moveMember(2, -1); vm.askCoOrg({ id: 3 }, 'make'); vm.removeMember({ id: 4 }); vm.doShuffle(); vm.openAddMember(); vm.openSettings(); vm.setMemberAmount({ id: 5 }, 'ev');
    expect(calls).toEqual([
      ['update:modeValue', 'manual'], ['move', 2, -1], ['ask-coorg', { id: 3 }, 'make'], ['remove-member', { id: 4 }], ['shuffle'], ['add-member'], ['settings'], ['member-amount', { id: 5 }, 'ev'],
    ]);
    expect(vm.isMainOrg({ user_id: 1 })).toBe(true);
  });

  it('birthdays: open proxy, events, edit permission', () => {
    const vm = createVm(Birthdays, { propsData: {
      gap: { is_organizer: false }, myId: 7, bdTexts: {}, bdMonths: ['yanvar'], birthdays: [], bdEdit: {}, bdNew: {}, bdExtras: [], openValue: false,
    } });
    const calls = spy(vm);
    vm.bdOpen = true;
    vm.syncBirthdays(); vm.addExtra(); vm.removeExtra({ id: 1 }); vm.saveBirthday({ member_id: 2 });
    expect(calls).toEqual([['update:openValue', true], ['sync'], ['add-extra'], ['remove-extra', { id: 1 }], ['save-birthday', { member_id: 2 }]]);
    expect(vm.canEditBirthday({ user_id: 7 })).toBe(true);
    expect(vm.canEditBirthday({ user_id: 8 })).toBe(false);
    expect(vm.fmtBirthday({ birth_day: 5, birth_month: 1, birth_year: 1990 })).toBe('5-yanvar 1990');
  });
});

describe('gapMembers / gapTexts utils', () => {
  it('organizer helpers', () => {
    const gap = { organizer_id: 1, co_organizer_member_id: 9, co_organizer_id: 5 };
    expect(isMainOrg(gap, { user_id: 1 })).toBe(true);
    expect(isMainOrg(gap, { user_id: null })).toBe(false);
    expect(isMainOrg(null, { user_id: 1 })).toBe(false);
    expect(isCoOrg(gap, { id: 9, user_id: 99 })).toBe(true);        // member id wins
    expect(isCoOrg(gap, { id: 8, user_id: 5 })).toBe(false);
    expect(isCoOrg({ co_organizer_id: 5 }, { id: 8, user_id: 5 })).toBe(true);
    expect(isCoOrg({}, null)).toBe(false);
  });
  it('formatThousands / birthdays', () => {
    expect(formatThousands('')).toBe('');
    expect(formatThousands(null)).toBe('');
    expect(formatThousands(0)).toBe('');
    expect(formatThousands('abc')).toBe('');
    expect(formatThousands(1500000).replace(/\s/g, ' ')).toMatch(/^1 500 000$/);
    expect(canEditBirthday(null, 1, {})).toBe(false);
    expect(canEditBirthday({ is_organizer: true }, null, { user_id: 3 })).toBe(true);
    expect(fmtBirthday(null, [])).toBe('');
    expect(fmtBirthday({ birth_day: 5 }, ['yanvar'])).toBe('5-yanvar');
    expect(fmtBirthday({ birth_day: 5, birth_month: 99 }, ['yanvar'])).toBe('5-');
  });
  it('texts: locale fallback + months', () => {
    expect(getCoOrgTexts('xx')).toBe(COORG_TEXTS.uz);
    expect(getCoOrgTexts(undefined)).toBe(COORG_TEXTS.uz);
    expect(getBirthdayTexts('ru')).toBe(BIRTHDAY_TEXTS.ru);
    expect(Object.keys(BIRTHDAY_TEXTS).sort()).toEqual(['en', 'kaa', 'kr', 'ru', 'uz']);
    expect(getBirthdayMonths('ru')[0]).toBe('январь');
    expect(getBirthdayMonths('kr')[0]).toBe('январ');
    expect(getBirthdayMonths('en')).toHaveLength(12);
    expect(getBirthdayTexts('uz').synced(3)).toContain('3');
  });
});
