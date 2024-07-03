<template>
  <div class="act_bg" v-if="isModalShow" @click="$store.commit('HIDE_CONTRACT_MODAL')">
    <contract_uz v-if="actType === 'contact'" :contract="contract" />
  </div>
</template>

<script>

import contract_uz from "./actModals/contract_uz.vue";

export default {

  components: {
    contract_uz
  },

  computed: {
    isModalShow() {
      return this.$store.state.isContractModalOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
.act_bg {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  align-items: center;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.856);
  z-index: 6000000000000000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
>
