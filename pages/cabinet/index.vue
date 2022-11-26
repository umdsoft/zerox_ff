<template>
  <div class="rounded-xl bg-white py-4 block">
    <div v-if="isModalVisible" class="modal__bg">
      
      <div class="modal__window">   
        <p class="text-center font-bold">Siz haqiqatan ham shaxsiy kabinetdan chiqmoqchimisiz?</p>    
        <br>
        <div class=" grid grid-cols-2 items-center gap-2">
        <button
          @click="toogleModal"
          class="text-white bg-t_primary text-center font-bold w-full py-3 px-8 rounded"
        >
          Yo'q
        </button>
        <button
          @click="$auth.logout()"
          class="text-white bg-t_primary text-center font-bold w-full py-3 px-8 rounded"
        >
          Ha
        </button>
      </div>
      </div>
    </div>
    <div class="container rounded-xl justify-center">
      <div class="flex items-center justify-between">
        <button
          @click="$router.go(-1)"
          class="button p-2 text-blue-500 rounded items-center flex justify-end"
          style="gap: 14px"
        >
          <svg
            width="10"
            height="16"
            viewBox="0 0 10 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.8625 2.225L8.37916 0.75L0.137497 9L8.3875 17.25L9.8625 15.775L3.0875 9L9.8625 2.225Z"
              fill="#3182CE"
            />
          </svg>
          <span> Orqaga</span>
        </button>
        <button
          @click="toogleModal"
          class="button text-white p-2 bg-red-500 rounded items-center flex justify-end"
          style="gap: 14px"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18.001"
            viewBox="0 0 18 18.001"
          >
            <path
              id="logout-Icon-SVG-098767893"
              d="M5.808,13.782v1.406A2.816,2.816,0,0,0,8.621,18h7.067A2.816,2.816,0,0,0,18.5,15.188V2.813A2.816,2.816,0,0,0,15.687,0H8.621A2.816,2.816,0,0,0,5.808,2.813V4.219a.7.7,0,0,0,1.406,0V2.813A1.408,1.408,0,0,1,8.621,1.406h7.067a1.408,1.408,0,0,1,1.406,1.406V15.188a1.408,1.408,0,0,1-1.406,1.406H8.621a1.408,1.408,0,0,1-1.406-1.406V13.782a.7.7,0,0,0-1.406,0ZM1.014,7.793,2.589,6.218a.7.7,0,0,1,.994.994l-1.12,1.12h8.443a.7.7,0,1,1,0,1.406H2.463l1.12,1.12a.7.7,0,1,1-.994.994L1.014,10.279A1.76,1.76,0,0,1,1.014,7.793Zm0,0"
              transform="translate(-0.5)"
              fill="white"
            />
          </svg>
          <span> Chiqish </span>
        </button>
      </div>
      <div class="flex rounded-xl px-4 py-6" style="width: 100%">
        <div class="bg-white rounded py-4" style="width: 500px">
          <div class="flex flex-col items-center border-b pb-4 border-blue-300">
            <!-- <img
              v-if="user.image"
              src="https://avatars.mds.yandex.net/i?id=e157550c2736f574c60fc9fe36e0581a-5483853-images-thumbs&n=13"
              alt=""
              class="flex w-40 h-40 rounded-full mr-10 ml-2 p-18"
            /> -->
            <svg
              v-if="$auth.user.type == 1"
              width="150"
              height="150"
              viewBox="0 0 106 122"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M53 61C69.7281 61 83.2857 47.3465 83.2857 30.5C83.2857 13.6535 69.7281 0 53 0C36.2719 0 22.7143 13.6535 22.7143 30.5C22.7143 47.3465 36.2719 61 53 61ZM75.667 68.768L64.3571 114.375L56.7857 81.9688L64.3571 68.625H41.6429L49.2143 81.9688L41.6429 114.375L30.333 68.768C13.4629 69.5781 0 83.4699 0 100.65V110.562C0 116.877 5.08705 122 11.3571 122H94.6429C100.913 122 106 116.877 106 110.562V100.65C106 83.4699 92.537 69.5781 75.667 68.768Z"
                fill="#3182CE"
              />
            </svg>
            <svg
              v-if="$auth.user.type == 2 && $auth.user.gender == 1"
              width="150"
              height="150"
              viewBox="0 0 106 122"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M53 61C69.7281 61 83.2857 47.3465 83.2857 30.5C83.2857 13.6535 69.7281 0 53 0C36.2719 0 22.7143 13.6535 22.7143 30.5C22.7143 47.3465 36.2719 61 53 61ZM42.1871 72.4375C18.8813 72.4375 0 91.4523 0 114.923C0 118.831 3.14688 122 7.02723 122H98.9728C102.853 122 106 118.831 106 114.923C106 91.4523 87.1188 72.4375 63.813 72.4375H42.1871V72.4375Z"
                fill="#3182CE"
              />
            </svg>
            <svg
              v-if="$auth.user.type == 2 && $auth.user.gender == 2"
              width="150"
              height="150"
              viewBox="0 0 106 122"
              style="fill: gray"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M102.245 78.4389L76.6753 65.9629L65.863 60.6868C66.1341 60.5115 66.3921 60.3127 66.6582 60.1273H80.8552C81.911 60.1273 82.9235 59.6983 83.67 58.9347C84.4165 58.1711 84.8359 57.1354 84.8359 56.0555V45.3414H84.8C84.3657 30.4102 79.2959 17.2744 71.6823 9.03722C67.6673 4.40588 62.4636 1.2593 56.6427 0.319C56.3831 0.275576 56.1235 0.235492 55.8623 0.200419C55.5618 0.162005 55.263 0.123592 54.9593 0.0985393C54.3069 0.0363055 53.652 0.00342735 52.9967 0H52.9935C52.3436 0 51.7019 0.0384139 51.0619 0.0951992C50.7549 0.121922 50.4512 0.160334 50.1475 0.198748C49.8928 0.232151 49.6397 0.268894 49.3883 0.312318C43.6148 1.23592 38.447 4.33406 34.4435 8.8986C26.7563 17.1275 21.6311 30.325 21.1935 45.3431H21.1592V56.0572C21.1592 57.1371 21.5786 58.1728 22.3251 58.9364C23.0716 59.7 24.0841 60.129 25.1399 60.129H39.3761C39.7647 60.3996 40.1517 60.6751 40.5533 60.9223L30.1982 65.8543L3.79948 78.4306C1.50542 79.5296 0 82.1751 0 85.1296V114.8C0 118.777 2.70878 122 6.05434 122H99.9457C103.291 122 106 118.777 106 114.8V85.1263C105.998 82.1818 104.516 79.5613 102.245 78.4389Z"
                fill="#3182CE"
              />
            </svg>

            <span class="text-center font-bold mt-4 px-2"
              >{{ $auth.user.last_name }} {{ $auth.user.first_name }}
              {{ $auth.user.middle_name }}</span
            >
          </div>

          <div class="mt-4 pr-4 pl-4 items-center flex justify-between">
            <p class="text-sm text-center">ID raqami</p>
            <p class="text-blue-400 text-sm">{{ $auth.user.uid }}</p>
          </div>
          <div class="px-4">
            <button
              class="bg-blue-400 w-full hover:bg-blue-500 mt-6 block text-center py-2 text-white text-sm rounded"
            >
              Parolni o'zgartirish
            </button>

            <button
              class="bg-blue-400 w-full hover:bg-blue-500 mt-6 block text-center py-2 text-white text-sm rounded"
            >
              Universal shartnoma
            </button>
          </div>
        </div>

        <div class="w-full ml-4">
          <table
            class="table-auto w-full rounded bg-white border-collapse border border-blue-300"
          >
            <tbody>
              <tr class="border border-blue-300">
                <td class="border border-blue-300 px-4 py-2">
                  Tug‘ilgan sanasi
                </td>
                <td class="border border-blue-300 px-4 py-2">
                  {{ $auth.user.brithday }} yil
                </td>
              </tr>

              <tr class="border border-blue-300">
                <td class="border border-blue-300 px-4 py-2">Pasport</td>
                <td class="border border-blue-300 px-4 py-2">
                  {{ $auth.user.passport }}
                </td>
              </tr>
              <tr class="border border-blue-300">
                <td class="border border-blue-300 px-4 py-2">JSHSHIR</td>
                <td class="border border-blue-300 px-4 py-2">
                  {{ $auth.user.pinfl }}
                </td>
              </tr>
              <tr class="border border-blue-300">
                <td class="border border-blue-300 px-4 py-2">
                  Ro‘yxatga olingan manzili
                </td>
                <td class="border border-blue-300 px-4 py-2">
                  {{ $auth.user.region }},
                  {{ $auth.user.district }}
                  ,
                  {{ $auth.user.address }}
                </td>
              </tr>
              <tr class="border border-blue-300">
                <td class="border border-blue-300 px-4 py-2">Telefon raqami</td>
                <td class="border border-blue-300 px-4 py-2">
                  <div class="flex align-center">
                    <span class="mr-4"> {{ $auth.user.phone }}</span>
                    <nuxt-link to="/rephone" class="flex align-center text-t_primary">
                      <span class="w-4 h-4 mr-2"
                        ><svg
                          class="w-full"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path
                            d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                          />
                        </svg>
                      </span>
                      Raqamni o'zgartirish
                    </nuxt-link>
                  </div>
                </td>
              </tr>

              <tr class="border border-blue-300">
                <td class="border border-blue-300 px-4 py-2">
                  Tizimda ro‘yxatdan o‘tgan vaqti
                </td>
                <td class="border border-blue-300 px-4 py-2">
                  {{ dateFormat($auth.user.created_at) }} yil
                </td>
              </tr>

              <tr class="border border-blue-300">
                <td class="border border-blue-300 px-4 py-2">Status</td>
                <td class="border border-blue-300 px-4 py-2">
                  <div class="flex">
                    {{ $auth.user.rating }}
                    <span v-if="$auth.user.rating_type == 1">
                      <svg
                        width="14"
                        height="10"
                        viewBox="0 0 14 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style="margin: 6px 0px 0px 6px"
                      >
                        <path
                          d="M0 5L0 9.5L7 4.5L14 9.5V5L7 0L0 5Z"
                          fill="#049D26"
                        />
                      </svg>
                    </span>
                    <span v-if="$auth.user.rating_type == 2">
                      <svg
                        width="14"
                        height="17"
                        viewBox="0 0 14 17"
                        fill="none"
                        style="margin: 6px 0px 0px 6px"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 5L0 9.5L7 4.5L14 9.5V5L7 0L0 5Z"
                          fill="#049D26"
                        />
                        <path
                          d="M0 12L0 16.5L7 11.5L14 16.5V12L7 7L0 12Z"
                          fill="#049D26"
                        />
                      </svg>
                    </span>
                    <span v-if="$auth.user.rating_type == 3">
                      <svg
                        width="14"
                        height="10"
                        viewBox="0 0 14 10"
                        fill="none"
                        style="margin: 6px 0px 0px 6px"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 4.5V0L7 5L0 0V4.5L7 9.5L14 4.5Z"
                          fill="#FF0000"
                        />
                      </svg>
                    </span>
                    <span v-if="$auth.user.rating_type == 4">
                      <svg
                        width="14"
                        height="17"
                        viewBox="0 0 14 17"
                        fill="none"
                        style="margin: 6px 0px 0px 6px"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 11.5V7L7 12L0 7V11.5L7 16.5L14 11.5Z"
                          fill="#FF0000"
                        />
                        <path
                          d="M14 4.5V0L7 5L0 0V4.5L7 9.5L14 4.5Z"
                          fill="#FF0000"
                        />
                      </svg>
                    </span>
                  </div>
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
  middleware: "auth",
  data: () => ({
    isModalVisible: false,
    phoneChange: {
      step: 1,
      modal: true,
      phone: "+998 ",
      code: "",
      errorCode: false,
    },
  }),
  mounted() {
    console.log("tt", this.$auth.user);
  },
  methods: {
    phoneCheck() {
      // this.$axios.$post("phone/change", {
      //   phone: phoneChange.phone,
      // });
      this.phoneChange.step = 2;
    },
    phoneKeyup(e) {
      if (e.target.value.length < 5) {
        e.target.value = "+998 ";
      }
    },
    toogleModal() {
      this.isModalVisible = !this.isModalVisible;
    },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
  },
  mounted() {
    console.log(this.$auth.user);
  },
};
</script>

<style scoped>
.modal__bg {
  position: fixed;
  width: 100vw;
  z-index: 999999999999999999;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.665);
}
.modal__window {
  width: 400px;
  padding: 1rem;
  background: white;
  border-radius: 10px;
}
.jad td tr {
  padding: 0.8rem;
  border: 1px solid #8692a6;
  border-radius: 5px;
}
</style>
