/**
 * wave D: pages/finance/index.vue dan ajratilgan sof formatlash/yordamchi metodlar.
 * Metodlar sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
import { formatDateLocale } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar

export default {
  methods: {
    // Valyuta bo'yicha summalar -> ["300 000 UZS", "100 USD"] (UZS birinchi/tepada)
    currencyTotals(arr) {
      const list = (arr || []).filter(x => Number(x.total))
      if (!list.length) {return ['0 UZS']}
      list.sort((a, b) => (a.currency === 'UZS' ? -1 : b.currency === 'UZS' ? 1 : 0))
      return list.map(x => this.formatMoney(x.total, x.currency))
    },

    // Summani UZS'ga aylantirish (diagramma nisbatlari uchun)
    toUzs(total, currency) {
      const t = parseFloat(total) || 0
      const rate = this.dashboard.usd_rate || 12500
      return String(currency || 'UZS').toUpperCase() === 'USD' ? Math.round(t * rate) : Math.round(t)
    },

    // Y-o'qi uchun qisqa raqam: 1.2M, 350K
    shortNum(v) {
      const n = Number(v) || 0
      if (Math.abs(n) >= 1000000) {return (n / 1000000).toFixed(1) + 'M'}
      if (Math.abs(n) >= 1000) {return Math.round(n / 1000) + 'K'}
      return String(Math.round(n))
    },

    // Karta uchun yaxlitlangan qisqa summa (Qarz daftari uslubida): 1 000 000 → 1M, 1000 → 1K
    formatCompact(v) {
      const n = Math.round(Number(v) || 0)
      const abs = Math.abs(n)
      if (abs >= 1000000) {
        const m = n / 1000000
        return (Number.isInteger(m) ? m : m.toFixed(1)) + 'M UZS'
      }
      if (abs >= 1000) {
        const k = n / 1000
        return (Number.isInteger(k) ? k : k.toFixed(1)) + 'K UZS'
      }
      return n.toLocaleString('uz-UZ').replace(/,/g,' ') + ' UZS'
    },

    // R2: "2 M 500 K" ko'rinishidagi ixcham format (million + ming qismlar alohida).
    // Manfiy: "-2 M 783 K". 1000dan kichik: raqamning o'zi. UZS belgisi shablonda alohida.
    formatMK(v) {
      let n = Math.round(Number(v) || 0)
      const sign = n < 0 ? '-' : ''
      const abs = Math.abs(n)
      let m = Math.floor(abs / 1000000)
      let k = Math.round((abs % 1000000) / 1000)
      if (k === 1000) { m += 1; k = 0 } // yaxlitlash toshib ketsa
      let core
      if (m > 0 && k > 0) {core = `${m} M ${k} K`}
      else if (m > 0) {core = `${m} M`}
      else if (abs >= 1000) {core = `${k} K`}
      else {core = String(abs)}
      return sign + core
    },

    // Amal manbasi (web/mobile/telegram) yorlig'i, emoji va rangi
    sourceLabel(s) {
      const map = { web: this.$t('finance.source_web'), mobile: this.$t('finance.source_mobile'), telegram: this.$t('finance.source_telegram') }
      return map[s] || this.$t('finance.source_web')
    },
    sourceEmoji(s) {
      return { web: '🌐', mobile: '📱', telegram: '✈️' }[s] || '🌐'
    },
    sourceBadgeClass(s) {
      return {
        web: 'bg-blue-50 text-blue-600',
        mobile: 'bg-green-50 text-green-600',
        telegram: 'bg-sky-50 text-sky-600'
      }[s] || 'bg-gray-100 text-gray-500'
    },

    // Vaqt (soat:daqiqa, Toshkent +05) — created_at dan
    formatTime(dt) {
      if (!dt) {return ''}
      const d = new Date(dt)
      if (isNaN(d)) {return ''}
      try {
        return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tashkent' })
      } catch (e) {
        return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      }
    },

    // Sana kalitini LOKAL vaqt bo'yicha oladi (UTC siljishi tufayli sana bir kun
    // orqaga ketishini oldini oladi — analitika bilan mos bo'lishi uchun)
    localDateKey(d) {
      if (!d) {return ''}
      const dt = new Date(d)
      if (isNaN(dt)) {return String(d).split('T')[0]}
      const y = dt.getFullYear()
      const m = String(dt.getMonth() + 1).padStart(2, '0')
      const day = String(dt.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    },

    formatDate: formatDateLocale, // SS-AUDIT (2026-09-25): utils/helpers (Safari-xavfsiz parse)
  },
};
