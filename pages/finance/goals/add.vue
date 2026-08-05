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
      <form @submit.prevent="submitForm" novalidate>
        <!-- Category (Custom Scrollable Select) -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">{{ $t('finance.category') }}</label>
          <CategorySelect
            :value="form.icon"
            :categories="categories"
            accent="purple"
            :loading="categoryLoading"
            :placeholder="$t('finance.choose_goal')"
            @input="form.icon = $event"
            @add="onAddCategory"
          />
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
              v-model="targetDisplay"
              type="text"
              inputmode="numeric"
              required
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
            v-model="currentDisplay"
            type="text"
            inputmode="numeric"
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
            :min="tomorrowStr"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          />
          <p v-if="planHint" class="text-sm text-purple-600 mt-2 font-medium flex items-center">
            <span class="mr-1">📅</span>{{ planHint.label }}: {{ planHint.amount.toLocaleString('uz-UZ') }} {{ form.currency }}
          </p>
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
import CategorySelect from '@/components/finance/CategorySelect.vue'

export default {
  name: 'AddGoal',
  middleware: 'auth',
  components: { CategorySelect },

  data() {
    return {
      form: {
        icon: '',
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
      loading: false,
      categoryLoading: false,
      // Maqsad belgilari (Maqsad, Bank, Xarid, Kitoblar, Sport, O'yinlar, Musiqa olib tashlandi)
      categories: [
        { id: '🏠', icon: '🏠', name: 'icon_home' },
        { id: '🚗', icon: '🚗', name: 'icon_car' },
        { id: '✈️', icon: '✈️', name: 'icon_travel' },
        { id: '💻', icon: '💻', name: 'icon_tech' },
        { id: '📱', icon: '📱', name: 'icon_phone' },
        { id: '💍', icon: '💍', name: 'icon_wedding' },
        { id: '🎓', icon: '🎓', name: 'icon_education' },
        { id: '💰', icon: '💰', name: 'icon_savings' },
        { id: '🎁', icon: '🎁', name: 'icon_gift' }
      ]
    }
  },

  computed: {
    // Summalar mingtalik ajratgich bilan (5 000 000)
    targetDisplay: {
      get() {
        return (this.form.target_amount === '' || this.form.target_amount == null)
          ? '' : String(this.form.target_amount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      },
      set(v) { const raw = String(v).replace(/[^\d]/g, ''); this.form.target_amount = raw ? Number(raw) : '' }
    },
    currentDisplay: {
      get() {
        return (this.form.current_amount === '' || this.form.current_amount == null || this.form.current_amount === 0)
          ? '' : String(this.form.current_amount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      },
      set(v) { const raw = String(v).replace(/[^\d]/g, ''); this.form.current_amount = raw ? Number(raw) : 0 }
    },
    // Muddat uchun minimal sana — bugun (lokal)
    todayStr() {
      const d = new Date()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${d.getFullYear()}-${mm}-${dd}`
    },
    // Muddat kamida ertaga bo'lishi kerak (kalendarda o'tgan+bugun bloklanadi)
    tomorrowStr() {
      const d = new Date()
      d.setDate(d.getDate() + 1)
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${d.getFullYear()}-${mm}-${dd}`
    },
    // Bir oyga (yoki 30 kundan kam bo'lsa bir haftaga) qo'shish kerak bo'lgan minimum
    planHint() {
      const target = Number(this.form.target_amount) || 0
      const initial = Number(this.form.current_amount) || 0
      const remaining = Math.max(0, target - initial)
      if (!remaining || !this.form.deadline) return null
      const dl = new Date(this.form.deadline + 'T00:00:00')
      const now = new Date()
      const days = Math.ceil((dl - now) / (1000 * 60 * 60 * 24))
      if (days <= 0) return null
      if (days < 30) {
        const weeks = Math.max(1, Math.ceil(days / 7))
        return { label: this.$t('finance.per_week_needed'), amount: Math.ceil(remaining / weeks) }
      }
      const months = Math.max(1, Math.round(days / 30))
      return { label: this.$t('finance.per_month_needed'), amount: Math.ceil(remaining / months) }
    },

    priorities() {
      return [
        { value: 'low', label: this.$t('finance.priority_low'), activeClass: 'bg-gray-600 text-white' },
        { value: 'medium', label: this.$t('finance.priority_medium'), activeClass: 'bg-yellow-500 text-white' },
        { value: 'high', label: this.$t('finance.priority_high'), activeClass: 'bg-red-500 text-white' }
      ]
    }
  },

  mounted() {
    // Foydalanuvchi qo'shgan belgilar localStorage'da doimiy saqlanadi
    try {
      const saved = JSON.parse(localStorage.getItem('zx_goal_categories') || '[]')
      for (const c of saved) {
        if (c && c.icon && !this.categories.some(x => x.id === c.icon)) {
          this.categories.push({ id: c.icon, icon: c.icon, name: c.name || c.icon })
        }
      }
    } catch (_) {}
  },

  methods: {
    // CategorySelect "add" — yangi belgi (emoji) qo'shib, tanlaymiz + localStorage'ga saqlaymiz
    onAddCategory({ name, icon }) {
      const ic = (icon && icon.trim()) || '📦'
      if (!this.categories.some(c => c.id === ic)) {
        this.categories.push({ id: ic, icon: ic, name: name || ic })
        try {
          const saved = JSON.parse(localStorage.getItem('zx_goal_categories') || '[]')
          if (!saved.some(x => x.icon === ic)) {
            saved.push({ icon: ic, name: name || ic })
            localStorage.setItem('zx_goal_categories', JSON.stringify(saved))
          }
        } catch (_) {}
      }
      this.form.icon = ic
    },

    async submitForm() {
      // novalidate — validatsiyani o'zimiz o'z tilimizda qilamiz
      if (!this.form.title || !this.form.title.trim()) {
        this.$toast?.error(this.$t('finance.goal_title') + ' *')
        return
      }
      // Muddat kamida ertaga bo'lishi kerak (o'z tilida — native brauzer xatosi emas)
      if (this.form.deadline && this.form.deadline < this.tomorrowStr) {
        this.$toast?.error(this.$t('finance.deadline_past'))
        return
      }
      // Boshlang'ich summa maqsad summasidan ko'p bo'lmasligi kerak (3857% oldini oladi)
      if (Number(this.form.current_amount || 0) > Number(this.form.target_amount || 0)) {
        this.$toast?.error(this.$t('finance.initial_exceeds_target'))
        return
      }
      try {
        this.loading = true
        const payload = { ...this.form, icon: this.form.icon || '🎯' }
        const res = await this.$api.createGoal(payload)
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
