<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-end mb-6">
        <button
          @click.prevent="toggleFormModal('add', null)"
          class="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
        >
          <fa icon="plus" class="mr-2" /> Qo'shish
        </button>
      </div>
    </div>

    <div
      v-show="isFormModalActive"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        @click="toggleFormModal"
        class="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
        :class="{ 'opacity-100 visible': isFormModalActive }"
      ></div>

      <div
        class="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300"
        :class="{ 'scale-100 opacity-100': isFormModalActive, 'scale-95 opacity-0': !isFormModalActive }"
      >
        <h2 class="text-2xl font-semibold mb-6 text-gray-800">{{ method === 'add' ? 'Yangi versiya qo\'shish' : 'Versiyani tahrirlash' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="version-type" class="block text-gray-700 text-sm font-semibold mb-2">Tizim</label>
            <select
              id="version-type"
              v-model="version.type"
              class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="android">Android</option>
              <option value="ios">iOS</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="version-number" class="block text-gray-700 text-sm font-semibold mb-2">Ilova versiyasi</label>
            <input
              id="version-number"
              v-model="version.version"
              placeholder="Masalan: 1.0.0"
              class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
              type="text"
            />
          </div>

          <div class="mb-6">
            <label for="version-description" class="block text-gray-700 text-sm font-semibold mb-2">O'zgarishlar tavsifi</label>
            <textarea
              id="version-description"
              v-model="version.desc"
              placeholder="Yangilanishlar haqida qisqacha ma'lumot"
              class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 h-32 resize-y"
              required
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click.prevent="toggleFormModal"
              type="button"
              class="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
            >
              <fa icon="times" class="mr-2" /> Bekor qilish
            </button>
            <button
              type="submit"
              class="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
            >
              <fa :icon="method === 'add' ? 'plus' : 'save'" class="mr-2" /> {{ method === 'add' ? 'Qo\'shish' : 'Saqlash' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-show="isDeleteModalActive"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        @click="isDeleteModalActive = false"
        class="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
        :class="{ 'opacity-100 visible': isDeleteModalActive }"
      ></div>

      <div
        class="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center transform transition-all duration-300"
        :class="{ 'scale-100 opacity-100': isDeleteModalActive, 'scale-95 opacity-0': !isDeleteModalActive }"
      >
        <h5 class="text-xl font-semibold mb-6 text-gray-800">Ma'lumot o'chirilsinmi?</h5>
        <div class="flex justify-center space-x-3">
          <button
            @click.prevent="isDeleteModalActive = false"
            type="button"
            class="flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition duration-200"
          >
            <fa icon="times" class="mr-2" /> Yo'q
          </button>
          <button
            @click.prevent="executeDelete"
            type="button"
            class="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
          >
            <fa icon="check" class="mr-2" /> Ha
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden mt-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 border-collapse w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tizim</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ilova versiyasi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">O'zgarish</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="newsList.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">Ma'lumotlar topilmadi.</td>
            </tr>
            <tr v-for="(item, index) in newsList" :key="item.id || index" class="hover:bg-gray-100 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ page * limit + index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.version }}</td>
              <td class="px-6 py-4 max-w-xs truncate text-sm text-gray-900">{{ item.desc }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    class="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
                    @click="toggleFormModal('edit', item)"
                  >
                    <fa icon="pen" class="mr-1" /> O'zgartirish
                  </button>
                  <button
                    class="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
                    @click="confirmDelete(item.id)"
                  >
                    <fa icon="trash" class="mr-1" /> O'chirish
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="length > limit" class="p-4 bg-gray-50 flex justify-center">
        <pagination
          :total-items="length"
          :max-visible-pages="6"
          :items-per-page="limit"
          :page="page"
          @page-change="pageChange"
        >
        </pagination>
      </div>
    </div>
  </div>
</template>

<script>
import VueAdsPagination from "vue-ads-pagination";
import Swal from 'sweetalert2';

export default {
  middleware: ["auth", "checkRole"],
  layout: "admin",
  name: "AddNews",
  components: {
    pagination: VueAdsPagination,
  },
  data() {
    return {
      isDeleteModalActive: false,
      isFormModalActive: false,
      version: {
        type: "android",
        version: "",
        desc: "",
      },
      method: "add",
      editId: null,
      length: 0,
      page: 0,
      limit: 10,
      newsList: [],
    };
  },
  async created() {
    await this.getData();
  },
  methods: {
    confirmDelete(id) {
      this.editId = id;
      this.isDeleteModalActive = true;
    },

    async pageChange(page) {
      this.page = page;
      await this.getData();
    },

    async executeDelete() {
      try {
        await this.$axios.$delete(`version/${this.editId}`);
        Swal.fire('O\'chirildi!', 'Ma\'lumot muvaffaqiyatli o\'chirildi.', 'success');
        this.isDeleteModalActive = false;
        await this.getData();
      } catch (error) {
        console.error("Ma'lumot o'chirishda xato:", error);
        Swal.fire('Xatolik!', 'Ma\'lumotni o\'chirishda xato yuz berdi.', 'error');
      }
    },

    async getData() {
      try {
        const response = await this.$axios.$get(
          `version/for-admin?page=${this.page + 1}&limit=${this.limit}`
        );
        this.newsList = response.data;
        this.length = response.count;
      } catch (error) {
        console.error("Ma'lumotlarni olishda xato:", error);
        Swal.fire('Xatolik!', 'Ma\'lumotlarni yuklashda xato yuz berdi.', 'error');
        this.newsList = [];
        this.length = 0;
      }
    },

    async handleSubmit() {
      try {
        if (this.method === "add") {
          await this.$axios.$post("version/create", this.version);
          Swal.fire('Qo\'shildi!', 'Yangi versiya muvaffaqiyatli qo\'shildi.', 'success');
        } else if (this.method === "edit") {
          await this.$axios.$put(`version/${this.editId}`, this.version);
          Swal.fire('Yangilandi!', 'Versiya muvaffaqiyatli yangilandi.', 'success');
        }
        this.resetForm();
        this.toggleFormModal();
        await this.getData();
      } catch (error) {
        console.error("Ma'lumotni saqlashda xato:", error);
        Swal.fire('Xatolik!', 'Ma\'lumotni saqlashda xato yuz berdi.', 'error');
      }
    },

    resetForm() {
      this.version = {
        type: "android",
        version: "",
        desc: "",
      };
      this.editId = null;
    },

    toggleFormModal(mode = 'toggle', data = null) {
      if (mode === 'add') {
        this.method = 'add';
        this.resetForm();
        this.isFormModalActive = true;
      } else if (mode === 'edit' && data) {
        this.method = 'edit';
        this.editId = data.id;
        this.version = { ...data };
        this.isFormModalActive = true;
      } else {
        this.isFormModalActive = !this.isFormModalActive;
        if (!this.isFormModalActive) {
          this.resetForm();
        }
      }
    },
  },
};
</script>
