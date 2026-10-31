<template>
  <!-- Umumiy ko'rinish (shartnoma va daftari nisbati) — sarlavhasiz.
       "Asosiy ko'rsatkichlar" (2 card + drill-down) va "Umumiy ko'rinish"
       sarlavhasi foydalanuvchi so'roviga ko'ra olib tashlandi. -->
  <div class="mt-6 lg:mt-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Berilgan / Olingan qarz — 3 manba nisbati:
           Qarz shartnomasi + Qarz daftari + Shaxsiy qarz -->
      <div
        v-for="card in overviewCards"
        :key="card.key"
        class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-center justify-between mb-5">
          <div>
            <!-- SS1-1 (2026-09-20): "Shartnoma va daftari nisbati" tagsarlavhasi OLIB TASHLANDI. -->
            <h3 class="text-lg font-bold text-gray-900">{{ card.title }}</h3>
          </div>
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="card.iconBg">
            <svg class="w-5 h-5" :class="card.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="card.iconPath" />
            </svg>
          </div>
        </div>

        <!-- Jami (UZS hisobida; USD kurs bo'yicha qo'shilgan) + ulushlar -->
        <div class="flex items-end justify-between mb-4">
          <div>
            <!-- SS14-1 (2026-09-21): "Jami" tagsarlavhasi OLIB TASHLANDI —
                 katta raqamning o'zi allaqachon tushunarli. -->
            <p class="text-2xl font-bold text-gray-900">{{ formatFull(card.totalUzs) }}</p>
            <!-- SS-DEV (2026-09-23): kurs qatori USD qarz bo'lmasa ham ko'rsatiladi —
                 aks holda ikki kartaning balandligi farq qilib, diagramma
                 tepaga "sakrab" chiqardi. Kurs butun so'mgacha yaxlitlanadi
                 (11 839.59 -> 11 840; formatFull kasrni "839 59" qilib buzardi). -->
            <p v-if="daftariUsdRate > 0" class="text-xs text-gray-400 mt-0.5">
              {{ ratioTexts.usdRateLabel }}: 1 USD = {{ formatFull(Math.round(daftariUsdRate)) }} UZS
            </p>
          </div>
          <div class="flex items-center gap-3 text-xs pb-1">
            <span v-for="part in card.parts" :key="part.key" class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm inline-block" :class="part.dotClass"></span>
              <span class="text-gray-600 font-medium">{{ part.pct }}%</span>
            </span>
          </div>
        </div>

        <!-- Gorizontal stacked bar (3 bo'lak) -->
        <div class="zx-ratio-track">
          <div
            v-for="part in card.parts"
            :key="part.key"
            class="zx-ratio-seg"
            :class="part.segClass"
            :style="{ width: part.pct + '%' }"
            :title="part.label + ': ' + part.pct + '%'"
          >
            <span v-if="part.pct >= 15" class="zx-ratio-pct">{{ part.pct }}%</span>
          </div>
          <div v-if="card.totalUzs === 0" class="zx-ratio-empty">
            <span>{{ ratioTexts.noData }}</span>
          </div>
        </div>

        <!-- 3 ta kichik katak — UZS va USD alohida -->
        <div class="grid grid-cols-3 gap-2 mt-4">
          <div v-for="part in card.parts" :key="part.key" class="zx-ratio-card" :class="part.cardClass">
            <!-- SS14-2 (2026-09-21): sarlavha BIR QATORDA sig'ishi kerak ("shartnomasi"
                 pastki qatorga TUSHMASIN). 2-qatorli yechim (2026-09-20) bekor qilindi.
                 Uchala sarlavha bir xil o'lchamda qolishi uchun shrift va harflar
                 orasi zx-ratio-label da siqilgan; o'ralish butunlay taqiqlangan. -->
            <p class="zx-ratio-label text-gray-500 font-medium mb-2" :title="part.label">{{ part.label }}</p>
            <!-- SS1-2: summalar K / M / B shaklida qisqartiriladi -->
            <p class="text-sm font-bold text-gray-900 leading-tight">
              {{ formatShort(part.uzs) }} <span class="text-xs font-normal text-gray-400">UZS</span>
            </p>
            <p class="text-xs font-semibold text-gray-700 mt-0.5 leading-tight">
              {{ formatShort(part.usd) }} <span class="text-xs font-normal text-gray-400">USD</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
// wave D: pages/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'IndexRatioOverview',
  props: {
    overviewCards: { type: null, default: undefined },
    formatFull: { type: Function, default: undefined },
    daftariUsdRate: { type: null, default: undefined },
    ratioTexts: { type: null, default: undefined },
    formatShort: { type: Function, default: undefined },
  },
};
</script>

<style scoped src="../../assets/page-styles/index/IndexRatioOverview.css"></style>
