<template>
  <div>
    <div v-if="$i18n.locale == 'uz'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>Ma’lumotlarni ko‘rishga ruxsat so‘ralganligi to‘g‘risida</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> qarz
          shartnomalaringiz bo‘yicha
          ma’lumotni ko‘rishga ruxsat so‘ramoqda.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white" @click="update(item.id, 1)">
              Ruxsat berish
            </button>
            <button class="bg-red-500 py-1 px-4 rounded text-white" @click="update(item.id, 2)">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'kr'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>Маълумотларни кўришга рухсат сўралганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b> қарз
          шартномаларингиз бўйича маълумотни кўришга рухсат сўрамоқда.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white" @click="update(item.id, 1)">
              Рухсат бериш
            </button>
            <button class="bg-red-500 py-1 px-4 rounded text-white" @click="update(item.id, 2)">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>О запрошенном разрешении на просмотр данных</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
            v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          просит разрешение на просмотр данных по вашим долговым договорам.
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b>
              {{ item.created }} {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white" @click="update(item.id, 1)">
              Разрешить
            </button>
            <button class="bg-red-500 py-1 px-4 rounded text-white" @click="update(item.id, 2)">
              {{ $t("comp.cancel") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notificationMixin from '~/mixins/notificationMixin';

export default {
  name: 'RequestUser',
  mixins: [notificationMixin],

  methods: {
    async update(id, status) {
      try {
        const data = {
          debitor: this.$auth.user.id,
          creditor: this.item.creditor,
          status: status,
          reciver: this.$auth.user.id == this.item.debitor
            ? this.item.creditor
            : this.item.debitor,
        };
        await this.$axios.$post(`/notification/eby/${id}`, data);
        this.showStatusMessage(status);
        if (typeof this.getNotifications === 'function') {
          this.getNotifications();
        }
      } catch (err) {
        this.$toast.error(this.$t('messages.error_occurred'));
      }
    }
  }
};
</script>

<style></style>
