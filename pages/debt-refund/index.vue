<template>
  <!-- 23.10 (22.10 hujjati, 8-rasm): "Qarzni qaytarish" — ilgari usul tanlash sahifasi + ikkita alohida
       sahifa (to'liq / qisman) edi. Endi BITTA sahifa: chapda shartnoma ma'lumoti, o'ngda To'liq / Qisman
       almashtirgichi va tegishli forma. API so'rovlari (POST /contract/act) eski debt-refund/_type sahifasi
       bilan AYNAN bir xil. Eski /debt-refund/full|partially manzillari shu sahifaga (?mode=) yo'naltiriladi. -->
  <ContractActionLayout :contract="contract" :title="$t('list.a1')" :subtitle="labelSubtitle" :tone="isFullRefund ? 'green' : 'orange'">
    <template #icon>
      <svg v-if="isFullRefund" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
      <svg v-else fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>
    </template>

    <template v-if="contract">
      <!-- To'liq / Qisman -->
      <div class="cal-f-seg" role="tablist">
        <button type="button" role="tab" :aria-selected="isFullRefund ? 'true' : 'false'" :class="{ 'is-on': isFullRefund }" @click="setMode('full')">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {{ T.full }}
        </button>
        <button type="button" role="tab" :aria-selected="!isFullRefund ? 'true' : 'false'" :class="{ 'is-on': !isFullRefund }" @click="setMode('partial')">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>
          {{ T.partial }}
        </button>
      </div>
      <p class="cal-f-seg-desc">{{ isFullRefund ? $t('contract_labels.refund_full_desc') : $t('contract_labels.refund_partial_desc') }}</p>

      <p class="cal-f-title">{{ pageTitle }}</p>
      <div class="cal-f-intro">
        <!-- SS-DEV (2026-09-26): en/kaa tillarida matn uz (lotin) shoxidan ko'rsatiladi — $apiLang() en/kaa->uz -->
        <span v-if="$i18n.locale == 'uz'">{{ dateFormat(contract.contract_date || contract.created_at) }} yildagi <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-sonli qarz shartnomasi bo'yicha Siz fuqaro <span class="font-semibold text-gray-900">{{ $fio(contract.debitor_name) }}</span>ga qarzni {{ isFullRefund ? "to'liq" : "qisman" }} qaytarmoqdasiz.</span>

        <span v-if="$i18n.locale == 'en'">Under loan agreement No. <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a> dated {{ dateFormat(contract.contract_date || contract.created_at) }}, you are repaying the debt {{ isFullRefund ? "in full" : "in part" }} to <span class="font-semibold text-gray-900">{{ $fio(contract.debitor_name) }}</span>.</span>

        <span v-if="$i18n.locale == 'kaa'">{{ dateFormat(contract.contract_date || contract.created_at) }} jılındaǵı <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-nomerli qarız shártnaması boyınsha Siz <span class="font-semibold text-gray-900">{{ $fio(contract.debitor_name) }}</span> degen adamǵa qarızdı {{ isFullRefund ? "tolıq" : "bóleklep" }} qaytarıp atırsız.</span>

        <span v-if="$i18n.locale == 'kr'">{{ dateFormat(contract.contract_date || contract.created_at) }} йилдаги <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-сонли қарз шартномаси бўйича Сиз фуқаро <span class="font-semibold text-gray-900">{{ $fio(contract.debitor_name) }}</span>га қарзни {{ isFullRefund ? "тўлиқ" : "қисман" }} қайтармоқдасиз.</span>

        <span v-if="$i18n.locale == 'ru'">По договору займа №<a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a> от {{ dateFormat(contract.contract_date || contract.created_at) }} г. Вы {{ isFullRefund ? "полностью" : "частично" }} возвращаете долг Займодавцу (<span class="font-semibold text-gray-900">{{ $fio(contract.debitor_name) }}</span>).</span>

        <div class="cal-f-divider">
          <span v-if="$i18n.locale == 'uz'">Sizning umumiy qarzingiz – <span class="font-bold text-gray-900">{{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}</span>.</span>
          <span v-else-if="$i18n.locale == 'kr'">Сизнинг умумий қарзингиз – <span class="font-bold text-gray-900">{{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}</span>.</span>
          <span v-else-if="$i18n.locale == 'ru'">Ваш общий долг – <span class="font-bold text-gray-900">{{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}</span>.</span>
          <span v-else-if="$i18n.locale == 'en'">Your total debt is <span class="font-bold text-gray-900">{{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}</span>.</span>
          <span v-else>Sizdiń ulıwma qarızıńız – <span class="font-bold text-gray-900">{{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}</span>.</span>
        </div>
      </div>

      <!-- Qisman: summa -->
      <template v-if="!isFullRefund">
        <label class="cal-f-label" for="refund-amount">{{ $t('placeholder.summo') }}</label>
        <input
          id="refund-amount"
          ref="input"
          :value="amount"
          v-format="amount"
          type="text"
          inputmode="numeric"
          :placeholder="$t('placeholder.summo')"
          class="cal-f-input"
          @input="setAmount"
          @keyup="changeAmount($event)"
        />
        <p class="cal-f-hint">{{ T.maxHint }} {{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}</p>
      </template>

      <label class="cal-f-check" for="ok">
        <input id="ok" v-model="isAffirmed" type="checkbox" @change="validate" />
        <a :href="link" target="_blank" rel="noopener noreferrer" @click.stop>{{ $t("action.agree_terms") }}</a>
      </label>

      <div class="cal-f-actions">
        <button
          type="button"
          class="cal-f-submit"
          :class="isFullRefund ? 'cal-f-submit--green' : ''"
          :disabled="isBtnDisabled || isSubmitting"
          @click="sendRefund"
        >
          <svg v-if="!isBtnDisabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          {{ $t("send") }}
        </button>
      </div>
    </template>
  </ContractActionLayout>
</template>

<script>
import { dateFormatMixin, socketMixin } from '@/mixins';
import { ACT_TYPES, API_MESSAGES } from '@/utils/constants';
import ContractActionLayout from '@/components/contract/ContractActionLayout.vue';

const TEXTS = {
  uz: { full: "To'liq", partial: 'Qisman', maxHint: 'Ko\'pi bilan:' },
  kr: { full: 'Тўлиқ', partial: 'Қисман', maxHint: 'Кўпи билан:' },
  ru: { full: 'Полностью', partial: 'Частично', maxHint: 'Не более:' },
  kaa: { full: 'Tolıq', partial: 'Bólekley', maxHint: 'Kóbi menen:' },
  en: { full: 'In full', partial: 'Partially', maxHint: 'At most:' },
};

/** ?mode= qiymati → 'full' | 'partial' (eski 'partially' ham qabul qilinadi). */
function normMode(v) {
  return v === 'partial' || v === 'partially' ? 'partial' : 'full';
}

export default {
  name: 'DebtRefund',
  components: { ContractActionLayout },
  middleware: "auth",
  mixins: [dateFormatMixin, socketMixin],

  data() {
    return {
      mode: normMode(this.$route.query.mode),
      amount: "",
      isAffirmed: false,
      isBtnDisabled: true,
      isSubmitting: false,
      contract: null,
      dx: null,
      link: "",
    };
  },

  computed: {
    T() {
      return TEXTS[this.$i18n.locale] || TEXTS.uz;
    },
    isFullRefund() {
      return this.mode === 'full';
    },
    pageTitle() {
      return this.isFullRefund ? this.$t("list.fullReturn") : this.$t("list.ozReturn");
    },
    labelSubtitle() {
      return this.$t('contract_labels.refund_choose_method');
    },
  },

  watch: {
    amount() {
      this.updateLink();
      this.validateButton();
    },
    isAffirmed() {
      this.validateButton();
    },
  },

  async mounted() {
    try {
      const response = await this.$axios.get(`/contract/by/${this.$route.query.contract}`, { silent: true });
      this.contract = response.data.data;
      this.initSocket();
      this.updateLink();
    } catch (error) {
      this.$toast.error(this.$t('a1.a42'));
    }
  },

  beforeRouteLeave(to, from, next) {
    this.resetForm();
    next();
  },

  methods: {
    /** To'liq ↔ Qisman: forma tozalanadi (tasdiq belgisi ham — dalolatnoma boshqa). */
    setMode(mode) {
      const m = normMode(mode);
      if (m === this.mode || this.isSubmitting) return;
      this.mode = m;
      this.resetForm();
      this.validateButton();
      this.$router.replace({ query: { ...this.$route.query, mode: m } }).catch(() => {});
    },

    resetForm() {
      this.amount = "";
      this.isAffirmed = false;
      this.isBtnDisabled = true;
      if (this.$refs.input) {
        this.$refs.input.value = "";
      }
      this.$store.commit("changePartialAmount", "");
      this.updateLink();
    },

    validateButton() {
      if (this.isFullRefund) {
        this.isBtnDisabled = !this.isAffirmed;
      } else {
        this.isBtnDisabled = !(this.isAffirmed && !!this.amount);
      }
    },

    validate() {
      this.validateButton();
    },

    changeAmount(e) {
      const firstValue = e.target.value.split("")[0];
      if (firstValue == 0) {
        e.target.value = e.target.value.slice(1, e.target.value.length);
      }
    },

    setAmount(e) {
      const amount = [...e.target.value].filter((c) => c !== " ").join("");
      const reg = /^\d+$/;

      if (reg.test(amount)) {
        if (Number(amount) < Number(this.contract.residual_amount)) {
          this.amount = amount;
        } else {
          this.amount = this.contract.residual_amount;
          this.$refs.input.value = this.amount;
        }
      } else {
        if (amount.length > 0) {
          this.$refs.input.value = this.amount;
        } else {
          this.amount = "";
        }
      }

      this.$store.commit("changePartialAmount", this.amount);
      this.validateButton();
    },

    updateLink() {
      if (!this.contract) return;

      const refundableAmount = this.isFullRefund
        ? this.contract.residual_amount
        : (Number(this.amount) || 0);

      const actType = this.isFullRefund ? ACT_TYPES.FULL_REFUND : ACT_TYPES.PARTIAL_REFUND;

      this.link = this.$actPdfUrl({
        debitor: this.contract.duid,
        creditor: this.contract.cuid,
        act_type: actType,
        amount: this.contract.amount,
        refundable_amount: refundableAmount,
        residual_amount: this.contract.residual_amount,
        end_date: this.time,
        uid: this.contract.uid,
      });
    },

    async sendRefund() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      try {
        const response = await this.$axios.get(`/contract/by/${this.$route.query.contract}`, { silent: true });
        this.dx = response.data.data;

        if (!this.dx) {
          this.$toast.error(this.$t("a1.a105"));
          return this.$router.push(this.localePath({ name: 'index' }));
        }

        if (Number(this.dx.residual_amount) <= 0 || this.dx.status !== 1) {
          return this.$toast.error(this.$t('a1.a106'));
        }

        const data = this.isFullRefund
          ? this.buildFullRefundData()
          : this.buildPartialRefundData();

        const result = await this.$axios.post('/contract/act', data, { silent: true });

        if (result.status === 200 && result.data.msg === API_MESSAGES.END) {
          return this.$toast.error(this.$t("a1.a105"));
        }

        if (result.status === 200 && (result.data.msg === 'ex' || result.data.msg === API_MESSAGES.EXIST || result.data.message === API_MESSAGES.NOT_EST)) {
          return this.$toast.error(this.$t('a1.a65'));
        }

        if (result.status === 201) {
          this.emitNotification(this.$auth.user.id);
          this.$toast.success(this.isFullRefund ? this.$t('a1.a66') : this.$t('a1.a64'));
          this.resetForm();
          this.$router.replace(this.localePath({ name: 'credit-list' }));
        } else {
          this.isSubmitting = false;
        }
      } catch (error) {
        this.isSubmitting = false;
        // 02.10 (sayt hujjati, 2-rasm): server qaytarilayotgan summani joriy qoldiq bilan tekshiradi
        const code = error && error.response && error.response.data && error.response.data.code;
        if (code === 'amount-exceeds') {
          const msg = { uz: "Qaytarilayotgan summa qoldiq qarzdan oshib ketmasligi kerak", ru: 'Возвращаемая сумма не должна превышать остаток долга', kr: 'Қайтарилаётган сумма қолдиқ қарздан ошиб кетмаслиги керак', en: 'The amount being returned must not exceed the remaining debt', kaa: 'Qaytarılıp atırǵan summa qaldıq qarızdan aspawı kerek' };
          return this.$toast.error(msg[this.$i18n.locale] || msg.uz);
        }
        this.$toast.error(this.$t('a1.a42'));
      }
    },

    buildFullRefundData() {
      return {
        refundable_amount: this.dx.residual_amount,
        residual_amount: 0,
        inc: Number(this.dx.residual_amount + this.dx.inc),
        old_amount: this.contract.residual_amount,
        debitor: this.contract.debitor,
        creditor: this.contract.creditor,
        reciver: this.contract.debitor,
        end_date: this.contract.end_date.slice(0, 10),
        contract: this.contract.id,
        sender: this.contract.creditor,
        res: this.contract.debitor,
        status: 0,
        ntype: ACT_TYPES.FULL_REFUND,
        type: ACT_TYPES.FULL_REFUND,
      };
    },

    buildPartialRefundData() {
      const refundAmount = Number(this.amount);
      const remainingAmount = Number(this.dx.residual_amount) - refundAmount;
      const actType = remainingAmount === 0 ? ACT_TYPES.FULL_REFUND : ACT_TYPES.PARTIAL_REFUND;

      return {
        refundable_amount: refundAmount,
        residual_amount: remainingAmount,
        inc: refundAmount + Number(this.dx.inc),
        old_amount: this.contract.residual_amount,
        debitor: this.contract.debitor,
        creditor: this.contract.creditor,
        reciver: this.contract.debitor,
        end_date: this.contract.end_date.slice(0, 10),
        contract: this.contract.id,
        sender: this.contract.creditor,
        res: this.contract.debitor,
        status: 0,
        ntype: ACT_TYPES.PARTIAL_REFUND,
        type: actType,
      };
    },
  },
};
</script>
