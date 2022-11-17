<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz muddatini uzaytirish so‘ralganligi to‘g‘risida</b>
        </p>
        <br>
        <b>{{ item.creditor_name }}</b> Sizdan
        {{ dateFormat(item.created_at) }} yildagi
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasining muddatini
        <b>{{ dateFormat(item.end_date) }}</b> yilgacha uzaytirishingizni
        so'ramoqda.
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <button
              @click="muddatUzaytirishQabul(item.id, 1)"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
            >
              {{ $t("process.accept") }}
            </button>

            <button
              @click="muddatUzaytirishQabul(item.id, 2)"
              class="bg-red-500 py-1 px-4 rounded text-white"
            >
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz muddati uzaytirilganligi to‘g‘risida</b>
        </p>
        <br>
        <b>{{ item.debitor_name }}</b> tomonidan
        <b>{{ dateFormat(item.created_at) }}</b> yildagi
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi muddati
        <b>{{ dateFormat(item.end_date) }}</b> yilga qadar uzaytirildi.
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <button
              @click="muddatUzaytirishQabul(item.id, 1)"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
            >
              {{ $t("process.accept") }}
            </button>

            <button
              @click="muddatUzaytirishQabul(item.id, 2)"
              class="bg-red-500 py-1 px-4 rounded text-white"
            >
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>По апелляции по расширению долга</b>
        </p>
        <br>
        <b>{{ item.creditor_name }}</b> От тебя
        {{ dateFormat(item.created_at) }} ежегодно
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>- Соглашение о сроке долга <b>{{ dateFormat(item.end_date) }}</b> Вы
        простираетесь до года спрашивает.
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <button
              @click="muddatUzaytirishQabul(item.id, 1)"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
            >
              {{ $t("process.accept") }}
            </button>

            <button
              @click="muddatUzaytirishQabul(item.id, 2)"
              class="bg-red-500 py-1 px-4 rounded text-white"
            >
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Расширить долг</b>
        </p>
        <br>
        <b>{{ item.debitor_name }}</b
        >на <b>{{ dateFormat(item.created_at) }}</b> ежегодно
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-Долгого срока <b>{{ dateFormat(item.end_date) }}</b
        >был продлен до года.
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <button
              @click="muddatUzaytirishQabul(item.id, 1)"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
            >
              {{ $t("process.accept") }}
            </button>

            <button
              @click="muddatUzaytirishQabul(item.id, 2)"
              class="bg-red-500 py-1 px-4 rounded text-white"
            >
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз муддатини узайтириш сўралганлиги тўғрисида</b>
        </p>
        <br>
        <b>{{ item.creditor_name }}</b> Сиздан
        <b>{{ dateFormat(item.created_at) }}</b> йилдаги
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-сонли карз шартномасининг муддатини
        <b>{{ dateFormat(item.end_date) }}</b> йилга қадар узайтиришингизни
        сўрамоқда.
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <button
              @click="muddatUzaytirishQabul(item.id, 1)"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
            >
              {{ $t("process.accept") }}
            </button>

            <button
              @click="muddatUzaytirishQabul(item.id, 2)"
              class="bg-red-500 py-1 px-4 rounded text-white"
            >
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз муддати узайтирилганлиги тўғрисида</b>
        </p>
        <br>
        <b>{{ item.debitor_name }}</b> томонидан
        <b>{{ dateFormat(item.created_at) }}</b> йилдаги
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-сонли карз шартномасининг муддати
        <b>{{ dateFormat(item.end_date) }}</b> йилга йилга қадар узайтирилди.

        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <button
              @click="muddatUzaytirishQabul(item.id, 1)"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
            >
              {{ $t("process.accept") }}
            </button>

            <button
              @click="muddatUzaytirishQabul(item.id, 2)"
              class="bg-red-500 py-1 px-4 rounded text-white"
            >
              {{ $t("comp.cancel") }}
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

    async muddatUzaytirishQabul(id, status) {
      const data = {
        debitor: this.item.debitor,
        creditor: this.item.creditor,
        contract: this.item.contract,
        act: this.item.act,
        stype: status,
        reciver:
          this.item.reciver == this.item.debitor
            ? this.item.creditor
            : this.item.debitor,
      };
      // return console.log(data)
      try {
        await this.$axios.post(`/notification/time/${id}`, data);
        this.$toast.success("Muvaffaqiyatli bajarildi");
        this.getNotifications();
      } catch (e) {
        this.$toast.error("Xatolik yuz berdi");
      }
    },
  },
};
</script>

<style>
</style>