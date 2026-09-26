<template>
  <!-- SS-DEV (2026-09-27), 26.09 hujjat 3(b)-band: shaxsiy qarzlarning KONTRAGENT bo'yicha guruhlangan
       ro'yxati — `pages/finance/debts/index.vue` dan AYNAN ko'chirildi (markup/funksiya o'zgarmadi),
       endi alohida ro'yxat sahifasi (`list/_kind.vue`) ishlatadi. Qatorga bosilganda `select` chiqadi. -->
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
    <!-- SS-5 (2026-09-18): Kontragent bo'yicha guruhlangan ro'yxat (do'kon / shaxs).
         SS-27 (2026-09-19): guruh qatoriga bosilganda AKKORDEON emas, alohida
         sahifa ochiladi (/finance/debts/group/:key) — mobil ilovadagidek
         "ichiga kirish". Bitta qarzli guruh ham xuddi shu sahifaga boradi. -->
    <div v-if="loading" class="p-8 text-center text-sm text-gray-400">{{ $t('notification.loading') || 'Yuklanmoqda…' }}</div>
    <div v-else-if="groups.length" class="divide-y divide-gray-100">
      <div v-for="group in groups" :key="group.key">
        <!-- Guruh sarlavhasi (qator) -->
        <div
          class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          @click="$emit('select', group)"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center min-w-0">
              <!-- Avatar: do'kon ↔ shaxs ikonkasi (bosh harflar o'rniga) -->
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                :class="groupAvatarClass(group)"
              >
                <!-- Do'kon (store) ikonkasi -->
                <svg v-if="group.kind === 'shop'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M4 21V10m16 11V10M3 10l1.5-6h15L21 10M3 10h18M9 21v-6h6v6"/></svg>
                <!-- Shaxs (person) ikonkasi -->
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <div class="ml-4 min-w-0">
                <p class="font-semibold text-gray-900 flex items-center gap-1.5 flex-wrap">
                  <!-- SS-13: SHAXS ismi "Sarlavha Ko'rinishi"da; DO'KON nomi esa
                       brend sifatida qanday yozilgan bo'lsa shunday qoladi. -->
                  <span class="truncate">{{ group.kind === 'shop' ? group.name : titleCaseName(group.name) }}</span>
                  <!-- SS-4 (2026-09-19): ixcham kapsula teglar + to'liq tushuntirish tooltip'da -->
                  <span
                    v-if="group.kind === 'shop'"
                    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style="background:#FEF3C7; color:#92400E;"
                    title="Bu qarz do‘kon tomonidan yuritiladi. Yopish/o‘zgartirish do‘kon egasining qo‘lida."
                  >🏪 Do‘kon</span>
                  <span
                    v-if="group.kind === 'shop'"
                    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style="background:#EEF2FF; color:#3730A3;"
                    title="Ma’lumot faqat ko‘rish rejimida ulashilgan — bu yerdan o‘zgartirib bo‘lmaydi."
                  >👁 Faqat ko‘rish</span>
                  <span v-if="group.count > 1" class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{{ group.count }} {{ $t('finance.debt_count') || 'ta qarz' }}</span>
                </p>
                <p class="text-sm text-gray-500 truncate">
                  <span v-if="group.phone">{{ formatPhone(group.phone) }}</span>
                  <span v-else-if="group.kind === 'person'">{{ $t('finance.no_phone') || 'Telefon kiritilmagan' }}</span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <div class="text-right">
                <!-- SS-DEV (2026-09-24): valyuta bo'yicha ALOHIDA qatorlar (UZS va USD qo'shilmaydi) -->
                <template v-if="group.displayLines && group.displayLines.length">
                  <p v-for="l in group.displayLines" :key="l.currency" class="font-bold leading-tight" :class="l.type === 'borrowed' ? 'text-red-600' : 'text-green-600'">
                    {{ l.type === 'borrowed' ? '-' : '+' }}{{ formatMoney(l.amount, l.currency) }}
                  </p>
                </template>
                <p v-else class="font-bold" :class="group.displayType === 'borrowed' ? 'text-red-600' : 'text-green-600'">
                  {{ group.displayType === 'borrowed' ? '-' : '+' }}{{ formatMoney(group.displayAmount, group.currency) }}
                </p>
                <p v-if="group.mixed" class="text-xs text-gray-400">{{ $t('finance.net_balance') || 'Sof qoldiq' }}</p>
              </div>
              <!-- SS-27 (2026-09-19): akkordeon o'rniga "ichiga kirish" ko'rsatkichi -->
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-12 text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('finance.no_debts') }}</h3>
      <p class="text-gray-500 mb-4">{{ $t('finance.no_debts_desc') }}</p>
      <nuxt-link
        v-if="showAddLink"
        :to="localePath({ name: 'finance-debts-add' })"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        {{ $t('finance.add_first_debt') }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { titleCaseName, formatMoneyCur, formatPhoneUz } from '~/utils/helpers';

/**
 * DebtGroupList — kontragent bo'yicha guruhlangan shaxsiy qarzlar ro'yxati.
 *
 * Props:
 *   - groups:      `groupDebtsByCounterparty()` natijasi
 *   - loading:     yuklanmoqda holati
 *   - showAddLink: bo'sh holatda "Birinchi qarzni qo'shish" havolasi
 *
 * Hodisa: `select(group)` — qator bosilganda.
 */
export default {
  name: 'DebtGroupList',
  props: {
    groups: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    showAddLink: { type: Boolean, default: true },
  },
  methods: {
    // SS-13: FISh ni "Sarlavha" ko'rinishida chiqarish (template uchun).
    titleCaseName,
    formatMoney: formatMoneyCur,
    // Telefonni chiroyli format ("+998 90 123 45 67")
    formatPhone: formatPhoneUz,
    // Guruh avatarining rang klassi: do'kon → amber; shaxs → qizil/yashil (borrowed/lent),
    // aralash bo'lsa neytral kulrang.
    groupAvatarClass(group) {
      if (group.kind === 'shop') return 'bg-amber-100 text-amber-600'
      if (group.mixed) return 'bg-gray-100 text-gray-600'
      if (group.displayType === 'lent') return 'bg-green-100 text-green-600'
      return 'bg-red-100 text-red-600'
    },
  },
}
</script>
