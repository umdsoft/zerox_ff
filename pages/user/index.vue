<template>
  <div class="bg-white rounded-2xl shadow-sm">
    <!-- Back (desktop) -->
    <BackButton />

    <!-- PAGE CONTAINER -->
    <div class="max-w-6xl mx-auto px-4 pb-6 mt-safe mt-4 sm:mt-6 md:mt-8">
      <div v-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3 sm:mt-4">
        <!-- LEFT: Profile card -->
        <section class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
          <!-- Avatar -->
          <div class="w-36 h-36 rounded-full bg-gray-100 grid place-items-center overflow-hidden">
            <img v-if="user.image" :src="avatar" alt="avatar" class="w-full h-full object-cover" />
            <template v-else>
              <!-- SS-DEV (2026-09-24): standart avatar — JISMONIY SHAXS ikonkasi (12-rasm:
                   ilgari "galstukli biznesmen" rasmi chiqardi). Jins bo'yicha rang farqlanadi. -->
              <svg viewBox="0 0 24 24" class="w-24 h-24" :style="'color:' + (user.gender == 2 ? '#DB2777' : '#2563EB')" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.15" />
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 20.5c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5" fill="currentColor" opacity="0.15" />
                <path d="M4.5 20.5c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5" stroke-linecap="round" />
              </svg>
            </template>
          </div>

          <!-- SS-DEV (2026-09-24): FISh "Sarlavha Ko'rinishi"da (BOSH HARFLAR emas);
               familiya + ism BIR qatorda (sig'masa o'raladi), sharif ALOHIDA qatorda (6-rasm). -->
          <h2 class="mt-4 text-center font-bold text-lg leading-tight px-2 text-gray-900">
            <span class="block">{{ nameLine1 }}</span>
            <span v-if="nameLine2" class="block text-base font-semibold text-gray-700 mt-0.5">{{ nameLine2 }}</span>
          </h2>

          <div class="mt-4 w-full border-t border-gray-200 pt-4 space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">{{ $t('user.id') }}</span>
              <span class="text-blue-600 font-medium">{{ user.uid }}</span>
            </div>
            <!-- SS-DEV (2026-09-24): foydalanuvchi REYTINGI (backend `rating`) -->
            <div v-if="user.rating != null" class="flex items-center justify-between text-sm">
              <span class="text-gray-600">{{ ct.rating }}</span>
              <span class="inline-flex items-center gap-1.5 font-semibold text-gray-900">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                {{ formattedRating }}
              </span>
            </div>
          </div>
        </section>

        <!-- RIGHT: Details -->
        <section class="lg:col-span-2">
          <!-- Desktop/Tablet: table -->
          <div class="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table class="w-full border-collapse">
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="w-1/3 px-4 py-3 text-gray-600">{{ $t('user.sana') }}</td>
                  <td class="px-4 py-3">{{ user.brithday }} {{ $t('user.year') }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-gray-600">{{ $t('user.tel') }}</td>
                  <td class="px-4 py-3">{{ user.phone }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-gray-600">{{ $t('user.address') }}</td>
                  <td class="px-4 py-3">{{ user.region }} {{ user.district }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-gray-600">{{ $t('user.vaqt') }}</td>
                  <td class="px-4 py-3">{{ $formatDate(user.created_at) }} {{ $t('user.year') }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile: stacked cards -->
          <div class="md:hidden space-y-3">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p class="text-xs uppercase tracking-wide text-gray-500">{{ $t('user.sana') }}</p>
              <p class="mt-1 font-medium">{{ user.brithday }} {{ $t('user.year') }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p class="text-xs uppercase tracking-wide text-gray-500">{{ $t('user.tel') }}</p>
              <p class="mt-1 font-medium">{{ user.phone }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p class="text-xs uppercase tracking-wide text-gray-500">{{ $t('user.address') }}</p>
              <p class="mt-1 font-medium">{{ user.region }} {{ user.district }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p class="text-xs uppercase tracking-wide text-gray-500">{{ $t('user.vaqt') }}</p>
              <p class="mt-1 font-medium">{{ $formatDate(user.created_at) }} {{ $t('user.year') }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- SS-DEV (2026-09-24): MEN va SHU FOYDALANUVCHI o'rtasidagi BARCHA qarz shartnomalari
           (tugallangan + jarayondagi + rad etilgan), ikkala yo'nalishda. Foydalanuvchi talabi. -->
      <section v-if="user" class="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2 flex-wrap">
          <h3 class="font-bold text-gray-900">{{ ct.title }}</h3>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ pagination.total }} {{ ct.count }}</span>
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
              <tr v-for="c in contracts" :key="c.id" class="hover:bg-gray-50">
                <td class="px-4 py-2.5 whitespace-nowrap">
                  <a v-if="c.uid" :href="$contractPdfUrl(c.uid)" target="_blank" class="text-blue-600 hover:underline font-medium">{{ c.number || c.uid }}</a>
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
import { titleCaseName } from '~/utils/helpers';

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
  }),
  computed: {
    // SS-DEV (2026-09-24): FISh chiroyli ko'rinishda — 1-qator: familiya + ism, 2-qator: sharif
    fullName() {
      const u = this.user || {};
      return titleCaseName([u.last_name, u.first_name, u.middle_name].filter(Boolean).join(' '));
    },
    nameLine1() {
      const u = this.user || {};
      return titleCaseName([u.last_name, u.first_name].filter(Boolean).join(' '));
    },
    nameLine2() {
      const u = this.user || {};
      return titleCaseName(u.middle_name || '');
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
        uz: { title: 'Siz bilan tuzilgan qarz shartnomalari', count: 'ta', loading: 'Yuklanmoqda…', empty: 'Bu foydalanuvchi bilan shartnomalar yo‘q', number: 'Shartnoma', direction: 'Yo‘nalish', amount: 'Summa', residual: 'Qoldiq', date: 'Tuzilgan', due: 'Muddat', status: 'Holat', lent: 'Berilgan', borrowed: 'Olingan', rating: 'Reyting', s1: 'Jarayonda', s2: 'Tugallangan', s3: 'Rad etilgan', s0: 'Kutilmoqda' },
        ru: { title: 'Договоры займа с этим пользователем', count: 'шт.', loading: 'Загрузка…', empty: 'Договоров с этим пользователем нет', number: 'Договор', direction: 'Направление', amount: 'Сумма', residual: 'Остаток', date: 'Заключён', due: 'Срок', status: 'Статус', lent: 'Выдано', borrowed: 'Получено', rating: 'Рейтинг', s1: 'В процессе', s2: 'Завершён', s3: 'Отклонён', s0: 'Ожидает' },
        kr: { title: 'Сиз билан тузилган қарз шартномалари', count: 'та', loading: 'Юкланмоқда…', empty: 'Бу фойдаланувчи билан шартномалар йўқ', number: 'Шартнома', direction: 'Йўналиш', amount: 'Сумма', residual: 'Қолдиқ', date: 'Тузилган', due: 'Муддат', status: 'Ҳолат', lent: 'Берилган', borrowed: 'Олинган', rating: 'Рейтинг', s1: 'Жараёнда', s2: 'Тугалланган', s3: 'Рад этилган', s0: 'Кутилмоқда' },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() {
    try {
      const candidate = await this.$axios.$get(`/user/candidate/${this.$route.query.id}`, { silent: true });
      this.user = candidate.data;
      if (this.user && this.user.image) {
        this.avatar = `https://app.zerox.uz/${this.user.image}`;
      }
    } catch (error) {
      this.$toast.error(this.$t('a1.a42') || "Xatolik yuz berdi!");
    }
    this.loadContracts();
  },
  methods: {
    // SS-DEV (2026-09-24): men va shu foydalanuvchi (uid) o'rtasidagi barcha shartnomalar
    async loadContracts(page = 1) {
      if (!this.user || !this.user.uid) return;
      this.contractsLoading = true;
      try {
        const res = await this.$api.getContractsBetween(this.user.uid, page, PAGE_SIZE);
        const body = (res && res.data) || {};
        this.contracts = body.data || [];
        this.page = page;
        this.pagination = body.pagination || { page, limit: PAGE_SIZE, total: this.contracts.length, pages: 1 };
      } catch (_) { this.contracts = []; } finally { this.contractsLoading = false; }
    },
    goPage(p) {
      const total = this.pagination.pages || 1;
      if (p < 1 || p > total || p === this.page) return;
      this.loadContracts(p);
    },
    fmt(v) { return Number(v || 0).toLocaleString('uz-UZ').replace(/,/g, ' '); },
    fmtDate(d) {
      if (!d) return '-';
      const x = new Date(d);
      if (isNaN(x)) return String(d).slice(0, 10);
      const p = (n) => String(n).padStart(2, '0');
      return `${p(x.getDate())}.${p(x.getMonth() + 1)}.${x.getFullYear()}`;
    },
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
