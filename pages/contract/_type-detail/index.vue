<template>
  <div v-if="contract !== null" class="rounded-xl bg-white">
    <table class="table-auto my-8 shadow-md text-sm w-full">
      <tbody>
        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">{{ partyLabel }}</td>
          <td class="px-4 py-4">
            {{ getPartyName(contract) }}
          </td>
        </tr>

        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">{{ $t('debt_list.debtsumm') }}</td>
          <td class="px-4 py-4">
            {{ formatAmount(contract.amount) }} {{ contract.currency }}
          </td>
        </tr>

        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">{{ $t('debt_list.date') }}</td>
          <td class="px-4 py-4">
            {{ dateFormat(contract.created_at) }}
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
            {{ formatAmount(contract.refundable_amount) }} {{ contract.currency }}
          </td>
        </tr>

        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">{{ $t('debt_list.debtsums') }}</td>
          <td class="px-4 py-4">
            {{ formatAmount(contract.residual_amount) }} {{ contract.currency }}
          </td>
        </tr>

        <tr style="border-bottom: 1px solid #d9d5ec" class="py-4 w-full">
          <td class="px-8 py-4">Qarz shartnomasi</td>
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
      <!-- Creditor Actions -->
      <template v-if="isCreditor">
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

      <!-- Debitor Actions -->
      <template v-else>
        <nuxt-link
          :to="{ name: 'debt-demand___' + $i18n.locale, query: { id: contract.id } }"
          class="w-full bg-blue-500 text-center py-2 rounded text-white px-4"
        >
          {{ $t('action.a6') }}
        </nuxt-link>
        <nuxt-link
          :to="{ path: '/debt-extend', query: { id: contract.id } }"
          class="w-full bg-blue-500 my-2 text-center py-2 rounded text-white px-4"
        >
          {{ $t('action.a4') }}
        </nuxt-link>
        <nuxt-link
          :to="{ name: 'debt-waiver___' + $i18n.locale, query: { id: contract.id } }"
          class="w-full bg-blue-500 text-center py-2 rounded text-white px-4"
        >
          {{ $t('action.a5') }}
        </nuxt-link>
      </template>
    </div>
  </div>
</template>

<script>
import { dateFormatMixin } from '@/mixins';

export default {
  name: 'ContractDetail',

  middleware: 'auth',

  mixins: [dateFormatMixin],

  data: () => ({
    contract: null,
  }),

  computed: {
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
      return this.contractType === 'creditor';
    },

    /**
     * Party label based on type
     */
    partyLabel() {
      return this.isCreditor ? 'Qarz bergan shaxs' : 'Qarzdor nomi';
    },
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
     * Format amount with thousand separators
     */
    formatAmount(amount) {
      if (!amount) return '0';
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },

    /**
     * Load contract data from API
     */
    async getContract() {
      try {
        const response = await this.$axios.get(`/contract/by/${this.$route.query.id}`);
        this.contract = response.data.data;
      } catch (error) {
        this.$toast.error(this.$t('a1.a42') || "Xatolik yuz berdi!");
      }
    },
  },
};
</script>

<style scoped>
</style>
