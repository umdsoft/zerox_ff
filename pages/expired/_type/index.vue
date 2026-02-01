<template>
  <div class="min-h-screen">
    <!-- Page Header -->
    <div class="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="$goHomeWithLocale()" class="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center hover:bg-opacity-30 transition-all">
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
              <p class="text-blue-100 text-sm mt-0.5">{{ pageSubtitle }}</p>
            </div>
          </div>
          <div v-if="contracts.length > 0" class="hidden sm:flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-xl">
            <span class="text-white font-semibold text-lg">{{ length }}</span>
            <span class="text-blue-100 text-sm">{{ $t('debt_list.total') || "ta shartnoma" }}</span>
          </div>
        </div>
      </div>

      <!-- Stats & Actions Bar -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Search -->
          <SearchComponent
            class="w-full md:flex-1 md:max-w-md"
            @searchData="searchData"
            :getContracts="getContracts"
            :url="searchUrl"
          />

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button @click="sortModal = true"
              class="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {{ $t('debt_list.Sorting') }}
            </button>

            <button @click="exportExcel()"
              class="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ $t('debt_list.Upload') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contracts List -->
    <div v-if="contracts.length > 0" class="bg-white rounded-2xl shadow-sm overflow-hidden">
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
        <div v-for="(item, index) in contracts" :key="index" @click="viewFullItem(item)"
          class="cursor-pointer px-6 py-4 hover:bg-blue-50 transition-all duration-200 group">

          <!-- Desktop View -->
          <div class="hidden md:grid grid-cols-12 items-center">
            <div class="col-span-4 flex items-center gap-3 min-w-0">
              <span class="inline-block w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100"></span>
              <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(item) } })"
                class="truncate text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                @click.native.stop>
                {{ getPartyName(item) }}
              </nuxt-link>
            </div>

            <div class="col-span-2 flex justify-center">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatAmount(item.amount) }} {{ item.currency }}
              </span>
            </div>

            <div class="col-span-2 flex justify-center">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-sm font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatAmount(item.residual_amount) }} {{ item.currency }}
              </span>
            </div>

            <div class="col-span-2 flex justify-center">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ dateFormat(item.created_at) }}
              </span>
            </div>

            <div class="col-span-2 flex justify-center">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
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
                  class="text-sm font-semibold text-gray-900 hover:text-blue-600"
                  @click.native.stop>
                  {{ getPartyName(item) }}
                </nuxt-link>
              </div>
              <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">{{ item.number }}</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 rounded-xl p-3">
                <div class="text-xs text-gray-500 mb-1">{{ $t('debt_list.debtsumm') }}</div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ formatAmount(item.amount) }} {{ item.currency }}
                </div>
              </div>
              <div class="bg-orange-50 rounded-xl p-3">
                <div class="text-xs text-orange-600 mb-1">{{ $t('debt_list.debta') }}</div>
                <div class="text-sm font-semibold text-orange-700">
                  {{ formatAmount(item.residual_amount) }} {{ item.currency }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <PaginationPro
          :total-items="length"
          :items-per-page="limit"
          :page="page"
          :max-visible-pages="5"
          @page-change="pageChange"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl shadow-sm p-8 lg:p-12 text-center">
      <div class="max-w-sm mx-auto">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-6">{{ emptyStateTitleText }}</h3>
        <nuxt-link
          :to="localePath({ name: 'index' })"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ $t('notification.go_home') || "Bosh sahifaga" }}
        </nuxt-link>
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
              <th>Qarz shartnomasi</th>
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
</template>

<script>
import SearchComponent from "@/components/SearchComponent.vue";
import PaginationPro from "@/components/PaginationPro.vue";
import { dateFormatMixin } from '@/mixins';
import * as XLSX from "xlsx";

export default {
  name: 'ExpiredContracts',

  components: {
    SearchComponent,
    PaginationPro,
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
        ? this.$t('home.expiredC')
        : this.$t('home.expiredD');
    },

    /**
     * Page subtitle based on type
     */
    pageSubtitle() {
      return this.isCreditor
        ? this.$t('debt_list.subtitle_expired_creditor') || "Muddati o'tgan qarzlar (kreditor)"
        : this.$t('debt_list.subtitle_expired_debitor') || "Muddati o'tgan qarzlar (debitor)";
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
     * Empty state title text (locale-specific)
     */
    emptyStateTitleText() {
      const lang = this.$i18n?.locale || 'uz';
      if (lang === 'ru') return 'Отлично! У вас нет просроченных задолженностей.';
      if (lang === 'kr') return 'Ҳозирча сизда муддати ўтган қарздорликлар мавжуд эмас.';
      return "Hozircha sizda muddati o'tgan qarzdorliklar mavjud emas.";
    },

    /**
     * Search component URL
     */
    searchUrl() {
      return `/contract/expired?status=${this.status}&type=${this.contractType}&page=${this.page + 1}&limit=${this.limit}`;
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
      ? "Olingan qarz (kreditor)"
      : "Berilgan qarz (debitor)";

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
      const [start, end] = this.sortDate && this.sortDate.length
        ? this.sortDate.map((d) => d || "0")
        : ["0", "0"];

      try {
        const response = await this.$axios.$get(
          `/contract/expired?type=${this.contractType}&page=${this.page + 1}&limit=${this.limit}&start=${start}&end=${end}`
        );
        const expResponse = await this.$axios.$get(
          `/contract/exp-expired?type=${this.contractType}`
        );

        this.contracts = response.data;
        this.exportss = expResponse.data;
        this.length = response.count;
      } catch (error) {
        this.$toast.error(this.$t('errors.loadFailed') || 'Failed to load data');
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
