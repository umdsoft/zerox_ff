<template>
  <!-- 23.10 (22.10 hujjati, 7-rasm): 2 ustunli tartib — chapda shartnoma ma'lumoti, o'ngda voz kechish
       tasdig'i. Xatti-harakat (POST /contract/vos-kechish) o'zgarmagan. -->
  <ContractActionLayout :contract="contract" :title="$t('action.waive')" tone="orange">
    <template #icon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    </template>

    <template v-if="contract">
      <p class="cal-f-title">{{ $t("action.waive") }}</p>
      <div class="cal-f-intro">
        <!-- SS-DEV (2026-09-26): en/kaa tillarida matn uz (lotin) shoxidan ko'rsatiladi — $apiLang() en/kaa->uz -->
        <span v-if="$i18n.locale == 'uz'">
          Siz {{ $formatDate(contract.contract_date || contract.created_at) }} yildagi
          <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-sonli qarz shartnomasi bo'yicha
          <b>{{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}</b>
          qarzdan voz kechmoqdasiz.
        </span>

        <span v-if="$i18n.locale == 'en'">
          You are waiving the debt of <b>{{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}</b>
          under loan agreement No. <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a> dated {{ $formatDate(contract.contract_date || contract.created_at) }}.
        </span>

        <span v-if="$i18n.locale == 'kaa'">
          Siz {{ $formatDate(contract.contract_date || contract.created_at) }} jılındaǵı <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-nomerli qarız shártnaması boyınsha
          <b>{{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}</b>
          qarızdan waz keship atırsız.
        </span>

        <span v-if="$i18n.locale == 'kr'">
          Сиз {{ $formatDate(contract.contract_date || contract.created_at) }} йилдаги
          <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-сонли қарз шартномаси бўйича
          <b>{{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}</b>
          қарздан воз кечмоқдасиз.
        </span>

        <span v-if="$i18n.locale == 'ru'">
          Вы освобождаете Заёмщика от возврата суммы займа в размере
          <b>{{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}</b> по договору займа №<a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a> от {{ $formatDate(contract.contract_date || contract.created_at) }} г.
        </span>
      </div>

      <label class="cal-f-check" for="ok">
        <input id="ok" v-model="isAffirmed" type="checkbox" @change="validate" />
        <a :href="link" target="_blank" rel="noopener noreferrer" @click.stop>{{ $t("action.agree_terms") }}</a>
      </label>

      <div class="cal-f-actions">
        <button type="button" class="cal-f-submit cal-f-submit--red" :disabled="isBtnDisabled || isSubmitting" @click="sendWaiver">
          {{ confirmLabel }}
        </button>
      </div>
    </template>
  </ContractActionLayout>
</template>

<script>
import ContractActionLayout from '@/components/contract/ContractActionLayout.vue';

export default {
  components: { ContractActionLayout },
  middleware: "auth",
  computed: {
    confirmLabel() {
      return this.$t('contract_labels.confirm');
    },
  },
  data: () => ({
    step: 1,
    amount: null,
    isAffirmed: false,
    inc: 0,
    isBtnDisabled: true,
    isSubmitting: false,
    page: "",
    contract: null,
    act: null,
    link: null
  }),
  async mounted() {
    try {
      const contract = await this.$axios.get(
        `/contract/by/${this.$route.query.id}`,
        { silent: true }
      );
      this.contract = contract.data.data;
      this.updateLink();
    } catch (e) {
      this.$toast.error(this.$t('a1.a42'));
      return;
    }
    this.socket = this.$nuxtSocket({
      name: "home",
      channel: "/",
      secure: true,
    });
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  },
  watch: {
    time(newTime) {
      this.updateLink(); // Sana o'zgarganida linkni yangilash
    },
  },
  methods: {
    updateLink() {
      this.link = this.$actPdfUrl({
        debitor: this.contract.duid,
        creditor: this.contract.cuid,
        act_type: 4,
        vos_summa: this.contract.residual_amount,
        uid: this.contract.uid,
      });
    },
    async getSockNot() {
      this.socket.emit(
        "notification",
        { userId: this.$auth.user.id },
        (data) => { }
      );
      this.socket.emit(
        "me",
        { userId: this.$auth.user.id },
        (data) => { }
      );
    },
    handleClick(command) {
      this.page = command;
      this.step = this.step + 1;
    },

    validate() {
      // 23.10: belgi olib tashlansa tugma yana o'chadi (ilgari doim yoqilib qolardi)
      this.isBtnDisabled = !this.isAffirmed;
    },

    async sendWaiver() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      try {
        const dds = await this.$axios.get(
          `/contract/by/${this.$route.query.id}`,
          { silent: true }
        );
        this.dx = dds.data.data;
      } catch (e) {
        return this.$toast.error(this.$t('a1.a42'));
      }
      const data = {
        contract: this.contract.id,
        refundable_amount: 0,
        residual_amount: this.dx.residual_amount,
        old_amount: this.contract.residual_amount,
        vos_summa: this.dx.residual_amount,
        inc: this.dx.inc,
        end_date: this.contract.end_date.slice(0, 10),
        debitor: this.contract.debitor,
        creditor: this.contract.creditor,
        sender: this.contract.debitor,
        res: this.contract.debitor,
        reciver: this.contract.creditor,
      };
      try {
        const response = await this.$axios.post(`/contract/vos-kechish`, data, { silent: true });
        if (response.status == 200 && response.data.msg == "ex") {
          this.isSubmitting = false;
          this.$toast.error(
            this.$t('a1.a70')
          );
        }
        if (response.status == 201) {
          this.socket.emit(
            "notification",
            { userId: this.$auth.user.id },
            (data) => { }
          );
          this.$toast.success(this.$t('a1.a71'));
          this.$backWithLocale();
        } else {
          this.isSubmitting = false;
        }
      } catch (e) { this.isSubmitting = false; this.$toast.error(this.$t('a1.a42')); }
    },
  },
};
</script>
