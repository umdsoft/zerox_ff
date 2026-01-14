<template>
  <div class="debt-detail pb-8">
    <!-- Page Header -->
    <div class="mb-6">
      <nuxt-link :to="localePath({ name: 'finance-debts' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ debt.source_name }}</h1>
    </div>

    <!-- Debt Info Card -->
    <div class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            :class="debt.type === 'borrowed' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'"
          >
            {{ getInitials(debt.source_name) }}
          </div>
          <div class="ml-4">
            <p class="text-lg font-semibold text-gray-900">{{ debt.source_name }}</p>
            <p class="text-sm text-gray-500">{{ getSourceType(debt.source_type) }}</p>
          </div>
        </div>
        <span
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="debt.type === 'borrowed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
        >
          {{ debt.type === 'borrowed' ? $t('finance.borrowed') : $t('finance.lent') }}
        </span>
      </div>

      <!-- Amount Details -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.total_amount') }}</p>
          <p class="text-xl font-bold text-gray-900">{{ formatMoney(debt.amount) }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.paid_amount') }}</p>
          <p class="text-xl font-bold text-green-600">{{ formatMoney(paidAmount) }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.remaining') }}</p>
          <p class="text-xl font-bold" :class="debt.type === 'borrowed' ? 'text-red-600' : 'text-blue-600'">
            {{ formatMoney(debt.remaining_amount) }}
          </p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('finance.progress') }}</p>
          <p class="text-xl font-bold text-gray-900">{{ paidPercent }}%</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all"
            :class="debt.type === 'borrowed' ? 'bg-red-500' : 'bg-green-500'"
            :style="{ width: paidPercent + '%' }"
          ></div>
        </div>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-500">{{ $t('finance.debt_date') }}</p>
          <p class="font-medium">{{ formatDate(debt.start_date) }}</p>
        </div>
        <div>
          <p class="text-gray-500">{{ $t('finance.due_date') }}</p>
          <p class="font-medium" :class="isOverdue ? 'text-red-600' : ''">
            {{ debt.due_date ? formatDate(debt.due_date) : '-' }}
            <span v-if="isOverdue" class="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {{ $t('finance.overdue') }}
            </span>
          </p>
        </div>
      </div>

      <!-- Description -->
      <div v-if="debt.notes" class="mt-4 pt-4 border-t">
        <p class="text-sm text-gray-500 mb-1">{{ $t('finance.notes') }}</p>
        <p class="text-gray-700">{{ debt.notes }}</p>
      </div>
    </div>

    <!-- Add Payment -->
    <div v-if="debt.status === 'active'" class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('finance.add_payment') }}</h3>
      <form @submit.prevent="addPayment" class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="paymentAmount"
            type="number"
            min="1000"
            :max="debt.remaining_amount"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            :placeholder="$t('finance.payment_amount')"
          />
        </div>
        <div class="flex-1">
          <input
            v-model="paymentDate"
            type="date"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          :disabled="paymentLoading"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium"
        >
          {{ paymentLoading ? $t('common.loading') : $t('finance.record_payment') }}
        </button>
      </form>
    </div>

    <!-- Payment History -->
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('finance.payment_history') }}</h3>
      <div v-if="debt.payments?.length" class="space-y-3">
        <div
          v-for="payment in debt.payments"
          :key="payment.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
        >
          <div>
            <p class="font-medium text-gray-900">{{ formatMoney(payment.amount) }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(payment.payment_date) }}</p>
          </div>
          <span class="text-green-600 font-semibold">{{ $t('finance.paid') }}</span>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-400">
        <p>{{ $t('finance.no_payments') }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="debt.status === 'active'" class="mt-6 flex gap-4">
      <button
        @click="markCompleted"
        class="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
      >
        {{ $t('finance.mark_completed') }}
      </button>
      <button
        @click="confirmDelete"
        class="py-3 px-6 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium"
      >
        {{ $t('common.delete') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DebtDetail',
  middleware: 'auth',

  data() {
    return {
      debt: {
        payments: []
      },
      paymentAmount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentLoading: false,
      loading: true
    }
  },

  computed: {
    isOverdue() {
      if (!this.debt.due_date || this.debt.status !== 'active') return false
      return new Date(this.debt.due_date) < new Date()
    },

    paidAmount() {
      if (!this.debt.amount) return 0
      return this.debt.amount - (this.debt.remaining_amount || 0)
    },

    paidPercent() {
      if (!this.debt.amount || this.debt.amount <= 0) return 0
      return Math.round((this.paidAmount / this.debt.amount) * 100)
    }
  },

  async mounted() {
    await this.loadDebt()
  },

  methods: {
    async loadDebt() {
      try {
        this.loading = true
        const res = await this.$api.getDebtById(this.$route.params.id)
        if (res?.data?.success) {
          this.debt = res.data.data
        }
      } catch (error) {
        console.error('Load debt error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
        this.$router.push(this.localePath({ name: 'finance-debts' }))
      } finally {
        this.loading = false
      }
    },

    async addPayment() {
      try {
        this.paymentLoading = true
        const res = await this.$api.addDebtPayment(this.debt.id, {
          amount: this.paymentAmount,
          payment_date: this.paymentDate
        })
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.payment_added'))
          this.paymentAmount = ''
          await this.loadDebt()
        }
      } catch (error) {
        console.error('Add payment error:', error)
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.paymentLoading = false
      }
    },

    async markCompleted() {
      if (!confirm(this.$t('finance.confirm_complete'))) return
      try {
        const res = await this.$api.updateDebt(this.debt.id, { status: 'completed' })
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.debt_completed'))
          await this.loadDebt()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      }
    },

    async confirmDelete() {
      if (!confirm(this.$t('finance.confirm_delete'))) return
      try {
        const res = await this.$api.deleteDebt(this.debt.id)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.debt_deleted'))
          this.$router.push(this.localePath({ name: 'finance-debts' }))
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      }
    },

    formatMoney(value) {
      if (!value) return '0 ' + (this.debt.currency || 'UZS')
      return Number(value).toLocaleString('uz-UZ') + ' ' + (this.debt.currency || 'UZS')
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('uz-UZ')
    },

    getInitials(name) {
      if (!name) return '?'
      return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    },

    getSourceType(type) {
      const types = {
        bank: this.$t('finance.source_bank'),
        family: this.$t('finance.source_family'),
        friend: this.$t('finance.source_friend'),
        other: this.$t('finance.source_other')
      }
      return types[type] || type
    }
  }
}
</script>
