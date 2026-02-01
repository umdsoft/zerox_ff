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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-white">{{ $t('home.debitor') }}</h1>
              <p class="text-blue-100 text-sm mt-0.5">{{ $t('debt_list.subtitle_debitor') || "Sizga qarz bergan shaxslar ro'yxati" }}</p>
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
          <SearchComponent class="w-full md:flex-1 md:max-w-md" @searchData="searchData" :getContracts="getContracts"
            :url="`/contract/return?type=debitor&page=${this.page + 1}&limit=${this.limit}`" />

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
        <div class="col-span-4">{{ $t('list.creditor') }}</div>
        <div class="col-span-2 text-center">{{ $t('debt_list.debtsumm') }}</div>
        <div class="col-span-2 text-center">{{ $t('debt_list.debta') }}</div>
        <div class="col-span-2 text-center">{{ $t('debt_list.date') }}</div>
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
              <nuxt-link :to="localePath({ name: 'user', query: { id: item.cuid } })"
                class="truncate text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                @click.native.stop>
                {{ item.creditor_name }}
              </nuxt-link>
            </div>

            <div class="col-span-2 flex justify-center">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 text-sm font-medium">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ item.amount && item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} {{ item.currency }}
              </span>
            </div>

            <div class="col-span-2 flex justify-center">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-sm font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ item.residual_amount && item.residual_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} {{ item.currency }}
              </span>
            </div>

            <div class="col-span-2 flex justify-center">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ $formatDate(item.created_at) }}
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
                <nuxt-link :to="localePath({ name: 'user', query: { id: item.cuid } })"
                  class="text-sm font-semibold text-gray-900 hover:text-blue-600"
                  @click.native.stop>
                  {{ item.creditor_name }}
                </nuxt-link>
              </div>
              <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">{{ item.number }}</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 rounded-xl p-3">
                <div class="text-xs text-gray-500 mb-1">{{ $t('debt_list.debtsumm') }}</div>
                <div class="text-sm font-semibold text-gray-900">
                  {{ item.amount && item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} {{ item.currency }}
                </div>
              </div>
              <div class="bg-orange-50 rounded-xl p-3">
                <div class="text-xs text-orange-600 mb-1">{{ $t('debt_list.debta') }}</div>
                <div class="text-sm font-semibold text-orange-700">
                  {{ item.residual_amount && item.residual_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} {{ item.currency }}
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
        <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('debt_list.empty_title') || "Shartnomalar topilmadi" }}</h3>
        <p class="text-gray-500 text-sm mb-6">{{ $t('debt_list.empty_desc') || "Hozircha sizda hech qanday qarz shartnomasi mavjud emas." }}</p>
        <nuxt-link
          :to="localePath({ name: 'index' })"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ $t('notification.go_home') || "Bosh sahifaga" }}
        </nuxt-link>
      </div>
    </div>

      <!-- Excel eksport uchun yashirin jadval (o'zgarmagan) -->
      <div slot="pdf-content" ref="tableToExcel" class="tableToExcel" style="padding: 2rem">
        <div class="table-responsive uns" style="display: block">
          <table ref="exportable_table" class="table table-centered table-nowrap mt-4">
            <thead class="table-light">
              <tr>
                <th>№</th>
                <th>{{ $t('list.creditor') }}</th>
                <th>{{ $t('list.deb') }}</th>
                <th>{{ $t('debt_list.debtsumm') }}</th>
                <th>{{ $t('debt_list.date') }}</th>
                <th>{{ $t('debt_list.datee') }}</th>
                <th>Qaytarilgan summa</th>
                <th>{{ $t('debt_list.debtsums') }}</th>
                <th>Qarz shartnomasi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in contracts" :key="i">
                <td>{{ page * limit + i + 1 }}</td>
                <td>{{ item.creditor_name }}</td>
                <td>
                  <span v-if="item.currency == 'UZS'">UZS</span>
                  <span v-if="item.currency == 'USD'">USD</span>
                </td>
                <td>{{ item.amount }}</td>
                <td>{{ $formatDate(item.created_at) }}</td>
                <td>{{ $formatDate(item.end_date) }}</td>
                <td>{{ item.inc }}</td>
                <td>{{ item.residual_amount }}</td>
                <td>{{ item.number }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modallar (o'zgarmagan, faqat inline svg -> icon component) -->
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
              <div class="text-base font-medium mr-3">{{ $t('list.creditor') }}:</div>
              <div class="text-base font-semibold text-t_primary"> <nuxt-link
                  :to="localePath({ name: 'user', query: { id: viewData.cuid } })"
                  class="truncate hover:text-blue-700 hover:underline">
                  {{ viewData.creditor_name }}
                </nuxt-link></div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.debtsumm') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ viewData.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} {{ viewData.currency }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.debtsum') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ viewData.inc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} {{ viewData.currency }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.debtsums') }}:</div>
              <div class="text-base font-semibold text-t_primary">
                {{ viewData.residual_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} {{ viewData.currency }}
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.date') }}:</div>
              <div class="text-base font-semibold text-t_primary">{{ dateBeauty(viewData.created_at) }}</div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <div class="text-base font-medium mr-3">{{ $t('debt_list.datee') }}:</div>
              <div class="text-base font-semibold text-t_primary">{{ dateBeauty(viewData.end_date) }}</div>
            </div>

            <nuxt-link :to="localePath({ name: 'debt-demand', query: { id: viewData.id } })">
              <button
                class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white mb-3.5 text-sm">
                <img class="mr-2 w-5" src="@/assets/img/m1.png" alt="" />
                {{ $t('action.a1') }}
              </button>
            </nuxt-link>

            <nuxt-link :to="localePath({ name: 'debt-extend', query: { id: viewData.id } })">
              <button
                class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white mb-3.5 text-sm">
                <img class="mr-2 w-5" src="@/assets/img/m2.png" alt="" />
                {{ $t('action.a4') }}
              </button>
            </nuxt-link>

            <nuxt-link :to="localePath({ name: 'debt-waiver', query: { id: viewData.id } })">
              <button
                class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white mb-3.5 text-sm">
                <IconHide class="w-5 h-5 mr-2" />
                <span>{{ $t('action.a5') }}</span>
              </button>
            </nuxt-link>
          </div>

          <div class="bottom-actions grid grid-cols-2 gap-6 mb-4">
            <a class="flex w-full"
              :href="`https://pdf.zerox.uz/index.php?id=${viewData.uid}&download=0&lang=${$i18n.locale}`">
              <button
                class="rounded-lg justify-center w-full py-2.5 px-4 flex items-center bg-t_primary text-white text-sm">
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
import * as XLSX from "xlsx";
import PaginationPro from "@/components/PaginationPro.vue";

import IconExcel from '@/components/icons/IconExcel';
import IconFilter from '@/components/icons/IconFilter';
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue';

export default {
  components: {
    SearchComponent,
    PaginationPro,
    IconExcel,
    IconFilter,
    IconChevronLeft,
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
      { title: this.$t('home.debitor'), name: "debt-list" },
    ]);
  },
  async mounted() {
    if (this.$auth.user.is_active !== 1) {
      return this.$router.push(this.localePath({ name: "index" }));
    }
    await this.getContracts();
  },
  methods: {
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
        `Berilgan qarz (debitor) ${date.toLocaleString().slice(0, 10)}.${type || "xlsx"
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
          `/contract/return?type=debitor&page=${this.page + 1}&limit=${this.limit
          }&start=${start}&end=${end}`
        );
        const expResponse = await this.$axios.$get(
          `/contract/exp-return?type=creditor`
        );

        this.contracts = response.data;
        this.exportss = expResponse.data;
        this.act = response.act;
        this.pass = response.pass;
        this.length = response.count;
      } catch (error) {
        this.$toast.error(this.$t('errors.loadFailed') || 'Failed to load data');
      }
    },

    searchData(data) {
      this.contracts = data.data;
      this.length = data.count;
    },

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
