<template>
  <div class="overflow-x-auto">
    <h4 v-if="title" class="text-sm font-semibold text-gray-900 mb-3">{{ title || texts.jadvalTitle }}</h4>
    <!-- min-width: tor konteynerda (amaliyot tafsiloti modali) ustunlar siqilib
         ketmasligi uchun — o'rovchi div'da overflow-x-auto bor.
         ⚠️ Tailwind 2.2 da arbitrary `min-w-[...]` klass INERT, shu bois inline style. -->
    <!-- SS-DEV (2026-09-24): `compact` rejimida (Amaliyot tafsiloti, tor o'ng ustun)
         katak paddinglari `px-4 py-3` → `px-2.5 py-2.5`, "#" ustuni tor — 5 ustun ham
         "To'lovni kiritish" tugmasi bilan asosiy o'lchamda sig'adi (2-rasm). -->
    <table class="w-full text-sm text-left" style="min-width: 360px">
      <thead class="bg-gray-50 text-gray-600 text-xs">
        <tr>
          <th :class="[cell, 'font-medium w-8']">#</th>
          <th :class="[cell, 'font-medium whitespace-nowrap']">{{ texts.tolovSanasi }}</th>
          <th :class="[cell, 'font-medium']">{{ texts.summa }}</th>
          <th :class="[cell, 'font-medium']">{{ texts.status }}</th>
          <th :class="cell"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="tolov in tolovlar"
          :key="tolov.id"
          class="hover:bg-gray-50"
        >
          <td :class="[cell, 'text-gray-700']">{{ tolov.tartib_raqami }}</td>
          <td :class="[cell, 'text-gray-700 whitespace-nowrap']">{{ formatDate(tolov.tolov_sanasi) }}</td>
          <td :class="[cell, 'text-gray-900 font-medium whitespace-nowrap']">
            {{ formatNumber(tolov.summa) }}<span v-if="valyuta" class="text-xs text-gray-400 ml-1">{{ valyuta }}</span>
          </td>
          <td :class="cell">
            <StatusBadge :status="tolov.status" />
          </td>
          <td :class="[cell, compact ? 'text-right' : '']">
            <!-- SS-DEV (2026-09-24): tugma matni "To'landi" → "To'lovni kiritish"
                 (holat belgisi "To'landi" o'zgarmadi — faqat tugma). Bosilganda
                 mobil ilovadagidek SUMMA kiritish oynasi ochiladi: default =
                 bo'lak summasi; ko'proq kiritilsa ortiqchasi backendda keyingi
                 bo'laklarga o'tadi (PUT /qarz-daftari/tolov/:id/tolandi { summa }). -->
            <button
              v-if="tolov.status !== 'tolandi'"
              type="button"
              class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 whitespace-nowrap"
              @click="openPay(tolov)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6"/></svg>
              {{ texts.tolandi }}
            </button>
          </td>
        </tr>
        <tr v-if="!tolovlar || !tolovlar.length">
          <td colspan="5" class="px-4 py-6 text-center text-gray-400">
            {{ texts.empty }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- To'lov summasini kiritish oynasi (mobil ilova bilan bir xil oqim).
         Orqa fon BLUR — Tailwind v2.2 da backdrop-filter utiliti yo'q, inline style. -->
    <div
      v-if="payRow"
      class="fixed inset-0 flex items-center justify-center p-4"
      style="z-index: 110; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px)"
      @click.self="closePay"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-900">{{ texts.payTitle }}</h3>
          <button type="button" @click="closePay" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form @submit.prevent="submitPay" class="px-6 py-5" novalidate>
          <p class="text-xs text-gray-500 mb-3">
            {{ texts.payRowInfo }}: <b class="text-gray-800">#{{ payRow.tartib_raqami }}</b> &middot; {{ formatDate(payRow.tolov_sanasi) }} &middot;
            <b class="text-gray-800">{{ formatNumber(payRow.summa) }} {{ valyuta }}</b>
          </p>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.payAmount }}</label>
          <div class="relative">
            <input
              ref="payInput"
              :value="payDisplay"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              placeholder="0"
              class="w-full border border-gray-300 rounded-xl pl-3.5 pr-14 py-2.5 text-base font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              @input="onPayInput"
            />
            <span v-if="valyuta" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-400">{{ valyuta }}</span>
          </div>
          <p class="text-xs text-gray-400 mt-2">{{ texts.payHint }}</p>
          <div class="flex justify-end gap-2 pt-4">
            <button type="button" @click="closePay" class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              {{ texts.cancel }}
            </button>
            <!-- ⚠️ Tailwind 2.2 (JIT o'chiq) `disabled:` variantini generatsiya qilmaydi -->
            <button
              type="submit"
              :disabled="payDisabled"
              :class="[
                'px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors',
                payDisabled ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700',
              ]"
            >
              {{ paying ? texts.saving : texts.save }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { fmtDMY, formatNumberGrouped } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
import StatusBadge from './StatusBadge.vue'

export default {
  name: 'BolibTolashJadval',
  components: {
    StatusBadge,
  },
  props: {
    tolovlar: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    valyuta: {
      type: String,
      default: '',
    },
    /** SS-DEV (2026-09-24): tor konteyner uchun ixcham paddinglar */
    compact: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      payRow: null,   // tanlangan bo'lak (modal ochiq bo'lsa)
      payVal: '',     // faqat raqamlar
      paying: false,  // (zaxira) yuborish jarayoni
    };
  },
  computed: {
    /** Katak (th/td) padding klasslari — compact rejimga qarab */
    cell() {
      return this.compact ? 'px-2.5 py-2.5' : 'px-4 py-3';
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          jadvalTitle: "Bo'lib to'lash jadvali",
          tolovSanasi: "To'lov sanasi", summa: "Summa", status: "Status",
          tolandi: "To'lovni kiritish", empty: "To'lovlar mavjud emas",
          payTitle: "To'lovni kiritish", payAmount: "To'lov summasi", payRowInfo: "Bo'lak",
          payHint: "Grafikdagidan ko'p to'lansa, ortiqchasi keyingi to'lovlardan chegiriladi.",
          cancel: "Bekor qilish", save: "Saqlash", saving: "Saqlanmoqda...",
          invalid: "Summani kiriting",
        },
        ru: {
          jadvalTitle: "График рассрочки",
          tolovSanasi: "Дата платежа", summa: "Сумма", status: "Статус",
          tolandi: "Внести платёж", empty: "Платежи отсутствуют",
          payTitle: "Внести платёж", payAmount: "Сумма платежа", payRowInfo: "Платёж",
          payHint: "Если внести больше, чем по графику, излишек будет списан со следующих платежей.",
          cancel: "Отмена", save: "Сохранить", saving: "Сохранение...",
          invalid: "Введите сумму",
        },
        kr: {
          jadvalTitle: "Бўлиб тўлаш жадвали",
          tolovSanasi: "Тўлов санаси", summa: "Сумма", status: "Статус",
          tolandi: "Тўловни киритиш", empty: "Тўловлар мавжуд эмас",
          payTitle: "Тўловни киритиш", payAmount: "Тўлов суммаси", payRowInfo: "Бўлак",
          payHint: "Графикдагидан кўп тўланса, ортиқчаси кейинги тўловлардан чегирилади.",
          cancel: "Бекор қилиш", save: "Сақлаш", saving: "Сақланмоқда...",
          invalid: "Суммани киритинг",
        },
        // SS-DEV (2026-09-26): en/kaa
        en: {
          jadvalTitle: "Instalment schedule",
          tolovSanasi: "Payment date", summa: "Amount", status: "Status",
          tolandi: "Enter payment", empty: "No payments",
          payTitle: "Enter payment", payAmount: "Payment amount", payRowInfo: "Instalment",
          payHint: "If more than scheduled is paid, the excess is deducted from the following payments.",
          cancel: "Cancel", save: "Save", saving: "Saving...",
          invalid: "Enter the amount",
        },
        kaa: {
          jadvalTitle: "Bólip tólew kestesi",
          tolovSanasi: "Tólem sánesi", summa: "Summa", status: "Status",
          tolandi: "Tólemdi kiritiw", empty: "Tólemler joq",
          payTitle: "Tólemdi kiritiw", payAmount: "Tólem summası", payRowInfo: "Bólek",
          payHint: "Grafiktegiden kóp tólense, artıǵı keyingi tólemlerden shegeriledi.",
          cancel: "Biykar etiw", save: "Saqlaw", saving: "Saqlanbaqta...",
          invalid: "Summanı kiritiń",
        },
      };
      return t[l] || t.uz;
    },
    /** Kiritilgan summa ming birlik bilan ("1 000"). */
    payDisplay() {
      return this.payVal ? this.payVal.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '';
    },
    payDisabled() {
      return this.paying || !Number(this.payVal);
    },
  },
  methods: {
    formatNumber: formatNumberGrouped, // SS-AUDIT (2026-09-25): utils/helpers
    formatDate(d) { return fmtDMY(d) }, // SS-AUDIT (2026-09-25): utils/helpers (Safari-xavfsiz parse)
    openPay(tolov) {
      this.payRow = tolov;
      // Default — bo'lak summasi (butun son)
      this.payVal = String(Math.round(Number(tolov.summa) || 0) || '');
      this.paying = false;
      this.$nextTick(() => {
        const el = this.$refs.payInput;
        if (el && el.focus) { el.focus(); if (el.select) el.select(); }
      });
    },
    closePay() {
      if (this.paying) return;
      this.payRow = null;
      this.payVal = '';
    },
    onPayInput(e) {
      const digits = String(e.target.value || '').replace(/\D/g, '');
      this.payVal = digits;
      // Kursor sakramasligi uchun formatlangan qiymatni qayta yozamiz
      e.target.value = this.payDisplay;
    },
    submitPay() {
      const summa = Number(this.payVal);
      if (!this.payRow || !isFinite(summa) || summa <= 0) {
        this.$toast?.error(this.texts.invalid);
        return;
      }
      /**
       * Hodisa: `tolandi(tolovId, summa)`. Ota-komponent PUT so'rovini yuboradi,
       * natija toast'ini ko'rsatadi va jadvalni qayta yuklaydi. Oyna darhol
       * yopiladi — ikki marta yuborish imkoni yo'q.
       */
      const id = this.payRow.id;
      this.payRow = null;
      this.payVal = '';
      this.$emit('tolandi', id, summa);
    },
  },
}
</script>
