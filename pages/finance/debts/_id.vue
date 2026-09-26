<template>
  <div class="debt-detail pb-8">
    <!-- Page Header -->
    <div class="mb-6">
      <!-- SS-DEV (2026-09-24): "Orqaga" — kelgan joyga (kontragent sahifasi + bo'lim) qaytadi -->
      <nuxt-link :to="backLink" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ debt.source_name }}</h1>
    </div>

    <!-- Debt Info Card -->
    <div class="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div
            class="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
            :class="debt.type === 'borrowed' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'"
          >
            {{ getInitials(debt.source_name) }}
          </div>
          <div class="ml-4">
            <div class="flex items-center gap-1.5">
              <p class="text-lg font-semibold text-gray-900">{{ debt.source_name }}</p>
              <!-- SS5/SS6: qarzni tahrirlash (telefon/muddat/ism/izoh qo'shish) -->
              <button @click="openEdit" class="text-gray-400 hover:text-blue-600 flex-shrink-0" :title="$t('finance.edit_debt')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
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
        <div class="flex items-center flex-wrap gap-2 flex-shrink-0 justify-end">
          <button v-if="isActive" @click="openIncrease" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            {{ debt.type === 'borrowed' ? $t('finance.debt_increase_borrowed') : $t('finance.debt_increase_lent') }}
          </button>
          <!-- SS-DEV (2026-09-27), 26.09 hujjat 4-band: "💳 Qarzni qaytarish" — och yashil pastel;
               modal ochadi (pastdagi "To'lov qo'shish" formasi o'rniga). -->
          <button v-if="isActive" @click="openPay" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
            <span>💳</span>
            {{ payTexts.title }}
          </button>
          <button
            v-if="isActive && debt.type === 'lent' && debt.phone"
            @click="demandRepay" :disabled="demandBusy"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-60 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {{ demandBusy ? $t('common.loading') : 'Talab qilish' }}
          </button>
          <!-- SS-DEV (2026-09-24): voz kechish ikonkasi — yurakcha/kaptar o'rniga "taqiq" (aylana+chiziq) -->
          <button
            v-if="isActive && debt.type === 'lent'"
            @click="askForgive" :disabled="forgiveBusy"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-rose-100 text-rose-700 hover:bg-rose-200 disabled:opacity-60 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
            {{ forgiveBusy ? $t('common.loading') : 'Voz kechish' }}
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

    <!-- SS8: Tavsiya (shaxsning oldingi qarzlarini o'z vaqtida qaytarganiga qarab) -->
    <div class="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <h3 class="text-base font-bold text-gray-900">{{ $t('finance.recommendation') }}</h3>
      </div>
      <div class="flex items-start gap-3 p-3 rounded-xl" :class="relClass.box">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="relClass.icon">
          <svg class="w-5 h-5" :class="relClass.iconText" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="relClass.path"/></svg>
        </div>
        <div class="min-w-0">
          <p class="font-semibold" :class="relClass.title">{{ relTitle }}</p>
          <p class="text-sm text-gray-600">{{ relDesc }}<span v-if="reliability.total > 0" class="text-gray-400"> ({{ reliability.on_time }}/{{ reliability.total }} {{ $t('finance.rel_ontime') }})</span></p>
        </div>
      </div>
    </div>

    <!-- SS-DEV (2026-09-27), 26.09 hujjat 4-band (8-rasm): pastdagi "To'lov qo'shish" formasi OLIB
         TASHLANDI — endi tepadagi tugmalar qatorida "💳 Qarzni qaytarish" (och yashil) va MODAL:
         summa ("10 000" formatida), sana, izoh (ixtiyoriy), SMS xabarnoma. `addPayment` mantig'i
         (qoldiqdan oshmasin validatsiyasi, notify_sms) O'ZGARMADI. -->
    <div v-if="showPay" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="closePay"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl overflow-y-auto" style="max-height: 92vh;">
        <div class="flex items-center justify-between mb-1">
          <h3 class="text-lg font-bold text-gray-900">💳 {{ payTexts.title }}</h3>
          <button type="button" @click="closePay" class="text-gray-400 hover:text-gray-600" aria-label="close"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <p class="text-xs text-gray-500 mb-4">{{ payTexts.remaining }}: <span class="font-semibold text-gray-700">{{ formatMoney(debt.remaining_amount) }}</span></p>
        <form @submit.prevent="addPayment" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.payment_amount') }} *</label>
            <div class="relative">
              <input
                v-model="paymentAmountDisplay"
                type="text"
                inputmode="numeric"
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
            >{{ paymentLoading ? $t('common.loading') : payTexts.title }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- SS-9 (2026-09-18): "Talab qilish" bosilib karta yo'q bo'lsa — MODAL oyna ochiladi.
         Saqlangach talab bo'yicha SMS avtomatik yuboriladi (savePayout ichida). -->
    <div v-if="showCardForm && !payoutReady" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showCardForm = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
        <div class="flex items-center justify-between mb-1">
          <h3 class="font-bold text-gray-900">💳 Plastik karta ma’lumotlari</h3>
          <button type="button" @click="showCardForm = false" class="text-gray-400 hover:text-gray-600" aria-label="Yopish"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <p class="text-xs text-gray-500 mb-3">Qarzni qaytarishni talab qilish uchun avval karta rekvizitlarini kiriting. Saqlaganingizdan so‘ng qarzdorga SMS orqali aynan shu rekvizitlar yuboriladi.</p>
        <!-- SS-6 (2026-09-19): karta namunasi 0000..., Telegram telefon +998 tayyor -->
        <input v-model="payoutForm.card_number" type="text" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl mb-2 outline-none focus:ring-2 focus:ring-blue-500" />
        <input v-model="payoutForm.card_holder" type="text" maxlength="100" placeholder="Karta egasi (ixtiyoriy)" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl mb-2 outline-none focus:ring-2 focus:ring-blue-500" />
        <input v-model="payoutForm.telegram_phone" type="text" inputmode="numeric" maxlength="13" placeholder="+998901234567 (Telegram)" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
        <div class="flex gap-2">
          <button @click="showCardForm = false" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
          <button @click="savePayout" :disabled="payoutBusy" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold">
            {{ payoutBusy ? $t('common.loading') : 'Talab qilish' }}
          </button>
        </div>
      </div>
    </div>

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

    <!-- Actions -->
    <div v-if="isActive" class="mt-6 flex gap-4">
      <button
        @click="askComplete"
        class="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
      >
        {{ $t('finance.mark_completed') }}
      </button>
    </div>

    <!-- SS1: Qo'shimcha qarz (Yana qarz olish/berish) — to'liq forma modali -->
    <div v-if="showIncrease" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="closeIncrease"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl overflow-y-auto" style="max-height: 92vh;">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">{{ debt.type === 'borrowed' ? $t('finance.debt_increase_borrowed') : $t('finance.debt_increase_lent') }}</h3>
          <button @click="closeIncrease" class="text-gray-400 hover:text-gray-600" aria-label="close"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.amount') }} *</label>
            <div class="relative">
              <input v-model="increaseDisplay" type="text" inputmode="numeric" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 pr-16" :placeholder="$t('finance.debt_increase_ph')" />
              <span class="absolute right-4 text-gray-500" style="top: 50%; transform: translateY(-50%);">{{ debt.currency || 'UZS' }}</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.debt_date') }}</label>
            <date-picker v-model="increaseForm.date" value-type="YYYY-MM-DD" format="DD.MM.YYYY" :lang="dpLang" :editable="false" :clearable="false" placeholder="kun.oy.yil" class="w-full" input-class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.due_date') }}</label>
            <date-picker v-model="increaseForm.due_date" value-type="YYYY-MM-DD" format="DD.MM.YYYY" :lang="dpLang" :editable="false" placeholder="kun.oy.yil" class="w-full" input-class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.notes') }}</label>
            <textarea v-model="increaseForm.notes" rows="1" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none" :placeholder="$t('finance.notes_placeholder')"></textarea>
          </div>
          <div v-if="debt.phone" class="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-xl">
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-800">📩 {{ $t('finance.debt_notify_sms') }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ $t('finance.debt_notify_sms_hint') }}</p>
            </div>
            <button type="button" @click="increaseForm.notify_sms = !increaseForm.notify_sms" :class="increaseForm.notify_sms ? 'bg-blue-600' : 'bg-gray-300'" class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors mt-0.5">
              <span :class="increaseForm.notify_sms ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"></span>
            </button>
          </div>
        </div>
        <div class="flex gap-2 mt-5">
          <button @click="closeIncrease" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
          <button @click="increaseDebt" :disabled="increaseLoading" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ increaseLoading ? $t('common.loading') : $t('common.save') }}</button>
        </div>
      </div>
    </div>

    <!-- SS5/SS6: Qarzni tahrirlash modali (ism, telefon, qaytarish muddati, izoh) -->
    <div v-if="showEdit" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showEdit = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl overflow-y-auto" style="max-height: 92vh;">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.edit_debt') }}</h3>
          <button @click="showEdit = false" class="text-gray-400 hover:text-gray-600" aria-label="close"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.person_name') }} *</label>
            <input v-model="editForm.source_name" type="text" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.debt_phone') }}</label>
            <input :value="editForm.phone" @input="onEditPhone" type="tel" inputmode="tel" placeholder="+998 90 123 45 67" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.due_date') }}</label>
            <date-picker v-model="editForm.due_date" value-type="YYYY-MM-DD" format="DD.MM.YYYY" :lang="dpLang" :editable="false" placeholder="kun.oy.yil" class="w-full" input-class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.notes') }}</label>
            <textarea v-model="editForm.notes" rows="1" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
          </div>
        </div>
        <div class="flex gap-2 mt-5">
          <button @click="showEdit = false" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
          <button @click="saveEdit" :disabled="editLoading" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ editLoading ? $t('common.loading') : $t('common.save') }}</button>
        </div>
      </div>
    </div>
  
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
import { botNoteText, botNoteForSave, formatDateLocale, formatMoneyCur, formatPhoneUz } from '~/utils/helpers';

// SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band: `?tab=` → ro'yxat sahifasi turi (yangi va eski qiymatlar)
const LIST_KIND_BY_TAB = {
  given: 'given', taken: 'taken', 'overdue-given': 'overdue-given', 'overdue-taken': 'overdue-taken', completed: 'completed', all: 'all',
  lent: 'given', lent_overdue: 'overdue-given', borrowed: 'taken', borrowed_overdue: 'overdue-taken', active: 'all',
};

export default {
  name: 'DebtDetail',
  middleware: 'auth',

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
      payoutForm: { card_number: '', card_holder: '', telegram_phone: '+998' },
      showIncrease: false,
      increaseAmount: '',
      increaseLoading: false,
      increaseForm: { date: new Date().toISOString().split('T')[0], due_date: '', notes: '', notify_sms: false },
      showEdit: false,
      editLoading: false,
      editForm: { source_name: '', phone: '', due_date: '', notes: '' },
      reliability: { level: 'none', total: 0, on_time: 0, late: 0 },
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
    increaseDisplay: {
      get() { return this.increaseAmount === '' || this.increaseAmount == null ? '' : String(this.increaseAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') },
      set(v) { const r = String(v).replace(/\D/g, ''); this.increaseAmount = r ? Number(r) : '' }
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
    dueDisplay() {
      if (this.debt.due_date) return this.formatDate(this.debt.due_date)
      if (this.debt.status === 'completed') {
        const pays = (this.debt.payments || []).filter(p => !(p.notes && /^__(increase|forgive)__/.test(String(p.notes))))
        let last = 0, lastDate = null
        for (const p of pays) {
          const t = new Date(p.payment_date || p.created_at).getTime()
          if (t >= last) { last = t; lastDate = p.payment_date || p.created_at }
        }
        if (lastDate) return this.formatDate(lastDate)
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

    // SS8: Tavsiya uslubi + matni (ishonchlilik darajasiga qarab)
    relClass() {
      const m = {
        none:     { box: 'bg-gray-50',  icon: 'bg-gray-100',  iconText: 'text-gray-400',  title: 'text-gray-700',  path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        reliable: { box: 'bg-green-50', icon: 'bg-green-100', iconText: 'text-green-600', title: 'text-green-700', path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        medium:   { box: 'bg-amber-50', icon: 'bg-amber-100', iconText: 'text-amber-600', title: 'text-amber-700', path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        risky:    { box: 'bg-red-50',   icon: 'bg-red-100',   iconText: 'text-red-600',   title: 'text-red-700',   path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
      }
      return m[this.reliability.level] || m.none
    },
    relTitle() { return this.$t('finance.rel_' + this.reliability.level) },
    relDesc() { return this.$t('finance.rel_' + this.reliability.level + '_desc') }
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
          if (res.data.reliability) this.reliability = res.data.reliability
        }
      } catch (error) {
        console.error('Load debt error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
        this.$router.push(this.localePath({ name: 'finance-debts' }))
      } finally {
        this.loading = false
      }
    },

    // SS2: karta rekvizitlarini yuklash (talab qilish tugmasi shunga bog'liq).
    async loadPayoutCard() {
      try {
        const res = await this.$api.getPayoutCard()
        const d = res?.data?.data || {}
        this.payoutReady = !!d.ready
        this.payoutForm = {
          card_number: d.card_number || '',
          card_holder: d.card_holder || '',
          telegram_phone: d.telegram_phone || '+998',
        }
      } catch (e) { /* jim — backend baribir tekshiradi */ }
    },
    async savePayout() {
      if (this.payoutBusy) return
      try {
        this.payoutBusy = true
        await this.$api.savePayoutCard(this.payoutForm)
        this.$toast?.success(this.$t('common.saved') || 'Saqlandi')
        await this.loadPayoutCard()
        // SS9: karta saqlangach formani yopamiz; niyat "talab qilish" bo'lgani uchun
        // karta tayyor bo'lsa SMS avtomatik yuboriladi.
        this.showCardForm = false
        if (this.payoutReady) await this.demandRepay()
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('errors.operationFailed'))
      } finally { this.payoutBusy = false }
    },
    async demandRepay() {
      if (this.demandBusy) return
      // SS9: karta yo'q bo'lsa — shu tugma bosilgandagina karta formasini ochamiz.
      if (!this.payoutReady) {
        this.showCardForm = true
        this.$toast?.error('Avval plastik karta ma’lumotlarini kiriting')
        return
      }
      try {
        this.demandBusy = true
        await this.$api.demandRepayment(this.debt.id)
        this.$toast?.success('Qarzni qaytarish bo‘yicha sms xabarnoma yuborildi.')
      } catch (e) {
        const code = e.response?.data?.code
        if (code === 'no-card') { this.payoutReady = false; this.showCardForm = true }
        this.$toast?.error(e.response?.data?.message || this.$t('errors.operationFailed'))
        // SS-DEV (2026-09-26): backend `sms-not-sent` + reason NO_PACKAGE — SMS paketi yo'q → Tariflar
        const reason = e.response?.data?.reason || e.response?.data?.sms?.reason
        if (code === 'sms-not-sent' && reason === 'NO_PACKAGE') this.$router.push(this.localePath({ name: 'price' }))
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
      this.paymentAmount = ''
      this.paymentNotes = ''
      this.paymentDate = new Date().toISOString().split('T')[0]
      this.showPay = true
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
        this.$toast?.error('To‘lov summasi qoldiqdan oshmasligi kerak')
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
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.paymentLoading = false
      }
    },

    // SS5/SS6: qarzni tahrirlash — telefon/muddat/ism/izoh qo'shish yoki o'zgartirish
    openEdit() {
      this.editForm = {
        source_name: this.debt.source_name || '',
        phone: this.debt.phone || '',
        due_date: this.debt.due_date ? String(this.debt.due_date).slice(0, 10) : '',
        // SS-DEV (2026-09-24): bot markeri o'rniga o'qiladigan matn (saqlashda o'zgarmasa asl qoladi)
        notes: botNoteText(this.debt.notes || '', this.$i18n.locale)
      }
      this.showEdit = true
    },
    onEditPhone(e) {
      this.editForm.phone = this.formatUzPhone(e && e.target ? e.target.value : '')
    },
    formatUzPhone(raw) {
      let d = String(raw == null ? '' : raw).replace(/\D/g, '')
      if (!d.startsWith('998')) { d = d.startsWith('0') ? '998' + d.slice(1) : '998' + d }
      d = d.slice(0, 12)
      const rest = d.slice(3)
      let out = '+998'
      if (rest.length) out += ' ' + rest.slice(0, 2)
      if (rest.length > 2) out += ' ' + rest.slice(2, 5)
      if (rest.length > 5) out += ' ' + rest.slice(5, 7)
      if (rest.length > 7) out += ' ' + rest.slice(7, 9)
      return out
    },
    async saveEdit() {
      if (!String(this.editForm.source_name || '').trim()) { this.$toast?.error(this.$t('errors.operationFailed')); return }
      try {
        this.editLoading = true
        const payload = {
          source_name: this.editForm.source_name.trim(),
          phone: String(this.editForm.phone || '').replace(/[^\d+]/g, '') || null,
          due_date: this.editForm.due_date || null,
          notes: botNoteForSave(this.editForm.notes, this.debt.notes, this.$i18n.locale) || null
        }
        const res = await this.$api.updateDebt(this.debt.id, payload)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.debt_updated') || this.$t('common.save'))
          this.showEdit = false
          await this.loadDebt()
        }
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.editLoading = false
      }
    },

    // SS1: "Yana qarz olish/berish" modalini ochish (toza maydonlar)
    openIncrease() {
      this.increaseAmount = ''
      this.increaseForm = { date: new Date().toISOString().split('T')[0], due_date: '', notes: '', notify_sms: false }
      this.showIncrease = true
    },
    closeIncrease() {
      this.showIncrease = false
      this.increaseAmount = ''
    },

    async increaseDebt() {
      const amt = Number(this.increaseAmount)
      if (!(amt > 0)) return
      try {
        this.increaseLoading = true
        // SS1: to'liq forma — summa + sana + qaytarish sanasi + izoh + SMS
        const res = await this.$api.increaseDebt(this.debt.id, {
          amount: amt,
          date: this.increaseForm.date || undefined,
          due_date: this.increaseForm.due_date || undefined,
          notes: this.increaseForm.notes || undefined,
          notify_sms: !!this.increaseForm.notify_sms
        })
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.debt_increased'))
          this.increaseAmount = ''
          this.showIncrease = false
          await this.loadDebt()
        }
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.increaseLoading = false
      }
    },

    // SS-19 (2026-09-19): native confirm() O'RNIGA markazlashgan ConfirmModal.
    askForgive() { if (!this.forgiveBusy) this.confirmKind = 'forgive' },
    askComplete() { this.confirmKind = 'complete' },
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

    async markCompleted() {
      try {
        const res = await this.$api.updateDebt(this.debt.id, { status: 'completed' })
        if (res?.data?.success) {
          this.confirmKind = ''
          this.$toast?.success(this.$t('finance.debt_completed'))
          await this.loadDebt()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
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

    formatDate: formatDateLocale, // SS-AUDIT (2026-09-25): utils/helpers (Safari-xavfsiz parse)

    // Sana + vaqt (UZ, +5 ofset — app konvensiyasi): "05.09.2026 15:51:22"
    formatDateTime(dt) {
      if (!dt) return '-'
      const d = new Date(dt)
      if (isNaN(d)) return this.formatDate(dt)
      const x = new Date(d.getTime() + 5 * 3600 * 1000)
      const p = (n) => String(n).padStart(2, '0')
      return `${p(x.getUTCDate())}.${p(x.getUTCMonth() + 1)}.${x.getUTCFullYear()} ${p(x.getUTCHours())}:${p(x.getUTCMinutes())}:${p(x.getUTCSeconds())}`
    },

    getInitials(name) {
      if (!name) return '?'
      return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
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
