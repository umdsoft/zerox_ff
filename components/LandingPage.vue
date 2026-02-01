<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 lg:h-20">
          <!-- Logo -->
          <nuxt-link :to="localePath({ name: 'index' })" class="flex-shrink-0">
            <img
              v-if="$i18n.locale == 'ru'"
              src="@/assets/img/logo_ru.svg"
              alt="ZeroX"
              class="h-10 lg:h-14"
            />
            <img
              v-else-if="$i18n.locale == 'kr'"
              src="@/assets/img/logo_kr.svg"
              alt="ZeroX"
              class="h-10 lg:h-14"
            />
            <img
              v-else
              src="@/assets/img/logo.svg"
              alt="ZeroX"
              class="h-10 lg:h-14"
            />
          </nuxt-link>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center gap-8">
            <a href="#features" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              {{ texts.nav.features }}
            </a>
            <a href="#how-it-works" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              {{ texts.nav.howItWorks }}
            </a>
            <nuxt-link :to="localePath({ name: 'price' })" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              {{ texts.nav.pricing }}
            </nuxt-link>
            <a href="#download" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              {{ texts.nav.download }}
            </a>
          </div>

          <!-- Right side: Language + Auth -->
          <div class="flex items-center gap-3">
            <!-- Language Selector -->
            <div class="relative">
              <button
                @click="langOpen = !langOpen"
                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img :src="currentLangFlag" :alt="currentLangLabel" class="w-5 h-3.5 rounded-sm object-cover" />
                <span class="text-sm font-medium text-gray-700 hidden sm:inline">{{ currentLangLabel }}</span>
                <svg class="w-4 h-4 text-gray-500" :class="{ 'rotate-180': langOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                v-if="langOpen"
                class="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-max z-50"
              >
                <button
                  v-for="lang in availableLanguages"
                  :key="lang.code"
                  @click="changeLanguage(lang.code)"
                  class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-blue-50 text-blue-600': $i18n.locale === lang.code }"
                >
                  <img :src="lang.flag" :alt="lang.label" class="w-5 h-3.5 rounded-sm object-cover" />
                  <span>{{ lang.label }}</span>
                </button>
              </div>
            </div>

            <!-- Auth Buttons -->
            <nuxt-link
              :to="localePath({ name: 'auth-login' })"
              class="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {{ texts.nav.login }}
            </nuxt-link>
            <nuxt-link
              :to="localePath({ name: 'auth-register' })"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {{ texts.nav.register }}
            </nuxt-link>

            <!-- Mobile menu button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg v-if="!mobileMenuOpen" class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="lg:hidden py-4 border-t border-gray-100">
          <div class="flex flex-col gap-2">
            <a href="#features" @click="mobileMenuOpen = false" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              {{ texts.nav.features }}
            </a>
            <a href="#how-it-works" @click="mobileMenuOpen = false" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              {{ texts.nav.howItWorks }}
            </a>
            <nuxt-link :to="localePath({ name: 'price' })" @click.native="mobileMenuOpen = false" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              {{ texts.nav.pricing }}
            </nuxt-link>
            <a href="#download" @click="mobileMenuOpen = false" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              {{ texts.nav.download }}
            </a>
            <nuxt-link
              :to="localePath({ name: 'auth-login' })"
              class="sm:hidden px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
            >
              {{ texts.nav.login }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-24 lg:pt-32 pb-16 lg:pb-24 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="text-center lg:text-left">
            <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {{ texts.hero.title }}
              <span class="text-blue-600">{{ texts.hero.titleHighlight }}</span>
            </h1>

            <p class="text-lg lg:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              {{ texts.hero.description }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <nuxt-link
                :to="localePath({ name: 'auth-register' })"
                class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                {{ texts.hero.getStarted }}
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </nuxt-link>
              <a
                href="#how-it-works"
                class="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-colors"
              >
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
                {{ texts.hero.watchDemo }}
              </a>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div class="text-center lg:text-left">
                <div class="text-2xl lg:text-3xl font-bold text-gray-900">1K+</div>
                <div class="text-sm text-gray-500">{{ texts.stats.users }}</div>
              </div>
              <div class="text-center lg:text-left">
                <div class="text-2xl lg:text-3xl font-bold text-gray-900">200+</div>
                <div class="text-sm text-gray-500">{{ texts.stats.contracts }}</div>
              </div>
              <div class="text-center lg:text-left">
                <div class="text-2xl lg:text-3xl font-bold text-gray-900">100%</div>
                <div class="text-sm text-gray-500">{{ texts.stats.satisfaction }}</div>
              </div>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="relative">
            <div class="relative z-10">
              <!-- Dashboard illustration -->
              <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 lg:p-12 text-white shadow-2xl">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center" style="background-color: rgba(255,255,255,0.2)">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm" style="color: rgba(191, 219, 254, 1)">{{ texts.dashboard.totalDebt }}</div>
                    <div class="text-2xl font-bold">4,770,000 UZS</div>
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 rounded-xl" style="background-color: rgba(255,255,255,0.1)">
                    <span>{{ texts.dashboard.debitor }}</span>
                    <span class="font-semibold">25,000,000 UZS</span>
                  </div>
                  <div class="flex items-center justify-between p-4 rounded-xl" style="background-color: rgba(255,255,255,0.1)">
                    <span>{{ texts.dashboard.creditor }}</span>
                    <span class="font-semibold">20,230,000 UZS</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Decorative elements -->
            <div class="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full blur-2xl" style="opacity: 0.5"></div>
            <div class="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-300 rounded-full blur-2xl" style="opacity: 0.4"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-16 lg:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {{ texts.features.title }}
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            {{ texts.features.description }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[0].title }}</h3>
            <p class="text-gray-600">{{ texts.features.items[0].desc }}</p>
          </div>

          <!-- Feature 2 -->
          <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[1].title }}</h3>
            <p class="text-gray-600">{{ texts.features.items[1].desc }}</p>
          </div>

          <!-- Feature 3 -->
          <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[2].title }}</h3>
            <p class="text-gray-600">{{ texts.features.items[2].desc }}</p>
          </div>

          <!-- Feature 4 -->
          <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[3].title }}</h3>
            <p class="text-gray-600">{{ texts.features.items[3].desc }}</p>
          </div>

          <!-- Feature 5 -->
          <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[4].title }}</h3>
            <p class="text-gray-600">{{ texts.features.items[4].desc }}</p>
          </div>

          <!-- Feature 6 -->
          <div class="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
              <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[5].title }}</h3>
            <p class="text-gray-600">{{ texts.features.items[5].desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-16 lg:py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {{ texts.howItWorks.title }}
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            {{ texts.howItWorks.description }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="relative text-center">
            <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.howItWorks.steps[0].title }}</h3>
            <p class="text-gray-600">{{ texts.howItWorks.steps[0].desc }}</p>
          </div>

          <!-- Step 2 -->
          <div class="relative text-center">
            <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.howItWorks.steps[1].title }}</h3>
            <p class="text-gray-600">{{ texts.howItWorks.steps[1].desc }}</p>
          </div>

          <!-- Step 3 -->
          <div class="relative text-center">
            <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.howItWorks.steps[2].title }}</h3>
            <p class="text-gray-600">{{ texts.howItWorks.steps[2].desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Download Section - Premium Design -->
    <section id="download" class="download-section">
      <!-- Background Effects -->
      <div class="download-bg">
        <div class="download-bg-gradient"></div>
        <div class="download-bg-pattern"></div>
        <div class="download-bg-glow"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- Content Side -->
          <div class="download-content">
            <!-- Badge -->
            <div class="download-badge">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
              </svg>
              <span>{{ texts.download.badge || 'Bepul yuklab oling' }}</span>
            </div>

            <h2 class="download-title">
              {{ texts.download.title }}
            </h2>

            <p class="download-description">
              {{ texts.download.description }}
            </p>

            <!-- App Stats -->
            <div class="download-stats">
              <div class="download-stat">
                <div class="download-stat-value">4.8</div>
                <div class="download-stat-stars">
                  <svg v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <div class="download-stat-label">{{ texts.download.rating || 'Reyting' }}</div>
              </div>
              <div class="download-stat-divider"></div>
              <div class="download-stat">
                <div class="download-stat-value">1K+</div>
                <div class="download-stat-label">{{ texts.download.downloads || 'Yuklab olishlar' }}</div>
              </div>
              <div class="download-stat-divider"></div>
              <div class="download-stat">
                <div class="download-stat-value">100%</div>
                <div class="download-stat-label">{{ texts.download.free || 'Bepul' }}</div>
              </div>
            </div>

            <!-- Download Cards -->
            <div class="download-cards">
              <!-- Google Play Card -->
              <div class="download-card-premium">
                <div class="download-card-qr">
                  <div class="download-card-qr-inner">
                    <client-only>
                      <vue-qr
                        :text="'https://play.google.com/store/apps/details?id=com.zeroxuz'"
                        :size="90"
                        :margin="0"
                        color-dark="#ffffff"
                        color-light="transparent"
                      />
                    </client-only>
                  </div>
                  <span class="download-card-qr-label">{{ texts.download.scanQr || 'QR kodni skanerlang' }}</span>
                </div>
                <div class="download-card-info">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.zeroxuz"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="download-card-btn download-card-btn-android"
                  >
                    <svg class="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                    </svg>
                    <div>
                      <span class="download-card-btn-label">GET IT ON</span>
                      <span class="download-card-btn-store">Google Play</span>
                    </div>
                  </a>
                  <div class="download-card-meta">
                    <span class="download-card-meta-item">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Android 6.0+
                    </span>
                  </div>
                </div>
              </div>

              <!-- App Store Card -->
              <div class="download-card-premium">
                <div class="download-card-qr">
                  <div class="download-card-qr-inner">
                    <client-only>
                      <vue-qr
                        :text="'https://apps.apple.com/uz/app/zerox/id6446497826'"
                        :size="90"
                        :margin="0"
                        color-dark="#ffffff"
                        color-light="transparent"
                      />
                    </client-only>
                  </div>
                  <span class="download-card-qr-label">{{ texts.download.scanQr || 'QR kodni skanerlang' }}</span>
                </div>
                <div class="download-card-info">
                  <a
                    href="https://apps.apple.com/uz/app/zerox/id6446497826"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="download-card-btn download-card-btn-ios"
                  >
                    <svg class="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div>
                      <span class="download-card-btn-label">Download on the</span>
                      <span class="download-card-btn-store">App Store</span>
                    </div>
                  </a>
                  <div class="download-card-meta">
                    <span class="download-card-meta-item">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      iOS 13.0+
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Phone Mockup Side -->
          <div class="download-phone-wrapper">
            <div class="download-phone-glow"></div>
            <div class="download-phone">
              <img src="@/assets/telefon.png" alt="ZeroX Mobile App" class="download-phone-img" />
            </div>
            <!-- Floating Elements -->
            <div class="download-float download-float-1">
              <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>{{ texts.download.secure || 'Xavfsiz' }}</span>
            </div>
            <div class="download-float download-float-2">
              <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
              </svg>
              <span>{{ texts.download.fast || 'Tez' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 lg:py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          {{ texts.cta.title }}
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          {{ texts.cta.description }}
        </p>
        <nuxt-link
          :to="localePath({ name: 'auth-register' })"
          class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
        >
          {{ texts.cta.button }}
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </nuxt-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <img src="@/assets/img/logo.svg" alt="ZeroX" class="h-10 mb-4 brightness-0 invert" />
            <p class="text-sm mb-4 max-w-md">
              {{ texts.footer.description }}
            </p>
            <div class="flex gap-4">
              <a href="https://t.me/ZeroxUZ" target="_blank" class="w-10 h-10 bg-gray-800 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.154.234.17.33.015.097.034.318.019.49z"/>
                </svg>
              </a>
              <a href="https://instagram.com/zeroxuz" target="_blank" class="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://twitter.com/zeroxuz" target="_blank" class="w-10 h-10 bg-gray-800 hover:bg-black rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://facebook.com/zeroxuz" target="_blank" class="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@zeroxuz" target="_blank" class="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-4">{{ texts.footer.linksTitle }}</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#features" class="hover:text-white transition-colors">{{ texts.nav.features }}</a></li>
              <li><a href="#how-it-works" class="hover:text-white transition-colors">{{ texts.nav.howItWorks }}</a></li>
              <li><nuxt-link :to="localePath({ name: 'price' })" class="hover:text-white transition-colors">{{ texts.nav.pricing }}</nuxt-link></li>
              <li><nuxt-link :to="localePath({ name: 'instruction' })" class="hover:text-white transition-colors">{{ texts.footer.instruction }}</nuxt-link></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-semibold mb-4">{{ texts.footer.contactTitle }}</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@zerox.uz
              </li>
              <li>
                <a href="https://t.me/zeroxuz_bot" target="_blank" class="flex items-center gap-2 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.154.234.17.33.015.097.034.318.019.49z"/>
                  </svg>
                  @zeroxuz_bot
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2022-{{ new Date().getFullYear() }}. "ZEROX" MChJ. {{ texts.footer.rights }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import VueQr from 'vue-qr';

export default {
  name: 'LandingPage',
  components: {
    VueQr
  },
  data() {
    return {
      langOpen: false,
      mobileMenuOpen: false,
    };
  },
  computed: {
    currentLangLabel() {
      const locale = this.$i18n.locale;
      if (locale === 'uz') return 'UZ';
      if (locale === 'ru') return 'RU';
      if (locale === 'kr') return 'УЗ';
      return 'UZ';
    },
    currentLangFlag() {
      const locale = this.$i18n.locale;
      if (locale === 'ru') return require('@/assets/img/lang/ru.png');
      return require('@/assets/img/lang/uz.png');
    },
    availableLanguages() {
      return [
        { code: 'uz', label: "O'zbekcha", flag: require('@/assets/img/lang/uz.png') },
        { code: 'ru', label: 'Русский', flag: require('@/assets/img/lang/ru.png') },
        { code: 'kr', label: 'Ўзбекча', flag: require('@/assets/img/lang/uz.png') },
      ];
    },
    texts() {
      const locale = this.$i18n.locale;

      const translations = {
        uz: {
          nav: {
            features: 'Imkoniyatlar',
            howItWorks: 'Qanday ishlaydi',
            pricing: 'Tariflar',
            download: 'Yuklab olish',
            login: 'Kirish',
            register: "Ro'yxatdan o'tish"
          },
          hero: {
            trusted: "200+ shartnoma rasmiylashtirilgan",
            title: "Qarz shartnomalarini ",
            titleHighlight: "rasmiylashtiring",
            description: "ZeroX - qarz munosabatlarini elektron ro'yxatga olish va tartibga solish tizimi. Tizim orqali qarzlar va qarz savdolarini oson, tez va bepul boshqaring.",
            getStarted: "Shartnoma tuzish",
            watchDemo: "Qanday ishlashini ko'ring"
          },
          stats: {
            users: "Foydalanuvchilar",
            contracts: "Shartnomalar",
            satisfaction: "Ishonchlilik"
          },
          dashboard: {
            totalDebt: "Umumiy balans",
            debitor: "Berilgan qarz",
            creditor: "Olingan qarz"
          },
          features: {
            title: "Nima uchun ZeroX?",
            description: "Qarz shartnomalarini rasmiylashtirish va boshqarishda eng ishonchli yechim",
            items: [
              { title: "Rasmiy shartnoma", desc: "Har bir qarz oldi-berdi jarayoni elektron shartnoma bilan rasmiylashtiriladi." },
              { title: "Ikki tomonlama tasdiqlash", desc: "Qarz beruvchi va qarz oluvchining ikkalasi ham shartnomani tasdiqlashi kerak." },
              { title: "Qarz tarixi", desc: "Shartnoma rasmiylashtirishdan oldin qarz oluvchining qarz tarixi bilan tanishib chiqing." },
              { title: "Qarzdorlar ro'yxati", desc: "Qarzdorlar ro'yxati va QR-kod orqali qarz oluvchi yoki qarz beruvchini tezda toping." },
              { title: "Muddatli eslatmalar", desc: "Qarzni qaytarish muddati yaqinlashganda avtomatik bildirishnoma. Hech qachon unutmaysiz." },
              { title: "Mobil ilova", desc: "iOS va Android uchun mobil ilovalar. Istalgan joydan shartnoma tuzing." }
            ]
          },
          howItWorks: {
            title: "Qanday ishlaydi?",
            description: "3 ta oddiy qadamda qarz shartnomangizni rasmiylashtiring",
            steps: [
              { title: "Ro'yxatdan o'ting", desc: "Telefon raqamingiz orqali ro'yxatdan o'ting va shaxsingizni tasdiqlang." },
              { title: "Shartnoma tuzing", desc: "Qarz beruvchi yoki qarz oluvchi sifatida shartnoma yarating. Qarz miqdori va qaytarish muddatini kiriting." },
              { title: "Tasdiqlang", desc: "Ikkinchi tomon shartnomani tasdiqlaydi va shu bilan shartnoma kuchga kiradi!" }
            ]
          },
          download: {
            title: "Mobil ilovani yuklab oling",
            description: "iOS va Android uchun bepul mobil ilova. Istalgan joydan qarz munosabatlarini rasmiylashtiring va oson boshqaring.",
            badge: "Bepul yuklab oling",
            rating: "Reyting",
            downloads: "Yuklab olishlar",
            free: "Bepul",
            scanQr: "QR-kodni skanerlang",
            secure: "Xavfsiz",
            fast: "Tez"
          },
          cta: {
            title: "Birinchi shartnomangizni tuzing!",
            description: "Minglab foydalanuvchilar qarz munosabatlarini ZeroX orqali rasmiylashtirishmoqda.",
            button: "Bepul boshlash"
          },
          footer: {
            description: "ZeroX - qarz munosabatlarini elektron ro'yxatga olish va tartibga solish tizimi.",
            linksTitle: "Havolalar",
            contactTitle: "Aloqa",
            instruction: "Yo'riqnoma",
            rights: "Barcha huquqlar himoyalangan."
          }
        },
        ru: {
          nav: {
            features: 'Возможности',
            howItWorks: 'Как это работает',
            pricing: 'Тарифы',
            download: 'Скачать',
            login: 'Войти',
            register: 'Регистрация'
          },
          hero: {
            trusted: "Оформлено 200+ договоров",
            title: "Оформляйте договоры ",
            titleHighlight: "займа онлайн",
            description: "ZeroX — система электронного учета и регулирования долговых отношений. Управляйте займами и продажами в долг через систему — легко, быстро и бесплатно.",
            getStarted: "Создать договор",
            watchDemo: "Как это работает"
          },
          stats: {
            users: "Пользователей",
            contracts: "Договоров",
            satisfaction: "Надёжность"
          },
          dashboard: {
            totalDebt: "Общий баланс",
            debitor: "Выданный заём",
            creditor: "Полученный заём"
          },
          features: {
            title: "Почему ZeroX?",
            description: "Самое надёжное решение для оформления и управления договорами займа",
            items: [
              { title: "Официальный договор", desc: "Каждая долговая операция оформляется электронным договором." },
              { title: "Двустороннее подтверждение", desc: "Договор должен быть подтвержден обеими сторонами — и заимодавцем, и заемщиком." },
              { title: "Долговая история", desc: "Перед оформлением договора ознакомьтесь с долговой историей заемщика." },
              { title: "Список должников", desc: "Используйте список должников или QR-код для быстрого поиска заемщика или заимодавца." },
              { title: "Напоминания о сроках", desc: "Автоматическое уведомление о приближении срока возврата долга. Никогда не забудете." },
              { title: "Мобильное приложение", desc: "Приложения для iOS и Android. Оформляйте договоры займа где угодно." }
            ]
          },
          howItWorks: {
            title: "Как это работает?",
            description: "Оформите договор займа всего за 3 простых шага",
            steps: [
              { title: "Зарегистрируйтесь", desc: "Зарегистрируйтесь по номеру телефона и подтвердите вашу личность." },
              { title: "Создайте договор", desc: "Создайте договор как заимодавца или заемщика. Укажите сумму займа и срок возврата." },
              { title: "Подтвердите", desc: "Вторая сторона подтверждает договор и договор вступает в силу!" }
            ]
          },
          download: {
            title: "Скачайте мобильное приложение",
            description: "Бесплатное приложение для iOS и Android. Оформляйте и управляйте долговыми отношениями где угодно.",
            badge: "Скачать бесплатно",
            rating: "Рейтинг",
            downloads: "Скачиваний",
            free: "Бесплатно",
            scanQr: "Сканируйте QR-код",
            secure: "Безопасно",
            fast: "Быстро"
          },
          cta: {
            title: "Создайте свой первый договор!",
            description: "Тысячи пользователей оформляют долговые отношения через ZeroX.",
            button: "Начать бесплатно"
          },
          footer: {
            description: "ZeroX — система электронного учета и регулирования долговых отношений.",
            linksTitle: "Ссылки",
            contactTitle: "Контакты",
            instruction: "Инструкция",
            rights: "Все права защищены."
          }
        },
        kr: {
          nav: {
            features: 'Имкониятлар',
            howItWorks: 'Қандай ишлайди',
            pricing: 'Тарифлар',
            download: 'Юклаб олиш',
            login: 'Кириш',
            register: "Рўйхатдан ўтиш"
          },
          hero: {
            trusted: "200+ шартнома расмийлаштирилган",
            title: "Қарз шартномаларини ",
            titleHighlight: "расмийлаштиринг",
            description: "ZeroX - қарз муносабатларини электрон рўйхатга олиш ва тартибга солиш тизими. Тизим орқали қарзлар ва қарз савдоларини осон, тез ва бепул бошқаринг.",
            getStarted: "Шартнома тузиш",
            watchDemo: "Қандай ишлашини кўринг"
          },
          stats: {
            users: "Фойдаланувчилар",
            contracts: "Шартномалар",
            satisfaction: "Ишончлилик"
          },
          dashboard: {
            totalDebt: "Умумий баланс",
            debitor: "Берилган қарз",
            creditor: "Олинган қарз"
          },
          features: {
            title: "Нима учун ZeroX?",
            description: "Қарз шартномаларини расмийлаштириш ва бошқаришда энг ишончли ечим",
            items: [
              { title: "Расмий шартнома", desc: "Ҳар бир қарз олди-берди жараёни электрон шартнома билан расмийлаштирилади." },
              { title: "Икки томонлама тасдиқлаш", desc: "Қарз берувчи ва қарз олувчининг иккаласи ҳам шартномани тасдиқлаши керак." },
              { title: "Қарз тарихи", desc: "Шартнома расмийлаштиришдан олдин қарз олувчининг қарз тарихи билан танишиб чиқинг." },
              { title: "Қарздорлар рўйхати", desc: "Қарздорлар рўйхати ва QR-код орқали қарз олувчи ёки қарз берувчини тезда топинг." },
              { title: "Муддатли эслатмалар", desc: "Қарзни қайтариш муддати яқинлашганда автоматик билдиришнома. Ҳеч қачон унутмайсиз." },
              { title: "Мобил илова", desc: "iOS ва Android учун мобил иловалар. Исталган жойдан шартнома тузинг." }
            ]
          },
          howItWorks: {
            title: "Қандай ишлайди?",
            description: "3 та оддий қадамда қарз шартномангизни расмийлаштиринг",
            steps: [
              { title: "Рўйхатдан ўтинг", desc: "Телефон рақамингиз орқали рўйхатдан ўтинг ва шахсингизни тасдиқланг." },
              { title: "Шартнома тузинг", desc: "Қарз берувчи ёки қарз олувчи сифатида шартнома яратинг. Қарз миқдори ва қайтариш муддатини киритинг." },
              { title: "Тасдиқланг", desc: "Иккинчи томон шартномани тасдиқлайди ва шу билан шартнома кучга киради!" }
            ]
          },
          download: {
            title: "Мобил иловани юклаб олинг",
            description: "iOS ва Android учун бепул мобил илова. Исталган жойдан қарз муносабатларини расмийлаштиринг ва осон бошқаринг.",
            badge: "Бепул юклаб олинг",
            rating: "Рейтинг",
            downloads: "Юклаб олишлар",
            free: "Бепул",
            scanQr: "QR-кодни сканерланг",
            secure: "Хавфсиз",
            fast: "Тез"
          },
          cta: {
            title: "Биринчи шартномангизни тузинг!",
            description: "Минглаб фойдаланувчилар қарз муносабатларини ZeroX орқали расмийлаштирмоқда.",
            button: "Бепул бошлаш"
          },
          footer: {
            description: "ZeroX - қарз муносабатларини электрон рўйхатга олиш ва тартибга солиш тизими.",
            linksTitle: "Ҳаволалар",
            contactTitle: "Алоқа",
            instruction: "Йўриқнома",
            rights: "Барча ҳуқуқлар ҳимояланган."
          }
        }
      };

      return translations[locale] || translations.uz;
    }
  },
  mounted() {
    document.addEventListener('click', this.closeLangDropdown);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeLangDropdown);
  },
  methods: {
    changeLanguage(lang) {
      this.$i18n?.setLocaleCookie?.(lang);
      localStorage.setItem('app-language', lang);
      if (typeof this.$i18n?.setLocale === 'function') this.$i18n.setLocale(lang);
      else this.$i18n.locale = lang;
      this.langOpen = false;
    },
    closeLangDropdown(e) {
      if (!e.target.closest('.relative')) {
        this.langOpen = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* ========================================
   DOWNLOAD SECTION - PREMIUM DESIGN
   ======================================== */

.download-section {
  position: relative;
  padding: 4rem 0;
  overflow: hidden;
  display: flex;
  align-items: center;
}

/* Background Effects */
.download-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.download-bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 25%, #1e3a5f 50%, #0f172a 100%);
}

.download-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%);
}

.download-bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
  filter: blur(50px);
  animation: pulseGlow 8s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

/* Content Styling */
.download-content {
  color: white;
}

.download-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
}

.download-title {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.download-description {
  font-size: 1rem;
  color: rgba(191, 219, 254, 0.9);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 450px;
}

/* Stats */
.download-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.download-stat {
  text-align: center;
  flex: 1;
}

.download-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.download-stat-stars {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-top: 0.25rem;
}

.download-stat-label {
  font-size: 0.75rem;
  color: rgba(191, 219, 254, 0.7);
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.download-stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
}

/* Download Cards - Premium */
.download-cards {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.download-card-premium {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  padding: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(59, 130, 246, 0.15);
  }
}

.download-card-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: transparent;
  margin-bottom: 0.5rem;
}

.download-card-qr-inner {
  width: 90px;
  height: 90px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  .download-card-premium:hover & {
    transform: scale(1.05);
  }
}

.download-card-qr-label {
  font-size: 0.65rem;
  color: rgba(191, 219, 254, 0.6);
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.download-card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.download-card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  width: 100%;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &-android {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    &:hover {
      background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
      transform: scale(1.02);
    }
  }

  &-ios {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    &:hover {
      background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
      transform: scale(1.02);
    }
  }

  &-label {
    display: block;
    font-size: 0.6rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  &-store {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.1;
  }
}

.download-card-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.download-card-meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.65rem;
  color: rgba(191, 219, 254, 0.6);

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
}

/* Phone Mockup */
.download-phone-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.download-phone-glow {
  position: absolute;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
  filter: blur(40px);
  animation: phoneGlow 4s ease-in-out infinite;
}

@keyframes phoneGlow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.download-phone {
  position: relative;
  z-index: 1;
}

.download-phone-img {
  max-width: 260px;
  height: auto;
  filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4));
  animation: phoneFloat 6s ease-in-out infinite;
}

@keyframes phoneFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Floating Elements */
.download-float {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
  z-index: 2;

  svg {
    width: 1rem;
    height: 1rem;
  }

  &-1 {
    top: 20%;
    right: 10%;
    animation: float1 5s ease-in-out infinite;
  }

  &-2 {
    bottom: 25%;
    left: 5%;
    animation: float2 6s ease-in-out infinite;
  }
}

@keyframes float1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
}

@keyframes float2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(-3deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .download-title {
    font-size: 2.5rem;
  }

  .download-phone-wrapper {
    display: none;
  }
}

@media (max-width: 768px) {
  .download-section {
    padding: 3rem 0;
  }

  .download-title {
    font-size: 1.75rem;
  }

  .download-description {
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
  }

  .download-stats {
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .download-stat-divider {
    display: none;
  }

  .download-stat {
    min-width: calc(33% - 0.75rem);
  }

  .download-stat-value {
    font-size: 1.25rem;
  }

  .download-cards {
    flex-direction: column;
    gap: 0.75rem;
  }

  .download-card-premium {
    flex-direction: row;
    padding: 0.75rem;
  }

  .download-card-qr {
    margin-bottom: 0;
    margin-right: 0.75rem;
    padding: 0.5rem;
  }

  .download-card-qr-inner {
    width: 70px;
    height: 70px;
  }

  .download-card-qr-label {
    display: none;
  }

  .download-card-info {
    align-items: flex-start;
  }

  .download-card-btn {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .download-title {
    font-size: 1.5rem;
  }

  .download-description {
    font-size: 0.875rem;
  }

  .download-stats {
    padding: 0.75rem;
  }

  .download-stat-value {
    font-size: 1.125rem;
  }

  .download-card-qr-inner {
    width: 60px;
    height: 60px;
  }
}
</style>
