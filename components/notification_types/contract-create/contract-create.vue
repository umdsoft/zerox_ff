<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasini rasmiylashtirish to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          Sizdan
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          miqdorida qarz berishingizni so‘ramoqda. Agar “Tasdiqlash”ni
          tanlasangiz,
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtiriladi.
        </p>
        <div class="flex justify-between mt-4">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div>
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract2(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract2(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
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
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Sizga
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          miqdorida qarz bermoqda. Agar “Tasdiqlash”ni tanlasangiz,
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtiriladi va mobil hisobingizdan
          xizmat haqi sifatida
          <b>{{
            item.token?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            UZS</b>
          yechiladi.
        </p>
        <p class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Sizga
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          miqdorida qarz bermoqda. Agar “Tasdiqlash”ni tanlasangiz,
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>-sonli qarz shartnomasi rasmiylashtiriladi.
        </p>
        <div class="flex justify-between mt-4">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div>
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
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
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          Сиздан
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          миқдорида қарз беришингизни сўрамоқда. Агар “Тасдиқлаш”ни танласангиз, <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси расмийлаштирилади.
        </p>
        <div class="flex justify-between mt-4">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div>
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract2(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract2(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз шартномасини расмийлаштириш тўғрисида</b>
        </p>
        <p class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Сизга
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          миқдорида қарз бермоқда. Агар “Тасдиқлаш”ни танласангиз, <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>-сонли қарз шартномаси расмийлаштирилади ва мобил ҳисобингиздан хизмат ҳақи сифатида
          <b>{{
            item.token?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            UZS</b> ечилади.
        </p>
        <p class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Сизга
          <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>
          миқдорида қарз бермоқда. Агар “Тасдиқлаш”ни танласангиз,
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>-сонли қарз шартномаси расмийлаштирилади.
        </p>
        <div class="flex justify-between mt-4">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div>
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Об оформлении договора займа</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          просит Вас выдать заём в размере <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b> . Если Вы выберете "Подтвердить", будет оформлен договор займа №<a
            class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>.
        </p>
        <div class="flex justify-between mt-4">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div>
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract2(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract2(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Об оформлении договора займа</b>
        </p>
        <p class="mt-2" v-if="$auth.user.cnt == 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          выдает Вам заём в размере <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>. Если Вы выберете "Подтвердить", будет
          оформлен договор займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a> и с Вашего мобильного счета будет списана сумма платы за услугу в размере
          <b>{{
            item.token?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            UZS</b>.
        </p>
        <p class="mt-2" v-if="$auth.user.cnt != 0">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          выдает Вам заём в размере <b>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            {{ item.currency }}</b>. Если вы выберете "Подтвердить", будет
          оформлен договор займа № <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number }}</b></a>.
        </p>
        <div class="flex justify-between mt-4">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div>
            <a :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
              target="_blank"><button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
                {{ $t("comp.full") }}
              </button>
            </a>

            <button @click="oneContract(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>
            <button @click="oneContract(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
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
  mounted() {},
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
        const dds = await this.$axios.put(`/notification/success/${id}`, data);
        if (dds.data.success == false && dds.data.msg == 'not-con-suc') {
          return this.$toast.error(
            $nuxt.$t('a1.a42')
          );
        }
        if (status == 1) {
          this.$toast.success($nuxt.$t('a1.a95'));
        } else if (status == 2) {
          this.$toast.success($nuxt.$t('a1.a92'));
        }

      } catch (e) {
        // this.$toast.error(e);
        this.$toast.error(
          $nuxt.$t('a1.a51')
        );
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
        sender:
          this.$auth.user.id == this.item.debitor
            ? this.item.creditor
            : this.item.debitor,
        res: this.$auth.user.id,
      };
      // return console.log(data);
      try {
        const dds = await this.$axios.put(`/notification/success/${id}`, data);
        if (dds.data.success == false && dds.data.msg == 'not-con-suc') {
          return this.$toast.error(
            $nuxt.$t('a1.a42')
          );
        }
        if (status == 1) {
          this.$toast.success($nuxt.$t('a1.a95'));
        } else if (status == 2) {
          this.$toast.success($nuxt.$t('a1.a92'));
        }
      } catch (e) {
        this.$toast.error($nuxt.$t('a1.a93'));
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

<style></style>
