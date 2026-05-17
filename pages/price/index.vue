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
          </div>
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
            <p class="mt-2 text-sm text-gray-500">{{ texts.freeDesc }}</p>
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
        <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <!-- Narx modeli -->
          <div class="p-6">
            <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <p class="text-sm font-semibold text-gray-900 mb-1">{{ texts.contractPriceTitle }}</p>
            <p class="text-2xl font-bold text-indigo-600">0.1%</p>
            <p class="text-xs text-gray-500 mt-1">{{ texts.contractPriceDesc }}</p>
          </div>
          <!-- Min / Max -->
          <div class="p-6">
            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
            </div>
            <p class="text-sm font-semibold text-gray-900 mb-1">{{ texts.contractLimitTitle }}</p>
            <p class="text-sm text-gray-700"><span class="font-semibold">{{ texts.min }}:</span> 1 000 UZS</p>
            <p class="text-sm text-gray-700"><span class="font-semibold">{{ texts.max }}:</span> 100 000 UZS</p>
            <p class="text-xs text-gray-500 mt-1">{{ texts.contractLimitDesc }}</p>
          </div>
          <!-- Bepul + Mobil hisob -->
          <div class="p-6">
            <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <p class="text-sm font-semibold text-gray-900 mb-1">{{ texts.contractFreeTitle }}</p>
            <p class="text-2xl font-bold text-green-600">5 {{ texts.contractFreeUnit }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ texts.contractFreeDesc }}</p>
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
          contractLimitTitle: 'Eng kam / eng ko\'p',
          contractLimitDesc: "1 mln so'mgacha — 1 000 UZS; 100 mln dan ortiq — 100 000 UZS",
          contractFreeTitle: 'Bepul shartnomalar',
          contractFreeUnit: 'ta bepul',
          contractFreeDesc: "Yangi ro'yxatdan o'tgan foydalanuvchilarga qarz olishda",
          contractPayFrom: "To'lov Mobil hisob balansingizdan avtomatik yechiladi",
          topUpBalance: "Hisobni to'ldirish",
          min: 'Eng kam',
          max: 'Eng ko\'p',
          freeDesc: 'Asosiy imkoniyatlar bepul',
          popular: 'Mashhur',
          included: 'kiritilgan',
          perSms: 'Bitta SMS',
          buyBtn: 'Sotib olish',
          freeBtn: 'Bepul',
          currentPlanBtn: 'Joriy tarif',
          hasHigherPlan: 'Yuqori tarif faol',
          processing: 'Jarayonda...',
          addonTitle: "Qo'shimcha SMS paketlar",
          addonDesc: "SMS tugasa, tarif o'zgartirmasdan qo'shimcha paket oling",
          buyAddon: 'Sotib olish',
          // Free features
          f_unlimited: 'Cheksiz qarz qo\'shish',
          f_payment: 'To\'lovlarni qayd etish',
          f_telegram: 'Telegram eslatma',
          f_reg_sms: 'Ro\'yxatga olish SMS (tizim)',
          f_self_sms: 'Eslatma SMS (o\'zi yuboradi)',
          // Start features
          f_auto_sms: 'Avtomatik SMS eslatma',
          f_manual_sms: 'Qo\'lda SMS yuborish',
          f_sms_history: 'SMS tarixi va statistika',
          f_templates: 'Eslatma shablonlari (3 xil)',
          f_rating: 'Qarzdor ishonchlilik reytingi',
          f_pay_link: 'Qarzdorga to\'lov havolasi',
          f_interest: 'Foiz avtomatik hisoblash',
          f_pdf: 'PDF hisobot',
          // Premium features
          f_excel: 'Excel eksport',
          f_analytics: 'Grafik va analitika',
          f_schedule: 'Eslatma jadvali sozlash',
          f_group: 'Guruh/oila daftari',
          f_support: 'Ustuvor qo\'llab-quvvatlash',
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
          contractLimitTitle: 'Мин / макс',
          contractLimitDesc: 'до 1 млн сум — 1 000 UZS; свыше 100 млн — 100 000 UZS',
          contractFreeTitle: 'Бесплатные договоры',
          contractFreeUnit: 'бесплатно',
          contractFreeDesc: 'Новым пользователям при получении займа',
          contractPayFrom: 'Оплата автоматически списывается с баланса Мобильного счёта',
          topUpBalance: 'Пополнить счёт',
          min: 'Мин',
          max: 'Макс',
          freeDesc: 'Основные возможности бесплатно',
          popular: 'Популярный',
          included: 'включено',
          perSms: 'Одно SMS',
          buyBtn: 'Купить',
          freeBtn: 'Бесплатно',
          currentPlanBtn: 'Текущий тариф',
          hasHigherPlan: 'Высший тариф активен',
          processing: 'Обработка...',
          addonTitle: 'Дополнительные SMS пакеты',
          addonDesc: 'Если SMS закончились, купите дополнительный пакет',
          buyAddon: 'Купить',
          f_unlimited: 'Неограниченное добавление долгов',
          f_payment: 'Учёт платежей',
          f_telegram: 'Telegram напоминания',
          f_reg_sms: 'SMS при регистрации долга',
          f_self_sms: 'SMS напоминание (отправляет сам)',
          f_auto_sms: 'Автоматические SMS напоминания',
          f_manual_sms: 'Ручная отправка SMS',
          f_sms_history: 'История и статистика SMS',
          f_templates: 'Шаблоны напоминаний (3 вида)',
          f_rating: 'Рейтинг надёжности должника',
          f_pay_link: 'Ссылка на оплату для должника',
          f_interest: 'Автоматический расчёт процентов',
          f_pdf: 'PDF отчёт',
          f_excel: 'Excel экспорт',
          f_analytics: 'Графики и аналитика',
          f_schedule: 'Настройка расписания напоминаний',
          f_group: 'Групповая/семейная книга',
          f_support: 'Приоритетная поддержка',
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
          contractLimitTitle: 'Энг кам / энг кўп',
          contractLimitDesc: '1 млн сўмгача — 1 000 UZS; 100 млн дан ортиқ — 100 000 UZS',
          contractFreeTitle: 'Бепул шартномалар',
          contractFreeUnit: 'та бепул',
          contractFreeDesc: 'Янги рўйхатдан ўтган фойдаланувчиларга қарз олишда',
          contractPayFrom: 'Тўлов Мобил ҳисоб балансингиздан автоматик ечилади',
          topUpBalance: 'Ҳисобни тўлдириш',
          min: 'Энг кам',
          max: 'Энг кўп',
          freeDesc: 'Асосий имкониятлар бепул',
          popular: 'Машҳур',
          included: 'киритилган',
          perSms: 'Битта SMS',
          buyBtn: 'Сотиб олиш',
          freeBtn: 'Бепул',
          currentPlanBtn: 'Жорий тариф',
          hasHigherPlan: 'Юқори тариф фаол',
          processing: 'Жараёнда...',
          addonTitle: 'Қўшимча SMS пакетлар',
          addonDesc: 'SMS тугаса, тариф ўзгартирмасдан қўшимча пакет олинг',
          buyAddon: 'Сотиб олиш',
          f_unlimited: 'Чексиз қарз қўшиш',
          f_payment: 'Тўловларни қайд этиш',
          f_telegram: 'Telegram эслатма',
          f_reg_sms: 'Рўйхатга олиш SMS (тизим)',
          f_self_sms: 'Эслатма SMS (ўзи юборади)',
          f_auto_sms: 'Автоматик SMS эслатма',
          f_manual_sms: 'Қўлда SMS юбориш',
          f_sms_history: 'SMS тарихи ва статистика',
          f_templates: 'Эслатма шаблонлари (3 хил)',
          f_rating: 'Қарздор ишончлилик рейтинги',
          f_pay_link: 'Қарздорга тўлов ҳаволаси',
          f_interest: 'Фоиз автоматик ҳисоблаш',
          f_pdf: 'PDF ҳисобот',
          f_excel: 'Excel экспорт',
          f_analytics: 'График ва аналитика',
          f_schedule: 'Эслатма жадвали созлаш',
          f_group: 'Гуруҳ/оила дафтари',
          f_support: 'Устувор қўллаб-қувватлаш',
        },
      };
      return t[locale] || t.uz;
    },

    freeFeatures() {
      const t = this.texts;
      return [t.f_unlimited, t.f_payment, t.f_telegram, t.f_reg_sms, t.f_self_sms];
    },
    freeDisabled() {
      const t = this.texts;
      return [t.f_auto_sms, t.f_rating, t.f_pay_link, t.f_analytics];
    },
    startFeatures() {
      const t = this.texts;
      return [
        t.f_unlimited, t.f_payment, t.f_telegram, t.f_reg_sms, t.f_self_sms,
        t.f_auto_sms, t.f_manual_sms, t.f_sms_history, t.f_templates,
        t.f_rating, t.f_pay_link, t.f_interest, t.f_pdf,
      ];
    },
    startDisabled() {
      const t = this.texts;
      return [t.f_excel, t.f_analytics, t.f_schedule, t.f_group];
    },
    premiumFeatures() {
      const t = this.texts;
      return [
        t.f_unlimited, t.f_payment, t.f_telegram, t.f_reg_sms, t.f_self_sms,
        t.f_auto_sms, t.f_manual_sms, t.f_sms_history, t.f_templates,
        t.f_rating, t.f_pay_link, t.f_interest, t.f_pdf,
        t.f_excel, t.f_analytics, t.f_schedule, t.f_group, t.f_support,
      ];
    },
    planLabel() {
      if (this.currentPlan === 'start') return 'Start';
      if (this.currentPlan === 'premium') return 'Premium';
      return 'Free';
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

    async purchasePlan(plan) {
      this.purchasing = true;
      try {
        // Click/Payme to'lov URL olish
        const res = await this.$axios.post('/finance/payment/create-subscription', {
          plan,
          payment_method: 'click',
        });

        if (res.data.success && res.data.data?.payment_url) {
          // Click/Payme sahifasiga yo'naltirish
          window.location.href = res.data.data.payment_url;
          return;
        }
        this.$toast.error(res.data.message || 'Xatolik');
      } catch (e) {
        this.$toast.error('Xatolik yuz berdi');
      } finally {
        this.purchasing = false;
      }
    },

    async purchaseAddon(packageName) {
      this.purchasing = true;
      try {
        const res = await this.$axios.post('/finance/payment/create-sms-package', {
          package_name: packageName,
          payment_method: 'click',
        });

        if (res.data.success && res.data.data?.payment_url) {
          window.location.href = res.data.data.payment_url;
          return;
        }
        this.$toast.error(res.data.message || 'Xatolik');
      } catch (e) {
        this.$toast.error('Xatolik yuz berdi');
      } finally {
        this.purchasing = false;
      }
    },
  },
};
</script>
