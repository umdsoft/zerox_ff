<template>
  <div class="bg-white rounded-2xl shadow-sm">
    <!-- Back (desktop) -->
    <BackButton />

    <!-- PAGE CONTAINER -->
    <div class="max-w-6xl mx-auto px-4 pb-6 mt-safe mt-4 sm:mt-6 md:mt-8">
      <!-- SS-DEV (2026-09-24), hujjat-4 4-band (5-rasm): profil bloki KREATIV qayta joylashtirildi.
           Ilgari: chapda avatar kartasi + o'ngda 4 qatorli jadval (ko'p bo'sh joy). Endi: BITTA
           "hero" karta — gradient tasma, ustida oq halqali avatar, FISh, ID/reyting CHIPLARI;
           pastida 4 ta ma'lumot "plitka"si (ikonka + nom + qiymat) — mobil/desktop bir xil
           komponent. MA'LUMOTLAR O'ZGARMADI (candidate API o'sha). Ranglar inline (JIT o'chiq). -->
      <section v-if="user" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-3 sm:mt-4">
        <div class="h-24 sm:h-28 relative" style="background: linear-gradient(135deg, #2563EB 0%, #4338CA 100%);">
          <div class="absolute rounded-full" style="width:9rem;height:9rem;right:-2rem;top:-3rem;background:rgba(255,255,255,0.08)"></div>
          <div class="absolute rounded-full" style="width:5rem;height:5rem;right:6rem;bottom:-2rem;background:rgba(255,255,255,0.06)"></div>
        </div>
        <div class="px-5 sm:px-8 pb-6">
          <div class="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
            <!-- Avatar (oq halqa) -->
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-lg flex-shrink-0">
              <div class="w-full h-full rounded-full bg-gray-100 grid place-items-center overflow-hidden">
                <img v-if="user.image" :src="avatar" alt="avatar" class="w-full h-full object-cover" />
                <template v-else>
                  <!-- SS-DEV (2026-09-24): standart avatar — JISMONIY SHAXS ikonkasi; jins bo'yicha rang -->
                  <svg viewBox="0 0 24 24" class="w-14 h-14 sm:w-16 sm:h-16" :style="'color:' + (user.gender == 2 ? '#DB2777' : '#2563EB')" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.15" />
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4.5 20.5c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5" fill="currentColor" opacity="0.15" />
                    <path d="M4.5 20.5c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5" stroke-linecap="round" />
                  </svg>
                </template>
              </div>
            </div>

            <!-- FISh + chiplar -->
            <div class="flex-1 min-w-0 sm:pb-1">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 leading-tight break-words">{{ nameLine1 }}</h2>
              <p v-if="nameLine2" class="text-gray-600 font-medium leading-tight mt-0.5">{{ nameLine2 }}</p>
              <div class="flex flex-wrap items-center gap-2 mt-2.5">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style="background:#EFF6FF;color:#1D4ED8">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                  {{ $t('user.id') }}: {{ user.uid }}
                </span>
                <span v-if="user.rating != null" class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style="background:#FEFCE8;color:#A16207">
                  <svg class="w-3.5 h-3.5" style="color:#FACC15" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  {{ ct.rating }}: {{ formattedRating }}
                </span>
              </div>
            </div>
          </div>

          <!-- 4 ta ma'lumot plitkasi -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            <div v-for="tile in infoTiles" :key="tile.key" class="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5">
              <span class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :style="'background:' + tile.bg + ';color:' + tile.color">
                <svg class="w-4.5 h-4.5" style="width:1.1rem;height:1.1rem" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" :d="tile.icon" /></svg>
              </span>
              <div class="min-w-0">
                <p class="text-xs text-gray-500 leading-tight">{{ tile.label }}</p>
                <p class="text-sm font-semibold text-gray-900 mt-0.5 break-words">{{ tile.value || '—' }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SS-DEV (2026-09-24): MEN va SHU FOYDALANUVCHI o'rtasidagi BARCHA qarz shartnomalari
           (tugallangan + jarayondagi + rad etilgan), ikkala yo'nalishda. Foydalanuvchi talabi. -->
      <section v-if="user" class="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2 flex-wrap">
          <h3 class="font-bold text-gray-900">{{ ct.title }}</h3>
          <div class="flex items-center gap-2 flex-wrap">
            <!-- SS-DEV (2026-09-26), 25.09 hujjat 3-band: filtrlangan ro'yxatni Excel'ga yuklab olish (xlsx lazy) -->
            <button
              type="button"
              class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
              style="background:#ECFDF5;color:#047857"
              :style="exporting || !filteredContracts.length ? 'opacity:.5;cursor:not-allowed' : ''"
              :disabled="exporting || !filteredContracts.length"
              @click="exportExcel"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              {{ exporting ? ct.exporting : ct.download }}
            </button>
            <!-- Hisoblagich FILTRGA mos (67 ta → tanlangan holat soni) -->
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ filteredContracts.length }} {{ ct.count }}</span>
          </div>
        </div>
        <!-- SS-DEV (2026-09-26), 25.09 hujjat 2-band: holat bo'yicha filtr chip'lari (mijoz tomonida).
             Ro'yxat bir marta to'liq yuklanadi (50 tadan sahifalab yig'iladi), filtr va 10 talik
             sahifalash brauzerda — hisoblagich va sahifalar filtrga mos. -->
        <div class="px-4 py-2.5 border-b border-gray-100 flex flex-wrap gap-2">
          <button
            v-for="f in statusFilters" :key="f.value" type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            :class="statusFilter === f.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="setStatusFilter(f.value)"
          >{{ f.label }} <span class="opacity-75">({{ f.count }})</span></button>
        </div>
        <div v-if="contractsLoading" class="px-4 py-6 text-sm text-gray-400 text-center">{{ ct.loading }}</div>
        <div v-else-if="!contracts.length" class="px-4 py-6 text-sm text-gray-400 text-center">{{ ct.empty }}</div>
        <div v-else class="overflow-x-auto">
          <!-- SS-DEV (2026-09-24): sarlavhalar kichik harflarda ("Shartnoma", "Yo'nalish"...), 10 tadan sahifalash. -->
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs font-semibold">
              <tr>
                <th class="px-4 py-2 text-left">{{ ct.number }}</th>
                <th class="px-4 py-2 text-left">{{ ct.direction }}</th>
                <th class="px-4 py-2 text-right">{{ ct.amount }}</th>
                <th class="px-4 py-2 text-right">{{ ct.residual }}</th>
                <th class="px-4 py-2 text-left">{{ ct.date }}</th>
                <th class="px-4 py-2 text-left">{{ ct.due }}</th>
                <th class="px-4 py-2 text-left">{{ ct.status }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="c in pageContracts" :key="c.id" class="hover:bg-gray-50">
                <td class="px-4 py-2.5 whitespace-nowrap">
                  <a v-if="c.uid" :href="$contractPdfUrl(c.uid)" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline font-medium">{{ c.number || c.uid }}</a>
                  <span v-else>{{ c.number || '-' }}</span>
                </td>
                <td class="px-4 py-2.5 whitespace-nowrap">
                  <!-- SS-DEV (2026-09-24): "Siz berdingiz/oldingiz" -> "Berilgan" (yashil) / "Olingan" (qizil) (7-rasm) -->
                  <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :style="c.direction === 'lent' ? 'background:#DCFCE7; color:#15803D' : 'background:#FEE2E2; color:#B91C1C'">{{ c.direction === 'lent' ? ct.lent : ct.borrowed }}</span>
                </td>
                <td class="px-4 py-2.5 text-right whitespace-nowrap font-medium">{{ fmt(c.amount) }} {{ c.currency }}</td>
                <td class="px-4 py-2.5 text-right whitespace-nowrap" :class="Number(c.residual_amount) > 0 ? 'text-red-600 font-medium' : 'text-gray-500'">{{ c.residual_amount != null ? fmt(c.residual_amount) + ' ' + c.currency : '-' }}</td>
                <td class="px-4 py-2.5 whitespace-nowrap">{{ fmtDate(c.contract_date || c.created_at) }}</td>
                <td class="px-4 py-2.5 whitespace-nowrap">{{ fmtDate(c.sana) }}</td>
                <td class="px-4 py-2.5 whitespace-nowrap">
                  <span class="text-xs font-semibold" :style="statusStyle(c.status)">{{ statusText(c.status) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- SS-DEV (2026-09-24): sahifalash — 10 tadan -->
        <div v-if="pagination.pages > 1" class="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <p class="text-xs text-gray-500">{{ pageInfo }}</p>
          <div class="flex items-center gap-1">
            <button type="button" class="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center" :style="page <= 1 ? 'opacity:.4;pointer-events:none' : ''" @click="goPage(page - 1)" aria-label="prev">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button
              v-for="p in pageNumbers" :key="'pg' + p" type="button"
              class="h-8 px-2 rounded-lg text-sm font-medium border" style="min-width:2rem"
              :class="p === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'"
              @click="goPage(p)"
            >{{ p }}</button>
            <button type="button" class="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center" :style="page >= pagination.pages ? 'opacity:.4;pointer-events:none' : ''" @click="goPage(page + 1)" aria-label="next">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import BackButton from '@/components/BackButton.vue';
import { fullNameParts, fmtDMY } from '~/utils/helpers'; // SS-DEV (2026-09-26): fullNameParts

const PAGE_SIZE = 10; // SS-DEV (2026-09-24): 10 tadan sahifalash

export default {
  components: { BackButton },
  data: () => ({
    user: null,
    step: 0,
    avatar: null,
    // SS-DEV (2026-09-24): ikki foydalanuvchi o'rtasidagi shartnomalar (sahifalangan)
    contracts: [],
    contractsLoading: false,
    page: 1,
    pagination: { page: 1, limit: PAGE_SIZE, total: 0, pages: 1 },
    // SS-DEV (2026-09-26), 25.09 hujjat 2–3-band: holat filtri (all|active|completed|rejected) + Excel eksport
    statusFilter: 'all',
    exporting: false,
  }),
  computed: {
    // SS-DEV (2026-09-24): FISh chiroyli ko'rinishda — 1-qator: familiya + ism, 2-qator: sharif
    // SS-DEV (2026-09-26), 25.09 hujjat 1-band: `fullNameParts` — first/last/middle BO'SH bo'lsa ham
    // backend bergan tayyor `fio`/`fish`/`full_name` ishlatiladi (2-rasm: faqat "Rashid O'g'li" chiqardi).
    fullName() { return fullNameParts(this.user).full; },
    nameLine1() { return fullNameParts(this.user).line1; },
    nameLine2() { return fullNameParts(this.user).line2; },
    /** SS-DEV (2026-09-26): holat filtri qo'llangan ro'yxat (hisoblagich va eksport shu bilan ishlaydi) */
    filteredContracts() {
      const f = this.statusFilter;
      if (f === 'all') return this.contracts;
      return this.contracts.filter((c) => this.statusKey(c.status) === f);
    },
    /** Joriy sahifadagi 10 ta qator (mijoz tomonida sahifalash) */
    pageContracts() {
      const a = (this.page - 1) * PAGE_SIZE;
      return this.filteredContracts.slice(a, a + PAGE_SIZE);
    },
    statusFilters() {
      const cnt = { all: this.contracts.length, active: 0, completed: 0, rejected: 0 };
      this.contracts.forEach((c) => { const k = this.statusKey(c.status); if (cnt[k] != null) cnt[k] += 1; });
      return [
        { value: 'all', label: this.ct.fAll, count: cnt.all },
        { value: 'completed', label: this.ct.s2, count: cnt.completed },
        { value: 'active', label: this.ct.s1, count: cnt.active },
        { value: 'rejected', label: this.ct.s3, count: cnt.rejected },
      ];
    },
    /** SS-DEV (2026-09-24): 4 ta ma'lumot plitkasi (ikonka + nom + qiymat) */
    infoTiles() {
      const u = this.user || {};
      const yr = this.$t('user.year');
      return [
        { key: 'birthday', label: this.$t('user.sana'), value: u.brithday ? `${u.brithday} ${yr}` : '', bg: '#FDF2F8', color: '#DB2777',
          icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z' },
        { key: 'phone', label: this.$t('user.tel'), value: u.phone || '', bg: '#ECFDF5', color: '#059669',
          icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
        { key: 'address', label: this.$t('user.address'), value: [u.region, u.district].filter(Boolean).join(' '), bg: '#FFF7ED', color: '#EA580C',
          icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z' },
        { key: 'registered', label: this.$t('user.vaqt'), value: u.created_at ? `${this.$formatDate(u.created_at)} ${yr}` : '', bg: '#EFF6FF', color: '#2563EB',
          icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      ];
    },
    /** Reyting — 0.01 formatda (kabinet bilan bir xil) */
    formattedRating() {
      const r = Number(this.user && this.user.rating);
      return Number.isFinite(r) ? r.toFixed(2) : '0.00';
    },
    pageNumbers() {
      const total = this.pagination.pages || 1;
      const cur = this.page;
      const out = [];
      const from = Math.max(1, cur - 2);
      const to = Math.min(total, from + 4);
      for (let i = Math.max(1, Math.min(from, to - 4)); i <= to; i++) out.push(i);
      return out;
    },
    pageInfo() {
      const t = this.pagination.total || 0;
      if (!t) return '';
      const a = (this.page - 1) * PAGE_SIZE + 1;
      const b = Math.min(t, this.page * PAGE_SIZE);
      return `${a}–${b} / ${t}`;
    },
    ct() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz';
      const t = {
        uz: { title: 'Siz bilan tuzilgan qarz shartnomalari', count: 'ta', loading: 'Yuklanmoqda…', empty: 'Bu foydalanuvchi bilan shartnomalar yo‘q', number: 'Shartnoma', direction: 'Yo‘nalish', amount: 'Summa', residual: 'Qoldiq', date: 'Tuzilgan', due: 'Muddat', status: 'Holat', lent: 'Berilgan', borrowed: 'Olingan', rating: 'Reyting', s1: 'Jarayonda', s2: 'Tugallangan', s3: 'Rad etilgan', s0: 'Kutilmoqda', fAll: 'Barchasi', download: 'Yuklab olish', exporting: 'Tayyorlanmoqda…', exportError: 'Eksport qilishda xatolik' },
        ru: { title: 'Договоры займа с этим пользователем', count: 'шт.', loading: 'Загрузка…', empty: 'Договоров с этим пользователем нет', number: 'Договор', direction: 'Направление', amount: 'Сумма', residual: 'Остаток', date: 'Заключён', due: 'Срок', status: 'Статус', lent: 'Выдано', borrowed: 'Получено', rating: 'Рейтинг', s1: 'В процессе', s2: 'Завершён', s3: 'Отклонён', s0: 'Ожидает', fAll: 'Все', download: 'Скачать', exporting: 'Подготовка…', exportError: 'Ошибка экспорта' },
        kr: { title: 'Сиз билан тузилган қарз шартномалари', count: 'та', loading: 'Юкланмоқда…', empty: 'Бу фойдаланувчи билан шартномалар йўқ', number: 'Шартнома', direction: 'Йўналиш', amount: 'Сумма', residual: 'Қолдиқ', date: 'Тузилган', due: 'Муддат', status: 'Ҳолат', lent: 'Берилган', borrowed: 'Олинган', rating: 'Рейтинг', s1: 'Жараёнда', s2: 'Тугалланган', s3: 'Рад этилган', s0: 'Кутилмоқда', fAll: 'Барчаси', download: 'Юклаб олиш', exporting: 'Тайёрланмоқда…', exportError: 'Экспорт қилишда хатолик' },
        // SS-DEV (2026-09-26): en/kaa
        en: { title: 'Loan agreements concluded with you', count: '', loading: 'Loading…', empty: 'No agreements with this user', number: 'Agreement', direction: 'Direction', amount: 'Amount', residual: 'Remaining', date: 'Concluded', due: 'Due', status: 'Status', lent: 'Lent', borrowed: 'Borrowed', rating: 'Rating', s1: 'In progress', s2: 'Completed', s3: 'Rejected', s0: 'Pending', fAll: 'All', download: 'Download', exporting: 'Preparing…', exportError: 'Export error' },
        kaa: { title: 'Siz benen dúzilgen qarız shártnamaları', count: '', loading: 'Júklenbekte…', empty: 'Bul paydalanıwshı menen shártnamalar joq', number: 'Shártnama', direction: 'Baǵdar', amount: 'Summa', residual: 'Qaldıq', date: 'Dúzilgen', due: 'Múddet', status: 'Halatı', lent: 'Berilgen', borrowed: 'Alınǵan', rating: 'Reyting', s1: 'Barısında', s2: 'Tamamlanǵan', s3: 'Ret etilgen', s0: 'Kútilmekte', fAll: 'Barlıǵı', download: 'Júklep alıw', exporting: 'Tayarlanbaqta…', exportError: 'Eksport etiwde qátelik' },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() {
    try {
      const candidate = await this.$axios.$get(`/user/candidate/${this.$route.query.id}`, { silent: true });
      this.user = candidate.data;
      if (this.user && this.user.image) {
        // SS-AUDIT (2026-09-25): qattiq app.zerox.uz o'rniga muhit backend URL'i
        this.avatar = `${this.$config.backendURL}/${this.user.image}`;
      }
    } catch (error) {
      this.$toast.error(this.$t('a1.a42') || "Xatolik yuz berdi!");
    }
    this.loadContracts();
  },
  methods: {
    // SS-DEV (2026-09-24): men va shu foydalanuvchi (uid) o'rtasidagi barcha shartnomalar
    // SS-DEV (2026-09-26), 25.09 hujjat 2-band: filtr mijoz tomonida bo'lishi uchun ro'yxat TO'LIQ
    // yuklanadi (backend limit 50 — sahifalab yig'iladi, eng ko'pi 20 sahifa = 1000 ta), sahifalash
    // (10 tadan) brauzerda hisoblanadi.
    async loadContracts() {
      if (!this.user || !this.user.uid) return;
      this.contractsLoading = true;
      try {
        const all = [];
        let pages = 1;
        for (let p = 1; p <= pages && p <= 20; p++) {
          const res = await this.$api.getContractsBetween(this.user.uid, p, 50);
          const body = (res && res.data) || {};
          all.push(...(body.data || []));
          pages = (body.pagination && body.pagination.pages) || 1;
        }
        this.contracts = all;
        this.applyPaging(1);
      } catch (_) { this.contracts = []; this.applyPaging(1); } finally { this.contractsLoading = false; }
    },
    applyPaging(page) {
      const total = this.filteredContracts.length;
      const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      this.page = Math.min(Math.max(1, page), pages);
      this.pagination = { page: this.page, limit: PAGE_SIZE, total, pages };
    },
    goPage(p) {
      const total = this.pagination.pages || 1;
      if (p < 1 || p > total || p === this.page) return;
      this.applyPaging(p);
    },
    setStatusFilter(v) {
      this.statusFilter = v;
      this.applyPaging(1);
    },
    /** Holat kodi → filtr kaliti (1 jarayonda, 2 tugallangan, 3/4 rad etilgan) */
    statusKey(s) {
      const n = Number(s);
      if (n === 1) return 'active';
      if (n === 2) return 'completed';
      if (n === 3 || n === 4) return 'rejected';
      return 'other';
    },
    /**
     * SS-DEV (2026-09-26), 25.09 hujjat 3-band: filtr qo'llangan ro'yxatni Excel'ga eksport.
     * SheetJS dinamik yuklanadi (loyihadagi boshqa eksportlar bilan bir xil usul).
     */
    async exportExcel() {
      if (this.exporting || !this.filteredContracts.length) return;
      this.exporting = true;
      try {
        const mod = await import('xlsx');
        const XLSX = mod.default || mod;
        const t = this.ct;
        const rows = this.filteredContracts.map((c) => ({
          [t.number]: c.number || c.uid || '',
          [t.direction]: c.direction === 'lent' ? t.lent : t.borrowed,
          [t.amount]: `${this.fmt(c.amount)} ${c.currency || ''}`.trim(),
          [t.residual]: c.residual_amount != null ? `${this.fmt(c.residual_amount)} ${c.currency || ''}`.trim() : '-',
          [t.date]: this.fmtDate(c.contract_date || c.created_at),
          [t.due]: this.fmtDate(c.sana),
          [t.status]: this.statusText(c.status),
        }));
        const ws = XLSX.utils.json_to_sheet(rows);
        ws['!cols'] = [{ wch: 16 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 14 }];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, String(t.title).slice(0, 31));
        const who = (this.fullName || (this.user && this.user.uid) || 'user').replace(/[\\/:*?"<>|]/g, ' ').trim();
        XLSX.writeFile(wb, `${who} - ${new Date().toISOString().slice(0, 10)}.xlsx`);
      } catch (_) {
        this.$toast && this.$toast.error && this.$toast.error(this.ct.exportError);
      } finally { this.exporting = false; }
    },
    fmt(v) { return Number(v || 0).toLocaleString('uz-UZ').replace(/,/g, ' '); },
    fmtDate(d) { return fmtDMY(d, '-') }, // SS-AUDIT (2026-09-25): utils/helpers
    statusText(s) {
      const n = Number(s);
      if (n === 1) return this.ct.s1;
      if (n === 2) return this.ct.s2;
      if (n === 3 || n === 4) return this.ct.s3;
      return this.ct.s0;
    },
    statusStyle(s) {
      const n = Number(s);
      if (n === 1) return 'color:#1D4ED8';
      if (n === 2) return 'color:#15803D';
      if (n === 3 || n === 4) return 'color:#DC2626';
      return 'color:#6B7280';
    },
  },
};
</script>
<style scoped>
/* iOS notch (safe-area) uchun tepada avtomatik "yostiq" */
@supports (padding: max(0px)) {
  .mt-safe {
    padding-top: max(1rem, env(safe-area-inset-top));
  }
}

/* Jadval hujayralari vertikal markazda */
table td {
  vertical-align: middle;
}
</style>
