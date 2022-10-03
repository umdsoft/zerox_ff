<template>
  <div class="flex items-center flex-col bg-white py-4 pb-8 rounded">
    <div class="flex w-full justify-start">
      <div
        @click="step == 0 ? $router.go(-1) : step--"
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
    </div>

    <div v-if="step == 0 && user != null">
      <h1 class="text-2xl text-center">{{ $t("process.take") }}</h1>

      <div class="user">
        <div class="flex items-center mt-6 oluvchi">
          <img class="user__avatar" src="@/assets/img/no-avatar.png" />

          <div class="user_text ml-6">
            <h5 class="text-center title">{{ $t("process.creditor") }} :</h5>
            <h5 class="text-sm">
              {{ $auth.user.first_name }} {{ $auth.user.last_name }}
              {{ $auth.user.middle_name }}
            </h5>
          </div>
        </div>
        <div class="flex items-center mt-6 beruvchi">
          <img class="user__avatar" src="@/assets/img/no-avatar.png" />

          <div class="user__text ml-6">
            <h5 class="text-center title">{{ $t("process.debitor") }} :</h5>
            <h5 class="text-sm">
              {{ user.first_name }} {{ user.last_name }}
              {{ user.middle_name }}
            </h5>
          </div>
        </div>

        <div class="mt-12">
          <div class="flex mb-4">
            <div class="w-6/12 flex items-center">
              <input
                type="radio"
                id="UZS"
                class="w-5 h-5 mr-2"
                v-model="currency"
                name="drone"
                @change="setRadioChange"
                value="UZS"
                checked
              />
              <label for="UZS" class="flex items-center"
                ><img class="w-5 h-4" src="@/assets/img/uz.png" alt="" />
                {{ $t("process.uzs") }}</label
              >
            </div>
            <div class="w-6/12 flex items-center">
              <input
                type="radio"
                id="USD"
                class="w-5 h-5 mr-2"
                v-model="currency"
                @change="setRadioChange"
                name="drone"
                value="USD"
              />
              <label for="USD" class="flex items-center"
                ><img class="w-5 h-4" src="@/assets/img/usa.png" alt="" />
                {{ $t("process.usd") }}</label
              >
            </div>
          </div>

          <input
            v-format="amount"
            :value="amount"
            ref="input"
            @input="setAmount"
            @keyup="changeAmount($event)"
            placeholder="Summani kiriting"
            class="input"
          />
          <input
            type="date"
            @change="setEndDate"
            :value="end_date"
            :placeholder="$t('process.end_date')"
            class="input bg-white text-gray rounded"
          />

          <div class="flex items-center justify-center mt-6">
            <input
              @change="validate"
              class="w-4 h-4 mr-2"
              v-model="isAffirmed"
              type="checkbox"
              id="1"
            />
            <label for="1"
              ><button @click="() => (step = 1)" class="text-t_primary">
                {{ $t("process.err2") }}
              </button>
            </label>
          </div>
          <h2
            v-if="$auth.user.balance < 1000"
            class="text-red-500 text-center mt-4"
          >
            {{ $t("process.err1") }}
          </h2>
          <br />
          <h5 v-if="isAffirmed && line != 0"  class="text-center">Bepul shartnomalar soni - {{line}} ta.</h5>
          <h5 v-if="isAffirmed && line == 0" class="text-center" style="max-width: 400px">
            Xizmat haqi sifatida hisobingizdan
            <span class="text-red-500"
              >{{
                feePercentage &&
                feePercentage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              }}
              so‘m</span
            >
            <span v-if="d == false"
              >(100 000 000 so’mdan kam holatlarda qarz summasining 0.1 foizi
              )</span
            >
            yechiladi.
          </h5>
          <button
            @click="affirmContract"
            :disabled="isBtnDisabled"
            :class="isBtnDisabled ? 'bg-t_error' : 'bg-t_primary'"
            class="
              text-white
              mt-6
              text-center
              font-bold
              w-full
              py-3
              px-8
              rounded
            "
          >
            {{ $t("process.accept") }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="step == 1" class="mt-4">
      <contract-give
        :contract="{ amount, currency, end_date, type: 'creditor' }"
      />
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
  middleware: "auth",
  data: () => ({
    lang: "ru",
    amount: "",
    feePercentage: 0,
    usd: 10922.03,
    step: 0,
    line: 10,
    currency: "UZS",
    end_date: null,
    isBtnDisabled: true,
    isAffirmed: false,
    user: null,
    d: false,
  }),
  async created() {
    if (!this.$route.query.id) {
      return this.$router.go(-1);
    }

    this.line = this.$auth.user.cnt

    const user = await this.$axios.$get(
      `/user/candidate/${this.$route.query.id}`
    );
    this.user = user.data;
    this.$auth.user2 = this.user.data;
    console.log("user", this.user);
  },
  // beforeCreate() {
  //   if (!this.$auth.user2 || this.$auth.user.id === this.$auth.user2.id) {
  //     return this.$router.go(-1);
  //   }
  //   let links = [{ title: "Pul berish", name: "-give" }];
  //   this.$store.commit("changeBreadCrumb", links);
  // },
  computed: {
    isValidate() {
      return this.amount && this.currency && this.isAffirmed ? false : true;
    },
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
    validate() {
      if (
        this.amount &&
        this.currency &&
        this.isAffirmed &&
        this.$auth.user.balance > 900
      ) {
        this.isBtnDisabled = false;
      } else {
        this.isBtnDisabled = true;
      }
    },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },

    setRadioChange() {
      this.setAmount();
    },

    setAmount(e) {
      const amount = e
        ? Number([...e.target.value].filter((c) => c !== " ").join(""))
        : this.amount;
      const reg = /^\d+$/;
      if (reg.test(amount)) {
        this.amount = amount;
        this.$refs.input.value = amount;
        if (this.currency === "USD") {
          const dd = amount * this.usd >= 100000000;
          if (dd) {
            this.feePercentage = 100000;
            this.d = true;
          } else {
            this.feePercentage = (amount * this.usd * 0.001).toFixed(0);
          }
        } else {
          if (amount >= 100000000) {
            this.feePercentage = 100000;
            this.d = true;
          } else {
            this.feePercentage = amount * 0.001;
          }
        }
      } else {
        if (this.amount.length > 0) {
          this.$refs.input.value = this.amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
      }

      this.validate();
    },
    setEndDate(e) {
      const selectedDate = e.target.value;
      console.log(selectedDate);
      const configuredDate = new Date(selectedDate) - 1 + 86401;
      if (configuredDate > Date.now()) {
        this.end_date = selectedDate;
      } else {
        this.end_date = null;
      }

      this.validate();
    },

    async affirmContract() {
      if (!this.end_date) {
        return this.$toast.error("Sanani tog‘ri kiriting");
      }
      const data = {
        debitor: this.user.id,
        creditor: this.$auth.user.id,
        reciver: this.user.id,
        amount: Number(this.amount),
        currency: this.currency,
        end_date: this.end_date,
        con: 1,
        type: this.$auth.user.type == 1 && this.user.type == 1 ? 1 : 0,
      };
      try {
        console.log(data);
        const response = await this.$axios.post("/contract/create", data);
        if (response.status) {
          this.$toast.success("Shartnoma  yaratildi");
          this.$router.push("/");
        }
      } catch (e) {
        this.$toast.error("Xatolik yuz berdi !");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.qr-code {
  width: 150px;
  position: relative;
}

.qr-code-image {
  position: absolute;
  background-color: rgb(252, 249, 249);
  border-radius: 0.25rem;
  z-index: 50000;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
.pdf {
  width: 250px;
  height: 250px;
  box-shadow: 0px 4px 10px 3px rgba(0, 0, 0, 0.11);
  border-radius: 67px;
  background: #ffffff;
}

.container {
  width: 8.5in;
  min-height: 11in;
  padding: 2rem 3rem;
  margin: 0 auto;
  margin-top: 2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
}

.flex {
  display: flex;
  align-items: center;
}
.content-title {
  text-align: center;
}
.qarz {
  margin: 20px 0;
}
.qarz .content-title {
  margin-bottom: 20px;
}
.qarz span {
  color: black;
  font-weight: 600;
}
.content-body p {
  font-size: 14px;
  text-align: justify;
  word-break: break-word;
  text-indent: 50px;
}
.qarz ul li p {
  font-size: 14px;
}
.rekvizit {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.rek-title {
  margin-bottom: 10px;
  text-align: center;
}
.rek-body {
  margin-bottom: 10px;
}
.rek-title h2:last-child {
  color: black;
  font-weight: 600;
}

.oluvchi {
  .title {
    color: #fe5e58;
  }
}
.beruvchi {
  .title {
    color: #48bb78;
  }
}

.user__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.user {
  padding: 0 2rem;
  max-width: 500px;
}

.input,
select {
  border: 1px solid #8692a6;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 5px 0;
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
