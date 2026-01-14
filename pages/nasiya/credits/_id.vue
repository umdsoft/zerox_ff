<template>
  <div class="credit-detail-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'nasiya-credits' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ credit.credit_number || $t('nasiya.credit_detail') }}</h1>
      </div>
      <div class="mt-2 md:mt-0 flex flex-wrap gap-2">
        <span
          v-if="credit.linked_user_id"
          class="px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          {{ $t('nasiya.synced_badge') }}
        </span>
        <span
          v-if="credit.status"
          class="px-4 py-2 rounded-full text-sm font-medium"
          :class="getStatusClass(credit.status)"
        >
          {{ getStatusLabel(credit.status) }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Mijoz ma'lumotlari -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.customer') }}</h3>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {{ getInitials(credit.customer?.full_name) }}
            </div>
            <div>
              <p class="text-xl font-semibold text-gray-900">{{ credit.customer?.full_name }}</p>
              <p class="text-gray-500">{{ credit.customer?.phone }}</p>
              <p v-if="credit.customer?.address" class="text-sm text-gray-400">{{ credit.customer.address }}</p>
            </div>
          </div>
        </div>

        <!-- Mahsulotlar -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.products') }}</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left text-sm text-gray-500 border-b">
                  <th class="pb-3 font-medium">{{ $t('nasiya.product') }}</th>
                  <th class="pb-3 font-medium text-center">{{ $t('nasiya.quantity') }}</th>
                  <th class="pb-3 font-medium text-right">{{ $t('nasiya.price') }}</th>
                  <th class="pb-3 font-medium text-right">{{ $t('nasiya.total') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in credit.items"
                  :key="item.id"
                  class="border-b last:border-0"
                >
                  <td class="py-3">
                    <p class="font-medium">{{ item.product?.name || item.product_name }}</p>
                  </td>
                  <td class="py-3 text-center">{{ item.quantity }}</td>
                  <td class="py-3 text-right text-gray-500">{{ formatMoney(item.unit_price) }}</td>
                  <td class="py-3 text-right font-semibold">{{ formatMoney(item.total_price) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="border-t-2 border-gray-200">
                  <td colspan="3" class="py-3 text-right font-semibold">{{ $t('nasiya.total') }}:</td>
                  <td class="py-3 text-right font-bold text-lg">{{ formatMoney(credit.total_amount) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- To'lovlar tarixi -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.payment_history') }}</h3>
          <div v-if="credit.payments?.length" class="space-y-3">
            <div
              v-for="payment in credit.payments"
              :key="payment.id"
              class="flex items-center justify-between p-3 bg-green-50 rounded-xl"
            >
              <div>
                <p class="font-medium text-green-700">+{{ formatMoney(payment.amount) }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(payment.payment_date) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">{{ getPaymentMethod(payment.payment_method) }}</p>
                <p v-if="payment.notes" class="text-xs text-gray-400">{{ payment.notes }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6 text-gray-400">
            <p>{{ $t('nasiya.no_payments_yet') }}</p>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Qarz holati -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.credit_status') }}</h3>

          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-500">{{ $t('nasiya.total_amount') }}</p>
              <p class="text-2xl font-bold">{{ formatMoney(credit.total_amount) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ $t('nasiya.paid') }}</p>
              <p class="text-2xl font-bold text-green-600">{{ formatMoney(credit.paid_amount) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ $t('nasiya.remaining') }}</p>
              <p class="text-2xl font-bold text-red-600">{{ formatMoney(credit.remaining_amount) }}</p>
            </div>

            <!-- Progress -->
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>{{ $t('nasiya.progress') }}</span>
                <span>{{ progressPercent }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  class="h-3 rounded-full transition-all"
                  :class="credit.status === 'paid' ? 'bg-green-500' : 'bg-blue-500'"
                  :style="{ width: progressPercent + '%' }"
                ></div>
              </div>
            </div>

            <div class="pt-4 border-t">
              <p class="text-sm text-gray-500">{{ $t('nasiya.due_date') }}</p>
              <p class="font-medium" :class="credit.is_overdue ? 'text-red-600' : ''">
                {{ formatDate(credit.due_date) }}
                <span v-if="credit.is_overdue" class="text-sm">
                  ({{ formatDaysOverdue(credit.due_date) }})
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- To'lov qo'shish -->
        <div v-if="credit.status === 'active' || credit.status === 'overdue'" class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.add_payment') }}</h3>
          <form @submit.prevent="addPayment">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('nasiya.amount') }}</label>
                <input
                  v-model.number="paymentForm.amount"
                  type="number"
                  min="1"
                  :max="credit.remaining_amount"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('nasiya.payment_method') }}</label>
                <select
                  v-model="paymentForm.payment_method"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">{{ $t('nasiya.cash') }}</option>
                  <option value="card">{{ $t('nasiya.card') }}</option>
                  <option value="transfer">{{ $t('nasiya.transfer') }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('nasiya.notes') }}</label>
                <input
                  v-model="paymentForm.notes"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                :disabled="addingPayment"
                class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-medium"
              >
                {{ addingPayment ? $t('common.saving') : $t('nasiya.add_payment') }}
              </button>
            </div>
          </form>

          <!-- Quick amounts -->
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="amount in quickAmounts"
              :key="amount"
              class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
              @click="paymentForm.amount = amount"
            >
              {{ formatMoney(amount) }}
            </button>
            <button
              class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm"
              @click="paymentForm.amount = credit.remaining_amount"
            >
              {{ $t('nasiya.full_amount') }}
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="credit.status !== 'paid' && credit.status !== 'cancelled'" class="bg-white rounded-2xl shadow-sm p-6">
          <button
            class="w-full px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-medium"
            @click="cancelCredit"
          >
            {{ $t('nasiya.cancel_credit') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreditDetailPage',
  middleware: 'auth',

  data() {
    return {
      credit: {
        customer: {},
        items: [],
        payments: []
      },
      paymentForm: {
        amount: 0,
        payment_method: 'cash',
        notes: ''
      },
      loading: true,
      addingPayment: false
    }
  },

  computed: {
    creditId() {
      return this.$route.params.id
    },
    progressPercent() {
      if (!this.credit.total_amount) return 0
      return Math.round((this.credit.paid_amount / this.credit.total_amount) * 100)
    },
    quickAmounts() {
      const remaining = this.credit.remaining_amount || 0
      const amounts = [50000, 100000, 200000, 500000, 1000000]
      return amounts.filter(a => a < remaining)
    }
  },

  async mounted() {
    await this.loadCredit()
  },

  methods: {
    async loadCredit() {
      try {
        this.loading = true
        const res = await this.$api.getNasiyaCreditById(this.creditId)
        if (res?.data?.success) {
          this.credit = res.data.data
          this.paymentForm.amount = Math.min(100000, this.credit.remaining_amount)
        }
      } catch (error) {
        console.error('Load credit error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    async addPayment() {
      if (!this.paymentForm.amount || this.paymentForm.amount <= 0) return

      try {
        this.addingPayment = true
        const res = await this.$api.addNasiyaPayment(this.creditId, {
          amount: this.paymentForm.amount,
          payment_method: this.paymentForm.payment_method,
          payment_date: new Date().toISOString().split('T')[0],
          notes: this.paymentForm.notes
        })

        if (res?.data?.success) {
          this.$toast?.success(this.$t('nasiya.payment_added'))
          await this.loadCredit()
          this.paymentForm = {
            amount: Math.min(100000, this.credit.remaining_amount),
            payment_method: 'cash',
            notes: ''
          }
        }
      } catch (error) {
        console.error('Add payment error:', error)
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.addingPayment = false
      }
    },

    async cancelCredit() {
      if (!confirm(this.$t('nasiya.confirm_cancel_credit'))) return

      try {
        const res = await this.$api.cancelNasiyaCredit(this.creditId)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('nasiya.credit_cancelled'))
          await this.loadCredit()
        }
      } catch (error) {
        console.error('Cancel credit error:', error)
        this.$toast?.error(this.$t('errors.operationFailed'))
      }
    },

    getInitials(name) {
      if (!name) return '?'
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    },

    getStatusClass(status) {
      const classes = {
        active: 'bg-blue-100 text-blue-700',
        overdue: 'bg-red-100 text-red-700',
        paid: 'bg-green-100 text-green-700',
        cancelled: 'bg-gray-100 text-gray-700'
      }
      return classes[status] || 'bg-gray-100 text-gray-700'
    },

    getStatusLabel(status) {
      const labels = {
        active: this.$t('nasiya.status_active'),
        overdue: this.$t('nasiya.status_overdue'),
        paid: this.$t('nasiya.status_paid'),
        cancelled: this.$t('nasiya.status_cancelled')
      }
      return labels[status] || status
    },

    getPaymentMethod(method) {
      const methods = {
        cash: this.$t('nasiya.cash'),
        card: this.$t('nasiya.card'),
        transfer: this.$t('nasiya.transfer')
      }
      return methods[method] || method
    },

    formatMoney(value) {
      if (!value) return '0 UZS'
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('uz-UZ')
    },

    formatDaysOverdue(dueDate) {
      if (!dueDate) return ''
      const due = new Date(dueDate)
      const today = new Date()
      const diffDays = Math.floor((today - due) / (1000 * 60 * 60 * 24))
      if (diffDays <= 0) return ''
      return this.$t('nasiya.days_overdue', { days: diffDays })
    }
  }
}
</script>
