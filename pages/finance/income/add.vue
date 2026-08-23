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
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <form @submit.prevent="submitForm" novalidate class="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <!-- Category (Custom Scrollable Select) — to'liq kenglik -->
        <div class="mb-4 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-3">{{ $t('finance.category') }} *</label>
          <CategorySelect
            :value="form.category_id"
            :categories="categories"
            accent="green"
            :loading="categoryLoading"
            @input="form.category_id = $event"
            @add="onAddCategory"
            @delete="onDeleteCategory"
          />
        </div>

        <!-- CHAP ustun: Summa → tez-summa tugmalari → Sana -->
        <div>
          <!-- Amount -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.amount') }} *</label>
            <div class="relative">
              <input
                :value="amountDisplay"
                @input="onAmountInput"
                type="text"
                inputmode="numeric"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 pr-16 text-xl font-semibold"
                placeholder="0"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{{ form.currency }}</span>
            </div>
          </div>

          <!-- Quick Amount Buttons (summa input tagida) -->
          <div class="flex flex-wrap gap-2 mb-4">
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
            <date-picker
              v-model="form.income_date"
              value-type="YYYY-MM-DD"
              format="DD.MM.YYYY"
              :lang="dpLang"
              :editable="false"
              :disabled-date="disableFuture"
              class="w-full"
              input-class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 cursor-pointer"
            />
          </div>
        </div>

        <!-- O'NG ustun: Valyuta → Daromad shakli -->
        <div>
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
        </div>

        <!-- Description — to'liq kenglik -->
        <div class="mb-6 md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.description') }}</label>
          <input
            v-model="form.description"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            :placeholder="$t('finance.income_description_placeholder')"
          />
        </div>

        <!-- Submit Button — o'ng-pastda, ixcham -->
        <div class="md:col-span-2 flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-semibold transition-colors"
          >
            <span v-if="loading">{{ $t('common.loading') }}</span>
            <span v-else>{{ $t('finance.add_income') }}</span>
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
      categoryLoading: false,
      showCatDeleteModal: false,
      catToDelete: null,
      isEdit: false,
      editId: null
    }
  },

  computed: {
    // Datepicker o'zbek/rus lokali (i18n locale asosida)
    dpLang() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn')
    },

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

    // Bugungi sana (lokal) — kelajak sanani cheklash uchun
    todayStr() {
      const d = new Date()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${d.getFullYear()}-${mm}-${dd}`
    }
  },

  async mounted() {
    await this.loadCategories()
    if (this.$route.query.edit) {
      this.isEdit = true
      this.editId = this.$route.query.edit
      await this.loadIncome()
    }
  },

  methods: {
    // B35-9: Summa FAQAT raqam — harf yozilsa DOM ni majburan tozalaymiz.
    onAmountInput(e) {
      const raw = String(e.target.value).replace(/[^\d]/g, '')
      this.form.amount = raw ? Number(raw) : ''
      e.target.value = this.amountDisplay
    },
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

    async loadIncome() {
      try {
        const res = await this.$axios.get(`/finance/incomes/${this.editId}`)
        if (res?.data?.success) {
          const inc = res.data.data
          this.form = {
            category_id: inc.category_id != null ? Number(inc.category_id) : null,
            amount: inc.amount != null ? Number(inc.amount) : '',
            currency: inc.currency || 'UZS',
            income_date: this.dateInput(inc.income_date),
            payment_method: inc.payment_method || 'cash',
            description: inc.description || ''
          }
          // R9: daromadga biriktirilgan kategoriya ro'yxatда bo'lmasligi mumkin (deaktiv
          // qilingan yoki yashirilgan). Shunday bo'lsa uni dropdownga qo'shamiz — aks holda
          // tahrirlaganda kategoriya bo'sh ("Kategoriyani tanlang") chiqib qolardi.
          if (inc.category && inc.category.id != null) {
            const cid = Number(inc.category.id)
            if (!this.categories.some(c => Number(c.id) === cid)) {
              this.categories.push({ ...inc.category, id: cid })
            }
          }
        }
      } catch (error) {
        console.error('Load income error:', error)
        this.$router.push(this.localePath({ name: 'finance-income' }))
      }
    },

    // U13: API DATE ustunini UTC-ISO qilib yuboradi (mas. 2026-08-11T19:00Z = +5 da 08-12).
    // .split('T')[0] bir kun kam berardi. +5 ofset bilan to'g'ri sanani tiklaymiz.
    dateInput(v) {
      if (!v) return ''
      const s = String(v)
      if (s.includes('T')) {
        const d = new Date(s)
        if (!isNaN(d)) return new Date(d.getTime() + 5 * 3600 * 1000).toISOString().split('T')[0]
      }
      return s.slice(0, 10)
    },
    setCurrency(cur) {
      this.form.currency = cur
    },

    // Kelajakdagi sanalarni bloklash (bugun va o'tgan ruxsat)
    disableFuture(date) {
      const t = new Date()
      t.setHours(23, 59, 59, 999)
      return date > t
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

    // Kategoriyani o'chirish — endi FAQAT tasdiq modalini ochadi
    onDeleteCategory(cat) {
      if (!cat || !cat.id) return
      this.catToDelete = cat
      this.showCatDeleteModal = true
    },

    // Tasdiqdan keyin haqiqiy o'chirish
    async confirmCatDelete() {
      const cat = this.catToDelete
      if (!cat || !cat.id) return
      try {
        await this.$api.deleteIncomeCategory(cat.id)
        if (this.form.category_id === cat.id) this.form.category_id = null
        await this.loadCategories()
        this.$toast?.success(this.$t('finance.category_deleted'))
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.showCatDeleteModal = false
        this.catToDelete = null
      }
    },

    // Kategoriya nomini (tarjima bilan) ko'rsatish
    catNameFor(cat) {
      const k = 'finance.' + (cat && cat.name)
      const t = this.$t(k)
      return t === k ? (cat && cat.name) : t
    },

    async submitForm() {
      if (!this.form.category_id) {
        this.$toast?.error(this.$t('finance.select_category'))
        return
      }
      // Kelajakdagi sanaga daromad qo'shib bo'lmaydi (bugun va undan oldin)
      if (this.form.income_date && this.form.income_date > this.todayStr) {
        this.$toast?.error(this.$t('finance.future_date_not_allowed'))
        return
      }

      try {
        this.loading = true
        let res
        if (this.isEdit) {
          res = await this.$api.updateIncome(this.editId, this.form)
        } else {
          res = await this.$api.createIncome(this.form)
        }
        if (res?.data?.success) {
          this.$toast?.success(this.isEdit ? (this.$t('finance.income_updated') || this.$t('finance.income_added')) : this.$t('finance.income_added'))
          this.$router.push(this.localePath({ name: 'finance-income' }))
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
