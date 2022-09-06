<template>
  <div class="bg-white rounded-xl flex flex-col items-center">
    <div class="flex w-full justify-start mt-6">
      <div
        @click="step == 0 ? $router.go(-1) : step--"
        class="my-2 mx-6 hidden lg:inline-flex items-center"
        style="cursor: pointer"
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
        <p class="text-blue-500">{{ $t("back") }}</p>
      </div>
    </div>
    <div class="main block text-black bg-white mt-4 mb-10 rounded-xl p-10">
      
      <h1 class="h1 text-2xl items-center text-center font-bolder flex">
        {{ $t("oldi") }}
      </h1>
      <div
        style="max-width: 500px"
        class="
          sch
          bt
          bg-white
          mx-auto
          px-4
          rounded
          items-center
          flex
          font-black
          mt-10
          mb-10
        "
      >
        <svg
          class="svg"
          width="19"
          height="20"
          viewBox="0 0 19 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.6858 17.3658L14.4959 13.1759C15.5046 11.8329 16.0492 10.1984 16.0473 8.51878C16.0473 4.22864 12.557 0.738281 8.26682 0.738281C3.97669 0.738281 0.486328 4.22864 0.486328 8.51878C0.486328 12.8089 3.97669 16.2993 8.26682 16.2993C9.9464 16.3011 11.581 15.7566 12.9239 14.7478L17.1138 18.9377C17.3259 19.1273 17.6026 19.2285 17.8869 19.2206C18.1713 19.2126 18.4418 19.0961 18.643 18.895C18.8442 18.6938 18.9607 18.4233 18.9686 18.1389C18.9766 17.8545 18.8754 17.5779 18.6858 17.3658ZM2.70933 8.51878C2.70933 7.41961 3.03527 6.34512 3.64593 5.4312C4.2566 4.51727 5.12456 3.80495 6.14006 3.38432C7.15556 2.96369 8.27299 2.85363 9.35104 3.06807C10.4291 3.2825 11.4193 3.8118 12.1966 4.58903C12.9738 5.36626 13.5031 6.35651 13.7175 7.43456C13.932 8.51261 13.8219 9.63004 13.4013 10.6455C12.9806 11.661 12.2683 12.529 11.3544 13.1397C10.4405 13.7503 9.36599 14.0763 8.26682 14.0763C6.79343 14.0745 5.38088 13.4884 4.33903 12.4466C3.29718 11.4047 2.71109 9.99218 2.70933 8.51878Z"
            fill="#2D3748"
          />
        </svg>
        <input
          @input="searchUser"
          type="text"
          placeholder="Qidirish..."
          class="int p-5 text-xl"
        />
      </div>

      <div
        class="user flex flex-col mx-auto items-center justify-center"
        style="max-width: 500px"
      >
        <button
          v-for="(user, index) in users"
          :key="index"
          class="
            flex
            items-center
            hover:bg-sky-500 hover:ring-sky-500
            mb-10
            w-full
          "
        >
          <nuxt-link
            :to="{
              path: '/user-info',
              query: { id: user.uid, type: $route.query.searchtype },
            }"
            ><div class="flex items-center">
              <img
                src="@/assets/img/no-avatar.png"
                alt=""
                class="w-20 h-20 rounded-full avatar"
              />
              <h2 class="text-sm ml-6">
                {{ user.first_name }} {{ user.last_name }}
                {{ user.middle_name }}
              </h2>
            </div>
          </nuxt-link>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  mounted() {
    this.getThreadedUsers();
  },
  data: () => ({
    users: null,
    step: 0,
    reservatedUsers: [],
  }),
  methods: {
    async searchUser(e) {
      try {
        const response = await this.$axios.get(
          `/contract/oldi-bardi/search?search=${e.target.value}`
        );
        if (response.status == 200) {
          this.users = response.data.data;
        }
      } catch (e) {
        console.log(e);
      }
    },

    async getThreadedUsers() {
      try {
        const response = await this.$axios.get(`/contract/oldi-bardi`);
        if (response.status == 200) {
          this.users = response.data.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.int {
  width: 70%;
  height: 60px;
  border-radius: 4px;
  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.05);
  outline: none;
  opacity: 0.7;
}
.sch {
  display: flex;
  align-items: center;
}
.avatar {
  background: gray;
}
.main {
  width: 100%;
}
.bt {
  border: 1px solid #3182ce;

  outline: none;
  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.06);
}
.h1 {
  text-align: center;
  align-items: center;
  justify-content: center;
}
</style>
