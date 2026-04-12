<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style="z-index: 100"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h3 class="text-lg font-semibold mb-4">Qarzni yopish</h3>

      <div class="mb-4 p-3 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">
          Qoldiq:
          <span class="font-semibold text-gray-900">
            {{ formatNumber(qarz.qoldiq) }} {{ qarz.valyuta }}
          </span>
        </p>
      </div>

      <form @submit.prevent="save">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Summa
          </label>
          <input
            v-model.number="form.summa"
            type="number"
            min="0"
            :max="qarz.qoldiq"
            step="any"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Summani kiriting"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Valyuta
          </label>
          <input
            :value="qarz.valyuta"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
            readonly
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
            {{ loading ? "Saqlanmoqda..." : "Yopish" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QarzYopishModal',
  props: {
    qarz: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        summa: null,
      },
      loading: false,
    }
  },
  methods: {
    formatNumber(n) {
      return Number(n || 0).toLocaleString('uz-UZ')
    },
    async save() {
      this.loading = true
      try {
        await this.$axios.$post(
          `/qarz-daftari/qarz/${this.qarz.id}/yopish`,
          this.form
        )
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
