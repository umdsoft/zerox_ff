<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left">
      <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
        <tr>
          <th class="px-4 py-3">#</th>
          <th class="px-4 py-3">To'lov sanasi</th>
          <th class="px-4 py-3">Summa</th>
          <th class="px-4 py-3">Status</th>
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
          <td class="px-4 py-3 text-gray-700">{{ tolov.tolov_sanasi }}</td>
          <td class="px-4 py-3 text-gray-900 font-medium">
            {{ formatNumber(tolov.summa) }}
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
              To'landi
            </button>
          </td>
        </tr>
        <tr v-if="!tolovlar || !tolovlar.length">
          <td colspan="5" class="px-4 py-6 text-center text-gray-400">
            To'lovlar mavjud emas
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
  },
  methods: {
    formatNumber(n) {
      return Number(n || 0).toLocaleString('uz-UZ')
    },
  },
}
</script>
