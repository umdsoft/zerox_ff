<template>
  <div class="customers-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'nasiya' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('nasiya.customers') }}</h1>
      </div>
      <nuxt-link
        :to="localePath({ name: 'nasiya-customers-add' })"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        {{ $t('nasiya.add_customer') }}
      </nuxt-link>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <p class="text-sm text-gray-500">{{ $t('nasiya.total_customers') }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ stats.total || 0 }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <p class="text-sm text-gray-500">{{ $t('nasiya.active_debtors') }}</p>
        <p class="text-2xl font-bold text-blue-600">{{ stats.active || 0 }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <p class="text-sm text-gray-500">{{ $t('nasiya.blocked') }}</p>
        <p class="text-2xl font-bold text-red-600">{{ stats.blocked || 0 }}</p>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <p class="text-sm text-gray-500">{{ $t('nasiya.total_debt') }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ formatMoney(stats.total_debt) }}</p>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white rounded-2xl p-4 shadow-sm mb-6">
      <div class="flex flex-wrap gap-3">
        <input
          v-model="search"
          type="text"
          :placeholder="$t('nasiya.search_customer')"
          class="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @input="debouncedSearch"
        />
        <select
          v-model="filterStatus"
          class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          @change="loadCustomers"
        >
          <option value="">{{ $t('nasiya.all_status') }}</option>
          <option value="active">{{ $t('nasiya.with_debt') }}</option>
          <option value="blocked">{{ $t('nasiya.blocked') }}</option>
        </select>
      </div>
    </div>

    <!-- Customers List -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div v-if="customers.length" class="divide-y divide-gray-100">
        <div
          v-for="customer in customers"
          :key="customer.id"
          class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          @click="goToCustomer(customer.id)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                {{ getInitials(customer.full_name) }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="font-semibold text-gray-900">{{ customer.full_name }}</p>
                  <span v-if="customer.is_blocked" class="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                    {{ $t('nasiya.blocked') }}
                  </span>
                  <span v-if="customer.trust_rating >= 4" class="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded-full">
                    ⭐ {{ $t('nasiya.trusted') }}
                  </span>
                </div>
                <p class="text-sm text-gray-500">{{ customer.phone }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold" :class="customer.total_debt > 0 ? 'text-red-600' : 'text-green-600'">
                {{ formatMoney(customer.total_debt) }}
              </p>
              <p class="text-sm text-gray-500">{{ customer.active_credits || 0 }} {{ $t('nasiya.credits_count') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('nasiya.no_customers') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('nasiya.no_customers_desc') }}</p>
        <nuxt-link
          :to="localePath({ name: 'nasiya-customers-add' })"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
        >
          {{ $t('nasiya.add_first_customer') }}
        </nuxt-link>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.limit" class="p-4 border-t border-gray-100 flex justify-center">
        <div class="flex gap-2">
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
  </div>
</template>

<script>
export default {
  name: 'NasiyaCustomersPage',
  middleware: 'auth',

  data() {
    return {
      customers: [],
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

  async mounted() {
    await Promise.all([
      this.loadCustomers(),
      this.loadStats()
    ])
  },

  methods: {
    async loadCustomers() {
      try {
        this.loading = true
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        if (this.search) params.search = this.search
        if (this.filterStatus) params.status = this.filterStatus

        const res = await this.$api.getNasiyaCustomers(params)
        if (res?.data?.success) {
          this.customers = res.data.data
          if (res.data.pagination) {
            this.pagination.total = res.data.pagination.total
          }
        }
      } catch (error) {
        console.error('Load customers error:', error)
      } finally {
        this.loading = false
      }
    },

    async loadStats() {
      try {
        const res = await this.$api.getNasiyaCustomerStats()
        if (res?.data?.success) {
          this.stats = res.data.data
        }
      } catch (error) {
        console.error('Load stats error:', error)
      }
    },

    debouncedSearch() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1
        this.loadCustomers()
      }, 300)
    },

    changePage(delta) {
      this.pagination.page += delta
      this.loadCustomers()
    },

    goToCustomer(id) {
      this.$router.push(this.localePath({
        name: 'nasiya-customers-add',
        query: { edit: id }
      }))
    },

    getInitials(name) {
      if (!name) return '?'
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    },

    formatMoney(value) {
      if (!value) return '0 UZS'
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
    }
  }
}
</script>
