<template>
  <div>
    <div style="padding: 0 0 30px 0 ;" class="bg-white rounded tableList " v-if="contracts !== null">
      <div>
        <div class="flex justify-between text-xs lg:text-sm items-center px-2 py-3 w-full">
          <h2 style="padding:20px 0 0 20px;font-size: 14px;font-weight: bold; line-height: 140%;color: #37363C;">Hisobot
            (kreditor)</h2>
        </div>
        <div style="padding:20px" class="flex">
          <SearchComponent @searchData="searchData" :getContracts="getContracts"
            :url="`/contract/report/search?type=creditor&page=${this.page + 1}&limit=${this.limit}`" />
          <button style="border-radius: 10px;" class="
            bt
            ml-2
              text-white
              bg-t_primary
              text-center
              font-bold
              py-2
              mr-0
            ">
            <div style="justify-content: center;" class="flex ml-3">
              <svg width="18" height="18" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.8464 8H51.8464L31.8064 33.2L11.8464 8ZM0.846415 6.44C8.92642 16.8 23.8464 36 23.8464 36V60C23.8464 62.2 25.6464 64 27.8464 64H35.8464C38.0464 64 39.8464 62.2 39.8464 60V36C39.8464 36 54.7264 16.8 62.8064 6.44C64.8464 3.8 62.9664 0 59.6464 0H4.00642C0.686415 0 -1.19358 3.8 0.846415 6.44Z"
                  fill="#FFFFFF" />
              </svg>

              <span class="ml-2"> Saralash</span>
            </div>
          </button>
          <button style="background: #48BB78;border-radius: 10px;" @click="exportExcel()" class="
            bt
            ml-2
              text-white
              bg-t_primary
              text-center
              font-bold
              py-2
              rounded
              mr-0
            ">
            <div class="flex ml-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.7167 10.6977H14.5359V9.06976H17.7167V10.6977ZM17.7167 11.6279H14.5359V13.2558H17.7167V11.6279ZM17.7167 3.95348H14.5359V5.58138H17.7167V3.95352V3.95348ZM17.7167 6.51162H14.5359V8.13951H17.7167V6.51162ZM17.7167 14.186H14.5359V15.814H17.7167V14.186V14.186ZM19.9136 17.3954C19.8228 17.8791 19.2548 17.8907 18.8753 17.907H11.8096V20H10.3987L0 18.1395V1.8628L10.4601 0H11.8096V1.85349H18.6323C19.0162 1.86976 19.4388 1.84185 19.7728 2.07672C20.0068 2.42091 19.9841 2.85814 20 3.25347L19.9909 15.3605C19.9796 16.0372 20.0522 16.7279 19.9136 17.3954V17.3954ZM8.33121 13.7465C7.70418 12.4442 7.06578 11.1512 6.44097 9.84882C7.05894 8.58138 7.66785 7.30931 8.27445 6.0372C7.75871 6.06279 7.24297 6.09534 6.72953 6.13256C6.34554 7.08836 5.89797 8.0186 5.59808 9.00698C5.31863 8.07442 4.94832 7.17672 4.6098 6.26743C4.10996 6.29534 3.61012 6.32557 3.11031 6.3558C3.63738 7.54654 4.19859 8.72089 4.70976 9.91859C4.10769 11.0814 3.54426 12.2605 2.96035 13.4302C3.45789 13.4512 3.95547 13.4721 4.45301 13.4791C4.80746 12.5535 5.2482 11.6628 5.55719 10.7186C5.83437 11.7326 6.30465 12.6698 6.6909 13.6395C7.23843 13.6791 7.78371 13.714 8.33125 13.7465H8.33121ZM18.9164 2.95798H11.8096V3.95348H13.6272V5.58138H11.8096V6.51162H13.6272V8.13951H11.8096V9.06976H13.6272V10.6977H11.8096V11.6279H13.6272V13.2558H11.8096V14.186H13.6272V15.814H11.8096V16.8894H18.9164V2.95798Z"
                  fill="white" />
              </svg>

              <span class="ml-2"> Excelga yuklash</span>
            </div>
          </button>
        </div>

      </div>
      <table class="table w-full">
        <tbody v-if="contracts.length > 0">
          <div class="hisobot" v-for="(item, index) in contracts" :key="index">
            <div class="hisobot__body">
              <div class="greenCercle" v-if="item.status == '2'"></div>
              <div class="redCercle" v-if="item.status == '3'"></div>
              <div class="hisobot__name">
                <nuxt-link :to="{ path: '/user', query: { id: item.debitor_uid } }">{{ item.debitor_name }}
                </nuxt-link>
              </div>
              <div class="hisobot__date">
                <img src="@/assets/img/Date.png" alt="">
                <span>Qarz berilgan sana: {{ dateFormat(item.created_at) }}</span>
              </div>
              <div class="hisobot__pirce">
                <img src="@/assets/img/$.png" alt="">
                <span>Qarz miqdori: {{ item.amount && item.amount.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }} {{ item.currency }}</span>
              </div>
              <div class="hisobot__ids">
                <img src="@/assets/img/book.png" alt="">
                <span>
                  <nuxt-link :to="{
                    path: '/pdf-generate', query: {
                      id: item.id
                    }
                  }">{{ item.number }}</nuxt-link>
                </span>

              </div>
            </div>

          </div>
          <!-- <tr v-for="(item, index) in contracts" :key="index">
              <td>
                <div class="greenCercle" v-if="item.status == '2'"></div>
                <div class="redCercle" v-if="item.status == '3'"></div>
              </td>
              <td>
                <nuxt-link :to="{ path: '/user', query: { id: item.debitor_uid } }">{{ item.debitor_name }}</nuxt-link>
              </td>
              <td>
                <div style="display:flex;background: #F5F5F5;border-radius: 10px;"><img src="@/assets/img/Date.png" alt="">
                  {{ dateFormat(item.created_at) }}</div>

              </td>
              <td>{{ item.amount && item.amount.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              }} {{ item.currency }}</td>
              <td>
                <nuxt-link :to="{
                  path: '/pdf-generate', query: {
                    id: item.id
                  }
                }">{{ item.number }}</nuxt-link>
              </td>


            </tr> -->
        </tbody>

      </table>
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
          ("Hisobot (debitor)" +
            " " +
            date.toLocaleString().slice(0, 10) +
            "." || "SheetJSTableExport.") + (type || "xlsx")
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
          `/contract/report?type=debitor&page=${this.page + 1}&limit=${this.limit
          }`
        );
        const exp = await this.$axios.get(`/contract/exp-report?type=debitor`);
        if (response.status == 200) {
          this.contracts = response.data.data;
          this.exportss = exp.data.data;
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
      limit: 15,
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
      exportss: null,
    };
  },
};
</script>

<style lang="scss" scoped>
.bt {
  width: max-content;
  padding: 0 10px;
}

.greenCercle,
.redCercle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.greenCercle {
  background: #48BB78;
}

.redCercle {
  background: #FE5E58;
}

.hisobot {
  width: 95%;
  background: #FFFFFF;
  box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
  border-radius: 10px;
  margin: 10px auto;

  .hisobot__body {

    padding: 16px 17px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .hisobot__name {
      font-weight: 400;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: 1px;
      color: #2D3748;
    }

    .hisobot__date,
    .hisobot__pirce {
      display: flex;
      align-items: center;
      padding: 3px 6px;
      border-radius: 15px;

      background: #F5F5F5;
      border-radius: 10px;

      span {
        font-weight: 400;
        font-size: 12px;
        color: #37363C;
        margin: 0 0 0 10px;
      }
    }

    .hisobot__ids {
      display: flex;
      align-items: center;

      span {
        font-weight: 600;
        font-size: 12px;
        line-height: 15px;
        color: #3182CE;
        margin: 0 0 0 5px;
      }
    }
  }
}
</style>
