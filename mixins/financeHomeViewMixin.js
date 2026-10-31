/**
 * wave D: pages/finance/index.vue dan ajratilgan computed'lar.
 * Computed sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
export default {
  computed: {
    /** 23.10 (1-rasm): «Eslatmani yoqish» kaliti matni (5 til) — yoqilgan bo'lsa vaqti bilan */
    reminderLabel() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      if (this.reminderOn) {
        const on = { uz: 'Eslatma yoqilgan', ru: 'Напоминание включено', kr: 'Эслатма ёқилган', en: 'Reminder on', kaa: 'Eskertpe qosılǵan' }
        return `${on[l] || on.uz}${this.reminderTime ? ' · ' + this.reminderTime : ''}`
      }
      return ({ uz: 'Eslatmani yoqish', ru: 'Включить напоминание', kr: 'Эслатмани ёқиш', en: 'Turn on reminder', kaa: 'Eskertpeni qosıw' })[l] || 'Eslatmani yoqish'
    },
    // B31-8: kun modali sarlavhasi — "5 avgust"
    dayModalTitle() {
      if (this.dayModalDayNum == null) {return ''}
      const keys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
      const mn = this.$t('months.' + keys[new Date().getMonth()])
      return `${this.dayModalDayNum} ${mn}`
    },
    // B34-5: kategoriya modali — sarlavha, UZS jami, umumiy ulush (%)
    catModalTitle() {
      return this.catModalCat ? (this.getCategoryName(this.catModalCat.name) || this.$t('finance.other')) : ''
    },
    catModalTotalUzs() {
      return this.catModalCat ? this.toUzs(this.catModalCat.total, this.catModalCat.currency) : 0
    },
    catModalShare() {
      const denom = this.catModalKind === 'income' ? this.incomeCatTotalUzs : this.expenseCatTotalUzs
      if (!denom) {return 0}
      return Math.min(100, Math.round(this.catModalTotalUzs / denom * 100))
    },
    // B31-9: pie manba ro'yxatlari — year (12 oy) yoki month (joriy oy)
    incomeCatList() {
      if (this.chartPeriod === 'year' && this.yearly) {return this.yearly.income_by_category || []}
      return (this.dashboard.incomes && this.dashboard.incomes.by_category) || []
    },
    expenseCatList() {
      if (this.chartPeriod === 'year' && this.yearly) {return this.yearly.expense_by_category || []}
      return (this.dashboard.expenses && this.dashboard.expenses.top_categories) || []
    },
    incomeCatTotalUzs() {
      if (this.chartPeriod === 'year') {return Math.round((this.incomeCatList || []).reduce((s, c) => s + this.toUzs(c.total, c.currency), 0))}
      return (this.dashboard.incomes && this.dashboard.incomes.monthly_total_uzs) || 0
    },
    expenseCatTotalUzs() {
      if (this.chartPeriod === 'year') {return Math.round((this.expenseCatList || []).reduce((s, c) => s + this.toUzs(c.total, c.currency), 0))}
      return (this.dashboard.expenses && this.dashboard.expenses.monthly_total_uzs) || 0
    },
    // PIE chart series — UZS'ga aylantirilgan (nisbatlar to'g'ri bo'lishi uchun:
    // 100 USD 4.5M UZS yonida ko'rinmasdan qolmasin)
    categoryChartSeries() {
      if (!this.expenseCatList.length) {return []}
      return this.expenseCatList.map(cat => this.toUzs(cat.total, cat.currency))
    },

    // Daromadlar PIE (kategoriya bo'yicha) — UZS'ga aylantirilgan
    incomeChartSeries() {
      if (!this.incomeCatList.length) {return []}
      return this.incomeCatList.map(cat => this.toUzs(cat.total, cat.currency))
    },
    incomeChartOptions() {
      const labels = this.incomeCatList.map(cat => this.getCategoryName(cat.name) || this.$t('finance.other')) || []
      return {
        chart: { type: 'pie', fontFamily: 'inherit', events: { dataPointSelection: (ev, ctx, cfg) => this.onSliceClick('income', cfg) } },
        labels,
        colors: this.incomeChartColors,
        legend: { show: false },
        dataLabels: { enabled: true, formatter: (val) => val.toFixed(0) + '%' },
        tooltip: { y: { formatter: (val) => this.formatMoney(val) } },
        responsive: [{ breakpoint: 480, options: { chart: { height: 250 } } }]
      }
    },

    // PIE chart options
    categoryChartOptions() {
      const labels = this.expenseCatList.map(cat => this.getCategoryName(cat.name)) || []
      return {
        chart: {
          type: 'pie',
          fontFamily: 'inherit',
          events: { dataPointSelection: (ev, ctx, cfg) => this.onSliceClick('expense', cfg) }
        },
        labels,
        colors: this.chartColors,
        legend: {
          show: false // Biz o'zimiz legend qilamiz
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val.toFixed(0) + '%'
        },
        tooltip: {
          y: {
            formatter: (val) => this.formatMoney(val)
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              height: 250
            }
          }
        }]
      }
    },

    // Oylik daromad/xarajat — valyuta bo'yicha (masalan "100 USD", yoki UZS+USD ikki qator)
    incomeTotals() { return this.currencyTotals(this.dashboard.incomes?.by_currency) },
    expenseTotals() { return this.currencyTotals(this.dashboard.expenses?.by_currency) },
    // R2: shu oy qoldig'i = (jami daromad − jami xarajat), USD har kunlik kurs bo'yicha UZS'ga
    // aylantirilgan holda. Ilgari faqat UZS qatorini olardi — USD (mas. Dividend) tashlab
    // ketilardi va qoldiq noto'g'ri chiqardi. Kurs o'zgarsa (usd_rate) qoldiq ham o'zgaradi.
    netThisMonth() {
      const rate = Number(this.dashboard.usd_rate) || 12500
      const sumUzs = (arr) => (arr || []).reduce((s, c) => {
        const t = parseFloat(c.total) || 0
        return s + (String(c.currency || 'UZS').toUpperCase() === 'USD' ? t * rate : t)
      }, 0)
      // "Jami daromad/xarajat" bilan bir xil manbadan (monthly_total_uzs) — mos bo'lishi uchun
      const inc = this.dashboard.incomes && this.dashboard.incomes.monthly_total_uzs != null
        ? Number(this.dashboard.incomes.monthly_total_uzs)
        : sumUzs(this.dashboard.incomes && this.dashboard.incomes.by_currency)
      const exp = this.dashboard.expenses && this.dashboard.expenses.monthly_total_uzs != null
        ? Number(this.dashboard.expenses.monthly_total_uzs)
        : sumUzs(this.dashboard.expenses && this.dashboard.expenses.by_currency)
      return Math.round(inc - exp)
    },
    // Kunlik daromad(yashil)/xarajat(qizil) grafik (UZS, shu oy)
    hasDailyData() {
      if (this.chartPeriod === 'year') {return !!(this.yearly && this.yearly.trend && this.yearly.trend.some(m => (m.income || 0) > 0 || (m.expense || 0) > 0))}
      return (this.dashboard.daily_series || []).some(d => (d.income || 0) > 0 || (d.expense || 0) > 0)
    },
    // B31-9: chart x o'qi kategoriyalari — oy nomlari (year) yoki kun raqamlari (month)
    chartCategories() {
      if (this.chartPeriod === 'year' && this.yearly && this.yearly.trend) {
        const keys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
        return this.yearly.trend.map(m => {
          const mm = parseInt(String(m.month).split('-')[1], 10)
          const full = this.$t('months.' + (keys[mm - 1] || 'january'))
          return full ? String(full).slice(0, 3) : m.month
        })
      }
      return (this.dashboard.daily_series || []).map(d => d.day)
    },
    dailyChartSeries() {
      // W3b: faqat daromad(yashil) + xarajat(qizil) — "oqim". Qoldiq alohida grafikda.
      if (this.chartPeriod === 'year' && this.yearly && this.yearly.trend) {
        const t = this.yearly.trend
        return [
          { name: this.$t('finance.incomes'), data: t.map(m => Math.round(m.income || 0)) },
          { name: this.$t('finance.expenses'), data: t.map(m => Math.round(m.expense || 0)) }
        ]
      }
      const s = this.dashboard.daily_series || []
      return [
        { name: this.$t('finance.incomes'), data: s.map(d => Math.round(d.income || 0)) },
        { name: this.$t('finance.expenses'), data: s.map(d => Math.round(d.expense || 0)) }
      ]
    },
    dailyChartOptions() {
      const s = this.dashboard.daily_series || []
      return {
        // R1: "bar chart" — ustunli ko'rinish (chiziq/area emas). Balans grafigi alohida (area) qoladi.
        // B31-8: ustunga bosilsa — o'sha kun daromad/xarajat kategoriya tafsiloti modali.
        chart: {
          type: 'bar', fontFamily: 'inherit', toolbar: { show: false }, zoom: { enabled: false },
          events: { dataPointSelection: (ev, ctx, cfg) => this.onBarClick(cfg) }
        },
        colors: ['#10B981', '#EF4444'],
        dataLabels: { enabled: false },
        plotOptions: { bar: { columnWidth: '58%', borderRadius: 3, borderRadiusApplication: 'end' } },
        stroke: { show: true, width: 1, colors: ['transparent'] },
        fill: { type: 'solid', opacity: 0.9 },
        xaxis: {
          categories: this.chartCategories,
          tickAmount: this.chartPeriod === 'year' ? 12 : 10,
          labels: { style: { fontSize: '10px', colors: '#94a3b8' } },
          axisBorder: { show: false }, axisTicks: { show: false }
        },
        yaxis: { labels: { formatter: (v) => this.shortNum(v), style: { colors: '#94a3b8' } } },
        legend: { show: true, position: 'top', horizontalAlign: 'right', fontFamily: 'inherit' },
        tooltip: { y: { formatter: (v) => this.formatMoney(v) } },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 4 }
      }
    },
    // W3b: Balans dinamikasi — kun oxiridagi QOLDIQ (holat). Alohida ko'k chiziq.
    hasBalanceData() {
      return (this.dashboard.daily_series || []).some(d => (d.income || 0) > 0 || (d.expense || 0) > 0)
    },
    balanceChartSeries() {
      if (this.chartPeriod === 'year' && this.yearly && this.yearly.trend) {
        let by = 0
        const data = this.yearly.trend.map(m => { by += (m.income || 0) - (m.expense || 0); return Math.round(by) })
        return [{ name: this.$t('finance.balance'), data }]
      }
      const s = this.dashboard.daily_series || []
      let bal = 0
      const balance = s.map(d => { bal += (d.income || 0) - (d.expense || 0); return Math.round(bal) })
      return [{ name: this.$t('finance.balance'), data: balance }]
    },
    balanceChartOptions() {
      return {
        chart: { type: 'area', fontFamily: 'inherit', toolbar: { show: false }, zoom: { enabled: false } },
        colors: ['#6366F1'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2.5 },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.25, opacityTo: 0.03 } },
        xaxis: {
          categories: this.chartCategories,
          tickAmount: this.chartPeriod === 'year' ? 12 : 10,
          labels: { style: { fontSize: '10px', colors: '#94a3b8' } },
          axisBorder: { show: false }, axisTicks: { show: false }
        },
        yaxis: { labels: { formatter: (v) => this.shortNum(v), style: { colors: '#94a3b8' } } },
        legend: { show: false },
        tooltip: { y: { formatter: (v) => this.formatMoney(v) } },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 4 }
      }
    },

    // So'nggi amaliyotlar — backend `recent_transactions` (daromad+xarajat, created_at
    // bo'yicha vaqt tartibli). Eski javob uchun fallback ham bor.
    recentTransactions() {
      const merged = this.dashboard.recent_transactions
      if (Array.isArray(merged) && merged.length) {
        return merged.map(t => ({
          id: t.id, type: t.kind, amount: t.amount, currency: t.currency, description: t.description,
          date: this.localDateKey(t.date), time: this.formatTime(t.created_at), created_at: t.created_at,
          icon: t.category_icon, category_name: t.category_name, source: t.source || 'web'
        }))
      }
      const exp = (this.dashboard.expenses?.recent || []).map(e => ({
        id: e.id, type: 'expense', amount: e.amount, currency: e.currency, description: e.description,
        date: this.localDateKey(e.expense_date), time: this.formatTime(e.created_at), created_at: e.created_at,
        icon: e.category?.icon, category_name: e.category?.name
      }))
      const inc = (this.dashboard.incomes?.recent || []).map(i => ({
        id: i.id, type: 'income', amount: i.amount, currency: i.currency, description: i.description,
        date: this.localDateKey(i.income_date), time: this.formatTime(i.created_at), created_at: i.created_at,
        icon: i.category?.icon, category_name: i.category?.name
      }))
      return [...exp, ...inc]
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 12)
    },

    // Sana bo'yicha guruhlash (guruh ichida created_at bo'yicha kamayish tartibida)
    groupedRecent() {
      const groups = {}
      for (const t of this.recentTransactions) {
        if (!groups[t.date]) {groups[t.date] = []}
        groups[t.date].push(t)
      }
      return Object.keys(groups)
        .sort((a, b) => b.localeCompare(a))
        .map(date => ({
          date,
          items: groups[date].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        }))
    },

    // Faza1-C3: haqiqiy jamg'arma darajasi = (daromad − xarajat) / daromad · %
    savingsRate() {
      const inc = (this.dashboard.incomes && this.dashboard.incomes.monthly_total_uzs) || 0
      const exp = (this.dashboard.expenses && this.dashboard.expenses.monthly_total_uzs) || 0
      if (inc <= 0) {return null}
      const r = Math.round((inc - exp) / inc * 100)
      return r < 0 ? 0 : r
    }
  },
};
