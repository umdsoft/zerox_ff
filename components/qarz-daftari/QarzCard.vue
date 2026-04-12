<template>
  <div @click="$emit('click', qarz)" class="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-all border-l-4" :class="qarz.turi === 'berish' ? 'border-blue-500' : 'border-green-500'">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-bold text-gray-900">{{ formatMoney(qarz.miqdor) }} {{ qarz.valyuta }}</span>
      <QarzDaftariStatusBadge :status="qarz.status" />
    </div>
    <div class="flex items-center justify-between">
      <span class="text-xs text-gray-500">{{ qarz.berilgan_sana }}</span>
      <span v-if="qarz.bolib_tolash" class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Muddatli to'lov</span>
    </div>
    <p v-if="qarz.mahsulot_nomi" class="text-xs text-gray-400 mt-1 truncate">{{ qarz.mahsulot_nomi }}</p>
  </div>
</template>

<script>
export default {
  props: { qarz: { type: Object, required: true } },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
  },
};
</script>
