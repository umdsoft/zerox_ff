<template>
  <div class="modal-z">
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
  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    },
  },
  props: {
    width: {
      type: Number,
      default: 480,
    },
    iconClose: {
      type: Boolean,
      default: true,
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
