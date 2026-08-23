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
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <form @submit.prevent="submitForm" novalidate class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <!-- Category (Custom Scrollable Select) — to'liq kenglik -->
        <div class="mb-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.category') }}</label>
          <CategorySelect
            :value="form.categoryId"
            :categories="categories"
            accent="purple"
            :loading="categoryLoading"
            :placeholder="$t('finance.choose_goal')"
            @input="onSelectCat"
            @add="onAddCategory"
            @delete="onDeleteCategory"
          />
        </div>

        <!-- Title — to'liq kenglik -->
        <div class="mb-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.goal_title') }} *</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            :placeholder="$t('finance.goal_title_placeholder')"
          />
        </div>

        <!-- CHAP ustun: Maqsad summasi → Boshlang'ich summa -->
        <div>
          <!-- Target Amount -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.target_amount') }} *</label>
            <div class="relative">
              <input
                :value="targetDisplay"
                @input="onTargetInput"
                type="text"
                inputmode="numeric"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 pr-16 text-xl font-semibold"
                placeholder="1 000 000"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{{ form.currency }}</span>
            </div>
          </div>

          <!-- Initial Amount -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.initial_amount') }}</label>
            <input
              :value="currentDisplay"
              @input="onCurrentInput"
              type="text"
              inputmode="numeric"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              :placeholder="$t('finance.initial_amount_hint')"
            />
          </div>
        </div>

        <!-- O'NG ustun: Valyuta → Muddat -->
        <div>
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

          <!-- Deadline -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.deadline') }}</label>
            <date-picker
              v-model="form.deadline"
              value-type="YYYY-MM-DD"
              format="DD.MM.YYYY"
              :lang="dpLang"
              :editable="false"
              :disabled-date="disableUntilTomorrow"
              class="w-full"
              input-class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 cursor-pointer"
            />
            <p v-if="planHint" class="text-sm text-purple-600 mt-2 font-medium flex items-center">
              <span class="mr-1">📅</span>{{ planHint.label }}: {{ planHint.amount.toLocaleString('uz-UZ') }} {{ form.currency }}
            </p>
          </div>
        </div>

        <!-- Description — to'liq kenglik -->
        <div class="mb-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.description') }}</label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            :placeholder="$t('finance.goal_desc_placeholder')"
          ></textarea>
        </div>

        <!-- CHAP: Muhimlik -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.priority') }}</label>
          <div class="flex gap-2">
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

        <!-- O'NG: Rang -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.color') }}</label>
          <div class="flex flex-wrap gap-2">
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

        <!-- Submit Button — o'ng-pastda, ixcham -->
        <div class="md:col-span-2 flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl font-semibold transition-colors"
          >
            <span v-if="loading">{{ $t('common.loading') }}</span>
            <span v-else>{{ $t('finance.create_goal') }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Kategoriyani o'chirishni tasdiqlash modali (sahifa ROOT'ida — form ichida EMAS) -->
    <div v-if="showCatDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showCatDeleteModal = false; catToDelete = null"></div>
      <div class="relative bg-white rounded-2xl p-6 max-w-sm w-full text-center">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <p class="text-gray-700 mb-6">
          <b>{{ catNameFor(catToDelete) }}</b> {{ $t('finance.confirm_delete_category_short') }}
        </p>
        <div class="flex gap-3">
          <button
            type="button"
            @click="showCatDeleteModal = false; catToDelete = null"
            class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="button"
            @click="confirmCatDelete"
            class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium"
          >
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
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
        categoryId: null, // tanlangan kategoriyaning UNIKAL id'si (emoji EMAS — dublikat emoji uchun)
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
      showCatDeleteModal: false,
      catToDelete: null,
      // Maqsad belgilari — id UNIKAL (emoji emas), shuning uchun bir emoji ostida
      // bir necha nomli kategoriya bo'lishi mumkin (masalan 🚗 → "BMW", "Mercedes")
      categories: [
        { id: 'home', icon: '🏠', name: 'icon_home' },
        { id: 'car', icon: '🚗', name: 'icon_car' },
        { id: 'travel', icon: '✈️', name: 'icon_travel' },
        { id: 'tech', icon: '💻', name: 'icon_tech' },
        { id: 'phone', icon: '📱', name: 'icon_phone' },
        { id: 'wedding', icon: '💍', name: 'icon_wedding' },
        { id: 'education', icon: '🎓', name: 'icon_education' },
        { id: 'savings', icon: '💰', name: 'icon_savings' },
        { id: 'gift', icon: '🎁', name: 'icon_gift' }
      ]
    }
  },

  computed: {
    // Datepicker o'zbek/rus lokali (i18n locale asosida)
    dpLang() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn')
    },
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
    // Foydalanuvchi qo'shgan kategoriyalar localStorage'da doimiy saqlanadi (unikal id bilan)
    try {
      const saved = JSON.parse(localStorage.getItem('zx_goal_categories') || '[]')
      for (const c of saved) {
        if (c && c.id && c.icon && !this.categories.some(x => x.id === c.id)) {
          this.categories.push({ id: c.id, icon: c.icon, name: c.name || c.icon })
        }
      }
      // Yashirilgan (o'chirilgan) kategoriyalar — predefined + custom — ro'yxatdan olib tashlanadi
      const hidden = JSON.parse(localStorage.getItem('zx_goal_hidden') || '[]')
      if (Array.isArray(hidden) && hidden.length) {
        this.categories = this.categories.filter(c => !hidden.includes(c.id))
      }
    } catch (_) {}
  },

  methods: {
    // B35-10: Maqsad/boshlang'ich summa FAQAT raqam — harf yozilsa DOM ni tozalaymiz.
    onTargetInput(e) {
      const raw = String(e.target.value).replace(/[^\d]/g, '')
      this.form.target_amount = raw ? Number(raw) : ''
      e.target.value = this.targetDisplay
    },
    onCurrentInput(e) {
      const raw = String(e.target.value).replace(/[^\d]/g, '')
      this.form.current_amount = raw ? Number(raw) : ''
      e.target.value = this.currentDisplay
    },
    // Muddat kamida ertaga bo'lishi kerak — bugun va o'tgan sanalar bloklanadi
    disableUntilTomorrow(date) {
      const t = new Date()
      t.setHours(0, 0, 0, 0)
      return date <= t
    },

    // Kategoriya tanlanganda: id'ni saqlaymiz + maqsad ikonasini o'sha kategoriyaniki qilamiz
    onSelectCat(id) {
      this.form.categoryId = id
      const cat = this.categories.find(c => c.id === id)
      this.form.icon = cat ? cat.icon : '🎯'
    },

    // CategorySelect "add" — YANGI kategoriya (unikal id), dublikat emoji'ga ruxsat,
    // yozilgan nom saqlanadi va ko'rsatiladi
    onAddCategory({ name, icon }) {
      const ic = (icon && icon.trim()) || '📦'
      const nm = (name && name.trim()) || ic
      const id = 'c' + Date.now() + Math.floor(Math.random() * 1000)
      this.categories.push({ id, icon: ic, name: nm })
      try {
        const saved = JSON.parse(localStorage.getItem('zx_goal_categories') || '[]')
        saved.push({ id, icon: ic, name: nm })
        localStorage.setItem('zx_goal_categories', JSON.stringify(saved))
      } catch (_) {}
      this.form.categoryId = id
      this.form.icon = ic
    },

    // Kategoriyani o'chirish — endi FAQAT tasdiq modalini ochadi
    onDeleteCategory(cat) {
      if (!cat || !cat.id) return
      this.catToDelete = cat
      this.showCatDeleteModal = true
    },

    // Tasdiqdan keyin haqiqiy o'chirish (custom + predefined belgilar; yashirish doimiy)
    confirmCatDelete() {
      const cat = this.catToDelete
      if (!cat || !cat.id) return
      this.categories = this.categories.filter(c => c.id !== cat.id)
      if (this.form.categoryId === cat.id) { this.form.categoryId = null; this.form.icon = '' }
      try {
        // Yashirish doimiyligi: o'chirilgan id'ni zx_goal_hidden ga qo'sh
        // (predefined 'home'/'car'... qayta yuklanganda ham ko'rinmasin)
        const hidden = JSON.parse(localStorage.getItem('zx_goal_hidden') || '[]')
        if (!hidden.includes(cat.id)) {
          hidden.push(cat.id)
          localStorage.setItem('zx_goal_hidden', JSON.stringify(hidden))
        }
        // Custom ('c'...) bo'lsa zx_goal_categories dan ham o'chir
        if (String(cat.id).startsWith('c')) {
          const saved = JSON.parse(localStorage.getItem('zx_goal_categories') || '[]').filter(x => x.id !== cat.id)
          localStorage.setItem('zx_goal_categories', JSON.stringify(saved))
        }
      } catch (_) {}
      this.$toast?.success(this.$t('finance.category_deleted'))
      this.showCatDeleteModal = false
      this.catToDelete = null
    },

    // Kategoriya nomini (tarjima bilan) ko'rsatish — predefined 'icon_car' → "Avtomobil", custom → asl nom
    catNameFor(cat) {
      const k = 'finance.' + (cat && cat.name)
      const t = this.$t(k)
      return t === k ? (cat && cat.name) : t
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
