<template>
  <div class="fixed inset-0 flex items-center justify-center p-4" style="z-index: 120">
    <div class="absolute inset-0" style="background: rgba(17, 24, 39, 0.55); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)" @click="!complaintBusy && (showComplaint = false)"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full sm:max-w-md overflow-hidden">
      <div class="p-5">
        <div class="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3" style="background:#FEE2E2; color:#B91C1C">⚠️</div>
        <h3 class="text-base font-bold text-gray-900 text-center">{{ $t('l10n.pdg.complaint_title') }}</h3>
        <!-- SS-DEV (2026-09-24): ILDIZ SABAB (2-rasm, "bildirishnoma yuborildi 2 marta"):
             yuborilgandan KEYIN ham "…bildirishnoma sifatida yuboriladi" izohi qolib,
             tagida "…bildirishnoma sifatida yuborildi" xabari chiqardi — bir xil gap ikki
             marta. Endi yuborilgach izoh yashiriladi, faqat bitta ixcham xabar qoladi. -->
        <p class="text-sm text-gray-500 text-center mt-1.5">
          «{{ complaintKind === 'shop' ? complaintTarget.source_name : titleCaseName(complaintTarget.source_name) }}» — {{ formatMoney(complaintTarget.remaining_amount, complaintTarget.currency) }}.
          <template v-if="!complaintSent">{{ complaintKind === 'shop' ? $t('l10n.pdg.complaint_note_shop') : $t('l10n.pdg.complaint_note_person') }}</template>
        </p>

        <template v-if="!complaintSent">
          <!-- SS-DEV (2026-09-24): sabab IXTIYORIY — tanlanmasa izoh yozib yuborish mumkin. -->
          <p class="text-xs font-semibold text-gray-500 mt-4 mb-2">{{ $t('l10n.pdg.choose_reason') }} <span class="font-normal text-gray-400">{{ $t('l10n.pdg.or_write_below') }}</span>:</p>
          <div class="space-y-2">
            <button
              v-for="r in complaintReasons" :key="r.key"
              @click="complaintReason = complaintReason === r.key ? '' : r.key"
              class="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors"
              :style="complaintReason === r.key ? 'border-color:#E11D48; background:#FFF1F2; color:#9F1239' : 'border-color:#E5E7EB; color:#374151'"
            >{{ $t('l10n.pdg.reason_' + r.key) }}</button>
          </div>
          <textarea v-model="complaintNote" rows="2" maxlength="500" :placeholder="complaintReason ? $t('l10n.pdg.ph_extra') : $t('l10n.pdg.ph_required')" class="mt-3 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-400"></textarea>
        </template>
        <div v-else class="mt-4 flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3 text-green-800">
          <span class="flex-shrink-0">✅</span>
          <!-- 30.09 (doc1 22-rasm): "U qarzni tekshirib, siz bilan bog'lanadi" — va'da bo'lib chiqardi (do'kon
               egasi bog'lanmasligi mumkin). Endi faqat haqiqat: bildirishnoma yetkazildi, o'zgarish shu yerda ko'rinadi. -->
          <p class="text-sm">{{ complaintKind === 'shop' ? texts.complaintSentShop : texts.complaintSentPerson }}</p>
        </div>
      </div>
      <div class="flex gap-2 p-4 pt-0">
        <template v-if="!complaintSent">
          <button type="button" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm" :disabled="complaintBusy" @click="showComplaint = false">{{ $t('common.cancel') }}</button>
          <button type="button" class="flex-1 py-2.5 text-white rounded-xl font-semibold text-sm" :style="'background:#E11D48;' + (complaintBusy || !complaintCanSend ? 'opacity:.6' : '')" :disabled="complaintBusy || !complaintCanSend" @click="submitComplaint">{{ complaintBusy ? '...' : $t('common.send') }}</button>
        </template>
        <template v-else>
          <button type="button" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm" @click="backToDebtFromComplaint">{{ $t('l10n.pdg.go_debt') }}</button>
          <button type="button" class="flex-1 py-2.5 text-white rounded-xl font-semibold text-sm" style="background:#16A34A" @click="showComplaint = false">Ok</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
// wave C: pages/finance/debts/group/_key.vue dan ajratilgan (shikoyat modali). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { formatMoneyCur, titleCaseName } from '@/utils/helpers';
export default {
  name: 'DebtGroupComplaintModal',
  props: {
    complaintBusy: { type: null, default: undefined },
    complaintCanSend: { type: null, default: undefined },
    complaintKind: { type: null, default: undefined },
    complaintNoteValue: { type: null, default: undefined },
    complaintReasonValue: { type: null, default: undefined },
    complaintReasons: { type: null, default: undefined },
    complaintSent: { type: null, default: undefined },
    complaintTarget: { type: null, default: undefined },
    texts: { type: null, default: undefined },
  },
  computed: {
    complaintNote: {
      get() { return this.complaintNoteValue; },
      set(v) { this.$emit('update:complaintNoteValue', v); },
    },
    complaintReason: {
      get() { return this.complaintReasonValue; },
      set(v) { this.$emit('update:complaintReasonValue', v); },
    },
    showComplaint: {
      get() { return true; },
      set() { this.$emit('close'); },
    },
  },
  methods: {
    backToDebtFromComplaint(...args) {
      this.$emit('back-to-debt-from-complaint', ...args);
    },
    formatMoney: formatMoneyCur,
    submitComplaint(...args) {
      this.$emit('submit-complaint', ...args);
    },
    titleCaseName,
  },
};
</script>
