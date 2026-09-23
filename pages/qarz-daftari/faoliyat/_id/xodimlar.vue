<template>
  <div class="pb-8">
    <!-- SS10 (2026-09-20): sahifa mobil ilovadagi "Xodim qo'shish" ekraniga
         moslandi — sarlavha + do'kon nomi, so'ng xodim KARTALARI ro'yxati
         (jadval o'rniga), pastda "Yangi xodim qo'shish" tugmasi. -->
    <div class="flex items-start gap-3 mb-6">
      <!-- SS18 (2026-09-21): orqaga tugmasi QATTIQ marshrutga bog'langan edi
           (`qarz-daftari-kiritish`) — bu sahifaga do'kon tahrirlash modalidan
           kelingan bo'lsa ham foydalanuvchini BEGONA sahifaga tashlardi.
           Endi haqiqiy brauzer tarixi bo'yicha BITTA oldingi sahifaga qaytadi. -->
      <button type="button" @click="goBack" class="flex-shrink-0 mt-1 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm transition-colors" :title="texts.back">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="min-w-0">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
        <p class="text-gray-500 mt-1">{{ texts.subtitle }}</p>
      </div>
    </div>

    <!-- Do'kon sarlavhasi (mobil ilovadagi 🏪 qatori) -->
    <div class="flex items-center gap-3 bg-white rounded-xl shadow-sm p-4 mb-4">
      <div class="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
        <ShopIcon cls="w-7 h-7" />
      </div>
      <div class="min-w-0">
        <p class="font-semibold text-gray-900 break-words leading-snug">{{ faoliyatNomi || '—' }}</p>
        <p class="text-xs text-gray-500 mt-0.5">{{ texts.shopHint }}</p>
      </div>
    </div>

    <!-- Xodim kartalari -->
    <div v-if="xodimlar.length" class="space-y-3">
      <div
        v-for="x in xodimlar"
        :key="x.id"
        class="bg-white rounded-xl shadow-sm p-4 flex items-start gap-3 border border-gray-100"
      >
        <!-- Avatar (ism bosh harfi) -->
        <div class="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 font-bold">
          {{ initial(x.fish) }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900 break-words leading-snug">{{ x.fish }}</p>
          <p class="text-sm text-gray-500 mt-0.5">{{ x.telefon || '—' }}</p>
          <span
            :class="[
              'inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-semibold',
              x.login_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            ]"
          >
            {{ x.login_active ? texts.active : texts.inactive }}
          </span>
        </div>
        <!-- Amallar: ikonka tugmalar (mobil ilovadagidek ✏️ / 🗑) -->
        <div class="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            :title="texts.edit"
            @click="editXodim(x)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
          <button
            type="button"
            class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            :title="texts.delete"
            @click="askDelete(x)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Bo'sh holat -->
    <div v-else class="bg-white rounded-xl shadow-sm text-center py-16">
      <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      <p class="text-gray-400 text-sm">{{ texts.empty }}</p>
    </div>

    <!-- "Yangi xodim qo'shish" — mobil ilovadagidek ro'yxatning PASTIDA -->
    <button
      type="button"
      class="mt-5 w-full inline-flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-sm text-sm"
      @click="showModal = true"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
      {{ texts.add }}
    </button>

    <QarzDaftariXodimModal v-if="showModal" :faoliyatId="$route.params.id" :xodim="editingXodim" @close="showModal = false; editingXodim = null" @saved="onSaved" />

    <!-- Xodim o'chirish tasdiqlash modali (orqa fon blur) -->
    <div
      v-if="confirmTarget"
      class="qd-confirm-overlay"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4">
        <div class="flex items-start gap-4 mb-5">
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900">{{ texts.confirmTitle }}</h3>
            <p class="text-sm text-gray-500 mt-1">
              <span class="font-semibold text-gray-700">{{ confirmTarget.fish }}</span>
              {{ texts.confirmDesc }}
            </p>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            @click="cancelDelete"
          >{{ texts.cancel }}</button>
          <!-- Tailwind v2 (JIT o'chiq) da `disabled:` varianti generatsiya QILINMAYDI — inline style -->
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            :style="deleting ? 'opacity:.5; cursor:not-allowed' : ''"
            :disabled="deleting"
            @click="confirmDelete"
          >{{ deleting ? texts.deleting : texts.confirmBtn }}</button>
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
      xodimlar: [],
      // SS10: sarlavhada do'kon nomi ko'rsatiladi (mobil ilovadagidek)
      faoliyat: null,
      showModal: false,
      editingXodim: null,
      confirmTarget: null,
      deleting: false,
    };
  },
  computed: {
    faoliyatNomi() { return this.faoliyat ? this.faoliyat.nomi : ''; },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: "Xodimlar", subtitle: "Savdo faoliyatiga biriktirilgan xodimlar ro'yxati",
          shopHint: "Savdo faoliyatiga biriktirilgan xodimlar",
          back: "Orqaga", add: "Yangi xodim qo'shish",
          edit: "Tahrirlash", delete: "O'chirish",
          active: "Faol", inactive: "Nofaol",
          empty: "Xodimlar hali qo'shilmagan",
          confirmTitle: "Xodimni o'chirishni tasdiqlaysizmi?",
          confirmDesc: "xodimlar ro'yxatidan olib tashlanadi.",
          cancel: "Bekor qilish", confirmBtn: "Ha, o'chirish", deleting: "O'chirilmoqda...",
          deleted: "O'chirildi", error: "Xatolik",
        },
        ru: {
          title: "Сотрудники", subtitle: "Список сотрудников торговой деятельности",
          shopHint: "Сотрудники, закреплённые за торговой деятельностью",
          back: "Назад", add: "Добавить нового сотрудника",
          edit: "Редактировать", delete: "Удалить",
          active: "Активен", inactive: "Неактивен",
          empty: "Сотрудники ещё не добавлены",
          confirmTitle: "Подтвердить удаление сотрудника?",
          confirmDesc: "будет удалён(а) из списка сотрудников.",
          cancel: "Отмена", confirmBtn: "Да, удалить", deleting: "Удаление...",
          deleted: "Удалено", error: "Ошибка",
        },
        kr: {
          title: "Ходимлар", subtitle: "Савдо фаолиятига бириктирилган ходимлар рўйхати",
          shopHint: "Савдо фаолиятига бириктирилган ходимлар",
          back: "Орқага", add: "Янги ходим қўшиш",
          edit: "Таҳрирлаш", delete: "Ўчириш",
          active: "Фаол", inactive: "Нофаол",
          empty: "Ходимлар ҳали қўшилмаган",
          confirmTitle: "Ходимни ўчиришни тасдиқлайсизми?",
          confirmDesc: "ходимлар рўйхатидан олиб ташланади.",
          cancel: "Бекор қилиш", confirmBtn: "Ҳа, ўчириш", deleting: "Ўчирилмоқда...",
          deleted: "Ўчирилди", error: "Хатолик",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await Promise.all([this.load(), this.loadFaoliyat()]); },
  methods: {
    /**
     * SS18 (2026-09-21): "bitta oldingi sahifa" qoidasi.
     * Brauzer tarixi bo'sh bo'lsa (sahifa to'g'ridan-to'g'ri URL bilan ochilgan)
     * `back()` saytdan chiqarib yuborardi — shu sabab mantiqiy ota-sahifaga
     * zaxira yo'l qo'yilgan.
     */
    goBack() {
      if (window.history.length > 1) this.$router.back();
      else this.$router.push(this.localePath({ name: 'qarz-daftari' }));
    },
    /** Avatar uchun ism bosh harfi (bo'sh bo'lsa '?') */
    initial(fish) {
      const s = String(fish || '').trim();
      return s ? s.charAt(0).toUpperCase() : '?';
    },
    // SS10: do'kon nomi — alohida endpoint YO'Q, mavjud ro'yxatdan olamiz
    // (berish/olish sahifalaridagi bilan bir xil usul, DRY).
    async loadFaoliyat() {
      try {
        const res = await this.$axios.$get('/qarz-daftari/savdo-faoliyat', { silent: true });
        if (res?.success && Array.isArray(res.data)) {
          this.faoliyat = res.data.find((f) => String(f.id) === String(this.$route.params.id)) || null;
        }
      } catch (_) {}
    },
    async load() {
      try {
        const res = await this.$axios.$get(`/qarz-daftari/savdo-faoliyat/${this.$route.params.id}/xodimlar`, { silent: true });
        if (res?.success) this.xodimlar = res.data;
      } catch (_) {}
    },
    editXodim(x) { this.editingXodim = x; this.showModal = true; },
    askDelete(x) { this.confirmTarget = x; },
    cancelDelete() { this.confirmTarget = null; this.deleting = false; },
    async confirmDelete() {
      if (!this.confirmTarget || this.deleting) return;
      this.deleting = true;
      try {
        await this.$axios.delete(`/qarz-daftari/xodimlar/${this.confirmTarget.id}`);
        this.$toast?.success(this.texts.deleted);
        this.confirmTarget = null;
        await this.load();
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.texts.error);
      } finally {
        this.deleting = false;
      }
    },
    async onSaved() { this.showModal = false; this.editingXodim = null; await this.load(); },
  },
};
</script>

<style scoped>
/* Egasi default.vue dagi global .modal-overlay bilan to'qnashmasligi uchun
   prefiks (qd-confirm-overlay) ishlatiladi. Backdrop-blur + qoraytirilgan fon. */
.qd-confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: qd-fade-in 0.15s ease-out;
}
@keyframes qd-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
