<template>
  <!-- 22.10 "Qarzdan chiqish": umumiy qoldiq grafigi (schedule[].totalRemaining). Bir nechta chiziq —
       "Agar" kalkulyatorida reja va yangi variant yonma-yon. apexcharts loyihada bor (finance/index.vue). -->
  <div>
    <client-only>
      <apexchart type="area" :height="height" :options="options" :series="apexSeries" />
      <div slot="placeholder" :style="{ height: height + 'px' }" class="flex items-center justify-center text-gray-300 text-sm">…</div>
    </client-only>
  </div>
</template>

<script>
import { ymShort, ymLabel, fmtSum } from '@/utils/debtPlan'

export default {
  name: 'RemainingChart',
  props: {
    // [{ name, color, points: [{ ym, value }] }]
    series: { type: Array, required: true },
    height: { type: Number, default: 260 },
  },
  computed: {
    categories() {
      const longest = this.series.reduce((a, s) => (s.points.length > a.length ? s.points : a), [])
      return longest.map((p) => p.ym)
    },
    apexSeries() {
      return this.series.map((s) => ({
        name: s.name,
        data: this.categories.map((ym, i) => {
          const p = s.points[i]
          return p ? Math.round(p.value) : 0
        }),
      }))
    },
    options() {
      const t = this.$t.bind(this)
      const locale = this.$i18n.locale
      return {
        chart: { type: 'area', fontFamily: 'inherit', toolbar: { show: false }, zoom: { enabled: false }, animations: { speed: 400 } },
        colors: this.series.map((s) => s.color || '#10B981'),
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: this.series.map((s, i) => (i === 0 ? 3 : 2)), dashArray: this.series.map((s) => (s.dashed ? 6 : 0)) },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.28, opacityTo: 0.02 } },
        xaxis: {
          categories: this.categories,
          tickAmount: Math.min(12, this.categories.length),
          labels: { formatter: (v) => ymShort(v, t), style: { fontSize: '10px', colors: '#94a3b8' }, rotate: 0, hideOverlappingLabels: true },
          axisBorder: { show: false },
          axisTicks: { show: false },
          tooltip: { enabled: false },
        },
        yaxis: { min: 0, labels: { formatter: (v) => this.short(v), style: { colors: '#94a3b8' } } },
        legend: { show: this.series.length > 1, position: 'top', horizontalAlign: 'right', fontFamily: 'inherit' },
        tooltip: {
          x: { formatter: (v, o) => ymLabel(this.categories[o && o.dataPointIndex != null ? o.dataPointIndex : 0], t, locale) },
          y: { formatter: (v) => fmtSum(v) + ' UZS' },
        },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
      }
    },
  },
  methods: {
    short(v) {
      const n = Number(v) || 0
      if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M'
      if (Math.abs(n) >= 1e3) return Math.round(n / 1e3) + 'K'
      return String(Math.round(n))
    },
  },
}
</script>
