/**
 * wave D: pages/auth/login.vue dan ajratilgan computed (matnlar/testimoniallar/modal matnlari).
 * Computed sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
export default {
  computed: {
    testimonials() {
      const locale = this.$i18n?.locale || 'uz';
      const data = {
        uz: [
          { text: "ZeroX orqali do'stimga qarz berdim. Shartnoma tuzildi, hamma narsa rasmiy. Endi hech qanday muammo yo'q.", name: "Aziz Karimov", role: "Tadbirkor", initials: "AK" },
          { text: "Oldin qarz berishdan qo'rqardim. Endi ZeroX bilan xavfsiz. Shartnoma ikki tomonlama tasdiqlanadi.", name: "Malika Rahimova", role: "Buxgalter", initials: "MR" },
          { text: "Mobil ilova juda qulay. Istalgan joydan shartnoma tuzish mumkin. Tavsiya qilaman!", name: "Jasur Toshmatov", role: "Dasturchi", initials: "JT" },
          { text: "To'lov muddati yaqinlashganda eslatma keladi. Hech qachon unutmayman. Zo'r xizmat!", name: "Nilufar Saidova", role: "O'qituvchi", initials: "NS" },
          { text: "Qarzdorlar ro'yxatini bir joyda ko'rish juda qulay. QR kod orqali tez qidirish ajoyib.", name: "Bobur Aliyev", role: "Savdogar", initials: "BA" },
          { text: "Bir yilda 20 dan ortiq shartnoma tuzdim. Barchasi rasmiylashtirilgan. Rahmat ZeroX!", name: "Sardor Qodirov", role: "Fermer", initials: "SQ" },
          { text: "Oilaviy qarz muammolarini hal qildik. Endi hamma narsa hujjatlashtirilgan.", name: "Gulnora Mahmudova", role: "Uy bekasi", initials: "GM" },
          { text: "Biznes uchun ajoyib platforma. Hamkorlar bilan qarz munosabatlarini boshqarish oson bo'ldi.", name: "Timur Nazarov", role: "Biznesmen", initials: "TN" },
          { text: "Xavfsizlik darajasi yuqori. Ma'lumotlarim himoyalangan. Ishonchli platforma.", name: "Kamola Umarova", role: "Advokat", initials: "KU" },
          { text: "3 yildan beri foydalanaman. Hech qanday muammo bo'lmadi. Eng yaxshi xizmat!", name: "Rustam Ergashev", role: "Menejer", initials: "RE" }
        ],
        ru: [
          { text: "Через ZeroX дал в долг другу. Договор оформлен, всё официально. Теперь никаких проблем.", name: "Азиз Каримов", role: "Предприниматель", initials: "АК" },
          { text: "Раньше боялся давать в долг. Теперь с ZeroX безопасно. Договор подтверждается двумя сторонами.", name: "Малика Рахимова", role: "Бухгалтер", initials: "МР" },
          { text: "Мобильное приложение очень удобное. Можно создать договор откуда угодно. Рекомендую!", name: "Жасур Тошматов", role: "Программист", initials: "ЖТ" },
          { text: "Приходит напоминание когда приближается срок оплаты. Никогда не забуду. Отличный сервис!", name: "Нилуфар Саидова", role: "Учитель", initials: "НС" },
          { text: "Очень удобно видеть список должников в одном месте. Быстрый поиск по QR-коду - супер.", name: "Бобур Алиев", role: "Торговец", initials: "БА" },
          { text: "За год оформил более 20 договоров. Всё документировано. Спасибо ZeroX!", name: "Сардор Кодиров", role: "Фермер", initials: "СК" },
          { text: "Решили семейные долговые вопросы. Теперь всё задокументировано.", name: "Гульнора Махмудова", role: "Домохозяйка", initials: "ГМ" },
          { text: "Отличная платформа для бизнеса. Управлять долговыми отношениями с партнёрами стало легко.", name: "Тимур Назаров", role: "Бизнесмен", initials: "ТН" },
          { text: "Высокий уровень безопасности. Мои данные защищены. Надёжная платформа.", name: "Камола Умарова", role: "Адвокат", initials: "КУ" },
          { text: "Пользуюсь уже 3 года. Никаких проблем не было. Лучший сервис!", name: "Рустам Эргашев", role: "Менеджер", initials: "РЭ" }
        ],
        kr: [
          { text: "ZeroX орқали дўстимга қарз бердим. Шартнома тузилди, ҳамма нарса расмий. Энди ҳеч қандай муаммо йўқ.", name: "Азиз Каримов", role: "Тадбиркор", initials: "АК" },
          { text: "Олдин қарз беришдан қўрқардим. Энди ZeroX билан хавфсиз. Шартнома икки томонлама тасдиқланади.", name: "Малика Раҳимова", role: "Бухгалтер", initials: "МР" },
          { text: "Мобил илова жуда қулай. Исталган жойдан шартнома тузиш мумкин. Тавсия қиламан!", name: "Жасур Тошматов", role: "Дастурчи", initials: "ЖТ" },
          { text: "Тўлов муддати яқинлашганда эслатма келади. Ҳеч қачон унутмайман. Зўр хизмат!", name: "Нилуфар Саидова", role: "Ўқитувчи", initials: "НС" },
          { text: "Қарздорлар рўйхатини бир жойда кўриш жуда қулай. QR код орқали тез қидириш ажойиб.", name: "Бобур Алиев", role: "Савдогар", initials: "БА" },
          { text: "Бир йилда 20 дан ортиқ шартнома туздим. Барчаси расмийлаштирилган. Раҳмат ZeroX!", name: "Сардор Қодиров", role: "Фермер", initials: "СҚ" },
          { text: "Оилавий қарз муаммоларини ҳал қилдик. Энди ҳамма нарса ҳужжатлаштирилган.", name: "Гулнора Маҳмудова", role: "Уй бекаси", initials: "ГМ" },
          { text: "Бизнес учун ажойиб платформа. Ҳамкорлар билан қарз муносабатларини бошқариш осон бўлди.", name: "Тимур Назаров", role: "Бизнесмен", initials: "ТН" },
          { text: "Хавфсизлик даражаси юқори. Маълумотларим ҳимояланган. Ишончли платформа.", name: "Камола Умарова", role: "Адвокат", initials: "КУ" },
          { text: "3 йилдан бери фойдаланаман. Ҳеч қандай муаммо бўлмади. Энг яхши хизмат!", name: "Рустам Эргашев", role: "Менежер", initials: "РЭ" }
        ],
        en: [
          { text: "I lent money to a friend through ZeroX. The agreement was drawn up and everything is official. No more problems.", name: "Aziz Karimov", role: "Entrepreneur", initials: "AK" },
          { text: "I used to be afraid of lending money. Now it is safe with ZeroX. The agreement is confirmed by both parties.", name: "Malika Rahimova", role: "Accountant", initials: "MR" },
          { text: "The mobile app is very convenient. You can create an agreement from anywhere. I recommend it!", name: "Jasur Toshmatov", role: "Developer", initials: "JT" },
          { text: "I get a reminder when the payment date approaches. I will never forget. Great service!", name: "Nilufar Saidova", role: "Teacher", initials: "NS" },
          { text: "It is very handy to see the list of debtors in one place. Quick search by QR code is amazing.", name: "Bobur Aliyev", role: "Merchant", initials: "BA" },
          { text: "I made more than 20 agreements in a year. Everything is formalised. Thank you, ZeroX!", name: "Sardor Qodirov", role: "Farmer", initials: "SQ" },
          { text: "We solved our family debt problems. Now everything is documented.", name: "Gulnora Mahmudova", role: "Housewife", initials: "GM" },
          { text: "A great platform for business. Managing debt relations with partners became easy.", name: "Timur Nazarov", role: "Businessman", initials: "TN" },
          { text: "The level of security is high. My data is protected. A reliable platform.", name: "Kamola Umarova", role: "Lawyer", initials: "KU" },
          { text: "I have been using it for 3 years. There were no problems. The best service!", name: "Rustam Ergashev", role: "Manager", initials: "RE" }
        ],
        kaa: [
          { text: "ZeroX arqalı dostıma qarız berdim. Shártnama dúzildi, hámme nárse rásmiy. Endi hesh qanday mashqala joq.", name: "Aziz Karimov", role: "Isbilermen", initials: "AK" },
          { text: "Burın qarız beriwden qorqatuǵın edim. Endi ZeroX penen qáwipsiz. Shártnama eki tárepleme tastıyıqlanadı.", name: "Malika Rahimova", role: "Buxgalter", initials: "MR" },
          { text: "Mobil qosımsha júdá qolaylı. Qálegen jerden shártnama dúziw múmkin. Usınıs etemen!", name: "Jasur Toshmatov", role: "Dástúrshi", initials: "JT" },
          { text: "Tólew múddeti jaqınlasqanda eskertiw keledi. Hesh qashan umıtpayman. Jaqsı xızmet!", name: "Nilufar Saidova", role: "Muǵallim", initials: "NS" },
          { text: "Qarızdarlar dizimin bir jerde kóriw júdá qolaylı. QR kod arqalı tez izlew ájayıp.", name: "Bobur Aliyev", role: "Sawdager", initials: "BA" },
          { text: "Bir jılda 20 dan artıq shártnama dúzdim. Barlıǵı rásmiylestirilgen. ZeroX ǵa raxmet!", name: "Sardor Qodirov", role: "Fermer", initials: "SQ" },
          { text: "Shańaraqlıq qarız máselelerin sheshtik. Endi hámme nárse hújjetlestirilgen.", name: "Gulnora Mahmudova", role: "Úy bekesi", initials: "GM" },
          { text: "Biznes ushın ájayıp platforma. Hámkarlar menen qarız qatnasların basqarıw ońay boldı.", name: "Timur Nazarov", role: "Biznesmen", initials: "TN" },
          { text: "Qáwipsizlik dárejesi joqarı. Maǵlıwmatlarım qorǵalǵan. Isenimli platforma.", name: "Kamola Umarova", role: "Advokat", initials: "KU" },
          { text: "3 jıldan berli paydalanaman. Hesh qanday mashqala bolmadı. Eń jaqsı xızmet!", name: "Rustam Ergashev", role: "Menedjer", initials: "RE" }
        ]
      };
      return data[locale] || data.uz;
    },

    currentTestimonial() {
      return this.testimonials[this.currentSlide] || this.testimonials[0];
    },

    texts() {
      const locale = this.$i18n?.locale || 'uz';
      const translations = {
        uz: {
          title: 'Tizimga kirish',
          subtitle: 'Shaxsiy kabinetingizga kiring',
          phoneLabel: 'Telefon raqamingiz',
          phoneError: 'Telefon raqamini kiriting',
          passwordLabel: 'Parol',
          passwordPlaceholder: 'Parolingizni kiriting',
          passwordError: 'Parolni kiriting',
          forgotPassword: 'Parolni unutdingizmi?',
          loginButton: 'Kirish',
          or: 'yoki',
          noAccount: "Shaxsiy kabinetingiz yo'qmi?",
          register: "Ro'yxatdan o'tish",
          backHome: 'Bosh sahifaga qaytish',
          panel: {
            title: 'Xush kelibsiz!',
            subtitle: "1000+ foydalanuvchi bizga ishonadi",
            stats: {
              users: 'Foydalanuvchilar',
              contracts: 'Shartnomalar',
              satisfaction: 'Ishonchlilik'
            }
          }
        },
        ru: {
          title: 'Вход в систему',
          subtitle: 'Войдите в личный кабинет',
          phoneLabel: 'Номер телефона',
          phoneError: 'Введите номер телефона',
          passwordLabel: 'Пароль',
          passwordPlaceholder: 'Введите пароль',
          passwordError: 'Введите пароль',
          forgotPassword: 'Забыли пароль?',
          loginButton: 'Войти',
          or: 'или',
          noAccount: 'Нет личного кабинета?',
          register: 'Зарегистрироваться',
          backHome: 'На главную',
          panel: {
            title: 'Добро пожаловать!',
            subtitle: 'Более 1000 пользователей доверяют нам',
            stats: {
              users: 'Пользователей',
              contracts: 'Договоров',
              satisfaction: 'Надёжность'
            }
          }
        },
        kr: {
          title: 'Тизимга кириш',
          subtitle: 'Шахсий кабинетингизга киринг',
          phoneLabel: 'Телефон рақамингиз',
          phoneError: 'Телефон рақамини киритинг',
          passwordLabel: 'Парол',
          passwordPlaceholder: 'Паролингизни киритинг',
          passwordError: 'Паролни киритинг',
          forgotPassword: 'Паролни унутдингизми?',
          loginButton: 'Кириш',
          or: 'ёки',
          noAccount: "Шахсий кабинетингиз йўқми?",
          register: "Рўйхатдан ўтиш",
          backHome: 'Бош саҳифага қайтиш',
          panel: {
            title: 'Хуш келибсиз!',
            subtitle: "1000+ фойдаланувчи бизга ишонади",
            stats: {
              users: 'Фойдаланувчилар',
              contracts: 'Шартномалар',
              satisfaction: 'Ишончлилик'
            }
          }
        },
        // SS-DEV (2026-09-26): ingliz tili
        en: {
          title: 'Log in',
          subtitle: 'Sign in to your personal account',
          phoneLabel: 'Your phone number',
          phoneError: 'Enter your phone number',
          passwordLabel: 'Password',
          passwordPlaceholder: 'Enter your password',
          passwordError: 'Enter your password',
          forgotPassword: 'Forgot your password?',
          loginButton: 'Log in',
          or: 'or',
          noAccount: "Don't have an account?",
          register: 'Sign up',
          backHome: 'Back to home page',
          panel: {
            title: 'Welcome!',
            subtitle: "1000+ users trust us",
            stats: {
              users: 'Users',
              contracts: 'Agreements',
              satisfaction: 'Reliability'
            }
          }
        },
        // SS-DEV (2026-09-26): qoraqalpoq tili
        kaa: {
          title: 'Sistemaǵa kiriw',
          subtitle: 'Jeke kabinetińizge kiriń',
          phoneLabel: 'Telefon nomerińiz',
          phoneError: 'Telefon nomerin kiritiń',
          passwordLabel: 'Parol',
          passwordPlaceholder: 'Parolıńızdı kiritiń',
          passwordError: 'Paroldı kiritiń',
          forgotPassword: 'Parolıńızdı unıttıńız ba?',
          loginButton: 'Kiriw',
          or: 'yamasa',
          noAccount: "Jeke kabinetińiz joq pa?",
          register: 'Dizimnen ótiw',
          backHome: 'Bas betke qaytıw',
          panel: {
            title: 'Xosh kelipsiz!',
            subtitle: "1000+ paydalanıwshı bizge isenedi",
            stats: {
              users: 'Paydalanıwshılar',
              contracts: 'Shártnamalar',
              satisfaction: 'Isenimlilik'
            }
          }
        },
      };
      return translations[locale] || translations.uz;
    },

    modalTexts() {
      const locale = this.$i18n?.locale || 'uz';
      const translations = {
        uz: {
          title: "Parolni tiklash",
          message: "Hurmatli foydalanuvchi, parolni ZeroX mobil ilovasi orqali tiklashingiz mumkin.",
          closeBtn: "Yopish"
        },
        ru: {
          title: "Восстановление пароля",
          message: "Уважаемый пользователь, вы можете восстановить пароль в мобильном приложении ZeroX.",
          closeBtn: "Закрыть"
        },
        kr: {
          title: "Паролни тиклаш",
          message: "Ҳурматли фойдаланувчи, паролни ZeroX мобил иловаси орқали тиклашингиз мумкин.",
          closeBtn: "Ёпиш"
        },
        // SS-DEV (2026-09-26): en/kaa
        en: {
          title: "Password recovery",
          message: "Dear user, you can reset your password via the ZeroX mobile app.",
          closeBtn: "Close"
        },
        kaa: {
          title: "Paroldı tiklew",
          message: "Húrmetli paydalanıwshı, paroldı ZeroX mobil qosımshası arqalı tiklewińiz múmkin.",
          closeBtn: "Jabıw"
        },
      };
      return translations[locale] || translations.uz;
    }
  },
};
