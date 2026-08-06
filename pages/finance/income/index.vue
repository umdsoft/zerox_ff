<template>
  <div class="incomes-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'finance' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.incomes') }}</h1>
      </div>
      <nuxt-link
        :to="localePath({ name: 'finance-income-add' })"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        {{ $t('finance.add_income') }}
      </nuxt-link>
    </div>

    <!-- Month Stats -->
    <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-green-100">{{ $t('finance.this_month') }}</p>
          <div class="mt-2">
            <p v-for="(line, i) in monthTotals" :key="i" :class="i === 0 ? 'text-3xl md:text-4xl font-bold leading-tight' : 'text-lg font-semibold text-green-100'">{{ line }}</p>
          </div>
        </div>
        <div class="mt-4 md:mt-0 flex items-center space-x-4">
          <button @click="changeMonth(-1)" class="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <span class="font-semibold text-white bg-white/20 px-3 py-1 rounded-full">{{ monthNames[selectedMonth - 1] }} {{ selectedYear }}</span>
          <button @click="changeMonth(1)" class="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Category Stats -->
    <div v-if="stats.by_category && stats.by_category.length" class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('finance.by_category') }}</h3>
      <div class="space-y-4">
        <div v-for="cat in stats.by_category" :key="cat.category_id" class="flex items-center">
          <div class="flex items-center flex-1">
            <span class="text-2xl mr-3">{{ cat.icon || '💰' }}</span>
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span class="font-medium">{{ getCategoryName(cat.category_name) || $t('finance.other') }}</span>
                <span class="text-gray-600">{{ formatMoney(cat.total, cat.currency) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full" :style="{ width: catPercent(cat) + '%', backgroundColor: cat.color || '#10B981' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Incomes List (sana bo'yicha guruhlangan) -->
    <div v-if="incomes.length">
      <div v-for="group in groupedIncomes" :key="group.date" class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <span class="text-sm font-semibold text-gray-700">{{ formatDateHeader(group.date) }}</span>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="income in group.items" :key="income.id" class="p-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-3xl mr-4">{{ income.category?.icon || '💰' }}</span>
                <div>
                  <p class="font-semibold text-gray-900">{{ getCategoryName(income.category?.name) || $t('finance.other') }}</p>
                  <p class="text-sm text-gray-500">{{ income.description || '-' }}</p>
                  <p v-if="formatTime(income.created_at)" class="text-xs text-gray-400 mt-0.5">🕐 {{ formatTime(income.created_at) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-green-600">+{{ formatMoney(income.amount, income.currency) }}</p>
                <p class="text-sm text-gray-500">{{ paymentMethodLabel(income.payment_method) }}</p>
              </div>
            </div>
            <div class="mt-2 flex justify-end gap-2">
              <button @click="editIncome(income)" class="text-sm text-blue-600 hover:text-blue-700">{{ $t('common.edit') }}</button>
              <button @click="askDelete(income)" class="text-sm text-red-600 hover:text-red-700">{{ $t('common.delete') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl shadow-sm p-12 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('finance.no_incomes') }}</h3>
      <nuxt-link :to="localePath({ name: 'finance-income-add' })" class="inline-flex items-center mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium">
        {{ $t('finance.add_income') }}
      </nuxt-link>
    </div>

    <!-- O'chirishni tasdiqlash (markaziy custom modal) -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showDeleteModal = false"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm text-center">
        <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ $t('finance.confirm_delete_income') || $t('common.delete') }}</h3>
        <p v-if="deleteTarget" class="text-sm text-gray-500 mb-5">
          {{ getCategoryName(deleteTarget.category?.name) || $t('finance.other') }} — {{ formatMoney(deleteTarget.amount, deleteTarget.currency) }}
        </p>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">{{ $t('common.cancel') }}</button>
          <button @click="doDelete" :disabled="deleteLoading" class="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-medium">
            {{ deleteLoading ? $t('common.loading') : $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IncomesPage',
  middleware: 'auth',

  data() {
    const now = new Date()
    return {
      incomes: [],
      stats: { total: 0, by_category: [] },
      selectedMonth: now.getMonth() + 1,
      selectedYear: now.getFullYear(),
      showDeleteModal: false,
      deleteTarget: null,
      deleteLoading: false,
      loading: true
    }
  },

  computed: {
    monthNames() {
      return [
        this.$t('months.january'), this.$t('months.february'), this.$t('months.march'),
        this.$t('months.april'), this.$t('months.may'), this.$t('months.june'),
        this.$t('months.july'), this.$t('months.august'), this.$t('months.september'),
        this.$t('months.october'), this.$t('months.november'), this.$t('months.december')
      ]
    },

    // Oylik jami — valyuta bo'yicha (yuklangan daromadlardan)
    monthTotals() {
      const map = {}
      for (const i of this.incomes) {
        const c = i.currency || 'UZS'
        map[c] = (map[c] || 0) + (parseFloat(i.amount) || 0)
      }
      const keys = Object.keys(map)
      if (!keys.length) return ['0 UZS']
      keys.sort((a, b) => (a === 'UZS' ? -1 : b === 'UZS' ? 1 : 0))
      return keys.map(c => this.formatMoney(map[c], c))
    },

    // Sana bo'yicha guruhlash (yangi sana yuqorida)
    groupedIncomes() {
      const groups = {}
      for (const i of this.incomes) {
        const d = this.localDateKey(i.income_date)
        if (!groups[d]) groups[d] = []
        groups[d].push(i)
      }
      return Object.keys(groups).sort((a, b) => b.localeCompare(a)).map(date => ({ date, items: groups[date] }))
    }
  },

  watch: {
    selectedMonth() { this.loadIncomes(); this.loadStats() },
    selectedYear() { this.loadIncomes(); this.loadStats() }
  },

  async mounted() {
    await Promise.all([this.loadIncomes(), this.loadStats()])
  },

  methods: {
    async loadIncomes() {
      try {
        this.loading = true
        const startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1)
        const endDate = new Date(this.selectedYear, this.selectedMonth, 0)
        const params = {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }
        const res = await this.$api.getIncomes(params)
        if (res?.data?.success) this.incomes = res.data.data
      } catch (error) {
        console.error('Load incomes error:', error)
      } finally {
        this.loading = false
      }
    },

    async loadStats() {
      try {
        const res = await this.$api.getIncomeStats({ year: this.selectedYear, month: this.selectedMonth })
        if (res?.data?.success) this.stats = res.data.data
      } catch (error) {
        console.error('Load income stats error:', error)
      }
    },

    changeMonth(delta) {
      let m = this.selectedMonth + delta
      let y = this.selectedYear
      if (m > 12) { m = 1; y++ } else if (m < 1) { m = 12; y-- }
      this.selectedMonth = m
      this.selectedYear = y
    },

    editIncome(income) {
      this.$router.push(this.localePath({ name: 'finance-income-add', query: { edit: income.id } }))
    },

    askDelete(income) {
      this.deleteTarget = income
      this.showDeleteModal = true
    },

    async doDelete() {
      const id = this.deleteTarget?.id
      if (!id) return
      try {
        this.deleteLoading = true
        const res = await this.$api.deleteIncome(id)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.income_deleted') || this.$t('common.deleted') || 'OK')
          this.showDeleteModal = false
          this.deleteTarget = null
          await this.loadIncomes()
          await this.loadStats()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.deleteLoading = false
      }
    },

    catPercent(cat) {
      const total = (this.stats.by_category || []).reduce((s, c) => s + (parseFloat(c.total) || 0), 0)
      if (!total) return 0
      return Math.round(((parseFloat(cat.total) || 0) / total) * 100)
    },

    formatMoney(value, currency = 'UZS') {
      const cur = currency || 'UZS'
      if (!value) return '0 ' + cur
      return Number(value).toLocaleString('uz-UZ') + ' ' + cur
    },

    paymentMethodLabel(pm) {
      if (!pm) return ''
      const key = `finance.${pm}`
      const t = this.$t(key)
      return t === key ? pm : t
    },

    formatTime(dt) {
      if (!dt) return ''
      const d = new Date(dt)
      if (isNaN(d)) return ''
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    },

    localDateKey(d) {
      if (!d) return ''
      const dt = new Date(d)
      if (isNaN(dt)) return String(d).split('T')[0]
      const y = dt.getFullYear()
      const m = String(dt.getMonth() + 1).padStart(2, '0')
      const day = String(dt.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    },

    formatDateHeader(date) {
      if (!date) return '-'
      const d = new Date(date + 'T00:00:00')
      if (isNaN(d)) return date
      return `${d.getDate()}-${this.monthNames[d.getMonth()] || ''}, ${d.getFullYear()}`
    },

    getCategoryName(name) {
      if (!name) return null
      const key = `finance.${name}`
      const t = this.$t(key)
      return t === key ? name : t
    }
  }
}
</script>
