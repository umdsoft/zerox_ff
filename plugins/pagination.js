import Vue from "vue";

// SS-PERF (2026-09-25): vue-ads-pagination (~130 KB) faqat bitta sahifada ishlatiladi —
// async global komponent: chunk faqat <pagination> render bo'lganda yuklanadi.
Vue.component("pagination", () => import("vue-ads-pagination").then((m) => m.default || m));
