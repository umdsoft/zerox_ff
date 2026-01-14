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
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('a1.a06') }}</h3>
        <p class="text-sm text-gray-500 mb-6">{{ $t('cabinet.logout_confirm_desc') || "Hisobingizdan chiqishni tasdiqlaysizmi?" }}</p>
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
            <p class="text-sm text-gray-500 mt-1">{{ $t('cabinet.subtitle') || "Profil ma'lumotlaringiz" }}</p>
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
                <svg v-else class="w-16 h-16 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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
                <span class="text-sm text-gray-500">{{ $t('transfer.id') }}</span>
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
            <p class="text-sm text-gray-500 mt-0.5">{{ $t('cabinet.personal_info_desc') || "Ro'yxatdan o'tish ma'lumotlari" }}</p>
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
                <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('a1.a30') }}</div>
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
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('user.tel') }}</div>
                    <div class="text-sm font-semibold text-gray-900">{{ user.phone || '-' }}</div>
                  </div>
                  <nuxt-link
                    :to="localePath({ name: 'rephone' })"
                    class="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </nuxt-link>
                </div>
              </div>

              <!-- Ro'yxatdan o'tgan vaqti -->
              <div class="bg-gray-50 rounded-xl p-4 sm:col-span-2">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('a1.a12') }}</div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ dateFormat(user.created_at) }}
                  <span v-if="$i18n.locale === 'uz' || $i18n.locale === 'kr'">{{ $t('user.year') }}</span>
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
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('user.tel') }}</div>
                    <div class="text-sm font-semibold text-gray-900">{{ user.phone || '-' }}</div>
                  </div>
                  <nuxt-link
                    :to="localePath({ name: 'rephone' })"
                    class="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                  </nuxt-link>
                </div>
              </div>

              <!-- Ro'yxatdan o'tgan vaqti -->
              <div class="bg-gray-50 rounded-xl p-4 sm:col-span-2">
                <div class="text-xs font-medium text-blue-600 mb-1">{{ $t('a1.a12') }}</div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ dateFormat(user.created_at) }}
                  <span v-if="$i18n.locale === 'uz' || $i18n.locale === 'kr'">{{ $t('user.year') }}</span>
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
import dateformat from 'dateformat';
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
        // Xatolik bo'lsa ham login sahifasiga o'tkazish
        console.error('[Cabinet] Logout error:', err);
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
      const url = `https://pdf.zerox.uz/oferta.php?id=${userId}&lang=${this.$i18n.locale}&download=0`;
      window.location.href = url;
    },

    /**
     * Modal holatini almashtirish
     */
    toggleModal() {
      this.isModalVisible = !this.isModalVisible;
    },

    /**
     * Sanani formatlash
     * @param {string|Date} date - Sana
     * @returns {string} Formatlangan sana
     */
    dateFormat(date) {
      if (!date) {
        return '-';
      }
      try {
        const formatted = dateformat(date, 'isoDate');
        return formatted.split('-').reverse().join('.');
      } catch {
        return '-';
      }
    },
  },
};
</script>
