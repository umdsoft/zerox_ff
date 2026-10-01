<template>
  <div class="mt-6 lg:mt-8">
    <!-- 01.10 (doc3 8/9-rasm): sarlavha `title` prop bilan almashtiriladi (Qarz shartnomasi: "Tugallangan qarz
         shartnomalari"; Shaxsiy qarz: "Yakunlangan qarzlar"); berilmasa — avvalgi `texts.reports`. -->
    <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ title || texts.reports }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      <!-- 30.09 (doc1 11-rasm): komponent Shaxsiy qarz bosh sahifasida ham ishlatiladi — `leftTo/rightTo`,
           `leftTitle/rightTitle` berilsa o'sha manzil/sarlavha; berilmasa Qarz shartnomasi hisobotlari. -->
      <nuxt-link :to="leftTo || localePath({ name: 'hisobot-type', params: { type: 'debitor' } })" class="block group">
        <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base lg:text-lg font-bold text-gray-900">{{ leftTitle || $t('home.reportD') }}</h3>
              <p v-if="leftDesc" class="text-sm text-gray-500 mt-1">{{ leftDesc }}</p>
              <p v-for="(line, i) in leftLines" :key="'l' + i" class="text-base lg:text-lg font-bold text-gray-900 leading-tight mt-1">{{ line }}</p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <span v-if="leftBadge" class="text-xs font-semibold px-2.5 py-1 rounded-full" style="background:#DBEAFE;color:#1D4ED8">{{ leftBadge }}</span>
              <div class="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <IconReportD :width="32" :height="32" />
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>

      <nuxt-link :to="rightTo || localePath({ name: 'hisobot-type', params: { type: 'creditor' } })" class="block group">
        <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base lg:text-lg font-bold text-gray-900">{{ rightTitle || $t('home.reportC') }}</h3>
              <p v-if="rightDesc" class="text-sm text-gray-500 mt-1">{{ rightDesc }}</p>
              <p v-for="(line, i) in rightLines" :key="'r' + i" class="text-base lg:text-lg font-bold text-gray-900 leading-tight mt-1">{{ line }}</p>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
              <span v-if="rightBadge" class="text-xs font-semibold px-2.5 py-1 rounded-full" style="background:#DCFCE7;color:#15803D">{{ rightBadge }}</span>
              <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <IconReportC :width="32" :height="32" />
              </div>
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
    // 30.09 (doc1 11-rasm): Shaxsiy qarz hisobotlari uchun (ixtiyoriy; default — Qarz shartnomasi)
    leftTo: { type: [String, Object], default: '' },
    rightTo: { type: [String, Object], default: '' },
    leftTitle: { type: String, default: '' },
    rightTitle: { type: String, default: '' },
    leftDesc: { type: String, default: '' },
    rightDesc: { type: String, default: '' },
    // 01.10 (doc3 8/9-rasm): bo'lim sarlavhasi, kartalardagi summa qatorlari (valyuta bo'yicha) va son belgisi
    title: { type: String, default: '' },
    leftLines: { type: Array, default: () => [] },
    rightLines: { type: Array, default: () => [] },
    leftBadge: { type: String, default: '' },
    rightBadge: { type: String, default: '' },
  },
};
</script>
