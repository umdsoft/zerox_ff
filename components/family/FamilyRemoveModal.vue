<template>
  <!-- ===== O'chirish tasdig'i ===== -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="showRemove = false"></div>
    <div class="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
      <div class="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" /></svg>
      </div>
      <p class="text-gray-700 mb-5">{{ $t('finance.family_confirm_remove') }}</p>
      <div class="flex gap-2">
        <button class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition" @click="showRemove = false">{{ $t('common.cancel') }}</button>
        <button :disabled="saving" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl font-semibold transition" @click="confirmRemove">{{ $t('finance.family_remove') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// wave D: pages/finance/family/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'FamilyRemoveModal',
  props: {
    saving: { type: null, default: undefined },
    confirmRemove: { type: Function, default: undefined },
  },
};
</script>
