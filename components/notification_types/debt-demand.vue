<template>
  <div>
    <!-- SS-DEV (2026-09-26): en/kaa tillarida matn uz (lotin) shoxidan ko'rsatiladi — $apiLang() en/kaa->uz -->
    <div v-if="$i18n.locale == 'uz'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_demand') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Sizdan
          <b>{{ item.created_at }}</b> yildagi
          <a class="text-blue-400" :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-sonli qarz shartnomasiga asosan berilgan <b>{{ formatMoney(item.residual_amount) }}
            {{ item.currency }}</b> qarzni qaytarishingizni
          talab qilmoqda.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="redirectNotification(item.id, item.contract)"
              class="bg-blue-500 py-1 px-4 rounded text-white">
              {{ $t("list.return") }}
            </button>

            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>


    <div v-if="$i18n.locale == 'en'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_demand') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          demands that you repay the debt under the loan agreement dated
          <b>{{ item.created_at }}</b> No.
          <a class="text-blue-400" :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>in the amount of <b>{{ formatMoney(item.residual_amount) }}
            {{ item.currency }}</b> .
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="redirectNotification(item.id, item.contract)"
              class="bg-blue-500 py-1 px-4 rounded text-white">
              {{ $t("list.return") }}
            </button>

            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>


    <div v-if="$i18n.locale == 'kaa'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_demand') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Sizden
          <b>{{ item.created_at }}</b> jılındaǵı
          <a class="text-blue-400" :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })"
            target="_blank" rel="noopener noreferrer"><b>{{ item.number }}</b></a>-nomerli qarız shártnaması tiykarında berilgen <b>{{ formatMoney(item.residual_amount) }}
            {{ item.currency }}</b> qarızdı qaytarıwıńızdı talap etpekte.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="redirectNotification(item.id, item.contract)"
              class="bg-blue-500 py-1 px-4 rounded text-white">
              {{ $t("list.return") }}
            </button>

            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>


    <div v-if="$i18n.locale == 'kr'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_demand') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Сиздан {{ item.created_at }} йилдаги <a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })" target="_blank" rel="noopener noreferrer"><b>{{ item.number
              }}</b></a>-сонли қарз шартномасига асосан берилган <b>{{ formatMoney(item.residual_amount) }}
            {{ item.currency }}</b> қарзни қайтаришингизни талаб қилмоқда.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="redirectNotification(item.id, item.contract)"
              class="bg-blue-500 py-1 px-4 rounded text-white">
              {{ $t("list.return") }}
            </button>

            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_demand') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ $fioJoin(item.d_last_name, item.d_first_name, item.d_middle_name) }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          требует от Вас возврата долга в размере <b>{{ formatMoney(item.residual_amount) }}
            {{ item.currency }}</b>, выданного в соответствии с договором займа  №<a class="text-blue-400"
            :href="$pdfLink('index', { id: item.uid, lang: $apiLang(), download: 0 })" target="_blank" rel="noopener noreferrer"><b>{{ item.number
              }}</b></a> от {{ item.created_at }} г.
        </p>

        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }}
              {{ item?.time.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="redirectNotification(item.id, item.contract)"
              class="bg-blue-500 py-1 px-4 rounded text-white">
              {{ $t("list.return") }}
            </button>

            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notificationMixin from '~/mixins/notificationMixin';
import { putOkById } from '~/api/notifications';

// SS-DEV (2026-09-26), 8-band: talab dalolatnomasi bilan tanishuv (`/contract/act/:act/ack`)
// bildirishnomalar SAHIFASIDA (pages/notification/index.vue `_ackDemandActs`) yuboriladi —
// backend kontrakti: faqat sahifa ochilganda, `type==17 && act && !act_ack_at`.
export default {
  name: 'DebtDemand',
  mixins: [notificationMixin],

  methods: {
    redirectNotification(id, contract) {
      putOkById(this.$axios, id, {}, { silent: true }).then((res) => {
        if (res.success) {
          this.$router.push(this.localePath({
            name: 'debt-refund',
            query: { contract: contract },
          }));
        }
      }).catch(() => {
        this.$toast.error(this.$t('messages.error_occurred'));
      });
    }
  }
};
</script>

<style scoped></style>
