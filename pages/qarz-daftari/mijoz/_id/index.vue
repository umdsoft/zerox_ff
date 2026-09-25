<template>
  <div class="pb-8">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <svg class="w-10 h-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>

    <!-- Error -->
    <div v-else-if="loadError" class="flex items-center justify-center py-20">
      <div class="text-center max-w-md">
        <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">{{ texts.errorTitle }}</h2>
        <button @click="goBack" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm">{{ texts.back }}</button>
      </div>
    </div>

    <!-- SS19 (2026-09-21): sun'iy `max-w-2xl mx-auto` cheklovi OLIB TASHLANDI.
         Sabab: bu sahifa mobil ilova skrinshotidan ko'chirilgan edi — keng
         monitorda kontent chap chekkada siqilib, o'ng tomoni bo'sh qolardi.
         Endi sahifa layout kengligidan to'liq foydalanadi (sayt dizayni). -->
    <div v-else-if="data">
      <!-- Header: orqaga + sarlavha (mobil ilovadagi "Qarz oluvchi" ekrani) -->
      <div class="flex items-center gap-3 mb-5">
        <button @click="goBack" class="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 shadow-sm transition-colors" :title="texts.back">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <!-- SS19: desktopda sarlavha sayt uslubida kattaroq (lg:text-3xl) -->
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{{ isOlish ? texts.qarzBeruvchi : texts.qarzOluvchi }}</h1>
      </div>

      <!-- SS-DEV (2026-09-26), 25.09 "Xatolar" 5→6-rasm (12-band): SAHIFA QAYTA DIZAYN QILINDI —
           Shaxsiy qarz kontragent guruh sahifasi (finance/debts/group/_key) uslubida:
           tepada avatar (bosh harflar, rangli doira) + FISh (tahrir qalamchasi) + telefon +
           "Berilgan qarz/Olingan qarz" badge; O'NG tomonda tugmalar BIR QATORDA pastel uslubda —
           "➕ Yangi qarz" (och ko'k), "✅ Qarzni yopish" (och yashil), "⏰ Qaytarishni talab qilish"
           (och sariq), "🚫 Qarzdan voz kechish" (och qizil); ostida 4 stat kartasi (Umumiy summa,
           Undirilgan/To'langan, Qolgan, Jarayon %) + progress chiziq; keyin "Qarz sanasi" va
           "Qaytarish muddati"; "Amaliyotlar tarixi" tugmasi saqlandi; pastda "Tavsiya" bloki
           (GET /qarz-daftari/mijozlar/:id/tavsiya). Bo'lib to'lash jadvali, yopish/talab/voz kechish
           oynalari va barcha funksiyalar O'ZGARMADI. ⚠️ Tailwind 2.2 (JIT o'chiq): faqat core klasslar. -->
      <div class="bg-white rounded-2xl shadow-sm p-5 mb-4">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <!-- Avatar + FISh + telefon + badge'lar -->
          <div class="flex items-center min-w-0 gap-4">
            <span :class="['w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold', isOlish ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700']">{{ initials }}</span>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 min-w-0">
                <h2 class="text-xl lg:text-2xl font-bold text-gray-900 truncate min-w-0">{{ data.mijoz.fish }}</h2>
                <!-- Tahrirlash — FISh yonida, bosilganda blur'li markaziy modal ochiladi -->
                <button
                  type="button"
                  @click="openEdit"
                  :title="texts.editTitle"
                  class="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                </button>
              </div>
              <!-- SS19 / VAZIFA 2 (2026-09-21): telefon yonida SMS/qo'ng'iroq tugmalari YO'Q — faqat matn -->
              <p class="text-sm text-gray-500 truncate">{{ data.mijoz.telefon || texts.noPhone }}</p>
              <div class="mt-1.5 flex items-center gap-1.5 flex-wrap">
                <span :class="['inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full', isOlish ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700']">{{ isOlish ? texts.olinganQarz : texts.berilganQarz }}</span>
                <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', hasActive ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600']">
                  <span :class="['w-1.5 h-1.5 rounded-full', hasActive ? 'bg-amber-500' : 'bg-gray-400']"></span>
                  {{ hasActive ? texts.active : texts.allClosed }}
                </span>
                <!-- Do'kon (savdo faoliyati) nomi -->
                <span v-if="dokonNomi" class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style="background:#EEF2FF; color:#3730A3;" :title="texts.storeLabel">🏪 {{ dokonNomi }}</span>
              </div>
            </div>
          </div>

          <!-- Amal tugmalari — bir qatorda, pastel (group/_key uslubi). Funksiyalar avvalgidek. -->
          <div class="flex flex-wrap gap-2 flex-shrink-0">
            <!-- Yangi qarz (och ko'k) -->
            <nuxt-link
              :to="newDebtUrl"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6"/></svg>
              {{ texts.newDebtShort }}
            </nuxt-link>

            <!-- Qarzni yopish / qaytarish (och yashil) — TEPADA, shu qatorda -->
            <nuxt-link
              v-if="hasActive && lastActiveQarz"
              :to="localePath({ name: 'qarz-daftari-qarz-id-yopish', params: { id: lastActiveQarz.id } })"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
              {{ isOlish ? texts.repay : texts.closeDebt }}
            </nuxt-link>
            <button
              v-else
              type="button"
              disabled
              :title="texts.noActiveDebts"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
              {{ isOlish ? texts.repay : texts.closeDebt }}
            </button>

            <!-- Faqat BERISH uchun: talab qilish (och sariq) + voz kechish (och qizil) -->
            <template v-if="!isOlish">
              <!-- Tailwind 2.2 (JIT o'chiq) `disabled:` variantini generatsiya QILMAYDI — :class orqali -->
              <button
                type="button"
                @click="talabQilish()"
                :disabled="talabDisabled"
                :class="[
                  'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                  talabDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100',
                ]"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.9" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ talabLoading ? texts.sending : texts.demand }}
              </button>
              <nuxt-link
                v-if="hasActive && lastActiveQarz"
                :to="localePath({ name: 'qarz-daftari-qarz-id-voz-kechish', params: { id: lastActiveQarz.id } })"
                class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                {{ texts.forgive }}
              </nuxt-link>
              <button
                v-else
                type="button"
                disabled
                :title="texts.noActiveDebts"
                class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                {{ texts.forgive }}
              </button>
            </template>
          </div>
        </div>

        <!-- 4 ta stat kartasi: Umumiy summa | Undirilgan (To'langan) | Qolgan | Jarayon % -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">{{ texts.umumiySumma }}</p>
            <p v-for="c in statLines" :key="'t' + c.cur" class="text-lg font-bold text-gray-900 leading-tight mt-0.5">{{ formatMoney(c.total) }} <span class="text-xs font-normal text-gray-400">{{ c.cur }}</span></p>
          </div>
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">{{ isOlish ? texts.qaytarilganQarz : texts.undirilganQarz }}</p>
            <p v-for="c in statLines" :key="'p' + c.cur" class="text-lg font-bold text-green-600 leading-tight mt-0.5">{{ formatMoney(c.paid) }} <span class="text-xs font-normal text-gray-400">{{ c.cur }}</span></p>
          </div>
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">{{ texts.qolgan }}</p>
            <p v-for="c in statLines" :key="'r' + c.cur" class="text-lg font-bold text-blue-600 leading-tight mt-0.5">{{ formatMoney(c.left) }} <span class="text-xs font-normal text-gray-400">{{ c.cur }}</span></p>
          </div>
          <div class="rounded-xl bg-gray-50 p-4">
            <p class="text-xs text-gray-500">{{ texts.jarayon }}</p>
            <p class="text-lg font-bold text-gray-900 leading-tight mt-0.5">{{ progressPct }}%</p>
          </div>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
          <div class="h-2 rounded-full bg-gray-500 transition-all" :style="{ width: progressPct + '%' }"></div>
        </div>

        <!-- Sanalar -->
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p class="text-xs text-gray-500">{{ texts.qarzSanasi }}</p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ formatDate(lastBerilganSana) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">{{ texts.lastReturnDate }}</p>
            <p v-if="lastQaytarishSanasi" class="text-sm font-semibold text-gray-900 mt-0.5">{{ formatDate(lastQaytarishSanasi) }}</p>
            <p v-else-if="lastBolibTolash" class="text-sm font-semibold text-purple-600 mt-0.5">{{ texts.installment }}: {{ lastBolibTolash.oylar_soni }} {{ texts.month }}</p>
            <p v-else class="text-sm font-semibold text-gray-300 mt-0.5">&mdash;</p>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ hasActive ? texts.actionsApplyTo : texts.noActiveDebts }}
        </p>
      </div>

      <!-- Amaliyotlar tarixi havolasi (saqlandi).
           SS7: "Kvitansiya" tugmasi bu yerdan OLIB TASHLANGAN — kvitansiya har bir
           amaliyotning O'Z tafsilot sahifasida (qarz-daftari/tranzaksiya/_id). -->
      <div class="mb-4">
        <nuxt-link
          :to="localePath({ name: 'qarz-daftari-mijoz-id-amaliyotlar', params: { id: data.mijoz.id } }) + (turi ? '?turi=' + turi : '')"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold text-sm transition-colors shadow-sm"
        >
          <svg class="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5M16.5 3L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
          </svg>
          {{ texts.history }}
        </nuxt-link>
      </div>

      <!-- SS-DEV (2026-09-26), 12-band: TAVSIYA bloki (6-rasm pastki qismi) —
           GET /qarz-daftari/mijozlar/:id/tavsiya → { level: good|warn|bad|new, on_time, late, total, avg_delay_days } -->
      <div v-if="tavsiya" class="bg-white rounded-2xl shadow-sm p-5 mb-4">
        <h3 class="font-bold text-gray-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ texts.tavsiya }}
        </h3>
        <div class="mt-3 rounded-xl px-4 py-3 flex items-start gap-3" :style="tavsiyaView.style">
          <span class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :style="tavsiyaView.iconStyle">
            <svg v-if="tavsiya.level === 'good'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
            <svg v-else-if="tavsiya.level === 'new'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </span>
          <div class="min-w-0">
            <p class="font-bold text-sm" :style="'color:' + tavsiyaView.color">{{ tavsiyaView.title }}</p>
            <p class="text-sm text-gray-700 mt-0.5">
              {{ tavsiyaView.text }}
              <span v-if="tavsiya.level !== 'new' && tavsiya.total" class="text-gray-400">({{ tavsiya.on_time }}/{{ tavsiya.total }} {{ texts.onTime }})</span>
              <span v-if="tavsiya.level !== 'new' && Number(tavsiya.avg_delay_days) > 0" class="text-gray-400"> · {{ texts.avgDelay }}: {{ Math.round(Number(tavsiya.avg_delay_days)) }} {{ texts.days }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Bo'lib to'lash jadvallari — BARCHA bo'lib to'lash qarzlar uchun.
           SS19: jadval keng bo'lgani uchun 2 ustunli griddan TASHQARIDA, sahifaning
           to'liq kengligida ko'rsatiladi. -->
      <div v-for="bt in bolibTolashList" :key="'bt-' + bt.qarz_id" class="bg-white rounded-2xl shadow-sm p-5 mt-4">
        <h3 class="font-bold text-gray-900 mb-1">{{ texts.installmentTable }}</h3>
        <p class="text-xs text-gray-500 mb-4">{{ formatMoney(bt.miqdor) }} {{ bt.valyuta }} &mdash; {{ formatDate(bt.berilgan_sana) }}<span v-if="bt.mahsulot_nomi"> &middot; {{ bt.mahsulot_nomi }}</span></p>
        <QarzDaftariBolibTolashJadval :tolovlar="bt.tolovlar" :valyuta="bt.valyuta" @tolandi="onTolandi" />
      </div>
    </div>

    <!-- SS-DEV (2026-09-24): PLASTIK KARTA kiritish oynasi (5-rasm) — "Qaytarishni talab qilish"
         bosilganda do'konda ham, egasida ham karta bo'lmasa backend `428 no-card` qaytaradi;
         karta shu yerda kiritiladi → do'konga (savdo_faoliyat.karta_raqami) saqlanadi → talab
         SMS karta bilan ketadi. Format: "8600 1234 1234 1234" (16 raqam). -->
    <div
      v-if="showCard"
      class="fixed inset-0 flex items-center justify-center p-4"
      style="z-index: 100; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)"
      @click.self="closeCard"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-900">{{ texts.cardTitle }}</h3>
          <button type="button" @click="closeCard" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <!-- SS-DEV (2026-09-24), hujjat-4 3-band (4-rasm): do'kon rekvizitlari sahifasi
             (`faoliyat/_id/karta.vue`) bilan BIR XIL ko'rinish — "Karta raqami" + "Karta egasi (FISh)",
             pastida kulrang izoh, tugmalar O'NGDA (kulrang "Bekor qilish", ko'k "Saqlash"). -->
        <form @submit.prevent="submitCard" class="px-6 py-5" novalidate>
          <p class="text-xs text-gray-500 mb-4 leading-relaxed">{{ texts.cardHint }}</p>
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <label class="block text-xs font-semibold text-gray-600 mb-1">{{ texts.cardLabel }}</label>
            <input
              :value="cardDisplay"
              @input="onCardInput"
              type="text"
              inputmode="numeric"
              autocomplete="cc-number"
              maxlength="19"
              placeholder="8600 1234 5678 9012"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label class="block text-xs font-semibold text-gray-600 mb-1 mt-3">{{ texts.cardHolder }}</label>
            <input
              v-model="cardHolder"
              type="text"
              maxlength="100"
              :placeholder="texts.cardHolderPh"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p v-if="cardTouched && !cardValid" class="text-xs text-red-500 mt-2 leading-snug">{{ texts.cardInvalid }}</p>
            <p v-else class="text-xs text-gray-400 mt-2 leading-snug">{{ texts.cardRule }}</p>
            <div class="flex justify-end gap-2 mt-3">
              <button type="button" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200" @click="closeCard">{{ texts.cancel }}</button>
              <button
                type="submit"
                class="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                :style="(talabLoading || !cardValid) ? 'opacity:0.5;cursor:not-allowed' : ''"
                :disabled="talabLoading || !cardValid"
              >{{ talabLoading ? texts.sending : texts.cardSend }}</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Qarz oluvchi (mijoz) ma'lumotlarini tahrirlash modali.
         Orqa fon BLUR — Tailwind v2.2 da backdrop-filter utiliti yo'q, shuning
         uchun inline style ishlatiladi (arbitrary klasslar ham inert). -->
    <div
      v-if="showEdit"
      class="fixed inset-0 flex items-center justify-center p-4"
      style="z-index: 100; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)"
      @click.self="closeEdit"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-900">{{ texts.editTitle }}</h3>
          <button type="button" @click="closeEdit" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form @submit.prevent="saveEdit" class="px-6 py-5 space-y-4" novalidate>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.fishLabel }}</label>
            <input
              v-model="editForm.fish"
              type="text"
              maxlength="200"
              :placeholder="texts.fishPlaceholder"
              class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.phoneLabel }}</label>
            <input
              v-model="editForm.telefon"
              type="tel"
              :placeholder="texts.phonePlaceholder"
              class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="closeEdit" class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              {{ texts.cancel }}
            </button>
            <!-- ⚠️ Tailwind 2.2 (JIT o'chiq) `disabled:` variantini generatsiya qilmaydi -->
            <button
              type="submit"
              :disabled="editDisabled"
              :class="[
                'px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors',
                editDisabled ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700',
              ]"
            >
              {{ editLoading ? texts.saving : texts.save }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { fmtDMY, formatMoney } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
export default {
  middleware: 'auth',
  data() {
    return {
      data: null, loading: true, loadError: false, talabLoading: false, previousRouteName: null, bolibTolashList: [],
      tavsiya: null, // SS-DEV (2026-09-26), 12-band: mijoz tavsiyasi (API)
      // Qarz oluvchi (mijoz) ma'lumotlarini tahrirlash modali
      showEdit: false, editForm: { fish: '', telefon: '' }, editLoading: false,
      // SS-DEV (2026-09-24): karta kiritish oynasi (talab qilish uchun)
      showCard: false, cardDigits: '', cardTouched: false, cardHolder: '', // SS-DEV (2026-09-24): + karta egasi
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => { vm.previousRouteName = from?.name || null; });
  },
  computed: {
    turi() { return this.$route.query?.turi || ''; },
    avatarColor() {
      const t = this.currentTuri;
      if (t === 'berish') return 'bg-gradient-to-br from-blue-500 to-blue-600';
      if (t === 'olish') return 'bg-gradient-to-br from-green-500 to-green-600';
      return 'bg-gradient-to-br from-gray-500 to-gray-600';
    },
    primaryTuri() {
      if (!this.data?.qarzlar?.length) return null;
      const counts = { berish: 0, olish: 0 };
      this.data.qarzlar.forEach(q => { counts[q.turi] = (counts[q.turi] || 0) + 1; });
      return counts.berish >= counts.olish ? 'berish' : 'olish';
    },
    /** Sahifa ko'rsatadigan qarzlar — `?turi=` query bo'lsa shu bo'yicha filter, aks holda hammasi */
    scopedQarzlar() {
      const all = this.data?.qarzlar || [];
      if (this.turi === 'berish' || this.turi === 'olish') {
        return all.filter(q => q.turi === this.turi);
      }
      return all;
    },
    activeQarzlar() {
      return this.scopedQarzlar.filter(q => q.status === 'aktiv');
    },
    hasActive() { return this.activeQarzlar.length > 0; },
    lastActiveQarz() {
      if (!this.activeQarzlar.length) return null;
      return this.activeQarzlar[0];
    },
    /** Ekranni boshqaruvchi turi: query → lastActiveQarz → primaryTuri */
    currentTuri() {
      return this.turi || this.lastActiveQarz?.turi || this.primaryTuri || 'berish';
    },
    isOlish() { return this.currentTuri === 'olish'; },
    jamiQarzUzs() {
      // Jami qarz = QOLDIQ summasi (qaytarilgan/voz kechilgan chegirilgan), miqdor emas.
      return this.scopedQarzlar.reduce((s, q) => q.valyuta === 'UZS' ? s + (Number(q.qoldiq) || 0) : s, 0);
    },
    jamiQarzUsd() {
      return this.scopedQarzlar.reduce((s, q) => q.valyuta === 'USD' ? s + (Number(q.qoldiq) || 0) : s, 0);
    },
    lastBerilganSana() {
      return this.lastActiveQarz?.berilgan_sana || this.data?.qarzlar?.[0]?.berilgan_sana || null;
    },
    lastQaytarishSanasi() {
      return this.lastActiveQarz?.qaytarish_sanasi || null;
    },
    lastBolibTolash() {
      if (this.bolibTolashList.length) return this.bolibTolashList[0];
      const q = this.lastActiveQarz;
      return (q && (Number(q.bolib_tolash) === 1 || Number(q.oylar_soni) > 0)) ? q : null;
    },
    totalLabel() {
      const parts = [];
      if (this.jamiQarzUzs > 0) parts.push(this.formatMoney(this.jamiQarzUzs) + ' UZS');
      if (this.jamiQarzUsd > 0) parts.push(this.formatMoney(this.jamiQarzUsd) + ' USD');
      return parts.join(' • ');
    },
    /** Tahrirlash modalidagi "Saqlash" tugmasi o'chiq bo'ladimi */
    editDisabled() {
      return this.editLoading || !String(this.editForm.fish || '').trim();
    },
    /** SS-DEV (2026-09-24): karta "8600 1234 1234 1234" ko'rinishida */
    cardDisplay() {
      return String(this.cardDigits || '').replace(/(\d{4})(?=\d)/g, '$1 ');
    },
    cardValid() {
      return /^\d{16}$/.test(String(this.cardDigits || ''));
    },
    /** "Qaytarishni talab qilish" tugmasi o'chiq bo'ladimi */
    talabDisabled() {
      return this.talabLoading || !this.hasActive || !this.lastActiveQarz;
    },
    /** SS-DEV (2026-09-26): avatar uchun bosh harflar (FISh dan 2 ta) */
    initials() {
      const n = String(this.data?.mijoz?.fish || '').trim();
      if (!n) return '?';
      return n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    },
    /** SS-DEV (2026-09-26): valyuta bo'yicha Umumiy (qoldiq + undirilgan) / Undirilgan / Qolgan */
    statLines() {
      const s = this.statsBox;
      const rows = [
        { cur: 'UZS', paid: s.undirilganUzs, left: s.qoldiqUzs },
        { cur: 'USD', paid: s.undirilganUsd, left: s.qoldiqUsd },
      ].map((r) => ({ ...r, total: r.paid + r.left }));
      const nonZero = rows.filter((r) => r.total > 0);
      return nonZero.length ? nonZero : [rows[0]];
    },
    /** Jarayon foizi — asosiy valyuta (UZS bo'lsa UZS, aks holda USD) bo'yicha */
    progressPct() {
      const r = this.statLines[0];
      if (!r || !r.total) return 0;
      return Math.max(0, Math.min(100, Math.round((r.paid / r.total) * 100)));
    },
    /** SS-DEV (2026-09-26): tavsiya darajasi → matn va ranglar */
    tavsiyaView() {
      const t = this.texts;
      const lv = (this.tavsiya && this.tavsiya.level) || 'new';
      const map = {
        good: { title: t.tvGoodTitle, text: t.tvGoodText, color: '#15803D', style: 'background:#ECFDF5', iconStyle: 'background:#D1FAE5;color:#047857' },
        warn: { title: t.tvWarnTitle, text: t.tvWarnText, color: '#B45309', style: 'background:#FFFBEB', iconStyle: 'background:#FEF3C7;color:#B45309' },
        bad: { title: t.tvBadTitle, text: t.tvBadText, color: '#B91C1C', style: 'background:#FEF2F2', iconStyle: 'background:#FEE2E2;color:#B91C1C' },
        new: { title: t.tvNewTitle, text: t.tvNewText, color: '#4338CA', style: 'background:#EEF2FF', iconStyle: 'background:#E0E7FF;color:#4338CA' },
      };
      return map[lv] || map.new;
    },
    /** Do'kon (savdo faoliyati) nomi — backend history javobida beriladi */
    dokonNomi() {
      return this.data?.mijoz?.savdoFaoliyat?.nomi || '';
    },
    /**
     * Mobil ilovadagi 2 ta katak: "Qoldiq qarz" va "Undirilgan qarz".
     * Backend `history` javobidagi tayyor stats ishlatiladi — u yerda voz
     * kechilgan summa undirilgandan allaqachon ayrilgan (kechirilgan qarz
     * "undirilgan" bo'lib ko'rinmasligi uchun).
     */
    statsBox() {
      const s = this.data?.stats || {};
      const k = this.isOlish ? 'olingan' : 'berilgan';
      const qoldiq = s['qoldiq_' + k] || {};
      const undirilgan = s['undirilgan_' + k] || {};
      return {
        qoldiqUzs: Number(qoldiq.uzs) || 0,
        qoldiqUsd: Number(qoldiq.usd) || 0,
        undirilganUzs: Number(undirilgan.uzs) || 0,
        undirilganUsd: Number(undirilgan.usd) || 0,
      };
    },
    newDebtUrl() {
      if (!this.data?.mijoz?.savdo_faoliyat_id) return '#';
      // currentTuri ishlatamiz — badge va Yangi qarz tugma rangi bilan mos
      const t = this.currentTuri || 'berish';
      const name = t === 'berish' ? 'qarz-daftari-faoliyat-id-berish-yangi' : 'qarz-daftari-faoliyat-id-olish-yangi';
      return this.localePath({ name, params: { id: this.data.mijoz.savdo_faoliyat_id } }) + `?mijoz_id=${this.data.mijoz.id}`;
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: "Qarz tafsiloti", back: "Orqaga", history: "Amaliyotlar tarixi", receipt: "Kvitansiya",
          jamiQarz: "Jami qarz",
          lastDateBerish: "Berilgan sana", lastDateOlish: "Olingan sana", lastReturnDate: "Qaytarish sanasi",
          installment: "Bo'lib to'lash", month: "oy",
          installmentTable: "Bo'lib to'lash jadvali",
          actions: "Amallar",
          demand: "Qaytarishni talab qilish", sending: "Yuborilmoqda...",
          cardTitle: "Plastik karta raqami", cardLabel: "Karta raqami",
          cardHint: "Talab SMS'ida qarz oluvchiga pul o'tkazish uchun do'kon kartasi ko'rsatiladi. Karta do'kon ma'lumotlariga saqlanadi.",
          cardHolder: "Karta egasi (FISh)", cardHolderPh: "Ism Familiya", // SS-DEV (2026-09-24): 4-rasm
          cardRule: "16 ta raqam. Faqat O'zbekiston kartasi (Uzcard / Humo).",
          cardInvalid: "Karta raqami 16 ta raqamdan iborat bo'lishi kerak", cardSend: "Saqlash",
          cardOwnerOnly: "Do'kon egasi plastik karta raqamini kiritishi kerak.",
          closeDebt: "Qarzni yopish", forgive: "Qarzdan voz kechish",
          repay: "Qarzni qaytarish",
          active: "Aktiv", allClosed: "Barchasi yopilgan", noActiveDebts: "Aktiv qarzlar yo'q",
          newDebt: "Yangi qarz qo'shish", newDebtShort: "Yangi qarz",
          qoldiqQarz: "Qoldiq qarz", undirilganQarz: "Undirilgan qarz", qaytarilganQarz: "Qaytarilgan qarz",
          // SS19 (2026-09-21): smsTitle/callTitle OLIB TASHLANDI — sayt orqali SMS/qo'ng'iroq yo'q.
          noPhone: "Telefon raqami kiritilmagan", storeLabel: "Do'kon",
          actionsApplyTo: "Eng oxirgi aktiv qarzga qo'llanadi",
          qarzOluvchi: "Qarz oluvchi", qarzBeruvchi: "Qarz beruvchi",
          errorTitle: "Mijoz topilmadi yoki kirish ruxsati yo'q",
          editTitle: "Qarz oluvchi ma'lumotlarini tahrirlash",
          fishLabel: "F.I.O", fishPlaceholder: "Familiya Ism Sharif",
          phoneLabel: "Telefon raqami", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Bekor qilish", save: "Saqlash", saving: "Saqlanmoqda...",
          fishRequired: "F.I.O kiritilishi shart",
          fishTooLong: "F.I.O 200 belgidan oshmasligi kerak",
          phoneInvalid: "Telefon formati noto'g'ri (+998XXXXXXXXX)",
          saved: "Ma'lumotlar yangilandi",
          saveError: "Saqlashda xatolik yuz berdi",
          // SS-DEV (2026-09-26), 12-band: yangi dizayn + tavsiya
          berilganQarz: "Berilgan qarz", olinganQarz: "Olingan qarz",
          umumiySumma: "Umumiy summa", qolgan: "Qolgan", jarayon: "Jarayon", qarzSanasi: "Qarz sanasi",
          tavsiya: "Tavsiya", onTime: "o'z vaqtida", avgDelay: "o'rtacha kechikish", days: "kun",
          tvGoodTitle: "Ishonchli mijoz", tvGoodText: "Qarzlarini o'z vaqtida qaytargan.",
          tvWarnTitle: "Ehtiyot bo'ling", tvWarnText: "Ba'zan kechiktirgan.",
          tvBadTitle: "Ehtiyot bo'ling", tvBadText: "Qarzlarini ko'pincha kechiktirib qaytargan.",
          tvNewTitle: "Yangi mijoz", tvNewText: "Tarix yo'q.",
        },
        ru: {
          title: "Детали долга", back: "Назад", history: "История операций", receipt: "Квитанция",
          jamiQarz: "Общий долг",
          lastDateBerish: "Дата выдачи", lastDateOlish: "Дата получения", lastReturnDate: "Дата возврата",
          installment: "Рассрочка", month: "мес",
          installmentTable: "График рассрочки",
          actions: "Действия",
          demand: "Потребовать возврат", sending: "Отправка...",
          cardTitle: "Номер пластиковой карты", cardLabel: "Номер карты",
          cardHint: "В SMS-требовании должнику будет указана карта магазина для перевода. Карта сохранится в данных магазина.",
          cardHolder: "Владелец карты (ФИО)", cardHolderPh: "Имя Фамилия",
          cardRule: "16 цифр. Только карты Узбекистана (Uzcard / Humo).",
          cardInvalid: "Номер карты должен содержать 16 цифр", cardSend: "Сохранить",
          cardOwnerOnly: "Номер карты должен ввести владелец магазина.",
          closeDebt: "Закрыть долг", forgive: "Простить долг",
          repay: "Вернуть долг",
          active: "Активный", allClosed: "Все закрыты", noActiveDebts: "Нет активных долгов",
          newDebt: "Добавить новый долг", newDebtShort: "Новый долг",
          qoldiqQarz: "Остаток долга", undirilganQarz: "Взысканный долг", qaytarilganQarz: "Возвращённый долг",
          // SS19 (2026-09-21): smsTitle/callTitle OLIB TASHLANDI — sayt orqali SMS/qo'ng'iroq yo'q.
          noPhone: "Номер телефона не указан", storeLabel: "Магазин",
          actionsApplyTo: "Применяется к последнему активному долгу",
          qarzOluvchi: "Должник", qarzBeruvchi: "Кредитор",
          errorTitle: "Клиент не найден или нет доступа",
          editTitle: "Редактировать данные должника",
          fishLabel: "Ф.И.О", fishPlaceholder: "Фамилия Имя Отчество",
          phoneLabel: "Номер телефона", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Отмена", save: "Сохранить", saving: "Сохранение...",
          fishRequired: "Ф.И.О обязательно",
          fishTooLong: "Ф.И.О не должно превышать 200 символов",
          phoneInvalid: "Неверный формат телефона (+998XXXXXXXXX)",
          saved: "Данные обновлены",
          saveError: "Ошибка при сохранении",
          berilganQarz: "Выданный долг", olinganQarz: "Полученный долг",
          umumiySumma: "Общая сумма", qolgan: "Остаток", jarayon: "Прогресс", qarzSanasi: "Дата долга",
          tavsiya: "Рекомендация", onTime: "вовремя", avgDelay: "средняя задержка", days: "дн.",
          tvGoodTitle: "Надёжный клиент", tvGoodText: "Возвращал долги вовремя.",
          tvWarnTitle: "Будьте осторожны", tvWarnText: "Иногда задерживал.",
          tvBadTitle: "Будьте осторожны", tvBadText: "Часто возвращал долги с задержкой.",
          tvNewTitle: "Новый клиент", tvNewText: "Истории нет.",
        },
        kr: {
          title: "Қарз тафсилоти", back: "Орқага", history: "Амалиётлар тарихи", receipt: "Квитансия",
          jamiQarz: "Жами қарз",
          lastDateBerish: "Берилган сана", lastDateOlish: "Олинган сана", lastReturnDate: "Қайтариш санаси",
          installment: "Бўлиб тўлаш", month: "ой",
          installmentTable: "Бўлиб тўлаш жадвали",
          actions: "Амаллар",
          demand: "Қайтаришни талаб қилиш", sending: "Юборилмоқда...",
          cardTitle: "Пластик карта рақами", cardLabel: "Карта рақами",
          cardHint: "Талаб SMS'ида қарз олувчига пул ўтказиш учун дўкон картаси кўрсатилади. Карта дўкон маълумотларига сақланади.",
          cardHolder: "Карта эгаси (ФИШ)", cardHolderPh: "Исм Фамилия",
          cardRule: "16 та рақам. Фақат Ўзбекистон картаси (Uzcard / Humo).",
          cardInvalid: "Карта рақами 16 та рақамдан иборат бўлиши керак", cardSend: "Сақлаш",
          cardOwnerOnly: "Дўкон эгаси пластик карта рақамини киритиши керак.",
          closeDebt: "Қарзни ёпиш", forgive: "Қарздан воз кечиш",
          repay: "Қарзни қайтариш",
          active: "Актив", allClosed: "Барчаси ёпилган", noActiveDebts: "Актив қарзлар йўқ",
          newDebt: "Янги қарз қўшиш", newDebtShort: "Янги қарз",
          qoldiqQarz: "Қолдиқ қарз", undirilganQarz: "Ундирилган қарз", qaytarilganQarz: "Қайтарилган қарз",
          // SS19 (2026-09-21): smsTitle/callTitle OLIB TASHLANDI — sayt orqali SMS/qo'ng'iroq yo'q.
          noPhone: "Телефон рақами киритилмаган", storeLabel: "Дўкон",
          actionsApplyTo: "Энг охирги актив қарзга қўлланади",
          qarzOluvchi: "Қарз олувчи", qarzBeruvchi: "Қарз берувчи",
          errorTitle: "Мижоз топилмади ёки рухсат йўқ",
          editTitle: "Қарз олувчи маълумотларини таҳрирлаш",
          fishLabel: "Ф.И.О", fishPlaceholder: "Фамилия Исм Шариф",
          phoneLabel: "Телефон рақами", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Бекор қилиш", save: "Сақлаш", saving: "Сақланмоқда...",
          fishRequired: "Ф.И.О киритилиши шарт",
          fishTooLong: "Ф.И.О 200 белгидан ошмаслиги керак",
          phoneInvalid: "Телефон формати нотўғри (+998XXXXXXXXX)",
          saved: "Маълумотлар янгиланди",
          saveError: "Сақлашда хатолик юз берди",
          berilganQarz: "Берилган қарз", olinganQarz: "Олинган қарз",
          umumiySumma: "Умумий сумма", qolgan: "Қолган", jarayon: "Жараён", qarzSanasi: "Қарз санаси",
          tavsiya: "Тавсия", onTime: "ўз вақтида", avgDelay: "ўртача кечикиш", days: "кун",
          tvGoodTitle: "Ишончли мижоз", tvGoodText: "Қарзларини ўз вақтида қайтарган.",
          tvWarnTitle: "Эҳтиёт бўлинг", tvWarnText: "Баъзан кечиктирган.",
          tvBadTitle: "Эҳтиёт бўлинг", tvBadText: "Қарзларини кўпинча кечиктириб қайтарган.",
          tvNewTitle: "Янги мижоз", tvNewText: "Тарих йўқ.",
        },
        // SS-DEV (2026-09-26): en/kaa
        en: {
          title: "Debt details", back: "Back", history: "Transaction history", receipt: "Receipt",
          jamiQarz: "Total debt",
          lastDateBerish: "Date given", lastDateOlish: "Date received", lastReturnDate: "Repayment date",
          installment: "Instalments", month: "months",
          installmentTable: "Instalment schedule",
          actions: "Actions",
          demand: "Demand repayment", sending: "Sending...",
          cardTitle: "Bank card number", cardLabel: "Card number",
          cardHint: "The shop card is shown in the demand SMS so the borrower can transfer money. The card is saved to the shop details.",
          cardHolder: "Card holder (full name)", cardHolderPh: "First name Last name",
          cardRule: "16 digits. Uzbekistan cards only (Uzcard / Humo).",
          cardInvalid: "The card number must consist of 16 digits", cardSend: "Save",
          cardOwnerOnly: "The shop owner must enter the bank card number.",
          closeDebt: "Close the debt", forgive: "Waive the debt",
          repay: "Repay the debt",
          active: "Active", allClosed: "All closed", noActiveDebts: "No active debts",
          newDebt: "Add a new debt", newDebtShort: "New debt",
          qoldiqQarz: "Remaining debt", undirilganQarz: "Collected debt", qaytarilganQarz: "Repaid debt",
          noPhone: "No phone number entered", storeLabel: "Shop",
          actionsApplyTo: "Applies to the most recent active debt",
          qarzOluvchi: "Borrower", qarzBeruvchi: "Lender",
          errorTitle: "Customer not found or access denied",
          editTitle: "Edit borrower details",
          fishLabel: "Full name", fishPlaceholder: "Last name First name Patronymic",
          phoneLabel: "Phone number", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Cancel", save: "Save", saving: "Saving...",
          fishRequired: "Full name is required",
          fishTooLong: "Full name must not exceed 200 characters",
          phoneInvalid: "Invalid phone format (+998XXXXXXXXX)",
          saved: "Details updated",
          saveError: "An error occurred while saving",
        },
        kaa: {
          title: "Qarız detalları", back: "Artqa", history: "Ámeliyatlar tariyxı", receipt: "Kvitanciya",
          jamiQarz: "Jámi qarız",
          lastDateBerish: "Berilgen sáne", lastDateOlish: "Alınǵan sáne", lastReturnDate: "Qaytarıw sánesi",
          installment: "Bólip tólew", month: "ay",
          installmentTable: "Bólip tólew kestesi",
          actions: "Ámeller",
          demand: "Qaytarıwdı talap etiw", sending: "Jiberilmekte...",
          cardTitle: "Plastik karta nomeri", cardLabel: "Karta nomeri",
          cardHint: "Talap SMS'inde qarız alıwshıǵa aqsha ótkeriw ushın dúkan kartası kórsetiledi. Karta dúkan maǵlıwmatlarına saqlanadı.",
          cardHolder: "Karta iyesi (F.A.Á.)", cardHolderPh: "Atı Familiyası",
          cardRule: "16 san. Tek Ózbekstan kartası (Uzcard / Humo).",
          cardInvalid: "Karta nomeri 16 sannan ibarat bolıwı kerek", cardSend: "Saqlaw",
          cardOwnerOnly: "Dúkan iyesi plastik karta nomerin kiritiwi kerek.",
          closeDebt: "Qarızdı jabıw", forgive: "Qarızdan waz keshiw",
          repay: "Qarızdı qaytarıw",
          active: "Aktiv", allClosed: "Hámmesi jabılǵan", noActiveDebts: "Aktiv qarızlar joq",
          newDebt: "Jańa qarız qosıw", newDebtShort: "Jańa qarız",
          qoldiqQarz: "Qalǵan qarız", undirilganQarz: "Óndirilgen qarız", qaytarilganQarz: "Qaytarılǵan qarız",
          noPhone: "Telefon nomeri kiritilmegen", storeLabel: "Dúkan",
          actionsApplyTo: "Eń sońǵı aktiv qarızǵa qollanıladı",
          qarzOluvchi: "Qarız alıwshı", qarzBeruvchi: "Qarız beriwshi",
          errorTitle: "Klient tabılmadı yamasa kiriw ruqsatı joq",
          editTitle: "Qarız alıwshı maǵlıwmatların ózgertiw",
          fishLabel: "F.A.Á.", fishPlaceholder: "Familiyası Atı Ákesiniń atı",
          phoneLabel: "Telefon nomeri", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Biykar etiw", save: "Saqlaw", saving: "Saqlanbaqta...",
          fishRequired: "F.A.Á. kiritiliwi shárt",
          fishTooLong: "F.A.Á. 200 belgiden aspawı kerek",
          phoneInvalid: "Telefon formatı nadurıs (+998XXXXXXXXX)",
          saved: "Maǵlıwmatlar jańalandı",
          saveError: "Saqlawda qátelik júz berdi",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.load(); },
  methods: {
    formatMoney, // SS-AUDIT (2026-09-25): utils/helpers
    formatDate(d) { return fmtDMY(d) }, // SS-AUDIT (2026-09-25): utils/helpers (Safari-xavfsiz parse)
    goBack() {
      // Deterministik parent — qarzlar ro'yxati (turi bo'yicha)
      if (this.turi) {
        this.$router.push(this.localePath({ name: 'qarz-daftari-qarzlar' }) + `?turi=${this.turi}`);
      } else {
        this.$router.push(this.localePath({ name: 'qarz-daftari' }));
      }
    },
    // ===== Qarz oluvchi (mijoz) ma'lumotlarini tahrirlash =====
    openEdit() {
      if (!this.data?.mijoz) return;
      this.editForm = { fish: this.data.mijoz.fish || '', telefon: this.data.mijoz.telefon || '' };
      this.showEdit = true;
    },
    closeEdit() { this.showEdit = false; },
    normalizePhone(raw) {
      // Faqat raqam va '+' qoldiramiz (bo'sh joy, chiziqcha, qavslarni olib tashlaymiz)
      let p = String(raw || '').replace(/[^\d+]/g, '');
      if (!p) return '';
      // '+' yo'q bo'lsa: 998... → +998..., 9 xonali lokal → +998 prefiks
      if (!p.startsWith('+')) {
        if (p.startsWith('998')) p = '+' + p;
        else if (p.length === 9) p = '+998' + p;
      }
      return p;
    },
    async saveEdit() {
      const fish = (this.editForm.fish || '').trim();
      const telefon = this.normalizePhone(this.editForm.telefon);
      // Backend validatsiyasiga mos client-side tekshiruv
      if (!fish) { this.$toast?.error(this.texts.fishRequired); return; }
      if (fish.length > 200) { this.$toast?.error(this.texts.fishTooLong); return; }
      if (telefon && !/^\+998\d{9}$/.test(telefon)) { this.$toast?.error(this.texts.phoneInvalid); return; }
      this.editLoading = true;
      try {
        await this.$axios.$put(`/qarz-daftari/mijozlar/${this.data.mijoz.id}`, { fish, telefon });
        // Lokal yangilash — sahifani qayta yuklamasdan darhol ko'rinadi
        this.data.mijoz.fish = fish;
        this.data.mijoz.telefon = telefon || null;
        this.$toast?.success(this.texts.saved);
        this.showEdit = false;
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.texts.saveError);
      } finally {
        this.editLoading = false;
      }
    },
    async load() {
      this.loading = true; this.loadError = false;
      try {
        const res = await this.$axios.$get(`/qarz-daftari/mijozlar/${this.$route.params.id}/history`, { silent: true });
        if (res?.success && res.data) {
          this.data = res.data;
          // Agar oxirgi aktiv qarz bo'lib to'lash bo'lsa — to'lovlar jadvalini yuklash
          await Promise.all([this.loadTolovlarIfNeeded(), this.loadTavsiya()]);
        } else {
          this.loadError = true;
        }
      } catch (_) { this.loadError = true; } finally { this.loading = false; }
    },
    /** SS-DEV (2026-09-26), 12-band: mijoz tavsiyasi — backend bo'lmasa (404) blok ko'rsatilmaydi */
    async loadTavsiya() {
      try {
        const res = await this.$axios.$get(`/qarz-daftari/mijozlar/${this.$route.params.id}/tavsiya`, { silent: true });
        const d = (res && res.success !== false && (res.data || res)) || null;
        if (d && typeof d === 'object' && d.level) {
          this.tavsiya = {
            level: ['good', 'warn', 'bad', 'new'].indexOf(d.level) >= 0 ? d.level : 'new',
            on_time: Number(d.on_time) || 0,
            late: Number(d.late) || 0,
            total: Number(d.total) || 0,
            avg_delay_days: Number(d.avg_delay_days) || 0,
          };
        } else { this.tavsiya = null; }
      } catch (_) { this.tavsiya = null; }
    },
    async loadTolovlarIfNeeded() {
      if (!this.data?.qarzlar?.length) { this.bolibTolashList = []; return; }
      const allQ = this.data.qarzlar;
      const turiFilter = this.$route.query?.turi || '';
      const btQarzlar = allQ.filter(q => {
        if (q.status !== 'aktiv') return false;
        if (turiFilter === 'berish' || turiFilter === 'olish') {
          if (q.turi !== turiFilter) return false;
        }
        return Number(q.bolib_tolash) === 1 || Number(q.oylar_soni) > 0;
      });
      if (!btQarzlar.length) { this.bolibTolashList = []; return; }
      // PERF: har bo'lib-to'lash qarzi tolovlarини KETMA-KET emas, PARALLEL yuklaymiz
      // (ilgari N ta qarz = N ta ketma-ket so'rov). Promise.all tartibni saqlaydi.
      const results = await Promise.all(btQarzlar.map(async (q) => {
        try {
          const res = await this.$axios.$get(`/qarz-daftari/qarz/${q.id}/tolovlar`, { silent: true });
          const tolovlar = (res?.success && Array.isArray(res.data)) ? res.data : [];
          if (tolovlar.length) {
            return { qarz_id: q.id, miqdor: q.miqdor, valyuta: q.valyuta, berilgan_sana: q.berilgan_sana, mahsulot_nomi: q.mahsulot_nomi, oylar_soni: q.oylar_soni, tolovlar };
          }
        } catch (_) {}
        return null;
      }));
      this.bolibTolashList = results.filter(Boolean);
    },
    // SS-DEV (2026-09-24): jadvaldagi "To'lovni kiritish" oynasidan summa keladi —
    // backend ortiqchasini keyingi bo'laklarga taqsimlaydi (sharshara).
    async onTolandi(tolovId, summa) {
      try {
        const body = Number(summa) > 0 ? { summa: Number(summa) } : {};
        await this.$axios.$put(`/qarz-daftari/tolov/${tolovId}/tolandi`, body, { silent: true });
        await this.load();
        this.$toast?.success({ ru: 'Платёж отмечен', kr: "Тўлов қайд этилди", en: 'Payment recorded', kaa: 'Tólem belgilendi' }[this.$i18n?.locale] || "To'lov belgilandi"); // SS-DEV (2026-09-26): en/kaa
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik');
      }
    },
    // SS-DEV (2026-09-24): karta oynasi boshqaruvi
    onCardInput(e) {
      this.cardDigits = String(e && e.target ? e.target.value : '').replace(/\D/g, '').slice(0, 16);
      this.cardTouched = true;
    },
    closeCard() { this.showCard = false; },
    submitCard() {
      this.cardTouched = true;
      if (!this.cardValid) return;
      this.talabQilish(this.cardDigits, String(this.cardHolder || '').trim());
    },
    async talabQilish(kartaRaqami, kartaEgasi) {
      if (!this.lastActiveQarz) return;
      this.talabLoading = true;
      try {
        // SS-DEV (2026-09-24): karta kiritilgan bo'lsa — backend uni do'konga saqlab, SMS'ni karta bilan yuboradi
        const body = kartaRaqami ? { karta_raqami: kartaRaqami } : {};
        if (kartaRaqami && kartaEgasi) body.karta_egasi = kartaEgasi; // SS-DEV (2026-09-24): ixtiyoriy karta egasi
        const res = await this.$axios.$post(`/qarz-daftari/qarz/${this.lastActiveQarz.id}/talab`, body, { silent: true });
        this.showCard = false;
        const l = this.$i18n?.locale || 'uz';
        const phone = res?.data?.phone || '';
        const masked = phone ? phone.replace(/^(\+?\d{4})\d+(\d{2})$/, '$1***$2') : '';
        const okMsg = {
          uz: masked ? `Talab yuborildi. SMS ${masked} raqamiga jo'natildi.` : "Talab yuborildi va SMS jo'natildi",
          ru: masked ? `Запрос отправлен. SMS отправлено на ${masked}.` : 'Запрос отправлен и SMS доставлено',
          kr: masked ? `Талаб юборилди. SMS ${masked} рақамига жўнатилди.` : "Талаб юборилди ва SMS жўнатилди",
        };
        this.$toast?.success(okMsg[l] || okMsg.uz);
      } catch (e) {
        const code = e.response?.data?.code;
        const l = this.$i18n?.locale || 'uz';
        // SS-DEV (2026-09-24): karta yo'q — egasi bo'lsa karta oynasi, xodim bo'lsa xabar
        if (code === 'no-card') {
          if (e.response?.data?.can_set_card) { this.cardTouched = false; this.showCard = true; }
          else this.$toast?.error(this.texts.cardOwnerOnly);
          return;
        }
        const errMap = {
          'bad-card': {
            uz: this.texts.cardInvalid, ru: this.texts.cardInvalid, kr: this.texts.cardInvalid,
          },
          'card-owner-only': {
            uz: this.texts.cardOwnerOnly, ru: this.texts.cardOwnerOnly, kr: this.texts.cardOwnerOnly,
          },
          'no-phone': {
            uz: "Mijozning telefon raqami kiritilmagan. Avval telefon raqamini qo'shing.",
            ru: 'Номер телефона клиента не указан. Сначала добавьте номер.',
            kr: "Мижознинг телефон рақами киритилмаган. Аввал телефон рақамини қўшинг.",
            en: "The customer's phone number is not entered. Add a phone number first.", // SS-DEV (2026-09-26): en/kaa
            kaa: "Klienttiń telefon nomeri kiritilmegen. Aldın telefon nomerin qosıń.",
          },
          'sms-failed': {
            uz: 'SMS paketingiz tugagan. Iltimos, paket sotib oling.',
            ru: 'SMS пакет закончился. Пожалуйста, купите пакет.',
            kr: 'SMS пакетингиз тугаган. Илтимос, пакет сотиб олинг.',
            en: "Your SMS package has run out. Please buy a package.", // SS-DEV (2026-09-26): en/kaa
            kaa: "SMS paketińiz tamamlanǵan. Iltimas, paket satıp alıń.",
          },
          'no-sms-package': {
            uz: 'SMS paketingiz tugagan. Tariflar bo\'limidan paket sotib oling.',
            ru: 'SMS пакет закончился. Купите пакет в разделе Тарифы.',
            kr: 'SMS пакетингиз тугаган. Тарифлар бўлимидан пакет сотиб олинг.',
            en: "Your SMS package has run out. Buy a package in the Pricing section.", // SS-DEV (2026-09-26): en/kaa
            kaa: "SMS paketińiz tamamlanǵan. Tarifler bóliminen paket satıp alıń.",
          },
          'not-active': {
            uz: 'Bu qarz aktiv emas',
            ru: 'Этот долг не активен',
            kr: 'Бу қарз актив эмас',
            en: "This debt is not active", // SS-DEV (2026-09-26): en/kaa
            kaa: "Bul qarız aktiv emes",
          },
          'wrong-type': {
            uz: 'Faqat siz bergan qarzlar uchun talab yuborish mumkin',
            ru: 'Запрос можно отправлять только по выданным долгам',
            kr: 'Фақат сиз берган қарзлар учун талаб юбориш мумкин',
            en: "A demand can only be sent for debts you gave", // SS-DEV (2026-09-26): en/kaa
            kaa: "Tek siz bergen qarızlar ushın talap jiberiw múmkin",
          },
        };
        const fallback = e.response?.data?.message || 'Xatolik';
        this.$toast?.error(errMap[code]?.[l] || fallback);
        // SMS paketi tugagan YOKI pulli tarif kerak bo'lsa → tariflarga
        const requiredPlan = e.response?.data?.required_plan;
        const status = e.response?.status;
        if (code === 'no-sms-package' || code === 'sms-failed' || (status === 403 && requiredPlan)) {
          this.$router.push(this.localePath({ name: 'price' }));
        }
      } finally { this.talabLoading = false; }
    },
  },
};
</script>
