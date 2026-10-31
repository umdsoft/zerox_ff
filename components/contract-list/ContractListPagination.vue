<template>
  <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
    <PaginationPro
      :total-items="length"
      :items-per-page="limit"
      :page="page"
      :max-visible-pages="5"
      @page-change="pageChange"
    />
  </div>
</template>

<script>
// wave C: shartnoma ro'yxati sahifalari uchun umumiy sahifalash bloki (5 sahifada baytma-bayt bir xil edi).
import PaginationPro from '@/components/PaginationPro.vue';
export default {
  name: 'ContractListPagination',
  components: { PaginationPro },
  props: {
    length: { type: null, default: undefined },
    limit: { type: null, default: undefined },
    page: { type: null, default: undefined },
  },
  methods: {
    pageChange(...args) {
      this.$emit('page-change', ...args);
    },
  },
};
</script>
