<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div class="absolute inset-0 bg-black/50" @click="showAddMember = false"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">➕ {{ $t('finance.gap_add_member') }}</h3>
        <button @click="showAddMember = false" class="text-gray-400 hover:text-gray-600" aria-label="close"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
      </div>
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_member_fish_ph') }}</label>
          <input v-model="newName" type="text" :placeholder="$t('finance.gap_member_fish_ph')" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" @keyup.enter="addMember" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_phone') }}</label>
          <input :value="newPhone" @input="onPhoneInput" type="tel" inputmode="tel" placeholder="+99897 734 50 30" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" @keyup.enter="addMember" />
        </div>
        <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" v-model="newUniform" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
          {{ $t('finance.gap_member_uniform') }}
        </label>
        <div v-if="!newUniform">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_amount_ph') }}</label>
          <input :value="formatThousands(newAmount)" @input="onNewAmountInput" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
      </div>
      <div class="flex gap-2 mt-5">
        <button @click="showAddMember = false" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
        <button @click="addMember" :disabled="busy" class="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ $t('finance.gap_add_member') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// wave C: pages/finance/gap/_id.vue dan ajratilgan (a'zo qo'shish modali). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { formatThousands } from '@/utils/gapMembers';
export default {
  name: 'GapAddMemberModal',
  props: {
    nameValue: { type: String, default: '' },
    uniformValue: { type: Boolean, default: true },
    newPhone: { type: String, default: '' },
    newAmount: { type: [Number, String], default: '' },
    busy: { type: Boolean, default: false },
  },
  computed: {
    newName: {
      get() { return this.nameValue; },
      set(v) { this.$emit('update:nameValue', v); },
    },
    newUniform: {
      get() { return this.uniformValue; },
      set(v) { this.$emit('update:uniformValue', v); },
    },
    showAddMember: {
      get() { return true; },
      set() { this.$emit('close'); },
    },
  },
  methods: {
    addMember() {
      this.$emit('add');
    },
    onNewAmountInput(e) {
      this.$emit('amount-input', e);
    },
    onPhoneInput(e) {
      this.$emit('phone-input', e);
    },
    formatThousands,
  },
};
</script>
