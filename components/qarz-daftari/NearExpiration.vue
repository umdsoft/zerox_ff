<template>
  <div class="mt-6 lg:mt-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Debitor (berilgan — olish kerak) -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-base lg:text-lg font-bold text-gray-900">{{ texts.debitorTitle }}</h3>
            </div>
            <span v-if="debitorCount > 0" class="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">{{ debitorCount }}</span>
          </div>
        </div>

        <div class="flex gap-2 p-4 bg-gray-50">
          <button
            @click="tabLeft = 1"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="tabLeft === 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
          >
            UZS
          </button>
          <button
            @click="tabLeft = 2"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="tabLeft === 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
          >
            USD
          </button>
        </div>

        <div class="px-4 pb-4">
          <div class="border border-gray-200 rounded-xl overflow-hidden">
            <div class="grid grid-cols-12 bg-gray-100 px-4 py-3 text-xs font-medium text-gray-600">
              <span class="col-span-4">{{ texts.client }}</span>
              <span class="col-span-4 text-center">{{ texts.time }}</span>
              <span class="col-span-4 text-right">{{ texts.sum }}</span>
            </div>
            <ul class="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              <li v-for="(item, i) in filteredDebitor" :key="'d-'+i">
                <nuxt-link
                  :to="item.mijoz_id ? localePath({ name: 'qarz-daftari-mijoz-id', params: { id: item.mijoz_id } }) + (item.turi ? '?turi=' + item.turi : '') : localePath({ name: 'qarz-daftari-qarzlar' })"
                  class="grid grid-cols-12 px-4 py-3 hover:bg-blue-50 transition-colors items-center"
                >
                  <span class="col-span-4 text-sm font-medium text-gray-900 truncate">{{ item.mijoz_fish || '—' }}</span>
                  <span class="col-span-4 text-center">
                    <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', daysClass(item)]">
                      {{ daysText(item) }}
                    </span>
                  </span>
                  <span class="col-span-4 text-right text-sm font-semibold text-gray-800">{{ formatMoney(item.residual_amount) }} {{ item.currency }}</span>
                </nuxt-link>
              </li>
              <li v-if="filteredDebitor.length === 0" class="px-4 py-10 text-center">
                <svg class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-gray-400 text-sm">{{ texts.empty }}</p>
              </li>
            </ul>
          </div>
          <nuxt-link
            :to="localePath({ name: 'qarz-daftari-qarzlar' }) + '?turi=berish&status=muddati-oz-qolgan'"
            class="flex items-center justify-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 py-2 mt-2"
          >
            {{ texts.viewAll }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </nuxt-link>
        </div>
      </div>

      <!-- Kreditor (olingan — berish kerak) -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div class="px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-base lg:text-lg font-bold text-gray-900">{{ texts.kreditorTitle }}</h3>
            </div>
            <span v-if="kreditorCount > 0" class="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">{{ kreditorCount }}</span>
          </div>
        </div>

        <div class="flex gap-2 p-4 bg-gray-50">
          <button
            @click="tabRight = 1"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="tabRight === 1 ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
          >
            UZS
          </button>
          <button
            @click="tabRight = 2"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="tabRight === 2 ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
          >
            USD
          </button>
        </div>

        <div class="px-4 pb-4">
          <div class="border border-gray-200 rounded-xl overflow-hidden">
            <div class="grid grid-cols-12 bg-gray-100 px-4 py-3 text-xs font-medium text-gray-600">
              <span class="col-span-4">{{ texts.client }}</span>
              <span class="col-span-4 text-center">{{ texts.time }}</span>
              <span class="col-span-4 text-right">{{ texts.sum }}</span>
            </div>
            <ul class="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              <li v-for="(item, i) in filteredKreditor" :key="'k-'+i">
                <nuxt-link
                  :to="item.mijoz_id ? localePath({ name: 'qarz-daftari-mijoz-id', params: { id: item.mijoz_id } }) + (item.turi ? '?turi=' + item.turi : '') : localePath({ name: 'qarz-daftari-qarzlar' })"
                  class="grid grid-cols-12 px-4 py-3 hover:bg-green-50 transition-colors items-center"
                >
                  <span class="col-span-4 text-sm font-medium text-gray-900 truncate">{{ item.mijoz_fish || '—' }}</span>
                  <span class="col-span-4 text-center">
                    <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', daysClass(item)]">
                      {{ daysText(item) }}
                    </span>
                  </span>
                  <span class="col-span-4 text-right text-sm font-semibold text-gray-800">{{ formatMoney(item.residual_amount) }} {{ item.currency }}</span>
                </nuxt-link>
              </li>
              <li v-if="filteredKreditor.length === 0" class="px-4 py-10 text-center">
                <svg class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-gray-400 text-sm">{{ texts.empty }}</p>
              </li>
            </ul>
          </div>
          <nuxt-link
            :to="localePath({ name: 'qarz-daftari-qarzlar' }) + '?turi=olish&status=muddati-oz-qolgan'"
            class="flex items-center justify-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 py-2 mt-2"
          >
            {{ texts.viewAll }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatMoney } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar

const DAY_MS = 86400000;
const TASHKENT_OFFSET_MS = 5 * 3600000;

/**
 * Sana → Toshkent (UTC+5) kunining boshi (UTC ms). 'YYYY-MM-DD' — o'sha kun; ISO/Date — +5 soat
 * surib UTC kun olinadi (mysql2 DATE '+05:00' → oldingi kun 19:00Z = Toshkentda shu kun).
 * Parse bo'lmasa null.
 */
function tashkentDayMs(v) {
  if (v === null || v === undefined || v === '') return null;
  const s = typeof v === 'string' ? v.trim() : '';
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const d = v instanceof Date ? v : new Date(s.replace(' ', 'T'));
  if (isNaN(d.getTime())) return null;
  const t = new Date(d.getTime() + TASHKENT_OFFSET_MS);
  return Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
}

export default {
  name: 'QarzDaftariNearExpiration',
  props: {
    nearDebitor: { type: Array, default: () => [] },
    nearKreditor: { type: Array, default: () => [] },
  },
  data() {
    return { tabLeft: 1, tabRight: 1 };
  },
  computed: {
    /**
     * 01.10 (doc2 3-rasm): "muddati yaqin" — FAQAT bugun (0) ... kelajak. Sanasi o'tgan qator
     * (-116 / -153 kun) bu yerga tegishli emas — u "muddati o'tgan" bo'limida. Asosiy tuzatish
     * backendda (near-expiration so'rovi); bu UI himoyasi (eski backend / kesh javobi uchun).
     */
    validDebitor() {
      return (this.nearDebitor || []).filter((i) => this.daysLeft(i) !== null && this.daysLeft(i) >= 0);
    },
    validKreditor() {
      return (this.nearKreditor || []).filter((i) => this.daysLeft(i) !== null && this.daysLeft(i) >= 0);
    },
    filteredDebitor() {
      const cur = this.tabLeft === 1 ? 'UZS' : 'USD';
      return this.validDebitor.filter(i => i.currency === cur);
    },
    filteredKreditor() {
      const cur = this.tabRight === 1 ? 'UZS' : 'USD';
      return this.validKreditor.filter(i => i.currency === cur);
    },
    debitorCount() { return this.validDebitor.length; },
    kreditorCount() { return this.validKreditor.length; },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { debitorTitle: "Muddati yaqin berilgan qarzlar", kreditorTitle: "Muddati yaqin olingan qarzlar", client: "Mijoz", time: "Muddat", sum: "Qarz miqdori", empty: "Yaqin orada muddati tugaydigan qarzlar yo'q", today: "Bugun", tomorrow: "Ertaga", days: "kun", viewAll: "Hammasini ko'rish" },
        ru: { debitorTitle: "Скоро срок по выданным долгам", kreditorTitle: "Скоро срок по полученным долгам", client: "Клиент", time: "Срок", sum: "Сумма долга", empty: "Нет долгов с приближающимся сроком", today: "Сегодня", tomorrow: "Завтра", days: "дн.", viewAll: "Показать все" },
        kr: { debitorTitle: "Муддати яқин берилган қарзлар", kreditorTitle: "Муддати яқин олинган қарзлар", client: "Мижоз", time: "Муддат", sum: "Қарз миқдори", empty: "Яқин орада муддати тугайдиган қарзлар йўқ", today: "Бугун", tomorrow: "Эртага", days: "кун", viewAll: "Ҳаммасини кўриш" },
        // SS-DEV (2026-09-26): en/kaa
        en: { debitorTitle: "Debts given due soon", kreditorTitle: "Debts received due soon", client: "Customer", time: "Due", sum: "Debt amount", empty: "No debts due soon", today: "Today", tomorrow: "Tomorrow", days: "days", viewAll: "View all" },
        kaa: { debitorTitle: "Múddeti jaqın berilgen qarızlar", kreditorTitle: "Múddeti jaqın alınǵan qarızlar", client: "Klient", time: "Múddet", sum: "Qarız muǵdarı", empty: "Jaqın arada múddeti tamamlanatuǵın qarızlar joq", today: "Búgin", tomorrow: "Erteń", days: "kún", viewAll: "Hámmesin kóriw" },
      };
      return t[l] || t.uz;
    },
  },
  methods: {
    formatMoney, // SS-AUDIT (2026-09-25): utils/helpers
    /**
     * Qolgan kun (0 = bugun). 01.10: backend `days_left` ni Toshkent kuni bo'yicha beradi — u
     * bo'lsa o'sha; aks holda (eski backend) sana Asia/Tashkent (UTC+5) bo'yicha hisoblanadi —
     * brauzer soat mintaqasi boshqa bo'lsa ham kun siljimaydi.
     */
    daysLeft(item) {
      if (!item) return null;
      const ready = Number(item.days_left);
      if (item.days_left !== null && item.days_left !== undefined && Number.isFinite(ready)) return ready;
      const end = tashkentDayMs(item.end_date);
      if (end === null) return null;
      return Math.round((end - tashkentDayMs(new Date())) / DAY_MS);
    },
    daysText(item) {
      const n = this.daysLeft(item);
      if (n === null) return '—';
      if (n === 0) return this.texts.today;
      if (n === 1) return this.texts.tomorrow;
      return n + ' ' + this.texts.days;
    },
    daysClass(item) {
      const n = this.daysLeft(item);
      if (n === null) return 'bg-gray-100 text-gray-600';
      if (n <= 1) return 'bg-red-100 text-red-700';
      if (n <= 7) return 'bg-amber-100 text-amber-700';
      return 'bg-blue-100 text-blue-700';
    },
  },
};
</script>
