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
  tolandi: { class: 'bg-green-100 text-green-800', label: 'l10n.qd.status_paid' },
  kutilmoqda: { class: 'bg-yellow-100 text-yellow-800', label: 'l10n.qd.status_pending' },
  muddati_otgan: {
    class: 'bg-red-100 text-red-800',
    label: 'l10n.pdg.overdue',
  },
  aktiv: { class: 'bg-blue-100 text-blue-800', label: 'l10n.qd.status_active' },
  yopilgan: { class: 'bg-green-100 text-green-800', label: 'l10n.qd.status_closed' },
  voz_kechilgan: {
    class: 'bg-gray-100 text-gray-800',
    label: 'l10n.qd.status_forgiven',
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
      return entry ? this.$t(entry.label) : this.status
    },
  },
}
</script>
