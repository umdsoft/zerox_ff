<template>
  <div class="rounded-xl">
    <Sure :isAdmin="isAdmin" @yes="yes" @cancel="cancel" />

    <div class="container rounded-xl">
      <div v-if="user != null"
           class="grid gap-6 lg:grid-cols-12 px-4 py-6">

        <!-- LEFT CARD -->
        <aside class="lg:col-span-4 bg-white rounded-xl shadow p-6">
          <div class="flex flex-col items-center text-center">
            <!-- Avatar -->
            <div class="w-50 h-45 rounded-xl overflow-hidden ring-1 ring-gray-200">
              <img v-if="user.image == null"
                   src="@/assets/img/no-avatar.png"
                   alt="avatar"
                   class="w-full h-full object-cover" />
              <img v-else
                   :src="`https://app.zerox.uz/${user.image}`"
                   alt="avatar"
                   class="w-full h-full object-cover" />
            </div>

            <!-- Fullname -->
            <span class="mt-4 font-semibold leading-snug px-2">
              {{ user.last_name }} {{ user.first_name }} {{ user.middle_name }}
            </span>
          </div>

          <!-- ID -->
          <div class="mt-6 border-t pt-4">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">{{ $t('transfer.id') }}</p>
              <p class="text-sm text-blue-500 font-medium">{{ user.uid }}</p>
            </div>
          </div>

          <!-- Balance -->
          <div class="mt-4 border-t pt-4">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600">Mobil hisobidagi mablag’i</p>
              <span class="text-sm font-bold">
                {{ user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }} UZS
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 space-y-3">
            <nuxt-link
              :to="{ name: 'admin-users-give-debt-history-id___uz', params: { id: user.uid } }"
              class="block w-full text-white text-sm text-center bg-blue-400 hover:bg-blue-500 rounded py-2">
              Qarz shartnomalari
            </nuxt-link>

            <nuxt-link
              :to="{ name: 'admin-users-archive-id___uz', params: { id: user.id } }"
              class="block w-full text-white text-sm text-center bg-blue-400 hover:bg-blue-500 rounded py-2">
              Kirishlar arxivi
            </nuxt-link>

            <a :href="link" class="block w-full">
              <button class="w-full bg-blue-400 hover:bg-blue-500 text-white text-sm rounded py-2">
                Tasdiqlangan ommaviy ofertani yuklab olish
              </button>
            </a>
          </div>
        </aside>

        <!-- RIGHT DETAILS -->
        <section class="lg:col-span-8 bg-white rounded-xl shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="table-auto w-full border-collapse">
              <tbody v-if="user.type == 2">
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 w-1/3 text-gray-600">Familiya</td>
                  <td class="px-4 py-3">{{ user.last_name }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Ismi</td>
                  <td class="px-4 py-3">{{ user.first_name }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Sharifi</td>
                  <td class="px-4 py-3">{{ user.middle_name }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Tug'ilgan sanasi</td>
                  <td class="px-4 py-3">{{ user.brithday }} yil</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Jinsi</td>
                  <td class="px-4 py-3">
                    <p v-if="user.gender == 1">Erkak</p>
                    <p v-if="user.gender == 2">Ayol</p>
                  </td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Tel raqami</td>
                  <td class="px-4 py-3">{{ user.phone }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Elektron pochta manzili</td>
                  <td class="px-4 py-3">-</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Viloyat</td>
                  <td class="px-4 py-3">{{ user.region }}, {{ user.district }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Yashash manzili</td>
                  <td class="px-4 py-3">{{ user.address }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Oferta tasdiqlangan sana</td>
                  <td class="px-4 py-3">
                    <span v-if="user.contract_date != null">
                      {{ dateFormat(user.contract_date) }}
                      <span v-if="user.con_time != null">{{ user.con_time.slice(0, 5) }}</span>
                    </span>
                  </td>
                </tr>
                <tr class="border-b border-gray-200 align-top">
                  <td class="px-4 py-3 text-gray-600">Pasport ma'lumoti</td>
                  <td class="px-4 py-3 space-y-1">
                    <div><b>Pasport seriasi:</b> {{ user.passport }}</div>
                    <div><b>Kim tomonidan berilgan:</b> {{ user.issued_by }}</div>
                    <div><b>Berilgan vaqti:</b> {{ dateFormat(user.issued_date) }} yil</div>
                    <div><b>Amal qilish muddati:</b> {{ dateFormat(user.expiry_date) }} yil</div>
                  </td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-gray-600">Status</td>
                  <td class="px-4 py-3">{{ user.rating }}</td>
                </tr>
              </tbody>

              <tbody v-if="user.type == 1">
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 w-1/3 text-gray-600">Korxona nomi</td>
                  <td class="px-4 py-3">{{ user.company }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Rahbar</td>
                  <td class="px-4 py-3">{{ user.director }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">STIR</td>
                  <td class="px-4 py-3">{{ user.stir }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Tel raqami</td>
                  <td class="px-4 py-3">{{ user.phone }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Elektron pochta manzili</td>
                  <td class="px-4 py-3">-</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="px-4 py-3 text-gray-600">Yuridik manzili</td>
                  <td class="px-4 py-3">{{ user.address }}</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 text-gray-600">Status</td>
                  <td class="px-4 py-3">{{ user.rating }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>


<script>
import dateformat from "dateformat";
export default {
  middleware: ["auth", "checkRole"],
  layout: "admin",
  data() {
    return {
      user: null,
      link: null,
      isAdmin: false,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    cancel() {
      this.isAdmin = false;
    },
    yes() {},
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },

    async getData() {
      let user = await this.$axios.$get(
        `/user/admin/user/${this.$route.params.id}`
      );
      this.link = `https://pdf.zerox.uz/oferta.php?id=${user.data.uid}&download=1`;
      this.user = user.data;
    },
  },
};
</script>

<style>
.jad tr {
  display: flex;
  align-items: center;
  padding: 5px;
  border: 1px solid #8692a6;
  border-radius: 5px;
  padding-left: 15px;
  width: 320px;
  height: 64px;
  margin: 0;
}
</style>
