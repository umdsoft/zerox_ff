/**
 * wave D: components/LandingPage.vue dan ajratilgan landing matnlari (uz/ru/kr/kaa/en). `getLandingTexts(locale)` — noma'lum til uchun uz.
 */
const TRANSLATIONS = {
  uz: {
    nav: {
      modules: 'Modullar',
      features: 'Imkoniyatlar',
      howItWorks: 'Qanday ishlaydi',
      pricing: 'Tariflar',
      download: 'Yuklab olish',
      login: 'Kirish',
      register: "Ro'yxatdan o'tish"
    },
    // SS20 (2026-09-21): hero endi bitta modul emas, BUTUN platformani ifodalaydi
    hero: {
      trusted: "200+ shartnoma rasmiylashtirilgan",
      title: "Qarz va moliyani ",
      titleHighlight: "bir joyda boshqaring",
      description: "ZeroX - qarz shartnomasi, qarz daftari, shaxsiy qarz va shaxsiy moliya bitta platformada. Oldi-berdini rasmiylashtiring, nasiya savdosini yuriting va budjetingizni nazorat qiling.",
      getStarted: "Bepul boshlash",
      watchDemo: "Modullarni ko'rish"
    },
    // SS20 (2026-09-21): imkoniyatlar HAQIQIY koddan olingan (pages/contract*,
    // pages/qarz-daftari/**, pages/finance/**) — o'ylab topilgani yo'q.
    modules: {
      title: "Bir platforma - to'rtta bo'lim",
      description: "Har bir ehtiyoj uchun alohida modul. Barchasi bitta ZeroX hisobida.",
      cta: "Boshlash",
      items: [
        {
          name: "Qarz shartnomasi",
          desc: "Qarz oldi-berdini rasmiy elektron shartnoma bilan mustahkamlang.",
          features: [
            "Qarz shartnomasi huquqiy asosga ega", // SS-DEV (2026-09-24)
            "Ikki tomonlama elektron tasdiqlash",
            "PDF hujjat va QR-kod orqali qidiruv",
            "Muddatni uzaytirish, talab qilish, voz kechish",
            "Qarz tarixi va foydalanuvchi reytingi"
          ]
        },
        {
          name: "Qarz daftari",
          desc: "Do'kon va savdo nuqtalari uchun elektron nasiya daftari.",
          features: [
            "Savdo faoliyati (do'kon) va mijozlar bazasi",
            "Qarzga berish/olish, bo'lib to'lash jadvali",
            "SMS eslatma va to'lovni talab qilish",
            "Xodimlar, kvitansiya va qarz kalendari"
          ]
        },
        {
          name: "Shaxsiy qarz",
          desc: "Do'st va qarindoshlar bilan shaxsiy qarz oldi-berdisini yuriting.",
          features: [
            "Berilgan va olingan qarzlar, qisman to'lovlar",
            "Plastik karta rekvizitlari bilan qaytarishni talab qilish",
            "UZS va USD, qarzdorlar bo'yicha guruhlash",
            "Hamkor qaydlari va do'kon qarzlari bir joyda"
          ]
        },
        {
          name: "Shaxsiy moliya",
          desc: "Shaxsiy va oilaviy budjetingizni to'liq nazorat qiling.",
          features: [
            "Xarajat va daromadlar kategoriyalar bo'yicha",
            "Budjet, maqsadlar va kutilayotgan daromadlar",
            "Analitika, hisobotlar va moliyaviy tavsiyalar",
            "Oila moliyasi, to'lovlar kalendari", "Gap (Чёрная касса) - navbatli jamg'arma"
          ]
        }
      ]
    },
    stats: {
      users: "Foydalanuvchilar",
      contracts: "Shartnomalar",
      satisfaction: "Ishonchlilik"
    },
    dashboard: {
      totalDebt: "Umumiy balans",
      debitor: "Berilgan qarz",
      creditor: "Olingan qarz",
      // 29.09 (doc1 27-rasm): hero kartasi — barcha modullar
      thisMonth: "Bu oy", creditSales: "Nasiya savdo", customers: "ta mijoz", collected: "Undirildi", income: "Daromad", expense: "Xarajat", budget: "Budjet", repaid: "Qarz qaytarildi", reminder: "Ertaga qaytarish muddati"
    },
    // SS20 (2026-09-21): "Nima uchun ZeroX?" endi 4 modulni qamraydi
    features: {
      title: "Nima uchun ZeroX?",
      description: "Qarz munosabatlari va shaxsiy moliyani boshqarishda to'liq va ishonchli yechim",
      items: [
        { title: "Bitta hisob - to'rtta modul", desc: "Qarz shartnomasi, qarz daftari, shaxsiy qarz va shaxsiy moliya bitta ZeroX hisobingizda." },
        { title: "Rasmiy elektron shartnoma", desc: "Qarz oldi-berdi ikki tomonlama tasdiqlanadi va PDF hujjat sifatida saqlanadi." },
        { title: "Eslatmalar va SMS", desc: "Qaytarish muddati yaqinlashganda bildirishnoma, mijozga esa SMS eslatma yuboriladi." },
        { title: "Qarz tarixi va reyting", desc: "Har bir foydalanuvchining qarz tarixi va intizom reytingi shaffof ko'rinadi." },
        { title: "Biznes uchun qulay", desc: "Do'kon, xodimlar, kvitansiya va bo'lib to'lash - nasiya savdosi to'liq nazoratda." },
        { title: "Mobil ilova va ko'p valyuta", desc: "iOS va Android ilovalari, UZS va USD bilan ishlash. Istalgan joydan boshqaring." }
      ]
    },
    pricing: {
      title: 'Tariflar',
      description: "Qarz daftari va qarz shartnomasi bo'yicha narxlar. Ro'yxatdan o'tish bepul.",
      contractTitle: 'Qarz shartnomasi — mutlaqo bepul qarz berishda',
      contractDesc: "Har bir shartnoma uchun narx:", // SS-DEV (2026-09-24), hujjat-4 7-band
      startFree: 'Bepul boshlash', choose: 'Tanlash',
    },
    howItWorks: {
      title: "Qanday ishlaydi?",
      description: "3 ta oddiy qadamda ZeroX bilan ishlashni boshlang",
      steps: [
        { title: "Ro'yxatdan o'ting", desc: "Telefon raqamingiz orqali bepul ro'yxatdan o'ting va shaxsingizni tasdiqlang." },
        { title: "Kerakli bo'limni tanlang", desc: "Qarz shartnomasi, qarz daftari, shaxsiy qarz yoki shaxsiy moliya - ehtiyojingizga mos modulni oching." },
        { title: "Boshqaring va nazorat qiling", desc: "Qarzlar, to'lovlar va budjet bir joyda: eslatmalar, hisobotlar va hujjatlar avtomatik tayyorlanadi." }
      ]
    },
    download: {
      title: "Mobil ilovani yuklab oling",
      description: "iOS va Android uchun bepul mobil ilova. To'rtala bo'lim - shartnoma, qarz daftari, shaxsiy qarz va moliya - cho'ntagingizda.",
      badge: "Bepul yuklab oling",
      rating: "Reyting",
      downloads: "Yuklab olishlar",
      free: "Bepul",
      scanQr: "QR-kodni skanerlang",
      secure: "Xavfsiz",
      fast: "Tez"
    },
    cta: {
      title: "ZeroX bilan bugun boshlang!",
      description: "Qarz shartnomasi, qarz daftari, shaxsiy qarz va shaxsiy moliya - barchasi bitta bepul hisobda.",
      button: "Bepul boshlash"
    },
    footer: {
      description: "ZeroX - qarz munosabatlari va shaxsiy moliyani elektron boshqarish platformasi.",
      linksTitle: "Havolalar",
      contactTitle: "Aloqa",
      instruction: "Yo'riqnoma",
      rights: "Barcha huquqlar himoyalangan."
    }
  },
  ru: {
    nav: {
      modules: 'Модули',
      features: 'Возможности',
      howItWorks: 'Как это работает',
      pricing: 'Тарифы',
      download: 'Скачать',
      login: 'Войти',
      register: 'Регистрация'
    },
    hero: {
      trusted: "Оформлено 200+ договоров",
      title: "Долги и финансы — ",
      titleHighlight: "в одном месте",
      description: "ZeroX — договор займа, долговая книга, личные долги и личные финансы на одной платформе. Оформляйте займы, ведите торговлю в долг и контролируйте бюджет.",
      getStarted: "Начать бесплатно",
      watchDemo: "Посмотреть модули"
    },
    modules: {
      title: "Одна платформа — четыре раздела",
      description: "Отдельный модуль для каждой задачи. Всё в одном аккаунте ZeroX.",
      cta: "Начать",
      items: [
        {
          name: "Договор займа",
          desc: "Закрепите долговую операцию официальным электронным договором.",
          features: [
            "Договор займа имеет юридическую силу", // SS-DEV (2026-09-24)
            "Двустороннее электронное подтверждение",
            "PDF-документ и поиск по QR-коду",
            "Продление срока, требование возврата, прощение долга",
            "Долговая история и рейтинг пользователя"
          ]
        },
        {
          name: "Долговая книга",
          desc: "Электронная книга продаж в долг для магазинов и торговых точек.",
          features: [
            "Торговая деятельность (магазин) и база клиентов",
            "Выдача/получение долга, график рассрочки",
            "SMS-напоминания и требование оплаты",
            "Сотрудники, квитанция и календарь долгов"
          ]
        },
        {
          name: "Личные долги",
          desc: "Ведите личные долговые отношения с друзьями и родственниками.",
          features: [
            "Выданные и полученные долги, частичные платежи",
            "Требование возврата с реквизитами пластиковой карты",
            "UZS и USD, группировка по должникам",
            "Записи партнёров и долги магазинов в одном месте"
          ]
        },
        {
          name: "Личные финансы",
          desc: "Полный контроль личного и семейного бюджета.",
          features: [
            "Расходы и доходы по категориям",
            "Бюджет, цели и ожидаемые доходы",
            "Аналитика, отчёты и финансовые советы",
            "Семейные финансы, календарь платежей", "Gap (Чёрная касса) - накопление по очереди"
          ]
        }
      ]
    },
    stats: {
      users: "Пользователей",
      contracts: "Договоров",
      satisfaction: "Надёжность"
    },
    dashboard: {
      totalDebt: "Общий баланс",
      debitor: "Выданный долг",
      creditor: "Полученный долг",
      thisMonth: "Этот месяц", creditSales: "Продажи в долг", customers: "клиентов", collected: "Взыскано", income: "Доход", expense: "Расход", budget: "Бюджет", repaid: "Долг возвращён", reminder: "Завтра срок возврата"
    },
    features: {
      title: "Почему ZeroX?",
      description: "Полное и надёжное решение для управления долговыми отношениями и личными финансами",
      items: [
        { title: "Один аккаунт — четыре модуля", desc: "Договор займа, долговая книга, личные долги и личные финансы в одном аккаунте ZeroX." },
        { title: "Официальный электронный договор", desc: "Долговая операция подтверждается обеими сторонами и сохраняется в виде PDF-документа." },
        { title: "Напоминания и SMS", desc: "Уведомление при приближении срока возврата, а клиенту отправляется SMS-напоминание." },
        { title: "Долговая история и рейтинг", desc: "Долговая история и рейтинг дисциплины каждого пользователя прозрачны." },
        { title: "Удобно для бизнеса", desc: "Магазин, сотрудники, квитанции и рассрочка — торговля в долг под полным контролем." },
        { title: "Приложение и мультивалютность", desc: "Приложения для iOS и Android, работа с UZS и USD. Управляйте откуда угодно." }
      ]
    },
    pricing: {
      title: 'Тарифы',
      description: 'Цены на долговую книгу и договор займа. Регистрация бесплатна.',
      contractTitle: 'Договор займа — бесплатно при выдаче займа',
      contractDesc: 'Стоимость каждого договора:',
      startFree: 'Начать бесплатно', choose: 'Выбрать',
    },
    howItWorks: {
      title: "Как это работает?",
      description: "Начните работу с ZeroX всего за 3 простых шага",
      steps: [
        { title: "Зарегистрируйтесь", desc: "Зарегистрируйтесь бесплатно по номеру телефона и подтвердите вашу личность." },
        { title: "Выберите нужный раздел", desc: "Договор займа, долговая книга, личные долги или личные финансы — откройте подходящий модуль." },
        { title: "Управляйте и контролируйте", desc: "Долги, платежи и бюджет в одном месте: напоминания, отчёты и документы формируются автоматически." }
      ]
    },
    download: {
      title: "Скачайте мобильное приложение",
      description: "Бесплатное приложение для iOS и Android. Все четыре раздела — договор, долговая книга, личные долги и финансы — в вашем кармане.",
      badge: "Скачать бесплатно",
      rating: "Рейтинг",
      downloads: "Скачиваний",
      free: "Бесплатно",
      scanQr: "Сканируйте QR-код",
      secure: "Безопасно",
      fast: "Быстро"
    },
    cta: {
      title: "Начните с ZeroX уже сегодня!",
      description: "Договор займа, долговая книга, личные долги и личные финансы — всё в одном бесплатном аккаунте.",
      button: "Начать бесплатно"
    },
    footer: {
      description: "ZeroX — платформа электронного управления долговыми отношениями и личными финансами.",
      linksTitle: "Ссылки",
      contactTitle: "Контакты",
      instruction: "Инструкция",
      rights: "Все права защищены."
    }
  },
  kr: {
    nav: {
      modules: 'Модуллар',
      features: 'Имкониятлар',
      howItWorks: 'Қандай ишлайди',
      pricing: 'Тарифлар',
      download: 'Юклаб олиш',
      login: 'Кириш',
      register: "Рўйхатдан ўтиш"
    },
    hero: {
      trusted: "200+ шартнома расмийлаштирилган",
      title: "Қарз ва молияни ",
      titleHighlight: "бир жойда бошқаринг",
      description: "ZeroX - қарз шартномаси, қарз дафтари, шахсий қарз ва шахсий молия битта платформада. Олди-бердини расмийлаштиринг, насия савдосини юритинг ва бюджетингизни назорат қилинг.",
      getStarted: "Бепул бошлаш",
      watchDemo: "Модулларни кўриш"
    },
    modules: {
      title: "Бир платформа - тўртта бўлим",
      description: "Ҳар бир эҳтиёж учун алоҳида модул. Барчаси битта ZeroX ҳисобида.",
      cta: "Бошлаш",
      items: [
        {
          name: "Қарз шартномаси",
          desc: "Қарз олди-бердини расмий электрон шартнома билан мустаҳкамланг.",
          features: [
            "Қарз шартномаси ҳуқуқий асосга эга", // SS-DEV (2026-09-24)
            "Икки томонлама электрон тасдиқлаш",
            "PDF ҳужжат ва QR-код орқали қидирув",
            "Муддатни узайтириш, талаб қилиш, воз кечиш",
            "Қарз тарихи ва фойдаланувчи рейтинги"
          ]
        },
        {
          name: "Қарз дафтари",
          desc: "Дўкон ва савдо нуқталари учун электрон насия дафтари.",
          features: [
            "Савдо фаолияти (дўкон) ва мижозлар базаси",
            "Қарзга бериш/олиш, бўлиб тўлаш жадвали",
            "SMS эслатма ва тўловни талаб қилиш",
            "Ходимлар, квитансия ва қарз календари"
          ]
        },
        {
          name: "Шахсий қарз",
          desc: "Дўст ва қариндошлар билан шахсий қарз олди-бердисини юритинг.",
          features: [
            "Берилган ва олинган қарзлар, қисман тўловлар",
            "Пластик карта реквизитлари билан қайтаришни талаб қилиш",
            "UZS ва USD, қарздорлар бўйича гуруҳлаш",
            "Ҳамкор қайдлари ва дўкон қарзлари бир жойда"
          ]
        },
        {
          name: "Шахсий молия",
          desc: "Шахсий ва оилавий бюджетингизни тўлиқ назорат қилинг.",
          features: [
            "Харажат ва даромадлар категориялар бўйича",
            "Бюджет, мақсадлар ва кутилаётган даромадлар",
            "Аналитика, ҳисоботлар ва молиявий тавсиялар",
            "Оила молияси, тўловлар календари", "Gap (Чёрная касса) - навбатли жамғарма"
          ]
        }
      ]
    },
    stats: {
      users: "Фойдаланувчилар",
      contracts: "Шартномалар",
      satisfaction: "Ишончлилик"
    },
    dashboard: {
      totalDebt: "Умумий баланс",
      debitor: "Берилган қарз",
      creditor: "Олинган қарз",
      thisMonth: "Бу ой", creditSales: "Насия савдо", customers: "та мижоз", collected: "Ундирилди", income: "Даромад", expense: "Харажат", budget: "Бюджет", repaid: "Қарз қайтарилди", reminder: "Эртага қайтариш муддати"
    },
    features: {
      title: "Нима учун ZeroX?",
      description: "Қарз муносабатлари ва шахсий молияни бошқаришда тўлиқ ва ишончли ечим",
      items: [
        { title: "Битта ҳисоб - тўртта модул", desc: "Қарз шартномаси, қарз дафтари, шахсий қарз ва шахсий молия битта ZeroX ҳисобингизда." },
        { title: "Расмий электрон шартнома", desc: "Қарз олди-берди икки томонлама тасдиқланади ва PDF ҳужжат сифатида сақланади." },
        { title: "Эслатмалар ва SMS", desc: "Қайтариш муддати яқинлашганда билдиришнома, мижозга эса SMS эслатма юборилади." },
        { title: "Қарз тарихи ва рейтинг", desc: "Ҳар бир фойдаланувчининг қарз тарихи ва интизом рейтинги шаффоф кўринади." },
        { title: "Бизнес учун қулай", desc: "Дўкон, ходимлар, квитансия ва бўлиб тўлаш - насия савдоси тўлиқ назоратда." },
        { title: "Мобил илова ва кўп валюта", desc: "iOS ва Android иловалари, UZS ва USD билан ишлаш. Исталган жойдан бошқаринг." }
      ]
    },
    pricing: {
      title: 'Тарифлар',
      description: "Қарз дафтари ва қарз шартномаси бўйича нархлар. Рўйхатдан ўтиш бепул.",
      contractTitle: 'Қарз шартномаси — мутлақо бепул қарз беришда',
      contractDesc: "Ҳар бир шартнома учун нарх:",
      startFree: 'Бепул бошлаш', choose: 'Танлаш',
    },
    howItWorks: {
      title: "Қандай ишлайди?",
      description: "3 та оддий қадамда ZeroX билан ишлашни бошланг",
      steps: [
        { title: "Рўйхатдан ўтинг", desc: "Телефон рақамингиз орқали бепул рўйхатдан ўтинг ва шахсингизни тасдиқланг." },
        { title: "Керакли бўлимни танланг", desc: "Қарз шартномаси, қарз дафтари, шахсий қарз ёки шахсий молия - эҳтиёжингизга мос модулни очинг." },
        { title: "Бошқаринг ва назорат қилинг", desc: "Қарзлар, тўловлар ва бюджет бир жойда: эслатмалар, ҳисоботлар ва ҳужжатлар автоматик тайёрланади." }
      ]
    },
    download: {
      title: "Мобил иловани юклаб олинг",
      description: "iOS ва Android учун бепул мобил илова. Тўртала бўлим - шартнома, қарз дафтари, шахсий қарз ва молия - чўнтагингизда.",
      badge: "Бепул юклаб олинг",
      rating: "Рейтинг",
      downloads: "Юклаб олишлар",
      free: "Бепул",
      scanQr: "QR-кодни сканерланг",
      secure: "Хавфсиз",
      fast: "Тез"
    },
    cta: {
      title: "ZeroX билан бугун бошланг!",
      description: "Қарз шартномаси, қарз дафтари, шахсий қарз ва шахсий молия - барчаси битта бепул ҳисобда.",
      button: "Бепул бошлаш"
    },
    footer: {
      description: "ZeroX - қарз муносабатлари ва шахсий молияни электрон бошқариш платформаси.",
      linksTitle: "Ҳаволалар",
      contactTitle: "Алоқа",
      instruction: "Йўриқнома",
      rights: "Барча ҳуқуқлар ҳимояланган."
    }
  },
  // SS-DEV (2026-09-26): ingliz tili
  en: {
    nav: {
      modules: 'Modules',
      features: 'Features',
      howItWorks: 'How it works',
      pricing: 'Pricing',
      download: 'Download',
      login: 'Log in',
      register: 'Sign up'
    },
    hero: {
      trusted: "200+ agreements formalised",
      title: "Manage debts and finances ",
      titleHighlight: "in one place",
      description: "ZeroX - loan agreements, debt ledger, personal debts and personal finance on a single platform. Formalise lending, run credit sales and keep your budget under control.",
      getStarted: "Get started for free",
      watchDemo: "View modules"
    },
    modules: {
      title: "One platform - four modules",
      description: "A separate module for every need. All in one ZeroX account.",
      cta: "Get started",
      items: [
        {
          name: "Loan agreement",
          desc: "Secure your lending with an official electronic agreement.",
          features: [
            "The loan agreement has legal force",
            "Two-sided electronic confirmation",
            "PDF document and QR-code search",
            "Extend the term, demand repayment, waive the debt",
            "Debt history and user rating"
          ]
        },
        {
          name: "Debt ledger",
          desc: "An electronic credit ledger for shops and retail outlets.",
          features: [
            "Business (shop) and customer database",
            "Lending/borrowing, instalment schedule",
            "SMS reminders and payment demands",
            "Employees, receipts and debt calendar"
          ]
        },
        {
          name: "Personal debt",
          desc: "Keep track of personal debts with friends and relatives.",
          features: [
            "Lent and borrowed debts, partial payments",
            "Demand repayment with bank card details",
            "UZS and USD, grouping by debtor",
            "Partner records and shop debts in one place"
          ]
        },
        {
          name: "Personal finance",
          desc: "Take full control of your personal and family budget.",
          features: [
            "Expenses and income by category",
            "Budget, goals and expected income",
            "Analytics, reports and financial advice",
            "Family finances, payment calendar", "Gap (Чёрная касса) - rotating savings"
          ]
        }
      ]
    },
    stats: {
      users: "Users",
      contracts: "Agreements",
      satisfaction: "Reliability"
    },
    dashboard: {
      totalDebt: "Total balance",
      debitor: "Money lent",
      creditor: "Money borrowed",
      thisMonth: "This month", creditSales: "Credit sales", customers: "customers", collected: "Collected", income: "Income", expense: "Expenses", budget: "Budget", repaid: "Debt repaid", reminder: "Repayment due tomorrow"
    },
    features: {
      title: "Why ZeroX?",
      description: "A complete and reliable solution for managing debt relations and personal finance",
      items: [
        { title: "One account - four modules", desc: "Loan agreements, debt ledger, personal debts and personal finance in your single ZeroX account." },
        { title: "Official electronic agreement", desc: "Lending is confirmed by both parties and stored as a PDF document." },
        { title: "Reminders and SMS", desc: "A notification when the due date approaches, and an SMS reminder to the customer." },
        { title: "Debt history and rating", desc: "Every user's debt history and discipline rating are transparent." },
        { title: "Convenient for business", desc: "Shop, employees, receipts and instalments - credit sales fully under control." },
        { title: "Mobile app and multi-currency", desc: "iOS and Android apps, work with UZS and USD. Manage from anywhere." }
      ]
    },
    pricing: {
      title: 'Pricing',
      description: "Prices for the debt ledger and loan agreements. Registration is free.",
      contractTitle: 'Loan agreement — completely free when lending',
      contractDesc: "Price per agreement:",
      startFree: 'Get started for free', choose: 'Choose',
    },
    howItWorks: {
      title: "How does it work?",
      description: "Start working with ZeroX in 3 simple steps",
      steps: [
        { title: "Sign up", desc: "Register for free with your phone number and verify your identity." },
        { title: "Choose a module", desc: "Loan agreement, debt ledger, personal debt or personal finance - open the module that fits your needs." },
        { title: "Manage and control", desc: "Debts, payments and budget in one place: reminders, reports and documents are prepared automatically." }
      ]
    },
    download: {
      title: "Download the mobile app",
      description: "A free mobile app for iOS and Android. All four modules - agreements, debt ledger, personal debt and finance - in your pocket.",
      badge: "Download for free",
      rating: "Rating",
      downloads: "Downloads",
      free: "Free",
      scanQr: "Scan the QR code",
      secure: "Secure",
      fast: "Fast"
    },
    cta: {
      title: "Start with ZeroX today!",
      description: "Loan agreements, debt ledger, personal debts and personal finance - all in one free account.",
      button: "Get started for free"
    },
    footer: {
      description: "ZeroX - a platform for electronic management of debt relations and personal finance.",
      linksTitle: "Links",
      contactTitle: "Contact",
      instruction: "User guide",
      rights: "All rights reserved."
    }
  },
  // SS-DEV (2026-09-26): qoraqalpoq tili (lotin)
  kaa: {
    nav: {
      modules: 'Modullar',
      features: 'Múmkinshilikler',
      howItWorks: 'Qalay isleydi',
      pricing: 'Tarifler',
      download: 'Júklep alıw',
      login: 'Kiriw',
      register: 'Dizimnen ótiw'
    },
    hero: {
      trusted: "200+ shártnama rásmiylestirilgen",
      title: "Qarız hám qarjını ",
      titleHighlight: "bir jerde basqarıń",
      description: "ZeroX - qarız shártnaması, qarız dápteri, jeke qarız hám jeke qarjı bir platformada. Alıs-beristi rásmiylestiriń, nesiye sawdasın júrgiziń hám byudjetińizdi qadaǵalań.",
      getStarted: "Biypul baslaw",
      watchDemo: "Modullardı kóriw"
    },
    modules: {
      title: "Bir platforma - tórt bólim",
      description: "Hár bir mútájlik ushın bólek modul. Hámmesi bir ZeroX esabında.",
      cta: "Baslaw",
      items: [
        {
          name: "Qarız shártnaması",
          desc: "Qarız alıs-beristi rásmiy elektron shártnama menen bekkemleń.",
          features: [
            "Qarız shártnaması huqıqıy tiykarǵa iye",
            "Eki tárepleme elektron tastıyıqlaw",
            "PDF hújjet hám QR-kod arqalı izlew",
            "Múddetti uzaytıw, talap etiw, waz keshiw",
            "Qarız tariyxı hám paydalanıwshı reytingi"
          ]
        },
        {
          name: "Qarız dápteri",
          desc: "Dúkan hám sawda noqatları ushın elektron nesiye dápteri.",
          features: [
            "Sawda iskerligi (dúkan) hám klientler bazası",
            "Qarızǵa beriw/alıw, bólip tólew kestesi",
            "SMS eslatpa hám tólemdi talap etiw",
            "Xızmetkerler, kvitanciya hám qarız kalendarı"
          ]
        },
        {
          name: "Jeke qarız",
          desc: "Doslar hám tuwısqanlar menen jeke qarız alıs-berisin júrgiziń.",
          features: [
            "Berilgen hám alınǵan qarızlar, bólekley tólemler",
            "Plastik karta rekvizitleri menen qaytarıwdı talap etiw",
            "UZS hám USD, qarızdarlar boyınsha toparlaw",
            "Sherik jazıwları hám dúkan qarızları bir jerde"
          ]
        },
        {
          name: "Jeke qarjı",
          desc: "Jeke hám shańaraqlıq byudjetińizdi tolıq qadaǵalań.",
          features: [
            "Shıǵın hám kirisler kategoriyalar boyınsha",
            "Byudjet, maqsetler hám kútilip atırǵan kirisler",
            "Analitika, esabatlar hám qarjılıq usınıslar",
            "Shańaraq qarjısı, tólemler kalendarı", "Gap (Чёрная касса) - gezekli jámǵarma"
          ]
        }
      ]
    },
    stats: {
      users: "Paydalanıwshılar",
      contracts: "Shártnamalar",
      satisfaction: "Isenimlilik"
    },
    dashboard: {
      totalDebt: "Ulıwma balans",
      debitor: "Berilgen qarız",
      creditor: "Alınǵan qarız",
      thisMonth: "Bul ay", creditSales: "Nasiya sawda", customers: "klient", collected: "Óndirildi", income: "Dáramat", expense: "Qárejet", budget: "Byudjet", repaid: "Qarız qaytarıldı", reminder: "Erteń qaytarıw múddeti"
    },
    features: {
      title: "Ne ushın ZeroX?",
      description: "Qarız munásebetleri hám jeke qarjını basqarıwda tolıq hám isenimli sheshim",
      items: [
        { title: "Bir esap - tórt modul", desc: "Qarız shártnaması, qarız dápteri, jeke qarız hám jeke qarjı bir ZeroX esabıńızda." },
        { title: "Rásmiy elektron shártnama", desc: "Qarız alıs-beris eki tárepleme tastıyıqlanadı hám PDF hújjet sıpatında saqlanadı." },
        { title: "Eslatpalar hám SMS", desc: "Qaytarıw múddeti jaqınlasqanda bildiriw, klientke bolsa SMS eslatpa jiberiledi." },
        { title: "Qarız tariyxı hám reyting", desc: "Hár bir paydalanıwshınıń qarız tariyxı hám tártip reytingi ashıq kórinedi." },
        { title: "Biznes ushın qolaylı", desc: "Dúkan, xızmetkerler, kvitanciya hám bólip tólew - nesiye sawdası tolıq qadaǵalawda." },
        { title: "Mobil qosımsha hám kóp valyuta", desc: "iOS hám Android qosımshaları, UZS hám USD menen islew. Qálegen jerden basqarıń." }
      ]
    },
    pricing: {
      title: 'Tarifler',
      description: "Qarız dápteri hám qarız shártnaması boyınsha bahalar. Dizimnen ótiw biypul.",
      contractTitle: 'Qarız shártnaması — qarız beriwde pútkilley biypul',
      contractDesc: "Hár bir shártnama ushın baha:",
      startFree: 'Biypul baslaw', choose: 'Saylaw',
    },
    howItWorks: {
      title: "Qalay isleydi?",
      description: "3 ápiwayı qádemde ZeroX penen islewdi baslań",
      steps: [
        { title: "Dizimnen ótiń", desc: "Telefon nomerińiz arqalı biypul dizimnen ótiń hám shaxsıńızdı tastıyıqlań." },
        { title: "Kerekli bólimdi saylań", desc: "Qarız shártnaması, qarız dápteri, jeke qarız yamasa jeke qarjı - mútájligińizge sáykes moduldı ashıń." },
        { title: "Basqarıń hám qadaǵalań", desc: "Qarızlar, tólemler hám byudjet bir jerde: eslatpalar, esabatlar hám hújjetler avtomat tayarlanadı." }
      ]
    },
    download: {
      title: "Mobil qosımshanı júklep alıń",
      description: "iOS hám Android ushın biypul mobil qosımsha. Tórt bólim de - shártnama, qarız dápteri, jeke qarız hám qarjı - qaltańızda.",
      badge: "Biypul júklep alıń",
      rating: "Reyting",
      downloads: "Júklep alıwlar",
      free: "Biypul",
      scanQr: "QR-kodtı skanerleń",
      secure: "Qáwipsiz",
      fast: "Tez"
    },
    cta: {
      title: "ZeroX penen búgin baslań!",
      description: "Qarız shártnaması, qarız dápteri, jeke qarız hám jeke qarjı - hámmesi bir biypul esapta.",
      button: "Biypul baslaw"
    },
    footer: {
      description: "ZeroX - qarız munásebetleri hám jeke qarjını elektron basqarıw platforması.",
      linksTitle: "Siltemeler",
      contactTitle: "Baylanıs",
      instruction: "Qollanba",
      rights: "Barlıq huqıqlar qorǵalǵan."
    }
  },
};

export function getLandingTexts(locale) {
  return TRANSLATIONS[locale] || TRANSLATIONS.uz;
}
