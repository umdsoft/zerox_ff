<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasining qabul qilinmaganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
        <b> {{ item.creditor_name }}</b
        >ga
        <b>
          {{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
        miqdorida qarz berish to‘g‘risidagi shartnoma belgilangan muddat
        davomida qabul qilinmadi.</p>

        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} {{item?.time.slice(0,5)}}</span
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Qarz shartnomasining qabul qilinmaganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
        <b>{{ item.debitor_name }}</b
        >dan
        <b
          >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
        miqdorida qarz olish to‘g‘risidagi shartnoma belgilangan muddat davomida
        qabul qilinmadi.</p>

        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} {{item?.time.slice(0,5)}}</span
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
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз шартномасининг қабул қилинмаганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
        <b> {{ item.creditor_name }}</b
        >га
        <b
          >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
        миқдорида қарз бериш тўғрисидаги шартнома белгиланган муддат давомида
        қабул қилинмади.</p>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} {{item?.time.slice(0,5)}}</span
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>Қарз шартномасининг қабул қилинмаганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
        <b>{{ item.creditor_name }}</b
        >дан
        <b
          >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
        миқдорида қарз олиш тўғрисидаги шартнома белгиланган муддат давомида
        қабул қилинмади.</p>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} {{item?.time.slice(0,5)}}</span
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
      <div v-if="item.debitor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>О не вступительном долговом соглашении</b>
        </p>
        <p class="mt-2">
        <b> {{ item.creditor_name }}</b
        >газету
        <b>
          {{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
     Кредитное соглашение о кредитовании 
         не было принято во время.</p>
        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} {{item?.time.slice(0,5)}}</span
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

      <div v-if="item.creditor === item.reciver">
        <p class="text-gray-700 mb-2">
          <b>О не вступительном долговом соглашении</b>
        </p>
        <b>{{ item.debitor_name }}</b
        >а также
        <b
          >{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
          {{ item.currency }}</b
        >
Сумма договора о заимствовании находится в пределах указанного периода 
         не был принят.

        <div class="flex justify-between mt-4">
          <div>
            <span
              ><b>{{ $t("comp.time") }}:</b>
              {{ dateFormat(item.created) }} {{item?.time.slice(0,5)}}</span
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
  },
};
</script>

<style>
</style>