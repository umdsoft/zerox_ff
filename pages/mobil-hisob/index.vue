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
        <button class="ModalForms__btn">{{ $t("mobil.hisobni") }}</button>
      </div>
    </div>
    <div :class="{ ActiveModalForms: Click }" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isActivModal('Click')" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">Click orqali</div>
        <input
          v-model="ClickNum"
          :placeholder="$t('placeholder.summo')"
          v-on:input="verification('ClickNum')"
          class="input"
          type="tel"
        />
        <button class="ModalForms__btn">{{ $t("mobil.hisobni") }}</button>
      </div>
    </div>
    <div :class="{ ActiveModalForms: Mobil }" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isActivModal('Mobil')" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">
          Mobil xisobdan mobil xisobga o‘tkazish orqali
        </div>
        <input
          v-model="MobilNum"
          :placeholder="$t('placeholder.summo')"
          v-on:input="verification('MobilNum')"
          class="input"
          type="tel"
        />
        <button class="ModalForms__btn">{{ $t("mobil.hisobni") }}</button>
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
        <p class="text-blue-500">{{ $t("mobil.bck") }}</p>
      </div>

      <div class="MyPractices">
        <div class="MyPractices__contents">
          <div class="MyPractices__content">
            <div class="MyPractices__title">
              <span>{{ $t("mobil.mobl") }}</span>
              <nuxt-link to="/jonatuvchi?status=1">{{
                $t("mobil.all")
              }}</nuxt-link>
            </div>
            <div v-if="data != null">
              <div
                class="MyPractices__cart"
                v-for="(item, index) in data"
                :key="index"
              >
                <div class="MyPractices__txt">
                  <span v-if="item.type == 1">
                    {{ item.number }} - {{ $t("mobil.bcks") }}
                  </span>
                  <span v-if="item.type == 2">
                    {{ item.dname }} {{ $t("mobil.phon") }}
                  </span>
                  <span v-if="item.type == 3">
                    {{ item.dname }} {{ $t("mobil.phon2") }}
                  </span>
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
                    >+
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
                  <span>{{ $t("mobil.mob") }} </span>
                  <span> {{ $auth.user.uid }}</span>
                </div>
                <div class="MyPractices__UserBalans">
                  <span>{{ $t("mobil.Balans") }}:</span>
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
                {{ $t("mobil.document") }}
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
                {{ $t("mobil.Mobilaccount") }}
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
                  <div>
                    <div class="flex justify-center mb-1">
                      <img class="w-9" src="@/assets/img/Arows.png" alt="" />
                    </div>
                    <div class="MyPractices__replenishTxt">
                      {{ $t("mobil.transfer") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ZModal v-if="paymeModal" :width="420" @closeModal="closeModal">
      <template #modal_body>
        <div class="text-md font-bold mb-4 mt-4">{{ $t("mobil.payme") }}</div>
        <div>
          <input
            class="z-input mb-4"
            type="text"
            :placeholder="$t('placeholder.summo')"
            v-model="payme.price"
            @keyup="keyupSum"
          />
    
        <p
          class="frmValidation"
          :class="{ 'frmValidation--passed': payme.price.length > 4 }"
        >
          <i
            class="frmIcon fas pb-8"
            :class="payme.price.length > 4 ? 'fa-check' : 'fa-times'"
          ></i>
          {{$t('debt_list.sss')}} – 1000 UZS
        </p>


        </div>
        <button class="btn-z w-full" @click="eventPayme">
          {{ $t("mobil.hisobni") }}
        </button>
      </template>
    </ZModal>

    <ZModal v-if="clickModal" :width="420"  @closeModal="closeModal">
      <template #modal_body>
        <div class="text-md font-bold mb-4 mt-4">{{ $t("mobil.clck") }}</div>
        <div>
          <input
            class="z-input mb-4"
            type="text"
            :placeholder="$t('placeholder.summo')"
            v-model="click.price"
            @keyup="keyupSum"
          />
          <p
            class="frmValidation "
            :class="{ 'frmValidation--passed': click.price.length > 4 }"
          >
            <i
              class="frmIcon fas pb-8"
              :class="click.price.length > 4 ? 'fa-check' : 'fa-times'"
            ></i> 
            {{$t('debt_list.sss' ) }}      - 1000 UZS 
          </p>
        </div>
        <button class="btn-z w-full" @click="eventClick">
          {{ $t("mobil.hisobni") }}
        </button>
      </template>
    </ZModal>

    <ZModal v-if="mobileModal" :width="420"  @closeModal="closeModal">
      <template #modal_body>
        <div class="text-md font-bold mb-4 mt-4">
          {{ $t("mobil.mobl2") }}
        </div>
        <div>
          <input
            class="z-input mb-4"
            type="text"
            @input="setUserId"
            v-mask="'######/AA'"
            :placeholder="$t('placeholder.idd')"
            v-model="mobile.userId"
          />
       
          <input
            class="z-input mb-4"
            type="text"
            :placeholder="$t('placeholder.summo')"
            v-model="mobile.price"
            @keyup="keyupSum"
            name="password"
            @input="password_check"
            />

          <p
            class="frmValidation "
            :class="{ 'frmValidation--passed': mobile.price.length > 4 }"
          > 
            <i
              class="frmIcon fas pb-8"
              :class="mobile.price.length > 4 ? 'fa-check' : 'fa-times'"
            ></i>
            {{$t('debt_list.sss')}} – 1000 UZS
          </p>
        </div>
        <button class="btn-z w-full" @click="eventMobile">
          {{ $t("mobil.transfers")  }} 
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
      userData: null,
      message:       '',
                has_number:    false,
                has_lowercase: false,
                has_uppercase: false,
                has_special:   false,
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
  async mounted() {
    let links = [{ title: "Qo'llab quvvatlash", name: "call-center" }];
    this.$store.commit("changeBreadCrumb", links);
    this.getHisob();
    this.getUserData()
  },
  methods: {
    closeModal(){
      this.paymeModal=false;
      this.clickModal=false;
      this.mobileModal=false;
      this.payme.price='';
      this.click.price='';
      this.mobile.price='';
    },
    password_check: function () {
                    this.has_number    = /\d/.test(this.message);
                    this.has_lowercase = /[a-z]/.test(this.message);
                    this.has_uppercase = /[A-Z]/.test(this.message);
                    this.has_special   = /[!@#\$%\^\&*\)\(+=._-]/.test(this.message)
                }         ,
    async getHisob() {
      const dd = await this.$axios.$get("/home/hisob");
      this.data = dd.data;
    },
    async getUserData(){
      const dd = await this.$axios.$get("/user/me");
      this.userData = dd.data;
      this.line = this.userData.cnt
    },
    eventPayme() {},
    eventClick() {},
    async eventMobile() {
      const dds = {
        user_id: this.mobile.userId.split("/").join(""),
        amount: this.mobile.price.split(" ").join(""),
      };
      try {
        if (this.mobile.price.split(" ").join("") == "0") {
          return this.$toast.error("Noto'g'ri summa.");
        }
        const response = await this.$axios.post("/user/transfer", dds);
        if (response.data.message == "enouth-money") {
          return this.$toast.error("Mobil hisobda mablag' yetarli emas.");
        }
        if (response.data.message == "not-user") {
          return this.$toast.error("Foydalanuvchi topilmadi.");
        }
        this.getHisob();
        this.getUserData()
        this.mobileModal = false;
        this.$toast.success("Muvaffaqiyatli bajarildi");
      } catch (e) {
        this.$toast.error("Xatolik yuz berdi");
      }
    },

    keyupSum(e) {
      e.target.value = e.target.value
        .toString()
        .replace(/\s/g, "")
        .replace(/[^0-9]/g, "")
        .replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, " ");
    },
    setUserId(e) {
      this.mobile.userId = e.target.value.toUpperCase();
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


.frmIcon{color:#f5052d;}
    .frmValidation--passed .frmIcon{color:#0fa140;}   


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
