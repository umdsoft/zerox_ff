<template>
  <div class="flex items-center flex-col bg-white py-4 pb-8 rounded font-bold">
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
      <h1 class="text-2xl text-center">{{ $t("home.give") }}</h1>

      <div class="user">
        <div class="flex items-center mt-6 oluvchi">
          <img class="user__avatar" src="@/assets/img/no-avatar.png" />

          <div class="user_text ml-6">
            <h5 class="text-center title">{{ $t("list.creditor") }} :</h5>
            <h5 class="text-sm">
              {{ user.first_name }} {{ user.last_name }}
              {{ user.middle_name }}
            </h5>
          </div>
        </div>
        <div class="flex items-center mt-6 beruvchi">
          <img class="user__avatar" src="@/assets/img/no-avatar.png" />

          <div class="user__text ml-6">
            <h5 class="text-center title">{{ $t("list.debitor") }} :</h5>
            <h5 class="text-sm">
              {{ $auth.user.first_name }} {{ $auth.user.last_name }}
              {{ $auth.user.middle_name }}
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
                name="drone"
                value="USD"
              />
              <label for="USD" class="flex items-center"
                ><img class="w-5 h-4" src="@/assets/img/usa.png" alt="" />
                {{ $t("process.usd") }}</label
              >
            </div>
          </div>
          <!--  -->
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
            placeholder="Qarz muddati"
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

          <button
            @click="affirmContract"
            :disabled="isValidate"
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
        :contract="{ amount, currency, end_date, type: 'debitor' }"
      />
    </div>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  data: () => ({
    step: 0,
    amount: "",
    currency: "UZS",
    isAffirmed: false,
    isBtnDisabled: true,
    end_date: "",
    user: null,
  }),
  async created() {
    if (!this.$route.query.id) {
      return this.$router.go(-1);
    }

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
      if (this.amount && this.currency && this.isAffirmed) {
        this.isBtnDisabled = false;
      } else {
        this.isBtnDisabled = true;
      }
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

    setAmount(e) {
      const amount = [...e.target.value].filter((c) => c !== " ").join("");
      const reg = /^\d+$/;
      if (reg.test(amount)) {
        this.amount = amount;
        this.$refs.input.value = amount;
      } else {
        if (amount.length > 0) {
          this.$refs.input.value = this.amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
      }

      this.validate();
    },

    async affirmContract() {
      if (this.$auth.user.balance < 1000) {
        return this.$toast.error("Hisobingizda mablag‘ yetarli emas");
      }

      if (!this.end_date) {
        return this.$toast.error("Sanani tog‘ri kiriting");
      }
      const contract = {
        debitor: this.$auth.user.id,
        creditor: this.user.id,
        amount: Number(this.amount),
        currency: this.currency,
        end_date: this.end_date,
        reciver: this.user.id,
        type: this.$auth.user.type == 1 && this.user.type == 1 ? 1 : 0,
      };
      // return console.log(contract);

      if (this.end_date && this.$auth.user.balance >= 1000) {
        try {
          const response = await this.$axios.post("/contract/create", contract);
          if (response.status) {
            this.$toast.success("Shartnoma  yaratildi");
            this.$router.push("/");
          }
        } catch (e) {
          this.$toast.error("Xatolik yuz berdi !");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.date {
  outline: none;
  margin: 5px 0;
  border: none;
}
.date:focus {
  outline: none;
  border: none;
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

.input {
  border: 1px solid #8692a6;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 5px auto;
  height: 50px;
  text-indent: 10px;
  border-radius: 5px;
  transition: all 0.2s ease;
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
input:focus {
  outline: none;
  box-shadow: 0px 4px 10px 3px rgba(0, 0, 0, 0.11);
  border: 1px solid #1565d8;
}
</style>
