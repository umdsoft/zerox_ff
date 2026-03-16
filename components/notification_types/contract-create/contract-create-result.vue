<template>
  <div>
    <div v-if="item.type === 8">
      <contract-accept
        @ok="(data) => ok(data.id)"
        :item="item"
        :getNotifications="getNotifications"
      />
    </div>
    <div v-if="item.type === 7">
      <contract-reject
        @ok="(data) => ok(data.id)"
        :item="item"
        :getNotifications="getNotifications"
      />
    </div>
    <div v-if="item.type === 18">
      <contract-my-reject
        @ok="(data) => ok(data.id)"
        :item="item"
        :getNotifications="getNotifications"
      />
    </div>
  </div>
</template>

<script>
import contractAccept from "./contract-accept.vue";
import contractReject from "./contract-reject.vue";
import contractMyReject from "./contract-my-reject.vue";
import notificationMixin from '~/mixins/notificationMixin';
export default {
  components: { contractReject, contractAccept,contractMyReject },
  mixins: [notificationMixin],
};
</script>

<style>
</style>
