<template>
  <!-- SS20 (2026-09-21): YANGI "4 ta modul" bo'limi.
       Sabab: landing oldin FAQAT qarz shartnomasi haqida edi, endi qarz daftari,
       shaxsiy qarz va shaxsiy moliya ham ishga tushdi — to'rttasi TENG ko'rsatiladi.
       Ranglar tailwind.config.js da MAVJUD: blue/purple/green — Tailwind v2 default,
       amber — config'da twColors.amber orqali qo'shilgan (shaffof bo'lib qolmaydi). -->
  <section id="modules" class="py-16 lg:py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {{ texts.modules.title }}
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ texts.modules.description }}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Modul 1: Qarz shartnomasi — KO'K -->
        <nuxt-link
          :to="localePath({ name: 'auth-register' })"
          class="flex flex-col h-full p-6 bg-white rounded-2xl shadow-md border-t-4 border-blue-500 hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ texts.modules.items[0].name }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ texts.modules.items[0].desc }}</p>
          <ul class="space-y-2 mb-5">
            <li v-for="(f, fi) in texts.modules.items[0].features" :key="fi" class="flex items-start gap-2 text-sm text-gray-700">
              <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ f }}</span>
            </li>
          </ul>
          <span class="mt-auto inline-flex items-center text-sm font-semibold text-blue-600">
            {{ texts.modules.cta }}
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </nuxt-link>

        <!-- Modul 2: Qarz daftari — BINAFSHA (purple) -->
        <nuxt-link
          :to="localePath({ name: 'auth-register' })"
          class="flex flex-col h-full p-6 bg-white rounded-2xl shadow-md border-t-4 border-purple-500 hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ texts.modules.items[1].name }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ texts.modules.items[1].desc }}</p>
          <ul class="space-y-2 mb-5">
            <li v-for="(f, fi) in texts.modules.items[1].features" :key="fi" class="flex items-start gap-2 text-sm text-gray-700">
              <svg class="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ f }}</span>
            </li>
          </ul>
          <span class="mt-auto inline-flex items-center text-sm font-semibold text-purple-600">
            {{ texts.modules.cta }}
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </nuxt-link>

        <!-- Modul 3: Shaxsiy qarz — AMBER (tailwind.config.js da qo'shilgan) -->
        <nuxt-link
          :to="localePath({ name: 'auth-register' })"
          class="flex flex-col h-full p-6 bg-white rounded-2xl shadow-md border-t-4 border-amber-500 hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div class="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ texts.modules.items[2].name }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ texts.modules.items[2].desc }}</p>
          <ul class="space-y-2 mb-5">
            <li v-for="(f, fi) in texts.modules.items[2].features" :key="fi" class="flex items-start gap-2 text-sm text-gray-700">
              <svg class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ f }}</span>
            </li>
          </ul>
          <span class="mt-auto inline-flex items-center text-sm font-semibold text-amber-600">
            {{ texts.modules.cta }}
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </nuxt-link>

        <!-- Modul 4: Shaxsiy moliya — YASHIL -->
        <nuxt-link
          :to="localePath({ name: 'auth-register' })"
          class="flex flex-col h-full p-6 bg-white rounded-2xl shadow-md border-t-4 border-green-500 hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ texts.modules.items[3].name }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ texts.modules.items[3].desc }}</p>
          <ul class="space-y-2 mb-5">
            <li v-for="(f, fi) in texts.modules.items[3].features" :key="fi" class="flex items-start gap-2 text-sm text-gray-700">
              <svg class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ f }}</span>
            </li>
          </ul>
          <span class="mt-auto inline-flex items-center text-sm font-semibold text-green-600">
            {{ texts.modules.cta }}
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
// wave D: components/LandingPage.vue dan ajratilgan bo'lim (markup baytma-bayt o'sha; matnlar `texts` prop orqali).
export default {
  name: 'LandingModules',
  props: {
    texts: { type: Object, required: true },
  },
};
</script>
