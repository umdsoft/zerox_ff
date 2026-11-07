<template>
  <div v-if="contract !== null" class="rounded-xl bg-white">
    <table class="table-auto my-8 shadow-md text-sm w-full">
      <tbody>
        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">{{ partyLabel }}</td>
          <td class="px-4 py-4">
            {{ $fio(getPartyName(contract)) }}
          </td>
        </tr>

        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">{{ $t('debt_list.debtsumm') }}</td>
          <td class="px-4 py-4">
            {{ $formatNumber(contract.amount) }} {{ contract.currency }}
          </td>
        </tr>

        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">{{ $t('debt_list.date') }}</td>
          <td class="px-4 py-4">
            {{ dateFormat(contract.contract_date || contract.created_at) }}
          </td>
        </tr>

        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">{{ $t('debt_list.dateee') }}</td>
          <td class="px-4 py-4">
            {{ dateFormat(contract.end_date) }}
          </td>
        </tr>

        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">{{ $t('debt_list.debtsum') }}</td>
          <td class="px-4 py-4">
            {{ $formatNumber(contract.refundable_amount) }} {{ contract.currency }}
          </td>
        </tr>

        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">{{ $t('debt_list.debtsums') }}</td>
          <td class="px-4 py-4">
            {{ $formatNumber(contract.residual_amount) }} {{ contract.currency }}
          </td>
        </tr>

        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">{{ $t('debt.contract') }}</td>
          <td class="px-4 py-4">
            <nuxt-link
              class="text-blue-500"
              :to="{ name: 'pdf-generate___' + $i18n.locale, query: { id: contract.id } }"
            >{{ contract.number }}</nuxt-link>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex mb-12 mx-auto items-center flex-col" style="max-width: 23rem">
      <!-- Creditor (qarz oluvchi) Actions — 07.11: rol shartnoma ma'lumotidan (URL'dagi turdan emas) -->
      <template v-if="actionRole === 'borrower'">
        <nuxt-link
          class="w-full bg-blue-500 text-center my-2 py-2 rounded text-white px-4"
          :to="{ name: 'debt-extend-ask___' + $i18n.locale, query: { id: contract.id } }"
        >
          {{ $t("list.clong") }}
        </nuxt-link>
        <nuxt-link
          class="w-full bg-blue-500 text-center py-2 rounded text-white px-4"
          :to="{ name: 'debt-refund___' + $i18n.locale, query: { contract: contract.id } }"
        >
          {{ $t("list.return") }}
        </nuxt-link>
      </template>

      <!-- Debitor (qarz beruvchi) Actions: talab, muddatni uzaytirish, voz kechish -->
      <template v-else-if="actionRole === 'lender'">
        <nuxt-link
          :to="{ name: 'debt-demand___' + $i18n.locale, query: { id: contract.id } }"
          class="w-full bg-blue-500 text-center py-2 rounded text-white px-4"
        >
          {{ labelRequestPayment }}
        </nuxt-link>
        <nuxt-link
          :to="{ path: '/debt-extend', query: { id: contract.id } }"
          class="w-full bg-blue-500 my-2 text-center py-2 rounded text-white px-4"
        >
          {{ labelExtendDebtDebitor }}
        </nuxt-link>
        <nuxt-link
          :to="{ name: 'debt-waiver___' + $i18n.locale, query: { id: contract.id } }"
          class="w-full bg-blue-500 text-center py-2 rounded text-white px-4"
        >
          {{ labelDebtWaiver }}
        </nuxt-link>
      </template>
    </div>

    <!-- 07.11: imzolash varag'i (GET /sign/events) — bo'lmasa/xato bo'lsa ko'rsatilmaydi -->
    <div v-if="signEvents.length" class="mx-auto mb-10 px-4" style="max-width: 40rem">
      <h3 class="text-base font-semibold text-gray-900 mb-3">{{ ST.eventsTitle }}</h3>
      <ul class="divide-y divide-gray-100 rounded-xl border border-gray-100">
        <li v-for="(ev, i) in signEvents" :key="i" class="px-4 py-3 text-sm">
          <div class="flex flex-wrap justify-between gap-2">
            <span class="font-medium text-gray-900">
              {{ ev.signer_name ? $fio(ev.signer_name) : '—' }}
              <span class="text-gray-500">({{ ev.role === 'lender' ? ST.lender : ST.borrower }})</span>
              {{ eventAction(ev.action) }}
            </span>
            <span class="text-gray-500">{{ eventTime(ev.created_at) }}</span>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ (ST.docTypes && ST.docTypes[eventDocType(ev.purpose)]) || ev.purpose }} · {{ eventMethod(ev.method) }}
            <span v-if="ev.doc_hash"> · #{{ String(ev.doc_hash).slice(0, 12) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { dateFormatMixin } from '@/mixins';
import { getByById } from '@/api/contracts';
import { contractRoleOf, ROLE_BORROWER } from '@/utils/contractRole';
import { getSignEvents } from '@/api/sign';
import { signTexts, signMethodText, signActionText } from '@/utils/signFlow';

/** purpose → imzo oynasidagi hujjat turi kaliti (utils/signFlow.js docTypes) */
const PURPOSE_DOC = {
  contract_create: 'contract', contract_approve: 'contract_approve', repayment_confirm: 'repayment_confirm_full',
  time_confirm: 'time_confirm', act_create: 'act', debt_extend: 'extension', debt_forgive: 'forgiveness',
};

export default {
  name: 'ContractDetail',

  middleware: 'auth',

  mixins: [dateFormatMixin],

  data: () => ({
    contract: null,
    signEvents: [], // 07.11: imzolash varag'i
  }),

  computed: {
    ST() {
      return signTexts(this.$i18n && this.$i18n.locale);
    },
    /**
     * Get contract type from route params
     */
    contractType() {
      const type = this.$route.params.type || 'creditor';
      return type.replace('-detail', '');
    },

    /**
     * Check if current view is creditor
     */
    isCreditor() {
      // 07.11: shartnoma yuklangach — haqiqiy rol (contracts.creditor = qarz oluvchi); aks holda URL turi
      if (this.actionRole) {return this.actionRole === ROLE_BORROWER;}
      return this.contractType === 'creditor';
    },

    /**
     * 07.11: joriy foydalanuvchining roli ('lender' | 'borrower' | null). Server amallarni rol bo'yicha
     * cheklaydi (only-lender / only-borrower) — tugmalar ham faqat shu rolga ko'rsatiladi.
     */
    actionRole() {
      const u = this.$auth && this.$auth.user;
      return contractRoleOf(this.contract, u ? u.id : null);
    },

    /**
     * Party label based on type
     */
    partyLabel() {
      return this.isCreditor ? this.$t('debt_list.debtber') : this.$t('l10n.misc.debtor_name');
    },
    // Inline translations for action buttons
    labelExtendDebtDebitor() { return this.$t('contract_labels.modal_extend_debt_debitor'); },
    labelDebtWaiver() { return this.$t('contract_labels.modal_debt_waiver'); },
    labelRequestPayment() { return this.$t('contract_labels.modal_request_payment'); },
  },

  mounted() {
    this.getContract();
  },

  methods: {
    /**
     * Get party name based on contract type
     */
    getPartyName(contract) {
      return this.isCreditor ? contract.debitor_name : contract.creditor_name;
    },

    /**
     * Load contract data from API
     */
    async getContract() {
      try {
        const response = await getByById(this.$axios, this.$route.query.id, { silent: true });
        this.contract = response.data.data;
      } catch (error) {
        this.$toast.error(this.$t('a1.a42'));
        return;
      }
      this.loadSignEvents();
    },

    /** 07.11: GET /sign/events — ixtiyoriy; xato bo'lsa jim (endpoint hali bo'lmasligi mumkin). */
    async loadSignEvents() {
      if (!this.contract || !this.contract.id) {return;}
      try {
        const res = await getSignEvents(this.$axios, this.contract.id, { silent: true });
        const list = Array.isArray(res) ? res : (res && (res.data || res.events)) || [];
        this.signEvents = Array.isArray(list) ? list : [];
      } catch (_) {
        this.signEvents = [];
      }
    },
    eventDocType(purpose) {
      return PURPOSE_DOC[purpose] || purpose;
    },
    eventMethod(method) {
      return signMethodText(method, this.$i18n && this.$i18n.locale);
    },
    eventAction(action) {
      return signActionText(action, this.$i18n && this.$i18n.locale);
    },
    eventTime(v) {
      if (!v) {return '';}
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) {return String(v);}
      // UTC+5 (Toshkent)
      return d.toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
  },
};
</script>

<style scoped>
</style>
