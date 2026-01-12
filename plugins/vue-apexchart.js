/**
 * ApexCharts Plugin - Lazy Load
 * ~450KB kutubxonani faqat kerak bo'lganda yuklash
 */
import Vue from 'vue'

// Async component - faqat ishlatilganda yuklanadi
const VueApexCharts = () => import('vue-apexcharts').then(m => m.default || m)

// Global komponent sifatida ro'yxatdan o'tkazish
Vue.component('apexchart', VueApexCharts)
