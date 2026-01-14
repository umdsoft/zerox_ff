<template>
  <div class="add-customer-page pb-8">
    <!-- Page Header -->
    <div class="mb-6">
      <nuxt-link :to="localePath({ name: 'nasiya-customers' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
        {{ isEdit ? $t('nasiya.edit_customer') : $t('nasiya.add_customer') }}
      </h1>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-2xl shadow-sm p-6">
      <form @submit.prevent="saveCustomer">
        <!-- Asosiy ma'lumotlar -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.basic_info') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.full_name') }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.full_name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="$t('nasiya.full_name_placeholder')"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.phone') }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.phone"
                type="tel"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.address') }}
              </label>
              <input
                v-model="form.address"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="$t('nasiya.address_placeholder')"
              />
            </div>
          </div>
        </div>

        <!-- Kafil ma'lumotlari -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.guarantor_info') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.guarantor_name') }}
              </label>
              <input
                v-model="form.guarantor_name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.guarantor_phone') }}
              </label>
              <input
                v-model="form.guarantor_phone"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+998 90 123 45 67"
              />
            </div>
          </div>
        </div>

        <!-- Kredit sozlamalari -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.credit_settings') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.credit_limit') }}
              </label>
              <div class="relative">
                <input
                  v-model.number="form.credit_limit"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16"
                />
                <span class="absolute right-4 top-2 text-gray-500">UZS</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ $t('nasiya.credit_limit_hint') }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ $t('nasiya.trust_rating') }}
              </label>
              <div class="flex items-center gap-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  class="text-2xl focus:outline-none"
                  @click="form.trust_rating = star"
                >
                  {{ star <= form.trust_rating ? '⭐' : '☆' }}
                </button>
                <span class="ml-2 text-sm text-gray-500">{{ form.trust_rating }}/5</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div v-if="isEdit" class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.status') }}</h3>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="form.is_blocked"
              type="checkbox"
              class="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span class="text-gray-700">{{ $t('nasiya.block_customer') }}</span>
          </label>
          <p class="text-sm text-gray-500 mt-1">{{ $t('nasiya.block_hint') }}</p>
        </div>

        <!-- Izoh -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('nasiya.notes') }}
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="$t('nasiya.notes_placeholder')"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            :disabled="saving"
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors"
          >
            {{ saving ? $t('common.saving') : (isEdit ? $t('common.save') : $t('nasiya.add_customer')) }}
          </button>
          <button
            v-if="isEdit"
            type="button"
            class="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-colors"
            @click="deleteCustomer"
          >
            {{ $t('common.delete') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Customer Stats (Edit mode) -->
    <div v-if="isEdit && customerStats" class="bg-white rounded-2xl shadow-sm p-6 mt-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('nasiya.customer_stats') }}</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('nasiya.total_purchases') }}</p>
          <p class="text-xl font-bold text-gray-900">{{ formatMoney(customerStats.total_purchases) }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('nasiya.total_paid') }}</p>
          <p class="text-xl font-bold text-green-600">{{ formatMoney(customerStats.total_paid) }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('nasiya.current_debt') }}</p>
          <p class="text-xl font-bold text-red-600">{{ formatMoney(customerStats.total_debt) }}</p>
        </div>
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-sm text-gray-500">{{ $t('nasiya.credits_count') }}</p>
          <p class="text-xl font-bold text-blue-600">{{ customerStats.active_credits || 0 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddCustomerPage',
  middleware: 'auth',

  data() {
    return {
      form: {
        full_name: '',
        phone: '',
        address: '',
        guarantor_name: '',
        guarantor_phone: '',
        credit_limit: 0,
        trust_rating: 3,
        is_blocked: false,
        notes: ''
      },
      customerStats: null,
      saving: false,
      loading: false
    }
  },

  computed: {
    isEdit() {
      return !!this.$route.query.edit
    },
    customerId() {
      return this.$route.query.edit
    }
  },

  async mounted() {
    if (this.isEdit) {
      await this.loadCustomer()
    }
  },

  methods: {
    async loadCustomer() {
      try {
        this.loading = true
        const res = await this.$api.getNasiyaCustomerById(this.customerId)
        if (res?.data?.success) {
          const data = res.data.data
          this.form = {
            full_name: data.full_name || '',
            phone: data.phone || '',
            address: data.address || '',
            guarantor_name: data.guarantor_name || '',
            guarantor_phone: data.guarantor_phone || '',
            credit_limit: data.credit_limit || 0,
            trust_rating: data.trust_rating || 3,
            is_blocked: data.is_blocked || false,
            notes: data.notes || ''
          }
          this.customerStats = {
            total_purchases: data.total_purchases,
            total_paid: data.total_paid,
            total_debt: data.total_debt,
            active_credits: data.active_credits
          }
        }
      } catch (error) {
        console.error('Load customer error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    async saveCustomer() {
      if (!this.form.full_name || !this.form.phone) {
        this.$toast?.error(this.$t('nasiya.required_fields'))
        return
      }

      try {
        this.saving = true
        let res
        if (this.isEdit) {
          res = await this.$api.updateNasiyaCustomer(this.customerId, this.form)
        } else {
          res = await this.$api.createNasiyaCustomer(this.form)
        }

        if (res?.data?.success) {
          this.$toast?.success(this.$t('nasiya.customer_saved'))
          this.$router.push(this.localePath({ name: 'nasiya-customers' }))
        }
      } catch (error) {
        console.error('Save customer error:', error)
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.saving = false
      }
    },

    async deleteCustomer() {
      if (!confirm(this.$t('nasiya.confirm_delete_customer'))) return

      try {
        const res = await this.$api.deleteNasiyaCustomer(this.customerId)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('nasiya.customer_deleted'))
          this.$router.push(this.localePath({ name: 'nasiya-customers' }))
        }
      } catch (error) {
        console.error('Delete customer error:', error)
        this.$toast?.error(this.$t('errors.operationFailed'))
      }
    },

    formatMoney(value) {
      if (!value) return '0 UZS'
      return Number(value).toLocaleString('uz-UZ') + ' UZS'
    }
  }
}
</script>
