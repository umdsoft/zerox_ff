<template>
  <span
    class="inline-block px-2 py-1 text-xs font-medium rounded-full"
    :class="badgeClass"
  >
    {{ label }}
  </span>
</template>

<script>
const STATUS_MAP = {
  tolandi: { class: 'bg-green-100 text-green-800', label: "To'landi" },
  kutilmoqda: { class: 'bg-yellow-100 text-yellow-800', label: 'Kutilmoqda' },
  muddati_otgan: {
    class: 'bg-red-100 text-red-800',
    label: "Muddati o'tgan",
  },
  aktiv: { class: 'bg-blue-100 text-blue-800', label: 'Aktiv' },
  yopilgan: { class: 'bg-green-100 text-green-800', label: 'Yopilgan' },
  voz_kechilgan: {
    class: 'bg-gray-100 text-gray-800',
    label: 'Voz kechilgan',
  },
}

export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    badgeClass() {
      const entry = STATUS_MAP[this.status]
      return entry ? entry.class : 'bg-gray-100 text-gray-800'
    },
    label() {
      const entry = STATUS_MAP[this.status]
      return entry ? entry.label : this.status
    },
  },
}
</script>
