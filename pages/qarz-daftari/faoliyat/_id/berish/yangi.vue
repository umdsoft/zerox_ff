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
        <!-- Mijoz kartasi -->
        <div :class="['rounded-xl p-4 flex items-center gap-4 border', turi === 'berish' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200']">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm', turi === 'berish' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600']">
            {{ mijozNomi?.charAt(0)?.toUpperCase() || '?' }}
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500 uppercase tracking-wide">{{ texts.mijoz }}</p>
            <p class="font-semibold text-gray-900 text-lg">{{ mijozNomi || '—' }}</p>
          </div>
          <div :class="['px-3 py-1.5 rounded-lg text-xs font-semibold', turi === 'berish' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700']">
            {{ turi === 'berish' ? texts.typeBerish : texts.typeOlish }}
          </div>
        </div>

        <!-- Forma -->
        <div class="bg-white rounded-xl shadow-sm p-6 lg:p-8">
          <h3 class="text-base font-semibold text-gray-900 mb-6">{{ texts.formTitle }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <!-- Valyuta -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.valyuta }}</label>
              <div class="flex gap-3">
                <label v-for="v in ['UZS','USD']" :key="v" class="flex-1 cursor-pointer">
                  <input type="radio" :value="v" v-model="form.valyuta" class="sr-only" />
                  <div :class="['text-center py-3 rounded-lg border-2 font-semibold text-sm transition-all', form.valyuta === v ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-400 hover:border-gray-300']">{{ v }}</div>
                </label>
              </div>
            </div>

            <!-- Qarz miqdori -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.miqdor }} <span class="text-red-400">*</span></label>
              <div class="relative">
                <input v-model.number="form.miqdor" type="number" min="1" :placeholder="texts.miqdorPlaceholder" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">{{ form.valyuta }}</span>
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
              <input v-model="form.berilgan_sana" type="date" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
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
              <div v-if="!form.bolib_tolash">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.qaytarishSanasi }} <span class="text-red-400">*</span></label>
                <input v-model="form.qaytarish_sanasi" type="date" :placeholder="texts.sanaPlaceholder" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
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
                  <div class="relative">
                    <input v-model.number="form.boshlangich_tolov" type="number" min="0" :placeholder="texts.ixtiyoriy" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16" />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">{{ form.valyuta }}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Saqlash -->
          <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <p class="text-xs text-gray-400"><span class="text-red-400">*</span> {{ texts.required }}</p>
            <button @click="submit" :disabled="saving" :class="['px-8 py-3 font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm inline-flex items-center', turi === 'berish' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white']">
              <svg v-if="!saving" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              {{ saving ? texts.saqlanyapti : texts.saqlash }}
            </button>
          </div>
        </div>
      </div>

      <!-- O'ng: Hisoblash paneli -->
      <div class="space-y-6">
        <!-- Qarz xulosasi -->
        <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
          <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-5">{{ texts.summary }}</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ texts.miqdor }}</span>
              <span class="text-lg font-bold text-gray-900">{{ formatMoney(form.miqdor || 0) }} <span class="text-sm font-normal text-gray-400">{{ form.valyuta }}</span></span>
            </div>
            <div v-if="form.bolib_tolash && form.boshlangich_tolov > 0" class="flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ texts.boshlangichTolov }}</span>
              <span class="text-sm font-semibold text-red-600">- {{ formatMoney(form.boshlangich_tolov) }} <span class="font-normal text-gray-400">{{ form.valyuta }}</span></span>
            </div>

            <div class="border-t border-gray-100 pt-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-semibold text-gray-700">{{ texts.qaytarishSanasi }}</span>
                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900">{{ qaytarishSanasiFormatted }}</p>
                </div>
              </div>
            </div>

            <div v-if="form.bolib_tolash && form.oylar_soni > 0" class="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p class="text-xs text-blue-600 font-medium mb-1">{{ texts.oylikTolov }}</p>
              <p class="text-lg font-bold text-blue-700">{{ formatMoney(oylikTolov) }} <span class="text-sm font-normal text-blue-500">{{ form.valyuta }} / {{ texts.oy }}</span></p>
              <p class="text-xs text-blue-400 mt-1">{{ form.oylar_soni }} {{ texts.oy }} {{ texts.davomida }}</p>
            </div>
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
    qoldiq() {
      const m = this.form.miqdor || 0;
      const b = this.form.bolib_tolash ? (this.form.boshlangich_tolov || 0) : 0;
      return Math.max(0, m - b);
    },
    oylikTolov() {
      if (!this.form.oylar_soni || this.form.oylar_soni < 1) return 0;
      return Math.ceil(this.qoldiq / this.form.oylar_soni);
    },
    qaytarishSanasiFormatted() {
      const sana = this.form.bolib_tolash ? this.bolibTolashOxirgiSana : this.form.qaytarish_sanasi;
      if (!sana) return '—';
      const parts = sana.split('-');
      if (parts.length !== 3) return sana;
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    },
    bolibTolashOxirgiSana() {
      if (!this.form.berilgan_sana || !this.form.oylar_soni) return '';
      const d = new Date(this.form.berilgan_sana);
      d.setMonth(d.getMonth() + (this.form.oylar_soni || 0));
      return d.toISOString().split('T')[0];
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { titleBerish: "Qarzga berish", titleOlish: "Qarzga olish", subtitle: "Qarz ma'lumotlarini kiriting", back: "Mijozlar", mijoz: "Mijoz", typeBerish: "Berish", typeOlish: "Olish", formTitle: "Qarz ma'lumotlari", valyuta: "Valyuta", miqdor: "Qarz miqdori", miqdorPlaceholder: "Summa kiriting", mahsulot: "Mahsulot nomi (ixtiyoriy)", mahsulotPlaceholder: "Masalan: Shifer va taxta", berilganSana: "Qarz berilgan sana", bolibTolash: "Bo'lib to'lash", bolibTolashDesc: "Qarzni oyma-oy to'lash rejimini yoqish", qaytarishSanasi: "Qarzni qaytarish sanasi", sanaPlaceholder: "kk.oo.yyyy", oylarsoni: "Necha oyda qaytariladi?", boshlangichTolov: "Boshlang'ich to'lov", ixtiyoriy: "0 (ixtiyoriy)", saqlash: "Qarzni saqlash", saqlanyapti: "Saqlanmoqda...", required: "Majburiy maydonlar", summary: "Hisob-kitob", qoldiq: "Qoldiq qarz", oylikTolov: "Oylik to'lov", oy: "oy", davomida: "davomida" },
        ru: { titleBerish: "Дать в долг", titleOlish: "Взять в долг", subtitle: "Введите данные долга", back: "Клиенты", mijoz: "Клиент", typeBerish: "Выдача", typeOlish: "Получение", formTitle: "Данные долга", valyuta: "Валюта", miqdor: "Сумма долга", miqdorPlaceholder: "Введите сумму", mahsulot: "Название товара (необязательно)", mahsulotPlaceholder: "Например: Шифер и доски", berilganSana: "Дата выдачи", bolibTolash: "В рассрочку", bolibTolashDesc: "Включить помесячный режим оплаты", qaytarishSanasi: "Дата возврата", sanaPlaceholder: "дд.мм.гггг", oylarsoni: "На сколько месяцев?", boshlangichTolov: "Первоначальный взнос", ixtiyoriy: "0 (необязательно)", saqlash: "Сохранить долг", saqlanyapti: "Сохранение...", required: "Обязательные поля", summary: "Расчёт", qoldiq: "Остаток долга", oylikTolov: "Ежемесячный платёж", oy: "мес", davomida: "в течение" },
        kr: { titleBerish: "Қарзга бериш", titleOlish: "Қарзга олиш", subtitle: "Қарз маълумотларини киритинг", back: "Мижозлар", mijoz: "Мижоз", typeBerish: "Бериш", typeOlish: "Олиш", formTitle: "Қарз маълумотлари", valyuta: "Валюта", miqdor: "Қарз миқдори", miqdorPlaceholder: "Сумма киритинг", mahsulot: "Маҳсулот номи (ихтиёрий)", mahsulotPlaceholder: "Масалан: Шифер ва тахта", berilganSana: "Қарз берилган сана", bolibTolash: "Бўлиб тўлаш", bolibTolashDesc: "Қарзни ойма-ой тўлаш режимини ёқиш", qaytarishSanasi: "Қарзни қайтариш санаси", sanaPlaceholder: "кк.оо.йййй", oylarsoni: "Неча ойда қайтарилади?", boshlangichTolov: "Бошланғич тўлов", ixtiyoriy: "0 (ихтиёрий)", saqlash: "Қарзни сақлаш", saqlanyapti: "Сақланмоқда...", required: "Мажбурий майдонлар", summary: "Ҳисоб-китоб", qoldiq: "Қолдиқ қарз", oylikTolov: "Ойлик тўлов", oy: "ой", davomida: "давомида" },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() {
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
    formatMoney(n) { return n ? Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    async submit() {
      if (!this.form.miqdor || this.form.miqdor <= 0) return this.$toast?.error('Miqdorni kiriting');
      if (!this.form.bolib_tolash && !this.form.qaytarish_sanasi) return this.$toast?.error('Qaytarish sanasini kiriting');
      if (this.form.bolib_tolash && (!this.form.oylar_soni || this.form.oylar_soni < 1)) return this.$toast?.error("Oylar sonini kiriting");
      if (this.form.boshlangich_tolov >= this.form.miqdor) return this.$toast?.error("Boshlang'ich to'lov miqdordan kam bo'lishi kerak");

      this.saving = true;
      try {
        const res = await this.$axios.post('/qarz-daftari/qarz', {
          savdo_faoliyat_id: parseInt(this.faoliyatId),
          mijoz_id: parseInt(this.mijozId),
          turi: this.turi,
          ...this.form,
        });
        if (res.data.success) {
          this.$toast?.success('Qarz saqlandi');
          const qarzId = res.data.data?.id;
          if (qarzId) {
            this.$router.push(this.localePath({ name: 'qarz-daftari-qarz-id', params: { id: qarzId } }));
          } else {
            this.$router.push(this.localePath({ name: 'qarz-daftari-faoliyat-id-berish', params: { id: this.faoliyatId } }));
          }
        }
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik');
      } finally { this.saving = false; }
    },
  },
};
</script>
