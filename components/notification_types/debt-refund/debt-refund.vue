<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.type == 1 && item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz qaytarilganligi to‘g‘risida</b>
        </p>
        <b>{{ dateFormat(item.created_at) }}</b> yildagi
        <a
          class="text-blue-400"
          :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`"
          target="_blank"
          ><b>{{ item.number }}</b></a
        >-sonli qarz shartnomasiga asosan <b v-if="item.ctypes == 2">{{ item.creditor_name }}</b><b v-if="item.ctypes == 1">{{ item.ccopmany }}</b> olgan
        qarzidan
        <b
          >{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
          {{ item.currency }}</b
        >
        miqdorda qaytardi.
        <p>
          Qoldiq qarz miqdori –
          <b
            >{{
              item.residual_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}</b
          >.
        </p>
        <!--  -->
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <button
              v-if="item.residual_amount != 0"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="qismanQaytarish(item.id, 1)"
            >
              {{ $t("process.accept") }}
            </button>
            <button
            v-if="item.residual_amount == 0"
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="fullReturn(item.id, 1)"
            >
              {{ $t("process.accept") }}
            </button>
            <button
              class="bg-red-500 py-1 px-4 rounded text-white"
              @click="qismanQaytarish(item.id, 2)"
            >
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="item.type == 2 && item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz qaytarilganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b> {{ dateFormat(item.created_at) }}</b> yildagi
          <a
            class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`"
            target="_blank"
            ><b>{{ item.number }}</b></a
          >-sonli qarz shartnomasiga asosan
          <b v-if="item.ctypes == 2">{{ item.creditor_name }}</b><b v-if="item.ctypes == 1">{{ item.ccopmany }}</b> olgan qarzidan
          <b
            >{{
              item.refundable_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}</b
          >
          miqdorda qaytardi.
          <br />
          Qoldiq qarz miqdori –
          <b
            >{{
              item.residual_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}</b
          >.
        </p>

        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
              {{ item?.time.slice(0, 5) }}</span
            >
          </div>
          <div>
            <button
              class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="fullReturn(item.id, 1)"
            >
              {{ $t("process.accept") }}
            </button>
            <button
              class="bg-red-500 py-1 px-4 rounded text-white"
              @click="fullReturn(item.id, 2)"
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
  methods: {
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    async fullReturn(id, status) {
      const data = {
        debitor: this.item.debitor,
        creditor: this.item.creditor,
        act: this.item.act,
        contract: this.item.contract,
        stype: status,
        reciver:
          this.item.reciver == this.item.debitor
            ? this.item.creditor
            : this.item.debitor,
      };
      // return console.log(data)
      try {
        await this.$axios.post(`/notification/toliq-qaytarish/${id}`, data);

        this.$toast.success("Muvaffaqiyatli bajarildi");
        this.getNotifications();
      } catch (e) {
        this.$toast.error("Xatolik yuz berdi");
      }
    },

    async qismanQaytarish(id, status) {
      const data = {
        debitor: this.item.debitor,
        creditor: this.item.creditor,
        contract: this.item.contract,
        act: this.item.act,
        stype: status,
        reciver:
          this.item.reciver == this.item.debitor
            ? this.item.creditor
            : this.item.debitor,
      };
      // return console.log(data)
      try {
        await this.$axios.post(`/notification/qisman-qaytarish/${id}`, data);
        this.$toast.success("Bajarildi");
        this.getNotifications();
      } catch (e) {
        this.$toast.error("Xatolik yuz berdi");
      }
    },
  },
  props: ["item", "getNotifications"],
};
</script>

<style>
</style>