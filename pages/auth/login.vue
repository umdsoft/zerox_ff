<template>
  <div class="auth bg-white pt-4 px-4 rounded">
    <IdenMessage @removeIdenModal="removeIdenModal" v-if="idenNotification" />
    <div @click="step == 0 ? $router.go(-1) : step--" class="my-2 mx-6 hidden lg:inline-flex items-center"
      style="cursor: pointer">
      <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      <p class="text-blue-500">{{ $t("back") }}</p>
    </div>
    <div class="flex justify-center items-center" style="margin-top: 5rem">
      <div style="width: 26.6rem">
        <h2 class="font-bold text-2xl items-center">{{ $t("login.title") }}</h2>
        <hr class="hr_line my-5" />
        <p class="text-t_secondary mb-2">{{ $t("login.phone") }}</p>

        <vue-tel-input style="
            padding: 0.5rem 0;
            border: 1px solid #1565d8;
            border-radius: 5px;
          " v-model="login.phone" @input="removeSpace" @keydown.enter="loginUser"
          v-mask="'+998 ## ### ## ##'"></vue-tel-input>
        <h6 class="text-t_error" v-if="!$v.login.phone.required && check2">
          {{ $t("login.err_phone") }}
        </h6>

        <p class="text-t_secondary my-2">{{ $t("login.pass") }}</p>
        <div class="input__wrapper">
          <input ref="password" v-model="login.password" type="password" class="input" @keyup="keyupPassword"
            @keydown.enter="loginUser" />
          <svg style="margin-right: 15px; cursor: pointer" @click="tooglePassword" class="h-6 w-6 text-blue-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h6 class="text-t_error" v-if="!$v.login.password.required && check2">
          {{ $t("login.password") }}
        </h6>

        <button @click="loginUser" class="bg-t_primary hover:bg-blue-700 text-white mt-6 py-4 px-4 rounded w-full">
          {{ $t("login.logIn") }}
        </button>
        <div class="flex justify-between items-center mt-6">
          <p class="text-t_primary text-xs lg:text-sm" style="cursor: pointer" @click="moddal()">
            {{ $t("login.forg") }}
          </p>
          <nuxt-link :to="localePath({ name: 'auth-register' })">
            <button class="bg-t_primary hover:bg-blue-700 text-white text-sm py-1 px-8 rounded">
              {{ $t("login.reg") }}
            </button>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueTelInput } from "vue-tel-input";
import { required, minLength, helpers } from "vuelidate/lib/validators";
import IdenMessage from "../../components/VosModal.vue";
export default {
  components: {
    VueTelInput,
    IdenMessage,
  },
  data() {
    return {
      step: 0,
      idenNotification: false,
      login: {
        phone: "",
        password: "",
      },

      check2: false,
    };
  },
  created() {
    let links = [{ title: "Kirish", name: "auth-login" }];
    this.$store.commit("changeBreadCrumb", links);
  },
  mounted() {

  },
  validations: {
    login: {
      phone: {
        required,
      },
      password: {
        required,
      },
    },
  },
  methods: {

    moddal() {
      this.idenNotification = true;
    },
    removeIdenModal() {
      clearTimeout(this.timeoutFunc);
      this.idenNotification = false;
    },
    goBack() {
      this.$router.go(1);
    },

    removeSpace(e) {
      this.login.phone = e.trim();
    },

    keyupPassword(e) {
      const value = e.target.value;
      e.target.value = value.trim();
    },

    tooglePassword() {
      if (this.$refs.password.type == "password") {
        this.$refs.password.type = "text";
      } else {
        this.$refs.password.type = "password";
      }
    },

    sendArchiveData() {
      // IP manzilni olish va ma'lumotlarni yuborish
      fetch("https://ipapi.co/json/")
        .then(response => response.json())
        .then(ip_add_json => {
          const arch_data = {
            ip: ip_add_json.ip,
            region: `${ip_add_json.country_name}, ${ip_add_json.city}`,
            device: "ZeroX Web",
            user_id: this.response.data.sad // response o'zgaruvchisi kontekstdan kelishi kerak
          };

          // Axios bilan fonda yuborish
          this.$axios.post("/user/archive", arch_data)
            .then(postResponse => {
              console.log("Ma'lumot muvaffaqiyatli yuborildi:", postResponse.data);
            })
            .catch(error => {
              console.error("Axios xatosi:", error);
            });
        })
        .catch(error => {
          console.error("Fetch xatosi:", error);
        });
    },
    // Sizning komponentingizdagi loginUser funksiyasi

    async loginUser() {
      this.$v.login.$touch();
      this.check2 = true;

      if (!this.$v.login.$invalid) {
        try {
          // Login qilishdan oldin joriy tilni saqlab olamiz.
          const currentLanguage = this.$i18n.locale;

          const phone = this.login.phone
            .split("")
            .filter((el) => el !== " ")
            .join("");
          console.log(phone);

          let response = await this.$auth.loginWith("local", {
            data: { phone, password: this.login.password },
          });
          console.log(response);

          if (
            response.status == 200 &&
            response.data.success == false &&
            response.data.msg == "user-nft"
          ) {
            this.$toast.error(this.$t("a1.a91"));
            this.$router.push(this.localePath({ name: 'auth-register' }));
            // Agar bu yerda yo'naltirish bo'lsa, tilni saqlashga hojat yo'q, chunki keyingi sahifada i18n.js ishlaydi.
          }
          if (
            response.status == 200 &&
            response.data.success == false &&
            response.data.message == "user-not-found"
          ) {
            return this.$toast.error(this.$t("a1.a87"));
          }
          if (
            response.status == 200 &&
            response.data.success == false &&
            response.data.message == "error"
          ) {
            return this.$toast.error(this.$t("debt_list.a70"));
          }

          if (response.status == 200 && response.data.success == true) {
            // Muvaffaqiyatli login bo'lgandan keyin tanlangan tilni localStorage ga saqlaymiz.
            // Bu, agar foydalanuvchi keyinchalik sahifani yangilasa yoki qayta kelsa,
            // tanlangan tilning saqlanib qolishini ta'minlaydi.
            localStorage.setItem('app-language', currentLanguage);

            // Bu qator shart emas, chunki til localStorage'dan plagin orqali yuklanadi
            // va $router.push sahifani to'liq yangilamaydi.
            // this.$i18n.locale = currentLanguage;

            this.sendArchiveData();
            // Foydalanuvchini bosh sahifaga yo'naltiramiz.
            // localePath dan foydalanish nuxt-i18n ning URL prefixini to'g'ri boshqarishiga yordam beradi.
            this.$router.push(this.localePath({ name: 'index' }));
          }
        } catch (err) {
          console.error('Login xatosi:', err);
          // Xato xabarini ko'rsatish
          return this.$toast.error(this.$t("debt_list.a70"));
        }
      }
    }
  },
};
</script>

<style scoped>
.error-login {
  font-size: 16px;
  color: red;
}

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

.input__wrapper {
  border: 1px solid #1565d8;
  width: 100%;
  display: flex;
  padding: 13px;
  height: 50px;
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
