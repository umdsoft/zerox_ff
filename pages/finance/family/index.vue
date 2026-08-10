<template>
  <div class="family-page pb-10">
    <!-- Header: Orqaga (chap-yuqori, faqat strelka) -->
    <div class="flex items-center gap-3 mb-5">
      <button
        @click="goBack"
        class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-indigo-600 hover:shadow transition"
        aria-label="Orqaga"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div class="flex-1">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.family_title') }}</h1>
        <p class="text-gray-500 text-sm mt-0.5">{{ $t('finance.family_subtitle') }}</p>
      </div>
      <button
        @click="openInvite"
        class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        {{ $t('finance.family_add_member') }}
      </button>
    </div>

    <!-- Hero -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-7 text-white mb-6 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-56 h-56 bg-white opacity-10 rounded-full -translate-y-1/3 translate-x-1/4"></div>
      <div class="relative z-10 flex items-start gap-4">
        <span class="text-5xl">👨‍👩‍👧‍👦</span>
        <div>
          <h2 class="text-xl md:text-2xl font-bold">{{ $t('finance.family_hero') }}</h2>
          <p class="text-indigo-100 mt-1 max-w-2xl">{{ $t('finance.family_hero_desc') }}</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>

    <template v-else>
      <!-- Kelgan takliflar (pending, member) -->
      <section v-if="pendingReceived.length" class="mb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>📨</span> {{ $t('finance.family_received_title') }}
          <span class="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{{ pendingReceived.length }}</span>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="link in pendingReceived" :key="'p'+link.id" class="bg-white rounded-2xl p-5 shadow-sm border border-amber-100">
            <div class="flex items-start gap-3">
              <div class="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                {{ initials(link.owner_name) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 truncate">{{ link.owner_name || '—' }}</p>
                <p v-if="link.relation_label" class="text-sm text-gray-500">{{ link.relation_label }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ permsSummary(link) }}</p>
              </div>
            </div>
            <div class="flex gap-2 mt-4">
              <button @click="respond(link, 'accept')" :disabled="busyId===link.id" class="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg font-semibold text-sm transition">{{ $t('finance.family_accept') }}</button>
              <button @click="respond(link, 'reject')" :disabled="busyId===link.id" class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 rounded-lg font-semibold text-sm transition">{{ $t('finance.family_reject') }}</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Kuzatuvimdagi a'zolar (active, member — men owner moliyasini ko'raman) -->
      <section v-if="activeReceived.length" class="mb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><span>👀</span> {{ $t('finance.family_active_title') }}</h3>
        <p class="text-sm text-gray-500 mb-3">{{ $t('finance.family_active_hint') }}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="link in activeReceived" :key="'a'+link.id" class="bg-white rounded-2xl p-5 shadow-sm">
            <div class="flex items-start gap-3">
              <div class="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                {{ initials(link.owner_name) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 truncate">{{ link.owner_name || '—' }}</p>
                <p v-if="link.relation_label" class="text-sm text-gray-500">{{ link.relation_label }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ permsSummary(link) }}</p>
              </div>
            </div>
            <!-- Menga belgilangan oylik limit -->
            <div v-if="link.monthly_limit" class="mt-3 text-xs bg-indigo-50 text-indigo-700 rounded-lg px-3 py-2">
              💸 {{ $t('finance.family_limit_set') }}: <b>{{ formatMoney(link.monthly_limit) }} {{ link.limit_currency }}</b>
            </div>
            <div class="flex gap-2 mt-4">
              <button @click="openOverview(link)" class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition">{{ $t('finance.family_view') }}</button>
              <button @click="askRemove(link)" class="px-3 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-lg text-sm transition" :aria-label="$t('finance.family_remove')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Men qo'shgan a'zolar (owner) -->
      <section class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2"><span>🔗</span> {{ $t('finance.family_my_members_title') }}</h3>
          <button @click="openInvite" class="sm:hidden inline-flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            {{ $t('finance.family_add_member') }}
          </button>
        </div>

        <div v-if="!owned.length" class="bg-white rounded-2xl p-8 shadow-sm text-center">
          <span class="text-4xl">🫂</span>
          <p class="font-semibold text-gray-700 mt-2">{{ $t('finance.family_empty_owned') }}</p>
          <p class="text-sm text-gray-400 mt-1">{{ $t('finance.family_empty_hint') }}</p>
          <button @click="openInvite" class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition">
            {{ $t('finance.family_add_member') }}
          </button>
        </div>

        <div v-else class="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
          <div v-for="link in owned" :key="'o'+link.id" class="flex items-center gap-3 p-4 hover:bg-gray-50 transition">
            <div class="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
              {{ initials(link.member_name) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="font-bold text-gray-900 truncate">{{ link.member_name || link.member_phone || '—' }}</p>
                <span :class="statusClass(link.status)" class="text-xs font-semibold px-2 py-0.5 rounded-full">{{ statusLabel(link.status) }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-0.5">
                <span v-if="link.relation_label">{{ link.relation_label }} · </span>{{ permsSummary(link) }}
                <span v-if="link.monthly_limit"> · 💸 {{ formatMoney(link.monthly_limit) }} {{ link.limit_currency }}</span>
              </p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button @click="openEdit(link)" class="px-3 py-2 text-gray-500 hover:text-indigo-600 rounded-lg text-sm transition" :aria-label="$t('finance.family_edit')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button @click="askRemove(link)" class="px-3 py-2 text-gray-400 hover:text-red-600 rounded-lg text-sm transition" :aria-label="$t('finance.family_remove')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ===== Taklif / Tahrirlash modali ===== -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showForm = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl max-h-[92vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ editing ? $t('finance.family_edit_title') : $t('finance.family_invite_title') }}</h3>

        <!-- Telefon (faqat taklifda) -->
        <div v-if="!editing" class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_phone') }}</label>
          <input v-model="form.phone" type="tel" :placeholder="$t('finance.family_phone_ph')" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_relation') }}</label>
          <input v-model="form.relation_label" type="text" :placeholder="$t('finance.family_relation_ph')" maxlength="50" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
        </div>

        <!-- Ruxsatlar -->
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_perms') }}</label>
          <p class="text-xs text-gray-400 mb-2">{{ $t('finance.family_perm_hint') }}</p>
          <div class="space-y-2">
            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
              <input type="checkbox" v-model="form.can_view_finance" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
              <span class="text-sm text-gray-700">💵 {{ $t('finance.family_perm_finance') }}</span>
            </label>
            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
              <input type="checkbox" v-model="form.can_view_debts" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
              <span class="text-sm text-gray-700">🤝 {{ $t('finance.family_perm_debts') }}</span>
            </label>
            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
              <input type="checkbox" v-model="form.can_view_goals" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
              <span class="text-sm text-gray-700">🎯 {{ $t('finance.family_perm_goals') }}</span>
            </label>
          </div>
        </div>

        <!-- Oylik limit -->
        <div class="mb-5">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_limit') }}</label>
          <p class="text-xs text-gray-400 mb-2">{{ $t('finance.family_limit_hint') }}</p>
          <div class="flex gap-2">
            <input v-model="form.monthly_limit" type="number" min="0" placeholder="0" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            <select v-model="form.limit_currency" class="px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
              <option value="UZS">UZS</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="showForm = false" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition">{{ $t('common.cancel') }}</button>
          <button @click="submitForm" :disabled="saving" class="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl font-semibold transition">
            {{ editing ? $t('common.save') : $t('finance.family_invite_btn') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===== Overview modali (a'zo owner moliyasini ko'radi) ===== -->
    <div v-if="showOverview" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showOverview = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl max-h-[92vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">{{ overviewName }} — {{ $t('finance.family_overview_title') }}</h3>
          <button @click="showOverview = false" class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div v-if="overviewLoading" class="flex justify-center py-10">
          <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="overview" class="space-y-4">
          <!-- Moliya -->
          <div v-if="overview.permissions.finance && overview.finance">
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-green-50 rounded-xl p-4">
                <p class="text-xs text-green-700 font-semibold">{{ $t('finance.family_ov_income') }}</p>
                <p v-for="c in overview.finance.income_by_currency" :key="'i'+c.currency" class="text-base font-bold text-green-800">{{ formatMoney(c.total) }} {{ c.currency }}</p>
                <p v-if="!overview.finance.income_by_currency.length" class="text-base font-bold text-green-800">0 UZS</p>
              </div>
              <div class="bg-red-50 rounded-xl p-4">
                <p class="text-xs text-red-700 font-semibold">{{ $t('finance.family_ov_expense') }}</p>
                <p v-for="c in overview.finance.expense_by_currency" :key="'e'+c.currency" class="text-base font-bold text-red-800">{{ formatMoney(c.total) }} {{ c.currency }}</p>
                <p v-if="!overview.finance.expense_by_currency.length" class="text-base font-bold text-red-800">0 UZS</p>
              </div>
            </div>
          </div>
          <div v-else class="bg-gray-50 rounded-xl p-4 text-sm text-gray-400 flex items-center gap-2">🔒 {{ $t('finance.family_ov_no_perm') }} ({{ $t('finance.family_perm_finance') }})</div>

          <!-- Qarzlar -->
          <div v-if="overview.permissions.debts && overview.debts" class="bg-white border border-gray-100 rounded-xl p-4">
            <p class="text-sm font-semibold text-gray-700 mb-2">🤝 {{ $t('finance.family_ov_debts') }}</p>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">{{ $t('finance.family_ov_borrowed') }}</span>
              <span class="font-bold text-gray-900">{{ formatMoney(overview.debts.borrowed_total) }} UZS</span>
            </div>
            <div class="flex justify-between text-sm mt-1">
              <span class="text-gray-500">{{ $t('finance.family_ov_lent') }}</span>
              <span class="font-bold text-gray-900">{{ formatMoney(overview.debts.lent_total) }} UZS</span>
            </div>
          </div>

          <!-- Maqsadlar -->
          <div v-if="overview.permissions.goals && overview.goals" class="bg-white border border-gray-100 rounded-xl p-4">
            <p class="text-sm font-semibold text-gray-700 mb-2">🎯 {{ $t('finance.family_ov_goals') }} ({{ overview.goals.count }})</p>
            <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-indigo-500 h-2.5 rounded-full" :style="{ width: goalPct + '%' }"></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ formatMoney(overview.goals.current_total) }} / {{ formatMoney(overview.goals.target_total) }} UZS</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== O'chirish tasdig'i (root modal — transform tuzog'idan qochish) ===== -->
    <div v-if="showRemove" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showRemove = false"></div>
      <div class="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
        <div class="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" /></svg>
        </div>
        <p class="text-gray-700 mb-5">{{ $t('finance.family_confirm_remove') }}</p>
        <div class="flex gap-2">
          <button @click="showRemove = false" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition">{{ $t('common.cancel') }}</button>
          <button @click="confirmRemove" :disabled="saving" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl font-semibold transition">{{ $t('finance.family_remove') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanceFamily',
  middleware: 'auth',
  data() {
    return {
      loading: true,
      owned: [],
      received: [],
      busyId: null,
      // Form (taklif/tahrirlash)
      showForm: false,
      editing: null, // null=taklif, aks holda link obyekti
      saving: false,
      form: this.blankForm(),
      // Overview
      showOverview: false,
      overviewLoading: false,
      overview: null,
      overviewName: '',
      // O'chirish
      showRemove: false,
      removeTarget: null
    }
  },
  computed: {
    pendingReceived() { return this.received.filter(r => r.status === 'pending') },
    activeReceived() { return this.received.filter(r => r.status === 'active') },
    goalPct() {
      if (!this.overview || !this.overview.goals || !this.overview.goals.target_total) return 0
      return Math.min(100, Math.round((this.overview.goals.current_total / this.overview.goals.target_total) * 100))
    }
  },
  async mounted() {
    await this.load()
  },
  methods: {
    blankForm() {
      return {
        phone: '',
        relation_label: '',
        can_view_finance: true,
        can_view_debts: false,
        can_view_goals: false,
        monthly_limit: '',
        limit_currency: 'UZS'
      }
    },
    goBack() {
      this.$router.push(this.localePath({ name: 'finance' }))
    },
    async load() {
      try {
        this.loading = true
        const res = await this.$api.getFamily()
        if (res?.data?.success) {
          this.owned = res.data.data.owned || []
          this.received = res.data.data.received || []
        }
      } catch (e) {
        console.error('Family load error:', e)
      } finally {
        this.loading = false
      }
    },
    initials(name) {
      if (!name) return '?'
      const parts = String(name).trim().split(/\s+/)
      return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase()
    },
    formatMoney(v) {
      return Number(v || 0).toLocaleString('uz-UZ')
    },
    permsSummary(link) {
      const p = []
      if (link.can_view_finance) p.push('💵')
      if (link.can_view_debts) p.push('🤝')
      if (link.can_view_goals) p.push('🎯')
      return p.length ? p.join(' ') : '—'
    },
    statusLabel(s) {
      if (s === 'active') return this.$t('finance.family_status_active')
      if (s === 'rejected') return this.$t('finance.family_status_rejected')
      return this.$t('finance.family_status_pending')
    },
    statusClass(s) {
      if (s === 'active') return 'bg-green-100 text-green-700'
      if (s === 'rejected') return 'bg-red-100 text-red-600'
      return 'bg-amber-100 text-amber-700'
    },
    openInvite() {
      this.editing = null
      this.form = this.blankForm()
      this.showForm = true
    },
    openEdit(link) {
      this.editing = link
      this.form = {
        phone: link.member_phone || '',
        relation_label: link.relation_label || '',
        can_view_finance: !!link.can_view_finance,
        can_view_debts: !!link.can_view_debts,
        can_view_goals: !!link.can_view_goals,
        monthly_limit: link.monthly_limit != null ? String(link.monthly_limit) : '',
        limit_currency: link.limit_currency || 'UZS'
      }
      this.showForm = true
    },
    async submitForm() {
      // Taklifda telefon majburiy
      if (!this.editing && !String(this.form.phone).trim()) {
        this.$toast.error(this.$t('finance.family_invite_err_phone'))
        return
      }
      this.saving = true
      try {
        const payload = {
          relation_label: this.form.relation_label,
          can_view_finance: this.form.can_view_finance,
          can_view_debts: this.form.can_view_debts,
          can_view_goals: this.form.can_view_goals,
          monthly_limit: this.form.monthly_limit === '' ? null : Number(this.form.monthly_limit),
          limit_currency: this.form.limit_currency
        }
        if (this.editing) {
          const res = await this.$api.updateFamilyMember(this.editing.id, payload)
          if (res?.data?.success) {
            this.$toast.success(this.$t('finance.family_updated'))
            this.showForm = false
            await this.load()
          }
        } else {
          payload.phone = String(this.form.phone).trim()
          const res = await this.$api.inviteFamilyMember(payload)
          if (res?.data?.success) {
            this.$toast.success(this.$t('finance.family_invite_sent'))
            this.showForm = false
            await this.load()
          }
        }
      } catch (e) {
        const msg = e?.response?.data?.message || this.$t('common.error')
        this.$toast.error(msg)
      } finally {
        this.saving = false
      }
    },
    async respond(link, action) {
      this.busyId = link.id
      try {
        const res = await this.$api.respondFamilyInvite(link.id, action)
        if (res?.data?.success) {
          this.$toast.success(action === 'accept' ? this.$t('finance.family_accepted') : this.$t('finance.family_rejected_done'))
          await this.load()
        }
      } catch (e) {
        const msg = e?.response?.data?.message || this.$t('common.error')
        this.$toast.error(msg)
      } finally {
        this.busyId = null
      }
    },
    async openOverview(link) {
      this.overviewName = link.owner_name || '—'
      this.overview = null
      this.showOverview = true
      this.overviewLoading = true
      try {
        const res = await this.$api.getFamilyOverview(link.id)
        if (res?.data?.success) {
          this.overview = res.data.data
        }
      } catch (e) {
        const msg = e?.response?.data?.message || this.$t('common.error')
        this.$toast.error(msg)
        this.showOverview = false
      } finally {
        this.overviewLoading = false
      }
    },
    askRemove(link) {
      this.removeTarget = link
      this.showRemove = true
    },
    async confirmRemove() {
      if (!this.removeTarget) return
      this.saving = true
      try {
        const res = await this.$api.removeFamilyMember(this.removeTarget.id)
        if (res?.data?.success) {
          this.$toast.success(this.$t('finance.family_removed'))
          this.showRemove = false
          this.removeTarget = null
          await this.load()
        }
      } catch (e) {
        const msg = e?.response?.data?.message || this.$t('common.error')
        this.$toast.error(msg)
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
