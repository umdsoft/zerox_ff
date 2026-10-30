<template>
  <!-- 30.10: "Yetkazilmagan" kartasi ichidagi sahifa — mijozga yetkazilmagan SMS'lar (1, 2, 3 … raqamlangan).
       Marshrut: /price/sms-undelivered. Eski Qarz daftari kartasi/modalining ro'yxati shu yerga ko'chirildi. -->
  <div class="pb-8 max-w-5xl mx-auto px-4">
    <div class="flex items-center gap-3 mb-4 mt-2">
      <button
        type="button"
        class="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm"
        :title="$t('sms_hist.back')"
        @click="goBack"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ $t('sms_delivery.modal_title') }}</h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-0.5">{{ $t('sms_delivery.modal_subtitle', { days, count }) }}</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <p v-if="listError" class="px-5 py-6 text-sm text-red-600 text-center">{{ $t('sms_delivery.error') }}</p>
      <p v-else-if="!rows.length && !loading" class="px-5 py-8 text-sm text-gray-500 text-center">{{ $t('sms_delivery.empty') }}</p>
      <ul class="divide-y divide-gray-100">
        <li v-for="(r, i) in rows" :key="r.id" class="px-4 sm:px-5 py-3.5">
          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 w-7 text-sm font-semibold text-gray-400 tabular-nums pt-0.5">{{ i + 1 }}.</span>
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <nuxt-link
                  v-if="r.mijoz_id"
                  :to="localePath({ name: 'qarz-daftari-mijoz-id', params: { id: r.mijoz_id } })"
                  class="text-sm font-semibold text-gray-900 hover:text-blue-600 truncate"
                >{{ r.mijoz_fish || '—' }}</nuxt-link>
                <span v-else class="text-sm font-semibold text-gray-900">{{ r.mijoz_fish || '—' }}</span>
                <span class="text-xs text-gray-500">{{ r.phone }}</span>
              </div>
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <span class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ $t(typeKey(r.sms_type)) }}</span>
                <span class="text-xs text-gray-400">{{ fmtDMYHM(r.created_at) }}</span>
              </div>
              <p class="text-xs font-semibold text-red-600 mt-1">{{ reasonLabel(r) }}</p>
            </div>
            <button
              v-if="r.qarz_id"
              type="button"
              :disabled="opening === r.id"
              class="flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              @click="openDebt(r)"
            >{{ $t('sms_delivery.open_debt') }}</button>
          </div>
        </li>
      </ul>
      <div v-if="loading" class="text-center py-4">
        <svg class="w-6 h-6 text-blue-500 animate-spin mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      </div>
      <div v-if="hasMore && !loading && !listError" class="px-5 py-3 text-center">
        <button type="button" class="text-sm font-semibold text-blue-600 hover:text-blue-700" @click="loadMore">{{ $t('sms_delivery.load_more') }}</button>
      </div>
      <p class="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{{ $t('sms_delivery.footer_note') }}</p>
    </div>
  </div>
</template>

<script>
import { fmtDMYHM } from '@/utils/helpers';
import { smsTypeKey, undeliveredRowReason, resolveOperationRoute } from '@/utils/smsHistory';

// Backend `days` ni 30 bilan cheklaydi (smsDelivery.service DAYS_MAX)
const DAYS = 30;
const PAGE_SIZE = 50;

export default {
  name: 'PriceSmsUndeliveredPage',
  middleware: 'auth',
  data() {
    return { days: DAYS, count: 0, rows: [], page: 0, hasMore: false, loading: false, listError: false, opening: null, seq: 0 };
  },
  mounted() { this.loadMore(); },
  beforeDestroy() { this.seq += 1; },
  methods: {
    fmtDMYHM,
    typeKey: smsTypeKey,
    goBack() { this.$router.push(this.localePath({ name: 'price' })); },
    async loadMore() {
      if (this.loading) { return; }
      const mySeq = this.seq;
      this.loading = true;
      this.listError = false;
      try {
        const res = await this.$axios.$get('/qarz-daftari/sms/undelivered', { params: { days: DAYS, page: this.page + 1, limit: PAGE_SIZE }, silent: true, background: true });
        if (mySeq !== this.seq) { return; }
        const data = res && res.success && res.data;
        if (!data || !Array.isArray(data.rows)) { throw new Error('bad response'); }
        this.count = Number(data.count) || 0;
        const seen = new Set(this.rows.map((r) => r.id));
        this.rows = [...this.rows, ...data.rows.filter((r) => !seen.has(r.id))];
        this.page += 1;
        this.hasMore = data.rows.length >= PAGE_SIZE && this.rows.length < this.count;
      } catch (_) {
        if (mySeq === this.seq) { this.listError = true; }
      } finally {
        if (mySeq === this.seq) { this.loading = false; }
      }
    },
    reasonLabel(r) {
      const code = undeliveredRowReason(r);
      return `${this.$t('sms_hist.undelivered')}: ${this.$t(`sms_hist.rs_${code}`)}`;
    },
    /** "Qarzni ochish" → Amaliyot tafsiloti (qarz-daftari/tranzaksiya/_id) */
    async openDebt(r) {
      if (this.opening) { return; }
      this.opening = r.id;
      try {
        const to = await resolveOperationRoute(this, r.qarz_id, r.mijoz_id, r.created_at);
        if (to) { this.$router.push(to); }
      } finally {
        this.opening = null;
      }
    },
  },
};
</script>
