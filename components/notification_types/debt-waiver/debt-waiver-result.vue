<template>
  <div>
    <div v-if="item.type === 4">
      <debt-full-waiver :item="item" :getNotifications="getNotifications" />
    </div>
    <div v-if="item.type === 5">
      <debt-partial-waiver :item="item" :getNotifications="getNotifications" />
    </div>
  </div>
</template>

<script>
import debtFullWaiver from "./debt-fullWaiver.vue";
import debtPartialWaiver from "./debt-partialWaiver.vue";
import notificationMixin from '~/mixins/notificationMixin';
export default {
  components: { debtFullWaiver, debtPartialWaiver },
  mixins: [notificationMixin],
};
</script>

<style>
</style>