/**
 * wave D: pages/auth/register.vue dan ajratilgan computed (matnlar/testimoniallar/maxfiylik/taymer).
 * Computed sahifa holatini `this` orqali ishlatadi — holat sahifada qoladi.
 */
export default {
  computed: {
    waitingTime() {
      const minute = Math.floor(this.time / 60).toString().padStart(2, '0');
      const second = (this.time % 60).toString().padStart(2, '0');
      return `${minute}:${second}`;
    },

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
          { text: "3 yildan beri foydalanaman. Hech qanday muammo bo'lmadi. Eng yaxshi xizmat!", name: "Rustam Ergashev", role: "Menejер", initials: "RE" }
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

    // 29.09: ro'yxatdan o'tishda maxfiylik siyosatini qabul qilish haqida ogohlantirish
    privacyNotice() {
      const locale = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          before: "Telefon raqamingizni va SMS orqali yuborilgan tasdiqlash kodini kiritish orqali Siz ZeroX ",
          link: "Maxfiylik siyosati",
          after: " bilan tanishganingizni va uni qabul qilganingizni tasdiqlaysiz.",
        },
        ru: {
          before: "Вводя номер телефона и код подтверждения из SMS, Вы подтверждаете, что ознакомились с ",
          link: "Политикой конфиденциальности",
          after: " ZeroX и принимаете её.",
        },
        kr: {
          before: "Телефон рақамингизни ва SMS орқали юборилган тасдиқлаш кодини киритиш орқали Сиз ZeroX ",
          link: "Махфийлик сиёсати",
          after: " билан танишганингизни ва уни қабул қилганингизни тасдиқлайсиз.",
        },
        en: {
          before: "By entering your phone number and the confirmation code sent by SMS, you confirm that you have read and accept the ZeroX ",
          link: "Privacy Policy",
          after: ".",
        },
        kaa: {
          before: "Telefon nomerińizdi hám SMS arqalı jiberilgen tastıyıqlaw kodın kirgiziw arqalı Siz ZeroX ",
          link: "Qupıyalıq siyasatı",
          after: " menen tanısqanıńızdı hám onı qabıl etkenińizdi tastıyıqlaysız.",
        },
      };
      return t[locale] || t.uz;
    },

    currentTestimonial() {
      return this.testimonials[this.currentSlide] || this.testimonials[0];
    },

    texts() {
      const locale = this.$i18n?.locale || 'uz';
      const translations = {
        uz: {
          steps: {
            phone: 'Telefon',
            verify: 'Tasdiqlash',
            password: 'Parol'
          },
          step1: {
            title: "Ro'yxatdan o'tish",
            subtitle: "Tizimdan foydalanish uchun ro'yxatdan o'ting",
            phoneLabel: 'Telefon raqamingiz',
            phoneError: 'Telefon raqamini kiriting',
            haveAccount: "Ro'yxatdan o'tganmisiz?"
          },
          step2: {
            title: 'Tasdiqlash kodi',
            subtitle: 'SMS orqali yuborilgan kodni kiriting',
            codeLabel: 'Tasdiqlash kodi',
            codePlaceholder: '000000',
            codeError: 'Kodni kiriting',
            resend: 'Qayta yuborish',
            waitText: 'Kutish vaqti'
          },
          step3: {
            title: 'Parol yarating',
            subtitle: 'Hisobingiz uchun xavfsiz parol yarating',
            passwordLabel: 'Parol',
            passwordPlaceholder: 'Parolni kiriting',
            confirmLabel: 'Parolni tasdiqlang',
            confirmPlaceholder: 'Parolni qayta kiriting',
            requirements: {
              uppercase: 'Kamida bitta katta harf (A-Z)',
              length: 'Kamida 8 ta belgi',
              lowercase: 'Kamida bitta kichik harf (a-z)',
              number: 'Kamida bitta raqam (0-9)',
              special: 'Kamida bitta maxsus belgi (!@#$%)',
              noSpace: "Bo'sh joy yo'q"
            }
          },
          buttons: {
            continue: 'Davom etish',
            verify: 'Tasdiqlash',
            register: "Ro'yxatdan o'tish",
            back: 'Orqaga',
            backHome: 'Bosh sahifaga qaytish',
            login: 'Kirish'
          },
          panel: {
            title: 'Foydalanuvchilarning fikrlari',
            subtitle: "1000+ foydalanuvchi bizga ishonadi",
            stats: {
              users: 'Foydalanuvchilar',
              contracts: 'Shartnomalar',
              satisfaction: 'Ishonchlilik'
            }
          }
        },
        ru: {
          steps: {
            phone: 'Телефон',
            verify: 'Подтверждение',
            password: 'Пароль'
          },
          step1: {
            title: 'Регистрация',
            subtitle: 'Зарегистрируйтесь для использования системы',
            phoneLabel: 'Ваш номер телефона',
            phoneError: 'Введите номер телефона',
            haveAccount: 'Вы уже зарегистрированы?'
          },
          step2: {
            title: 'Код подтверждения',
            subtitle: 'Введите код, отправленный по SMS',
            codeLabel: 'Код подтверждения',
            codePlaceholder: '000000',
            codeError: 'Введите код',
            resend: 'Отправить повторно',
            waitText: 'Время ожидания'
          },
          step3: {
            title: 'Создайте пароль',
            subtitle: 'Создайте надежный пароль для вашего аккаунта',
            passwordLabel: 'Пароль',
            passwordPlaceholder: 'Введите пароль',
            confirmLabel: 'Подтвердите пароль',
            confirmPlaceholder: 'Введите пароль повторно',
            requirements: {
              uppercase: 'Минимум одна заглавная буква (A-Z)',
              length: 'Минимум 8 символов',
              lowercase: 'Минимум одна строчная буква (a-z)',
              number: 'Минимум одна цифра (0-9)',
              special: 'Минимум один спецсимвол (!@#$%)',
              noSpace: 'Без пробелов'
            }
          },
          buttons: {
            continue: 'Продолжить',
            verify: 'Подтвердить',
            register: 'Зарегистрироваться',
            back: 'Назад',
            backHome: 'На главную',
            login: 'Войти'
          },
          panel: {
            title: 'Отзывы пользователей',
            subtitle: 'Более 1000 пользователей доверяют нам',
            stats: {
              users: 'Пользователей',
              contracts: 'Договоров',
              satisfaction: 'Надёжность'
            }
          }
        },
        kr: {
          steps: {
            phone: 'Телефон',
            verify: 'Тасдиқлаш',
            password: 'Парол'
          },
          step1: {
            title: "Рўйхатдан ўтиш",
            subtitle: "Тизимдан фойдаланиш учун рўйхатдан ўтинг",
            phoneLabel: 'Телефон рақамингиз',
            phoneError: 'Телефон рақамини киритинг',
            haveAccount: 'Рўйхатдан ўтганмисиз?'
          },
          step2: {
            title: 'Тасдиқлаш коди',
            subtitle: 'SMS орқали юборилган кодни киритинг',
            codeLabel: 'Тасдиқлаш коди',
            codePlaceholder: '000000',
            codeError: 'Кодни киритинг',
            resend: 'Қайта юбориш',
            waitText: 'Кутиш вақти'
          },
          step3: {
            title: 'Парол яратинг',
            subtitle: 'Ҳисобингиз учун хавфсиз парол яратинг',
            passwordLabel: 'Парол',
            passwordPlaceholder: 'Паролни киритинг',
            confirmLabel: 'Паролни тасдиқланг',
            confirmPlaceholder: 'Паролни қайта киритинг',
            requirements: {
              uppercase: 'Камида битта катта ҳарф (A-Z)',
              length: 'Камида 8 та белги',
              lowercase: 'Камида битта кичик ҳарф (a-z)',
              number: 'Камида битта рақам (0-9)',
              special: 'Камида битта махсус белги (!@#$%)',
              noSpace: "Бўш жой йўқ"
            }
          },
          buttons: {
            continue: 'Давом этиш',
            verify: 'Тасдиқлаш',
            register: "Рўйхатдан ўтиш",
            back: 'Орқага',
            backHome: 'Бош саҳифага қайтиш',
            login: 'Кириш'
          },
          panel: {
            title: 'Фойдаланувчиларнинг фикрлари',
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
          steps: {
            phone: 'Phone',
            verify: 'Verify',
            password: 'Password'
          },
          step1: {
            title: "Sign up",
            subtitle: "Register to use the system",
            phoneLabel: 'Your phone number',
            phoneError: 'Enter your phone number',
            haveAccount: "Already registered?"
          },
          step2: {
            title: 'Verification code',
            subtitle: 'Enter the code sent via SMS',
            codeLabel: 'Verification code',
            codePlaceholder: '000000',
            codeError: 'Enter the code',
            resend: 'Resend',
            waitText: 'Wait time'
          },
          step3: {
            title: 'Create a password',
            subtitle: 'Create a secure password for your account',
            passwordLabel: 'Password',
            passwordPlaceholder: 'Enter the password',
            confirmLabel: 'Confirm the password',
            confirmPlaceholder: 'Re-enter the password',
            requirements: {
              uppercase: 'At least one uppercase letter (A-Z)',
              length: 'At least 8 characters',
              lowercase: 'At least one lowercase letter (a-z)',
              number: 'At least one digit (0-9)',
              special: 'At least one special character (!@#$%)',
              noSpace: "No spaces"
            }
          },
          buttons: {
            continue: 'Continue',
            verify: 'Verify',
            register: "Sign up",
            back: 'Back',
            backHome: 'Back to home page',
            login: 'Log in'
          },
          panel: {
            title: 'What our users say',
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
          steps: {
            phone: 'Telefon',
            verify: 'Tastıyıqlaw',
            password: 'Parol'
          },
          step1: {
            title: "Dizimnen ótiw",
            subtitle: "Sistemadan paydalanıw ushın dizimnen ótiń",
            phoneLabel: 'Telefon nomerińiz',
            phoneError: 'Telefon nomerin kiritiń',
            haveAccount: "Dizimnen ótkensiz be?"
          },
          step2: {
            title: 'Tastıyıqlaw kodı',
            subtitle: 'SMS arqalı jiberilgen kodtı kiritiń',
            codeLabel: 'Tastıyıqlaw kodı',
            codePlaceholder: '000000',
            codeError: 'Kodtı kiritiń',
            resend: 'Qayta jiberiw',
            waitText: 'Kútiw waqtı'
          },
          step3: {
            title: 'Parol jaratıń',
            subtitle: 'Esabıńız ushın qáwipsiz parol jaratıń',
            passwordLabel: 'Parol',
            passwordPlaceholder: 'Paroldı kiritiń',
            confirmLabel: 'Paroldı tastıyıqlań',
            confirmPlaceholder: 'Paroldı qayta kiritiń',
            requirements: {
              uppercase: 'Keminde bir bas hárip (A-Z)',
              length: 'Keminde 8 belgi',
              lowercase: 'Keminde bir kishi hárip (a-z)',
              number: 'Keminde bir san (0-9)',
              special: 'Keminde bir arnawlı belgi (!@#$%)',
              noSpace: "Bos orın joq"
            }
          },
          buttons: {
            continue: 'Dawam etiw',
            verify: 'Tastıyıqlaw',
            register: "Dizimnen ótiw",
            back: 'Artqa',
            backHome: 'Bas betke qaytıw',
            login: 'Kiriw'
          },
          panel: {
            title: 'Paydalanıwshılardıń pikirleri',
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
  },
};
