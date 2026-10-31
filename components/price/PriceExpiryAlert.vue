<template>
  <div class="zx-plan-alert" :class="expiryAlert.kind === 'expired' ? 'zx-plan-alert--expired' : 'zx-plan-alert--soon'" role="alert">
    <div class="flex items-start gap-3">
      <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-bold">{{ expiryAlert.title }}</p>
        <p class="text-sm mt-0.5 leading-snug">{{ expiryAlert.text }}</p>
      </div>
      <button type="button" class="zx-plan-alert__btn flex-shrink-0" @click="$emit('renew', expiryAlert.plan)">{{ expiryAlert.btn }}</button>
    </div>
  </div>
</template>

<script>
// wave C: pages/price/index.vue dan ajratilgan (tarif muddati tugamoqda / tugagan ogohlantirishi).
export default {
  name: 'PriceExpiryAlert',
  props: {
    expiryAlert: { type: Object, required: true },
  },
};
</script>

<style scoped>
/* 29.09: tarif muddati ogohlantirishi (Tailwind v2 JIT o'chiq — scoped CSS) */
.zx-plan-alert {
  border-radius: 1rem;
  padding: 14px 16px;
  border: 1px solid;
}
.zx-plan-alert--soon { background: #fffbeb; border-color: #fcd34d; color: #92400e; }
.zx-plan-alert--expired { background: #fef2f2; border-color: #fca5a5; color: #991b1b; }
.zx-plan-alert__btn {
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  transition: filter 0.15s ease;
}
.zx-plan-alert--soon .zx-plan-alert__btn { background: #d97706; }
.zx-plan-alert--expired .zx-plan-alert__btn { background: #dc2626; }
.zx-plan-alert__btn:hover { filter: brightness(0.92); }
@media (max-width: 640px) {
  .zx-plan-alert > div { flex-wrap: wrap; }
  .zx-plan-alert__btn { width: 100%; }
}
</style>
