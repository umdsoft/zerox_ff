<template>
  <div class="waiver bg-white px-4 py-4 w-full my-4" style="border-radius: 6px">
    <BackButton />
    <div v-if="contract != null">
      <div class="flex justify-center items-center">
        <div style="width: 40.6rem" class="mt-12">
          <h2 class="font-bold text-xl text-center">
            {{ $t("a1.a98") }}
          </h2>

          <div class="debt_notification pt-6 pb-12 px-6 mt-4">
            <span v-if="$i18n.locale == 'uz'">
              {{ $formatDate(contract.created_at) }} yildagi

              <nuxt-link class="text-blue-400"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })"><b>{{
                  contract.number }}</b></nuxt-link>-sonli qarz shartnomasi bo‘yicha Siz fuqaro
              <b>{{ contract.creditor_name }}</b>dan qarzni qaytarishini talab qilmoqdasiz.
            </span>

            <span v-if="$i18n.locale == 'kr'">
              {{ $formatDate(contract.created_at) }} йилдаги
              <nuxt-link class="text-blue-400"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })"><b>{{
                  contract.number }}</b></nuxt-link>-сонли қарз шартномаси бўйича Сиз фуқаро
              <b>{{ contract.creditor_name }}</b>дан қарзни қайтаришини талаб қилмоқдасиз.
            </span>

            <span v-if="$i18n.locale == 'ru'">
              По договору займа №<nuxt-link class="text-blue-400"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })"><b>{{
                  contract.number }}</b></nuxt-link> от {{ $formatDate(contract.created_at) }} г. Вы требуете
              возврата долга от <b>Заемщика ({{ contract.creditor_name }})</b>.
            </span>
          </div>

          <div class="flex justify-center mt-8">
            <button @click="sendDemand" class="
                p-5
                mb-5
                bg-t_primary
                w-72
                py-4
                font-bold
                text-white
                rounded
              ">
              {{ $t("send") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackButton from '@/components/BackButton.vue';

export default {
  components: { BackButton },
  data: () => ({
    amount: null,
    act: null,
    creditor_format_name: null,
    contract: null,
    isBtnDisabled: true,
    isAffirmed: false,
    debitor_signature: null,
    ll: null
  }),
  async mounted() {
    if (!this.$auth.loggedIn) {
      return this.$router.push(this.localePath({ name: "auth-login" }));
    }
    const contract = await this.$axios.get(
      `/contract/by/${this.$route.query.id}`
    );
    this.socket = this.$nuxtSocket({
      name: "home", // Use socket "home"
      channel: "/", // connect to '/index',
      secure: true,
    });
    //
    // this.act = contract.data;
    this.contract = contract.data.data;
    this.creditor_format_name = this.$latinToCyrillic(this.contract.creditor_formatted_name)
    this.ll = this.contract.cgender == 1 ? "У" : "ОЙ"
  },
  methods: {

    stepBack() {
      if (this.step == 1) {
        return (this.step = 1);
      }

      this.step = this.step - 1;
    },
    handleClick(command) {
      this.page = command;
      this.step = this.step + 1;
    },

    validate() {
      if (this.isAffirmed) {
        this.isBtnDisabled = false;
      } else {
        this.isBtnDisabled = true;
      }
    },

    async sendDemand() {
      const data = {
        contract: this.contract.id,
        debitor: this.contract.debitor,
        creditor: this.contract.creditor,
        residual_amount: this.contract.residual_amount,
        reciver: this.contract.creditor,
        act: this.contract.act,
      };

      // return console.log(data);
      try {
        const response = await this.$axios.post("/contract/talab", data);
        if (response.status == 200 && response.data.msg == "ex") {
          this.$toast.error(this.$t('a1.a70'));
        }
        if (response.status == 201) {
          this.$toast.success(this.$t('a1.a69'));
          this.socket.emit(
            "notification",
            { userId: this.$auth.user.id },
            (data) => { }
          );
          this.$backWithLocale();
        }
      } catch (e) {
        this.$toast.error(this.$t('a1.a42'));
      }
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
