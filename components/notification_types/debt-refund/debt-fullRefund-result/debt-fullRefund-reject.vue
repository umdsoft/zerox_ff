<template>
  <div>
    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">{{ $t("comp.noti") }}</p>
        <p class="text-gray-700 mb-2">
          <b>Қарзни тўлиқ қайтариш тўғрисида</b>
        </p>
        Сизнинг
        <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-сонли қарз шартномаси
        <!-- muddatini {{ dateFormat(item.act.end_date) }} yilgacha uzaytirish -->
        бўйича қарзни тўлиқ қайтарилганлиги тўғрисидаги сўровингиз
        <b>{{ item.debitor_name }}</b> томонидан рад этилди.
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
    </div>

    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">{{ $t("comp.noti") }}</p>
        <p class="text-gray-700 mb-2">
          <b> Qarzni to'liq qaytarish to‘g‘risida</b>
        </p>
        Sizning <b>{{ dateFormat(item.created_at) }}</b> yildagi
        <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.id } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-sonli qarz shartnomasi bo‘yicha muddatini uzaytirish bo`yicha
        so`rovnomangiz rad qilindi.
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

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">{{ $t("comp.noti") }}</p>
        <p class="text-gray-700 mb-2">
          <b> Qarzni qaytarish qabul qilinmaganligi to‘g‘risida</b>
        </p>
        <b>{{ dateFormat(item.created_at) }}</b> yildagi
        <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-sonli qarz shartnomasi bo‘yicha qarzni qaytarish to‘g‘risidagi Sizning
        so‘rovnomangiz <b>{{ item.debitor_name }}</b> tomonidan qabul qilinmadi.
        <br /><br />
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
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.debitor == item.reciver">
        <p class="text-gray-700 mb-2">{{ $t("comp.noti") }}</p>
        <p class="text-gray-700 mb-2">
          <b> При полном погашении долга</b>
        </p>
        Ваш <b>{{ dateFormat(item.created_at) }}</b>ежегодно
        <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.id } }"
          ><b>{{ item.number }}</b></nuxt-link
        >- В соответствии с продлением периода в рамках долгового соглашения 
         Ваша страховка была отклонена.
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

      <div v-if="item.creditor == item.reciver">
        <p class="text-gray-700 mb-2">{{ $t("comp.noti") }}</p>
        <p class="text-gray-700 mb-2">
          <b> По невозвращению долга</b>
        </p>
        <b>{{ dateFormat(item.created_at) }}</b> ежегодно
        <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-С для возврата долга по долговому соглашению 
         Ваш запрос<b>{{ item.debitor_name }}</b>не был принят. 
         <br /> <br /> 
         Сумма баланса долга -
        <b
          >{{
            item.residual_amount
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }}
          {{ item.currency }}</b
        >.

        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }}год</span
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
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
  props: ["item", "getNotifications"],
  methods: {
    async ok(id) {
      try {
        await this.$axios.$put(`/notification/ok/${id}`);
        this.$toast.success("Muvaffaqiyatli bajarildi");
        this.getNotifications();
      } catch (err) {
        this.$toast.error("Xatolik yuz berdi");
      }
    },

    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
  },
};
</script>

<style>
</style>