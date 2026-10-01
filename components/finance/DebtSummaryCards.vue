<template>
  <!-- 30.09 (doc1 15-rasm): Berilgan/Olingan qarzlar SVODI — qancha berilgan (olingan), qanchasi
       qaytarilgan va qanchasi hali jarayonda. Valyutalar alohida qatorda. Ranglar inline
       (Tailwind v2 JIT o'chiq — dinamik klasslar generatsiya qilinmaydi). -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <!-- Jami -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :style="'background:' + tone.soft + ';color:' + tone.fg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" :d="side === 'borrowed' ? 'M19 14l-7 7m0 0l-7-7m7 7V3' : 'M5 10l7-7m0 0l7 7m-7-7v18'"/></svg>
        </span>
        <p class="text-xs font-semibold text-gray-500 leading-tight">{{ side === 'borrowed' ? t.totalTaken : t.totalGiven }}</p>
      </div>
      <p v-for="r in summary.rows" :key="'t' + r.currency" class="text-lg font-bold text-gray-900 leading-tight">{{ money(r.total, r.currency) }}</p>
      <p class="text-xs text-gray-400 mt-1">{{ summary.count }} {{ t.countSuffix }}</p>
      <p v-for="r in (closedOnly ? [] : forgivenRows)" :key="'f' + r.currency" class="text-xs mt-0.5" style="color:#BE123C">{{ t.forgiven }}: {{ money(r.forgiven, r.currency) }}</p>
    </div>

    <!-- Qaytarilgan -->
    <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:#DCFCE7;color:#15803D">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
        </span>
        <p class="text-xs font-semibold text-gray-500 leading-tight">{{ t.returned }}</p>
      </div>
      <div v-for="r in summary.rows" :key="'p' + r.currency" class="mb-1">
        <p class="text-lg font-bold leading-tight" style="color:#16A34A">{{ money(r.paid, r.currency) }}</p>
        <div class="w-full rounded-full mt-1" style="height:6px;background:#F3F4F6">
          <div class="rounded-full" :style="'height:6px;background:#22C55E;width:' + pct(r) + '%'"></div>
        </div>
      </div>
      <p class="text-xs text-gray-400 mt-1">{{ summary.closedCount }} {{ t.closedSuffix }}</p>
    </div>

    <!-- Jarayonda (01.10, doc3 3-rasm: `closedOnly` — yakunlangan qarzlar hisobotida o'rniga "Voz kechilgan") -->
    <div v-if="closedOnly" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:#FFE4E6;color:#BE123C">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
        </span>
        <p class="text-xs font-semibold text-gray-500 leading-tight">{{ t.forgiven }}</p>
      </div>
      <p v-for="r in summary.rows" :key="'fz' + r.currency" class="text-lg font-bold leading-tight" style="color:#BE123C">{{ money(r.forgiven, r.currency) }}</p>
      <p class="text-xs text-gray-400 mt-1">{{ summary.forgivenCount || 0 }} {{ t.countSuffix }}</p>
    </div>
    <div v-else class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div class="flex items-center gap-2 mb-2">
        <span class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:#FEF3C7;color:#B45309">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </span>
        <p class="text-xs font-semibold text-gray-500 leading-tight">{{ t.inProgress }}</p>
      </div>
      <p v-for="r in summary.rows" :key="'l' + r.currency" class="text-lg font-bold leading-tight" :style="'color:' + tone.fg">{{ money(r.left, r.currency) }}</p>
      <p class="text-xs text-gray-400 mt-1">{{ summary.openCount }} {{ t.openSuffix }}</p>
    </div>
  </div>
</template>

<script>
import { formatMoneyCur } from '~/utils/helpers'

/**
 * DebtSummaryCards — shaxsiy qarzlar svodi (3 karta).
 * Props:
 *   - summary: `summarizeDebts()` natijasi (utils/debtSummary.js)
 *   - side:    'lent' (berilgan) | 'borrowed' (olingan) — sarlavha va rang
 *   - closedOnly: 3-karta "Jarayonda" o'rniga "Voz kechilgan" (yakunlangan qarzlar hisoboti)
 */
export default {
  name: 'DebtSummaryCards',
  props: {
    summary: { type: Object, required: true },
    side: { type: String, default: 'lent' },
    // 01.10 (doc3 3-rasm): faqat yakunlangan (tugallangan + voz kechilgan) qarzlar — 3-karta "Voz kechilgan"
    closedOnly: { type: Boolean, default: false },
  },
  computed: {
    t() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      const all = {
        uz: { totalGiven: 'Jami berilgan', totalTaken: 'Jami olingan', returned: 'Qaytarilgan', inProgress: 'Jarayonda (qoldiq)', forgiven: 'Voz kechilgan', countSuffix: 'ta qarz', closedSuffix: 'ta yopilgan', openSuffix: 'ta faol' },
        ru: { totalGiven: 'Всего выдано', totalTaken: 'Всего получено', returned: 'Возвращено', inProgress: 'В процессе (остаток)', forgiven: 'Прощено', countSuffix: 'долгов', closedSuffix: 'закрыто', openSuffix: 'активных' },
        kr: { totalGiven: 'Жами берилган', totalTaken: 'Жами олинган', returned: 'Қайтарилган', inProgress: 'Жараёнда (қолдиқ)', forgiven: 'Воз кечилган', countSuffix: 'та қарз', closedSuffix: 'та ёпилган', openSuffix: 'та фаол' },
        en: { totalGiven: 'Total given', totalTaken: 'Total received', returned: 'Returned', inProgress: 'In progress (remaining)', forgiven: 'Waived', countSuffix: 'debt(s)', closedSuffix: 'closed', openSuffix: 'active' },
        kaa: { totalGiven: 'Jámi berilgen', totalTaken: 'Jámi alınǵan', returned: 'Qaytarılǵan', inProgress: 'Processte (qaldıq)', forgiven: 'Waz keshilgen', countSuffix: 'qarız', closedSuffix: 'jabılǵan', openSuffix: 'aktiv' },
      }
      return all[l] || all.uz
    },
    tone() {
      return this.side === 'borrowed'
        ? { soft: '#FEE2E2', fg: '#DC2626' }
        : { soft: '#DBEAFE', fg: '#2563EB' }
    },
    forgivenRows() {
      return (this.summary.rows || []).filter((r) => r.forgiven > 0.5)
    },
  },
  methods: {
    money(v, cur) { return formatMoneyCur(v, cur) },
    pct(r) {
      if (!(r.total > 0)) return 0
      return Math.min(100, Math.max(0, Math.round((r.paid / r.total) * 100)))
    },
  },
}
</script>
