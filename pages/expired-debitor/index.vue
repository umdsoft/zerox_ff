<template>
  <div>
    <div class="bg-white my-12 rounded tableList " v-if="contracts !== null">
     <div class="flex justify-between text-xs lg:text-sm items-center px-2 py-3">
         <h2>{{$t('home.expiredD')}}</h2>
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
         <SearchComponent @searchData="searchData" :getContracts="getContracts" :url="`/contract/expired/search?type=debitor&page=${this.page + 1}&limit=${this.limit}`" />
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
              <td class="text-[#6E6893]">Summa</td>
          </th>
          <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">Shartnoma raqami</td>
          </th>
          <tr class="hover:bg-gray-100 cursor-pointer" v-if="contracts.length > 0" v-for="(item, index) in contracts" :key="item._id"  @click="$router.push({path:'/contract/debitor-detail',query:{
            id:item.id
          }})">
               <td>{{  page > 0 ? page + "" +  (index + 1):index + 1}}</td>
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
   
      <table class="table-auto hidden lg:inline">
        <thead>
             <th class="bg-[#F4F2FF]" style="" v-for="(item, index) in tableHeader" :key="index">
              <td class="text-[#6E6893]">{{item}}</td>
          </th>
        </thead>
        <tbody>
               <tr v-if="contracts.length > 0" v-for="(item, index) in contracts" :key="item._id">
             <td>{{  page > 0 ? page + "" +  (index + 1):index + 1}}</td>
              <td><nuxt-link :to="{path:'/user', query:{id:item.creditor_uid}}">{{item.creditor_name}}</nuxt-link></td>
              <td>{{item.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>
                <td>{{dateFormat(item.created_at)}}</td> 
            <td>{{ dateFormat(item.end_date)}}</td>

               <td>{{ item.inc.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>
                    
                 <td style="width:70px">{{ item.residual_amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>

              <td><nuxt-link :to="{path:'/pdf-generate', query:{id:item.id}}">{{item.number}}</nuxt-link></td>
            <td><nuxt-link :to="{path:'/debt-demand',query:{id: item.id}}">{{$t('action.a1')}} </nuxt-link></td>
            <td><nuxt-link :to="{
                path:'/debt-extend',
                query:{id: item.id}
            }">{{$t('action.a4')}} </nuxt-link></td>
            <td><nuxt-link :to="{path:'/debt-waiver',query:{id: item.id}}" >{{$t('action.a5')}} </nuxt-link></td>
          
          </tr>
        </tbody>
         
       
      </table>
       <div v-if="contracts.length == 0" class="text-center p-4">
          <p>{{$t('empty')}}</p>
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
                <th>Qarz berilgan sana</th>
                <th>Qarzning qaytarilish sanasi</th>
                <th>Qaytarilgan summa</th>
                <th>Qolgan summa</th>
                <th>Qarz shartnomasi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in contracts" :key="i">
                <td>{{ i+1 }}</td>
                <td>{{item.creditor_name}}</td>
                <td>{{item.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>
                <td>{{dateFormat(item.created_at)}} yil</td>
                <td>{{ dateFormat(item.end_date)}} yil</td>
                <td>{{ item.inc.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>
                <td>{{ item.residual_amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>
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
import SearchComponent from "../../components/SearchComponent.vue";
import Pagination from "../../components/Pagination.vue";
export default {
  middleware: "auth",
  components: {
    SearchComponent,
    Pagination,
  },
  async mounted() {
    this.getContracts();
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
          `/contract/expired?type=debitor&page=${this.page + 1}&limit=${
            this.limit
          }`
        );
        if (response.status == 200) {
          this.contracts = response.data.data;
          this.count = response.data.count;
          console.log(this.contracts);
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
        "Qarz berilgan sana",
        "Qarzning qaytarilish sanasi",
        "Qaytarilgan summa",
        "Qolgan summa",
        "Qarz shartnomasi",
        "Qarz qaytarishni talab qilish",
        "Qarz muddatini uzaytirish",
        "Qarzdan voz kechish",
      ],
      contracts: null,
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
