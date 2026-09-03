<template>
  <div class="gap-page pb-10">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-5">
      <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-teal-600 hover:shadow transition" aria-label="Orqaga">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div class="flex-1">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.gap_title') }}</h1>
        <p class="text-gray-500 text-sm mt-0.5">{{ $t('finance.gap_subtitle') }}</p>
      </div>
      <button @click="openCreate" class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        {{ $t('finance.gap_create') }}
      </button>
    </div>

    <!-- Hero (inline-style gradient — paletta'ga bog'liq emas) -->
    <div class="rounded-2xl p-6 md:p-7 text-white mb-6 relative overflow-hidden" style="background: linear-gradient(120deg, #0d9488 0%, #10b981 55%, #059669 100%)">
      <div class="absolute top-0 right-0 w-56 h-56 bg-white opacity-10 rounded-full -translate-y-1/3 translate-x-1/4"></div>
      <div class="relative z-10 flex items-start gap-4">
        <span class="text-5xl">💰</span>
        <div>
          <h2 class="text-xl md:text-2xl font-bold">{{ $t('finance.gap_hero') }}</h2>
          <p class="mt-1 max-w-2xl" style="color: rgba(255,255,255,0.9)">{{ $t('finance.gap_hero_desc') }}</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-16"><div class="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div></div>

    <template v-else>
      <div v-if="!gaps.length" class="bg-white rounded-2xl p-8 shadow-sm text-center">
        <span class="text-4xl">🫙</span>
        <p class="font-semibold text-gray-700 mt-2">{{ $t('finance.gap_empty') }}</p>
        <p class="text-sm text-gray-400 mt-1">{{ $t('finance.gap_empty_hint') }}</p>
        <button @click="openCreate" class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition">{{ $t('finance.gap_create') }}</button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="g in gaps" :key="g.id" @click="openDetail(g)" class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md cursor-pointer transition">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="font-bold text-gray-900 truncate">{{ g.name }}</p>
              <p class="text-sm text-gray-500 mt-0.5"><span v-if="g.amount">{{ formatMoney(g.amount) }} {{ g.currency }} · </span>{{ freqLabel(g.frequency) }} · {{ g.member_count }} {{ $t('finance.gap_members_count') }}</p>
            </div>
            <span :class="statusClass(g.status)" class="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">{{ statusLabel(g.status) }}</span>
          </div>
          <div class="flex items-center justify-between mt-3 text-xs">
            <span v-if="g.is_organizer" class="inline-flex items-center gap-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">👑 {{ $t('finance.gap_organizer') }}</span>
            <span v-else class="text-gray-400">{{ $t('finance.gap_member') }}</span>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span v-if="g.next_due" class="text-gray-500">📅 {{ fmtDate(g.next_due) }}</span>
              <!-- B30-8: o'chirish — faqat tashkilotchida -->
              <button v-if="g.is_organizer" @click.stop="askDelete(g)" class="p-1 -m-1 text-gray-300 hover:text-red-600 transition" :aria-label="$t('finance.gap_delete')" :title="$t('finance.gap_delete')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <button @click="openCreate" class="sm:hidden fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full bg-teal-600 text-white shadow-lg flex items-center justify-center">
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
    </button>

    <!-- Create modal -->
    <div v-if="showCreate" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showCreate = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl max-h-[92vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('finance.gap_create') }}</h3>
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_name') }}</label>
          <input v-model="form.name" type="text" maxlength="150" :placeholder="$t('finance.gap_name_ph')" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
        </div>
        <!-- Aylanish davri -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_frequency') }}</label>
          <div class="grid grid-cols-3 gap-2">
            <button type="button" @click="form.frequency = 'monthly'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm transition', form.frequency === 'monthly' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_monthly') }}</button>
            <button type="button" @click="form.frequency = '15days'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm transition', form.frequency === '15days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_15') }}</button>
            <button type="button" @click="form.frequency = '10days'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm transition', form.frequency === '10days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_10') }}</button>
          </div>
        </div>
        <div v-if="form.frequency === 'monthly'" class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_day') }}</label>
          <input v-model.number="form.day_of_month" type="number" min="1" max="31" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
          <p class="text-xs text-gray-400 mt-1">{{ $t('finance.gap_day_hint') }}</p>
        </div>
        <!-- B34-8: eski (o'tgan) gapni yaratish uchun boshlanish oyi (faqat oylik) -->
        <div v-if="form.frequency === 'monthly'" class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_start_month') }}</label>
          <!-- B35-2: native oy-input o'rniga ilova tiliga mos (kirill/lotin) date-picker -->
          <date-picker
            v-model="form.start_month_ym"
            type="month"
            value-type="YYYY-MM"
            format="MMMM YYYY"
            :lang="dpLang"
            :editable="false"
            :clearable="false"
            class="w-full"
            input-class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
          />
          <p class="text-xs text-gray-400 mt-1">{{ $t('finance.gap_start_month_hint') }}</p>
        </div>
        <!-- B30-9: Gap summasi (UZS yoki USD) — ixtiyoriy, a'zolar bo'limida ham o'zgartirsa bo'ladi -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.amount') }}</label>
          <div class="flex gap-2">
            <input :value="formatThousands(form.amount)" @input="onAmountInput" type="text" inputmode="numeric" placeholder="0" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
            <select v-model="form.currency" class="px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white">
              <option value="UZS">UZS</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <p class="text-xs text-gray-400 mt-1">{{ $t('finance.gap_amount_later') }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="showCreate = false" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition">{{ $t('common.cancel') }}</button>
          <button @click="submitCreate" :disabled="saving" class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-semibold transition">{{ $t('finance.gap_create') }}</button>
        </div>
      </div>
    </div>

    <!-- B30-8: Gap o'chirishni tasdiqlash (faqat tashkilotchi) -->
    <div v-if="showDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showDelete = false"></div>
      <div class="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
        <div class="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </div>
        <p class="text-gray-700 mb-1 font-semibold">{{ deleteTarget && deleteTarget.name }}</p>
        <p class="text-sm text-gray-500 mb-5">{{ $t('finance.gap_delete_confirm') }}</p>
        <div class="flex gap-2">
          <button @click="showDelete = false" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition">{{ $t('common.cancel') }}</button>
          <button @click="confirmDelete" :disabled="saving" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl font-semibold transition">{{ $t('finance.gap_delete') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanceGap',
  middleware: 'auth',
  data() {
    return {
      loading: true,
      gaps: [],
      showCreate: false,
      saving: false,
      showDelete: false,
      deleteTarget: null,
      form: { name: '', amount: '', currency: 'UZS', day_of_month: 1, frequency: 'monthly', start_month_ym: '' }
    }
  },
  computed: {
    // B35-2: date-picker tili — ilova lokaliga mos (kr=kirill, ru=rus, aks holda lotin)
    dpLang() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn')
    }
  },
  watch: {
    // "Oyning kuni" — Gap uchun 1..28 (28 dan katta / 1 dan kichik son kiritilmasin, real-time clamp)
    'form.day_of_month'(val) {
      if (val === '' || val === null || val === undefined) return
      const n = parseInt(val, 10)
      if (isNaN(n)) { this.$nextTick(() => { this.form.day_of_month = '' }); return }
      if (n > 31) this.form.day_of_month = 31
      else if (n < 1) this.form.day_of_month = 1
    }
  },
  async mounted() { await this.load() },
  methods: {
    goBack() { this.$router.push(this.localePath({ name: 'finance' })) },
    async load() {
      try {
        this.loading = true
        const res = await this.$api.getGaps()
        if (res && res.data && res.data.success) this.gaps = res.data.data
      } catch (e) { console.error('Gap load:', e) } finally { this.loading = false }
    },
    formatMoney(v) { return Number(v || 0).toLocaleString('uz-UZ').replace(/,/g,' ') },
    formatThousands(v) { if (v === '' || v == null) return ''; const n = Number(v); return isFinite(n) ? n.toLocaleString('uz-UZ').replace(/,/g,' ') : '' },
    onAmountInput(e) { const d = String(e.target.value).replace(/\D/g, ''); this.form.amount = d === '' ? '' : Number(d); e.target.value = this.formatThousands(this.form.amount) },
    fmtDate(d) { if (!d) return ''; const p = String(d).slice(0, 10).split('-'); return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : d },
    freqLabel(f) { return f === '10days' ? this.$t('finance.gap_freq_10') : (f === '15days' ? this.$t('finance.gap_freq_15') : this.$t('finance.gap_freq_monthly')) },
    statusLabel(s) {
      if (s === 'active') return this.$t('finance.gap_status_active')
      if (s === 'completed') return this.$t('finance.gap_status_completed')
      return this.$t('finance.gap_status_draft')
    },
    statusClass(s) {
      if (s === 'active') return 'bg-green-100 text-green-700'
      if (s === 'completed') return 'bg-gray-100 text-gray-500'
      return 'bg-amber-100 text-amber-700'
    },
    openCreate() {
      const now = new Date()
      const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      this.form = { name: '', amount: '', currency: 'UZS', day_of_month: 1, frequency: 'monthly', start_month_ym: ym }
      this.showCreate = true
    },
    openDetail(g) { this.$router.push(this.localePath({ name: 'finance-gap-id', params: { id: g.id } })) },
    // B30-8: o'chirish (tashkilotchi) — tasdiq modali orqali
    askDelete(g) { this.deleteTarget = g; this.showDelete = true },
    async confirmDelete() {
      if (!this.deleteTarget) return
      this.saving = true
      try {
        const res = await this.$api.removeGap(this.deleteTarget.id)
        if (res && res.data && res.data.success) {
          this.gaps = this.gaps.filter(x => x.id !== this.deleteTarget.id)
          this.showDelete = false
          this.deleteTarget = null
        }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.saving = false }
    },
    async submitCreate() {
      if (!String(this.form.name).trim()) { this.$toast.error(this.$t('finance.gap_name_required')); return }
      this.saving = true
      try {
        const payload = {
          name: this.form.name.trim(),
          amount: this.form.amount === '' || this.form.amount == null ? null : Number(this.form.amount),
          currency: this.form.currency, day_of_month: this.form.day_of_month || 1,
          frequency: this.form.frequency
        }
        // B34-8: eski (o'tgan) gapni yaratish — boshlanish oyini tanlash imkoni (faqat oylik)
        if (this.form.frequency === 'monthly' && this.form.start_month_ym) {
          const [sy, sm] = String(this.form.start_month_ym).split('-')
          const yy = parseInt(sy, 10), mm = parseInt(sm, 10)
          if (yy && mm) { payload.start_year = yy; payload.start_month = mm }
        }
        const res = await this.$api.createGap(payload)
        if (res && res.data && res.data.success) {
          this.showCreate = false
          this.$router.push(this.localePath({ name: 'finance-gap-id', params: { id: res.data.data.id } }))
        }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.saving = false }
    }
  }
}
</script>
