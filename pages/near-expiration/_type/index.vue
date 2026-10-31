<template>
  <div class="min-h-screen">
    <!-- Page Header -->
    <div class="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
      <div class="header-gradient px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="goSection" class="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style="background: rgba(255,255,255,0.2);">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: rgba(255,255,255,0.2);">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-white">{{ pageTitle }}</h1>
            </div>
          </div>
          <div v-if="displayedContracts.length > 0" class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl" style="background: rgba(255,255,255,0.2);">
            <span class="text-white font-semibold text-lg">{{ displayedLength }}</span>
            <span class="text-sm" style="color: rgba(255,255,255,0.8);">{{ $t('debt_list.total') }}</span>
          </div>
        </div>
      </div>

      <!-- Stats & Actions Bar -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Search -->
          <SearchComponent
            class="w-full md:flex-1 md:max-w-md"
            localMode
            @search-input="localSearchQuery = $event"
          />

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button @click="sortModal = true"
              class="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {{ $t('debt_list.Sorting') }}
            </button>

            <!-- 30.09 (doc1 12–13-rasm): katta yashil "Excelga yuklash" O'RNIGA umumiy "Yuklab olish" chip'i -->
            <DownloadButton size="md" @click="exportExcel()" />
          </div>
        </div>
      </div>
    </div>

    <!-- Contracts List -->
    <div v-if="displayedContracts.length > 0" class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- Table Header (Desktop) -->
      <div class="hidden md:grid grid-cols-12 items-center px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-600 border-b border-gray-100">
        <div class="col-span-4">{{ columnParty }}</div>
        <div class="col-span-2">{{ columnAmount }}</div>
        <div class="col-span-2">{{ columnResidual }}</div>
        <div class="col-span-2">{{ columnDate }}</div>
        <div class="col-span-2">{{ columnContract }}</div>
      </div>

      <!-- Contract Items -->
      <div class="divide-y divide-gray-100">
        <div v-for="(item, index) in displayedContracts" :key="item.id || index" @click="viewFullItem(item)"
          class="cursor-pointer px-6 py-4 hover:bg-amber-50 transition-all duration-200 group">

          <!-- Desktop View -->
          <div class="hidden md:grid grid-cols-12 items-center">
            <div class="col-span-4 flex items-center gap-3 min-w-0">
              <span class="inline-block w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100"></span>
              <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(item) } })"
                class="truncate text-sm font-medium text-gray-900 hover:text-amber-600 transition-colors"
                @click.native.stop>
                {{ $fio(getPartyName(item)) }}
              </nuxt-link>
            </div>

            <div class="col-span-2">
              <span class="text-sm font-medium text-gray-800">
                {{ $formatNumber(item.amount) }} {{ item.currency }}
              </span>
            </div>

            <div class="col-span-2">
              <span class="text-sm font-medium text-orange-700">
                {{ $formatNumber(item.residual_amount) }} {{ item.currency }}
              </span>
            </div>

            <div class="col-span-2">
              <span class="text-sm text-gray-700">
                {{ dateFormat(item.contract_date || item.created_at) }}
              </span>
            </div>

            <div class="col-span-2">
              <span class="text-sm font-medium text-blue-700">
                {{ item.number }}
              </span>
            </div>
          </div>

          <!-- Mobile View -->
          <div class="md:hidden">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full bg-green-500 ring-2 ring-green-100"></span>
                <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(item) } })"
                  class="text-sm font-semibold text-gray-900 hover:text-amber-600"
                  @click.native.stop>
                  {{ $fio(getPartyName(item)) }}
                </nuxt-link>
              </div>
              <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">{{ item.number }}</span>
            </div>

            <ContractListAmountGrid :column-amount="columnAmount" :column-residual="columnResidual" :item="item" />
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <ContractListPagination v-if="!localSearchQuery" :length="length" :limit="limit" :page="page" @page-change="pageChange" />
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl shadow-sm p-8 lg:p-12 text-center">
      <div class="max-w-sm mx-auto">
        <div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('result.malumot') }}</h3>
        <p class="text-gray-500 text-sm mb-6">{{ $t('debt_list.empty_desc') }}</p>
        <nuxt-link
          :to="localePath({ name: 'index' })"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ $t('notification.go_home') }}
        </nuxt-link>
      </div>
    </div>

    <!-- Excel Export Table (Hidden) -->
    <div slot="pdf-content" ref="tableToExcel" class="tableToExcel" style="padding: 2rem; display: none;">
      <div style="display: block" class="table-responsive uns">
        <table ref="exportable_table" class="table table-centered table-nowrap mt-4">
          <thead class="table-light">
            <tr>
              <th>№</th>
              <th>{{ columnParty }}</th>
              <th>{{ columnCurrency }}</th>
              <th>{{ columnAmount }}</th>
              <th>{{ columnDate }}</th>
              <th>{{ columnEndDate }}</th>
              <th>{{ columnReturned }}</th>
              <th>{{ columnResidual }}</th>
              <th>{{ columnContract }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in (exportss || [])" :key="i">
              <td>{{ i + 1 }}</td>
              <td>{{ getPartyFullName(item) }}</td>
              <td>{{ item.currency }}</td>
              <td>{{ item.amount }}</td>
              <td data-t="s">{{ dateFormat(item.contract_date || item.created_at) }}</td>
              <td data-t="s">{{ dateFormat(item.end_date) }}</td>
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
        <div class="text-center font-semibold text-xl mb-8">
          {{ $t('page_labels.contract_modal_title', { number: viewData.number }) }}
        </div>

        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ columnParty }}:</div>
            <div class="text-base font-semibold text-t_primary">
              <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(viewData) } })"
                class="truncate hover:text-blue-700 hover:underline">
                {{ $fio(getPartyName(viewData)) }}
              </nuxt-link>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ columnAmount }}:</div>
            <div class="text-base font-semibold text-t_primary">
              {{ $formatNumber(viewData.amount) }} {{ viewData.currency }}
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ modalLabelReturned }}:</div>
            <div class="text-base font-semibold text-t_primary">
              {{ $formatNumber(viewData.inc) }} {{ viewData.currency }}
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ columnResidual }}:</div>
            <div class="text-base font-semibold text-t_primary">
              {{ $formatNumber(viewData.residual_amount) }} {{ viewData.currency }}
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ columnDate }}:</div>
            <div class="text-base font-semibold text-t_primary">
              {{ dateBeauty(viewData.contract_date || viewData.created_at) }}
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ modalLabelEndDate }}:</div>
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
                {{ labelExtendDebtCreditor }}
              </button>
            </nuxt-link>
          </template>

          <!-- Debitor Actions -->
          <template v-else>
            <nuxt-link :to="localePath({ name: 'debt-demand', query: { id: viewData.id } })">
              <button class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white mb-3.5 text-sm">
                <img class="mr-2 w-5" src="@/assets/img/m1.png" alt="" />
                {{ labelRequestPayment }}
              </button>
            </nuxt-link>

            <nuxt-link :to="localePath({ name: 'debt-extend', query: { id: viewData.id } })">
              <button class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white mb-3.5 text-sm">
                <img class="mr-2 w-5" src="@/assets/img/m2.png" alt="" />
                {{ labelExtendDebtDebitor }}
              </button>
            </nuxt-link>

            <nuxt-link :to="localePath({ name: 'debt-waiver', query: { id: viewData.id } })">
              <button class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white mb-3.5 text-sm">
                <svg class="w-5 h-5 mr-2" width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5303 4.76667C12.7511 4.76667 13.5745 5.80556 13.6494 7.33333H16.4067C16.3194 5.23111 15.0094 3.3 12.4017 2.67667V0H8.65876V2.64C8.17218 2.73778 7.72302 2.89667 7.28634 3.08L9.17031 4.92556C9.56956 4.82778 10.0312 4.76667 10.5303 4.76667ZM1.7592 1.12444L0 2.84778L4.29195 7.05222C4.29195 9.59445 6.2383 10.9878 9.17031 11.8311L13.5496 16.1211C13.1254 16.72 12.2396 17.2333 10.5303 17.2333C7.96008 17.2333 6.94947 16.1089 6.81223 14.6667H4.06737C4.21709 17.3433 6.26326 18.8467 8.65876 19.3478V22H12.4017V19.3722C13.5995 19.1522 14.685 18.7 15.471 18.0033L18.2408 20.7167L20 18.9933L1.7592 1.12444Z" fill="white" />
                </svg>
                <span>{{ labelDebtWaiver }}</span>
              </button>
            </nuxt-link>
          </template>
        </div>

        <div class="bottom-actions grid grid-cols-2 gap-6 mb-4">
          <a class="flex w-full" :href="$contractPdfUrl(viewData.uid)">
            <button class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white text-sm">
              <img class="mr-2 w-5" src="@/assets/img/pdf.png" alt="" />
              {{ labelViewContract }}
            </button>
          </a>

          <a :href="$contractPdfUrl(viewData.uid, 1)" download
            class="rounded-lg justify-center py-2.5 px-2 flex items-center bg-t_gr text-white text-sm">
            <img class="mr-2 w-5" src="@/assets/img/pdf-2.png" alt="" />
            {{ labelDownloadContract }}
          </a>
        </div>
      </template>
    </ZModal>

    <!-- Sort Modal -->
    <ZModal v-if="sortModal" :width="400" @closeModal="sortModal = false">
      <template #modal_body>
        <div class="text-lg font-bold mb-4 mt-2">{{ $t('debt_list.Sorting') }}</div>
        <div class="form-date-picker2 mb-5">
          <date-picker range value-type="YYYY-MM-DD" format="DD.MM.YYYY" v-model="sortDate"
            :placeholder="$t('placeholder.oraliq')"></date-picker>
        </div>
        <button class="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors" @click="searchDateFunction">
          {{ $t('searching') }}
        </button>
      </template>
    </ZModal>
  </div>
</template>

<script>
import contractListMixin from '@/mixins/contractListMixin'; // wave C: umumiy ro'yxat mantiqi
import ContractListAmountGrid from '~/components/contract-list/ContractListAmountGrid.vue';
import ContractListPagination from '~/components/contract-list/ContractListPagination.vue';
import SearchComponent from "@/components/SearchComponent.vue";
import { getNearList, getNearExport } from '@/api/contracts';
import DownloadButton from "@/components/ui/DownloadButton.vue"; // 30.09 (doc1 13-rasm): umumiy "Yuklab olish"
import { dateFormatMixin } from '@/mixins';
// SS-PERF (2026-09-25): xlsx (~480 KB) statik import emas — exportExcel() ichida dinamik yuklanadi

export default {
  name: 'NearExpirationContracts',

  middleware: "auth",

  components: {
    ContractListAmountGrid,
    ContractListPagination,
    DownloadButton,
    SearchComponent,
  },

  mixins: [dateFormatMixin, contractListMixin],

  data() {
    return {
    };
  },

  computed: {
    /**
     * Page title based on type
     */
    pageTitle() {
      return this.isCreditor
        ? this.$t('home.ozC')
        : this.$t('home.ozD');
    },

    /**
     * Column: party name
     */
    columnParty() {
      return this.isCreditor
        ? this.$t('page_labels.column_party_creditor')
        : this.$t('page_labels.column_party_debtor');
    },

    /**
     * Column: amount
     */
    columnAmount() { return this.$t('contract_labels.column_amount'); },
    columnResidual() { return this.$t('contract_labels.column_residual'); },
    columnDate() {
      return this.isCreditor
        ? this.$t('contract_labels.column_date_received')
        : this.$t('contract_labels.column_date_given');
    },
    columnCurrency() { return this.$t('contract_labels.column_currency'); },
    columnEndDate() { return this.$t('contract_labels.modal_end_date'); },
    columnReturned() { return this.$t('contract_labels.modal_returned'); },
    columnContract() { return this.$t('contract_labels.column_contract'); },
    searchUrl() {
      return `/contract/near?type=${this.contractType}&page=${this.page + 1}&limit=${this.limit}`;
    },
    excelFileName() {
      const date = new Date();
      const typeLabel = this.isCreditor ? "(kreditor)" : "(debitor)";
      return `Muddati oz qolgan ${typeLabel} ${date.toLocaleString().slice(0, 10)}.xlsx`;
    },
    labelViewContract() { return this.$t('contract_labels.modal_view_contract'); },
    labelDownloadContract() { return this.$t('contract_labels.modal_download_contract'); },
    labelRequestPayment() { return this.$t('contract_labels.modal_request_payment'); },
    labelExtendDebtCreditor() { return this.$t('contract_labels.modal_extend_debt_creditor'); },
    modalLabelReturned() { return this.$t('contract_labels.modal_returned'); },
    modalLabelEndDate() { return this.$t('contract_labels.modal_end_date'); },
    labelExtendDebtDebitor() { return this.$t('contract_labels.modal_extend_debt_debitor'); },
    labelDebtWaiver() { return this.$t('contract_labels.modal_debt_waiver'); },
  },

  created() {
    if (!this.$auth.loggedIn) {
      return this.$router.push(this.localePath({ name: "auth-login" }));
    }

    const breadcrumbTitle = this.isCreditor
      ? this.$t('result.ozmuddat')
      : this.$t('result.ozmuddat');

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
    async fetchContractPages() {
      const response = await getNearList(this.$axios, {
        type: this.contractType, day: this.$route.query.day || '', page: this.page + 1, limit: this.limit,
        currency: this.$route.query.type || '',
      });
      const expResponse = await getNearExport(this.$axios, {
        type: this.contractType, day: this.$route.query.day || '', currency: this.$route.query.type || '',
      });
      return { response, expResponse };
    },
    onContractsError() {
      this.$toast.error(this.$t("a1.a42"));
    },
  },
};
</script>

<style lang="scss" scoped>
.tableToExcel {
  display: none !important;
}

.header-gradient {
  background: linear-gradient(to right, #f59e0b, #ea580c);
}

.btn-filter {
  background: #f59e0b;
  &:hover {
    background: #d97706;
  }
}

.btn-export {
  background: #22c55e;
  &:hover {
    background: #16a34a;
  }
}

:deep(.modal-z-dialog) {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
