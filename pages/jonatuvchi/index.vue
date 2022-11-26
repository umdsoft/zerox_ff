<template>
  <div>
    <div style="min-height: 70vh" class="bg-white rounded p-10">
      <div
        @click="$router.go(-1)"
        class="hidden lg:inline-flex items-center"
        style="cursor: pointer"
      >
        <svg
          class="h-5 w-5 text-blue-500"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="15 6 9 12 15 18" />
        </svg>
        <p class="text-blue-500">Orqaga</p>
      </div>

      <div class="MyPractices">
        <div class="MyPractices__contents">
          <div
            v-if="data != null"
            style="width: 100%"
            class="MyPractices__content"
          >
            <div class="MyPractices__title">
              <span>Mening amaliyotlarim</span>
              <a href="/jonatuvchi?status=0"
              v-if="$route.query.status == 1"
              style="background: #48bb78; border-radius: 5px"
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
              <div class="flex">
              
                <span class="ml-2 pr-2" style="color: #fff;">Kirimlar</span>
              </div>
            </a>
              <a href="/jonatuvchi?status=1"
              v-if="$route.query.status == 0"
              style="background: #48bb78; border-radius: 5px"
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
              <div class="flex">
              
                <span class="ml-2 pr-2" style="color: #fff;">Chiqimlar</span>
              </div>
            </a>
            </div>
            <table class="MyPractices__table">
              <tr>
                <th></th>
                <th>Shartnoma</th>
                <th>Sana</th>
                <th>Kirim/Chiqim</th>
              </tr>
              <tr
                class="MyPractices__table-row"
                v-for="(item, index) in data"
                :key="index"
                @click="isModalActive"
              >
                <td class="MyPractices__Icon">
                 <span v-if="item.type==1"> <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="40" height="40" rx="10" fill="#3182CE" />
                    <path
                      d="M30 33H15C14.4697 32.9995 13.9613 32.8037 13.5864 32.4555C13.2114 32.1073 13.0005 31.6353 13 31.1429V25.5714H15V31.1429H30V10.7143H21V8.85715H30C30.5303 8.85764 31.0387 9.05346 31.4136 9.40163C31.7886 9.74981 31.9995 10.2219 32 10.7143V31.1429C31.9995 31.6353 31.7886 32.1073 31.4136 32.4555C31.0387 32.8037 30.5303 32.9995 30 33Z"
                      fill="white"
                    />
                    <path
                      d="M21 14.4286H28V16.2857H21V14.4286ZM20 19.0714H28V20.9286H20V19.0714ZM19 23.7143H28V25.5714H19V23.7143ZM13 22.7857C11.6743 22.7845 10.4033 22.2949 9.46593 21.4245C8.52853 20.5541 8.00132 19.3738 8 18.1429V7.92857H10V18.1429C10 18.8817 10.3161 19.5902 10.8787 20.1127C11.4413 20.6351 12.2044 20.9286 13 20.9286C13.7956 20.9286 14.5587 20.6351 15.1213 20.1127C15.6839 19.5902 16 18.8817 16 18.1429V9.78571C16 9.53944 15.8946 9.30326 15.7071 9.12912C15.5196 8.95497 15.2652 8.85714 15 8.85714C14.7348 8.85714 14.4804 8.95497 14.2929 9.12912C14.1054 9.30326 14 9.53944 14 9.78571V19.0714H12V9.78571C12 9.0469 12.3161 8.33834 12.8787 7.81592C13.4413 7.29349 14.2044 7 15 7C15.7956 7 16.5587 7.29349 17.1213 7.81592C17.6839 8.33834 18 9.0469 18 9.78571V18.1429C17.9987 19.3738 17.4715 20.5541 16.5341 21.4245C15.5967 22.2949 14.3257 22.7845 13 22.7857Z"
                      fill="white"
                    />
                  </svg></span>
                  <span v-if="item.type==2 || item.type == 3"> <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" rx="10" fill="#3182CE"/>
<path d="M32.8811 17.8774C32.9994 17.5809 33.0303 17.2547 32.9699 16.9401C32.9096 16.6254 32.7607 16.3363 32.542 16.1095L24.7296 8L22.5203 10.2934L27.6655 15.6343H8.00018V18.8781H31.4373C31.7463 18.8782 32.0484 18.7831 32.3054 18.605C32.5624 18.4269 32.7627 18.1737 32.8811 17.8774ZM8.11893 23.1226C8.00064 23.4191 7.96972 23.7453 8.03007 24.0599C8.09043 24.3746 8.23935 24.6637 8.45799 24.8905L16.2704 33L18.4797 30.7066L13.3345 25.3657H32.9998V22.1219H9.56266C9.25361 22.1216 8.95143 22.2165 8.69441 22.3947C8.43739 22.5729 8.23711 22.8262 8.11893 23.1226Z" fill="white"/>
</svg></span>
                </td>
                <td style="font-size: 14px">
                  <span v-if="item.type == 1"
                    >{{ item.number }}-sonli shartnoma rasmiylashtirildi.</span
                  >
                  <span v-if="item.type == 2">
                    {{ item.dname }} mobil hisobiga o'tkazma
                  </span>
                  <span v-if="item.type == 3">
                    {{ item.dname }} mobil hisobidan o'tkazma
                  </span>
                </td>
                <td class="MyPractices__date">
                  <div>
                    <img
                      src="../../assets/img/Date.png"
                      alt=""
                      class="MyPractices__date_icon"
                    />
                    <span style="font-size: 14px"
                      >{{ dateFormat(item.created_at.slice(0, 10)) }}
                      {{ item.time.slice(0, 5) }}</span
                    >
                  </div>
                </td>
                <td class="MyPractices__table-output-input">
                  <span
                    v-if="item.all == 1"
                    style="color: rgb(192, 0, 0); font-weight: 600"
                    >-
                    {{
                      item.amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }}
                    UZS</span
                  >
                  <span
                    v-if="item.all == 0"
                    style="color: #48bb78; font-weight: 600"
                    >+
                    {{
                      item.amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }}
                    UZS</span
                  >

                </td>
                
                
          
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
  middleware: "auth",

  data() {
    return {
      data: null,
      status: this.$route.query.status
    };
  },
  computed: {
    isModalInfo() {
      return this.$store.getters.isModalInfo;
    },
  },
  async mounted() {
    let links = [{ title: "Qo'llab quvvatlash", name: "call-center" }];
    this.$store.commit("changeBreadCrumb", links);
    this.getData()
  },

  methods: {
    async getData(){
    const dd = await this.$axios.$get(`/home/cs?status=${this.status}`);
    this.data = dd.data;
  },
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    isModalActive() {
      this.$store.dispatch("IsActiveModal");
    },
  },
};
</script>
<style lang="scss" scoped>


.MyPractices {
  &__Icon {
    display: grid;
    justify-content: center;
    align-items: start;
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
  }

  &__table-row {
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 10px !important;
  }

  &__table-output-input {
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
  }
}

.MyPractices__cart-All {
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.MyPractices__date div {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 10px;
  width: max-content;
  padding: 2px 8px;

  span {
    margin: 0 0 0 10px;
  }
}

.ModalForms__IconAndPirce {
  margin: 27px 0 0 0;
  display: flex;
  align-items: center;
  flex-direction: column;

  span {
    font-weight: 600;
    font-size: 16px;
    color: #48bb78;
    margin: 7px 0 0 0;
  }
}

.ModalForms__Info {
  span {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;
  }
  .ModalForms__name {
    span {
      font-weight: 600;
      font-size: 15px;
      line-height: 18px;
      letter-spacing: 1px;

      color: #3d95ff;
    }
  }
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  text-align: left;
}

td {
  border: 1px solid #ddd;
  padding: 5px;

  &:not(:first-child) {
    border-left: hidden;
  }
  &:not(:last-child) {
    border-right: hidden;
  }
}
</style>
