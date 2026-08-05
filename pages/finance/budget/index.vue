<template>
  <div class="budget-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'finance' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.budget_limits') }}</h1>
        <p class="text-gray-500 mt-1">{{ $t('finance.budget_limits_desc') }}</p>
      </div>

      <!-- Month navigation -->
      <div class="mt-4 md:mt-0 flex items-center space-x-3">
        <button @click="changeMonth(-1)" class="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span class="font-semibold text-gray-900 w-40 text-center">{{ monthNames[selectedMonth - 1] }} {{ selectedYear }}</span>
        <button @click="changeMonth(1)" class="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Warning banner (limit oshdi / chegaraga yetdi) -->
    <div
      v-if="overLimits.length"
      class="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start"
    >
      <span class="text-2xl mr-3">🚨</span>
      <div class="flex-1">
        <p class="font-semibold text-red-700">{{ $t('finance.limit_exceeded_title') }}</p>
        <ul class="text-sm text-red-600 mt-1 space-y-0.5">
          <li v-for="s in overLimits" :key="'over-' + (s.id || 'general')">
            {{ s.category ? getCategoryName(s.category.name) : $t('finance.general_limit') }} —
            {{ formatMoney(s.spent_amount) }} / {{ formatMoney(s.planned_amount) }} ({{ s.percent }}%)
          </li>
        </ul>
      </div>
    </div>
    <div
      v-else-if="alertLimits.length"
      class="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-start"
    >
      <span class="text-2xl mr-3">⚠️</span>
      <div class="flex-1">
        <p class="font-semibold text-yellow-700">{{ $t('finance.limit_warning_title') }}</p>
        <ul class="text-sm text-yellow-700 mt-1 space-y-0.5">
          <li v-for="s in alertLimits" :key="'alert-' + (s.id || 'general')">
            {{ s.category ? getCategoryName(s.category.name) : $t('finance.general_limit') }} — {{ s.percent }}%
          </li>
        </ul>
      </div>
    </div>

    <!-- General monthly limit -->
    <div class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">{{ $t('finance.general_limit') }}</h2>
        <button
          @click="openGeneralModal"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm"
        >
          {{ status.general ? $t('finance.edit_limit') : $t('finance.set_general_limit') }}
        </button>
      </div>

      <div v-if="status.general">
        <div class="grid grid-cols-3 gap-4 mb-5">
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <p class="text-xs text-gray-500">{{ $t('finance.monthly_limit') }}</p>
            <p class="text-xl font-bold text-gray-900">{{ formatMoney(status.general.planned_amount) }}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <p class="text-xs text-gray-500">{{ $t('finance.spent') }}</p>
            <p class="text-xl font-bold" :class="status.general.over_limit ? 'text-red-600' : 'text-blue-600'">
              {{ formatMoney(status.general.spent_amount) }}
            </p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 text-center">
            <p class="text-xs text-gray-500">{{ $t('finance.remaining') }}</p>
            <p class="text-xl font-bold" :class="status.general.remaining_amount >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ formatMoney(status.general.remaining_amount) }}
            </p>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">{{ $t('finance.budget_used') }}</span>
            <span :class="percentTextClass(status.general)">{{ status.general.percent }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div
              class="h-4 rounded-full transition-all"
              :class="barClass(status.general)"
              :style="{ width: barWidth(status.general) + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-6">
        <p class="text-gray-500">{{ $t('finance.no_budget_desc') }}</p>
      </div>
    </div>

    <!-- Category limits -->
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">{{ $t('finance.category_limits') }}</h2>
        <button
          v-if="availableCategories.length"
          @click="openCategoryModal(null)"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          {{ $t('finance.add_category_limit') }}
        </button>
      </div>

      <div v-if="status.categories.length" class="space-y-5">
        <div v-for="c in status.categories" :key="c.id" class="border border-gray-100 rounded-xl p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <span class="text-2xl mr-3">{{ c.category ? (c.category.icon || '📦') : '📦' }}</span>
              <div>
                <p class="font-semibold text-gray-900">
                  {{ c.category ? getCategoryName(c.category.name) : $t('finance.other') }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatMoney(c.spent_amount) }} / {{ formatMoney(c.planned_amount) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium" :class="percentTextClass(c)">{{ c.percent }}%</span>
              <button @click="openCategoryModal(c)" class="text-sm text-blue-600 hover:text-blue-700">{{ $t('common.edit') }}</button>
              <button @click="askDelete(c)" class="text-sm text-red-600 hover:text-red-700">{{ $t('common.delete') }}</button>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="h-3 rounded-full transition-all"
              :class="barClass(c)"
              :style="{ width: barWidth(c) + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <svg class="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
        </svg>
        <h3 class="text-base font-medium text-gray-900 mb-1">{{ $t('finance.no_category_limits') }}</h3>
        <p class="text-gray-500 text-sm">{{ $t('finance.no_category_limits_desc') }}</p>
      </div>
    </div>

    <!-- Set / Edit limit modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ modalTitle }} — {{ monthNames[selectedMonth - 1] }} {{ selectedYear }}
        </h3>
        <form @submit.prevent="saveLimit">
          <!-- Category selector (faqat yangi kategoriya limiti uchun) -->
          <div v-if="editingScope === 'category' && isNewLimit" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.select_category') }}</label>
            <select
              v-model="form.category_id"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>{{ $t('finance.select_category') }}</option>
              <option v-for="cat in availableCategories" :key="cat.id" :value="cat.id">
                {{ cat.icon }} {{ getCategoryName(cat.name) }}
              </option>
            </select>
          </div>

          <!-- Kategoriya nomi (tahrirlashda) -->
          <div v-else-if="editingScope === 'category'" class="mb-4">
            <p class="text-sm text-gray-500">{{ $t('finance.category') }}</p>
            <p class="text-base font-semibold text-gray-900">{{ editingCategoryName }}</p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.monthly_limit') }}</label>
            <input
              v-model="form.planned_amount"
              type="number"
              required
              min="1000"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-xl font-semibold"
              placeholder="1 000 000"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.alert_threshold') }} (%)</label>
            <input
              v-model="form.alert_threshold"
              type="number"
              min="1"
              max="100"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="80"
            />
            <p class="text-sm text-gray-500 mt-1">{{ $t('finance.alert_threshold_hint') }}</p>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium"
            >
              {{ saving ? $t('common.loading') : $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete confirm modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showDeleteModal = false"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm text-center">
        <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ $t('finance.confirm_delete_limit') }}</h3>
        <p v-if="deleteTarget" class="text-sm text-gray-500 mb-5">
          {{ deleteTarget.category ? getCategoryName(deleteTarget.category.name) : $t('finance.general_limit') }}
        </p>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="doDelete"
            :disabled="deleteLoading"
            class="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-medium"
          >
            {{ deleteLoading ? $t('common.loading') : $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BudgetLimitsPage',
  middleware: 'auth',

  data() {
    const now = new Date()
    return {
      selectedMonth: now.getMonth() + 1,
      selectedYear: now.getFullYear(),
      status: {
        general: null,
        categories: [],
        any_over_limit: false,
        any_alert: false
      },
      categories: [],
      loading: true,
      // modal
      showModal: false,
      saving: false,
      editingScope: 'general', // 'general' | 'category'
      isNewLimit: true,
      editingCategoryName: '',
      form: {
        category_id: '',
        planned_amount: '',
        alert_threshold: 80
      },
      // delete
      showDeleteModal: false,
      deleteTarget: null,
      deleteLoading: false
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

    overLimits() {
      const list = []
      if (this.status.general && this.status.general.over_limit) list.push(this.status.general)
      for (const c of this.status.categories) if (c.over_limit) list.push(c)
      return list
    },

    // Chegaraga yetgan, lekin hali oshmaganlar
    alertLimits() {
      const list = []
      if (this.status.general && this.status.general.alert && !this.status.general.over_limit) list.push(this.status.general)
      for (const c of this.status.categories) if (c.alert && !c.over_limit) list.push(c)
      return list
    },

    // Hali limit belgilanmagan kategoriyalar (yangi limit qo'shish uchun)
    availableCategories() {
      const usedIds = new Set(this.status.categories.map(c => c.category_id))
      return this.categories.filter(cat => !usedIds.has(cat.id))
    },

    modalTitle() {
      if (this.editingScope === 'general') return this.$t('finance.general_limit')
      return this.isNewLimit ? this.$t('finance.add_category_limit') : this.$t('finance.edit_limit')
    }
  },

  watch: {
    selectedMonth() { this.loadStatus() },
    selectedYear() { this.loadStatus() }
  },

  async mounted() {
    await Promise.all([this.loadStatus(), this.loadCategories()])
  },

  methods: {
    async loadStatus() {
      try {
        this.loading = true
        const res = await this.$axios.get('/finance/budgets/limits-status', {
          params: { year: this.selectedYear, month: this.selectedMonth }
        })
        if (res?.data?.success) {
          this.status = {
            general: res.data.data.general,
            categories: res.data.data.categories || [],
            any_over_limit: res.data.data.any_over_limit,
            any_alert: res.data.data.any_alert
          }
        }
      } catch (error) {
        console.error('Load limits status error:', error)
      } finally {
        this.loading = false
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

    openGeneralModal() {
      this.editingScope = 'general'
      this.isNewLimit = !this.status.general
      this.editingCategoryName = ''
      this.form = {
        category_id: '',
        planned_amount: this.status.general ? this.status.general.planned_amount : '',
        alert_threshold: this.status.general ? this.status.general.alert_threshold : 80
      }
      this.showModal = true
    },

    // catStatus: mavjud kategoriya limiti (tahrirlash) yoki null (yangi qo'shish)
    openCategoryModal(catStatus) {
      this.editingScope = 'category'
      if (catStatus) {
        this.isNewLimit = false
        this.editingCategoryName = catStatus.category ? this.getCategoryName(catStatus.category.name) : ''
        this.form = {
          category_id: catStatus.category_id,
          planned_amount: catStatus.planned_amount,
          alert_threshold: catStatus.alert_threshold
        }
      } else {
        this.isNewLimit = true
        this.editingCategoryName = ''
        this.form = { category_id: '', planned_amount: '', alert_threshold: 80 }
      }
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
    },

    async saveLimit() {
      try {
        this.saving = true
        const payload = {
          month: this.selectedMonth,
          year: this.selectedYear,
          planned_amount: this.form.planned_amount,
          alert_threshold: this.form.alert_threshold
        }
        if (this.editingScope === 'category') {
          payload.category_id = this.form.category_id
        }
        const res = await this.$api.saveBudget(payload)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.budget_saved'))
          this.showModal = false
          await this.loadStatus()
        }
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.saving = false
      }
    },

    askDelete(catStatus) {
      this.deleteTarget = catStatus
      this.showDeleteModal = true
    },

    async doDelete() {
      const id = this.deleteTarget?.id
      if (!id) return
      try {
        this.deleteLoading = true
        const res = await this.$api.deleteBudget(id)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.limit_deleted'))
          this.showDeleteModal = false
          this.deleteTarget = null
          await this.loadStatus()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.deleteLoading = false
      }
    },

    changeMonth(delta) {
      let m = this.selectedMonth + delta
      let y = this.selectedYear
      if (m > 12) { m = 1; y++ }
      else if (m < 1) { m = 12; y-- }
      this.selectedMonth = m
      this.selectedYear = y
    },

    // Progress bar rangi: oshgan -> qizil, chegaraga yetgan -> sariq, aks holda -> yashil
    barClass(s) {
      if (s.over_limit) return 'bg-red-500'
      if (s.alert) return 'bg-yellow-500'
      return 'bg-green-500'
    },

    barWidth(s) {
      return Math.min(s.percent || 0, 100)
    },

    percentTextClass(s) {
      if (s.over_limit) return 'text-red-600 font-semibold'
      if (s.alert) return 'text-yellow-600 font-medium'
      return 'text-green-600'
    },

    formatMoney(value, currency = 'UZS') {
      const cur = currency || 'UZS'
      if (!value) return '0 ' + cur
      return Number(value).toLocaleString('uz-UZ') + ' ' + cur
    },

    getCategoryName(name) {
      if (!name) return null
      const key = `finance.${name}`
      const translated = this.$t(key)
      return translated === key ? name : translated
    }
  }
}
</script>
