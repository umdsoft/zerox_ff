<template>
  <div class="notification-wrapper w-full">
    <!-- Contract Create -->
    <div v-if="item.type == 0 && $auth.user.id === item.reciver" class="notification-card-wrapper">
      <contract-create :item="item" :getNotifications="getNotifications" :getSockNot="getSockNot" />
    </div>

    <!-- Debt Refund -->
    <div v-if="item.type === 1 || (item.type === 2 && $auth.user.id === item.reciver)" class="notification-card-wrapper">
      <debt-refund :item="item" :getNotifications="getNotifications" />
    </div>

    <!-- Debt Extend -->
    <div v-if="item.type == 3 && $auth.user.id === item.reciver" class="notification-card-wrapper">
      <debt-extend :item="item" :getNotifications="getNotifications" />
    </div>

    <!-- Debt Waiver Result -->
    <div v-if="item.type == 4 || (item.type === 5 && $auth.user.id === item.reciver)" class="notification-card-wrapper">
      <debt-waiver-result :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Contract Create Result -->
    <div v-if="item.type == 8 || (item.type === 7 && $auth.user.id === item.reciver)" class="notification-card-wrapper">
      <contract-create-result :getNotifications="getNotifications" :item="item" />
    </div>

    <div v-if="item.type === 18 && $auth.user.id === item.reciver" class="notification-card-wrapper">
      <contract-create-result :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Debt Full Refund Result -->
    <div v-if="item.type == 9 || (item.type == 10 && $auth.user.id === item.reciver)" class="notification-card-wrapper">
      <debt-full-refund-result :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Debt Partial Refund -->
    <div v-if="item.type == 11 && $auth.user.id === item.reciver" class="notification-card-wrapper">
      <debt-partial-refund-result :getNotifications="getNotifications" :item="item" />
    </div>

    <div v-if="item.type == 15 && $auth.user.id === item.reciver" class="notification-card-wrapper">
      <debt-partial-refund-reject :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Debt Extend Result -->
    <div v-if="item.type == 12 || (item.type === 13 && $auth.user.id === item.reciver)" class="notification-card-wrapper">
      <debt-extend-result :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Debt Demand -->
    <div v-if="item.type == 17 && $auth.user.id === item.reciver" class="notification-card-wrapper">
      <debt-demand :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Request User -->
    <div v-if="item.type == 19 && $auth.user.id === item.reciver" class="notification-card-wrapper">
      <requestUserVue :getNotifications="getNotifications" :item="item" />
    </div>

    <div v-if="item.type == 20" class="notification-card-wrapper">
      <requestUserVue :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Contract Vremya -->
    <div v-if="item.type == 21" class="notification-card-wrapper">
      <contractVremyaVue :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Delete Act -->
    <div v-if="item.type == 22" class="notification-card-wrapper">
      <deleteActVue :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Transfer Money (Merged: type 23=sent, 24=received) -->
    <div v-if="item.type == 23" class="notification-card-wrapper">
      <TransferMoney type="sent" :getNotifications="getNotifications" :item="item" />
    </div>

    <div v-if="item.type == 24" class="notification-card-wrapper">
      <TransferMoney type="received" :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Infocom (Merged: type 25=registration, 26=password-reset) -->
    <div v-if="item.type == 25" class="notification-card-wrapper">
      <Infocom type="registration" :getNotifications="getNotifications" :item="item" />
    </div>

    <div v-if="item.type == 26" class="notification-card-wrapper">
      <Infocom type="password-reset" :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Ex Time -->
    <div v-if="item.type == 27" class="notification-card-wrapper">
      <exTime :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Permission Response (Merged: type 31=denied, 30=granted) -->
    <div v-if="item.type == 31" class="notification-card-wrapper">
      <PermissionResponse type="denied" :getNotifications="getNotifications" :item="item" />
    </div>

    <div v-if="item.type == 30" class="notification-card-wrapper">
      <PermissionResponse type="granted" :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- 5 Day Notification -->
    <div v-if="item.type == 32" class="notification-card-wrapper">
      <notification5dayVue :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Passport -->
    <div v-if="item.type == 35" class="notification-card-wrapper">
      <passport :getNotifications="getNotifications" :item="item" />
    </div>

    <!-- Debt Extend Result with Actions -->
    <div v-if="item.type == 16 && $auth.user.id === item.reciver" class="notification-card-wrapper">
      <debt-extend-result :getNotifications="getNotifications" @affirm="affirm" @reject="reject" :item="item" />
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
import notiDebtExtend from "./notification_types/debt-extend/debt-extend.vue";
import DebtRefund from "./notification_types/debt-refund/debt-refund.vue";
import DebtExtendResult from "./notification_types/debt-extend/debt-extend-result.vue";
import DebtExtend from "./notification_types/debt-extend/debt-extend.vue";
import ContractCreate from "./notification_types/contract-create/contract-create.vue";
import DebtDemand from "./notification_types/debt-demand.vue";
import ContractCreateResult from "./notification_types/contract-create/contract-create-result.vue";
import DebtWaiverResult from "./notification_types/debt-waiver/debt-waiver-result.vue";
import DebtFullRefundResult from "./notification_types/debt-refund/debt-fullRefund-result/debt-fullRefund-result.vue";
import DebtPartialRefundReject from "./notification_types/debt-refund/debt-partialRefund/debt-partialRefund-reject.vue";
import DebtPartialRefundResult from "./notification_types/debt-refund/debt-partialRefund/debt-partialRefund-result.vue";
import contractVremyaVue from "./notification_types/contract-create/contract-vremya.vue";
import requestUserVue from "./notification_types/request-user.vue";
import deleteActVue from "./notification_types/contract-create/delete-act.vue";
// Merged components
import TransferMoney from "./notification_types/transfer-money.vue";
import Infocom from "./notification_types/infocom.vue";
import PermissionResponse from "./notification_types/permission-response.vue";
import exTime from "./notification_types/ex-time.vue";
import conVremya2 from "./notification_types/contract-create/con-vremya2.vue";
import notification5dayVue from './notification_types/notification_5day.vue';
import passport from "./notification_types/passport.vue";
export default {
  components: {
    DebtExtend,
    exTime,
    // Merged: savol + savol2 -> PermissionResponse
    PermissionResponse,
    // Merged: infocom + infocom2 -> Infocom
    Infocom,
    notiDebtExtend,
    // Merged: transferMoney1 + transferMoney2 -> TransferMoney
    TransferMoney,
    DebtRefund,
    DebtExtendResult,
    ContractCreate,
    DebtDemand,
    ContractCreateResult,
    DebtWaiverResult,
    DebtFullRefundResult,
    DebtPartialRefundReject,
    DebtPartialRefundResult,
    requestUserVue,
    contractVremyaVue,
    deleteActVue,
    notification5dayVue,
    conVremya2,
    passport
  },
  name: "notification",
  props: ["item", "getNotifications", "getSockNot"],

  mounted() { },
  methods: {
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },

    ok(id) {
      ` `;
      this.$emit("ok", id);
    },

    async qismanQaytarish(id, status) {
      const data = {
        debitor: this.item.act.debitor,
        creditor: this.item.act.creditor,
        contract: this.item.act.contract,
        act: this.item.act._id,
        stype: status,
        reciver:
          this.item.act.reciver == this.item.act.debitor
            ? this.item.act.debitor
            : this.item.act.creditor,
      };

      try {
        const response = await this.$axios.post(
          `/notification/qisman-qaytarish/${id}`,
          data
        );
        if (response.status == 200) {
          this.$toast.success($nuxt.$t('a1.a43'));
          this.$router.go(-1);
        }
      } catch (e) {
       return this.$toast.error($nuxt.$t('a1.a42'));
       }
      console.log("ok", id);
    },

    async muddatUzaytirishQabul(id, status) {
      const data = {
        debitor: this.item.act.debitor,
        creditor: this.item.act.creditor,
        contract: this.item._id,
        stype: status,
        reciver:
          this.item.act.reciver == this.item.act.debitor
            ? this.item.act.debitor
            : this.item.act.creditor,
      };
      try {
        const response = await this.$axios.post(
          `/notification/time/${id}`,
          data
        );

        if (response.status == 200) {
          this.$toast.success($nuxt.$t('a1.a43'));
          this.$router.go(-1);
        }
      } catch (e) {
        return this.$toast.error($nuxt.$t('a1.a42'));
      }
    },

    async oneContract(id, status) {
      const data = {
        debitor: this.item.debitor._id,
        creditor: this.item.creditor._id,
        act: this.item._id,
        contract: this.item.contract._id,
        stype: status,
        reciver: this.item.debitor._id,
      };

      try {
        const response = await this.$axios.put(
          `/notification/success/${id}`,
          data
        );
        if (response.status == 200) {
          this.$toast.success($nuxt.$t('a1.a43'));
          this.$router.go(-1);
        }
      } catch (e) { return this.$toast.error($nuxt.$t('a1.a42')); }
    },

    async oneContract2(id, status) {
      const data = {
        debitor: this.item.debitor._id,
        creditor: this.item.creditor._id,
        act: this.item._id,
        contract: this.item.contract._id,
        stype: status,
        reciver: this.item.creditor._id,
      };

      try {
        const response = await this.$axios.put(
          `/notification/success/${id}`,
          data
        );
        console.log(response);
        if (response.status == 200) {
          this.$toast.success($nuxt.$t('a1.a43'));
          this.$router.go(-1);
        }
      } catch (e) { return this.$toast.error($nuxt.$t('a1.a42')); }
    },

    affirm(event, id, status, users) {
      this.$emit(event, { id, notiId: this.item._id, users }, status);
    },
    reject(event, id, status, users) {
      this.$emit(event, { id, notiId: this.item._id, users }, status);
    },
  },
};
</script>

<style scoped>
.notification-wrapper {
  width: 100%;
}

.notification-card-wrapper {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 20px;
  margin-bottom: 0;
  border-left: 4px solid #3b82f6;
  transition: all 0.2s ease;
}

.notification-card-wrapper:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .notification-card-wrapper {
    padding: 16px;
    border-radius: 12px;
  }
}
</style>
