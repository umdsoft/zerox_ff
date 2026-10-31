/**
 * wave D: pages/finance/debts/group/_key.vue dan ajratilgan computed'lar (guruh, summalar, matnlar, mirror to'lovlar).
 * Computed sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
import { titleCaseName } from '~/utils/helpers'; // 29.09: formatDateLocale → fmtDMY (26.09.2026)
import { getDebtGroupTexts } from '~/utils/debtGroupTexts';
import { groupDebtsByCounterparty, findGroupByRouteKey } from '~/utils/debtGroups';

// 29.09 (doc1 19-rasm): kelgan bo'lim (`?tab=`) → ko'rsatiladigan qarz turi. Berilgan bo'limlardan
// kirilsa FAQAT berilgan (lent), olingan bo'limlardan — FAQAT olingan (borrowed); qolganlarida hammasi.
const SIDE_BY_TAB = {
  given: 'lent', 'overdue-given': 'lent', lent: 'lent', lent_overdue: 'lent',
  taken: 'borrowed', 'overdue-taken': 'borrowed', borrowed: 'borrowed', borrowed_overdue: 'borrowed',
};

// Qarz tafsiloti sahifasidagi reliability darajasi → Tavsiya kartasi rangi
const REL_TONE = { reliable: 'good', medium: 'warn', risky: 'bad', none: 'none' };

// SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band: `?tab=` → ro'yxat sahifasi turi (yangi va eski qiymatlar)
const LIST_KIND_BY_TAB = {
  given: 'given', taken: 'taken', 'overdue-given': 'overdue-given', 'overdue-taken': 'overdue-taken', completed: 'completed', all: 'all',
  lent: 'given', lent_overdue: 'overdue-given', borrowed: 'taken', borrowed_overdue: 'overdue-taken', active: 'all',
};

export default {
  computed: {
    // 02.10: talab SMS tarifda yo'q (muddati tugagan/Free) — qulf (yuklanmagan bo'lsa yo'q, server hal qiladi)
    demandLocked() { return this.isFeatureLocked('manual_sms_send') },
    // 03.10 (3-rasm): yopish/to'lov SMS'i — "to'lov xabarnomasi" turi (auto_sms_reminder)
    smsLocked() { return this.isFeatureLocked('auto_sms_reminder') },
    // "SMS yuborish" kaliti: qarama-qarshi tomon telefoni (guruh yoki qarz yozuvidan). Hamkor qaydida telefonni
    // backend o'zi topadi (qarzni kiritgan foydalanuvchi) — kalit ko'rinadi, izoh raqamsiz bo'lishi mumkin.
    smsTarget() {
      const list = this.actionDebts
      const withPhone = list.find((d) => !!d.phone)
      const phone = (this.group && this.group.phone) || (withPhone && withPhone.phone) || ''
      return { phone, available: !!phone || list.some((d) => d.is_mirror) }
    },
    // URL'dagi guruh kaliti ($route.params.key vue-router tomonidan bir marta dekodlanadi).
    routeKey() {
      return (this.$route && this.$route.params && this.$route.params.key) || ''
    },

    // 29.09 (doc1 19-rasm): ko'rsatiladigan qarz turi ('lent' | 'borrowed' | '' = hammasi).
    side() {
      return SIDE_BY_TAB[this.currentTab] || ''
    },

    // Shu kontragent guruhi (ro'yxat sahifasidagi bilan AYNAN bir xil mantiq).
    // 29.09: bo'lim ma'lum bo'lsa — faqat shu turdagi qarzlar guruhlanadi (ro'yxat, soni, kartalar).
    group() {
      const s = this.side
      const list = s ? this.debts.filter((d) => d.type === s) : this.debts
      return findGroupByRouteKey(groupDebtsByCounterparty(list), this.routeKey)
    },
    // Filtrsiz guruh — Tavsiya uchun (ishonchlilik shaxsning BARCHA qarzlari bo'yicha, backend kabi).
    fullGroup() {
      return findGroupByRouteKey(groupDebtsByCounterparty(this.debts), this.routeKey)
    },

    // 29.09: sahifa sarlavhasi — Qarz daftaridagidek "Qarz oluvchi" / "Qarz beruvchi".
    pageTitle() {
      if (this.side === 'lent') {return this.texts.titleLent}
      if (this.side === 'borrowed') {return this.texts.titleBorrowed}
      return this.texts.titleAll
    },

    // 29.09: bo'lim kartalari — valyuta bo'yicha Jami (undirilgan + qoldiq) / Undirilgan / Qoldiq.
    // Voz kechilgan summa "undirilgan"ga qo'shilmaydi (faqat haqiqiy to'lovlar).
    sideTotals() {
      const items = (this.group && this.group.items) || []
      const map = {}
      for (const d of items) {
        const cur = d.currency || 'UZS'
        if (!map[cur]) {map[cur] = { currency: cur, paid: 0, left: 0 }}
        map[cur].paid += this.paidOf(d)
        if (this.isOpen(d)) {map[cur].left += Number(d.remaining_amount) || 0}
      }
      const rank = (c) => (c === 'UZS' ? 0 : c === 'USD' ? 1 : 2)
      const rows = Object.values(map)
        .map((r) => ({ ...r, total: r.paid + r.left }))
        .sort((a, b) => rank(a.currency) - rank(b.currency))
      return rows.length ? rows : [{ currency: 'UZS', paid: 0, left: 0, total: 0 }]
    },

    // 30.09 (doc1 17/19-rasm): sarlavhadagi amallar uchun TANLASH mumkin bo'lgan qarzlar — shu bo'limdagi
    // ochiq qarzlar, men boshqara oladiganlari (o'z qaydim yoki men qarz beruvchi bo'lgan hamkor qaydi).
    actionDebts() {
      if (!this.side || !this.group || this.group.kind === 'shop') {return []}
      return (this.group.items || []).filter((d) => this.isOpen(d) && !d.is_shop_debt && (!d.is_mirror || d.can_operate))
    },
    // Talab SMS'i qarzdor telefoniga ketadi — o'z qaydimda telefon bo'lishi shart; hamkor qaydida telefon
    // backend'da (kiritgan foydalanuvchi). SMS matni qarzga bog'liq emas (karta rekviziti), shuning uchun
    // telefonli eng oxirgi ochiq qarz olinadi.
    demandTarget() {
      return this.actionDebts.find((d) => d.is_mirror || !!d.phone) || null
    },
    canDemand() {
      return !!this.demandTarget
    },
    demandHint() {
      if (!this.actionDebts.length) {return this.texts.noActive}
      return this.canDemand ? '' : this.texts.noPhoneDemand
    },
    // 01.10 (doc3 7-rasm): "Faol qarzlar" izohi — shu bo'limdagi BARCHA ochiq qarzlar, jumladan hamkor
    // kiritgan va menga faqat KO'RISH ochiq bo'lgan qarz (masalan Jamshid bergan 500 000 UZS). Ilgari
    // `actionDebts` (faqat men boshqara oladiganlar) olinardi — o'sha qarz soni va summaga kirmasdi.
    // Amal oynasi (yopish/qaytarish) esa baribir faqat `actionDebts` bilan ishlaydi.
    openDebts() {
      if (!this.side || !this.group || this.group.kind === 'shop') {return []}
      return (this.group.items || []).filter((d) => this.isOpen(d) && !d.is_shop_debt)
    },
    // 02.10 (5-rasm): pastki ro'yxat — bo'lim ma'lum bo'lsa faqat AMALDAGI qarzlar ("Amaliyotlar")
    listItems() {
      const items = (this.group && this.group.items) || []
      return this.side ? items.filter((d) => this.isOpen(d)) : items
    },
    // Faol qarzlar jami qoldig'i valyuta bo'yicha ("1 200 000 UZS · 500 USD")
    openTotalsText() {
      const map = {}
      for (const d of this.openDebts) { const c = d.currency || 'UZS'; map[c] = (map[c] || 0) + (Number(d.remaining_amount) || 0) }
      return Object.keys(map).map((c) => this.formatMoney(map[c], c)).join(' · ')
    },
    relTone() {
      return REL_TONE[this.reliability.level] || 'none'
    },


    // SS-DEV (2026-09-24): valyuta bo'yicha jami (UZS, USD...). Bo'sh bo'lsa — 0 UZS.
    totalsByCurrency() {
      const g = this.group
      const list = (g && g.byCurrency) || []
      return list.length ? list : [{ currency: (g && g.currency) || 'UZS', borrowed: 0, lent: 0, net: 0 }]
    },

    // SS-DEV (2026-09-24): kelgan bo'lim (Faol/Tugallangan/...) — "Orqaga" shu bo'limga.
    currentTab() {
      return (this.$route && this.$route.query && this.$route.query.tab) || ''
    },
    // SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band: ro'yxatlar endi ALOHIDA sahifada
    // (/finance/debts/list/:kind) — "Orqaga" kelgan ro'yxat sahifasiga; eski `lent/borrowed/...`
    // qiymatlari ham xaritalanadi; bo'lim noma'lum bo'lsa — Shaxsiy qarz bosh sahifasi.
    backLink() {
      const kind = LIST_KIND_BY_TAB[this.currentTab]
      if (kind) {return this.localePath({ name: 'finance-debts-list-kind', params: { kind } })}
      return this.localePath({ name: 'finance-debts' })
    },
    // SS-DEV (2026-09-27), 26.09 hujjat 4-band: "To'lov qayd etish" → "Qarzni qaytarish" (5 til)
    texts() {
      return getDebtGroupTexts(this.$i18n && this.$i18n.locale)
    },

    // SS-DEV (2026-09-24): shikoyat nishoni — do'kon qarzi yoki hamkor qaydi.
    complaintTarget() {
      return this.complaintKind === 'person' ? this.mirrorDebt : this.shopDebt
    },
    // SS-DEV (2026-09-24): sabab tanlangan YOKI izoh yozilgan bo'lsa yuborish mumkin.
    complaintCanSend() {
      return !!(this.complaintReason || String(this.complaintNote || '').trim())
    },

    // SS-DEV (2026-09-24): hamkor qaydi bo'yicha QAYTARISHLAR (kim/qachon), marker yozuvlarsiz.
    mirrorPayments() {
      const d = this.mirrorDebt
      if (!d || !Array.isArray(d.payments)) {return []}
      const myId = this.$auth && this.$auth.user && this.$auth.user.id
      return d.payments
        .filter((p) => !/^__increase__/.test(String(p.notes || '')))
        .map((p) => {
          const forgive = /^__forgive__/.test(String(p.notes || ''))
          const byMe = !!(p.created_by && myId && Number(p.created_by) === Number(myId))
          // Hamkor qaydida: egasi (owner) = qarshi tomon; men = counterparty
          const role = p.created_by_role === 'owner'
            ? (d.type === 'lent' ? this.$t('l10n.pdg.role_borrower') : this.$t('l10n.pdg.role_lender'))
            : (d.type === 'lent' ? this.$t('l10n.pdg.role_lender') : this.$t('l10n.pdg.role_borrower'))
          const by = byMe ? this.$t('l10n.pdg.you') : ((p.created_by_name || this.$t('l10n.pdg.partner')) + ' (' + role + ')')
          return { ...p, kind: forgive ? 'forgive' : 'payment', by, byMe }
        })
        .sort((a, b) => new Date(a.created_at || a.payment_date) - new Date(b.created_at || b.payment_date))
    },

    // SS-DEV (2026-09-24): qisman to'lov summasi — "122 000" formatida ko'rinadi/kiritiladi.
    mirrorPayDisplay: {
      get() { return this.fmtNum(this.mirrorPayAmount) },
      set(v) { const r = String(v || '').replace(/\D/g, ''); this.mirrorPayAmount = r ? Number(r) : '' }
    },
    mirrorPayOver() {
      const a = Number(this.mirrorPayAmount) || 0
      const rem = Number(this.mirrorDebt && this.mirrorDebt.remaining_amount) || 0
      return a > 0 && a > rem + 0.0001
    },

    // SS-DEV (2026-09-24): do'kon guruhi sarlavhasi uchun manzil/telefon (qarz yozuvlaridan).
    shopInfo() {
      const g = this.group
      if (!g || g.kind !== 'shop') {return { address: '', phone: '' }}
      const it = (g.items || []).find((d) => d.shop_region || d.shop_district || d.shop_phone || d.owner_phone) || {}
      return {
        address: [it.shop_region, it.shop_district].filter(Boolean).join(', '),
        // SS-DEV (2026-09-24): do'kon Telegram telefoni bo'lmasa — do'kon EGASINING telefoni
        phone: it.shop_phone || it.owner_phone || '',
      }
    },

    // SS-19: tasdiqlash modalining matni — amal turiga qarab.
    // SS-DEV (2026-09-24): ism "Sarlavha Ko'rinishi"da; voz kechish ikonkasi 🕊️; yashirish qo'shildi.
    confirmCfg() {
      const name = titleCaseName((this.mirrorDebt && this.mirrorDebt.source_name) || '')
      if (this.confirmKind === 'hide') {
        return {
          title: this.$t('l10n.pdg.hide_title'),
          message: this.$t('l10n.pdg.hide_msg', { name }),
          confirmText: this.$t('l10n.pdg.hide_yes'), tone: 'danger', icon: '🗑',
        }
      }
      // SS-DEV (2026-09-24): ro'yxatdagi tugallangan qatorni o'chirish (o'z qaydim yoki hamkor qaydi).
      if (this.confirmKind === 'rowdelete') {
        const gname = (this.group && this.group.name) || ''
        return {
          title: this.$t('l10n.pdg.del_title'),
          message: this.$t('l10n.pdg.del_msg', { name: gname }),
          confirmText: this.$t('l10n.pdg.del_yes'), tone: 'danger', icon: '🗑',
        }
      }
      return {
        title: this.texts.forgiveTitle,
        message: this.$t('l10n.pdg.forgive_msg', { name }),
        confirmText: this.texts.forgiveYes, tone: 'danger', icon: '🚫',
      }
    },

    // Avatar rang klassi: do'kon → amber; shaxs → qizil/yashil, aralash bo'lsa kulrang.
    avatarClass() {
      const g = this.group
      if (!g) {return 'bg-gray-100 text-gray-600'}
      if (g.kind === 'shop') {return 'bg-amber-100 text-amber-600'}
      if (g.mixed) {return 'bg-gray-100 text-gray-600'}
      if (g.displayType === 'lent') {return 'bg-green-100 text-green-600'}
      return 'bg-red-100 text-red-600'
    }
  },
};
