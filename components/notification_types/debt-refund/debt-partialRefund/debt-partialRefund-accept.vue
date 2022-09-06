<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <p class="text-gray-700 mb-2">{{$t("comp.noti")}}</p>
      <h5 class="text-xl font-semibold mb-4">
        Qarzni qaytarish qabul qilinganligi toʻgʻrisida
      </h5>
      <b>{{ dateFormat(item.created_at) }}</b> yildagi
      <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-sonli qarz shartnomasi bo‘yicha qarzni qaytarish to‘g‘risidagi Sizning
      so‘rovnomangiz <b>{{ item.debitor_name }}</b> tomonidan qabul qilindi. <br />
      Qoldiq qarz miqdori –
     <b> {{
        item.residual_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      }}
      {{ item.currency }}</b>.

        <div class="flex justify-between mt-4">
           <div>
              <span><b>{{$t("comp.time")}}:</b> {{dateFormat(item.created)}} yil</span>
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
    <div v-if="$i18n.locale == 'kr'">
      <p class="text-gray-700 mb-2">{{$t("comp.noti")}}</p>
      <h5 class="text-xl font-semibold mb-4">Қарз қайтарилганлиги тўғрисида</h5>
      <b>{{ dateFormat(item.created_at) }}</b> йилдаги
     <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-сонли қарз шартномаси бўйича қазни қайтариш тўғрисидаги Сизнинг
      сўровномангиз <b> {{ item.debitor_name }}</b> томонидан қабул қилинди. <br />
      Қолдиқ қарз миқдори –
      <b>{{
        item.residual_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      }}
      {{ item.currency }}</b>.

        <div class="flex justify-between mt-4">
           <div>
              <span><b>{{$t("comp.time")}}:</b> {{dateFormat(item.created)}} yil</span>
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
</template>

<script>
import dateformat from "dateformat";
export default {
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