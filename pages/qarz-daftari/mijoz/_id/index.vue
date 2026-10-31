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
        <button class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm" @click="goBack">{{ texts.back }}</button>
      </div>
    </div>

    <!-- SS19 (2026-09-21): sun'iy `max-w-2xl mx-auto` cheklovi OLIB TASHLANDI.
         Sabab: bu sahifa mobil ilova skrinshotidan ko'chirilgan edi — keng
         monitorda kontent chap chekkada siqilib, o'ng tomoni bo'sh qolardi.
         Endi sahifa layout kengligidan to'liq foydalanadi (sayt dizayni). -->
    <div v-else-if="data">
      <!-- Header: orqaga + sarlavha (mobil ilovadagi "Qarz oluvchi" ekrani) -->
      <div class="flex items-center gap-3 mb-5">
        <button class="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 shadow-sm transition-colors" :title="texts.back" @click="goBack">
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
        <!-- 27.09 (S2-3): tugmalar FISh bilan BIR QATORDA — md+ da chapda FISh bloki, o'ngda tugmalar;
             <md da FISh ostiga tushadi (flex-col). Oldin `flex-wrap` sabab tugmalar pastki qatorga ketardi. -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Avatar + FISh + telefon + badge'lar -->
          <div class="flex items-center min-w-0 gap-4 md:flex-1" style="min-width: 220px">
            <!-- 27.09 (S2-7): harfli doira o'rniga odam siluet avatari (doira foni saqlandi) -->
            <span :class="['w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0', isOlish ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600']">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
            </span>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 min-w-0">
                <h2 class="text-xl lg:text-2xl font-bold text-gray-900 truncate min-w-0">{{ data.mijoz.fish }}</h2>
                <!-- Tahrirlash — FISh yonida, bosilganda blur'li markaziy modal ochiladi -->
                <button
                  type="button"
                  :title="texts.editTitle"
                  class="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  @click="openEdit"
                >
                  <!-- 27.09 (S2-8): qalam-kvadrat ("pencil-square") ikonkasi — namuna rasmdagidek; @click o'zgarmadi -->
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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

          <!-- Amal tugmalari — bir qatorda, pastel (group/_key uslubi). Funksiyalar avvalgidek.
               27.09 (S2-3): FISh qatorining o'ng tomonida (md+), sig'masa o'z ichida o'raladi. -->
          <div class="flex flex-wrap gap-2 md:justify-end">
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

            <!-- Faqat BERISH uchun: talab qilish (och sariq) + voz kechish (och qizil).
                 27.09 (S2-2): "Qarzdan voz kechish" → "Voz kechish" (faqat shu sahifa: forgiveShort) -->
            <template v-if="!isOlish">
              <!-- Tailwind 2.2 (JIT o'chiq) `disabled:` variantini generatsiya QILMAYDI — :class orqali -->
              <button
                type="button"
                :disabled="talabDisabled"
                :class="[
                  'inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                  talabDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100',
                ]"
                @click="talabQilish()"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.9" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <!-- 27.09 (S2-1): "Qaytarishni talab qilish" → "Talab qilish" (faqat shu sahifa: demandShort) -->
                {{ qtBusy ? texts.sending : texts.demandShort }}
                <!-- 02.10: tarif cheklovi (muddati tugagan/Free — manual_sms_send yo'q) — qulf; bosilsa taklif -->
                <PlanLockIcon v-if="talabLocked" :label="$t('plan_gate.required')" />
              </button>
              <nuxt-link
                v-if="hasActive && lastActiveQarz"
                :to="localePath({ name: 'qarz-daftari-qarz-id-voz-kechish', params: { id: lastActiveQarz.id } })"
                class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                {{ texts.forgiveShort }}
              </nuxt-link>
              <button
                v-else
                type="button"
                disabled
                :title="texts.noActiveDebts"
                class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                {{ texts.forgiveShort }}
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

        <!-- 27.09 (S2-4): "Qarz sanasi" / "Qaytarish sanasi" yig'ma bloki FAQAT KO'RINISHDAN olib tashlandi.
             Sanalar API/`data.qarzlar`da o'zgarmasdan qoladi (boshqa funksiyalar ishlatadi); har bir aktiv
             qarzning sanasi pastdagi "Aktiv qarzlar" ro'yxatida ko'rinadi. -->
        <p class="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ hasActive ? texts.actionsApplyTo : texts.noActiveDebts }}
        </p>
      </div>

      <!-- 29.09 (doc2 1-rasm; doc1 22–24-rasm): "Tavsiya" kartasi "Amaliyotlar tarixi" kartasining TEPASIGA
           chiqarildi (ilgari ikkalasi bir qatorda: chapda tugma, o'ngda tavsiya). Tavsiya kartasi Shaxsiy qarz
           kontragent sahifasidagi bilan bir xil komponent (RecommendationCard). Ma'lumot/API o'zgarmadi:
           GET /qarz-daftari/mijozlar/:id/tavsiya — backend bo'lmasa (404) karta ko'rsatilmaydi. -->
      <RecommendationCard
        v-if="tavsiya"
        class="mb-4"
        :label="texts.tavsiya"
        :tone="tavsiyaTone"
        :title="tavsiyaView.title"
        :text="tavsiyaView.text"
        :meta="tavsiyaMeta"
      />

      <!-- 29.09 (doc2 1-rasm): "Amaliyotlar tarixi" — kartasimon sarlavha (ikonka, amaliyotlar soni, oxirgi
           sana) + "Barchasini ko'rish" (to'liq tarix sahifasi). SS7: "Kvitansiya" har bir amaliyotning O'Z
           tafsilot sahifasida (qarz-daftari/tranzaksiya/_id). -->
      <!-- 30.09 (sayt hujjati 1-rasm): karta ostidagi berildi/qaytarildi/voz kechildi hisoblagichlari va
           amaliyotlar ro'yxati OLIB TASHLANDI — kartadan so'ng darhol "Aktiv qarzlar". To'liq tarix —
           "Barchasini ko'rish" (amaliyotlar sahifasi). -->
      <!-- 01.10 (doc2 1-rasm): kartaning ISTALGAN joyi bosilganda amaliyotlar ro'yxati ochiladi (ilgari faqat
           "Barchasini ko'rish" tugmasi). Butun karta — bitta havola; ichidagi "Barchasini ko'rish" endi vizual
           belgi (<span>) — <a> ichida <a> bo'lmasligi uchun. -->
      <nuxt-link
        :to="historyUrl"
        :title="texts.viewAll"
        class="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-4"
      >
        <div class="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style="background: linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%);">
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm" style="background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.9" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5M16.5 3L21 7.5m0 0L16.5 12M21 7.5H7.5"/></svg>
            </span>
            <div class="min-w-0">
              <h3 class="font-bold text-gray-900 leading-tight">{{ texts.history }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ timeline.length }} {{ texts.opsSuffix }}<template v-if="timeline.length"> · {{ texts.lastOp }}: {{ formatDate(timeline[0].created_at) }}</template>
              </p>
            </div>
          </div>
          <span
            class="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-700 text-sm font-semibold shadow-sm hover:bg-indigo-50 transition-colors whitespace-nowrap"
          >
            {{ texts.viewAll }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </span>
        </div>
      </nuxt-link>

      <!-- 27.09 (S2-6): shu qarz oluvchi (beruvchi) bilan FAQAT AKTIV qarzlar ro'yxati.
           Ma'lumot — sahifa allaqachon yuklagan GET /mijozlar/:id/history `qarzlar` (YANGI so'rov yo'q),
           status === 'aktiv' va sahifa turi (berish/olish) bo'yicha. Qator → qarz tafsiloti sahifasi. -->
      <div class="bg-white rounded-2xl shadow-sm p-5 mb-4">
        <div class="flex items-center justify-between gap-3 mb-3">
          <h3 class="font-bold text-gray-900">{{ texts.activeDebtsTitle }}</h3>
          <span v-if="activeDebtList.length" class="inline-flex items-center justify-center text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{{ activeDebtList.length }}</span>
        </div>

        <div v-if="activeDebtList.length">
          <!-- Ustun sarlavhalari — faqat md+ (mobilda har katak o'z yorlig'i bilan) -->
          <div class="hidden md:flex items-center gap-3 px-3 pb-2 border-b border-gray-100">
            <div class="flex-1 grid grid-cols-4 gap-x-4 text-xs font-medium text-gray-400">
              <span>{{ isOlish ? texts.lastDateOlish : texts.lastDateBerish }}</span>
              <span>{{ texts.colAmount }}</span>
              <span>{{ texts.qolgan }}</span>
              <span>{{ texts.colDue }}</span>
            </div>
            <span class="w-4 flex-shrink-0"></span>
          </div>
          <div class="divide-y divide-gray-100">
            <!-- 01.10 (doc2 1/2-rasm): qator → shu qarzning "Qarz berildi / olindi" AMALIYOT TAFSILOTI
                 (qarz-daftari/tranzaksiya/_id; ilgari qarz tafsiloti). Ma'lumot store orqali — so'rovsiz. -->
            <a
              v-for="q in activeDebtList"
              :key="'aq-' + q.id"
              :href="activeDebtHref(q)"
              :title="texts.openDebt"
              class="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              @click.prevent="openActiveDebt(q)"
            >
              <div class="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 items-center">
                <!-- Berilgan (olingan) sana + teglar -->
                <div class="min-w-0">
                  <p class="md:hidden text-xs text-gray-400">{{ isOlish ? texts.lastDateOlish : texts.lastDateBerish }}</p>
                  <p class="text-sm font-semibold text-gray-900">{{ formatDate(q.berilgan_sana) }}</p>
                  <div v-if="isInstallment(q) || q.mahsulot_nomi || q.sms_undelivered" class="flex items-center gap-1 mt-0.5 min-w-0">
                    <span v-if="isInstallment(q)" class="flex-shrink-0 inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">{{ texts.installment }}</span>
                    <!-- 25.10: ro'yxatga olish SMS'i mijozga yetkazilmadi -->
                    <span v-if="q.sms_undelivered" class="flex-shrink-0 inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700">{{ $t('sms_delivery.badge') }}</span>
                    <span v-if="q.mahsulot_nomi" class="text-xs text-gray-500 truncate">{{ q.mahsulot_nomi }}</span>
                  </div>
                </div>
                <!-- Summa + valyuta -->
                <div class="min-w-0">
                  <p class="md:hidden text-xs text-gray-400">{{ texts.colAmount }}</p>
                  <p class="text-sm font-semibold text-gray-900">{{ formatMoney(q.miqdor) }} <span class="text-xs font-normal text-gray-400">{{ q.valyuta }}</span></p>
                </div>
                <!-- Qoldiq -->
                <div class="min-w-0">
                  <p class="md:hidden text-xs text-gray-400">{{ texts.qolgan }}</p>
                  <p class="text-sm font-bold text-blue-600">{{ formatMoney(q.qoldiq) }} <span class="text-xs font-normal text-gray-400">{{ q.valyuta }}</span></p>
                </div>
                <!-- Qaytarish muddati -->
                <div class="min-w-0">
                  <p class="md:hidden text-xs text-gray-400">{{ texts.colDue }}</p>
                  <p v-if="q.qaytarish_sanasi" :class="['text-sm font-semibold', isOverdue(q) ? 'text-red-600' : 'text-gray-900']">
                    {{ formatDate(q.qaytarish_sanasi) }}
                    <span v-if="isOverdue(q)" class="ml-1 inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700">{{ texts.overdue }}</span>
                  </p>
                  <p v-else-if="isInstallment(q)" class="text-sm font-semibold text-purple-600">{{ texts.installment }}: {{ q.oylar_soni }} {{ texts.month }}</p>
                  <p v-else class="text-sm font-semibold text-gray-300">&mdash;</p>
                </div>
              </div>
              <svg class="w-4 h-4 flex-shrink-0 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <!-- Bo'sh holat -->
        <div v-else class="flex flex-col items-center justify-center text-center py-8">
          <span class="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </span>
          <p class="text-sm font-semibold text-gray-700">{{ texts.noActiveDebts }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ texts.activeDebtsEmptyHint }}</p>
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

    <!-- 03.10 (sayt hujjati, 4-rasm): "Talab qilish" — SMS darhol KETMAYDI. "Talab SMS yuborilsinmi?" oynasi: do'kon
         kartasi (yashirilgan raqam, Uzcard/Humo, egasi) + Telegram telefoni + SMS matni; "Ha, yuborish" / "Bekor
         qilish" / "Kartani o'zgartirish" (shu oynada forma — karta va telefon JUFT). Karta yo'q va do'kon egasi —
         oyna karta formasi bilan ochiladi; xodim — kartasiz tasdiq (umumiy matn). Mantiq: mixins/qarzTalabMixin.js.
         (Ilgari bu yerdagi karta oynasi kartani talab so'rovi bilan yuborardi — backend 03.10 dan uni e'tiborsiz qoldiradi.) -->
    <DemandConfirmModal
      v-if="qt.open"
      :key="'qt-' + qt.key"
      v-bind="qtModalProps"
      @close="qtClose"
      @confirm="qtConfirm"
      @snooze="qtSnooze"
      @save-card="qtSaveCard"
    />

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
          <button type="button" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" @click="closeEdit">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form class="px-6 py-5 space-y-4" novalidate @submit.prevent="saveEdit">
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
            <button type="button" class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors" @click="closeEdit">
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
import { fmtDMY, formatMoney, parseDateSafe } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar; 27.09 (S2-6): +parseDateSafe
import { creationTr, trStorePayload } from '@/utils/qarzDaftariTimeline';
import RecommendationCard from '@/components/finance/RecommendationCard.vue'; // 29.09: Tavsiya kartasi (Shaxsiy qarz bilan umumiy)
import PlanLockIcon from '@/components/ui/PlanLockIcon.vue'; // 02.10: tarif cheklovi qulfi
import subscriptionMixin from '~/mixins/subscriptionMixin'; // 02.10: talab SMS — manual_sms_send
import DemandConfirmModal from '@/components/finance/DemandConfirmModal.vue'; // 03.10: talab tasdiq oynasi
import qarzTalabMixin from '~/mixins/qarzTalabMixin'; // 03.10: talab oqimi (tarif → karta → tasdiq)
import { putTolovTolandi, getQarzTolovlar, getMijozlarTavsiya, getMijozlarHistory, putMijozlarById } from '@/api/qarzDaftari';

import mijozDetailViewMixin from '~/mixins/mijozDetailViewMixin.js';

export default {
  middleware: 'auth',
  components: { RecommendationCard, PlanLockIcon, DemandConfirmModal },
  mixins: [subscriptionMixin, qarzTalabMixin, mijozDetailViewMixin], // 02.10; 03.10: talab oqimi
  data() {
    return {
      data: null, loading: true, loadError: false, previousRouteName: null, bolibTolashList: [],
      tavsiya: null, // SS-DEV (2026-09-26), 12-band: mijoz tavsiyasi (API)
      // Qarz oluvchi (mijoz) ma'lumotlarini tahrirlash modali
      showEdit: false, editForm: { fish: '', telefon: '' }, editLoading: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => { vm.previousRouteName = from?.name || null; });
  },
  async mounted() {
    this.loadSubscriptionData(); // 02.10: tarif imkoniyatlari (talab qulfi) — sahifa yuklanishini kutmaydi
    await this.load();
  },
  methods: {
    formatMoney, // SS-AUDIT (2026-09-25): utils/helpers
    formatDate(d) { return fmtDMY(d) }, // SS-AUDIT (2026-09-25): utils/helpers (Safari-xavfsiz parse)
    /** 27.09 (S2-6): bo'lib to'lash qarzimi (loadTolovlarIfNeeded bilan bir xil mezon) */
    isInstallment(q) {
      return !!q && (Number(q.bolib_tolash) === 1 || Number(q.oylar_soni) > 0);
    },
    /**
     * 01.10 (doc2 1/2-rasm): aktiv qarzning "Qarz berildi / olindi" amaliyoti uchun manzil.
     * `from=mijoz` — tafsilotdagi "orqaga" shu sahifaga qaytaradi; `mijoz`/`turi` — F5 zaxirasi.
     */
    activeDebtPath(q) {
      const tr = creationTr(q, this.data?.tranzaksiyalar);
      if (!tr) {return '';}
      const base = this.localePath({ name: 'qarz-daftari-tranzaksiya-id', params: { id: String(tr.id) } });
      const mijozId = this.data?.mijoz?.id || this.$route.params.id;
      return `${base}?mijoz=${encodeURIComponent(mijozId)}${this.turi ? `&turi=${encodeURIComponent(this.turi)}` : ''}&from=mijoz`;
    },
    activeDebtHref(q) {
      const path = this.activeDebtPath(q);
      return path ? this.$router.resolve(path).href : '#';
    },
    /** Aktiv qarz → amaliyot tafsiloti: payload store'ga (sahifa so'rovsiz darhol chiziladi), so'ng o'tish. */
    openActiveDebt(q) {
      const tr = creationTr(q, this.data?.tranzaksiyalar);
      if (!tr) {return;}
      const mijozId = this.data?.mijoz?.id || this.$route.params.id;
      this.$store.commit('qarzTranzaksiya/SET_PAYLOAD', trStorePayload(tr, this.data?.qarzlar || [], mijozId, this.turi));
      this.$router.push(this.activeDebtPath(q));
    },
    /** 27.09 (S2-6): qaytarish sanasi bugundan oldin — "Muddati o'tgan" tegi uchun */
    isOverdue(q) {
      const d = q && parseDateSafe(q.qaytarish_sanasi);
      if (!d) {return false;}
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d.getTime() < today.getTime();
    },
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
      if (!this.data?.mijoz) {return;}
      this.editForm = { fish: this.data.mijoz.fish || '', telefon: this.data.mijoz.telefon || '' };
      this.showEdit = true;
    },
    closeEdit() { this.showEdit = false; },
    normalizePhone(raw) {
      // Faqat raqam va '+' qoldiramiz (bo'sh joy, chiziqcha, qavslarni olib tashlaymiz)
      let p = String(raw || '').replace(/[^\d+]/g, '');
      if (!p) {return '';}
      // '+' yo'q bo'lsa: 998... → +998..., 9 xonali lokal → +998 prefiks
      if (!p.startsWith('+')) {
        if (p.startsWith('998')) {p = '+' + p;}
        else if (p.length === 9) {p = '+998' + p;}
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
        await putMijozlarById(this.$axios, this.data.mijoz.id, { fish, telefon });
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
        const res = await getMijozlarHistory(this.$axios, this.$route.params.id, { silent: true });
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
        const res = await getMijozlarTavsiya(this.$axios, this.$route.params.id, { silent: true });
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
        if (q.status !== 'aktiv') {return false;}
        if (turiFilter === 'berish' || turiFilter === 'olish') {
          if (q.turi !== turiFilter) {return false;}
        }
        return Number(q.bolib_tolash) === 1 || Number(q.oylar_soni) > 0;
      });
      if (!btQarzlar.length) { this.bolibTolashList = []; return; }
      // PERF: har bo'lib-to'lash qarzi tolovlarини KETMA-KET emas, PARALLEL yuklaymiz
      // (ilgari N ta qarz = N ta ketma-ket so'rov). Promise.all tartibni saqlaydi.
      const results = await Promise.all(btQarzlar.map(async (q) => {
        try {
          const res = await getQarzTolovlar(this.$axios, q.id, { silent: true });
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
        await putTolovTolandi(this.$axios, tolovId, body, { silent: true });
        await this.load();
        this.$toast?.success({ ru: 'Платёж отмечен', kr: "Тўлов қайд этилди", en: 'Payment recorded', kaa: 'Tólem belgilendi' }[this.$i18n?.locale] || "To'lov belgilandi"); // SS-DEV (2026-09-26): en/kaa
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('common.error'));
      }
    },
    /**
     * 03.10 (sayt hujjati, 4-rasm): "Talab qilish" — tarif qulfi → markazdagi "Tarif cheklovi"; do'kon kartasi yo'q
     * (egasi) → karta formasi; bor → "Talab SMS yuborilsinmi?". Xatolar — mixins/qarzTalabMixin.js (avvalgi kodlar).
     */
    talabQilish() {
      if (!this.lastActiveQarz) {return;}
      this.qtStart(this.lastActiveQarz);
    },
  },
};
</script>
