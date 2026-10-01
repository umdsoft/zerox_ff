<template>
  <!-- 29.09 (doc1 21–24-rasm, doc2 1-rasm): "Tavsiya" kartasi — Shaxsiy qarz kontragent sahifasi va
       Qarz daftari mijoz sahifasida BIR XIL ko'rinish (DRY). Faqat ko'rsatish: ma'lumot/API ota sahifada.
       tone: good | warn | bad | none. Ranglar inline (Tailwind 2.2 JIT o'chiq — arbitrary klass ishlamaydi). -->
  <section class="bg-white rounded-2xl shadow-sm p-5">
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <h3 class="text-base font-bold text-gray-900">{{ label }}</h3>
    </div>
    <div class="flex items-start gap-3 rounded-xl p-3.5" :style="{ background: view.bg }">
      <span class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ background: view.iconBg, color: view.color }">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" :d="view.path"/></svg>
      </span>
      <div class="min-w-0">
        <p class="font-semibold leading-snug" :style="{ color: view.color }">{{ title }}</p>
        <p class="text-sm text-gray-600 mt-0.5 leading-snug">
          {{ text }}<span v-if="meta" class="text-gray-400"> {{ meta }}</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
const PATH_CHECK = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
const PATH_INFO = 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
const PATH_WARN = 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'

const TONES = {
  good: { bg: '#ECFDF5', iconBg: '#D1FAE5', color: '#047857', path: PATH_CHECK },
  warn: { bg: '#FFFBEB', iconBg: '#FEF3C7', color: '#B45309', path: PATH_WARN },
  bad: { bg: '#FEF2F2', iconBg: '#FEE2E2', color: '#B91C1C', path: PATH_WARN },
  none: { bg: '#F9FAFB', iconBg: '#F3F4F6', color: '#374151', path: PATH_INFO },
}

export default {
  name: 'RecommendationCard',
  props: {
    label: { type: String, default: '' },
    tone: { type: String, default: 'none' },
    title: { type: String, default: '' },
    text: { type: String, default: '' },
    meta: { type: String, default: '' },
  },
  computed: {
    view() { return TONES[this.tone] || TONES.none },
  },
}
</script>
