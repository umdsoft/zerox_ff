<template>
  <div class="family-budget pb-10">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-4">
      <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-teal-600 hover:shadow transition" aria-label="Orqaga">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl font-bold text-gray-900">{{ $t('finance.fb_title') }}</h1>
        <p class="text-gray-500 text-sm">{{ $t('finance.fb_subtitle') }}</p>
      </div>
    </div>

    <!-- B35-6: Sizga ulashilgan byudjetlar — o'z byudjetim / boshqa egalar o'rtasida almashish -->
    <div v-if="sharedWithMe.length" class="flex items-center gap-2 mb-4 flex-wrap">
      <span class="text-xs text-gray-500">{{ $t('finance.fb_view') }}:</span>
      <button @click="switchOwner(null)" :class="['px-3 py-1.5 rounded-full text-sm font-medium border transition', viewOwnerId === null ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200']">{{ $t('finance.fb_my_budget') }}</button>
      <button v-for="s in sharedWithMe" :key="'sw'+s.owner_id" @click="switchOwner(s.owner_id)" :class="['px-3 py-1.5 rounded-full text-sm font-medium border transition', viewOwnerId === s.owner_id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200']">{{ s.owner_name }}</button>
    </div>

    <!-- Oy navigatori -->
    <div class="flex items-center justify-center gap-3 mb-5">
      <button @click="changeMonth(-1)" class="w-9 h-9 rounded-full bg-white shadow-sm text-gray-600 hover:text-teal-600 flex items-center justify-center transition" aria-label="prev">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <span class="font-semibold text-gray-800 text-center" style="min-width: 150px;">{{ periodLabel }}</span>
      <button @click="changeMonth(1)" :disabled="isCurrentMonth" class="w-9 h-9 rounded-full bg-white shadow-sm text-gray-600 hover:text-teal-600 disabled:opacity-30 flex items-center justify-center transition" aria-label="next">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
    </div>

    <template v-else-if="data">
      <!-- Faqat ko'rish belgisi (ulashilgan byudjet) -->
      <div v-if="!data.can_manage" class="mb-4 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-2.5">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        {{ data.owner_name }} — {{ $t('finance.fb_readonly') }}
      </div>

      <!-- B36-3: desktopда 2-ustun — tahlil (chap 2/3), boshqaruv (o'ng-tepa 1/3) -->
      <div :class="data.can_manage ? 'lg:grid lg:grid-cols-3 lg:gap-5 lg:items-start' : ''">
        <!-- Tahlil ustuni -->
        <div :class="data.can_manage ? 'lg:col-span-2 lg:row-start-1' : ''">
      <template v-if="hasData">
        <!-- Hero: oila sof qoldig'i -->
        <div class="rounded-2xl p-6 text-white mb-5 relative overflow-hidden" style="background: linear-gradient(135deg, #14b8a6 0%, #059669 100%);">
          <div class="absolute top-0 right-0 w-52 h-52 bg-white opacity-10 rounded-full" style="transform: translate(30%, -35%);"></div>
          <div class="relative z-10">
            <p class="text-teal-50 text-sm flex items-center gap-2"><span>👨‍👩‍👧‍👦</span>{{ $t('finance.fb_net') }}</p>
            <p class="text-3xl md:text-4xl font-bold mt-1">{{ data.net_uzs >= 0 ? '+' : '' }}{{ formatMoney(data.net_uzs) }} <span class="text-xl font-semibold">UZS</span></p>
            <div class="flex gap-8 mt-5">
              <div>
                <p class="text-teal-50 text-xs">{{ $t('finance.fb_total_income') }}</p>
                <p class="text-lg font-bold">{{ formatMoney(data.total_income_uzs) }}</p>
              </div>
              <div>
                <p class="text-teal-50 text-xs">{{ $t('finance.fb_total_expense') }}</p>
                <p class="text-lg font-bold">{{ formatMoney(data.total_expense_uzs) }}</p>
              </div>
            </div>
            <div class="mt-4 h-2.5 rounded-full bg-white/25 overflow-hidden flex">
              <div class="h-full bg-white" :style="{ width: incomeVsExpensePct + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Daromad / Xarajat tarkibi (bo'lakni bosish → a'zolar kesimi) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><span>➕</span> {{ $t('finance.fb_income_composition') }}</h3>
            <p v-if="incomeCats.length" class="text-xs text-gray-400 mb-3">{{ $t('finance.fb_click_slice') }}</p>
            <div v-if="incomeCats.length">
              <client-only>
                <apexchart type="donut" :height="260" :options="incomeChartOptions" :series="incomeSeries" />
              </client-only>
              <div class="mt-4 space-y-2">
                <div v-for="(c, i) in incomeCats" :key="'ic'+i" @click="openCat('income', i)" class="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 rounded-lg px-1 py-0.5">
                  <div class="flex items-center min-w-0">
                    <span class="w-3 h-3 rounded-full mr-2 flex-shrink-0" :style="{ backgroundColor: incomeColors[i % incomeColors.length] }"></span>
                    <span class="text-gray-700 truncate">{{ c.icon ? c.icon + ' ' : '' }}{{ catName(c.name) }}</span>
                  </div>
                  <span class="font-medium text-gray-900 flex-shrink-0 ml-2">{{ formatMoney(c.total_uzs) }}</span>
                </div>
              </div>
            </div>
            <p v-else class="text-center py-8 text-gray-400 text-sm">{{ $t('finance.fb_no_income') }}</p>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><span>➖</span> {{ $t('finance.fb_expense_composition') }}</h3>
            <p v-if="expenseCats.length" class="text-xs text-gray-400 mb-3">{{ $t('finance.fb_click_slice') }}</p>
            <div v-if="expenseCats.length">
              <client-only>
                <apexchart type="donut" :height="260" :options="expenseChartOptions" :series="expenseSeries" />
              </client-only>
              <div class="mt-4 space-y-2">
                <div v-for="(c, i) in expenseCats" :key="'ec'+i" @click="openCat('expense', i)" class="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 rounded-lg px-1 py-0.5">
                  <div class="flex items-center min-w-0">
                    <span class="w-3 h-3 rounded-full mr-2 flex-shrink-0" :style="{ backgroundColor: expenseColors[i % expenseColors.length] }"></span>
                    <span class="text-gray-700 truncate">{{ c.icon ? c.icon + ' ' : '' }}{{ catName(c.name) }}</span>
                  </div>
                  <span class="font-medium text-gray-900 flex-shrink-0 ml-2">{{ formatMoney(c.total_uzs) }}</span>
                </div>
              </div>
            </div>
            <p v-else class="text-center py-8 text-gray-400 text-sm">{{ $t('finance.fb_no_expense') }}</p>
          </div>
        </div>

        <!-- A'zolar ulushi -->
        <div class="bg-white rounded-2xl p-6 shadow-sm mb-5">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span>👥</span> {{ $t('finance.fb_member_shares') }} <span class="text-sm font-normal text-gray-400">· {{ data.member_count }} {{ $t('finance.fb_people') }}</span></h3>
          <div class="space-y-4">
            <div v-for="m in memberRows" :key="'m'+m.id" class="p-4 rounded-2xl bg-gray-50">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-white" :style="{ backgroundColor: m.is_self ? '#0d9488' : '#6366f1' }">{{ initials(m.name) }}</div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 truncate">{{ m.name }}<span v-if="m.is_self" class="text-teal-600 text-sm font-normal"> · {{ $t('finance.fb_me') }}</span></p>
                  <p class="text-xs" :class="m.net_uzs >= 0 ? 'text-green-600' : 'text-red-600'">{{ m.net_uzs >= 0 ? '+' : '' }}{{ formatMoney(m.net_uzs) }} UZS</p>
                </div>
              </div>
              <div class="mb-2">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-500">{{ $t('finance.fb_income_share') }}</span>
                  <span class="text-gray-700 font-medium">{{ formatMoney(m.income_uzs) }} <span class="text-gray-400">· {{ m.income_pct }}%</span></span>
                </div>
                <div class="w-full h-2 rounded-full bg-gray-200 overflow-hidden"><div class="h-full rounded-full bg-green-500" :style="{ width: m.income_pct + '%' }"></div></div>
              </div>
              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-500">{{ $t('finance.fb_expense_share') }}</span>
                  <span class="text-gray-700 font-medium">{{ formatMoney(m.expense_uzs) }} <span class="text-gray-400">· {{ m.expense_pct }}%</span></span>
                </div>
                <div class="w-full h-2 rounded-full bg-gray-200 overflow-hidden"><div class="h-full rounded-full bg-red-500" :style="{ width: m.expense_pct + '%' }"></div></div>
              </div>
            </div>
          </div>
        </div>
      </template>

          <!-- Bo'sh holat (o'zi bilan ma'lumot yo'q) -->
          <div v-else class="bg-white rounded-2xl p-8 text-center shadow-sm">
            <span class="text-5xl">📊</span>
            <p class="text-gray-500 mt-3 max-w-md mx-auto">{{ $t('finance.fb_empty') }}</p>
          </div>
        </div><!-- /tahlil ustuni -->

        <!-- B36-3: Boshqaruv ustuni — desktopда o'ng-tepa (col 3) -->
        <div v-if="data.can_manage" class="lg:col-start-3 lg:row-start-1 space-y-5 mt-5 lg:mt-0">
      <!-- B35-6: A'zolarni boshqarish -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><span>⚙️</span> {{ $t('finance.fb_manage_members') }}</h3>
        <p class="text-sm text-gray-500 mb-4">{{ $t('finance.fb_manage_hint') }}</p>

        <!-- Qo'shilgan a'zolar -->
        <div v-if="includedMembers.length" class="space-y-2 mb-4">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">{{ $t('finance.fb_included') }}</p>
          <div v-for="m in includedMembers" :key="'inc'+m.id" class="flex items-center justify-between p-3 rounded-xl bg-teal-50">
            <div class="flex items-center gap-2 min-w-0">
              <div class="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{{ initials(m.name) }}</div>
              <span class="font-medium text-gray-800 truncate">{{ m.name }}</span>
            </div>
            <button @click="removeMember(m.id)" :disabled="busy" class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition flex-shrink-0">{{ $t('finance.fb_remove') }}</button>
          </div>
        </div>

        <!-- Qo'shish mumkin bo'lgan (kuzatuvdagi) a'zolar -->
        <div class="space-y-2">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide">{{ $t('finance.fb_available') }}</p>
          <div v-if="!availableMembers.length" class="text-sm text-gray-400 py-2">{{ $t('finance.fb_no_available') }}</div>
          <div v-for="m in availableMembers" :key="'av'+m.id" class="p-3 rounded-xl bg-gray-50">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                <div class="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{{ initials(m.name) }}</div>
                <span class="font-medium text-gray-800 truncate">{{ m.name }}</span>
              </div>
              <button v-if="m.can_add" @click="addMember(m.id)" :disabled="busy" class="px-3 py-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition flex-shrink-0">{{ $t('finance.fb_add') }}</button>
              <span v-else class="px-3 py-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg flex-shrink-0">{{ $t('finance.fb_locked') }}</span>
            </div>
            <p v-if="!m.can_add" class="text-xs text-amber-600 mt-1.5">⚠️ {{ $t('finance.fb_need_full') }}</p>
          </div>
        </div>
      </div>

      <!-- B35-6: Ko'rish huquqi (qo'shilgan a'zo bo'lsa) -->
      <div v-if="shareableMembers.length" class="bg-white rounded-2xl p-6 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><span>🔗</span> {{ $t('finance.fb_sharing') }}</h3>
        <p class="text-sm text-gray-500 mb-4">{{ $t('finance.fb_sharing_hint') }}</p>
        <div class="space-y-2">
          <label v-for="m in shareableMembers" :key="'sh'+m.id" class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer">
            <input type="checkbox" :value="m.id" v-model="shareSelection" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
            <span class="font-medium text-gray-800">{{ m.name }}</span>
          </label>
        </div>
        <button @click="saveSharing" :disabled="busy" class="w-full mt-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-semibold transition">{{ $t('finance.fb_save_sharing') }}</button>
      </div>
        </div><!-- /boshqaruv ustuni -->
      </div><!-- /2-ustun grid -->
    </template>

    <!-- Kategoriya → a'zolar kesimi modali -->
    <div v-if="showCatModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showCatModal = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-xl flex flex-col" style="max-height: 85vh;">
        <div class="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center min-w-0 gap-2">
            <span class="text-2xl flex-shrink-0">{{ (catModalCat && catModalCat.icon) || (catModalKind === 'income' ? '💰' : '📦') }}</span>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-gray-900 truncate">{{ catModalCat ? catName(catModalCat.name) : '' }}</h3>
              <p class="text-xs text-gray-400">{{ $t('finance.fb_cat_members') }}</p>
            </div>
          </div>
          <button @click="showCatModal = false" class="text-gray-400 hover:text-gray-600" aria-label="close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <span class="text-sm text-gray-500">{{ $t('finance.cat_total') }}</span>
          <span class="text-lg font-bold" :class="catModalKind === 'income' ? 'text-green-600' : 'text-red-600'">{{ formatMoney(catModalCat ? catModalCat.total_uzs : 0) }} UZS</span>
        </div>
        <div class="px-5 py-3 overflow-y-auto flex-1 min-h-0">
          <div v-for="(mm, i) in (catModalCat ? catModalCat.members : [])" :key="'cm'+i" class="mb-3">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="text-gray-700 font-medium">{{ mm.name }}</span>
              <span class="text-gray-700">{{ formatMoney(mm.total_uzs) }} <span class="text-gray-400">· {{ catPct(mm.total_uzs) }}%</span></span>
            </div>
            <div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden"><div class="h-full rounded-full" :class="catModalKind === 'income' ? 'bg-green-500' : 'bg-red-500'" :style="{ width: catPct(mm.total_uzs) + '%' }"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanceFamilyBudget',
  middleware: 'auth',
  data() {
    const now = new Date()
    return {
      loading: true,
      data: null,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      viewOwnerId: null, // null = mening byudjetim; aks holda ulashilgan egasi id
      busy: false,
      shareSelection: [],
      showCatModal: false,
      catModalKind: 'expense',
      catModalCat: null,
      incomeColors: ['#10b981', '#14b8a6', '#22c55e', '#84cc16', '#06b6d4', '#0ea5e9', '#3b82f6', '#8b5cf6'],
      expenseColors: ['#ef4444', '#f97316', '#f59e0b', '#ec4899', '#a855f7', '#6366f1', '#0ea5e9', '#64748b']
    }
  },
  computed: {
    hasData() {
      return this.data && (this.data.total_income_uzs || this.data.total_expense_uzs)
    },
    periodLabel() {
      const keys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
      return `${this.$t('months.' + keys[this.month - 1])} ${this.year}`
    },
    isCurrentMonth() {
      const now = new Date()
      return this.year === now.getFullYear() && this.month === (now.getMonth() + 1)
    },
    incomeCats() { return (this.data && this.data.income_by_category) || [] },
    expenseCats() { return (this.data && this.data.expense_by_category) || [] },
    incomeSeries() { return this.incomeCats.map(c => c.total_uzs) },
    expenseSeries() { return this.expenseCats.map(c => c.total_uzs) },
    availableMembers() { return (this.data && this.data.available_members) || [] },
    shareableMembers() { return (this.data && this.data.shareable_members) || [] },
    sharedWithMe() { return (this.data && this.data.shared_with_me) || [] },
    includedMembers() {
      // Qo'shilgan (self bo'lmagan) a'zolar — jamlanmadagi a'zolardan
      return ((this.data && this.data.members) || []).filter(m => !m.is_self)
    },
    incomeChartOptions() { return this.donutOptions(this.incomeCats.map(c => this.catName(c.name)), this.incomeColors, 'income') },
    expenseChartOptions() { return this.donutOptions(this.expenseCats.map(c => this.catName(c.name)), this.expenseColors, 'expense') },
    memberRows() {
      const ti = (this.data && this.data.total_income_uzs) || 0
      const te = (this.data && this.data.total_expense_uzs) || 0
      return ((this.data && this.data.members) || []).map(m => ({
        ...m,
        income_pct: ti > 0 ? Math.round(m.income_uzs / ti * 100) : 0,
        expense_pct: te > 0 ? Math.round(m.expense_uzs / te * 100) : 0
      }))
    },
    incomeVsExpensePct() {
      const ti = (this.data && this.data.total_income_uzs) || 0
      const te = (this.data && this.data.total_expense_uzs) || 0
      const denom = ti + te
      return denom > 0 ? Math.round(ti / denom * 100) : 50
    }
  },
  async mounted() { await this.load() },
  methods: {
    goBack() { this.$router.push(this.localePath({ name: 'finance-family' })) },
    donutOptions(labels, colors, kind) {
      return {
        chart: { type: 'donut', fontFamily: 'inherit', events: { dataPointSelection: (ev, ctx, cfg) => this.onSliceClick(kind, cfg) } },
        labels,
        colors,
        legend: { show: false },
        dataLabels: { enabled: true, formatter: (v) => v.toFixed(0) + '%' },
        tooltip: { y: { formatter: (v) => this.formatMoney(v) + ' UZS' } },
        plotOptions: { pie: { donut: { size: '62%' } } },
        responsive: [{ breakpoint: 480, options: { chart: { height: 240 } } }]
      }
    },
    async load() {
      this.loading = true
      try {
        const params = { year: this.year, month: this.month }
        if (this.viewOwnerId) params.owner_id = this.viewOwnerId
        const res = await this.$api.getFamilyBudget(params)
        if (res && res.data && res.data.success) {
          this.data = res.data.data
          this.shareSelection = (this.data.viewers || []).slice()
        }
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.loading = false }
    },
    switchOwner(ownerId) {
      if (this.viewOwnerId === ownerId) return
      this.viewOwnerId = ownerId
      this.load()
    },
    changeMonth(delta) {
      let m = this.month + delta, y = this.year
      if (m < 1) { m = 12; y -= 1 }
      if (m > 12) { m = 1; y += 1 }
      const now = new Date()
      if (y > now.getFullYear() || (y === now.getFullYear() && m > (now.getMonth() + 1))) return
      this.month = m; this.year = y
      this.load()
    },
    openCat(kind, idx) {
      const list = kind === 'income' ? this.incomeCats : this.expenseCats
      const cat = list[idx]
      if (!cat) return
      this.catModalKind = kind
      this.catModalCat = cat
      this.showCatModal = true
    },
    onSliceClick(kind, cfg) {
      const idx = cfg && cfg.dataPointIndex
      if (idx == null || idx < 0) return
      this.openCat(kind, idx)
    },
    catPct(v) {
      const total = (this.catModalCat && this.catModalCat.total_uzs) || 0
      return total > 0 ? Math.min(100, Math.round(v / total * 100)) : 0
    },
    async addMember(id) {
      this.busy = true
      try {
        const res = await this.$api.addFamilyBudgetMember(id)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.fb_added')); await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async removeMember(id) {
      this.busy = true
      try {
        const res = await this.$api.removeFamilyBudgetMember(id)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.fb_removed')); await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async saveSharing() {
      this.busy = true
      try {
        const res = await this.$api.setFamilyBudgetViewers(this.shareSelection)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.fb_sharing_saved')); await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    initials(name) { if (!name) return '?'; const p = String(name).trim().split(/\s+/); return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase() },
    formatMoney(v) { return Number(v || 0).toLocaleString('uz-UZ') },
    catName(name) {
      if (!name) return this.$t('finance.other')
      const key = `finance.${name}`
      const t = this.$t(key)
      return t === key ? name : t
    }
  }
}
</script>
