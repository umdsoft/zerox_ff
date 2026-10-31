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
      <p class="text-gray-400 text-sm">{{ $t('common.loading') }}</p>
    </div>

    <!-- Guruh topilmadi (eskirgan havola / qarzlar o'chirilgan) -->
    <div v-else-if="!group" class="bg-white rounded-2xl p-12 shadow-sm text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('l10n.pdg.not_found') }}</h3>
      <p class="text-gray-500 mb-4">{{ $t('l10n.pdg.not_found_text') }}</p>
      <nuxt-link :to="localePath({ name: 'finance-debts' })" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
        {{ $t('l10n.pdg.to_list') }}
      </nuxt-link>
    </div>

    <template v-else>
      <!-- Sarlavha bloki: ikonka + nom (+ telefon) va amal tugmalari.
           29.09 (doc1 20-rasm): Qarz daftari mijoz sahifasidagidek — md+ da chapda FISh, o'ngda tugmalar. -->
      <DebtGroupHeader :act-busy="actBusy" :action-debts="actionDebts" :avatar-class="avatarClass" :can-demand="canDemand" :demand-hint="demandHint" :demand-locked="demandLocked" :fd="fd" :fd-busy="fdBusy" :group="group" :open-debts="openDebts" :open-totals-text="openTotalsText" :shop-info="shopInfo" :side="side" :texts="texts" @act-demand="actDemand" @open-act-modal="openActModal" />

      <!-- Shu kontragent bo'yicha 3 ta kichik katak.
           SS-DEV (2026-09-24): VALYUTALAR ALOHIDA (1-rasm: UZS va USD qo'shilib "1 234 000 USD"
           chiqardi). Har valyuta o'z qatorida; hech narsa bo'lmasa "0 UZS". -->
      <!-- 29.09 (doc1 19-rasm): bo'lim (berilgan/olingan) ma'lum bo'lsa — faqat shu turdagi qarzlar
           bo'yicha: Jami qarz | Undirilgan (Qaytarilgan) | Qoldiq qarz (valyuta bo'yicha). -->
      <DebtGroupSideTotals :side="side" :side-totals="sideTotals" :texts="texts" :totals-by-currency="totalsByCurrency" />

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
      <DebtGroupList :list-items="listItems" :side="side" :texts="texts" @ask-row-delete="askRowDelete" @on-debt-click="onDebtClick" />
    </template>

    <!-- Do'kon qarzi TAFSILOTLARI (faqat ko'rish) — ro'yxat sahifasidagi modalning aynan o'zi -->
    <DebtGroupShopDebtModal v-if="showShopDebt && shopDebt" :shop-debt="shopDebt" :texts="texts" @open-complaint="openComplaint" @close="showShopDebt = false" />

    <!-- SS-DEV (2026-09-24): SHIKOYAT modali — sabab tanlanadi, qarz bergan tomonga (do'kon
         egasi YOKI hamkor) bildirishnoma boradi. `complaintTarget` — do'kon qarzi yoki
         odam-odam hamkor qaydi (`complaintKind`: 'shop' | 'person'). -->
    <DebtGroupComplaintModal v-if="showComplaint && complaintTarget" :complaint-busy="complaintBusy" :complaint-can-send="complaintCanSend" :complaint-kind="complaintKind" :complaint-note-value.sync="complaintNote" :complaint-reason-value.sync="complaintReason" :complaint-reasons="complaintReasons" :complaint-sent="complaintSent" :complaint-target="complaintTarget" :texts="texts" @back-to-debt-from-complaint="backToDebtFromComplaint" @close="showComplaint = false" @submit-complaint="submitComplaint" />

    <!-- Telefon-ko'zgu qarz tafsiloti + (lender bo'lsa) amallar -->
    <DebtGroupMirrorModal v-if="showMirror && mirrorDebt" :demand-locked="demandLocked" :fd-busy="fdBusy" :mirror-busy="mirrorBusy" :mirror-debt="mirrorDebt" :mirror-payments="mirrorPayments" :texts="texts" @ask-mirror-forgive="askMirrorForgive" @ask-mirror-hide="askMirrorHide" @mirror-demand="mirrorDemand" @open-mirror-pay="openMirrorPay" @open-person-complaint="openPersonComplaint" @close="showMirror = false" />

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
      :sms-available="smsTarget.available"
      :sms-phone="smsTarget.phone"
      :sms-locked="smsLocked"
      @sms-locked="showUpgradeModal('auto_sms_reminder')"
      @cancel="actModal = ''"
      @confirm="onActConfirm"
    />

    <!-- 03.10 (sayt hujjati, 4-rasm): "Talab qilish" — karta bor bo'lsa "Talab SMS yuborilsinmi?" (karta, Telegram,
         SMS matni; "Ha, yuborish" / "Bekor qilish" / "Kartani o'zgartirish"); karta yo'q bo'lsa avval karta oynasi,
         saqlangach shu tasdiq oynasi (mixins/financeDemandMixin.js). -->
    <DemandConfirmModal
      v-if="fd.open"
      v-bind="fdModalProps"
      @close="closeFinanceDemand"
      @confirm="confirmFinanceDemand"
      @change-card="onFdChangeCard"
    />
    <PayoutCardModal
      v-if="fd.cardModal"
      :intent="fd.cardOrigin === 'start' ? 'demand' : 'edit'"
      @close="onFdCardClosed"
      @saved="onFdCardSaved"
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
import { formatIntGrouped, formatTashkentDateTime } from '~/utils/format';
import { getDebtGroupTexts } from '~/utils/debtGroupTexts';
import { actBtnClass, isForgiven, isOpen, isOverdue, getPaidPercent } from '~/utils/debtGroupRows'; // wave-1: fmtNum nusxasi umumiylashtirildi
import { groupDebtsByCounterparty, findGroupByRouteKey } from '~/utils/debtGroups';
import DebtGroupHeader from '~/components/debt-group/DebtGroupHeader.vue';
import DebtGroupSideTotals from '~/components/debt-group/DebtGroupSideTotals.vue';
import DebtGroupList from '~/components/debt-group/DebtGroupList.vue';
import DebtGroupShopDebtModal from '~/components/debt-group/DebtGroupShopDebtModal.vue';
import DebtGroupComplaintModal from '~/components/debt-group/DebtGroupComplaintModal.vue';
import DebtGroupMirrorModal from '~/components/debt-group/DebtGroupMirrorModal.vue';
import RecommendationCard from '~/components/finance/RecommendationCard.vue'; // 29.09: Tavsiya shu sahifaga ko'chdi
// 30.09 (doc1 14/17–21-rasm): umumiy "Orqaga", qarz tanlash oynasi, karta oynasi
import PageBackButton from '~/components/ui/PageBackButton.vue';
import DebtActionModal from '~/components/finance/DebtActionModal.vue';
import PayoutCardModal from '~/components/finance/PayoutCardModal.vue';
// 03.10 (sayt hujjati, 3/4-rasm): talab tasdiq oynasi + "SMS yuborish" natijasi
import DemandConfirmModal from '~/components/finance/DemandConfirmModal.vue';
import financeDemandMixin from '~/mixins/financeDemandMixin';
import { smsList, smsOutcome, SMS_NOTICE_TEXTS } from '~/utils/smsNotice';
// 02.10: tarif cheklovi — talab SMS (manual_sms_send)
import subscriptionMixin from '~/mixins/subscriptionMixin';
import { isPlanRequiredError } from '~/utils/planGate';
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
  components: {
    DebtGroupHeader,
    DebtGroupSideTotals,
    DebtGroupList,
    DebtGroupShopDebtModal,
    DebtGroupComplaintModal,
    DebtGroupMirrorModal, RecommendationCard, PageBackButton, DebtActionModal, PayoutCardModal, DemandConfirmModal },
  mixins: [subscriptionMixin, financeDemandMixin], // 02.10; 03.10: talab oqimi

  data() {
    return {
      debts: [],
      loading: true,
      // 29.09: Tavsiya (kontragent ishonchliligi) va sarlavhadagi amal tugmalari holati
      reliability: { level: 'none', total: 0, on_time: 0, late: 0 },
      actBusy: false,
      // 30.09: qarz tanlash oynasi ('' | 'close' | 'pay' | 'forgive'). 03.10: talab/karta oynalari — financeDemandMixin (`fd`)
      actModal: '',
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
        { key: 'not_taken' },
        { key: 'fully_paid' },
        { key: 'partly_paid' },
      ]
    }
  },

  computed: {
    // 02.10: talab SMS tarifda yo'q (muddati tugagan/Free) — qulf (yuklanmagan bo'lsa yo'q, server hal qiladi)
    demandLocked() { return this.isFeatureLocked('manual_sms_send') },
    // 03.10 (3-rasm): yopish/to'lov SMS'i — "to'lov xabarnomasi" turi (auto_sms_reminder)
    smsLocked() { return this.isFeatureLocked('auto_sms_reminder') },
    // "SMS yuborish" kaliti: qarama-qarshi tomon telefoni (guruh yoki qarz yozuvidan). Hamkor qaydida telefonni
    // backend o'zi topadi (qarzni kiritgan foydalanuvchi) — kalit ko'rinadi, izoh raqamsiz bo'lishi mumkin.
    smsTarget() {
      const list = this.actionDebts
      const withPhone = list.find((d) => !!d.phone)
      const phone = (this.group && this.group.phone) || (withPhone && withPhone.phone) || ''
      return { phone, available: !!phone || list.some((d) => d.is_mirror) }
    },
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
      return getDebtGroupTexts(this.$i18n && this.$i18n.locale)
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
            ? (d.type === 'lent' ? this.$t('l10n.pdg.role_borrower') : this.$t('l10n.pdg.role_lender'))
            : (d.type === 'lent' ? this.$t('l10n.pdg.role_lender') : this.$t('l10n.pdg.role_borrower'))
          const by = byMe ? this.$t('l10n.pdg.you') : ((p.created_by_name || this.$t('l10n.pdg.partner')) + ' (' + role + ')')
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
          title: this.$t('l10n.pdg.hide_title'),
          message: this.$t('l10n.pdg.hide_msg', { name }),
          confirmText: this.$t('l10n.pdg.hide_yes'), tone: 'danger', icon: '🗑',
        }
      }
      // SS-DEV (2026-09-24): ro'yxatdagi tugallangan qatorni o'chirish (o'z qaydim yoki hamkor qaydi).
      if (this.confirmKind === 'rowdelete') {
        const gname = (this.group && this.group.name) || ''
        return {
          title: this.$t('l10n.pdg.del_title'),
          message: this.$t('l10n.pdg.del_msg', { name: gname }),
          confirmText: this.$t('l10n.pdg.del_yes'), tone: 'danger', icon: '🗑',
        }
      }
      return {
        title: this.texts.forgiveTitle,
        message: this.$t('l10n.pdg.forgive_msg', { name }),
        confirmText: this.texts.forgiveYes, tone: 'danger', icon: '🚫',
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
    this.loadSubscriptionData() // 02.10: tarif imkoniyatlari (talab qulfi) — sahifa yuklanishini kutmaydi
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
    actBtnClass,

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
    async afterAct(msg, smsResults) {
      this.$toast && this.$toast.success && this.$toast.success(msg)
      this.showSmsOutcome(smsResults)
      this.confirmKind = ''
      this.actModal = ''
      await this.loadDebts()
      this.loadReliability()
    },
    /**
     * 03.10 (3-rasm): "SMS yuborish" yoqilgan bo'lsa — natija: yuborildi / tarif cheklovi (markazdagi
     * "Tariflar" oynasi, amal baribir bajarilgan) / boshqa sabab bilan yuborilmadi (server matni).
     */
    showSmsOutcome(smsResults) {
      if (!smsResults) return
      const l = (this.$i18n && this.$i18n.locale) || 'uz'
      const tx = SMS_NOTICE_TEXTS[l] || SMS_NOTICE_TEXTS.uz
      const out = smsOutcome(smsResults)
      if (out.kind === 'sent') this.$toast && this.$toast.success && this.$toast.success(tx.sent)
      else if (out.kind === 'plan') this.$planPrompt && this.$planPrompt({ message: out.message, expired: this.planExpired })
      else if (out.kind === 'failed') this.$toast && this.$toast.error && this.$toast.error(out.message ? tx.failed + ': ' + out.message : tx.failed)
    },
    // 02.10 (2-rasm): server `code` bo'yicha joriy tilda (server matni faqat o'zbekcha bo'lishi mumkin)
    errMsg(e) {
      const d = (e && e.response && e.response.data) || {}
      if (d.code === 'over-remaining') return this.texts.overRemaining
      if (d.code === 'already-closed') return this.texts.alreadyClosed
      return d.message || this.$t('errors.operationFailed')
    },
    actError(e) {
      // 02.10: tarif cheklovi — "Tariflar" tugmali taklifni plugins/axios.js ko'rsatdi (xato toast'i YO'Q)
      if (isPlanRequiredError(e)) return
      this.$toast && this.$toast.error && this.$toast.error(this.errMsg(e))
    },

    /**
     * Tanlash oynasi natijasi: forgive — bir nechta qarz; close/pay — tanlangan qarz(lar) (to'liq yoki qisman).
     * 01.10 (doc3 5/6-rasm): bir valyutada BIR NECHTA qarz — summa muddati yaqin qarzdan boshlab taqsimlanadi.
     * 02.10 (3–4-rasm): tanlov bir nechta VALYUTADA bo'lishi mumkin — `amounts` (valyuta → summa|null).
     */
    onActConfirm({ debts, amount, amounts, notifySms }) {
      if (!debts || !debts.length) return
      if (this.actModal === 'forgive') return this.actForgiveMany(debts)
      return this.actPayGroups(debts, amounts || null, amount, !!notifySms)
    },

    /**
     * 02.10 (3–4-rasm): har valyuta ALOHIDA (backend bitta valyutani taqsimlaydi; UZS va USD qo'shilmaydi):
     * guruhda bitta qarz → oddiy to'lov, bir nechta → allocate-payment. Ketma-ket; o'rtada xato bo'lsa
     * bajarilganlari saqlanadi, ro'yxat yangilanadi va xato aniq ko'rsatiladi. Oxirida BITTA xabar.
     */
    async actPayGroups(debts, amounts, legacyAmount, notifySms) {
      if (this.actBusy) return
      const groups = groupByCurrency(debts)
      this.actBusy = true
      let done = 0
      let allClosed = true
      // 03.10 (3-rasm): SMS natijalari (har valyuta / har to'lov) — kalit o'chiq bo'lsa null (xabar yo'q)
      const sms = notifySms ? [] : null
      try {
        for (const g of groups) {
          const raw = amounts ? amounts[g.currency] : (groups.length === 1 ? legacyAmount : null)
          const want = Number(raw) > 0 ? Number(raw) : null
          const r = g.debts.length === 1 ? await this.payOne(g.debts[0], want, notifySms) : await this.payMany(g.debts, want, notifySms)
          done += 1
          if (!r.closed) allClosed = false
          if (sms) sms.push(...r.sms)
        }
        await this.afterAct(allClosed ? this.texts.closedOk : this.texts.paidOk, sms)
      } catch (e) {
        if (done) { this.actModal = ''; this.showSmsOutcome(sms); await this.loadDebts() }
        this.actError(e)
      } finally { this.actBusy = false }
    },

    /**
     * Bitta qarz: o'z qaydim → POST /finance/debts/:id/payments (qoldiqqa teng bo'lsa backend 'completed' qiladi);
     * hamkor qaydi (men qarz beruvchi) → mirror-payment. `amount` null — butun qoldiq. Qaytaradi: yopildimi.
     */
    async payOne(debt, amount, notifySms) {
      const full = Number(debt.remaining_amount) || 0
      const amt = amount > 0 ? amount : full
      // 03.10: notify_sms — faqat kalit yoqilganda yuboriladi (odatiy o'chiq)
      const sms = notifySms ? { notify_sms: true } : {}
      const res = debt.is_mirror
        ? await this.$api.mirrorPayDebt(debt.id, { ...(amount > 0 ? { amount } : {}), ...sms })
        : await this.$api.addDebtPayment(debt.id, { amount: amt, payment_date: this.todayYmd(), ...sms })
      if (!(res && res.data && res.data.success)) throw new Error('payment failed')
      return { closed: amt + 0.0001 >= full, sms: smsList(res.data.sms) }
    },

    /**
     * 01.10 (doc3 5/6-rasm): bir valyutadagi bir nechta qarzga BITTA summa — serverda bitta tranzaksiya
     * (POST /finance/debts/allocate-payment). Backend hali yangilanmagan bo'lsa (marshrut 404) —
     * xuddi shu tartibda ketma-ket to'lovlar (utils/debtAllocation). Qaytaradi: hammasi yopildimi.
     */
    async payMany(debts, amount, notifySms) {
      const total = debts.reduce((s, d) => s + (Number(d.remaining_amount) || 0), 0)
      const paid = amount > 0 ? amount : total
      const payload = { ids: debts.map((d) => d.id), payment_date: this.todayYmd() }
      if (amount > 0) payload.amount = amount
      if (notifySms) payload.notify_sms = true // 03.10: javobda `sms: [{ currency, sent, reason?, message? }]`
      let sms = []
      try {
        const res = await this.$api.allocateDebtPayment(payload)
        if (!(res && res.data && res.data.success)) throw new Error('allocate failed')
        sms = smsList(res.data.sms)
      } catch (e) {
        const r = e && e.response
        const routeMissing = r && r.status === 404 && !(r.data && r.data.code)
        if (!routeMissing) throw e
        sms = await this.allocateSequential(debts, amount, notifySms)
      }
      return { closed: paid + 0.0001 >= total, sms }
    },
    /**
     * Zaxira: taqsimot bo'yicha ketma-ket to'lovlar (xato bo'lsa chaqiruvchi ro'yxatni yangilaydi).
     * 03.10: SMS kaliti yoqilgan bo'lsa — faqat OXIRGI to'lovda (bitta SMS). Qaytaradi: SMS natijalari.
     */
    async allocateSequential(debts, amount, notifySms) {
      const plan = allocatePayment(debts, amount > 0 ? amount : null)
      const steps = plan.allocations.filter((a) => a.pay > 0)
      let sms = []
      for (let i = 0; i < steps.length; i += 1) {
        const a = steps[i]
        const d = a.debt
        const extra = notifySms && i === steps.length - 1 ? { notify_sms: true } : {}
        const res = d.is_mirror
          ? await this.$api.mirrorPayDebt(d.id, { amount: a.pay, ...extra })
          : await this.$api.addDebtPayment(d.id, { amount: a.pay, payment_date: this.todayYmd(), ...extra })
        if (!(res && res.data && res.data.success)) throw new Error('payment failed')
        if (extra.notify_sms) sms = smsList(res.data.sms)
      }
      return sms
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
     * 03.10 (sayt hujjati, 4-rasm): "Talab qilish" — SMS darhol KETMAYDI (mixins/financeDemandMixin.js):
     * tarif qulfi → markazdagi "Tarif cheklovi"; karta yo'q → karta oynasi; karta bor → "Talab SMS yuborilsinmi?".
     */
    actDemand() {
      const tg = this.demandTarget
      if (!tg || this.actBusy) return
      this.startFinanceDemand(tg)
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
    fmtNum(v) { return formatIntGrouped(v) },
    // SS-DEV (2026-09-24): voz kechilgan qarz — `__forgive__` marker yoki notes'dagi "Kechirilgan".
    isForgiven,
    // 'active' YOKI 'overdue' — ochiq qarz
    isOpen,

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
          this.$toast && this.$toast.success && this.$toast.success(this.$t('l10n.pdg.removed'))
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
          this.$toast && this.$toast.success && this.$toast.success(this.$t('l10n.pdg.removed'))
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
          if (res.data.duplicate) this.$toast && this.$toast.info && this.$toast.info(this.$t('l10n.pdg.complaint_dup'))
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
        this.$toast && this.$toast.error && this.$toast.error(this.texts.badAmount)
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
            rem <= 0 ? this.texts.closedOk : this.texts.paidOk
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
          this.$toast && this.$toast.success && this.$toast.success(this.texts.forgivenOk)
          this.confirmKind = ''
          this.showMirror = false
          await this.loadDebts()
        }
      } catch (e) {
        const msg = (e.response && e.response.data && e.response.data.message) || this.$t('errors.operationFailed')
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally { this.mirrorBusy = false }
    },

    // Ko'zgu qarz (men lender) — qarzdorga talab SMS. 03.10: tasdiq oynasi orqali (financeDemandMixin).
    mirrorDemand() {
      if (this.mirrorBusy || !this.mirrorDebt) return
      this.startFinanceDemand(this.mirrorDebt)
    },

    formatMoney: formatMoneyCur, // SS-AUDIT (2026-09-25): utils/helpers

    // 29.09 (doc2 3-rasm): barcha sanalar "26.09.2026" ko'rinishida (ilgari toLocaleDateString — "2026-10-01" / "26/09/2026")
    formatDate(v) { return fmtDMY(v, '-') },

    // SS-DEV (2026-09-24): sana + vaqt (UZ, +5 — tafsilot sahifasidagi bilan bir xil)
    formatDateTime(dt) {
      // wave C: har doim Toshkent devor vaqti (zona'siz satr ham) — utils/format.formatTashkentDateTime
      const r = formatTashkentDateTime(dt)
      return r === null ? this.formatDate(dt) : r
    },

    // Telefonni chiroyli format ("+998 90 123 45 67")
    formatPhone: formatPhoneUz, // SS-AUDIT (2026-09-25): utils/helpers

    isOverdue,

    getPaidPercent
  }
}
</script>
