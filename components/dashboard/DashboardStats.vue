<template>
  <div :class="hideTitle ? '' : 'mt-6 lg:mt-8'">
    <h2 v-if="!hideTitle" class="text-lg lg:text-xl font-bold text-gray-900 mb-4">{{ texts.financialSummary }}</h2>
    <!-- SS-DEV (2026-09-24): 4 ta karta ENDI BIR XIL EMAS (foydalanuvchi talabi):
         "Berilgan qarz" va "Olingan qarz" — ASOSIY, to'q gradient fonli katta kartalar;
         ikkita "Muddati o'tgan" — YORDAMCHI, och qizil fonli, ixcham kartalar, har biri
         o'z asosiy kartasi YONIDA (juftlik). Shunda foydalanuvchi ko'z bilan ajratadi.
         ⚠️ Ranglar inline style/statik klasslarda — Tailwind JIT o'chiq.

         SS-DEV (2026-09-24), hujjat 5- va 6-rasmlar:
           • "Muddati o'tgan" kartalari sarlavhasi "(debitor)/(kreditor)" o'rniga
             "Berilgan qarz" / "Olingan qarz" (uz/ru/kr) — `overdueGiven`/`overdueTaken`;
           • shu kartalardagi BARCHA matn va raqamlar "Muddati o'tgan" belgisi shriftida
             (`text-xs`), UZS va USD bir xil kichik; asosiy kartalar O'ZGARMADI;
           • komponent QAYTA ISHLATILADIGAN bo'ldi: `links` (kartalar manzili), `labels`
             (asosiy karta sarlavhalari), `hideTitle` — Qarz daftari sahifasi ham shu
             kartalardan foydalanadi (bir xil uslub). -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <!-- JUFTLIK 1: Berilgan qarz (debitor) + muddati o'tgan (debitor) -->
      <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 lg:gap-4">
        <component :is="selectable ? 'button' : 'nuxt-link'" :to="selectable ? undefined : to.debitor" :type="selectable ? 'button' : undefined" class="block group text-left w-full sm:col-span-3 rounded-2xl" :class="selectable && active === 'debitor' ? 'ring-4 ring-blue-300' : ''" @click="onSelect('debitor')">
          <div class="rounded-2xl p-5 shadow-lg h-full text-white transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-0.5" style="background: linear-gradient(135deg, #2563EB 0%, #4338CA 100%);">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style="background: rgba(255,255,255,0.18);">
                <IconDebitor :width="28" :height="28" class="text-white" />
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full" style="background: rgba(255,255,255,0.18);">{{ texts.receivable }}</span>
            </div>
            <h3 class="text-sm font-medium mb-2" style="color: rgba(255,255,255,0.85);">{{ label.debitor }}</h3>
            <p class="text-2xl lg:text-3xl font-extrabold leading-tight mb-1">
              {{ amount(debitorUzs) }} <span class="text-sm font-medium" style="color: rgba(255,255,255,0.8);">UZS</span>
            </p>
            <p class="text-base font-semibold" style="color: rgba(255,255,255,0.9);">
              {{ amount(debitorUsd) }} <span class="text-sm font-medium" style="color: rgba(255,255,255,0.75);">USD</span>
            </p>
          </div>
        </component>

        <component :is="selectable ? 'button' : 'nuxt-link'" :to="selectable ? undefined : to.expiredDebitor" :type="selectable ? 'button' : undefined" class="block group text-left w-full sm:col-span-2 rounded-lg" :class="selectable && active === 'expiredDebitor' ? 'ring-4 ring-blue-300' : ''" @click="onSelect('expiredDebitor')">
          <!-- Yordamchi karta: skelet asosiy karta bilan bir xil, lekin matn/raqamlar kichikroq.
               SS-DEV (2026-09-26), 25.09 "Xatolar" 3-rasm: burchaklar kamroq aylana (rounded-lg),
               "Muddati o'tgan" chip'i karta bo'ylab GORIZONTAL MARKAZDA (ikonka chapda, absolute),
               sarlavha text-xs→text-sm, summalar text-xs→text-base (valyuta text-sm). Asosiy kartalar o'zgarmadi. -->
          <div class="rounded-lg p-5 h-full border border-dashed transition-all duration-300 hover:shadow-md" style="background: #FFF1F2; border-color: #FCA5A5;">
            <!-- SS-DEV (2026-09-26): ikonka `absolute` bo'lgani uchun tor kartada markazdagi chip ustiga
                 tushardi (26.09 skrinshot). Endi oddiy flex qator: ikonka chapda (flex-shrink-0), chip qolgan
                 bo'sh joyning markazida — hech qachon ustma-ust tushmaydi, tor ekranda qisqaradi. -->
            <div class="flex items-center gap-2 mb-4" style="min-height: 2.5rem;">
              <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style="background: #FEE2E2;">
                <IconExpiredD :width="24" :height="24" />
              </div>
              <div class="flex-1 min-w-0 flex justify-center">
                <span class="text-xs font-semibold px-2.5 py-1 rounded-full text-center leading-tight" style="background: #FEE2E2; color: #B91C1C;">{{ texts.overdue }}</span>
              </div>
            </div>
            <h3 class="text-sm font-medium mb-2" style="color: #9F1239;">{{ label.expiredDebitor }}</h3>
            <p class="text-base font-bold leading-tight mb-1 whitespace-nowrap" style="color: #DC2626;">
              {{ amount(expiredDebitorUzs) }} <span class="text-sm font-medium" style="color: #EF4444;">UZS</span>
            </p>
            <p class="text-base font-bold whitespace-nowrap" style="color: #DC2626;">
              {{ amount(expiredDebitorUsd) }} <span class="text-sm font-medium" style="color: #EF4444;">USD</span>
            </p>
          </div>
        </component>
      </div>

      <!-- JUFTLIK 2: Olingan qarz (kreditor) + muddati o'tgan (kreditor) -->
      <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 lg:gap-4">
        <component :is="selectable ? 'button' : 'nuxt-link'" :to="selectable ? undefined : to.creditor" :type="selectable ? 'button' : undefined" class="block group text-left w-full sm:col-span-3 rounded-2xl" :class="selectable && active === 'creditor' ? 'ring-4 ring-blue-300' : ''" @click="onSelect('creditor')">
          <div class="rounded-2xl p-5 shadow-lg h-full text-white transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-0.5" style="background: linear-gradient(135deg, #059669 0%, #0F766E 100%);">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style="background: rgba(255,255,255,0.18);">
                <IconCreditor :width="28" :height="28" class="text-white" />
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full" style="background: rgba(255,255,255,0.18);">{{ texts.payable }}</span>
            </div>
            <h3 class="text-sm font-medium mb-2" style="color: rgba(255,255,255,0.85);">{{ label.creditor }}</h3>
            <p class="text-2xl lg:text-3xl font-extrabold leading-tight mb-1">
              {{ amount(creditorUzs) }} <span class="text-sm font-medium" style="color: rgba(255,255,255,0.8);">UZS</span>
            </p>
            <p class="text-base font-semibold" style="color: rgba(255,255,255,0.9);">
              {{ amount(creditorUsd) }} <span class="text-sm font-medium" style="color: rgba(255,255,255,0.75);">USD</span>
            </p>
          </div>
        </component>

        <component :is="selectable ? 'button' : 'nuxt-link'" :to="selectable ? undefined : to.expiredCreditor" :type="selectable ? 'button' : undefined" class="block group text-left w-full sm:col-span-2 rounded-lg" :class="selectable && active === 'expiredCreditor' ? 'ring-4 ring-blue-300' : ''" @click="onSelect('expiredCreditor')">
          <!-- SS-DEV (2026-09-26): yuqoridagi "Muddati o'tgan" kartasi bilan bir xil tuzatishlar -->
          <div class="rounded-lg p-5 h-full border border-dashed transition-all duration-300 hover:shadow-md" style="background: #FFF1F2; border-color: #FCA5A5;">
            <!-- SS-DEV (2026-09-26): ikonka `absolute` bo'lgani uchun tor kartada markazdagi chip ustiga
                 tushardi (26.09 skrinshot). Endi oddiy flex qator: ikonka chapda (flex-shrink-0), chip qolgan
                 bo'sh joyning markazida — hech qachon ustma-ust tushmaydi, tor ekranda qisqaradi. -->
            <div class="flex items-center gap-2 mb-4" style="min-height: 2.5rem;">
              <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style="background: #FEE2E2;">
                <IconExpiredC :width="24" :height="24" />
              </div>
              <div class="flex-1 min-w-0 flex justify-center">
                <span class="text-xs font-semibold px-2.5 py-1 rounded-full text-center leading-tight" style="background: #FEE2E2; color: #B91C1C;">{{ texts.overdue }}</span>
              </div>
            </div>
            <h3 class="text-sm font-medium mb-2" style="color: #9F1239;">{{ label.expiredCreditor }}</h3>
            <p class="text-base font-bold leading-tight mb-1 whitespace-nowrap" style="color: #DC2626;">
              {{ amount(expiredCreditorUzs) }} <span class="text-sm font-medium" style="color: #EF4444;">UZS</span>
            </p>
            <p class="text-base font-bold whitespace-nowrap" style="color: #DC2626;">
              {{ amount(expiredCreditorUsd) }} <span class="text-sm font-medium" style="color: #EF4444;">USD</span>
            </p>
          </div>
        </component>
      </div>
    </div>
  </div>
</template>

<script>
import IconDebitor from '@/components/icons/IconDebitor.vue';
import IconCreditor from '@/components/icons/IconCreditor.vue';
import IconExpiredD from '@/components/icons/IconExpiredD.vue';
import IconExpiredC from '@/components/icons/IconExpiredC.vue';

export default {
  name: 'DashboardStats',
  components: { IconDebitor, IconCreditor, IconExpiredD, IconExpiredC },
  props: {
    /** { financialSummary, receivable, payable, overdue, overdueGiven?, overdueTaken? } */
    texts: { type: Object, required: true },
    /** Summalar: `{ residual_amount }` obyekt YOKI oddiy son (Qarz daftari sahifasi) */
    debitorUzs: { type: [Object, Number], default: null },
    debitorUsd: { type: [Object, Number], default: null },
    creditorUzs: { type: [Object, Number], default: null },
    creditorUsd: { type: [Object, Number], default: null },
    expiredDebitorUzs: { type: [Object, Number], default: null },
    expiredDebitorUsd: { type: [Object, Number], default: null },
    expiredCreditorUzs: { type: [Object, Number], default: null },
    expiredCreditorUsd: { type: [Object, Number], default: null },
    /** SS-DEV (2026-09-24): sarlavha tashqarida chizilsa (Qarz daftari) — yashiriladi */
    hideTitle: { type: Boolean, default: false },
    /** SS-DEV (2026-09-24): kartalar manzili { debitor, creditor, expiredDebitor, expiredCreditor } */
    links: { type: Object, default: null },
    /** SS-DEV (2026-09-24): asosiy karta sarlavhalari { debitor, creditor } (default: home.debitor/creditor) */
    labels: { type: Object, default: null },
    /** SS-DEV (2026-09-26), 25.09 4-band: `selectable` — kartalar havola emas, `select` hodisasini
        chiqaradi ('debitor'|'expiredDebitor'|'creditor'|'expiredCreditor'); `active` — tanlangan karta
        (ko'k halqa bilan ajratiladi). Shaxsiy qarz sahifasi shu rejimda ishlatadi. */
    selectable: { type: Boolean, default: false },
    active: { type: String, default: '' },
  },
  computed: {
    to() {
      const l = this.links || {};
      return {
        debitor: l.debitor || this.localePath({ name: 'debt-list' }),
        creditor: l.creditor || this.localePath({ name: 'credit-list' }),
        expiredDebitor: l.expiredDebitor || this.localePath({ name: 'expired-type', params: { type: 'debitor' } }),
        expiredCreditor: l.expiredCreditor || this.localePath({ name: 'expired-type', params: { type: 'creditor' } }),
      };
    },
    label() {
      const l = this.labels || {};
      const t = this.texts || {};
      return {
        debitor: l.debitor || this.$t('home.debitor'),
        creditor: l.creditor || this.$t('home.creditor'),
        // "Muddati o'tgan" kartalari: "(debitor)/(kreditor)" o'rniga "Berilgan/Olingan qarz"
        expiredDebitor: t.overdueGiven || this.$t('cd_texts.overdue_given'),
        expiredCreditor: t.overdueTaken || this.$t('cd_texts.overdue_taken'),
      };
    },
  },
  methods: {
    /** SS-DEV (2026-09-26): tanlanadigan rejimda karta bosilganda */
    onSelect(key) {
      if (this.selectable) this.$emit('select', key);
    },
    amount(v) {
      const n = (v && typeof v === 'object') ? v.residual_amount : v;
      return this.$formatNumber(Number(n) || 0);
    },
  },
};
</script>
