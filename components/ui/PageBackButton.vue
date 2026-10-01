<template>
  <!-- 30.09 (doc1 14-rasm): UMUMIY "Orqaga" tugmasi — Qarz shartnomasi / Qarz daftari sahifalaridagi
       kvadrat oq tugma (chevron) uslubi. Shaxsiy qarz va Shaxsiy moliya bo'limlaridagi matnli
       "← Orqaga" havolalari shu komponent bilan almashtirildi (bir xil ko'rinish, bitta joyda).
       `to` berilsa — nuxt-link; aks holda `click` chiqaradi (sahifa o'zi hal qiladi). -->
  <nuxt-link
    v-if="to"
    :to="to"
    class="page-back-btn flex-shrink-0 inline-flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 shadow-sm transition-colors"
    :title="text"
    :aria-label="text"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
  </nuxt-link>
  <button
    v-else
    type="button"
    class="page-back-btn flex-shrink-0 inline-flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 shadow-sm transition-colors"
    :title="text"
    :aria-label="text"
    @click="$emit('click', $event)"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
  </button>
</template>

<script>
/**
 * PageBackButton — sahifa sarlavhasi yonidagi kvadrat "Orqaga" tugmasi.
 *
 * Props:
 *   - to:    manzil (localePath natijasi); bo'lmasa `click` hodisasi chiqadi
 *   - label: tooltip/aria matni (ixtiyoriy; default "Orqaga", 5 til)
 *
 * @example <PageBackButton :to="localePath({ name: 'finance' })" />
 */
const LABELS = { uz: 'Orqaga', ru: 'Назад', kr: 'Орқага', en: 'Back', kaa: 'Artqa' }

export default {
  name: 'PageBackButton',
  props: {
    to: { type: [String, Object], default: '' },
    label: { type: String, default: '' },
  },
  computed: {
    text() {
      if (this.label) return this.label
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      return LABELS[l] || LABELS.uz
    },
  },
}
</script>
