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
            </div>
            <div v-for="(item, index) in data" :key="index">
              <div class="MyPractices__cart MyPractices__cart-All">
                <div class="MyPractices__Icon">
                  <svg
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
                  </svg>
                </div>
                <div style="font-size: 14px">
                  <span v-if="item.type == 1"
                    >{{ item.number }}-sonli shartnoma rasmiylashtirildi.</span
                  >
                </div>
                <div class="MyPractices__date">
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
                <div>
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
                </div>
              </div>
              <!-- <div
                :class="{ ActiveModalForms: isModalInfo }"
                class="ModalForms"
              >
                <div class="ModalForms__inputs">
                  <div @click="isModalActive" class="ModalForms__X">X</div>
                  <div class="ModalFormsTitle">Mobil hisobga o’tkazma</div>
                  <div class="ModalForms__IconAndPirce">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="56"
                      height="56"
                      viewBox="0 0 56 56"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M28 0.5C12.8125 0.5 0.5 12.8125 0.5 28C0.5 43.1875 12.8125 55.5 28 55.5C43.1875 55.5 55.5 43.1875 55.5 28C55.5 12.8125 43.1875 0.5 28 0.5ZM39.92 23.35C40.1395 23.0991 40.3066 22.8068 40.4115 22.4904C40.5163 22.174 40.5569 21.8398 40.5307 21.5075C40.5045 21.1751 40.4121 20.8514 40.2589 20.5553C40.1058 20.2592 39.895 19.9968 39.6389 19.7834C39.3828 19.5699 39.0866 19.4099 38.7677 19.3127C38.4489 19.2154 38.1138 19.1829 37.7822 19.2171C37.4506 19.2512 37.1292 19.3514 36.8369 19.5116C36.5445 19.6718 36.2872 19.8889 36.08 20.15L25.33 33.0475L19.7675 27.4825C19.296 27.0271 18.6645 26.7751 18.009 26.7808C17.3535 26.7865 16.7265 27.0494 16.263 27.513C15.7994 27.9765 15.5365 28.6035 15.5308 29.259C15.5251 29.9145 15.7771 30.546 16.2325 31.0175L23.7325 38.5175C23.9781 38.763 24.2722 38.9546 24.596 39.0802C24.9198 39.2057 25.2662 39.2624 25.6132 39.2466C25.9601 39.2309 26.2999 39.143 26.611 38.9886C26.9221 38.8342 27.1976 38.6167 27.42 38.35L39.92 23.35Z"
                        fill="#48BB78"
                      />
                    </svg>
                    <span>+ 320 000 so’m</span>
                  </div>
                  <div class="ModalForms__Info">
                    <div class="ModalForms__name">
                      <div class="mt-2">Jo’natuvchi</div>
                      <span>Jumaniyozov Umidbek Dilshod o’g’li</span>
                    </div>
                    <div class="ModalForms__pirce">
                      <div class="mt-2">Qabul qilingan summa</div>
                      <span>360 000 UZS</span>
                    </div>
                    <div class="ModalForms__date">
                      <div class="mt-2">Vaqti</div>
                      <span>13:00 13.10.2022</span>
                    </div>
                    <div class="ModalForms__id">
                      <div class="mt-2">Amaliyot IDsi</div>
                      <span>1326210d-a34a-4a20-a694-e30f85d53eb2</span>
                    </div>
                  </div>

                  <button class="ModalForms__btn">xisobni to’ldirish</button>
                </div>
              </div> -->
            </div>
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
    };
  },
  computed: {
    isModalInfo() {
      return this.$store.getters.isModalInfo;
    },
  },
  async created() {
    let links = [{ title: "Qo'llab quvvatlash", name: "call-center" }];
    this.$store.commit("changeBreadCrumb", links);
    const dd = await this.$axios.$get("/home/hisob");
    this.data = dd.data;
  },
  methods: {
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    // isModalActive() {
    //   this.$store.dispatch("IsActiveModal");
    // },
  },
};
</script>
<style lang="scss">
.MyPractices__cart-All {
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.MyPractices__date {
  padding: 0 5px;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 10px;

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
</style>
