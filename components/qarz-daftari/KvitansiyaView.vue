<template>
  <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
    <div class="text-center mb-6">
      <h2 class="text-xl font-bold text-gray-900">{{ texts.title }}</h2>
      <div class="w-16 h-0.5 bg-blue-500 mx-auto mt-2"></div>
    </div>

    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <!-- SS-DEV (2026-09-24): sarlavhalar KATTA harf emas — "Qarz oluvchi" -->
          <p class="text-xs text-gray-400">{{ texts.qarzOluvchi }}</p>
          <p class="text-sm font-semibold text-gray-900">{{ data.qarz_oluvchi }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400">{{ texts.qarzBeruvchi }}</p>
          <p class="text-sm font-semibold text-gray-900">{{ data.qarz_beruvchi }}</p>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-400">{{ texts.miqdor }}</p>
          <p class="text-lg font-bold text-gray-900">{{ formatMoney(data.miqdor) }} {{ data.valyuta }}</p>
        </div>
        <!-- SS-DEV (2026-09-24): BERILGAN qarz kvitansiyasida "Qaytarilgan" ko'rsatilmaydi -->
        <div v-if="isOlish && data.qaytarilgan > 0">
          <p class="text-xs text-gray-400">{{ texts.qaytarilgan }}</p>
          <p class="text-lg font-bold text-green-600">{{ formatMoney(data.qaytarilgan) }} {{ data.valyuta }}</p>
        </div>
      </div>

      <div v-if="data.qoldiq > 0" class="bg-red-50 rounded-xl p-3">
        <p class="text-xs text-gray-500">{{ texts.qoldiq }}</p>
        <p class="text-lg font-bold text-red-600">{{ formatMoney(data.qoldiq) }} {{ data.valyuta }}</p>
      </div>

      <div class="border-t border-gray-100 pt-4 space-y-2">
        <div v-if="data.mahsulot_nomi" class="flex justify-between">
          <span class="text-xs text-gray-500">{{ texts.mahsulot }}</span>
          <span class="text-sm text-gray-700">{{ data.mahsulot_nomi }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-xs text-gray-500">{{ isOlish ? texts.olinganSana : texts.berilganSana }}</span>
          <!-- SS-DEV (2026-09-24): sana bilan birga SOAT:DAQIQA (qarz kiritilgan vaqt) -->
          <span class="text-sm text-gray-700">{{ formatDateTime(data.berilgan_sana, data.yaratilgan_vaqt) }}</span>
        </div>
        <div v-if="data.qaytarish_sanasi" class="flex justify-between">
          <span class="text-xs text-gray-500">{{ texts.qaytarishSanasi }}</span>
          <span class="text-sm text-gray-700">{{ formatDate(data.qaytarish_sanasi) }}</span>
        </div>
        <div v-if="data.bolib_tolash" class="flex justify-between">
          <span class="text-xs text-gray-500">{{ texts.bolibTolash }}</span>
          <span class="text-sm text-purple-600 font-medium">{{ data.oylar_soni }} {{ texts.month }}</span>
        </div>
      </div>

      <!-- Bo'lib to'lash jadvali -->
      <div v-if="data.tolovlar && data.tolovlar.length" class="border-t border-gray-100 pt-4">
        <QarzDaftariBolibTolashJadval :tolovlar="data.tolovlar" :valyuta="data.valyuta" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { data: { type: Object, required: true } },
  computed: {
    isOlish() { return this.data?.turi === 'olish'; },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: "Qarz kvitansiyasi",
          qarzOluvchi: "Qarz oluvchi", qarzBeruvchi: "Qarz beruvchi",
          miqdor: "Qarz miqdori", qaytarilgan: "Qaytarilgan", qoldiq: "Qoldiq qarz",
          mahsulot: "Mahsulot",
          berilganSana: "Berilgan sana", olinganSana: "Olingan sana",
          qaytarishSanasi: "Qaytarish sanasi",
          bolibTolash: "Bo'lib to'lash", month: "oy",
        },
        ru: {
          title: "Квитанция долга",
          qarzOluvchi: "Должник", qarzBeruvchi: "Кредитор",
          miqdor: "Сумма долга", qaytarilgan: "Возвращено", qoldiq: "Остаток долга",
          mahsulot: "Товар",
          berilganSana: "Дата выдачи", olinganSana: "Дата получения",
          qaytarishSanasi: "Дата возврата",
          bolibTolash: "Рассрочка", month: "мес",
        },
        kr: {
          title: "Қарз квитансияси",
          qarzOluvchi: "Қарз олувчи", qarzBeruvchi: "Қарз берувчи",
          miqdor: "Қарз миқдори", qaytarilgan: "Қайтарилган", qoldiq: "Қолдиқ қарз",
          mahsulot: "Маҳсулот",
          berilganSana: "Берилган сана", olinganSana: "Олинган сана",
          qaytarishSanasi: "Қайтариш санаси",
          bolibTolash: "Бўлиб тўлаш", month: "ой",
        },
      };
      return t[l] || t.uz;
    },
  },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    formatDate(d) {
      if (!d) return '—';
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return `${String(dt.getDate()).padStart(2, '0')}.${String(dt.getMonth() + 1).padStart(2, '0')}.${dt.getFullYear()}`;
    },
    /**
     * Sana + vaqt. `berilgan_sana` faqat SANA (DATE ustuni); soat:daqiqa qarz
     * KIRITILGAN vaqtdan (`created_at`) olinadi — agar u shu kunga to'g'ri kelsa.
     * Orqaga sana bilan kiritilgan qarzda (masalan kechagi qarz bugun yozilsa)
     * vaqt ko'rsatilmaydi (noto'g'ri vaqt chiqmasin).
     */
    formatDateTime(d, createdAt) {
      const base = this.formatDate(d);
      if (!createdAt) return base;
      const c = new Date(createdAt);
      if (isNaN(c)) return base;
      const sameDay = this.formatDate(createdAt) === base;
      if (!sameDay) return base;
      return `${base} ${String(c.getHours()).padStart(2, '0')}:${String(c.getMinutes()).padStart(2, '0')}`;
    },
  },
};
</script>
