<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ pageTitle }}</h1>
        <p class="text-gray-500 mt-1">{{ pageSubtitle }}</p>
      </div>
      <nuxt-link :to="localePath({ name: 'qarz-daftari' })" class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm text-sm mt-3 md:mt-0">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        {{ texts.back }}
      </nuxt-link>
    </div>

    <!-- Statistika cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
        <p class="text-xs font-medium text-gray-500">{{ texts.total }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ qarzlar.length }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
        <p class="text-xs font-medium text-gray-500">{{ texts.activeCount }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ activeCount }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-400">
        <p class="text-xs font-medium text-gray-500">{{ texts.totalUzs }}</p>
        <p class="text-xl font-bold text-gray-900 mt-1">{{ formatMoney(totalQoldiqUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-400">
        <p class="text-xs font-medium text-gray-500">{{ texts.totalUsd }}</p>
        <p class="text-xl font-bold text-gray-900 mt-1">{{ formatMoney(totalQoldiqUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
      </div>
    </div>

    <!-- Search -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex flex-row gap-3 items-center">
        <div class="flex items-center gap-2 flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="search" type="text" :placeholder="texts.searchPlaceholder" class="flex-1 border-0 outline-none text-sm bg-transparent" />
        </div>
        <p class="text-sm text-gray-400 flex-shrink-0 whitespace-nowrap">{{ filteredQarzlar.length }} {{ texts.itemsLabel }}</p>
      </div>
    </div>

    <!-- Qarzlar jadvali — mijoz kesimida grupplangan -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table v-if="grouppedMijozlar.length" class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left text-xs font-medium text-gray-500 px-6 py-3">{{ texts.client }}</th>
            <th class="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">{{ texts.savdoFaoliyat }}</th>
            <th class="text-center text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">{{ texts.debtsCount }}</th>
            <th class="text-right text-xs font-medium text-gray-500 px-4 py-3">{{ texts.totalRemaining }} (UZS)</th>
            <th class="text-right text-xs font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">{{ texts.totalRemaining }} (USD)</th>
            <th class="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">{{ turi === 'olish' ? texts.lastDateOlish : texts.lastDateBerish }}</th>
            <th class="text-center text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">{{ texts.status }}</th>
            <th class="text-right text-xs font-medium text-gray-500 px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="m in grouppedMijozlar"
            :key="m.mijoz_id"
            @click="openMijoz(m)"
            class="border-b border-gray-50 cursor-pointer hover:bg-blue-50 transition-colors group"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div :class="['w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm', turi === 'berish' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600']">
                  {{ (m.fish || '?').charAt(0).toUpperCase() }}
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-gray-900">{{ m.fish || '—' }}</p>
                  <p v-if="m.telefon" class="text-xs text-gray-400">{{ m.telefon }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 hidden lg:table-cell">
              <span v-if="m.savdo_faoliyat_label" class="inline-flex items-center gap-1.5 text-xs text-gray-600">
                <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                <span class="truncate" :title="m.savdo_faoliyat_label">{{ m.savdo_faoliyat_label }}</span>
              </span>
              <span v-else class="text-xs text-gray-300">—</span>
            </td>
            <td class="px-4 py-4 text-center hidden md:table-cell">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{{ m.qarzlar_soni }}</span>
            </td>
            <td class="px-4 py-4 text-right">
              <span :class="['text-sm font-semibold', m.qoldiq_uzs > 0 ? 'text-red-600' : 'text-gray-300']">
                {{ formatMoney(m.qoldiq_uzs) }}
              </span>
            </td>
            <td class="px-4 py-4 text-right hidden lg:table-cell">
              <span :class="['text-sm font-semibold', m.qoldiq_usd > 0 ? 'text-red-600' : 'text-gray-300']">
                {{ formatMoney(m.qoldiq_usd) }}
              </span>
            </td>
            <td class="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">{{ formatDate(m.last_date) }}</td>
            <td class="px-4 py-4 text-center hidden sm:table-cell">
              <span :class="m.has_expired ? 'bg-red-50 text-red-700' : (m.has_active ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700')" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium">
                <span :class="['w-1.5 h-1.5 rounded-full', m.has_expired ? 'bg-red-500' : (m.has_active ? 'bg-amber-500' : 'bg-green-500')]"></span>
                {{ m.has_expired ? texts.statusExpired : (m.has_active ? texts.statusActive : texts.statusClosed) }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <svg class="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else-if="!loading && grouppedMijozlar.length === 0" class="text-center py-16">
        <div class="max-w-sm mx-auto">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <p class="text-gray-900 font-medium mb-1">{{ texts.empty }}</p>
          <p class="text-gray-400 text-sm">{{ texts.emptyDesc }}</p>
        </div>
      </div>
      <div v-if="loading" class="text-center py-12">
        <svg class="w-10 h-10 text-blue-500 mx-auto animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return { qarzlar: [], search: '', loading: true };
  },
  computed: {
    turi() { return this.$route.query.turi || ''; },         // 'berish' | 'olish' | ''
    status() { return this.$route.query.status || ''; },      // '' | 'muddati-otgan' | 'aktiv' | ...
    pageTitle() {
      if (this.status === 'muddati-otgan') {
        return this.turi === 'berish' ? this.texts.titleExpiredDebitor : this.texts.titleExpiredKreditor;
      }
      return this.turi === 'berish' ? this.texts.titleBerilgan : this.texts.titleOlingan;
    },
    pageSubtitle() {
      if (this.status === 'muddati-otgan') return this.texts.subtitleExpired;
      return this.turi === 'berish' ? this.texts.subtitleBerilgan : this.texts.subtitleOlingan;
    },
    filteredQarzlar() {
      if (!this.search) return this.qarzlar;
      const s = this.search.toLowerCase();
      return this.qarzlar.filter(q =>
        (q.mijoz?.fish || '').toLowerCase().includes(s)
        || (q.mahsulot_nomi || '').toLowerCase().includes(s)
        || String(q.miqdor || '').includes(s)
      );
    },
    /**
     * Mijoz kesimida group qilish:
     *   - Bitta mijoz = bitta qator
     *   - Barcha qarzlari summa qilingan (qoldiq UZS + USD alohida)
     *   - Eng oxirgi qarz sanasi (created_at desc bo'yicha)
     *   - Holat: muddati o'tgan > aktiv > yopilgan
     */
    grouppedMijozlar() {
      const map = new Map();
      const now = new Date();
      this.filteredQarzlar.forEach(q => {
        const mid = q.mijoz_id || q.mijoz?.id;
        if (!mid) return;
        if (!map.has(mid)) {
          map.set(mid, {
            mijoz_id: mid,
            fish: q.mijoz?.fish || '—',
            telefon: q.mijoz?.telefon || '',
            savdo_faoliyat_set: new Set(),
            qarzlar_soni: 0,
            qoldiq_uzs: 0,
            qoldiq_usd: 0,
            last_date: null,
            has_active: false,
            has_expired: false,
          });
        }
        const m = map.get(mid);
        m.qarzlar_soni++;
        const qoldiq = parseFloat(q.qoldiq) || 0;
        if (q.valyuta === 'USD') m.qoldiq_usd += qoldiq;
        else m.qoldiq_uzs += qoldiq;

        // Savdo faoliyati nomi (do'kon)
        const sfNomi = q.savdoFaoliyat?.nomi || q.savdo_faoliyat?.nomi;
        if (sfNomi) m.savdo_faoliyat_set.add(sfNomi);

        // Eng oxirgi sana — berilgan_sana yoki created_at
        const dt = q.berilgan_sana || q.created_at;
        if (dt && (!m.last_date || new Date(dt) > new Date(m.last_date))) {
          m.last_date = dt;
        }

        // Status flags
        if (q.status === 'aktiv') {
          m.has_active = true;
          if (q.qaytarish_sanasi && new Date(q.qaytarish_sanasi) < now) {
            m.has_expired = true;
          }
        }
      });
      // Set'ni label string'ga aylantirish: bittadan ko'p bo'lsa "+N" ko'rsatamiz
      const result = Array.from(map.values()).map(m => {
        const list = Array.from(m.savdo_faoliyat_set);
        m.savdo_faoliyat_label = list.length === 0
          ? ''
          : list.length === 1
            ? list[0]
            : `${list[0]} +${list.length - 1}`;
        delete m.savdo_faoliyat_set;
        return m;
      });
      // Eng oxirgi sanasi yangidan eskiga
      return result.sort((a, b) => {
        const da = a.last_date ? new Date(a.last_date) : 0;
        const db = b.last_date ? new Date(b.last_date) : 0;
        return db - da;
      });
    },
    activeCount() { return this.qarzlar.filter(q => q.status === 'aktiv').length; },
    totalQoldiqUzs() {
      return this.qarzlar.reduce((s, q) => s + (q.valyuta === 'UZS' ? Number(q.qoldiq) || 0 : 0), 0);
    },
    totalQoldiqUsd() {
      return this.qarzlar.reduce((s, q) => s + (q.valyuta === 'USD' ? Number(q.qoldiq) || 0 : 0), 0);
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          titleBerilgan: 'Berilgan qarzlar',
          titleOlingan: 'Olingan qarzlar',
          titleExpiredDebitor: 'Muddati o\'tgan berilgan qarzlar',
          titleExpiredKreditor: 'Muddati o\'tgan olingan qarzlar',
          subtitleBerilgan: 'Sizdan qarz olgan shaxslar ro\'yxati',
          subtitleOlingan: 'Siz qarz olgan shaxslar ro\'yxati',
          subtitleExpired: 'Qaytarish muddati o\'tgan qarzlar',
          back: 'Orqaga',
          searchPlaceholder: 'FISH, mahsulot yoki summa bo\'yicha qidirish...',
          itemsLabel: 'ta qarz',
          total: 'Jami qarzlar',
          activeCount: 'Aktiv qarzlar',
          totalUzs: 'Jami qoldiq',
          totalUsd: 'Jami qoldiq',
          client: 'Mijoz',
          savdoFaoliyat: 'Savdo faoliyati',
          amount: 'Qarz miqdori',
          remaining: 'Qoldiq',
          totalRemaining: 'Jami qoldiq',
          debtsCount: 'Qarzlar',
          lastDateBerish: 'Oxirgi berilgan sana',
          lastDateOlish: 'Oxirgi olingan sana',
          dateGiven: 'Berilgan sana',
          dateReturn: 'Qaytarish sanasi',
          status: 'Holat',
          installment: 'Bo\'lib to\'lash',
          month: 'oy',
          empty: 'Qarzlar yo\'q',
          emptyDesc: 'Bu bo\'limda hozircha qarzlar mavjud emas',
          statusActive: 'Aktiv',
          statusClosed: 'Yopilgan',
          statusForgiven: 'Voz kechilgan',
          statusExpired: 'Muddati o\'tgan',
        },
        ru: {
          titleBerilgan: 'Выданные долги',
          titleOlingan: 'Полученные долги',
          titleExpiredDebitor: 'Просроченные выданные долги',
          titleExpiredKreditor: 'Просроченные полученные долги',
          subtitleBerilgan: 'Список лиц, взявших у вас в долг',
          subtitleOlingan: 'Список лиц, у которых вы взяли в долг',
          subtitleExpired: 'Долги с просроченной датой возврата',
          back: 'Назад',
          searchPlaceholder: 'Поиск по ФИО, товару или сумме...',
          itemsLabel: 'долгов',
          total: 'Всего долгов',
          activeCount: 'Активные',
          totalUzs: 'Итого остаток',
          totalUsd: 'Итого остаток',
          client: 'Клиент',
          savdoFaoliyat: 'Торговая деятельность',
          amount: 'Сумма',
          remaining: 'Остаток',
          totalRemaining: 'Итого остаток',
          debtsCount: 'Долги',
          lastDateBerish: 'Последняя дата выдачи',
          lastDateOlish: 'Последняя дата получения',
          dateGiven: 'Дата выдачи',
          dateReturn: 'Дата возврата',
          status: 'Статус',
          installment: 'Рассрочка',
          month: 'мес',
          empty: 'Нет долгов',
          emptyDesc: 'В этом разделе пока нет долгов',
          statusActive: 'Активный',
          statusClosed: 'Закрыт',
          statusForgiven: 'Прощён',
          statusExpired: 'Просрочен',
        },
        kr: {
          titleBerilgan: 'Берилган қарзлар',
          titleOlingan: 'Олинган қарзлар',
          titleExpiredDebitor: 'Муддати ўтган берилган қарзлар',
          titleExpiredKreditor: 'Муддати ўтган олинган қарзлар',
          subtitleBerilgan: 'Сиздан қарз олган шахслар рўйхати',
          subtitleOlingan: 'Сиз қарз олган шахслар рўйхати',
          subtitleExpired: 'Қайтариш муддати ўтган қарзлар',
          back: 'Орқага',
          searchPlaceholder: 'ФИШ, маҳсулот ёки сумма бўйича қидириш...',
          itemsLabel: 'та қарз',
          total: 'Жами қарзлар',
          activeCount: 'Актив қарзлар',
          totalUzs: 'Жами қолдиқ',
          totalUsd: 'Жами қолдиқ',
          client: 'Мижоз',
          savdoFaoliyat: 'Савдо фаолияти',
          amount: 'Қарз миқдори',
          remaining: 'Қолдиқ',
          totalRemaining: 'Жами қолдиқ',
          debtsCount: 'Қарзлар',
          lastDateBerish: 'Охирги берилган сана',
          lastDateOlish: 'Охирги олинган сана',
          dateGiven: 'Берилган сана',
          dateReturn: 'Қайтариш санаси',
          status: 'Ҳолат',
          installment: 'Бўлиб тўлаш',
          month: 'ой',
          empty: 'Қарзлар йўқ',
          emptyDesc: 'Бу бўлимда ҳозирча қарзлар мавжуд эмас',
          statusActive: 'Актив',
          statusClosed: 'Ёпилган',
          statusForgiven: 'Воз кечилган',
          statusExpired: 'Муддати ўтган',
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.load(); },
  watch: {
    '$route.query'() { this.load(); },
  },
  methods: {
    formatMoney(n) {
      if (!n) return '0';
      return Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    formatDate(d) {
      if (!d) return '—';
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      const dd = String(dt.getDate()).padStart(2, '0');
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const yy = dt.getFullYear();
      return `${dd}.${mm}.${yy}`;
    },
    isExpired(q) {
      if (q.status !== 'aktiv') return false;
      if (!q.qaytarish_sanasi) return false;
      return new Date(q.qaytarish_sanasi) < new Date();
    },
    statusText(q) {
      if (this.isExpired(q)) return this.texts.statusExpired;
      if (q.status === 'aktiv') return this.texts.statusActive;
      if (q.status === 'yopilgan') return this.texts.statusClosed;
      return this.texts.statusForgiven;
    },
    statusBadge(q) {
      if (this.isExpired(q)) return 'bg-red-50 text-red-700';
      if (q.status === 'aktiv') return 'bg-amber-50 text-amber-700';
      if (q.status === 'yopilgan') return 'bg-green-50 text-green-700';
      return 'bg-gray-50 text-gray-500';
    },
    statusDot(q) {
      if (this.isExpired(q)) return 'bg-red-500';
      if (q.status === 'aktiv') return 'bg-amber-500';
      if (q.status === 'yopilgan') return 'bg-green-500';
      return 'bg-gray-400';
    },
    async load() {
      this.loading = true;
      try {
        const params = {};
        if (this.turi) params.turi = this.turi;
        if (this.status) params.status = this.status;
        const res = await this.$axios.$get('/qarz-daftari/qarzlar', { params, silent: true });
        if (res?.success) this.qarzlar = res.data || [];
      } catch (_) {} finally { this.loading = false; }
    },
    openDetail(q) {
      this.$router.push(this.localePath({ name: 'qarz-daftari-qarz-id', params: { id: q.id } }));
    },
    openMijoz(m) {
      // Mijoz kesimidagi qator bosilsa — mijozning aggregat sahifasiga (qarz tafsiloti turida)
      this.$router.push(this.localePath({
        name: 'qarz-daftari-mijoz-id',
        params: { id: m.mijoz_id },
      }) + (this.turi ? `?turi=${this.turi}` : ''));
    },
  },
};
</script>
