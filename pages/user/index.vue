<template>
  <div class="rounded-xl bg-white py-4 block">
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
    <div class="container rounded-xl justify-center">
      <div
        class="flex rounded-xl px-4 py-6"
        style="width: 100%"
        v-if="user != null"
      >
        <div class="bg-white rounded py-4" style="width: 500px">
          <div class="flex flex-col items-center">
            <!-- <img
              v-if="user.image"
              src="https://avatars.mds.yandex.net/i?id=e157550c2736f574c60fc9fe36e0581a-5483853-images-thumbs&n=13"
              alt=""
              class="flex w-40 h-40 rounded-full mr-10 ml-2 p-18"
            /> -->
            <img
              src="@/assets/img/no-avatar.png"
              style="width: 150px; height: 150px"
              alt="avatar"
            />
            <span class="text-center font-bold mt-4 px-2"
              >{{ user.last_name }} {{ user.first_name }}
              {{ user.middle_name }}</span
            >
          </div>
          <hr class="mt-4" />
          <div class="mt-4 pr-4 pl-4 items-center flex justify-between">
            <p class="text-sm text-center">{{ $t("user.id") }}</p>
            <p class="text-blue-400 text-sm">{{ user.uid }}</p>
          </div>
        </div>

        <div class="w-full ml-4">
          <table
            class="
              table-auto
              w-full
              rounded
              bg-white
              border-collapse border border-gray-300
            "
          >
            <tbody>
              <tr class="border border-gray-300">
                <td class="border border-gray-300 px-4 py-2">
                  {{ $t("user.sana") }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ user.brithday }} {{ $t("user.year") }}
                </td>
              </tr>

              <tr class="border border-gray-300">
                <td class="border border-gray-300 px-4 py-2">
                  {{ $t("user.tel") }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ user.phone }}
                </td>
              </tr>
              <tr class="border border-gray-300">
                <td class="border border-gray-300 px-4 py-2">
                  {{ $t("user.address") }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ user.region }} {{ user.district }}
                </td>
              </tr>
              <tr class="border border-gray-300">
                <td class="border border-gray-300 px-4 py-2">
                  {{ $t("user.vaqt") }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ dateFormat(user.created_at) }} {{ $t("user.year") }}
                </td>
              </tr>
              <tr class="border border-gray-300">
                <td class="border border-gray-300 px-4 py-2"> {{ $t("user.status") }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ user.rating }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
  //  middleware:'auth',
  data: () => ({
    user: null,
    step: 0,
  }),
  methods: {
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
  },
  async mounted() {
    console.log("sd", this.$route.query.id);
    const candidate = await this.$axios.$get(
      `/user/candidate/${this.$route.query.id}`
    );
    this.user = candidate.data;
  },
};
</script>

<style>
.jad td tr {
  padding: 0.8rem;
  border: 1px solid #8692a6;
  border-radius: 5px;
}
</style>

