<template>
  <div class="bg-white px-4 py-4" style="border-radius: 10px">
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
    <div class="m-0 mx-auto max-w-2xl mt-8" v-if="contract != null">
      <h1 class="text-center font-extrabold text-xl mb-5">
        {{ $t("action.a4") }}
      </h1>
      <div class="shadow-lg px-5 py-10 pb-6 rounded-lg mb-5">
        <p>
          <b> {{ dateFormat(contract.created_at) }}</b> yildagi
          <nuxt-link
            class="text-blue-400"
            :to="{ path: '/pdf-generate', query: { id: contract.id } }"
            >{{ contract.number }}</nuxt-link
          >
          -sonli qarz shartnomasi muddatini uzaytirmoqdasiz.
        </p>
        <p>
          Qarzni qaytarishning hozirgi muddati -
          <b>{{ dateFormat(contract.end_date) }}</b> yil.
        </p>
      </div>

      <div class="form-date-picker">
        <date-picker
          v-model="time"
          value-type="YYYY-MM-DD"
          format="DD.MM.YYYY"
          placeholder="Yangi muddatni kiriting"
          :disabled-date="disabledDates"
        ></date-picker>
      </div>

      <div class="mt-10 flex justify-center items-center">
        <input
          @change="validate"
          v-model="isAffirmed"
          class="w-5 h-5"
          type="checkbox"
          name=""
          id="ok"
        />
        <label
          style="cursor: pointer"
          @click="
            $store.commit('SHOW_ACT_MODAL', {
              contract,
              act,
              time,
              type: 'debt-extend',
            })
          "
          class="ml-2 underline text-center text-blue-400 text-sm"
          >{{ $t("action.a3") }}
        </label>
      </div>
      <div class="flex justify-center">
        <button
          :disabled="isBtnDisabled"
          @click="sendAct"
          :class="isBtnDisabled ? 'bg-t_error' : 'bg-t_primary'"
          class="p-4 w-2/5 my-10 mx-auto rounded-md text-white"
        >
          {{ $t("send") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
  middleware: "auth",
  components: {},
  data: () => ({
    contract: null,
    time: null,
    date: null,
    isAffirmed: false,
    isBtnDisabled: true,
    act: null,
  }),
  async mounted() {
    // if(!this.$route.query.contract._id) {
    //     return this.$router.go(-1)
    // }
    // this.contract = this.$route.query.contract
    const contract = await this.$axios.get(
      `/contract/by/${this.$route.query.id}`
    );
    this.contract = contract.data.data;

    setTimeout(() => {
      function keydownInput(e) {}
      let input = document.querySelector(".mx-input");
      input.addEventListener("keydown", (e) => {
        console.log("code", e);
        let key = parseInt(e.key);

        if (
          e.which == 8 &&
          e.target.value.charAt(e.target.value.length - 1) == "."
        ) {
          e.target.value = e.target.value.slice(0, e.target.value.length - 2);
          e.preventDefault();
        }
        if (
          !(
            (Number.isInteger(key) && e.target.value.length < 10) ||
            e.which == 8
          )
        ) {
          e.preventDefault();
        }
      });

      input.addEventListener("keyup", (e) => {
        let value = e.target.value.replace(/[^0-9]/g, "");

        let length = value.length;

        if (length >= 8) {
          e.target.value = `${value.slice(0, 2)}.${value.slice(
            2,
            4
          )}.${value.slice(4, 8)}`;
          return true;
        }
        if (length >= 4) {
          e.target.value = `${value.slice(0, 2)}.${value.slice(
            2,
            4
          )}.${value.slice(4, length)}`;
          return true;
        }
        if (length >= 2) {
          e.target.value = `${value.slice(0, 2)}.${value.slice(2, length)}`;
          return true;
        }
      });
    }, 500);
  },
  computed: {
    isValidate() {
      return this.amount && this.currency && this.isAffirmed ? false : true;
    },
  },
  methods: {
    disabledDates(date) {
      const endDate = new Date(this.contract.end_date);

      endDate.setHours(1, 0, 0, 0);

      if (date < today || date > endDate) {
        return true;
      } else {
        return false;
      }
    },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    validateDate(e) {
      if (e.target.value.length === 10) {
        const arr = e.target.value.split(".");
        if (!this.isValidDate(arr[2], arr[1], arr[0])) {
          this.$toast.error("Sanani tog‘ri kiriting");
          this.date = "";
          this.time = "";
        } else {
          this.time = this.date;
        }
        this.validate();
      }
    },

    isValidDate(year, month, day) {
      --month;
      var d = new Date(year, month, day);

      if (
        d.getFullYear() == year &&
        d.getMonth() == month &&
        d.getDate() == day
      ) {
        return true;
      }
      return false;
    },

    validate() {
      if (this.isAffirmed) {
        this.isBtnDisabled = false;
      } else {
        this.isBtnDisabled = true;
      }
    },

    setExtendDate(e) {
      const selectedDate = e.target.value;
      const configuredDate = new Date(selectedDate) - 1 + 86401;
      const curDate = new Date(this.contract.end_date) - 1 + 86401;
      if (configuredDate > curDate) {
        this.time = selectedDate;
      } else {
        this.time = null;
      }

      this.validate();
    },

    async sendAct() {
      if (!this.time) {
        return this.$toast.error("Sanani tog‘ri kiriting");
      }
      const newAct = {
        end_date: this.time,
        contract: this.contract.id,
        debitor: this.contract.debitor,
        creditor: this.contract.creditor,
        reciver: this.contract.creditor,
        refundable_amount: this.contract.refundable_amount,
        residual_amount: this.contract.residual_amount,
        inc: this.contract.inc,
      };
      try {
        const response = await this.$axios.post("/contract/deb-uzay", newAct);
        if (response.status == 200 && response.data.msg == "ex") {
          this.$toast.error("Ushbu shartnoma bo‘yicha talabnoma yuborilgan.");
        }
        if (response.status == 201) {
          this.$toast.success("Qarz muddati uzaytirildi");
          this.$router.go(-1);
        }
      } catch (e) {
        console.log(e);
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
