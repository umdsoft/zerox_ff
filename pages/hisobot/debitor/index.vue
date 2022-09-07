<template>
  <div>
    <div class="bg-white rounded tableList " v-if="contracts !== null">
        <div class="flex">
             <div class="flex justify-between text-xs lg:text-sm items-center px-2 py-3 w-full">
                  <h2 >Hisobot (debitor)</h2>
                  <div class="flex"> 
          <button
          @click="exportExcel()"
            class="
            bt
            ml-2
              text-white
              bg-t_primary
              text-center
              font-bold
              py-2
              rounded
              mr-0
            "
          >
          Excelga yuklash
          </button>
        <SearchComponent  @searchData="searchData" :getContracts="getContracts" :url="`/contract/report?type=debitor&page=${this.page + 1}&limit=${this.limit}`"/>
     </div> 
    </div> 
        </div>
           <table class="table-auto  w-full lg:hidden">
          <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">№</td>
          </th>
                  <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">Qarzdor nomi</td>
          </th>
                  <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">Qarz summasi</td>
          </th>
            <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">Qarz shartnomasi</td>
          </th>
          <tr class="hover:bg-gray-100 cursor-pointer" v-if="contracts.length > 0" v-for="(item, index) in contracts" :key="item.id"  @click="$router.push({path:'/hisobot/debitor/mobile-detail',query:{
            id:item.id
          }})">
              <td>{{index + 1}}</td>
              <td class="text-blue-500">{{item.creditor_name}}</td>
              <td>{{item.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>
          
            <td class="px-4 py-4">
            <nuxt-link
              class="text-blue-500"
              :to="{ path: '/pdf-generate', query: { id: item.id } }"
              >{{ item.number }}</nuxt-link
            >
          </td>
          </tr>
      </table>


        <div class="hidden lg:inline">
             <table class="table w-full">
          <th class="bg-[#F4F2FF]" style="" v-for="(item, index) in tableHeader" :key="index">
              <td class="text-[#6E6893]">{{item}}</td>
          </th>
          <tbody v-if="contracts.length > 0"> 

          <tr  v-for="(item, index) in contracts" :key="index">
              <td>{{index+1}}</td>
              <td><nuxt-link :to="{path:'/user', query:{id:item.creditor_uid}}">{{item.creditor_name}}</nuxt-link></td>
              <td>{{item.amount && item.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>
              <td>{{dateFormat(item.created_at)}} yil</td>
              <td><span v-if="item.status == 2">{{dateFormat(item.updated_at)}} yil</span><span v-if="item.status == 3">{{dateFormat(item.created_at)}}yil</span></td>

                <td>
                <span v-if="item.status == '2'">{{ item.inc && item.inc.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</span>
                      <span v-if="item.status == '3'">0 {{item.currency}}</span>
              </td>
              <td>
                 <span v-if="item.status == '2'">  {{item.vos_summa && item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</span>
                      <span v-if="item.status == '3'">0 {{item.currency}}</span>
              </td>
                       <td> <span class="text-green-500" v-if="item.status == '2'">Tugallangan</span>
                        <span class="text-red-500" v-if="item.status == '3'">Rad qilingan</span></td>
              <td><nuxt-link :to="{path:'/pdf-generate',query:{
                id:item.id
              }}">{{item.number}}</nuxt-link></td>
            
          
          </tr>
          </tbody>
      </table>
        </div>
   
       <div v-if="contracts.length == 0" class="text-center p-4">
          <p>Ma'lumot mavjud emas</p>
      </div>
          <Pagination :total="count"
                        :perPage="limit"
                         @page-change="setPage"
                        :page="page"   />
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
                <th>№</th>
                <th>Qarzdor nomi</th>
                <th>Qarz summasi</th>
                <th>Qarz olingan sana</th>
                <th>Tugallangan sana</th>
                <th>Qaytarilgan summa</th>
                <th>Voz kechilgan summa</th>
                <th>Holat</th>
                <th>Qarz shartnomasi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in contracts" :key="i">
                <td>{{ i+1 }}</td>
                <td>{{item.creditor_name}}</td>
                <td>{{item.amount && item.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>
                <td>{{dateFormat(item.created_at)}} yil</td>
              <td><span v-if="item.status == 2">{{dateFormat(item.updated_at)}} yil</span><span v-if="item.status == 3">{{dateFormat(item.created_at)}}yil</span></td>

              <td>
                <span v-if="item.status == '2'">{{ item.inc && item.inc.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</span>
                      <span v-if="item.status == '3'">0 {{item.currency}}</span>
              </td>
              <td>
                 <span v-if="item.status == '2'">  {{item.vos_summa && item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</span>
                      <span v-if="item.status == '3'">0 {{item.currency}}</span>
              </td>
                       <td>
                        <span class="text-green-500" v-if="item.status == '2'">Tugallangan</span>
                        <span class="text-red-500" v-if="item.status == '3'">Rad qilingan</span>
                       </td>
                      <td>{{item.number}}</td>
           
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  </div>
</template>

<script>
import SearchComponent from "../../../components/SearchComponent.vue";
import dateformat from "dateformat";
import XLSX from "xlsx";
import Pagination from "../../../components/Pagination.vue";
export default {
  middleware: "auth",
  created() {
    let links = [{ title: "Hisobot (debitor)", name: "hisobot-debitor" }];
    this.$store.commit("changeBreadCrumb", links);
  },
  async mounted() {
    this.getContracts();
  },
  components: {
    SearchComponent,
    Pagination,
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
    async setPage({ page, limit }) {
      this.page = page;
      this.limit = limit;
      this.getContracts();
      window.scrollTo(0, 0);
    },

    async getContracts() {
      try {
        const response = await this.$axios.get(
          `/contract/report?type=debitor&page=${this.page + 1}&limit=${
            this.limit
          }`
        );
        const exp = await this.$axios.get(
          `/contract/exp-report?type=debitor`
        );
        if (response.status == 200) {
          this.contracts = response.data.data;
          this.exportss = exp.data.data
          this.count = response.data.count;
        }
      } catch (e) {
        console.log(e);
      }
    },

    searchData(data) {
      this.contracts = data.data;
      this.count = data.count;
    },

    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
  },
  data() {
    return {
      page: 0,
      count: 0,
      limit: 10,
      tableHeader: [
        "№",
        "Qarzdor nomi",
        "Qarz summasi",
        "Qarz berilgan sana ",
        "Tugallangan sana",
        "Qaytarilgan summa",
        "Voz kechilgan summa",
        "Holat",
        "Hujjatlar",
      ],
      contracts: null,
      exportss: null
    };
  },
};
</script>

<style lang="scss" scoped>
.bt {
  width: 170px;
}
.tableList {
  table {
    th {
      background: #f4f2ff;
      padding: 10px 0;
      td {
        text-align: left;
        padding: 0 5px;
        font-weight: 600;
        font-size: 9px;
        line-height: 11px;
        letter-spacing: 0.05em;
        // text-transform: uppercase;
        color: #6e6893;
      }
    }
    tr {
      td {
        font-weight: 500;
        font-size: 11px;
        line-height: 13px;
        color: #25213b;
        padding: 10px;
        border-bottom: 1px solid #d9d5ec;
        a {
          color: #2670b7;
        }
      }
    }
  }
}
</style>
