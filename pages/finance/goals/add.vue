<template>
  <div class="add-goal pb-8">
    <!-- Page Header -->
    <div class="mb-6">
      <nuxt-link :to="localePath({ name: 'finance-goals' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.add_goal') }}</h1>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-2xl p-6 shadow-sm max-w-2xl">
      <form @submit.prevent="submitForm">
        <!-- Icon Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">{{ $t('finance.select_icon') }}</label>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            <button
              v-for="item in iconItems"
              :key="item.icon"
              type="button"
              @click="form.icon = item.icon"
              class="flex flex-col items-center justify-center p-3 rounded-xl transition-all min-w-[80px]"
              :class="form.icon === item.icon ? 'bg-purple-100 ring-2 ring-purple-500' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'"
            >
              <span class="text-2xl mb-1">{{ item.icon }}</span>
              <span class="text-[11px] text-gray-600 text-center leading-tight whitespace-nowrap">{{ item.label }}</span>
            </button>
          </div>
        </div>

        <!-- Title -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.goal_title') }} *</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            :placeholder="$t('finance.goal_title_placeholder')"
          />
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.description') }}</label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            :placeholder="$t('finance.goal_desc_placeholder')"
          ></textarea>
        </div>

        <!-- Target Amount -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.target_amount') }} *</label>
          <div class="relative">
            <input
              v-model="form.target_amount"
              type="number"
              required
              min="10000"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 pr-16 text-xl font-semibold"
              placeholder="1 000 000"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{{ form.currency }}</span>
          </div>
        </div>

        <!-- Currency -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.currency') }}</label>
          <div class="flex gap-3">
            <button
              type="button"
              @click="form.currency = 'UZS'"
              class="flex-1 py-3 rounded-xl font-medium transition-colors"
              :class="form.currency === 'UZS' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              UZS
            </button>
            <button
              type="button"
              @click="form.currency = 'USD'"
              class="flex-1 py-3 rounded-xl font-medium transition-colors"
              :class="form.currency === 'USD' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              USD
            </button>
          </div>
        </div>

        <!-- Initial Amount -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.initial_amount') }}</label>
          <input
            v-model="form.current_amount"
            type="number"
            min="0"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            placeholder="0"
          />
          <p class="text-sm text-gray-500 mt-1">{{ $t('finance.initial_amount_hint') }}</p>
        </div>

        <!-- Deadline -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.deadline') }}</label>
          <input
            v-model="form.deadline"
            type="date"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <!-- Priority -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.priority') }}</label>
          <div class="flex gap-3">
            <button
              v-for="p in priorities"
              :key="p.value"
              type="button"
              @click="form.priority = p.value"
              class="flex-1 py-3 rounded-xl font-medium transition-colors"
              :class="form.priority === p.value ? p.activeClass : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ p.label }}
            </button>
          </div>
        </div>

        <!-- Color -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.color') }}</label>
          <div class="flex gap-2">
            <button
              v-for="color in colors"
              :key="color"
              type="button"
              @click="form.color = color"
              class="w-10 h-10 rounded-full transition-all"
              :style="{ backgroundColor: color }"
              :class="form.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''"
            ></button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl font-semibold transition-colors"
        >
          <span v-if="loading">{{ $t('common.loading') }}</span>
          <span v-else>{{ $t('finance.create_goal') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddGoal',
  middleware: 'auth',

  data() {
    return {
      form: {
        icon: '🎯',
        title: '',
        description: '',
        target_amount: '',
        current_amount: 0,
        currency: 'UZS',
        deadline: '',
        priority: 'medium',
        color: '#8B5CF6'
      },
      colors: ['#8B5CF6', '#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#EC4899', '#6366F1', '#14B8A6'],
      loading: false
    }
  },

  computed: {
    iconItems() {
      return [
        { icon: '🎯', label: this.$t('finance.icon_goal') },
        { icon: '🏠', label: this.$t('finance.icon_home') },
        { icon: '🚗', label: this.$t('finance.icon_car') },
        { icon: '✈️', label: this.$t('finance.icon_travel') },
        { icon: '💻', label: this.$t('finance.icon_tech') },
        { icon: '📱', label: this.$t('finance.icon_phone') },
        { icon: '💍', label: this.$t('finance.icon_wedding') },
        { icon: '🎓', label: this.$t('finance.icon_education') },
        { icon: '💰', label: this.$t('finance.icon_savings') },
        { icon: '🏦', label: this.$t('finance.icon_bank') },
        { icon: '🎁', label: this.$t('finance.icon_gift') },
        { icon: '🛍️', label: this.$t('finance.icon_shopping') },
        { icon: '📚', label: this.$t('finance.icon_books') },
        { icon: '🏋️', label: this.$t('finance.icon_fitness') },
        { icon: '🎮', label: this.$t('finance.icon_gaming') },
        { icon: '🎵', label: this.$t('finance.icon_music') }
      ]
    },

    priorities() {
      return [
        { value: 'low', label: this.$t('finance.priority_low'), activeClass: 'bg-gray-600 text-white' },
        { value: 'medium', label: this.$t('finance.priority_medium'), activeClass: 'bg-yellow-500 text-white' },
        { value: 'high', label: this.$t('finance.priority_high'), activeClass: 'bg-red-500 text-white' }
      ]
    }
  },

  methods: {
    async submitForm() {
      try {
        this.loading = true
        const res = await this.$api.createGoal(this.form)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.goal_created'))
          this.$router.push(this.localePath({ name: 'finance-goals' }))
        }
      } catch (error) {
        console.error('Create goal error:', error)
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
