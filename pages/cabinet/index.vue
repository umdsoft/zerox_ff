<template>
  <div class="rounded-xl bg-white py-4 block">
    <div v-if="isModalVisible" class="modal__bg">
      <div class="modal__window grid grid-cols-2 items-center gap-2">
        <button
          @click="toogleModal"
          class="
            text-white
            bg-red-500
            text-center
            font-bold
            w-full
            py-3
            px-8
            rounded
          "
        >
          Yo'q
        </button>
        <button
          @click="$auth.logout()"
          class="
            text-white
            bg-t_primary
            text-center
            font-bold
            w-full
            py-3
            px-8
            rounded
          "
        >
          Ha
        </button>
      </div>
    </div>
    <div class="container rounded-xl justify-center">
      <div class="flex rounded-xl px-4 py-6" style="width: 100%">
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
              >{{ $auth.user.last_name }} {{ $auth.user.first_name }}
              {{ $auth.user.middle_name }}</span
            >
          </div>
          <hr class="mt-4" />
          <div class="mt-4 pr-4 pl-4 items-center flex justify-between">
            <p class="text-sm text-center">ID raqami</p>
            <p class="text-blue-400 text-sm">{{ $auth.user.uid }}</p>
          </div>
          <div class="px-4">
            <nuxt-link
              to="#"
              class="
                bg-blue-400
                w-full
                hover:bg-blue-500
                mt-6
                block
                text-center
                py-2
                text-white text-sm
                rounded
              "
              >Parolni o'zgartirish</nuxt-link
            >
            <button
              class="
                bg-blue-400
                px-2
                hover:bg-blue-500
                py-2
                mt-2
                text-white
                rounded
                text-sm
                w-full
              "
            >
              Universal shartnoma
            </button>
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
                  Tug'ilgan sanasi
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ $auth.user.brithday }} yil
                </td>
              </tr>

              <tr class="border border-gray-300">
                <td class="border border-gray-300 px-4 py-2">Pasport</td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ $auth.user.passport }}
                </td>
              </tr>
              <tr class="border border-gray-300">
                <td class="border border-gray-300 px-4 py-2">
                  Ro'yxatga olingan manzili
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ $auth.user.region }},
                  {{ $auth.user.district }}
                  ,
                  {{ $auth.user.address }}
                </td>
              </tr>
              <tr class="border border-gray-300">
                <td class="border border-gray-300 px-4 py-2">Telefon raqami</td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ $auth.user.phone }}
                </td>
              </tr>

              <tr class="border border-gray-300">
                <td class="border border-gray-300 px-4 py-2">
                  Tizimda ro'yxatdan o'tgan vaqti
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ dateFormat($auth.user.created_at) }} yil
                </td>
              </tr>

              <tr class="border border-gray-300">
                <td class="border border-gray-300 px-4 py-2">Status</td>
                <td class="border border-gray-300 px-4 py-2">
                  <div class="flex">
                    {{ $auth.user.rating }}
                    <span v-if="$auth.user.rating_type == 1">
                      <svg
                        width="14"
                        height="10"
                        viewBox="0 0 14 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
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
      <div class="flex items-center justify-between">
        <button
          @click="$router.go(-1)"
          class="
            button
            mt-10
            mb-10
            text-white
            p-2
            bg-blue-500
            rounded
            items-center
            flex
            justify-end
            pr-10
          "
          style="width: 186px; height: 40px"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="16"
            viewBox="0 0 30 16"
            fill="none"
          >
            <path
              d="M7.20341 7.20384C6.9007 7.50655 6.9007 7.99735 7.20341 8.30006L12.1364 13.233C12.4391 13.5358 12.9299 13.5358 13.2326 13.233C13.5353 12.9303 13.5353 12.4395 13.2326 12.1368L8.84774 7.75195L13.2326 3.36708C13.5353 3.06437 13.5353 2.57357 13.2326 2.27086C12.9299 1.96815 12.4391 1.96815 12.1364 2.27086L7.20341 7.20384ZM21.7041 6.97681L7.75152 6.97681L7.75152 8.5271L21.7041 8.5271L21.7041 6.97681Z"
              fill="white"
            />
          </svg>
          Orqaga
        </button>
        <button
          @click="toogleModal"
          class="
            button
            mt-10
            mb-10
            text-white
            p-2
            bg-red-500
            rounded
            items-center
            flex
            justify-end
          "
        >
          Chiqish
        </button>
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
  }),
  methods: {
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

