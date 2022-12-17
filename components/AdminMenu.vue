<template>
  <div>
    <nav :class="isMobile ? 'nav active-mobile-nav ' : 'nav scroll'">
      <div class="logo-shop">
        <div class="logo-shop__inner">
          <svg
            width="89"
            height="35"
            viewBox="0 0 89 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.8103 62.4585V64.1934H6.2511V62.8109L18.8286 46.9536H6.44085V45.2187H21.485V46.6012L8.93466 62.4585H21.8103ZM37.389 57.6607H25.4621C25.5705 59.1425 26.1397 60.3442 27.1698 61.2658C28.1998 62.1694 29.5009 62.6212 31.0731 62.6212C31.9586 62.6212 32.7718 62.4676 33.5127 62.1604C34.2536 61.8351 34.8952 61.3652 35.4373 60.7508L36.5216 61.9977C35.8891 62.7567 35.0939 63.335 34.1362 63.7325C33.1965 64.1301 32.1574 64.3289 31.0189 64.3289C29.5552 64.3289 28.254 64.0217 27.1156 63.4073C25.9952 62.7748 25.1187 61.9074 24.4862 60.805C23.8537 59.7027 23.5375 58.4558 23.5375 57.0643C23.5375 55.6729 23.8357 54.4259 24.432 53.3236C25.0464 52.2213 25.8777 51.3629 26.9258 50.7485C27.992 50.1341 29.1847 49.8269 30.5039 49.8269C31.8231 49.8269 33.0067 50.1341 34.0549 50.7485C35.103 51.3629 35.9252 52.2213 36.5216 53.3236C37.1179 54.4079 37.4161 55.6548 37.4161 57.0643L37.389 57.6607ZM30.5039 51.4804C29.1305 51.4804 27.9739 51.9231 27.0342 52.8086C26.1126 53.676 25.5886 54.8145 25.4621 56.224H35.5728C35.4463 54.8145 34.9132 53.676 33.9735 52.8086C33.0519 51.9231 31.8954 51.4804 30.5039 51.4804ZM43.1766 52.7273C43.6284 51.7695 44.2971 51.0467 45.1825 50.5587C46.0861 50.0708 47.1975 49.8269 48.5166 49.8269V51.6972L48.0558 51.6701C46.5559 51.6701 45.3813 52.1309 44.532 53.0525C43.6826 53.9742 43.258 55.2663 43.258 56.9288V64.1934H41.3334V49.9353H43.1766V52.7273ZM57.6969 64.3289C56.3235 64.3289 55.0856 64.0217 53.9833 63.4073C52.881 62.7748 52.0135 61.9074 51.3811 60.805C50.7486 59.7027 50.4323 58.4558 50.4323 57.0643C50.4323 55.6729 50.7486 54.4259 51.3811 53.3236C52.0135 52.2213 52.881 51.3629 53.9833 50.7485C55.0856 50.1341 56.3235 49.8269 57.6969 49.8269C59.0703 49.8269 60.3082 50.1341 61.4105 50.7485C62.5128 51.3629 63.3712 52.2213 63.9856 53.3236C64.6181 54.4259 64.9344 55.6729 64.9344 57.0643C64.9344 58.4558 64.6181 59.7027 63.9856 60.805C63.3712 61.9074 62.5128 62.7748 61.4105 63.4073C60.3082 64.0217 59.0703 64.3289 57.6969 64.3289ZM57.6969 62.6212C58.7089 62.6212 59.6124 62.3953 60.4076 61.9435C61.2208 61.4737 61.8532 60.8141 62.305 59.9647C62.7568 59.1154 62.9827 58.1486 62.9827 57.0643C62.9827 55.9801 62.7568 55.0133 62.305 54.1639C61.8532 53.3146 61.2208 52.664 60.4076 52.2122C59.6124 51.7424 58.7089 51.5075 57.6969 51.5075C56.6849 51.5075 55.7723 51.7424 54.9591 52.2122C54.164 52.664 53.5315 53.3146 53.0617 54.1639C52.6099 55.0133 52.384 55.9801 52.384 57.0643C52.384 58.1486 52.6099 59.1154 53.0617 59.9647C53.5315 60.8141 54.164 61.4737 54.9591 61.9435C55.7723 62.3953 56.6849 62.6212 57.6969 62.6212Z"
              fill="#2D62B6"
            />
            <path
              d="M81.1699 64.1934L75.0439 55.8445L68.9449 64.1934H66.6408L73.8512 54.435L67.1016 45.2187H69.4057L75.1252 52.9712L80.8176 45.2187H82.9861L76.2636 54.3808L83.5011 64.1934H81.1699Z"
              fill="#FE5E58"
            />
          </svg>
        </div>
      </div>
      <div class="menu-nav">
        <ul class="menu-nav-ul">
          <li v-for="(item, index) in menu" :key="index">
            <a
              href="#"
              v-if="item.items != undefined"
              @click="toggleMenu(index)"
            >
              {{ item.title }}
            </a>

            <nuxt-link
              v-else
              :to="{ path: item.route }"
              @click.native="hideMobile"
            >
      
              {{ item.title }}
            </nuxt-link>

            <ul
              :class="item.isOpen ? 'menu-accordion open' : 'menu-accordion'"
              v-if="item.items"
            >
              <li v-for="(i, j) in item.items" :key="j">
                <nuxt-link
                  nuxt-link-exact-link
                  @click.native="hideMobile"
                  :to="{ path: i.itemRoute }"
                  >{{ i.itemTitle }}</nuxt-link
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
    <div
      @click="isMobile = false"
      :class="isMobile ? 'fixvh active-mobile-vh' : 'fixvh'"
    ></div>
    <div class="header">
      <div class="header__inner">
        <div class="header-left"></div>

        <div class="header-right" v-if="$auth.user">
          <div class="profile-dropdown">
            <button
              v-click-outside="hide"
              @click="toggleProfile"
              type="button"
              :class="isDropdown ? 'bt-dropdown __active' : 'bt-dropdown'"
              data-target="profile-dropdown"
            >
              <h5>{{ $auth.user.first_name }} {{ $auth.user.last_name }}</h5>
              <span> <fa icon="angle-down" /> </span>
            </button>
            <div
              v-if="isDropdown"
              class="dropdown-content my-dropdown"
              id="profile-dropdown"
            >
              <button class="logout"  @click="$auth.logout()">
                <fa class="icon-profile logout-icon" icon="power-off" />
                Chiqish</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

Vue.directive("click-outside", {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his childrens
      if (!(el === event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind: function (el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});
export default {
  data() {
    return {
      isDropdown: false,
      isMobile: false,
      menu: [
        {
          route: "/admin",
          ricon: "home",
          title: "Dashboard",
        },
        {
          route: "/admin/news",
          ricon: "news",
          title: "Yangiliklar",
        },

        {
          route: "/admin/users",
          ricon: "users-cog",
          licon: "angle-down",
          title: "Foydalanuvchilar",
          isOpen: false,
          items: [
            {
              itemRoute: "/admin/users/legal",
              itemTitle: "Yuridik shaxslar",
            },
            {
              itemRoute: "/admin/users/users",
              itemTitle: "Jismoniy shaxslar",
            },
          ],
        },
        {
          route: "/admin/transfer/payment",
          ricon: "users-cog",
          licon: "angle-down",
          title: "Amaliyotlar",
          isOpen: false,
          items: [
            {
              itemRoute: "/admin/transfer/payment",
              itemTitle: "Tushgan mablag`lar",
            },
            {
              itemRoute: "/admin/transfer/mobil-transfer",
              itemTitle: "O'tkazmalar",
            },
            {
              itemRoute: "/admin/transfer/paid",
              itemTitle: "Yechilgan mablag`lar",
            },
          ],
        },
        {
          route: "/admin/contracts",
          ricon: "list-alt",
          title: "Qarz shartnomalari",
        },
        {
          route: "/admin/#",
          ricon: "chart-line",
          title: "Tahlil",
        },
        {
          route: "/admin/setting",
          ricon: "users-cog",
          licon: "angle-down",
          title: "Sozlamalar",
          isOpen: false,
          items: [
            {
              itemRoute: "/admin/setting/banner",
              itemTitle: "Reklama",
            },
            {
              itemRoute: "/admin/setting/payment",
              itemTitle: "To`lov tizimlari bo’yicha",
            },
          ],
        },
        {
          route: "/admin/mobile-bill",
          ricon: "users-cog",
          licon: "angle-down",
          title: "Mobil hisob raqam bo'yicha hisobot",
          isOpen: false,
          items: [
            {
              itemRoute: "/admin/mobile-bill/iden-report",
              itemTitle: "Identifikatsiya jarayoni bo’yicha",
            },
            {
              itemRoute: "/admin/setting/payment",
              itemTitle: "Qarz shartnomalari bo’yicha",
            },
          ],
        },
        {
          route: "/admin/#",
          ricon: "headset",
          title: "Foydalanuvchilar bilan aloqa",
        },
      ],
      user: null,
    };
  },
  async mounted() {},
  methods: {
   
    toggleMenu(e) {
      // this.menu.forEach(element => {
      // 	element.isOpen = false;
      // });
      this.menu[e].isOpen = !this.menu[e].isOpen;
    },
    hideMobile() {
      this.isMobile = false;
    },
    toggleProfile() {
      this.isDropdown = !this.isDropdown;
    },
    hide() {
      this.isDropdown = false;
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  a.nuxt-link-active {
    background-color: #38445a;
    color: #b6daff !important;
    .left-icon {
      color: #b6daff !important;
    }
  }
}
.toggle-enter-active,
.toggle-leave-active {
  transition: all 2s;
}
nav.nav {
  width: 240px;
  position: fixed;
  overflow: visible;
  top: 0;
  display: block;
  left: 0;
  height: 100vh;
  z-index: 15;
  overflow: auto;
  background-color: #38445a;
  box-shadow: 0px 0px 8px rgba($color: #000000, $alpha: 0.15);
  div.logo-shop {
    display: flex;
    justify-content: center;
    height: 60px;
    width: 100%;
    align-items: center;
    background-color: #f8fbff;
    div.logo-shop__inner {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    a {
      display: flex;
      align-items: center;
    }
  }
  div.menu-nav {
    padding: 15px 0px;
  }
  ul.menu-nav-ul {
    list-style-type: none;
    padding-left: 0px;
    margin-bottom: 0px;
    li {
      display: block;
      .left-icon {
        margin-right: 10px;
        font-size: 16px;
        color: #dcdcdc;
        max-width: 20px;
        min-width: 20px;
      }
      .icon {
        font-size: 11px;
        float: right;
        margin-top: 5px;
      }
    }
    // a.nuxt-link-exact-active {
    //     background-color: $gc !important;
    //     color: #fff !important;
    // }
    li > a {
      display: block;
      padding: 12px 25px;
      transition: 0.3s font-weight;
      color: #dcdcdc;
      font-size: 14px;
      transition: 0.3s;
      font-weight: normal;

      &:hover {
        background-color: #38445a;
      }
    }
  }
  ul.menu-accordion {
    // padding-left: 40px;
    // background-color: #f6f6f6;
    display: none;
    a {
      padding-left: 50px !important;
    }
  }
  ul.open {
    display: block;
    border-left: 4px solid #b6daff;
  }
  .icon-rotate {
    transform: rotate(-180deg) !important;
  }
}
div.fixvh {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  display: none;
  left: 0;
  background-color: rgba($color: #000000, $alpha: 0.6);
  z-index: 90;
}
div.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 13;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 0px 8px rgba($color: #000000, $alpha: 0.15);
  background-color: #fff;

  div.header__inner {
    margin-left: 240px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0px 20px;
    align-items: center;

    div.header-left {
      .header__bars {
        font-size: 22px;

        cursor: pointer;
      }
    }

    div.header-right {
      height: 100%;

      div.profile-dropdown {
        height: 100%;
        position: relative;

        h5 {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 0px;
          margin-left: 10px;
        }

        div.img-pro {
          width: 38px;
          height: 38px;
          position: relative;
          border-radius: 100%;
          overflow: hidden;

          img {
            width: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        button {
          padding: 5px 15px;
          height: 100%;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
        }

        button.__active {
          background-color: #eee;
        }

        span {
          margin-left: 10px;
          font-weight: 400;
        }

        div.dropdown-content {
          position: absolute;
          right: 0;
          padding: 4px 0px;
          width: 170px;
          background-color: #fff;
          z-index: 30;
          display: block;
          border-radius: 3px;
          border: 1px solid rgba(0, 0, 0, 0.15);

          a {
            display: block;
            background-color: #ffffff;
            padding: 0.5rem 1rem;
            color: #212529;
            font-size: 13px;
            line-height: 20px;

            i {
              min-width: 20px;
              font-size: 16px;
            }

            b {
              font-weight: 400;
              margin-left: 6px;
            }

            &:hover {
              background-color: #f0f4f7;
              color: #354558;
            }
          }

          hr {
            margin: 8px 0px;
          }

          .icon-profile {
            margin-right: 10px;
          }

          a.logout {
            .logout-icon {
              color: #fc5454 !important;
            }

            color: #fc5454 !important;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  nav.nav {
    position: fixed;
    top: 0;
    // left: 0;
    z-index: 99;
    transform: translateX(-102%);
    transition: 0.5s;
  }
  div.header__inner {
    margin-left: 0px !important;
  }

  nav.active-mobile-nav {
    transform: translateX(0%);
  }

  div.active-mobile-vh {
    display: block;
  }
}
</style>
