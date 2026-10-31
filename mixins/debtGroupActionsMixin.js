/**
 * wave D: pages/finance/debts/group/_key.vue dan ajratilgan qarz amallari (yopish/qaytarish/kechirish/talab) metodlari.
 * Metodlar sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
import { smsList, smsOutcome, SMS_NOTICE_TEXTS } from '~/utils/smsNotice';
import { isPlanRequiredError } from '~/utils/planGate';
import { allocatePayment } from '~/utils/debtAllocation'; // 01.10 (doc3 5/6-rasm): zaxira ketma-ket taqsimot

// 02.10 (3–4-rasm): tanlangan qarzlar valyuta bo'yicha guruhlar (UZS, USD, …) — har biri alohida to'lanadi.
function groupByCurrency(debts) {
  const rank = (c) => (c === 'UZS' ? 0 : c === 'USD' ? 1 : 2);
  const map = {};
  for (const d of debts || []) {
    const c = (d && d.currency) || 'UZS';
    map[c] = [...(map[c] || []), d];
  }
  return Object.keys(map).sort((a, b) => rank(a) - rank(b)).map((currency) => ({ currency, debts: map[currency] }));
}

export default {
  methods: {
    // 30.09 (doc1 17/19/20-rasm): qarz tanlash oynasini ochish ('close' | 'pay' | 'forgive')
    openActModal(mode) {
      if (!this.actionDebts.length || this.actBusy) {return}
      this.actModal = mode
    },

    // Mahalliy sana (YYYY-MM-DD) — toISOString UTC bo'lgani uchun 00:00–05:00 da kechagi kunni berardi.
    todayYmd() {
      const d = new Date()
      const p = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
    },

    // Amaldan keyin: ro'yxat + tavsiya yangilanadi (yopilgan qarz tavsiyaga ta'sir qiladi).
    async afterAct(msg, smsResults) {
      this.$toast && this.$toast.success && this.$toast.success(msg)
      this.showSmsOutcome(smsResults)
      this.confirmKind = ''
      this.actModal = ''
      await this.loadDebts()
      this.loadReliability()
    },
    /**
     * 03.10 (3-rasm): "SMS yuborish" yoqilgan bo'lsa — natija: yuborildi / tarif cheklovi (markazdagi
     * "Tariflar" oynasi, amal baribir bajarilgan) / boshqa sabab bilan yuborilmadi (server matni).
     */
    showSmsOutcome(smsResults) {
      if (!smsResults) {return}
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      const tx = SMS_NOTICE_TEXTS[l] || SMS_NOTICE_TEXTS.uz
      const out = smsOutcome(smsResults)
      if (out.kind === 'sent') {this.$toast && this.$toast.success && this.$toast.success(tx.sent)}
      else if (out.kind === 'plan') {this.$planPrompt && this.$planPrompt({ message: out.message, expired: this.planExpired })}
      else if (out.kind === 'failed') {this.$toast && this.$toast.error && this.$toast.error(out.message ? tx.failed + ': ' + out.message : tx.failed)}
    },
    // 02.10 (2-rasm): server `code` bo'yicha joriy tilda (server matni faqat o'zbekcha bo'lishi mumkin)
    errMsg(e) {
      const d = (e && e.response && e.response.data) || {}
      if (d.code === 'over-remaining') {return this.texts.overRemaining}
      if (d.code === 'already-closed') {return this.texts.alreadyClosed}
      return d.message || this.$t('errors.operationFailed')
    },
    actError(e) {
      // 02.10: tarif cheklovi — "Tariflar" tugmali taklifni plugins/axios.js ko'rsatdi (xato toast'i YO'Q)
      if (isPlanRequiredError(e)) {return}
      this.$toast && this.$toast.error && this.$toast.error(this.errMsg(e))
    },

    /**
     * Tanlash oynasi natijasi: forgive — bir nechta qarz; close/pay — tanlangan qarz(lar) (to'liq yoki qisman).
     * 01.10 (doc3 5/6-rasm): bir valyutada BIR NECHTA qarz — summa muddati yaqin qarzdan boshlab taqsimlanadi.
     * 02.10 (3–4-rasm): tanlov bir nechta VALYUTADA bo'lishi mumkin — `amounts` (valyuta → summa|null).
     */
    onActConfirm({ debts, amount, amounts, notifySms }) {
      if (!debts || !debts.length) {return}
      if (this.actModal === 'forgive') {return this.actForgiveMany(debts)}
      return this.actPayGroups(debts, amounts || null, amount, !!notifySms)
    },

    /**
     * 02.10 (3–4-rasm): har valyuta ALOHIDA (backend bitta valyutani taqsimlaydi; UZS va USD qo'shilmaydi):
     * guruhda bitta qarz → oddiy to'lov, bir nechta → allocate-payment. Ketma-ket; o'rtada xato bo'lsa
     * bajarilganlari saqlanadi, ro'yxat yangilanadi va xato aniq ko'rsatiladi. Oxirida BITTA xabar.
     */
    async actPayGroups(debts, amounts, legacyAmount, notifySms) {
      if (this.actBusy) {return}
      const groups = groupByCurrency(debts)
      this.actBusy = true
      let done = 0
      let allClosed = true
      // 03.10 (3-rasm): SMS natijalari (har valyuta / har to'lov) — kalit o'chiq bo'lsa null (xabar yo'q)
      const sms = notifySms ? [] : null
      try {
        for (const g of groups) {
          const raw = amounts ? amounts[g.currency] : (groups.length === 1 ? legacyAmount : null)
          const want = Number(raw) > 0 ? Number(raw) : null
          const r = g.debts.length === 1 ? await this.payOne(g.debts[0], want, notifySms) : await this.payMany(g.debts, want, notifySms)
          done += 1
          if (!r.closed) {allClosed = false}
          if (sms) {sms.push(...r.sms)}
        }
        await this.afterAct(allClosed ? this.texts.closedOk : this.texts.paidOk, sms)
      } catch (e) {
        if (done) { this.actModal = ''; this.showSmsOutcome(sms); await this.loadDebts() }
        this.actError(e)
      } finally { this.actBusy = false }
    },

    /**
     * Bitta qarz: o'z qaydim → POST /finance/debts/:id/payments (qoldiqqa teng bo'lsa backend 'completed' qiladi);
     * hamkor qaydi (men qarz beruvchi) → mirror-payment. `amount` null — butun qoldiq. Qaytaradi: yopildimi.
     */
    async payOne(debt, amount, notifySms) {
      const full = Number(debt.remaining_amount) || 0
      const amt = amount > 0 ? amount : full
      // 03.10: notify_sms — faqat kalit yoqilganda yuboriladi (odatiy o'chiq)
      const sms = notifySms ? { notify_sms: true } : {}
      const res = debt.is_mirror
        ? await this.$api.mirrorPayDebt(debt.id, { ...(amount > 0 ? { amount } : {}), ...sms })
        : await this.$api.addDebtPayment(debt.id, { amount: amt, payment_date: this.todayYmd(), ...sms })
      if (!(res && res.data && res.data.success)) {throw new Error('payment failed')}
      return { closed: amt + 0.0001 >= full, sms: smsList(res.data.sms) }
    },

    /**
     * 01.10 (doc3 5/6-rasm): bir valyutadagi bir nechta qarzga BITTA summa — serverda bitta tranzaksiya
     * (POST /finance/debts/allocate-payment). Backend hali yangilanmagan bo'lsa (marshrut 404) —
     * xuddi shu tartibda ketma-ket to'lovlar (utils/debtAllocation). Qaytaradi: hammasi yopildimi.
     */
    async payMany(debts, amount, notifySms) {
      const total = debts.reduce((s, d) => s + (Number(d.remaining_amount) || 0), 0)
      const paid = amount > 0 ? amount : total
      const payload = { ids: debts.map((d) => d.id), payment_date: this.todayYmd() }
      if (amount > 0) {payload.amount = amount}
      if (notifySms) {payload.notify_sms = true} // 03.10: javobda `sms: [{ currency, sent, reason?, message? }]`
      let sms = []
      try {
        const res = await this.$api.allocateDebtPayment(payload)
        if (!(res && res.data && res.data.success)) {throw new Error('allocate failed')}
        sms = smsList(res.data.sms)
      } catch (e) {
        const r = e && e.response
        const routeMissing = r && r.status === 404 && !(r.data && r.data.code)
        if (!routeMissing) {throw e}
        sms = await this.allocateSequential(debts, amount, notifySms)
      }
      return { closed: paid + 0.0001 >= total, sms }
    },
    /**
     * Zaxira: taqsimot bo'yicha ketma-ket to'lovlar (xato bo'lsa chaqiruvchi ro'yxatni yangilaydi).
     * 03.10: SMS kaliti yoqilgan bo'lsa — faqat OXIRGI to'lovda (bitta SMS). Qaytaradi: SMS natijalari.
     */
    async allocateSequential(debts, amount, notifySms) {
      const plan = allocatePayment(debts, amount > 0 ? amount : null)
      const steps = plan.allocations.filter((a) => a.pay > 0)
      let sms = []
      for (let i = 0; i < steps.length; i += 1) {
        const a = steps[i]
        const d = a.debt
        const extra = notifySms && i === steps.length - 1 ? { notify_sms: true } : {}
        const res = d.is_mirror
          ? await this.$api.mirrorPayDebt(d.id, { amount: a.pay, ...extra })
          : await this.$api.addDebtPayment(d.id, { amount: a.pay, payment_date: this.todayYmd(), ...extra })
        if (!(res && res.data && res.data.success)) {throw new Error('payment failed')}
        if (extra.notify_sms) {sms = smsList(res.data.sms)}
      }
      return sms
    },

    /** Tanlangan qarzlardan ketma-ket voz kechish; qisman muvaffaqiyat ham aniq aytiladi. */
    async actForgiveMany(debts) {
      if (this.actBusy) {return}
      this.actBusy = true
      let ok = 0
      let firstErr = null
      try {
        for (const d of debts) {
          try {
            const res = d.is_mirror ? await this.$api.mirrorForgiveDebt(d.id) : await this.$api.forgivePersonalDebt(d.id)
            if (res && res.data && res.data.success) {ok += 1}
          } catch (e) { if (!firstErr) {firstErr = e} }
        }
      } finally { this.actBusy = false }
      if (firstErr) {this.actError(firstErr)}
      if (ok > 0) {await this.afterAct(ok > 1 ? this.texts.forgivenMany.replace('{n}', ok) : this.texts.forgivenOk)}
      else {this.actModal = ''}
    },

    /**
     * 03.10 (sayt hujjati, 4-rasm): "Talab qilish" — SMS darhol KETMAYDI (mixins/financeDemandMixin.js):
     * tarif qulfi → markazdagi "Tarif cheklovi"; karta yo'q → karta oynasi; karta bor → "Talab SMS yuborilsinmi?".
     */
    actDemand() {
      const tg = this.demandTarget
      if (!tg || this.actBusy) {return}
      this.startFinanceDemand(tg)
    },
  },
};
