<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div class="absolute inset-0 bg-black/50" @click="showShopDebt = false"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl overflow-hidden">
      <div class="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white">
        <div class="flex items-start justify-between">
          <div class="min-w-0">
            <p class="text-white/80 text-xs font-medium mb-0.5">🏪 {{ $t('l10n.pdg.shop_debt') }}</p>
            <h3 class="text-lg font-bold truncate">{{ shopDebt.source_name }}</h3>
          </div>
          <button @click="showShopDebt = false" class="text-white/80 hover:text-white flex-shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div class="mt-3 flex items-end justify-between">
          <div>
            <p class="text-white/80 text-xs">{{ texts.remaining }}</p>
            <p class="text-2xl font-extrabold leading-tight">{{ formatMoney(shopDebt.remaining_amount, shopDebt.currency) }}</p>
          </div>
          <div class="text-right">
            <p class="text-white/80 text-xs">{{ $t('l10n.pdg.initial') }}</p>
            <p class="font-semibold">{{ formatMoney(shopDebt.amount, shopDebt.currency) }}</p>
          </div>
        </div>
      </div>
      <div class="p-5 space-y-3 text-sm overflow-y-auto" style="max-height:60vh">
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-gray-500 text-xs">{{ $t('l10n.pdg.repaid') }}</p>
            <p class="font-bold text-green-600">{{ formatMoney(shopDebt.paid_amount || 0, shopDebt.currency) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-gray-500 text-xs">{{ $t('l10n.pdg.balance') }}</p>
            <p class="font-bold text-red-600">{{ formatMoney(shopDebt.remaining_amount, shopDebt.currency) }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <p class="text-gray-500 text-xs">{{ $t('l10n.pdg.date_taken') }}</p>
            <p class="font-medium">{{ formatDate(shopDebt.start_date || shopDebt.created_at) }}</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs">{{ $t('l10n.pdg.due') }}</p>
            <p class="font-medium">{{ shopDebt.due_date ? formatDate(shopDebt.due_date) : '—' }}</p>
          </div>
        </div>
        <div v-if="shopDebt.notes">
          <p class="text-gray-500 text-xs">{{ $t('l10n.pdg.shop_note') }}</p>
          <p class="font-medium bg-gray-50 rounded-xl p-3">{{ botNoteText(shopDebt.notes, $i18n.locale) }}</p>
        </div>
        <div class="pt-3 border-t border-gray-100 space-y-1">
          <p class="text-gray-500 text-xs mb-1">{{ $t('l10n.pdg.shop_info') }}</p>
          <p v-if="shopDebt.shop_region || shopDebt.shop_district" class="font-medium">📍 {{ [shopDebt.shop_region, shopDebt.shop_district].filter(Boolean).join(', ') }}</p>
          <p v-if="shopDebt.shop_phone" class="font-medium">📞 {{ formatPhone(shopDebt.shop_phone) }}</p>
          <p v-if="!shopDebt.shop_region && !shopDebt.shop_district && !shopDebt.shop_phone" class="text-gray-400 text-xs">{{ $t('l10n.pdg.no_info') }}</p>
        </div>
        <div class="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3 text-amber-800">
          <span class="flex-shrink-0">ℹ️</span>
          <p class="text-xs">{{ $t('l10n.pdg.shop_view_only') }}</p>
        </div>
        <!-- SS-DEV (2026-09-24): noto'g'ri rasmiylashtirilgan qarz bo'yicha SHIKOYAT (do'kon egasiga bildirishnoma) -->
        <button
          v-if="shopDebt.status !== 'completed'"
          @click="openComplaint"
          class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1.5"
        ><span>⚠️</span> {{ $t('l10n.pdg.complain') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// wave C: pages/finance/debts/group/_key.vue dan ajratilgan (do'kon qarzi tafsilotlari modali). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { botNoteText, fmtDMY, formatMoneyCur, formatPhoneUz } from '@/utils/helpers';
export default {
  name: 'DebtGroupShopDebtModal',
  props: {
    shopDebt: { type: null, default: undefined },
    texts: { type: null, default: undefined },
  },
  computed: {
    showShopDebt: {
      get() { return true; },
      set() { this.$emit('close'); },
    },
  },
  methods: {
    botNoteText,
    formatDate(v) {
      return fmtDMY(v, '-');
    },
    formatMoney: formatMoneyCur,
    formatPhone: formatPhoneUz,
    openComplaint(...args) {
      this.$emit('open-complaint', ...args);
    },
  },
};
</script>
