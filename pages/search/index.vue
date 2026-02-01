<template>
  <div class="pb-8">
    <!-- Header Card -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div class="px-6 py-5">
        <div class="flex items-center gap-4">
          <button
            @click="$goHomeWithLocale()"
            class="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ pageTitle }}</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-3xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Foydalanuvchini izlash -->
        <nuxt-link
          :to="localePath({ name: searchRoute, query: { type: searchType } })"
          :class="[
            'group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border-2 border-transparent',
            isDebitor ? 'hover:border-blue-500' : 'hover:border-green-500'
          ]"
        >
          <div class="p-8 text-center">
            <div :class="[
              'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors',
              isDebitor ? 'bg-blue-100 group-hover:bg-blue-200' : 'bg-green-100 group-hover:bg-green-200'
            ]">
              <svg :class="['w-12 h-12', isDebitor ? 'text-blue-600' : 'text-green-600']" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 :class="[
              'text-lg font-bold text-gray-900 transition-colors',
              isDebitor ? 'group-hover:text-blue-600' : 'group-hover:text-green-600'
            ]">{{ $t("home.search_user") }}</h3>
          </div>
        </nuxt-link>

        <!-- Saqlangan foydalanuvchilar -->
        <nuxt-link
          :to="localePath({ name: 'treaded-users', query: { searchtype: searchType } })"
          :class="[
            'group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border-2 border-transparent',
            isDebitor ? 'hover:border-blue-500' : 'hover:border-green-500'
          ]"
        >
          <div class="p-8 text-center">
            <div :class="[
              'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors',
              isDebitor ? 'bg-blue-100 group-hover:bg-blue-200' : 'bg-green-100 group-hover:bg-green-200'
            ]">
              <svg :class="['w-12 h-12', isDebitor ? 'text-blue-600' : 'text-green-600']" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
              </svg>
            </div>
            <h3 :class="[
              'text-lg font-bold text-gray-900 transition-colors',
              isDebitor ? 'group-hover:text-blue-600' : 'group-hover:text-green-600'
            ]">{{ $t("oldi") }}</h3>
          </div>
        </nuxt-link>
      </div>

      <!-- Info Tip -->
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
export default {
  middleware: "auth",

  computed: {
    searchType() {
      return this.$route.query.type || 'debitor';
    },

    isDebitor() {
      return this.searchType === 'debitor';
    },

    pageTitle() {
      return this.isDebitor
        ? this.$t('search.debitor_title')
        : this.$t('search.creditor_title');
    },

    pageSubtitle() {
      return this.isDebitor
        ? this.$t('search.debitor_subtitle')
        : this.$t('search.creditor_subtitle');
    },

    searchRoute() {
      return 'search-physical';
    },

    infoTipText() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return 'Найдите заемщика, чтобы отправить ему запрос на предоставление займа.';
      if (lang === 'kr') return 'Қарздорни қидириш орқали унга қарз бериш учун сўров юборишингиз мумкин.';
      return "Qarzdorni qidirish orqali unga qarz berish uchun so'rov yuborishingiz mumkin.";
    },
  },

  mounted() {
    if (this.$auth.user.is_active !== 1) {
      return this.$router.push(this.localePath({ name: 'index' }));
    }
  },
};
</script>
