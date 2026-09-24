<template>
  <div>
    <p class="text-gray-700 mb-2">
      <b>⚠️ {{ t.title }}</b>
    </p>

    <p class="text-gray-700">
      <b>{{ who }}</b>
      <span v-if="item.pc_phone" class="text-gray-500"> · {{ formatPhone(item.pc_phone) }}</span>
      — {{ t.about }}
      <span v-if="amount"> ({{ t.remaining }}: <b>{{ amount }}</b>)</span>:
    </p>
    <p class="mt-2 px-3 py-2 rounded-lg bg-rose-50 text-rose-800 font-semibold">«{{ reasonText }}»</p>
    <p v-if="item.pc_izoh" class="mt-1 text-sm text-gray-600 italic">{{ item.pc_izoh }}</p>

    <div class="notification-actions">
      <div>
        <span><b>{{ $t('comp.time') }}:</b> {{ item.created }} {{ item && item.time ? item.time.slice(0, 5) : '' }}</span>
      </div>
      <div class="notification-actions__buttons">
        <button
          v-if="item.pc_debt_id"
          @click="goToDebt"
          class="bg-amber-500 hover:bg-amber-600 py-1 px-4 mx-2 rounded text-white"
        >
          {{ t.goDebt }}
        </button>
        <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
          Ok
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * pd-shikoyat.vue — SS-DEV (2026-09-24): SHAXSIY (odam-odam) qarz bo'yicha
 * QARZDORNING SHIKOYATI (type = 43). Qarzdor "Shaxsiy qarz" bo'limida hamkor
 * qaydini (unga yozilgan qarzni) ochib "Shikoyat qilish"ni bosganda qarz
 * bergan odamga shu karta keladi. Tugmalar: "Qarzga o'tish" / "Ok".
 * (Do'kon qarzi uchun `qd-shikoyat.vue`, type = 42.)
 */
import notificationMixin from '~/mixins/notificationMixin'

const REASONS = {
  not_taken: { uz: 'Men qarz olmaganman', ru: 'Я не брал(а) долг', kr: 'Мен қарз олмаганман' },
  fully_paid: { uz: "Qarzimni to'liq qaytarganman", ru: 'Я полностью вернул(а) долг', kr: 'Қарзимни тўлиқ қайтарганман' },
  partly_paid: { uz: 'Qarzimni bir qismini qaytarganman', ru: 'Я вернул(а) часть долга', kr: 'Қарзимнинг бир қисмини қайтарганман' },
  // SS-DEV (2026-09-24): sabab tanlanmasdan faqat izoh bilan yuborilgan shikoyat
  other: { uz: 'Boshqa sabab (izohga qarang)', ru: 'Другая причина (см. комментарий)', kr: 'Бошқа сабаб (изоҳга қаранг)' },
}

export default {
  name: 'PdShikoyat',
  mixins: [notificationMixin],
  computed: {
    loc() { return (this.$i18n && this.$i18n.locale) || 'uz' },
    t() {
      const m = {
        uz: { title: "Shaxsiy qarz bo'yicha shikoyat", about: 'siz yozgan qarz bo‘yicha', remaining: 'qoldiq', goDebt: "Qarzga o'tish" },
        ru: { title: 'Жалоба по личному долгу', about: 'по записанному вами долгу', remaining: 'остаток', goDebt: 'Перейти к долгу' },
        kr: { title: 'Шахсий қарз бўйича шикоят', about: 'сиз ёзган қарз бўйича', remaining: 'қолдиқ', goDebt: 'Қарзга ўтиш' },
      }
      return m[this.loc] || m.uz
    },
    who() {
      const it = this.item || {}
      const n = [it.d_last_name, it.d_first_name].filter(Boolean).join(' ').trim()
      return n || it.pc_source_name || '—'
    },
    amount() {
      const it = this.item || {}
      const v = it.pc_remaining != null ? it.pc_remaining : it.pc_amount
      if (v == null) return ''
      return Number(v).toLocaleString('uz-UZ').replace(/,/g, ' ') + ' ' + (it.pc_currency || 'UZS')
    },
    reasonText() {
      const r = REASONS[(this.item && this.item.pc_reason) || ''] || REASONS.not_taken
      return r[this.loc] || r.uz
    },
  },
  methods: {
    formatPhone(p) {
      const d = String(p || '').replace(/\D/g, '')
      const r = d.startsWith('998') ? d.slice(3) : d
      if (r.length >= 9) return `+998 ${r.slice(0, 2)} ${r.slice(2, 5)} ${r.slice(5, 7)} ${r.slice(7, 9)}`
      return p
    },
    goToDebt() {
      this.$router.push(this.localePath({ name: 'finance-debts-id', params: { id: this.item.pc_debt_id } }))
    },
  },
}
</script>
