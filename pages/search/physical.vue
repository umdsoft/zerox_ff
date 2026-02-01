<template>
  <div class="pb-8">
    <!-- Header Card -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div class="px-6 py-5">
        <div class="flex items-center gap-4">
          <button
            @click="$router.go(-1)"
            class="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ pageTitle }}</h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Card -->
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6">
          <!-- Search Icon -->
          <div class="flex justify-center mb-6">
            <div :class="[
              'w-16 h-16 rounded-full flex items-center justify-center',
              isDebitor ? 'bg-blue-100' : 'bg-green-100'
            ]">
              <svg :class="['w-8 h-8', isDebitor ? 'text-blue-600' : 'text-green-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Search Form -->
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- ID Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('transfer.id') }}</label>
                <input
                  :value="id"
                  v-mask="'######/AA'"
                  @input="setUserId"
                  @change="disabled"
                  type="text"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors uppercase"
                  :placeholder="$t('placeholder.id')"
                />
              </div>

              <!-- Birthday Input -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('a1.a10') }}</label>
                <date-picker
                  v-model="time1"
                  @change="disabled"
                  value-type="YYYY-MM-DD"
                  format="DD.MM.YYYY"
                  :placeholder="$t('placeholder.birghtday')"
                  :disabled-date="disabledDates"
                  class="w-full search-datepicker"
                />
              </div>
            </div>

            <!-- Search Button -->
            <button
              @click="search"
              :disabled="isLoading"
              :class="[
                'w-full py-3.5 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2',
                isDebitor
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
                  : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
              ]"
            >
              <svg v-if="isLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {{ $t("searching") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Info Box -->
      <div v-if="!user" :class="['mt-6 border rounded-2xl p-4', isDebitor ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100']">
        <div class="flex items-start space-x-3">
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', isDebitor ? 'bg-blue-100' : 'bg-green-100']">
            <svg :class="['w-4 h-4', isDebitor ? 'text-blue-600' : 'text-green-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p :class="['text-sm', isDebitor ? 'text-blue-700' : 'text-green-700']">
            {{ searchTip }}
          </p>
        </div>
      </div>

      <!-- User Result Card -->
      <div v-if="user" class="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6">
          <!-- User Info -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div class="flex items-center gap-4">
              <div :class="[
                'w-14 h-14 rounded-full flex items-center justify-center',
                isDebitor ? 'bg-blue-100' : 'bg-green-100'
              ]">
                <svg :class="['w-7 h-7', isDebitor ? 'text-blue-600' : 'text-green-600']" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ user.last_name }} {{ user.first_name }} {{ user.middle_name }}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class="px-2 py-0.5 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
                    ID: {{ user.uid }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr class="border-gray-100 my-4" />

          <!-- Status Text -->
          <div v-if="status === 3" class="mb-4 p-3 bg-gray-50 rounded-xl">
            <p class="text-sm text-gray-600">{{ $t('comp.teet4') }}</p>
          </div>
          <div v-if="status === 4" class="mb-4 p-3 bg-yellow-50 rounded-xl">
            <p class="text-sm text-yellow-700">{{ $t('comp.teet') }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- So'rov yuborish -->
            <button
              v-if="status !== 1"
              @click="seeInfo"
              :disabled="status === 4"
              :class="[
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-colors',
                status === 4
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isDebitor
                    ? 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                    : 'bg-white border-2 border-green-600 text-green-600 hover:bg-green-50'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {{ $t("process.see2") }}
            </button>

            <!-- Natijani ko'rish (agar qabul qilingan bo'lsa) -->
            <button
              v-if="status === 1"
              @click="sendUrl(token)"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ $t("process.see1") }}
            </button>

            <!-- Qarz berish / Qarz olish tugmasi -->
            <nuxt-link
              v-if="user?.id"
              :to="localePath({ name: actionRoute, params: actionRouteParams, query: { id: user?.uid || user?.id } })"
              :class="[
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-colors',
                isDebitor
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ actionButtonText }}
            </nuxt-link>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  middleware: "auth",

  data() {
    return {
      id: null,
      time1: null,
      birthday: "",
      user: null,
      isDisabled: true,
      isLoading: false,
      token: null,
      status: 3, // 1 - accepted, 2 - rejected, 3 - start, 4 - waiting
      socket: null,
    };
  },

  computed: {
    searchType() {
      return this.$route.query.type || 'debitor';
    },

    isDebitor() {
      return this.searchType === 'debitor';
    },

    pageTitle() {
      return this.isDebitor
        ? this.$t('search.debitor_search_title') || "Qarzdorni qidirish"
        : this.$t('search.creditor_search_title') || "Kreditorni qidirish";
    },

    pageSubtitle() {
      return this.isDebitor
        ? this.$t('search.debitor_search_subtitle') || "ID va tug'ilgan sana orqali qidiring"
        : this.$t('search.creditor_search_subtitle') || "ID va tug'ilgan sana orqali qidiring";
    },

    actionRoute() {
      return 'money-type';
    },

    actionRouteParams() {
      return { type: this.isDebitor ? 'give' : 'take' };
    },

    actionButtonText() {
      return this.isDebitor ? this.$t("process.see5") : this.$t("process.see4");
    },

    searchTip() {
      return this.isDebitor
        ? this.$t('search.debitor_search_tip')
        : this.$t('search.creditor_search_tip');
    },

    resultRoute() {
      return 'search-result-type';
    },

    resultRouteParams() {
      return { type: this.isDebitor ? 'debitor' : 'creditor' };
    },
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      name: "home",
      channel: "/",
      secure: true,
    });

    this.setupDatepickerInput();
  },

  methods: {
    setupDatepickerInput() {
      setTimeout(() => {
        let input = document.querySelector(".mx-input");
        if (!input) return;

        input.addEventListener("keydown", (e) => {
          let key = parseInt(e.key);
          if (e.which === 8 && e.target.value.charAt(e.target.value.length - 1) === ".") {
            e.target.value = e.target.value.slice(0, e.target.value.length - 2);
            e.preventDefault();
          }
          if (!((Number.isInteger(key) && e.target.value.length < 10) || e.which === 8)) {
            e.preventDefault();
          }
        });

        input.addEventListener("keyup", (e) => {
          let value = e.target.value.replace(/[^0-9]/g, "");
          let length = value.length;

          if (length >= 8) {
            e.target.value = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4, 8)}`;
          } else if (length >= 4) {
            e.target.value = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4, length)}`;
          } else if (length >= 2) {
            e.target.value = `${value.slice(0, 2)}.${value.slice(2, length)}`;
          }
        });
      }, 500);
    },

    setUserId(e) {
      this.id = e.target.value.toUpperCase();
    },

    disabled() {
      this.isDisabled = !(this.id && this.time1);
    },

    async getSockNot() {
      this.socket?.emit("notification", { userId: this.$auth.user.id }, () => {});
    },

    async seeInfo() {
      this.status = 4;
      const data = {
        debitor: this.$auth.user.id,
        creditor: this.$auth.user.id,
        reciver: this.user.id,
      };

      try {
        const response = await this.$axios.post("notification/reqquest", data);
        if (response.status === 201) {
          this.$emit("clickRequest", true);
          this.getSockNot();
          this.$toast.success(this.$t('a1.a21'));
          this.$router.push(this.localePath({ name: 'index' }));
        }
      } catch (e) {
        this.user = null;
        this.$toast.error(this.$t('a1.a53'));
      }
    },

    async search() {
      if (!this.id) {
        return this.$toast.error(this.$t('a1.a59'));
      }
      if (!this.time1) {
        return this.$toast.error(this.$t('a1.a59'));
      }

      this.isLoading = true;
      const dateString = this.time1.split("-").reverse().join(".");
      const id = this.id.split("/").join("");
      this.birthday = dateString;

      try {
        const response = await this.$axios.post("user/search", {
          id: id,
          brithday: this.birthday,
          type: 1,
        });

        if (response.status === 200 && response.data.message === "brithday-not-match") {
          return this.$toast.error(this.$t('a1.a99'));
        }

        if (response.status === 200 && response.data.message === "not-found") {
          return this.$toast.error(this.$t('a1.a100'));
        }

        if (response.status === 200) {
          if (response.data.user.id === this.$auth.user.id) {
            return this.$toast.error(this.$t('a1.a58'));
          }
          this.user = response.data.user;
          this.$auth.user2 = this.user;
          this.status = 3;
        }
      } catch (e) {
        this.$toast.error(this.$t('a1.a53'));
      } finally {
        this.isLoading = false;
      }
    },

    sendUrl(token) {
      this.$auth.user2 = this.user;
      this.$router.push(this.localePath({
        name: this.resultRoute,
        params: this.resultRouteParams,
        query: { secret: token }
      }));
    },
  },
};
</script>

<style scoped>
.search-datepicker {
  width: 100%;
}

:deep(.mx-datepicker) {
  width: 100%;
}

:deep(.mx-input) {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  transition: border-color 0.2s;
  height: auto;
}

:deep(.mx-input:focus) {
  border-color: #3b82f6;
  outline: none;
}
</style>
