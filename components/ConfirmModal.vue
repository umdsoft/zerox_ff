<template>
  <!-- SS-19 (2026-09-19): native `confirm()` O'RNIGA markazlashgan modal.
       Sabab: brauzerning o'z oynasi mobil ekranda "zerox.uz saytida:" deb chiqadi,
       sayt dizayniga mos kelmaydi va uzbekcha matn ichidagi apostroflar buziladi. -->
  <div class="fixed inset-0 flex items-center justify-center p-4" style="z-index: 120">
    <div
      class="absolute inset-0"
      style="background: rgba(17, 24, 39, 0.55); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)"
      @click="onCancel"
    ></div>

    <div class="relative bg-white rounded-2xl shadow-xl w-full sm:max-w-sm overflow-hidden">
      <div class="p-5 text-center">
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3"
          :style="iconStyle"
        >{{ icon || toneIcon }}</div>

        <h3 class="text-base font-bold text-gray-900">{{ title }}</h3>
        <p v-if="message" class="text-sm text-gray-500 mt-1.5 leading-relaxed">{{ message }}</p>

        <!-- Qo'shimcha maydonlar (masalan summa kiritish) uchun slot -->
        <div v-if="$slots.default" class="mt-4 text-left"><slot /></div>
      </div>

      <div class="flex gap-2 p-4 pt-0">
        <button
          type="button"
          class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm"
          @click="onCancel"
        >{{ cancelText || ($t('common.cancel') || 'Bekor qilish') }}</button>
        <button
          type="button"
          class="flex-1 py-2.5 text-white rounded-xl font-semibold text-sm"
          :style="busy ? confirmBusyStyle : confirmStyle"
          :disabled="busy"
          @click="$emit('confirm')"
        >{{ busy ? '...' : (confirmText || ($t('common.confirm') || 'Tasdiqlash')) }}</button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Ranglar INLINE style bilan berilgan — Tailwind v2.2.19 (JIT o'chiq) dinamik
 * `bg-${tone}-500` klasslarini generatsiya QILMAYDI, ular inert bo'lib qoladi.
 */
const TONES = {
  danger: { bg: '#FEE2E2', fg: '#B91C1C', btn: '#E11D48', icon: '⚠️' },
  warning: { bg: '#FEF3C7', fg: '#92400E', btn: '#F59E0B', icon: '⏰' },
  success: { bg: '#DCFCE7', fg: '#166534', btn: '#16A34A', icon: '✓' },
  primary: { bg: '#E0E7FF', fg: '#3730A3', btn: '#4F46E5', icon: '❓' },
}

export default {
  name: 'ConfirmModal',
  props: {
    title: { type: String, required: true },
    message: { type: String, default: '' },
    confirmText: { type: String, default: '' },
    cancelText: { type: String, default: '' },
    tone: { type: String, default: 'primary' },
    icon: { type: String, default: '' },
    busy: { type: Boolean, default: false },
  },
  computed: {
    palette() { return TONES[this.tone] || TONES.primary },
    toneIcon() { return this.palette.icon },
    iconStyle() { return `background:${this.palette.bg}; color:${this.palette.fg}` },
    confirmStyle() { return `background:${this.palette.btn}` },
    confirmBusyStyle() { return `background:${this.palette.btn}; opacity:0.6` },
  },
  methods: {
    onCancel() {
      if (this.busy) return // amal ketayotganda yopib yubormaylik
      this.$emit('cancel')
    },
  },
  mounted() {
    this._onKey = (e) => { if (e.key === 'Escape') this.onCancel() }
    document.addEventListener('keydown', this._onKey)
  },
  beforeDestroy() {
    if (this._onKey) document.removeEventListener('keydown', this._onKey)
  },
}
</script>
