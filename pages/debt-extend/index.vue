<template>
  <!-- 23.10 (22.10 hujjati, 6-rasm): 2 ustunli tartib — chapda shartnoma ma'lumoti, o'ngda yangi muddat
       formasi. Xatti-harakat (POST /contract/deb-uzay, sana cheklovlari) o'zgarmagan. -->
  <ContractActionLayout :contract="contract" :title="$t('action.extend')" tone="indigo">
    <template #icon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    </template>

    <template v-if="contract">
      <p class="cal-f-title">{{ $t("action.extend") }}</p>
      <div class="cal-f-intro">
        <!-- SS-DEV (2026-09-26): en/kaa tillarida matn uz (lotin) shoxidan ko'rsatiladi — $apiLang() en/kaa->uz -->
        <span v-if="$i18n.locale == 'uz'">
          <p>
            {{ $formatDate(contract.contract_date || contract.created_at) }} yildagi
            <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-sonli qarz shartnomasi bo'yicha qarzni qaytarish muddatini
            uzaytirmoqdasiz.
          </p>
          <p class="cal-f-divider">
            Qarzni qaytarishning hozirgi muddati -
            <b>{{ $formatDate(contract.end_date) }} yil.</b>
          </p>
        </span>

        <span v-if="$i18n.locale == 'en'">
          <p>
            You are extending the repayment term under loan agreement No. <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a> dated {{ $formatDate(contract.contract_date || contract.created_at) }}.
          </p>
          <p class="cal-f-divider">
            The current repayment due date is <b>{{ $formatDate(contract.end_date) }}</b>.
          </p>
        </span>

        <span v-if="$i18n.locale == 'kaa'">
          <p>
            {{ $formatDate(contract.contract_date || contract.created_at) }} jılındaǵı <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-nomerli qarız shártnaması boyınsha qarızdı qaytarıw múddetin uzaytıp atırsız.
          </p>
          <p class="cal-f-divider">
            Qarızdı qaytarıwdıń házirgi múddeti - <b>{{ $formatDate(contract.end_date) }} jıl.</b>
          </p>
        </span>

        <span v-if="$i18n.locale == 'kr'">
          <p>
            {{ $formatDate(contract.contract_date || contract.created_at) }} йилдаги
            <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-сонли қарз шартномаси бўйича қарзни қайтариш муддатини
            узайтирмоқдасиз.
          </p>
          <p class="cal-f-divider">
            Қарзни қайтаришнинг ҳозирги муддати -
            <b>{{ $formatDate(contract.end_date) }} йил.</b>
          </p>
        </span>

        <span v-if="$i18n.locale == 'ru'">
          <p>
            Вы продлеваете срок возврата долга по договору займа №<a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a> от {{ $formatDate(contract.contract_date || contract.created_at) }} г.
          </p>
          <p class="cal-f-divider">
            Текущий срок возврата суммы займа - <b>{{ $formatDate(contract.end_date) }} г.</b>
          </p>
        </span>
      </div>

      <label class="cal-f-label">{{ $t('placeholder.new_date') }}</label>
      <div class="form-date-picker">
        <date-picker v-model="time" value-type="YYYY-MM-DD" format="DD.MM.YYYY"
          :placeholder="$t('placeholder.new_date')" :disabled-date="disabledDates"></date-picker>
      </div>

      <label class="cal-f-check" for="ok">
        <input id="ok" v-model="isAffirmed" type="checkbox" @change="validate" />
        <a :href="link" target="_blank" rel="noopener noreferrer" @click.prevent.stop="$openSignedActLink(link)">{{ $t("action.agree_terms") }}</a>
      </label>

      <div class="cal-f-actions">
        <button type="button" class="cal-f-submit cal-f-submit--red" :disabled="isBtnDisabled || isSubmitting" @click="sendAct">
          {{ $t("send") }}
        </button>
      </div>
    </template>
  </ContractActionLayout>
</template>

<script>
import { dateFormatMixin } from '@/mixins'
import ContractActionLayout from '@/components/contract/ContractActionLayout.vue';

export default {
  components: { ContractActionLayout },
  middleware: "auth",
  mixins: [dateFormatMixin],
  computed: {
    link() {
      if (!this.contract) return null;
      return this.$actPdfUrl({
        debitor: this.contract.duid,
        creditor: this.contract.cuid,
        act_type: 6,
        refundable_amount: this.contract.refundable_amount,
        residual_amount: this.contract.residual_amount,
        end_date: this.time,
        uid: this.contract.uid,
      });
    },
  },
  data: () => ({
    contract: null,
    time: null,
    isAffirmed: false,
    isBtnDisabled: true,
    isSubmitting: false,
  }),
  async mounted() {
    if (!this.$auth.loggedIn) {
      return this.$router.push(this.localePath({ name: "auth-login" }));
    }
    const contract = await this.$axios.get(
      `/contract/by/${this.$route.query.id}`
    );
    this.contract = contract.data.data;
    this.socket = this.$nuxtSocket({
      name: "home",
      channel: "/",
      secure: true,
    });
    this.setupDateInput();
  },
  methods: {
    disabledDates(date) {
      const createdAt = new Date(this.contract.contract_date || this.contract.created_at);
      const endDate = new Date(this.contract.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      createdAt.setHours(0, 0, 0, 0);

      // Minimal sana: end_date yoki bugun (qaysi biri kechroq)
      const minDate = endDate < today ? today : endDate;

      // Maksimal sana: created_at + 2 yil
      const maxDate = new Date(createdAt);
      maxDate.setFullYear(maxDate.getFullYear() + 2);

      return date <= minDate || date > maxDate;
    },
    validate() {
      if (this.isAffirmed) {
        this.isBtnDisabled = false;
      } else {
        this.isBtnDisabled = true;
      }
    },

    async sendAct() {
      if (this.isSubmitting) return;
      const mismatch = await this.$checkDateMismatch();
      if (mismatch) {
        return this.$toast.error(this.$t('a1.a103'));
      }
      if (!this.time) {
        return this.$toast.error(this.$t('a1.a52'));
      }
      this.isSubmitting = true;
      const newAct = {
        end_date: this.time,
        contract: this.contract.id,
        debitor: this.contract.debitor,
        old_amount: this.contract.residual_amount,
        creditor: this.contract.creditor,
        reciver: this.contract.creditor,
        refundable_amount: 0,
        residual_amount: this.contract.residual_amount,
        sender: this.contract.debitor,
        res: this.contract.debitor,
        inc: this.contract.inc,
      };
      try {
        const response = await this.$axios.post("/contract/deb-uzay", newAct, { silent: true });
        if (response.status == 200 && response.data.msg == "ex") {
          this.isSubmitting = false;
          this.$toast.error(this.$t('a1.a70'));
        }
        if (response.status == 201) {
          this.socket.emit(
            "notification",
            { userId: this.$auth.user.id },
            () => { }
          );
          this.$toast.success(this.$t('a1.a68'));
          this.$backWithLocale();
        } else {
          this.isSubmitting = false;
        }
      } catch (e) {
        this.isSubmitting = false;
        this.$toast.error(this.$t('errors.operationFailed'));
      }
    },
  },
};
</script>

<style scoped>
.date {
  outline: none;
  width: 100%;
  border: none;
  text-align: center;
}

.date::placeholder {
  text-align: center;
  color: black;
}

.vdpWithInput {
  font-size: 12px;
}
</style>
