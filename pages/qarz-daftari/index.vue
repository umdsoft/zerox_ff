<template>
  <div class="pb-8">
    <!-- Welcome Banner -->
    <div class="mt-2">
      <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="qd-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#qd-grid)" />
          </svg>
        </div>

        <div class="relative z-10">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 class="text-2xl lg:text-3xl font-bold mb-2">{{ texts.pageTitle }}</h1>
              <p class="text-blue-100 text-sm lg:text-base max-w-xl">{{ texts.pageSubtitle }}</p>
            </div>
            <div class="mt-5 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <nuxt-link
                :to="localePath({ name: 'contract-dashboard' })"
                class="flex items-center justify-center px-6 py-3.5 bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-20 text-white rounded-xl font-semibold transition-all backdrop-blur-sm"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                {{ texts.shartnomaTuzish }}
              </nuxt-link>
              <nuxt-link
                :to="localePath({ name: 'qarz-daftari-kiritish' })"
                class="flex items-center justify-center px-6 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                {{ texts.daftarigaKiritish }}
              </nuxt-link>
            </div>
          </div>

          <!-- Quick Stats in Banner -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white border-opacity-20">
            <div class="text-center lg:text-left">
              <p class="text-2xl lg:text-3xl font-bold">{{ formatMoney(totalBerilganUzs) }}</p>
              <p class="text-blue-200 text-xs lg:text-sm mt-1">{{ texts.berilganQarz }} (UZS)</p>
            </div>
            <div class="text-center lg:text-left">
              <p class="text-2xl lg:text-3xl font-bold">{{ formatMoney(totalOlinganUzs) }}</p>
              <p class="text-blue-200 text-xs lg:text-sm mt-1">{{ texts.olinganQarz }} (UZS)</p>
            </div>
            <div class="text-center lg:text-left">
              <p class="text-2xl lg:text-3xl font-bold text-red-300">{{ formatMoney(dashboard.muddati_otgan_debitor?.uzs) }}</p>
              <p class="text-blue-200 text-xs lg:text-sm mt-1">{{ texts.muddatiOtganDebitor }}</p>
            </div>
            <div class="text-center lg:text-left">
              <p class="text-2xl lg:text-3xl font-bold text-red-300">{{ formatMoney(dashboard.muddati_otgan_kreditor?.uzs) }}</p>
              <p class="text-blue-200 text-xs lg:text-sm mt-1">{{ texts.muddatiOtganKreditor }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ogohlantirish -->
    <div v-if="showWarning" class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <p class="flex-1 text-sm text-amber-800 leading-relaxed">{{ texts.warning }}</p>
        <button @click="showWarning = false" class="text-xs text-amber-600 hover:text-amber-800 font-semibold whitespace-nowrap ml-4 px-3 py-1 rounded-lg hover:bg-amber-100 transition-colors">{{ texts.understood }}</button>
      </div>
    </div>

    <!-- Charts Section: Gorizontal nisbat (aylana emas) -->
    <div class="mt-6 lg:mt-8">
      <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.overview }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Berilgan qarz -->
        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ texts.berilganQarz }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ texts.chartDesc }}</p>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
            </div>
          </div>
          <QarzDaftariDashboardChart :shartnoma="dashboard.berilgan_qarz?.shartnoma" :daftari="dashboard.berilgan_qarz?.daftari" />
        </div>

        <!-- Olingan qarz -->
        <div class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ texts.olinganQarz }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ texts.chartDesc }}</p>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>
            </div>
          </div>
          <QarzDaftariDashboardChart :shartnoma="dashboard.olingan_qarz?.shartnoma" :daftari="dashboard.olingan_qarz?.daftari" />
        </div>
      </div>
    </div>

    <!-- Main Stats Cards: bosilganda drill-down -->
    <div class="mt-6 lg:mt-8">
      <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.qarzdorliklar }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Berilgan qarz (click → drill-down) -->
        <button type="button" @click="toggleDrill('berilgan')" :class="['text-left bg-white rounded-2xl p-5 shadow-md border hover:shadow-lg transition-all w-full', drill === 'berilgan' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100']">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
            </div>
            <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{{ texts.olishKerak }}</span>
          </div>
          <p class="text-xs font-medium text-gray-500">{{ texts.berilganQarz }}</p>
          <p class="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{{ formatMoney(totalBerilganUzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
          <p class="text-lg font-bold text-gray-900 mt-1">{{ formatMoney(totalBerilganUsd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
        </button>

        <!-- Muddati o'tgan (debitor) — QIZIL rang, USD raqam qora -->
        <nuxt-link :to="localePath({ name: 'expired-type', params: { type: 'debitor' } })" class="text-left bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-red-200 transition-all block">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <span class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">{{ texts.muddatiOtgan }}</span>
          </div>
          <p class="text-xs font-medium text-gray-500">{{ texts.muddatiOtganDebitor }}</p>
          <p class="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{{ formatMoney(dashboard.muddati_otgan_debitor?.uzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
          <p class="text-lg font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.muddati_otgan_debitor?.usd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
        </nuxt-link>

        <!-- Olingan qarz (click → drill-down) -->
        <button type="button" @click="toggleDrill('olingan')" :class="['text-left bg-white rounded-2xl p-5 shadow-md border hover:shadow-lg transition-all w-full', drill === 'olingan' ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-100']">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>
            </div>
            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{{ texts.berishKerak }}</span>
          </div>
          <p class="text-xs font-medium text-gray-500">{{ texts.olinganQarz }}</p>
          <p class="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{{ formatMoney(totalOlinganUzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
          <p class="text-lg font-bold text-gray-900 mt-1">{{ formatMoney(totalOlinganUsd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
        </button>

        <!-- Muddati o'tgan (kreditor) — QIZIL rang (Debitor kabi), USD raqam qora -->
        <nuxt-link :to="localePath({ name: 'expired-type', params: { type: 'creditor' } })" class="text-left bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-red-200 transition-all block">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <span class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">{{ texts.muddatiOtgan }}</span>
          </div>
          <p class="text-xs font-medium text-gray-500">{{ texts.muddatiOtganKreditor }}</p>
          <p class="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{{ formatMoney(dashboard.muddati_otgan_kreditor?.uzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
          <p class="text-lg font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.muddati_otgan_kreditor?.usd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
        </nuxt-link>
      </div>

      <!-- Drill-down: Berilgan (shartnoma vs daftari) -->
      <transition name="fade-slide">
        <div v-if="drill === 'berilgan'" class="mt-4 bg-white rounded-2xl shadow-md border border-blue-200 p-6">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
              </div>
              <h3 class="text-base font-bold text-gray-900">{{ texts.berilganQarzDetail }}</h3>
            </div>
            <button @click="drill = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Shartnoma sub-card -->
            <nuxt-link :to="localePath({ name: 'debt-list' }) + '?type=debitor'" class="group block bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-5 transition-all">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <h4 class="text-sm font-bold text-gray-900">{{ texts.shartnomaLabel }}</h4>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(dashboard.berilgan_qarz?.shartnoma?.uzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
              <p class="text-base font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.berilgan_qarz?.shartnoma?.usd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
              <p class="text-xs text-blue-600 mt-3 font-semibold">{{ texts.viewDetails }} →</p>
            </nuxt-link>
            <!-- Daftari sub-card -->
            <nuxt-link :to="localePath({ name: 'qarz-daftari-kiritish' })" class="group block bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 rounded-xl p-5 transition-all">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  </div>
                  <h4 class="text-sm font-bold text-gray-900">{{ texts.daftariLabel }}</h4>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(dashboard.berilgan_qarz?.daftari?.uzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
              <p class="text-base font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.berilgan_qarz?.daftari?.usd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
              <p class="text-xs text-green-700 mt-3 font-semibold">{{ texts.viewDetails }} →</p>
            </nuxt-link>
          </div>
        </div>
      </transition>

      <!-- Drill-down: Olingan (shartnoma vs daftari) -->
      <transition name="fade-slide">
        <div v-if="drill === 'olingan'" class="mt-4 bg-white rounded-2xl shadow-md border border-green-200 p-6">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>
              </div>
              <h3 class="text-base font-bold text-gray-900">{{ texts.olinganQarzDetail }}</h3>
            </div>
            <button @click="drill = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Shartnoma sub-card -->
            <nuxt-link :to="localePath({ name: 'debt-list' }) + '?type=creditor'" class="group block bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-5 transition-all">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <h4 class="text-sm font-bold text-gray-900">{{ texts.shartnomaLabel }}</h4>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(dashboard.olingan_qarz?.shartnoma?.uzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
              <p class="text-base font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.olingan_qarz?.shartnoma?.usd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
              <p class="text-xs text-blue-600 mt-3 font-semibold">{{ texts.viewDetails }} →</p>
            </nuxt-link>
            <!-- Daftari sub-card -->
            <nuxt-link :to="localePath({ name: 'qarz-daftari-kiritish' })" class="group block bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 rounded-xl p-5 transition-all">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  </div>
                  <h4 class="text-sm font-bold text-gray-900">{{ texts.daftariLabel }}</h4>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(dashboard.olingan_qarz?.daftari?.uzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
              <p class="text-base font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.olingan_qarz?.daftari?.usd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
              <p class="text-xs text-green-700 mt-3 font-semibold">{{ texts.viewDetails }} →</p>
            </nuxt-link>
          </div>
        </div>
      </transition>
    </div>

    <!-- Muddati yaqinlashganlar -->
    <QarzDaftariNearExpiration :nearDebitor="nearDebitor" :nearKreditor="nearKreditor" />
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      showWarning: true,
      drill: null, // null | 'berilgan' | 'olingan'
      dashboard: {
        berilgan_qarz: { shartnoma: { uzs: 0, usd: 0 }, daftari: { uzs: 0, usd: 0 } },
        olingan_qarz: { shartnoma: { uzs: 0, usd: 0 }, daftari: { uzs: 0, usd: 0 } },
        muddati_otgan_debitor: { uzs: 0, usd: 0 },
        muddati_otgan_kreditor: { uzs: 0, usd: 0 },
      },
      nearDebitor: [],
      nearKreditor: [],
    };
  },
  computed: {
    totalBerilganUzs() {
      return (this.dashboard.berilgan_qarz?.shartnoma?.uzs || 0) + (this.dashboard.berilgan_qarz?.daftari?.uzs || 0);
    },
    totalBerilganUsd() {
      return (this.dashboard.berilgan_qarz?.shartnoma?.usd || 0) + (this.dashboard.berilgan_qarz?.daftari?.usd || 0);
    },
    totalOlinganUzs() {
      return (this.dashboard.olingan_qarz?.shartnoma?.uzs || 0) + (this.dashboard.olingan_qarz?.daftari?.uzs || 0);
    },
    totalOlinganUsd() {
      return (this.dashboard.olingan_qarz?.shartnoma?.usd || 0) + (this.dashboard.olingan_qarz?.daftari?.usd || 0);
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          pageTitle: "Qarz daftari",
          pageSubtitle: "Qarz oldi-berdi munosabatlaringizni elektron boshqaring",
          warning: "Qarz oldi-berdi munosabatlaringizni qarz daftariga kiritish orqali qarzlaringizni elektron boshqarish imkoniga ega bo'lasiz. Biroq qarz daftariga kiritilgan qarzlar bo'yicha shartnoma rasmiylashtirilmaydi. Shu sababli siz ushbu qaydlar asosida sudga yoki vakolatli organga murojaat qila olmaysiz.",
          understood: "Tushundim",
          overview: "Umumiy ko'rinish",
          chartDesc: "Shartnoma va daftari nisbati",
          qarzdorliklar: "Qarzdorliklar",
          berilganQarz: "Berilgan qarz",
          olinganQarz: "Olingan qarz",
          berilganQarzDetail: "Berilgan qarz — manbalar bo'yicha",
          olinganQarzDetail: "Olingan qarz — manbalar bo'yicha",
          olishKerak: "Olish kerak",
          berishKerak: "Berish kerak",
          muddatiOtgan: "Muddati o'tgan",
          muddatiOtganDebitor: "Muddati o'tgan (debitor)",
          muddatiOtganKreditor: "Muddati o'tgan (kreditor)",
          shartnomaTuzish: "Qarz shartnomasi",
          daftarigaKiritish: "Qarz daftariga kiritish",
          shartnomaLabel: "Qarz shartnomasi",
          daftariLabel: "Qarz daftari",
          viewDetails: "Batafsil ko'rish",
        },
        ru: {
          pageTitle: "Книга долгов",
          pageSubtitle: "Управляйте долговыми отношениями электронно",
          warning: "Внося долговые отношения в книгу долгов, вы получаете возможность электронного управления долгами. Однако по записям в книге долгов договор не оформляется. Поэтому вы не можете обращаться в суд или уполномоченные органы на основании этих записей.",
          understood: "Понятно",
          overview: "Обзор",
          chartDesc: "Соотношение договора и книги",
          qarzdorliklar: "Задолженности",
          berilganQarz: "Выданные долги",
          olinganQarz: "Полученные долги",
          berilganQarzDetail: "Выданные долги — по источникам",
          olinganQarzDetail: "Полученные долги — по источникам",
          olishKerak: "К получению",
          berishKerak: "К возврату",
          muddatiOtgan: "Просрочено",
          muddatiOtganDebitor: "Просрочено (дебитор)",
          muddatiOtganKreditor: "Просрочено (кредитор)",
          shartnomaTuzish: "Договор долга",
          daftarigaKiritish: "Внести в книгу долгов",
          shartnomaLabel: "По договору",
          daftariLabel: "По книге долгов",
          viewDetails: "Подробнее",
        },
        kr: {
          pageTitle: "Қарз дафтари",
          pageSubtitle: "Қарз олди-берди муносабатларингизни электрон бошқаринг",
          warning: "Қарз олди-берди муносабатларингизни қарз дафтарига киритиш орқали қарзларингизни электрон бошқариш имконига эга бўласиз. Бироқ қарз дафтарига киритилган қарзлар бўйича шартнома расмийлаштирилмайди.",
          understood: "Тушундим",
          overview: "Умумий кўриниш",
          chartDesc: "Шартнома ва дафтари нисбати",
          qarzdorliklar: "Қарздорликлар",
          berilganQarz: "Берилган қарз",
          olinganQarz: "Олинган қарз",
          berilganQarzDetail: "Берилган қарз — манбалар бўйича",
          olinganQarzDetail: "Олинган қарз — манбалар бўйича",
          olishKerak: "Олиш керак",
          berishKerak: "Бериш керак",
          muddatiOtgan: "Муддати ўтган",
          muddatiOtganDebitor: "Муддати ўтган (дебитор)",
          muddatiOtganKreditor: "Муддати ўтган (кредитор)",
          shartnomaTuzish: "Қарз шартномаси",
          daftarigaKiritish: "Қарз дафтарига киритиш",
          shartnomaLabel: "Қарз шартномаси",
          daftariLabel: "Қарз дафтари",
          viewDetails: "Батафсил кўриш",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() {
    await Promise.all([this.loadDashboard(), this.loadNearExpiration()]);
  },
  methods: {
    formatMoney(n) {
      if (!n) return '0';
      return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    toggleDrill(section) {
      this.drill = this.drill === section ? null : section;
    },
    async loadDashboard() {
      try {
        const res = await this.$axios.$get('/qarz-daftari/dashboard', { silent: true });
        if (res?.success) this.dashboard = { ...this.dashboard, ...res.data };
      } catch (_) {}
    },
    async loadNearExpiration() {
      try {
        const res = await this.$axios.$get('/qarz-daftari/near-expiration', { silent: true });
        if (res?.success) {
          this.nearDebitor = res.data?.debitor || [];
          this.nearKreditor = res.data?.kreditor || [];
        }
      } catch (_) {}
    },
  },
};
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.3s ease;
}
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
