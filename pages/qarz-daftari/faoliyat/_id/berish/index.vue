<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
        <p class="text-gray-500 mt-1">{{ texts.subtitle }}</p>
      </div>
      <div class="flex gap-3 mt-4 md:mt-0">
        <nuxt-link :to="localePath({ name: 'qarz-daftari-kiritish' })" class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm text-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          {{ texts.back }}
        </nuxt-link>
        <button @click="showQarzDaftariMijozModal = true" class="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
          {{ texts.yangiMijoz }}
        </button>
      </div>
    </div>

    <!-- Statistikalar -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
        <p class="text-xs font-medium text-gray-500">{{ texts.totalClients }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ mijozlar.length }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
        <p class="text-xs font-medium text-gray-500">{{ texts.activeDebts }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalAktivQarz }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-400">
        <p class="text-xs font-medium text-gray-500">{{ texts.totalDebtUzs }}</p>
        <p class="text-xl font-bold text-gray-900 mt-1">{{ formatMoney(totalQoldiqUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-400">
        <p class="text-xs font-medium text-gray-500">{{ texts.totalDebtUsd }}</p>
        <p class="text-xl font-bold text-gray-900 mt-1">{{ formatMoney(totalQoldiqUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
      </div>
    </div>

    <!-- Qidiruv: lupa + matn bir qatorda flex layout -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex flex-row gap-3 items-center">
        <div class="flex items-center gap-2 flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
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
            class="border-b border-gray-50 cursor-pointer hover:bg-blue-50 transition-colors group"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                  {{ m.fish?.charAt(0)?.toUpperCase() }}
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">{{ m.fish }}</p>
                  <p v-if="m.telefon" class="text-xs text-gray-400 md:hidden">{{ m.telefon }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">{{ m.telefon || '—' }}</td>
            <td class="px-4 py-4 text-center hidden lg:table-cell">
              <span v-if="m.qarz_soni > 0" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{{ m.qarz_soni }}</span>
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
            <td class="px-6 py-4 text-right">
              <svg class="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
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
          <button v-if="!search" @click="showQarzDaftariMijozModal = true" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm inline-flex items-center">
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
export default {
  middleware: 'auth',
  data() {
    return { mijozlar: [], search: '', showQarzDaftariMijozModal: false, loading: true };
  },
  computed: {
    faoliyatId() { return this.$route.params.id; },
    turi() { return this.$route.path.includes('/berish') ? 'berish' : 'olish'; },
    filteredMijozlar() {
      if (!this.search) return this.mijozlar;
      const s = this.search.toLowerCase();
      return this.mijozlar.filter(m => m.fish?.toLowerCase().includes(s) || m.telefon?.includes(s));
    },
    totalAktivQarz() {
      return this.mijozlar.reduce((s, m) => s + (parseInt(m.aktiv_qarz_soni) || 0), 0);
    },
    totalQoldiqUzs() {
      return this.mijozlar.reduce((s, m) => s + (parseFloat(m.qoldiq_uzs) || 0), 0);
    },
    totalQoldiqUsd() {
      return this.mijozlar.reduce((s, m) => s + (parseFloat(m.qoldiq_usd) || 0), 0);
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: this.turi === 'berish' ? 'Qarzga berish' : 'Qarzga olish',
          subtitle: "Mijozni tanlang — qarz yaratish sahifasiga o'tasiz",
          back: "Orqaga", search: "FISH yoki telefon raqami bilan qidirish...", yangiMijoz: "Yangi mijoz", clientCount: "ta mijoz",
          totalClients: "Jami mijozlar", activeDebts: "Aktiv qarzlar", totalDebtUzs: "Jami qoldiq", totalDebtUsd: "Jami qoldiq",
          client: "Mijoz", phone: "Telefon", debtsCount: "Qarzlar", debtAmountUzs: "Qoldiq (UZS)", debtAmountUsd: "Qoldiq (USD)", status: "Holat",
          activeLabel: "Aktiv", noDebt: "Qarzsiz",
          emptyTitle: "Mijozlar hali qo'shilmagan", emptyDesc: "Birinchi mijozingizni qo'shing va qarz yarating", addFirst: "Mijoz qo'shish",
          notFound: "Mijoz topilmadi", notFoundDesc: "Qidiruv so'rovingizga mos mijoz yo'q"
        },
        ru: {
          title: this.turi === 'berish' ? 'Дать в долг' : 'Взять в долг',
          subtitle: "Выберите клиента — вы перейдёте на страницу создания долга",
          back: "Назад", search: "Поиск по ФИО или номеру телефона...", yangiMijoz: "Новый клиент", clientCount: "клиентов",
          totalClients: "Всего клиентов", activeDebts: "Активные долги", totalDebtUzs: "Итого", totalDebtUsd: "Итого",
          client: "Клиент", phone: "Телефон", debtsCount: "Долги", debtAmountUzs: "Остаток (UZS)", debtAmountUsd: "Остаток (USD)", status: "Статус",
          activeLabel: "Активный", noDebt: "Без долга",
          emptyTitle: "Клиенты ещё не добавлены", emptyDesc: "Добавьте первого клиента и создайте долг", addFirst: "Добавить клиента",
          notFound: "Клиент не найден", notFoundDesc: "Нет клиентов, соответствующих запросу"
        },
        kr: {
          title: this.turi === 'berish' ? 'Қарзга бериш' : 'Қарзга олиш',
          subtitle: "Мижозни танланг — қарз яратиш саҳифасига ўтасиз",
          back: "Орқага", search: "ФИШ ёки телефон рақами билан қидириш...", yangiMijoz: "Янги мижоз", clientCount: "та мижоз",
          totalClients: "Жами мижозлар", activeDebts: "Актив қарзлар", totalDebtUzs: "Жами қолдиқ", totalDebtUsd: "Жами қолдиқ",
          client: "Мижоз", phone: "Телефон", debtsCount: "Қарзлар", debtAmountUzs: "Қолдиқ (UZS)", debtAmountUsd: "Қолдиқ (USD)", status: "Ҳолат",
          activeLabel: "Актив", noDebt: "Қарзсиз",
          emptyTitle: "Мижозлар ҳали қўшилмаган", emptyDesc: "Биринчи мижозингизни қўшинг", addFirst: "Мижоз қўшиш",
          notFound: "Мижоз топилмади", notFoundDesc: "Қидирув сўровингизга мос мижоз йўқ"
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.loadMijozlar(); },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    async loadMijozlar() {
      try {
        this.loading = true;
        const res = await this.$axios.$get(`/qarz-daftari/savdo-faoliyat/${this.faoliyatId}/mijozlar`, { params: { turi: this.turi }, silent: true });
        if (res?.success) this.mijozlar = res.data;
      } catch (_) {} finally { this.loading = false; }
    },
    selectMijoz(m) {
      // Mijoz qatori bosilganda — mijoz tarixi sahifasiga
      this.$router.push(this.localePath({
        name: 'qarz-daftari-mijoz-id',
        params: { id: m.id },
      }));
    },
    async onMijozSaved(mijoz) {
      this.showQarzDaftariMijozModal = false;
      await this.loadMijozlar();
      // Yangi mijoz qo'shilganda esa darhol qarz formasiga o'tish (legacy UX)
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
