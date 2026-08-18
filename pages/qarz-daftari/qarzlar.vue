<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div class="flex items-start gap-3">
        <nuxt-link :to="localePath({ name: 'qarz-daftari' })" class="flex-shrink-0 mt-1 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm transition-colors" :title="texts.back">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </nuxt-link>
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ pageTitle }}</h1>
          <p class="text-gray-500 mt-1">{{ pageSubtitle }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3 mt-3 md:mt-0">
        <button
          @click="exportExcel"
          :disabled="exporting || !grouppedMijozlar.length"
          class="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-sm text-sm"
          :title="texts.exportExcel"
        >
          <svg v-if="!exporting" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          {{ texts.exportExcel }}
        </button>
      </div>
    </div>

    <!-- Statistika cards — B31-2: Do'konlar / Jarayondagi qarzlar / Jami qoldiq (UZS+USD birga) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <!-- Do'konlar — bosilsa do'kon tanlash paneli ochiladi -->
      <button @click="showDokonPanel = !showDokonPanel" class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500 text-left hover:shadow-md transition flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="text-xs font-medium text-gray-500">{{ texts.dokonlar }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ dokonlar.length }}</p>
          <p v-if="selectedDokon" class="text-xs text-blue-600 mt-0.5 truncate">🏪 {{ selectedDokon }}</p>
        </div>
        <svg class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform mt-1" :class="showDokonPanel ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <!-- Jarayondagi qarzlar (faqat tugallanmagan aktiv qarzlar) -->
      <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
        <p class="text-xs font-medium text-gray-500">{{ texts.activeCount }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ activeCount }}</p>
      </div>
      <!-- Jami qoldiq — UZS tepada, USD tagida -->
      <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-400">
        <p class="text-xs font-medium text-gray-500">{{ texts.totalUzs }}</p>
        <p class="text-lg font-bold text-gray-900 mt-1">{{ formatMoney(totalQoldiqUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
        <p class="text-base font-bold text-gray-700 mt-0.5">{{ formatMoney(totalQoldiqUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
      </div>
    </div>

    <!-- B31-2: Do'kon tanlash paneli — do'kon bosilsa ro'yxat shu do'kon qarzlariga filtrlanadi -->
    <div v-if="showDokonPanel" class="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-gray-900">{{ texts.selectDokon }}</h3>
        <nuxt-link :to="localePath({ name: 'qarz-daftari' })" class="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">+ {{ texts.newDokon }}</nuxt-link>
      </div>
      <div v-if="dokonlar.length" class="flex flex-wrap gap-2">
        <button @click="selectDokon('')" :class="['px-4 py-2 rounded-lg text-sm font-medium border transition', !selectedDokon ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50']">{{ texts.allDokon }}</button>
        <button v-for="d in dokonlar" :key="d.nomi" @click="selectDokon(d.nomi)" :class="['px-4 py-2 rounded-lg text-sm font-medium border transition', selectedDokon === d.nomi ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50']">🏪 {{ d.nomi }} <span class="opacity-70">({{ d.count }})</span></button>
      </div>
      <p v-else class="text-sm text-gray-400">{{ texts.noDokon }}</p>
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
            <th class="text-center text-xs font-medium text-gray-500 px-2 py-3 hidden lg:table-cell w-20">{{ texts.savdoFaoliyat }}</th>
            <th class="text-center text-xs font-medium text-gray-500 px-3 py-3 hidden lg:table-cell">{{ texts.registrar }}</th>
            <th class="text-center text-xs font-medium text-gray-500 px-3 py-3 hidden md:table-cell">{{ texts.debtsCount }}</th>
            <th class="text-center text-xs font-medium text-gray-500 px-4 py-3">{{ texts.totalRemaining }} (UZS)</th>
            <th class="text-center text-xs font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">{{ texts.totalRemaining }} (USD)</th>
            <th class="text-center text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">{{ turi === 'olish' ? texts.lastDateOlish : texts.lastDateBerish }}</th>
            <th class="text-center text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">{{ texts.status }}</th>
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
            <td class="px-2 py-4 text-center hidden lg:table-cell w-20">
              <span v-if="m.savdo_faoliyat_label" class="block text-xs text-gray-600 truncate max-w-[5rem] mx-auto" :title="m.savdo_faoliyat_label">{{ m.savdo_faoliyat_label }}</span>
              <span v-else class="text-xs text-gray-300">—</span>
            </td>
            <td class="px-3 py-4 text-center hidden lg:table-cell">
              <span v-if="m.registrar_nomi" class="text-xs text-gray-600 whitespace-nowrap">{{ m.registrar_nomi }}</span>
              <span v-else class="text-xs text-gray-300">—</span>
            </td>
            <td class="px-4 py-4 text-center hidden md:table-cell">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{{ m.qarzlar_soni }}</span>
            </td>
            <td class="px-4 py-4 text-center">
              <span :class="['text-sm font-semibold whitespace-nowrap', m.qoldiq_uzs > 0 ? 'text-red-600' : 'text-gray-300']">
                {{ formatMoney(m.qoldiq_uzs) }}
              </span>
            </td>
            <td class="px-4 py-4 text-center hidden lg:table-cell">
              <span :class="['text-sm font-semibold whitespace-nowrap', m.qoldiq_usd > 0 ? 'text-red-600' : 'text-gray-300']">
                {{ formatMoney(m.qoldiq_usd) }}
              </span>
            </td>
            <td class="px-4 py-4 text-center text-sm text-gray-500 hidden md:table-cell whitespace-nowrap">{{ formatDate(m.last_date) }}</td>
            <td class="px-4 py-4 text-center hidden sm:table-cell">
              <span :class="m.has_expired ? 'bg-red-50 text-red-700' : (m.has_active ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700')" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap">
                <span :class="['w-1.5 h-1.5 rounded-full', m.has_expired ? 'bg-red-500' : (m.has_active ? 'bg-amber-500' : 'bg-green-500')]"></span>
                {{ m.has_expired ? texts.statusExpired : (m.has_active ? texts.statusActive : texts.statusClosed) }}
              </span>
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
    return { qarzlar: [], search: '', loading: true, exporting: false, selectedDokon: '', showDokonPanel: false };
  },
  computed: {
    turi() { return this.$route.query.turi || ''; },         // 'berish' | 'olish' | ''
    status() { return this.$route.query.status || ''; },      // '' | 'muddati-otgan' | 'aktiv' | ...
    pageTitle() {
      if (this.status === 'muddati-otgan') {
        return this.turi === 'berish' ? this.texts.titleExpiredDebitor : this.texts.titleExpiredKreditor;
      }
      if (this.status === 'muddati-oz-qolgan') {
        return this.turi === 'berish' ? this.texts.titleNearDebitor : this.texts.titleNearKreditor;
      }
      return this.turi === 'berish' ? this.texts.titleBerilgan : this.texts.titleOlingan;
    },
    pageSubtitle() {
      if (this.status === 'muddati-otgan') return this.texts.subtitleExpired;
      if (this.status === 'muddati-oz-qolgan') return this.texts.subtitleNear;
      return this.turi === 'berish' ? this.texts.subtitleBerilgan : this.texts.subtitleOlingan;
    },
    // B31-2: do'konlar ro'yxati (qarzlarда uchraydigan savdo faoliyatlari + soni)
    dokonlar() {
      const map = new Map();
      this.qarzlar.forEach(q => {
        const nomi = (q.savdoFaoliyat && q.savdoFaoliyat.nomi) || (q.savdo_faoliyat && q.savdo_faoliyat.nomi);
        if (!nomi) return;
        map.set(nomi, (map.get(nomi) || 0) + 1);
      });
      return Array.from(map.entries()).map(([nomi, count]) => ({ nomi, count })).sort((a, b) => b.count - a.count);
    },
    filteredQarzlar() {
      let base = this.qarzlar;
      // B31-2: tanlangan do'kon bo'yicha filtr (bo'sh = barcha do'konlar)
      if (this.selectedDokon) {
        base = base.filter(q => {
          const nomi = (q.savdoFaoliyat && q.savdoFaoliyat.nomi) || (q.savdo_faoliyat && q.savdo_faoliyat.nomi) || '';
          return nomi === this.selectedDokon;
        });
      }
      if (!this.search) return base;
      const s = this.search.toLowerCase().trim();
      // Telefon bo'yicha izlash: raqamlarni ajratib, formatlardan qat'i nazar solishtiramiz
      const digits = s.replace(/\D/g, '');
      return base.filter(q => {
        const tel = String(q.mijoz?.telefon || '');
        return (q.mijoz?.fish || '').toLowerCase().includes(s)
          || (q.mahsulot_nomi || '').toLowerCase().includes(s)
          || String(q.miqdor || '').includes(s)
          || tel.toLowerCase().includes(s)
          || (digits.length >= 3 && tel.replace(/\D/g, '').includes(digits));
      });
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
            registrar_set: new Set(),
            qarzlar_soni: 0,
            qoldiq_uzs: 0,
            qoldiq_usd: 0,
            last_date: null,
            has_active: false,
            has_expired: false,
            _maxDue: null,
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

        // Kiritgan shaxs TELEFON RAQAMI — xodim kiritgan bo'lsa xodim telefoni,
        // do'kon egasi kiritgan bo'lsa (xodim_id null) egasi telefoni.
        const regTel = q.xodim?.telefon || q.user?.phone;
        if (regTel) m.registrar_set.add(regTel);

        // Eng oxirgi sana — berilgan_sana yoki created_at
        const dt = q.berilgan_sana || q.created_at;
        if (dt && (!m.last_date || new Date(dt) > new Date(m.last_date))) {
          m.last_date = dt;
        }

        // Status flags — muddati mijozning ENG SO'NGGI (max) aktiv qarz muddati
        // bo'yicha aniqlanadi. Qarz oluvchiga kelasi muddat bilan yangi qarz berilsa,
        // butun tab shu muddat bilan yangilanadi → eski o'tgan qarzlari bilan birga
        // "muddati o'tgan" bo'lib qolmaydi (skrinshot 1). Faqat oxirgi muddat o'tgan
        // bo'lsa mijoz "muddati o'tgan" hisoblanadi.
        if (q.status === 'aktiv') {
          m.has_active = true;
          const due = q.qaytarish_sanasi ? new Date(q.qaytarish_sanasi) : null;
          if (due && !isNaN(due) && (!m._maxDue || due > m._maxDue)) m._maxDue = due;
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
        const regList = Array.from(m.registrar_set);
        m.registrar_nomi = regList.length === 0 ? '' : regList.length === 1 ? regList[0] : `${regList[0]} +${regList.length - 1}`;
        delete m.registrar_set;
        // Muddati o'tgan — mijozning eng so'nggi aktiv qarz muddati o'tgan bo'lsa (skrinshot 1)
        m.has_expired = !!(m._maxDue && m._maxDue < now);
        delete m._maxDue;
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
          titleNearDebitor: 'Muddati yaqin berilgan qarzlar',
          titleNearKreditor: 'Muddati yaqin olingan qarzlar',
          subtitleNear: 'Qaytarish muddati yaqinlashgan qarzlar',
          back: 'Orqaga',
          searchPlaceholder: 'FISH, telefon, mahsulot yoki summa bo\'yicha qidirish...',
          exportExcel: 'Excelga yuklash',
          phoneCol: 'Telefon',
          exportError: 'Eksport qilishda xatolik',
          itemsLabel: 'ta qarz',
          total: 'Jami qarzlar',
          activeCount: 'Jarayondagi qarzlar',
          totalUzs: 'Jami qoldiq',
          totalUsd: 'Jami qoldiq',
          dokonlar: 'Do\'konlar',
          selectDokon: 'Savdo faoliyati (do\'kon)ni tanlang',
          allDokon: 'Barcha do\'konlar',
          newDokon: 'Yangi do\'kon qo\'shish',
          noDokon: 'Do\'kon topilmadi',
          client: 'Mijoz',
          savdoFaoliyat: 'Savdo faoliyati (do\'kon) nomi',
          registrar: 'Kiritgan shaxs telefon raqami',
          amount: 'Qarz miqdori',
          remaining: 'Qoldiq',
          totalRemaining: 'Jami qoldiq',
          debtsCount: 'Qarzlar soni',
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
          titleNearDebitor: 'Выданные долги с близким сроком',
          titleNearKreditor: 'Полученные долги с близким сроком',
          subtitleNear: 'Долги с приближающейся датой возврата',
          back: 'Назад',
          searchPlaceholder: 'Поиск по ФИО, телефону, товару или сумме...',
          exportExcel: 'Скачать в Excel',
          phoneCol: 'Телефон',
          exportError: 'Ошибка при экспорте',
          itemsLabel: 'долгов',
          total: 'Всего долгов',
          activeCount: 'Долги в процессе',
          totalUzs: 'Итого остаток',
          totalUsd: 'Итого остаток',
          dokonlar: 'Магазины',
          selectDokon: 'Выберите торговую точку (магазин)',
          allDokon: 'Все магазины',
          newDokon: 'Добавить магазин',
          noDokon: 'Магазины не найдены',
          client: 'Клиент',
          savdoFaoliyat: 'Торговая деятельность (магазин)',
          registrar: 'Телефон внёсшего',
          amount: 'Сумма',
          remaining: 'Остаток',
          totalRemaining: 'Итого остаток',
          debtsCount: 'Кол-во долгов',
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
          titleNearDebitor: 'Муддати яқин берилган қарзлар',
          titleNearKreditor: 'Муддати яқин олинган қарзлар',
          subtitleNear: 'Қайтариш муддати яқинлашган қарзлар',
          back: 'Орқага',
          searchPlaceholder: 'ФИШ, телефон, маҳсулот ёки сумма бўйича қидириш...',
          exportExcel: 'Excelга юклаш',
          phoneCol: 'Телефон',
          exportError: 'Экспорт қилишда хатолик',
          itemsLabel: 'та қарз',
          total: 'Жами қарзлар',
          activeCount: 'Жараёндаги қарзлар',
          totalUzs: 'Жами қолдиқ',
          totalUsd: 'Жами қолдиқ',
          dokonlar: 'Дўконлар',
          selectDokon: 'Савдо фаолияти (дўкон)ни танланг',
          allDokon: 'Барча дўконлар',
          newDokon: 'Янги дўкон қўшиш',
          noDokon: 'Дўкон топилмади',
          client: 'Мижоз',
          savdoFaoliyat: 'Савдо фаолияти (дўкон) номи',
          registrar: 'Киритган шахс телефон рақами',
          amount: 'Қарз миқдори',
          remaining: 'Қолдиқ',
          totalRemaining: 'Жами қолдиқ',
          debtsCount: 'Қарзлар сони',
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
    // B31-2: do'kon tanlash (bo'sh = barcha do'konlar)
    selectDokon(nomi) { this.selectedDokon = nomi; },
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
    /**
     * Joriy ro'yxatni (mijoz kesimida, qidiruv filtri hisobga olingan holda) Excel
     * (.xlsx) faylga eksport qiladi. SheetJS (xlsx) dinamik import qilinadi —
     * asosiy bundle'ni og'irlashtirmaydi.
     */
    async exportExcel() {
      if (this.exporting || !this.grouppedMijozlar.length) return;
      this.exporting = true;
      try {
        const mod = await import('xlsx');
        const XLSX = mod.default || mod;
        const t = this.texts;
        const lastDateCol = this.turi === 'olish' ? t.lastDateOlish : t.lastDateBerish;
        const rows = this.grouppedMijozlar.map((m) => ({
          [t.client]: m.fish || '—',
          [t.phoneCol]: m.telefon || '',
          [t.savdoFaoliyat]: m.savdo_faoliyat_label || '',
          [t.registrar]: m.registrar_nomi || '',
          [t.debtsCount]: m.qarzlar_soni,
          [`${t.totalRemaining} (UZS)`]: Math.round(m.qoldiq_uzs) || 0,
          [`${t.totalRemaining} (USD)`]: Math.round(m.qoldiq_usd) || 0,
          [lastDateCol]: this.formatDate(m.last_date),
          [t.status]: m.has_expired ? t.statusExpired : (m.has_active ? t.statusActive : t.statusClosed),
        }));
        const ws = XLSX.utils.json_to_sheet(rows);
        ws['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 16 }, { wch: 14 }, { wch: 16 }, { wch: 14 }];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, (this.pageTitle || 'Qarzlar').slice(0, 31));
        const today = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `${this.pageTitle || 'qarzlar'} - ${today}.xlsx`);
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error(this.texts.exportError);
      } finally {
        this.exporting = false;
      }
    },
  },
};
</script>
