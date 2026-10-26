<template>
  <!-- 23.10 (22.10 hujjati, 9-rasm): 2 ustunli tartib — chapda shartnoma ma'lumoti, o'ngda muddat
       uzaytirish so'rovi formasi. Xatti-harakat (POST /contract/act, type EXTEND) o'zgarmagan. -->
  <ContractActionLayout :contract="contract" :title="$t('action.extend_request')" tone="indigo">
    <template #icon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
    </template>

    <template v-if="contract">
      <p class="cal-f-title">{{ $t("action.extend_request") }}</p>
      <div class="cal-f-intro">
        <!-- SS-DEV (2026-09-26): en/kaa tillarida matn uz (lotin) shoxidan ko'rsatiladi — $apiLang() en/kaa->uz -->
        <span v-if="$i18n.locale == 'uz'">
          <p>
            <span class="font-semibold">{{ dateFormat(contract.contract_date || contract.created_at) }}</span> yildagi
            <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-sonli qarz shartnomasi bo'yicha qarzni qaytarish muddatini uzaytirish uchun
            so'rovnoma yubormoqdasiz.
          </p>
        </span>

        <span v-if="$i18n.locale == 'en'">
          <p>
            You are sending a request to extend the repayment term under loan agreement No. <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a> dated <span class="font-semibold">{{ dateFormat(contract.contract_date || contract.created_at) }}</span>.
          </p>
        </span>

        <span v-if="$i18n.locale == 'kaa'">
          <p>
            <span class="font-semibold">{{ dateFormat(contract.contract_date || contract.created_at) }}</span> jılındaǵı <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-nomerli qarız shártnaması boyınsha qarızdı qaytarıw múddetin uzaytırıw ushın soraw jiberip atırsız.
          </p>
        </span>

        <span v-if="$i18n.locale == 'kr'">
          <p>
            <span class="font-semibold">{{ dateFormat(contract.contract_date || contract.created_at) }}</span> йилдаги
            <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-сонли қарз шартномаси бўйича қарзни қайтариш муддатини узайтириш учун сўровнома
            юбормоқдасиз.
          </p>
        </span>

        <span v-if="$i18n.locale == 'ru'">
          <p>
            Вы отправляете запрос на продление срока возврата долга по договору займа
            №<a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a> от {{ dateFormat(contract.contract_date || contract.created_at) }} г.
          </p>
        </span>

        <div class="cal-f-divider">
          <span v-if="$i18n.locale == 'uz'">Qarzni qaytarishning hozirgi muddati - <span class="font-bold text-gray-900">{{ dateFormat(contract.end_date) }} yil</span>.</span>
          <span v-else-if="$i18n.locale == 'kr'">Қарзни қайтаришнинг ҳозирги муддати - <span class="font-bold text-gray-900">{{ dateFormat(contract.end_date) }} йил</span>.</span>
          <span v-else-if="$i18n.locale == 'ru'">Текущий срок возврата займа - <span class="font-bold text-gray-900">{{ dateFormat(contract.end_date) }} г</span>.</span>
          <span v-else-if="$i18n.locale == 'en'">The current repayment due date is <span class="font-bold text-gray-900">{{ dateFormat(contract.end_date) }}</span>.</span>
          <span v-else>Qarızdı qaytarıwdıń házirgi múddeti - <span class="font-bold text-gray-900">{{ dateFormat(contract.end_date) }} jıl</span>.</span>
        </div>
      </div>

      <label class="cal-f-label">{{ $t('placeholder.new_date') }}</label>
      <div class="form-date-picker">
        <date-picker v-model="time" value-type="YYYY-MM-DD" format="DD.MM.YYYY"
          :placeholder="$t('placeholder.new_date')" :disabled-date="disabledDates"></date-picker>
      </div>

      <div class="cal-f-actions">
        <button
          type="button"
          class="cal-f-submit"
          :disabled="!isFormValid || isLoading"
          @click="sendAct"
        >
          <svg v-if="isFormValid && !isLoading" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          {{ $t("send") }}
        </button>
      </div>
    </template>
  </ContractActionLayout>
</template>

<script>
import { dateFormatMixin, socketMixin } from '@/mixins'
import { ACT_TYPES, API_MESSAGES } from '@/utils/constants'
import ContractActionLayout from '@/components/contract/ContractActionLayout.vue';

export default {
  components: { ContractActionLayout },
  middleware: 'auth',

  mixins: [dateFormatMixin, socketMixin],

  data: () => ({
    contract: null, // 23.10: null — yuklanguncha bo'sh ma'lumot kartasi chizilmasin
    time: null,
    isLoading: false,
  }),

  async mounted() {
    await this.loadContract();
    this.initSocket();
    this.setupDateInput();
  },

  computed: {
    isFormValid() {
      return !!this.time;
    },
  },

  methods: {
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

    disabledDates(date) {
      const endDate = new Date(this.contract.end_date);
      const today = new Date();
      today.setHours(1, 0, 0, 0);
      endDate.setHours(1, 0, 0, 0);

      const minDate = endDate < today ? today : endDate;
      return date <= minDate;
    },

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
        const response = await this.$axios.post("/contract/act", this.buildActData(), { silent: true });

        if (response.data.msg === 'ex' || response.data.msg === API_MESSAGES.EXIST) {
          return this.$toast.error(this.$t('a1.a65'));
        }

        if (response.status === 201) {
          this.emitNotification(this.$auth.user.id);
          this.$toast.success(this.$t('a1.a67'));
          this.$backWithLocale();
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
