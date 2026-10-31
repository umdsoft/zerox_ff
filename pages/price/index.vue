<template>
  <div class="pb-8" :class="isGuest ? 'zx-price-guest' : ''">
    <!-- SS-DEV (2026-09-24): TARIFLAR ENDI OMMAVIY (15-rasm) — login qilmagan mehmon ham
         ko'ra oladi. Mehmon uchun default layout yon menyu/sarlavhasiz `<Nuxt/>` beradi,
         shu sabab bu yerda ixcham mehmon sarlavhasi (logo, Bosh sahifa, Kirish, Ro'yxatdan
         o'tish) ko'rsatiladi. Sotib olish tugmalari mehmonni login sahifasiga yo'naltiradi. -->
    <nav v-if="isGuest" class="bg-white border-b border-gray-100 mb-6">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <nuxt-link :to="localePath({ name: 'index' })" class="flex-shrink-0 flex items-center">
          <img v-if="$i18n.locale == 'ru'" src="@/assets/img/logo_ru.svg" alt="ZeroX" class="h-9" />
          <img v-else-if="$i18n.locale == 'kr'" src="@/assets/img/logo_kr.svg" alt="ZeroX" class="h-9" />
          <img v-else src="@/assets/img/logo.svg" alt="ZeroX" class="h-9" />
        </nuxt-link>
        <div class="flex items-center gap-2 sm:gap-4">
          <nuxt-link :to="localePath({ name: 'index' })" class="hidden sm:inline text-sm font-medium text-gray-600 hover:text-blue-600">{{ texts.guestHome }}</nuxt-link>
          <nuxt-link :to="localePath({ name: 'auth-login' })" class="text-sm font-semibold text-blue-600 hover:text-blue-700 px-2">{{ texts.guestLogin }}</nuxt-link>
          <nuxt-link :to="localePath({ name: 'auth-register' })" class="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">{{ texts.guestRegister }}</nuxt-link>
        </div>
      </div>
    </nav>

    <!-- Header -->
    <div class="text-center mb-8 mt-4">
      <h1 class="text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
      <p v-if="isGuest" class="mt-2 text-sm text-gray-400">{{ texts.guestHint }}</p>
    </div>

    <!-- Joriy holat: tarif + SMS balansi (faqat kirgan foydalanuvchi) -->
    <PriceCurrentStatus
      v-if="!isGuest"
      :texts="texts"
      :expiry-alert="expiryAlert"
      :current-plan="currentPlan"
      :plan-label="planLabel"
      :sms-warning="smsWarning"
      :sms-remaining="smsRemaining"
      :sms-total="smsTotal"
      :sms-percent="smsPercent"
      :sms-hint="smsHint"
      :has-paid-period="hasPaidPeriod"
      :sub-start="subStart"
      :sub-end="subEnd"
      :sub-expiring-soon="subExpiringSoon"
      :days-left-text="daysLeftText"
      :period-percent="periodPercent"
      :sms-burn-text="smsBurnText"
      @renew="purchasePlan"
      @open-sms-history="openSmsHistory"
    >
      <div id="sms" ref="smsManager" class="mt-5 pt-5 border-t border-gray-100">
        <FinanceSmsManager />
      </div>
    </PriceCurrentStatus>

    <!-- SMS XABARLAR TARIXI MODAL -->
    <PriceSmsHistoryModal
      v-if="smsHistoryOpen"
      :texts="texts"
      :sms-history-loading="smsHistoryLoading"
      :sms-cats="smsCats"
      :sms-total-sent="smsTotalSent"
      @close="closeSmsHistory"
      @open-cat="openSmsCat"
    />

    <!-- 30.10: KATEGORIYA SMS RO'YXATI — orqa fon blur -->
    <PriceSmsCategoryModal v-if="smsCatOpen" :sms-cat-open="smsCatOpen" @close="closeSmsCat" />

    <!-- TARIF SOTIB OLISH TASDIQLASH MODAL — Mobil hisob balansidan to'lash -->
    <PricePlanConfirmModal
      v-if="planConfirmTarget"
      :texts="texts"
      :plan-confirm-target="planConfirmTarget"
      :purchase-loading="purchaseLoading"
      :balance-sufficient="balanceSufficient"
      :user-balance="userBalance"
      :balance-shortfall="balanceShortfall"
      :plan-confirm-period="planConfirmPeriod"
      @close="closePlanConfirm"
      @confirm="confirmPlanPurchase"
      @topup="openTopupFromConfirm"
    />

    <!-- TO'LOV USULI MODAL — Click (birinchi) / Payme (ikkinchi). Top-up + SMS addon uchun. -->
    <PricePaymentModal
      v-if="paymentTarget"
      :texts="texts"
      :payment-target-label="paymentTargetLabel"
      :payment-loading="paymentLoading"
      :payment-method="paymentMethod"
      @close="closePayment"
      @choose="choosePayment"
    />

    <PriceDaftariPlans
      :texts="texts"
      :plans-shared="plansShared"
      :current-plan="currentPlan"
      :is-guest="isGuest"
      :sub-end="subEnd"
      :purchase-loading="purchaseLoading"
      @purchase="purchasePlan"
    />

    <PriceAddonPackages
      v-if="currentPlan === 'start' || currentPlan === 'premium'"
      :texts="texts"
      :addon-packages="addonPackages"
      :purchasing="purchasing"
      @purchase="purchaseAddon"
    />

    <PriceContractPlans :texts="texts" />
  </div>
</template>

<script>
import { getSubscription, purchasePlanFromBalance, purchaseAddonFromBalance, getSubscriptionSmsStats } from '@/api/billing';
import { getMe } from '@/api/user';
import { poolLine } from '~/utils/smsHistory';
import { groupThousands } from '~/utils/format';
import priceViewMixin from '~/mixins/priceViewMixin';
import PriceCurrentStatus from '~/components/price/PriceCurrentStatus.vue';
import PriceDaftariPlans from '~/components/price/PriceDaftariPlans.vue';
import PriceAddonPackages from '~/components/price/PriceAddonPackages.vue';
import PriceContractPlans from '~/components/price/PriceContractPlans.vue';
import PriceSmsHistoryModal from '~/components/price/PriceSmsHistoryModal.vue';
import PriceSmsCategoryModal from '~/components/price/PriceSmsCategoryModal.vue';
import PricePlanConfirmModal from '~/components/price/PricePlanConfirmModal.vue';
import PricePaymentModal from '~/components/price/PricePaymentModal.vue';
import {
  planPurchaseTarget, addonPurchaseTarget, topupAmountForShortfall, isValidTopup,
  topupReturnUrl, buildClickTopupUrl, buildPaymeTopupUrl, toDate, fmtTariffDate, addOneMonth,
} from '~/utils/priceCheckout';

export default {
  // SS-DEV (2026-09-24): `middleware: 'auth'` OLIB TASHLANDI — sahifa ommaviy (mehmon ham ko'radi).
  auth: false,
  mixins: [priceViewMixin],
  components: {
    // 30.10: SMS boshqaruvi — Tariflarda doim ko'rinadi
    FinanceSmsManager: () => import('~/components/finance/SmsManager.vue'),
    PriceCurrentStatus,
    PriceDaftariPlans,
    PriceAddonPackages,
    PriceContractPlans,
    PriceSmsHistoryModal,
    PriceSmsCategoryModal,
    PricePlanConfirmModal,
    PricePaymentModal,
  },

  data() {
    return {
      currentPlan: 'free',
      // 29.09: tarif muddati (GET /finance/subscription → subscription.start_date/end_date)
      subStart: null,
      subEnd: null,
      subDaysLeft: null,
      subExpiringSoon: false,
      previousSub: null, // yaqinda tugagan pullik tarif { plan, start_date, end_date }
      smsRemaining: null,
      smsTotal: 0,
      smsUsed: 0,
      // Haqiqiy yuborilgan SMS soni (sms_history, status='sent') — "Jami yuborilgan" shu
      // raqamni ko'rsatadi (paket used_sms billing hisoblagichi emas), tarix modali bilan mos.
      smsSent: 0,
      smsWarning: null,
      // 30.09: amaldagi tarif SMS qoldig'i va eng yaqin kuyish (sms.plan_remaining / expires_at / expiring_count)
      smsPlanRemaining: null,
      smsBurnAt: null,
      smsBurnCount: 0,
      purchasing: false,
      // SMS xabarlar tarixi modali
      smsHistoryOpen: false,
      smsHistoryLoading: false,
      smsHistoryStats: { registration: 0, auto: 0, manual: 0, qarz_tolandi: 0 },
      smsByTypePool: {}, // 30.10: sms-stats.by_type_pool
      smsCatOpen: null, // 30.10: tanlangan kategoriya (blur modal) — { type, label }
      // Tarif sotib olish tasdiqlash modali — Mobil hisob balansidan to'lash
      planConfirmTarget: null,  // { plan, price, smsCount, label }
      purchaseLoading: false,
      // To'lov usuli (Click/Payme) modali — top-up va SMS addon uchun
      paymentTarget: null,   // { kind:'topup'|'addon', amount?, key?, price?, label }
      paymentMethod: null,
      paymentLoading: false,
      addonPackages: [
        { name: 'small', sms: 100, price: 21000 },
        { name: 'medium', sms: 200, price: 40000 },
        { name: 'large', sms: 300, price: 57000 },
      ],
    };
  },


  beforeDestroy() {
    window.removeEventListener('keydown', this.onSmsKey);
  },

  async mounted() {
    window.addEventListener('keydown', this.onSmsKey);
    // SS-DEV (2026-09-24): mehmon — obuna/balans so'rovlari YO'Q (401 bo'lardi), faqat narxlar.
    if (this.isGuest) {return;}
    // SS-DEV (2026-09-29): ofertani tasdiqlamagan foydalanuvchi endi universal_contract'ga majburan
    // yo'naltirilmaydi — oferta faqat qarz shartnomasi AMALIDA so'raladi (plugins/oferta-gate.client.js).
    await this.loadSubscription();
    // SS-DEV (2026-09-26), 13-band: /finance/sms → /price#sms — blok ochiq holda ko'rsatiladi
    // /finance/sms → /price#sms: blok endi doim ochiq — faqat shu joyga o'tkazamiz
    if (typeof window !== 'undefined' && window.location.hash === '#sms') {this.scrollToSmsManager();}
  },

  methods: {
    /** /price#sms — SMS boshqaruvi blokiga scroll (blok doim ko'rinadi) */
    scrollToSmsManager() {
      this.$nextTick(() => {
        const el = this.$refs.smsManager;
        if (el && typeof el.scrollIntoView === 'function') {el.scrollIntoView({ behavior: 'smooth', block: 'start' });}
      });
    },
    /** 29.09: tarif sanasi — 29.09.2026 */
    fmtDate(value) {
      return fmtTariffDate(value);
    },
    toDate(value) {
      return toDate(value);
    },
    /** +1 kalendar oy (oy oxiri qisqartiriladi) — backend utils/subscriptionPeriod.addOneMonth bilan bir xil */
    addOneMonth(value) {
      return addOneMonth(value);
    },
    /** Joriy (muddati o'tmagan) tarif shumi */
    isActivePlan(plan) {
      return !this.isGuest && this.currentPlan === plan;
    },
    formatPrice(n) {
      return groupThousands(n);
    },

    async loadSubscription() {
      try {
        const res = await getSubscription(this.$axios, { silent: true });
        if (res?.success) {
          const sub = res.data.subscription || {};
          this.currentPlan = sub.plan;
          // 29.09: tarif muddati
          this.subStart = sub.start_date || null;
          this.subEnd = sub.end_date || null;
          this.subDaysLeft = sub.days_left != null ? Number(sub.days_left) : null;
          this.subExpiringSoon = Boolean(sub.expiring_soon);
          this.previousSub = res.data.previous || null;
          this.smsRemaining = res.data.sms.remaining;
          this.smsTotal = res.data.sms.total || 0;
          this.smsUsed = res.data.sms.used || 0;
          this.smsSent = res.data.sms_sent_count || 0;
          this.smsWarning = res.data.sms.warning || null;
          this.smsPlanRemaining = res.data.sms.plan_remaining != null ? Number(res.data.sms.plan_remaining) : null;
          this.smsBurnAt = res.data.sms.expires_at || null;
          this.smsBurnCount = Number(res.data.sms.expiring_count) || 0;
        }
      } catch (_) {}
    },

    /**
     * Tarif sotib olish — Mobil hisob balansidan to'lov.
     * 1) Tasdiqlash modali ochiladi (balansni ko'rsatish).
     * 2) Yetarli balans → /finance/subscription/purchase-from-balance.
     * 3) Yetarli emas → "Mobil hisobni to'ldirish" tugmasi orqali top-up modaliga.
     */
    // SS-DEV (2026-09-24): mehmon sotib olishga urinsa — login sahifasiga.
    guestToLogin() {
      if (!this.isGuest) {return false;}
      this.$router.push(this.localePath({ name: 'auth-login' }));
      return true;
    },
    purchasePlan(plan) {
      if (this.guestToLogin()) {return;}
      this.planConfirmTarget = planPurchaseTarget(plan);
    },

    closePlanConfirm() {
      if (this.purchaseLoading) {return;}
      this.planConfirmTarget = null;
    },

    async confirmPlanPurchase() {
      if (!this.planConfirmTarget || this.purchaseLoading) {return;}
      if (!this.balanceSufficient) {
        this.$toast?.error(this.texts.insufficientHint);
        return;
      }
      const isAddon = this.planConfirmTarget.kind === 'addon';
      this.purchaseLoading = true;
      try {
        const res = isAddon
          ? await purchaseAddonFromBalance(this.$axios, { package_name: this.planConfirmTarget.packageName }, { silent: true })
          : await purchasePlanFromBalance(this.$axios, { plan: this.planConfirmTarget.plan }, { silent: true });
        if (res.data?.success) {
          const endDate = !isAddon && res.data?.data?.end_date ? ` (${this.fmtDate(res.data.data.end_date)} ${this.texts.activeUntil})` : '';
          this.$toast?.success(
            isAddon
              ? `${this.planConfirmTarget.label} ${this.texts.addonAdded}`
              : `${this.planConfirmTarget.label} ${this.texts.planActivated}${endDate}`,
          );
          this.planConfirmTarget = null;
          await this.loadSubscription();
          // $auth.user.balance ni yangilash — /user/me orqali (eng ishonchli yo'l;
          // har xil @nuxtjs/auth versiyalarida ham ishlaydi)
          try {
            const me = await getMe(this.$axios, { silent: true });
            if (me?.success && this.$auth?.setUser) {this.$auth.setUser(me.data);}
          } catch (_) {}
        } else {
          this.$toast?.error(res.data?.message || 'Xatolik');
        }
      } catch (e) {
        const code = e.response?.data?.code;
        if (code === 'insufficient-balance') {
          this.$toast?.error(e.response?.data?.message || this.texts.insufficientHint);
        } else {
          this.$toast?.error(e.response?.data?.message || 'Xatolik yuz berdi');
        }
      } finally {
        this.purchaseLoading = false;
      }
    },

    /** Tasdiqlash modalidan top-up modaliga o'tish */
    openTopupFromConfirm() {
      if (!this.planConfirmTarget) {return;}
      const amount = topupAmountForShortfall(this.balanceShortfall);
      this.paymentTarget = { kind: 'topup', amount, label: this.texts.topUpBtn };
    },

    /** Qo'shimcha SMS paketi sotib olish — Mobil hisob balansidan (tarif bilan bir xil oqim) */
    purchaseAddon(packageName) {
      if (this.guestToLogin()) {return;}
      const pkg = this.addonPackages.find((p) => p.name === packageName);
      if (!pkg) {return;}
      this.planConfirmTarget = addonPurchaseTarget(pkg);
    },

    closePayment() {
      if (this.paymentLoading) {return;}
      this.paymentTarget = null;
      this.paymentMethod = null;
    },

    async choosePayment(method) {
      if (!this.paymentTarget || this.paymentLoading) {return;}
      this.paymentMethod = method;

      // TOP-UP — Mobil hisobni to'ldirish (Click/Payme to'g'ridan-to'g'ri URL).
      // /pages/mobil-hisob/index.vue dagi eventClick/eventPayme bilan AYNAN
      // bir xil format ishlatamiz (u yerda Click/Payme ishlashi tasdiqlangan):
      //   - return_url ENCODE qilinmaydi (raw URL)
      //   - return_url joriy domen origin'idan olinadi — test.zerox.uz dan
      //     to'lagan user test.zerox.uz/price ga qaytadi (Payme cancel'da ham)
      if (this.paymentTarget.kind === 'topup') {
        const uid = this.$auth?.user?.uid;
        const amount = Number(this.paymentTarget.amount) || 0;
        if (!isValidTopup(uid, amount)) {
          this.$toast?.error("Noto'g'ri ma'lumotlar");
          return;
        }
        const origin = (typeof window !== 'undefined' && window.location?.origin) || 'https://zerox.uz';
        const returnUrl = topupReturnUrl(origin);
        // mobil-hisob eventClick / eventPayme formatlari bilan AYNI (utils/priceCheckout.js)
        window.location.href = method === 'click'
          ? buildClickTopupUrl({ uid, amount, returnUrl })
          : buildPaymeTopupUrl({ uid, amount, returnUrl });
        return;
      }

      // Qo'shimcha SMS paketi Mobil hisob balansidan olinadi (purchaseAddon → confirmPlanPurchase); balans yetmasa FAQAT
      // 'topup' ochiladi. wave D: ilgari bu yerda UI'dan erishib bo'lmaydigan `kind:'addon'` (create-sms-package) tarmog'i bor edi — olib tashlandi.
    },

    async openSmsHistory() {
      if (this.guestToLogin()) {return;}
      this.smsHistoryOpen = true;
      this.smsHistoryLoading = true;
      try {
        const res = await getSubscriptionSmsStats(this.$axios, { silent: true });
        if (res?.success) {
          const byType = res.data.by_type || {};
          // 30.10: BARCHA kalitlar (payment_link, other, ...) — kategoriyalar yig'indisi used_total ga teng bo'lsin
          const stats = { registration: 0, auto: 0, manual: 0, qarz_tolandi: 0 };
          Object.keys(byType).forEach((k) => { stats[k] = Number(byType[k]) || 0; });
          this.smsHistoryStats = stats;
          // 30.10: tur bo'yicha hovuz taqsimoti { [type]: { plan, package } } — yo'q bo'lsa qator ko'rsatilmaydi
          this.smsByTypePool = res.data.by_type_pool && typeof res.data.by_type_pool === 'object' ? res.data.by_type_pool : {};
        }
      } catch (_) {
        // silent — modal still opens with zeros
      } finally {
        this.smsHistoryLoading = false;
      }
    },

    catPoolLine(type) {
      const e = this.smsByTypePool && this.smsByTypePool[type];
      if (!e || e.plan === undefined) {return '';}
      return poolLine(this.$t.bind(this), e.plan, e.package);
    },
    closeSmsHistory() {
      this.smsHistoryOpen = false;
      this.smsCatOpen = null;
    },
    openSmsCat(cat) {
      this.smsCatOpen = cat;
    },
    closeSmsCat() {
      this.smsCatOpen = null;
    },
    /** ESC: eng ustki oyna yopiladi (sabab oynasi → kategoriya ro'yxati → tarix) */
    onSmsKey(e) {
      if (e.key !== 'Escape' || !this.smsHistoryOpen) { return; }
      if (document.querySelector('[data-sms-reason-modal]')) { return; } // sabab oynasi o'zi yopadi
      if (this.smsCatOpen) { this.closeSmsCat(); } else { this.closeSmsHistory(); }
    },
  },
};
</script>
