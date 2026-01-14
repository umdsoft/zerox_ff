<template>
  <div class="credits-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'nasiya' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('nasiya.credits') }}</h1>
      </div>
      <nuxt-link
        :to="localePath({ name: 'nasiya-credits-add' })"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        {{ $t('nasiya.new_sale') }}
      </nuxt-link>
    </div>

    <!-- Filter Tabs -->
    <div class="bg-white rounded-2xl p-2 shadow-sm mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          class="px-4 py-2 rounded-xl font-medium transition-colors"
          :class="filterStatus === tab.value ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
          @click="setStatus(tab.value)"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="ml-1 text-sm opacity-70">({{ tab.count }})</span>
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-2xl p-4 shadow-sm mb-6">
      <input
        v-model="search"
        type="text"
        :placeholder="$t('nasiya.search_credit')"
        class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @input="debouncedSearch"
      />
    </div>

    <!-- Credits List -->
    <div class="space-y-4">
      <div
        v-for="credit in credits"
        :key="credit.id"
        class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer"
        @click="goToCredit(credit.id)"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {{ getInitials(credit.customer?.full_name) }}
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ credit.customer?.full_name }}</p>
                <p class="text-sm text-gray-500">{{ credit.credit_number }}</p>
              </div>
            </div>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusClass(credit.status)"
            >
              {{ getStatusLabel(credit.status) }}
            </span>
          </div>

          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-gray-500">{{ $t('nasiya.total_amount') }}</p>
              <p class="font-semibold text-gray-900">{{ formatMoney(credit.total_amount) }}</p>
            </div>
            <div>
              <p class="text-gray-500">{{ $t('nasiya.paid') }}</p>
              <p class="font-semibold text-green-600">{{ formatMoney(credit.paid_amount) }}</p>
            </div>
            <div>
              <p class="text-gray-500">{{ $t('nasiya.remaining') }}</p>
              <p class="font-semibold text-red-600">{{ formatMoney(credit.remaining_amount) }}</p>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span class="text-gray-500">
              {{ $t('nasiya.due_date') }}: {{ formatDate(credit.due_date) }}
            </span>
            <span v-if="credit.is_overdue" class="text-red-600 font-medium">
              {{ formatDaysOverdue(credit.due_date) }}
            </span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="h-1 bg-gray-100">
          <div
            class="h-1 transition-all"
            :class="credit.status === 'paid' ? 'bg-green-500' : credit.is_overdue ? 'bg-red-500' : 'bg-blue-500'"
            :style="{ width: getProgressPercent(credit) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!credits.length" class="bg-white rounded-2xl p-12 shadow-sm text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('nasiya.no_credits') }}</h3>
      <p class="text-gray-500 mb-4">{{ $t('nasiya.no_credits_desc') }}</p>
      <nuxt-link
        :to="localePath({ name: 'nasiya-credits-add' })"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        {{ $t('nasiya.create_first_credit') }}
      </nuxt-link>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > pagination.limit" class="mt-6 flex justify-center">
      <div class="bg-white rounded-xl shadow-sm p-2 flex gap-2">
        <button
          :disabled="pagination.page === 1"
          class="px-3 py-1 rounded-lg border disabled:opacity-50"
          @click="changePage(-1)"
        >
          ←
        </button>
        <span class="px-3 py-1">{{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.limit) }}</span>
        <button
          :disabled="pagination.page >= Math.ceil(pagination.total / pagination.limit)"
          class="px-3 py-1 rounded-lg border disabled:opacity-50"
          @click="changePage(1)"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NasiyaCreditsPage',
  middleware: 'auth',

  data() {
    return {
      credits: [],
      stats: {},
      search: '',
      filterStatus: '',
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      },
      loading: true,
      searchTimeout: null
    }
  },

  computed: {
    statusTabs() {
      return [
        { value: '', label: this.$t('nasiya.all'), count: this.stats.total },
        { value: 'active', label: this.$t('nasiya.active'), count: this.stats.active },
        { value: 'overdue', label: this.$t('nasiya.overdue'), count: this.stats.overdue },
        { value: 'paid', label: this.$t('nasiya.paid'), count: this.stats.paid }
      ]
    }
  },

  async mounted() {
    // Check for status in query
    if (this.$route.query.status) {
      this.filterStatus = this.$route.query.status
    }
    await Promise.all([
      this.loadCredits(),
      this.loadStats()
    ])
  },

  methods: {
    async loadCredits() {
      try {
        this.loading = true
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        if (this.search) params.search = this.search
        if (this.filterStatus) params.status = this.filterStatus

        const res = await this.$api.getNasiyaCredits(params)
        if (res?.data?.success) {
          this.credits = res.data.data
          if (res.data.pagination) {
            this.pagination.total = res.data.pagination.total
          }
        }
      } catch (error) {
        console.error('Load credits error:', error)
      } finally {
        this.loading = false
      }
    },

    async loadStats() {
      try {
        const res = await this.$api.getNasiyaDashboard()
        if (res?.data?.success) {
          this.stats = res.data.data
        }
      } catch (error) {
        console.error('Load stats error:', error)
      }
    },

    setStatus(status) {
      this.filterStatus = status
      this.pagination.page = 1
      this.loadCredits()
    },

    debouncedSearch() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1
        this.loadCredits()
      }, 300)
    },

    changePage(delta) {
      this.pagination.page += delta
      this.loadCredits()
    },

    goToCredit(id) {
      this.$router.push(this.localePath({ name: 'nasiya-credits-id', params: { id } }))
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

    getProgressPercent(credit) {
      if (!credit.total_amount) return 0
      return Math.min(100, (credit.paid_amount / credit.total_amount) * 100)
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
