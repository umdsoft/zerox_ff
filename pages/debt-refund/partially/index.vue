<template>
  <div class="waiver bg-white px-4 py-4 w-full my-4" style="border-radius: 6px">
    <div @click="step === 1 ? $router.go(-1) : step--" class="my-2 mx-6 hidden lg:inline-flex items-center"
      style="cursor: pointer">
      <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      <p class="text-blue-500">{{ $t("back") }}</p>
    </div>

    <div v-if="contract != null">
      <div class="flex justify-center items-center">
        <div style="width: 40.6rem" class="mt-12">
          <h2 class="font-bold text-xl text-center">
            {{ $t("list.ozReturn") }}
          </h2>

          <div class="debt_notification pt-6 pb-12 px-6 mt-4">
            <span v-if="$i18n.locale == 'uz'">
              {{ dateFormat(contract.created_at) }} yildagi
              <b><nuxt-link class="text-blue-400"
                  :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
      contract.number }}-</nuxt-link></b>sonli qarz shartnomasi bo‘yicha Siz fuqaro
              <b>{{ contract.debitor_name }}</b>ga qarzni qisman qaytarmoqdasiz.
              <div class="mt-8">
                Sizning umumiy qarzingiz -
                <b>
                  {{
      contract.residual_amount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }}
                  {{ contract.currency }}
                </b>
              </div>
            </span>

            <span v-if="$i18n.locale == 'kr'">
              {{ dateFormat(contract.created_at) }} йилдаги
              <b><nuxt-link class="text-blue-400"
                  :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
      contract.number }}-</nuxt-link></b>сонли қарз шартномаси бўйича Сиз фуқаро
              <b>{{ contract.debitor_name }}</b>га қарзни қисман қайтармоқдасиз.
              <div class="mt-8">
                Сизнинг умумий қарзингиз -
                <b>
                  {{
      contract.residual_amount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }}
                  {{ contract.currency }}.
                </b>
              </div>
            </span>

            <span v-if="$i18n.locale == 'ru'">

              По договору займа №<b><nuxt-link class="text-blue-400"
                  :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
      contract.number }}</nuxt-link></b> от {{ dateFormat(contract.created_at) }} г. Вы частично
              возвращаете долг Займодавцу ({{ contract.debitor_name }}).
              <div class="mt-8"> Ваш общий долг - <b>
                  {{
      contract.residual_amount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }}
                  {{ contract.currency }}</b>.</div>
            </span>
          </div>

          <div class="flex justify-center mt-8">
            <input ref="input" :value="amount" v-format="amount" @input="setAmount" @keyup="changeAmount($event)"
              type="text" :placeholder="$t('placeholder.summo')" class="input" />
          </div>

          <div class="mt-10 flex justify-center items-center">
            <input @change="validate" v-model="isAffirmed" class="w-5 h-5" type="checkbox" name="" id="ok" />
            <a :href="link" target="_blank" style="cursor: pointer"
              class="ml-2 underline text-center text-blue-400 text-sm">{{ $t("action.a3") }}
            </a>
          </div>
          <div class="flex justify-center mt-8">

            <button :disabled="isBtnDisabled" @click="sendRefundPartially"
              :class="isBtnDisabled ? 'bg-t_error' : 'bg-t_primary'"
              class="p-5 mb-5 bg-t_primary w-72 py-4 font-bold text-white rounded">
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
    page: "",
    amount: "",
    isAffirmed: false,
    mask: "### ### ### ### ### ### ###",
    isBtnDisabled: true,
    inc: 0,
    contract: null,
    act: null,
    dx: null,
    debitor_format_name: null,
    ll: null
  }),

  async mounted() {
    try {
      const contract = await this.$axios.get(
        `/contract/by/${this.$route.query.contract}`
      );
      this.socket = this.$nuxtSocket({
        name: "home", // Use socket "home"
        channel: "/", // connect to '/index',
        secure: true,
      });
      this.contract = contract.data.data;
      this.debitor_format_name = this.$latinToCyrillic(this.contract.debitor_formatted_name)
      this.ll = this.contract.dgender == 1 ? "У" : "ОЙ"
      this.updateLink();
    } catch (e) {
      console.log(e);
    }

  },
  watch: {
    amount(newTime) {
      this.updateLink(); // Sana o'zgarganida linkni yangilash
    },
  },
  methods: {
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
    changeAmount(e) {
      let firstValue = e.target.value.split("")[0];
      if (firstValue == 0) {
        e.target.value = e.target.value.slice(1, e.target.value.length);
      }
      // else{
      //   e.preventDefault()
      // }
    },
    handleClick(command) {
      this.page = command;
      if (this.page == "partial-refund") {
        this.amount = null;
      }
      if (this.page == "full-refund") {
        this.amount = this.contract.refundable_amount;
      }
      this.step = this.step + 1;
    },

    validate() {
      if (this.isAffirmed && this.page == "full-refund") {
        this.isBtnDisabled = false;
      } else if (this.isAffirmed && this.amount) {
        this.isBtnDisabled = false;
      } else {
        this.isBtnDisabled = true;
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
        }
      }
      this.$store.commit("changePartialAmount", this.amount);
    },
    updateLink() {
      // console.log(Number(this.amount))
      this.link = `https://pdf.zerox.uz/act.php?debitor=${this.contract.duid}&creditor=${this.contract.cuid}&act_type=${Number(this.contract.residual_amount) - Number(this.amount) == 0 ? 2 : 1}&amount=${this.contract.amount}&refundable_amount=${Number(this.amount)}&residual_amount=${this.contract.residual_amount}&end_date=${this.time}&uid=${this.contract.uid}&lang=${this.$i18n.locale}`;
    },
    async sendRefundFull() {
      const dds = await this.$axios.get(
        `/contract/by/${this.$route.query.contract}`
      );
      this.dx = dds.data.data;
      const data = {
        refundable_amount: this.dx.residual_amount,
        residual_amount: 0,
        inc: Number(this.dx.residual_amount + this.dx.inc),
        debitor: this.contract.debitor,
        creditor: this.contract.creditor,
        reciver: this.contract.debitor,
        end_date: this.contract.end_date.slice(0, 10),
        contract: this.contract.id,
        sender: this.contract.creditor,
        res: this.contract.debitor,
        status: 0,
        ntype: 2,
        type: 2,
      };
      // return console.log('to`liq',data)
      try {
        const response = await this.$axios.post(`/contract/act`, data);
        if (response.status == 200 && response.data.msg == "ex") {
          this.$toast.error(
            $nuxt.$t('a1.a65')
          );
        }
        if (response.status == 200 && response.data.message == "not-est") {
          this.$toast.error(
            $nuxt.$t('a1.a65')
          );
        }
        if (response.status == 201) {
          this.socket.emit(
            "notification",
            { userId: this.$auth.user.id },
            (data) => { }
          );
          this.$toast.success(
            $nuxt.$t('a1.a66')
          );
          this.$router.go(-1);
        }
      } catch (e) {
        console.log(e);
        return this.$toast.error($nuxt.$t('a1.a42'));
      }
    },

    async sendRefundPartially() {
      const dds = await this.$axios.get(
        `/contract/by/${this.$route.query.contract}`
      );
      this.dx = dds.data.data;
      const data = {
        refundable_amount: Number(this.amount),
        residual_amount: Number(this.dx.residual_amount) - Number(this.amount),
        inc: Number(this.amount) + Number(this.dx.inc),
        debitor: this.contract.debitor,
        creditor: this.contract.creditor,
        old_amount: this.contract.residual_amount,
        reciver: this.contract.debitor,
        end_date: this.contract.end_date.slice(0, 10),
        contract: this.contract.id,
        sender: this.contract.creditor,
        res: this.contract.debitor,
        status: 0,
        ntype: 1,
        type: Number(this.dx.residual_amount) - Number(this.amount) == 0 ? 2 : 1,
      };
      // return console.log('qisman',data)
      try {
        const response = await this.$axios.post(`/contract/act`, data);

        console.log(response);
        if (response.status == 200 && response.data.msg == "ex") {
          this.$toast.error($nuxt.$t('a1.a65')
          );
        }
        if (response.status == 201) {
          this.socket.emit(
            "notification",
            { userId: this.$auth.user.id },
            (data) => { }
          );
          this.$toast.success(
            $nuxt.$t('a1.a64')
          );
          this.$router.go(-1);
        }
      } catch (e) {
        //  console.log('e',e.msg)
        this.$toast.error($nuxt.$t('a1.a42'));
      }
    },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
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
