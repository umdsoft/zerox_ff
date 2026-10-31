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

            <form class="space-y-6" @submit.prevent="sendPhone">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">{{ texts.step1.phoneLabel }}</label>
                <div class="relative">
                  <input
                    v-model="phone"
                    v-mask="'+998 ## ### ## ##'"
                    type="tel"
                    inputmode="tel"
                    maxlength="17"
                    autocomplete="tel"
                    class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-sm outline-none transition-all duration-200"
                    :class="!$v.phone.required && check2 ? 'border-red-400 bg-red-50' : ''"
                    placeholder="+998 __ ___ __ __"
                    @input="removeSpace"
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
              <!-- 29.09: maxfiylik siyosati — telefon + tasdiqlash kodi kiritilishi siyosatni qabul qilish hisoblanadi -->
              <p class="zx-privacy-note">
                {{ privacyNotice.before }}<nuxt-link :to="localePath({ name: 'privacy-policy' })" target="_blank" rel="noopener" class="zx-privacy-note__link">{{ privacyNotice.link }}</nuxt-link>{{ privacyNotice.after }}
              </p>
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

            <form class="space-y-6" @submit.prevent="sendCode">
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
              <!-- 29.09: maxfiylik siyosati — telefon + tasdiqlash kodi kiritilishi siyosatni qabul qilish hisoblanadi -->
              <p class="zx-privacy-note">
                {{ privacyNotice.before }}<nuxt-link :to="localePath({ name: 'privacy-policy' })" target="_blank" rel="noopener" class="zx-privacy-note__link">{{ privacyNotice.link }}</nuxt-link>{{ privacyNotice.after }}
              </p>

              <!-- Timer -->
              <div class="text-center py-2">
                <button v-if="isBtn" type="button" class="text-blue-600 hover:text-blue-700 font-medium" @click="timer">
                  {{ texts.step2.resend }}
                </button>
                <p v-else class="text-gray-500">
                  {{ texts.step2.waitText }}: <span class="font-bold text-blue-600">{{ waitingTime }}</span>
                </p>
              </div>
            </form>

            <button class="mt-4 w-full py-3 text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center" @click="step = 1">
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

            <form class="space-y-5" @submit.prevent="sendAllData">
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
                  <button type="button" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" @click="showPassword = !showPassword">
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
                  <button type="button" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" @click="showConfirmPassword = !showConfirmPassword">
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

            <button class="mt-4 w-full py-3 text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center" @click="step = 2">
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
              </div>
            </div>
          </div>

          <!-- Slider Dots -->
          <div class="flex items-center justify-center space-x-2">
            <button
              v-for="(_, index) in testimonials"
              :key="index"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="currentSlide === index ? 'bg-white w-6' : 'bg-white bg-opacity-40'"
              @click="currentSlide = index"
            ></button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white border-opacity-20">
          <div class="text-center">
            <p class="text-3xl font-bold">1K+</p>
            <p class="text-blue-200 text-sm">{{ texts.panel.stats.users }}</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold">200+</p>
            <p class="text-blue-200 text-sm">{{ texts.panel.stats.contracts }}</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold">100%</p>
            <p class="text-blue-200 text-sm">{{ texts.panel.stats.satisfaction }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, sameAs, helpers } from "vuelidate/lib/validators";
import { postRegister, postPhoneChangeReg } from '@/api/user';

const alpha = helpers.regex("alpha", /^(?:(?:(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]))|(?:(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|\]))|(?:(?=.*[0-9])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|\]))|(?:(?=.*[0-9])(?=.*[a-z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|\]))).{6,32}$/);
import registerViewMixin from '~/mixins/registerViewMixin.js';

export default {
  name: 'RegisterPage',
  mixins: [registerViewMixin],
  auth: false,
  // SS-AUDIT (2026-09-25): ishlatilmagan VueTelInput ro'yxati/importi olib tashlandi

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


  created() {
    this.$store.commit("changeBreadCrumb", [{ title: this.$t('debt_list.a38'), name: "auth-register" }]);
  },

  mounted() {
    this.startSlider();
  },

  beforeDestroy() {
    if (this.intervalSecond) {clearInterval(this.intervalSecond);}
    if (this.slideInterval) {clearInterval(this.slideInterval);}
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
        const response = await postPhoneChangeReg(this.$axios, { phone, lang: this.$apiLang() /* SS-DEV (2026-09-26): en/kaa -> uz */ }, { silent: true });
        if (response.status === 200) {this.startTimer();}
      } catch (e) { this.$toast.error(this.$t('a1.a42')); }
    },

    async sendPhone() {
      const phone = this.phone.split("").filter(el => el !== " ").join("");
      if (phone.length !== 13) {return this.$toast.error(this.$t("a1.a86"));}

      this.isLoading = true;
      try {
        const response = await postRegister(this.$axios, { phone, step: this.step, type: 2, lang: this.$apiLang() /* SS-DEV (2026-09-26): en/kaa -> uz */ }, { silent: true });
        if (response.status === 200 && response.data.success === false) {
          const msg = response.data.message;
          if (msg === "ip-blocked") {return this.$toast.error(this.$t("menu.ip_blocked"));}
          if (msg === "user-already-exist") {return this.$toast.error(this.$t("a1.a61"));}
        }
        if (response.status === 200) { this.step = 2; this.check2 = false; this.startTimer(); }
      } catch (e) { this.$toast.error(this.$t("a1.a61")); }
      finally { this.isLoading = false; }
    },

    async sendCode() {
      this.$v.code.$touch();
      this.check2 = true;
      if (this.$v.code.$invalid) {return;}

      const phone = this.phone.split("").filter(el => el !== " ").join("");
      this.isLoading = true;
      try {
        const response = await postRegister(this.$axios, { phone, lang: this.$apiLang() /* SS-DEV (2026-09-26): en/kaa -> uz */, code: this.code, step: this.step }, { silent: true });
        if (response.status === 200 && response.data.success === false) {
          const msg = response.data.message;
          if (msg === 'code-expired') {return this.$toast.error(this.$t('a1.a90'));}
          if (msg === 'code-exit') {return this.$toast.error(this.$t('a1.a89'));}
        }
        if (response.status === 200) { this.step = 3; this.check2 = false; if (this.intervalSecond) {clearInterval(this.intervalSecond);} }
      } catch (e) { this.$toast.error(this.$t('a1.a42')); }
      finally { this.isLoading = false; }
    },

    async sendAllData() {
      this.submitPassword = true;
      this.$v.password.$touch();

      if (this.password.password !== this.password.confirmPassword) {return this.$toast.error(this.$t('debt_list.a61'));}

      if (!this.$v.password.$invalid && this.has_number && this.has_lowercase && this.has_uppercase && this.has_special && this.has_probel) {
        if (/\s/.test(this.password.password)) {return this.$toast.error(this.$t('a1.a42'));}

        const phone = this.phone.split("").filter(el => el !== " ").join("");
        this.isLoading = true;
        try {
          const response = await postRegister(this.$axios, { phone, code: this.code, lang: this.$apiLang() /* SS-DEV (2026-09-26): en/kaa -> uz */, password: this.password.password, step: this.step }, { silent: true });
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
/* 29.09: maxfiylik siyosati ogohlantirishi */
.zx-privacy-note {
  margin-top: 4px;
  font-size: 12.5px;
  line-height: 1.55;
  color: #6b7280;
  text-align: center;
}
.zx-privacy-note__link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.zx-privacy-note__link:hover {
  color: #1d4ed8;
}
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
