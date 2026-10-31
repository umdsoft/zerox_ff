/**
 * wave D: pages/price/index.vue dan ajratilgan "view-model" computed'lar (matnlar, tarif muddati, SMS holati, balans yetarliligi).
 * Faqat sahifa holatini (data) o'qiydi — yon ta'siri yo'q. Testlar `vm.texts`, `vm.expiryAlert` ... orqali sahifa opsiyalarida ishlaydi.
 */
import { getPlans } from '~/utils/pricingPlans';
import { getPriceTexts } from '~/utils/priceTexts';

export default {
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
      if (!this.subEnd) {return this.texts.unlimited;}
      const n = Number(this.subDaysLeft);
      if (!Number.isFinite(n)) {return '—';}
      if (n <= 0) {return this.texts.lastDay;}
      return this.texts.daysLeft.replace('{n}', n);
    },
    // Muddatning qolgan qismi (%) — progress chizig'i uchun
    periodPercent() {
      const start = this.toDate(this.subStart);
      const end = this.toDate(this.subEnd);
      if (!start || !end || end <= start) {return null;}
      const left = end.getTime() - Date.now();
      return Math.max(0, Math.min(100, Math.round((left / (end.getTime() - start.getTime())) * 100)));
    },
    // Ogohlantirish: faol tarif tugashiga oz qoldi YOKI yaqinda tugagan
    expiryAlert() {
      if (this.isGuest) {return null;}
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
      if (!target || target.kind === 'addon') {return null;}
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
      if (this.currentPlan === 'start') {return 'Start';}
      if (this.currentPlan === 'premium') {return 'Premium';}
      return 'Free';
    },
    paymentTargetLabel() {
      if (!this.paymentTarget) {return '';}
      if (this.paymentTarget.kind === 'topup') {
        return `${this.texts.payTopupPrefix} ${this.formatPrice(this.paymentTarget.amount)} UZS`;
      }
      return `${this.texts.payAddonPrefix} ${this.paymentTarget.label}`;
    },
    userBalance() {
      return Number(this.$auth?.user?.balance) || 0;
    },
    balanceSufficient() {
      if (!this.planConfirmTarget) {return false;}
      return this.userBalance >= this.planConfirmTarget.price;
    },
    balanceShortfall() {
      if (!this.planConfirmTarget) {return 0;}
      return Math.max(0, this.planConfirmTarget.price - this.userBalance);
    },
    smsPercent() {
      const total = Number(this.smsTotal) || 0;
      if (total <= 0) {return 0;}
      const rem = Number(this.smsRemaining) || 0;
      return Math.max(0, Math.min(100, Math.round((rem / total) * 100)));
    },
    smsHint() {
      const t = this.texts;
      if (this.currentPlan === 'free') {return t.smsHintFree;}
      if (this.smsWarning === 'empty') {return t.smsHintEmpty;}
      if (this.smsWarning === 'critical') {return t.smsHintCritical;}
      if (this.smsWarning === 'low') {return t.smsHintLow;}
      return t.smsHintOk.replace('{used}', this.smsSent || 0);
    },
  },
};
