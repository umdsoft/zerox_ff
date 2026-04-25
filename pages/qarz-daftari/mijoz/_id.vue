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
        <button @click="goBack" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors">{{ texts.back }}</button>
      </div>
    </div>

    <div v-else-if="data">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div class="flex items-start gap-3">
          <button @click="goBack" class="flex-shrink-0 mt-1 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm transition-colors" :title="texts.back">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ data.mijoz.fish }}</h1>
            <p class="text-gray-500 mt-1">{{ data.mijoz.telefon || texts.noPhone }}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
          <nuxt-link :to="newDebtUrl('berish')" class="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
            {{ texts.newBerish }}
          </nuxt-link>
          <nuxt-link :to="newDebtUrl('olish')" class="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-sm transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            {{ texts.newOlish }}
          </nuxt-link>
        </div>
      </div>

      <!-- Statistika -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p class="text-xs font-medium text-gray-500">{{ texts.totalDebts }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ data.stats.jami_qarzlar }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
          <p class="text-xs font-medium text-gray-500">{{ texts.activeDebts }}</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ data.stats.aktiv_qarzlar }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-400">
          <p class="text-xs font-medium text-gray-500">{{ texts.qoldiqBerilgan }}</p>
          <p class="text-base font-bold text-gray-900 mt-1">{{ formatMoney(data.stats.qoldiq_berilgan.uzs) }} <span class="text-xs text-gray-400">UZS</span></p>
          <p v-if="data.stats.qoldiq_berilgan.usd > 0" class="text-sm font-semibold text-gray-700">{{ formatMoney(data.stats.qoldiq_berilgan.usd) }} <span class="text-xs text-gray-400">USD</span></p>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-400">
          <p class="text-xs font-medium text-gray-500">{{ texts.qoldiqOlingan }}</p>
          <p class="text-base font-bold text-gray-900 mt-1">{{ formatMoney(data.stats.qoldiq_olingan.uzs) }} <span class="text-xs text-gray-400">UZS</span></p>
          <p v-if="data.stats.qoldiq_olingan.usd > 0" class="text-sm font-semibold text-gray-700">{{ formatMoney(data.stats.qoldiq_olingan.usd) }} <span class="text-xs text-gray-400">USD</span></p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chap: Qarzlar ro'yxati -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-base font-bold text-gray-900">{{ texts.qarzlarTitle }}</h3>
            <span class="text-xs text-gray-400">{{ data.qarzlar.length }} {{ texts.itemsLabel }}</span>
          </div>
          <table v-if="data.qarzlar.length" class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="text-left text-xs font-medium text-gray-500 px-4 py-3">{{ texts.colTuri }}</th>
                <th class="text-right text-xs font-medium text-gray-500 px-4 py-3">{{ texts.colMiqdor }}</th>
                <th class="text-right text-xs font-medium text-gray-500 px-4 py-3">{{ texts.colQoldiq }}</th>
                <th class="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">{{ texts.colSana }}</th>
                <th class="text-center text-xs font-medium text-gray-500 px-4 py-3">{{ texts.colHolat }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="q in data.qarzlar" :key="q.id" @click="openQarz(q)" class="border-b border-gray-50 cursor-pointer hover:bg-blue-50 transition-colors">
                <td class="px-4 py-3">
                  <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold', q.turi === 'berish' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700']">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="q.turi === 'berish'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                    </svg>
                    {{ q.turi === 'berish' ? texts.berish : texts.olish }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right text-sm font-semibold text-gray-900">{{ formatMoney(q.miqdor) }} <span class="text-xs text-gray-400">{{ q.valyuta }}</span></td>
                <td class="px-4 py-3 text-right">
                  <span :class="['text-sm font-semibold', parseFloat(q.qoldiq) > 0 ? 'text-red-600' : 'text-gray-400']">
                    {{ formatMoney(q.qoldiq) }} <span class="text-xs text-gray-400">{{ q.valyuta }}</span>
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{{ formatDate(q.berilgan_sana) }}</td>
                <td class="px-4 py-3 text-center">
                  <span :class="statusBadge(q)" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium">
                    {{ statusText(q) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center py-12 text-sm text-gray-400">{{ texts.emptyDebts }}</div>
        </div>

        <!-- O'ng: Tranzaksiyalar tarixi -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-base font-bold text-gray-900">{{ texts.transactionsTitle }}</h3>
            <span class="text-xs text-gray-400">{{ data.tranzaksiyalar.length }}</span>
          </div>
          <ul v-if="data.tranzaksiyalar.length" class="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            <li v-for="t in data.tranzaksiyalar" :key="t.id" class="px-5 py-3 hover:bg-gray-50 transition-colors">
              <div class="flex items-start gap-3">
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', txBg(t.turi)]">
                  <svg class="w-4 h-4" :class="txColor(t.turi)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="t.turi === 'berish'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                    <path v-else-if="t.turi === 'qaytarish'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <span :class="['text-xs font-semibold', txColor(t.turi)]">{{ txLabel(t.turi) }}</span>
                    <span class="text-sm font-bold text-gray-900">{{ formatMoney(t.summa) }} <span class="text-xs font-normal text-gray-400">{{ t.valyuta }}</span></span>
                  </div>
                  <p class="text-xs text-gray-400 mt-0.5">{{ formatDateTime(t.created_at) }}</p>
                  <p v-if="t.izoh" class="text-xs text-gray-500 mt-1 truncate">{{ t.izoh }}</p>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="text-center py-12 text-sm text-gray-400">{{ texts.emptyTransactions }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return { data: null, loading: true, loadError: false };
  },
  computed: {
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          noPhone: "Telefon ko'rsatilmagan",
          back: "Orqaga",
          newBerish: "Qarzga berish",
          newOlish: "Qarzga olish",
          totalDebts: "Jami qarzlar",
          activeDebts: "Aktiv qarzlar",
          qoldiqBerilgan: "Berilgan qoldiq",
          qoldiqOlingan: "Olingan qoldiq",
          qarzlarTitle: "Qarzlar ro'yxati",
          itemsLabel: "ta",
          transactionsTitle: "Amaliyotlar tarixi",
          colTuri: "Turi",
          colMiqdor: "Miqdor",
          colQoldiq: "Qoldiq",
          colSana: "Sana",
          colHolat: "Holat",
          berish: "Berish",
          olish: "Olish",
          statusActive: "Aktiv",
          statusClosed: "Yopilgan",
          statusForgiven: "Voz kechilgan",
          statusExpired: "Muddati o'tgan",
          emptyDebts: "Bu mijoz bilan qarzlar yo'q",
          emptyTransactions: "Amaliyotlar yo'q",
          errorTitle: "Mijoz topilmadi yoki kirish ruxsati yo'q",
          txBerish: "Qarz berildi",
          txQaytarish: "Qarz qaytarildi",
          txVozKechish: "Voz kechildi",
        },
        ru: {
          noPhone: "Телефон не указан",
          back: "Назад",
          newBerish: "Дать в долг",
          newOlish: "Взять в долг",
          totalDebts: "Всего долгов",
          activeDebts: "Активные",
          qoldiqBerilgan: "Остаток выданного",
          qoldiqOlingan: "Остаток полученного",
          qarzlarTitle: "Список долгов",
          itemsLabel: "шт",
          transactionsTitle: "История операций",
          colTuri: "Тип",
          colMiqdor: "Сумма",
          colQoldiq: "Остаток",
          colSana: "Дата",
          colHolat: "Статус",
          berish: "Выдан",
          olish: "Получен",
          statusActive: "Активный",
          statusClosed: "Закрыт",
          statusForgiven: "Прощён",
          statusExpired: "Просрочен",
          emptyDebts: "Нет долгов с этим клиентом",
          emptyTransactions: "Нет операций",
          errorTitle: "Клиент не найден или нет доступа",
          txBerish: "Выдан долг",
          txQaytarish: "Возврат",
          txVozKechish: "Прощение",
        },
        kr: {
          noPhone: "Телефон кўрсатилмаган",
          back: "Орқага",
          newBerish: "Қарзга бериш",
          newOlish: "Қарзга олиш",
          totalDebts: "Жами қарзлар",
          activeDebts: "Актив қарзлар",
          qoldiqBerilgan: "Берилган қолдиқ",
          qoldiqOlingan: "Олинган қолдиқ",
          qarzlarTitle: "Қарзлар рўйхати",
          itemsLabel: "та",
          transactionsTitle: "Амалиётлар тарихи",
          colTuri: "Тури",
          colMiqdor: "Миқдор",
          colQoldiq: "Қолдиқ",
          colSana: "Сана",
          colHolat: "Ҳолат",
          berish: "Бериш",
          olish: "Олиш",
          statusActive: "Актив",
          statusClosed: "Ёпилган",
          statusForgiven: "Воз кечилган",
          statusExpired: "Муддати ўтган",
          emptyDebts: "Бу мижоз билан қарзлар йўқ",
          emptyTransactions: "Амалиётлар йўқ",
          errorTitle: "Мижоз топилмади ёки рухсат йўқ",
          txBerish: "Қарз берилди",
          txQaytarish: "Қайтарилди",
          txVozKechish: "Воз кечилди",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.load(); },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    formatDate(d) {
      if (!d) return '—';
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return `${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.${dt.getFullYear()}`;
    },
    formatDateTime(d) {
      if (!d) return '';
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      const date = `${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.${dt.getFullYear()}`;
      const time = `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}`;
      return `${date}, ${time}`;
    },
    isExpired(q) {
      return q.status === 'aktiv' && q.qaytarish_sanasi && new Date(q.qaytarish_sanasi) < new Date();
    },
    statusText(q) {
      if (this.isExpired(q)) return this.texts.statusExpired;
      if (q.status === 'aktiv') return this.texts.statusActive;
      if (q.status === 'yopilgan') return this.texts.statusClosed;
      return this.texts.statusForgiven;
    },
    statusBadge(q) {
      if (this.isExpired(q)) return 'bg-red-50 text-red-700';
      if (q.status === 'aktiv') return 'bg-amber-50 text-amber-700';
      if (q.status === 'yopilgan') return 'bg-green-50 text-green-700';
      return 'bg-gray-50 text-gray-500';
    },
    txBg(turi) {
      if (turi === 'berish') return 'bg-blue-100';
      if (turi === 'qaytarish') return 'bg-green-100';
      return 'bg-gray-100';
    },
    txColor(turi) {
      if (turi === 'berish') return 'text-blue-600';
      if (turi === 'qaytarish') return 'text-green-600';
      return 'text-gray-500';
    },
    txLabel(turi) {
      if (turi === 'berish') return this.texts.txBerish;
      if (turi === 'qaytarish') return this.texts.txQaytarish;
      return this.texts.txVozKechish;
    },
    newDebtUrl(turi) {
      if (!this.data?.mijoz?.savdo_faoliyat_id) return '#';
      const name = turi === 'berish' ? 'qarz-daftari-faoliyat-id-berish-yangi' : 'qarz-daftari-faoliyat-id-olish-yangi';
      return this.localePath({ name, params: { id: this.data.mijoz.savdo_faoliyat_id } }) + `?mijoz_id=${this.data.mijoz.id}`;
    },
    openQarz(q) {
      this.$router.push(this.localePath({ name: 'qarz-daftari-qarz-id', params: { id: q.id } }));
    },
    goBack() {
      if (window.history.length > 1) this.$router.back();
      else this.$router.push(this.localePath({ name: 'qarz-daftari' }));
    },
    async load() {
      this.loading = true;
      this.loadError = false;
      try {
        const res = await this.$axios.$get(`/qarz-daftari/mijozlar/${this.$route.params.id}/history`, { silent: true });
        if (res?.success && res.data) this.data = res.data;
        else this.loadError = true;
      } catch (_) { this.loadError = true; }
      finally { this.loading = false; }
    },
  },
};
</script>
