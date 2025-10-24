<template>
  <div>
    <div style="min-height: 70vh" class="bg-white rounded p-4 sm:p-6 lg:p-10">
      <div
        @click="$goHomeWithLocale()"
        class="my-2 mx-6 hidden lg:inline-flex items-center cursor-pointer group"
      >
        <IconChevronLeft svg-class="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
        <p class="text-blue-500 group-hover:text-blue-600 ml-2">{{ $t('back') }}</p>
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
            <div class="hidden md:block -mx-2 sm:mx-0 overflow-x-auto">
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
                      <IconTransactionContract v-if="item.type == 1" />
                      <IconTransactionTransfer v-else-if="item.type == 2 || item.type == 3" />
                      <IconTransactionBank v-else />
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

            <!-- Mobil kartalar -->
            <div class="md:hidden mt-4 space-y-3">
              <div
                v-for="(item, index) in data"
                :key="`mobile-${index}`"
                @click="openModalAction(item)"
                class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md active:ring-2 active:ring-blue-100"
              >
                <div class="flex items-start gap-3">
                  <div class="shrink-0">
                    <IconTransactionContract v-if="item.type == 1" />
                    <IconTransactionTransfer v-else-if="item.type == 2 || item.type == 3" />
                    <IconTransactionBank v-else />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-gray-900 leading-snug">
                      <template v-if="item.type == 1">
                        <span v-if="$i18n.locale == 'uz'">{{ item.number }}-sonli qarz shartnomasi uchun</span>
                        <span v-else-if="$i18n.locale == 'kr'">{{ item.number }}-сонли қарз шартномаси учун</span>
                        <span v-else>Для договора займа № {{ item.number }}</span>
                      </template>
                      <template v-else-if="item.type == 2">
                        <span v-if="item.dtype == 2">
                          <span v-if="$i18n.locale == 'uz'">{{ item.dname }} mobil hisobiga o‘tkazma</span>
                          <span v-else-if="$i18n.locale == 'kr'">{{ item.dname }} мобил ҳисобига ўтказма</span>
                          <span v-else>Перевод на мобильный счет пользователя ({{ item.dname }})</span>
                        </span>
                        <span v-else>
                          <span v-if="$i18n.locale == 'uz'">{{ item.dcompany }} mobil hisobiga o‘tkazma</span>
                          <span v-else-if="$i18n.locale == 'kr'">{{ item.dcompany }} мобил ҳисобига ўтказма</span>
                          <span v-else>Перевод на мобильный счет {{ item.dcompany }}</span>
                        </span>
                      </template>
                      <template v-else-if="item.type == 3">
                        <span v-if="item.dtype == 2">
                          <span v-if="$i18n.locale == 'uz'">{{ item.dname }} mobil hisobidan o‘tkazma</span>
                          <span v-else-if="$i18n.locale == 'kr'">{{ item.dname }} мобил ҳисобидан ўтказма</span>
                          <span v-else>Перевод с мобильного счета пользователя ({{ item.dname }})</span>
                        </span>
                        <span v-else>
                          <span v-if="$i18n.locale == 'uz'">{{ item.dcompany }} mobil hisobidan o‘tkazma</span>
                          <span v-else-if="$i18n.locale == 'kr'">{{ item.dcompany }} мобил ҳисобидан ўтказма</span>
                          <span v-else>Перевод с мобильного счета пользователя ({{ item.dcompany }})</span>
                        </span>
                      </template>
                      <template v-else-if="item.type == 4">
                        {{ $t('a1.a27') }}
                      </template>
                      <template v-else>
                        {{ $t('a1.a26') }}
                      </template>
                    </div>
                    <div class="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                        <img src="../../assets/img/Date.png" alt="" class="w-3.5 h-3.5" />
                        <span>{{ dateFormat(item.created_at) }} {{ item.time.slice(0, 5) }}</span>
                      </span>
                      <span
                        class="inline-flex items-center gap-1 rounded-full px-2.5 py-1"
                        :class="item.all == 1 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'"
                      >
                        {{ item.all == 1 ? $t('debt_list.Chiqim') : $t('debt_list.Kirm') }}
                      </span>
                    </div>
                  </div>
                  <div
                    class="ml-3 text-right text-base font-semibold"
                    :class="item.all == 1 ? 'text-red-600' : 'text-green-600'"
                  >
                    <span>
                      {{ item.all == 1 ? '-' : '+' }}
                      {{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }}
                      UZS
                    </span>
                  </div>
                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-if="item.number"
                    class="inline-flex items-center gap-1 rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-[12px] text-blue-700"
                  >
                    <img src="@/assets/img/book.png" class="w-3.5 h-3.5" alt="" />
                    <span class="font-medium">{{ item.number }}</span>
                  </span>
                </div>
              </div>
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
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue';
import IconTransactionContract from '@/components/icons/IconTransactionContract.vue';
import IconTransactionTransfer from '@/components/icons/IconTransactionTransfer.vue';
import IconTransactionBank from '@/components/icons/IconTransactionBank.vue';

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
  components: {
    ModalOne,
    ModalFive,
    ModalTwo,
    ModalThree,
    ModalFour,
    IconChevronLeft,
    IconTransactionContract,
    IconTransactionTransfer,
    IconTransactionBank,
  },
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
