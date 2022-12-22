<template>
    <div class="bg-white rounded-xl">
        <div class="main p-10 flex flex-col mt-5">
            <h1 v-if="$route.query.item.debitor._id == $route.query.item.reciver._id"  class="text-2xl items-center flex justify-center m-10">Qarz olish  to`g`risida bildirishnoma</h1>
                       <h1 v-if="$route.query.item.creditor._id == $route.query.item.reciver._id"  class="text-2xl items-center flex justify-center m-10">Qarz berish  to`g`risida bildirishnoma</h1>
           <div>
                          <p  v-if="$route.query.item.creditor._id == $route.query.item.reciver._id"  class="w-70 justify-start items-center leading-6 mt-10 mb-10">Fuqaro {{ $route.query.item.debitor.first_name}} {{   $route.query.item.debitor.last_name }}   {{ $route.query.item.debitor.middle_name}}  bilan sizning o`rtangizda qarz berish  bo`yicha {{dateFormat($route.query.item.contract.createdAt)}} yilda {{$route.query.item.contract.number}}-sonli qarz shartnomasi rasmiylashtirilmoqda. “Tasdiqlash”ni tanlasangiz, qarz shartnomasi rasmiylashtiriladi hamda  mobil hisobingizdan 1000 so`m to’lov amalga oshiriladi. Qarz shartnomasini tasdiqlaysizmi? </p>
                <p  v-if="$route.query.item.debitor._id == $route.query.item.reciver._id"  class="w-70 justify-start items-center leading-6 mt-10 mb-10">Fuqaro {{ $route.query.item.debitor.first_name}} {{   $route.query.item.debitor.last_name }}   {{ $route.query.item.debitor.middle_name}}  bilan sizning o`rtangizda qarz olish  bo`yicha {{dateFormat($route.query.item.contract.createdAt)}} yilda {{$route.query.item.contract.number}}-sonli qarz shartnomasi rasmiylashtirilmoqda. “Tasdiqlash”ni tanlasangiz, qarz shartnomasi rasmiylashtiriladi hamda  mobil hisobingizdan 1000 so`m to’lov amalga oshiriladi. Qarz shartnomasini tasdiqlaysizmi? </p>
            </div>
            <div class="stat text-xs font-bold shadow-lg rounded-xl" style="margin-bottom:70px;">
                <tr class=" flex justify-evenly bg-t">
                    <td>Qarz beruvchi</td>
                    <td>{{ $t('list.creditor') }}</td>
                    <td>{{$t('debt_list.debtsumm')}}</td>
                    <td>Qarz olinadigan <br> sana</td>
                    <td> {{$t('list.return') }}    <br> sanasi</td>
                </tr>
                <tr class="flex justify-evenly ">
                    <td> {{  $route.query.item.debitor.first_name  }}  {{  $route.query.item.debitor.last_name }}   {{ $route.query.item.debitor.middle_name }}   </td>
                    <td>{{$route.query.item.creditor.first_name}}  {{$route.query.item.creditor.last_name}}  {{$route.query.item.creditor.middle_name}}</td>
                        <td>{{$route.query.item.contract.amount.toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}}</td>
                     <td>{{dateFormat($route.query.item.contract.createdAt)}}</td>
                               <td>{{dateFormat($route.query.item.contract.end_date)}}</td>
                </tr> 
            </div>
            <div class="flex justify-evenly align-center  mr-4 mb-32">
                <img src="@/assets/img/no-avatar.png" alt="" class="w-32 h-32 rounded-full"/>
                <div class="ads text-t_primary">
                    <h2>FISH :</h2>
                    <h2>Ro‘yxatdan o‘tgan:</h2>
                    <h2>ID raqami:</h2>
                    <h2>Status:</h2>
                </div>
                <div class="ads">
                    <h2>{{$route.query.item.debitor_name}}  {{$route.query.item.debitor.last_name}}  {{$route.query.item.debitor.middle_name}}</h2>
                    <h2>{{dateFormat($route.query.item.created_at)}}</h2>
                    <h2>{{$route.query.item.debitor.uid}}</h2>
                    <h2>97%</h2>
                </div>
            </div>
            <div class="flex left-0 relative align-center justify-center" style="font-size: 13px">
                <input @change="validate" v-model="isAffirmed" type="checkbox" class=" align-center w-5 h-5 mr-3 mb-5">
                <a href="#" class="mr-3 underline text-blue-600">Qarz shartnomasi</a>
                <h2>bilan tanishdim</h2>
            </div>
            <div class="text-white flex items-center justify-evenly btn">
                <button :disabled="isBtnDisabled"   @click="affirm"    :class="isBtnDisabled ? 'bg-t_error' :  'bg-t_primary'  "  class="but w-48 p-3 h-22 rounded">Tasdiqlash</button>
                <button @click="reject" class="but bg-red-500 w-48 p-3 h-22 rounded">Rad etish</button>
            </div>
        </div>
    </div>
</template>
<script>

import dateformat from "dateformat";
export default {
   middleware:'auth',
    data:() => ({
        item:{},
        isAffirmed:false,
        isBtnDisabled:true,
        homeData:[]
    }),
  async  mounted () {
      if(!this.$route.query.item._id) {
         return this.$router.go(-1)
      }


      let homeData = await this.$axios.get("home/my");
      this.homeData = homeData.data;


    },
    methods : {

    async reject() {
      try {
        const response = await this.$axios.put(
          `/notification/success/${this.$route.query.item._id}`,
          {
            status: 2,
            reciver:this.$auth.user._id == this.$route.query.item.debitor._id ? this.$route.query.item.creditor._id : this.$route.query.item.debitor._id,
            debitor:this.$route.query.item.debitor._id,
            creditor:this.$route.query.item.creditor._id

          }
        );
        if (response.status == 200) {
          this.$toast.success("Shartnoma bekor qilindi");
          this.getNotifications();
        }
      } catch (e) {
        console.log(e);
      }
    },

  async affirm() {
      try {
        const response = await this.$axios.put(
          `/notification/success/${this.$route.query.item._id}`,
          {
            status: 1,
              reciver:this.$auth.user._id == this.$route.query.item.debitor._id ? this.$route.query.item.creditor._id : this.$route.query.item.debitor._id,
            debitor:this.$route.query.item.debitor._id,
            creditor:this.$route.query.item.creditor._id
          }
        );
        if (response.status == 200) {
          this.$toast.success("Shartnoma tasdiqlandi");
         this.$router.go(-1)
        }
      } catch (e) {
           this.$toast.error("Xatolik yuz berdi");
      }
    },


validate () {
    if(this.isAffirmed) {
        this.isBtnDisabled = false
    }
    else {
        this.isBtnDisabled = true
    }
},

          dateFormat(date) {
            let date1 = dateformat(date, "isoDate");
            date1 = date1.split("-").reverse();
            date1 = date1.join(".");
            return date1;
        },
    }
}
</script>

<style>
.btn{
    padding-top:10px; 
    width: 55%;
    margin: 0 auto;
    padding-bottom: 100px;
}
.but{
    box-shadow: inset 5.82857px 0px 15.5429px rgba(255, 255, 255, 0.1), inset 0px 5.82857px 15.5429px rgba(255, 255, 255, 0.1);
}
.text-2xl{
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
}
tr td{
    padding: 10px;
    padding-left: 5px;
    padding-right: 5px;
    width: 300px;
}
tr{
    padding-left: 10px;
    width: 100%;
    margin: 0 auto;
}
.stat{
    border-radius: 5px;
}
.bg-t{
    background: #F4F2FF;
    color: #6E6893;
}
.ads h2{
    line-height: 40px;
}
</style>

