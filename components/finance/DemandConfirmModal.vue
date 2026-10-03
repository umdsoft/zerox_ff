<template>
  <!-- 03.10 (sayt hujjati, 4-rasm; mobil DemandConfirmModal.tsx bilan bir xil oqim): "Talab SMS yuborilsinmi?"
       markaziy oynasi. "Talab qilish" bosilganda SMS DARHOL ketmaydi — avval oldin kiritilgan karta (yashirilgan
       raqam, Uzcard/Humo, egasi), Telegram telefoni va SMS matni ko'rsatiladi:
         • "Ha, yuborish" — talab SMS yuboriladi (`confirm`);
         • X / fon / "Bekor qilish" / Esc — oyna yopiladi, SMS YUBORILMAYDI (`close`);
         • "Kartani o'zgartirish" — `inlineEdit` bo'lsa shu oynaning o'zida forma (`save-card`), aks holda
           ota sahifa karta oynasini ochadi (`change-card`) va saqlangach shu oynani yangi karta bilan qaytaradi.
       Shaxsiy qarz (kontragent / qarz sahifasi) va Qarz daftari (mijoz sahifasi) uchun YAGONA komponent.
       Ranglar inline (Tailwind v2, JIT o'chiq — ixtiyoriy klasslar yo'q). -->
  <div
    class="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4"
    style="z-index: 125"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
    @keydown.esc="close"
  >
    <div class="absolute inset-0" style="background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)" @click="close"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md flex flex-col" style="max-height: 92vh">
      <button
        type="button"
        class="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        style="z-index: 2"
        :aria-label="t.close"
        :disabled="locked"
        @click="close"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <!-- ===== Sarlavha ===== -->
      <div class="px-6 pt-6 pb-3 text-center">
        <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" :style="view === 'edit' ? 'background:#DBEAFE;color:#1D4ED8' : 'background:#FEF3C7;color:#B45309'">
          <svg v-if="view === 'edit'" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
        </div>
        <h3 :id="titleId" class="text-lg font-bold text-gray-900">{{ view === 'edit' ? t.editTitle : t.title }}</h3>
        <p class="text-sm text-gray-500 mt-1.5 leading-relaxed">{{ view === 'edit' ? editSubtitle : (card ? t.subCard : t.subNoCard) }}</p>
      </div>

      <!-- ===== 1) Tasdiq ko'rinishi ===== -->
      <template v-if="view === 'confirm'">
        <div class="px-6 overflow-y-auto" style="max-height: 58vh">
          <!-- Qabul qiluvchi (qarzdor) -->
          <div v-if="recipientPhone || recipientName" class="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 mb-3" style="background:#F9FAFB;border:1px solid #F3F4F6">
            <span class="text-xs text-gray-500">{{ t.recipient }}</span>
            <span class="text-sm font-semibold text-gray-900 text-right min-w-0 truncate">{{ recipientName }}<template v-if="recipientName && recipientPhone"> · </template>{{ fmtPhone(recipientPhone) }}</span>
          </div>

          <template v-if="card">
            <!-- Plastik karta (yashirilgan raqam) -->
            <div class="demand-card relative overflow-hidden rounded-2xl p-5 text-white">
              <div class="flex items-center justify-between">
                <span class="demand-card__chip" aria-hidden="true"></span>
                <span v-if="bank" class="text-sm font-bold tracking-wide">{{ bank }}</span>
              </div>
              <p class="demand-card__number mt-5 font-semibold" :aria-label="t.cardNumber + ': ' + maskedNumber">{{ maskedNumber }}</p>
              <p class="text-xs mt-4" style="color: rgba(255,255,255,.7)">{{ t.holder }}</p>
              <p class="text-sm font-semibold truncate" style="letter-spacing:.04em">{{ holderText }}</p>
            </div>
            <div class="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 mt-3" style="background:#F9FAFB;border:1px solid #F3F4F6">
              <span class="text-xs text-gray-500">{{ t.tgPhone }}</span>
              <span class="text-sm font-semibold text-gray-900 text-right">
                {{ fmtPhone(tgShown) || '—' }}
                <span v-if="!card.telegramPhone && tgFallback" class="block text-xs font-normal text-gray-400">{{ t.tgFromAccount }}</span>
              </span>
            </div>
          </template>
          <div v-else class="flex items-start gap-2 rounded-xl p-3 text-sm" style="background:#FFFBEB;border:1px solid #FDE68A;color:#92400E">
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{ noCardNote || t.noCard }}</span>
          </div>

          <button
            v-if="canChangeCard"
            type="button"
            class="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-colors"
            style="color:#1D4ED8;background:#EFF6FF"
            :disabled="locked"
            @click="changeCard"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            {{ card ? t.changeCard : t.addCard }}
          </button>

          <!-- SMS matni ko'rinishi -->
          <div v-if="preview" class="mt-4">
            <p class="text-xs font-semibold text-gray-500 mb-1.5">{{ t.smsText }}</p>
            <div class="rounded-2xl px-4 py-3 text-sm leading-relaxed text-gray-800" style="background:#F3F4F6;border-top-left-radius:6px">{{ preview }}</div>
          </div>
        </div>

        <div class="flex gap-2 p-6 pt-4">
          <button type="button" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm" :disabled="locked" @click="close">{{ t.cancel }}</button>
          <button
            ref="confirmBtn"
            type="button"
            class="flex-1 py-2.5 text-white rounded-xl font-semibold text-sm whitespace-nowrap inline-flex items-center justify-center gap-1.5"
            :style="'background:#D97706;' + (locked ? 'opacity:.6;cursor:not-allowed' : '')"
            :disabled="locked"
            @click="confirm"
          >
            <svg v-if="!busy" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
            {{ busy ? t.sending : t.send }}
          </button>
        </div>
      </template>

      <!-- ===== 2) Karta formasi (inlineEdit) ===== -->
      <form v-else class="flex flex-col min-h-0" novalidate @submit.prevent="saveCard">
        <div class="px-6 overflow-y-auto" style="max-height: 58vh">
          <label class="block text-xs font-semibold text-gray-600 mb-1" :for="titleId + '-card'">{{ t.cardNumber }} *</label>
          <input
            :id="titleId + '-card'"
            ref="cardInput"
            :value="form.card"
            type="text"
            inputmode="numeric"
            autocomplete="cc-number"
            maxlength="19"
            placeholder="8600 1234 5678 9012"
            class="w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2"
            :class="showCardErr ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'"
            @input="onCardInput"
          />
          <p v-if="showCardErr" class="text-xs text-red-600 mt-1">{{ cardErr }}</p>
          <p v-else class="text-xs text-gray-400 mt-1">{{ t.cardRule }}<template v-if="formBank"> · {{ formBank }}</template></p>

          <label class="block text-xs font-semibold text-gray-600 mb-1 mt-3" :for="titleId + '-holder'">{{ t.holder }}</label>
          <input
            :id="titleId + '-holder'"
            v-model="form.holder"
            type="text"
            maxlength="100"
            :placeholder="t.holderPh"
            class="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label class="block text-xs font-semibold text-gray-600 mb-1 mt-3" :for="titleId + '-tg'">{{ t.tgPhone }}{{ tgRequired ? ' *' : '' }}</label>
          <input
            :id="titleId + '-tg'"
            v-model="form.tg"
            type="text"
            inputmode="tel"
            maxlength="20"
            placeholder="+998901234567"
            class="w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none focus:ring-2"
            :class="showTgErr ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'"
          />
          <p v-if="showTgErr" class="text-xs text-red-600 mt-1">{{ tgErr }}</p>
          <p v-else class="text-xs text-gray-400 mt-1">{{ t.tgHint }}</p>
        </div>
        <div class="flex gap-2 p-6 pt-4">
          <button type="button" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm" :disabled="savingCard" @click="cancelEdit">{{ t.cancel }}</button>
          <button
            type="submit"
            class="flex-1 py-2.5 text-white rounded-xl font-semibold text-sm whitespace-nowrap"
            :style="'background:#2563EB;' + (savingCard ? 'opacity:.6;cursor:not-allowed' : '')"
            :disabled="savingCard"
          >{{ savingCard ? t.saving : t.saveContinue }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
/**
 * DemandConfirmModal — "Talab SMS yuborilsinmi?" (03.10).
 *
 * Props:
 *   - card:           { number, holder?, telegramPhone? } | null — joriy rekvizit (null — kiritilmagan)
 *   - tgFallback:     karta Telegram telefoni bo'sh bo'lsa SMS'da ko'rsatiladigan telefon (shaxsiy qarz: akkaunt telefoni)
 *   - recipientName / recipientPhone: SMS kimga ketadi (qarzdor)
 *   - preview:        SMS matni (ixtiyoriy)
 *   - busy:           SMS yuborilmoqda
 *   - canChangeCard:  "Kartani o'zgartirish" ko'rinadimi (xodim — yo'q)
 *   - inlineEdit:     karta shu oynada tahrirlanadi (`save-card`); false — `change-card` (ota karta oynasini ochadi)
 *   - tgRequired:     inline formada Telegram telefoni majburiy (Qarz daftari: karta + telefon JUFT)
 *   - startInEdit:    oyna darhol karta formasi bilan ochiladi (karta yo'q — "karta kiritish oynasi")
 *   - savingCard:     inline karta saqlanmoqda
 *   - noCardNote:     karta yo'q bo'lganda izoh (masalan xodim — umumiy matn ketadi)
 * Hodisalar: close · confirm · change-card · save-card(payload, done(ok:boolean))
 *   payload: { card_number: '16 raqam', card_holder: string, telegram_phone: '+998XXXXXXXXX' | '' }
 */
import { digitsOf, fmtCard4, internationalScheme, cardBrand, maskCard, normUzPhone } from '~/utils/cardBin'
import { formatPhoneUz } from '~/utils/helpers'

const CARD_LEN = 16
let uid = 0

const TEXTS = {
  uz: {
    title: 'Talab SMS yuborilsinmi?', editTitle: "Plastik karta ma'lumotlari",
    subCard: "Qarzdorga qarzni qaytarish talabi SMS orqali yuboriladi. SMS'da quyidagi karta ko'rsatiladi.",
    subNoCard: 'Qarzdorga qarzni qaytarish talabi SMS orqali yuboriladi.',
    editSub: "Talab SMS'ida ko'rsatiladigan karta raqamini kiriting. Saqlangach tasdiqlash oynasiga qaytasiz.",
    editSubTg: "Karta raqami va Telegram uchun telefon — ikkalasi ham majburiy. Saqlangach tasdiqlash oynasiga qaytasiz.",
    recipient: 'Kimga', cardNumber: 'Karta raqami', holder: 'Karta egasi', holderPh: 'Ism Familiya',
    tgPhone: 'Telegram uchun telefon', tgFromAccount: 'akkaunt telefoni', tgHint: 'Format: +998XXXXXXXXX',
    noCard: 'Plastik karta kiritilmagan.', changeCard: "Kartani o'zgartirish", addCard: "Karta qo'shish",
    smsText: 'SMS matni', cancel: 'Bekor qilish', send: 'Ha, yuborish', sending: 'Yuborilmoqda…', close: 'Yopish',
    saving: 'Saqlanmoqda…', saveContinue: 'Saqlash va davom etish',
    cardRule: "16 ta raqam (Uzcard / Humo)", errCardLen: "Karta raqami 16 ta raqamdan iborat bo'lishi kerak",
    errForeign: "{s} kartasi qabul qilinmaydi — O'zbekiston kartasini kiriting",
    errPhone: 'Telefon formati: +998XXXXXXXXX', errPhoneReq: 'Telegram uchun telefon raqamini kiriting',
  },
  ru: {
    title: 'Отправить SMS с требованием?', editTitle: 'Данные пластиковой карты',
    subCard: 'Должнику будет отправлено SMS с требованием вернуть долг. В SMS будет указана эта карта.',
    subNoCard: 'Должнику будет отправлено SMS с требованием вернуть долг.',
    editSub: 'Укажите номер карты для SMS с требованием. После сохранения вы вернётесь к подтверждению.',
    editSubTg: 'Номер карты и телефон для Telegram — оба обязательны. После сохранения вы вернётесь к подтверждению.',
    recipient: 'Кому', cardNumber: 'Номер карты', holder: 'Владелец карты', holderPh: 'Имя Фамилия',
    tgPhone: 'Телефон для Telegram', tgFromAccount: 'телефон аккаунта', tgHint: 'Формат: +998XXXXXXXXX',
    noCard: 'Пластиковая карта не указана.', changeCard: 'Изменить карту', addCard: 'Добавить карту',
    smsText: 'Текст SMS', cancel: 'Отмена', send: 'Да, отправить', sending: 'Отправка…', close: 'Закрыть',
    saving: 'Сохранение…', saveContinue: 'Сохранить и продолжить',
    cardRule: '16 цифр (Uzcard / Humo)', errCardLen: 'Номер карты должен состоять из 16 цифр',
    errForeign: 'Карта {s} не принимается — введите карту Узбекистана',
    errPhone: 'Формат телефона: +998XXXXXXXXX', errPhoneReq: 'Укажите телефон для Telegram',
  },
  kr: {
    title: 'Талаб SMS юборилсинми?', editTitle: 'Пластик карта маълумотлари',
    subCard: 'Қарздорга қарзни қайтариш талаби SMS орқали юборилади. SMSда қуйидаги карта кўрсатилади.',
    subNoCard: 'Қарздорга қарзни қайтариш талаби SMS орқали юборилади.',
    editSub: 'Талаб SMSида кўрсатиладиган карта рақамини киритинг. Сақлангач тасдиқлаш ойнасига қайтасиз.',
    editSubTg: 'Карта рақами ва Телеграм учун телефон — иккаласи ҳам мажбурий. Сақлангач тасдиқлаш ойнасига қайтасиз.',
    recipient: 'Кимга', cardNumber: 'Карта рақами', holder: 'Карта эгаси', holderPh: 'Исм Фамилия',
    tgPhone: 'Телеграм учун телефон', tgFromAccount: 'аккаунт телефони', tgHint: 'Формат: +998XXXXXXXXX',
    noCard: 'Пластик карта киритилмаган.', changeCard: 'Картани ўзгартириш', addCard: 'Карта қўшиш',
    smsText: 'SMS матни', cancel: 'Бекор қилиш', send: 'Ҳа, юбориш', sending: 'Юборилмоқда…', close: 'Ёпиш',
    saving: 'Сақланмоқда…', saveContinue: 'Сақлаш ва давом этиш',
    cardRule: '16 та рақам (Uzcard / Humo)', errCardLen: 'Карта рақами 16 та рақамдан иборат бўлиши керак',
    errForeign: '{s} картаси қабул қилинмайди — Ўзбекистон картасини киритинг',
    errPhone: 'Телефон формати: +998XXXXXXXXX', errPhoneReq: 'Телеграм учун телефон рақамини киритинг',
  },
  en: {
    title: 'Send the demand SMS?', editTitle: 'Bank card details',
    subCard: 'The borrower will receive an SMS demanding repayment. The SMS will show the card below.',
    subNoCard: 'The borrower will receive an SMS demanding repayment.',
    editSub: 'Enter the card number to show in the demand SMS. After saving you will return to the confirmation.',
    editSubTg: 'The card number and the Telegram phone are both required. After saving you will return to the confirmation.',
    recipient: 'To', cardNumber: 'Card number', holder: 'Card holder', holderPh: 'First Last',
    tgPhone: 'Phone for Telegram', tgFromAccount: 'account phone', tgHint: 'Format: +998XXXXXXXXX',
    noCard: 'No bank card has been entered.', changeCard: 'Change card', addCard: 'Add card',
    smsText: 'SMS text', cancel: 'Cancel', send: 'Yes, send', sending: 'Sending…', close: 'Close',
    saving: 'Saving…', saveContinue: 'Save and continue',
    cardRule: '16 digits (Uzcard / Humo)', errCardLen: 'The card number must consist of 16 digits',
    errForeign: '{s} cards are not accepted — enter an Uzbekistan card',
    errPhone: 'Phone format: +998XXXXXXXXX', errPhoneReq: 'Enter the phone number for Telegram',
  },
  kaa: {
    title: 'Talap SMS jiberilsinbe?', editTitle: 'Plastik karta maǵlıwmatları',
    subCard: 'Qarızdarǵa qarızdı qaytarıw talabı SMS arqalı jiberiledi. SMS-te tómendegi karta kórsetiledi.',
    subNoCard: 'Qarızdarǵa qarızdı qaytarıw talabı SMS arqalı jiberiledi.',
    editSub: 'Talap SMS-inde kórsetiletuǵın karta nomerin kiritiń. Saqlaǵannan keyin tastıyıqlaw aynasına qaytasız.',
    editSubTg: 'Karta nomeri hám Telegram ushın telefon — ekewi de mindetli. Saqlaǵannan keyin tastıyıqlaw aynasına qaytasız.',
    recipient: 'Kimge', cardNumber: 'Karta nomeri', holder: 'Karta iyesi', holderPh: 'Atı Familiyası',
    tgPhone: 'Telegram ushın telefon', tgFromAccount: 'akkaunt telefonı', tgHint: 'Format: +998XXXXXXXXX',
    noCard: 'Plastik karta kiritilmegen.', changeCard: 'Kartanı ózgertiw', addCard: 'Karta qosıw',
    smsText: 'SMS teksti', cancel: 'Biykar etiw', send: 'Awa, jiberiw', sending: 'Jiberilmekte…', close: 'Jabıw',
    saving: 'Saqlanbaqta…', saveContinue: 'Saqlaw hám dawam etiw',
    cardRule: '16 san (Uzcard / Humo)', errCardLen: 'Karta nomeri 16 sannan ibarat bolıwı kerek',
    errForeign: '{s} kartası qabıl etilmeydi — Ózbekstan kartasın kiritiń',
    errPhone: 'Telefon formatı: +998XXXXXXXXX', errPhoneReq: 'Telegram ushın telefon nomerin kiritiń',
  },
}

export default {
  name: 'DemandConfirmModal',
  props: {
    card: { type: Object, default: null },
    tgFallback: { type: String, default: '' },
    recipientName: { type: String, default: '' },
    recipientPhone: { type: String, default: '' },
    preview: { type: String, default: '' },
    busy: { type: Boolean, default: false },
    canChangeCard: { type: Boolean, default: true },
    inlineEdit: { type: Boolean, default: false },
    tgRequired: { type: Boolean, default: false },
    startInEdit: { type: Boolean, default: false },
    savingCard: { type: Boolean, default: false },
    noCardNote: { type: String, default: '' },
  },
  data() {
    uid += 1
    return {
      view: this.startInEdit && this.inlineEdit ? 'edit' : 'confirm',
      // Forma karta YO'Q holatda ochilganmi — "Bekor qilish" butun oynani yopadi (tasdiqqa qaytish ma'nosiz)
      editFromStart: this.startInEdit && this.inlineEdit,
      triedSave: false,
      form: { card: '', holder: '', tg: '' },
      titleId: 'demand-modal-' + uid,
    }
  },
  computed: {
    t() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      return TEXTS[l] || TEXTS.uz
    },
    locked() { return this.busy || this.savingCard },
    bank() { return this.card ? cardBrand(this.card.number) : '' },
    maskedNumber() { return this.card ? maskCard(this.card.number) : '' },
    holderText() { return this.card && this.card.holder ? String(this.card.holder).toUpperCase() : '—' },
    tgShown() { return (this.card && this.card.telegramPhone) || this.tgFallback || '' },
    editSubtitle() { return this.tgRequired ? this.t.editSubTg : this.t.editSub },
    formDigits() { return digitsOf(this.form.card) },
    formBank() { return this.formDigits.length === CARD_LEN ? cardBrand(this.formDigits) : '' },
    cardErr() {
      const d = this.formDigits
      const foreign = internationalScheme(d)
      if (foreign) return this.t.errForeign.replace('{s}', foreign)
      if (d.length !== CARD_LEN) return this.t.errCardLen
      return ''
    },
    tgErr() {
      const raw = String(this.form.tg || '').replace(/\D/g, '')
      if (!raw || raw === '998') return this.tgRequired ? this.t.errPhoneReq : ''
      return normUzPhone(raw) ? '' : this.t.errPhone
    },
    showCardErr() { return !!this.cardErr && (this.triedSave || this.formDigits.length === CARD_LEN || !!internationalScheme(this.formDigits)) },
    showTgErr() { return !!this.tgErr && this.triedSave },
  },
  mounted() {
    if (this.view === 'edit') this.fillForm()
    this.$nextTick(this.focusMain)
  },
  methods: {
    fmtPhone(v) { return v ? formatPhoneUz(v) : '' },
    focusMain() {
      const el = this.view === 'edit' ? this.$refs.cardInput : this.$refs.confirmBtn
      if (el && el.focus) el.focus()
    },
    close() { if (!this.locked) this.$emit('close') },
    confirm() { if (!this.locked) this.$emit('confirm') },
    changeCard() {
      if (this.locked) return
      if (!this.inlineEdit) { this.$emit('change-card'); return }
      this.fillForm()
      this.editFromStart = false
      this.view = 'edit'
      this.$nextTick(this.focusMain)
    },
    fillForm() {
      const c = this.card || {}
      this.triedSave = false
      this.form = {
        card: fmtCard4(c.number || ''),
        holder: c.holder || '',
        tg: c.telegramPhone || '',
      }
    },
    onCardInput(e) {
      this.form.card = fmtCard4(e && e.target ? e.target.value : '')
      if (e && e.target) e.target.value = this.form.card
    },
    cancelEdit() {
      if (this.savingCard) return
      if (this.editFromStart) { this.$emit('close'); return }
      this.view = 'confirm'
      this.$nextTick(this.focusMain)
    },
    saveCard() {
      if (this.savingCard) return
      this.triedSave = true
      if (this.cardErr || this.tgErr) return
      const payload = {
        card_number: this.formDigits,
        card_holder: String(this.form.holder || '').trim(),
        telegram_phone: normUzPhone(this.form.tg),
      }
      this.$emit('save-card', payload, (ok) => {
        if (!ok) return
        this.editFromStart = false
        this.view = 'confirm'
        this.$nextTick(this.focusMain)
      })
    },
  },
}
</script>

<style scoped>
.demand-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #4f46e5 100%);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.25);
  min-height: 168px;
}
.demand-card::after {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 160px;
  height: 160px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  pointer-events: none;
}
.demand-card__chip {
  display: inline-block;
  width: 36px;
  height: 26px;
  border-radius: 6px;
  background: linear-gradient(135deg, #fde68a, #f59e0b);
}
.demand-card__number {
  font-size: 1.25rem;
  letter-spacing: 0.08em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
</style>
