<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style="z-index: 100"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
      <h3 class="text-lg font-semibold mb-1">
        {{ isEdit ? "Xodimni tahrirlash" : "Yangi xodim qo'shish" }}
      </h3>
      <p class="text-xs text-gray-500 mb-4">
        Xodim telefon raqami va parol orqali tizimga kirib, do'koningiz qarz daftarini yuritadi.
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
          <p class="text-xs text-gray-400 mt-1">Format: +998XXXXXXXXX — xodim shu raqam bilan kiradi</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Parol
            <span v-if="!isEdit" class="text-red-400">*</span>
            <span v-else class="text-gray-400 font-normal">(o'zgartirmaslik uchun bo'sh qoldiring)</span>
          </label>
          <input
            v-model="form.parol"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            :placeholder="isEdit && xodim && xodim.has_login ? '•••••• (mavjud)' : 'Kamida 4 ta belgi'"
            autocomplete="new-password"
          />
        </div>

        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input v-model="form.login_active" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span class="text-sm text-gray-700">Login faol (o'chirilsa xodim tizimga kira olmaydi)</span>
        </label>

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
        parol: '',
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
      if (!this.isEdit && (!this.form.parol || this.form.parol.trim().length < 4)) {
        this.$toast?.error('Parol kamida 4 ta belgidan iborat bo\'lsin');
        return false;
      }
      if (this.form.parol && this.form.parol.trim().length > 0 && this.form.parol.trim().length < 4) {
        this.$toast?.error('Parol kamida 4 ta belgidan iborat bo\'lsin');
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
      if (this.form.parol && this.form.parol.trim()) {
        payload.parol = this.form.parol.trim();
      }
      try {
        if (this.isEdit) {
          await this.$axios.$put(`/qarz-daftari/xodimlar/${this.xodim.id}`, payload)
        } else {
          await this.$axios.$post(`/qarz-daftari/savdo-faoliyat/${this.faoliyatId}/xodimlar`, payload)
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
