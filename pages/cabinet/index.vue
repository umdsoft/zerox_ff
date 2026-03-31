<template>
  <div class="pb-8">
    <!-- Logout Confirmation Modal -->
    <ZModal
      v-model="isModalVisible"
      hide-header
      size="sm"
      @close="isModalVisible = false"
    >
      <div class="text-center py-2">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ $t('a1.a06') }}</h3>
        <div class="flex gap-3">
          <button
            @click="isModalVisible = false"
            class="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            {{ $t('a1.a013') }}
          </button>
          <button
            @click="handleLogout"
            class="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
          >
            {{ $t('a1.a07') }}
          </button>
        </div>
      </div>
    </ZModal>

    <!-- Header Card -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div class="px-6 py-5">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ $t('cabinet.title') || "Shaxsiy kabinet" }}</h1>
          </div>
          <button
            @click="toggleModal"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {{ $t('a1.a05') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Profile Card -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="p-6">
            <!-- Avatar -->
            <div class="flex flex-col items-center">
              <div :class="[
                'w-28 h-28 rounded-full flex items-center justify-center',
                user.type === 1 ? 'bg-blue-100' : (user.gender === 2 ? 'bg-pink-100' : 'bg-blue-100')
              ]">
                <!-- Yuridik shaxs -->
                <svg v-if="user.type === 1" class="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
                <!-- Erkak -->
                <svg v-else-if="user.gender === 1 || user.gender === null" class="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <!-- Ayol -->
                <svg v-else class="w-16 h-16 text-pink-500" fill="currentColor" viewBox="0 0 141 155">
                  <path d="M0 0 C1.277 -0.037 2.555 -0.075 3.871 -0.113 C8.168 0.382 10.269 1.555 13.563 4.313 C14.058 5.798 14.058 5.798 14.563 7.313 C15.284 7.416 16.006 7.519 16.75 7.625 C20.806 8.616 23.535 10.047 26.188 13.313 C30.948 23.7 31.007 34.045 31.09 45.281 C31.239 53.405 31.434 59.039 37.25 65.125 C38.013 65.847 38.776 66.569 39.563 67.313 C39.563 67.973 39.563 68.633 39.563 69.313 C38.903 69.313 38.243 69.313 37.563 69.313 C37.16 70.21 37.16 70.21 36.75 71.125 C33.033 77.971 25.517 80.52 18.48 82.797 C16.563 83.313 16.563 83.313 14.563 83.313 C14.563 84.633 14.563 85.953 14.563 87.313 C15.223 87.313 15.883 87.313 16.563 87.313 C16.563 87.973 16.563 88.633 16.563 89.313 C17.078 89.539 17.594 89.766 18.125 90 C20.281 91.161 22.284 92.384 24.313 93.75 C24.926 94.161 25.54 94.572 26.172 94.996 C26.631 95.431 27.09 95.865 27.563 96.313 C27.563 97.303 27.563 98.293 27.563 99.313 C28.369 99.547 29.176 99.782 30.008 100.023 C34.39 101.613 38.347 103.719 42.438 105.938 C43.221 106.358 44.005 106.778 44.813 107.211 C46.731 108.241 48.647 109.276 50.563 110.313 C49.137 114.59 45.963 116.188 42.375 118.625 C41.656 119.114 40.937 119.603 40.197 120.107 C26.716 129.039 13.249 132.719 -2.875 132.625 C-3.883 132.62 -4.89 132.615 -5.929 132.61 C-24.327 132.32 -40.899 124.674 -54.438 112.313 C-53.235 108.706 -52.547 108.534 -49.289 106.832 C-48.449 106.391 -47.608 105.949 -46.742 105.494 C-45.858 105.042 -44.974 104.591 -44.063 104.125 C-43.186 103.662 -42.309 103.198 -41.406 102.721 C-34.841 99.313 -34.841 99.313 -31.438 99.313 C-31.438 97.993 -31.438 96.673 -31.438 95.313 C-29.793 93.934 -29.793 93.934 -27.625 92.75 C-25.393 91.51 -23.603 90.479 -21.801 88.66 C-20.438 87.313 -20.438 87.313 -18.438 87.313 C-18.761 84.783 -18.761 84.783 -20.438 82.313 C-22.522 81.875 -24.61 81.45 -26.711 81.098 C-32.212 79.514 -37.127 76.021 -41.438 72.313 C-42.461 70.375 -42.461 70.375 -42.438 68.313 C-41.258 65.805 -41.258 65.805 -39.563 63.188 C-39.008 62.319 -38.454 61.45 -37.883 60.555 C-37.406 59.815 -36.929 59.075 -36.438 58.313 C-35.032 55.501 -35.292 53.119 -35.262 49.977 C-35.238 48.684 -35.214 47.391 -35.189 46.059 C-35.155 44.014 -35.125 41.97 -35.112 39.925 C-35.038 30.67 -33.959 22.904 -30.438 14.313 C-29.778 14.313 -29.118 14.313 -28.438 14.313 C-28.32 13.417 -28.32 13.417 -28.199 12.504 C-26.462 7.505 -19.587 4.954 -15.188 2.5 C-10.195 0.344 -5.408 0.103 0 0 Z" transform="translate(72.4375,18.6875)"/>
                </svg>
              </div>

              <!-- Name -->
              <div class="mt-4 text-center">
                <h2 v-if="user.type === 2" class="text-lg font-bold text-gray-900">
                  {{ user.last_name }} {{ user.first_name }}
                </h2>
                <h2 v-else class="text-lg font-bold text-gray-900">
                  {{ user.company }}
                </h2>
                <p v-if="user.type === 2 && user.middle_name" class="text-sm text-gray-500">{{ user.middle_name }}</p>

                <!-- Status Badge -->
                <span
                  v-if="user.is_active !== 1"
                  class="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                  {{ $t('a1.a101') }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  {{ $t('cabinet.verified') || "Tasdiqlangan" }}
                </span>
              </div>
            </div>

            <!-- User Info -->
            <div class="mt-6 space-y-3">
              <div class="flex items-center justify-between py-3 border-b border-gray-100">
                <span class="text-sm text-gray-500">{{ cabinetLabels.idLabel }}</span>
                <span class="text-sm font-semibold text-blue-600">{{ user.uid }}</span>
              </div>
              <div class="flex items-center justify-between py-3">
                <span class="text-sm text-gray-500">{{ $t('cabinet.rating') || "Reyting" }}</span>
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span class="text-sm font-semibold text-gray-900">{{ user.rating || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 space-y-3">
              <nuxt-link
                v-if="user.type === 2"
                :to="localePath({ name: 'repassword' })"
                class="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                {{ $t('a1.a08') }}
              </nuxt-link>

              <button
                v-if="$auth.user && $auth.user.is_active === 1 && $auth.user.is_contract !== 0"
                @click="openOferta(user.uid)"
                class="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                {{ $t('a1.a09') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Details -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900">{{ $t('cabinet.personal_info') || "Shaxsiy ma'lumotlar" }}</h3>
          </div>

          <!-- Fiz shaxs -->
          <div v-if="user.type === 2" class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Tug'ilgan sana -->
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('a1.a10') }}</div>
                <div class="text-sm font-semibold text-gray-900">{{ user.brithday || '-' }}</div>
              </div>

              <!-- Pasport -->
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ cabinetLabels.passportLabel }}</div>
                <div class="text-sm font-semibold text-gray-900">{{ user.passport || '-' }}</div>
              </div>

              <!-- JShShIR -->
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('a1.a31') }}</div>
                <div class="text-sm font-semibold text-gray-900">{{ user.pinfl || '-' }}</div>
              </div>

              <!-- Manzil -->
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('a1.a11') }}</div>
                <div class="text-sm font-semibold text-gray-900">
                  <template v-if="user.is_active === 1">
                    {{ user.region }}, {{ user.district }}, {{ user.address }}
                  </template>
                  <template v-else>-</template>
                </div>
              </div>

              <!-- Telefon -->
              <div class="bg-gray-50 rounded-xl p-4 sm:col-span-2">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ cabinetLabels.phoneLabel }}</div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-gray-900">{{ user.phone || '-' }}</span>
                  <nuxt-link
                    :to="localePath({ name: 'rephone' })"
                    class="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </nuxt-link>
                </div>
              </div>

              <!-- Ro'yxatdan o'tgan vaqti -->
              <div class="bg-gray-50 rounded-xl p-4 sm:col-span-2">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('a1.a12') }}</div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ $formatDate(user.created_at) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Yuridik shaxs -->
          <div v-else class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Rahbar -->
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('cabinet.director') || "Rahbar" }}</div>
                <div class="text-sm font-semibold text-gray-900">{{ user.director || '-' }}</div>
              </div>

              <!-- STIR -->
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('cabinet.stir') || "STIR" }}</div>
                <div class="text-sm font-semibold text-gray-900">{{ user.stir || '-' }}</div>
              </div>

              <!-- Yuridik manzil -->
              <div class="bg-gray-50 rounded-xl p-4 sm:col-span-2">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('cabinet.legal_address') || "Yuridik manzil" }}</div>
                <div class="text-sm font-semibold text-gray-900">{{ user.address || '-' }}</div>
              </div>

              <!-- Telefon -->
              <div class="bg-gray-50 rounded-xl p-4 sm:col-span-2">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ cabinetLabels.phoneLabel }}</div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-gray-900">{{ user.phone || '-' }}</span>
                  <nuxt-link
                    :to="localePath({ name: 'rephone' })"
                    class="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </nuxt-link>
                </div>
              </div>

              <!-- Ro'yxatdan o'tgan vaqti -->
              <div class="bg-gray-50 rounded-xl p-4 sm:col-span-2">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('a1.a12') }}</div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ $formatDate(user.created_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script>
/**
 * Cabinet Page - User Profile
 * Foydalanuvchi shaxsiy kabineti
 */
import ZModal from '@/components/ui/ZModal.vue';
import { STORAGE_KEYS } from '@/utils/constants';

export default {
  name: 'CabinetPage',

  components: {
    ZModal,
  },

  middleware: 'auth',

  data() {
    return {
      isModalVisible: false,
      user: null,
      isLoading: false,
      error: null,
    };
  },

  computed: {
    /**
     * Foydalanuvchi yuridik shaxsmi
     * @returns {boolean}
     */
    isLegalEntity() {
      return this.user?.type === 1;
    },

    /**
     * Foydalanuvchi tasdiqlangan mi
     * @returns {boolean}
     */
    isVerified() {
      return this.user?.is_active === 1;
    },

    /**
     * To'liq ism
     * @returns {string}
     */
    fullName() {
      if (!this.user) {
        return '';
      }
      if (this.isLegalEntity) {
        return this.user.company || '';
      }
      return `${this.user.last_name || ''} ${this.user.first_name || ''}`.trim();
    },

    cabinetLabels() {
      return {
        idLabel: this.$t('page_labels.id_number'),
        passportLabel: this.$t('page_labels.passport_label'),
        phoneLabel: this.$t('page_labels.phone_label'),
      };
    },

    /**
     * To'liq manzil
     * @returns {string}
     */
    fullAddress() {
      if (!this.user || !this.isVerified) {
        return '-';
      }
      const parts = [this.user.region, this.user.district, this.user.address].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : '-';
    },
  },

  async mounted() {
    if (!this.$auth.loggedIn) {
      return this.$router.push(this.localePath({ name: 'auth-login' }));
    }
    await this.fetchUser();
  },

  methods: {
    /**
     * Foydalanuvchi ma'lumotlarini olish
     */
    async fetchUser() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await this.$axios.$get('/user/me');
        this.user = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || this.$t('common.error');
        this.$toast?.error?.(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Tizimdan chiqish
     */
    async handleLogout() {
      const currentLanguage = this.$i18n?.locale || 'uz';

      try {
        // Modal'ni yopish
        this.isModalVisible = false;

        // Socket'ni tozalash
        this.cleanupSocket();

        // LocalStorage'dan foydalanuvchi ma'lumotlarini tozalash
        this.clearUserData();

        // Auth logout
        await this.$auth.logout();

        // Til sozlamalarini saqlash
        this.preserveLanguage(currentLanguage);

        // Login sahifasiga yo'naltirish
        await this.$router.push(this.localePath({ name: 'auth-login' }, currentLanguage));
      } catch (err) {
        // Xatolik bo'lsa ham tokenlarni tozalash va login sahifasiga o'tkazish
        console.error('[Cabinet] Logout error:', err);
        try {
          this.$auth.strategy.token.reset();
          this.$auth.strategy.refreshToken?.reset?.();
        } catch {}
        this.preserveLanguage(currentLanguage);
        this.$router.push(this.localePath({ name: 'auth-login' }, currentLanguage));
      }
    },

    /**
     * Socket ulanishini tozalash
     */
    cleanupSocket() {
      // socketManager orqali
      if (this.$socketManager) {
        try {
          this.$socketManager.disconnect?.();
        } catch (_) {}
      }

      // Legacy fallback
      const socket = this.$root?.socket || this.$socket;
      if (socket) {
        try {
          socket.off?.('recive_notification');
          socket.removeAllListeners?.();
          if (socket.connected) {
            socket.disconnect();
          }
        } catch (_) {}
      }
    },

    /**
     * Foydalanuvchi ma'lumotlarini tozalash
     */
    clearUserData() {
      try {
        localStorage.removeItem('user_balance');
        localStorage.removeItem('user_notifications');
      } catch (_) {}
    },

    /**
     * Til sozlamalarini saqlash
     * @param {string} lang - Til kodi
     */
    preserveLanguage(lang) {
      this.$i18n?.setLocaleCookie?.(lang);
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);

      if (typeof this.$i18n?.setLocale === 'function') {
        this.$i18n.setLocale(lang);
      } else if (this.$i18n) {
        this.$i18n.locale = lang;
      }
    },

    /**
     * Oferta sahifasiga o'tish
     * @param {string|number} userId - Foydalanuvchi ID
     */
    openOferta(userId) {
      if (!userId) {
        return;
      }
      const url = this.$ofertaPdfUrl(userId);
      this.$safeRedirect(url);
    },

    /**
     * Modal holatini almashtirish
     */
    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
