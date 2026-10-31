<template>
  <div class="min-h-screen bg-gray-50 flex">
    <LoginForgotModal v-if="idenNotification" :remove-iden-modal="removeIdenModal" :modal-texts="modalTexts" />
    <!-- Left Panel - Form -->
    <div class="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-12">
      <div class="mx-auto w-full max-w-lg">
        <!-- Logo -->
        <div class="text-center mb-10">
          <nuxt-link :to="localePath({ name: 'index' })" class="inline-block">
            <img
              v-if="$i18n.locale == 'ru'"
              src="@/assets/img/logo_ru.svg"
              alt="ZeroX"
              class="h-32 mx-auto"
            />
            <img
              v-else-if="$i18n.locale == 'kr'"
              src="@/assets/img/logo_kr.svg"
              alt="ZeroX"
              class="h-32 mx-auto"
            />
            <img
              v-else
              src="@/assets/img/logo.svg"
              alt="ZeroX"
              class="h-32 mx-auto"
            />
          </nuxt-link>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900">{{ texts.title }}</h1>
            <p class="mt-2 text-gray-500">{{ texts.subtitle }}</p>
          </div>

          <form class="space-y-6" @submit.prevent="loginUser">
            <!-- Phone -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ texts.phoneLabel }}
              </label>
              <div class="relative">
                <input
                  v-model="login.phone"
                  v-mask="'+998 ## ### ## ##'"
                  type="tel"
                  inputmode="tel"
                  maxlength="17"
                  autocomplete="tel"
                  class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-sm outline-none transition-all duration-200"
                  :class="!$v.login.phone.required && check2 ? 'border-red-400 bg-red-50' : ''"
                  placeholder="+998 __ ___ __ __"
                  @input="removeSpace"
                  @keydown.enter="loginUser"
                />
                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none hidden">
                  <span class="text-gray-400">+998</span>
                </div>
              </div>
              <p v-if="!$v.login.phone.required && check2" class="mt-2 text-sm text-red-500 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ texts.phoneError }}
              </p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ texts.passwordLabel }}
              </label>
              <div class="relative">
                <input
                  ref="password"
                  v-model="login.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-sm outline-none transition-all duration-200"
                  :class="!$v.login.password.required && check2 ? 'border-red-400 bg-red-50' : ''"
                  :placeholder="texts.passwordPlaceholder"
                  @keyup="keyupPassword"
                  @keydown.enter="loginUser"
                />
                <button
                  type="button"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  @click="togglePassword"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="!$v.login.password.required && check2" class="mt-2 text-sm text-red-500 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ texts.passwordError }}
              </p>
            </div>

            <!-- Forgot Password -->
            <div class="flex justify-end">
              <button type="button" class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors" @click="moddal()">
                {{ texts.forgotPassword }}
              </button>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ texts.loginButton }}
            </button>
          </form>

          <!-- SS-DEV (2026-09-24), hujjat-4 2-band: "Telegram orqali kirish" tugmasi OLIB TASHLANDI —
               Mini App ichida avtologin (plugins/telegram-autologin.client.js) o'zi ishlaydi:
               NOT_LINKED bo'lsa `requestContact` avtomatik chaqiriladi, so'ng PIN sahifasi. -->

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">{{ texts.or }}</span>
            </div>
          </div>

          <!-- Register Link -->
          <div class="text-center">
            <span class="text-gray-500">{{ texts.noAccount }}</span>
            <nuxt-link
              :to="localePath({ name: 'auth-register' })"
              class="ml-1 text-blue-600 hover:text-blue-700 font-semibold"
            >
              {{ texts.register }}
            </nuxt-link>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="mt-8 text-center">
          <nuxt-link
            :to="localePath({ name: 'index' })"
            class="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ texts.backHome }}
          </nuxt-link>
        </div>
      </div>
    </div>

    <LoginTestimonialsPanel
      :texts="texts"
      :current-testimonial="currentTestimonial"
      :testimonials="testimonials"
      :current-slide-value.sync="currentSlide"
    />
  </div>
</template>

<script>
import LoginForgotModal from '~/components/auth/LoginForgotModal.vue';
import LoginTestimonialsPanel from '~/components/auth/LoginTestimonialsPanel.vue';
import { required } from "vuelidate/lib/validators";
import { postArchive } from '@/api/user';
import loginViewMixin from '~/mixins/loginViewMixin.js';

export default {
  name: 'LoginPage',
  mixins: [loginViewMixin],
  auth: false,
  components: { LoginForgotModal, LoginTestimonialsPanel }, // SS-AUDIT (2026-09-25): ishlatilmagan VueTelInput olib tashlandi
  // 'empty' layout — default.vue $auth.loggedIn ga qarab sidebar chizadi; login muvaffaqiyatli
  // bo'lganda (route hali /auth/login) sidebar + login sahifasi ustma-ust tushib, 3-bo'lak
  // glitch beradi. empty layout buni oldini oladi (kirish tez va toza).
  layout: 'empty',

  data() {
    return {
      idenNotification: false,
      showPassword: false,
      isLoading: false,
      login: { phone: "", password: "" },
      check2: false,
      currentSlide: 0,
      slideInterval: null,
    };
  },

  created() {
    this.$store.commit("changeBreadCrumb", [{ title: this.$t('login.title'), name: "auth-login" }]);
  },

  mounted() {
    this.startSlider();

    // Session expiry bildirishnomasi (faqat 1 marta ko'rsatiladi)
    if (sessionStorage.getItem('session_expired')) {
      sessionStorage.removeItem('session_expired');
      const locale = this.$i18n?.locale || 'uz';
      const messages = {
        uz: 'Sessiya tugadi. Iltimos, qaytadan kiring.',
        kr: 'Сессия тугади. Илтимос, қайтадан киринг.',
        en: "Your session has expired. Please log in again.", // SS-DEV (2026-09-26): en/kaa
        kaa: "Sessiya tamamlandı. Iltimas, qaytadan kiriń.",
        ru: 'Сессия истекла. Пожалуйста, войдите заново.',
      };
      this.$toast.error(messages[locale] || messages.uz);
    }
  },

  beforeDestroy() {
    if (this.slideInterval) {clearInterval(this.slideInterval);}
  },

  validations: {
    login: {
      phone: { required },
      password: { required },
    },
  },


  methods: {
    startSlider() {
      this.slideInterval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
      }, 5000);
    },

    moddal() {
      this.idenNotification = true;
    },
    removeIdenModal() { clearTimeout(this.timeoutFunc); this.idenNotification = false; },
    removeSpace(e) {
      if (typeof e === 'object' && e.target) {
        this.login.phone = e.target.value.trim();
      } else {
        this.login.phone = String(e).trim();
      }
    },
    keyupPassword(e) { e.target.value = e.target.value.trim(); },
    togglePassword() { this.showPassword = !this.showPassword; },

    /**
     * Login arxivini saqlash
     * IP va geo ma'lumotlarni backend tomonidan olish xavfsizroq
     * Tashqi API (ipapi.co) o'rniga backend'ga so'rov yuboramiz
     */
    async sendArchiveData() {
      try {
        await postArchive(this.$axios, {
          device: "ZeroX Web",
          userAgent: navigator.userAgent || "Unknown",
          screenResolution: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
          language: navigator.language || "uz",
        }, { silent: true });
      } catch (error) {
        // Archive xatosi login jarayonini to'xtatmasligi kerak - silent fail
      }
    },

    async loginUser() {
      // Agar allaqachon yuborilayotgan bo'lsa, qayta yuborishning oldini ol
      if (this.isLoading) {return;}

      this.$v.login.$touch();
      this.check2 = true;
      if (this.$v.login.$invalid) {return;}

      this.isLoading = true;
      try {
        const currentLanguage = this.$i18n?.locale || 'uz';
        const phone = this.login.phone.replace(/\s/g, '');

        const response = await this.$auth.loginWith("local", {
          data: { phone, password: this.login.password },
          // B31-3: silent — global interceptor toast'ini o'chiramiz (komponent o'zi aniq
          // xabar ko'rsatadi; aks holda "Juda ko'p so'rov" IKKI marta chiqardi)
          silent: true,
        });

        if (response.status == 200) {
          if (response.data.success === false) {
            const msg = response.data.message;
            if (msg === "user-nft") {
              this.$toast.error(this.$t("a1.a91"));
              return this.$router.push(this.localePath({ name: 'auth-register' }));
            }
            if (msg === "invalid-credentials" || msg === "invalid-password" || msg === "user-not-found") {
              return this.$toast.error(`${this.$t("menu.invalid_password")}${response.data.attemptsLeft ?? ''}.`);
            }
            if (msg === "error") {return this.$toast.error(this.$t("a1.a42"));}
          }
          if (response.data.blocked === true) {return this.$toast.error(this.$t("menu.account_blocked"));}

          if (response.data.success === true) {
            this.$i18n?.setLocaleCookie?.(currentLanguage);
            localStorage.setItem('app-language', currentLanguage);
            // B32-3: Yangi foydalanuvchi kirdi — oldingi user/sessiya kesh'larini TO'LIQ tozalaymiz
            // (balans/notification/goal keshlari va eski owner tokeni boshqa userdan oqib kirmasin).
            try {
              localStorage.removeItem('zx_xodim_session');
              localStorage.removeItem('zx_owner_prev_token');
              localStorage.removeItem('user_balance');
              localStorage.removeItem('user_notifications');
              localStorage.removeItem('zx_goal_categories');
              localStorage.removeItem('zx_goal_hidden');
              sessionStorage.removeItem('sent_header_sync');
            } catch (_) {}
            // SS-DEV (2026-09-26): ilgari kutilmasdan darhol reload qilinar, so'rov ERR_ABORTED bo'lib
            // login arxivi (DAU statistikasi) yozilmasdi. Endi ≤1.5 s kutamiz, xato bo'lsa jim.
            await Promise.race([this.sendArchiveData(), new Promise((r) => setTimeout(r, 1500))]);
            // B32-3: TO'LIQ QAYTA YUKLASH — SPA navigatsiyada socket singleton eski foydalanuvchi
            // tokeni bilan qolib, uning bildirishnomalari yangi userга oqib kirardi. Reload socket
            // va barcha holatni yangi foydalanuvchi bilan qaytadan ishga tushiradi → aralashish yo'q.
            window.location.assign(this.localePath({ name: 'index' }));
          }
        }
      } catch (err) {
        // HTTP status kodiga qarab xabar ko'rsatish
        const status = err.response?.status;

        if (status === 429) {
          // Rate limiting - juda ko'p so'rov
          this.$toast.error(this.$t("errors.too_many_requests"));
        } else if (status === 401) {
          // Noto'g'ri login ma'lumotlari
          this.$toast.error(this.$t("login.wrong_credentials"));
        } else if (status === 400) {
          // Validation xatosi
          const message = err.response?.data?.message;
          this.$toast.error(message || this.$t("errors.validation_error"));
        } else if (!err.response) {
          // Network xatosi — global axios interceptor hal qiladi
        } else {
          // Boshqa xatolar (422, 500, va h.k.) — axios interceptor toast ko'rsatadi
        }
      } finally {
        this.isLoading = false;
      }
    }
  },
};
</script>

<style lang="scss" scoped src="../../assets/page-styles/login.scss"></style>
