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

    <!-- Bo'limlar navigatsiyasi.
         SS-DEV (2026-09-26), 25.09 "Xatolar" 7–8-rasm (13-band): "SMS boshqaruvi" havolasi BU YERDAN
         OLIB TASHLANDI — SMS boshqaruvi endi Tariflar (/price) sahifasida "SMS xabarlar tarixi"
         yonidagi "Batafsil" ostida ochiladi. -->
    <div v-if="_subLoaded && features.analytics" class="bg-white rounded-2xl shadow-sm mb-6 p-1.5 flex gap-1.5 overflow-x-auto">
      <nuxt-link v-if="features.analytics" :to="localePath({ name: 'finance-debts-analytics' })" class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap text-gray-600 hover:bg-gray-100">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        {{ $t('finance.analytics') || 'Analitika' }}
      </nuxt-link>
    </div>

    <!-- SS-DEV (2026-09-26), 25.09 "Shaxsiy moliya" 6→7-rasm (4-band): sahifa QARZ SHARTNOMASI
         (contract-dashboard) USLUBIDA — "Qarzdorliklar" ostida 4 ta karta (DashboardStats QAYTA
         ISHLATILDI): Berilgan qarz (ko'k, "Olish kerak") | Berilgan qarz muddati o'tgan | Olingan
         qarz (yashil, "Berish kerak") | Olingan qarz muddati o'tgan. Summalar valyuta bo'yicha
         (UZS + USD) — asosiy kartalar /finance/debts/stats (*_by_currency), muddati o'tganlar
         faol ro'yxatdan hisoblanadi.
         SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band (7-rasm): karta bosilganda ro'yxat SAHIFA OSTIDA
         OCHILMAYDI — Qarz shartnomasi/Qarz daftari kabi ALOHIDA SAHIFA (`/finance/debts/list/:kind`)
         ochiladi: kartalar `links` orqali oddiy nuxt-link (selectable rejim olib tashlandi).
         Funksiyalar (yopish/talab/voz kechish/ko'zgu, can_operate) O'ZGARMADI — kontragent sahifasida. -->
    <DashboardStats
      :texts="statsTexts"
      :labels="{ debitor: texts.lent, creditor: texts.borrowed }"
      :links="cardLinks"
      :debitor-uzs="cardSums.lentUzs"
      :debitor-usd="cardSums.lentUsd"
      :creditor-uzs="cardSums.borrowedUzs"
      :creditor-usd="cardSums.borrowedUsd"
      :expired-debitor-uzs="cardSums.lentOverdueUzs"
      :expired-debitor-usd="cardSums.lentOverdueUsd"
      :expired-creditor-uzs="cardSums.borrowedOverdueUzs"
      :expired-creditor-usd="cardSums.borrowedOverdueUsd"
    />

    <!-- Qo'shimcha bo'limlar: Tugallangan / Barchasi — ham alohida sahifa (list/completed, list/all) -->
    <div class="flex flex-wrap gap-2 mt-4">
      <nuxt-link
        v-for="tab in extraTabs"
        :key="tab.value"
        :to="listLink(tab.value)"
        class="px-4 py-2 rounded-lg font-medium transition-colors text-sm bg-white shadow-sm text-gray-600 hover:bg-gray-100"
      >
        {{ tab.label }}
      </nuxt-link>
    </div>

    <!-- SS-DEV (2026-09-27), 26.09 hujjat 3(a)-band (7-rasm): 4 karta OSTIDA Qarz shartnomasi
         sahifasidagidek ikki blok — "Muddati yaqin berilgan qarzlar" / "Muddati yaqin olingan qarzlar"
         (UZS/USD tab, jadval: kontragent | qolgan vaqt | summa). `DashboardNearExpiration` komponenti
         QAYTA ISHLATILDI (`showName` rejimi). Ma'lumot: GET /finance/debts/upcoming?days=7; endpoint
         bo'lmasa (404) — faol ro'yxatdan mijoz tomonida hisoblanadi (fallback). Qator → qarz sahifasi
         (o'z qarzim) yoki kontragent sahifasi (hamkor qaydi / do'kon qarzi). -->
    <DashboardNearExpiration
      :near-debitor="upcomingGivenRows"
      :near-creditor="upcomingTakenRows"
      :title-left="texts.upcomingGiven"
      :title-right="texts.upcomingTaken"
      :empty-text="texts.noUpcoming"
      :name-label="texts.counterparty"
      show-name
    />
  </div>
</template>

<script>
import subscriptionMixin from '~/mixins/subscriptionMixin';
import { titleCaseName } from '~/utils/helpers';
import DashboardStats from '~/components/dashboard/DashboardStats.vue'; // SS-DEV (2026-09-26): Qarz shartnomasi kartalari
import DashboardNearExpiration from '~/components/dashboard/DashboardNearExpiration.vue'; // SS-DEV (2026-09-27): muddati yaqin bloklari
// SS-27 (2026-09-19): guruh kaliti — kontragent sahifasiga havola uchun.
import { buildDebtGroupKey, encodeGroupKey } from '~/utils/debtGroups';

// SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band: eski `?type=` qiymatlari → yangi ro'yxat sahifasi turi
// (eski havolalar/bookmark'lar ishlashda davom etsin).
const LEGACY_TYPE_TO_KIND = { lent: 'given', lent_overdue: 'overdue-given', borrowed: 'taken', borrowed_overdue: 'overdue-taken', completed: 'completed', all: 'all' };
const UPCOMING_DAYS = 7;

export default {
  name: 'PersonalDebts',
  middleware: 'auth',
  mixins: [subscriptionMixin],
  components: { DashboardStats, DashboardNearExpiration },

  data() {
    return {
      // SS-DEV (2026-09-26): FAOL qarzlar (o'z + ko'zgu) — kartalardagi "muddati o'tgan" summalar
      // va (endpoint bo'lmasa) "muddati yaqin" bloklari shu massivdan (bitta so'rov, limit 100).
      activeDebts: [],
      stats: {
        borrowed_total: 0,
        lent_total: 0,
        net_balance: 0,
        lent_by_currency: [],
        borrowed_by_currency: []
      },
      // SS-DEV (2026-09-27), 26.09 hujjat 3(a)-band: /finance/debts/upcoming natijasi (null = fallback)
      upcoming: null,
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
    /** SS-DEV (2026-09-26): kartalarda yo'q toifalar — Tugallangan / Barchasi */
    extraTabs() {
      return [
        { value: 'completed', label: this.$t('finance.status_completed') },
        { value: 'all', label: this.$t('common.all') }
      ]
    },
    texts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      const t = {
        uz: { lent: 'Berilgan qarz', borrowed: 'Olingan qarz', lentOverdue: "Berilgan qarz — muddati o'tgan", borrowedOverdue: "Olingan qarz — muddati o'tgan", completed: 'Tugallangan qarzlar', all: 'Barcha qarzlar', summary: 'Qarzdorliklar', receivable: 'Olish kerak', payable: 'Berish kerak', overdue: "Muddati o'tgan", upcomingGiven: 'Muddati yaqin berilgan qarzlar', upcomingTaken: 'Muddati yaqin olingan qarzlar', noUpcoming: 'Hozircha muddati yaqin qarzlar yo‘q', counterparty: 'Kontragent' },
        ru: { lent: 'Выданный долг', borrowed: 'Полученный долг', lentOverdue: 'Выданный долг — просрочен', borrowedOverdue: 'Полученный долг — просрочен', completed: 'Завершённые долги', all: 'Все долги', summary: 'Задолженности', receivable: 'К получению', payable: 'К возврату', overdue: 'Просрочено', upcomingGiven: 'Выданные долги с близким сроком', upcomingTaken: 'Полученные долги с близким сроком', noUpcoming: 'Долгов с близким сроком пока нет', counterparty: 'Контрагент' },
        kr: { lent: 'Берилган қарз', borrowed: 'Олинган қарз', lentOverdue: 'Берилган қарз — муддати ўтган', borrowedOverdue: 'Олинган қарз — муддати ўтган', completed: 'Тугалланган қарзлар', all: 'Барча қарзлар', summary: 'Қарздорликлар', receivable: 'Олиш керак', payable: 'Бериш керак', overdue: 'Муддати ўтган', upcomingGiven: 'Муддати яқин берилган қарзлар', upcomingTaken: 'Муддати яқин олинган қарзлар', noUpcoming: 'Ҳозирча муддати яқин қарзлар йўқ', counterparty: 'Контрагент' },
        // SS-DEV (2026-09-26): en/kaa
        en: { lent: 'Debt given', borrowed: 'Debt received', lentOverdue: "Debt given — overdue", borrowedOverdue: "Debt received — overdue", completed: 'Completed debts', all: 'All debts', summary: 'Debts', receivable: 'To receive', payable: 'To pay', overdue: "Overdue", upcomingGiven: 'Given debts due soon', upcomingTaken: 'Received debts due soon', noUpcoming: 'No debts due soon yet', counterparty: 'Counterparty' },
        kaa: { lent: 'Berilgen qarız', borrowed: 'Alınǵan qarız', lentOverdue: "Berilgen qarız — múddeti ótken", borrowedOverdue: "Alınǵan qarız — múddeti ótken", completed: 'Tamamlanǵan qarızlar', all: 'Barlıq qarızlar', summary: 'Qarızdarlıqlar', receivable: 'Alıw kerek', payable: 'Beriw kerek', overdue: "Múddeti ótken", upcomingGiven: 'Múddeti jaqın berilgen qarızlar', upcomingTaken: 'Múddeti jaqın alınǵan qarızlar', noUpcoming: 'Házirshe múddeti jaqın qarızlar joq', counterparty: 'Kontragent' },
      }
      return t[l] || t.uz
    },
    /** DashboardStats matnlari (badge'lar, "Muddati o'tgan" sarlavhalari) */
    statsTexts() {
      const t = this.texts
      return { financialSummary: t.summary, receivable: t.receivable, payable: t.payable, overdue: t.overdue, overdueGiven: t.lent, overdueTaken: t.borrowed }
    },
    /** SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band: kartalar → alohida ro'yxat sahifalari */
    cardLinks() {
      return {
        debitor: this.listLink('given'),
        expiredDebitor: this.listLink('overdue-given'),
        creditor: this.listLink('taken'),
        expiredCreditor: this.listLink('overdue-taken'),
      }
    },
    /** SS-DEV (2026-09-27), 26.09 hujjat 3(a)-band: "Muddati yaqin" qatorlari (DashboardNearExpiration shakli) */
    upcomingGivenRows() { return this.upcomingRows('given') },
    upcomingTakenRows() { return this.upcomingRows('taken') },
    /** SS-DEV (2026-09-26): 4 ta karta summalari valyuta bo'yicha — asosiylari /finance/debts/stats
        (`lent_by_currency`/`borrowed_by_currency`, ko'zgu + do'kon qarzlari bilan), muddati
        o'tganlar faol ro'yxatdan (due_date < bugun). */
    cardSums() {
      const pick = (arr, cur) => {
        const row = (arr || []).find((r) => String(r.currency || 'UZS') === cur)
        return row ? Number(row.total) || 0 : 0
      }
      const sum = (type, cur) => this.activeDebts
        .filter((d) => d.type === type && (d.currency || 'UZS') === cur && this.isOverdue(d))
        .reduce((a, d) => a + (Number(d.remaining_amount) || 0), 0)
      return {
        lentUzs: pick(this.stats.lent_by_currency, 'UZS'),
        lentUsd: pick(this.stats.lent_by_currency, 'USD'),
        borrowedUzs: pick(this.stats.borrowed_by_currency, 'UZS'),
        borrowedUsd: pick(this.stats.borrowed_by_currency, 'USD'),
        lentOverdueUzs: sum('lent', 'UZS'),
        lentOverdueUsd: sum('lent', 'USD'),
        borrowedOverdueUzs: sum('borrowed', 'UZS'),
        borrowedOverdueUsd: sum('borrowed', 'USD'),
      }
    },
  },

  async mounted() {
    await this.loadSubscriptionData();
    // SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band: eski `?type=lent` ko'rinishidagi havola kelsa —
    // endi ro'yxat alohida sahifada; o'sha sahifaga yo'naltiramiz.
    const qt = this.$route.query.type
    if (qt && LEGACY_TYPE_TO_KIND[qt]) {
      this.$router.replace(this.listLink(LEGACY_TYPE_TO_KIND[qt])).catch(() => {})
      return
    }
    // PERF: so'rovlar mustaqil — parallel
    await Promise.all([this.loadActiveDebts(), this.loadStats(), this.loadUpcoming()])
  },

  methods: {
    /** SS-DEV (2026-09-27): ro'yxat sahifasi havolasi (given | taken | overdue-given | overdue-taken | completed | all) */
    listLink(kind) {
      return this.localePath({ name: 'finance-debts-list-kind', params: { kind } })
    },

    /**
     * SS-DEV (2026-09-27), 26.09 hujjat 3(a)-band: muddati yaqin qarzlar — backend'dan.
     * Endpoint hali yo'q bo'lsa (404/xato) `upcoming` null qoladi → `upcomingRows` faol ro'yxatdan hisoblaydi.
     */
    async loadUpcoming() {
      try {
        const res = await this.$api.getUpcomingDebts(UPCOMING_DAYS)
        const d = res && res.data && res.data.success && res.data.data
        if (d && (Array.isArray(d.given) || Array.isArray(d.taken))) {
          this.upcoming = { given: d.given || [], taken: d.taken || [] }
        }
      } catch (_) { this.upcoming = null }
    },
    /**
     * "Muddati yaqin" bloklari uchun qatorlar — `DashboardNearExpiration` shakli:
     * { name, end_date, residual_amount, currency, to }. Manba: backend javobi yoki fallback
     * (faol ro'yxat: due_date bugundan UPCOMING_DAYS kun ichida). Muddat bo'yicha o'sish tartibida.
     */
    upcomingRows(side) {
      const type = side === 'given' ? 'lent' : 'borrowed'
      let rows
      if (this.upcoming) {
        rows = (this.upcoming[side] || []).map((it) => ({
          name: this.partyName(it.partner_name),
          end_date: it.due_date,
          residual_amount: Number(it.remaining) || 0,
          currency: it.currency || 'UZS',
          to: this.upcomingLink({ id: it.id, kind: it.kind, source_name: it.partner_name, phone: it.partner_phone }, side),
        }))
      } else {
        const now = new Date(); now.setHours(0, 0, 0, 0)
        const limit = new Date(now.getTime() + UPCOMING_DAYS * 86400000)
        rows = this.activeDebts
          .filter((d) => d.type === type && d.due_date && (d.status === 'active' || d.status === 'overdue'))
          .filter((d) => { const due = new Date(d.due_date); return due >= now && due <= limit })
          .map((d) => ({
            name: this.partyName(d.source_name),
            end_date: d.due_date,
            residual_amount: Number(d.remaining_amount) || 0,
            currency: d.currency || 'UZS',
            to: this.upcomingLink({ id: d.id, kind: d.is_shop_debt ? 'shop' : (d.is_mirror ? 'mirror' : 'own'), source_name: d.source_name, phone: d.phone }, side),
          }))
      }
      return rows.sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
    },
    /** Qator havolasi: o'z qarzim → qarz sahifasi; hamkor qaydi / do'kon → kontragent sahifasi (modallar o'sha yerda) */
    upcomingLink(it, side) {
      if (it.kind === 'own' && it.id) {
        return this.localePath({ name: 'finance-debts-id', params: { id: it.id }, query: { tab: side } })
      }
      const key = buildDebtGroupKey({ is_shop_debt: it.kind === 'shop', phone: it.phone, source_name: it.source_name })
      return this.localePath({ name: 'finance-debts-group-key', params: { key: encodeGroupKey(key) }, query: { tab: side } })
    },
    // SS-13: FISh "Sarlavha Ko'rinishi"da (do'kon nomi bo'lsa ham zarar qilmaydi — faqat harf registri)
    partyName(n) { return titleCaseName(n) || n || '—' },

    /** SS-DEV (2026-09-26): faol (active+overdue) qarzlar — kartalar va karta ro'yxatlari manbai */
    async loadActiveDebts() {
      try {
        const res = await this.$api.getPersonalDebts({ status: 'active', limit: 100 })
        if (res?.data?.success) {
          const own = res.data.data || []
          const mirrors = res.data.mirror_debts || []
          this.activeDebts = [...own, ...mirrors].sort((a, b) =>
            new Date(b.created_at || 0) - new Date(a.created_at || 0))
        }
      } catch (error) {
        console.error('Load active debts error:', error)
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

    isOverdue(debt) {
      if (!debt.due_date || (debt.status !== 'active' && debt.status !== 'overdue')) return false // SS-DEV (2026-09-24): overdue ham ochiq
      return new Date(debt.due_date) < new Date()
    },
  }
}
</script>
