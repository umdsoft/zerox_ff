<template>
  <!-- 21.10 (egasi hujjati): "Moliyaviy sog'liq" — ball NIMA UCHUN shunday ekanini tushuntiruvchi sahifa.
       Barcha hisob backendda (GET /home/financial-health) — bu yerda faqat ko'rsatish. -->
  <div class="fh-page pb-8">
    <div class="mb-5">
      <div class="flex items-center gap-3">
        <PageBackButton :to="localePath({ name: 'index' })" />
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('fin_health.title') }}</h1>
      </div>
      <p class="text-gray-500 mt-1">{{ $t('fin_health.subtitle') }}</p>
    </div>

    <div v-if="loading && !data" class="bg-white rounded-2xl p-12 shadow-sm text-center text-gray-400">
      {{ $t('common.loading') }}
    </div>

    <div v-else-if="error && !data" class="bg-white rounded-2xl p-10 shadow-sm text-center">
      <p class="text-gray-600 mb-4">{{ $t('fin_health.load_error') }}</p>
      <button type="button" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold" @click="load">
        {{ $t('fin_health.retry') }}
      </button>
    </div>

    <template v-else-if="data">
      <!-- HERO: katta ball + holat -->
      <section class="fh-hero rounded-2xl p-5 lg:p-7 text-white relative overflow-hidden mb-5" :class="'fh-hero--' + data.status">
        <div class="fh-hero__glow"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div class="fh-ring flex-shrink-0">
            <svg viewBox="0 0 120 120" class="fh-ring__svg" aria-hidden="true">
              <circle cx="60" cy="60" r="52" class="fh-ring__track" />
              <circle cx="60" cy="60" r="52" class="fh-ring__value" :style="ringStyle" />
            </svg>
            <div class="fh-ring__label">
              <span class="fh-ring__score">{{ data.score == null ? '—' : data.score }}</span>
              <span class="fh-ring__max">/100</span>
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium fh-muted uppercase tracking-wide">{{ $t('fin_health.title') }}</p>
            <p class="text-3xl lg:text-4xl font-extrabold mt-1">{{ data.statusText }}</p>
            <div v-if="data.components.length" class="flex flex-wrap gap-2 mt-4">
              <span v-for="c in data.components" :key="'chip-' + c.key" class="fh-chip inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm">
                <span class="fh-chip__dot" :class="'fh-dot--' + c.key"></span>
                {{ c.title }}
                <b class="ml-1">{{ fmt(c.points) }}/{{ fmt(c.maxPoints) }}</b>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Qanday hisoblanadi -->
      <section class="bg-blue-50 border border-blue-100 rounded-2xl p-4 lg:p-5 mb-6 flex gap-3">
        <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <div>
          <h2 class="font-bold text-gray-900">{{ $t('fin_health.how_title') }}</h2>
          <p class="text-gray-700 text-sm mt-1 leading-relaxed">{{ $t('fin_health.how_text') }}</p>
        </div>
      </section>

      <!-- Modullar bo'yicha -->
      <h2 v-if="data.components.length" class="text-lg font-bold text-gray-900 mb-3">{{ $t('fin_health.breakdown') }}</h2>
      <div v-if="data.components.length" class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <article v-for="c in data.components" :key="c.key" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <header class="px-5 pt-5 pb-4">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <span class="fh-mod-icon w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="'fh-mod-icon--' + c.key">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="moduleIcon(c.key)"/></svg>
                </span>
                <div class="min-w-0">
                  <h3 class="font-bold text-gray-900 truncate">{{ c.title }}</h3>
                  <p class="text-xs text-gray-500">{{ $t('fin_health.weight') }}: {{ c.weight }}</p>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-2xl font-extrabold text-gray-900 leading-none">{{ fmt(c.points) }}<span class="text-sm font-semibold text-gray-400">/{{ fmt(c.maxPoints) }}</span></p>
                <p class="text-xs text-gray-500 mt-1">{{ $t('fin_health.points') }}</p>
              </div>
            </div>
            <div class="fh-bar mt-4">
              <div class="fh-bar__fill" :class="barClass(c.percent)" :style="{ width: Math.max(2, c.percent) + '%' }"></div>
            </div>
          </header>
          <ul class="divide-y divide-gray-100 border-t border-gray-100">
            <li v-for="d in c.details" :key="d.key" class="px-5 py-3.5 flex items-start gap-3">
              <span class="fh-impact flex-shrink-0 mt-0.5" :class="'fh-impact--' + d.impact">{{ impactText(d) }}</span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p class="font-semibold text-gray-900">{{ d.label }}</p>
                  <p class="text-sm font-semibold" :class="valueClass(d.impact)">{{ d.value }}</p>
                </div>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{ d.explanation }}</p>
              </div>
            </li>
          </ul>
          <footer class="px-5 py-3 bg-gray-50">
            <nuxt-link :to="localePath({ name: moduleRoute(c.key) })" class="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
              {{ $t('fin_health.open_module') }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </nuxt-link>
          </footer>
        </article>
      </div>

      <!-- Maslahatlar -->
      <section v-if="data.tips && data.tips.length" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          {{ $t('fin_health.tips') }}
        </h2>
        <ol class="space-y-2.5">
          <li v-for="(tip, i) in data.tips" :key="tip.key" class="flex items-start gap-3">
            <span class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{{ i + 1 }}</span>
            <p class="text-gray-700 leading-relaxed">{{ tip.text }}</p>
          </li>
        </ol>
      </section>
    </template>
  </div>
</template>

<script>
import PageBackButton from '@/components/ui/PageBackButton.vue'
import { getFinancialHealth } from '@/api/home';

const RING_LEN = 2 * Math.PI * 52
const MODULE_ROUTES = { contracts: 'contract-dashboard', shop: 'qarz-daftari', personal: 'finance-debts', finance: 'finance' }
const MODULE_ICONS = {
  contracts: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  shop: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  personal: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  finance: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

export default {
  name: 'FinancialHealth',
  components: { PageBackButton },
  middleware: 'auth',

  data() {
    return { data: null, loading: true, error: false }
  },

  head() {
    return { title: this.$t('fin_health.title') }
  },

  computed: {
    ringStyle() {
      const score = this.data && this.data.score != null ? this.data.score : 0
      const filled = (Math.max(0, Math.min(100, score)) / 100) * RING_LEN
      return { strokeDasharray: `${filled} ${RING_LEN}` }
    },
  },

  watch: {
    '$i18n.locale'() { this.load() },
  },

  mounted() {
    this.load()
  },

  methods: {
    async load() {
      this.loading = true
      this.error = false
      try {
        const res = await getFinancialHealth(this.$axios, { params: { lang: this.$i18n.locale } })
        if (res && res.success && res.data) {
          this.data = { ...res.data, components: res.data.components || [], tips: res.data.tips || [] }
        } else {
          this.error = true
        }
      } catch (e) {
        this.error = true
      } finally {
        this.loading = false
      }
    },
    fmt(v) {
      const n = Number(v) || 0
      const s = Number.isInteger(n) ? String(n) : n.toFixed(1)
      return this.$i18n.locale === 'en' ? s : s.replace('.', ',')
    },
    impactText(d) {
      if (d.impact === 'negative') return '−' + this.fmt(d.lost)
      if (d.impact === 'positive') return '+' + this.fmt(d.points)
      return '+' + this.fmt(d.points)
    },
    valueClass(impact) {
      if (impact === 'negative') return 'text-red-600'
      if (impact === 'positive') return 'text-green-600'
      return 'text-gray-500'
    },
    barClass(percent) {
      if (percent >= 85) return 'fh-bar__fill--good'
      if (percent >= 50) return 'fh-bar__fill--mid'
      return 'fh-bar__fill--bad'
    },
    moduleRoute(key) { return MODULE_ROUTES[key] || 'index' },
    moduleIcon(key) { return MODULE_ICONS[key] || MODULE_ICONS.finance },
  },
}
</script>

<style scoped>
/* Tailwind v2 (JIT off) — maxsus ranglar/o'lchamlar shu yerda */
.fh-hero { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 45%, #3730a3 100%); box-shadow: 0 18px 40px -18px rgba(37, 99, 235, 0.55); }
.fh-hero--excellent { background: linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%); box-shadow: 0 18px 40px -18px rgba(5, 150, 105, 0.55); }
.fh-hero--fair { background: linear-gradient(135deg, #f59e0b 0%, #d97706 55%, #b45309 100%); box-shadow: 0 18px 40px -18px rgba(217, 119, 6, 0.55); }
.fh-hero--poor { background: linear-gradient(135deg, #e11d48 0%, #be123c 55%, #9f1239 100%); box-shadow: 0 18px 40px -18px rgba(225, 29, 72, 0.55); }
.fh-hero--no_data { background: linear-gradient(135deg, #64748b 0%, #475569 100%); }
.fh-hero__glow { position: absolute; width: 320px; height: 320px; right: -80px; top: -140px; border-radius: 9999px; background: rgba(255, 255, 255, 0.09); }
.fh-muted { color: rgba(255, 255, 255, 0.8); }

.fh-ring { position: relative; width: 132px; height: 132px; }
.fh-ring__svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.fh-ring__track { fill: none; stroke: rgba(255, 255, 255, 0.2); stroke-width: 10; }
.fh-ring__value { fill: none; stroke: #ffffff; stroke-width: 10; stroke-linecap: round; transition: stroke-dasharray 0.6s ease; }
.fh-ring__label { position: absolute; inset: 0; display: flex; align-items: baseline; justify-content: center; padding-top: 44px; }
.fh-ring__score { font-size: 40px; font-weight: 800; line-height: 1; }
.fh-ring__max { font-size: 14px; font-weight: 600; opacity: 0.8; margin-left: 2px; }

.fh-chip { background: rgba(255, 255, 255, 0.16); border: 1px solid rgba(255, 255, 255, 0.24); }
.fh-chip__dot { width: 8px; height: 8px; border-radius: 9999px; display: inline-block; }
.fh-dot--contracts { background: #93c5fd; }
.fh-dot--shop { background: #6ee7b7; }
.fh-dot--personal { background: #fcd34d; }
.fh-dot--finance { background: #f9a8d4; }

.fh-mod-icon--contracts { background: #eff6ff; color: #2563eb; }
.fh-mod-icon--shop { background: #ecfdf5; color: #059669; }
.fh-mod-icon--personal { background: #fffbeb; color: #d97706; }
.fh-mod-icon--finance { background: #fdf2f8; color: #db2777; }

.fh-bar { height: 8px; border-radius: 9999px; background: #f1f5f9; overflow: hidden; }
.fh-bar__fill { height: 100%; border-radius: 9999px; transition: width 0.5s ease; }
.fh-bar__fill--good { background: linear-gradient(90deg, #10b981, #059669); }
.fh-bar__fill--mid { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.fh-bar__fill--bad { background: linear-gradient(90deg, #fb7185, #e11d48); }

.fh-impact { min-width: 52px; text-align: center; font-size: 13px; font-weight: 700; border-radius: 8px; padding: 3px 6px; }
.fh-impact--positive { background: #dcfce7; color: #15803d; }
.fh-impact--negative { background: #fee2e2; color: #b91c1c; }
.fh-impact--neutral { background: #f1f5f9; color: #64748b; }
</style>
