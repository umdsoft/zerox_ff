import { describe, it, expect, vi } from 'vitest';
import Vue from 'vue';
import { createVm } from './helpers/mountOptions';
import { renderToHtml, RENDER_ENABLED } from './helpers/renderSsr';
import Settings from '@/components/gap/GapSettingsModal.vue';
import Restart from '@/components/gap/GapRestartModal.vue';
import Birthdays from '@/components/gap/GapBirthdays.vue';
import GapPage from '@/pages/finance/gap/_id.vue';
import { looseToNumber } from '@/utils/gapMembers';

// wave D: vue/no-mutating-props — child modallar formani o'zgartirmaydi, `update-field` yuboradi; sahifa `$set` qiladi.

const t = (k) => k;
const emits = (vm) => { const c = []; vm.$emit = vi.fn((...a) => { c.push(a); }); return c; };

describe('looseToNumber (== v-model.number)', () => {
  it('parseFloat, else original', () => {
    expect(looseToNumber('12')).toBe(12);
    expect(looseToNumber('1.5x')).toBe(1.5);
    expect(looseToNumber('')).toBe('');
    expect(looseToNumber('abc')).toBe('abc');
  });
});

describe('settings / restart modals emit update-field and never touch the prop', () => {
  for (const [name, Comp, prop] of [['settings', Settings, 'settingsForm'], ['restart', Restart, 'restartForm']]) {
    it(name, () => {
      const form = Object.freeze({ name: 'a', frequency: 'monthly', day_of_month: 3, uniform: true });
      const vm = createVm(Comp, { propsData: { gap: {}, [prop]: form } });
      const c = emits(vm);
      vm.setField('frequency', '15days');
      expect(c).toEqual([['update-field', 'frequency', '15days']]);
      expect(form.frequency).toBe('monthly');
    });
  }
});

describe('birthdays emits field updates', () => {
  it('update-edit / update-new coerce numbers like v-model.number', () => {
    const vm = createVm(Birthdays, { propsData: { gap: {}, bdTexts: {}, bdMonths: [], birthdays: [], bdEdit: {}, bdNew: {}, bdExtras: [] } });
    const c = emits(vm);
    vm.setEdit(5, 'day', '17');
    vm.setNew('month', '0');
    vm.setNew('name', ' Ali ', false);
    expect(c).toEqual([['update-edit', 5, 'day', 17], ['update-new', 'month', 0], ['update-new', 'name', ' Ali ']]);
  });
});

describe('gap page field handlers', () => {
  it('$set into the same reactive objects (adds new keys reactively)', () => {
    const vm = createVm(GapPage, { mocks: { $t: t, $route: { params: { id: 1 } } } });
    const form = vm.settingsForm;
    vm.onSettingsField('start_date', '2026-10-01');
    vm.onSettingsField('frequency', '10days');
    expect(vm.settingsForm).toBe(form);
    expect(vm.settingsForm).toMatchObject({ start_date: '2026-10-01', frequency: '10days' });
    vm.onRestartField('amount', '1000');
    expect(vm.restartForm.amount).toBe('1000');
    vm.onBdNewField('day', 4);
    expect(vm.bdNew.day).toBe(4);
    Vue.set(vm.bdEdit, 9, { day: 0, month: 0, year: '' });
    vm.onBdEditField(9, 'month', 11);
    expect(vm.bdEdit[9].month).toBe(11);
  });
});

describe.skipIf(!RENDER_ENABLED)('SSR render (VUE_TEST_RENDER=1): no unknown elements / warnings', () => {
  const mocks = { $t: t };
  it('settings modal reflects form values', async () => {
    const html = await renderToHtml(Settings, { mocks, stubs: ['date-picker'], propsData: { gap: { currency: 'UZS' }, settingsForm: { name: 'Gap1', frequency: 'monthly', day_of_month: 7, uniform: true, amount: 5000 } } });
    expect(html).toContain('value="Gap1"');
    expect(html).toContain('value="7"');
    expect(html).toContain('checked="checked"');
    expect(html).toContain('5');
  });
  it('restart modal renders', async () => {
    const html = await renderToHtml(Restart, { mocks, stubs: ['date-picker'], propsData: { gap: { currency: 'UZS' }, restartForm: { name: 'R', frequency: '10days', uniform: false }, restartMemberCount: 3 } });
    expect(html).toContain('value="R"');
  });
  it('birthdays renders edit controls', async () => {
    const html = await renderToHtml(Birthdays, {
      mocks,
      propsData: {
        gap: { is_organizer: true }, myId: 1, bdTexts: { title: 'T', day: 'D', month: 'M', year: 'Y', extrasTitle: '', extrasHint: '', add: '+', save: 'S', empty: '', extraName: '' },
        bdMonths: ['yan'], birthdays: [{ member_id: 5, name: 'Ali', birth_day: 3, birth_month: 1 }], bdEdit: { 5: { day: 3, month: 1, year: '' } }, bdNew: { name: 'zed', tg_username: '', day: 0, month: 0, year: '' }, bdExtras: [],
      },
    });
    expect(html).toContain('value="zed"');
  });
});

// wave E: inputlar yana v-model / v-model.number (IME kompozitsiya himoyasi + blur'da raqamga o'tkazish); child prop'ni o'zgartirmaydi,
// computed get/set hodisa yuboradi. Render funksiyasi kerak (standart rejim) — vnode'dagi haqiqiy handlerlar chaqiriladi.
const findAll = (vn, pred, out = []) => {
  if (!vn) { return out; }
  if (pred(vn)) { out.push(vn); }
  (vn.children || []).forEach((c) => findAll(c, pred, out));
  return out;
};
const handlers = (vn) => [].concat((vn.data.on || {}).input || []);
const fire = (vn, value, composing = false) => handlers(vn).forEach((h) => h({ target: { value, composing } }));
const inputsOf = (vm) => findAll(vm._render(), (v) => v.tag === 'input' && v.data && v.data.attrs);
const byType = (vm, type) => inputsOf(vm).filter((v) => v.data.attrs.type === type);

describe.skipIf(!RENDER_ENABLED)('gap inputs keep v-model semantics (IME guard + number coercion)', () => {
  const prevSilent = Vue.config.silent;
  const mk = (Comp, propsData) => createVm(Comp, { mocks: { $t: t }, propsData: { gap: { currency: 'UZS' }, ...propsData } });
  for (const [name, Comp, prop] of [['settings', Settings, 'settingsForm'], ['restart', Restart, 'restartForm']]) {
    it(name + ': text input emits only after IME composition ends', () => {
      Vue.config.silent = true;
      const form = Object.freeze({ name: 'a', frequency: 'monthly', day_of_month: 3, uniform: false });
      const vm = mk(Comp, { [prop]: form });
      const c = emits(vm);
      const text = byType(vm, 'text')[0];
      expect(text.data.domProps.value).toBe('a');
      fire(text, 'ni', true);
      expect(c).toEqual([]);
      fire(text, 'nihao', false);
      expect(c).toEqual([['update-field', 'name', 'nihao']]);
      expect(form.name).toBe('a');
      Vue.config.silent = prevSilent;
    });
    it(name + ': number input coerces like v-model.number and re-syncs on blur', () => {
      Vue.config.silent = true;
      const vm = mk(Comp, { [prop]: Object.freeze({ name: 'a', frequency: 'monthly', day_of_month: 3, uniform: false }) });
      const c = emits(vm);
      const num = byType(vm, 'number')[0];
      expect(num.data.domProps.value).toBe(3);
      fire(num, '12');
      fire(num, '');
      fire(num, '1.5x');
      expect(c).toEqual([['update-field', 'day_of_month', 12], ['update-field', 'day_of_month', ''], ['update-field', 'day_of_month', 1.5]]);
      expect(num.data.on.blur).toBeTypeOf('function'); // .number: blur'da $forceUpdate
      Vue.config.silent = prevSilent;
    });
  }
  it('birthdays: new-member text/number inputs and per-member year', () => {
    Vue.config.silent = true;
    const vm = mk(Birthdays, {
      gap: { is_organizer: true }, bdTexts: {}, bdMonths: [], bdExtras: [], bdEdit: { 7: { day: 1, month: 2, year: 1990 } },
      bdNew: { name: '', tg_username: '', day: 0, month: 0, year: '' },
      birthdays: [{ member_id: 7 }], openValue: true, myId: 7,
    });
    const c = emits(vm);
    const texts = byType(vm, 'text');
    fire(texts[0], 'Ali', true);
    expect(c).toEqual([]);
    fire(texts[0], 'Ali');
    fire(texts[1], '@ali');
    const nums = byType(vm, 'number');
    nums.forEach((n) => fire(n, '1991'));
    expect(c).toEqual(expect.arrayContaining([['update-new', 'name', 'Ali'], ['update-new', 'tg_username', '@ali'], ['update-new', 'year', 1991], ['update-edit', 7, 'year', 1991]]));
    Vue.config.silent = prevSilent;
  });
});
