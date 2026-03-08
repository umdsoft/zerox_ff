<template>
  <div class="mt-6 lg:mt-8">
    <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.reports }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      <nuxt-link :to="localePath({ name: 'hisobot-type', params: { type: 'debitor' } })" class="block group">
        <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base lg:text-lg font-bold text-gray-900 mb-1">{{ $t('home.reportD') }}</h3>
              <p class="text-sm text-gray-500">{{ texts.viewDebitorReport }}</p>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconReportD :width="32" :height="32" />
            </div>
          </div>
        </div>
      </nuxt-link>

      <nuxt-link :to="localePath({ name: 'hisobot-type', params: { type: 'creditor' } })" class="block group">
        <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base lg:text-lg font-bold text-gray-900 mb-1">{{ $t('home.reportC') }}</h3>
              <p class="text-sm text-gray-500">{{ texts.viewCreditorReport }}</p>
            </div>
            <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconReportC :width="32" :height="32" />
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import IconReportD from '@/components/icons/IconReportD.vue';
import IconReportC from '@/components/icons/IconReportC.vue';

export default {
  name: 'DashboardReports',
  components: { IconReportD, IconReportC },
  props: {
    texts: { type: Object, required: true },
  },
};
</script>
