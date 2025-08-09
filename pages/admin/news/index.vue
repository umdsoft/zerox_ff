<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto p-4">
      <button @click="openModal('add')" class="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
        <i class="fas fa-plus mr-2"></i> Yangilik qo'shish
      </button>

      <div class="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="table-header">№</th>
              <th class="table-header">Mavzu</th>
              <th class="table-header max-w-xs">Yangilik</th>
              <th class="table-header">Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in newsList" :key="item.id" class="border-t">
              <td class="table-cell">{{ page * limit + index + 1 }}</td>
              <td class="table-cell">{{ item.title }}</td>
             
              <td class="table-cell">
                <div class="flex space-x-2">
                  <button @click="openModal('edit', item)" class="btn-edit">
                    O'zgartirish
                  </button>
                  <button @click="confirmDelete(item.id)" class="btn-delete">
                    O'chirish
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4" v-if="length > limit">
        <pagination :total-items="length" :items-per-page="limit" :page="page" @page-change="pageChange" />
      </div>
    </div>

    <div v-if="deleteModal" class="fixed inset-0 bg-black bg-opacity-30 z-40" @click="deleteModal = false"></div>
    <div v-if="deleteModal" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto bg-white rounded-lg shadow-lg p-6 z-50">
      <h5 class="text-lg font-semibold mb-4">Rostdan ham o'chirmoqchimisiz?</h5>
      <div class="flex justify-end space-x-4">
        <button @click="deleteModal = false" type="button" class="btn-secondary">Yo'q</button>
        <button @click="deleteRequest" type="button" class="btn-primary">Ha</button>
      </div>
    </div>

    <NewsFormModal
      :show="isModalActive"
      :mode="modalMode"
      :initial-data="selectedNewsItem"
      @close="closeModal"
      @form-submitted="onFormSubmitted"
    />
  </div>
</template>

<script>
import VueAdsPagination from "vue-ads-pagination";
import NewsFormModal from '~/components/NewsFormModal.vue'; // Komponentni import qilish

export default {
  middleware: ["auth", "checkRole"],
  layout: "admin",
  components: {
    pagination: VueAdsPagination,
    NewsFormModal, // Komponentni ro'yxatga olish
  },
  data() {
    return {
      // Modal uchun holatlar
      isModalActive: false,
      modalMode: 'add', // 'add' yoki 'edit'
      selectedNewsItem: null,

      // O'chirish uchun modal
      deleteModal: false,
      deleteId: null,

      // Jadval va pagination uchun ma'lumotlar
      newsList: [],
      length: 1,
      page: 0,
      limit: 10,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // Ma'lumotlarni serverdan olish
    async fetchData() {
      try {
        const { data, count } = await this.$axios.$get(`news/for-admin?page=${this.page + 1}&limit=${this.limit}`);
        this.newsList = data;
        this.length = count;
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    },
    // Sahifani o'zgartirish
    pageChange(page) {
      this.page = page;
      this.fetchData();
    },
    // Modalni ochish
    openModal(mode, newsItem = null) {
      this.modalMode = mode;
      this.selectedNewsItem = newsItem ? { ...newsItem } : null;
      this.isModalActive = true;
    },
    // Modalni yopish
    closeModal() {
      this.isModalActive = false;
      this.selectedNewsItem = null;
    },
    // Forma jo'natilgandan so'ng...
    onFormSubmitted() {
      this.fetchData(); // Jadvalni yangilash
      this.closeModal(); // Modalni yopish
    },
    // O'chirishni tasdiqlash oynasini ochish
    confirmDelete(id) {
      this.deleteId = id;
      this.deleteModal = true;
    },
    // O'chirish so'rovini jo'natish
    async deleteRequest() {
      try {
        await this.$axios.$delete(`news/${this.deleteId}`);
        this.deleteModal = false;
        this.fetchData(); // Jadvalni yangilash
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    },
  },
};
</script>

<style>
/* Qulaylik uchun stillarni bu yerga ham qo'shdim */
.table-header { @apply px-4 py-2 text-left text-sm font-medium text-gray-600; }
.table-cell { @apply px-4 py-2; }
.btn-edit { @apply bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition duration-200; }
.btn-delete { @apply bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition duration-200; }
.btn-primary { @apply bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200; }
.btn-secondary { @apply bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200; }
</style>