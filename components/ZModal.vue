<template>
  <!-- BIRLASHGAN ZModal (wave B). Ikki rejim:
       1) eski: `v-if` + `<template #modal_body>`, `@closeModal`, `:width`, `:icon-close` (value berilmaydi)
       2) yangi: `v-model`/`:value`, title/size/footer slotlari (value berilganda) -->
  <transition v-if="isModelMode" name="z-modal">
    <div
      v-if="value"
      class="fixed inset-0 overflow-y-auto flex p-4 sm:p-6"
      :class="centered ? 'items-center' : 'items-start'"
      style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 10000"
      @click.self="handleOverlayClick"
    >
      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full flex flex-col mx-auto"
        :class="[
          size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : size === 'xl' ? 'max-w-4xl' : size === 'full' ? 'max-w-full mx-4' : 'max-w-lg',
          fullscreen ? 'max-w-none m-0 rounded-none h-screen' : ''
        ]"
        :style="fullscreen ? '' : 'max-height: 90vh'"
        role="dialog"
        aria-modal="true"
      >
        <!-- Header -->
        <div v-if="!hideHeader" class="flex items-start justify-between p-5 border-b border-gray-100">
          <div class="flex-1 min-w-0">
            <slot name="header">
              <h3 class="text-lg font-semibold text-gray-900 truncate">{{ title }}</h3>
              <p v-if="subtitle" class="mt-1 text-sm text-gray-500">{{ subtitle }}</p>
            </slot>
          </div>
          <button
            v-if="closable"
            type="button"
            class="flex-shrink-0 ml-4 p-1.5 rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            @click="close"
            aria-label="Close"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto" :class="noPadding ? '' : 'p-5'">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="flex items-center justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
  <div v-else class="modal-z">
    <div class="modal-z-dialog" role="dialog" aria-modal="true" :style="{ maxWidth: `${width}px` }">
      <button class="modal-z-close" @click="closeModal" v-if="iconClose">
        x
      </button>
      <div class="modal-z-content">
        <slot name="modal_body"></slot>
      </div>
    </div>
    <div class="modal-z-fon" @click="closeModal" v-if="iconClose"></div>
  </div>
</template>

<script>
export default {
  name: 'ZModal',
  props: {
    // ---- eski API (modal_body) ----
    width: { type: Number, default: 480 },
    iconClose: { type: Boolean, default: true },
    // ---- yangi API (v-model) ----
    value: { type: Boolean, default: undefined },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['sm', 'md', 'lg', 'xl', 'full'].includes(v),
    },
    closable: { type: Boolean, default: true },
    closeOnOverlay: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true },
    centered: { type: Boolean, default: true },
    fullscreen: { type: Boolean, default: false },
    hideHeader: { type: Boolean, default: false },
    noPadding: { type: Boolean, default: false },
  },
  computed: {
    isModelMode() {
      return this.value !== undefined;
    },
  },
  watch: {
    value(val) {
      if (!this.isModelMode) return;
      if (val) {
        this.lockBodyScroll();
        if (this.closeOnEscape) {
          document.addEventListener('keydown', this.handleEscape);
        }
      } else {
        this.unlockBodyScroll();
        document.removeEventListener('keydown', this.handleEscape);
      }
    },
  },
  mounted() {
    // Eski rejim: har doim Esc tinglanadi (avvalgidek)
    if (!this.isModelMode) document.addEventListener('keydown', this.handleKeydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydown);
    if (this.isModelMode) {
      this.unlockBodyScroll();
      document.removeEventListener('keydown', this.handleEscape);
    }
  },
  methods: {
    // ---- eski rejim ----
    closeModal() {
      this.$emit('closeModal');
    },
    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    },
    // ---- yangi rejim ----
    /**
     * Sahifa scroll'ini qulflash — modal ochilganda fon siljimasligi uchun.
     *
     * MUHIM: global `html { scrollbar-gutter: stable }` scrollbar joyini (gutter)
     * HAR DOIM zaxiralab turadi — overflow:hidden qilinganda ham gutter yo'qolmaydi,
     * shu sabab QO'SHIMCHA padding-right KOMPENSATSIYASI KERAK EMAS. Aks holda gutter
     * bilan padding ikki marta hisoblanib, sahifa chapdan-o'ngga "sakrab" siljiydi
     * (shaxsiy kabinetdan chiqishda kuzatilgan flicker). Eski browserlar (gutter
     * qo'llab-quvvatlamaydigan) uchungina padding fallback sifatida qo'shiladi.
     */
    lockBodyScroll() {
      if (typeof window === 'undefined') return;
      const root = document.documentElement;
      const supportsGutter = !!(window.CSS && CSS.supports && CSS.supports('scrollbar-gutter', 'stable'));
      if (!supportsGutter) {
        const scrollbarWidth = window.innerWidth - root.clientWidth;
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = scrollbarWidth + 'px';
        }
      }
      root.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    },
    unlockBodyScroll() {
      if (typeof window === 'undefined') return;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    },
    close() {
      this.$emit('input', false);
      this.$emit('close');
    },
    handleOverlayClick() {
      if (this.closeOnOverlay) {
        this.close();
      }
    },
    handleEscape(e) {
      if (e.key === 'Escape') {
        this.close();
      }
    },
  },
};
</script>

<style lang="scss">
.modal-z {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;

  &-fon {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9997;
  }
  &-dialog {
    position: relative;
    background-color: #fff;
    z-index: 9999;
    border-radius: 10px;
    width: 100%;
    max-height: 95vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.15) transparent;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.15);
      border-radius: 2px;
    }
  }
  &-content {
    padding: 20px 21px 24px 21px;
  }
  &-close {
    position: absolute;
    top: 7px;
    right: 14px;
  }
}
</style>

<style scoped>
.z-modal-enter-active,
.z-modal-leave-active {
  transition: opacity 0.2s ease;
}

.z-modal-enter-active > div,
.z-modal-leave-active > div {
  transition: all 0.2s ease;
}

.z-modal-enter,
.z-modal-leave-to {
  opacity: 0;
}

.z-modal-enter > div,
.z-modal-leave-to > div {
  opacity: 0;
  transform: scale(0.95);
}
</style>
