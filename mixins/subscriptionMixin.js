/**
 * Tarif tekshiruvi mixin
 * Barcha qarz daftari sahifalarida ishlatiladi
 */
export default {
  data() {
    return {
      _subPlan: 'free',
      _subFeatures: null,
      _subSms: { total: 0, used: 0, remaining: 0, warning: null },
      _subLoaded: false,
    };
  },

  computed: {
    /** Joriy tarif nomi */
    currentPlan() { return this._subPlan; },

    /** Tarif imkoniyatlari */
    features() {
      return this._subFeatures || {
        unlimited_debts: true, payment_tracking: true, telegram_reminder: true,
        registration_sms: true, self_send_sms: true,
        auto_sms_reminder: false, manual_sms_send: false, sms_history: false,
        sms_templates: false, debtor_rating: false, payment_link: false,
        interest_calculation: false, pdf_report: false, excel_export: false,
        analytics: false, reminder_schedule: false, group_notebook: false, priority_support: false,
      };
    },

    /** Pullik tarifmi */
    isPaid() { return this._subPlan === 'start' || this._subPlan === 'premium'; },

    /** Premium tarifmi */
    isPremium() { return this._subPlan === 'premium'; },

    /** SMS qoldig'i */
    smsRemaining() { return this._subSms.remaining; },
  },

  methods: {
    /** Tarif ma'lumotlarini yuklash */
    async loadSubscriptionData() {
      try {
        const res = await this.$axios.$get('/finance/subscription', { silent: true });
        if (res?.success) {
          this._subPlan = res.data.subscription.plan;
          this._subFeatures = res.data.features;
          this._subSms = res.data.sms;
          this._subLoaded = true;
        }
      } catch (_) {
        this._subPlan = 'free';
        this._subLoaded = true;
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
      };
      this.$toast.error(msgs[locale] || msgs.uz);
    },
  },
};
