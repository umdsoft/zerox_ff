<template>
  <div class="gap-detail pb-10">
    <div v-if="loading" class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div></div>

    <template v-else-if="gap">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-5">
        <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-teal-600 hover:shadow transition" aria-label="Orqaga">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold text-gray-900 truncate">{{ gap.name }}</h1>
          <p class="text-gray-500 text-sm">{{ formatMoney(gap.amount) }} {{ gap.currency }} · {{ $t('finance.gap_day') }}: {{ gap.day_of_month }}</p>
        </div>
        <span :class="statusClass(gap.status)" class="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">{{ statusLabel(gap.status) }}</span>
      </div>

      <!-- DRAFT: a'zolarni boshqarish -->
      <div v-if="gap.status === 'draft'" class="bg-white rounded-2xl p-5 shadow-sm mb-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-gray-900">👥 {{ $t('finance.gap_members') }} ({{ gap.members.length }})</h3>
        </div>
        <div class="space-y-2 mb-4">
          <div v-for="m in gap.members" :key="m.id" class="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
            <div class="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold flex-shrink-0">{{ initials(m.name) }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ m.name }}<span v-if="m.user_id === gap.organizer_id" class="text-teal-600"> · 👑</span></p>
              <p class="text-xs text-gray-400">{{ m.phone }}</p>
            </div>
            <!-- Per-a'zo summa (kim qanchadan kirishadi) -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <input v-if="gap.is_organizer" :value="formatThousands(m.amount)" @change="setMemberAmount(m, $event)" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-right outline-none focus:ring-2 focus:ring-teal-500" />
              <span v-else class="text-xs font-semibold text-gray-700">{{ m.amount ? formatMoney(m.amount) : '—' }}</span>
              <span class="text-xs text-gray-400">{{ gap.currency }}</span>
              <button v-if="gap.is_organizer && m.user_id !== gap.organizer_id" @click="removeMember(m)" class="px-1.5 text-gray-400 hover:text-red-600" aria-label="remove">✕</button>
            </div>
          </div>
        </div>

        <div v-if="gap.is_organizer">
          <p class="text-xs text-gray-400 mb-2">{{ $t('finance.gap_member_amount_hint') }}</p>
          <div class="flex gap-2 mb-3">
            <input v-model="newPhone" type="tel" :placeholder="$t('finance.family_phone_ph')" class="flex-1 min-w-0 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" @keyup.enter="addMember" />
            <input :value="formatThousands(newAmount)" @input="onNewAmountInput" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="w-24 px-2 py-2.5 border border-gray-200 rounded-xl text-sm text-right outline-none focus:ring-2 focus:ring-teal-500" />
            <button @click="addMember" :disabled="busy" class="px-3 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold flex-shrink-0">+</button>
          </div>
          <button @click="doShuffle" :disabled="busy || gap.members.length < 2" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold transition">🎲 {{ $t('finance.gap_shuffle') }}</button>
          <p class="text-xs text-gray-400 mt-2 text-center">{{ $t('finance.gap_shuffle_hint') }}</p>
        </div>
        <p v-else class="text-sm text-gray-400 text-center">{{ $t('finance.gap_wait_organizer') }}</p>
      </div>

      <!-- ACTIVE/COMPLETED: davralar -->
      <template v-else>
        <!-- Navbat tartibi -->
        <div class="bg-white rounded-2xl p-5 shadow-sm mb-5">
          <h3 class="font-bold text-gray-900 mb-3">🔢 {{ $t('finance.gap_turn_order') }}</h3>
          <div class="flex flex-wrap gap-2">
            <div v-for="m in orderedMembers" :key="m.id" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-sm">
              <span class="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">{{ m.turn_order }}</span>
              {{ m.name }}
            </div>
          </div>
        </div>

        <!-- Davralar -->
        <div class="space-y-4">
          <div v-for="r in gap.rounds" :key="r.id" :class="['bg-white rounded-2xl p-5 shadow-sm', r.status === 'completed' ? 'opacity-70' : '']">
            <div class="flex items-center justify-between mb-3">
              <div>
                <p class="font-bold text-gray-900">{{ $t('finance.gap_round') }} {{ r.round_no }} — 📅 {{ fmtDate(r.due_date) }}</p>
                <p class="text-sm text-gray-500 mt-0.5">🎯 {{ $t('finance.gap_recipient') }}: <b>{{ r.recipient_name }}</b></p>
              </div>
              <span :class="r.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'" class="text-xs font-semibold px-2 py-0.5 rounded-full">{{ r.paid_count }}/{{ r.total_count }}</span>
            </div>
            <div class="space-y-2">
              <div v-for="p in r.payments" :key="p.id" class="flex items-center justify-between p-2.5 rounded-xl" :class="p.status === 'paid' ? 'bg-green-50' : 'bg-gray-50'">
                <span class="text-sm text-gray-700">{{ p.payer_name }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold" :class="p.status === 'paid' ? 'text-green-700' : 'text-gray-500'">{{ formatMoney(p.amount) }} {{ p.currency }}</span>
                  <span v-if="p.status === 'paid'" class="text-green-600 text-xs">✓ {{ $t('finance.gap_paid') }}</span>
                  <button v-else-if="canMark(r)" @click="markPaid(p)" :disabled="busy" class="px-3 py-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-lg text-xs font-semibold">{{ $t('finance.gap_mark_paid') }}</button>
                  <span v-else class="text-gray-400 text-xs">{{ $t('finance.gap_unpaid') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- O'chirish (tashkilotchi) -->
      <div v-if="gap.is_organizer" class="mt-6 text-center">
        <button @click="showRemove = true" class="text-sm text-red-600 hover:text-red-700 font-medium">🗑 {{ $t('finance.gap_delete') }}</button>
      </div>
    </template>

    <!-- O'chirish tasdig'i -->
    <div v-if="showRemove" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showRemove = false"></div>
      <div class="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
        <p class="text-gray-700 mb-5">{{ $t('finance.gap_delete_confirm') }}</p>
        <div class="flex gap-2">
          <button @click="showRemove = false" class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
          <button @click="removeGap" :disabled="busy" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ $t('finance.gap_delete') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanceGapDetail',
  middleware: 'auth',
  data() {
    return { loading: true, gap: null, newPhone: '', newAmount: '', busy: false, showRemove: false }
  },
  computed: {
    gapId() { return this.$route.params.id },
    myId() { return (this.$auth && this.$auth.user && this.$auth.user.id) || null },
    orderedMembers() {
      return (this.gap && this.gap.members ? this.gap.members.slice() : []).filter(m => m.turn_order).sort((a, b) => a.turn_order - b.turn_order)
    }
  },
  async mounted() { await this.load() },
  methods: {
    goBack() { this.$router.push(this.localePath({ name: 'finance-gap' })) },
    async load() {
      try {
        this.loading = true
        const res = await this.$api.getGap(this.gapId)
        if (res && res.data && res.data.success) this.gap = res.data.data
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
        this.$router.push(this.localePath({ name: 'finance-gap' }))
      } finally { this.loading = false }
    },
    initials(name) { if (!name) return '?'; const p = String(name).trim().split(/\s+/); return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase() },
    formatMoney(v) { return Number(v || 0).toLocaleString('uz-UZ') },
    formatThousands(v) { if (v === '' || v == null) return ''; const n = Number(v); return isFinite(n) && n > 0 ? n.toLocaleString('uz-UZ') : '' },
    onNewAmountInput(e) { const d = String(e.target.value).replace(/\D/g, ''); this.newAmount = d === '' ? '' : Number(d) },
    async setMemberAmount(m, e) {
      const d = String(e.target.value).replace(/\D/g, '')
      const amount = d === '' ? null : Number(d)
      try {
        await this.$api.updateGapMember(this.gapId, m.id, { amount })
        await this.load()
      } catch (err) {
        this.$toast.error((err.response && err.response.data && err.response.data.message) || this.$t('common.error'))
      }
    },
    fmtDate(d) { if (!d) return ''; const p = String(d).slice(0, 10).split('-'); return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : d },
    statusLabel(s) { return s === 'active' ? this.$t('finance.gap_status_active') : (s === 'completed' ? this.$t('finance.gap_status_completed') : this.$t('finance.gap_status_draft')) },
    statusClass(s) { return s === 'active' ? 'bg-green-100 text-green-700' : (s === 'completed' ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700') },
    // Belgilash huquqi: tashkilotchi yoki shu davra qabul qiluvchisi
    canMark(round) {
      if (!this.gap) return false
      if (this.gap.is_organizer) return true
      const rec = this.gap.members.find(m => m.id === round.recipient_member_id)
      return !!(rec && rec.user_id === this.myId)
    },
    async addMember() {
      const phone = String(this.newPhone).trim()
      if (!phone) return
      this.busy = true
      try {
        const res = await this.$api.addGapMember(this.gapId, phone, this.newAmount === '' ? undefined : Number(this.newAmount))
        if (res && res.data && res.data.success) { this.newPhone = ''; this.newAmount = ''; await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async removeMember(m) {
      this.busy = true
      try {
        const res = await this.$api.removeGapMember(this.gapId, m.id)
        if (res && res.data && res.data.success) await this.load()
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async doShuffle() {
      this.busy = true
      try {
        const res = await this.$api.shuffleGap(this.gapId)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.gap_started')); await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async markPaid(p) {
      this.busy = true
      try {
        const res = await this.$api.payGap(this.gapId, p.id)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.gap_paid')); await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async removeGap() {
      this.busy = true
      try {
        const res = await this.$api.removeGap(this.gapId)
        if (res && res.data && res.data.success) { this.showRemove = false; this.$router.push(this.localePath({ name: 'finance-gap' })) }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    }
  }
}
</script>
