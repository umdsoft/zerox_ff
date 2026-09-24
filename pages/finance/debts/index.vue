<template>
  <div class="personal-debts pb-8">
    <!-- SS6 (2026-09-17): "Qarz daftari" uslubidagi gradient hero — o'ngda "Qarz berish"/"Qarz olish" -->
    <!-- SS-26 (2026-09-19): "Orqaga" tugmasi olib tashlandi (chap menyu bor) -->
    <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-5 lg:p-6 text-white relative overflow-hidden mb-6">
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="sq-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#sq-grid)" />
        </svg>
      </div>
      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold mb-2">{{ $t('finance.personal_debts') }}</h1>
          <p class="text-blue-100 text-sm lg:text-base max-w-xl">{{ $t('finance.personal_debts_subtitle') || "Shaxsiy qarz oldi-berdilaringizni bir joyda boshqaring." }}</p>
          <!-- Plastik karta rekvizitlari — endi hero ichida yengil havola sifatida -->
          <button @click="openPayout" class="mt-3 inline-flex items-center gap-1.5 text-blue-50 hover:text-white text-sm font-medium underline decoration-blue-300/60 underline-offset-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h2m3 0h4M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"/></svg>
            {{ $t('finance.payout_card') || "Plastik karta ma'lumotlari" }}
          </button>
        </div>
        <div class="mt-5 lg:mt-0 flex flex-col sm:flex-row gap-3">
          <!-- Qarz berish (men beraman → lent) -->
          <nuxt-link
            :to="localePath({ name: 'finance-debts-add', query: { type: 'lent' } })"
            class="flex items-center justify-center px-6 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
            {{ $t('finance.debt_give') || 'Qarz berish' }}
          </nuxt-link>
          <!-- Qarz olish (men olaman → borrowed) -->
          <nuxt-link
            :to="localePath({ name: 'finance-debts-add', query: { type: 'borrowed' } })"
            class="flex items-center justify-center px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            {{ $t('finance.debt_take') || 'Qarz olish' }}
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- Plastik karta (rekvizit) modali — 2026-09-13 -->
    <div v-if="showPayout" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showPayout = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-900">💳 {{ $t('finance.payout_card') || "To'lov kartam" }}</h3>
          <button @click="showPayout = false" class="text-gray-400 hover:text-gray-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>
        <p class="text-xs text-gray-500 mb-3">{{ $t('finance.payout_card_hint') || "Sizga qarz qaytaruvchilar shu rekvizitlarga pul o'tkazadi." }}</p>
        <!-- SS-5 (2026-09-19): MyID'dan o'tmagan foydalanuvchi uchun FISh — kvitansiya va
             SMS'da "kim berdi/kim oldi" yozilishi uchun SHART. MyID tasdiqlagan bo'lsa
             (fish_locked) maydon faqat ko'rsatiladi, tahrirlanmaydi. -->
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.my_fish') || 'Sizning F.I.Sh' }}</label>
        <input
          v-model="payoutForm.fish"
          type="text"
          maxlength="100"
          :disabled="fishLocked"
          :style="fishLocked ? 'background:#F3F4F6; color:#6B7280' : ''"
          :placeholder="$t('finance.my_fish_ph') || 'Familiya Ism Sharif'"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl mb-1 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-gray-500 mb-3">{{ fishLocked ? ($t('finance.my_fish_locked') || 'MyID orqali tasdiqlangan — o\'zgartirib bo\'lmaydi.') : ($t('finance.my_fish_hint') || 'Kvitansiya va SMS xabarlarida shu ism ko\'rinadi.') }}</p>
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_card') || 'Plastik karta raqami' }}</label>
        <input :value="payoutForm.card_number" @input="onPayoutCardInput" type="text" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.gap_card_holder') || 'Karta egasi (FISH)' }}</label>
        <input v-model="payoutForm.card_holder" type="text" maxlength="100" :placeholder="$t('finance.gap_card_holder_ph') || 'Ism Familiya'" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
        <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.payout_tg_phone') || 'Telegram telefon (ixtiyoriy)' }}</label>
        <input v-model="payoutForm.telegram_phone" type="text" inputmode="numeric" maxlength="13" placeholder="+998901234567" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl mb-1 outline-none focus:ring-2 focus:ring-blue-500" />
        <p class="text-xs text-gray-500 mb-4">{{ $t('finance.payout_tg_phone_hint') || "Ixtiyoriy. Qarz qaytaruvchi Telegram orqali siz bilan bog'lana olishi uchun (to'lov haqida xabar berish). Bo'sh qoldirsangiz ham bo'ladi." }}</p>
        <div class="flex gap-2">
          <button @click="showPayout = false" class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">{{ $t('common.cancel') }}</button>
          <button @click="savePayout" :disabled="payoutBusy || !String(payoutForm.card_number || '').replace(/\D/g,'')" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-semibold">{{ payoutBusy ? '…' : $t('common.save') }}</button>
        </div>
      </div>
    </div>

    <!-- Bo'limlar navigatsiyasi -->
    <div v-if="_subLoaded && (features.sms_history || features.analytics)" class="bg-white rounded-2xl shadow-sm mb-6 p-1.5 flex gap-1.5 overflow-x-auto">
      <nuxt-link v-if="features.sms_history" :to="localePath({ name: 'finance-sms' })" class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap text-gray-600 hover:bg-gray-100">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        {{ $t('menu.sms') || 'SMS' }}
      </nuxt-link>
      <nuxt-link v-if="features.analytics" :to="localePath({ name: 'finance-debts-analytics' })" class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap text-gray-600 hover:bg-gray-100">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        {{ $t('finance.analytics') || 'Analitika' }}
      </nuxt-link>
    </div>

    <!-- Filters + Search -->
    <div class="bg-white rounded-2xl p-4 shadow-sm mb-6">
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeType = tab.value"
          class="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          :class="activeType === tab.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ tab.label }}
        </button>
      </div>
      <!-- S5: FISh / telefon / summa bo'yicha qidiruv -->
      <div class="relative">
        <svg class="w-5 h-5 text-gray-400 absolute left-3 pointer-events-none" style="top: 50%; transform: translateY(-50%);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input
          v-model="search"
          type="text"
          :placeholder="$t('finance.debt_search_ph')"
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <p class="text-sm text-gray-500">{{ $t('finance.total_borrowed') }}</p>
        <p class="text-2xl font-bold text-red-600 mt-1">{{ formatMoney(stats.borrowed_total) }}</p>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <p class="text-sm text-gray-500">{{ $t('finance.total_lent') }}</p>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ formatMoney(stats.lent_total) }}</p>
      </div>
      <div class="bg-white rounded-2xl p-5 shadow-sm">
        <p class="text-sm text-gray-500">{{ $t('finance.net_balance') }}</p>
        <p class="text-2xl font-bold mt-1" :class="stats.net_balance >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatMoney(stats.net_balance) }}
        </p>
      </div>
    </div>

    <!-- Debts List -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- SS-5 (2026-09-18): Kontragent bo'yicha guruhlangan ro'yxat (do'kon / shaxs).
           SS-27 (2026-09-19): guruh qatoriga bosilganda AKKORDEON emas, alohida
           sahifa ochiladi (/finance/debts/group/:key) — mobil ilovadagidek
           "ichiga kirish". Bitta qarzli guruh ham xuddi shu sahifaga boradi. -->
      <div v-if="filteredDebts.length" class="divide-y divide-gray-100">
        <div v-for="group in groupedDebts" :key="group.key">
          <!-- Guruh sarlavhasi (qator) -->
          <div
            class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="onGroupClick(group)"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center min-w-0">
                <!-- Avatar: do'kon ↔ shaxs ikonkasi (bosh harflar o'rniga) -->
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="groupAvatarClass(group)"
                >
                  <!-- Do'kon (store) ikonkasi -->
                  <svg v-if="group.kind === 'shop'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M4 21V10m16 11V10M3 10l1.5-6h15L21 10M3 10h18M9 21v-6h6v6"/></svg>
                  <!-- Shaxs (person) ikonkasi -->
                  <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <div class="ml-4 min-w-0">
                  <p class="font-semibold text-gray-900 flex items-center gap-1.5 flex-wrap">
                    <!-- SS-13: SHAXS ismi "Sarlavha Ko'rinishi"da; DO'KON nomi esa
                         brend sifatida qanday yozilgan bo'lsa shunday qoladi. -->
                    <span class="truncate">{{ group.kind === 'shop' ? group.name : titleCaseName(group.name) }}</span>
                    <!-- SS-4 (2026-09-19): ixcham kapsula teglar + to'liq tushuntirish tooltip'da -->
                    <span
                      v-if="group.kind === 'shop'"
                      class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style="background:#FEF3C7; color:#92400E;"
                      title="Bu qarz do‘kon tomonidan yuritiladi. Yopish/o‘zgartirish do‘kon egasining qo‘lida."
                    >🏪 Do‘kon</span>
                    <span
                      v-if="group.kind === 'shop'"
                      class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style="background:#EEF2FF; color:#3730A3;"
                      title="Ma’lumot faqat ko‘rish rejimida ulashilgan — bu yerdan o‘zgartirib bo‘lmaydi."
                    >👁 Faqat ko‘rish</span>
                    <span v-if="group.count > 1" class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{{ group.count }} {{ $t('finance.debt_count') || 'ta qarz' }}</span>
                  </p>
                  <p class="text-sm text-gray-500 truncate">
                    <span v-if="group.phone">{{ formatPhone(group.phone) }}</span>
                    <span v-else-if="group.kind === 'person'">{{ $t('finance.no_phone') || 'Telefon kiritilmagan' }}</span>
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <div class="text-right">
                  <p class="font-bold" :class="group.displayType === 'borrowed' ? 'text-red-600' : 'text-green-600'">
                    {{ group.displayType === 'borrowed' ? '-' : '+' }}{{ formatMoney(group.displayAmount, group.currency) }}
                  </p>
                  <p v-if="group.mixed" class="text-xs text-gray-400">{{ $t('finance.net_balance') || 'Sof qoldiq' }}</p>
                </div>
                <!-- SS-27 (2026-09-19): akkordeon o'rniga "ichiga kirish" ko'rsatkichi -->
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('finance.no_debts') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('finance.no_debts_desc') }}</p>
        <nuxt-link
          :to="localePath({ name: 'finance-debts-add' })"
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
        >
          {{ $t('finance.add_first_debt') }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import subscriptionMixin from '~/mixins/subscriptionMixin';
import { titleCaseName } from '~/utils/helpers';
// SS-27 (2026-09-19): guruhlash mantiqi guruh sahifasi bilan BIRGA ishlatiladi (DRY).
import { groupDebtsByCounterparty, encodeGroupKey } from '~/utils/debtGroups';

export default {
  name: 'PersonalDebts',
  middleware: 'auth',
  mixins: [subscriptionMixin],

  data() {
    return {
      debts: [],
      stats: {
        borrowed_total: 0,
        lent_total: 0,
        net_balance: 0
      },
      activeType: 'active',
      search: '',
      loading: true,
      // 2026-09-13: Plastik karta (qarzni qaytarish rekvizitlari) modali.
      showPayout: false,
      // SS-27 (2026-09-19): do'kon/ko'zgu qarz modallari endi KONTRAGENT SAHIFASIDA
      // (`finance/debts/group/_key.vue`) — bu sahifada faqat guruhlar ro'yxati bor.
      payoutBusy: false,
      // SS-5 (2026-09-19): `fish` — MyID'siz foydalanuvchining FISh i; MyID bo'lsa qulflanadi.
      fishLocked: false,
      payoutForm: { card_number: '', card_holder: '', telegram_phone: '+998', fish: '' }
    }
  },

  computed: {
    tabs() {
      return [
        { value: 'active', label: this.$t('finance.status_active') },
        { value: 'borrowed', label: this.$t('finance.borrowed') },
        { value: 'lent', label: this.$t('finance.lent') },
        { value: 'completed', label: this.$t('finance.status_completed') },
        { value: 'all', label: this.$t('common.all') }
      ]
    },
    // S5: qidiruv — FISh / telefon / summa bo'yicha (client-side)
    filteredDebts() {
      const q = String(this.search || '').trim().toLowerCase()
      if (!q) return this.debts
      const digits = q.replace(/\D/g, '')
      return this.debts.filter((d) => {
        const name = String(d.source_name || '').toLowerCase()
        const phone = String(d.phone || '').replace(/\D/g, '')
        const amt = (String(d.amount || '') + ' ' + String(d.remaining_amount || '')).replace(/\D/g, ' ')
        if (name.includes(q)) return true
        if (digits && phone.includes(digits)) return true
        if (digits && amt.includes(digits)) return true
        return false
      })
    },

    // SS-5 (2026-09-18): filteredDebts'ni KONTRAGENT bo'yicha guruhlash.
    // SS-27 (2026-09-19): mantiq `~/utils/debtGroups` ga ajratildi — guruh sahifasi
    // (`group/_key.vue`) ham AYNAN shu guruhlashni qayta hisoblaydi.
    groupedDebts() {
      return groupDebtsByCounterparty(this.filteredDebts)
    }
  },

  watch: {
    activeType(v) {
      this.loadDebts()
      // SS-DEV (2026-09-24): tanlangan bo'lim URL'da saqlanadi — kontragent
      // sahifasidan "Orqaga" qaytganda AYNI bo'lim (masalan "Tugallangan") ochiladi.
      // Talab: «orqaga bosganimda Faol qarzlar bo'limiga o'tib qolmoqda».
      const cur = (this.$route.query && this.$route.query.type) || 'active'
      if (cur !== v) {
        this.$router.replace({ path: this.$route.path, query: { ...this.$route.query, type: v } }).catch(() => {})
      }
    }
  },

  async mounted() {
    await this.loadSubscriptionData();
    // Check query param for initial type
    if (this.$route.query.type) {
      this.activeType = this.$route.query.type
    }
    // PERF: loadDebts va loadStats mustaqil — parallel (ilgari ketma-ket edi)
    await Promise.all([this.loadDebts(), this.loadStats()])
  },

  methods: {
    // SS-13: FISh ni "Sarlavha" ko'rinishida chiqarish (template uchun).
    titleCaseName,

    async loadDebts() {
      try {
        this.loading = true
        const params = {}
        if (this.activeType === 'active' || this.activeType === 'completed') {
          params.status = this.activeType
        } else if (this.activeType === 'borrowed' || this.activeType === 'lent') {
          params.type = this.activeType
        }
        const res = await this.$api.getPersonalDebts(params)
        if (res?.data?.success) {
          // SS7: o'z qarzlarim + TELEFON bo'yicha ko'zgu qarzlar (boshqa userда meni kiritган —
          // menda teskari turда, faqat-o'qish). created_at bo'yicha aralashtiriladi.
          const own = res.data.data || []
          const mirrors = res.data.mirror_debts || []
          this.debts = [...own, ...mirrors].sort((a, b) =>
            new Date(b.created_at || 0) - new Date(a.created_at || 0))
        }
      } catch (error) {
        console.error('Load debts error:', error)
        this.$toast?.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    async loadStats() {
      try {
        const res = await this.$api.getDebtStats()
        if (res?.data?.success) {
          this.stats = res.data.data
        }
      } catch (error) {
        console.error('Load stats error:', error)
      }
    },

    openDebt(id) {
      this.$router.push(this.localePath({ name: 'finance-debts-id', params: { id } }))
    },

    // SS-27 (2026-09-19): guruh qatoriga bosish — AKKORDEON emas, kontragentning
    // alohida sahifasi ochiladi (mobil ilovadagidek "ichiga kirish"). Bitta qarzli
    // guruh ham izchillik uchun xuddi shu sahifaga boradi.
    onGroupClick(group) {
      if (!group) return
      this.$router.push(this.localePath({
        name: 'finance-debts-group-key',
        params: { key: encodeGroupKey(group.key) },
        // SS-DEV (2026-09-24): qaysi bo'limdan kirilgani — "Orqaga" shu bo'limga qaytadi
        query: { tab: this.activeType }
      }))
    },
    // Guruh avatarining rang klassi: do'kon → amber; shaxs → qizil/yashil (borrowed/lent),
    // aralash bo'lsa neytral kulrang.
    groupAvatarClass(group) {
      if (group.kind === 'shop') return 'bg-amber-100 text-amber-600'
      if (group.mixed) return 'bg-gray-100 text-gray-600'
      if (group.displayType === 'lent') return 'bg-green-100 text-green-600'
      return 'bg-red-100 text-red-600'
    },

    // 2026-09-13: Plastik karta (qarzni qaytarish rekvizitlari) — ochish/saqlash.
    async openPayout() {
      this.showPayout = true
      try {
        const res = await this.$api.getPayoutCard()
        const d = (res && res.data && res.data.data) || {}
        this.payoutForm = {
          card_number: d.card_number || '',
          card_holder: d.card_holder || '',
          telegram_phone: d.telegram_phone || '+998',
          // SS-5 (2026-09-19): MyID'siz foydalanuvchining FISh i — shu yerdan kiritiladi.
          fish: d.fish || ''
        }
        this.fishLocked = !!d.fish_locked
      } catch (_) { /* bo'sh forma qoladi */ }
    },
    onPayoutCardInput(e) {
      const d = String(e.target.value || '').replace(/\D/g, '').slice(0, 16)
      this.payoutForm.card_number = d.replace(/(.{4})/g, '$1 ').trim()
    },
    async savePayout() {
      const card = String(this.payoutForm.card_number || '').replace(/\D/g, '')
      if (!card) return
      try {
        this.payoutBusy = true
        const payload = {
          card_number: card,
          card_holder: String(this.payoutForm.card_holder || '').trim() || null,
          telegram_phone: String(this.payoutForm.telegram_phone || '').replace(/[^\d+]/g, '') || null
        }
        // FISh ni faqat tahrirlash mumkin bo'lganda yuboramiz (MyID qulfi bo'lsa — yo'q).
        if (!this.fishLocked) payload.fish = String(this.payoutForm.fish || '').trim()
        const res = await this.$api.savePayoutCard(payload)
        if (res && res.data && (res.data.success !== false)) {
          this.$toast && this.$toast.success && this.$toast.success(this.$t('finance.payout_card_saved') || 'Karta saqlandi')
          this.showPayout = false
        }
      } catch (e) {
        this.$toast && this.$toast.error && this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.payoutBusy = false }
    },

    formatMoney(value, currency) {
      const cur = currency || 'UZS'
      if (!value) return '0 ' + cur
      return Number(value).toLocaleString('uz-UZ').replace(/,/g,' ') + ' ' + cur
    },

    // (formatDate OLIB TASHLANDI — akkordeon o'chirilgach hech qayerda ishlatilmayapti;
    //  sana ko'rsatiladigan joylar endi kontragent sahifasida.)

    getInitials(name) {
      if (!name) return '?'
      return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    },

    getSourceType(type) {
      const types = {
        bank: this.$t('finance.source_bank'),
        family: this.$t('finance.source_family'),
        friend: this.$t('finance.source_friend'),
        other: this.$t('finance.source_other')
      }
      return types[type] || type
    },

    // Telefonni chiroyli format ("+998 90 123 45 67")
    formatPhone(p) {
      const d = String(p || '').replace(/\D/g, '')
      const r = d.startsWith('998') ? d.slice(3) : d
      if (r.length >= 9) return `+998 ${r.slice(0, 2)} ${r.slice(2, 5)} ${r.slice(5, 7)} ${r.slice(7, 9)}`
      return p
    },

    isOverdue(debt) {
      if (!debt.due_date || (debt.status !== 'active' && debt.status !== 'overdue')) return false // SS-DEV (2026-09-24): overdue ham ochiq
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
