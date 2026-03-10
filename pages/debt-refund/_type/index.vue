<template>
  <div class="bg-white px-4 py-6 w-full my-4 rounded-xl">
    <BackButton />

    <div v-if="contract != null">
      <div class="flex justify-center items-center">
        <div class="w-full max-w-2xl mt-6">
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
              :class="isFullRefund ? 'bg-green-50' : 'bg-orange-50'">
              <svg v-if="isFullRefund" class="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-7 h-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
            </div>
            <h2 class="font-bold text-xl text-gray-800">
              {{ pageTitle }}
            </h2>
          </div>

          <!-- Contract Info Card -->
          <div class="info-card">
            <div class="flex items-center mb-3">
              <svg class="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span class="text-sm font-medium text-gray-500">{{ labelContractInfo }}</span>
            </div>

            <div class="text-sm text-gray-700 leading-relaxed">
              <span v-if="$i18n.locale == 'uz'">
                {{ dateFormat(contract.created_at) }} yildagi
                <nuxt-link class="text-blue-500 font-semibold hover:underline"
                  :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">
                  {{ contract.number }}
                </nuxt-link>-sonli qarz shartnomasi bo'yicha Siz fuqaro
                <span class="font-semibold text-gray-900">{{ contract.debitor_name }}</span>ga qarzni {{ isFullRefund ? "to'liq" : "qisman" }} qaytarmoqdasiz.
              </span>

              <span v-if="$i18n.locale == 'kr'">
                {{ dateFormat(contract.created_at) }} йилдаги
                <nuxt-link class="text-blue-500 font-semibold hover:underline"
                  :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">
                  {{ contract.number }}
                </nuxt-link>-сонли қарз шартномаси бўйича Сиз фуқаро
                <span class="font-semibold text-gray-900">{{ contract.debitor_name }}</span>га қарзни {{ isFullRefund ? "тўлиқ" : "қисман" }} қайтармоқдасиз.
              </span>

              <span v-if="$i18n.locale == 'ru'">
                По договору займа №<nuxt-link class="text-blue-500 font-semibold hover:underline"
                  :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">
                  {{ contract.number }}
                </nuxt-link> от {{ dateFormat(contract.created_at) }} г. Вы {{ isFullRefund ? "полностью" : "частично" }}
                возвращаете долг Займодавцу (<span class="font-semibold text-gray-900">{{ contract.debitor_name }}</span>).
              </span>
            </div>

            <!-- Total Debt Amount -->
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">{{ labelTotalDebt }}</span>
                <span class="text-lg font-bold text-gray-900">
                  {{ formatAmount(contract.residual_amount) }}
                  <span class="text-sm font-medium text-gray-500">{{ contract.currency }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Amount Input (only for partial refund) -->
          <div v-if="!isFullRefund" class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ labelEnterAmount }}</label>
            <div class="relative">
              <input
                ref="input"
                :value="amount"
                v-format="amount"
                @input="setAmount"
                @keyup="changeAmount($event)"
                type="text"
                :placeholder="$t('placeholder.summo')"
                class="amount-input"
              />
              <span v-if="contract.currency" class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                {{ contract.currency }}
              </span>
            </div>
          </div>

          <!-- Checkbox + Act Link -->
          <div class="mt-6 flex items-start">
            <input
              @change="validate"
              v-model="isAffirmed"
              class="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
              type="checkbox"
              id="ok"
            />
            <a :href="link" target="_blank" class="ml-3 text-blue-500 text-sm font-medium hover:underline cursor-pointer">
              {{ $t("action.agree_terms") }}
            </a>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center mt-8 mb-4">
            <button
              :disabled="isBtnDisabled"
              @click="sendRefund"
              class="submit-btn"
              :class="isBtnDisabled ? 'submit-btn--disabled' : 'submit-btn--active'"
            >
              <svg v-if="!isBtnDisabled" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
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
import BackButton from '@/components/BackButton.vue';

export default {
  components: { BackButton },
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
    refundType() {
      return this.$route.params.type || 'full';
    },
    isFullRefund() {
      return this.refundType === 'full';
    },
    pageTitle() {
      return this.isFullRefund
        ? this.$t("list.fullReturn")
        : this.$t("list.ozReturn");
    },
    labelContractInfo() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return "Информация о договоре";
      if (lang === 'kr') return "Шартнома маълумоти";
      return "Shartnoma ma'lumoti";
    },
    labelTotalDebt() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return "Общая сумма долга";
      if (lang === 'kr') return "Умумий қарз суммаси";
      return "Umumiy qarz summasi";
    },
    labelEnterAmount() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return "Введите сумму возврата";
      if (lang === 'kr') return "Қайтариш суммасини киритинг";
      return "Qaytarish summasini kiriting";
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
    formatAmount(amount) {
      if (!amount) return '0';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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
          this.$backWithLocale();
        }
      } catch (error) {
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

<style lang="css" scoped>
.info-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
}

.amount-input {
  width: 100%;
  height: 52px;
  padding: 0 3.5rem 0 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.625rem;
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  transition: all 0.2s ease;
  background: white;
}

.amount-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.amount-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  padding: 0.875rem 2rem;
  font-weight: 600;
  font-size: 0.938rem;
  border-radius: 0.625rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.submit-btn--active {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.submit-btn--active:hover {
  background: #2563eb;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.submit-btn--disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
