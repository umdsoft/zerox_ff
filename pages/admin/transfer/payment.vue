<template>
  <div>
    <div class="box-all">
      <div class="title-admin">
        <h4>Tushgan mablag’lar</h4>
        <!-- <button class="btn-simple" to="/admin/home">
           Excelga yuklash
          </button> -->
        <div class="title-admin-btns">
          <button @click="exportExcel()" class="btn-simple">
            <div class="flex items-center">
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.7167 10.6977H14.5359V9.06976H17.7167V10.6977ZM17.7167 11.6279H14.5359V13.2558H17.7167V11.6279ZM17.7167 3.95348H14.5359V5.58138H17.7167V3.95352V3.95348ZM17.7167 6.51162H14.5359V8.13951H17.7167V6.51162ZM17.7167 14.186H14.5359V15.814H17.7167V14.186V14.186ZM19.9136 17.3954C19.8228 17.8791 19.2548 17.8907 18.8753 17.907H11.8096V20H10.3987L0 18.1395V1.8628L10.4601 0H11.8096V1.85349H18.6323C19.0162 1.86976 19.4388 1.84185 19.7728 2.07672C20.0068 2.42091 19.9841 2.85814 20 3.25347L19.9909 15.3605C19.9796 16.0372 20.0522 16.7279 19.9136 17.3954V17.3954ZM8.33121 13.7465C7.70418 12.4442 7.06578 11.1512 6.44097 9.84882C7.05894 8.58138 7.66785 7.30931 8.27445 6.0372C7.75871 6.06279 7.24297 6.09534 6.72953 6.13256C6.34554 7.08836 5.89797 8.0186 5.59808 9.00698C5.31863 8.07442 4.94832 7.17672 4.6098 6.26743C4.10996 6.29534 3.61012 6.32557 3.11031 6.3558C3.63738 7.54654 4.19859 8.72089 4.70976 9.91859C4.10769 11.0814 3.54426 12.2605 2.96035 13.4302C3.45789 13.4512 3.95547 13.4721 4.45301 13.4791C4.80746 12.5535 5.2482 11.6628 5.55719 10.7186C5.83437 11.7326 6.30465 12.6698 6.6909 13.6395C7.23843 13.6791 7.78371 13.714 8.33125 13.7465H8.33121ZM18.9164 2.95798H11.8096V3.95348H13.6272V5.58138H11.8096V6.51162H13.6272V8.13951H11.8096V9.06976H13.6272V10.6977H11.8096V11.6279H13.6272V13.2558H11.8096V14.186H13.6272V15.814H11.8096V16.8894H18.9164V2.95798Z"
                  fill="white" />
              </svg>

              <span class="ml-1"> {{ $t('debt_list.Upload') }}</span>
            </div>
          </button>
          <!-- <button
              @click="isActivFilterMenu"
              class="bt ml-2 text-white bg-t_primary text-center font-bold py-2 rounded mr-0"
            >
              <div class="flex ml-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8464 8H51.8464L31.8064 33.2L11.8464 8ZM0.846415 6.44C8.92642 16.8 23.8464 36 23.8464 36V60C23.8464 62.2 25.6464 64 27.8464 64H35.8464C38.0464 64 39.8464 62.2 39.8464 60V36C39.8464 36 54.7264 16.8 62.8064 6.44C64.8464 3.8 62.9664 0 59.6464 0H4.00642C0.686415 0 -1.19358 3.8 0.846415 6.44Z"
                    fill="white"
                  />
                </svg>
                <span class="mx-2"> Filter </span>
              </div>
            </button> -->
        </div>
      </div>

      <div class="table" v-if="contracts != null">
        <table>
          <thead>
            <tr>
              <th style="text-align: center;" class="w-20">Foydalanuvchi ID raqami</th>
              <th style="text-align: center;" class="w-90">Foydalanuvchi</th>
              <th style="text-align: center;" class="w-20">To'lov tizimi</th>
              <th style="text-align: center;">To'lov summasi</th>
              <th style="text-align: center;">To'lov sanasi</th>
              <th style="text-align: center;">To'lov vaqti</th>
              <th style="text-align: center;" class="w-50">Bekor qilingan vaqti</th>
              <th style="text-align: center;">Bekor qilish</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in contracts" :key="index">
              <td style="text-align: center;">
                {{ item.sid }}
              </td>
              <td>{{ item.sname }}</td>
              <td>
                {{ item.pay }}
              </td>

              <td>
                <span v-if="item.all == 0" class="text-green-500">+{{
                  item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                </span>

                <span v-if="item.all == 1" class="text-red-500">-{{
                  item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}
                </span>
              </td>

              <td style="text-align: center;"><span v-if="item.all == 0">{{
                dateFormat(item.created_at) }}
                  yil</span></td>
              <td style="text-align: center;"><span v-if="item.all == 0">{{ item.time }}</span></td>
              <td style="text-align: center;">{{ dateFormatD(item.cancel_time) }}</td>
              <td><button v-if="item.pay == 'Click' && item.all == 0 && item.is_cancel != 1" @click="atmClick(item.id)"
                  class="btn-simple text-white">To'lovni
                  bekor qilish</button>
                <span v-if="item.pay == 'Click' && item.all == 0 && item.is_cancel == 1">To‘lov admin tomonidan bekor
                  qilingan</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <pagination :total-items="count" :max-visible-pages="10" :items-per-page="limit" :page="page"
            @page-change="setPage">
          </pagination>
        </div>
      </div>
      <div slot="pdf-content" ref="tableToExcel" class="tableToExcel" style="padding: 2rem">
        <div style="display: block" class="table-responsive uns">
          <table>
            <thead>
              <tr>
                <th style="text-align: center;" class="w-20">Foydalanuvchi ID raqami</th>
                <th style="text-align: center;" class="w-90">Foydalanuvchi</th>
                <th style="text-align: center;" class="w-20">To'lov tizimi</th>
                <th style="text-align: center;">To'lov summasi</th>
                <th style="text-align: center;">To'lov sanasi</th>
                <th style="text-align: center;">To'lov vaqti</th>
                <th style="text-align: center;" class="w-50">Bekor qilingan sanasi</th>
                <th>Bekor qilingan sanasi</th>
                <th style="text-align: center;">Holat</th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in exp" :key="index">
                <td style="text-align: center;">
                  {{ item.sid }}
                </td>
                <td>{{ item.sname }}</td>
                <td>
                  {{ item.pay }}
                </td>

                <td>
                  <span v-if="item.all == 0" class="text-green-500">+{{
                    item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                  }}
                  </span>

                  <span v-if="item.all == 1" class="text-red-500">-{{
                    item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                  }}
                  </span>
                </td>

                <td style="text-align: center;"><span v-if="item.all == 0">{{
                  dateFormat(item.created_at) }}
                    yil</span></td>
                <td style="text-align: center;"><span v-if="item.all == 0">{{ item.time }}</span></td>
                <td style="text-align: center;"><span v-if="item.all == 1">{{ dateFormat(item.cancel_time) }} yil</span>
                </td>
                <td style="text-align: center;"><span v-if="item.all == 1">{{ item.time }}</span></td>
                <td>
                  <span v-if="item.all == 1 && item.is_cancel != 1">To‘lov admin tomonidan bekor qilingan</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <AdminFilterMenuKarz :isActivFilterMenu="isActivFilterMenu" :ActivFilterMenu="ActivFilterMenu" />
  </div>
</template>

<script>
import dateformat from "dateformat";
import XLSX from "xlsx";
import AdminFilterMenuKarz from "../../../components/AdminFilterMenuKarz.vue";
export default {
  middleware: "checkRole",
  layout: "admin",
  data() {
    return {
      ActivFilterMenu: false,
      contracts: null,
      page: 0,
      count: 0,
      limit: 20,
      isModal: false,
      isEdit: false,
      isPassword: false,
      id: null,
      exp: null,
      isDelete: false,
    };
  },
  components: {
    AdminFilterMenuKarz,
  },
  async mounted() {
    this.setupSocket()
    this.getContracts();
  },
  methods: {
    async isActivFilterMenu() {
      this.ActivFilterMenu = !this.ActivFilterMenu;
    },
    setupSocket() {
      this.socket = this.$nuxtSocket({
        name: "home",
        channel: "/",
        secure: true,
      });
      this.socket.emit("me", { userId: this.$auth.user.id });
      this.socket.on("me", (data) => {
        const user = data.pps.find(e => e.id === this.$auth.user.id);
        if (user) this.dds.amount = user.balance;
      });
    },
    async setPage(page) {
      this.page = page;
      this.getContracts();
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
          ("Tushgan mablag‘lar" + "." || "SheetJSTableExport.") +
          (type || "xlsx")
        );
    },
    async atmClick(id) {
      const resp = await this.$axios.post(`/dashboard/transfer/click-atm/${id}`)
      if (resp.data.success == false && resp.data.msg == 'balance-no') {
        return this.$toast.error('Foydalanuvchi balansida mablag‘ yetarli emas');
      }
      this.getContracts();
      this.setupSocket();
    },
    async getContracts() {
      const { data } = await this.$axios.get(
        `/dashboard/trasfer/pay?page=${this.page + 1}&limit=${this.limit}`
      );
      this.contracts = data.data;
      this.count = data.count;
      this.exp = data.exp
    },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    dateFormatD(get) {
      // Agar get null yoki undefined bo'lsa, yoki Date obyektiga aylantirib bo'lmasa
      if (!get || isNaN(new Date(get).getTime())) {
        return '-';
      }

      const date = new Date(get);

      // Vaqtni mahalliy vaqt mintaqasiga ko'ra olish
      const day = String(date.getDate()).padStart(2, '0'); // Kunni 2 xonali qilish
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Oy (0 dan boshlanadi, shuning uchun +1)
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0'); // Soat
      const minutes = String(date.getMinutes()).padStart(2, '0'); // Daqiqa

      // Kerakli formatda yozish
      const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
      return formattedDate;
    }
  },
  components: { AdminFilterMenuKarz },
};
</script>

<style lang="scss">
.table {
  width: 100% !important;
}

.pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;

  .vue-ads-leading-loose {
    display: none;
  }

  button {
    width: 35px;
    height: 35px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: #333;
    border-radius: 4px;
    font-size: 14px;
    line-height: 24px;
    margin: 0px 3px;

    i {
      font-size: 18px;
      transform: translateY(3px);
    }

    &:hover {
      color: #fff;
      background-color: #00b5b8;
    }
  }

  button.vue-ads-text-white {
    background-color: #00b5b8;
    color: #fff;
  }
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
