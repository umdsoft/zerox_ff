<template>
  <div class="pb-8">
    <!-- Header -->
    <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ texts.title }}</h1>
          <p class="text-sm text-gray-500 mt-1">{{ texts.subtitle }}</p>
        </div>
        <div class="relative">
          <input v-model="search" type="text" :placeholder="texts.search"
            class="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64" />
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Qarzdorlar ro'yxati -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="d in filteredDebtors" :key="d.id"
        @click="openDebtor(d.id)"
        class="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow border border-gray-100">
        <!-- Avatar va ism -->
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg flex-shrink-0">
            {{ d.name?.charAt(0)?.toUpperCase() || '?' }}
          </div>
          <div class="min-w-0">
            <div class="font-semibold text-gray-900 truncate">{{ d.name }}</div>
            <div class="text-sm text-gray-500">{{ d.phone || texts.noPhone }}</div>
          </div>
        </div>

        <!-- Reyting -->
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-500">{{ texts.rating }}</span>
          <div class="flex items-center gap-2">
            <div class="w-20 bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full transition-all" :class="ratingColor(d.rating)" :style="{ width: d.rating + '%' }"></div>
            </div>
            <span class="text-sm font-semibold" :class="ratingTextColor(d.rating)">{{ d.rating }}</span>
          </div>
        </div>

        <!-- Statistika -->
        <div class="grid grid-cols-2 gap-2 text-center border-t border-gray-100 pt-3">
          <div>
            <div class="text-xs text-gray-400">{{ texts.totalDebts }}</div>
            <div class="font-semibold text-gray-900">{{ d.total_debts }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400">{{ texts.onTime }}</div>
            <div class="font-semibold text-green-600">{{ d.on_time_count }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bo'sh holat -->
    <div v-if="!loading && debtors.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      </div>
      <p class="text-gray-500">{{ texts.empty }}</p>
    </div>

    <!-- Qarzdor detail modal -->
    <div v-if="selectedDebtor" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" @click.self="selectedDebtor = null">
      <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl" :class="ratingBg(selectedDebtor.rating)">
                {{ selectedDebtor.name?.charAt(0)?.toUpperCase() }}
              </div>
              <div>
                <div class="font-bold text-lg text-gray-900">{{ selectedDebtor.name }}</div>
                <div class="text-sm text-gray-500">{{ selectedDebtor.phone || texts.noPhone }}</div>
              </div>
            </div>
            <button @click="selectedDebtor = null" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Reyting katta -->
          <div class="text-center bg-gray-50 rounded-xl p-4 mb-6">
            <div class="text-4xl font-bold" :class="ratingTextColor(selectedDebtor.rating)">{{ selectedDebtor.rating }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ texts.ratingLabel }}</div>
            <div class="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div class="h-3 rounded-full" :class="ratingColor(selectedDebtor.rating)" :style="{ width: selectedDebtor.rating + '%' }"></div>
            </div>
          </div>

          <!-- Statistika -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <div class="text-xs text-gray-400">{{ texts.totalDebts }}</div>
              <div class="text-lg font-bold text-gray-900">{{ selectedDebtor.total_debts }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <div class="text-xs text-gray-400">{{ texts.totalAmount }}</div>
              <div class="text-lg font-bold text-gray-900">{{ formatMoney(selectedDebtor.total_amount) }}</div>
            </div>
            <div class="bg-green-50 rounded-lg p-3 text-center">
              <div class="text-xs text-gray-400">{{ texts.onTime }}</div>
              <div class="text-lg font-bold text-green-600">{{ selectedDebtor.on_time_count }}</div>
            </div>
            <div class="bg-red-50 rounded-lg p-3 text-center">
              <div class="text-xs text-gray-400">{{ texts.overdue }}</div>
              <div class="text-lg font-bold text-red-600">{{ selectedDebtor.overdue_count }}</div>
            </div>
          </div>

          <!-- Qarz tarixi -->
          <h3 class="font-semibold text-gray-900 mb-3">{{ texts.debtHistory }}</h3>
          <div v-if="selectedDebtor.debts?.length" class="space-y-2">
            <div v-for="debt in selectedDebtor.debts" :key="debt.id"
              class="flex items-center justify-between p-3 rounded-lg border border-gray-100">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ formatMoney(debt.amount) }} {{ debt.currency }}</div>
                <div class="text-xs text-gray-400">{{ debt.due_date ? formatDate(debt.due_date) : '-' }}</div>
              </div>
              <span :class="[
                'px-2 py-0.5 text-xs font-medium rounded-full',
                debt.status === 'completed' ? 'bg-green-100 text-green-700' :
                debt.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              ]">{{ debt.status }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400">{{ texts.noDebts }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',

  data() {
    return {
      debtors: [],
      search: '',
      loading: true,
      selectedDebtor: null,
    };
  },

  computed: {
    filteredDebtors() {
      if (!this.search) return this.debtors;
      const q = this.search.toLowerCase();
      return this.debtors.filter(d =>
        d.name?.toLowerCase().includes(q) || d.phone?.includes(q)
      );
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: 'Qarzdorlar', subtitle: 'Barcha qarzdorlaringiz profili va reytingi', search: 'Qidirish...', rating: 'Reyting', totalDebts: 'Jami qarz', onTime: "O'z vaqtida", totalAmount: 'Jami summa', overdue: "Muddati o'tgan", ratingLabel: 'Ishonchlilik reytingi', debtHistory: 'Qarz tarixi', noDebts: 'Qarzlar topilmadi', noPhone: 'Telefon yo\'q', empty: 'Qarzdorlar yo\'q' },
        ru: { title: 'Должники', subtitle: 'Профиль и рейтинг всех должников', search: 'Поиск...', rating: 'Рейтинг', totalDebts: 'Всего долгов', onTime: 'Вовремя', totalAmount: 'Общая сумма', overdue: 'Просрочено', ratingLabel: 'Рейтинг надёжности', debtHistory: 'История долгов', noDebts: 'Долги не найдены', noPhone: 'Нет телефона', empty: 'Должников нет' },
        kr: { title: 'Қарздорлар', subtitle: 'Барча қарздорларингиз профили ва рейтинги', search: 'Қидириш...', rating: 'Рейтинг', totalDebts: 'Жами қарз', onTime: 'Ўз вақтида', totalAmount: 'Жами сумма', overdue: 'Муддати ўтган', ratingLabel: 'Ишончлилик рейтинги', debtHistory: 'Қарз тарихи', noDebts: 'Қарзлар топилмади', noPhone: 'Телефон йўқ', empty: 'Қарздорлар йўқ' },
      };
      return t[l] || t.uz;
    },
  },

  async mounted() {
    await this.loadDebtors();
  },

  methods: {
    formatMoney(n) { return n ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    formatDate(d) { if (!d) return ''; const dt = new Date(d); return `${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.${dt.getFullYear()}`; },
    ratingColor(r) { return r >= 70 ? 'bg-green-500' : r >= 50 ? 'bg-yellow-500' : 'bg-red-500'; },
    ratingTextColor(r) { return r >= 70 ? 'text-green-600' : r >= 50 ? 'text-yellow-600' : 'text-red-600'; },
    ratingBg(r) { return r >= 70 ? 'bg-green-500' : r >= 50 ? 'bg-yellow-500' : 'bg-red-500'; },

    async loadDebtors() {
      this.loading = true;
      try {
        const res = await this.$axios.$get('/finance/debtors', { silent: true });
        if (res?.success) this.debtors = res.data;
      } catch (_) {}
      this.loading = false;
    },

    async openDebtor(id) {
      try {
        const res = await this.$axios.$get(`/finance/debtors/${id}`, { silent: true });
        if (res?.success) this.selectedDebtor = res.data;
      } catch (_) {}
    },
  },
};
</script>
