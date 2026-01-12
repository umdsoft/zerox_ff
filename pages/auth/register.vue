<template>
  <div class="min-h-screen bg-gray-50 flex">
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
          <!-- Steps Indicator -->
          <div class="flex items-center justify-between mb-10 px-4">
            <!-- Step 1 -->
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300"
                :class="step >= 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'"
              >
                <svg v-if="step > 1" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>1</span>
              </div>
              <span class="mt-2 text-sm font-medium" :class="step >= 1 ? 'text-blue-600' : 'text-gray-400'">
                {{ texts.steps.phone }}
              </span>
            </div>

            <!-- Line 1 -->
            <div class="flex-1 h-1 mx-3 rounded-full transition-all duration-300" :class="step > 1 ? 'bg-blue-600' : 'bg-gray-200'"></div>

            <!-- Step 2 -->
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300"
                :class="step >= 2 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'"
              >
                <svg v-if="step > 2" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>2</span>
              </div>
              <span class="mt-2 text-sm font-medium" :class="step >= 2 ? 'text-blue-600' : 'text-gray-400'">
                {{ texts.steps.verify }}
              </span>
            </div>

            <!-- Line 2 -->
            <div class="flex-1 h-1 mx-3 rounded-full transition-all duration-300" :class="step > 2 ? 'bg-blue-600' : 'bg-gray-200'"></div>

            <!-- Step 3 -->
            <div class="flex flex-col items-center">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300"
                :class="step >= 3 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'"
              >
                3
              </div>
              <span class="mt-2 text-sm font-medium" :class="step >= 3 ? 'text-blue-600' : 'text-gray-400'">
                {{ texts.steps.password }}
              </span>
            </div>
          </div>

          <!-- Step 1: Phone -->
          <div v-if="step === 1">
            <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-gray-900">{{ texts.step1.title }}</h1>
              <p class="mt-2 text-gray-500">{{ texts.step1.subtitle }}</p>
            </div>

            <form @submit.prevent="sendPhone" class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">{{ texts.step1.phoneLabel }}</label>
                <div class="relative">
                  <input
                    v-model="phone"
                    @input="removeSpace"
                    v-mask="'+998 ## ### ## ##'"
                    type="tel"
                    class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-sm outline-none transition-all duration-200"
                    :class="!$v.phone.required && check2 ? 'border-red-400 bg-red-50' : ''"
                    placeholder="+998 __ ___ __ __"
                  />
                </div>
                <p v-if="!$v.phone.required && check2" class="mt-2 text-sm text-red-500 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ texts.step1.phoneError }}
                </p>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ texts.buttons.continue }}
              </button>
            </form>

            <div class="mt-8 text-center">
              <span class="text-gray-500">{{ texts.step1.haveAccount }}</span>
              <nuxt-link :to="localePath({ name: 'auth-login' })" class="ml-1 text-blue-600 hover:text-blue-700 font-semibold">
                {{ texts.buttons.login }}
              </nuxt-link>
            </div>
          </div>

          <!-- Step 2: Verification Code -->
          <div v-else-if="step === 2">
            <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-gray-900">{{ texts.step2.title }}</h1>
              <p class="mt-2 text-gray-500">{{ texts.step2.subtitle }}</p>
            </div>

            <form @submit.prevent="sendCode" class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">{{ texts.step2.codeLabel }}</label>
                <input
                  v-model="code"
                  type="text"
                  maxlength="6"
                  class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-sm outline-none text-center text-2xl font-bold tracking-widest transition-all duration-200"
                  :class="!$v.code.required && check2 ? 'border-red-400 bg-red-50' : ''"
                  :placeholder="texts.step2.codePlaceholder"
                />
                <p v-if="!$v.code.required && check2" class="mt-2 text-sm text-red-500 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ texts.step2.codeError }}
                </p>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ texts.buttons.verify }}
              </button>

              <!-- Timer -->
              <div class="text-center py-2">
                <button v-if="isBtn" type="button" @click="timer" class="text-blue-600 hover:text-blue-700 font-medium">
                  {{ texts.step2.resend }}
                </button>
                <p v-else class="text-gray-500">
                  {{ texts.step2.waitText }}: <span class="font-bold text-blue-600">{{ waitingTime }}</span>
                </p>
              </div>
            </form>

            <button @click="step = 1" class="mt-4 w-full py-3 text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              {{ texts.buttons.back }}
            </button>
          </div>

          <!-- Step 3: Password -->
          <div v-else-if="step === 3">
            <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-gray-900">{{ texts.step3.title }}</h1>
              <p class="mt-2 text-gray-500">{{ texts.step3.subtitle }}</p>
            </div>

            <form @submit.prevent="sendAllData" class="space-y-5">
              <!-- Password -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">{{ texts.step3.passwordLabel }}</label>
                <div class="relative">
                  <input
                    v-model="password.password"
                    v-model.trim="$v.password.password.$model"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-sm outline-none transition-all duration-200"
                    :class="!$v.password.password.required && submitPassword ? 'border-red-400 bg-red-50' : ''"
                    :placeholder="texts.step3.passwordPlaceholder"
                    @input="password_check"
                  />
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Password Requirements -->
              <div class="bg-gray-50 rounded-xl p-4 space-y-2">
                <div class="flex items-center text-sm" :class="has_uppercase ? 'text-green-600' : 'text-gray-400'">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="has_uppercase" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    <circle v-else cx="12" cy="12" r="10" stroke-width="2" />
                  </svg>
                  {{ texts.step3.requirements.uppercase }}
                </div>
                <div class="flex items-center text-sm" :class="message.length > 8 ? 'text-green-600' : 'text-gray-400'">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="message.length > 8" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    <circle v-else cx="12" cy="12" r="10" stroke-width="2" />
                  </svg>
                  {{ texts.step3.requirements.length }}
                </div>
                <div class="flex items-center text-sm" :class="has_lowercase ? 'text-green-600' : 'text-gray-400'">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="has_lowercase" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    <circle v-else cx="12" cy="12" r="10" stroke-width="2" />
                  </svg>
                  {{ texts.step3.requirements.lowercase }}
                </div>
                <div class="flex items-center text-sm" :class="has_number ? 'text-green-600' : 'text-gray-400'">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="has_number" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    <circle v-else cx="12" cy="12" r="10" stroke-width="2" />
                  </svg>
                  {{ texts.step3.requirements.number }}
                </div>
                <div class="flex items-center text-sm" :class="has_special ? 'text-green-600' : 'text-gray-400'">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="has_special" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    <circle v-else cx="12" cy="12" r="10" stroke-width="2" />
                  </svg>
                  {{ texts.step3.requirements.special }}
                </div>
                <div v-if="message?.length" class="flex items-center text-sm" :class="has_probel ? 'text-green-600' : 'text-gray-400'">
                  <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="has_probel" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    <circle v-else cx="12" cy="12" r="10" stroke-width="2" />
                  </svg>
                  {{ texts.step3.requirements.noSpace }}
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">{{ texts.step3.confirmLabel }}</label>
                <div class="relative">
                  <input
                    v-model.trim="$v.password.confirmPassword.$model"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-sm outline-none transition-all duration-200"
                    :placeholder="texts.step3.confirmPlaceholder"
                  />
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ texts.buttons.register }}
              </button>
            </form>

            <button @click="step = 2" class="mt-4 w-full py-3 text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              {{ texts.buttons.back }}
            </button>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="mt-8 text-center">
          <nuxt-link :to="localePath({ name: 'index' })" class="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ texts.buttons.backHome }}
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- Right Panel - Testimonials Slider -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 items-center justify-center relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div class="absolute bottom-20 right-20 w-48 h-48 border-2 border-white rounded-full"></div>
        <div class="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-white rounded-full"></div>
      </div>

      <div class="max-w-lg text-white text-center relative z-10">
        <!-- Title -->
        <h2 class="text-3xl font-bold mb-4">{{ texts.panel.title }}</h2>
        <p class="text-blue-100 text-lg mb-10">{{ texts.panel.subtitle }}</p>

        <!-- Testimonials Slider -->
        <div class="relative">
          <div class="testimonial-card bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div class="flex items-center justify-center mb-4">
              <div class="flex -space-x-1">
                <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <p class="text-white text-lg italic mb-6">"{{ currentTestimonial.text }}"</p>
            <div class="flex items-center justify-center">
              <div class="w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg" style="background-color: rgba(255,255,255,0.9)">
                {{ currentTestimonial.initials }}
              </div>
              <div class="ml-4 text-left">
                <p class="font-semibold">{{ currentTestimonial.name }}</p>
                <p class="text-blue-200 text-sm">{{ currentTestimonial.role }}</p>
              </div>
            </div>
          </div>

          <!-- Slider Dots -->
          <div class="flex items-center justify-center space-x-2">
            <button
              v-for="(_, index) in testimonials"
              :key="index"
              @click="currentSlide = index"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="currentSlide === index ? 'bg-white w-6' : 'bg-white bg-opacity-40'"
            ></button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white border-opacity-20">
          <div class="text-center">
            <p class="text-3xl font-bold">10K+</p>
            <p class="text-blue-200 text-sm">{{ texts.panel.stats.users }}</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold">50K+</p>
            <p class="text-blue-200 text-sm">{{ texts.panel.stats.contracts }}</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold">99%</p>
            <p class="text-blue-200 text-sm">{{ texts.panel.stats.satisfaction }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueTelInput } from "vue-tel-input";
import { required, sameAs, helpers } from "vuelidate/lib/validators";

const alpha = helpers.regex("alpha", /^(?:(?:(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]))|(?:(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|\]))|(?:(?=.*[0-9])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|\]))|(?:(?=.*[0-9])(?=.*[a-z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|\]))).{6,32}$/);

export default {
  name: 'RegisterPage',
  auth: false,
  components: { VueTelInput },

  data: () => ({
    message: "",
    has_number: false,
    has_lowercase: false,
    has_uppercase: false,
    has_special: false,
    has_probel: false,
    step: 1,
    phone: "",
    code: "",
    check2: false,
    isBtn: false,
    isLoading: false,
    showPassword: false,
    showConfirmPassword: false,
    password: { password: "", confirmPassword: "" },
    submitPassword: false,
    intervalSecond: null,
    time: 120,
    currentSlide: 0,
    slideInterval: null,
  }),

  validations: {
    phone: { required },
    code: { required },
    password: {
      password: { required, alpha },
      confirmPassword: { required, sameAs: sameAs(function () { return this.password.password; }) },
    },
  },

  computed: {
    waitingTime() {
      const minute = Math.floor(this.time / 60).toString().padStart(2, '0');
      const second = (this.time % 60).toString().padStart(2, '0');
      return `${minute}:${second}`;
    },

    testimonials() {
      const locale = this.$i18n?.locale || 'uz';
      const data = {
        uz: [
          { text: "ZeroX orqali do'stimga qarz berdim. Shartnoma tuzildi, hamma narsa rasmiy. Endi hech qanday muammo yo'q.", name: "Aziz Karimov", role: "Tadbirkor", initials: "AK" },
          { text: "Oldin qarz berishdan qo'rqardim. Endi ZeroX bilan xavfsiz. Shartnoma ikki tomonlama tasdiqlanadi.", name: "Malika Rahimova", role: "Buxgalter", initials: "MR" },
          { text: "Mobil ilova juda qulay. Istalgan joydan shartnoma tuzish mumkin. Tavsiya qilaman!", name: "Jasur Toshmatov", role: "Dasturchi", initials: "JT" },
          { text: "To'lov muddati yaqinlashganda eslatma keladi. Hech qachon unutmayman. Zo'r xizmat!", name: "Nilufar Saidova", role: "O'qituvchi", initials: "NS" },
          { text: "Qarzdorlar ro'yxatini bir joyda ko'rish juda qulay. QR kod orqali tez qidirish ajoyib.", name: "Bobur Aliyev", role: "Savdogar", initials: "BA" },
          { text: "Bir yilda 20 dan ortiq shartnoma tuzdim. Barchasi rasmiylashtirilgan. Rahmat ZeroX!", name: "Sardor Qodirov", role: "Fermer", initials: "SQ" },
          { text: "Oilaviy qarz muammolarini hal qildik. Endi hamma narsa hujjatlashtirilgan.", name: "Gulnora Mahmudova", role: "Uy bekasi", initials: "GM" },
          { text: "Biznes uchun ajoyib platforma. Hamkorlar bilan qarz munosabatlarini boshqarish oson bo'ldi.", name: "Timur Nazarov", role: "Biznesmen", initials: "TN" },
          { text: "Xavfsizlik darajasi yuqori. Ma'lumotlarim himoyalangan. Ishonchli platforma.", name: "Kamola Umarova", role: "Advokat", initials: "KU" },
          { text: "3 yildan beri foydalanaman. Hech qanday muammo bo'lmadi. Eng yaxshi xizmat!", name: "Rustam Ergashev", role: "Menejер", initials: "RE" }
        ],
        ru: [
          { text: "Через ZeroX дал в долг другу. Договор оформлен, всё официально. Теперь никаких проблем.", name: "Азиз Каримов", role: "Предприниматель", initials: "АК" },
          { text: "Раньше боялся давать в долг. Теперь с ZeroX безопасно. Договор подтверждается двумя сторонами.", name: "Малика Рахимова", role: "Бухгалтер", initials: "МР" },
          { text: "Мобильное приложение очень удобное. Можно создать договор откуда угодно. Рекомендую!", name: "Жасур Тошматов", role: "Программист", initials: "ЖТ" },
          { text: "Приходит напоминание когда приближается срок оплаты. Никогда не забуду. Отличный сервис!", name: "Нилуфар Саидова", role: "Учитель", initials: "НС" },
          { text: "Очень удобно видеть список должников в одном месте. Быстрый поиск по QR-коду - супер.", name: "Бобур Алиев", role: "Торговец", initials: "БА" },
          { text: "За год оформил более 20 договоров. Всё документировано. Спасибо ZeroX!", name: "Сардор Кодиров", role: "Фермер", initials: "СК" },
          { text: "Решили семейные долговые вопросы. Теперь всё задокументировано.", name: "Гульнора Махмудова", role: "Домохозяйка", initials: "ГМ" },
          { text: "Отличная платформа для бизнеса. Управлять долговыми отношениями с партнёрами стало легко.", name: "Тимур Назаров", role: "Бизнесмен", initials: "ТН" },
          { text: "Высокий уровень безопасности. Мои данные защищены. Надёжная платформа.", name: "Камола Умарова", role: "Адвокат", initials: "КУ" },
          { text: "Пользуюсь уже 3 года. Никаких проблем не было. Лучший сервис!", name: "Рустам Эргашев", role: "Менеджер", initials: "РЭ" }
        ],
        kr: [
          { text: "ZeroX орқали дўстимга қарз бердим. Шартнома тузилди, ҳамма нарса расмий. Энди ҳеч қандай муаммо йўқ.", name: "Азиз Каримов", role: "Тадбиркор", initials: "АК" },
          { text: "Олдин қарз беришдан қўрқардим. Энди ZeroX билан хавфсиз. Шартнома икки томонлама тасдиқланади.", name: "Малика Раҳимова", role: "Бухгалтер", initials: "МР" },
          { text: "Мобил илова жуда қулай. Исталган жойдан шартнома тузиш мумкин. Тавсия қиламан!", name: "Жасур Тошматов", role: "Дастурчи", initials: "ЖТ" },
          { text: "Тўлов муддати яқинлашганда эслатма келади. Ҳеч қачон унутмайман. Зўр хизмат!", name: "Нилуфар Саидова", role: "Ўқитувчи", initials: "НС" },
          { text: "Қарздорлар рўйхатини бир жойда кўриш жуда қулай. QR код орқали тез қидириш ажойиб.", name: "Бобур Алиев", role: "Савдогар", initials: "БА" },
          { text: "Бир йилда 20 дан ортиқ шартнома туздим. Барчаси расмийлаштирилган. Раҳмат ZeroX!", name: "Сардор Қодиров", role: "Фермер", initials: "СҚ" },
          { text: "Оилавий қарз муаммоларини ҳал қилдик. Энди ҳамма нарса ҳужжатлаштирилган.", name: "Гулнора Маҳмудова", role: "Уй бекаси", initials: "ГМ" },
          { text: "Бизнес учун ажойиб платформа. Ҳамкорлар билан қарз муносабатларини бошқариш осон бўлди.", name: "Тимур Назаров", role: "Бизнесмен", initials: "ТН" },
          { text: "Хавфсизлик даражаси юқори. Маълумотларим ҳимояланган. Ишончли платформа.", name: "Камола Умарова", role: "Адвокат", initials: "КУ" },
          { text: "3 йилдан бери фойдаланаман. Ҳеч қандай муаммо бўлмади. Энг яхши хизмат!", name: "Рустам Эргашев", role: "Менежер", initials: "РЭ" }
        ]
      };
      return data[locale] || data.uz;
    },

    currentTestimonial() {
      return this.testimonials[this.currentSlide] || this.testimonials[0];
    },

    texts() {
      const locale = this.$i18n?.locale || 'uz';
      const translations = {
        uz: {
          steps: {
            phone: 'Telefon',
            verify: 'Tasdiqlash',
            password: 'Parol'
          },
          step1: {
            title: "Ro'yxatdan o'tish",
            subtitle: "Platformadan foydalanish uchun ro'yxatdan o'ting",
            phoneLabel: 'Telefon raqamingiz',
            phoneError: 'Telefon raqamini kiriting',
            haveAccount: 'Akkountingiz bormi?'
          },
          step2: {
            title: 'Tasdiqlash kodi',
            subtitle: 'SMS orqali yuborilgan kodni kiriting',
            codeLabel: 'Tasdiqlash kodi',
            codePlaceholder: '000000',
            codeError: 'Kodni kiriting',
            resend: 'Qayta yuborish',
            waitText: 'Kutish vaqti'
          },
          step3: {
            title: 'Parol yarating',
            subtitle: 'Hisobingiz uchun xavfsiz parol yarating',
            passwordLabel: 'Parol',
            passwordPlaceholder: 'Parolni kiriting',
            confirmLabel: 'Parolni tasdiqlang',
            confirmPlaceholder: 'Parolni qayta kiriting',
            requirements: {
              uppercase: 'Kamida bitta katta harf (A-Z)',
              length: 'Kamida 8 ta belgi',
              lowercase: 'Kamida bitta kichik harf (a-z)',
              number: 'Kamida bitta raqam (0-9)',
              special: 'Kamida bitta maxsus belgi (!@#$%)',
              noSpace: "Bo'sh joy yo'q"
            }
          },
          buttons: {
            continue: 'Davom etish',
            verify: 'Tasdiqlash',
            register: "Ro'yxatdan o'tish",
            back: 'Orqaga',
            backHome: 'Bosh sahifaga qaytish',
            login: 'Kirish'
          },
          panel: {
            title: 'Mijozlarimiz fikrlari',
            subtitle: "10,000+ foydalanuvchi bizga ishonadi",
            stats: {
              users: 'Foydalanuvchilar',
              contracts: 'Shartnomalar',
              satisfaction: 'Qoniqish'
            }
          }
        },
        ru: {
          steps: {
            phone: 'Телефон',
            verify: 'Проверка',
            password: 'Пароль'
          },
          step1: {
            title: 'Регистрация',
            subtitle: 'Зарегистрируйтесь для использования платформы',
            phoneLabel: 'Ваш номер телефона',
            phoneError: 'Введите номер телефона',
            haveAccount: 'Уже есть аккаунт?'
          },
          step2: {
            title: 'Код подтверждения',
            subtitle: 'Введите код, отправленный по SMS',
            codeLabel: 'Код подтверждения',
            codePlaceholder: '000000',
            codeError: 'Введите код',
            resend: 'Отправить повторно',
            waitText: 'Время ожидания'
          },
          step3: {
            title: 'Создайте пароль',
            subtitle: 'Создайте надежный пароль для вашего аккаунта',
            passwordLabel: 'Пароль',
            passwordPlaceholder: 'Введите пароль',
            confirmLabel: 'Подтвердите пароль',
            confirmPlaceholder: 'Введите пароль повторно',
            requirements: {
              uppercase: 'Минимум одна заглавная буква (A-Z)',
              length: 'Минимум 8 символов',
              lowercase: 'Минимум одна строчная буква (a-z)',
              number: 'Минимум одна цифра (0-9)',
              special: 'Минимум один спецсимвол (!@#$%)',
              noSpace: 'Без пробелов'
            }
          },
          buttons: {
            continue: 'Продолжить',
            verify: 'Подтвердить',
            register: 'Зарегистрироваться',
            back: 'Назад',
            backHome: 'На главную',
            login: 'Войти'
          },
          panel: {
            title: 'Отзывы клиентов',
            subtitle: 'Более 10,000 пользователей доверяют нам',
            stats: {
              users: 'Пользователей',
              contracts: 'Договоров',
              satisfaction: 'Довольны'
            }
          }
        },
        kr: {
          steps: {
            phone: 'Телефон',
            verify: 'Тасдиқлаш',
            password: 'Парол'
          },
          step1: {
            title: "Рўйхатдан ўтиш",
            subtitle: "Платформадан фойдаланиш учун рўйхатдан ўтинг",
            phoneLabel: 'Телефон рақамингиз',
            phoneError: 'Телефон рақамини киритинг',
            haveAccount: 'Аккаунтингиз борми?'
          },
          step2: {
            title: 'Тасдиқлаш коди',
            subtitle: 'SMS орқали юборилган кодни киритинг',
            codeLabel: 'Тасдиқлаш коди',
            codePlaceholder: '000000',
            codeError: 'Кодни киритинг',
            resend: 'Қайта юбориш',
            waitText: 'Кутиш вақти'
          },
          step3: {
            title: 'Парол яратинг',
            subtitle: 'Ҳисобингиз учун хавфсиз парол яратинг',
            passwordLabel: 'Парол',
            passwordPlaceholder: 'Паролни киритинг',
            confirmLabel: 'Паролни тасдиқланг',
            confirmPlaceholder: 'Паролни қайта киритинг',
            requirements: {
              uppercase: 'Камида битта катта ҳарф (A-Z)',
              length: 'Камида 8 та белги',
              lowercase: 'Камида битта кичик ҳарф (a-z)',
              number: 'Камида битта рақам (0-9)',
              special: 'Камида битта махсус белги (!@#$%)',
              noSpace: "Бўш жой йўқ"
            }
          },
          buttons: {
            continue: 'Давом этиш',
            verify: 'Тасдиқлаш',
            register: "Рўйхатдан ўтиш",
            back: 'Орқага',
            backHome: 'Бош саҳифага қайтиш',
            login: 'Кириш'
          },
          panel: {
            title: 'Мижозларимиз фикрлари',
            subtitle: "10,000+ фойдаланувчи бизга ишонади",
            stats: {
              users: 'Фойдаланувчилар',
              contracts: 'Шартномалар',
              satisfaction: 'Қониқиш'
            }
          }
        }
      };
      return translations[locale] || translations.uz;
    },
  },

  created() {
    this.$store.commit("changeBreadCrumb", [{ title: this.$t('debt_list.a38') || "Ro'yhatdan o'tish", name: "auth-register" }]);
  },

  mounted() {
    this.startSlider();
  },

  beforeDestroy() {
    if (this.intervalSecond) clearInterval(this.intervalSecond);
    if (this.slideInterval) clearInterval(this.slideInterval);
  },

  methods: {
    startSlider() {
      this.slideInterval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
      }, 5000);
    },

    removeSpace(e) {
      if (typeof e === 'object' && e.target) {
        this.phone = e.target.value.trim();
      } else {
        this.phone = String(e).trim();
      }
    },

    password_check() {
      this.message = this.password.password;
      this.has_number = /\d/.test(this.message);
      this.has_lowercase = /[a-z]/.test(this.message);
      this.has_uppercase = /[A-Z]/.test(this.message);
      this.has_special = /[!@#\$%\^\&*\)\(+=._-]/.test(this.message);
      this.has_probel = !/\s/.test(this.message);
    },

    startTimer() {
      this.intervalSecond = setInterval(() => {
        if (this.time > 0) { this.isBtn = false; this.time--; }
        else { clearInterval(this.intervalSecond); this.time = 120; this.isBtn = true; }
      }, 1000);
    },

    async timer() {
      const phone = this.phone.split("").filter(el => el !== " ").join("");
      try {
        const response = await this.$axios.post("/user/phoneChangeReg", { phone, lang: this.$i18n.locale });
        if (response.status === 200) this.startTimer();
      } catch (e) { this.$toast.error(this.$t('a1.a42')); }
    },

    async sendPhone() {
      const phone = this.phone.split("").filter(el => el !== " ").join("");
      if (phone.length !== 13) return this.$toast.error(this.$t("a1.a86"));

      this.isLoading = true;
      try {
        const response = await this.$axios.post("/user/register", { phone, step: this.step, type: 2, lang: this.$i18n.locale });
        if (response.status === 200 && response.data.success === false) {
          const msg = response.data.message;
          if (msg === "ip-blocked") return this.$toast.error(this.$t("menu.ip_blocked"));
          if (msg === "user-already-exist") return this.$toast.error(this.$t("a1.a61"));
        }
        if (response.status === 200) { this.step = 2; this.check2 = false; this.startTimer(); }
      } catch (e) { this.$toast.error(this.$t("a1.a61")); }
      finally { this.isLoading = false; }
    },

    async sendCode() {
      this.$v.code.$touch();
      this.check2 = true;
      if (this.$v.code.$invalid) return;

      const phone = this.phone.split("").filter(el => el !== " ").join("");
      this.isLoading = true;
      try {
        const response = await this.$axios.post("/user/register", { phone, lang: this.$i18n.locale, code: this.code, step: this.step });
        if (response.status === 200 && response.data.success === false) {
          const msg = response.data.message;
          if (msg === 'code-expired') return this.$toast.error(this.$t('a1.a90'));
          if (msg === 'code-exit') return this.$toast.error(this.$t('a1.a89'));
        }
        if (response.status === 200) { this.step = 3; this.check2 = false; if (this.intervalSecond) clearInterval(this.intervalSecond); }
      } catch (e) { this.$toast.error(this.$t('a1.a42')); }
      finally { this.isLoading = false; }
    },

    async sendAllData() {
      this.submitPassword = true;
      this.$v.password.$touch();

      if (this.password.password !== this.password.confirmPassword) return this.$toast.error(this.$t('debt_list.a61'));

      if (!this.$v.password.$invalid && this.has_number && this.has_lowercase && this.has_uppercase && this.has_special && this.has_probel) {
        if (/\s/.test(this.password.password)) return this.$toast.error(this.$t('a1.a42'));

        const phone = this.phone.split("").filter(el => el !== " ").join("");
        this.isLoading = true;
        try {
          const response = await this.$axios.post("/user/register", { phone, code: this.code, lang: this.$i18n.locale, password: this.password.password, step: this.step });
          if (response.status === 200) {
            this.$toast.success(this.$t("a1.a62"));
            this.$router.push(this.localePath({ name: 'auth-login' }));
          }
        } catch (e) { this.$toast.error(this.$t('a1.a42')); }
        finally { this.isLoading = false; }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.phone-input {
  ::v-deep .vue-tel-input {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;

    input {
      @apply text-gray-900 placeholder-gray-400;
      padding: 1rem;
      font-size: 1rem;
      background: transparent !important;
    }

    .vti__dropdown {
      @apply bg-transparent;
      padding: 0.75rem;
    }

    .vti__dropdown-list {
      @apply rounded-xl shadow-lg border border-gray-200;
    }
  }
}

.testimonial-card {
  min-height: 200px;
  transition: all 0.3s ease;
}
</style>
