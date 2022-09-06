<template>
  <div>
    <div class="bg-white rounded tableList " v-if="contracts !== null">
  
       <div class="flex justify-between text-xs lg:text-sm items-center px-2 py-3">
            <h2>Muddati oz qolgan (kreditor)</h2>
        <SearchComponent  @searchData="searchData" :getContracts="getContracts" :url="`/contract/near/search?type=creditor&page=${this.page + 1}&limit=${this.limit}`" />
     </div> 
     
        <table class="table-auto  w-full lg:hidden">
          <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">№</td>
          </th>
                  <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">Qarz bergan shaxs</td>
          </th>
                  <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">Summa</td>
          </th>
             <th class="bg-[#F4F2FF]" style="" >
              <td class="text-[#6E6893]">Shartnoma raqami</td>
          </th>
          <tr class="hover:bg-gray-100 cursor-pointer" v-if="contracts.length > 0" v-for="(item, index) in contracts" :key="item.id"  @click="$router.push({path:'/contract/creditor-detail',query:{
            id:item.id
          }})">
                 <td>{{  page > 0 ? page + "" +  (index + 1):index + 1}}</td>
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

   
      <table class="table-auto hidden lg:inline">
        <thead>
           <th class="bg-[#F4F2FF]" style="" v-for="(item, index) in tableHeader" :key="index">
              <td class="text-[#6E6893]">{{item}}</td>
          </th>
        </thead>
        <tbody>
              <tr v-if="contracts.length > 0" v-for="(item, index) in contracts" :key="item._id">
                   <td>{{  page > 0 ? page + "" +  (index + 1):index + 1}}</td>
              <td><nuxt-link :to="{path:'/user', query:{id:item.debitor_uid}}">{{item.debitor_name}}</nuxt-link></td>
              <td>{{item.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>
              <td>{{dateFormat(item.created_at)}}</td>
              <!-- {{item}} -->
              <td>{{dateFormat(item.end_date)}}</td>
                 <td>{{item.refundable_amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</td>
                        <td style="width:70px">{{ item.residual_amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} {{item.currency}}</td>
              <td><nuxt-link :to="{path:'/pdf-generate', query:{id:item.id}}">{{item.number}}</nuxt-link></td>
  <td><nuxt-link :to="{path:'/debt-extend/ask',query:{
                id:item.id
            }}">Qarz muddatini uzaytirishni so‘rash </nuxt-link></td>
        
                      <td><nuxt-link :to="{path:'/debt-refund',query:{
                id:item.id
            }}">Qarzni qaytarish </nuxt-link></td>
          </tr>
        </tbody>
         
      
      </table>
       <div v-if="contracts.length == 0" class="text-center p-4">
          <p>Ma'lumot mavjud emas</p>
      </div>

       <Pagination :total="count"
                        :perPage="limit"
                         @page-change="setPage"
                        :page="page"   />
    </div>
  </div>
</template>

<script>
import path from "path";
import dateformat from "dateformat";
import Pagination from "../../components/Pagination.vue";
export default {
   middleware:'auth',
  async mounted() {
    this.getContracts();
  },
  methods: {
    async getContracts() {
      try {
        const response = await this.$axios.get(
          `/contract/near?type=creditor&page=${this.page + 1}&limit=${
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
    async setPage({ page, limit }) {
      this.page = page;
      this.limit = limit;
      this.getContracts();
      window.scrollTo(0, 0);
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
      limit: 10,
      count: 0,
      tableHeader: [
        "№",
        "Qarz bergan shaxs",
        "Qarz summasi",
        "Qarz berilgan sana",
        "Qarzning qaytarilish sanasi",
        "Qaytarilgan summa",
        "Qolgan summa",
        "Qarz shartnomasi",
        "Qarz muddatini uzaytirishni so‘rash",
        "Qarzni qaytarish",
      ],
      contracts: null,
    };
  },
  components: { Pagination },
};
</script>

<style lang="scss" scoped>
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
