<template>
  <div class="pb-8">
    <!-- Custom Confirmation Modal — z-index 9999 sidebar/header'dan ham yuqorida -->
    <div
      v-if="showConfirmModal"
      class="qd-confirm-overlay"
      @click.self="showConfirmModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900">{{ texts.confirmTitle }}</h3>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed mb-4">{{ texts.warning }}</p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">{{ texts.forgiveAmount }}:</span>
              <span class="font-bold text-red-700">{{ formatMoney(form.summa || 0) }} {{ qarz?.valyuta }}</span>
            </div>
            <div class="flex items-center justify-between text-sm mt-2 pt-2 border-t border-red-200">
              <span class="text-gray-600">{{ texts.afterRemaining }}:</span>
              <span class="font-bold" :class="newQoldiq <= 0 ? 'text-red-700' : 'text-gray-900'">{{ formatMoney(newQoldiq) }} {{ qarz?.valyuta }}</span>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            @click="showConfirmModal = false"
            :disabled="saving"
            class="px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
          >
            {{ texts.cancel }}
          </button>
          <button
            type="button"
            @click="confirmSubmit"
            :disabled="saving"
            class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 inline-flex items-center"
          >
            <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ saving ? texts.saving : texts.confirm }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <svg class="w-10 h-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>

    <div v-else-if="loadError" class="flex items-center justify-center py-20">
      <div class="text-center max-w-md">
        <h2 class="text-xl font-bold text-gray-900 mb-2">{{ texts.errorTitle }}</h2>
        <button @click="goBack" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm">{{ texts.back }}</button>
      </div>
    </div>

    <div v-else-if="qarz">
      <div class="flex items-start gap-3 mb-6">
        <button @click="goBack" class="flex-shrink-0 mt-1 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
          <p class="text-gray-500 mt-1">{{ qarz.mijoz?.fish }}</p>
        </div>
      </div>

      <!-- Ogohlantirish -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <p class="flex-1 text-sm text-amber-800 leading-relaxed">{{ texts.warning }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm bg-gradient-to-br from-red-500 to-red-600">
              {{ (qarz.mijoz?.fish || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <p class="font-semibold text-gray-900 text-lg">{{ qarz.mijoz?.fish }}</p>
              <p v-if="qarz.mijoz?.telefon" class="text-sm text-gray-500">{{ qarz.mijoz.telefon }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500">{{ texts.qoldiq }}</p>
              <p class="text-lg font-bold text-red-600">{{ formatMoney(qarz.qoldiq) }} {{ qarz.valyuta }}</p>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <h3 class="text-base font-semibold text-gray-900 mb-6">{{ texts.formTitle }}</h3>

            <div class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.summa }} <span class="text-red-400">*</span></label>
                <div class="flex items-stretch border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500 overflow-hidden">
                  <input
                    :value="summaFormatted"
                    @input="onSummaInput"
                    type="text"
                    inputmode="numeric"
                    :placeholder="texts.summaPlaceholder"
                    class="flex-1 border-0 outline-none px-4 py-3 text-sm"
                  />
                  <div class="px-4 flex items-center bg-gray-50 text-xs font-medium text-gray-500 border-l border-gray-200">{{ qarz.valyuta }}</div>
                </div>
                <p class="text-xs text-gray-400 mt-1">{{ texts.maxHint }} {{ formatMoney(qarz.qoldiq) }} {{ qarz.valyuta }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.izoh }}</label>
                <textarea v-model="form.izoh" rows="3" :placeholder="texts.izohPlaceholder" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"></textarea>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-500 mb-2">{{ texts.quickAmounts }}</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button type="button" @click="setQuickAmount(0.25)" class="px-3 py-2 border border-gray-200 hover:border-red-400 hover:bg-red-50 rounded-lg text-xs font-medium text-gray-700 transition-colors">25%</button>
                  <button type="button" @click="setQuickAmount(0.5)" class="px-3 py-2 border border-gray-200 hover:border-red-400 hover:bg-red-50 rounded-lg text-xs font-medium text-gray-700 transition-colors">50%</button>
                  <button type="button" @click="setQuickAmount(0.75)" class="px-3 py-2 border border-gray-200 hover:border-red-400 hover:bg-red-50 rounded-lg text-xs font-medium text-gray-700 transition-colors">75%</button>
                  <button type="button" @click="setQuickAmount(1)" class="px-3 py-2 border border-red-500 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-colors">{{ texts.allRemaining }}</button>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-3">
              <button @click="goBack" type="button" class="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl font-medium text-sm transition-colors">{{ texts.cancel }}</button>
              <button @click="submit" :disabled="saving || !canSubmit" class="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm inline-flex items-center">
                <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                {{ saving ? texts.saving : texts.confirm }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">{{ texts.summary }}</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">{{ texts.currentRemaining }}</span>
                <span class="font-semibold text-gray-900">{{ formatMoney(qarz.qoldiq) }} {{ qarz.valyuta }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">{{ texts.forgiveAmount }}</span>
                <span class="font-semibold text-red-600">- {{ formatMoney(form.summa || 0) }} {{ qarz.valyuta }}</span>
              </div>
              <div class="border-t border-gray-100 pt-3 flex justify-between text-sm">
                <span class="text-gray-500 font-medium">{{ texts.afterRemaining }}</span>
                <span class="font-bold" :class="newQoldiq <= 0 ? 'text-red-600' : 'text-gray-900'">{{ formatMoney(newQoldiq) }} {{ qarz.valyuta }}</span>
              </div>
              <div v-if="newQoldiq <= 0 && (form.summa > 0)" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-xs font-semibold text-red-700">{{ texts.fullyForgiven }}</p>
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
  data() { return { qarz: null, loading: true, loadError: false, saving: false, showConfirmModal: false, form: { summa: null, izoh: '' } }; },
  computed: {
    summaFormatted() { return this.form.summa ? this.formatMoney(this.form.summa) : ''; },
    newQoldiq() {
      const q = parseFloat(this.qarz?.qoldiq) || 0;
      const s = Number(this.form.summa) || 0;
      return Math.max(0, q - s);
    },
    canSubmit() {
      const s = Number(this.form.summa) || 0;
      const q = parseFloat(this.qarz?.qoldiq) || 0;
      return s > 0 && s <= q;
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: "Qarzdan voz kechish",
          confirmTitle: "Voz kechishni tasdiqlash",
          back: "Orqaga",
          warning: "Qarzdan voz kechish natijasida siz qarzni talab qilish huquqini yo'qotasiz. Shu sababli voz kechishni tasdiqlashdan oldin yaxshilab o'ylab ko'ring.",
          qoldiq: "Qoldiq",
          formTitle: "Voz kechish ma'lumotlari",
          summa: "Voz kechiladigan summa",
          summaPlaceholder: "Summani kiriting",
          maxHint: "Maksimal:",
          izoh: "Izoh (ixtiyoriy)",
          izohPlaceholder: "Voz kechish sababi",
          quickAmounts: "Tezkor summa",
          allRemaining: "Hammasi",
          cancel: "Bekor qilish",
          confirm: "Voz kechishni tasdiqlash",
          saving: "Saqlanmoqda...",
          summary: "Hisob-kitob",
          currentRemaining: "Hozirgi qoldiq",
          forgiveAmount: "Voz kechiladi",
          afterRemaining: "Yangi qoldiq",
          fullyForgiven: "Qarz to'liq voz kechiladi",
          errorTitle: "Qarz topilmadi",
        },
        ru: {
          title: "Прощение долга",
          confirmTitle: "Подтверждение прощения",
          back: "Назад",
          warning: "После прощения долга вы потеряете право требовать его возврата. Поэтому хорошо подумайте перед подтверждением прощения.",
          qoldiq: "Остаток", formTitle: "Данные прощения",
          summa: "Сумма прощения", summaPlaceholder: "Введите сумму", maxHint: "Максимум:",
          izoh: "Комментарий (необязательно)", izohPlaceholder: "Причина прощения",
          quickAmounts: "Быстрая сумма", allRemaining: "Всё", cancel: "Отмена",
          confirm: "Подтвердить прощение", saving: "Сохранение...", summary: "Расчёт",
          currentRemaining: "Текущий остаток", forgiveAmount: "Прощается",
          afterRemaining: "Новый остаток", fullyForgiven: "Долг будет полностью прощён",
          errorTitle: "Долг не найден",
        },
        kr: {
          title: "Қарздан воз кечиш",
          confirmTitle: "Воз кечишни тасдиқлаш",
          back: "Орқага",
          warning: "Қарздан воз кечиш натижасида сиз қарзни талаб қилиш ҳуқуқини йўқотасиз. Шу сабабли воз кечишни тасдиқлашдан олдин яхшилаб ўйлаб кўринг.",
          qoldiq: "Қолдиқ", formTitle: "Воз кечиш маълумотлари",
          summa: "Воз кечиладиган сумма", summaPlaceholder: "Сумма киритинг", maxHint: "Максимал:",
          izoh: "Изоҳ (ихтиёрий)", izohPlaceholder: "Воз кечиш сабаби",
          quickAmounts: "Тезкор сумма", allRemaining: "Ҳаммаси", cancel: "Бекор қилиш",
          confirm: "Воз кечишни тасдиқлаш", saving: "Сақланмоқда...", summary: "Ҳисоб-китоб",
          currentRemaining: "Ҳозирги қолдиқ", forgiveAmount: "Воз кечилади",
          afterRemaining: "Янги қолдиқ", fullyForgiven: "Қарз тўлиқ воз кечилади",
          errorTitle: "Қарз топилмади",
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
      const q = parseFloat(this.qarz?.qoldiq) || 0;
      this.form.summa = Math.round(q * ratio);
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
        } else {
          this.loadError = true;
        }
      } catch (_) { this.loadError = true; } finally { this.loading = false; }
    },
    submit() {
      if (!this.canSubmit) return;
      const s = Number(this.form.summa);
      const q = parseFloat(this.qarz.qoldiq);
      if (s > q) return this.$toast?.error("Summa qoldiqdan oshib ketdi");
      // Custom modal orqali tasdiqlash
      this.showConfirmModal = true;
    },
    async confirmSubmit() {
      const s = Number(this.form.summa);
      this.saving = true;
      try {
        const res = await this.$axios.$post(
          `/qarz-daftari/qarz/${this.qarz.id}/voz-kechish`,
          { summa: s, valyuta: this.qarz.valyuta, izoh: this.form.izoh || undefined },
          { silent: true }
        );
        if (res?.success !== false) {
          this.$toast?.success(this.newQoldiq <= 0 ? "Qarzdan to'liq voz kechildi" : "Voz kechish saqlandi");
          this.showConfirmModal = false;
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

<style scoped>
/*
  Confirm modal overlay — sidebar va header'dan yuqori bo'lishi shart.
  Tailwind'ning z-50 yetarli emas (NavbarLogged sidebar bilan to'qnashishi mumkin).
  Shu sababli z-index: 9999 + position: fixed inset 0 ishlatamiz.
*/
.qd-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>
