<template>
  <!-- SS-DEV (2026-09-26), 25.09 "Xatolar" 7→8-rasm (13-band): SMS BOSHQARUVI KOMPONENTI.
       Ilgari `pages/finance/sms/index.vue` sahifasi edi (Shaxsiy qarz'dan havola). Endi funksiyalar
       O'ZGARMASDAN komponentga ajratildi va Tariflar (/price) sahifasida "SMS xabarlar tarixi"
       yonidagi "Batafsil" ostida yig'iluvchi blok sifatida ochiladi. Eski marshrut /finance/sms →
       /price#sms ga yo'naltiradi. Tarifda `sms_history` bo'lmasa — ko'rsatma matni. -->
  <div class="zx-sms-manager">
    <div v-if="!ready" class="text-center py-6 text-sm text-gray-400">{{ texts.loading }}</div>
    <div v-else-if="!features.sms_history" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {{ texts.upgradeHint }}
    </div>
    <template v-else>
    <div class="mb-4">
      <h2 class="text-lg font-bold text-gray-900">{{ texts.title }}</h2>
      <p class="text-sm text-gray-500 mt-0.5">{{ texts.subtitle }}</p>
    </div>
    <!-- SMS Statistika kartochkalari -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Qoldiq -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3">
          <div :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center',
            smsWarning === 'empty' ? 'bg-red-100' : smsWarning === 'critical' ? 'bg-orange-100' : 'bg-green-100'
          ]">
            <svg class="w-5 h-5" :class="[
              smsWarning === 'empty' ? 'text-red-600' : smsWarning === 'critical' ? 'text-orange-600' : 'text-green-600'
            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500">{{ texts.remaining }}</span>
        </div>
        <div class="text-2xl font-bold" :class="[
          smsWarning === 'empty' ? 'text-red-600' : smsWarning === 'critical' ? 'text-orange-600' : 'text-gray-900'
        ]">{{ sms.remaining }}</div>
        <div v-if="smsWarning" class="mt-1 text-xs font-medium" :class="[
          smsWarning === 'empty' ? 'text-red-500' : 'text-orange-500'
        ]">
          {{ smsWarning === 'empty' ? texts.smsEmpty : texts.smsLow }}
        </div>
      </div>

      <!-- Jami -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500">{{ texts.total }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ sms.total }}</div>
      </div>

      <!-- Ishlatilgan -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500">{{ texts.used }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ sms.used }}</div>
      </div>

      <!-- Shu oy -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500">{{ texts.thisMonth }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ stats.this_month }}</div>
      </div>
    </div>

    <!-- Progress bar -->
    <div v-if="sms.total > 0" class="bg-white rounded-xl shadow-sm p-5 mb-6">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-500">{{ texts.usageProgress }}</span>
        <span class="font-medium text-gray-700">{{ sms.used }}/{{ sms.total }} ({{ usagePercent }}%)</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="h-3 rounded-full transition-all"
          :class="[usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-yellow-500' : 'bg-blue-500']"
          :style="{ width: usagePercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- 27.09 (S3-1): "Qo'lda SMS yuborish" bloki OLIB TASHLANDI (forma, sendForm/sendSms ham).
         Backend endpoint (/finance/subscription/send-sms) o'zgarmagan. -->

    <!-- SMS tarix jadvali -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="p-6 pb-0">
        <!-- 27.09 (S3-2): "SMS tarix" → "SMS xabarlar ro'yxati" (texts.history) -->
        <h2 class="text-lg font-semibold text-gray-900">{{ texts.history }}</h2>
      </div>

      <!-- 29.09: SMS xabarlar ro'yxati FAQAT Premium (backend `sms_list`, boshqa tarifga 403) —
           Start/Free'da jadval o'rniga tarif cheklovi eslatmasi. -->
      <div v-if="!features.sms_list" class="m-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p class="font-semibold">{{ texts.limitTitle }}</p>
        <p class="mt-1">{{ texts.listLocked }}</p>
      </div>
      <template v-else>
      <div class="overflow-x-auto">
        <table class="w-full mt-4">
          <thead>
            <!-- 27.09 (S3-3/4/5): sarlavhalar KATTA harf emas (uppercase olib tashlandi) — "Sana", "Telefon",
                 "Turi", "SMS xabar mazmuni"; "Holat" ustuni olib tashlandi -->
            <tr class="border-b border-gray-200">
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-500">{{ texts.hDate }}</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-500">{{ texts.hPhone }}</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-500">{{ texts.hType }}</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-500">{{ texts.hMessage }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in history" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(item.sent_at) }}</td>
              <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{{ item.phone }}</td>
              <td class="px-6 py-3">
                <span :class="[
                  'inline-block px-2 py-0.5 text-xs font-medium rounded-full',
                  item.type === 'auto' ? 'bg-blue-100 text-blue-700' : item.type === 'manual' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                ]">{{ item.type === 'auto' ? texts.typeAuto : item.type === 'manual' ? texts.typeManual : item.type }}</span>
              </td>
              <!-- 27.09 (S3-4): "Holat" ustuni katakchasi olib tashlandi -->
              <td class="px-6 py-3 text-sm text-gray-500 max-w-xs truncate">{{ item.message }}</td>
            </tr>
            <tr v-if="history.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-400">{{ texts.noHistory }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 p-4 border-t border-gray-100">
        <button v-for="p in totalPages" :key="p"
          @click="loadHistory(p)"
          :class="['w-8 h-8 rounded-lg text-sm font-medium transition-colors',
            p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
        >{{ p }}</button>
      </div>
      </template>
    </div>
    </template>
  </div>
</template>

<script>
import { fmtDMYHM } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
import subscriptionMixin from '~/mixins/subscriptionMixin';

export default {
  name: 'FinanceSmsManager',
  mixins: [subscriptionMixin],

  data() {
    return {
      // SS-DEV (2026-09-26): mixin'dagi `_subLoaded` (`_` bilan) Vue'da proxy/reaktiv EMAS —
      // shu sabab o'z reaktiv bayrog'imiz (aks holda "Yuklanmoqda…" abadiy qolardi).
      ready: false,
      sms: { total: 0, used: 0, remaining: 0 },
      smsWarning: null,
      stats: { this_month: 0, total_sent: 0 },
      history: [],
      page: 1,
      totalPages: 1,
      // 27.09 (S3-1): sendForm/sending olib tashlandi (qo'lda SMS yuborish bloki yo'q)
    };
  },

  computed: {
    usagePercent() {
      if (!this.sms.total) return 0;
      return Math.min(100, Math.round((this.sms.used / this.sms.total) * 100));
    },
    texts() {
      const locale = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: 'SMS boshqaruvi',
          subtitle: 'SMS paket, tarix va statistikangizni kuzating',
          buyMore: "Qo'shimcha SMS olish",
          remaining: 'Qoldiq SMS',
          total: 'Jami paket',
          used: 'Ishlatilgan',
          thisMonth: 'Shu oy',
          smsEmpty: 'SMS paketingiz tugadi!',
          smsLow: 'SMS paketingiz tugamoqda',
          usageProgress: 'Foydalanish',
          history: "SMS xabarlar ro'yxati", // 27.09 (S3-2)
          hDate: 'Sana',
          hPhone: 'Telefon',
          hType: 'Turi',
          hMessage: 'SMS xabar mazmuni', // 27.09 (S3-5)
          typeAuto: 'Avtomatik',
          typeManual: "Qo'lda",
          noHistory: 'SMS tarix bo\'sh',
          loading: 'Yuklanmoqda…', // SS-DEV (2026-09-26)
          upgradeHint: "SMS boshqaruvi (tarix, statistika) faqat Start yoki Premium tarifida mavjud. Tarifni tanlab faollashtiring.",
          limitTitle: 'Tarif cheklovi', // 29.09
          listLocked: "SMS xabarlar ro'yxati faqat Premium tarifida mavjud. Ushbu imkoniyatdan foydalanish uchun Premium tarifiga o'ting.",
        },
        ru: {
          title: 'Управление SMS',
          subtitle: 'Отслеживайте SMS пакет, историю и статистику',
          buyMore: 'Купить SMS',
          remaining: 'Остаток SMS',
          total: 'Всего пакет',
          used: 'Использовано',
          thisMonth: 'Этот месяц',
          smsEmpty: 'SMS пакет исчерпан!',
          smsLow: 'SMS пакет заканчивается',
          usageProgress: 'Использование',
          history: 'Список SMS-сообщений', // 27.09 (S3-2)
          hDate: 'Дата',
          hPhone: 'Телефон',
          hType: 'Тип',
          hMessage: 'Содержание SMS', // 27.09 (S3-5)
          typeAuto: 'Авто',
          typeManual: 'Вручную',
          noHistory: 'История SMS пуста',
          loading: 'Загрузка…',
          upgradeHint: 'Управление SMS (история, статистика) доступно только на тарифах Start или Premium. Выберите и активируйте тариф.',
          limitTitle: 'Ограничение тарифа',
          listLocked: 'Список SMS-сообщений доступен только на тарифе Premium. Чтобы воспользоваться этой возможностью, перейдите на тариф Premium.',
        },
        kr: {
          title: 'SMS бошқаруви',
          subtitle: 'SMS пакет, тарих ва статистикангизни кузатинг',
          buyMore: 'Қўшимча SMS олиш',
          remaining: 'Қолдиқ SMS',
          total: 'Жами пакет',
          used: 'Ишлатилган',
          thisMonth: 'Шу ой',
          smsEmpty: 'SMS пакетингиз тугади!',
          smsLow: 'SMS пакетингиз тугамоқда',
          usageProgress: 'Фойдаланиш',
          history: 'SMS хабарлар рўйхати', // 27.09 (S3-2)
          hDate: 'Сана',
          hPhone: 'Телефон',
          hType: 'Тури',
          hMessage: 'SMS хабар мазмуни', // 27.09 (S3-5)
          typeAuto: 'Автоматик',
          typeManual: 'Қўлда',
          noHistory: 'SMS тарих бўш',
          loading: 'Юкланмоқда…',
          upgradeHint: 'SMS бошқаруви (тарих, статистика) фақат Start ёки Premium тарифида мавжуд. Тарифни танлаб фаоллаштиринг.',
          limitTitle: 'Тариф чеклови',
          listLocked: 'SMS хабарлар рўйхати фақат Premium тарифида мавжуд. Ушбу имкониятдан фойдаланиш учун Premium тарифига ўтинг.',
        },
        // SS-DEV (2026-09-26): en/kaa
        en: {
          title: 'SMS management',
          subtitle: 'Track your SMS package, history and statistics',
          buyMore: "Buy more SMS",
          remaining: 'Remaining SMS',
          total: 'Total package',
          used: 'Used',
          thisMonth: 'This month',
          smsEmpty: 'Your SMS package has run out!',
          smsLow: 'Your SMS package is running out',
          usageProgress: 'Usage',
          history: 'List of SMS messages', // 27.09 (S3-2)
          hDate: 'Date',
          hPhone: 'Phone',
          hType: 'Type',
          hMessage: 'SMS message content', // 27.09 (S3-5)
          typeAuto: 'Automatic',
          typeManual: "Manual",
          noHistory: 'SMS history is empty',
          loading: 'Loading…',
          upgradeHint: "SMS management (history, statistics) is available only on the Start or Premium plan. Choose a plan to activate it.",
          limitTitle: 'Plan limitation',
          listLocked: 'The SMS message list is available only on the Premium plan. Upgrade to Premium to use this feature.',
        },
        kaa: {
          title: 'SMS basqarıwı',
          subtitle: 'SMS paket, tariyx hám statistikańızdı baqlań',
          buyMore: "Qosımsha SMS alıw",
          remaining: 'Qalǵan SMS',
          total: 'Jámi paket',
          used: 'Qollanılǵan',
          thisMonth: 'Usı ay',
          smsEmpty: 'SMS paketińiz tamamlandı!',
          smsLow: 'SMS paketińiz tamamlanbaqta',
          usageProgress: 'Paydalanıw',
          history: 'SMS xabarlar dizimi', // 27.09 (S3-2)
          hDate: 'Sáne',
          hPhone: 'Telefon',
          hType: 'Túri',
          hMessage: 'SMS xabar mazmuni', // 27.09 (S3-5)
          typeAuto: 'Avtomat',
          typeManual: "Qolda",
          noHistory: 'SMS tariyxı bos',
          loading: 'Júklenbekte…',
          upgradeHint: "SMS basqarıwı (tariyx, statistika) tek Start yamasa Premium tarifinde bar. Tarifti saylap belsendi etiń.",
          limitTitle: 'Tarif sheklewi',
          listLocked: "SMS xabarlar dizimi tek Premium tarifinde bar. Bul múmkinshilikten paydalanıw ushın Premium tarifine ótiń.",
        },
      };
      return t[locale] || t.uz;
    },
  },

  async mounted() {
    await this.loadSubscriptionData();
    this.ready = true;
    // SS-DEV (2026-09-26): komponent rejimida yo'naltirish yo'q — tarif yetarli bo'lmasa matn ko'rsatiladi
    if (!this.features.sms_history) return;
    // 29.09: ro'yxat FAQAT Premium'da so'raladi (boshqa tarifda backend 403 qaytaradi).
    await Promise.all([
      this.loadSmsData(),
      this.features.sms_list ? this.loadHistory(1) : Promise.resolve(),
      this.loadStats(),
    ]);
  },

  methods: {
    formatDate(d) { return fmtDMYHM(d, '') }, // SS-AUDIT (2026-09-25): utils/helpers

    async loadSmsData() {
      try {
        const res = await this.$axios.$get('/finance/subscription', { silent: true });
        if (res?.success) {
          this.sms = res.data.sms;
          this.smsWarning = res.data.sms.warning;
        }
      } catch (_) {}
    },

    async loadHistory(page) {
      try {
        this.page = page;
        const res = await this.$axios.$get(`/finance/subscription/sms-history?page=${page}&limit=20`, { silent: true });
        if (res?.success) {
          this.history = res.data;
          this.totalPages = res.pagination.totalPages;
        }
      } catch (_) {}
    },

    async loadStats() {
      try {
        const res = await this.$axios.$get('/finance/subscription/sms-stats', { silent: true });
        if (res?.success) {
          this.stats = res.data;
        }
      } catch (_) {}
    },
  },
};
</script>
