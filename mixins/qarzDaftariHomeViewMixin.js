/**
 * wave D: pages/qarz-daftari/index.vue dan ajratilgan computed'lar.
 * Computed sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */

/** 21.10: asosiy ZeroX Telegram boti (prod @ZeroXuzbot; username registrga sezgir emas) */
const TG_BOT_URL = 'https://t.me/ZeroXuzbot';

export default {
  computed: {
    tgBotUrl() { return TG_BOT_URL; },
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
      if (!this.selectedDokonId || this.selectedDokonId === 'all') {return null;}
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
          pageSubtitle: "Qarz oldi-berdi munosabatlaringizni elektron boshqaring.", tgBot: "Telegram botga o'tish",
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
          pageSubtitle: "Управляйте долговыми отношениями электронно.", tgBot: "Перейти в Telegram-бот",
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
          pageSubtitle: "Қарз олди-берди муносабатларингизни электрон бошқаринг.", tgBot: "Телеграм ботга ўтиш",
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
          pageSubtitle: "Manage your lending relationships electronically.", tgBot: "Open the Telegram bot",
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
          pageSubtitle: "Qarız alıs-beris munásebetlerińizdi elektron basqarıń.", tgBot: "Telegram botqa ótiw",
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
};
