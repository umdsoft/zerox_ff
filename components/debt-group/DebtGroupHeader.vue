<template>
  <div class="bg-white rounded-2xl p-5 shadow-sm mb-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="flex items-center min-w-0">
        <div class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" :class="avatarClass">
          <!-- Do'kon (store) ikonkasi -->
          <svg v-if="group.kind === 'shop'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M4 21V10m16 11V10M3 10l1.5-6h15L21 10M3 10h18M9 21v-6h6v6"/></svg>
          <!-- Shaxs (person) ikonkasi -->
          <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <div class="ml-4 min-w-0">
          <!-- SS-13: shaxs ismi "Sarlavha Ko'rinishi"da; do'kon nomi brend sifatida o'zgarmaydi. -->
          <h2 class="text-xl lg:text-2xl font-bold text-gray-900 truncate">{{ group.kind === 'shop' ? group.name : titleCaseName(group.name) }}</h2>
          <p class="text-sm text-gray-500 truncate">
            <span v-if="group.phone">{{ formatPhone(group.phone) }}</span>
            <span v-else-if="group.kind === 'person'">{{ texts.noPhoneShort }}</span>
          </p>
          <!-- 29.09: bo'lim belgisi (faqat berilgan / faqat olingan qarzlar ko'rsatilganda) -->
          <p v-if="side && group.kind !== 'shop'" class="mt-1.5">
            <span
              class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full"
              :class="side === 'lent' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'"
            >{{ side === 'lent' ? texts.badgeLent : texts.badgeBorrowed }}</span>
          </p>
          <p v-if="group.kind === 'shop'" class="mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span
              class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
              style="background:#FEF3C7; color:#92400E;"
              :title="$t('l10n.pdg.shop_hint')"
            >🏪 {{ $t('l10n.pdg.shop') }}</span>
            <span
              class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
              style="background:#EEF2FF; color:#3730A3;"
              :title="$t('l10n.pdg.view_hint_a')"
            >👁 {{ $t('l10n.pdg.view_only') }}</span>
          </p>
          <!-- SS-DEV (2026-09-24): do'kon MANZILI va TELEFONI sarlavhada (foydalanuvchi talabi) -->
          <div v-if="group.kind === 'shop'" class="mt-2 text-sm text-gray-600 space-y-0.5">
            <p v-if="shopInfo.address">📍 {{ shopInfo.address }}</p>
            <p v-if="shopInfo.phone">📞 <a :href="'tel:' + shopInfo.phone" class="text-blue-600 hover:underline">{{ formatPhone(shopInfo.phone) }}</a></p>
            <p v-if="!shopInfo.address && !shopInfo.phone" class="text-xs text-gray-400">{{ $t('l10n.pdg.no_shop_contacts') }}</p>
          </div>
        </div>
      </div>

      <!-- Shu kontragentga yana qarz berish/olish.
           Do'kon guruhida KO'RSATILMAYDI — do'kon qarzini faqat do'kon egasi kiritadi.
           29.09 (doc1 20-rasm): BERILGAN qarzlar bo'limidan kirilganda o'ng tepada "Yana qarz berish",
           "Qarzni yopish", "Talab qilish", "Voz kechish" (pastel, Qarz daftari uslubi); OLINGAN
           bo'limidan — "Yana qarz olish", "Qarzni qaytarish". Amallar shu kontragentning ENG OXIRGI
           aktiv qarziga qo'llanadi; aktiv qarz bo'lmasa tugmalar kulrang/o'chiq.
           30.09 (doc1 17/19/20-rasm): yopish / qaytarish / voz kechish endi TANLANGAN qarz(lar)ga
           (DebtActionModal: to'liq yoki qisman; voz kechishda — bir nechtasi yoki barchasi).
           Bo'lim noma'lum bo'lsa (Tugallangan/Barchasi/to'g'ridan-to'g'ri havola) — avvalgi 2 tugma. -->
      <div v-if="group.kind !== 'shop' && side === 'lent'" class="flex flex-wrap gap-2 md:justify-end">
        <nuxt-link :to="addDebtLink('lent')" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          {{ texts.giveMore }}
        </nuxt-link>
        <button type="button" :disabled="!actionDebts.length || actBusy" :title="actionDebts.length ? '' : texts.noActive" :class="actBtnClass('bg-green-50 text-green-700 hover:bg-green-100', !actionDebts.length)" @click="openActModal('close')">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
          {{ texts.close }}
        </button>
        <!-- 03.10 (sayt hujjati, 4-rasm): bosilganda SMS DARHOL ketmaydi — tarif → karta → "Talab SMS yuborilsinmi?" -->
        <button type="button" :disabled="!canDemand || actBusy || fdBusy" :title="demandHint" :class="actBtnClass('bg-yellow-50 text-yellow-800 hover:bg-yellow-100', !canDemand)" @click="actDemand">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.9" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ fdBusy && fd.debt && !fd.debt.is_mirror ? texts.sending : texts.demand }}
          <!-- 02.10: tarif cheklovi (muddati tugagan/Free — manual_sms_send yo'q) — qulf; bosilsa taklif -->
          <PlanLockIcon v-if="demandLocked" :label="$t('plan_gate.required')" />
        </button>
        <button type="button" :disabled="!actionDebts.length || actBusy" :title="actionDebts.length ? '' : texts.noActive" :class="actBtnClass('bg-red-50 text-red-700 hover:bg-red-100', !actionDebts.length)" @click="openActModal('forgive')">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
          {{ texts.forgive }}
        </button>
      </div>
      <div v-else-if="group.kind !== 'shop' && side === 'borrowed'" class="flex flex-wrap gap-2 md:justify-end">
        <nuxt-link :to="addDebtLink('borrowed')" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          {{ texts.takeMore }}
        </nuxt-link>
        <button type="button" :disabled="!actionDebts.length || actBusy" :title="actionDebts.length ? '' : texts.noActive" :class="actBtnClass('bg-green-50 text-green-700 hover:bg-green-100', !actionDebts.length)" @click="openActModal('pay')">
          <span aria-hidden="true">💳</span>
          {{ texts.pay }}
        </button>
      </div>
      <div v-else-if="group.kind !== 'shop'" class="flex flex-wrap gap-2 md:justify-end">
        <nuxt-link
          :to="addDebtLink('lent')"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          {{ texts.giveDebt }}
        </nuxt-link>
        <nuxt-link
          :to="addDebtLink('borrowed')"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          {{ texts.takeDebt }}
        </nuxt-link>
      </div>
    </div>

    <!-- 30.09 (doc1 17/19-rasm): amallar endi TANLANGAN qarzga qo'llanadi ("eng oxirgi aktiv qarz" izohi
         olib tashlandi) — o'rniga faol qarzlar soni va jami qoldig'i. -->
    <p v-if="side && group.kind !== 'shop'" class="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <span v-if="openDebts.length">{{ texts.activeNote.replace('{n}', openDebts.length) }}: {{ openTotalsText }}</span>
      <span v-else>{{ texts.noActive }}</span>
    </p>
  </div>
</template>

<script>
// wave C: pages/finance/debts/group/_key.vue dan ajratilgan (sarlavha bloki: ikonka, nom, amal tugmalari). Holat va so'rovlar sahifada qoladi: props pastga, hodisalar yuqoriga.
import { actBtnClass } from '@/utils/debtGroupRows';
import { formatPhoneUz, titleCaseName } from '@/utils/helpers';
import PlanLockIcon from '~/components/ui/PlanLockIcon.vue';
export default {
  name: 'DebtGroupHeader',
  components: { PlanLockIcon },
  props: {
    actBusy: { type: null, default: undefined },
    actionDebts: { type: null, default: undefined },
    avatarClass: { type: null, default: undefined },
    canDemand: { type: null, default: undefined },
    demandHint: { type: null, default: undefined },
    demandLocked: { type: null, default: undefined },
    fd: { type: null, default: undefined },
    fdBusy: { type: null, default: undefined },
    group: { type: null, default: undefined },
    openDebts: { type: null, default: undefined },
    openTotalsText: { type: null, default: undefined },
    shopInfo: { type: null, default: undefined },
    side: { type: null, default: undefined },
    texts: { type: null, default: undefined },
  },
  methods: {
    actBtnClass,
    actDemand(...args) {
      this.$emit('act-demand', ...args);
    },
    addDebtLink(type) {
      const query = { type };
      const g = this.group;
      if (g) {
        if (g.name) query.name = g.name;
        if (g.phone) query.phone = g.phone;
      }
      return this.localePath({ name: 'finance-debts-add', query });
    },
    formatPhone: formatPhoneUz,
    openActModal(...args) {
      this.$emit('open-act-modal', ...args);
    },
    titleCaseName,
  },
};
</script>
