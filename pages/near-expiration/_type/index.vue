<template>
  <div>
    <div style="padding: 0 0 30px 0" class="bg-white rounded tableList">
      <div>
        <div @click="$goHomeWithLocale()" class="my-2 mx-6 hidden lg:inline-flex items-center cursor-pointer group">
          <IconChevronLeft svg-class="h-5 w-5 text-blue-500 group-hover:text-blue-600" />
          <p class="text-blue-500 group-hover:text-blue-600 ml-2">{{ $t('back') }}</p>
        </div>
        <div class="flex justify-between text-xs lg:text-sm items-center px-2 w-full">
          <h2 style="padding: 10px 0 0 20px; font-size: 14px; font-weight: bold; line-height: 140%; color: #37363c;">
            {{ pageTitle }}
          </h2>
        </div>

        <div class="p-5">
          <div class="flex flex-col md:flex-row md:justify-between gap-3">
            <SearchComponent
              class="w-full pr-4 sm:flex-1"
              @searchData="searchData"
              :getContracts="getContracts"
              :url="searchUrl"
            />

            <div class="hidden md:flex md:w-auto md:gap-2">
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
        <div v-if="contracts.length > 0" class="bg-white overflow-hidden">
          <!-- Header (desktop) -->
          <div class="hidden md:grid grid-cols-12 items-center px-4 py-3 bg-gray-50 text-[13px] font-medium text-gray-500">
            <div class="col-span-4 text-center">{{ partyLabel }}</div>
            <div class="col-span-2 text-center">{{ $t('debt_list.debtsumm') }}</div>
            <div class="col-span-2 text-center">{{ $t('debt_list.debta') }}</div>
            <div class="col-span-2 text-center">{{ isCreditor ? $t('debt_list.debtol') : $t('debt_list.date') }}</div>
            <div class="col-span-2 text-center">{{ $t('debt_list.debtc') }}</div>
          </div>

          <!-- Rows -->
          <ul role="list" class="px-1 py-3 space-y-3">
            <li v-for="(item, index) in contracts" :key="index" @click="viewFullItem(item)"
              class="cursor-pointer rounded-xl ring-1 ring-gray-200 bg-white px-3 py-2 transition hover:shadow-sm hover:ring-blue-200">

              <!-- Desktop karta -->
              <div class="hidden md:grid grid-cols-12 items-center">
                <div class="col-span-4 flex items-center gap-2 min-w-0">
                  <span :class="getStatusDotClass(item)"></span>
                  <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(item) } })"
                    class="truncate text-sm text-gray-900 hover:text-blue-700 hover:underline">
                    {{ getPartyName(item) }}
                  </nuxt-link>
                </div>

                <div class="col-span-2 text-left">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-100 text-gray-800">
                    <img src="@/assets/img/$.png" class="w-4 h-4" alt="" />
                    <b class="text-xs text-gray-900">{{ formatAmount(item.amount) }} {{ item.currency }}</b>
                  </span>
                </div>

                <div class="col-span-2 text-left">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-100 text-gray-800">
                    <img src="@/assets/img/$.png" class="w-4 h-4" alt="" />
                    <b class="text-xs text-gray-900">{{ formatAmount(item.residual_amount) }} {{ item.currency }}</b>
                  </span>
                </div>

                <div class="col-span-2 text-left">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-100 text-[13px] text-gray-800">
                    <img src="@/assets/img/Date.png" class="w-4 h-4" alt="" />
                    <b class="text-xs text-gray-900">{{ dateFormat(item.created_at) }}</b>
                  </span>
                </div>

                <div class="col-span-2 text-left">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-[13px] text-blue-700">
                    <img src="@/assets/img/book.png" class="w-4 h-4" alt="" />
                    <b class="text-xs">{{ item.number }}</b>
                  </span>
                </div>
              </div>

              <!-- Mobile karta -->
              <div class="md:hidden">
                <div class="flex items-center gap-2">
                  <span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                  <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(item) } })"
                    class="truncate text-[15px] text-gray-900 hover:text-blue-700 hover:underline">
                    {{ getPartyName(item) }}
                  </nuxt-link>
                </div>

                <div class="mt-3 flex flex-wrap gap-2">
                  <div class="w-full" style="flex: 1 1 calc(50% - 0.5rem)">
                    <div class="text-[11px] text-gray-500">{{ $t('debt_list.debtsumm') }}</div>
                    <span class="mt-1 inline-flex w-full items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-100 px-3 py-1.5 text-[12px] text-gray-800">
                      <img src="@/assets/img/$.png" class="w-3.5 h-3.5" alt="" />
                      <b class="text-[13px] text-gray-900">{{ formatAmount(item.amount) }} {{ item.currency }}</b>
                    </span>
                  </div>

                  <div class="w-full" style="flex: 1 1 calc(50% - 0.5rem)">
                    <div class="text-[11px] text-gray-500">{{ $t('debt_list.debtc') }}</div>
                    <span class="mt-1 inline-flex w-full items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-[12px] text-blue-700">
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

        <!-- Pagination -->
        <div class="pagination2 pagination">
          <pagination
            :total-items="length"
            :max-visible-pages="6"
            :items-per-page="limit"
            :page="page"
            @page-change="pageChange"
          />
        </div>
      </div>

      <!-- Excel Export Table (Hidden) -->
      <div slot="pdf-content" ref="tableToExcel" class="tableToExcel" style="padding: 2rem">
        <div style="display: block" class="table-responsive uns">
          <table ref="exportable_table" class="table table-centered table-nowrap mt-4">
            <thead class="table-light">
              <tr>
                <th>№</th>
                <th>{{ partyLabel }}</th>
                <th>{{ $t('list.deb') }}</th>
                <th>{{ $t('debt_list.debtsumm') }}</th>
                <th>{{ isCreditor ? $t('debt_list.debtol') : $t('debt_list.date') }}</th>
                <th>{{ $t('debt_list.datee') }}</th>
                <th>{{ $t('debt_list.debtsum') }}</th>
                <th>{{ $t('debt_list.debtsums') }}</th>
                <th>{{ $t('debt_list.debtc') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in contracts" :key="i">
                <td>{{ page * limit + i + 1 }}</td>
                <td>{{ getPartyFullName(item) }}</td>
                <td>{{ item.currency }}</td>
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

      <!-- View Modal -->
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
              <div class="text-base font-medium mr-3">{{ partyLabel }}:</div>
              <div class="text-base font-semibold text-t_primary">
                <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(viewData) } })"
                  class="truncate hover:text-blue-700 hover:underline">
                  {{ getPartyName(viewData) }}
                </nuxt-link>
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.debtsumm') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ formatAmount(viewData.amount) }} {{ viewData.currency }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.debtsum') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ formatAmount(viewData.inc) }} {{ viewData.currency }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.debtsums') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ formatAmount(viewData.residual_amount) }} {{ viewData.currency }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ isCreditor ? $t('debt_list.debtol') : $t('debt_list.date') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ dateBeauty(viewData.created_at) }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.datee') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ dateBeauty(viewData.end_date) }}
              </div>
            </div>

            <!-- Creditor Actions -->
            <template v-if="isCreditor">
              <nuxt-link :to="localePath({ name: 'debt-refund', query: { contract: viewData.id } })">
                <button class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white mb-3.5 text-sm">
                  <img class="mr-2 w-5" src="@/assets/img/m1.png" alt="" />
                  {{ $t('list.return') }}
                </button>
              </nuxt-link>

              <nuxt-link :to="localePath({ name: 'debt-extend-ask', query: { id: viewData.id } })">
                <button class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white mb-3.5 text-sm">
                  <img class="mr-2 w-5" src="@/assets/img/m2.png" alt="" />
                  {{ $t("action.a2") }}
                </button>
              </nuxt-link>
            </template>

            <!-- Debitor Actions -->
            <template v-else>
              <nuxt-link :to="localePath({ name: 'debt-demand', query: { id: viewData.id } })">
                <button class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white mb-3.5 text-sm">
                  <img class="mr-2 w-5" src="@/assets/img/m1.png" alt="" />
                  {{ $t('action.a1') }}
                </button>
              </nuxt-link>

              <nuxt-link :to="localePath({ name: 'debt-extend', query: { id: viewData.id } })">
                <button class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white mb-3.5 text-sm">
                  <img class="mr-2 w-5" src="@/assets/img/m2.png" alt="" />
                  {{ $t('action.a4') }}
                </button>
              </nuxt-link>

              <nuxt-link :to="localePath({ name: 'debt-waiver', query: { id: viewData.id } })">
                <button class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white mb-3.5 text-sm">
                  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5303 4.76667C12.7511 4.76667 13.5745 5.80556 13.6494 7.33333H16.4067C16.3194 5.23111 15.0094 3.3 12.4017 2.67667V0H8.65876V2.64C8.17218 2.73778 7.72302 2.89667 7.28634 3.08L9.17031 4.92556C9.56956 4.82778 10.0312 4.76667 10.5303 4.76667ZM1.7592 1.12444L0 2.84778L4.29195 7.05222C4.29195 9.59445 6.2383 10.9878 9.17031 11.8311L13.5496 16.1211C13.1254 16.72 12.2396 17.2333 10.5303 17.2333C7.96008 17.2333 6.94947 16.1089 6.81223 14.6667H4.06737C4.21709 17.3433 6.26326 18.8467 8.65876 19.3478V22H12.4017V19.3722C13.5995 19.1522 14.685 18.7 15.471 18.0033L18.2408 20.7167L20 18.9933L1.7592 1.12444Z" fill="white" />
                  </svg>
                  <span class="ml-2">{{ $t('action.a5') }}</span>
                </button>
              </nuxt-link>
            </template>
          </div>

          <div class="bottom-actions grid grid-cols-2 gap-6 mb-4">
            <a class="flex w-full" :href="`https://pdf.zerox.uz/index.php?id=${viewData.uid}&download=0&lang=${$i18n.locale}`">
              <button class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white text-sm">
                <img class="mr-2 w-5" src="@/assets/img/pdf.png" alt="" />
                {{ $t('action.a7') }}
              </button>
            </a>

            <a :href="`https://pdf.zerox.uz/index.php?id=${viewData.uid}&lang=${$i18n.locale}&download=1`" download
              class="rounded-lg justify-center py-2.5 px-2 flex items-center bg-t_gr text-white text-sm">
              <img class="mr-2 w-5" src="@/assets/img/pdf-2.png" alt="" />
              {{ $t('action.a8') }}
            </a>
          </div>
        </template>
      </ZModal>

      <!-- Sort Modal -->
      <ZModal v-if="sortModal" :width="400" @closeModal="sortModal = false">
        <template #modal_body>
          <div class="text-md font-bold mb-2 mt-4">{{ $t('debt_list.Sorting') }}</div>
          <div class="form-date-picker2 mb-5">
            <date-picker range value-type="YYYY-MM-DD" format="DD.MM.YYYY" v-model="sortDate"
              :placeholder="$t('placeholder.oraliq')"></date-picker>
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
import VueAdsPagination from "vue-ads-pagination";
import IconChevronLeft from '@/components/icons/IconChevronLeft';
import IconExcel from '@/components/icons/IconExcel';
import { dateFormatMixin } from '@/mixins';
import XLSX from "xlsx";

export default {
  name: 'NearExpirationContracts',

  middleware: "auth",

  components: {
    SearchComponent,
    pagination: VueAdsPagination,
    IconChevronLeft,
    IconExcel,
  },

  mixins: [dateFormatMixin],

  data() {
    return {
      sortDate: null,
      sortModal: false,
      viewModal: false,
      page: 0,
      limit: 10,
      length: 0,
      contracts: [],
      exportss: null,
      viewData: null,
    };
  },

  computed: {
    /**
     * Get contract type from route params
     */
    contractType() {
      return this.$route.params.type || 'creditor';
    },

    /**
     * Check if current view is creditor
     */
    isCreditor() {
      return this.contractType === 'creditor';
    },

    /**
     * Page title based on type
     */
    pageTitle() {
      return this.isCreditor
        ? this.$t('home.ozC')
        : this.$t('home.ozD');
    },

    /**
     * Party label (debitor/creditor)
     */
    partyLabel() {
      return this.isCreditor
        ? this.$t('list.debitor')
        : this.$t('list.creditor');
    },

    /**
     * Search component URL
     */
    searchUrl() {
      return `/contract/near?type=${this.contractType}&page=${this.page + 1}&limit=${this.limit}`;
    },

    /**
     * Excel export filename
     */
    excelFileName() {
      const date = new Date();
      const typeLabel = this.isCreditor ? "(kreditor)" : "(debitor)";
      return `Muddati oz qolgan ${typeLabel} ${date.toLocaleString().slice(0, 10)}.xlsx`;
    },
  },

  created() {
    if (!this.$auth.loggedIn) {
      return this.$router.push(this.localePath({ name: "auth-login" }));
    }

    const breadcrumbTitle = this.isCreditor
      ? "Muddati oz qolgan (kreditor)"
      : "Muddati oz qolgan (debitor)";

    this.$store.commit("changeBreadCrumb", [
      { title: breadcrumbTitle, name: breadcrumbTitle },
    ]);
  },

  async mounted() {
    if (this.$auth.user.is_active !== 1) {
      return this.$router.push(this.localePath({ name: "index" }));
    }
    await this.getContracts();
  },

  methods: {
    /**
     * Get party UID based on contract type
     */
    getPartyUid(item) {
      return this.isCreditor ? item.duid : item.cuid;
    },

    /**
     * Get party name based on contract type
     */
    getPartyName(item) {
      return this.isCreditor ? item.debitor_name : item.creditor_name;
    },

    /**
     * Get party full name for export
     */
    getPartyFullName(item) {
      if (this.isCreditor) {
        return `${item.d_last_name} ${item.d_first_name} ${item.d_middle_name}`;
      }
      return item.creditor_name;
    },

    /**
     * Get status dot class based on item status
     */
    getStatusDotClass(item) {
      if (item.status === 2) {
        return 'inline-block w-2.5 h-2.5 rounded-full bg-green-500';
      }
      if (item.status === 3 || item.status === 4) {
        return 'inline-block w-2.5 h-2.5 rounded-full bg-red-500';
      }
      return 'inline-block w-2.5 h-2.5 rounded-full bg-green-500';
    },

    /**
     * Format amount with thousand separators
     */
    formatAmount(amount) {
      if (!amount) return '0';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },

    /**
     * Search by date range
     */
    searchDateFunction() {
      this.getContracts();
      this.sortModal = false;
    },

    /**
     * Open view modal with item data
     */
    viewFullItem(item) {
      this.viewModal = true;
      this.viewData = item;
    },

    /**
     * Export contracts to Excel
     */
    async exportExcel(type, fn, dl) {
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

      XLSX.writeFile(workbook, fn || this.excelFileName);
    },

    /**
     * Load contracts from API
     */
    async getContracts() {
      try {
        const response = await this.$axios.$get(
          `/contract/near?type=${this.contractType}&day=${this.$route.query.day}&page=${this.page + 1}&limit=${this.limit}&currency=${this.$route.query.type}`
        );
        const expResponse = await this.$axios.$get(
          `/contract/exp-near?type=${this.contractType}&currency=${this.$route.query.type}`
        );

        this.contracts = response.data;
        this.exportss = expResponse.data;
        this.length = response.count;
      } catch (error) {
        this.$toast.error(this.$t("a1.a42"));
      }
    },

    /**
     * Handle search results
     */
    searchData(data) {
      this.contracts = data.data;
      this.length = data.count;
    },

    /**
     * Handle page change
     */
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
</style>
