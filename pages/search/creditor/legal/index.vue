<template>
    <div class="bg-white rounded-xl flex flex-col px-4 py-4">
                    <div  @click="$router.go(-1)" class="my-2 mx-6 hidden lg:inline-flex  items-center" style="cursor:pointer">
                        <svg class="h-5 w-5 text-blue-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="15 6 9 12 15 18" /></svg>
                        <p class="text-blue-500 ">{{$t('back')}}</p>  
                 </div>

            
                <div v-if="step == 1">
                    <h1 class=" flex font-black items-center text-xl place-content-center" style="margin-top: 50px; font-size: 30px;">{{$t('search')}}</h1>
                        <div class="flex flex-col items-center place-self-center" style="margin-top: 50px; margin-bottom: 100px;">
                            
                            <input v-model="id" type="text" class="bt p-5 mb-5 bg-white text-gray text-lg rounded" :placeholder="$t('placeholder.id')">
                                                        <input v-model="stir" type="text" class="bt p-5 mb-5 bg-white text-gray text-lg rounded" :placeholder="$t('placeholder.stir')">
                            <button   class="bt p-5 mb-8 bg-t_primary text-white rounded text-center text-base" @click="search">{{$t('searching')}}</button> 
                                 <div v-if="user" class="btm flex align-center justify-evenly mb-12">
                        
                            <div class="left text-t_primary">
                                <h2>{{$t('transfer.fio')}} :</h2>
                                <h2>{{$t('transfer.birghtday')}}:</h2>
                                <h2>{{$t('transfer.id')}}:</h2>
                            </div>
                            <div class="center ml-6">
                                <h2>{{ user }}</h2>
                                <h2>{{ user.birthday }}</h2>
                                <h2>{{ user.uid }}</h2>
                            </div>
                        <button @click="seeInfo" class="bta p-2 mb-5 ml-8 bg-t_primary text-white rounded text-center text-base"> {{$t('process.see1')}}</button>
                  
                        </div>

                        </div>
                </div>
           
    </div>
</template>

<script>
  import dateformat from "dateformat";
export default {
     middleware:'auth',
    data:() => ({
        step:1,
        stir:"",
        id:null,
        type:null,
        user:null
    }),
    methods:{
      dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
       async search() {
      try {
        console.log(this.birthday);
        const response = await this.$axios.post("user/search", {
          id: this.id,
          stir:this.stir,
          type: 2,
        });

        console.log(response);
        if (response.status == 200) {
          this.user = response.data.user;
          this.$auth.user2 = this.user;
        }
      } catch (e) {
        this.$toast.error("Foydalanuvchi topilmadi");
      }
    },
       seeInfo () {
           this.$auth.user2 = this.user
           this.$router.push('/search/creditor/result')
       }
    }
}
</script>

<style scoped>

    .date {
        outline: none
    }
   
    .btn{
        border: 1px solid #8692A6;
        width: 306px;
        height: 64px;
        outline: none;
        box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.06);
    }
    .bt{
        border: 1px solid #3182CE;
        width: 306px;
        height: 64px;
        outline: none;
        box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.06);
    }
    .bta{
        width: 306px;
        height: 50px;
        outline: none;
        box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.06);
    }
</style>
