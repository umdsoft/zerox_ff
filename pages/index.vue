<template>
  <div>
    <!-- Landing Page for non-logged users -->
    <LandingPage v-if="!$auth.loggedIn" />

    <!-- Dashboard for logged users -->
    <div v-else class="pb-8">
      <!-- Modals -->
      <IdenMessage v-if="idenNotification" @removeIdenModal="removeIdenModal" />
      <contractModal v-if="contractM" @removeContractModal="removeContractModal" @closeContractModal="closeContractModal" />

      <!-- Welcome Banner -->
      <div class="mt-2">
        <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden">
          <!-- Background Pattern -->
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
              <div class="mt-5 lg:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-5">
                <button
                  @click="giveMoney"
                  class="flex items-center justify-center px-8 py-4 bg-white text-blue-700 rounded-2xl text-lg font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <IconGiveMoney :width="28" :height="28" class="mr-3" />
                  {{ $t('home.give') }}
                </button>
                <button
                  @click="takeMoney"
                  class="flex items-center justify-center px-8 py-4 bg-green-500 text-white rounded-2xl text-lg font-bold hover:bg-green-600 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <IconTakeMoney :width="28" :height="28" class="mr-3" />
                  {{ $t('home.take') }}
                </button>
              </div>
            </div>

            <!-- Quick Stats in Banner -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white border-opacity-20">
              <div class="text-center lg:text-left">
                <p class="text-3xl lg:text-4xl font-bold">{{ dall || 0 }}</p>
                <p class="text-blue-200 text-sm">{{ texts.totalDebitor }}</p>
              </div>
              <div class="text-center lg:text-left">
                <p class="text-3xl lg:text-4xl font-bold">{{ call || 0 }}</p>
                <p class="text-blue-200 text-sm">{{ texts.totalCreditor }}</p>
              </div>
              <div class="text-center lg:text-left">
                <p class="text-3xl lg:text-4xl font-bold text-green-300">{{ activeContracts }}</p>
                <p class="text-blue-200 text-sm">{{ texts.activeContracts }}</p>
              </div>
              <div class="text-center lg:text-left">
                <p class="text-3xl lg:text-4xl font-bold text-yellow-300">{{ expiredCount }}</p>
                <p class="text-blue-200 text-sm">{{ texts.expiredContracts }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Charts Section -->
      <div class="mt-6 lg:mt-8">
        <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.contractsOverview }}</h2>
        <!-- Desktop: Two columns -->
        <div class="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Debitor Chart -->
          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ $t('home.contracts') }}</h3>
                <p class="text-sm text-gray-500">{{ texts.debitorContracts }}</p>
              </div>
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                </svg>
              </div>
            </div>
            <div v-if="isChart" class="flex justify-center">
              <client-only>
                <apexchart
                  v-if="dall != 0"
                  type="pie"
                  width="380"
                  :options="chartOptions"
                  :series="seriesd"
                  :key="chartKeyD"
                />
              </client-only>
              <div v-if="$auth.user.is_active == 0 || dall == 0" class="flex flex-col items-center justify-center py-8">
                <IconPiePlaceholder :width="160" :height="160" />
                <p class="text-gray-400 mt-4 text-sm">{{ texts.noData }}</p>
              </div>
            </div>
          </div>

          <!-- Kreditor Chart -->
          <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-bold text-gray-900">{{ $t('home.contracts1') }}</h3>
                <p class="text-sm text-gray-500">{{ texts.creditorContracts }}</p>
              </div>
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                </svg>
              </div>
            </div>
            <div v-if="isChart" class="flex justify-center">
              <client-only>
                <apexchart
                  v-if="call != 0"
                  type="pie"
                  width="380"
                  :options="chartOptions2"
                  :series="seriesc"
                  :key="chartKeyC"
                />
              </client-only>
              <div v-if="$auth.user.is_active == 0 || call == 0" class="flex flex-col items-center justify-center py-8">
                <IconPiePlaceholder :width="160" :height="160" />
                <p class="text-gray-400 mt-4 text-sm">{{ texts.noData }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile: Carousel -->
        <div class="md:hidden">
          <div
            ref="carousel"
            class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 space-x-4"
            style="-ms-overflow-style: none; scrollbar-width: none;"
          >
            <!-- Slide 1: Debitor -->
            <section ref="slide0" class="flex-shrink-0 snap-center" style="min-width: 88%">
              <div class="bg-white rounded-2xl p-5 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-bold text-gray-900">{{ $t('home.contracts') }}</h3>
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                    </svg>
                  </div>
                </div>
                <div v-if="isChart" class="flex justify-center">
                  <client-only>
                    <apexchart
                      v-if="dall != 0"
                      type="pie"
                      width="100%"
                      :options="chartOptionsMobileRightDeb"
                      :series="seriesd"
                      :key="`m-${chartKeyD}`"
                    />
                  </client-only>
                  <div v-if="$auth.user.is_active == 0 || dall == 0" class="flex flex-col items-center justify-center py-6">
                    <IconPiePlaceholder :width="140" :height="140" />
                    <p class="text-gray-400 mt-3 text-sm">{{ texts.noData }}</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Slide 2: Kreditor -->
            <section ref="slide1" class="flex-shrink-0 snap-center" style="min-width: 88%">
              <div class="bg-white rounded-2xl p-5 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-bold text-gray-900">{{ $t('home.contracts1') }}</h3>
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                    </svg>
                  </div>
                </div>
                <div v-if="isChart" class="flex justify-center">
                  <client-only>
                    <apexchart
                      v-if="call != 0"
                      type="pie"
                      width="100%"
                      :options="chartOptionsMobileRightCred"
                      :series="seriesc"
                      :key="`m-${chartKeyC}`"
                    />
                  </client-only>
                  <div v-if="$auth.user.is_active == 0 || call == 0" class="flex flex-col items-center justify-center py-6">
                    <IconPiePlaceholder :width="140" :height="140" />
                    <p class="text-gray-400 mt-3 text-sm">{{ texts.noData }}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Carousel Dots -->
          <div class="mt-4 flex items-center justify-center space-x-2">
            <button
              v-for="i in 2"
              :key="`dot-${i}`"
              class="h-2 w-2 rounded-full transition-all duration-300"
              :class="activeSlide === (i - 1) ? 'bg-blue-600 w-6' : 'bg-gray-300'"
              @click="goTo(i - 1)"
              aria-label="slide dot"
            />
          </div>
        </div>
      </div>

      <!-- Main Stats Cards -->
      <div class="mt-6 lg:mt-8">
        <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.financialSummary }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <!-- Debitor Card -->
          <nuxt-link :to="localePath({ name: 'debt-list' })" class="block group">
            <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 h-full">
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconDebitor :width="28" :height="28" />
                </div>
                <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{{ texts.receivable }}</span>
              </div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('home.debitor') }}</h3>
              <p class="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                {{ debitorUzs ? formatNum(debitorUzs.residual_amount) : 0 }} <span class="text-sm font-medium text-gray-500">UZS</span>
              </p>
              <p class="text-base font-semibold text-gray-700">
                {{ debitorUsd ? formatNum(debitorUsd.residual_amount) : 0 }} <span class="text-sm font-medium text-gray-500">USD</span>
              </p>
            </div>
          </nuxt-link>

          <!-- Creditor Card -->
          <nuxt-link :to="localePath({ name: 'credit-list' })" class="block group">
            <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 h-full">
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconCreditor :width="28" :height="28" />
                </div>
                <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{{ texts.payable }}</span>
              </div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('home.creditor') }}</h3>
              <p class="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                {{ creditorUzs ? formatNum(creditorUzs.residual_amount) : 0 }} <span class="text-sm font-medium text-gray-500">UZS</span>
              </p>
              <p class="text-base font-semibold text-gray-700">
                {{ creditorUsd ? formatNum(creditorUsd.residual_amount) : 0 }} <span class="text-sm font-medium text-gray-500">USD</span>
              </p>
            </div>
          </nuxt-link>

          <!-- Expired Debitor Card -->
          <nuxt-link :to="localePath({ name: 'expired-debitor' })" class="block group">
            <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-red-500 h-full">
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconExpiredD :width="28" :height="28" />
                </div>
                <span class="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">{{ texts.overdue }}</span>
              </div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('home.expiredD') }}</h3>
              <p class="text-xl lg:text-2xl font-bold text-red-600 mb-1">
                {{ expiredDebitorUzs ? formatNum(expiredDebitorUzs.residual_amount) : 0 }} <span class="text-sm font-medium">UZS</span>
              </p>
              <p class="text-base font-semibold text-red-500">
                {{ expiredDebitorUsd ? formatNum(expiredDebitorUsd.residual_amount) : 0 }} <span class="text-sm font-medium">USD</span>
              </p>
            </div>
          </nuxt-link>

          <!-- Expired Creditor Card -->
          <nuxt-link :to="localePath({ name: 'expired-creditor' })" class="block group">
            <div class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500 h-full">
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconExpiredC :width="28" :height="28" />
                </div>
                <span class="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">{{ texts.overdue }}</span>
              </div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">{{ $t('home.expiredC') }}</h3>
              <p class="text-xl lg:text-2xl font-bold text-orange-600 mb-1">
                {{ expiredCreditorUzs ? formatNum(expiredCreditorUzs.residual_amount) : 0 }} <span class="text-sm font-medium">UZS</span>
              </p>
              <p class="text-base font-semibold text-orange-500">
                {{ expiredCreditorUsd ? formatNum(expiredCreditorUsd.residual_amount) : 0 }} <span class="text-sm font-medium">USD</span>
              </p>
            </div>
          </nuxt-link>
        </div>
      </div>

      <!-- Near Expiration Tables -->
      <div class="mt-6 lg:mt-8">
        <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.upcomingPayments }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Debitor Near Expiration -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div class="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-base lg:text-lg font-bold text-gray-900">{{ $t('home.ozD') }}</h3>
                </div>
              </div>
            </div>

            <!-- Currency Tabs -->
            <div class="flex gap-2 p-4 bg-gray-50">
              <button
                @click="handleTab('left', 1)"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                :class="tabLeft === 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
              >
                UZS
              </button>
              <button
                @click="handleTab('left', 2)"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                :class="tabLeft === 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
              >
                USD
              </button>
            </div>

            <!-- Table -->
            <div class="px-4 pb-4">
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="grid grid-cols-2 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">
                  <span>{{ $t('home.time') }}</span>
                  <span class="text-right">{{ $t('home.sum') }}</span>
                </div>
                <ul class="divide-y divide-gray-100">
                  <li v-for="(item, i) in debitorData" :key="i">
                    <nuxt-link
                      :to="localePath({ name: 'near-expiration-debitor', query: { day: item.end_date, type: item.currency } })"
                      class="grid grid-cols-2 px-4 py-3.5 hover:bg-blue-50 transition-colors"
                    >
                      <DaysDisplay :end-date="item.end_date" />
                      <span class="text-right text-sm font-semibold text-gray-800">{{ formatNum(item.residual_amount) }} {{ item.currency }}</span>
                    </nuxt-link>
                  </li>
                  <li v-if="debitorData.length === 0" class="px-4 py-8 text-center">
                    <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p class="text-gray-400 text-sm">{{ $t('empty') }}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Creditor Near Expiration -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div class="px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 class="text-base lg:text-lg font-bold text-gray-900">{{ $t('home.ozC') }}</h3>
                </div>
              </div>
            </div>

            <!-- Currency Tabs -->
            <div class="flex gap-2 p-4 bg-gray-50">
              <button
                @click="handleTab('right', 1)"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                :class="tabRight === 1 ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
              >
                UZS
              </button>
              <button
                @click="handleTab('right', 2)"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                :class="tabRight === 2 ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
              >
                USD
              </button>
            </div>

            <!-- Table -->
            <div class="px-4 pb-4">
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="grid grid-cols-2 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">
                  <span>{{ $t('home.time') }}</span>
                  <span class="text-right">{{ $t('home.sum') }}</span>
                </div>
                <ul class="divide-y divide-gray-100">
                  <li v-for="(item, i) in creditorData" :key="i">
                    <nuxt-link
                      :to="localePath({ name: 'near-expiration-creditor', query: { day: item.end_date, type: item.currency } })"
                      class="grid grid-cols-2 px-4 py-3.5 hover:bg-green-50 transition-colors"
                    >
                      <DaysDisplay :end-date="item.end_date" />
                      <span class="text-right text-sm font-semibold text-gray-800">{{ formatNum(item.residual_amount) }} {{ item.currency }}</span>
                    </nuxt-link>
                  </li>
                  <li v-if="creditorData.length === 0" class="px-4 py-8 text-center">
                    <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p class="text-gray-400 text-sm">{{ $t('empty') }}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reports Section -->
      <div class="mt-6 lg:mt-8">
        <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.reports }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <nuxt-link :to="localePath({ name: 'hisobot-debitor' })" class="block group">
            <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-base lg:text-lg font-bold text-gray-900 mb-1">{{ $t('home.reportD') }}</h3>
                  <p class="text-sm text-gray-500">{{ texts.viewDebitorReport }}</p>
                </div>
                <div class="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconReportD :width="32" :height="32" />
                </div>
              </div>
            </div>
          </nuxt-link>

          <nuxt-link :to="localePath({ name: 'hisobot-creditor' })" class="block group">
            <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-base lg:text-lg font-bold text-gray-900 mb-1">{{ $t('home.reportC') }}</h3>
                  <p class="text-sm text-gray-500">{{ texts.viewCreditorReport }}</p>
                </div>
                <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconReportC :width="32" :height="32" />
                </div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Icons - lightweight, keep sync
import IconPiePlaceholder from '@/components/icons/IconPiePlaceholder.vue'
import IconGiveMoney from '@/components/icons/IconGiveMoney.vue'
import IconTakeMoney from '@/components/icons/IconTakeMoney.vue'
import IconDebitor from '@/components/icons/IconDebitor.vue'
import IconCreditor from '@/components/icons/IconCreditor.vue'
import IconExpiredD from '@/components/icons/IconExpiredD.vue'
import IconExpiredC from '@/components/icons/IconExpiredC.vue'
import IconReportD from '@/components/icons/IconReportD.vue'
import IconReportC from '@/components/icons/IconReportC.vue'

// UI Components
import DaysDisplay from '@/components/ui/DaysDisplay.vue'

// Heavy components - lazy load
const NewsCard = () => import("@/components/NewsCard.vue");
const LoginCard = () => import("@/components/LoginCard.vue");
const Notification = () => import("@/components/Notification.vue");
const IdenMessage = () => import("@/components/IdenMessage.vue");
const ContractModal = () => import("../components/contractModal.vue");
const LandingPage = () => import("@/components/LandingPage.vue");

export default {
  name: 'IndexPage',
  auth: false,

  props: {
    /**
     * Parent komponentdan kelgan update funksiyalari
     * @type {Object}
     */
    forceUpdateFuncs: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    NewsCard,
    LoginCard,
    Notification,
    IdenMessage,
    ContractModal,
    LandingPage,
    IconPiePlaceholder,
    IconGiveMoney,
    IconTakeMoney,
    IconDebitor,
    IconCreditor,
    IconExpiredD,
    IconExpiredC,
    IconReportD,
    IconReportC,
    DaysDisplay
  },
  data() {
    return {
      idenNotification: false,
      contractM: false,
      socket: null,
      isChart: false,
      seriesd: [],
      seriesc: [],
      chartOptions: {
        chart: {
          type: "pie",
          width: 380,
          height: 300,
          toolbar: { show: false },
          animations: { enabled: false },
          redrawOnWindowResize: false,
          redrawOnParentResize: false,
        },
        dataLabels: { enabled: false },
        labels: [],
        legend: { position: "right", horizontalAlign: "center", offsetY: 30 },
        plotOptions: { pie: { expandOnClick: false } },
      },
      chartOptions2: {
        chart: {
          type: "pie",
          width: 380,
          height: 300,
          toolbar: { show: false },
          animations: { enabled: false },
          redrawOnWindowResize: false,
          redrawOnParentResize: false,
        },
        dataLabels: { enabled: false },
        labels: [],
        legend: { position: "right", horizontalAlign: "center", offsetY: 30 },
        plotOptions: { pie: { expandOnClick: false } },
      },
      tabLeft: 1,
      activeSlide: 0,
      chartOptionsMobileRight: null,
      chartOptions2MobileRight: null,
      _ioCharts: null,
      chartOptionsMobileRightDeb: null,
      chartOptionsMobileRightCred: null,
      tabRight: 1,
      debitorUsd: null,
      debitorUzs: null,
      creditorUsd: null,
      creditorUzs: null,
      expiredDebitorUsd: null,
      expiredDebitorUzs: null,
      expiredCreditorUsd: null,
      expiredCreditorUzs: null,
      nearCreditor: [],
      nearDebitor: [],
      debitorData: [],
      creditorData: [],
      dall: 0,
      call: 0,
      lastSigD: "",
      lastSigC: "",
      chartKeyD: 0,
      chartKeyC: 0,
    };
  },

  computed: {
    isLoggedIn() { return !!this.$auth?.loggedIn; },
    userId() { return this.$auth?.user?.id || null; },
    activeContracts() {
      return (this.seriesd[0] || 0) + (this.seriesc[0] || 0);
    },
    expiredCount() {
      let count = 0;
      if (this.expiredDebitorUzs || this.expiredDebitorUsd) count++;
      if (this.expiredCreditorUzs || this.expiredCreditorUsd) count++;
      return count;
    },
    texts() {
      const lang = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          welcome: 'Xush kelibsiz',
          welcomeDesc: 'Barcha moliyaviy shartnomalaringizni bir joydan boshqaring. Debitor va kreditor qarzlarni kuzating.',
          newContract: 'Yangi shartnoma',
          totalDebitor: 'Debitor shartnomalar',
          totalCreditor: 'Kreditor shartnomalar',
          activeContracts: 'Faol shartnomalar',
          expiredContracts: 'Muddati o\'tgan',
          financialSummary: 'Moliyaviy ko\'rsatkichlar',
          receivable: 'Olish kerak',
          payable: 'Berish kerak',
          overdue: 'Muddati o\'tgan',
          contractsOverview: 'Shartnomalar statistikasi',
          debitorContracts: 'Debitor shartnomalar holati',
          creditorContracts: 'Kreditor shartnomalar holati',
          noData: 'Ma\'lumot mavjud emas',
          upcomingPayments: 'Yaqinlashayotgan to\'lovlar',
          reports: 'Hisobotlar',
          viewDebitorReport: 'Debitor hisobotini ko\'rish',
          viewCreditorReport: 'Kreditor hisobotini ko\'rish',
          giveDesc: 'Yangi debitor shartnoma yarating',
          takeDesc: 'Yangi kreditor shartnoma yarating'
        },
        ru: {
          welcome: 'Добро пожаловать',
          welcomeDesc: 'Управляйте всеми финансовыми контрактами из одного места. Отслеживайте дебиторские и кредиторские задолженности.',
          newContract: 'Новый контракт',
          totalDebitor: 'Дебиторские контракты',
          totalCreditor: 'Кредиторские контракты',
          activeContracts: 'Активные контракты',
          expiredContracts: 'Просроченные',
          financialSummary: 'Финансовые показатели',
          receivable: 'К получению',
          payable: 'К оплате',
          overdue: 'Просрочено',
          contractsOverview: 'Статистика контрактов',
          debitorContracts: 'Статус дебиторских контрактов',
          creditorContracts: 'Статус кредиторских контрактов',
          noData: 'Нет данных',
          upcomingPayments: 'Предстоящие платежи',
          reports: 'Отчеты',
          viewDebitorReport: 'Просмотреть дебиторский отчет',
          viewCreditorReport: 'Просмотреть кредиторский отчет',
          giveDesc: 'Создать новый дебиторский контракт',
          takeDesc: 'Создать новый кредиторский контракт'
        },
        kr: {
          welcome: 'Хуш келибсиз',
          welcomeDesc: 'Барча молиявий шартномаларингизни бир жойдан бошқаринг. Дебитор ва кредитор қарзларни кузатинг.',
          newContract: 'Янги шартнома',
          totalDebitor: 'Дебитор шартномалар',
          totalCreditor: 'Кредитор шартномалар',
          activeContracts: 'Фаол шартномалар',
          expiredContracts: 'Муддати ўтган',
          financialSummary: 'Молиявий кўрсаткичлар',
          receivable: 'Олиш керак',
          payable: 'Бериш керак',
          overdue: 'Муддати ўтган',
          contractsOverview: 'Шартномалар статистикаси',
          debitorContracts: 'Дебитор шартномалар ҳолати',
          creditorContracts: 'Кредитор шартномалар ҳолати',
          noData: 'Маълумот мавжуд эмас',
          upcomingPayments: 'Яқинлашаётган тўловлар',
          reports: 'Ҳисоботлар',
          viewDebitorReport: 'Дебитор ҳисоботини кўриш',
          viewCreditorReport: 'Кредитор ҳисоботини кўриш',
          giveDesc: 'Янги дебитор шартнома яратинг',
          takeDesc: 'Янги кредитор шартнома яратинг'
        }
      };
      return t[lang] || t.uz;
    },
  },

  watch: {
    isLoggedIn(v) {
      if (v) { this.resetForNewUser(); this.safeInit(); }
      else { this.cleanupAll(); }
    },
    userId() {
      if (this.isLoggedIn) { this.resetForNewUser(); this.safeInit(); }
    },
  },

  created() {
    const t = (k) => (this.$te && this.$te(k)) ? this.$t(k) : k;

    const translatedLabels = (labels, fallback = []) => {
      const base = (labels && labels.length) ? labels : fallback;
      return base.map(l => t(l));
    };

    const makeLegendFormatter = (labelMapArr) => {
      return (seriesName, opts) => {
        const idx = opts.seriesIndex;
        const name = labelMapArr[idx] || seriesName;
        const val = opts.w?.globals?.series?.[idx];
        return `${name}: ${val != null ? val : ''}`;
      };
    };

    const makeMobileRight = (opts = {}, fallbackLabels = []) => {
      const clone = JSON.parse(JSON.stringify(opts || {}));
      const labelsT = translatedLabels(opts.labels, fallbackLabels);
      clone.labels = labelsT;

      clone.legend = Object.assign({}, clone.legend, {
        position: 'right',
        horizontalAlign: 'left',
        offsetY: -8,
        offsetX: 6,
        floating: false,
        itemMargin: { horizontal: 8, vertical: 4 },
        markers: Object.assign({}, clone?.legend?.markers, { width: 8, height: 8, radius: 12 }),
        formatter: makeLegendFormatter(labelsT),
      });

      clone.chart = Object.assign({}, clone.chart, {
        width: '100%',
        height: 240,
        offsetX: -12,
      });

      clone.plotOptions = Object.assign({}, clone.plotOptions, {
        pie: Object.assign({}, (clone.plotOptions && clone.plotOptions.pie) || {}, {
          offsetY: 6,
          expandOnClick: false,
        })
      });

      return clone;
    };

    const commonFallback = [
      this.$t("home.jarayon") || 'Jarayonda',
      this.$t('home.Completeds') || 'Tugallangan',
      this.$t('home.Rejected') || 'Rad qilingan'
    ];

    this.chartOptionsMobileRightDeb = makeMobileRight(this.chartOptions, commonFallback);
    this.chartOptionsMobileRightCred = makeMobileRight(this.chartOptions2, commonFallback);
  },

  mounted() {
    this.$nuxt.$emit("forceUpdateParent");
    if (this.isLoggedIn) this.safeInit();
    if (!process.client) return

    this.$nextTick(() => {
      const container = this.$refs.carousel
      if (!container || !(container instanceof Element)) return

      const rawSlides = [this.$refs.slide0, this.$refs.slide1]
      const slides = rawSlides.filter(el => el && el instanceof Element)
      if (!slides.length) return

      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = slides.indexOf(e.target)
            if (idx !== -1) this.activeSlide = idx
          }
        })
      }, { root: container, threshold: 0.6 })

      slides.forEach(el => io.observe(el))
      this._ioCharts = io
    })
  },

  beforeDestroy() {
    this.cleanupAll();
    if (this._ioCharts) {
      try { this._ioCharts.disconnect() } catch (e) { }
      this._ioCharts = null
    }
  },

  methods: {
    goTo(i) {
      const container = this.$refs.carousel
      const targets = [this.$refs.slide0, this.$refs.slide1].filter(el => el && el instanceof Element)
      const target = targets[i]
      if (!container || !target) return
      container.scrollTo({ left: target.offsetLeft - container.offsetLeft, behavior: 'smooth' })
      this.activeSlide = i
    },

    async safeInit() {
      try {
        await this.trySocketConnect();
        await this.loadChartData();
      } catch (e) {
        // Silent initialization error
      }
    },

    formatNum(val) {
      if (val == null) return '0'
      try {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      } catch (e) {
        return String(val)
      }
    },

    resetForNewUser() {
      this.isChart = false;
      this.seriesd = [];
      this.seriesc = [];
      this.nearCreditor = [];
      this.nearDebitor = [];
      this.debitorData = [];
      this.creditorData = [];
      this.debitorUsd = this.debitorUzs = null;
      this.creditorUsd = this.creditorUzs = null;
      this.expiredDebitorUsd = this.expiredDebitorUzs = null;
      this.expiredCreditorUsd = this.expiredCreditorUzs = null;
      this.dall = 0; this.call = 0;
      this.lastSigD = ""; this.lastSigC = "";
    },

    cleanupAll() {
      if (this.socket) {
        try { this.socket.close && this.socket.close(); } catch (_) { }
      }
      this.socket = null;
      this.isChart = false;
    },

    async trySocketConnect() {
      if (!this.isLoggedIn || !this.userId) return;
      if (this.socket) {
        try { this.socket.close && this.socket.close(); } catch (_) { }
        this.socket = null;
      }

      this.socket = this.$nuxtSocket({
        name: "home",
        channel: "/",
        secure: true,
        default: false,
        query: { uid: this.userId },
      });

      this.socket.emit("notification", { userId: this.userId }, () => { });

      if (this.$auth.user.is_active === 1 && this.$auth.user.is_contract === 0) {
        this.$router.push(this.localePath({ name: "universal_contract" }));
      }
    },

    _sig(j, t) {
      return [
        t, j.chart?.jarayon | 0, j.chart?.tugallangan | 0, j.chart?.rad | 0, j.chart?.all | 0,
        (j.five?.length || 0), (j.expired?.length || 0), (j.data?.length || 0)
      ].join("-");
    },

    async loadChartData() {
      try {
        const headers = { "Cache-Control": "no-cache" };
        const [deb, cre] = await Promise.all([
          this.$axios.$get("/home/my?type=debitor", { headers }),
          this.$axios.$get("/home/my?type=creditor", { headers }),
        ]);

        const pack = d => ({
          five: d?.data?.five || [],
          chart: {
            jarayon: d?.data?.chart?.jarayon || 0,
            tugallangan: d?.data?.chart?.tugallangan || 0,
            rad: d?.data?.chart?.rad || 0,
            all: d?.data?.chart?.all || 0,
          },
          data: d?.data?.data || [],
          expired: d?.data?.expired || [],
        });

        const debitor = pack(deb);
        const creditor = pack(cre);

        const sigD = this._sig(debitor, "d");
        const sigC = this._sig(creditor, "c");
        const sameD = sigD === this.lastSigD;
        const sameC = sigC === this.lastSigC;

        if (!sameD) {
          const sD = [debitor.chart.jarayon, debitor.chart.tugallangan, debitor.chart.rad];
          this.seriesd.splice(0, this.seriesd.length, ...sD);

          const newLabelsD = [
            `${this.$t("home.jarayon")}: ${sD[0]}`,
            `${this.$t("home.Completeds")}: ${sD[1]}`,
            `${this.$t("home.Rejected")}: ${sD[2]}`,
          ];
          if (String(this.chartOptions.labels) !== String(newLabelsD)) {
            this.chartOptions.labels = newLabelsD;
          }

          this.nearDebitor = debitor.five;
          this.dall = debitor.chart.all;
          this.debitorData = debitor.five.filter(i => i.currency === "UZS");
          this.debitorUsd = debitor.data.find(i => i.currency === "USD") || null;
          this.debitorUzs = debitor.data.find(i => i.currency === "UZS") || null;
          this.expiredDebitorUsd = debitor.expired.find(i => i.currency === "USD") || null;
          this.expiredDebitorUzs = debitor.expired.find(i => i.currency === "UZS") || null;
          this.lastSigD = sigD;
        }

        if (!sameC) {
          const sC = [creditor.chart.jarayon, creditor.chart.tugallangan, creditor.chart.rad];
          this.seriesc.splice(0, this.seriesc.length, ...sC);

          const newLabelsC = [
            `${this.$t("home.jarayon")}: ${sC[0]}`,
            `${this.$t("home.Completeds")}: ${sC[1]}`,
            `${this.$t("home.Rejected")}: ${sC[2]}`,
          ];
          if (String(this.chartOptions2.labels) !== String(newLabelsC)) {
            this.chartOptions2.labels = newLabelsC;
          }

          this.nearCreditor = creditor.five;
          this.call = creditor.chart.all;
          this.creditorData = creditor.five.filter(i => i.currency === "UZS");
          this.creditorUsd = creditor.data.find(i => i.currency === "USD") || null;
          this.creditorUzs = creditor.data.find(i => i.currency === "UZS") || null;
          this.expiredCreditorUsd = creditor.expired.find(i => i.currency === "USD") || null;
          this.expiredCreditorUzs = creditor.expired.find(i => i.currency === "UZS") || null;
          this.lastSigC = sigC;
        }

        this.isChart = true;
        this.$nextTick(() => this.refreshCharts());
      } catch (e) {
        this.$toast?.error(this.$t("debt_list.a70"));
      }
    },

    refreshCharts() {
      try {
        if (this.$refs.debitorChart) {
          this.$refs.debitorChart.updateSeries(this.seriesd, true);
          this.$refs.debitorChart.updateOptions({ labels: this.chartOptions.labels }, false, true);
        }
        if (this.$refs.creditorChart) {
          this.$refs.creditorChart.updateSeries(this.seriesc, true);
          this.$refs.creditorChart.updateOptions({ labels: this.chartOptions2.labels }, false, true);
        }
      } catch (_) { }
    },

    handleTab(side, val) {
      const cur = val === 1 ? "UZS" : "USD";
      if (side === "left") { this.debitorData = this.nearDebitor.filter(i => i.currency === cur); this.tabLeft = val; }
      else { this.creditorData = this.nearCreditor.filter(i => i.currency === cur); this.tabRight = val; }
    },

    getDays(time) {
      const restTimeMillisec = new Date(time) - Date.now();
      if (restTimeMillisec < 0) {
        return `<span class='text-red-500 font-medium'>${$nuxt.$t('a1.a56')}</span>`;
      }
      const fixedNumber = restTimeMillisec / (24 * 60 * 60 * 1000).toFixed(2);

      if (Math.ceil(fixedNumber) > 1 && Math.ceil(fixedNumber) < 4) {
        return `<span class='text-red-500 font-medium'>${Math.ceil(fixedNumber).toFixed(0)} ${$nuxt.$t('a1.a57')}</span>`;
      }
      if (Math.ceil(fixedNumber) > 3 && Math.ceil(fixedNumber) < 5) {
        return `<span class='text-orange-500 font-medium'>${Math.ceil(fixedNumber).toFixed(0)} ${$nuxt.$t('a1.a57')}</span>`;
      }
      if (Math.ceil(fixedNumber) >= 5) {
        return `<span class='text-gray-700'>${Math.ceil(fixedNumber).toFixed(0)} ${$nuxt.$t('a1.a60')}</span>`;
      }
      if (fixedNumber < 1 && fixedNumber > 0) {
        return `<span class='text-red-500 font-medium'>${$nuxt.$t('a1.a55')}</span>`;
      }
    },

    removeIdenModal() { clearTimeout(this.timeoutFunc); this.idenNotification = false; },
    removeContractModal() { this.contractM = false; if (process.client) window.location.reload(); },
    closeContractModal() { this.contractM = false; },

    giveMoney() {
      if (this.$auth.user.expiry_date && new Date(this.$auth.user.expiry_date) < new Date()) {
        return this.$toast.error(this.$t('a1.a104'))
      }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: "auth-login" }));
      if (this.$auth.user.is_active !== 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: "search-debitor" }));
    },

    takeMoney() {
      if (this.$auth.user.expiry_date && new Date(this.$auth.user.expiry_date) < new Date()) {
        return this.$toast.error(this.$t('a1.a104'))
      }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: "auth-login" }));
      if (this.$auth.user.is_active !== 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: "search-creditor" }));
    },
  },
};
</script>

<style scoped>
/* Hide scrollbar for carousel */
div[ref="carousel"]::-webkit-scrollbar {
  display: none;
}
</style>
