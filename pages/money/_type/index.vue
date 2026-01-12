<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-6">
      <div :class="['bg-gradient-to-r rounded-2xl p-6 shadow-lg', headerGradient]">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.go(-1)"
              class="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-white">{{ pageTitle }}</h1>
              <p class="text-white text-sm mt-1 opacity-90">{{ pageSubtitle }}</p>
            </div>
          </div>
          <div class="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="!user" class="max-w-7xl mx-auto">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div class="flex flex-col items-center justify-center">
          <div :class="['w-12 h-12 rounded-full border-4 border-t-transparent animate-spin', loaderBorderColor]"></div>
          <p class="mt-4 text-gray-500">{{ $t('messages.loading') }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content with Sidebar Layout -->
    <div v-else-if="step == 0" class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-5">
        <!-- Left Sidebar - Parties & Info -->
        <div class="lg:w-96 flex-shrink-0 space-y-4">
          <!-- Users Cards -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg :class="['w-4 h-4 mr-2', primaryColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {{ $t('money.parties') }}
            </h3>

            <!-- Creditor Card -->
            <div class="flex items-center p-3 bg-green-50 rounded-xl mb-3 border border-green-100">
              <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg v-if="creditorUser.type == 1" class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
                <svg v-else class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div class="ml-3 flex-1 min-w-0">
                <p class="text-xs font-medium text-green-600 uppercase tracking-wide">
                  {{ $t('list.creditor') }} {{ isTake ? `(${$t('money.you')})` : '' }}
                </p>
                <p class="font-semibold text-gray-800 text-sm mt-0.5 leading-tight">
                  {{ getUserDisplayName(creditorUser) }}
                </p>
              </div>
            </div>

            <!-- Arrow -->
            <div class="flex justify-center my-2">
              <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            <!-- Debitor Card -->
            <div class="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg v-if="debitorUser.type == 1" class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
                <svg v-else class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div class="ml-3 flex-1 min-w-0">
                <p class="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  {{ $t('list.debitor') }} {{ !isTake ? `(${$t('money.you')})` : '' }}
                </p>
                <p class="font-semibold text-gray-800 text-sm mt-0.5 leading-tight">
                  {{ getUserDisplayName(debitorUser) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Info Box -->
          <div :class="['border rounded-2xl p-4', infoBgClass]">
            <div class="flex items-start space-x-3">
              <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', infoIconBgClass]">
                <svg :class="['w-4 h-4', infoIconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 :class="['font-medium text-sm', infoTitleColor]">{{ $t('money.info_title') }}</h4>
                <p :class="['text-xs mt-1 leading-relaxed', infoTextColor]">{{ infoText }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Content - Form -->
        <div class="flex-1 space-y-4">
          <!-- Currency Selection -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg :class="['w-4 h-4 mr-2', primaryColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {{ $t('money.currency') }}
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <label
                :class="[
                  'flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all',
                  currency === 'UZS' ? activeCurrencyClass : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <input type="radio" v-model="currency" value="UZS" @change="setRadioChange" class="sr-only" />
                <img src="@/assets/img/uz.png" alt="UZS" class="w-6 h-4 mr-2 rounded shadow-sm" />
                <span :class="['font-semibold', currency === 'UZS' ? activeTextClass : 'text-gray-700']">
                  {{ $t("process.uzs") }}
                </span>
              </label>
              <label
                :class="[
                  'flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all',
                  currency === 'USD' ? activeCurrencyClass : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <input type="radio" v-model="currency" value="USD" @change="setRadioChange" class="sr-only" />
                <img src="@/assets/img/usa.png" alt="USD" class="w-6 h-4 mr-2 rounded shadow-sm" />
                <span :class="['font-semibold', currency === 'USD' ? activeTextClass : 'text-gray-700']">
                  {{ $t("process.usd") }}
                </span>
              </label>
            </div>
          </div>

          <!-- Amount & Date -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg :class="['w-4 h-4 mr-2', primaryColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {{ $t('money.details') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Amount Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('money.amount') }}</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    v-format="amount"
                    :value="amount"
                    ref="input"
                    @input="setAmount"
                    @keyup="changeAmount($event)"
                    :placeholder="$t('placeholder.summo')"
                    :class="['w-full pl-10 pr-14 py-3 border border-gray-200 rounded-xl transition-all', inputFocusClass]"
                  />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-medium text-sm">{{ currency }}</span>
                  </div>
                </div>
              </div>

              <!-- Date Picker -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('money.end_date') }}</label>
                <div class="form-date-picker">
                  <date-picker
                    v-model="end_date"
                    value-type="YYYY-MM-DD"
                    format="DD.MM.YYYY"
                    :placeholder="$t('process.end_date')"
                    :disabled-date="disabledDates"
                    @input="changePicker"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Fee Info (only for take-money when line == 0) -->
          <div v-if="isTake && isAffirmed && line == 0" class="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-amber-800 text-sm">{{ $t('money.fee_title') }}</h4>
                <p class="text-sm text-amber-600 mt-1">
                  <span v-if="$i18n.locale == 'uz'">
                    Xizmat haqi sifatida hisobingizdan
                    <span class="font-bold text-amber-700">{{ formatNumber(feePercentage) }} so'm</span>
                    yechiladi.
                  </span>
                  <span v-if="$i18n.locale == 'kr'">
                    Хизмат ҳақи сифатида ҳисобингиздан
                    <span class="font-bold text-amber-700">{{ formatNumber(feePercentage) }} сўм</span>
                    ечилади.
                  </span>
                  <span v-if="$i18n.locale == 'ru'">
                    В качестве платы за услугу с вашего счета будет списано
                    <span class="font-bold text-amber-700">{{ formatNumber(feePercentage) }} сум</span>.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Free contracts info (only for take-money) -->
          <div v-if="isTake && isAffirmed && line != 0" class="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <div class="flex items-start space-x-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-emerald-800 text-sm">{{ $t('money.free_contracts') }}</h4>
                <p class="text-sm text-emerald-600 mt-1">
                  <span v-if="$i18n.locale == 'uz'">Bepul shartnomalar soni - <span class="font-bold">{{ line }}</span> ta.</span>
                  <span v-if="$i18n.locale == 'kr'">Бепул шартномалар сони - <span class="font-bold">{{ line }}</span> тa.</span>
                  <span v-if="$i18n.locale == 'ru'">Количество бесплатных договоров - <span class="font-bold">{{ line }}</span>.</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Agreement & Submit -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <!-- Agreement Checkbox -->
            <label class="flex items-start cursor-pointer mb-4">
              <input
                type="checkbox"
                v-model="isAffirmed"
                @change="validate"
                :class="['w-5 h-5 mt-0.5 rounded border-gray-300', checkboxColor]"
              />
              <span class="ml-3 text-sm text-gray-600">
                <span
                  @click.prevent="sendContract"
                  :class="['underline cursor-pointer font-medium', linkColor]"
                >
                  {{ $t("process.err2") }}
                </span>
              </span>
            </label>

            <!-- Submit Button -->
            <button
              @click="affirmContract"
              :disabled="isBtnDisabled"
              :class="[
                'w-full py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center space-x-2',
                isBtnDisabled ? 'bg-gray-300 cursor-not-allowed' : submitButtonClass
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ $t("process.accept") }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contract Preview -->
    <div v-if="step == 1" class="max-w-7xl mx-auto">
      <contract-give :contract="{ amount, currency, end_date, type: isTake ? 'creditor' : 'debitor' }" />
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";

export default {
  name: 'MoneyTransfer',

  middleware: "auth",

  data: () => ({
    lang: "ru",
    amount: "",
    feePercentage: 0,
    usd: 0,
    step: 0,
    line: 10,
    currency: "UZS",
    end_date: null,
    isBtnDisabled: true,
    isAffirmed: false,
    user: null,
    url: "",
    d: false,
  }),

  computed: {
    /**
     * Get transfer type from route params
     */
    transferType() {
      return this.$route.params.type || 'take';
    },

    /**
     * Check if this is take-money (qarz olish)
     */
    isTake() {
      return this.transferType === 'take';
    },

    /**
     * Page title based on type
     */
    pageTitle() {
      return this.isTake ? this.$t("process.take") : this.$t("home.give");
    },

    /**
     * Page subtitle based on type
     */
    pageSubtitle() {
      return this.isTake ? this.$t("money.take_subtitle") : this.$t("money.give_subtitle");
    },

    /**
     * Info text based on type
     */
    infoText() {
      return this.isTake ? this.$t('money.take_info') : this.$t('money.give_info');
    },

    /**
     * Get creditor user based on transfer type
     */
    creditorUser() {
      return this.isTake ? this.$auth.user : this.user;
    },

    /**
     * Get debitor user based on transfer type
     */
    debitorUser() {
      return this.isTake ? this.user : this.$auth.user;
    },

    /**
     * Header gradient class based on type
     */
    headerGradient() {
      return this.isTake ? 'from-green-600 to-green-700' : 'from-blue-600 to-blue-700';
    },

    /**
     * Loader border color
     */
    loaderBorderColor() {
      return this.isTake ? 'border-green-500' : 'border-blue-500';
    },

    /**
     * Primary color class
     */
    primaryColor() {
      return this.isTake ? 'text-green-500' : 'text-blue-500';
    },

    /**
     * Info box background class
     */
    infoBgClass() {
      return this.isTake ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100';
    },

    /**
     * Info icon background class
     */
    infoIconBgClass() {
      return this.isTake ? 'bg-green-100' : 'bg-blue-100';
    },

    /**
     * Info icon color
     */
    infoIconColor() {
      return this.isTake ? 'text-green-600' : 'text-blue-600';
    },

    /**
     * Info title color
     */
    infoTitleColor() {
      return this.isTake ? 'text-green-800' : 'text-blue-800';
    },

    /**
     * Info text color
     */
    infoTextColor() {
      return this.isTake ? 'text-green-600' : 'text-blue-600';
    },

    /**
     * Active currency selection class
     */
    activeCurrencyClass() {
      return this.isTake ? 'border-green-500 bg-green-50 shadow-sm' : 'border-blue-500 bg-blue-50 shadow-sm';
    },

    /**
     * Active text class
     */
    activeTextClass() {
      return this.isTake ? 'text-green-700' : 'text-blue-700';
    },

    /**
     * Input focus class
     */
    inputFocusClass() {
      return this.isTake ? 'focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent';
    },

    /**
     * Checkbox color
     */
    checkboxColor() {
      return this.isTake ? 'text-green-600 focus:ring-green-500' : 'text-blue-600 focus:ring-blue-500';
    },

    /**
     * Link color
     */
    linkColor() {
      return this.isTake ? 'text-green-600 hover:text-green-700' : 'text-blue-600 hover:text-blue-700';
    },

    /**
     * Submit button class
     */
    submitButtonClass() {
      return this.isTake
        ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30'
        : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30';
    },

    /**
     * Form validation
     */
    isValidate() {
      return this.amount && this.currency && this.isAffirmed ? false : true;
    },
  },

  async created() {
    if (!this.$route.query.id) {
      return this.$router.go(-1);
    }

    // Load USD rate (only needed for take-money)
    if (this.isTake) {
      const usd = await this.$axios.$get("/contract/get/usd");
      this.usd = usd.data;
    }

    // Load user data
    const user = await this.$axios.$get(`/user/candidate/${this.$route.query.id}`);
    this.user = user.data;
    this.$auth.user2 = this.user.data;
  },

  async mounted() {
    // Check expiry date
    if (this.$auth.user.expiry_date && new Date(this.$auth.user.expiry_date) < new Date()) {
      return this.$router.push(this.localePath({ name: 'index' }));
    }

    // Check contract status
    if (this.$auth.user.is_active == 1 && this.$auth.user.is_contract == 0) {
      this.$router.push(this.localePath({ name: 'universal-contract' }));
    }

    // Load free contracts count (only for take-money)
    if (this.isTake) {
      const mee = await this.$axios.$get(`/user/candidate-search/${this.$auth.user.uid}`);
      this.line = mee.data.cnt;
    }

    // Setup date input formatting
    this.setupDateInput();
  },

  methods: {
    /**
     * Format number with thousand separators
     */
    formatNumber(num) {
      return num && num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },

    /**
     * Get user display name
     */
    getUserDisplayName(user) {
      if (!user) return '';
      if (user.type == 2) {
        return `${user.last_name || ''} ${user.first_name || ''} ${user.middle_name || ''}`.trim();
      }
      return user.company || '';
    },

    /**
     * Setup date input formatting
     */
    setupDateInput() {
      setTimeout(() => {
        const input = document.querySelector(".mx-input");
        if (!input) return;

        input.addEventListener("keydown", (e) => {
          const key = parseInt(e.key);
          if (e.which == 8 && e.target.value.charAt(e.target.value.length - 1) == ".") {
            e.target.value = e.target.value.slice(0, e.target.value.length - 2);
            e.preventDefault();
          }
          if (!((Number.isInteger(key) && e.target.value.length < 10) || e.which == 8)) {
            e.preventDefault();
          }
        });

        input.addEventListener("keyup", (e) => {
          let value = e.target.value.replace(/[^0-9]/g, "");
          let length = value.length;

          if (length >= 8) {
            e.target.value = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4, 8)}`;
          } else if (length >= 4) {
            e.target.value = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4, length)}`;
          } else if (length >= 2) {
            e.target.value = `${value.slice(0, 2)}.${value.slice(2, length)}`;
          }
        });
      }, 500);
    },

    /**
     * Open contract preview
     */
    sendContract() {
      const creditorUid = this.isTake ? this.$auth.user.uid : this.user.uid;
      const debitorUid = this.isTake ? this.user.uid : this.$auth.user.uid;
      const url = `https://pdf.zerox.uz/free_contract.php?creditor=${creditorUid}&debitor=${debitorUid}&download=0&amount=${this.amount}&currency=${this.currency}&day=${this.end_date}&lang=${this.$i18n.locale}`;
      window.open(url, '_blank');
    },

    /**
     * Handle date picker change
     */
    changePicker(value) {
      if (!value) return;
      const selected = new Date(value);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);
      maxDate.setHours(23, 59, 59, 999);
      if (selected > maxDate) {
        this.end_date = null;
        if (this.$toast) this.$toast.error("Sana joriy sanadan 2 yildan ortiq bo'lishi mumkin emas");
      } else {
        this.end_date = value;
      }
    },

    /**
     * Disable dates outside valid range
     */
    disabledDates(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);
      maxDate.setHours(23, 59, 59, 999);
      return date < today || date > maxDate;
    },

    /**
     * Handle amount input change
     */
    changeAmount(e) {
      const firstValue = e.target.value.split("")[0];
      if (firstValue == 0) {
        e.target.value = e.target.value.slice(1, e.target.value.length);
      }
    },

    /**
     * Validate form
     */
    validate() {
      if (this.amount == 0 || this.amount == null) {
        this.isBtnDisabled = true;
        return;
      }
      if (this.amount && this.isAffirmed) {
        this.isBtnDisabled = false;
      } else {
        this.isBtnDisabled = true;
      }
    },

    /**
     * Format date
     */
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },

    /**
     * Handle radio change
     */
    setRadioChange() {
      this.setAmount();
    },

    /**
     * Set and calculate amount
     */
    setAmount(e) {
      const amount = e
        ? Number([...e.target.value].filter((c) => c !== " ").join(""))
        : this.amount;
      const reg = /^\d+$/;

      if (reg.test(amount)) {
        this.amount = amount;
        this.$refs.input.value = amount;

        // Calculate fee (only for take-money)
        if (this.isTake) {
          if (this.currency === "USD") {
            const dd = amount * this.usd;
            if (dd <= 1000000) {
              this.feePercentage = 1000;
              this.d = true;
            } else if (dd >= 100000000) {
              this.feePercentage = 100000;
              this.d = true;
            } else {
              this.feePercentage = Math.floor(amount * this.usd * 0.001).toFixed(0);
            }
          } else {
            if (amount <= 1000000) {
              this.feePercentage = 1000;
              this.d = true;
            } else if (amount >= 100000000) {
              this.feePercentage = 100000;
              this.d = true;
            } else {
              this.feePercentage = Math.floor(amount * 0.001);
            }
          }
        }
      } else {
        if (this.amount.length > 0) {
          this.$refs.input.value = this.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
      }
      this.validate();
    },

    /**
     * Submit contract
     */
    async affirmContract() {
      const mismatch = await this.$checkDateMismatch();
      if (mismatch) {
        return this.$toast.error(this.$t('a1.a103'));
      }

      if (!this.end_date) {
        return this.$toast.error(this.$t('a1.a52'));
      }

      if (this.currency == "UZS" && this.amount < 10000) {
        return this.$toast.error(this.$t('a1.a50'));
      }

      // Additional checks for take-money
      if (this.isTake) {
        const coonn = await this.$axios.$get(`/user/candidate-search/${this.$auth.user.uid}`);
        const conBalance = coonn.data.balance;

        if (this.line == 0 && this.currency == "UZS" && this.amount < 10000) {
          return this.$toast.error(this.$t('a1.a51'));
        }
        if (this.line == 0 && conBalance < this.feePercentage) {
          return this.$toast.error(this.$t('a1.a51'));
        }
      }

      // Build contract data based on type
      const data = this.isTake
        ? {
            debitor: this.user.id,
            creditor: this.$auth.user.id,
            reciver: this.user.id,
            sender: this.$auth.user.id,
            res: this.user.id,
            amount: Number(this.amount),
            currency: this.currency,
            end_date: this.end_date,
            con: 1,
            type: this.$auth.user.type == 1 && this.user.type == 1 ? 1 : 0,
          }
        : {
            debitor: this.$auth.user.id,
            creditor: this.user.id,
            amount: Number(this.amount),
            currency: this.currency,
            end_date: this.end_date,
            reciver: this.user.id,
            res: this.user.id,
            sender: this.$auth.user.id,
            type: this.$auth.user.type == 1 && this.user.type == 1 ? 1 : 0,
          };

      try {
        const response = await this.$axios.post("/contract/create", data);
        if (response.data.msg == "date") {
          return this.$toast.error(this.$t('a1.a49'));
        }
        if (response.status) {
          this.$toast.success(this.$t('a1.a48'));
          this.$router.push(this.localePath({ name: 'index' }));
        }
      } catch (e) {
        return this.$toast.error(this.$t('a1.a42'));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form-date-picker {
  :deep(.mx-datepicker) {
    width: 100%;
  }
  :deep(.mx-input) {
    height: 46px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    padding-left: 16px;
    font-size: 14px;
    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
}
</style>
