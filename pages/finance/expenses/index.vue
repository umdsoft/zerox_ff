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
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        {{ $t('finance.add_expense') }}
      </nuxt-link>
    </div>

    <!-- Filtrlar (YUQORIDA — jami va kategoriyalar shu filtrga mos o'zgaradi) -->
    <div class="bg-white rounded-2xl p-4 shadow-sm mb-6">
      <div class="flex flex-wrap items-end gap-3">
        <select
          v-model="selectedCategory"
          class="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 max-w-[180px]"
        >
          <option value="">{{ $t('finance.all_categories') }}</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.icon }} {{ getCategoryName(cat.name) }}
          </option>
        </select>

        <!-- Sana oralig'i filtri (dan - gacha) — U12: ixcham kenglik, bir qatorga sig'sin -->
        <div class="flex flex-col w-32">
          <label class="text-xs text-gray-500 mb-1">{{ $t('finance.filter_from') }}</label>
          <date-picker
            v-model="filterStartDate"
            value-type="YYYY-MM-DD"
            format="DD.MM.YYYY"
            :lang="dpLang"
            :editable="false"
            input-class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div class="flex flex-col w-32">
          <label class="text-xs text-gray-500 mb-1">{{ $t('finance.filter_to') }}</label>
          <date-picker
            v-model="filterEndDate"
            value-type="YYYY-MM-DD"
            format="DD.MM.YYYY"
            :lang="dpLang"
            :editable="false"
            input-class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button
          v-if="filterStartDate || filterEndDate"
          @click="clearDateFilter"
          class="px-4 py-2 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 font-medium"
        >
          {{ $t('finance.filter_clear') }}
        </button>

        <!-- Rejalashtirilgan to'lovlar (dashboard nav'dan ko'chirildi — S13) -->
        <nuxt-link :to="localePath({ name: 'finance-payments' })" class="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-red-50 text-red-700 rounded-xl text-sm font-medium transition-colors border border-red-200 self-end">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ $t('finance.scheduled_payments') }}
        </nuxt-link>

        <!-- Oy navigatori — davr tanlanmasa shu oy -->
        <div class="flex flex-col">
          <label class="text-xs text-gray-500 mb-1">{{ $t('finance.this_month') }}</label>
          <div class="flex items-center gap-2">
            <button @click="changeMonth(-1)" class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <span class="font-semibold text-gray-800 whitespace-nowrap px-2">{{ monthNames[selectedMonth - 1] }} {{ selectedYear }}</span>
            <button @click="changeMonth(1)" class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Jami (gradient) — filtrga mos. Inline-style: Tailwind paletta'ga bog'liq emas -->
    <div class="relative overflow-hidden rounded-2xl p-6 text-white mb-6 shadow-lg" style="background: linear-gradient(90deg, #dc2626 0%, #ef4444 48%, #fca5a5 100%)">
      <div class="relative">
        <p class="text-sm font-medium" style="color: rgba(255,255,255,0.92)">{{ filterLabel }}</p>
        <div class="mt-2">
          <p v-for="(line, i) in monthTotals" :key="i" :class="i === 0 ? 'text-3xl md:text-4xl font-bold leading-tight tracking-tight' : 'text-lg font-semibold'" :style="i === 0 ? '' : 'color: rgba(255,255,255,0.92)'">{{ line }}</p>
        </div>
      </div>
    </div>

    <!-- Kategoriyalar bo'yicha (filtrga mos — expenses'dan hisoblanadi) -->
    <div v-if="categoryBreakdown.length" class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('finance.by_category') }}</h3>
      <div class="space-y-4">
        <div v-for="cat in categoryBreakdown" :key="cat.key" class="flex items-center">
          <div class="flex items-center flex-1">
            <span class="text-2xl mr-3">{{ cat.icon || '📦' }}</span>
            <div class="flex-1">
              <div class="flex justify-between mb-1">
                <span class="font-medium">{{ getCategoryName(cat.category_name) || $t('finance.other') }}</span>
                <span class="text-gray-600">{{ formatMoney(cat.total, cat.currency) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="h-2 rounded-full" :style="{ width: catPercent(cat) + '%', backgroundColor: cat.color || '#6B7280' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Expenses List (sana bo'yicha guruhlangan) -->
    <div v-if="expenses.length">
      <div
        v-for="group in groupedExpenses"
        :key="group.date"
        class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4"
      >
        <!-- Sana sarlavhasi -->
        <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <span class="text-sm font-semibold text-gray-700">{{ formatDateHeader(group.date) }}</span>
          <span class="text-sm font-semibold text-gray-500">{{ formatMoney(group.total) }}</span>
        </div>
        <div class="divide-y divide-gray-100">
          <div
            v-for="expense in group.items"
            :key="expense.id"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-3xl mr-4">{{ expense.category?.icon || '📦' }}</span>
                <div>
                  <p class="font-semibold text-gray-900">{{ getCategoryName(expense.category?.name) || $t('finance.other') }}</p>
                  <p class="text-sm text-gray-500">{{ expense.description || '-' }}</p>
                  <p v-if="formatTime(expense.created_at)" class="text-xs text-gray-400 mt-0.5">🕐 {{ formatTime(expense.created_at) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-gray-900">{{ formatMoney(expense.amount, expense.currency) }}</p>
                <div class="flex items-center justify-end gap-2 mt-0.5">
                  <span class="text-xs text-gray-500">{{ paymentMethodLabel(expense.payment_method) }}</span>
                  <source-badge :source="expense.source" />
                </div>
              </div>
            </div>
            <div class="mt-2 flex justify-end gap-2">
              <button @click="editExpense(expense)" class="text-sm text-blue-600 hover:text-blue-700">
                {{ $t('common.edit') }}
              </button>
              <button @click="askDelete(expense)" class="text-sm text-red-600 hover:text-red-700">
                {{ $t('common.delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl shadow-sm p-12 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('finance.no_expenses') }}</h3>
      <p class="text-gray-500 mb-4">{{ $t('finance.no_expenses_desc') }}</p>
      <nuxt-link
        :to="localePath({ name: 'finance-expenses-add' })"
        class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium"
      >
        {{ $t('finance.add_first_expense') }}
      </nuxt-link>
    </div>

    <!-- O'chirishni tasdiqlash (markaziy custom modal — native confirm o'rniga) -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showDeleteModal = false"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm text-center">
        <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ $t('finance.confirm_delete_expense') }}</h3>
        <p v-if="deleteTarget" class="text-sm text-gray-500 mb-5">
          {{ getCategoryName(deleteTarget.category?.name) || $t('finance.other') }} — {{ formatMoney(deleteTarget.amount, deleteTarget.currency) }}
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
          >
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
import SourceBadge from '@/components/finance/SourceBadge.vue'

export default {
  name: 'ExpensesPage',
  middleware: 'auth',
  components: { SourceBadge },

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
      filterStartDate: '',
      filterEndDate: '',
      showDeleteModal: false,
      deleteTarget: null,
      deleteLoading: false,
      loading: true
    }
  },

  computed: {
    // Datepicker o'zbek/rus lokali (i18n locale asosida)
    dpLang() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn')
    },

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
    },

    // Oylik jami — YUKLANGAN expenses'dan valyuta bo'yicha (filtrlarga to'liq mos)
    monthTotals() {
      const map = {}
      for (const e of this.expenses) {
        const c = e.currency || 'UZS'
        map[c] = (map[c] || 0) + (parseFloat(e.amount) || 0)
      }
      const keys = Object.keys(map)
      if (!keys.length) return ['0 UZS']
      keys.sort((a, b) => (a === 'UZS' ? -1 : b === 'UZS' ? 1 : 0))
      return keys.map(c => this.formatMoney(map[c], c))
    },

    // Gradient sarlavhasi — davr tanlangan bo'lsa oraliq, aks holda "Bu oy"
    filterLabel() {
      if (this.filterStartDate || this.filterEndDate) {
        const f = this.filterStartDate ? this.fmtDot(this.filterStartDate) : '…'
        const t = this.filterEndDate ? this.fmtDot(this.filterEndDate) : '…'
        return `${f} — ${t}`
      }
      return `${this.$t('finance.this_month')}: ${this.monthNames[this.selectedMonth - 1]} ${this.selectedYear}`
    },

    // Kategoriyalar bo'yicha — YUKLANGAN expenses'dan (filtrga to'liq mos)
    categoryBreakdown() {
      const map = {}
      for (const e of this.expenses) {
        const cid = e.category_id != null ? e.category_id : 'none'
        const cur = e.currency || 'UZS'
        const key = cid + '|' + cur
        if (!map[key]) {
          map[key] = {
            key,
            category_id: e.category_id,
            category_name: e.category ? e.category.name : null,
            icon: e.category ? e.category.icon : null,
            color: e.category ? e.category.color : null,
            currency: cur,
            total: 0
          }
        }
        map[key].total += parseFloat(e.amount) || 0
      }
      return Object.values(map).sort((a, b) => b.total - a.total)
    },

    // Xarajatlarni sana bo'yicha guruhlash (yangi sana yuqorida)
    groupedExpenses() {
      const groups = {}
      for (const e of this.expenses) {
        const d = this.localDateKey(e.expense_date)
        if (!groups[d]) groups[d] = []
        groups[d].push(e)
      }
      return Object.keys(groups)
        .sort((a, b) => b.localeCompare(a))
        .map(date => ({
          date,
          items: groups[date],
          total: groups[date].reduce((s, x) => s + (parseFloat(x.amount) || 0), 0)
        }))
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
    },
    filterStartDate() {
      this.loadExpenses()
    },
    filterEndDate() {
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
    // Bar uzunligi — eng katta kategoriyaga nisbatan (eng kattasi to'liq)
    catPercent(cat) {
      const max = this.categoryBreakdown.reduce((m, c) => Math.max(m, parseFloat(c.total) || 0), 0)
      if (!max) return 0
      return Math.round(((parseFloat(cat.total) || 0) / max) * 100)
    },
    // YYYY-MM-DD -> DD.MM.YYYY
    fmtDot(d) {
      if (!d) return ''
      const p = String(d).slice(0, 10).split('-')
      return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : d
    },
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
        if (this.filterStartDate) params.start_date = this.filterStartDate
        if (this.filterEndDate) params.end_date = this.filterEndDate

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

    // Sana oralig'i filtrini tozalash
    clearDateFilter() {
      this.filterStartDate = ''
      this.filterEndDate = ''
    },

    editExpense(expense) {
      this.$router.push(this.localePath({
        name: 'finance-expenses-add',
        query: { edit: expense.id }
      }))
    },

    // O'chirish — native confirm() o'rniga markaziy custom modal
    askDelete(expense) {
      this.deleteTarget = expense
      this.showDeleteModal = true
    },

    async doDelete() {
      const id = this.deleteTarget?.id
      if (!id) return
      try {
        this.deleteLoading = true
        const res = await this.$api.deleteExpense(id)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.expense_deleted'))
          this.showDeleteModal = false
          this.deleteTarget = null
          await this.loadExpenses()
          await this.loadStats()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.deleteLoading = false
      }
    },

    formatMoney(value, currency = 'UZS') {
      const cur = currency || 'UZS'
      if (!value) return '0 ' + cur
      return Number(value).toLocaleString('uz-UZ') + ' ' + cur
    },

    // Manba badge matni (emoji + tarjima): 'web'/'mobile'/'telegram'
    sourceLabel(s) {
      const map = {
        web: '🌐 ' + this.$t('finance.source_web'),
        mobile: '📱 ' + this.$t('finance.source_mobile'),
        telegram: '✈️ ' + this.$t('finance.source_telegram')
      }
      return map[s] || ''
    },

    // Manba badge rangi
    sourceBadgeClass(s) {
      const map = {
        web: 'bg-blue-50 text-blue-600',
        mobile: 'bg-green-50 text-green-600',
        telegram: 'bg-sky-50 text-sky-600'
      }
      return map[s] || 'bg-gray-100 text-gray-600'
    },

    // To'lov usuli: 'card' -> "Karta", 'cash' -> "Naqd", 'transfer' -> "O'tkazma"
    paymentMethodLabel(pm) {
      if (!pm) return ''
      const key = `finance.${pm}`
      const t = this.$t(key)
      return t === key ? pm : t
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('uz-UZ')
    },

    // Kiritilgan vaqt (soat:daqiqa) — created_at bo'yicha
    formatTime(dt) {
      if (!dt) return ''
      const d = new Date(dt)
      if (isNaN(d)) return ''
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    },

    // Sana kalitini LOKAL vaqt bo'yicha (UTC siljishisiz) — analitika bilan mos
    localDateKey(d) {
      if (!d) return ''
      const dt = new Date(d)
      if (isNaN(dt)) return String(d).split('T')[0]
      const y = dt.getFullYear()
      const m = String(dt.getMonth() + 1).padStart(2, '0')
      const day = String(dt.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    },

    // Sana sarlavhasi: "4-avgust, 2026" ko'rinishida
    formatDateHeader(date) {
      if (!date) return '-'
      const d = new Date(date + 'T00:00:00')
      if (isNaN(d)) return date
      const day = d.getDate()
      const month = this.monthNames[d.getMonth()] || ''
      return `${day}-${month}, ${d.getFullYear()}`
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
