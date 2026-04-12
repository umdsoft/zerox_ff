<template>
  <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
    <div class="text-center mb-6">
      <h2 class="text-xl font-bold text-gray-900">Qarz kvitansiyasi</h2>
      <div class="w-16 h-0.5 bg-blue-500 mx-auto mt-2"></div>
    </div>

    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-400 uppercase">Qarz oluvchi</p>
          <p class="text-sm font-semibold text-gray-900">{{ data.qarz_oluvchi }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase">Qarz beruvchi</p>
          <p class="text-sm font-semibold text-gray-900">{{ data.qarz_beruvchi }}</p>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-400">Qarz miqdori</p>
          <p class="text-lg font-bold text-gray-900">{{ formatMoney(data.miqdor) }} {{ data.valyuta }}</p>
        </div>
        <div v-if="data.qaytarilgan > 0">
          <p class="text-xs text-gray-400">Qaytarilgan</p>
          <p class="text-lg font-bold text-green-600">{{ formatMoney(data.qaytarilgan) }} {{ data.valyuta }}</p>
        </div>
      </div>

      <div v-if="data.qoldiq > 0" class="bg-red-50 rounded-xl p-3">
        <p class="text-xs text-gray-500">Qoldiq qarz</p>
        <p class="text-lg font-bold text-red-600">{{ formatMoney(data.qoldiq) }} {{ data.valyuta }}</p>
      </div>

      <div class="border-t border-gray-100 pt-4 space-y-2">
        <div v-if="data.mahsulot_nomi" class="flex justify-between">
          <span class="text-xs text-gray-500">Mahsulot</span>
          <span class="text-sm text-gray-700">{{ data.mahsulot_nomi }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-xs text-gray-500">Berilgan sana</span>
          <span class="text-sm text-gray-700">{{ data.berilgan_sana }}</span>
        </div>
        <div v-if="data.qaytarish_sanasi" class="flex justify-between">
          <span class="text-xs text-gray-500">Qaytarish sanasi</span>
          <span class="text-sm text-gray-700">{{ data.qaytarish_sanasi }}</span>
        </div>
        <div v-if="data.bolib_tolash" class="flex justify-between">
          <span class="text-xs text-gray-500">Bo'lib to'lash</span>
          <span class="text-sm text-purple-600 font-medium">{{ data.oylar_soni }} oy</span>
        </div>
      </div>

      <!-- Bo'lib to'lash jadvali -->
      <div v-if="data.tolovlar && data.tolovlar.length" class="border-t border-gray-100 pt-4">
        <QarzDaftariBolibTolashJadval :tolovlar="data.tolovlar" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { data: { type: Object, required: true } },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
  },
};
</script>
