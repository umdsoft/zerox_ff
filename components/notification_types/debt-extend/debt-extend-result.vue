<template>
  <div>
    <div v-if="item.type == 12 || item.type == 16">
      <div v-if="$i18n.locale == 'uz'">
        <div v-if="item.creditor == item.reciver">
          <p class="text-gray-700 mb-2">
            <b>Qarz muddati uzaytirilganligi to‘g‘risida</b>
          </p>

          <b> {{ item.debitor_name }}</b> tomonidan
          <b>{{ dateFormat(item.created_at) }}</b> yildagi
          <nuxt-link
            class="text-blue-400"
            :to="{ path: '/pdf-generate', query: { id: item.contract } }"
            ><b>{{ item.number }}</b></nuxt-link
          >-sonli qarz shartnomasining muddati
          <b>{{ dateFormat(item.end_date) }}</b> yilga qadar uzaytirildi.
          <div class="flex justify-between mt-4">
            <div>
              <span
                ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
                {{ item?.time.slice(0, 5) }}</span
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
        <div v-if="item.debitor == item.reciver">
          <p class="text-gray-700 mb-2">
            <b>Qarz muddati uzaytirilganligi to‘g‘risida</b>
          </p>

          <b> {{ item.creditor_name }}</b> tomonidan
          <b>{{ dateFormat(item.created_at) }}</b> yildagi
          <nuxt-link
            class="text-blue-400"
            :to="{ path: '/pdf-generate', query: { id: item.contract } }"
            ><b>{{ item.number }}</b></nuxt-link
          >-sonli qarz shartnomasining muddati
          <b>{{ dateFormat(item.end_date) }}</b> yilga qadar uzaytirildi.
          <div class="flex justify-between mt-4">
            <div>
              <span
                ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
                {{ item?.time.slice(0, 5) }}</span
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
      <!--  -->
      <div v-if="$i18n.locale == 'kr'">
        <div
          v-if="item.creditor == item.reciver"
          class="py-4 px-8 bg-white shadow-lg rounded-lg w-full"
        >
          <p class="text-gray-700 mb-2">
            <b>Қарз муддати узайтирилганлиги тўғрисида</b>
          </p>

          <b> {{ item.debitor_name }}</b> томонидан
          <b>{{ dateFormat(dateFormat(item.created_at)) }}</b> йилдаги
          {{ item.number }}
          <nuxt-link
            class="text-blue-400"
            :to="{ path: '/pdf-generate', query: { id: item.contract } }"
            ><b>{{ item.number }}</b></nuxt-link
          >-сонли қарз шартномасининг муддати
          {{ dateFormat(item.end_date) }} йилга қадар узайтирилди.

          <div class="flex justify-between mt-4">
            <div>
              <span
                ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
                {{ item?.time.slice(0, 5) }}</span
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
        <div v-if="item.creditor == item.reciver">
          <p class="text-gray-700 mb-2">
            <b>По расширению долга</b>
          </p>

          <b> {{ item.debitor_name }}</b> по
          <b>{{ dateFormat(item.created_at) }}</b> ежегодно
          <nuxt-link
            class="text-blue-400"
            :to="{ path: '/pdf-generate', query: { id: item.contract } }"
            ><b>{{ item.number }}</b></nuxt-link
          >-До долга дегустации договора <b>{{ dateFormat(item.end_date) }}</b
          >был продлен до года.
          <div class="flex justify-between mt-4">
            <div>
              <span
                ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
                {{ item?.time.slice(0, 5) }}</span
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

    <div v-if="item.type === 13">
      <div v-if="$i18n.locale == 'uz'">
        <div v-if="item.creditor == item.reciver">
          <p class="text-gray-700 mb-2">
            <b> Qarz muddatini uzaytirish rad etilganligi to‘g‘risida</b>
          </p>

          <b> {{ item.debitor_name }}</b> tomonidan Sizning
          <b>{{ dateFormat(item.created_at) }}</b> yildagi
          <nuxt-link
            class="text-blue-400"
            :to="{ path: '/pdf-generate', query: { id: item.contract } }"
            ><b>{{ item.number }}</b></nuxt-link
          >-sonli qarz shartnomasining muddatini uzaytirish bo'yicha
          so'rovnomangiz rad qilindi.
          <div class="flex justify-between mt-4">
            <div>
              <span
                ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
                {{ item?.time.slice(0, 5) }}</span
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
        <div v-if="item.creditor == item.reciver">
          <p class="text-gray-700 mb-2">
            <b>О отказе от продления долга</b>
          </p>

          <b> {{ item.debitor_name }}</b> По вашему
          <b>{{ dateFormat(item.created_at) }}</b> ежегодно
          <nuxt-link
            class="text-blue-400"
            :to="{ path: '/pdf-generate', query: { id: item.contract } }"
            ><b>{{ item.number }}</b></nuxt-link
          >- При продлении долгового соглашения Ваш запрос был отклонен.
          <div class="flex justify-between mt-4">
            <div>
              <span
                ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
                {{ item?.time.slice(0, 5) }}</span
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
      <div v-if="$i18n.locale == 'kr'">
        <div v-if="item.creditor == item.reciver">
          <p class="text-gray-700 mb-2">
            <b>Қарз муддатини узайтириш рад этилганлиги тўғрисида</b>
          </p>

          <b> {{ item.debitor_name }} </b>томонидан Сизнинг
          <b> {{ dateFormat(item.created_at) }}</b> йилдаги
          <nuxt-link
            class="text-blue-400"
            :to="{ path: '/pdf-generate', query: { id: item.contract } }"
            ><b>{{ item.number }}</b></nuxt-link
          >-сонли қарз шартномасининг муддатини узайтириш бўйича сўровномангиз
          рад қилинди.
          <div class="flex justify-between mt-4">
            <div>
              <span
                ><b>{{ $t("comp.time") }}:</b> {{ dateFormat(item.created) }}
                {{ item?.time.slice(0, 5) }}</span
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