<template>
  <!-- SS-DEV (2026-09-27), 26.09 hujjat 2-band: UMUMIY "Yuklab olish" chip-tugmasi.
       Ilgari har ro'yxat sahifasida o'z katta yashil "Excelga yuklash" tugmasi bor edi (3 xil
       markup). Endi kontragent sahifasidagi (3-rasm) ixcham uslub hamma joyda: och yashil fon,
       yashil matn, hujjat ikonkasi, rounded-lg. Eksport MANTIG'I sahifada qoladi — komponent
       faqat `click` chiqaradi. Ranglar inline (Tailwind JIT o'chiq). -->
  <button
    type="button"
    class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
    :class="isDisabled ? '' : 'hover:shadow-sm'"
    style="background:#ECFDF5;color:#047857"
    :style="isDisabled ? 'opacity:.5;cursor:not-allowed' : ''"
    :disabled="isDisabled"
    :title="title || text"
    :aria-busy="loading ? 'true' : 'false'"
    @click="onClick"
  >
    <svg v-if="!loading" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
    <svg v-else class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
    {{ text }}
  </button>
</template>

<script>
/**
 * DownloadButton — ro'yxatlarni Excel'ga yuklab olish uchun yagona chip-tugma.
 *
 * Props:
 *   - loading:  eksport tayyorlanmoqda (spinner + "Tayyorlanmoqda…")
 *   - disabled: bosib bo'lmaydi (ro'yxat bo'sh va h.k.)
 *   - label:    matnni almashtirish (ixtiyoriy; default "Yuklab olish", 5 til)
 *   - title:    tooltip (ixtiyoriy)
 *
 * Hodisa: `click` — eksportni sahifa o'zi bajaradi.
 *
 * @example <DownloadButton :loading="exporting" :disabled="!rows.length" @click="exportExcel" />
 */
export default {
  name: 'DownloadButton',
  props: {
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    label: { type: String, default: '' },
    title: { type: String, default: '' },
  },
  computed: {
    isDisabled() { return this.disabled || this.loading },
    texts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      const t = {
        uz: { download: 'Yuklab olish', preparing: 'Tayyorlanmoqda…' },
        ru: { download: 'Скачать', preparing: 'Подготовка…' },
        kr: { download: 'Юклаб олиш', preparing: 'Тайёрланмоқда…' },
        en: { download: 'Download', preparing: 'Preparing…' },
        kaa: { download: 'Júklep alıw', preparing: 'Tayarlanbaqta…' },
      }
      return t[l] || t.uz
    },
    text() {
      if (this.loading) return this.texts.preparing
      return this.label || this.texts.download
    },
  },
  methods: {
    onClick(e) {
      if (this.isDisabled) return
      this.$emit('click', e)
    },
  },
}
</script>
