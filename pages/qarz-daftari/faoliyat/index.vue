<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
        <p class="text-gray-500 mt-1">{{ texts.subtitle }}</p>
      </div>
      <button @click="showAddModal = true" class="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm mt-4 md:mt-0">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
        {{ texts.addNew }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chap: Faoliyatlar filter + ro'yxat -->
      <div class="lg:col-span-2">
        <!-- Filter -->
        <div class="bg-white rounded-xl shadow-sm p-4 mb-4">
          <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{{ texts.filter }}</label>
          <select v-model="selectedId" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 bg-white">
            <option :value="null">{{ texts.all }}</option>
            <option v-for="f in faoliyatlar" :key="f.id" :value="f.id">{{ f.nomi }}</option>
          </select>
        </div>

        <!-- Faoliyatlar ro'yxati (jadval ko'rinishida) -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">{{ texts.name }}</th>
                <th class="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">{{ texts.actions }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="f in filteredFaoliyatlar"
                :key="f.id"
                @click="selectedId = f.id"
                :class="['border-b border-gray-50 cursor-pointer transition-colors', selectedId === f.id ? 'bg-blue-50' : 'hover:bg-gray-50']"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div :class="['w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm', selectedId === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600']">
                      {{ f.nomi?.charAt(0)?.toUpperCase() }}
                    </div>
                    <span class="font-medium text-gray-900">{{ f.nomi }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click.stop="editFaoliyat(f)" class="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">{{ texts.edit }}</button>
                    <nuxt-link @click.native.stop :to="localePath({ name: 'qarz-daftari-faoliyat-id-xodimlar', params: { id: f.id } })" class="px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">{{ texts.employees }}</nuxt-link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="!faoliyatlar.length" class="text-center py-12 text-gray-400 text-sm">{{ texts.empty }}</div>
        </div>
      </div>

      <!-- O'ng: Tanlangan faoliyat amallar paneli -->
      <div>
        <div v-if="selectedFaoliyat" class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
          <h3 class="text-lg font-bold text-gray-900 mb-1">{{ selectedFaoliyat.nomi }}</h3>
          <p class="text-sm text-gray-500 mb-6">{{ texts.selectAction }}</p>

          <div class="space-y-3">
            <nuxt-link :to="localePath({ name: 'qarz-daftari-faoliyat-id-berish', params: { id: selectedId } })" class="flex items-center gap-3 w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-700 rounded-xl font-semibold transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
              {{ texts.give }}
            </nuxt-link>
            <nuxt-link :to="localePath({ name: 'qarz-daftari-faoliyat-id-olish', params: { id: selectedId } })" class="flex items-center gap-3 w-full p-4 bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300 text-green-700 rounded-xl font-semibold transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
              {{ texts.take }}
            </nuxt-link>
            <nuxt-link :to="localePath({ name: 'qarz-daftari-faoliyat-id-xodimlar', params: { id: selectedId } })" class="flex items-center gap-3 w-full p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 text-purple-700 rounded-xl font-semibold transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {{ texts.employees }}
            </nuxt-link>
          </div>
        </div>
        <div v-else class="bg-white rounded-xl shadow-sm p-6 text-center">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>
          <p class="text-sm text-gray-400">{{ texts.selectHint }}</p>
        </div>
      </div>
    </div>

    <QarzDaftariSavdoFaoliyatModal v-if="showAddModal" :faoliyat="editingFaoliyat" @close="showAddModal = false; editingFaoliyat = null" @saved="onSaved" />
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() { return { faoliyatlar: [], selectedId: null, showAddModal: false, editingFaoliyat: null }; },
  computed: {
    selectedFaoliyat() { return this.faoliyatlar.find(f => f.id === this.selectedId); },
    filteredFaoliyatlar() {
      if (!this.selectedId) return this.faoliyatlar;
      return this.faoliyatlar.filter(f => f.id === this.selectedId);
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: "Savdo faoliyatlari", subtitle: "Faoliyatlarni boshqarish va qarz operatsiyalarini tanlash", addNew: "Yangi faoliyat", filter: "Filtrlash", all: "Barchasi", name: "Faoliyat nomi", actions: "Amallar", edit: "Tahrirlash", employees: "Xodimlar", empty: "Faoliyatlar topilmadi", selectAction: "Amal tanlang", give: "Qarzga berish", take: "Qarzga olish", selectHint: "Chapdan faoliyatni tanlang" },
        ru: { title: "Торговая деятельность", subtitle: "Управление деятельностью и выбор долговых операций", addNew: "Новая деятельность", filter: "Фильтр", all: "Все", name: "Название", actions: "Действия", edit: "Редактировать", employees: "Сотрудники", empty: "Деятельность не найдена", selectAction: "Выберите действие", give: "Дать в долг", take: "Взять в долг", selectHint: "Выберите деятельность слева" },
        kr: { title: "Савдо фаолиятлари", subtitle: "Фаолиятларни бошқариш ва қарз операцияларини танлаш", addNew: "Янги фаолият", filter: "Филтрлаш", all: "Барчаси", name: "Фаолият номи", actions: "Амаллар", edit: "Таҳрирлаш", employees: "Ходимлар", empty: "Фаолиятлар топилмади", selectAction: "Амал танланг", give: "Қарзга бериш", take: "Қарзга олиш", selectHint: "Чапдан фаолиятни танланг" },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.load(); },
  methods: {
    async load() {
      try {
        const res = await this.$axios.$get('/qarz-daftari/savdo-faoliyat', { silent: true });
        if (res?.success) this.faoliyatlar = res.data;
      } catch (_) {}
    },
    editFaoliyat(f) { this.editingFaoliyat = f; this.showAddModal = true; },
    async onSaved() { this.showAddModal = false; this.editingFaoliyat = null; await this.load(); },
  },
};
</script>
