<template>
  <div class="add-product-page pb-8">
    <!-- Page Header -->
    <div class="mb-6">
      <nuxt-link :to="localePath({ name: 'nasiya-products' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
        {{ isEdit ? $t('nasiya.edit_product') : $t('nasiya.add_product') }}
      </h1>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-2xl shadow-sm p-6">
      <form @submit.prevent="saveProduct">
        <!-- Asosiy ma'lumotlar -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.basic_info') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.product_name') }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="$t('nasiya.product_name_placeholder')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.category') }}
              </label>
              <input
                v-model="form.category"
                type="text"
                list="categories"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="$t('nasiya.category_placeholder')"
              />
              <datalist id="categories">
                <option v-for="cat in categories" :key="cat" :value="cat" />
              </datalist>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.barcode') }}
              </label>
              <input
                v-model="form.barcode"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234567890123"
              />
            </div>
          </div>
        </div>

        <!-- Narxlar -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.pricing') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.cost_price') }}
              </label>
              <div class="relative">
                <input
                  v-model.number="form.cost_price"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16"
                />
                <span class="absolute right-4 top-2 text-gray-500">{{ form.currency }}</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.sell_price') }} <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model.number="form.sell_price"
                  type="number"
                  min="0"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16"
                />
                <span class="absolute right-4 top-2 text-gray-500">{{ form.currency }}</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.credit_price') }}
              </label>
              <div class="relative">
                <input
                  v-model.number="form.credit_price"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16"
                />
                <span class="absolute right-4 top-2 text-gray-500">{{ form.currency }}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ $t('nasiya.credit_price_hint') }}</p>
            </div>
          </div>
        </div>

        <!-- Inventar -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.inventory') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.quantity') }}
              </label>
              <input
                v-model.number="form.quantity"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.unit') }}
              </label>
              <select
                v-model="form.unit"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="dona">{{ $t('nasiya.unit_piece') }}</option>
                <option value="kg">{{ $t('nasiya.unit_kg') }}</option>
                <option value="litr">{{ $t('nasiya.unit_liter') }}</option>
                <option value="metr">{{ $t('nasiya.unit_meter') }}</option>
                <option value="qop">{{ $t('nasiya.unit_bag') }}</option>
                <option value="pachka">{{ $t('nasiya.unit_pack') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.currency') }}
              </label>
              <select
                v-model="form.currency"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="UZS">UZS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div v-if="isEdit" class="mb-8">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="form.is_active"
              type="checkbox"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-gray-700">{{ $t('nasiya.product_active') }}</span>
          </label>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            :disabled="saving"
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors"
          >
            {{ saving ? $t('common.saving') : (isEdit ? $t('common.save') : $t('nasiya.add_product')) }}
          </button>
          <button
            v-if="isEdit"
            type="button"
            class="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors"
            @click="deleteProduct"
          >
            {{ $t('common.delete') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddProductPage',
  middleware: 'auth',

  data() {
    return {
      form: {
        name: '',
        category: '',
        barcode: '',
        cost_price: 0,
        sell_price: 0,
        credit_price: null,
        quantity: 0,
        unit: 'dona',
        currency: 'UZS',
        is_active: true
      },
      categories: [],
      saving: false,
      loading: false
    }
  },

  computed: {
    isEdit() {
      return !!this.$route.query.edit
    },
    productId() {
      return this.$route.query.edit
    }
  },

  async mounted() {
    await this.loadCategories()
    if (this.isEdit) {
      await this.loadProduct()
    }
  },

  methods: {
    async loadProduct() {
      try {
        this.loading = true
        const res = await this.$api.getNasiyaProductById(this.productId)
        if (res?.data?.success) {
          const data = res.data.data
          this.form = {
            name: data.name || '',
            category: data.category || '',
            barcode: data.barcode || '',
            cost_price: data.cost_price || 0,
            sell_price: data.sell_price || 0,
            credit_price: data.credit_price || null,
            quantity: data.quantity || 0,
            unit: data.unit || 'dona',
            currency: data.currency || 'UZS',
            is_active: data.is_active !== false
          }
        }
      } catch (error) {
        console.error('Load product error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
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

    async saveProduct() {
      if (!this.form.name || !this.form.sell_price) {
        this.$toast?.error(this.$t('nasiya.required_fields'))
        return
      }

      try {
        this.saving = true
        let res
        if (this.isEdit) {
          res = await this.$api.updateNasiyaProduct(this.productId, this.form)
        } else {
          res = await this.$api.createNasiyaProduct(this.form)
        }

        if (res?.data?.success) {
          this.$toast?.success(this.$t('nasiya.product_saved'))
          this.$router.push(this.localePath({ name: 'nasiya-products' }))
        }
      } catch (error) {
        console.error('Save product error:', error)
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.saving = false
      }
    },

    async deleteProduct() {
      if (!confirm(this.$t('nasiya.confirm_delete_product'))) return

      try {
        const res = await this.$api.deleteNasiyaProduct(this.productId)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('nasiya.product_deleted'))
          this.$router.push(this.localePath({ name: 'nasiya-products' }))
        }
      } catch (error) {
        console.error('Delete product error:', error)
        this.$toast?.error(this.$t('errors.operationFailed'))
      }
    }
  }
}
</script>
