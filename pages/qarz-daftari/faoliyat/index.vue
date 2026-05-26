<template>
  <div class="flex items-center justify-center py-20">
    <svg class="w-10 h-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  </div>
</template>

<script>
/**
 * Eski "Savdo faoliyatlari" sahifasi olib tashlandi.
 * Do'kon (savdo faoliyat) boshqaruvi endi /qarz-daftari/kiritish sahifasida —
 * har bir do'kon kartasida Tahrirlash va Xodimlar tugmalari bor.
 * Eski URL'lardan kelganlar avtomatik kiritish sahifasiga yo'naltiriladi.
 */
export default {
  middleware: 'auth',
  mounted() {
    this.$router.replace(this.localePath({ name: 'qarz-daftari-kiritish' }));
  },
};
</script>
