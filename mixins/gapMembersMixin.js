/**
 * wave D: pages/finance/gap/_id.vue dan ajratilgan a'zolar / co-organizer / sozlamalar / qayta boshlash metodlari.
 * Metodlar sahifa holatini (data) `this` orqali ishlatadi — holat sahifada qoladi.
 */
import { isMainOrg, isCoOrg } from '@/utils/gapMembers';

export default {
  methods: {
    onNewAmountInput(e) { const d = String(e.target.value).replace(/\D/g, ''); this.newAmount = d === '' ? '' : Number(d) },
    async setMemberAmount(m, e) {
      const d = String(e.target.value).replace(/\D/g, '')
      const amount = d === '' ? null : Number(d)
      try {
        await this.$api.updateGapMember(this.gapId, m.id, { amount })
        await this.load()
      } catch (err) {
        this.$toast.error((err.response && err.response.data && err.response.data.message) || this.$t('common.error'))
      }
    },
    // R7: modal har ochilganda maydonlar TOZA bo'lsin (oldingi yozuv saqlanib qolmasin).
    // Telefon +998 prefiksi bilan ochiladi (R6).
    openAddMember() {
      this.newName = ''
      this.newAmount = ''
      this.newUniform = true
      this.newPhone = this.formatUzPhone('998') // "+998"
      this.showAddMember = true
    },
    // R6: O'zbek telefon formati — "+99897 734 50 30". Faqat raqamlarni oladi, 998 bilan
    // boshlanishini ta'minlaydi va guruhlaydi: +998 + OP(2) | XXX | XX | XX.
    formatUzPhone(raw) {
      let d = String(raw == null ? '' : raw).replace(/\D/g, '')
      if (d.startsWith('998')) { /* ok */ }
      else if (d.startsWith('0')) {d = '998' + d.slice(1)}
      else if (d.length) {d = '998' + d}
      d = d.slice(0, 12)
      if (d.length <= 3) {return '+' + d}
      let out = '+' + d.slice(0, 5) // +99897
      if (d.length > 5) {out += ' ' + d.slice(5, 8)}
      if (d.length > 8) {out += ' ' + d.slice(8, 10)}
      if (d.length > 10) {out += ' ' + d.slice(10, 12)}
      return out
    },
    onPhoneInput(e) {
      this.newPhone = this.formatUzPhone(e && e.target ? e.target.value : '')
    },
    async addMember() {
      const phone = String(this.newPhone).trim()
      // Kamida to'liq raqam (998 + 9 raqam) bo'lishi shart — prefiksning o'zi yuborilmasin
      const core9 = phone.replace(/\D/g, '').slice(-9)
      if (core9.length < 9) {return}
      // Summa: "hamma bilan bir xil" bo'lsa gap standart summasi, aks holda kiritilgan
      let amount
      if (this.newUniform) {
        amount = (this.gap && this.gap.amount != null) ? Number(this.gap.amount) : undefined
      } else {
        amount = this.newAmount === '' ? undefined : Number(this.newAmount)
      }
      const name = String(this.newName || '').trim()
      this.busy = true
      try {
        const res = await this.$api.addGapMember(this.gapId, phone, amount, name || undefined)
        if (res && res.data && res.data.success) {
          // T4: ro'yxatdan o'tmagan raqam bo'lsa ogohlantiramiz (baribir qo'shildi)
          if (res.data.data && res.data.data.registered === false) {
            this.$toast && this.$toast.info && this.$toast.info(this.$t('finance.gap_member_unregistered'))
          }
          this.newName = ''; this.newPhone = ''; this.newAmount = ''; this.newUniform = true
          this.showAddMember = false // R8: a'zo qo'shilgach modal yopilsin (qayta ochilib qolmasin)
          await this.load()
        }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async removeMember(m) {
      this.busy = true
      try {
        const res = await this.$api.removeGapMember(this.gapId, m.id)
        if (res && res.data && res.data.success) {await this.load()}
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    // SS-B (2026-09-18): a'zoni QO'SHIMCHA tashkilotchi qilish (faqat dastlabki tashkilotchi).
    // SS-19 (2026-09-19): native confirm() O'RNIGA markazlashgan ConfirmModal.
    askCoOrg(m, kind) { if (!this.busy) { this.confirmMember = m; this.confirmKind = kind } },
    // SS-DEV (2026-09-30), 7–8-rasmlar: tashkilotchi belgilari a'zolik id si bo'yicha ham (user_id bo'lmasa).
    isMainOrg(m) { return isMainOrg(this.gap, m) },
    isCoOrg(m) { return isCoOrg(this.gap, m) },
    onConfirmAccept() {
      const m = this.confirmMember
      if (!m) {return}
      return this.confirmKind === 'make' ? this.makeCoOrganizer(m) : this.removeCoOrganizer(m)
    },

    async makeCoOrganizer(m) {
      this.busy = true
      try {
        const res = await this.$api.setGapCoOrganizer(this.gapId, m.id)
        // SS-DEV (2026-09-30): ro'yxatdan o'tmagan a'zo ham — backend `registered:false` qaytaradi.
        if (res && res.data && res.data.success) {
          this.confirmKind = ''
          const registered = !(res.data.data && res.data.data.registered === false)
          this.$toast.success(registered ? this.coOrgT.added : this.coOrgT.addedPending)
          await this.load()
        }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    // SS-B: qo'shimcha tashkilotchini olib tashlash (faqat dastlabki tashkilotchi).
    async removeCoOrganizer(m) {
      this.busy = true
      try {
        const res = await this.$api.removeGapCoOrganizer(this.gapId)
        if (res && res.data && res.data.success) { this.confirmKind = ''; this.$toast.success(this.$t('l10n.misc.gap_removed')); await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    // Qo'lda navbat: a'zoni yuqoriga/pastga siljitish
    moveMember(i, dir) {
      const arr = this.gap.members
      const j = i + dir
      if (j < 0 || j >= arr.length) {return}
      const tmp = arr[i]; this.$set(arr, i, arr[j]); this.$set(arr, j, tmp)
    },
    openSettings() {
      this.settingsForm = {
        name: this.gap.name,
        frequency: this.gap.frequency || 'monthly',
        day_of_month: this.gap.day_of_month || 1,
        uniform: !!this.gap.uniform,
        amount: this.gap.amount != null ? this.gap.amount : '',
        // SS2: boshlanish sanasi (o'tgan sanadan boshlangan gap uchun) — bo'sh bo'lsa bugundan
        start_date: this.gap.start_date || ''
      }
      this.showSettings = true
    },
    // U5/B34-14: uniform summa inputi — FAQAT raqam (harflar kiritilmaydi).
    // :value o'zgarmaganда DOM yangilanmaydi (harf qolib ketardi) — shuning uchun
    // tozalangan qiymatni DOM'ga majburan qaytaramiz.
    onSettingsAmount(e) {
      const d = String(e.target.value).replace(/\D/g, '')
      this.settingsForm.amount = d === '' ? '' : Number(d)
      e.target.value = this.formatThousands(this.settingsForm.amount)
    },
    async saveSettings() {
      this.busy = true
      try {
        const payload = { ...this.settingsForm }
        // SS2: boshlanish sanasi to'g'ridan-to'g'ri yuboriladi (backend start_year/month'ni undan oladi)
        payload.start_date = this.settingsForm.start_date || null
        const res = await this.$api.updateGap(this.gapId, payload)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.family_updated')); this.showSettings = false; await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    // B34-12: tugagan gapni xuddi shu a'zolar bilan qaytadan boshlash (tashkilotchi)
    openRestart() {
      const now = new Date()
      const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      this.restartForm = {
        name: this.gap.name,
        frequency: this.gap.frequency || 'monthly',
        day_of_month: this.gap.day_of_month || 1,
        amount: this.gap.amount != null ? this.gap.amount : '',
        uniform: this.gap.uniform !== false,
        start_month_ym: ym
      }
      this.showRestart = true
    },
    onRestartAmount(e) {
      const d = String(e.target.value).replace(/\D/g, '')
      this.restartForm.amount = d === '' ? '' : Number(d)
      e.target.value = this.formatThousands(this.restartForm.amount)
    },
    async submitRestart() {
      if (!String(this.restartForm.name).trim()) { this.$toast.error(this.$t('finance.gap_name_required')); return }
      this.busy = true
      try {
        const payload = {
          name: this.restartForm.name.trim(),
          amount: this.restartForm.amount === '' || this.restartForm.amount == null ? null : Number(this.restartForm.amount),
          currency: this.gap.currency,
          day_of_month: this.restartForm.day_of_month || 1,
          frequency: this.restartForm.frequency,
          uniform: this.restartForm.uniform
        }
        if (this.restartForm.frequency === 'monthly' && this.restartForm.start_month_ym) {
          const [sy, sm] = String(this.restartForm.start_month_ym).split('-')
          const yy = parseInt(sy, 10), mm = parseInt(sm, 10)
          if (yy && mm) { payload.start_year = yy; payload.start_month = mm }
        }
        const res = await this.$api.createGap(payload)
        if (!(res && res.data && res.data.success)) {throw new Error('create failed')}
        const newId = res.data.data.id
        // Eski a'zolarni ko'chiramiz — tashkilotchi yangi gapga avtomatik qo'shilgani uchun uni tashlab ketamiz.
        const org = this.gap.organizer_id
        const members = (this.gap.members || []).filter(m => m.user_id !== org && m.phone)
        for (const m of members) {
          try {
            await this.$api.addGapMember(newId, m.phone, this.restartForm.uniform ? undefined : (m.amount || undefined), m.name || undefined)
          } catch (e) { /* bitta a'zo tushib qolsa qolganlari qo'shilaveradi (tashkilotchi keyin ko'radi) */ }
        }
        this.showRestart = false
        this.$toast.success(this.$t('finance.gap_restart_done'))
        this.$router.push(this.localePath({ name: 'finance-gap-id', params: { id: newId } }))
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
  },
};
