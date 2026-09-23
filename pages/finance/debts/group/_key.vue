<template>
  <div class="debt-group pb-8">
    <!-- SS-27 (2026-09-19): guruh "ichiga kirish" sahifasi (mobil ilovadagidek).
         Ilgari ro'yxatda akkordeon ochilardi — endi alohida sahifa. -->
    <div class="mb-3">
      <nuxt-link :to="localePath({ name: 'finance-debts' })" class="text-blue-600 hover:text-blue-700 text-sm inline-block">
        ← Orqaga
      </nuxt-link>
    </div>

    <!-- Yuklanmoqda -->
    <div v-if="loading" class="bg-white rounded-2xl p-12 shadow-sm text-center">
      <p class="text-gray-400 text-sm">Yuklanmoqda…</p>
    </div>

    <!-- Guruh topilmadi (eskirgan havola / qarzlar o'chirilgan) -->
    <div v-else-if="!group" class="bg-white rounded-2xl p-12 shadow-sm text-center">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Kontragent topilmadi</h3>
      <p class="text-gray-500 mb-4">Bu kontragent bo‘yicha qarzlar topilmadi. Ro‘yxatga qayting.</p>
      <nuxt-link :to="localePath({ name: 'finance-debts' })" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium">
        Shaxsiy qarzlar
      </nuxt-link>
    </div>

    <template v-else>
      <!-- Sarlavha bloki: ikonka + nom (+ telefon) va amal tugmalari -->
      <div class="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div class="flex items-center min-w-0">
            <div class="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" :class="avatarClass">
              <!-- Do'kon (store) ikonkasi -->
              <svg v-if="group.kind === 'shop'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M4 21V10m16 11V10M3 10l1.5-6h15L21 10M3 10h18M9 21v-6h6v6"/></svg>
              <!-- Shaxs (person) ikonkasi -->
              <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <div class="ml-4 min-w-0">
              <!-- SS-13: shaxs ismi "Sarlavha Ko'rinishi"da; do'kon nomi brend sifatida o'zgarmaydi. -->
              <h1 class="text-xl lg:text-2xl font-bold text-gray-900 truncate">{{ group.kind === 'shop' ? group.name : titleCaseName(group.name) }}</h1>
              <p class="text-sm text-gray-500 truncate">
                <span v-if="group.phone">{{ formatPhone(group.phone) }}</span>
                <span v-else-if="group.kind === 'person'">Telefon kiritilmagan</span>
              </p>
              <p v-if="group.kind === 'shop'" class="mt-1.5 flex items-center gap-1.5 flex-wrap">
                <span
                  class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style="background:#FEF3C7; color:#92400E;"
                  title="Bu qarz do‘kon tomonidan yuritiladi. Yopish/o‘zgartirish do‘kon egasining qo‘lida."
                >🏪 Do‘kon</span>
                <span
                  class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style="background:#EEF2FF; color:#3730A3;"
                  title="Ma’lumot faqat ko‘rish rejimida ulashilgan — bu yerdan o‘zgartirib bo‘lmaydi."
                >👁 Faqat ko‘rish</span>
              </p>
            </div>
          </div>

          <!-- Shu kontragentga yana qarz berish/olish.
               Do'kon guruhida KO'RSATILMAYDI — do'kon qarzini faqat do'kon egasi kiritadi. -->
          <div v-if="group.kind !== 'shop'" class="flex flex-wrap gap-2 flex-shrink-0">
            <nuxt-link
              :to="addDebtLink('lent')"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Qarz berish
            </nuxt-link>
            <nuxt-link
              :to="addDebtLink('borrowed')"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Qarz olish
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- Shu kontragent bo'yicha 3 ta kichik katak -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500">Jami olingan</p>
          <p class="text-lg font-bold text-red-600 mt-0.5">{{ formatMoney(group.borrowedTotal, group.currency) }}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500">Jami berilgan</p>
          <p class="text-lg font-bold text-green-600 mt-0.5">{{ formatMoney(group.lentTotal, group.currency) }}</p>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <p class="text-xs text-gray-500">Sof balans</p>
          <p class="text-lg font-bold mt-0.5" :class="group.net >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ group.net >= 0 ? '+' : '-' }}{{ formatMoney(Math.abs(group.net), group.currency) }}
          </p>
        </div>
      </div>

      <!-- Qarzlar ro'yxati -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
          <p class="font-semibold text-gray-900">Qarzlar</p>
          <span class="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{{ group.count }} ta qarz</span>
        </div>
        <div class="divide-y divide-gray-100">
          <div
            v-for="debt in group.items"
            :key="(debt.is_mirror ? 'm' : 'o') + '-' + debt.id"
            class="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="onDebtClick(debt)"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-800 flex items-center gap-1.5 flex-wrap">
                  <span>{{ debt.type === 'borrowed' ? 'Olingan qarz' : 'Berilgan qarz' }}</span>
                  <span
                    v-if="debt.is_shop_debt"
                    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style="background:#FEF3C7; color:#92400E;"
                    title="Bu qarz do‘kon tomonidan yuritiladi. Yopish/o‘zgartirish do‘kon egasining qo‘lida."
                  >🏪 Do‘kon</span>
                  <span
                    v-else-if="debt.is_mirror && debt.can_operate"
                    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style="background:#ECFDF5; color:#065F46;"
                    title="Bu qarzni qarama-qarshi tomon kiritgan. Siz qarz beruvchisiz — to‘liq boshqara olasiz."
                  >🔗 Bog‘langan</span>
                  <span
                    v-else-if="debt.is_mirror"
                    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style="background:#EEF2FF; color:#3730A3;"
                    title="Ma’lumot faqat ko‘rish rejimida ulashilgan — barcha amallar kiritgan tomonda."
                  >👁 Faqat ko‘rish</span>
                </p>
                <p class="text-xs text-gray-500 mt-0.5">
                  <span v-if="debt.due_date">Muddat: {{ formatDate(debt.due_date) }}</span>
                  <span v-if="debt.due_date"> · </span>
                  <span v-if="debt.status === 'completed'" class="text-green-600">Tugallangan</span>
                  <span v-else-if="isOverdue(debt)" class="text-red-600">Muddati o‘tgan</span>
                  <span v-else-if="debt.status === 'active'" class="text-blue-600">Faol</span>
                </p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <div class="text-right">
                  <p class="text-sm font-bold" :class="debt.type === 'borrowed' ? 'text-red-600' : 'text-green-600'">
                    {{ debt.type === 'borrowed' ? '-' : '+' }}{{ formatMoney(debt.remaining_amount, debt.currency) }}
                  </p>
                  <p class="text-xs text-gray-400">{{ getPaidPercent(debt) }}% To‘langan</p>
                </div>
                <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Do'kon qarzi TAFSILOTLARI (faqat ko'rish) — ro'yxat sahifasidagi modalning aynan o'zi -->
    <div v-if="showShopDebt && shopDebt" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showShopDebt = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white">
          <div class="flex items-start justify-between">
            <div class="min-w-0">
              <p class="text-white/80 text-xs font-medium mb-0.5">🏪 Do‘kon qarzi</p>
              <h3 class="text-lg font-bold truncate">{{ shopDebt.source_name }}</h3>
            </div>
            <button @click="showShopDebt = false" class="text-white/80 hover:text-white flex-shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div class="mt-3 flex items-end justify-between">
            <div>
              <p class="text-white/80 text-xs">Qoldiq qarz</p>
              <p class="text-2xl font-extrabold leading-tight">{{ formatMoney(shopDebt.remaining_amount, shopDebt.currency) }}</p>
            </div>
            <div class="text-right">
              <p class="text-white/80 text-xs">Dastlabki summa</p>
              <p class="font-semibold">{{ formatMoney(shopDebt.amount, shopDebt.currency) }}</p>
            </div>
          </div>
        </div>
        <div class="p-5 space-y-3 text-sm overflow-y-auto" style="max-height:60vh">
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gray-50 rounded-xl p-3">
              <p class="text-gray-500 text-xs">Qaytarilgan</p>
              <p class="font-bold text-green-600">{{ formatMoney(shopDebt.paid_amount || 0, shopDebt.currency) }}</p>
            </div>
            <div class="bg-gray-50 rounded-xl p-3">
              <p class="text-gray-500 text-xs">Qoldiq</p>
              <p class="font-bold text-red-600">{{ formatMoney(shopDebt.remaining_amount, shopDebt.currency) }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-gray-500 text-xs">Olingan sana</p>
              <p class="font-medium">{{ formatDate(shopDebt.start_date || shopDebt.created_at) }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-xs">Qaytarish muddati</p>
              <p class="font-medium">{{ shopDebt.due_date ? formatDate(shopDebt.due_date) : '—' }}</p>
            </div>
          </div>
          <div v-if="shopDebt.notes">
            <p class="text-gray-500 text-xs">Izoh (do'kon egasidan)</p>
            <p class="font-medium bg-gray-50 rounded-xl p-3">{{ shopDebt.notes }}</p>
          </div>
          <div class="pt-3 border-t border-gray-100 space-y-1">
            <p class="text-gray-500 text-xs mb-1">Do'kon ma'lumotlari</p>
            <p v-if="shopDebt.shop_region || shopDebt.shop_district" class="font-medium">📍 {{ [shopDebt.shop_region, shopDebt.shop_district].filter(Boolean).join(', ') }}</p>
            <p v-if="shopDebt.shop_phone" class="font-medium">📞 {{ formatPhone(shopDebt.shop_phone) }}</p>
            <p v-if="!shopDebt.shop_region && !shopDebt.shop_district && !shopDebt.shop_phone" class="text-gray-400 text-xs">Ma'lumot kiritilmagan</p>
          </div>
          <div class="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3 text-amber-800">
            <span class="flex-shrink-0">ℹ️</span>
            <p class="text-xs">Bu qarz do'kon tomonidan yuritiladi — faqat ko'rish. Yopish/o'zgartirish do'kon egasining qo'lida.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Telefon-ko'zgu qarz tafsiloti + (lender bo'lsa) amallar -->
    <div v-if="showMirror && mirrorDebt" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showMirror = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl overflow-hidden">
        <div class="p-5 text-white" :class="mirrorDebt.type === 'lent' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-indigo-500 to-indigo-700'">
          <div class="flex items-start justify-between">
            <div class="min-w-0">
              <p class="text-white/80 text-xs font-medium mb-0.5">🪞 {{ mirrorDebt.type === 'lent' ? 'Berilgan qarz (ko‘zgu)' : 'Olingan qarz (ko‘zgu)' }}</p>
              <h3 class="text-lg font-bold truncate">{{ titleCaseName(mirrorDebt.source_name) }}</h3>
              <p v-if="mirrorDebt.phone" class="text-white/80 text-xs mt-0.5">{{ formatPhone(mirrorDebt.phone) }}</p>
            </div>
            <button @click="showMirror = false" class="text-white/80 hover:text-white flex-shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div class="mt-3 flex items-end justify-between">
            <div><p class="text-white/80 text-xs">Qoldiq</p><p class="text-2xl font-extrabold leading-tight">{{ formatMoney(mirrorDebt.remaining_amount, mirrorDebt.currency) }}</p></div>
            <div class="text-right"><p class="text-white/80 text-xs">Dastlabki summa</p><p class="font-semibold">{{ formatMoney(mirrorDebt.amount, mirrorDebt.currency) }}</p></div>
          </div>
        </div>
        <div class="p-5 space-y-3 text-sm overflow-y-auto" style="max-height:60vh">
          <div class="grid grid-cols-2 gap-3">
            <div><p class="text-gray-500 text-xs">Olingan sana</p><p class="font-medium">{{ formatDate(mirrorDebt.start_date || mirrorDebt.created_at) }}</p></div>
            <div><p class="text-gray-500 text-xs">Qaytarish muddati</p><p class="font-medium">{{ mirrorDebt.due_date ? formatDate(mirrorDebt.due_date) : '—' }}</p></div>
          </div>
          <div v-if="mirrorDebt.notes"><p class="text-gray-500 text-xs">Izoh</p><p class="font-medium bg-gray-50 rounded-xl p-3">{{ mirrorDebt.notes }}</p></div>
          <!-- Lender (can_operate): YOPISH / to'lov qayd etish / talab qilish / voz kechish.
               SS-4 (2026-09-19): «Undan yopish mumkin emas demoqda. Aslida esa yopish
               imkonini ham berish kerak» — qarz beruvchi pul qo'liga tekkanda
               qarzni o'zi yopadi yoki qisman to'lovni qayd etadi. -->
          <div v-if="mirrorDebt.can_operate && mirrorDebt.status !== 'completed'" class="space-y-2 pt-1">
            <button @click="askMirrorClose" :disabled="mirrorBusy" class="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1" :style="mirrorBusy ? 'opacity:.6' : ''"><span>✓</span> Qarzni yopish</button>
            <div class="flex gap-2">
              <button @click="openMirrorPay" :disabled="mirrorBusy" class="flex-1 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1" :style="mirrorBusy ? 'opacity:.6' : ''"><span>💵</span> To‘lov qayd etish</button>
              <button @click="mirrorDemand" :disabled="mirrorBusy" class="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1" :style="mirrorBusy ? 'opacity:.6' : ''"><span>⏰</span> Talab qilish</button>
            </div>
            <button @click="askMirrorForgive" :disabled="mirrorBusy" class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-1" :style="mirrorBusy ? 'opacity:.6' : ''"><span>❤️</span> Voz kechish</button>
          </div>
          <div class="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-xl p-3 text-gray-600">
            <span class="flex-shrink-0">ℹ️</span>
            <p class="text-xs">{{ mirrorDebt.can_operate ? ('Bu qarzni «' + mirrorDebt.source_name + '» kiritgan. Siz qarz beruvchisiz — to‘lov qayd etish, talab qilish va voz kechish mumkin.') : ('Bu qarzni «' + mirrorDebt.source_name + '» kiritgan — faqat ko‘rish. Barcha amallar kiritgan tomonda.') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SS-19 (2026-09-19): native confirm() O'RNIGA markazlashgan modal -->
    <ConfirmModal
      v-if="confirmKind"
      :title="confirmCfg.title"
      :message="confirmCfg.message"
      :confirm-text="confirmCfg.confirmText"
      :tone="confirmCfg.tone"
      :icon="confirmCfg.icon"
      :busy="mirrorBusy"
      @cancel="confirmKind = ''"
      @confirm="onConfirmAccept"
    />

    <!-- SS-4 (2026-09-19): lender — qisman to'lovni qayd etish -->
    <ConfirmModal
      v-if="showMirrorPay && mirrorDebt"
      title="To'lov qayd etish"
      :message="'Qoldiq: ' + formatMoney(mirrorDebt.remaining_amount, mirrorDebt.currency)"
      confirm-text="Qayd etish"
      tone="success"
      icon="💵"
      :busy="mirrorBusy"
      @cancel="showMirrorPay = false"
      @confirm="submitMirrorPay"
    >
      <label class="block text-xs font-medium text-gray-500 mb-1">Qaytarilgan summa</label>
      <input
        v-model="mirrorPayAmount"
        type="text"
        inputmode="numeric"
        :placeholder="String(mirrorDebt.remaining_amount || '')"
        class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
      />
      <p class="text-xs text-gray-400 mt-1.5">Bo'sh qoldirsangiz — butun qoldiq yopiladi.</p>
    </ConfirmModal>
  </div>
</template>

<script>
import { titleCaseName } from '~/utils/helpers';
import { groupDebtsByCounterparty, findGroupByRouteKey } from '~/utils/debtGroups';

export default {
  name: 'DebtGroupDetail',
  middleware: 'auth',

  data() {
    return {
      debts: [],
      loading: true,
      // Do'kon qarzi tafsilotlari modali
      showShopDebt: false,
      shopDebt: null,
      // Telefon-ko'zgu qarz modali
      showMirror: false,
      mirrorDebt: null,
      mirrorBusy: false,
      // SS-19: markazlashgan tasdiqlash modali ('' = yopiq | 'close' | 'forgive')
      confirmKind: '',
      // SS-4: lender qisman to'lovni qayd etish modali
      showMirrorPay: false,
      mirrorPayAmount: ''
    }
  },

  computed: {
    // URL'dagi guruh kaliti ($route.params.key vue-router tomonidan bir marta dekodlanadi).
    routeKey() {
      return (this.$route && this.$route.params && this.$route.params.key) || ''
    },

    // Shu kontragent guruhi (ro'yxat sahifasidagi bilan AYNAN bir xil mantiq).
    group() {
      return findGroupByRouteKey(groupDebtsByCounterparty(this.debts), this.routeKey)
    },

    // SS-19: tasdiqlash modalining matni — amal turiga qarab.
    confirmCfg() {
      const name = (this.mirrorDebt && this.mirrorDebt.source_name) || ''
      if (this.confirmKind === 'close') {
        return {
          title: 'Qarzni yopish',
          message: `«${name}» qarzini to'liq qaytardimi? Qoldiq nolga tushadi va qarz yopiladi.`,
          confirmText: 'Ha, yopish', tone: 'success', icon: '✓',
        }
      }
      return {
        title: 'Qarzdan voz kechish',
        message: `«${name}» sizga qarzdor. Voz kechasizmi? Qarz yopiladi va pul qaytmaydi.`,
        confirmText: 'Ha, voz kechaman', tone: 'danger', icon: '❤️',
      }
    },

    // Avatar rang klassi: do'kon → amber; shaxs → qizil/yashil, aralash bo'lsa kulrang.
    avatarClass() {
      const g = this.group
      if (!g) return 'bg-gray-100 text-gray-600'
      if (g.kind === 'shop') return 'bg-amber-100 text-amber-600'
      if (g.mixed) return 'bg-gray-100 text-gray-600'
      if (g.displayType === 'lent') return 'bg-green-100 text-green-600'
      return 'bg-red-100 text-red-600'
    }
  },

  async mounted() {
    await this.loadDebts()
  },

  methods: {
    titleCaseName,

    // Guruh sahifasi BARCHA qarzlarni (faol + tugallangan) yuklaydi — kontragent
    // bo'yicha to'liq tarix ko'rinishi uchun filtr qo'yilmaydi.
    async loadDebts() {
      try {
        this.loading = true
        const res = await this.$api.getPersonalDebts({})
        if (res && res.data && res.data.success) {
          const own = res.data.data || []
          const mirrors = res.data.mirror_debts || []
          this.debts = [...own, ...mirrors].sort((a, b) =>
            new Date(b.created_at || 0) - new Date(a.created_at || 0))
        }
      } catch (error) {
        console.error('Load debts error:', error)
        this.$toast && this.$toast.error && this.$toast.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    // Shu kontragentga yana qarz berish/olish havolasi.
    addDebtLink(type) {
      const query = { type }
      const g = this.group
      if (g) {
        if (g.name) query.name = g.name
        if (g.phone) query.phone = g.phone
      }
      return this.localePath({ name: 'finance-debts-add', query })
    },

    openDebt(id) {
      this.$router.push(this.localePath({ name: 'finance-debts-id', params: { id } }))
    },

    // O'z qarzim → tafsilot sahifasi; do'kon/ko'zgu → shu sahifadagi modal.
    onDebtClick(debt) {
      if (!debt) return
      if (debt.is_shop_debt) {
        this.shopDebt = debt
        this.showShopDebt = true
        return
      }
      if (debt.is_mirror) {
        this.mirrorDebt = debt
        this.showMirror = true
        return
      }
      this.openDebt(debt.id)
    },

    // SS-19: tasdiqlash modalini ochish (native confirm() o'rniga).
    askMirrorClose() { if (!this.mirrorBusy) this.confirmKind = 'close' },
    askMirrorForgive() { if (!this.mirrorBusy) this.confirmKind = 'forgive' },
    onConfirmAccept() {
      if (this.confirmKind === 'close') return this.mirrorClose()
      return this.mirrorForgive()
    },

    // SS-4: lender — qisman to'lov modali.
    openMirrorPay() {
      if (this.mirrorBusy) return
      this.mirrorPayAmount = ''
      this.showMirrorPay = true
    },
    async submitMirrorPay() {
      const raw = String(this.mirrorPayAmount || '').replace(/\s/g, '').replace(',', '.')
      if (raw && !(parseFloat(raw) > 0)) {
        this.$toast && this.$toast.error && this.$toast.error("Noto'g'ri summa")
        return
      }
      // Bo'sh bo'lsa — backend butun qoldiqni yopadi (amount yubormaymiz).
      await this.mirrorPay(raw ? { amount: parseFloat(raw) } : {})
      this.showMirrorPay = false
    },
    // SS-4: qarzni TO'LIQ yopish (qoldiq summasini to'lov sifatida qayd etadi).
    async mirrorClose() { await this.mirrorPay({}) },

    /**
     * SS-4: ko'zgu qarz bo'yicha to'lovni qayd etish (POST mirror-payment).
     * `payload.amount` bo'lmasa — butun qoldiq yopiladi.
     */
    async mirrorPay(payload) {
      if (this.mirrorBusy || !this.mirrorDebt) return
      this.mirrorBusy = true
      try {
        const res = await this.$api.mirrorPayDebt(this.mirrorDebt.id, payload)
        if (res && res.data && res.data.success) {
          const rem = Number(res.data.remaining_amount) || 0
          this.$toast && this.$toast.success && this.$toast.success(
            rem <= 0 ? 'Qarz yopildi' : "To'lov qayd etildi"
          )
          this.confirmKind = ''
          this.showMirror = false
          await this.loadDebts()
        }
      } catch (e) {
        const msg = (e.response && e.response.data && e.response.data.message) || this.$t('errors.operationFailed')
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally { this.mirrorBusy = false }
    },

    // Ko'zgu qarz (men lender) — voz kechish.
    async mirrorForgive() {
      if (this.mirrorBusy || !this.mirrorDebt) return
      this.mirrorBusy = true
      try {
        const res = await this.$api.mirrorForgiveDebt(this.mirrorDebt.id)
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success('Qarzdan voz kechildi')
          this.confirmKind = ''
          this.showMirror = false
          await this.loadDebts()
        }
      } catch (e) {
        const msg = (e.response && e.response.data && e.response.data.message) || this.$t('errors.operationFailed')
        this.$toast && this.$toast.error && this.$toast.error(msg)
      } finally { this.mirrorBusy = false }
    },

    // Ko'zgu qarz (men lender) — qarzdorga talab SMS.
    async mirrorDemand() {
      if (this.mirrorBusy || !this.mirrorDebt) return
      this.mirrorBusy = true
      try {
        const res = await this.$api.mirrorDemandDebt(this.mirrorDebt.id)
        if (res && res.data && res.data.success) {
          this.$toast && this.$toast.success && this.$toast.success('Talab bo‘yicha SMS yuborildi')
        }
      } catch (e) {
        const code = e.response && e.response.data && e.response.data.code
        if (code === 'no-card') {
          this.$toast && this.$toast.error && this.$toast.error('Avval "Plastik karta ma’lumotlari"ni kiriting')
        } else {
          const msg = (e.response && e.response.data && e.response.data.message) || this.$t('errors.operationFailed')
          this.$toast && this.$toast.error && this.$toast.error(msg)
        }
      } finally { this.mirrorBusy = false }
    },

    formatMoney(value, currency) {
      const cur = currency || 'UZS'
      if (!value) return '0 ' + cur
      return Number(value).toLocaleString('uz-UZ').replace(/,/g, ' ') + ' ' + cur
    },

    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('uz-UZ')
    },

    // Telefonni chiroyli format ("+998 90 123 45 67")
    formatPhone(p) {
      const d = String(p || '').replace(/\D/g, '')
      const r = d.startsWith('998') ? d.slice(3) : d
      if (r.length >= 9) return `+998 ${r.slice(0, 2)} ${r.slice(2, 5)} ${r.slice(5, 7)} ${r.slice(7, 9)}`
      return p
    },

    isOverdue(debt) {
      if (!debt.due_date || debt.status !== 'active') return false
      return new Date(debt.due_date) < new Date()
    },

    getPaidPercent(debt) {
      if (!debt.amount || debt.amount <= 0) return 0
      const paidAmount = debt.amount - (debt.remaining_amount || 0)
      return Math.round((paidAmount / debt.amount) * 100)
    }
  }
}
</script>
