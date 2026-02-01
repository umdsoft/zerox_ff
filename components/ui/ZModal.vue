<template>
  <transition name="z-modal">
    <div
      v-if="value"
      class="fixed inset-0 z-[70] overflow-y-auto flex p-4 sm:p-6"
      :class="centered ? 'items-center' : 'items-start'"
      style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px)"
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
</template>

<script>
export default {
  name: 'ZModal',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['sm', 'md', 'lg', 'xl', 'full'].includes(v),
    },
    closable: {
      type: Boolean,
      default: true,
    },
    closeOnOverlay: {
      type: Boolean,
      default: true,
    },
    closeOnEscape: {
      type: Boolean,
      default: true,
    },
    centered: {
      type: Boolean,
      default: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(val) {
      if (val) {
        document.body.style.overflow = 'hidden';
        if (this.closeOnEscape) {
          document.addEventListener('keydown', this.handleEscape);
        }
      } else {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.handleEscape);
      }
    },
  },
  beforeDestroy() {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleEscape);
  },
  methods: {
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
