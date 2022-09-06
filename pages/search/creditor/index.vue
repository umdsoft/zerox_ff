<template>
    <div class="bg-white rounded-xl flex flex-col px-4 py-4">
                    <div @click="$router.go(-1)" class="my-2 mx-6 hidden lg:inline-flex  items-center" style="cursor:pointer">
                        <svg class="h-5 w-5 text-blue-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="15 6 9 12 15 18" /></svg>
                        <p class="text-blue-500 ">{{$t('back')}}</p>  
                 </div>

                <div>
                    <h1 class=" flex font-black items-center text-xl place-content-center" style="margin-top: 50px; font-size: 30px;">{{$t('search')}}</h1>
                    <div class="mx-auto max-w-md " style="margin-top: 50px; margin-bottom: 100px;">
                        <nuxt-link class=" p-5 block mb-5 text-center bg-t_primary   text-white rounded" to="/search/creditor/physical">{{$t('home.search_user')}}</nuxt-link>
                        <nuxt-link class=" p-5 block mb-5 text-center bg-t_primary   text-white rounded" to="/search/creditor/legal">{{$t('home.search_legal')}}</nuxt-link>
                        <nuxt-link :to="{path:'/treaded-users',query:{
                      searchtype:'creditor'
        }}" class="px-2 py-2 md:py-4 lg:py-5   bg-t_primary  block w-full text-center text-white rounded">{{$t('oldi')}} </nuxt-link>
                </div>
                </div>
    </div>
</template>

<script>
export default {
     middleware:'auth',
    data:() => ({
        birthday:"04-10-2000",
        id:null,
        type:null,
        user:null
    }),
    methods:{
       
    }
}
</script>

<style>

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
