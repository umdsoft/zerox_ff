<template>
  <div class="ratio-chart">
    <!-- Sarlavha yuqorida: Jami (UZS hisobida, USD kurs bo'yicha qo'shilgan) -->
    <div class="flex items-end justify-between mb-4">
      <div>
        <p class="text-xs text-gray-500 mb-0.5">{{ texts.totalLabel }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ formatNumber(totalUzsCombined) }}</p>
        <p v-if="usdRate > 0 && (totalUsd > 0)" class="text-xs text-gray-400 mt-0.5">
          {{ texts.usdRateLabel }}: 1 USD = {{ formatNumber(usdRate) }} UZS
        </p>
      </div>
      <div class="flex items-center gap-4 text-xs pb-1">
        <span class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
          <span class="text-gray-600 font-medium">{{ shartnomaPct }}%</span>
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block"></span>
          <span class="text-gray-600 font-medium">{{ daftariPct }}%</span>
        </span>
      </div>
    </div>

    <!-- Gorizontal stacked bar -->
    <div class="ratio-bar">
      <div class="ratio-bar__track">
        <div
          class="ratio-bar__segment ratio-bar__segment--shartnoma"
          :style="{ width: shartnomaPct + '%' }"
          :title="texts.shartnoma + ': ' + shartnomaPct + '%'"
        >
          <span v-if="shartnomaPct >= 15" class="ratio-bar__pct">{{ shartnomaPct }}%</span>
        </div>
        <div
          class="ratio-bar__segment ratio-bar__segment--daftari"
          :style="{ width: daftariPct + '%' }"
          :title="texts.daftari + ': ' + daftariPct + '%'"
        >
          <span v-if="daftariPct >= 15" class="ratio-bar__pct">{{ daftariPct }}%</span>
        </div>
        <div v-if="totalUzsCombined === 0" class="ratio-bar__empty">
          <span>{{ texts.noData }}</span>
        </div>
      </div>
    </div>

    <!-- Legend va qiymatlar — UZS va USD alohida -->
    <div class="grid grid-cols-2 gap-3 mt-4">
      <div class="ratio-card ratio-card--shartnoma">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
          <p class="text-xs text-gray-500 font-medium">{{ texts.shartnoma }}</p>
        </div>
        <p class="text-base font-bold text-gray-900 leading-tight">
          {{ formatNumber(shartnomaUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span>
        </p>
        <p class="text-sm font-semibold text-gray-700 mt-0.5 leading-tight">
          {{ formatNumber(shartnomaUsd) }} <span class="text-xs font-normal text-gray-400">USD</span>
        </p>
      </div>
      <div class="ratio-card ratio-card--daftari">
        <div class="flex items-center gap-2 mb-2">
          <span class="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block"></span>
          <p class="text-xs text-gray-500 font-medium">{{ texts.daftari }}</p>
        </div>
        <p class="text-base font-bold text-gray-900 leading-tight">
          {{ formatNumber(daftariUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span>
        </p>
        <p class="text-sm font-semibold text-gray-700 mt-0.5 leading-tight">
          {{ formatNumber(daftariUsd) }} <span class="text-xs font-normal text-gray-400">USD</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardChart',
  props: {
    shartnoma: {
      type: Object,
      default: function () { return { uzs: 0, usd: 0 }; },
    },
    daftari: {
      type: Object,
      default: function () { return { uzs: 0, usd: 0 }; },
    },
    /**
     * USD/UZS kursi (Markaziy bank).
     * Agar 0 yoki undefined bo'lsa — USD summasi UZS yig'indiga qo'shilmaydi.
     */
    usdRate: { type: Number, default: 0 },
  },
  computed: {
    shartnomaUzs() { return Number((this.shartnoma && this.shartnoma.uzs) || 0); },
    shartnomaUsd() { return Number((this.shartnoma && this.shartnoma.usd) || 0); },
    daftariUzs() { return Number((this.daftari && this.daftari.uzs) || 0); },
    daftariUsd() { return Number((this.daftari && this.daftari.usd) || 0); },

    totalUsd() { return this.shartnomaUsd + this.daftariUsd; },

    /**
     * Shartnoma jami UZS hisobida (USD kurs bo'yicha o'girilgan)
     */
    shartnomaTotalInUzs() {
      const usdInUzs = this.usdRate > 0 ? this.shartnomaUsd * this.usdRate : 0;
      return Math.round(this.shartnomaUzs + usdInUzs);
    },
    daftariTotalInUzs() {
      const usdInUzs = this.usdRate > 0 ? this.daftariUsd * this.usdRate : 0;
      return Math.round(this.daftariUzs + usdInUzs);
    },
    totalUzsCombined() {
      return this.shartnomaTotalInUzs + this.daftariTotalInUzs;
    },

    shartnomaPct() {
      if (!this.totalUzsCombined) return 0;
      return Math.round((this.shartnomaTotalInUzs / this.totalUzsCombined) * 100);
    },
    daftariPct() {
      if (!this.totalUzsCombined) return 0;
      return Math.round((this.daftariTotalInUzs / this.totalUzsCombined) * 100);
    },

    texts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz';
      const t = {
        uz: { totalLabel: 'Jami', shartnoma: 'Qarz shartnomasi', daftari: 'Qarz daftari', noData: "Ma'lumot yo'q", usdRateLabel: 'Markaziy bank kursi' },
        ru: { totalLabel: 'Всего', shartnoma: 'По договору', daftari: 'По книге', noData: 'Нет данных', usdRateLabel: 'Курс ЦБ' },
        kr: { totalLabel: 'Жами', shartnoma: 'Қарз шартномаси', daftari: 'Қарз дафтари', noData: "Маълумот йўқ", usdRateLabel: 'Марказий банк курси' },
      };
      return t[l] || t.uz;
    },
  },
  methods: {
    formatNumber(n) {
      return Number(n || 0).toLocaleString('uz-UZ');
    },
  },
};
</script>

<style scoped>
.ratio-chart {
  width: 100%;
}

.ratio-bar {
  width: 100%;
}

.ratio-bar__track {
  display: flex;
  width: 100%;
  height: 32px;
  background-color: #F3F4F6;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.ratio-bar__segment {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.4s ease;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}

.ratio-bar__segment--shartnoma {
  background: linear-gradient(90deg, #3B82F6 0%, #2563EB 100%);
}

.ratio-bar__segment--daftari {
  background: linear-gradient(90deg, #22C55E 0%, #16A34A 100%);
}

.ratio-bar__pct {
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 0 8px;
}

.ratio-bar__empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F3F4F6;
  color: #9CA3AF;
  font-size: 13px;
  font-weight: 500;
}

.ratio-card {
  padding: 12px 14px;
  border-radius: 10px;
  background-color: #F9FAFB;
  border: 1px solid #F3F4F6;
}

.ratio-card--shartnoma {
  background-color: #EFF6FF;
  border-color: #DBEAFE;
}

.ratio-card--daftari {
  background-color: #F0FDF4;
  border-color: #DCFCE7;
}
</style>
