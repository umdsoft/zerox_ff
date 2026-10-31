<template>
  <!-- Meni kuzatayotganlar (menda limit bo'lishi mumkin) -->
  <section class="mb-6">
    <div class="fam-sec-head">
      <span class="fam-sec-icon fam-sec-icon--watcher">🛡️</span>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5">
          <h3 class="text-lg font-bold text-gray-900 truncate">{{ ft.watcherTitle }}</h3>
          <button type="button" class="fam-info-btn" :aria-label="ft.about" :title="ft.about" @click="openInfo('watcher')">i</button>
        </div>
        <p class="text-sm text-gray-500">{{ ft.watcherCaption }}</p>
      </div>
      <span class="fam-count fam-count--watcher">{{ asTarget.length }}</span>
    </div>
    <div v-if="!asTarget.length" class="fam-empty">
      <span class="fam-empty__icon fam-sec-icon--watcher">🛡️</span>
      <p class="font-semibold text-gray-800 mt-2">{{ ft.emptyTitle }}</p>
      <p class="text-sm text-gray-500 mt-1 max-w-md mx-auto">{{ ft.watcherEmpty }}</p>
      <button type="button" class="fam-empty__cta fam-empty__cta--watcher" @click="openInviteAs('watcher')">+ {{ ft.watcherCta }}</button>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- R5: meni kuzatayotgan a'zo kartasi — emerald/teal aksent, gradient avatar, hover-ko'tarilish -->
      <div v-for="link in asTarget" :key="'t'+link.id" class="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <div class="p-5 pt-6">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm ring-2 ring-white">{{ initials(link.other_name) }}</div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-gray-900 truncate">{{ link.other_name || '—' }}</p>
              <div class="flex items-center gap-1.5 flex-wrap mt-1">
                <span v-if="link.relation_label" class="inline-flex items-center text-xs font-semibold bg-emerald-50 text-emerald-600 rounded-full px-2 py-0.5">{{ link.relation_label }}</span>
                <span class="inline-flex items-center text-xs text-gray-400"><span class="text-gray-500 font-medium mr-1">{{ $t('finance.family_sees_your') }}:</span>{{ permsSummary(link) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <!-- Target o'z ruxsatlarini boshqaradi (kim nimani ko'rishi) -->
              <button class="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" :aria-label="$t('finance.family_manage_perms')" :title="$t('finance.family_manage_perms')" @click="openEditPerms(link)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
              </button>
              <button class="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" :aria-label="$t('finance.family_remove')" @click="askRemove(link)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
          <!-- Sizga (target) belgilangan limit -->
          <!-- V5: limit oshdi ogohlantirishi (target o'zi ham ko'radi) -->
          <div v-if="link.over_limit" class="mt-3 text-xs bg-red-50 text-red-700 rounded-lg px-3 py-2 font-semibold flex items-center gap-1.5">
            <span>⚠️</span> {{ $t('finance.family_limit_exceeded') }}
          </div>
          <!-- W1: umumiy va kategoriya limitlar bir xil ustun (justify-between) — qiymatlar tekislanadi -->
          <div class="mt-2 space-y-1">
            <div v-if="link.monthly_limit" class="text-xs rounded-lg px-3 py-1.5 flex justify-between items-center gap-2" :class="(link.limit_spent || 0) > link.monthly_limit ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'">
              <span class="min-w-0 truncate">💸 {{ $t('finance.family_limit_set') }}</span>
              <b class="flex-shrink-0 whitespace-nowrap">{{ formatMoney(link.limit_spent || 0) }} / {{ formatMoney(link.monthly_limit) }} {{ link.limit_currency }}</b>
            </div>
            <div v-for="(cl, i) in (link.category_limits || [])" :key="'cl'+i" class="text-xs rounded-lg px-3 py-1.5 flex justify-between items-center gap-2" :class="cl.over ? 'bg-red-50 text-red-700 font-semibold' : 'bg-amber-50 text-amber-700'">
              <span class="min-w-0 truncate">{{ catLabelById(cl.category_id) }}</span>
              <b class="flex-shrink-0 whitespace-nowrap">{{ formatMoney(cl.spent || 0) }} / {{ formatMoney(cl.amount) }} {{ cl.currency }}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
// wave D: pages/finance/family/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'FamilyWatcherSection',
  props: {
    ft: { type: null, default: undefined },
    openInfo: { type: Function, default: undefined },
    asTarget: { type: null, default: undefined },
    openInviteAs: { type: Function, default: undefined },
    initials: { type: Function, default: undefined },
    permsSummary: { type: Function, default: undefined },
    openEditPerms: { type: Function, default: undefined },
    askRemove: { type: Function, default: undefined },
    formatMoney: { type: Function, default: undefined },
    catLabelById: { type: Function, default: undefined },
  },
};
</script>

<style scoped src="../../assets/page-styles/family.css"></style>
