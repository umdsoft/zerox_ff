<template>
  <div>
    <div :class="{ ActiveModalForms: Payme }" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isActivModal('Payme')" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">Payme orqali</div>
        <input
          v-model="PaymeNum"
          v-on:input="verification('PaymeNum')"
          placeholder="summani kiriting"
          class="input"
          type="tel"
        />
        <button class="ModalForms__btn">hisobni to’ldirish</button>
      </div>
    </div>
    <div :class="{ ActiveModalForms: Click }" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isActivModal('Click')" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">Click orqali</div>
        <input
          v-model="ClickNum"
          placeholder="summani kiriting"
          v-on:input="verification('ClickNum')"
          class="input"
          type="tel"
        />
        <button class="ModalForms__btn">hisobni to’ldirish</button>
      </div>
    </div>
    <div :class="{ ActiveModalForms: Mobil }" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isActivModal('Mobil')" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">
          Mobil xisobdan mobil xisobga o’tkazish orqali
        </div>
        <input
          v-model="MobilNum"
          placeholder="summani kiriting"
          v-on:input="verification('MobilNum')"
          class="input"
          type="tel"
        />
        <button class="ModalForms__btn">hisobni to’ldirish</button>
      </div>
    </div>
    <div class="bg-white rounded p-10">
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
          <div class="MyPractices__content">
            <div class="MyPractices__title">
              <span>Mening amaliyotlarim</span>
              <nuxt-link to="/jonatuvchi">Barchasi</nuxt-link>
            </div>
            <div v-if="data != null">
              <div
                class="MyPractices__cart"
                v-for="(item, index) in data"
                :key="index"
              >
                <div class="MyPractices__txt">
                  <span v-if="item.type == 1"
                    >{{ item.number }}-sonli qarz shartnomasi uchun</span
                  >
                </div>
                <div class="MyPractices__num">
                  <span v-if="item.all == 1" class="red"
                    >-
                    {{
                      item.amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }}
                    UZS
                  </span>
                  <span v-if="item.all == 0" class="pl"
                    >-
                    {{
                      item.amount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }}
                    UZS
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="MyPractices__content">
            <div class="MyPractices__UserCart">
              <div class="MyPractices__UserImg">
                <svg
                  width="50"
                  height="58"
                  viewBox="0 0 106 122"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M53 61C69.7281 61 83.2857 47.3465 83.2857 30.5C83.2857 13.6535 69.7281 0 53 0C36.2719 0 22.7143 13.6535 22.7143 30.5C22.7143 47.3465 36.2719 61 53 61ZM42.1871 72.4375C18.8813 72.4375 0 91.4523 0 114.923C0 118.831 3.14688 122 7.02723 122H98.9728C102.853 122 106 118.831 106 114.923C106 91.4523 87.1188 72.4375 63.813 72.4375H42.1871V72.4375Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div class="MyPractices__UserInfo">
                <div class="MyPractices__UserName">
                  {{ $auth.user.last_name }} {{ $auth.user.first_name }}
                  {{ $auth.user.middle_name }}
                </div>
                <div class="MyPractices__UserId">
                  <span>Mobil hisob:</span><span>{{ $auth.user.uid }}</span>
                </div>
                <div class="MyPractices__UserBalans">
                  <span>Balans:</span>
                  <span
                    >{{
                      $auth.user.balance
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }}
                    UZS
                  </span>
                </div>
              </div>
            </div>
            <div class="MyPractices__FreeContracts" v-if="line != 0">
              <div class="MyPractices__FreeContractsTitle">
                Bepul shartnomalar soni
              </div>
              <div class="MyPractices__FreeContractsCart">
                <div class="MyPractices__FreeContractsNum">
                  <span>{{ line }}</span>
                </div>
                <div class="MyPractices__FreeContractsLine">
                  <span
                    :class="{
                      line1: line == 1,
                      line2: line == 2,
                      line3: line == 3,
                      line4: line == 4,
                      line5: line == 5,
                      line6: line == 6,
                      line7: line == 7,
                      line8: line == 8,
                      line9: line == 9,
                      line10: line == 10,
                    }"
                  ></span>
                </div>
              </div>
            </div>
            <div class="MyPractices__replenish">
              <div class="MyPractices__replenishTitle">
                Mobil xisobni to’ldirish
              </div>
              <div class="MyPractices__replenishCarts">
                <div
                  @click="paymeModal = true"
                  class="MyPractices__replenishCart"
                >
                  <img src="@/assets/img/payme.png" alt="" />
                  <!-- <div class="MyPractices__replenishTxt">Payme orqali</div> -->
                </div>
                <div
                  @click="clickModal = true"
                  class="MyPractices__replenishCart"
                >
                  <img src="@/assets/img/click2.png" alt="" />
                  <!-- <div class="MyPractices__replenishTxt">Click orqali</div> -->
                </div>
                <div
                  @click="mobileModal = true"
                  class="MyPractices__replenishCart"
                >
                  <img src="@/assets/img/Arows.png" alt="" />
                  <div class="MyPractices__replenishTxt">
                    Mobil hisobdan mobil hisobga o’tkazish
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ZModal v-if="paymeModal" :width="420" @closeModal="paymeModal = false">
      <template #modal_body>
        <div class="text-md font-bold mb-4 mt-4">Payme orqali</div>
        <div>
          <input
            class="z-input mb-4"
            type="text"
            v-mask="'#################'"
            placeholder="Summani kiriting"
            v-model="payme.price"
          />
        </div>
        <button class="btn-z w-full" @click="eventPayme">
          Hisobni to'ldirish
        </button>
      </template>
    </ZModal>

    <ZModal v-if="clickModal" :width="420" @closeModal="clickModal = false">
      <template #modal_body>
        <div class="text-md font-bold mb-4 mt-4">Click orqali</div>
        <div>
          <input
            class="z-input mb-4"
            type="text"
            v-mask="'#################'"
            placeholder="Summani kiriting"
            v-model="click.price"
          />
        </div>
        <button class="btn-z w-full" @click="eventClick">
          Hisobni to‘ldirish
        </button>
      </template>
    </ZModal>

    <ZModal v-if="mobileModal" :width="420" @closeModal="mobileModal = false">
      <template #modal_body>
        <div class="text-md font-bold mb-4 mt-4">
          Mobil hisobdan mobil hisobga pul o‘tkazish
        </div>
        <div>
          <input
            class="z-input mb-4"
            type="text"
            v-mask="'######/AA'"
            placeholder="Foydalanuvchi ID raqamini kiriting"
            v-model="mobile.userId"
          />
          <input
            class="z-input mb-4"
            type="text"
            v-mask="'#################'"
            placeholder="Summani kiriting"
            v-model="mobile.price"
          />
        </div>
        <button class="btn-z w-full" @click="eventMobile">
          Hisobni to‘ldirish
        </button>
      </template>
    </ZModal>
  </div>
</template>

<script>
export default {
  middleware: "auth",
  data() {
    return {
      PaymeNum: "",
      ClickNum: "",
      MobilNum: "",
      line: 0,
      Payme: false,
      Click: false,
      Mobil: false,
      data: null,

      paymeModal: false,
      payme: {
        price: "",
      },

      clickModal: false,
      click: {
        price: "",
      },

      mobileModal: false,
      mobile: {
        price: "",
        userId: "",
      },
    };
  },
  async created() {
    let links = [{ title: "Qo'llab quvvatlash", name: "call-center" }];
    this.$store.commit("changeBreadCrumb", links);
    this.line = this.$auth.user.cnt;
    const dd = await this.$axios.$get("/home/hisob");
    this.data = dd.data;
  },
  methods: {
    eventPayme() {},
    eventClick() {},
   async eventMobile() {
      const dds = {
        user_id: this.mobile.userId.split("/").join(""),
        amount: this.mobile.price
      }
       
      try{
        const response = await this.$axios.post('/user/transfer',dds)
        this.$toast.success("Muvaffaqiyatli bajarildi");
      }catch(e){
        this.$toast.error("Xatolik yuz berdi");
      }
      console.log(dds)
    },
    verification(inf) {
      if (inf == "PaymeNum") {
        this.PaymeNum = this.PaymeNum.replace(/[A-Za-zА-Яа-яЁё,e,+,-]/, "");
      } else if (inf == "ClickNum") {
        this.ClickNum = this.ClickNum.replace(/[A-Za-zА-Яа-яЁё,e,+,-]/, "");
      } else if (inf == "MobilNum") {
        this.MobilNum = this.MobilNum.replace(/[A-Za-zА-Яа-яЁё,e,+,-]/, "");
      }
    },
    isActivModal(txt) {
      if (txt == "Payme") {
        this.Mobil = false;
        this.Click = false;
        this.Payme = !this.Payme;
      } else if (txt == "Click") {
        this.Mobil = false;
        this.Payme = false;
        this.Click = !this.Click;
      } else if (txt == "Mobil") {
        this.Click = false;
        this.Payme = false;
        this.Mobil = !this.Mobil;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mobil {
  width: 400px;
  margin: 0 auto;

  .hisob {
    background: #ffffff;
    box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
    border-radius: 10px;
    padding: 20px 20px;
    margin-bottom: 20px;
  }
}

.btn {
  width: 100%;
  background: #3182ce;
  text-align: center;
  /* синий */

  box-shadow: inset 3px 0px 8px rgba(255, 255, 255, 0.1),
    inset 0px 3px 8px rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  background-color: rgb(76, 144, 210);
  color: white;
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;

  span {
    svg {
      transition: 0.2s;
    }
  }
}

.call {
  text-align: center;
  color: rgb(76, 144, 210);
}

.ModalForms {
  transition-duration: 0.3s;
  opacity: 0;
  visibility: hidden;
  width: 40%;
  padding: 30px;
  top: 20%;
  left: 25%;
  position: absolute;
  z-index: 111;
  border-radius: 10px;
  background: rgb(255, 255, 255);
  box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
  .ModalForms__inputs {
    position: relative;
    .ModalForms__X {
      cursor: pointer;
      position: absolute;
      top: -20px;
      right: -10px;
      font-size: 22px;
      font-weight: bold;
      color: red;
    }
  }
  .ModalFormsTitle {
    color: #000;
    font-weight: bold;
  }

  .ModalForms__btn {
    margin: 15px 0 0 0;
    color: white;
    padding: 15px 30px;
    border-radius: 10px;
    transition-duration: 0.3s;
    background: rgb(55, 144, 228);
    &:hover {
      background: rgb(45, 120, 190);
    }
  }
  .input {
    margin: 10px 0 0 0;
    padding: 10px 0 10px 10px;
    width: 100%;
    border-radius: 5px;
    border: 1px rgb(175, 175, 175) solid;
  }
}
.ActiveModalForms {
  top: 25%;
  opacity: 1;
  visibility: visible;
}

.MyPractices {
  width: 100%;

  .MyPractices__contents {
    display: flex;

    .MyPractices__content {
      width: 38%;

      .MyPractices__title {
        margin: 0 0 14px 0;
        width: 100%;
        display: flex;
        justify-content: space-between;

        span {
          font-weight: 600;
          font-size: 16px;
          line-height: 17px;
          color: #2d3748;
        }

        a {
          color: rgba(49, 130, 206, 1);
        }
      }

      .MyPractices__cart {
        margin: 10px 0 0 0;
        padding: 12px 17px;
        background: #ffffff;
        box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
        border-radius: 10px;

        .MyPractices__txt {
          font-weight: 400;
          font-size: 12px;
          line-height: 15px;
          color: #2d3748;
        }

        .MyPractices__num {
          margin: 12px 0 0 0;
          font-weight: 600;
          font-size: 14px;
          line-height: 100%;
        }
        .pl {
          color: #48bb78;
        }
        .red {
          color: rgb(192, 0, 0);
        }
      }
    }

    .MyPractices__content:nth-child(2) {
      width: 63%;
      margin: 0 0 0 32px;

      .MyPractices__UserCart {
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 1px;
        color: #2d3748;
        display: flex;
        align-items: center;
        background: #ffffff;
        box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
        border-radius: 10px;
        padding: 19px 16px;

        .MyPractices__UserImg {
          padding: 16px 27px 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: max-content;
          border-radius: 50%;
          background: rgba(49, 130, 206, 1);
        }

        .MyPractices__UserInfo {
          margin: 0 0 0 15px;
        }

        .MyPractices__UserName {
          font-weight: bold;
        }

        .MyPractices__UserId {
          margin: 13px 0 0 0;

          span:nth-child(1) {
            font-weight: bold;
            display: inline-block;
            width: 120px;
          }

          span:nth-child(2) {
            color: rgba(49, 130, 206, 1);
          }
        }

        .MyPractices__UserBalans {
          margin: 13px 0 0 0;

          span:nth-child(1) {
            font-weight: bold;
            display: inline-block;
            width: 120px;
          }

          span:nth-child(2) {
            color: rgba(49, 130, 206, 1);
          }
        }
      }

      .MyPractices__FreeContracts {
        margin: 25px 0 0 0;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 1px;
        color: #2d3748;

        .MyPractices__FreeContractsTitle {
          font-weight: bold;
          margin: 0 0 25px 0;
        }

        .MyPractices__FreeContractsCart {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 30px;
          background: #ffffff;
          box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
          border-radius: 10px;

          .MyPractices__FreeContractsNum {
            font-weight: bold;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: white;
            font-size: 25px;
            background: #3182ce;
            margin: 0 13px 0 0;
          }

          .MyPractices__FreeContractsLine {
            position: relative;
            width: 80%;
            height: 18px;
            border: 1px solid #3182ce;
            border-radius: 10px;

            span {
              position: absolute;
              top: 1px;
              left: 1px;
              height: 90%;
              width: 0%;
              background: #3182ce;
              border-radius: 10px;
            }

            .line1 {
              width: 10%;
            }

            .line2 {
              width: 20%;
            }

            .line3 {
              width: 30%;
            }

            .line4 {
              width: 40%;
            }

            .line5 {
              width: 50%;
            }

            .line6 {
              width: 60%;
            }

            .line7 {
              width: 70%;
            }

            .line8 {
              width: 80%;
            }

            .line9 {
              width: 90%;
            }

            .line10 {
              width: 100%;
            }
          }
        }
      }

      .MyPractices__replenish {
        .MyPractices__replenishTitle {
          margin: 28px 0 28px 0;
          font-weight: bold;
        }

        .MyPractices__replenishCarts {
          display: flex;
          justify-content: space-between;
        }

        .MyPractices__replenishCart {
          cursor: pointer;
          max-width: 150px;
          max-height: 150px;
          background: #ffffff;
          box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
          border-radius: 10px;
          padding: 30px 17px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }

        .MyPractices__replenishTxt {
          text-align: center;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
