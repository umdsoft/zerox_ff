<template>
  <div class="bg-white px-4 py-6 w-full my-4 rounded-xl">
    <BackButton />

    <div class="flex justify-center items-center mt-6">
      <div class="w-full max-w-lg">
        <!-- Title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 14l-4-4m0 0l4-4m-4 4h11.5a4.5 4.5 0 010 9H15" />
            </svg>
          </div>
          <h2 class="font-bold text-xl text-gray-800">
            {{ $t("list.a1") }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">{{ labelSubtitle }}</p>
        </div>

        <!-- Options -->
        <div class="space-y-4">
          <!-- Full Refund -->
          <nuxt-link
            :to="localePath({
              name: 'debt-refund-type',
              params: { type: 'full' },
              query: { contract: $route.query.contract }
            })"
            class="refund-card group"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <span class="font-semibold text-gray-800 text-base">{{ $t("list.a2") }}</span>
                <p class="text-xs text-gray-500 mt-0.5">{{ labelFullDesc }}</p>
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </nuxt-link>

          <!-- Partial Refund -->
          <nuxt-link
            :to="localePath({
              name: 'debt-refund-type',
              params: { type: 'partially' },
              query: { contract: $route.query.contract }
            })"
            class="refund-card group"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <svg class="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
              </div>
              <div class="ml-4 flex-1">
                <span class="font-semibold text-gray-800 text-base">{{ $t("list.a3") }}</span>
                <p class="text-xs text-gray-500 mt-0.5">{{ labelPartialDesc }}</p>
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackButton from '@/components/BackButton.vue';

export default {
  components: { BackButton },
  middleware: "auth",
  data: () => ({
    contract: null,
  }),
  computed: {
    labelSubtitle() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return "Выберите способ возврата долга";
      if (lang === 'kr') return "Қарзни қайтариш усулини танланг";
      return "Qarzni qaytarish usulini tanlang";
    },
    labelFullDesc() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return "Вернуть всю сумму долга";
      if (lang === 'kr') return "Қарзнинг барча суммасини қайтариш";
      return "Qarzning barcha summasini qaytarish";
    },
    labelPartialDesc() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return "Вернуть часть суммы долга";
      if (lang === 'kr') return "Қарз суммасининг бир қисмини қайтариш";
      return "Qarz summasining bir qismini qaytarish";
    },
  },
};
</script>

<style lang="css" scoped>
.refund-card {
  display: block;
  padding: 1rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  background: white;
}

.refund-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}
</style>
