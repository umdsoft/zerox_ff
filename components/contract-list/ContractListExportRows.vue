<template>
  <tbody>
    <tr v-for="(item, i) in (items || [])" :key="i">
      <td>{{ i + 1 }}</td>
      <td>{{ partyName(item) }}</td>
      <td>{{ item.currency }}</td>
      <td>{{ item.amount }}</td>
      <td data-t="s">{{ dateFormat(item.contract_date || item.created_at) }}</td>
      <td data-t="s">{{ dateFormat(item.end_date) }}</td>
      <td>{{ item.inc }}</td>
      <td>{{ item.residual_amount }}</td>
      <td>{{ item.number }}</td>
    </tr>
  </tbody>
</template>

<script>
// wave D: expired/_type va near-expiration/_type dagi yashirin Excel-eksport jadvali <tbody> (baytma-bayt bir xil edi).
import { formatDateLocalIso } from '@/utils/format';
import { partyFullName } from '@/utils/contractParty';
export default {
  name: 'ContractListExportRows',
  props: {
    items: { type: Array, default: () => [] },
    isCreditor: { type: Boolean, default: false },
  },
  methods: {
    partyName(item) { return partyFullName(item, this.isCreditor); },
    dateFormat(date) { return formatDateLocalIso(date); },
  },
};
</script>
