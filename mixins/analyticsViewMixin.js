/**
 * wave D: pages/finance/analytics/index.vue dan ajratilgan computed'lar.
 * Computed sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
import { localizedMonthNames } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar

export default {
  computed: {
    monthNames() { return localizedMonthNames(this.$t.bind(this)) }, // SS-AUDIT (2026-09-25): utils/helpers

    availableYears() {
      const currentYear = new Date().getFullYear()
      return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]
    },

    tabs() {
      return [
        { id: 'incomes', label: this.$t('finance.incomes') },
        { id: 'expenses', label: this.$t('finance.expenses') },
        { id: 'goals', label: this.$t('finance.goals') },
        // SS10: 'calendar' Tahlil tab-lentasidan olib tashlandi — endi asosiy bo'limdan ochiladi.
        { id: 'trend', label: this.$t('finance.tab_report') }
      ]
    },

    // Kunlik dinamika (Daromad) — toza apexchart (UZS, yashil)
    incomeDailySeries() {
      const s = this.incomeData.daily_incomes || []
      return [{ name: this.$t('finance.incomes'), data: s.map(d => Math.round(Number(d.total) || 0)) }]
    },
    incomeDailyOptions() {
      return this.dailyDynamicsOptions(this.incomeData.daily_incomes || [], '#10B981')
    },

    // Kunlik dinamika (Xarajat) — toza apexchart (UZS, qizil)
    expenseDailySeries() {
      const s = this.expenseData.daily_expenses || []
      return [{ name: this.$t('finance.expenses'), data: s.map(d => Math.round(Number(d.total) || 0)) }]
    },
    expenseDailyOptions() {
      return this.dailyDynamicsOptions(this.expenseData.daily_expenses || [], '#EF4444')
    },

    // Kalendar oylik jami (tanlangan tur bo'yicha, UZS)
    calendarTotal() {
      return Object.values(this.calendarDaily || {}).reduce((s, v) => s + (Number(v) || 0), 0)
    },

    // R12: kun modali sarlavhasi — "14 Avgust"
    dayModalTitle() {
      if (!this.dayModalDay) {return ''}
      return `${this.dayModalDay} ${this.monthNames[this.selectedMonth - 1] || ''}`
    },

    // Kalendar katakchalari (dushanba boshi, to'g'ri padding)
    calendarCells() {
      const year = this.selectedYear
      const month = this.selectedMonth // 1-12
      const firstDay = new Date(year, month - 1, 1)
      const offset = (firstDay.getDay() + 6) % 7 // Monday = 0
      const daysInMonth = new Date(year, month, 0).getDate()
      const now = new Date()
      const isCurrentMonth = now.getFullYear() === year && (now.getMonth() + 1) === month
      const cells = []
      for (let i = 0; i < offset; i++) {
        cells.push({ day: null })
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        cells.push({
          day: d,
          key,
          amount: this.calendarDaily[key] || 0,
          today: isCurrentMonth && now.getDate() === d
        })
      }
      return cells
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
    // U9: INLINE gradient — Tailwind v2 default'da emerald/rose/slate ranglari YO'Q edi,
    // shu sabab yaxshi holat (improving/stable) kartasi shaffof=oq chiqardi. Endi aniq hex.
    healthStyle() {
      const map = {
        improving: 'linear-gradient(90deg,#10b981,#059669)', // yashil — yaxshi
        stable: 'linear-gradient(90deg,#64748b,#475569)',    // kulrang — barqaror
        declining: 'linear-gradient(90deg,#f43f5e,#dc2626)'  // qizil — yomonlashmoqda
      }
      return { background: map[this.health && this.health.status] || map.stable }
    }
  },
};
