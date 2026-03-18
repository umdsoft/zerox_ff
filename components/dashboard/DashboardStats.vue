<template>
  <div class="mt-6 lg:mt-8">
    <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.financialSummary }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <!-- Debitor Card -->
      <nuxt-link :to="localePath({ name: 'debt-list' })" class="block group">
        <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 h-full">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconDebitor :width="28" :height="28" />
            </div>
            <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{{ texts.receivable }}</span>
          </div>
          <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('home.debitor') }}</h3>
          <p class="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
            {{ debitorUzs ? $formatNumber(debitorUzs.residual_amount) : 0 }} <span class="text-sm font-medium text-gray-500">UZS</span>
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ debitorUsd ? $formatNumber(debitorUsd.residual_amount) : 0 }} <span class="text-sm font-medium text-gray-500">USD</span>
          </p>
        </div>
      </nuxt-link>

      <!-- Expired Debitor Card -->
      <nuxt-link :to="localePath({ name: 'expired-type', params: { type: 'debitor' } })" class="block group">
        <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 border-l-4 border-red-500 h-full">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconExpiredD :width="28" :height="28" />
            </div>
            <span class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">{{ texts.overdue }}</span>
          </div>
          <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('home.expiredD') }}</h3>
          <p class="text-xl lg:text-2xl font-bold text-red-600 mb-1">
            {{ expiredDebitorUzs ? $formatNumber(expiredDebitorUzs.residual_amount) : 0 }} <span class="text-sm font-medium">UZS</span>
          </p>
          <p class="text-base font-semibold text-red-500">
            {{ expiredDebitorUsd ? $formatNumber(expiredDebitorUsd.residual_amount) : 0 }} <span class="text-sm font-medium">USD</span>
          </p>
        </div>
      </nuxt-link>

      <!-- Creditor Card -->
      <nuxt-link :to="localePath({ name: 'credit-list' })" class="block group">
        <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 h-full">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconCreditor :width="28" :height="28" />
            </div>
            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{{ texts.payable }}</span>
          </div>
          <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('home.creditor') }}</h3>
          <p class="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
            {{ creditorUzs ? $formatNumber(creditorUzs.residual_amount) : 0 }} <span class="text-sm font-medium text-gray-500">UZS</span>
          </p>
          <p class="text-base font-semibold text-gray-700">
            {{ creditorUsd ? $formatNumber(creditorUsd.residual_amount) : 0 }} <span class="text-sm font-medium text-gray-500">USD</span>
          </p>
        </div>
      </nuxt-link>

      <!-- Expired Creditor Card -->
      <nuxt-link :to="localePath({ name: 'expired-type', params: { type: 'creditor' } })" class="block group">
        <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 border-l-4 border-red-500 h-full">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-success-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconExpiredC :width="28" :height="28" />
            </div>
            <span class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">{{ texts.overdue }}</span>
          </div>
          <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('home.expiredC') }}</h3>
          <p class="text-xl lg:text-2xl font-bold text-red-600 mb-1">
            {{ expiredCreditorUzs ? $formatNumber(expiredCreditorUzs.residual_amount) : 0 }} <span class="text-sm font-medium">UZS</span>
          </p>
          <p class="text-base font-semibold text-red-500">
            {{ expiredCreditorUsd ? $formatNumber(expiredCreditorUsd.residual_amount) : 0 }} <span class="text-sm font-medium">USD</span>
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
