<template>
  <div>
    <!-- Landing Page for non-logged users -->
    <LandingPage v-if="!$auth.loggedIn" />

    <!-- Unified Analytics Dashboard -->
    <div v-else class="pb-8">
      <!-- Modals -->
      <IdenMessage v-if="idenNotification" @removeIdenModal="removeIdenModal" />
      <contractModal v-if="contractM" @removeContractModal="removeContractModal" @closeContractModal="closeContractModal" />

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
                <div class="bg-white bg-opacity-15 backdrop-blur rounded-xl px-5 py-3 text-center min-w-[90px]">
                  <p class="text-3xl lg:text-4xl font-bold" :class="healthScoreColor">
                    {{ analytics.health?.score ?? '-' }}
                  </p>
                  <p class="text-blue-200 text-xs mt-1">{{ texts.healthScore }}</p>
                </div>
                <div class="bg-white bg-opacity-15 backdrop-blur rounded-xl px-5 py-3 text-center">
                  <p class="text-lg font-semibold">{{ healthStatusText }}</p>
                  <p class="text-blue-200 text-xs mt-1">{{ texts.status }}</p>
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
        <!-- SECTION 2: Key Metrics (6 Cards) -->
        <div class="mt-6 lg:mt-8">
          <h2 class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.keyMetrics }}</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            <!-- Active Contracts -->
            <nuxt-link :to="localePath({ name: 'contract-dashboard' })" class="block group">
              <div class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border-t-4 border-blue-500 h-full text-center">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ contractActiveCount }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ texts.activeContracts }}</p>
              </div>
            </nuxt-link>

            <!-- Receivable UZS -->
            <nuxt-link :to="localePath({ name: 'contract-dashboard' })" class="block group">
              <div class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border-t-4 border-indigo-500 h-full text-center">
                <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p class="text-lg font-bold text-gray-900">{{ formatShort(debitorUzsAmount) }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ texts.receivableUzs }}</p>
              </div>
            </nuxt-link>

            <!-- Total Borrowed -->
            <nuxt-link :to="localePath({ name: 'finance-debts' })" class="block group">
              <div class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border-t-4 border-red-500 h-full text-center">
                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <p class="text-lg font-bold text-gray-900">{{ formatShort(analytics.debts?.borrowed_total) }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ texts.totalBorrowed }}</p>
              </div>
            </nuxt-link>

            <!-- Total Lent -->
            <nuxt-link :to="localePath({ name: 'finance-debts' })" class="block group">
              <div class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border-t-4 border-green-500 h-full text-center">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <p class="text-lg font-bold text-gray-900">{{ formatShort(analytics.debts?.lent_total) }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ texts.totalLent }}</p>
              </div>
            </nuxt-link>

            <!-- Monthly Expense -->
            <nuxt-link :to="localePath({ name: 'finance-expenses' })" class="block group">
              <div class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border-t-4 border-amber-500 h-full text-center">
                <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <p class="text-lg font-bold text-gray-900">{{ formatShort(analytics.finance?.monthly_expense) }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ texts.monthlyExpense }}</p>
              </div>
            </nuxt-link>

            <!-- Goals Progress -->
            <nuxt-link :to="localePath({ name: 'finance-goals' })" class="block group">
              <div class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border-t-4 border-purple-500 h-full text-center">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p class="text-2xl font-bold text-gray-900">{{ analytics.finance?.goals?.progress || 0 }}%</p>
                <p class="text-xs text-gray-500 mt-1">{{ texts.goalsProgress }}</p>
              </div>
            </nuxt-link>
          </div>
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
            <nuxt-link :to="localePath({ name: 'finance-debts' })" class="block group">
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
                <div v-if="analytics.debts?.overdue_count > 0" class="mt-3 flex items-center text-sm text-red-600">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {{ analytics.debts.overdue_count }} {{ texts.overdueDebts }}
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
                <!-- Budget progress -->
                <div v-if="analytics.finance?.budget" class="mb-3">
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-600">{{ texts.budget }}</span>
                    <span :class="analytics.finance.budget.percentage > 100 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'">
                      {{ analytics.finance.budget.percentage }}%
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="h-2 rounded-full transition-all" :class="budgetBarColor" :style="{ width: Math.min(analytics.finance.budget.percentage, 100) + '%' }"></div>
                  </div>
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

const IdenMessage = () => import(/* webpackChunkName: "iden-message", webpackPrefetch: true */ "@/components/IdenMessage.vue");
const ContractModal = () => import(/* webpackChunkName: "contract-modal", webpackPrefetch: true */ "../components/contractModal.vue");
const LandingPage = () => import(/* webpackChunkName: "landing-page", webpackPreload: true */ "@/components/LandingPage.vue");

export default {
  name: 'UnifiedDashboard',
  auth: false,

  components: {
    IdenMessage,
    ContractModal,
    LandingPage,
    IconGiveMoney,
    IconTakeMoney,
  },

  data() {
    return {
      idenNotification: false,
      contractM: false,
      loading: true,
      loadError: false,
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
      const lang = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          welcome: 'Xush kelibsiz',
          welcomeDesc: 'Barcha moliyaviy faoliyatingizni bir joydan kuzating va boshqaring.',
          healthScore: 'Moliyaviy sog\'liq',
          status: 'Holat',
          healthExcellent: 'A\'lo',
          healthGood: 'Yaxshi',
          healthFair: 'O\'rtacha',
          healthPoor: 'Yomon',
          keyMetrics: 'Asosiy ko\'rsatkichlar',
          activeContracts: 'Faol shartnomalar',
          receivableUzs: 'Olish kerak (UZS)',
          totalBorrowed: 'Jami olingan qarz',
          totalLent: 'Jami berilgan qarz',
          monthlyExpense: 'Oylik xarajat',
          goalsProgress: 'Maqsadlar',
          modulesOverview: 'Modullar',
          contractModule: 'Qarz shartnomasi',
          debtModule: 'Qarz daftari',
          financeModule: 'Shaxsiy moliya',
          debitorContracts: 'Debitor',
          creditorContracts: 'Kreditor',
          borrowed: 'Olingan',
          lent: 'Berilgan',
          overdueDebts: 'ta muddati o\'tgan',
          budget: 'Byudjet',
          expenses: 'Xarajat',
          activeGoals: 'Faol maqsad',
          alertsTitle: 'Ogohlantirishlar',
          alertCount: 'ta',
          view: 'Ko\'rish',
          quickActions: 'Tezkor amallar',
          addExpense: 'Xarajat qo\'shish',
          addDebt: 'Qarz qo\'shish',
          alert_expiring_debitor: 'Muddati oz qolgan debitor shartnomalar',
          alert_expiring_creditor: 'Muddati oz qolgan kreditor shartnomalar',
          alert_expired_debitor: 'Muddati o\'tgan debitor shartnomalar',
          alert_expired_creditor: 'Muddati o\'tgan kreditor shartnomalar',
          alert_overdue_debts: 'Muddati o\'tgan shaxsiy qarzlar',
          alert_budget_exceeded: 'Oylik byudjet oshib ketdi!',
          alert_budget_warning: 'Byudjet chegarasiga yaqinlashmoqda',
          alert_upcoming_payments: 'Yaqinlashayotgan qarz to\'lovlari',
          loadErrorMsg: 'Ma\'lumotlarni yuklashda xatolik yuz berdi',
          retry: 'Qayta urinish',
        },
        ru: {
          welcome: 'Добро пожаловать',
          welcomeDesc: 'Отслеживайте и управляйте всей финансовой деятельностью из одного места.',
          healthScore: 'Финансовое здоровье',
          status: 'Статус',
          healthExcellent: 'Отлично',
          healthGood: 'Хорошо',
          healthFair: 'Средне',
          healthPoor: 'Плохо',
          keyMetrics: 'Ключевые показатели',
          activeContracts: 'Активные контракты',
          receivableUzs: 'К получению (UZS)',
          totalBorrowed: 'Всего долгов',
          totalLent: 'Всего выдано',
          monthlyExpense: 'Расходы за месяц',
          goalsProgress: 'Цели',
          modulesOverview: 'Модули',
          contractModule: 'Договоры займа',
          debtModule: 'Книга долгов',
          financeModule: 'Личные финансы',
          debitorContracts: 'Дебиторские',
          creditorContracts: 'Кредиторские',
          borrowed: 'Взято',
          lent: 'Выдано',
          overdueDebts: 'просроченных',
          budget: 'Бюджет',
          expenses: 'Расходы',
          activeGoals: 'Активных целей',
          alertsTitle: 'Уведомления',
          alertCount: '',
          view: 'Просмотр',
          quickActions: 'Быстрые действия',
          addExpense: 'Добавить расход',
          addDebt: 'Добавить долг',
          alert_expiring_debitor: 'Истекающие дебиторские контракты',
          alert_expiring_creditor: 'Истекающие кредиторские контракты',
          alert_expired_debitor: 'Просроченные дебиторские контракты',
          alert_expired_creditor: 'Просроченные кредиторские контракты',
          alert_overdue_debts: 'Просроченные личные долги',
          alert_budget_exceeded: 'Месячный бюджет превышен!',
          alert_budget_warning: 'Бюджет приближается к лимиту',
          alert_upcoming_payments: 'Предстоящие платежи по долгам',
          loadErrorMsg: 'Ошибка загрузки данных',
          retry: 'Повторить',
        },
        kr: {
          welcome: 'Хуш келибсиз',
          welcomeDesc: 'Барча молиявий фаолиятингизни бир жойдан кузатинг ва бошқаринг.',
          healthScore: 'Молиявий соғлиқ',
          status: 'Ҳолат',
          healthExcellent: 'Аъло',
          healthGood: 'Яхши',
          healthFair: 'Ўртача',
          healthPoor: 'Ёмон',
          keyMetrics: 'Асосий кўрсаткичлар',
          activeContracts: 'Фаол шартномалар',
          receivableUzs: 'Олиш керак (UZS)',
          totalBorrowed: 'Жами олинган қарз',
          totalLent: 'Жами берилган қарз',
          monthlyExpense: 'Ойлик харажат',
          goalsProgress: 'Мақсадлар',
          modulesOverview: 'Модуллар',
          contractModule: 'Қарз шартномаси',
          debtModule: 'Қарз дафтари',
          financeModule: 'Шахсий молия',
          debitorContracts: 'Дебитор',
          creditorContracts: 'Кредитор',
          borrowed: 'Олинган',
          lent: 'Берилган',
          overdueDebts: 'та муддати ўтган',
          budget: 'Бюджет',
          expenses: 'Харажат',
          activeGoals: 'Фаол мақсад',
          alertsTitle: 'Огоҳлантиришлар',
          alertCount: 'та',
          view: 'Кўриш',
          quickActions: 'Тезкор амаллар',
          addExpense: 'Харажат қўшиш',
          addDebt: 'Қарз қўшиш',
          alert_expiring_debitor: 'Муддати оз қолган дебитор шартномалар',
          alert_expiring_creditor: 'Муддати оз қолган кредитор шартномалар',
          alert_expired_debitor: 'Муддати ўтган дебитор шартномалар',
          alert_expired_creditor: 'Муддати ўтган кредитор шартномалар',
          alert_overdue_debts: 'Муддати ўтган шахсий қарзлар',
          alert_budget_exceeded: 'Ойлик бюджет ошиб кетди!',
          alert_budget_warning: 'Бюджет чегарасига яқинлашмоқда',
          alert_upcoming_payments: 'Яқинлашаётган қарз тўловлари',
          loadErrorMsg: 'Маълумотларни юклашда хатолик юз берди',
          retry: 'Қайта уриниш',
        }
      };
      return t[lang] || t.uz;
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
    if (this.isLoggedIn) this.loadAnalytics();
  },

  methods: {
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

    giveMoney() {
      if (this.$auth.user.expiry_date && new Date(this.$auth.user.expiry_date) < new Date()) {
        return this.$toast.error(this.$t('a1.a104'));
      }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: 'auth-login' }));
      if (this.$auth.user.is_active !== 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: 'search', query: { type: 'debitor' } }));
    },

    takeMoney() {
      if (this.$auth.user.expiry_date && new Date(this.$auth.user.expiry_date) < new Date()) {
        return this.$toast.error(this.$t('a1.a104'));
      }
      if (!this.isLoggedIn) return this.$router.push(this.localePath({ name: 'auth-login' }));
      if (this.$auth.user.is_active !== 1) return (this.idenNotification = true);
      if (!this.$auth.user.is_contract) return (this.contractM = true);
      this.$router.push(this.localePath({ name: 'search', query: { type: 'creditor' } }));
    },
  },
};
</script>
