<template>
  <div>
    <ZModal v-if="openModal" :width="520" @closeModal="$emit('closeModal')">
      <template #modal_body v-if="data">
        <div class="text-center font-semibold text-xl mb-8">
          {{ data.number }} - {{ $t("debt_list.sonli") }}
        </div>

        44
      </template>
    </ZModal>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    openModal: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
