<template>
  <div>
    <div :class="{ ActiveModalForms: Payme }" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isActivModal('Payme')" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">Payme orqali</div>
        <input v-model="PaymeNum" v-on:input="verification('PaymeNum')" placeholder="summani kiriting" class="input"
          type="tel" />
        <button class="ModalForms__btn">{{ $t("mobil.hisobni") }}</button>
      </div>
    </div>
    <div :class="{ ActiveModalForms: Click }" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isActivModal('Click')" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">Click orqali</div>
        <input v-model="ClickNum" :placeholder="$t('placeholder.summo')" v-on:input="verification('ClickNum')"
          class="input" type="tel" />
        <button class="ModalForms__btn">{{ $t("mobil.hisobni") }}</button>
      </div>
    </div>
    <div :class="{ ActiveModalForms: Mobil }" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isActivModal('Mobil')" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">
          Mobil xisobdan mobil xisobga o‘tkazish orqali
        </div>
        <input v-model="MobilNum" :placeholder="$t('placeholder.summo')" v-on:input="verification('MobilNum')"
          class="input" type="tel" />
        <button class="ModalForms__btn">{{ $t("mobil.hisobni") }}</button>
      </div>
    </div>
    <div class="bg-white rounded p-10">
      <div @click="$router.go(-1)" class="hidden lg:inline-flex items-center" style="cursor: pointer">
        <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="15 6 9 12 15 18" />
        </svg>
        <p class="text-blue-500">{{ $t("mobil.bck") }}</p>
      </div>

      <div class="MyPractices">
        <div class="MyPractices__contents">
          <div class="MyPractices__content">
            <div class="MyPractices__title">
              <span>{{ $t("mobil.mobl") }}</span>
              <nuxt-link :to="localePath({ name: 'jonatuvchi', query: { status: 1 } })">{{
                $t("mobil.all")
                }}</nuxt-link>
            </div>
            <div v-if="data != null">
              <div class="MyPractices__cart" v-for="(item, index) in data" :key="index">
                <div class="MyPractices__txt" v-if="item.utype == 2">
                  <span v-if="item.type == 1 && $i18n.locale != 'ru'">
                    {{ item.number }} - {{ $t("mobil.bcks") }}
                  </span>
                  <span v-if="item.type == 1 && $i18n.locale == 'ru'">
                    Для договора займа №{{ item.number }}
                  </span>
                  <span v-if="item.type == 2 && $i18n.locale != 'ru'">
                    {{ item.dname }} {{ $t("mobil.phon") }}
                  </span>
                  <span v-if="item.type == 2 && $i18n.locale == 'ru'">
                    Перевод на мобильный счет пользователя ({{ item.dname }})
                  </span>
                  <span v-if="item.type == 3 && $i18n.locale != 'ru'">
                    {{ item.dname }} {{ $t("mobil.phon2") }}
                  </span>
                  <span v-if="item.type == 3 && $i18n.locale == 'ru'">
                    Перевод с мобильного счета пользователя ({{ item.dname }})
                  </span>
                  <span v-if="item.type == 5">
                    {{ $t('a1.a26') }}
                  </span>
                  <span v-if="item.type == 4">{{ $t('a1.a27') }}</span>
                </div>
                <div class="MyPractices__txt" v-if="item.utype == 1">
                  <span v-if="item.type == 1">
                    {{ item.number }} - {{ $t("mobil.bcks") }}
                  </span>
                  <span v-if="item.type == 2">
                    {{ item.company }} {{ $t("mobil.phon") }}
                  </span>
                  <span v-if="item.type == 3">
                    {{ item.company }} {{ $t("mobil.phon2") }}
                  </span>
                  <span v-if="item.type == 4"> {{ $t('a1.a27') }} </span>
                </div>
                <div class="MyPractices__num">
                  <span v-if="item.all == 1" class="red">-
                    {{
                      item.amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }}
                    UZS
                  </span>
                  <span v-if="item.all == 0" class="pl">+
                    {{
                      item.amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }}
                    UZS
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="MyPractices__content">
            <div class="MyPractices__UserCart">
              <div class="MyPractices__UserImg">
                <span v-if="$auth.user.type == 2 && $auth.user.gender == 1">
                  <svg width="50" height="58" viewBox="0 0 50 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1_482)">
                      <path
                        d="M25 29C32.8906 29 39.2857 22.509 39.2857 14.5C39.2857 6.49102 32.8906 0 25 0C17.1094 0 10.7143 6.49102 10.7143 14.5C10.7143 22.509 17.1094 29 25 29ZM19.8996 34.4375C8.90625 34.4375 0 43.4773 0 54.6355C0 56.4934 1.48438 58 3.31473 58H46.6853C48.5156 58 50 56.4934 50 54.6355C50 43.4773 41.0938 34.4375 30.1004 34.4375H19.8996V34.4375Z"
                        fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_482">
                        <rect width="50" height="58" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span v-if="$auth.user.gender === null">
                  <svg width="50" height="58" viewBox="0 0 50 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1_482)">
                      <path
                        d="M25 29C32.8906 29 39.2857 22.509 39.2857 14.5C39.2857 6.49102 32.8906 0 25 0C17.1094 0 10.7143 6.49102 10.7143 14.5C10.7143 22.509 17.1094 29 25 29ZM19.8996 34.4375C8.90625 34.4375 0 43.4773 0 54.6355C0 56.4934 1.48438 58 3.31473 58H46.6853C48.5156 58 50 56.4934 50 54.6355C50 43.4773 41.0938 34.4375 30.1004 34.4375H19.8996V34.4375Z"
                        fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_482">
                        <rect width="50" height="58" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                <span v-if="$auth.user.type == 2 && $auth.user.gender == 2">
                  <svg width="50" height="58" viewBox="0 0 50 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M48.2286 37.2906L36.1676 31.3594L31.0675 28.8511C31.1953 28.7677 31.317 28.6733 31.4425 28.5851H38.1392C38.6372 28.5851 39.1148 28.3812 39.467 28.0181C39.8191 27.6551 40.0169 27.1627 40.0169 26.6493V21.5558H40C39.7951 14.4573 37.4037 8.21244 33.8124 4.29638C31.9185 2.0946 29.464 0.598683 26.7183 0.151656C26.5958 0.131012 26.4734 0.111955 26.3501 0.095281C26.2084 0.0770188 26.0675 0.0587567 25.9242 0.0468466C25.6164 0.01726 25.3076 0.0016294 24.9985 0H24.9969C24.6904 0 24.3877 0.0182623 24.0858 0.0452587C23.941 0.0579628 23.7978 0.0762245 23.6545 0.0944867C23.5344 0.110367 23.415 0.127835 23.2964 0.148479C20.573 0.587566 18.1354 2.06045 16.2469 4.23048C12.6209 8.14257 10.2033 14.4168 9.99692 21.5566H9.98075V26.6501C9.98075 27.1635 10.1786 27.6559 10.5307 28.0189C10.8828 28.382 11.3604 28.5859 11.8584 28.5859H18.5736C18.7569 28.7146 18.9395 28.8456 19.1289 28.9631L14.2445 31.3078L1.79221 37.2867C0.710105 37.8091 0 39.0668 0 40.4714V54.577C0 56.4676 1.27773 58 2.85582 58H47.1442C48.7223 58 50 56.4676 50 54.577V40.4699C49.9992 39.07 49.2999 37.8242 48.2286 37.2906Z"
                      fill="white" />
                  </svg>
                </span>
                <span v-if="$auth.user.type == 1">
                  <svg width="50" height="58" viewBox="0 0 50 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M25 29C32.8906 29 39.2857 22.509 39.2857 14.5C39.2857 6.49102 32.8906 0 25 0C17.1094 0 10.7143 6.49102 10.7143 14.5C10.7143 22.509 17.1094 29 25 29ZM35.692 32.693L30.3571 54.375L26.7857 38.9687L30.3571 32.625H19.6429L23.2143 38.9687L19.6429 54.375L14.308 32.693C6.35045 33.0781 0 39.6824 0 47.85V52.5625C0 55.5645 2.39955 58 5.35714 58H44.6429C47.6004 58 50 55.5645 50 52.5625V47.85C50 39.6824 43.6496 33.0781 35.692 32.693V32.693Z"
                      fill="white" />
                  </svg>
                </span>
              </div>
              <div class="MyPractices__UserInfo">
                <div class="MyPractices__UserName">
                  {{ $auth.user.last_name }} {{ $auth.user.first_name }}
                  {{ $auth.user.middle_name }}
                </div>
                <div class="MyPractices__UserId">
                  <span>{{ $t("mobil.mob") }} </span>
                  <span> {{ $auth.user.uid }}</span>
                </div>
                <div class="MyPractices__UserBalans">
                  <span>{{ $t("mobil.Balans") }}:</span>
                  <span>{{
                    dds.amount
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                  }}
                    UZS
                  </span>
                </div>
              </div>
            </div>
            <div class="MyPractices__FreeContracts" v-if="line != 0">
              <div class="MyPractices__FreeContractsTitle">
                {{ $t("mobil.document") }}
              </div>
              <div class="MyPractices__FreeContractsCart">
                <div class="MyPractices__FreeContractsNum">
                  <span>{{ line }}</span>
                </div>
                <div class="MyPractices__FreeContractsLine">
                  <span :class="{
                    line1: line == 1,
                    line2: line == 2,
                    line3: line == 3,
                    line4: line == 4,
                    line5: line == 5
                  }"></span>
                </div>
              </div>
            </div>
            <div class="MyPractices__replenish">
              <div class="MyPractices__replenishTitle" style="text-align:center;">
                {{ $t("mobil.Mobilaccount") }}
              </div>
              <div class="MyPractices__replenishCarts">
                <div @click="paymeModal = true" class="MyPractices__replenishCart">
                  <img src="https://cdn.payme.uz/logo/payme_color.png?target=_blank" alt="" />
                  <!-- <div class="MyPractices__replenishTxt">Payme orqali</div> -->
                </div>
                <div @click="clickModal = true" class="MyPractices__replenishCart">
                  <img src="@/assets/img/click2.png" alt="" />
                  <!-- <div class="MyPractices__replenishTxt">Click orqali</div> -->
                </div>
                <div @click="mobileModal = true" class="MyPractices__replenishCart">
                  <div>
                    <div class="flex justify-center mb-1">
                      <img class="w-9" src="@/assets/img/Arows.png" alt="" />
                    </div>
                    <div class="MyPractices__replenishTxt">
                      {{ $t("mobil.transfer") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ZModal v-if="paymeModal" :width="420" @closeModal="closePaymeModal">
      <template #modal_body>
        <div class="text-md font-bold mb-4 mt-4">{{ $t("mobil.payme") }}</div>
        <div>
          <input class="z-input mb-4" type="text" :placeholder="$t('placeholder.summo')" v-model="payme"
            @keyup="keyupSum" />
        </div>
        <button class="btn-z w-full" @click="eventPayme">
          {{ $t("mobil.hisobni") }}
        </button>
      </template>
    </ZModal>

    <ZModal v-if="clickModal" :width="420" @closeModal="closeClickModal">
      <template #modal_body>
        <div class="text-md font-bold mb-4 mt-4">{{ $t("mobil.clck") }}</div>
        <div>
          <input class="z-input mb-4" type="text" :placeholder="$t('placeholder.summo')" v-model="click_pay"
            @keyup="keyupSum" />
        </div>
        <button class="btn-z w-full" @click="eventClick">
          {{ $t("mobil.hisobni") }}
        </button>
      </template>
    </ZModal>

    <ZModal v-if="mobileModal" :width="420" @closeModal="closeModal">
      <template #modal_body>
        <div class="text-md font-bold mb-4 mt-4">
          {{ $t("mobil.mobl2") }}
        </div>
        <div>
          <input class="z-input mb-4" type="text" @keydown.enter="getUsersDd" v-mask="'######/AA'"
            :placeholder="$t('placeholder.idd')" v-model="mobile.userId" />
          <span>{{ name }}</span>

          <input class="z-input mb-4 mt-2" type="text" :placeholder="$t('placeholder.summo')" v-model="mobile.price"
            @keyup="keyupSum" />
        </div>

        <button class="btn-z w-full" @click="eventMobile">
          {{ $t("mobil.transfers") }}
        </button>
      </template>
    </ZModal>
  </div>
</template>
<script>
export default {
  middleware: "auth",
  data() {
    return {
      userData: null,
      message: "",
      has_number: false,
      has_lowercase: false,
      has_uppercase: false,
      has_special: false,
      step: 1,
      name: "",
      PaymeNum: "",
      ClickNum: "",
      MobilNum: "",
      line: 0,
      Payme: false,
      Click: false,
      Mobil: false,
      data: null,
      paymeModal: false,
      payme: "",
      dds: {
        amount: 0,
      },
      clickModal: false,
      click_pay: "",
      mobileModal: false,
      debounceTimer: null,
      mobile: {
        price: "",
        userId: "",
      },
    };
  },

  async mounted() {
    this.initializeUser();
    this.setBreadcrumbs();
    await this.fetchAccountData();
    await this.fetchUserData();

    this.initStorageSync(); // 🔁 LocalStorage'dan sinxronlash
    this.waitForSocketAndEmit(true); // 📡 Global socket listenerni ishga tushurish
  },

  watch: {
    "mobile.userId": {
      immediate: true,
      handler(newValue) {
        this.handleUserIdChange(newValue);
      },
    },
  },

  methods: {
    initializeUser() {
      if (this.$auth.user.is_active === 1 && this.$auth.user.is_contract === 0) {
        this.$router.push(this.localePath({ name: 'universal_contract' }));
      }
    },

    initStorageSync() {
      // 🔁 LocalStorage'ni kuzatish orqali balansni sinxron saqlash
      window.addEventListener("storage", (event) => {
        if (event.key === "user_balance") {
          this.dds.amount = parseFloat(event.newValue || 0);
        }
      });

      // ⚡ Dastlabki qiymatni yuklash
      const storedBalance = localStorage.getItem("user_balance");
      if (storedBalance) {
        this.dds.amount = parseFloat(storedBalance);
      }
    },

    waitForSocketAndEmit(force = false) {
      let attempts = 0;
      const maxAttempts = 20;
      const retry = setInterval(() => {
        const socket = this.$root?.socket;
        const userId = this.$auth?.user?.id;

        if (socket && socket.connected && userId) {
          clearInterval(retry);
          this.setupSocketListener(socket);
          if (force || !sessionStorage.getItem("sent_header_sync")) {
            socket.emit("send_notification", { id: userId });
            sessionStorage.setItem("sent_header_sync", "1");
            this.fetchAccountData()
          }
        }

        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(retry);
          console.warn("❌ Socket ulanishi topilmadi.");
        }
      }, 300);
    },

    setupSocketListener(socket) {
      if (!socket) return;

      socket.off("recive_notification");
      socket.on("recive_notification", (data) => {
        if (data?.amount?.balance !== undefined) {
          this.dds.amount = data.amount.balance;
          localStorage.setItem("user_balance", data.amount.balance);
        }
        if (data?.notification) {
          localStorage.setItem("user_notifications", JSON.stringify(data.notification));
        }
      });
    },

    setBreadcrumbs() {
      const links = [{ title: "Qo'llab quvvatlash", name: "call-center" }];
      this.$store.commit("changeBreadCrumb", links);
    },

    async fetchAccountData() {
      try {
        const response = await this.$axios.$get("/home/hisob");
        this.data = response.data;
      } catch (error) {
        console.error("Hisob ma’lumotlarini olishda xatolik:", error);
      }
    },

    async fetchUserData() {
      try {
        const response = await this.$axios.$get("/user/me");
        this.userData = response.data;
        this.line = this.userData.cnt;
      } catch (error) {
        console.error("Foydalanuvchi ma’lumotlarini olishda xatolik:", error);
      }
    },

    handleUserIdChange(newValue) {
      clearTimeout(this.debounceTimer);
      this.name = $nuxt.$t("a1.a77");
      this.debounceTimer = setTimeout(() => {
        this.processUserIdInput(newValue.trim().toUpperCase());
      }, 200);
    },

    async processUserIdInput(userId) {
      this.mobile.userId = userId;
      if (userId.length === 9) {
        await this.fetchUserDetails(userId.split("/").join(""));
      } else {
        this.resetUserData();
      }
    },

    async fetchUserDetails(id) {
      try {
        const response = await this.$axios.$get(`/user/candidate-search/${id}`);
        if (!response.data || response.data.is_active === 0) {
          this.name = $nuxt.$t("a1.a78");
          return;
        }
        this.name =
          response.data.type === 2
            ? `${response.data.first_name[0]}.${response.data.middle_name[0]}.${response.data.last_name}`
            : response.data.company;
      } catch (error) {
        this.name = $nuxt.$t("a1.a78");
        this.$toast.error($nuxt.$t("a1.a78"));
      }
    },

    resetUserData() {
      this.name = "";
      this.step = 1;
      this.mobile.price = this.formatPrice(this.mobile.price);
    },

    formatPrice(value) {
      return value
        .toString()
        .replace(/\s/g, "")
        .replace(/[^0-9]/g, "")
        .replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, " ");
    },

    closePaymeModal() {
      this.paymeModal = false;
      this.payme = "";
    },

    closeClickModal() {
      this.clickModal = false;
      this.click_pay = "";
    },

    closeModal() {
      this.mobileModal = false;
      this.resetUserData();
      this.mobile.userId = "";
      this.mobile.price = "";
    },

    password_check() {
      this.has_number = /\d/.test(this.message);
      this.has_lowercase = /[a-z]/.test(this.message);
      this.has_uppercase = /[A-Z]/.test(this.message);
      this.has_special = /[!@#\$%\^&*\)\(+=._-]/.test(this.message);
    },

    eventPayme() {
      const amount = this.payme.split(" ").join("");
      if (amount < 1000) {
        return this.$toast.error($nuxt.$t("a1.a79"));
      }
      const teene = amount * 100;
      const str =
        `m=62fa657ea12ad7a48f4b2dd9;ac.user_id=${this.$auth.user.uid};a=${teene};c=https://zerox.uz/mobil-hisob`;
      const link = "https://checkout.paycom.uz/" + btoa(str);
      window.location = link;
    },

    eventClick() {
      const amount = this.click_pay.split(" ").join("");
      if (amount < 1000) {
        return this.$toast.error($nuxt.$t("a1.a79"));
      }
      const str = `service_id=24899&merchant_id=17375&amount=${amount}&transaction_param=${this.$auth.user.uid}&return_url=https://zerox.uz/mobil-hisob`;
      const link = "https://my.click.uz/services/pay?" + str;
      window.location = link;
    },

    async eventMobile() {
      const dds = {
        user_id: this.mobile.userId.split("/").join(""),
        amount: this.mobile.price.split(" ").join(""),
      };
      try {
        if (dds.amount === "0") return this.$toast.error($nuxt.$t("a1.a80"));
        if (dds.amount < 1000) return this.$toast.error($nuxt.$t("a1.a79"));

        const response = await this.$axios.post("/user/transfer", dds);

        this.fetchAccountData();
        this.fetchUserData();

        const socket = this.$root?.socket;
        if (socket && socket.connected && this.$auth?.user?.id) {
          socket.emit("send_notification", { id: this.$auth.user.id });
          socket.once("recive_notification", (data) => {
            if (data?.amount?.balance !== undefined) {
              localStorage.setItem("user_balance", data.amount.balance);

              // 🔥 Header.vue ga trigger beramiz
              this.$root.$emit("update-header-balance", {
                balance: data.amount.balance,
                notifications: data.notification || [],
              });
            }
          });

        }

        if (response.data.message === "enouth-money")
          return this.$toast.error($nuxt.$t("a1.a51"));
        if (response.data.message === "all-user")
          return this.$toast.error($nuxt.$t("a1.a81"));
        if (response.data.message === "not-user")
          return this.$toast.error($nuxt.$t("a1.a53"));

        this.mobileModal = false;
        this.mobile.userId = "";
        this.mobile.price = "";
        this.$toast.success($nuxt.$t("a1.a82"));
      } catch (e) {
        this.$toast.error($nuxt.$t("a1.a42"));
      }
    },

    keyupSum(e) {
      e.target.value = this.formatPrice(e.target.value);
    },

    setUserId(e) {
      this.mobile.userId = e.target.value.toUpperCase();
    },

    isActivModal(txt) {
      this.Payme = txt === "Payme";
      this.Click = txt === "Click";
      this.Mobil = txt === "Mobil";
    },
  },
};

</script>




<style lang="scss" scoped>
.mobil {
  width: 400px;
  margin: 0 auto;

  .hisob {
    background: #ffffff;
    box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
    border-radius: 10px;
    padding: 20px 20px;
    margin-bottom: 20px;
  }
}

.btn {
  width: 100%;
  background: #3182ce;
  text-align: center;
  /* синий */

  box-shadow: inset 3px 0px 8px rgba(255, 255, 255, 0.1),
    inset 0px 3px 8px rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  background-color: rgb(76, 144, 210);
  color: white;
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;

  span {
    svg {
      transition: 0.2s;
    }
  }
}

.call {
  text-align: center;
  color: rgb(76, 144, 210);
}

.frmIcon {
  color: #f5052d;
}

.frmValidation--passed .frmIcon {
  color: #0fa140;
}

.ModalForms {
  transition-duration: 0.3s;
  opacity: 0;
  visibility: hidden;
  width: 40%;
  padding: 30px;
  top: 20%;
  left: 25%;
  position: absolute;
  z-index: 111;
  border-radius: 10px;
  background: rgb(255, 255, 255);
  box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);

  .ModalForms__inputs {
    position: relative;

    .ModalForms__X {
      cursor: pointer;
      position: absolute;
      top: -20px;
      right: -10px;
      font-size: 22px;
      font-weight: bold;
      color: red;
    }
  }

  .ModalFormsTitle {
    color: #000;
    font-weight: bold;
  }

  .ModalForms__btn {
    margin: 15px 0 0 0;
    color: white;
    padding: 15px 30px;
    border-radius: 10px;
    transition-duration: 0.3s;
    background: rgb(55, 144, 228);

    &:hover {
      background: rgb(45, 120, 190);
    }
  }

  .input {
    margin: 10px 0 0 0;
    padding: 10px 0 10px 10px;
    width: 100%;
    border-radius: 5px;
    border: 1px rgb(175, 175, 175) solid;
  }
}

.ActiveModalForms {
  top: 25%;
  opacity: 1;
  visibility: visible;
}

.MyPractices {
  width: 100%;

  .MyPractices__contents {
    display: flex;

    .MyPractices__content {
      width: 38%;

      .MyPractices__title {
        margin: 0 0 14px 0;
        width: 100%;
        display: flex;
        justify-content: space-between;

        span {
          font-weight: 600;
          font-size: 16px;
          line-height: 17px;
          color: #2d3748;
        }

        a {
          color: rgba(49, 130, 206, 1);
        }
      }

      .MyPractices__cart {
        margin: 10px 0 0 0;
        padding: 12px 17px;
        background: #ffffff;
        box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
        border-radius: 10px;

        .MyPractices__txt {
          font-weight: 400;
          font-size: 12px;
          line-height: 15px;
          color: #2d3748;
        }

        .MyPractices__num {
          margin: 12px 0 0 0;
          font-weight: 600;
          font-size: 14px;
          line-height: 100%;
        }

        .pl {
          color: #48bb78;
        }

        .red {
          color: rgb(192, 0, 0);
        }
      }
    }

    .MyPractices__content:nth-child(2) {
      width: 63%;
      margin: 0 0 0 32px;

      .MyPractices__UserCart {
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 1px;
        color: #2d3748;
        display: flex;
        align-items: center;
        background: #ffffff;
        box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
        border-radius: 10px;
        padding: 19px 16px;

        .MyPractices__UserImg {
          padding: 16px 27px 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: max-content;
          border-radius: 50%;
          background: rgba(49, 130, 206, 1);
        }

        .MyPractices__UserInfo {
          margin: 0 0 0 15px;
        }

        .MyPractices__UserName {
          font-weight: bold;
        }

        .MyPractices__UserId {
          margin: 13px 0 0 0;

          span:nth-child(1) {
            font-weight: bold;
            display: inline-block;
            width: 120px;
          }

          span:nth-child(2) {
            color: rgba(49, 130, 206, 1);
          }
        }

        .MyPractices__UserBalans {
          margin: 13px 0 0 0;

          span:nth-child(1) {
            font-weight: bold;
            display: inline-block;
            width: 120px;
          }

          span:nth-child(2) {
            color: rgba(49, 130, 206, 1);
          }
        }
      }

      .MyPractices__FreeContracts {
        margin: 25px 0 0 0;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 1px;
        color: #2d3748;

        .MyPractices__FreeContractsTitle {
          font-weight: bold;
          margin: 0 0 25px 0;
        }

        .MyPractices__FreeContractsCart {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 30px;
          background: #ffffff;
          box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
          border-radius: 10px;

          .MyPractices__FreeContractsNum {
            font-weight: bold;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: white;
            font-size: 25px;
            background: #3182ce;
            margin: 0 13px 0 0;
          }

          .MyPractices__FreeContractsLine {
            position: relative;
            width: 80%;
            height: 18px;
            border: 1px solid #3182ce;
            border-radius: 10px;

            span {
              position: absolute;
              top: 1px;
              left: 1px;
              height: 90%;
              width: 0%;
              background: #3182ce;
              border-radius: 10px;
            }

            .line1 {
              width: 20%;
            }

            .line2 {
              width: 40%;
            }

            .line3 {
              width: 60%;
            }

            .line4 {
              width: 80%;
            }

            .line5 {
              width: 100%;
            }
          }
        }
      }

      .MyPractices__replenish {
        .MyPractices__replenishTitle {
          margin: 28px 0 28px 0;
          font-weight: bold;
        }

        .MyPractices__replenishCarts {
          display: flex;
          justify-content: space-between;
        }

        .MyPractices__replenishCart {
          cursor: pointer;
          max-width: 150px;
          max-height: 150px;
          background: #ffffff;
          box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
          border-radius: 10px;
          padding: 30px 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .MyPractices__replenishTxt {
          text-align: center;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
