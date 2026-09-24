<template>
  <div class="mt-6 lg:mt-8">
    <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.financialSummary }}</h2>
    <!-- SS-DEV (2026-09-24): 4 ta karta ENDI BIR XIL EMAS (foydalanuvchi talabi):
         "Berilgan qarz" va "Olingan qarz" — ASOSIY, to'q gradient fonli katta kartalar;
         ikkita "Muddati o'tgan" — YORDAMCHI, och qizil fonli, ixcham kartalar, har biri
         o'z asosiy kartasi YONIDA (juftlik). Shunda foydalanuvchi ko'z bilan ajratadi.
         ⚠️ Ranglar inline style/statik klasslarda — Tailwind JIT o'chiq. -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <!-- JUFTLIK 1: Berilgan qarz (debitor) + muddati o'tgan (debitor) -->
      <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 lg:gap-4">
        <nuxt-link :to="localePath({ name: 'debt-list' })" class="block group sm:col-span-3">
          <div class="rounded-2xl p-5 shadow-lg h-full text-white transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-0.5" style="background: linear-gradient(135deg, #2563EB 0%, #4338CA 100%);">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style="background: rgba(255,255,255,0.18);">
                <IconDebitor :width="28" :height="28" class="text-white" />
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full" style="background: rgba(255,255,255,0.18);">{{ texts.receivable }}</span>
            </div>
            <h3 class="text-sm font-medium mb-2" style="color: rgba(255,255,255,0.85);">{{ $t('home.debitor') }}</h3>
            <p class="text-2xl lg:text-3xl font-extrabold leading-tight mb-1">
              {{ debitorUzs ? $formatNumber(debitorUzs.residual_amount) : 0 }} <span class="text-sm font-medium" style="color: rgba(255,255,255,0.8);">UZS</span>
            </p>
            <p class="text-base font-semibold" style="color: rgba(255,255,255,0.9);">
              {{ debitorUsd ? $formatNumber(debitorUsd.residual_amount) : 0 }} <span class="text-sm font-medium" style="color: rgba(255,255,255,0.75);">USD</span>
            </p>
          </div>
        </nuxt-link>

        <nuxt-link :to="localePath({ name: 'expired-type', params: { type: 'debitor' } })" class="block group sm:col-span-2">
          <!-- SS-DEV (2026-09-24): yordamchi karta asosiy karta bilan BIR XIL skeletda (p-5, ikonka
               12, sarlavha, UZS katta qator, USD qator) — summalar bir QATORDA turadi (8-rasm). -->
          <div class="rounded-2xl p-5 h-full border border-dashed transition-all duration-300 hover:shadow-md" style="background: #FFF1F2; border-color: #FCA5A5;">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style="background: #FEE2E2;">
                <IconExpiredD :width="28" :height="28" />
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full" style="background: #FEE2E2; color: #B91C1C;">{{ texts.overdue }}</span>
            </div>
            <h3 class="text-sm font-medium mb-2" style="color: #9F1239;">{{ $t('home.expiredD') }}</h3>
            <p class="text-2xl lg:text-3xl font-extrabold leading-tight mb-1" style="color: #DC2626;">
              {{ expiredDebitorUzs ? $formatNumber(expiredDebitorUzs.residual_amount) : 0 }} <span class="text-sm font-medium" style="color: #EF4444;">UZS</span>
            </p>
            <p class="text-base font-semibold" style="color: #EF4444;">
              {{ expiredDebitorUsd ? $formatNumber(expiredDebitorUsd.residual_amount) : 0 }} <span class="text-sm font-medium" style="color: #F87171;">USD</span>
            </p>
          </div>
        </nuxt-link>
      </div>

      <!-- JUFTLIK 2: Olingan qarz (kreditor) + muddati o'tgan (kreditor) -->
      <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 lg:gap-4">
        <nuxt-link :to="localePath({ name: 'credit-list' })" class="block group sm:col-span-3">
          <div class="rounded-2xl p-5 shadow-lg h-full text-white transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-0.5" style="background: linear-gradient(135deg, #059669 0%, #0F766E 100%);">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style="background: rgba(255,255,255,0.18);">
                <IconCreditor :width="28" :height="28" class="text-white" />
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full" style="background: rgba(255,255,255,0.18);">{{ texts.payable }}</span>
            </div>
            <h3 class="text-sm font-medium mb-2" style="color: rgba(255,255,255,0.85);">{{ $t('home.creditor') }}</h3>
            <p class="text-2xl lg:text-3xl font-extrabold leading-tight mb-1">
              {{ creditorUzs ? $formatNumber(creditorUzs.residual_amount) : 0 }} <span class="text-sm font-medium" style="color: rgba(255,255,255,0.8);">UZS</span>
            </p>
            <p class="text-base font-semibold" style="color: rgba(255,255,255,0.9);">
              {{ creditorUsd ? $formatNumber(creditorUsd.residual_amount) : 0 }} <span class="text-sm font-medium" style="color: rgba(255,255,255,0.75);">USD</span>
            </p>
          </div>
        </nuxt-link>

        <nuxt-link :to="localePath({ name: 'expired-type', params: { type: 'creditor' } })" class="block group sm:col-span-2">
          <!-- SS-DEV (2026-09-24): yordamchi karta asosiy karta bilan BIR XIL skeletda (p-5, ikonka
               12, sarlavha, UZS katta qator, USD qator) — summalar bir QATORDA turadi (8-rasm). -->
          <div class="rounded-2xl p-5 h-full border border-dashed transition-all duration-300 hover:shadow-md" style="background: #FFF1F2; border-color: #FCA5A5;">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style="background: #FEE2E2;">
                <IconExpiredC :width="28" :height="28" />
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full" style="background: #FEE2E2; color: #B91C1C;">{{ texts.overdue }}</span>
            </div>
            <h3 class="text-sm font-medium mb-2" style="color: #9F1239;">{{ $t('home.expiredC') }}</h3>
            <p class="text-2xl lg:text-3xl font-extrabold leading-tight mb-1" style="color: #DC2626;">
              {{ expiredCreditorUzs ? $formatNumber(expiredCreditorUzs.residual_amount) : 0 }} <span class="text-sm font-medium" style="color: #EF4444;">UZS</span>
            </p>
            <p class="text-base font-semibold" style="color: #EF4444;">
              {{ expiredCreditorUsd ? $formatNumber(expiredCreditorUsd.residual_amount) : 0 }} <span class="text-sm font-medium" style="color: #F87171;">USD</span>
            </p>
          </div>
        </nuxt-link>
      </div>
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
