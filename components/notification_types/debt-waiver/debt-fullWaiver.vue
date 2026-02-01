<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700">
          <b>Qarzdan voz kechilganligi to‘g‘risida</b>
        </p>

        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> {{
              item.created_at }}
          yildagi
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha Sizga bergan qarzidan voz
          kechdi.
        </p>
        <p>
          Voz kechilgan qarz miqdori -
          <b>{{
            item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700">
          <b>Қарздан воз кечилганлиги тўғрисида</b>
        </p>

        <p class="mt-2">

          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> {{
              item.created_at }} йилдаги <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
            }}</b></a>-сонли қарз шартномаси бўйича Сизга берган қарзидан
          воз кечди. <br>
          Воз кечилган қарз миқдори - <b>{{
            item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700">
          <b>Об освобождении от возврата долга</b>
        </p>

        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          освобождал(а) Вас от возврата суммы займа в размере <b>{{
            item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b> по договору займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
            }}</b></a> от
          {{
            item.created_at }} г.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
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
  },
};
</script>

<style></style>
