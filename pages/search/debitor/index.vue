<template>
  <div class="bg-white rounded-xl px-4 py-6">
    <!-- Orqaga tugma -->
    <div
      @click="$backWithLocale()"
      class="my-2 mx-6 hidden lg:inline-flex items-center cursor-pointer"
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
      <p class="text-blue-500 ml-2">{{ $t("back") }}</p>
    </div>

    <!-- Asosiy bloklar -->
    <div
      class="mt-8 mb-12 flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-16"
    >
      <!-- 1-blok -->
      <nuxt-link
        :to="localePath({ name: 'search-debitor-physical' })"
        class="shaxs__block text-center h-full"
      >
        <svg
          class="shaxs__svg"
          width="90"
          height="90"
          viewBox="0 0 106 122"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M53 61C69.7 61 83.3 47.3 83.3 30.5C83.3 13.7 69.7 0 53 0C36.3 0 22.7 13.7 22.7 30.5C22.7 47.3 36.3 61 53 61ZM42.2 72.4C18.9 72.4 0 91.5 0 114.9C0 118.8 3.1 122 7 122H99C102.9 122 106 118.8 106 114.9C106 91.5 87.1 72.4 63.8 72.4H42.2Z"
          />
        </svg>
        <span class="shaxs__title">{{ $t("home.search_user") }}</span>
      </nuxt-link>

      <!-- 2-blok -->
      <nuxt-link
        :to="localePath({
          name: 'treaded-users',
          query: { searchtype: 'debitor' },
        })"
        class="shaxs__block text-center h-full"
      >
        <svg
          class="shaxs__svg"
          width="90"
          height="90"
          viewBox="0 0 106 122"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M53 0L0 22.2V55.5C0 86.2 22.6 115 53 122C83.4 115 106 86.2 106 55.5V22.2L53 0ZM41.2 88.7L17.7 66.5L26 58.7L41.2 73L80 36.5L88.3 44.4L41.2 88.7Z"
          />
        </svg>
        <span class="shaxs__title">{{ $t("oldi") }}</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  mounted() {
    if (this.$auth.user.is_active != 1) {
      return this.$router.push(this.localePath({ name: `index` }));
    }
  },
};
</script>

<style scoped>
.shaxs__block {
  transition: 0.3s;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  width: 100%;
  max-width: 280px; /* desktopda eni bir xil */
  min-height: 240px; /* card balandligi bir xil */
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .shaxs__block {
    max-width: 95%; /* mobil uchun kattaroq */
    min-height: 220px;
  }
}

.shaxs__title {
  font-size: 20px;
  font-weight: 700;
  color: #3182ce;
  margin-top: 16px;
}

.shaxs__svg {
  fill: #3182ce;
}
</style>
