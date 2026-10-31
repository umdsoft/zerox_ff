<template>
  <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <!-- Search -->
      <SearchComponent class="w-full md:flex-1 md:max-w-md" localMode @search-input="localSearchQuery = $event" />

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <button @click="sortModal = true"
          class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {{ $t('debt_list.Sorting') }}
        </button>

        <!-- SS-DEV (2026-09-27), 26.09 hujjat 2-band: katta yashil "Excelga yuklash" o'rniga umumiy
             "Yuklab olish" chip'i (kontragent sahifasidagi uslub). Eksport funksiyasi o'zgarmadi. -->
        <DownloadButton :disabled="!(exportss && exportss.length)" @click="exportExcel()" />
      </div>
    </div>
  </div>
</template>

<script>
// wave C: qidiruv + saralash + yuklab olish paneli (debt-list va credit-list da baytma-bayt bir xil edi).
import SearchComponent from '@/components/SearchComponent.vue';
import DownloadButton from '@/components/ui/DownloadButton.vue';
export default {
  name: 'ContractListToolbar',
  components: { SearchComponent, DownloadButton },
  props: {
    exportss: { type: null, default: undefined },
    localSearchQueryValue: { type: null, default: undefined },
    sortModalValue: { type: null, default: undefined },
  },
  computed: {
    localSearchQuery: {
      get() { return this.localSearchQueryValue; },
      set(v) { this.$emit('update:localSearchQueryValue', v); },
    },
    sortModal: {
      get() { return this.sortModalValue; },
      set(v) { this.$emit('update:sortModalValue', v); },
    },
  },
  methods: {
    exportExcel(...args) {
      this.$emit('export-excel', ...args);
    },
  },
};
</script>
