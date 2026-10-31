<template>
  <!-- Kelgan takliflar -->
  <section class="mb-6">
    <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><span>📨</span> {{ $t('finance.family_received_title') }}
      <span class="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{{ pending.length }}</span>
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="link in pending" :key="'p'+link.id" class="bg-white rounded-2xl p-5 shadow-sm border border-amber-100">
        <div class="flex items-start gap-3">
          <div class="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg flex-shrink-0">{{ initials(link.owner_name) }}</div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-gray-900 truncate">{{ link.owner_name || '—' }}</p>
            <p class="text-sm text-gray-500">{{ pendingRoleText(link) }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ permsSummary(link) }}</p>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <!-- B33-2: Qabul qilish — avval qaysi ma'lumotlarni ko'rsatishни tanlash modali ochiladi -->
          <button :disabled="busyId===link.id" class="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg font-semibold text-sm transition" @click="openAccept(link)">{{ $t('finance.family_accept') }}</button>
          <button :disabled="busyId===link.id" class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 rounded-lg font-semibold text-sm transition" @click="respond(link, 'reject')">{{ $t('finance.family_reject') }}</button>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
// wave D: pages/finance/family/index.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
export default {
  name: 'FamilyPendingInvites',
  props: {
    pending: { type: null, default: undefined },
    initials: { type: Function, default: undefined },
    pendingRoleText: { type: Function, default: undefined },
    permsSummary: { type: Function, default: undefined },
    busyId: { type: null, default: undefined },
    openAccept: { type: Function, default: undefined },
    respond: { type: Function, default: undefined },
  },
};
</script>
