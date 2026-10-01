<template>
  <div>
    <!-- SS-PERF (2026-10-01): sahifa ma'lumoti (GET) yuklanayotganda — faqat yuqorida ingichka
         chiziq; sahifa ko'rinib, bosiladigan holatda qoladi (ekranni yopmaydi). -->
    <div v-show="showBar" class="zx-topbar" role="progressbar" aria-hidden="true">
      <div class="zx-topbar__runner"></div>
    </div>

    <!-- Foydalanuvchi boshlagan uzoq amal (saqlash/to'lov/fayl yuklab olish) — shaffof overlay -->
    <div class="loading-page-2" v-if="show">
      <div class="loading-logo-2">
        <div class="loading-2"></div>
        <img src="@/assets/img/logo-mark.svg" alt="ZeroX" />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * SS-PERF (2026-10-01), 01.10 hujjati: "har bir sahifa ochilishidan oldin ekranda aylana
 * aylanadi, 1-2 soniyadan so'ng sahifa ochiladi".
 *
 * ILDIZ: ilgari HAR QANDAY so'rov (sahifa ma'lumotini o'qish ham) 300ms dan oshsa butun
 * ekran OQ fon + logotip aylanasi bilan yopilardi — sahifa allaqachon chizilgan bo'lsa ham
 * foydalanuvchi uni ko'rmasdi. Endi ikki xil holat (plugins/axios.js `loadingKind`):
 *  - `barLoadingCount` (GET) → yuqorida 3px chiziq, 250ms dan keyin; ekran ochiq qoladi;
 *  - `isLoading` (POST/PUT/PATCH/DELETE, blob yuklab olish, `overlay: true`) → shaffof
 *    overlay, faqat amal 600ms dan uzoq davom etsa (tez saqlashda miltillamaydi).
 */
const BAR_DELAY_MS = 250;
const OVERLAY_DELAY_MS = 600;

export default {
  name: "LoadingBar",
  data() {
    return {
      show: false,
      showBar: false,
      timer: null,
      barTimer: null,
    };
  },

  computed: {
    barActive() {
      return this.$store.state.barLoadingCount > 0;
    },
  },

  watch: {
    "$store.state.isLoading"(now) {
      if (now) {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.show = true;
          this.timer = null;
        }, OVERLAY_DELAY_MS);
      } else {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.show = false;
      }
    },

    barActive(now) {
      if (now) {
        if (this.barTimer) return;
        this.barTimer = setTimeout(() => {
          this.showBar = true;
          this.barTimer = null;
        }, BAR_DELAY_MS);
      } else {
        if (this.barTimer) {
          clearTimeout(this.barTimer);
          this.barTimer = null;
        }
        this.showBar = false;
      }
    },
  },

  beforeDestroy() {
    if (this.timer) clearTimeout(this.timer);
    if (this.barTimer) clearTimeout(this.barTimer);
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Yuqoridagi ingichka (bloklamaydigan) yuklanish chizig'i */
.zx-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 100001;
  overflow: hidden;
  pointer-events: none;
  background-color: rgba(49, 130, 206, 0.15);
}
.zx-topbar__runner {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 40%;
  background-color: #3182ce;
  border-radius: 0 2px 2px 0;
  animation: zx-topbar-run 1.1s ease-in-out infinite;
  will-change: transform;
}
@keyframes zx-topbar-run {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}

.loading-page-2 {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  /* SS-PERF (2026-10-01): oq fon o'rniga shaffof — sahifa ko'rinib turadi, faqat bosish bloklanadi */
  background-color: rgba(255, 255, 255, 0.55);
}
.loading-logo-2 {
  width: 5rem;
  height: 5rem;
  position: relative;
  display: flex;
  align-items: center;
}
.loading-logo-2 img {
  width: 3rem;
  height: 3rem;
  display: block;
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: auto;
  object-fit: contain;
}

.loading-2 {
  display: inline-block;
  position: absolute;
  width: 100%;
  height: 100%;
  border: 12px solid #3182ce18;
  border-radius: 50%;
  border-top-color: #3182ce;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .zx-topbar__runner {
    animation-duration: 2.4s;
  }
}
</style>
