<template>
  <div class="overflow-x-auto">
    <h4 v-if="title" class="text-sm font-semibold text-gray-900 mb-3">{{ title || texts.jadvalTitle }}</h4>
    <table class="w-full text-sm text-left">
      <thead class="bg-gray-50 text-gray-600 text-xs">
        <tr>
          <th class="px-4 py-3 font-medium">#</th>
          <th class="px-4 py-3 font-medium">{{ texts.tolovSanasi }}</th>
          <th class="px-4 py-3 font-medium">{{ texts.summa }}</th>
          <th class="px-4 py-3 font-medium">{{ texts.status }}</th>
          <th class="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="tolov in tolovlar"
          :key="tolov.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-3 text-gray-700">{{ tolov.tartib_raqami }}</td>
          <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ formatDate(tolov.tolov_sanasi) }}</td>
          <td class="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">
            {{ formatNumber(tolov.summa) }}<span v-if="valyuta" class="text-xs text-gray-400 ml-1">{{ valyuta }}</span>
          </td>
          <td class="px-4 py-3">
            <StatusBadge :status="tolov.status" />
          </td>
          <td class="px-4 py-3">
            <button
              v-if="tolov.status !== 'tolandi'"
              class="px-3 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700"
              @click="$emit('tolandi', tolov.id)"
            >
              {{ texts.tolandi }}
            </button>
          </td>
        </tr>
        <tr v-if="!tolovlar || !tolovlar.length">
          <td colspan="5" class="px-4 py-6 text-center text-gray-400">
            {{ texts.empty }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import StatusBadge from './StatusBadge.vue'

export default {
  name: 'BolibTolashJadval',
  components: {
    StatusBadge,
  },
  props: {
    tolovlar: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    valyuta: {
      type: String,
      default: '',
    },
  },
  computed: {
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          jadvalTitle: "Bo'lib to'lash jadvali",
          tolovSanasi: "To'lov sanasi", summa: "Summa", status: "Status",
          tolandi: "To'landi", empty: "To'lovlar mavjud emas",
        },
        ru: {
          jadvalTitle: "График рассрочки",
          tolovSanasi: "Дата платежа", summa: "Сумма", status: "Статус",
          tolandi: "Оплачено", empty: "Платежи отсутствуют",
        },
        kr: {
          jadvalTitle: "Бўлиб тўлаш жадвали",
          tolovSanasi: "Тўлов санаси", summa: "Сумма", status: "Статус",
          tolandi: "Тўланди", empty: "Тўловлар мавжуд эмас",
        },
      };
      return t[l] || t.uz;
    },
  },
  methods: {
    formatNumber(n) {
      return Number(n || 0).toLocaleString('uz-UZ')
    },
    formatDate(d) {
      if (!d) return '—';
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return `${String(dt.getDate()).padStart(2, '0')}.${String(dt.getMonth() + 1).padStart(2, '0')}.${dt.getFullYear()}`;
    },
  },
}
</script>
