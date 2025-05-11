<template>
  <div class="auth bg-white pt-4 px-4">
    <div v-if="step == 1">
      <div @click="routerGo()" class="my-2 mx-6 hidden lg:inline-flex items-center" style="cursor: pointer">
        <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="15 6 9 12 15 18" />
        </svg>
        <p class="text-blue-500"> {{ $t('back') }} </p>
      </div>
      <div class="flex justify-center items-center" style="margin-top: 5rem">
        <div style="width: 26.6rem">
          <h2 class="font-bold text-2xl">{{ $t('a1.a20') }}</h2>
          <hr class="hr_line my-5" />
          <p class="text-t_secondary mb-2">{{ $t('a1.a17') }}</p>

          <vue-tel-input style="
              padding: 0.5rem 0;
              border: 1px solid #1565d8;
              border-radius: 5px;
            " @input="removeSpace" v-mask="'+998 ## ### ## ##'" v-model="phone"></vue-tel-input>

          <button @click="stepGo" class="bg-t_primary hover:bg-blue-700 text-white mt-6 py-4 px-4 rounded w-full">
            {{ $t('debt_list.a20') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="step == 2">
      <div class="my-2 mx-6 flex items-center" style="cursor: pointer" @click="step === 1 ? $router.go(-1) : step--">
        <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="15 6 9 12 15 18" />
        </svg>
        <p class="text-blue-500">{{ $t('back') }} </p>
      </div>
      <div class="flex justify-center items-center" style="margin-top: 5rem">
        <div style="width: 26.6rem">
          <h2 class="font-bold text-2xl">{{ $t('a1.a001') }}</h2>
          <hr class="hr_line my-5" />
          <input type="text" class="input" :placeholder="$t('placeholder.aa')" v-model="code" />
          <button @click="stepGo2" class="bg-t_primary hover:bg-blue-700 text-white mt-6 py-4 px-4 rounded w-full">
            {{ $t('process.accept') }}
          </button>

          <div class="mt-5">

            <p class="text-blue-500 text-right" style="cursor: pointer" v-if="isBtn == true" @click="timer">
              {{ $t('a1.a34') }} : 02:00
            </p>

            <p class="text-gray-500 text-right pr-12" v-if="isBtn == false">{{ $t('a1.a88') }}:</p>
            <p class="text-gray-500 text-right" style="margin-top: -23px" v-if="isBtn == false">{{ waitingTime }}</p>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, helpers, sameAs } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      step: 1,
      phone: null,
      code: null,
      oldPhone: null,
      time: 120,
      intervalSecond: null,
      isBtn: false,
    };
  },

  created() {
    let links = [{ title: "Parolni tiklash", name: "auth-forgot" }];
    this.$store.commit("changeBreadCrumb", links);
  },

  mounted() {
    if (this.step == 2) {
      this.startTimer();
    }
  },
  computed: {
    waitingTime() {
      let minute = parseInt(this.time / 60);
      let second = this.time % 60;
      minute = minute < 10 ? `0${minute}` : minute;
      second = second < 10 ? `0${second}` : second;
      return `${minute}:${second}`;
    },
  },
  methods: {
    routerGo() {
      this.step == 1 ? this.$router.go(-1) : this.step--;
      clearInterval(this.intervalSecond);
      this.time = 120;
    },
    removeSpace(e) {
      this.phone = e.trim();
    },
    startTimer() {
      this.intervalSecond = setInterval(() => {
        if (this.time > 0) {
          this.isBtn = false;
          this.time = this.time - 1;
        } else {
          clearInterval(this.intervalSecond);
          this.status = 5;
          this.time = 120;
          this.isBtn = true;
        }
      }, 1000);
    },
    async stepGo() {
      const phone = this.phone
        .split("")
        .filter((el) => el !== " ")
        .join("");
      if (phone.length != 13) {
        return this.$toast.error($nuxt.$t('a1.a72'));
      }
      const response = await this.$axios.post("/user/rephone", {
        step: this.step,
        phone: phone,
        user: this.$auth.user.phone,
        lang: this.$i18n.locale
      });
      if (response.data.msg == "user-allow") {
        return this.$toast.error($nuxt.$t('a1.a75'));
      }
      if (response.data.msg == "send-code") {
        this.startTimer();
        this.oldPhone = response.data.user

        this.step = this.step + 1;
        if (this.$i18n.locale == "ru") {
          return this.$toast.success(`Код подтверждения отправлен на номер телефона ${phone}.`);
        } else {
          return this.$toast.success(`${phone} ${$nuxt.$t('a1.a83')}`);
        }
      }
    },
    async timer() {
      const phone = this.phone
        .split("")
        .filter((el) => el !== " ")
        .join("");
      const data = {
        phone,
        lang: this.$i18n.locale,
      };
      const response = await this.$axios.post("/user/phoneChange", data);
      if (response.status == 200 && response.data.msg == "user-allow") {
        return this.$toast.error($nuxt.$t('a1.a75'));
      }
      if (response.status == 200 && response.data.msg == 'sms-send') {
        this.startTimer();
      }
    },
    async stepGo2() {
      const phone = this.phone
        .split("")
        .filter((el) => el !== " ")
        .join("");
      if (this.code == null) {
        return this.$toast.error($nuxt.$t('a1.a73'));
      }
      const response = await this.$axios.post("/user/rephone", {
        step: this.step,
        phone: phone,
        code: this.code,
        oldPhone: this.oldPhone,
        lang: this.$i18n.locale
      });
      if (response.status == 200 && response.data.success == false && response.data.message == 'code-expired') {
        return this.$toast.error($nuxt.$t('a1.a90'));
      }
      if (response.data.msg == "no-code") {
        return this.$toast.error($nuxt.$t('a1.a89'));
      }
      if (response.data.msg == "user-allow") {
        return this.$toast.error($nuxt.$t('a1.a75'));
      }
      if (response.data.msg == "send-code") {
        this.step = this.step + 1;
        if (this.$i18n.locale == "ru") {
          return this.$toast.success(`Код подтверждения отправлен на номер телефона ${phone}.`);
        } else {
          return this.$toast.success(`${phone} ${$nuxt.$t('a1.a83')}`);
        }
      }
      this.$toast.success($nuxt.$t('a1.a76'));
      return this.$router.push(this.localePath({ name: `index` }));
    },
  },
};
</script>

<style lang="css" scoped>
.auth {
  padding-bottom: 8rem;
}

.hr_line {
  border: none;
  height: 0.2px;
  /* Set the hr color */
  color: #f5f5f5;
  /* old IE */
  background-color: #f5f5f5;
  /* Modern Browsers */
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
