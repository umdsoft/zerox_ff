/**
 * wave D: pages/finance/family/index.vue dan ajratilgan yordamchi (nom/format/matn) metodlari.
 * Metodlar sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
export default {
  methods: {
    pct(cur, target) { if (!target) {return 0;} return Math.min(100, Math.round((cur / target) * 100)) },
    catName(name) {
      if (!name) {return this.$t('finance.other')}
      const k = 'finance.' + name
      const t = this.$t(k)
      return t === k ? name : t
    },
    catLabelById(id) {
      const c = this.expenseCategories.find(x => x.id === id)
      return c ? (c.icon + ' ' + this.catName(c.name)) : ('#' + id)
    },
    // R8: shu qator (index) uchun tanlanishi mumkin bo'lgan kategoriyalar —
    // boshqa qatorlarda allaqachon tanlanganlarni chiqarib tashlaymiz (dublikat bo'lmasin)
    availableCatsFor(index) {
      return this.expenseCategories.filter(c => !this.form.category_limits.some((row, i) => i !== index && row.category_id === c.id))
    },
    // R8: yuborishdan oldin category_id bo'yicha dublikatlarni tozalash (birinchisi qoladi)
    dedupeCatLimits(list) {
      const seen = new Set()
      return (list || []).filter(c => {
        if (!c.category_id || !(Number(c.amount) > 0)) {return false}
        if (seen.has(c.category_id)) {return false}
        seen.add(c.category_id)
        return true
      })
    },
    formatThousands(v) {
      if (v === '' || v == null) {return ''}
      const n = Number(v); if (!isFinite(n)) {return ''}
      return n.toLocaleString('uz-UZ').replace(/,/g,' ')
    },
    onLimitInput(e) {
      const d = String(e.target.value).replace(/\D/g, '')
      this.form.monthly_limit = d === '' ? '' : Number(d)
    },
    onCatLimitInput(e, i) {
      const d = String(e.target.value).replace(/\D/g, '')
      this.$set(this.form.category_limits[i], 'amount', d === '' ? '' : Number(d))
    },
    permsSummary(link) {
      const p = link.permissions || {}
      const out = []
      if (p.income && p.income.view) {out.push('➕')}
      if (p.expense && p.expense.view) {out.push('➖')}
      if (p.scheduled_income && p.scheduled_income.view) {out.push('⏳')}
      if (p.scheduled_payment && p.scheduled_payment.view) {out.push('🗓')}
      if (p.goals && p.goals.view) {out.push('🎯')}
      return out.length ? out.join(' ') : '—'
    },
    pendingRoleText(link) {
      // pending: men member'man. owner meni 'watched' qilса — owner meni kuzatadi;
      // 'watcher' qilса — men owner'ni kuzataman.
      return link.role === 'watched' ? this.$t('finance.family_pending_watched') : this.$t('finance.family_pending_watcher')
    },
  },
};
