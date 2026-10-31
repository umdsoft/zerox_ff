<template>
  <div
    class="fixed inset-0 flex items-center justify-center p-4"
    style="z-index: 130; background-color: rgba(17, 24, 39, 0.45); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);"
    role="dialog"
    aria-modal="true"
    @click.self="closeSmsCat"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" style="max-height: 85vh">
      <div class="flex items-start justify-between px-5 py-4 border-b border-gray-100">
        <div class="min-w-0">
          <h3 class="text-base font-bold text-gray-900">{{ smsCatOpen.label }}</h3>
          <p class="text-xs text-gray-500 mt-0.5">{{ smsCatOpen.count }} <span v-if="smsCatOpen.poolLine">· {{ smsCatOpen.poolLine }}</span></p>
        </div>
        <button type="button" class="w-8 h-8 -mr-1 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100" @click="closeSmsCat">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="overflow-y-auto flex-1">
        <SmsMessageList :type="smsCatOpen.type" />
      </div>
    </div>
  </div>
</template>

<script>
// wave C: pages/price/index.vue dan ajratilgan (kategoriya bo'yicha SMS ro'yxati, blur fon). Holat sahifada.
export default {
  name: 'PriceSmsCategoryModal',
  components: {
    SmsMessageList: () => import('~/components/sms/SmsMessageList.vue'),
  },
  props: {
    smsCatOpen: { type: Object, required: true },
  },
  methods: {
    closeSmsCat() {
      this.$emit('close');
    },
  },
};
</script>
