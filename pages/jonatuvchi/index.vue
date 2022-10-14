<template>
  <div>
    <div :class="{ ActiveModalForms:isModalInfo }" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isModalActive" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">
          Mobil hisobga o’tkazma
        </div>
        <div class="ModalForms__IconAndPirce">
          <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M28 0.5C12.8125 0.5 0.5 12.8125 0.5 28C0.5 43.1875 12.8125 55.5 28 55.5C43.1875 55.5 55.5 43.1875 55.5 28C55.5 12.8125 43.1875 0.5 28 0.5ZM39.92 23.35C40.1395 23.0991 40.3066 22.8068 40.4115 22.4904C40.5163 22.174 40.5569 21.8398 40.5307 21.5075C40.5045 21.1751 40.4121 20.8514 40.2589 20.5553C40.1058 20.2592 39.895 19.9968 39.6389 19.7834C39.3828 19.5699 39.0866 19.4099 38.7677 19.3127C38.4489 19.2154 38.1138 19.1829 37.7822 19.2171C37.4506 19.2512 37.1292 19.3514 36.8369 19.5116C36.5445 19.6718 36.2872 19.8889 36.08 20.15L25.33 33.0475L19.7675 27.4825C19.296 27.0271 18.6645 26.7751 18.009 26.7808C17.3535 26.7865 16.7265 27.0494 16.263 27.513C15.7994 27.9765 15.5365 28.6035 15.5308 29.259C15.5251 29.9145 15.7771 30.546 16.2325 31.0175L23.7325 38.5175C23.9781 38.763 24.2722 38.9546 24.596 39.0802C24.9198 39.2057 25.2662 39.2624 25.6132 39.2466C25.9601 39.2309 26.2999 39.143 26.611 38.9886C26.9221 38.8342 27.1976 38.6167 27.42 38.35L39.92 23.35Z"
              fill="#48BB78" />
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
    </div>
    <div style="min-height: 70vh" class="bg-white rounded p-10">
      <div @click="$router.go(-1)" class="hidden lg:inline-flex items-center" style="cursor: pointer">
        <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="15 6 9 12 15 18" />
        </svg>
        <p class="text-blue-500">Orqaga</p>
      </div>

      <div class="MyPractices">
        <div class="MyPractices__contents">
          <div style="width: 100%;" class="MyPractices__content">
            <div class="MyPractices__title">
              <span>Mening amaliyotlarim</span>
            </div>
            <div @click="isModalActive" class="MyPractices__cart MyPractices__cart-All">
              <div class="MyPractices__Icon"><img src="../../assets/img/mobilOrkali.png" alt=""></div>
              <div class="MyPractices__txt MyPractices__text-All">
                Payme orqali mobil xisobni to’ldirish
              </div>
              <div class="MyPractices__date">
                <img src="../../assets/img/Date.png" alt="" class="MyPractices__date_icon">
                <span>15:43 13.10.2022</span>
              </div>
              <div class="MyPractices__num">+ 320 000 so’m</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  data() {
    return {

    };
  },
  computed: {
    isModalInfo() {
      return this.$store.getters.isModalInfo
    }
  },
  created() {
    let links = [{ title: "Qo'llab quvvatlash", name: "call-center" }];
    this.$store.commit("changeBreadCrumb", links);
  },
  methods: {
    isModalActive() {
      this.$store.dispatch('IsActiveModal')
    }
  }
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
  background: #F5F5F5;

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
    color: #48BB78;
    margin: 7px 0 0 0;
  }
}

.ModalForms__Info {
  span {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;
  }.ModalForms__name {
  span {
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 1px;

    color: #3D95FF;

  }
}
}



</style>
