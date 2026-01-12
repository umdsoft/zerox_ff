/**
 * Swiper Plugin - Lazy Load
 * Carousel kutubxonasini faqat kerak bo'lganda yuklash
 */
import Vue from 'vue'

// Swiper komponentlarini lazy load qilish
const loadSwiper = () => import('vue-awesome-swiper').then(m => m.default || m)

const Swiper = () => ({
  component: loadSwiper().then(VueAwesomeSwiper => {
    return VueAwesomeSwiper.swiper || VueAwesomeSwiper.Swiper
  }),
  loading: {
    template: '<div class="animate-pulse bg-gray-200 h-48 rounded"></div>',
  },
  delay: 0,
})

const SwiperSlide = () => ({
  component: loadSwiper().then(VueAwesomeSwiper => {
    return VueAwesomeSwiper.swiperSlide || VueAwesomeSwiper.SwiperSlide
  }),
  delay: 0,
})

// Global komponentlar
Vue.component('swiper', Swiper)
Vue.component('swiper-slide', SwiperSlide)
