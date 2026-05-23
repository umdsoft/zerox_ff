<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style="z-index: 100"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
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
            :disabled="loading || !!validationError || !form.nomi.trim()"
          >
            {{ loading ? texts.saving : texts.save }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
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
      form: { nomi: this.faoliyat ? (this.faoliyat.nomi || '') : '' },
      loading: false,
    };
  },
  computed: {
    isEdit() { return !!this.faoliyat; },
    charCount() { return (this.form.nomi || '').length; },
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
      this.loading = true;
      try {
        const payload = { nomi };
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
