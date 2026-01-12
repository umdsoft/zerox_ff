<template>
  <div class="pb-8">
    <!-- Header Card -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div class="px-6 py-5">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-xl font-bold text-gray-900">{{ $t("mobil.mobl") }}</h1>
            <p class="text-sm text-gray-500 mt-1">{{ $t("mobil.history_subtitle") }}</p>
          </div>
          <!-- Kirim/Chiqim Tabs -->
          <div class="flex items-center gap-2">
            <button
              @click="changeStatus('0')"
              :class="[
                'flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200',
                status === '0' || status === 0 || !status
                  ? 'bg-green-100 text-green-700 shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              {{ $t('debt_list.Kirm') }}
            </button>
            <button
              @click="changeStatus('1')"
              :class="[
                'flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200',
                status === '1' || status === 1
                  ? 'bg-red-100 text-red-700 shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              {{ $t('debt_list.Chiqim') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions List -->
    <div v-if="data && data.length > 0" class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- Desktop Table -->
      <div class="hidden md:block">
        <div class="grid grid-cols-12 items-center px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-600 border-b border-gray-100">
          <div class="col-span-1"></div>
          <div class="col-span-5">{{ $t('result.desc') || 'Tavsif' }}</div>
          <div class="col-span-3 text-center">{{ $t('result.sana') }}</div>
          <div class="col-span-3 text-right">{{ $t('debt_list.debtsumm') || 'Summa' }}</div>
        </div>

        <div class="divide-y divide-gray-100">
          <div
            v-for="(item, index) in data"
            :key="index"
            @click="openModalAction(item)"
            class="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <!-- Icon -->
            <div class="col-span-1">
              <div :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center',
                item.all == 0 ? 'bg-green-100' : 'bg-red-100'
              ]">
                <svg v-if="item.type == 1" :class="['w-5 h-5', item.all == 0 ? 'text-green-600' : 'text-red-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg v-else-if="item.type == 2 || item.type == 3" :class="['w-5 h-5', item.all == 0 ? 'text-green-600' : 'text-red-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <svg v-else :class="['w-5 h-5', item.all == 0 ? 'text-green-600' : 'text-red-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>

            <!-- Description -->
            <div class="col-span-5">
              <div class="text-sm font-medium text-gray-900">
                {{ getTransactionDescription(item) }}
              </div>
              <div class="text-xs text-gray-500 mt-0.5">
                {{ item.all == 0 ? $t('mobil.income') || 'Kirim' : $t('mobil.expense') || 'Chiqim' }}
              </div>
            </div>

            <!-- Date -->
            <div class="col-span-3 text-center">
              <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ dateFormat(item.created_at) }} {{ item.time ? item.time.slice(0, 5) : '' }}
              </span>
            </div>

            <!-- Amount -->
            <div class="col-span-3 text-right">
              <span :class="[
                'text-base font-semibold',
                item.all == 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ item.all == 0 ? '+' : '-' }}{{ formatNumber(item.amount) }} UZS
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden divide-y divide-gray-100">
        <div
          v-for="(item, index) in data"
          :key="`mobile-${index}`"
          @click="openModalAction(item)"
          class="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
        >
          <div class="flex items-start gap-3">
            <!-- Icon -->
            <div :class="[
              'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
              item.all == 0 ? 'bg-green-100' : 'bg-red-100'
            ]">
              <svg v-if="item.type == 1" :class="['w-5 h-5', item.all == 0 ? 'text-green-600' : 'text-red-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <svg v-else-if="item.type == 2 || item.type == 3" :class="['w-5 h-5', item.all == 0 ? 'text-green-600' : 'text-red-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <svg v-else :class="['w-5 h-5', item.all == 0 ? 'text-green-600' : 'text-red-600']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div class="text-sm font-medium text-gray-900 line-clamp-2">
                  {{ getTransactionDescription(item) }}
                </div>
                <span :class="[
                  'text-sm font-semibold whitespace-nowrap',
                  item.all == 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ item.all == 0 ? '+' : '-' }}{{ formatNumber(item.amount) }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-500">
                  {{ item.all == 0 ? $t('mobil.income') || 'Kirim' : $t('mobil.expense') || 'Chiqim' }}
                </span>
                <span class="text-xs text-gray-400">
                  {{ dateFormat(item.created_at) }} {{ item.time ? item.time.slice(0, 5) : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-2xl shadow-sm p-8 lg:p-12 text-center">
      <div class="max-w-sm mx-auto">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('mobil.no_transactions') }}</h3>
        <p class="text-gray-500 text-sm">{{ $t('mobil.no_transactions_desc') }}</p>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="closeModal"></div>

    <!-- Transaction Modal -->
    <TransactionModal
      v-if="modalData != null"
      :data="modalData"
      :open-modal="isModalOpen"
      :modal-type="currentModalType"
      :key="`modal-${indexModal}`"
      @closeModal="closeModal"
    />
  </div>
</template>

<script>
import dateformat from "dateformat";
import TransactionModal from "./TransactionModal.vue";

export default {
  middleware: "auth",

  components: {
    TransactionModal,
  },

  data() {
    return {
      data: null,
      status: this.$route.query.status || '0',
      isModalOpen: false,
      currentModalType: 'transfer-outgoing',
      modalData: null,
      indexModal: 1,
    };
  },

  async mounted() {
    const links = [{ title: "Kirim-Chiqim", name: "jonatuvchi" }];
    this.$store.commit("changeBreadCrumb", links);
    await this.getData(this.status);
  },

  watch: {
    '$route.query.status'(newStatus) {
      this.status = newStatus || '0';
      this.getData(this.status);
    },
  },

  methods: {
    formatNumber(value) {
      if (!value) return '0';
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },

    dateFormat(date) {
      if (!date) return '';
      let formatted = dateformat(date, "isoDate");
      return formatted.split("-").reverse().join(".");
    },

    async changeStatus(newStatus) {
      this.status = newStatus;
      this.$router.push(this.localePath({ name: 'jonatuvchi', query: { status: newStatus } }));
      await this.getData(newStatus);
    },

    async getData(st) {
      try {
        const response = await this.$axios.$get(`/home/cs?status=${st}`);
        this.data = response.data || [];
      } catch (error) {
        this.data = [];
        this.$toast.error(this.$t('errors.loadFailed') || 'Failed to load data');
      }
    },

    getTransactionDescription(item) {
      const locale = this.$i18n.locale;

      if (item.type == 1) {
        if (locale === 'uz') return `${item.number}-sonli qarz shartnomasi uchun`;
        if (locale === 'kr') return `${item.number}-сонли қарз шартномаси учун`;
        return `Для договора займа № ${item.number}`;
      }

      if (item.type == 2) {
        const name = item.dtype == 2 ? item.dname : item.dcompany;
        if (locale === 'uz') return `${name} mobil hisobiga o'tkazma`;
        if (locale === 'kr') return `${name} мобил ҳисобига ўтказма`;
        return `Перевод на мобильный счет (${name})`;
      }

      if (item.type == 3) {
        const name = item.dtype == 2 ? item.dname : item.dcompany;
        if (locale === 'uz') return `${name} mobil hisobidan o'tkazma`;
        if (locale === 'kr') return `${name} мобил ҳисобидан ўтказма`;
        return `Перевод с мобильного счета (${name})`;
      }

      if (item.type == 4) return this.$t('a1.a27');
      if (item.type == 5) return this.$t('a1.a26');

      return '';
    },

    closeModal() {
      this.isModalOpen = false;
    },

    /**
     * Get modal type based on transaction type
     */
    getModalType(item) {
      const typeMap = {
        1: 'commission',
        2: 'transfer-outgoing',
        3: 'transfer-incoming',
        4: 'balance-add',
        5: 'balance-withdraw',
      };
      return typeMap[item.type] || 'transfer-outgoing';
    },

    openModalAction(item) {
      this.modalData = item;
      this.currentModalType = this.getModalType(item);
      this.isModalOpen = true;
      this.indexModal++;
    },
  },
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
