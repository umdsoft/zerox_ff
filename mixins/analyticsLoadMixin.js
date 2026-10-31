/**
 * wave D: pages/finance/analytics/index.vue dan ajratilgan yuklash metodlari (insights/tab/calendar/trends/excel).
 * Metodlar sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
import { getExportFinanceExcel, getExportTrends, getExpenses, getIncomes } from '@/api/finance';

export default {
  methods: {
    async loadInsights() {
      try {
        const res = await this.$api.getFinanceInsights()
        if (res?.data?.success) {
          this.insights = res.data.data.insights || []
        }
      } catch (error) {
        console.error('Load insights error:', error)
      }
    },

    async loadTabData() {
      try {
        this.loading = true
        const params = { year: this.selectedYear, month: this.selectedMonth }

        switch (this.activeTab) {
          case 'incomes':
            const incRes = await this.$api.getIncomeAnalytics(params)
            if (incRes?.data?.success) {
              this.incomeData = incRes.data.data
            }
            break

          case 'expenses':
            const expRes = await this.$api.getExpenseAnalytics(params)
            if (expRes?.data?.success) {
              this.expenseData = expRes.data.data
            }
            break

          case 'debts':
            const debtRes = await this.$api.getDebtAnalytics()
            if (debtRes?.data?.success) {
              this.debtData = debtRes.data.data
            }
            break

          case 'budget':
            const budgetRes = await this.$api.getBudgetAnalytics({ year: this.selectedYear })
            if (budgetRes?.data?.success) {
              this.budgetData = budgetRes.data.data
            }
            break

          case 'goals':
            const goalRes = await this.$api.getGoalAnalytics()
            if (goalRes?.data?.success) {
              this.goalData = goalRes.data.data
            }
            break

          case 'calendar':
            await this.loadCalendar()
            break

          case 'trend':
            await this.loadTrends()
            break
        }
      } catch (error) {
        console.error('Load tab data error:', error)
      } finally {
        this.loading = false
      }
    },

    // R12: kalendar kunига bosilganda — o'sha kundagi xarajat/daromadlar ro'yxati modali
    async openDay(cell) {
      if (!cell || !cell.day || !(cell.amount > 0)) {return}
      this.dayModalType = this.calendarType
      this.dayModalDay = cell.day
      this.dayModalKey = cell.key
      this.dayModalTotal = cell.amount
      this.dayModalItems = []
      this.showDayModal = true
      this.dayModalLoading = true
      try {
        const listFn = this.calendarType === 'expense' ? getExpenses : getIncomes
        const res = await listFn(this.$axios, { params: { start_date: cell.key, end_date: cell.key, limit: 200 } })
        this.dayModalItems = (res && res.data && res.data.data) || []
      } catch (e) {
        this.dayModalItems = []
      } finally {
        this.dayModalLoading = false
      }
    },

    async loadCalendar() {
      try {
        const params = { year: this.selectedYear, month: this.selectedMonth }
        const res = this.calendarType === 'expense'
          ? await this.$api.getExpenseStats(params)
          : await this.$api.getIncomeStats(params)
        const data = res?.data?.data || {}
        const map = {}
        ;(data.daily || []).forEach(d => {
          map[d.date] = parseFloat(d.total) || 0
        })
        this.calendarDaily = map
      } catch (error) {
        console.error('Load calendar error:', error)
        this.calendarDaily = {}
      }
    },

    async loadTrends() {
      try {
        const res = await getExportTrends(this.$axios)
        if (res?.data?.success) {
          this.trend = res.data.data.trend || []
          this.health = res.data.data.health || null
        }
      } catch (error) {
        console.error('Load trends error:', error)
      }
    },

    // "KK.OO.YYYY" (masalan 27.08.2026) -> "YYYY-MM-DD" (2026-08-27); noto'g'ri bo'lsa null
    ddmmyyyyToIso(v) {
      const m = String(v || '').match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
      if (!m) {return null}
      return `${m[3]}-${m[2]}-${m[1]}`
    },

    async downloadExcel() {
      try {
        this.downloadingTrend = true
        // Period: oylik / choraklik / yillik / ixtiyoriy muddat
        const params = { period: this.trendPeriod, year: this.selectedYear }
        if (this.trendPeriod === 'month') {params.month = this.selectedMonth}
        if (this.trendPeriod === 'quarter') {params.quarter = this.trendQuarter}
        if (this.trendPeriod === 'custom') {
          // Kiritish "KK.OO.YYYY" (masked) — backend "YYYY-MM-DD" kutadi
          const start = this.ddmmyyyyToIso(this.trendStartDate)
          const end = this.ddmmyyyyToIso(this.trendEndDate)
          if (!start || !end) {
            this.$toast?.error(this.$t('finance.reports_period_custom'))
            this.downloadingTrend = false
            return
          }
          params.start_date = start
          params.end_date = end
        }

        const res = await getExportFinanceExcel(this.$axios, {
          params,
          responseType: 'blob',
          timeout: 60000, // SS-PERF (2026-09-25): eksport uzoq — default 15 s yetmasligi mumkin
        })

        let fileName = `moliya_${this.selectedYear}_${this.selectedMonth}.xlsx`
        const cd = res.headers && res.headers['content-disposition']
        const match = cd && cd.match(/filename="?([^"]+)"?/)
        if (match) {fileName = match[1]}

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
        this.downloadingTrend = false
      }
    },
  },
};
