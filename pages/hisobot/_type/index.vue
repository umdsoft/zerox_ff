<template>
  <div class="min-h-screen">
    <!-- Page Header -->
    <div class="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
      <div :class="['px-6 py-5', isCreditor ? 'bg-green-600' : 'bg-blue-600']">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button class="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all" @click="goSection">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-white">{{ pageTitle }}</h1>
              <p :class="[isCreditor ? 'text-green-100' : 'text-blue-100', 'text-sm mt-0.5']">{{ pageSubtitle }}</p>
            </div>
          </div>
          <div v-if="displayedContracts.length > 0" class="hidden sm:flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-xl">
            <span class="text-white font-semibold text-lg">{{ displayedLength }}</span>
            <span :class="[isCreditor ? 'text-green-100' : 'text-blue-100', 'text-sm']">{{ labelContractCount }}</span>
          </div>
        </div>
      </div>

      <!-- Stats & Actions Bar -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <ContractListActionRow :local-search-query-value.sync="localSearchQuery" :sort-modal-value.sync="sortModal" @export-excel="exportExcel" />
      </div>

      <!-- Status Tabs -->
      <div class="border-t border-gray-100 px-6 py-3">
        <div class="flex items-center justify-center gap-4 flex-wrap">
          <button :class="['flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all',
              status == 'all' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100']"
            @click="changeStatus('all')">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            {{ labelTotalContracts }}
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="status == 'all' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'">{{ length }}</span>
          </button>
          <button :class="['flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all',
              status == '1' ? 'bg-green-100 text-green-700 shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100']"
            @click="changeStatus('1')">
            <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            {{ $t('debt_list.totals') }}
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="status == '1' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'">{{ act }}</span>
          </button>
          <button :class="['flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all',
              status == '2' ? 'bg-red-100 text-red-700 shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100']"
            @click="changeStatus('2')">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            {{ $t('debt_list.totalss') }}
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="status == '2' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'">{{ pass }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contracts List -->
    <div v-if="displayedContracts.length > 0" class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- Table Header (Desktop) -->
      <div class="hidden md:grid grid-cols-12 items-center px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-600 border-b border-gray-100">
        <div class="col-span-4 text-left">{{ partyLabel }}</div>
        <div class="col-span-2 text-left">{{ amountHeader }}</div>
        <div class="col-span-2 text-left">{{ isCreditor ? $t('debt_list.debtol') : $t('debt_list.date') }}</div>
        <div class="col-span-2 text-left">{{ $t('debt_list.datt') }}</div>
        <div class="col-span-2 text-left">{{ contractHeader }}</div>
      </div>

      <!-- Contract Items -->
      <div class="divide-y divide-gray-100">
        <div v-for="(item, index) in displayedContracts" :key="item.id || index" class="cursor-pointer px-6 py-4 hover:bg-blue-50 transition-all duration-200 group"
          @click="viewFullItem(item)">

          <!-- Desktop View -->
          <div class="hidden md:grid grid-cols-12 items-center">
            <div class="col-span-4 flex items-center gap-3 min-w-0">
              <span v-if="item.status == 2" class="inline-block w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100"></span>
              <span v-if="item.status == 3 || item.status == 4" class="inline-block w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100"></span>
              <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(item) } })"
                class="truncate text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                @click.native.stop>
                {{ $fio(getPartyName(item)) }}
              </nuxt-link>
            </div>

            <div class="col-span-2 text-left">
              <span class="text-sm text-gray-800">
                {{ $formatNumber(item.amount) }} {{ item.currency }}
              </span>
            </div>

            <div class="col-span-2 text-left">
              <span class="text-sm text-gray-700">
                {{ dateFormat(item.contract_date || item.created_at) }}
              </span>
            </div>

            <div class="col-span-2 text-left">
              <span class="text-sm text-gray-700">
                {{ dateFormat(item.sana) }}
              </span>
            </div>

            <div class="col-span-2 text-left">
              <span class="text-sm text-blue-600 font-medium">
                {{ item.number }}
              </span>
            </div>
          </div>

          <!-- Mobile View -->
          <div class="md:hidden">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span v-if="item.status == 2" class="inline-block w-3 h-3 rounded-full bg-green-500 ring-2 ring-green-100"></span>
                <span v-else-if="item.status == 3 || item.status == 4" class="inline-block w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-100"></span>
                <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(item) } })"
                  class="text-sm font-semibold text-gray-900 hover:text-blue-600"
                  @click.native.stop>
                  {{ $fio(getPartyName(item)) }}
                </nuxt-link>
              </div>
              <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">{{ item.number }}</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 rounded-xl p-3">
                <div class="text-xs text-gray-500 mb-1">{{ amountHeader }}</div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ $formatNumber(item.amount) }} {{ item.currency }}
                </div>
              </div>
              <div class="bg-gray-50 rounded-xl p-3">
                <div class="text-xs text-gray-500 mb-1">{{ isCreditor ? $t('debt_list.debtol') : $t('debt_list.date') }}</div>
                <div class="text-sm font-semibold text-gray-900">{{ dateFormat(item.contract_date || item.created_at) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <ContractListPagination v-if="!localSearchQuery" :length="length" :limit="limit" :page="page" @page-change="pageChange" />
    </div>

    <!-- Empty State -->
    <div v-if="displayedContracts.length === 0 && !localSearchQuery" class="bg-white rounded-2xl shadow-sm p-8 lg:p-12 text-center">
      <div class="max-w-sm mx-auto">
        <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('debt_list.empty_title') }}</h3>
        <p class="text-gray-500 text-sm mb-6">{{ $t('result.malumot') }}</p>
        <ContractListGoHome />
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
              <th>{{ amountHeader }}</th>
              <th>{{ isCreditor ? $t('debt_list.debtol') : $t('debt_list.date') }}</th>
              <th>{{ $t('debt_list.datt') }}</th>
              <th>{{ labelReturnedAmount }}</th>
              <th>{{ $t('debt_list.summy') }}</th>
              <th>{{ $t('debt_list.Status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in (exportss || [])" :key="i">
              <td>{{ i + 1 }}</td>
              <td>{{ getPartyFullName(item) }}</td>
              <td>{{ item.currency }}</td>
              <td>{{ item.amount }}</td>
              <td data-t="s">{{ dateFormat(item.contract_date || item.created_at) }}</td>
              <td data-t="s">{{ dateFormat(item.sana) }}</td>
              <td>
                <span v-if="item.status == '2'">{{ item.inc }}</span>
                <span v-if="item.status == '3' || item.status == '4'">0</span>
              </td>
              <td>
                <span v-if="item.status == '2'">{{ item.vos_summa }}</span>
                <span v-if="item.status == '3' || item.status == '4'">0</span>
              </td>
              <td>
                <span v-if="item.status == '2'" class="text-green-500">{{ $t('home.Completeds') }}</span>
                <span v-if="item.status == '3' || item.status == '4'" class="text-red-500">{{ $t('home.Rejected') }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Modal -->
    <ZModal v-if="viewModal" :width="520" @closeModal="viewModal = false">
      <template v-if="viewData" #modal_body>
        <div class="text-center font-semibold text-xl mb-8">
          {{ $t('page_labels.contract_modal_title', { number: viewData.number }) }}
        </div>

        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ partyLabel }}:</div>
            <div class="text-base font-semibold text-t_primary">
              <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(viewData) } })"
                class="truncate hover:text-blue-700 hover:underline">
                {{ $fio(getPartyName(viewData)) }}
              </nuxt-link>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ labelLoanAmount }}:</div>
            <div class="text-base font-semibold text-t_primary">
              <span v-if="viewData.amount != null">{{ $formatNumber(viewData.amount) }} {{ viewData.currency }}</span>
              <span v-if="viewData.amount == null">-</span>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ labelReturnedAmount }}:</div>
            <div class="text-base font-semibold text-t_primary">
              <span v-if="viewData.inc != null">{{ $formatNumber(viewData.inc) }} {{ viewData.currency }}</span>
              <span v-if="viewData.inc == null">-</span>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ labelForgivenAmount }}:</div>
            <div class="text-base font-semibold text-t_primary">
              <span v-if="viewData.vos_summa != null">{{ $formatNumber(viewData.vos_summa) }} {{ viewData.currency }}</span>
              <span v-if="viewData.vos_summa == null">-</span>
            </div>
          </div>

          <div v-if="viewData.status == '2'" class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ isCreditor ? $t('debt_list.debtol') : $t('debt_list.date') }}:</div>
            <div class="text-base font-semibold text-t_primary">
              {{ dateBeauty(viewData.contract_date || viewData.created_at) }}
            </div>
          </div>

          <div v-if="viewData.status == '3' || viewData.status == '4'" class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ $t('comp.time') }}:</div>
            <div class="text-base font-semibold text-t_primary">
              {{ dateBeauty(viewData.contract_date || viewData.created_at) }}
            </div>
          </div>

          <div v-if="viewData.status == '2'" class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ $t('debt_list.datt') }}:</div>
            <div class="text-base font-semibold text-t_primary">
              {{ dateBeauty(viewData.sana) }}
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ labelStatus }}:</div>
            <div class="text-base font-semibold text-t_primary">
              <span v-if="viewData.status == '2'" class="text-green-500">{{ $t('home.Completeds') }}</span>
              <span v-if="viewData.status == '3' || viewData.status == '4'" class="text-red-500">{{ $t('home.Rejected') }}</span>
            </div>
          </div>
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
    <ContractListSortModal v-if="sortModal" :sort-date-value.sync="sortDate" @close="sortModal = false" @search="searchDateFunction" />
  </div>
</template>

<script>
import ContractListSortModal from '~/components/contract-list/ContractListSortModal.vue';
import ContractListActionRow from '~/components/contract-list/ContractListActionRow.vue';
import contractListMixin from '@/mixins/contractListMixin'; // wave C: umumiy ro'yxat mantiqi
import ContractListGoHome from '~/components/contract-list/ContractListGoHome.vue';
import ContractListPagination from '~/components/contract-list/ContractListPagination.vue';
import { getReportList, getReportExport } from '@/api/contracts';
import { dateFormatMixin } from '@/mixins';
// SS-PERF (2026-09-25): xlsx (~480 KB) statik import emas — exportExcel() ichida dinamik yuklanadi

export default {
  name: 'ReportContracts',

  middleware: "auth",

  components: {
    ContractListSortModal,
    ContractListActionRow,
    ContractListGoHome,
    ContractListPagination,
  },

  mixins: [dateFormatMixin, contractListMixin],

  data() {
    return {
      status: "all",
      act: 0,
      pass: 0,
    };
  },

  computed: {
    pageTitle() {
      return this.$t('contract_labels.report_title');
    },

    labelTotalContracts() {
      return this.$t('contract_labels.total_contracts');
    },

    labelContractCount() {
      return this.$t('contract_labels.contract_count');
    },

    /**
     * Page subtitle based on type
     */
    pageSubtitle() {
      return this.isCreditor
        ? this.$t('debt_list.subtitle_report_creditor') || "Kreditor shartnomalar hisoboti"
        : this.$t('debt_list.subtitle_report_debitor');
    },

    /**
     * Party label (debitor/creditor)
     */
    partyLabel() {
      return this.isCreditor
        ? this.$t('list.creditor')
        : this.$t('list.debitor');
    },

    /**
     * Search component URL
     */
    searchUrl() {
      return `/contract/report/search?status=${this.status}&type=${this.contractType}&page=${this.page + 1}&limit=${this.limit}`;
    },

    /**
     * Excel export filename
     */
    excelFileName() {
      const date = new Date();
      const typeLabel = this.isCreditor ? "(kreditor)" : "(debitor)";
      return `Hisobot ${typeLabel} ${date.toLocaleString().slice(0, 10)}.xlsx`;
    },

    amountHeader() {
      return this.$t('contract_labels.column_amount');
    },

    contractHeader() {
      return this.$t('contract_labels.column_contract');
    },

    labelLoanAmount() {
      return this.$t('contract_labels.column_amount');
    },

    labelReturnedAmount() {
      return this.$t('contract_labels.modal_returned');
    },

    labelForgivenAmount() {
      return this.$t('contract_labels.modal_forgiven');
    },

    labelStatus() {
      return this.$t('contract_labels.status');
    },

    labelViewContract() {
      return this.$t('contract_labels.modal_view_contract');
    },

    labelDownloadContract() {
      return this.$t('contract_labels.modal_download_contract');
    },
  },

  created() {
    const breadcrumbTitle = this.isCreditor
      ? this.$t('home.reportC')
      : this.$t('home.reportD');

    this.$store.commit("changeBreadCrumb", [
      { title: breadcrumbTitle, name: `hisobot-${this.contractType}` },
    ]);
  },

  async mounted() {
    await this.getContracts();
  },

  methods: {
    async fetchContractPages(start, end) {
      const response = await getReportList(this.$axios, {
        type: this.contractType, status: this.status, page: this.page + 1, limit: this.limit, start, end,
      });
      const expResponse = await getReportExport(this.$axios, {
        type: this.contractType, status: this.status, start, end,
      });
      return { response, expResponse };
    },
    onContractsLoaded(response) {
      this.act = response.act;
      this.pass = response.pass;
    },

    /**
     * Change status filter
     */
    changeStatus(status) {
      this.status = status;
      this.page = 0;
      this.getContracts();
    },
  },
};
</script>

<style lang="scss" scoped>
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
