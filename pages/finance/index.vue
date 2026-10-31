<template>
  <div class="finance-dashboard pb-8">
    <!-- B31-11: "Qarz daftari" uslubidagi gradient banner — sarlavha chapda, amallar o'ngda (simmetrik) -->
    <div class="mt-1 mb-5">
      <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="fin-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#fin-grid)" />
          </svg>
        </div>
        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-2xl lg:text-3xl font-bold mb-1.5">{{ $t('finance.title') }}</h1>
            <p class="text-blue-100 text-sm lg:text-base max-w-xl">{{ $t('finance.subtitle') }}</p>
            <!-- 23.10 ("Shaxsiy moliya yangi sayt 22.10", 1-rasm): "Eslatma" ikkilamchi navigatsiyadan sarlavha
                 TAGIGA ko'chirildi — "Eslatmani yoqish" kaliti (holati: yoqilgan/o'chiq + vaqt). Bosilsa sozlash oynasi. -->
            <button
              type="button"
              class="fin-rem-toggle mt-3 inline-flex items-center gap-2.5 rounded-xl pl-3 pr-2 py-1.5 text-sm font-semibold text-white transition"
              :aria-pressed="reminderOn ? 'true' : 'false'"
              @click="showReminder = true"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
              <span>{{ reminderLabel }}</span>
              <span class="fin-rem-switch" :class="{ 'fin-rem-switch--on': reminderOn }"><span class="fin-rem-switch__dot"></span></span>
            </button>
            <!-- 21.10 (egasi hujjati, 5-rasm): "Moliyaviy sog'liq" kartasi olib tashlandi — ball endi
                 BARCHA modullar bo'yicha bosh sahifada (/financial-health). "Tavsiya" tugmasi va
                 shu oy qoldig'i shu ko'k kartaga ko'chirildi. -->
            <div class="flex flex-wrap items-center gap-2 mt-3">
              <nuxt-link
                :to="localePath({ name: 'finance-advice' })"
                class="fin-hero-chip fin-hero-chip--link inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-white transition"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                {{ $t('finance.nav_advice') }}
              </nuxt-link>
              <div class="fin-hero-chip inline-flex items-baseline gap-1.5 rounded-lg px-3.5 py-2 text-sm">
                <span class="text-blue-100">{{ $t('finance.net_this_month') }}:</span>
                <span class="font-bold text-white" :title="formatMoney(netThisMonth)">{{ netThisMonth >= 0 ? '+' : '' }}{{ formatMK(netThisMonth) }} UZS</span>
              </div>
              <div v-if="savingsRate !== null" class="fin-hero-chip inline-flex items-baseline gap-1.5 rounded-lg px-3.5 py-2 text-sm">
                <span class="text-blue-100">{{ $t('finance.savings_rate') }}:</span>
                <span class="font-bold text-white">{{ savingsRate }}%</span>
              </div>
            </div>
          </div>
          <!-- B34-9: 2 ustun — har ustun kengligi teng; sekundar tugma yuqoridagi asosiy
               tugma tagida SIMMETRIK (Rejalashtirilgan→Xarajat tagida, Kutilayotgan→Daromad tagida) -->
          <div class="grid grid-cols-2 gap-2 w-full lg:w-auto">
            <div class="flex flex-col gap-2">
              <nuxt-link :to="localePath({ name: 'finance-expenses-add' })" class="flex items-center justify-center w-full px-5 py-3 bg-white text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                {{ $t('finance.add_expense') }}
              </nuxt-link>
              <nuxt-link :to="localePath({ name: 'finance-payments' })" class="flex items-center justify-center w-full px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {{ $t('finance.scheduled_payments') }}
              </nuxt-link>
            </div>
            <div class="flex flex-col gap-2">
              <nuxt-link :to="localePath({ name: 'finance-income-add' })" class="flex items-center justify-center w-full px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                {{ $t('finance.add_income') }}
              </nuxt-link>
              <nuxt-link :to="localePath({ name: 'finance-expected-income' })" class="flex items-center justify-center w-full px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                <svg class="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ $t('finance.expected_incomes') }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ikkilamchi navigatsiya (chapda): Tahlil / Limit / Tavsiya -->
    <div class="flex flex-wrap gap-2 mb-5">
      <nuxt-link
        :to="localePath({ name: 'finance-analytics' })"
        class="inline-flex items-center px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        {{ $t('finance.view_analytics') }}
      </nuxt-link>
      <!-- 22.10 (egasi hujjati "Qarzdan chiqish"): yangi bo'lim — qarzlarni yopish rejasi -->
      <nuxt-link
        :to="localePath({ name: 'finance-debt-plan' })"
        class="inline-flex items-center px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
        {{ $t('debt_plan.title') }}
      </nuxt-link>
      <!-- SS10 (2026-09-18): "Kalendar" ikkilamchi navigatsiyadan olib tashlandi — endi
           Shaxsiy moliya asosiy sahifasida "Oylik budjet" tagida INLINE ko'rsatiladi. -->
      <nuxt-link
        :to="localePath({ name: 'finance-budget' })"
        class="inline-flex items-center px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
      >
        <svg class="w-4 h-4 mr-1.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM9 7h6M9 11h6M9 15h4"/></svg>
        {{ $t('finance.nav_limit') }}
      </nuxt-link>
      <!-- B30-1a: Maqsad qo'shish / Oila / Gap — bu yerga (Tahlil/Limit yoniga) tushirildi -->
      <nuxt-link :to="localePath({ name: 'finance-goals-add' })" class="inline-flex items-center px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200">
        <svg class="w-4 h-4 mr-1.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
        {{ $t('finance.add_goal') }}
      </nuxt-link>
      <nuxt-link :to="localePath({ name: 'finance-family' })" class="inline-flex items-center px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200">
        <svg class="w-4 h-4 mr-1.5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-2a3 3 0 10-2.83-4M7 11a3 3 0 11-2.83-4"/></svg>
        {{ $t('finance.nav_family') }}
      </nuxt-link>
      <nuxt-link :to="localePath({ name: 'finance-gap' })" class="inline-flex items-center px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200">
        <svg class="w-4 h-4 mr-1.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {{ $t('finance.nav_gap') }}
      </nuxt-link>
      <!-- 13.10: Eslatma oynasi (Telegram bot + mobil ilova orqali kunlik eslatish). 23.10: tugma sarlavha tagida. -->
      <PersonalDebtReminderModal v-if="showReminder" kind="finance" @saved="onReminderSaved" @close="showReminder = false" />
      <!-- SS6 (2026-09-17): "Shaxsiy qarz" endi ALOHIDA sidebar bo'limi — Shaxsiy moliya
           ichidan olib tashlandi (bu yerdan chiqarildi). -->
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

    <!-- SS10 (2026-09-18): Kalendar — "Oylik budjet" tagida INLINE (ilgari Tahlil ichidagi tab edi) -->
    <div class="bg-white rounded-2xl p-6 shadow-sm mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.tab_calendar') }}</h3>
      </div>
      <finance-calendar />
    </div>

    <!-- B31-9: Chart davri — Joriy oy (kunlik) / Oylar kesimida (12 oy). Chiziq+pie chartlarга ta'sir qiladi. -->
    <div v-if="hasDailyData || (yearly && chartPeriod === 'year')" class="flex items-center gap-2 mb-3">
      <button :class="['px-4 py-2 rounded-lg text-sm font-medium border transition', chartPeriod === 'month' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']" @click="chartPeriod = 'month'">{{ $t('finance.chart_period_month') }}</button>
      <button :class="['px-4 py-2 rounded-lg text-sm font-medium border transition', chartPeriod === 'year' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']" @click="chartPeriod = 'year'">{{ $t('finance.chart_period_year') }}</button>
    </div>

    <!-- Kunlik daromad(yashil)/xarajat(qizil) dinamikasi (shu oy, UZS) -->
    <!-- W3b: Daromad va xarajatlar (oqim) — yashil/qizil; Balans alohida grafikda -->
    <div v-if="hasDailyData" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.chart_income_expense') }}</h3>
          <p class="text-xs text-gray-400">UZS</p>
        </div>
        <client-only>
          <apexchart type="bar" :height="280" :options="dailyChartOptions" :series="dailyChartSeries" />
        </client-only>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.chart_balance_trend') }}</h3>
          <p class="text-xs text-gray-400">UZS</p>
        </div>
        <client-only>
          <apexchart type="area" :height="280" :options="balanceChartOptions" :series="balanceChartSeries" />
        </client-only>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Daromadlar (kategoriya bo'yicha) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">{{ $t('finance.incomes') }}</h3>
        </div>
        <div v-if="incomeCatList.length">
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
              v-for="(cat, index) in incomeCatList"
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
              <span class="font-bold text-green-600">{{ formatMoney(incomeCatTotalUzs) }}</span>
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
        <div v-if="expenseCatList.length">
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
              v-for="(cat, index) in expenseCatList"
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
              <span class="font-bold text-red-600">{{ formatMoney(expenseCatTotalUzs) }}</span>
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
              class="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:brightness-95 transition"
              :class="tr.type === 'income' ? 'bg-green-50' : 'bg-red-50'"
              :title="$t('common.edit')"
              @click="editTx(tr)"
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

    <!-- B31-8: kunlik chart ustuni tafsiloti — o'sha kun daromad/xarajatlari (kategoriya bilan) -->
    <div v-if="showDayModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showDayModal = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl flex flex-col" style="max-height: 85vh;">
        <div class="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h3 class="text-base font-bold text-gray-900">{{ dayModalTitle }}</h3>
          <button class="text-gray-400 hover:text-gray-600" aria-label="close" @click="showDayModal = false">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="px-5 py-3 overflow-y-auto flex-1 min-h-0">
          <div v-if="dayModalLoading" class="flex justify-center py-10">
            <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <template v-else>
            <div v-if="dayModalIncomes.length" class="mb-4">
              <p class="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">➕ {{ $t('finance.incomes') }}</p>
              <div class="space-y-2">
                <div v-for="it in dayModalIncomes" :key="'di'+it.id" class="flex items-center justify-between p-3 rounded-xl bg-green-50 gap-2">
                  <div class="flex items-center min-w-0">
                    <span class="text-xl mr-3 flex-shrink-0">{{ (it.category && it.category.icon) || '💰' }}</span>
                    <div class="min-w-0">
                      <p class="font-medium text-gray-900 truncate">{{ getCategoryName(it.category && it.category.name) || $t('finance.other') }}</p>
                      <p class="text-sm text-gray-500 truncate">{{ it.description || '-' }}</p>
                    </div>
                  </div>
                  <span class="font-bold text-green-600 flex-shrink-0">+{{ formatMoney(it.amount, it.currency) }}</span>
                </div>
              </div>
            </div>
            <div v-if="dayModalExpenses.length">
              <p class="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">➖ {{ $t('finance.expenses') }}</p>
              <div class="space-y-2">
                <div v-for="it in dayModalExpenses" :key="'de'+it.id" class="flex items-center justify-between p-3 rounded-xl bg-red-50 gap-2">
                  <div class="flex items-center min-w-0">
                    <span class="text-xl mr-3 flex-shrink-0">{{ (it.category && it.category.icon) || '📦' }}</span>
                    <div class="min-w-0">
                      <p class="font-medium text-gray-900 truncate">{{ getCategoryName(it.category && it.category.name) || $t('finance.other') }}</p>
                      <p class="text-sm text-gray-500 truncate">{{ it.description || '-' }}</p>
                    </div>
                  </div>
                  <span class="font-bold text-red-600 flex-shrink-0">−{{ formatMoney(it.amount, it.currency) }}</span>
                </div>
              </div>
            </div>
            <div v-if="!dayModalIncomes.length && !dayModalExpenses.length" class="text-center py-10 text-gray-400">{{ $t('finance.family_no_data') }}</div>
          </template>
        </div>
      </div>
    </div>

    <!-- B34-5: pie bo'lagi (kategoriya) bosilganда — o'sha kategoriya daromad/xarajat tafsiloti -->
    <div v-if="showCatModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showCatModal = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl flex flex-col" style="max-height: 85vh;">
        <div class="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center min-w-0 gap-2">
            <span class="text-2xl flex-shrink-0">{{ (catModalCat && catModalCat.icon) || (catModalKind === 'income' ? '💰' : '📦') }}</span>
            <h3 class="text-base font-bold text-gray-900 truncate">{{ catModalTitle }}</h3>
          </div>
          <button class="text-gray-400 hover:text-gray-600" aria-label="close" @click="showCatModal = false">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <!-- Yig'indi + ulush -->
        <div class="px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">{{ $t('finance.cat_total') }}</span>
            <span class="text-lg font-bold" :class="catModalKind === 'income' ? 'text-green-600' : 'text-red-600'">{{ formatMoney(catModalTotalUzs) }}</span>
          </div>
          <div class="mt-2">
            <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{{ $t('finance.cat_share') }}</span>
              <span class="font-semibold text-gray-700">{{ catModalShare }}%</span>
            </div>
            <div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div class="h-full rounded-full" :class="catModalKind === 'income' ? 'bg-green-500' : 'bg-red-500'" :style="{ width: catModalShare + '%' }"></div>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 overflow-y-auto flex-1 min-h-0">
          <div v-if="catModalLoading" class="flex justify-center py-10">
            <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <template v-else>
            <div v-if="catModalItems.length" class="space-y-2">
              <div v-for="it in catModalItems" :key="'ci'+it.id" class="flex items-center justify-between p-3 rounded-xl gap-2" :class="catModalKind === 'income' ? 'bg-green-50' : 'bg-red-50'">
                <div class="min-w-0">
                  <p class="font-medium text-gray-900 truncate">{{ it.description || catModalTitle }}</p>
                  <p class="text-xs text-gray-400">{{ fmtDay(it.expense_date || it.income_date) }}</p>
                </div>
                <span class="font-bold flex-shrink-0" :class="catModalKind === 'income' ? 'text-green-600' : 'text-red-600'">{{ catModalKind === 'income' ? '+' : '−' }}{{ formatMoney(it.amount, it.currency) }}</span>
              </div>
            </div>
            <div v-else-if="chartPeriod !== 'month'" class="text-center py-8 text-gray-400 text-sm">{{ $t('finance.cat_year_hint') }}</div>
            <div v-else class="text-center py-10 text-gray-400">{{ $t('finance.family_no_data') }}</div>
          </template>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { formatMoneyCur } from '@/utils/helpers';
import SourceBadge from '@/components/finance/SourceBadge.vue'
import FinanceCalendar from '@/components/finance/FinanceCalendar.vue'
import PersonalDebtReminderModal from '@/components/finance/PersonalDebtReminderModal.vue' // 13.10: moliya eslatmasi
import { getIncomes, getExpenses, getExportTrends, getDailyReminder } from '@/api/finance';
import financeHomeViewMixin from '~/mixins/financeHomeViewMixin.js';
import financeHomeFormatMixin from '~/mixins/financeHomeFormatMixin.js';

export default {
  name: 'FinanceDashboard',
  components: { SourceBadge, FinanceCalendar, PersonalDebtReminderModal },
  mixins: [financeHomeViewMixin, financeHomeFormatMixin],
  middleware: 'auth',

  data() {
    return {
      showReminder: false, // 13.10
      reminderOn: false, // 23.10: kalit holati (GET /finance/daily-reminder)
      reminderTime: '',
      dashboard: {
        debts: {},
        expenses: {},
        incomes: {},
        budget: null,
        goals: {}
      },
      loading: true,
      chartColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'],
      incomeChartColors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F43F5E'],
      // B31-8: kunlik chart ustuni bosilganda — o'sha kun tafsiloti modali
      showDayModal: false,
      dayModalLoading: false,
      dayModalDayNum: null,
      dayModalIncomes: [],
      dayModalExpenses: [],
      // B31-9: chart davri — 'month' (joriy oy, kunlik) | 'year' (oylar kesimida, 12 oy)
      chartPeriod: 'month',
      yearly: null,
      // B34-5: pie bo'lagi (kategoriya) tafsiloti modali
      showCatModal: false,
      catModalKind: 'expense',
      catModalCat: null,
      catModalItems: [],
      catModalLoading: false
    }
  },


  async mounted() {
    this.loadReminderState() // 23.10: kalit holati (fon, kutilmaydi)
    await this.loadData()
  },

  methods: {
    /** 23.10 (1-rasm): "Eslatmani yoqish" kaliti holati — GET /finance/daily-reminder { enabled, time } */
    async loadReminderState() {
      try {
        const res = await getDailyReminder(this.$axios, { silent: true, background: true })
        const d = res && res.data
        this.reminderOn = !!(d && d.enabled)
        this.reminderTime = (d && d.time) || ''
      } catch (_) { /* holat ko'rinmasa — kalit "o'chiq" ko'rinadi */ }
    },
    onReminderSaved(r) {
      this.reminderOn = !!(r && r.enabled)
      this.reminderTime = (r && r.time) || ''
    },
    async loadData() {
      try {
        this.loading = true
        const [dashboardRes, trendsRes] = await Promise.all([
          this.$api.getFinanceDashboard(),
          getExportTrends(this.$axios).catch(() => null) // B31-9: 12 oylik
        ])

        if (dashboardRes?.data?.success) {
          this.dashboard = dashboardRes.data.data
        }
        if (trendsRes && trendsRes.data && trendsRes.data.success) {
          this.yearly = trendsRes.data.data
        }
      } catch (error) {
        console.error('Finance dashboard error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    // Faza1-H2: so'nggi amaliyot qatori bosilganда — o'sha yozuvni tahrirlashга o'tish
    editTx(tr) {
      if (!tr || !tr.id) {return}
      const name = tr.type === 'income' ? 'finance-income-add' : 'finance-expenses-add'
      this.$router.push(this.localePath({ name, query: { edit: tr.id } }))
    },

    // B31-8: kunlik chart ustuni bosilганда — o'sha kun daromad/xarajat tafsiloti (kategoriya bilan)
    async onBarClick(cfg) {
      if (this.chartPeriod === 'year') {return} // oylar kesimida kun modali yo'q
      const s = this.dashboard.daily_series || []
      const idx = cfg && cfg.dataPointIndex
      const cell = (idx != null && idx >= 0) ? s[idx] : null
      if (!cell || !cell.day) {return}
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      const key = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(cell.day)}`
      this.dayModalDayNum = cell.day
      this.dayModalIncomes = []
      this.dayModalExpenses = []
      this.showDayModal = true
      this.dayModalLoading = true
      try {
        const [expRes, incRes] = await Promise.all([
          getExpenses(this.$axios, { params: { start_date: key, end_date: key, limit: 200 } }),
          getIncomes(this.$axios, { params: { start_date: key, end_date: key, limit: 200 } })
        ])
        this.dayModalExpenses = (expRes && expRes.data && expRes.data.data) || []
        this.dayModalIncomes = (incRes && incRes.data && incRes.data.data) || []
      } catch (e) {
        this.dayModalExpenses = []; this.dayModalIncomes = []
      } finally {
        this.dayModalLoading = false
      }
    },

    fmtDay(d) { if (!d) {return '';} const p = String(d).slice(0, 10).split('-'); return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : '' },

    // B34-5: pie bo'lagi (kategoriya) bosilganда — o'sha kategoriya tranzaksiyalari.
    // Joriy oyда per-tranzaksiya ro'yxati; yillik ko'rinishда faqat jami+ulush.
    async onSliceClick(kind, cfg) {
      const idx = cfg && cfg.dataPointIndex
      const list = kind === 'income' ? this.incomeCatList : this.expenseCatList
      const cat = (idx != null && idx >= 0) ? list[idx] : null
      if (!cat) {return}
      this.catModalKind = kind
      this.catModalCat = cat
      this.catModalItems = []
      this.showCatModal = true
      if (this.chartPeriod !== 'month') {return} // yillik: faqat jami+ulush
      this.catModalLoading = true
      try {
        const now = new Date()
        const pad = (n) => String(n).padStart(2, '0')
        const y = now.getFullYear(), m = now.getMonth() // 0-based
        const start = `${y}-${pad(m + 1)}-01`
        const end = `${y}-${pad(m + 1)}-${pad(new Date(y, m + 1, 0).getDate())}`
        const listFn = kind === 'income' ? getIncomes : getExpenses
        const res = await listFn(this.$axios, { params: { start_date: start, end_date: end, limit: 500 } })
        const all = (res && res.data && res.data.data) || []
        const cid = cat.category_id != null ? String(cat.category_id) : 'null'
        this.catModalItems = all.filter((it) => {
          const raw = it.category_id != null ? it.category_id : (it.category && it.category.id != null ? it.category.id : null)
          return (raw != null ? String(raw) : 'null') === cid
        })
      } catch (e) {
        this.catModalItems = []
      } finally {
        this.catModalLoading = false
      }
    },

    formatMoney: formatMoneyCur, // SS-AUDIT (2026-09-25): utils/helpers

    getCategoryName(name) {
      if (!name) {return null}
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
/* 21.10: ko'k kartadagi "Tavsiya" + qoldiq chiplari (Tailwind v2 — `bg-white/15` ishlamaydi) */
.fin-hero-chip {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.22);
}
.fin-hero-chip--link:hover {
  background: rgba(255, 255, 255, 0.26);
}
/* 23.10 (1-rasm): "Eslatmani yoqish" kaliti — sarlavha tagida */
.fin-rem-toggle {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.28);
}
.fin-rem-toggle:hover, .fin-rem-toggle:focus { background: rgba(255, 255, 255, 0.26); outline: none; }
.fin-rem-switch { position: relative; width: 34px; height: 20px; border-radius: 9999px; background: rgba(255, 255, 255, 0.3); transition: background .2s; flex-shrink: 0; }
.fin-rem-switch--on { background: #22c55e; }
.fin-rem-switch__dot { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 9999px; background: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25); transition: transform .2s; }
.fin-rem-switch--on .fin-rem-switch__dot { transform: translateX(14px); }

.text-green-100 {
  color: rgba(209, 250, 229, 0.9);
}
</style>
