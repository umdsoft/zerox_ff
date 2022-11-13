<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz qaytarish qabul qilinmaganligi to‘g‘risida</b>
        </p>
        <b>{{ item.creditor_name }} </b> tomonidan
        {{ dateFormat(item.created) }} yilda <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz
        shartnomasini bo’yicha
        <b>
          {{
            item.residual_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
          {{ item.currency }}
        </b>
        qarz mablag’i qaytarilganligi yuzasidan Sizga so’rovnoma yuborilgan.
        Ushbu so’rovnoma {{ dateFormat(item.created) }} yil soat 23:59 ga qadar
        Siz tomoningizdan qabul qilinmaganligi sababli tizim tomonidan bekor
        qilindi.

        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz qaytarish rad qilinganligi to‘g‘risida</b>
        </p>
        <b>{{ dateFormat(item.created) }}</b> yildagi <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli shartnoma bo’yicha <b>{{
            item.residual_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
          {{ item.currency }}</b> qaytarilganligi yuzasidan yuborgan so’rovnomangiz <b>{{item.debitor_name}}</b> tomonidan
          <b>{{ dateFormat(item.created) }} yil 23:59</b> ga qadar qabul qilinmaganligi sababli tizim tomonidan bekor qilindi. Qayta so’rov yuborishingiz mumkin.
       

        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
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
import { trace } from "console";
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