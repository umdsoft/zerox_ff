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
 * Eski /qarz-daftari/qarz/:id/amaliyotlar sahifasi olib tashlandi.
 * Endi amaliyotlar tarixi mijoz darajasida ko'rsatiladi.
 * Ushbu sahifa qarz'ning mijoz_id sini olib, /qarz-daftari/mijoz/:mijoz_id/amaliyotlar
 * sahifasiga yo'naltiradi (eski havolalar buzilmasligi uchun).
 */
export default {
  middleware: 'auth',
  async mounted() {
    try {
      const res = await this.$axios.$get(`/qarz-daftari/qarz/${this.$route.params.id}`, { silent: true });
      const mijozId = res?.data?.mijoz_id || res?.data?.mijoz?.id;
      const turi = res?.data?.turi;
      if (mijozId) {
        const path = this.localePath({ name: 'qarz-daftari-mijoz-id-amaliyotlar', params: { id: mijozId } });
        this.$router.replace(path + (turi ? `?turi=${turi}` : ''));
        return;
      }
    } catch (_) {}
    // Fallback: dashboard
    this.$router.replace(this.localePath({ name: 'qarz-daftari' }));
  },
};
</script>
