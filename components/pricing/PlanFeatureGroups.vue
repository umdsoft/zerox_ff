<template>
  <!-- 11.10 (sayt hujjati, 6-rasm): tarif kartasida Shaxsiy qarz va Shaxsiy moliya funksiyalari.
       Landing (#pricing) va /price sahifasi — bir xil komponent, ma'lumot utils/pricingPlans.planGroups. -->
  <div>
    <div v-for="g in groups" :key="g.key" class="mt-5 border-t border-gray-100 pt-4">
      <p class="mb-3 text-xs font-semibold tracking-wide text-gray-500">{{ g.title }}</p>
      <ul class="space-y-3">
        <li v-for="it in g.items" :key="it.text" class="flex items-start gap-3" :class="it.on ? '' : 'opacity-40'">
          <svg v-if="it.on" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <svg v-else class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm" :class="it.on ? 'text-gray-700' : 'text-gray-400 line-through'">{{ it.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { planGroups } from '~/utils/pricingPlans'

export default {
  name: 'PlanFeatureGroups',
  props: {
    plan: { type: String, required: true }, // free | start | premium
  },
  computed: {
    groups() { return planGroups(this.plan, (this.$i18n && this.$i18n.locale) || 'uz') },
  },
}
</script>
