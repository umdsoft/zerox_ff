<template>
  <div class="pb-8">
    <div v-if="qarz">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
          <p class="text-gray-500 mt-1">{{ qarz.mijoz?.fish }} — {{ formatMoney(qarz.miqdor) }} {{ qarz.valyuta }}</p>
        </div>
        <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
          <nuxt-link :to="localePath({ name: 'qarz-daftari-qarz-id-amaliyotlar', params: { id: qarz.id } })" class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            {{ texts.history }}
          </nuxt-link>
          <nuxt-link :to="localePath({ name: 'qarz-daftari-qarz-id-kvitansiya', params: { id: qarz.id } })" class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/></svg>
            {{ texts.receipt }}
          </nuxt-link>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chap: Asosiy ma'lumotlar -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Mijoz info + summa kartalar -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">
                {{ qarz.mijoz?.fish?.charAt(0) }}
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">{{ qarz.mijoz?.fish }}</h2>
                <p v-if="qarz.mijoz?.telefon" class="text-sm text-gray-500">{{ qarz.mijoz.telefon }}</p>
              </div>
              <div class="ml-auto">
                <span :class="['px-3 py-1.5 rounded-lg text-xs font-semibold', qarz.status === 'aktiv' ? 'bg-blue-100 text-blue-700' : qarz.status === 'yopilgan' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
                  {{ qarz.status === 'aktiv' ? texts.active : qarz.status === 'yopilgan' ? texts.closed : texts.forgiven }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-xs text-gray-500 mb-1">{{ texts.totalDebt }}</p>
                <p class="text-lg font-bold text-gray-900">{{ formatMoney(qarz.miqdor) }}</p>
                <p class="text-xs text-gray-400">{{ qarz.valyuta }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-xs text-gray-500 mb-1">{{ texts.remaining }}</p>
                <p class="text-lg font-bold" :class="parseFloat(qarz.qoldiq) > 0 ? 'text-red-600' : 'text-green-600'">{{ formatMoney(qarz.qoldiq) }}</p>
                <p class="text-xs text-gray-400">{{ qarz.valyuta }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-xs text-gray-500 mb-1">{{ texts.date }}</p>
                <p class="text-sm font-semibold text-gray-900">{{ qarz.berilgan_sana }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-xs text-gray-500 mb-1">{{ texts.returnDate }}</p>
                <p class="text-sm font-semibold text-gray-900">{{ qarz.qaytarish_sanasi || (qarz.bolib_tolash ? texts.installment + ': ' + qarz.oylar_soni + ' ' + texts.month : '—') }}</p>
              </div>
            </div>
          </div>

          <!-- Bo'lib to'lash jadvali -->
          <div v-if="qarz.tolovlar?.length" class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-bold text-gray-900 mb-4">{{ texts.installmentTable }}</h3>
            <QarzDaftariBolibTolashJadval :tolovlar="qarz.tolovlar" @tolandi="onTolandi" />
          </div>
        </div>

        <!-- O'ng: Amallar paneli -->
        <div>
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">{{ texts.actions }}</h3>
            <div v-if="qarz.status === 'aktiv'" class="space-y-3">
              <button @click="talabQilish" :disabled="talabLoading" class="w-full flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800 rounded-xl font-medium text-sm transition-all disabled:opacity-50">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                {{ talabLoading ? texts.sending : texts.demand }}
              </button>
              <button @click="showYopishModal = true" class="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 rounded-xl font-medium text-sm transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ texts.closeDebt }}
              </button>
              <button @click="showVozKechishModal = true" class="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 rounded-xl font-medium text-sm transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                {{ texts.forgive }}
              </button>
            </div>
            <div v-else class="text-center py-4">
              <span :class="['px-4 py-2 rounded-full text-sm font-semibold', qarz.status === 'yopilgan' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
                {{ qarz.status === 'yopilgan' ? texts.closed : texts.forgiven }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modallar -->
      <QarzDaftariQarzYopishModal v-if="showYopishModal" :qarz="qarz" @close="showYopishModal = false" @saved="reload" />
      <QarzDaftariQarzVozKechishModal v-if="showVozKechishModal" :qarz="qarz" @close="showVozKechishModal = false" @saved="reload" />
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return { qarz: null, showYopishModal: false, showVozKechishModal: false, talabLoading: false };
  },
  computed: {
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: "Qarz tafsiloti", history: "Amaliyotlar tarixi", receipt: "Kvitansiya", totalDebt: "Jami qarz", remaining: "Qoldiq", date: "Berilgan sana", returnDate: "Qaytarish sanasi", installment: "Bo'lib to'lash", month: "oy", installmentTable: "Bo'lib to'lash jadvali", actions: "Amallar", demand: "Qaytarishni talab qilish", sending: "Yuborilmoqda...", closeDebt: "Qarzni yopish", forgive: "Qarzdan voz kechish", active: "Aktiv", closed: "Yopilgan", forgiven: "Voz kechilgan" },
        ru: { title: "Детали долга", history: "История операций", receipt: "Квитанция", totalDebt: "Общий долг", remaining: "Остаток", date: "Дата выдачи", returnDate: "Дата возврата", installment: "Рассрочка", month: "мес", installmentTable: "График рассрочки", actions: "Действия", demand: "Потребовать возврат", sending: "Отправка...", closeDebt: "Закрыть долг", forgive: "Простить долг", active: "Активный", closed: "Закрыт", forgiven: "Прощён" },
        kr: { title: "Қарз тафсилоти", history: "Амалиётлар тарихи", receipt: "Квитансия", totalDebt: "Жами қарз", remaining: "Қолдиқ", date: "Берилган сана", returnDate: "Қайтариш санаси", installment: "Бўлиб тўлаш", month: "ой", installmentTable: "Бўлиб тўлаш жадвали", actions: "Амаллар", demand: "Қайтаришни талаб қилиш", sending: "Юборилмоқда...", closeDebt: "Қарзни ёпиш", forgive: "Қарздан воз кечиш", active: "Актив", closed: "Ёпилган", forgiven: "Воз кечилган" },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.loadQarz(); },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    async loadQarz() {
      try {
        const res = await this.$axios.$get(`/qarz-daftari/qarz/${this.$route.params.id}`, { silent: true });
        if (res?.success) this.qarz = res.data;
      } catch (e) {
        this.$toast?.error('Ma\'lumotlarni yuklashda xatolik');
      }
    },
    async reload() {
      this.showYopishModal = false;
      this.showVozKechishModal = false;
      await this.loadQarz();
    },
    async talabQilish() {
      this.talabLoading = true;
      try {
        await this.$axios.$post(`/qarz-daftari/qarz/${this.qarz.id}/talab`);
        this.$toast?.success("Talab yuborildi");
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik yuz berdi');
      } finally {
        this.talabLoading = false;
      }
    },
    async onTolandi(tolovId) {
      try {
        await this.$axios.put(`/qarz-daftari/tolov/${tolovId}/tolandi`);
        this.$toast?.success("To'lov belgilandi");
        await this.loadQarz();
      } catch (_) { this.$toast?.error('Xatolik'); }
    },
  },
};
</script>
