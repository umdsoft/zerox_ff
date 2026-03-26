<template>
  <div class="bg-white px-4 py-6 w-full my-4 rounded-xl">
    <BackButton />
    <div v-if="contract != null">
      <div class="flex justify-center items-center">
        <div class="w-full max-w-2xl mt-6">
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-3">
              <svg class="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 class="font-bold text-xl text-gray-800">
              {{ $t("a1.a98") }}
            </h2>
          </div>

          <!-- Contract Info Card -->
          <div class="info-card">
            <div class="text-sm text-gray-700 leading-relaxed">
              <span v-if="$i18n.locale == 'uz'">
                {{ $formatDate(contract.contract_date || contract.created_at) }} yildagi
                <a class="text-blue-500 font-semibold hover:underline" :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-sonli qarz shartnomasi bo'yicha Siz fuqaro
                <span class="font-semibold text-gray-900">{{ contract.creditor_name }}</span>dan qarzni qaytarishini talab qilmoqdasiz.
              </span>

              <span v-if="$i18n.locale == 'kr'">
                {{ $formatDate(contract.contract_date || contract.created_at) }} йилдаги
                <a class="text-blue-500 font-semibold hover:underline" :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a>-сонли қарз шартномаси бўйича Сиз фуқаро
                <span class="font-semibold text-gray-900">{{ contract.creditor_name }}</span>дан қарзни қайтаришини талаб қилмоқдасиз.
              </span>

              <span v-if="$i18n.locale == 'ru'">
                По договору займа №<a class="text-blue-500 font-semibold hover:underline" :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">{{ contract.number }}</a> от {{ $formatDate(contract.contract_date || contract.created_at) }} г. Вы требуете
                возврата долга от <span class="font-semibold text-gray-900">Заемщика ({{ contract.creditor_name }})</span>.
              </span>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center mt-8 mb-4">
            <button
              @click="sendDemand"
              :disabled="isSubmitting"
              :class="isSubmitting ? 'submit-btn submit-btn--disabled' : 'submit-btn submit-btn--active'"
            >
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              {{ $t("send") }}
            </button>
          </div>
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
      const contract = await this.$axios.get(
        `/contract/by/${this.$route.query.id}`,
        { silent: true }
      );
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
        const response = await this.$axios.post("/contract/talab", data, { silent: true });
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

<style lang="css" scoped>
.info-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  padding: 0.875rem 2rem;
  font-weight: 600;
  font-size: 0.938rem;
  border-radius: 0.625rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.submit-btn--active {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.submit-btn--active:hover {
  background: #2563eb;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}
</style>
