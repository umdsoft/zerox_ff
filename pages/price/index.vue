<template>
  <div class="pb-8" :class="isGuest ? 'zx-price-guest' : ''">
    <!-- SS-DEV (2026-09-24): TARIFLAR ENDI OMMAVIY (15-rasm) — login qilmagan mehmon ham
         ko'ra oladi. Mehmon uchun default layout yon menyu/sarlavhasiz `<Nuxt/>` beradi,
         shu sabab bu yerda ixcham mehmon sarlavhasi (logo, Bosh sahifa, Kirish, Ro'yxatdan
         o'tish) ko'rsatiladi. Sotib olish tugmalari mehmonni login sahifasiga yo'naltiradi. -->
    <nav v-if="isGuest" class="bg-white border-b border-gray-100 mb-6">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <nuxt-link :to="localePath({ name: 'index' })" class="flex-shrink-0 flex items-center">
          <img v-if="$i18n.locale == 'ru'" src="@/assets/img/logo_ru.svg" alt="ZeroX" class="h-9" />
          <img v-else-if="$i18n.locale == 'kr'" src="@/assets/img/logo_kr.svg" alt="ZeroX" class="h-9" />
          <img v-else src="@/assets/img/logo.svg" alt="ZeroX" class="h-9" />
        </nuxt-link>
        <div class="flex items-center gap-2 sm:gap-4">
          <nuxt-link :to="localePath({ name: 'index' })" class="hidden sm:inline text-sm font-medium text-gray-600 hover:text-blue-600">{{ texts.guestHome }}</nuxt-link>
          <nuxt-link :to="localePath({ name: 'auth-login' })" class="text-sm font-semibold text-blue-600 hover:text-blue-700 px-2">{{ texts.guestLogin }}</nuxt-link>
          <nuxt-link :to="localePath({ name: 'auth-register' })" class="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">{{ texts.guestRegister }}</nuxt-link>
        </div>
      </div>
    </nav>

    <!-- Header -->
    <div class="text-center mb-8 mt-4">
      <h1 class="text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
      <p v-if="isGuest" class="mt-2 text-sm text-gray-400">{{ texts.guestHint }}</p>
    </div>

    <!-- Joriy holat: tarif + SMS balansi (faqat kirgan foydalanuvchi) -->
    <div v-if="!isGuest" class="max-w-5xl mx-auto px-4 mb-10">
      <!-- 29.09: tarif muddati tugamoqda / tugagan — foydalanuvchi bexabar qolmasin -->
      <PriceExpiryAlert v-if="expiryAlert" class="mb-4" :expiry-alert="expiryAlert" @renew="purchasePlan" />
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <!-- Joriy tarif -->
          <div class="flex items-center gap-3 flex-shrink-0">
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', currentPlan === 'premium' ? 'bg-purple-100 text-purple-600' : currentPlan === 'start' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500']">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500">{{ texts.currentPlan }}</p>
              <p class="text-lg font-bold text-gray-900">{{ planLabel }}</p>
            </div>
          </div>

          <!-- SMS balansi progress -->
          <div class="flex-1 md:max-w-md w-full">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm font-medium text-gray-700">{{ texts.smsBalance }}</span>
              <span :class="['text-sm font-bold', smsWarning ? 'text-red-600' : 'text-gray-900']">
                {{ (smsRemaining || 0) }} <span class="text-gray-400 font-normal">/ {{ smsTotal || 0 }}</span>
              </span>
            </div>
            <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                :class="['h-full rounded-full transition-all duration-500', smsWarning === 'empty' || smsWarning === 'critical' ? 'bg-red-500' : smsWarning === 'low' ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600']"
                :style="{ width: smsPercent + '%' }"
              ></div>
            </div>
            <p class="text-xs mt-1.5" :class="smsWarning ? 'text-red-500 font-medium' : 'text-gray-400'">
              {{ smsHint }}
            </p>
            <!-- SMS xabarlar tarixi tugmasi -->
            <div class="mt-3 flex items-center gap-2 flex-wrap">
              <button
                type="button"
                @click="openSmsHistory"
                class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                {{ texts.smsHistoryBtn }}
              </button>
              <!-- 30.10: "Batafsil" — yuborilgan BARCHA SMS xabarlar alohida sahifada (/price/sms) -->
              <nuxt-link
                :to="localePath({ name: 'price-sms' })"
                class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                {{ texts.smsDetailsBtn }}
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </nuxt-link>
            </div>
          </div>
        </div>
        <!-- 29.09: tarif muddati — ulangan va tugash sanasi (tarif 1 oy amal qiladi) -->
        <div v-if="hasPaidPeriod" class="mt-5 pt-5 border-t border-gray-100">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-semibold text-gray-700">{{ texts.periodTitle }}</p>
            <p class="text-xs text-gray-400">{{ texts.monthNote }}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="rounded-xl bg-gray-50 px-4 py-3">
              <p class="text-xs text-gray-500">{{ texts.periodStart }}</p>
              <p class="text-base font-bold text-gray-900 tabular-nums">{{ fmtDate(subStart) }}</p>
            </div>
            <div class="rounded-xl px-4 py-3" :class="subExpiringSoon ? 'bg-amber-50' : 'bg-gray-50'">
              <p class="text-xs text-gray-500">{{ texts.periodEnd }}</p>
              <p class="text-base font-bold tabular-nums" :class="subExpiringSoon ? 'text-amber-700' : 'text-gray-900'">{{ subEnd ? fmtDate(subEnd) : texts.unlimited }}</p>
            </div>
            <div class="rounded-xl px-4 py-3" :class="subExpiringSoon ? 'bg-amber-50' : 'bg-green-50'">
              <p class="text-xs text-gray-500">{{ texts.remainingLabel }}</p>
              <p class="text-base font-bold" :class="subExpiringSoon ? 'text-amber-700' : 'text-green-700'">{{ daysLeftText }}</p>
            </div>
          </div>
          <div v-if="periodPercent !== null" class="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" :class="subExpiringSoon ? 'bg-amber-500' : 'bg-green-500'" :style="{ width: periodPercent + '%' }"></div>
          </div>
          <!-- 30.09: tarif SMS'lari keyingi oyga o'tmaydi — davr oxirida kuyadi -->
          <p class="mt-3 text-xs text-gray-500 leading-snug">{{ smsBurnText }}</p>
        </div>
        <!-- 30.10: SMS boshqaruvi + foydalanish ko'rsatkichi — Tariflarga kirilganda HAR DOIM ko'rinadi (pullik emas) -->
        <div id="sms" ref="smsManager" class="mt-5 pt-5 border-t border-gray-100">
          <FinanceSmsManager />
        </div>
      </div>
    </div>

    <!-- SMS XABARLAR TARIXI MODAL -->
    <PriceSmsHistoryModal
      v-if="smsHistoryOpen"
      :texts="texts"
      :sms-history-loading="smsHistoryLoading"
      :sms-cats="smsCats"
      :sms-total-sent="smsTotalSent"
      @close="closeSmsHistory"
      @open-cat="openSmsCat"
    />

    <!-- 30.10: KATEGORIYA SMS RO'YXATI — orqa fon blur -->
    <PriceSmsCategoryModal v-if="smsCatOpen" :sms-cat-open="smsCatOpen" @close="closeSmsCat" />

    <!-- TARIF SOTIB OLISH TASDIQLASH MODAL — Mobil hisob balansidan to'lash -->
    <PricePlanConfirmModal
      v-if="planConfirmTarget"
      :texts="texts"
      :plan-confirm-target="planConfirmTarget"
      :purchase-loading="purchaseLoading"
      :balance-sufficient="balanceSufficient"
      :user-balance="userBalance"
      :balance-shortfall="balanceShortfall"
      :plan-confirm-period="planConfirmPeriod"
      @close="closePlanConfirm"
      @confirm="confirmPlanPurchase"
      @topup="openTopupFromConfirm"
    />

    <!-- TO'LOV USULI MODAL — Click (birinchi) / Payme (ikkinchi). Top-up + SMS addon uchun. -->
    <PricePaymentModal
      v-if="paymentTarget"
      :texts="texts"
      :payment-target-label="paymentTargetLabel"
      :payment-loading="paymentLoading"
      :payment-method="paymentMethod"
      @close="closePayment"
      @choose="choosePayment"
    />

    <!-- ==================== QARZ DAFTARI TARIFLARI ==================== -->
    <div class="max-w-5xl mx-auto px-4 mb-5">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ texts.daftariSectionTitle }}</h2>
          <p class="text-sm text-gray-500">{{ texts.daftariSectionDesc }}</p>
        </div>
      </div>
    </div>

    <!-- Tarif kartochkalari -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">

      <!-- FREE -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div class="p-6 flex-1">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full uppercase">Free</span>
            <div class="mt-4">
              <span class="text-4xl font-bold text-gray-900">0</span>
              <span class="text-gray-500 ml-1">UZS</span>
            </div>
                      </div>

          <ul class="mt-6 space-y-3">
            <li v-for="(f, i) in plansShared[0].items" :key="i" class="flex items-start gap-3" :class="f.on ? '' : 'opacity-40'">
              <svg v-if="f.on" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm" :class="f.on ? 'text-gray-700' : 'text-gray-400 line-through'">{{ f.text }}</span>
            </li>
          </ul>
        </div>

        <!-- SS-DEV (2026-09-24): "Joriy tarif" tugmasi OLIB TASHLANDI (9-rasm). -->
      </div>

      <!-- START -->
      <div class="bg-white rounded-2xl shadow-lg border-2 border-blue-500 overflow-hidden flex flex-col relative">
        <div class="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-wide">
          {{ plansShared[1].popularText }}
        </div>
        <div class="p-6 pt-10 flex-1">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase">Start</span>
            <div class="mt-4">
              <span class="text-4xl font-bold text-gray-900">99 000</span>
              <span class="text-gray-500 ml-1">UZS {{ texts.perMonth }}</span>
            </div>
                      </div>

          <ul class="mt-6 space-y-3">
            <li v-for="(f, i) in plansShared[1].items" :key="i" class="flex items-start gap-3" :class="f.on ? '' : 'opacity-40'">
              <svg v-if="f.on" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm" :class="f.on ? 'text-gray-700' : 'text-gray-400 line-through'">{{ f.text }}</span>
            </li>
          </ul>
        </div>

        <!-- 29.09: "Ulanish" tugmasi QAYTARILDI — 24.09 da (9-rasm) olib tashlangani sababli Start/Premium'ga
             ulanib bo'lmay qolgandi. Joriy tarif bo'lsa — muddatni uzaytirish (+1 oy). -->
        <div class="p-6 pt-0">
          <p v-if="isActivePlan('start') && subEnd" class="text-xs text-center text-green-700 font-medium mb-2">{{ texts.currentPlanBtn }} · {{ fmtDate(subEnd) }} {{ texts.activeUntil }}</p>
          <button
            v-if="currentPlan === 'premium'"
            type="button"
            disabled
            class="w-full py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-default"
          >{{ texts.hasHigherPlan }}</button>
          <button
            v-else
            type="button"
            @click="purchasePlan('start')"
            :disabled="purchaseLoading"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >{{ isActivePlan('start') ? texts.renewBtn : texts.buyBtn }}</button>
        </div>
      </div>

      <!-- PREMIUM -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div class="p-6 flex-1">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full uppercase">Premium</span>
            <div class="mt-4">
              <span class="text-4xl font-bold text-gray-900">199 000</span>
              <span class="text-gray-500 ml-1">UZS {{ texts.perMonth }}</span>
            </div>
                      </div>

          <ul class="mt-6 space-y-3">
            <li v-for="(f, i) in plansShared[2].items" :key="i" class="flex items-start gap-3" :class="f.on ? '' : 'opacity-40'">
              <svg v-if="f.on" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm" :class="f.on ? 'text-gray-700' : 'text-gray-400 line-through'">{{ f.text }}</span>
            </li>
          </ul>
        </div>

        <!-- 29.09: "Ulanish" tugmasi QAYTARILDI (Start bilan bir xil oqim) -->
        <div class="p-6 pt-0">
          <p v-if="isActivePlan('premium') && subEnd" class="text-xs text-center text-green-700 font-medium mb-2">{{ texts.currentPlanBtn }} · {{ fmtDate(subEnd) }} {{ texts.activeUntil }}</p>
          <button
            type="button"
            @click="purchasePlan('premium')"
            :disabled="purchaseLoading"
            class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >{{ isActivePlan('premium') ? texts.renewBtn : texts.buyBtn }}</button>
        </div>
      </div>
    </div>

    <!-- Qo'shimcha SMS paketlar -->
    <div v-if="currentPlan === 'start' || currentPlan === 'premium'" class="max-w-5xl mx-auto px-4 mt-12">
      <h2 class="text-xl font-bold text-gray-900 mb-4 text-center">{{ texts.addonTitle }}</h2>
      <p class="text-sm text-gray-500 text-center mb-6">{{ texts.addonDesc }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-for="pkg in addonPackages" :key="pkg.name"
          class="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md transition-shadow">
          <div class="text-2xl font-bold text-gray-900">{{ pkg.sms }}</div>
          <div class="text-sm text-gray-500 mb-3">SMS</div>
          <div class="text-lg font-semibold text-blue-600 mb-4">{{ formatPrice(pkg.price) }} UZS</div>
          <button
            @click="purchaseAddon(pkg.name)"
            :disabled="purchasing"
            class="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {{ texts.buyAddon }}
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== QARZ SHARTNOMASI TARIFLARI ==================== -->
    <div class="max-w-5xl mx-auto px-4 mt-14">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ texts.contractSectionTitle }}</h2>
          <p class="text-sm text-gray-500">{{ texts.contractSectionDesc }}</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <!-- 1) Bepul shartnomalar (birinchi, yashilda) -->
          <div class="p-6">
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <p class="text-2xl font-bold text-green-600">{{ texts.contractFullyFree }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ texts.contractFreeForAll }}</p>
          </div>
          <!-- 2) Shartnoma narxi — 3 tier ro'yxat (0.1% alohida ko'rsatilmaydi) -->
          <div class="p-6">
            <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <p class="text-sm font-semibold text-gray-900 mb-2">{{ texts.contractPriceTitle }}</p>
            <ul class="space-y-1 text-sm text-gray-700">
              <li class="flex items-start gap-2">
                <span class="text-indigo-500 mt-1">•</span>
                <span><span class="text-gray-500">1 mln so'mgacha —</span> <span class="font-semibold">1 000 UZS</span></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-500 mt-1">•</span>
                <span><span class="text-gray-500">1 mln dan 100 mln so'mgacha —</span> <span class="font-semibold">0.1%</span></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-indigo-500 mt-1">•</span>
                <span><span class="text-gray-500">100 mln so'mdan ortiq —</span> <span class="font-semibold">100 000 UZS</span></span>
              </li>
            </ul>
          </div>
        </div>
        <!-- SS-DEV (2026-09-24): "Hisobni to'ldirish" tugmasi OLIB TASHLANDI (9-rasm). -->
        <div class="bg-indigo-50 px-6 py-4">
          <p class="text-sm text-indigo-800">{{ texts.contractPayFrom }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSubscription, purchasePlanFromBalance, purchaseAddonFromBalance, getSubscriptionSmsStats, postPaymentCreateSmsPackage } from '@/api/billing';
import { getMe } from '@/api/user';
import { getPlans } from '~/utils/pricingPlans';
import { poolLine } from '~/utils/smsHistory';
import { groupThousands } from '~/utils/format';
import PriceExpiryAlert from '~/components/price/PriceExpiryAlert.vue';
import PriceSmsHistoryModal from '~/components/price/PriceSmsHistoryModal.vue';
import PriceSmsCategoryModal from '~/components/price/PriceSmsCategoryModal.vue';
import PricePlanConfirmModal from '~/components/price/PricePlanConfirmModal.vue';
import PricePaymentModal from '~/components/price/PricePaymentModal.vue';
import { getPriceTexts } from '~/utils/priceTexts';
import {
  planPurchaseTarget, addonPurchaseTarget, topupAmountForShortfall, isValidTopup,
  topupReturnUrl, buildClickTopupUrl, buildPaymeTopupUrl, isSafePaymentUrl, toDate, fmtTariffDate, addOneMonth,
} from '~/utils/priceCheckout';

export default {
  // SS-DEV (2026-09-24): `middleware: 'auth'` OLIB TASHLANDI — sahifa ommaviy (mehmon ham ko'radi).
  auth: false,
  components: {
    // 30.10: SMS boshqaruvi — Tariflarda doim ko'rinadi
    FinanceSmsManager: () => import('~/components/finance/SmsManager.vue'),
    PriceExpiryAlert,
    PriceSmsHistoryModal,
    PriceSmsCategoryModal,
    PricePlanConfirmModal,
    PricePaymentModal,
  },

  data() {
    return {
      currentPlan: 'free',
      // 29.09: tarif muddati (GET /finance/subscription → subscription.start_date/end_date)
      subStart: null,
      subEnd: null,
      subDaysLeft: null,
      subExpiringSoon: false,
      previousSub: null, // yaqinda tugagan pullik tarif { plan, start_date, end_date }
      smsRemaining: null,
      smsTotal: 0,
      smsUsed: 0,
      // Haqiqiy yuborilgan SMS soni (sms_history, status='sent') — "Jami yuborilgan" shu
      // raqamni ko'rsatadi (paket used_sms billing hisoblagichi emas), tarix modali bilan mos.
      smsSent: 0,
      smsWarning: null,
      // 30.09: amaldagi tarif SMS qoldig'i va eng yaqin kuyish (sms.plan_remaining / expires_at / expiring_count)
      smsPlanRemaining: null,
      smsBurnAt: null,
      smsBurnCount: 0,
      purchasing: false,
      // SMS xabarlar tarixi modali
      smsHistoryOpen: false,
      smsHistoryLoading: false,
      smsHistoryStats: { registration: 0, auto: 0, manual: 0, qarz_tolandi: 0 },
      smsByTypePool: {}, // 30.10: sms-stats.by_type_pool
      smsCatOpen: null, // 30.10: tanlangan kategoriya (blur modal) — { type, label }
      // Tarif sotib olish tasdiqlash modali — Mobil hisob balansidan to'lash
      planConfirmTarget: null,  // { plan, price, smsCount, label }
      purchaseLoading: false,
      // To'lov usuli (Click/Payme) modali — top-up va SMS addon uchun
      paymentTarget: null,   // { kind:'topup'|'addon', amount?, key?, price?, label }
      paymentMethod: null,
      paymentLoading: false,
      addonPackages: [
        { name: 'small', sms: 100, price: 21000 },
        { name: 'medium', sms: 200, price: 40000 },
        { name: 'large', sms: 300, price: 57000 },
      ],
    };
  },

  computed: {
    // SS-DEV (2026-09-24): mehmon rejimi (login qilinmagan)
    isGuest() { return !(this.$auth && this.$auth.loggedIn); },
    smsCats() {
      const t = this.texts;
      const cats = [
        { type: 'registration', label: t.smsCatRegistration, count: this.smsHistoryStats.registration || 0, bgClass: 'bg-blue-50', borderClass: 'border-blue-200', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', numColor: 'text-blue-700', iconPath: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
        { type: 'auto', label: t.smsCatAuto, count: this.smsHistoryStats.auto || 0, bgClass: 'bg-amber-50', borderClass: 'border-amber-200', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', numColor: 'text-amber-700', iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { type: 'manual', label: t.smsCatManual, count: this.smsHistoryStats.manual || 0, bgClass: 'bg-red-50', borderClass: 'border-red-200', iconBg: 'bg-red-100', iconColor: 'text-red-600', numColor: 'text-red-700', iconPath: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
        { type: 'qarz_tolandi', label: t.smsCatTolandi, count: this.smsHistoryStats.qarz_tolandi || 0, bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', numColor: 'text-emerald-700', iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
      ];
      // To'lov havolasi — alohida kategoriya (bor bo'lsa)
      if (this.smsHistoryStats.payment_link > 0) {
        cats.push({ type: 'payment_link', label: t.smsCatPaymentLink, count: this.smsHistoryStats.payment_link, bgClass: 'bg-indigo-50', borderClass: 'border-indigo-200', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', numColor: 'text-indigo-700', iconPath: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' });
      }
      // "Boshqa" — 4 asosiy + payment_link'dan tashqari barcha turlar (legacy bo'sh/NULL ham).
      // Shu bilan ko'rsatilgan kategoriyalar yig'indisi jami "yuborilgan" son bilan MOS keladi.
      if (this.smsOtherCount > 0) {
        cats.push({ type: 'other', label: t.smsCatOther, count: this.smsOtherCount, bgClass: 'bg-gray-50', borderClass: 'border-gray-200', iconBg: 'bg-gray-100', iconColor: 'text-gray-600', numColor: 'text-gray-700', iconPath: 'M4 6h16M4 12h16M4 18h16' });
      }
      // 30.10: har kategoriyada "Tarif X · Paket Y" (by_type_pool bo'lsa)
      return cats.map((c) => ({ ...c, poolLine: this.catPoolLine(c.type) }));
    },
    // Nomsiz/boshqa turdagi (payment_link va 4 asosiydan tashqari) yuborilgan SMS soni
    smsOtherCount() {
      const s = this.smsHistoryStats || {};
      const known = ['registration', 'auto', 'manual', 'qarz_tolandi', 'payment_link'];
      return Object.keys(s).reduce((sum, k) => (known.includes(k) ? sum : sum + (Number(s[k]) || 0)), 0);
    },
    // Jami yuborilgan = BARCHA turlar yig'indisi (kategoriyalar yig'indisiga TENG)
    smsTotalSent() {
      const s = this.smsHistoryStats || {};
      return Object.keys(s).reduce((sum, k) => sum + (Number(s[k]) || 0), 0);
    },
    texts() {
      return getPriceTexts(this.$i18n?.locale || 'uz');
    },

    /*
     * Faqat tizimda haqiqatda ishlaydigan funksiyalar ro'yxatga olinadi.
     * Free: qarz qo'shish + to'lov qayd etish + ro'yxatga olish SMS (100 ta limit).
     *       Avtomatik/qo'lda SMS va SMS tarixi — chiziq tortilgan (yo'q).
     * Start/Premium: barcha SMS funksiyalari (faqat SMS soni farq qiladi).
     */
    // SS-DEV (2026-09-24): tarif xususiyatlari `utils/pricingPlans.js` dan — landing
    // sahifasidagi #pricing bo'limi bilan AYNAN bir xil ma'lumot.
    plansShared() {
      // Mobil ilova bilan bir xil bir tekis ro'yxat (utils/pricingPlans.js, variant 'tariffs')
      return getPlans(this.$i18n?.locale || 'uz', 'tariffs');
    },
    // 29.09: pullik tarif muddati bloki ko'rsatiladimi
    /** 30.09: "{n} ta tarif SMS {date} kuni kuyadi" yoki umumiy eslatma */
    smsBurnText() {
      const t = this.texts;
      if (this.smsBurnAt && this.smsBurnCount > 0) {
        return t.smsBurnNote.replace('{n}', this.smsBurnCount).replace('{date}', this.fmtDate(this.smsBurnAt));
      }
      return t.smsNoRolloverNote;
    },
    hasPaidPeriod() {
      return !this.isGuest && this.currentPlan !== 'free' && Boolean(this.subStart);
    },
    daysLeftText() {
      if (!this.subEnd) return this.texts.unlimited;
      const n = Number(this.subDaysLeft);
      if (!Number.isFinite(n)) return '—';
      if (n <= 0) return this.texts.lastDay;
      return this.texts.daysLeft.replace('{n}', n);
    },
    // Muddatning qolgan qismi (%) — progress chizig'i uchun
    periodPercent() {
      const start = this.toDate(this.subStart);
      const end = this.toDate(this.subEnd);
      if (!start || !end || end <= start) return null;
      const left = end.getTime() - Date.now();
      return Math.max(0, Math.min(100, Math.round((left / (end.getTime() - start.getTime())) * 100)));
    },
    // Ogohlantirish: faol tarif tugashiga oz qoldi YOKI yaqinda tugagan
    expiryAlert() {
      if (this.isGuest) return null;
      const t = this.texts;
      const label = (p) => (p === 'premium' ? 'Premium' : 'Start');
      if (this.currentPlan !== 'free' && this.subExpiringSoon && this.subEnd) {
        return {
          kind: 'soon',
          plan: this.currentPlan,
          title: t.expiringTitle,
          text: t.expiringText.replace('{plan}', label(this.currentPlan)).replace('{date}', this.fmtDate(this.subEnd)).replace('{n}', this.subDaysLeft || 0),
          btn: t.renewBtn,
        };
      }
      if (this.currentPlan === 'free' && this.previousSub && this.previousSub.end_date) {
        return {
          kind: 'expired',
          plan: this.previousSub.plan === 'premium' ? 'premium' : 'start',
          title: t.expiredTitle,
          text: t.expiredText.replace('{plan}', label(this.previousSub.plan)).replace('{date}', this.fmtDate(this.previousSub.end_date)),
          btn: t.resubscribeBtn,
        };
      }
      return null;
    },
    // Tasdiqlash modalidagi amal qilish muddati (backend computeNewPeriod bilan bir xil qoida)
    planConfirmPeriod() {
      const target = this.planConfirmTarget;
      if (!target || target.kind === 'addon') return null;
      const now = new Date();
      const currentEnd = this.toDate(this.subEnd);
      const sameActive = target.plan === this.currentPlan && Boolean(currentEnd) && currentEnd > now;
      // 30.09: tarif SMS'lari tugagan bo'lsa — yangi muddat bugundan (navbatdagi davr qisqarmaydi)
      if (sameActive && this.smsPlanRemaining !== null && this.smsPlanRemaining <= 0) {
        const fromToday = this.addOneMonth(now);
        return { start: now, end: currentEnd > fromToday ? currentEnd : fromToday, extended: false, restarted: true };
      }
      return { start: now, end: this.addOneMonth(sameActive ? currentEnd : now), extended: sameActive, restarted: false };
    },
    planLabel() {
      if (this.currentPlan === 'start') return 'Start';
      if (this.currentPlan === 'premium') return 'Premium';
      return 'Free';
    },
    paymentTargetLabel() {
      if (!this.paymentTarget) return '';
      if (this.paymentTarget.kind === 'topup') {
        return `${this.texts.payTopupPrefix} ${this.formatPrice(this.paymentTarget.amount)} UZS`;
      }
      return `${this.texts.payAddonPrefix} ${this.paymentTarget.label}`;
    },
    userBalance() {
      return Number(this.$auth?.user?.balance) || 0;
    },
    balanceSufficient() {
      if (!this.planConfirmTarget) return false;
      return this.userBalance >= this.planConfirmTarget.price;
    },
    balanceShortfall() {
      if (!this.planConfirmTarget) return 0;
      return Math.max(0, this.planConfirmTarget.price - this.userBalance);
    },
    smsPercent() {
      const total = Number(this.smsTotal) || 0;
      if (total <= 0) return 0;
      const rem = Number(this.smsRemaining) || 0;
      return Math.max(0, Math.min(100, Math.round((rem / total) * 100)));
    },
    smsHint() {
      const t = this.texts;
      if (this.currentPlan === 'free') return t.smsHintFree;
      if (this.smsWarning === 'empty') return t.smsHintEmpty;
      if (this.smsWarning === 'critical') return t.smsHintCritical;
      if (this.smsWarning === 'low') return t.smsHintLow;
      return t.smsHintOk.replace('{used}', this.smsSent || 0);
    },
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.onSmsKey);
  },

  async mounted() {
    window.addEventListener('keydown', this.onSmsKey);
    // SS-DEV (2026-09-24): mehmon — obuna/balans so'rovlari YO'Q (401 bo'lardi), faqat narxlar.
    if (this.isGuest) return;
    // SS-DEV (2026-09-29): ofertani tasdiqlamagan foydalanuvchi endi universal_contract'ga majburan
    // yo'naltirilmaydi — oferta faqat qarz shartnomasi AMALIDA so'raladi (plugins/oferta-gate.client.js).
    await this.loadSubscription();
    // SS-DEV (2026-09-26), 13-band: /finance/sms → /price#sms — blok ochiq holda ko'rsatiladi
    // /finance/sms → /price#sms: blok endi doim ochiq — faqat shu joyga o'tkazamiz
    if (typeof window !== 'undefined' && window.location.hash === '#sms') this.scrollToSmsManager();
  },

  methods: {
    /** /price#sms — SMS boshqaruvi blokiga scroll (blok doim ko'rinadi) */
    scrollToSmsManager() {
      this.$nextTick(() => {
        const el = this.$refs.smsManager;
        if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    /** 29.09: tarif sanasi — 29.09.2026 */
    fmtDate(value) {
      return fmtTariffDate(value);
    },
    toDate(value) {
      return toDate(value);
    },
    /** +1 kalendar oy (oy oxiri qisqartiriladi) — backend utils/subscriptionPeriod.addOneMonth bilan bir xil */
    addOneMonth(value) {
      return addOneMonth(value);
    },
    /** Joriy (muddati o'tmagan) tarif shumi */
    isActivePlan(plan) {
      return !this.isGuest && this.currentPlan === plan;
    },
    formatPrice(n) {
      return groupThousands(n);
    },

    async loadSubscription() {
      try {
        const res = await getSubscription(this.$axios, { silent: true });
        if (res?.success) {
          const sub = res.data.subscription || {};
          this.currentPlan = sub.plan;
          // 29.09: tarif muddati
          this.subStart = sub.start_date || null;
          this.subEnd = sub.end_date || null;
          this.subDaysLeft = sub.days_left != null ? Number(sub.days_left) : null;
          this.subExpiringSoon = Boolean(sub.expiring_soon);
          this.previousSub = res.data.previous || null;
          this.smsRemaining = res.data.sms.remaining;
          this.smsTotal = res.data.sms.total || 0;
          this.smsUsed = res.data.sms.used || 0;
          this.smsSent = res.data.sms_sent_count || 0;
          this.smsWarning = res.data.sms.warning || null;
          this.smsPlanRemaining = res.data.sms.plan_remaining != null ? Number(res.data.sms.plan_remaining) : null;
          this.smsBurnAt = res.data.sms.expires_at || null;
          this.smsBurnCount = Number(res.data.sms.expiring_count) || 0;
        }
      } catch (_) {}
    },

    /**
     * Tarif sotib olish — Mobil hisob balansidan to'lov.
     * 1) Tasdiqlash modali ochiladi (balansni ko'rsatish).
     * 2) Yetarli balans → /finance/subscription/purchase-from-balance.
     * 3) Yetarli emas → "Mobil hisobni to'ldirish" tugmasi orqali top-up modaliga.
     */
    // SS-DEV (2026-09-24): mehmon sotib olishga urinsa — login sahifasiga.
    guestToLogin() {
      if (!this.isGuest) return false;
      this.$router.push(this.localePath({ name: 'auth-login' }));
      return true;
    },
    purchasePlan(plan) {
      if (this.guestToLogin()) return;
      this.planConfirmTarget = planPurchaseTarget(plan);
    },

    closePlanConfirm() {
      if (this.purchaseLoading) return;
      this.planConfirmTarget = null;
    },

    async confirmPlanPurchase() {
      if (!this.planConfirmTarget || this.purchaseLoading) return;
      if (!this.balanceSufficient) {
        this.$toast?.error(this.texts.insufficientHint);
        return;
      }
      const isAddon = this.planConfirmTarget.kind === 'addon';
      this.purchaseLoading = true;
      try {
        const res = isAddon
          ? await purchaseAddonFromBalance(this.$axios, { package_name: this.planConfirmTarget.packageName }, { silent: true })
          : await purchasePlanFromBalance(this.$axios, { plan: this.planConfirmTarget.plan }, { silent: true });
        if (res.data?.success) {
          const endDate = !isAddon && res.data?.data?.end_date ? ` (${this.fmtDate(res.data.data.end_date)} ${this.texts.activeUntil})` : '';
          this.$toast?.success(
            isAddon
              ? `${this.planConfirmTarget.label} ${this.texts.addonAdded}`
              : `${this.planConfirmTarget.label} ${this.texts.planActivated}${endDate}`,
          );
          this.planConfirmTarget = null;
          await this.loadSubscription();
          // $auth.user.balance ni yangilash — /user/me orqali (eng ishonchli yo'l;
          // har xil @nuxtjs/auth versiyalarida ham ishlaydi)
          try {
            const me = await getMe(this.$axios, { silent: true });
            if (me?.success && this.$auth?.setUser) this.$auth.setUser(me.data);
          } catch (_) {}
        } else {
          this.$toast?.error(res.data?.message || 'Xatolik');
        }
      } catch (e) {
        const code = e.response?.data?.code;
        if (code === 'insufficient-balance') {
          this.$toast?.error(e.response?.data?.message || this.texts.insufficientHint);
        } else {
          this.$toast?.error(e.response?.data?.message || 'Xatolik yuz berdi');
        }
      } finally {
        this.purchaseLoading = false;
      }
    },

    /** Tasdiqlash modalidan top-up modaliga o'tish */
    openTopupFromConfirm() {
      if (!this.planConfirmTarget) return;
      const amount = topupAmountForShortfall(this.balanceShortfall);
      this.paymentTarget = { kind: 'topup', amount, label: this.texts.topUpBtn };
    },

    /** Qo'shimcha SMS paketi sotib olish — Mobil hisob balansidan (tarif bilan bir xil oqim) */
    purchaseAddon(packageName) {
      if (this.guestToLogin()) return;
      const pkg = this.addonPackages.find((p) => p.name === packageName);
      if (!pkg) return;
      this.planConfirmTarget = addonPurchaseTarget(pkg);
    },

    closePayment() {
      if (this.paymentLoading) return;
      this.paymentTarget = null;
      this.paymentMethod = null;
    },

    async choosePayment(method) {
      if (!this.paymentTarget || this.paymentLoading) return;
      this.paymentMethod = method;

      // TOP-UP — Mobil hisobni to'ldirish (Click/Payme to'g'ridan-to'g'ri URL).
      // /pages/mobil-hisob/index.vue dagi eventClick/eventPayme bilan AYNAN
      // bir xil format ishlatamiz (u yerda Click/Payme ishlashi tasdiqlangan):
      //   - return_url ENCODE qilinmaydi (raw URL)
      //   - return_url joriy domen origin'idan olinadi — test.zerox.uz dan
      //     to'lagan user test.zerox.uz/price ga qaytadi (Payme cancel'da ham)
      if (this.paymentTarget.kind === 'topup') {
        const uid = this.$auth?.user?.uid;
        const amount = Number(this.paymentTarget.amount) || 0;
        if (!isValidTopup(uid, amount)) {
          this.$toast?.error("Noto'g'ri ma'lumotlar");
          return;
        }
        const origin = (typeof window !== 'undefined' && window.location?.origin) || 'https://zerox.uz';
        const returnUrl = topupReturnUrl(origin);
        // mobil-hisob eventClick / eventPayme formatlari bilan AYNI (utils/priceCheckout.js)
        window.location.href = method === 'click'
          ? buildClickTopupUrl({ uid, amount, returnUrl })
          : buildPaymeTopupUrl({ uid, amount, returnUrl });
        return;
      }

      // ADDON — Qo'shimcha SMS paketi (backend create-sms-package endpointi)
      this.paymentLoading = true;
      try {
        const res = await postPaymentCreateSmsPackage(this.$axios, {
          package_name: this.paymentTarget.key,
          payment_method: method,
        }, { silent: true });
        // SS-SEC (2026-09-25): to'lov havolasi faqat https bo'lsa ochiladi
        if (res.data?.success && isSafePaymentUrl(res.data.data?.payment_url)) {
          window.location.href = res.data.data.payment_url;
          return;
        }
        this.$toast?.error(res.data?.message || 'Xatolik');
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik yuz berdi');
      } finally {
        this.paymentLoading = false;
      }
    },

    async openSmsHistory() {
      if (this.guestToLogin()) return;
      this.smsHistoryOpen = true;
      this.smsHistoryLoading = true;
      try {
        const res = await getSubscriptionSmsStats(this.$axios, { silent: true });
        if (res?.success) {
          const byType = res.data.by_type || {};
          // 30.10: BARCHA kalitlar (payment_link, other, ...) — kategoriyalar yig'indisi used_total ga teng bo'lsin
          const stats = { registration: 0, auto: 0, manual: 0, qarz_tolandi: 0 };
          Object.keys(byType).forEach((k) => { stats[k] = Number(byType[k]) || 0; });
          this.smsHistoryStats = stats;
          // 30.10: tur bo'yicha hovuz taqsimoti { [type]: { plan, package } } — yo'q bo'lsa qator ko'rsatilmaydi
          this.smsByTypePool = res.data.by_type_pool && typeof res.data.by_type_pool === 'object' ? res.data.by_type_pool : {};
        }
      } catch (_) {
        // silent — modal still opens with zeros
      } finally {
        this.smsHistoryLoading = false;
      }
    },

    catPoolLine(type) {
      const e = this.smsByTypePool && this.smsByTypePool[type];
      if (!e || e.plan === undefined) return '';
      return poolLine(this.$t.bind(this), e.plan, e.package);
    },
    closeSmsHistory() {
      this.smsHistoryOpen = false;
      this.smsCatOpen = null;
    },
    openSmsCat(cat) {
      this.smsCatOpen = cat;
    },
    closeSmsCat() {
      this.smsCatOpen = null;
    },
    /** ESC: eng ustki oyna yopiladi (sabab oynasi → kategoriya ro'yxati → tarix) */
    onSmsKey(e) {
      if (e.key !== 'Escape' || !this.smsHistoryOpen) { return; }
      if (document.querySelector('[data-sms-reason-modal]')) { return; } // sabab oynasi o'zi yopadi
      if (this.smsCatOpen) { this.closeSmsCat(); } else { this.closeSmsHistory(); }
    },
  },
};
</script>
