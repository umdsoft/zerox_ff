<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div class="flex items-start gap-3">
        <nuxt-link :to="localePath({ name: 'qarz-daftari' })" class="flex-shrink-0 mt-1 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm transition-colors" :title="texts.back">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </nuxt-link>
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.pageTitle }}</h1>
          <p class="text-gray-500 mt-1">{{ texts.pageSubtitle }}</p>
        </div>
      </div>
    </div>

    <!-- Ogohlantirish — ko'zga tashlanadigan (gradient + accent bar + icon badge) -->
    <div class="relative overflow-hidden rounded-2xl mb-6 border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 shadow-md">
      <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-amber-400 to-orange-500"></div>
      <div class="flex items-start gap-4 p-4 pl-6">
        <div class="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-amber-900 mb-0.5">{{ $i18n.locale === 'ru' ? 'Обратите внимание' : ($i18n.locale === 'kr' ? 'Диққат' : 'Diqqat') }}</p>
          <p class="text-sm font-medium text-amber-800 leading-relaxed">{{ texts.warning }}</p>
        </div>
      </div>
    </div>

    <!-- Faoliyatlar mavjud -->
    <template v-if="faoliyatlar.length">
      <!-- 1-qadam: Savdo faoliyat tanlash kartalar -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ texts.selectFaoliyat }}</h2>
          <!-- Yangi do'kon qo'shish — xodim sessiyasida ko'rsatilmaydi (faqat egasi) -->
          <button v-if="!isXodimSession" @click="showAddModal = true" class="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors border border-gray-300 text-sm">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            {{ texts.qoshish }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="f in faoliyatlar"
            :key="(f.is_xodim_role ? 'x-' : 'o-') + f.id"
            @click="onCardClick(f)"
            :class="[
              'bg-white rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-md',
              f.is_xodim_role
                ? (selectedFaoliyat === f.id ? 'border-purple-500 shadow-md ring-1 ring-purple-200' : 'border-purple-200 hover:border-purple-400')
                : (selectedFaoliyat === f.id ? 'border-blue-500 shadow-md ring-1 ring-blue-200' : 'border-gray-200 hover:border-gray-300')
            ]"
          >
            <div class="flex items-center gap-3">
              <div :class="[
                'w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-colors',
                f.is_xodim_role
                  ? 'bg-purple-100 text-purple-600'
                  : (selectedFaoliyat === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500')
              ]">
                {{ f.nomi?.charAt(0)?.toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p :class="['font-semibold break-words leading-snug', f.is_xodim_role ? 'text-gray-900' : (selectedFaoliyat === f.id ? 'text-blue-700' : 'text-gray-900')]">{{ f.nomi }}</p>
                <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span v-if="f.is_xodim_role" class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 flex-shrink-0">{{ texts.xodimBadge }}</span>
                  <span class="text-xs text-gray-400">{{ f.is_xodim_role ? texts.xodimSifatida : texts.faoliyat }}</span>
                </div>
              </div>
              <div v-if="selectedFaoliyat === f.id" :class="['w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0', f.is_xodim_role ? 'bg-purple-600' : 'bg-blue-600']">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </div>
              <svg v-else-if="f.is_xodim_role" class="w-5 h-5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>

            <!-- Egasi do'koni: Tahrirlash / Xodimlar (xodim sessiyada ko'rsatilmaydi —
                 xodim do'kon nomini tahrirlay olmaydi yoki hamkasblarini boshqarmaydi) -->
            <div v-if="!f.is_xodim_role && !isXodimSession" class="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1 flex-wrap">
              <button
                type="button"
                @click.stop="editFaoliyat(f)"
                class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                {{ texts.tahrirlash }}
              </button>
              <nuxt-link
                @click.native.stop
                :to="localePath({ name: 'qarz-daftari-faoliyat-id-xodimlar', params: { id: f.id } })"
                class="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                {{ texts.xodimlar }}
              </nuxt-link>
            </div>

            <!-- Xodim do'koni: tanlangan holat (check mark) -->
            <div v-else-if="f.is_xodim_role && selectedFaoliyat === f.id" class="mt-4 pt-3 border-t border-gray-100">
              <p class="text-xs text-purple-600 font-semibold">{{ texts.xodimSelected || 'Do\'kon tanlandi' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 2-qadam: Qarz turi tanlash (faqat faoliyat tanlanganda) -->
      <transition name="fade-slide">
        <div v-if="selectedFaoliyat" class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ texts.selectType }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <nuxt-link
              :to="localePath({ name: 'qarz-daftari-faoliyat-id-berish', params: { id: selectedFaoliyat } })"
              class="group bg-white rounded-xl border-2 border-blue-200 hover:border-blue-400 p-6 transition-all hover:shadow-lg"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{{ texts.qarzgaBerish }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ texts.berishDesc }}</p>
                </div>
                <svg class="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </nuxt-link>
            <nuxt-link
              :to="localePath({ name: 'qarz-daftari-faoliyat-id-olish', params: { id: selectedFaoliyat } })"
              class="group bg-white rounded-xl border-2 border-green-200 hover:border-green-400 p-6 transition-all hover:shadow-lg"
            >
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center transition-colors">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors">{{ texts.qarzgaOlish }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ texts.olishDesc }}</p>
                </div>
                <svg class="w-5 h-5 text-gray-300 group-hover:text-green-400 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </nuxt-link>
          </div>
        </div>
      </transition>

      <!-- Yo'riqnoma (pastda, horizontal) -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
        <div class="flex flex-col md:flex-row md:items-center gap-6">
          <div class="flex items-center gap-3 flex-shrink-0">
            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <h3 class="text-sm font-semibold text-gray-800">{{ texts.guideTitle }}</h3>
          </div>
          <div class="flex flex-col md:flex-row gap-4 md:gap-8 flex-1">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">1</div>
              <p class="text-sm text-gray-600">{{ texts.step1 }}</p>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">2</div>
              <p class="text-sm text-gray-600">{{ texts.step2 }}</p>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">3</div>
              <p class="text-sm text-gray-600">{{ texts.step3 }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Faoliyatlar bo'sh -->
    <template v-else>
      <div class="bg-white rounded-xl shadow-sm text-center py-16 px-8">
        <div class="max-w-md mx-auto">
          <div class="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">{{ texts.emptyTitle }}</h2>
          <p class="text-gray-500 mb-8">{{ texts.emptyDesc }}</p>
          <button @click="showAddModal = true" class="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center shadow-sm">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            {{ texts.createFirst }}
          </button>

          <!-- Yo'riqnoma (bo'sh holatda ham ko'rsatilsin) -->
          <div class="mt-10 pt-8 border-t border-gray-100">
            <p class="text-xs font-semibold text-gray-400 mb-4">{{ texts.guideTitle }}</p>
            <div class="flex flex-col sm:flex-row justify-center gap-6 text-left">
              <div class="flex items-start gap-2.5">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">1</div>
                <p class="text-sm text-gray-500">{{ texts.step1 }}</p>
              </div>
              <div class="flex items-start gap-2.5">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">2</div>
                <p class="text-sm text-gray-500">{{ texts.step2 }}</p>
              </div>
              <div class="flex items-start gap-2.5">
                <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">3</div>
                <p class="text-sm text-gray-500">{{ texts.step3 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Yangi/Tahrirlash do'kon modal (edit rejimi uchun :faoliyat uzatiladi) -->
    <QarzDaftariSavdoFaoliyatModal v-if="showAddModal" :faoliyat="editingFaoliyat" @close="closeFaoliyatModal" @saved="onFaoliyatSaved" />
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return { faoliyatlar: [], selectedFaoliyat: null, showAddModal: false, editingFaoliyat: null, enteringXodim: false };
  },
  computed: {
    /**
     * Xodim sessiyasi (xodim-login orqali kirgan) — owner-only tugmalar yashiriladi.
     *
     * AUTHORITATIVE manba: $auth.user.is_xodim (backend /user/me'dan keladi).
     * localStorage faqat $auth.user hali yuklanmagan paytda fallback —
     * aks holda 2+ user bir kompyuterda kirsa eski user'ning bayrog'i yangi
     * user'ga oqib o'tardi (Quramboyev'ning o'z do'koniga xodim deb qaralardi).
     */
    isXodimSession() {
      if (this.$auth && this.$auth.user) {
        return !!this.$auth.user.is_xodim;
      }
      try { return localStorage.getItem('zx_xodim_session') === '1'; } catch (_) { return false; }
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          pageTitle: "Qarz daftariga kiritish",
          pageSubtitle: "Savdo faoliyatingizni tanlang va qarz turini belgilang",
          back: "Qarz daftari",
          warning: "Qarz oldi-berdi munosabatlaringizni qarz daftariga kiritish orqali qarzlaringizni elektron boshqarish imkoniga ega bo'lasiz. Biroq qarz daftariga kiritilgan qarzlar bo'yicha shartnoma rasmiylashtirilmaydi.",
          selectFaoliyat: "Savdo faoliyati (do'kon)ni tanlang",
          faoliyat: "Savdo faoliyati",
          tanlang: "Tanlang...",
          qoshish: "Yangi do'kon qo'shish",
          tahrirlash: "Tahrirlash",
          xodimlar: "Xodimlar",
          xodimBadge: "Xodim",
          xodimSifatida: "Xodim sifatida ulangan",
          xodimEnterHint: "Ushbu do'konga xodim sifatida biriktirilgansiz. Boshqarish uchun xodim sifatida tizimga kiring.",
          xodimEnter: "Xodim sifatida kirish",
          xodimSelected: "Do'kon tanlandi",
          selectType: "Qarz turini tanlang",
          qarzgaBerish: "Qarzga berish",
          berishDesc: "Mijozga qarz bering va to'lovlarni kuzating",
          qarzgaOlish: "Qarzga olish",
          olishDesc: "Olingan qarzni qayd eting va muddatini belgilang",
          emptyTitle: "Savdo faoliyatingiz hali yo'q",
          emptyDesc: "Qarz daftaridan foydalanish uchun avval savdo faoliyatingizni yarating. Savdo faoliyati orqali mijozlar, xodimlar va qarzlarni boshqarasiz.",
          createFirst: "Savdo faoliyat yaratish",
          guideTitle: "Qanday ishlaydi?",
          step1: "Savdo faoliyatingizni tanlang yoki yangisini yarating",
          step2: "Qarzga berish yoki olish turini tanlang",
          step3: "Mijozni tanlang va qarz ma'lumotlarini kiriting",
        },
        ru: {
          pageTitle: "Внести в книгу долгов",
          pageSubtitle: "Выберите торговую деятельность и тип долга",
          back: "Книга долгов",
          warning: "Внося долговые отношения в книгу долгов, вы получаете возможность электронного управления долгами. Однако по записям в книге долгов договор не оформляется.",
          selectFaoliyat: "Выберите торговую деятельность (магазин)",
          faoliyat: "Торговая деятельность",
          tanlang: "Выбрать...",
          qoshish: "Добавить новый магазин",
          tahrirlash: "Редактировать",
          xodimlar: "Сотрудники",
          xodimBadge: "Сотрудник",
          xodimSifatida: "Подключён как сотрудник",
          xodimEnterHint: "Вы добавлены сотрудником в этот магазин. Войдите как сотрудник, чтобы управлять им.",
          xodimEnter: "Войти как сотрудник",
          xodimSelected: "Магазин выбран",
          selectType: "Выберите тип долга",
          qarzgaBerish: "Дать в долг",
          berishDesc: "Выдайте долг клиенту и отслеживайте платежи",
          qarzgaOlish: "Взять в долг",
          olishDesc: "Запишите полученный долг и установите сроки",
          emptyTitle: "У вас пока нет торговой деятельности",
          emptyDesc: "Для использования книги долгов сначала создайте торговую деятельность. Через неё вы будете управлять клиентами, сотрудниками и долгами.",
          createFirst: "Создать торговую деятельность",
          guideTitle: "Как это работает?",
          step1: "Выберите или создайте торговую деятельность",
          step2: "Выберите тип: дать или взять в долг",
          step3: "Выберите клиента и введите данные долга",
        },
        kr: {
          pageTitle: "Қарз дафтарига киритиш",
          pageSubtitle: "Савдо фаолиятингизни танланг ва қарз турини белгиланг",
          back: "Қарз дафтари",
          warning: "Қарз олди-берди муносабатларингизни қарз дафтарига киритиш орқали қарзларингизни электрон бошқариш имконига эга бўласиз.",
          selectFaoliyat: "Савдо фаолияти (дўкон)ни танланг",
          faoliyat: "Савдо фаолияти",
          tanlang: "Танланг...",
          qoshish: "Янги дўкон қўшиш",
          tahrirlash: "Таҳрирлаш",
          xodimlar: "Ходимлар",
          xodimBadge: "Ходим",
          xodimSifatida: "Ходим сифатида уланган",
          xodimEnterHint: "Ушбу дўконга ходим сифатида бириктирилгансиз. Бошқариш учун ходим сифатида тизимга киринг.",
          xodimEnter: "Ходим сифатида кириш",
          xodimSelected: "Дўкон танланди",
          selectType: "Қарз турини танланг",
          qarzgaBerish: "Қарзга бериш",
          berishDesc: "Мижозга қарз беринг ва тўловларни кузатинг",
          qarzgaOlish: "Қарзга олиш",
          olishDesc: "Олинган қарзни қайд этинг ва муддатини белгиланг",
          emptyTitle: "Савдо фаолиятингиз ҳали йўқ",
          emptyDesc: "Қарз дафтаридан фойдаланиш учун аввал савдо фаолиятингизни яратинг.",
          createFirst: "Савдо фаолият яратиш",
          guideTitle: "Қандай ишлайди?",
          step1: "Савдо фаолиятингизни танланг ёки янгисини яратинг",
          step2: "Қарзга бериш ёки олиш турини танланг",
          step3: "Мижозни танланг ва қарз маълумотларини киритинг",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() {
    await this.loadFaoliyatlar();
  },
  methods: {
    async loadFaoliyatlar() {
      try {
        const res = await this.$axios.$get('/qarz-daftari/savdo-faoliyat');
        if (res?.success) {
          this.faoliyatlar = res.data;
        }
      } catch (e) {
        console.error('Savdo faoliyat yuklashda xatolik:', e.response?.status, e.response?.data || e.message);
        this.$toast?.error('Savdo faoliyatlarni yuklashda xatolik');
      }
    },
    async onFaoliyatSaved(response) {
      this.showAddModal = false;
      this.editingFaoliyat = null;
      await this.loadFaoliyatlar();
      const faoliyat = response?.data || response;
      if (faoliyat?.id) this.selectedFaoliyat = faoliyat.id;
    },
    editFaoliyat(f) {
      this.editingFaoliyat = f;
      this.showAddModal = true;
    },
    closeFaoliyatModal() {
      this.showAddModal = false;
      this.editingFaoliyat = null;
    },
    /** Karta bosilganda: egasi — do'kon tanlash; xodim — to'g'ridan-to'g'ri qarz sahifasiga */
    onCardClick(f) {
      if (f && f.is_xodim_role) {
        // Parolsiz xodim kontekstiga kirish — re-login (parol) talab qilmaydi.
        this.enterXodimDokon(f.id);
        return;
      }
      this.selectedFaoliyat = f.id;
    },
    async enterXodimDokon(faoliyatId) {
      if (this.enteringXodim) return;
      this.enteringXodim = true;
      try {
        const res = await this.$axios.post('/qarz-daftari/xodim/enter', { faoliyat_id: faoliyatId }, { silent: true });
        const data = res?.data;
        if (data?.success && data.token) {
          // Egasi (owner) tokenini saqlaymiz — xodim sahifasidagi "Orqaga" tugmasi
          // o'z hisobiga qaytarish uchun.
          try {
            const ownerToken = localStorage.getItem('auth._token.local');
            if (ownerToken && ownerToken !== 'false') localStorage.setItem('zx_owner_prev_token', ownerToken);
          } catch (_) {}
          if (this.$auth?.setUserToken) await this.$auth.setUserToken(data.token);
          try {
            localStorage.setItem('zx_xodim_session', '1');
            localStorage.removeItem('user_balance');
            localStorage.removeItem('user_notifications');
          } catch (_) {}
          // To'liq sahifa navigatsiyasi — xodim DTO (is_xodim) /user/me orqali tiklanadi
          window.location.assign(this.localePath({ name: 'qarz-daftari' }));
        } else {
          this.$toast?.error(data?.message || 'Xatolik');
          this.enteringXodim = false;
        }
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik yuz berdi');
        this.enteringXodim = false;
      }
    },
    /**
     * Xodim sifatida tizimga kirish — telefon raqami va aniq do'kon
     * (faoliyat_id) pre-fill bilan. faoliyat_id orqali bir nechta do'konli
     * xodim'lar disambiguation oladi (qaysi do'kon uchun login).
     */
    openXodimLogin(faoliyatId) {
      const phone = this.$auth?.user?.phone || '';
      const params = [];
      if (phone) params.push(`telefon=${encodeURIComponent(phone)}`);
      if (faoliyatId) params.push(`faoliyat_id=${encodeURIComponent(faoliyatId)}`);
      const qs = params.length ? `?${params.join('&')}` : '';
      const target = this.localePath({ name: 'qarz-daftari-xodim-login' }) + qs;
      // To'liq sahifa navigatsiyasi — xodim sessiyasi to'g'ri tiklanishi uchun
      window.location.assign(target);
    },
  },
};
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.3s ease;
}
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
