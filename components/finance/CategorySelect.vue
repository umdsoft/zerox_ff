<template>
  <div class="cat-select relative">
    <!-- Trigger -->
    <button
      type="button"
      @click="toggle"
      class="w-full flex items-center justify-between px-4 py-3 border rounded-xl bg-white transition-colors"
      :class="open ? ringClass : 'border-gray-300 hover:border-gray-400'"
    >
      <span v-if="selected" class="flex items-center gap-2 min-w-0">
        <span class="text-xl flex-shrink-0">{{ selected.icon }}</span>
        <span class="truncate text-gray-800">{{ nameFor(selected) }}</span>
      </span>
      <span v-else class="text-gray-400">{{ $t('finance.choose_category') }}</span>
      <svg class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform" :class="{ 'rotate-180': open }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Backdrop (click-outside) -->
    <div v-if="open" class="fixed inset-0 z-20" @click="close"></div>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute left-0 right-0 mt-2 z-30 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
    >
      <!-- Search -->
      <div class="p-2 border-b border-gray-100">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            ref="search"
            v-model="q"
            type="text"
            :placeholder="$t('finance.search_category')"
            class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
            :class="focusRing"
          />
        </div>
      </div>

      <!-- List -->
      <ul class="max-h-60 overflow-y-auto py-1 cat-list">
        <li
          v-for="cat in filtered"
          :key="cat.id"
          @click="select(cat)"
          class="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
          :class="cat.id === value ? activeClass : 'hover:bg-gray-50'"
        >
          <span class="text-xl">{{ cat.icon }}</span>
          <span class="flex-1 text-sm" :class="cat.id === value ? activeTextClass : 'text-gray-700'">{{ nameFor(cat) }}</span>
          <svg v-if="cat.id === value" class="w-4 h-4" :class="activeTextClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </li>
        <li v-if="filtered.length === 0" class="px-4 py-3 text-sm text-gray-400 text-center">
          {{ $t('finance.no_category_found') }}
        </li>
      </ul>

      <!-- Add new category -->
      <div class="border-t border-gray-100 p-2">
        <button
          v-if="!adding"
          type="button"
          @click="startAdd"
          class="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="addBtnClass"
        >
          <span class="text-lg leading-none">➕</span> {{ $t('finance.add') }}
        </button>
        <div v-else class="flex items-center gap-2">
          <input
            v-model="newIcon"
            type="text"
            maxlength="2"
            class="w-12 px-1 py-2 border border-gray-300 rounded-lg text-center text-lg focus:outline-none"
            :class="focusRing"
            placeholder="📦"
          />
          <input
            ref="newNameInput"
            v-model="newName"
            type="text"
            class="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            :class="focusRing"
            :placeholder="$t('finance.category_name_placeholder')"
            @keyup.enter="submitAdd"
          />
          <button
            type="button"
            @click="submitAdd"
            :disabled="loading || !newName.trim()"
            class="px-3 py-2 text-white rounded-lg text-sm font-medium disabled:opacity-50"
            :class="solidBtnClass"
          >
            {{ $t('finance.add') }}
          </button>
          <button type="button" @click="cancelAdd" class="px-2 py-2 text-gray-500 hover:text-gray-700">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  props: {
    value: { type: [Number, String], default: null },
    categories: { type: Array, default: () => [] },
    accent: { type: String, default: 'blue' }, // 'blue' | 'green'
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      open: false,
      q: '',
      adding: false,
      newName: '',
      newIcon: ''
    }
  },
  computed: {
    selected() {
      return this.categories.find(c => c.id === this.value) || null
    },
    filtered() {
      const s = this.q.trim().toLowerCase()
      if (!s) return this.categories
      return this.categories.filter(c => this.nameFor(c).toLowerCase().includes(s))
    },
    isGreen() { return this.accent === 'green' },
    ringClass() { return this.isGreen ? 'border-green-500 ring-2 ring-green-100' : 'border-blue-500 ring-2 ring-blue-100' },
    focusRing() { return this.isGreen ? 'focus:ring-2 focus:ring-green-500 focus:border-green-500' : 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500' },
    activeClass() { return this.isGreen ? 'bg-green-50' : 'bg-blue-50' },
    activeTextClass() { return this.isGreen ? 'text-green-700 font-semibold' : 'text-blue-700 font-semibold' },
    addBtnClass() { return this.isGreen ? 'text-green-600 hover:bg-green-50' : 'text-blue-600 hover:bg-blue-50' },
    solidBtnClass() { return this.isGreen ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700' }
  },
  methods: {
    // Slug (masalan 'oziq_ovqat') -> finance.<slug> tarjima; topilmasa asl nom
    nameFor(cat) {
      if (!cat) return ''
      const key = `finance.${cat.name}`
      const t = this.$t(key)
      return t === key ? cat.name : t
    },
    toggle() {
      this.open = !this.open
      if (this.open) {
        this.q = ''
        this.$nextTick(() => { try { this.$refs.search && this.$refs.search.focus() } catch (_) {} })
      }
    },
    close() {
      this.open = false
      this.cancelAdd()
    },
    select(cat) {
      this.$emit('input', cat.id)
      this.close()
    },
    startAdd() {
      this.adding = true
      this.$nextTick(() => { try { this.$refs.newNameInput && this.$refs.newNameInput.focus() } catch (_) {} })
    },
    cancelAdd() {
      this.adding = false
      this.newName = ''
      this.newIcon = ''
    },
    submitAdd() {
      const name = this.newName.trim()
      if (!name) return
      // Yangi kategoriyani ota-komponent yaratadi (API) — muvaffaqiyatda select qiladi
      this.$emit('add', { name, icon: this.newIcon.trim() || '📦' })
      this.cancelAdd()
      this.open = false
    }
  }
}
</script>

<style scoped>
.cat-list {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.cat-list::-webkit-scrollbar { width: 6px; }
.cat-list::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 9999px; }
.cat-list::-webkit-scrollbar-track { background: transparent; }
</style>
