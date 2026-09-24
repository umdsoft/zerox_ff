<template>
  <div class="pb-8">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <svg class="w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p class="text-sm text-gray-500">{{ texts.loading }}</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="loadError" class="flex items-center justify-center py-20">
      <div class="text-center max-w-md">
        <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">{{ texts.errorTitle }}</h2>
        <p class="text-gray-500 mb-6 text-sm">{{ texts.errorDesc }}</p>
        <div class="flex gap-3 justify-center">
          <button @click="loadQarz" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors inline-flex items-center">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            {{ texts.retry }}
          </button>
          <nuxt-link :to="localePath({ name: 'qarz-daftari' })" class="px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium text-sm transition-colors border border-gray-300 inline-flex items-center">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ texts.back }}
          </nuxt-link>
        </div>
      </div>
    </div>

    <div v-else-if="qarz">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div class="flex items-start gap-3">
          <button @click="goBack" class="flex-shrink-0 mt-1 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm transition-colors" :title="texts.back">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
            <p class="text-gray-500 mt-1">{{ qarz.mijoz?.fish }} — {{ formatMoney(qarz.miqdor) }} {{ qarz.valyuta }}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
          <nuxt-link v-if="qarz.mijoz_id" :to="localePath({ name: 'qarz-daftari-mijoz-id-amaliyotlar', params: { id: qarz.mijoz_id } }) + (qarz.turi ? '?turi=' + qarz.turi : '')" class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm text-sm">
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
              <div :class="['w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm', qarz.turi === 'berish' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600']">
                {{ (qarz.mijoz?.fish || '?').charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <h2 class="text-lg font-bold text-gray-900 truncate">{{ qarz.mijoz?.fish }}</h2>
                <div class="flex flex-wrap items-center gap-2 mt-1">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', qarz.turi === 'berish' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700']">
                    {{ qarz.turi === 'berish' ? texts.qarzOluvchi : texts.qarzBeruvchi }}
                  </span>
                  <p v-if="qarz.mijoz?.telefon" class="text-sm text-gray-500">{{ qarz.mijoz.telefon }}</p>
                </div>
              </div>
              <div class="flex-shrink-0">
                <span :class="['px-3 py-1.5 rounded-lg text-xs font-semibold', qarz.status === 'aktiv' ? 'bg-amber-100 text-amber-700' : qarz.status === 'yopilgan' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
                  {{ qarz.status === 'aktiv' ? texts.active : qarz.status === 'yopilgan' ? texts.closed : texts.forgiven }}
                </span>
              </div>
            </div>

            <!-- SS3: Qarz rasmiylashtirilgan vaqtdagi mahsulot nomi.
                 Kiritilmagan bo'lsa umuman ko'rsatilmaydi (hech nima qayd etilmaydi). -->
            <div v-if="qarz.mahsulot_nomi" class="flex items-start gap-2.5 mb-5 pb-5 border-b border-gray-100">
              <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs text-gray-500">{{ texts.mahsulot }}</p>
                <p class="text-sm font-semibold text-gray-900 break-words">{{ qarz.mahsulot_nomi }}</p>
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
                <p class="text-xs text-gray-500 mb-1">{{ qarz.turi === 'olish' ? texts.dateOlish : texts.date }}</p>
                <p class="text-sm font-semibold text-gray-900">{{ formatDate(qarz.berilgan_sana) }}</p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-xs text-gray-500 mb-1">{{ texts.returnDate }}</p>
                <p v-if="qarz.bolib_tolash" class="text-sm font-semibold text-purple-600">{{ texts.installment }}: {{ qarz.oylar_soni }} {{ texts.month }}</p>
                <p v-else class="text-sm font-semibold text-gray-900">{{ formatDate(qarz.qaytarish_sanasi) }}</p>
              </div>
            </div>
          </div>

          <!-- Bo'lib to'lash jadvali -->
          <div v-if="qarz.tolovlar?.length" class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-bold text-gray-900 mb-4">{{ texts.installmentTable }}</h3>
            <QarzDaftariBolibTolashJadval :tolovlar="qarz.tolovlar" :valyuta="qarz.valyuta" @tolandi="onTolandi" />
          </div>

          <!-- SS8b: Tavsiya — mijozning oldingi qarzlarini o'z vaqtida qaytarganiga qarab -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <h3 class="font-bold text-gray-900">{{ texts.recommendation }}</h3>
            </div>
            <div class="flex items-start gap-3 p-3 rounded-xl" :class="relClass.box">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="relClass.icon">
                <svg class="w-5 h-5" :class="relClass.iconText" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="relClass.path"/></svg>
              </div>
              <div class="min-w-0">
                <p class="font-semibold" :class="relClass.title">{{ relTitle }}</p>
                <p class="text-sm text-gray-600">{{ relDesc }}<span v-if="reliability.total > 0" class="text-gray-400"> ({{ reliability.on_time }}/{{ reliability.total }} {{ texts.relOntime }})</span></p>
              </div>
            </div>
          </div>
        </div>

        <!-- O'ng: Amallar paneli -->
        <div>
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">{{ texts.actions }}</h3>
            <div v-if="qarz.status === 'aktiv'" class="space-y-3">
              <!-- OLISH: faqat "Qarzni qaytarish" tugmasi -->
              <template v-if="qarz.turi === 'olish'">
                <nuxt-link :to="localePath({ name: 'qarz-daftari-qarz-id-yopish', params: { id: qarz.id } })" class="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 rounded-xl font-medium text-sm transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                  {{ texts.repay }}
                </nuxt-link>
              </template>
              <!-- BERISH: 3 tugma -->
              <template v-else>
                <button @click="talabQilish" :disabled="talabLoading" :style="talabLoading ? 'opacity:.5; cursor:not-allowed' : ''" class="w-full flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800 rounded-xl font-medium text-sm transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                  {{ talabLoading ? texts.sending : texts.demand }}
                </button>
                <nuxt-link :to="localePath({ name: 'qarz-daftari-qarz-id-yopish', params: { id: qarz.id } })" class="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 rounded-xl font-medium text-sm transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {{ texts.closeDebt }}
                </nuxt-link>
                <nuxt-link :to="localePath({ name: 'qarz-daftari-qarz-id-voz-kechish', params: { id: qarz.id } })" class="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 rounded-xl font-medium text-sm transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                  {{ texts.forgive }}
                </nuxt-link>
              </template>
            </div>
            <div v-else class="text-center py-4">
              <span :class="['px-4 py-2 rounded-full text-sm font-semibold', qarz.status === 'yopilgan' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600']">
                {{ qarz.status === 'yopilgan' ? texts.closed : texts.forgiven }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modallar olib tashlandi — endi alohida sahifalar:
           /qarz-daftari/qarz/:id/yopish va /qarz-daftari/qarz/:id/voz-kechish -->
    </div>
  </div>
</template>

<script>
import { fmtDMY, formatMoney } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
export default {
  middleware: 'auth',
  data() {
    return {
      qarz: null,
      reliability: { level: 'none', total: 0, on_time: 0, late: 0 },
      loading: true,
      loadError: false,
      showYopishModal: false,
      showVozKechishModal: false,
      talabLoading: false,
      // Smart back: oldingi route ismini esda saqlaymiz, agar amaliyotlar bo'lsa
      // — back ishlatmaymiz (loop oldini olamiz)
      previousRouteName: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.previousRouteName = from?.name || null;
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.previousRouteName = from?.name || null;
    next();
  },
  computed: {
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: "Qarz tafsiloti", history: "Amaliyotlar tarixi", receipt: "Kvitansiya", totalDebt: "Jami qarz", remaining: "Qoldiq", date: "Berilgan sana", dateOlish: "Olingan sana", returnDate: "Qaytarish sanasi", installment: "Bo'lib to'lash", month: "oy", installmentTable: "Bo'lib to'lash jadvali", actions: "Amallar", demand: "Qaytarishni talab qilish", sending: "Yuborilmoqda...", closeDebt: "Qarzni yopish", forgive: "Qarzdan voz kechish", repay: "Qarzni qaytarish", active: "Aktiv", closed: "Yopilgan", forgiven: "Voz kechilgan", loading: "Yuklanmoqda...", errorTitle: "Ma'lumotni yuklab bo'lmadi", errorDesc: "Qarz ma'lumoti mavjud emas yoki server bilan aloqa o'rnatilmadi. Qaytadan urinib ko'ring.", retry: "Qaytadan urinish", back: "Orqaga", qarzOluvchi: "Qarz oluvchi", qarzBeruvchi: "Qarz beruvchi", mahsulot: "Mahsulot / xizmat", recommendation: "Tavsiya", relOntime: "o'z vaqtida", rel_none: "Hozircha ma'lumot yo'q", rel_none_desc: "Bu mijoz bilan avvalgi qarz tarixi mavjud emas.", rel_reliable: "Ishonchli", rel_reliable_desc: "Oldingi qarzlarini asosan o'z vaqtida qaytargan.", rel_medium: "O'rtacha", rel_medium_desc: "Qarzlarini ba'zan kechiktirib qaytargan.", rel_risky: "Ehtiyot bo'ling", rel_risky_desc: "Qarzlarini ko'pincha kechiktirib qaytargan." },
        ru: { title: "Детали долга", history: "История операций", receipt: "Квитанция", totalDebt: "Общий долг", remaining: "Остаток", date: "Дата выдачи", dateOlish: "Дата получения", returnDate: "Дата возврата", installment: "Рассрочка", month: "мес", installmentTable: "График рассрочки", actions: "Действия", demand: "Потребовать возврат", sending: "Отправка...", closeDebt: "Закрыть долг", forgive: "Простить долг", repay: "Вернуть долг", active: "Активный", closed: "Закрыт", forgiven: "Прощён", loading: "Загрузка...", errorTitle: "Не удалось загрузить данные", errorDesc: "Долг не найден или нет связи с сервером. Попробуйте ещё раз.", retry: "Повторить", back: "Назад", qarzOluvchi: "Должник", qarzBeruvchi: "Кредитор", mahsulot: "Товар / услуга", recommendation: "Рекомендация", relOntime: "вовремя", rel_none: "Пока нет данных", rel_none_desc: "С этим клиентом нет предыдущей истории долгов.", rel_reliable: "Надёжный", rel_reliable_desc: "Предыдущие долги в основном возвращал вовремя.", rel_medium: "Средний", rel_medium_desc: "Иногда возвращал долги с опозданием.", rel_risky: "Будьте осторожны", rel_risky_desc: "Часто возвращал долги с опозданием." },
        kr: { title: "Қарз тафсилоти", history: "Амалиётлар тарихи", receipt: "Квитансия", totalDebt: "Жами қарз", remaining: "Қолдиқ", date: "Берилган сана", dateOlish: "Олинган сана", returnDate: "Қайтариш санаси", installment: "Бўлиб тўлаш", month: "ой", installmentTable: "Бўлиб тўлаш жадвали", actions: "Амаллар", demand: "Қайтаришни талаб қилиш", sending: "Юборилмоқда...", closeDebt: "Қарзни ёпиш", forgive: "Қарздан воз кечиш", repay: "Қарзни қайтариш", active: "Актив", closed: "Ёпилган", forgiven: "Воз кечилган", loading: "Юкланмоқда...", errorTitle: "Маълумотни юклаб бўлмади", errorDesc: "Қарз маълумоти мавжуд эмас ёки сервер билан алоқа ўрнатилмади. Қайта уриниб кўринг.", retry: "Қайта уриниш", back: "Орқага", qarzOluvchi: "Қарз олувчи", qarzBeruvchi: "Қарз берувчи", mahsulot: "Маҳсулот / хизмат", recommendation: "Тавсия", relOntime: "ўз вақтида", rel_none: "Ҳозирча маълумот йўқ", rel_none_desc: "Бу мижоз билан аввалги қарз тарихи мавжуд эмас.", rel_reliable: "Ишончли", rel_reliable_desc: "Олдинги қарзларини асосан ўз вақтида қайтарган.", rel_medium: "Ўртача", rel_medium_desc: "Қарзларини баъзан кечиктириб қайтарган.", rel_risky: "Эҳтиёт бўлинг", rel_risky_desc: "Қарзларини кўпинча кечиктириб қайтарган." },
      };
      return t[l] || t.uz;
    },
    // SS8b: Tavsiya uslubi + matni (ishonchlilik darajasiga qarab)
    relClass() {
      const m = {
        none:     { box: 'bg-gray-50',  icon: 'bg-gray-100',  iconText: 'text-gray-400',  title: 'text-gray-700',  path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        reliable: { box: 'bg-green-50', icon: 'bg-green-100', iconText: 'text-green-600', title: 'text-green-700', path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        medium:   { box: 'bg-amber-50', icon: 'bg-amber-100', iconText: 'text-amber-600', title: 'text-amber-700', path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        risky:    { box: 'bg-red-50',   icon: 'bg-red-100',   iconText: 'text-red-600',   title: 'text-red-700',   path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
      };
      return m[this.reliability.level] || m.none;
    },
    relTitle() { return this.texts['rel_' + this.reliability.level]; },
    relDesc() { return this.texts['rel_' + this.reliability.level + '_desc']; },
  },
  async mounted() {
    await this.loadQarz();
    // SS-DEV (2026-09-24): bu sahifa dizayndan OLIB TASHLANDI — har qanday eski
    // havola/bookmark mijoz sahifasiga (Qarz oluvchi / Qarz beruvchi) yo'naltiriladi.
    if (this.qarz) this.goBack();
  },
  methods: {
    formatMoney, // SS-AUDIT (2026-09-25): utils/helpers
    formatDate(d) { return fmtDMY(d) }, // SS-AUDIT (2026-09-25): utils/helpers (Safari-xavfsiz parse)
    goBack() {
      // Bitta qarz sahifasidan orqaga — MIJOZ sahifasiga (yangi "Qarz tafsiloti"
      // markazi). Ro'yxatdan endi mijoz ustiga bosilganda mijoz sahifasi ochiladi,
      // shu bois orqaga ham o'sha yerga qaytamiz (oqim bir xil bo'lishi uchun).
      // Browser history'ga ishonmaymiz: kvitansiya/yopish/voz-kechish sahifalaridan
      // qaytib kelganda $router.back() loop yaratishi mumkin. $router.replace —
      // forward stack'dan keraksiz sahifalar olib tashlanadi.
      const turi = this.qarz?.turi;
      const mijozId = this.qarz?.mijoz_id || this.qarz?.mijoz?.id;
      if (mijozId) {
        this.$router.replace(
          this.localePath({ name: 'qarz-daftari-mijoz-id', params: { id: mijozId } })
          + (turi ? `?turi=${turi}` : ''),
        );
      } else if (turi) {
        this.$router.replace(this.localePath({ name: 'qarz-daftari-qarzlar' }) + `?turi=${turi}`);
      } else {
        this.$router.replace(this.localePath({ name: 'qarz-daftari' }));
      }
    },
    async loadQarz() {
      this.loading = true;
      this.loadError = false;
      try {
        const res = await this.$axios.$get(`/qarz-daftari/qarz/${this.$route.params.id}`, { silent: true });
        if (res?.success && res.data) {
          this.qarz = res.data;
          if (res.reliability) this.reliability = res.reliability;
        } else {
          this.loadError = true;
        }
      } catch (e) {
        this.loadError = true;
      } finally {
        this.loading = false;
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
        // SS16 (2026-09-21): `silent` SHART — aks holda global axios interceptor (plugins/axios.js)
        // server `message` ini ko'rsatadi va quyidagi catch AYNI xabarni QAYTA ko'rsatadi.
        await this.$axios.$post(`/qarz-daftari/qarz/${this.qarz.id}/talab`, {}, { silent: true });
        this.$toast?.success("Talab yuborildi");
      } catch (e) {
        const code = e.response?.data?.code;
        const msg = e.response?.data?.message;
        const requiredPlan = e.response?.data?.required_plan;
        const status = e.response?.status;
        // SMS paketi tugagan YOKI pulli tarif kerak (Free → talab qila olmaydi)
        if (code === 'no-sms-package' || code === 'sms-failed' || (status === 403 && requiredPlan)) {
          this.$toast?.error(msg || "Tariflar bo'limidan paket/tarif sotib oling.");
          this.$router.push(this.localePath({ name: 'price' }));
        } else {
          this.$toast?.error(msg || 'Xatolik yuz berdi');
        }
      } finally {
        this.talabLoading = false;
      }
    },
    // SS-DEV (2026-09-24): "To'lovni kiritish" oynasidan summa keladi (sharshara backendda).
    async onTolandi(tolovId, summa) {
      try {
        const body = Number(summa) > 0 ? { summa: Number(summa) } : {};
        await this.$axios.put(`/qarz-daftari/tolov/${tolovId}/tolandi`, body);
        this.$toast?.success("To'lov belgilandi");
        await this.loadQarz();
      } catch (_) { this.$toast?.error('Xatolik'); }
    },
  },
};
</script>
