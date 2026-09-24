<template>
  <div class="pb-8">
    <!-- Page Header: "< Qarzga olish" + tanlangan do'kon nomi (kichik satr) -->
    <div class="flex items-start gap-3 mb-6">
      <!-- SS18 (2026-09-21): "bitta oldingi sahifa" qoidasi — qattiq marshrut emas,
           haqiqiy brauzer tarixi (masalan mijoz sahifasidan kelingan bo'lsa,
           o'sha yerga qaytadi). -->
      <button type="button" @click="goBack" class="flex-shrink-0 mt-1 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm transition-colors" :title="texts.back">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="min-w-0">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
        <div class="flex items-center gap-1.5 mt-1 min-w-0">
          <ShopIcon cls="w-4 h-4 flex-shrink-0" />
          <span class="text-sm text-gray-500 truncate">{{ faoliyatNomi || '—' }}</span>
        </div>
      </div>
    </div>

    <!-- SS5 (2026-09-20): "Jami qarz" va "Qoldiq qarz" statistika kartalari OLIB
         TASHLANDI — foydalanuvchi talabi bo'yicha sahifa sarlavhadan keyin
         darhol "Diqqat" ogohlantirish kartasidan boshlanadi. Ular uchun
         xizmat qilgan computed'lar (jamiUzs/jamiUsd/totalQoldiq*) va
         formatCompact() metodi ham o'lik kod bo'lgani uchun o'chirildi. -->

    <!-- Ogohlantirish — qarz daftariga kiritilgan qarzlar bo'yicha shartnoma yo'q -->
    <div v-if="showWarning" class="relative overflow-hidden rounded-2xl mb-6 border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 shadow-md">
      <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-amber-400 to-orange-500"></div>
      <div class="flex items-start gap-4 p-4 pl-6">
        <div class="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-amber-900 mb-0.5">{{ texts.diqqat }}</p>
          <p class="text-sm font-medium text-amber-800 leading-relaxed">{{ texts.warning }}</p>
        </div>
        <button @click="showWarning = false" class="flex-shrink-0 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">{{ texts.understood }}</button>
      </div>
    </div>

    <!-- Qanday ishlaydi? — 2 qadamli qisqa yo'riqnoma -->
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-5 mb-6">
      <div class="flex flex-col md:flex-row md:items-center gap-5">
        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="text-sm font-semibold text-gray-800">{{ texts.guideTitle }}</h3>
        </div>
        <div class="flex flex-col md:flex-row gap-4 md:gap-8 flex-1">
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">1</div>
            <p class="text-sm text-gray-600">{{ texts.step1 }}</p>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">2</div>
            <p class="text-sm text-gray-600">{{ texts.step2 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Yangi mijoz -->
    <div class="mb-4">
      <button @click="showQarzDaftariMijozModal = true" class="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        {{ texts.yangiMijoz }}
      </button>
    </div>

    <!-- Qidiruv: lupa + matn bir qatorda flex layout -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex flex-row gap-3 items-center">
        <div class="flex items-center gap-2 flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
          <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="search" type="text" :placeholder="texts.search" class="flex-1 border-0 outline-none text-sm bg-transparent" />
        </div>
        <p class="text-sm text-gray-400 flex-shrink-0 whitespace-nowrap">{{ filteredMijozlar.length }} {{ texts.clientCount }}</p>
      </div>
    </div>

    <!-- Mijozlar jadvali -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table v-if="filteredMijozlar.length" class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left text-xs font-medium text-gray-500 px-6 py-3">{{ texts.client }}</th>
            <th class="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">{{ texts.phone }}</th>
            <th class="text-center text-xs font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">{{ texts.debtsCount }}</th>
            <th class="text-right text-xs font-medium text-gray-500 px-4 py-3">{{ texts.debtAmountUzs }}</th>
            <th class="text-right text-xs font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">{{ texts.debtAmountUsd }}</th>
            <th class="text-center text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">{{ texts.status }}</th>
            <th class="text-right text-xs font-medium text-gray-500 px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="m in filteredMijozlar"
            :key="m.id"
            @click="selectMijoz(m)"
            class="border-b border-gray-50 cursor-pointer hover:bg-green-50 transition-colors group"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">{{ m.fish }}</p>
                  <p v-if="m.telefon" class="text-xs text-gray-400 md:hidden">{{ m.telefon }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">{{ m.telefon || '—' }}</td>
            <td class="px-4 py-4 text-center hidden lg:table-cell">
              <span v-if="m.qarz_soni > 0" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{{ m.qarz_soni }}</span>
              <span v-else class="text-xs text-gray-300">0</span>
            </td>
            <td class="px-4 py-4 text-right">
              <span :class="['text-sm font-semibold', parseFloat(m.qoldiq_uzs) > 0 ? 'text-red-600' : 'text-gray-300']">
                {{ parseFloat(m.qoldiq_uzs) > 0 ? formatMoney(m.qoldiq_uzs) : '0' }}
              </span>
            </td>
            <td class="px-4 py-4 text-right hidden lg:table-cell">
              <span :class="['text-sm font-semibold', parseFloat(m.qoldiq_usd) > 0 ? 'text-red-600' : 'text-gray-300']">
                {{ parseFloat(m.qoldiq_usd) > 0 ? formatMoney(m.qoldiq_usd) : '0' }}
              </span>
            </td>
            <td class="px-4 py-4 text-center hidden sm:table-cell">
              <span v-if="m.aktiv_qarz_soni > 0" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-700">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>{{ texts.activeLabel }}
              </span>
              <span v-else class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-400">
                <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span>{{ texts.noDebt }}
              </span>
            </td>
            <td class="px-6 py-4 text-right whitespace-nowrap">
              <!-- SS8 (2026-09-20): qator bosilsa endi QARZ FORMASI ochiladi (talab shunday).
                   Mijoz tarixiga yo'l yo'qolib qolmasligi uchun alohida "tarix" tugmasi —
                   @click.stop bilan, qatorning o'z bosilishini to'smaydi. -->
              <button
                type="button"
                class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-300 hover:text-green-600 hover:bg-green-50 transition-colors align-middle"
                :title="texts.mijozTarixi"
                :aria-label="texts.mijozTarixi"
                @click.stop="openMijozTarixi(m)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </button>
              <svg class="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors inline-block align-middle ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Bo'sh holat -->
      <div v-else-if="!loading" class="text-center py-16">
        <div class="max-w-sm mx-auto">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <p class="text-gray-900 font-medium mb-1">{{ search ? texts.notFound : texts.emptyTitle }}</p>
          <p class="text-gray-400 text-sm mb-5">{{ search ? texts.notFoundDesc : texts.emptyDesc }}</p>
          <button v-if="!search" @click="showQarzDaftariMijozModal = true" class="px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors text-sm inline-flex items-center">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            {{ texts.addFirst }}
          </button>
        </div>
      </div>
    </div>

    <QarzDaftariMijozModal v-if="showQarzDaftariMijozModal" :faoliyatId="faoliyatId" @close="showQarzDaftariMijozModal = false" @saved="onMijozSaved" />
  </div>
</template>

<script>
import { formatMoney } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
export default {
  middleware: 'auth',
  data() {
    return { mijozlar: [], search: '', showQarzDaftariMijozModal: false, loading: true, faoliyat: null, showWarning: true };
  },
  computed: {
    faoliyatId() { return this.$route.params.id; },
    turi() { return this.$route.path.includes('/berish') ? 'berish' : 'olish'; },
    filteredMijozlar() {
      if (!this.search) return this.mijozlar;
      const s = this.search.toLowerCase();
      return this.mijozlar.filter(m => m.fish?.toLowerCase().includes(s) || m.telefon?.includes(s));
    },
    // SS5 (2026-09-20): totalQoldiqUzs/totalQoldiqUsd/jamiUzs/jamiUsd olib
    // tashlandi — ular faqat o'chirilgan statistika kartalariga xizmat qilardi.
    faoliyatNomi() {
      return this.faoliyat?.nomi || '';
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: this.turi === 'berish' ? 'Qarzga berish' : 'Qarzga olish',
          back: "Orqaga", search: "FISh yoki telefon raqami bo'yicha qidirish", yangiMijoz: "Yangi mijoz", clientCount: "ta mijoz",
          client: "Mijoz", phone: "Telefon", debtsCount: "Qarzlar", debtAmountUzs: "Qoldiq (UZS)", debtAmountUsd: "Qoldiq (USD)", status: "Holat",
          activeLabel: "Aktiv", noDebt: "Qarzsiz", mijozTarixi: "Mijoz qarz tarixi",
          emptyTitle: "Mijozlar hali qo'shilmagan", emptyDesc: "Birinchi mijozingizni qo'shing va qarz yarating", addFirst: "Mijoz qo'shish",
          notFound: "Mijoz topilmadi", notFoundDesc: "Qidiruv so'rovingizga mos mijoz yo'q",
          diqqat: "Diqqat",
          warning: "Qarz daftariga kiritilgan qarzlar bo'yicha shartnoma rasmiylashtirilmaydi. Qarzlaringizni elektron boshqarish imkoniyatiga ega bo'lasiz, biroq huquqiy shartnoma tuzilmaydi.",
          understood: "Tushundim",
          guideTitle: "Qanday ishlaydi?",
          step1: "Mijozni tanlang yoki yangisini qo'shing",
          step2: "Summa, mahsulot va muddatni kiriting — qarz daftariga saqlanadi"
        },
        ru: {
          title: this.turi === 'berish' ? 'Дать в долг' : 'Взять в долг',
          back: "Назад", search: "Поиск по ФИО или номеру телефона", yangiMijoz: "Новый клиент", clientCount: "клиентов",
          client: "Клиент", phone: "Телефон", debtsCount: "Долги", debtAmountUzs: "Остаток (UZS)", debtAmountUsd: "Остаток (USD)", status: "Статус",
          activeLabel: "Активный", noDebt: "Без долга", mijozTarixi: "История долгов клиента",
          emptyTitle: "Клиенты ещё не добавлены", emptyDesc: "Добавьте первого клиента и создайте долг", addFirst: "Добавить клиента",
          notFound: "Клиент не найден", notFoundDesc: "Нет клиентов, соответствующих запросу",
          diqqat: "Обратите внимание",
          warning: "По записям в книге долгов договор не оформляется. Вы получаете электронное управление долгами, но юридический договор не заключается.",
          understood: "Понятно",
          guideTitle: "Как это работает?",
          step1: "Выберите клиента или добавьте нового",
          step2: "Введите сумму, товар и срок — сохранится в книге долгов"
        },
        kr: {
          title: this.turi === 'berish' ? 'Қарзга бериш' : 'Қарзга олиш',
          back: "Орқага", search: "ФИШ ёки телефон рақами бўйича қидириш", yangiMijoz: "Янги мижоз", clientCount: "та мижоз",
          client: "Мижоз", phone: "Телефон", debtsCount: "Қарзлар", debtAmountUzs: "Қолдиқ (UZS)", debtAmountUsd: "Қолдиқ (USD)", status: "Ҳолат",
          activeLabel: "Актив", noDebt: "Қарзсиз", mijozTarixi: "Мижоз қарз тарихи",
          emptyTitle: "Мижозлар ҳали қўшилмаган", emptyDesc: "Биринчи мижозингизни қўшинг", addFirst: "Мижоз қўшиш",
          notFound: "Мижоз топилмади", notFoundDesc: "Қидирув сўровингизга мос мижоз йўқ",
          diqqat: "Диққат",
          warning: "Қарз дафтарига киритилган қарзлар бўйича шартнома расмийлаштирилмайди. Қарзларингизни электрон бошқариш имкониятига эга бўласиз, бироқ ҳуқуқий шартнома тузилмайди.",
          understood: "Тушундим",
          guideTitle: "Қандай ишлайди?",
          step1: "Мижозни танланг ёки янгисини қўшинг",
          step2: "Сумма, маҳсулот ва муддатни киритинг — қарз дафтарига сақланади"
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await Promise.all([this.loadMijozlar(), this.loadFaoliyat()]); },
  methods: {
    formatMoney, // SS-AUDIT (2026-09-25): utils/helpers
    // SS5 (2026-09-20): formatCompact() o'chirildi — u faqat olib tashlangan
    // "Jami qarz"/"Qoldiq qarz" kartalarida ishlatilardi (jadvalda formatMoney).
    async loadFaoliyat() {
      try {
        const res = await this.$axios.$get('/qarz-daftari/savdo-faoliyat', { silent: true });
        if (res?.success && Array.isArray(res.data)) {
          this.faoliyat = res.data.find(f => String(f.id) === String(this.faoliyatId)) || null;
        }
      } catch (_) {}
    },
    async loadMijozlar() {
      try {
        this.loading = true;
        const res = await this.$axios.$get(`/qarz-daftari/savdo-faoliyat/${this.faoliyatId}/mijozlar`, { params: { turi: this.turi }, silent: true });
        if (res?.success) this.mijozlar = res.data;
      } catch (_) {} finally { this.loading = false; }
    },
    // SS8 (2026-09-20): mijoz qatori bosilganda ILGARI mijoz tafsiloti sahifasi
    // ochilardi — foydalanuvchi esa "Qarzga olish" oqimida qarz ma'lumotlarini
    // kiritish formasi ochilishini kutadi. Endi darhol `yangi` formasiga o'tamiz
    // va mijozni `?mijoz_id=` orqali oldindan tanlangan holda uzatamiz
    // (yangi mijoz qo'shilgandagi onMijozSaved oqimi bilan bir xil).
    /** SS18: bitta oldingi sahifa; tarix bo'sh bo'lsa — bo'lim boshiga. */
    goBack() {
      if (window.history.length > 1) this.$router.back();
      else this.$router.push(this.localePath({ name: 'qarz-daftari' }));
    },
    /** SS8: mijozning qarz tarixi sahifasi (qator bosilishidan ALOHIDA). */
    openMijozTarixi(m) {
      this.$router.push(this.localePath({
        name: 'qarz-daftari-mijoz-id',
        params: { id: m.id },
      }) + (this.turi ? `?turi=${this.turi}` : ''));
    },
    selectMijoz(m) {
      this.$router.push(this.localePath({
        name: this.turi === 'berish' ? 'qarz-daftari-faoliyat-id-berish-yangi' : 'qarz-daftari-faoliyat-id-olish-yangi',
        params: { id: this.faoliyatId },
        query: { mijoz_id: m.id },
      }));
    },
    async onMijozSaved(mijoz) {
      this.showQarzDaftariMijozModal = false;
      await this.loadMijozlar();
      // Yangi mijoz qo'shilganda esa darhol qarz formasiga
      if (mijoz?.id) {
        this.$router.push(this.localePath({
          name: this.turi === 'berish' ? 'qarz-daftari-faoliyat-id-berish-yangi' : 'qarz-daftari-faoliyat-id-olish-yangi',
          params: { id: this.faoliyatId },
          query: { mijoz_id: mijoz.id },
        }));
      }
    },
  },
};
</script>
