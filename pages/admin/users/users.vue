<template>
  <div>
    <div class="box-all">
      <div class="title-admin">
        <h4>Tizim foydalanuvchilari (jismoniy shaxs)</h4>
       <button class="btn-simple" to="/admin/home">
          <fa icon="file-excel" /> Excelga yuklash
        </button>
      </div>

      <div class="table" v-if="users != null">
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>ID raqami</th>
              <th>F.I.O</th>
              <th>Tu’gilgan sanasi</th>
              <th>Yashash manzili</th>
              <th>Ro’yhatdan o’tgan sanasi</th>
              <th>Telefon raqami</th>
              <th>Pasport raqami yoki ID karta seriyasi va raqami</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in users" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <nuxt-link
                  :to="{
                    name: 'admin-users-id___uz',
                    params: { id: item.uid },
                  }"
                >
                  {{ item.uid }}
                </nuxt-link>
              </td>
              <td>{{ item.full_name }}</td>

              <td>{{ item.brithday }}</td>
              <td>{{ item.address }}</td>
              <td>{{ dateFormat(item.created_at) }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.passport }}</td>
            </tr>
          </tbody>
        </table>

           <div class="pagination">
                    <pagination
                        :total-items="count"
                        :items-per-page="limit"
                        :page="page"
                        @page-change="setPage"
                    >
                    </pagination>
                </div>
         </div>
      
      </div>
      <!-- <div
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
                <th>ZeroX’dagi ID raqami</th>
                <th>Familyasi</th>
                <th>Ismi</th>
                <th>Sharifi</th>
                <th>Tu’gilgan sanasi</th>
                <th>Yashash manzili</th>
                <th>Ro’yhatdan o’tgan sanasi</th>
                <th>Telefon raqami</th>
                <th>Pasport raqami yoki ID karta seriyasi va raqami</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in users" :key="i">
                <td>{{ item.uid }}</td>
                <td>{{ item.last_name }}</td>
                <td>{{ item.first_name }}</td>
                <td>{{ item.middle_name }}</td>
                <td>{{ item.birthday }}</td>
                <td>{{ item.district }}</td>
                <td>{{ item.regdate }}</td>
                <td>{{ item.phone }}</td>
                <td>{{ item.passport }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> -->
   
   
  </div>
</template>

<script>
import dateformat from "dateformat";
import XLSX from "xlsx";
export default {
  // middleware: "checkRole",
  layout: "admin",
  data() {
    return {

      users: null,
      page: 0,
      count:0,
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

      async setPage(page) {

      this.page = page;

    this.getData();
      window.scrollTo(0, 0);
    },
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

   
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    async getData() {
      let users = await this.$axios.$get(
        `/dashboard/users/2?page=${this.page + 1}&limit=${this.limit}`
      );
      this.count = users.count;
      this.users = users.data;

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
