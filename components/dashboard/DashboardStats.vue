<template>
  <div class="mt-6 lg:mt-8">
    <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.financialSummary }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <!-- Debitor Card - Green Gradient -->
      <nuxt-link :to="localePath({ name: 'debt-list' })" class="block group">
        <div class="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 h-full">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconDebitor :width="28" :height="28" />
            </div>
            <span class="text-xs font-medium text-white bg-white bg-opacity-20 px-2 py-1 rounded-full">{{ texts.receivable }}</span>
          </div>
          <h3 class="text-sm font-medium text-green-100 mb-2">{{ $t('home.debitor') }}</h3>
          <p class="text-xl lg:text-2xl font-bold text-white mb-1">
            {{ debitorUzs ? $formatNumber(debitorUzs.residual_amount) : 0 }} <span class="text-sm font-medium text-green-200">UZS</span>
          </p>
          <p class="text-base font-semibold text-green-50">
            {{ debitorUsd ? $formatNumber(debitorUsd.residual_amount) : 0 }} <span class="text-sm font-medium text-green-200">USD</span>
          </p>
        </div>
      </nuxt-link>

      <!-- Expired Debitor Card - Red Gradient -->
      <nuxt-link :to="localePath({ name: 'expired-type', params: { type: 'debitor' } })" class="block group">
        <div class="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 h-full">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconExpiredD :width="28" :height="28" />
            </div>
            <span class="text-xs font-medium text-white bg-white bg-opacity-20 px-2 py-1 rounded-full">{{ texts.overdue }}</span>
          </div>
          <h3 class="text-sm font-medium text-red-100 mb-2">{{ $t('home.expiredD') }}</h3>
          <p class="text-xl lg:text-2xl font-bold text-white mb-1">
            {{ expiredDebitorUzs ? $formatNumber(expiredDebitorUzs.residual_amount) : 0 }} <span class="text-sm font-medium text-red-200">UZS</span>
          </p>
          <p class="text-base font-semibold text-red-50">
            {{ expiredDebitorUsd ? $formatNumber(expiredDebitorUsd.residual_amount) : 0 }} <span class="text-sm font-medium text-red-200">USD</span>
          </p>
        </div>
      </nuxt-link>

      <!-- Creditor Card - Amber/Orange Gradient -->
      <nuxt-link :to="localePath({ name: 'credit-list' })" class="block group">
        <div class="bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 h-full">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconCreditor :width="28" :height="28" />
            </div>
            <span class="text-xs font-medium text-white bg-white bg-opacity-20 px-2 py-1 rounded-full">{{ texts.payable }}</span>
          </div>
          <h3 class="text-sm font-medium text-amber-100 mb-2">{{ $t('home.creditor') }}</h3>
          <p class="text-xl lg:text-2xl font-bold text-white mb-1">
            {{ creditorUzs ? $formatNumber(creditorUzs.residual_amount) : 0 }} <span class="text-sm font-medium text-amber-200">UZS</span>
          </p>
          <p class="text-base font-semibold text-amber-50">
            {{ creditorUsd ? $formatNumber(creditorUsd.residual_amount) : 0 }} <span class="text-sm font-medium text-amber-200">USD</span>
          </p>
        </div>
      </nuxt-link>

      <!-- Expired Creditor Card - Red Gradient -->
      <nuxt-link :to="localePath({ name: 'expired-type', params: { type: 'creditor' } })" class="block group">
        <div class="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 h-full">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconExpiredC :width="28" :height="28" />
            </div>
            <span class="text-xs font-medium text-white bg-white bg-opacity-20 px-2 py-1 rounded-full">{{ texts.overdue }}</span>
          </div>
          <h3 class="text-sm font-medium text-red-100 mb-2">{{ $t('home.expiredC') }}</h3>
          <p class="text-xl lg:text-2xl font-bold text-white mb-1">
            {{ expiredCreditorUzs ? $formatNumber(expiredCreditorUzs.residual_amount) : 0 }} <span class="text-sm font-medium text-red-200">UZS</span>
          </p>
          <p class="text-base font-semibold text-red-50">
            {{ expiredCreditorUsd ? $formatNumber(expiredCreditorUsd.residual_amount) : 0 }} <span class="text-sm font-medium text-red-200">USD</span>
          </p>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import IconDebitor from '@/components/icons/IconDebitor.vue';
import IconCreditor from '@/components/icons/IconCreditor.vue';
import IconExpiredD from '@/components/icons/IconExpiredD.vue';
import IconExpiredC from '@/components/icons/IconExpiredC.vue';

export default {
  name: 'DashboardStats',
  components: { IconDebitor, IconCreditor, IconExpiredD, IconExpiredC },
  props: {
    texts: { type: Object, required: true },
    debitorUzs: { type: Object, default: null },
    debitorUsd: { type: Object, default: null },
    creditorUzs: { type: Object, default: null },
    creditorUsd: { type: Object, default: null },
    expiredDebitorUzs: { type: Object, default: null },
    expiredDebitorUsd: { type: Object, default: null },
    expiredCreditorUzs: { type: Object, default: null },
    expiredCreditorUsd: { type: Object, default: null },
  },
};
</script>
