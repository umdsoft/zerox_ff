<template>
  <div @click="goBack" class="my-2 mx-6 hidden lg:inline-flex items-center" style="cursor:pointer">
    <IconChevronLeft />
    <p class="text-blue-500">{{ $t('back') }}</p>
  </div>
</template>

<script>
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue';

// Qarz shartnomasi bo'limidagi sahifalar
const CONTRACT_ROUTES = [
  'debt-list', 'debt-demand', 'debt-extend', 'debt-refund',
  'debt-waiver', 'contract-type-detail', 'debt-extend-ask',
  'money-type', 'search', 'search-physical', 'search-result-type',
];

export default {
  name: 'BackButton',
  components: { IconChevronLeft },

  methods: {
    goBack() {
      const currentRoute = this.$route.name?.replace(/___\w+$/, '') || '';

      // Qarz shartnomasi bo'limida bo'lsa → contract-dashboard ga qaytarish
      if (CONTRACT_ROUTES.some(r => currentRoute.includes(r))) {
        return this.$router.push(this.localePath({ name: 'contract-dashboard' }));
      }

      // Boshqa hollarda oddiy orqaga
      this.$backWithLocale();
    },
  },
};
</script>
