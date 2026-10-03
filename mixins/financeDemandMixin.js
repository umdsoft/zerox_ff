/**
 * 03.10 (sayt hujjati, 4-rasm; mobil useFinanceDemand bilan bir xil): Shaxsiy qarz "Talab qilish" — YAGONA oqim.
 * Ishlatiladi: pages/finance/debts/group/_key.vue (kontragent) va pages/finance/debts/_id.vue (qarz tafsiloti).
 * `subscriptionMixin` bilan BIRGA ulanadi (requirePlanFeature).
 *
 * Ilgari "Talab qilish" bosilishi bilan SMS darhol ketardi. Endi:
 *   1) tarif qulfi (Free / muddati tugagan — manual_sms_send yo'q) → markazdagi "Tarif cheklovi" oynasi
 *      (`$planPrompt`), API chaqirilmaydi;
 *   2) plastik karta KIRITILMAGAN → avval "Plastik karta ma'lumotlari" oynasi (PayoutCardModal); saqlangach
 *      tasdiq oynasi O'ZI ochiladi;
 *   3) karta bor → "Talab SMS yuborilsinmi?" (DemandConfirmModal): "Ha, yuborish" — SMS ketadi; X / Bekor —
 *      hech narsa yuborilmaydi; "Kartani o'zgartirish" — karta oynasi, so'ng tasdiq yangi karta bilan.
 * Xatolar (avvalgidek): 403 plan-required — plugins/axios.js taklifi; `no-card` — karta oynasi;
 * `sms-not-sent` / 402 `no-sms-package` (NO_PACKAGE) — server matni + Tariflar sahifasi.
 *
 * Shablon ulanishi (sahifada):
 *   <DemandConfirmModal v-if="fd.open" v-bind="fdModalProps" @close="closeFinanceDemand"
 *     @confirm="confirmFinanceDemand" @change-card="onFdChangeCard" />
 *   <PayoutCardModal v-if="fd.cardModal" :intent="fd.cardOrigin === 'start' ? 'demand' : 'edit'"
 *     @close="onFdCardClosed" @saved="onFdCardSaved" />
 */
import { isPlanRequiredError } from '~/utils/planGate'
import { titleCaseName } from '~/utils/helpers'

/** Talab SMS'idagi ism — backend `demandName` (Eskiz `%w{1,6}`): ko'pi bilan 2 so'z */
const DEMAND_NAME_MAX_WORDS = 2

export function demandSmsName(fish) {
  return String(fish || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean)
    .slice(0, DEMAND_NAME_MAX_WORDS).join(' ') || 'foydalanuvchi'
}

/** "+998XXXXXXXXX" — backend `fmtTgPhone` bilan bir xil */
export function demandTgPhone(raw) {
  const d = String(raw || '').replace(/\D/g, '')
  if (!d) return ''
  return d.length === 9 ? '+998' + d : '+' + d
}

/**
 * SMS matni ko'rinishi — backend `buildDemandSmsVariants` 1-varianti (Eskiz 89560, faqat o'zbekcha).
 * @param {{ fish: string, cardNumber: string, tgPhone: string }} p
 */
export function buildFinanceDemandPreview(p) {
  const card = String((p && p.cardNumber) || '').replace(/\D/g, '')
  const tg = demandTgPhone(p && p.tgPhone)
  if (!card || !tg) return ''
  return `${demandSmsName(p.fish)}dan olgan qarzingizni ${card} ga o'tkazishingiz mumkin. Pul o'tkazilganidan so'ng ${tg} ga telegram orqali xabar yuboring.`
}

const OK_TEXT = {
  uz: 'Qarzni qaytarish bo‘yicha SMS xabarnoma yuborildi.',
  ru: 'SMS с требованием вернуть долг отправлено.',
  kr: 'Қарзни қайтариш бўйича SMS хабарнома юборилди.',
  en: 'Repayment demand SMS sent.',
  kaa: 'Qarızdı qaytarıw boyınsha SMS jiberildi.',
}

export default {
  data() {
    return {
      fd: {
        open: false, // tasdiq oynasi
        busy: false, // SMS yuborilmoqda
        checking: false, // karta o'qilmoqda
        card: null, // { number, holder, telegramPhone } | null
        fish: '',
        debt: null,
        cardModal: false, // PayoutCardModal
        cardOrigin: 'start', // 'start' (karta yo'q edi) | 'change' (tasdiq oynasidan "Kartani o'zgartirish")
      },
    }
  },
  computed: {
    fdBusy() { return this.fd.busy || this.fd.checking },
    fdAccountPhone() { return (this.$auth && this.$auth.user && this.$auth.user.phone) || '' },
    fdModalProps() {
      const fd = this.fd
      const debt = fd.debt || {}
      const tg = (fd.card && fd.card.telegramPhone) || this.fdAccountPhone
      return {
        card: fd.card,
        tgFallback: this.fdAccountPhone,
        recipientName: titleCaseName(String(debt.source_name || debt.name || '').trim()),
        recipientPhone: debt.phone || '',
        preview: fd.card ? buildFinanceDemandPreview({ fish: fd.fish, cardNumber: fd.card.number, tgPhone: tg }) : '',
        busy: fd.busy,
        canChangeCard: true,
        inlineEdit: false,
      }
    },
  },
  methods: {
    /** GET /finance/payout-card (silent) → karta yoki null. Tarmoq xatosi — throw. */
    async fdLoadCard() {
      const res = await this.$axios.get('/finance/payout-card', { silent: true })
      const d = (res && res.data && res.data.data) || {}
      this.fd.fish = String(d.fish || '')
      const number = String(d.card_number || '').replace(/\D/g, '')
      if (!number) return null
      return {
        number,
        holder: String(d.card_holder || d.fish || '').trim(),
        telegramPhone: String(d.telegram_phone || ''),
      }
    },

    /** "Talab qilish" bosildi */
    async startFinanceDemand(debt) {
      if (!debt || this.fdBusy || this.fd.open) return
      // Tarifda talab SMS yo'q — karta oynasi ham, API ham yo'q; markazdagi "Tariflar" taklifi
      if (!this.requirePlanFeature('manual_sms_send')) return
      this.fd.debt = debt
      this.fd.checking = true
      try {
        let card = null
        let loaded = true
        try { card = await this.fdLoadCard() } catch (_) { loaded = false }
        this.fd.card = card
        // Karta o'qilmadi (tarmoq) — tasdiq oynasi baribir ochiladi; server o'zi tekshiradi (no-card)
        if (card || !loaded) { this.fd.open = true; return }
        this.fd.cardOrigin = 'start'
        this.fd.cardModal = true
      } finally { this.fd.checking = false }
    },

    closeFinanceDemand() {
      if (this.fd.busy) return
      this.fd.open = false
    },

    onFdChangeCard() {
      if (this.fd.busy) return
      this.fd.open = false
      this.fd.cardOrigin = 'change'
      this.fd.cardModal = true
    },

    /** Karta oynasi saqlamasdan yopildi: "o'zgartirish"dan kelingan bo'lsa — tasdiqqa (eski karta bilan) qaytamiz */
    onFdCardClosed() {
      this.fd.cardModal = false
      if (this.fd.cardOrigin === 'change' && this.fd.debt) this.fd.open = true
    },

    /** Karta saqlandi → yangi kartani o'qib, tasdiq oynasi O'ZI ochiladi */
    async onFdCardSaved() {
      this.fd.cardModal = false
      if (!this.fd.debt) return
      this.fd.checking = true
      try {
        try { this.fd.card = await this.fdLoadCard() } catch (_) { /* eski qiymat qoladi — server tekshiradi */ }
        this.fd.open = true
      } finally { this.fd.checking = false }
    },

    /** "Ha, yuborish" — talab SMS */
    async confirmFinanceDemand() {
      const debt = this.fd.debt
      if (!debt || this.fd.busy) return
      this.fd.busy = true
      try {
        const res = debt.is_mirror ? await this.$api.mirrorDemandDebt(debt.id) : await this.$api.demandRepayment(debt.id)
        if (res && res.data && res.data.success !== false) {
          const l = (this.$i18n && this.$i18n.locale) || 'uz'
          this.$toast && this.$toast.success && this.$toast.success(OK_TEXT[l] || OK_TEXT.uz)
        }
        this.fd.open = false
      } catch (e) {
        this.fd.open = false
        this.fdHandleError(e)
      } finally { this.fd.busy = false }
    },

    fdHandleError(e) {
      // Tarif cheklovi — "Tariflar" taklifini plugins/axios.js ko'rsatdi (xato toast'i YO'Q)
      if (isPlanRequiredError(e)) return
      const r = (e && e.response) || {}
      const d = r.data || {}
      if (d.code === 'no-card') {
        this.fd.card = null
        this.fd.cardOrigin = 'start'
        this.fd.cardModal = true
        return
      }
      this.$toast && this.$toast.error && this.$toast.error(d.message || this.$t('errors.operationFailed'))
      const reason = d.reason || (d.sms && d.sms.reason)
      if (r.status === 402 || d.code === 'no-sms-package' || reason === 'NO_PACKAGE') {
        this.$router.push(this.localePath({ name: 'price' }))
      }
    },
  },
}
