<template>
  <div>
    <!--  -->
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasining qabul qilinganligi to‘g‘risida</b>
        </p>
        <div class="mt-2"   v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ item.debitor_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
        va Sizning o‘rtangizda
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>
        -sonli qarz shartnomasi rasmiylashtirildi. Ushbu shartnoma asosida Siz
        <b v-if="item.dtypes == 2">{{ item.debitor_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>dan
        <b
          >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
        miqdorida qarz oldingiz.
        <p>
          Xizmat haqi sifatida hisobingizdan
          <b
            > {{cur_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} UZS</b
          >
          yechildi.
        </p>
      </div>

      <div class="mt-2"   v-if="$auth.user.cnt != 0">
        <b v-if="item.dtypes == 2">{{ item.debitor_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
        va Sizning o‘rtangizda
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>
        -sonli qarz shartnomasi rasmiylashtirildi. Ushbu shartnoma asosida Siz
        <b v-if="item.dtypes == 2">{{ item.debitor_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>dan
        <b
          >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
        miqdorida qarz oldingiz.
     
      </div>

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
          <b v-if="item.ctypes == 2">{{ item.creditor_name }}</b><b v-if="item.ctypes == 1">{{ item.ccopmany }}</b> va Sizning o‘rtangizda
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtirildi. Ushbu shartnoma asosida Siz
        <b v-if="item.ctypes == 2">{{ item.creditor_name }}</b><b v-if="item.ctypes == 1">{{ item.ccopmany }}</b>ga
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
    const usd = await this.$axios.$get(
      "https://cbu.uz/oz/arkhiv-kursov-valyut/json/"
    );
    console.log((this.usd = usd));
    this.usd = usd.data[0].Rate;
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