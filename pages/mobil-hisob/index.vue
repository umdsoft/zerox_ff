<template>
  <div class="pb-8">

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- User Profile Card -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6">
            <!-- User Avatar & Info -->
            <div class="flex flex-col items-center text-center mb-6">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
                <svg v-if="$auth.user.type == 1" class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
                <svg v-else-if="$auth.user.gender == 2" class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                <svg v-else class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h2 class="text-lg font-bold text-gray-900">
                <template v-if="$auth.user.type == 1">{{ $auth.user.company }}</template>
                <template v-else>{{ $auth.user.last_name }} {{ $auth.user.first_name }}</template>
              </h2>
              <p class="text-sm text-gray-500 mt-1">{{ $auth.user.middle_name }}</p>
            </div>

            <!-- Balance Card -->
            <div class="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-blue-100 text-sm">{{ $t("mobil.Balans") }}</span>
                <svg class="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div class="text-2xl font-bold">{{ $formatNumber(dds.amount) }} <span class="text-lg font-normal text-blue-100">UZS</span></div>
            </div>

            <!-- User ID -->
            <div class="bg-gray-50 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-gray-500 tracking-wide">{{ $t("mobil.mob") }}</span>
                  <div class="text-lg font-semibold text-blue-600 mt-0.5">{{ $auth.user.uid }}</div>
                </div>
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Free Contracts Progress -->
            <div v-if="line > 0" class="mt-4 bg-gray-50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-gray-700">{{ $t("mobil.document") }}</span>
                <span class="text-lg font-bold text-blue-600">{{ line }}/5</span>
              </div>
              <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                  :style="{ width: (line / 5 * 100) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden mt-6">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t("mobil.Mobilaccount") }}</h3>
          </div>
          <div class="p-6">
            <div class="flex flex-col gap-3">
              <!-- Payme -->
              <button @click="paymeModal = true" class="group flex items-center gap-4 bg-white border-2 border-gray-100 hover:border-blue-500 rounded-xl p-4 transition-all duration-200 hover:shadow-lg">
                <div class="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img src="https://cdn.payme.uz/logo/payme_color.png" alt="Payme" class="h-8 object-contain" />
                </div>
                <div class="flex-1 text-left">
                  <span class="text-sm font-semibold text-gray-900 group-hover:text-blue-600">Payme</span>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- Click -->
              <button @click="clickModal = true" class="group flex items-center gap-4 bg-white border-2 border-gray-100 hover:border-blue-500 rounded-xl p-4 transition-all duration-200 hover:shadow-lg">
                <div class="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img src="@/assets/img/click2.png" alt="Click" class="h-8 object-contain" />
                </div>
                <div class="flex-1 text-left">
                  <span class="text-sm font-semibold text-gray-900 group-hover:text-blue-600">Click</span>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- Mobile Transfer -->
              <button @click="mobileModal = true" class="group flex items-center gap-4 bg-white border-2 border-gray-100 hover:border-blue-500 rounded-xl p-4 transition-all duration-200 hover:shadow-lg">
                <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div class="flex-1 text-left">
                  <span class="text-sm font-semibold text-gray-900 group-hover:text-blue-600">{{ $t("mobil.transfer") }}</span>
                  <p class="text-xs text-gray-500 mt-0.5">{{ $t("mobil.transfer_desc") || "Boshqa foydalanuvchiga o'tkazish" }}</p>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-2">
        <!-- Transaction History -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ $t("mobil.mobl") }}</h3>
              <p class="text-sm text-gray-500 mt-0.5">{{ $t("mobil.history_subtitle") || "So'nggi operatsiyalar" }}</p>
            </div>
            <nuxt-link
              :to="localePath({ name: 'jonatuvchi', query: { status: 1 } })"
              class="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {{ $t("mobil.all") }}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </nuxt-link>
          </div>

          <div v-if="data && data.length > 0" class="divide-y divide-gray-100">
            <div
              v-for="(item, index) in data"
              :key="index"
              class="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    item.all == 0 ? 'bg-green-100' : 'bg-red-100'
                  ]">
                    <svg
                      :class="[
                        'w-5 h-5',
                        item.all == 0 ? 'text-green-600' : 'text-red-600'
                      ]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        v-if="item.all == 0"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                      <path
                        v-else
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 13l-5 5m0 0l-5-5m5 5V6"
                      />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      <template v-if="item.utype == 2">
                        <span v-if="item.type == 1 && $i18n.locale != 'ru'">{{ item.number }} - {{ $t("mobil.bcks") }}</span>
                        <span v-if="item.type == 1 && $i18n.locale == 'ru'">Для договора займа №{{ item.number }}</span>
                        <span v-if="item.type == 2 && $i18n.locale != 'ru'">{{ item.dname }} {{ $t("mobil.phon") }}</span>
                        <span v-if="item.type == 2 && $i18n.locale == 'ru'">Перевод на мобильный счет ({{ item.dname }})</span>
                        <span v-if="item.type == 3 && $i18n.locale != 'ru'">{{ item.dname }} {{ $t("mobil.phon2") }}</span>
                        <span v-if="item.type == 3 && $i18n.locale == 'ru'">Перевод с мобильного счета ({{ item.dname }})</span>
                        <span v-if="item.type == 5">{{ $t('a1.a26') }}</span>
                        <span v-if="item.type == 4">{{ $t('a1.a27') }}</span>
                      </template>
                      <template v-if="item.utype == 1">
                        <span v-if="item.type == 1">{{ item.number }} - {{ $t("mobil.bcks") }}</span>
                        <span v-if="item.type == 2">{{ item.company }} {{ $t("mobil.phon") }}</span>
                        <span v-if="item.type == 3">{{ item.company }} {{ $t("mobil.phon2") }}</span>
                        <span v-if="item.type == 4">{{ $t('a1.a27') }}</span>
                      </template>
                    </div>
                    <div class="text-xs text-gray-500 mt-0.5">
                      {{ item.all == 0 ? $t('mobil.income') || 'Kirim' : $t('mobil.expense') || 'Chiqim' }}
                    </div>
                  </div>
                </div>
                <div :class="[
                  'text-sm font-semibold',
                  item.all == 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ item.all == 0 ? '+' : '-' }}{{ $formatNumber(item.amount) }} UZS
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 class="text-gray-900 font-medium mb-1">{{ $t('mobil.no_transactions') || "Operatsiyalar yo'q" }}</h4>
            <p class="text-sm text-gray-500">{{ $t('mobil.no_transactions_desc') || "Hozircha hech qanday operatsiya mavjud emas" }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Payme Modal -->
    <ZModal v-if="paymeModal" :width="420" @closeModal="closePaymeModal">
      <template #modal_body>
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="https://cdn.payme.uz/logo/payme_color.png" alt="Payme" class="h-8 object-contain" />
          </div>
          <h3 class="text-lg font-bold text-gray-900">{{ $t("mobil.payme") }}</h3>
        </div>
        <div class="space-y-4">
          <div>
            <input
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              :placeholder="$t('placeholder.summo')"
              v-model="payme"
              @keyup="keyupSum"
            />
          </div>
          <button
            @click="eventPayme"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            {{ $t("mobil.hisobni") }}
          </button>
        </div>
      </template>
    </ZModal>

    <!-- Click Modal -->
    <ZModal v-if="clickModal" :width="420" @closeModal="closeClickModal">
      <template #modal_body>
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="@/assets/img/click2.png" alt="Click" class="h-8 object-contain" />
          </div>
          <h3 class="text-lg font-bold text-gray-900">{{ $t("mobil.clck") }}</h3>
        </div>
        <div class="space-y-4">
          <div>
            <input
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              :placeholder="$t('placeholder.summo')"
              v-model="click_pay"
              @keyup="keyupSum"
            />
          </div>
          <button
            @click="eventClick"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            {{ $t("mobil.hisobni") }}
          </button>
        </div>
      </template>
    </ZModal>

    <!-- Mobile Transfer Modal -->
    <ZModal v-if="mobileModal" :width="420" @closeModal="closeModal">
      <template #modal_body>
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900">{{ $t("mobil.mobl2") }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ $t("mobil.transfer_desc") || "Boshqa foydalanuvchiga o'tkazish" }}</p>
        </div>
        <div class="space-y-4">
          <div>
            <input
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              @keydown.enter="getUsersDd"
              v-mask="'######/AA'"
              :placeholder="$t('placeholder.idd')"
              v-model="mobile.userId"
            />
            <p v-if="name" :class="[
              'text-sm mt-2 px-3 py-2 rounded-lg',
              name === $t('a1.a78') || name === $t('a1.a77') ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
            ]">
              {{ name }}
            </p>
          </div>
          <div>
            <input
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              type="text"
              :placeholder="$t('placeholder.summo')"
              v-model="mobile.price"
              @keyup="keyupSum"
            />
          </div>
          <button
            @click="eventMobile"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            {{ $t("mobil.transfers") }}
          </button>
        </div>
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
      dds: { amount: 0 },
      clickModal: false,
      click_pay: "",
      mobileModal: false,
      debounceTimer: null,
      mobile: { price: "", userId: "" },
    };
  },

  async mounted() {
    this.initializeUser();
    this.setBreadcrumbs();
    await this.fetchAccountData();
    await this.fetchUserData();

    this.initStorageSync();
    this.waitForSocketAndEmit(true);
  },

  watch: {
    "mobile.userId": {
      immediate: true,
      handler(newValue) { this.handleUserIdChange(newValue); },
    },
  },

  methods: {
    initializeUser() {
      if (this.$auth.user.is_active === 1 && this.$auth.user.is_contract === 0) {
        this.$router.push(this.localePath({ name: 'universal_contract' }));
      }
    },

    initStorageSync() {
      window.addEventListener("storage", (event) => {
        if (event.key === "user_balance") {
          this.dds.amount = parseFloat(event.newValue || 0);
        }
      });
      const storedBalance = localStorage.getItem("user_balance");
      if (storedBalance) this.dds.amount = parseFloat(storedBalance);
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
      const links = [{ title: this.$t('mobil.title'), name: "mobil-hisob" }];
      this.$store.commit("changeBreadCrumb", links);
    },

    async fetchAccountData() {
      try {
        const response = await this.$axios.$get("/home/hisob");
        this.data = response.data;
      } catch (error) {
        this.$toast.error(this.$t('errors.loadFailed') || 'Failed to load account data');
      }
    },

    async fetchUserData() {
      try {
        const response = await this.$axios.$get("/user/me");
        this.userData = response.data;
        this.line = this.userData.cnt;
      } catch (error) {
        this.$toast.error(this.$t('errors.loadFailed') || 'Failed to load user data');
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

    closePaymeModal() { this.paymeModal = false; this.payme = ""; },
    closeClickModal() { this.clickModal = false; this.click_pay = ""; },

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
      if (amount < 1000) return this.$toast.error($nuxt.$t("a1.a79"));
      const teene = amount * 100;
      const str = `m=62fa657ea12ad7a48f4b2dd9;ac.user_id=${this.$auth.user.uid};a=${teene};c=https://zerox.uz/mobil-hisob`;
      const link = "https://checkout.paycom.uz/" + btoa(str);
      window.location = link;
    },

    eventClick() {
      const amount = this.click_pay.split(" ").join("");
      if (amount < 1000) return this.$toast.error($nuxt.$t("a1.a79"));
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
              this.$root.$emit("update-header-balance", {
                balance: data.amount.balance,
                notifications: data.notification || [],
              });
            }
          });
        }

        if (response.data.message === "enouth-money") return this.$toast.error($nuxt.$t("a1.a51"));
        if (response.data.message === "all-user") return this.$toast.error($nuxt.$t("a1.a81"));
        if (response.data.message === "not-user") return this.$toast.error($nuxt.$t("a1.a53"));

        this.mobileModal = false;
        this.mobile.userId = "";
        this.mobile.price = "";
        this.$toast.success($nuxt.$t("a1.a82"));
      } catch (e) {
        this.$toast.error($nuxt.$t("a1.a42"));
      }
    },

    keyupSum(e) { e.target.value = this.formatPrice(e.target.value); },
    setUserId(e) { this.mobile.userId = e.target.value.toUpperCase(); },

    isActivModal(txt) {
      this.Payme = txt === "Payme";
      this.Click = txt === "Click";
      this.Mobil = txt === "Mobil";
    },
  },
};
</script>
