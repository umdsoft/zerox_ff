<template>
  <div
    class="nav media-nava flex h-full max-h-[600px] flex-col px-6 w-full max-w-[320px] sm:max-w-[360px] md:w-[400px] md:max-w-none rounded-r-2xl md:rounded-xl bg-white shadow-xl md:shadow-none"
  >
    <div class="flex-1 overflow-y-auto pb-6">
      <div class="px-2 pt-3.5 rounded-xl bg-white w-full">
        <div class="flex justify-between">
          <nuxt-link :to="localePath({ name: 'index' })" @click="$store.commit('Media_Menu_Close', false)"
            class="flex justify-center mx-auto cursor-pointer items-center flex-col mb-3.5">
            <img v-if="$i18n.locale == 'ru'" src="@/assets/img/logo_ru.svg" alt="" width="170"/>
            <img v-if="$i18n.locale == 'uz'" src="@/assets/img/logo.svg" alt="" width="170"/>
            <img v-if="$i18n.locale == 'kr'" src="@/assets/img/logo_kr.svg" alt="" width="170"/>
          </nuxt-link>

          <h2 @click="$store.commit('Media_Menu_Close', false)" class="mt-4 cursor-pointer lg:hidden">
            <IconClose />
          </h2>
        </div>

        <hr class="border-gray-100" />

        <nuxt-link v-if="$auth.loggedIn" :to="localePath({ name: 'mobil-hisob' })" class="md:hidden block">
          <div
            @click="$store.commit('Media_Menu_Close', false)"
            class="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 shadow-sm"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-[11px] font-medium uppercase tracking-wide text-blue-700">
                  {{ $t('navbar.mobile') }}
                </p>
                <p class="text-lg font-semibold text-blue-900">
                  {{ formattedBalance }}
                </p>
              </div>
              <span class="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500">
                <IconMobileBalance />
              </span>
            </div>
          </div>
        </nuxt-link>
        <nuxt-link :to="localePath({ name: 'index' })">
          <div @click="$store.commit('Media_Menu_Close', false)" class="nav-wrapper group flex mt-6 items-center px-2 py-3 rounded-xl transition hover:bg-blue-50">
            <div class="icon rounded-lg flex align-middle p-2 mr-5 bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
              <IconNavHome />
            </div>
            <div class="ml-2">
              <h2 class="text-gray-700 font-xs transition group-hover:text-blue-700">{{ $t("menu.home") }}</h2>
            </div>
          </div>
        </nuxt-link>
        <nuxt-link :to="localePath({ name: 'qr-code' })">
          <div @click="$store.commit('Media_Menu_Close', false)"
            class="nav-wrapper group flex px-2 py-3 items-center rounded-xl transition hover:bg-blue-50">
            <div class="icon rounded-lg flex px-2 py-2 align-middle mr-7 bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
              <IconNavQr />
            </div>
            <div>
              <h2 class="text-gray-700 font-xs transition group-hover:text-blue-700">{{ $t("menu.qr") }}</h2>
            </div>
          </div>
        </nuxt-link>
        <nuxt-link :to="localePath({ name: 'instruction' })">
          <div @click="$store.commit('Media_Menu_Close', false)" class="nav-wrapper group px-2 flex py-3 items-center rounded-xl transition hover:bg-blue-50">
            <div class="icon rounded-lg flex px-2 py-2 align-middle mr-7 bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
              <IconNavInstruction />
            </div>
            <div>
              <h1 class="text-gray-700 font-xs transition group-hover:text-blue-700">{{ $t("menu.foy") }}</h1>
            </div>
          </div>
        </nuxt-link>
        <a href="https://t.me/zeroxuz_bot" target="_blank">
          <div @click="$store.commit('Media_Menu_Close', false)"
            class="nav-wrapper group flex px-2 py-3 items-center rounded-xl transition hover:bg-blue-50">
            <div class="icon rounded-lg flex px-2 py-2 align-middle mr-7 bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
              <IconNavTelegram />
            </div>
            <div>
              <h2 class="text-gray-700 font-xs transition group-hover:text-blue-700">{{ $t("home.chatt") }}</h2>
            </div>
          </div>
        </a>

        <nuxt-link :to="localePath({ name: 'price' })">
          <div @click="$store.commit('Media_Menu_Close', false)" class="nav-wrapper group px-2 flex py-3 items-center rounded-xl transition hover:bg-blue-50">
            <div class="icon rounded-lg flex px-2 py-2 align-middle mr-7 bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">

              <IconNavPrice />

            </div>
            <div>
              <h1 class="text-gray-700 font-xs transition group-hover:text-blue-700">{{ $t("menu.tarif") }}</h1>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>

</template>

<script>
import IconClose from '@/components/icons/IconClose.vue';
import IconMobileBalance from '@/components/icons/IconMobileBalance.vue';
import IconNavHome from '@/components/icons/IconNavHome.vue';
import IconNavQr from '@/components/icons/IconNavQr.vue';
import IconNavInstruction from '@/components/icons/IconNavInstruction.vue';
import IconNavTelegram from '@/components/icons/IconNavTelegram.vue';
import IconNavPrice from '@/components/icons/IconNavPrice.vue';

export default {
  components: {
    IconClose,
    IconMobileBalance,
    IconNavHome,
    IconNavQr,
    IconNavInstruction,
    IconNavTelegram,
    IconNavPrice,
  },
  data() {
    return {
      balance: 0,
    };
  },

  computed: {
    formattedBalance() {
      return this.formatBalance(this.balance);
    },
  },

  mounted() {
    if (process.client) {
      this.restoreBalance();
      this.$root?.$on?.('update-header-balance', this.handleBalanceUpdate);
    }
  },

  beforeDestroy() {
    this.$root?.$off?.('update-header-balance', this.handleBalanceUpdate);
  },

  watch: {
    '$auth.loggedIn'(value) {
      if (!value) {
        this.balance = 0;
      } else if (process.client) {
        this.restoreBalance();
      }
    },
  },

  methods: {
    restoreBalance() {
      if (!process.client) return;
      const stored = window.localStorage.getItem('user_balance');
      this.balance = stored ? Number(stored) || 0 : 0;
    },

    handleBalanceUpdate(payload) {
      if (!payload) return;

      let amount = null;
      if (payload.balance !== undefined) {
        amount = payload.balance;
      } else if (payload.amount?.balance !== undefined) {
        amount = payload.amount.balance;
      } else if (typeof payload.amount === 'number') {
        amount = payload.amount;
      } else if (typeof payload === 'number') {
        amount = payload;
      }

      if (amount !== null && amount !== undefined) {
        this.balance = Number(amount) || 0;
        if (process.client) {
          window.localStorage.setItem('user_balance', String(this.balance));
        }
      }
    },

    formatBalance(value) {
      const number = Number(value) || 0;
      return number
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .nav {
    border-top-right-radius: 50px;
  }
}

.flex:active {
  background: #ffffff;
  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.nuxt-link-active {
  color: blue;
}
</style>
