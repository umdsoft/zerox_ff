<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
    <!-- Header Card -->
    <div class="max-w-7xl mx-auto mb-6">
      <div :class="[
        'rounded-2xl p-6 shadow-lg',
        isDebitor ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-green-600 to-green-700'
      ]">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button
              @click="$router.go(-1)"
              class="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-white">{{ pageTitle }}</h1>
            </div>
          </div>
          <div class="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content with Sidebar Layout -->
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-6">

        <!-- Left Sidebar -->
        <div class="w-full lg:w-80 flex-shrink-0">
          <div class="lg:sticky lg:top-6 space-y-4">
            <!-- Search Box -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {{ $t('searching') }}
              </h3>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  @input="debouncedSearch"
                  type="text"
                  :placeholder="$t('treaded.search_placeholder')"
                  class="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all text-sm"
                  :class="isDebitor ? 'focus:ring-blue-500' : 'focus:ring-green-500'"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    v-if="searchQuery"
                    @click="clearSearch"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div v-else-if="isSearching" class="w-5 h-5">
                    <svg class="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Box -->
            <div :class="[
              'rounded-2xl p-5 border',
              isDebitor ? 'bg-blue-50 border-blue-100' : 'bg-green-50 border-green-100'
            ]">
              <div class="flex items-start space-x-3">
                <div :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  isDebitor ? 'bg-blue-100' : 'bg-green-100'
                ]">
                  <svg :class="['w-5 h-5', isDebitor ? 'text-blue-600' : 'text-green-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 :class="['font-semibold mb-1', isDebitor ? 'text-blue-800' : 'text-green-800']">
                    {{ $t('treaded.info_title') }}
                  </h4>
                  <p :class="['text-sm leading-relaxed', isDebitor ? 'text-blue-600' : 'text-green-600']">
                    {{ infoTip }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Stats Card -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div class="flex items-center justify-between">
                <span class="text-gray-500 text-sm">{{ $t('treaded.found') }}</span>
                <span :class="[
                  'text-2xl font-bold',
                  isDebitor ? 'text-blue-600' : 'text-green-600'
                ]">{{ filteredUsers.length }}</span>
              </div>
              <p class="text-gray-400 text-xs mt-1">{{ $t('treaded.users_count') }}</p>
            </div>
          </div>
        </div>

        <!-- Right Content - Users List -->
        <div class="flex-1 min-w-0">
          <!-- Loading State -->
          <div v-if="isLoading" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div class="flex flex-col items-center justify-center">
              <div :class="[
                'w-12 h-12 rounded-full border-4 border-t-transparent animate-spin',
                isDebitor ? 'border-blue-500' : 'border-green-500'
              ]"></div>
              <p class="mt-4 text-gray-500">{{ $t('messages.loading') }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredUsers.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div class="flex flex-col items-center justify-center text-center py-8">
              <div :class="[
                'w-20 h-20 rounded-full flex items-center justify-center mb-4',
                isDebitor ? 'bg-blue-50' : 'bg-green-50'
              ]">
                <svg :class="['w-10 h-10', isDebitor ? 'text-blue-400' : 'text-green-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ $t('treaded.empty_title') }}</h3>
              <p class="text-gray-500 max-w-sm mb-6">{{ $t('treaded.empty_desc') }}</p>
              <nuxt-link
                :to="localePath({ name: 'search-physical', query: { type: searchType } })"
                :class="[
                  'px-6 py-3 rounded-xl text-white font-medium transition-colors',
                  isDebitor ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                ]"
              >
                {{ $t('treaded.search_new') }}
              </nuxt-link>
            </div>
          </div>

          <!-- Users Cards -->
          <div v-else class="space-y-4">
            <div
              v-for="user in filteredUsers"
              :key="user.id || user.uid"
              class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
            >
              <!-- User Header -->
              <div
                @click="toggleUser(user.id || user.uid)"
                class="p-4 sm:p-5 cursor-pointer"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <!-- Avatar - Fixed icon -->
                    <div :class="[
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      isDebitor ? 'bg-blue-100' : 'bg-green-100'
                    ]">
                      <!-- Legal entity (yuridik shaxs) -->
                      <svg v-if="user.type == 1" :class="['w-6 h-6', isDebitor ? 'text-blue-600' : 'text-green-600']" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                      </svg>
                      <!-- Physical person (jismoniy shaxs) -->
                      <svg v-else :class="['w-6 h-6', isDebitor ? 'text-blue-600' : 'text-green-600']" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <!-- User Info -->
                    <div>
                      <h3 class="font-semibold text-gray-800">
                        {{ getUserName(user) }}
                      </h3>
                      <div class="flex items-center space-x-2 mt-1">
                        <span :class="[
                          'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium',
                          isDebitor ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                        ]">
                          ID: {{ user.uid || user.id || '-' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- Arrow -->
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300',
                    isDebitor ? 'bg-blue-50' : 'bg-green-50',
                    expandedUsers.includes(user.id || user.uid) ? 'rotate-180' : ''
                  ]">
                    <svg :class="['w-5 h-5', isDebitor ? 'text-blue-600' : 'text-green-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Expanded Content -->
              <div v-show="expandedUsers.includes(user.id || user.uid)" class="border-t border-gray-100">
                <div class="p-4 sm:p-5 bg-gray-50">
                  <!-- Info Text -->
                  <div :class="[
                    'p-4 rounded-xl mb-4',
                    isDebitor ? 'bg-blue-50 border border-blue-100' : 'bg-green-50 border border-green-100'
                  ]">
                    <div class="flex items-start space-x-3">
                      <svg :class="['w-5 h-5 mt-0.5 flex-shrink-0', isDebitor ? 'text-blue-500' : 'text-green-500']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p :class="['text-sm', isDebitor ? 'text-blue-700' : 'text-green-700']">
                        {{ getUserStatus(user) === 4 ? $t('comp.teet') : $t('comp.teet4') }}
                      </p>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <!-- Request Info Button - White background -->
                    <button
                      v-if="getUserStatus(user) !== 1"
                      @click.stop="seeInfo(user)"
                      :disabled="getUserStatus(user) === 4"
                      :class="[
                        'flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all bg-white border-2',
                        getUserStatus(user) === 4
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : isDebitor
                            ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                            : 'border-green-600 text-green-600 hover:bg-green-50'
                      ]"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{{ $t('process.see2') }}</span>
                    </button>

                    <!-- See Info Button (when accepted) -->
                    <button
                      v-if="getUserStatus(user) === 1"
                      @click.stop="sendUrl(user)"
                      class="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{{ $t('process.see1') }}</span>
                    </button>

                    <!-- Create Contract Button - Blue/Green background -->
                    <nuxt-link
                      :to="localePath({ name: actionRoute, params: actionRouteParams, query: { id: user?.uid || user?.id } })"
                      :class="[
                        'flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all',
                        isDebitor
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      ]"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{{ isDebitor ? $t('mqarz') : $t('mqarz2') }}</span>
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "auth",

  data: () => ({
    users: [],
    reservedUsers: [], // Asl ro'yxat - qidiruv uchun saqlanadi
    expandedUsers: [],
    searchQuery: '',
    userStatuses: {},
    isLoading: true,
    isSearching: false,
    searchTimeout: null,
  }),

  async mounted() {
    this.socket = this.$nuxtSocket({
      name: "home",
      channel: "/",
      secure: true,
    });
    await this.getThreadedUsers();
  },

  computed: {
    searchType() {
      return this.$route.query.searchtype || 'debitor';
    },
    isDebitor() {
      return this.searchType === 'debitor';
    },
    pageTitle() {
      return this.isDebitor
        ? this.$t('treaded.debitor_title')
        : this.$t('treaded.creditor_title');
    },
    pageSubtitle() {
      return this.isDebitor
        ? this.$t('treaded.debitor_subtitle')
        : this.$t('treaded.creditor_subtitle');
    },
    infoTip() {
      return this.isDebitor
        ? this.$t('treaded.debitor_info')
        : this.$t('treaded.creditor_info');
    },
    actionRoute() {
      return 'money-type';
    },
    actionRouteParams() {
      return { type: this.isDebitor ? 'give' : 'take' };
    },
    // Local filtering for better UX
    filteredUsers() {
      if (!this.searchQuery.trim()) {
        return this.users;
      }
      const query = this.searchQuery.toLowerCase().trim();
      return this.users.filter(user => {
        const name = this.getUserName(user).toLowerCase();
        const uid = (user.uid || user.id || '').toString().toLowerCase();
        return name.includes(query) || uid.includes(query);
      });
    },
  },

  methods: {
    getUserName(user) {
      if (user.type == 1) {
        return user.company || '-';
      }
      const parts = [user.last_name, user.first_name, user.middle_name].filter(Boolean);
      return parts.length > 0 ? parts.join(' ') : '-';
    },

    getUserStatus(user) {
      const key = user.id || user.uid;
      return this.userStatuses[key] || 3;
    },

    setUserStatus(user, status) {
      const key = user.id || user.uid;
      this.$set(this.userStatuses, key, status);
    },

    toggleUser(userId) {
      const idx = this.expandedUsers.indexOf(userId);
      if (idx > -1) {
        this.expandedUsers = [];
      } else {
        this.expandedUsers = [userId];
      }
    },

    clearSearch() {
      this.searchQuery = '';
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      // Asl ro'yxatni qaytarish
      if (this.reservedUsers.length > 0) {
        this.users = [...this.reservedUsers];
      }
    },

    // Debounced search - kutish bilan qidirish
    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // 500ms kutish - foydalanuvchi yozishni to'xtatgach qidiradi
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 500);
    },

    async performSearch() {
      const query = this.searchQuery.trim();

      // Bo'sh bo'lsa lokal filtrlash ishlaydi
      if (!query) {
        // Bo'sh bo'lsa dastlabki ro'yxatni qaytarish
        await this.getThreadedUsers();
        return;
      }

      // Agar query 2 ta belgidan kam bo'lsa, faqat lokal filtr
      if (query.length < 2) {
        return;
      }

      this.isSearching = true;

      try {
        const response = await this.$axios.get(
          `/contract/oldi-bardi/search?search=${encodeURIComponent(query)}`
        );
        if (response.status == 200) {
          // API javobidagi ma'lumotlarni saqlash
          const searchResults = response.data.data || [];
          // Agar uid mavjud bo'lmasa, asl ro'yxatdan olish
          this.users = searchResults.map(searchUser => {
            // Asl ro'yxatdan to'liq ma'lumotlarni topish
            const originalUser = this.reservedUsers.find(u => u.id === searchUser.id);
            return originalUser ? { ...originalUser, ...searchUser } : searchUser;
          });
          this.initUserStatuses();
        }
      } catch (e) {
        // Xatolik bo'lsa lokal filtrlash ishlatiladi - silent fail
      } finally {
        this.isSearching = false;
      }
    },

    async getThreadedUsers() {
      this.isLoading = true;
      try {
        const response = await this.$axios.get(`/contract/oldi-bardi`);
        if (response.status == 200) {
          const allUsers = (response.data.data || []).filter((item) => item.id != null);
          this.users = allUsers;
          this.reservedUsers = [...allUsers]; // Asl ro'yxatni saqlash
          this.initUserStatuses();
        }
      } catch (e) {
        this.$toast.error(this.$t("a1.a42"));
      } finally {
        this.isLoading = false;
      }
    },

    initUserStatuses() {
      this.users.forEach((user) => {
        const key = user.id || user.uid;
        if (!this.userStatuses[key]) {
          this.$set(this.userStatuses, key, 3);
        }
      });
    },

    getSockNot() {
      this.socket.emit(
        "notification",
        { userId: this.$auth.user.id },
        (data) => {}
      );
    },

    sendUrl(user) {
      if (this.isDebitor) {
        this.$router.push(this.localePath({ name: 'search-debitor-result' }));
      } else {
        this.$router.push(this.localePath({ name: 'search-creditor-result' }));
      }
    },

    async seeInfo(user) {
      this.setUserStatus(user, 4);
      const data = {
        debitor: this.$auth.user.id,
        creditor: this.$auth.user.id,
        reciver: user.id,
      };
      try {
        const response = await this.$axios.post("notification/reqquest", data);
        if (response.status == 201) {
          this.$toast.success(this.$t('a1.a21'));
          this.getSockNot();
          this.$router.push(this.localePath({
            name: 'index'
          }));
        }
      } catch (e) {
        this.setUserStatus(user, 3);
        this.$toast.error(this.$t('a1.a53'));
      }
    },
  },

  beforeDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },
};
</script>
