<template>
  <!-- 30.10: Tariflar → "Batafsil": yuborilgan BARCHA SMS xabarlar (matni to'liq). Marshrut: /price/sms -->
  <div class="pb-8 max-w-5xl mx-auto px-4">
    <div class="flex items-center gap-3 mb-4 mt-2">
      <button
        type="button"
        class="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm"
        :title="$t('sms_hist.back')"
        @click="goBack"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ $t('sms_hist.page_title') }}</h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-0.5">{{ $t('sms_hist.page_subtitle') }}</p>
      </div>
    </div>
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <SmsMessageList searchable />
    </div>
  </div>
</template>

<script>
import SmsMessageList from '~/components/sms/SmsMessageList.vue';

export default {
  name: 'PriceSmsPage',
  middleware: 'auth',
  components: { SmsMessageList },
  methods: {
    goBack() { this.$router.push(this.localePath({ name: 'price' })); },
  },
};
</script>
