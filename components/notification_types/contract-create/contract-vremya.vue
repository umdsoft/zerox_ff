<template>
    <div>
      <div v-if="$i18n.locale == 'uz'">
        <div v-if="item.debitor === item.reciver">
          <p class="text-gray-700 mb-2">
            <b>Qarz shartnomasining qabul qilinmaganligi to‘g‘risida</b>
          </p>
          <b>{{item.creditor_name}}</b>ga {{ dateFormat(item.created) }} yilda {{item.number}}-sonli qarz shartnomasini rasmiylashtirish uchun  so’rovnoma yuborgansiz. Ushbu qarz shartnomasi {{ dateFormat(item.created) }} yil soat 23:59 ga qadar <b>{{item.creditor_name}}</b> tomonidan qabul qilinmaganligi sababli tizim tomonidan rad qilindi.
          <div class="flex justify-between mt-4">
            <div>
              <span
                ><b>{{ $t("comp.time") }}:</b>
                {{ dateFormat(item.created) }} {{item?.time.slice(0,5)}}</span
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
            <b> Qarz shartnomasining rad qilinganligi to‘g‘risida</b>
          </p>
          <b>{{ item.debitor_name }}</b
          > tomonidan {{ dateFormat(item.created) }} yilda {{item.number}}-sonli qarz shartnomasini rasmiylashtirish uchun Sizga so’rovnoma yuborilgan. Ushbu qarz shartnomasi {{ dateFormat(item.created) }} yil soat 23:59 ga qadar Siz tomoningizdan qabul qilinmaganligi sababli tizim tomonidan rad qilindi.
          
  
          <div class="flex justify-between mt-4">
            <div>
              <span
                ><b>{{ $t("comp.time") }}:</b>
                {{ dateFormat(item.created) }} {{item?.time.slice(0,5)}}</span
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