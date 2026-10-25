<template>
  <!-- 25.10: qarz bo'yicha SMS urinishlari va yetkazilish holati (GET /qarz-daftari/qarz/:id → data.sms).
       Maydon yo'q bo'lsa (eski backend) — umuman ko'rsatilmaydi. -->
  <div v-if="Array.isArray(sms)" class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
      <h3 class="font-bold text-gray-900">{{ $t('sms_delivery.list_title') }}</h3>
    </div>
    <p v-if="!sms.length" class="text-sm text-gray-500">{{ $t('sms_delivery.list_empty') }}</p>
    <ul v-else class="divide-y divide-gray-100">
      <li v-for="s in sms" :key="s.id" class="py-2.5 flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-900">{{ typeLabel(s.sms_type) }}</p>
          <p class="text-xs text-gray-400">{{ fmtDMYHM(s.created_at) }}</p>
          <p v-if="isBad(s.state)" class="text-xs font-semibold text-red-600 mt-0.5">{{ reasonLabel(s) }}</p>
        </div>
        <span :class="['flex-shrink-0 inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full', stateClass(s.state)]">
          {{ $t(`sms_delivery.state_${knownState(s.state)}`) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { fmtDMYHM } from '@/utils/helpers';

const KNOWN_TYPES = ['registration', 'auto', 'manual', 'qarz_tolandi', 'payment_link'];
const KNOWN_STATES = ['delivered', 'pending', 'sent', 'undelivered', 'failed'];
const KNOWN_FAIL = ['NO_PACKAGE', 'INVALID_PHONE', 'PROVIDER_400', 'NO_TOKEN'];
const RAW_DETAIL = { EXPIRED: 'expired', REJECTD: 'rejected', REJECTED: 'rejected', UNDELIV: 'undeliv', UNDELIVERABLE: 'undeliv', UNDELIVERED: 'undeliv' };
const STATE_CLASS = {
  delivered: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  sent: 'bg-gray-100 text-gray-600',
  undelivered: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
};

export default {
  name: 'QarzSmsDeliveryList',
  props: {
    sms: { type: Array, default: null },
  },
  methods: {
    fmtDMYHM,
    knownState(s) { return KNOWN_STATES.includes(s) ? s : 'sent'; },
    isBad(s) { return s === 'undelivered' || s === 'failed'; },
    stateClass(s) { return STATE_CLASS[this.knownState(s)]; },
    typeLabel(t) { return this.$t(`sms_delivery.type_${KNOWN_TYPES.includes(t) ? t : 'other'}`); },
    reasonLabel(s) {
      if (s.state === 'undelivered') {
        const d = RAW_DETAIL[String(s.raw || '').toUpperCase()];
        const base = this.$t('sms_delivery.reason_operator');
        return d ? `${base} — ${this.$t(`sms_delivery.raw_${d}`)}` : base;
      }
      const code = KNOWN_FAIL.includes(s.reason) ? s.reason : 'other';
      return this.$t('sms_delivery.reason_failed', { reason: this.$t(`sms_delivery.fail_${code}`) });
    },
  },
};
</script>
