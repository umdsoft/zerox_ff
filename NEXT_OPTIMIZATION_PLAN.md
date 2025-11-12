# 🚀 NEXT OPTIMIZATION PLAN - ZeroX Frontend

**Sana:** 12-Noyabr, 2025
**Maqsad:** Keyingi sprint uchun optimizatsiya imkoniyatlari

---

## 📋 QISQACHA

Joriy sprint'da asosiy xavfsizlik, barqarorlik va kod sifati muammolari hal qilindi. Bu hisobot qolgan optimizatsiya imkoniyatlarini va keyingi bosqichda amalga oshirish kerak bo'lgan takomillashtirishlarni aks ettiradi.

---

## 🔴 YUQORI USTUVORLIK

### 1. XSS Sanitizatsiyasi (DOMPurify)

**Muammo:** `v-html` joylarida HTML sanitizatsiyasi yo'q — XSS xavfi.

**Ta'sir:**
- **Xavfsizlik:** 🔴 Yuqori
- **Qiyinchilik:** M (2-3 kun)

**Yechim:**
1. `node-sass` → `sass` ga o'tish (package.json)
2. `npm install dompurify`
3. `utils/sanitize.js` allaqachon tayyor
4. Har bir `v-html` joyida sanitize qilish:
   ```vue
   <!-- Oldin -->
   <div v-html="newsItem.description"></div>

   <!-- Keyin -->
   <div v-html="sanitizedDescription"></div>

   computed: {
     sanitizedDescription() {
       return this.$sanitizeHtml(this.newsItem.description)
     }
   }
   ```

**Fayllar:**
- `pages/news/_id.vue:12`
- `pages/index.vue:362, 399`
- `pages/search/debitor/result/index.vue:325`
- `pages/search/creditor/result/index.vue:309, 352`

**DoD:**
- DOMPurify o'rnatildi
- Barcha v-html joylar sanitize qilingan
- Security test o'tkazildi (xss-scanner)

---

### 2. Dependencies Audit va Yangilash

**Muammo:**
- `node-sass` deprecated (Node 22 bilan ishlamaydi)
- `vue-quill-editor`, `swiper@5` eski versiyalar
- Ikki xil pagination va QR paketi

**Ta'sir:**
- **Xavfsizlik:** 🟡 O'rtacha
- **Texnik qarz:** 🔴 Yuqori
- **Qiyinchilik:** L (5-7 kun)

**Yechim:**
1. `node-sass` → `sass` (`package.json`)
2. `yarn audit` bajarish va vulnerability'larni tuzatish
3. Foydalanilmagan paketlarni o'chirish:
   - `vue-ads-pagination` yoki `vue-pagination-2` (birini tanlash)
   - `v-qr` yoki `vue-qr` (birini tanlash)
4. Critical paketlarni yangilash:
   - `ws@8.13.0` → latest
   - `jsonwebtoken@8.5.1` → latest

**DoD:**
- `npm audit` 0 critical/high vulnerability
- Deprecated paketlar yo'q
- Kod ishlaydi

---

### 3. Token Refresh Flow

**Muammo:** Auth strategiyasida refresh endpoint yo'q, foydalanuvchi tez-tez login so'raladi.

**Ta'sir:**
- **UX:** 🟡 O'rtacha
- **Qiyinchilik:** M (2-3 kun)

**Yechim:**
```js
// nuxt.config.js
auth: {
  strategies: {
    local: {
      token: {
        property: 'token',
        maxAge: 1800, // 30 minut
      },
      refreshToken: {
        property: 'refresh_token',
        data: 'refresh_token',
        maxAge: 60 * 60 * 24 * 30, // 30 kun
      },
      endpoints: {
        login: { url: 'user/login', method: 'post' },
        refresh: { url: 'user/refresh', method: 'post' },
        user: { url: '/user/me', method: 'get' },
        logout: false,
      },
    },
  },
}
```

- Axios interceptor'da auto-refresh
- Queue'da kutayotgan requestlarni qayta yuborish

**DoD:**
- Token avtomatik yangilanadi
- Foydalanuvchi logout bo'lmaydi (token hali valid bo'lsa)
- E2E test

---

## 🟡 O'RTACHA USTUVORLIK

### 4. Service Layer Abstraksiyasi

**Muammo:** Axios chaqiriqlar sahifa ichida tarqalgan.

**Ta'sir:**
- **Kod sifati:** 🟢 Past
- **Qiyinchilik:** L (5-7 kun)

**Yechim:**
```js
// services/api/news.js
export default ($axios) => ({
  getAll() {
    return $axios.get('/news')
  },
  getById(id) {
    return $axios.get(`/news/${id}`)
  },
  create(data) {
    return $axios.post('/news', data)
  },
})
```

- `services/api/` papkasida har bir resource uchun service
- `plugins/services.js` orqali inject
- Sahifalarda: `this.$api.news.getAll()`

**DoD:**
- 5+ asosiy API service yaratilgan (news, contracts, users, etc.)
- Sahifalar refaktor qilingan (API chaqiriqlar service orqali)
- Unit testlar

---

### 5. Lazy Loading va Code Splitting

**Muammo:** Og'ir komponentlar (ApexCharts, Quill, PDF) global plugin sifatida yuklangan.

**Ta'sir:**
- **Bundle hajmi:** 🟡 O'rtacha (~200-300KB)
- **Qiyinchilik:** S (1-2 kun)

**Yechim:**
```vue
<template>
  <client-only>
    <apexchart v-if="isChartReady" :options="chartOptions" :series="series" />
  </client-only>
</template>

<script>
export default {
  components: {
    apexchart: () => import('vue-apexcharts'),
  },
  // ...
}
</script>
```

- ApexCharts, Quill, vue-pdf'ni sahifa darajasida dynamic import
- `nuxt.config.js`dan global plugin'larni o'chirish

**DoD:**
- Og'ir lib'lar lazy load
- Initial bundle ~100-150KB kamayishi
- Lighthouse score yaxshilanadi

---

### 6. Rasm Optimizatsiyasi

**Muammo:** `@nuxt/image` konfiguratsiyalangan, lekin ishlatilmaydi.

**Ta'sir:**
- **Performance:** 🟢 Past (rasm hajmiga bog'liq)
- **Qiyinchilik:** S (1-2 kun)

**Yechim:**
```vue
<!-- Oldin -->
<img :src="`https://app.zerox.uz${newsItem.img}`" />

<!-- Keyin -->
<nuxt-img
  :src="`https://app.zerox.uz${newsItem.img}`"
  width="600"
  height="400"
  loading="lazy"
  format="webp"
  quality="80"
/>
```

**DoD:**
- Barcha `<img>` → `<nuxt-img>`
- Responsive breakpoint'lar
- Lighthouse improvement

---

### 7. PWA Manifest va Service Worker

**Muammo:** PWA sozlamalari yo'q, offline imkoniyati yo'q.

**Ta'sir:**
- **UX:** 🟢 Past (ixtiyoriy)
- **Qiyinchilik:** M (2-3 kun)

**Yechim:**
```bash
npm install @nuxtjs/pwa
```

```js
// nuxt.config.js
modules: [
  '@nuxtjs/pwa',
],
pwa: {
  manifest: {
    name: 'ZeroX - Ishonch Kafolati',
    short_name: 'ZeroX',
    lang: 'uz',
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: '/api/.*',
        handler: 'NetworkFirst',
      },
    ],
  },
}
```

**DoD:**
- PWA install badge
- Offline page
- Lighthouse PWA score ≥80

---

## 🔵 PAST USTUVORLIK (Ixtiyoriy)

### 8. SSR Yoqish (SEO uchun)

**Muammo:** `ssr: false` — SEO va bot crawl muammolari.

**Ta'sir:**
- **SEO:** 🟢 Past (SPA ham yaxshi ishlaydi)
- **Qiyinchilik:** XL (2-3 hafta)

**Tavsiya:** Agar SEO muhim bo'lsa, SSR yoki SSG (Static Site Generation) ga o'tish.

---

### 9. Monitoring va Error Tracking

**Muammo:** Sentry/Bugsnag integratsiyasi yo'q.

**Ta'sir:**
- **Observability:** 🟢 Past
- **Qiyinchilik:** S (1 kun)

**Yechim:**
```bash
npm install @nuxtjs/sentry
```

```js
// nuxt.config.js
modules: ['@nuxtjs/sentry'],
sentry: {
  dsn: process.env.SENTRY_DSN,
  config: {},
}
```

**DoD:**
- Sentry'da production errorlar ko'rinadi
- Source map'lar private upload

---

### 10. E2E Testing (Cypress/Playwright)

**Muammo:** E2E testlar yo'q.

**Ta'sir:**
- **Sifat:** 🟢 Past
- **Qiyinchilik:** L (1 hafta)

**Yechim:**
```bash
npm install -D @nuxt/test-utils playwright
```

- Login flow E2E test
- Contract creation E2E test
- Socket notification E2E test

**DoD:**
- 5+ critical path E2E test
- CI'da run qilinadi

---

## 📊 PRIORITET JADVALI

| # | Vazifa | Ustuvorlik | Ish hajmi | Ta'sir | Sprint |
|---|--------|------------|-----------|--------|--------|
| 1 | XSS Sanitizatsiyasi | 🔴 Yuqori | M (2-3 kun) | Xavfsizlik | Sprint 2 |
| 2 | Dependencies Audit | 🔴 Yuqori | L (5-7 kun) | Texnik qarz | Sprint 2-3 |
| 3 | Token Refresh Flow | 🟡 O'rtacha | M (2-3 kun) | UX | Sprint 3 |
| 4 | Service Layer | 🟡 O'rtacha | L (5-7 kun) | Kod sifati | Sprint 3-4 |
| 5 | Lazy Loading | 🟡 O'rtacha | S (1-2 kun) | Performance | Sprint 3 |
| 6 | Rasm Optimizatsiyasi | 🟡 O'rtacha | S (1-2 kun) | Performance | Sprint 3 |
| 7 | PWA | 🔵 Past | M (2-3 kun) | UX | Sprint 4 |
| 8 | SSR | 🔵 Past | XL (2-3 hafta) | SEO | Kelajak |
| 9 | Monitoring | 🔵 Past | S (1 kun) | Observability | Sprint 4 |
| 10 | E2E Testing | 🔵 Past | L (1 hafta) | Sifat | Sprint 5 |

**Ish hajmi:**
- S (Small): 1-2 kun
- M (Medium): 2-3 kun
- L (Large): 5-7 kun
- XL (Extra Large): 2-3 hafta

---

## 🎯 TAVSIYA ETILGAN KEYINGI SPRINT

**Sprint 2 (2 hafta):**
1. ✅ XSS Sanitizatsiyasi (M)
2. ✅ Dependencies Audit va yangilash (L)
3. ✅ Token Refresh Flow (M)

**Sprint 3 (2 hafta):**
4. ✅ Lazy Loading (S)
5. ✅ Rasm Optimizatsiyasi (S)
6. ✅ Service Layer (L)

**Sprint 4 (2 hafta):**
7. ✅ PWA (M)
8. ✅ Monitoring (S)

---

## ✅ SUCCESS METRICS

| Metrika | Hozir | Maqsad (3 oydan keyin) |
|---------|-------|------------------------|
| Bundle Size (JS) | ~500KB | ~350KB (-30%) |
| Bundle Size (CSS) | ~300KB | ~150KB (-50%) |
| Lighthouse Performance | 60-70 | 85+ |
| Lighthouse Best Practices | 75 | 95+ |
| Test Coverage | 0% | 60%+ |
| npm audit high/critical | 10+ | 0 |

---

## 📝 XULOSA

Joriy sprint'da **15+ asosiy optimizatsiya** amalga oshirildi. Keyingi 2-3 oy ichida yuqoridagi rejani amalga oshirish orqali ZeroX frontend loyihasi:

✅ **Xavfsizroq** — XSS sanitizatsiyasi, deps audit
✅ **Tezroq** — Lazy load, rasm opt., service layer
✅ **Barqarorroq** — Token refresh, monitoring
✅ **Sifatliroq** — E2E testlar, PWA

**Tayyorlagan:** Senior Frontend Developer
**Tasdiqlash:** Tech Lead / Product Owner
