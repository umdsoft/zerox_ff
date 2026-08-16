<template>
  <div class="family-page pb-10">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-5">
      <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-indigo-600 hover:shadow transition" aria-label="Orqaga">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div class="flex-1">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.family_title') }}</h1>
        <p class="text-gray-500 text-sm mt-0.5">{{ $t('finance.family_subtitle') }}</p>
      </div>
      <button @click="openInvite" class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        {{ $t('finance.family_add_member') }}
      </button>
    </div>

    <!-- Hero -->
    <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-7 text-white mb-6 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-56 h-56 bg-white opacity-10 rounded-full -translate-y-1/3 translate-x-1/4"></div>
      <div class="relative z-10 flex items-start gap-4">
        <span class="text-5xl">👨‍👩‍👧‍👦</span>
        <div>
          <h2 class="text-xl md:text-2xl font-bold">{{ $t('finance.family_hero') }}</h2>
          <p class="text-indigo-100 mt-1 max-w-2xl">{{ $t('finance.family_hero_desc') }}</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>

    <template v-else>
      <!-- Kelgan takliflar -->
      <section v-if="pending.length" class="mb-6">
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
              <button @click="respond(link, 'accept')" :disabled="busyId===link.id" class="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg font-semibold text-sm transition">{{ $t('finance.family_accept') }}</button>
              <button @click="respond(link, 'reject')" :disabled="busyId===link.id" class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 rounded-lg font-semibold text-sm transition">{{ $t('finance.family_reject') }}</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Kuzatuvimdagilar (men ko'raman) -->
      <section v-if="asViewer.length" class="mb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><span>👀</span> {{ $t('finance.family_active_title') }}</h3>
        <p class="text-sm text-gray-500 mb-3">{{ $t('finance.family_active_hint') }}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="link in asViewer" :key="'v'+link.id" class="bg-white rounded-2xl p-5 shadow-sm">
            <div class="flex items-start gap-3">
              <div class="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg flex-shrink-0">{{ initials(link.other_name) }}</div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 truncate">{{ link.other_name || '—' }}</p>
                <p v-if="link.relation_label" class="text-sm text-gray-500">{{ link.relation_label }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ permsSummary(link) }}</p>
              </div>
              <!-- T3a: Limit — o'ng tepada kichik badge (Ko'rishда batafsil) -->
              <span v-if="link.monthly_limit" class="flex-shrink-0 inline-flex items-center gap-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 rounded-full px-2 py-0.5 whitespace-nowrap" :title="$t('finance.family_you_set_limit') + ': ' + formatMoney(link.monthly_limit) + ' ' + link.limit_currency">💸 {{ compactMoney(link.monthly_limit) }} {{ link.limit_currency }}</span>
            </div>
            <div class="flex gap-2 mt-4">
              <button @click="openOverview(link)" class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition">{{ $t('finance.family_view') }}</button>
              <!-- Limit — kuzatuvchi limit qo'yadi (umumiy yoki kategoriya) -->
              <button @click="openEditLimit(link)" class="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-sm font-medium transition" :aria-label="$t('finance.family_overall_limit')" :title="$t('finance.family_overall_limit')">💸</button>
              <button v-if="link.owner_id === myId" @click="openEdit(link)" class="px-3 py-2 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-500 rounded-lg text-sm transition" :aria-label="$t('finance.family_edit')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button @click="askRemove(link)" class="px-3 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-lg text-sm transition" :aria-label="$t('finance.family_remove')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Meni kuzatayotganlar (menda limit bo'lishi mumkin) -->
      <section v-if="asTarget.length" class="mb-6">
        <h3 class="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><span>🛡️</span> {{ $t('finance.family_my_watchers') }}</h3>
        <p class="text-sm text-gray-500 mb-3">{{ $t('finance.family_my_watchers_hint') }}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="link in asTarget" :key="'t'+link.id" class="bg-white rounded-2xl p-5 shadow-sm">
            <div class="flex items-start gap-3">
              <div class="w-11 h-11 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg flex-shrink-0">{{ initials(link.other_name) }}</div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 truncate">{{ link.other_name || '—' }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ $t('finance.family_sees_your') }}: {{ permsSummary(link) }}</p>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0">
                <!-- Target o'z ruxsatlarini boshqaradi (kim nimani ko'rishi) -->
                <button @click="openEditPerms(link)" class="px-2 py-2 text-gray-400 hover:text-indigo-600 rounded-lg text-sm transition" :aria-label="$t('finance.family_manage_perms')" :title="$t('finance.family_manage_perms')">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                </button>
                <button @click="askRemove(link)" class="px-2 py-2 text-gray-400 hover:text-red-600 rounded-lg text-sm transition" :aria-label="$t('finance.family_remove')">
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
      </section>

      <!-- Bo'sh holat -->
      <section v-if="!pending.length && !asViewer.length && !asTarget.length" class="mb-6">
        <div class="bg-white rounded-2xl p-8 shadow-sm text-center">
          <span class="text-4xl">🫂</span>
          <p class="font-semibold text-gray-700 mt-2">{{ $t('finance.family_empty_owned') }}</p>
          <p class="text-sm text-gray-400 mt-1">{{ $t('finance.family_empty_hint') }}</p>
          <button @click="openInvite" class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition">{{ $t('finance.family_add_member') }}</button>
        </div>
      </section>

      <button @click="openInvite" class="sm:hidden fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
      </button>
    </template>

    <!-- ===== Taklif / Tahrirlash modali ===== -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showForm = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-modal shadow-xl flex flex-col" style="max-height: 90vh;">
        <!-- Header (qat'iy) -->
        <div class="px-5 pt-4 pb-2.5 border-b border-gray-100 flex-shrink-0">
          <h3 class="text-base font-bold text-gray-900">{{ editing ? $t('finance.family_edit_title') : $t('finance.family_invite_title') }}</h3>
        </div>
        <!-- Skroll qismi -->
        <div class="px-5 py-3 overflow-y-auto flex-1 min-h-0">

        <template v-if="!editingPermsOnly && !editingLimitOnly">
        <!-- Rol -->
        <div class="mb-3">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">{{ $t('finance.family_role') }}</label>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" @click="form.role = 'watched'" :class="['text-left p-2.5 rounded-xl border-2 transition', form.role === 'watched' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200']">
              <p class="text-sm font-semibold text-gray-800">👀 {{ $t('finance.family_role_watched') }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ $t('finance.family_role_watched_desc') }}</p>
            </button>
            <button type="button" @click="form.role = 'watcher'" :class="['text-left p-2.5 rounded-xl border-2 transition', form.role === 'watcher' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200']">
              <p class="text-sm font-semibold text-gray-800">🛡️ {{ $t('finance.family_role_watcher') }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ $t('finance.family_role_watcher_desc') }}</p>
            </button>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3 mb-3">
          <div v-if="!editing">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_phone') }}</label>
            <input v-model="form.phone" type="tel" :placeholder="$t('finance.family_phone_ph')" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_relation') }}</label>
            <input v-model="form.relation_label" type="text" :placeholder="$t('finance.family_relation_ph')" maxlength="50" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
        </template>

        <!-- Ruxsatlar (bo'lim bo'yicha) — limit-rejimda yashiriladi -->
        <div v-if="!editingLimitOnly" class="mb-3">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_perms') }}</label>
          <p class="text-xs text-gray-400 mb-1.5">{{ editingPermsOnly ? $t('finance.family_perm_hint_target') : (form.role === 'watched' ? $t('finance.family_perm_hint_watched') : $t('finance.family_perm_hint_watcher')) }}</p>
          <div class="grid sm:grid-cols-2 gap-2">
            <div v-for="s in sectionDefs" :key="s.key" class="p-2.5 bg-gray-50 rounded-xl">
              <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" v-model="form.permissions[s.key].view" class="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500" />
                <span class="text-sm text-gray-700">{{ s.icon }} {{ $t('finance.' + s.label) }}</span>
              </label>
              <div v-if="form.permissions[s.key].view" class="mt-1.5 ml-8 flex gap-2">
                <button type="button" @click="form.permissions[s.key].detail = 'full'" :class="['text-xs px-3 py-1 rounded-full border', form.permissions[s.key].detail === 'full' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600']">{{ $t('finance.family_detail_full') }}</button>
                <button type="button" @click="form.permissions[s.key].detail = 'summary'" :class="['text-xs px-3 py-1 rounded-full border', form.permissions[s.key].detail === 'summary' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600']">{{ $t('finance.family_detail_summary') }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- LIMIT — faqat "Kuzatuvdagi a'zo" (watched) uchun. Kuzatuvchida limitni
             o'zi (nazorat qiluvchi) o'z profili orqali kiritadi. -->
        <template v-if="(form.role === 'watched' || editingLimitOnly) && !editingPermsOnly">
          <!-- Umumiy oylik limit -->
          <div class="mb-3">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_overall_limit') }}</label>
            <p class="text-xs text-gray-400 mb-1.5">{{ $t('finance.family_limit_hint') }}</p>
            <div class="flex gap-2">
              <input :value="formatThousands(form.monthly_limit)" @input="onLimitInput" type="text" inputmode="numeric" placeholder="0" class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              <select v-model="form.limit_currency" class="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option value="UZS">UZS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <!-- Kategoriya bo'yicha limit -->
          <div class="mb-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_cat_limits') }}</label>
            <div v-for="(cl, i) in form.category_limits" :key="'fcl'+i" class="flex gap-2 mb-2">
              <select v-model.number="cl.category_id" class="flex-1 min-w-0 px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none">
                <option :value="null" disabled>{{ $t('finance.choose_category') }}</option>
                <option v-for="c in expenseCategories" :key="c.id" :value="c.id">{{ c.icon }} {{ catName(c.name) }}</option>
              </select>
              <input :value="formatThousands(cl.amount)" @input="onCatLimitInput($event, i)" type="text" inputmode="numeric" placeholder="0" class="w-28 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" />
              <button type="button" @click="form.category_limits.splice(i,1)" class="px-2 text-gray-400 hover:text-red-600">✕</button>
            </div>
            <button type="button" @click="form.category_limits.push({ category_id: null, amount: '', currency: form.limit_currency })" class="text-sm text-indigo-600 font-medium">+ {{ $t('finance.family_cat_limit_add') }}</button>
          </div>
        </template>

        </div>
        <!-- Footer (sticky) -->
        <div class="px-5 py-3 border-t border-gray-100 flex gap-2 flex-shrink-0">
          <button @click="showForm = false" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition">{{ $t('common.cancel') }}</button>
          <button @click="submitForm" :disabled="saving" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl font-semibold transition">{{ editing ? $t('common.save') : $t('finance.family_invite_btn') }}</button>
        </div>
      </div>
    </div>

    <!-- ===== Overview modali ===== -->
    <div v-if="showOverview" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showOverview = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl p-5 shadow-xl overflow-y-auto" style="max-height: 90vh;">
        <div class="flex items-center justify-between mb-3 sticky top-0 bg-white z-10 -mx-5 px-5 pt-1 pb-2">
          <h3 class="text-lg font-bold text-gray-900">{{ overviewName }} — {{ $t('finance.family_overview_title') }}</h3>
          <button @click="showOverview = false" class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <!-- Oy navigatori (davr bo'yicha ko'rish) -->
        <div class="flex items-center justify-center gap-3 mb-4 bg-gray-50 rounded-xl py-2">
          <button @click="overviewChangeMonth(-1)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-indigo-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg></button>
          <span class="text-sm font-semibold text-gray-800 min-w-[120px] text-center">{{ overviewMonthLabel }}</span>
          <button @click="overviewChangeMonth(1)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-indigo-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
        </div>

        <div v-if="overviewLoading" class="flex justify-center py-10"><div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>

        <div v-else-if="overview" class="grid sm:grid-cols-2 gap-3">
          <!-- Qoldiq (daromad - xarajat), UZS/USD alohida -->
          <div v-if="overviewBalance.length" class="bg-indigo-50 rounded-xl p-4 sm:col-span-2">
            <p class="text-xs text-indigo-700 font-semibold mb-1">💰 {{ $t('finance.family_ov_balance') }}</p>
            <p v-for="b in overviewBalance" :key="'bal'+b.currency" class="text-lg font-bold" :class="b.net >= 0 ? 'text-indigo-800' : 'text-red-700'">{{ b.net >= 0 ? '+' : '' }}{{ formatMoney(b.net) }} {{ b.currency }}</p>
          </div>
          <!-- T3a: Belgilangan limit + shu oyda ishlatilgani -->
          <div v-if="overviewLimitInfo" class="bg-amber-50 rounded-xl p-4 sm:col-span-2">
            <div class="flex items-baseline justify-between mb-1">
              <p class="text-xs text-amber-700 font-semibold">💸 {{ $t('finance.family_overall_limit') }}</p>
              <span class="text-xs font-bold" :class="overviewLimitInfo.over ? 'text-red-600' : 'text-amber-700'">{{ overviewLimitInfo.rawPct }}%</span>
            </div>
            <p class="text-base font-bold text-amber-800">{{ formatMoney(overviewLimitInfo.spent) }} / {{ formatMoney(overviewLimitInfo.limit) }} {{ overviewLimitInfo.currency }}</p>
            <div class="w-full bg-amber-100 rounded-full h-1.5 mt-2"><div class="h-1.5 rounded-full" :class="overviewLimitInfo.over ? 'bg-red-500' : 'bg-amber-500'" :style="{ width: overviewLimitInfo.pct + '%' }"></div></div>
            <p v-if="overviewLimitInfo.over" class="text-xs text-red-600 mt-1 font-medium">⚠️ {{ $t('finance.family_limit_exceeded') }}</p>
            <p v-else class="text-xs text-amber-700 mt-1">{{ $t('finance.family_limit_remaining') }}: <b>{{ formatMoney(overviewLimitInfo.remaining) }} {{ overviewLimitInfo.currency }}</b></p>
            <div v-if="overviewLimitInfo.cats && overviewLimitInfo.cats.length" class="mt-2 space-y-2 border-t border-amber-100 pt-2">
              <div v-for="(cl, i) in overviewLimitInfo.cats" :key="'ovcl'+i">
                <div class="flex justify-between text-xs text-amber-700">
                  <span>{{ catLabelById(cl.category_id) }}</span>
                  <span :class="cl.over ? 'text-red-600 font-semibold' : ''"><b>{{ formatMoney(cl.spent) }}</b> / {{ formatMoney(cl.amount) }} {{ cl.currency }} ({{ cl.pct }}%)</span>
                </div>
                <div class="w-full bg-amber-100 rounded-full h-1 mt-1"><div class="h-1 rounded-full" :class="cl.over ? 'bg-red-500' : 'bg-amber-500'" :style="{ width: Math.min(100, cl.pct) + '%' }"></div></div>
              </div>
            </div>
          </div>
          <!-- Daromad -->
          <div v-if="overview.income" class="bg-green-50 rounded-xl p-4">
            <p class="text-xs text-green-700 font-semibold mb-1">➕ {{ $t('finance.family_sec_income') }}</p>
            <p v-for="c in overview.income.by_currency" :key="'ic'+c.currency" class="text-base font-bold text-green-800">{{ formatMoney(c.total) }} {{ c.currency }}</p>
            <p v-if="!overview.income.by_currency.length" class="text-base font-bold text-green-800">0 UZS</p>
            <div v-if="overview.income.by_category && overview.income.by_category.length" class="mt-2 space-y-1">
              <div v-for="(c, i) in overview.income.by_category.slice(0,6)" :key="'icc'+i" class="flex justify-between text-xs text-green-800/80"><span>{{ c.icon || '💰' }} {{ catName(c.name) }}</span><span>{{ formatMoney(c.total) }} {{ c.currency }}</span></div>
            </div>
          </div>
          <!-- Xarajat -->
          <div v-if="overview.expense" class="bg-red-50 rounded-xl p-4">
            <p class="text-xs text-red-700 font-semibold mb-1">➖ {{ $t('finance.family_sec_expense') }}</p>
            <p v-for="c in overview.expense.by_currency" :key="'ec'+c.currency" class="text-base font-bold text-red-800">{{ formatMoney(c.total) }} {{ c.currency }}</p>
            <p v-if="!overview.expense.by_currency.length" class="text-base font-bold text-red-800">0 UZS</p>
            <div v-if="overview.expense.by_category && overview.expense.by_category.length" class="mt-2 space-y-1">
              <div v-for="(c, i) in overview.expense.by_category.slice(0,6)" :key="'ecc'+i" class="flex justify-between text-xs text-red-800/80"><span>{{ c.icon || '📦' }} {{ catName(c.name) }}</span><span>{{ formatMoney(c.total) }} {{ c.currency }}</span></div>
            </div>
          </div>
          <!-- Kutilayotgan daromad -->
          <div v-if="overview.scheduled_income" class="bg-white border border-gray-100 rounded-xl p-4">
            <p class="text-sm font-semibold text-gray-700 mb-2">⏳ {{ $t('finance.family_sec_sched_income') }}</p>
            <div v-for="(r, i) in overview.scheduled_income" :key="'si'+i" class="flex justify-between text-xs text-gray-600 mb-1"><span>{{ r.title || '—' }} <span class="text-gray-400">{{ r.next_date }}</span></span><span class="font-semibold">{{ formatMoney(r.amount) }} {{ r.currency }}</span></div>
            <p v-if="!overview.scheduled_income.length" class="text-xs text-gray-400">{{ $t('finance.family_no_data') }}</p>
          </div>
          <!-- Rejalashtirilgan to'lov -->
          <div v-if="overview.scheduled_payment" class="bg-white border border-gray-100 rounded-xl p-4">
            <p class="text-sm font-semibold text-gray-700 mb-2">🗓 {{ $t('finance.family_sec_sched_payment') }}</p>
            <div v-for="(r, i) in overview.scheduled_payment" :key="'sp'+i" class="flex justify-between text-xs text-gray-600 mb-1"><span>{{ r.title || '—' }} <span class="text-gray-400">{{ r.next_date }}</span></span><span class="font-semibold">{{ formatMoney(r.amount) }} {{ r.currency }}</span></div>
            <p v-if="!overview.scheduled_payment.length" class="text-xs text-gray-400">{{ $t('finance.family_no_data') }}</p>
          </div>
          <!-- Maqsadlar -->
          <div v-if="overview.goals" class="bg-white border border-gray-100 rounded-xl p-4">
            <p class="text-sm font-semibold text-gray-700 mb-2">🎯 {{ $t('finance.family_sec_goals') }}</p>
            <template v-if="overview.goals.items">
              <div v-for="(g, i) in overview.goals.items" :key="'g'+i" class="mb-2">
                <div class="flex justify-between text-xs text-gray-600"><span>{{ g.name }}</span><span>{{ formatMoney(g.current) }} / {{ formatMoney(g.target) }} {{ g.currency }}</span></div>
                <div class="w-full bg-gray-100 rounded-full h-1.5 mt-1"><div class="bg-indigo-500 h-1.5 rounded-full" :style="{ width: pct(g.current, g.target) + '%' }"></div></div>
              </div>
            </template>
            <template v-else>
              <p class="text-xs text-gray-500">{{ overview.goals.count }} — {{ formatMoney(overview.goals.current_total) }} / {{ formatMoney(overview.goals.target_total) }} UZS</p>
            </template>
          </div>

          <div v-if="!hasAnyOverview" class="bg-gray-50 rounded-xl p-4 text-sm text-gray-400 text-center">{{ $t('finance.family_ov_no_perm') }}</div>
        </div>
      </div>
    </div>

    <!-- ===== O'chirish tasdig'i ===== -->
    <div v-if="showRemove" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showRemove = false"></div>
      <div class="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
        <div class="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" /></svg>
        </div>
        <p class="text-gray-700 mb-5">{{ $t('finance.family_confirm_remove') }}</p>
        <div class="flex gap-2">
          <button @click="showRemove = false" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition">{{ $t('common.cancel') }}</button>
          <button @click="confirmRemove" :disabled="saving" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl font-semibold transition">{{ $t('finance.family_remove') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanceFamily',
  middleware: 'auth',
  data() {
    return {
      loading: true,
      asViewer: [],
      asTarget: [],
      pending: [],
      expenseCategories: [],
      busyId: null,
      showForm: false,
      editing: null,
      editingPermsOnly: false,
      editingLimitOnly: false,
      saving: false,
      form: this.blankForm(),
      showOverview: false,
      overviewLoading: false,
      overview: null,
      overviewName: '',
      overviewLink: null,
      overviewYear: new Date().getFullYear(),
      overviewMonth: new Date().getMonth() + 1,
      showRemove: false,
      removeTarget: null,
      sectionDefs: [
        { key: 'income', label: 'family_sec_income', icon: '➕' },
        { key: 'expense', label: 'family_sec_expense', icon: '➖' },
        { key: 'scheduled_income', label: 'family_sec_sched_income', icon: '⏳' },
        { key: 'scheduled_payment', label: 'family_sec_sched_payment', icon: '🗓' },
        { key: 'goals', label: 'family_sec_goals', icon: '🎯' }
      ]
    }
  },
  computed: {
    myId() { return (this.$auth && this.$auth.user && this.$auth.user.id) || null },
    overviewMonthLabel() {
      const names = [this.$t('months.january'), this.$t('months.february'), this.$t('months.march'), this.$t('months.april'), this.$t('months.may'), this.$t('months.june'), this.$t('months.july'), this.$t('months.august'), this.$t('months.september'), this.$t('months.october'), this.$t('months.november'), this.$t('months.december')]
      return `${names[this.overviewMonth - 1] || ''} ${this.overviewYear}`
    },
    hasAnyOverview() {
      const o = this.overview
      return !!(o && (o.income || o.expense || o.scheduled_income || o.scheduled_payment || o.goals))
    },
    // Qoldiq = daromad - xarajat, valyuta bo'yicha (UZS/USD alohida)
    overviewBalance() {
      const o = this.overview
      if (!o || (!o.income && !o.expense)) return []
      const map = {}
      ;((o.income && o.income.by_currency) || []).forEach(c => { const k = c.currency || 'UZS'; map[k] = (map[k] || 0) + (Number(c.total) || 0) })
      ;((o.expense && o.expense.by_currency) || []).forEach(c => { const k = c.currency || 'UZS'; map[k] = (map[k] || 0) - (Number(c.total) || 0) })
      return Object.keys(map).sort((a, b) => (a === 'UZS' ? -1 : b === 'UZS' ? 1 : 0)).map(k => ({ currency: k, net: map[k] }))
    },
    // T3a: Ko'rish (overview) ichida — belgilangan limit + shu oyda ishlatilgani
    overviewLimitInfo() {
      const link = this.overviewLink
      if (!link || !link.monthly_limit) return null
      const cur = link.limit_currency || 'UZS'
      const limit = Number(link.monthly_limit) || 0
      const o = this.overview
      let spent = 0
      if (o && o.expense && Array.isArray(o.expense.by_currency)) {
        const row = o.expense.by_currency.find(c => (c.currency || 'UZS') === cur)
        spent = row ? (Number(row.total) || 0) : 0
      }
      const pct = limit > 0 ? Math.round(spent / limit * 100) : 0
      // U3: har kategoriya limiti bo'yicha sarflangan (by_category.category_id bilan mos)
      const byCat = (o && o.expense && Array.isArray(o.expense.by_category)) ? o.expense.by_category : []
      const cats = (link.category_limits || []).map(cl => {
        const row = byCat.find(c => Number(c.category_id) === Number(cl.category_id))
        const catSpent = row ? (Number(row.total) || 0) : 0
        const clim = Number(cl.amount) || 0
        return { ...cl, spent: catSpent, over: catSpent > clim, pct: clim > 0 ? Math.round(catSpent / clim * 100) : 0 }
      })
      return { limit, currency: cur, spent, remaining: limit - spent, pct: Math.min(100, pct), rawPct: pct, over: spent > limit, cats }
    }
  },
  async mounted() {
    await Promise.all([this.load(), this.loadCategories()])
  },
  methods: {
    blankPermissions() {
      // Default: daromad/xarajat KO'RINADI va "To'liq (kategoriya bilan)" — a'zo
      // kategoriyalar tarkibini ko'rsin (foydalanuvchi so'rovi). Boshqalari yopiq.
      const p = {}
      ;['income', 'expense', 'scheduled_income', 'scheduled_payment', 'goals'].forEach(k => {
        const on = k === 'income' || k === 'expense'
        p[k] = { view: on, detail: on ? 'full' : 'summary' }
      })
      return p
    },
    blankForm() {
      return { phone: '', relation_label: '', role: 'watched', permissions: this.blankPermissions(), category_limits: [], monthly_limit: '', limit_currency: 'UZS' }
    },
    goBack() { this.$router.push(this.localePath({ name: 'finance' })) },
    // Ixcham summa (badge uchun): 1 500 000 -> "1.5 mln", 900 000 -> "900 ming"
    compactMoney(v) {
      const n = Number(v) || 0
      if (n >= 1e9) return (n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1) + ' mlrd'
      if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + ' mln'
      if (n >= 1e3) return Math.round(n / 1e3) + ' ming'
      return String(n)
    },
    async load() {
      try {
        this.loading = true
        const res = await this.$api.getFamily()
        if (res && res.data && res.data.success) {
          const d = res.data.data
          this.asViewer = d.as_viewer || []
          this.asTarget = d.as_target || []
          this.pending = d.pending || []
        }
      } catch (e) { console.error('Family load:', e) } finally { this.loading = false }
    },
    async loadCategories() {
      try {
        const res = await this.$api.getExpenseCategories()
        if (res && res.data && res.data.success) this.expenseCategories = res.data.data
      } catch (e) { /* ignore */ }
    },
    initials(name) {
      if (!name) return '?'
      const p = String(name).trim().split(/\s+/)
      return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase()
    },
    formatMoney(v) { return Number(v || 0).toLocaleString('uz-UZ') },
    pct(cur, target) { if (!target) return 0; return Math.min(100, Math.round((cur / target) * 100)) },
    catName(name) {
      if (!name) return this.$t('finance.other')
      const k = 'finance.' + name
      const t = this.$t(k)
      return t === k ? name : t
    },
    catLabelById(id) {
      const c = this.expenseCategories.find(x => x.id === id)
      return c ? (c.icon + ' ' + this.catName(c.name)) : ('#' + id)
    },
    formatThousands(v) {
      if (v === '' || v == null) return ''
      const n = Number(v); if (!isFinite(n)) return ''
      return n.toLocaleString('uz-UZ')
    },
    onLimitInput(e) {
      const d = String(e.target.value).replace(/\D/g, '')
      this.form.monthly_limit = d === '' ? '' : Number(d)
    },
    onCatLimitInput(e, i) {
      const d = String(e.target.value).replace(/\D/g, '')
      this.$set(this.form.category_limits[i], 'amount', d === '' ? '' : Number(d))
    },
    permsSummary(link) {
      const p = link.permissions || {}
      const out = []
      if (p.income && p.income.view) out.push('➕')
      if (p.expense && p.expense.view) out.push('➖')
      if (p.scheduled_income && p.scheduled_income.view) out.push('⏳')
      if (p.scheduled_payment && p.scheduled_payment.view) out.push('🗓')
      if (p.goals && p.goals.view) out.push('🎯')
      return out.length ? out.join(' ') : '—'
    },
    pendingRoleText(link) {
      // pending: men member'man. owner meni 'watched' qilса — owner meni kuzatadi;
      // 'watcher' qilса — men owner'ni kuzataman.
      return link.role === 'watched' ? this.$t('finance.family_pending_watched') : this.$t('finance.family_pending_watcher')
    },
    openInvite() { this.editing = null; this.editingPermsOnly = false; this.editingLimitOnly = false; this.form = this.blankForm(); this.showForm = true },
    // Target o'z ruxsatlarini boshqaradi (faqat kim nimani ko'rishi)
    openEditPerms(link) {
      this.openEdit(link)
      this.editingPermsOnly = true
    },
    // Kuzatuvchi limit qo'yadi (faqat limit — umumiy/kategoriya)
    openEditLimit(link) {
      this.openEdit(link)
      this.editingLimitOnly = true
    },
    openEdit(link) {
      this.editing = link
      this.editingPermsOnly = false
      this.editingLimitOnly = false
      const perms = this.blankPermissions()
      const lp = link.permissions || {}
      Object.keys(perms).forEach(k => { if (lp[k]) perms[k] = { view: !!lp[k].view, detail: lp[k].detail === 'full' ? 'full' : 'summary' } })
      this.form = {
        phone: link.member_phone || '',
        relation_label: link.relation_label || '',
        role: link.role || 'watched',
        permissions: perms,
        category_limits: (link.category_limits || []).map(c => ({ category_id: c.category_id, amount: c.amount, currency: c.currency || 'UZS' })),
        monthly_limit: link.monthly_limit != null ? Number(link.monthly_limit) : '',
        limit_currency: link.limit_currency || 'UZS'
      }
      this.showForm = true
    },
    async submitForm() {
      if (!this.editing && !String(this.form.phone).trim()) {
        this.$toast.error(this.$t('finance.family_invite_err_phone')); return
      }
      this.saving = true
      try {
        // Rejimga qarab payload: permsOnly (target ruxsat), limitOnly (kuzatuvchi limit), yoki to'liq
        let payload
        if (this.editingPermsOnly) {
          payload = { permissions: this.form.permissions }
        } else if (this.editingLimitOnly) {
          payload = {
            category_limits: (this.form.category_limits || []).filter(c => c.category_id && Number(c.amount) > 0),
            monthly_limit: this.form.monthly_limit === '' ? null : Number(this.form.monthly_limit),
            limit_currency: this.form.limit_currency
          }
        } else {
          payload = {
            relation_label: this.form.relation_label,
            role: this.form.role,
            permissions: this.form.permissions,
            category_limits: (this.form.category_limits || []).filter(c => c.category_id && Number(c.amount) > 0),
            monthly_limit: this.form.monthly_limit === '' ? null : Number(this.form.monthly_limit),
            limit_currency: this.form.limit_currency
          }
        }
        if (this.editing) {
          const res = await this.$api.updateFamilyMember(this.editing.id, payload)
          if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.family_updated')); this.showForm = false; await this.load() }
        } else {
          payload.phone = String(this.form.phone).trim()
          const res = await this.$api.inviteFamilyMember(payload)
          if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.family_invite_sent')); this.showForm = false; await this.load() }
        }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.saving = false }
    },
    async respond(link, action) {
      this.busyId = link.id
      try {
        const res = await this.$api.respondFamilyInvite(link.id, action)
        if (res && res.data && res.data.success) { this.$toast.success(action === 'accept' ? this.$t('finance.family_accepted') : this.$t('finance.family_rejected_done')); await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busyId = null }
    },
    async openOverview(link) {
      this.overviewName = link.other_name || '—'
      this.overviewLink = link
      const now = new Date()
      this.overviewYear = now.getFullYear()
      this.overviewMonth = now.getMonth() + 1
      this.overview = null; this.showOverview = true
      await this.fetchOverview()
    },
    async fetchOverview() {
      if (!this.overviewLink) return
      this.overviewLoading = true
      try {
        const res = await this.$api.getFamilyOverview(this.overviewLink.id, { year: this.overviewYear, month: this.overviewMonth })
        if (res && res.data && res.data.success) this.overview = res.data.data
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error')); this.showOverview = false
      } finally { this.overviewLoading = false }
    },
    overviewChangeMonth(delta) {
      let m = this.overviewMonth + delta
      let y = this.overviewYear
      if (m > 12) { m = 1; y++ } else if (m < 1) { m = 12; y-- }
      this.overviewMonth = m; this.overviewYear = y
      this.fetchOverview()
    },
    askRemove(link) { this.removeTarget = link; this.showRemove = true },
    async confirmRemove() {
      if (!this.removeTarget) return
      this.saving = true
      try {
        const res = await this.$api.removeFamilyMember(this.removeTarget.id)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.family_removed')); this.showRemove = false; this.removeTarget = null; await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.saving = false }
    }
  }
}
</script>
