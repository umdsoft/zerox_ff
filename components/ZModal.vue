<template>
  <div class="modal-z">
    <div class="modal-z-dialog" :style="{ maxWidth: `${width}px` }">
      <button class="modal-z-close" @click="closeModal" v-if="iconClose">
        x
      </button>
      <div class="modal-z-content">
        <slot name="modal_body"></slot>
      </div>
    </div>
    <div class="modal-z-fon"></div>
  </div>
</template>

<script>
export default {
  methods: {
    closeModal() {
      this.$emit("closeModal");
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
  z-index: 10000;

  &-fon {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  }
  &-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    z-index: 1001;
    border-radius: 10px;
    width: 100%;
  }
  &-content {
    padding: 28px 25px 35px 25px;
  }
  &-close {
    position: absolute;
    top: 7px;
    right: 14px;
  }
}
</style>
