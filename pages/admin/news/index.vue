<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto p-4">
      <button @click.prevent="isActiveNewsform('add', null)"
        class="inline-flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
        <i class="fas fa-plus mr-2"></i> Yangilik qo'shish
      </button>

      <!-- Modal Dark Area for News Form -->
      <div @click="isActiveNewsform" class="fixed inset-0 bg-black bg-opacity-30 z-10 transition-opacity duration-300"
        :class="{ 'opacity-100 visible': NewsformActive, 'opacity-0 invisible': !NewsformActive }"></div>

      <!-- News Form Modal -->
      <div
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 bg-white rounded-lg shadow-lg p-6 z-20 transition-all duration-300"
        :class="{ 'opacity-100 visible scale-100': NewsformActive, 'opacity-0 invisible scale-95': !NewsformActive }">
        <form @submit.prevent="addData" class="space-y-4">
          <select v-model="news.lang"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="uz">O'zbek (lotin)</option>
            <option value="ru">Ruscha</option>
            <option value="kr">O'zbek (kirill)</option>
          </select>
          <input v-model="news.title" placeholder="Mavzu" type="text"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input v-model="news.youtube" placeholder="YouTube video link" type="text"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input type="file" accept="image/*" @change="handleImageUpload"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <textarea v-model="news.description" placeholder="Yangilik mazmuni"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 h-32 resize-y" />

          <div class="flex justify-end space-x-4 mt-4">
            <button @click.prevent="isActiveNewsform" type="button"
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200">
              Yopish
            </button>
            <button type="submit"
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
              Qo'shish
            </button>
          </div>
        </form>
      </div>

      <!-- Modal Dark Area for Delete Confirmation -->
      <div @click="deleteModal = false"
        class="fixed inset-0 bg-black bg-opacity-30 z-10 transition-opacity duration-300"
        :class="{ 'opacity-100 visible': deleteModal, 'opacity-0 invisible': !deleteModal }"></div>

      <!-- Delete Confirmation Modal -->
      <div
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 bg-white rounded-lg shadow-lg p-6 z-20 transition-all duration-300"
        :class="{ 'opacity-100 visible scale-100': deleteModal, 'opacity-0 invisible scale-95': !deleteModal }">
        <form class="space-y-4">
          <h5 class="text-lg font-semibold">Ma'lumot o'chirilsinmi?</h5>
          <div class="flex justify-end space-x-4">
            <button @click.prevent="deleteModal = false" type="button"
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200">
              Yo'q
            </button>
            <button @click="deleteRequest" type="button"
              class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
              Ha
            </button>
          </div>
        </form>
      </div>

      <!-- Table -->
      <div class="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">№</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Mavzu</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Yangilik</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Til</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in newsList" :key="index" class="border-t">
              <td class="px-4 py-2">{{ page * limit + index + 1 }}</td>
              <td class="px-4 py-2">{{ item.title }}</td>
              <td class="px-4 py-2 max-w-xs truncate">{{ item.description }}</td>
              <td class="px-4 py-2">{{ item.lang }}</td>
              <td class="px-4 py-2">
                <div class="flex space-x-2">
                  <button @click="isActiveNewsform('edit', item.id, item)"
                    class="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition duration-200">
                    O'zgartirish
                  </button>
                  <button @click="deleteData(item.id)"
                    class="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition duration-200">
                    O'chirish
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4">
        <pagination :total-items="length" :max-visible-pages="6" :items-per-page="limit" :page="page"
          @page-change="pageChange"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import VueAdsPagination from "vue-ads-pagination";
import FormData from 'form-data';

export default {
  middleware: ["auth", "checkRole"],
  layout: "admin",
  name: "AddNews",
  components: {
    pagination: VueAdsPagination,
  },
  data() {
    return {
      deleteModal: false,
      NewsformActive: false,
      news: {
        lang: "uz",
        title: "",
        description: "",
        youtube: "",
        img: null,
      },
      method: "add",
      editId: null,
      length: 1,
      page: 0,
      limit: 10,
      newsList: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleImageUpload(event) {
      this.news.img = event.target.files[0] || null;
    },
    deleteData(id) {
      this.deleteModal = true;
      this.editId = id;
    },
    pageChange(page) {
      this.page = page;
      this.fetchData();
    },
    async fetchData() {
      try {
        const { data, count } = await this.$axios.$get(`news/for-admin?page=${this.page + 1}&limit=${this.limit}`);
        this.newsList = data;
        this.length = count;
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    },
    async deleteRequest() {
      try {
        await this.$axios.$delete(`news/${this.editId}`);
        this.deleteModal = false;
        await this.fetchData();
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    },
    async addData() {
      const formData = new FormData();
      Object.entries(this.news).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });

      try {
        if (this.method === "add") {
          await this.$axios.$post("news/create", formData);
        } else if (this.method === "edit") {
          await this.$axios.$put(`news/${this.editId}`, formData);
        }
        this.NewsformActive = false;
        this.resetForm();
        await this.fetchData();
      } catch (error) {
        console.error(`Error ${this.method}ing news:`, error);
      }
    },
    isActiveNewsform(method, id, data) {
      if (data) {
        this.editId = id;
        this.news = {
          ...this.news,
          title: data.title || "",
          description: data.description || "",
          lang: data.lang || "uz",
          youtube: data.youtube || "",
        };
      }
      this.method = method;
      this.NewsformActive = !this.NewsformActive;
    },
    resetForm() {
      this.news = {
        lang: "uz",
        title: "",
        description: "",
        youtube: "",
        img: null,
      };
    },
  },
};
</script>

<style>
/* No additional CSS needed; all styling is handled by Tailwind */
</style>