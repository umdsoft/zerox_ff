<template>
  <div>
    <div style="min-height: 70vh" class="bg-white rounded p-4 sm:p-6 lg:p-10">
      <div @click="$goHomeWithLocale()" class="my-2 mx-6 hidden lg:inline-flex items-center cursor-pointer">
        <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="15 6 9 12 15 18" />
        </svg>
        <p class="text-blue-500 ml-2">{{ $t('back') }}</p>
      </div>
      <div class="MyPractices">
        <div class="MyPractices__contents">
          <div v-if="data != null" style="width: 100%" class="MyPractices__content">
            <!-- Filter tugmalar -->
            <div class="MyPractices__title flex flex-wrap gap-2 mb-3">
              <nuxt-link :to="localePath({ name: 'jonatuvchi', query: { status: '0' } })">
                <a :class="{
                  'bg-green-500 text-white': $route.query.status != '1',
                  'bg-white text-black': $route.query.status == '1'
                }" @click="click1('0')" class="bt w-full sm:w-auto ml-0 sm:ml-2 text-center font-bold py-2 rounded"
                  style="border-radius: 5px">
                  <span class="ml-2 pr-2" :style="{ color: $route.query.status == '1' ? '#000' : '#fff' }">
                    {{ $t('debt_list.Kirm') }}
                  </span>
                </a>
              </nuxt-link>

              <nuxt-link :to="localePath({ name: 'jonatuvchi', query: { status: '1' } })">
                <a :class="{
                  'bg-green-500 text-white': $route.query.status != '0',
                  'bg-white text-black': $route.query.status == '0'
                }" @click="click1('1')" class="bt w-full sm:w-auto ml-0 sm:ml-2 text-center font-bold py-2 rounded"
                  style="border-radius: 5px">
                  <span class="ml-2 pr-2" :style="{ color: $route.query.status == '0' ? '#000' : '#fff' }">
                    {{ $t('debt_list.Chiqim') }}
                  </span>
                </a>
              </nuxt-link>
            </div>

            <!-- Jadval: mobil skroll + min-width -->
            <div class="-mx-2 sm:mx-0 overflow-x-auto">
              <table class="w-full min-w-[760px] text-xs sm:text-sm table-auto">
                <thead>
                  <tr class="text-left text-gray-600 border-b">
                    <th class="w-10"></th>
                    <th class="w-25"></th>
                    <th class="w-24 text-center">{{ $t('result.sana') }}</th>
                    <th class="w-36 text-center" v-if="$route.query.status == 1">{{ $t('debt_list.Chiqim') }}</th>
                    <th class="w-36 text-center" v-if="$route.query.status == 0">{{ $t('debt_list.Kirm') }}</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item, index) in data" :key="index" @click="openModalAction(item)"
                    class="bg-white hover:bg-gray-50 cursor-pointer overflow-hidden">
                    <!-- Icon -->
                    <td class="p-2 sm:p-3 align-middle">
                      <span v-if="item.type == 1">
                        <!-- svg -->
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="40" height="40" rx="10" fill="#3182CE" />
                          <path
                            d="M30 33H15C14.4697 32.9995 13.9613 32.8037 13.5864 32.4555C13.2114 32.1073 13.0005 31.6353 13 31.1429V25.5714H15V31.1429H30V10.7143H21V8.85715H30C30.5303 8.85764 31.0387 9.05346 31.4136 9.40163C31.7886 9.74981 31.9995 10.2219 32 10.7143V31.1429C31.9995 31.6353 31.7886 32.1073 31.4136 32.4555C31.0387 32.8037 30.5303 32.9995 30 33Z"
                            fill="white" />
                          <path
                            d="M21 14.4286H28V16.2857H21V14.4286ZM20 19.0714H28V20.9286H20V19.0714ZM19 23.7143H28V25.5714H19V23.7143ZM13 22.7857C11.6743 22.7845 10.4033 22.2949 9.46593 21.4245C8.52853 20.5541 8.00132 19.3738 8 18.1429V7.92857H10V18.1429C10 18.8817 10.3161 19.5902 10.8787 20.1127C11.4413 20.6351 12.2044 20.9286 13 20.9286C13.7956 20.9286 14.5587 20.6351 15.1213 20.1127C15.6839 19.5902 16 18.8817 16 18.1429V9.78571C16 9.53944 15.8946 9.30326 15.7071 9.12912C15.5196 8.95497 15.2652 8.85714 15 8.85714C14.7348 8.85714 14.4804 8.95497 14.2929 9.12912C14.1054 9.30326 14 9.53944 14 9.78571V19.0714H12V9.78571C12 9.0469 12.3161 8.33834 12.8787 7.81592C13.4413 7.29349 14.2044 7 15 7C15.7956 7 16.5587 7.29349 17.1213 7.81592C17.6839 8.33834 18 9.0469 18 9.78571V18.1429C17.9987 19.3738 17.4715 20.5541 16.5341 21.4245C15.5967 22.2949 14.3257 22.7845 13 22.7857Z"
                            fill="white" />
                        </svg>
                      </span>
                      <span v-if="item.type == 2 || item.type == 3">
                        <!-- svg -->
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="40" height="40" rx="10" fill="#3182CE" />
                          <path
                            d="M32.8811 17.8774C32.9994 17.5809 33.0303 17.2547 32.9699 16.9401C32.9096 16.6254 32.7607 16.3363 32.542 16.1095L24.7296 8L22.5203 10.2934L27.6655 15.6343H8.00018V18.8781H31.4373C31.7463 18.8782 32.0484 18.7831 32.3054 18.605C32.5624 18.4269 32.7627 18.1737 32.8811 17.8774ZM8.11893 23.1226C8.00064 23.4191 7.96972 23.7453 8.03007 24.0599C8.09043 24.3746 8.23935 24.6637 8.45799 24.8905L16.2704 33L18.4797 30.7066L13.3345 25.3657H32.9998V22.1219H9.56266C9.25361 22.1216 8.95143 22.2165 8.69441 22.3947C8.43739 22.5729 8.23711 22.8262 8.11893 23.1226Z"
                            fill="white" />
                        </svg>
                      </span>
                      <span v-if="item.type == 4 || item.type == 5">
                        <!-- svg -->
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="40" height="40" rx="10" fill="#3182CE" />
                          <path
                            d="M8 15.8667V12.9333C8 12.1554 8.29266 11.4093 8.81359 10.8592C9.33453 10.309 10.0411 10 10.7778 10H13.5556M8 15.8667C9.85139 15.8667 13.5556 14.6933 13.5556 10M8 15.8667V21.7333M33 15.8667V12.9333C33 12.1554 32.7073 11.4093 32.1864 10.8592C31.6655 10.309 30.9589 10 30.2222 10H27.4444M33 15.8667C31.1486 15.8667 27.4444 14.6933 27.4444 10M33 15.8667V18.8M13.5556 10H27.4444M8 21.7333V24.6667C8 25.4446 8.29266 26.1907 8.81359 26.7408C9.33453 27.291 10.0411 27.6 10.7778 27.6H13.5556M8 21.7333C9.85139 21.7333 13.5556 22.9067 13.5556 27.6M13.5556 27.6H19.1111"
                            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path
                            d="M20.4999 21.7333C22.0341 21.7333 23.2777 20.42 23.2777 18.8C23.2777 17.18 22.0341 15.8667 20.4999 15.8667C18.9658 15.8667 17.7222 17.18 17.7222 18.8C17.7222 20.42 18.9658 21.7333 20.4999 21.7333Z"
                            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M28.8332 23.2V27.6M28.8332 32V27.6M28.8332 27.6H24.6665M28.8332 27.6H32.9998"
                            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                    </td>

                    <!-- Description -->
                    <td class="align-middle break-words text-gray-800 leading-snug min-w-[260px]">
                      <span v-if="item.type == 1">
                        <span v-if="$i18n.locale == 'uz'">{{ item.number }}-sonli qarz shartnomasi uchun</span>
                        <span v-if="$i18n.locale == 'kr'">{{ item.number }}-сонли қарз шартномаси учун</span>
                        <span v-if="$i18n.locale == 'ru'">Для договора займа № {{ item.number }}</span>
                      </span>

                      <span v-if="item.type == 2">
                        <p v-if="item.dtype == 2">
                          <span v-if="$i18n.locale == 'uz'">{{ item.dname }} mobil hisobiga o‘tkazma</span>
                          <span v-if="$i18n.locale == 'kr'">{{ item.dname }} мобил ҳисобига ўтказма</span>
                          <span v-if="$i18n.locale == 'ru'">Перевод на мобильный счет пользователя ({{ item.dname
                          }})</span>
                        </p>
                        <p v-if="item.dtype == 1">
                          <span v-if="$i18n.locale == 'uz'">{{ item.dcompany }} mobil hisobiga o‘tkazma</span>
                          <span v-if="$i18n.locale == 'kr'">{{ item.dcompany }} мобил ҳисобига ўтказма</span>
                          <span v-if="$i18n.locale == 'ru'">Перевод на мобильный счет {{ item.dcompany }}</span>
                        </p>
                      </span>

                      <span v-if="item.type == 3">
                        <p v-if="item.dtype == 2">
                          <span v-if="$i18n.locale == 'uz'">{{ item.dname }} mobil hisobidan o‘tkazma</span>
                          <span v-if="$i18n.locale == 'kr'">{{ item.dname }} мобил ҳисобидан ўтказма</span>
                          <span v-if="$i18n.locale == 'ru'">Перевод с мобильного счета пользователя ({{ item.dname
                          }})</span>
                        </p>
                        <p v-if="item.dtype == 1">
                          <span v-if="$i18n.locale == 'uz'">{{ item.dcompany }} mobil hisobidan o‘tkazma</span>
                          <span v-if="$i18n.locale == 'kr'">{{ item.dcompany }} мобил ҳисобидан ўтказма</span>
                          <span v-if="$i18n.locale == 'ru'">Перевод с мобильного счета пользователя ({{ item.dcompany
                          }})</span>
                        </p>
                      </span>

                      <span v-if="item.type == 4">{{ $t('a1.a27') }}</span>
                      <span v-if="item.type == 5">{{ $t('a1.a26') }}</span>
                    </td>

                    <!-- Date -->
                    <td class="align-middle whitespace-nowrap text-gray-600 text-center p-2 sm:p-3">
                      <span
                        style="background:#f5f5f5;border-radius:10px;padding:2px;text-align:center;padding-left:10px;padding-right:20px;"
                        class="inline-flex items-center space-x-1">
                        <img src="../../assets/img/Date.png" alt="" class="w-4 h-4" />
                        <span>{{ dateFormat(item.created_at) }} {{ item.time.slice(0, 5) }}</span>
                      </span>
                    </td>

                    <!-- Amount -->
                    <td class="align-middle text-left sm:text-center font-semibold p-3 sm:p-4 sm:pl-6"
                      :class="item.all == 1 ? 'text-red-600' : 'text-green-500'">
                      <span>
                        {{ item.all == 1 ? '-' : '+' }}
                        {{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} UZS
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="over" v-if="isModal || isLoginModal" @click="closeModal"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modallar (o'zgarmagan) -->
    <div v-if="modalData != null">
      <ModalOne @closeModal="modalOne = false" :data="modalData" :open-modal="modalOne" :key="indexModal" />
      <ModalFive @closeModal="modalFive = false" :data="modalData" :open-modal="modalFive" :key="indexModal" />
      <ModalTwo @closeModal="modalTwo = false" :data="modalData" :open-modal="modalTwo" :key="indexModal" />
      <ModalThree @closeModal="modalThree = false" :data="modalData" :open-modal="modalThree" :key="indexModal" />
      <ModalFour @closeModal="modalFour = false" :data="modalData" :open-modal="modalFour" :key="indexModal" />
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
import ModalOne from "./ModalOne.vue";
import ModalFive from "./ModalFive.vue";
import ModalTwo from "./ModalTwo.vue";
import ModalThree from "./ModalThree.vue";
import ModalFour from "./ModalFour.vue";

export default {
  middleware: "auth",
  data() {
    return {
      data: null,
      status: this.$route.query.status,
      modalOne: false,
      modalFour: false,
      modalTwo: false,
      modalFive: false,
      modalTwo: false,
      modalThree: false,
      modalData: null,
      indexModal: 1,
      creditor_format_name: null,
      debitor_format_name: null,
      ll: null
    };
  },
  computed: {
    isModal() {
      return this.$store.getters.isModal;
    },
  },
  async mounted() {
    let links = [{ title: "Qo'llab quvvatlash", name: "call-center" }];
    this.$store.commit("changeBreadCrumb", links);
    this.getData(1);
  },
  methods: {
    back() { },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    async click1(status) {
      this.getData(status)
    },
    async getData(st) {
      const dd = await this.$axios.$get(`/home/cs?status=${st}`);
      this.data = dd.data;
    },
    closeModal() {
      this.modalOne = false;
    },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    openModalAction(item) {
      this.modalData = item;

      if (item.type == 1) { this.modalOne = true; }
      if (item.type == 5) { this.modalFive = true; }
      if (item.type == 2) { this.modalTwo = true; }
      if (item.type == 4) { this.modalFour = true; }
      if (item.type == 3) { this.modalThree = true; }

      this.indexModal = this.indexModal + 1;
    },
  },
  components: { ModalOne, ModalFive, ModalTwo, ModalThree, ModalFour },
};
</script>

<style lang="scss">
.layout-container {
  display: none !important;
}

.MyPractices {
  &__Icon {
    display: grid;
    justify-content: center;
    align-items: start;
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    cursor: pointer;
  }

  cursor: pointer;

  &__table-row {
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 10px !important;
  }

  &__table-output-input {
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
  }
}

.MyPractices__cart-All {
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.z {
  padding: 0 50px;
}

.MyPractices__date div {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 10px;
  width: max-content;
  padding: 2px 8px;

  span {
    margin: 0 0 0 10px;
  }
}

.ModalForms__IconAndPirce {
  margin: 27px 0 0 0;
  display: flex;
  align-items: center;
  flex-direction: column;

  span {
    font-weight: 600;
    font-size: 16px;
    color: #48bb78;
    margin: 7px 0 0 0;
  }
}

.ModalForms__Info {
  span {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;
  }

  .ModalForms__name span {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;
    color: #3d95ff;
  }
}

/* Jadval stilini saqlab, qatorlar oralig'i */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  text-align: left;
}

td {
  border: 1px solid #ddd;
  padding: 8px;

  &:not(:first-child) {
    border-left: hidden;
  }

  &:not(:last-child) {
    border-right: hidden;
  }
}

/* Modal overlay */
.modal {
  position: fixed;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 410px;
  background: #fff;
  border-radius: 10px;
  z-index: 2;

  .bt2 {
    position: absolute;
    right: 0;
    top: 0;
  }
}

.over {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgb(0, 0, 0, 0.5);
  z-index: 1;
}

.uzs {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 1px;
  color: #48bb78;
}

.texts {
  h1 {
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 1px;
    color: #000000;
  }

  h2 {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;
    color: #3d95ff;
    margin-top: 4px;
  }

  h3 {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;
    color: #000000;
  }

  h5 {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;
    color: #ffffff;
  }

  .btn1 {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 20px auto;
    width: 200px;
    height: 40px;
    background: #3d95ff;
    border-radius: 5px;
  }

  .sender {
    flex-direction: column;
    align-items: flex-start;
    display: flex;
  }
}

/* ========= Responsive qo'shimchalar ========= */

/* Filter tugmalar mobilga mos */
@media (max-width: 640px) {
  .MyPractices__title .bt {
    width: calc(50% - 4px) !important;
  }
}

/* Jadval hujayralari mobil zichroq ko'rinsin */
@media (max-width: 640px) {
  td {
    padding: 6px;
  }

  table {
    border-spacing: 0 8px;
  }
}
</style>
