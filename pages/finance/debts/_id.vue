<template>
  <div class="debt-detail pb-8">
    <!-- Page Header -->
    <!-- 27.09 (S4-1): "← Orqaga" matnli havola O'RNIGA Qarz shartnomasi / Qarz daftaridagidek kvadrat oq
         tugma (chevron) sarlavha bilan BIR QATORDA; brauzer tarixi bo'yicha orqaga, tarix bo'sh bo'lsa —
         avvalgi `backLink` (kontragent sahifasi / ro'yxat) ga. -->
    <!-- 30.09 (doc1 14/16-rasm): umumiy PageBackButton. Kontragent sahifasidan kirilganda (`?group=`) ism,
         telefon va avatar TAKRORLANMAYDI (ular kontragent sahifasida bor) — sarlavha: qarz turi + sanasi. -->
    <div class="flex items-center gap-3 mb-6">
      <PageBackButton @click="goBack" :label="$t('common.back')" />
      <div class="min-w-0">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 truncate">{{ fromGroup ? (debt.type === 'borrowed' ? $t('finance.borrowed') : $t('finance.lent')) : debt.source_name }}</h1>
        <p v-if="fromGroup && (debt.start_date || debt.created_at)" class="text-sm text-gray-500 mt-0.5">{{ uiTexts.debtDate }}: {{ formatDate(debt.start_date || debt.created_at) }}</p>
      </div>
    </div>

    <!-- Debt Info Card -->
    <div class="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div v-if="!fromGroup" class="flex items-center">
          <!-- 27.09 (S4-2): harfli doira ("BB") O'RNIGA odam avatari (siluet ikonka); doira foni saqlandi -->
          <div
            class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            :class="debt.type === 'borrowed' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'"
          >
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <div class="ml-4">
            <div class="flex items-center gap-1.5">
              <p class="text-lg font-semibold text-gray-900">{{ debt.source_name }}</p>
              <!-- 01.10 (doc3 4-rasm): "Tahrirlash" amali OLIB TASHLANDI (foydalanuvchi talabi). -->
            </div>
            <p v-if="debt.phone" class="text-sm text-gray-500">{{ formatPhone(debt.phone) }}</p>
            <!-- SS-9: tur belgisi endi ism ostida (amal tugmalari qatoridan olindi) -->
            <span
              class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              :class="debt.type === 'borrowed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
            >
              {{ debt.type === 'borrowed' ? $t('finance.borrowed') : $t('finance.lent') }}
            </span>
          </div>
        </div>
        <!-- SS-9 (2026-09-18): amal tugmalari kattaroq + ikonli; tur belgisi ("Berilgan qarz")
             bu qatordan OLINDI (endi ism yonida) — chunki qolgan 3 tugma amal bajaradi. -->
        <!-- SS-DEV (2026-09-24): `isActive` — 'active' VA 'overdue' (muddati o'tgan) holatlar.
             ILDIZ SABAB (21-rasm): holati `overdue` bo'lgan qarzda `status === 'active'`
             shartli BARCHA tugmalar (to'lov, talab, voz kechish, yopish) yashirinib qolardi. -->
        <!-- 30.09 (doc1 16-rasm): "Yana qarz berish/olish" bu sahifadan OLIB TASHLANDI — yangi qarz kontragent
             sahifasidagi "Yana qarz berish" orqali kiritiladi.
             30.09 (doc1 20-rasm): "Qarzni qaytarish" va pastdagi "Qarzni yopish" BITTA amal: oyna — to'liq
             (butun qoldiq, qarz yopiladi) yoki qisman (kiritilgan summa). -->
        <div class="flex items-center flex-wrap gap-2 flex-shrink-0 justify-end" :class="fromGroup ? 'ml-auto' : ''">
          <button v-if="isActive" @click="openPay" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
            {{ settleTitle }}
          </button>
          <button
            v-if="isActive && debt.type === 'lent' && debt.phone"
            @click="demandRepay" :disabled="demandBusy"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-60 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {{ demandBusy ? $t('common.loading') : uiTexts.demand }}
          </button>
          <!-- SS-DEV (2026-09-24): voz kechish ikonkasi — yurakcha/kaptar o'rniga "taqiq" (aylana+chiziq) -->
          <button
            v-if="isActive && debt.type === 'lent'"
            @click="askForgive" :disabled="forgiveBusy"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 disabled:opacity-60 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
            {{ forgiveBusy ? $t('common.loading') : uiTexts.forgive }}
          </button>
          <!-- SS-DEV (2026-09-24): O'CHIRISH tugmasi O'NG YUQORIDA (foydalanuvchi talabi);
               tugallangan qarz uchun bir tomonlama (faqat mening ro'yxatimdan). -->
          <!-- SS-DEV (2026-09-24): "O'chirish" FAQAT tugallangan qarzda (6-rasm: faol/jarayondagi
               qarzda ham chiqardi). Faol qarz avval yopiladi yoki voz kechiladi. -->
          <button
            v-if="debt.status === 'completed'"
            @click="askDelete"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            title="Faqat mening ro‘yxatimdan o‘chirish"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>

      <!-- Amount Details -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.total_amount') }}</p>
          <p class="text-xl font-bold text-gray-900">{{ formatMoney(debt.amount) }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.paid_amount') }}</p>
          <p class="text-xl font-bold text-green-600">{{ formatMoney(paidAmount) }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.remaining') }}</p>
          <p class="text-xl font-bold" :class="debt.type === 'borrowed' ? 'text-red-600' : 'text-blue-600'">
            {{ formatMoney(debt.remaining_amount) }}
          </p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.progress') }}</p>
          <p class="text-xl font-bold text-gray-900">{{ paidPercent }}%</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all"
            :class="debt.type === 'borrowed' ? 'bg-red-500' : 'bg-green-500'"
            :style="{ width: paidPercent + '%' }"
          ></div>
        </div>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-500">{{ $t('finance.debt_date') }}</p>
          <p class="font-medium">{{ debt.created_at ? formatDateTime(debt.created_at) : formatDate(debt.start_date) }}</p>
        </div>
        <div>
          <!-- SS6: tugallangan + muddatsiz qarz uchun HAQIQIY qaytarilgan sana ko'rsatiladi -->
          <p class="text-gray-500">{{ (debt.status === 'completed' && !debt.due_date) ? $t('finance.returned_date') : $t('finance.due_date') }}</p>
          <p class="font-medium" :class="isOverdue ? 'text-red-600' : ''">
            {{ dueDisplay }}
            <span v-if="isOverdue" class="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {{ $t('finance.overdue') }}
            </span>
          </p>
        </div>
      </div>

      <!-- Description -->
      <div v-if="debt.notes" class="mt-4 pt-4 border-t">
        <p class="text-sm text-gray-500 mb-1">{{ $t('finance.notes') }}</p>
        <p class="text-gray-700">{{ botNoteText(debt.notes, $i18n.locale) }}</p>
      </div>
    </div>

    <!-- 29.09 (doc1 21-rasm): "Tavsiya" bloki bu sahifadan KONTRAGENT sahifasiga
         (finance/debts/group/_key) ko'chirildi — tavsiya qarzga emas, shaxsga tegishli. -->

    <!-- SS-DEV (2026-09-27), 26.09 hujjat 4-band (8-rasm): pastdagi "To'lov qo'shish" formasi OLIB
         TASHLANDI — endi tepadagi tugmalar qatorida "💳 Qarzni qaytarish" (och yashil) va MODAL:
         summa ("10 000" formatida), sana, izoh (ixtiyoriy), SMS xabarnoma. `addPayment` mantig'i
         (qoldiqdan oshmasin validatsiyasi, notify_sms) O'ZGARMADI. -->
    <div v-if="showPay" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="closePay"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl overflow-y-auto" style="max-height: 92vh;">
        <div class="flex items-center justify-between mb-1">
          <h3 class="text-lg font-bold text-gray-900">{{ settleTitle }}</h3>
          <button type="button" @click="closePay" class="text-gray-400 hover:text-gray-600" aria-label="close"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <p class="text-xs text-gray-500 mb-4">{{ payTexts.remaining }}: <span class="font-semibold text-gray-700">{{ formatMoney(debt.remaining_amount) }}</span></p>
        <form @submit.prevent="addPayment" class="space-y-3">
          <div class="grid grid-cols-2 gap-1 p-1 rounded-xl" style="background:#F3F4F6">
            <button type="button" class="py-2 rounded-lg text-sm font-semibold transition-colors" :style="payFull ? 'background:#fff;color:#111827;box-shadow:0 1px 2px rgba(0,0,0,.08)' : 'color:#4B5563'" @click="setPayFull(true)">{{ uiTexts.full }}</button>
            <button type="button" class="py-2 rounded-lg text-sm font-semibold transition-colors" :style="payFull ? 'color:#4B5563' : 'background:#fff;color:#111827;box-shadow:0 1px 2px rgba(0,0,0,.08)'" @click="setPayFull(false)">{{ uiTexts.part }}</button>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.payment_amount') }} *</label>
            <div class="relative">
              <input
                v-model="paymentAmountDisplay"
                type="text"
                inputmode="numeric"
                :readonly="payFull"
                :style="payFull ? 'background:#F9FAFB;color:#374151' : ''"
                class="w-full px-4 py-2.5 border rounded-xl focus:ring-2 pr-16"
                :class="paymentOverRemaining ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'"
                :placeholder="fmtNum(debt.remaining_amount)"
              />
              <span class="absolute right-4 text-gray-500" style="top: 50%; transform: translateY(-50%);">{{ debt.currency || 'UZS' }}</span>
            </div>
            <!-- SS-DEV (2026-09-24): qoldiqdan ortiq summa — darhol ogohlantirish -->
            <p v-if="paymentOverRemaining" class="text-xs text-red-600 mt-1">{{ payTexts.over }} ({{ formatMoney(debt.remaining_amount) }})</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ payTexts.date }}</label>
            <date-picker
              v-model="paymentDate"
              value-type="YYYY-MM-DD"
              format="DD.MM.YYYY"
              :lang="dpLang"
              :editable="false"
              :clearable="false"
              placeholder="kun.oy.yil"
              class="w-full"
              input-class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.notes') }} <span class="font-normal text-gray-400">({{ payTexts.optional }})</span></label>
            <textarea v-model="paymentNotes" rows="1" maxlength="255" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none" :placeholder="$t('finance.notes_placeholder')"></textarea>
          </div>
          <!-- SS5: to'lov qayd etilgach qarama-qarshi tomonga xabar SMS (ixtiyoriy). -->
          <div v-if="debt.phone" class="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-xl">
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-800">📩 {{ $t('finance.debt_notify_sms') }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ $t('finance.payment_notify_sms_hint') }}</p>
            </div>
            <button type="button" @click="paymentNotifySms = !paymentNotifySms" :class="paymentNotifySms ? 'bg-blue-600' : 'bg-gray-300'" class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors mt-0.5">
              <span :class="paymentNotifySms ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"></span>
            </button>
          </div>
          <div class="flex gap-2 pt-2">
            <button type="button" @click="closePay" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
            <button
              type="submit"
              :disabled="paymentLoading || paymentOverRemaining || !(Number(paymentAmount) > 0)"
              class="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold whitespace-nowrap"
              :style="(paymentLoading || paymentOverRemaining || !(Number(paymentAmount) > 0)) ? 'opacity:.6' : ''"
            >{{ paymentLoading ? $t('common.loading') : (payFull ? uiTexts.closeYes : uiTexts.recordYes) }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 30.09 (doc1 18/21-rasm): "Talab qilish" — karta kiritilmagan bo'lsa umumiy karta oynasi ochiladi;
         saqlangach talab SMS'i avtomatik yuboriladi (ikki marta qizil xabar yo'q). -->
    <PayoutCardModal v-if="showCardForm" intent="demand" @close="showCardForm = false" @saved="onCardSaved" />

    <!-- Amaliyotlar tarixi (SS3): boshlang'ich qarz + qo'shimcha qarzlar + to'lovlar -->
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('finance.operations_history') }}</h3>
      <div v-if="operations.length" class="space-y-3">
        <!-- SS-DEV (2026-09-24): har bir to'lov/voz kechish qatorida KIM va QACHON
             kiritgani (har qism alohida); 'forgive' — voz kechish vaqti. -->
        <div
          v-for="(op, i) in operations"
          :key="i"
          class="flex items-center justify-between gap-3 p-4 rounded-xl"
          :class="op.kind === 'payment' ? 'bg-green-50' : (op.kind === 'forgive' ? 'bg-rose-50' : 'bg-gray-50')"
        >
          <div class="min-w-0">
            <p class="font-medium">
              <span v-if="op.kind === 'payment'" class="text-green-600">− {{ formatMoney(op.amount) }}</span>
              <span v-else-if="op.kind === 'forgive'" class="text-rose-600">🚫 {{ formatMoney(op.amount) }}</span>
              <span v-else :class="op.kind === 'increase' ? 'text-blue-600' : 'text-gray-900'">+ {{ formatMoney(op.amount) }}</span>
            </p>
            <p class="text-sm text-gray-500">{{ formatDateTime(op.date) }}</p>
            <p v-if="op.by" class="text-xs mt-0.5" :class="op.byRole === 'counterparty' ? 'text-indigo-600 font-medium' : 'text-gray-500'">
              👤 {{ op.by }}
            </p>
            <p v-if="op.note" class="text-xs text-gray-400 mt-0.5">{{ op.note }}</p>
          </div>
          <span
            class="text-sm font-semibold flex-shrink-0 text-right"
            :class="op.kind === 'payment' ? 'text-green-600' : (op.kind === 'increase' ? 'text-blue-600' : (op.kind === 'forgive' ? 'text-rose-600' : 'text-gray-600'))"
          >{{ opLabel(op.kind) }}</span>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-400">
        <p>{{ $t('finance.no_operations') }}</p>
      </div>
    </div>

    <!-- SS-DEV (2026-09-24): O'chirish tugmasi ENDI O'NG YUQORIDA (sarlavha qatorida);
         tugallangan qarz uchun bir tomonlama — faqat mening ro'yxatimdan. -->

    <!-- 30.09 (doc1 20-rasm): pastdagi "Qarzni yopish" tugmasi yuqoridagi yagona amalga birlashtirildi. -->

    <!-- 30.09 (doc1 16-rasm): "Yana qarz berish/olish" (qo'shimcha qarz) oynasi olib tashlandi — yangi qarz
         kontragent sahifasidagi "Yana qarz berish" orqali kiritiladi. -->

    <!-- 01.10 (doc3 4-rasm): qarzni tahrirlash oynasi olib tashlandi ("Tahrirlash" amali yo'q). -->
    <!-- SS-19 (2026-09-19): native confirm() O'RNIGA markazlashgan modal -->
    <ConfirmModal
      v-if="confirmKind"
      :title="confirmCfg.title"
      :message="confirmCfg.message"
      :confirm-text="confirmCfg.confirmText"
      :tone="confirmCfg.tone"
      :icon="confirmCfg.icon"
      :busy="forgiveBusy"
      @cancel="confirmKind = ''"
      @confirm="onConfirmAccept"
    />
</div>
</template>

<script>
// SS-DEV (2026-09-24): bot izohi ("[bot] Telegram orqali qo'shildi") 3 tilda "Telegram bot orqali qo'shildi" (2-rasm)
import { botNoteText, formatMoneyCur, formatPhoneUz, fmtDMY } from '~/utils/helpers'; // 27.09 (S4-3): +fmtDMY; 29.09: formatDateLocale olib tashlandi

// SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band: `?tab=` → ro'yxat sahifasi turi (yangi va eski qiymatlar)
// 30.09: umumiy "Orqaga" va karta oynasi
import PageBackButton from '~/components/ui/PageBackButton.vue'
import PayoutCardModal from '~/components/finance/PayoutCardModal.vue'

const LIST_KIND_BY_TAB = {
  given: 'given', taken: 'taken', 'overdue-given': 'overdue-given', 'overdue-taken': 'overdue-taken', completed: 'completed', all: 'all',
  lent: 'given', lent_overdue: 'overdue-given', borrowed: 'taken', borrowed_overdue: 'overdue-taken', active: 'all',
};

export default {
  name: 'DebtDetail',
  middleware: 'auth',
  components: { PageBackButton, PayoutCardModal },

  data() {
    return {
      debt: {
        payments: []
      },
      paymentAmount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentLoading: false,
      paymentNotifySms: false, // SS5
      // SS-DEV (2026-09-27), 26.09 hujjat 4-band: "Qarzni qaytarish" modali + ixtiyoriy izoh
      showPay: false,
      payFull: true, // 30.09 (doc1 20-rasm): to'liq yopish (butun qoldiq) | qisman
      paymentNotes: '',
      // SS2: shaxsiy plastik karta (qarzni qaytarishni talab qilish uchun)
      payoutReady: true,
      payoutBusy: false,
      demandBusy: false,
      // SS9 (2026-09-17): karta formasi endi default YASHIRIN — faqat "talab qilish"
      // bosilib, karta topilmaganда ochiladi.
      showCardForm: false,
      forgiveBusy: false,
      // SS-19 (2026-09-19): markazlashgan tasdiqlash modali ('' | forgive | complete | delete)
      confirmKind: '',
      loading: true
    }
  },

  computed: {
    // SS-19 (2026-09-19): tasdiqlash modalining matni — amal turiga qarab.
    confirmCfg() {
      if (this.confirmKind === 'forgive') return {
        title: this.$t('finance.debt_forgive') || 'Qarzdan voz kechish',
        message: 'Qolgan summa hisobdan chiqariladi va qarz yopiladi. Pul qaytmaydi.',
        // SS-DEV (2026-09-24): voz kechishga mos ikonka — 🚫 (qarz daftaridagi "Qarzdan voz
        // kechish" tugmasi bilan bir xil); sarlavha `finance.debt_forgive` kaliti tillarda bor.
        confirmText: 'Ha, voz kechaman', tone: 'danger', icon: '🚫',
      }
      if (this.confirmKind === 'complete') return {
        title: this.$t('finance.mark_completed') || 'Qarzni yopish',
        message: this.$t('finance.confirm_complete'),
        confirmText: this.$t('common.confirm'), tone: 'success', icon: '✓',
      }
      return {
        title: this.$t('common.delete') || "O'chirish",
        // SS-DEV (2026-09-24): tugallangan qarz — bir tomonlama o'chirish izohi
        message: this.debt && this.debt.status === 'completed'
          ? "Bu tugallangan qarz FAQAT sizning ro'yxatingizdan o'chiriladi — qarama-qarshi tomonda saqlanib qoladi."
          : this.$t('finance.confirm_delete'),
        confirmText: this.$t('common.delete') || "O'chirish", tone: 'danger', icon: '🗑',
      }
    },
    dpLang() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn')
    },
    paymentAmountDisplay: {
      get() { return this.paymentAmount === '' || this.paymentAmount == null ? '' : String(this.paymentAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') },
      set(v) { const r = String(v).replace(/\D/g, ''); this.paymentAmount = r ? Number(r) : '' }
    },
    // SS-DEV (2026-09-24): 'active' YOKI 'overdue' — ikkalasi ham "ochiq" qarz.
    isActive() {
      return this.debt.status === 'active' || this.debt.status === 'overdue'
    },
    isOverdue() {
      if (!this.debt.due_date || !this.isActive) return false
      return new Date(this.debt.due_date) < new Date()
    },
    // SS-DEV (2026-09-24): kiritilgan to'lov qoldiqdan oshsa — tugma o'chadi, ogohlantirish chiqadi.
    paymentOverRemaining() {
      const a = Number(this.paymentAmount) || 0
      return a > 0 && a > (Number(this.debt.remaining_amount) || 0) + 0.0001
    },
    // SS-DEV (2026-09-24): "Orqaga" — kontragent sahifasi (agar undan kelingan bo'lsa) + bo'lim.
    backLink() {
      const q = (this.$route && this.$route.query) || {}
      const tab = q.tab || ''
      if (q.group) {
        return this.localePath({ name: 'finance-debts-group-key', params: { key: q.group }, query: { tab } })
      }
      // SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band: ro'yxat endi alohida sahifada (list/:kind);
      // eski `lent/borrowed/...` qiymatlari ham xaritalanadi; noma'lum bo'lsa — bosh sahifa.
      const kind = LIST_KIND_BY_TAB[tab]
      if (kind) return this.localePath({ name: 'finance-debts-list-kind', params: { kind } })
      return this.localePath({ name: 'finance-debts' })
    },
    // 30.09 (doc1 16-rasm): kontragent sahifasidan kirilgan (ism/telefon u yerda — takrorlanmaydi)
    fromGroup() {
      return !!(this.$route && this.$route.query && this.$route.query.group)
    },
    // 30.09 (doc1 20-rasm): yagona amal nomi — berilgan qarzda "Qarzni yopish", olinganda "Qarzni qaytarish"
    settleTitle() {
      return this.debt.type === 'borrowed' ? this.payTexts.title : this.uiTexts.close
    },
    uiTexts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      const t = {
        uz: { close: 'Qarzni yopish', full: 'To‘liq', part: 'Qisman', closeYes: 'Yopish', recordYes: 'Qayd etish', demand: 'Talab qilish', forgive: 'Voz kechish', edit: 'Tahrirlash', debtDate: 'Qarz sanasi', demandOk: 'Qarzni qaytarish bo‘yicha SMS xabarnoma yuborildi.' },
        ru: { close: 'Закрыть долг', full: 'Полностью', part: 'Частично', closeYes: 'Закрыть', recordYes: 'Записать', demand: 'Потребовать', forgive: 'Простить', edit: 'Изменить', debtDate: 'Дата долга', demandOk: 'SMS с требованием вернуть долг отправлено.' },
        kr: { close: 'Қарзни ёпиш', full: 'Тўлиқ', part: 'Қисман', closeYes: 'Ёпиш', recordYes: 'Қайд этиш', demand: 'Талаб қилиш', forgive: 'Воз кечиш', edit: 'Таҳрирлаш', debtDate: 'Қарз санаси', demandOk: 'Қарзни қайтариш бўйича SMS хабарнома юборилди.' },
        en: { close: 'Close debt', full: 'In full', part: 'Partially', closeYes: 'Close', recordYes: 'Record', demand: 'Demand', forgive: 'Waive', edit: 'Edit', debtDate: 'Debt date', demandOk: 'Repayment demand SMS sent.' },
        kaa: { close: 'Qarızdı jabıw', full: 'Tolıq', part: 'Bólek', closeYes: 'Jabıw', recordYes: 'Dizimge alıw', demand: 'Talap etiw', forgive: 'Waz keshiw', edit: 'Ózgertiw', debtDate: 'Qarız sánesi', demandOk: 'Qarızdı qaytarıw boyınsha SMS jiberildi.' },
      }
      return t[l] || t.uz
    },
    // SS-DEV (2026-09-27), 26.09 hujjat 4-band: "Qarzni qaytarish" modali matnlari (5 til)
    payTexts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      const t = {
        uz: { title: 'Qarzni qaytarish', remaining: 'Qoldiq', date: "To'lov sanasi", optional: 'ixtiyoriy', over: 'Summa qoldiqdan oshmasligi kerak' },
        ru: { title: 'Вернуть долг', remaining: 'Остаток', date: 'Дата платежа', optional: 'необязательно', over: 'Сумма не должна превышать остаток' },
        kr: { title: 'Қарзни қайтариш', remaining: 'Қолдиқ', date: 'Тўлов санаси', optional: 'ихтиёрий', over: 'Сумма қолдиқдан ошмаслиги керак' },
        en: { title: 'Repay debt', remaining: 'Remaining', date: 'Payment date', optional: 'optional', over: 'Amount must not exceed the remaining balance' },
        kaa: { title: 'Qarızdı qaytarıw', remaining: 'Qaldıq', date: 'Tólem sánesi', optional: 'ıqtıyarlı', over: 'Summa qaldıqtan aspawı kerek' },
      }
      return t[l] || t.uz
    },

    // SS6: ko'rsatiladigan sana — muddat bo'lsa muddat; tugallangan+muddatsiz bo'lsa
    // oxirgi to'lov sanasi (haqiqiy qaytarilgan sana).
    // 27.09 (S4-3): qaytarish sanasi DD.MM.YYYY (nuqta bilan; ilgari toLocaleDateString → "26/09/2026").
    // Boshqa sanalar (Qarz sanasi, amaliyotlar) o'zgarmadi.
    dueDisplay() {
      if (this.debt.due_date) return fmtDMY(this.debt.due_date, '-')
      if (this.debt.status === 'completed') {
        const pays = (this.debt.payments || []).filter(p => !(p.notes && /^__(increase|forgive)__/.test(String(p.notes))))
        let last = 0, lastDate = null
        for (const p of pays) {
          const t = new Date(p.payment_date || p.created_at).getTime()
          if (t >= last) { last = t; lastDate = p.payment_date || p.created_at }
        }
        if (lastDate) return fmtDMY(lastDate, '-')
      }
      return '-'
    },

    paidAmount() {
      if (!this.debt.amount) return 0
      return this.debt.amount - (this.debt.remaining_amount || 0)
    },

    paidPercent() {
      if (!this.debt.amount || this.debt.amount <= 0) return 0
      return Math.round((this.paidAmount / this.debt.amount) * 100)
    },

    // SS3: Amaliyotlar tarixi — boshlang'ich qarz + qo'shimcha qarzlar (increase) + to'lovlar.
    // Qo'shimcha qarzlar debt_payments'da notes='__increase__' marker bilan yoziladi
    // (balansga ta'sir qilmaydi — balans remaining_amount'da). Boshlang'ich summa =
    // joriy amount − qo'shimcha qarzlar yig'indisi.
    operations() {
      const payments = this.debt.payments || []
      // Qo'shimcha qarz markeri: notes '__increase__' yoki '__increase__|<izoh>'
      const isInc = (p) => p.notes && String(p.notes).indexOf('__increase__') === 0
      // SS-DEV (2026-09-24): voz kechish markeri (`__forgive__|izoh`) — tarixda vaqti bilan.
      const isForgive = (p) => p.notes && String(p.notes).indexOf('__forgive__') === 0
      const increases = payments.filter(isInc)
      const forgives = payments.filter(isForgive)
      const realPayments = payments.filter(p => !isInc(p) && !isForgive(p))
      const incSum = increases.reduce((s, p) => s + Number(p.amount || 0), 0)
      const originalAmount = Math.max(0, Number(this.debt.amount || 0) - incSum)
      const ops = [{ kind: 'initial', amount: originalAmount, date: this.debt.created_at || this.debt.start_date, note: '', by: '' }]
      increases.forEach(p => ops.push({ kind: 'increase', amount: Number(p.amount), date: p.created_at || p.payment_date, note: (String(p.notes || '').split('|')[1] || ''), by: this.byLabel(p), byRole: p.created_by_role }))
      // To'lov izohi: "Qarz beruvchi qayd etdi — ..." kabi texnik matn endi `by` orqali ko'rsatiladi.
      realPayments.forEach(p => ops.push({ kind: 'payment', amount: Number(p.amount), date: p.created_at || p.payment_date, note: this.paymentNote(p), by: this.byLabel(p), byRole: p.created_by_role }))
      forgives.forEach(p => ops.push({ kind: 'forgive', amount: Number(p.amount), date: p.created_at || p.payment_date, note: '', by: this.byLabel(p), byRole: p.created_by_role }))
      /**
       * SS-DEV (2026-09-24): ILDIZ SABAB (5-rasm): `__forgive__` marker 24.09 da qo'shildi —
       * undan OLDIN voz kechilgan qarzlarda marker yo'q, shuning uchun "voz kechildi" qatori
       * chiqmasdi. Zaxira: qarz tugallangan + notes'da "Kechirilgan"/"voz kechildi" bo'lsa,
       * marker bo'lmasa ham sintetik qator (summa = qarz − haqiqiy to'lovlar, vaqt = updated_at).
       */
      if (!forgives.length && this.debt.status === 'completed' && /Kechirilgan|voz kechildi/i.test(String(this.debt.notes || ''))) {
        const paid = realPayments.reduce((s, p) => s + Number(p.amount || 0), 0)
        const forgiven = Math.max(0, Number(this.debt.amount || 0) - paid)
        if (forgiven > 0) ops.push({ kind: 'forgive', amount: forgiven, date: this.debt.updated_at || this.debt.created_at, note: '', by: '', byRole: '' })
      }
      ops.sort((a, b) => new Date(a.date) - new Date(b.date))
      return ops
    },
    // 29.09 (doc1 21-rasm): Tavsiya computed'lari (relClass/relTitle/relDesc) olib tashlandi —
    // blok kontragent sahifasida (`RecommendationCard`).
  },

  async mounted() {
    this.loadPayoutCard()
    await this.loadDebt()
  },

  methods: {
    botNoteText,
    async loadDebt() {
      try {
        this.loading = true
        const res = await this.$api.getDebtById(this.$route.params.id)
        if (res?.data?.success) {
          this.debt = res.data.data
        }
      } catch (error) {
        console.error('Load debt error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
        this.$router.push(this.localePath({ name: 'finance-debts' }))
      } finally {
        this.loading = false
      }
    },

    // SS2: karta rekvizitlari tayyormi (talab qilishdan oldin — oynani darhol ochish uchun).
    async loadPayoutCard() {
      try {
        const res = await this.$api.getPayoutCard()
        const d = (res && res.data && res.data.data) || {}
        this.payoutReady = !!d.ready
      } catch (e) { /* jim — backend baribir tekshiradi (no-card) */ }
    },
    // 30.09: karta oynasida saqlandi → talab darhol yuboriladi
    async onCardSaved() {
      this.showCardForm = false
      this.payoutReady = true
      await this.demandRepay()
    },
    /**
     * 30.09 (doc1 18/21-rasm): karta yo'q bo'lsa — XATO EMAS, karta oynasi ochiladi (bitta joyda,
     * toast'siz); bor bo'lsa SMS to'g'ridan-to'g'ri ketadi. API {silent} — xabar faqat shu yerda.
     */
    async demandRepay() {
      if (this.demandBusy) return
      if (!this.payoutReady) { this.showCardForm = true; return }
      try {
        this.demandBusy = true
        await this.$api.demandRepayment(this.debt.id)
        this.$toast?.success(this.uiTexts.demandOk)
      } catch (e) {
        const d = (e && e.response && e.response.data) || {}
        if (d.code === 'no-card') { this.payoutReady = false; this.showCardForm = true; return }
        this.$toast?.error(d.message || this.$t('errors.operationFailed'))
        // SS-DEV (2026-09-26): backend `sms-not-sent` + reason NO_PACKAGE — SMS paketi yo'q → Tariflar
        const reason = d.reason || (d.sms && d.sms.reason)
        if (d.code === 'sms-not-sent' && reason === 'NO_PACKAGE') this.$router.push(this.localePath({ name: 'price' }))
      } finally { this.demandBusy = false }
    },

    // SS-DEV (2026-09-24): to'lovni KIM kiritgani — "Siz" yoki ism (+ roli).
    byLabel(p) {
      if (!p) return ''
      const myId = this.$auth && this.$auth.user && this.$auth.user.id
      if (p.created_by && myId && Number(p.created_by) === Number(myId)) return 'Siz kiritdingiz'
      const name = p.created_by_name || ''
      if (p.created_by_role === 'counterparty') {
        // Qarama-qarshi tomon: men 'borrowed' bo'lsam — u qarz beruvchi, aks holda qarz oluvchi
        const role = this.debt.type === 'borrowed' ? 'qarz beruvchi' : 'qarz oluvchi'
        return (name || 'Hamkor') + ' kiritdi (' + role + ')'
      }
      return name ? name + ' kiritdi' : ''
    },
    // To'lov izohidan texnik "Qarz beruvchi qayd etdi — ..." qismini olib tashlaymiz.
    paymentNote(p) {
      const n = String((p && p.notes) || '')
      return n.split('|').map(s => s.trim()).filter(s => s && !/^Qarz beruvchi qayd etdi/.test(s)).join(' | ')
    },

    // SS-DEV (2026-09-27), 26.09 hujjat 4-band: "Qarzni qaytarish" modali ochish/yopish
    openPay() {
      if (!this.isActive) return
      this.setPayFull(true)
      this.paymentNotes = ''
      this.paymentDate = new Date().toISOString().split('T')[0]
      this.showPay = true
    },
    // 30.09 (doc1 20-rasm): To'liq — summa = butun qoldiq (qarz yopiladi); Qisman — foydalanuvchi kiritadi
    setPayFull(full) {
      this.payFull = !!full
      this.paymentAmount = full ? (Number(this.debt.remaining_amount) || 0) : ''
    },
    closePay() {
      if (this.paymentLoading) return
      this.showPay = false
    },
    // "1222222" → "1 222 222" (placeholder uchun; backend DECIMAL "79000.00" ni ham to'g'ri o'qiydi)
    fmtNum(v) {
      if (v === '' || v == null) return ''
      const n = Number(String(v).replace(/\s/g, '').replace(',', '.'))
      if (!isFinite(n)) return ''
      return String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    },

    async addPayment() {
      if (!(Number(this.paymentAmount) > 0)) return
      // SS-DEV (2026-09-24): qoldiqdan ortiq summa yuborilmaydi (backend ham tekshiradi).
      if (this.paymentOverRemaining) {
        this.$toast?.error(this.payTexts.over)
        return
      }
      try {
        this.paymentLoading = true
        const payload = {
          amount: this.paymentAmount,
          payment_date: this.paymentDate,
          notify_sms: !!this.paymentNotifySms && !!this.debt.phone // SS5
        }
        // SS-DEV (2026-09-27): izoh ixtiyoriy — bo'sh bo'lsa yuborilmaydi (avvalgi xulq saqlanadi)
        const note = String(this.paymentNotes || '').trim()
        if (note) payload.notes = note
        const res = await this.$api.addDebtPayment(this.debt.id, payload)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.payment_added'))
          this.paymentAmount = ''
          this.paymentNotes = ''
          this.paymentNotifySms = false
          this.showPay = false
          await this.loadDebt()
        }
      } catch (error) {
        console.error('Add payment error:', error)
        // 02.10 (2-rasm): server `code` bo'yicha joriy tilda (server matni o'zbekcha bo'lishi mumkin)
        const code = error.response?.data?.code
        this.$toast?.error(code === 'over-remaining' ? this.payTexts.over : (error.response?.data?.message || this.$t('errors.operationFailed')))
      } finally {
        this.paymentLoading = false
      }
    },

    // SS-19 (2026-09-19): native confirm() O'RNIGA markazlashgan ConfirmModal.
    askForgive() { if (!this.forgiveBusy) this.confirmKind = 'forgive' },
    askDelete() { this.confirmKind = 'delete' },
    onConfirmAccept() {
      const k = this.confirmKind
      if (k === 'forgive') return this.forgiveDebt()
      if (k === 'complete') return this.markCompleted()
      if (k === 'delete') return this.confirmDelete()
    },

    // SS9: qarzdan voz kechish (write-off) — faqat berilgan aktiv qarz.
    async forgiveDebt() {
      if (this.forgiveBusy) return
      try {
        this.forgiveBusy = true
        const res = await this.$api.forgivePersonalDebt(this.debt.id)
        if (res?.data?.success) {
          this.confirmKind = ''
          this.$toast?.success('Qarzdan voz kechildi')
          await this.loadDebt()
        }
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.forgiveBusy = false
      }
    },

    /**
     * 29.09: ILDIZ SABAB — ilgari PUT { status: 'completed' } yuborilardi, lekin backend (Audit H-7)
     * `status`/`remaining_amount`ni PUT orqali o'zgartirishga RUXSAT BERMAYDI: javob success, qarz esa
     * ochiq qolardi ("Qarzni yopish" hech narsa qilmasdi). Endi yopish = QOLDIQQA teng to'lovni qayd
     * etish (addPayment) — backend qoldiq 0 bo'lganda qarzni 'completed' qiladi; tarix va tavsiya ham to'g'ri.
     */
    async markCompleted() {
      const rem = Number(this.debt.remaining_amount) || 0
      if (!(rem > 0)) { this.confirmKind = ''; return }
      try {
        const d = new Date()
        const p = (n) => String(n).padStart(2, '0')
        const res = await this.$api.addDebtPayment(this.debt.id, { amount: rem, payment_date: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` })
        if (res?.data?.success) {
          this.confirmKind = ''
          this.$toast?.success(this.$t('finance.debt_completed'))
          await this.loadDebt()
        }
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      }
    },

    async confirmDelete() {
      try {
        const res = await this.$api.deleteDebt(this.debt.id)
        if (res?.data?.success) {
          this.confirmKind = ''
          this.$toast?.success(this.$t('finance.debt_deleted'))
          // SS-DEV (2026-09-24): kelgan bo'limga qaytamiz (kontragent sahifasi bo'sh qolishi mumkin — ro'yxatga)
          // SS-DEV (2026-09-27): ro'yxat endi alohida sahifada — kelgan ro'yxat turiga (yoki bosh sahifa)
          const kind = LIST_KIND_BY_TAB[(this.$route.query && this.$route.query.tab) || '']
          this.$router.push(kind ? this.localePath({ name: 'finance-debts-list-kind', params: { kind } }) : this.localePath({ name: 'finance-debts' }))
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      }
    },

    formatMoney(value) { return formatMoneyCur(value, this.debt.currency) }, // SS-AUDIT (2026-09-25): utils/helpers

    // 29.09 (doc2 3-rasm): sanalar "26.09.2026" ko'rinishida (nuqta bilan)
    formatDate(v) { return fmtDMY(v, '-') },

    // Sana + vaqt (UZ, +5 ofset — app konvensiyasi): "05.09.2026 15:51:22"
    formatDateTime(dt) {
      if (!dt) return '-'
      const d = new Date(dt)
      if (isNaN(d)) return this.formatDate(dt)
      const x = new Date(d.getTime() + 5 * 3600 * 1000)
      const p = (n) => String(n).padStart(2, '0')
      return `${p(x.getUTCDate())}.${p(x.getUTCMonth() + 1)}.${x.getUTCFullYear()} ${p(x.getUTCHours())}:${p(x.getUTCMinutes())}:${p(x.getUTCSeconds())}`
    },

    // 27.09 (S4-1): brauzer tarixi bo'yicha orqaga; tarix bo'sh (URL to'g'ridan-to'g'ri ochilgan) bo'lsa —
    // mantiqiy ota-sahifa (`backLink`: kontragent sahifasi yoki ro'yxat).
    // (getInitials olib tashlandi — avatar endi ikonka, S4-2)
    goBack() {
      if (typeof window !== 'undefined' && window.history.length > 1) this.$router.back()
      else this.$router.push(this.backLink)
    },

    getSourceType(type) {
      const types = {
        bank: this.$t('finance.source_bank'),
        family: this.$t('finance.source_family'),
        friend: this.$t('finance.source_friend'),
        other: this.$t('finance.source_other')
      }
      return types[type] || type
    },

    // SS3 amaliyot yorlig'i
    opLabel(kind) {
      if (kind === 'payment') return this.$t('finance.op_payment')
      if (kind === 'increase') return this.$t('finance.op_increase')
      if (kind === 'forgive') return 'Voz kechildi' // SS-DEV (2026-09-24)
      return this.debt.type === 'borrowed' ? this.$t('finance.op_initial_borrowed') : this.$t('finance.op_initial_lent')
    },

    // Telefonni chiroyli format ("+998 90 123 45 67")
    formatPhone: formatPhoneUz, // SS-AUDIT (2026-09-25): utils/helpers
  }
}
</script>
