<template>
  <!-- SS-DEV (2026-09-26), 25.09 "Xatolar" 13-band: SMS boshqaruvi Tariflar sahifasiga ko'chirildi
       (components/finance/SmsManager.vue). Eski marshrut saqlanadi — /price#sms ga yo'naltiradi. -->
  <div class="py-12 text-center text-sm text-gray-400">…</div>
</template>

<script>
export default {
  middleware: 'auth',
  mounted() {
    this.$router.replace(this.localePath({ name: 'price', hash: '#sms' }));
  },
};
</script>
