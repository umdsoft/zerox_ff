<template>
  <ZModal :width="400" @closeModal="$emit('close')">
    <template #modal_body>
      <div :class="amber ? 'text-lg font-bold mb-4 mt-2' : 'text-md font-bold mb-2 mt-4'">{{ $t('debt_list.Sorting') }}</div>
      <div class="form-date-picker2 mb-5">
        <date-picker
          v-model="sortDate"
          range
          value-type="YYYY-MM-DD"
          format="DD.MM.YYYY"
          :placeholder="$t('placeholder.oraliq')"
        />
      </div>
      <button
        :class="amber ? 'w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors' : 'btn-z w-full'"
        @click="$emit('search')"
      >
        {{ $t('searching') }}
      </button>
    </template>
  </ZModal>
</template>

<script>
// wave D: ro'yxat sahifalaridagi "Saralash" (sana oralig'i) modali — 6 sahifada bir xil edi (faqat near-expiration* sahifalarida amber tugma).
// Sahifa `v-if="sortModal"` bilan ko'rsatadi: <ContractListSortModal v-if="sortModal" :sort-date-value.sync="sortDate" @close @search />
import ZModal from '@/components/ZModal.vue';
export default {
  name: 'ContractListSortModal',
  components: { ZModal },
  props: {
    sortDateValue: { type: null, default: null },
    amber: { type: Boolean, default: false },
  },
  computed: {
    sortDate: {
      get() { return this.sortDateValue; },
      set(v) { this.$emit('update:sortDateValue', v); },
    },
  },
};
</script>
