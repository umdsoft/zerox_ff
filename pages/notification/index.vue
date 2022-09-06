<template>
  <div class="notification px-2 lg:px-4 py-4 rounded-lg bg-white w-full">
    <ul
      class="
  
        flex
        justify-center

        list-none
        border-b-0
        pl-0
        mb-2
        mt-1
      "
      id="tabs-tab"
      role="tablist"
    >
      <li class="nav-item" role="presentation">
        <button
          @click="tab = 0"
          style="position:relative"
          :class="tab === 0 ? 'bg-blue-500 text-white ' : ''"
          class="
            nav-link
            py-2
            block
            font-medium
            rounded
            text-xs
            leading-tight
            border-x-0 border-t-0 border-b-2 border-transparent
            px-6
            my-1

            focus:border-transparent
            active
          "
          id="tabs-home-tab"
          data-bs-toggle="pill"
          data-bs-target="#tabs-home"
          role="tab"
          aria-controls="tabs-home"
          aria-selected="true"
        >
          {{$t('home.notification')}}
              <p v-if="notifications.length" class="noti_count">
            {{ notifications.length }}
          </p>
        </button>
      
      </li>
      <li class="nav-item" role="presentation">
        <button
          @click="tab = 1"
          :class="tab === 1 ? 'bg-blue-500 text-white ' : ''"
          class="
            nav-link
            ml-4
            rounded
            py-2
            block
            font-medium
            text-xs
            leading-tight
            border-x-0 border-t-0 border-b-2 border-transparent
            px-6
            my-1
   
            focus:border-transparent
          "
          id="tabs-profile-tab"
          data-bs-toggle="pill"
          data-bs-target="#tabs-profile"
          role="tab"
          aria-controls="tabs-profile"
          aria-selected="false"
        >
          {{$t('home.news')}}
        </button>
  
      </li>
    </ul>
    
    <div v-if="tab == 0">
      <div v-if="notifications.length > 0">
        <notification
          v-for="item in notifications"
          :key="item.id"
          :getNotifications="getNotifications"
          :item="item"
        />
      </div>
      <div class="flex justify-center" v-else>{{$t('empty')}}</div>
    </div>

    <div v-if="tab === 1">
      <div class="flex justify-center">{{$t('empty')}}</div>
    </div>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
export default {
   middleware:'auth',
  components: {
    Notification,
  },
  data: () => ({
    notifications: [],
    tab: 0,
  }),
  async mounted() {
    this.getNotifications()
  },
  methods:{
  async getNotifications () {
        const response = await this.$axios.get("/notification/me");
    if (response.status == 200) {
      this.notifications = response.data.data;
      // console.log("res", this.notifications);
    }
    }
  }
};
</script>

<style lang="css" scoped>
.noti_count {
  font-size: 8px;
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
