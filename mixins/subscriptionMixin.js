/**
 * Tarif tekshiruvi mixin
 * Barcha qarz daftari sahifalarida ishlatiladi
 */
export default {
  // 01.10: maydonlar `_` siz — Vue 2 `_` yoki `$` bilan boshlanadigan data maydonlarini instance'ga
  // PROXY QILMAYDI va reaktiv kuzatmaydi: `this._subFeatures = ...` oddiy (reaktiv bo'lmagan) xossa
  // yaratardi, `features` computed yangilanmas, pullik imkoniyatlar UI'da ochilmay qolardi.
  data() {
    return {
      subPlan: 'free',
      subFeatures: null,
      subSms: { total: 0, used: 0, remaining: 0, warning: null },
      subLoaded: false,
    };
  },

  computed: {
    /** Joriy tarif nomi */
    currentPlan() { return this.subPlan; },

    /** Tarif imkoniyatlari */
    features() {
      return this.subFeatures || {
        unlimited_debts: true, payment_tracking: true, telegram_reminder: true,
        registration_sms: true, self_send_sms: true,
        auto_sms_reminder: false, manual_sms_send: false, sms_history: false, sms_list: false,
        sms_templates: false, debtor_rating: false, payment_link: false,
        interest_calculation: false, pdf_report: false, excel_export: false,
        analytics: false, reminder_schedule: false, group_notebook: false, priority_support: false,
      };
    },

    /** Pullik tarifmi */
    isPaid() { return this.subPlan === 'start' || this.subPlan === 'premium'; },

    /** Premium tarifmi */
    isPremium() { return this.subPlan === 'premium'; },

    /** SMS qoldig'i */
    smsRemaining() { return this.subSms.remaining; },
  },

  methods: {
    /** Tarif ma'lumotlarini yuklash */
    async loadSubscriptionData() {
      try {
        const res = await this.$axios.$get('/finance/subscription', { silent: true });
        if (res?.success) {
          this.subPlan = res.data.subscription.plan;
          this.subFeatures = res.data.features;
          this.subSms = res.data.sms;
          this.subLoaded = true;
        }
      } catch (_) {
        this.subPlan = 'free';
        this.subLoaded = true;
      }
    },

    /** Imkoniyat tekshirish — yo'q bo'lsa tariflar sahifasiga yo'naltirish */
    checkFeature(featureName) {
      if (this.features[featureName]) return true;
      this.showUpgradeModal(featureName);
      return false;
    },

    /** Upgrade modali / toast */
    showUpgradeModal(featureName) {
      const locale = this.$i18n?.locale || 'uz';
      const msgs = {
        uz: "Bu imkoniyat faqat pullik tarifda mavjud. Tariflar sahifasiga o'ting.",
        ru: 'Эта функция доступна только на платном тарифе. Перейдите на страницу тарифов.',
        kr: "Бу имконият фақат пулли тарифда мавжуд. Тарифлар саҳифасига ўтинг.",
        en: "This feature is only available on a paid plan. Go to the pricing page.", // SS-DEV (2026-09-26): en/kaa
        kaa: "Bul múmkinshilik tek pullı tarifte bar. Tarifler betine ótiń.",
      };
      this.$toast.error(msgs[locale] || msgs.uz);
    },
  },
};
