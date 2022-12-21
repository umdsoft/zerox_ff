<template>
  <div class="auth bg-white pt-4 px-4">
    <div v-if="step == 1">
      <div   @click="step == 0 ? $router.go(-1) : step--"  class="my-2 mx-6 hidden lg:inline-flex  items-center" style="cursor: pointer">
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
        <p class="text-blue-500"> {{$t('back')}}</p>
      </div>
      <div class="flex justify-center items-center" style="margin-top: 5rem">
        <div style="width: 26.6rem">
          <h2 class="font-bold text-2xl">Parolni tiklash</h2>
          <p class="text-gray-500 my-5">
            Parolni tiklash uchun maxfiy so‘zni kiriting
          </p>
          <hr class="hr_line my-5" />
          <p class="text-t_secondary mb-2">Sevimli jamoam</p>

          <input
            v-model="secretWord"
            type="text"
            class="input"
            placeholder="Maxfiy so'zni kiriting"
          />
          <h3 class="text-t_error" v-if="!$v.secretWord.required && check2">
            Kodni kiriting
          </h3>

          <button
            @click="stepGo"
            class="bg-t_primary hover:bg-blue-700 text-white mt-6 py-4  px-4 rounded w-full"
          >
            Davom etish
          </button>
        </div>
      </div>
    </div>

    <div v-if="step == 2">
      <div class="my-2 mx-6 flex items-center" style="cursor: pointer">
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
        <p class="text-blue-500"> {{$t('back')}}</p>
      </div>
      <div class="flex justify-center items-center" style="margin-top: 5rem">
        <div style="width: 26.6rem">
          <h2 class="font-bold text-2xl">Yangi parolni kiriting</h2>
          <p class="text-gray-500 my-5">Parol kiriting</p>
          <hr class="hr_line my-5" />
          <p class="text-t_secondary mb-2">
            Parol harf, raqam va boshqa belgilardan tashkil topgan kamida 8 ta
            belgidan iborat bo’lishi lozim.
          </p>

          <input
            v-model="password.password"
            type="password"
            class="input"
            placeholder="Parol yarating"
          />
          <h3
            class="text-t_error"
            v-if="!$v.password.password.required && check2"
          >
            Kodni kiriting
          </h3>
          <p class="text-t_secondary my-2">Parolni takrorlang</p>
          <input
            v-model="password.confirmPassword"
            type="password"
            class="input"
            placeholder="Parolni takrorlang"
          />
          <h3
            class="text-t_error"
            v-if="!$v.password.confirmPassword.required && check2"
          >
            Tasdiq kodini kiriting
          </h3>
          <h3
            class="text-t_error"
            v-if="
              $v.password.confirmPassword.required &&
              !$v.password.confirmPassword.sameAs &&
              check2
            "
          >
            Kodlar mos emas
          </h3>
          <button
            @click="stepGo"
            class="bg-t_primary hover:bg-blue-700 text-white mt-6 py-4  px-4 rounded w-full"
          >
            Tasdiqlash
          </button>
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
      check2: false,
      secretWord: "",
      password: {
        password: "",
        confirmPassword: "",
      },
    };
  },

  validations: {
    secretWord: { required },
    password: {
      password: {
        required,
      },
      confirmPassword: {
        required,
        sameAs: sameAs(function () {
          return this.password.password;
        }),
      },
    },
  },
  created() {
    let links = [{ title: "Parolni tiklash", name: "auth-forgot" }];
    this.$store.commit("changeBreadCrumb", links);
  },
  methods: {
    stepBack() {
      this.check2 = false;
      if (this.step == 1) {
        return (this.step = 1);
      }

      this.step = this.step - 1;
    },

    stepGo() {
      this.check2 = true;
      if (this.step == 2) {
        this.$v.password.$touch();
        if (!this.$v.password.$invalid) {
          this.password = {};
          this.check2 = false;
        }
        return;
      }

      this.$v.secretWord.$touch();

      if (!this.$v.secretWord.$invalid) {
        this.secretWord = "";
        this.check2 = false;
        this.step = this.step + 1;
      }
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
  color: #f5f5f5; /* old IE */
  background-color: #f5f5f5; /* Modern Browsers */
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
