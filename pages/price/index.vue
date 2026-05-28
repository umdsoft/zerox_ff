<template>
  <div class="pb-8">
    <!-- Header -->
    <div class="text-center mb-8 mt-4">
      <h1 class="text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
      <p class="mt-3 text-gray-500 max-w-2xl mx-auto">{{ texts.subtitle }}</p>
    </div>

    <!-- Joriy holat: tarif + SMS balansi -->
    <div class="max-w-5xl mx-auto px-4 mb-10">
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
            <button
              type="button"
              @click="openSmsHistory"
              class="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              {{ texts.smsHistoryBtn }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SMS XABARLAR TARIXI MODAL -->
    <div v-if="smsHistoryOpen" class="qd-modal-overlay" @click.self="closeSmsHistory">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 mx-4">
        <div class="flex items-start justify-between mb-5">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ texts.smsHistoryTitle }}</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ texts.smsHistorySubtitle }}</p>
          </div>
          <button @click="closeSmsHistory" class="text-gray-400 hover:text-gray-600 p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div v-if="smsHistoryLoading" class="text-center py-10">
          <svg class="w-8 h-8 text-blue-500 animate-spin mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        </div>

        <div v-else class="space-y-3">
          <!-- 1) Ro'yxatga olingan qarz uchun -->
          <div class="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ texts.smsCatRegistration }}</span>
            </div>
            <span class="text-xl font-bold text-blue-700 tabular-nums">{{ smsHistoryStats.registration || 0 }}</span>
          </div>
          <!-- 2) Muddati kelgan qarzdorlik yuzasidan -->
          <div class="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ texts.smsCatAuto }}</span>
            </div>
            <span class="text-xl font-bold text-amber-700 tabular-nums">{{ smsHistoryStats.auto || 0 }}</span>
          </div>
          <!-- 3) Qaytarishni talab qilish -->
          <div class="flex items-center justify-between p-4 bg-red-50 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ texts.smsCatManual }}</span>
            </div>
            <span class="text-xl font-bold text-red-700 tabular-nums">{{ smsHistoryStats.manual || 0 }}</span>
          </div>
          <!-- Jami yuborilgan — 3 kategoriyadan alohida ajralib turadi:
               yuqorida separator chiziq, qoraroq fon, kattaroq raqam -->
          <div class="pt-3 mt-2 border-t-2 border-dashed border-gray-200">
            <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl shadow-sm">
              <span class="text-sm font-bold text-white uppercase tracking-wide">{{ texts.smsCatTotal }}</span>
              <span class="text-2xl font-extrabold text-white tabular-nums">{{ (smsHistoryStats.registration || 0) + (smsHistoryStats.auto || 0) + (smsHistoryStats.manual || 0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TARIF SOTIB OLISH TASDIQLASH MODAL — Mobil hisob balansidan to'lash -->
    <div v-if="planConfirmTarget" class="qd-modal-overlay" @click.self="closePlanConfirm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
        <div class="flex items-start justify-between mb-5">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ texts.confirmPurchaseTitle }}</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ texts.payPlanPrefix }} {{ planConfirmTarget.label }}</p>
          </div>
          <button @click="closePlanConfirm" class="text-gray-400 hover:text-gray-600 p-1" :disabled="purchaseLoading">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-3 mb-5">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span class="text-sm text-gray-600">{{ texts.currentBalance }}</span>
            <span :class="['text-base font-bold tabular-nums', balanceSufficient ? 'text-gray-900' : 'text-red-600']">{{ formatPrice(userBalance) }} UZS</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
            <span class="text-sm text-gray-600">{{ texts.tariffPrice }}</span>
            <span class="text-base font-bold text-blue-700 tabular-nums">{{ formatPrice(planConfirmTarget.price) }} UZS</span>
          </div>
          <div v-if="balanceSufficient" class="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <span class="text-sm text-gray-600">{{ texts.afterPurchase }}</span>
            <span class="text-base font-bold text-green-700 tabular-nums">{{ formatPrice(userBalance - planConfirmTarget.price) }} UZS</span>
          </div>
          <div v-else class="flex items-center justify-between p-3 bg-red-50 rounded-xl">
            <span class="text-sm text-gray-600">{{ texts.shortfall }}</span>
            <span class="text-base font-bold text-red-700 tabular-nums">{{ formatPrice(balanceShortfall) }} UZS</span>
          </div>
        </div>

        <p v-if="balanceSufficient" class="text-xs text-gray-500 mb-4 leading-snug">{{ texts.confirmHint }}</p>
        <p v-else class="text-xs text-red-500 mb-4 leading-snug">{{ texts.insufficientHint }}</p>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            @click="closePlanConfirm"
            :disabled="purchaseLoading"
          >{{ texts.cancel }}</button>
          <button
            v-if="balanceSufficient"
            type="button"
            @click="confirmPlanPurchase"
            :disabled="purchaseLoading"
            class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center"
          >
            <svg v-if="purchaseLoading" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ purchaseLoading ? texts.processing : texts.confirmBtn }}
          </button>
          <button
            v-else
            type="button"
            @click="openTopupFromConfirm"
            class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            {{ texts.topUpBtn }}
          </button>
        </div>
      </div>
    </div>

    <!-- TO'LOV USULI MODAL — Click (birinchi) / Payme (ikkinchi). Top-up + SMS addon uchun. -->
    <div v-if="paymentTarget" class="qd-modal-overlay" @click.self="closePayment">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
        <div class="flex items-start justify-between mb-5">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ texts.payTitle }}</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ paymentTargetLabel }}</p>
          </div>
          <button @click="closePayment" class="text-gray-400 hover:text-gray-600 p-1" :disabled="paymentLoading">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="space-y-3">
          <!-- Click (BIRINCHI — user talabiga ko'ra) -->
          <button
            @click="choosePayment('click')"
            :disabled="paymentLoading"
            class="w-full flex items-center gap-4 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-4 transition-all duration-200 hover:shadow-md disabled:opacity-50"
          >
            <div class="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <img src="@/assets/img/click2.png" alt="Click" class="h-8 object-contain" />
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-semibold text-gray-900">Click</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ texts.payViaClick }}</p>
            </div>
            <svg v-if="paymentLoading && paymentMethod === 'click'" class="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>

          <!-- Payme (IKKINCHI) -->
          <button
            @click="choosePayment('payme')"
            :disabled="paymentLoading"
            class="w-full flex items-center gap-4 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-4 transition-all duration-200 hover:shadow-md disabled:opacity-50"
          >
            <div class="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <img src="https://cdn.payme.uz/logo/payme_color.png" alt="Payme" class="h-8 object-contain" />
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-semibold text-gray-900">Payme</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ texts.payViaPayme }}</p>
            </div>
            <svg v-if="paymentLoading && paymentMethod === 'payme'" class="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>

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
            <p class="mt-1 text-sm text-gray-600 font-medium">100 SMS {{ texts.included }}</p>
            <p class="mt-1 text-xs text-gray-400">{{ texts.perSms }}: {{ texts.bepul }}</p>
          </div>

          <ul class="mt-6 space-y-3">
            <li v-for="f in freeFeatures" :key="f" class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm text-gray-700">{{ f }}</span>
            </li>
            <li v-for="f in freeDisabled" :key="f" class="flex items-start gap-3 opacity-40">
              <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm text-gray-400 line-through">{{ f }}</span>
            </li>
          </ul>
        </div>

        <div class="p-6 pt-0">
          <button disabled class="w-full py-3 bg-gray-100 text-gray-500 font-semibold rounded-xl cursor-default">
            {{ currentPlan === 'free' ? texts.currentPlanBtn : texts.freeBtn }}
          </button>
        </div>
      </div>

      <!-- START -->
      <div class="bg-white rounded-2xl shadow-lg border-2 border-blue-500 overflow-hidden flex flex-col relative">
        <div class="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-wide">
          {{ texts.popular }}
        </div>
        <div class="p-6 pt-10 flex-1">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase">Start</span>
            <div class="mt-4">
              <span class="text-4xl font-bold text-gray-900">99 000</span>
              <span class="text-gray-500 ml-1">UZS</span>
            </div>
            <p class="mt-1 text-sm text-blue-600 font-medium">500 SMS {{ texts.included }}</p>
            <p class="mt-1 text-xs text-gray-400">{{ texts.perSms }}: 198 UZS</p>
          </div>

          <ul class="mt-6 space-y-3">
            <li v-for="f in startFeatures" :key="f" class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm text-gray-700">{{ f }}</span>
            </li>
            <li v-for="f in startDisabled" :key="f" class="flex items-start gap-3 opacity-40">
              <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm text-gray-400 line-through">{{ f }}</span>
            </li>
          </ul>
        </div>

        <div class="p-6 pt-0">
          <button
            v-if="currentPlan !== 'start' && currentPlan !== 'premium'"
            @click="purchasePlan('start')"
            :disabled="purchasing"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {{ purchasing ? texts.processing : texts.buyBtn }}
          </button>
          <button v-else-if="currentPlan === 'start'" disabled class="w-full py-3 bg-green-100 text-green-700 font-semibold rounded-xl cursor-default">
            {{ texts.currentPlanBtn }}
          </button>
          <button
            v-else
            disabled
            class="w-full py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-default"
          >
            {{ texts.hasHigherPlan }}
          </button>
        </div>
      </div>

      <!-- PREMIUM -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div class="p-6 flex-1">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full uppercase">Premium</span>
            <div class="mt-4">
              <span class="text-4xl font-bold text-gray-900">199 000</span>
              <span class="text-gray-500 ml-1">UZS</span>
            </div>
            <p class="mt-1 text-sm text-purple-600 font-medium">1 100 SMS {{ texts.included }}</p>
            <p class="mt-1 text-xs text-gray-400">{{ texts.perSms }}: 181 UZS</p>
          </div>

          <ul class="mt-6 space-y-3">
            <li v-for="f in premiumFeatures" :key="f" class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm text-gray-700">{{ f }}</span>
            </li>
          </ul>
        </div>

        <div class="p-6 pt-0">
          <button
            v-if="currentPlan !== 'premium'"
            @click="purchasePlan('premium')"
            :disabled="purchasing"
            class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {{ purchasing ? texts.processing : texts.buyBtn }}
          </button>
          <button v-else disabled class="w-full py-3 bg-green-100 text-green-700 font-semibold rounded-xl cursor-default">
            {{ texts.currentPlanBtn }}
          </button>
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
            <p class="text-sm font-semibold text-gray-900 mb-1">{{ texts.contractFreeTitle }}</p>
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
        <div class="bg-indigo-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p class="text-sm text-indigo-800">{{ texts.contractPayFrom }}</p>
          <nuxt-link :to="localePath({ name: 'mobil-hisob' })" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            {{ texts.topUpBalance }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',

  data() {
    return {
      currentPlan: 'free',
      smsRemaining: null,
      smsTotal: 0,
      smsUsed: 0,
      smsWarning: null,
      purchasing: false,
      // SMS xabarlar tarixi modali
      smsHistoryOpen: false,
      smsHistoryLoading: false,
      smsHistoryStats: { registration: 0, auto: 0, manual: 0 },
      // Tarif sotib olish tasdiqlash modali — Mobil hisob balansidan to'lash
      planConfirmTarget: null,  // { plan, price, smsCount, label }
      purchaseLoading: false,
      // To'lov usuli (Click/Payme) modali — top-up va SMS addon uchun
      paymentTarget: null,   // { kind:'topup'|'addon', amount?, key?, price?, label }
      paymentMethod: null,
      paymentLoading: false,
      addonPackages: [
        { name: 'small', sms: 200, price: 35000 },
        { name: 'medium', sms: 500, price: 75000 },
        { name: 'large', sms: 1000, price: 130000 },
      ],
    };
  },

  computed: {
    texts() {
      const locale = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: 'Tariflar',
          subtitle: "Qarz daftari va qarz shartnomasi bo'yicha narxlar",
          currentPlan: 'Joriy tarif',
          remaining: 'qoldi',
          daftariSectionTitle: 'Qarz daftari tariflari',
          daftariSectionDesc: "Obuna asosida — SMS bildirishnomalar bilan",
          smsBalance: 'SMS balansingiz',
          smsHintFree: "SMS bildirishnomalar uchun Start yoki Premium tarifni tanlang",
          smsHintEmpty: "SMS paketingiz tugadi — qo'shimcha paket yoki tarif oling",
          smsHintCritical: "SMS tugamoqda! Qo'shimcha paket olishni tavsiya qilamiz",
          smsHintLow: "SMS kam qoldi — paketni to'ldirib qo'ying",
          smsHintOk: "Jami {used} ta SMS yuborilgan",
          contractSectionTitle: 'Qarz shartnomasi tariflari',
          contractSectionDesc: "Har bir shartnoma uchun — Mobil hisobdan yechiladi",
          contractPriceTitle: 'Shartnoma narxi',
          contractPriceDesc: "Shartnoma summasidan (har bir rasmiy shartnoma uchun)",
          contractFreeTitle: 'Bepul shartnomalar',
          contractFullyFree: 'Mutlaqo bepul',
          contractFreeForAll: "Barcha foydalanuvchilarga qarz berishda",
          contractPayFrom: "To'lov Mobil hisob balansingizdan avtomatik yechiladi",
          topUpBalance: "Hisobni to'ldirish",
          min: 'Eng kam',
          max: 'Eng ko\'p',
          freeDesc: 'Asosiy imkoniyatlar bepul',
          popular: 'Ommabop',
          included: 'kiritilgan',
          perSms: 'Bitta SMS',
          bepul: 'Bepul',
          buyBtn: 'Ulanish',
          freeBtn: 'Bepul',
          currentPlanBtn: 'Joriy tarif',
          hasHigherPlan: 'Yuqori tarif faol',
          processing: 'Jarayonda...',
          addonTitle: "Qo'shimcha SMS paketlar",
          addonDesc: "SMS tugasa, tarif o'zgartirmasdan qo'shimcha paket oling",
          buyAddon: 'Sotib olish',
          // Faqat tizimda haqiqatda mavjud funksiyalar
          f_qarz: 'Qarz qo\'shish',
          f_payment: 'To\'lovlarni qayd etish',
          f_reg_sms: 'Ro\'yxatga olish SMS (tizim)',
          f_auto_sms: 'Avtomatik SMS eslatma (muddat bugun)',
          f_manual_sms: 'Qo\'lda SMS yuborish (qaytarishni talab)',
          f_sms_history: 'SMS tarixi va statistika',
          // SMS xabarlar tarixi modal
          smsHistoryBtn: 'SMS xabarlar tarixi',
          smsHistoryTitle: 'SMS xabarlar tarixi',
          smsHistorySubtitle: 'Yuborilgan SMS xabarlar kategoriyalar bo\'yicha',
          smsCatRegistration: "Ro'yxatga olingan qarz uchun",
          smsCatAuto: "Muddati kelgan qarzdorlik yuzasidan xabarnoma",
          smsCatManual: "Qaytarishni talab qilish yuzasidan xabarnoma",
          smsCatTotal: 'Jami yuborilgan',
          // To'lov usuli modal
          payTitle: 'To\'lov usulini tanlang',
          payViaPayme: 'Payme orqali to\'lash',
          payViaClick: 'Click orqali to\'lash',
          payPlanPrefix: 'Tarif:',
          payAddonPrefix: 'Qo\'shimcha paket:',
          payTopupPrefix: 'Mobil hisobni to\'ldirish:',
          // Tarif tasdiqlash modali
          confirmPurchaseTitle: 'Tarifga ulanish',
          currentBalance: 'Joriy balans',
          tariffPrice: 'Tarif qiymati',
          afterPurchase: 'Ulanishdan keyin balans',
          shortfall: 'Yetishmayotgan mablag\'',
          confirmHint: 'Tasdiqlasangiz, ko\'rsatilgan summa Mobil hisobingizdan yechib olinadi va tarif faollashadi.',
          insufficientHint: 'Mobil hisobda mablag\' yetarli emas. Avval to\'ldirib oling.',
          cancel: 'Bekor qilish',
          confirmBtn: 'Tasdiqlash',
          topUpBtn: 'Mobil hisobni to\'ldirish',
          planActivated: 'tarifi faollashtirildi',
        },
        ru: {
          title: 'Тарифы',
          subtitle: 'Цены по долговой книге и договору займа',
          currentPlan: 'Текущий тариф',
          remaining: 'осталось',
          daftariSectionTitle: 'Тарифы долговой книги',
          daftariSectionDesc: 'По подписке — с SMS-уведомлениями',
          smsBalance: 'Ваш SMS-баланс',
          smsHintFree: 'Выберите тариф Start или Premium для SMS-уведомлений',
          smsHintEmpty: 'SMS закончились — купите пакет или тариф',
          smsHintCritical: 'SMS заканчиваются! Рекомендуем купить пакет',
          smsHintLow: 'Осталось мало SMS — пополните пакет',
          smsHintOk: 'Всего отправлено {used} SMS',
          contractSectionTitle: 'Тарифы договора займа',
          contractSectionDesc: 'За каждый договор — списывается с Мобильного счёта',
          contractPriceTitle: 'Стоимость договора',
          contractPriceDesc: 'От суммы договора (за каждый официальный договор)',
          contractFreeTitle: 'Бесплатные договоры',
          contractFullyFree: 'Полностью бесплатно',
          contractFreeForAll: 'Для всех пользователей при выдаче займа',
          contractPayFrom: 'Оплата автоматически списывается с баланса Мобильного счёта',
          topUpBalance: 'Пополнить счёт',
          min: 'Мин',
          max: 'Макс',
          freeDesc: 'Основные возможности бесплатно',
          popular: 'Популярный',
          included: 'включено',
          perSms: 'Одно SMS',
          bepul: 'Бесплатно',
          buyBtn: 'Подключить',
          freeBtn: 'Бесплатно',
          currentPlanBtn: 'Текущий тариф',
          hasHigherPlan: 'Высший тариф активен',
          processing: 'Обработка...',
          addonTitle: 'Дополнительные SMS пакеты',
          addonDesc: 'Если SMS закончились, купите дополнительный пакет',
          buyAddon: 'Купить',
          f_qarz: 'Добавление долгов',
          f_payment: 'Учёт платежей',
          f_reg_sms: 'SMS при регистрации долга',
          f_auto_sms: 'Автоматическое SMS-напоминание (срок сегодня)',
          f_manual_sms: 'Ручная отправка SMS (требование возврата)',
          f_sms_history: 'История и статистика SMS',
          smsHistoryBtn: 'История SMS',
          smsHistoryTitle: 'История SMS-сообщений',
          smsHistorySubtitle: 'Отправленные SMS по категориям',
          smsCatRegistration: 'За регистрацию долга',
          smsCatAuto: 'Уведомление о наступлении срока',
          smsCatManual: 'Требование возврата долга',
          smsCatTotal: 'Всего отправлено',
          payTitle: 'Выберите способ оплаты',
          payViaPayme: 'Оплатить через Payme',
          payViaClick: 'Оплатить через Click',
          payPlanPrefix: 'Тариф:',
          payAddonPrefix: 'Доп. пакет:',
          payTopupPrefix: 'Пополнить Мобильный счёт:',
          confirmPurchaseTitle: 'Подключение тарифа',
          currentBalance: 'Текущий баланс',
          tariffPrice: 'Стоимость тарифа',
          afterPurchase: 'Баланс после подключения',
          shortfall: 'Не хватает',
          confirmHint: 'При подтверждении указанная сумма спишется с вашего Мобильного счёта, а тариф активируется.',
          insufficientHint: 'На Мобильном счёте средств недостаточно. Сначала пополните счёт.',
          cancel: 'Отмена',
          confirmBtn: 'Подтвердить',
          topUpBtn: 'Пополнить Мобильный счёт',
          planActivated: 'тариф активирован',
        },
        kr: {
          title: 'Тарифлар',
          subtitle: 'Қарз дафтари ва қарз шартномаси бўйича нархлар',
          currentPlan: 'Жорий тариф',
          remaining: 'қолди',
          daftariSectionTitle: 'Қарз дафтари тарифлари',
          daftariSectionDesc: 'Обуна асосида — SMS билдиришномалар билан',
          smsBalance: 'SMS балансингиз',
          smsHintFree: 'SMS билдиришномалар учун Start ёки Premium тарифни танланг',
          smsHintEmpty: 'SMS пакетингиз тугади — қўшимча пакет ёки тариф олинг',
          smsHintCritical: 'SMS тугамоқда! Қўшимча пакет олишни тавсия қиламиз',
          smsHintLow: 'SMS кам қолди — пакетни тўлдириб қўйинг',
          smsHintOk: 'Жами {used} та SMS юборилган',
          contractSectionTitle: 'Қарз шартномаси тарифлари',
          contractSectionDesc: 'Ҳар бир шартнома учун — Мобил ҳисобдан ечилади',
          contractPriceTitle: 'Шартнома нархи',
          contractPriceDesc: 'Шартнома суммасидан (ҳар бир расмий шартнома учун)',
          contractFreeTitle: 'Бепул шартномалар',
          contractFullyFree: 'Мутлақо бепул',
          contractFreeForAll: 'Барча фойдаланувчиларга қарз беришда',
          contractPayFrom: 'Тўлов Мобил ҳисоб балансингиздан автоматик ечилади',
          topUpBalance: 'Ҳисобни тўлдириш',
          min: 'Энг кам',
          max: 'Энг кўп',
          freeDesc: 'Асосий имкониятлар бепул',
          popular: 'Оммабоп',
          included: 'киритилган',
          perSms: 'Битта SMS',
          bepul: 'Бепул',
          buyBtn: 'Уланиш',
          freeBtn: 'Бепул',
          currentPlanBtn: 'Жорий тариф',
          hasHigherPlan: 'Юқори тариф фаол',
          processing: 'Жараёнда...',
          addonTitle: 'Қўшимча SMS пакетлар',
          addonDesc: 'SMS тугаса, тариф ўзгартирмасдан қўшимча пакет олинг',
          buyAddon: 'Сотиб олиш',
          f_qarz: 'Қарз қўшиш',
          f_payment: 'Тўловларни қайд этиш',
          f_reg_sms: 'Рўйхатга олиш SMS (тизим)',
          f_auto_sms: 'Автоматик SMS эслатма (муддат бугун)',
          f_manual_sms: 'Қўлда SMS юбориш (қайтаришни талаб)',
          f_sms_history: 'SMS тарихи ва статистика',
          smsHistoryBtn: 'SMS хабарлар тарихи',
          smsHistoryTitle: 'SMS хабарлар тарихи',
          smsHistorySubtitle: 'Юборилган SMS хабарлар категорияларга кўра',
          smsCatRegistration: "Рўйхатга олинган қарз учун",
          smsCatAuto: "Муддати келган қарздорлик юзасидан хабарнома",
          smsCatManual: "Қайтаришни талаб қилиш юзасидан хабарнома",
          smsCatTotal: 'Жами юборилган',
          payTitle: 'Тўлов усулини танланг',
          payViaPayme: 'Payme орқали тўлаш',
          payViaClick: 'Click орқали тўлаш',
          payPlanPrefix: 'Тариф:',
          payAddonPrefix: 'Қўшимча пакет:',
          payTopupPrefix: 'Мобил ҳисобни тўлдириш:',
          confirmPurchaseTitle: 'Тарифга уланиш',
          currentBalance: 'Жорий баланс',
          tariffPrice: 'Тариф қиймати',
          afterPurchase: 'Уланишдан кейин баланс',
          shortfall: 'Етишмаётган маблағ',
          confirmHint: 'Тасдиқласангиз, кўрсатилган сумма Мобил ҳисобингиздан ечиб олинади ва тариф фаоллашади.',
          insufficientHint: 'Мобил ҳисобда маблағ етарли эмас. Аввал тўлдиринг.',
          cancel: 'Бекор қилиш',
          confirmBtn: 'Тасдиқлаш',
          topUpBtn: 'Мобил ҳисобни тўлдириш',
          planActivated: 'тарифи фаоллаштирилди',
        },
      };
      return t[locale] || t.uz;
    },

    /*
     * Faqat tizimda haqiqatda ishlaydigan funksiyalar ro'yxatga olinadi.
     * Free: qarz qo'shish + to'lov qayd etish + ro'yxatga olish SMS (100 ta limit).
     *       Avtomatik/qo'lda SMS va SMS tarixi — chiziq tortilgan (yo'q).
     * Start/Premium: barcha SMS funksiyalari (faqat SMS soni farq qiladi).
     */
    freeFeatures() {
      const t = this.texts;
      return [t.f_qarz, t.f_payment, t.f_reg_sms];
    },
    freeDisabled() {
      const t = this.texts;
      return [t.f_auto_sms, t.f_manual_sms, t.f_sms_history];
    },
    startFeatures() {
      const t = this.texts;
      return [t.f_qarz, t.f_payment, t.f_reg_sms, t.f_auto_sms, t.f_manual_sms, t.f_sms_history];
    },
    startDisabled() {
      return [];
    },
    premiumFeatures() {
      const t = this.texts;
      // Premium farqi — SMS soni (1 100 ta), funksiyalar Start bilan bir xil
      return [t.f_qarz, t.f_payment, t.f_reg_sms, t.f_auto_sms, t.f_manual_sms, t.f_sms_history];
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
      return t.smsHintOk.replace('{used}', this.smsUsed || 0);
    },
  },

  async mounted() {
    if (this.$auth.user.is_active == 1 && this.$auth.user.is_contract == 0) {
      return this.$router.push(this.localePath({ name: 'universal_contract' }));
    }
    await this.loadSubscription();
  },

  methods: {
    formatPrice(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },

    async loadSubscription() {
      try {
        const res = await this.$axios.$get('/finance/subscription', { silent: true });
        if (res?.success) {
          this.currentPlan = res.data.subscription.plan;
          this.smsRemaining = res.data.sms.remaining;
          this.smsTotal = res.data.sms.total || 0;
          this.smsUsed = res.data.sms.used || 0;
          this.smsWarning = res.data.sms.warning || null;
        }
      } catch (_) {}
    },

    /**
     * Tarif sotib olish — Mobil hisob balansidan to'lov.
     * 1) Tasdiqlash modali ochiladi (balansni ko'rsatish).
     * 2) Yetarli balans → /finance/subscription/purchase-from-balance.
     * 3) Yetarli emas → "Mobil hisobni to'ldirish" tugmasi orqali top-up modaliga.
     */
    purchasePlan(plan) {
      const price = plan === 'premium' ? 199000 : 99000;
      const smsCount = plan === 'premium' ? 1100 : 500;
      const label = plan === 'premium' ? 'Premium' : 'Start';
      this.planConfirmTarget = { plan, price, smsCount, label };
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
      this.purchaseLoading = true;
      try {
        const res = await this.$axios.post(
          '/finance/subscription/purchase-from-balance',
          { plan: this.planConfirmTarget.plan },
          { silent: true },
        );
        if (res.data?.success) {
          this.$toast?.success(`${this.planConfirmTarget.label} ${this.texts.planActivated}`);
          this.planConfirmTarget = null;
          await this.loadSubscription();
          // $auth.user.balance ni yangilash — /user/me orqali (eng ishonchli yo'l;
          // har xil @nuxtjs/auth versiyalarida ham ishlaydi)
          try {
            const me = await this.$axios.$get('/user/me', { silent: true });
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
      const amount = Math.max(1000, this.balanceShortfall);
      this.paymentTarget = { kind: 'topup', amount, label: this.texts.topUpBtn };
    },

    /** Qo'shimcha SMS paketi sotib olish — modalda usul tanlanadi (Click/Payme) */
    purchaseAddon(packageName) {
      const pkg = this.addonPackages.find((p) => p.name === packageName);
      if (!pkg) return;
      this.paymentTarget = { kind: 'addon', key: packageName, price: pkg.price, label: `${pkg.sms} SMS — ${this.formatPrice(pkg.price)} UZS` };
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
        if (!uid || amount < 1000) {
          this.$toast?.error("Noto'g'ri ma'lumotlar");
          return;
        }
        const origin = (typeof window !== 'undefined' && window.location?.origin) || 'https://zerox.uz';
        const returnUrl = `${origin}/price`;
        if (method === 'click') {
          // mobil-hisob eventClick formati bilan AYNI: return_url raw (encode yo'q)
          const str = `service_id=24899&merchant_id=17375&amount=${amount}&transaction_param=${uid}&return_url=${returnUrl}`;
          window.location.href = 'https://my.click.uz/services/pay?' + str;
        } else {
          // mobil-hisob eventPayme formati bilan AYNI
          const tiyin = amount * 100;
          const str = `m=62fa657ea12ad7a48f4b2dd9;ac.user_id=${uid};a=${tiyin};c=${returnUrl}`;
          window.location.href = 'https://checkout.paycom.uz/' + btoa(str);
        }
        return;
      }

      // ADDON — Qo'shimcha SMS paketi (backend create-sms-package endpointi)
      this.paymentLoading = true;
      try {
        const res = await this.$axios.post('/finance/payment/create-sms-package', {
          package_name: this.paymentTarget.key,
          payment_method: method,
        }, { silent: true });
        if (res.data?.success && res.data.data?.payment_url) {
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
      this.smsHistoryOpen = true;
      this.smsHistoryLoading = true;
      try {
        const res = await this.$axios.$get('/finance/subscription/sms-stats', { silent: true });
        if (res?.success) {
          const byType = res.data.by_type || {};
          this.smsHistoryStats = {
            registration: Number(byType.registration) || 0,
            auto: Number(byType.auto) || 0,
            manual: Number(byType.manual) || 0,
          };
        }
      } catch (_) {
        // silent — modal still opens with zeros
      } finally {
        this.smsHistoryLoading = false;
      }
    },

    closeSmsHistory() {
      this.smsHistoryOpen = false;
    },
  },
};
</script>

<style scoped>
/* Modal overlay — global .modal-overlay bilan to'qnashmaslik uchun prefiksli */
.qd-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 110;
  animation: qd-fade-in 0.15s ease-out;
}
@keyframes qd-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
