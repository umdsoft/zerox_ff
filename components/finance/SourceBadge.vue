<template>
  <span
    v-if="source"
    :class="['inline-flex items-center gap-1 rounded-full font-medium leading-none', 'text-[10px] px-1.5 py-0.5', badgeClass]"
  >
    <!-- Telegram — rasmiy logo (ko'k doira + oq samolyot) -->
    <svg v-if="source === 'telegram'" class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#28A8E9" />
      <path fill="#FFFFFF" d="M5.5 11.78l11.03-4.25c.51-.19.96.12.79.9l-1.88 8.85c-.13.6-.49.75-1 .47l-2.76-2.04-1.33 1.28c-.15.15-.27.27-.55.27l.2-2.82 5.13-4.64c.22-.2-.05-.31-.34-.11l-6.34 3.99-2.73-.85c-.6-.19-.61-.6.13-.9z" />
    </svg>
    <!-- Sayt (web) — globus -->
    <svg v-else-if="source === 'web'" class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path stroke-linecap="round" d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
    </svg>
    <!-- Ilova (mobil) — telefon -->
    <svg v-else class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path stroke-linecap="round" d="M11 18h2" />
    </svg>
    <span>{{ label }}</span>
  </span>
</template>

<script>
export default {
  name: 'SourceBadge',
  props: {
    source: { type: String, default: '' },
  },
  computed: {
    label() {
      const map = {
        web: this.$t('finance.source_web'),
        mobile: this.$t('finance.source_mobile'),
        telegram: this.$t('finance.source_telegram'),
      };
      return map[this.source] || this.$t('finance.source_web');
    },
    badgeClass() {
      const map = {
        web: 'bg-blue-50 text-blue-600',
        mobile: 'bg-green-50 text-green-600',
        telegram: 'bg-sky-50 text-sky-700',
      };
      return map[this.source] || 'bg-gray-100 text-gray-600';
    },
  },
};
</script>
