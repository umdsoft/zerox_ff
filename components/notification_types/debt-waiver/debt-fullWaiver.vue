<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700">
          <b>Qarzdan voz kechilganligi to‘g‘risida</b>
        </p>

        <p class="mt-2">
          <b>{{ item.debitor_name }} {{ dateFormat(item.created_at) }}</b>
          yildagi
          <a
            class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`"
            target="_blank"
            ><b>{{ item.number }}</b></a
          >-sonli qarz shartnomasi bo‘yicha Sizga bergan qarzidan voz kechdi.
        </p>
        <p>
          Voz kechilgan qarz miqdori -
          <b
            >{{
              item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}</b
          >
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
    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 font-bold">
          <b>Қарздан воз кечилганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <b>{{ item.debitor_name }} {{ dateFormat(item.created_at) }}</b>
          йилдаги
          <a
            class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`"
            target="_blank"
            ><b>{{ item.number }}</b></a
          >-сонли қарз шартномаси бўйича Сизга берган қарзидан воз кечди.
        </p>

        <p>
          Воз кечилган қарз миқдори -
          <b
            >{{
              item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}</b
          >
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
    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 font-bold">
          <b>Об отмене долга</b>
        </p>
        <p class="mt-2">
          <b>{{ item.debitor_name }} {{ dateFormat(item.created_at) }}</b>
          ежегодно
          <a
            class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`"
            target="_blank"
            ><b>{{ item.number }}</b></a
          >-Lli отказался от долга долга по долговому соглашению.
        </p>

        <p>
          Сумма долга долга -
          <b
            >{{
              item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}</b
          >
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