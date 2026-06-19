<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style="z-index: 100"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
      <h3 class="text-lg font-semibold mb-4">
        {{ isEdit ? texts.editTitle : texts.addTitle }}
      </h3>

      <form @submit.prevent="save" novalidate>
        <div class="mb-1">
          <input
            v-model="form.nomi"
            type="text"
            :maxlength="MAX_LEN"
            :class="[
              'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2',
              validationError ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
            ]"
            :placeholder="texts.placeholder"
            @input="onInput"
          />
        </div>
        <div class="flex items-start justify-between gap-3 mb-4 min-h-[1.25rem]">
          <p v-if="validationError" class="text-xs text-red-500 leading-snug flex-1">
            {{ validationError }}
          </p>
          <p v-else class="text-xs text-gray-400 leading-snug flex-1">
            {{ texts.hint }}
          </p>
          <span :class="['text-xs flex-shrink-0 tabular-nums', charCount > MAX_LEN ? 'text-red-500 font-semibold' : charCount === MAX_LEN ? 'text-amber-500 font-semibold' : 'text-gray-400']">
            {{ charCount }}/{{ MAX_LEN }}
          </span>
        </div>

        <!-- Do'kon manzili: viloyat + tuman (2 ta card) -->
        <div class="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
            {{ texts.regionLabel }}
          </label>
          <div class="relative">
            <select
              v-model="form.region"
              class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="onRegionChange"
            >
              <option value="" disabled>{{ texts.regionPlaceholder }}</option>
              <option v-for="r in regions" :key="r.name" :value="r.name">{{ r.name }}</option>
            </select>
            <svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <label class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-600">
            <svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
            {{ texts.districtLabel }}
          </label>
          <div class="relative">
            <select
              v-model="form.district"
              :disabled="!form.region"
              class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="" disabled>{{ form.region ? texts.districtPlaceholder : texts.districtPickRegionFirst }}</option>
              <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
            </select>
            <svg class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            @click="$emit('close')"
          >
            {{ texts.cancel }}
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            :disabled="loading || !!validationError || !form.nomi.trim() || !addressFilled"
          >
            {{ loading ? texts.saving : texts.save }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import uzbRegions from '@/assets/uzbekistan-regions.js';

// Faqat lotin harflari, raqamlar, probel, defis va nuqta — boshqasi taqiqlanadi.
// (Kirillcha/ruscha/boshqa tildagi harflar va maxsus belgilar bloklanadi.)
const ALLOWED_RE = /^[A-Za-z0-9 .\-]+$/;
const MAX_LEN = 28;

// Aniq taqiqlangan belgilar — UX uchun aniq xato xabari berish maqsadida
// alohida tekshiramiz (faqat ALLOWED_RE bilan cheklanish ham ularni bloklaydi,
// lekin tushunarli xabar kerak).
const BANNED_CHARS = [
  '—',   // em dash
  '`',   // backtick
  '(', ')', ',',
  "'",   // straight apostrophe
  '‘', '’',  // curly single quotes ‘ ’
  '№',
  '"',
  '“', '”',  // curly double quotes “ ”
  '|',
];

export default {
  name: 'SavdoFaoliyatModal',
  props: {
    faoliyat: { type: Object, default: null },
  },
  data() {
    return {
      MAX_LEN,
      regions: uzbRegions,
      form: {
        nomi: this.faoliyat ? (this.faoliyat.nomi || '') : '',
        region: this.faoliyat ? (this.faoliyat.region || '') : '',
        district: this.faoliyat ? (this.faoliyat.district || '') : '',
      },
      loading: false,
    };
  },
  computed: {
    isEdit() { return !!this.faoliyat; },
    charCount() { return (this.form.nomi || '').length; },
    /** Tanlangan viloyatning tumanlari */
    districts() {
      const r = this.regions.find((x) => x.name === this.form.region);
      return r ? r.districts : [];
    },
    /** Saqlash uchun manzil to'liq tanlanganmi */
    addressFilled() {
      return !!this.form.region && !!this.form.district;
    },
    /** Live validation message (yoki '' agar yaroqli) */
    validationError() {
      const v = this.form.nomi || '';
      if (!v) return '';

      if (v.length > MAX_LEN) {
        return this.texts.errLen;
      }

      // Avval aniq taqiqlangan belgilarni tekshiramiz (foydalanuvchiga aniqroq xabar)
      const bad = BANNED_CHARS.find((c) => v.indexOf(c) !== -1);
      if (bad) {
        return this.texts.errBanned.replace('{c}', bad);
      }

      if (!ALLOWED_RE.test(v)) {
        // Kirillcha/boshqa tildagi belgilar yoki boshqa maxsus belgilar
        return this.texts.errNonLatin;
      }
      return '';
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          addTitle: "Yangi savdo faoliyati (do'kon)",
          editTitle: "Savdo faoliyatini tahrirlash",
          placeholder: "Savdo faoliyati (do'kon) nomi",
          hint: "Faqat lotin harflari, raqam, probel, defis (-) va nuqta (.)",
          cancel: "Bekor qilish", save: "Saqlash", saving: "Saqlanmoqda...",
          nameRequired: "Savdo faoliyati nomini kiriting",
          errLen: `Do'kon nomi ${MAX_LEN} ta belgidan ortiq bo'lmasin (probellar bilan)`,
          errNonLatin: "Faqat lotin alifbosidagi harflarni kiriting (kirill va boshqa tildagi harflar mumkin emas)",
          errBanned: "Bu belgini ishlatib bo'lmaydi: « {c} »",
          regionLabel: "Viloyat (do'kon joylashgan)",
          regionPlaceholder: "Viloyatni tanlang",
          districtLabel: "Tuman / shahar",
          districtPlaceholder: "Tuman yoki shaharni tanlang",
          districtPickRegionFirst: "Avval viloyatni tanlang",
          addressRequired: "Do'kon manzilini (viloyat va tuman) tanlang",
        },
        ru: {
          addTitle: "Новая торговая деятельность (магазин)",
          editTitle: "Редактировать торговую деятельность",
          placeholder: "Название торговой деятельности (магазина)",
          hint: "Только латинские буквы, цифры, пробел, дефис (-) и точка (.)",
          cancel: "Отмена", save: "Сохранить", saving: "Сохранение...",
          nameRequired: "Введите название торговой деятельности",
          errLen: `Название магазина не должно превышать ${MAX_LEN} символов (с учётом пробелов)`,
          errNonLatin: "Используйте только латинские буквы (кириллица и другие письменности не допускаются)",
          errBanned: "Этот символ нельзя использовать: « {c} »",
          regionLabel: "Область (где находится магазин)",
          regionPlaceholder: "Выберите область",
          districtLabel: "Район / город",
          districtPlaceholder: "Выберите район или город",
          districtPickRegionFirst: "Сначала выберите область",
          addressRequired: "Выберите адрес магазина (область и район)",
        },
        kr: {
          addTitle: "Янги савдо фаолияти (дўкон)",
          editTitle: "Савдо фаолиятини таҳрирлаш",
          placeholder: "Савдо фаолияти (дўкон) номи",
          hint: "Фақат лотин ҳарфлари, рақам, пробел, дефис (-) ва нуқта (.)",
          cancel: "Бекор қилиш", save: "Сақлаш", saving: "Сақланмоқда...",
          nameRequired: "Савдо фаолияти номини киритинг",
          errLen: `Дўкон номи ${MAX_LEN} та белгидан ортиқ бўлмасин (пробеллар билан)`,
          errNonLatin: "Фақат лотин алифбосидаги ҳарфларни киритинг",
          errBanned: "Бу белгини ишлатиб бўлмайди: « {c} »",
          regionLabel: "Вилоят (дўкон жойлашган)",
          regionPlaceholder: "Вилоятни танланг",
          districtLabel: "Туман / шаҳар",
          districtPlaceholder: "Туман ёки шаҳарни танланг",
          districtPickRegionFirst: "Аввал вилоятни танланг",
          addressRequired: "Дўкон манзилини (вилоят ва туман) танланг",
        },
      };
      return t[l] || t.uz;
    },
  },
  methods: {
    onInput() {
      // maxlength input attribute hard-limit'ga keladi, lekin paste'da
      // ba'zi brauzerlarda o'tkazib yuborilishi mumkin — qisqartiramiz
      if (this.form.nomi && this.form.nomi.length > MAX_LEN) {
        this.form.nomi = this.form.nomi.slice(0, MAX_LEN);
      }
    },
    onRegionChange() {
      // Viloyat o'zgarsa — tumanni tozalaymiz (eski tuman yangi viloyatga to'g'ri kelmasligi mumkin)
      this.form.district = '';
    },
    async save() {
      const nomi = (this.form.nomi || '').trim();
      if (!nomi) {
        this.$toast?.error(this.texts.nameRequired);
        return;
      }
      if (this.validationError) {
        this.$toast?.error(this.validationError);
        return;
      }
      if (!this.addressFilled) {
        this.$toast?.error(this.texts.addressRequired);
        return;
      }
      this.loading = true;
      try {
        const payload = { nomi, region: this.form.region, district: this.form.district };
        let response;
        if (this.isEdit) {
          response = await this.$axios.$put(`/qarz-daftari/savdo-faoliyat/${this.faoliyat.id}`, payload);
        } else {
          response = await this.$axios.$post('/qarz-daftari/savdo-faoliyat', payload);
        }
        this.$emit('saved', response);
        this.$emit('close');
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik yuz berdi');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
