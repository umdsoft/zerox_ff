/**
 * HTML2PDF Plugin - Lazy Load
 * PDF generatsiya kutubxonasini faqat kerak bo'lganda yuklash
 */
import Vue from 'vue'

// Lazy load component
const VueHtml2pdf = () => ({
  component: import('vue-html2pdf').then(m => m.default || m),
  loading: {
    template: '<div class="animate-pulse bg-gray-200 h-20 rounded"></div>',
  },
  delay: 0,
  timeout: 30000,
})

// Global komponent
Vue.component('vue-html2pdf', VueHtml2pdf)
