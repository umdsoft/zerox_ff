<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style="z-index: 100"
    @click.self="$emit('close')"
  >
    <!-- Tailwind v2 (JIT o'chiq) da `max-h-[90vh]` INERT — modal kichik ekranda
         cheklovsiz cho'zilib, "Saqlash" tugmasi ko'rinmay qolardi. Inline style. -->
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 overflow-y-auto" style="max-height: 90vh">
      <h3 class="text-lg font-semibold mb-1">
        {{ isEdit ? "Xodimni tahrirlash" : "Yangi xodim qo'shish" }}
      </h3>
      <p class="text-xs text-gray-500 mb-4">
        Xodim o'z telefon raqami orqali tizimga kirib, do'koningiz qarz daftarini yuritadi.
      </p>

      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">F.I.Sh <span class="text-red-400">*</span></label>
          <input
            v-model="form.fish"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Familiya Ism Sharif"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Telefon (login) <span class="text-red-400">*</span></label>
          <input
            v-model="form.telefon"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+998901234567"
            required
          />
          <p class="text-xs text-gray-400 mt-1">Format: +998XXXXXXXXX — xodim shu raqam bilan kiradi (parolni o'zi yaratadi)</p>
        </div>

        <!-- SS-16 (2026-09-19): "Login faol" checkbox OLIB TASHLANDI — telefon raqami
             qo'shilgan bo'lsa, shu raqam egasi xodim hisoblanadi (login_active doim true). -->

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            @click="$emit('close')"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            :style="loading ? 'opacity:.5; cursor:not-allowed' : ''"
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
        login_active: this.xodim ? this.xodim.login_active !== false : true,
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
    validate() {
      const phone = (this.form.telefon || '').replace(/\s+/g, '');
      if (!this.form.fish || !this.form.fish.trim()) {
        this.$toast?.error('F.I.Sh kiriting');
        return false;
      }
      if (!/^\+998\d{9}$/.test(phone)) {
        this.$toast?.error("Telefon formati: +998XXXXXXXXX");
        return false;
      }
      return true;
    },
    async save() {
      if (!this.validate()) return;
      this.loading = true
      const payload = {
        fish: this.form.fish.trim(),
        telefon: (this.form.telefon || '').replace(/\s+/g, ''),
        login_active: this.form.login_active,
      };
      try {
        /**
         * SS16 (2026-09-21): `silent: true` SHART. Aks holda xabar IKKI MARTA chiqadi:
         *   1) `plugins/axios.js` global interceptor serverning `message` ini ko'rsatadi
         *      (409 "Bu telefon raqami boshqa xodimga biriktirilgan." — `shouldShowToast`),
         *   2) quyidagi `catch` bloki ham AYNI xabarni ko'rsatadi.
         * Formadagi o'z ishlovimiz aniqroq (zaxira matni bor), shuning uchun
         * globalini o'chiramiz — teskarisini emas.
         */
        const opts = { silent: true }
        if (this.isEdit) {
          await this.$axios.$put(`/qarz-daftari/xodimlar/${this.xodim.id}`, payload, opts)
        } else {
          await this.$axios.$post(`/qarz-daftari/savdo-faoliyat/${this.faoliyatId}/xodimlar`, payload, opts)
        }
        this.$toast?.success('Saqlandi')
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
