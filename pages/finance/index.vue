<template>
  <div class="finance-dashboard pb-8">
    <!-- Page Header — Qarz daftari uslubida: sarlavha chapda, asosiy 2 amal o'ngda -->
    <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.title') }}</h1>
        <p class="text-gray-500 mt-1">{{ $t('finance.subtitle') }}</p>
      </div>
      <!-- Asosiy amallar: Xarajat qo'shish (qizil) / Daromad qo'shish (yashil) -->
      <div class="flex flex-wrap gap-2 mt-4 md:mt-0">
        <nuxt-link
          :to="localePath({ name: 'finance-expenses-add' })"
          class="inline-flex items-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          {{ $t('finance.add_expense') }}
        </nuxt-link>
        <nuxt-link
          :to="localePath({ name: 'finance-income-add' })"
          class="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          {{ $t('finance.add_income') }}
        </nuxt-link>
      </div>
    </div>

    <!-- Ikkilamchi navigatsiya (asosiy amallar ostida, qulayroq joylashuv) -->
    <div class="flex flex-wrap gap-2 mb-6">
      <nuxt-link
        :to="localePath({ name: 'finance-analytics' })"
        class="inline-flex items-center px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        {{ $t('finance.view_analytics') }}
      </nuxt-link>
      <nuxt-link
        :to="localePath({ name: 'finance-goals-add' })"
        class="inline-flex items-center px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
      >
        <svg class="w-4 h-4 mr-1.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
        {{ $t('finance.add_goal') }}
      </nuxt-link>
      <!-- "Rejalashtirilgan to'lovlar" -> Xarajatlar filtri; "Kutilayotgan daromadlar" -> Daromadlar filtri (S13) -->
      <nuxt-link
        :to="localePath({ name: 'finance-budget' })"
        class="inline-flex items-center px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
      >
        <svg class="w-4 h-4 mr-1.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM9 7h6M9 11h6M9 15h4"/>
        </svg>
        {{ $t('finance.nav_limit') }}
      </nuxt-link>
      <nuxt-link
        :to="localePath({ name: 'finance-advice' })"
        class="inline-flex items-center px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
      >
        <svg class="w-4 h-4 mr-1.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        {{ $t('finance.nav_advice') }}
      </nuxt-link>
      <nuxt-link
        :to="localePath({ name: 'finance-family' })"
        class="inline-flex items-center px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
      >
        <svg class="w-4 h-4 mr-1.5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-2a3 3 0 10-2.83-4M7 11a3 3 0 11-2.83-4"/>
        </svg>
        {{ $t('finance.nav_family') }}
      </nuxt-link>
      <nuxt-link
        :to="localePath({ name: 'finance-gap' })"
        class="inline-flex items-center px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
      >
        <svg class="w-4 h-4 mr-1.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ $t('finance.nav_gap') }}
      </nuxt-link>
    </div>

    <!-- Financial Health Score -->
    <div class="health-score-card rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/4"></div>

      <div class="relative z-10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-lg font-semibold opacity-90">{{ $t('finance.health_score') }}</h2>
            <div class="flex items-baseline mt-2">
              <span class="text-6xl font-bold">{{ health.score }}</span>
              <span class="text-2xl ml-1 opacity-80">/100</span>
            </div>
            <p class="mt-2 text-green-100">{{ getHealthStatus(health.status) }}</p>
          </div>
          <div class="mt-6 md:mt-0 flex gap-3">
            <div class="health-stat-card rounded-xl px-5 py-4 min-w-[140px]">
              <p class="text-sm text-green-100 mb-1">{{ $t('finance.total_debt') }}</p>
              <p class="text-xl font-bold">{{ formatMoney(health.factors?.debt_level || 0) }}</p>
            </div>
            <div class="health-stat-card rounded-xl px-5 py-4 min-w-[140px]">
              <p class="text-sm text-green-100 mb-1">{{ $t('finance.overdue_count') }}</p>
              <p class="text-xl font-bold">{{ health.factors?.overdue_debts || 0 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- Oylik daromad -->
      <nuxt-link :to="localePath({ name: 'finance-income' })" class="block group">
        <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border-l-4 border-green-500">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{{ $t('finance.this_month') }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ $t('finance.monthly_income') }}</p>
          <p
            class="text-2xl font-bold text-gray-900 mt-1 leading-tight"
            :title="formatMoney(dashboard.incomes && dashboard.incomes.monthly_total_uzs || 0)"
          >{{ formatCompact(dashboard.incomes && dashboard.incomes.monthly_total_uzs || 0) }}</p>
        </div>
      </nuxt-link>

      <!-- Oylik xarajat (qizil — psixologik jihatdan) -->
      <nuxt-link :to="localePath({ name: 'finance-expenses' })" class="block group">
        <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border-l-4 border-red-500">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">{{ $t('finance.this_month') }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ $t('finance.monthly_expense') }}</p>
          <p
            class="text-2xl font-bold text-gray-900 mt-1 leading-tight"
            :title="formatMoney(dashboard.expenses && dashboard.expenses.monthly_total_uzs || 0)"
          >{{ formatCompact(dashboard.expenses && dashboard.expenses.monthly_total_uzs || 0) }}</p>
        </div>
      </nuxt-link>

      <!-- Goals Progress -->
      <nuxt-link :to="localePath({ name: 'finance-goals' })" class="block group">
        <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border-l-4 border-purple-500">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{{ dashboard.goals?.active_count || 0 }} {{ $t('finance.active') }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ $t('finance.goals_progress') }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ dashboard.goals?.progress || 0 }}%</p>
        </div>
      </nuxt-link>
    </div>

    <!-- Budget Progress -->
    <div v-if="dashboard.budget" class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.monthly_budget') }}</h3>
        <nuxt-link :to="localePath({ name: 'finance-budget' })" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {{ $t('common.details') }} →
        </nuxt-link>
      </div>
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600">{{ formatMoney(dashboard.budget.spent) }} / {{ formatMoney(dashboard.budget.planned) }}</span>
          <span :class="dashboard.budget.percentage > 100 ? 'text-red-600' : 'text-green-600'">
            {{ dashboard.budget.percentage }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all"
            :class="dashboard.budget.percentage > 100 ? 'bg-red-500' : dashboard.budget.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'"
            :style="{ width: Math.min(dashboard.budget.percentage, 100) + '%' }"
          ></div>
        </div>
      </div>
      <p v-if="(dashboard.budget.remaining || 0) >= 0" class="text-sm text-gray-500">
        {{ $t('finance.remaining') }}: <span class="font-semibold text-gray-900">{{ formatMoney(dashboard.budget.remaining) }}</span>
      </p>
      <p v-else class="text-sm text-red-600 font-semibold">
        {{ $t('finance.over_budget') }}: {{ formatMoney(Math.abs(dashboard.budget.remaining)) }}
      </p>
    </div>

    <!-- Kunlik daromad(yashil)/xarajat(qizil) dinamikasi (shu oy, UZS) -->
    <div v-if="hasDailyData" class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <div class="flex items-center justify-between mb-1 flex-wrap gap-2">
        <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.daily_trend') }}</h3>
        <p class="text-xs text-gray-400">UZS</p>
      </div>
      <p class="text-xs text-indigo-500 mb-2 flex items-center gap-1">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ $t('finance.chart_legend_hint') }}
      </p>
      <client-only>
        <apexchart type="area" :height="290" :options="dailyChartOptions" :series="dailyChartSeries" />
      </client-only>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Daromadlar (kategoriya bo'yicha) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.incomes') }}</h3>
        </div>
        <div v-if="dashboard.incomes?.by_category?.length">
          <client-only>
            <apexchart
              type="pie"
              :height="280"
              :options="incomeChartOptions"
              :series="incomeChartSeries"
            />
          </client-only>
          <!-- Legend with amounts (UZS'ga aylantirilgan) -->
          <div class="mt-4 space-y-2">
            <div
              v-for="(cat, index) in dashboard.incomes.by_category"
              :key="cat.name || index"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center">
                <span
                  class="w-3 h-3 rounded-full mr-2"
                  :style="{ backgroundColor: incomeChartColors[index % incomeChartColors.length] }"
                ></span>
                <span class="text-gray-700">{{ getCategoryName(cat.name) || $t('finance.other') }}</span>
              </div>
              <span class="font-medium text-gray-900">{{ formatMoney(cat.total) }}</span>
            </div>
            <!-- Jami daromad (MB kursi bo'yicha UZS) -->
            <div class="flex items-center justify-between text-sm pt-2 mt-1 border-t border-gray-100">
              <span class="font-semibold text-gray-700">{{ $t('finance.total_income') }}</span>
              <span class="font-bold text-green-600">{{ formatMoney(dashboard.incomes.monthly_total_uzs || 0) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
          </svg>
          <p>{{ $t('finance.no_incomes') }}</p>
        </div>
      </div>

      <!-- Xarajatlar (kategoriya bo'yicha) - Pie Chart -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.expenses') }}</h3>
        </div>
        <div v-if="dashboard.expenses?.top_categories?.length">
          <client-only>
            <apexchart
              type="pie"
              :height="280"
              :options="categoryChartOptions"
              :series="categoryChartSeries"
            />
          </client-only>
          <!-- Legend with amounts (UZS'ga aylantirilgan) -->
          <div class="mt-4 space-y-2">
            <div
              v-for="(cat, index) in dashboard.expenses.top_categories"
              :key="cat.name"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center">
                <span
                  class="w-3 h-3 rounded-full mr-2"
                  :style="{ backgroundColor: chartColors[index % chartColors.length] }"
                ></span>
                <span class="text-gray-700">{{ getCategoryName(cat.name) || $t('finance.other') }}</span>
              </div>
              <span class="font-medium text-gray-900">{{ formatMoney(cat.total) }}</span>
            </div>
            <!-- Jami xarajat (MB kursi bo'yicha UZS) -->
            <div class="flex items-center justify-between text-sm pt-2 mt-1 border-t border-gray-100">
              <span class="font-semibold text-gray-700">{{ $t('finance.total_expense') }}</span>
              <span class="font-bold text-red-600">{{ formatMoney(dashboard.expenses.monthly_total_uzs || 0) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <p>{{ $t('finance.no_expenses') }}</p>
        </div>
      </div>
    </div>

    <!-- So'nggi amaliyotlar (daromad + xarajat, sana bo'yicha) -->
    <div class="bg-white rounded-2xl p-6 shadow-sm mt-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.recent_transactions') }}</h3>
      </div>
      <div v-if="recentTransactions.length" class="space-y-5">
        <div v-for="g in groupedRecent" :key="g.date">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{{ formatDate(g.date) }}</p>
          <div class="space-y-2">
            <div
              v-for="tr in g.items"
              :key="tr.type + '-' + tr.id"
              class="flex items-center justify-between p-3 rounded-xl"
              :class="tr.type === 'income' ? 'bg-green-50' : 'bg-red-50'"
            >
              <div class="flex items-center min-w-0">
                <span class="text-xl mr-3 flex-shrink-0">{{ tr.icon || (tr.type === 'income' ? '💰' : '📦') }}</span>
                <div class="min-w-0">
                  <p class="font-medium text-gray-900 truncate">{{ getCategoryName(tr.category_name) || $t('finance.other') }}</p>
                  <p class="text-sm text-gray-500 truncate">{{ tr.description || '-' }}</p>
                </div>
              </div>
              <div class="text-right flex-shrink-0 ml-3">
                <p class="font-semibold" :class="tr.type === 'income' ? 'text-green-600' : 'text-red-600'">
                  {{ tr.type === 'income' ? '+' : '−' }}{{ formatMoney(tr.amount, tr.currency) }}
                </p>
                <div class="flex items-center justify-end gap-2 mt-0.5">
                  <source-badge :source="tr.source" />
                  <span v-if="tr.time" class="text-xs text-gray-400">{{ tr.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-400">
        <p>{{ $t('finance.recent_transactions') }} —</p>
      </div>
    </div>

  </div>
</template>

<script>
import SourceBadge from '@/components/finance/SourceBadge.vue'

export default {
  name: 'FinanceDashboard',
  middleware: 'auth',
  components: { SourceBadge },

  data() {
    return {
      dashboard: {
        debts: {},
        expenses: {},
        incomes: {},
        budget: null,
        goals: {}
      },
      health: {
        score: 0,
        status: 'good',
        factors: {}
      },
      loading: true,
      chartColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'],
      incomeChartColors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F43F5E']
    }
  },

  computed: {
    // PIE chart series — UZS'ga aylantirilgan (nisbatlar to'g'ri bo'lishi uchun:
    // 100 USD 4.5M UZS yonida ko'rinmasdan qolmasin)
    categoryChartSeries() {
      if (!this.dashboard.expenses?.top_categories?.length) return []
      return this.dashboard.expenses.top_categories.map(cat => this.toUzs(cat.total, cat.currency))
    },

    // Daromadlar PIE (kategoriya bo'yicha) — UZS'ga aylantirilgan
    incomeChartSeries() {
      if (!this.dashboard.incomes?.by_category?.length) return []
      return this.dashboard.incomes.by_category.map(cat => this.toUzs(cat.total, cat.currency))
    },
    incomeChartOptions() {
      const labels = this.dashboard.incomes?.by_category?.map(cat => this.getCategoryName(cat.name) || this.$t('finance.other')) || []
      return {
        chart: { type: 'pie', fontFamily: 'inherit' },
        labels,
        colors: this.incomeChartColors,
        legend: { show: false },
        dataLabels: { enabled: true, formatter: (val) => val.toFixed(0) + '%' },
        tooltip: { y: { formatter: (val) => this.formatMoney(val) } },
        responsive: [{ breakpoint: 480, options: { chart: { height: 250 } } }]
      }
    },

    // PIE chart options
    categoryChartOptions() {
      const labels = this.dashboard.expenses?.top_categories?.map(cat => this.getCategoryName(cat.name)) || []
      return {
        chart: {
          type: 'pie',
          fontFamily: 'inherit'
        },
        labels,
        colors: this.chartColors,
        legend: {
          show: false // Biz o'zimiz legend qilamiz
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val.toFixed(0) + '%'
        },
        tooltip: {
          y: {
            formatter: (val) => this.formatMoney(val)
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              height: 250
            }
          }
        }]
      }
    },

    // Oylik daromad/xarajat — valyuta bo'yicha (masalan "100 USD", yoki UZS+USD ikki qator)
    incomeTotals() { return this.currencyTotals(this.dashboard.incomes?.by_currency) },
    expenseTotals() { return this.currencyTotals(this.dashboard.expenses?.by_currency) },

    // Kunlik daromad(yashil)/xarajat(qizil) grafik (UZS, shu oy)
    hasDailyData() {
      return (this.dashboard.daily_series || []).some(d => (d.income || 0) > 0 || (d.expense || 0) > 0)
    },
    dailyChartSeries() {
      const s = this.dashboard.daily_series || []
      let bal = 0
      const balance = s.map(d => { bal += (d.income || 0) - (d.expense || 0); return Math.round(bal) })
      return [
        { name: this.$t('finance.incomes'), data: s.map(d => Math.round(d.income || 0)) },
        { name: this.$t('finance.expenses'), data: s.map(d => Math.round(d.expense || 0)) },
        { name: this.$t('finance.balance'), data: balance }
      ]
    },
    dailyChartOptions() {
      const s = this.dashboard.daily_series || []
      return {
        chart: { type: 'area', fontFamily: 'inherit', toolbar: { show: false }, zoom: { enabled: false } },
        colors: ['#10B981', '#EF4444', '#6366F1'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: [2, 2, 2], dashArray: [0, 0, 6] },
        fill: { type: 'gradient', gradient: { opacityFrom: [0.35, 0.35, 0], opacityTo: [0.05, 0.05, 0] } },
        xaxis: {
          categories: s.map(d => d.day),
          tickAmount: 10,
          labels: { style: { fontSize: '10px', colors: '#94a3b8' } },
          axisBorder: { show: false }, axisTicks: { show: false }
        },
        yaxis: { labels: { formatter: (v) => this.shortNum(v), style: { colors: '#94a3b8' } } },
        // Bosiladigan izoh — foydalanuvchi chiziqlarni yoqib/o'chira oladi
        legend: { show: true, position: 'top', horizontalAlign: 'right', fontFamily: 'inherit' },
        tooltip: { y: { formatter: (v) => this.formatMoney(v) } },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 4 }
      }
    },

    // So'nggi amaliyotlar — backend `recent_transactions` (daromad+xarajat, created_at
    // bo'yicha vaqt tartibli). Eski javob uchun fallback ham bor.
    recentTransactions() {
      const merged = this.dashboard.recent_transactions
      if (Array.isArray(merged) && merged.length) {
        return merged.map(t => ({
          id: t.id, type: t.kind, amount: t.amount, currency: t.currency, description: t.description,
          date: this.localDateKey(t.date), time: this.formatTime(t.created_at), created_at: t.created_at,
          icon: t.category_icon, category_name: t.category_name, source: t.source || 'web'
        }))
      }
      const exp = (this.dashboard.expenses?.recent || []).map(e => ({
        id: e.id, type: 'expense', amount: e.amount, currency: e.currency, description: e.description,
        date: this.localDateKey(e.expense_date), time: this.formatTime(e.created_at), created_at: e.created_at,
        icon: e.category?.icon, category_name: e.category?.name
      }))
      const inc = (this.dashboard.incomes?.recent || []).map(i => ({
        id: i.id, type: 'income', amount: i.amount, currency: i.currency, description: i.description,
        date: this.localDateKey(i.income_date), time: this.formatTime(i.created_at), created_at: i.created_at,
        icon: i.category?.icon, category_name: i.category?.name
      }))
      return [...exp, ...inc]
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 12)
    },

    // Sana bo'yicha guruhlash (guruh ichida created_at bo'yicha kamayish tartibida)
    groupedRecent() {
      const groups = {}
      for (const t of this.recentTransactions) {
        if (!groups[t.date]) groups[t.date] = []
        groups[t.date].push(t)
      }
      return Object.keys(groups)
        .sort((a, b) => b.localeCompare(a))
        .map(date => ({
          date,
          items: groups[date].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        }))
    }
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.loading = true
        const [dashboardRes, healthRes] = await Promise.all([
          this.$api.getFinanceDashboard(),
          this.$api.getFinancialHealth()
        ])

        if (dashboardRes?.data?.success) {
          this.dashboard = dashboardRes.data.data
        }
        if (healthRes?.data?.success) {
          this.health = healthRes.data.data
        }
      } catch (error) {
        console.error('Finance dashboard error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    formatMoney(value, currency = 'UZS') {
      const cur = currency || 'UZS'
      if (!value) return '0 ' + cur
      return Number(value).toLocaleString('uz-UZ') + ' ' + cur
    },

    // Valyuta bo'yicha summalar -> ["300 000 UZS", "100 USD"] (UZS birinchi/tepada)
    currencyTotals(arr) {
      const list = (arr || []).filter(x => Number(x.total))
      if (!list.length) return ['0 UZS']
      list.sort((a, b) => (a.currency === 'UZS' ? -1 : b.currency === 'UZS' ? 1 : 0))
      return list.map(x => this.formatMoney(x.total, x.currency))
    },

    // Summani UZS'ga aylantirish (diagramma nisbatlari uchun)
    toUzs(total, currency) {
      const t = parseFloat(total) || 0
      const rate = this.dashboard.usd_rate || 12500
      return String(currency || 'UZS').toUpperCase() === 'USD' ? Math.round(t * rate) : Math.round(t)
    },

    // Y-o'qi uchun qisqa raqam: 1.2M, 350K
    shortNum(v) {
      const n = Number(v) || 0
      if (Math.abs(n) >= 1000000) return (n / 1000000).toFixed(1) + 'M'
      if (Math.abs(n) >= 1000) return Math.round(n / 1000) + 'K'
      return String(Math.round(n))
    },

    // Karta uchun yaxlitlangan qisqa summa (Qarz daftari uslubida): 1 000 000 → 1M, 1000 → 1K
    formatCompact(v) {
      const n = Math.round(Number(v) || 0)
      const abs = Math.abs(n)
      if (abs >= 1000000) {
        const m = n / 1000000
        return (Number.isInteger(m) ? m : m.toFixed(1)) + 'M UZS'
      }
      if (abs >= 1000) {
        const k = n / 1000
        return (Number.isInteger(k) ? k : k.toFixed(1)) + 'K UZS'
      }
      return n.toLocaleString('uz-UZ') + ' UZS'
    },

    // Amal manbasi (web/mobile/telegram) yorlig'i, emoji va rangi
    sourceLabel(s) {
      const map = { web: this.$t('finance.source_web'), mobile: this.$t('finance.source_mobile'), telegram: this.$t('finance.source_telegram') }
      return map[s] || this.$t('finance.source_web')
    },
    sourceEmoji(s) {
      return { web: '🌐', mobile: '📱', telegram: '✈️' }[s] || '🌐'
    },
    sourceBadgeClass(s) {
      return {
        web: 'bg-blue-50 text-blue-600',
        mobile: 'bg-green-50 text-green-600',
        telegram: 'bg-sky-50 text-sky-600'
      }[s] || 'bg-gray-100 text-gray-500'
    },

    // Vaqt (soat:daqiqa, Toshkent +05) — created_at dan
    formatTime(dt) {
      if (!dt) return ''
      const d = new Date(dt)
      if (isNaN(d)) return ''
      try {
        return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tashkent' })
      } catch (e) {
        return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      }
    },

    // Sana kalitini LOKAL vaqt bo'yicha oladi (UTC siljishi tufayli sana bir kun
    // orqaga ketishini oldini oladi — analitika bilan mos bo'lishi uchun)
    localDateKey(d) {
      if (!d) return ''
      const dt = new Date(d)
      if (isNaN(dt)) return String(d).split('T')[0]
      const y = dt.getFullYear()
      const m = String(dt.getMonth() + 1).padStart(2, '0')
      const day = String(dt.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('uz-UZ')
    },

    getHealthStatus(status) {
      const statuses = {
        excellent: this.$t('finance.health_excellent'),
        good: this.$t('finance.health_good'),
        fair: this.$t('finance.health_fair'),
        poor: this.$t('finance.health_poor')
      }
      return statuses[status] || status
    },

    getCategoryName(name) {
      if (!name) return null
      const key = `finance.${name}`
      const translated = this.$t(key)
      if (translated === key) {
        return name
      }
      return translated
    }
  }
}
</script>

<style scoped>
.health-score-card {
  background: linear-gradient(135deg, #059669 0%, #10b981 50%, #0d9488 100%);
  box-shadow: 0 10px 40px -10px rgba(5, 150, 105, 0.4);
}

.health-stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.text-green-100 {
  color: rgba(209, 250, 229, 0.9);
}
</style>
