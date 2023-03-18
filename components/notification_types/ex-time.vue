<template>
    <div>
      <div v-if="$i18n.locale == 'uz'">
        <div v-if="$auth.user.id === item.reciver">
          <p class="text-gray-700 mb-2">
            <b>Qarz muddatini uzaytirish rad etilganligi to‘g‘risida</b>
          </p>
          <p class="mt-2">
            Sizning   <b>{{ dateFormat(item.created_at) }}</b> yildagi
            <a
              class="text-blue-400"
              :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`"
              target="_blank"
              ><b>{{ item.number }}</b></a
            >-sonli qarz shartnomasining muddatini uzaytirish bo'yicha
            so'rovnomangiz {{ dateFormat(item.created) }} yil 23:59 ga qadar qabul qilinmaganligi sababli tizim tomonidan bekor qilindi.
          </p>
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
  import dateformat from "dateformat";
  export default {
    name: "debt-demand",
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