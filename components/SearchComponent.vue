<template>
  <div class="flex w-1/2 ml-2">
    <div class="search_container ml-auto py-2 px-2">
      <input
        v-model.trim="searchText"
        class="search_input w-full"
        type="text"
        :placeholder="$t('placeholder.search')"
        @keydown.enter="search"
        @input="formatSearchInput"
      />
      <div v-if="searchText" class="mr-2" style="cursor: pointer" @click="cleanSearch">
        <svg
          class="text-blue-500"
          width="23"
          height="23"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    </div>
    <button
      style="border-radius:0 5px 5px 0"
      @click="search"
      class="px-2 lg:px-4 bg-t_primary font-bold text-white"
    >
      <svg
        class="h-5 w-5 text-white"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <circle cx="10" cy="10" r="7" />
        <line x1="21" y1="21" x2="15" y2="15" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    getContracts: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      searchText: "",
    };
  },
  watch: {
    searchText(val) {
      // Qidiruv matni to'liq o'chirilganda oldingi ro'yxatni qaytarish
      if (!val || !val.trim()) {
        this.getContracts();
      }
    },
  },
  methods: {
    formatSearchInput() {
      const raw = this.searchText.replace(/\s/g, '');
      // Faqat raqamlardan iborat bo'lsa, 1000 birlikda formatlash
      if (/^\d+$/.test(raw) && raw.length > 3) {
        this.searchText = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      }
    },
    cleanSearch() {
      this.searchText = "";
      this.getContracts();
    },
    async search() {
      if (!this.searchText.trim()) {
        return this.getContracts();
      }
      try {
        let searchQuery = this.searchText.trim();

        // Raqamli qidiruv: "100 000" → "100000" (backend CAST(amount AS CHAR) uchun)
        if (/^[\d\s]+$/.test(searchQuery)) {
          searchQuery = searchQuery.replace(/\s/g, '');
        }

        // Sana formati: "11.07.2025" → "7/11/2025" (backend number format: M/D/YYYY)
        const dateMatch = searchQuery.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
        if (dateMatch) {
          const day = parseInt(dateMatch[1], 10);
          const month = parseInt(dateMatch[2], 10);
          const year = dateMatch[3];
          searchQuery = `${month}/${day}/${year}`;
        }

        const response = await this.$axios.get(`${this.url}&search=${encodeURIComponent(searchQuery)}`);
        this.$emit("searchData", response.data);
      } catch (error) {
        return this.$toast.error(this.$t('a1.a42'));
      }
    },
  },
};
</script>



<style lang="scss" scoped>
.search_container {
  background: #ffffff;
  /* Gray/Gray-200 */
  width: 100%;
  border: 0.5px solid #e2e8f0;
border-radius: 5px 0 0 5px;
  display: flex;
  align-items: center;
  box-shadow: inset 0px 4px 10px rgba(112, 112, 162, 0.08);
}

.search_input {
  outline: none;
  border: none;
}
</style>
