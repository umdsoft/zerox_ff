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
        <!-- Category (gorizontal scroll) -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">{{ $t('finance.category') }} *</label>
          <div class="flex gap-3 overflow-x-auto pb-2 category-scroll">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              @click="form.category_id = cat.id"
              class="flex-shrink-0 w-24 p-3 rounded-xl border-2 transition-all text-center"
              :class="form.category_id === cat.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <span class="text-2xl block mb-1">{{ cat.icon }}</span>
              <span class="text-xs font-medium leading-tight block" :class="form.category_id === cat.id ? 'text-green-700' : 'text-gray-600'">
                {{ getCategoryName(cat.name) }}
              </span>
            </button>
            <!-- Yangi kategoriya qo'shish -->
            <button
              type="button"
              @click="openAddCategory"
              class="flex-shrink-0 w-24 p-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all text-center"
            >
              <span class="text-2xl block mb-1">➕</span>
              <span class="text-xs font-medium leading-tight block text-gray-500">{{ $t('finance.add') }}</span>
            </button>
          </div>

          <!-- Inline yangi kategoriya formasi -->
          <div v-if="showAddCategory" class="mt-3 flex flex-wrap items-center gap-2">
            <input
              v-model="newCategoryIcon"
              type="text"
              maxlength="2"
              class="w-14 px-2 py-2 border border-gray-300 rounded-lg text-center text-lg"
              placeholder="📦"
            />
            <input
              v-model="newCategoryName"
              type="text"
              class="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              :placeholder="$t('finance.category_name_placeholder')"
              @keyup.enter="submitNewCategory"
            />
            <button
              type="button"
              @click="submitNewCategory"
              :disabled="categoryLoading || !newCategoryName.trim()"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg text-sm font-medium"
            >
              {{ $t('finance.add') }}
            </button>
            <button
              type="button"
              @click="cancelAddCategory"
              class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm"
            >
              {{ $t('common.cancel') }}
            </button>
          </div>
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
              v-model="form.amount"
              type="number"
              required
              :min="form.currency === 'USD' ? 1 : 100"
              step="any"
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

        <!-- Payment Method (qabul qilish usuli) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.payment_method') }}</label>
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
export default {
  name: 'AddIncome',
  middleware: 'auth',

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
      // Yangi kategoriya qo'shish (inline)
      showAddCategory: false,
      newCategoryName: '',
      newCategoryIcon: '',
      categoryLoading: false
    }
  },

  computed: {
    paymentMethods() {
      return [
        { value: 'cash', label: this.$t('finance.cash'), icon: '💵' },
        { value: 'card', label: this.$t('finance.card'), icon: '💳' },
        { value: 'transfer', label: this.$t('finance.transfer'), icon: '📱' }
      ]
    },

    // Tezkor summalar valyutaga bog'liq: UZS katta, USD kichik
    quickAmounts() {
      return this.form.currency === 'USD'
        ? [10, 25, 50, 100, 500]
        : [10000, 50000, 100000, 500000, 1000000]
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
          if (this.categories.length && !this.form.category_id) {
            this.form.category_id = this.categories[0].id
          }
        }
      } catch (error) {
        console.error('Load income categories error:', error)
      }
    },

    setCurrency(cur) {
      this.form.currency = cur
    },

    openAddCategory() {
      this.showAddCategory = true
    },

    cancelAddCategory() {
      this.showAddCategory = false
      this.newCategoryName = ''
      this.newCategoryIcon = ''
    },

    async submitNewCategory() {
      const name = this.newCategoryName.trim()
      if (!name) return
      try {
        this.categoryLoading = true
        const res = await this.$api.createIncomeCategory({
          name,
          icon: this.newCategoryIcon.trim() || '📦'
        })
        if (res?.data?.success) {
          const cat = res.data.data
          this.categories.push(cat)
          this.form.category_id = cat.id
          this.cancelAddCategory()
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

<style scoped>
/* Kategoriyalar gorizontal scroll — nozik scrollbar */
.category-scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
  scroll-snap-type: x proximity;
}
.category-scroll > button {
  scroll-snap-align: start;
}
.category-scroll::-webkit-scrollbar {
  height: 6px;
}
.category-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 9999px;
}
.category-scroll::-webkit-scrollbar-track {
  background: transparent;
}
</style>
