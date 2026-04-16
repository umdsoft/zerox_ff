<template>
  <div class="ratio-chart">
    <!-- Sarlavha yuqorida -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <p class="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{{ texts.totalLabel }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ formatNumber(total) }}</p>
      </div>
      <div class="flex items-center gap-4 text-xs">
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

    <!-- Gorizontal stacked bar chart (nisbat) -->
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
        <div v-if="total === 0" class="ratio-bar__empty">
          <span>{{ texts.noData }}</span>
        </div>
      </div>
    </div>

    <!-- Legend va qiymatlar -->
    <div class="grid grid-cols-2 gap-3 mt-4">
      <div class="ratio-card ratio-card--shartnoma">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
          <p class="text-xs text-gray-500 font-medium">{{ texts.shartnoma }}</p>
        </div>
        <p class="text-base font-bold text-gray-900">{{ formatNumber(shartnomaTotal) }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ currencyLabel }}</p>
      </div>
      <div class="ratio-card ratio-card--daftari">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block"></span>
          <p class="text-xs text-gray-500 font-medium">{{ texts.daftari }}</p>
        </div>
        <p class="text-base font-bold text-gray-900">{{ formatNumber(daftariTotal) }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ currencyLabel }}</p>
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
    currency: { type: String, default: 'combined' }, // 'combined' | 'UZS' | 'USD'
  },
  computed: {
    shartnomaTotal: function () {
      if (this.currency === 'UZS') return Number((this.shartnoma && this.shartnoma.uzs) || 0);
      if (this.currency === 'USD') return Number((this.shartnoma && this.shartnoma.usd) || 0);
      return Number((this.shartnoma && this.shartnoma.uzs) || 0) + Number((this.shartnoma && this.shartnoma.usd) || 0);
    },
    daftariTotal: function () {
      if (this.currency === 'UZS') return Number((this.daftari && this.daftari.uzs) || 0);
      if (this.currency === 'USD') return Number((this.daftari && this.daftari.usd) || 0);
      return Number((this.daftari && this.daftari.uzs) || 0) + Number((this.daftari && this.daftari.usd) || 0);
    },
    total: function () {
      return this.shartnomaTotal + this.daftariTotal;
    },
    shartnomaPct: function () {
      if (!this.total) return 0;
      return Math.round((this.shartnomaTotal / this.total) * 100);
    },
    daftariPct: function () {
      if (!this.total) return 0;
      return Math.round((this.daftariTotal / this.total) * 100);
    },
    currencyLabel: function () {
      return this.currency === 'combined' ? 'UZS + USD' : this.currency;
    },
    texts: function () {
      var l = (this.$i18n && this.$i18n.locale) || 'uz';
      var t = {
        uz: { totalLabel: 'Jami', shartnoma: 'Qarz shartnomasi', daftari: 'Qarz daftari', noData: "Ma'lumot yo'q" },
        ru: { totalLabel: 'Всего', shartnoma: 'Договор', daftari: 'Книга', noData: 'Нет данных' },
        kr: { totalLabel: 'Жами', shartnoma: 'Қарз шартномаси', daftari: 'Қарз дафтари', noData: "Маълумот йўқ" },
      };
      return t[l] || t.uz;
    },
  },
  methods: {
    formatNumber: function (n) {
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
