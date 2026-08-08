<template>
  <div class="family-page pb-8">
    <!-- Header -->
    <div class="mb-6">
      <nuxt-link :to="localePath({ name: 'finance' })" class="text-indigo-600 hover:text-indigo-700 text-sm mb-2 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.family_title') }}</h1>
      <p class="text-gray-500 mt-1">{{ $t('finance.family_subtitle') }}</p>
    </div>

    <!-- Hero -->
    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-6 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-56 h-56 bg-white opacity-10 rounded-full -translate-y-1/3 translate-x-1/4"></div>
      <div class="relative z-10 flex items-start gap-4">
        <span class="text-5xl">👨‍👩‍👧‍👦</span>
        <div>
          <span class="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-2">{{ $t('finance.family_badge') }}</span>
          <h2 class="text-xl md:text-2xl font-bold">{{ $t('finance.family_hero') }}</h2>
          <p class="text-indigo-100 mt-1 max-w-2xl">{{ $t('finance.family_hero_desc') }}</p>
        </div>
      </div>
    </div>

    <!-- Imkoniyatlar -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div v-for="f in features" :key="f.title" class="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-3">
        <span class="text-2xl flex-shrink-0">{{ f.icon }}</span>
        <div>
          <h3 class="font-bold text-gray-900">{{ f.title }}</h3>
          <p class="text-sm text-gray-500 mt-0.5">{{ f.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Qiziqish bildirish -->
    <div class="bg-white rounded-2xl p-6 shadow-sm text-center">
      <p class="text-gray-600 mb-4">{{ $t('finance.family_interest_q') }}</p>
      <button
        @click="notifyInterest"
        :disabled="interested"
        class="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-green-600 text-white rounded-xl font-semibold transition-colors"
      >
        <span v-if="!interested">🔔 {{ $t('finance.family_interest_btn') }}</span>
        <span v-else>✓ {{ $t('finance.family_interest_done') }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanceFamily',
  middleware: 'auth',
  data() {
    return { interested: false }
  },
  computed: {
    features() {
      return [
        { icon: '🔗', title: this.$t('finance.family_f1_t'), desc: this.$t('finance.family_f1_d') },
        { icon: '👀', title: this.$t('finance.family_f2_t'), desc: this.$t('finance.family_f2_d') },
        { icon: '🎯', title: this.$t('finance.family_f3_t'), desc: this.$t('finance.family_f3_d') },
        { icon: '💸', title: this.$t('finance.family_f4_t'), desc: this.$t('finance.family_f4_d') },
        { icon: '🔔', title: this.$t('finance.family_f5_t'), desc: this.$t('finance.family_f5_d') },
        { icon: '🔒', title: this.$t('finance.family_f6_t'), desc: this.$t('finance.family_f6_d') }
      ]
    }
  },
  methods: {
    notifyInterest() {
      this.interested = true
      try { localStorage.setItem('zx_family_interest', '1') } catch (_) {}
      this.$toast && this.$toast.success && this.$toast.success(this.$t('finance.family_interest_done'))
    }
  },
  mounted() {
    try { if (localStorage.getItem('zx_family_interest') === '1') this.interested = true } catch (_) {}
  }
}
</script>
