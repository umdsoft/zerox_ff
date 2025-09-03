<template>
  <div>
    <div style="padding: 0 0 30px 0" class="bg-white rounded tableList">
      <div>
        <div @click="$backWithLocale()" class="my-2 mx-6 hidden lg:inline-flex items-center" style="cursor:pointer">
          <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <polyline points="15 6 9 12 15 18" />
          </svg>
          <p class="text-blue-500">{{ $t('back') }}</p>
        </div>
        <div class="
            flex
            justify-between
            text-xs
            lg:text-sm
            items-center
            px-2

            w-full
          ">
          <h2 style="
              padding: 10px 0 0 20px;
              font-size: 14px;
              font-weight: bold ;
              line-height: 140%;
              color: #37363c;
            ">
            {{ $t('home.ozC') }}
          </h2>
        </div>
          <div class="p-5">
          <div class="flex flex-col sm:flex-row sm:justify-between gap-3">
            <!-- Search to'liq kenglik -->
            <SearchComponent class="w-full pr-4 sm:flex-1" @searchData="searchData" :getContracts="getContracts"
              :url="`/contract/near?type=creditor&page=${this.page + 1}&limit=${this.limit}`" />

            <!-- Tugmalar: mobil’da qidiruv ostida yonma-yon -->
            <div class=" sm:w-auto sm:grid-cols-none sm:flex sm:gap-2">
              <!-- Filtr -->

              <!-- Excel -->
              <button @click="exportExcel()"
                class="w-full text-white bg-t_primary text-center py-2.5 px-3.5 rounded sm:rounded text-[13px] sm:text-sm"
                style="background:#48bb78;border-radius:5px">
                <div class="flex justify-center items-center gap-1.5">
                  <IconExcel class="h-5 w-5" />
                  <span class="font-medium">{{ $t('debt_list.Upload') }}</span>
                </div>
              </button>
            </div>

          </div>
        </div>
      </div>

      <div class="px-4 sm:px-6">
        <!-- Wrapper -->
        <div v-if="contracts.length > 0" class="bg-white overflow-hidden">

          <!-- Header (desktop) -->
    <div
      class="hidden md:grid grid-cols-12 items-center px-4 py-3 bg-gray-50 text-[13px] font-medium text-gray-500">
      <div class="col-span-4 text-center">{{ $t('list.debitor') }}</div>
      <div class="col-span-2 text-center">{{ $t('debt_list.debtsumm') }}</div>
      <div class="col-span-2 text-center">{{ $t('debt_list.debta') }}</div>
      <div class="col-span-2 text-center">{{ $t('debt_list.debtol') }}</div>
      <div class="col-span-2 text-center">{{ $t('debt_list.debtc') }}</div>
    </div>


          <!-- Rows: kartalar -->
          <ul role="list" class="px-1  py-3 space-y-3">
            <li v-for="(item, index) in contracts" :key="index" @click="viewFullItem(item)"
              class="cursor-pointer rounded-xl ring-1 ring-gray-200 bg-white px-3 py-2 transition hover:shadow-sm hover:ring-blue-200">
              <!-- Desktop karta -->
              <div class="hidden md:grid grid-cols-12 items-center">
                <!-- Debitor + green dot -->
                <div class="col-span-4 flex items-center gap-2 min-w-0">
                  <span class="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  <nuxt-link :to="localePath({ name: 'user', query: { id: item.duid } })"
                    class="truncate text-sm text-gray-900 hover:text-blue-700 hover:underline">
                    {{ item.debitor_name }}
                  </nuxt-link>
                </div>

                <!-- Qarz miqdori -->
                <div class="col-span-2 text-left">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-100 text-gray-800">
                    <img src="@/assets/img/$.png" class="w-4 h-4" alt="" />
                    <b class="text-xs text-gray-900">
                      {{
                        item.amount &&
                        item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                      }} {{ item.currency }}
                    </b>
                  </span>
                </div>

                <!-- Qoldiq qarz miqdori -->
                <div class="col-span-2 text-left">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-100 text-gray-800">
                    <img src="@/assets/img/$.png" class="w-4 h-4" alt="" />
                    <b class="text-xs text-gray-900">
                      {{
                        item.residual_amount &&
                        item.residual_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                      }} {{ item.currency }}
                    </b>
                  </span>
                </div>

                <!-- Qarz olingan sana -->
                <div class="col-span-2 text-left">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-100 text-[13px] text-gray-800">
                    <img src="@/assets/img/Date.png" class="w-4 h-4" alt="" />
                    <b class="text-xs text-gray-900">{{ dateFormat(item.created_at) }}</b>
                  </span>
                </div>

                <!-- Qarz shartnomasi -->
                <div class="col-span-2 text-left">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-[13px] text-blue-700">
                    <img src="@/assets/img/book.png" class="w-4 h-4" alt="" />
                    <b class="text-xs">{{ item.number }}</b>
                  </span>
                </div>
              </div>

              <!-- Mobile karta (stacked) -->
              <div class="md:hidden">
                <!-- Ism -->
                <div class="flex items-center gap-2">
                  <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <nuxt-link :to="localePath({ name: 'user', query: { id: item.duid } })"
                    class="truncate text-[15px] text-gray-900 hover:text-blue-700 hover:underline">
                    {{ item.debitor_name }}
                  </nuxt-link>
                </div>

                <!-- Statlar -->
                <div class="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <div class="text-[11px] text-gray-500">{{ $t('debt_list.debtsumm') }}</div>
                    <span
                      class="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-gray-100 text-[12px] text-gray-800">
                      <img src="@/assets/img/$.png" class="w-3.5 h-3.5" alt="" />
                      <b class="text-sm text-gray-900">
                        {{
                          item.amount &&
                          item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                        }} {{ item.currency }}
                      </b>
                    </span>
                  </div>

                  <div>
                    <div class="text-[11px] text-gray-500">{{ $t('debt_list.debta') }}</div>
                    <span
                      class="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-gray-100 text-[12px] text-gray-800">
                      <img src="@/assets/img/$.png" class="w-3.5 h-3.5" alt="" />
                      <b class="text-sm text-gray-900">
                        {{
                          item.residual_amount &&
                          item.residual_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                        }} {{ item.currency }}
                      </b>
                    </span>
                  </div>

                  <div>
                    <div class="text-[11px] text-gray-500">{{ $t('debt_list.debtol') }}</div>
                    <span
                      class="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-gray-100 text-[12px] text-gray-800">
                      <img src="@/assets/img/Date.png" class="w-3.5 h-3.5" alt="" />
                      <b class="text-sm text-gray-900">{{ dateFormat(item.created_at) }}</b>
                    </span>
                  </div>

                  <div>
                    <div class="text-[11px] text-gray-500">{{ $t('debt_list.debtc') }}</div>
                    <span
                      class="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-[12px] text-blue-700">
                      <img src="@/assets/img/book.png" class="w-3.5 h-3.5" alt="" />
                      <span class="font-medium">{{ item.number }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Empty state -->
        <template v-else>
          <div class="p-3 rounded-lg text-center w-full bg-t_primary flex justify-center mt-3">
            <div class="inline-flex items-center text-white">
              <span class="mr-4">
                <img src="@/assets/img/datanot.png" alt="" />
              </span>
              {{ $t('result.malumot') }}
            </div>
          </div>
        </template>

        <!-- Pagination (o‘zgarmagan) -->
        <div class="pagination2 pagination">
          <pagination :total-items="length" :max-visible-pages="6" :items-per-page="limit" :page="page"
            @page-change="pageChange" />
        </div>
      </div>

      <div slot="pdf-content" ref="tableToExcel" class="tableToExcel" style="padding: 2rem">
        <div style="display: block" class="table-responsive uns">
          <table ref="exportable_table" class="table table-centered table-nowrap mt-4">
            <thead class="table-light">
              <tr>
                <th>№</th>
                <th>{{ $t('list.debitor') }}</th>
                <th>{{ $t('list.deb') }}</th>
                <th>{{ $t('debt_list.debtsumm') }}</th>
                <th>{{ $t('debt_list.debtol') }}</th>
                <th> {{ $t('debt_list.datee') }}</th>
                <th>{{ $t('debt_list.debtsum') }}</th>
                <th>{{ $t('debt_list.debtsums') }}</th>
                <th>{{ $t('debt_list.debtc') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in contracts" :key="i">
                <td>{{ page * limit + i + 1 }}</td>
                <td>{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</td>
                <td>
                  <span v-if="item.currency == 'UZS'">UZS</span>
                  <span v-if="item.currency == 'USD'">USD</span>
                </td>
                <td>{{ item.amount }}</td>
                <td>{{ dateFormat(item.created_at) }}</td>
                <td>{{ dateFormat(item.end_date) }}</td>
                <td>{{ item.inc }}</td>
                <td>{{ item.residual_amount }}</td>
                <td>{{ item.number }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ZModal v-if="viewModal" :width="520" @closeModal="viewModal = false">
        <template #modal_body v-if="viewData">
          <div class="text-center font-semibold text-xl mb-8" v-if="$i18n.locale != 'ru'">
            {{ viewData.number }} - {{ $t('debt_list.sonli') }}
          </div>
          <div class="text-center font-semibold text-xl mb-8" v-if="$i18n.locale == 'ru'">
            Договор займа № {{ viewData.number }}
          </div>

          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('list.debitor') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ viewData.debitor_name }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.debtsumm') }}: </div>
              <div class="text-base font-semibold text-t_primary">
                {{
                  viewData.amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                {{ viewData.currency }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.debtsum') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{
                  viewData.inc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                {{ viewData.currency }}
              </div>
            </div>
            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.debtsums') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{
                  viewData.residual_amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                {{ viewData.currency }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.debtol') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ dateBeauty(viewData.created_at) }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">
                {{ $t('debt_list.datee') }}:
              </div>
              <div class="text-base font-semibold text-t_primary">
                {{ dateBeauty(viewData.end_date) }}
              </div>
            </div>

            <nuxt-link :to="localePath({
              name: 'debt-refund',
              query: {
                contract: viewData.id,
              },
            })">
              <button class="
                  rounded-lg
                  justify-center
                  w-full
                  py-2.5
                  px-4
                  flex
                  items-center
                  bg-t_primary
                  text-white
                  mb-3.5
                  text-sm
                ">
                <img class="mr-2 w-5" src="@/assets/img/m1.png" alt="" />

                {{ $t('list.return') }}
              </button>
            </nuxt-link>
            <!--  -->
            <nuxt-link :to="localePath({
              name: 'debt-extend-ask',
              query: {
                id: viewData.id,
              },
            })">
              <button class="
                  rounded-lg
                  justify-center
                  w-full
                  py-2.5
                  px-4
                  flex
                  items-center
                  bg-t_primary
                  text-white
                  mb-3.5
                  text-sm
                ">
                <img class="mr-2 w-5" src="@/assets/img/m2.png" alt="" />
                {{ $t("action.a2") }}
              </button>
            </nuxt-link>
          </div>

          <div class="bottom-actions grid grid-cols-2 gap-6 mb-4">
            <a class="flex w-full"
              :href="`https://pdf.zerox.uz/index.php?id=${viewData.uid}&download=0&lang=${$i18n.locale}`">
              <button class="
                  rounded-lg
                  justify-center
                  w-full
                  py-2.5
                  px-4
                  flex
                  items-center
                  bg-t_primary
                  text-white text-sm
                ">
                <img class="mr-2 w-5" src="@/assets/img/pdf.png" alt="" />
                {{ $t('action.a7') }}
              </button>
            </a>

            <a :href="`https://pdf.zerox.uz/index.php?id=${viewData.uid}&lang=${$i18n.locale}&download=1`" download
              class="
                rounded-lg
                justify-center
                py-2.5
                px-2
                flex
                items-center
                bg-t_gr
                text-white text-sm
              ">
              <img class="mr-2 w-5" src="@/assets/img/pdf-2.png" alt="" />
              {{ $t('action.a8') }}
            </a>
          </div>
        </template>
      </ZModal>

      <ZModal v-if="sortModal" :width="400" @closeModal="sortModal = false">
        <template #modal_body>
          <div class="text-md font-bold mb-2 mt-4">{{ $t('debt_list.Sorting') }}</div>
          <div class="form-date-picker2 mb-5">
            <date-picker range value-type="YYYY-MM-DD" format="DD.MM.YYYY" v-model="sortDate"
              placeholder="Oraqliqni kiriting"></date-picker>
          </div>
          <button class="btn-z w-full" @click="searchDateFunction">
            {{ $t('searching') }}
          </button>
        </template>
      </ZModal>
    </div>
  </div>
</template>

<script>
import SearchComponent from "@/components/SearchComponent.vue";
import dateformat from "dateformat";
import XLSX from "xlsx";
import VueAdsPagination from "vue-ads-pagination";
import IconExcel from '@/components/icons/IconExcel';
import IconFilter from '@/components/icons/IconFilter'
export default {
  middleware: "auth",
  components: {
    SearchComponent,
    pagination: VueAdsPagination,
    IconExcel,
  },
  data() {
    return {
      sortDate: null,
      sortModal: false,
      viewModal: false,
      page: 0,
      count: 0,
      act: 0,
      pass: 0,
      limit: 10,
      length: 0,
      tableHeader: [
        "№",
        "Qarzdor nomi",
        "Qarz summasi",
        "Qarz berilgan sana",
        "Tugallangan sana",
        "Qaytarilgan summa",
        "Voz kechilgan summa",
        "Holat",
        "Hujjatlar",
      ],
      contracts: [],
      exportss: null,
      viewData: null,
    };
  },
  created() {
    if (!this.$auth.loggedIn) {
      return this.$router.push(this.localePath({ name: "auth-login" }));
    }
    this.$store.commit("changeBreadCrumb", [
      { title: "Olingan qarz (kreditor)", name: "Olingan qarz (kreditor)" },
    ]);
  },
  async mounted() {
    if (this.$auth.user.is_active !== 1) {
      return this.$router.push(this.localePath({ name: "index" }));
    }
    await this.getContracts();
  },
  methods: {
    nazad() {
      this.$router.push(this.localePath({ name: "index" }));
    },
    searchDateFunction() {
      this.getContracts();
      this.sortModal = false;
    },
    viewFullItem(item) {
      this.viewModal = true;
      this.viewData = item;
    },
    async exportExcel(type, fn, dl) {
      const date = new Date();
      const tableRef = this.$refs.tableToExcel;

      if (!tableRef) return;

      const workbook = XLSX.utils.table_to_book(tableRef, { sheet: "Sheet JS" });

      if (dl) {
        return XLSX.write(workbook, {
          bookType: type,
          bookSST: true,
          type: "base64",
        });
      }

      const fileName =
        fn ||
        `Muddati oz qolgan (kreditor) ${date.toLocaleString().slice(0, 10)}.${type || "xlsx"
        }`;

      XLSX.writeFile(workbook, fileName);
    },
    async setPage({ page, limit }) {
      this.page = page;
      this.limit = limit;
      await this.getContracts();
      window.scrollTo(0, 0);
    },
    async getContracts() {
      const [start, end] = this.sortDate && this.sortDate.length
        ? this.sortDate.map((d) => d || "0")
        : ["0", "0"];

      try {
        const response = await this.$axios.$get(
          `/contract/near?type=creditor&day=${this.$route.query.day}&page=${this.page + 1
          }&limit=${this.limit}&currency=${this.$route.query.type}`
        );
        const expResponse = await this.$axios.$get(
          `/contract/exp-near?type=creditor&currency=${this.$route.query.type}`
        );

        this.contracts = response.data;
        this.exportss = expResponse.data;
        this.act = response.act;
        this.pass = response.pass;
        this.length = response.count;
      } catch (error) {
        this.$toast.error(this.$t("a1.a42"));
      }
    },
    searchData(data) {
      this.contracts = data.data;
      this.length = data.count;
    },
    dateFormat(date) {
      return dateformat(date, "dd.mm.yyyy");
    },
    pageChange(page) {
      this.page = page;
      this.getContracts();
    },
  },
};
</script>

<style lang="scss" scoped>
.bt {
  width: max-content;
  padding: 0 10px;
}

.greenCercle,
.redCercle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.greenCercle {
  background: #48bb78;
}

.redCercle {
  background: #fe5e58;
}

.hisobot {
  width: 95%;
  background: #ffffff;
  box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
  border-radius: 10px;
  margin: 10px auto;

  .hisobot__body {
    padding: 16px 17px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .hisobot__name {
      font-weight: 400;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: 1px;
      color: #2d3748;
    }

    .hisobot__date,
    .hisobot__pirce {
      display: flex;
      align-items: center;
      padding: 3px 6px;
      border-radius: 15px;

      background: #f5f5f5;
      border-radius: 10px;

      span {
        font-weight: 400;
        font-size: 12px;
        color: #37363c;
        margin: 0 0 0 3px;
      }
    }

    .hisobot__ids {
      display: flex;
      align-items: center;

      span {
        font-weight: 600;
        font-size: 12px;
        line-height: 15px;
        color: #3182ce;
        margin: 0 0 0 5px;
      }
    }
  }
}
</style>
