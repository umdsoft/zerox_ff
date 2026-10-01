<template>
  <!-- 30.09 (doc1 18/21-rasm): "Plastik karta ma'lumotlari" oynasi — YAGONA komponent. Ilgari u uch joyda
       alohida yozilgan edi (Shaxsiy qarz bosh sahifasi, qarz tafsiloti, kontragent sahifasida umuman
       yo'q edi — "Talab qilish" bosilganda faqat qizil xabar chiqardi). Endi karta kiritilmagan bo'lsa
       "Talab qilish" shu oynani ochadi; saqlangach sahifa SMS'ni avtomatik yuboradi (`saved` hodisasi). -->
  <div class="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4" style="z-index: 110">
    <div class="absolute inset-0" style="background: rgba(17, 24, 39, 0.55)" @click="close"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl overflow-y-auto" style="max-height: 92vh">
      <div class="flex items-center justify-between mb-1">
        <h3 class="font-bold text-gray-900">💳 {{ t.title }}</h3>
        <button type="button" class="text-gray-400 hover:text-gray-600" :aria-label="t.close" @click="close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <p class="text-xs text-gray-500 mb-4">{{ intent === 'demand' ? t.hintDemand : t.hint }}</p>

      <div v-if="loading" class="py-8 text-center text-sm text-gray-400">{{ t.loading }}</div>
      <form v-else novalidate @submit.prevent="save">
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t.fish }}</label>
        <input
          v-model="form.fish"
          type="text"
          maxlength="100"
          :disabled="fishLocked"
          :style="fishLocked ? 'background:#F3F4F6; color:#6B7280' : ''"
          :placeholder="t.fishPh"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl mb-1 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-gray-500 mb-3">{{ fishLocked ? t.fishLocked : t.fishHint }}</p>

        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t.card }} *</label>
        <input
          :value="form.card_number"
          type="text"
          inputmode="numeric"
          maxlength="19"
          placeholder="0000 0000 0000 0000"
          class="w-full px-4 py-2.5 border rounded-xl mb-1 outline-none focus:ring-2"
          :class="cardInvalid ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'"
          @input="onCardInput"
        />
        <p v-if="cardInvalid" class="text-xs text-red-600 mb-2">{{ t.cardInvalid }}</p>
        <div v-else class="mb-2"></div>

        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t.holder }}</label>
        <input v-model="form.card_holder" type="text" maxlength="100" :placeholder="t.holderPh" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-blue-500" />

        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ t.tg }}</label>
        <input v-model="form.telegram_phone" type="text" inputmode="numeric" maxlength="13" placeholder="+998901234567" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl mb-1 outline-none focus:ring-2 focus:ring-blue-500" />
        <p class="text-xs text-gray-500 mb-5">{{ t.tgHint }}</p>

        <div class="flex gap-2">
          <button type="button" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold" @click="close">{{ t.cancel }}</button>
          <button
            type="submit"
            class="flex-1 py-2.5 text-white rounded-xl font-semibold whitespace-nowrap"
            :style="'background:#2563EB;' + (busy || !canSave ? 'opacity:.6;cursor:not-allowed' : '')"
            :disabled="busy || !canSave"
          >{{ busy ? '…' : (intent === 'demand' ? t.saveDemand : t.save) }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
/**
 * PayoutCardModal — shaxsiy qarz "qaytarish rekvizitlari" (plastik karta) oynasi.
 *
 * Props:
 *   - intent: 'edit' (bosh sahifadagi havola) | 'demand' ("Talab qilish" — karta yo'q edi)
 * Hodisalar:
 *   - close
 *   - saved({ ready })  — karta saqlandi; `ready` = talab qilish mumkin (karta bor)
 *
 * Backend: GET/PUT /finance/payout-card. Telegram telefon IXTIYORIY — bo'sh bo'lsa talab SMS'ida
 * akkaunt telefoni ko'rsatiladi (backend 30.09). Xatolar faqat shu yerda ko'rsatiladi (API silent).
 */
const CARD_LEN = 16

export default {
  name: 'PayoutCardModal',
  props: {
    intent: { type: String, default: 'edit' },
  },
  data() {
    return {
      loading: true,
      busy: false,
      fishLocked: false,
      form: { fish: '', card_number: '', card_holder: '', telegram_phone: '+998' },
    }
  },
  computed: {
    t() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      const all = {
        uz: {
          title: "Plastik karta ma'lumotlari", close: 'Yopish', loading: 'Yuklanmoqda…',
          hint: "Sizga qarz qaytaruvchilar shu rekvizitlarga pul o'tkazadi.",
          hintDemand: "Qarzni qaytarishni talab qilish uchun karta rekvizitlarini kiriting. Saqlaganingizdan so'ng qarzdorga SMS orqali shu karta raqami yuboriladi.",
          fish: 'Sizning F.I.Sh', fishPh: 'Familiya Ism Sharif', fishLocked: "MyID orqali tasdiqlangan — o'zgartirib bo'lmaydi.", fishHint: "Kvitansiya va SMS xabarlarida shu ism ko'rinadi.",
          card: 'Plastik karta raqami', cardInvalid: "Karta raqami 16 ta raqamdan iborat bo'lishi kerak",
          holder: 'Karta egasi (FISh)', holderPh: 'Ism Familiya',
          tg: 'Telegram telefon (ixtiyoriy)', tgHint: "Bo'sh qoldirsangiz, SMS'da akkauntingiz telefoni ko'rsatiladi.",
          cancel: 'Bekor qilish', save: 'Saqlash', saveDemand: 'Saqlash va talab qilish', saved: 'Karta saqlandi', error: 'Saqlab bo‘lmadi. Qayta urinib ko‘ring.',
        },
        ru: {
          title: 'Данные пластиковой карты', close: 'Закрыть', loading: 'Загрузка…',
          hint: 'Должники будут переводить деньги на эти реквизиты.',
          hintDemand: 'Чтобы потребовать возврат долга, укажите реквизиты карты. После сохранения должнику будет отправлено SMS с номером этой карты.',
          fish: 'Ваше Ф.И.О.', fishPh: 'Фамилия Имя Отчество', fishLocked: 'Подтверждено через MyID — изменить нельзя.', fishHint: 'Это имя будет указано в квитанциях и SMS.',
          card: 'Номер пластиковой карты', cardInvalid: 'Номер карты должен состоять из 16 цифр',
          holder: 'Владелец карты (ФИО)', holderPh: 'Имя Фамилия',
          tg: 'Телефон Telegram (необязательно)', tgHint: 'Если оставить пустым, в SMS будет указан телефон вашего аккаунта.',
          cancel: 'Отмена', save: 'Сохранить', saveDemand: 'Сохранить и потребовать', saved: 'Карта сохранена', error: 'Не удалось сохранить. Попробуйте ещё раз.',
        },
        kr: {
          title: 'Пластик карта маълумотлари', close: 'Ёпиш', loading: 'Юкланмоқда…',
          hint: 'Сизга қарз қайтарувчилар шу реквизитларга пул ўтказади.',
          hintDemand: 'Қарзни қайтаришни талаб қилиш учун карта реквизитларини киритинг. Сақлаганингиздан сўнг қарздорга SMS орқали шу карта рақами юборилади.',
          fish: 'Сизнинг Ф.И.Ш', fishPh: 'Фамилия Исм Шариф', fishLocked: 'MyID орқали тасдиқланган — ўзгартириб бўлмайди.', fishHint: 'Квитанция ва SMS хабарларида шу исм кўринади.',
          card: 'Пластик карта рақами', cardInvalid: 'Карта рақами 16 та рақамдан иборат бўлиши керак',
          holder: 'Карта эгаси (ФИШ)', holderPh: 'Исм Фамилия',
          tg: 'Telegram телефон (ихтиёрий)', tgHint: 'Бўш қолдирсангиз, SMSда аккаунтингиз телефони кўрсатилади.',
          cancel: 'Бекор қилиш', save: 'Сақлаш', saveDemand: 'Сақлаш ва талаб қилиш', saved: 'Карта сақланди', error: 'Сақлаб бўлмади. Қайта уриниб кўринг.',
        },
        en: {
          title: 'Bank card details', close: 'Close', loading: 'Loading…',
          hint: 'People repaying you will transfer money to these details.',
          hintDemand: 'To demand repayment, enter your card details. After saving, the borrower will receive an SMS with this card number.',
          fish: 'Your full name', fishPh: 'Last name First name', fishLocked: 'Verified via MyID — cannot be changed.', fishHint: 'This name is shown on receipts and SMS messages.',
          card: 'Card number', cardInvalid: 'The card number must contain 16 digits',
          holder: 'Card holder (full name)', holderPh: 'First Last',
          tg: 'Telegram phone (optional)', tgHint: 'If left empty, your account phone number is shown in the SMS.',
          cancel: 'Cancel', save: 'Save', saveDemand: 'Save and demand', saved: 'Card saved', error: 'Could not save. Please try again.',
        },
        kaa: {
          title: 'Plastik karta maǵlıwmatları', close: 'Jabıw', loading: 'Júklenbekte…',
          hint: 'Sizge qarız qaytarıwshılar usı rekvizitlerge aqsha ótkeredi.',
          hintDemand: 'Qarızdı qaytarıwdı talap etiw ushın karta rekvizitlerin kiritiń. Saqlaǵannan keyin qarızdarǵa SMS arqalı usı karta nomeri jiberiledi.',
          fish: 'Sizdiń F.A.Á', fishPh: 'Familiya Atı Ákesiniń atı', fishLocked: 'MyID arqalı tastıyıqlanǵan — ózgertip bolmaydı.', fishHint: 'Kvitanciya hám SMS xabarlarında usı at kórinedi.',
          card: 'Plastik karta nomeri', cardInvalid: 'Karta nomeri 16 sannan ibarat bolıwı kerek',
          holder: 'Karta iyesi (FAÁ)', holderPh: 'Atı Familiyası',
          tg: 'Telegram telefon (ıqtıyarlı)', tgHint: 'Bos qaldırsańız, SMS-te akkauntıńız telefonı kórsetiledi.',
          cancel: 'Biykar etiw', save: 'Saqlaw', saveDemand: 'Saqlaw hám talap etiw', saved: 'Karta saqlandı', error: 'Saqlap bolmadı. Qayta urınıp kóriń.',
        },
      }
      return all[l] || all.uz
    },
    cardDigits() { return String(this.form.card_number || '').replace(/\D/g, '') },
    cardInvalid() { return this.cardDigits.length > 0 && this.cardDigits.length !== CARD_LEN },
    canSave() { return this.cardDigits.length === CARD_LEN },
  },
  async mounted() {
    try {
      const res = await this.$api.getPayoutCard()
      const d = (res && res.data && res.data.data) || {}
      this.form = {
        fish: d.fish || '',
        card_number: this.groupCard(d.card_number || ''),
        card_holder: d.card_holder || '',
        telegram_phone: d.telegram_phone || '+998',
      }
      this.fishLocked = !!d.fish_locked
    } catch (_) { /* bo'sh forma — foydalanuvchi yangidan kiritadi */ } finally {
      this.loading = false
    }
  },
  methods: {
    groupCard(v) {
      return String(v || '').replace(/\D/g, '').slice(0, CARD_LEN).replace(/(.{4})/g, '$1 ').trim()
    },
    onCardInput(e) {
      this.form.card_number = this.groupCard(e && e.target ? e.target.value : '')
    },
    close() {
      if (!this.busy) this.$emit('close')
    },
    async save() {
      if (this.busy || !this.canSave) return
      this.busy = true
      try {
        const tgDigits = String(this.form.telegram_phone || '').replace(/\D/g, '')
        const payload = {
          card_number: this.cardDigits,
          card_holder: String(this.form.card_holder || '').trim() || null,
          // "+998" (faqat prefiks) — bo'sh maydon
          telegram_phone: tgDigits && tgDigits !== '998' ? String(this.form.telegram_phone).replace(/[^\d+]/g, '') : null,
        }
        if (!this.fishLocked) payload.fish = String(this.form.fish || '').trim()
        const res = await this.$api.savePayoutCard(payload)
        if (res && res.data && res.data.success !== false) {
          if (this.intent !== 'demand') this.$toast && this.$toast.success && this.$toast.success(this.t.saved)
          this.$emit('saved', { ready: true })
        }
      } catch (e) {
        const msg = (e && e.response && e.response.data && e.response.data.message) || this.t.error
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally {
        this.busy = false
      }
    },
  },
}
</script>
