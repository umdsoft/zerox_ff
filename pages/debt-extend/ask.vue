<template>
  <div class="bg-white px-4 py-4" style="border-radius: 10px">
      <div @click="$backWithLocale()" class="my-2 mx-6 hidden lg:inline-flex items-center" style="cursor:pointer">
          <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <polyline points="15 6 9 12 15 18" />
          </svg>
          <p class="text-blue-500">{{ $t('back') }}</p>
        </div>
    <div class="m-0 mx-auto max-w-2xl mt-8">
      <h1 class="text-center font-extrabold text-xl mb-5">
        {{ $t("action.a0") }}
      </h1>
      <div class="shadow-lg px-5 py-10 pb-8 rounded-lg mb-5">
        <span v-if="$i18n.locale == 'uz'">
          <p>
            <b> {{ dateFormat(contract.created_at) }}</b> yildagi
            <b><nuxt-link class="text-blue-400"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
                  contract.number
                }}</nuxt-link></b>-sonli qarz shartnomasi bo‘yicha qarzni qaytarish muddatini uzaytirish uchun
            so‘rovnoma yubormoqdasiz.
          </p>
          <p>
            Qarzni qaytarishning hozirgi muddati -
            <b>{{ dateFormat(contract.end_date) }}</b> yil.
          </p>
        </span>

        <span v-if="$i18n.locale == 'kr'">
          <p>
            <b> {{ dateFormat(contract.created_at) }}</b> йилдаги
            <b><nuxt-link class="text-blue-400"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
                  contract.number
                }}</nuxt-link></b>-сонли қарз шартномаси бўйича қарзни қайтариш муддатини узайтириш учун сўровнома
            юбормоқдасиз.
          </p>
          <p>
            Қарзни қайтаришнинг ҳозирги муддати -
            <b>{{ dateFormat(contract.end_date) }}</b> йил.
          </p>
        </span>

        <span v-if="$i18n.locale == 'ru'">
          <p>
            Вы отправляете запрос на продление срока возврата долга по договору займа №<b><nuxt-link
                class="text-blue-400" :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
                  contract.number
                }}</nuxt-link></b> от {{ dateFormat(contract.created_at) }} г.
          </p>
          <br>
          <p>
            Текущий срок возврата суммы займа - <b>{{ dateFormat(contract.end_date) }}</b> г.
          </p>
        </span>
      </div>
      <div class="form-date-picker">
        <date-picker v-model="time" value-type="YYYY-MM-DD" format="DD.MM.YYYY"
          :placeholder="$t('placeholder.new_date')" :disabled-date="disabledDates"></date-picker>
      </div>
      <div class="flex justify-center">
        <button @click="sendAct" class="p-4 w-2/5 my-10 mx-auto rounded-md text-white bg-t_primary">
          {{ $t("send") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormatMixin, socketMixin } from '@/mixins'
import { ACT_TYPES, API_MESSAGES } from '@/utils/constants'

export default {
  middleware: 'auth',

  mixins: [dateFormatMixin, socketMixin],

  data: () => ({
    contract: {},
    time: null,
    isLoading: false,
  }),

  async mounted() {
    await this.loadContract();
    this.initSocket();
    this.setupDateInput();
  },

  computed: {
    /**
     * Check if form is valid for submission
     */
    isFormValid() {
      return !!this.time;
    },
  },

  methods: {
    /**
     * Load contract data from API
     */
    async loadContract() {
      try {
        const response = await this.$axios.get(
          `/contract/by/${this.$route.query.id}`
        );
        this.contract = response.data.data;
      } catch (error) {
        this.$toast.error(this.$t('a1.a42'));
      }
    },

    /**
     * Setup date input formatting
     */
    setupDateInput() {
      setTimeout(() => {
        const input = document.querySelector(".mx-input");
        if (!input) return;

        input.addEventListener("keydown", this.handleDateKeydown);
        input.addEventListener("keyup", this.handleDateKeyup);
      }, 500);
    },

    /**
     * Handle keydown event for date input
     */
    handleDateKeydown(e) {
      const key = parseInt(e.key);
      const isBackspace = e.which === 8;
      const endsWithDot = e.target.value.charAt(e.target.value.length - 1) === ".";

      if (isBackspace && endsWithDot) {
        e.target.value = e.target.value.slice(0, -2);
        e.preventDefault();
        return;
      }

      if (!(Number.isInteger(key) && e.target.value.length < 10) && !isBackspace) {
        e.preventDefault();
      }
    },

    /**
     * Handle keyup event for date input formatting
     */
    handleDateKeyup(e) {
      const value = e.target.value.replace(/[^0-9]/g, "");
      const length = value.length;

      if (length >= 8) {
        e.target.value = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4, 8)}`;
      } else if (length >= 4) {
        e.target.value = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4)}`;
      } else if (length >= 2) {
        e.target.value = `${value.slice(0, 2)}.${value.slice(2)}`;
      }
    },

    /**
     * Disable dates before contract end date or today
     */
    disabledDates(date) {
      const endDate = new Date(this.contract.end_date);
      const today = new Date();
      today.setHours(1, 0, 0, 0);
      endDate.setHours(1, 0, 0, 0);

      const minDate = endDate < today ? today : endDate;
      return date < minDate;
    },

    /**
     * Build act data for API request
     */
    buildActData() {
      return {
        end_date: this.time,
        contract: this.contract.id,
        debitor: this.contract.debitor,
        creditor: this.contract.creditor,
        reciver: this.contract.debitor,
        old_amount: this.contract.residual_amount,
        refundable_amount: 0,
        residual_amount: this.contract.residual_amount,
        inc: this.contract.inc,
        sender: this.contract.creditor,
        res: this.contract.debitor,
        type: ACT_TYPES.EXTEND,
        ntype: ACT_TYPES.EXTEND,
        status: 0,
      };
    },

    /**
     * Send extend request to API
     */
    async sendAct() {
      const mismatch = await this.$checkDateMismatch();
      if (mismatch) {
        return this.$toast.error(this.$t('a1.a103'));
      }

      if (!this.isFormValid) {
        return this.$toast.error(this.$t('a1.a52'));
      }

      this.isLoading = true;

      try {
        const response = await this.$axios.post("/contract/act", this.buildActData());

        if (response.data.msg === API_MESSAGES.EXIST) {
          return this.$toast.error(this.$t('a1.a65'));
        }

        if (response.status === 201) {
          this.emitNotification(this.$auth.user.id);
          this.$toast.success(this.$t('a1.a67'));
          this.$router.go(-1);
        }
      } catch (error) {
        this.$toast.error(this.$t('a1.a42'));
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped></style>
