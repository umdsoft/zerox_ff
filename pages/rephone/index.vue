<template>
  <div class="pb-8">
    <!-- Header Card -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div class="px-6 py-5">
        <div class="flex items-center gap-4">
          <button
            @click="step === 1 ? $backWithLocale() : stepBack()"
            class="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ $t('a1.a20') }}</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-lg mx-auto">
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 lg:p-8">
          <!-- Phone Icon -->
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>

          <!-- Step Indicator -->
          <div class="flex items-center justify-center gap-3 mb-8">
            <div class="flex items-center gap-2">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              ]">1</div>
              <span class="text-sm font-medium text-gray-700 hidden sm:inline">{{ $t('rephone.step1') || "Telefon" }}</span>
            </div>
            <div class="w-12 h-0.5 bg-gray-200">
              <div :class="['h-full bg-blue-600 transition-all', step >= 2 ? 'w-full' : 'w-0']"></div>
            </div>
            <div class="flex items-center gap-2">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              ]">2</div>
              <span class="text-sm font-medium text-gray-700 hidden sm:inline">{{ $t('rephone.step2') || "Tasdiqlash" }}</span>
            </div>
          </div>

          <!-- Step 1: Phone Input -->
          <div v-if="step === 1" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('a1.a17') }}</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  v-model="phone"
                  v-mask="'+998 ## ### ## ##'"
                  type="tel"
                  class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  placeholder="+998"
                  @input="removeSpace"
                />
              </div>
            </div>

            <button
              @click="stepGo"
              :disabled="isLoading"
              class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg v-if="isLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ $t('debt_list.a20') }}</span>
              <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <!-- Step 2: Code Verification -->
          <div v-if="step === 2" class="space-y-5">
            <div class="text-center mb-6">
              <p class="text-sm text-gray-500">{{ $t('rephone.code_sent') || "Tasdiqlash kodi yuborildi" }}</p>
              <p class="text-sm font-semibold text-gray-900 mt-1">{{ phone }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('placeholder.aa') }}</label>
              <input
                v-model="code"
                type="text"
                maxlength="6"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors text-center text-xl font-semibold tracking-widest"
                :placeholder="$t('placeholder.aa') || 'XXXXXX'"
              />
            </div>

            <button
              @click="stepGo2"
              :disabled="isLoading"
              class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg v-if="isLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ $t('process.accept') }}
            </button>

            <!-- Resend Timer -->
            <div class="text-center pt-4 border-t border-gray-100">
              <div v-if="!isResendEnabled" class="flex items-center justify-center gap-2 text-gray-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm">{{ $t('a1.a88') }}: <span class="font-semibold text-blue-600">{{ waitingTime }}</span></span>
              </div>
              <button
                v-if="isResendEnabled"
                @click="timer"
                class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {{ $t('a1.a34') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Box -->
      <div class="mt-6 bg-blue-50 rounded-xl p-4 flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-blue-700">{{ infoTipText }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { timerMixin, phoneMixin } from '@/mixins'
import { TIMER, PHONE, API_MESSAGES } from '@/utils/constants'

export default {
  middleware: "auth",

  mixins: [timerMixin, phoneMixin],

  data() {
    return {
      step: 1,
      phone: null,
      code: null,
      oldPhone: null,
      isLoading: false,
    };
  },

  created() {
    this.$store.commit("changeBreadCrumb", [
      { title: this.$t('phone.change'), name: "rephone" }
    ]);
  },

  mounted() {
    if (this.step === 2) {
      this.startTimer(TIMER.SMS_VERIFICATION);
    }
  },

  computed: {
    /**
     * Clean phone number for API calls
     */
    cleanedPhone() {
      return this.cleanPhone(this.phone);
    },

    /**
     * Info tip text (locale-aware, page-specific)
     */
    infoTipText() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return 'На ваш новый номер телефона будет отправлен код подтверждения. Пожалуйста, введите код.';
      if (lang === 'kr') return 'Янги телефон рақамингизга тасдиқлаш коди юборилади. Илтимос, кодни киритинг.';
      return "Yangi telefon raqamingizga tasdiqlash kodi yuboriladi. Iltimos, kodni kiriting.";
    },

    /**
     * Check if phone is valid
     */
    isPhoneValid() {
      return this.cleanedPhone.length === PHONE.LENGTH;
    }
  },

  methods: {
    /**
     * Go back to previous step
     */
    stepBack() {
      this.step = 1;
      this.resetTimer(TIMER.SMS_VERIFICATION);
    },

    /**
     * Handle phone input - remove extra spaces
     */
    removeSpace() {
      if (this.phone) {
        this.phone = this.phone.trim();
      }
    },

    /**
     * Handle API response messages
     */
    handleApiResponse(response, phone) {
      const { msg, message, success } = response.data;

      if (msg === API_MESSAGES.USER_ALLOW) {
        this.$toast.error(this.$t('a1.a75'));
        return false;
      }

      if (success === false && message === API_MESSAGES.CODE_EXPIRED) {
        this.$toast.error(this.$t('a1.a90'));
        return false;
      }

      if (msg === API_MESSAGES.NO_CODE) {
        this.$toast.error(this.$t('a1.a89'));
        return false;
      }

      return true;
    },

    /**
     * Show success message for code sent
     */
    showCodeSentMessage(phone) {
      const message = this.$i18n.locale === "ru"
        ? `Код подтверждения отправлен на номер телефона ${phone}.`
        : `${phone} ${this.$t('a1.a83')}`;
      this.$toast.success(message);
    },

    /**
     * Step 1: Send phone number for verification
     */
    async stepGo() {
      if (!this.phone || !this.isPhoneValid) {
        return this.$toast.error(this.$t('a1.a72'));
      }

      this.isLoading = true;

      try {
        const response = await this.$axios.post("/user/rephone", {
          step: this.step,
          phone: this.cleanedPhone,
          user: this.$auth.user.phone,
          lang: this.$i18n.locale
        });

        if (!this.handleApiResponse(response, this.cleanedPhone)) return;

        if (response.data.msg === API_MESSAGES.SEND_CODE) {
          this.startTimer(TIMER.SMS_VERIFICATION);
          this.oldPhone = response.data.user;
          this.step = 2;
          this.showCodeSentMessage(this.cleanedPhone);
        }
      } catch (error) {
        this.$toast.error(this.$t('a1.a42'));
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Resend verification code
     */
    async timer() {
      try {
        const response = await this.$axios.post("/user/phoneChange", {
          phone: this.cleanedPhone,
          oldPhone: this.oldPhone,
          lang: this.$i18n.locale,
        });

        if (!this.handleApiResponse(response, this.cleanedPhone)) return;

        if (response.status === 200 && response.data.msg === 'sms-send') {
          this.startTimer(TIMER.SMS_VERIFICATION);
          this.$toast.success(this.$t('rephone.code_resent') || "Kod qayta yuborildi");
        }
      } catch (error) {
        this.$toast.error(this.$t('a1.a42'));
      }
    },

    /**
     * Step 2: Verify code and complete phone change
     */
    async stepGo2() {
      if (!this.code) {
        return this.$toast.error(this.$t('a1.a73'));
      }

      this.isLoading = true;

      try {
        const response = await this.$axios.post("/user/rephone", {
          step: this.step,
          phone: this.cleanedPhone,
          code: this.code,
          oldPhone: this.oldPhone,
          lang: this.$i18n.locale
        });

        if (!this.handleApiResponse(response, this.cleanedPhone)) return;

        if (response.data.msg === API_MESSAGES.SEND_CODE) {
          this.step++;
          this.showCodeSentMessage(this.cleanedPhone);
          return;
        }

        this.$toast.success(this.$t('a1.a76'));
        this.$router.push(this.localePath({ name: 'index' }));
      } catch (error) {
        this.$toast.error(this.$t('a1.a42'));
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
