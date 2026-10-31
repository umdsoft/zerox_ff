<template>
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
      <p class="font-semibold text-gray-900">{{ side ? texts.ops : texts.listAll }}</p>
      <span class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{{ listItems.length }} {{ texts.countSuffix }}</span>
    </div>
    <p v-if="!listItems.length" class="p-6 text-center text-sm text-gray-400">{{ texts.noActive }}</p>
    <div class="divide-y divide-gray-100">
      <div
        v-for="debt in listItems"
        :key="(debt.is_mirror ? 'm' : 'o') + '-' + debt.id"
        class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
        @click="onDebtClick(debt)"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-800 flex items-center gap-1.5 flex-wrap">
              <span>{{ debt.type === 'borrowed' ? texts.badgeBorrowed : texts.badgeLent }}</span>
              <span
                v-if="debt.is_shop_debt"
                class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style="background:#FEF3C7; color:#92400E;"
                :title="$t('l10n.pdg.shop_hint')"
              >🏪 {{ $t('l10n.pdg.shop') }}</span>
              <span
                v-else-if="debt.is_mirror && debt.can_operate"
                class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style="background:#ECFDF5; color:#065F46;"
                :title="$t('l10n.pdg.linked_hint')"
              >🔗 {{ $t('l10n.pdg.linked') }}</span>
              <span
                v-else-if="debt.is_mirror"
                class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style="background:#EEF2FF; color:#3730A3;"
                :title="$t('l10n.pdg.view_hint_b')"
              >👁 {{ $t('l10n.pdg.view_only') }}</span>
            </p>
            <p class="text-xs text-gray-500 mt-0.5">
              <!-- 29.09 (doc2 3-rasm): muddat "26.09.2026" ko'rinishida (nuqta bilan) -->
              <span v-if="debt.due_date">{{ texts.dueShort }} {{ formatDate(debt.due_date) }}</span>
              <span v-if="debt.due_date"> · </span>
              <span v-if="debt.status === 'completed'" class="text-green-600">{{ $t('l10n.pdg.completed') }}</span>
              <span v-else-if="isOverdue(debt)" class="text-red-600">{{ $t('l10n.pdg.overdue') }}</span>
              <span v-else-if="isOpen(debt)" class="text-blue-600">{{ $t('l10n.pdg.active') }}</span>
            </p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <div class="text-right">
              <!-- SS-DEV (2026-09-24): tugallangan qarzda QOLDIQ (0) o'rniga DASTLABKI summa
                   ko'rsatiladi; voz kechilgan bo'lsa "voz kechildi" belgisi (5-rasm: "+0 UZS"
                   chalg'itardi — 500 000 berilgani ko'rinmasdi). -->
              <p class="text-sm font-bold" :class="debt.type === 'borrowed' ? 'text-red-600' : 'text-green-600'">
                {{ debt.type === 'borrowed' ? '-' : '+' }}{{ formatMoney(debt.status === 'completed' ? debt.amount : debt.remaining_amount, debt.currency) }}
              </p>
              <p v-if="isForgiven(debt)" class="text-xs text-rose-600 font-medium">🚫 {{ $t('l10n.pdg.forgiven') }}</p>
              <p v-else-if="debt.status === 'completed'" class="text-xs text-gray-400">100% {{ $t('l10n.pdg.paid') }}</p>
              <p v-else class="text-xs text-gray-400">{{ getPaidPercent(debt) }}% {{ $t('l10n.pdg.paid') }}</p>
            </div>
            <!-- SS-DEV (2026-09-24): TUGALLANGAN qarzni shu yerdan BIR TOMONLAMA o'chirish
                 (faqat mening ro'yxatimdan; qarshi tomonda saqlanadi). Do'kon qarzi — yo'q. -->
            <button
              v-if="debt.status === 'completed' && !debt.is_shop_debt"
              type="button"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
              :title="$t('l10n.pdg.delete_mine')"
              @click.stop="askRowDelete(debt)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// wave C: pages/finance/debts/group/_key.vue dan ajratilgan (qarzlar ro'yxati). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { fmtDMY, formatMoneyCur } from '@/utils/helpers';
import { getPaidPercent, isForgiven, isOpen, isOverdue } from '@/utils/debtGroupRows';
export default {
  name: 'DebtGroupList',
  props: {
    listItems: { type: null, default: undefined },
    side: { type: null, default: undefined },
    texts: { type: null, default: undefined },
  },
  methods: {
    askRowDelete(...args) {
      this.$emit('ask-row-delete', ...args);
    },
    formatDate(v) {
      return fmtDMY(v, '-');
    },
    formatMoney: formatMoneyCur,
    getPaidPercent,
    isForgiven,
    isOpen,
    isOverdue,
    onDebtClick(...args) {
      this.$emit('on-debt-click', ...args);
    },
  },
};
</script>
