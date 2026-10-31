<template>
  <!-- Right Panel - Testimonials Slider -->
  <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 items-center justify-center relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
      <div class="absolute bottom-20 right-20 w-48 h-48 border-2 border-white rounded-full"></div>
      <div class="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-white rounded-full"></div>
    </div>

    <div class="max-w-lg text-white text-center relative z-10">
      <!-- Title -->
      <h2 class="text-3xl font-bold mb-4">{{ texts.panel.title }}</h2>
      <p class="text-blue-100 text-lg mb-10">{{ texts.panel.subtitle }}</p>

      <!-- Testimonials Slider -->
      <div class="relative">
        <div class="testimonial-card bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <div class="flex items-center justify-center mb-4">
            <div class="flex -space-x-1">
              <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <p class="text-white text-lg italic mb-6">"{{ currentTestimonial.text }}"</p>
          <div class="flex items-center justify-center">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg" style="background-color: rgba(255,255,255,0.9)">
              {{ currentTestimonial.initials }}
            </div>
            <div class="ml-4 text-left">
              <p class="font-semibold">{{ currentTestimonial.name }}</p>
            </div>
          </div>
        </div>

        <!-- Slider Dots -->
        <div class="flex items-center justify-center space-x-2">
          <button
            v-for="(_, index) in testimonials"
            :key="index"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="currentSlide === index ? 'bg-white w-6' : 'bg-white bg-opacity-40'"
            @click="currentSlide = index"
          ></button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white border-opacity-20">
        <div class="text-center">
          <p class="text-3xl font-bold">1K+</p>
          <p class="text-blue-200 text-sm">{{ texts.panel.stats.users }}</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold">200+</p>
          <p class="text-blue-200 text-sm">{{ texts.panel.stats.contracts }}</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold">100%</p>
          <p class="text-blue-200 text-sm">{{ texts.panel.stats.satisfaction }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// wave D: pages/auth/login.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'LoginTestimonialsPanel',
  props: {
    texts: { type: null, default: undefined },
    currentTestimonial: { type: null, default: undefined },
    testimonials: { type: null, default: undefined },
    currentSlideValue: { type: null, default: undefined },
  },
  computed: {
    currentSlide: {
      get() { return this.currentSlideValue; },
      set(v) { this.$emit('update:currentSlideValue', v); },
    },
  },
};
</script>

<style lang="scss" scoped src="../../assets/page-styles/login.scss"></style>
