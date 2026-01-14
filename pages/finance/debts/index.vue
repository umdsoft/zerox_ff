<template>
  <div class="personal-debts pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'finance' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.personal_debts') }}</h1>
      </div>
      <nuxt-link
        :to="localePath({ name: 'finance-debts-add' })"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        {{ $t('finance.add_debt') }}
      </nuxt-link>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl p-4 shadow-sm mb-6">
      <div class="flex flex-wrap gap-3">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeType = tab.value"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          :class="activeType === tab.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <p class="text-sm text-gray-500">{{ $t('finance.total_borrowed') }}</p>
        <p class="text-2xl font-bold text-red-600 mt-1">{{ formatMoney(stats.borrowed_total) }}</p>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <p class="text-sm text-gray-500">{{ $t('finance.total_lent') }}</p>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ formatMoney(stats.lent_total) }}</p>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <p class="text-sm text-gray-500">{{ $t('finance.net_balance') }}</p>
        <p class="text-2xl font-bold mt-1" :class="stats.net_balance >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatMoney(stats.net_balance) }}
        </p>
      </div>
    </div>

    <!-- Debts List -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div v-if="debts.length" class="divide-y divide-gray-100">
        <div
          v-for="debt in debts"
          :key="debt.id"
          class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          @click="openDebt(debt.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                :class="debt.type === 'borrowed' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'"
              >
                {{ getInitials(debt.source_name) }}
              </div>
              <div class="ml-4">
                <p class="font-semibold text-gray-900">{{ debt.source_name }}</p>
                <p class="text-sm text-gray-500">
                  {{ getSourceType(debt.source_type) }}
                  <span v-if="debt.due_date" class="ml-2">
                    · {{ $t('finance.due') }}: {{ formatDate(debt.due_date) }}
                  </span>
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold" :class="debt.type === 'borrowed' ? 'text-red-600' : 'text-green-600'">
                {{ debt.type === 'borrowed' ? '-' : '+' }}{{ formatMoney(debt.remaining_amount) }}
              </p>
              <p class="text-sm text-gray-500">
                {{ getPaidPercent(debt) }}% {{ $t('finance.paid') }}
              </p>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="mt-3">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all"
                :class="debt.type === 'borrowed' ? 'bg-red-500' : 'bg-green-500'"
                :style="{ width: getPaidPercent(debt) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Status badges -->
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-if="debt.status === 'active'"
              class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {{ $t('finance.status_active') }}
            </span>
            <span
              v-if="isOverdue(debt)"
              class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
            >
              {{ $t('finance.overdue') }}
            </span>
            <span
              v-if="debt.status === 'completed'"
              class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
            >
              {{ $t('finance.status_completed') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('finance.no_debts') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('finance.no_debts_desc') }}</p>
        <nuxt-link
          :to="localePath({ name: 'finance-debts-add' })"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
        >
          {{ $t('finance.add_first_debt') }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalDebts',
  middleware: 'auth',

  data() {
    return {
      debts: [],
      stats: {
        borrowed_total: 0,
        lent_total: 0,
        net_balance: 0
      },
      activeType: 'all',
      loading: true
    }
  },

  computed: {
    tabs() {
      return [
        { value: 'all', label: this.$t('common.all') },
        { value: 'borrowed', label: this.$t('finance.borrowed') },
        { value: 'lent', label: this.$t('finance.lent') }
      ]
    }
  },

  watch: {
    activeType() {
      this.loadDebts()
    }
  },

  async mounted() {
    // Check query param for initial type
    if (this.$route.query.type) {
      this.activeType = this.$route.query.type
    }
    await this.loadDebts()
    await this.loadStats()
  },

  methods: {
    async loadDebts() {
      try {
        this.loading = true
        const params = {}
        if (this.activeType !== 'all') {
          params.type = this.activeType
        }
        const res = await this.$api.getPersonalDebts(params)
        if (res?.data?.success) {
          this.debts = res.data.data
        }
      } catch (error) {
        console.error('Load debts error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    async loadStats() {
      try {
        const res = await this.$api.getDebtStats()
        if (res?.data?.success) {
          this.stats = res.data.data
        }
      } catch (error) {
        console.error('Load stats error:', error)
      }
    },

    openDebt(id) {
      this.$router.push(this.localePath({ name: 'finance-debts-id', params: { id } }))
    },

    formatMoney(value) {
      if (!value) return '0 UZS'
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
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
    },

    isOverdue(debt) {
      if (!debt.due_date || debt.status !== 'active') return false
      return new Date(debt.due_date) < new Date()
    },

    getPaidPercent(debt) {
      if (!debt.amount || debt.amount <= 0) return 0
      const paidAmount = debt.amount - (debt.remaining_amount || 0)
      return Math.round((paidAmount / debt.amount) * 100)
    }
  }
}
</script>
