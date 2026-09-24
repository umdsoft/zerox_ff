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

    <!-- SS19 (2026-09-21): sun'iy `max-w-2xl mx-auto` cheklovi OLIB TASHLANDI —
         sahifa mobil ilova skrinshotidan ko'chirilgan edi va keng monitorda
         kontent chapda siqilib qolardi. Endi layout kengligidan foydalanadi. -->
    <div v-else-if="data">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-4">
        <button @click="goBack" class="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm" :title="texts.back">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <!-- SS19: desktopda sarlavha sayt uslubida kattaroq -->
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
      </div>

      <!-- SS19 (2026-09-21): mijoz kartasi va 4 ta statistika katagi endi BITTA gridda.
           Mobil (2 ustun): mijoz kartasi butun qatorni egallaydi (`col-span-2`),
           so'ng 4 katak 2x2 — ya'ni AVVALGI mobil ko'rinish aynan saqlandi.
           Desktop (lg, 6 ustun): mijoz kartasi 2 ustun + 4 katak yonma-yon bir qatorda,
           shuning uchun o'ng tomonda bo'sh joy qolmaydi. -->
      <div class="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
        <!-- Mijoz: shaxs ikonkasi + FISh + telefon -->
        <div class="col-span-2 bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <span :class="['w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0', turi === 'olish' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600']">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 1115 0v.25H4.5v-.25z"/>
            </svg>
          </span>
          <div class="min-w-0">
            <p class="text-lg font-bold text-gray-900 truncate">{{ data.mijoz.fish }}</p>
            <p class="text-sm text-gray-500 truncate mt-0.5">{{ data.mijoz.telefon || '—' }}</p>
          </div>
        </div>

        <!-- 4 katak: Jami qarz / Qaytarilgan qarz / Voz kechilgan qarz / Qoldiq qarz -->
        <div v-for="c in statCards" :key="c.key" :class="['bg-white rounded-2xl shadow-sm p-4 border-l-4', c.border]">
          <p class="text-xs font-medium text-gray-500">{{ c.label }}</p>
          <p class="text-base font-bold text-gray-900 mt-1 leading-tight">{{ formatMoney(c.uzs) }} <span class="text-xs font-normal text-gray-400">UZS</span></p>
          <p class="text-sm font-semibold text-gray-600 mt-0.5 leading-tight">{{ formatMoney(c.usd) }} <span class="text-xs font-normal text-gray-400">USD</span></p>
        </div>
      </div>

      <!-- Amaliyotlar tarixi -->
      <h3 class="text-sm lg:text-base font-bold text-gray-900 mb-2 px-1">{{ texts.tableTitle }} <span class="font-normal text-gray-400">({{ filteredTranzaksiyalar.length }})</span></h3>
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div v-if="!filteredTranzaksiyalar.length" class="px-5 py-12 text-center text-sm text-gray-500">
          {{ texts.emptyTranzaksiyalar }}
        </div>

        <!-- SS19 (2026-09-21): mobil uslubdagi ro'yxat qatorlari o'rniga HAQIQIY
             `<table>` (sayt uslubi, namuna: faoliyat/_id/berish/index.vue).
             Ustunlar bosqichma-bosqich ochiladi:
               Sana      -> md (768px+)
               Mahsulot  -> lg (1024px+)
               Bajargan  -> xl (1280px+)
               Turi/teg  -> sm (640px+)
             Tor ekranda esa ular yashirin bo'lib, sana amaliyot nomi ostida
             ko'rinadi va "Bo'lib to'lash" tegi nom yonida qoladi — ya'ni mobil
             ko'rinish avvalgidek. Hech bir qiymat yo'qolmadi. -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="text-left text-xs font-medium text-gray-500 px-4 sm:px-5 py-3">{{ texts.colAmaliyot }}</th>
                <th class="text-right text-xs font-medium text-gray-500 px-4 py-3">{{ texts.colSumma }}</th>
                <th class="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">{{ texts.colSana }}</th>
                <th class="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden lg:table-cell">{{ texts.colMahsulot }}</th>
                <th class="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden xl:table-cell">{{ texts.colBajargan }}</th>
                <th class="text-center text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">{{ texts.colTuri }}</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tr in filteredTranzaksiyalar"
                :key="tr.id"
                @click="openTr(tr)"
                class="border-b border-gray-50 cursor-pointer hover:bg-blue-50 transition-colors group"
              >
                <!-- Amaliyot: rangli dumaloq ikonka + nom (+ mobilda sana ostida) -->
                <td class="px-4 sm:px-5 py-3.5">
                  <div class="flex items-center gap-3 min-w-0">
                    <span :class="['w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0', amalIconClass(tr)]">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.4">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="amalIconPath(tr.turi)"/>
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5 min-w-0">
                        <span class="font-semibold text-gray-900 truncate">{{ amalLabel(tr) }}</span>
                        <!-- Teg faqat eng tor ekranda inline: sm+ da alohida "Turi" ustuni bor -->
                        <span v-if="isParentBolibTolash(tr)" class="sm:hidden flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-700">
                          {{ texts.turi_bolib }}
                        </span>
                      </div>
                      <!-- Sana mobilda shu yerda (md+ da alohida ustunda) -->
                      <span class="block text-xs text-gray-400 mt-0.5 md:hidden">{{ formatDateTime(tr.created_at) }}</span>
                    </div>
                  </div>
                </td>

                <!-- Summa (+/− rangli) -->
                <td class="px-4 py-3.5 text-right whitespace-nowrap">
                  <span :class="['block text-sm font-bold', amalAmountClass(tr)]">
                    {{ amalAmountSign(tr.turi) }}{{ formatMoney(tr.summa) }}
                  </span>
                  <span class="block text-xs text-gray-400">{{ tr.valyuta }}</span>
                </td>

                <!-- Sana va vaqt -->
                <td class="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap hidden md:table-cell">{{ formatDateTime(tr.created_at) }}</td>

                <!-- Mahsulot (izoh) — faqat "berish" amaliyotida bo'ladi -->
                <td class="px-4 py-3.5 text-sm text-gray-600 hidden lg:table-cell">{{ getMahsulot(tr) || '—' }}</td>

                <!-- Amaliyotni bajargan shaxs telefoni -->
                <td class="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap hidden xl:table-cell">{{ getBajaruvchiTel(tr) || '—' }}</td>

                <!-- Turi: Bo'lib to'lash / Bir martalik -->
                <td class="px-4 py-3.5 text-center hidden sm:table-cell">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap', isParentBolibTolash(tr) ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500']">
                    {{ getAmaliyotTuri(tr) }}
                  </span>
                </td>

                <!-- Chevron -->
                <td class="px-4 py-3.5 text-right">
                  <svg class="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors inline-block" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SS11: amaliyot tafsiloti endi MODAL emas — alohida sahifa
         (/qarz-daftari/tranzaksiya/:id). Blur'li overlay olib tashlandi. -->
  </div>
</template>

<script>
import { fmtDMYHM, formatMoney } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
export default {
  middleware: 'auth',
  data() {
    return {
      data: null, loading: true, loadError: false, fromPath: null,
    };
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

      // 1) REAL 'berish' tranzaksiyalari — har bir alohida qarz-berish eventi.
      //    Shu bilan xodim qo'shgan va konsolidatsiya qilingan qarzlar (bir qarzga
      //    bir nechta berish) TO'LIQ ko'rinadi. (Ilgari qarzdan bitta sintetik satr
      //    derive qilinardi va real berishlar tashlab yuborilardi → xodim kiritgan
      //    qarz tarixda ko'rinmasdi.)
      const realBerish = allTrs.filter(
        (t) => scopedQarzIds.has(Number(t.qarz_id)) && t.turi === 'berish'
      );
      const qarzWithBerish = new Set(realBerish.map((t) => Number(t.qarz_id)));

      // 2) Faqat real 'berish' yozuvi YO'Q eski qarzlar uchun sintetik satr
      //    (legacy data himoyasi — hech bir qarz timeline'dan tushib qolmasin).
      const synthBerish = this.scopedQarzlar
        .filter((q) => !qarzWithBerish.has(Number(q.id)))
        .map((q) => ({
          id: `berish-${q.id}`,
          qarz_id: q.id,
          turi: 'berish',
          summa: q.miqdor,
          valyuta: q.valyuta,
          izoh: q.mahsulot_nomi || null,
          created_at: q.created_at || q.berilgan_sana || '1970-01-01T00:00:00',
          _derived: true,
        }));

      // 3) qaytarish / voz_kechish event'lari real qarz_tranzaksiyalar'dan
      const otherEvents = allTrs.filter((t) =>
        scopedQarzIds.has(Number(t.qarz_id)) && t.turi !== 'berish'
      );

      // 4) Birlashtirib, FAQAT sana bo'yicha xronologik (yangidan eskiga) saralaymiz.
      const combined = [...realBerish, ...synthBerish, ...otherEvents];
      combined.sort((a, b) => {
        const ta = new Date(b.created_at).getTime();
        const tb = new Date(a.created_at).getTime();
        return (isNaN(ta) ? 0 : ta) - (isNaN(tb) ? 0 : tb);
      });
      return combined;
    },
    /**
     * Mobil ilovadagi 4 ta katak: Jami qarz / Qaytarilgan / Voz kechilgan / Qoldiq.
     * Backend `history` javobidagi tayyor stats ishlatiladi. `?turi=` bo'lmasa —
     * berilgan va olingan summalar qo'shiladi.
     */
    statsBox() {
      const s = this.data?.stats || {};
      const pick = (berishKey, olishKey) => {
        const b = s[berishKey] || {};
        const o = s[olishKey] || {};
        if (this.turi === 'berish') return { uzs: Number(b.uzs) || 0, usd: Number(b.usd) || 0 };
        if (this.turi === 'olish') return { uzs: Number(o.uzs) || 0, usd: Number(o.usd) || 0 };
        return {
          uzs: (Number(b.uzs) || 0) + (Number(o.uzs) || 0),
          usd: (Number(b.usd) || 0) + (Number(o.usd) || 0),
        };
      };
      return {
        jami: pick('berilgan', 'olingan'),
        qaytarilgan: pick('undirilgan_berilgan', 'undirilgan_olingan'),
        vozKechilgan: pick('voz_kechilgan_berilgan', 'voz_kechilgan_olingan'),
        qoldiq: pick('qoldiq_berilgan', 'qoldiq_olingan'),
      };
    },
    statCards() {
      const b = this.statsBox;
      return [
        { key: 'jami', label: this.texts.jamiQarz, border: 'border-blue-500', uzs: b.jami.uzs, usd: b.jami.usd },
        // SS-DEV (2026-09-24), mobil hujjat 3-rasm: berilgan qarz uchun "Undirilgan qarz", olingan uchun "Qaytarilgan qarz"
        { key: 'qaytarilgan', label: this.turi === 'olish' ? this.texts.qaytarilganQarz : this.texts.undirilganQarz, border: 'border-green-500', uzs: b.qaytarilgan.uzs, usd: b.qaytarilgan.usd },
        { key: 'voz', label: this.texts.vozKechilganQarz, border: 'border-red-400', uzs: b.vozKechilgan.uzs, usd: b.vozKechilgan.usd },
        { key: 'qoldiq', label: this.texts.qoldiqQarz, border: 'border-amber-500', uzs: b.qoldiq.uzs, usd: b.qoldiq.usd },
      ];
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: "Amaliyotlar tarixi", back: "Orqaga",
          jamiQarz: "Jami qarz", qaytarilganQarz: "Qaytarilgan qarz", undirilganQarz: "Undirilgan qarz",
          vozKechilganQarz: "Voz kechilgan qarz", qoldiqQarz: "Qoldiq qarz",
          tableTitle: "Amaliyotlar tarixi",
          // SS19 (2026-09-21): jadval ustun sarlavhalari (desktop <table> uchun)
          colAmaliyot: "Amaliyot", colSumma: "Summa", colSana: "Sana va vaqt",
          colMahsulot: "Mahsulot", colBajargan: "Bajargan shaxs", colTuri: "Turi",
          emptyTranzaksiyalar: "Hali amaliyotlar yo'q",
          amal_berish: "Qarz berildi", amal_olish: "Qarz olindi",
          amal_qaytarish: "Qarz qaytarildi", amal_voz_kechish: "Qarzdan voz kechildi",
          turi_bolib: "Bo'lib to'lash", turi_birmartalik: "Bir martalik",
          errorTitle: "Mijoz topilmadi yoki kirish ruxsati yo'q",
        },
        ru: {
          title: "История операций", back: "Назад",
          jamiQarz: "Всего долг", qaytarilganQarz: "Возвращённый долг", undirilganQarz: "Взысканный долг",
          vozKechilganQarz: "Прощённый долг", qoldiqQarz: "Остаток долга",
          tableTitle: "История операций",
          // SS19 (2026-09-21): jadval ustun sarlavhalari (desktop <table> uchun)
          colAmaliyot: "Операция", colSumma: "Сумма", colSana: "Дата и время",
          colMahsulot: "Товар", colBajargan: "Кто выполнил", colTuri: "Тип",
          emptyTranzaksiyalar: "Операций пока нет",
          amal_berish: "Долг выдан", amal_olish: "Долг получен",
          amal_qaytarish: "Долг возвращён", amal_voz_kechish: "Долг прощён",
          turi_bolib: "Рассрочка", turi_birmartalik: "Единоразово",
          errorTitle: "Клиент не найден или нет доступа",
        },
        kr: {
          title: "Амалиётлар тарихи", back: "Орқага",
          jamiQarz: "Жами қарз", qaytarilganQarz: "Қайтарилган қарз", undirilganQarz: "Ундирилган қарз",
          vozKechilganQarz: "Воз кечилган қарз", qoldiqQarz: "Қолдиқ қарз",
          tableTitle: "Амалиётлар тарихи",
          // SS19 (2026-09-21): jadval ustun sarlavhalari (desktop <table> uchun)
          colAmaliyot: "Амалиёт", colSumma: "Сумма", colSana: "Сана ва вақт",
          colMahsulot: "Маҳсулот", colBajargan: "Бажарган шахс", colTuri: "Тури",
          emptyTranzaksiyalar: "Ҳали амалиётлар йўқ",
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
    formatMoney, // SS-AUDIT (2026-09-25): utils/helpers
    formatDateTime(d) { return fmtDMYHM(d) }, // SS-AUDIT (2026-09-25): utils/helpers (Safari-xavfsiz parse)
    qarzById(qarzId) {
      return (this.data?.qarzlar || []).find(q => Number(q.id) === Number(qarzId)) || null;
    },
    /**
     * Mahsulot (xizmat) nomi — har bir amaliyotning O'Z mahsuloti: 'berish' izohi
     * = shu berishdagi mahsulot nomi (yaratish/konsolidatsiya izoh=mahsulot_nomi
     * yozadi; derived satrda ham qarz mahsuloti). qaytarish/voz_kechish uchun
     * mahsulot yo'q (ularning izohi mahsulot emas).
     */
    getMahsulot(tr) {
      if (tr && tr.turi === 'berish') {
        return tr.izoh && String(tr.izoh).trim() ? String(tr.izoh).trim() : '';
      }
      return '';
    },
    /**
     * Amaliyotni BAJARGAN shaxs telefoni (xodim yoki do'kon egasi).
     * Backend har bir tranzaksiya uchun `bajaruvchi_telefon`ni hisoblaydi.
     * Sintetik/derived 'berish' satrlarida esa qarz kirituvchisiga qaytamiz.
     */
    getBajaruvchiTel(tr) {
      if (tr && tr.bajaruvchi_telefon) return tr.bajaruvchi_telefon;
      const parent = this.qarzById(tr?.qarz_id);
      return parent?.registrar_telefon || '';
    },
    /**
     * Parent qarz bo'lib to'lash bo'lganligini aniqlash.
     * MySQL'dan bolib_tolash turli tipda kelishi mumkin (1/0/"1"/"0"/true/false/null).
     * Number() bilan normallashtiramiz, va oylar_soni > 0 bo'lsa ham bolib_tolash deb
     * qabul qilamiz (DB'dagi mumkin bo'lgan ma'lumot nomuvofiqligi uchun himoya).
     */
    isParentBolibTolash(tr) {
      const parent = this.qarzById(tr?.qarz_id);
      if (!parent) return false;
      if (Number(parent.bolib_tolash) === 1) return true;
      return Number(parent.oylar_soni) > 0;
    },
    /** Amaliyot turi — "Bo'lib to'lash" yoki "Bir martalik" */
    getAmaliyotTuri(tr) {
      return this.isParentBolibTolash(tr) ? this.texts.turi_bolib : this.texts.turi_birmartalik;
    },
    /** Tranzaksiya turini parent qarz turini hisobga olib labeling */
    amalLabel(tr) {
      if (!tr) return '—';
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
    amalAmountClass(tr) {
      const turi = tr.turi;
      if (turi === 'qaytarish') return 'text-emerald-600';
      if (turi === 'voz_kechish') return 'text-red-600';
      const parent = this.qarzById(tr.qarz_id);
      return parent?.turi === 'olish' ? 'text-green-600' : 'text-blue-600';
    },
    amalAmountSign(turi) {
      if (turi === 'qaytarish' || turi === 'voz_kechish') return '−';
      return '+';
    },
    goBack() {
      // Deterministik parent — mijoz/_id (Qarz tafsiloti)
      const turi = this.turi || '';
      this.$router.push(this.localePath({ name: 'qarz-daftari-mijoz-id', params: { id: this.$route.params.id } }) + (turi ? `?turi=${turi}` : ''));
    },
    /**
     * Amaliyot tafsiloti sahifasiga o'tish (SS11).
     *
     * TEZLIK: bu yerdagi qator allaqachon tafsilot uchun kerak bo'lgan
     * ma'lumotning deyarli hammasini saqlaydi. Uni store orqali uzatamiz —
     * yangi sahifa DARHOL chiziladi, hech qanday so'rov kutilmaydi
     * (ilgari modal ochilib, to'lovlar so'rovi global LoadingBar overlay'ini
     * chiqarardi — aynan shu "aylanuvchi dumaloq" edi).
     *
     * `?mijoz=` va `?turi=` query'lari F5 (to'g'ridan-to'g'ri URL) uchun kerak:
     * store bo'sh bo'lsa, sahifa ular yordamida o'zi yuklab oladi.
     */
    openTr(tr) {
      if (!tr) return;
      const parent = this.qarzById(tr.qarz_id);
      this.$store.commit('qarzTranzaksiya/SET_PAYLOAD', {
        // Nusxa (spread) — store'ga shu sahifaning reaktiv obyektiga HAVOLA
        // qo'yilsa, Vuex strict rejimi (dev) "mutation tashqarisida o'zgardi"
        // deb xato berishi mumkin.
        tranzaksiya: { ...tr },
        qarz: parent ? { ...parent } : null,
        mijozId: this.$route.params.id,
        turi: this.turi,
        bolibTolash: this.isParentBolibTolash(tr),
        bajaruvchi: this.getBajaruvchiTel(tr),
        mahsulot: this.getMahsulot(tr),
      });
      const base = this.localePath({ name: 'qarz-daftari-tranzaksiya-id', params: { id: tr.id } });
      const q = `?mijoz=${encodeURIComponent(this.$route.params.id)}` + (this.turi ? `&turi=${this.turi}` : '');
      this.$router.push(base + q);
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
