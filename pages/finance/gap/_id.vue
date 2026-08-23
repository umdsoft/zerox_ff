<template>
  <div class="gap-detail pb-10">
    <div v-if="loading" class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div></div>

    <template v-else-if="gap">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-5">
        <button @click="goBack" class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-teal-600 hover:shadow transition" aria-label="Orqaga">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold text-gray-900 truncate">{{ gap.name }}</h1>
          <!-- B30-11: davr (Har 15 kunda ...) + "Keyingisi: <sana>" ko'rsatiladi -->
          <p class="text-gray-500 text-sm">
            <span v-if="gap.amount">{{ formatMoney(gap.amount) }} {{ gap.currency }} · </span>{{ freqLabel(gap.frequency) }}<span v-if="nextDue"> · {{ $t('finance.gap_next') }}: {{ fmtUzDate(nextDue).split(',')[0] }}</span>
          </p>
        </div>
        <span :class="statusClass(gap.status)" class="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">{{ statusLabel(gap.status) }}</span>
      </div>

      <!-- DRAFT: a'zolarni boshqarish -->
      <div v-if="gap.status === 'draft'" class="bg-white rounded-2xl p-5 shadow-sm mb-5">
        <div class="flex items-center justify-between mb-3 gap-2">
          <h3 class="font-bold text-gray-900 min-w-0 truncate">👥 {{ $t('finance.gap_members') }} ({{ gap.members.length }})</h3>
          <div v-if="gap.is_organizer" class="flex items-center gap-1.5 flex-shrink-0">
            <!-- V4: "A'zo qo'shish" o'ng-tepada; forma toggle (bosilganda ochiladi) -->
            <button @click="openAddMember" class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              {{ $t('finance.gap_add_member') }}
            </button>
            <button @click="openSettings" class="inline-flex items-center justify-center w-9 h-9 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition" :title="$t('finance.gap_settings')" :aria-label="$t('finance.gap_settings')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
        </div>


        <!-- Navbat rejimi: Tasodifiy / O'zimiz tanlaymiz (tashkilotchi) -->
        <div v-if="gap.is_organizer && gap.members.length >= 2" class="flex gap-2 mb-3">
          <button @click="orderMode = 'random'" :class="['flex-1 py-2 rounded-lg text-sm font-medium border transition', orderMode === 'random' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600']">🎲 {{ $t('finance.gap_order_random') }}</button>
          <button @click="orderMode = 'manual'" :class="['flex-1 py-2 rounded-lg text-sm font-medium border transition', orderMode === 'manual' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600']">✋ {{ $t('finance.gap_order_manual') }}</button>
        </div>

        <div class="space-y-2 mb-4">
          <div v-for="(m, mi) in gap.members" :key="m.id" class="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
            <!-- Qo'lda navbat: yuqoriga/pastga -->
            <div v-if="orderMode === 'manual' && gap.is_organizer" class="flex flex-col flex-shrink-0">
              <button @click="moveMember(mi, -1)" :disabled="mi === 0" class="text-gray-400 hover:text-teal-600 disabled:opacity-30 leading-none">▲</button>
              <button @click="moveMember(mi, 1)" :disabled="mi === gap.members.length - 1" class="text-gray-400 hover:text-teal-600 disabled:opacity-30 leading-none">▼</button>
            </div>
            <div class="w-9 h-9 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold flex-shrink-0">{{ orderMode === 'manual' ? (mi + 1) : initials(m.name) }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-800 truncate">{{ m.name }}<span v-if="m.user_id === gap.organizer_id" class="text-teal-600"> · 👑</span></p>
              <p class="text-xs text-gray-400">{{ m.phone }}</p>
            </div>
            <!-- Per-a'zo summa (kim qanchadan kirishadi) -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <input v-if="gap.is_organizer" :value="formatThousands(m.amount)" @change="setMemberAmount(m, $event)" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-right outline-none focus:ring-2 focus:ring-teal-500" />
              <span v-else class="text-xs font-semibold text-gray-700">{{ m.amount ? formatMoney(m.amount) : '—' }}</span>
              <span class="text-xs text-gray-400">{{ gap.currency }}</span>
              <button v-if="gap.is_organizer && m.user_id !== gap.organizer_id" @click="removeMember(m)" class="px-1.5 text-gray-400 hover:text-red-600" aria-label="remove">✕</button>
            </div>
          </div>
        </div>

        <div v-if="gap.is_organizer">
          <button @click="doShuffle" :disabled="busy || gap.members.length < 2" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold transition">{{ orderMode === 'manual' ? '✋ ' + $t('finance.gap_start_manual') : '🎲 ' + $t('finance.gap_shuffle') }}</button>
          <p class="text-xs text-gray-400 mt-2 text-center">{{ orderMode === 'manual' ? $t('finance.gap_order_manual_hint') : $t('finance.gap_shuffle_hint') }}</p>
        </div>
        <p v-else class="text-sm text-gray-400 text-center">{{ $t('finance.gap_wait_organizer') }}</p>
      </div>

      <!-- W8: A'zo qo'shish — markaziy modal (ekran o'rtasida ochiladi) -->
      <div v-if="showAddMember" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-black/50" @click="showAddMember = false"></div>
        <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">➕ {{ $t('finance.gap_add_member') }}</h3>
            <button @click="showAddMember = false" class="text-gray-400 hover:text-gray-600" aria-label="close"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_member_fish_ph') }}</label>
              <input v-model="newName" type="text" :placeholder="$t('finance.gap_member_fish_ph')" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" @keyup.enter="addMember" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_phone') }}</label>
              <input :value="newPhone" @input="onPhoneInput" type="tel" inputmode="tel" placeholder="+99897 734 50 30" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" @keyup.enter="addMember" />
            </div>
            <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" v-model="newUniform" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              {{ $t('finance.gap_member_uniform') }}
            </label>
            <div v-if="!newUniform">
              <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_amount_ph') }}</label>
              <input :value="formatThousands(newAmount)" @input="onNewAmountInput" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <div class="flex gap-2 mt-5">
            <button @click="showAddMember = false" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
            <button @click="addMember" :disabled="busy" class="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ $t('finance.gap_add_member') }}</button>
          </div>
        </div>
      </div>

      <!-- Nastroyka (sozlamalar) modali -->
      <div v-if="showSettings" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div class="absolute inset-0 bg-black/50" @click="showSettings = false"></div>
        <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl max-h-[92vh] overflow-y-auto">
          <h3 class="text-lg font-bold text-gray-900 mb-4">⚙️ {{ $t('finance.gap_settings') }}</h3>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_name') }}</label>
            <input v-model="settingsForm.name" type="text" maxlength="150" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_frequency') }}</label>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" @click="settingsForm.frequency = 'monthly'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', settingsForm.frequency === 'monthly' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_monthly') }}</button>
              <button type="button" @click="settingsForm.frequency = '15days'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', settingsForm.frequency === '15days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_15') }}</button>
              <button type="button" @click="settingsForm.frequency = '10days'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', settingsForm.frequency === '10days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_10') }}</button>
            </div>
          </div>
          <div v-if="settingsForm.frequency === 'monthly'" class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_day') }}</label>
            <input v-model.number="settingsForm.day_of_month" type="number" min="1" max="28" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
          <!-- B35-3: Boshlanish oyi — eski (o'tgan) gapni yaratish uchun (faqat oylik) -->
          <div v-if="settingsForm.frequency === 'monthly'" class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_start_month') }}</label>
            <date-picker
              v-model="settingsForm.start_month_ym"
              type="month"
              value-type="YYYY-MM"
              format="MMMM YYYY"
              :lang="dpLang"
              :editable="false"
              :clearable="false"
              class="w-full"
              input-class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
            />
            <p class="text-xs text-gray-400 mt-1">{{ $t('finance.gap_start_month_hint') }}</p>
          </div>
          <!-- U5: Hamma uchun bir xil summa -->
          <div class="mb-5">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" v-model="settingsForm.uniform" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              <span class="text-sm font-semibold text-gray-700">{{ $t('finance.gap_uniform_label') }}</span>
            </label>
            <p class="text-xs text-gray-400 mt-1">{{ $t('finance.gap_uniform_hint') }}</p>
            <div v-if="settingsForm.uniform" class="flex items-center gap-2 mt-2">
              <input :value="formatThousands(settingsForm.amount)" @input="onSettingsAmount" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
              <span class="text-sm text-gray-500 flex-shrink-0">{{ gap.currency }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="showSettings = false" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
            <button @click="saveSettings" :disabled="busy" class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ $t('common.save') }}</button>
          </div>
        </div>
      </div>

      <!-- ACTIVE/COMPLETED: davralar (draft'dan tashqari — modal v-if'lar orasidagi
           mo'rt v-else bog'lanishiga tayanmaslik uchun mustaqil aniq shart bilan) -->
      <template v-if="gap.status !== 'draft'">
        <!-- B34-12: tugagan gapni xuddi shu a'zolar bilan qayta boshlash (faqat tashkilotchi) -->
        <div v-if="gap.status === 'completed' && gap.is_organizer" class="rounded-2xl p-5 shadow-sm mb-5 border border-teal-100" style="background: linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%);">
          <div class="flex items-start gap-3">
            <div class="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 text-xl">🔄</div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-gray-900">{{ $t('finance.gap_restart_title') }}</h3>
              <p class="text-sm text-gray-500 mt-0.5">{{ $t('finance.gap_restart_hint') }}</p>
            </div>
          </div>
          <button @click="openRestart" class="w-full mt-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition">🔄 {{ $t('finance.gap_restart') }}</button>
        </div>

        <!-- Navbat tartibi -->
        <div class="bg-white rounded-2xl p-5 shadow-sm mb-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-gray-900">🔢 {{ $t('finance.gap_turn_order') }}</h3>
            <button @click="downloadPdf" :disabled="pdfBusy" class="inline-flex items-center gap-1 px-3 py-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 disabled:opacity-60 rounded-lg text-sm font-semibold transition">
              <span>📄</span> {{ pdfBusy ? '...' : $t('finance.gap_pdf') }}
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <div v-for="m in orderedMembers" :key="m.id" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-sm">
              <span class="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">{{ m.turn_order }}</span>
              {{ m.name }}
            </div>
          </div>
        </div>

        <!-- Davralar -->
        <div class="space-y-4">
          <div v-for="r in gap.rounds" :key="r.id" :class="['bg-white rounded-2xl p-5 shadow-sm', r.status === 'completed' ? 'opacity-70' : '']">
            <!-- B30-12: davra sarlavhasi bosilsa a'zolar ro'yxati ochiladi/yopiladi (▼) -->
            <div class="flex items-center justify-between cursor-pointer select-none" :class="expandedRounds[r.id] ? 'mb-3' : ''" @click="toggleRound(r.id)">
              <div class="min-w-0">
                <p class="font-bold text-gray-900">{{ $t('finance.gap_round') }} {{ r.round_no }} — 📅 {{ fmtUzDate(r.due_date) }}</p>
                <p class="text-sm text-gray-500 mt-0.5">🎯 {{ $t('finance.gap_recipient') }}: <b>{{ r.recipient_name }}</b></p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span :class="r.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'" class="text-xs font-semibold px-2 py-0.5 rounded-full">{{ r.paid_count }}/{{ r.total_count }}</span>
                <svg class="w-5 h-5 text-gray-400 transition-transform" :class="expandedRounds[r.id] ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
            <div v-if="expandedRounds[r.id]" class="space-y-2">
              <div v-for="p in r.payments" :key="p.id" class="flex items-center justify-between p-2.5 rounded-xl gap-2" :class="p.status === 'paid' ? 'bg-green-50' : 'bg-gray-50'">
                <div class="min-w-0">
                  <span class="text-sm text-gray-700">{{ p.payer_name }}</span>
                  <!-- B31-7: qachon to'langani (sana + vaqt) -->
                  <p v-if="p.status === 'paid' && p.paid_at" class="text-xs text-gray-400 mt-0.5">🕒 {{ fmtDateTime(p.paid_at) }}</p>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span class="text-sm font-semibold" :class="p.status === 'paid' ? 'text-green-700' : 'text-gray-500'">{{ formatMoney(p.amount) }} {{ p.currency }}</span>
                  <span v-if="p.status === 'paid'" class="text-green-600 text-xs whitespace-nowrap">✓ {{ $t('finance.gap_paid') }}</span>
                  <button v-else-if="canMark(r)" @click="markPaid(p)" :disabled="busy" class="px-3 py-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-lg text-xs font-semibold">{{ $t('finance.gap_mark_paid') }}</button>
                  <span v-else class="text-gray-400 text-xs">{{ $t('finance.gap_unpaid') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- O'chirish (tashkilotchi) -->
      <div v-if="gap.is_organizer" class="mt-6 text-center">
        <button @click="showRemove = true" class="text-sm text-red-600 hover:text-red-700 font-medium">🗑 {{ $t('finance.gap_delete') }}</button>
      </div>
    </template>

    <!-- O'chirish tasdig'i -->
    <div v-if="showRemove" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showRemove = false"></div>
      <div class="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
        <p class="text-gray-700 mb-5">{{ $t('finance.gap_delete_confirm') }}</p>
        <div class="flex gap-2">
          <button @click="showRemove = false" class="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
          <button @click="removeGap" :disabled="busy" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ $t('finance.gap_delete') }}</button>
        </div>
      </div>
    </div>

    <!-- B34-12: Qayta davom ettirish modali (tugagan gapni xuddi shu a'zolar bilan qayta yaratish) -->
    <div v-if="showRestart" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showRestart = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl overflow-y-auto" style="max-height: 92vh;">
        <h3 class="text-lg font-bold text-gray-900 mb-1">🔄 {{ $t('finance.gap_restart_title') }}</h3>
        <p class="text-sm text-gray-500 mb-4">{{ $t('finance.gap_restart_members', { n: restartMemberCount }) }}</p>
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_name') }}</label>
          <input v-model="restartForm.name" type="text" maxlength="150" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_frequency') }}</label>
          <div class="grid grid-cols-3 gap-2">
            <button type="button" @click="restartForm.frequency = 'monthly'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', restartForm.frequency === 'monthly' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_monthly') }}</button>
            <button type="button" @click="restartForm.frequency = '15days'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', restartForm.frequency === '15days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_15') }}</button>
            <button type="button" @click="restartForm.frequency = '10days'" :class="['px-2 py-2.5 rounded-xl border-2 text-sm', restartForm.frequency === '10days' ? 'border-teal-600 bg-teal-50 text-teal-700 font-semibold' : 'border-gray-200 text-gray-600']">{{ $t('finance.gap_freq_10') }}</button>
          </div>
        </div>
        <div v-if="restartForm.frequency === 'monthly'" class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_day') }}</label>
          <input v-model.number="restartForm.day_of_month" type="number" min="1" max="28" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
        </div>
        <div v-if="restartForm.frequency === 'monthly'" class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_start_month') }}</label>
          <date-picker
            v-model="restartForm.start_month_ym"
            type="month"
            value-type="YYYY-MM"
            format="MMMM YYYY"
            :lang="dpLang"
            :editable="false"
            :clearable="false"
            class="w-full"
            input-class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
          />
        </div>
        <div class="mb-5">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" v-model="restartForm.uniform" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
            <span class="text-sm font-semibold text-gray-700">{{ $t('finance.gap_uniform_label') }}</span>
          </label>
          <div v-if="restartForm.uniform" class="flex items-center gap-2 mt-2">
            <input :value="formatThousands(restartForm.amount)" @input="onRestartAmount" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
            <span class="text-sm text-gray-500 flex-shrink-0">{{ gap.currency }}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="showRestart = false" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
          <button @click="submitRestart" :disabled="busy" class="flex-1 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ $t('finance.gap_restart_go') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FinanceGapDetail',
  middleware: 'auth',
  data() {
    return { loading: true, gap: null, showAddMember: false, newName: '', newPhone: '', newAmount: '', newUniform: true, busy: false, pdfBusy: false, showRemove: false, orderMode: 'random', showSettings: false, settingsForm: { name: '', frequency: 'monthly', day_of_month: 1, start_month_ym: '' }, expandedRounds: {}, showRestart: false, restartForm: { name: '', frequency: 'monthly', day_of_month: 1, amount: '', uniform: true, start_month_ym: '' } }
  },
  computed: {
    gapId() { return this.$route.params.id },
    myId() { return (this.$auth && this.$auth.user && this.$auth.user.id) || null },
    // B35-2: date-picker tili — ilova lokaliga mos (kr=kirill, ru=rus, aks holda lotin)
    dpLang() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn')
    },
    orderedMembers() {
      return (this.gap && this.gap.members ? this.gap.members.slice() : []).filter(m => m.turn_order).sort((a, b) => a.turn_order - b.turn_order)
    },
    // B30-11: keyingi to'lov sanasi — eng yaqin tugallanmagan davra
    nextDue() {
      const rounds = (this.gap && this.gap.rounds) || []
      const pend = rounds.filter(r => r.status !== 'completed' && r.due_date)
        .sort((a, b) => String(a.due_date).localeCompare(String(b.due_date)))
      return pend.length ? pend[0].due_date : null
    },
    // B34-12: qayta davom ettirishда ko'chiriladigan a'zolar soni (tashkilotchidan tashqari)
    restartMemberCount() {
      const org = this.gap && this.gap.organizer_id
      return (this.gap && this.gap.members ? this.gap.members : []).filter(m => m.user_id !== org && m.phone).length
    }
  },
  async mounted() { await this.load() },
  methods: {
    goBack() { this.$router.push(this.localePath({ name: 'finance-gap' })) },
    async load() {
      try {
        this.loading = true
        const res = await this.$api.getGap(this.gapId)
        if (res && res.data && res.data.success) this.gap = res.data.data
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
        this.$router.push(this.localePath({ name: 'finance-gap' }))
      } finally { this.loading = false }
    },
    initials(name) { if (!name) return '?'; const p = String(name).trim().split(/\s+/); return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase() },
    formatMoney(v) { return Number(v || 0).toLocaleString('uz-UZ') },
    formatThousands(v) { if (v === '' || v == null) return ''; const n = Number(v); return isFinite(n) && n > 0 ? n.toLocaleString('uz-UZ') : '' },
    onNewAmountInput(e) { const d = String(e.target.value).replace(/\D/g, ''); this.newAmount = d === '' ? '' : Number(d) },
    async setMemberAmount(m, e) {
      const d = String(e.target.value).replace(/\D/g, '')
      const amount = d === '' ? null : Number(d)
      try {
        await this.$api.updateGapMember(this.gapId, m.id, { amount })
        await this.load()
      } catch (err) {
        this.$toast.error((err.response && err.response.data && err.response.data.message) || this.$t('common.error'))
      }
    },
    fmtDate(d) { if (!d) return ''; const p = String(d).slice(0, 10).split('-'); return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : d },
    // Navbat jadvalini PDF qilib yuklab olish
    async downloadPdf() {
      if (this.pdfBusy) return
      try {
        this.pdfBusy = true
        const res = await this.$api.downloadGapPdf(this.gapId)
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const safe = String((this.gap && this.gap.name) || 'gap').replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 40) || 'gap'
        a.download = `gap-${safe}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error(this.$t('common.error'))
      } finally { this.pdfBusy = false }
    },
    // O'zbekcha sana: "27-avgust, payshanba"
    fmtUzDate(d) {
      if (!d) return ''
      const p = String(d).slice(0, 10).split('-')
      if (p.length !== 3) return d
      const dt = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]))
      const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
      const wd = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']
      return `${+p[2]}-${months[+p[1] - 1] || ''}, ${wd[dt.getUTCDay()] || ''}`
    },
    statusLabel(s) { return s === 'active' ? this.$t('finance.gap_status_active') : (s === 'completed' ? this.$t('finance.gap_status_completed') : this.$t('finance.gap_status_draft')) },
    statusClass(s) { return s === 'active' ? 'bg-green-100 text-green-700' : (s === 'completed' ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700') },
    // B30-11: davr yorlig'i (Har oyda / Har 15 kunda / Har 10 kunda)
    freqLabel(f) { return f === '10days' ? this.$t('finance.gap_freq_10') : (f === '15days' ? this.$t('finance.gap_freq_15') : this.$t('finance.gap_freq_monthly')) },
    // B30-12: davra ochish/yopish
    toggleRound(id) { this.$set(this.expandedRounds, id, !this.expandedRounds[id]) },
    // B31-7: to'langan sana+vaqt (+5 Tashkent)
    fmtDateTime(v) {
      if (!v) return ''
      const d = new Date(v)
      if (isNaN(d)) return String(v).slice(0, 16).replace('T', ' ')
      const t = new Date(d.getTime() + 5 * 3600 * 1000).toISOString()
      return `${t.slice(8, 10)}.${t.slice(5, 7)}.${t.slice(0, 4)} ${t.slice(11, 16)}`
    },
    // Belgilash huquqi: tashkilotchi yoki shu davra qabul qiluvchisi
    canMark(round) {
      if (!this.gap) return false
      if (this.gap.is_organizer) return true
      const rec = this.gap.members.find(m => m.id === round.recipient_member_id)
      return !!(rec && rec.user_id === this.myId)
    },
    // R7: modal har ochilganda maydonlar TOZA bo'lsin (oldingi yozuv saqlanib qolmasin).
    // Telefon +998 prefiksi bilan ochiladi (R6).
    openAddMember() {
      this.newName = ''
      this.newAmount = ''
      this.newUniform = true
      this.newPhone = this.formatUzPhone('998') // "+998"
      this.showAddMember = true
    },
    // R6: O'zbek telefon formati — "+99897 734 50 30". Faqat raqamlarni oladi, 998 bilan
    // boshlanishini ta'minlaydi va guruhlaydi: +998 + OP(2) | XXX | XX | XX.
    formatUzPhone(raw) {
      let d = String(raw == null ? '' : raw).replace(/\D/g, '')
      if (d.startsWith('998')) { /* ok */ }
      else if (d.startsWith('0')) d = '998' + d.slice(1)
      else if (d.length) d = '998' + d
      d = d.slice(0, 12)
      if (d.length <= 3) return '+' + d
      let out = '+' + d.slice(0, 5) // +99897
      if (d.length > 5) out += ' ' + d.slice(5, 8)
      if (d.length > 8) out += ' ' + d.slice(8, 10)
      if (d.length > 10) out += ' ' + d.slice(10, 12)
      return out
    },
    onPhoneInput(e) {
      this.newPhone = this.formatUzPhone(e && e.target ? e.target.value : '')
    },
    async addMember() {
      const phone = String(this.newPhone).trim()
      // Kamida to'liq raqam (998 + 9 raqam) bo'lishi shart — prefiksning o'zi yuborilmasin
      const core9 = phone.replace(/\D/g, '').slice(-9)
      if (core9.length < 9) return
      // Summa: "hamma bilan bir xil" bo'lsa gap standart summasi, aks holda kiritilgan
      let amount
      if (this.newUniform) {
        amount = (this.gap && this.gap.amount != null) ? Number(this.gap.amount) : undefined
      } else {
        amount = this.newAmount === '' ? undefined : Number(this.newAmount)
      }
      const name = String(this.newName || '').trim()
      this.busy = true
      try {
        const res = await this.$api.addGapMember(this.gapId, phone, amount, name || undefined)
        if (res && res.data && res.data.success) {
          // T4: ro'yxatdan o'tmagan raqam bo'lsa ogohlantiramiz (baribir qo'shildi)
          if (res.data.data && res.data.data.registered === false) {
            this.$toast && this.$toast.info && this.$toast.info(this.$t('finance.gap_member_unregistered'))
          }
          this.newName = ''; this.newPhone = ''; this.newAmount = ''; this.newUniform = true
          this.showAddMember = false // R8: a'zo qo'shilgach modal yopilsin (qayta ochilib qolmasin)
          await this.load()
        }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async removeMember(m) {
      this.busy = true
      try {
        const res = await this.$api.removeGapMember(this.gapId, m.id)
        if (res && res.data && res.data.success) await this.load()
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    // Qo'lda navbat: a'zoni yuqoriga/pastga siljitish
    moveMember(i, dir) {
      const arr = this.gap.members
      const j = i + dir
      if (j < 0 || j >= arr.length) return
      const tmp = arr[i]; this.$set(arr, i, arr[j]); this.$set(arr, j, tmp)
    },
    openSettings() {
      // B35-3: boshlanish oyi — mavjud start_year/month'dan "YYYY-MM", bo'lmasa joriy oy
      let ym = ''
      if (this.gap.start_year && this.gap.start_month) {
        ym = `${this.gap.start_year}-${String(this.gap.start_month).padStart(2, '0')}`
      } else {
        const now = new Date()
        ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      }
      this.settingsForm = {
        name: this.gap.name,
        frequency: this.gap.frequency || 'monthly',
        day_of_month: this.gap.day_of_month || 1,
        uniform: !!this.gap.uniform,
        amount: this.gap.amount != null ? this.gap.amount : '',
        start_month_ym: ym
      }
      this.showSettings = true
    },
    // U5/B34-14: uniform summa inputi — FAQAT raqam (harflar kiritilmaydi).
    // :value o'zgarmaganда DOM yangilanmaydi (harf qolib ketardi) — shuning uchun
    // tozalangan qiymatni DOM'ga majburan qaytaramiz.
    onSettingsAmount(e) {
      const d = String(e.target.value).replace(/\D/g, '')
      this.settingsForm.amount = d === '' ? '' : Number(d)
      e.target.value = this.formatThousands(this.settingsForm.amount)
    },
    async saveSettings() {
      this.busy = true
      try {
        const payload = { ...this.settingsForm }
        // B35-3: boshlanish oyini start_year/start_month'ga aylantiramiz (faqat oylik)
        delete payload.start_month_ym
        if (this.settingsForm.frequency === 'monthly' && this.settingsForm.start_month_ym) {
          const [sy, sm] = String(this.settingsForm.start_month_ym).split('-')
          const yy = parseInt(sy, 10), mm = parseInt(sm, 10)
          if (yy && mm) { payload.start_year = yy; payload.start_month = mm }
        }
        const res = await this.$api.updateGap(this.gapId, payload)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.family_updated')); this.showSettings = false; await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    // B34-12: tugagan gapni xuddi shu a'zolar bilan qaytadan boshlash (tashkilotchi)
    openRestart() {
      const now = new Date()
      const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      this.restartForm = {
        name: this.gap.name,
        frequency: this.gap.frequency || 'monthly',
        day_of_month: this.gap.day_of_month || 1,
        amount: this.gap.amount != null ? this.gap.amount : '',
        uniform: this.gap.uniform !== false,
        start_month_ym: ym
      }
      this.showRestart = true
    },
    onRestartAmount(e) {
      const d = String(e.target.value).replace(/\D/g, '')
      this.restartForm.amount = d === '' ? '' : Number(d)
      e.target.value = this.formatThousands(this.restartForm.amount)
    },
    async submitRestart() {
      if (!String(this.restartForm.name).trim()) { this.$toast.error(this.$t('finance.gap_name_required')); return }
      this.busy = true
      try {
        const payload = {
          name: this.restartForm.name.trim(),
          amount: this.restartForm.amount === '' || this.restartForm.amount == null ? null : Number(this.restartForm.amount),
          currency: this.gap.currency,
          day_of_month: this.restartForm.day_of_month || 1,
          frequency: this.restartForm.frequency,
          uniform: this.restartForm.uniform
        }
        if (this.restartForm.frequency === 'monthly' && this.restartForm.start_month_ym) {
          const [sy, sm] = String(this.restartForm.start_month_ym).split('-')
          const yy = parseInt(sy, 10), mm = parseInt(sm, 10)
          if (yy && mm) { payload.start_year = yy; payload.start_month = mm }
        }
        const res = await this.$api.createGap(payload)
        if (!(res && res.data && res.data.success)) throw new Error('create failed')
        const newId = res.data.data.id
        // Eski a'zolarni ko'chiramiz — tashkilotchi yangi gapga avtomatik qo'shilgani uchun uni tashlab ketamiz.
        const org = this.gap.organizer_id
        const members = (this.gap.members || []).filter(m => m.user_id !== org && m.phone)
        for (const m of members) {
          try {
            await this.$api.addGapMember(newId, m.phone, this.restartForm.uniform ? undefined : (m.amount || undefined), m.name || undefined)
          } catch (e) { /* bitta a'zo tushib qolsa qolganlari qo'shilaveradi (tashkilotchi keyin ko'radi) */ }
        }
        this.showRestart = false
        this.$toast.success(this.$t('finance.gap_restart_done'))
        this.$router.push(this.localePath({ name: 'finance-gap-id', params: { id: newId } }))
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async doShuffle() {
      this.busy = true
      try {
        // Qo'lda rejim: joriy a'zolar tartibini yuboramiz; tasodifiy: order=null
        const order = this.orderMode === 'manual' ? this.gap.members.map(m => m.id) : null
        const res = await this.$api.shuffleGap(this.gapId, order)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.gap_started')); await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async markPaid(p) {
      this.busy = true
      try {
        const res = await this.$api.payGap(this.gapId, p.id)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.gap_paid')); await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    async removeGap() {
      this.busy = true
      try {
        const res = await this.$api.removeGap(this.gapId)
        if (res && res.data && res.data.success) { this.showRemove = false; this.$router.push(this.localePath({ name: 'finance-gap' })) }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    }
  }
}
</script>
