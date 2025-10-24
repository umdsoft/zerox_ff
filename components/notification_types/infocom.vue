<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700">
          <b>Tizimda ro‘yxatdan o‘tilganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          Tabriklaymiz! Siz tizimda muvaffaqiyatli ro‘yxatdan o‘tdingiz va tizim funksiyalaridan to‘liq foydalanish
          imkoniga ega bo‘ldingiz. Sizdan tizimga kirish parolini esda saqlashingizni va uni boshqa shaxslarga oshkor
          qilmasligingizni so‘raymiz.
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
        <p class="text-gray-700">
          <b>Тизимда рўйхатдан ўтилганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          Табриклаймиз! Сиз тизимда муваффақиятли рўйхатдан ўтдингиз ва тизим функцияларидан тўлиқ фойдаланиш имконига
          эга бўлдингиз. Сиздан тизимга кириш паролини эсда сақлашингизни ва уни бошқа шахсларга ошкор қилмаслигингизни
          сўраймиз.
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
        <p class="text-gray-700">
          <b>О регистрации в системе</b>
        </p>
        <p class="mt-2">
          Поздравляем! Вы успешно зарегистрировались в системе и получили полный доступ к функциям системы. Мы просим
          Вас запомнить пароль для входа в систему и не раскрывать его другим лицам.
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
