<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div class="absolute inset-0 bg-black/50" @click="showRestart = false"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl overflow-y-auto" style="max-height: 92vh;">
      <h3 class="text-lg font-bold text-gray-900 mb-1">🔄 {{ $t('finance.gap_restart_title') }}</h3>
      <p class="text-sm text-gray-500 mb-4">{{ $t('finance.gap_restart_members', { n: restartMemberCount }) }}</p>
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_name') }}</label>
        <input v-model="restartForm.name" type="text" maxlength="150" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_frequency') }}</label>
        <div class="grid grid-cols-3 gap-2">
          <button type="button" @click="restartForm.frequency = 'monthly'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', restartForm.frequency === 'monthly' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_monthly') }}</button>
          <button type="button" @click="restartForm.frequency = '15days'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', restartForm.frequency === '15days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_15') }}</button>
          <button type="button" @click="restartForm.frequency = '10days'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', restartForm.frequency === '10days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_10') }}</button>
        </div>
      </div>
      <div v-if="restartForm.frequency === 'monthly'" class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_day') }}</label>
        <input v-model.number="restartForm.day_of_month" type="number" min="1" max="28" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
      </div>
      <div v-if="restartForm.frequency === 'monthly'" class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_start_month') }}</label>
        <date-picker
          v-model="restartForm.start_month_ym"
          type="month"
          value-type="YYYY-MM"
          format="MMMM YYYY"
          :lang="dpLang"
          :editable="false"
          :clearable="false"
          class="w-full"
          input-class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
        />
      </div>
      <div class="mb-5">
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" v-model="restartForm.uniform" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
          <span class="text-sm font-semibold text-gray-700">{{ $t('finance.gap_uniform_label') }}</span>
        </label>
        <div v-if="restartForm.uniform" class="flex items-center gap-2 mt-2">
          <input :value="formatThousands(restartForm.amount)" @input="onRestartAmount" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
          <span class="text-sm text-gray-500 flex-shrink-0">{{ gap.currency }}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="showRestart = false" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
        <button @click="submitRestart" :disabled="busy" class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ $t('finance.gap_restart_go') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// wave C: pages/finance/gap/_id.vue dan ajratilgan (qayta davom ettirish modali). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { formatThousands } from '@/utils/gapMembers';
export default {
  name: 'GapRestartModal',
  props: {
    gap: { type: Object, required: true },
    restartForm: { type: Object, required: true },
    dpLang: { type: String, default: 'uz-Latn' },
    busy: { type: Boolean, default: false },
    restartMemberCount: { type: Number, default: 0 },
  },
  computed: {
    showRestart: {
      get() { return true; },
      set() { this.$emit('close'); },
    },
  },
  methods: {
    submitRestart() {
      this.$emit('submit');
    },
    onRestartAmount(e) {
      this.$emit('amount-input', e);
    },
    formatThousands,
  },
};
</script>
