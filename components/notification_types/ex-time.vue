<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="$auth.user.id === item.creditor">
        <p class="text-gray-700 mb-2">
          <b>Qarz muddatini uzaytirish rad etilganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha qarzni qaytarish muddatini
          uzaytirish to‘g‘risidagi so‘rovingiz
          <b>{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b> tomonidan {{
            item.created }} yil soat 23:59 ga qadar qabul qilinmaganligi sababli
          tizim tomonidan bekor qilindi. Qayta so‘rov yuborishingiz mumkin.
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
      <div v-if="$auth.user.id === item.debitor">
        <p class="text-gray-700 mb-2">
          <b>Qarz muddatini uzaytirish rad etilganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b>{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b> tomonidan {{
            item.created }} yilda
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha qarzni qaytarish muddatini
          uzaytirish to‘g‘risida Sizga so‘rov yuborilgan. Ushbu so‘rov Siz tomoningizdan {{ item.created }}
          yil 23:59 ga qadar qabul qilinmaganligi sababli tizim tomonidan bekor qilindi.

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
      <div v-if="$auth.user.id === item.creditor">
        <p class="text-gray-700 mb-2">
          <b>Қарз муддатини узайтириш рад этилганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a>-сонли қарз шартномаси бўйича қарзни қайтариш муддатини узайтириш тўғрисидаги сўровингиз
          <b>{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b> томонидан {{
            item.created }} йил соат 23:59 га қадар қабул қилинмаганлиги сабабли тизим томонидан
          бекор қилинди. Қайта сўров юборишингиз мумкин.
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
      <div v-if="$auth.user.id === item.debitor">
        <p class="text-gray-700 mb-2">
          <b>Қарз муддатини узайтириш рад этилганлиги тўғрисида</b>
        </p>
        <p class="mt-2">

          <b>{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b> томонидан {{
            item.created }} йилда <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-сонли қарз шартномаси бўйича қарзни
          қайтариш муддатини узайтириш тўғрисида Сизга сўров юборилган. Ушбу сўров Сиз томонингиздан {{
            item.created }} йил соат
          23:59 га қадар қабул қилинмаганлиги сабабли тизим томонидан бекор қилинди.

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
      <div v-if="$auth.user.id === item.creditor">
        <p class="text-gray-700 mb-2">
          <b>Об отказе в продлении срока займа</b>
        </p>
        <p class="mt-2">

          <b>{{ item.d_last_name }} {{ item.d_first_name }} {{
            item.d_middle_name }}</b> не принял(а) Ваш запрос на продление срока возврата долга по договору займа
          №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
              }}</b></a> до 23:59 <b>{{ item.created }} г.</b> Поэтому этот запрос был автоматически отклонен
          системой.
          Вы можете отправить запрос повторно.
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
      <div v-if="$auth.user.id === item.debitor">
        <p class="text-gray-700 mb-2">
          <b>Об отказе в продлении срока займа</b>
        </p>
        <p class="mt-2">

          <b>{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b> {{
            item.created }} г. отправил(а) Вам запрос на продление срока возврата долга по договору
          займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>. Этот запрос был автоматически отклонен системой в связи с
          тем, что он не был
          принят до 23:59 {{
            item.created }} г.

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
