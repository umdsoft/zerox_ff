<template>
  <div class="qd-modal-overlay" @click.self="$emit('close')">
    <slot />
  </div>
</template>

<script>
// wave C: pages/price/index.vue dagi `.qd-modal-overlay` (blur fon) o'rovchi — 3 ta modal umumiy ishlatadi.
export default {
  name: 'PriceModalOverlay',
};
</script>

<style scoped>
/* Modal overlay — global .modal-overlay bilan to'qnashmaslik uchun prefiksli */
.qd-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 110;
  animation: qd-fade-in 0.15s ease-out;
}
@keyframes qd-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
