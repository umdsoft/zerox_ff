<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden">
      <!-- Logo -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center">
        <h1 class="text-2xl font-bold text-white">ZeroX</h1>
        <p class="text-blue-200 text-sm mt-1">{{ texts.paymentPage }}</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="p-8 text-center">
        <div class="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
      </div>

      <!-- Xato -->
      <div v-else-if="error" class="p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-900">{{ texts.notFound }}</h2>
        <p class="text-sm text-gray-500 mt-2">{{ texts.notFoundDesc }}</p>
      </div>

      <!-- Qarz ma'lumotlari -->
      <div v-else class="p-6">
        <!-- Kreditor -->
        <div class="text-center mb-6">
          <p class="text-sm text-gray-500">{{ texts.creditor }}</p>
          <p class="font-semibold text-gray-900 text-lg">{{ data.creditor_name }}</p>
        </div>

        <!-- Qarzdor -->
        <div class="bg-gray-50 rounded-xl p-4 mb-6">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-500">{{ texts.debtor }}</span>
            <span class="font-medium text-gray-900">{{ data.debtor_name }}</span>
          </div>
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-500">{{ texts.totalAmount }}</span>
            <span class="font-medium text-gray-900">{{ formatMoney(data.amount) }} {{ data.currency }}</span>
          </div>
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm text-gray-500">{{ texts.paidAmount }}</span>
            <span class="font-medium text-green-600">{{ formatMoney(data.paid_amount) }} {{ data.currency }}</span>
          </div>
          <div class="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span class="text-sm font-semibold text-gray-700">{{ texts.remainingAmount }}</span>
            <span class="text-xl font-bold text-red-600">{{ formatMoney(data.remaining_amount) }} {{ data.currency }}</span>
          </div>
          <div v-if="data.due_date" class="flex justify-between items-center mt-3">
            <span class="text-sm text-gray-500">{{ texts.dueDate }}</span>
            <span class="font-medium" :class="isOverdue ? 'text-red-600' : 'text-gray-900'">
              {{ formatDate(data.due_date) }}
              <span v-if="isOverdue" class="text-xs">({{ texts.overdue }})</span>
            </span>
          </div>
        </div>

        <!-- To'lov tugmalari -->
        <div class="space-y-3">
          <button
            @click="payWith('click')"
            class="w-full flex items-center justify-center gap-3 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            <span class="text-lg">Click</span> {{ texts.payWith }}
          </button>
          <button
            @click="payWith('payme')"
            class="w-full flex items-center justify-center gap-3 py-3.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-colors"
          >
            <span class="text-lg">Payme</span> {{ texts.payWith }}
          </button>
        </div>

        <p class="text-xs text-gray-400 text-center mt-4">{{ texts.secureNote }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  auth: false,

  data() {
    return {
      data: null,
      loading: true,
      error: false,
    };
  },

  computed: {
    isOverdue() {
      return this.data?.due_date && new Date(this.data.due_date) < new Date();
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          paymentPage: "Qarz to'lash sahifasi",
          notFound: 'Havola topilmadi',
          notFoundDesc: "Bu havola yaroqsiz yoki muddati o'tgan",
          creditor: 'Qarz beruvchi',
          debtor: 'Qarzdor',
          totalAmount: 'Qarz summasi',
          paidAmount: "To'langan",
          remainingAmount: 'Qoldiq summa',
          dueDate: 'Muddat',
          overdue: "muddati o'tgan",
          payWith: "orqali to'lash",
          secureNote: "To'lov xavfsiz tarzda amalga oshiriladi",
        },
        ru: {
          paymentPage: 'Страница оплаты долга',
          notFound: 'Ссылка не найдена',
          notFoundDesc: 'Эта ссылка недействительна или просрочена',
          creditor: 'Кредитор',
          debtor: 'Должник',
          totalAmount: 'Сумма долга',
          paidAmount: 'Оплачено',
          remainingAmount: 'Остаток',
          dueDate: 'Срок',
          overdue: 'просрочено',
          payWith: 'оплатить через',
          secureNote: 'Оплата производится безопасно',
        },
        kr: {
          paymentPage: 'Қарз тўлаш саҳифаси',
          notFound: 'Ҳавола топилмади',
          notFoundDesc: 'Бу ҳавола яроқсиз ёки муддати ўтган',
          creditor: 'Қарз берувчи',
          debtor: 'Қарздор',
          totalAmount: 'Қарз суммаси',
          paidAmount: 'Тўланган',
          remainingAmount: 'Қолдиқ сумма',
          dueDate: 'Муддат',
          overdue: 'муддати ўтган',
          payWith: 'орқали тўлаш',
          secureNote: 'Тўлов хавфсиз тарзда амалга оширилади',
        },
      };
      return t[l] || t.uz;
    },
  },

  async mounted() {
    try {
      const code = this.$route.params.code;
      const res = await this.$axios.$get(`/pay/${code}`);
      if (res?.success) {
        this.data = res.data;
      } else {
        this.error = true;
      }
    } catch (_) {
      this.error = true;
    }
    this.loading = false;
  },

  methods: {
    formatMoney(n) { return n ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    formatDate(d) { if (!d) return ''; const dt = new Date(d); return `${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.${dt.getFullYear()}`; },
    async payWith(method) {
      try {
        const code = this.$route.params.code;
        const res = await this.$axios.post(`/finance/payment/debt/${code}/pay`, {
          payment_method: method,
        });

        if (res.data.success && res.data.data?.payment_url) {
          window.location.href = res.data.data.payment_url;
        } else {
          this.$toast?.error?.(res.data.message || 'Xatolik');
        }
      } catch (_) {
        this.$toast?.error?.('Xatolik yuz berdi');
      }
    },
  },
};
</script>
