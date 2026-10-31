<template>
  <div class="gap-detail pb-10">
    <div v-if="loading" class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div></div>

    <template v-else-if="gap">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-5">
        <button class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-teal-600 hover:shadow transition" aria-label="Orqaga" @click="goBack">
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

      <GapMembersDraft v-if="gap.status === 'draft'" :gap="gap" :co-org-t="coOrgT" :busy="busy" :has-co-org="hasCoOrg" :mode-value.sync="orderMode" @add-member="openAddMember" @settings="openSettings" @move="moveMember" @ask-coorg="askCoOrg" @remove-member="removeMember" @shuffle="doShuffle" @member-amount="setMemberAmount" />

      <GapAddMemberModal v-if="showAddMember" :name-value.sync="newName" :uniform-value.sync="newUniform" :new-phone="newPhone" :new-amount="newAmount" :busy="busy" @close="showAddMember = false" @add="addMember" @amount-input="onNewAmountInput" @phone-input="onPhoneInput" />

      <GapSettingsModal v-if="showSettings" :gap="gap" :settings-form="settingsForm" :dp-lang="dpLang" :busy="busy" @close="showSettings = false" @update-field="onSettingsField" @save="saveSettings" @amount-input="onSettingsAmount" />

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
          <button class="w-full mt-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition" @click="openRestart">🔄 {{ $t('finance.gap_restart') }}</button>
        </div>

        <!-- Navbat tartibi -->
        <div class="bg-white rounded-2xl p-5 shadow-sm mb-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-gray-900">🔢 {{ $t('finance.gap_turn_order') }}</h3>
            <button :disabled="pdfBusy" class="inline-flex items-center gap-1 px-3 py-1.5 text-teal-700 bg-teal-50 hover:bg-teal-100 disabled:opacity-60 rounded-lg text-sm font-semibold transition" @click="downloadPdf">
              <span>📄</span> {{ pdfBusy ? '...' : $t('finance.gap_pdf') }}
            </button>
          </div>
          <!-- SS-B (2026-09-18): faol gapда ham qo'shimcha tashkilotchi qo'shish — chiplarda 👑+/👑− -->
          <p v-if="gap.is_primary_organizer" class="text-xs text-gray-400 mb-2">{{ $t('l10n.gap.coorg_hint') }}</p>
          <div class="flex flex-wrap gap-2">
            <div v-for="m in orderedMembers" :key="m.id" class="inline-flex items-center gap-1 pl-1.5 pr-1.5 py-1 bg-gray-50 rounded-full text-sm">
              <span class="w-5 h-5 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{{ m.turn_order }}</span>
              <span>{{ m.name }}</span>
              <span v-if="isMainOrg(m)" title="Tashkilotchi" class="flex-shrink-0">👑</span>
              <span v-else-if="isCoOrg(m)" :title="m.user_id ? $t('l10n.gap.coorg2') : coOrgT.pendingHint" class="flex-shrink-0">👑</span>
              <button v-if="gap.is_primary_organizer && !hasCoOrg && !isMainOrg(m)" :disabled="busy" class="flex-shrink-0 inline-flex items-center px-1.5 h-6 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 disabled:opacity-50 text-xs font-semibold" :title="$t('finance.gap_make_coorg')" @click.stop="askCoOrg(m, 'make')">👑+</button>
              <button v-if="gap.is_primary_organizer && isCoOrg(m)" :disabled="busy" class="flex-shrink-0 inline-flex items-center px-1.5 h-6 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 disabled:opacity-50 text-xs font-semibold" :title="$t('finance.gap_remove_coorg')" @click.stop="askCoOrg(m, 'remove')">👑−</button>
            </div>
          </div>
        </div>

        <!-- SS-3 (2026-09-19): gap qaysi Telegram guruh(lar)iga bog'langan -->
        <div class="bg-white rounded-2xl p-5 shadow-sm mb-5">
          <h3 class="font-bold text-gray-900 mb-3">💬 {{ $t('finance.gap_tg_groups') }}</h3>
          <div v-if="tgGroups.length" class="space-y-2">
            <div v-for="g in tgGroups" :key="g.id" class="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50">
              <span class="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">💬</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ g.title }}</p>
                <p v-if="g.chat_id" class="text-xs text-gray-400 truncate">ID: {{ g.chat_id }}</p>
              </div>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style="background:#DCFCE7; color:#166534;">{{ $t('finance.gap_tg_linked') }}</span>
            </div>
            <p class="text-xs text-gray-400">{{ $t('finance.gap_tg_hint') }}</p>
          </div>
          <div v-else class="text-center py-2">
            <p class="text-sm text-gray-400">{{ $t('finance.gap_tg_none') }}</p>
            <p v-if="gap.is_organizer" class="text-xs text-gray-400 mt-1">{{ $t('finance.gap_tg_howto') }}</p>
          </div>
        </div>

        <GapBirthdays :gap="gap" :my-id="myId" :bd-texts="bdTexts" :bd-count="bdCount" :bd-months="bdMonths" :birthdays="birthdays" :bd-edit="bdEdit" :bd-new="bdNew" :bd-extras="bdExtras" :bd-loading="bdLoading" :bd-syncing="bdSyncing" :bd-saving="bdSaving" :bd-adding="bdAdding" :open-value.sync="bdOpen" @sync="syncBirthdays" @add-extra="addExtra" @remove-extra="removeExtra" @save-birthday="saveBirthday" @update-edit="onBdEditField" @update-new="onBdNewField" />

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
                <button v-if="canSetVenue(r) && r.status !== 'completed'" class="text-gray-400 hover:text-teal-600 flex-shrink-0" :title="$t('common.edit')" @click.stop="openVenue(r)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
              </div>
              <button v-else-if="canSetVenue(r) && r.status !== 'completed'" class="mt-3 inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-sm font-medium transition" @click.stop="openVenue(r)">
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
                <button class="text-xs font-semibold text-teal-700 bg-teal-100 hover:bg-teal-200 px-2.5 py-1.5 rounded-lg flex-shrink-0" @click.stop="copyCard(r.card_number)">{{ $t('finance.gap_card_copy') }}</button>
                <button v-if="canSetVenue(r) && r.status !== 'completed'" class="text-gray-400 hover:text-blue-600 flex-shrink-0" :title="$t('common.edit')" @click.stop="openVenue(r, 'card')">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
              </div>
              <!-- SS3: karta kiritilmagan → 'card' rejimida oynani ochadi (xaritasiz) -->
              <button v-else-if="canSetVenue(r) && r.status !== 'completed'" class="mt-3 inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition" @click.stop="openVenue(r, 'card')">
                <span>💳</span> {{ $t('finance.gap_card_add') }}
              </button>
              <!-- SS8/SS-notice (2026-09-18): JOY bo'lsa "Taklif" (Boraman/Bora olmayman);
                   JOY/KARTA bo'lmasa ham "To'lov haqida ogohlantirish" (navbat+sana+summa) yuboriladi. -->
              <!-- SS-DEV (2026-09-24): muddati o'tgan (lekin yakunlanmagan) davrada ham
                   "To'lov haqida ogohlantirish" yuboriladi — backend uni Boraman/Bora
                   olmayman tugmalarisiz jo'natadi. Taklif (joy) faqat muddati o'tmaganda. -->
              <button v-if="canSendNotice(r)" :disabled="inviteBusy === r.id" class="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition" :class="(r.venue && !r.round_expired) ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-amber-500 hover:bg-amber-600'" @click.stop="sendInvite(r)">
                <span>{{ (r.venue && !r.round_expired) ? '📨' : '🔔' }}</span> {{ inviteBusy === r.id ? ($t('common.sending')) : ((r.venue && !r.round_expired) ? ($t('finance.gap_send_invite')) : ($t('finance.gap_send_notice'))) }}
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
                  <button v-if="canUnmark(r, p)" :disabled="busy" class="px-2 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-60 text-gray-700 rounded-lg text-xs font-medium" @click="unmarkPaid(p)">↩️ {{ $t('finance.gap_unmark') }}</button>
                  <button v-else-if="p.status !== 'paid' && canMark(r)" :disabled="busy" class="px-3 py-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-lg text-xs font-semibold" @click="markPaid(p)">{{ $t('finance.gap_mark_paid') }}</button>
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
        <button class="text-sm text-red-600 hover:text-red-700 font-medium" @click="showRemove = true">🗑 {{ $t('finance.gap_delete') }}</button>
      </div>
    </template>

    <!-- Uchrashuv joyi modali -->
    <div v-if="showVenue" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showVenue = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900">{{ venueMode === 'card' ? ('💳 ' + $t('finance.gap_card')) : ('📍 ' + $t('finance.gap_venue_title')) }}</h3>
          <button class="text-gray-400 hover:text-gray-600" aria-label="close" @click="showVenue = false"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <!-- SS2/SS3: LOCATION rejimi — manzil + xarita + lokatsiya (karta bu yerda YO'Q) -->
        <template v-if="venueMode === 'location'">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_venue_addr') }}</label>
          <input v-model="venueForm.venue" type="text" maxlength="300" :placeholder="$t('finance.gap_venue_addr_ph')" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm mb-3 outline-none focus:ring-2 focus:ring-teal-500" @keyup.enter="saveVenue" />
          <div class="flex items-center justify-between mb-1 gap-2">
            <label class="block text-sm font-semibold text-gray-700">🗺 {{ $t('finance.gap_venue_location') }} <span class="text-gray-400 font-normal text-xs">({{ $t('finance.gap_venue_optional') }})</span></label>
            <button type="button" :disabled="locating" class="inline-flex items-center gap-1 flex-shrink-0 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 disabled:opacity-60 px-2.5 py-1 rounded-lg transition" @click="locateMe">
              <svg class="w-3.5 h-3.5" :class="locating ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {{ locating ? ($t('finance.gap_venue_locating')) : $t('finance.gap_venue_locate') }}
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
            <input :value="venueForm.card_number" type="text" inputmode="numeric" maxlength="19" placeholder="8600 1234 5678 9012" class="w-full px-4 py-2.5 border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" @input="onCardInput" @keyup.enter="saveVenue" />
            <p class="text-xs text-blue-600 mt-1">{{ $t('finance.gap_card_hint') }}</p>
            <label class="block text-sm font-bold text-blue-800 mb-1 mt-3">👤 {{ $t('finance.gap_card_holder') }}</label>
            <input v-model="venueForm.card_holder" type="text" maxlength="100" :placeholder="$t('finance.gap_card_holder_ph')" class="w-full px-4 py-2.5 border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
        </template>
        <div class="flex gap-2">
          <button class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold" @click="showVenue = false">{{ $t('common.cancel') }}</button>
          <button :disabled="busy || !canSaveVenue" class="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-xl font-semibold" @click="saveVenue">{{ $t('common.save') }}</button>
        </div>
      </div>
    </div>

    <GapRemoveModal v-if="showRemove" :busy="busy" @close="showRemove = false" @remove="removeGap" />

    <GapRestartModal v-if="showRestart" :gap="gap" :restart-form="restartForm" :dp-lang="dpLang" :busy="busy" :restart-member-count="restartMemberCount" @close="showRestart = false" @update-field="onRestartField" @submit="submitRestart" @amount-input="onRestartAmount" />
  
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
import { formatNumberGrouped, initials } from '@/utils/helpers';
import GapMembersDraft from '~/components/gap/GapMembersDraft.vue'
import GapAddMemberModal from '~/components/gap/GapAddMemberModal.vue'
import GapSettingsModal from '~/components/gap/GapSettingsModal.vue'
import GapRemoveModal from '~/components/gap/GapRemoveModal.vue'
import GapRestartModal from '~/components/gap/GapRestartModal.vue'
import GapBirthdays from '~/components/gap/GapBirthdays.vue'
import { getCoOrgTexts } from '@/utils/gapTexts';
import { formatThousands } from '@/utils/gapMembers';
import { fmtIsoSliceDMY } from '@/utils/format'; // wave-1: fmtDate nusxasi umumiylashtirildi // SS-AUDIT (2026-09-25): umumiy formatlovchilar
// SS-2 (2026-09-19): to'lovni bekor qilish oynasi. Backenddagi (GapController
// `markUnpaidCore`) 24 soatlik cheklov bilan BIR XIL bo'lishi shart — aks holda
// tugma ko'rinadi-yu, server rad etadi.
import gapBirthdaysMixin from '~/mixins/gapBirthdaysMixin'
import gapVenueMixin from '~/mixins/gapVenueMixin'
import gapMembersMixin from '~/mixins/gapMembersMixin'
const UNMARK_WINDOW_MS = 24 * 3600 * 1000

export default {
  name: 'FinanceGapDetail',
  components: { GapMembersDraft, GapAddMemberModal, GapSettingsModal, GapRemoveModal, GapRestartModal, GapBirthdays },
  mixins: [gapBirthdaysMixin, gapVenueMixin, gapMembersMixin],
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
    /**
     * SS-DEV (2026-09-30) — 30.09 hujjati 7–8-rasmlar: ZeroX'da ro'yxatdan O'TMAGAN a'zo ham 2-tashkilotchi
     * bo'la oladi (backend: gaps.co_organizer_member_id). U Telegram botga o'z telefonini ulashgach,
     * guruhdagi «To'landi» tugmalari orqali to'lovni qayd etadi.
     */
    hasCoOrg() { return !!(this.gap && (this.gap.co_organizer_member_id || this.gap.co_organizer_id)) },
    coOrgT() {
      return getCoOrgTexts(this.$i18n && this.$i18n.locale)
    },
    // SS-19: tasdiqlash modali matni.
    confirmCfg() {
      const n = (this.confirmMember && this.confirmMember.name) || ''
      if (this.confirmKind === 'make') {return {
        title: this.$t('finance.gap_make_coorg'),
        // SS-DEV (2026-09-30): ro'yxatdan o'tmagan a'zo — qanday tasdiqlashi izohlanadi.
        message: this.$t('l10n.gap.make_msg', { n }) + (this.confirmMember && !this.confirmMember.user_id ? ` ${this.coOrgT.pendingHint}` : ''),
        // SS-DEV (2026-09-24): "qil" → "qilish" (foydalanuvchi talabi)
        confirmText: this.$t('l10n.gap.make_yes'), tone: 'warning', icon: '👑',
      }}
      return {
        title: this.$t('finance.gap_remove_coorg'),
        message: this.$t('l10n.gap.remove_msg', { n }),
        // SS-DEV (2026-09-24): "olib tashla" → "olib tashlash" (foydalanuvchi talabi)
        confirmText: this.$t('l10n.pdg.hide_yes'), tone: 'danger', icon: '👑',
      }
    },
    orderedMembers() {
      return (this.gap && this.gap.members ? this.gap.members.slice() : []).filter(m => m.turn_order).sort((a, b) => a.turn_order - b.turn_order)
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
      if (this.venueMode === 'card') {return !!String(this.venueForm.card_number || '').replace(/\D/g, '')}
      return !!String(this.venueForm.venue || '').trim()
    }
  },
  watch: {
    // SS5: venue modal yopilganda Leaflet xaritasini tozalaymiz (xotira/qayta-init uchun)
    showVenue(v) { if (!v) {this.destroyVenueMap()} }
  },
  beforeDestroy() { this.destroyVenueMap() },
  async mounted() { await this.load() },
  methods: {
    // child modallar props'ni o'zgartirmaydi: maydon yangilanishlari shu yerda (`$set`, avvalgi v-model bilan bir xil)
    onSettingsField(key, value) { this.$set(this.settingsForm, key, value) },
    onRestartField(key, value) { this.$set(this.restartForm, key, value) },
    onBdEditField(memberId, key, value) { this.$set(this.bdEdit[memberId], key, value) },
    onBdNewField(key, value) { this.$set(this.bdNew, key, value) },
    initials, // SS-AUDIT (2026-09-25): utils/helpers
    formatMoney: formatNumberGrouped, // SS-AUDIT (2026-09-25): utils/helpers
    formatThousands, // wave C: utils/gapMembers
    goBack() { this.$router.push(this.localePath({ name: 'finance-gap' })) },
    /**
     * 13.10 ("Shaxsiy moliya yangi sayt 12.10", 8-rasm): `silent` — amal (To'landi / Bekor) dan keyingi yangilash
     * spinner'siz: ilgari `loading=true` butun sahifani spinner bilan almashtirib, oyna TEPAGA sakrardi.
     */
    async load({ silent = false } = {}) {
      try {
        if (!silent) {this.loading = true}
        const res = await this.$api.getGap(this.gapId)
        if (res && res.data && res.data.success) {
          this.gap = res.data.data
          // silent yangilashda foydalanuvchi ochib turgan davralar saqlanadi (yopilib, sahifa siljimasin)
          if (!silent) {this.autoExpandCurrentRound()}
          this.loadBirthdays() // SS-DEV (2026-09-24): fon rejimida, asosiy yuklashni bloklamaydi
        }
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
        this.$router.push(this.localePath({ name: 'finance-gap' }))
      } finally { this.loading = false }
    },

    fmtDate(d) { return fmtIsoSliceDMY(d) },
    // Navbat jadvalini PDF qilib yuklab olish
    async downloadPdf() {
      if (this.pdfBusy) {return}
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
      if (!d) {return ''}
      const p = String(d).slice(0, 10).split('-')
      if (p.length !== 3) {return d}
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
      if (!rounds.length) {return}
      let current = rounds.find(r => r.status !== 'completed')
      if (!current) {current = rounds[rounds.length - 1]}
      const exp = {}
      if (current) {exp[current.id] = true}
      this.expandedRounds = exp
    },
    // B31-7: to'langan sana+vaqt (+5 Tashkent)
    fmtDateTime(v) {
      if (!v) {return ''}
      const d = new Date(v)
      if (isNaN(d)) {return String(v).slice(0, 16).replace('T', ' ')}
      const t = new Date(d.getTime() + 5 * 3600 * 1000).toISOString()
      return `${t.slice(8, 10)}.${t.slice(5, 7)}.${t.slice(0, 4)} ${t.slice(11, 16)}`
    },
    // Belgilash huquqi: tashkilotchi yoki shu davra qabul qiluvchisi
    canMark(round) {
      if (!this.gap) {return false}
      if (this.gap.is_organizer) {return true}
      const rec = this.gap.members.find(m => m.id === round.recipient_member_id)
      return !!(rec && rec.user_id === this.myId)
    },
    /**
     * SS-2 (2026-09-19): "Bekor" tugmasi to'lov tasdiqlangandan keyin 24 soat
     * davomida ko'rinadi. 24 soatdan keyin to'lov YAKUNIY hisoblanadi va
     * tugma yashiriladi — aks holda eski davralarni ham bekor qilish mumkin edi.
     */
    canUnmark(round, p) {
      if (!p || p.status !== 'paid' || !this.canMark(round)) {return false}
      if (!p.paid_at) {return true;} // sana noma'lum — eski yozuv, bloklamaymiz
      const t = new Date(p.paid_at).getTime()
      if (isNaN(t)) {return true}
      return (Date.now() - t) < UNMARK_WINDOW_MS
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
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.gap_paid')); await this.load({ silent: true }) }
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
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.gap_unmarked')); await this.load({ silent: true }) }
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
