<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div class="absolute inset-0 bg-black/50" @click="showMirror = false"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl overflow-hidden">
      <div class="p-5 text-white" :class="mirrorDebt.type === 'lent' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-indigo-500 to-indigo-700'">
        <div class="flex items-start justify-between">
          <div class="min-w-0">
            <!-- SS-DEV (2026-09-24): "ko'zgu" → "hamkor qaydi" (qarshi tomon kiritgan qarz) -->
            <p class="text-white/80 text-xs font-medium mb-0.5">🤝 {{ mirrorDebt.type === 'lent' ? $t('l10n.pdg.partner_lent') : $t('l10n.pdg.partner_taken') }}</p>
            <h3 class="text-lg font-bold truncate">{{ titleCaseName(mirrorDebt.source_name) }}</h3>
            <p v-if="mirrorDebt.phone" class="text-white/80 text-xs mt-0.5">{{ formatPhone(mirrorDebt.phone) }}</p>
          </div>
          <button @click="showMirror = false" class="text-white/80 hover:text-white flex-shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div class="mt-3 flex items-end justify-between">
          <div><p class="text-white/80 text-xs">{{ $t('l10n.pdg.balance') }}</p><p class="text-2xl font-extrabold leading-tight">{{ formatMoney(mirrorDebt.remaining_amount, mirrorDebt.currency) }}</p></div>
          <div class="text-right"><p class="text-white/80 text-xs">{{ $t('l10n.pdg.initial') }}</p><p class="font-semibold">{{ formatMoney(mirrorDebt.amount, mirrorDebt.currency) }}</p></div>
        </div>
      </div>
      <div class="p-5 space-y-3 text-sm overflow-y-auto" style="max-height:60vh">
        <div class="grid grid-cols-2 gap-3">
          <div><p class="text-gray-500 text-xs">{{ $t('l10n.pdg.date_taken') }}</p><p class="font-medium">{{ formatDate(mirrorDebt.start_date || mirrorDebt.created_at) }}</p></div>
          <div><p class="text-gray-500 text-xs">{{ $t('l10n.pdg.due') }}</p><p class="font-medium">{{ mirrorDebt.due_date ? formatDate(mirrorDebt.due_date) : '—' }}</p></div>
        </div>
        <div v-if="mirrorDebt.notes"><p class="text-gray-500 text-xs">{{ $t('l10n.pdg.note') }}</p><p class="font-medium bg-gray-50 rounded-xl p-3">{{ botNoteText(mirrorDebt.notes, $i18n.locale) }}</p></div>

        <!-- SS-DEV (2026-09-24): QAYTARISHLAR — har qism alohida: summa, KIM kiritgan, QACHON.
             Talab: «kim qaytarilgan deb kiritganini, qachon kiritganini ko'rinadigan qilish». -->
        <div v-if="mirrorPayments.length" class="pt-1">
          <p class="text-gray-500 text-xs mb-1.5">{{ $t('l10n.pdg.repayments', { n: mirrorPayments.length }) }}</p>
          <div class="space-y-1.5">
            <div v-for="p in mirrorPayments" :key="'mp' + p.id" class="flex items-start justify-between gap-2 rounded-xl px-3 py-2" :class="p.kind === 'forgive' ? 'bg-rose-50' : 'bg-green-50'">
              <div class="min-w-0">
                <p class="font-semibold" :class="p.kind === 'forgive' ? 'text-rose-700' : 'text-green-700'">{{ p.kind === 'forgive' ? '🚫 ' : '− ' }}{{ formatMoney(p.amount, mirrorDebt.currency) }} <span class="text-xs font-normal text-gray-500">· {{ p.kind === 'forgive' ? $t('l10n.pdg.forgiven_lc') : $t('l10n.pdg.payment_lc') }}</span></p>
                <p class="text-xs text-gray-500">{{ formatDateTime(p.created_at || p.payment_date) }}</p>
              </div>
              <p class="text-xs text-right flex-shrink-0" :class="p.byMe ? 'text-gray-500' : 'text-indigo-600 font-medium'">👤 {{ p.by }}</p>
            </div>
          </div>
        </div>

        <!-- Lender (can_operate): YOPISH / to'lov qayd etish / talab qilish / voz kechish.
             SS-4 (2026-09-19): «Undan yopish mumkin emas demoqda. Aslida esa yopish
             imkonini ham berish kerak» — qarz beruvchi pul qo'liga tekkanda
             qarzni o'zi yopadi yoki qisman to'lovni qayd etadi. -->
        <div v-if="mirrorDebt.can_operate && mirrorDebt.status !== 'completed'" class="space-y-2 pt-1">
          <!-- 30.09 (doc1 20-rasm): "Qarzni yopish" va "Qarzni qaytarish" BIRLASHTIRILDI — bitta tugma oyna
               ochadi: summa bo'sh = butun qoldiq yopiladi, summa kiritilsa = qisman qaytarish qayd etiladi. -->
          <button @click="openMirrorPay" :disabled="mirrorBusy" class="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1" :style="mirrorBusy ? 'opacity:.6' : ''"><span>✓</span> {{ texts.close }}</button>
          <div class="flex gap-2">
            <button @click="mirrorDemand" :disabled="mirrorBusy || fdBusy" class="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1" :style="(mirrorBusy || fdBusy) ? 'opacity:.6' : ''"><span>⏰</span> {{ texts.demand }}<PlanLockIcon v-if="demandLocked" :label="$t('plan_gate.required')" /></button>
            <!-- SS-DEV (2026-09-24): voz kechishga mos ikonka — 🚫 (qarz daftari bilan bir xil) -->
            <button @click="askMirrorForgive" :disabled="mirrorBusy" class="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1" :style="mirrorBusy ? 'opacity:.6' : ''"><span>🚫</span> {{ texts.forgive }}</button>
          </div>
        </div>
        <!-- SS-DEV (2026-09-24): men QARZDOR bo'lgan hamkor qaydi (u "berdim" deb yozgan) —
             noto'g'ri bo'lsa SHIKOYAT (do'kon qarzidagi kabi; qarz bergan odamga bildirishnoma). -->
        <button
          v-if="!mirrorDebt.can_operate && mirrorDebt.status !== 'completed'"
          @click="openPersonComplaint"
          class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1.5"
        ><span>⚠️</span> {{ $t('l10n.pdg.complain') }}</button>
        <!-- SS-DEV (2026-09-24): TUGALLANGAN hamkor qaydini O'Z ro'yxatimdan olib tashlash (bir tomonlama) -->
        <button
          v-if="mirrorDebt.status === 'completed'"
          @click="askMirrorHide" :disabled="mirrorBusy"
          class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1"
          :style="mirrorBusy ? 'opacity:.6' : ''"
        ><span>🗑</span> {{ $t('l10n.pdg.delete_mine') }}</button>
        <!-- SS-DEV (2026-09-24): ism "Sarlavha Ko'rinishi"da + bitta tushunarli gap -->
        <div class="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3 text-gray-600">
          <span class="flex-shrink-0">ℹ️</span>
          <p class="text-xs">{{ $t(mirrorDebt.can_operate ? 'l10n.pdg.mirror_operate' : 'l10n.pdg.mirror_view', { name: titleCaseName(mirrorDebt.source_name) }) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// wave C: pages/finance/debts/group/_key.vue dan ajratilgan (telefon-ko'zgu qarz tafsiloti modali). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { botNoteText, fmtDMY, formatMoneyCur, formatPhoneUz, titleCaseName } from '@/utils/helpers';
import { formatTashkentDateTime } from '@/utils/format';
import PlanLockIcon from '~/components/ui/PlanLockIcon.vue';
export default {
  name: 'DebtGroupMirrorModal',
  components: { PlanLockIcon },
  props: {
    demandLocked: { type: null, default: undefined },
    fdBusy: { type: null, default: undefined },
    mirrorBusy: { type: null, default: undefined },
    mirrorDebt: { type: null, default: undefined },
    mirrorPayments: { type: null, default: undefined },
    texts: { type: null, default: undefined },
  },
  computed: {
    showMirror: {
      get() { return true; },
      set() { this.$emit('close'); },
    },
  },
  methods: {
    askMirrorForgive(...args) {
      this.$emit('ask-mirror-forgive', ...args);
    },
    askMirrorHide(...args) {
      this.$emit('ask-mirror-hide', ...args);
    },
    botNoteText,
    formatDate(v) {
      return fmtDMY(v, '-');
    },
    formatDateTime(dt) {
      const r = formatTashkentDateTime(dt);
      return r === null ? fmtDMY(dt, '-') : r;
    },
    formatMoney: formatMoneyCur,
    formatPhone: formatPhoneUz,
    mirrorDemand(...args) {
      this.$emit('mirror-demand', ...args);
    },
    openMirrorPay(...args) {
      this.$emit('open-mirror-pay', ...args);
    },
    openPersonComplaint(...args) {
      this.$emit('open-person-complaint', ...args);
    },
    titleCaseName,
  },
};
</script>
