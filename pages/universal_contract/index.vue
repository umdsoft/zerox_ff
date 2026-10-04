<template>
  <!-- SS-DEV (2026-10-04): eski oferta sahifasi (PDF <iframe> — mobilda o'ngdan kesilardi, qizil tugma).
       Endi yagona oferta oynasi (components/contractModal.vue, $oferta) ishlatiladi: eski havola bilan
       kirilsa — Qarz shartnomasi bosh sahifasiga o'tib, oferta tasdiqlanmagan bo'lsa oyna ochiladi. -->
  <div class="py-10 flex justify-center">
    <span class="inline-block w-6 h-6 rounded-full border-2 border-blue-200 animate-spin" style="border-top-color: #2563eb" aria-hidden="true"></span>
  </div>
</template>

<script>
export default {
  mounted() {
    const needs = !!(this.$oferta && this.$oferta.needed());
    const target = this.localePath({ name: needs ? 'contract-dashboard' : 'index' });
    this.$router.replace(target).catch(() => {}).then(() => {
      if (needs && this.$oferta) this.$oferta.open();
    });
  },
};
</script>
