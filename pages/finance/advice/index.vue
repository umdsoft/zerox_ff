<template>
  <div class="advice-page pb-8">
    <!-- Page Header -->
    <div class="mb-6">
      <nuxt-link :to="localePath({ name: 'finance' })" class="text-indigo-600 hover:text-indigo-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.advice_title') }}</h1>
      <p class="text-gray-500 mt-1">{{ $t('finance.advice_subtitle') }}</p>
    </div>

    <!-- Oylik xulosa -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p class="text-indigo-100 text-sm">{{ $t('finance.total_income') }}</p>
          <p class="text-2xl font-bold mt-1">{{ formatCompact(data.income_uzs) }}</p>
        </div>
        <div>
          <p class="text-indigo-100 text-sm">{{ $t('finance.total_expense') }}</p>
          <p class="text-2xl font-bold mt-1">{{ formatCompact(data.expense_uzs) }}</p>
        </div>
        <div>
          <p class="text-indigo-100 text-sm">{{ $t('finance.balance') }}</p>
          <p class="text-2xl font-bold mt-1">{{ formatCompact((data.income_uzs || 0) - (data.expense_uzs || 0)) }}</p>
        </div>
      </div>
    </div>

    <!-- Yuklanmoqda -->
    <div v-if="loading" class="bg-white rounded-2xl p-12 shadow-sm text-center text-gray-400">
      {{ $t('common.loading') }}
    </div>

    <!-- Tavsiyalar -->
    <div v-else class="space-y-4">
      <div
        v-for="(rec, i) in recommendations"
        :key="i"
        class="rounded-2xl p-5 border-l-4 shadow-sm flex items-start"
        :class="cardClass(rec.severity)"
      >
        <span class="text-2xl mr-4 flex-shrink-0">{{ rec.icon || '💡' }}</span>
        <div class="min-w-0">
          <h3 class="font-bold text-gray-900">{{ rec.title }}</h3>
          <p class="text-gray-700 mt-1 leading-relaxed">{{ rec.text }}</p>
        </div>
      </div>

      <div v-if="!recommendations.length" class="bg-white rounded-2xl p-12 shadow-sm text-center text-gray-400">
        <p>{{ $t('finance.reports_no_data') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanceAdvice',
  middleware: 'auth',

  data() {
    return {
      data: { income_uzs: 0, expense_uzs: 0, recommendations: [] },
      loading: true
    }
  },

  computed: {
    recommendations() {
      return this.data.recommendations || []
    }
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.loading = true
        const res = await this.$api.getFinanceRecommendations()
        if (res && res.data && res.data.success) {
          this.data = res.data.data
        }
      } catch (error) {
        console.error('Recommendations error:', error)
        this.$toast && this.$toast.error && this.$toast.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    // Severity → karta rangi (danger=qizil, warning=sariq, success=yashil, info=ko'k)
    cardClass(severity) {
      const map = {
        danger: 'bg-red-50 border-red-500',
        warning: 'bg-amber-50 border-amber-500',
        success: 'bg-green-50 border-green-500',
        info: 'bg-blue-50 border-blue-500'
      }
      return map[severity] || 'bg-gray-50 border-gray-300'
    },

    // Million/ming yaxlitlash: 1500000 -> "1.5M so'm"
    formatCompact(v) {
      const n = Math.round(Number(v) || 0)
      const abs = Math.abs(n)
      if (abs >= 1e6) {
        const m = n / 1e6
        return (Number.isInteger(m) ? m : m.toFixed(1)) + 'M so\'m'
      }
      if (abs >= 1e3) {
        const k = n / 1e3
        return (Number.isInteger(k) ? k : k.toFixed(1)) + 'K so\'m'
      }
      return n.toLocaleString('uz-UZ') + ' so\'m'
    }
  }
}
</script>
