<template>
  <div class="bg-white rounded-2xl shadow-sm">
    <!-- Back (desktop) -->
    <BackButton />

    <!-- PAGE CONTAINER -->
    <div class="max-w-6xl mx-auto px-4 pb-6 mt-safe mt-4 sm:mt-6 md:mt-8">
      <div v-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3 sm:mt-4">
        <!-- LEFT: Profile card -->
        <section class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
          <!-- Avatar -->
          <div class="w-36 h-36 rounded-full bg-gray-100 grid place-items-center overflow-hidden">
            <img v-if="user.image" :src="avatar" alt="avatar" class="w-full h-full object-cover" />
            <template v-else>
              <!-- TYPE/GENDER bo'yicha default avatarlar -->
              <svg v-if="user.type == 2 && user.gender == 1" viewBox="0 0 150 150" class="w-28 h-28" style="color:#3182CE">
                <g clip-path="url(#c0)">
                  <path
                    d="M75 75C98.67 75 117.86 58.21 117.86 37.5S98.67 0 75 0 32.14 16.79 32.14 37.5 51.33 75 75 75Zm-15.3 14.06C26.72 89.06 0 112.44 0 141.3c0 4.81 4.45 8.7 9.94 8.7h130.12c5.49 0 9.94-3.89 9.94-8.7 0-28.86-26.72-52.24-59.7-52.24H59.7Z"
                    fill="currentColor" />
                </g>
                <defs>
                  <clipPath id="c0">
                    <rect width="150" height="150" />
                  </clipPath>
                </defs>
              </svg>

              <svg v-else-if="user.type == 2 && user.gender == 2" viewBox="0 0 141 155" class="w-28 h-28" style="color:#E91E8C">
                <path d="M0 0 C1.277 -0.037 2.555 -0.075 3.871 -0.113 C8.168 0.382 10.269 1.555 13.563 4.313 C14.058 5.798 14.058 5.798 14.563 7.313 C15.284 7.416 16.006 7.519 16.75 7.625 C20.806 8.616 23.535 10.047 26.188 13.313 C30.948 23.7 31.007 34.045 31.09 45.281 C31.239 53.405 31.434 59.039 37.25 65.125 C38.013 65.847 38.776 66.569 39.563 67.313 C39.563 67.973 39.563 68.633 39.563 69.313 C38.903 69.313 38.243 69.313 37.563 69.313 C37.16 70.21 37.16 70.21 36.75 71.125 C33.033 77.971 25.517 80.52 18.48 82.797 C16.563 83.313 16.563 83.313 14.563 83.313 C14.563 84.633 14.563 85.953 14.563 87.313 C15.223 87.313 15.883 87.313 16.563 87.313 C16.563 87.973 16.563 88.633 16.563 89.313 C17.078 89.539 17.594 89.766 18.125 90 C20.281 91.161 22.284 92.384 24.313 93.75 C24.926 94.161 25.54 94.572 26.172 94.996 C26.631 95.431 27.09 95.865 27.563 96.313 C27.563 97.303 27.563 98.293 27.563 99.313 C28.369 99.547 29.176 99.782 30.008 100.023 C34.39 101.613 38.347 103.719 42.438 105.938 C43.221 106.358 44.005 106.778 44.813 107.211 C46.731 108.241 48.647 109.276 50.563 110.313 C49.137 114.59 45.963 116.188 42.375 118.625 C41.656 119.114 40.937 119.603 40.197 120.107 C26.716 129.039 13.249 132.719 -2.875 132.625 C-3.883 132.62 -4.89 132.615 -5.929 132.61 C-24.327 132.32 -40.899 124.674 -54.438 112.313 C-53.235 108.706 -52.547 108.534 -49.289 106.832 C-48.449 106.391 -47.608 105.949 -46.742 105.494 C-45.858 105.042 -44.974 104.591 -44.063 104.125 C-43.186 103.662 -42.309 103.198 -41.406 102.721 C-34.841 99.313 -34.841 99.313 -31.438 99.313 C-31.438 97.993 -31.438 96.673 -31.438 95.313 C-29.793 93.934 -29.793 93.934 -27.625 92.75 C-25.393 91.51 -23.603 90.479 -21.801 88.66 C-20.438 87.313 -20.438 87.313 -18.438 87.313 C-18.761 84.783 -18.761 84.783 -20.438 82.313 C-22.522 81.875 -24.61 81.45 -26.711 81.098 C-32.212 79.514 -37.127 76.021 -41.438 72.313 C-42.461 70.375 -42.461 70.375 -42.438 68.313 C-41.258 65.805 -41.258 65.805 -39.563 63.188 C-39.008 62.319 -38.454 61.45 -37.883 60.555 C-37.406 59.815 -36.929 59.075 -36.438 58.313 C-35.032 55.501 -35.292 53.119 -35.262 49.977 C-35.238 48.684 -35.214 47.391 -35.189 46.059 C-35.155 44.014 -35.125 41.97 -35.112 39.925 C-35.038 30.67 -33.959 22.904 -30.438 14.313 C-29.778 14.313 -29.118 14.313 -28.438 14.313 C-28.32 13.417 -28.32 13.417 -28.199 12.504 C-26.462 7.505 -19.587 4.954 -15.188 2.5 C-10.195 0.344 -5.408 0.103 0 0 Z" fill="currentColor" transform="translate(72.4375,18.6875)"/>
              </svg>

              <svg v-else viewBox="0 0 150 150" class="w-28 h-28 text-blue-600"style="color:#3182CE">
                <path
                  d="M75 75c23.672 0 42.857-16.787 42.857-37.5S98.672 0 75 0 32.143 16.787 32.143 37.5 51.328 75 75 75Zm32.076 9.551-16.005 56.074L80.357 100.78 91.071 84.375H58.93l10.714 16.406-10.714 39.844-16.004-56.074C19.051 85.547 0 102.627 0 123.75v12.187C0 143.701 7.199 150 16.071 150h117.858C142.801 150 150 143.701 150 135.937V123.75c0-21.123-19.051-38.203-42.924-39.199Z"
                  fill="currentColor" />
              </svg>
            </template>
          </div>

          <h2 class="mt-4 text-center font-bold leading-tight px-2">
            {{ user.last_name }} {{ user.first_name }} {{ user.middle_name }}
          </h2>

          <div class="mt-4 w-full border-t border-gray-200 pt-4">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">{{ $t('user.id') }}</span>
              <span class="text-blue-600 font-medium">{{ user.uid }}</span>
            </div>
          </div>
        </section>

        <!-- RIGHT: Details -->
        <section class="lg:col-span-2">
          <!-- Desktop/Tablet: table -->
          <div class="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table class="w-full border-collapse">
              <tbody class="divide-y divide-gray-200">
                <tr>
                  <td class="w-1/3 px-4 py-3 text-gray-600">{{ $t('user.sana') }}</td>
                  <td class="px-4 py-3">{{ user.brithday }} {{ $t('user.year') }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-gray-600">{{ $t('user.tel') }}</td>
                  <td class="px-4 py-3">{{ user.phone }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-gray-600">{{ $t('user.address') }}</td>
                  <td class="px-4 py-3">{{ user.region }} {{ user.district }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-gray-600">{{ $t('user.vaqt') }}</td>
                  <td class="px-4 py-3">{{ $formatDate(user.created_at) }} {{ $t('user.year') }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile: stacked cards -->
          <div class="md:hidden space-y-3">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p class="text-xs uppercase tracking-wide text-gray-500">{{ $t('user.sana') }}</p>
              <p class="mt-1 font-medium">{{ user.brithday }} {{ $t('user.year') }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p class="text-xs uppercase tracking-wide text-gray-500">{{ $t('user.tel') }}</p>
              <p class="mt-1 font-medium">{{ user.phone }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p class="text-xs uppercase tracking-wide text-gray-500">{{ $t('user.address') }}</p>
              <p class="mt-1 font-medium">{{ user.region }} {{ user.district }}</p>
            </div>
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p class="text-xs uppercase tracking-wide text-gray-500">{{ $t('user.vaqt') }}</p>
              <p class="mt-1 font-medium">{{ $formatDate(user.created_at) }} {{ $t('user.year') }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
import BackButton from '@/components/BackButton.vue';

export default {
  components: { BackButton },
  data: () => ({
    user: null,
    step: 0,
    avatar: null,
  }),
  async mounted() {
    try {
      const candidate = await this.$axios.$get(`/user/candidate/${this.$route.query.id}`, { silent: true });
      this.user = candidate.data;
      if (this.user && this.user.image) {
        this.avatar = `https://app.zerox.uz/${this.user.image}`;
      }
    } catch (error) {
      this.$toast.error(this.$t('a1.a42') || "Xatolik yuz berdi!");
    }
  },
};
</script>
<style scoped>
/* iOS notch (safe-area) uchun tepada avtomatik "yostiq" */
@supports (padding: max(0px)) {
  .mt-safe {
    padding-top: max(1rem, env(safe-area-inset-top));
  }
}

/* Jadval hujayralari vertikal markazda */
table td {
  vertical-align: middle;
}
</style>
