<template>
  <div class="pb-8">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <svg class="w-10 h-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>

    <!-- Error -->
    <div v-else-if="loadError" class="flex items-center justify-center py-20">
      <div class="text-center max-w-md">
        <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">{{ texts.errorTitle }}</h2>
        <button @click="goBack" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm">{{ texts.back }}</button>
      </div>
    </div>

    <div v-else-if="data">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div class="flex items-start gap-3">
          <button @click="goBack" class="flex-shrink-0 mt-1 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm" :title="texts.back">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
            <p class="text-gray-500 mt-1">{{ data.mijoz.fish }}<span v-if="data.mijoz.telefon" class="text-gray-400"> — {{ data.mijoz.telefon }}</span></p>
          </div>
        </div>
      </div>

      <!-- Mini stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div class="bg-white border border-gray-200 rounded-xl p-4">
          <p class="text-xs text-gray-500 mb-1">{{ texts.jamiQarzlar }}</p>
          <p class="text-xl font-bold text-gray-900">{{ data.stats.jami_qarzlar }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-4">
          <p class="text-xs text-gray-500 mb-1">{{ texts.aktivQarzlar }}</p>
          <p class="text-xl font-bold text-amber-600">{{ data.stats.aktiv_qarzlar }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-4">
          <p class="text-xs text-gray-500 mb-1">{{ texts.tranzaksiyalarSoni }}</p>
          <p class="text-xl font-bold text-gray-900">{{ data.tranzaksiyalar.length }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-4">
          <p class="text-xs text-gray-500 mb-1">{{ texts.qoldiq }}</p>
          <p class="text-sm font-bold text-gray-900 leading-tight">
            <span v-if="qoldiqLabel.uzs">{{ qoldiqLabel.uzs }} <span class="text-xs text-gray-400">UZS</span></span>
            <span v-if="qoldiqLabel.uzs && qoldiqLabel.usd"><br/></span>
            <span v-if="qoldiqLabel.usd">{{ qoldiqLabel.usd }} <span class="text-xs text-gray-400">USD</span></span>
            <span v-if="!qoldiqLabel.uzs && !qoldiqLabel.usd" class="text-gray-400">—</span>
          </p>
        </div>
      </div>

      <!-- Amaliyotlar tarixi (yagona, to'liq kenglik) — Qarz berildi/olindi/qaytarildi/voz kechildi -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-900">{{ texts.tranzaksiyalarTable }}</h3>
          <span class="text-xs text-gray-500">{{ data.tranzaksiyalar.length }}</span>
        </div>
        <div v-if="!data.tranzaksiyalar.length" class="px-5 py-12 text-center text-sm text-gray-500">
          {{ texts.emptyTranzaksiyalar }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th class="px-5 py-3 text-left font-medium">{{ texts.col_amal }}</th>
                <th class="px-5 py-3 text-right font-medium">{{ texts.col_summa }}</th>
                <th class="px-5 py-3 text-left font-medium">{{ texts.col_sana }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tr in data.tranzaksiyalar"
                :key="tr.id"
                class="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                @click="openQarzById(tr.qarz_id)"
              >
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <span :class="['inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0', amalIconClass(tr)]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="amalIconPath(tr.turi)"/>
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-900">{{ amalLabel(tr) }}</p>
                      <p v-if="tr.izoh" class="text-xs text-gray-500 truncate max-w-md">{{ tr.izoh }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3.5 text-right whitespace-nowrap">
                  <span :class="amalAmountClass(tr.turi)" class="font-semibold">
                    {{ amalAmountSign(tr.turi) }}{{ formatMoney(tr.summa) }}
                  </span>
                  <span class="text-xs text-gray-400 ml-1">{{ tr.valyuta }}</span>
                </td>
                <td class="px-5 py-3.5 text-gray-600 whitespace-nowrap">{{ formatDateTime(tr.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return { data: null, loading: true, loadError: false, previousRouteName: null };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => { vm.previousRouteName = from?.name || null; });
  },
  computed: {
    qoldiqLabel() {
      if (!this.data) return { uzs: 0, usd: 0 };
      const uzs = (this.data.stats.qoldiq_berilgan?.uzs || 0) + (this.data.stats.qoldiq_olingan?.uzs || 0);
      const usd = (this.data.stats.qoldiq_berilgan?.usd || 0) + (this.data.stats.qoldiq_olingan?.usd || 0);
      return {
        uzs: uzs > 0 ? this.formatMoney(uzs) : 0,
        usd: usd > 0 ? this.formatMoney(usd) : 0,
      };
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: "Amaliyotlar tarixi", back: "Orqaga",
          jamiQarzlar: "Jami qarzlar", aktivQarzlar: "Aktiv qarzlar",
          tranzaksiyalarSoni: "Amaliyotlar soni", qoldiq: "Umumiy qoldiq",
          tranzaksiyalarTable: "Amaliyotlar tarixi",
          emptyTranzaksiyalar: "Hali amaliyotlar yo'q",
          col_sana: "Sana", col_amal: "Amal", col_summa: "Summa",
          amal_berish: "Qarz berildi", amal_olish: "Qarz olindi",
          amal_qaytarish: "Qarz qaytarildi", amal_voz_kechish: "Qarzdan voz kechildi",
          errorTitle: "Mijoz topilmadi yoki kirish ruxsati yo'q",
        },
        ru: {
          title: "История операций", back: "Назад",
          jamiQarzlar: "Всего долгов", aktivQarzlar: "Активные долги",
          tranzaksiyalarSoni: "Кол-во операций", qoldiq: "Общий остаток",
          tranzaksiyalarTable: "История операций",
          emptyTranzaksiyalar: "Операций пока нет",
          col_sana: "Дата", col_amal: "Действие", col_summa: "Сумма",
          amal_berish: "Долг выдан", amal_olish: "Долг получен",
          amal_qaytarish: "Долг возвращён", amal_voz_kechish: "Долг прощён",
          errorTitle: "Клиент не найден или нет доступа",
        },
        kr: {
          title: "Амалиётлар тарихи", back: "Орқага",
          jamiQarzlar: "Жами қарзлар", aktivQarzlar: "Актив қарзлар",
          tranzaksiyalarSoni: "Амалиётлар сони", qoldiq: "Умумий қолдиқ",
          tranzaksiyalarTable: "Амалиётлар тарихи",
          emptyTranzaksiyalar: "Ҳали амалиётлар йўқ",
          col_sana: "Сана", col_amal: "Амал", col_summa: "Сумма",
          amal_berish: "Қарз берилди", amal_olish: "Қарз олинди",
          amal_qaytarish: "Қарз қайтарилди", amal_voz_kechish: "Қарздан воз кечилди",
          errorTitle: "Мижоз топилмади ёки рухсат йўқ",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.load(); },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    formatDateTime(d) {
      if (!d) return '—';
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      const date = `${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.${dt.getFullYear()}`;
      const time = `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
      return `${date} ${time}`;
    },
    qarzById(qarzId) {
      return (this.data?.qarzlar || []).find(q => q.id === qarzId) || null;
    },
    /** Tranzaksiya turini parent qarz turini hisobga olib labeling */
    amalLabel(tr) {
      if (tr.turi === 'berish') {
        const parent = this.qarzById(tr.qarz_id);
        if (parent?.turi === 'olish') return this.texts.amal_olish;
        return this.texts.amal_berish;
      }
      if (tr.turi === 'qaytarish') return this.texts.amal_qaytarish;
      if (tr.turi === 'voz_kechish') return this.texts.amal_voz_kechish;
      return tr.turi || '—';
    },
    amalIconClass(tr) {
      const turi = tr.turi;
      if (turi === 'berish') {
        const parent = this.qarzById(tr.qarz_id);
        return parent?.turi === 'olish' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600';
      }
      if (turi === 'qaytarish') return 'bg-emerald-100 text-emerald-600';
      if (turi === 'voz_kechish') return 'bg-red-100 text-red-600';
      return 'bg-gray-100 text-gray-600';
    },
    amalIconPath(turi) {
      if (turi === 'qaytarish') return 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6';
      if (turi === 'voz_kechish') return 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 015.636 5.636';
      return 'M12 6v6m0 0v6m0-6h6m-6 0H6';
    },
    amalAmountClass(turi) {
      if (turi === 'qaytarish') return 'text-emerald-600';
      if (turi === 'voz_kechish') return 'text-red-600';
      return 'text-gray-900';
    },
    amalAmountSign(turi) {
      if (turi === 'qaytarish') return '−';
      if (turi === 'voz_kechish') return '−';
      return '';
    },
    openQarzById(qarzId) {
      if (!qarzId) return;
      this.$router.push(this.localePath({ name: 'qarz-daftari-qarz-id', params: { id: qarzId } }));
    },
    goBack() {
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push(this.localePath({ name: 'qarz-daftari-mijoz-id', params: { id: this.$route.params.id } }));
      }
    },
    async load() {
      this.loading = true; this.loadError = false;
      try {
        const res = await this.$axios.$get(`/qarz-daftari/mijozlar/${this.$route.params.id}/history`, { silent: true });
        if (res?.success && res.data) this.data = res.data;
        else this.loadError = true;
      } catch (_) { this.loadError = true; } finally { this.loading = false; }
    },
  },
};
</script>
