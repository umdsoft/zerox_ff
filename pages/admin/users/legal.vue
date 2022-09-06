<template>
  <div>
    <div class="box-all">
      <div class="title-admin">
        <h4>Tizim foydalanuvchilari (yuridik shaxs)</h4>
        <button class="btn-simple" to="/admin/home">
          <fa icon="file-excel" /> Excelga yuklash
        </button>
      </div>

      <div class="table">
        <table>
          <thead>
            <tr>
              <th>ID raqami</th>
              <th>Yuridik shaxs nomi</th>
              <th>STIR raqami</th>
              <th>Faoliyat ko'rsatish manzili</th>
              <!-- <th>Ro’yhatdan o’tgan sanasi</th> -->
              <th>Telefon raqami</th>
              <th>Direktor</th>
              <th>Tizimda ro'yhatdan o'tgan vaqti</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in users" :key="index">
              <td>
                <nuxt-link
                  :to="{
                    name: 'admin-users-id___uz',
                    params: { id: item.uid },
                  }"
                  >{{ item.uid }}</nuxt-link
                >
              </td>
              <td>{{ item.company }}</td>
              <td>{{ item.stir }}</td>
              <td>{{ item.legal_address }}</td>
              <!-- <td>{{ item.created_at }}</td> -->
              <td>{{ item.phone }}</td>
              <td>{{ item.director }}</td>
              <td>{{ dateFormat(item.created_at) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <pagination
            :total-items="count"
            :max-visible-pages="10"
            :items-per-page="limit"
            :page="page"
            @page-change="setPage"
          >
          </pagination>
        </div>
        <div
          slot="pdf-content"
          ref="tableToExcel"
          class="tableToExcel"
          style="padding: 2rem"
        >
          <div style="display: block" class="table-responsive uns">
            <table
              ref="exportable_table"
              class="table table-centered table-nowrap mt-4"
            >
              <thead class="table-light">
                <tr>
                  <th>ID raqami</th>
                  <th>Yuridik shaxs nomi</th>
                  <th>STIR raqami</th>
                  <th>Faoliyat ko'rsatish manzili</th>
                  <th>Ro’yhatdan o’tgan sanasi</th>
                  <th>Telefon raqami</th>
                  <th>Direktor</th>
                  <th>Tizimda ro'yhatdan o'tgan vaqti</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <!-- <td>{{ item.uid }}</td>
                  <td>{{ item.last_name }}</td>
                  <td>{{ item.first_name }}</td>
                  <td>{{ item.middle_name }}</td>
                  <td>{{ item.birthday }}</td>
                  <td>{{ item.district }}</td>
                  <td>{{ item.regdate }}</td>
                  <td>{{ item.phone }}</td>
                  <td>{{ item.passport }}</td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
import XLSX from "xlsx";
export default {
  middleware: "checkRole",
  layout: "admin",
  data() {
    return {
      count: 0,
      users: null,
      page: 0,
      length: 45,
      limit: 10,
      isModal: false,
      isEdit: false,
      isPassword: false,
      id: null,
      isDelete: false,
    };
  },
  async mounted() {
    this.getData();
  },
  methods: {
    async exportExcel(type, fn, dl) {
      var elt = await this.$refs.tableToExcel;
      var wb = XLSX.utils.table_to_book(elt, { sheet: "Sheet JS" });
      return dl
        ? XLSX.write(wb, {
            bookType: type,
            bookSST: true,
            type: "base64",
          })
        : XLSX.writeFile(
            wb,
            fn ||
              ("excelFile" + "." || "SheetJSTableExport.") + (type || "xlsx")
          );
    },

    setPage(page) {
      this.page = page;
      window.scrollTo(0, 0);
       this.getData();
    },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    async getData() {
      let users = await this.$axios.$get(`/dashboard/users/1?page=${this.page + 1}&limit=${this.limit}`);
      this.users = users.data;
      console.log(this.users);
    },
  },
};
</script>

<style lang="scss">
.fix-vh {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba($color: #000000, $alpha: 0.6);
  z-index: 98;
}
</style>
