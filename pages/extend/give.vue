<template>
  <div v-if="contract != null" class="bg-white px-4 py-4" style="border-radius:10px">
     <div
      @click="$router.go(-1)"
      class="my-2 mx-6"
      style="cursor: pointer; display: flex; align-items: center"
    >
      <svg
        class="h-5 w-5 text-blue-500"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      <p class="text-blue-500">{{$t('back')}}</p>
    </div>
      <div class="m-0 mx-auto max-w-2xl my-32"> 
        <h1 class="text-center font-extrabold text-2xl mb-5">{{$t('action.a2')}}</h1>
        <div class="shadow-lg px-5 py-10 pb-16 text-lg rounded-lg"><p>{{dateFormat(contract.createdAt)}} yildagi <nuxt-link :to="{path:'/pdf-generate',query:{id: contract._id}}">{{ contract.number }}-sonli qarz shartnomasi</nuxt-link> muddatini uzaytirish bo‘yicha so‘rovnoma yubormoqdasiz. </p></div>
        <form class="mt-10" action="">
          <input class="border border-current border-solid rounded p-3 outline-none w-1/2 block" type="text" :placeholder="$t('placeholder.new_date')">
          <div class="mt-10 flex justify-center items-center">
            <input class="w-5 h-5" type="checkbox" name="" id="ok">
            <label class="ml-2 text-sm" for="ok">{{$t('action.a3')}}</label>
          </div>
          <div class="flex justify-center"><input class="p-4 w-2/5 my-10 mx-auto bg-gray-500 rounded-md text-white" type="submit" :value="$t('send')"></div>
        </form>
      </div>
  </div>

  
</template>

<script>
  import dateformat from "dateformat";
export default {
   middleware:'auth',
  data: ()=>({
    contract:null
  }),
  async mounted() {
    // if (!this.$route.query.item._id) {
    //   return this.$router.go(-1);
    // }
      const contract = await this.$axios.get(`/contract/by/${this.$route.query.id}`)
      // console.log('contract',contract)
        this.contract = contract.data.data;
    console.log('con',this.contract)
      //  this.inc = this.contract.act.refundable_amount ? this.contract.act.refundable_amount : 0
  },
  methods: {
      dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    }
  }
}
</script>

<style scoped>
  
</style>