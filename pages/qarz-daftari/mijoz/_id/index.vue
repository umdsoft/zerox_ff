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
      <div class="flex items-center gap-3 mb-4">
        <button @click="goBack" class="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm" :title="texts.back">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <!-- SS19: desktopda sarlavha sayt uslubida kattaroq (lg:text-3xl) -->
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{{ isOlish ? texts.qarzBeruvchi : texts.qarzOluvchi }}</h1>
      </div>

      <!-- SS19 (2026-09-21): desktopda 2 USTUNLI tartib —
           CHAPDA profil kartasi (1/3): ism, holat, telefon, do'kon, tarix havolasi;
           O'NGDA (2/3): statistika kataklari + amal tugmalari.
           `lg:` dan past ekranda grid UMUMAN yoqilmaydi — mobil ko'rinish
           avvalgidek ustma-ust (stack) bo'lib qoladi, regressiya yo'q. -->
      <div class="lg:grid lg:grid-cols-3 lg:gap-5 lg:items-start">

        <!-- ===== CHAP USTUN: profil + amaliyotlar tarixi ===== -->
        <div class="lg:col-span-1">
          <!-- Profil kartasi: ikonka + FISh + tahrirlash, telefon, do'kon -->
          <div class="bg-white rounded-2xl shadow-sm p-5 mb-3">
            <div class="flex items-center gap-4">
              <span :class="['w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0', isOlish ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600']">
                <svg class="w-9 h-9" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 1115 0v.25H4.5v-.25z"/>
                </svg>
              </span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                  <h2 class="text-lg font-bold text-gray-900 truncate min-w-0">{{ data.mijoz.fish }}</h2>
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
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold mt-1', hasActive ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600']">
                  {{ hasActive ? texts.active : texts.allClosed }}
                </span>
              </div>
            </div>

            <!-- SS19 / VAZIFA 2 (2026-09-21): telefon yonidagi SMS (`sms:`) va
                 qo'ng'iroq (`tel:`) tugmalari OLIB TASHLANDI. Sabab: sayt (brauzer)
                 orqali SMS yuborish yoki qo'ng'iroq qilish imkoniyati YO'Q — bu
                 tugmalar faqat mobil ilovada mantiqiy edi va foydalanuvchini
                 chalg'itardi. Telefon raqamining O'ZI matn sifatida QOLADI. -->
            <div class="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
              </svg>
              <p class="flex-1 min-w-0 text-sm text-gray-600 truncate">{{ data.mijoz.telefon || texts.noPhone }}</p>
            </div>

            <!-- Do'kon (savdo faoliyati) nomi -->
            <div v-if="dokonNomi" class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5h-3V21M3 9.75L4.5 3h15L21 9.75M3 9.75a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M3 9.75V21h18V9.75"/>
              </svg>
              <p class="text-sm text-gray-600 truncate">{{ dokonNomi }}</p>
            </div>
          </div>

          <!-- Amaliyotlar tarixi havolasi.
               SS7: "Kvitansiya" tugmasi bu yerdan OLIB TASHLANDI. Kvitansiya endi
               har bir amaliyotning O'Z tafsilot sahifasida (qarz-daftari/tranzaksiya/_id),
               chunki kvitansiya aniq bir amaliyotga (uning qarziga) tegishli. -->
          <div class="mb-3">
            <nuxt-link
              :to="localePath({ name: 'qarz-daftari-mijoz-id-amaliyotlar', params: { id: data.mijoz.id } }) + (turi ? '?turi=' + turi : '')"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl font-semibold text-sm transition-colors border border-gray-200 shadow-sm"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5M16.5 3L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
              </svg>
              {{ texts.history }}
            </nuxt-link>
          </div>
        </div>

        <!-- ===== O'NG USTUN: statistika kataklari + amal tugmalari ===== -->
        <div class="lg:col-span-2">
          <!-- SS19: ilgari IKKITA alohida `grid-cols-2` blok edi (Qoldiq/Undirilgan
               va Berilgan sana/Qaytarish sanasi). Endi BITTA grid: mobilda 2x2
               (aynan avvalgidek), xl (1280px+) ekranda 4 katak bir qatorda.
               Hech qanday qiymat yo'qolmadi — faqat joylashuvi zichlashdi. -->
          <div class="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-3">
            <div class="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-red-400">
              <p class="text-xs font-medium text-gray-500">{{ texts.qoldiqQarz }}</p>
              <p class="text-base font-bold text-gray-900 mt-1 leading-tight">{{ formatMoney(statsBox.qoldiqUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-semibold text-gray-600 mt-0.5 leading-tight">{{ formatMoney(statsBox.qoldiqUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-4 border-l-4 border-green-500">
              <p class="text-xs font-medium text-gray-500">{{ isOlish ? texts.qaytarilganQarz : texts.undirilganQarz }}</p>
              <p class="text-base font-bold text-gray-900 mt-1 leading-tight">{{ formatMoney(statsBox.undirilganUzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
              <p class="text-sm font-semibold text-gray-600 mt-0.5 leading-tight">{{ formatMoney(statsBox.undirilganUsd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-4">
              <p class="text-xs font-medium text-gray-500">{{ isOlish ? texts.lastDateOlish : texts.lastDateBerish }}</p>
              <p class="text-base font-bold text-gray-900 mt-1">{{ formatDate(lastBerilganSana) }}</p>
            </div>
            <div class="bg-white rounded-2xl shadow-sm p-4">
              <p class="text-xs font-medium text-gray-500">{{ texts.lastReturnDate }}</p>
              <p v-if="lastQaytarishSanasi" class="text-base font-bold text-gray-900 mt-1">{{ formatDate(lastQaytarishSanasi) }}</p>
              <p v-else-if="lastBolibTolash" class="text-sm font-bold text-purple-600 mt-1">{{ texts.installment }}: {{ lastBolibTolash.oylar_soni }} {{ texts.month }}</p>
              <p v-else class="text-base font-bold text-gray-300 mt-1">&mdash;</p>
            </div>
          </div>

          <!-- Amal tugmalari — mobilda 2x2 (mobil ilovadagi tartib saqlandi).
               SS19: "berish" turida 4 ta tugma bor, shuning uchun xl ekranda ular
               bir qatorga (4 ustun) chiqadi; "olish" turida atigi 2 ta tugma
               bo'lgani uchun cho'zilib ketmasin deb 2 ustunda qoladi. -->
          <div :class="['grid gap-3', isOlish ? 'grid-cols-2' : 'grid-cols-2 xl:grid-cols-4']">
            <!-- Yangi qarz (ko'k) -->
            <nuxt-link
              :to="newDebtUrl"
              class="flex items-center justify-center gap-2 px-3 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-sm text-center transition-colors shadow-sm"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6"/></svg>
              {{ texts.newDebtShort }}
            </nuxt-link>

            <!-- Qarzni yopish / qaytarish (yashil) -->
            <nuxt-link
              v-if="hasActive && lastActiveQarz"
              :to="localePath({ name: 'qarz-daftari-qarz-id-yopish', params: { id: lastActiveQarz.id } })"
              class="flex items-center justify-center gap-2 px-3 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold text-sm text-center transition-colors shadow-sm"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
              {{ isOlish ? texts.repay : texts.closeDebt }}
            </nuxt-link>
            <button
              v-else
              type="button"
              disabled
              :title="texts.noActiveDebts"
              class="flex items-center justify-center gap-2 px-3 py-3.5 bg-gray-100 text-gray-400 rounded-2xl font-semibold text-sm cursor-not-allowed"
            >
              <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
              {{ isOlish ? texts.repay : texts.closeDebt }}
            </button>

            <!-- Faqat BERISH uchun: talab qilish (sariq) + voz kechish (qizil) -->
            <template v-if="!isOlish">
              <!-- Tailwind 2.2 (JIT o'chiq) `disabled:` variantini generatsiya QILMAYDI —
                   shuning uchun o'chirilgan holat :class orqali beriladi. -->
              <button
                type="button"
                @click="talabQilish"
                :disabled="talabDisabled"
                :class="[
                  'flex items-center justify-center gap-2 px-3 py-3.5 rounded-2xl font-semibold text-sm text-center transition-colors',
                  talabDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-sm',
                ]"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.9" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
                {{ talabLoading ? texts.sending : texts.demand }}
              </button>
              <nuxt-link
                v-if="hasActive && lastActiveQarz"
                :to="localePath({ name: 'qarz-daftari-qarz-id-voz-kechish', params: { id: lastActiveQarz.id } })"
                class="flex items-center justify-center gap-2 px-3 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold text-sm text-center transition-colors shadow-sm"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                {{ texts.forgive }}
              </nuxt-link>
              <button
                v-else
                type="button"
                disabled
                :title="texts.noActiveDebts"
                class="flex items-center justify-center gap-2 px-3 py-3.5 bg-gray-100 text-gray-400 rounded-2xl font-semibold text-sm cursor-not-allowed"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                {{ texts.forgive }}
              </button>
            </template>
          </div>
          <p v-if="hasActive" class="text-xs text-gray-400 mt-2 text-center lg:text-left">{{ texts.actionsApplyTo }}</p>
          <p v-else class="text-xs text-gray-400 mt-2 text-center lg:text-left">{{ texts.noActiveDebts }}</p>
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
export default {
  middleware: 'auth',
  data() {
    return {
      data: null, loading: true, loadError: false, talabLoading: false, previousRouteName: null, bolibTolashList: [],
      // Qarz oluvchi (mijoz) ma'lumotlarini tahrirlash modali
      showEdit: false, editForm: { fish: '', telefon: '' }, editLoading: false,
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
    /** "Qaytarishni talab qilish" tugmasi o'chiq bo'ladimi */
    talabDisabled() {
      return this.talabLoading || !this.hasActive || !this.lastActiveQarz;
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
          closeDebt: "Qarzni yopish", forgive: "Qarzdan voz kechish",
          repay: "Qarzni qaytarish",
          active: "Aktiv", allClosed: "Barchasi yopilgan", noActiveDebts: "Aktiv qarzlar yo'q",
          newDebt: "Yangi qarz qo'shish", newDebtShort: "Yangi qarz",
          qoldiqQarz: "Qoldiq qarz", undirilganQarz: "Undirilgan qarz", qaytarilganQarz: "Qaytarilgan qarz",
          // SS19 (2026-09-21): smsTitle/callTitle OLIB TASHLANDI — sayt orqali SMS/qo'ng'iroq yo'q.
          noPhone: "Telefon raqami kiritilmagan",
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
        },
        ru: {
          title: "Детали долга", back: "Назад", history: "История операций", receipt: "Квитанция",
          jamiQarz: "Общий долг",
          lastDateBerish: "Дата выдачи", lastDateOlish: "Дата получения", lastReturnDate: "Дата возврата",
          installment: "Рассрочка", month: "мес",
          installmentTable: "График рассрочки",
          actions: "Действия",
          demand: "Потребовать возврат", sending: "Отправка...",
          closeDebt: "Закрыть долг", forgive: "Простить долг",
          repay: "Вернуть долг",
          active: "Активный", allClosed: "Все закрыты", noActiveDebts: "Нет активных долгов",
          newDebt: "Добавить новый долг", newDebtShort: "Новый долг",
          qoldiqQarz: "Остаток долга", undirilganQarz: "Взысканный долг", qaytarilganQarz: "Возвращённый долг",
          // SS19 (2026-09-21): smsTitle/callTitle OLIB TASHLANDI — sayt orqali SMS/qo'ng'iroq yo'q.
          noPhone: "Номер телефона не указан",
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
        },
        kr: {
          title: "Қарз тафсилоти", back: "Орқага", history: "Амалиётлар тарихи", receipt: "Квитансия",
          jamiQarz: "Жами қарз",
          lastDateBerish: "Берилган сана", lastDateOlish: "Олинган сана", lastReturnDate: "Қайтариш санаси",
          installment: "Бўлиб тўлаш", month: "ой",
          installmentTable: "Бўлиб тўлаш жадвали",
          actions: "Амаллар",
          demand: "Қайтаришни талаб қилиш", sending: "Юборилмоқда...",
          closeDebt: "Қарзни ёпиш", forgive: "Қарздан воз кечиш",
          repay: "Қарзни қайтариш",
          active: "Актив", allClosed: "Барчаси ёпилган", noActiveDebts: "Актив қарзлар йўқ",
          newDebt: "Янги қарз қўшиш", newDebtShort: "Янги қарз",
          qoldiqQarz: "Қолдиқ қарз", undirilganQarz: "Ундирилган қарз", qaytarilganQarz: "Қайтарилган қарз",
          // SS19 (2026-09-21): smsTitle/callTitle OLIB TASHLANDI — sayt orqali SMS/qo'ng'iroq yo'q.
          noPhone: "Телефон рақами киритилмаган",
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
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.load(); },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    formatDate(d) {
      if (!d) return '—';
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return `${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.${dt.getFullYear()}`;
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
          await this.loadTolovlarIfNeeded();
        } else {
          this.loadError = true;
        }
      } catch (_) { this.loadError = true; } finally { this.loading = false; }
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
    async onTolandi(tolovId) {
      try {
        await this.$axios.$put(`/qarz-daftari/tolov/${tolovId}/tolandi`, {}, { silent: true });
        await this.load();
        this.$toast?.success(this.$i18n?.locale === 'ru' ? 'Платёж отмечен' : (this.$i18n?.locale === 'kr' ? "Тўлов қайд этилди" : "To'lov belgilandi"));
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik');
      }
    },
    async talabQilish() {
      if (!this.lastActiveQarz) return;
      this.talabLoading = true;
      try {
        const res = await this.$axios.$post(`/qarz-daftari/qarz/${this.lastActiveQarz.id}/talab`, {}, { silent: true });
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
        const errMap = {
          'no-phone': {
            uz: "Mijozning telefon raqami kiritilmagan. Avval telefon raqamini qo'shing.",
            ru: 'Номер телефона клиента не указан. Сначала добавьте номер.',
            kr: "Мижознинг телефон рақами киритилмаган. Аввал телефон рақамини қўшинг.",
          },
          'sms-failed': {
            uz: 'SMS paketingiz tugagan. Iltimos, paket sotib oling.',
            ru: 'SMS пакет закончился. Пожалуйста, купите пакет.',
            kr: 'SMS пакетингиз тугаган. Илтимос, пакет сотиб олинг.',
          },
          'no-sms-package': {
            uz: 'SMS paketingiz tugagan. Tariflar bo\'limidan paket sotib oling.',
            ru: 'SMS пакет закончился. Купите пакет в разделе Тарифы.',
            kr: 'SMS пакетингиз тугаган. Тарифлар бўлимидан пакет сотиб олинг.',
          },
          'not-active': {
            uz: 'Bu qarz aktiv emas',
            ru: 'Этот долг не активен',
            kr: 'Бу қарз актив эмас',
          },
          'wrong-type': {
            uz: 'Faqat siz bergan qarzlar uchun talab yuborish mumkin',
            ru: 'Запрос можно отправлять только по выданным долгам',
            kr: 'Фақат сиз берган қарзлар учун талаб юбориш мумкин',
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
