<template>
  <div class="banner">
    <swiper style="width: 100%" class="swiper" :options="options">
      <swiper-slide>
        <div class="md:grid md:grid-cols-3 gap-4 pt-4 px-3 md:py-2 md:px-6" v-if="$i18n.locale == 'uz'">
          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-1 col-span-2">
            <div>
              <div class="mb-4 md:mb-[18px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">QARZ</div>
                <div class="text-sm md:text-lg">
                  <span class="font-bold">ZeroX</span> - jismoniy va yuridik shaxslarning
                  o‘zaro qarz munosabatlarini elektron tarzda ro‘yxatga olish va nazorat qilish tizimi.
                </div>
              </div>

              <button
                class="py-2 px-4 text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">Batafsil</button>
            </div>
          </div>


          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-2 col-span-1">
            <img src="@/assets/Qarz.png" alt="">
          </div>
        </div>

        <div class="md:grid md:grid-cols-3 gap-4 pt-4 px-3 md:py-2 md:px-6" v-if="$i18n.locale == 'kr'">
          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-1 col-span-2">
            <div>
              <div class="mb-4 md:mb-[18px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">ҚАРЗ</div>
                <div class="text-sm md:text-lg">
                  <span class="font-bold">ZeroX</span> - жисмоний ва юридик шахсларнинг ўзаро қарз муносабатларини
                  электрон тарзда рўйхатга олиш ва назорат қилиш тизими.
                </div>
              </div>

              <button
                class="py-2 px-4 text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">Батафсил</button>
            </div>
          </div>


          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-2 col-span-1">
            <img src="@/assets/Qarz.png" alt="">
          </div>
        </div>

        <div class="md:grid md:grid-cols-3 gap-4 pt-4 px-3 md:py-2 md:px-6" v-if="$i18n.locale == 'ru'">
          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-1 col-span-2">
            <div>
              <div class="mb-4 md:mb-[18px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">ДОЛГ</div>
                <div class="text-sm md:text-lg">
                  <span class="font-bold">ZeroX</span> - система электронной регистрации и контроля взаимных долговых
                  отношений физических и юридических лиц.
                </div>
              </div>

              <button
                class="py-2 px-4 text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">Подробно</button>
            </div>
          </div>


          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-2 col-span-1">
            <img src="@/assets/Qarz.png" alt="">
          </div>
        </div>

      </swiper-slide>

      <swiper-slide>
        <div class="md:grid md:grid-cols-3 gap-2 pt-4 px-3 md:py-2 md:px-9" v-if="$i18n.locale == 'uz'">
          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-1 col-span-1">
            <img src="@/assets/telefon.png" alt="">
          </div>

          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-2 col-span-2">
            <div>
              <div class="mb-4 md:mb-[28px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">MOBIL ILOVA</div>
                <div class="text-sm md:text-lg">
                  Foydalanuvchilar mobil ilovani yuklab olish orqali debitor va kreditor
                  qarzdorliklarini kunlik nazorat qilishda qulayliklarga ega bo‘lishadi.
                </div>
              </div>

              <button class="py-2 px-4 text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">
                Mobil ilovani yuklab olish
              </button>
            </div>
          </div>
        </div>

        <div class="md:grid md:grid-cols-3 gap-2 pt-4 px-3 md:py-2 md:px-9" v-if="$i18n.locale == 'kr'">
          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-1 col-span-1">
            <img src="@/assets/telefon.png" alt="">
          </div>

          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-2 col-span-2">
            <div>
              <div class="mb-4 md:mb-[28px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">МОБИЛ ИЛОВА</div>
                <div class="text-sm md:text-lg">
                  Фойдаланувчилар мобил иловани юклаб олиш орқали дебитор ва кредитор қарздорликларини кунлик назорат
                  қилишда қулайликларга эга бўлишади.
                </div>
              </div>

              <button class="py-2 px-4 text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">
                Мобил иловани юклаб олиш
              </button>
            </div>
          </div>
        </div>

        <div class="md:grid md:grid-cols-3 gap-2 pt-4 px-3 md:py-2 md:px-9" v-if="$i18n.locale == 'ru'">
          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-1 col-span-1">
            <img src="@/assets/telefon.png" alt="">
          </div>

          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-2 col-span-2">
            <div>
              <div class="mb-4 md:mb-[28px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">МОБИЛЬНОЕ ПРИЛОЖЕНИЕ</div>
                <div class="text-sm md:text-lg">
                  Пользователи получат возможность удобно осуществлять ежедневный контроль дебиторской и кредиторской
                  задолженности с помощью мобильного приложения.
                </div>
              </div>

              <button class="py-2 px-4 text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">
                Скачать мобильное приложение
              </button>
            </div>
          </div>
        </div>

      </swiper-slide>

      <swiper-slide>
        <div class="md:grid md:grid-cols-3 gap-2 pt-4 px-3 md:py-6 md:px-9" v-if="$i18n.locale == 'uz'">
          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-1 col-span-2">
            <div>
              <div class="mb-4 md:mb-[28px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">QARZ SHARTNOMASI</div>
                <div class="text-sm md:text-lg">
                  Mobil ilova va veb-sayt orqali qarz shartnomalari elektron tarzda rasmiylashtiriladi.
                </div>
              </div>
              <div class="pb-6 md:pb-0">
                <button
                  class="py-2 px-4 text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">Batafsil</button>
              </div>
            </div>
          </div>

          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-2 col-span-1">
            <img src="@/assets/shartnoma.png" alt="">
          </div>
        </div>

        <div class="md:grid md:grid-cols-3 gap-2 pt-4 px-3 md:py-6 md:px-9" v-if="$i18n.locale == 'kr'">
          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-1 col-span-2">
            <div>
              <div class="mb-4 md:mb-[28px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">ҚАРЗ ШАРТНОМАСИ</div>
                <div class="text-sm md:text-lg">
                  Мобил илова ва веб-сайт орқали қарз шартномалари электрон тарзда расмийлаштирилади.
                </div>
              </div>
              <div class="pb-6 md:pb-0">
                <button
                  class="py-2 px-4 text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">Батафсил</button>
              </div>
            </div>
          </div>

          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-2 col-span-1">
            <img src="@/assets/shartnoma.png" alt="">
          </div>
        </div>

        <div class="md:grid md:grid-cols-3 gap-2 pt-4 px-3 md:py-6 md:px-9" v-if="$i18n.locale == 'ru'">
          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-1 col-span-2">
            <div>
              <div class="mb-4 md:mb-[28px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">ДОГОВОР ЗАЙМА</div>
                <div class="text-sm md:text-lg">
                  Договоры займа оформляются в электронном виде посредством мобильного приложения и веб-сайта.
                </div>
              </div>
              <div class="pb-6 md:pb-0">
                <button
                  class="py-2 px-4 text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">Подробно</button>
              </div>
            </div>
          </div>

          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-2 col-span-1">
            <img src="@/assets/shartnoma.png" alt="">
          </div>
        </div>

      </swiper-slide>

      <swiper-slide>
        <div class="md:grid md:grid-cols-3 gap-2 pt-4 px-3 md:py-6 md:px-9" v-if="$i18n.locale == 'uz'">
          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-1 col-span-1">
            <img src="@/assets/myid.png" alt="">
          </div>

          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-2 col-span-2">
            <div>
              <div class="mb-4 md:mb-[28px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">IDENTIFIKATSIYA</div>
                <div class="text-sm md:text-lg">
                  Jismoniy shaxslar MyID orqali identifikatsiyadan o‘tgan holda tizimdan foydalanish imkoniga ega
                  bo‘lishadi.
                </div>
              </div>

              <button
                class="py-2 px-4  text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">Batafsil</button>
            </div>
          </div>
        </div>

        <div class="md:grid md:grid-cols-3 gap-2 pt-4 px-3 md:py-6 md:px-9" v-if="$i18n.locale == 'kr'">
          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-1 col-span-1">
            <img src="@/assets/myid.png" alt="">
          </div>

          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-2 col-span-2">
            <div>
              <div class="mb-4 md:mb-[28px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">ИДЕНТИФИКАЦИЯ</div>
                <div class="text-sm md:text-lg">
                  Жисмоний шахслар MyID орқали идентификациядан ўтган ҳолда тизимдан фойдаланиш имконига эга бўлишади.
                </div>
              </div>

              <button
                class="py-2 px-4  text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">Батафсил</button>
            </div>
          </div>
        </div>

        <div class="md:grid md:grid-cols-3 gap-2 pt-4 px-3 md:py-6 md:px-9" v-if="$i18n.locale == 'ru'">
          <!-- Image Container (1/3 of the space) -->
          <div class="hidden md:block p-6 order-1 col-span-1">
            <img src="@/assets/myid.png" alt="">
          </div>

          <!-- Text Container (2/3 of the space) -->
          <div class="flex items-center md:pl-6 order-2 col-span-2">
            <div>
              <div class="mb-4 md:mb-[28px]">
                <div class="text-xl md:text-3xl mb-2 text-customBlue">ИДЕНТИФИКАЦИЯ</div>
                <div class="text-sm md:text-lg">
                  Физические лица смогут воспользоваться системой после прохождения идентификации через MyID.
                </div>
              </div>

              <button
                class="py-2 px-4  text-sm md:text-base md:px-6 md:py-2 rounded-md text-white bg-t_primary">Подробно</button>
            </div>
          </div>
        </div>

      </swiper-slide>

      <div class="swiper-pagination px-4 pb-4 vertical" slot="pagination"></div>
    </swiper>

  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import QarzIcon from "./svg/qarz.vue";
import TelefonIcon from "./svg/telefon.vue";
import Contract from './svg/contract.vue'
import Identy from './svg/iden.vue'

import "swiper/css/swiper.css";
export default {
  components: {
    Swiper,
    SwiperSlide,
    QarzIcon,
    TelefonIcon,
    Contract,
    Identy
  },

  data: () => ({
    options: {
      direction: "horizontal",
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      loop: true,
      effect: "fade",
      autoplay: {
        delay: 5000, // 5 soniyada bir slayd o'tadi
        disableOnInteraction: false, // Foydalanuvchi slayd bilan o'zaro aloqada bo'lsa ham autoplay davom etadi
      },
      autoplay: false,
    },
  }),
};
</script>

<style lang="scss" scoped>
@media (max-width: 767px) {
  .banner {
    height: auto;
    padding: 10px;
  }

  img {
    height: 150px !important;
    object-fit: cover;
  }

  .swiper-slide {
    height: 150ph !important;
    flex-direction: column;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .banner {
    height: auto;
    padding: 5px;

    .swiper-slide {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px;
    }

    .swiper-slide h1 {
      font-size: 1.8rem;
      line-height: 2;
    }

    .swiper-slide p {

      padding: 0 5px;
    }

    button {
      width: 60%;
      padding: 8px;
    }

    img,
    svg {
      height: 100px;
      object-fit: cover;
      width: 100%;
    }
  }
}

@-webkit-keyframes progress {
  0% {
    stroke-dashoffset: -75;
    opacity: 1;
  }

  95% {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  100% {
    opacity: 0;
    stroke-dashoffset: 0;
  }
}

@-moz-keyframes progress {
  0% {
    stroke-dashoffset: -75;
    opacity: 1;
  }

  95% {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  100% {
    opacity: 0;
    stroke-dashoffset: 0;
  }
}

@-o-keyframes progress {
  0% {
    stroke-dashoffset: -75;
    opacity: 1;
  }

  95% {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  100% {
    opacity: 0;
    stroke-dashoffset: 0;
  }
}

@keyframes progress {
  0% {
    stroke-dashoffset: -75;
    opacity: 1;
  }

  95% {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  100% {
    opacity: 0;
    stroke-dashoffset: 0;
  }
}

.swiper-container {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  font-size: 18px;
  background-color: #fff !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-pagination-bullet {
  background-color: white !important;
  margin-top: 30px;
  opacity: 1;
}

.swiper-pagination-bullet--svg-animation {
  width: 26px;
  height: 26px;
  margin: 0 6px !important;
  display: inline-block;
}

.swiper-pagination-bullet--svg-animation svg {
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform: rotate(-90deg);
}

.swiper-pagination-bullet--svg-animation .svg__circle-inner {
  stroke: #000;
  fill: transparent;
  -webkit-transition: all 0.7s ease;
  -moz-transition: all 0.7s ease;
  -ms-transition: all 0.7s ease;
  -o-transition: all 0.7s ease;
  transition: all 0.7s ease;
}

.swiper-pagination-bullet-active .svg__circle {
  stroke: #000;
  stroke-dasharray: 75;
  stroke-dashoffset: 0;
  -webkit-animation: progress 7s ease-in-out 1 forwards;
  -moz-animation: progress 7s ease-in-out 1 forwards;
  -ms-animation: progress 7s ease-in-out 1 forwards;
  animation: progress 7s ease-in-out 1 forwards;
}

.swiper-pagination-bullet-active .svg__circle-inner {
  fill: #000;
}

#swiper {
  width: 500px;
}

#swiper .swiper-container {
  padding-bottom: 3rem;
}

#swiper .swiper-slide {
  background-color: #eaeaea;
}

#swiper .swiper-pagination {
  position: absolute;

  bottom: 0;
}

.banner {
  position: relative;
  border-radius: 10px;
  background: white;
  overflow: hidden;

}

img {
  width: 100%;
  border-radius: 10px;
  height: 200px;
}



#right-icon {
  box-shadow: 10px 0 15px -5px rgba(45, 98, 182, 0.5) !important;
}

svg.left-icon {
  box-shadow: -10px 0 15px -5px blue !important;
}

.swiper-container-horizontal>.swiper-pagination-bullets {
  bottom: -6px;
}
</style>
