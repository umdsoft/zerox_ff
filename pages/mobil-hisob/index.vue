<template>
  <div>
    <div :class="{ActiveModalForms:Payme}" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isActivModal('Payme')" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">Payme orqali</div>
        <input v-model="PaymeNum" v-on:keyup="verification"   placeholder="summani kiriting"  class="input" type="number">
        <button class="ModalForms__btn">xisobni to’ldirish</button>
      </div>
    </div>
    <div :class="{ActiveModalForms:Click}" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isActivModal('Click')" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">Click orqali</div>
        <input placeholder="summani kiriting"  v-on:keyup="verification" class="input" type="number">
        <button class="ModalForms__btn">xisobni to’ldirish</button>
      </div>
    </div>
    <div :class="{ActiveModalForms:Mobil}" class="ModalForms">
      <div class="ModalForms__inputs">
        <div @click="isActivModal('Mobil')" class="ModalForms__X">X</div>
        <div class="ModalFormsTitle">
          Mobil xisobdan
          mobil xisobga
          o’tkazish
           orqali</div>
        <input placeholder="summani kiriting"  v-on:keyup="verification" class="input" type="number">
        <button class="ModalForms__btn">xisobni to’ldirish</button>
      </div>
    </div>
    <div class="bg-white rounded p-10">
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
          <div class="MyPractices__content">
            <div class="MyPractices__title"><span>Mening amaliyotlarim</span>
              <nuxt-link to="#!">Barchasi</nuxt-link>
            </div>
            <div class="MyPractices__cart">
              <div class="MyPractices__txt">Payme orqali mobil xisobni to’ldirish</div>
              <div class="MyPractices__num">+ 320 000 so’m</div>
            </div>
          </div>
          <div class="MyPractices__content">
            <div class="MyPractices__UserCart">
              <div class="MyPractices__UserImg">
                <svg width="50" height="58" viewBox="0 0 106 122" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M53 61C69.7281 61 83.2857 47.3465 83.2857 30.5C83.2857 13.6535 69.7281 0 53 0C36.2719 0 22.7143 13.6535 22.7143 30.5C22.7143 47.3465 36.2719 61 53 61ZM42.1871 72.4375C18.8813 72.4375 0 91.4523 0 114.923C0 118.831 3.14688 122 7.02723 122H98.9728C102.853 122 106 118.831 106 114.923C106 91.4523 87.1188 72.4375 63.813 72.4375H42.1871V72.4375Z"
                    fill="white" />
                </svg>
              </div>
              <div class="MyPractices__UserInfo">
                <div class="MyPractices__UserName">Jumaniyozov Umidbek Dilshod o’g’li</div>
                <div class="MyPractices__UserId"><span>Mobil xisob:</span><span>100003/AA</span> </div>
                <div class="MyPractices__UserBalans"><span>Balans:</span><span>120 000 so’m</span></div>
              </div>
            </div>
            <div class="MyPractices__FreeContracts">
              <div class="MyPractices__FreeContractsTitle">Bepul shartnomalar soni</div>
              <div class="MyPractices__FreeContractsCart">
                <div class="MyPractices__FreeContractsNum"><span>{{line}}</span></div>
                <div class="MyPractices__FreeContractsLine"><span :class="{
                    line1:line==1,
                    line2:line==2,
                    line3:line==3,
                    line4:line==4,
                    line5:line==5,
                    line6:line==6,
                    line7:line==7,
                    line8:line==8,
                    line9:line==9,
                    line10:line==10,
                }"></span></div>
              </div>
            </div>
            <div class="MyPractices__replenish">
              <div class="MyPractices__replenishTitle">Mobil xisobni to’ldirish</div>
              <div class="MyPractices__replenishCarts">
                <div @click="isActivModal('Payme')" class="MyPractices__replenishCart">
                  <img src="@/assets/img/payme.png" alt="">
                  <div class="MyPractices__replenishTxt">Payme orqali</div>
                </div>
                <div @click="isActivModal('Click')" class="MyPractices__replenishCart">
                  <img src="@/assets/img/click2.png" alt="">
                  <div class="MyPractices__replenishTxt">Click orqali</div>
                </div>
                <div @click="isActivModal('Mobil')" class="MyPractices__replenishCart">
                  <img src="@/assets/img/Arows.png" alt="">
                  <div class="MyPractices__replenishTxt">
                    Mobil xisobdan
                    mobil xisobga
                    o’tkazish</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>


  <!-- <div class="pt-20 mobil">
      <nuxt-link to="#" class="btn" type="button"
        >“xxx” raqamli mobil hisob
      </nuxt-link>
      <div
        class="
          cash
          flex
          hisob
          items-center
          bg-white
          rounded-[5px]
          justify-between
        "
      >
        <div class="flex flex-col">
          <span>Mobil hisob: </span>
          <span>asdasda</span>
        </div>
        <div>
          <svg
            width="31"
            height="31"
            viewBox="0 0 31 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5 31C24.0604 31 31 24.0604 31 15.5C31 6.93959 24.0604 0 15.5 0C6.93959 0 0 6.93959 0 15.5C0 24.0604 6.93959 31 15.5 31Z"
              fill="#3182CE"
            />
            <rect width="31" height="31" rx="5.16667" fill="#3182CE" />
            <g clip-path="url(#clip0_254_14246)">
              <path
                d="M11.1068 11.3447H20.1889C20.295 11.3446 20.4009 11.3514 20.5062 11.3648C20.4705 11.1145 20.3845 10.8739 20.2533 10.6576C20.1222 10.4414 19.9486 10.2539 19.743 10.1066C19.5375 9.95924 19.3042 9.85505 19.0573 9.80029C18.8104 9.74553 18.5549 9.74134 18.3063 9.78798L10.8372 11.0632H10.8287C10.3599 11.1528 9.94294 11.4181 9.66309 11.8048C10.0847 11.5049 10.5894 11.344 11.1068 11.3447Z"
                fill="white"
              />
              <path
                d="M20.189 12.0273H11.1069C10.6254 12.0279 10.1636 12.2194 9.82312 12.5599C9.48259 12.9005 9.29105 13.3622 9.29053 13.8437V19.293C9.29105 19.7745 9.48259 20.2362 9.82312 20.5768C10.1636 20.9173 10.6254 21.1088 11.1069 21.1094H20.189C20.6705 21.1088 21.1322 20.9173 21.4728 20.5768C21.8133 20.2362 22.0048 19.7745 22.0054 19.293V13.8437C22.0048 13.3622 21.8133 12.9005 21.4728 12.5599C21.1322 12.2194 20.6705 12.0279 20.189 12.0273ZM18.8408 17.4766C18.6612 17.4766 18.4856 17.4233 18.3363 17.3235C18.1869 17.2237 18.0705 17.0819 18.0018 16.9159C17.933 16.75 17.9151 16.5674 17.9501 16.3912C17.9851 16.215 18.0716 16.0532 18.1987 15.9262C18.3257 15.7991 18.4875 15.7126 18.6637 15.6776C18.8398 15.6426 19.0224 15.6605 19.1884 15.7293C19.3544 15.798 19.4962 15.9144 19.596 16.0638C19.6958 16.2131 19.749 16.3887 19.749 16.5684C19.749 16.8092 19.6534 17.0402 19.483 17.2106C19.3127 17.3809 19.0817 17.4766 18.8408 17.4766Z"
                fill="white"
              />
              <path
                d="M9.30469 15.7585V12.9346C9.30469 12.3196 9.64526 11.2885 10.8273 11.0651C11.8306 10.877 12.824 10.877 12.824 10.877C12.824 10.877 13.4767 11.3311 12.9375 11.3311C12.3983 11.3311 12.4124 12.0264 12.9375 12.0264C13.4626 12.0264 12.9375 12.6934 12.9375 12.6934L10.8231 15.0916L9.30469 15.7585Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_254_14246">
                <rect
                  width="14.5312"
                  height="14.5312"
                  fill="white"
                  transform="translate(8.39648 8.39453)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div v-if="line!=0" class="
      cash
      flex
      bepulToldirish
      bg-white
      rounded-[5px]
      justify-between">
        <div>Bepul shartnomalar soni</div>
        <span>{{line}} / 10</span>
        <div class="lines"><div :class="{
          line2:line==2,
          line3:line==3,
          line4:line==4,
          line5:line==5,
          line6:line==6,
          line7:line==7,
          line8:line==8,
          line9:line==9,
          line10:line==10,
        }"></div></div>
      </div>

      <nuxt-link to="/paybill"
        ><button class="btn" type="button">
          Mobil hisobni to’ldirish
        </button></nuxt-link
      >
      <nuxt-link to="/transfer-money">
        <button class="btn" type="button">
          Mobil hisobdan mobil hisobga pul o`tkazish
        </button>
      </nuxt-link>
      <nuxt-link to="/action">
        <button class="btn" type="button">Amaliyotlar</button>
      </nuxt-link>
    </div> -->
  <!-- </div> -->
</template>

<script>
export default {
  // middleware: "auth",
  data() {
    return {
      PaymeNum:'',
      ClickNum:'',
      MobilNum:'',
      line: 1,
      Payme: false,
      Click: false,
      Mobil: false
    };
  },
  created() {
    let links = [{ title: "Qo'llab quvvatlash", name: "call-center" }];
    this.$store.commit("changeBreadCrumb", links);
  },
  methods:{
    verification(){
      console.log(this.PaymeNum)
      this.PaymeNum = this.PaymeNum.replace(/[e,+,-]/g, '') 
    },
    isActivModal(txt){
      if(txt == "Payme"){
        this.Mobil = false
        this.Click = false
        this.Payme =  !this.Payme;
      }else if(txt == "Click"){
        this.Mobil = false
        this.Payme = false;
        this.Click = ! this.Click
        
      }else
      if(txt == "Mobil"){
        this.Click = false
        this.Payme = false;
        this.Mobil = !this.Mobil
      }
    },
  }
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
  transition-duration: .3s;
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
  .ModalForms__inputs{
    position: relative;
    .ModalForms__X{
      cursor: pointer;
      position: absolute;
      top: -20px;
      right:-10px;
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
    margin: 15px 0 0 0 ;
    color:white;
    padding: 15px 30px;
    border-radius: 10px;
    transition-duration: .3s;
    background: rgb(55, 144, 228);
    &:hover{
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
}.ActiveModalForms{
  top:25%;
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
          color: #2D3748;
        }

        a {
          color: rgba(49, 130, 206, 1);
        }

      }

      .MyPractices__cart {
        margin: 10px 0 0 0;
        padding: 12px 17px;
        background: #FFFFFF;
        box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
        border-radius: 10px;

        .MyPractices__txt {
          font-weight: 400;
          font-size: 12px;
          line-height: 15px;
          color: #2D3748;
        }

        .MyPractices__num {
          margin: 12px 0 0 0;
          font-weight: 600;
          font-size: 16px;
          line-height: 100%;
          color: #48BB78;

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
        color: #2D3748;
        display: flex;
        align-items: center;
        background: #FFFFFF;
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
        color: #2D3748;

        .MyPractices__FreeContractsTitle {
          font-weight: bold;
          margin: 0 0 25px 0;
        }

        .MyPractices__FreeContractsCart {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 30px;
          background: #FFFFFF;
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
            background: #3182CE;
            margin: 0 13px 0 0;
          }

          .MyPractices__FreeContractsLine {
            position: relative;
            width: 80%;
            height: 18px;
            border: 1px solid #3182CE;
            border-radius: 10px;

            span {
              position: absolute;
              top: 1px;
              left: 0;
              height: 90%;
              width: 0%;
              background: #3182CE;
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
          background: #FFFFFF;
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
