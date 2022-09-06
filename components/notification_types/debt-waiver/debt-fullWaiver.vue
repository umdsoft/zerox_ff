<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 text-sm">{{$t("comp.noti")}}</p>
        <p class="text-black font-bold">
          Qarzdan voz kechilganligi to‘g‘risida
        </p>
     
          <b>{{ item.debitor_name }} {{ dateFormat(item.created_at) }}</b> yildagi
           <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-sonli qarz shartnomasi bo‘yicha Sizga bergan qarzidan voz kechdi.
          <p>Voz kechilgan qarz miqdori - <b>{{item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</b></p>
      
        <div class="flex justify-between mt-4">
           <div>
              <span><b>{{$t("comp.time")}}:</b> {{dateFormat(item.created)}} yil</span>
            </div>
          <div>
          <button
            @click="ok(item.id)"
            class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
          >
            Ok
          </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 text-sm">{{$t("comp.noti")}}</p>
        <p class="text-black font-bold">Қарздан воз кечилганлиги тўғрисида</p>
   
          <b>{{ item.debitor_name }} {{ dateFormat(item.created_at) }}</b> йилдаги
           <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-сонли қарз шартномаси бўйича Сизга берган қарзидан воз кечди.
           <p>Воз кечилган қарз миқдори - <b>{{item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{item.currency}}</b></p>
    
       <div class="flex justify-between mt-4">
           <div>
              <span><b>{{$t("comp.time")}}:</b> {{dateFormat(item.created)}} yil</span>
            </div>
          <div>
          <button
            @click="ok(item.id)"
            class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
          >
            Ok
          </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
  props: ["item", "getNotifications"],
  methods: {
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
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
};
</script>

<style>
</style>