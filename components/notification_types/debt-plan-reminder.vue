<template>
  <!-- 22.10 "Qarzdan chiqish": to'lov kuni eslatmasi (type 47). Bildirishnomada faqat
       debt_plan_reminder_id bor — tafsilot GET /finance/debt-plan/reminders/:id dan olinadi;
       "To'ladim" — POST .../pay (Telegram tugmasi bilan bir xil yo'l; 409 = allaqachon to'langan). -->
  <div>
    <p class="text-gray-700 mb-2"><b>{{ $t('debt_plan.notif_title') }}</b></p>

    <p v-if="info" class="mt-2 text-gray-700">
      {{ $t('debt_plan.notif_text', { debt: info.title || '—', sum: sum(info.amount) + ' ' + (info.currency || 'UZS'), date: fmtDate(info.due_date) }) }}
    </p>
    <p v-else-if="loading" class="mt-2 text-gray-400 text-sm">{{ $t('common.loading') }}</p>

    <div class="mt-3 flex flex-wrap gap-2">
      <span v-if="paid" class="py-1.5 px-4 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700">✓ {{ $t('debt_plan.paid') }}</span>
      <button
        v-else-if="info && reminderId"
        type="button"
        :disabled="busy"
        class="py-1.5 px-4 rounded-lg text-sm font-semibold border transition bg-white border-gray-200 text-emerald-600 hover:border-emerald-500" :class="{ 'opacity-60': busy }"
        @click="pay"
      >{{ busy ? $t('common.loading') : $t('debt_plan.i_paid') }}</button>
      <button
        type="button"
        class="py-1.5 px-4 rounded-lg text-sm font-semibold border transition bg-white border-gray-200 text-gray-700 hover:border-gray-400"
        @click="openPlan"
      >{{ $t('debt_plan.open_plan') }}</button>
    </div>

    <div class="notification-actions">
      <div>
        <span><b>{{ $t('comp.time') }}:</b> {{ item.created }} {{ item && item.time ? item.time.slice(0, 5) : '' }}</span>
      </div>
      <div class="notification-actions__buttons">
        <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white" @click="ok(item.id)">Ok</button>
      </div>
    </div>
  </div>
</template>

<script>
import notificationMixin from '~/mixins/notificationMixin'
import { fmtSum, apiErrorText, langParams } from '@/utils/debtPlan'
import { fmtDMY } from '@/utils/helpers'

export default {
  name: 'DebtPlanReminder',
  mixins: [notificationMixin],
  data() {
    return { info: null, loading: false, busy: false, paid: false }
  },
  computed: {
    reminderId() { return this.item && (this.item.debt_plan_reminder_id || this.item.debtPlanReminderId) },
  },
  mounted() {
    this.load()
  },
  methods: {
    async load() {
      if (!this.reminderId) return
      this.loading = true
      try {
        const res = await this.$axios.$get(`/finance/debt-plan/reminders/${this.reminderId}`, { silent: true, background: true })
        this.info = (res && res.data) || null
        this.paid = !!(this.info && this.info.paid)
      } catch (e) {
        this.info = null
      } finally {
        this.loading = false
      }
    },
    async pay() {
      this.busy = true
      try {
        await this.$axios.$post(`/finance/debt-plan/reminders/${this.reminderId}/pay`, {}, { silent: true, params: langParams(this) })
        this.paid = true
        this.$toast && this.$toast.success(this.$t('debt_plan.paid_ok'))
      } catch (e) {
        if (e && e.response && e.response.status === 409) {
          this.paid = true
          this.$toast && this.$toast.info(this.$t('debt_plan.notif_already'))
        } else {
          this.$toast && this.$toast.error(apiErrorText(e, this.$t('debt_plan.err.pay')))
        }
      } finally {
        this.busy = false
      }
    },
    openPlan() {
      this.$router.push(this.localePath({ name: 'finance-debt-plan' }))
    },
    sum: fmtSum,
    fmtDate(d) { return fmtDMY(d) },
  },
}
</script>
