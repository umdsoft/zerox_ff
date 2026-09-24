<template>
  <!-- SS-DEV (2026-09-24): "Modullar" — kabinet ichidagi sahifa. Public landing
       sahifasidagi "Modullar" bo'limi bilan BIR XIL mazmun (LandingPage.vue
       texts.modules), faqat havolalar ro'yxatdan o'tish o'rniga kabinetdagi
       tegishli bo'limga olib boradi. Footer "Havolalar" ro'yxati shu sababli
       landing bilan bir xil bo'ldi (Modullar, Imkoniyatlar, Qanday ishlaydi,
       Tariflar, Yo'riqnoma). -->
  <div class="pb-8">
    <div class="mb-6">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        @click="$router.back()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        {{ texts.back }}
      </button>
    </div>

    <div class="text-center mb-10">
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{{ texts.modules.title }}</h1>
      <p class="text-base text-gray-600 max-w-2xl mx-auto">{{ texts.modules.description }}</p>
    </div>

    <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      <nuxt-link
        v-for="(m, i) in modules"
        :key="i"
        :to="localePath({ name: m.route })"
        :class="['flex flex-col h-full p-6 bg-white rounded-2xl shadow-md border-t-4 hover:shadow-xl transition-all transform hover:-translate-y-1', m.border]"
      >
        <div :class="['w-14 h-14 rounded-xl flex items-center justify-center mb-5', m.iconBg]">
          <svg :class="['w-7 h-7', m.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="m.path" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ texts.modules.items[i].name }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ texts.modules.items[i].desc }}</p>
        <ul class="space-y-2 mb-5">
          <li v-for="(f, fi) in texts.modules.items[i].features" :key="fi" class="flex items-start gap-2 text-sm text-gray-700">
            <svg :class="['w-4 h-4 flex-shrink-0 mt-0.5', m.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ f }}</span>
          </li>
        </ul>
        <span :class="['mt-auto inline-flex items-center text-sm font-semibold', m.iconColor]">
          {{ texts.modules.cta }}
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModullarPage',
  middleware: 'auth',
  data() {
    return {
      // Rang va ikonkalar landing "Modullar" bo'limi bilan bir xil; havola — kabinet bo'limi.
      modules: [
        {
          route: 'contract-dashboard', border: 'border-blue-500', iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
          path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        },
        {
          route: 'qarz-daftari', border: 'border-purple-500', iconBg: 'bg-purple-100', iconColor: 'text-purple-600',
          path: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        },
        {
          route: 'finance-debts', border: 'border-amber-500', iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
          path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
        },
        {
          route: 'finance', border: 'border-green-500', iconBg: 'bg-green-100', iconColor: 'text-green-600',
          path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        },
      ],
    };
  },
  computed: {
    texts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz';
      const t = {
        uz: {
          back: 'Orqaga',
          modules: {
            title: "Bir platforma - to'rtta bo'lim",
            description: "Har bir ehtiyoj uchun alohida modul. Barchasi bitta ZeroX hisobida.",
            cta: "Bo'limga o'tish",
            items: [
              { name: "Qarz shartnomasi", desc: "Qarz oldi-berdini rasmiy elektron shartnoma bilan mustahkamlang.",
                features: ["Qarz shartnomasi huquqiy asosga ega", "Ikki tomonlama elektron tasdiqlash", "PDF hujjat va QR-kod orqali qidiruv", "Muddatni uzaytirish, talab qilish, voz kechish", "Qarz tarixi va foydalanuvchi reytingi"] },
              { name: "Qarz daftari", desc: "Do'kon va savdo nuqtalari uchun elektron nasiya daftari.",
                features: ["Savdo faoliyati (do'kon) va mijozlar bazasi", "Qarzga berish/olish, bo'lib to'lash jadvali", "SMS eslatma va to'lovni talab qilish", "Xodimlar, kvitansiya va qarz kalendari"] },
              { name: "Shaxsiy qarz", desc: "Do'st va qarindoshlar bilan shaxsiy qarz oldi-berdisini yuriting.",
                features: ["Berilgan va olingan qarzlar, qisman to'lovlar", "Plastik karta rekvizitlari bilan qaytarishni talab qilish", "UZS va USD, qarzdorlar bo'yicha guruhlash", "Hamkor qaydlari va do'kon qarzlari bir joyda"] },
              { name: "Shaxsiy moliya", desc: "Shaxsiy va oilaviy budjetingizni to'liq nazorat qiling.",
                features: ["Xarajat va daromadlar kategoriyalar bo'yicha", "Budjet, maqsadlar va kutilayotgan daromadlar", "Analitika, hisobotlar va moliyaviy tavsiyalar", "Oila moliyasi, to'lovlar kalendari", "Gap (Чёрная касса) - navbatli jamg'arma"] },
            ],
          },
        },
        ru: {
          back: 'Назад',
          modules: {
            title: 'Одна платформа - четыре раздела',
            description: 'Отдельный модуль для каждой задачи. Всё в одном аккаунте ZeroX.',
            cta: 'Перейти в раздел',
            items: [
              { name: 'Договор займа', desc: 'Оформляйте долги официальным электронным договором.',
                features: ['Договор займа имеет юридическую силу', 'Двустороннее электронное подтверждение', 'PDF-документ и поиск по QR-коду', 'Продление срока, требование, отказ от долга', 'История долгов и рейтинг пользователя'] },
              { name: 'Долговая книга', desc: 'Электронная книга рассрочки для магазинов и торговых точек.',
                features: ['Торговая деятельность (магазин) и база клиентов', 'Выдача/получение долга, график рассрочки', 'SMS-напоминания и требование оплаты', 'Сотрудники, квитанция и календарь долгов'] },
              { name: 'Личный долг', desc: 'Ведите личные долги с друзьями и родственниками.',
                features: ['Выданные и полученные долги, частичные платежи', 'Требование возврата с реквизитами карты', 'UZS и USD, группировка по должникам', 'Записи партнёров и долги магазинов в одном месте'] },
              { name: 'Личные финансы', desc: 'Полный контроль личного и семейного бюджета.',
                features: ['Расходы и доходы по категориям', 'Бюджет, цели и ожидаемые доходы', 'Аналитика, отчёты и финансовые советы', 'Семейные финансы, календарь платежей', 'Gap (Чёрная касса) - накопление по очереди'] },
            ],
          },
        },
        kr: {
          back: 'Орқага',
          modules: {
            title: 'Бир платформа - тўртта бўлим',
            description: 'Ҳар бир эҳтиёж учун алоҳида модул. Барчаси битта ZeroX ҳисобида.',
            cta: 'Бўлимга ўтиш',
            items: [
              { name: 'Қарз шартномаси', desc: 'Қарз олди-бердини расмий электрон шартнома билан мустаҳкамланг.',
                features: ['Қарз шартномаси ҳуқуқий асосга эга', 'Икки томонлама электрон тасдиқлаш', 'PDF ҳужжат ва QR-код орқали қидирув', 'Муддатни узайтириш, талаб қилиш, воз кечиш', 'Қарз тарихи ва фойдаланувчи рейтинги'] },
              { name: 'Қарз дафтари', desc: 'Дўкон ва савдо нуқталари учун электрон насия дафтари.',
                features: ['Савдо фаолияти (дўкон) ва мижозлар базаси', 'Қарзга бериш/олиш, бўлиб тўлаш жадвали', 'SMS эслатма ва тўловни талаб қилиш', 'Ходимлар, квитансия ва қарз календари'] },
              { name: 'Шахсий қарз', desc: 'Дўст ва қариндошлар билан шахсий қарз олди-бердисини юритинг.',
                features: ['Берилган ва олинган қарзлар, қисман тўловлар', 'Пластик карта реквизитлари билан қайтаришни талаб қилиш', 'UZS ва USD, қарздорлар бўйича гуруҳлаш', 'Ҳамкор қайдлари ва дўкон қарзлари бир жойда'] },
              { name: 'Шахсий молия', desc: 'Шахсий ва оилавий бюджетингизни тўлиқ назорат қилинг.',
                features: ['Харажат ва даромадлар категориялар бўйича', 'Бюджет, мақсадлар ва кутилаётган даромадлар', 'Аналитика, ҳисоботлар ва молиявий тавсиялар', 'Оила молияси, тўловлар календари', 'Gap (Чёрная касса) - навбатли жамғарма'] },
            ],
          },
        },
      };
      return t[l] || t.uz;
    },
  },
};
</script>
