<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style="z-index: 100"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">
        {{ isEdit ? texts.editTitle : texts.addTitle }}
      </h3>

      <form @submit.prevent="save" novalidate>
        <div class="mb-4">
          <input
            v-model="form.nomi"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :placeholder="texts.placeholder"
          />
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
  name: 'SavdoFaoliyatModal',
  props: {
    faoliyat: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        nomi: this.faoliyat ? this.faoliyat.nomi : '',
      },
      loading: false,
    }
  },
  computed: {
    isEdit() {
      return !!this.faoliyat
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { addTitle: "Yangi savdo faoliyati (do'kon)", editTitle: "Savdo faoliyatini tahrirlash", placeholder: "Savdo faoliyati (do'kon) nomi", cancel: "Bekor qilish", save: "Saqlash", saving: "Saqlanmoqda...", nameRequired: "Savdo faoliyati nomini kiriting" },
        ru: { addTitle: "Новая торговая деятельность (магазин)", editTitle: "Редактировать торговую деятельность", placeholder: "Название торговой деятельности (магазина)", cancel: "Отмена", save: "Сохранить", saving: "Сохранение...", nameRequired: "Введите название торговой деятельности" },
        kr: { addTitle: "Янги савдо фаолияти (дўкон)", editTitle: "Савдо фаолиятини таҳрирлаш", placeholder: "Савдо фаолияти (дўкон) номи", cancel: "Бекор қилиш", save: "Сақлаш", saving: "Сақланмоқда...", nameRequired: "Савдо фаолияти номини киритинг" },
      };
      return t[l] || t.uz;
    },
  },
  methods: {
    async save() {
      if (!this.form.nomi || !this.form.nomi.trim()) {
        this.$toast?.error(this.texts.nameRequired);
        return;
      }
      this.loading = true
      try {
        let response
        if (this.isEdit) {
          response = await this.$axios.$put(
            `/qarz-daftari/savdo-faoliyat/${this.faoliyat.id}`,
            this.form
          )
        } else {
          response = await this.$axios.$post(
            '/qarz-daftari/savdo-faoliyat',
            this.form
          )
        }
        this.$emit('saved', response)
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
