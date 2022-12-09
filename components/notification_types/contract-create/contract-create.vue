<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasini rasmiylashtirish to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b>{{ item.creditor_name }}</b>
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
            <nuxt-link
              :to="{ path: '/pdf-generate', query: { id: item.contract } }"
              ><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </nuxt-link>

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
          <b> Qarz shartnomasini rasmiylashtirish to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b> {{ item.debitor_name }} </b>
          Sizga
          <b
            >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b
          >
          miqdorida qarz bermoqda. Agar “Tasdiqlash”ni tanlasangiz,
          <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtiriladi va mobil hisobingizdan
          xizmat haqi sifatida <b>{{ cur_amount }} UZS</b> yechiladi.
        </p>

        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <nuxt-link
              :to="{ path: '/pdf-generate', query: { id: item.contract } }"
              ><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </nuxt-link>

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

    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз шартномасини расмийлаштириш тўғрисида</b>
        </p>
        <p class="mt-2">
          <b>{{ item.creditor_name }}</b>
          Сиздан
          <b
            >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b
          >
          миқдорида қарз беришингизни сўрамоқда. Агар “Тасдиқлаш”ни танласангиз,
          <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-сонли қарз шартномаси расмийлаштирилади.
        </p>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <nuxt-link
              :to="{ path: '/pdf-generate', query: { id: item.contract } }"
              ><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </nuxt-link>

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
          <b>Қарз шартномасини расмийлаштириш тўғрисида</b>
        </p>
        <p class="mt-2">
          <b> {{ item.debitor_name }} </b>
          Сизга

          <b
            >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b
          >
        </p>
        миқдорида қарз бермоқда. Агар “Тасдиқлаш”ни танласангиз,
        <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-сонли қарз шартномаси расмийлаштирилади ва ҳисобингиздан хизмат ҳақи
        сифатида <b>{{ cur_amount }} UZS</b> йечилади.
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <nuxt-link
              :to="{ path: '/pdf-generate', query: { id: item.contract } }"
              ><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </nuxt-link>

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
    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>При регистрации долгового соглашения</b>
        </p>
        <p class="mt-2">
          <b>{{ item.creditor_name }}</b>
          От вас
          <b
            >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b
          >
          просит вас одолжить в сумме. Если "подтвердить" Если вы выберете,
          <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-Не долговое соглашение не формализовано.
        </p>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <nuxt-link
              :to="{ path: '/pdf-generate', query: { id: item.contract } }"
              ><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </nuxt-link>

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
          <b> При регистрации долгового соглашения</b>
        </p>
        <p class="mt-2">
          <b> {{ item.debitor_name }} </b>
          Ты
          <b
            >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b
          >
          кредитование в сумме. Если вы решите «подтвердить»,
          <a  class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`" target="_blank"><b>{{ item.number }}</b></a>-Ли долговое соглашение формализовано и с вашего мобильного счета В
          качестве платы за обслуживание<b>{{ cur_amount }} UZS</b>Очищает.
        </p>

        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <nuxt-link
              :to="{ path: '/pdf-generate', query: { id: item.contract } }"
              ><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </nuxt-link>

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
    <div></div>
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