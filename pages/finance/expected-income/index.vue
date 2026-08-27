<template>
  <div class="expected-income-page pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <nuxt-link :to="localePath({ name: 'finance' })" class="text-green-600 hover:text-green-700 text-sm mb-2 inline-block">
          ← {{ $t('common.back') }}
        </nuxt-link>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.expected_incomes') }}</h1>
        <p class="text-gray-500 mt-1">{{ $t('finance.expected_incomes_desc') }}</p>
      </div>
      <button
        @click="openCreate"
        class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        {{ $t('finance.add_expected_income') }}
      </button>
    </div>

    <!-- Incomes List -->
    <div v-if="incomes.length" class="space-y-4">
      <div
        v-for="p in incomes"
        :key="p.id"
        class="bg-white rounded-2xl shadow-sm p-5"
        :class="{ 'opacity-60': !p.is_active }"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center">
            <span class="text-3xl mr-4">{{ typeIcon(p.income_type) }}</span>
            <div>
              <p class="font-semibold text-gray-900">{{ p.title }}</p>
              <p class="text-sm text-gray-500">{{ typeLabel(p.income_type) }}</p>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
                <span v-if="p.frequency !== 'once'">📅 {{ $t('finance.every_month_day', { day: p.day_of_month }) }}</span>
                <span v-else>📅 {{ formatDate(p.once_date || p.next_date) }}</span>
                <span v-if="p.frequency !== 'once'">➡️ {{ $t('finance.next_income') }}: {{ formatDate(p.next_date) }}</span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-green-600">{{ formatMoney(p.amount, p.currency) }}</p>
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
            @click="confirmReceived(p)"
            :disabled="confirmingId === p.id"
            class="text-sm px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium"
          >
            {{ confirmingId === p.id ? $t('common.loading') : $t('finance.expected_received') }}
          </button>
          <button
            v-if="p.frequency !== 'once'"
            @click="skipIncome(p)"
            :disabled="skippingId === p.id"
            class="text-sm px-3 py-1.5 text-amber-600 hover:bg-amber-50 disabled:opacity-50 rounded-lg font-medium"
          >
            {{ skippingId === p.id ? $t('common.loading') : $t('finance.expected_skip') }}
          </button>
          <button @click="openEdit(p)" class="text-sm px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg">
            {{ $t('common.edit') }}
          </button>
          <button @click="openDetail(p)" class="text-sm px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
            {{ $t('common.details') }}
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
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('finance.no_expected_incomes') }}</h3>
      <p class="text-gray-500 mb-4">{{ $t('finance.no_expected_incomes_desc') }}</p>
      <button
        @click="openCreate"
        class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
      >
        {{ $t('finance.add_expected_income') }}
      </button>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="closeForm"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ editingId ? $t('finance.edit_expected_income') : $t('finance.add_expected_income') }}
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
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            />
          </div>

          <!-- Category (required) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ $t('finance.category') }}<span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option :value="null" disabled>{{ $t('finance.select_category') }}</option>
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
                class="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              />
              <div class="flex rounded-xl border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  @click="form.currency = 'UZS'"
                  :class="form.currency === 'UZS' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'"
                  class="px-3 text-sm font-medium"
                >UZS</button>
                <button
                  type="button"
                  @click="form.currency = 'USD'"
                  :class="form.currency === 'USD' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'"
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
                :class="form.frequency === 'monthly' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'"
                class="flex-1 px-3 py-2 text-sm font-medium"
              >{{ $t('finance.freq_monthly') }}</button>
              <button
                type="button"
                @click="form.frequency = 'once'"
                :class="form.frequency === 'once' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'"
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
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
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
              :disabled-date="disablePast"
              class="w-full"
              input-class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            />
          </div>

          <!-- Active toggle -->
          <label class="flex items-center justify-between cursor-pointer py-1">
            <span class="text-sm text-gray-700">{{ $t('finance.active') }}</span>
            <span class="relative inline-flex items-center">
              <input v-model="form.is_active" type="checkbox" class="sr-only peer" />
              <span class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors"></span>
              <span class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></span>
            </span>
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
              class="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-medium"
            >
              {{ saving ? $t('common.loading') : $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Detail Modal (Batafsil) -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="closeDetail"></div>
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-md">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <span class="text-4xl mr-3">{{ (detailIncome && detailCategory(detailIncome)) ? detailCategory(detailIncome).icon : typeIcon(detailIncome?.income_type) }}</span>
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ detailIncome?.title }}</h3>
              <p class="text-sm text-gray-500">
                {{ (detailIncome && detailCategory(detailIncome)) ? getCategoryName(detailCategory(detailIncome).name) : typeLabel(detailIncome?.income_type) }}
              </p>
            </div>
          </div>
          <button @click="closeDetail" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <!-- Status pill -->
        <span
          class="inline-block mb-4 px-2 py-0.5 rounded-full text-xs font-medium"
          :class="detailIncome?.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
        >
          {{ detailIncome?.is_active ? $t('finance.active') : $t('finance.inactive') }}
        </span>

        <!-- Amount -->
        <div class="bg-gray-50 rounded-xl p-4 mb-4 text-center">
          <p class="text-2xl font-bold text-green-600">{{ formatMoney(detailIncome?.amount, detailIncome?.currency) }}</p>
        </div>

        <!-- Schedule + next date -->
        <div class="space-y-2 text-sm mb-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-500">📅 {{ $t('finance.frequency') }}</span>
            <span class="font-medium text-gray-900 text-right">
              <template v-if="detailIncome?.frequency !== 'once'">{{ $t('finance.every_month_day', { day: detailIncome?.day_of_month }) }}</template>
              <template v-else>{{ formatDate(detailIncome?.once_date || detailIncome?.next_date) }}</template>
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-500">➡️ {{ $t('finance.next_income') }}</span>
            <span class="font-medium text-gray-900">{{ formatDate(detailIncome?.next_date) }}</span>
          </div>
        </div>

        <button
          @click="closeDetail"
          class="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
        >
          {{ $t('common.close') }}
        </button>
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
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ $t('finance.confirm_delete_expected') }}</h3>
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
  name: 'ExpectedIncomePage',
  middleware: 'auth',

  data() {
    return {
      incomes: [],
      categories: [],
      loading: true,
      showForm: false,
      editingId: null,
      saving: false,
      confirmingId: null,
      skippingId: null,
      showDeleteModal: false,
      deleteTarget: null,
      deleteLoading: false,
      showDetailModal: false,
      detailIncome: null,
      form: this.emptyForm()
    }
  },

  computed: {
    // Datepicker o'zbek/rus lokali (i18n locale asosida)
    dpLang() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn')
    },

    incomeTypes() {
      return [
        { value: 'oylik', icon: '💼', label: this.$t('finance.itype_oylik') },
        { value: 'biznes', icon: '🏢', label: this.$t('finance.itype_biznes') },
        { value: 'ijara', icon: '🏠', label: this.$t('finance.itype_ijara') },
        { value: 'dividend', icon: '📈', label: this.$t('finance.itype_dividend') },
        { value: 'boshqa', icon: '💰', label: this.$t('finance.itype_boshqa') }
      ]
    },

    amountDisplay: {
      get() {
        if (this.form.amount === '' || this.form.amount === null || this.form.amount === undefined) return ''
        return Number(this.form.amount).toLocaleString('uz-UZ').replace(/,/g,' ')
      },
      set(val) {
        const digits = String(val).replace(/\D/g, '')
        this.form.amount = digits ? parseInt(digits, 10) : ''
      }
    }
  },

  async mounted() {
    await Promise.all([this.loadIncomes(), this.loadCategories()])
  },

  methods: {
    emptyForm() {
      return {
        title: '',
        income_type: 'oylik',
        category_id: null,
        amount: '',
        currency: 'UZS',
        day_of_month: 1,
        frequency: 'monthly',
        once_date: '',
        is_active: true
      }
    },

    async loadIncomes() {
      try {
        this.loading = true
        const res = await this.$axios.get('/finance/scheduled-incomes')
        if (res?.data?.success) {
          this.incomes = res.data.data
        }
      } catch (error) {
        console.error('Load scheduled incomes error:', error)
      } finally {
        this.loading = false
      }
    },

    async loadCategories() {
      try {
        const res = await this.$axios.get('/finance/incomes/categories')
        if (res?.data?.success) {
          this.categories = res.data.data
        }
      } catch (error) {
        console.error('Load income categories error:', error)
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
        income_type: p.income_type || 'boshqa',
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
      if (!this.form.title || !this.form.amount || !this.form.category_id) {
        this.$toast?.error(this.$t('finance.fill_required_fields'))
        return
      }

      const payload = {
        title: this.form.title,
        income_type: this.form.income_type,
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
          res = await this.$axios.put(`/finance/scheduled-incomes/${this.editingId}`, payload)
        } else {
          res = await this.$axios.post('/finance/scheduled-incomes', payload)
        }
        if (res?.data?.success) {
          this.$toast?.success(this.editingId ? this.$t('finance.expected_updated') : this.$t('finance.expected_added'))
          this.closeForm()
          await this.loadIncomes()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.saving = false
      }
    },

    async confirmReceived(p) {
      try {
        this.confirmingId = p.id
        const res = await this.$axios.post(`/finance/scheduled-incomes/${p.id}/confirm`)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.income_received'))
          await this.loadIncomes()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.confirmingId = null
      }
    },

    async skipIncome(p) {
      try {
        this.skippingId = p.id
        const res = await this.$axios.post(`/finance/scheduled-incomes/${p.id}/skip`)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.income_skipped'))
          await this.loadIncomes()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.skippingId = null
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
        const res = await this.$axios.delete(`/finance/scheduled-incomes/${id}`)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.expected_deleted'))
          this.showDeleteModal = false
          this.deleteTarget = null
          await this.loadIncomes()
        }
      } catch (error) {
        this.$toast?.error(this.$t('errors.operationFailed'))
      } finally {
        this.deleteLoading = false
      }
    },

    openDetail(p) {
      this.detailIncome = p
      this.showDetailModal = true
    },

    closeDetail() {
      this.showDetailModal = false
      this.detailIncome = null
    },

    detailCategory(p) {
      if (!p || !p.category_id) return null
      return this.categories.find(c => c.id === p.category_id) || null
    },

    disablePast(date) {
      const t = new Date()
      t.setHours(0, 0, 0, 0)
      return date < t
    },

    typeLabel(type) {
      const found = this.incomeTypes.find(t => t.value === type)
      return found ? found.label : this.$t('finance.itype_boshqa')
    },

    typeIcon(type) {
      const found = this.incomeTypes.find(t => t.value === type)
      return found ? found.icon : '💰'
    },

    formatMoney(value, currency = 'UZS') {
      const cur = currency || 'UZS'
      if (!value) return '0 ' + cur
      return Number(value).toLocaleString('uz-UZ').replace(/,/g,' ') + ' ' + cur
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
