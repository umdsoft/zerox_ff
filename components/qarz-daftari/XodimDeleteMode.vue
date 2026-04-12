<template>
  <div>
    <div class="space-y-2 mb-4">
      <label v-for="x in xodimlar" :key="x.id" class="flex items-center gap-3 bg-white rounded-xl p-4 cursor-pointer hover:bg-red-50 transition-colors">
        <input type="checkbox" :value="x.id" v-model="selected" class="w-5 h-5 text-red-600 rounded" />
        <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xs">{{ x.fish?.charAt(0) }}</div>
        <span class="text-sm font-medium text-gray-900">{{ x.fish }}</span>
      </label>
    </div>
    <button v-if="selected.length" @click="deleteSelected" :disabled="deleting" class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
      {{ deleting ? "O'chirilmoqda..." : selected.length + " ta xodimni o'chirish" }}
    </button>
  </div>
</template>

<script>
export default {
  props: { xodimlar: { type: Array, default: () => [] } },
  data() { return { selected: [], deleting: false }; },
  methods: {
    async deleteSelected() {
      if (!confirm("Tanlangan xodimlarni o'chirishni tasdiqlaysizmi?")) return;
      this.deleting = true;
      try {
        for (const id of this.selected) {
          await this.$axios.delete(`/qarz-daftari/xodimlar/${id}`);
        }
        this.$emit('deleted');
        this.selected = [];
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik');
      } finally { this.deleting = false; }
    },
  },
};
</script>
