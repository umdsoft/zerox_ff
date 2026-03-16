<template>
  <div class="bg-white px-4 py-6 w-full my-4 rounded-xl">
    <BackButton />

    <div class="flex justify-center items-center mt-6">
      <div class="w-full max-w-lg">
        <!-- Title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
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
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
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
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
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
      return this.$t('contract_labels.refund_choose_method');
    },
    labelFullDesc() {
      return this.$t('contract_labels.refund_full_desc');
    },
    labelPartialDesc() {
      return this.$t('contract_labels.refund_partial_desc');
    },
  },
};
</script>

<style lang="css" scoped>
.refund-card {
  display: block;
  padding: 1rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.refund-card:hover {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.12);
  transform: translateY(-1px);
}
</style>
