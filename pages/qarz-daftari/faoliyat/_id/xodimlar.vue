<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
        <p class="text-gray-500 mt-1">{{ texts.subtitle }}</p>
      </div>
      <div class="flex gap-3 mt-4 md:mt-0">
        <nuxt-link :to="localePath({ name: 'qarz-daftari-faoliyat' })" class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm text-sm">
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
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">{{ texts.employee }}</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">{{ texts.phone }}</th>
            <th class="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">{{ texts.actions }}</th>
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
            <td class="px-6 py-4 text-right">
              <button @click="editXodim(x)" class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1">{{ texts.edit }}</button>
              <button @click="deleteXodim(x.id)" class="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">{{ texts.delete }}</button>
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
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() { return { xodimlar: [], showModal: false, editingXodim: null }; },
  computed: {
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: "Xodimlar", subtitle: "Savdo faoliyatiga biriktirilgan xodimlar ro'yxati", back: "Orqaga", add: "Xodim qo'shish", employee: "Xodim", phone: "Telefon", actions: "Amallar", edit: "Tahrirlash", delete: "O'chirish", empty: "Xodimlar hali qo'shilmagan", addFirst: "Birinchi xodimni qo'shish" },
        ru: { title: "Сотрудники", subtitle: "Список сотрудников торговой деятельности", back: "Назад", add: "Добавить сотрудника", employee: "Сотрудник", phone: "Телефон", actions: "Действия", edit: "Редактировать", delete: "Удалить", empty: "Сотрудники ещё не добавлены", addFirst: "Добавить первого сотрудника" },
        kr: { title: "Ходимлар", subtitle: "Савдо фаолиятига бириктирилган ходимлар рўйхати", back: "Орқага", add: "Ходим қўшиш", employee: "Ходим", phone: "Телефон", actions: "Амаллар", edit: "Таҳрирлаш", delete: "Ўчириш", empty: "Ходимлар ҳали қўшилмаган", addFirst: "Биринчи ходимни қўшиш" },
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
    async deleteXodim(id) {
      if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
      try {
        await this.$axios.delete(`/qarz-daftari/xodimlar/${id}`);
        await this.load();
      } catch (e) { this.$toast?.error(e.response?.data?.message || 'Xatolik'); }
    },
    async onSaved() { this.showModal = false; this.editingXodim = null; await this.load(); },
  },
};
</script>
