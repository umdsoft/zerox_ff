<template>
  <!-- Hero Section -->
  <section class="pt-24 lg:pt-32 pb-16 lg:pb-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="text-center lg:text-left">
          <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {{ texts.hero.title }}
            <span class="text-blue-600">{{ texts.hero.titleHighlight }}</span>
          </h1>

          <p class="text-lg lg:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
            {{ texts.hero.description }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <nuxt-link
              :to="localePath({ name: 'auth-register' })"
              class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              {{ texts.hero.getStarted }}
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </nuxt-link>
            <!-- SS20 (2026-09-21): ikkinchi tugma endi 4 modul bo'limiga olib boradi -->
            <a
              href="#modules"
              class="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-colors"
            >
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              {{ texts.hero.watchDemo }}
            </a>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
            <div class="text-center lg:text-left">
              <div class="text-2xl lg:text-3xl font-bold text-gray-900">1K+</div>
              <div class="text-sm text-gray-500">{{ texts.stats.users }}</div>
            </div>
            <div class="text-center lg:text-left">
              <div class="text-2xl lg:text-3xl font-bold text-gray-900">200+</div>
              <div class="text-sm text-gray-500">{{ texts.stats.contracts }}</div>
            </div>
            <div class="text-center lg:text-left">
              <div class="text-2xl lg:text-3xl font-bold text-gray-900">100%</div>
              <div class="text-sm text-gray-500">{{ texts.stats.satisfaction }}</div>
            </div>
          </div>
        </div>

        <!-- Hero Image
             29.09 (doc1 27-rasm): karta ilgari FAQAT "Berilgan/Olingan qarz"ni ko'rsatardi — endi butun
             platformani aks ettiradi: umumiy balans + Qarz shartnomasi (berilgan/olingan) + Qarz daftari
             (nasiya savdo, undirish foizi) + Shaxsiy moliya (daromad/xarajat, budjet foizi) va ikki
             "suzuvchi" bildirishnoma (qarz qaytarildi; Shaxsiy qarz eslatmasi). Raqamlar namunaviy.
             Tailwind 2.2 (JIT o'chiq): shaffof ranglar inline style orqali. -->
        <div class="relative">
          <div class="relative z-10">
            <!-- Dashboard illustration -->
            <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 lg:p-8 pb-10 lg:pb-12 text-white shadow-2xl">
              <div class="flex items-center justify-between gap-4 mb-5">
                <div class="flex items-center gap-4 min-w-0">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style="background-color: rgba(255,255,255,0.2)">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm" style="color: rgba(191, 219, 254, 1)">{{ texts.dashboard.totalDebt }}</div>
                    <div class="text-2xl font-bold whitespace-nowrap">4 770 000 UZS</div>
                  </div>
                </div>
                <span class="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0" style="background-color: rgba(52, 211, 153, 0.2); color: #A7F3D0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                  {{ texts.dashboard.thisMonth }}
                </span>
              </div>

              <!-- Qarz shartnomasi: berilgan / olingan -->
              <div class="text-xs font-semibold uppercase tracking-wide mb-2" style="color: rgba(191, 219, 254, 0.9)">{{ texts.modules.items[0].name }}</div>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <div class="p-3.5 rounded-xl" style="background-color: rgba(255,255,255,0.1)">
                  <div class="flex items-center gap-1.5 text-sm" style="color: rgba(219, 234, 254, 1)">
                    <span class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style="background-color: rgba(52, 211, 153, 0.25); color: #6EE7B7">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                    </span>
                    <span class="truncate">{{ texts.dashboard.debitor }}</span>
                  </div>
                  <div class="font-semibold mt-1 whitespace-nowrap">25 000 000 UZS</div>
                </div>
                <div class="p-3.5 rounded-xl" style="background-color: rgba(255,255,255,0.1)">
                  <div class="flex items-center gap-1.5 text-sm" style="color: rgba(219, 234, 254, 1)">
                    <span class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style="background-color: rgba(251, 191, 36, 0.25); color: #FCD34D">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                    </span>
                    <span class="truncate">{{ texts.dashboard.creditor }}</span>
                  </div>
                  <div class="font-semibold mt-1 whitespace-nowrap">20 230 000 UZS</div>
                </div>
              </div>

              <!-- Qarz daftari + Shaxsiy moliya -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-4 rounded-xl" style="background-color: rgba(255,255,255,0.12)">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: rgba(196, 181, 253, 0.25); color: #DDD6FE">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                    </span>
                    <span class="text-sm font-semibold truncate">{{ texts.modules.items[1].name }}</span>
                  </div>
                  <div class="text-xs truncate" style="color: rgba(191, 219, 254, 1)">{{ texts.dashboard.creditSales }} · 12 {{ texts.dashboard.customers }}</div>
                  <div class="font-semibold whitespace-nowrap">8 450 000 UZS</div>
                  <div class="flex items-center justify-between text-xs mt-2 mb-1" style="color: rgba(191, 219, 254, 1)">
                    <span>{{ texts.dashboard.collected }}</span><span class="font-semibold text-white">68%</span>
                  </div>
                  <div class="h-1.5 rounded-full overflow-hidden" style="background-color: rgba(255,255,255,0.2)">
                    <div class="h-1.5 rounded-full" style="width: 68%; background-color: #C4B5FD"></div>
                  </div>
                </div>
                <div class="p-4 rounded-xl" style="background-color: rgba(255,255,255,0.12)">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: rgba(110, 231, 183, 0.25); color: #A7F3D0">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </span>
                    <span class="text-sm font-semibold truncate">{{ texts.modules.items[3].name }}</span>
                  </div>
                  <div class="flex items-center justify-between gap-2 text-xs" style="color: rgba(191, 219, 254, 1)">
                    <span>{{ texts.dashboard.income }}</span><span class="font-semibold whitespace-nowrap" style="color: #6EE7B7">+6 800 000</span>
                  </div>
                  <div class="flex items-center justify-between gap-2 text-xs mt-1" style="color: rgba(191, 219, 254, 1)">
                    <span>{{ texts.dashboard.expense }}</span><span class="font-semibold whitespace-nowrap" style="color: #FCA5A5">−3 150 000</span>
                  </div>
                  <div class="flex items-center justify-between text-xs mt-2 mb-1" style="color: rgba(191, 219, 254, 1)">
                    <span>{{ texts.dashboard.budget }}</span><span class="font-semibold text-white">46%</span>
                  </div>
                  <div class="h-1.5 rounded-full overflow-hidden" style="background-color: rgba(255,255,255,0.2)">
                    <div class="h-1.5 rounded-full" style="width: 46%; background-color: #6EE7B7"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Suzuvchi bildirishnomalar (faqat sm+; mobilda karta ustiga chiqmasin) -->
            <div class="hidden sm:flex absolute items-center gap-3 bg-white rounded-xl shadow-xl px-4 py-3" style="top: -22px; right: 20px;">
              <span class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style="background-color: #D1FAE5; color: #059669">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              </span>
              <div>
                <div class="text-xs text-gray-500">{{ texts.dashboard.repaid }}</div>
                <div class="text-sm font-bold text-gray-900 whitespace-nowrap">+1 200 000 UZS</div>
              </div>
            </div>
            <div class="hidden sm:flex absolute items-center gap-3 bg-white rounded-xl shadow-xl px-4 py-3" style="bottom: -24px; left: 20px;">
              <span class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style="background-color: #FEF3C7; color: #D97706">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              </span>
              <div>
                <div class="text-xs text-gray-500">{{ texts.modules.items[2].name }}</div>
                <div class="text-sm font-bold text-gray-900 whitespace-nowrap">{{ texts.dashboard.reminder }}</div>
              </div>
            </div>
          </div>
          <!-- Decorative elements -->
          <div class="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full blur-2xl" style="opacity: 0.5"></div>
          <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-300 rounded-full blur-2xl" style="opacity: 0.4"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// wave D: components/LandingPage.vue dan ajratilgan bo'lim (markup baytma-bayt o'sha; matnlar `texts` prop orqali).
export default {
  name: 'LandingHero',
  props: {
    texts: { type: Object, required: true },
  },
};
</script>
