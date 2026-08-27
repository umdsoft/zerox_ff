<template>
  <div class="goals-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'finance' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.goals') }}</h1>
      </div>
      <nuxt-link
        :to="localePath({ name: 'finance-goals-add' })"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        {{ $t('finance.add_goal') }}
      </nuxt-link>
    </div>

    <!-- Overall Progress -->
    <div class="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-purple-100">{{ $t('finance.overall_progress') }}</p>
          <p class="text-4xl font-bold mt-2">{{ stats.overall_progress || 0 }}%</p>
        </div>
        <div class="mt-4 md:mt-0 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div v-for="(l, i) in goalTargetLines" :key="i" :class="i === 0 ? 'text-lg md:text-xl font-bold leading-tight' : 'text-xs opacity-80'">{{ l }}</div>
            <p class="text-purple-200 text-sm mt-0.5">{{ $t('finance.total_target') }}</p>
          </div>
          <div>
            <div v-for="(l, i) in goalSavedLines" :key="i" :class="i === 0 ? 'text-lg md:text-xl font-bold leading-tight' : 'text-xs opacity-80'">{{ l }}</div>
            <p class="text-purple-200 text-sm mt-0.5">{{ $t('finance.saved') }}</p>
          </div>
          <div>
            <p class="text-2xl md:text-3xl font-bold">{{ stats.active_count || 0 }}</p>
            <p class="text-purple-200 text-sm">{{ $t('finance.active') }}</p>
          </div>
          <div>
            <p class="text-2xl md:text-3xl font-bold">{{ stats.completed_count || 0 }}</p>
            <p class="text-purple-200 text-sm">{{ $t('finance.completed') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-2xl p-4 shadow-sm mb-6">
      <div class="flex flex-wrap gap-3">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeStatus = tab.value"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          :class="activeStatus === tab.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Goals List (faol — Yuqori/O'rta/Past bo'yicha guruhlangan) -->
    <div v-for="group in displayGroups" :key="group.key" class="mb-6">
      <h3 v-if="group.label" class="text-base font-bold text-gray-800 mb-3 flex items-center">
        <span class="w-3 h-3 rounded-full mr-2" :class="priorityDot(group.key)"></span>{{ group.label }}
        <span class="ml-2 text-sm font-normal text-gray-400">({{ group.goals.length }})</span>
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="goal in group.goals"
          :key="goal.id"
          class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <span class="text-3xl mr-3">{{ goal.icon || '🎯' }}</span>
              <div>
                <h3 class="font-bold text-gray-900">{{ goal.title }}</h3>
                <p v-if="goal.deadline" class="text-sm text-gray-500">
                  {{ $t('finance.deadline') }}: {{ formatDate(goal.deadline) }}
                </p>
              </div>
            </div>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="getStatusClass(goal.status)"
            >
              {{ getStatusLabel(goal.status) }}
            </span>
          </div>

          <!-- Progress (o'z valyutasida) -->
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600">{{ formatMoney(goal.current_amount, false, goal.currency) }}</span>
              <span class="font-medium text-gray-900">{{ formatMoney(goal.target_amount, false, goal.currency) }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                class="h-3 rounded-full transition-all"
                :style="{ width: Math.min(goal.progress, 100) + '%', backgroundColor: goal.color || '#8B5CF6' }"
              ></div>
            </div>
            <p class="text-right text-sm text-gray-500 mt-1">{{ goal.progress }}%</p>
          </div>

          <!-- Days Left -->
          <div v-if="goal.deadline && goal.status === 'active'" class="mb-4">
            <p class="text-sm" :class="getDaysLeftClass(goal.days_remaining)">
              <span v-if="goal.days_remaining > 0">
                {{ goal.days_remaining }} {{ $t('finance.days_left') }}
              </span>
              <span v-else-if="goal.days_remaining === 0">
                {{ $t('finance.due_today') }}
              </span>
              <span v-else>
                {{ Math.abs(goal.days_remaining) }} {{ $t('finance.days_overdue') }}
              </span>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              v-if="goal.status === 'active'"
              @click="openAddAmount(goal)"
              class="flex-1 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-medium transition-colors"
            >
              {{ $t('finance.add_money') }}
            </button>
            <button
              @click="openDetail(goal)"
              class="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              {{ $t('common.details') }}
            </button>
            <button
              @click="openDelete(goal)"
              :title="$t('common.delete')"
              :aria-label="$t('common.delete')"
              class="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-xl font-medium transition-colors flex items-center justify-center"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!goals.length" class="bg-white rounded-2xl p-12 shadow-sm text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('finance.no_goals') }}</h3>
      <p class="text-gray-500 mb-4">{{ $t('finance.no_goals_desc') }}</p>
      <nuxt-link
        :to="localePath({ name: 'finance-goals-add' })"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        {{ $t('finance.add_first_goal') }}
      </nuxt-link>
    </div>

    <!-- Add Amount Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showAddModal = false"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('finance.add_to_goal') }}: {{ selectedGoal?.title }}</h3>
        <form @submit.prevent="addAmount">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.amount') }}</label>
            <input
              :value="fmtThousands(addAmountValue)"
              @input="onAmountInput"
              type="text"
              inputmode="numeric"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              placeholder="100 000"
            />
          </div>
          <div class="flex gap-3">
            <button
              type="button"
              @click="showAddModal = false"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="addAmountLoading"
              class="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl font-medium"
            >
              {{ addAmountLoading ? $t('common.loading') : $t('finance.add') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Detail Modal (Batafsil) -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showDetailModal = false"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-md">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <span class="text-4xl mr-3">{{ detailGoal?.icon || '🎯' }}</span>
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ detailGoal?.title }}</h3>
              <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="getStatusClass(detailGoal?.status)">
                {{ getStatusLabel(detailGoal?.status) }}
              </span>
            </div>
          </div>
          <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <p v-if="detailGoal?.description" class="text-sm text-gray-600 mb-4">{{ detailGoal.description }}</p>

        <!-- Progress -->
        <div class="mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">{{ formatMoney(detailGoal?.current_amount, false, detailGoal?.currency) }}</span>
            <span class="font-medium text-gray-900">{{ formatMoney(detailGoal?.target_amount, false, detailGoal?.currency) }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="h-3 rounded-full" :style="{ width: Math.min(detailGoal?.progress || 0, 100) + '%', backgroundColor: detailGoal?.color || '#8B5CF6' }"></div>
          </div>
          <p class="text-right text-sm text-gray-500 mt-1">{{ detailGoal?.progress || 0 }}%</p>
        </div>

        <div class="grid grid-cols-2 gap-3 text-sm mb-4">
          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-gray-500">{{ $t('finance.remaining_amount') }}</p>
            <p class="font-semibold text-gray-900">{{ formatMoney(Math.max(0, (detailGoal?.target_amount || 0) - (detailGoal?.current_amount || 0)), false, detailGoal?.currency) }}</p>
          </div>
          <div v-if="detailGoal?.deadline" class="bg-gray-50 rounded-xl p-3">
            <p class="text-gray-500">{{ $t('finance.deadline') }}</p>
            <p class="font-semibold text-gray-900">{{ formatDate(detailGoal.deadline) }}</p>
          </div>
        </div>

        <div v-if="detailGoal && goalPlan(detailGoal)" class="bg-purple-50 rounded-xl p-3 text-sm mb-4">
          <p class="text-purple-700 font-medium flex items-center">
            <span class="mr-1.5">📅</span>{{ goalPlan(detailGoal).label }}:
            <span class="ml-1">{{ formatMoney(goalPlan(detailGoal).amount, false, detailGoal.currency) }}</span>
          </p>
        </div>

        <!-- Hissalar tarixi: boshlang'ich summa + har bir "Pul qo'shish", sana/vaqt bo'yicha -->
        <div v-if="detailContributions.length" class="mb-4">
          <p class="text-sm font-semibold text-gray-700 mb-2">{{ $t('finance.contributions_history') }}</p>
          <div class="space-y-2 max-h-52 overflow-y-auto pr-1">
            <div
              v-for="c in detailContributions"
              :key="c.id"
              class="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 text-sm"
            >
              <div class="flex items-center min-w-0">
                <span class="text-lg mr-2 flex-shrink-0">{{ c.type === 'initial' ? '🏁' : '➕' }}</span>
                <div class="min-w-0">
                  <p class="text-gray-800 truncate">{{ c.type === 'initial' ? $t('finance.initial_amount') : $t('finance.money_added') }}</p>
                  <p class="text-xs text-gray-400">{{ formatDateTime(c.created_at) }}</p>
                </div>
              </div>
              <span class="font-semibold text-green-600 flex-shrink-0 ml-2">+{{ formatMoney(c.amount, false, c.currency) }}</span>
            </div>
            <!-- Jami yig'ilgan -->
            <div class="flex items-center justify-between px-3 pt-2 mt-1 border-t border-gray-100 text-sm">
              <span class="font-semibold text-gray-700">{{ $t('finance.saved') }}</span>
              <span class="font-bold text-gray-900">{{ formatMoney(detailGoal?.current_amount, false, detailGoal?.currency) }}</span>
            </div>
          </div>
        </div>

        <button
          @click="showDetailModal = false"
          class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium"
        >
          {{ $t('common.close') || 'OK' }}
        </button>
      </div>
    </div>

    <!-- Delete Confirm Modal (O'chirishni tasdiqlash) -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showDeleteModal = false"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-md">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <p
          class="text-center text-gray-700 mb-6"
          v-html="confirmDeleteHtml"
        ></p>
        <div class="flex gap-3">
          <button
            type="button"
            @click="showDeleteModal = false"
            class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="button"
            @click="confirmDelete"
            :disabled="deleteLoading"
            class="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-medium"
          >
            {{ deleteLoading ? $t('common.loading') : $t('finance.yes_delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoalsPage',
  middleware: 'auth',

  data() {
    return {
      goals: [],
      stats: {
        active_count: 0,
        completed_count: 0,
        total_saved: 0,
        overall_progress: 0
      },
      activeStatus: 'active',
      showAddModal: false,
      selectedGoal: null,
      addAmountValue: '',
      addAmountLoading: false,
      showDetailModal: false,
      detailGoal: null,
      showDeleteModal: false,
      deleteTarget: null,
      deleteLoading: false,
      loading: true
    }
  },

  computed: {
    // VULN-024: tarjima matni ishonchli <b> markupни o'z ichiga oladi, lekin
    // {title} foydalanuvchi nazoratidagi qiymat — uni v-html'ga berishдан oldin
    // HTML-escape qilamiz (vue-i18n interpolatsiyasi default'да escape qilmaydi).
    confirmDeleteHtml() {
      const raw = (this.deleteTarget && this.deleteTarget.title) || '';
      const esc = String(raw).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
      }[c]));
      return this.$t('finance.confirm_delete_goal', { title: esc });
    },
    tabs() {
      return [
        { value: 'active', label: this.$t('finance.active') },
        { value: 'completed', label: this.$t('finance.completed') },
        { value: 'all', label: this.$t('common.all') }
      ]
    },

    // Faol maqsadlar Yuqori/O'rta/Past bo'yicha guruhlanadi; boshqa filtrlarda bitta ro'yxat
    displayGroups() {
      if (this.activeStatus !== 'active') {
        return [{ key: 'all', label: '', goals: this.goals }]
      }
      const order = [
        { key: 'high', label: this.$t('finance.priority_high') },
        { key: 'medium', label: this.$t('finance.priority_medium') },
        { key: 'low', label: this.$t('finance.priority_low') }
      ]
      return order
        .map(o => ({ ...o, goals: this.goals.filter(g => (g.priority || 'medium') === o.key) }))
        .filter(g => g.goals.length)
    },

    // Header: jami maqsad / yig'ilgan — valyuta bo'yicha (UZS + USD alohida)
    goalTargetLines() { return this.currencyGoalLines('target') },
    goalSavedLines() { return this.currencyGoalLines('saved') },

    // Detal modal uchun hissalar tarixi (getById dan)
    detailContributions() {
      return (this.detailGoal && this.detailGoal.contributions) || []
    }
  },

  watch: {
    activeStatus() {
      this.loadGoals()
    }
  },

  async mounted() {
    await Promise.all([
      this.loadGoals(),
      this.loadStats()
    ])
  },

  methods: {
    async loadGoals() {
      try {
        this.loading = true
        const params = {}
        if (this.activeStatus !== 'all') {
          params.status = this.activeStatus
        }
        const res = await this.$api.getFinancialGoals(params)
        if (res?.data?.success) {
          this.goals = res.data.data.map(g => ({
            ...g,
            progress: g.target_amount > 0 ? Math.round((g.current_amount / g.target_amount) * 100) : 0,
            days_remaining: g.deadline ? this.calculateDaysRemaining(g.deadline) : null
          }))
        }
      } catch (error) {
        console.error('Load goals error:', error)
      } finally {
        this.loading = false
      }
    },

    async loadStats() {
      try {
        const res = await this.$api.getGoalStats()
        if (res?.data?.success) {
          this.stats = res.data.data
        }
      } catch (error) {
        console.error('Load stats error:', error)
      }
    },

    openAddAmount(goal) {
      this.selectedGoal = goal
      this.addAmountValue = ''
      this.showAddModal = true
    },

    // Input uchun probelli format (1500000 -> "1 500 000")
    fmtThousands(v) {
      if (v === '' || v == null) return ''
      const n = Number(v)
      if (!isFinite(n)) return ''
      return n.toLocaleString('uz-UZ').replace(/,/g,' ')
    },
    onAmountInput(e) {
      const digits = String(e.target.value).replace(/\D/g, '')
      this.addAmountValue = digits === '' ? '' : Number(digits)
    },

    async openDetail(goal) {
      // Avval ro'yxatdagi ma'lumot bilan ochamiz (tez), so'ng to'liq (hissalar bilan) yuklaymiz
      this.detailGoal = goal
      this.showDetailModal = true
      try {
        const res = await this.$api.getGoalById(goal.id)
        if (res?.data?.success && res.data.data) {
          const g = res.data.data
          this.detailGoal = {
            ...g,
            progress: g.target_amount > 0 ? Math.round((g.current_amount / g.target_amount) * 100) : 0,
            days_remaining: g.deadline ? this.calculateDaysRemaining(g.deadline) : null
          }
        }
      } catch (error) {
        // getById xato bo'lsa ham, detal ro'yxat ma'lumoti bilan ko'rinadi (hissalarsiz)
        console.error('Load goal detail error:', error)
      }
    },

    // Maqsad rejasi: bir oyga (30 kundan kam bo'lsa bir haftaga) qo'shish kerak bo'lgan minimum
    goalPlan(goal) {
      if (!goal) return null
      const remaining = Math.max(0, (Number(goal.target_amount) || 0) - (Number(goal.current_amount) || 0))
      if (!remaining || !goal.deadline) return null
      const days = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
      if (days <= 0) return null
      if (days < 30) {
        const weeks = Math.max(1, Math.ceil(days / 7))
        return { label: this.$t('finance.per_week_needed'), amount: Math.ceil(remaining / weeks) }
      }
      const months = Math.max(1, Math.round(days / 30))
      return { label: this.$t('finance.per_month_needed'), amount: Math.ceil(remaining / months) }
    },

    priorityDot(key) {
      return { high: 'bg-red-500', medium: 'bg-yellow-500', low: 'bg-gray-400' }[key] || 'bg-gray-400'
    },

    // stats.by_currency dan valyuta bo'yicha qatorlar (UZS birinchi)
    currencyGoalLines(field) {
      const arr = (this.stats.by_currency || []).filter(x => Number(x[field]))
      if (!arr.length) return ['0 UZS']
      arr.sort((a, b) => (a.currency === 'UZS' ? -1 : b.currency === 'UZS' ? 1 : 0))
      return arr.map(x => this.formatMoney(x[field], true, x.currency))
    },

    async addAmount() {
      try {
        this.addAmountLoading = true
        const res = await this.$api.addGoalAmount(this.selectedGoal.id, {
          amount: this.addAmountValue
        })
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.amount_added'))
          this.showAddModal = false
          await this.loadGoals()
          await this.loadStats()
        }
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.addAmountLoading = false
      }
    },

    openDelete(goal) {
      this.deleteTarget = goal
      this.showDeleteModal = true
    },

    async confirmDelete() {
      if (!this.deleteTarget) return
      try {
        this.deleteLoading = true
        const res = await this.$api.deleteGoal(this.deleteTarget.id)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.goal_deleted'))
          this.showDeleteModal = false
          this.deleteTarget = null
          await this.loadGoals()
          await this.loadStats()
        }
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.deleteLoading = false
      }
    },

    calculateDaysRemaining(deadline) {
      const diff = new Date(deadline) - new Date()
      return Math.ceil(diff / (1000 * 60 * 60 * 24))
    },

    formatMoney(value, short = false, currency = 'UZS') {
      const cur = currency || 'UZS'
      if (!value) return '0 ' + cur
      if (short && value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M ' + cur
      }
      return Number(value).toLocaleString('uz-UZ').replace(/,/g,' ') + ' ' + cur
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('uz-UZ')
    },

    // Sana + vaqt (Toshkent +05) — hissa yozuvlari uchun
    formatDateTime(dt) {
      if (!dt) return '-'
      const d = new Date(dt)
      if (isNaN(d)) return '-'
      try {
        const date = d.toLocaleDateString('uz-UZ', { timeZone: 'Asia/Tashkent' })
        const time = d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tashkent' })
        return `${date} ${time}`
      } catch (e) {
        return d.toLocaleDateString('uz-UZ')
      }
    },

    getStatusClass(status) {
      const classes = {
        active: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
        paused: 'bg-yellow-100 text-yellow-700'
      }
      return classes[status] || 'bg-gray-100 text-gray-700'
    },

    getStatusLabel(status) {
      const labels = {
        active: this.$t('finance.status_active'),
        completed: this.$t('finance.status_completed'),
        cancelled: this.$t('finance.status_cancelled'),
        paused: this.$t('finance.status_paused')
      }
      return labels[status] || status
    },

    getDaysLeftClass(days) {
      if (days === null) return 'text-gray-500'
      if (days < 0) return 'text-red-600 font-medium'
      if (days <= 7) return 'text-orange-600 font-medium'
      return 'text-gray-600'
    }
  }
}
</script>
