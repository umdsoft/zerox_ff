<template>
  <!--  -->
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarzni qaytarish qabul qilinmaganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          <b> {{ item.created_at }}</b> yildagi
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasiga asosan
          <b>
            {{
              item.refundable_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}
          </b>
          qarz mablag‘ini qaytarish bo‘yicha Sizga so‘rov yuborgan.
          Biroq ushbu so‘rov {{ item.created }} yil soat 23:59 ga
          qadar Siz tomoningizdan qabul qilinmaganligi sababli tizim tomonidan
          bekor qilindi.
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarzni qaytarish qabul qilinmaganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-sonli qarz shartnomasi bo‘yicha
          <b>{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>
          qaytarilganligi yuzasidan yuborgan so‘rovingiz
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> tomonidan
          {{ item.created }} yil soat 23:59 ga qadar qabul
          qilinmaganligi sababli tizim tomonidan bekor qilindi. Qayta so‘rov
          yuborishingiz mumkin.
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
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарзни қайтариш қабул қилинмаганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.ctypes == 1">{{ item.ccopmany }}</b>
          <b> {{ item.created_at }}</b> йилдаги
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-сонли қарз шартномасига асосан
          <b>
            {{
              item.refundable_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}
          </b>
          қарз маблағини қайтариш бўйича Сизга сўров юборган.
          Бироқ ушбу сўров {{ item.created }} йил соат 23:59 га
          қадар Сиз томонингиздан қабул қилинмаганлиги сабабли тизим томонидан
          бекор қилинди.
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарзни қайтариш қабул қилинмаганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a>-сонли қарз шартномаси бўйича
          <b>{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b>
          қайтарилганлиги юзасидан юборган сўровингиз
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> томонидан
          {{ item.created }} йил соат 23:59 га қадар қабул
          қилинмаганлиги сабабли тизим томонидан бекор қилинди. Қайта сўров
          юборишингиз мумкин.
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
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>О непринятии возврата долга</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> не принял(а) Ваш запрос о возврате <b>{{
              item.refundable_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}</b> по договору займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a> до 23:59
          <b>{{ item.created }} г.</b> Поэтому этот запрос был автоматически отклонен системой. Вы можете
          отправить запрос
          повторно.
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>О непринятии возврата долга</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> отправил(а)
          Вам запрос на возврат суммы займа в размере <b>{{
            item.refundable_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
            {{ item.currency }}</b> по договору займа №<a class="text-blue-400"
            :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=${$i18n.locale}&download=0`"
            target="_blank"><b>{{ item.number }}</b></a> от <b>{{ item.created_at }}</b> г.
            Однако Вы не приняли этот запрос до 23:59 <b>{{ item.created }} г.</b>  Поэтому этот запрос был автоматически отклонен системой.

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
export default {
  props: ["item", "getNotifications"],
  mounted() {

  },
  methods: {
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
