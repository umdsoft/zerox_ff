<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="showRemove = false"></div>
    <div class="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
      <p class="text-gray-700 mb-5">{{ $t('finance.gap_delete_confirm') }}</p>
      <div class="flex gap-2">
        <button class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold" @click="showRemove = false">{{ $t('common.cancel') }}</button>
        <button :disabled="busy" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl font-semibold" @click="removeGap">{{ $t('finance.gap_delete') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// wave C: pages/finance/gap/_id.vue dan ajratilgan (o'chirish tasdig'i). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
export default {
  name: 'GapRemoveModal',
  props: {
    busy: { type: Boolean, default: false },
  },
  computed: {
    showRemove: {
      get() { return true; },
      set() { this.$emit('close'); },
    },
  },
  methods: {
    removeGap() {
      this.$emit('remove');
    },
  },
};
</script>
