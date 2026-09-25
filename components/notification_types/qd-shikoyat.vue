<template>
  <div>
    <p class="text-gray-700 mb-2">
      <b>⚠️ {{ t.title }}</b>
    </p>

    <p class="text-gray-700">
      <b>{{ who }}</b>
      <span v-if="item.sh_phone" class="text-gray-500"> · {{ item.sh_phone }}</span>
      — {{ t.about }} <b>{{ item.sh_store || t.shop }}</b>
      <span v-if="amount"> ({{ t.remaining }}: <b>{{ amount }}</b>)</span>:
    </p>
    <p class="mt-2 px-3 py-2 rounded-lg bg-rose-50 text-rose-800 font-semibold">«{{ reasonText }}»</p>
    <p v-if="item.sh_izoh" class="mt-1 text-sm text-gray-600 italic">{{ item.sh_izoh }}</p>

    <div class="notification-actions">
      <div>
        <span><b>{{ $t('comp.time') }}:</b> {{ item.created }} {{ item && item.time ? item.time.slice(0, 5) : '' }}</span>
      </div>
      <div class="notification-actions__buttons">
        <button
          v-if="item.sh_qarz_id"
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
 * qd-shikoyat.vue — SS-DEV (2026-09-24): Qarz daftari (do'kon) qarzi bo'yicha
 * QARZDORNING SHIKOYATI (type = 42). Qarzdor "Shaxsiy qarz" bo'limida do'kon
 * qarzini ochib "Shikoyat qilish"ni bosganda do'kon egasiga shu karta keladi.
 * Tugmalar: "Qarzga o'tish" (qarz daftari sahifasi) va "Ok" (o'qildi).
 */
import notificationMixin from '~/mixins/notificationMixin'

const REASONS = {
  not_taken: { uz: 'Men qarz olmaganman', ru: 'Я не брал(а) долг', kr: 'Мен қарз олмаганман', en: "I did not take the debt", kaa: "Men qarız almaǵanman" },
  fully_paid: { uz: "Qarzimni to'liq qaytarganman", ru: 'Я полностью вернул(а) долг', kr: 'Қарзимни тўлиқ қайтарганман', en: "I have fully repaid the debt", kaa: "Qarızımdı tolıq qaytarǵanman" },
  partly_paid: { uz: 'Qarzimni bir qismini qaytarganman', ru: 'Я вернул(а) часть долга', kr: 'Қарзимнинг бир қисмини қайтарганман', en: "I have repaid part of the debt", kaa: "Qarızımnıń bir bólegin qaytarǵanman" },
  // SS-DEV (2026-09-24): sabab tanlanmasdan faqat izoh bilan yuborilgan shikoyat
  other: { uz: 'Boshqa sabab (izohga qarang)', ru: 'Другая причина (см. комментарий)', kr: 'Бошқа сабаб (изоҳга қаранг)', en: "Other reason (see comment)", kaa: "Basqa sebep (túsinikke qarań)" },
}

export default {
  name: 'QdShikoyat',
  mixins: [notificationMixin],
  computed: {
    loc() { return (this.$i18n && this.$i18n.locale) || 'uz' },
    t() {
      const m = {
        uz: { title: "Qarz bo'yicha shikoyat", about: 'do‘kondagi qarzi bo‘yicha', shop: "Do'kon", remaining: 'qoldiq', goDebt: "Qarzga o'tish" },
        ru: { title: 'Жалоба по долгу', about: 'по долгу в магазине', shop: 'Магазин', remaining: 'остаток', goDebt: 'Перейти к долгу' },
        kr: { title: 'Қарз бўйича шикоят', about: 'дўкондаги қарзи бўйича', shop: 'Дўкон', remaining: 'қолдиқ', goDebt: 'Қарзга ўтиш' },
        // SS-DEV (2026-09-26): en/kaa
        en: { title: "Complaint about a debt", about: 'regarding the debt at the shop', shop: "Shop", remaining: 'remaining', goDebt: "Go to the debt" },
        kaa: { title: "Qarız boyınsha shaǵım", about: 'dúkandaǵı qarızı boyınsha', shop: "Dúkan", remaining: 'qaldıq', goDebt: "Qarızǵa ótiw" },
      }
      return m[this.loc] || m.uz
    },
    who() {
      const it = this.item || {}
      const n = [it.d_last_name, it.d_first_name].filter(Boolean).join(' ').trim()
      return n || it.sh_mijoz || '—'
    },
    amount() {
      const it = this.item || {}
      const v = it.sh_qoldiq != null ? it.sh_qoldiq : it.sh_miqdor
      if (v == null) return ''
      return Number(v).toLocaleString('uz-UZ').replace(/,/g, ' ') + ' ' + (it.sh_valyuta || 'UZS')
    },
    reasonText() {
      const r = REASONS[(this.item && this.item.sh_reason) || ''] || REASONS.not_taken
      return r[this.loc] || r.uz
    },
  },
  methods: {
    goToDebt() {
      this.$router.push(this.localePath({ name: 'qarz-daftari-qarz-id', params: { id: this.item.sh_qarz_id } }))
    },
  },
}
</script>
