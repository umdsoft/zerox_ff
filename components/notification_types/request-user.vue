<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>Ma’lumotni ko‘rishga ruxsat so‘rash to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.debitor_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b> qarz shartnomalaringiz bo‘yicha
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
      transports: ["websocket"],
    });
  },
  methods: {
    async getSockNot() {
      this.socket.emit(
        "notification",
        { userId: this.$auth.user.id },
        (data) => {}
      );
    },
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
        this.getSockNot();
      } catch (err) {
        this.$toast.error("Xatolik yuz berdi");
      }
    },
  },
};
</script>

<style>
</style>