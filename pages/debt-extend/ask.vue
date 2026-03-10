<template>
  <div class="bg-white px-4 py-6 rounded-xl">
    <BackButton />
    <div class="m-0 mx-auto max-w-2xl mt-6">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 mb-3">
          <svg class="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
          </svg>
        </div>
        <h1 class="font-bold text-xl text-gray-800">
          {{ $t("action.extend_request") }}
        </h1>
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
            <p>
              <span class="font-semibold">{{ dateFormat(contract.created_at) }}</span> yildagi
              <nuxt-link class="text-blue-500 font-semibold hover:underline"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
                  contract.number
                }}</nuxt-link>-sonli qarz shartnomasi bo'yicha qarzni qaytarish muddatini uzaytirish uchun
              so'rovnoma yubormoqdasiz.
            </p>
          </span>

          <span v-if="$i18n.locale == 'kr'">
            <p>
              <span class="font-semibold">{{ dateFormat(contract.created_at) }}</span> йилдаги
              <nuxt-link class="text-blue-500 font-semibold hover:underline"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
                  contract.number
                }}</nuxt-link>-сонли қарз шартномаси бўйича қарзни қайтариш муддатини узайтириш учун сўровнома
              юбормоқдасиз.
            </p>
          </span>

          <span v-if="$i18n.locale == 'ru'">
            <p>
              Вы отправляете запрос на продление срока возврата долга по договору займа
              №<nuxt-link class="text-blue-500 font-semibold hover:underline"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
                  contract.number
                }}</nuxt-link> от {{ dateFormat(contract.created_at) }} г.
            </p>
          </span>
        </div>

        <!-- Current Deadline -->
        <div class="mt-4 pt-4 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">{{ labelCurrentDeadline }}</span>
            <span class="text-base font-bold text-gray-900">
              {{ dateFormat(contract.end_date) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Date Picker -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">{{ labelNewDate }}</label>
        <div class="form-date-picker">
          <date-picker v-model="time" value-type="YYYY-MM-DD" format="DD.MM.YYYY"
            :placeholder="$t('placeholder.new_date')" :disabled-date="disabledDates"></date-picker>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center mt-8 mb-4">
        <button
          @click="sendAct"
          :disabled="!isFormValid || isLoading"
          class="submit-btn"
          :class="(isFormValid && !isLoading) ? 'submit-btn--active' : 'submit-btn--disabled'"
        >
          <svg v-if="isFormValid && !isLoading" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          {{ $t("send") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormatMixin, socketMixin } from '@/mixins'
import { ACT_TYPES, API_MESSAGES } from '@/utils/constants'
import BackButton from '@/components/BackButton.vue';

export default {
  components: { BackButton },
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
    isFormValid() {
      return !!this.time;
    },
    labelContractInfo() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return "Информация о договоре";
      if (lang === 'kr') return "Шартнома маълумоти";
      return "Shartnoma ma'lumoti";
    },
    labelCurrentDeadline() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return "Текущий срок возврата";
      if (lang === 'kr') return "Ҳозирги қайтариш муддати";
      return "Hozirgi qaytarish muddati";
    },
    labelNewDate() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return "Выберите новую дату возврата";
      if (lang === 'kr') return "Янги қайтариш санасини танланг";
      return "Yangi qaytarish sanasini tanlang";
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
      return date < minDate;
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
        const response = await this.$axios.post("/contract/act", this.buildActData());

        if (response.data.msg === API_MESSAGES.EXIST) {
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

<style scoped>
.info-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
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
