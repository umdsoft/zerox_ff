<template>
  <div class="min-h-screen">
    <!-- Page Header -->
    <div class="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
      <div class="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button class="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all" @click="$router.push(localePath({ name: 'contract-dashboard' }))">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-white">{{ pageTitle }}</h1>
            </div>
          </div>
          <div v-if="displayedContracts.length > 0" class="hidden sm:flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-xl">
            <span class="text-white font-semibold text-lg">{{ displayedLength }}</span>
            <span class="text-red-100 text-sm">{{ $t('debt_list.total') }}</span>
          </div>
        </div>
      </div>

      <!-- Stats & Actions Bar -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <ContractListActionRow :local-search-query-value.sync="localSearchQuery" :sort-modal-value.sync="sortModal" @export-excel="exportExcel" />
      </div>
    </div>

    <!-- Contracts List -->
    <div v-if="displayedContracts.length > 0" class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- Table Header (Desktop) -->
      <div class="hidden md:grid grid-cols-12 items-center px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-600 border-b border-gray-100">
        <div class="col-span-4">{{ partyLabel }}</div>
        <div class="col-span-2 text-center">{{ $t('debt_list.debtsumm') }}</div>
        <div class="col-span-2 text-center">{{ $t('debt_list.debta') }}</div>
        <div class="col-span-2 text-center">{{ isCreditor ? $t('debt_list.debtol') : $t('debt_list.date') }}</div>
        <div class="col-span-2 text-center">{{ $t('debt_list.debtc') }}</div>
      </div>

      <!-- Contract Items -->
      <div class="divide-y divide-gray-100">
        <div v-for="(item, index) in displayedContracts" :key="item.id || index" class="cursor-pointer px-6 py-4 hover:bg-red-50 transition-all duration-200 group"
          @click="viewFullItem(item)">

          <!-- Desktop View -->
          <div class="hidden md:grid grid-cols-12 items-center">
            <div class="col-span-4 flex items-center gap-3 min-w-0">
              <span class="inline-block w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100"></span>
              <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(item) } })"
                class="truncate text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                @click.native.stop>
                {{ $fio(getPartyName(item)) }}
              </nuxt-link>
            </div>

            <div class="col-span-2 text-center">
              <span class="text-sm font-medium text-gray-800">
                {{ $formatNumber(item.amount) }} {{ item.currency }}
              </span>
            </div>

            <div class="col-span-2 text-center">
              <span class="text-sm font-medium text-orange-700">
                {{ $formatNumber(item.residual_amount) }} {{ item.currency }}
              </span>
            </div>

            <div class="col-span-2 text-center">
              <span class="text-sm text-gray-700">
                {{ dateFormat(item.contract_date || item.created_at) }}
              </span>
            </div>

            <div class="col-span-2 text-center">
              <span class="text-sm font-medium text-blue-700">
                {{ item.number }}
              </span>
            </div>
          </div>

          <!-- Mobile View -->
          <div class="md:hidden">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-100"></span>
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
                <div class="text-xs text-gray-500 mb-1">{{ $t('debt_list.debtsumm') }}</div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ $formatNumber(item.amount) }} {{ item.currency }}
                </div>
              </div>
              <div class="bg-orange-50 rounded-xl p-3">
                <div class="text-xs text-orange-600 mb-1">{{ $t('debt_list.debta') }}</div>
                <div class="text-sm font-semibold text-orange-700">
                  {{ $formatNumber(item.residual_amount) }} {{ item.currency }}
                </div>
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ emptyStateTitleText }}</h3>
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
              <th>{{ $t('debt_list.debtsumm') }}</th>
              <th>{{ isCreditor ? $t('debt_list.debtol') : $t('debt_list.date') }}</th>
              <th>{{ $t('debt_list.datee') }}</th>
              <th>{{ $t('debt_list.debtsum') }}</th>
              <th>{{ $t('debt_list.debtsums') }}</th>
              <th>{{ $t('debt.contract') }}</th>
            </tr>
          </thead>
          <ContractListExportRows :items="exportss" :is-creditor="isCreditor" />
        </table>
      </div>
    </div>

    <!-- View Modal -->
    <ZModal v-if="viewModal" :width="520" @closeModal="viewModal = false">
      <template v-if="viewData" #modal_body>
        <div class="text-center font-semibold text-xl mb-8">
          {{ $t('page_labels.contract_modal_title', { number: viewData.number }) }}
        </div>

        <div class="mb-6" style="overflow: hidden;">
          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ modalPartyLabel }}:</div>
            <div class="text-base font-semibold text-t_primary">
              <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(viewData) } })"
                class="truncate hover:text-blue-700 hover:underline">
                {{ $fio(getPartyName(viewData)) }}
              </nuxt-link>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ $t('debt_list.debtsumm') }}:</div>
            <div class="text-base font-semibold text-t_primary">
              {{ $formatNumber(viewData.amount) }} {{ viewData.currency }}
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ modalReturnedLabel }}:</div>
            <div class="text-base font-semibold text-t_primary">
              {{ $formatNumber(viewData.inc) }} {{ viewData.currency }}
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ $t('debt_list.debtsums') }}:</div>
            <div class="text-base font-semibold text-t_primary">
              {{ $formatNumber(viewData.residual_amount) }} {{ viewData.currency }}
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ modalDateLabel }}:</div>
            <div class="text-base font-semibold text-t_primary">
              {{ dateBeauty(viewData.contract_date || viewData.created_at) }}
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="text-base font-medium mr-3">{{ modalEndDateLabel }}:</div>
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
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5303 4.76667C12.7511 4.76667 13.5745 5.80556 13.6494 7.33333H16.4067C16.3194 5.23111 15.0094 3.3 12.4017 2.67667V0H8.65876V2.64C8.17218 2.73778 7.72302 2.89667 7.28634 3.08L9.17031 4.92556C9.56956 4.82778 10.0312 4.76667 10.5303 4.76667ZM1.7592 1.12444L0 2.84778L4.29195 7.05222C4.29195 9.59445 6.2383 10.9878 9.17031 11.8311L13.5496 16.1211C13.1254 16.72 12.2396 17.2333 10.5303 17.2333C7.96008 17.2333 6.94947 16.1089 6.81223 14.6667H4.06737C4.21709 17.3433 6.26326 18.8467 8.65876 19.3478V22H12.4017V19.3722C13.5995 19.1522 14.685 18.7 15.471 18.0033L18.2408 20.7167L20 18.9933L1.7592 1.12444Z" fill="white" />
                </svg>
                <span class="ml-2">{{ labelDebtWaiver }}</span>
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
    <ContractListSortModal v-if="sortModal" :sort-date-value.sync="sortDate" @close="sortModal = false" @search="searchDateFunction" />
  </div>
</template>

<script>
import ContractListSortModal from '~/components/contract-list/ContractListSortModal.vue';
import ContractListActionRow from '~/components/contract-list/ContractListActionRow.vue';
import ContractListExportRows from '~/components/contract-list/ContractListExportRows.vue';
import contractListMixin from '@/mixins/contractListMixin'; // wave C: umumiy ro'yxat mantiqi
import ContractListGoHome from '~/components/contract-list/ContractListGoHome.vue';
import ContractListPagination from '~/components/contract-list/ContractListPagination.vue';
import { getExpiredList, getExpiredExport } from '@/api/contracts';
import { dateFormatMixin } from '@/mixins';
// SS-PERF (2026-09-25): xlsx (~480 KB) statik import emas — exportExcel() ichida dinamik yuklanadi

export default {
  name: 'ExpiredContracts',

  components: {
    ContractListSortModal,
    ContractListActionRow,
    ContractListExportRows,
    ContractListGoHome,
    ContractListPagination,
  },

  mixins: [dateFormatMixin, contractListMixin],

  data() {
    return {
      _unsubscribeNotification: null,
      _socketRetryTimer: null,
    };
  },

  computed: {
    labelViewContract() { return this.$t('contract_labels.modal_view_contract'); },
    labelDownloadContract() { return this.$t('contract_labels.modal_download_contract'); },
    labelRequestPayment() { return this.$t('contract_labels.modal_request_payment'); },
    labelExtendDebtCreditor() { return this.$t('contract_labels.modal_extend_debt_creditor'); },
    labelExtendDebtDebitor() { return this.$t('contract_labels.modal_extend_debt_debitor'); },
    modalPartyLabel() {
      return this.isCreditor ? this.$t('list.creditor') : this.$t('list.debitor');
    },
    modalReturnedLabel() { return this.$t('contract_labels.modal_returned'); },
    modalDateLabel() {
      return this.isCreditor
        ? this.$t('contract_labels.column_date_received')
        : this.$t('contract_labels.column_date_given');
    },
    modalEndDateLabel() { return this.$t('contract_labels.modal_end_date'); },
    labelDebtWaiver() { return this.$t('contract_labels.modal_debt_waiver'); },

    /**
     * Page title based on type
     */
    pageTitle() {
      return this.isCreditor
        ? this.$t('page_labels.expired_title_creditor')
        : this.$t('page_labels.expired_title_debitor');
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
     * Empty state title text (locale-specific)
     */
    emptyStateTitleText() { return this.$t('page_labels.empty_state_expired'); },

    /**
     * Search component URL
     */
    searchUrl() {
      return `/contract/expired?type=${this.contractType}&page=${this.page + 1}&limit=${this.limit}`;
    },

    /**
     * Excel export filename
     */
    excelFileName() {
      const date = new Date();
      const typeLabel = this.isCreditor ? "(kreditor)" : "(debitor)";
      return `Muddati o'tgan ${typeLabel} ${date.toLocaleString().slice(0, 10)}.xlsx`;
    },
  },

  created() {
    if (!this.$auth.loggedIn) {
      return this.$router.push(this.localePath({ name: "auth-login" }));
    }

    const breadcrumbTitle = this.isCreditor
      ? this.$t('page_labels.credit_list_title')
      : this.$t('page_labels.debt_list_title');

    this.$store.commit("changeBreadCrumb", [
      { title: breadcrumbTitle, name: breadcrumbTitle },
    ]);
  },

  async mounted() {
    if (this.$auth.user.is_active !== 1) {
      return this.$router.push(this.localePath({ name: "index" }));
    }
    await this.getContracts();
    this._subscribeSocket();
  },

  activated() {
    // Sahifa qayta ochilganda (keep-alive yoki back navigation) ma'lumotlarni yangilash
    this.getContracts();
    this._subscribeSocket();
  },

  beforeDestroy() {
    this._unsubscribeSocket();
  },

  methods: {
    async fetchContractPages(start, end) {
      const response = await getExpiredList(this.$axios, {
        type: this.contractType, page: this.page + 1, limit: this.limit, start, end,
      });
      const expResponse = await getExpiredExport(this.$axios, { type: this.contractType });
      return { response, expResponse };
    },
    onContractsError(error) {
      if (error?.response?.status !== 429) {
        this.$toast.error(this.$t('errors.loadFailed'));
      }
    },
    /**
     * Socket orqali real-time yangilanish — muddat uzaytirilganda ro'yxat yangilanadi
     */
    _subscribeSocket() {
      if (this._unsubscribeNotification) {return;} // allaqachon subscribe bo'lgan

      const trySubscribe = () => {
        if (this.$socketManager?.isInitialized) {
          this._unsubscribeNotification = this.$socketManager.subscribe(
            'recive_notification',
            () => this.getContracts()
          );
        } else {
          // socketManager tayyor bo'lguncha kutish
          this._socketRetryTimer = setTimeout(trySubscribe, 200);
        }
      };
      trySubscribe();
    },

    _unsubscribeSocket() {
      if (this._unsubscribeNotification) {
        this._unsubscribeNotification();
        this._unsubscribeNotification = null;
      }
      if (this._socketRetryTimer) {
        clearTimeout(this._socketRetryTimer);
        this._socketRetryTimer = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.modal-z-dialog) {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
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
