<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style="z-index: 100" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">Tranzaksiya tafsiloti</h3>
          <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-sm text-gray-500">Turi</span>
            <span class="text-sm font-medium" :class="tranzaksiya.turi === 'berish' ? 'text-red-600' : tranzaksiya.turi === 'qaytarish' ? 'text-green-600' : 'text-gray-600'">
              {{ tranzaksiya.turi === 'berish' ? 'Berilgan qarz' : tranzaksiya.turi === 'qaytarish' ? 'Qaytarilgan' : 'Voz kechildi' }}
            </span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-sm text-gray-500">Summa</span>
            <span class="text-sm font-bold text-gray-900">{{ formatMoney(tranzaksiya.summa) }} {{ tranzaksiya.valyuta }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-sm text-gray-500">Sana</span>
            <span class="text-sm text-gray-700">{{ formatDate(tranzaksiya.created_at) }}</span>
          </div>
          <div v-if="tranzaksiya.izoh" class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-sm text-gray-500">Mahsulot</span>
            <span class="text-sm text-gray-700">{{ tranzaksiya.izoh }}</span>
          </div>
        </div>

        <!-- Bo'lib to'lash jadvali -->
        <div v-if="tolovlar && tolovlar.length" class="mt-4">
          <h4 class="text-sm font-semibold text-gray-900 mb-2">Bo'lib to'lash jadvali</h4>
          <QarzDaftariBolibTolashJadval :tolovlar="tolovlar" />
        </div>

        <button @click="$emit('close')" class="w-full mt-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors">Ok</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tranzaksiya: { type: Object, required: true },
    tolovlar: { type: Array, default: () => [] },
  },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    formatDate(d) { if (!d) return ''; const dt = new Date(d); return `${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.${dt.getFullYear()} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`; },
  },
};
</script>
