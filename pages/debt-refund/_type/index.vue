<template>
  <div class="waiver bg-white px-4 py-4 w-full my-4" style="border-radius: 6px">
    <div @click="$backWithLocale()" class="my-2 mx-6 hidden lg:inline-flex items-center" style="cursor:pointer">
      <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      <p class="text-blue-500">{{ $t('back') }}</p>
    </div>

    <div v-if="contract != null">
      <div class="flex justify-center items-center">
        <div style="width: 40.6rem" class="mt-12">
          <h2 class="font-bold text-xl text-center">
            {{ pageTitle }}
          </h2>

          <div class="debt_notification pt-6 pb-12 px-6 mt-4">
            <span v-if="$i18n.locale == 'uz'">
              {{ dateFormat(contract.created_at) }} yildagi
              <b>
                <nuxt-link class="text-blue-400"
                  :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">
                  {{ contract.number }}
                </nuxt-link>
              </b>-sonli qarz shartnomasi bo'yicha Siz fuqaro
              <b>{{ contract.debitor_name }}</b>ga qarzni {{ isFullRefund ? "to'liq" : "qisman" }} qaytarmoqdasiz.
              <div class="mt-8">
                Sizning umumiy qarzingiz -
                <b>{{ formatAmount(contract.residual_amount) }} {{ contract.currency }}.</b>
              </div>
            </span>

            <span v-if="$i18n.locale == 'kr'">
              {{ dateFormat(contract.created_at) }} йилдаги
              <b>
                <nuxt-link class="text-blue-400"
                  :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">
                  {{ contract.number }}
                </nuxt-link>
              </b>-сонли қарз шартномаси бўйича Сиз фуқаро
              <b>{{ contract.debitor_name }}</b>га қарзни {{ isFullRefund ? "тўлиқ" : "қисман" }} қайтармоқдасиз.
              <div class="mt-8">
                Сизнинг умумий қарзингиз -
                <b>{{ formatAmount(contract.residual_amount) }} {{ contract.currency }}.</b>
              </div>
            </span>

            <span v-if="$i18n.locale == 'ru'">
              По договору займа №
              <b>
                <nuxt-link class="text-blue-400"
                  :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">
                  {{ contract.number }}
                </nuxt-link>
              </b> от {{ dateFormat(contract.created_at) }} г. Вы {{ isFullRefund ? "полностью" : "частично" }}
              возвращаете долг Займодавцу ({{ contract.debitor_name }}).
              <div class="mt-8">
                Ваш общий долг -
                <b>{{ formatAmount(contract.residual_amount) }} {{ contract.currency }}.</b>
              </div>
            </span>
          </div>

          <!-- Amount Input (only for partial refund) -->
          <div v-if="!isFullRefund" class="flex justify-center mt-8">
            <input
              ref="input"
              :value="amount"
              v-format="amount"
              @input="setAmount"
              @keyup="changeAmount($event)"
              type="text"
              :placeholder="$t('placeholder.summo')"
              class="input"
            />
          </div>

          <div class="mt-10 flex justify-center items-center">
            <input @change="validate" v-model="isAffirmed" class="w-5 h-5" type="checkbox" name="" id="ok" />
            <a :href="link" target="_blank" style="cursor: pointer"
              class="ml-2 underline text-center text-blue-400 text-sm">
              {{ $t("action.a3") }}
            </a>
          </div>

          <div class="flex justify-center mt-8">
            <button
              :disabled="isBtnDisabled"
              @click="sendRefund"
              :class="isBtnDisabled ? 'bg-t_error' : 'bg-t_primary'"
              class="p-5 mb-5 bg-t_primary w-72 py-4 font-bold text-white rounded"
            >
              {{ $t("send") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormatMixin, socketMixin } from '@/mixins';
import { ACT_TYPES, API_MESSAGES } from '@/utils/constants';

export default {
  name: 'DebtRefund',

  middleware: "auth",

  mixins: [dateFormatMixin, socketMixin],

  data: () => ({
    amount: "",
    isAffirmed: false,
    isBtnDisabled: true,
    contract: null,
    dx: null,
    link: "",
  }),

  computed: {
    /**
     * Get refund type from route params
     */
    refundType() {
      return this.$route.params.type || 'full';
    },

    /**
     * Check if this is a full refund
     */
    isFullRefund() {
      return this.refundType === 'full';
    },

    /**
     * Page title based on refund type
     */
    pageTitle() {
      return this.isFullRefund
        ? this.$t("list.fullReturn")
        : this.$t("list.ozReturn");
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
      const response = await this.$axios.get(`/contract/by/${this.$route.query.contract}`);
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
    /**
     * Format amount with thousand separators
     */
    formatAmount(amount) {
      if (!amount) return '0';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },

    /**
     * Reset form to initial state
     */
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

    /**
     * Validate button state
     */
    validateButton() {
      if (this.isFullRefund) {
        this.isBtnDisabled = !this.isAffirmed;
      } else {
        this.isBtnDisabled = !(this.isAffirmed && !!this.amount);
      }
    },

    /**
     * Handle checkbox change
     */
    validate() {
      this.validateButton();
    },

    /**
     * Handle amount change (prevent leading zeros)
     */
    changeAmount(e) {
      const firstValue = e.target.value.split("")[0];
      if (firstValue == 0) {
        e.target.value = e.target.value.slice(1, e.target.value.length);
      }
    },

    /**
     * Set and validate amount input
     */
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

    /**
     * Update PDF preview link
     */
    updateLink() {
      if (!this.contract) return;

      const refundableAmount = this.isFullRefund
        ? this.contract.residual_amount
        : (Number(this.amount) || 0);

      const actType = this.isFullRefund ? ACT_TYPES.FULL_REFUND : ACT_TYPES.PARTIAL_REFUND;

      this.link = `https://pdf.zerox.uz/act.php?debitor=${this.contract.duid}` +
        `&creditor=${this.contract.cuid}` +
        `&act_type=${actType}` +
        `&amount=${this.contract.amount}` +
        `&refundable_amount=${refundableAmount}` +
        `&residual_amount=${this.contract.residual_amount}` +
        `&end_date=${this.time}` +
        `&uid=${this.contract.uid}` +
        `&lang=${this.$i18n.locale}`;
    },

    /**
     * Send refund request (full or partial based on type)
     */
    async sendRefund() {
      try {
        const response = await this.$axios.get(`/contract/by/${this.$route.query.contract}`);
        this.dx = response.data.data;

        if (!this.dx) {
          this.$toast.error(this.$t("a1.a105"));
          return this.$router.push(this.localePath({ name: 'index' }));
        }

        const data = this.isFullRefund
          ? this.buildFullRefundData()
          : this.buildPartialRefundData();

        const result = await this.$axios.post('/contract/act', data);

        if (result.status === 200 && result.data.msg === API_MESSAGES.END) {
          return this.$toast.error(this.$t("a1.a105"));
        }

        if (result.status === 200 && (result.data.msg === API_MESSAGES.EXIST || result.data.message === API_MESSAGES.NOT_EST)) {
          return this.$toast.error(this.$t('a1.a65'));
        }

        if (result.status === 201) {
          this.emitNotification(this.$auth.user.id);
          this.$toast.success(this.isFullRefund ? this.$t('a1.a66') : this.$t('a1.a64'));
          this.resetForm();
          this.$router.go(-1);
        }
      } catch (error) {
        this.$toast.error(this.$t('a1.a42'));
      }
    },

    /**
     * Build data object for full refund
     */
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

    /**
     * Build data object for partial refund
     */
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

<style lang="css" scoped>
.debt_notification {
  width: 100%;
  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: white;
}

.input {
  border: 1px solid #1565d8;
  width: 100%;
  height: 50px;
  text-indent: 10px;
  border-radius: 5px;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  box-shadow: 0px 4px 10px 3px rgba(0, 0, 0, 0.11);
  border: 1px solid #1565d8;
}
</style>
