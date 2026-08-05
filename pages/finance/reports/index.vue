<template>
  <div class="reports-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'finance' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.reports_title') }}</h1>
        <p class="text-gray-500 mt-1">{{ $t('finance.reports_subtitle') }}</p>
      </div>
    </div>

    <!-- Excel Export Card -->
    <div class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <h2 class="text-lg font-bold text-gray-900 mb-4">{{ $t('finance.reports_download_excel') }}</h2>

      <!-- Period selector -->
      <div class="flex flex-wrap items-end gap-3">
        <!-- Period type -->
        <div>
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.reports_period') }}</label>
          <select
            v-model="period"
            class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">{{ $t('finance.reports_period_month') }}</option>
            <option value="quarter">{{ $t('finance.reports_period_quarter') }}</option>
            <option value="year">{{ $t('finance.reports_period_year') }}</option>
            <option value="custom">{{ $t('finance.reports_period_custom') }}</option>
          </select>
        </div>

        <!-- Month (period=month) -->
        <div v-if="period === 'month'">
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.date') }}</label>
          <select v-model="month" class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
            <option v-for="(name, idx) in monthNames" :key="idx" :value="idx + 1">{{ name }}</option>
          </select>
        </div>

        <!-- Quarter (period=quarter) -->
        <div v-if="period === 'quarter'">
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.reports_quarter') }}</label>
          <select v-model="quarter" class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
            <option v-for="q in 4" :key="q" :value="q">{{ q }}-{{ $t('finance.reports_quarter') }}</option>
          </select>
        </div>

        <!-- Year (month/quarter/year) -->
        <div v-if="period !== 'custom'">
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.reports_period_year') }}</label>
          <select v-model="year" class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
            <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <!-- Custom range -->
        <div v-if="period === 'custom'">
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.reports_start_date') }}</label>
          <input v-model="startDate" type="date" class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
        </div>
        <div v-if="period === 'custom'">
          <label class="block text-xs text-gray-500 mb-1">{{ $t('finance.reports_end_date') }}</label>
          <input v-model="endDate" type="date" class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Download button -->
        <button
          @click="downloadExcel"
          :disabled="downloading"
          class="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          {{ downloading ? $t('finance.reports_downloading') : $t('finance.reports_download_excel') }}
        </button>
      </div>
    </div>

    <!-- Financial health status -->
    <div
      v-if="health"
      class="rounded-2xl p-6 mb-6 text-white relative overflow-hidden"
      :class="healthBg"
    >
      <div class="flex items-center gap-4">
        <span class="text-4xl">{{ healthIcon }}</span>
        <div>
          <h2 class="text-lg font-semibold opacity-90">{{ $t('finance.reports_health_title') }}</h2>
          <p class="text-xl font-bold mt-1">{{ healthMessage }}</p>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <div class="bg-white/15 rounded-xl px-4 py-3">
          <p class="text-sm opacity-90">{{ $t('finance.reports_income_change') }}</p>
          <p class="text-lg font-bold">{{ signed(health.income_change) }}</p>
        </div>
        <div class="bg-white/15 rounded-xl px-4 py-3">
          <p class="text-sm opacity-90">{{ $t('finance.reports_expense_change') }}</p>
          <p class="text-lg font-bold">{{ signed(health.expense_change) }}</p>
        </div>
        <div class="bg-white/15 rounded-xl px-4 py-3">
          <p class="text-sm opacity-90">{{ $t('finance.reports_avg_net') }}</p>
          <p class="text-lg font-bold">{{ signed(health.avg_net_last3) }}</p>
        </div>
      </div>
    </div>

    <!-- Trend chart -->
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-1 flex-wrap gap-2">
        <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.reports_trend_title') }}</h3>
        <p class="text-xs text-gray-400">UZS</p>
      </div>
      <div v-if="hasTrendData">
        <client-only>
          <apexchart type="area" :height="320" :options="trendChartOptions" :series="trendChartSeries" />
        </client-only>
      </div>
      <div v-else class="text-center py-12 text-gray-400">
        <p>{{ $t('finance.reports_no_data') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanceReports',
  middleware: 'auth',

  data() {
    const now = new Date()
    return {
      period: 'month',
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      quarter: Math.floor(now.getMonth() / 3) + 1,
      startDate: '',
      endDate: '',
      downloading: false,
      trend: [],
      health: null
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

    availableYears() {
      const y = new Date().getFullYear()
      return [y - 3, y - 2, y - 1, y]
    },

    hasTrendData() {
      return (this.trend || []).some(t => (t.income || 0) > 0 || (t.expense || 0) > 0)
    },

    trendChartSeries() {
      const s = this.trend || []
      return [
        { name: this.$t('finance.incomes'), data: s.map(t => Math.round(t.income || 0)) },
        { name: this.$t('finance.expenses'), data: s.map(t => Math.round(t.expense || 0)) },
        { name: this.$t('finance.reports_net'), data: s.map(t => Math.round(t.net || 0)) }
      ]
    },

    trendChartOptions() {
      const s = this.trend || []
      return {
        chart: { type: 'area', fontFamily: 'inherit', toolbar: { show: false }, zoom: { enabled: false } },
        colors: ['#10B981', '#EF4444', '#6366F1'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: [2, 2, 2], dashArray: [0, 0, 6] },
        fill: { type: 'gradient', gradient: { opacityFrom: [0.35, 0.35, 0], opacityTo: [0.05, 0.05, 0] } },
        xaxis: {
          categories: s.map(t => this.monthLabel(t.month)),
          labels: { style: { fontSize: '11px', colors: '#94a3b8' } },
          axisBorder: { show: false }, axisTicks: { show: false }
        },
        yaxis: { labels: { formatter: (v) => this.shortNum(v), style: { colors: '#94a3b8' } } },
        legend: { show: true, position: 'top', horizontalAlign: 'right', fontFamily: 'inherit' },
        tooltip: { y: { formatter: (v) => this.formatMoney(v) } },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 4 }
      }
    },

    healthMessage() {
      const map = {
        improving: this.$t('finance.reports_health_improving'),
        stable: this.$t('finance.reports_health_stable'),
        declining: this.$t('finance.reports_health_declining')
      }
      return map[this.health?.status] || map.stable
    },
    healthIcon() {
      return { improving: '📈', stable: '➖', declining: '📉' }[this.health?.status] || '➖'
    },
    healthBg() {
      return {
        improving: 'bg-gradient-to-r from-emerald-500 to-green-600',
        stable: 'bg-gradient-to-r from-slate-500 to-slate-600',
        declining: 'bg-gradient-to-r from-rose-500 to-red-600'
      }[this.health?.status] || 'bg-gradient-to-r from-slate-500 to-slate-600'
    }
  },

  async mounted() {
    await this.loadTrends()
  },

  methods: {
    async loadTrends() {
      try {
        const res = await this.$axios.get('/finance/export/trends')
        if (res?.data?.success) {
          this.trend = res.data.data.trend || []
          this.health = res.data.data.health || null
        }
      } catch (error) {
        console.error('Load trends error:', error)
      }
    },

    async downloadExcel() {
      try {
        this.downloading = true
        const params = { period: this.period, year: this.year }
        if (this.period === 'month') params.month = this.month
        if (this.period === 'quarter') params.quarter = this.quarter
        if (this.period === 'custom') {
          params.start_date = this.startDate
          params.end_date = this.endDate
        }

        const res = await this.$axios.get('/finance/export/finance-excel', {
          params,
          responseType: 'blob'
        })

        // Fayl nomini Content-Disposition dan olishga urinamiz
        let fileName = `moliya_${this.year}.xlsx`
        const cd = res.headers && res.headers['content-disposition']
        const match = cd && cd.match(/filename="?([^"]+)"?/)
        if (match) fileName = match[1]

        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Excel export error:', error)
        this.$toast?.error(this.$t('finance.reports_export_failed'))
      } finally {
        this.downloading = false
      }
    },

    // "2026-08" -> "Avg 26" ko'rinishidagi qisqa yorliq
    monthLabel(ym) {
      if (!ym) return ''
      const [y, m] = String(ym).split('-')
      const name = this.monthNames[parseInt(m, 10) - 1] || m
      return `${name.substring(0, 3)} ${String(y).substring(2)}`
    },

    shortNum(v) {
      const n = Number(v) || 0
      if (Math.abs(n) >= 1000000) return (n / 1000000).toFixed(1) + 'M'
      if (Math.abs(n) >= 1000) return Math.round(n / 1000) + 'K'
      return String(Math.round(n))
    },

    formatMoney(value, currency = 'UZS') {
      const cur = currency || 'UZS'
      if (!value) return '0 ' + cur
      return Number(value).toLocaleString('uz-UZ') + ' ' + cur
    },

    signed(value) {
      const n = Number(value) || 0
      const sign = n > 0 ? '+' : ''
      return sign + this.formatMoney(n)
    }
  }
}
</script>
