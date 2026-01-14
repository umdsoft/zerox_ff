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
        <div class="mt-4 md:mt-0 grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-3xl font-bold">{{ stats.active_count || 0 }}</p>
            <p class="text-purple-200 text-sm">{{ $t('finance.active') }}</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ stats.completed_count || 0 }}</p>
            <p class="text-purple-200 text-sm">{{ $t('finance.completed') }}</p>
          </div>
          <div>
            <p class="text-3xl font-bold">{{ formatMoney(stats.total_saved || 0, true) }}</p>
            <p class="text-purple-200 text-sm">{{ $t('finance.saved') }}</p>
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

    <!-- Goals List -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="goal in goals"
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

        <!-- Progress -->
        <div class="mb-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">{{ formatMoney(goal.current_amount) }}</span>
            <span class="font-medium text-gray-900">{{ formatMoney(goal.target_amount) }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="h-3 rounded-full transition-all"
              :style="{ width: goal.progress + '%', backgroundColor: goal.color || '#8B5CF6' }"
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
          <nuxt-link
            :to="localePath({ name: 'finance-goals-id', params: { id: goal.id } })"
            class="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
          >
            {{ $t('common.details') }}
          </nuxt-link>
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
              v-model="addAmountValue"
              type="number"
              required
              min="1000"
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
      loading: true
    }
  },

  computed: {
    tabs() {
      return [
        { value: 'active', label: this.$t('finance.active') },
        { value: 'completed', label: this.$t('finance.completed') },
        { value: 'all', label: this.$t('common.all') }
      ]
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

    calculateDaysRemaining(deadline) {
      const diff = new Date(deadline) - new Date()
      return Math.ceil(diff / (1000 * 60 * 60 * 24))
    },

    formatMoney(value, short = false) {
      if (!value) return '0 UZS'
      if (short && value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M'
      }
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('uz-UZ')
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
