<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
        <p class="text-gray-500 mt-1">{{ texts.subtitle }}</p>
      </div>
      <nuxt-link :to="localePath({ name: 'qarz-daftari-qarz-id', params: { id: $route.params.id } })" class="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mt-3 md:mt-0 transition-colors">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        {{ texts.back }}
      </nuxt-link>
    </div>

    <!-- Summary kartalar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-400">
        <p class="text-xs font-medium text-gray-500 mb-1">{{ texts.given }}</p>
        <p class="text-xl font-bold text-red-600">{{ formatMoney(data.summary?.berilgan?.uzs) }} <span class="text-sm font-normal">UZS</span></p>
        <p class="text-sm text-red-400 mt-1">{{ formatMoney(data.summary?.berilgan?.usd) }} USD</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-400">
        <p class="text-xs font-medium text-gray-500 mb-1">{{ texts.returned }}</p>
        <p class="text-xl font-bold text-green-600">{{ formatMoney(data.summary?.qaytarilgan?.uzs) }} <span class="text-sm font-normal">UZS</span></p>
        <p class="text-sm text-green-400 mt-1">{{ formatMoney(data.summary?.qaytarilgan?.usd) }} USD</p>
      </div>
      <div class="bg-white rounded-xl shadow-sm p-5 border-l-4 border-gray-400">
        <p class="text-xs font-medium text-gray-500 mb-1">{{ texts.forgiven }}</p>
        <p class="text-xl font-bold text-gray-600">{{ formatMoney(data.summary?.voz_kechilgan?.uzs) }} <span class="text-sm font-normal">UZS</span></p>
        <p class="text-sm text-gray-400 mt-1">{{ formatMoney(data.summary?.voz_kechilgan?.usd) }} USD</p>
      </div>
    </div>

    <!-- Tranzaksiyalar jadvali -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table v-if="data.tranzaksiyalar?.length" class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-xs font-medium text-gray-500 px-6 py-3">{{ texts.type }}</th>
            <th class="text-left text-xs font-medium text-gray-500 px-6 py-3">{{ texts.amount }}</th>
            <th class="text-left text-xs font-medium text-gray-500 px-6 py-3">{{ texts.dateCol }}</th>
            <th class="text-right text-xs font-medium text-gray-500 px-6 py-3">{{ texts.status }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in data.tranzaksiyalar" :key="t.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div :class="['w-9 h-9 rounded-lg flex items-center justify-center', t.turi === 'berish' ? 'bg-red-100' : t.turi === 'qaytarish' ? 'bg-green-100' : 'bg-gray-100']">
                  <svg v-if="t.turi === 'berish'" class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>
                  <svg v-else-if="t.turi === 'qaytarish'" class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>
                  <svg v-else class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </div>
                <span class="font-medium text-gray-900 text-sm">{{ t.turi === 'berish' ? texts.givenType : t.turi === 'qaytarish' ? texts.returnedType : texts.forgivenType }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="font-semibold text-gray-900">{{ formatMoney(t.summa) }} {{ t.valyuta }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(t.created_at) }}</td>
            <td class="px-6 py-4 text-right">
              <span :class="['text-xs px-2.5 py-1 rounded-lg font-medium', t.turi === 'berish' ? 'bg-red-100 text-red-700' : t.turi === 'qaytarish' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
                {{ t.turi === 'berish' ? texts.givenType : t.turi === 'qaytarish' ? texts.returnedType : texts.forgivenType }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center py-16 text-gray-400 text-sm">{{ texts.empty }}</div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() { return { data: { summary: {}, tranzaksiyalar: [] } }; },
  computed: {
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: "Amaliyotlar tarixi", subtitle: "Barcha qarz operatsiyalari", back: "Qarz tafsiloti", given: "Berilgan qarz", returned: "Qaytarilgan", forgiven: "Voz kechilgan", type: "turi", amount: "summa", dateCol: "sana", status: "status", givenType: "Berildi", returnedType: "Qaytarildi", forgivenType: "Voz kechildi", empty: "Amaliyotlar yo'q" },
        ru: { title: "История операций", subtitle: "Все долговые операции", back: "Детали долга", given: "Выдано", returned: "Возвращено", forgiven: "Прощено", type: "тип", amount: "сумма", dateCol: "дата", status: "статус", givenType: "Выдано", returnedType: "Возвращено", forgivenType: "Прощено", empty: "Нет операций" },
        kr: { title: "Амалиётлар тарихи", subtitle: "Барча қарз операциялари", back: "Қарз тафсилоти", given: "Берилган қарз", returned: "Қайтарилган", forgiven: "Воз кечилган", type: "тури", amount: "сумма", dateCol: "сана", status: "статус", givenType: "Берилди", returnedType: "Қайтарилди", forgivenType: "Воз кечилди", empty: "Амалиётлар йўқ" },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() {
    try {
      const res = await this.$axios.$get(`/qarz-daftari/qarz/${this.$route.params.id}/amaliyotlar`, { silent: true });
      if (res?.success) this.data = res.data;
    } catch (_) {}
  },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    formatDate(d) { if (!d) return ''; const dt = new Date(d); return `${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.${dt.getFullYear()} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`; },
  },
};
</script>
