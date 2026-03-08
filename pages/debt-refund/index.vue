<template>
  <div class="waiver bg-white px-4 py-4 w-full my-4" style="border-radius: 6px">
    <BackButton />
    <div>
      <div class="flex justify-center items-center">
        <div style="width: 26.6rem">
          <h2 class="font-bold text-xl text-center">
            {{ $t("list.a1") }}
          </h2>
          <nuxt-link :to="localePath({
            name: 'debt-refund-full',
            query: {
              contract: $route.query.contract
            }
          })"
            class="rounded-lg justify-center w-full py-4 px-6 flex items-center bg-t_primary text-white mt-6 text-sm">
            <img class="mr-2 w-5" src="@/assets/img/Group.png" alt="" />
            {{ $t("list.a2") }}
          </nuxt-link>
          <nuxt-link :to="localePath({
            name: 'debt-refund-partially',
            query: {
              contract: $route.query.contract
            }
          })"
            class="rounded-lg justify-center w-full py-4 px-6 flex items-center bg-t_primary text-white mt-6 text-sm">
            <img class="mr-2 w-5" src="@/assets/img/Vector.png" alt="" />
            {{ $t('list.a3') }}
          </nuxt-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import BackButton from '@/components/BackButton.vue';

export default {
  components: { BackButton },
  middleware: "auth",
  data: () => ({
    contract: null,
  }),

};
</script>

<style lang="css" scoped>
.debt_notification {
  width: 100%;

  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: white;
}

.input {
  border: 1px solid #1565d8;
  width: 100%;
  height: 50px;
  text-indent: 10px;
  border-radius: 5px;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  box-shadow: 0px 4px 10px 3px rgba(0, 0, 0, 0.11);
  border: 1px solid #1565d8;
}
</style>
