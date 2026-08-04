<template>
  <div class="add-income pb-8">
    <!-- Page Header -->
    <div class="mb-6">
      <nuxt-link :to="localePath({ name: 'finance' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
        {{ $t('finance.add_income') }}
      </h1>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-2xl p-6 shadow-sm max-w-2xl">
      <form @submit.prevent="submitForm">
        <!-- Category (Custom Scrollable Select) -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">{{ $t('finance.category') }} *</label>
          <CategorySelect
            :value="form.category_id"
            :categories="categories"
            accent="green"
            :loading="categoryLoading"
            @input="form.category_id = $event"
            @add="onAddCategory"
          />
        </div>

        <!-- Currency (UZS / USD) -->
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.currency') }}</label>
          <div class="flex gap-2">
            <button
              v-for="cur in currencies"
              :key="cur"
              type="button"
              @click="setCurrency(cur)"
              class="px-6 py-2 rounded-xl font-semibold transition-colors"
              :class="form.currency === cur ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ cur }}
            </button>
          </div>
        </div>

        <!-- Amount -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.amount') }} *</label>
          <div class="relative">
            <input
              v-model="amountDisplay"
              type="text"
              inputmode="numeric"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 pr-16 text-xl font-semibold"
              placeholder="0"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{{ form.currency }}</span>
          </div>
        </div>

        <!-- Quick Amount Buttons -->
        <div class="mb-4 flex flex-wrap gap-2">
          <button
            v-for="amount in quickAmounts"
            :key="amount"
            type="button"
            @click="form.amount = amount"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
          >
            {{ formatMoney(amount) }}
          </button>
        </div>

        <!-- Date -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.date') }} *</label>
          <input
            v-model="form.income_date"
            type="date"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
          />
        </div>

        <!-- Daromad shakli (qabul qilish usuli) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.income_form') }}</label>
          <div class="flex gap-3">
            <button
              v-for="method in paymentMethods"
              :key="method.value"
              type="button"
              @click="form.payment_method = method.value"
              class="flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center"
              :class="form.payment_method === method.value ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              <span class="mr-2">{{ method.icon }}</span>
              {{ method.label }}
            </button>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.description') }}</label>
          <input
            v-model="form.description"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            :placeholder="$t('finance.income_description_placeholder')"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-semibold transition-colors"
        >
          <span v-if="loading">{{ $t('common.loading') }}</span>
          <span v-else>{{ $t('finance.add_income') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import CategorySelect from '@/components/finance/CategorySelect.vue'

export default {
  name: 'AddIncome',
  middleware: 'auth',
  components: { CategorySelect },

  data() {
    return {
      form: {
        category_id: null,
        amount: '',
        currency: 'UZS',
        income_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        description: ''
      },
      categories: [],
      loading: false,
      currencies: ['UZS', 'USD'],
      categoryLoading: false
    }
  },

  computed: {
    paymentMethods() {
      return [
        { value: 'cash', label: this.$t('finance.cash'), icon: '💵' },
        { value: 'card', label: this.$t('finance.card'), icon: '💳' }
      ]
    },

    // Tezkor summalar valyutaga bog'liq: UZS katta, USD kichik
    quickAmounts() {
      return this.form.currency === 'USD'
        ? [10, 25, 50, 100, 500]
        : [10000, 50000, 100000, 500000, 1000000]
    },

    // Summa mingtalik ajratgich bilan ko'rsatiladi (10 000 000), ichkarida raqam saqlanadi
    amountDisplay: {
      get() {
        if (this.form.amount === '' || this.form.amount == null) return ''
        return String(this.form.amount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      },
      set(val) {
        const raw = String(val).replace(/[^\d]/g, '')
        this.form.amount = raw ? Number(raw) : ''
      }
    }
  },

  async mounted() {
    await this.loadCategories()
  },

  methods: {
    async loadCategories() {
      try {
        const res = await this.$api.getIncomeCategories()
        if (res?.data?.success) {
          this.categories = res.data.data
        }
      } catch (error) {
        console.error('Load income categories error:', error)
      }
    },

    setCurrency(cur) {
      this.form.currency = cur
    },

    // CategorySelect "add" hodisasi — yangi daromad kategoriyasi yaratib, tanlaymiz
    async onAddCategory({ name, icon }) {
      try {
        this.categoryLoading = true
        const res = await this.$api.createIncomeCategory({ name, icon })
        if (res?.data?.success) {
          const cat = res.data.data
          this.categories.push(cat)
          this.form.category_id = cat.id
          this.$toast?.success(this.$t('finance.category_added'))
        }
      } catch (error) {
        console.error('Add income category error:', error)
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.categoryLoading = false
      }
    },

    async submitForm() {
      if (!this.form.category_id) {
        this.$toast?.error(this.$t('finance.select_category'))
        return
      }

      try {
        this.loading = true
        const res = await this.$api.createIncome(this.form)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.income_added'))
          this.$router.push(this.localePath({ name: 'finance' }))
        }
      } catch (error) {
        console.error('Save income error:', error)
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.loading = false
      }
    },

    formatMoney(value) {
      if (!value) return '0'
      return Number(value).toLocaleString('uz-UZ')
    },

    getCategoryName(name) {
      const key = `finance.${name}`
      const translated = this.$t(key)
      if (translated === key) {
        return name
      }
      return translated
    }
  }
}
</script>
