<template>
  <div class="bg-white px-4 py-4" style="border-radius: 10px">
    <div @click="$backWithLocale()" class="my-2 mx-6 hidden lg:inline-flex items-center" style="cursor:pointer">
      <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      <p class="text-blue-500">{{ $t('back') }}</p>
    </div>
    <div class="m-0 mx-auto max-w-2xl mt-8" v-if="contract != null">
      <h1 class="text-center font-extrabold text-xl mb-5">
        {{ $t("a1.a97") }}
      </h1>
      <div class="shadow-lg px-5 py-10 pb-6 rounded-lg mb-5">
        <span v-if="$i18n.locale == 'uz'">
          <p>
            {{ dateFormat(contract.created_at) }} yildagi
            <b><nuxt-link class="text-blue-400"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
                  contract.number }}</nuxt-link></b>-sonli qarz shartnomasi bo‘yicha qarzni qaytarish muddatini
            uzaytirmoqdasiz.
          </p>
          <p>
            Qarzni qaytarishning hozirgi muddati -
            <b>{{ dateFormat(contract.end_date) }} yil.</b>
          </p>
        </span>

        <span v-if="$i18n.locale == 'kr'">
          <p>
            {{ dateFormat(contract.created_at) }} йилдаги
            <b><nuxt-link class="text-blue-400"
                :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
                  contract.number }}</nuxt-link></b>-сонли қарз шартномаси бўйича қарзни қайтариш муддатини
            узайтирмоқдасиз.
          </p>
          <p>
            Қарзни қайтаришнинг ҳозирги муддати -
            <b>{{ dateFormat(contract.end_date) }} йил.</b>
          </p>
        </span>

        <span v-if="$i18n.locale == 'ru'">
          <p>
            Вы продлеваете срок возврата долга по договору займа №<nuxt-link class="text-blue-400"
              :to="localePath({ name: 'pdf-generate', query: { id: contract.uid } })">{{
                contract.number }}</nuxt-link> от {{ dateFormat(contract.created_at) }} г.
          </p>
          <p>
            Текущий срок возврата суммы займа - <b>{{ dateFormat(contract.end_date) }} г.</b>
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
          class="ml-2 underline text-center text-blue-400 text-sm">{{ $t("action.a3") }}
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
    link: null
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
      name: "home", // Use socket "home"
      channel: "/", // connect to '/index',
      secure: true,
    });
    setTimeout(() => {
      let input = document.querySelector(".mx-input");
      if (!input) return;
      input.addEventListener("keydown", (e) => {
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
    this.updateLink();
  },
  computed: {
    isValidate() {
      return this.amount && this.currency && this.isAffirmed ? false : true;
    },
  },
  watch: {
    time(newTime) {
      this.updateLink(); // Sana o'zgarganida linkni yangilash
    },
  },
  methods: {

    updateLink() {
      this.link = `https://pdf.zerox.uz/act.php?debitor=${this.contract.duid}&creditor=${this.contract.cuid}&act_type=6&refundable_amount=${this.contract.refundable_amount}&residual_amount=${this.contract.residual_amount}&end_date=${this.time}&uid=${this.contract.uid}&lang=${this.$i18n.locale}`;
    },
    disabledDates(date) {
      const endDate = new Date(this.contract.end_date);
      const today = new Date();
      today.setHours(1, 0, 0, 0);
      endDate.setHours(1, 0, 0, 0);
      if (endDate < today) {
        if (date < today) {
          return true;
        } else {
          return false;
        }
      } else {
        if (date < endDate) {
          return true;
        } else {
          return false;
        }
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
          this.$toast.error($nuxt.$t('a1.a52'));
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
    // ss
    setExtendDate(e) {
      const selectedDate = e.target.value;
      const curDate = new Date(this.contract.end_date) - 1 + 86401;
      const configuredDate = new Date(selectedDate) - 1 + 86401;
      if (configuredDate > curDate) {
        this.time = selectedDate;
      } else {
        this.time = null;
      }

      this.validate();
    },

    async sendAct() {
      const mismatch = await this.$checkDateMismatch();
      if (mismatch) {
        return this.$toast.error($nuxt.$t('a1.a103'));
      }
      if (!this.time) {
        return this.$toast.error($nuxt.$t('a1.a52'));
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
        const response = await this.$axios.post("/contract/deb-uzay", newAct);
        if (response.status == 200 && response.data.msg == "ex") {
          this.$toast.error($nuxt.$t('a1.a70'));
        }
        if (response.status == 201) {
          this.socket.emit(
            "notification",
            { userId: this.$auth.user.id },
            () => { }
          );
          this.$toast.success($nuxt.$t('a1.a68'));
          this.$router.go(-1);
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
