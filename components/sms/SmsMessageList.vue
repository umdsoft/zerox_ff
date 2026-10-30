<template>
  <!-- 30.10: yuborilgan SMS'lar ro'yxati — TO'LIQ matn, sahifalab yuklanadi (cheksiz, "Yana yuklash").
       Manba: GET /finance/subscription/sms-history (Premium; boshqa tarifda 403 → tarif cheklovi matni). -->
  <div>
    <p v-if="locked" class="m-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{{ $t('sms_hist.locked') }}</p>
    <p v-else-if="error" class="px-5 py-6 text-sm text-red-600 text-center">{{ $t('sms_delivery.error') }}</p>
    <p v-else-if="!rows.length && !loading" class="px-5 py-8 text-sm text-gray-500 text-center">{{ $t('sms_hist.empty') }}</p>

    <ul class="divide-y divide-gray-100">
      <li v-for="r in rows" :key="r.id" class="px-4 sm:px-5 py-3.5">
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
        <p class="mt-1.5 text-sm text-gray-700 whitespace-pre-wrap break-words">{{ r.message }}</p>
      </li>
    </ul>

    <div v-if="loading" class="text-center py-4">
      <svg class="w-6 h-6 text-blue-500 animate-spin mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
    </div>
    <div v-if="hasMore && !loading && !locked && !error" ref="sentinel" class="px-5 py-3 text-center">
      <button type="button" class="text-sm font-semibold text-blue-600 hover:text-blue-700" @click="loadMore">{{ $t('sms_hist.load_more') }}</button>
    </div>

    <SmsReasonModal v-if="reasonRow" :code="reasonRow.reason" :phone="reasonRow.phone" :message="reasonRow.message" @close="reasonRow = null" />
  </div>
</template>

<script>
import { fmtDMYHM } from '@/utils/helpers';
import { SMS_KNOWN_TYPES, smsTypeKey, normalizeSmsRow } from '@/utils/smsHistory';
import SmsReasonModal from '~/components/sms/SmsReasonModal.vue';

const PAGE_SIZE = 100; // backend limit shu yerda cheklaydi (min(limit,100))

export default {
  name: 'SmsMessageList',
  components: { SmsReasonModal },
  props: {
    /** Tur filtri: registration | auto | manual | qarz_tolandi | other | '' (hammasi) */
    type: { type: String, default: '' },
  },
  data() {
    return { rows: [], page: 0, hasMore: false, loading: false, error: false, locked: false, reasonRow: null, seq: 0, observer: null };
  },
  watch: {
    type() { this.reload(); },
    hasMore() { this.$nextTick(this.observe); },
  },
  mounted() { this.reload(); },
  beforeDestroy() {
    this.seq += 1;
    if (this.observer) { this.observer.disconnect(); }
  },
  methods: {
    fmtDMYHM,
    typeKey: smsTypeKey,
    observe() {
      if (typeof IntersectionObserver === 'undefined') { return; }
      if (!this.observer) {
        this.observer = new IntersectionObserver((entries) => {
          if (entries.some((e) => e.isIntersecting)) { this.loadMore(); }
        }, { rootMargin: '200px' });
      }
      this.observer.disconnect();
      if (this.$refs.sentinel) { this.observer.observe(this.$refs.sentinel); }
    },
    async reload() {
      this.seq += 1;
      this.rows = [];
      this.page = 0;
      this.hasMore = false;
      this.error = false;
      this.locked = false;
      await this.loadMore();
    },
    async loadMore() {
      if (this.loading) { return; }
      const mySeq = this.seq;
      this.loading = true;
      try {
        const params = { page: this.page + 1, limit: PAGE_SIZE };
        if (SMS_KNOWN_TYPES.includes(this.type)) { params.type = this.type; }
        const res = await this.$axios.$get('/finance/subscription/sms-history', { params, silent: true, background: true });
        if (mySeq !== this.seq) { return; }
        if (!res || !res.success || !Array.isArray(res.data)) { throw new Error('bad response'); }
        let incoming = res.data.map(normalizeSmsRow);
        if (this.type === 'other') { incoming = incoming.filter((r) => !SMS_KNOWN_TYPES.includes(r.type)); }
        const seen = new Set(this.rows.map((r) => r.id));
        this.rows = [...this.rows, ...incoming.filter((r) => !seen.has(r.id))];
        this.page += 1;
        const totalPages = res.pagination && Number(res.pagination.totalPages);
        this.hasMore = totalPages ? this.page < totalPages : res.data.length >= PAGE_SIZE;
      } catch (e) {
        if (mySeq !== this.seq) { return; }
        if (e && e.response && e.response.status === 403) { this.locked = true; } else { this.error = true; }
      } finally {
        if (mySeq === this.seq) { this.loading = false; }
      }
    },
  },
};
</script>
