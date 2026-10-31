<template>
  <div class="min-h-screen">
    <!-- Page Header -->
    <div class="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
      <div class="bg-gradient-to-r from-green-600 to-green-500 px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button class="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all" @click="$router.push(localePath({ name: 'contract-dashboard' }))">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <!-- SS-DEV (2026-09-24): yuqoriga/pastga strelka ikonkasi OLIB TASHLANDI (foydalanuvchi talabi) -->
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-white">{{ pageTitle }}</h1>
              <p class="text-green-100 text-sm mt-0.5">{{ pageSubtitle }}</p>
            </div>
          </div>
          <div v-show="displayedContracts.length > 0" class="hidden sm:flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-xl">
            <span class="text-white font-semibold text-lg">{{ displayedLength }}</span>
            <span class="text-green-100 text-sm">{{ $t('debt_list.total') }}</span>
          </div>
        </div>
      </div>

      <!-- Stats & Actions Bar -->
      <ContractListToolbar :exportss="exportss" :local-search-query-value.sync="localSearchQuery" :sort-modal-value.sync="sortModal" @export-excel="exportExcel" />
    </div>

    <!-- Contracts List -->
    <div v-show="displayedContracts.length > 0" class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- Table Header (Desktop) -->
      <div class="hidden md:grid grid-cols-12 items-center px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-600 border-b border-gray-100">
        <div class="col-span-4">{{ columnCreditor }}</div>
        <div class="col-span-2">{{ columnAmount }}</div>
        <div class="col-span-2">{{ columnResidual }}</div>
        <div class="col-span-2">{{ columnDate }}</div>
        <div class="col-span-2">{{ columnContract }}</div>
      </div>

      <!-- Contract Items -->
      <div class="divide-y divide-gray-100">
        <div v-for="(item, index) in displayedContracts" :key="item.id || index" class="cursor-pointer px-6 py-4 hover:bg-green-50 transition-all duration-200 group"
          @click="viewFullItem(item)">

          <!-- Desktop View -->
          <div class="hidden md:grid grid-cols-12 items-center">
            <div class="col-span-4 flex items-center gap-3 min-w-0">
              <span class="inline-block w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100"></span>
              <nuxt-link :to="localePath({ name: 'user', query: { id: item.duid } })"
                class="truncate text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                @click.native.stop>
                {{ $fio(item.debitor_name) }}
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
                {{ $formatDate(item.contract_date || item.created_at) }}
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
                <nuxt-link :to="localePath({ name: 'user', query: { id: item.duid } })"
                  class="text-sm font-semibold text-gray-900 hover:text-blue-600"
                  @click.native.stop>
                  {{ $fio(item.debitor_name) }}
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
    <div v-show="displayedContracts.length === 0 && !localSearchQuery" class="bg-white rounded-2xl shadow-sm p-8 lg:p-12 text-center">
      <div class="max-w-sm mx-auto">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('debt_list.empty_title') }}</h3>
        <p class="text-gray-500 text-sm mb-6">{{ $t('debt_list.empty_desc_creditor') }}</p>
        <nuxt-link
          :to="localePath({ name: 'index' })"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ $t('notification.go_home') }}
        </nuxt-link>
      </div>
    </div>




      <div slot="pdf-content" ref="tableToExcel" class="tableToExcel" style="padding: 2rem">
        <div style="display: block" class="table-responsive uns">
          <table ref="exportable_table" class="table table-centered table-nowrap mt-4">
            <thead class="table-light">
              <tr>
                <th>№</th>
                <th>{{ columnCreditor }}</th>
                <th>{{ $t('list.deb') }}</th>
                <th>{{ columnAmount }}</th>
                <th>{{ columnDate }}</th>
                <th>{{ modalLabelEndDate }}</th>
                <th>{{ modalLabelReturned }}</th>
                <th>{{ columnResidual }}</th>
                <th>{{ columnContract }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in (exportss || [])" :key="i">
                <td>{{ i + 1 }}</td>
                <td>{{ getPartyFullName(item) }}</td>
                <td>
                  <span v-if="item.currency == 'UZS'">UZS</span>
                  <span v-if="item.currency == 'USD'">USD</span>
                </td>
                <td>{{ item.amount }}</td>
                <td data-t="s">{{ $formatDate(item.contract_date || item.created_at) }}</td>
                <td data-t="s">{{ $formatDate(item.end_date) }}</td>
                <td>{{ item.inc }}</td>
                <td>{{ item.residual_amount }}</td>
                <td>{{ item.number }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      <ZModal v-if="viewModal" :width="520" @closeModal="viewModal = false">
        <template v-if="viewData" #modal_body>
          <div class="text-center font-semibold text-xl mb-4">
            {{ $t('page_labels.contract_modal_title', { number: viewData.number }) }}
          </div>

          <div class="mb-3">
            <div class="flex items-center justify-between mb-2.5">
              <div class="text-base font-medium mr-3">{{ columnCreditor }}:</div>
              <div class="text-base font-semibold text-t_primary">
                  <nuxt-link :to="localePath({ name: 'user', query: { id: viewData.duid } })"
                  class="truncate hover:text-blue-700 hover:underline">
                  {{ $fio(viewData.debitor_name) }}
                </nuxt-link>
                
              </div>
            </div>

            <div class="flex items-center justify-between mb-2.5">
              <div class="text-base font-medium mr-3">{{ columnAmount }}: </div>
              <div class="text-base font-semibold text-t_primary">
                {{ $formatNumber(viewData.amount) }}
                {{ viewData.currency }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-2.5">
              <div class="text-base font-medium mr-3">{{ modalLabelReturned }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ $formatNumber(viewData.inc) }}
                {{ viewData.currency }}
              </div>
            </div>
            <div class="flex items-center justify-between mb-2.5">
              <div class="text-base font-medium mr-3">{{ columnResidual }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ $formatNumber(viewData.residual_amount) }}
                {{ viewData.currency }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-2.5">
              <div class="text-base font-medium mr-3">{{ columnDate }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ dateBeauty(viewData.contract_date || viewData.created_at) }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-2.5">
              <div class="text-base font-medium mr-3">
                {{ modalLabelEndDate }}:
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
                  mb-2
                  text-sm
                ">
                <img class="mr-2 w-5" src="@/assets/img/m1.png" alt="Qaytarish" />

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
                  mb-2
                  text-sm
                ">
                <img class="mr-2 w-5" src="@/assets/img/m2.png" alt="" />
                {{ labelExtendDebtCreditor }}
              </button>
            </nuxt-link>
          </div>

          <div class="bottom-actions grid grid-cols-2 gap-6 mb-4">
            <a class="flex w-full"
              :href="$contractPdfUrl(viewData.uid)">
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
                {{ labelViewContract }}
              </button>
            </a>

            <a :href="$contractPdfUrl(viewData.uid, 1)" download
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
              {{ labelDownloadContract }}
            </a>
          </div>
        </template>
      </ZModal>

      <ContractListSortModal v-if="sortModal" :sort-date-value.sync="sortDate" @close="sortModal = false" @search="searchDateFunction" />
    </div>
    <!-- SS-AUDIT (2026-09-25): ortiqcha </div> olib tashlandi (x-invalid-end-tag) -->
</template>

<script>
import ContractListSortModal from '~/components/contract-list/ContractListSortModal.vue';
import contractListMixin from '@/mixins/contractListMixin'; // wave C: umumiy ro'yxat mantiqi
import ContractListToolbar from '~/components/contract-list/ContractListToolbar.vue';
import ContractListAmountGrid from '~/components/contract-list/ContractListAmountGrid.vue';
import ContractListPagination from '~/components/contract-list/ContractListPagination.vue';
import { getReturnList, getReturnExport } from '@/api/contracts';
// SS-PERF (2026-09-25): xlsx (~480 KB) statik import emas — exportExcel() ichida dinamik yuklanadi
// SS-AUDIT (2026-09-25): ishlatilmagan komponent ro'yxati/importi olib tashlandi (IconExcel)
export default {
  mixins: [contractListMixin],
  components: {
    ContractListSortModal,
    ContractListToolbar,
    ContractListAmountGrid,
    ContractListPagination,
  },
  computed: {
    // Page-specific labels (boshqa sahifalarga ta'sir qilmasligi uchun)
    pageTitle() { return this.$t('page_labels.credit_list_title'); },
    pageSubtitle() { return this.$t('page_labels.credit_list_subtitle'); },
    columnCreditor() { return this.$t('page_labels.column_creditor'); },
    columnAmount() { return this.$t('contract_labels.column_amount'); },
    columnResidual() { return this.$t('contract_labels.column_residual'); },
    columnDate() { return this.$t('contract_labels.column_date_received'); },
    columnContract() { return this.$t('contract_labels.column_contract'); },
    labelViewContract() { return this.$t('contract_labels.modal_view_contract'); },
    labelDownloadContract() { return this.$t('contract_labels.modal_download_contract'); },
    labelExtendDebtCreditor() { return this.$t('contract_labels.modal_extend_debt_creditor'); },
    modalLabelReturned() { return this.$t('contract_labels.modal_returned'); },
    modalLabelEndDate() { return this.$t('contract_labels.modal_end_date'); },
  },
  data() {
    return {
      count: 0,
      act: 0,
      pass: 0,
      _unsubscribeNotification: null,
    };
  },
  created() {
    if (!this.$auth.loggedIn) {
      return this.$router.push(this.localePath({ name: "auth-login" }));
    }
    this.$store.commit("changeBreadCrumb", [
      { title: this.pageTitle, name: "credit-list" },
    ]);
  },
  async mounted() {
    if (this.$auth.user.is_active !== 1) {
      return this.$router.push(this.localePath({ name: "index" }));
    }
    await this.getContracts();

    // Socket orqali real-time yangilanish
    this._isSearchActive = false;
    if (this.$socketManager?.isInitialized) {
      this._unsubscribeNotification = this.$socketManager.subscribe(
        'recive_notification',
        () => { if (!this._isSearchActive) {this.getContracts();} }
      );
    }
  },
  beforeDestroy() {
    if (this._unsubscribeNotification) {
      this._unsubscribeNotification();
      this._unsubscribeNotification = null;
    }
  },
  methods: {
    onContractsStart() {
      this._isSearchActive = false;
    },
    contractNameOf(item) {
      return (item.debitor_name || '').toLowerCase();
    },
    contractExcelFileName(type) {
      return `Olingan qarz (kreditor) ${new Date().toLocaleString().slice(0, 10)}.${type || "xlsx"}`;
    },
    async fetchContractPages(start, end) {
      const response = await getReturnList(this.$axios, {
        type: 'creditor', page: this.page + 1, limit: this.limit, start, end,
      }, { silent: true });
      const expResponse = await getReturnExport(this.$axios, { type: 'creditor' }, { silent: true });
      return { response, expResponse };
    },
    onContractsLoaded(response) {
      this.act = response.act;
      this.pass = response.pass;
    },
    /**
     * Get party full name for export (creditor page shows debitors)
     */
    getPartyFullName(item) {
      // Olingan qarzda counterparty = debitor (qarz oluvchi)
      if (item.d_last_name && item.d_first_name) {
        return `${item.d_last_name} ${item.d_first_name} ${item.d_middle_name || ''}`.trim();
      }
      return item.debitor_name || item.creditor_name || '';
    },

    back() {
      try {
        return this.$router.push(this.localePath(this.$route.fullPath));
      } catch (e) {
        // Silent navigation error
      }
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.modal-z-dialog) {
  overflow-y: hidden;
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
