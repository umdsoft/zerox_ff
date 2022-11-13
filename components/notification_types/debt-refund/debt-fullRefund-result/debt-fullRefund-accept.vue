<template>
  <div>
    <div v-if="$i18n.locale == 'kr'">
      <p class="text-gray-700 mb-2">
        <b> Қарз тўлиқ қайтарилганлиги тўғрисида</b>
      </p>
      <b>{{ dateFormat(item.created_at) }}</b> yildagi
      <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha qarzni qaytarish to‘g‘risidagi Sizning
      so‘rovnomangiz <b>{{ item.debitor_name }}</b> tomonidan qabul qilindi.
      <br /><br />
      Qoldiq qarz miqdori –
      <b
        >{{
          item.residual_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }}
        {{ item.currency }} </b
      >.

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

    <div v-if="$i18n.locale == 'uz'">
      <p class="text-gray-700 mb-2">
        <b>Qarzni qaytarish qabul qilinganligi toʻgʻrisida</b>
      </p>
      <b>{{ dateFormat(item.created_at) }}</b> yildagi
      <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha qarzni qaytarish to‘g‘risidagi Sizning
      so‘rovnomangiz <b>{{ item.debitor_name }}</b> tomonidan qabul qilindi.
      <br /><br />
      Qoldiq qarz miqdori –
      <b
        >{{
          item.residual_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }}
        {{ item.currency }} </b
      >.

      <div class="flex justify-between mt-4">
        <div>
          <span
            ><b>{{ $t("comp.time") }}:</b>
            {{ dateFormat(item.created_at) }} {{item?.time.slice(0,5)}}</span
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
     <div v-if="$i18n.locale == 'ru'">
      <p class="text-gray-700 mb-2">
        <b>При принятии доходности долга</b>
      </p>
      <b>{{ dateFormat(item.created_at) }}</b> yildagi
      <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-С для возврата долга по долговому соглашению 
       Ваш запрос <b>{{ item.debitor_name }}</b> принят.
      <br /><br />
      Сумма баланса долга -
      <b
        >{{
          item.residual_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }}
        {{ item.currency }} </b
      >.

      <div class="flex justify-between mt-4">
        <div>
          <span
            ><b>{{ $t("comp.time") }}:</b>
            {{ dateFormat(item.created_at) }} {{item?.time.slice(0,5)}}</span
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
  props: ["item", "getNotifications"],
};
</script>

<style>
</style>