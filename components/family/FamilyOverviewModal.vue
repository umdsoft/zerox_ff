<template>
  <!-- ===== Overview modali ===== -->
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div class="absolute inset-0 bg-black/50" @click="showOverview = false"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl p-5 shadow-xl overflow-y-auto" style="max-height: 90vh;">
      <div class="flex items-center justify-between mb-3 sticky top-0 bg-white z-10 -mx-5 px-5 pt-1 pb-2">
        <h3 class="text-lg font-bold text-gray-900">{{ overviewName }} — {{ $t('finance.family_overview_title') }}</h3>
        <button class="text-gray-400 hover:text-gray-600" @click="showOverview = false"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
      </div>

      <!-- Oy navigatori (davr bo'yicha ko'rish) -->
      <div class="flex items-center justify-center gap-3 mb-4 bg-gray-50 rounded-xl py-2">
        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-indigo-600" @click="overviewChangeMonth(-1)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg></button>
        <span class="text-sm font-semibold text-gray-800 w-32 text-center">{{ overviewMonthLabel }}</span>
        <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-indigo-600" @click="overviewChangeMonth(1)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      </div>

      <div v-if="overviewLoading" class="flex justify-center py-10"><div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>

      <div v-else-if="overview" class="grid sm:grid-cols-2 gap-3">
        <!-- B30-3: Umumiy qoldiq (barcha davr, UZS'ga aylantirilgan) — bu oy qoldig'idan oldin -->
        <div v-if="overview.all_balance_uzs != null" class="bg-violet-50 rounded-xl p-4 sm:col-span-2">
          <p class="text-xs text-violet-700 font-semibold mb-1">💼 {{ $t('finance.family_ov_total_balance') }}</p>
          <p class="text-lg font-bold" :class="overview.all_balance_uzs >= 0 ? 'text-violet-800' : 'text-red-700'">{{ overview.all_balance_uzs >= 0 ? '+' : '' }}{{ formatMoney(overview.all_balance_uzs) }} UZS</p>
        </div>
        <!-- Qoldiq (bu oy) — daromad - xarajat, UZS/USD alohida -->
        <div v-if="overviewBalance.length" class="bg-indigo-50 rounded-xl p-4 sm:col-span-2">
          <p class="text-xs text-indigo-700 font-semibold mb-1">💰 {{ $t('finance.family_ov_balance') }}</p>
          <p v-for="b in overviewBalance" :key="'bal'+b.currency" class="text-lg font-bold" :class="b.net >= 0 ? 'text-indigo-800' : 'text-red-700'">{{ b.net >= 0 ? '+' : '' }}{{ formatMoney(b.net) }} {{ b.currency }}</p>
        </div>
        <!-- T3a: Belgilangan limit + shu oyda ishlatilgani -->
        <div v-if="overviewLimitInfo" class="bg-amber-50 rounded-xl p-4 sm:col-span-2">
          <div class="flex items-baseline justify-between mb-1">
            <p class="text-xs text-amber-700 font-semibold">💸 {{ $t('finance.family_overall_limit') }}</p>
            <span class="text-xs font-bold" :class="overviewLimitInfo.over ? 'text-red-600' : 'text-amber-700'">{{ overviewLimitInfo.rawPct }}%</span>
          </div>
          <p class="text-base font-bold text-amber-800">{{ formatMoney(overviewLimitInfo.spent) }} / {{ formatMoney(overviewLimitInfo.limit) }} {{ overviewLimitInfo.currency }}</p>
          <div class="w-full bg-amber-100 rounded-full h-1.5 mt-2"><div class="h-1.5 rounded-full" :class="overviewLimitInfo.over ? 'bg-red-500' : 'bg-amber-500'" :style="{ width: overviewLimitInfo.pct + '%' }"></div></div>
          <p v-if="overviewLimitInfo.over" class="text-xs text-red-600 mt-1 font-medium">⚠️ {{ $t('finance.family_limit_exceeded') }}</p>
          <p v-else class="text-xs text-amber-700 mt-1">{{ $t('finance.family_limit_remaining') }}: <b>{{ formatMoney(overviewLimitInfo.remaining) }} {{ overviewLimitInfo.currency }}</b></p>
          <div v-if="overviewLimitInfo.cats && overviewLimitInfo.cats.length" class="mt-2 space-y-2 border-t border-amber-100 pt-2">
            <div v-for="(cl, i) in overviewLimitInfo.cats" :key="'ovcl'+i">
              <div class="flex justify-between text-xs text-amber-700">
                <span>{{ catLabelById(cl.category_id) }}</span>
                <span :class="cl.over ? 'text-red-600 font-semibold' : ''"><b>{{ formatMoney(cl.spent) }}</b> / {{ formatMoney(cl.amount) }} {{ cl.currency }} ({{ cl.pct }}%)</span>
              </div>
              <div class="w-full bg-amber-100 rounded-full h-1 mt-1"><div class="h-1 rounded-full" :class="cl.over ? 'bg-red-500' : 'bg-amber-500'" :style="{ width: Math.min(100, cl.pct) + '%' }"></div></div>
            </div>
          </div>
        </div>
        <!-- Daromad -->
        <div v-if="overview.income" class="bg-green-50 rounded-xl p-4">
          <p class="text-xs text-green-700 font-semibold mb-1">➕ {{ $t('finance.family_sec_income') }}</p>
          <p v-for="c in overview.income.by_currency" :key="'ic'+c.currency" class="text-base font-bold text-green-800">{{ formatMoney(c.total) }} {{ c.currency }}</p>
          <p v-if="!overview.income.by_currency.length" class="text-base font-bold text-green-800">0 UZS</p>
          <div v-if="overview.income.by_category && overview.income.by_category.length" class="mt-2 space-y-1">
            <div v-for="(c, i) in overview.income.by_category.slice(0,6)" :key="'icc'+i" class="flex justify-between text-xs text-green-800/80"><span>{{ c.icon || '💰' }} {{ catName(c.name) }}</span><span>{{ formatMoney(c.total) }} {{ c.currency }}</span></div>
          </div>
        </div>
        <!-- Xarajat -->
        <div v-if="overview.expense" class="bg-red-50 rounded-xl p-4">
          <p class="text-xs text-red-700 font-semibold mb-1">➖ {{ $t('finance.family_sec_expense') }}</p>
          <p v-for="c in overview.expense.by_currency" :key="'ec'+c.currency" class="text-base font-bold text-red-800">{{ formatMoney(c.total) }} {{ c.currency }}</p>
          <p v-if="!overview.expense.by_currency.length" class="text-base font-bold text-red-800">0 UZS</p>
          <div v-if="overview.expense.by_category && overview.expense.by_category.length" class="mt-2 space-y-1">
            <div v-for="(c, i) in overview.expense.by_category.slice(0,6)" :key="'ecc'+i" class="flex justify-between text-xs text-red-800/80"><span>{{ c.icon || '📦' }} {{ catName(c.name) }}</span><span>{{ formatMoney(c.total) }} {{ c.currency }}</span></div>
          </div>
        </div>
        <!-- Kutilayotgan daromad -->
        <div v-if="overview.scheduled_income" class="bg-white border border-gray-100 rounded-xl p-4">
          <p class="text-sm font-semibold text-gray-700 mb-2">⏳ {{ $t('finance.family_sec_sched_income') }}</p>
          <div v-for="(r, i) in overview.scheduled_income" :key="'si'+i" class="flex justify-between text-xs text-gray-600 mb-1"><span>{{ r.title || '—' }} <span class="text-gray-400">{{ r.next_date }}</span></span><span class="font-semibold">{{ formatMoney(r.amount) }} {{ r.currency }}</span></div>
          <p v-if="!overview.scheduled_income.length" class="text-xs text-gray-400">{{ $t('finance.family_no_data') }}</p>
        </div>
        <!-- Rejalashtirilgan to'lov -->
        <div v-if="overview.scheduled_payment" class="bg-white border border-gray-100 rounded-xl p-4">
          <p class="text-sm font-semibold text-gray-700 mb-2">🗓 {{ $t('finance.family_sec_sched_payment') }}</p>
          <div v-for="(r, i) in overview.scheduled_payment" :key="'sp'+i" class="flex justify-between text-xs text-gray-600 mb-1"><span>{{ r.title || '—' }} <span class="text-gray-400">{{ r.next_date }}</span></span><span class="font-semibold">{{ formatMoney(r.amount) }} {{ r.currency }}</span></div>
          <p v-if="!overview.scheduled_payment.length" class="text-xs text-gray-400">{{ $t('finance.family_no_data') }}</p>
        </div>
        <!-- Maqsadlar -->
        <div v-if="overview.goals" class="bg-white border border-gray-100 rounded-xl p-4">
          <p class="text-sm font-semibold text-gray-700 mb-2">🎯 {{ $t('finance.family_sec_goals') }}</p>
          <template v-if="overview.goals.items">
            <div v-for="(g, i) in overview.goals.items" :key="'g'+i" class="mb-2">
              <div class="flex justify-between text-xs text-gray-600"><span>{{ g.name }}</span><span>{{ formatMoney(g.current) }} / {{ formatMoney(g.target) }} {{ g.currency }}</span></div>
              <div class="w-full bg-gray-100 rounded-full h-1.5 mt-1"><div class="bg-indigo-500 h-1.5 rounded-full" :style="{ width: pct(g.current, g.target) + '%' }"></div></div>
            </div>
          </template>
          <template v-else>
            <p class="text-xs text-gray-500">{{ overview.goals.count }} — {{ formatMoney(overview.goals.current_total) }} / {{ formatMoney(overview.goals.target_total) }} UZS</p>
          </template>
        </div>

        <div v-if="!hasAnyOverview" class="bg-gray-50 rounded-xl p-4 text-sm text-gray-400 text-center">{{ $t('finance.family_ov_no_perm') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// wave D: pages/finance/family/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'FamilyOverviewModal',
  props: {
    overviewName: { type: null, default: undefined },
    overviewChangeMonth: { type: Function, default: undefined },
    overviewMonthLabel: { type: null, default: undefined },
    overviewLoading: { type: null, default: undefined },
    overview: { type: null, default: undefined },
    formatMoney: { type: Function, default: undefined },
    overviewBalance: { type: null, default: undefined },
    overviewLimitInfo: { type: null, default: undefined },
    catLabelById: { type: Function, default: undefined },
    catName: { type: Function, default: undefined },
    pct: { type: Function, default: undefined },
    hasAnyOverview: { type: null, default: undefined },
  },
};
</script>
