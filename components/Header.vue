nm<template>
  <header>
    <div class="flex justify-between items-center">
      <ul class="flex media-open bar-btn">
        <li class="text-white tetx-xs font-normal bar-btn">
          <button class="mr-4 mb-4" @click="barClick">
            <svg
              width="27"
              height="17"
              viewBox="0 0 27 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="22" height="3" rx="1.5" fill="#F7FAFC" />
              <rect x="5" y="7" width="22" height="3" rx="1.5" fill="#F7FAFC" />
              <rect y="14" width="22" height="3" rx="1.5" fill="#F7FAFC" />
            </svg>
          </button>
        </li>
      </ul>

      <div class="flex items-center">
        <div class="flex items-center">
          <nuxt-link
            :to="{ name: 'mobil-hisob___' + $i18n.locale }"
            v-if="$auth.loggedIn"
            class="flex items-center"
          >
            <div
              class="ml-4 cash hidden md:flex lg:flex lg:w-64 md:w-64 items-center text-sm bg-white rounded-md justify-between"
            >
              <div class="flex flex-col">
                <span>{{ $t("navbar.mobile") }}: </span>
                <span>{{
                  $auth.user.balance.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }}</span>
              </div>
              <div class="ml-4">
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
          </nuxt-link>
        </div>
      </div>

      <div class="flex items-center">
        <div class="lang">
          <div class="til">
            <h3
              v-if="$i18n.locale == 'uz'"
              class="flex items-center"
              @click.prevent="clickUz"
            >
              Uz
              <span class="flex">
                <img src="@/assets/img/lang/uz.png" alt="" />
              </span>
            </h3>
            <h3
              v-if="$i18n.locale == 'ru'"
              class="flex items-center"
              @click.prevent="clickRu"
            >
              Ру
              <span class="flex">
                <img src="@/assets/img/lang/ru.png" alt="" />
              </span>
            </h3>
            <h3
              v-if="$i18n.locale == 'kr'"
              class="flex items-center"
              @click.prevent="clickKr"
            >
              Уз
              <span class="flex">
                <img src="@/assets/img/lang/uz.png" alt="" />
              </span>
            </h3>

            <span class="flex-center"
              ><svg
                width="13"
                height="8"
                viewBox="0 0 13 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1L6.49996 6.50004L0.999928 1"
                  stroke="white"
                  stroke-width="1.57975"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <div class="ru">
              <h2
                @click.prevent="clickUz"
                class="flex items-center"
                v-if="$i18n.locale !== 'uz'"
              >
                Uz
                <span class="flex">
                  <img src="@/assets/img/lang/uz.png" alt="" />
                </span>
              </h2>
              <h2
                @click.prevent="clickRu"
                class="flex items-center"
                v-if="$i18n.locale !== 'ru'"
              >
                Ру
                <span class="flex">
                  <img src="@/assets/img/lang/ru.png" alt="" />
                </span>
              </h2>
              <h2
                @click.prevent="clickKr"
                class="flex items-center"
                v-if="$i18n.locale !== 'kr'"
              >
                Уз
                <span class="flex">
                  <img src="@/assets/img/lang/uz.png" alt="" />
                </span>
              </h2>
            </div>
          </div>
        </div>

        <nuxt-link
          v-if="$auth.loggedIn"
          class="mr-8 py-1 bell"
          to="/notification"
        >
          <p v-if="notification.length" class="noti_count">
            {{ notification.length }}
          </p>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.1918 13.3324C17.127 13.2543 17.0633 13.1762 17.0008 13.1008C16.1414 12.0613 15.6215 11.434 15.6215 8.4914C15.6215 6.96797 15.2571 5.71797 14.5387 4.78047C14.009 4.08789 13.293 3.5625 12.3492 3.17422C12.3371 3.16746 12.3263 3.1586 12.3172 3.14805C11.9778 2.01133 11.0489 1.25 10.0012 1.25C8.95355 1.25 8.02503 2.01133 7.68558 3.14687C7.67652 3.15704 7.66582 3.16562 7.65394 3.17226C5.45159 4.07891 4.38128 5.81836 4.38128 8.49023C4.38128 11.434 3.86214 12.0613 3.00199 13.0996C2.93949 13.175 2.87581 13.2516 2.81097 13.3312C2.64347 13.5332 2.53735 13.779 2.50516 14.0394C2.47296 14.2999 2.51606 14.5641 2.62933 14.8008C2.87035 15.3086 3.38402 15.6238 3.97034 15.6238H16.0364C16.6199 15.6238 17.1301 15.309 17.3719 14.8035C17.4857 14.5667 17.5292 14.3023 17.4972 14.0416C17.4653 13.7809 17.3593 13.5348 17.1918 13.3324Z"
              fill="white"
            />
            <path
              d="M9.99845 18.75C10.5629 18.7495 11.1167 18.5963 11.6012 18.3066C12.0856 18.0168 12.4826 17.6014 12.75 17.1043C12.7626 17.0805 12.7688 17.0538 12.7681 17.0269C12.7673 16.9999 12.7596 16.9736 12.7457 16.9506C12.7318 16.9275 12.7121 16.9084 12.6887 16.8952C12.6652 16.8819 12.6387 16.875 12.6117 16.875H7.38595C7.35897 16.8749 7.33243 16.8818 7.3089 16.895C7.28537 16.9082 7.26567 16.9273 7.25171 16.9504C7.23774 16.9735 7.23 16.9998 7.22922 17.0268C7.22845 17.0537 7.23467 17.0804 7.24728 17.1043C7.51468 17.6013 7.9116 18.0167 8.39596 18.3065C8.88031 18.5962 9.43405 18.7495 9.99845 18.75Z"
              fill="white"
            />
          </svg>
        </nuxt-link>

        <nuxt-link v-if="$auth.loggedIn" to="/cabinet">
          <div class="flex w-24 lg:w-full flex-col items-center justify-center">
            <img v-if="$auth.user.image" class="rounded-3xl" src="" alt="" />
            <svg
              width="40"
              height="40"
              viewBox="0 0 26 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="13" cy="12.5" rx="13" ry="12.5" fill="white" />
              <path
                d="M15.2107 6.94546C14.6493 6.33576 13.8653 6 12.9999 6C12.13 6 11.3434 6.33373 10.7846 6.93965C10.2198 7.55226 9.94464 8.38483 10.0093 9.28386C10.1373 11.0575 11.4789 12.5004 12.9999 12.5004C14.521 12.5004 15.8603 11.0578 15.9903 9.28444C16.0558 8.39354 15.7789 7.56271 15.2107 6.94546Z"
                fill="#3182CE"
              />
              <path
                d="M18.0768 19.0002H7.92322C7.79032 19.0019 7.6587 18.9738 7.53795 18.9179C7.41719 18.8621 7.31034 18.7798 7.22516 18.6772C7.03766 18.4517 6.96209 18.1438 7.01805 17.8324C7.2615 16.4737 8.02129 15.3324 9.21549 14.5311C10.2764 13.8199 11.6203 13.4284 13 13.4284C14.3797 13.4284 15.7236 13.8202 16.7845 14.5311C17.9787 15.3321 18.7385 16.4734 18.982 17.8321C19.0379 18.1435 18.9623 18.4514 18.7748 18.6769C18.6897 18.7796 18.5828 18.8619 18.4621 18.9178C18.3413 18.9737 18.2097 19.0019 18.0768 19.0002Z"
                fill="#3182CE"
              />
            </svg>

            <div class="text" v-if="$auth.user.type === 1">
              <h1 class="text-white text-center text-xs font-semibold mt-2">
                {{ $auth.user.company }}
              </h1>
            </div>
            <div v-if="$auth.user.type === 2" class="text">
              <h1 class="text-white text-center text-xs font-semibold mt-2">
                {{ $auth.user.last_name }}  {{ $auth.user.first_name }} 
              </h1>
            </div>
          </div>
        </nuxt-link>

        <!-- 
        <nuxt-link v-else to="/cabinet">
          <div class="flex justify-center flex-col items-center">
            <div class="flex justify-center">
              <img src="@/assets/img/user.png" alt="" />
            </div>
            <h1 class="text-white text-xs font-semibold">Kirish</h1>
          </div>
        </nuxt-link> -->
      </div>
    </div>

    <div
      v-if="
        $route.name !== 'index___uz' ||
        $route.name !== 'index___kr' ||
        $route.name !== 'index___ru'
      "
      @click="$router.go(-1)"
      style="cursor: pointer"
      class="back_icon flex mt-4 justify-center items-center text-black bg-white rounded-full w-10 h-10"
    >
      <svg
        width="10"
        height="16"
        viewBox="0 0 10 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.57059 0.856445L1.42773 7.9993L8.57059 15.1422"
          stroke="#152C07"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </header>
</template>

<script>
export default {
  props: ["notification"],
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    links() {
      return this.$store.state.links;
    },
  },
  async created() {
    // try {
    //   this.socket = this.$nuxtSocket({
    //     channel: "/",
    //     // name:'home',
    //     secure: true,
    //     transports: ["websocket"],
    //   });
    // } catch (err) {
    //   console.log(err);
    // }
    // await this.socket.emit("notification", { userId: this.$auth.user.id });
    // await this.socket.on("not", (data) => {
    //   console.log("dds", data.length);
    // });
  },
  methods: {
    barClick() {
      this.$store.commit("Media_Menu_Open", {
        isOpen: true,
      });
    },
    clickUz() {
      this.$i18n.setLocale("uz");
    },
    clickRu() {
      this.$i18n.setLocale("ru");
    },
    clickKr() {
      this.$i18n.setLocale("kr");
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  header {
    .media-open {
      display: block;
    }
    .back_icon {
      display: flex;
    }

    .media-close {
      display: none;
    }
    .bar-btn {
      display: block !important;
    }
  }
}

@media (max-width: 1024px) {
  header {
    .media-open {
      display: block;
    }
    .back_icon {
      display: flex;
    }

    .media-close {
      display: none;
    }
    .bar-btn {
      display: block !important;
    }
  }
}

header {
  .bar-btn {
    display: none;
  }
}
.cash {
  padding: 5px 12px;
  box-shadow: 0px 3px 14px rgba(0, 0, 0, 0.11);
  border-radius: 5px;
}

.bell {
  position: relative;
}

.noti_count {
  font-size: 8px;
  min-width: 15px;
  display: flex;
  color: white;
  position: absolute;
  font-weight: 600;
  top: 0;
  right: -13px;

  align-items: center;
  justify-content: center;
  background: red;
  border-radius: 50%;
}
.back_icon {
  display: none;
}

.til {
  cursor: pointer;
  padding: 5px 10px;
  transition: 0.2s;
  margin-right: 15px;
  span {
    svg {
      transition: 0.3s;
    }
  }
  &:hover {
    span {
      svg {
        transform: rotate(-180deg);
      }
    }
    .ru {
      display: block;
      z-index: 12;
    }
  }
  position: relative;
  h3 {
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #ffffff;
    span {
      margin: 0 10px;
    }
  }
  .ru {
    display: none;
    width: 100%;
    top: 30px;
    left: 5px;
    position: absolute;
    left: 0;
    background: #ffffff;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    border-radius: 0px 0px 6px 6px;
    position: absolute;

    h2 {
      padding: 5px 10px;
      font-weight: bold;
      font-size: 14px;
      line-height: 18px;
      color: #000000;
      img {
        margin-left: 10px;
      }
      &:hover {
        background: #d3d3d3;
      }
    }
  }

  display: flex;
  align-items: center;
}
.noAvaterSvg {
  fill: white;
  padding: 5px 0px 0px 0px;
  border-radius: 50%;
  background: gray;
}
</style>
