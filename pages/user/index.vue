<template>
  <div class="bg-white rounded-2xl shadow-sm">
    <!-- Back (desktop) -->
    <div @click="$backWithLocale()" class="my-2 mx-6 hidden lg:inline-flex items-center" style="cursor:pointer">
          <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <polyline points="15 6 9 12 15 18" />
          </svg>
          <p class="text-blue-500">{{ $t('back') }}</p>
        </div>

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
              <svg v-if="user.type == 2 && user.gender == 1" viewBox="0 0 150 150" class="w-28 h-28 text-blue-600">
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

              <svg v-else-if="user.type == 2 && user.gender == 2" viewBox="0 0 150 150" class="w-28 h-28 text-blue-600">
                <path
                  d="M144.686 96.4413 108.503 81.102l-15.301-6.487c.383-.216.748-.46 1.125-.688h20.09c1.494 0 2.927-.527 3.983-1.466 1.056-.939 1.65-2.212 1.65-3.54V55.748h-.051c-.616-18.358-7.79-34.509-18.564-44.637C95.756 5.417 88.392 1.548 80.155.392c-.367-.053-.734-.103-1.104-.146a47.2 47.2 0 0 0-1.279-.125C76.849.045 75.923.004 74.995 0h-.004c-.92 0-1.829.047-2.734.117-.434.033-.864.08-1.294.127-.36.041-.718.086-1.074.14-8.17 1.136-15.483 4.945-21.148 10.558-10.878 10.118-18.13 26.345-18.749 44.81h-.048v13.173c0 1.327.593 2.6 1.65 3.539 1.056.939 2.489 1.467 3.983 1.467h20.145c.55.333 1.098.672 1.666.975l-14.653 6.064-37.357 15.463C2.13 97.782 0 101.035 0 104.668v36.479C0 146.037 3.833 150 8.567 150h132.866C146.167 150 150 146.037 150 141.147v-36.484c-.002-3.62-2.1-6.842-5.314-8.222Z"
                  fill="currentColor" />
              </svg>

              <svg v-else viewBox="0 0 150 150" class="w-28 h-28 text-blue-600">
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
                  <td class="px-4 py-3">{{ dateFormat(user.created_at) }} {{ $t('user.year') }}</td>
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
              <p class="mt-1 font-medium">{{ dateFormat(user.created_at) }} {{ $t('user.year') }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
import dateformat from "dateformat";
export default {
  data: () => ({
    user: null,
    step: 0,
    avatar: null,
  }),
  methods: {
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      return date1.split("-").reverse().join(".");
    },
  },
  async mounted() {
    const candidate = await this.$axios.$get(`/user/candidate/${this.$route.query.id}`);
    this.user = candidate.data;
    this.avatar = `https://app.zerox.uz/${this.user.image}`;
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
