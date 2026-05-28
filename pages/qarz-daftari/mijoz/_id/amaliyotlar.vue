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
          <p class="text-xl font-bold text-gray-900">{{ scopedQarzlar.length }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-4">
          <p class="text-xs text-gray-500 mb-1">{{ texts.aktivQarzlar }}</p>
          <p class="text-xl font-bold text-amber-600">{{ scopedAktivQarzlar }}</p>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl p-4">
          <p class="text-xs text-gray-500 mb-1">{{ texts.tranzaksiyalarSoni }}</p>
          <p class="text-xl font-bold text-gray-900">{{ filteredTranzaksiyalar.length }}</p>
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

      <!-- Amaliyotlar tarixi (yagona, to'liq kenglik) -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-900">{{ texts.tableTitle }}</h3>
          <span class="text-xs text-gray-500">{{ filteredTranzaksiyalar.length }}</span>
        </div>
        <div v-if="!filteredTranzaksiyalar.length" class="px-5 py-12 text-center text-sm text-gray-500">
          {{ texts.emptyTranzaksiyalar }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th class="px-4 py-3 text-left font-medium">{{ texts.col_amal }}</th>
                <th class="px-4 py-3 text-left font-medium">{{ texts.col_summa }}</th>
                <th class="px-4 py-3 text-left font-medium">{{ texts.col_sana }}</th>
                <th class="px-4 py-3 text-left font-medium">{{ texts.col_mahsulot }}</th>
                <th class="px-4 py-3 text-left font-medium">{{ texts.col_amaliyotTuri }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tr in filteredTranzaksiyalar"
                :key="tr.id"
                class="border-t border-gray-100 hover:bg-gray-50"
              >
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-3">
                    <span :class="['inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0', amalIconClass(tr)]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="amalIconPath(tr.turi)"/>
                      </svg>
                    </span>
                    <p class="text-sm font-medium text-gray-900">{{ amalLabel(tr) }}</p>
                  </div>
                </td>
                <td class="px-4 py-3.5 whitespace-nowrap">
                  <span :class="amalAmountClass(tr.turi)" class="font-semibold">
                    {{ amalAmountSign(tr.turi) }}{{ formatMoney(tr.summa) }}
                  </span>
                  <span class="text-xs text-gray-400 ml-1">{{ tr.valyuta }}</span>
                </td>
                <td class="px-4 py-3.5 text-gray-600 whitespace-nowrap">{{ formatDateTime(tr.created_at) }}</td>
                <td class="px-4 py-3.5 text-gray-700">
                  <span v-if="getMahsulot(tr)">{{ getMahsulot(tr) }}</span>
                  <span v-else class="text-gray-300">—</span>
                </td>
                <td class="px-4 py-3.5">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', getAmaliyotTuriClass(tr)]">
                    {{ getAmaliyotTuri(tr) }}
                  </span>
                </td>
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
    return { data: null, loading: true, loadError: false, fromPath: null };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const valid = from && from.fullPath && from.fullPath !== '/' && from.name !== to.name;
      vm.fromPath = valid ? from.fullPath : null;
    });
  },
  computed: {
    /** ?turi= dan keladi: 'berish' | 'olish' | '' (hammasi) */
    turi() { return this.$route.query?.turi || ''; },
    /** Sahifa ko'rsatadigan qarzlar (turi bo'yicha filter) */
    scopedQarzlar() {
      const all = this.data?.qarzlar || [];
      if (this.turi === 'berish' || this.turi === 'olish') {
        return all.filter(q => q.turi === this.turi);
      }
      return all;
    },
    scopedAktivQarzlar() {
      return this.scopedQarzlar.filter(q => q.status === 'aktiv').length;
    },
    /**
     * Amaliyotlar tarixi rowlari — KAFOLATLI to'liqlik:
     *
     * Avval bu logika qarz_tranzaksiyalar dan 'berish' yozuvlarini olib, yo'q
     * bo'lganlarga sintetik qo'shardi. Lekin amaliyotda qarz_tranzaksiyalar
     * yozuvlari turli sabablarga ko'ra (legacy data, qisman migration, manual
     * insert) qarz va tranzaksiya o'rtasida nomuvofiq bo'lishi mumkin —
     * shu bois ba'zi qarzlar timeline'da yo'qolib qolardi.
     *
     * Yangi yondashuv: 'berish' satrlarini qarz_daftari yozuvlaridan TO'G'RIDAN
     * derive qilamiz (har bir scoped qarz uchun aniq bitta satr). Bu yozuv
     * qarzning o'zidan kelganligi sababli summa/valyuta/sana doim aniq va
     * birorta qarz tushib qolmaydi. Real qarz_tranzaksiyalar dan esa faqat
     * 'qaytarish' va 'voz_kechish' eventlari olinadi (ular qo'shimcha).
     */
    filteredTranzaksiyalar() {
      const allTrs = this.data?.tranzaksiyalar || [];
      const scopedQarzIds = new Set(this.scopedQarzlar.map(q => Number(q.id)));

      // 1) HAR BIR scoped qarz uchun kanonik 'berish' satri (qarzning o'zidan).
      //    created_at — DATETIME (vaqt bilan); yo'q bo'lsa berilgan_sana (DATE).
      const berishRows = this.scopedQarzlar.map((q) => ({
        id: `berish-${q.id}`,
        qarz_id: q.id,
        turi: 'berish',
        summa: q.miqdor,
        valyuta: q.valyuta,
        izoh: q.mahsulot_nomi || null,
        created_at: q.created_at || q.berilgan_sana || '1970-01-01T00:00:00',
        _derived: true,
      }));

      // 2) qaytarish / voz_kechish event'lari real qarz_tranzaksiyalar'dan
      const otherEvents = allTrs.filter((t) =>
        scopedQarzIds.has(Number(t.qarz_id)) && t.turi !== 'berish'
      );

      // 3) Birlashtirib, ikki kalitli sort qilamiz:
      //    a) AVVAL bo'lib to'lash satrlari (KETMA-KET — user talab qilgan)
      //    b) Har bir guruh ichida sana bo'yicha desc (yangidan eskiga)
      //    Bu shu narsani kafolatlaydi: 2+ bo'lib to'lash qarzlari jadval boshida
      //    bir-biriga ulangan holda, bir martalik qarzlar bilan aralashmaydi.
      const isBolib = (row) => {
        const parent = this.qarzById(row.qarz_id);
        if (!parent) return false;
        const flag = Number(parent.bolib_tolash);
        if (flag === 1) return true;
        const oylar = Number(parent.oylar_soni);
        return oylar > 0;
      };

      const combined = [...berishRows, ...otherEvents];
      combined.sort((a, b) => {
        const aBolib = isBolib(a);
        const bBolib = isBolib(b);
        // Bolib to'lash priority — birinchi guruhda
        if (aBolib !== bBolib) return aBolib ? -1 : 1;
        // Guruh ichida sana desc (NaN-xavfsiz)
        const ta = new Date(b.created_at).getTime();
        const tb = new Date(a.created_at).getTime();
        return (isNaN(ta) ? 0 : ta) - (isNaN(tb) ? 0 : tb);
      });
      return combined;
    },
    qoldiqLabel() {
      if (!this.data) return { uzs: 0, usd: 0 };
      // Stats dan turi'ga qarab tegishli qoldiqni olamiz
      let uzs = 0, usd = 0;
      if (this.turi === 'berish') {
        uzs = this.data.stats.qoldiq_berilgan?.uzs || 0;
        usd = this.data.stats.qoldiq_berilgan?.usd || 0;
      } else if (this.turi === 'olish') {
        uzs = this.data.stats.qoldiq_olingan?.uzs || 0;
        usd = this.data.stats.qoldiq_olingan?.usd || 0;
      } else {
        uzs = (this.data.stats.qoldiq_berilgan?.uzs || 0) + (this.data.stats.qoldiq_olingan?.uzs || 0);
        usd = (this.data.stats.qoldiq_berilgan?.usd || 0) + (this.data.stats.qoldiq_olingan?.usd || 0);
      }
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
          tableTitle: "Amaliyotlar tarixi",
          emptyTranzaksiyalar: "Hali amaliyotlar yo'q",
          col_amal: "Amaliyot", col_summa: "Summa", col_sana: "Sana",
          col_mahsulot: "Mahsulot (xizmat) nomi", col_amaliyotTuri: "Amaliyot turi",
          amal_berish: "Qarz berildi", amal_olish: "Qarz olindi",
          amal_qaytarish: "Qarz qaytarildi", amal_voz_kechish: "Qarzdan voz kechildi",
          turi_bolib: "Bo'lib to'lash", turi_birmartalik: "Bir martalik",
          errorTitle: "Mijoz topilmadi yoki kirish ruxsati yo'q",
        },
        ru: {
          title: "История операций", back: "Назад",
          jamiQarzlar: "Всего долгов", aktivQarzlar: "Активные долги",
          tranzaksiyalarSoni: "Кол-во операций", qoldiq: "Общий остаток",
          tableTitle: "История операций",
          emptyTranzaksiyalar: "Операций пока нет",
          col_amal: "Операция", col_summa: "Сумма", col_sana: "Дата",
          col_mahsulot: "Наим. товара (услуги)", col_amaliyotTuri: "Тип операции",
          amal_berish: "Долг выдан", amal_olish: "Долг получен",
          amal_qaytarish: "Долг возвращён", amal_voz_kechish: "Долг прощён",
          turi_bolib: "Рассрочка", turi_birmartalik: "Единоразово",
          errorTitle: "Клиент не найден или нет доступа",
        },
        kr: {
          title: "Амалиётлар тарихи", back: "Орқага",
          jamiQarzlar: "Жами қарзлар", aktivQarzlar: "Актив қарзлар",
          tranzaksiyalarSoni: "Амалиётлар сони", qoldiq: "Умумий қолдиқ",
          tableTitle: "Амалиётлар тарихи",
          emptyTranzaksiyalar: "Ҳали амалиётлар йўқ",
          col_amal: "Амалиёт", col_summa: "Сумма", col_sana: "Сана",
          col_mahsulot: "Маҳсулот (хизмат) номи", col_amaliyotTuri: "Амалиёт тури",
          amal_berish: "Қарз берилди", amal_olish: "Қарз олинди",
          amal_qaytarish: "Қарз қайтарилди", amal_voz_kechish: "Қарздан воз кечилди",
          turi_bolib: "Бўлиб тўлаш", turi_birmartalik: "Бир марталик",
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
    /**
     * Mahsulot (xizmat) nomi — har doim parent qarzning mahsulot_nomi.
     * (tr.izoh emas — chunki voz_kechish izohi yoki "Boshlang'ich to'lov" izohi mahsulot emas)
     */
    getMahsulot(tr) {
      const parent = this.qarzById(tr.qarz_id);
      return parent?.mahsulot_nomi || '';
    },
    /**
     * Parent qarz bo'lib to'lash bo'lganligini aniqlash.
     * MySQL'dan bolib_tolash turli tipda kelishi mumkin (1/0/"1"/"0"/true/false/null).
     * Number() bilan normallashtiramiz, va oylar_soni > 0 bo'lsa ham bolib_tolash deb qabul qilamiz
     * (DB'dagi mumkin bo'lgan ma'lumot nomuvofiqligi uchun himoya).
     */
    isParentBolibTolash(tr) {
      const parent = this.qarzById(tr.qarz_id);
      if (!parent) return false;
      const flag = Number(parent.bolib_tolash);
      if (flag === 1) return true;
      // oylar_soni mavjud va > 0 bo'lsa, bolib_tolash deb qabul qilamiz
      const oylar = Number(parent.oylar_soni);
      return oylar > 0;
    },
    /** Amaliyot turi — "Bo'lib to'lash" yoki "Bir martalik" */
    getAmaliyotTuri(tr) {
      return this.isParentBolibTolash(tr) ? this.texts.turi_bolib : this.texts.turi_birmartalik;
    },
    getAmaliyotTuriClass(tr) {
      return this.isParentBolibTolash(tr) ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600';
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
      if (turi === 'qaytarish' || turi === 'voz_kechish') return '−';
      return '';
    },
    goBack() {
      // Deterministik parent — mijoz/_id (Qarz tafsiloti)
      const turi = this.turi || '';
      this.$router.push(this.localePath({ name: 'qarz-daftari-mijoz-id', params: { id: this.$route.params.id } }) + (turi ? `?turi=${turi}` : ''));
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
