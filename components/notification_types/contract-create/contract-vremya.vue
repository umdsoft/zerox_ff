<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <!-- Foydalanuvchi qabul qilmagan bo‘lsa -->
      <div v-if="item.creciver === $auth.user.id">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasining qabul qilinmaganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b>{{ getFullName('receiver') }}</b> tomonidan {{ item.created }} yilda <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasini
          rasmiylashtirish uchun Sizga so‘rovnoma yuborilgan. Ushbu qarz shartnomasi {{ item.created }} yil soat 23:59
          ga qadar
          Siz tomoningizdan qabul qilinmaganligi sababli tizim tomonidan rad qilindi.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>

      <!-- Foydalanuvchi yuborgan, ular qabul qilmagan -->
      <div v-else-if="item.csender === $auth.user.id">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasining qabul qilinmaganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b>{{ getFullName('sender') }}</b>ga {{ item.created }} yilda <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasini rasmiylashtirish
          uchun
          so‘rovnoma yuborgansiz. Ushbu qarz shartnomasi {{ item.created }} yil soat 23:59 ga qadar <b>{{
            getFullName('sender')
          }}</b> tomonidan qabul qilinmaganligi sababli tizim tomonidan rad qilindi.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
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
      <!-- Foydalanuvchi qabul qilmagan bo‘lsa -->
      <div v-if="item.creciver === $auth.user.id">
        <p class="text-gray-700 mb-2">
          <b>Қарз шартномасининг қабул қилинмаганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <b>{{ getFullName('receiver') }}</b> томонидан {{ item.created }} йилда <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-сонли қарз шартномасини расмийлаштириш учун Сизга сўровнома
          юборилган. Ушбу қарз шартномаси {{ item.created }} йил соат 23:59 га қадар Сиз томонингиздан қабул
          қилинмаганлиги сабабли тизим томонидан рад қилинди.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>

      <!-- Foydalanuvchi yuborgan, ular qabul qilmagan -->
      <div v-else-if="item.csender === $auth.user.id">
        <p class="text-gray-700 mb-2">
          <b>Қарз шартномасининг қабул қилинмаганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <b>{{ getFullName('sender') }}</b>га {{ item.created }} йилда <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-сонли қарз шартномасини расмийлаштириш учун сўровнома
          юборгансиз. Ушбу қарз шартномаси {{ item.created }} йил соат 23:59 га қадар <b>{{
            getFullName('sender')
          }}</b> томонидан қабул қилинмаганлиги сабабли тизим томонидан рад қилинди.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
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
      <!-- Foydalanuvchi qabul qilmagan bo‘lsa -->
      <div v-if="item.creciver === $auth.user.id">
        <p class="text-gray-700 mb-2">
          <b>О непринятии договора займа</b>
        </p>
        <p class="mt-2">
          <b>{{ getFullName('receiver') }}</b> {{ item.created }} г. отправил(а) Вам запрос на оформление договора займа
          №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>.
          Однако этот договор займа был автоматически отклонен системой в связи с тем, что Вы не приняли его до 23:59
          {{ item.created }} г.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>

      <!-- Foydalanuvchi yuborgan, ular qabul qilmagan -->
      <div v-else-if="item.csender === $auth.user.id">
        <p class="text-gray-700 mb-2">
          <b>О непринятии договора займа</b>
        </p>
        <p class="mt-2">
          <b>{{ getFullName('sender') }}</b> не принял(а) договор займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a> до 23:59 {{ item.created }} г. Поэтому этот
          договор займа был автоматически отклонен системой.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- kr va ru tillari uchun qo‘shimcha ishlov beriladi -->
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
  props: ["item", "getNotifications"],
  mounted() {
  },
  methods: {
    getFullName(role) {
      if (role === 'sender') {
        return this.item.creditor === this.item.csender
          ? `${this.item.d_last_name} ${this.item.d_first_name} ${this.item.d_middle_name}`
          : `${this.item.c_last_name} ${this.item.c_first_name} ${this.item.c_middle_name}`;
      } else if (role === 'receiver') {
        return this.item.creditor === this.item.creciver
          ? `${this.item.d_last_name} ${this.item.d_first_name} ${this.item.d_middle_name}`
          : `${this.item.c_last_name} ${this.item.c_first_name} ${this.item.c_middle_name}`;
      }
      return "";
    },



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
