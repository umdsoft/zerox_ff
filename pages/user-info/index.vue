<template>
  <div>
    <div class="bg-white rounded-xl flex flex-col px-4 py-4">
        <BackButton />

      <div v-if="user != null">
        <div class="btm flex flex-wrap lg:flex-nowrap items-center justify-center">
          <table class="iksweb">
            <tbody>
              <tr>
                <td>
                  <span class="text-t_primary">{{ $t("transfer.fio") }}:</span>
                </td>
                <td>
                  {{ user.first_name }} {{ user.last_name }}
                  {{ user.middle_name }}
                </td>
              </tr>
              <tr>
                <td class="text-t_primary">
                  <span class="text-t_primary">{{ $t("transfer.reg_system") }}:</span>
                </td>
                <td>
                  {{ $formatDate(user.created_at) }}
                  {{ $t('page_labels.year_suffix') }}
                </td>
              </tr>
              <tr>
                <td>
                  <span class="text-t_primary">{{ $t("transfer.id") }}:</span>
                </td>
                <td>{{ user.uid }}</td>
              </tr>
            </tbody>
          </table>

          <div class="flex lg:flex-col justify-center flex-wrap mt-8 ml-3 lg:mt-0">
            <button v-if="user?.id && dis == false" :disabled="dis" :class="dis ? 'bg-gray-300' : 'bg-t_primary'"
              @click="seeInfo" class="
                bta
                flex
                py-2
                px-2
                rounded
                mt-2
                lg:mt-0
                justify-center
                mx-2
                items-center
                text-white
              ">
              {{ $t("qarz") }}
            </button>

            <button v-if="dis == true" :disabled="disa" :class="disa ? 'bg-gray-300' : 'bg-green-400'"
              @click="redirectUrl(user.uid, $route.query.type)" class="
                bta
                flex
                py-2
                px-2
                rounded
                mt-2
                lg:mt-0
                justify-center
                mx-2
                items-center
                text-white
              ">
              {{ $t("process.see1") }}
            </button>

            <button @click="redirectUrl2(user.uid, $route.query.type)" class="
                bta
                mx-2
                px-4
                mt-2
                rounded
                py-2
                text-center
                flex
                justify-center
                items-center
                bg-t_primary
                text-white
              ">
              <span v-if="$route.query.type == 'creditor'">{{
                $t("mqarz")
                }}</span>
              <span v-if="$route.query.type == 'debitor'">{{
                $t("mqarz2")
                }}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="flex justify-between pl-10 pr-20 mt-7" v-if="disas == false && disa == true">
        <div class="text-sm">
          <p>
            {{ $t("comp.teet") }}
          </p>
        </div>
        <span id="timer" v-if="sec == true">05:00</span>
        <div class="text-sm" v-if="sec == false">
          <p>{{ $t("comp.teet2") }}</p>
          <p>{{ $t("comp.teet3") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackButton from '@/components/BackButton.vue';

export default {
  components: { BackButton },
  data: () => ({
    user: null,
    disas: true,
    time1: null,
    isDisabled: true,
    timeH: null,
    timeSecond: null,
    countDown: null,
    dis: false,
    disa: true,
    dd: null,
    sd: null,
    token: null,
    sec: false,
    arg: null,
  }),

  async created() {
    this.timeSecond = null;
    this.countDown = null;
    this.dis = false;
    this.disa = true;
    this.dd = null;
    this.sd = null;
    this.token = null;
    this.sec = false;
    if (!this.$route.query.id) {
      return this.$backWithLocale();
    }
    if (!this.$route.query.type) {
      return this.$backWithLocale();
    }
  },
  async mounted() {
    try {
      const user = await this.$axios.$get(
        `/user/candidate/${this.$route.query.id}`
      );
      this.user = user.data;
      this.$auth.user2 = this.user;
    } catch (error) {
      this.$toast.error(this.$t('errors.loadUserFailed') || 'Failed to load user');
    }
  },
  beforeDestroy() {
    if (this.countDown) {
      clearInterval(this.countDown);
    }
  },
  methods: {
    redirectUrl(id, type) {
      this.$auth.user2 = this.user;
      if (type == "creditor") {
        this.$auth.user2 = this.user;
        this.$router.push(this.localePath({
          name: `search-creditor-result`,
          query: { id: id },
        }));
      }
      if (type == "debitor") {
        this.$auth.user2 = this.user;
        this.$router.push(this.localePath({
          name: `search-debitor-result`,
          query: { id: id },
        }));
      }
    },
    redirectUrl2(id, type) {
      this.$auth.user2 = this.user;
      if (type == "creditor") {
        this.$auth.user2 = this.user;
        this.$router.push(this.localePath({
          name: `take-money`,
          query: { id: id },
        }));
      }
      if (type == "debitor") {
        this.$auth.user2 = this.user;
        this.$router.push(this.localePath({
          name: `give-money`,
          query: { id: id },
        }));
      }
    },
    async seeInfo() {
      this.timeSecond = 300;
      const datta = {
        debitor: this.$auth.user.id,
        creditor: this.$auth.user.id,
        reciver: this.user.id,
      };
      try {
        const response = await this.$axios.post("notification/reqquest", datta);
        if (response.status == 201) {
          this.$toast.success(this.$t('a1.a21'));
          this.disas = false;
          this.sec = true;
          this.dis = true;
          if (this.disa == true) {
            this.countDown = setInterval(async () => {
              this.timeSecond--;

              if (this.disa == true) {
                const sd = await this.$axios.get(
                  `notification/by/${response.data.data.id}`
                );
                this.sd = sd.data;
                if (this.sd.data.status == 1) {
                  this.token = response.data.data.token;
                  this.disa = false;
                  return 0;
                }
              }

              this.displayTime(this.timeSecond);
              if (this.timeSecond == 0 || this.timeSecond < 1) {
                this.endCount();
                clearInterval(this.countDown);
              }
            }, 1000);
          }
        }
      } catch (e) {
       return this.$toast.error(this.$t('a1.a53'));
      }
    },

    displayTime(second) {
      this.timeH = document.getElementById("timer");
      const min = Math.floor(second / 60);
      const sec = Math.floor(second % 60);
      if (this.timeH) {
        this.timeH.textContent = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
      }
    },
    endCount() {
      this.disa = true;
      this.dis = false;
      this.sec = false;
      this.timeH = document.getElementById("timer");
      if (this.timeH) {
        this.timeH.textContent = "";
      }
    },
    setUserId(e) {
      this.id = e.target.value.toUpperCase();
    },
  },
};
</script>

<style>
/* Стили таблицы (IKSWEB) */
table.iksweb {
  text-decoration: none;
  border-collapse: collapse;
  width: 50%;
}

table.iksweb th {
  font-weight: normal;
  font-size: 14px;
  color: #ffffff;
  background-color: #000000;
}

table.iksweb td {
  font-size: 15px;
  color: #000000;
}

table.iksweb td,
table.iksweb th {
  padding: 6px 5px;
  line-height: 13px;
  vertical-align: middle;
}
</style>
