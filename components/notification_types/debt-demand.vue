<template>
  <div>
    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.creditor == item.reciver">
        <div>
          <p class="text-gray-700 mb-2">
            <b>Қарзни қайтариш талаб қилинганлиги тўғрисида </b>
          </p>
          <p class="mt-2">
            <b> {{ item.debitor_name }} </b>Сиздан
            <b>{{ dateFormat(item.created_at) }}</b> йилдаги
            <a
              class="text-blue-400"
              :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`"
              target="_blank"
              ><b>{{ item.number }}</b></a
            >-сонли қарз шартномасига асосан берилган
            <b>{{ item.residual_amount }}</b> <b>{{ item.currency }}</b> қарзни
            қайтаришингизни талаб қилмоқда.
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
                @click="redirectNotification(item.id, item.contract)"
                class="bg-blue-500 py-1 px-4 rounded text-white"
              >
                {{ $t("list.return") }}
              </button>

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
    <div v-if="$i18n.locale == 'uz'">
      <div>
        <div>
          <p class="text-gray-700 mb-2">
            <b>Qarzni qaytarish talab qilinganligi to‘g‘risida</b>
          </p>
          <p class="mt-2">
            <b>{{ item.debitor_name }}</b> Sizdan
            <b>{{ dateFormat(item.created_at) }}</b> yildagi
            <a
              class="text-blue-400"
              :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`"
              target="_blank"
              ><b>{{ item.number }}</b></a
            >-sonli qarz shartnomasiga asosan berilgan qarzni qaytarishingizni
            talab qilmoqda.
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
                @click="redirectNotification(item.id, item.contract)"
                class="bg-blue-500 py-1 px-4 rounded text-white"
              >
                {{ $t("list.return") }}
              </button>

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
    <div v-if="$i18n.locale == 'ru'">
      <div v-if="item.creditor == item.reciver">
        <div>
          <p class="text-gray-700 mb-2">
            <b>О требовании о возврате долга</b>
          </p>
          <p class="mt-2">
            <b>{{ item.debitor_name }}</b> От вас
            <b>{{ dateFormat(item.created_at) }}</b>
            в год
            <a
              class="text-blue-400"
              :href="`https://pdf.zerox.uz/index.php?id=${item.uid}&lang=uz`"
              target="_blank"
              ><b>{{ item.number }}</b></a
            >- выдается на основании кредитного договора №
            <b>
              {{
                item.residual_amount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              }}
              {{ item.currency }}</b
            >
            с требованием вернуть долг.
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
                @click="redirectNotification(item.id, item.contract)"
                class="bg-blue-500 py-1 px-4 rounded text-white"
              >
                {{ $t("list.return") }}
              </button>

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
  name: "debt-demand",
  props: ["item", "getNotifications"],
  methods: {
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    redirectNotification(id, contract) {
      this.$axios.$put(`/notification/ok/${id}`).then((res) => {
        if (res.success) {
          this.$router.push({
            name: `debt-refund___${this.$i18n.locale}`,
            query: { contract: contract },
          });
        }
      });
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