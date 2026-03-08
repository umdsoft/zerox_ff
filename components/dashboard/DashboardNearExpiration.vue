<template>
  <div class="mt-6 lg:mt-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Debitor Near Expiration -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-base lg:text-lg font-bold text-gray-900">{{ $t('home.ozD') }}</h3>
            </div>
          </div>
        </div>

        <div class="flex gap-2 p-4 bg-gray-50">
          <button
            @click="handleTab('left', 1)"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="tabLeft === 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
          >
            UZS
          </button>
          <button
            @click="handleTab('left', 2)"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="tabLeft === 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
          >
            USD
          </button>
        </div>

        <div class="px-4 pb-4">
          <div class="border border-gray-200 rounded-xl overflow-hidden">
            <div class="grid grid-cols-2 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">
              <span>{{ $t('home.time') }}</span>
              <span class="text-right">{{ $t('home.sum') }}</span>
            </div>
            <ul class="divide-y divide-gray-100">
              <li v-for="(item, i) in filteredDebitor" :key="i">
                <nuxt-link
                  :to="localePath({ name: 'near-expiration-type', params: { type: 'debitor' }, query: { day: item.end_date, type: item.currency } })"
                  class="grid grid-cols-2 px-4 py-3.5 hover:bg-blue-50 transition-colors"
                >
                  <DaysDisplay :end-date="item.end_date" />
                  <span class="text-right text-sm font-semibold text-gray-800">{{ $formatNumber(item.residual_amount) }} {{ item.currency }}</span>
                </nuxt-link>
              </li>
              <li v-if="filteredDebitor.length === 0" class="px-4 py-8 text-center">
                <p class="text-gray-500 text-sm">{{ emptyText }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Creditor Near Expiration -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-base lg:text-lg font-bold text-gray-900">{{ $t('home.ozC') }}</h3>
            </div>
          </div>
        </div>

        <div class="flex gap-2 p-4 bg-gray-50">
          <button
            @click="handleTab('right', 1)"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="tabRight === 1 ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
          >
            UZS
          </button>
          <button
            @click="handleTab('right', 2)"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="tabRight === 2 ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
          >
            USD
          </button>
        </div>

        <div class="px-4 pb-4">
          <div class="border border-gray-200 rounded-xl overflow-hidden">
            <div class="grid grid-cols-2 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">
              <span>{{ $t('home.time') }}</span>
              <span class="text-right">{{ $t('home.sum') }}</span>
            </div>
            <ul class="divide-y divide-gray-100">
              <li v-for="(item, i) in filteredCreditor" :key="i">
                <nuxt-link
                  :to="localePath({ name: 'near-expiration-type', params: { type: 'creditor' }, query: { day: item.end_date, type: item.currency } })"
                  class="grid grid-cols-2 px-4 py-3.5 hover:bg-green-50 transition-colors"
                >
                  <DaysDisplay :end-date="item.end_date" />
                  <span class="text-right text-sm font-semibold text-gray-800">{{ $formatNumber(item.residual_amount) }} {{ item.currency }}</span>
                </nuxt-link>
              </li>
              <li v-if="filteredCreditor.length === 0" class="px-4 py-8 text-center">
                <p class="text-gray-500 text-sm">{{ emptyText }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DaysDisplay from '@/components/ui/DaysDisplay.vue';

export default {
  name: 'DashboardNearExpiration',
  components: { DaysDisplay },
  props: {
    nearDebitor: { type: Array, default: () => [] },
    nearCreditor: { type: Array, default: () => [] },
    emptyText: { type: String, default: '' },
  },
  data() {
    return {
      tabLeft: 1,
      tabRight: 1,
    };
  },
  computed: {
    filteredDebitor() {
      const cur = this.tabLeft === 1 ? 'UZS' : 'USD';
      return this.nearDebitor.filter(i => i.currency === cur);
    },
    filteredCreditor() {
      const cur = this.tabRight === 1 ? 'UZS' : 'USD';
      return this.nearCreditor.filter(i => i.currency === cur);
    },
  },
  methods: {
    handleTab(side, val) {
      if (side === 'left') this.tabLeft = val;
      else this.tabRight = val;
    },
  },
};
</script>
