<template>
  <section
    :id="id"
    :class="[
      'doc-section scroll-mt-28 bg-white rounded-xl border border-gray-200 shadow-sm p-6',
      extraClass
    ]"
    v-bind="$attrs"
  >
    <h2 class="text-lg font-bold mb-4 flex items-start gap-2">
      <span class="block h-5 w-1.5 bg-blue-600 rounded-sm mt-1"></span>
      <span>{{ title }}</span>
    </h2>
    <div class="space-y-3">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  name: 'DocSection',
  props: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    extraClass: { type: String, default: '' }
  }
}
</script>

<style scoped>
/* Istasangiz shu komponentga xos stillarni qo‘shishingiz mumkin */
</style>
