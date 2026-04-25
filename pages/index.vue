<template>
  <div>
    <!-- Landing Page for non-logged users -->
    <LandingPage v-if="!$auth.loggedIn" />

    <!-- Unified Analytics Dashboard (barcha login bo'lgan userlar uchun) -->
    <div v-else class="pb-8">
      <!-- Identifikatsiyadan o'tmagan foydalanuvchilar uchun banner (to'sqinlik emas) -->
      <div v-if="$auth.user && $auth.user.is_active !== 1" class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-5 flex flex-col md:flex-row md:items-center gap-3">
        <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-gray-900">{{ idenTexts.title }}</p>
          <p class="text-xs text-gray-600 mt-0.5">{{ idenTexts.shortMessage }}</p>
        </div>
        <div class="flex gap-2 flex-shrink-0">
          <a href="https://play.google.com/store/apps/details?id=com.zeroxuz" target="_blank" class="inline-flex items-center px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition-colors">
            <svg class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
            Google Play
          </a>
          <a href="https://apps.apple.com/uz/app/zerox/id6446497826" target="_blank" class="inline-flex items-center px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition-colors">
            <svg class="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            App Store
          </a>
        </div>
      </div>

      <!-- Modals -->
      <IdenMessage v-if="idenNotification" @removeIdenModal="removeIdenModal" />
      <contractModal v-if="contractM" @removeContractModal="removeContractModal" @closeContractModal="closeContractModal" />
      <PassportExpiredMessage v-if="passportExpiredModal" @close="passportExpiredModal = false" />

      <!-- SECTION 1: Welcome Header + Health Score -->
      <div class="mt-2">
        <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden">
          <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div class="relative z-10">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 class="text-2xl lg:text-3xl font-bold mb-2">
                  {{ texts.welcome }}, {{ $auth.user ? $auth.user.first_name : '' }}!
                </h1>
                <p class="text-blue-100 text-sm lg:text-base max-w-xl">
                  {{ texts.welcomeDesc }}
                </p>
              </div>
              <!-- Health Score -->
              <div class="mt-4 lg:mt-0 flex items-center gap-4">
                <div class="bg-white bg-opacity-20 backdrop-blur rounded-xl px-5 py-3 text-center min-w-[90px]">
                  <p class="text-3xl lg:text-4xl font-bold text-white">
                    {{ analytics.health?.score ?? '-' }}
                  </p>
                  <p class="text-blue-100 text-xs mt-1">{{ texts.healthScore }}</p>
                </div>
                <div class="bg-white bg-opacity-20 backdrop-blur rounded-xl px-5 py-3 text-center">
                  <p class="text-lg font-semibold text-white">{{ healthStatusText }}</p>
                  <p class="text-blue-100 text-xs mt-1">{{ texts.status }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="mt-8 flex justify-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="loadError" class="mt-8">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-sm text-red-700 font-medium mb-3">{{ texts.loadErrorMsg }}</p>
          <button @click="loadAnalytics" class="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
            {{ texts.retry }}
          </button>
        </div>
      </div>

      <template v-else>
        <!-- SECTION 2: Key Metrics (4 Cards) -->
        <div class="mt-6 lg:mt-8">
          <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.keyMetrics }}</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            <!-- Jami olingan qarz (shartnoma + daftari) -->
            <button type="button" @click="toggleMainDrill('olingan')" :class="['text-left block group w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border-t-4 border-red-500 h-full', mainDrill === 'olingan' ? 'ring-2 ring-red-200 shadow-lg' : '']">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                    </svg>
                  </div>
                  <p class="text-xs text-gray-500">{{ texts.totalBorrowed }}</p>
                </div>
                <svg :class="['w-4 h-4 text-gray-400 transition-transform', mainDrill === 'olingan' ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <p class="text-base font-bold text-gray-900">{{ formatShort(combinedBorrowedUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-semibold text-gray-600">{{ formatShort(combinedBorrowedUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
            </button>

            <!-- Jami berilgan qarz (shartnoma + daftari) -->
            <button type="button" @click="toggleMainDrill('berilgan')" :class="['text-left block group w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border-t-4 border-green-500 h-full', mainDrill === 'berilgan' ? 'ring-2 ring-green-200 shadow-lg' : '']">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                    </svg>
                  </div>
                  <p class="text-xs text-gray-500">{{ texts.totalLent }}</p>
                </div>
                <svg :class="['w-4 h-4 text-gray-400 transition-transform', mainDrill === 'berilgan' ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
              <p class="text-base font-bold text-gray-900">{{ formatShort(combinedLentUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-semibold text-gray-600">{{ formatShort(combinedLentUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
            </button>

            <!-- Oylik xarajat (Tez kunda) -->
            <div class="block relative" style="cursor: default;">
              <span style="position: absolute; top: 8px; right: 8px; font-size: 9px; background: #dbeafe; color: #2563eb; padding: 2px 8px; border-radius: 10px; font-weight: 700; z-index: 1;">Tez kunda</span>
              <div class="bg-white rounded-2xl p-4 shadow-sm border-t-4 border-amber-500 h-full text-center opacity-60">
                <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <p class="text-lg font-bold text-gray-900">0</p>
                <p class="text-xs text-gray-500 mt-1">{{ texts.monthlyExpense }}</p>
              </div>
            </div>

            <!-- Maqsadlar (Tez kunda) -->
            <div class="block relative" style="cursor: default;">
              <span style="position: absolute; top: 8px; right: 8px; font-size: 9px; background: #dbeafe; color: #2563eb; padding: 2px 8px; border-radius: 10px; font-weight: 700; z-index: 1;">Tez kunda</span>
              <div class="bg-white rounded-2xl p-4 shadow-sm border-t-4 border-purple-500 h-full text-center opacity-60">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p class="text-2xl font-bold text-gray-900">0%</p>
                <p class="text-xs text-gray-500 mt-1">{{ texts.goalsProgress }}</p>
              </div>
            </div>
          </div>

          <!-- Drill-down: Jami olingan qarz (shartnoma vs daftari) -->
          <transition name="fade-slide">
            <div v-if="mainDrill === 'olingan'" class="mt-4 bg-white rounded-2xl shadow-md border-t-4 border-red-500 p-5 lg:p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-bold text-gray-900">{{ texts.totalBorrowed }} — {{ texts.bySource }}</h3>
                <button @click="mainDrill = null" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <nuxt-link :to="localePath({ name: 'contract-dashboard' })" class="group block bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-5 transition-all">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </div>
                      <h4 class="text-sm font-bold text-gray-900">{{ texts.contractModule }}</h4>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </div>
                  <p class="text-2xl font-bold text-gray-900">{{ formatShort(combinedStats.olingan?.shartnoma?.uzs) }} <span class="text-sm text-gray-400">UZS</span></p>
                  <p class="text-base font-bold text-gray-900 mt-1">{{ formatShort(combinedStats.olingan?.shartnoma?.usd) }} <span class="text-xs text-gray-400">USD</span></p>
                  <p class="text-xs text-blue-600 mt-3 font-semibold">{{ texts.viewSection }} →</p>
                </nuxt-link>
                <nuxt-link :to="localePath({ name: 'qarz-daftari' })" class="group block bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 rounded-xl p-5 transition-all">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                      </div>
                      <h4 class="text-sm font-bold text-gray-900">{{ texts.debtModule }}</h4>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </div>
                  <p class="text-2xl font-bold text-gray-900">{{ formatShort(combinedStats.olingan?.daftari?.uzs) }} <span class="text-sm text-gray-400">UZS</span></p>
                  <p class="text-base font-bold text-gray-900 mt-1">{{ formatShort(combinedStats.olingan?.daftari?.usd) }} <span class="text-xs text-gray-400">USD</span></p>
                  <p class="text-xs text-green-700 mt-3 font-semibold">{{ texts.viewSection }} →</p>
                </nuxt-link>
              </div>
            </div>
          </transition>

          <!-- Drill-down: Jami berilgan qarz (shartnoma vs daftari) -->
          <transition name="fade-slide">
            <div v-if="mainDrill === 'berilgan'" class="mt-4 bg-white rounded-2xl shadow-md border-t-4 border-green-500 p-5 lg:p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-bold text-gray-900">{{ texts.totalLent }} — {{ texts.bySource }}</h3>
                <button @click="mainDrill = null" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <nuxt-link :to="localePath({ name: 'contract-dashboard' })" class="group block bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-5 transition-all">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </div>
                      <h4 class="text-sm font-bold text-gray-900">{{ texts.contractModule }}</h4>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </div>
                  <p class="text-2xl font-bold text-gray-900">{{ formatShort(combinedStats.berilgan?.shartnoma?.uzs) }} <span class="text-sm text-gray-400">UZS</span></p>
                  <p class="text-base font-bold text-gray-900 mt-1">{{ formatShort(combinedStats.berilgan?.shartnoma?.usd) }} <span class="text-xs text-gray-400">USD</span></p>
                  <p class="text-xs text-blue-600 mt-3 font-semibold">{{ texts.viewSection }} →</p>
                </nuxt-link>
                <nuxt-link :to="localePath({ name: 'qarz-daftari' })" class="group block bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 rounded-xl p-5 transition-all">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                      </div>
                      <h4 class="text-sm font-bold text-gray-900">{{ texts.debtModule }}</h4>
                    </div>
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </div>
                  <p class="text-2xl font-bold text-gray-900">{{ formatShort(combinedStats.berilgan?.daftari?.uzs) }} <span class="text-sm text-gray-400">UZS</span></p>
                  <p class="text-base font-bold text-gray-900 mt-1">{{ formatShort(combinedStats.berilgan?.daftari?.usd) }} <span class="text-xs text-gray-400">USD</span></p>
                  <p class="text-xs text-green-700 mt-3 font-semibold">{{ texts.viewSection }} →</p>
                </nuxt-link>
              </div>
            </div>
          </transition>
        </div>

        <!-- SECTION 3: Module Overview Cards -->
        <div class="mt-6 lg:mt-8">
          <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.modulesOverview }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <!-- Qarz Shartnomasi -->
            <nuxt-link :to="localePath({ name: 'contract-dashboard' })" class="block group">
              <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all h-full">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 class="text-base font-bold text-gray-900">{{ texts.contractModule }}</h3>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-blue-50 rounded-xl p-3">
                    <p class="text-xl font-bold text-blue-700">{{ debitorChartAll }}</p>
                    <p class="text-xs text-gray-500">{{ texts.debitorContracts }}</p>
                  </div>
                  <div class="bg-green-50 rounded-xl p-3">
                    <p class="text-xl font-bold text-green-700">{{ creditorChartAll }}</p>
                    <p class="text-xs text-gray-500">{{ texts.creditorContracts }}</p>
                  </div>
                </div>
              </div>
            </nuxt-link>

            <!-- Qarz Daftari -->
            <nuxt-link :to="localePath({ name: 'qarz-daftari' })" class="block group">
              <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all h-full">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 class="text-base font-bold text-gray-900">{{ texts.debtModule }}</h3>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-red-50 rounded-xl p-3">
                    <p class="text-lg font-bold text-red-700">{{ formatShort(analytics.debts?.borrowed_total) }}</p>
                    <p class="text-xs text-gray-500">{{ texts.borrowed }}</p>
                  </div>
                  <div class="bg-green-50 rounded-xl p-3">
                    <p class="text-lg font-bold text-green-700">{{ formatShort(analytics.debts?.lent_total) }}</p>
                    <p class="text-xs text-gray-500">{{ texts.lent }}</p>
                  </div>
                </div>
              </div>
            </nuxt-link>

            <!-- Shaxsiy Moliya -->
            <nuxt-link :to="localePath({ name: 'finance' })" class="block group">
              <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all h-full">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 class="text-base font-bold text-gray-900">{{ texts.financeModule }}</h3>
                  </div>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-amber-50 rounded-xl p-3">
                    <p class="text-lg font-bold text-amber-700">{{ formatShort(analytics.finance?.monthly_expense) }}</p>
                    <p class="text-xs text-gray-500">{{ texts.expenses }}</p>
                  </div>
                  <div class="bg-purple-50 rounded-xl p-3">
                    <p class="text-lg font-bold text-purple-700">{{ analytics.finance?.goals?.active_count || 0 }}</p>
                    <p class="text-xs text-gray-500">{{ texts.activeGoals }}</p>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>

        <!-- SECTION 4: Alerts -->
        <div v-if="analytics.alerts && analytics.alerts.length > 0" class="mt-6 lg:mt-8">
          <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.alertsTitle }}</h2>
          <div class="space-y-3">
            <div
              v-for="(alert, idx) in analytics.alerts"
              :key="idx"
              class="flex items-center p-4 rounded-xl border"
              :class="alertClass(alert.type)"
            >
              <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0" :class="alertIconClass(alert.type)">
                <svg v-if="alert.type === 'danger'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <svg v-else-if="alert.type === 'warning'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-sm">{{ getAlertTitle(alert) }}</p>
                <p v-if="alert.count" class="text-xs text-gray-500 mt-0.5">{{ alert.count }} {{ texts.alertCount }}</p>
              </div>
              <nuxt-link
                :to="localePath(getAlertLink(alert))"
                class="text-sm font-medium hover:underline ml-3 flex-shrink-0"
                :class="alertLinkClass(alert.type)"
              >
                {{ texts.view }}
              </nuxt-link>
            </div>
          </div>
        </div>

        <!-- SECTION 5: Quick Actions -->
        <div class="mt-6 lg:mt-8">
          <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.quickActions }}</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            <button @click="giveMoney" class="flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <IconGiveMoney :width="24" :height="24" />
              </div>
              <span class="text-sm font-medium text-gray-700">{{ $t('home.give') }}</span>
            </button>

            <button @click="takeMoney" class="flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all group">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <IconTakeMoney :width="24" :height="24" />
              </div>
              <span class="text-sm font-medium text-gray-700">{{ $t('home.take') }}</span>
            </button>

            <nuxt-link :to="localePath({ name: 'finance-expenses-add' })" class="flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-200 transition-all group">
              <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-700">{{ texts.addExpense }}</span>
            </nuxt-link>

            <nuxt-link :to="localePath({ name: 'finance-debts-add' })" class="flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all group">
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-700">{{ texts.addDebt }}</span>
            </nuxt-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import IconGiveMoney from '@/components/icons/IconGiveMoney.vue'
import IconTakeMoney from '@/components/icons/IconTakeMoney.vue'

// Nuxt auto-import: IdenMessage, ContractModal
const LandingPage = () => import(/* webpackChunkName: "landing-page", webpackPreload: true */ "@/components/LandingPage.vue");
// Nuxt auto-import: PassportExpiredMessage

export default {
  name: 'UnifiedDashboard',
  auth: false,

  components: {
    // IdenMessage, ContractModal, PassportExpiredMessage — Nuxt auto-import
    LandingPage,
    IconGiveMoney,
    IconTakeMoney,
  },

  data() {
    return {
      idenNotification: false,
      contractM: false,
      passportExpiredModal: false,
      loading: true,
      loadError: false,
      mainDrill: null, // null | 'olingan' | 'berilgan'
      // Qarz shartnomasi (contracts) + Qarz daftari (qarz_daftari) data
      combinedStats: {
        berilgan: {
          shartnoma: { uzs: 0, usd: 0 },
          daftari: { uzs: 0, usd: 0 },
        },
        olingan: {
          shartnoma: { uzs: 0, usd: 0 },
          daftari: { uzs: 0, usd: 0 },
        },
      },
      analytics: {
        health: { score: 0, status: 'good' },
        contracts: { debitor: {}, creditor: {} },
        debts: {},
        finance: {},
        alerts: [],
      },
    };
  },

  computed: {
    isLoggedIn() { return !!this.$auth?.loggedIn; },
    userId() { return this.$auth?.user?.id || null; },
    isPassportExpired() {
      const d = this.$auth?.user?.expiry_date;
      return !!d && new Date(d) < new Date();
    },

    contractActiveCount() {
      return (this.analytics.contracts?.debitor?.chart?.jarayon || 0) +
             (this.analytics.contracts?.creditor?.chart?.jarayon || 0);
    },
    debitorChartAll() {
      return this.analytics.contracts?.debitor?.chart?.all || 0;
    },
    creditorChartAll() {
      return this.analytics.contracts?.creditor?.chart?.all || 0;
    },
    debitorUzsAmount() {
      const data = this.analytics.contracts?.debitor?.data || [];
      const found = data.find(i => i.currency === 'UZS');
      return found ? found.residual_amount : 0;
    },

    // Jami olingan qarz (shartnoma + daftari) UZS
    combinedBorrowedUzs() {
      return (Number(this.combinedStats.olingan?.shartnoma?.uzs) || 0)
           + (Number(this.combinedStats.olingan?.daftari?.uzs) || 0);
    },
    combinedBorrowedUsd() {
      return (Number(this.combinedStats.olingan?.shartnoma?.usd) || 0)
           + (Number(this.combinedStats.olingan?.daftari?.usd) || 0);
    },
    // Jami berilgan qarz (shartnoma + daftari)
    combinedLentUzs() {
      return (Number(this.combinedStats.berilgan?.shartnoma?.uzs) || 0)
           + (Number(this.combinedStats.berilgan?.daftari?.uzs) || 0);
    },
    combinedLentUsd() {
      return (Number(this.combinedStats.berilgan?.shartnoma?.usd) || 0)
           + (Number(this.combinedStats.berilgan?.daftari?.usd) || 0);
    },

    idenTexts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: "Identifikatsiyadan o'ting", shortMessage: "Tizimning barcha imkoniyatlaridan to'liq foydalanish uchun mobil ilova orqali identifikatsiyadan o'ting.", message: "Hurmatli foydalanuvchi, siz identifikatsiyadan o'tmaganligingiz sababli tizimning asosiy funksiyalaridan foydalana olmaysiz. Iltimos, tizimdan to'liq foydalanish uchun quyidagi havola orqali mobil ilovani yuklab oling va identifikatsiyadan o'ting." },
        ru: { title: "Пройдите идентификацию", shortMessage: "Чтобы использовать все возможности системы, пройдите идентификацию через мобильное приложение.", message: "Уважаемый пользователь, вы не можете использовать основные функции системы, потому что не прошли идентификацию. Пожалуйста, загрузите мобильное приложение по ссылке ниже и пройдите идентификацию, чтобы в полной мере использовать систему." },
        kr: { title: "Идентификациядан ўтинг", shortMessage: "Тизимнинг барча имкониятларидан тўлиқ фойдаланиш учун мобил илова орқали идентификациядан ўтинг.", message: "Ҳурматли фойдаланувчи, сиз идентификациядан ўтмаганлигингиз сабабли тизимнинг асосий функцияларидан фойдалана олмайсиз. Илтимос, тизимдан тўлиқ фойдаланиш учун қуйидаги ҳавола орқали мобил иловани юклаб олинг ва идентификациядан ўтинг." },
      };
      return t[l] || t.uz;
    },
    healthScoreColor() {
      const s = this.analytics.health?.score || 0;
      if (s >= 85) return 'text-green-300';
      if (s >= 70) return 'text-yellow-300';
      if (s >= 50) return 'text-orange-300';
      return 'text-red-300';
    },
    healthStatusText() {
      const status = this.analytics.health?.status || 'good';
      const map = {
        excellent: this.texts.healthExcellent,
        good: this.texts.healthGood,
        fair: this.texts.healthFair,
        poor: this.texts.healthPoor,
      };
      return map[status] || status;
    },
    budgetBarColor() {
      const pct = this.analytics.finance?.budget?.percentage || 0;
      if (pct > 100) return 'bg-red-500';
      if (pct > 80) return 'bg-yellow-500';
      return 'bg-green-500';
    },

    texts() {
      return {
        welcome: this.$t('home_texts.welcome'),
        welcomeDesc: this.$t('home_texts.welcome_desc'),
        healthScore: this.$t('home_texts.health_score'),
        status: this.$t('home_texts.status'),
        healthExcellent: this.$t('home_texts.health_excellent'),
        healthGood: this.$t('home_texts.health_good'),
        healthFair: this.$t('home_texts.health_fair'),
        healthPoor: this.$t('home_texts.health_poor'),
        keyMetrics: this.$t('home_texts.key_metrics'),
        activeContracts: this.$t('home_texts.active_contracts'),
        receivableUzs: this.$t('home_texts.receivable_uzs'),
        totalBorrowed: this.$t('home_texts.total_borrowed'),
        totalLent: this.$t('home_texts.total_lent'),
        monthlyExpense: this.$t('home_texts.monthly_expense'),
        goalsProgress: this.$t('home_texts.goals_progress'),
        modulesOverview: this.$t('home_texts.modules_overview'),
        contractModule: this.$t('home_texts.contract_module'),
        debtModule: this.$t('home_texts.debt_module'),
        financeModule: this.$t('home_texts.finance_module'),
        debitorContracts: this.$t('home_texts.debitor_contracts'),
        creditorContracts: this.$t('home_texts.creditor_contracts'),
        borrowed: this.$t('home_texts.borrowed'),
        lent: this.$t('home_texts.lent'),
        overdueDebts: this.$t('home_texts.overdue_debts'),
        budget: this.$t('home_texts.budget'),
        expenses: this.$t('home_texts.expenses'),
        activeGoals: this.$t('home_texts.active_goals'),
        alertsTitle: this.$t('home_texts.alerts_title'),
        alertCount: this.$t('home_texts.alert_count'),
        view: this.$t('home_texts.view'),
        quickActions: this.$t('home_texts.quick_actions'),
        addExpense: this.$t('home_texts.add_expense'),
        addDebt: this.$t('home_texts.add_debt'),
        alert_expiring_debitor: this.$t('home_texts.alert_expiring_debitor'),
        alert_expiring_creditor: this.$t('home_texts.alert_expiring_creditor'),
        alert_expired_debitor: this.$t('home_texts.alert_expired_debitor'),
        alert_expired_creditor: this.$t('home_texts.alert_expired_creditor'),
        alert_overdue_debts: this.$t('home_texts.alert_overdue_debts'),
        alert_budget_exceeded: this.$t('home_texts.alert_budget_exceeded'),
        alert_budget_warning: this.$t('home_texts.alert_budget_warning'),
        alert_upcoming_payments: this.$t('home_texts.alert_upcoming_payments'),
        loadErrorMsg: this.$t('home_texts.load_error_msg'),
        retry: this.$t('home_texts.retry'),
        bySource: this.bySourceLabel,
        viewSection: this.viewSectionLabel,
      };
    },

    bySourceLabel() {
      const l = this.$i18n?.locale || 'uz';
      return { uz: "manbalar bo'yicha", ru: 'по источникам', kr: "манбалар бўйича" }[l] || "manbalar bo'yicha";
    },
    viewSectionLabel() {
      const l = this.$i18n?.locale || 'uz';
      return { uz: "Bo'limga o'tish", ru: 'Перейти в раздел', kr: "Бўлимга ўтиш" }[l] || "Bo'limga o'tish";
    },
  },

  watch: {
    isLoggedIn(v) {
      if (v) this.loadAnalytics();
    },
    userId() {
      if (this.isLoggedIn) this.loadAnalytics();
    },
  },

  mounted() {
    this.$nuxt.$emit("forceUpdateParent");
    if (this.isLoggedIn) {
      // passportExpiredModal faqat tugma bosilganda ochiladi
      this.loadAnalytics();
      this.loadDaftariStats();
    }
  },

  methods: {
    toggleMainDrill(section) {
      this.mainDrill = this.mainDrill === section ? null : section;
    },

    async loadAnalytics() {
      try {
        this.loading = true;
        this.loadError = false;
        const res = await this.$axios.$get('/home/analytics');
        if (res?.success) {
          this.analytics = res.data;
        }
      } catch (error) {
        console.error('[Dashboard] Analytics load error:', error);
        this.loadError = true;
      } finally {
        this.loading = false;
      }
    },

    async loadDaftariStats() {
      // Qarz daftari endpoint qarz shartnomasi (contracts) + qarz daftari (qarz_daftari) ikkala manbani qaytaradi
      try {
        const res = await this.$axios.$get('/qarz-daftari/dashboard', { silent: true });
        if (res?.success && res.data) {
          this.combinedStats = {
            berilgan: {
              shartnoma: res.data.berilgan_qarz?.shartnoma || { uzs: 0, usd: 0 },
              daftari: res.data.berilgan_qarz?.daftari || { uzs: 0, usd: 0 },
            },
            olingan: {
              shartnoma: res.data.olingan_qarz?.shartnoma || { uzs: 0, usd: 0 },
              daftari: res.data.olingan_qarz?.daftari || { uzs: 0, usd: 0 },
            },
          };
        }
      } catch (_) {}
    },

    formatMoney(value) {
      if (!value) return '0';
      return this.$formatNumber ? this.$formatNumber(Number(value)) : Number(value).toLocaleString('uz-UZ');
    },

    formatShort(value) {
      if (!value) return '0';
      const num = Number(value);
      if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return Math.round(num / 1000) + 'K';
      return this.$formatNumber ? this.$formatNumber(num) : num.toLocaleString('uz-UZ');
    },

    alertClass(type) {
      const map = { danger: 'bg-red-50 border-red-200', warning: 'bg-amber-50 border-amber-200', info: 'bg-blue-50 border-blue-200' };
      return map[type] || 'bg-gray-50 border-gray-200';
    },
    alertIconClass(type) {
      const map = { danger: 'bg-red-100 text-red-600', warning: 'bg-amber-100 text-amber-600', info: 'bg-blue-100 text-blue-600' };
      return map[type] || 'bg-gray-100';
    },
    alertLinkClass(type) {
      const map = { danger: 'text-red-600', warning: 'text-amber-600', info: 'text-blue-600' };
      return map[type] || 'text-gray-600';
    },
    getAlertTitle(alert) {
      return this.texts[`alert_${alert.code}`] || alert.code;
    },
    getAlertLink(alert) {
      const links = {
        expiring_debitor: { name: 'contract-dashboard' },
        expiring_creditor: { name: 'contract-dashboard' },
        expired_debitor: { name: 'expired-type', params: { type: 'debitor' } },
        expired_creditor: { name: 'expired-type', params: { type: 'creditor' } },
        overdue_debts: { name: 'finance-debts' },
        budget_exceeded: { name: 'finance-budget' },
        budget_warning: { name: 'finance-budget' },
        upcoming_payments: { name: 'finance-debts' },
      };
      return links[alert.code] || { name: 'index' };
    },

    removeIdenModal() { this.idenNotification = false; },
    removeContractModal() { this.contractM = false; if (process.client) window.location.reload(); },
    closeContractModal() { this.contractM = false; },

    showPassportExpiredToast() {
      const msgs = {
        uz: "Hurmatli foydalanuvchi, ID karta (pasport) muddati o'tganligi sababli Siz tizimning asosiy funksiyalaridan foydalana olmaysiz. Iltimos, tizimdan to'liq foydalanish uchun quyidagi havola orqali mobil ilovani yuklab oling va qayta identifikatsiyadan o'ting.",
        ru: "Уважаемый пользователь, Вы не можете использовать основные функции системы, потому что срок действия вашей ID-карты (паспорта) истек. Пожалуйста, загрузите мобильное приложение по ссылке ниже и пройдите повторную идентификацию, чтобы в полной мере использовать систему.",
        kr: "Ҳурматли фойдаланувчи, ID карта (паспорт) муддати ўтганлиги сабабли Сиз тизимнинг асосий функцияларидан фойдалана олмайсиз. Илтимос, тизимдан тўлиқ фойдаланиш учун қуйидаги ҳавола орқали мобил иловани юклаб олинг ва қайта идентификациядан ўтинг.",
      };
      this.$toast.error(msgs[this.$i18n?.locale] || msgs.uz);
    },

    giveMoney() {
      if (this.isPassportExpired) { this.passportExpiredModal = true; return; }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: 'auth-login' }));
      if (this.$auth.user.is_active != 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: 'search', query: { type: 'debitor' } }));
    },

    takeMoney() {
      if (this.isPassportExpired) { this.passportExpiredModal = true; return; }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: 'auth-login' }));
      if (this.$auth.user.is_active != 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: 'search', query: { type: 'creditor' } }));
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
