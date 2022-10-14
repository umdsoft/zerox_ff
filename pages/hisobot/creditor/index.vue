<template>
  <div>
    <div class="bg-white rounded tableList " v-if="contracts !== null">
        <div class="flex">
             <div class="flex justify-between text-xs lg:text-sm items-center px-2 py-3 w-full">
                <h2 >Hisobot (kreditor)</h2>
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
          <div class="flex ml-3">
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.7167 10.6977H14.5359V9.06976H17.7167V10.6977ZM17.7167 11.6279H14.5359V13.2558H17.7167V11.6279ZM17.7167 3.95348H14.5359V5.58138H17.7167V3.95352V3.95348ZM17.7167 6.51162H14.5359V8.13951H17.7167V6.51162ZM17.7167 14.186H14.5359V15.814H17.7167V14.186V14.186ZM19.9136 17.3954C19.8228 17.8791 19.2548 17.8907 18.8753 17.907H11.8096V20H10.3987L0 18.1395V1.8628L10.4601 0H11.8096V1.85349H18.6323C19.0162 1.86976 19.4388 1.84185 19.7728 2.07672C20.0068 2.42091 19.9841 2.85814 20 3.25347L19.9909 15.3605C19.9796 16.0372 20.0522 16.7279 19.9136 17.3954V17.3954ZM8.33121 13.7465C7.70418 12.4442 7.06578 11.1512 6.44097 9.84882C7.05894 8.58138 7.66785 7.30931 8.27445 6.0372C7.75871 6.06279 7.24297 6.09534 6.72953 6.13256C6.34554 7.08836 5.89797 8.0186 5.59808 9.00698C5.31863 8.07442 4.94832 7.17672 4.6098 6.26743C4.10996 6.29534 3.61012 6.32557 3.11031 6.3558C3.63738 7.54654 4.19859 8.72089 4.70976 9.91859C4.10769 11.0814 3.54426 12.2605 2.96035 13.4302C3.45789 13.4512 3.95547 13.4721 4.45301 13.4791C4.80746 12.5535 5.2482 11.6628 5.55719 10.7186C5.83437 11.7326 6.30465 12.6698 6.6909 13.6395C7.23843 13.6791 7.78371 13.714 8.33125 13.7465H8.33121ZM18.9164 2.95798H11.8096V3.95348H13.6272V5.58138H11.8096V6.51162H13.6272V8.13951H11.8096V9.06976H13.6272V10.6977H11.8096V11.6279H13.6272V13.2558H11.8096V14.186H13.6272V15.814H11.8096V16.8894H18.9164V2.95798Z" fill="white"/>
</svg>

          <span class="ml-2">  Excelga yuklash</span></div>
          </button>
          <SearchComponent  @searchData="searchData" :getContracts="getContracts" :url="`/contract/report/search?type=creditor&page=${this.page + 1}&limit=${this.limit}`"/>
     </div> 
    </div> 

     
        </div>

    <table class="table-auto  w-full lg:hidden">
          <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">№</td>
          </th>
                  <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">Qarz bergan shaxs</td>
          </th>
                  <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">Qarz summasi</td>
          </th>
            <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">Shartnoma raqami</td>
          </th>
          <tr class="hover:bg-gray-100 cursor-pointer" v-if="contracts.length > 0" v-for="(item, index) in contracts" :key="item.id"  @click="$router.push({path:'/hisobot/creditor/mobile-detail',query:{
            id:item.id
          }})">
              <td>{{ page * limit + index + 1 }}</td>
              <td class="text-blue-500">{{item.debitor_name}}</td>
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
              <td>{{ page * limit + index + 1 }}</td>
              <td><nuxt-link :to="{path:'/user', query:{id: item.debitor_uid}}">{{item.debitor_name}}</nuxt-link></td>
              <td>{{item.amount && item.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>
              <td>{{dateFormat(item.created_at)}}</td>
              <td><span v-if="item.status == 2">{{dateFormat(item.updated_at)}}</span><span v-if="item.status == 3">{{dateFormat(item.created_at)}}</span></td>

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
              <td><nuxt-link :to="{path:'/pdf-generate',query:{
                id:item.id
              }}">{{item.number}}</nuxt-link></td>
            
          
          </tr>
          </tbody>
          <!-- <tfoot>
              <div class="w-full flex justify-end">   
                 <button>as</button>
                    
              </div>
          </tfoot> -->
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
                <th>Qarz bergan shaxs</th>
                <th>Valyuta</th>
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
              <tr v-for="(item, i) in exportss" :key="i">
                <td>{{ i+1 }}</td>
                <td>{{item.debitor_name}}</td>
                <td>
               
               {{item.currency}}
       </td>
                <td>{{item.amount && item.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}}</td>
                <td>{{dateFormat(item.created_at)}} yil</td>
              <td><span v-if="item.status == 2">{{dateFormat(item.updated_at)}}yil</span><span v-if="item.status == 3">{{dateFormat(item.created_at)}} yil</span></td>

              <td>
                <span v-if="item.status == '2'">{{ item.inc && item.inc.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}}</span>
                      <span v-if="item.status == '3'">0</span>
              </td>
         
              <td>
                 <span v-if="item.status == '2'">  {{item.vos_summa && item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}}</span>
                      <span v-if="item.status == '3'">0</span>
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
import dateformat from "dateformat";
import XLSX from "xlsx";
import SearchComponent from "../../../components/SearchComponent.vue";
export default {
  middleware: "auth",
  components: {
    SearchComponent,
  },
  created() {
    let links = [{ title: "Hisobot (kreditor)", name: "hisobot-creditor" }];
    this.$store.commit("changeBreadCrumb", links);
  },
  async mounted() {
    this.getContracts();
  },
  methods: {
    async exportExcel(type, fn, dl) {
      const date = new Date();
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
              ("Hisobot (kreditor)" +
                " " +
                date.toLocaleString().slice(0, 10) +
                "." || "SheetJSTableExport.") + (type || "xlsx")
          );
    },
    searchData(data) {
      this.contracts = data.data;
      this.count = data.count;
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
          `/contract/report?type=creditor&page=${this.page + 1}&limit=${
            this.limit
          }`
        );
        const exp = await this.$axios.get(`/contract/exp-report?type=creditor`);
        if (response.status == 200) {
          this.contracts = response.data.data;
          this.exportss = exp.data.data;
          this.count = this.count;
        }
      } catch (e) {
        console.log(e);
      }
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
      limit: 15,
      tableHeader: [
        "№",
        "Qarz bergan shaxs",
        "Qarz summasi",
        "Qarz olingan sana",
        "Tugallangan sana",
        "Qaytarilgan summa",
        "Voz kechilgan summa",
        "Holat",
        "Hujjatlar",
      ],
      contracts: null,
      exportss: null,
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
