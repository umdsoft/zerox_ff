<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz muddatini uzaytirish so‘ralganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">

          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          Sizdan
          {{ item.created_at }} yildagi
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha qarzni qaytarish muddatini
          <b>{{ dateFormat(item.end_date) }}</b> yilgacha uzaytirishingizni so‘ramoqda.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="muddatUzaytirishQabul(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>

            <button @click="muddatUzaytirishQabul(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz muddati uzaytirilganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          tomonidan
          <b>{{ item.created_at }}</b> yildagi
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>--sonli qarz shartnomasi bo‘yicha qarzni qaytarish muddati
          <b>{{ dateFormat(item.end_date) }}</b> yilga qadar uzaytirildi.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="muddatUzaytirishQabul(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>

            <button @click="muddatUzaytirishQabul(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
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
        <p class="mt-2">

          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          Сиздан {{ item.created_at }} йилдаги <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси бўйича қарзни қайтариш муддатини
          <b>{{ dateFormat(item.end_date) }}</b> йилгача узайтиришингизни сўрамоқда.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="muddatUzaytirishQabul(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>

            <button @click="muddatUzaytirishQabul(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз муддати узайтирилганлиги тўғрисида</b>
        </p>
        <p class="mt-2">

          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          томонидан <b>{{ item.created_at }}</b> йилдаги <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси бўйича қарзни қайтариш муддати
          <b>{{ dateFormat(item.end_date) }}</b> йилга қадар узайтирилди.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="muddatUzaytirishQabul(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>

            <button @click="muddatUzaytirishQabul(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>О запросе продления срока займа</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          просит Вас продлить срок возврата долга по договору займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a> от {{ item.created_at }} г. до <b>{{ dateFormat(item.end_date) }} г</b>.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="muddatUzaytirishQabul(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>

            <button @click="muddatUzaytirishQabul(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>О продлении срока займа</b>
        </p>
        <p class="mt-2">

          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> продлил(а) срок возврата долга по договору займа №<a
            class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a> от {{ item.created_at }} г. продлен до <b>{{ dateFormat(item.end_date)
              }} г</b>.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="muddatUzaytirishQabul(item.id, 1)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              {{ $t("process.accept") }}
            </button>

            <button @click="muddatUzaytirishQabul(item.id, 2)" class="bg-red-500 py-1 px-4 rounded text-white">
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
  mounted() {

  },
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
        if (status == 1) {
          this.$toast.success($nuxt.$t('a1.a95'));
        } else {
          this.$toast.success($nuxt.$t('a1.a92'));
        }
      } catch (e) {
        this.$toast.error($nuxt.$t('a1.a42'));
      }
    },
  },
};
</script>

<style></style>
