<template>
  <div class="min-h-screen bg-[#f5f7fb] pb-6">
    <div class="hidden md:block">
      <div style="min-height: 70vh" class="bg-white rounded-xl p-4 sm:p-6 lg:p-10 shadow-sm">
        <div @click="$goHomeWithLocale()" class="my-2 mx-6 hidden lg:inline-flex items-center cursor-pointer group">
          <IconChevronLeft svg-class="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
          <p class="text-blue-500 group-hover:text-blue-600 ml-2">{{ $t('back') }}</p>
        </div>
        <div class="MyPractices">
          <div class="MyPractices__contents">
            <div v-if="data != null" style="width: 100%" class="MyPractices__content">
              <!-- Filter tugmalar -->
              <div class="mb-5 flex flex-row-reverse items-center gap-3">
                <div class="flex rounded-full bg-white p-1 shadow-lg shadow-blue-100/40 ring-1 ring-slate-100">
                  <nuxt-link class="flex-1" :to="localePath({ name: 'jonatuvchi', query: { status: '0' } })">
                    <a @click="click1('0')" :class="[
                      'bt flex w-full items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300',
                      $route.query.status != '1'
                        ? 'bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-green-500 shadow-lg shadow-blue-200'
                        : 'text-green-500'
                    ]">
                      {{ $t('debt_list.Kirm') }}
                    </a>
                  </nuxt-link>

                  <nuxt-link class="flex-1" :to="localePath({ name: 'jonatuvchi', query: { status: '1' } })">
                    <a @click="click1('1')" :class="[
                      'bt flex w-full items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300',
                      $route.query.status != '0'
                        ? 'bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-red-500 shadow-lg shadow-blue-200'
                        : 'text-red-500'
                    ]">
                      {{ $t('debt_list.Chiqim') }}
                    </a>
                  </nuxt-link>
                </div>
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
                          class="inline-flex items-center gap-2 rounded-full bg-[#f8fafc] px-3 py-1 font-medium text-slate-500">
                          <img src="../../assets/img/Date.png" alt="" class="w-4 h-4" />
                          <span>{{ dateFormat(item.created_at) }} {{ item.time.slice(0, 5) }}</span>
                        </span>
                      </td>

                      <!-- Amount -->
                      <td class="align-middle text-left sm:text-center font-semibold p-3 sm:p-4 sm:pl-6"
                        :class="item.all == 1 ? 'text-red-500' : 'text-green-500'">
                        <span>
                          {{ item.all == 1 ? '-' : '+' }}
                          {{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} UZS
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile layout -->
    <div class="md:hidden">
      <div class="relative pb-10">
        <div class="-mt-8 space-y-6 px-5">
          <div class="rounded-3xl bg-white p-5 shadow-xl shadow-blue-100/60 ring-1 ring-white/70">
            <div class="flex flex-col gap-3">
              <div class="flex rounded-full bg-[#f8fafc] p-1 shadow-inner">
                <nuxt-link class="flex-1" :to="localePath({ name: 'jonatuvchi', query: { status: '0' } })">
                  <a @click="click1('0')" :class="[
                    'bt flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300',
                    $route.query.status != '1'
                      ? 'bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-green-500 shadow-lg shadow-blue-200'
                      : 'text-green-500'
                  ]">
                    {{ $t('debt_list.Kirm') }}
                  </a>
                </nuxt-link>
                <nuxt-link class="flex-1" :to="localePath({ name: 'jonatuvchi', query: { status: '1' } })">
                  <a @click="click1('1')" :class="[
                    'bt flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300',
                    $route.query.status != '0'
                      ? 'bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-red-500 shadow-lg shadow-blue-200'
                      : 'text-red-500'
                  ]">
                    {{ $t('debt_list.Chiqim') }}
                  </a>
                </nuxt-link>
              </div>
            </div>
          </div>

          <div v-if="data" class="space-y-4">
            <div v-for="(item, index) in data" :key="`mobile-card-${index}`" @click="openModalAction(item)"
              class="rounded-3xl bg-white p-3 shadow-md shadow-slate-200/60 ring-1 ring-slate-100 transition-all duration-200 active:scale-[0.99]">

              <div class="flex gap-2">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#dbeafe] to-white shadow">
                  <IconTransactionContract v-if="item.type == 1" svg-class="h-7 w-7" />
                  <IconTransactionTransfer v-else-if="item.type == 2 || item.type == 3" svg-class="h-7 w-7" />
                  <IconTransactionBank v-else svg-class="h-7 w-7" />
                </div>
                <div class="flex-1 min-w-0 mt-2">
                  <div class="text-[12px] font-normal leading-5 text-slate-900">
                    <template v-if="item.type == 1">
                      <span v-if="$i18n.locale == 'uz'">{{ item.number }}-sonli qarz shartnomasi uchun</span>
                      <span v-if="$i18n.locale == 'kr'">{{ item.number }}-сонли қарз шартномаси учун</span>
                      <span v-if="$i18n.locale == 'ru'">Для договора займа № {{ item.number }}</span>
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

                </div>

              </div>
              <div class="mt-4 flex justify-between text-xs text-slate-500">
                <span class="inline-flex items-center gap-2 rounded-full bg-[#f8fafc] px-3 py-1 font-normal">
                  <img src="../../assets/img/Date.png" alt="" class="h-3.5 w-3.5" />
                  <span>{{ dateFormat(item.created_at) }} {{ item.time.slice(0, 5) }}</span>
                </span>
                <span class="text-lg font-semibold tracking-wide"
                  :class="item.all == 1 ? 'text-red-500' : 'text-green-500'">
                  {{ item.all == 1 ? '-' : '+' }}
                  {{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} UZS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="over" v-if="isModal || isLoginModal" @click="closeModal"></div>

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
      this.modalTwo = false;
      this.modalThree = false;
      this.modalFour = false;
      this.modalFive = false;
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
