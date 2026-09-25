<template>
  <div>
    <!-- SS-DEV (2026-09-26): en/kaa tillarida matn uz (lotin) shoxidan ko'rsatiladi — $apiLang() en/kaa->uz -->
    <div v-if="$apiLang() == 'uz'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_demand') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Sizdan
          <b>{{ item.created_at }}</b> yildagi
          <a class="text-blue-400" :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`"
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

    <div v-if="$i18n.locale == 'kr'">
      <div>
        <p class="text-gray-700 mb-2">
          <b>{{ $t('contract_labels.about_demand') }}</b>
        </p>
        <p class="mt-2">
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          Сиздан {{ item.created_at }} йилдаги <a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`" target="_blank" rel="noopener noreferrer"><b>{{ item.number
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
          <b v-if="item.dtypes == 2">{{ item.d_last_name }} {{ item.d_first_name }} {{ item.d_middle_name }}</b><b v-if="item.dtypes == 1">{{ item.dcompany }}</b>
          требует от Вас возврата долга в размере <b>{{ formatMoney(item.residual_amount) }}
            {{ item.currency }}</b>, выданного в соответствии с договором займа  №<a class="text-blue-400"
            :href="`${$pdfIndexUrl}?id=${item.uid}&lang=${$apiLang()}&download=0`" target="_blank" rel="noopener noreferrer"><b>{{ item.number
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

/**
 * SS-DEV (2026-09-26), 25.09 "Xatolar" 1–2-rasm (8-band): qarz oluvchi talab bildirishnomasini
 * KO'RGANDA (OK / "Qarzni qaytarish" bosmasa ham) backend `acts.ack_at` ni yozishi kerak —
 * dalolatnomada "Qarz oluvchi tanishdi" vaqti chiqadi. Bildirishnoma render bo'lganda (mounted)
 * `POST /contract/act/:actId/ack` chaqiriladi. Akt ID bildirishnomada `item.act` (backend
 * `notifications.act` → acts.id, talabQilish `extra: { act }`). Idempotent: bir sessiyada bir
 * marta (modul darajasidagi Set + sessionStorage), backend ham takrorni e'tiborsiz qoldiradi.
 */
const ACK_SS_KEY = 'zx_act_ack';
const ackedActs = new Set();
function loadAcked() {
  try {
    const raw = window.sessionStorage.getItem(ACK_SS_KEY);
    (JSON.parse(raw || '[]') || []).forEach((id) => ackedActs.add(String(id)));
  } catch (_) {}
}
function saveAcked() {
  try { window.sessionStorage.setItem(ACK_SS_KEY, JSON.stringify(Array.from(ackedActs).slice(-200))); } catch (_) {}
}

export default {
  name: 'DebtDemand',
  mixins: [notificationMixin],

  mounted() {
    this.ackDemand();
  },

  methods: {
    /** SS-DEV (2026-09-26): talab dalolatnomasi bilan tanishilganini backendga bir marta yuborish */
    async ackDemand() {
      const actId = this.item && (this.item.act || this.item.act_id);
      if (!actId) return;
      // Faqat qarz oluvchi (bildirishnoma egasi) tanishuvi hisoblanadi
      if (!this.$auth || !this.$auth.user || this.$auth.user.id !== this.item.reciver) return;
      if (!ackedActs.size) loadAcked();
      const key = String(actId);
      if (ackedActs.has(key)) return;
      ackedActs.add(key);
      saveAcked();
      try {
        await this.$axios.$post(`/contract/act/${encodeURIComponent(key)}/ack`, {}, { silent: true });
      } catch (_) {
        // 404 (backend hali ulanmagan) yoki tarmoq xatosi — jim; keyingi sessiyada qayta uriniladi
        ackedActs.delete(key);
        saveAcked();
      }
    },

    redirectNotification(id, contract) {
      this.$axios.$put(`/notification/ok/${id}`, {}, { silent: true }).then((res) => {
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

<style></style>
