<template>
  <!-- 30.10: "Nima uchun yetkazilmadi" — orqa fon BLUR (Tailwind v2 da backdrop-blur yo'q — inline style) -->
  <div
    class="fixed inset-0 flex items-center justify-center p-4"
    style="z-index: 95; background-color: rgba(17, 24, 39, 0.45); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);"
    role="dialog"
    aria-modal="true"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <div class="flex items-start justify-between px-5 py-4 border-b border-gray-100">
        <div class="flex items-center gap-3 min-w-0">
          <span class="flex-shrink-0 w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          </span>
          <h3 class="text-base font-bold text-gray-900">{{ $t('sms_hist.reason_title') }}</h3>
        </div>
        <button type="button" class="w-8 h-8 -mr-1 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100" :title="$t('sms_delivery.close')" @click="$emit('close')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="px-5 py-4">
        <p class="text-sm font-semibold text-red-600">{{ $t('sms_hist.undelivered') }}: {{ $t(`sms_hist.rs_${reason}`) }}</p>
        <p class="mt-2 text-sm text-gray-700 leading-relaxed">{{ $t(`sms_hist.rl_${reason}`) }}</p>
        <div v-if="phone || message" class="mt-4 rounded-xl bg-gray-50 px-3 py-2.5">
          <p v-if="phone" class="text-xs text-gray-500">{{ phone }}</p>
          <p v-if="message" class="mt-1 text-xs text-gray-600 whitespace-pre-wrap break-words">{{ message }}</p>
        </div>
      </div>
      <div class="px-5 py-3 border-t border-gray-100 text-right">
        <button type="button" class="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200" @click="$emit('close')">{{ $t('sms_delivery.close') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
const REASONS = ['subscriber_inactive', 'blocked', 'invalid_number', 'provider_rejected', 'not_delivered', 'no_package', 'plan_required', 'send_error', 'generic'];

export default {
  name: 'SmsReasonModal',
  props: {
    /** Sabab kodi (utils/smsHistory.normalizeReason natijasi) */
    code: { type: String, default: 'generic' },
    phone: { type: String, default: '' },
    message: { type: String, default: '' },
  },
  computed: {
    reason() { return REASONS.includes(this.code) ? this.code : 'generic'; },
  },
  mounted() { window.addEventListener('keydown', this.onKey); },
  beforeDestroy() { window.removeEventListener('keydown', this.onKey); },
  methods: {
    onKey(e) { if (e.key === 'Escape') { this.$emit('close'); } },
  },
};
</script>
