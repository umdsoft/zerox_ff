<template>
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div class="absolute inset-0 bg-black/50" @click="showSettings = false"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl overflow-y-auto" style="max-height:92vh">
      <h3 class="text-lg font-bold text-gray-900 mb-4">⚙️ {{ $t('finance.gap_settings') }}</h3>
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_name') }}</label>
        <input :value="settingsForm.name" type="text" maxlength="150" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" @input="setField('name', $event.target.value)" />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_frequency') }}</label>
        <div class="grid grid-cols-3 gap-2">
          <button type="button" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', settingsForm.frequency === 'monthly' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']" @click="setField('frequency', 'monthly')">{{ $t('finance.gap_freq_monthly') }}</button>
          <button type="button" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', settingsForm.frequency === '15days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']" @click="setField('frequency', '15days')">{{ $t('finance.gap_freq_15') }}</button>
          <button type="button" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', settingsForm.frequency === '10days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']" @click="setField('frequency', '10days')">{{ $t('finance.gap_freq_10') }}</button>
        </div>
      </div>
      <div v-if="settingsForm.frequency === 'monthly'" class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_day') }}</label>
        <input :value="settingsForm.day_of_month" type="number" min="1" max="28" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" @input="setNumber('day_of_month', $event.target.value)" />
      </div>
      <!-- SS2: Boshlanish sanasi — BARCHA frequency uchun (o'tgan sanadan boshlangan gapni kiritish) -->
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_start_date') }}</label>
        <date-picker
          :value="settingsForm.start_date" value-type="YYYY-MM-DD"
          format="DD.MM.YYYY"
          :lang="dpLang"
          :editable="false"
          :clearable="true"
          placeholder="kun.oy.yil"
          class="w-full"
          input-class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
          @input="setField('start_date', $event)"
        />
        <p class="text-xs text-gray-400 mt-1">{{ $t('finance.gap_start_date_hint') }}</p>
      </div>
      <!-- U5: Hamma uchun bir xil summa -->
      <div class="mb-5">
        <label class="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" :checked="settingsForm.uniform" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" @change="setField('uniform', $event.target.checked)" />
          <span class="text-sm font-semibold text-gray-700">{{ $t('finance.gap_uniform_label') }}</span>
        </label>
        <p class="text-xs text-gray-400 mt-1">{{ $t('finance.gap_uniform_hint') }}</p>
        <div v-if="settingsForm.uniform" class="flex items-center gap-2 mt-2">
          <input :value="formatThousands(settingsForm.amount)" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" @input="onSettingsAmount" />
          <span class="text-sm text-gray-500 flex-shrink-0">{{ gap.currency }}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold" @click="showSettings = false">{{ $t('common.cancel') }}</button>
        <button :disabled="busy" class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-semibold" @click="saveSettings">{{ $t('common.save') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
// wave C: pages/finance/gap/_id.vue dan ajratilgan (sozlamalar modali). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { formatThousands, looseToNumber } from '@/utils/gapMembers';
export default {
  name: 'GapSettingsModal',
  props: {
    gap: { type: Object, required: true },
    settingsForm: { type: Object, required: true },
    dpLang: { type: String, default: 'uz-Latn' },
    busy: { type: Boolean, default: false },
  },
  computed: {
    showSettings: {
      get() { return true; },
      set() { this.$emit('close'); },
    },
  },
  methods: {
    setField(key, value) {
      this.$emit('update-field', key, value);
    },
    setNumber(key, value) {
      this.$emit('update-field', key, looseToNumber(value));
    },
    saveSettings() {
      this.$emit('save');
    },
    onSettingsAmount(e) {
      this.$emit('amount-input', e);
    },
    formatThousands,
  },
};
</script>
