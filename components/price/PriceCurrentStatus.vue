<template>
    <div class="max-w-5xl mx-auto px-4 mb-10">
    <!-- 29.09: tarif muddati tugamoqda / tugagan — foydalanuvchi bexabar qolmasin -->
    <PriceExpiryAlert v-if="expiryAlert" class="mb-4" :expiry-alert="expiryAlert" @renew="$emit('renew', $event)" />
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <!-- Joriy tarif -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', currentPlan === 'premium' ? 'bg-purple-100 text-purple-600' : currentPlan === 'start' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500']">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          </div>
          <div>
            <p class="text-xs text-gray-500">{{ texts.currentPlan }}</p>
            <p class="text-lg font-bold text-gray-900">{{ planLabel }}</p>
          </div>
        </div>

        <!-- SMS balansi progress -->
        <div class="flex-1 md:max-w-md w-full">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-sm font-medium text-gray-700">{{ texts.smsBalance }}</span>
            <span :class="['text-sm font-bold', smsWarning ? 'text-red-600' : 'text-gray-900']">
              {{ (smsRemaining || 0) }} <span class="text-gray-400 font-normal">/ {{ smsTotal || 0 }}</span>
            </span>
          </div>
          <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              :class="['h-full rounded-full transition-all duration-500', smsWarning === 'empty' || smsWarning === 'critical' ? 'bg-red-500' : smsWarning === 'low' ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600']"
              :style="{ width: smsPercent + '%' }"
            ></div>
          </div>
          <p class="text-xs mt-1.5" :class="smsWarning ? 'text-red-500 font-medium' : 'text-gray-400'">
            {{ smsHint }}
          </p>
          <!-- SMS xabarlar tarixi tugmasi -->
          <div class="mt-3 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
              @click="$emit('open-sms-history')"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              {{ texts.smsHistoryBtn }}
            </button>
            <!-- 30.10: "Batafsil" — yuborilgan BARCHA SMS xabarlar alohida sahifada (/price/sms) -->
            <nuxt-link
              :to="localePath({ name: 'price-sms' })"
              class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              {{ texts.smsDetailsBtn }}
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </nuxt-link>
          </div>
        </div>
      </div>
      <!-- 29.09: tarif muddati — ulangan va tugash sanasi (tarif 1 oy amal qiladi) -->
      <div v-if="hasPaidPeriod" class="mt-5 pt-5 border-t border-gray-100">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-semibold text-gray-700">{{ texts.periodTitle }}</p>
          <p class="text-xs text-gray-400">{{ texts.monthNote }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="rounded-xl bg-gray-50 px-4 py-3">
            <p class="text-xs text-gray-500">{{ texts.periodStart }}</p>
            <p class="text-base font-bold text-gray-900 tabular-nums">{{ fmtDate(subStart) }}</p>
          </div>
          <div class="rounded-xl px-4 py-3" :class="subExpiringSoon ? 'bg-amber-50' : 'bg-gray-50'">
            <p class="text-xs text-gray-500">{{ texts.periodEnd }}</p>
            <p class="text-base font-bold tabular-nums" :class="subExpiringSoon ? 'text-amber-700' : 'text-gray-900'">{{ subEnd ? fmtDate(subEnd) : texts.unlimited }}</p>
          </div>
          <div class="rounded-xl px-4 py-3" :class="subExpiringSoon ? 'bg-amber-50' : 'bg-green-50'">
            <p class="text-xs text-gray-500">{{ texts.remainingLabel }}</p>
            <p class="text-base font-bold" :class="subExpiringSoon ? 'text-amber-700' : 'text-green-700'">{{ daysLeftText }}</p>
          </div>
        </div>
        <div v-if="periodPercent !== null" class="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500" :class="subExpiringSoon ? 'bg-amber-500' : 'bg-green-500'" :style="{ width: periodPercent + '%' }"></div>
        </div>
        <!-- 30.09: tarif SMS'lari keyingi oyga o'tmaydi — davr oxirida kuyadi -->
        <p class="mt-3 text-xs text-gray-500 leading-snug">{{ smsBurnText }}</p>
      </div>
      <!-- 30.10: SMS boshqaruvi + foydalanish ko'rsatkichi — Tariflarga kirilganda HAR DOIM ko'rinadi (pullik emas) -->
      <!-- SMS boshqaruvi (sahifa beradi: ref/scroll sahifada qoladi) -->
      <slot />
    </div>
  </div>
</template>

<script>
// wave D: pages/price/index.vue dan ajratilgan ("Joriy holat" kartochkasi). Holat va so'rovlar sahifada: props pastga, hodisalar yuqoriga.
import PriceExpiryAlert from '~/components/price/PriceExpiryAlert.vue';
import { fmtTariffDate } from '~/utils/priceCheckout';
export default {
  name: 'PriceCurrentStatus',
  components: { PriceExpiryAlert },
  props: {
    texts: { type: Object, required: true },
    expiryAlert: { type: Object, default: null },
    currentPlan: { type: String, default: 'free' },
    planLabel: { type: String, default: '' },
    smsWarning: { type: String, default: null },
    smsRemaining: { type: Number, default: null },
    smsTotal: { type: Number, default: 0 },
    smsPercent: { type: Number, default: 0 },
    smsHint: { type: String, default: '' },
    hasPaidPeriod: { type: Boolean, default: false },
    subStart: { type: null, default: null },
    subEnd: { type: null, default: null },
    subExpiringSoon: { type: Boolean, default: false },
    daysLeftText: { type: String, default: '' },
    periodPercent: { type: Number, default: null },
    smsBurnText: { type: String, default: '' },
  },
  methods: {
    fmtDate(value) { return fmtTariffDate(value); },
  },
};
</script>
