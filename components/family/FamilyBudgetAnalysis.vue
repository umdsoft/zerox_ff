<template>
  <!-- B36-2: Oila byudjeti tahlili — alohida bo'lim (kuzatuv bo'limlaridan OLDIN) -->
  <section class="mb-6">
    <h3 class="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><span>📊</span> {{ $t('finance.fb_cta') }}</h3>
    <p class="text-sm text-gray-500 mb-3">{{ $t('finance.fb_section_hint') }}</p>
    <button class="w-full bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition text-left" @click="goBudget">
      <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 text-white" style="background: linear-gradient(135deg, #14b8a6 0%, #059669 100%);">📊</div>
      <div class="flex-1 min-w-0">
        <p class="font-bold text-gray-900">{{ $t('finance.fb_open') }}</p>
        <p class="text-sm text-gray-500">{{ $t('finance.fb_subtitle') }}</p>
      </div>
      <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
    </button>
  </section>

</template>

<script>
// wave D: pages/finance/family/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'FamilyBudgetAnalysis',
  props: {
    goBudget: { type: Function, default: undefined },
  },
};
</script>
