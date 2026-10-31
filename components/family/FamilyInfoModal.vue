<template>
  <!-- ===== 23.10 (3-rasm): bo'lim haqida ("i") ===== -->
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div class="absolute inset-0 bg-black/50" @click="infoKind = null"></div>
    <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl" role="dialog" aria-modal="true">
      <div class="flex items-center gap-3 mb-3">
        <span class="fam-sec-icon" :class="infoKind === 'watch' ? 'fam-sec-icon--watch' : 'fam-sec-icon--watcher'">{{ infoKind === 'watch' ? '👀' : '🛡️' }}</span>
        <h3 class="text-lg font-bold text-gray-900">{{ infoKind === 'watch' ? ft.watchTitle : ft.watcherTitle }}</h3>
      </div>
      <p class="text-sm text-gray-700 leading-relaxed">{{ infoKind === 'watch' ? ft.watchLead : ft.watcherLead }}</p>
      <ul class="mt-3 space-y-2">
        <li v-for="(pt, i) in (infoKind === 'watch' ? ft.watchPoints : ft.watcherPoints)" :key="'ip' + i" class="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
          <span class="fam-info-dot" :class="infoKind === 'watch' ? 'fam-info-dot--watch' : 'fam-info-dot--watcher'">✓</span>
          <span>{{ pt }}</span>
        </li>
      </ul>
      <button type="button" class="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition" @click="infoKind = null">{{ ft.gotIt }}</button>
    </div>
  </div>
</template>

<script>
// wave D: pages/finance/family/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'FamilyInfoModal',
  props: {
    infoKindValue: { type: null, default: undefined },
    ft: { type: null, default: undefined },
  },
  computed: {
    infoKind: {
      get() { return this.infoKindValue; },
      set(v) { this.$emit('update:infoKindValue', v); },
    },
  },
};
</script>

<style scoped src="../../assets/page-styles/family.css"></style>
