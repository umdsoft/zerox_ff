<template>
  <div class="pb-8">
    <!-- SS10 (2026-09-20): YANGI sahifa — do'kon uchun "Plastik karta ulash".
         Mobil ilovadagi ekranga mos: ma'lumot bloki, do'kon sarlavhasi,
         2 qatorli rekvizit kartasi (karta + telegram telefon) va izoh.
         ⚠️ Shaxsiy moliyadagi `payout-card` BOSHQA narsa — bu do'kon
         (savdo_faoliyat) rekvizitlari, backend'da AYNI update endpoint. -->
    <div class="flex items-start gap-3 mb-6">
      <!-- SS18 (2026-09-21): orqaga tugmasi QATTIQ marshrutga bog'langan edi
           (`qarz-daftari-kiritish`) — bu sahifaga do'kon tahrirlash modalidan
           kelingan bo'lsa ham foydalanuvchini BEGONA sahifaga tashlardi.
           Endi haqiqiy brauzer tarixi bo'yicha BITTA oldingi sahifaga qaytadi. -->
      <button type="button" @click="goBack" class="flex-shrink-0 mt-1 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm transition-colors" :title="texts.back">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="min-w-0">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
        <p class="text-gray-500 mt-1">{{ texts.subtitle }}</p>
      </div>
    </div>

    <!-- Ma'lumot bloki (mobil ilovadagi ℹ️ qatori) -->
    <div class="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 mb-4">
      <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <p class="text-sm text-blue-800 leading-relaxed">{{ texts.info }}</p>
    </div>

    <!-- Do'kon sarlavhasi -->
    <div class="flex items-center gap-3 bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        <ShopIcon cls="w-7 h-7" />
      </div>
      <div class="min-w-0">
        <p class="font-semibold text-gray-900 break-words leading-snug">{{ faoliyatNomi || '—' }}</p>
        <p class="text-xs text-gray-500 mt-0.5">{{ texts.shopHint }}</p>
      </div>
    </div>

    <!-- Xodim sessiyasi / begona do'kon — tahrirlash egasiga tegishli -->
    <div v-if="loaded && !canEdit" class="bg-white rounded-xl shadow-sm p-6 text-center">
      <p class="text-sm text-gray-500">{{ texts.noAccess }}</p>
    </div>

    <!-- Rekvizitlar kartasi -->
    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <!-- 1-qator: Plastik karta -->
      <div class="p-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900">{{ texts.cardLabel }}</p>
            <p v-if="savedCard" class="text-base font-bold text-gray-900 mt-0.5 break-words">{{ savedCard }}</p>
            <p v-else class="text-sm text-gray-400 mt-0.5">{{ texts.notSet }}</p>
            <p v-if="cardMeta" class="text-xs text-gray-500 mt-0.5 break-words">{{ cardMeta }}</p>
          </div>
          <button
            type="button"
            class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
            :title="texts.edit"
            @click="openEdit('card')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
        </div>

        <!-- Karta tahrirlash formasi -->
        <div v-if="editing === 'card'" class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <label class="block text-xs font-semibold text-gray-600 mb-1">{{ texts.cardNumber }}</label>
          <input
            :value="form.karta_raqami"
            type="text"
            inputmode="numeric"
            maxlength="19"
            placeholder="8600 1234 5678 9012"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="onCardInput"
          />
          <label class="block text-xs font-semibold text-gray-600 mb-1 mt-3">{{ texts.cardHolder }}</label>
          <input
            v-model="form.karta_egasi"
            type="text"
            maxlength="100"
            :placeholder="texts.cardHolderPh"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="cardError" class="text-xs text-red-500 mt-2 leading-snug">{{ cardError }}</p>
          <p v-else class="text-xs text-gray-400 mt-2 leading-snug">{{ texts.cardHint }}</p>
          <div class="flex justify-end gap-2 mt-3">
            <button type="button" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" @click="cancelEdit">{{ texts.cancel }}</button>
            <button
              type="button"
              class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              :style="(saving || !!cardError) ? 'opacity:0.5;cursor:not-allowed' : ''"
              :disabled="saving || !!cardError"
              @click="saveCard"
            >{{ saving ? texts.saving : texts.save }}</button>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-100"></div>

      <!-- 2-qator: Telegram uchun telefon -->
      <div class="p-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900">{{ texts.tgLabel }}</p>
            <p v-if="savedPhone" class="text-base font-bold text-gray-900 mt-0.5 break-words">{{ savedPhone }}</p>
            <p v-else class="text-sm text-gray-400 mt-0.5">{{ texts.notSet }}</p>
          </div>
          <button
            type="button"
            class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
            :title="texts.edit"
            @click="openEdit('tg')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
        </div>

        <!-- Telefon tahrirlash formasi -->
        <div v-if="editing === 'tg'" class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <label class="block text-xs font-semibold text-gray-600 mb-1">{{ texts.tgPhone }}</label>
          <input
            v-model="form.telegram_telefon"
            type="text"
            inputmode="tel"
            maxlength="20"
            placeholder="+998901234567"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="phoneError" class="text-xs text-red-500 mt-2 leading-snug">{{ phoneError }}</p>
          <p v-else class="text-xs text-gray-400 mt-2 leading-snug">{{ texts.tgHint }}</p>
          <div class="flex justify-end gap-2 mt-3">
            <button type="button" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" @click="cancelEdit">{{ texts.cancel }}</button>
            <button
              type="button"
              class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              :style="(saving || !!phoneError) ? 'opacity:0.5;cursor:not-allowed' : ''"
              :disabled="saving || !!phoneError"
              @click="savePhone"
            >{{ saving ? texts.saving : texts.save }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pastki izoh (mobil ilovadagidek) -->
    <p class="text-xs text-gray-500 leading-relaxed mt-4">{{ texts.footer }}</p>
  </div>
</template>

<script>
// DRY: karta guruhlash va BIN qoidasi yagona joyda (backend helper/cardBin.js ning nusxasi)
import { digitsOf, fmtCard4, internationalScheme, cardBrand } from '@/utils/cardBin';

export default {
  middleware: 'auth',
  data() {
    return {
      faoliyat: null,
      loaded: false,
      editing: null, // null | 'card' | 'tg'
      saving: false,
      form: { karta_raqami: '', karta_egasi: '', telegram_telefon: '' },
    };
  },
  computed: {
    faoliyatNomi() { return this.faoliyat ? this.faoliyat.nomi : ''; },
    /**
     * Faqat do'kon EGASI rekvizitni o'zgartira oladi.
     * Backend'da ham shunday: PUT /savdo-faoliyat/:id da `denyXodim` bor —
     * xodim sessiyasi 403 oladi, shuning uchun formani KO'RSATMAYMIZ.
     */
    canEdit() {
      if (!this.faoliyat || this.faoliyat.is_xodim_role) return false;
      return !this.$auth?.user?.is_xodim;
    },
    savedCard() { return fmtCard4(this.faoliyat && this.faoliyat.karta_raqami); },
    /** "Humo · Quramboyev Jamshid" — to'lov tizimi nomi noma'lum bo'lsa faqat FISh */
    cardMeta() {
      if (!this.savedCard) return '';
      const brand = cardBrand(this.faoliyat.karta_raqami);
      const egasi = (this.faoliyat.karta_egasi || '').trim();
      return [brand, egasi].filter(Boolean).join(' · ');
    },
    savedPhone() { return this.fmtPhone(this.faoliyat && this.faoliyat.telegram_telefon); },
    /** Live validatsiya — server 400 qaytarguncha kutmaymiz */
    cardError() {
      const d = digitsOf(this.form.karta_raqami);
      if (!d) return '';
      const foreign = internationalScheme(d);
      if (foreign) return this.texts.errForeign.replace('{s}', foreign);
      if (d.length !== 16) return this.texts.errCardLen;
      return '';
    },
    phoneError() {
      const raw = String(this.form.telegram_telefon || '').replace(/\D/g, '');
      if (!raw) return '';
      const nine = raw.startsWith('998') ? raw.slice(3) : raw;
      return nine.length === 9 ? '' : this.texts.errPhone;
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: "Plastik karta ulash", subtitle: "Do'kon rekvizitlari",
          back: "Orqaga", shopHint: "Savdo faoliyati",
          info: "Mijozlar qarzni plastik kartaga o'tkazishi uchun karta ma'lumotlarini kiriting.",
          cardLabel: "Plastik karta", tgLabel: "Telegram uchun telefon",
          notSet: "Kiritilmagan", edit: "Tahrirlash",
          cardNumber: "Karta raqami", cardHolder: "Karta egasi (FISh)", cardHolderPh: "Ism Familiya",
          cardHint: "16 ta raqam. Faqat O'zbekiston kartasi (Uzcard / Humo). Bo'sh qoldirsangiz — rekvizit o'chiriladi.",
          tgPhone: "Telefon raqami", tgHint: "Format: +998XXXXXXXXX. Bo'sh qoldirsangiz — o'chiriladi.",
          cancel: "Bekor qilish", save: "Saqlash", saving: "Saqlanmoqda...",
          saved: "Saqlandi", error: "Xatolik yuz berdi",
          errCardLen: "Karta raqami 16 ta raqamdan iborat bo'lishi kerak",
          errForeign: "{s} kartasi qabul qilinmaydi — O'zbekiston kartasini kiriting",
          errPhone: "Telefon formati: +998XXXXXXXXX",
          noAccess: "Bu do'kon rekvizitlarini faqat do'kon egasi tahrirlay oladi.",
          footer: "Mijoz qarzni plastik kartangizga o'tkazganligi to'g'risida sizga telegram orqali xabar beradi.",
        },
        ru: {
          title: "Привязать пластиковую карту", subtitle: "Реквизиты магазина",
          back: "Назад", shopHint: "Торговая деятельность",
          info: "Введите данные карты, чтобы клиенты могли перевести долг на пластиковую карту.",
          cardLabel: "Пластиковая карта", tgLabel: "Телефон для Telegram",
          notSet: "Не указано", edit: "Редактировать",
          cardNumber: "Номер карты", cardHolder: "Владелец карты (ФИО)", cardHolderPh: "Имя Фамилия",
          cardHint: "16 цифр. Только карта Узбекистана (Uzcard / Humo). Оставьте пустым — реквизит удалится.",
          tgPhone: "Номер телефона", tgHint: "Формат: +998XXXXXXXXX. Оставьте пустым — удалится.",
          cancel: "Отмена", save: "Сохранить", saving: "Сохранение...",
          saved: "Сохранено", error: "Произошла ошибка",
          errCardLen: "Номер карты должен состоять из 16 цифр",
          errForeign: "Карта {s} не принимается — введите карту Узбекистана",
          errPhone: "Формат телефона: +998XXXXXXXXX",
          noAccess: "Реквизиты магазина может менять только владелец.",
          footer: "Клиент сообщит вам через Telegram о переводе долга на вашу пластиковую карту.",
        },
        kr: {
          title: "Пластик карта улаш", subtitle: "Дўкон реквизитлари",
          back: "Орқага", shopHint: "Савдо фаолияти",
          info: "Мижозлар қарзни пластик картага ўтказиши учун карта маълумотларини киритинг.",
          cardLabel: "Пластик карта", tgLabel: "Телеграм учун телефон",
          notSet: "Киритилмаган", edit: "Таҳрирлаш",
          cardNumber: "Карта рақами", cardHolder: "Карта эгаси (ФИШ)", cardHolderPh: "Исм Фамилия",
          cardHint: "16 та рақам. Фақат Ўзбекистон картаси (Uzcard / Humo). Бўш қолдирсангиз — реквизит ўчирилади.",
          tgPhone: "Телефон рақами", tgHint: "Формат: +998XXXXXXXXX. Бўш қолдирсангиз — ўчирилади.",
          cancel: "Бекор қилиш", save: "Сақлаш", saving: "Сақланмоқда...",
          saved: "Сақланди", error: "Хатолик юз берди",
          errCardLen: "Карта рақами 16 та рақамдан иборат бўлиши керак",
          errForeign: "{s} картаси қабул қилинмайди — Ўзбекистон картасини киритинг",
          errPhone: "Телефон формати: +998XXXXXXXXX",
          noAccess: "Дўкон реквизитларини фақат дўкон эгаси таҳрирлай олади.",
          footer: "Мижоз қарзни пластик картангизга ўтказганлиги тўғрисида сизга телеграм орқали хабар беради.",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.loadFaoliyat(); },
  methods: {
    /**
     * SS18 (2026-09-21): "bitta oldingi sahifa" qoidasi.
     * Brauzer tarixi bo'sh bo'lsa (sahifa to'g'ridan-to'g'ri URL bilan ochilgan)
     * `back()` saytdan chiqarib yuborardi — shu sabab mantiqiy ota-sahifaga
     * zaxira yo'l qo'yilgan.
     */
    goBack() {
      if (window.history.length > 1) this.$router.back();
      else this.$router.push(this.localePath({ name: 'qarz-daftari' }));
    },
    /** "+998937524411" → "+998 93 752 44 11" (faqat ko'rsatish uchun) */
    fmtPhone(raw) {
      const d = String(raw || '').replace(/\D/g, '');
      const nine = d.startsWith('998') ? d.slice(3) : d;
      if (nine.length !== 9) return raw ? String(raw) : '';
      return `+998 ${nine.slice(0, 2)} ${nine.slice(2, 5)} ${nine.slice(5, 7)} ${nine.slice(7)}`;
    },
    // Do'kon uchun alohida GET endpoint YO'Q — mavjud ro'yxatdan olamiz
    // (berish/olish/xodimlar sahifalari bilan bir xil usul).
    async loadFaoliyat() {
      try {
        const res = await this.$axios.$get('/qarz-daftari/savdo-faoliyat', { silent: true });
        if (res?.success && Array.isArray(res.data)) {
          this.faoliyat = res.data.find((f) => String(f.id) === String(this.$route.params.id)) || null;
        }
      } catch (_) {} finally {
        this.loaded = true;
      }
    },
    openEdit(which) {
      if (!this.canEdit) return;
      this.editing = which;
      this.form.karta_raqami = fmtCard4(this.faoliyat.karta_raqami);
      this.form.karta_egasi = this.faoliyat.karta_egasi || '';
      this.form.telegram_telefon = this.faoliyat.telegram_telefon || '';
    },
    cancelEdit() { this.editing = null; },
    onCardInput(e) {
      // 4 talik guruhlab ko'rsatamiz, saqlashda faqat raqamlar ketadi
      this.form.karta_raqami = fmtCard4(e.target.value);
    },
    /**
     * Rekvizitni saqlash. ⚠️ Yangi endpoint QO'SHILMADI — mavjud savdo-faoliyat
     * update'i ishlatiladi. Validator `nomi` ni TALAB qiladi, shuning uchun
     * do'konning joriy nomini ham yuboramiz (region/district esa yuborilmasa
     * controller ularga tegmaydi).
     */
    async patch(payload) {
      if (!this.canEdit || this.saving) return;
      this.saving = true;
      try {
        // SS16 (2026-09-21): `silent` SHART — aks holda global axios interceptor (plugins/axios.js)
        // server `message` ini ko'rsatadi va quyidagi catch AYNI xabarni QAYTA ko'rsatadi.
        await this.$axios.$put(`/qarz-daftari/savdo-faoliyat/${this.faoliyat.id}`, {
          nomi: this.faoliyat.nomi,
          ...payload,
        }, { silent: true });
        this.$toast?.success(this.texts.saved);
        this.editing = null;
        await this.loadFaoliyat();
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.texts.error);
      } finally {
        this.saving = false;
      }
    },
    async saveCard() {
      if (this.cardError) return;
      const d = digitsOf(this.form.karta_raqami);
      await this.patch({
        karta_raqami: d,
        karta_egasi: (this.form.karta_egasi || '').trim(),
      });
    },
    async savePhone() {
      if (this.phoneError) return;
      await this.patch({ telegram_telefon: (this.form.telegram_telefon || '').trim() });
    },
  },
};
</script>
