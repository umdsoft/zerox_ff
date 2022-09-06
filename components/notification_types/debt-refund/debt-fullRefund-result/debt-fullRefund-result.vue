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
export default {
  components: { debtFullRefundAccept, DebtFullRefundReject },
  methods: {
    async ok(id) {
      try {
        await this.$axios.$put(`/notification/ok/${id}`);
          this.$toast.success("Muvaffaqiyatli bajarildi");
        this.getNotifications();
      } catch (err) {
        this.$toast.error("Xatolik yuz berdi");
      }
    },
  },
  props: ["item", "getNotifications"],
};
</script>

<style>
</style>