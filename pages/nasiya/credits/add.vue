<template>
  <div class="new-sale-page pb-8">
    <!-- Page Header -->
    <div class="mb-6">
      <nuxt-link :to="localePath({ name: 'nasiya-credits' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('nasiya.new_sale') }}</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Mijoz tanlash -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.select_customer') }}</h3>

          <div v-if="!selectedCustomer" class="space-y-3">
            <input
              v-model="customerSearch"
              type="text"
              :placeholder="$t('nasiya.search_customer')"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              @input="searchCustomers"
            />
            <div v-if="customerResults.length" class="border border-gray-200 rounded-xl overflow-hidden">
              <div
                v-for="customer in customerResults"
                :key="customer.id"
                class="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                @click="selectCustomer(customer)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">{{ customer.full_name }}</p>
                    <p class="text-sm text-gray-500">{{ customer.phone }}</p>
                  </div>
                  <div class="text-right text-sm">
                    <p class="text-gray-500">{{ $t('nasiya.debt') }}: {{ formatMoney(customer.total_debt) }}</p>
                    <p v-if="customer.credit_limit" class="text-gray-500">{{ $t('nasiya.limit') }}: {{ formatMoney(customer.credit_limit) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <nuxt-link
              :to="localePath({ name: 'nasiya-customers-add' })"
              class="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              {{ $t('nasiya.add_new_customer') }}
            </nuxt-link>
          </div>

          <div v-else class="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {{ getInitials(selectedCustomer.full_name) }}
              </div>
              <div>
                <p class="font-semibold">{{ selectedCustomer.full_name }}</p>
                <p class="text-sm text-gray-500">{{ selectedCustomer.phone }}</p>
              </div>
            </div>
            <button
              class="text-red-600 hover:text-red-700"
              @click="clearCustomer"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mahsulotlar -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.products') }}</h3>

          <!-- Mahsulot qidirish -->
          <div class="mb-4">
            <div class="flex gap-2">
              <input
                v-model="productSearch"
                type="text"
                :placeholder="$t('nasiya.search_product_or_barcode')"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                @input="searchProducts"
                @keydown.enter="handleBarcodeEnter"
              />
            </div>
            <div v-if="productResults.length" class="mt-2 border border-gray-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              <div
                v-for="product in productResults"
                :key="product.id"
                class="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                @click="addProduct(product)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">{{ product.name }}</p>
                    <p v-if="product.barcode" class="text-xs text-gray-400 font-mono">{{ product.barcode }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold">{{ formatMoney(product.credit_price || product.sell_price) }}</p>
                    <p class="text-xs text-gray-500">{{ product.quantity }} {{ product.unit }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tanlangan mahsulotlar -->
          <div v-if="items.length" class="space-y-3">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <div class="flex-1">
                <p class="font-medium">{{ item.product.name }}</p>
                <p class="text-sm text-gray-500">{{ formatMoney(item.price) }} x {{ item.quantity }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="w-8 h-8 flex items-center justify-center bg-white rounded-lg border"
                  @click="decreaseQuantity(index)"
                >
                  -
                </button>
                <input
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  class="w-16 text-center px-2 py-1 border rounded-lg"
                />
                <button
                  class="w-8 h-8 flex items-center justify-center bg-white rounded-lg border"
                  @click="increaseQuantity(index)"
                >
                  +
                </button>
              </div>
              <p class="font-semibold w-24 text-right">{{ formatMoney(item.price * item.quantity) }}</p>
              <button
                class="text-red-600 hover:text-red-700"
                @click="removeItem(index)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <p>{{ $t('nasiya.no_products_added') }}</p>
          </div>
        </div>

        <!-- Qo'shimcha -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.additional_info') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.due_date') }}
              </label>
              <input
                v-model="form.due_date"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.initial_payment') }}
              </label>
              <input
                v-model.number="form.initial_payment"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('nasiya.notes') }}
            </label>
            <textarea
              v-model="form.notes"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              :placeholder="$t('nasiya.notes_placeholder')"
            ></textarea>
          </div>

          <!-- Sync to ZeroX Account -->
          <div v-if="selectedCustomer && selectedCustomer.phone" class="mt-4 p-4 bg-indigo-50 rounded-xl">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="form.sync_to_user"
                type="checkbox"
                class="w-5 h-5 mt-0.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <span class="font-medium text-gray-900">{{ $t('nasiya.sync_to_zerox') }}</span>
                <p class="text-sm text-gray-600 mt-1">{{ $t('nasiya.sync_to_zerox_desc') }}</p>
                <p class="text-xs text-indigo-600 mt-1">
                  <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ $t('nasiya.sync_phone_hint', { phone: selectedCustomer.phone }) }}
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.summary') }}</h3>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('nasiya.items_count') }}</span>
              <span class="font-medium">{{ items.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ $t('nasiya.subtotal') }}</span>
              <span class="font-medium">{{ formatMoney(subtotal) }}</span>
            </div>
            <div v-if="form.initial_payment > 0" class="flex justify-between text-green-600">
              <span>{{ $t('nasiya.initial_payment') }}</span>
              <span class="font-medium">-{{ formatMoney(form.initial_payment) }}</span>
            </div>
            <div class="pt-3 border-t border-gray-200 flex justify-between text-lg">
              <span class="font-semibold">{{ $t('nasiya.credit_amount') }}</span>
              <span class="font-bold text-red-600">{{ formatMoney(creditAmount) }}</span>
            </div>
          </div>

          <!-- Customer limit warning -->
          <div v-if="limitWarning" class="mb-4 p-3 bg-yellow-50 rounded-xl">
            <p class="text-sm text-yellow-700">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              {{ limitWarning }}
            </p>
          </div>

          <button
            :disabled="!canSave || saving"
            class="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
            @click="saveSale"
          >
            {{ saving ? $t('common.saving') : $t('nasiya.complete_sale') }}
          </button>

          <p v-if="!canSave" class="text-center text-sm text-gray-500 mt-2">
            {{ !selectedCustomer ? $t('nasiya.select_customer_first') : $t('nasiya.add_products_first') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewSalePage',
  middleware: 'auth',

  data() {
    const today = new Date()
    const dueDate = new Date(today.setMonth(today.getMonth() + 1))

    return {
      customerSearch: '',
      customerResults: [],
      selectedCustomer: null,
      productSearch: '',
      productResults: [],
      items: [],
      form: {
        due_date: dueDate.toISOString().split('T')[0],
        initial_payment: 0,
        notes: '',
        sync_to_user: false
      },
      saving: false,
      searchTimeout: null
    }
  },

  computed: {
    subtotal() {
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    creditAmount() {
      return Math.max(0, this.subtotal - (this.form.initial_payment || 0))
    },
    canSave() {
      return this.selectedCustomer && this.items.length > 0
    },
    limitWarning() {
      if (!this.selectedCustomer || !this.selectedCustomer.credit_limit) return null
      const totalDebt = (this.selectedCustomer.total_debt || 0) + this.creditAmount
      if (totalDebt > this.selectedCustomer.credit_limit) {
        return this.$t('nasiya.credit_limit_exceeded', {
          limit: this.formatMoney(this.selectedCustomer.credit_limit),
          total: this.formatMoney(totalDebt)
        })
      }
      return null
    }
  },

  methods: {
    async searchCustomers() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(async () => {
        if (!this.customerSearch) {
          this.customerResults = []
          return
        }
        try {
          const res = await this.$api.getNasiyaCustomers({ search: this.customerSearch, limit: 5 })
          if (res?.data?.success) {
            this.customerResults = res.data.data.filter(c => !c.is_blocked)
          }
        } catch (error) {
          console.error('Search customers error:', error)
        }
      }, 300)
    },

    selectCustomer(customer) {
      this.selectedCustomer = customer
      this.customerSearch = ''
      this.customerResults = []
    },

    clearCustomer() {
      this.selectedCustomer = null
    },

    async searchProducts() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(async () => {
        if (!this.productSearch) {
          this.productResults = []
          return
        }
        try {
          const res = await this.$api.getNasiyaProducts({ search: this.productSearch, active: 'true', limit: 10 })
          if (res?.data?.success) {
            this.productResults = res.data.data
          }
        } catch (error) {
          console.error('Search products error:', error)
        }
      }, 300)
    },

    async handleBarcodeEnter() {
      if (!this.productSearch) return
      try {
        const res = await this.$api.findNasiyaProductByBarcode(this.productSearch)
        if (res?.data?.success) {
          this.addProduct(res.data.data)
          this.productSearch = ''
          this.productResults = []
        }
      } catch (error) {
        // Not found by barcode, normal search will show results
      }
    },

    addProduct(product) {
      const existingIndex = this.items.findIndex(i => i.product.id === product.id)
      if (existingIndex >= 0) {
        this.items[existingIndex].quantity++
      } else {
        this.items.push({
          product,
          product_id: product.id,
          quantity: 1,
          price: product.credit_price || product.sell_price
        })
      }
      this.productSearch = ''
      this.productResults = []
    },

    increaseQuantity(index) {
      this.items[index].quantity++
    },

    decreaseQuantity(index) {
      if (this.items[index].quantity > 1) {
        this.items[index].quantity--
      }
    },

    removeItem(index) {
      this.items.splice(index, 1)
    },

    async saveSale() {
      if (!this.canSave) return

      try {
        this.saving = true
        const data = {
          customer_id: this.selectedCustomer.id,
          items: this.items.map(i => ({
            product_id: i.product_id,
            quantity: i.quantity,
            unit_price: i.price
          })),
          due_date: this.form.due_date,
          initial_payment: this.form.initial_payment || 0,
          notes: this.form.notes,
          sync_to_user: this.form.sync_to_user
        }

        const res = await this.$api.createNasiyaCredit(data)
        if (res?.data?.success) {
          // Sync natijasini ko'rsatish
          if (res.data.synced_to_user) {
            this.$toast?.success(this.$t('nasiya.sale_synced_to_user'))
          } else {
            this.$toast?.success(this.$t('nasiya.sale_completed'))
          }
          this.$router.push(this.localePath({
            name: 'nasiya-credits-id',
            params: { id: res.data.data.id }
          }))
        }
      } catch (error) {
        console.error('Save sale error:', error)
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.saving = false
      }
    },

    getInitials(name) {
      if (!name) return '?'
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    },

    formatMoney(value) {
      if (!value) return '0 UZS'
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
    }
  }
}
</script>
