<template>
  <div class="waiver bg-white px-4 py-4 w-full" style="border-radius: 6px" v-if="contract != null">
    <div @click="$router.go(-1)" class="my-2 mx-6 hidden lg:inline-flex items-center" style="cursor: pointer">
      <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      <p class="text-blue-500">{{ $t("back") }}</p>
    </div>
    <div>
      <div class="flex justify-center items-center">
        <div style="width: 40.6rem">
          <h2 class="font-bold text-xl text-center">{{ $t("action.a21") }}</h2>
          <div class="debt_notification pt-6 pb-12 px-6 mt-4">
            <span v-if="$i18n.locale == 'uz'">
              Siz {{ dateFormat(contract.created_at) }} yildagi
              <nuxt-link class="text-blue-400"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })"><b>{{
                  contract.number }}</b></nuxt-link>
              -sonli qarz shartnomasi bo‘yicha
              <br><b>{{
                contract.residual_amount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                {{ contract.currency }}</b>
              qarzdan voz kechmoqdasiz.
            </span>

            <span v-if="$i18n.locale == 'kr'">
              Сиз {{ dateFormat(contract.created_at) }} йилдаги
              <nuxt-link class="text-blue-400"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })"><b>{{
                  contract.number }}</b></nuxt-link>-сонли қарз шартномаси бўйича
              <br><b>{{
                contract.residual_amount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                {{ contract.currency }}</b>
              қарздан воз кечмоқдасиз.
            </span>

            <span v-if="$i18n.locale == 'ru'">
              Вы освобождаете Заёмщика от возврата суммы займа в размере <br><b>{{
                contract.residual_amount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                {{ contract.currency }}</b> по договору займа №<nuxt-link class="text-blue-400"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })"><b>{{
                  contract.number }}</b></nuxt-link> от {{ dateFormat(contract.created_at) }} г.
            </span>
          </div>

          <h3 class="mt-4">
            <!-- Foydalanuvchi qarzi :  {{Number(contract.amount) - (contract.act.refundable_amount ? contract.act.refundable_amount : 0)}} {{contract.currency}} -->
          </h3>

          <div class="mt-10 flex justify-center items-center">
            <input @change="validate" v-model="isAffirmed" class="w-5 h-5" type="checkbox" name="" id="ok" />
            <a :href="link" target="_blank" style="cursor: pointer"
              class="ml-2 underline text-center text-blue-400 text-sm">{{ $t("action.a3") }}
            </a>
          </div>

          <div class="flex justify-center mt-8">
            <button :disabled="isBtnDisabled" @click="sendWaiver" :class="isBtnDisabled ? 'bg-t_error' : 'bg-t_primary'"
              class="p-5 mb-5 w-72 py-4 font-bold text-white rounded">
              {{ $t("send") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";

export default {
  middleware: "auth",
  data: () => ({
    step: 1,
    amount: null,
    isAffirmed: false,
    inc: 0,
    isBtnDisabled: true,
    page: "",
    contract: null,
    act: null,
    link: null
  }),
  async mounted() {
    const contract = await this.$axios.get(
      `/contract/by/${this.$route.query.id}`
    );
    this.socket = this.$nuxtSocket({
      name: "home", // Use socket "home"
      channel: "/", // connect to '/index',
      secure: true,
    });
    this.contract = contract.data.data;
    this.updateLink();
  },
  watch: {
    time(newTime) {
      this.updateLink(); // Sana o'zgarganida linkni yangilash
    },
  },
  methods: {
    updateLink() {
      this.link = `https://pdf.zerox.uz/act.php?debitor=${this.contract.duid}&creditor=${this.contract.cuid}&act_type=4&vos_summa=${this.contract.residual_amount}&uid=${this.contract.uid}&lang=${this.$i18n.locale}`;
    },
    async getSockNot() {
      this.socket.emit(
        "notification",
        { userId: this.$auth.user.id },
        (data) => { }
      );
      this.socket.emit(
        "me",
        { userId: this.$auth.user.id },
        (data) => { }
      );
    },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    handleClick(command) {
      console.log(command);
      this.page = command;
      console.log(this.page);
      this.step = this.step + 1;
    },

    validate() {
      if (!this.isAffirmed) {
        this.isBtnDisabled = true;
      }

      return (this.isBtnDisabled = false);
    },

    async sendWaiver() {
      const dds = await this.$axios.get(
        `/contract/by/${this.$route.query.id}`
      );
      this.dx = dds.data.data;
      const data = {
        contract: this.contract.id,
        refundable_amount: 0,
        residual_amount: this.dx.residual_amount,
        old_amount: this.contract.residual_amount,
        vos_summa: this.dx.residual_amount,
        inc: this.dx.inc,
        end_date: this.contract.end_date.slice(0, 10),
        debitor: this.contract.debitor,
        creditor: this.contract.creditor,
        sender: this.contract.debitor,
        res: this.contract.debitor,
        reciver: this.contract.creditor,
      };
      // return console.log(data)
      try {
        const response = await this.$axios.post(`/contract/vos-kechish`, data);
        if (response.status == 200 && response.data.msg == "ex") {
          this.$toast.error(
            $nuxt.$t('a1.a70')
          );
        }
        if (response.status == 201) {
          this.socket.emit(
            "notification",
            { userId: this.$auth.user.id },
            (data) => { }
          );
          this.$toast.success($nuxt.$t('a1.a71'));
          this.$router.go(-1);
        }
      } catch (e) { this.$toast.error($nuxt.$t('a1.a42')); }
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
