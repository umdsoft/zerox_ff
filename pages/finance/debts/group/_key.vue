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
import { actBtnClass, isForgiven, isOpen, isOverdue, getPaidPercent } from '~/utils/debtGroupRows'; // wave-1: fmtNum nusxasi umumiylashtirildi
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
// 02.10: tarif cheklovi — talab SMS (manual_sms_send)
import subscriptionMixin from '~/mixins/subscriptionMixin';

const MARKER_RE = /^__(increase|forgive)__/;
import debtGroupViewMixin from '~/mixins/debtGroupViewMixin.js';
import debtGroupActionsMixin from '~/mixins/debtGroupActionsMixin.js';
import debtGroupMirrorMixin from '~/mixins/debtGroupMirrorMixin.js';

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
  mixins: [subscriptionMixin, financeDemandMixin, debtGroupViewMixin, debtGroupActionsMixin, debtGroupMirrorMixin], // 02.10; 03.10: talab oqimi

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
        if (r && r.level) {this.reliability = { level: r.level, total: Number(r.total) || 0, on_time: Number(r.on_time) || 0, late: Number(r.late) || 0 }}
      } catch (_) { /* Tavsiya ixtiyoriy — xatoda "ma'lumot yo'q" holati qoladi */ }
    },

    // Qarz bo'yicha HAQIQIY to'lovlar yig'indisi (qo'shimcha qarz / voz kechish markerlarisiz).
    // 02.10 (2-rasm): qarz summasidan oshmaydi (eski, 24.09 gacha yozilgan ortiqcha to'lovlar ko'rsatilmaydi).
    paidOf(d) {
      if (!d) {return 0}
      if (Array.isArray(d.payments)) {
        const sum = d.payments.filter((p) => !MARKER_RE.test(String(p.notes || ''))).reduce((s, p) => s + (Number(p.amount) || 0), 0)
        const total = Number(d.amount) || 0
        return total > 0 ? Math.min(sum, total) : sum
      }
      if (d.paid_amount != null) {return Number(d.paid_amount) || 0}
      return this.isForgiven(d) ? 0 : Math.max(0, (Number(d.amount) || 0) - (Number(d.remaining_amount) || 0))
    },

    // Pastel tugma klassi; o'chiq holat — kulrang (Tailwind 2.2 `disabled:` varianti ishlamaydi).
    actBtnClass,

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
      if (!debt || debt.status !== 'completed' || debt.is_shop_debt) {return}
      this.rowDeleteDebt = debt
      this.confirmKind = 'rowdelete'
    },
    async rowDelete() {
      const d = this.rowDeleteDebt
      if (!d || this.mirrorBusy) {return}
      this.mirrorBusy = true
      try {
        // Hamkor qaydi → mirror-hide; o'z qaydim → delete (backend tugallanganni bir tomonlama yashiradi)
        const res = d.is_mirror ? await this.$api.mirrorHideDebt(d.id) : await this.$api.deleteDebt(d.id)
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success(this.$t('l10n.pdg.removed'))
          this.confirmKind = ''
          this.rowDeleteDebt = null
          await this.loadDebts()
          if (!this.group) {this.$router.push(this.backLink)}
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
      if (this.complaintKind === 'person') {this.showMirror = true}
      else {this.showShopDebt = true}
    },

    // O'z qarzim → tafsilot sahifasi; do'kon/ko'zgu → shu sahifadagi modal.
    onDebtClick(debt) {
      if (!debt) {return}
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
