<template>
  <!-- How It Works Section -->
  <section id="how-it-works" class="py-16 lg:py-24 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {{ texts.howItWorks.title }}
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ texts.howItWorks.description }}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Step 1 -->
        <div class="relative text-center">
          <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.howItWorks.steps[0].title }}</h3>
          <p class="text-gray-600">{{ texts.howItWorks.steps[0].desc }}</p>
        </div>

        <!-- Step 2 -->
        <div class="relative text-center">
          <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.howItWorks.steps[1].title }}</h3>
          <p class="text-gray-600">{{ texts.howItWorks.steps[1].desc }}</p>
        </div>

        <!-- Step 3 -->
        <div class="relative text-center">
          <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.howItWorks.steps[2].title }}</h3>
          <p class="text-gray-600">{{ texts.howItWorks.steps[2].desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// wave D: components/LandingPage.vue dan ajratilgan bo'lim (markup baytma-bayt o'sha; matnlar `texts` prop orqali).
export default {
  name: 'LandingHowItWorks',
  props: {
    texts: { type: Object, required: true },
  },
};
</script>
