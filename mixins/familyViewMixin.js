/**
 * wave D: pages/finance/family/index.vue dan ajratilgan computed'lar.
 * Computed sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
import FAM_TEXTS from '@/utils/familyTexts' // 23.10 (3-rasm): bo'limlar matni (5 til, mobil bilan bir xil)

export default {
  computed: {
    ft() { return FAM_TEXTS[this.$i18n && this.$i18n.locale] || FAM_TEXTS.uz },
    myId() { return (this.$auth && this.$auth.user && this.$auth.user.id) || null },
    // B33-3/5: ruxsatlar (+ "Limit o'rnatish") FAQAT yangi taklifда (so'rov), qabul qilishда
    // (target grant) yoki target o'z ruxsatini boshqarganда tahrirlanadi. Kuzatuvchining to'liq
    // tahririда (openEdit) ruxsatlar KO'RINMAYDI — ular Kuzatuvdagi a'zoning nazoratida.
    permsEditable() {
      return (!this.editing && !this.editingLimitOnly) || this.editingPermsOnly || !!this.accepting
    },
    overviewMonthLabel() {
      const names = [this.$t('months.january'), this.$t('months.february'), this.$t('months.march'), this.$t('months.april'), this.$t('months.may'), this.$t('months.june'), this.$t('months.july'), this.$t('months.august'), this.$t('months.september'), this.$t('months.october'), this.$t('months.november'), this.$t('months.december')]
      return `${names[this.overviewMonth - 1] || ''} ${this.overviewYear}`
    },
    hasAnyOverview() {
      const o = this.overview
      return !!(o && (o.income || o.expense || o.scheduled_income || o.scheduled_payment || o.goals))
    },
    // Qoldiq = daromad - xarajat, valyuta bo'yicha (UZS/USD alohida)
    overviewBalance() {
      const o = this.overview
      if (!o || (!o.income && !o.expense)) {return []}
      const map = {}
      ;((o.income && o.income.by_currency) || []).forEach(c => { const k = c.currency || 'UZS'; map[k] = (map[k] || 0) + (Number(c.total) || 0) })
      ;((o.expense && o.expense.by_currency) || []).forEach(c => { const k = c.currency || 'UZS'; map[k] = (map[k] || 0) - (Number(c.total) || 0) })
      return Object.keys(map).sort((a, b) => (a === 'UZS' ? -1 : b === 'UZS' ? 1 : 0)).map(k => ({ currency: k, net: map[k] }))
    },
    // T3a: Ko'rish (overview) ichida — belgilangan limit + shu oyda ishlatilgani
    // B30-4: USDdagi xarajatlar ham limit valyutasiga aylantirilib hisoblanadi.
    overviewLimitInfo() {
      const link = this.overviewLink
      if (!link || !link.monthly_limit) {return null}
      const cur = String(link.limit_currency || 'UZS').toUpperCase()
      const limit = Number(link.monthly_limit) || 0
      const o = this.overview
      const rate = Number(o && o.usd_rate) || 12500
      const conv = (amt, fromCur) => {
        const uzs = String(fromCur || 'UZS').toUpperCase() === 'USD' ? Number(amt || 0) * rate : Number(amt || 0)
        return cur === 'USD' ? uzs / rate : uzs
      }
      let spent = 0
      if (o && o.expense && Array.isArray(o.expense.by_currency)) {
        spent = o.expense.by_currency.reduce((s, c) => s + conv(c.total, c.currency), 0)
      }
      spent = Math.round(spent * 100) / 100
      const pct = limit > 0 ? Math.round(spent / limit * 100) : 0
      // U3/B30-4: har kategoriya limiti bo'yicha sarflangan (barcha valyuta -> cl valyutasi)
      const byCat = (o && o.expense && Array.isArray(o.expense.by_category)) ? o.expense.by_category : []
      const cats = (link.category_limits || []).map(cl => {
        const clCur = String(cl.currency || 'UZS').toUpperCase()
        const convCl = (amt, fromCur) => {
          const uzs = String(fromCur || 'UZS').toUpperCase() === 'USD' ? Number(amt || 0) * rate : Number(amt || 0)
          return clCur === 'USD' ? uzs / rate : uzs
        }
        const catSpent = Math.round(byCat.filter(c => Number(c.category_id) === Number(cl.category_id))
          .reduce((s, c) => s + convCl(c.total, c.currency), 0) * 100) / 100
        const clim = Number(cl.amount) || 0
        return { ...cl, spent: catSpent, over: catSpent > clim, pct: clim > 0 ? Math.round(catSpent / clim * 100) : 0 }
      })
      return { limit, currency: link.limit_currency || 'UZS', spent, remaining: limit - spent, pct: Math.min(100, pct), rawPct: pct, over: spent > limit, cats }
    }
  },
};
