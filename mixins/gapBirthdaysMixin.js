/**
 * wave D: pages/finance/gap/_id.vue dan ajratilgan tug'ilgan kunlar bo'limi metodlari.
 * Metodlar sahifa holatini (data) `this` orqali ishlatadi — holat sahifada qoladi.
 */
import { canEditBirthday, fmtBirthday } from '@/utils/gapMembers';
import { getBirthdayTexts, getBirthdayMonths } from '@/utils/gapTexts';

export default {
  computed: {
    // SS-DEV (2026-09-24): tug'ilgan kunlar bo'limi matnlari (uz/ru/kr).
    bdTexts() {
      return getBirthdayTexts(this.$i18n && this.$i18n.locale)
    },
    // SS-DEV (2026-09-24): yopiq sarlavhada nechta sana kiritilgani
    bdCount() {
      return this.birthdays.filter((b) => b.birth_day).length + this.bdExtras.length
    },
    bdMonths() {
      return getBirthdayMonths(this.$i18n && this.$i18n.locale)
    },
  },
  methods: {
    // ---- SS-DEV (2026-09-24): tug'ilgan kunlar ----
    async loadBirthdays() {
      this.bdLoading = true
      try {
        const res = await this.$api.getGapBirthdays(this.gapId)
        const items = (res && res.data && res.data.data && res.data.data.items) || []
        this.applyBirthdays(items)
      } catch (_) { this.birthdays = [] } finally { this.bdLoading = false }
      this.loadExtras()
    },
    // SS-DEV (2026-09-24): gap a'zosi bo'lmagan guruhdoshlar (qo'lda qo'shilgan).
    async loadExtras() {
      try {
        const res = await this.$api.getGapBirthdayExtras(this.gapId)
        this.bdExtras = (res && res.data && res.data.data) || []
      } catch (_) { this.bdExtras = [] }
    },
    async addExtra() {
      const n = this.bdNew
      if (!String(n.name || '').trim() || !(n.day > 0 && n.month > 0)) {
        this.$toast && this.$toast.error && this.$toast.error(this.bdTexts.extraName + ' / ' + this.bdTexts.day + ' / ' + this.bdTexts.month)
        return
      }
      this.bdAdding = true
      try {
        const res = await this.$api.addGapBirthdayExtra(this.gapId, { name: n.name, tg_username: n.tg_username, day: n.day, month: n.month, year: n.year || null })
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success(this.bdTexts.added)
          this.bdNew = { name: '', tg_username: '', day: 0, month: 0, year: '' }
          await this.loadExtras()
        }
      } catch (err) {
        this.$toast && this.$toast.error && this.$toast.error((err.response && err.response.data && err.response.data.message) || this.$t('common.error'))
      } finally { this.bdAdding = false }
    },
    async removeExtra(x) {
      try {
        await this.$api.deleteGapBirthdayExtra(this.gapId, x.id)
        this.$toast && this.$toast.success && this.$toast.success(this.bdTexts.removed)
        await this.loadExtras()
      } catch (err) {
        this.$toast && this.$toast.error && this.$toast.error((err.response && err.response.data && err.response.data.message) || this.$t('common.error'))
      }
    },
    applyBirthdays(items) {
      this.birthdays = items
      const edit = {}
      items.forEach((b) => { edit[b.member_id] = { day: b.birth_day || 0, month: b.birth_month || 0, year: b.birth_year || '' } })
      this.bdEdit = edit
    },
    canEditBirthday(b) { return canEditBirthday(this.gap, this.myId, b) },
    fmtBirthday(b) { return fmtBirthday(b, this.bdMonths) },
    async saveBirthday(b) {
      const e = this.bdEdit[b.member_id] || {}
      if (!(e.day > 0 && e.month > 0)) {
        this.$toast && this.$toast.error && this.$toast.error(this.bdTexts.day + ' / ' + this.bdTexts.month)
        return
      }
      this.bdSaving = b.member_id
      try {
        const res = await this.$api.saveGapBirthday(this.gapId, b.member_id, { day: e.day, month: e.month, year: e.year || null })
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success(this.bdTexts.saved)
          await this.loadBirthdays()
        }
      } catch (err) {
        this.$toast && this.$toast.error && this.$toast.error((err.response && err.response.data && err.response.data.message) || this.$t('common.error'))
      } finally { this.bdSaving = null }
    },
    async syncBirthdays() {
      if (this.bdSyncing) {return}
      this.bdSyncing = true
      try {
        const res = await this.$api.syncGapBirthdays(this.gapId)
        const d = res && res.data && res.data.data
        if (d) {
          this.applyBirthdays(d.items || [])
          const msg = d.found > 0 ? this.bdTexts.synced(d.found) : this.bdTexts.none
          this.$toast && (d.found > 0 ? this.$toast.success(msg) : this.$toast.info ? this.$toast.info(msg) : this.$toast.success(msg))
        }
      } catch (err) {
        this.$toast && this.$toast.error && this.$toast.error((err.response && err.response.data && err.response.data.message) || this.$t('common.error'))
      } finally { this.bdSyncing = false }
    },
  },
};
