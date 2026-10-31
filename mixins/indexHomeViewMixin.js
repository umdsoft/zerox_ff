/**
 * wave D: pages/index.vue dan ajratilgan computed (jami berilgan/olingan, sog'liq, kartalar).
 * Computed sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
import { ymLabel } from '@/utils/debtPlan'; // 22.10: "Qarzdan chiqish" satri

export default {
  computed: {
    isLoggedIn() { return !!this.$auth?.loggedIn; },
    userId() { return this.$auth?.user?.id || null; },
    isPassportExpired() {
      const d = this.$auth?.user?.expiry_date;
      return !!d && new Date(d) < new Date();
    },

    contractActiveCount() {
      return (this.analytics.contracts?.debitor?.chart?.jarayon || 0) +
             (this.analytics.contracts?.creditor?.chart?.jarayon || 0);
    },
    debitorChartAll() {
      return this.analytics.contracts?.debitor?.chart?.all || 0;
    },
    creditorChartAll() {
      return this.analytics.contracts?.creditor?.chart?.all || 0;
    },
    debitorUzsAmount() {
      const data = this.analytics.contracts?.debitor?.data || [];
      const found = data.find(i => i.currency === 'UZS');
      return found ? found.residual_amount : 0;
    },

    // Qarz shartnomasi moduli kartasi — debitor/kreditor qoldiq SUMMA (valyuta bo'yicha)
    // Manba: /home/analytics → contracts.debitor.data / contracts.creditor.data (valyuta bo'yicha guruhlangan)
    contractDebitorUzs() { return this._contractCurrencySum('debitor', 'UZS'); },
    contractDebitorUsd() { return this._contractCurrencySum('debitor', 'USD'); },
    contractCreditorUzs() { return this._contractCurrencySum('creditor', 'UZS'); },
    contractCreditorUsd() { return this._contractCurrencySum('creditor', 'USD'); },

    // Qarz daftari moduli kartasi uchun — FAQAT qarz daftari (shartnoma EMAS)
    daftariOlinganUzs() { return Number(this.combinedStats.olingan?.daftari?.uzs) || 0; },
    daftariOlinganUsd() { return Number(this.combinedStats.olingan?.daftari?.usd) || 0; },
    daftariBerilganUzs() { return Number(this.combinedStats.berilgan?.daftari?.uzs) || 0; },
    daftariBerilganUsd() { return Number(this.combinedStats.berilgan?.daftari?.usd) || 0; },

    // Jami olingan qarz (shartnoma + daftari) UZS
    combinedBorrowedUzs() {
      return (Number(this.combinedStats.olingan?.shartnoma?.uzs) || 0)
           + (Number(this.combinedStats.olingan?.daftari?.uzs) || 0);
    },
    combinedBorrowedUsd() {
      return (Number(this.combinedStats.olingan?.shartnoma?.usd) || 0)
           + (Number(this.combinedStats.olingan?.daftari?.usd) || 0);
    },
    // Jami berilgan qarz (shartnoma + daftari)
    combinedLentUzs() {
      return (Number(this.combinedStats.berilgan?.shartnoma?.uzs) || 0)
           + (Number(this.combinedStats.berilgan?.daftari?.uzs) || 0);
    },
    combinedLentUsd() {
      return (Number(this.combinedStats.berilgan?.shartnoma?.usd) || 0)
           + (Number(this.combinedStats.berilgan?.daftari?.usd) || 0);
    },

    idenTexts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: "Identifikatsiyadan o'ting", shortMessage: "Tizimning barcha imkoniyatlaridan to'liq foydalanish uchun mobil ilova orqali identifikatsiyadan o'ting.", message: "Hurmatli foydalanuvchi, siz identifikatsiyadan o'tmaganligingiz sababli tizimning asosiy funksiyalaridan foydalana olmaysiz. Iltimos, tizimdan to'liq foydalanish uchun quyidagi havola orqali mobil ilovani yuklab oling va identifikatsiyadan o'ting." },
        ru: { title: "Пройдите идентификацию", shortMessage: "Чтобы использовать все возможности системы, пройдите идентификацию через мобильное приложение.", message: "Уважаемый пользователь, вы не можете использовать основные функции системы, потому что не прошли идентификацию. Пожалуйста, загрузите мобильное приложение по ссылке ниже и пройдите идентификацию, чтобы в полной мере использовать систему." },
        kr: { title: "Идентификациядан ўтинг", shortMessage: "Тизимнинг барча имкониятларидан тўлиқ фойдаланиш учун мобил илова орқали идентификациядан ўтинг.", message: "Ҳурматли фойдаланувчи, сиз идентификациядан ўтмаганлигингиз сабабли тизимнинг асосий функцияларидан фойдалана олмайсиз. Илтимос, тизимдан тўлиқ фойдаланиш учун қуйидаги ҳавола орқали мобил иловани юклаб олинг ва идентификациядан ўтинг." },
        // SS-DEV (2026-09-26): en/kaa
        en: { title: "Complete identification", shortMessage: "Complete identification via the mobile app to use all features of the system.", message: "Dear user, you cannot use the main functions of the system because you have not completed identification. Please download the mobile app via the link below and complete identification to use the system fully." },
        kaa: { title: "Identifikaciyadan ótiń", shortMessage: "Sistemanıń barlıq múmkinshiliklerinen tolıq paydalanıw ushın mobil qosımsha arqalı identifikaciyadan ótiń.", message: "Húrmetli paydalanıwshı, siz identifikaciyadan ótpegenligińiz sebepli sistemanıń tiykarǵı funkciyalarınan paydalana almaysız. Iltimas, sistemadan tolıq paydalanıw ushın tómendegi silteme arqalı mobil qosımshanı júklep alıń hám identifikaciyadan ótiń." },
      };
      return t[l] || t.uz;
    },
    healthScoreColor() {
      const s = this.analytics.health?.score || 0;
      if (s >= 85) {return 'text-green-300';}
      if (s >= 70) {return 'text-yellow-300';}
      if (s >= 50) {return 'text-orange-300';}
      return 'text-red-300';
    },
    healthStatusText() {
      const status = this.analytics.health?.status || 'good';
      const map = {
        excellent: this.texts.healthExcellent,
        good: this.texts.healthGood,
        fair: this.texts.healthFair,
        poor: this.texts.healthPoor,
        // 21.10: barcha modullarda ma'lumot yo'q → ball null
        no_data: this.$t('fin_health.no_data'),
      };
      return map[status] || status;
    },
    budgetBarColor() {
      const pct = this.analytics.finance?.budget?.percentage || 0;
      if (pct > 100) {return 'bg-red-500';}
      if (pct > 80) {return 'bg-yellow-500';}
      return 'bg-green-500';
    },

    // Shaxsiy qarz (Shaxsiy moliya > Qarzlar) — UZS/USD alohida.
    // Manba: /home/analytics → debts { lent_uzs, lent_usd, borrowed_uzs, borrowed_usd }
    personalLentUzs() { return Number(this.analytics.debts?.lent_uzs) || 0; },
    personalLentUsd() { return Number(this.analytics.debts?.lent_usd) || 0; },
    personalBorrowedUzs() { return Number(this.analytics.debts?.borrowed_uzs) || 0; },
    personalBorrowedUsd() { return Number(this.analytics.debts?.borrowed_usd) || 0; },
    // 22.10 ("Qarzdan chiqish"): /home/analytics → debtPlan { progressPct, finishYm } (reja sozlangan bo'lsa)
    debtPlanLine() {
      const dp = this.analytics && this.analytics.debtPlan;
      if (!dp || (dp.progressPct == null && !dp.finishYm)) {return '';}
      const parts = [];
      if (dp.progressPct != null) {parts.push(Math.round(Number(dp.progressPct) || 0) + '%');}
      if (dp.finishYm) {parts.push(ymLabel(dp.finishYm, this.$t.bind(this), this.$i18n.locale));}
      return this.$t('debt_plan.title') + ': ' + parts.join(' · ');
    },

    // "Jami berilgan / Jami olingan qarz" kartalari — 3 manba nisbati:
    // Qarz shartnomasi + Qarz daftari (/qarz-daftari/dashboard) va Shaxsiy qarz
    // (/home/analytics). Jami summa va progress bar uchalasini hisobga oladi.
    overviewCards() {
      return [
        this.buildOverviewCard({
          key: 'berilgan',
          title: this.texts.totalLent,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          iconPath: 'M5 10l7-7m0 0l7 7m-7-7v18',
          shartnoma: this.combinedStats.berilgan?.shartnoma,
          daftari: this.combinedStats.berilgan?.daftari,
          shaxsiy: { uzs: this.personalLentUzs, usd: this.personalLentUsd },
        }),
        this.buildOverviewCard({
          key: 'olingan',
          title: this.texts.totalBorrowed,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          iconPath: 'M19 14l-7 7m0 0l-7-7m7 7V3',
          shartnoma: this.combinedStats.olingan?.shartnoma,
          daftari: this.combinedStats.olingan?.daftari,
          shaxsiy: { uzs: this.personalBorrowedUzs, usd: this.personalBorrowedUsd },
        }),
      ];
    },

    // Nisbat kartasi matnlari. "Shaxsiy qarz" — menu.personal_debt kaliti (5 til).
    ratioTexts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { totalLabel: 'Jami', shartnoma: 'Qarz shartnomasi', daftari: 'Qarz daftari', noData: "Ma'lumot yo'q", usdRateLabel: 'Markaziy bank kursi' },
        ru: { totalLabel: 'Всего', shartnoma: 'По договору', daftari: 'По книге', noData: 'Нет данных', usdRateLabel: 'Курс ЦБ' },
        kr: { totalLabel: 'Жами', shartnoma: 'Қарз шартномаси', daftari: 'Қарз дафтари', noData: "Маълумот йўқ", usdRateLabel: 'Марказий банк курси' },
        // SS-DEV (2026-09-26): en/kaa
        en: { totalLabel: 'Total', shartnoma: 'Loan agreement', daftari: 'Debt ledger', noData: "No data", usdRateLabel: 'Central Bank rate' },
        kaa: { totalLabel: 'Jámi', shartnoma: 'Qarız shártnaması', daftari: 'Qarız dápteri', noData: "Maǵlıwmat joq", usdRateLabel: 'Oraylıq bank kursı' },
      };
      return Object.assign({ shaxsiy: this.$t('menu.personal_debt') }, t[l] || t.uz);
    },

    texts() {
      return {
        welcome: this.$t('home_texts.welcome'),
        welcomeDesc: this.$t('home_texts.welcome_desc'),
        healthScore: this.$t('home_texts.health_score'),
        status: this.$t('home_texts.status'),
        healthExcellent: this.$t('home_texts.health_excellent'),
        healthGood: this.$t('home_texts.health_good'),
        healthFair: this.$t('home_texts.health_fair'),
        healthPoor: this.$t('home_texts.health_poor'),
        keyMetrics: this.$t('home_texts.key_metrics'),
        activeContracts: this.$t('home_texts.active_contracts'),
        receivableUzs: this.$t('home_texts.receivable_uzs'),
        totalBorrowed: this.$t('home_texts.total_borrowed'),
        totalLent: this.$t('home_texts.total_lent'),
        monthlyExpense: this.$t('home_texts.monthly_expense'),
        goalsProgress: this.$t('home_texts.goals_progress'),
        modulesOverview: this.$t('home_texts.modules_overview'),
        contractModule: this.$t('home_texts.contract_module'),
        debtModule: this.$t('home_texts.debt_module'),
        financeModule: this.$t('home_texts.finance_module'),
        debitorContracts: this.$t('home_texts.debitor_contracts'),
        creditorContracts: this.$t('home_texts.creditor_contracts'),
        borrowed: this.$t('home_texts.borrowed'),
        lent: this.$t('home_texts.lent'),
        overdueDebts: this.$t('home_texts.overdue_debts'),
        budget: this.$t('home_texts.budget'),
        expenses: this.$t('home_texts.expenses'),
        // home_texts'да "income" kaliti yo'q — mahalliylashtirilgan inline map (bySourceLabel uslubida)
        income: ({ uz: 'Daromad', kr: 'Даромад', ru: 'Доход', en: 'Income', kaa: 'Kiris' }[this.$i18n?.locale] || 'Daromad'),
        activeGoals: this.$t('home_texts.active_goals'),
        alertsTitle: this.$t('home_texts.alerts_title'),
        alertCount: this.$t('home_texts.alert_count'),
        view: this.$t('home_texts.view'),
        quickActions: this.$t('home_texts.quick_actions'),
        addExpense: this.$t('home_texts.add_expense'),
        addDebt: this.$t('home_texts.add_debt'),
        alert_expiring_debitor: this.$t('home_texts.alert_expiring_debitor'),
        alert_expiring_creditor: this.$t('home_texts.alert_expiring_creditor'),
        alert_expired_debitor: this.$t('home_texts.alert_expired_debitor'),
        alert_expired_creditor: this.$t('home_texts.alert_expired_creditor'),
        alert_overdue_debts: this.$t('home_texts.alert_overdue_debts'),
        alert_budget_exceeded: this.$t('home_texts.alert_budget_exceeded'),
        alert_budget_warning: this.$t('home_texts.alert_budget_warning'),
        alert_upcoming_payments: this.$t('home_texts.alert_upcoming_payments'),
        loadErrorMsg: this.$t('home_texts.load_error_msg'),
        retry: this.$t('home_texts.retry'),
        bySource: this.bySourceLabel,
        viewSection: this.viewSectionLabel,
      };
    },

    bySourceLabel() {
      const l = this.$i18n?.locale || 'uz';
      return { uz: "manbalar bo'yicha", ru: 'по источникам', kr: "манбалар бўйича", en: 'by source', kaa: 'derekler boyınsha' }[l] || "manbalar bo'yicha"; // SS-DEV (2026-09-26): en/kaa
    },
    viewSectionLabel() {
      const l = this.$i18n?.locale || 'uz';
      return { uz: "Bo'limga o'tish", ru: 'Перейти в раздел', kr: "Бўлимга ўтиш", en: 'Go to module', kaa: 'Bólimge ótiw' }[l] || "Bo'limga o'tish"; // SS-DEV (2026-09-26): en/kaa
    },
    // "Umumiy ko'rinish" (shartnoma va daftari nisbati) — qarz-daftaridan ko'chirildi (Task 6a)
    overviewTitle() {
      const l = this.$i18n?.locale || 'uz';
      return { uz: "Umumiy ko'rinish", ru: 'Обзор', kr: "Умумий кўриниш", en: 'Overview', kaa: 'Ulıwma kórinis' }[l] || "Umumiy ko'rinish"; // SS-DEV (2026-09-26): en/kaa
    },
    // (overviewDesc OLIB TASHLANDI — SS1-1: tagsarlavha endi ko'rsatilmaydi.)
  },
};
