<template>
  <div>
    <div v-if="item.type == 11">
      <debt-partial-refund-accept
        :item="item"
        :getNotifications="getNotifications"
      />
    </div>
    <div v-if="item.type == 15">
      <debt-partial-refund-reject
        :item="item"
        :getNotifications="getNotifications"
      />
    </div>
  </div>
</template>

<script>
import DebtPartialRefundAccept from "./debt-partialRefund-accept.vue";
import notificationMixin from '~/mixins/notificationMixin';
// SS-AUDIT (2026-09-25): ishlatilmagan komponent ro'yxati/importi olib tashlandi (DebtPartialRefundRejectVue)
export default {
  components: {
    DebtPartialRefundAccept,
  },
  mixins: [notificationMixin],
};
</script>

<style>
</style>
