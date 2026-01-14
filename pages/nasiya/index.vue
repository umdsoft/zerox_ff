<template>
  <div class="nasiya-dashboard pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('nasiya.title') }}</h1>
        <p class="text-gray-500 mt-1">{{ $t('nasiya.subtitle') }}</p>
      </div>
      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap gap-2 mt-4 md:mt-0">
        <nuxt-link
          :to="localePath({ name: 'nasiya-credits-add' })"
          class="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          {{ $t('nasiya.new_sale') }}
        </nuxt-link>
        <nuxt-link
          :to="localePath({ name: 'nasiya-customers-add' })"
          class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm"
        >
          <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
          </svg>
          {{ $t('nasiya.add_customer') }}
        </nuxt-link>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Jami nasiya -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-blue-500">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{{ stats.active_count || 0 }}</span>
        </div>
        <p class="text-sm text-gray-500">{{ $t('nasiya.total_receivable') }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatMoney(stats.total_receivable) }}</p>
      </div>

      <!-- Bugungi tushum -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-green-500">
        <div class="flex items-center justify-between mb-3">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{{ $t('nasiya.today') }}</span>
        </div>
        <p class="text-sm text-gray-500">{{ $t('nasiya.today_collected') }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatMoney(stats.today_collected) }}</p>
      </div>

      <!-- Muddati o'tgan -->
      <nuxt-link :to="localePath({ name: 'nasiya-credits', query: { status: 'overdue' } })" class="block">
        <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-red-500 hover:shadow-lg transition-all">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">{{ stats.overdue_count || 0 }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ $t('nasiya.overdue') }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatMoney(stats.overdue_amount) }}</p>
        </div>
      </nuxt-link>

      <!-- Mijozlar -->
      <nuxt-link :to="localePath({ name: 'nasiya-customers' })" class="block">
        <div class="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-purple-500 hover:shadow-lg transition-all">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{{ $t('nasiya.total') }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ $t('nasiya.customers') }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ stats.customer_count || 0 }}</p>
        </div>
      </nuxt-link>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Muddati o'tganlar -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('nasiya.overdue_credits') }}</h3>
          <nuxt-link :to="localePath({ name: 'nasiya-credits', query: { status: 'overdue' } })" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            {{ $t('common.all') }} →
          </nuxt-link>
        </div>
        <div v-if="overdue.length" class="space-y-3">
          <div
            v-for="credit in overdue"
            :key="credit.id"
            class="flex items-center justify-between p-3 bg-red-50 rounded-xl cursor-pointer hover:bg-red-100 transition-colors"
            @click="goToCredit(credit.id)"
          >
            <div>
              <p class="font-medium text-gray-900">{{ credit.customer?.full_name }}</p>
              <p class="text-sm text-red-600">{{ formatDaysOverdue(credit.due_date) }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-red-600">{{ formatMoney(credit.remaining_amount) }}</p>
              <p class="text-xs text-gray-500">{{ credit.credit_number }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p>{{ $t('nasiya.no_overdue') }}</p>
        </div>
      </div>

      <!-- Yaqinlashayotgan to'lovlar -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('nasiya.upcoming_payments') }}</h3>
          <nuxt-link :to="localePath({ name: 'nasiya-credits' })" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
            {{ $t('common.all') }} →
          </nuxt-link>
        </div>
        <div v-if="upcoming.length" class="space-y-3">
          <div
            v-for="credit in upcoming"
            :key="credit.id"
            class="flex items-center justify-between p-3 bg-yellow-50 rounded-xl cursor-pointer hover:bg-yellow-100 transition-colors"
            @click="goToCredit(credit.id)"
          >
            <div>
              <p class="font-medium text-gray-900">{{ credit.customer?.full_name }}</p>
              <p class="text-sm text-yellow-600">{{ formatDueDate(credit.due_date) }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-900">{{ formatMoney(credit.remaining_amount) }}</p>
              <p class="text-xs text-gray-500">{{ credit.credit_number }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p>{{ $t('nasiya.no_upcoming') }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <nuxt-link
        :to="localePath({ name: 'nasiya-credits' })"
        class="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all text-center group"
      >
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="font-medium text-gray-900">{{ $t('nasiya.credits') }}</p>
      </nuxt-link>

      <nuxt-link
        :to="localePath({ name: 'nasiya-customers' })"
        class="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all text-center group"
      >
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <p class="font-medium text-gray-900">{{ $t('nasiya.customers') }}</p>
      </nuxt-link>

      <nuxt-link
        :to="localePath({ name: 'nasiya-products' })"
        class="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all text-center group"
      >
        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <p class="font-medium text-gray-900">{{ $t('nasiya.products') }}</p>
      </nuxt-link>

      <nuxt-link
        :to="localePath({ name: 'nasiya-credits-add' })"
        class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all text-center text-white"
      >
        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
        </div>
        <p class="font-medium">{{ $t('nasiya.new_sale') }}</p>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NasiyaDashboard',
  middleware: 'auth',

  data() {
    return {
      stats: {
        total_receivable: 0,
        today_collected: 0,
        overdue_amount: 0,
        overdue_count: 0,
        active_count: 0,
        customer_count: 0
      },
      overdue: [],
      upcoming: [],
      loading: true
    }
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.loading = true
        const [dashboardRes, overdueRes, upcomingRes] = await Promise.all([
          this.$api.getNasiyaDashboard(),
          this.$api.getNasiyaOverdue(),
          this.$api.getNasiyaUpcoming()
        ])

        if (dashboardRes?.data?.success) {
          this.stats = dashboardRes.data.data
        }
        if (overdueRes?.data?.success) {
          this.overdue = overdueRes.data.data.slice(0, 5)
        }
        if (upcomingRes?.data?.success) {
          this.upcoming = upcomingRes.data.data.slice(0, 5)
        }
      } catch (error) {
        console.error('Nasiya dashboard error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    goToCredit(id) {
      this.$router.push(this.localePath({ name: 'nasiya-credits-id', params: { id } }))
    },

    formatMoney(value) {
      if (!value) return '0 UZS'
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
    },

    formatDaysOverdue(dueDate) {
      if (!dueDate) return ''
      const due = new Date(dueDate)
      const today = new Date()
      const diffDays = Math.floor((today - due) / (1000 * 60 * 60 * 24))
      return this.$t('nasiya.days_overdue', { days: diffDays })
    },

    formatDueDate(dueDate) {
      if (!dueDate) return ''
      const due = new Date(dueDate)
      const today = new Date()
      const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24))
      if (diffDays === 0) return this.$t('nasiya.due_today')
      if (diffDays === 1) return this.$t('nasiya.due_tomorrow')
      return this.$t('nasiya.due_in_days', { days: diffDays })
    }
  }
}
</script>
