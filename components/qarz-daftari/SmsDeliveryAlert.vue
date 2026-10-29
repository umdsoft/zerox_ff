<template>
  <!-- 25.10: "Oxirgi 7 kunda N ta SMS mijozga yetkazilmadi" — faqat N > 0 bo'lsa. So'rov yiqilsa
       (masalan backend hali yangilanmagan) blok umuman ko'rinmaydi. -->
  <div v-if="count > 0" class="zx-sms-alert relative overflow-hidden rounded-2xl mt-6 border border-red-200 bg-white shadow-sm">
    <div class="absolute inset-y-0 left-0 w-1.5 bg-red-500"></div>
    <div class="flex flex-col sm:flex-row sm:items-center gap-3 p-4 pl-6">
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-bold text-gray-900">{{ $t('sms_delivery.alert_title', { days, count }) }}</p>
          <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ $t('sms_delivery.alert_hint') }}</p>
        </div>
      </div>
      <button
        type="button"
        class="flex-shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
        @click="openModal"
      >
        {{ $t('sms_delivery.view') }}
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>

    <!-- Ro'yxat modali (index.vue dagi do'kon modali uslubida; Tailwind v2 da backdrop-blur yo'q) -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center p-4"
      style="z-index: 90; background-color: rgba(17, 24, 39, 0.45); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"
      role="dialog"
      aria-modal="true"
      @click.self="showModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" style="max-height: 85vh">
        <div class="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div class="min-w-0">
            <h3 class="text-base font-bold text-gray-900">{{ $t('sms_delivery.modal_title') }}</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ $t('sms_delivery.modal_subtitle', { days, count }) }}</p>
          </div>
          <button type="button" class="w-8 h-8 -mr-1 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors" :title="$t('sms_delivery.close')" @click="showModal = false">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="overflow-y-auto flex-1">
          <p v-if="listError" class="px-5 py-6 text-sm text-red-600 text-center">{{ $t('sms_delivery.error') }}</p>
          <p v-else-if="!rows.length && !loading" class="px-5 py-6 text-sm text-gray-500 text-center">{{ $t('sms_delivery.empty') }}</p>
          <ul class="divide-y divide-gray-100">
            <li v-for="r in rows" :key="r.id" class="px-5 py-3">
              <div class="flex items-start gap-3">
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <nuxt-link
                      v-if="r.mijoz_id"
                      :to="localePath({ name: 'qarz-daftari-mijoz-id', params: { id: r.mijoz_id } })"
                      class="text-sm font-semibold text-gray-900 hover:text-blue-600 truncate"
                    >{{ r.mijoz_fish || '—' }}</nuxt-link>
                    <span class="text-xs text-gray-500">{{ r.phone }}</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 mt-1">
                    <span class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ typeLabel(r.sms_type) }}</span>
                    <span class="text-xs text-gray-400">{{ fmtDMYHM(r.created_at) }}</span>
                  </div>
                  <p class="text-xs font-semibold text-red-600 mt-1">{{ reasonLabel(r) }}</p>
                </div>
                <nuxt-link
                  v-if="r.qarz_id"
                  :to="localePath({ name: 'qarz-daftari-qarz-id', params: { id: r.qarz_id } })"
                  class="flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >{{ $t('sms_delivery.open_debt') }}</nuxt-link>
              </div>
            </li>
          </ul>
          <div v-if="hasMore && !listError" class="px-5 py-3 text-center">
            <button type="button" :disabled="loading" class="text-sm font-semibold text-blue-600 hover:text-blue-700" @click="loadMore">
              {{ loading ? $t('common.loading') : $t('sms_delivery.load_more') }}
            </button>
          </div>
        </div>
        <p class="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{{ $t('sms_delivery.footer_note') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { fmtDMYHM } from '@/utils/helpers';

const DAYS = 7;
const PAGE_SIZE = 20;
const KNOWN_TYPES = ['registration', 'auto', 'manual', 'qarz_tolandi', 'payment_link'];
const KNOWN_FAIL = ['NO_PACKAGE', 'INVALID_PHONE', 'PROVIDER_400', 'NO_TOKEN'];
const RAW_DETAIL = { EXPIRED: 'expired', REJECTD: 'rejected', REJECTED: 'rejected', UNDELIV: 'undeliv', UNDELIVERABLE: 'undeliv', UNDELIVERED: 'undeliv' };

export default {
  name: 'SmsDeliveryAlert',
  props: {
    /** Tanlangan do'kon id ('Barcha do'konlar' — null). Backend ko'lamni o'zi tekshiradi. */
    faoliyatId: { type: [Number, String], default: null },
  },
  data() {
    // seq — so'rov tartib raqami: faqat oxirgi reload()/loadMore() natijasi qo'llanadi.
    return { days: DAYS, count: 0, rows: [], hasMore: false, page: 0, loading: false, listError: false, showModal: false, seq: 0 };
  },
  watch: {
    // Do'kon o'zgarsa — sahifa/qatorlar tozalanib qayta yuklanadi (eski javoblar seq bilan tashlanadi).
    faoliyatId() { this.reload(); },
  },
  mounted() {
    this.reload();
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeDestroy() {
    this.seq += 1; // uchib yurgan javoblar tashlansin
    window.removeEventListener('keydown', this.onKeydown);
  },
  methods: {
    fmtDMYHM,
    onKeydown(e) {
      if (e.key === 'Escape' && this.showModal) {this.showModal = false;}
    },
    params(page) {
      const p = { days: DAYS, page, limit: PAGE_SIZE };
      if (this.faoliyatId) {p.faoliyat_id = this.faoliyatId;}
      return p;
    },
    async fetchPage(page) {
      const res = await this.$axios.$get('/qarz-daftari/sms/undelivered', { params: this.params(page), silent: true });
      if (!res || !res.success || !res.data || !Array.isArray(res.data.rows)) {throw new Error('bad response');}
      return res.data;
    },
    /** Yangi qatorlarni id bo'yicha takrorsiz qo'shadi (offset sahifalash qatorni ikki marta qaytarishi mumkin). */
    mergeRows(existing, incoming) {
      const seen = new Set(existing.map((r) => r.id));
      return [...existing, ...incoming.filter((r) => !seen.has(r.id))];
    },
    async reload() {
      this.seq += 1;
      const mySeq = this.seq;
      this.rows = [];
      this.hasMore = false;
      this.page = 0;
      this.listError = false;
      this.loading = true;
      try {
        const data = await this.fetchPage(1);
        if (mySeq !== this.seq) {return;} // eskirgan javob (do'kon o'zgargan / yangi reload)
        this.count = Number(data.count) || 0;
        this.rows = this.mergeRows([], data.rows);
        this.hasMore = data.rows.length >= PAGE_SIZE && this.rows.length < this.count;
        this.page = 1;
      } catch (_) {
        if (mySeq !== this.seq) {return;}
        this.count = 0; // xato — ogohlantirish ko'rsatilmaydi
      } finally {
        if (mySeq === this.seq) {this.loading = false;}
      }
    },
    async loadMore() {
      if (this.loading) {return;}
      const mySeq = this.seq;
      this.loading = true;
      try {
        const data = await this.fetchPage(this.page + 1);
        if (mySeq !== this.seq) {return;} // reload() oraliqda ishga tushgan — eski do'kon qatorlari qo'shilmaydi
        this.rows = this.mergeRows(this.rows, data.rows);
        // Sahifa to'liq bo'lmasa — oxirgi sahifa: "Yana ko'rsatish" cheksiz qolmasin.
        this.hasMore = data.rows.length >= PAGE_SIZE && this.rows.length < this.count;
        this.page += 1;
      } catch (_) {
        if (mySeq === this.seq) {this.listError = true;}
      } finally {
        if (mySeq === this.seq) {this.loading = false;}
      }
    },
    openModal() {
      this.showModal = true;
      if (!this.rows.length && this.count > 0 && !this.loading) {this.loadMore();}
    },
    typeLabel(t) {
      return this.$t(`sms_delivery.type_${KNOWN_TYPES.includes(t) ? t : 'other'}`);
    },
    reasonLabel(r) {
      if (r.state === 'undelivered') {
        const d = RAW_DETAIL[String(r.raw || '').toUpperCase()];
        const base = this.$t('sms_delivery.reason_operator');
        return d ? `${base} — ${this.$t(`sms_delivery.raw_${d}`)}` : base;
      }
      const code = KNOWN_FAIL.includes(r.reason) ? r.reason : 'other';
      return this.$t('sms_delivery.reason_failed', { reason: this.$t(`sms_delivery.fail_${code}`) });
    },
  },
};
</script>

<style scoped>
.zx-sms-alert { scroll-margin-top: 80px; }
</style>
