<template>
  <div class="waiver bg-white px-4 py-4 w-full my-4" style="border-radius: 6px">
    <div
      @click="$router.go(-1)"
      class="my-2 mx-6 hidden lg:inline-flex items-center"
      style="cursor: pointer"
    >
      <svg
        class="h-5 w-5 text-blue-500"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      <p class="text-blue-500">{{ $t("back") }}</p>
    </div>
    

    <div v-if="contract != null">
      <div class="flex justify-center items-center">
        <div style="width: 40.6rem" class="mt-12">
          <h2 class="font-bold text-xl text-center">
            {{ $t("action.a1") }}
          </h2>

          <div class="debt_notification pt-6 pb-12 px-6 mt-4">
            <b>{{ dateFormat(contract.created_at) }}</b> yildagi

            <nuxt-link
              class="text-blue-400"
              :to="{ path: '/pdf-generate', query: { id: contract.id } }"
              ><b>{{ contract.number }}</b></nuxt-link
            >-sonli qarz shartnomasi bo‘yicha Siz fuqaro
            <b>{{ contract.creditor_name }}</b
            >dan qarzni qaytarishini talab qilmoqdasiz.
          </div>

          <div class="flex justify-center mt-8">
            <button
              @click="sendDemand"
              class="
                p-5
                mb-5
                bg-t_primary
                w-72
                py-4
                font-bold
                text-white
                rounded
              "
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
import dateformat from "dateformat";
export default {
  middleware: "auth",
  data: () => ({
    amount: null,
    act: null,
    contract: null,
    isBtnDisabled: true,
    isAffirmed: false,
    debitor_signature: null,
  }),
  async mounted() {
    const contract = await this.$axios.get(
      `/contract/by/${this.$route.query.id}`
    );
    // this.act = contract.data;
    this.contract = contract.data.data;
    console.log("contract", this.contract);
  },
  methods: {
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
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
        reciver: this.contract.creditor,
        act: this.contract.act,
      };

      // return console.log(data);
      try {
        const response = await this.$axios.post("/contract/talab", data);
        console.log(response);
        if (response.status == 200 && response.data.msg == "ex") {
          this.$toast.error("Ushbu shartnoma bo‘yicha talabnoma yuborilgan.");
        }
        if (response.status == 201) {
          this.$toast.success("Talabnoma yuborildi");
          this.$router.go(-1);
        }
      } catch (e) {
        this.$toast.error("Xatolik yuz berdi");
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
