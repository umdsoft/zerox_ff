/**
 * wave D: pages/finance/analytics/index.vue dan ajratilgan formatlash/uslub yordamchi metodlari.
 * Metodlar sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
import { formatDateLocale } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar

export default {
  methods: {
    formatMoney(value, short = false, currency = 'UZS') {
      const cur = currency || 'UZS'
      if (!value) {return '0 ' + cur}
      if (short && Math.abs(value) >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M ' + cur
      }
      if (short && Math.abs(value) >= 1000) {
        return (value / 1000).toFixed(0) + 'K ' + cur
      }
      return Number(value).toLocaleString('uz-UZ').replace(/,/g,' ') + ' ' + cur
    },

    formatDate: formatDateLocale, // SS-AUDIT (2026-09-25): utils/helpers (Safari-xavfsiz parse)

    getInsightClass(type) {
      const classes = {
        danger: 'bg-red-50 border border-red-200',
        warning: 'bg-yellow-50 border border-yellow-200',
        info: 'bg-blue-50 border border-blue-200',
        success: 'bg-green-50 border border-green-200'
      }
      return classes[type] || 'bg-gray-50'
    },

    getInsightValueClass(type) {
      const classes = {
        danger: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600',
        success: 'text-green-600'
      }
      return classes[type] || 'text-gray-600'
    },

    formatInsightValue(insight) {
      if (insight.category === 'expense' || insight.category === 'debt' || insight.category === 'goal') {
        return this.formatMoney(insight.value)
      }
      return insight.value
    },

    getComparisonClass(change) {
      if (change > 0) {return 'bg-red-50'}
      if (change < 0) {return 'bg-green-50'}
      return 'bg-gray-50'
    },

    // Kunlik dinamika grafigi uchun umumiy apexchart konfiguratsiyasi (bir valyuta, UZS)
    dailyDynamicsOptions(rows, color) {
      const categories = (rows || []).map(d => this.dayLabel(d.date))
      return {
        chart: { type: 'bar', fontFamily: 'inherit', toolbar: { show: false }, zoom: { enabled: false } },
        colors: [color],
        plotOptions: { bar: { borderRadius: 3, columnWidth: '65%' } },
        dataLabels: { enabled: false },
        xaxis: {
          categories,
          tickAmount: 10,
          labels: { style: { fontSize: '10px', colors: '#94a3b8' }, hideOverlappingLabels: true, rotate: 0 },
          axisBorder: { show: false }, axisTicks: { show: false }
        },
        yaxis: { labels: { formatter: (v) => this.formatCompact(v), style: { colors: '#94a3b8' } } },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
        legend: { show: false },
        tooltip: { y: { formatter: (v) => this.formatMoney(v) } }
      }
    },

    // 'YYYY-MM-DD' -> kun raqami (masalan '05' -> '5')
    dayLabel(dateStr) {
      if (!dateStr) {return ''}
      const parts = String(dateStr).split('-')
      return parts[2] ? String(parseInt(parts[2], 10)) : String(dateStr)
    },

    getBudgetBarWidth(budget) {
      if (!budget.planned_amount) {return 0}
      return Math.min((budget.spent_amount / budget.planned_amount) * 100, 100)
    },

    getSourceIcon(source) {
      const icons = {
        bank: '🏦',
        family: '👨‍👩‍👧',
        friend: '🤝',
        other: '📋'
      }
      return icons[source] || '📋'
    },

    getSourceLabel(source) {
      const labels = {
        bank: this.$t('finance.source_bank'),
        family: this.$t('finance.source_family'),
        friend: this.$t('finance.source_friend'),
        other: this.$t('finance.source_other')
      }
      return labels[source] || source
    },

    getCategoryName(name) {
      if (!name) {return null}
      const key = `finance.${name}`
      const translated = this.$t(key)
      if (translated === key) {
        return name
      }
      return translated
    },

    // Million/ming yaxlitlash: 1500000 -> "1.5M", 200000 -> "200K"
    formatCompact(v) {
      const n = Number(v) || 0
      const abs = Math.abs(n)
      if (abs >= 1e6) {
        const m = n / 1e6
        return (Number.isInteger(m) ? m : m.toFixed(1)) + 'M'
      }
      if (abs >= 1e3) {
        return Math.round(n / 1e3) + 'K'
      }
      return String(Math.round(n))
    },

    // "2026-08" -> "Avg 26"
    monthLabel(ym) {
      if (!ym) {return ''}
      const [y, m] = String(ym).split('-')
      const name = this.monthNames[parseInt(m, 10) - 1] || m
      return `${name.substring(0, 3)} ${String(y).substring(2)}`
    },

    shortNum(v) {
      const n = Number(v) || 0
      if (Math.abs(n) >= 1000000) {return (n / 1000000).toFixed(1) + 'M'}
      if (Math.abs(n) >= 1000) {return Math.round(n / 1000) + 'K'}
      return String(Math.round(n))
    },
  },
};
