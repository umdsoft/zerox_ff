<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b> Qarzni to‘liq qaytarish to‘g‘risida</b>
        </p>
        <p class="mt-2">
          Sizning <b>{{ item.created_at }}</b> yildagi
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha muddatini uzaytirish bo`yicha
          so`rovnomangiz rad qilindi.
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

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b> Qarzni qaytarish qabul qilinmaganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b>{{ item.created_at }}</b> yildagi
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha qarzni qaytarish to‘g‘risidagi
          Sizning so‘rovnomangiz <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{
            item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{
              item.dcompany }}</b> tomonidan qabul
          qilinmadi. <br /><br />
          Qoldiq qarz miqdori –
          <b>{{
            item.residual_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>.
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
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарзни тўлиқ қайтариш тўғрисида</b>
        </p>
        <p class="mt-2">
          Сизнинг <b>{{ item.created_at }}</b> йилдаги
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-сонли қарз шартномаси бўйича муддатини узайтириш бўйича
          сўровномангиз рад қилинди.
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

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарзни қайтариш қабул қилинмаганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <b>{{ item.created_at }}</b> йилдаги <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси бўйича қарзни қайтариш тўғрисидаги Сизнинг сўровномангиз
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{
              item.dcompany }}</b> томонидан қабул қилинмади.<br /><br />
          Қолдиқ қарз миқдори – <b>{{
            item.residual_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>.
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
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarzni to‘liq qaytarish to‘g‘risida</b>
        </p>
        <p class="mt-2">
          Sizning <b>{{ item.created_at }}</b> yildagi
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha muddatini uzaytirish bo`yicha
          so`rovnomangiz rad qilindi.
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

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">
          <b>О непринятии возврата долга</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b> не
          принял(а)
          Ваш запрос о возврате долга по договору займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{
              item.number
            }}</b></a> от {{ item.created_at }} г.<br />
          Остаточная сумма долга – <b>{{
            item.residual_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>.
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

  },
  methods: {

    async ok(id) {
      try {
        await this.$axios.$put(`/notification/ok/${id}`);
        this.$toast.success($nuxt.$t('a1.a43'));

      } catch (err) {
        this.$toast.error($nuxt.$t('a1.a42'));
      }
    },

    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
  },
};
</script>

<style></style>
