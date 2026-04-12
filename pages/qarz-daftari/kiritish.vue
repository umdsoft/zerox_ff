<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.pageTitle }}</h1>
        <p class="text-gray-500 mt-1">{{ texts.pageSubtitle }}</p>
      </div>
      <nuxt-link :to="localePath({ name: 'qarz-daftari' })" class="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mt-3 md:mt-0 transition-colors">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        {{ texts.back }}
      </nuxt-link>
    </div>

    <!-- Ogohlantirish -->
    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <p class="flex-1 text-sm text-amber-800 leading-relaxed">{{ texts.warning }}</p>
      </div>
    </div>

    <!-- Faoliyatlar mavjud -->
    <template v-if="faoliyatlar.length">
      <!-- 1-qadam: Savdo faoliyat tanlash kartalar -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ texts.selectFaoliyat }}</h2>
          <button @click="showAddModal = true" class="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors border border-gray-300 text-sm">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            {{ texts.qoshish }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="f in faoliyatlar"
            :key="f.id"
            @click="selectedFaoliyat = f.id"
            :class="[
              'bg-white rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-md',
              selectedFaoliyat === f.id ? 'border-blue-500 shadow-md ring-1 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center gap-3">
              <div :class="[
                'w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-colors',
                selectedFaoliyat === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
              ]">
                {{ f.nomi?.charAt(0)?.toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p :class="['font-semibold truncate', selectedFaoliyat === f.id ? 'text-blue-700' : 'text-gray-900']">{{ f.nomi }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ texts.faoliyat }}</p>
              </div>
              <div v-if="selectedFaoliyat === f.id" class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </div>
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
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">{{ texts.guideTitle }}</p>
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

    <!-- Yangi faoliyat modal -->
    <QarzDaftariSavdoFaoliyatModal v-if="showAddModal" @close="showAddModal = false" @saved="onFaoliyatSaved" />
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return { faoliyatlar: [], selectedFaoliyat: null, showAddModal: false };
  },
  computed: {
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          pageTitle: "Qarz daftariga kiritish",
          pageSubtitle: "Savdo faoliyatingizni tanlang va qarz turini belgilang",
          back: "Qarz daftari",
          warning: "Qarz oldi-berdi munosabatlaringizni qarz daftariga kiritish orqali qarzlaringizni elektron boshqarish imkoniga ega bo'lasiz. Biroq qarz daftariga kiritilgan qarzlar bo'yicha shartnoma rasmiylashtirilmaydi.",
          selectFaoliyat: "Savdo faoliyatini tanlang",
          faoliyat: "Savdo faoliyati",
          tanlang: "Tanlang...",
          qoshish: "Yangi qo'shish",
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
          selectFaoliyat: "Выберите торговую деятельность",
          faoliyat: "Торговая деятельность",
          tanlang: "Выбрать...",
          qoshish: "Добавить новую",
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
          selectFaoliyat: "Савдо фаолиятини танланг",
          faoliyat: "Савдо фаолияти",
          tanlang: "Танланг...",
          qoshish: "Янги қўшиш",
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
      await this.loadFaoliyatlar();
      const faoliyat = response?.data || response;
      if (faoliyat?.id) this.selectedFaoliyat = faoliyat.id;
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
