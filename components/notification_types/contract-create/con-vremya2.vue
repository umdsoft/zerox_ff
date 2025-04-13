<template>
    <div>
      <div v-if="$i18n.locale == 'uz'">
        <div v-if="item.creditor === item.reciver">
          <p class="text-gray-700 mb-2">
            <b>Qarz shartnomasining qabul qilinmaganligi to‘g‘risida</b>
          </p>
          <p class="mt-2">
            <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
              v-if="item.ctypes == 1">{{ item.ccopmany }}</b>ga {{
                item.created }} yilda
            <a class="text-blue-400"
              :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasini rasmiylashtirish uchun so‘rovnoma
            yuborgansiz. Ushbu qarz shartnomasi {{ item.created }} yil
            soat 23:59 ga qadar <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{
              item.c_middle_name }}</b><b v-if="item.ctypes == 1">{{
                item.ccopmany }}</b> tomonidan qabul
            qilinmaganligi sababli tizim tomonidan rad etildi.
          </p>
          <div class="flex justify-between mt-4">
            <div>
              <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
                {{ item?.time.slice(0, 5) }}</span>
            </div>
            <div>
              <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                Ok
              </button>
            </div>
          </div>
        </div>
  
        <div v-if="item.debitor == item.reciver">
          <p class="text-gray-700 mb-2">
            <b>Qarz shartnomasining qabul qilinmaganligi to‘g‘risida</b>
          </p>
          <p class="mt-2">
            <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
              v-if="item.dtypes == 1">{{ item.dcompany }}</b>
            tomonidan
            {{ item.created }} yilda
            <a class="text-blue-400"
              :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasini rasmiylashtirish uchun Sizga
            so‘rovnoma
            yuborilgan. Ushbu qarz shartnomasi {{ item.created }} yil
            soat 23:59 ga qadar Siz tomoningizdan qabul qilinmaganligi sababli tizim
            tomonidan rad etildi.
          </p>
  
          <div class="flex justify-between mt-4">
            <div>
              <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
                {{ item?.time.slice(0, 5) }}</span>
            </div>
            <div>
              <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="$i18n.locale == 'kr'">
        <div v-if="item.debitor === item.reciver">
          <p class="text-gray-700 mb-2">
            <b>Қарз шартномасининг қабул қилинмаганлиги тўғрисида</b>
          </p>
          <p class="mt-2">
            <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
              v-if="item.ctypes == 1">{{ item.ccopmany }}</b>га
            {{ item.created }} йилда <a class="text-blue-400"
              :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномасини расмийлаштириш учун
            сўровнома юборгансиз. Ушбу қарз шартномаси {{ item.created }} йил соат 23:59 га қадар <b
              v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
              v-if="item.ctypes == 1">{{
                item.ccopmany }}</b>
            томонидан қабул қилинмаганлиги сабабли тизим томонидан рад қилинди.
          </p>
          <div class="flex justify-between mt-4">
            <div>
              <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
                {{ item?.time.slice(0, 5) }}</span>
            </div>
            <div>
              <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                Ok
              </button>
            </div>
          </div>
        </div>
  
        <div v-if="item.creditor === item.reciver">
          <p class="text-gray-700 mb-2">
            <b>Қарз шартномасининг қабул қилинмаганлиги тўғрисида</b>
          </p>
          <p class="mt-2">
            <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
              v-if="item.dtypes == 1">{{ item.dcompany }}</b>
            томонидан {{ item.created }} йилда <a class="text-blue-400"
              :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномасини расмийлаштириш учун
            Сизга сўровнома юборилган. Ушбу қарз шартномаси {{ item.created }} йил соат 23:59 га қадар Сиз
            томонингиздан қабул
            қилинмаганлиги сабабли тизим томонидан рад қилинди.
          </p>
  
          <div class="flex justify-between mt-4">
            <div>
              <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
                {{ item?.time.slice(0, 5) }}</span>
            </div>
            <div>
              <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="$i18n.locale == 'ru'">
        <div v-if="item.creditor === item.reciver">
          <p class="text-gray-700 mb-2">
            <b>О непринятии договора займа</b>
          </p>
          <p class="mt-2">
  
            <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
              v-if="item.dtypes == 1">{{
                item.dcopmany }}</b> не принял(а) договор займа №<a class="text-blue-400"
              :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><b>{{ item.number }}</b></a> до 23:59 {{ item.created }} г. Поэтому этот договор
            займа был автоматически отклонен системой.
          </p>
          <div class="flex justify-between mt-4">
            <div>
              <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
                {{ item?.time.slice(0, 5) }}</span>
            </div>
            <div>
              <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                Ok
              </button>
            </div>
          </div>
        </div>
  
        <div v-if="item.debitor === item.reciver">
          <p class="text-gray-700 mb-2">
            <b>О непринятии договора займа</b>
          </p>
          <p class="mt-2">
            <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
              v-if="item.ctypes == 1">{{ item.ccompany }}</b> {{ item.created }} г. отправил(а) Вам запрос на оформление
            договора займа №<a class="text-blue-400"
              :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><b>{{ item.number
              }}</b></a>.
            Однако этот договор займа был автоматически отклонен системой в связи с тем, что Вы не приняли его до 23:59 {{
              item.created }} г.
          </p>
  
          <div class="flex justify-between mt-4">
            <div>
              <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
                {{ item?.time.slice(0, 5) }}</span>
            </div>
            <div>
              <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
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
    mounted() {
      this.socket = this.$nuxtSocket({
        name: "home", // Use socket "home"
        channel: "/", // connect to '/index',
        secure: true,
      });
    },
    methods: {
      async getSockNot() {
        this.socket.emit(
          "notification",
          { userId: this.$auth.user.id },
          (data) => { }
        );
  
      },
      dateFormat(date) {
        let date1 = dateformat(date, "isoDate");
        date1 = date1.split("-").reverse();
        date1 = date1.join(".");
        return date1;
      },
  
      async ok(id) {
        try {
          await this.$axios.$put(`/notification/ok/${id}`);
          this.$toast.success($nuxt.$t('a1.a43'));
          this.getSockNot();
        } catch (err) {
          this.$toast.error($nuxt.$t('a1.a42'));
        }
      },
    },
  };
  </script>
  
  <style></style>
  