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
          @click="syncBirthdays"
          :disabled="bdSyncing"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors flex-shrink-0"
          :style="bdSyncing ? 'opacity:.6' : ''"
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
            <select v-model.number="bdEdit[b.member_id].day" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400">
              <option :value="0">{{ bdTexts.day }}</option>
              <option v-for="d in 31" :key="'d' + d" :value="d">{{ d }}</option>
            </select>
            <select v-model.number="bdEdit[b.member_id].month" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400">
              <option :value="0">{{ bdTexts.month }}</option>
              <option v-for="(mn, i) in bdMonths" :key="'m' + i" :value="i + 1">{{ mn }}</option>
            </select>
            <input v-model.number="bdEdit[b.member_id].year" type="number" min="1900" :max="new Date().getFullYear()" :placeholder="bdTexts.year" class="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" />
            <button @click="saveBirthday(b)" :disabled="bdSaving === b.member_id" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white" :style="bdSaving === b.member_id ? 'opacity:.6' : ''">{{ bdTexts.save }}</button>
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
            <button v-if="gap.is_organizer" @click="removeExtra(x)" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50" :title="bdTexts.remove">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        <div v-if="gap.is_organizer" class="flex flex-wrap items-center gap-1.5">
          <input v-model="bdNew.name" type="text" maxlength="100" :placeholder="bdTexts.extraName" class="flex-1 min-w-0 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" style="min-width: 140px;" />
          <input v-model="bdNew.tg_username" type="text" maxlength="64" placeholder="@username" class="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" style="width: 120px;" />
          <select v-model.number="bdNew.day" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400">
            <option :value="0">{{ bdTexts.day }}</option>
            <option v-for="d in 31" :key="'nd' + d" :value="d">{{ d }}</option>
          </select>
          <select v-model.number="bdNew.month" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400">
            <option :value="0">{{ bdTexts.month }}</option>
            <option v-for="(mn, i) in bdMonths" :key="'nm' + i" :value="i + 1">{{ mn }}</option>
          </select>
          <input v-model.number="bdNew.year" type="number" min="1900" :max="new Date().getFullYear()" :placeholder="bdTexts.year" class="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" />
          <button @click="addExtra" :disabled="bdAdding" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white" :style="bdAdding ? 'opacity:.6' : ''">＋ {{ bdTexts.add }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// wave C: pages/finance/gap/_id.vue dan ajratilgan (a'zolarning tug'ilgan kunlari bo'limi). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { canEditBirthday, fmtBirthday } from '@/utils/gapMembers';
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
    bdOpen: {
      get() { return this.openValue; },
      set(v) { this.$emit('update:openValue', v); },
    },
  },
  methods: {
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
