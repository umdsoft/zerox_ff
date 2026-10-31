<template>
  <!-- 23.10 (22.10 hujjati, 5-rasm): 2 ustunli tartib — chapda shartnoma ma'lumoti, o'ngda talab formasi.
       Xatti-harakat (POST /contract/talab) o'zgarmagan. -->
  <ContractActionLayout :contract="contract" :title="$t('a1.a98')" tone="red">
    <template #icon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </template>

    <template v-if="contract">
      <p class="cal-f-title">{{ $t('a1.a98') }}</p>
      <div class="cal-f-intro">
        <!-- SS-DEV (2026-09-26): en/kaa tillarida matn uz (lotin) shoxidan ko'rsatiladi — $apiLang() en/kaa->uz -->
        <span v-if="$i18n.locale == 'uz'">
          {{ $formatDate(contract.contract_date || contract.created_at) }} yildagi
          <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-sonli qarz shartnomasi bo'yicha Siz fuqaro
          <span class="font-semibold text-gray-900">{{ $fio(contract.creditor_name) }}</span>dan qarzni qaytarishini talab qilmoqdasiz.
        </span>

        <span v-if="$i18n.locale == 'en'">
          Under loan agreement No. <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a> dated {{ $formatDate(contract.contract_date || contract.created_at) }}, you are demanding that
          <span class="font-semibold text-gray-900">{{ $fio(contract.creditor_name) }}</span> repay the debt.
        </span>

        <span v-if="$i18n.locale == 'kaa'">
          {{ $formatDate(contract.contract_date || contract.created_at) }} jılındaǵı <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-nomerli qarız shártnaması boyınsha Siz
          <span class="font-semibold text-gray-900">{{ $fio(contract.creditor_name) }}</span> degen adamnan qarızdı qaytarıwdı talap etip atırsız.
        </span>

        <span v-if="$i18n.locale == 'kr'">
          {{ $formatDate(contract.contract_date || contract.created_at) }} йилдаги
          <a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-сонли қарз шартномаси бўйича Сиз фуқаро
          <span class="font-semibold text-gray-900">{{ $fio(contract.creditor_name) }}</span>дан қарзни қайтаришини талаб қилмоқдасиз.
        </span>

        <span v-if="$i18n.locale == 'ru'">
          По договору займа №<a :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a> от {{ $formatDate(contract.contract_date || contract.created_at) }} г. Вы требуете
          возврата долга от <span class="font-semibold text-gray-900">Заемщика ({{ $fio(contract.creditor_name) }})</span>.
        </span>
      </div>

      <div class="cal-f-actions">
        <button
          type="button"
          class="cal-f-submit"
          :disabled="isSubmitting"
          @click="sendDemand"
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          {{ $t("send") }}
        </button>
      </div>
    </template>
  </ContractActionLayout>
</template>

<script>
import ContractActionLayout from '@/components/contract/ContractActionLayout.vue';
import { postTalab, getByById } from '@/api/contracts';

export default {
  components: { ContractActionLayout },
  data: () => ({
    amount: null,
    act: null,
    creditor_format_name: null,
    contract: null,
    isBtnDisabled: true,
    isSubmitting: false,
    isAffirmed: false,
    debitor_signature: null,
    ll: null
  }),
  async mounted() {
    if (!this.$auth.loggedIn) {
      return this.$router.push(this.localePath({ name: "auth-login" }));
    }
    try {
      const contract = await getByById(this.$axios, this.$route.query.id, { silent: true });
      this.contract = contract.data.data;
      this.creditor_format_name = this.$latinToCyrillic(this.contract.creditor_formatted_name);
      this.ll = this.contract.cgender == 1 ? "У" : "ОЙ";
    } catch (e) {
      this.$toast.error(this.$t('messages.error_occurred'));
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
  methods: {
    async sendDemand() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      const data = {
        contract: this.contract.id,
        debitor: this.contract.debitor,
        creditor: this.contract.creditor,
        residual_amount: this.contract.residual_amount,
        reciver: this.contract.creditor,
        act: this.contract.act,
      };

      try {
        const response = await postTalab(this.$axios, data, { silent: true });
        if (response.status == 200 && response.data.msg == "ex") {
          this.isSubmitting = false;
          this.$toast.error(this.$t('a1.a70'));
        }
        if (response.status == 201) {
          this.$toast.success(this.$t('a1.a69'));
          this.socket?.emit(
            "notification",
            { userId: this.$auth.user.id },
            (data) => { }
          );
          this.$backWithLocale();
        } else {
          this.isSubmitting = false;
        }
      } catch (e) {
        this.isSubmitting = false;
        this.$toast.error(this.$t('a1.a42'));
      }
    },
  },
};
</script>
