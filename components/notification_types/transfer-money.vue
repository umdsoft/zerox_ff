<template>
  <div>
    <!-- Type: sent (23) - Pul o'tkazildi -->
    <!-- Type: received (24) - Pul qabul qilindi -->

    <div v-if="$i18n.locale == 'uz'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700 mb-2">
          <b v-if="isSent">Pul mablag'i o'tkazilganligi to'g'risida</b>
          <b v-else>Pul mablag'i qabul qilinganligi to'g'risida</b>
        </p>
        <p class="mt-2">
          <template v-if="isSent">
            Siz <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
              v-if="item.ctypes == 1">{{ item.ccopmany }}</b>ning mobil hisobiga ({{ item.cuid }})
            <b>{{ formatAmount(item.token) }} UZS</b> o'tkazdingiz.
          </template>
          <template v-else>
            Sizning mobil hisobingizga <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
              v-if="item.dtypes == 1">{{ item.dcompany }}</b> ({{ item.duid }}) tomonidan
            <b>{{ formatAmount(item.token) }} UZS</b> miqdorida mablag' o'tkazildi.
          </template>
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time?.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">Ok</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'kr'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700 mb-2">
          <b v-if="isSent">Пул маблағи ўтказилганлиги тўғрисида</b>
          <b v-else>Пул маблағи қабул қилинганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <template v-if="isSent">
            Сиз <b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
              v-if="item.ctypes == 1">{{ item.ccopmany }}</b>нинг мобил ҳисобига ({{ item.cuid }})
            <b>{{ formatAmount(item.token) }} UZS</b> ўтказдингиз.
          </template>
          <template v-else>
            Сизнинг мобил ҳисобингизга <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
              v-if="item.dtypes == 1">{{ item.dcompany }}</b> ({{ item.duid }}) томонидан
            <b>{{ formatAmount(item.token) }} UZS</b> миқдорида маблағ ўтказилди.
          </template>
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time?.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">Ok</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700 mb-2">
          <b v-if="isSent">О переводе денежных средств</b>
          <b v-else>О поступлении денежных средств</b>
        </p>
        <p class="mt-2">
          <template v-if="isSent">
            Вы перевели <b>{{ formatAmount(item.token) }} UZS</b> на мобильный счет {{ item.cuid }}
            (<b v-if="item.ctypes == 2">{{ item.c_last_name }} {{ item.c_first_name }} {{ item.c_middle_name }}</b><b
              v-if="item.ctypes == 1">{{ item.ccopmany }}</b>).
          </template>
          <template v-else>
            На ваш мобильный счет <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b
              v-if="item.dtypes == 1">{{ item.dcompany }}</b> ({{ item.duid }}) перечислил(а) сумму в размере
            <b>{{ formatAmount(item.token) }} UZS</b>.
          </template>
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time?.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
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
  name: 'TransferMoney',
  mixins: [notificationMixin],

  props: {
    type: {
      type: String,
      default: 'sent', // 'sent' | 'received'
      validator: (v) => ['sent', 'received'].includes(v)
    }
  },

  computed: {
    isSent() {
      return this.type === 'sent';
    }
  },

  methods: {
    formatAmount(value) {
      if (!value) return '0';
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
  }
};
</script>
