<template>
  <div>
    <div class="box-all"  v-if="contract != null">
      <div class="title-admin">
        <h4>{{contract[0].creditor_name}}ning qarz olish tarixi</h4>
        <button @click="exportExcel('xls')" class="btn-simple" to="/admin/home">
          <fa icon="download" /> MS Excell variantda yuklab olish
        </button>
      </div>

      <div class="table">
        <table>
          <thead>
            <tr>
              <th>{{$t('debt_list.a11')}}</th>
              <th>{{$t('debt_list.debtber')}}</th>
              <th>{{$t('debt_list.a12')}}</th>
              <th>{{ $t('debt_list.debtsumm') }}</th>
              <th> {{$t('debt_list.dateee') }}</th>
              <th>{{ $t('debt_list.Status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(contract, index) in contract" :key="index">
               <td> <nuxt-link :to="{
                    name: 'admin-contracts-id___uz',
                    params: { id: contract.id },
              }">{{ contract.number }}</nuxt-link></td>
              <td>
                  {{ contract.debitor_name }}          
              </td>
              <td>{{contract.debitor_id}}</td>
              <!-- <td>{{contract.debitor_name }}  </std> -->
              <!-- <td>{{ contract.debitor.uid }}</td> -->
              <td>{{ contract.amount.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} {{contract.currency}}</td>
              <td>{{ dateFormat(contract.end_date)}}</td>
                <td style="text-align:center;"> 
                    <span class="badge badge-success" v-if="contract.status == 1">Tasdiqlangan</span>
                    <span class="badge badge-danger" v-if="contract.status == 2">{{ $t('home.Rejected') }}</span>
                    <span class="badge badge-secondary" v-if="contract.status == 0">Jarayonda</span>
                </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <!-- <pagination
            :total-items="10"
            :max-visible-pages="8"
            :items-per-page="limit"
            :page="page"
            @page-change="pageChange"
          >
          </pagination> -->
        </div>
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
                <th>{{$t('debt_list.a11')}}</th>
                <th>{{ $t('list.creditor') }}</th>
                <th>{{ $t('debt_list.a14') }}</th>
                <th>{{$t('debt_list.debtber')}}</th>
                <th>{{ $t('debt_list.a12') }}</th>
                <th>{{ $t('debt_list.debtsumm') }} (so???m)</th>
                <th> {{$t('debt_list.dateee') }}</th>
              </tr>
            </thead>
            <tbody>
                <tr v-for="(contract, index) in users" :key="index">
           <td>{{ contract.number }}</td>
              <td>
                  {{ contract.creditor.last_name }} {{ contract.creditor.first_name }} {{ contract.creditor.middle_name }}

              </td>
              <td>{{contract.creditor.uid}}</td>
              <td>{{contract.debitor.last_name }} {{ contract.debitor.first_name }} {{ contract.debitor.middle_name }}  </td>
              <td>{{ contract.debitor.uid }}</td>
              <td>{{ contract.amount.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}</td>
              <td>{{ dateFormat(contract.end_date)}}</td>
       
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
import dateformat from "dateformat";
export default {
  middleware: "checkRole",
  layout: "admin",
  data : () => ( 
     {
      length: 5,
      contract: null,
      page: 0,
      limit: 10,
      isModal: false,
      isEdit: false,
      isPassword: false,
      id: null,
      isDelete: false,
}),
  async mounted() {
    this.getContracts();
  },
  methods: {
        dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
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

    pageChange(page) {
      this.page = page;
      window.scrollTo(0, 0);
      //   this.getData();
    },

    async getContracts() {
      let contract = await this.$axios.$get(
        `/dashboard/contract/creditor/${this.$route.params.id}`);
      this.contract = contract.data
      console.log(this.contract)
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
