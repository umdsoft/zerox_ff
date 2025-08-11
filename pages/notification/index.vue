<template>
  <div class="notification px-2 lg:px-4 py-4 rounded-lg bg-white w-full">
    <ul class="flex justify-center list-none border-b-0 pl-0 mb-2 mt-1" id="tabs-tab" role="tablist">
      <li class="nav-item" role="presentation">
        <button @click="tab = 0" style="position: relative" :class="tab === 0 ? 'bg-blue-500 text-white ' : ''"
          class="nav-link py-2 block rounded leading-tight border-x-0 border-t-0 border-b-2 border-transparent px-6 my-1 focus:border-transparent active"
          id="tabs-home-tab" data-bs-toggle="pill" data-bs-target="#tabs-home" role="tab" aria-controls="tabs-home"
          aria-selected="true">
          {{ $t("home.notification") }}
          <p v-if="notifications.length" class="noti_count">
            {{ notifications.length }}
          </p>
        </button>
      </li>
      <!-- <li class="nav-item" role="presentation">
        <button @click="tab = 1" :class="tab === 1 ? 'bg-blue-500 text-white ' : ''"
          class="nav-link ml-4 rounded py-2 block leading-tight border-x-0 border-t-0 border-b-2 border-transparent px-6 my-1 focus:border-transparent"
          id="tabs-profile-tab" data-bs-toggle="pill" data-bs-target="#tabs-profile" role="tab"
          aria-controls="tabs-profile" aria-selected="false">
          {{ $t("home.news") }}
        </button>
      </li> -->
    </ul>

    <div v-if="tab == 0">
      <div v-if="notifications.length > 0">
        <notification v-for="item in notifications" :key="item.id" :getNotifications="getNotifications" :item="item" />
      </div>
      <div class="flex justify-center" v-else>{{ $t("empty") }}</div>
    </div>

    <div v-if="tab === 1">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <news-component v-for="item in news" :key="item.id" :getNews="news" :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import NewsComponent from "../../components/NewsComponent.vue";

export default {
  middleware: "auth",
  components: {
    Notification,
    NewsComponent
  },

  data: () => ({
    notifications: [],
    news: [],
    tab: 0,
    balance: 0,
  }),

  mounted() {
    this.getNews();
    this.setupSocketWithRetry();
    this.checkContractRedirect();

    const storedBalance = localStorage.getItem("user_balance");
    if (storedBalance) {
      this.balance = parseFloat(storedBalance);
    }
  },

  activated() {
    const socket = this.getSocket();
    if (socket?.connected) {
      this.subscribeToNotifications();
    } else {
      this.setupSocketWithRetry();
    }
  },

  deactivated() {
    this.removeNotificationListener();
  },

  methods: {
    getSocket() {
      return this.$root?.socket || null;
    },

    setupSocketWithRetry() {
      const interval = setInterval(() => {
        const socket = this.getSocket();
        if (socket?.connected) {
          clearInterval(interval);
          this.subscribeToNotifications();
        }
      }, 300);
    },

    subscribeToNotifications() {
      const socket = this.getSocket();
      if (!socket) return;

      // 💡 Avvalgi listenerlarni tozalash
      this.removeNotificationListener();

      // 🔄 Listenerni yozish
      socket.on("recive_notification", this.handleNotification);

      // 📤 Ma’lumot so‘rash
      this.emitNotificationRequest();
    },

    removeNotificationListener() {
      const socket = this.getSocket();
      if (socket) {
        socket.off("recive_notification", this.handleNotification);
      }
    },

    emitNotificationRequest() {
      const socket = this.getSocket();
      if (socket?.connected) {
        socket.emit("send_notification", {
          id: this.$auth.user.id,
        });
      }
    },

    handleNotification(data) {
      console.log("📨 Yangi Notification:", data);

      this.notifications = data.notification || [];
      this.balance = data.amount?.balance || 0;

      // 🔄 Headerga uzatish
      this.$root.$emit("update-header-balance", {
        balance: this.balance,
        notifications: this.notifications,
      });

      // 💾 localStorage sinxronizatsiya
      localStorage.setItem("user_balance", this.balance);
      localStorage.setItem("user_notifications", JSON.stringify(this.notifications));
    },

    async getNews() {
      try {
        const news = await this.$axios.$get(`news/get?lang=${this.$i18n.locale}`);
        this.news = news.data;
      } catch (err) {
        console.error("❌ Yangiliklarni olishda xatolik:", err);
      }
    },

    checkContractRedirect() {
      const user = this.$auth.user;
      if (user.is_active === 1 && user.is_contract === 0) {
        this.$router.push(this.localePath({ name: "universal_contract" }));
      }
    },
  },
};

</script>

<style lang="css" scoped>
.noti_count {
  font-size: 12px;
  min-width: 15px;
  min-height: 15px;
  display: flex;
  color: white;
  position: absolute;
  font-weight: 600;
  top: 3px;
  right: 5px;
  align-items: center;
  justify-content: center;
  background: red;
  border-radius: 50%;
}
</style>
