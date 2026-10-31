<template>
  <div class="bg-white rounded-2xl p-5 shadow-sm mb-5">
    <div class="flex items-center justify-between mb-3 gap-2">
      <h3 class="font-bold text-gray-900 min-w-0 truncate">👥 {{ $t('finance.gap_members') }} ({{ gap.members.length }})</h3>
      <div v-if="gap.is_organizer" class="flex items-center gap-1.5 flex-shrink-0">
        <!-- V4: "A'zo qo'shish" o'ng-tepada; forma toggle (bosilganda ochiladi) -->
        <button @click="openAddMember" class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          {{ $t('finance.gap_add_member') }}
        </button>
        <button @click="openSettings" class="inline-flex items-center justify-center w-9 h-9 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition" :title="$t('finance.gap_settings')" :aria-label="$t('finance.gap_settings')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>
    </div>


    <!-- Navbat rejimi: Tasodifiy / O'zimiz tanlaymiz (tashkilotchi) -->
    <div v-if="gap.is_organizer && gap.members.length >= 2" class="flex gap-2 mb-3">
      <button @click="orderMode = 'random'" :class="['flex-1 py-2 rounded-lg text-sm font-medium border transition', orderMode === 'random' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600']">🎲 {{ $t('finance.gap_order_random') }}</button>
      <button @click="orderMode = 'manual'" :class="['flex-1 py-2 rounded-lg text-sm font-medium border transition', orderMode === 'manual' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600']">✋ {{ $t('finance.gap_order_manual') }}</button>
    </div>

    <div class="space-y-2 mb-4">
      <div v-for="(m, mi) in gap.members" :key="m.id" class="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
        <!-- Qo'lda navbat: yuqoriga/pastga -->
        <div v-if="orderMode === 'manual' && gap.is_organizer" class="flex flex-col flex-shrink-0">
          <button @click="moveMember(mi, -1)" :disabled="mi === 0" class="text-gray-400 hover:text-teal-600 disabled:opacity-30 leading-none">▲</button>
          <button @click="moveMember(mi, 1)" :disabled="mi === gap.members.length - 1" class="text-gray-400 hover:text-teal-600 disabled:opacity-30 leading-none">▼</button>
        </div>
        <div class="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold flex-shrink-0">{{ orderMode === 'manual' ? (mi + 1) : initials(m.name) }}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate flex items-center gap-1 flex-wrap">
            <span class="truncate">{{ m.name }}</span>
            <span v-if="isMainOrg(m)" class="text-teal-600 text-xs font-semibold flex-shrink-0">👑 {{ $t('finance.gap_organizer') }}</span>
            <span v-else-if="isCoOrg(m)" class="text-amber-600 text-xs font-semibold flex-shrink-0">👑 2-{{ $t('finance.gap_organizer') }}</span>
            <!-- SS-DEV (2026-09-30), 7–8-rasmlar: ZeroX'ga hali kirmagan 2-tashkilotchi — Telegram orqali tasdiqlaydi -->
            <span v-if="isCoOrg(m) && !m.user_id" class="text-[11px] font-normal text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 flex-shrink-0" :title="coOrgT.pendingHint">📱 {{ coOrgT.pendingBadge }}</span>
          </p>
          <p class="text-xs text-gray-400">{{ m.phone }}</p>
        </div>
        <!-- Per-a'zo summa (kim qanchadan kirishadi) -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <input v-if="gap.is_organizer" :value="formatThousands(m.amount)" @change="setMemberAmount(m, $event)" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-right outline-none focus:ring-2 focus:ring-teal-500" />
          <span v-else class="text-xs font-semibold text-gray-700">{{ m.amount ? formatMoney(m.amount) : '—' }}</span>
          <span class="text-xs text-gray-400">{{ gap.currency }}</span>
          <!-- SS-B: qo'shimcha tashkilotchi boshqaruvi — FAQAT dastlabki tashkilotchi -->
          <button
            v-if="gap.is_primary_organizer && !hasCoOrg && !isMainOrg(m)"
            @click="askCoOrg(m, 'make')" :disabled="busy"
            class="px-2 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 whitespace-nowrap"
            :title="$t('finance.gap_make_coorg')"
          >👑+</button>
          <button
            v-if="gap.is_primary_organizer && isCoOrg(m)"
            @click="askCoOrg(m, 'remove')" :disabled="busy"
            class="px-2 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 whitespace-nowrap"
            :title="$t('finance.gap_remove_coorg')"
          >👑−</button>
          <button v-if="gap.is_organizer && !isMainOrg(m) && !isCoOrg(m)" @click="removeMember(m)" class="px-1.5 text-gray-400 hover:text-red-600" aria-label="remove">✕</button>
        </div>
      </div>
    </div>

    <div v-if="gap.is_organizer">
      <button @click="doShuffle" :disabled="busy || gap.members.length < 2" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold transition">{{ orderMode === 'manual' ? '✋ ' + $t('finance.gap_start_manual') : '🎲 ' + $t('finance.gap_shuffle') }}</button>
      <p class="text-xs text-gray-400 mt-2 text-center">{{ orderMode === 'manual' ? $t('finance.gap_order_manual_hint') : $t('finance.gap_shuffle_hint') }}</p>
    </div>
    <p v-else class="text-sm text-gray-400 text-center">{{ $t('finance.gap_wait_organizer') }}</p>
  </div>
</template>

<script>
// wave C: pages/finance/gap/_id.vue dan ajratilgan (draft holatda a'zolarni boshqarish). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { formatNumberGrouped, initials } from '@/utils/helpers';
import { isMainOrg, isCoOrg, formatThousands } from '@/utils/gapMembers';
export default {
  name: 'GapMembersDraft',
  props: {
    gap: { type: Object, required: true },
    coOrgT: { type: Object, required: true },
    busy: { type: Boolean, default: false },
    hasCoOrg: { type: Boolean, default: false },
    modeValue: { type: String, default: 'random' },
  },
  computed: {
    orderMode: {
      get() { return this.modeValue; },
      set(v) { this.$emit('update:modeValue', v); },
    },
  },
  methods: {
    openAddMember() {
      this.$emit('add-member');
    },
    openSettings() {
      this.$emit('settings');
    },
    moveMember(mi, dir) {
      this.$emit('move', mi, dir);
    },
    askCoOrg(m, kind) {
      this.$emit('ask-coorg', m, kind);
    },
    removeMember(m) {
      this.$emit('remove-member', m);
    },
    doShuffle() {
      this.$emit('shuffle');
    },
    setMemberAmount(m, e) {
      this.$emit('member-amount', m, e);
    },
    isMainOrg(m) {
      return isMainOrg(this.gap, m);
    },
    isCoOrg(m) {
      return isCoOrg(this.gap, m);
    },
    formatThousands,
    formatMoney: formatNumberGrouped,
    initials,
  },
};
</script>
