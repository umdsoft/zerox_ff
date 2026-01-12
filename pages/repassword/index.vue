<template>
  <div class="pb-8">
    <!-- Header Card -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div class="px-6 py-5">
        <div class="flex items-center gap-4">
          <button
            @click="$backWithLocale()"
            class="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ $t("debt_list.a23") }}</h1>
            <p class="text-sm text-gray-500 mt-1">{{ $t("debt_list.a58") }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-lg mx-auto">
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 lg:p-8">
          <!-- Lock Icon -->
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <!-- Form -->
          <div class="space-y-5">
            <!-- Old Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('a1.a44') }}</label>
              <div class="relative">
                <input
                  v-model="password.oldPassword"
                  :type="showOldPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors pr-12"
                  :placeholder="$t('a1.a44')"
                />
                <button
                  type="button"
                  @click="showOldPassword = !showOldPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg v-if="showOldPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('a1.a45') }}</label>
              <div class="relative">
                <input
                  v-model="password.password"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors pr-12"
                  :placeholder="$t('a1.a45')"
                  @input="password_check"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg v-if="showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p v-if="!$v.password.password.required && check2" class="mt-2 text-sm text-red-500">
                {{ $t("debt_list.a22") }}
              </p>
            </div>

            <!-- Password Requirements -->
            <div class="bg-gray-50 rounded-xl p-4">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{{ $t('repassword.requirements') || "Parol talablari" }}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div class="flex items-center gap-2">
                  <div :class="[
                    'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                    has_uppercase ? 'bg-green-100' : 'bg-gray-200'
                  ]">
                    <svg :class="['w-3 h-3', has_uppercase ? 'text-green-600' : 'text-gray-400']" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="has_uppercase" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span :class="['text-sm', has_uppercase ? 'text-gray-700' : 'text-gray-500']">{{ $t("debt_list.a26") }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <div :class="[
                    'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                    password.password.length > 7 ? 'bg-green-100' : 'bg-gray-200'
                  ]">
                    <svg :class="['w-3 h-3', password.password.length > 7 ? 'text-green-600' : 'text-gray-400']" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="password.password.length > 7" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span :class="['text-sm', password.password.length > 7 ? 'text-gray-700' : 'text-gray-500']">{{ $t("debt_list.a27") }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <div :class="[
                    'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                    has_lowercase ? 'bg-green-100' : 'bg-gray-200'
                  ]">
                    <svg :class="['w-3 h-3', has_lowercase ? 'text-green-600' : 'text-gray-400']" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="has_lowercase" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span :class="['text-sm', has_lowercase ? 'text-gray-700' : 'text-gray-500']">{{ $t("debt_list.a28") }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <div :class="[
                    'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                    has_number ? 'bg-green-100' : 'bg-gray-200'
                  ]">
                    <svg :class="['w-3 h-3', has_number ? 'text-green-600' : 'text-gray-400']" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="has_number" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span :class="['text-sm', has_number ? 'text-gray-700' : 'text-gray-500']">{{ $t("debt_list.a29") }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <div :class="[
                    'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                    has_special ? 'bg-green-100' : 'bg-gray-200'
                  ]">
                    <svg :class="['w-3 h-3', has_special ? 'text-green-600' : 'text-gray-400']" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="has_special" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span :class="['text-sm', has_special ? 'text-gray-700' : 'text-gray-500']">{{ $t("debt_list.a25") }}</span>
                </div>

                <div v-if="password.password.length" class="flex items-center gap-2">
                  <div :class="[
                    'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                    has_probel ? 'bg-green-100' : 'bg-gray-200'
                  ]">
                    <svg :class="['w-3 h-3', has_probel ? 'text-green-600' : 'text-gray-400']" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="has_probel" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span :class="['text-sm', has_probel ? 'text-gray-700' : 'text-gray-500']">{{ $t('a1.a24') }}</span>
                </div>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('a1.a46') }}</label>
              <div class="relative">
                <input
                  v-model="password.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors pr-12"
                  :placeholder="$t('a1.a46')"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p v-if="!$v.password.confirmPassword.required && check2" class="mt-2 text-sm text-red-500">
                {{ $t("debt_list.a30") }}
              </p>
              <p v-if="$v.password.confirmPassword.required && !$v.password.confirmPassword.sameAs && check2" class="mt-2 text-sm text-red-500">
                {{ $t("debt_list.a31") }}
              </p>
            </div>

            <!-- Submit Button -->
            <button
              @click="stepGo"
              :disabled="isLoading"
              class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg v-if="isLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {{ $t("debt_list.a32") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Security Info -->
      <div class="mt-6 bg-blue-50 rounded-xl p-4 flex items-start gap-3">
        <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-blue-700">{{ $t('repassword.security_tip') || "Xavfsizlik uchun parolingizni hech kim bilan ulashmang va uni muntazam yangilab turing." }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { required, sameAs } from "vuelidate/lib/validators";

export default {
  middleware: "auth",

  data() {
    return {
      has_number: false,
      has_lowercase: false,
      has_uppercase: false,
      has_special: false,
      has_probel: false,
      check2: false,
      isLoading: false,
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      password: {
        oldPassword: "",
        password: "",
        confirmPassword: "",
      },
    };
  },

  validations: {
    password: {
      password: {
        required,
      },
      confirmPassword: {
        required,
        sameAs: sameAs(function () {
          return this.password.password;
        }),
      },
    },
  },

  created() {
    let links = [{ title: "Parolni tiklash", name: "repassword" }];
    this.$store.commit("changeBreadCrumb", links);
  },

  methods: {
    password_check() {
      this.has_number = /\d/.test(this.password.password);
      this.has_lowercase = /[a-z]/.test(this.password.password);
      this.has_uppercase = /[A-Z]/.test(this.password.password);
      this.has_special = /[!@#\$%\^\&*\)\(+=._-]/.test(this.password.password);
      this.has_probel = !/\s/.test(this.password.password);
    },

    async stepGo() {
      this.check2 = true;

      if (this.password.oldPassword === '') {
        return this.$toast.error(this.$t('a1.a44'));
      }

      if (this.password.password === '') {
        return this.$toast.error(this.$t('login.password'));
      }

      if (/\s/.test(this.password.password)) {
        return this.$toast.error(this.$t('a1.a42'));
      }

      if (!this.has_number || !this.has_lowercase || !this.has_uppercase || !this.has_special || this.password.password.length < 8) {
        return this.$toast.error(this.$t('a1.a42'));
      }

      if (this.password.password !== this.password.confirmPassword) {
        return this.$toast.error(this.$t('placeholder.no_pas'));
      }

      this.isLoading = true;

      try {
        const response = await this.$axios.post("/user/edit-password", {
          prevPass: this.password.oldPassword,
          newPass: this.password.password,
        });

        if (response.data.msg === "pass-equal") {
          return this.$toast.error(this.$t('login.pass_eq'));
        }

        if (response.data.msg === "err") {
          return this.$toast.error(this.$t('placeholder.pas_ex'));
        }

        if (response.data.msg === "err-secret") {
          return this.$toast.error(this.$t("debt_list.a01"));
        }

        if (response.data.msg === "suc-password") {
          this.$toast.success(this.$t('a1.a63'));
          return this.$router.push(this.localePath({ name: 'index' }));
        }

        return this.$toast.error(this.$t('a1.a42'));
      } catch (error) {
        this.$toast.error(this.$t('a1.a42'));
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
