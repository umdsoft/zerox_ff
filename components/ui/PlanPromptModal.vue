<template>
  <!-- 03.10 (sayt hujjati, 4-rasm): TARIF CHEKLOVI — markazdagi oyna (ilgari yuqori burchakdagi kichik toast).
       Free / muddati tugagan tarifda pullik imkoniyat (masalan "Talab qilish") bosilganda ochiladi:
       sabab matni + "Tariflar" (tariflar sahifasi) + "Yopish". Holat: utils/planPromptStore.js. -->
  <div
    v-if="state.open"
    class="fixed inset-0 flex items-center justify-center p-4"
    style="z-index: 140"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
    @keydown.esc="close"
  >
    <div class="absolute inset-0" style="background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)" @click="close"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
      <button
        type="button"
        class="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        :aria-label="$t('plan_gate.close')"
        @click="close"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <div class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style="background:#FEF3C7; color:#B45309">
        <PlanLockIcon size="1.6rem" />
      </div>
      <h3 :id="titleId" class="text-base font-bold text-gray-900">{{ $t('plan_gate.title') }}</h3>
      <p class="text-sm text-gray-600 mt-2 leading-relaxed">{{ state.text }}</p>
      <div class="flex gap-2 mt-5">
        <button type="button" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm" @click="close">{{ $t('plan_gate.close') }}</button>
        <button ref="primary" type="button" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm" @click="goPlans">{{ $t('plan_gate.plans_btn') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * PlanPromptModal — global (layouts/default.vue da bitta nusxa). `$planPrompt(info)` (plugins/axios.js)
 * xost o'rnatilgan bo'lsa shu oynani ochadi, aks holda avvalgi toast.
 */
import PlanLockIcon from '~/components/ui/PlanLockIcon.vue'
import {
  planPromptState, closePlanPrompt, registerPlanPromptHost, unregisterPlanPromptHost,
} from '~/utils/planPromptStore'

export default {
  name: 'PlanPromptModal',
  components: { PlanLockIcon },
  data() {
    return { state: planPromptState, titleId: 'plan-prompt-title' }
  },
  watch: {
    'state.open'(v) {
      if (v) this.$nextTick(() => { const b = this.$refs.primary; if (b && b.focus) b.focus() })
    },
    // Boshqa sahifaga o'tilsa — oyna yopiladi (eski sahifaning taklifi yangisida qolmasin)
    $route() { closePlanPrompt() },
  },
  mounted() { registerPlanPromptHost() },
  beforeDestroy() {
    unregisterPlanPromptHost()
    closePlanPrompt()
  },
  methods: {
    close() { closePlanPrompt() },
    goPlans() {
      closePlanPrompt()
      const to = this.localePath ? this.localePath({ name: 'price' }) : '/price'
      this.$router.push(to).catch(() => { /* o'sha sahifa — jim */ })
    },
  },
}
</script>
