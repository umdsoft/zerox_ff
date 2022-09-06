<template>
  <div>
    <div v-if="$i18n.locale == 'kr'">
      <div v-if="item.creditor == item.reciver">
        <div>
          <p class="text-gray-700 mb-2">{{$t("comp.noti")}}</p>
          <p class="text-gray-700 mb-2">
            <b>Қарзни қайтариш талаб қилинганлиги тўғрисида </b>
          </p>
          <div>
          <b>  {{ item.debitor_name }} </b>Сиздан
            <b>{{ dateFormat(item.created_at) }}</b> йилдаги
            <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-сонли
            қарз шартномасига асосан берилган <b>{{ item.residual_amount }}</b>
            <b>{{ item.currency }}</b> қарзни қайтаришингизни талаб қилмоқда.
          </div>
          <div class="flex justify-between mt-4">
            <div>
              <span><b>{{$t("comp.time")}}:</b> {{dateFormat(item.created)}} yil</span>
            </div>
            <div>
            <button
            
            @click="redirectNotification(item.id,item.contract)"
              class="bg-blue-500 py-1 px-4 rounded text-white"
            >
              {{$t("list.return")}}
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
      <div v-if="item.creditor == item.reciver">
        <div>
          <p class="text-gray-700 mb-2">{{$t("comp.noti")}}</p>
          <p class="text-gray-700 mb-2">
            <b>Qarzni qaytarish talab qilinganligi to‘g‘risida</b>
          </p>
          <div>
            <b>{{ item.debitor_name }}</b> Sizdan
            <b>{{ dateFormat(item.created_at) }}</b> yildagi
             <nuxt-link
          class="text-blue-400"
          :to="{ path: '/pdf-generate', query: { id: item.contract } }"
          ><b>{{ item.number }}</b></nuxt-link
        >-sonli qarz shartnomasiga asosan berilgan
           <b> {{
              item.residual_amount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }}
            {{ item.currency }}</b> qarzni qaytarishingizni talab qilmoqda.
          </div>
          <div class="flex justify-between mt-4">
            <div>
              <span><b>{{$t("comp.time")}}:</b> {{dateFormat(item.created)}} yil</span>
            </div>
            <div>
            <button
            
            @click="redirectNotification(item.id,item.contract)"
              class="bg-blue-500 py-1 px-4 rounded text-white"
            >
              {{$t("list.return")}}
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
                    })
                }
            })
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