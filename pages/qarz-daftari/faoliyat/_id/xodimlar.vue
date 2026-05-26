<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
        <p class="text-gray-500 mt-1">{{ texts.subtitle }}</p>
      </div>
      <div class="flex gap-3 mt-4 md:mt-0">
        <nuxt-link :to="localePath({ name: 'qarz-daftari-kiritish' })" class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm text-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          {{ texts.back }}
        </nuxt-link>
        <button @click="showModal = true" class="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
          {{ texts.add }}
        </button>
      </div>
    </div>

    <!-- Xodimlar jadvali -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table v-if="xodimlar.length" class="w-full">
        <thead>
          <tr class="border-b border-gray-100">
            <th class="text-left text-xs font-medium text-gray-500 px-6 py-3">{{ texts.employee }}</th>
            <th class="text-left text-xs font-medium text-gray-500 px-6 py-3">{{ texts.phone }}</th>
            <th class="text-center text-xs font-medium text-gray-500 px-6 py-3">{{ texts.actions }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="x in xodimlar" :key="x.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm">{{ x.fish?.charAt(0)?.toUpperCase() }}</div>
                <span class="font-medium text-gray-900">{{ x.fish }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ x.telefon || '—' }}</td>
            <td class="px-6 py-4 text-center whitespace-nowrap">
              <button @click="editXodim(x)" class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1">{{ texts.edit }}</button>
              <button @click="askDelete(x)" class="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">{{ texts.delete }}</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center py-16">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <p class="text-gray-400 text-sm mb-4">{{ texts.empty }}</p>
        <button @click="showModal = true" class="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">{{ texts.addFirst }}</button>
      </div>
    </div>

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
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
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
      showModal: false,
      editingXodim: null,
      confirmTarget: null,
      deleting: false,
    };
  },
  computed: {
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: "Xodimlar", subtitle: "Savdo faoliyatiga biriktirilgan xodimlar ro'yxati",
          back: "Orqaga", add: "Xodim qo'shish",
          employee: "Xodim", phone: "Telefon raqami", actions: "Amallar",
          edit: "Tahrirlash", delete: "O'chirish",
          empty: "Xodimlar hali qo'shilmagan", addFirst: "Birinchi xodimni qo'shish",
          confirmTitle: "Xodimni o'chirishni tasdiqlaysizmi?",
          confirmDesc: "xodimlar ro'yxatidan olib tashlanadi.",
          cancel: "Bekor qilish", confirmBtn: "Ha, o'chirish", deleting: "O'chirilmoqda...",
        },
        ru: {
          title: "Сотрудники", subtitle: "Список сотрудников торговой деятельности",
          back: "Назад", add: "Добавить сотрудника",
          employee: "Сотрудник", phone: "Номер телефона", actions: "Действия",
          edit: "Редактировать", delete: "Удалить",
          empty: "Сотрудники ещё не добавлены", addFirst: "Добавить первого сотрудника",
          confirmTitle: "Подтвердить удаление сотрудника?",
          confirmDesc: "будет удалён(а) из списка сотрудников.",
          cancel: "Отмена", confirmBtn: "Да, удалить", deleting: "Удаление...",
        },
        kr: {
          title: "Ходимлар", subtitle: "Савдо фаолиятига бириктирилган ходимлар рўйхати",
          back: "Орқага", add: "Ходим қўшиш",
          employee: "Ходим", phone: "Телефон рақами", actions: "Амаллар",
          edit: "Таҳрирлаш", delete: "Ўчириш",
          empty: "Ходимлар ҳали қўшилмаган", addFirst: "Биринчи ходимни қўшиш",
          confirmTitle: "Ходимни ўчиришни тасдиқлайсизми?",
          confirmDesc: "ходимлар рўйхатидан олиб ташланади.",
          cancel: "Бекор қилиш", confirmBtn: "Ҳа, ўчириш", deleting: "Ўчирилмоқда...",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.load(); },
  methods: {
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
        this.$toast?.success("O'chirildi");
        this.confirmTarget = null;
        await this.load();
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik');
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
