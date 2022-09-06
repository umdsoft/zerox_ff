<template>
  <div>
    <div class="box-all">
      <div class="title-admin">
        <h4>Qarz shartnomalari</h4>
        <button class="btn-simple" to="/admin/home">
         Excelga yuklash
        </button>
      </div>

      <div class="table" v-if="contracts != null">
        <table>
          <thead>
            <tr>
              <th>Qarz shartnomasi raqami</th>
              <th>Qarz beruvchi</th>
              <th>Qarz beruvchining ID raqami</th>
              <th>Qarz oluvchi</th>
              <th>Qarz oluvchining ID raqami</th>
              <th>Qarz summasi</th>
              <th>Qarzni qaytarish sanasi</th>
              <th>Holat</th>
            </tr>
          </thead>
          <tbody>
            
            <tr v-for="(item, index) in contracts" :key="index">
            
            <td>
                <nuxt-link :to="{name:'admin-contracts-id___uz' , params:{id: item.id}}">{{ item.number }}</nuxt-link>
              </td>
              <td>{{ item.debitor_name }}</td>
              <td><nuxt-link :to="{name:'admin-users-id___uz' , params:{id: item.debitor_id}}">{{ item.debitor_id }}</nuxt-link></td>
              <td>{{ item.creditor_name }}</td>
              <td><nuxt-link :to="{name:'admin-users-id___uz' , params:{id: item.creditor_id}}">{{ item.creditor_id }}</nuxt-link></td>
              <td>
                {{
                  item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                {{ item.currency }}
              </td>
              <td>{{ dateFormat(item.end_date) }}</td>
               <td style="text-align:center;"> 
                    <span class="badge badge-primary" v-if="item.status == 1">Jarayonda</span>
                    <span class="badge badge-success" v-if="item.status == 2">Tugallangan</span>
                    <span class="badge badge-danger" v-if="item.status == 3">Rad qilingan</span>
                    <span class="badge badge-secondary" v-if="item.status == 0">Tasdiqlanmagan</span>
                </td>
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
      </div>
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
      // middleware: "checkRole",
  layout: "admin",
  data() {
    return {
      contracts: null,
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

    this.getContracts()
  },
  
  methods: {
    async setPage(page) {
      this.page = page;
      this.getContracts();
      window.scrollTo(0, 0);
    },

   async getContracts () {
 
    const { data } = await this.$axios.get(`/dashboard/contracts?page=${this.page + 1}&limit=${this.limit}`);
    console.log(data)
    this.contracts = data.data;
    this.count = data.count
    console.log("contract", this.contracts);
    },

    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
  },
};
</script>

<style lang="scss">
.table {
  width: 100% !important;
}
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
