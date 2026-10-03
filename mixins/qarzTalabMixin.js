/**
 * 03.10 (sayt hujjati, 4-rasm; mobil qarzTalab.useQarzTalab bilan bir xil): Qarz daftari "Talab qilish" oqimi.
 * Ishlatiladi: pages/qarz-daftari/mijoz/_id/index.vue. `subscriptionMixin` bilan BIRGA ulanadi.
 *
 *   1) tarif qulfi (do'kon EGASINING tarifi, `talabLocked`) → markazdagi "Tarif cheklovi" oynasi;
 *   2) do'konda karta + Telegram telefoni (JUFT — backend 03.10 qoidasi) YO'Q va foydalanuvchi do'kon EGASI →
 *      avval karta formasi (shu oynaning o'zida), saqlangach "Talab SMS yuborilsinmi?";
 *   3) bor → tasdiq oynasi: "Ha, yuborish" yuboradi, X / Bekor yubormaydi, "Kartani o'zgartirish" — forma.
 *   Xodim do'kon kartasini o'zgartira olmaydi (backend `denyXodim`) — karta bo'lmasa ham tasdiq oynasi, izohda
 *   "umumiy matn yuboriladi" (backend endi 428 `no-card` qaytarmaydi; karta bo'lmasa umumiy matn ketadi).
 * Xatolar (avvalgidek): 403 plan-required — plugins/axios.js; 402 no-sms-package — matn + Tariflar;
 * 400 sms-not-sent — server matni; eski 428 `no-card` — egasi bo'lsa karta formasi.
 *
 * Shablon: <DemandConfirmModal v-if="qt.open" :key="qt.key" v-bind="qtModalProps" @close="qtClose"
 *   @confirm="qtConfirm" @change-card="() => {}" @save-card="qtSaveCard" />
 */
import { isPlanRequiredError } from '~/utils/planGate'
import { normUzPhone } from '~/utils/cardBin'

const CARD_LEN = 16

/** Backend `normalizeCard`: faqat 16 raqam, aks holda '' */
function normCard(raw) {
  const d = String(raw || '').replace(/\D/g, '')
  return d.length === CARD_LEN ? d : ''
}
/** Backend `fmtAmount`: butun son, minglik bo'shliq bilan */
function smsAmount(n) {
  return String(Math.round(parseFloat(String(n == null ? 0 : n)) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
/** Backend `storeDokonidagi`: "... dokoni" → "... dokonidagi" */
const DOKON_SUFFIX_RE = /(^|\s+)do['ʻʼ‘’`]?koni?$/i
function storeDokonidagi(store) {
  const s = String(store || '').trim() || 'ZeroX'
  const base = s.replace(DOKON_SUFFIX_RE, '').trim()
  return `${base || s} dokonidagi`
}

/**
 * SMS matni ko'rinishi — backend `buildTalabSmsVariants` 1-varianti (Eskiz 92855 / 73267, faqat o'zbekcha).
 * @param {{ store: string, amount: number|string, valyuta: string }} q
 * @param {{ number: string, telegramPhone?: string } | null} card
 */
export function buildQarzTalabPreview(q, card) {
  const store = String((q && q.store) || 'ZeroX').trim() || 'ZeroX'
  const a = smsAmount(q && q.amount)
  const cw = (q && q.valyuta) || 'UZS'
  const tg = normUzPhone(card && card.telegramPhone)
  if (card && card.number && tg) {
    return `${storeDokonidagi(store)} ${a} ${cw} qarzingizni qaytarish talab qilinmoqda. Qarzni ${card.number} ga o'tkazib, bu haqda ${tg} ga telegram orqali xabar yuboring.`
  }
  return `Sizning ${store}dan bo'lgan ${a} ${cw} qarzingizni bugun qaytarish talab qilinmoqda. ZeroX bilan qarzlarni oson boshqaring.`
}

const TX = {
  uz: {
    ok: "Talab yuborildi va SMS jo'natildi", okTo: "Talab yuborildi. SMS {p} raqamiga jo'natildi.",
    staffNote: "Do'kon kartasi kiritilmagan — SMS'da umumiy matn yuboriladi. Kartani faqat do'kon egasi kirita oladi.",
    noShopNote: "Do'kon kartasi topilmadi — SMS'da umumiy matn yuboriladi.",
    saved: 'Karta saqlandi', saveErr: 'Saqlab bo‘lmadi. Qayta urinib ko‘ring.',
    errBoth: "Karta raqami va telefon raqamini ikkalasini ham kiriting — faqat bittasini saqlab bo'lmaydi.",
    noPhone: "Mijozning telefon raqami kiritilmagan. Avval telefon raqamini qo'shing.",
    noPkg: "SMS paketingiz tugagan. Tariflar bo'limidan paket sotib oling.",
    notActive: 'Bu qarz aktiv emas', wrongType: 'Faqat siz bergan qarzlar uchun talab yuborish mumkin',
    tooMany: "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring.", generic: 'Xatolik yuz berdi',
  },
  ru: {
    ok: 'Запрос отправлен и SMS доставлено', okTo: 'Запрос отправлен. SMS отправлено на {p}.',
    staffNote: 'Карта магазина не указана — в SMS будет отправлен общий текст. Карту может указать только владелец магазина.',
    noShopNote: 'Карта магазина не найдена — в SMS будет отправлен общий текст.',
    saved: 'Карта сохранена', saveErr: 'Не удалось сохранить. Попробуйте ещё раз.',
    errBoth: 'Укажите и номер карты, и номер телефона — сохранить только одно из них нельзя.',
    noPhone: 'Номер телефона клиента не указан. Сначала добавьте номер.',
    noPkg: 'SMS пакет закончился. Купите пакет в разделе Тарифы.',
    notActive: 'Этот долг не активен', wrongType: 'Запрос можно отправлять только по выданным долгам',
    tooMany: 'Слишком много попыток. Повторите позже.', generic: 'Произошла ошибка',
  },
  kr: {
    ok: 'Талаб юборилди ва SMS жўнатилди', okTo: 'Талаб юборилди. SMS {p} рақамига жўнатилди.',
    staffNote: 'Дўкон картаси киритилмаган — SMSда умумий матн юборилади. Картани фақат дўкон эгаси кирита олади.',
    noShopNote: 'Дўкон картаси топилмади — SMSда умумий матн юборилади.',
    saved: 'Карта сақланди', saveErr: 'Сақлаб бўлмади. Қайта уриниб кўринг.',
    errBoth: 'Карта рақами ва телефон рақамини иккаласини ҳам киритинг — фақат биттасини сақлаб бўлмайди.',
    noPhone: 'Мижознинг телефон рақами киритилмаган. Аввал телефон рақамини қўшинг.',
    noPkg: 'SMS пакетингиз тугаган. Тарифлар бўлимидан пакет сотиб олинг.',
    notActive: 'Бу қарз актив эмас', wrongType: 'Фақат сиз берган қарзлар учун талаб юбориш мумкин',
    tooMany: 'Жуда кўп уриниш. Бироздан сўнг қайта уриниб кўринг.', generic: 'Хатолик юз берди',
  },
  en: {
    ok: 'Demand sent and SMS delivered', okTo: 'Demand sent. SMS sent to {p}.',
    staffNote: 'The shop card is not set — a general text will be sent in the SMS. Only the shop owner can add the card.',
    noShopNote: 'The shop card was not found — a general text will be sent in the SMS.',
    saved: 'Card saved', saveErr: 'Could not save. Please try again.',
    errBoth: 'Enter both the card number and the phone number — you cannot save only one of them.',
    noPhone: "The customer's phone number is not entered. Add a phone number first.",
    noPkg: 'Your SMS package has run out. Buy a package in the Pricing section.',
    notActive: 'This debt is not active', wrongType: 'A demand can only be sent for debts you gave',
    tooMany: 'Too many attempts. Please try again later.', generic: 'An error occurred',
  },
  kaa: {
    ok: 'Talap jiberildi hám SMS jetkerildi', okTo: 'Talap jiberildi. SMS {p} nomerine jiberildi.',
    staffNote: 'Dúkan kartası kiritilmegen — SMS-te ulıwma tekst jiberiledi. Kartanı tek dúkan iyesi kirite aladı.',
    noShopNote: 'Dúkan kartası tabılmadı — SMS-te ulıwma tekst jiberiledi.',
    saved: 'Karta saqlandı', saveErr: 'Saqlap bolmadı. Qayta urınıp kóriń.',
    errBoth: 'Karta nomerin hám telefon nomerin ekewin de kiritiń — tek birewin saqlawǵa bolmaydı.',
    noPhone: 'Klienttiń telefon nomeri kiritilmegen. Aldın telefon nomerin qosıń.',
    noPkg: 'SMS paketińiz tamamlanǵan. Tarifler bóliminen paket satıp alıń.',
    notActive: 'Bul qarız aktiv emes', wrongType: 'Tek siz bergen qarızlar ushın talap jiberiw múmkin',
    tooMany: 'Júdá kóp urınıw. Birazdan soń qayta urınıp kóriń.', generic: 'Qátelik júz berdi',
  },
}

export default {
  data() {
    return {
      qt: {
        open: false, key: 0, busy: false, checking: false, savingCard: false,
        qarz: null, shop: null, card: null, staff: false, startEdit: false, loadFailed: false,
      },
    }
  },
  computed: {
    qtTx() { return TX[(this.$i18n && this.$i18n.locale) || 'uz'] || TX.uz },
    qtBusy() { return this.qt.busy || this.qt.checking },
    qtModalProps() {
      const qt = this.qt
      const q = qt.qarz || {}
      const mijoz = (this.data && this.data.mijoz) || {}
      const store = (qt.shop && qt.shop.nomi) || q.savdo_faoliyat_nomi || ''
      let noCardNote = ''
      if (!qt.card) noCardNote = qt.staff ? this.qtTx.staffNote : (qt.loadFailed || !qt.shop ? this.qtTx.noShopNote : '')
      return {
        card: qt.card,
        recipientName: String(mijoz.fish || '').trim(),
        recipientPhone: mijoz.telefon || '',
        preview: buildQarzTalabPreview({ store, amount: q.qoldiq != null ? q.qoldiq : q.miqdor, valyuta: q.valyuta }, qt.card),
        busy: qt.busy,
        canChangeCard: !qt.staff && !!qt.shop,
        inlineEdit: true,
        tgRequired: true,
        startInEdit: qt.startEdit,
        savingCard: qt.savingCard,
        noCardNote,
      }
    },
  },
  methods: {
    /** Do'kon EGASI emasmi (xodim sessiyasi / telefon bo'yicha xodim / begona do'kon) */
    qtIsStaff(qarz, shop) {
      const u = (this.$auth && this.$auth.user) || {}
      if (u.is_xodim || u.role === 'xodim') return true
      if (shop && shop.is_xodim_role) return true
      return !!(qarz && qarz.user_id && u.id && Number(qarz.user_id) !== Number(u.id))
    },
    /** GET /qarz-daftari/savdo-faoliyat → shu qarz do'koni (yoki null). Tarmoq xatosi — throw. */
    async qtLoadShop(faoliyatId) {
      if (faoliyatId == null) return null
      const res = await this.$axios.$get('/qarz-daftari/savdo-faoliyat', { silent: true })
      const list = res && Array.isArray(res.data) ? res.data : []
      return list.find((f) => String(f.id) === String(faoliyatId)) || null
    },
    /** Do'kon rekviziti — karta VA Telegram telefoni bo'lsagina (backend juftlik qoidasi) */
    qtCardOf(shop) {
      const number = normCard(shop && shop.karta_raqami)
      const tg = normUzPhone(shop && shop.telegram_telefon)
      if (!number || !tg) return null
      return { number, holder: String((shop && shop.karta_egasi) || '').trim(), telegramPhone: tg }
    },
    qtOpen(startEdit) {
      this.qt.startEdit = !!startEdit
      this.qt.key += 1 // oyna qayta yaratiladi (startInEdit — faqat ochilishda o'qiladi)
      this.qt.open = true
    },

    /** "Talab qilish" bosildi */
    async qtStart(qarz) {
      if (!qarz || this.qtBusy || this.qt.open) return
      // Tarif — do'kon EGASINIKI: xodim kontekstida o'z tarifimiz bo'yicha qulflamaymiz (`talabLocked`)
      if (this.talabLocked) { this.showUpgradeModal('manual_sms_send'); return }
      this.qt.qarz = qarz
      this.qt.checking = true
      try {
        let shop = null
        let failed = false
        try { shop = await this.qtLoadShop(qarz.savdo_faoliyat_id) } catch (_) { failed = true }
        this.qt.shop = shop
        this.qt.loadFailed = failed
        this.qt.card = this.qtCardOf(shop)
        this.qt.staff = this.qtIsStaff(qarz, shop)
        // Karta yo'q va egasi (do'kon topildi) — avval karta formasi; aks holda darhol tasdiq
        this.qtOpen(!this.qt.card && !this.qt.staff && !!shop)
      } finally { this.qt.checking = false }
    },

    qtClose() {
      if (this.qt.busy || this.qt.savingCard) return
      this.qt.open = false
    },

    /** Inline karta formasi → PUT /qarz-daftari/savdo-faoliyat/:id (karta + telefon BIRGA) */
    async qtSaveCard(payload, done) {
      const shop = this.qt.shop
      if (!shop || this.qt.savingCard) { if (done) done(false); return }
      this.qt.savingCard = true
      try {
        const body = {
          nomi: shop.nomi,
          karta_raqami: payload.card_number,
          karta_egasi: payload.card_holder || '',
          telegram_telefon: payload.telegram_phone || '',
        }
        await this.$axios.$put(`/qarz-daftari/savdo-faoliyat/${shop.id}`, body, { silent: true })
        const next = { ...shop, karta_raqami: body.karta_raqami, karta_egasi: body.karta_egasi, telegram_telefon: body.telegram_telefon }
        this.qt.shop = next
        this.qt.card = this.qtCardOf(next)
        this.$toast && this.$toast.success && this.$toast.success(this.qtTx.saved)
        if (done) done(true)
      } catch (e) {
        const d = (e && e.response && e.response.data) || {}
        const msg = d.code === 'card-and-phone-required' ? this.qtTx.errBoth : (d.message || this.qtTx.saveErr)
        this.$toast && this.$toast.error && this.$toast.error(msg)
        if (done) done(false)
      } finally { this.qt.savingCard = false }
    },

    /** "Ha, yuborish" — POST /qarz-daftari/qarz/:id/talab */
    async qtConfirm() {
      const q = this.qt.qarz
      if (!q || this.qt.busy) return
      this.qt.busy = true
      try {
        const res = await this.$axios.$post(`/qarz-daftari/qarz/${q.id}/talab`, {}, { silent: true })
        this.qt.open = false
        const phone = (res && res.data && res.data.phone) || ''
        const masked = phone ? String(phone).replace(/^(\+?\d{4})\d+(\d{2})$/, '$1***$2') : ''
        this.$toast && this.$toast.success && this.$toast.success(masked ? this.qtTx.okTo.replace('{p}', masked) : this.qtTx.ok)
      } catch (e) {
        this.qt.open = false
        this.qtHandleError(e)
      } finally { this.qt.busy = false }
    },

    qtHandleError(e) {
      // 02.10: tarif cheklovi — taklifni plugins/axios.js ko'rsatdi (xato toast'i/yo'naltirish YO'Q)
      if (isPlanRequiredError(e)) return
      const r = (e && e.response) || null
      const d = (r && r.data) || {}
      const tx = this.qtTx
      // Eski backend (428 no-card): egasi bo'lsa — karta formasi
      if (d.code === 'no-card') {
        if (d.can_set_card && this.qt.shop && !this.qt.staff) { this.qtOpen(true); return }
        this.$toast && this.$toast.error && this.$toast.error(tx.staffNote)
        return
      }
      const map = { 'no-phone': tx.noPhone, 'no-sms-package': tx.noPkg, 'sms-failed': tx.noPkg, 'not-active': tx.notActive, 'wrong-type': tx.wrongType }
      let msg = tx.generic
      if (r && r.status === 429) msg = tx.tooMany
      else if (d.code === 'sms-not-sent' && d.message) msg = d.message
      else if (d.code && map[d.code]) msg = map[d.code]
      else if (d.message) msg = d.message
      this.$toast && this.$toast.error && this.$toast.error(msg)
      const reason = d.reason || (d.sms && d.sms.reason)
      if (d.code === 'no-sms-package' || d.code === 'sms-failed' || (r && r.status === 402) || reason === 'NO_PACKAGE') {
        this.$router.push(this.localePath({ name: 'price' }))
      }
    },
  },
}
