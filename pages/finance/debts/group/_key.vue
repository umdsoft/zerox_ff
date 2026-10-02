<template>
  <div class="debt-group pb-8">
    <!-- SS-27 (2026-09-19): guruh "ichiga kirish" sahifasi (mobil ilovadagidek).
         Ilgari ro'yxatda akkordeon ochilardi — endi alohida sahifa. -->
    <!-- SS-DEV (2026-09-24): "Orqaga" — kelgan BO'LIMga (Faol/Tugallangan/...) qaytadi.
         29.09 (doc2 3-rasm): "← Orqaga" matnli havola O'RNIGA Qarz shartnomasi / Qarz daftaridagidek
         kvadrat oq tugma (chevron) + sahifa sarlavhasi bir qatorda. Manzil (backLink) o'zgarmadi. -->
    <div class="flex items-center gap-3 mb-4">
      <!-- 30.09 (doc1 14-rasm): umumiy PageBackButton (Qarz daftari bilan bir xil o'lcham/uslub) -->
      <PageBackButton :to="backLink" :label="texts.back" />
      <h1 class="min-w-0 truncate text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{{ pageTitle }}</h1>
    </div>

    <!-- Yuklanmoqda -->
    <div v-if="loading" class="bg-white rounded-2xl p-12 shadow-sm text-center">
      <p class="text-gray-400 text-sm">Yuklanmoqda…</p>
    </div>

    <!-- Guruh topilmadi (eskirgan havola / qarzlar o'chirilgan) -->
    <div v-else-if="!group" class="bg-white rounded-2xl p-12 shadow-sm text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Kontragent topilmadi</h3>
      <p class="text-gray-500 mb-4">Bu kontragent bo‘yicha qarzlar topilmadi. Ro‘yxatga qayting.</p>
      <nuxt-link :to="localePath({ name: 'finance-debts' })" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
        Shaxsiy qarzlar
      </nuxt-link>
    </div>

    <template v-else>
      <!-- Sarlavha bloki: ikonka + nom (+ telefon) va amal tugmalari.
           29.09 (doc1 20-rasm): Qarz daftari mijoz sahifasidagidek — md+ da chapda FISh, o'ngda tugmalar. -->
      <div class="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center min-w-0">
            <div class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" :class="avatarClass">
              <!-- Do'kon (store) ikonkasi -->
              <svg v-if="group.kind === 'shop'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M4 21V10m16 11V10M3 10l1.5-6h15L21 10M3 10h18M9 21v-6h6v6"/></svg>
              <!-- Shaxs (person) ikonkasi -->
              <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div class="ml-4 min-w-0">
              <!-- SS-13: shaxs ismi "Sarlavha Ko'rinishi"da; do'kon nomi brend sifatida o'zgarmaydi. -->
              <h2 class="text-xl lg:text-2xl font-bold text-gray-900 truncate">{{ group.kind === 'shop' ? group.name : titleCaseName(group.name) }}</h2>
              <p class="text-sm text-gray-500 truncate">
                <span v-if="group.phone">{{ formatPhone(group.phone) }}</span>
                <span v-else-if="group.kind === 'person'">{{ texts.noPhoneShort }}</span>
              </p>
              <!-- 29.09: bo'lim belgisi (faqat berilgan / faqat olingan qarzlar ko'rsatilganda) -->
              <p v-if="side && group.kind !== 'shop'" class="mt-1.5">
                <span
                  class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full"
                  :class="side === 'lent' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
                >{{ side === 'lent' ? texts.badgeLent : texts.badgeBorrowed }}</span>
              </p>
              <p v-if="group.kind === 'shop'" class="mt-1.5 flex items-center gap-1.5 flex-wrap">
                <span
                  class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style="background:#FEF3C7; color:#92400E;"
                  title="Bu qarz do‘kon tomonidan yuritiladi. Yopish/o‘zgartirish do‘kon egasining qo‘lida."
                >🏪 Do‘kon</span>
                <span
                  class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style="background:#EEF2FF; color:#3730A3;"
                  title="Ma’lumot faqat ko‘rish rejimida ulashilgan — bu yerdan o‘zgartirib bo‘lmaydi."
                >👁 Faqat ko‘rish</span>
              </p>
              <!-- SS-DEV (2026-09-24): do'kon MANZILI va TELEFONI sarlavhada (foydalanuvchi talabi) -->
              <div v-if="group.kind === 'shop'" class="mt-2 text-sm text-gray-600 space-y-0.5">
                <p v-if="shopInfo.address">📍 {{ shopInfo.address }}</p>
                <p v-if="shopInfo.phone">📞 <a :href="'tel:' + shopInfo.phone" class="text-blue-600 hover:underline">{{ formatPhone(shopInfo.phone) }}</a></p>
                <p v-if="!shopInfo.address && !shopInfo.phone" class="text-xs text-gray-400">Do‘kon manzili va telefoni kiritilmagan</p>
              </div>
            </div>
          </div>

          <!-- Shu kontragentga yana qarz berish/olish.
               Do'kon guruhida KO'RSATILMAYDI — do'kon qarzini faqat do'kon egasi kiritadi.
               29.09 (doc1 20-rasm): BERILGAN qarzlar bo'limidan kirilganda o'ng tepada "Yana qarz berish",
               "Qarzni yopish", "Talab qilish", "Voz kechish" (pastel, Qarz daftari uslubi); OLINGAN
               bo'limidan — "Yana qarz olish", "Qarzni qaytarish". Amallar shu kontragentning ENG OXIRGI
               aktiv qarziga qo'llanadi; aktiv qarz bo'lmasa tugmalar kulrang/o'chiq.
               30.09 (doc1 17/19/20-rasm): yopish / qaytarish / voz kechish endi TANLANGAN qarz(lar)ga
               (DebtActionModal: to'liq yoki qisman; voz kechishda — bir nechtasi yoki barchasi).
               Bo'lim noma'lum bo'lsa (Tugallangan/Barchasi/to'g'ridan-to'g'ri havola) — avvalgi 2 tugma. -->
          <div v-if="group.kind !== 'shop' && side === 'lent'" class="flex flex-wrap gap-2 md:justify-end">
            <nuxt-link :to="addDebtLink('lent')" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              {{ texts.giveMore }}
            </nuxt-link>
            <button type="button" :disabled="!actionDebts.length || actBusy" :title="actionDebts.length ? '' : texts.noActive" :class="actBtnClass('bg-green-50 text-green-700 hover:bg-green-100', !actionDebts.length)" @click="openActModal('close')">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
              {{ texts.close }}
            </button>
            <button type="button" :disabled="!canDemand || actBusy" :title="demandHint" :class="actBtnClass('bg-yellow-50 text-yellow-800 hover:bg-yellow-100', !canDemand)" @click="actDemand">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.9" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {{ actKind === 'demand' ? texts.sending : texts.demand }}
            </button>
            <button type="button" :disabled="!actionDebts.length || actBusy" :title="actionDebts.length ? '' : texts.noActive" :class="actBtnClass('bg-red-50 text-red-700 hover:bg-red-100', !actionDebts.length)" @click="openActModal('forgive')">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
              {{ texts.forgive }}
            </button>
          </div>
          <div v-else-if="group.kind !== 'shop' && side === 'borrowed'" class="flex flex-wrap gap-2 md:justify-end">
            <nuxt-link :to="addDebtLink('borrowed')" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              {{ texts.takeMore }}
            </nuxt-link>
            <button type="button" :disabled="!actionDebts.length || actBusy" :title="actionDebts.length ? '' : texts.noActive" :class="actBtnClass('bg-green-50 text-green-700 hover:bg-green-100', !actionDebts.length)" @click="openActModal('pay')">
              <span aria-hidden="true">💳</span>
              {{ texts.pay }}
            </button>
          </div>
          <div v-else-if="group.kind !== 'shop'" class="flex flex-wrap gap-2 md:justify-end">
            <nuxt-link
              :to="addDebtLink('lent')"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              {{ texts.giveDebt }}
            </nuxt-link>
            <nuxt-link
              :to="addDebtLink('borrowed')"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              {{ texts.takeDebt }}
            </nuxt-link>
          </div>
        </div>

        <!-- 30.09 (doc1 17/19-rasm): amallar endi TANLANGAN qarzga qo'llanadi ("eng oxirgi aktiv qarz" izohi
             olib tashlandi) — o'rniga faol qarzlar soni va jami qoldig'i. -->
        <p v-if="side && group.kind !== 'shop'" class="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span v-if="openDebts.length">{{ texts.activeNote.replace('{n}', openDebts.length) }}: {{ openTotalsText }}</span>
          <span v-else>{{ texts.noActive }}</span>
        </p>
      </div>

      <!-- Shu kontragent bo'yicha 3 ta kichik katak.
           SS-DEV (2026-09-24): VALYUTALAR ALOHIDA (1-rasm: UZS va USD qo'shilib "1 234 000 USD"
           chiqardi). Har valyuta o'z qatorida; hech narsa bo'lmasa "0 UZS". -->
      <!-- 29.09 (doc1 19-rasm): bo'lim (berilgan/olingan) ma'lum bo'lsa — faqat shu turdagi qarzlar
           bo'yicha: Jami qarz | Undirilgan (Qaytarilgan) | Qoldiq qarz (valyuta bo'yicha). -->
      <div v-if="side" class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500">{{ texts.totalDebt }}</p>
          <p v-for="c in sideTotals" :key="'st' + c.currency" class="text-lg font-bold text-gray-900 mt-0.5 leading-tight">{{ formatMoney(c.total, c.currency) }}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500">{{ side === 'lent' ? texts.collected : texts.repaid }}</p>
          <p v-for="c in sideTotals" :key="'sp' + c.currency" class="text-lg font-bold text-green-600 mt-0.5 leading-tight">{{ formatMoney(c.paid, c.currency) }}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500">{{ texts.remaining }}</p>
          <p v-for="c in sideTotals" :key="'sr' + c.currency" class="text-lg font-bold mt-0.5 leading-tight" :class="side === 'lent' ? 'text-blue-600' : 'text-red-600'">{{ formatMoney(c.left, c.currency) }}</p>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500">Jami olingan</p>
          <p v-for="c in totalsByCurrency" :key="'b' + c.currency" class="text-lg font-bold text-red-600 mt-0.5 leading-tight">{{ formatMoney(c.borrowed, c.currency) }}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500">Jami berilgan</p>
          <p v-for="c in totalsByCurrency" :key="'l' + c.currency" class="text-lg font-bold text-green-600 mt-0.5 leading-tight">{{ formatMoney(c.lent, c.currency) }}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500">Sof balans</p>
          <p v-for="c in totalsByCurrency" :key="'n' + c.currency" class="text-lg font-bold mt-0.5 leading-tight" :class="c.net >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ c.net >= 0 ? '+' : '-' }}{{ formatMoney(Math.abs(c.net), c.currency) }}
          </p>
        </div>
      </div>

      <!-- 29.09 (doc1 21–22-rasm): "Tavsiya" bloki qarz tafsiloti sahifasidan SHU YERGA ko'chirildi —
           tavsiya shaxsga (kontragentga) tegishli. Ma'lumot: GET /finance/debts/:id `reliability`
           (shu kontragentning eng oxirgi o'z qarzi bo'yicha — backend telefon/ism bo'yicha hisoblaydi). -->
      <RecommendationCard
        v-if="group.kind !== 'shop'"
        class="mb-4"
        :label="$t('finance.recommendation')"
        :tone="relTone"
        :title="$t('finance.rel_' + reliability.level)"
        :text="$t('finance.rel_' + reliability.level + '_desc')"
        :meta="reliability.total > 0 ? '(' + reliability.on_time + '/' + reliability.total + ' ' + $t('finance.rel_ontime') + ')' : ''"
      />

      <!-- Qarzlar ro'yxati.
           02.10 (sayt hujjati, 5-rasm): bo'lim (berilgan/olingan) ma'lum bo'lsa sarlavha "Amaliyotlar" va FAQAT
           amaldagi (active/overdue) qarzlar — tugallangan va voz kechilganlar bu ro'yxatda ko'rinmaydi (ular
           "Yakunlangan qarzlar" hisobotida). Bo'lim noma'lum (Tugallangan/Barchasi ro'yxatidan) — avvalgidek hammasi. -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
          <p class="font-semibold text-gray-900">{{ side ? texts.ops : texts.listAll }}</p>
          <span class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{{ listItems.length }} {{ texts.countSuffix }}</span>
        </div>
        <p v-if="!listItems.length" class="p-6 text-center text-sm text-gray-400">{{ texts.noActive }}</p>
        <div class="divide-y divide-gray-100">
          <div
            v-for="debt in listItems"
            :key="(debt.is_mirror ? 'm' : 'o') + '-' + debt.id"
            class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="onDebtClick(debt)"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-800 flex items-center gap-1.5 flex-wrap">
                  <span>{{ debt.type === 'borrowed' ? 'Olingan qarz' : 'Berilgan qarz' }}</span>
                  <span
                    v-if="debt.is_shop_debt"
                    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style="background:#FEF3C7; color:#92400E;"
                    title="Bu qarz do‘kon tomonidan yuritiladi. Yopish/o‘zgartirish do‘kon egasining qo‘lida."
                  >🏪 Do‘kon</span>
                  <span
                    v-else-if="debt.is_mirror && debt.can_operate"
                    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style="background:#ECFDF5; color:#065F46;"
                    title="Bu qarzni qarama-qarshi tomon kiritgan. Siz qarz beruvchisiz — to‘liq boshqara olasiz."
                  >🔗 Bog‘langan</span>
                  <span
                    v-else-if="debt.is_mirror"
                    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style="background:#EEF2FF; color:#3730A3;"
                    title="Ma’lumot faqat ko‘rish rejimida ulashilgan — barcha amallar kiritgan tomonda."
                  >👁 Faqat ko‘rish</span>
                </p>
                <p class="text-xs text-gray-500 mt-0.5">
                  <!-- 29.09 (doc2 3-rasm): muddat "26.09.2026" ko'rinishida (nuqta bilan) -->
                  <span v-if="debt.due_date">{{ texts.dueShort }} {{ formatDate(debt.due_date) }}</span>
                  <span v-if="debt.due_date"> · </span>
                  <span v-if="debt.status === 'completed'" class="text-green-600">Tugallangan</span>
                  <span v-else-if="isOverdue(debt)" class="text-red-600">Muddati o‘tgan</span>
                  <span v-else-if="isOpen(debt)" class="text-blue-600">Faol</span>
                </p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <div class="text-right">
                  <!-- SS-DEV (2026-09-24): tugallangan qarzda QOLDIQ (0) o'rniga DASTLABKI summa
                       ko'rsatiladi; voz kechilgan bo'lsa "voz kechildi" belgisi (5-rasm: "+0 UZS"
                       chalg'itardi — 500 000 berilgani ko'rinmasdi). -->
                  <p class="text-sm font-bold" :class="debt.type === 'borrowed' ? 'text-red-600' : 'text-green-600'">
                    {{ debt.type === 'borrowed' ? '-' : '+' }}{{ formatMoney(debt.status === 'completed' ? debt.amount : debt.remaining_amount, debt.currency) }}
                  </p>
                  <p v-if="isForgiven(debt)" class="text-xs text-rose-600 font-medium">🚫 Voz kechildi</p>
                  <p v-else-if="debt.status === 'completed'" class="text-xs text-gray-400">100% To‘langan</p>
                  <p v-else class="text-xs text-gray-400">{{ getPaidPercent(debt) }}% To‘langan</p>
                </div>
                <!-- SS-DEV (2026-09-24): TUGALLANGAN qarzni shu yerdan BIR TOMONLAMA o'chirish
                     (faqat mening ro'yxatimdan; qarshi tomonda saqlanadi). Do'kon qarzi — yo'q. -->
                <button
                  v-if="debt.status === 'completed' && !debt.is_shop_debt"
                  type="button"
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                  title="O‘chirish (faqat mening ro‘yxatimdan)"
                  @click.stop="askRowDelete(debt)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
                <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Do'kon qarzi TAFSILOTLARI (faqat ko'rish) — ro'yxat sahifasidagi modalning aynan o'zi -->
    <div v-if="showShopDebt && shopDebt" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showShopDebt = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white">
          <div class="flex items-start justify-between">
            <div class="min-w-0">
              <p class="text-white/80 text-xs font-medium mb-0.5">🏪 Do‘kon qarzi</p>
              <h3 class="text-lg font-bold truncate">{{ shopDebt.source_name }}</h3>
            </div>
            <button @click="showShopDebt = false" class="text-white/80 hover:text-white flex-shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div class="mt-3 flex items-end justify-between">
            <div>
              <p class="text-white/80 text-xs">Qoldiq qarz</p>
              <p class="text-2xl font-extrabold leading-tight">{{ formatMoney(shopDebt.remaining_amount, shopDebt.currency) }}</p>
            </div>
            <div class="text-right">
              <p class="text-white/80 text-xs">Dastlabki summa</p>
              <p class="font-semibold">{{ formatMoney(shopDebt.amount, shopDebt.currency) }}</p>
            </div>
          </div>
        </div>
        <div class="p-5 space-y-3 text-sm overflow-y-auto" style="max-height:60vh">
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gray-50 rounded-xl p-3">
              <p class="text-gray-500 text-xs">Qaytarilgan</p>
              <p class="font-bold text-green-600">{{ formatMoney(shopDebt.paid_amount || 0, shopDebt.currency) }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-3">
              <p class="text-gray-500 text-xs">Qoldiq</p>
              <p class="font-bold text-red-600">{{ formatMoney(shopDebt.remaining_amount, shopDebt.currency) }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-gray-500 text-xs">Olingan sana</p>
              <p class="font-medium">{{ formatDate(shopDebt.start_date || shopDebt.created_at) }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-xs">Qaytarish muddati</p>
              <p class="font-medium">{{ shopDebt.due_date ? formatDate(shopDebt.due_date) : '—' }}</p>
            </div>
          </div>
          <div v-if="shopDebt.notes">
            <p class="text-gray-500 text-xs">Izoh (do'kon egasidan)</p>
            <p class="font-medium bg-gray-50 rounded-xl p-3">{{ botNoteText(shopDebt.notes, $i18n.locale) }}</p>
          </div>
          <div class="pt-3 border-t border-gray-100 space-y-1">
            <p class="text-gray-500 text-xs mb-1">Do'kon ma'lumotlari</p>
            <p v-if="shopDebt.shop_region || shopDebt.shop_district" class="font-medium">📍 {{ [shopDebt.shop_region, shopDebt.shop_district].filter(Boolean).join(', ') }}</p>
            <p v-if="shopDebt.shop_phone" class="font-medium">📞 {{ formatPhone(shopDebt.shop_phone) }}</p>
            <p v-if="!shopDebt.shop_region && !shopDebt.shop_district && !shopDebt.shop_phone" class="text-gray-400 text-xs">Ma'lumot kiritilmagan</p>
          </div>
          <div class="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3 text-amber-800">
            <span class="flex-shrink-0">ℹ️</span>
            <p class="text-xs">Bu qarz do'kon tomonidan yuritiladi — faqat ko'rish. Yopish/o'zgartirish do'kon egasining qo'lida.</p>
          </div>
          <!-- SS-DEV (2026-09-24): noto'g'ri rasmiylashtirilgan qarz bo'yicha SHIKOYAT (do'kon egasiga bildirishnoma) -->
          <button
            v-if="shopDebt.status !== 'completed'"
            @click="openComplaint"
            class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1.5"
          ><span>⚠️</span> Shikoyat qilish</button>
        </div>
      </div>
    </div>

    <!-- SS-DEV (2026-09-24): SHIKOYAT modali — sabab tanlanadi, qarz bergan tomonga (do'kon
         egasi YOKI hamkor) bildirishnoma boradi. `complaintTarget` — do'kon qarzi yoki
         odam-odam hamkor qaydi (`complaintKind`: 'shop' | 'person'). -->
    <div v-if="showComplaint && complaintTarget" class="fixed inset-0 flex items-center justify-center p-4" style="z-index: 120">
      <div class="absolute inset-0" style="background: rgba(17, 24, 39, 0.55); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)" @click="!complaintBusy && (showComplaint = false)"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full sm:max-w-md overflow-hidden">
        <div class="p-5">
          <div class="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-3" style="background:#FEE2E2; color:#B91C1C">⚠️</div>
          <h3 class="text-base font-bold text-gray-900 text-center">Qarz bo‘yicha shikoyat</h3>
          <!-- SS-DEV (2026-09-24): ILDIZ SABAB (2-rasm, "bildirishnoma yuborildi 2 marta"):
               yuborilgandan KEYIN ham "…bildirishnoma sifatida yuboriladi" izohi qolib,
               tagida "…bildirishnoma sifatida yuborildi" xabari chiqardi — bir xil gap ikki
               marta. Endi yuborilgach izoh yashiriladi, faqat bitta ixcham xabar qoladi. -->
          <p class="text-sm text-gray-500 text-center mt-1.5">
            «{{ complaintKind === 'shop' ? complaintTarget.source_name : titleCaseName(complaintTarget.source_name) }}» — {{ formatMoney(complaintTarget.remaining_amount, complaintTarget.currency) }}.
            <template v-if="!complaintSent">{{ complaintKind === 'shop' ? 'Shikoyat do‘kon egasiga bildirishnoma sifatida yuboriladi.' : 'Shikoyat qarz bergan odamga bildirishnoma sifatida yuboriladi.' }}</template>
          </p>

          <template v-if="!complaintSent">
            <!-- SS-DEV (2026-09-24): sabab IXTIYORIY — tanlanmasa izoh yozib yuborish mumkin. -->
            <p class="text-xs font-semibold text-gray-500 mt-4 mb-2">Sababni tanlang <span class="font-normal text-gray-400">(yoki pastda izoh yozing)</span>:</p>
            <div class="space-y-2">
              <button
                v-for="r in complaintReasons" :key="r.key"
                @click="complaintReason = complaintReason === r.key ? '' : r.key"
                class="w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors"
                :style="complaintReason === r.key ? 'border-color:#E11D48; background:#FFF1F2; color:#9F1239' : 'border-color:#E5E7EB; color:#374151'"
              >{{ r.text }}</button>
            </div>
            <textarea v-model="complaintNote" rows="2" maxlength="500" :placeholder="complaintReason ? 'Qo‘shimcha izoh (ixtiyoriy)' : 'Sabab tanlanmasa — izoh yozing (majburiy)'" class="mt-3 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-400"></textarea>
          </template>
          <div v-else class="mt-4 flex items-start gap-2 bg-green-50 border border-green-100 rounded-xl p-3 text-green-800">
            <span class="flex-shrink-0">✅</span>
            <!-- 30.09 (doc1 22-rasm): "U qarzni tekshirib, siz bilan bog'lanadi" — va'da bo'lib chiqardi (do'kon
                 egasi bog'lanmasligi mumkin). Endi faqat haqiqat: bildirishnoma yetkazildi, o'zgarish shu yerda ko'rinadi. -->
            <p class="text-sm">{{ complaintKind === 'shop' ? texts.complaintSentShop : texts.complaintSentPerson }}</p>
          </div>
        </div>
        <div class="flex gap-2 p-4 pt-0">
          <template v-if="!complaintSent">
            <button type="button" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm" :disabled="complaintBusy" @click="showComplaint = false">Bekor qilish</button>
            <button type="button" class="flex-1 py-2.5 text-white rounded-xl font-semibold text-sm" :style="'background:#E11D48;' + (complaintBusy || !complaintCanSend ? 'opacity:.6' : '')" :disabled="complaintBusy || !complaintCanSend" @click="submitComplaint">{{ complaintBusy ? '...' : 'Yuborish' }}</button>
          </template>
          <template v-else>
            <button type="button" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm" @click="backToDebtFromComplaint">Qarzga o‘tish</button>
            <button type="button" class="flex-1 py-2.5 text-white rounded-xl font-semibold text-sm" style="background:#16A34A" @click="showComplaint = false">Ok</button>
          </template>
        </div>
      </div>
    </div>

    <!-- Telefon-ko'zgu qarz tafsiloti + (lender bo'lsa) amallar -->
    <div v-if="showMirror && mirrorDebt" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showMirror = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl overflow-hidden">
        <div class="p-5 text-white" :class="mirrorDebt.type === 'lent' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-indigo-500 to-indigo-700'">
          <div class="flex items-start justify-between">
            <div class="min-w-0">
              <!-- SS-DEV (2026-09-24): "ko'zgu" → "hamkor qaydi" (qarshi tomon kiritgan qarz) -->
              <p class="text-white/80 text-xs font-medium mb-0.5">🤝 {{ mirrorDebt.type === 'lent' ? 'Berilgan qarz · hamkor qaydi' : 'Olingan qarz · hamkor qaydi' }}</p>
              <h3 class="text-lg font-bold truncate">{{ titleCaseName(mirrorDebt.source_name) }}</h3>
              <p v-if="mirrorDebt.phone" class="text-white/80 text-xs mt-0.5">{{ formatPhone(mirrorDebt.phone) }}</p>
            </div>
            <button @click="showMirror = false" class="text-white/80 hover:text-white flex-shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div class="mt-3 flex items-end justify-between">
            <div><p class="text-white/80 text-xs">Qoldiq</p><p class="text-2xl font-extrabold leading-tight">{{ formatMoney(mirrorDebt.remaining_amount, mirrorDebt.currency) }}</p></div>
            <div class="text-right"><p class="text-white/80 text-xs">Dastlabki summa</p><p class="font-semibold">{{ formatMoney(mirrorDebt.amount, mirrorDebt.currency) }}</p></div>
          </div>
        </div>
        <div class="p-5 space-y-3 text-sm overflow-y-auto" style="max-height:60vh">
          <div class="grid grid-cols-2 gap-3">
            <div><p class="text-gray-500 text-xs">Olingan sana</p><p class="font-medium">{{ formatDate(mirrorDebt.start_date || mirrorDebt.created_at) }}</p></div>
            <div><p class="text-gray-500 text-xs">Qaytarish muddati</p><p class="font-medium">{{ mirrorDebt.due_date ? formatDate(mirrorDebt.due_date) : '—' }}</p></div>
          </div>
          <div v-if="mirrorDebt.notes"><p class="text-gray-500 text-xs">Izoh</p><p class="font-medium bg-gray-50 rounded-xl p-3">{{ botNoteText(mirrorDebt.notes, $i18n.locale) }}</p></div>

          <!-- SS-DEV (2026-09-24): QAYTARISHLAR — har qism alohida: summa, KIM kiritgan, QACHON.
               Talab: «kim qaytarilgan deb kiritganini, qachon kiritganini ko'rinadigan qilish». -->
          <div v-if="mirrorPayments.length" class="pt-1">
            <p class="text-gray-500 text-xs mb-1.5">Qaytarishlar ({{ mirrorPayments.length }})</p>
            <div class="space-y-1.5">
              <div v-for="p in mirrorPayments" :key="'mp' + p.id" class="flex items-start justify-between gap-2 rounded-xl px-3 py-2" :class="p.kind === 'forgive' ? 'bg-rose-50' : 'bg-green-50'">
                <div class="min-w-0">
                  <p class="font-semibold" :class="p.kind === 'forgive' ? 'text-rose-700' : 'text-green-700'">{{ p.kind === 'forgive' ? '🚫 ' : '− ' }}{{ formatMoney(p.amount, mirrorDebt.currency) }} <span class="text-xs font-normal text-gray-500">· {{ p.kind === 'forgive' ? 'voz kechildi' : 'to‘lov' }}</span></p>
                  <p class="text-xs text-gray-500">{{ formatDateTime(p.created_at || p.payment_date) }}</p>
                </div>
                <p class="text-xs text-right flex-shrink-0" :class="p.byMe ? 'text-gray-500' : 'text-indigo-600 font-medium'">👤 {{ p.by }}</p>
              </div>
            </div>
          </div>

          <!-- Lender (can_operate): YOPISH / to'lov qayd etish / talab qilish / voz kechish.
               SS-4 (2026-09-19): «Undan yopish mumkin emas demoqda. Aslida esa yopish
               imkonini ham berish kerak» — qarz beruvchi pul qo'liga tekkanda
               qarzni o'zi yopadi yoki qisman to'lovni qayd etadi. -->
          <div v-if="mirrorDebt.can_operate && mirrorDebt.status !== 'completed'" class="space-y-2 pt-1">
            <!-- 30.09 (doc1 20-rasm): "Qarzni yopish" va "Qarzni qaytarish" BIRLASHTIRILDI — bitta tugma oyna
                 ochadi: summa bo'sh = butun qoldiq yopiladi, summa kiritilsa = qisman qaytarish qayd etiladi. -->
            <button @click="openMirrorPay" :disabled="mirrorBusy" class="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1" :style="mirrorBusy ? 'opacity:.6' : ''"><span>✓</span> {{ texts.close }}</button>
            <div class="flex gap-2">
              <button @click="mirrorDemand" :disabled="mirrorBusy" class="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1" :style="mirrorBusy ? 'opacity:.6' : ''"><span>⏰</span> {{ texts.demand }}</button>
              <!-- SS-DEV (2026-09-24): voz kechishga mos ikonka — 🚫 (qarz daftari bilan bir xil) -->
              <button @click="askMirrorForgive" :disabled="mirrorBusy" class="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1" :style="mirrorBusy ? 'opacity:.6' : ''"><span>🚫</span> {{ texts.forgive }}</button>
            </div>
          </div>
          <!-- SS-DEV (2026-09-24): men QARZDOR bo'lgan hamkor qaydi (u "berdim" deb yozgan) —
               noto'g'ri bo'lsa SHIKOYAT (do'kon qarzidagi kabi; qarz bergan odamga bildirishnoma). -->
          <button
            v-if="!mirrorDebt.can_operate && mirrorDebt.status !== 'completed'"
            @click="openPersonComplaint"
            class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1.5"
          ><span>⚠️</span> Shikoyat qilish</button>
          <!-- SS-DEV (2026-09-24): TUGALLANGAN hamkor qaydini O'Z ro'yxatimdan olib tashlash (bir tomonlama) -->
          <button
            v-if="mirrorDebt.status === 'completed'"
            @click="askMirrorHide" :disabled="mirrorBusy"
            class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1"
            :style="mirrorBusy ? 'opacity:.6' : ''"
          ><span>🗑</span> O‘chirish (faqat mening ro‘yxatimdan)</button>
          <!-- SS-DEV (2026-09-24): ism "Sarlavha Ko'rinishi"da + bitta tushunarli gap -->
          <div class="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3 text-gray-600">
            <span class="flex-shrink-0">ℹ️</span>
            <p class="text-xs">{{ mirrorDebt.can_operate ? ('Bu qarzni «' + titleCaseName(mirrorDebt.source_name) + '» kiritgan — siz qarz beruvchisiz, shuning uchun to‘lov qayd etish, talab qilish va voz kechish sizda.') : ('Bu qarzni «' + titleCaseName(mirrorDebt.source_name) + '» kiritgan, shuning uchun uni faqat u o‘zgartira oladi — sizga faqat ko‘rish ochiq.') }}</p>
          </div>
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
      :busy="mirrorBusy || actBusy"
      @cancel="confirmKind = ''"
      @confirm="onConfirmAccept"
    />

    <!-- 30.09 (doc1 17/19/20-rasm): sarlavhadagi "Qarzni yopish" / "Qarzni qaytarish" / "Voz kechish" —
         QAYSI qarz(lar)ga qo'llanishini tanlash oynasi (to'liq yoki qisman summa; voz kechishda — bir
         nechtasi yoki barchasi). Ilgari amal jimgina ENG OXIRGI aktiv qarzga qo'llanardi. -->
    <DebtActionModal
      v-if="actModal"
      :mode="actModal"
      :debts="actionDebts"
      :name="group ? (group.kind === 'shop' ? group.name : titleCaseName(group.name)) : ''"
      :busy="actBusy"
      @cancel="actModal = ''"
      @confirm="onActConfirm"
    />

    <!-- 30.09 (doc1 18/21-rasm): "Talab qilish" — karta kiritilmagan bo'lsa shu oyna ochiladi; saqlangach
         SMS avtomatik yuboriladi (ilgari faqat ikki marta qizil xabar chiqardi). -->
    <PayoutCardModal
      v-if="showCardModal"
      intent="demand"
      @close="showCardModal = false; pendingDemand = null"
      @saved="onCardSaved"
    />

    <!-- SS-4 (2026-09-19): lender — qisman to'lovni qayd etish -->
    <ConfirmModal
      v-if="showMirrorPay && mirrorDebt"
      :title="texts.close"
      :message="texts.remainingLbl + ': ' + formatMoney(mirrorDebt.remaining_amount, mirrorDebt.currency)"
      :confirm-text="texts.closeYes"
      tone="success"
      icon="✓"
      :busy="mirrorBusy"
      @cancel="showMirrorPay = false"
      @confirm="submitMirrorPay"
    >
      <label class="block text-xs font-medium text-gray-500 mb-1">{{ texts.payHint }}</label>
      <!-- SS-DEV (2026-09-24): "122 000" ko'rinishida (minglik ajratgich) + qoldiqdan oshsa ogohlantirish -->
      <input
        v-model="mirrorPayDisplay"
        type="text"
        inputmode="numeric"
        :placeholder="fmtNum(mirrorDebt.remaining_amount)"
        class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2"
        :class="mirrorPayOver ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-green-500'"
      />
      <p v-if="mirrorPayOver" class="text-xs text-red-600 mt-1.5">{{ texts.overRemaining }} ({{ formatMoney(mirrorDebt.remaining_amount, mirrorDebt.currency) }})</p>
      <p v-else class="text-xs text-gray-400 mt-1.5">{{ texts.leaveEmpty }}</p>
    </ConfirmModal>
  </div>
</template>

<script>
import { titleCaseName, botNoteText, fmtDMY, formatMoneyCur, formatPhoneUz } from '~/utils/helpers'; // 29.09: formatDateLocale → fmtDMY (26.09.2026)
import { groupDebtsByCounterparty, findGroupByRouteKey } from '~/utils/debtGroups';
import RecommendationCard from '~/components/finance/RecommendationCard.vue'; // 29.09: Tavsiya shu sahifaga ko'chdi
// 30.09 (doc1 14/17–21-rasm): umumiy "Orqaga", qarz tanlash oynasi, karta oynasi
import PageBackButton from '~/components/ui/PageBackButton.vue';
import DebtActionModal from '~/components/finance/DebtActionModal.vue';
import PayoutCardModal from '~/components/finance/PayoutCardModal.vue';
import { allocatePayment } from '~/utils/debtAllocation'; // 01.10 (doc3 5/6-rasm): zaxira ketma-ket taqsimot

// 29.09 (doc1 19-rasm): kelgan bo'lim (`?tab=`) → ko'rsatiladigan qarz turi. Berilgan bo'limlardan
// kirilsa FAQAT berilgan (lent), olingan bo'limlardan — FAQAT olingan (borrowed); qolganlarida hammasi.
const SIDE_BY_TAB = {
  given: 'lent', 'overdue-given': 'lent', lent: 'lent', lent_overdue: 'lent',
  taken: 'borrowed', 'overdue-taken': 'borrowed', borrowed: 'borrowed', borrowed_overdue: 'borrowed',
};
// Qarz tafsiloti sahifasidagi reliability darajasi → Tavsiya kartasi rangi
const REL_TONE = { reliable: 'good', medium: 'warn', risky: 'bad', none: 'none' };
const MARKER_RE = /^__(increase|forgive)__/;

// 02.10 (3–4-rasm): tanlangan qarzlar valyuta bo'yicha guruhlar (UZS, USD, …) — har biri alohida to'lanadi.
function groupByCurrency(debts) {
  const rank = (c) => (c === 'UZS' ? 0 : c === 'USD' ? 1 : 2);
  const map = {};
  for (const d of debts || []) {
    const c = (d && d.currency) || 'UZS';
    map[c] = [...(map[c] || []), d];
  }
  return Object.keys(map).sort((a, b) => rank(a) - rank(b)).map((currency) => ({ currency, debts: map[currency] }));
}

// SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band: `?tab=` → ro'yxat sahifasi turi (yangi va eski qiymatlar)
const LIST_KIND_BY_TAB = {
  given: 'given', taken: 'taken', 'overdue-given': 'overdue-given', 'overdue-taken': 'overdue-taken', completed: 'completed', all: 'all',
  lent: 'given', lent_overdue: 'overdue-given', borrowed: 'taken', borrowed_overdue: 'overdue-taken', active: 'all',
};

export default {
  name: 'DebtGroupDetail',
  middleware: 'auth',
  components: { RecommendationCard, PageBackButton, DebtActionModal, PayoutCardModal },

  data() {
    return {
      debts: [],
      loading: true,
      // 29.09: Tavsiya (kontragent ishonchliligi) va sarlavhadagi amal tugmalari holati
      reliability: { level: 'none', total: 0, on_time: 0, late: 0 },
      actBusy: false,
      actKind: '', // '' | 'demand' — qaysi amal bajarilmoqda (tugma matni uchun)
      // 30.09: qarz tanlash oynasi ('' | 'close' | 'pay' | 'forgive') va karta oynasi
      actModal: '',
      showCardModal: false,
      pendingDemand: null, // karta saqlangach yuboriladigan talab: { debt }
      // Do'kon qarzi tafsilotlari modali
      showShopDebt: false,
      shopDebt: null,
      // Telefon-ko'zgu qarz modali
      showMirror: false,
      mirrorDebt: null,
      mirrorBusy: false,
      // SS-19: markazlashgan tasdiqlash modali ('' = yopiq | 'close' | 'forgive')
      confirmKind: '',
      // SS-4: lender qisman to'lovni qayd etish modali
      showMirrorPay: false,
      mirrorPayAmount: '',
      // SS-DEV (2026-09-24): do'kon qarzi / hamkor qaydi bo'yicha shikoyat
      showComplaint: false,
      complaintKind: 'shop', // 'shop' | 'person'
      // SS-DEV (2026-09-24): tugallangan qatorni o'chirish (o'z qaydim) tasdig'i
      rowDeleteDebt: null,
      complaintReason: '',
      complaintNote: '',
      complaintBusy: false,
      complaintSent: false,
      complaintReasons: [
        { key: 'not_taken', text: 'Men qarz olmaganman-ku?' },
        { key: 'fully_paid', text: 'Qarzimni to‘liq qaytargan edim-ku?' },
        { key: 'partly_paid', text: 'Qarzimni bir qismini qaytarganman-ku?' },
      ]
    }
  },

  computed: {
    // URL'dagi guruh kaliti ($route.params.key vue-router tomonidan bir marta dekodlanadi).
    routeKey() {
      return (this.$route && this.$route.params && this.$route.params.key) || ''
    },

    // 29.09 (doc1 19-rasm): ko'rsatiladigan qarz turi ('lent' | 'borrowed' | '' = hammasi).
    side() {
      return SIDE_BY_TAB[this.currentTab] || ''
    },

    // Shu kontragent guruhi (ro'yxat sahifasidagi bilan AYNAN bir xil mantiq).
    // 29.09: bo'lim ma'lum bo'lsa — faqat shu turdagi qarzlar guruhlanadi (ro'yxat, soni, kartalar).
    group() {
      const s = this.side
      const list = s ? this.debts.filter((d) => d.type === s) : this.debts
      return findGroupByRouteKey(groupDebtsByCounterparty(list), this.routeKey)
    },
    // Filtrsiz guruh — Tavsiya uchun (ishonchlilik shaxsning BARCHA qarzlari bo'yicha, backend kabi).
    fullGroup() {
      return findGroupByRouteKey(groupDebtsByCounterparty(this.debts), this.routeKey)
    },

    // 29.09: sahifa sarlavhasi — Qarz daftaridagidek "Qarz oluvchi" / "Qarz beruvchi".
    pageTitle() {
      if (this.side === 'lent') return this.texts.titleLent
      if (this.side === 'borrowed') return this.texts.titleBorrowed
      return this.texts.titleAll
    },

    // 29.09: bo'lim kartalari — valyuta bo'yicha Jami (undirilgan + qoldiq) / Undirilgan / Qoldiq.
    // Voz kechilgan summa "undirilgan"ga qo'shilmaydi (faqat haqiqiy to'lovlar).
    sideTotals() {
      const items = (this.group && this.group.items) || []
      const map = {}
      for (const d of items) {
        const cur = d.currency || 'UZS'
        if (!map[cur]) map[cur] = { currency: cur, paid: 0, left: 0 }
        map[cur].paid += this.paidOf(d)
        if (this.isOpen(d)) map[cur].left += Number(d.remaining_amount) || 0
      }
      const rank = (c) => (c === 'UZS' ? 0 : c === 'USD' ? 1 : 2)
      const rows = Object.values(map)
        .map((r) => ({ ...r, total: r.paid + r.left }))
        .sort((a, b) => rank(a.currency) - rank(b.currency))
      return rows.length ? rows : [{ currency: 'UZS', paid: 0, left: 0, total: 0 }]
    },

    // 30.09 (doc1 17/19-rasm): sarlavhadagi amallar uchun TANLASH mumkin bo'lgan qarzlar — shu bo'limdagi
    // ochiq qarzlar, men boshqara oladiganlari (o'z qaydim yoki men qarz beruvchi bo'lgan hamkor qaydi).
    actionDebts() {
      if (!this.side || !this.group || this.group.kind === 'shop') return []
      return (this.group.items || []).filter((d) => this.isOpen(d) && !d.is_shop_debt && (!d.is_mirror || d.can_operate))
    },
    // Talab SMS'i qarzdor telefoniga ketadi — o'z qaydimda telefon bo'lishi shart; hamkor qaydida telefon
    // backend'da (kiritgan foydalanuvchi). SMS matni qarzga bog'liq emas (karta rekviziti), shuning uchun
    // telefonli eng oxirgi ochiq qarz olinadi.
    demandTarget() {
      return this.actionDebts.find((d) => d.is_mirror || !!d.phone) || null
    },
    canDemand() {
      return !!this.demandTarget
    },
    demandHint() {
      if (!this.actionDebts.length) return this.texts.noActive
      return this.canDemand ? '' : this.texts.noPhoneDemand
    },
    // 01.10 (doc3 7-rasm): "Faol qarzlar" izohi — shu bo'limdagi BARCHA ochiq qarzlar, jumladan hamkor
    // kiritgan va menga faqat KO'RISH ochiq bo'lgan qarz (masalan Jamshid bergan 500 000 UZS). Ilgari
    // `actionDebts` (faqat men boshqara oladiganlar) olinardi — o'sha qarz soni va summaga kirmasdi.
    // Amal oynasi (yopish/qaytarish) esa baribir faqat `actionDebts` bilan ishlaydi.
    openDebts() {
      if (!this.side || !this.group || this.group.kind === 'shop') return []
      return (this.group.items || []).filter((d) => this.isOpen(d) && !d.is_shop_debt)
    },
    // 02.10 (5-rasm): pastki ro'yxat — bo'lim ma'lum bo'lsa faqat AMALDAGI qarzlar ("Amaliyotlar")
    listItems() {
      const items = (this.group && this.group.items) || []
      return this.side ? items.filter((d) => this.isOpen(d)) : items
    },
    // Faol qarzlar jami qoldig'i valyuta bo'yicha ("1 200 000 UZS · 500 USD")
    openTotalsText() {
      const map = {}
      for (const d of this.openDebts) { const c = d.currency || 'UZS'; map[c] = (map[c] || 0) + (Number(d.remaining_amount) || 0) }
      return Object.keys(map).map((c) => this.formatMoney(map[c], c)).join(' · ')
    },
    relTone() {
      return REL_TONE[this.reliability.level] || 'none'
    },


    // SS-DEV (2026-09-24): valyuta bo'yicha jami (UZS, USD...). Bo'sh bo'lsa — 0 UZS.
    totalsByCurrency() {
      const g = this.group
      const list = (g && g.byCurrency) || []
      return list.length ? list : [{ currency: (g && g.currency) || 'UZS', borrowed: 0, lent: 0, net: 0 }]
    },

    // SS-DEV (2026-09-24): kelgan bo'lim (Faol/Tugallangan/...) — "Orqaga" shu bo'limga.
    currentTab() {
      return (this.$route && this.$route.query && this.$route.query.tab) || ''
    },
    // SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band: ro'yxatlar endi ALOHIDA sahifada
    // (/finance/debts/list/:kind) — "Orqaga" kelgan ro'yxat sahifasiga; eski `lent/borrowed/...`
    // qiymatlari ham xaritalanadi; bo'lim noma'lum bo'lsa — Shaxsiy qarz bosh sahifasi.
    backLink() {
      const kind = LIST_KIND_BY_TAB[this.currentTab]
      if (kind) return this.localePath({ name: 'finance-debts-list-kind', params: { kind } })
      return this.localePath({ name: 'finance-debts' })
    },
    // SS-DEV (2026-09-27), 26.09 hujjat 4-band: "To'lov qayd etish" → "Qarzni qaytarish" (5 til)
    texts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      // 29.09: sarlavha, bo'lim amallari, kartalar va Tavsiya matnlari (5 til)
      const t = {
        uz: {
          pay: 'Qarzni qaytarish', payHint: 'Qaytarilgan summa',
          back: 'Orqaga', titleLent: 'Qarz oluvchi', titleBorrowed: 'Qarz beruvchi', titleAll: 'Kontragent',
          badgeLent: 'Berilgan qarz', badgeBorrowed: 'Olingan qarz', noPhoneShort: 'Telefon kiritilmagan',
          giveMore: 'Yana qarz berish', takeMore: 'Yana qarz olish', giveDebt: 'Qarz berish', takeDebt: 'Qarz olish',
          close: 'Qarzni yopish', demand: 'Talab qilish', forgive: 'Voz kechish', sending: 'Yuborilmoqda...',
          noActive: "Aktiv qarzlar yo'q", dueShort: 'Muddat:',
          noPhoneDemand: "Qarzdorning telefon raqami kiritilmagan — qarz tafsilotida qo'shing",
          totalDebt: 'Jami qarz', collected: 'Undirilgan qarz', repaid: 'Qaytarilgan qarz', remaining: 'Qoldiq qarz',
          ops: 'Amaliyotlar', listAll: 'Qarzlar', countSuffix: 'ta qarz', alreadyClosed: 'Qarz allaqachon yopilgan',
          closeTitle: 'Qarzni yopish', closeYes: 'Ha, yopish', closedOk: 'Qarz yopildi',
          forgiveTitle: 'Qarzdan voz kechish', forgiveYes: 'Ha, voz kechaman', forgivenOk: 'Qarzdan voz kechildi',
          demandOk: "Talab bo'yicha SMS yuborildi", noCard: "Avval \"Plastik karta ma'lumotlari\"ni kiriting (Shaxsiy qarz bosh sahifasi)",
          paidOk: "To'lov qayd etildi", remainingLbl: 'Qoldiq', overRemaining: 'Summa qoldiqdan oshmasligi kerak', leaveEmpty: "Bo'sh qoldirsangiz — butun qoldiq yopiladi.", badAmount: "Noto'g'ri summa",
          activeNote: 'Faol qarzlar: {n} ta', forgivenMany: '{n} ta qarzdan voz kechildi',
          complaintSentShop: 'Shikoyatingiz do‘kon egasiga bildirishnoma sifatida yetkazildi. Qarz bo‘yicha o‘zgarish bo‘lsa, u shu yerda ko‘rinadi.',
          complaintSentPerson: 'Shikoyatingiz qarz bergan shaxsga bildirishnoma sifatida yetkazildi. Qarz bo‘yicha o‘zgarish bo‘lsa, u shu yerda ko‘rinadi.',
        },
        ru: {
          pay: 'Вернуть долг', payHint: 'Возвращённая сумма',
          back: 'Назад', titleLent: 'Должник', titleBorrowed: 'Кредитор', titleAll: 'Контрагент',
          badgeLent: 'Выданный долг', badgeBorrowed: 'Полученный долг', noPhoneShort: 'Телефон не указан',
          giveMore: 'Дать ещё в долг', takeMore: 'Взять ещё в долг', giveDebt: 'Дать в долг', takeDebt: 'Взять в долг',
          close: 'Закрыть долг', demand: 'Потребовать', forgive: 'Простить', sending: 'Отправка...',
          noActive: 'Нет активных долгов', dueShort: 'Срок:',
          noPhoneDemand: 'Телефон должника не указан — добавьте его в деталях долга',
          totalDebt: 'Общий долг', collected: 'Взысканный долг', repaid: 'Возвращённый долг', remaining: 'Остаток долга',
          ops: 'Операции', listAll: 'Долги', countSuffix: 'долгов', alreadyClosed: 'Долг уже закрыт',
          closeTitle: 'Закрыть долг', closeYes: 'Да, закрыть', closedOk: 'Долг закрыт',
          forgiveTitle: 'Простить долг', forgiveYes: 'Да, простить', forgivenOk: 'Долг прощён',
          demandOk: 'SMS с требованием отправлено', noCard: 'Сначала укажите данные пластиковой карты (главная страница «Личные долги»)',
          paidOk: 'Платёж записан', remainingLbl: 'Остаток', overRemaining: 'Сумма не должна превышать остаток', leaveEmpty: 'Если оставить пустым — будет погашен весь остаток.', badAmount: 'Неверная сумма',
          activeNote: 'Активные долги: {n}', forgivenMany: 'Прощено долгов: {n}',
          complaintSentShop: 'Ваша жалоба доставлена владельцу магазина в виде уведомления. Если по долгу будут изменения, они отобразятся здесь.',
          complaintSentPerson: 'Ваша жалоба доставлена кредитору в виде уведомления. Если по долгу будут изменения, они отобразятся здесь.',
        },
        kr: {
          pay: 'Қарзни қайтариш', payHint: 'Қайтарилган сумма',
          back: 'Орқага', titleLent: 'Қарз олувчи', titleBorrowed: 'Қарз берувчи', titleAll: 'Контрагент',
          badgeLent: 'Берилган қарз', badgeBorrowed: 'Олинган қарз', noPhoneShort: 'Телефон киритилмаган',
          giveMore: 'Яна қарз бериш', takeMore: 'Яна қарз олиш', giveDebt: 'Қарз бериш', takeDebt: 'Қарз олиш',
          close: 'Қарзни ёпиш', demand: 'Талаб қилиш', forgive: 'Воз кечиш', sending: 'Юборилмоқда...',
          noActive: 'Актив қарзлар йўқ', dueShort: 'Муддат:',
          noPhoneDemand: 'Қарздорнинг телефон рақами киритилмаган — қарз тафсилотида қўшинг',
          totalDebt: 'Жами қарз', collected: 'Ундирилган қарз', repaid: 'Қайтарилган қарз', remaining: 'Қолдиқ қарз',
          ops: 'Амалиётлар', listAll: 'Қарзлар', countSuffix: 'та қарз', alreadyClosed: 'Қарз аллақачон ёпилган',
          closeTitle: 'Қарзни ёпиш', closeYes: 'Ҳа, ёпиш', closedOk: 'Қарз ёпилди',
          forgiveTitle: 'Қарздан воз кечиш', forgiveYes: 'Ҳа, воз кечаман', forgivenOk: 'Қарздан воз кечилди',
          demandOk: 'Талаб бўйича SMS юборилди', noCard: 'Аввал "Пластик карта маълумотлари"ни киритинг (Шахсий қарз бош саҳифаси)',
          paidOk: 'Тўлов қайд этилди', remainingLbl: 'Қолдиқ', overRemaining: 'Сумма қолдиқдан ошмаслиги керак', leaveEmpty: 'Бўш қолдирсангиз — бутун қолдиқ ёпилади.', badAmount: 'Нотўғри сумма',
          activeNote: 'Фаол қарзлар: {n} та', forgivenMany: '{n} та қарздан воз кечилди',
          complaintSentShop: 'Шикоятингиз дўкон эгасига билдиришнома сифатида етказилди. Қарз бўйича ўзгариш бўлса, у шу ерда кўринади.',
          complaintSentPerson: 'Шикоятингиз қарз берган шахсга билдиришнома сифатида етказилди. Қарз бўйича ўзгариш бўлса, у шу ерда кўринади.',
        },
        en: {
          pay: 'Repay debt', payHint: 'Repaid amount',
          back: 'Back', titleLent: 'Borrower', titleBorrowed: 'Lender', titleAll: 'Counterparty',
          badgeLent: 'Debt given', badgeBorrowed: 'Debt received', noPhoneShort: 'No phone number',
          giveMore: 'Lend more', takeMore: 'Borrow more', giveDebt: 'Lend', takeDebt: 'Borrow',
          close: 'Close debt', demand: 'Demand', forgive: 'Waive', sending: 'Sending...',
          noActive: 'No active debts', dueShort: 'Due:',
          noPhoneDemand: "The borrower's phone number is missing — add it in the debt details",
          totalDebt: 'Total debt', collected: 'Collected debt', repaid: 'Repaid debt', remaining: 'Remaining debt',
          ops: 'Operations', listAll: 'Debts', countSuffix: 'debt(s)', alreadyClosed: 'The debt is already closed',
          closeTitle: 'Close debt', closeYes: 'Yes, close', closedOk: 'Debt closed',
          forgiveTitle: 'Waive debt', forgiveYes: 'Yes, waive', forgivenOk: 'Debt waived',
          demandOk: 'Demand SMS sent', noCard: 'First enter your bank card details (Personal debt main page)',
          paidOk: 'Payment recorded', remainingLbl: 'Remaining', overRemaining: 'Amount must not exceed the remaining balance', leaveEmpty: 'Leave empty to repay the whole balance.', badAmount: 'Invalid amount',
          activeNote: 'Active debts: {n}', forgivenMany: '{n} debts waived',
          complaintSentShop: 'Your complaint has been delivered to the shop owner as a notification. Any change to the debt will be shown here.',
          complaintSentPerson: 'Your complaint has been delivered to the lender as a notification. Any change to the debt will be shown here.',
        },
        kaa: {
          pay: 'Qarızdı qaytarıw', payHint: 'Qaytarılǵan summa',
          back: 'Artqa', titleLent: 'Qarız alıwshı', titleBorrowed: 'Qarız beriwshi', titleAll: 'Kontragent',
          badgeLent: 'Berilgen qarız', badgeBorrowed: 'Alınǵan qarız', noPhoneShort: 'Telefon kiritilmegen',
          giveMore: 'Jáne qarız beriw', takeMore: 'Jáne qarız alıw', giveDebt: 'Qarız beriw', takeDebt: 'Qarız alıw',
          close: 'Qarızdı jabıw', demand: 'Talap etiw', forgive: 'Waz keshiw', sending: 'Jiberilmekte...',
          noActive: 'Aktiv qarızlar joq', dueShort: 'Múddet:',
          noPhoneDemand: 'Qarızdardıń telefon nomeri kiritilmegen — qarız detallarında qosıń',
          totalDebt: 'Jámi qarız', collected: 'Óndirilgen qarız', repaid: 'Qaytarılǵan qarız', remaining: 'Qaldıq qarız',
          ops: 'Ámeliyatlar', listAll: 'Qarızlar', countSuffix: 'qarız', alreadyClosed: 'Qarız álleqashan jabılǵan',
          closeTitle: 'Qarızdı jabıw', closeYes: 'Awa, jabıw', closedOk: 'Qarız jabıldı',
          forgiveTitle: 'Qarızdan waz keshiw', forgiveYes: 'Awa, waz keshemen', forgivenOk: 'Qarızdan waz keshildi',
          demandOk: 'Talap boyınsha SMS jiberildi', noCard: 'Aldın "Plastik karta maǵlıwmatları"n kiritiń (Jeke qarız bas beti)',
          paidOk: 'Tólem dizimge alındı', remainingLbl: 'Qaldıq', overRemaining: 'Summa qaldıqtan aspawı kerek', leaveEmpty: 'Bos qaldırsańız — pútkil qaldıq jabıladı.', badAmount: 'Nadurıs summa',
          activeNote: 'Aktiv qarızlar: {n}', forgivenMany: '{n} qarızdan waz keshildi',
          complaintSentShop: 'Shaǵımıńız dúkan iyesine bildiriw retinde jetkerildi. Qarız boyınsha ózgeris bolsa, ol usı jerde kórinedi.',
          complaintSentPerson: 'Shaǵımıńız qarız bergen adamǵa bildiriw retinde jetkerildi. Qarız boyınsha ózgeris bolsa, ol usı jerde kórinedi.',
        },
      }
      return t[l] || t.uz
    },

    // SS-DEV (2026-09-24): shikoyat nishoni — do'kon qarzi yoki hamkor qaydi.
    complaintTarget() {
      return this.complaintKind === 'person' ? this.mirrorDebt : this.shopDebt
    },
    // SS-DEV (2026-09-24): sabab tanlangan YOKI izoh yozilgan bo'lsa yuborish mumkin.
    complaintCanSend() {
      return !!(this.complaintReason || String(this.complaintNote || '').trim())
    },

    // SS-DEV (2026-09-24): hamkor qaydi bo'yicha QAYTARISHLAR (kim/qachon), marker yozuvlarsiz.
    mirrorPayments() {
      const d = this.mirrorDebt
      if (!d || !Array.isArray(d.payments)) return []
      const myId = this.$auth && this.$auth.user && this.$auth.user.id
      return d.payments
        .filter((p) => !/^__increase__/.test(String(p.notes || '')))
        .map((p) => {
          const forgive = /^__forgive__/.test(String(p.notes || ''))
          const byMe = !!(p.created_by && myId && Number(p.created_by) === Number(myId))
          // Hamkor qaydida: egasi (owner) = qarshi tomon; men = counterparty
          const role = p.created_by_role === 'owner'
            ? (d.type === 'lent' ? 'qarz oluvchi' : 'qarz beruvchi')
            : (d.type === 'lent' ? 'qarz beruvchi' : 'qarz oluvchi')
          const by = byMe ? 'Siz' : ((p.created_by_name || 'Hamkor') + ' (' + role + ')')
          return { ...p, kind: forgive ? 'forgive' : 'payment', by, byMe }
        })
        .sort((a, b) => new Date(a.created_at || a.payment_date) - new Date(b.created_at || b.payment_date))
    },

    // SS-DEV (2026-09-24): qisman to'lov summasi — "122 000" formatida ko'rinadi/kiritiladi.
    mirrorPayDisplay: {
      get() { return this.fmtNum(this.mirrorPayAmount) },
      set(v) { const r = String(v || '').replace(/\D/g, ''); this.mirrorPayAmount = r ? Number(r) : '' }
    },
    mirrorPayOver() {
      const a = Number(this.mirrorPayAmount) || 0
      const rem = Number(this.mirrorDebt && this.mirrorDebt.remaining_amount) || 0
      return a > 0 && a > rem + 0.0001
    },

    // SS-DEV (2026-09-24): do'kon guruhi sarlavhasi uchun manzil/telefon (qarz yozuvlaridan).
    shopInfo() {
      const g = this.group
      if (!g || g.kind !== 'shop') return { address: '', phone: '' }
      const it = (g.items || []).find((d) => d.shop_region || d.shop_district || d.shop_phone || d.owner_phone) || {}
      return {
        address: [it.shop_region, it.shop_district].filter(Boolean).join(', '),
        // SS-DEV (2026-09-24): do'kon Telegram telefoni bo'lmasa — do'kon EGASINING telefoni
        phone: it.shop_phone || it.owner_phone || '',
      }
    },

    // SS-19: tasdiqlash modalining matni — amal turiga qarab.
    // SS-DEV (2026-09-24): ism "Sarlavha Ko'rinishi"da; voz kechish ikonkasi 🕊️; yashirish qo'shildi.
    confirmCfg() {
      const name = titleCaseName((this.mirrorDebt && this.mirrorDebt.source_name) || '')
      if (this.confirmKind === 'hide') {
        return {
          title: "Ro'yxatdan olib tashlash",
          message: `«${name}» bilan tugallangan qarz FAQAT sizning ro'yxatingizdan o'chiriladi — «${name}» tomonida saqlanib qoladi.`,
          confirmText: 'Ha, olib tashlash', tone: 'danger', icon: '🗑',
        }
      }
      // SS-DEV (2026-09-24): ro'yxatdagi tugallangan qatorni o'chirish (o'z qaydim yoki hamkor qaydi).
      if (this.confirmKind === 'rowdelete') {
        const gname = (this.group && this.group.name) || ''
        return {
          title: "O'chirish",
          message: `«${gname}» bilan tugallangan qarz FAQAT sizning ro'yxatingizdan o'chiriladi — qarshi tomonda saqlanib qoladi.`,
          confirmText: "Ha, o'chirish", tone: 'danger', icon: '🗑',
        }
      }
      return {
        title: 'Qarzdan voz kechish',
        message: `«${name}» sizga qarzdor. Voz kechasizmi? Qarz yopiladi va pul qaytmaydi.`,
        confirmText: 'Ha, voz kechaman', tone: 'danger', icon: '🚫',
      }
    },

    // Avatar rang klassi: do'kon → amber; shaxs → qizil/yashil, aralash bo'lsa kulrang.
    avatarClass() {
      const g = this.group
      if (!g) return 'bg-gray-100 text-gray-600'
      if (g.kind === 'shop') return 'bg-amber-100 text-amber-600'
      if (g.mixed) return 'bg-gray-100 text-gray-600'
      if (g.displayType === 'lent') return 'bg-green-100 text-green-600'
      return 'bg-red-100 text-red-600'
    }
  },

  async mounted() {
    await this.loadDebts()
    this.loadReliability()
  },

  methods: {
    botNoteText,
    titleCaseName,

    // Guruh sahifasi BARCHA qarzlarni (faol + tugallangan) yuklaydi — kontragent
    // bo'yicha to'liq tarix ko'rinishi uchun filtr qo'yilmaydi.
    async loadDebts() {
      try {
        this.loading = true
        // 29.09: `limit` berilmasa backend faqat 20 ta qaytarardi (eski kontragent qarzlari tushib qolardi) —
        // ro'yxat sahifasi bilan bir xil 100 (backend maksimumi).
        const res = await this.$api.getPersonalDebts({ limit: 100 })
        if (res && res.data && res.data.success) {
          const own = res.data.data || []
          const mirrors = res.data.mirror_debts || []
          this.debts = [...own, ...mirrors].sort((a, b) =>
            new Date(b.created_at || 0) - new Date(a.created_at || 0))
        }
      } catch (error) {
        console.error('Load debts error:', error)
        this.$toast && this.$toast.error && this.$toast.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    // Shu kontragentga yana qarz berish/olish havolasi.
    addDebtLink(type) {
      const query = { type }
      const g = this.group
      if (g) {
        if (g.name) query.name = g.name
        if (g.phone) query.phone = g.phone
      }
      return this.localePath({ name: 'finance-debts-add', query })
    },

    // ===== 29.09 (doc1 20–22-rasm): Tavsiya + sarlavhadagi amallar =====

    /**
     * Tavsiya — backend'ning qarz tafsiloti javobidagi `reliability` (tafsilot sahifasida qanday
     * ko'rsatilgan bo'lsa AYNAN shunday). Kontragentning eng oxirgi O'Z qaydi olinadi; bunday qayd
     * bo'lmasa (faqat hamkor qaydi/do'kon) — "Hozircha ma'lumot yo'q".
     */
    async loadReliability() {
      const g = this.fullGroup
      const own = g && g.kind !== 'shop' ? (g.items || []).find((d) => !d.is_mirror && !d.is_shop_debt) : null
      if (!own) { this.reliability = { level: 'none', total: 0, on_time: 0, late: 0 }; return }
      try {
        const res = await this.$api.getDebtById(own.id)
        const r = res && res.data && res.data.reliability
        if (r && r.level) this.reliability = { level: r.level, total: Number(r.total) || 0, on_time: Number(r.on_time) || 0, late: Number(r.late) || 0 }
      } catch (_) { /* Tavsiya ixtiyoriy — xatoda "ma'lumot yo'q" holati qoladi */ }
    },

    // Qarz bo'yicha HAQIQIY to'lovlar yig'indisi (qo'shimcha qarz / voz kechish markerlarisiz).
    // 02.10 (2-rasm): qarz summasidan oshmaydi (eski, 24.09 gacha yozilgan ortiqcha to'lovlar ko'rsatilmaydi).
    paidOf(d) {
      if (!d) return 0
      if (Array.isArray(d.payments)) {
        const sum = d.payments.filter((p) => !MARKER_RE.test(String(p.notes || ''))).reduce((s, p) => s + (Number(p.amount) || 0), 0)
        const total = Number(d.amount) || 0
        return total > 0 ? Math.min(sum, total) : sum
      }
      if (d.paid_amount != null) return Number(d.paid_amount) || 0
      return this.isForgiven(d) ? 0 : Math.max(0, (Number(d.amount) || 0) - (Number(d.remaining_amount) || 0))
    },

    // Pastel tugma klassi; o'chiq holat — kulrang (Tailwind 2.2 `disabled:` varianti ishlamaydi).
    actBtnClass(active, isDisabled) {
      return ['inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
        isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : active]
    },

    // 30.09 (doc1 17/19/20-rasm): qarz tanlash oynasini ochish ('close' | 'pay' | 'forgive')
    openActModal(mode) {
      if (!this.actionDebts.length || this.actBusy) return
      this.actModal = mode
    },

    // Mahalliy sana (YYYY-MM-DD) — toISOString UTC bo'lgani uchun 00:00–05:00 da kechagi kunni berardi.
    todayYmd() {
      const d = new Date()
      const p = (n) => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
    },

    // Amaldan keyin: ro'yxat + tavsiya yangilanadi (yopilgan qarz tavsiyaga ta'sir qiladi).
    async afterAct(msg) {
      this.$toast && this.$toast.success && this.$toast.success(msg)
      this.confirmKind = ''
      this.actModal = ''
      await this.loadDebts()
      this.loadReliability()
    },
    // 02.10 (2-rasm): server `code` bo'yicha joriy tilda (server matni faqat o'zbekcha bo'lishi mumkin)
    errMsg(e) {
      const d = (e && e.response && e.response.data) || {}
      if (d.code === 'over-remaining') return this.texts.overRemaining
      if (d.code === 'already-closed') return this.texts.alreadyClosed
      return d.message || this.$t('errors.operationFailed')
    },
    actError(e) {
      this.$toast && this.$toast.error && this.$toast.error(this.errMsg(e))
    },

    /**
     * Tanlash oynasi natijasi: forgive — bir nechta qarz; close/pay — tanlangan qarz(lar) (to'liq yoki qisman).
     * 01.10 (doc3 5/6-rasm): bir valyutada BIR NECHTA qarz — summa muddati yaqin qarzdan boshlab taqsimlanadi.
     * 02.10 (3–4-rasm): tanlov bir nechta VALYUTADA bo'lishi mumkin — `amounts` (valyuta → summa|null).
     */
    onActConfirm({ debts, amount, amounts }) {
      if (!debts || !debts.length) return
      if (this.actModal === 'forgive') return this.actForgiveMany(debts)
      return this.actPayGroups(debts, amounts || null, amount)
    },

    /**
     * 02.10 (3–4-rasm): har valyuta ALOHIDA (backend bitta valyutani taqsimlaydi; UZS va USD qo'shilmaydi):
     * guruhda bitta qarz → oddiy to'lov, bir nechta → allocate-payment. Ketma-ket; o'rtada xato bo'lsa
     * bajarilganlari saqlanadi, ro'yxat yangilanadi va xato aniq ko'rsatiladi. Oxirida BITTA xabar.
     */
    async actPayGroups(debts, amounts, legacyAmount) {
      if (this.actBusy) return
      const groups = groupByCurrency(debts)
      this.actBusy = true
      let done = 0
      let allClosed = true
      try {
        for (const g of groups) {
          const raw = amounts ? amounts[g.currency] : (groups.length === 1 ? legacyAmount : null)
          const want = Number(raw) > 0 ? Number(raw) : null
          const closed = g.debts.length === 1 ? await this.payOne(g.debts[0], want) : await this.payMany(g.debts, want)
          done += 1
          if (!closed) allClosed = false
        }
        await this.afterAct(allClosed ? this.texts.closedOk : this.texts.paidOk)
      } catch (e) {
        if (done) { this.actModal = ''; await this.loadDebts() }
        this.actError(e)
      } finally { this.actBusy = false }
    },

    /**
     * Bitta qarz: o'z qaydim → POST /finance/debts/:id/payments (qoldiqqa teng bo'lsa backend 'completed' qiladi);
     * hamkor qaydi (men qarz beruvchi) → mirror-payment. `amount` null — butun qoldiq. Qaytaradi: yopildimi.
     */
    async payOne(debt, amount) {
      const full = Number(debt.remaining_amount) || 0
      const amt = amount > 0 ? amount : full
      const res = debt.is_mirror
        ? await this.$api.mirrorPayDebt(debt.id, amount > 0 ? { amount } : {})
        : await this.$api.addDebtPayment(debt.id, { amount: amt, payment_date: this.todayYmd() })
      if (!(res && res.data && res.data.success)) throw new Error('payment failed')
      return amt + 0.0001 >= full
    },

    /**
     * 01.10 (doc3 5/6-rasm): bir valyutadagi bir nechta qarzga BITTA summa — serverda bitta tranzaksiya
     * (POST /finance/debts/allocate-payment). Backend hali yangilanmagan bo'lsa (marshrut 404) —
     * xuddi shu tartibda ketma-ket to'lovlar (utils/debtAllocation). Qaytaradi: hammasi yopildimi.
     */
    async payMany(debts, amount) {
      const total = debts.reduce((s, d) => s + (Number(d.remaining_amount) || 0), 0)
      const paid = amount > 0 ? amount : total
      const payload = { ids: debts.map((d) => d.id), payment_date: this.todayYmd() }
      if (amount > 0) payload.amount = amount
      try {
        const res = await this.$api.allocateDebtPayment(payload)
        if (!(res && res.data && res.data.success)) throw new Error('allocate failed')
      } catch (e) {
        const r = e && e.response
        const routeMissing = r && r.status === 404 && !(r.data && r.data.code)
        if (!routeMissing) throw e
        await this.allocateSequential(debts, amount)
      }
      return paid + 0.0001 >= total
    },
    /** Zaxira: taqsimot bo'yicha ketma-ket to'lovlar (xato bo'lsa chaqiruvchi ro'yxatni yangilaydi). */
    async allocateSequential(debts, amount) {
      const plan = allocatePayment(debts, amount > 0 ? amount : null)
      for (const a of plan.allocations) {
        if (!(a.pay > 0)) continue
        const d = a.debt
        const res = d.is_mirror
          ? await this.$api.mirrorPayDebt(d.id, { amount: a.pay })
          : await this.$api.addDebtPayment(d.id, { amount: a.pay, payment_date: this.todayYmd() })
        if (!(res && res.data && res.data.success)) throw new Error('payment failed')
      }
      return true
    },

    /** Tanlangan qarzlardan ketma-ket voz kechish; qisman muvaffaqiyat ham aniq aytiladi. */
    async actForgiveMany(debts) {
      if (this.actBusy) return
      this.actBusy = true
      let ok = 0
      let firstErr = null
      try {
        for (const d of debts) {
          try {
            const res = d.is_mirror ? await this.$api.mirrorForgiveDebt(d.id) : await this.$api.forgivePersonalDebt(d.id)
            if (res && res.data && res.data.success) ok += 1
          } catch (e) { if (!firstErr) firstErr = e }
        }
      } finally { this.actBusy = false }
      if (firstErr) this.actError(firstErr)
      if (ok > 0) await this.afterAct(ok > 1 ? this.texts.forgivenMany.replace('{n}', ok) : this.texts.forgivenOk)
      else this.actModal = ''
    },

    /**
     * 30.09 (doc1 18/21-rasm): "Talab qilish" — SMS yuboriladi. Karta kiritilmagan bo'lsa (backend
     * `no-card`) — xato EMAS, karta oynasi ochiladi; saqlangach shu talab avtomatik qayta yuboriladi.
     * API {silent} — barcha xabarlar faqat shu yerda (bitta toast).
     */
    async actDemand() {
      const tg = this.demandTarget
      if (!tg || this.actBusy) return
      await this.sendDemand(tg, 'act')
    },
    async sendDemand(debt, origin) {
      const busyKey = origin === 'mirror' ? 'mirrorBusy' : 'actBusy'
      if (this[busyKey]) return
      this[busyKey] = true
      if (origin !== 'mirror') this.actKind = 'demand'
      try {
        const res = debt.is_mirror ? await this.$api.mirrorDemandDebt(debt.id) : await this.$api.demandRepayment(debt.id)
        if (res && res.data && res.data.success !== false) this.$toast && this.$toast.success && this.$toast.success(this.texts.demandOk)
      } catch (e) {
        const d = (e && e.response && e.response.data) || {}
        if (d.code === 'no-card') {
          this.pendingDemand = { debt, origin }
          this.showCardModal = true
        } else {
          this.actError(e)
          const reason = d.reason || (d.sms && d.sms.reason)
          if (d.code === 'sms-not-sent' && reason === 'NO_PACKAGE') this.$router.push(this.localePath({ name: 'price' }))
        }
      } finally { this[busyKey] = false; this.actKind = '' }
    },
    // Karta saqlandi → kutilayotgan talab darhol yuboriladi
    async onCardSaved() {
      this.showCardModal = false
      const p = this.pendingDemand
      this.pendingDemand = null
      if (p && p.debt) await this.sendDemand(p.debt, p.origin)
    },

    openDebt(id) {
      // SS-DEV (2026-09-24): tafsilot sahifasidan "Orqaga" shu kontragent + shu bo'limga qaytsin
      this.$router.push(this.localePath({
        name: 'finance-debts-id', params: { id },
        query: { tab: this.currentTab, group: this.routeKey }
      }))
    },

    // SS-DEV (2026-09-24): "1222222" → "1 222 222".
    // ILDIZ SABAB (3–4-rasm, qoldiq 79 000 → oynada "7 900 000"): backend qoldiqni
    // DECIMAL sifatida "79000.00" qatorida qaytaradi; `replace(/\D/g,'')` nuqtani
    // ham o'chirib "7900000" ga aylantirardi (×100). Endi avval songa keltirib,
    // butun qismini formatlaymiz.
    fmtNum(v) {
      if (v === '' || v == null) return ''
      const n = Number(String(v).replace(/\s/g, '').replace(',', '.'))
      if (!isFinite(n)) return ''
      const r = String(Math.round(Math.abs(n)))
      return r.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    },
    // SS-DEV (2026-09-24): voz kechilgan qarz — `__forgive__` marker yoki notes'dagi "Kechirilgan".
    isForgiven(debt) {
      if (!debt || debt.status !== 'completed') return false
      const pays = Array.isArray(debt.payments) ? debt.payments : []
      if (pays.some((p) => /^__forgive__/.test(String(p.notes || '')))) return true
      return /Kechirilgan|voz kechildi/i.test(String(debt.notes || ''))
    },
    // 'active' YOKI 'overdue' — ochiq qarz
    isOpen(debt) {
      return !!debt && (debt.status === 'active' || debt.status === 'overdue')
    },

    // SS-DEV (2026-09-24): tugallangan qatorni o'chirish — tasdiq so'raladi.
    askRowDelete(debt) {
      if (!debt || debt.status !== 'completed' || debt.is_shop_debt) return
      this.rowDeleteDebt = debt
      this.confirmKind = 'rowdelete'
    },
    async rowDelete() {
      const d = this.rowDeleteDebt
      if (!d || this.mirrorBusy) return
      this.mirrorBusy = true
      try {
        // Hamkor qaydi → mirror-hide; o'z qaydim → delete (backend tugallanganni bir tomonlama yashiradi)
        const res = d.is_mirror ? await this.$api.mirrorHideDebt(d.id) : await this.$api.deleteDebt(d.id)
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success("Ro'yxatingizdan olib tashlandi")
          this.confirmKind = ''
          this.rowDeleteDebt = null
          await this.loadDebts()
          if (!this.group) this.$router.push(this.backLink)
        }
      } catch (e) {
        const msg = (e.response && e.response.data && e.response.data.message) || this.$t('errors.operationFailed')
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally { this.mirrorBusy = false }
    },

    // SS-DEV (2026-09-24): hamkor qaydi (men qarzdor) bo'yicha shikoyat.
    openPersonComplaint() {
      this.complaintKind = 'person'
      this.complaintReason = ''
      this.complaintNote = ''
      this.complaintSent = false
      this.showMirror = false
      this.showComplaint = true
    },
    backToDebtFromComplaint() {
      this.showComplaint = false
      if (this.complaintKind === 'person') this.showMirror = true
      else this.showShopDebt = true
    },

    // O'z qarzim → tafsilot sahifasi; do'kon/ko'zgu → shu sahifadagi modal.
    onDebtClick(debt) {
      if (!debt) return
      if (debt.is_shop_debt) {
        this.shopDebt = debt
        this.showShopDebt = true
        return
      }
      if (debt.is_mirror) {
        this.mirrorDebt = debt
        this.showMirror = true
        return
      }
      this.openDebt(debt.id)
    },

    // SS-19: tasdiqlash modalini ochish (native confirm() o'rniga).
    askMirrorForgive() { if (!this.mirrorBusy) this.confirmKind = 'forgive' },
    askMirrorHide() { if (!this.mirrorBusy) this.confirmKind = 'hide' },
    onConfirmAccept() {
      if (this.confirmKind === 'hide') return this.mirrorHide()
      if (this.confirmKind === 'rowdelete') return this.rowDelete()
      return this.mirrorForgive()
    },

    // SS-DEV (2026-09-24): tugallangan hamkor qaydini o'z ro'yxatimdan olib tashlash (bir tomonlama).
    async mirrorHide() {
      if (this.mirrorBusy || !this.mirrorDebt) return
      this.mirrorBusy = true
      try {
        const res = await this.$api.mirrorHideDebt(this.mirrorDebt.id)
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success("Ro'yxatingizdan olib tashlandi")
          this.confirmKind = ''
          this.showMirror = false
          await this.loadDebts()
          // Guruhda boshqa qarz qolmagan bo'lsa — ro'yxatga qaytamiz
          if (!this.group) this.$router.push(this.localePath({ name: 'finance-debts' }))
        }
      } catch (e) {
        const msg = (e.response && e.response.data && e.response.data.message) || this.$t('errors.operationFailed')
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally { this.mirrorBusy = false }
    },

    // SS-DEV (2026-09-24): do'kon qarzi bo'yicha shikoyat.
    openComplaint() {
      this.complaintKind = 'shop'
      this.complaintReason = ''
      this.complaintNote = ''
      this.complaintSent = false
      this.showShopDebt = false
      this.showComplaint = true
    },
    async submitComplaint() {
      const target = this.complaintTarget
      if (this.complaintBusy || !this.complaintCanSend || !target) return
      this.complaintBusy = true
      try {
        // SS-DEV (2026-09-24): sabab tanlanmagan bo'lsa backend `other` deb saqlaydi (izoh majburiy).
        const reason = this.complaintReason || 'other'
        const note = String(this.complaintNote || '').trim()
        const res = this.complaintKind === 'person'
          ? await this.$api.personDebtComplaint(target.id, reason, note)
          : await this.$api.shopDebtComplaint(target.id, reason, note)
        if (res && res.data && res.data.success) {
          this.complaintSent = true
          if (res.data.duplicate) this.$toast && this.$toast.info && this.$toast.info('Bu shikoyat allaqachon yuborilgan')
        }
      } catch (e) {
        const msg = (e.response && e.response.data && e.response.data.message) || this.$t('errors.operationFailed')
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally { this.complaintBusy = false }
    },

    // SS-4: lender — qisman to'lov modali.
    openMirrorPay() {
      if (this.mirrorBusy) return
      this.mirrorPayAmount = ''
      this.showMirrorPay = true
    },
    async submitMirrorPay() {
      const raw = String(this.mirrorPayAmount || '').replace(/\s/g, '').replace(',', '.')
      if (raw && !(parseFloat(raw) > 0)) {
        this.$toast && this.$toast.error && this.$toast.error("Noto'g'ri summa")
        return
      }
      // SS-DEV (2026-09-24): qoldiqdan ortiq summa yuborilmaydi (backend ham rad etadi).
      if (this.mirrorPayOver) {
        this.$toast && this.$toast.error && this.$toast.error(this.texts.overRemaining)
        return
      }
      // Bo'sh bo'lsa — backend butun qoldiqni yopadi (amount yubormaymiz).
      await this.mirrorPay(raw ? { amount: parseFloat(raw) } : {})
      this.showMirrorPay = false
    },

    /**
     * SS-4: ko'zgu qarz bo'yicha to'lovni qayd etish (POST mirror-payment).
     * `payload.amount` bo'lmasa — butun qoldiq yopiladi.
     */
    async mirrorPay(payload) {
      if (this.mirrorBusy || !this.mirrorDebt) return
      this.mirrorBusy = true
      try {
        const res = await this.$api.mirrorPayDebt(this.mirrorDebt.id, payload)
        if (res && res.data && res.data.success) {
          const rem = Number(res.data.remaining_amount) || 0
          this.$toast && this.$toast.success && this.$toast.success(
            rem <= 0 ? 'Qarz yopildi' : "To'lov qayd etildi"
          )
          this.confirmKind = ''
          this.showMirror = false
          await this.loadDebts()
        }
      } catch (e) {
        this.actError(e) // 02.10: `over-remaining` — joriy tilda
      } finally { this.mirrorBusy = false }
    },

    // Ko'zgu qarz (men lender) — voz kechish.
    async mirrorForgive() {
      if (this.mirrorBusy || !this.mirrorDebt) return
      this.mirrorBusy = true
      try {
        const res = await this.$api.mirrorForgiveDebt(this.mirrorDebt.id)
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success('Qarzdan voz kechildi')
          this.confirmKind = ''
          this.showMirror = false
          await this.loadDebts()
        }
      } catch (e) {
        const msg = (e.response && e.response.data && e.response.data.message) || this.$t('errors.operationFailed')
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally { this.mirrorBusy = false }
    },

    // Ko'zgu qarz (men lender) — qarzdorga talab SMS. 30.09: karta yo'q bo'lsa karta oynasi (sendDemand).
    async mirrorDemand() {
      if (this.mirrorBusy || !this.mirrorDebt) return
      await this.sendDemand(this.mirrorDebt, 'mirror')
    },

    formatMoney: formatMoneyCur, // SS-AUDIT (2026-09-25): utils/helpers

    // 29.09 (doc2 3-rasm): barcha sanalar "26.09.2026" ko'rinishida (ilgari toLocaleDateString — "2026-10-01" / "26/09/2026")
    formatDate(v) { return fmtDMY(v, '-') },

    // SS-DEV (2026-09-24): sana + vaqt (UZ, +5 — tafsilot sahifasidagi bilan bir xil)
    formatDateTime(dt) {
      if (!dt) return '-'
      const d = new Date(dt)
      if (isNaN(d)) return this.formatDate(dt)
      const x = new Date(d.getTime() + 5 * 3600 * 1000)
      const p = (n) => String(n).padStart(2, '0')
      return `${p(x.getUTCDate())}.${p(x.getUTCMonth() + 1)}.${x.getUTCFullYear()} ${p(x.getUTCHours())}:${p(x.getUTCMinutes())}`
    },

    // Telefonni chiroyli format ("+998 90 123 45 67")
    formatPhone: formatPhoneUz, // SS-AUDIT (2026-09-25): utils/helpers

    isOverdue(debt) {
      if (!debt.due_date || !this.isOpen(debt)) return false
      return new Date(debt.due_date) < new Date()
    },

    getPaidPercent(debt) {
      if (!debt.amount || debt.amount <= 0) return 0
      const paidAmount = debt.amount - (debt.remaining_amount || 0)
      return Math.round((paidAmount / debt.amount) * 100)
    }
  }
}
</script>
