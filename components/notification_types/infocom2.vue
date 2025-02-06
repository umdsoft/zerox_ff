<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700">
          <b>Foydalanuvchi parolining qayta tiklanganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          Siz MyID orqali qayta identifikatsiyadan o‘tgan holda parolingizni
          tikladingiz. Ushbu jarayonda "UZINFOCOM Davlat axborot tizimlarini
          yaratish va qo‘llab-quvvatlash bo‘yicha yagona integrator" MCHJ
          tomonidan xizmat haqi olinishi sababli mobil hisobingizdan
          <b>2 500 UZS</b>
          yechildi.
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
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700">
          <b>Фойдаланувчи паролининг қайта тикланганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          Сиз MyUD орқали қайта идентификациядан ўтган ҳолда паролингизни
          тикладингиз. Ушбу жараёнда "UZINFOCOM Давлат ахборот тизимларини
          яратиш ва қўллаб-қувватлаш бўйича ягона интегратор" МЧЖ
          томонидан хизмат ҳақи олиниши сабабли мобил ҳисобингиздан
          <b>2 500 UZS</b>
          ечилди.
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
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700">
          <b>О восстановлении пароля пользователя</b>
        </p>
        <p class="mt-2">
          Ваш пароль после повторной идентификации через MyID
          ты восстановил В этом процессе ООО «УЗИНФОКОМ Государственные информационные системы»
           «Единый интегратор по созданию и поддержке»
          с вашего мобильного счета за счет комиссии за обслуживание, взимаемой
          <b>2 500 сум</b>
          решено.
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
  name: "debt-demand",
  props: ["item", "getNotifications"],
  mounted() {
    this.socket = this.$nuxtSocket({
      name: "home", // Use socket "home"
      channel: "/", // connect to '/index',
      secure: true,
    });
  },
  methods: {
    async getSockNot() {
      this.socket.emit(
        "notification",
        { userId: this.$auth.user.id },
        (data) => { }
      );

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
        this.$toast.success(`${$nuxt.$t('a1.a43')}`);
        this.getSockNot();
      } catch (err) {
        this.$toast.error(`${$nuxt.$t('a1.a42')}`);
      }
    },
  },
};
</script>

<style></style>
