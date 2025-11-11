# 1) Qisqa xulosa
- Loyiha SPA rejimida ishlaydi (`ssr: false`) va universal imkoniyatlardan voz kechilgan, bu SEO va dastlabki yuklanish tezligiga jiddiy salbiy ta’sir qiladi (`nuxt.config.js` ~4-120-qatorlar).
- `nuxt.config.js` faylida `router` konfiguratsiyasi ikki marta e’lon qilingan, oxirgisi birinchisini to‘liq ustiga yozib yuboradi; natijada middleware massivi umuman ishlamaydi (`nuxt.config.js` ~60-120-qatorlar).
- Vuex do‘koni nomlar bo‘yicha modullashtirilmagan va ba’zi mutatsiyalarda xatoliklar bor (`store/index.js` ~1-60-qatorlar), bu reaktivlik va qo‘llab-quvvatlashni xavf ostiga qo‘yadi.
- API bazaviy URL manzili va kross-domen headerlari build ichida qat’iy yozilgan (`nuxt.config.js` ~190-210-qatorlar), runtime konfiguratsiya va xavfsizlik nazoratini yo‘qqa chiqaradi.
- Sahifalarning ko‘pida `v-html` sanitizatsiyasiz ishlatilgan (`pages/news/_id.vue` ~1-80-qatorlar, `pages/index.vue` ~340-420-qatorlar), XSS xatarini keltirib chiqaradi.
- Tailwind purge ro‘yxati bo‘sh (`tailwind.config.js` ~1-28-qatorlar), shuning uchun ishlab chiqarish bundle’iga katta, tozalanmagan CSS yuklanmoqda.
- Testlar, linting va CI/CD pipeline’lari mavjud emas, `package.json` skriptlari minimal (`package.json` ~5-40-qatorlar) — sifat nazorati yo‘q.
- Socket va tilga oid mijoz plaginlari localStorage va global obyektlardan himoyasiz foydalanadi, qayta ulanish va event boshqaruvi bilan bog‘liq texnik qarzlar mavjud (`plugins/router-client.js` ~1-40-qatorlar, `plugins/socket.client.js` ~1-120-qatorlar).
- I18n uchun bir nechta maxsus plaginlar qo‘shilgan, lekin `@nuxtjs/i18n` modulining standart imkoniyatlari takrorlanib, murakkablik oshirilgan (`nuxt.config.js` ~120-170-qatorlar va `plugins/i18n*.js`).
- Global dizayn va UX bo‘yicha skeleton, xatolik komponentlari va loading indikatorlari bir xil emas; Vuex orqali umumiy loading flag ishlatilishi, ammo komponentlarda to‘liq qo‘llanilmagan (`plugins/axios.js` ~1-40-qatorlar, `pages/` ichidagi sahifalar).

**Umumiy baho: C**

# 2) Audit doirasi va taxminlar
- Quyidagi katalog va fayllar ko‘rib chiqildi: `nuxt.config.js`, `package.json`, `yarn.lock`, `pages/` bo‘limining asosiy sahifalari, `components/` katalogidagi asosiy UI bloklar, `store/`, `plugins/`, `middleware/`, `lang/`, `assets/`, `styles/`, `services/`, `static/`, `tailwind.config.js`, `.editorconfig`.
- CI/CD yoki test fayllari topilmadi; mavjud emas deb qabul qilindi.
- Backend API va autentifikatsiya mantiqi tashqi servisga bog‘liq deb taxmin qilindi; audit faqat frontend kodida ko‘rinadigan konfiguratsiya va mantiqni qamrab oldi.

# 3) Arxitektura (Nuxt 2 ga xos)
- Rejim: `ssr: false` va `target: "static"`; loyiha to‘liq SPA sifatida build qilinadi. SEO, dastlabki render tezligi va ochiq API kontentini indeksatsiya qilish imkoniyati yo‘q (`nuxt.config.js` ~30-120-qatorlar).
- Papka arxitekturasi: `pages/` ichida ko‘plab yirik sahifa komponentlari mavjud, lekin ularni kichikroq bo‘laklarga ajratish yetarli emas. Ayrim sahifalar 400+ qatorli “god component” ko‘rinishida (`pages/index.vue` ~1-460-qatorlar).
- `layouts/` va `components/` o‘rtasida qatlamlar aniq ajratilmagan; masalan, layout ichidagi header/sidebar komponentlari ichki holatni Vuex o‘rniga lokal ravishda boshqaradi, takrorlangan kodlar bor.
- `store/` global `index.js` va `notification.js` modulidan iborat. Strict rejim faqat dev muhitida yoqilmagan (`store/index.js` bosh qismi). Mutatsiyalar bilan amallar chalkash (async mutatsiyalar, notog‘ri parametr nomlari) SOLID/DRY tamoyillariga zid.
- `plugins/` katalogida ko‘plab global prototip va direktivalar mavjud, lekin ko‘pida TypeScript yoki Composition API ishlatilmaydi. Shu sababli mixins/legacy uslublar saqlanib qolgan; kompozitsiya API’ga o‘tish imkoniyati ko‘rib chiqilmagan.
- Tavsiya: routing asosidagi sahifalarni domain bo‘yicha kichikroq modul komponentlarga ajratish, Vuex modul strukturasi (namespaced) va service qatlamiga (axios encapsulation) o‘tish, mixin/directiva o‘rniga Composition API yoki helper funksiyalarni ishlatish.

# 4) nuxt.config.js sifati
- `head` blokida minimal meta bor, lekin `og:*` va `twitter:*` teglar, `canonical` link, `robots` boshqaruvi yo‘q (`nuxt.config.js` ~4-40-qatorlar). GTag scripti qo‘shilgan, ammo `gtag('config', ...)` chaqiruvi plugin orqali bajarilmagan.
- `ssr: false` va `target: "static"` (SPA); modern rejim o‘chirib qo‘yilgan. Universal rejimga o‘tish yoki hech bo‘lmasa `modern: true` qo‘shish tavsiya etiladi.
- `router` konfiguratsiyasi ikki marta e’lon qilingan (`nuxt.config.js` ~60-110 va ~120-170-qatorlar). Ikkinchi deklaratsiya birinchisini bekor qiladi; middleware massivlari ishlamaydi, custom `linkActiveClass` qiymatlari ham yo‘qoladi.
- `plugins` ro‘yxati juda katta, lekin `mode` bayroqlari chalkash: i18n uchun qo‘shimcha plaginlar modul bilan ziddiyatli ishlashi mumkin (`nuxt.config.js` ~40-100-qatorlar).
- `publicRuntimeConfig` va `privateRuntimeConfig` bo‘limlari yo‘q; API URL va monitoring identifikatorlari kodga qat’iy yozilgan (`nuxt.config.js` ~180-210-qatorlar). Bu CI/CD va ko‘p muhitli deployni qiyinlashtiradi.
- `build` konfiguratsiyasi bo‘sh (`nuxt.config.js` oxiri). `extractCSS`, `optimizeCSS`, `babel.presets` kabi parametrlar sozlanmagan.
- Tavsiya: router konfiguratsiyasini yagona blokda to‘plash, runtimeConfig joriy qilish, meta ma’lumotlarni to‘liqroq to‘ldirish, `loading` komponentini qayta faollashtirish, modern build va kod splitting strategiyalarini sozlash.

# 5) Vuex (store) va holat boshqaruvi
- Do‘kon `index.js` ichida global state va mutatsiyalar to‘plami sifatida tashkil qilingan; `notification.js` modulida `namespaced = true` ko‘rsatilgan bo‘lsa-da, import mexanizmi noto‘g‘ri (fayl tashqi obyekt sifatida e’lon qilingan, ammo `store/index.js` da modules sifatida ulash ko‘rinmaydi).
- Mutatsiyalarda nomlash muammosi bor: `socket` mutatsiyasi `socketInstance` parametrini qabul qiladi, lekin `state.socket = socket` deb noto‘g‘ri o‘zgaruvchi ishlatilgan (`store/index.js` ~20-35-qatorlar) — bu runtime xatosi.
- Strict rejim (`strict: process.env.NODE_ENV !== 'production'`) yoqilmagan; dev muhitida mutatsiya intizomi nazorat qilinmaydi.
- Asinxron ishlar mutatsiyalarga qo‘yilgan (`HIDE_CONTRACT_MODAL` kabi mutatsiyalar asinxron tasvirlangan, lekin actionlar bilan ajratilmagan).
- Tavsiya: Vuex modules (auth, notifications, UI va hokazo) namespaced ko‘rinishga ajratish, strict rejimini faollashtirish, services qatlamidan foydalangan holda actionlarda API chaqiriqlarini boshqarish, TypeScript yoki vuex-module-decoratorsdan foydalanish imkoniyatini ko‘rib chiqish.

# 6) Sahifa/Komponentlar sifati
- `pages/index.vue` va boshqa sahifalarda `asyncData`/`fetch` o‘rniga `mounted` ichida API chaqiriqlari ishlatiladi, bu SSR bo‘lganda ishlamas edi; hozir SPA bo‘lgani uchun ishlaydi, lekin SEO va prefetch yo‘q (`pages/index.vue` ~160-420-qatorlar).
- `client-only` ko‘plab joylarda ishlatiladi, lekin bundleni orttiradi; `ssr: false` bo‘lgani uchun kerak emas (`pages/index.vue` ~200-300-qatorlar).
- DOM manipulyatsiyalari qo‘lda bajariladi (masalan, form inputlarga `addEventListener` qo‘shish) va tozalash ishlari yetishmaydi (`pages/give-money/index.vue` ~150-240-qatorlar va shunga o‘xshash fayllar). Vue lifecycle’da listenerlarni `beforeDestroy`/`destroyed` da olib tashlash talab etiladi.
- `v-if`/`v-show` tanlovlari juda ko‘p renderga olib keladi; ba’zi komponentlarda `v-if` o‘rniga `v-show` ishlatish kerak (`components/` ichidagi modal va jadval bloklari).
- Tavsiya: sahifalarni kichikroq komponentlarga ajratish, Composition API (nuxt-composition-api) ga migratsiya qilishni rejalashtirish, DOM manipulyatsiyalarini Vue binding’lari bilan almashtirish, event listenerlarni tozalash.

# 7) Ishlash va bundle o‘lchami
- Tailwind purge bo‘shligi sababli CSS fayllar tozalanmayapti (`tailwind.config.js` ~1-28-qatorlar). Bu mobil foydalanuvchilar uchun yuklanish vaqtini oshiradi.
- Ko‘plab komponentlar statik import qilingan; dynamic import (lazy loading) faqat `pages/` router darajasida tabiiy ravishda mavjud. Katta vizual komponentlarni (charts, editors) `import()` bilan ajratish tavsiya etiladi (`pages/index.vue` ~190-260-qatorlar, `plugins/vue-quill-editor.js`).
- Nuxt build analytics (`nuxt build --analyze`) skript mavjud, lekin muntazam ishlatilgani haqida dalil yo‘q (`package.json` ~10-qator).
- `@nuxt/image` moduli buildModules ro‘yxatida, ammo konfiguratsiyasi va real foydalanish topilmadi; asset optimizatsiyasi ishlamayapti.
- Tavsiya: Purge konfiguratsiyasini to‘ldirish, `modern` build rejimini yoqish, charts/editor kabi og‘ir komponentlar uchun dynamic import va `client-only` bilan birga `lazy-hydration` texnikasidan foydalanish, CDN/immutable cache strategiyasini belgilash.

# 8) Xavfsizlik (frontend)
- `v-html` sanitizatsiyasiz ishlatilishi XSS xavfini tug‘diradi (`pages/news/_id.vue` ~1-80-qatorlar, `pages/index.vue` ~340-420-qatorlar).
- Auth middleware faqat console log qo‘shgan, lekin SSR bo‘lmagan taqdirda ham localStorage va cookie bilan ishlashni tartibga solmaydi (`middleware/auth.js` ~1-40-qatorlar). Tokenlar qanday saqlanishi nazorat qilinmayapti.
- Axios plaginida xatoliklar standart formatlanmagan va timeout/retry sozlamalari yo‘q (`plugins/axios.js` ~1-40-qatorlar). Global loading flag xatolikdan keyin ham to‘liq tozalanmasligi mumkin.
- CSP, secure headers yoki helmet moduli mavjud emas. External skriptlar (`fontawesome`, `gtag`) Subresource Integrity bilan kelgan, lekin fallback/nonce yo‘q.
- Tavsiya: DOMPurify kabi sanitizer bilan `v-html`ni himoyalash, auth middleware’ni SSR-ga tayyorlash, axios interceptorlarda timeout/error handling/refresh token qo‘llash, CSP siyosati va secure headers modulini joriy etish.

# 9) I18n, a11y va UX
- `@nuxtjs/i18n` modulidan foydalanilgan, lekin qo‘shimcha ravishda `plugins/i18n.js`, `i18n-back.js`, `i18n-back.client.js` kabi plaginlar qo‘shilgan; bu duplication va maintainability muammolarini keltiradi (`nuxt.config.js` ~120-170-qatorlar, `plugins/` katalogi).
- Browser tilini aniqlash o‘chirib qo‘yilgan (`detectBrowserLanguage: false`), lekin custom localStorage asosidagi logika ko‘plab joylarda takrorlanadi (`middleware/language.js` ~1-40-qatorlar, `plugins/router-client.js` ~1-40-qatorlar).
- A11y bo‘yicha alt, aria atributlari ko‘p komponentlarda yo‘q; katta tugma bloklari faqat rang bilan farqlanadi (`pages/index.vue` ~260-360-qatorlar). Klaviatura navigatsiyasi va fokus halqalariga e’tibor yetishmaydi.
- UX: Empty state va skeleton komponentlari qisman bor, lekin bir xil formatlanmagan. Form xatoliklari `sweetalert` yoki toast orqali ko‘rsatiladi, lekin accessible emas.
- Tavsiya: i18n konfiguratsiyasini modul orqali tartibga solish, fallback til va hreflang metadata qo‘shish, a11y checklist (alt, aria, focus management)ni joriy qilish, empty state’lar uchun yagona komponent.

# 10) Styling va dizayn tizimi
- Tailwind konfiguratsiyasida `purge` bo‘sh, shuningdek dizayn tokenlari faqat ranglar bilan cheklangan (`tailwind.config.js` ~1-28-qatorlar).
- Global SCSS fayllari (`assets/styles.scss`, `styles/global.css`) bilan Tailwind sinflari aralashgan; naming konventsiyasi aniq emas. BEM yoki boshqa konvensiya ko‘rinmaydi.
- `components` ichida scoped style va global style birga qo‘llangan; collision ehtimoli mavjud.
- Tavsiya: Tailwind JIT/purge-ni sozlash, dizayn tokenlari (spacing, typography) ni umumlashtirish, global CSSni minimal darajaga keltirish, tematiklashtirish (dark mode) imkoniyatlarini ko‘rib chiqish.

# 11) Modullar va qaramliklar
- `package.json` da bir nechta takroriy yoki og‘ir paketlar bor: `vue-awesome`, `@fortawesome/*`, `vue-apexcharts`, `vue-quill-editor`, `vue-html2pdf`, `pdfjs-dist` va boshqalar. Tree-shaking va lazy loading ishlatilmagan.
- `libvips` devDependency sifatida qo‘shilgan, lekin `@nuxt/image` bilan birga server tarafda kerak bo‘ladi; SPA build’da keraksiz og‘irlik.
- Lockfile `yarn.lock` mavjud, lekin muntazam audit belgisi yo‘q. `npm audit` yoki `yarn audit` natijalari ko‘rinmaydi.
- Tavsiya: qaramliklarni tekshirish, keraksiz paketlarni olib tashlash yoki engilroq alternativlarga o‘tish (masalan, iconlarni komponent darajasida import qilish), dependabot/yarn-deduplicate kabi vositalarni joriy etish.

# 12) Testlash va sifat nazorati
- Unit yoki E2E test konfiguratsiyasi topilmadi; `package.json` skriptlarida test buyruqlari yo‘q (`package.json` ~5-30-qatorlar).
- ESLint/Prettier/Stylelint konfiguratsiyalari mavjud emas; `.editorconfig` bilan cheklanilgan.
- Husky/lint-staged yoki commit hook’lar yo‘q.
- Tavsiya: minimal test to‘plami (Jest + @vue/test-utils), asosiy foydalanuvchi oqimlari uchun Cypress/Playwright skriptlari, ESLint + Prettier + Stylelint va Husky hook’larini qo‘shish.

# 13) CI/CD va release intizomi
- `.github/workflows/` yoki boshqa pipeline fayllari yo‘q. Deploy jarayoni qo‘lda bo‘lishi mumkin.
- Env boshqaruvi: `.env` yoki runtime config yo‘q; API URL’lari kodga qat’iy yozilgan (`nuxt.config.js` ~180-210-qatorlar).
- Sourcemaplar, Sentry yoki monitoring integratsiyasi yo‘q.
- Tavsiya: GitHub Actions yoki GitLab CI pipeline qo‘shish (lint → test → build), env variablesni runtimeConfig orqali boshqarish, prod build uchun source maplarni cheklash, Sentry yoki boshqa monitoring qo‘shish.

# 14) PWA va oflayn strategiya
- `@nuxtjs/pwa` moduli kiritilmagan; manifest va workbox sozlamalari yo‘q. Agar oflayn rejim kerak bo‘lsa, to‘liq yo‘qligi muammo.
- Tavsiya: ehtiyoj bo‘lsa `@nuxtjs/pwa` modulini qo‘shish, icon/manifest/workbox strategiyalarini sozlash; aks holda mobil foydalanuvchilar uchun offline fallbackni rejalashtirish.

# 15) SEO
- SPA rejimi tufayli SSR yo‘q; meta teglari minimal. `og:*`, `twitter:*`, `canonical`, `hreflang`, `structured data` yo‘q (`nuxt.config.js` ~4-40-qatorlar).
- `static/robots.txt` yoki `sitemap` modul topilmadi. Robots sozlamasi default.
- Tavsiya: SSR ni qayta yoqish yoki kamida prerender/generate strategiyasini ishlab chiqish, `@nuxtjs/robots` va `@nuxtjs/sitemap` modulini qo‘shish, har bir sahifa uchun title/description/og teglari, hreflang generatsiyasini i18n bilan integratsiya qilish.

# 16) Xatoliklar formati va UX
- Global error layout yoki boundary ko‘rinmaydi (`layouts/` katalogida mos komponent topilmadi). Nuxt default error sahifasi ishlashi ehtimoli yuqori.
- Axios xatolarini toast orqali ko‘rsatish qisman amalga oshirilgan, lekin format bir xil emas (`plugins/axios.js` ~1-40-qatorlar va `pages/` dagi toast chaqiriqlari).
- Loading indikatorlari `store.isLoading` flagiga tayanadi, lekin modal va sahifalarda turlicha implementatsiya qilingan.
- Tavsiya: yagona error layout, global notification system, loading skeletonlar va empty state komponentlarini standartlashtirish.

# 17) Xavf ro‘yxati (ustuvorlik bilan)
| Daraja | Ta’sir | Tavsif (joylashuv) | Tavsiya etilgan yechim | Mehnat bahosi | Bog‘liqlik |
| --- | --- | --- | --- | --- | --- |
| Blocker | Xavfsizlik/SEO | SPA rejimi (`nuxt.config.js` ~30-80-qatorlar) | SSR (universal) rejimiga qaytish yoki kamida prerender/generate bilan statik HTML ishlab chiqarish; modern build va head meta qayta ko‘rib chiqish | L | Yo‘q |
| High | Funktsional | Router konfiguratsiyasining ustma-ust yozilishi (`nuxt.config.js` ~60-170-qatorlar) | Router obyektini yagona deklaratsiyaga olib kelish, middleware va scrollBehavior’ni birlashtirish | S | Yo‘q |
| High | Xavfsizlik | `v-html` sanitizatsiyasiz (`pages/news/_id.vue` ~1-80, `pages/index.vue` ~340-420) | DOMPurify yoki server-side sanitizatsiya, helper orqali markapni tozalash | M | Yo‘q |
| High | Funktsional | Vuex mutatsiyasidagi xatolik (`store/index.js` ~20-35) | Mutatsiyalarni tekshirish, strict rejimni yoqish, unit test yozish | S | Yo‘q |
| Medium | Ishlash | Tailwind purge yo‘qligi (`tailwind.config.js` ~1-28) | PurgePaths sozlash, CSS optimizatsiyasini yoqish | S | Yo‘q |
| Medium | Texnik qarz | Runtime config yetishmasligi (`nuxt.config.js` ~180-210) | `publicRuntimeConfig`/`privateRuntimeConfig` joriy etish, `.env` orqali boshqarish | M | Router/SSR tuzatishidan so‘ng |
| Medium | UX/A11y | Event listenerlar tozalanmasligi (`pages/give-money/index.vue` ~150-240 va o‘xshashlar) | Vue lifecycle’da removeEventListener qo‘shish yoki v-modelga o‘tish | M | Yo‘q |
| Low | Texnik qarz | Test va linting yo‘qligi (`package.json` ~5-30) | Jest/Cypress va ESLint/Prettier konfiguratsiyasini qo‘shish | M | Bazaviy strukturani tozalagach |
| Low | Monitoring | CI/CD pipeline yo‘qligi | GitHub Actions/GitLab CI sozlash | M | Runtime config yo‘lga qo‘yilgach |

# 18) 30/60/90 kunlik yo‘l xaritasi
- **30 kun**: SSR yoki SSG strategiyasini qayta yo‘lga qo‘yish, router konfiguratsiyasini tuzatish, `v-html` sanitizatsiyasini joriy etish, Vuex mutatsiyalarini to‘g‘rilash, runtime config va env boshqaruvini joriy qilish.
- **60 kun**: Tailwind purge va bundle optimizatsiyasi, dynamic importlar, axios interceptorlarida error handling, i18n plaginlarini soddalashtirish, event listener cleanup, unit testlar va lintingni joriy etish.
- **90 kun**: SEO va hreflang strategiyasi, a11y audit va tuzatishlar, CI/CD pipeline, monitoring (Sentry) va PWA ehtiyoj bo‘lsa workbox sozlamalari, Composition API yoki Nuxt 3 migratsiyasi uchun tayyorgarlik.

# 19) Migratsiya istiqbollari (ixtiyoriy)
- Nuxt 3/Vue 3 ga bosqichma-bosqich o‘tish uchun avvalo komponentlarni kichikroq bo‘laklarga ajratish, Vuex o‘rniga Pinia yoki Composition API xizmatlaridan foydalanishni boshlash zarur.
- Plugins va mixinlar o‘rniga composable funksiyalarni rejalashtirish, third-party kutubxonalarni (chart, editor) Vue 3 bilan mos versiyalariga yangilash lozim.
- Gradual migratsiya: avval Composition API’ga o‘tish (`@nuxtjs/composition-api` yordamida), so‘ngra Nuxt 3 ga ko‘chirish. Eslab qolish kerakki, `nuxt-socket-io`, `vue-quill-editor` kabi paketlar Vue 3 mos muqobillarini talab qiladi.
