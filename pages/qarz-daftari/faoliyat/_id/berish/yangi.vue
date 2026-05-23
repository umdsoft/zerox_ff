<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ turi === 'berish' ? texts.titleBerish : texts.titleOlish }}</h1>
        <p class="text-gray-500 mt-1">{{ texts.subtitle }}</p>
      </div>
      <nuxt-link :to="localePath({ name: turi === 'berish' ? 'qarz-daftari-faoliyat-id-berish' : 'qarz-daftari-faoliyat-id-olish', params: { id: faoliyatId } })" class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm text-sm mt-3 md:mt-0">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        {{ texts.back }}
      </nuxt-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chap: Forma -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Savdo faoliyati (do'kon) tanlash -->
        <div class="bg-white rounded-xl shadow-sm p-5">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.savdoFaoliyatLabel }} <span class="text-red-400">*</span></label>
          <div class="relative">
            <select
              v-model="selectedFaoliyatId"
              class="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option v-if="!faoliyatlar.length" :value="faoliyatId">{{ texts.savdoFaoliyatLoading }}</option>
              <option v-for="f in faoliyatlar" :key="f.id" :value="f.id">{{ f.nomi }}</option>
            </select>
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </div>
          <p class="text-xs text-gray-400 mt-1.5">{{ texts.savdoFaoliyatHint }}</p>
        </div>

        <!-- Mijoz kartasi -->
        <div :class="['rounded-xl p-4 flex items-center gap-4 border', turi === 'berish' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200']">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm', turi === 'berish' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600']">
            {{ mijozNomi ? mijozNomi.charAt(0).toUpperCase() : '?' }}
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500">{{ texts.mijoz }}</p>
            <p class="font-semibold text-gray-900 text-lg">{{ mijozNomi || '—' }}</p>
          </div>
          <div :class="['px-3 py-1.5 rounded-lg text-xs font-semibold', turi === 'berish' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700']">
            {{ turi === 'berish' ? texts.typeBerish : texts.typeOlish }}
          </div>
        </div>

        <!-- Qarz ma'lumotlari -->
        <div class="bg-white rounded-xl shadow-sm p-6 lg:p-8">
          <h3 class="text-base font-semibold text-gray-900 mb-6">{{ texts.formTitle }}</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <!-- Valyuta — alohida katta card sifatida (UZS so'm / USD dollar) -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.valyutaLabel }} <span class="text-red-400">*</span></label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="form.valyuta = 'UZS'"
                  :class="['flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all', form.valyuta === 'UZS' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300']"
                >
                  <span :class="['inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm', form.valyuta === 'UZS' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500']">so'm</span>
                  <div class="text-left">
                    <p :class="['text-base font-bold', form.valyuta === 'UZS' ? 'text-blue-700' : 'text-gray-700']">UZS</p>
                    <p class="text-xs text-gray-500">{{ texts.uzsName }}</p>
                  </div>
                </button>
                <button
                  type="button"
                  @click="form.valyuta = 'USD'"
                  :class="['flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all', form.valyuta === 'USD' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300']"
                >
                  <span :class="['inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-base', form.valyuta === 'USD' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500']">$</span>
                  <div class="text-left">
                    <p :class="['text-base font-bold', form.valyuta === 'USD' ? 'text-blue-700' : 'text-gray-700']">USD</p>
                    <p class="text-xs text-gray-500">{{ texts.usdName }}</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Qarz miqdori (faqat raqam input — valyuta yuqorida tanlangan) -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.miqdor }} <span class="text-red-400">*</span></label>
              <div class="flex items-stretch border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                <input
                  :value="miqdorFormatted"
                  @input="onMiqdorInput"
                  type="text"
                  inputmode="numeric"
                  :placeholder="texts.miqdorPlaceholder"
                  class="flex-1 border-0 outline-none px-4 py-3 text-sm"
                />
                <div class="px-4 flex items-center bg-gray-50 text-sm font-semibold text-gray-700 border-l border-gray-200">{{ form.valyuta }}</div>
              </div>
            </div>

            <!-- Mahsulot nomi -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.mahsulot }}</label>
              <input v-model="form.mahsulot_nomi" type="text" :placeholder="texts.mahsulotPlaceholder" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <!-- Qarz berilgan sana -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.berilganSana }} <span class="text-red-400">*</span></label>
              <date-picker
                v-model="form.berilgan_sana"
                value-type="YYYY-MM-DD"
                format="DD.MM.YYYY"
                :placeholder="texts.datePlaceholder"
                :disabled-date="disabledFutureDates"
                :lang="dpLang"
                input-class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                class="qd-datepicker w-full"
              />
            </div>
          </div>

          <!-- Bo'lib to'lash toggle -->
          <div class="mt-6 pt-6 border-t border-gray-100">
            <div class="flex items-center justify-between mb-5">
              <div>
                <p class="text-sm font-medium text-gray-700">{{ texts.bolibTolash }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ texts.bolibTolashDesc }}</p>
              </div>
              <button type="button" @click="form.bolib_tolash = !form.bolib_tolash" :class="['relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors duration-200', form.bolib_tolash ? 'bg-blue-600' : 'bg-gray-200']">
                <span :class="['inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200', form.bolib_tolash ? 'translate-x-5' : 'translate-x-0']"></span>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <!-- Bo'lib to'lash bo'lmasa — qaytarish sanasi -->
              <div v-if="!form.bolib_tolash" class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.qaytarishSanasi }} <span class="text-red-400">*</span></label>
                <date-picker
                  v-model="form.qaytarish_sanasi"
                  value-type="YYYY-MM-DD"
                  format="DD.MM.YYYY"
                  :placeholder="texts.datePlaceholder"
                  :disabled-date="disabledPastDates"
                  :lang="dpLang"
                  input-class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  class="qd-datepicker w-full"
                />
              </div>

              <!-- Bo'lib to'lash bo'lsa -->
              <template v-if="form.bolib_tolash">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.oylarsoni }} <span class="text-red-400">*</span></label>
                  <div class="relative">
                    <input v-model.number="form.oylar_soni" type="number" min="1" max="60" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12" />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">{{ texts.oy }}</span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.boshlangichTolov }}</label>
                  <div class="flex items-stretch border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                    <input
                      :value="boshlangichTolovFormatted"
                      @input="onBoshlangichInput"
                      type="text"
                      inputmode="numeric"
                      :placeholder="texts.ixtiyoriy"
                      class="flex-1 border-0 outline-none px-4 py-3 text-sm"
                    />
                    <div class="px-4 flex items-center bg-gray-50 text-xs font-medium text-gray-400 border-l border-gray-200">{{ form.valyuta }}</div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Saqlash -->
          <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <p class="text-xs text-gray-400"><span class="text-red-400">*</span> {{ texts.required }}</p>
            <button @click="submit" :disabled="saving" :class="['px-8 py-3 font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm inline-flex items-center', turi === 'berish' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white']">
              <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              {{ saving ? texts.saqlanyapti : texts.saqlash }}
            </button>
          </div>
        </div>
      </div>

      <!-- O'ng: Hisob-kitob paneli -->
      <div>
        <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
          <h3 class="text-sm font-semibold text-gray-900 mb-4">{{ texts.summary }}</h3>
          <div class="space-y-3">
            <!-- Qarz miqdori -->
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">{{ texts.miqdor }}</span>
              <span class="font-semibold text-gray-900">{{ formatMoney(form.miqdor || 0) }} {{ form.valyuta }}</span>
            </div>

            <!-- Qarzni qaytarish sanasi (Qoldiq o'rniga) -->
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">{{ texts.qaytarishSanasi }}</span>
              <span class="font-semibold text-gray-900">
                {{ form.bolib_tolash ? lastInstallmentDate : (form.qaytarish_sanasi ? formatDateDisplay(form.qaytarish_sanasi) : '—') }}
              </span>
            </div>

            <!-- Bo'lib to'lash bo'lsa qo'shimcha -->
            <template v-if="form.bolib_tolash">
              <div v-if="form.boshlangich_tolov > 0" class="border-t border-gray-100 pt-3 flex justify-between text-sm">
                <span class="text-gray-500">{{ texts.boshlangichTolov }}</span>
                <span class="font-semibold text-gray-900">{{ formatMoney(form.boshlangich_tolov) }} {{ form.valyuta }}</span>
              </div>
              <div class="border-t border-gray-100 pt-3 flex justify-between text-sm">
                <span class="text-gray-500">{{ texts.oylikTolov }}</span>
                <span class="font-semibold text-blue-600">{{ formatMoney(oylikTolov) }} {{ form.valyuta }}</span>
              </div>
              <div class="flex justify-between text-xs text-gray-400">
                <span>{{ texts.oylarsoni }}</span>
                <span>{{ form.oylar_soni || 0 }} {{ texts.oy }}</span>
              </div>
            </template>
          </div>
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
      mijozNomi: '',
      saving: false,
      faoliyatlar: [],
      selectedFaoliyatId: null,
      form: {
        valyuta: 'UZS',
        miqdor: null,
        mahsulot_nomi: '',
        berilgan_sana: new Date().toISOString().split('T')[0],
        bolib_tolash: false,
        qaytarish_sanasi: '',
        oylar_soni: 6,
        boshlangich_tolov: 0,
      },
    };
  },
  computed: {
    turi() { return this.$route.path.includes('/berish') ? 'berish' : 'olish'; },
    faoliyatId() { return this.$route.params.id; },
    mijozId() { return this.$route.query.mijoz_id; },
    miqdorFormatted() {
      return this.form.miqdor ? this.formatMoney(this.form.miqdor) : '';
    },
    boshlangichTolovFormatted() {
      return this.form.boshlangich_tolov ? this.formatMoney(this.form.boshlangich_tolov) : '';
    },
    qoldiq() {
      const m = this.form.miqdor || 0;
      const b = this.form.bolib_tolash ? (this.form.boshlangich_tolov || 0) : 0;
      return Math.max(0, m - b);
    },
    oylikTolov() {
      if (!this.form.oylar_soni || this.form.oylar_soni < 1) return 0;
      return Math.ceil(this.qoldiq / this.form.oylar_soni);
    },
    lastInstallmentDate() {
      if (!this.form.berilgan_sana || !this.form.oylar_soni) return '—';
      const d = new Date(this.form.berilgan_sana);
      d.setMonth(d.getMonth() + this.form.oylar_soni);
      return this.formatDateDisplay(d.toISOString().split('T')[0]);
    },
    todayIso() {
      return new Date().toISOString().split('T')[0];
    },
    /**
     * vue2-datepicker uchun ro'yxatdan o'tgan locale ID.
     * Plugin'da 'uz-Latn', 'uz-Cyrl', 'ru' lokallar ro'yxatdan o'tkazilgan.
     */
    dpLang() {
      const l = this.$i18n?.locale || 'uz';
      if (l === 'ru') return 'ru';
      if (l === 'kr') return 'uz-Cyrl';
      return 'uz-Latn';
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { titleBerish: "Qarzga berish", titleOlish: "Qarzga olish", subtitle: "Qarz ma'lumotlarini kiriting", back: "Mijozlar", mijoz: "Mijoz", typeBerish: "Berish", typeOlish: "Olish", formTitle: "Qarz ma'lumotlari", miqdor: "Qarz miqdori", miqdorPlaceholder: "Summani kiriting", mahsulot: "Mahsulot nomi (ixtiyoriy)", mahsulotPlaceholder: "Masalan: Shifer va taxta", berilganSana: "Qarz berilgan sana", bolibTolash: "Bo'lib to'lash", bolibTolashDesc: "Qarzni oyma-oy to'lash rejimini yoqish", qaytarishSanasi: "Qarzni qaytarish sanasi", dateHint: "Format: kk.oo.yyyy", datePlaceholder: "kk.oo.yyyy", oylarsoni: "Necha oyda qaytariladi?", boshlangichTolov: "Boshlang'ich to'lov", ixtiyoriy: "0 (ixtiyoriy)", saqlash: "Qarzni saqlash", saqlanyapti: "Saqlanmoqda...", summary: "Hisob-kitob", oylikTolov: "Oylik to'lov", oy: "oy", required: "Majburiy maydonlar", savdoFaoliyatLabel: "Savdo faoliyati (do'kon)ni tanlang", savdoFaoliyatLoading: "Yuklanmoqda...", savdoFaoliyatHint: "Qarz qaysi do'kon (savdo faoliyati) ostida ro'yxatga olinadi", valyutaLabel: "Valyuta", uzsName: "O'zbek so'mi", usdName: "AQSh dollari" },
        ru: { titleBerish: "Дать в долг", titleOlish: "Взять в долг", subtitle: "Введите данные долга", back: "Клиенты", mijoz: "Клиент", typeBerish: "Выдано", typeOlish: "Получено", formTitle: "Данные долга", miqdor: "Сумма долга", miqdorPlaceholder: "Введите сумму", mahsulot: "Название товара (необязательно)", mahsulotPlaceholder: "Например: Шифер и доски", berilganSana: "Дата выдачи", bolibTolash: "В рассрочку", bolibTolashDesc: "Включить ежемесячное погашение долга", qaytarishSanasi: "Дата возврата", dateHint: "Формат: дд.мм.гггг", datePlaceholder: "дд.мм.гггг", oylarsoni: "На сколько месяцев?", boshlangichTolov: "Первоначальный взнос", ixtiyoriy: "0 (необязательно)", saqlash: "Сохранить долг", saqlanyapti: "Сохранение...", summary: "Расчёт", oylikTolov: "Ежемесячный платёж", oy: "мес", required: "Обязательные поля", savdoFaoliyatLabel: "Выберите торговую деятельность (магазин)", savdoFaoliyatLoading: "Загрузка...", savdoFaoliyatHint: "Под каким магазином (торговой деятельностью) регистрируется долг", valyutaLabel: "Валюта", uzsName: "Узбекский сум", usdName: "Доллар США" },
        kr: { titleBerish: "Қарзга бериш", titleOlish: "Қарзга олиш", subtitle: "Қарз маълумотларини киритинг", back: "Мижозлар", mijoz: "Мижоз", typeBerish: "Бериш", typeOlish: "Олиш", formTitle: "Қарз маълумотлари", miqdor: "Қарз миқдори", miqdorPlaceholder: "Сумма киритинг", mahsulot: "Маҳсулот номи (ихтиёрий)", mahsulotPlaceholder: "Масалан: Шифер ва тахта", berilganSana: "Қарз берилган сана", bolibTolash: "Бўлиб тўлаш", bolibTolashDesc: "Қарзни ойма-ой тўлаш режимини ёқиш", qaytarishSanasi: "Қарзни қайтариш санаси", dateHint: "Формат: кк.оо.йййй", datePlaceholder: "кк.оо.йййй", oylarsoni: "Неча ойда қайтарилади?", boshlangichTolov: "Бошланғич тўлов", ixtiyoriy: "0 (ихтиёрий)", saqlash: "Қарзни сақлаш", saqlanyapti: "Сақланмоқда...", summary: "Ҳисоб-китоб", oylikTolov: "Ойлик тўлов", oy: "ой", required: "Мажбурий майдонлар", savdoFaoliyatLabel: "Савдо фаолияти (дўкон)ни танланг", savdoFaoliyatLoading: "Юкланмоқда...", savdoFaoliyatHint: "Қарз қайси дўкон (савдо фаолияти) остида рўйхатга олинади", valyutaLabel: "Валюта", uzsName: "Ўзбек сўми", usdName: "АҚШ доллари" },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() {
    // Default selected faoliyat = URL :id
    this.selectedFaoliyatId = parseInt(this.faoliyatId) || null;

    // User'ning barcha savdo faoliyatlarini yuklash (dropdown uchun)
    try {
      const res = await this.$axios.$get('/qarz-daftari/savdo-faoliyat', { silent: true });
      if (res?.success && Array.isArray(res.data)) {
        this.faoliyatlar = res.data;
      }
    } catch (_) {}

    // Mijoz nomini yuklash
    if (this.mijozId) {
      try {
        const res = await this.$axios.$get(`/qarz-daftari/savdo-faoliyat/${this.faoliyatId}/mijozlar`, { silent: true });
        if (res?.success) {
          const m = res.data.find(x => x.id == this.mijozId);
          if (m) this.mijozNomi = m.fish;
        }
      } catch (_) {}
    }
  },
  methods: {
    formatMoney(n) {
      if (!n) return '0';
      return Math.round(Number(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    formatDateDisplay(isoDate) {
      if (!isoDate) return '—';
      const [y, m, d] = isoDate.split('-');
      if (!y || !m || !d) return isoDate;
      return `${d}.${m}.${y}`;
    },
    disabledFutureDates(date) {
      // Berilgan sana — kelajakdagi kunlarni o'chirish
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return date > today;
    },
    disabledPastDates(date) {
      // Qaytarish sanasi — bugundan oldingi kunlarni o'chirish
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    onMiqdorInput(e) {
      const raw = (e.target.value || '').replace(/\s+/g, '').replace(/\D/g, '');
      this.form.miqdor = raw ? Number(raw) : null;
    },
    onBoshlangichInput(e) {
      const raw = (e.target.value || '').replace(/\s+/g, '').replace(/\D/g, '');
      this.form.boshlangich_tolov = raw ? Number(raw) : 0;
    },
    async submit() {
      // Client-side validation (backend'gacha tushmasdan oldin)
      if (!this.selectedFaoliyatId) return this.$toast?.error('Savdo faoliyatini tanlang');
      if (!this.form.miqdor || this.form.miqdor <= 0) return this.$toast?.error('Miqdorni kiriting');
      if (!this.form.berilgan_sana) return this.$toast?.error('Qarz berilgan sanani kiriting');
      // Kelajak sana check (frontend) — backend ham tekshiradi, lekin biz oldin to'xtatamiz
      if (this.form.berilgan_sana > this.todayIso) {
        return this.$toast?.error("Qarz berilgan sana kelajakda bo'lishi mumkin emas");
      }
      if (!this.form.bolib_tolash && !this.form.qaytarish_sanasi) return this.$toast?.error('Qaytarish sanasini kiriting');
      if (!this.form.bolib_tolash && this.form.qaytarish_sanasi <= this.form.berilgan_sana) {
        return this.$toast?.error("Qaytarish sanasi qarz berilgan sanadan keyin bo'lishi kerak");
      }
      if (this.form.bolib_tolash && (!this.form.oylar_soni || this.form.oylar_soni < 1)) return this.$toast?.error("Oylar sonini kiriting");
      if (this.form.boshlangich_tolov && this.form.boshlangich_tolov >= this.form.miqdor) return this.$toast?.error("Boshlang'ich to'lov miqdordan kam bo'lishi kerak");

      this.saving = true;
      try {
        // silent: true — global axios toast emas, faqat bizniki ko'rinadi (single toast)
        const res = await this.$axios.post('/qarz-daftari/qarz', {
          savdo_faoliyat_id: parseInt(this.selectedFaoliyatId),
          mijoz_id: parseInt(this.mijozId),
          turi: this.turi,
          ...this.form,
        }, { silent: true });
        if (res?.data?.success && res.data.data?.id) {
          this.$toast?.success('Qarz saqlandi');
          this.$router.push(this.localePath({ name: 'qarz-daftari-qarz-id', params: { id: res.data.data.id } }));
        } else {
          this.$toast?.error(res?.data?.message || 'Xatolik');
        }
      } catch (e) {
        const code = e.response?.data?.code;
        const msg = e.response?.data?.message;
        if (code === 'no-sms-package') {
          // SMS paketi tugagan — userni tariflar sahifasiga yo'naltirib eslatma
          this.$toast?.error(msg || "SMS paketingiz tugagan. Tariflar bo'limidan paket sotib oling.");
          this.$router.push(this.localePath({ name: 'price' }));
        } else {
          this.$toast?.error(msg || 'Xatolik');
        }
      } finally { this.saving = false; }
    },
  },
};
</script>

<style scoped>
/* vue2-datepicker stilini saytdagi inputlar bilan moslashtirish */
.qd-datepicker {
  width: 100%;
}
.qd-datepicker :deep(.mx-input-wrapper) {
  width: 100%;
}
.qd-datepicker :deep(.mx-input) {
  height: auto;
  line-height: 1.5;
  padding: 0.75rem 2.25rem 0.75rem 1rem;
  font-size: 0.875rem;
  color: #111827;
  border-radius: 0.5rem;
  box-shadow: none;
}
.qd-datepicker :deep(.mx-input::placeholder) {
  color: #9CA3AF;
}
.qd-datepicker :deep(.mx-icon-calendar),
.qd-datepicker :deep(.mx-icon-clear) {
  color: #6B7280;
}
</style>
