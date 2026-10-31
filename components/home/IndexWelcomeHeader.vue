<template>
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
              {{ texts.welcome }}, {{ $auth.user ? $fio($auth.user.first_name) : '' }}!
            </h1>
            <p class="text-blue-100 text-sm lg:text-base max-w-xl">
              {{ texts.welcomeDesc }}
            </p>
          </div>
          <!-- Health Score — 21.10: bosilganda "Moliyaviy sog'liq" sahifasi (ball nima uchun shunday) -->
          <nuxt-link
            :to="localePath({ name: 'financial-health' })"
            class="health-tile-link mt-4 lg:mt-0 flex items-center gap-4 rounded-xl"
            :title="$t('fin_health.details')"
          >
            <div class="bg-white bg-opacity-20 backdrop-blur rounded-xl px-5 py-3 text-center flex-1">
              <p class="text-3xl lg:text-4xl font-bold text-white">
                {{ analytics.health?.score ?? '-' }}
              </p>
              <p class="text-blue-100 text-xs mt-1">{{ texts.healthScore }}</p>
            </div>
            <div class="bg-white bg-opacity-20 backdrop-blur rounded-xl px-5 py-3 text-center">
              <p class="text-lg font-semibold text-white">{{ healthStatusText }}</p>
              <p class="text-blue-100 text-xs mt-1">{{ texts.status }}</p>
            </div>
            <svg class="w-5 h-5 text-blue-100 flex-shrink-0 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
// wave D: pages/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'IndexWelcomeHeader',
  props: {
    texts: { type: null, default: undefined },
    analytics: { type: null, default: undefined },
    healthStatusText: { type: null, default: undefined },
  },
};
</script>

<style scoped src="../../assets/page-styles/index/IndexWelcomeHeader.css"></style>
