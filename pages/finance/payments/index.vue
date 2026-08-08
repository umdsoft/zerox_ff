<template>
  <div class="scheduled-payments-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'finance' })" class="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.scheduled_payments') }}</h1>
        <p class="text-gray-500 mt-1">{{ $t('finance.scheduled_payments_desc') }}</p>
      </div>
      <button
        @click="openCreate"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        {{ $t('finance.add_scheduled_payment') }}
      </button>
    </div>

    <!-- Payments List -->
    <div v-if="payments.length" class="space-y-4">
      <div
        v-for="p in payments"
        :key="p.id"
        class="bg-white rounded-2xl shadow-sm p-5"
        :class="{ 'opacity-60': !p.is_active }"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center">
            <span class="text-3xl mr-4">{{ typeIcon(p.payment_type) }}</span>
            <div>
              <p class="font-semibold text-gray-900">{{ p.title }}</p>
              <p class="text-sm text-gray-500">{{ typeLabel(p.payment_type) }}</p>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
                <span>📅 {{ $t('finance.every_month_day', { day: p.day_of_month }) }}</span>
                <span>➡️ {{ $t('finance.next_payment') }}: {{ formatDate(p.next_date) }}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-gray-900">{{ formatMoney(p.amount, p.currency) }}</p>
            <span
              class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
              :class="p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
            >
              {{ p.is_active ? $t('finance.active') : $t('finance.inactive') }}
            </span>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap justify-end gap-2">
          <button
            @click="confirmPay(p)"
            :disabled="confirmingId === p.id"
            class="text-sm px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium"
          >
            {{ confirmingId === p.id ? $t('common.loading') : $t('finance.mark_paid') }}
          </button>
          <button @click="openEdit(p)" class="text-sm px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
            {{ $t('common.edit') }}
          </button>
          <button @click="askDelete(p)" class="text-sm px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg">
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-white rounded-2xl shadow-sm p-12 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('finance.no_scheduled_payments') }}</h3>
      <p class="text-gray-500 mb-4">{{ $t('finance.no_scheduled_payments_desc') }}</p>
      <button
        @click="openCreate"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        {{ $t('finance.add_scheduled_payment') }}
      </button>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="closeForm"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ editingId ? $t('finance.edit_scheduled_payment') : $t('finance.add_scheduled_payment') }}
        </h3>

        <form @submit.prevent="save" class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.payment_title') }}</label>
            <input
              v-model="form.title"
              type="text"
              required
              :placeholder="$t('finance.payment_title_placeholder')"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Payment type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.payment_type') }}</label>
            <select
              v-model="form.payment_type"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="t in paymentTypes" :key="t.value" :value="t.value">
                {{ t.icon }} {{ t.label }}
              </option>
            </select>
          </div>

          <!-- Category (optional) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('finance.category') }} <span class="text-gray-400">({{ $t('common.optional') }})</span>
            </label>
            <select
              v-model="form.category_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option :value="null">{{ $t('finance.no_category') }}</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.icon }} {{ getCategoryName(cat.name) }}
              </option>
            </select>
          </div>

          <!-- Amount + Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.amount') }}</label>
            <div class="flex gap-2">
              <input
                v-model="amountDisplay"
                type="text"
                inputmode="numeric"
                required
                placeholder="0"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <div class="flex rounded-xl border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  @click="form.currency = 'UZS'"
                  :class="form.currency === 'UZS' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'"
                  class="px-3 text-sm font-medium"
                >UZS</button>
                <button
                  type="button"
                  @click="form.currency = 'USD'"
                  :class="form.currency === 'USD' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'"
                  class="px-3 text-sm font-medium"
                >USD</button>
              </div>
            </div>
          </div>

          <!-- Frequency toggle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.frequency') }}</label>
            <div class="flex rounded-xl border border-gray-300 overflow-hidden">
              <button
                type="button"
                @click="form.frequency = 'monthly'"
                :class="form.frequency === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'"
                class="flex-1 px-3 py-2 text-sm font-medium"
              >{{ $t('finance.freq_monthly') }}</button>
              <button
                type="button"
                @click="form.frequency = 'once'"
                :class="form.frequency === 'once' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'"
                class="flex-1 px-3 py-2 text-sm font-medium"
              >{{ $t('finance.freq_once') }}</button>
            </div>
          </div>

          <!-- Day of month (monthly) -->
          <div v-if="form.frequency === 'monthly'">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.day_of_month') }}</label>
            <input
              v-model.number="form.day_of_month"
              type="number"
              min="1"
              max="31"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-400 mt-1">{{ $t('finance.day_of_month_hint') }}</p>
          </div>

          <!-- Once date -->
          <div v-else>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.once_date') }}</label>
            <date-picker
              v-model="form.once_date"
              value-type="YYYY-MM-DD"
              format="DD.MM.YYYY"
              :lang="dpLang"
              :editable="false"
              class="w-full"
              input-class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Active toggle -->
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.is_active" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600" />
            <span class="text-sm text-gray-700">{{ $t('finance.active') }}</span>
          </label>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="closeForm"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium"
            >
              {{ saving ? $t('common.loading') : $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Modal (markaziy custom modal) -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showDeleteModal = false"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-sm text-center">
        <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ $t('finance.confirm_delete_scheduled') }}</h3>
        <p v-if="deleteTarget" class="text-sm text-gray-500 mb-5">
          {{ deleteTarget.title }} — {{ formatMoney(deleteTarget.amount, deleteTarget.currency) }}
        </p>
        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="doDelete"
            :disabled="deleteLoading"
            class="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-medium"
          >
            {{ deleteLoading ? $t('common.loading') : $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScheduledPaymentsPage',
  middleware: 'auth',

  data() {
    return {
      payments: [],
      categories: [],
      loading: true,
      showForm: false,
      editingId: null,
      saving: false,
      confirmingId: null,
      showDeleteModal: false,
      deleteTarget: null,
      deleteLoading: false,
      form: this.emptyForm()
    }
  },

  computed: {
    // Datepicker o'zbek/rus lokali (i18n locale asosida)
    dpLang() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn')
    },

    paymentTypes() {
      return [
        { value: 'ijara', icon: '🏠', label: this.$t('finance.type_ijara') },
        { value: 'telefon', icon: '📱', label: this.$t('finance.type_telefon') },
        { value: 'kredit', icon: '🏦', label: this.$t('finance.type_kredit') },
        { value: 'kommunal', icon: '💡', label: this.$t('finance.type_kommunal') },
        { value: 'internet', icon: '🌐', label: this.$t('finance.type_internet') },
        { value: 'bogcha', icon: '🧸', label: this.$t('finance.type_bogcha') },
        { value: 'maktab', icon: '🎒', label: this.$t('finance.type_maktab') },
        { value: 'boshqa', icon: '📦', label: this.$t('finance.type_boshqa') }
      ]
    },

    amountDisplay: {
      get() {
        if (this.form.amount === '' || this.form.amount === null || this.form.amount === undefined) return ''
        return Number(this.form.amount).toLocaleString('uz-UZ')
      },
      set(val) {
        const digits = String(val).replace(/\D/g, '')
        this.form.amount = digits ? parseInt(digits, 10) : ''
      }
    }
  },

  async mounted() {
    await Promise.all([this.loadPayments(), this.loadCategories()])
  },

  methods: {
    emptyForm() {
      return {
        title: '',
        payment_type: 'ijara',
        category_id: null,
        amount: '',
        currency: 'UZS',
        day_of_month: 1,
        frequency: 'monthly',
        once_date: '',
        is_active: true
      }
    },

    async loadPayments() {
      try {
        this.loading = true
        const res = await this.$axios.get('/finance/scheduled-payments')
        if (res?.data?.success) {
          this.payments = res.data.data
        }
      } catch (error) {
        console.error('Load scheduled payments error:', error)
      } finally {
        this.loading = false
      }
    },

    async loadCategories() {
      try {
        const res = await this.$axios.get('/finance/expenses/categories')
        if (res?.data?.success) {
          this.categories = res.data.data
        }
      } catch (error) {
        console.error('Load categories error:', error)
      }
    },

    openCreate() {
      this.editingId = null
      this.form = this.emptyForm()
      this.showForm = true
    },

    openEdit(p) {
      this.editingId = p.id
      this.form = {
        title: p.title,
        payment_type: p.payment_type || 'boshqa',
        category_id: p.category_id || null,
        amount: p.amount ? Number(p.amount) : '',
        currency: p.currency || 'UZS',
        day_of_month: p.day_of_month,
        frequency: p.frequency || 'monthly',
        once_date: (p.frequency === 'once' && p.next_date) ? String(p.next_date).slice(0, 10) : '',
        is_active: !!p.is_active
      }
      this.showForm = true
    },

    closeForm() {
      this.showForm = false
      this.editingId = null
    },

    async save() {
      if (!this.form.title || !this.form.amount) {
        this.$toast?.error(this.$t('finance.fill_required_fields'))
        return
      }

      const payload = {
        title: this.form.title,
        payment_type: this.form.payment_type,
        category_id: this.form.category_id || null,
        amount: Number(this.form.amount),
        currency: this.form.currency,
        frequency: this.form.frequency,
        is_active: this.form.is_active
      }

      if (this.form.frequency === 'once') {
        if (!this.form.once_date) {
          this.$toast?.error(this.$t('finance.fill_required_fields'))
          return
        }
        payload.once_date = this.form.once_date
      } else {
        const dom = parseInt(this.form.day_of_month, 10)
        if (isNaN(dom) || dom < 1 || dom > 31) {
          this.$toast?.error(this.$t('finance.day_of_month_hint'))
          return
        }
        payload.day_of_month = dom
      }

      try {
        this.saving = true
        let res
        if (this.editingId) {
          res = await this.$axios.put(`/finance/scheduled-payments/${this.editingId}`, payload)
        } else {
          res = await this.$axios.post('/finance/scheduled-payments', payload)
        }
        if (res?.data?.success) {
          this.$toast?.success(this.editingId ? this.$t('finance.scheduled_updated') : this.$t('finance.scheduled_added'))
          this.closeForm()
          await this.loadPayments()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.saving = false
      }
    },

    async confirmPay(p) {
      try {
        this.confirmingId = p.id
        const res = await this.$axios.post(`/finance/scheduled-payments/${p.id}/confirm`)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.payment_confirmed'))
          await this.loadPayments()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.confirmingId = null
      }
    },

    askDelete(p) {
      this.deleteTarget = p
      this.showDeleteModal = true
    },

    async doDelete() {
      const id = this.deleteTarget?.id
      if (!id) return
      try {
        this.deleteLoading = true
        const res = await this.$axios.delete(`/finance/scheduled-payments/${id}`)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.scheduled_deleted'))
          this.showDeleteModal = false
          this.deleteTarget = null
          await this.loadPayments()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.deleteLoading = false
      }
    },

    typeLabel(type) {
      const found = this.paymentTypes.find(t => t.value === type)
      return found ? found.label : this.$t('finance.type_boshqa')
    },

    typeIcon(type) {
      const found = this.paymentTypes.find(t => t.value === type)
      return found ? found.icon : '📦'
    },

    formatMoney(value, currency = 'UZS') {
      const cur = currency || 'UZS'
      if (!value) return '0 ' + cur
      return Number(value).toLocaleString('uz-UZ') + ' ' + cur
    },

    formatDate(date) {
      if (!date) return '-'
      const d = new Date(String(date).slice(0, 10) + 'T00:00:00')
      if (isNaN(d)) return date
      return d.toLocaleDateString('uz-UZ')
    },

    getCategoryName(name) {
      if (!name) return null
      const key = `finance.${name}`
      const translated = this.$t(key)
      return translated === key ? name : translated
    }
  }
}
</script>
