<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Pul mablag‘i qabul qilinganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          Sizning mobil hisobingizga <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{
            item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{
              item.dcompany }}</b> ({{
              item.duid
            }}) tomonidan
          <b>{{
            item.token.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            UZS</b>
          miqdorida mablag‘ o‘tkazildi.
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
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Пул маблағи қабул қилинганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          Сизнинг мобил ҳисобингизга <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{
            item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{
              item.dcompany }}</b> ({{
              item.duid
            }}) томонидан <b>{{
            item.token.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            UZS</b> миқдорида маблағ ўтказилди.
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
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>О поступлении денежных средств</b>
        </p>
        <p class="mt-2">
          На ваш мобильный счет <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{
            item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{
              item.dcompany }}</b> ({{
              item.duid
            }}) перечислил(а) сумму в размере <b>{{
            item.token.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            UZS</b>.
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
import dateformat from "dateformat";
export default {
  name: "debt-demand",
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
