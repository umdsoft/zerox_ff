<template>
  <!-- 23.10 (22.10 hujjati, 8-rasm): to'liq va qisman qaytarish BITTA sahifaga birlashtirildi
       (pages/debt-refund/index.vue, ?mode=full|partial). Eski /debt-refund/full|partially manzillari
       (xatcho'p, bildirishnomadagi eski havolalar) shu yerdan yangi sahifaga yo'naltiriladi. -->
  <div class="py-16 text-center text-gray-400">{{ $t('common.loading') }}</div>
</template>

<script>
function target(app, route) {
  return app.localePath({
    name: 'debt-refund',
    query: { contract: route.query.contract, mode: route.params.type === 'full' ? 'full' : 'partial' },
  });
}

export default {
  name: 'DebtRefundTypeRedirect',
  middleware: [
    'auth',
    function ({ app, route, redirect }) {
      redirect(target(app, route));
    },
  ],
};
</script>
