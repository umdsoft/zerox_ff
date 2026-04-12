<template>
  <div class="dashboard-chart">
    <!-- Ma'lumot bor -->
    <template v-if="total > 0">
      <client-only>
        <apexchart
          type="donut"
          :width="chartSize"
          :height="chartSize"
          :options="chartOptions"
          :series="series"
        />
      </client-only>
    </template>

    <!-- Ma'lumot yo'q -->
    <template v-else>
      <div class="empty-chart" :style="{ width: chartSize + 'px', height: chartSize + 'px' }">
        <div class="empty-chart__inner">
          <svg class="empty-chart__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <span class="empty-chart__text">{{ texts.noData }}</span>
        </div>
      </div>
    </template>

    <!-- Legend -->
    <div class="chart-legend">
      <div class="chart-legend__item">
        <span class="chart-legend__dot chart-legend__dot--blue"></span>
        <span class="chart-legend__label">{{ texts.shartnoma }}</span>
        <span class="chart-legend__value">{{ shartnomaPct }}%</span>
      </div>
      <div class="chart-legend__item">
        <span class="chart-legend__dot chart-legend__dot--green"></span>
        <span class="chart-legend__label">{{ texts.daftari }}</span>
        <span class="chart-legend__value">{{ daftariPct }}%</span>
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
    size: {
      type: Number,
      default: 180,
    },
  },
  computed: {
    chartSize: function () { return this.size; },
    shartnomaTotal: function () {
      return ((this.shartnoma && this.shartnoma.uzs) || 0) + ((this.shartnoma && this.shartnoma.usd) || 0);
    },
    daftariTotal: function () {
      return ((this.daftari && this.daftari.uzs) || 0) + ((this.daftari && this.daftari.usd) || 0);
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
    series: function () {
      return [this.shartnomaTotal, this.daftariTotal];
    },
    texts: function () {
      var l = (this.$i18n && this.$i18n.locale) || 'uz';
      var t = {
        uz: { shartnoma: 'Shartnoma', daftari: 'Daftari', noData: "Ma'lumot yo'q" },
        ru: { shartnoma: 'Договор', daftari: 'Книга', noData: 'Нет данных' },
        kr: { shartnoma: 'Шартнома', daftari: 'Дафтари', noData: "Маълумот йўқ" },
      };
      return t[l] || t.uz;
    },
    chartOptions: function () {
      var self = this;
      return {
        chart: {
          type: 'donut',
          sparkline: { enabled: false },
        },
        labels: [self.texts.shartnoma, self.texts.daftari],
        colors: ['#3B82F6', '#22C55E'],
        legend: { show: false },
        dataLabels: { enabled: false },
        stroke: { width: 2, colors: ['#fff'] },
        plotOptions: {
          pie: {
            donut: {
              size: '65%',
              labels: {
                show: true,
                name: { show: true, fontSize: '12px', color: '#6B7280' },
                value: {
                  show: true,
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#111827',
                  formatter: function (val) { return self.formatNumber(val); },
                },
                total: {
                  show: true,
                  label: 'Jami',
                  fontSize: '11px',
                  color: '#9CA3AF',
                  formatter: function () { return self.formatNumber(self.total); },
                },
              },
            },
          },
        },
        tooltip: {
          y: { formatter: function (val) { return self.formatNumber(val); } },
        },
      };
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
.dashboard-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-chart {
  border-radius: 50%;
  background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-chart__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.empty-chart__icon {
  width: 28px;
  height: 28px;
  color: #9CA3AF;
}

.empty-chart__text {
  font-size: 11px;
  color: #9CA3AF;
  font-weight: 500;
}

.chart-legend {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.chart-legend__item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chart-legend__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chart-legend__dot--blue {
  background-color: #3B82F6;
}

.chart-legend__dot--green {
  background-color: #22C55E;
}

.chart-legend__label {
  font-size: 12px;
  color: #6B7280;
}

.chart-legend__value {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}
</style>
