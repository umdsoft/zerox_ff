<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style="z-index: 100"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">
        {{ isEdit ? "Xodimni tahrirlash" : "Yangi xodim qo'shish" }}
      </h3>

      <form @submit.prevent="save">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            F.I.Sh
          </label>
          <input
            v-model="form.fish"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Familiya Ism Sharif"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Telefon
          </label>
          <input
            v-model="form.telefon"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+998 90 123 45 67"
            required
          />
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            @click="$emit('close')"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? "Saqlanmoqda..." : "Saqlash" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XodimModal',
  props: {
    faoliyatId: {
      type: [Number, String],
      required: true,
    },
    xodim: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        fish: this.xodim ? this.xodim.fish : '',
        telefon: this.xodim ? this.xodim.telefon : '',
      },
      loading: false,
    }
  },
  computed: {
    isEdit() {
      return !!this.xodim
    },
  },
  methods: {
    async save() {
      this.loading = true
      try {
        if (this.isEdit) {
          await this.$axios.$put(
            `/qarz-daftari/xodimlar/${this.xodim.id}`,
            this.form
          )
        } else {
          await this.$axios.$post(
            `/qarz-daftari/savdo-faoliyat/${this.faoliyatId}/xodimlar`,
            this.form
          )
        }
        this.$emit('saved')
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
