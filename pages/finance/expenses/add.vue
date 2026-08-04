<template>
  <div class="add-expense pb-8">
    <!-- Page Header -->
    <div class="mb-6">
      <nuxt-link :to="localePath({ name: 'finance-expenses' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
        {{ isEdit ? $t('finance.edit_expense') : $t('finance.add_expense') }}
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
            accent="blue"
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
              :class="form.currency === cur ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
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
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 pr-16 text-xl font-semibold"
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
            v-model="form.expense_date"
            type="date"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Debt Selector (qarz to'lovi kategoriyalari uchun) -->
        <div v-if="isDebtPaymentCategory" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.select_debt') }}</label>
          <select
            v-model="form.debt_id"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option :value="null">{{ $t('finance.no_debt_selected') }}</option>
            <option
              v-for="debt in activeDebts"
              :key="debt.id"
              :value="debt.id"
            >
              {{ debt.source_name }} - {{ formatMoney(debt.remaining_amount) }} UZS
            </option>
          </select>
          <p v-if="activeDebts.length === 0" class="text-sm text-orange-500 mt-2">
            {{ getNoDebtsMessage }}
          </p>
          <p v-else-if="form.debt_id" class="text-sm text-green-600 mt-2">
            ✓ {{ $t('finance.debt_will_be_updated') }}
          </p>
        </div>

        <!-- Payment Method -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.payment_method') }}</label>
          <div class="flex gap-3">
            <button
              v-for="method in paymentMethods"
              :key="method.value"
              type="button"
              @click="form.payment_method = method.value"
              class="flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center"
              :class="form.payment_method === method.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
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
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            :placeholder="$t('finance.description_placeholder')"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-colors"
        >
          <span v-if="loading">{{ $t('common.loading') }}</span>
          <span v-else>{{ isEdit ? $t('common.save') : $t('finance.add_expense') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import CategorySelect from '@/components/finance/CategorySelect.vue'

export default {
  name: 'AddExpense',
  middleware: 'auth',
  components: { CategorySelect },

  data() {
    return {
      form: {
        category_id: null,
        amount: '',
        currency: 'UZS',
        expense_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        description: '',
        debt_id: null
      },
      categories: [],
      activeDebts: [],
      isEdit: false,
      editId: null,
      loading: false,
      currencies: ['UZS', 'USD'],
      categoryLoading: false,
      // Qarz to'lovi kategoriya nomlari va ularning source_type lari
      debtCategoryMap: {
        'debt_bank_payment': 'bank',
        'debt_personal_payment': 'other',
        'debt_family_payment': 'family',
        'debt_friend_payment': 'friend'
      }
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
    },

    // Tanlangan kategoriya qarz to'lovi kategoriyasimi?
    isDebtPaymentCategory() {
      if (!this.form.category_id) return false
      const selectedCategory = this.categories.find(c => c.id === this.form.category_id)
      if (!selectedCategory) return false
      return Object.keys(this.debtCategoryMap).includes(selectedCategory.name)
    },

    // Tanlangan kategoriya
    selectedCategory() {
      return this.categories.find(c => c.id === this.form.category_id)
    },

    // Tanlangan kategoriyaning source_type i
    selectedDebtSourceType() {
      if (!this.selectedCategory) return null
      return this.debtCategoryMap[this.selectedCategory.name] || null
    },

    // Qarz topilmagan xabari
    getNoDebtsMessage() {
      const sourceType = this.selectedDebtSourceType
      const messages = {
        bank: this.$t('finance.no_bank_debts'),
        family: this.$t('finance.no_family_debts'),
        friend: this.$t('finance.no_friend_debts'),
        other: this.$t('finance.no_personal_debts')
      }
      return messages[sourceType] || this.$t('finance.no_active_debts')
    }
  },

  watch: {
    // Qarz to'lovi kategoriyasi o'zgarganda qarzlarni qayta yuklash
    selectedDebtSourceType: {
      handler(newVal, oldVal) {
        if (newVal) {
          // Yangi source_type tanlanganda qarzlarni yuklash
          this.loadActiveDebts(newVal)
        }
        // Agar qarz to'lovi emas bo'lsa, debt_id ni tozalash
        if (!newVal) {
          this.form.debt_id = null
          this.activeDebts = []
        }
        // Kategoriya o'zgarganda debt_id ni tozalash
        if (newVal !== oldVal) {
          this.form.debt_id = null
        }
      },
      immediate: true
    }
  },

  async mounted() {
    await this.loadCategories()
    if (this.$route.query.edit) {
      this.isEdit = true
      this.editId = this.$route.query.edit
      await this.loadExpense()
    }
  },

  methods: {
    async loadCategories() {
      try {
        const res = await this.$api.getExpenseCategories()
        if (res?.data?.success) {
          this.categories = res.data.data
        }
      } catch (error) {
        console.error('Load categories error:', error)
      }
    },

    setCurrency(cur) {
      this.form.currency = cur
    },

    // CategorySelect "add" hodisasi — yangi kategoriya yaratib, tanlaymiz
    async onAddCategory({ name, icon }) {
      try {
        this.categoryLoading = true
        const res = await this.$api.createExpenseCategory({ name, icon })
        if (res?.data?.success) {
          const cat = res.data.data
          this.categories.push(cat)
          this.form.category_id = cat.id
          this.$toast?.success(this.$t('finance.category_added'))
        }
      } catch (error) {
        console.error('Add category error:', error)
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.categoryLoading = false
      }
    },

    async loadExpense() {
      try {
        const res = await this.$axios.get(`/finance/expenses/${this.editId}`)
        if (res?.data?.success) {
          const expense = res.data.data
          this.form = {
            category_id: expense.category_id,
            amount: expense.amount,
            currency: expense.currency || 'UZS',
            expense_date: expense.expense_date?.split('T')[0],
            payment_method: expense.payment_method,
            description: expense.description,
            debt_id: expense.debt_id || null
          }
        }
      } catch (error) {
        console.error('Load expense error:', error)
        this.$router.push(this.localePath({ name: 'finance-expenses' }))
      }
    },

    async submitForm() {
      if (!this.form.category_id) {
        this.$toast?.error(this.$t('finance.select_category'))
        return
      }

      try {
        this.loading = true
        let res
        if (this.isEdit) {
          res = await this.$api.updateExpense(this.editId, this.form)
        } else {
          res = await this.$api.createExpense(this.form)
        }

        if (res?.data?.success) {
          this.$toast?.success(
            this.isEdit ? this.$t('finance.expense_updated') : this.$t('finance.expense_added')
          )
          this.$router.push(this.localePath({ name: 'finance-expenses' }))
        }
      } catch (error) {
        console.error('Save expense error:', error)
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
      // Agar tarjima kaliti mavjud bo'lsa, tarjima qilamiz
      const key = `finance.${name}`
      const translated = this.$t(key)
      // Agar tarjima topilmasa (kalit qaytsa), asl nomini ko'rsatamiz
      if (translated === key) {
        return name
      }
      return translated
    },

    async loadActiveDebts(sourceType) {
      try {
        const params = { status: 'active', type: 'borrowed' }
        // Source type bo'yicha filterlash
        if (sourceType) {
          params.source_type = sourceType
        }
        const res = await this.$api.getPersonalDebts(params)
        if (res?.data?.success) {
          this.activeDebts = res.data.data
        }
      } catch (error) {
        console.error('Load debts error:', error)
      }
    }
  }
}
</script>
