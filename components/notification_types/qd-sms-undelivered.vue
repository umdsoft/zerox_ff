<template>
  <div>
    <p class="text-gray-700 mb-2">
      <b>{{ $t('sms_hist.n49_title') }}</b>
    </p>

    <p class="mt-2 text-gray-700">{{ body }}</p>

    <div class="notification-actions">
      <div>
        <span><b>{{ $t('comp.time') }}:</b> {{ item.created }} {{ item && item.time ? item.time.slice(0, 5) : '' }}</span>
      </div>
      <div class="notification-actions__buttons">
        <button v-if="info.qarzId" :disabled="opening" @click="openDebt" class="py-1 px-4 mx-2 rounded border border-blue-500 text-blue-600 hover:bg-blue-50">
          {{ $t('sms_hist.n49_go') }}
        </button>
        <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
          Ok
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * qd-sms-undelivered.vue — 30.10: qarz berilganda qarzdorga SMS YETKAZILMAGANLIGI haqida do'kon egasiga
 * bildirishnoma (type = 49). Backend maydonlari: ud_qarz_id (qarz_daftari.id), ud_sms_id, ud_mijoz (ism),
 * ud_phone, ud_amount, ud_currency, rem_faoliyat_id/_nomi, failure_reason (kod yoki null).
 * «Qarzga o'tish» — Amaliyot tafsiloti sahifasi; «Ok» — bildirishnomani yopish (notificationMixin.ok).
 */
import notificationMixin from '~/mixins/notificationMixin'
import { normalizeReason, resolveOperationRoute } from '~/utils/smsHistory'

/** Bildirishnoma maydonlarini bitta joyda, himoyalangan holda o'qish (extra JSON/obyekt bo'lishi ham mumkin) */
function parseUndelivered(item) {
  const it = item || {}
  let extra = it.extra || it.payload || it.data || null
  if (typeof extra === 'string') { try { extra = JSON.parse(extra) } catch (_) { extra = null } }
  const pick = (...keys) => {
    for (const k of keys) {
      if (it[k] !== undefined && it[k] !== null && it[k] !== '') { return it[k] }
      if (extra && extra[k] !== undefined && extra[k] !== null && extra[k] !== '') { return extra[k] }
    }
    return null
  }
  return {
    qarzId: pick('ud_qarz_id', 'qarz_id'),
    mijozId: pick('ud_mijoz_id', 'mijoz_id'),
    name: String(pick('ud_mijoz', 'mijoz_fish') || '').trim(),
    reason: normalizeReason(pick('failure_reason')),
    createdAt: it.created_at || null,
  }
}

export default {
  name: 'QdSmsUndelivered',
  mixins: [notificationMixin],
  data() { return { opening: false } },
  computed: {
    info() { return parseUndelivered(this.item) },
    body() {
      const reason = this.$t(`sms_hist.rs_${this.info.reason}`)
      return this.info.name
        ? this.$t('sms_hist.n49_body_name', { name: this.info.name, reason })
        : this.$t('sms_hist.n49_body', { reason })
    },
  },
  methods: {
    async openDebt() {
      if (this.opening || !this.info.qarzId) { return }
      this.opening = true
      try {
        const to = await resolveOperationRoute(this, this.info.qarzId, this.info.mijozId, this.info.createdAt)
        if (to) { this.$router.push(to) }
      } finally {
        this.opening = false
      }
    },
  },
}
</script>
