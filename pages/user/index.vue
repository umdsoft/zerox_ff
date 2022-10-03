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
            <svg v-if="$auth.user.type == 1" width="150" height="150" viewBox="0 0 106 122" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M53 61C69.7281 61 83.2857 47.3465 83.2857 30.5C83.2857 13.6535 69.7281 0 53 0C36.2719 0 22.7143 13.6535 22.7143 30.5C22.7143 47.3465 36.2719 61 53 61ZM75.667 68.768L64.3571 114.375L56.7857 81.9688L64.3571 68.625H41.6429L49.2143 81.9688L41.6429 114.375L30.333 68.768C13.4629 69.5781 0 83.4699 0 100.65V110.562C0 116.877 5.08705 122 11.3571 122H94.6429C100.913 122 106 116.877 106 110.562V100.65C106 83.4699 92.537 69.5781 75.667 68.768Z" fill="#3182CE"/>
            </svg>  
            <svg v-if="$auth.user.type == 2 && $auth.user.gender == 1"  width="150" height="150" viewBox="0 0 106 122" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M53 61C69.7281 61 83.2857 47.3465 83.2857 30.5C83.2857 13.6535 69.7281 0 53 0C36.2719 0 22.7143 13.6535 22.7143 30.5C22.7143 47.3465 36.2719 61 53 61ZM42.1871 72.4375C18.8813 72.4375 0 91.4523 0 114.923C0 118.831 3.14688 122 7.02723 122H98.9728C102.853 122 106 118.831 106 114.923C106 91.4523 87.1188 72.4375 63.813 72.4375H42.1871V72.4375Z" fill="#3182CE"/>
              </svg>                          
            <svg v-if="$auth.user.type == 2 && $auth.user.gender == 2" width="150" height="150" viewBox="0 0 106 122"  style="fill:gray;" xmlns="http://www.w3.org/2000/svg">
              <path d="M102.245 78.4389L76.6753 65.9629L65.863 60.6868C66.1341 60.5115 66.3921 60.3127 66.6582 60.1273H80.8552C81.911 60.1273 82.9235 59.6983 83.67 58.9347C84.4165 58.1711 84.8359 57.1354 84.8359 56.0555V45.3414H84.8C84.3657 30.4102 79.2959 17.2744 71.6823 9.03722C67.6673 4.40588 62.4636 1.2593 56.6427 0.319C56.3831 0.275576 56.1235 0.235492 55.8623 0.200419C55.5618 0.162005 55.263 0.123592 54.9593 0.0985393C54.3069 0.0363055 53.652 0.00342735 52.9967 0H52.9935C52.3436 0 51.7019 0.0384139 51.0619 0.0951992C50.7549 0.121922 50.4512 0.160334 50.1475 0.198748C49.8928 0.232151 49.6397 0.268894 49.3883 0.312318C43.6148 1.23592 38.447 4.33406 34.4435 8.8986C26.7563 17.1275 21.6311 30.325 21.1935 45.3431H21.1592V56.0572C21.1592 57.1371 21.5786 58.1728 22.3251 58.9364C23.0716 59.7 24.0841 60.129 25.1399 60.129H39.3761C39.7647 60.3996 40.1517 60.6751 40.5533 60.9223L30.1982 65.8543L3.79948 78.4306C1.50542 79.5296 0 82.1751 0 85.1296V114.8C0 118.777 2.70878 122 6.05434 122H99.9457C103.291 122 106 118.777 106 114.8V85.1263C105.998 82.1818 104.516 79.5613 102.245 78.4389Z" fill="#3182CE"/>
            </svg>
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

