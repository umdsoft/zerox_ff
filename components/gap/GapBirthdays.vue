<template>
  <div class="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
    <button type="button" class="w-full flex items-center justify-between gap-2 p-5 text-left select-none" @click="bdOpen = !bdOpen">
      <div class="min-w-0">
        <h3 class="font-bold text-gray-900">🎂 {{ bdTexts.title }} <span v-if="bdCount" class="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ bdCount }}</span></h3>
        <p v-if="!bdOpen" class="text-xs text-gray-400 mt-0.5 truncate">{{ bdTexts.collapsedHint }}</p>
      </div>
      <svg class="w-5 h-5 text-gray-400 transition-transform flex-shrink-0" :class="bdOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
    </button>

    <div v-show="bdOpen" class="px-5 pb-5">
      <div class="flex items-center justify-between gap-2 flex-wrap mb-3">
        <p class="text-xs text-gray-400">{{ bdTexts.hint }}</p>
        <button
          v-if="gap.is_organizer"
          :disabled="bdSyncing"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors flex-shrink-0"
          :style="bdSyncing ? 'opacity:.6' : ''"
          @click="syncBirthdays"
        >
          <span>✈️</span> {{ bdSyncing ? bdTexts.syncing : bdTexts.sync }}
        </button>
      </div>

      <div v-if="bdLoading" class="text-sm text-gray-400 py-2">{{ bdTexts.loading }}</div>
      <div v-else-if="birthdays.length" class="divide-y divide-gray-100">
        <div v-for="b in birthdays" :key="b.member_id" class="py-2.5 flex items-center gap-3 flex-wrap">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate">{{ b.name }}</p>
            <p class="text-xs text-gray-400">
              <template v-if="b.birth_day">
                {{ fmtBirthday(b) }}
                <span v-if="b.source === 'telegram'" class="ml-1 px-1.5 py-0.5 rounded-full" style="background:#E0F2FE; color:#0369A1;">Telegram</span>
                <span v-else class="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{{ bdTexts.manual }}</span>
              </template>
              <template v-else>{{ bdTexts.notSet }}</template>
            </p>
          </div>
          <!-- Tashkilotchi hamma uchun, oddiy a'zo faqat o'zi uchun kiritadi -->
          <div v-if="canEditBirthday(b)" class="flex items-center gap-1.5">
            <select :value="bdEdit[b.member_id].day" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" @change="setEdit(b.member_id, 'day', $event.target.value)">
              <option :value="0">{{ bdTexts.day }}</option>
              <option v-for="d in 31" :key="'d' + d" :value="d">{{ d }}</option>
            </select>
            <select :value="bdEdit[b.member_id].month" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" @change="setEdit(b.member_id, 'month', $event.target.value)">
              <option :value="0">{{ bdTexts.month }}</option>
              <option v-for="(mn, i) in bdMonths" :key="'m' + i" :value="i + 1">{{ mn }}</option>
            </select>
            <input v-model.number="bdEditModel[b.member_id].year" type="number" min="1900" :max="new Date().getFullYear()" :placeholder="bdTexts.year" class="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" />
            <button :disabled="bdSaving === b.member_id" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white" :style="bdSaving === b.member_id ? 'opacity:.6' : ''" @click="saveBirthday(b)">{{ bdTexts.save }}</button>
          </div>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 py-2">{{ bdTexts.empty }}</p>

      <!-- SS-DEV (2026-09-24): GAP A'ZOSI BO'LMAGAN Telegram guruh a'zolari (qo'lda) -->
      <div class="mt-4 pt-4 border-t border-gray-100">
        <p class="text-sm font-semibold text-gray-800">{{ bdTexts.extrasTitle }}</p>
        <p class="text-xs text-gray-400 mt-0.5 mb-2">{{ bdTexts.extrasHint }}</p>
        <div v-if="bdExtras.length" class="divide-y divide-gray-100 mb-2">
          <div v-for="x in bdExtras" :key="'x' + x.id" class="py-2 flex items-center gap-3">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ x.name }} <span v-if="x.tg_username" class="text-xs font-normal text-sky-600">@{{ x.tg_username }}</span></p>
              <p class="text-xs text-gray-400">{{ fmtBirthday(x) }} <span class="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{{ bdTexts.extraTag }}</span></p>
            </div>
            <button v-if="gap.is_organizer" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50" :title="bdTexts.remove" @click="removeExtra(x)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        <div v-if="gap.is_organizer" class="flex flex-wrap items-center gap-1.5">
          <input v-model="bdNewName" type="text" maxlength="100" :placeholder="bdTexts.extraName" class="flex-1 min-w-0 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" style="min-width: 140px;" />
          <input v-model="bdNewTgUsername" type="text" maxlength="64" placeholder="@username" class="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" style="width: 120px;" />
          <select :value="bdNew.day" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" @change="setNew('day', $event.target.value)">
            <option :value="0">{{ bdTexts.day }}</option>
            <option v-for="d in 31" :key="'nd' + d" :value="d">{{ d }}</option>
          </select>
          <select :value="bdNew.month" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" @change="setNew('month', $event.target.value)">
            <option :value="0">{{ bdTexts.month }}</option>
            <option v-for="(mn, i) in bdMonths" :key="'nm' + i" :value="i + 1">{{ mn }}</option>
          </select>
          <input v-model.number="bdNewYear" type="number" min="1900" :max="new Date().getFullYear()" :placeholder="bdTexts.year" class="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" />
          <button :disabled="bdAdding" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white" :style="bdAdding ? 'opacity:.6' : ''" @click="addExtra">＋ {{ bdTexts.add }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// wave C: pages/finance/gap/_id.vue dan ajratilgan (a'zolarning tug'ilgan kunlari bo'limi). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { canEditBirthday, fmtBirthday, looseToNumber } from '@/utils/gapMembers';
export default {
  name: 'GapBirthdays',
  props: {
    gap: { type: Object, required: true },
    myId: { type: [Number, String], default: null },
    bdTexts: { type: Object, required: true },
    bdCount: { type: Number, default: 0 },
    bdMonths: { type: Array, required: true },
    birthdays: { type: Array, required: true },
    bdEdit: { type: Object, required: true },
    bdNew: { type: Object, required: true },
    bdExtras: { type: Array, required: true },
    bdLoading: { type: Boolean, default: false },
    bdSyncing: { type: Boolean, default: false },
    bdSaving: { type: [Number, String], default: null },
    bdAdding: { type: Boolean, default: false },
    openValue: { type: Boolean, default: false },
  },
  computed: {
    // v-model (IME himoyasi + .number) saqlansin, prop o'zgarmasin: get prop'dan, set hodisa yuboradi.
    bdNewName: {
      get() { return this.bdNew.name; },
      set(v) { this.$emit('update-new', 'name', v); },
    },
    bdNewTgUsername: {
      get() { return this.bdNew.tg_username; },
      set(v) { this.$emit('update-new', 'tg_username', v); },
    },
    bdNewYear: {
      get() { return this.bdNew.year; },
      set(v) { this.$emit('update-new', 'year', v); },
    },
    // a'zo bo'yicha proksi: v-model ichki $set/assign setter orqali hodisaga aylanadi
    bdEditModel() {
      const out = {};
      this.birthdays.forEach((b) => {
        const id = b.member_id;
        if (!this.bdEdit[id]) return;
        out[id] = Object.defineProperty({}, 'year', {
          enumerable: true,
          get: () => this.bdEdit[id].year,
          set: (v) => this.$emit('update-edit', id, 'year', v),
        });
      });
      return out;
    },
    bdOpen: {
      get() { return this.openValue; },
      set(v) { this.$emit('update:openValue', v); },
    },
  },
  methods: {
    // props'ni o'zgartirmaslik: maydon yangilanishi sahifaga (`$set`) yuboriladi
    setEdit(memberId, key, value) {
      this.$emit('update-edit', memberId, key, looseToNumber(value));
    },
    setNew(key, value, isNumber = true) {
      this.$emit('update-new', key, isNumber ? looseToNumber(value) : value);
    },
    syncBirthdays() {
      this.$emit('sync');
    },
    addExtra() {
      this.$emit('add-extra');
    },
    removeExtra(x) {
      this.$emit('remove-extra', x);
    },
    saveBirthday(b) {
      this.$emit('save-birthday', b);
    },
    canEditBirthday(b) {
      return canEditBirthday(this.gap, this.myId, b);
    },
    fmtBirthday(b) {
      return fmtBirthday(b, this.bdMonths);
    },
  },
};
</script>
