<template>
  <div class="auth bg-white rounded pt-4 px-4">
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
      <p class="text-blue-500" @click="stepBack">Orqaga</p>
    </div>
    <div v-if="step == 1">
      <div class="flex justify-center items-center" style="margin-top: 5rem">
        <div style="width: 26.6rem">
          <h2 class="font-bold text-2xl">Tizimda ro‘yhatdan o‘tish</h2>
          <p class="text-gray-500 my-5">Telefon raqamingizni kiriting</p>
          <hr class="hr_line my-5" />
          <p class="text-t_secondary mb-2">Telefon raqami</p>

          <vue-tel-input
            style="
              padding: 0.5rem 0;
              border: 1px solid #1565d8;
              border-radius: 5px;
            "
            @input="removeSpace"
            v-mask="'+998 ## ### ## ##'"
            v-model="phone"
          ></vue-tel-input>
          <h3 class="text-t_error" v-if="!$v.phone.required && check2">
            Telefon raqamni kiriting
          </h3>
          <button
            @click="sendPhone"
            class="
              bg-t_primary
              hover:bg-blue-700
              text-white
              mt-6
              py-4
              px-4
              rounded
              w-full
            "
          >
            Davom etish
          </button>
        </div>
      </div>
    </div>
    <div v-if="step == 2">
      <div class="flex justify-center items-center" style="margin-top: 5rem">
        <div style="width: 26.6rem">
          <h2 class="font-bold text-2xl">Tizimda ro'yhatdan o'tish</h2>
          <p class="text-gray-500 my-5">
            Telefon raqamingizga yuborilgan kodni kiriting
          </p>
          <hr class="hr_line my-5" />
          <p class="text-t_secondary mb-2">Kodni kiriting</p>

          <input
            v-model="code"
            type="text"
            class="input"
            style="border: 1px solid #1565d8; padding: 1rem; border-radius: 5px"
            placeholder="Kodni kiriting"
            v-mask=""
          />
          <h3 class="text-t_error" v-if="!$v.code.required && check2">
            Kodni kiriting
          </h3>
          <button
            @click="sendCode"
            class="
              bg-t_primary
              hover:bg-blue-700
              text-white
              mt-6
              py-4
              px-4
              rounded
              w-full
            "
          >
            Davom etish
          </button>
        </div>
      </div>
    </div>

    <div v-if="step == 3">
      <div class="flex justify-center items-center" style="margin-top: 5rem">
        <div style="width: 26.6rem">
          <h2 class="font-bold text-2xl">Parol yaratish</h2>
          <p class="text-gray-500 my-5">Login va parolingizni kiriting</p>
          <hr class="hr_line my-5" />
          <p class="text-t_secondary mb-2">Telefon raqami</p>

          <p class="text-t_secondary my-2">
            Parol harf, raqam va boshqa belgilardan tashkil topgan kamida 8 ta
            belgidan iborat bo‘lishi lozim.
          </p>
          <div class="input__wrapper">
            <input
              ref="password"
              v-model.trim="password.password"
              placeholder=" Parolni kiriting"
              type="password"
              class="input"
            />
            <svg
              style="margin-right: 15px; cursor: pointer"
              @click="tooglePassword"
              class="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>

          <h3
            class="text-t_error"
            v-if="!$v.password.password.required && check2"
          >
            Parolni kiriting
          </h3>

          <h3
            class="text-t_error"
            v-if="
              $v.password.password.required && !$v.password.password.minLength
            "
          >
            Parolni uzunligi 8 dan kam bo'lmasin
          </h3>
          <h3
            class="text-t_error"
            v-if="
              $v.password.password.required &&
              $v.password.password.minLength &&
              !$v.password.password.alphaNumAndDot
            "
          >
            Parolda son va xarflar qatnashsin
          </h3>

          <div class="input__wrapper mt-2">
            <input
              ref="confirmPassword"
              v-model.trim="password.confirmPassword"
              placeholder=" Parolni kiriting"
              type="password"
              class="input"
            />
            <svg
              style="margin-right: 15px; cursor: pointer"
              @click="confirmTooglePassword"
              class="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>

          <h3
            class="text-t_error"
            v-if="!$v.password.confirmPassword.required && check2"
          >
            Takrorlanish parolini kiriting
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
            @click="sendAllData"
            class="
              bg-t_primary
              hover:bg-blue-700
              text-white
              mt-6
              py-4
              px-4
              rounded
              w-full
            "
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueTelInput } from "vue-tel-input";
import {
  required,
  minLength,
  helpers,
  sameAs,
  alpha,
} from "vuelidate/lib/validators";
const alphaNumAndDotValidator = helpers.regex(
  "alphaNumAndDot",
  /^[a-zA-Z0-9]*$/
);

export default {
  data: () => ({
    step: 1,
    phone: "",
    code: "",
    check2: false,
    password: {
      password: "",
      confirmPassword: "",
    },
  }),
  validations: {
    phone: {
      required,
    },
    code: {
      required,
    },
    password: {
      password: { required, minLength: minLength(8), alphaNumAndDotValidator },
      confirmPassword: {
        required,
        sameAs: sameAs(function () {
          return this.password.password;
        }),
      },
    },
  },
  created() {
    let links = [{ title: "Ro‘yhatdan o‘tish", name: "auth-register" }];
    this.$store.commit("changeBreadCrumb", links);
  },
  methods: {
    removeSpace(e) {
      this.phone = e.trim();
    },

    tooglePassword() {
      if (this.$refs.password.type == "password") {
        this.$refs.password.type = "text";
      } else {
        this.$refs.password.type = "password";
      }
    },

    confirmTooglePassword() {
      if (this.$refs.confirmPassword.type == "password") {
        this.$refs.confirmPassword.type = "text";
      } else {
        this.$refs.confirmPassword.type = "password";
      }
    },

    stepBack() {
      this.check2 = false;
      if (this.step == 1) {
        return (this.step = 1);
      }

      this.step = this.step - 1;
    },
    async sendPhone() {
      const phone = this.phone
        .split("")
        .filter((el) => el !== " ")
        .join("");
      try {
        const data = {
          phone,
          step: this.step,
          type: 2,
        };
        const response = await this.$axios.post("/user/register", data);
        if (response.status == 200) {
          this.stepGo();
        }
      } catch (e) {
        this.$toast.error("Xatolik yuz berdi !");
      }
    },

    async sendAllData() {
      this.check2 = true;
      const phone = this.phone
        .split("")
        .filter((el) => el !== " ")
        .join("");

      this.$v.password.$touch();
      if (!this.$v.password.$invalid) {
        this.check2 = false;

        try {
          const response = await this.$axios.post("/user/register", {
            phone,
            code: this.code,
            password: this.password.password,
            step: this.step,
          });
          if (response.status == 200) {
            this.$toast.success("Mufaqqiyatli ro‘yhatdan o‘tdingiz");
            this.$router.push("/auth/login");
          }
        } catch (e) {
          this.$toast.error("Xatolik yuz berdi !");
        }
      }
    },

    async sendCode() {
      const phone = this.phone
        .split("")
        .filter((el) => el !== " ")
        .join("");

      try {
        const response = await this.$axios.post("/user/register", {
          phone,
          code: this.code,
          step: this.step,
        });
        console.log(response.data);
        if (response.status == 200) {
          this.stepGo();
        }
      } catch (e) {
        this.$toast.error("Xatolik yuz berdi !");
      }
    },
    stepGo() {
      this.check2 = true;
      this.$v.phone.$touch();
      this.$v.code.$touch();

      if (this.step == 1) {
        if (!this.$v.phone.$invalid) {
          this.check2 = false;
          this.step = this.step + 1;
        }
      }

      if (!this.$v.code.$invalid) {
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

.input__wrapper {
  border: 1px solid #1565d8;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;

  transition: all 0.2s ease;
}

.input {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  text-indent: 10px;
}

.input__wrapper:focus {
  box-shadow: 0px 4px 10px 3px rgba(0, 0, 0, 0.11);
}
</style>
