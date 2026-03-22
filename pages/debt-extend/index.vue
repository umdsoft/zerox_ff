<template>
  <div class="bg-white px-4 py-4" style="border-radius: 10px">
    <BackButton />
    <div class="m-0 mx-auto max-w-2xl mt-8" v-if="contract != null">
      <h1 class="text-center font-extrabold text-xl mb-5">
        {{ $t("action.extend") }}
      </h1>
      <div class="shadow-lg px-5 py-10 pb-6 rounded-lg mb-5">
        <span v-if="$i18n.locale == 'uz'">
          <p>
            {{ $formatDate(contract.contract_date || contract.created_at) }} yildagi
            <b><a class="text-blue-400" :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{
                  contract.number }}</a></b>-sonli qarz shartnomasi bo'yicha qarzni qaytarish muddatini
            uzaytirmoqdasiz.
          </p>
          <p>
            Qarzni qaytarishning hozirgi muddati -
            <b>{{ $formatDate(contract.end_date) }} yil.</b>
          </p>
        </span>

        <span v-if="$i18n.locale == 'kr'">
          <p>
            {{ $formatDate(contract.contract_date || contract.created_at) }} йилдаги
            <b><a class="text-blue-400" :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{
                  contract.number }}</a></b>-сонли қарз шартномаси бўйича қарзни қайтариш муддатини
            узайтирмоқдасиз.
          </p>
          <p>
            Қарзни қайтаришнинг ҳозирги муддати -
            <b>{{ $formatDate(contract.end_date) }} йил.</b>
          </p>
        </span>

        <span v-if="$i18n.locale == 'ru'">
          <p>
            Вы продлеваете срок возврата долга по договору займа №<a class="text-blue-400" :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{
                contract.number }}</a> от {{ $formatDate(contract.contract_date || contract.created_at) }} г.
          </p>
          <p>
            Текущий срок возврата суммы займа - <b>{{ $formatDate(contract.end_date) }} г.</b>
          </p>
        </span>
      </div>

      <div class="form-date-picker">
        <date-picker v-model="time" value-type="YYYY-MM-DD" format="DD.MM.YYYY"
          :placeholder="$t('placeholder.new_date')" :disabled-date="disabledDates"></date-picker>
      </div>

      <div class="mt-10 flex justify-center items-center">
        <input @change="validate" v-model="isAffirmed" class="w-5 h-5" type="checkbox" name="" id="ok" />
        <a :href="link" target="_blank" style="cursor: pointer"
          class="ml-2 underline text-center text-blue-400 text-sm">{{ $t("action.agree_terms") }}
        </a>
      </div>
      <div class="flex justify-center">
        <button :disabled="isBtnDisabled" @click="sendAct" :class="isBtnDisabled ? 'bg-t_error' : 'bg-t_primary'"
          class="p-4 w-2/5 my-10 mx-auto rounded-md text-white">
          {{ $t("send") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormatMixin } from '@/mixins'
import BackButton from '@/components/BackButton.vue';

export default {
  components: { BackButton },
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

      return date < minDate || date > maxDate;
    },
    validate() {
      if (this.isAffirmed) {
        this.isBtnDisabled = false;
      } else {
        this.isBtnDisabled = true;
      }
    },

    async sendAct() {
      const mismatch = await this.$checkDateMismatch();
      if (mismatch) {
        return this.$toast.error(this.$t('a1.a103'));
      }
      if (!this.time) {
        return this.$toast.error(this.$t('a1.a52'));
      }
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
        }
      } catch (e) {
        this.$toast.error(this.$t('errors.operationFailed') || 'Operation failed');
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
