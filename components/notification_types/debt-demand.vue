<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>Qarzni qaytarish talab qilinganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Sizdan
          <b>{{ item.created_at }}</b> yildagi
          <a class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasiga asosan berilgan <b>{{
      item.residual_amount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }}
            {{ item.currency }}</b> qarzni qaytarishingizni
          talab qilmoqda.
        </p>

        <div class="flex justify-between mt-4">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div>
            <button @click="redirectNotification(item.id, item.contract)"
              class="bg-blue-500 py-1 px-4 rounded text-white">
              {{ $t("list.return") }}
            </button>

            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'kr'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>Қарзни қайтариш талаб қилинганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Сиздан {{ item.created_at }} йилдаги <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`" target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномасига асосан берилган <b>{{
      item.residual_amount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }}
            {{ item.currency }}</b> қарзни қайтаришингизни талаб қилмоқда.
        </p>

        <div class="flex justify-between mt-4">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div>
            <button @click="redirectNotification(item.id, item.contract)"
              class="bg-blue-500 py-1 px-4 rounded text-white">
              {{ $t("list.return") }}
            </button>

            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>О требовании возврата долга</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          требует от Вас возврата долга в размере <b>{{
      item.residual_amount
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }}
            {{ item.currency }}</b>, выданного в соответствии с договором займа  №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`" target="_blank"><b>{{ item.number
              }}</b></a> от {{ item.created_at }} г.
        </p>

        <div class="flex justify-between mt-4">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div>
            <button @click="redirectNotification(item.id, item.contract)"
              class="bg-blue-500 py-1 px-4 rounded text-white">
              {{ $t("list.return") }}
            </button>

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
  //
  methods: {

    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    redirectNotification(id, contract) {
      this.$axios.$put(`/notification/ok/${id}`).then((res) => {
        if (res.success) {
          this.$router.push(this.localePath({
            name: `debt-refund`,
            query: { contract: contract },
          }));
        }
      });
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
