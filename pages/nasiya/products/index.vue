<template>
  <div class="products-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'nasiya' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('nasiya.products') }}</h1>
      </div>
      <nuxt-link
        :to="localePath({ name: 'nasiya-products-add' })"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        {{ $t('nasiya.add_product') }}
      </nuxt-link>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white rounded-2xl p-4 shadow-sm mb-6">
      <div class="flex flex-wrap gap-3">
        <input
          v-model="search"
          type="text"
          :placeholder="$t('nasiya.search_product')"
          class="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @input="debouncedSearch"
        />
        <select
          v-model="filterCategory"
          class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          @change="loadProducts"
        >
          <option value="">{{ $t('nasiya.all_categories') }}</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <select
          v-model="filterActive"
          class="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          @change="loadProducts"
        >
          <option value="">{{ $t('nasiya.all_products') }}</option>
          <option value="true">{{ $t('nasiya.active_only') }}</option>
          <option value="false">{{ $t('nasiya.inactive_only') }}</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="products.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer"
        :class="{ 'opacity-60': !product.is_active }"
        @click="editProduct(product)"
      >
        <div class="p-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 line-clamp-1">{{ product.name }}</h3>
              <p v-if="product.category" class="text-sm text-gray-500">{{ product.category }}</p>
            </div>
            <span v-if="!product.is_active" class="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
              {{ $t('nasiya.inactive') }}
            </span>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ $t('nasiya.sell_price') }}:</span>
              <span class="font-bold text-gray-900">{{ formatMoney(product.sell_price) }}</span>
            </div>
            <div v-if="product.credit_price" class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ $t('nasiya.credit_price') }}:</span>
              <span class="font-semibold text-blue-600">{{ formatMoney(product.credit_price) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ $t('nasiya.quantity') }}:</span>
              <span :class="product.quantity > 0 ? 'text-green-600' : 'text-red-600'">
                {{ product.quantity }} {{ product.unit }}
              </span>
            </div>
          </div>

          <div v-if="product.barcode" class="mt-3 pt-3 border-t border-gray-100">
            <p class="text-xs text-gray-400 font-mono">{{ product.barcode }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl p-12 shadow-sm text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('nasiya.no_products') }}</h3>
      <p class="text-gray-500 mb-4">{{ $t('nasiya.no_products_desc') }}</p>
      <nuxt-link
        :to="localePath({ name: 'nasiya-products-add' })"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        {{ $t('nasiya.add_first_product') }}
      </nuxt-link>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > pagination.limit" class="mt-6 flex justify-center">
      <div class="bg-white rounded-xl shadow-sm p-2 flex gap-2">
        <button
          :disabled="pagination.page === 1"
          class="px-3 py-1 rounded-lg border disabled:opacity-50"
          @click="changePage(-1)"
        >
          ←
        </button>
        <span class="px-3 py-1">{{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.limit) }}</span>
        <button
          :disabled="pagination.page >= Math.ceil(pagination.total / pagination.limit)"
          class="px-3 py-1 rounded-lg border disabled:opacity-50"
          @click="changePage(1)"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NasiyaProductsPage',
  middleware: 'auth',

  data() {
    return {
      products: [],
      categories: [],
      search: '',
      filterCategory: '',
      filterActive: '',
      pagination: {
        page: 1,
        limit: 20,
        total: 0
      },
      loading: true,
      searchTimeout: null
    }
  },

  async mounted() {
    await Promise.all([
      this.loadProducts(),
      this.loadCategories()
    ])
  },

  methods: {
    async loadProducts() {
      try {
        this.loading = true
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        if (this.search) params.search = this.search
        if (this.filterCategory) params.category = this.filterCategory
        if (this.filterActive) params.active = this.filterActive

        const res = await this.$api.getNasiyaProducts(params)
        if (res?.data?.success) {
          this.products = res.data.data
          if (res.data.pagination) {
            this.pagination.total = res.data.pagination.total
          }
        }
      } catch (error) {
        console.error('Load products error:', error)
      } finally {
        this.loading = false
      }
    },

    async loadCategories() {
      try {
        const res = await this.$api.getNasiyaProductCategories()
        if (res?.data?.success) {
          this.categories = res.data.data
        }
      } catch (error) {
        console.error('Load categories error:', error)
      }
    },

    debouncedSearch() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1
        this.loadProducts()
      }, 300)
    },

    changePage(delta) {
      this.pagination.page += delta
      this.loadProducts()
    },

    editProduct(product) {
      this.$router.push(this.localePath({
        name: 'nasiya-products-add',
        query: { edit: product.id }
      }))
    },

    formatMoney(value) {
      if (!value) return '0 UZS'
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
    }
  }
}
</script>
