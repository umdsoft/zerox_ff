<template>
  <!-- 30.10: yuborilgan SMS'lar ro'yxati — TO'LIQ matn, 10 tadan sahifalash (oldingi/keyingi + raqamlar), qidiruv (q).
       Manba: GET /finance/subscription/sms-history (Premium). Boshqa tarifda 403 → /qarz-daftari/sms-history
       (status='sent', eng ko'pi 1000 ta; tur filtri/qidiruv/sahifalash brauzerda). -->
  <div>
    <div v-if="searchable" class="px-4 sm:px-5 pt-4">
      <div class="relative">
        <svg class="w-4 h-4 text-gray-400 absolute left-3" style="top: 50%; transform: translateY(-50%)" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input
          v-model="query"
          type="search"
          class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
          :placeholder="$t('sms_hist.search_placeholder')"
          :aria-label="$t('sms_hist.search_placeholder')"
        />
      </div>
    </div>

    <p v-if="error" class="px-5 py-6 text-sm text-red-600 text-center">{{ $t('sms_delivery.error') }}</p>
    <p v-else-if="!rows.length && !loading" class="px-5 py-8 text-sm text-gray-500 text-center">{{ $t('sms_hist.empty') }}</p>

    <ul class="px-4 sm:px-5 py-4 space-y-3">
      <li v-for="r in rows" :key="r.id" class="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ $t(typeKey(r.type)) }}</span>
          <span v-if="r.name" class="text-sm font-semibold text-gray-900">{{ r.name }}</span>
          <span class="text-xs text-gray-500">{{ r.phone }}</span>
          <span class="text-xs text-gray-400 tabular-nums">{{ fmtDMYHM(r.date) }}</span>
          <span v-if="r.undelivered" class="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
            {{ $t('sms_hist.undelivered') }}
            <button
              type="button"
              class="w-6 h-6 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50"
              :title="$t('sms_hist.bulb_title')"
              :aria-label="$t('sms_hist.bulb_title')"
              @click="reasonRow = r"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            </button>
          </span>
        </div>
        <p class="mt-2 pt-2 border-t border-gray-100 text-sm text-gray-700 whitespace-pre-wrap break-words">{{ r.message }}</p>
      </li>
    </ul>

    <div v-if="loading" class="text-center py-4">
      <svg class="w-6 h-6 text-blue-500 animate-spin mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
    </div>

    <!-- Pager: oldingi / sahifa raqamlari / keyingi -->
    <nav v-if="totalPages > 1" class="px-4 sm:px-5 pb-4 flex flex-wrap items-center justify-center gap-1.5" aria-label="pagination">
      <button type="button" class="px-3 h-8 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40" :disabled="page <= 1 || loading" @click="goTo(page - 1)">‹</button>
      <template v-for="(p, i) in pageItems">
        <span v-if="p === '…'" :key="'gap' + i" class="px-1 text-gray-400">…</span>
        <button
          v-else
          :key="p"
          type="button"
          :disabled="loading"
          style="min-width: 2rem"
          :class="['px-2 h-8 rounded-lg text-sm font-medium transition-colors', p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
          @click="goTo(p)"
        >{{ p }}</button>
      </template>
      <button type="button" class="px-3 h-8 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40" :disabled="page >= totalPages || loading" @click="goTo(page + 1)">›</button>
    </nav>

    <SmsReasonModal v-if="reasonRow" :code="reasonRow.reason" :phone="reasonRow.phone" :message="reasonRow.message" @close="reasonRow = null" />
  </div>
</template>

<script>
import { fmtDMYHM } from '@/utils/helpers';
import { SMS_KNOWN_TYPES, smsTypeKey, normalizeSmsRow } from '@/utils/smsHistory';
import SmsReasonModal from '~/components/sms/SmsReasonModal.vue';

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 350;

export default {
  name: 'SmsMessageList',
  components: { SmsReasonModal },
  props: {
    /** Tur filtri: registration | auto | manual | qarz_tolandi | other | '' (hammasi) */
    type: { type: String, default: '' },
    searchable: { type: Boolean, default: false },
  },
  data() {
    return { rows: [], page: 1, totalPages: 1, loading: false, error: false, query: '', reasonRow: null, seq: 0, timer: null, fallbackRows: null };
  },
  computed: {
    /** [1, '…', 4, 5, 6, '…', 20] */
    pageItems() {
      const total = this.totalPages;
      const cur = this.page;
      const set = new Set([1, total, cur - 1, cur, cur + 1].filter((n) => n >= 1 && n <= total));
      const nums = [...set].sort((a, b) => a - b);
      const out = [];
      nums.forEach((n, i) => {
        if (i > 0 && n - nums[i - 1] > 1) { out.push('…'); }
        out.push(n);
      });
      return out;
    },
  },
  watch: {
    type() { this.reload(); },
    query() {
      if (this.timer) { clearTimeout(this.timer); }
      this.timer = setTimeout(() => this.reload(), SEARCH_DEBOUNCE_MS);
    },
  },
  mounted() { this.reload(); },
  beforeDestroy() {
    this.seq += 1;
    if (this.timer) { clearTimeout(this.timer); }
  },
  methods: {
    fmtDMYHM,
    typeKey: smsTypeKey,
    reload() {
      this.page = 1;
      return this.load(1);
    },
    goTo(p) {
      if (p < 1 || p > this.totalPages || p === this.page || this.loading) { return; }
      this.load(p);
    },
    async load(page) {
      this.seq += 1;
      const mySeq = this.seq;
      this.loading = true;
      this.error = false;
      try {
        if (this.fallbackRows) {
          this.applyFallback(page);
        } else {
          await this.loadServer(page, mySeq);
        }
        if (mySeq === this.seq) { this.page = page; }
      } catch (e) {
        if (mySeq !== this.seq) { return; }
        this.rows = [];
        if (e && e.response && e.response.status === 403) {
          // Premium emas — yuborilgan (sent) SMS'lar ro'yxatiga o'tamiz
          try { await this.loadFallback(page, mySeq); } catch (_) { if (mySeq === this.seq) { this.rows = []; this.error = true; } }
        } else {
          this.error = true;
        }
      } finally {
        if (mySeq === this.seq) { this.loading = false; }
      }
    },
    async loadServer(page, mySeq) {
      const params = { page, limit: PAGE_SIZE };
      if (SMS_KNOWN_TYPES.includes(this.type) || this.type === 'other') { params.type = this.type; }
      const q = this.query.trim();
      if (q) { params.q = q; }
      const res = await this.$axios.$get('/finance/subscription/sms-history', { params, silent: true, background: true });
      if (mySeq !== this.seq) { return; }
      if (!res || !res.success || !Array.isArray(res.data)) { throw new Error('bad response'); }
      this.rows = res.data.map(normalizeSmsRow);
      this.totalPages = Math.max(1, Number(res.pagination && res.pagination.totalPages) || 1);
    },
    async loadFallback(page, mySeq) {
      const res = await this.$axios.$get('/qarz-daftari/sms-history', { silent: true, background: true });
      if (mySeq !== this.seq) { return; }
      if (!res || !res.success || !Array.isArray(res.data)) { throw new Error('bad response'); }
      this.fallbackRows = res.data.map(normalizeSmsRow);
      this.applyFallback(page);
      this.page = page;
    },
    /** Brauzerda: tur filtri + qidiruv + 10 talik sahifa */
    applyFallback(page) {
      const q = this.query.trim().toLowerCase();
      let list = this.fallbackRows;
      if (this.type === 'other') {
        list = list.filter((r) => !SMS_KNOWN_TYPES.includes(r.type));
      } else if (SMS_KNOWN_TYPES.includes(this.type)) {
        list = list.filter((r) => r.type === this.type);
      }
      if (q) {
        list = list.filter((r) => `${r.phone} ${r.name} ${r.message}`.toLowerCase().includes(q));
      }
      this.totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      const p = Math.min(page, this.totalPages);
      this.rows = list.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
    },
  },
};
</script>
