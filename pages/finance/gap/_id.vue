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
              <p class="text-sm font-medium text-gray-800 truncate flex items-center gap-1 flex-wrap">
                <span class="truncate">{{ m.name }}</span>
                <span v-if="m.user_id === gap.organizer_id" class="text-teal-600 text-xs font-semibold flex-shrink-0">👑 {{ $t('finance.gap_organizer') || 'tashkilotchi' }}</span>
                <span v-else-if="gap.co_organizer_id && m.user_id === gap.co_organizer_id" class="text-amber-600 text-xs font-semibold flex-shrink-0">👑 2-{{ $t('finance.gap_organizer') || 'tashkilotchi' }}</span>
              </p>
              <p class="text-xs text-gray-400">{{ m.phone }}</p>
            </div>
            <!-- Per-a'zo summa (kim qanchadan kirishadi) -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <input v-if="gap.is_organizer" :value="formatThousands(m.amount)" @change="setMemberAmount(m, $event)" type="text" inputmode="numeric" :placeholder="$t('finance.gap_amount_ph')" class="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-right outline-none focus:ring-2 focus:ring-teal-500" />
              <span v-else class="text-xs font-semibold text-gray-700">{{ m.amount ? formatMoney(m.amount) : '—' }}</span>
              <span class="text-xs text-gray-400">{{ gap.currency }}</span>
              <!-- SS-B: qo'shimcha tashkilotchi boshqaruvi — FAQAT dastlabki tashkilotchi -->
              <button
                v-if="gap.is_primary_organizer && !gap.co_organizer_id && m.user_id !== gap.organizer_id"
                @click="askCoOrg(m, 'make')" :disabled="busy"
                class="px-2 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 whitespace-nowrap"
                :title="$t('finance.gap_make_coorg') || 'Tashkilotchi qilish'"
              >👑+</button>
              <button
                v-if="gap.is_primary_organizer && gap.co_organizer_id && m.user_id === gap.co_organizer_id"
                @click="askCoOrg(m, 'remove')" :disabled="busy"
                class="px-2 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 whitespace-nowrap"
                :title="$t('finance.gap_remove_coorg') || 'Tashkilotchidan olib tashlash'"
              >👑−</button>
              <button v-if="gap.is_organizer && m.user_id !== gap.organizer_id && !(gap.co_organizer_id && m.user_id === gap.co_organizer_id)" @click="removeMember(m)" class="px-1.5 text-gray-400 hover:text-red-600" aria-label="remove">✕</button>
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
        <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl overflow-y-auto" style="max-height:92vh">
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
          <!-- SS2: Boshlanish sanasi — BARCHA frequency uchun (o'tgan sanadan boshlangan gapni kiritish) -->
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_start_date') }}</label>
            <date-picker
              v-model="settingsForm.start_date"
              value-type="YYYY-MM-DD"
              format="DD.MM.YYYY"
              :lang="dpLang"
              :editable="false"
              :clearable="true"
              placeholder="kun.oy.yil"
              class="w-full"
              input-class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
            />
            <p class="text-xs text-gray-400 mt-1">{{ $t('finance.gap_start_date_hint') }}</p>
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
          <!-- SS-B (2026-09-18): faol gapда ham qo'shimcha tashkilotchi qo'shish — chiplarda 👑+/👑− -->
          <p v-if="gap.is_primary_organizer" class="text-xs text-gray-400 mb-2">👑+ tugmasi orqali a'zoni 2-tashkilotchi qilishingiz mumkin (ko'pi bilan 2 ta).</p>
          <div class="flex flex-wrap gap-2">
            <div v-for="m in orderedMembers" :key="m.id" class="inline-flex items-center gap-1 pl-1.5 pr-1.5 py-1 bg-gray-50 rounded-full text-sm">
              <span class="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{{ m.turn_order }}</span>
              <span>{{ m.name }}</span>
              <span v-if="m.user_id === gap.organizer_id" title="Tashkilotchi" class="flex-shrink-0">👑</span>
              <span v-else-if="gap.co_organizer_id && m.user_id === gap.co_organizer_id" title="2-tashkilotchi" class="flex-shrink-0">👑</span>
              <button v-if="gap.is_primary_organizer && !gap.co_organizer_id && m.user_id !== gap.organizer_id" @click.stop="askCoOrg(m, 'make')" :disabled="busy" class="flex-shrink-0 inline-flex items-center px-1.5 h-6 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-50 text-xs font-semibold" :title="$t('finance.gap_make_coorg') || 'Tashkilotchi qilish'">👑+</button>
              <button v-if="gap.is_primary_organizer && gap.co_organizer_id && m.user_id === gap.co_organizer_id" @click.stop="askCoOrg(m, 'remove')" :disabled="busy" class="flex-shrink-0 inline-flex items-center px-1.5 h-6 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 disabled:opacity-50 text-xs font-semibold" title="Tashkilotchidan olib tashlash">👑−</button>
            </div>
          </div>
        </div>

        <!-- SS-3 (2026-09-19): gap qaysi Telegram guruh(lar)iga bog'langan -->
        <div class="bg-white rounded-2xl p-5 shadow-sm mb-5">
          <h3 class="font-bold text-gray-900 mb-3">💬 {{ $t('finance.gap_tg_groups') || 'Telegram guruhlari' }}</h3>
          <div v-if="tgGroups.length" class="space-y-2">
            <div v-for="g in tgGroups" :key="g.id" class="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50">
              <span class="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">💬</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ g.title }}</p>
                <p v-if="g.chat_id" class="text-xs text-gray-400 truncate">ID: {{ g.chat_id }}</p>
              </div>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style="background:#DCFCE7; color:#166534;">{{ $t('finance.gap_tg_linked') || 'Bog\'langan' }}</span>
            </div>
            <p class="text-xs text-gray-400">{{ $t('finance.gap_tg_hint') || "Har davradan 1 kun oldin navbat, karta va manzil shu guruh(lar)ga avtomatik e'lon qilinadi." }}</p>
          </div>
          <div v-else class="text-center py-2">
            <p class="text-sm text-gray-400">{{ $t('finance.gap_tg_none') || 'Hech qanday guruhga bog\'lanmagan' }}</p>
            <p v-if="gap.is_organizer" class="text-xs text-gray-400 mt-1">{{ $t('finance.gap_tg_howto') || "Botni gap guruhiga qo'shing va guruh ichida /gap_ulash buyrug'ini yuboring." }}</p>
          </div>
        </div>

        <!-- SS-DEV (2026-09-24): A'ZOLARNING TUG'ILGAN KUNLARI.
             Talab: guruh a'zolarining tug'ilgan kunini Telegram profilidan olish (kiritgan
             bo'lsa), aks holda qo'lda kiritish; o'sha kuni 07:00 da bot tabrik yuboradi.
             24.09: bo'lim YIG'ILUVCHI (default YOPIQ) + gap a'zosi bo'lmagan Telegram guruh
             a'zolarini qo'lda qo'shish (ular ham tabriklanadi). -->
        <div class="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <button type="button" class="w-full flex items-center justify-between gap-2 p-5 text-left select-none" @click="bdOpen = !bdOpen">
            <div class="min-w-0">
              <h3 class="font-bold text-gray-900">🎂 {{ bdTexts.title }} <span v-if="bdCount" class="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ bdCount }}</span></h3>
              <p v-if="!bdOpen" class="text-xs text-gray-400 mt-0.5 truncate">{{ bdTexts.collapsedHint }}</p>
            </div>
            <svg class="w-5 h-5 text-gray-400 transition-transform flex-shrink-0" :class="bdOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>

          <div v-show="bdOpen" class="px-5 pb-5">
            <div class="flex items-center justify-between gap-2 flex-wrap mb-3">
              <p class="text-xs text-gray-400">{{ bdTexts.hint }}</p>
              <button
                v-if="gap.is_organizer"
                @click="syncBirthdays"
                :disabled="bdSyncing"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors flex-shrink-0"
                :style="bdSyncing ? 'opacity:.6' : ''"
              >
                <span>✈️</span> {{ bdSyncing ? bdTexts.syncing : bdTexts.sync }}
              </button>
            </div>

            <div v-if="bdLoading" class="text-sm text-gray-400 py-2">{{ bdTexts.loading }}</div>
            <div v-else-if="birthdays.length" class="divide-y divide-gray-100">
              <div v-for="b in birthdays" :key="b.member_id" class="py-2.5 flex items-center gap-3 flex-wrap">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 truncate">{{ b.name }}</p>
                  <p class="text-xs text-gray-400">
                    <template v-if="b.birth_day">
                      {{ fmtBirthday(b) }}
                      <span v-if="b.source === 'telegram'" class="ml-1 px-1.5 py-0.5 rounded-full" style="background:#E0F2FE; color:#0369A1;">Telegram</span>
                      <span v-else class="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{{ bdTexts.manual }}</span>
                    </template>
                    <template v-else>{{ bdTexts.notSet }}</template>
                  </p>
                </div>
                <!-- Tashkilotchi hamma uchun, oddiy a'zo faqat o'zi uchun kiritadi -->
                <div v-if="canEditBirthday(b)" class="flex items-center gap-1.5">
                  <select v-model.number="bdEdit[b.member_id].day" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400">
                    <option :value="0">{{ bdTexts.day }}</option>
                    <option v-for="d in 31" :key="'d' + d" :value="d">{{ d }}</option>
                  </select>
                  <select v-model.number="bdEdit[b.member_id].month" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400">
                    <option :value="0">{{ bdTexts.month }}</option>
                    <option v-for="(mn, i) in bdMonths" :key="'m' + i" :value="i + 1">{{ mn }}</option>
                  </select>
                  <input v-model.number="bdEdit[b.member_id].year" type="number" min="1900" :max="new Date().getFullYear()" :placeholder="bdTexts.year" class="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" />
                  <button @click="saveBirthday(b)" :disabled="bdSaving === b.member_id" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white" :style="bdSaving === b.member_id ? 'opacity:.6' : ''">{{ bdTexts.save }}</button>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-400 py-2">{{ bdTexts.empty }}</p>

            <!-- SS-DEV (2026-09-24): GAP A'ZOSI BO'LMAGAN Telegram guruh a'zolari (qo'lda) -->
            <div class="mt-4 pt-4 border-t border-gray-100">
              <p class="text-sm font-semibold text-gray-800">{{ bdTexts.extrasTitle }}</p>
              <p class="text-xs text-gray-400 mt-0.5 mb-2">{{ bdTexts.extrasHint }}</p>
              <div v-if="bdExtras.length" class="divide-y divide-gray-100 mb-2">
                <div v-for="x in bdExtras" :key="'x' + x.id" class="py-2 flex items-center gap-3">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-800 truncate">{{ x.name }} <span v-if="x.tg_username" class="text-xs font-normal text-sky-600">@{{ x.tg_username }}</span></p>
                    <p class="text-xs text-gray-400">{{ fmtBirthday(x) }} <span class="ml-1 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{{ bdTexts.extraTag }}</span></p>
                  </div>
                  <button v-if="gap.is_organizer" @click="removeExtra(x)" class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50" :title="bdTexts.remove">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
              <div v-if="gap.is_organizer" class="flex flex-wrap items-center gap-1.5">
                <input v-model="bdNew.name" type="text" maxlength="100" :placeholder="bdTexts.extraName" class="flex-1 min-w-0 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" style="min-width: 140px;" />
                <input v-model="bdNew.tg_username" type="text" maxlength="64" placeholder="@username" class="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" style="width: 120px;" />
                <select v-model.number="bdNew.day" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400">
                  <option :value="0">{{ bdTexts.day }}</option>
                  <option v-for="d in 31" :key="'nd' + d" :value="d">{{ d }}</option>
                </select>
                <select v-model.number="bdNew.month" class="border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400">
                  <option :value="0">{{ bdTexts.month }}</option>
                  <option v-for="(mn, i) in bdMonths" :key="'nm' + i" :value="i + 1">{{ mn }}</option>
                </select>
                <input v-model.number="bdNew.year" type="number" min="1900" :max="new Date().getFullYear()" :placeholder="bdTexts.year" class="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-sky-400" />
                <button @click="addExtra" :disabled="bdAdding" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white" :style="bdAdding ? 'opacity:.6' : ''">＋ {{ bdTexts.add }}</button>
              </div>
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
            <!-- SS2: butun davra tafsiloti (uchrashuv joyi + davomat + to'lovlar) chevron bilan
                 ochiladi/yopiladi. Joriy davra avtomatik ochiq, o'tgan davralar yopiq. -->
            <div v-if="expandedRounds[r.id]">
              <!-- Uchrashuv joyi (venue) -->
              <div v-if="r.venue" class="mt-3 rounded-xl p-3 flex items-start gap-2.5" style="background: linear-gradient(135deg,#f0fdfa 0%,#ecfdf5 100%)">
                <span class="text-lg flex-shrink-0">📍</span>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-gray-800 break-words">{{ r.venue }}</p>
                  <a v-if="r.location" :href="r.location" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs text-teal-600 hover:underline break-all mt-0.5">🗺 {{ $t('finance.gap_venue_location') }}</a>
                </div>
                <button v-if="canSetVenue(r) && r.status !== 'completed'" @click.stop="openVenue(r)" class="text-gray-400 hover:text-teal-600 flex-shrink-0" :title="$t('common.edit')">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
              </div>
              <button v-else-if="canSetVenue(r) && r.status !== 'completed'" @click.stop="openVenue(r)" class="mt-3 inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-sm font-medium transition">
                <span>📍</span> {{ $t('finance.gap_venue_add') }}
              </button>
              <!-- SS3: Plastik karta raqami + egasi (FISH) — nusxa olib pul o'tkazish -->
              <div v-if="r.card_number" class="mt-3 flex items-center gap-2.5 rounded-xl p-3" style="background:#eff6ff">
                <span class="text-lg flex-shrink-0">💳</span>
                <div class="min-w-0 flex-1">
                  <p class="text-xs text-gray-500">{{ $t('finance.gap_card') }}</p>
                  <p class="text-sm font-semibold text-gray-800 break-all">{{ r.card_number }}</p>
                  <p v-if="r.card_holder" class="text-xs text-gray-600 mt-0.5">👤 {{ r.card_holder }}</p>
                </div>
                <button @click.stop="copyCard(r.card_number)" class="text-xs font-semibold text-teal-700 bg-teal-100 hover:bg-teal-200 px-2.5 py-1.5 rounded-lg flex-shrink-0">{{ $t('finance.gap_card_copy') }}</button>
                <button v-if="canSetVenue(r) && r.status !== 'completed'" @click.stop="openVenue(r, 'card')" class="text-gray-400 hover:text-blue-600 flex-shrink-0" :title="$t('common.edit')">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
              </div>
              <!-- SS3: karta kiritilmagan → 'card' rejimida oynani ochadi (xaritasiz) -->
              <button v-else-if="canSetVenue(r) && r.status !== 'completed'" @click.stop="openVenue(r, 'card')" class="mt-3 inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition">
                <span>💳</span> {{ $t('finance.gap_card_add') }}
              </button>
              <!-- SS8/SS-notice (2026-09-18): JOY bo'lsa "Taklif" (Boraman/Bora olmayman);
                   JOY/KARTA bo'lmasa ham "To'lov haqida ogohlantirish" (navbat+sana+summa) yuboriladi. -->
              <button v-if="canSetVenue(r) && r.status !== 'completed'" @click.stop="sendInvite(r)" :disabled="inviteBusy === r.id" class="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition" :class="r.venue ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-amber-500 hover:bg-amber-600'">
                <span>{{ r.venue ? '📨' : '🔔' }}</span> {{ inviteBusy === r.id ? ($t('common.sending') || 'Yuborilmoqda...') : (r.venue ? ($t('finance.gap_send_invite') || 'Taklif yuborish') : ($t('finance.gap_send_notice') || "To'lov haqida ogohlantirish")) }}
              </button>
              <!-- SS5: Boraman / Bora olmayman (Telegram javoblari) — kim boradi/bormaydi -->
              <div v-if="r.attendance && (r.attendance.going.length || r.attendance.not_going.length)" class="mt-3 grid grid-cols-2 gap-2">
                <div class="rounded-xl p-2.5 bg-green-50">
                  <p class="text-xs font-semibold text-green-700 mb-1">✅ {{ $t('finance.gap_att_going') }} ({{ r.attendance.going.length }})</p>
                  <p v-if="r.attendance.going.length" class="text-xs text-gray-600 leading-relaxed break-words">{{ r.attendance.going.join(', ') }}</p>
                  <p v-else class="text-xs text-gray-400">—</p>
                </div>
                <div class="rounded-xl p-2.5 bg-red-50">
                  <p class="text-xs font-semibold text-red-700 mb-1">❌ {{ $t('finance.gap_att_not_going') }} ({{ r.attendance.not_going.length }})</p>
                  <p v-if="r.attendance.not_going.length" class="text-xs text-gray-600 leading-relaxed break-words">{{ r.attendance.not_going.join(', ') }}</p>
                  <p v-else class="text-xs text-gray-400">—</p>
                </div>
              </div>
              <div class="mt-3 space-y-2">
                <div v-for="p in r.payments" :key="p.id" class="flex items-center justify-between p-2.5 rounded-xl gap-2" :class="p.status === 'paid' ? 'bg-green-50' : 'bg-gray-50'">
                <div class="min-w-0">
                  <span class="text-sm text-gray-700">{{ p.payer_name }}</span>
                  <!-- B31-7: qachon to'langani (sana + vaqt) -->
                  <p v-if="p.status === 'paid' && p.paid_at" class="text-xs text-gray-400 mt-0.5">🕒 {{ fmtDateTime(p.paid_at) }}</p>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span class="text-sm font-semibold" :class="p.status === 'paid' ? 'text-green-700' : 'text-gray-500'">{{ formatMoney(p.amount) }} {{ p.currency }}</span>
                  <span v-if="p.status === 'paid'" class="text-green-600 text-xs whitespace-nowrap">✓ {{ $t('finance.gap_paid') }}</span>
                  <!-- SS7: to'langanni BEKOR qilish (faqat belgilagan odam — backend marked_by tekshiradi)
                       SS-2 (2026-09-19): faqat tasdiqlangandan keyin 24 soat ichida. -->
                  <button v-if="canUnmark(r, p)" @click="unmarkPaid(p)" :disabled="busy" class="px-2 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-60 text-gray-700 rounded-lg text-xs font-medium">↩️ {{ $t('finance.gap_unmark') || 'Bekor' }}</button>
                  <button v-else-if="p.status !== 'paid' && canMark(r)" @click="markPaid(p)" :disabled="busy" class="px-3 py-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-lg text-xs font-semibold">{{ $t('finance.gap_mark_paid') }}</button>
                  <span v-else-if="p.status !== 'paid'" class="text-gray-400 text-xs">{{ $t('finance.gap_unpaid') }}</span>
                </div>
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

    <!-- Uchrashuv joyi modali -->
    <div v-if="showVenue" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showVenue = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900">{{ venueMode === 'card' ? ('💳 ' + $t('finance.gap_card')) : ('📍 ' + $t('finance.gap_venue_title')) }}</h3>
          <button @click="showVenue = false" class="text-gray-400 hover:text-gray-600" aria-label="close"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <!-- SS2/SS3: LOCATION rejimi — manzil + xarita + lokatsiya (karta bu yerda YO'Q) -->
        <template v-if="venueMode === 'location'">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_venue_addr') }}</label>
          <input v-model="venueForm.venue" type="text" maxlength="300" :placeholder="$t('finance.gap_venue_addr_ph')" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm mb-3 outline-none focus:ring-2 focus:ring-teal-500" @keyup.enter="saveVenue" />
          <div class="flex items-center justify-between mb-1 gap-2">
            <label class="block text-sm font-semibold text-gray-700">🗺 {{ $t('finance.gap_venue_location') }} <span class="text-gray-400 font-normal text-xs">({{ $t('finance.gap_venue_optional') }})</span></label>
            <button type="button" @click="locateMe" :disabled="locating" class="inline-flex items-center gap-1 flex-shrink-0 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 disabled:opacity-60 px-2.5 py-1 rounded-lg transition">
              <svg class="w-3.5 h-3.5" :class="locating ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {{ locating ? ($t('finance.gap_venue_locating') || 'Aniqlanmoqda…') : $t('finance.gap_venue_locate') }}
            </button>
          </div>
          <div ref="venueMap" class="w-full rounded-xl border border-gray-200 mb-2 overflow-hidden bg-gray-100" style="height: 240px;"></div>
          <div class="flex items-center justify-between mb-2 gap-2">
            <p class="text-xs text-gray-500">📍 {{ $t('finance.gap_venue_map_hint') }}</p>
            <span v-if="venueCoords" class="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg flex-shrink-0 whitespace-nowrap">{{ venueCoords }}</span>
          </div>
          <input v-model="venueForm.location" type="text" maxlength="500" placeholder="https://yandex.uz/maps/..." class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm mb-1 outline-none focus:ring-2 focus:ring-teal-500" />
          <p class="text-xs text-gray-400 mb-4">{{ $t('finance.gap_venue_hint') }}</p>
        </template>
        <!-- SS3: CARD rejimi — FAQAT plastik karta raqami (16 xona) + egasi FISH (xarita YO'Q) -->
        <template v-else>
          <div class="rounded-xl border-2 border-blue-200 bg-blue-50 p-3 mb-4">
            <label class="block text-sm font-bold text-blue-800 mb-1">💳 {{ $t('finance.gap_card') }}</label>
            <input :value="venueForm.card_number" @input="onCardInput" type="text" inputmode="numeric" maxlength="19" placeholder="8600 1234 5678 9012" class="w-full px-4 py-2.5 border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" @keyup.enter="saveVenue" />
            <p class="text-xs text-blue-600 mt-1">{{ $t('finance.gap_card_hint') }}</p>
            <label class="block text-sm font-bold text-blue-800 mb-1 mt-3">👤 {{ $t('finance.gap_card_holder') || 'Karta egasi (FISH)' }}</label>
            <input v-model="venueForm.card_holder" type="text" maxlength="100" :placeholder="$t('finance.gap_card_holder_ph') || 'Ism Familiya'" class="w-full px-4 py-2.5 border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
        </template>
        <div class="flex gap-2">
          <button @click="showVenue = false" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
          <button @click="saveVenue" :disabled="busy || !canSaveVenue" class="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ $t('common.save') }}</button>
        </div>
      </div>
    </div>

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
  
    <!-- SS-19 (2026-09-19): native confirm() O'RNIGA markazlashgan modal -->
    <ConfirmModal
      v-if="confirmKind"
      :title="confirmCfg.title"
      :message="confirmCfg.message"
      :confirm-text="confirmCfg.confirmText"
      :tone="confirmCfg.tone"
      :icon="confirmCfg.icon"
      :busy="busy"
      @cancel="confirmKind = ''"
      @confirm="onConfirmAccept"
    />
</div>
</template>

<script>
// SS-2 (2026-09-19): to'lovni bekor qilish oynasi. Backenddagi (GapController
// `markUnpaidCore`) 24 soatlik cheklov bilan BIR XIL bo'lishi shart — aks holda
// tugma ko'rinadi-yu, server rad etadi.
const UNMARK_WINDOW_MS = 24 * 3600 * 1000

export default {
  name: 'FinanceGapDetail',
  middleware: 'auth',
  data() {
    return { loading: true, gap: null, showAddMember: false, newName: '', newPhone: '', newAmount: '', newUniform: true, busy: false, pdfBusy: false, showRemove: false, orderMode: 'random', showSettings: false, settingsForm: { name: '', frequency: 'monthly', day_of_month: 1, start_month_ym: '' }, expandedRounds: {}, showRestart: false, restartForm: { name: '', frequency: 'monthly', day_of_month: 1, amount: '', uniform: true, start_month_ym: '' }, showVenue: false, venueRound: null, venueMode: 'location', venueForm: { venue: '', location: '', card_number: '', card_holder: '' }, venueCoords: '', inviteBusy: null, locating: false, confirmKind: '', confirmMember: null,
      // SS-DEV (2026-09-24): tug'ilgan kunlar
      birthdays: [], bdEdit: {}, bdLoading: false, bdSyncing: false, bdSaving: null,
      // 24.09: bo'lim yig'iluvchi (default yopiq) + qo'shimcha (gap a'zosi bo'lmagan) odamlar
      bdOpen: false, bdExtras: [], bdAdding: false, bdNew: { name: '', tg_username: '', day: 0, month: 0, year: '' } }
  },
  computed: {
    gapId() { return this.$route.params.id },
    myId() { return (this.$auth && this.$auth.user && this.$auth.user.id) || null },
    // B35-2: date-picker tili — ilova lokaliga mos (kr=kirill, ru=rus, aks holda lotin)
    dpLang() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn')
    },
    // SS-19: tasdiqlash modali matni.
    confirmCfg() {
      const n = (this.confirmMember && this.confirmMember.name) || ''
      if (this.confirmKind === 'make') return {
        title: this.$t('finance.gap_make_coorg') || 'Tashkilotchi qilish',
        message: `«${n}» qo'shimcha tashkilotchi bo'ladi va gapni siz bilan birga boshqaradi.`,
        // SS-DEV (2026-09-24): "qil" → "qilish" (foydalanuvchi talabi)
        confirmText: 'Ha, tashkilotchi qilish', tone: 'warning', icon: '👑',
      }
      return {
        title: this.$t('finance.gap_remove_coorg') || 'Tashkilotchidan olib tashlash',
        message: `«${n}» endi gapni boshqara olmaydi.`,
        // SS-DEV (2026-09-24): "olib tashla" → "olib tashlash" (foydalanuvchi talabi)
        confirmText: 'Ha, olib tashlash', tone: 'danger', icon: '👑',
      }
    },
    orderedMembers() {
      return (this.gap && this.gap.members ? this.gap.members.slice() : []).filter(m => m.turn_order).sort((a, b) => a.turn_order - b.turn_order)
    },
    // SS-DEV (2026-09-24): tug'ilgan kunlar bo'limi matnlari (uz/ru/kr).
    bdTexts() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      const t = {
        uz: { title: "Tug'ilgan kunlar", sync: "Telegram'dan olish", syncing: 'Olinmoqda…', hint: "A'zoning tug'ilgan kuni Telegram profilidan olinadi (kiritgan bo'lsa), aks holda qo'lda kiriting. O'sha kuni ertalab 07:00 da bot gap guruhiga tabrik yuboradi.", loading: 'Yuklanmoqda…', manual: "qo'lda", notSet: 'Kiritilmagan', day: 'Kun', month: 'Oy', year: 'Yil', save: 'Saqlash', empty: "A'zolar yo'q", saved: 'Saqlandi', synced: (n) => `Telegram'dan ${n} ta tug'ilgan kun olindi`, none: "Telegram profillarida tug'ilgan kun topilmadi — qo'lda kiriting", collapsedHint: "Ochish uchun bosing — a'zolar va qo'shimcha odamlarning tug'ilgan kunlari", extrasTitle: "Gap a'zosi bo'lmagan guruhdoshlar", extrasHint: "Telegram guruhda bor, lekin gapga qo'shilmagan odamlarni qo'lda qo'shing — ular ham tabriklanadi.", extraName: 'Ism', extraTag: "guruhdosh", add: "Qo'shish", remove: "Olib tashlash", added: "Qo'shildi", removed: "Olib tashlandi" },
        ru: { title: 'Дни рождения', sync: 'Взять из Telegram', syncing: 'Загрузка…', hint: 'Дата рождения берётся из профиля Telegram (если указана), иначе введите вручную. В этот день в 07:00 бот отправит поздравление в группу.', loading: 'Загрузка…', manual: 'вручную', notSet: 'Не указано', day: 'День', month: 'Месяц', year: 'Год', save: 'Сохранить', empty: 'Нет участников', saved: 'Сохранено', synced: (n) => `Из Telegram получено ${n} дат`, none: 'В профилях Telegram даты не найдены — введите вручную', collapsedHint: 'Нажмите, чтобы открыть — дни рождения участников и дополнительных людей', extrasTitle: 'Не участники гапа (из Telegram-группы)', extrasHint: 'Добавьте вручную тех, кто есть в Telegram-группе, но не в гапе — их тоже поздравим.', extraName: 'Имя', extraTag: 'из группы', add: 'Добавить', remove: 'Удалить', added: 'Добавлено', removed: 'Удалено' },
        kr: { title: 'Туғилган кунлар', sync: "Telegram'дан олиш", syncing: 'Олинмоқда…', hint: "Аъзонинг туғилган куни Telegram профилидан олинади (киритган бўлса), акс ҳолда қўлда киритинг. Ўша куни эрталаб 07:00 да бот гап гуруҳига табрик юборади.", loading: 'Юкланмоқда…', manual: 'қўлда', notSet: 'Киритилмаган', day: 'Кун', month: 'Ой', year: 'Йил', save: 'Сақлаш', empty: 'Аъзолар йўқ', saved: 'Сақланди', synced: (n) => `Telegram'дан ${n} та туғилган кун олинди`, none: 'Telegram профилларида туғилган кун топилмади — қўлда киритинг', collapsedHint: 'Очиш учун босинг — аъзолар ва қўшимча одамларнинг туғилган кунлари', extrasTitle: 'Гап аъзоси бўлмаган гуруҳдошлар', extrasHint: 'Telegram гуруҳда бор, лекин гапга қўшилмаган одамларни қўлда қўшинг — улар ҳам табрикланади.', extraName: 'Исм', extraTag: 'гуруҳдош', add: 'Қўшиш', remove: 'Олиб ташлаш', added: 'Қўшилди', removed: 'Олиб ташланди' },
      }
      return t[loc] || t.uz
    },
    // SS-DEV (2026-09-24): yopiq sarlavhada nechta sana kiritilgani
    bdCount() {
      return this.birthdays.filter((b) => b.birth_day).length + this.bdExtras.length
    },
    bdMonths() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      if (loc === 'ru') return ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
      if (loc === 'kr') return ['январ', 'феврал', 'март', 'апрел', 'май', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр']
      return ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
    },
    // SS-3 (2026-09-19): bog'langan Telegram guruhlari (backend `telegram_groups`).
    tgGroups() {
      return (this.gap && Array.isArray(this.gap.telegram_groups)) ? this.gap.telegram_groups : []
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
    },
    // SS3: rejimga qarab saqlash tugmasi faolligi (card → karta raqami; location → manzil).
    canSaveVenue() {
      if (this.venueMode === 'card') return !!String(this.venueForm.card_number || '').replace(/\D/g, '')
      return !!String(this.venueForm.venue || '').trim()
    }
  },
  watch: {
    // SS5: venue modal yopilganda Leaflet xaritasini tozalaymiz (xotira/qayta-init uchun)
    showVenue(v) { if (!v) this.destroyVenueMap() }
  },
  beforeDestroy() { this.destroyVenueMap() },
  async mounted() { await this.load() },
  methods: {
    goBack() { this.$router.push(this.localePath({ name: 'finance-gap' })) },
    async load() {
      try {
        this.loading = true
        const res = await this.$api.getGap(this.gapId)
        if (res && res.data && res.data.success) {
          this.gap = res.data.data
          this.autoExpandCurrentRound()
          this.loadBirthdays() // SS-DEV (2026-09-24): fon rejimida, asosiy yuklashni bloklamaydi
        }
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
        this.$router.push(this.localePath({ name: 'finance-gap' }))
      } finally { this.loading = false }
    },

    // ---- SS-DEV (2026-09-24): tug'ilgan kunlar ----
    async loadBirthdays() {
      this.bdLoading = true
      try {
        const res = await this.$api.getGapBirthdays(this.gapId)
        const items = (res && res.data && res.data.data && res.data.data.items) || []
        this.applyBirthdays(items)
      } catch (_) { this.birthdays = [] } finally { this.bdLoading = false }
      this.loadExtras()
    },
    // SS-DEV (2026-09-24): gap a'zosi bo'lmagan guruhdoshlar (qo'lda qo'shilgan).
    async loadExtras() {
      try {
        const res = await this.$api.getGapBirthdayExtras(this.gapId)
        this.bdExtras = (res && res.data && res.data.data) || []
      } catch (_) { this.bdExtras = [] }
    },
    async addExtra() {
      const n = this.bdNew
      if (!String(n.name || '').trim() || !(n.day > 0 && n.month > 0)) {
        this.$toast && this.$toast.error && this.$toast.error(this.bdTexts.extraName + ' / ' + this.bdTexts.day + ' / ' + this.bdTexts.month)
        return
      }
      this.bdAdding = true
      try {
        const res = await this.$api.addGapBirthdayExtra(this.gapId, { name: n.name, tg_username: n.tg_username, day: n.day, month: n.month, year: n.year || null })
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success(this.bdTexts.added)
          this.bdNew = { name: '', tg_username: '', day: 0, month: 0, year: '' }
          await this.loadExtras()
        }
      } catch (err) {
        this.$toast && this.$toast.error && this.$toast.error((err.response && err.response.data && err.response.data.message) || this.$t('common.error'))
      } finally { this.bdAdding = false }
    },
    async removeExtra(x) {
      try {
        await this.$api.deleteGapBirthdayExtra(this.gapId, x.id)
        this.$toast && this.$toast.success && this.$toast.success(this.bdTexts.removed)
        await this.loadExtras()
      } catch (err) {
        this.$toast && this.$toast.error && this.$toast.error((err.response && err.response.data && err.response.data.message) || this.$t('common.error'))
      }
    },
    applyBirthdays(items) {
      this.birthdays = items
      const edit = {}
      items.forEach((b) => { edit[b.member_id] = { day: b.birth_day || 0, month: b.birth_month || 0, year: b.birth_year || '' } })
      this.bdEdit = edit
    },
    canEditBirthday(b) {
      if (!this.gap) return false
      return !!this.gap.is_organizer || (!!this.myId && b.user_id === this.myId)
    },
    fmtBirthday(b) {
      if (!b || !b.birth_day) return ''
      const m = this.bdMonths[(b.birth_month || 1) - 1] || ''
      return `${b.birth_day}-${m}${b.birth_year ? ' ' + b.birth_year : ''}`
    },
    async saveBirthday(b) {
      const e = this.bdEdit[b.member_id] || {}
      if (!(e.day > 0 && e.month > 0)) {
        this.$toast && this.$toast.error && this.$toast.error(this.bdTexts.day + ' / ' + this.bdTexts.month)
        return
      }
      this.bdSaving = b.member_id
      try {
        const res = await this.$api.saveGapBirthday(this.gapId, b.member_id, { day: e.day, month: e.month, year: e.year || null })
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success(this.bdTexts.saved)
          await this.loadBirthdays()
        }
      } catch (err) {
        this.$toast && this.$toast.error && this.$toast.error((err.response && err.response.data && err.response.data.message) || this.$t('common.error'))
      } finally { this.bdSaving = null }
    },
    async syncBirthdays() {
      if (this.bdSyncing) return
      this.bdSyncing = true
      try {
        const res = await this.$api.syncGapBirthdays(this.gapId)
        const d = res && res.data && res.data.data
        if (d) {
          this.applyBirthdays(d.items || [])
          const msg = d.found > 0 ? this.bdTexts.synced(d.found) : this.bdTexts.none
          this.$toast && (d.found > 0 ? this.$toast.success(msg) : this.$toast.info ? this.$toast.info(msg) : this.$toast.success(msg))
        }
      } catch (err) {
        this.$toast && this.$toast.error && this.$toast.error((err.response && err.response.data && err.response.data.message) || this.$t('common.error'))
      } finally { this.bdSyncing = false }
    },
    // Uchrashuv joyini kirita oladimi: tashkilotchi yoki shu davra qabul qiluvchisi (navbati kelgan)
    canSetVenue(r) {
      if (!this.gap || !r) return false
      if (r.status === 'completed') return false
      // Tadbir kuni o'tib ketgan bo'lsa — joy kiritish/tahrirlash yopiq (venue faqat ko'rinadi)
      const today = new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10)
      if (r.due_date && String(r.due_date).slice(0, 10) < today) return false
      return !!this.gap.is_organizer || (!!this.gap.my_member_id && r.recipient_member_id === this.gap.my_member_id)
    },
    // SS2/SS3: manzil (location) va plastik karta ALOHIDA oynalarda. mode='location' → xarita
    // ko'rinadi (karta yo'q); mode='card' → faqat karta+FISH (xarita YO'Q).
    openVenue(r, mode = 'location') {
      this.venueRound = r
      this.venueMode = mode === 'card' ? 'card' : 'location'
      this.venueForm = { venue: r.venue || '', location: r.location || '', card_number: r.card_number || '', card_holder: r.card_holder || '' }
      this.showVenue = true
      // Xarita FAQAT location rejimida ishga tushadi (SS3: karta oynasida xarita chiqmasin).
      if (this.venueMode === 'location') this.$nextTick(() => { this.initVenueMap() })
    },
    // SS2: YANDEX Maps JS API'ni bir marta yuklash (O'zbekistonда bemalol ochiladi + mahalliy
    // manzillar to'liq). Lazy — venue modal ochilganda. ymaps.ready() bilan tayyorlikni kutamiz.
    loadYmaps() {
      return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') return reject(new Error('no window'))
        if (window.ymaps && window.ymaps.Map) return resolve(window.ymaps)
        if (!window.__ymapsLoading) {
          window.__ymapsLoading = new Promise((res, rej) => {
            const s = document.createElement('script')
            s.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'
            s.async = true
            s.onload = () => { if (window.ymaps && window.ymaps.ready) window.ymaps.ready(() => res(window.ymaps)); else rej(new Error('ymaps yo\'q')) }
            s.onerror = rej
            document.head.appendChild(s)
          })
        }
        window.__ymapsLoading.then(resolve).catch(reject)
      })
    },
    // Havoladan koordinata: Yandex (ll/pt = lng,lat) yoki Google (q = lat,lng) — tartibni aniqlaymiz
    parseLatLng(url) {
      if (!url) return null
      const s = String(url)
      const m = s.match(/(-?\d{1,3}\.\d+)[,\s]+(-?\d{1,3}\.\d+)/)
      if (!m) return null
      const a = parseFloat(m[1]); const b = parseFloat(m[2])
      if (isNaN(a) || isNaN(b)) return null
      const yandex = /yandex\./i.test(s) || /[?&](ll|pt)=/.test(s)
      return yandex ? { lat: b, lng: a } : { lat: a, lng: b }
    },
    async initVenueMap() {
      try {
        const ymaps = await this.loadYmaps()
        await this.$nextTick()
        const el = this.$refs.venueMap
        if (!el) return
        this.destroyVenueMap()
        let center = [41.311081, 69.240562] // Toshkent (default) — [lat, lng]
        let zoom = 12
        const parsed = this.parseLatLng(this.venueForm.location)
        if (parsed) { center = [parsed.lat, parsed.lng]; zoom = 16 }
        const map = new ymaps.Map(el, { center, zoom, controls: ['zoomControl', 'geolocationControl'] }, { suppressMapOpenBlock: true })
        let placemark = null
        const setPoint = (lat, lng) => {
          if (placemark) { placemark.geometry.setCoordinates([lat, lng]) }
          else { placemark = new ymaps.Placemark([lat, lng], {}, { preset: 'islands#redDotIcon', draggable: true }); map.geoObjects.add(placemark); placemark.events.add('dragend', () => { const c = placemark.geometry.getCoordinates(); this._commitPoint(c[0], c[1]) }) }
          this._commitPoint(lat, lng)
        }
        this._commitPoint = (lat, lng) => {
          this.venueForm.location = `https://yandex.uz/maps/?ll=${lng.toFixed(6)},${lat.toFixed(6)}&z=16&pt=${lng.toFixed(6)},${lat.toFixed(6)}`
          this.venueCoords = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        }
        if (parsed) setPoint(parsed.lat, parsed.lng)
        map.events.add('click', (e) => { const c = e.get('coords'); setPoint(c[0], c[1]) })
        this._venueMap = map
        this._venueSetPoint = setPoint
        if (parsed) this.venueCoords = `${parsed.lat.toFixed(5)}, ${parsed.lng.toFixed(5)}`
      } catch (_) { /* Yandex yuklanmasa — URL input qoladi */ }
    },
    // "Mening joylashuvim" — brauzer geolokatsiyasi bilan lokatsiyani belgilash.
    // 🔴 FIX (2026-09-13): ilgari natija FAQAT `this._venueMap` mavjud bo'lsa qo'llanardi —
    // xarita hali yuklanmagan (yoki tayl'lar chiqmagan) bo'lsa joylashuv JIM YO'QOLARDI
    // ("chiqmasdan turibdi"). Endi: (1) forma/koordinata HAR DOIM yangilanadi (xaritasiz ham);
    // (2) yuqori aniqlik ishlamasa past aniqlik bilan qayta urinamiz; (3) aniq xato xabari.
    async locateMe() {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        this.$toast && this.$toast.error && this.$toast.error(this.$t('finance.gap_venue_geo_denied'))
        return
      }
      if (this.locating) return
      this.locating = true
      const applyPos = (lat, lng) => {
        this.venueForm.location = `https://yandex.uz/maps/?ll=${lng.toFixed(6)},${lat.toFixed(6)}&z=16&pt=${lng.toFixed(6)},${lat.toFixed(6)}`
        this.venueCoords = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        if (this._venueMap && this._venueSetPoint) {
          try { this._venueMap.setCenter([lat, lng], 16); this._venueSetPoint(lat, lng) } catch (_) {}
        }
      }
      const geo = (opts) => new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, opts))
      try {
        let pos
        try {
          pos = await geo({ enableHighAccuracy: true, timeout: 8000, maximumAge: 0 })
        } catch (e1) {
          if (e1 && e1.code === 1) throw e1 // PERMISSION_DENIED — qayta urinmaymiz
          // Desktop'да GPS yo'q → yuqori aniqlik uzoq/ishlamasligi mumkin; past aniqlik bilan qayta.
          pos = await geo({ enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 })
        }
        applyPos(pos.coords.latitude, pos.coords.longitude)
        this.$toast && this.$toast.success && this.$toast.success(this.$t('finance.gap_venue_located') || 'Joylashuv belgilandi')
      } catch (err) {
        const denied = err && err.code === 1
        const msg = denied
          ? this.$t('finance.gap_venue_geo_denied')
          : (this.$t('finance.gap_venue_geo_unavailable') || 'Joylashuvni aniqlab bo\'lmadi — brauzer ruxsatini tekshiring')
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally {
        this.locating = false
      }
    },
    destroyVenueMap() {
      if (this._venueMap) { try { this._venueMap.destroy() } catch (_) {} this._venueMap = null }
      this._venueSetPoint = null
      this.venueCoords = ''
    },
    async saveVenue() {
      if (!this.venueRound) return
      // SS3: rejimga qarab FAQAT tegishli maydonlarni yuboramiz (partial update).
      let payload
      if (this.venueMode === 'card') {
        const card = String(this.venueForm.card_number || '').replace(/\D/g, '').slice(0, 16)
        if (!card) { this.$toast && this.$toast.error && this.$toast.error(this.$t('finance.gap_card_required') || 'Karta raqamini kiriting'); return }
        payload = { card_number: card, card_holder: String(this.venueForm.card_holder || '').trim() || null }
      } else {
        const v = String(this.venueForm.venue || '').trim()
        if (!v) return
        payload = { venue: v, location: String(this.venueForm.location || '').trim() || null }
      }
      try {
        this.busy = true
        const res = await this.$api.setGapRoundVenue(this.gapId, this.venueRound.id, payload)
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success(this.$t('finance.gap_venue_saved'))
          this.showVenue = false
          await this.load()
        }
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    // SS4: "Taklif yuborish" — saqlangan ma'lumot bo'yicha a'zolarga Telegram taklifi (avtomatik emas).
    async sendInvite(r) {
      if (!r || this.inviteBusy) return
      try {
        this.inviteBusy = r.id
        const res = await this.$api.notifyGapRound(this.gapId, r.id)
        if (res && res.data && res.data.success) {
          const n = (res.data.data && res.data.data.sent) || 0
          this.$toast && this.$toast.success && this.$toast.success((this.$t('finance.gap_invite_sent') || 'Taklif yuborildi') + (n ? ` (${n})` : ''))
        }
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.inviteBusy = null }
    },
    // SS3: karta raqamini 4talik guruhlab formatlash
    onCardInput(e) {
      const d = String(e.target.value || '').replace(/\D/g, '').slice(0, 16)
      this.venueForm.card_number = d.replace(/(.{4})/g, '$1 ').trim()
    },
    // SS3: karta raqamini nusxalash (probellarsiz)
    async copyCard(num) {
      const t = String(num || '').replace(/\s/g, '')
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(t)
        this.$toast && this.$toast.success && this.$toast.success(this.$t('finance.gap_card_copied'))
      } catch (_) { /* clipboard bloklansa jim */ }
    },
    initials(name) { if (!name) return '?'; const p = String(name).trim().split(/\s+/); return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase() },
    formatMoney(v) { return Number(v || 0).toLocaleString('uz-UZ').replace(/,/g,' ') },
    formatThousands(v) { if (v === '' || v == null) return ''; const n = Number(v); return isFinite(n) && n > 0 ? n.toLocaleString('uz-UZ').replace(/,/g,' ') : '' },
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
    // SS2: joriy davra avtomatik OCHIQ, o'tgan/kelgusi davralar YOPIQ. Joriy davra =
    // birinchi tugallanmagan (round_no bo'yicha tartibli); hammasi tugagan bo'lsa — oxirgisi.
    autoExpandCurrentRound() {
      const rounds = (this.gap && this.gap.rounds) || []
      if (!rounds.length) return
      let current = rounds.find(r => r.status !== 'completed')
      if (!current) current = rounds[rounds.length - 1]
      const exp = {}
      if (current) exp[current.id] = true
      this.expandedRounds = exp
    },
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
    /**
     * SS-2 (2026-09-19): "Bekor" tugmasi to'lov tasdiqlangandan keyin 24 soat
     * davomida ko'rinadi. 24 soatdan keyin to'lov YAKUNIY hisoblanadi va
     * tugma yashiriladi — aks holda eski davralarni ham bekor qilish mumkin edi.
     */
    canUnmark(round, p) {
      if (!p || p.status !== 'paid' || !this.canMark(round)) return false
      if (!p.paid_at) return true; // sana noma'lum — eski yozuv, bloklamaymiz
      const t = new Date(p.paid_at).getTime()
      if (isNaN(t)) return true
      return (Date.now() - t) < UNMARK_WINDOW_MS
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
    // SS-B (2026-09-18): a'zoni QO'SHIMCHA tashkilotchi qilish (faqat dastlabki tashkilotchi).
    // SS-19 (2026-09-19): native confirm() O'RNIGA markazlashgan ConfirmModal.
    askCoOrg(m, kind) { if (!this.busy) { this.confirmMember = m; this.confirmKind = kind } },
    onConfirmAccept() {
      const m = this.confirmMember
      if (!m) return
      return this.confirmKind === 'make' ? this.makeCoOrganizer(m) : this.removeCoOrganizer(m)
    },

    async makeCoOrganizer(m) {
      this.busy = true
      try {
        const res = await this.$api.setGapCoOrganizer(this.gapId, m.id)
        if (res && res.data && res.data.success) { this.confirmKind = ''; this.$toast.success('Qo\'shimcha tashkilotchi qo\'shildi'); await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busy = false }
    },
    // SS-B: qo'shimcha tashkilotchini olib tashlash (faqat dastlabki tashkilotchi).
    async removeCoOrganizer(m) {
      this.busy = true
      try {
        const res = await this.$api.removeGapCoOrganizer(this.gapId)
        if (res && res.data && res.data.success) { this.confirmKind = ''; this.$toast.success('Olib tashlandi'); await this.load() }
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
      this.settingsForm = {
        name: this.gap.name,
        frequency: this.gap.frequency || 'monthly',
        day_of_month: this.gap.day_of_month || 1,
        uniform: !!this.gap.uniform,
        amount: this.gap.amount != null ? this.gap.amount : '',
        // SS2: boshlanish sanasi (o'tgan sanadan boshlangan gap uchun) — bo'sh bo'lsa bugundan
        start_date: this.gap.start_date || ''
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
        // SS2: boshlanish sanasi to'g'ridan-to'g'ri yuboriladi (backend start_year/month'ni undan oladi)
        payload.start_date = this.settingsForm.start_date || null
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
    // SS7: to'landi belgisini BEKOR qilish — bog'langan Xarajat/Daromad ham o'chadi
    // (backend). Faqat BELGILAGAN odam bekor qila oladi (marked_by) — aks holda backend rad etadi.
    async unmarkPaid(p) {
      this.busy = true
      try {
        const res = await this.$api.unpayGap(this.gapId, p.id)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.gap_unmarked') || 'Bekor qilindi'); await this.load() }
        else { this.$toast.error((res && res.data && res.data.message) || this.$t('common.error')) }
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

<!-- SS4: xarita marker (divIcon) global stillari — Leaflet elementlari komponent scope'idan
     tashqarida yaratilgani uchun stil NON-SCOPED bo'lishi shart. -->
<style>
.venue-pin { background: transparent !important; border: none !important; }
.leaflet-container { z-index: 0; font: inherit; }
.leaflet-container a { color: #0d9488; }
</style>
