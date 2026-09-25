<template>
  <div class="pb-8">
    <!-- Xodim do'kon header — Orqaga tugmasi + do'kon nomi (faqat xodim sessiyasida) -->
    <div v-if="isXodim" class="mt-2 flex items-center gap-3 mb-4">
      <button @click="exitXodimDokon" class="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-300 shadow-sm" :title="texts.back">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="min-w-0">
        <h1 class="text-xl lg:text-2xl font-bold text-gray-900 truncate">{{ xodimDokonNomi }}</h1>
        <p class="text-xs text-gray-500">{{ texts.xodimDokonSubtitle }}</p>
      </div>
    </div>

    <!-- Welcome Banner (xodim uchun ko'rinmaydi) -->
    <div v-if="!isXodim" class="mt-2">
      <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="qd-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#qd-grid)" />
          </svg>
        </div>

        <div class="relative z-10">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 class="text-2xl lg:text-3xl font-bold mb-2">{{ texts.pageTitle }}</h1>
              <p class="text-blue-100 text-sm lg:text-base max-w-xl">{{ texts.pageSubtitle }}</p>
            </div>
            <div class="mt-5 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <!-- Qarz berish (oq/ko'k) — do'kon oldindan tanlangan bo'lsa to'g'ridan-to'g'ri,
                   "Barcha do'konlar" bo'lsa do'kon tanlash modali ochiladi -->
              <button
                type="button"
                @click="goTuri('berish')"
                class="flex items-center justify-center px-6 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                {{ texts.qarzgaBerish }}
              </button>
              <!-- Qarz olish (yashil) -->
              <button
                type="button"
                @click="goTuri('olish')"
                class="flex items-center justify-center px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                {{ texts.qarzgaOlish }}
              </button>
            </div>
          </div>

<!-- Quick Stats banner ichidan olib tashlandi (foydalanuvchi xohlagani bo'yicha).
     Statistika 'Qarzdorliklar' bo'limidagi 4 ta cardda ko'rinadi. -->
        </div>
      </div>
    </div>

    <!-- "Umumiy ko'rinish" (shartnoma va daftari nisbati) bosh sahifaga ko'chirildi (Task 6a). -->

    <!-- SS-DEV (2026-09-24), hujjat 6-rasm:
           • "Qarzdorliklar" kartalari endi Qarz shartnomasi sahifasidagi BIR XIL komponent —
             `DashboardStats` (asosiy gradient kartalar + yonida "Muddati o'tgan" yordamchi
             kartalar). Manzillar `links`, sarlavhalar `labels`/`texts` orqali beriladi,
             summalar FAQAT qarz daftari (shartnoma EMAS) — avvalgidek.
           • "Barcha do'konlar" uzun kartasi → IXCHAM CHIP (sarlavha qatorining o'ng
             tomonida): ikonka + do'kon nomi + soni + pastga strelka. Bosilganda avvalgidek
             do'kon tanlash modali ochiladi (funksiya o'zgarmadi). Xodim sessiyasida
             ko'rinmaydi. -->
    <!-- SS-DEV (2026-09-26), 25.09 "Xatolar" 4-rasm: "Qarzdorliklar" sarlavhasi OLIB TASHLANDI,
         o'rniga "Barcha do'konlar" chipi kattaroq (balandroq, shrift kattaroq) — funksiya
         (do'kon tanlash modali) O'ZGARMADI. Xodim sessiyasida chip ko'rinmaydi. -->
    <div class="mt-6 lg:mt-8">
      <div v-if="!isXodim" class="flex flex-wrap items-center justify-start gap-3 mb-4">
        <button
          type="button"
          @click="openDokonModal()"
          class="zx-dokon-chip inline-flex items-center gap-3 bg-white rounded-2xl pl-3 pr-4 py-3 border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow transition-all text-left"
          :title="texts.barchaDokonlar"
        >
          <span class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <ShopIcon cls="w-6 h-6" />
          </span>
          <span class="min-w-0">
            <span class="block text-base lg:text-lg font-bold text-gray-900 truncate leading-tight">{{ dokonCardTitle }}</span>
            <span class="block text-sm text-gray-500 truncate leading-tight mt-0.5">{{ dokonCardSubtitle }}</span>
          </span>
          <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
      </div>

      <!-- Main Stats Cards: FAQAT qarz daftari (shartnoma EMAS) -->
      <DashboardStats
        hide-title
        :texts="statsTexts"
        :labels="{ debitor: texts.berilganQarz, creditor: texts.olinganQarz }"
        :links="statsLinks"
        :debitor-uzs="daftariBerilganUzs"
        :debitor-usd="daftariBerilganUsd"
        :creditor-uzs="daftariOlinganUzs"
        :creditor-usd="daftariOlinganUsd"
        :expired-debitor-uzs="daftariMuddatiOtganBerishUzs"
        :expired-debitor-usd="daftariMuddatiOtganBerishUsd"
        :expired-creditor-uzs="daftariMuddatiOtganOlishUzs"
        :expired-creditor-usd="daftariMuddatiOtganOlishUsd"
      />

      <!-- Drill-down: olib tashlandi — endi cardlar to'g'ridan-to'g'ri ro'yxatga o'tadi -->
      <transition name="fade-slide" v-if="false">
        <div v-if="drill === 'berilgan'" class="mt-4 bg-white rounded-2xl shadow-md border border-blue-200 p-6">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
              </div>
              <h3 class="text-base font-bold text-gray-900">{{ texts.berilganQarzDetail }}</h3>
            </div>
            <button @click="drill = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Shartnoma sub-card -->
            <nuxt-link :to="localePath({ name: 'debt-list' }) + '?type=debitor'" class="group block bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-5 transition-all">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <h4 class="text-sm font-bold text-gray-900">{{ texts.shartnomaLabel }}</h4>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(dashboard.berilgan_qarz?.shartnoma?.uzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
              <p class="text-base font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.berilgan_qarz?.shartnoma?.usd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
              <p class="text-xs text-blue-600 mt-3 font-semibold">{{ texts.viewDetails }} →</p>
            </nuxt-link>
            <!-- Daftari sub-card -->
            <!-- SS18 (2026-09-21): ilgari bu karta "Qarz daftariga kiritish" (do'kon
                 tanlash) sahifasiga olib borardi. Ammo bu DRILL-DOWN kartasi —
                 u summani KO'RSATADI, yangi qarz kiritmaydi. Qo'shni "shartnoma"
                 kartasi ham ro'yxatga boradi. Do'kon tanlovi esa endi bosh sahifada
                 GLOBAL. Shuning uchun u ham qarzlar RO'YXATIGA yo'naltirildi. -->
            <nuxt-link :to="localePath({ name: 'qarz-daftari-qarzlar' }) + '?turi=berish'" class="group block bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 rounded-xl p-5 transition-all">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  </div>
                  <h4 class="text-sm font-bold text-gray-900">{{ texts.daftariLabel }}</h4>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(dashboard.berilgan_qarz?.daftari?.uzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
              <p class="text-base font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.berilgan_qarz?.daftari?.usd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
              <p class="text-xs text-green-700 mt-3 font-semibold">{{ texts.viewDetails }} →</p>
            </nuxt-link>
          </div>
        </div>
      </transition>

      <!-- Drill-down: Olingan (shartnoma vs daftari) -->
      <transition name="fade-slide">
        <div v-if="drill === 'olingan'" class="mt-4 bg-white rounded-2xl shadow-md border border-green-200 p-6">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>
              </div>
              <h3 class="text-base font-bold text-gray-900">{{ texts.olinganQarzDetail }}</h3>
            </div>
            <button @click="drill = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Shartnoma sub-card -->
            <nuxt-link :to="localePath({ name: 'debt-list' }) + '?type=creditor'" class="group block bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-5 transition-all">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <h4 class="text-sm font-bold text-gray-900">{{ texts.shartnomaLabel }}</h4>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(dashboard.olingan_qarz?.shartnoma?.uzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
              <p class="text-base font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.olingan_qarz?.shartnoma?.usd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
              <p class="text-xs text-blue-600 mt-3 font-semibold">{{ texts.viewDetails }} →</p>
            </nuxt-link>
            <!-- Daftari sub-card -->
            <!-- SS18 (2026-09-21): ilgari bu karta "Qarz daftariga kiritish" (do'kon
                 tanlash) sahifasiga olib borardi. Ammo bu DRILL-DOWN kartasi —
                 u summani KO'RSATADI, yangi qarz kiritmaydi. Qo'shni "shartnoma"
                 kartasi ham ro'yxatga boradi. Do'kon tanlovi esa endi bosh sahifada
                 GLOBAL. Shuning uchun u ham qarzlar RO'YXATIGA yo'naltirildi. -->
            <nuxt-link :to="localePath({ name: 'qarz-daftari-qarzlar' }) + '?turi=olish'" class="group block bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 rounded-xl p-5 transition-all">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  </div>
                  <h4 class="text-sm font-bold text-gray-900">{{ texts.daftariLabel }}</h4>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ formatMoney(dashboard.olingan_qarz?.daftari?.uzs) }} <span class="text-sm font-medium text-gray-400">UZS</span></p>
              <p class="text-base font-bold text-gray-900 mt-1">{{ formatMoney(dashboard.olingan_qarz?.daftari?.usd) }} <span class="text-xs font-medium text-gray-400">USD</span></p>
              <p class="text-xs text-green-700 mt-3 font-semibold">{{ texts.viewDetails }} →</p>
            </nuxt-link>
          </div>
        </div>
      </transition>
    </div>

    <!-- Muddati yaqinlashganlar -->
    <QarzDaftariNearExpiration :nearDebitor="nearDebitor" :nearKreditor="nearKreditor" />

    <!-- SS-21 (2026-09-19): Qarz kalendari — mobil ilovadagi kabi ASOSIY bo'lim.
         Tanlangan do'kon bo'yicha filtrlanadi (tanlanmasa — barcha do'konlar).
         SS-DEV (2026-09-24): "Muddati yaqin qarzlar" TAGIDA alohida KARTA sifatida,
         sarlavha + izoh bilan (shaxsiy moliya kalendari uslubida) — foydalanuvchi
         talabi: «kalendarni chiroyli qilib ... muddati yaqin qarzlar bo'limining tagiga». -->
    <!-- SS-DEV (2026-09-24), 7-rasm: karta chegara + soya bilan fondan ajralib turadi -->
    <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-5 lg:p-6 mt-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background:#EEF2FF; color:#4338CA;">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        </div>
        <div class="min-w-0">
          <h2 class="text-lg font-bold text-gray-900 leading-tight">{{ texts.kalendarTitle || 'Qarz kalendari' }}</h2>
          <p class="text-xs text-gray-500 mt-0.5">{{ texts.kalendarHint || "Sanalar bo'yicha berilgan va undirilgan qarzlar" }}</p>
        </div>
      </div>
      <!-- SS-DEV (2026-09-24): ILDIZ SABAB (7-rasm, kalendar bo'sh): Nuxt avto-import
           `components/qarz-daftari/QarzKalendar.vue` ni "QarzDaftari" prefiksi bilan EMAS,
           takror "Qarz" bo'g'inini qisqartirib `QarzKalendar` nomida ro'yxatga oladi (chunk:
           components/qarz-kalendar). Sahifada esa `<QarzDaftariQarzKalendar>` yozilgan edi —
           noma'lum teg → hech narsa chizilmasdi. Endi komponent AYNAN import qilinadi. -->
      <QarzKalendar :faoliyat-id="tanlanganDokon ? tanlanganDokon.id : null" />
    </div>

    <!-- Ogohlantirish — sahifa eng pastida -->
    <div v-if="showWarning" class="relative overflow-hidden rounded-2xl mt-6 border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 shadow-md">
      <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-amber-400 to-orange-500"></div>
      <div class="flex items-start gap-4 p-4 pl-6">
        <div class="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-amber-900 mb-0.5">{{ ({ ru: 'Обратите внимание', kr: 'Диққат', en: 'Attention', kaa: 'Dıqqat' })[$i18n.locale] || 'Diqqat' }}</p>
          <p class="text-sm font-medium text-amber-800 leading-relaxed">{{ texts.warning }}</p>
        </div>
        <button @click="showWarning = false" class="flex-shrink-0 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">{{ texts.understood }}</button>
      </div>
    </div>

    <!-- Do'kon tanlash modali — orqa fon blur (Tailwind v2 da backdrop-blur YO'Q,
         shuning uchun inline style). z-index 90 — SavdoFaoliyatModal (100) ustidan
         ochilishi uchun ataylab pastroq. -->
    <div
      v-if="showDokonModal"
      class="fixed inset-0 flex items-center justify-center p-4"
      style="z-index: 90; background-color: rgba(17, 24, 39, 0.45); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"
      @click.self="closeDokonModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <!-- Sarlavha + yopish -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 class="text-base font-bold text-gray-900">{{ texts.barchaDokonlar }}</h3>
          <button type="button" @click="closeDokonModal" class="w-8 h-8 -mr-1 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors" :title="texts.close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Ro'yxat -->
        <div class="py-2 overflow-y-auto" style="max-height: 60vh">
          <!-- SS17 (2026-09-21): "Barcha do'konlar" — bu AYRIM do'kon emas, balki
               "filtrni o'chirish" rejimi. Shuning uchun u do'kon nomlaridan
               VIZUAL AJRALIB turadi: boshqa fon rangi, pastida ajratuvchi chiziq
               va ikonka o'rniga "hammasi" belgisi (grid). Ilgari u oddiy do'kon
               qatoriga o'xshab ketardi va foydalanuvchi uni do'kon deb o'ylardi. -->
          <button
            type="button"
            @click="selectDokon('all')"
            :class="['zx-dokon-all w-full flex items-center gap-3 px-5 py-3 text-left transition-colors', selectedDokonId === 'all' ? 'bg-blue-600' : '']"
          >
            <div :class="['w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', selectedDokonId === 'all' ? 'bg-blue-500' : 'bg-white border border-gray-200']">
              <svg class="w-5 h-5" :class="selectedDokonId === 'all' ? 'text-white' : 'text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
            </div>
            <span class="flex-1 min-w-0">
              <span :class="['block text-sm font-bold truncate', selectedDokonId === 'all' ? 'text-white' : 'text-gray-700']">{{ texts.barchaDokonlar }}</span>
              <span :class="['block text-xs', selectedDokonId === 'all' ? 'text-blue-100' : 'text-gray-400']">{{ faoliyatlar.length }} {{ texts.dokonSoni }}</span>
            </span>
            <svg v-if="selectedDokonId === 'all'" class="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
          </button>

          <!-- Do'konlar ketma-ket -->
          <div
            v-for="f in faoliyatlar"
            :key="(f.is_xodim_role ? 'x-' : 'o-') + f.id"
            :class="['flex items-center gap-2 pr-3 transition-colors', String(selectedDokonId) === String(f.id) ? 'bg-blue-600' : 'hover:bg-gray-50']"
          >
            <button type="button" @click="selectDokon(f.id)" class="flex-1 min-w-0 flex items-center gap-3 px-5 py-3 text-left">
              <div :class="['w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', String(selectedDokonId) === String(f.id) ? 'bg-blue-500' : 'bg-gray-100']">
                <ShopIcon cls="w-5 h-5" />
              </div>
              <span class="flex-1 min-w-0">
                <span :class="['block text-sm font-semibold truncate', String(selectedDokonId) === String(f.id) ? 'text-white' : 'text-gray-900']">{{ f.nomi }}</span>
                <span v-if="f.is_xodim_role" :class="['block text-xs', String(selectedDokonId) === String(f.id) ? 'text-blue-100' : 'text-purple-600']">{{ texts.xodimBadge }}</span>
              </span>
            </button>
            <!-- Tahrirlash (qalam) — faqat egasi o'z do'konini tahrirlaydi -->
            <button
              v-if="!f.is_xodim_role"
              type="button"
              @click.stop="editDokon(f)"
              :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors', String(selectedDokonId) === String(f.id) ? 'text-white hover:bg-blue-500' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50']"
              :title="texts.tahrirlash"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
          </div>
        </div>

        <!-- Yangi do'kon qo'shish -->
        <div class="px-4 py-3 border-t border-gray-100">
          <button type="button" @click="addDokon" class="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            {{ texts.yangiDokon }}
          </button>
        </div>
      </div>
    </div>

    <!-- Do'kon yaratish / tahrirlash modali (z-index 100 — tanlash modali ustida) -->
    <QarzDaftariSavdoFaoliyatModal v-if="showFaoliyatModal" :faoliyat="editingFaoliyat" @close="closeFaoliyatModal" @saved="onFaoliyatSaved" />
  </div>
</template>

<script>
import { formatMoney } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
/**
 * Tanlangan do'kon (savdo faoliyati) localStorage kaliti.
 * Qiymati: 'all' (Barcha do'konlar) yoki savdo_faoliyat id (string).
 * Mobil ilovadagi global do'kon tanlovi bilan bir xil mantiq.
 */
const DOKON_LS_KEY = 'zx_qd_dokon';

import QarzKalendar from '~/components/qarz-daftari/QarzKalendar.vue'; // SS-DEV (2026-09-24)
import DashboardStats from '~/components/dashboard/DashboardStats.vue'; // SS-DEV (2026-09-24): Qarz shartnomasi sahifasi bilan bir xil kartalar

export default {
  components: { QarzKalendar, DashboardStats },
  middleware: 'auth',
  data() {
    return {
      showWarning: true,
      drill: null, // null | 'berilgan' | 'olingan'
      // Do'kon tanlash
      faoliyatlar: [],
      selectedDokonId: 'all',
      showDokonModal: false,
      pendingTuri: null, // 'berish' | 'olish' — do'kon tanlangach shu sahifaga o'tiladi
      showFaoliyatModal: false,
      editingFaoliyat: null,
      dashboard: {
        usd_rate: 0,
        berilgan_qarz: { shartnoma: { uzs: 0, usd: 0 }, daftari: { uzs: 0, usd: 0 } },
        olingan_qarz: { shartnoma: { uzs: 0, usd: 0 }, daftari: { uzs: 0, usd: 0 } },
        muddati_otgan_debitor: { uzs: 0, usd: 0 },
        muddati_otgan_kreditor: { uzs: 0, usd: 0 },
      },
      nearDebitor: [],
      nearKreditor: [],
    };
  },
  computed: {
    isXodim() {
      return !!this.$auth?.user?.is_xodim;
    },
    xodimDokonNomi() {
      return this.$auth?.user?.savdo_faoliyat_nomi || this.texts.xodimDokon;
    },
    // Banner uchun: shartnoma + daftari (combined)
    totalBerilganUzs() {
      return (this.dashboard.berilgan_qarz?.shartnoma?.uzs || 0) + (this.dashboard.berilgan_qarz?.daftari?.uzs || 0);
    },
    totalBerilganUsd() {
      return (this.dashboard.berilgan_qarz?.shartnoma?.usd || 0) + (this.dashboard.berilgan_qarz?.daftari?.usd || 0);
    },
    totalOlinganUzs() {
      return (this.dashboard.olingan_qarz?.shartnoma?.uzs || 0) + (this.dashboard.olingan_qarz?.daftari?.uzs || 0);
    },
    totalOlinganUsd() {
      return (this.dashboard.olingan_qarz?.shartnoma?.usd || 0) + (this.dashboard.olingan_qarz?.daftari?.usd || 0);
    },
    // Qarzdorliklar cardlari uchun: FAQAT qarz daftari (shartnoma EMAS)
    daftariBerilganUzs() { return Number(this.dashboard.berilgan_qarz?.daftari?.uzs) || 0; },
    daftariBerilganUsd() { return Number(this.dashboard.berilgan_qarz?.daftari?.usd) || 0; },
    daftariOlinganUzs() { return Number(this.dashboard.olingan_qarz?.daftari?.uzs) || 0; },
    daftariOlinganUsd() { return Number(this.dashboard.olingan_qarz?.daftari?.usd) || 0; },
    daftariMuddatiOtganBerishUzs() { return Number(this.dashboard.muddati_otgan_debitor?.daftari?.uzs) || 0; },
    daftariMuddatiOtganBerishUsd() { return Number(this.dashboard.muddati_otgan_debitor?.daftari?.usd) || 0; },
    daftariMuddatiOtganOlishUzs() { return Number(this.dashboard.muddati_otgan_kreditor?.daftari?.uzs) || 0; },
    daftariMuddatiOtganOlishUsd() { return Number(this.dashboard.muddati_otgan_kreditor?.daftari?.usd) || 0; },
    /** Tanlangan do'kon obyekti ('Barcha do'konlar' holatida null) */
    tanlanganDokon() {
      if (!this.selectedDokonId || this.selectedDokonId === 'all') return null;
      return this.faoliyatlar.find((f) => String(f.id) === String(this.selectedDokonId)) || null;
    },
    /** Card sarlavhasi: do'kon nomi yoki "Barcha do'konlar" */
    dokonCardTitle() {
      return this.tanlanganDokon ? this.tanlanganDokon.nomi : this.texts.barchaDokonlar;
    },
    /** Card ost-satri: manzil yoki "N ta do'kon" */
    dokonCardSubtitle() {
      const d = this.tanlanganDokon;
      if (d) {
        const addr = [d.region, d.district].filter(Boolean).join(', ');
        return addr || this.texts.tanlanganDokon;
      }
      return `${this.faoliyatlar.length} ${this.texts.dokonSoni}`;
    },
    /** SS-DEV (2026-09-24): DashboardStats uchun matnlar (badge'lar, "Muddati o'tgan" sarlavhalari) */
    statsTexts() {
      const t = this.texts;
      return {
        financialSummary: t.qarzdorliklar,
        receivable: t.olishKerak,
        payable: t.berishKerak,
        overdue: t.muddatiOtgan,
        overdueGiven: t.muddatiOtganDebitor,
        overdueTaken: t.muddatiOtganKreditor,
      };
    },
    /** SS-DEV (2026-09-24): kartalar qarz daftari RO'YXATIGA olib boradi (avvalgidek) */
    statsLinks() {
      const base = this.localePath({ name: 'qarz-daftari-qarzlar' });
      return {
        debitor: base + '?turi=berish',
        creditor: base + '?turi=olish',
        expiredDebitor: base + '?turi=berish&status=muddati-otgan',
        expiredCreditor: base + '?turi=olish&status=muddati-otgan',
      };
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          pageTitle: "Qarz daftari",
          pageSubtitle: "Qarz oldi-berdi munosabatlaringizni elektron boshqaring.",
          xodimDokon: "Do'kon",
          xodimDokonSubtitle: "Xodim sifatida ishlayotgan do'koningiz",
          back: "Orqaga",
          warning: "Qarz oldi-berdi munosabatlaringizni qarz daftariga kiritish orqali qarzlaringizni elektron boshqarish imkoniyatiga ega bo'lasiz. Biroq bu holatda qarz daftariga kiritilgan qarzlar bo'yicha qarz shartnomasi rasmiylashtirilmaydi.",
          understood: "Tushundim",
          overview: "Umumiy ko'rinish",
          chartDesc: "Shartnoma va daftari nisbati",
          qarzgaBerish: "Qarzga berish",
          qarzgaBerishDesc: "Mijozga qarz bering va to'lovlarni kuzating",
          qarzgaOlish: "Qarzga olish",
          qarzgaOlishDesc: "Olingan qarzni qayd eting va muddatini belgilang",
          qarzdorliklar: "Qarzdorliklar",
          berilganQarz: "Berilgan qarz",
          olinganQarz: "Olingan qarz",
          berilganQarzDetail: "Berilgan qarz — manbalar bo'yicha",
          olinganQarzDetail: "Olingan qarz — manbalar bo'yicha",
          olishKerak: "Olish kerak",
          berishKerak: "Berish kerak",
          muddatiOtgan: "Muddati o'tgan",
          muddatiOtganDebitor: "Berilgan qarz", // SS-DEV (2026-09-24): "(debitor)" o'rniga
          muddatiOtganKreditor: "Olingan qarz", // SS-DEV (2026-09-24): "(kreditor)" o'rniga
          shartnomaTuzish: "Qarz shartnomasi",
          daftarigaKiritish: "Qarz daftariga kiritish",
          shartnomaLabel: "Qarz shartnomasi",
          daftariLabel: "Qarz daftari",
          kalendarTitle: "Qarz kalendari", // SS-DEV (2026-09-24)
          kalendarHint: "Sanalar bo'yicha berilgan va undirilgan qarzlar — kunni bosib tafsilotni ko'ring", // SS-DEV (2026-09-24): "qaytarilgan" → "undirilgan"
          viewDetails: "Batafsil ko'rish",
          barchaDokonlar: "Barcha do'konlar",
          dokonSoni: "ta do'kon",
          tanlanganDokon: "Tanlangan do'kon",
          yangiDokon: "Yangi do'kon qo'shish",
          tahrirlash: "Tahrirlash",
          xodimBadge: "Xodim sifatida ulangan",
          close: "Yopish",
        },
        ru: {
          pageTitle: "Книга долгов",
          pageSubtitle: "Управляйте долговыми отношениями электронно.",
          xodimDokon: "Магазин",
          xodimDokonSubtitle: "Магазин, где вы работаете сотрудником",
          back: "Назад",
          warning: "Внося долговые отношения в книгу долгов, вы получаете возможность электронного управления долгами. Однако в этом случае по внесённым в книгу долгов записям долговой договор не оформляется.",
          understood: "Понятно",
          overview: "Обзор",
          chartDesc: "Соотношение договора и книги",
          qarzgaBerish: "Дать в долг",
          qarzgaBerishDesc: "Выдайте долг клиенту и отслеживайте платежи",
          qarzgaOlish: "Взять в долг",
          qarzgaOlishDesc: "Запишите полученный долг и установите сроки",
          qarzdorliklar: "Задолженности",
          berilganQarz: "Выданные долги",
          olinganQarz: "Полученные долги",
          berilganQarzDetail: "Выданные долги — по источникам",
          olinganQarzDetail: "Полученные долги — по источникам",
          olishKerak: "К получению",
          berishKerak: "К возврату",
          muddatiOtgan: "Просрочено",
          muddatiOtganDebitor: "Выданный долг",
          muddatiOtganKreditor: "Полученный долг",
          shartnomaTuzish: "Договор долга",
          daftarigaKiritish: "Внести в книгу долгов",
          shartnomaLabel: "По договору",
          daftariLabel: "По книге долгов",
          kalendarTitle: "Календарь долгов", // SS-DEV (2026-09-24)
          kalendarHint: "Выданные и взысканные долги по датам — нажмите на день для деталей",
          viewDetails: "Подробнее",
          barchaDokonlar: "Все магазины",
          dokonSoni: "магазинов",
          tanlanganDokon: "Выбранный магазин",
          yangiDokon: "Добавить новый магазин",
          tahrirlash: "Редактировать",
          xodimBadge: "Подключён как сотрудник",
          close: "Закрыть",
        },
        kr: {
          pageTitle: "Қарз дафтари",
          pageSubtitle: "Қарз олди-берди муносабатларингизни электрон бошқаринг.",
          xodimDokon: "Дўкон",
          xodimDokonSubtitle: "Ходим сифатида ишлаётган дўконингиз",
          back: "Орқага",
          warning: "Қарз олди-берди муносабатларингизни қарз дафтарига киритиш орқали қарзларингизни электрон бошқариш имкониятига эга бўласиз. Бироқ бу ҳолатда қарз дафтарига киритилган қарзлар бўйича қарз шартномаси расмийлаштирилмайди.",
          understood: "Тушундим",
          overview: "Умумий кўриниш",
          chartDesc: "Шартнома ва дафтари нисбати",
          qarzgaBerish: "Қарзга бериш",
          qarzgaBerishDesc: "Мижозга қарз беринг ва тўловларни кузатинг",
          qarzgaOlish: "Қарзга олиш",
          qarzgaOlishDesc: "Олинган қарзни қайд этинг ва муддатини белгиланг",
          qarzdorliklar: "Қарздорликлар",
          berilganQarz: "Берилган қарз",
          olinganQarz: "Олинган қарз",
          berilganQarzDetail: "Берилган қарз — манбалар бўйича",
          olinganQarzDetail: "Олинган қарз — манбалар бўйича",
          olishKerak: "Олиш керак",
          berishKerak: "Бериш керак",
          muddatiOtgan: "Муддати ўтган",
          muddatiOtganDebitor: "Берилган қарз",
          muddatiOtganKreditor: "Олинган қарз",
          shartnomaTuzish: "Қарз шартномаси",
          daftarigaKiritish: "Қарз дафтарига киритиш",
          shartnomaLabel: "Қарз шартномаси",
          daftariLabel: "Қарз дафтари",
          kalendarTitle: "Қарз календари", // SS-DEV (2026-09-24)
          kalendarHint: "Саналар бўйича берилган ва ундирилган қарзлар — кунни босиб тафсилотни кўринг",
          viewDetails: "Батафсил кўриш",
          barchaDokonlar: "Барча дўконлар",
          dokonSoni: "та дўкон",
          tanlanganDokon: "Танланган дўкон",
          yangiDokon: "Янги дўкон қўшиш",
          tahrirlash: "Таҳрирлаш",
          xodimBadge: "Ходим сифатида уланган",
          close: "Ёпиш",
        },
        // SS-DEV (2026-09-26): en/kaa
        en: {
          pageTitle: "Debt ledger",
          pageSubtitle: "Manage your lending relationships electronically.",
          xodimDokon: "Shop",
          xodimDokonSubtitle: "The shop you work at as an employee",
          back: "Back",
          warning: "By entering your lending relationships into the debt ledger you can manage your debts electronically. However, no loan agreement is formalised for debts entered in the debt ledger.",
          understood: "Understood",
          overview: "Overview",
          chartDesc: "Agreement vs ledger ratio",
          qarzgaBerish: "Lend",
          qarzgaBerishDesc: "Lend to a customer and track payments",
          qarzgaOlish: "Borrow",
          qarzgaOlishDesc: "Record a received debt and set its due date",
          qarzdorliklar: "Debts",
          berilganQarz: "Debt given",
          olinganQarz: "Debt received",
          berilganQarzDetail: "Debt given — by source",
          olinganQarzDetail: "Debt received — by source",
          olishKerak: "To receive",
          berishKerak: "To pay",
          muddatiOtgan: "Overdue",
          muddatiOtganDebitor: "Debt given",
          muddatiOtganKreditor: "Debt received",
          shartnomaTuzish: "Loan agreement",
          daftarigaKiritish: "Enter into the debt ledger",
          shartnomaLabel: "Loan agreement",
          daftariLabel: "Debt ledger",
          kalendarTitle: "Debt calendar",
          kalendarHint: "Debts given and collected by date — click a day to see details",
          viewDetails: "View details",
          barchaDokonlar: "All shops",
          dokonSoni: "shops",
          tanlanganDokon: "Selected shop",
          yangiDokon: "Add a new shop",
          tahrirlash: "Edit",
          xodimBadge: "Connected as an employee",
          close: "Close",
        },
        kaa: {
          pageTitle: "Qarız dápteri",
          pageSubtitle: "Qarız alıs-beris munásebetlerińizdi elektron basqarıń.",
          xodimDokon: "Dúkan",
          xodimDokonSubtitle: "Xızmetker sıpatında islep atırǵan dúkanıńız",
          back: "Artqa",
          warning: "Qarız alıs-beris munásebetlerińizdi qarız dápterine kiritiw arqalı qarızlarıńızdı elektron basqarıw múmkinshiligine iye bolasız. Biraq bul jaǵdayda qarız dápterine kiritilgen qarızlar boyınsha qarız shártnaması rásmiylestirilmeydi.",
          understood: "Túsindim",
          overview: "Ulıwma kórinis",
          chartDesc: "Shártnama hám dápter qatnası",
          qarzgaBerish: "Qarızǵa beriw",
          qarzgaBerishDesc: "Klientke qarız beriń hám tólemlerdi baqlań",
          qarzgaOlish: "Qarızǵa alıw",
          qarzgaOlishDesc: "Alınǵan qarızdı jazıp qoyıń hám múddetin belgileń",
          qarzdorliklar: "Qarızdarlıqlar",
          berilganQarz: "Berilgen qarız",
          olinganQarz: "Alınǵan qarız",
          berilganQarzDetail: "Berilgen qarız — derekler boyınsha",
          olinganQarzDetail: "Alınǵan qarız — derekler boyınsha",
          olishKerak: "Alıw kerek",
          berishKerak: "Beriw kerek",
          muddatiOtgan: "Múddeti ótken",
          muddatiOtganDebitor: "Berilgen qarız",
          muddatiOtganKreditor: "Alınǵan qarız",
          shartnomaTuzish: "Qarız shártnaması",
          daftarigaKiritish: "Qarız dápterine kiritiw",
          shartnomaLabel: "Qarız shártnaması",
          daftariLabel: "Qarız dápteri",
          kalendarTitle: "Qarız kalendarı",
          kalendarHint: "Sáneler boyınsha berilgen hám óndirilgen qarızlar — kúndi basıp detallardı kóriń",
          viewDetails: "Tolıq kóriw",
          barchaDokonlar: "Barlıq dúkanlar",
          dokonSoni: "dúkan",
          tanlanganDokon: "Saylanǵan dúkan",
          yangiDokon: "Jańa dúkan qosıw",
          tahrirlash: "Ózgertiw",
          xodimBadge: "Xızmetker sıpatında jalǵanǵan",
          close: "Jabıw",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() {
    /**
     * SS4 (2026-09-20): TARTIB MUHIM. Ilgari uchala so'rov BARAVAR ketardi va
     * dashboard/near-expiration do'kon tanlovi tiklanishidan OLDIN yuborilardi —
     * natijada tanlangan do'kon bo'lsa ham "barcha do'konlar" summasi chiqardi.
     * Endi: avval do'konlar ro'yxati + saqlangan tanlov, so'ng filtrlangan ma'lumot.
     */
    await this.loadFaoliyatlar();
    await Promise.all([this.loadDashboard(), this.loadNearExpiration()]);
  },

  watch: {
    // SS4: do'kon tanlovi o'zgarsa — Qarzdorliklar va "Muddati yaqin" QAYTA yuklanadi.
    selectedDokonId() {
      this.loadDashboard();
      this.loadNearExpiration();
    },
  },
  methods: {
    /** Do'konlar (savdo faoliyatlari) ro'yxati — tanlash modali uchun */
    async loadFaoliyatlar() {
      if (this.isXodim) return;
      try {
        const res = await this.$axios.$get('/qarz-daftari/savdo-faoliyat', { silent: true });
        // Array.isArray sharti MUHIM: so'rov yiqilsa saqlangan tanlov o'chib ketmasin
        if (res?.success && Array.isArray(res.data)) {
          this.faoliyatlar = res.data;
          this.restoreDokonTanlovi();
        }
      } catch (_) {}
    },
    /** localStorage'dagi tanlovni tiklash (mavjud bo'lmagan do'kon → "Barcha do'konlar") */
    restoreDokonTanlovi() {
      let saved = null;
      try { saved = localStorage.getItem(DOKON_LS_KEY); } catch (_) {}
      const mavjud = saved && saved !== 'all' && this.faoliyatlar.some((f) => String(f.id) === String(saved));
      this.selectedDokonId = mavjud ? saved : 'all';
    },
    openDokonModal(turi) {
      this.pendingTuri = turi || null;
      this.showDokonModal = true;
    },
    closeDokonModal() {
      this.showDokonModal = false;
      this.pendingTuri = null;
    },
    /** Do'kon tanlandi — saqlaymiz, modalni yopamiz, kerak bo'lsa qarz sahifasiga o'tamiz */
    selectDokon(id) {
      const value = id === 'all' ? 'all' : String(id);
      this.selectedDokonId = value;
      try { localStorage.setItem(DOKON_LS_KEY, value); } catch (_) {}
      this.showDokonModal = false;
      const turi = this.pendingTuri;
      this.pendingTuri = null;
      // "Barcha do'konlar" tanlanса aniq do'kon yo'q — navigatsiya qilmaymiz
      if (turi && value !== 'all') {
        this.$router.push(this.localePath({ name: `qarz-daftari-faoliyat-id-${turi}`, params: { id: value } }));
      }
    },
    /**
     * "Qarzga berish" / "Qarzga olish" — do'kon oldindan tanlangan bo'lsa
     * to'g'ridan-to'g'ri o'sha do'kon sahifasiga; "Barcha do'konlar" bo'lsa
     * avval do'kon tanlash so'raladi (mobil ilovadagi kabi).
     */
    goTuri(turi) {
      const u = this.$auth?.user;
      const routeName = `qarz-daftari-faoliyat-id-${turi}`;
      if (u && u.is_xodim && u.savdo_faoliyat_id) {
        this.$router.push(this.localePath({ name: routeName, params: { id: u.savdo_faoliyat_id } }));
        return;
      }
      if (this.selectedDokonId && this.selectedDokonId !== 'all') {
        this.$router.push(this.localePath({ name: routeName, params: { id: this.selectedDokonId } }));
        return;
      }
      this.openDokonModal(turi);
    },
    addDokon() {
      this.editingFaoliyat = null;
      this.showFaoliyatModal = true;
    },
    editDokon(f) {
      this.editingFaoliyat = f;
      this.showFaoliyatModal = true;
    },
    closeFaoliyatModal() {
      this.showFaoliyatModal = false;
      this.editingFaoliyat = null;
    },
    async onFaoliyatSaved(response) {
      const wasEdit = !!this.editingFaoliyat;
      this.showFaoliyatModal = false;
      this.editingFaoliyat = null;
      await this.loadFaoliyatlar();
      const f = response?.data || response;
      // Yangi do'kon yaratildi — darhol tanlangan qilamiz
      if (!wasEdit && f?.id) this.selectDokon(f.id);
    },
    /** Xodim sahifasidan o'z hisobiga (egasi sessiyasiga) qaytish */
    async exitXodimDokon() {
      let prev = null;
      try { prev = localStorage.getItem('zx_owner_prev_token'); } catch (_) {}
      try {
        localStorage.removeItem('zx_xodim_session');
        localStorage.removeItem('zx_owner_prev_token');
        localStorage.removeItem('user_balance');
        localStorage.removeItem('user_notifications');
      } catch (_) {}
      if (prev && prev !== 'false' && this.$auth?.setUserToken) {
        try { await this.$auth.setUserToken(prev); } catch (_) {}
      }
      // To'liq reload — egasi DTO (/user/me) qayta yuklanadi.
      // Do'kon tanlash endi shu sahifada (Barcha do'konlar kartasi).
      window.location.assign(this.localePath({ name: 'qarz-daftari' }));
    },
    formatMoney, // SS-AUDIT (2026-09-25): utils/helpers
    /**
     * Million/milliard qisqartirish: 18 116 000 → "18,1 M", 117 085 088 → "117 M", 1 234 → "1 234"
     * Locale-aware: o'zbek/rus uchun verguldan keyin 1 raqam
     */
    formatCompact(n) {
      const v = Number(n) || 0;
      if (v === 0) return '0';
      const abs = Math.abs(v);
      const sign = v < 0 ? '-' : '';
      if (abs >= 1_000_000_000) {
        const r = abs / 1_000_000_000;
        return sign + (r >= 100 ? Math.round(r) : r.toFixed(1).replace('.', ',').replace(/,0$/, '')) + ' B';
      }
      if (abs >= 1_000_000) {
        const r = abs / 1_000_000;
        return sign + (r >= 100 ? Math.round(r) : r.toFixed(1).replace('.', ',').replace(/,0$/, '')) + ' M';
      }
      if (abs >= 10_000) {
        const r = abs / 1_000;
        return sign + (r >= 100 ? Math.round(r) : r.toFixed(1).replace('.', ',').replace(/,0$/, '')) + ' K';
      }
      // 10 000'dan kam — to'liq raqam (ming birlikda)
      return sign + Math.round(abs).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    toggleDrill(section) {
      this.drill = this.drill === section ? null : section;
    },
    /**
     * SS4 (2026-09-20): tanlangan do'kon bo'yicha so'rov parametri.
     * Backend (`qarzDaftari.controller.scopeFaoliyat`) `faoliyat_id` ni o'qiydi va
     * EGALIK/XODIMLIK tekshiruvidan o'tkazadi — begona do'kon id'si jim
     * e'tiborsiz qoldiriladi (IDOR emas). "Barcha do'konlar" = parametr YO'Q.
     */
    dokonParams() {
      const id = this.selectedDokonId;
      return (!id || id === 'all') ? {} : { faoliyat_id: id };
    },
    async loadDashboard() {
      try {
        const res = await this.$axios.$get('/qarz-daftari/dashboard', { params: this.dokonParams(), silent: true });
        if (res?.success) this.dashboard = { ...this.dashboard, ...res.data };
      } catch (_) {}
    },
    async loadNearExpiration() {
      try {
        const res = await this.$axios.$get('/qarz-daftari/near-expiration', { params: this.dokonParams(), silent: true });
        if (res?.success) {
          this.nearDebitor = res.data?.debitor || [];
          this.nearKreditor = res.data?.kreditor || [];
        }
      } catch (_) {}
    },
  },
};
</script>

<style scoped>
/* SS-DEV (2026-09-24): do'kon tanlash chipi — uzun do'kon nomi qisqaradi (truncate) */
.zx-dokon-chip {
  max-width: 100%;
}
@media (min-width: 640px) {
  .zx-dokon-chip { max-width: 380px; } /* SS-DEV (2026-09-26): kattaroq chip */
}

/* SS17 (2026-09-21): "Barcha do'konlar" qatori do'kon nomlaridan ajralib tursin —
   boshqa fon va pastidagi ajratuvchi chiziq. Tailwind v2 da bunday nozik
   rang/ajratgichni klass bilan berish noqulay, shuning uchun CSS. */
.zx-dokon-all {
  background-color: #F8FAFC;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 4px;
}
.zx-dokon-all:hover {
  background-color: #F1F5F9;
}
/* Tanlangan holatda (bg-blue-600) neytral fon ustun kelmasin */
.zx-dokon-all.bg-blue-600 {
  background-color: #2563EB;
  border-bottom-color: #2563EB;
}

.fade-slide-enter-active {
  transition: all 0.3s ease;
}
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
