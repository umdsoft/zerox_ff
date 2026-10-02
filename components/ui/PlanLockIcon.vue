<template>
  <!-- 02.10: TARIF CHEKLOVI qulf ikonkasi — pullik imkoniyat tugmasida (tarif muddati tugagan / Free).
       Tugma bosilsa API chaqirilmaydi, "Tariflar" tugmali taklif chiqadi (subscriptionMixin `requirePlanFeature`). -->
  <svg
    class="plan-lock-icon flex-shrink-0"
    :style="{ width: size, height: size }"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    viewBox="0 0 24 24"
    role="img"
    :aria-label="label"
  >
    <title v-if="label">{{ label }}</title>
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
</template>

<script>
export default {
  name: 'PlanLockIcon',
  props: {
    size: { type: String, default: '1rem' },
    label: { type: String, default: '' },
  },
};
</script>
