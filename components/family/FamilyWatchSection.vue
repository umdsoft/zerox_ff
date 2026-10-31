<template>
  <!-- Kuzatuvimdagilar (men ko'raman) -->
  <!-- 23.10 (3-rasm): bo'lim HAR DOIM ko'rinadi (mobil kabi) — bo'sh bo'lsa izoh + CTA; "i" — tushuntirish -->
  <section class="mb-6">
    <div class="fam-sec-head">
      <span class="fam-sec-icon fam-sec-icon--watch">👀</span>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5">
          <h3 class="text-lg font-bold text-gray-900 truncate">{{ ft.watchTitle }}</h3>
          <button type="button" class="fam-info-btn" :aria-label="ft.about" :title="ft.about" @click="openInfo('watch')">i</button>
        </div>
        <p class="text-sm text-gray-500">{{ ft.watchCaption }}</p>
      </div>
      <span class="fam-count fam-count--watch">{{ asViewer.length }}</span>
    </div>
    <div v-if="!asViewer.length" class="fam-empty">
      <span class="fam-empty__icon fam-sec-icon--watch">👀</span>
      <p class="font-semibold text-gray-800 mt-2">{{ ft.emptyTitle }}</p>
      <p class="text-sm text-gray-500 mt-1 max-w-md mx-auto">{{ ft.watchEmpty }}</p>
      <button type="button" class="fam-empty__cta fam-empty__cta--watch" @click="openInviteAs('watched')">+ {{ ft.watchCta }}</button>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- R5: kuzatuvdagi a'zo kartasi — indigo/violet aksent, gradient avatar, hover-ko'tarilish -->
      <div v-for="link in asViewer" :key="'v'+link.id" class="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
        <div class="p-5 pt-6">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-sm ring-2 ring-white">{{ initials(link.other_name) }}</div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-gray-900 truncate">{{ link.other_name || '—' }}</p>
              <div class="flex items-center gap-1.5 flex-wrap mt-1">
                <span v-if="link.relation_label" class="inline-flex items-center text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-full px-2 py-0.5">{{ link.relation_label }}</span>
                <span class="inline-flex items-center text-xs text-gray-400">{{ permsSummary(link) }}</span>
              </div>
            </div>
            <!-- T3a: Limit — o'ng tepada kichik badge (Ko'rishда batafsil) -->
            <span v-if="link.monthly_limit" class="flex-shrink-0 inline-flex items-center gap-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full px-2 py-0.5 whitespace-nowrap" :title="$t('finance.family_you_set_limit') + ': ' + formatMoney(link.monthly_limit) + ' ' + link.limit_currency">💸 {{ compactMoney(link.monthly_limit) }} {{ link.limit_currency }}</span>
          </div>
          <!-- B33-1: taklif hali qabul qilinmagan bo'lsa (pending) — "Ko'rish" va limit YO'Q, "Kutilmoqda" -->
          <div v-if="link.status !== 'active'" class="mt-4 text-center text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg py-2">⏳ {{ $t('finance.family_pending_wait') }}</div>
          <div class="flex gap-2 mt-4">
            <button v-if="link.status === 'active'" class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition" @click="openOverview(link)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              {{ $t('finance.family_view') }}
            </button>
            <!-- B34-7: Limit tugmasi FAQAT set_limit ruxsati bo'lsa (har ikki rolда) — ruxsat
                 olib tashlansa kuzatuvchi limit qo'ya olmaydi. B34-4: tahrirlash (qalam) OLIB TASHLANDI
                 (ruxsatlar kuzatuvchi nazoratida emas). -->
            <button v-if="link.status === 'active' && link.permissions && link.permissions.set_limit" class="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-sm font-medium transition" :aria-label="$t('finance.family_overall_limit')" :title="$t('finance.family_overall_limit')" @click="openEditLimit(link)">💸</button>
            <button class="px-3 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-lg text-sm transition" :aria-label="$t('finance.family_remove')" @click="askRemove(link)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
// wave D: pages/finance/family/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'FamilyWatchSection',
  props: {
    ft: { type: null, default: undefined },
    openInfo: { type: Function, default: undefined },
    asViewer: { type: null, default: undefined },
    openInviteAs: { type: Function, default: undefined },
    initials: { type: Function, default: undefined },
    permsSummary: { type: Function, default: undefined },
    formatMoney: { type: Function, default: undefined },
    compactMoney: { type: Function, default: undefined },
    openOverview: { type: Function, default: undefined },
    openEditLimit: { type: Function, default: undefined },
    askRemove: { type: Function, default: undefined },
  },
};
</script>

<style scoped src="../../assets/page-styles/family.css"></style>
