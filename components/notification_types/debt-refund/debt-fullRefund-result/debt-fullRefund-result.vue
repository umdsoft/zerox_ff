<template>
  <div>
    <div v-if="item.type === 10">
      <debt-full-refund-accept
        @ok="ok"
        :item="item"
        :getNotifications="getNotifications"
      />
    </div>
    <div v-if="item.type === 9">
      <debt-full-refund-reject
        @ok="ok"
        :item="item"
        :getNotifications="getNotifications"
      />
    </div>
  </div>
</template>

<script>
import debtFullRefundAccept from "./debt-fullRefund-accept.vue";
import DebtFullRefundReject from "./debt-fullRefund-reject.vue";
import notificationMixin from '~/mixins/notificationMixin';
export default {
  components: { debtFullRefundAccept, DebtFullRefundReject },
  mixins: [notificationMixin],
};
</script>

<style>
</style>
