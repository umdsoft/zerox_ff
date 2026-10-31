/**
 * wave D: pages/finance/debts/group/_key.vue dan ajratilgan telefon-ko'zgu qarz / shikoyat metodlari.
 * Metodlar sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */

export default {
  methods: {
    // SS-19: tasdiqlash modalini ochish (native confirm() o'rniga).
    askMirrorForgive() { if (!this.mirrorBusy) {this.confirmKind = 'forgive'} },
    askMirrorHide() { if (!this.mirrorBusy) {this.confirmKind = 'hide'} },
    onConfirmAccept() {
      if (this.confirmKind === 'hide') {return this.mirrorHide()}
      if (this.confirmKind === 'rowdelete') {return this.rowDelete()}
      return this.mirrorForgive()
    },

    // SS-DEV (2026-09-24): tugallangan hamkor qaydini o'z ro'yxatimdan olib tashlash (bir tomonlama).
    async mirrorHide() {
      if (this.mirrorBusy || !this.mirrorDebt) {return}
      this.mirrorBusy = true
      try {
        const res = await this.$api.mirrorHideDebt(this.mirrorDebt.id)
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success(this.$t('l10n.pdg.removed'))
          this.confirmKind = ''
          this.showMirror = false
          await this.loadDebts()
          // Guruhda boshqa qarz qolmagan bo'lsa — ro'yxatga qaytamiz
          if (!this.group) {this.$router.push(this.localePath({ name: 'finance-debts' }))}
        }
      } catch (e) {
        const msg = (e.response && e.response.data && e.response.data.message) || this.$t('errors.operationFailed')
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally { this.mirrorBusy = false }
    },

    // SS-DEV (2026-09-24): do'kon qarzi bo'yicha shikoyat.
    openComplaint() {
      this.complaintKind = 'shop'
      this.complaintReason = ''
      this.complaintNote = ''
      this.complaintSent = false
      this.showShopDebt = false
      this.showComplaint = true
    },
    async submitComplaint() {
      const target = this.complaintTarget
      if (this.complaintBusy || !this.complaintCanSend || !target) {return}
      this.complaintBusy = true
      try {
        // SS-DEV (2026-09-24): sabab tanlanmagan bo'lsa backend `other` deb saqlaydi (izoh majburiy).
        const reason = this.complaintReason || 'other'
        const note = String(this.complaintNote || '').trim()
        const res = this.complaintKind === 'person'
          ? await this.$api.personDebtComplaint(target.id, reason, note)
          : await this.$api.shopDebtComplaint(target.id, reason, note)
        if (res && res.data && res.data.success) {
          this.complaintSent = true
          if (res.data.duplicate) {this.$toast && this.$toast.info && this.$toast.info(this.$t('l10n.pdg.complaint_dup'))}
        }
      } catch (e) {
        const msg = (e.response && e.response.data && e.response.data.message) || this.$t('errors.operationFailed')
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally { this.complaintBusy = false }
    },

    // SS-4: lender — qisman to'lov modali.
    openMirrorPay() {
      if (this.mirrorBusy) {return}
      this.mirrorPayAmount = ''
      this.showMirrorPay = true
    },
    async submitMirrorPay() {
      const raw = String(this.mirrorPayAmount || '').replace(/\s/g, '').replace(',', '.')
      if (raw && !(parseFloat(raw) > 0)) {
        this.$toast && this.$toast.error && this.$toast.error(this.texts.badAmount)
        return
      }
      // SS-DEV (2026-09-24): qoldiqdan ortiq summa yuborilmaydi (backend ham rad etadi).
      if (this.mirrorPayOver) {
        this.$toast && this.$toast.error && this.$toast.error(this.texts.overRemaining)
        return
      }
      // Bo'sh bo'lsa — backend butun qoldiqni yopadi (amount yubormaymiz).
      await this.mirrorPay(raw ? { amount: parseFloat(raw) } : {})
      this.showMirrorPay = false
    },

    /**
     * SS-4: ko'zgu qarz bo'yicha to'lovni qayd etish (POST mirror-payment).
     * `payload.amount` bo'lmasa — butun qoldiq yopiladi.
     */
    async mirrorPay(payload) {
      if (this.mirrorBusy || !this.mirrorDebt) {return}
      this.mirrorBusy = true
      try {
        const res = await this.$api.mirrorPayDebt(this.mirrorDebt.id, payload)
        if (res && res.data && res.data.success) {
          const rem = Number(res.data.remaining_amount) || 0
          this.$toast && this.$toast.success && this.$toast.success(
            rem <= 0 ? this.texts.closedOk : this.texts.paidOk
          )
          this.confirmKind = ''
          this.showMirror = false
          await this.loadDebts()
        }
      } catch (e) {
        this.actError(e) // 02.10: `over-remaining` — joriy tilda
      } finally { this.mirrorBusy = false }
    },

    // Ko'zgu qarz (men lender) — voz kechish.
    async mirrorForgive() {
      if (this.mirrorBusy || !this.mirrorDebt) {return}
      this.mirrorBusy = true
      try {
        const res = await this.$api.mirrorForgiveDebt(this.mirrorDebt.id)
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success(this.texts.forgivenOk)
          this.confirmKind = ''
          this.showMirror = false
          await this.loadDebts()
        }
      } catch (e) {
        const msg = (e.response && e.response.data && e.response.data.message) || this.$t('errors.operationFailed')
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally { this.mirrorBusy = false }
    },

    // Ko'zgu qarz (men lender) — qarzdorga talab SMS. 03.10: tasdiq oynasi orqali (financeDemandMixin).
    mirrorDemand() {
      if (this.mirrorBusy || !this.mirrorDebt) {return}
      this.startFinanceDemand(this.mirrorDebt)
    },
  },
};
