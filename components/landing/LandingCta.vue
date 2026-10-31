<template>
  <!-- CTA Section -->
  <section class="py-16 lg:py-20 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
        {{ texts.cta.title }}
      </h2>
      <p class="text-lg text-gray-600 mb-8">
        {{ texts.cta.description }}
      </p>
      <nuxt-link
        :to="localePath({ name: 'auth-register' })"
        class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
      >
        {{ texts.cta.button }}
        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </nuxt-link>
    </div>
  </section>
</template>

<script>
// wave D: components/LandingPage.vue dan ajratilgan bo'lim (markup baytma-bayt o'sha; matnlar `texts` prop orqali).
export default {
  name: 'LandingCta',
  props: {
    texts: { type: Object, required: true },
  },
};
</script>
