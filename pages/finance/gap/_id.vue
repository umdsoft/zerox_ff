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
        <div class="flex items-center justify-between mb-3 gap-2">
          <h3 class="font-bold text-gray-900 min-w-0 truncate">👥 {{ $t('finance.gap_members') }} ({{ gap.members.length }})</h3>
          <div v-if="gap.is_organizer" class="flex items-center gap-1.5 flex-shrink-0">
            <!-- V4: "A'zo qo'shish" o'ng-tepada; forma toggle (bosilganda ochiladi) -->
            <button @click="showAddMember = !showAddMember" class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              {{ $t('finance.gap_add_member') }}
            </button>
            <button @click="openSettings" class="inline-flex items-center justify-center w-9 h-9 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition" :title="$t('finance.gap_settings')" :aria-label="$t('finance.gap_settings')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
        </div>

        <!-- A'zo qo'shish formasi — toggle (V4: yashirin, "+A'zo qo'shish" ochadi) — FISH + telefon + qanchadan -->
        <div v-if="gap.is_organizer && showAddMember" class="mb-4 p-3 bg-teal-50/60 rounded-xl border border-teal-100">
          <p class="text-xs text-gray-600 font-semibold mb-2">➕ {{ $t('finance.gap_add_member') }}</p>
          <div class="space-y-2">
            <input v-model="newName" type="text" :placeholder="$t('finance.gap_member_fish_ph')" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white" @keyup.enter="addMember" />
            <div class="flex gap-2">
              <input v-model="newPhone" type="tel" :placeholder="$t('finance.family_phone_ph')" class="flex-1 min-w-0 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white" @keyup.enter="addMember" />
              <input v-if="!newUniform" :value="formatThousands(newAmount)" @input="onNewAmountInput" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="w-28 px-2 py-2.5 border border-gray-200 rounded-xl text-sm text-right outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
              <button @click="addMember" :disabled="busy" class="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold flex-shrink-0">+</button>
            </div>
            <label class="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
              <input type="checkbox" v-model="newUniform" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              {{ $t('finance.gap_member_uniform') }}
            </label>
          </div>
        </div>

        <!-- Navbat rejimi: Tasodifiy / O'zimiz tanlaymiz (tashkilotchi) -->
        <div v-if="gap.is_organizer && gap.members.length >= 2" class="flex gap-2 mb-3">
          <button @click="orderMode = 'random'" :class="['flex-1 py-2 rounded-lg text-sm font-medium border transition', orderMode === 'random' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600']">🎲 {{ $t('finance.gap_order_random') }}</button>
          <button @click="orderMode = 'manual'" :class="['flex-1 py-2 rounded-lg text-sm font-medium border transition', orderMode === 'manual' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600']">✋ {{ $t('finance.gap_order_manual') }}</button>
        </div>

        <div class="space-y-2 mb-4">
          <div v-for="(m, mi) in gap.members" :key="m.id" class="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
            <!-- Qo'lda navbat: yuqoriga/pastga -->
            <div v-if="orderMode === 'manual' && gap.is_organizer" class="flex flex-col flex-shrink-0">
              <button @click="moveMember(mi, -1)" :disabled="mi === 0" class="text-gray-400 hover:text-teal-600 disabled:opacity-30 leading-none">▲</button>
              <button @click="moveMember(mi, 1)" :disabled="mi === gap.members.length - 1" class="text-gray-400 hover:text-teal-600 disabled:opacity-30 leading-none">▼</button>
            </div>
            <div class="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold flex-shrink-0">{{ orderMode === 'manual' ? (mi + 1) : initials(m.name) }}</div>
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
          <button @click="doShuffle" :disabled="busy || gap.members.length < 2" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold transition">{{ orderMode === 'manual' ? '✋ ' + $t('finance.gap_start_manual') : '🎲 ' + $t('finance.gap_shuffle') }}</button>
          <p class="text-xs text-gray-400 mt-2 text-center">{{ orderMode === 'manual' ? $t('finance.gap_order_manual_hint') : $t('finance.gap_shuffle_hint') }}</p>
        </div>
        <p v-else class="text-sm text-gray-400 text-center">{{ $t('finance.gap_wait_organizer') }}</p>
      </div>

      <!-- Nastroyka (sozlamalar) modali -->
      <div v-if="showSettings" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-black/50" @click="showSettings = false"></div>
        <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl max-h-[92vh] overflow-y-auto">
          <h3 class="text-lg font-bold text-gray-900 mb-4">⚙️ {{ $t('finance.gap_settings') }}</h3>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_name') }}</label>
            <input v-model="settingsForm.name" type="text" maxlength="150" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_frequency') }}</label>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" @click="settingsForm.frequency = 'monthly'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', settingsForm.frequency === 'monthly' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_monthly') }}</button>
              <button type="button" @click="settingsForm.frequency = '15days'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', settingsForm.frequency === '15days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_15') }}</button>
              <button type="button" @click="settingsForm.frequency = '10days'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', settingsForm.frequency === '10days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_10') }}</button>
            </div>
          </div>
          <div v-if="settingsForm.frequency === 'monthly'" class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_day') }}</label>
            <input v-model.number="settingsForm.day_of_month" type="number" min="1" max="28" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
          <!-- U5: Hamma uchun bir xil summa -->
          <div class="mb-5">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" v-model="settingsForm.uniform" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              <span class="text-sm font-semibold text-gray-700">{{ $t('finance.gap_uniform_label') }}</span>
            </label>
            <p class="text-xs text-gray-400 mt-1">{{ $t('finance.gap_uniform_hint') }}</p>
            <div v-if="settingsForm.uniform" class="flex items-center gap-2 mt-2">
              <input :value="formatThousands(settingsForm.amount)" @input="onSettingsAmount" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
              <span class="text-sm text-gray-500 flex-shrink-0">{{ gap.currency }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="showSettings = false" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
            <button @click="saveSettings" :disabled="busy" class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ $t('common.save') }}</button>
          </div>
        </div>
      </div>

      <!-- ACTIVE/COMPLETED: davralar -->
      <template v-else>
        <!-- Navbat tartibi -->
        <div class="bg-white rounded-2xl p-5 shadow-sm mb-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-gray-900">🔢 {{ $t('finance.gap_turn_order') }}</h3>
            <button @click="downloadPdf" :disabled="pdfBusy" class="inline-flex items-center gap-1 px-3 py-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 disabled:opacity-60 rounded-lg text-sm font-semibold transition">
              <span>📄</span> {{ pdfBusy ? '...' : $t('finance.gap_pdf') }}
            </button>
          </div>
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
                <p class="font-bold text-gray-900">{{ $t('finance.gap_round') }} {{ r.round_no }} — 📅 {{ fmtUzDate(r.due_date) }}</p>
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
    return { loading: true, gap: null, showAddMember: false, newName: '', newPhone: '', newAmount: '', newUniform: true, busy: false, pdfBusy: false, showRemove: false, orderMode: 'random', showSettings: false, settingsForm: { name: '', frequency: 'monthly', day_of_month: 1 } }
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
    // Navbat jadvalini PDF qilib yuklab olish
    async downloadPdf() {
      if (this.pdfBusy) return
      try {
        this.pdfBusy = true
        const res = await this.$api.downloadGapPdf(this.gapId)
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const safe = String((this.gap && this.gap.name) || 'gap').replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 40) || 'gap'
        a.download = `gap-${safe}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error(this.$t('common.error'))
      } finally { this.pdfBusy = false }
    },
    // O'zbekcha sana: "27-avgust, payshanba"
    fmtUzDate(d) {
      if (!d) return ''
      const p = String(d).slice(0, 10).split('-')
      if (p.length !== 3) return d
      const dt = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]))
      const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
      const wd = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']
      return `${+p[2]}-${months[+p[1] - 1] || ''}, ${wd[dt.getUTCDay()] || ''}`
    },
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
      // Summa: "hamma bilan bir xil" bo'lsa gap standart summasi, aks holda kiritilgan
      let amount
      if (this.newUniform) {
        amount = (this.gap && this.gap.amount != null) ? Number(this.gap.amount) : undefined
      } else {
        amount = this.newAmount === '' ? undefined : Number(this.newAmount)
      }
      const name = String(this.newName || '').trim()
      this.busy = true
      try {
        const res = await this.$api.addGapMember(this.gapId, phone, amount, name || undefined)
        if (res && res.data && res.data.success) {
          // T4: ro'yxatdan o'tmagan raqam bo'lsa ogohlantiramiz (baribir qo'shildi)
          if (res.data.data && res.data.data.registered === false) {
            this.$toast && this.$toast.info && this.$toast.info(this.$t('finance.gap_member_unregistered'))
          }
          this.newName = ''; this.newPhone = ''; this.newAmount = ''
          await this.load()
        }
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
    // Qo'lda navbat: a'zoni yuqoriga/pastga siljitish
    moveMember(i, dir) {
      const arr = this.gap.members
      const j = i + dir
      if (j < 0 || j >= arr.length) return
      const tmp = arr[i]; this.$set(arr, i, arr[j]); this.$set(arr, j, tmp)
    },
    openSettings() {
      this.settingsForm = {
        name: this.gap.name,
        frequency: this.gap.frequency || 'monthly',
        day_of_month: this.gap.day_of_month || 1,
        uniform: !!this.gap.uniform,
        amount: this.gap.amount != null ? this.gap.amount : ''
      }
      this.showSettings = true
    },
    // U5: uniform summa inputi (probel-formatli raqam)
    onSettingsAmount(e) {
      const d = String(e.target.value).replace(/\D/g, '')
      this.settingsForm.amount = d === '' ? '' : Number(d)
    },
    async saveSettings() {
      this.busy = true
      try {
        const res = await this.$api.updateGap(this.gapId, this.settingsForm)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.family_updated')); this.showSettings = false; await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async doShuffle() {
      this.busy = true
      try {
        // Qo'lda rejim: joriy a'zolar tartibini yuboramiz; tasodifiy: order=null
        const order = this.orderMode === 'manual' ? this.gap.members.map(m => m.id) : null
        const res = await this.$api.shuffleGap(this.gapId, order)
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
