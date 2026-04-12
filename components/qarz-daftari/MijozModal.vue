<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style="z-index: 100"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">
        {{ texts.title }}
      </h3>

      <form @submit.prevent="save" novalidate>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ texts.fishLabel }}
          </label>
          <input
            v-model="form.fish"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :placeholder="texts.fishPlaceholder"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ texts.telefonLabel }}
          </label>
          <input
            v-model="form.telefon"
            type="tel"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+998XXXXXXXXX"
          />
          <p v-if="telefonError" class="text-xs text-red-500 mt-1">{{ telefonError }}</p>
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
            :disabled="loading"
          >
            {{ loading ? texts.saving : texts.save }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MijozModal',
  props: {
    faoliyatId: {
      type: [Number, String],
      required: true,
    },
    mijoz: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        fish: this.mijoz ? this.mijoz.fish : '',
        telefon: this.mijoz ? this.mijoz.telefon : '',
      },
      loading: false,
    }
  },
  computed: {
    isEdit() {
      return !!this.mijoz
    },
    telefonError() {
      if (!this.form.telefon) return '';
      const cleaned = this.form.telefon.replace(/[\s\-()]/g, '');
      if (cleaned && !/^\+998\d{9}$/.test(cleaned)) {
        return this.texts.telefonFormatError;
      }
      return '';
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: this.isEdit ? "Mijozni tahrirlash" : "Yangi mijoz qo'shish", fishLabel: "F.I.Sh", fishPlaceholder: "Familiya Ism Sharif", telefonLabel: "Telefon", telefonFormatError: "Telefon formati noto'g'ri (+998XXXXXXXXX)", fishRequired: "FISH kiritilishi shart", cancel: "Bekor qilish", save: "Saqlash", saving: "Saqlanmoqda..." },
        ru: { title: this.isEdit ? "Редактировать клиента" : "Добавить нового клиента", fishLabel: "Ф.И.О", fishPlaceholder: "Фамилия Имя Отчество", telefonLabel: "Телефон", telefonFormatError: "Неверный формат телефона (+998XXXXXXXXX)", fishRequired: "Необходимо ввести ФИО", cancel: "Отмена", save: "Сохранить", saving: "Сохранение..." },
        kr: { title: this.isEdit ? "Мижозни таҳрирлаш" : "Янги мижоз қўшиш", fishLabel: "Ф.И.Ш", fishPlaceholder: "Фамилия Исм Шариф", telefonLabel: "Телефон", telefonFormatError: "Телефон формати нотўғри (+998XXXXXXXXX)", fishRequired: "ФИШ киритилиши шарт", cancel: "Бекор қилиш", save: "Сақлаш", saving: "Сақланмоқда..." },
      };
      return t[l] || t.uz;
    },
  },
  methods: {
    async save() {
      if (!this.form.fish || !this.form.fish.trim()) {
        this.$toast?.error(this.texts.fishRequired);
        return;
      }
      if (this.form.telefon) {
        this.form.telefon = this.form.telefon.replace(/[\s\-()]/g, '');
        if (this.telefonError) {
          this.$toast?.error(this.texts.telefonFormatError);
          return;
        }
      }

      this.loading = true
      try {
        let response
        if (this.isEdit) {
          response = await this.$axios.$put(
            `/qarz-daftari/mijozlar/${this.mijoz.id}`,
            this.form
          )
        } else {
          response = await this.$axios.$post(
            `/qarz-daftari/savdo-faoliyat/${this.faoliyatId}/mijozlar`,
            this.form
          )
        }
        this.$emit('saved', response?.data || response)
        this.$emit('close')
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik yuz berdi')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
