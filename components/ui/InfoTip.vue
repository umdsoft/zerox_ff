<template>
  <!-- 02.10 (sayt hujjati, 1- va 6-rasm): bo'lim sarlavhasi yonidagi izoh ikonkasi ("i").
       Sichqoncha ustiga borganda, klaviatura fokusida yoki (sensorli ekranda) bosilganda izoh chiqadi;
       Esc / tashqariga bosish / fokus ketishi yopadi. Izoh ekran chetidan chiqib ketmaydi (siljitiladi). -->
  <span
    ref="root"
    class="info-tip"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <button
      type="button"
      class="info-tip__btn"
      :aria-label="text"
      :aria-describedby="open ? tipId : null"
      :aria-expanded="open ? 'true' : 'false'"
      @focus="show"
      @blur="hide"
      @click.stop.prevent="toggle"
      @keydown.esc="hide"
    >
      <svg class="info-tip__icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </button>
    <span
      v-show="open"
      :id="tipId"
      ref="tip"
      role="tooltip"
      class="info-tip__bubble"
      :style="{ transform: 'translateX(calc(-50% + ' + shift + 'px))' }"
    >{{ text }}<span class="info-tip__arrow" :style="{ marginLeft: (-shift - 5) + 'px' }" aria-hidden="true"></span></span>
  </span>
</template>

<script>
/**
 * InfoTip — kichik "i" ikonkasi + izoh (tooltip). Tailwind JIT o'chiq bo'lgani uchun uslub scoped CSS'da.
 *
 * Props:
 *   - text: izoh matni (majburiy; ekran o'quvchi uchun aria-label ham shu)
 *
 * @example <InfoTip :text="texts.completedInfo" />
 */
let uid = 0
const EDGE = 8 // izoh ekran chetidan kamida shuncha px ichkarida
const TAP_GRACE_MS = 400

export default {
  name: 'InfoTip',
  props: {
    text: { type: String, required: true },
  },
  data() {
    uid += 1
    return { open: false, shift: 0, tipId: 'info-tip-' + uid }
  },
  beforeDestroy() {
    this.unbindOutside()
  },
  methods: {
    show() {
      if (this.open) return
      this.openedAt = Date.now()
      this.open = true
      this.shift = 0
      this.$nextTick(this.fitToViewport)
      this.bindOutside()
    },
    hide() {
      this.open = false
      this.unbindOutside()
    },
    /**
     * Bosish (sensorli ekranda "tap"): tap ketma-ketligi mouseenter → focus → click bo'lgani uchun izoh
     * hover/fokus bilan HOZIRGINA ochilgan bo'lsa yopmaymiz (aks holda tap uni darhol yopardi).
     */
    toggle() {
      if (!this.open) { this.show(); return }
      if (Date.now() - (this.openedAt || 0) < TAP_GRACE_MS) return
      this.hide()
    },
    /** Izoh ekran chetidan chiqsa — gorizontal siljitamiz (strelka ikonka ustida qoladi). */
    fitToViewport() {
      const el = this.$refs.tip
      if (!el || typeof window === 'undefined') return
      const r = el.getBoundingClientRect()
      const vw = window.innerWidth || document.documentElement.clientWidth || 0
      let dx = 0
      if (r.left < EDGE) dx = EDGE - r.left
      else if (r.right > vw - EDGE) dx = (vw - EDGE) - r.right
      this.shift = Math.round(dx)
    },
    onOutside(e) {
      const root = this.$refs.root
      if (root && !root.contains(e.target)) this.hide()
    },
    bindOutside() {
      if (typeof document === 'undefined' || this.outsideBound) return
      document.addEventListener('click', this.onOutside, true)
      document.addEventListener('touchstart', this.onOutside, true)
      this.outsideBound = true
    },
    unbindOutside() {
      if (typeof document === 'undefined' || !this.outsideBound) return
      document.removeEventListener('click', this.onOutside, true)
      document.removeEventListener('touchstart', this.onOutside, true)
      this.outsideBound = false
    },
  },
}
</script>

<style scoped>
.info-tip {
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
.info-tip__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  color: #6b7280;
  background: transparent;
  transition: color 0.15s, background-color 0.15s;
}
.info-tip__btn:hover,
.info-tip__btn:focus {
  color: #2563eb;
  background: #eff6ff;
  outline: none;
}
.info-tip__btn:focus-visible {
  box-shadow: 0 0 0 2px #93c5fd;
}
.info-tip__icon {
  width: 18px;
  height: 18px;
}
.info-tip__bubble {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  z-index: 60;
  width: max-content;
  max-width: min(280px, calc(100vw - 16px));
  padding: 8px 12px;
  border-radius: 10px;
  /* 03.10 (sayt hujjati, 1/2-rasm): izoh foni QORA emas — oq, nozik chegara + soya, to'q matn */
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #1f2937;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
  text-align: left;
  white-space: normal;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.06);
  pointer-events: none;
}
.info-tip__arrow {
  position: absolute;
  top: -6px;
  left: 50%;
  width: 10px;
  height: 10px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  border-left: 1px solid #e5e7eb;
  transform: rotate(45deg);
}
</style>
