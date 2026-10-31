<template>
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <!-- Search -->
    <SearchComponent class="w-full md:flex-1 md:max-w-md" localMode @search-input="$emit('update:localSearchQueryValue', $event)" />

    <!-- Action Buttons -->
    <div class="flex items-center gap-2">
      <button
        class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-sm"
        @click="$emit('update:sortModalValue', true)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {{ $t('debt_list.Sorting') }}
      </button>

      <!-- 30.09 (doc1 12–13-rasm): umumiy "Yuklab olish" chip'i -->
      <DownloadButton size="md" @click="$emit('export-excel')" />
    </div>
  </div>
</template>

<script>
// wave D: expired/_type va hisobot/_type dagi qidiruv + saralash + yuklab olish qatori (baytma-bayt bir xil edi).
import SearchComponent from '@/components/SearchComponent.vue';
import DownloadButton from '@/components/ui/DownloadButton.vue';
export default {
  name: 'ContractListActionRow',
  components: { SearchComponent, DownloadButton },
  // `.sync` juftliklari: e'lon qilinmasa ildiz <div> ga HTML atribut bo'lib chiqib qolardi (SSR markup farqi).
  props: {
    localSearchQueryValue: { type: String, default: '' },
    sortModalValue: { type: Boolean, default: false },
  },
};
</script>
