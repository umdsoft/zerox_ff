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
        <h2 class="text-xl font-bold text-gray-900 mb-2">{{ texts.errorTitle }}</h2>
        <button @click="goBack" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm">{{ texts.back }}</button>
      </div>
    </div>

    <div v-else-if="qarz">
      <!-- Header -->
      <div class="flex items-start gap-3 mb-6">
        <button @click="goBack" class="flex-shrink-0 mt-1 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
          <p class="text-gray-500 mt-1">{{ qarz.mijoz?.fish }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chap: Forma -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Mijoz info -->
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm bg-gradient-to-br from-blue-500 to-blue-600">
              {{ (qarz.mijoz?.fish || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900 text-lg">{{ qarz.mijoz?.fish }}</p>
              <p v-if="qarz.mijoz?.telefon" class="text-sm text-gray-500">{{ qarz.mijoz.telefon }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">{{ texts.jamiQarz }}</p>
              <p v-if="jamiQarz && jamiQarz.uzs" class="text-lg font-bold text-red-600">{{ formatMoney(jamiQarz.uzs) }} <span class="text-xs">UZS</span></p>
              <p v-if="jamiQarz && jamiQarz.usd" :class="jamiQarz.uzs ? 'text-sm' : 'text-lg'" class="font-bold text-red-600">{{ formatMoney(jamiQarz.usd) }} <span class="text-xs">USD</span></p>
              <p v-if="!jamiQarz" class="text-lg font-bold text-red-600">{{ formatMoney(qarz.qoldiq) }} {{ qarz.valyuta }}</p>
            </div>
          </div>

          <!-- Forma -->
          <div class="bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <h3 class="text-base font-semibold text-gray-900 mb-6">{{ texts.formTitle }}</h3>

            <div class="space-y-5">
              <!-- Valyuta tanlash (faqat ikki valyutali bo'lsa) -->
              <div v-if="hasMultipleValyuta">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.valyutaLabel }}</label>
                <div class="grid grid-cols-2 gap-2">
                  <button type="button" @click="form.valyuta = 'UZS'; form.summa = null" :class="['px-4 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors', selectedValyuta === 'UZS' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300']">
                    UZS <span class="text-xs font-normal">({{ formatMoney(jamiQarz.uzs) }})</span>
                  </button>
                  <button type="button" @click="form.valyuta = 'USD'; form.summa = null" :class="['px-4 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors', selectedValyuta === 'USD' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300']">
                    USD <span class="text-xs font-normal">({{ formatMoney(jamiQarz.usd) }})</span>
                  </button>
                </div>
              </div>

              <!-- Summa -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.summa }} <span class="text-red-400">*</span></label>
                <div class="flex items-stretch border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                  <input
                    :value="summaFormatted"
                    @input="onSummaInput"
                    type="text"
                    inputmode="numeric"
                    :placeholder="texts.summaPlaceholder"
                    class="flex-1 border-0 outline-none px-4 py-3 text-sm"
                  />
                  <div class="px-4 flex items-center bg-gray-50 text-xs font-medium text-gray-500 border-l border-gray-200">{{ selectedValyuta }}</div>
                </div>
                <p class="text-xs text-gray-400 mt-1">{{ texts.maxHint }} {{ formatMoney(currentQoldiq) }} {{ selectedValyuta }}</p>
              </div>

              <!-- Tezkor tugmalar -->
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-2">{{ texts.quickAmounts }}</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button type="button" @click="setQuickAmount(0.25)" class="px-3 py-2 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg text-xs font-medium text-gray-700 transition-colors">25%</button>
                  <button type="button" @click="setQuickAmount(0.5)" class="px-3 py-2 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg text-xs font-medium text-gray-700 transition-colors">50%</button>
                  <button type="button" @click="setQuickAmount(0.75)" class="px-3 py-2 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg text-xs font-medium text-gray-700 transition-colors">75%</button>
                  <button type="button" @click="setQuickAmount(1)" class="px-3 py-2 border border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors">{{ texts.allRemaining }}</button>
                </div>
              </div>
            </div>

            <!-- Tugmalar -->
            <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
              <button @click="goBack" type="button" class="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl font-medium text-sm transition-colors">{{ texts.cancel }}</button>
              <button @click="submit" :disabled="saving || !canSubmit" class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm inline-flex items-center">
                <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ saving ? texts.saving : texts.confirm }}
              </button>
            </div>
          </div>
        </div>

        <!-- O'ng: Hisob-kitob -->
        <div>
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">{{ texts.summary }}</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">{{ texts.currentRemaining }}</span>
                <span class="font-semibold text-gray-900">{{ formatMoney(currentQoldiq) }} {{ selectedValyuta }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">{{ texts.payAmount }}</span>
                <span class="font-semibold text-green-600">- {{ formatMoney(form.summa || 0) }} {{ selectedValyuta }}</span>
              </div>
              <div class="border-t border-gray-100 pt-3 flex justify-between text-sm">
                <span class="text-gray-500 font-medium">{{ texts.afterRemaining }}</span>
                <span class="font-bold" :class="newQoldiq <= 0 ? 'text-green-600' : 'text-gray-900'">{{ formatMoney(newQoldiq) }} {{ selectedValyuta }}</span>
              </div>
              <div v-if="newQoldiq <= 0 && (form.summa > 0)" class="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-xs font-semibold text-green-700">{{ texts.fullyClosed }}</p>
              </div>
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
  data() { return { qarz: null, jamiQarz: null, loading: true, loadError: false, saving: false, form: { summa: null, valyuta: null } }; },
  computed: {
    selectedValyuta() {
      return this.form.valyuta || this.qarz?.valyuta || 'UZS';
    },
    hasMultipleValyuta() {
      return this.jamiQarz && this.jamiQarz.uzs > 0 && this.jamiQarz.usd > 0;
    },
    currentQoldiq() {
      if (!this.jamiQarz) return parseFloat(this.qarz?.qoldiq) || 0;
      return this.selectedValyuta === 'USD' ? this.jamiQarz.usd : this.jamiQarz.uzs;
    },
    summaFormatted() {
      return this.form.summa ? this.formatMoney(this.form.summa) : '';
    },
    newQoldiq() {
      const s = Number(this.form.summa) || 0;
      return Math.max(0, this.currentQoldiq - s);
    },
    canSubmit() {
      const s = Number(this.form.summa) || 0;
      return s > 0 && s <= this.currentQoldiq;
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: "Qarzni yopish",
          back: "Orqaga",
          qoldiq: "Qoldiq",
          jamiQarz: "Jami qarz",
          valyutaLabel: "Valyutani tanlang",
          amountExceeds: "To'lov summasi qoldiq qarzdan oshib ketdi",
          formTitle: "To'lov ma'lumotlari",
          summa: "To'lov summasi",
          summaPlaceholder: "Summani kiriting",
          maxHint: "Maksimal:",
          quickAmounts: "Tezkor summa",
          allRemaining: "Hammasi",
          cancel: "Bekor qilish",
          confirm: "Tasdiqlash",
          saving: "Saqlanmoqda...",
          summary: "Hisob-kitob",
          currentRemaining: "Hozirgi qoldiq",
          payAmount: "To'lov",
          afterRemaining: "Yangi qoldiq",
          fullyClosed: "Qarz to'liq yopiladi",
          errorTitle: "Qarz topilmadi",
        },
        ru: {
          title: "Закрыть долг", back: "Назад", qoldiq: "Остаток", jamiQarz: "Общий долг", valyutaLabel: "Выберите валюту", amountExceeds: "Сумма платежа превышает остаток долга", formTitle: "Данные платежа",
          summa: "Сумма платежа", summaPlaceholder: "Введите сумму", maxHint: "Максимум:",
          quickAmounts: "Быстрая сумма", allRemaining: "Всё", cancel: "Отмена", confirm: "Подтвердить",
          saving: "Сохранение...", summary: "Расчёт", currentRemaining: "Текущий остаток",
          payAmount: "Платёж", afterRemaining: "Новый остаток",
          fullyClosed: "Долг будет полностью закрыт", errorTitle: "Долг не найден",
        },
        kr: {
          title: "Қарзни ёпиш", back: "Орқага", qoldiq: "Қолдиқ", jamiQarz: "Жами қарз", valyutaLabel: "Валютани танланг", amountExceeds: "Тўлов суммаси қолдиқ қарздан ошиб кетди", formTitle: "Тўлов маълумотлари",
          summa: "Тўлов суммаси", summaPlaceholder: "Сумма киритинг", maxHint: "Максимал:",
          quickAmounts: "Тезкор сумма", allRemaining: "Ҳаммаси", cancel: "Бекор қилиш", confirm: "Тасдиқлаш",
          saving: "Сақланмоқда...", summary: "Ҳисоб-китоб", currentRemaining: "Ҳозирги қолдиқ",
          payAmount: "Тўлов", afterRemaining: "Янги қолдиқ",
          fullyClosed: "Қарз тўлиқ ёпилади", errorTitle: "Қарз топилмади",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.loadQarz(); },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    onSummaInput(e) {
      const raw = (e.target.value || '').replace(/\s+/g, '').replace(/\D/g, '');
      this.form.summa = raw ? Number(raw) : null;
    },
    setQuickAmount(ratio) {
      this.form.summa = Math.round(this.currentQoldiq * ratio);
    },
    goBack() {
      // Deterministik parent — mijoz/_id (Qarz tafsiloti). Browser history'ga ishonmaymiz.
      const turi = this.qarz?.turi;
      const mijozId = this.qarz?.mijoz_id || this.qarz?.mijoz?.id;
      if (mijozId) {
        this.$router.push(this.localePath({ name: 'qarz-daftari-mijoz-id', params: { id: mijozId } }) + (turi ? `?turi=${turi}` : ''));
      } else {
        this.$router.push(this.localePath({ name: 'qarz-daftari' }));
      }
    },
    async loadQarz() {
      this.loading = true; this.loadError = false;
      try {
        const res = await this.$axios.$get(`/qarz-daftari/qarz/${this.$route.params.id}`, { silent: true });
        if (res?.success && res.data && res.data.status === 'aktiv') {
          this.qarz = res.data;
          await this.loadJamiQarz();
        } else {
          this.loadError = true;
        }
      } catch (_) { this.loadError = true; } finally { this.loading = false; }
    },
    async loadJamiQarz() {
      if (!this.qarz?.mijoz_id && !this.qarz?.mijoz?.id) return;
      const mijozId = this.qarz.mijoz_id || this.qarz.mijoz.id;
      try {
        const res = await this.$axios.$get(`/qarz-daftari/mijozlar/${mijozId}/history`, { silent: true });
        if (res?.success && res.data) {
          const qarzlar = res.data.qarzlar || [];
          const jami = { uzs: 0, usd: 0 };
          // FAQAT joriy qarz turi (berish/olish) bo'yicha qoldiq — qarz tafsiloti
          // sahifasidagi "Jami qarz" bilan bir xil bo'lishi uchun.
          qarzlar.forEach(q => {
            if (q.status === 'aktiv' && q.turi === this.qarz.turi) {
              const cur = q.valyuta === 'USD' ? 'usd' : 'uzs';
              jami[cur] += Number(q.qoldiq) || 0;
            }
          });
          this.jamiQarz = jami;
          if (!this.form.valyuta) this.form.valyuta = this.qarz.valyuta;
        }
      } catch (_) {}
    },
    async submit() {
      if (!this.canSubmit) return;
      const s = Number(this.form.summa);
      if (s > this.currentQoldiq) return this.$toast?.error(this.texts.amountExceeds);

      this.saving = true;
      try {
        const res = await this.$axios.$post(
          `/qarz-daftari/qarz/${this.qarz.id}/yopish`,
          { summa: s, valyuta: this.selectedValyuta },
          { silent: true }
        );
        if (res?.success !== false) {
          this.$toast?.success(this.newQoldiq <= 0 ? "Qarz to'liq yopildi" : "To'lov saqlandi");
          this.goBack();
        } else {
          this.$toast?.error(res?.message || 'Xatolik');
        }
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik');
      } finally { this.saving = false; }
    },
  },
};
</script>
