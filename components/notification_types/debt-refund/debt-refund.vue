<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.type == 1 && item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">{{$t("comp.noti")}}</p>
        <h5 class="text-xl font-semibold mb-4">
          Qarz qaytarilganligi to‘g‘risida
        </h5>

        <b>{{ dateFormat(item.created_at) }}</b> yildagi
        <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-sonli qarz shartnomasiga asosan <b>{{ item.creditor_name }}</b> olgan
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
        <div class="flex justify-between mt-4">
          <div> <span><b>{{$t("comp.time")}}:</b> {{dateFormat(item.created)}} yil</span></div>
          <div>
          <button
            class="bg-blue-500 py-2 px-4 mx-2 rounded text-white"
            @click="qismanQaytarish(item.id, 1)"
          >
            {{$t("process.accept")}}
          </button>
          <button
            class="bg-red-500 py-2 px-4 rounded text-white"
            @click="qismanQaytarish(item.id, 2)"
          >
            {{$t("comp.cancel")}}
          </button>
          </div>
        </div>
      </div>
      <div v-if="item.type == 2 && item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">{{$t("comp.noti")}}</p>
        <h5 class="text-xl font-semibold mb-4">
          Qarz qaytarilganligi to‘g‘risida
        </h5>

        <b> {{ dateFormat(item.created_at) }}</b> yildagi
        <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-sonli qarz shartnomasiga asosan <b>{{ item.creditor_name }}</b> olgan
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

        <div class="flex justify-between mt-4">
          <div><span><b>{{$t("comp.time")}}:</b> {{dateFormat(item.created)}} yil</span></div>
          <div>
          <button
            class="bg-blue-500 py-2 px-4 mx-2 rounded text-white"
            @click="fullReturn(item.id, 1)"
          >
             {{$t("process.accept")}}
          </button>
          <button
            class="bg-red-500 py-2 px-4 rounded text-white"
            @click="fullReturn(item.id, 2)"
          >
            {{$t("comp.cancel")}}
          </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'kr'">
      <div
        v-if="item.type == 1 && item.debitor === item.reciver"
        class="py-4 px-8 bg-white shadow-lg rounded-lg w-full"
      >
        <p class="text-gray-700 mb-2">{{$t("comp.noti")}}</p>
        <h5 class="text-xl font-semibold mb-4">
          Қарз қайтарилганлиги тўғрисида
        </h5>
        <b>{{ item.creditor_name }} {{ dateFormat(item.created_at) }}</b>
        йилдаги
        <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-сонли қарз шартномасига асосан олган қарзини қайтарди. Қолдиқ қарз
        миқдори -
        <b
          >{{
            item.residual_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
          {{ item.currency }}</b
        >
        <div class="flex justify-between mt-4">
          <div><span><b>{{$t("comp.time")}}:</b> {{dateFormat(item.created)}} yil</span></div>
          <div>
          <button
            class="bg-blue-500 py-2 px-4 mx-2 rounded text-white"
            @click="qismanQaytarish(item.id, 1)"
          >
             {{$t("process.accept")}}
          </button>
          <button
            class="bg-red-500 py-2 px-4 rounded text-white"
            @click="qismanQaytarish(item.id, 2)"
          >
            {{$t("comp.cancel")}}
          </button>
          </div>
        </div>
      </div>

      <div v-if="item.type == 2 && item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">{{$t("comp.noti")}}</p>
        <h5 class="text-xl font-semibold mb-4">
          Қарз қайтарилганлиги тўғрисида
        </h5>
        <b>{{ item.creditor_name }} {{ dateFormat(item.created_at) }}</b>
        йилдаги
        <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-сонли қарз шартномасига асосан олган қарзини қайтарди. Қолдиқ қарз
        миқдори - <b>{{ item.residual_amount }} {{ item.currency }}</b>

        <div class="flex justify-between mt-4">
          <div><span><b>{{$t("comp.time")}}:</b> {{dateFormat(item.created)}} yil</span></div>
          <div>
          <button
            class="bg-blue-500 py-2 px-4 mx-2 rounded text-white"
            @click="fullReturn(item.id, 1)"
          >
             {{$t("process.accept")}}
          </button>
          <button
            class="bg-red-500 py-2 px-4 rounded text-white"
            @click="fullReturn(item.id, 2)"
          >
            {{$t("comp.cancel")}}
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