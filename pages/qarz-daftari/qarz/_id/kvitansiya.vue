<template>
  <div class="pb-8">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
        <p class="text-gray-500 mt-1">{{ texts.subtitle }}</p>
      </div>
      <div class="flex gap-3 mt-4 md:mt-0">
        <nuxt-link :to="localePath({ name: 'qarz-daftari-qarz-id', params: { id: $route.params.id } })" class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors border border-gray-300 shadow-sm text-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          {{ texts.back }}
        </nuxt-link>
        <button @click="print" class="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm text-sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/></svg>
          {{ texts.print }}
        </button>
      </div>
    </div>

    <div class="max-w-3xl">
      <div class="bg-white rounded-xl shadow-sm p-6 lg:p-8">
        <QarzDaftariKvitansiyaView v-if="data" :data="data" />
        <div v-else class="text-center py-12">
          <svg class="w-10 h-10 text-gray-300 mx-auto mb-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
          <p class="text-gray-400 text-sm">{{ texts.loading }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() { return { data: null }; },
  computed: {
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: { title: "Kvitansiya", subtitle: "Qarz hujjati", back: "Qarz tafsiloti", print: "Chop etish", loading: "Yuklanmoqda..." },
        ru: { title: "Квитанция", subtitle: "Документ долга", back: "Детали долга", print: "Печать", loading: "Загрузка..." },
        kr: { title: "Квитансия", subtitle: "Қарз ҳужжати", back: "Қарз тафсилоти", print: "Чоп этиш", loading: "Юкланмоқда..." },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() {
    try {
      const res = await this.$axios.$get(`/qarz-daftari/qarz/${this.$route.params.id}/kvitansiya`, { silent: true });
      if (res?.success) this.data = res.data;
    } catch (_) {}
  },
  methods: { print() { window.print(); } },
};
</script>
