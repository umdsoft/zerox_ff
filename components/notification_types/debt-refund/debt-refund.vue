<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.type == 1 && item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz qaytarilganligi to‘g‘risida</b>
        </p>
        <b>{{ item.created_at }}</b> yildagi
        <a class="text-blue-400" :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
          target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasiga asosan <b v-if="item.ctypes == 2">{{
            item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b v-if="item.ctypes == 1">{{
            item.ccopmany }}</b> olgan
        qarzidan
        <b>{{
          item.refundable_amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }}
          {{ item.currency }}</b>
        miqdorda qaytardi.
        <p>
          Qoldiq qarz miqdori –
          <b>{{
            item.residual_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>.
        </p>
        <!--  -->
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button v-if="item.residual_amount != 0" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="qismanQaytarish(item.id, 1)">
              {{ $t("process.accept") }}
            </button>
            <button v-if="item.residual_amount == 0" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="fullReturn(item.id, 1)">
              {{ $t("process.accept") }}
            </button>
            <button class="bg-red-500 py-1 px-4 rounded text-white" @click="qismanQaytarish(item.id, 2)">
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
          {{ item.created_at }} yildagi
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasiga asosan
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          olgan qarzidan
          <b>{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>
          miqdorda qaytardi.
          <br />
          Qoldiq qarz miqdori –
          <b>{{
            item.residual_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white" @click="fullReturn(item.id, 1)">
              {{ $t("process.accept") }}
            </button>
            <button class="bg-red-500 py-1 px-4 rounded text-white" @click="fullReturn(item.id, 2)">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.type == 1 && item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз қайтарилганлиги тўғрисида</b>
        </p>
        {{ item.created_at }} йилдаги <a class="text-blue-400"
          :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`" target="_blank"><b>{{
            item.number
            }}</b></a>-сонли қарз шартномасига асосан <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{
              item.c_first_name }} {{ item.c_middle_name }}</b><b v-if="item.ctypes == 1">{{ item.ccopmany }}</b> олган
        қарзидан <b>{{
          item.refundable_amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }}
          {{ item.currency }}</b> миқдорда қайтарди. <br>
        Қолдиқ қарз миқдори – <b>{{
          item.residual_amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }}
          {{ item.currency }}</b>.

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button v-if="item.residual_amount != 0" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="qismanQaytarish(item.id, 1)">
              {{ $t("process.accept") }}
            </button>
            <button v-if="item.residual_amount == 0" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="fullReturn(item.id, 1)">
              {{ $t("process.accept") }}
            </button>
            <button class="bg-red-500 py-1 px-4 rounded text-white" @click="qismanQaytarish(item.id, 2)">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.type == 2 && item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз қайтарилганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          {{ item.created_at }} йилдаги <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz&download=0`" target="_blank"><b>{{ item.number
            }}</b></a>-сонли қарз шартномасига асосан <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{
                item.c_first_name }} {{ item.c_middle_name }}</b><b v-if="item.ctypes == 1">{{ item.ccopmany }}</b> олган
          қарзидан <b>{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b> миқдорда қайтарди. <br />
          Қолдиқ қарз миқдори – <b>{{
            item.residual_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white" @click="fullReturn(item.id, 1)">
              {{ $t("process.accept") }}
            </button>
            <button class="bg-red-500 py-1 px-4 rounded text-white" @click="fullReturn(item.id, 2)">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>


    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.type == 1 && item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>О возврате долга</b>
        </p>
        По договору займа №<a class="text-blue-400"
          :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`" target="_blank"><b>{{
            item.number
            }}</b></a> от {{ item.created_at }} г. <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{
              item.c_first_name }} {{ item.c_middle_name }}</b><b v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
        возвратил(а) долг в размере
        <b>{{
          item.refundable_amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }}
          {{ item.currency }}</b>.
        <br>
        Остаточная сумма долга – <b>{{
          item.residual_amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }}
          {{ item.currency }}</b>.
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button v-if="item.residual_amount != 0" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="qismanQaytarish(item.id, 1)">
              {{ $t("process.accept") }}
            </button>
            <button v-if="item.residual_amount == 0" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white"
              @click="fullReturn(item.id, 1)">
              {{ $t("process.accept") }}
            </button>
            <button class="bg-red-500 py-1 px-4 rounded text-white" @click="qismanQaytarish(item.id, 2)">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="item.type == 2 && item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>О возврате долга</b>
        </p>
        <p class="mt-2">
          По договору займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number
            }}</b></a> от {{ item.created_at }} г. <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{
                item.c_first_name }} {{ item.c_middle_name }}</b><b v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          возвратил(а) долг в размере <b>{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>. <br />
          Остаточная сумма долга – <b>{{
            item.residual_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white" @click="fullReturn(item.id, 1)">
              {{ $t("process.accept") }}
            </button>
            <button class="bg-red-500 py-1 px-4 rounded text-white" @click="fullReturn(item.id, 2)">
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
  mounted() {

  },
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
        if (status == 1) {
          this.$toast.success($nuxt.$t('a1.a95'));
        } else if (status == 2) {
          this.$toast.success($nuxt.$t('a1.a92'));
        }
      } catch (e) {
        this.$toast.error($nuxt.$t('a1.a42'));
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
        if (status == 1) {
          this.$toast.success($nuxt.$t('a1.a95'));
        } else if (status == 2) {
          this.$toast.success($nuxt.$t('a1.a92'));
        }

      } catch (e) {
        this.$toast.error($nuxt.$t('a1.a42'));
      }
    },
  },
  props: ["item", "getNotifications"],
};
</script>

<style></style>
