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
            <!-- SS20 (2026-09-21): YANGI "Modullar" anchori — landing endi 4 ta modulni ko'rsatadi -->
            <a href="#modules" class="text-gray-600 hover:text-blue-600 font-medium transition-colors" @click.prevent="goToSection('#modules')">
              {{ texts.nav.modules }}
            </a>
            <a href="#features" class="text-gray-600 hover:text-blue-600 font-medium transition-colors" @click.prevent="goToSection('#features')">
              {{ texts.nav.features }}
            </a>
            <a href="#how-it-works" class="text-gray-600 hover:text-blue-600 font-medium transition-colors" @click.prevent="goToSection('#how-it-works')">
              {{ texts.nav.howItWorks }}
            </a>
            <!-- SS-DEV (2026-09-24): "Tariflar" — sahifadagi #pricing bo'limiga (11-rasm).
                 Hujjat-4 6-band: barcha anchorlar `goToSection` bilan SILLIQ tushadi (yangi sahifa/oyna emas). -->
            <a href="#pricing" class="text-gray-600 hover:text-blue-600 font-medium transition-colors" @click.prevent="goToSection('#pricing')">
              {{ texts.nav.pricing }}
            </a>
            <a href="#download" class="text-gray-600 hover:text-blue-600 font-medium transition-colors" @click.prevent="goToSection('#download')">
              {{ texts.nav.download }}
            </a>
          </div>

          <!-- Right side: Language + Auth -->
          <div class="flex items-center gap-3">
            <!-- Language Selector -->
            <div class="relative">
              <button
                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                @click="langOpen = !langOpen"
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
                  class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-blue-50 text-blue-600': $i18n.locale === lang.code }"
                  @click="changeLanguage(lang.code)"
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
              class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              @click="mobileMenuOpen = !mobileMenuOpen"
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
            <!-- SS20 (2026-09-21): mobil menyuda ham "Modullar" -->
            <a href="#modules" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent="goToSection('#modules')">
              {{ texts.nav.modules }}
            </a>
            <a href="#features" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent="goToSection('#features')">
              {{ texts.nav.features }}
            </a>
            <a href="#how-it-works" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent="goToSection('#how-it-works')">
              {{ texts.nav.howItWorks }}
            </a>
            <a href="#pricing" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent="goToSection('#pricing')">
              {{ texts.nav.pricing }}
            </a>
            <a href="#download" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg" @click.prevent="goToSection('#download')">
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

    <LandingHero :texts="texts" />

    <LandingModules :texts="texts" />

    <LandingFeatures :texts="texts" />

    <LandingHowItWorks :texts="texts" />

    <LandingPricing :texts="texts" :plans="plans" :daftari-title="daftariTitle" :contract-pricing="contractPricing" />

    <LandingDownload :texts="texts" />

    <LandingCta :texts="texts" />

    <LandingFooter :texts="texts" />
  </div>
</template>

<script>
import { getPlans, CONTRACT_PRICING, daftariGroupTitle } from '~/utils/pricingPlans';
import { getLandingTexts } from '~/utils/landingTexts';
import LandingHero from '~/components/landing/LandingHero.vue';
import LandingModules from '~/components/landing/LandingModules.vue';
import LandingFeatures from '~/components/landing/LandingFeatures.vue';
import LandingHowItWorks from '~/components/landing/LandingHowItWorks.vue';
import LandingPricing from '~/components/landing/LandingPricing.vue';
import LandingDownload from '~/components/landing/LandingDownload.vue';
import LandingCta from '~/components/landing/LandingCta.vue';
import LandingFooter from '~/components/landing/LandingFooter.vue';

export default {
  name: 'LandingPage',
  components: {
    LandingHero,
    LandingModules,
    LandingFeatures,
    LandingHowItWorks,
    LandingPricing,
    LandingDownload,
    LandingCta,
    LandingFooter,
  },
  data() {
    return {
      langOpen: false,
      mobileMenuOpen: false,
    };
  },
  computed: {
    // SS-DEV (2026-09-24): tariflar — pages/price bilan yagona manba
    daftariTitle() {
      return daftariGroupTitle(this.$i18n.locale);
    },
    plans() {
      return getPlans(this.$i18n.locale);
    },
    contractPricing() {
      return CONTRACT_PRICING[this.$i18n.locale] || CONTRACT_PRICING.uz;
    },
    currentLangLabel() {
      const locale = this.$i18n.locale;
      if (locale === 'uz') {return 'UZ';}
      if (locale === 'ru') {return 'RU';}
      if (locale === 'kr') {return 'УЗ';}
      if (locale === 'kaa') {return 'QQ';} // SS-DEV (2026-09-26)
      if (locale === 'en') {return 'EN';} // SS-DEV (2026-09-26)
      return 'UZ';
    },
    currentLangFlag() {
      const locale = this.$i18n.locale;
      if (locale === 'ru') {return require('@/assets/img/lang/ru.png');}
      if (locale === 'kaa') {return require('@/assets/img/lang/kaa.svg');} // SS-DEV (2026-09-26)
      if (locale === 'en') {return require('@/assets/img/lang/en.svg');} // SS-DEV (2026-09-26)
      return require('@/assets/img/lang/uz.png');
    },
    availableLanguages() {
      // SS-DEV (2026-09-26): mobil ilovadagi tartib — O'zbekcha, Ўзбекча, Русский, Qaraqalpaqsha, English.
      return [
        { code: 'uz', label: "O'zbekcha", flag: require('@/assets/img/lang/uz.png') },
        { code: 'kr', label: 'Ўзбекча', flag: require('@/assets/img/lang/uz.png') },
        { code: 'ru', label: 'Русский', flag: require('@/assets/img/lang/ru.png') },
        { code: 'kaa', label: 'Qaraqalpaqsha', flag: require('@/assets/img/lang/kaa.svg') },
        { code: 'en', label: 'English', flag: require('@/assets/img/lang/en.svg') },
      ];
    },
    texts() {
      return getLandingTexts(this.$i18n.locale);
    }
  },
  mounted() {
    document.addEventListener('click', this.closeLangDropdown);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeLangDropdown);
  },
  methods: {
    /**
     * SS-DEV (2026-09-24), hujjat-4 6-band: navbar anchorlari ("Tariflar", "Imkoniyatlar"...)
     * — yangi sahifa/oyna EMAS, shu sahifadagi bo'limga SILLIQ tushish (sticky navbar
     * balandligi hisobga olinadi). Mobil menyu yopiladi, URL hash yangilanadi.
     */
    goToSection(hash) {
      this.mobileMenuOpen = false;
      if (typeof document === 'undefined') {return;}
      const el = document.querySelector(hash);
      if (!el) {return;}
      const nav = document.querySelector('nav');
      const offset = (nav && nav.offsetHeight) || 72;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset + 4;
      try { window.scrollTo({ top, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, top); }
      try { window.history.replaceState(null, '', hash); } catch (_) {}
    },
    changeLanguage(lang) {
      this.$i18n?.setLocaleCookie?.(lang);
      localStorage.setItem('app-language', lang);
      if (typeof this.$i18n?.setLocale === 'function') {this.$i18n.setLocale(lang);}
      else {this.$i18n.locale = lang;}
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
