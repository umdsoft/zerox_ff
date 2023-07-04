<template>
  <div class="waiver bg-white px-4 py-4 w-full my-4" style="border-radius: 6px">
    <div
      @click="step === 1 ? $router.go(-1) : step--"
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
    <div v-if="step == 1">
      <div class="flex justify-center items-center">
        <div style="width: 26.6rem">
          <h2 class="font-bold text-xl text-center">
            {{ $t("list.return") }}
          </h2>
          <button
            @click="handleClick('full-refund')"
            class="rounded-lg justify-center w-full py-4 px-6 flex items-center bg-t_primary text-white mt-6 text-sm"
          >
            <img class="mr-2 w-5" src="@/assets/img/Group.png" alt="" />
            {{ $t("list.fullReturn") }}
          </button>
          <button
            @click="handleClick('partial-refund')"
            class="rounded-lg justify-center w-full py-4 px-6 flex items-center bg-t_primary text-white mt-6 text-sm"
          >
            <img class="mr-2 w-5" src="@/assets/img/Vector.png" alt="" />
            {{ $t("list.ozReturn") }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="step == 2">
      <div class="flex justify-center items-center">
        <div style="width: 40.6rem" class="mt-12">
          <h2
            v-if="page == 'partial-refund'"
            class="font-bold text-xl text-center"
          >
            {{ $t("list.ozReturn") }}
          </h2>
          <h2 v-else class="font-bold text-xl text-center">
            {{ $t("list.fullReturn") }}
          </h2>
          <div
            v-if="page == 'partial-refund'"
            class="debt_notification pt-6 pb-12 px-6 mt-4"
          >
            <b>{{ dateFormat(contract.created_at) }}</b> yildagi
            <b
              ><nuxt-link
                :to="{ path: '/pdf-generate', query: { id: contract._id } }"
                >{{ contract.number }}-</nuxt-link
              ></b
            >sonli qarz shartnomasi bo‘yicha Siz fuqaro
            <b>{{ contract.debitor_name }}</b
            >ga qarzni qisman qaytarmoqdasiz.
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
          </div>
          <div v-else class="debt_notification pt-6 pb-12 px-6 mt-4">
            <b>{{ dateFormat(contract.created_at) }}</b> yildagi
            <b
              ><nuxt-link
                class="text-blue-400"
                :to="{ path: '/pdf-generate', query: { id: contract.id } }"
                >{{ contract.number }}</nuxt-link
              ></b
            >-sonli qarz shartnomasi bo‘yicha Siz fuqaro
            <b>{{ contract.debitor_name }}</b
            >ga qarzni to‘liq qaytarmoqdasiz.
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
          </div>

          <div v-if="page == 'partial-refund'" class="flex justify-center mt-8">
            <input
              ref="input"
              :value="amount"
              v-format="amount"
              @input="setAmount"
              @keyup="changeAmount($event)"
              type="text"
              placeholder="Summani kiriting"
              class="input"
            />
          </div>

          <div
            v-if="page == 'partial-refund' && amount?.length"
            class="flex items-center justify-center mt-8 ml-2"
          >
            <input @change="validate" v-model="isAffirmed" type="checkbox" />
            <p
              @click="
                $store.commit('SHOW_ACT_MODAL', {
                  contract: { ...contract, refundable_amount: amount },
                  act,
                  type: 'debt-refund-partial',
                })
              "
              style="cursor: pointer"
              class="text-blue-400 text-center underline ml-4"
            >
              {{ $t("action.a3") }}
            </p>
          </div>

          <template v-else>
            <div class="flex items-center justify-center mt-8 ml-2">
              <input @change="validate" v-model="isAffirmed" type="checkbox" />
              <p
                @click="
                  $store.commit('SHOW_ACT_MODAL', {
                    contract: contract,
                    act,
                    type: 'debt-refund',
                  })
                "
                style="cursor: pointer"
                class="text-blue-400 text-center underline ml-4"
              >
                {{ $t("action.a3") }}
              </p>
            </div>
          </template>

          <div
            v-if="page == 'full-refund' || contract.residual_amount == amount"
            class="flex justify-center mt-8"
          >
            <button
              :disabled="isBtnDisabled"
              @click="sendRefundFull"
              :class="isBtnDisabled ? 'bg-t_error' : 'bg-t_primary'"
              class="p-5 mb-5 bg-t_primary w-72 py-4 font-bold text-white rounded"
            >
              {{ $t("send") }}
            </button>
          </div>
          <div v-else class="flex justify-center mt-8">
            <button
              :disabled="isBtnDisabled"
              @click="sendRefundPartially"
              :class="isBtnDisabled ? 'bg-t_error' : 'bg-t_primary'"
              class="p-5 mb-5 bg-t_primary w-72 py-4 font-bold text-white rounded"
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
  }),
  async mounted() {
    try {
      const contract = await this.$axios.get(
        `/contract/by/${this.$route.query.contract}`
      );

      this.contract = contract.data.data;
    } catch (e) {
      console.log(e);
    }

    console.log(this.contract);
  },
  methods: {
    changeAmount(e) {
      let firstValue = e.target.value.split("")[0];
      console.log("va", firstValue);
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
            "Ushbu qarz shartnomasi bo‘yicha so‘rov yuborilgan. Iltimos, kuting!"
          );
        }
        if (response.status == 200 && response.data.message == "not-est") {
          this.$toast.error(
            "Ushbu qarz shartnomasi bo‘yicha so‘rov yuborilgan. Iltimos, kuting!"
          );
        }
        if (response.status == 201) {
          this.$toast.success(
            "Qarzni to‘liq qaytarish bo‘yicha so‘rov jo‘natildi"
          );
          this.$router.go(-1);
        }
      } catch (e) {
        console.log(e);
        return this.$toast.error("Xatolik");
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
        reciver: this.contract.debitor,
        end_date: this.contract.end_date.slice(0, 10),
        contract: this.contract.id,
        sender: this.contract.creditor,
        res: this.contract.debitor,
        status: 0,
        ntype: 1,
        type: 1,
      };
      // return console.log('qisman',data)
      try {
        const response = await this.$axios.post(`/contract/act`, data);

        console.log(response);
        if (response.status == 200 && response.data.msg == "ex") {
          this.$toast.error(
            "Qarzni qaytarish bo‘yicha so‘rov oldin jo‘natilgan."
          );
        }
        if (response.status == 201) {
          this.$toast.success(
            "Qarzni qisman qaytarish bo‘yicha so‘rov jo‘natildi"
          );
          this.$router.go(-1);
        }
      } catch (e) {
        //  console.log('e',e.msg)
        this.$toast.error("Xatolik yuz berdi");
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
