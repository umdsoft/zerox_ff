<template>
  <div>
    <!-- Type: denied (31) - Ruxsat berilmagan -->
    <!-- Type: granted (30) - Ruxsat berilgan -->

    <div v-if="$i18n.locale == 'uz'">
      <div>
        <p class="text-gray-700 mb-2">
          <b v-if="isDenied">Ma'lumotlarni ko'rishga ruxsat berilmaganligi to'g'risida</b>
          <b v-else>Ma'lumotlarni ko'rishga ruxsat berilganligi to'g'risida</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b>
          <b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          <template v-if="isDenied">qarz ma'lumotlarini ko'rishga ruxsat bermadi.</template>
          <template v-else>qarz ma'lumotlarini ko'rishga ruxsat berdi.</template>
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time?.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button v-if="!isDenied" @click="sendUrl(item, item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ma'lumotlarni ko'rish
            </button>
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">Ok</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'kr'">
      <div>
        <p class="text-gray-700 mb-2">
          <b v-if="isDenied">Маълумотларни кўришга рухсат берилмаганлиги тўғрисида</b>
          <b v-else>Маълумотларни кўришга рухсат берилганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b>
          <b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          <template v-if="isDenied">қарз маълумотларини кўришга рухсат бермади.</template>
          <template v-else>қарз маълумотларини кўришга рухсат берди.</template>
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time?.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button v-if="!isDenied" @click="sendUrl(item, item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Маълумотларни кўриш
            </button>
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">Ok</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div>
        <p class="text-gray-700 mb-2">
          <b v-if="isDenied">О том, что просмотр данных не разрешён</b>
          <b v-else>О разрешении на просмотр данных</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b>
          <b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          <template v-if="isDenied">не разрешил(а) просмотреть данные о займах.</template>
          <template v-else>разрешил(а) просмотреть данные о займах.</template>
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time?.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button v-if="!isDenied" @click="sendUrl(item, item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Просмотреть данные
            </button>
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">Ok</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notificationMixin from '~/mixins/notificationMixin';

export default {
  name: 'PermissionResponse',
  mixins: [notificationMixin],

  props: {
    type: {
      type: String,
      default: 'denied', // 'denied' | 'granted'
      validator: (v) => ['denied', 'granted'].includes(v)
    }
  },

  computed: {
    isDenied() {
      return this.type === 'denied';
    }
  },

  methods: {
    async sendUrl(item, id) {
      try {
        this.$auth.user2 = {
          tok: this.$auth.user.id == item.debitor ? item.ctok : item.dtok,
          created_at: this.$auth.user.id == item.debitor ? item.ccreated : item.dcreated,
          id: this.$auth.user.id == item.debitor ? item.creditor : item.debitor,
          name: this.$auth.user.id == item.debitor
            ? `${item.c_last_name} ${item.c_first_name} ${item.c_middle_name}`
            : `${item.d_last_name} ${item.d_first_name} ${item.d_middle_name}`,
          uid: this.$auth.user.id == item.debitor ? item.cuid : item.duid,
          image: this.$auth.user.id == item.debitor ? item.cimage : item.dimage,
        };

        await this.$axios.$put(`/notification/ok/${id}`);
        await this.$router.push(this.localePath({ name: 'search-result-type', params: { type: 'debitor' } }));
      } catch (err) {
        this.$toast.error(this.$t('messages.error_occurred'));
      }
    }
  }
};
</script>
