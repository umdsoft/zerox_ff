<template>
  <div class="min-h-screen">
    <!-- Page Header -->
    <div class="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
      <div class="header-gradient px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button @click="$goHomeWithLocale()" class="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style="background: rgba(255,255,255,0.2);">
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
              <p class="text-sm mt-0.5" style="color: rgba(255,255,255,0.8);">{{ pageSubtitle }}</p>
            </div>
          </div>
          <div v-if="contracts.length > 0" class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl" style="background: rgba(255,255,255,0.2);">
            <span class="text-white font-semibold text-lg">{{ length }}</span>
            <span class="text-sm" style="color: rgba(255,255,255,0.8);">{{ $t('debt_list.total') || "ta shartnoma" }}</span>
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
              class="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors text-sm">
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
          class="cursor-pointer px-6 py-4 hover:bg-amber-50 transition-all duration-200 group">

          <!-- Desktop View -->
          <div class="hidden md:grid grid-cols-12 items-center">
            <div class="col-span-4 flex items-center gap-3 min-w-0">
              <span :class="getStatusDotClass(item)"></span>
              <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(item) } })"
                class="truncate text-sm font-medium text-gray-900 hover:text-amber-600 transition-colors"
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
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium">
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
                <span class="inline-block w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-100"></span>
                <nuxt-link :to="localePath({ name: 'user', query: { id: getPartyUid(item) } })"
                  class="text-sm font-semibold text-gray-900 hover:text-amber-600"
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
              <div class="bg-amber-50 rounded-xl p-3">
                <div class="text-xs text-amber-600 mb-1">{{ $t('debt_list.debta') }}</div>
                <div class="text-sm font-semibold text-amber-700">
                  {{ formatAmount(item.residual_amount) }} {{ item.currency }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <pagination
          :total-items="length"
          :max-visible-pages="6"
          :items-per-page="limit"
          :page="page"
          @page-change="pageChange"
        />
      </div>
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
        <p class="text-gray-500 text-sm mb-6">{{ $t('debt_list.empty_desc') || "Hozircha muddati yaqinlashgan shartnomalar mavjud emas." }}</p>
        <nuxt-link
          :to="localePath({ name: 'index' })"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ $t('notification.go_home') || "Bosh sahifaga" }}
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
              <button class="rounded-xl justify-center w-full py-3 px-4 flex items-center bg-amber-500 hover:bg-amber-600 text-white mb-3 text-sm font-medium transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                {{ $t('list.return') }}
              </button>
            </nuxt-link>

            <nuxt-link :to="localePath({ name: 'debt-extend-ask', query: { id: viewData.id } })">
              <button class="rounded-xl justify-center w-full py-3 px-4 flex items-center bg-blue-600 hover:bg-blue-700 text-white mb-3 text-sm font-medium transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ $t("action.a2") }}
              </button>
            </nuxt-link>
          </template>

          <!-- Debitor Actions -->
          <template v-else>
            <nuxt-link :to="localePath({ name: 'debt-demand', query: { id: viewData.id } })">
              <button class="rounded-xl justify-center w-full py-3 px-4 flex items-center bg-amber-500 hover:bg-amber-600 text-white mb-3 text-sm font-medium transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {{ $t('action.a1') }}
              </button>
            </nuxt-link>

            <nuxt-link :to="localePath({ name: 'debt-extend', query: { id: viewData.id } })">
              <button class="rounded-xl justify-center w-full py-3 px-4 flex items-center bg-blue-600 hover:bg-blue-700 text-white mb-3 text-sm font-medium transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ $t('action.a4') }}
              </button>
            </nuxt-link>

            <nuxt-link :to="localePath({ name: 'debt-waiver', query: { id: viewData.id } })">
              <button class="rounded-xl justify-center w-full py-3 px-4 flex items-center bg-gray-600 hover:bg-gray-700 text-white mb-3 text-sm font-medium transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                {{ $t('action.a5') }}
              </button>
            </nuxt-link>
          </template>
        </div>

        <div class="bottom-actions grid grid-cols-2 gap-4 mb-4">
          <a class="flex w-full" :href="`https://pdf.zerox.uz/index.php?id=${viewData.uid}&download=0&lang=${$i18n.locale}`">
            <button class="rounded-xl justify-center w-full py-3 px-4 flex items-center bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ $t('action.a7') }}
            </button>
          </a>

          <a :href="`https://pdf.zerox.uz/index.php?id=${viewData.uid}&lang=${$i18n.locale}&download=1`" download
            class="rounded-xl justify-center py-3 px-4 flex items-center bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ $t('action.a8') }}
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
import SearchComponent from "@/components/SearchComponent.vue";
import VueAdsPagination from "vue-ads-pagination";
import { dateFormatMixin } from '@/mixins';
import * as XLSX from "xlsx";

export default {
  name: 'NearExpirationContracts',

  middleware: "auth",

  components: {
    SearchComponent,
    pagination: VueAdsPagination,
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
     * Page subtitle
     */
    pageSubtitle() {
      return this.isCreditor
        ? this.$t('near_expiration.subtitle_creditor') || "Muddati yaqinlashgan kreditor shartnomalar"
        : this.$t('near_expiration.subtitle_debitor') || "Muddati yaqinlashgan debitor shartnomalar";
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
        return 'inline-block w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-100';
      }
      if (item.status === 3 || item.status === 4) {
        return 'inline-block w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100';
      }
      return 'inline-block w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100';
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
</style>
