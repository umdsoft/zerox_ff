<template>
  <!-- Features Section -->
  <section id="features" class="py-16 lg:py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {{ texts.features.title }}
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {{ texts.features.description }}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[0].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[0].desc }}</p>
        </div>

        <!-- Feature 2 -->
        <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[1].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[1].desc }}</p>
        </div>

        <!-- Feature 3 -->
        <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[2].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[2].desc }}</p>
        </div>

        <!-- Feature 4 -->
        <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[3].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[3].desc }}</p>
        </div>

        <!-- Feature 5 -->
        <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[4].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[4].desc }}</p>
        </div>

        <!-- Feature 6 -->
        <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[5].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[5].desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// wave D: components/LandingPage.vue dan ajratilgan bo'lim (markup baytma-bayt o'sha; matnlar `texts` prop orqali).
export default {
  name: 'LandingFeatures',
  props: {
    texts: { type: Object, required: true },
  },
};
</script>
