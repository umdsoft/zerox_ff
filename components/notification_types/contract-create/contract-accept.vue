<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasining qabul qilinganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
        <b>{{ item.debitor_name }} </b>
        va Sizning o‘rtangizda
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>
        -sonli qarz shartnomasi rasmiylashtirildi. Ushbu shartnoma asosida Siz
        <b>{{ item.debitor_name }}</b
        >dan
        <b
          >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
        miqdorida qarz oldingiz.
          </p>

        <p>
          Xizmat haqi sifatida hisobingizdan
          <b
            >{{
              cur_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            UZS</b
          >
          yechildi.
        </p>

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
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasining qabul qilinganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
        <b>{{ item.creditor_name }}</b> va Sizning o‘rtangizda
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtirildi. Ushbu shartnoma asosida Siz
        <b>{{ item.creditor_name }}</b
        >ga
        <b
          >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
        miqdorida qarz berdingiz.</p>
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
    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз шартномасининг қабул қилинганлиги тўгрисида</b>
        </p>
        <p class="mt-2">
        <b>{{ item.debitor_name }} </b>
        va Sizning o‘rtangizda
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtirildi. Ushbu shartnoma asosida Siz
        <b>{{ item.debitor_name }}</b
        >dan
        <b
          >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
        miqdorida qarz oldingiz.</p>
        <p>
          Xizmat haqi sifatida hisobingizdan
          <b
            >{{
              cur_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            UZS</b
          >
          yechildi.
        </p>
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
      <div v-if="item.debitor === item.reciver">

        <p class="text-gray-700 mb-2">
          <b>Қарз шартномасининг қабул қилинганлиги тўгрисида</b>
        </p>
        <p class="mt-2">
        <b> {{ item.creditor_name }}</b> ва Сизнинг ўртангизда

        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-сонли қарз шартномаси расмийлаштирилди. Ушбу шартнома асосида Сиз
        <b> {{ item.creditor_name }}</b
        >га
        <b>
          {{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
        микдорида карз бердингиз.</p>
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
    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>*</b>  
        </p>
        <br>
        <b>{{ item.debitor_name }} </b>
       И в середине вас
       <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-Определить долг договор был формализован. К настоящему Соглашению вы
        <b>{{ item.debitor_name }}</b
        >а также
        <b
          >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
      Вы получили кредит.
        <p>
     С вашей учетной записи в качестве платы за обслуживание
          <b
            >{{
              cur_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            Сом</b
          >
         был вычтен.
        </p>

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
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>При принятии долгового соглашения</b>
        </p>
        <b>{{ item.creditor_name }}</b> И в середине тебя
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-Определить долг договор был формализован. К настоящему Соглашению вы
        <b>{{ item.creditor_name }}</b
        >
        <b
          >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
   Вы привели деньги в сумме.
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

  data() {
    return {
      cur_amount: 0,
      usd: null,
      dd: null,
    };
  },
  async created() {
    // const usd = await this.$axios.$get(
    //   "https://cbu.uz/oz/arkhiv-kursov-valyut/json/"
    // );
    // console.log((this.usd = usd));
    this.usd = 10922.03;
    if (this.item.currency == "USD") {
      this.dd = this.item.amount * this.usd;
      if (this.dd > 100000000) {
        this.cur_amount = 100000;
      } else {
        this.cur_amount = Math.floor(this.item.amount * this.usd * (0.1 / 100))
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
    } else {
      if (this.item.amount > 100000000) {
        this.cur_amount = 100000;
      } else {
        this.cur_amount = Math.floor(this.item.amount * (0.1 / 100))
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
    }
  },

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