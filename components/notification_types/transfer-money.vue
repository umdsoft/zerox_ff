<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700 mb-2">{{ $t("comp.noti") }}</p>
        <p class="text-gray-700 mb-2">
          <b>Pul mablag‘i o‘tkazganlik to‘g‘risida</b>
        </p>
        <div>
          Siz <b>{{ item.creditor_name }}</b> mobil hisobiga
          {{ item.token }} so‘m o‘tkazdingiz.
        </div>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} yil</span
            >
          </div>
          <div>
            <button
              @click="ok(item.id)"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="$auth.user.id === item.creditor">
        <p class="text-gray-700 mb-2">{{ $t("comp.noti") }}</p>
        <p class="text-gray-700 mb-2">
          <b>Pul mablag‘i qabul qilb olganlik to‘g‘risida</b>
        </p>
        <div>
          <b>{{ item.debitor_name }}</b> qarz shartnomalaringiz bo‘yicha
          ma‘lumotni ko‘rishga ruxsat so‘ramoqda.
        </div>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} yil</span
            >
          </div>
          <div>
            <button
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="update(item.id, 1)"
            >
              Ruxsat berish
            </button>
            <button
              class="bg-red-500 py-1 px-4 rounded text-white"
              @click="update(item.id, 2)"
            >
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="$i18n.locale == 'ru'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700 mb-2">{{ $t("comp.noti") }}</p>
        <p class="text-gray-700 mb-2">
          <b>О переводе средств</b>
        </p>
        <div>
        Вы <b>{{ item.creditor_name }}</b>на мобильный счет
          {{ item.token }}Вы перечислили сум.
        </div>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} год</span
            >
          </div>
          <div>
            <button
              @click="ok(item.id)"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="$auth.user.id === item.creditor">
        <p class="text-gray-700 mb-2">{{ $t("comp.noti") }}</p>
        <p class="text-gray-700 mb-2">
          <b>О поступлении средств</b>
        </p>
        <div>
          <b>{{ item.debitor_name }}</b> в соответствии с вашим кредитным договором
          запрос разрешения на просмотр информации.
        </div>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} год</span
            >
          </div>
          <div>
            <button
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="update(item.id, 1)"
            >
              Дать разрешение
            </button>
            <button
              class="bg-red-500 py-1 px-4 rounded text-white"
              @click="update(item.id, 2)"
            >
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'kr'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700 mb-2">{{ $t("comp.noti") }}</p>
        <p class="text-gray-700 mb-2">
          <b>Пул маблагаи о'тказганлик то'г'рисида</b>
        </p>
        <div>
          Siz <b>{{ item.creditor_name }}</b> мобиль хисобига
          {{ item.token }} so‘m o‘tkazdingiz.
        </div>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} йил</span
            >
          </div>
          <div>
            <button
              @click="ok(item.id)"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
      <div v-if="$auth.user.id === item.creditor">
        <p class="text-gray-700 mb-2">{{ $t("comp.noti") }}</p>
        <p class="text-gray-700 mb-2">
          <b>Пул маблагаи кабул кылб олганлик то'г'рисида</b>
        </p>
        <div>
          <b>{{ item.debitor_name }}</b>карз шартномаларингиз бойича
          ма’лумотни коришга ​​руксат со‘рамокда.
        </div>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} йил</span
            >
          </div>
          <div>
            <button
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="update(item.id, 1)"
            >
            Руксат Бериш
            </button>
            <button
              class="bg-red-500 py-1 px-4 rounded text-white"
              @click="update(item.id, 2)"
            >
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
  name: "debt-demand",
  props: ["item", "getNotifications"],
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
        this.$toast.success("Muvaffaqiyatli bajarildi");
        this.getNotifications();
      } catch (err) {
        this.$toast.error("Xatolik yuz berdi");
      }
    },
  },
};
</script>
  
  <style>
</style>