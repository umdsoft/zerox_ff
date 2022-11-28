<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>Ma’lumotni ko‘rishga ruxsat so‘rash to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b>{{ item.debitor_name }}</b> qarz shartnomalaringiz bo‘yicha
          ma’lumotni ko‘rishga ruxsat so‘ramoqda.
        </p>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} {{item?.time.slice(0,5)}}</span
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
      <div>
        <p class="text-gray-700 mb-2">
          <b>С учетом данных</b>
        </p>
        <br>
        <div>
          <b>{{ item.debitor_name }}</b> Согласно вашим кредитным контрактам 
           Запрашивает разрешение просмотреть информацию.
        </div>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} {{item?.time.slice(0,5)}}</span
            >
          </div>
          <div>
            <button
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="update(item.id, 1)"
            >
              Разрешать
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
      <div>
        <p class="text-gray-700 mb-2">
          <b>Ma’lumotni ko‘rishga ruxsat so‘rash to‘g‘risida</b>
        </p>
        <br>
        <div>
          <b>{{ item.debitor_name }}</b> qarz shartnomalaringiz bo‘yicha
          ma’lumotni ko‘rishga ruxsat so‘ramoqda.
        </div>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} {{item?.time.slice(0,5)}}</span
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
    async update(id, status) {
      try {
        await this.$axios.$put(`/notification/eby/${id}`, { status: status });
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