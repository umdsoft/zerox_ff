<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasini rasmiylashtirish to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ item.creditor_name }}</b><b v-if="item.ctypes == 1">{{ item.ccompany }}</b>
          Sizdan
          <b
            >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b
          >
          miqdorida qarz berishingizni so‘ramoqda. Agar “Tasdiqlash”ni
          tanlasangiz,
          <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtiriladi.
        </p>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <a
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"
              ><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button
              @click="oneContract2(item.id, 1)"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
            >
              {{ $t("process.accept") }}
            </button>
            <button
              @click="oneContract2(item.id, 2)"
              class="bg-red-500 py-1 px-4 rounded text-white"
            >
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasini rasmiylashtirish to‘g‘risida</b>
        </p>
        <p class="mt-2" v-if="$auth.user.cnt == 0">
         
          <b v-if="item.dtypes == 2">{{ item.debitor_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Sizga
          <b
            >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b
          >
          miqdorida qarz bermoqda. Agar “Tasdiqlash”ni tanlasangiz,
          <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtiriladi va mobil hisobingizdan
          xizmat haqi sifatida <b>{{ cur_amount }} UZS</b> yechiladi.
        </p>
        <p class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ item.debitor_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Sizga
          <b
            >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b
          >
          miqdorida qarz bermoqda. Agar “Tasdiqlash”ni tanlasangiz,
          <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtiriladi.
        </p>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <a
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"
              ><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button
              @click="oneContract(item.id, 1)"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
            >
              {{ $t("process.accept") }}
            </button>
            <button
              @click="oneContract(item.id, 2)"
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
    async oneContract(id, status) {
      const data = {
        debitor: this.item.debitor,
        creditor: this.item.creditor,
        act: this.item.act,
        contract: this.item.contract,
        stype: status,
        reciver: this.item.debitor,
      };
      // return console.log(data);
      try {
        await this.$axios.put(`/notification/success/${id}`, data);
        this.$toast.success("Muvaffaqiyatli bajarildi");
        this.getNotifications();
      } catch (e) {
        this.$toast.error("Mablag' yetarli emas");
      }
    },

    async oneContract2(id, status) {
      const data = {
        debitor: this.item.debitor,
        creditor: this.item.creditor,
        act: this.item.act,
        contract: this.item.contract,
        stype: status,
        reciver: this.item.creditor,
      };
      // return console.log(data);
      try {
        await this.$axios.put(`/notification/success/${id}`, data);
        this.$toast.success("Muvaffaqiyatli bajarildi");
        this.getNotifications();
      } catch (e) {
        console.log(e);
        this.$toast.error("Qarz oluvchi hisobida yetarli mablag' mavjud emas");
      }
    },

    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
  },
  props: ["item", "getNotifications"],
};
</script>

<style>
</style>