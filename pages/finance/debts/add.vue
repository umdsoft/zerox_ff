<template>
  <div class="add-debt pb-8">
    <!-- Page Header -->
    <div class="mb-6">
      <nuxt-link :to="localePath({ name: 'finance-debts' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.add_debt') }}</h1>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-2xl p-6 shadow-sm max-w-2xl">
      <form @submit.prevent="submitForm">
        <!-- Debt Type -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">{{ $t('finance.debt_type') }}</label>
          <div class="grid grid-cols-2 gap-4">
            <button
              type="button"
              @click="form.type = 'borrowed'"
              class="p-4 rounded-xl border-2 transition-all text-left"
              :class="form.type === 'borrowed' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="flex items-center mb-2">
                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                  </svg>
                </div>
                <span class="font-semibold" :class="form.type === 'borrowed' ? 'text-red-700' : 'text-gray-700'">
                  {{ $t('finance.borrowed') }}
                </span>
              </div>
              <p class="text-sm text-gray-500">{{ $t('finance.borrowed_desc') }}</p>
            </button>

            <button
              type="button"
              @click="form.type = 'lent'"
              class="p-4 rounded-xl border-2 transition-all text-left"
              :class="form.type === 'lent' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="flex items-center mb-2">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                </div>
                <span class="font-semibold" :class="form.type === 'lent' ? 'text-green-700' : 'text-gray-700'">
                  {{ $t('finance.lent') }}
                </span>
              </div>
              <p class="text-sm text-gray-500">{{ $t('finance.lent_desc') }}</p>
            </button>
          </div>
        </div>

        <!-- Person Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.person_name') }} *</label>
          <input
            v-model="form.source_name"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="$t('finance.person_name_placeholder')"
          />
        </div>

        <!-- Amount -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.amount') }} *</label>
          <div class="relative">
            <input
              v-model="form.amount"
              type="number"
              required
              min="1000"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16"
              placeholder="100 000"
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
              :class="form.currency === 'UZS' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              UZS
            </button>
            <button
              type="button"
              @click="form.currency = 'USD'"
              class="flex-1 py-3 rounded-xl font-medium transition-colors"
              :class="form.currency === 'USD' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              USD
            </button>
          </div>
        </div>

        <!-- Source Type -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.source_type') }}</label>
          <select
            v-model="form.source_type"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="bank">{{ $t('finance.source_bank') }}</option>
            <option value="family">{{ $t('finance.source_family') }}</option>
            <option value="friend">{{ $t('finance.source_friend') }}</option>
            <option value="other">{{ $t('finance.source_other') }}</option>
          </select>
        </div>

        <!-- Debt Date -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.debt_date') }} *</label>
          <input
            v-model="form.start_date"
            type="date"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Due Date -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.due_date') }}</label>
          <input
            v-model="form.due_date"
            type="date"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Interest Rate -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.interest_rate') }} (%)</label>
          <input
            v-model="form.interest_rate"
            type="number"
            min="0"
            max="100"
            step="0.1"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>

        <!-- Description -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('finance.notes') }}</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :placeholder="$t('finance.notes_placeholder')"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-colors"
        >
          <span v-if="loading">{{ $t('common.loading') }}</span>
          <span v-else>{{ $t('common.save') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddDebt',
  middleware: 'auth',

  data() {
    return {
      form: {
        type: 'borrowed',
        source_name: '',
        amount: '',
        currency: 'UZS',
        source_type: 'other',
        start_date: new Date().toISOString().split('T')[0],
        due_date: '',
        interest_rate: 0,
        notes: ''
      },
      loading: false
    }
  },

  methods: {
    async submitForm() {
      try {
        this.loading = true
        const res = await this.$api.createDebt(this.form)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.debt_added'))
          this.$router.push(this.localePath({ name: 'finance-debts' }))
        }
      } catch (error) {
        console.error('Create debt error:', error)
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
