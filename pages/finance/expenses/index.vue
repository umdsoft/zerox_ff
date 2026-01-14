<template>
  <div class="expenses-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'finance' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.expenses') }}</h1>
      </div>
      <nuxt-link
        :to="localePath({ name: 'finance-expenses-add' })"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        {{ $t('finance.add_expense') }}
      </nuxt-link>
    </div>

    <!-- Month Stats -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-blue-100">{{ $t('finance.this_month') }}</p>
          <p class="text-4xl font-bold mt-2">{{ formatMoney(stats.total) }}</p>
        </div>
        <div class="mt-4 md:mt-0 flex items-center space-x-4">
          <button
            @click="changeMonth(-1)"
            class="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <span class="font-medium">{{ monthNames[selectedMonth - 1] }} {{ selectedYear }}</span>
          <button
            @click="changeMonth(1)"
            class="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Category Stats -->
    <div v-if="stats.by_category?.length" class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('finance.by_category') }}</h3>
      <div class="space-y-4">
        <div v-for="cat in stats.by_category" :key="cat.category_id" class="flex items-center">
          <div class="flex items-center flex-1">
            <span class="text-2xl mr-3">{{ cat.icon || '📦' }}</span>
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span class="font-medium">{{ getCategoryName(cat.name) || $t('finance.other') }}</span>
                <span class="text-gray-600">{{ formatMoney(cat.total) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full"
                  :style="{ width: (cat.total / stats.total * 100) + '%', backgroundColor: cat.color || '#6B7280' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl p-4 shadow-sm mb-6">
      <div class="flex flex-wrap gap-3">
        <select
          v-model="selectedCategory"
          class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{{ $t('finance.all_categories') }}</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.icon }} {{ getCategoryName(cat.name) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Expenses List -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div v-if="expenses.length" class="divide-y divide-gray-100">
        <div
          v-for="expense in expenses"
          :key="expense.id"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="text-3xl mr-4">{{ expense.category?.icon || '📦' }}</span>
              <div>
                <p class="font-semibold text-gray-900">{{ getCategoryName(expense.category?.name) || $t('finance.other') }}</p>
                <p class="text-sm text-gray-500">{{ expense.description || formatDate(expense.expense_date) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900">{{ formatMoney(expense.amount) }}</p>
              <p class="text-sm text-gray-500">{{ expense.payment_method }}</p>
            </div>
          </div>
          <div class="mt-2 flex justify-end gap-2">
            <button
              @click="editExpense(expense)"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              {{ $t('common.edit') }}
            </button>
            <button
              @click="deleteExpense(expense.id)"
              class="text-sm text-red-600 hover:text-red-700"
            >
              {{ $t('common.delete') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('finance.no_expenses') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('finance.no_expenses_desc') }}</p>
        <nuxt-link
          :to="localePath({ name: 'finance-expenses-add' })"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
        >
          {{ $t('finance.add_first_expense') }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExpensesPage',
  middleware: 'auth',

  data() {
    const now = new Date()
    return {
      expenses: [],
      categories: [],
      stats: {
        total: 0,
        by_category: []
      },
      selectedMonth: now.getMonth() + 1,
      selectedYear: now.getFullYear(),
      selectedCategory: '',
      loading: true
    }
  },

  computed: {
    monthNames() {
      return [
        this.$t('months.january'),
        this.$t('months.february'),
        this.$t('months.march'),
        this.$t('months.april'),
        this.$t('months.may'),
        this.$t('months.june'),
        this.$t('months.july'),
        this.$t('months.august'),
        this.$t('months.september'),
        this.$t('months.october'),
        this.$t('months.november'),
        this.$t('months.december')
      ]
    }
  },

  watch: {
    selectedMonth() {
      this.loadExpenses()
      this.loadStats()
    },
    selectedYear() {
      this.loadExpenses()
      this.loadStats()
    },
    selectedCategory() {
      this.loadExpenses()
    }
  },

  async mounted() {
    await Promise.all([
      this.loadExpenses(),
      this.loadStats(),
      this.loadCategories()
    ])
  },

  methods: {
    async loadExpenses() {
      try {
        this.loading = true
        const startDate = new Date(this.selectedYear, this.selectedMonth - 1, 1)
        const endDate = new Date(this.selectedYear, this.selectedMonth, 0)

        const params = {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }
        if (this.selectedCategory) {
          params.category_id = this.selectedCategory
        }

        const res = await this.$api.getExpenses(params)
        if (res?.data?.success) {
          this.expenses = res.data.data
        }
      } catch (error) {
        console.error('Load expenses error:', error)
      } finally {
        this.loading = false
      }
    },

    async loadStats() {
      try {
        const res = await this.$api.getExpenseStats({
          year: this.selectedYear,
          month: this.selectedMonth
        })
        if (res?.data?.success) {
          this.stats = res.data.data
        }
      } catch (error) {
        console.error('Load stats error:', error)
      }
    },

    async loadCategories() {
      try {
        const res = await this.$api.getExpenseCategories()
        if (res?.data?.success) {
          this.categories = res.data.data
        }
      } catch (error) {
        console.error('Load categories error:', error)
      }
    },

    changeMonth(delta) {
      let newMonth = this.selectedMonth + delta
      let newYear = this.selectedYear

      if (newMonth > 12) {
        newMonth = 1
        newYear++
      } else if (newMonth < 1) {
        newMonth = 12
        newYear--
      }

      this.selectedMonth = newMonth
      this.selectedYear = newYear
    },

    editExpense(expense) {
      this.$router.push(this.localePath({
        name: 'finance-expenses-add',
        query: { edit: expense.id }
      }))
    },

    async deleteExpense(id) {
      if (!confirm(this.$t('finance.confirm_delete_expense'))) return
      try {
        const res = await this.$api.deleteExpense(id)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.expense_deleted'))
          await this.loadExpenses()
          await this.loadStats()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      }
    },

    formatMoney(value) {
      if (!value) return '0 UZS'
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('uz-UZ')
    },

    getCategoryName(name) {
      if (!name) return null
      // Agar tarjima kaliti mavjud bo'lsa, tarjima qilamiz
      const key = `finance.${name}`
      const translated = this.$t(key)
      // Agar tarjima topilmasa (kalit qaytsa), asl nomini ko'rsatamiz
      if (translated === key) {
        return name
      }
      return translated
    }
  }
}
</script>
