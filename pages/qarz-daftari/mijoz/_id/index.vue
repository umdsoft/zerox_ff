<template>
  <div class="pb-8">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <svg class="w-10 h-10 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>

    <!-- Error -->
    <div v-else-if="loadError" class="flex items-center justify-center py-20">
      <div class="text-center max-w-md">
        <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">{{ texts.errorTitle }}</h2>
        <button @click="goBack" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm">{{ texts.back }}</button>
      </div>
    </div>

    <div v-else-if="data">
      <!-- Header (Qarz tafsiloti) -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div class="flex items-start gap-3">
          <button @click="goBack" class="flex-shrink-0 mt-1 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm" :title="texts.back">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
            <p class="text-gray-500 mt-1">{{ data.mijoz.fish }} <span v-if="totalLabel" class="text-gray-400">— {{ totalLabel }}</span></p>
          </div>
        </div>
        <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
          <nuxt-link :to="localePath({ name: 'qarz-daftari-mijoz-id-amaliyotlar', params: { id: data.mijoz.id } }) + (turi ? '?turi=' + turi : '')" class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium text-sm transition-colors border border-gray-300 shadow-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            {{ texts.history }}
          </nuxt-link>
          <nuxt-link v-if="lastActiveQarz" :to="localePath({ name: 'qarz-daftari-qarz-id-kvitansiya', params: { id: lastActiveQarz.id } })" class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium text-sm transition-colors border border-gray-300 shadow-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/></svg>
            {{ texts.receipt }}
          </nuxt-link>
          <!-- Yangi qarz qo'shish — har doim mavjud, currentTuri bo'yicha berish/olish formaga olib boradi -->
          <nuxt-link :to="newDebtUrl" :class="['inline-flex items-center px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm text-white', isOlish ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700']">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            {{ texts.newDebt }}
          </nuxt-link>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chap ustun: mijoz info + bo'lib to'lash jadvali (agar bor bo'lsa) -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl shadow-sm p-6">
          <!-- Mijoz info -->
          <div class="flex items-center gap-4 mb-6">
            <div :class="['w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm', avatarColor]">
              {{ (data.mijoz.fish || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-bold text-gray-900 truncate">{{ data.mijoz.fish }}</h2>
              <div class="flex flex-wrap items-center gap-2 mt-1">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold', isOlish ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700']">
                  {{ isOlish ? texts.qarzBeruvchi : texts.qarzOluvchi }}
                </span>
                <p v-if="data.mijoz.telefon" class="text-sm text-gray-500">{{ data.mijoz.telefon }}</p>
              </div>
            </div>
            <div class="flex-shrink-0 flex items-center gap-2">
              <span :class="hasActive ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'" class="px-3 py-1.5 rounded-lg text-xs font-semibold">
                {{ hasActive ? texts.active : texts.allClosed }}
              </span>
              <!-- Qarz oluvchi ma'lumotlarini tahrirlash (xato kiritilgan FIO/telefon uchun) -->
              <button
                type="button"
                @click="openEdit"
                :title="texts.editTitle"
                class="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Stats: Jami qarz UZS, Jami qarz USD, Berilgan sana, Qaytarish sanasi -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-xs text-gray-500 mb-1">{{ texts.jamiQarz }} (UZS)</p>
              <p class="text-base font-bold text-gray-900">{{ formatMoney(jamiQarzUzs) }}</p>
              <p class="text-xs text-gray-400">UZS</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-xs text-gray-500 mb-1">{{ texts.jamiQarz }} (USD)</p>
              <p class="text-base font-bold text-gray-900">{{ formatMoney(jamiQarzUsd) }}</p>
              <p class="text-xs text-gray-400">USD</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-xs text-gray-500 mb-1">{{ isOlish ? texts.lastDateOlish : texts.lastDateBerish }}</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatDate(lastBerilganSana) }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-xs text-gray-500 mb-1">{{ texts.lastReturnDate }}</p>
              <p v-if="lastQaytarishSanasi" class="text-sm font-semibold text-gray-900">{{ formatDate(lastQaytarishSanasi) }}</p>
              <p v-else-if="lastBolibTolash" class="text-xs font-semibold text-purple-600">{{ texts.installment }}: {{ lastBolibTolash.oylar_soni }} {{ texts.month }}</p>
              <p v-else class="text-sm text-gray-400">—</p>
            </div>
          </div>
          </div>

          <!-- Bo'lib to'lash jadvallari — BARCHA bo'lib to'lash qarzlar uchun -->
          <div v-for="bt in bolibTolashList" :key="'bt-' + bt.qarz_id" class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-bold text-gray-900 mb-1">{{ texts.installmentTable }}</h3>
            <p class="text-xs text-gray-500 mb-4">{{ formatMoney(bt.miqdor) }} {{ bt.valyuta }} — {{ formatDate(bt.berilgan_sana) }}<span v-if="bt.mahsulot_nomi"> · {{ bt.mahsulot_nomi }}</span></p>
            <QarzDaftariBolibTolashJadval :tolovlar="bt.tolovlar" :valyuta="bt.valyuta" @tolandi="onTolandi" />
          </div>
        </div>

        <!-- O'ng: Amallar -->
        <div>
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-4">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">{{ texts.actions }}</h3>
            <div v-if="hasActive && lastActiveQarz" class="space-y-3">
              <!-- OLISH: faqat "Qarzni qaytarish" tugmasi (foydalanuvchi qarz olgan, qaytaradi) -->
              <template v-if="isOlish">
                <nuxt-link :to="localePath({ name: 'qarz-daftari-qarz-id-yopish', params: { id: lastActiveQarz.id } })" class="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 rounded-xl font-medium text-sm transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                  {{ texts.repay }}
                </nuxt-link>
              </template>
              <!-- BERISH: 3 tugma — Talab, Yopish, Voz kechish -->
              <template v-else>
                <button @click="talabQilish" :disabled="talabLoading" class="w-full flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800 rounded-xl font-medium text-sm transition-all disabled:opacity-50">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                  {{ talabLoading ? texts.sending : texts.demand }}
                </button>
                <nuxt-link :to="localePath({ name: 'qarz-daftari-qarz-id-yopish', params: { id: lastActiveQarz.id } })" class="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 rounded-xl font-medium text-sm transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  {{ texts.closeDebt }}
                </nuxt-link>
                <nuxt-link :to="localePath({ name: 'qarz-daftari-qarz-id-voz-kechish', params: { id: lastActiveQarz.id } })" class="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 rounded-xl font-medium text-sm transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                  {{ texts.forgive }}
                </nuxt-link>
              </template>
              <p class="text-xs text-gray-400 mt-3 text-center">{{ texts.actionsApplyTo }}</p>
            </div>
            <div v-else class="text-center py-4">
              <p class="text-sm text-gray-500">{{ texts.noActiveDebts }}</p>
              <nuxt-link :to="newDebtUrl" class="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                {{ texts.newDebt }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Qarz oluvchi (mijoz) ma'lumotlarini tahrirlash modali -->
    <div
      v-if="showEdit"
      class="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      style="z-index: 100"
      @click.self="closeEdit"
    >
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-bold text-gray-900">{{ texts.editTitle }}</h3>
          <button type="button" @click="closeEdit" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form @submit.prevent="saveEdit" class="px-6 py-5 space-y-4" novalidate>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.fishLabel }}</label>
            <input
              v-model="editForm.fish"
              type="text"
              maxlength="200"
              :placeholder="texts.fishPlaceholder"
              class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ texts.phoneLabel }}</label>
            <input
              v-model="editForm.telefon"
              type="tel"
              :placeholder="texts.phonePlaceholder"
              class="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="closeEdit" class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              {{ texts.cancel }}
            </button>
            <button
              type="submit"
              :disabled="editLoading || !editForm.fish.trim()"
              class="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {{ editLoading ? texts.saving : texts.save }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      data: null, loading: true, loadError: false, talabLoading: false, previousRouteName: null, bolibTolashList: [],
      // Qarz oluvchi (mijoz) ma'lumotlarini tahrirlash modali
      showEdit: false, editForm: { fish: '', telefon: '' }, editLoading: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => { vm.previousRouteName = from?.name || null; });
  },
  computed: {
    turi() { return this.$route.query?.turi || ''; },
    avatarColor() {
      const t = this.currentTuri;
      if (t === 'berish') return 'bg-gradient-to-br from-blue-500 to-blue-600';
      if (t === 'olish') return 'bg-gradient-to-br from-green-500 to-green-600';
      return 'bg-gradient-to-br from-gray-500 to-gray-600';
    },
    primaryTuri() {
      if (!this.data?.qarzlar?.length) return null;
      const counts = { berish: 0, olish: 0 };
      this.data.qarzlar.forEach(q => { counts[q.turi] = (counts[q.turi] || 0) + 1; });
      return counts.berish >= counts.olish ? 'berish' : 'olish';
    },
    /** Sahifa ko'rsatadigan qarzlar — `?turi=` query bo'lsa shu bo'yicha filter, aks holda hammasi */
    scopedQarzlar() {
      const all = this.data?.qarzlar || [];
      if (this.turi === 'berish' || this.turi === 'olish') {
        return all.filter(q => q.turi === this.turi);
      }
      return all;
    },
    activeQarzlar() {
      return this.scopedQarzlar.filter(q => q.status === 'aktiv');
    },
    hasActive() { return this.activeQarzlar.length > 0; },
    lastActiveQarz() {
      if (!this.activeQarzlar.length) return null;
      return this.activeQarzlar[0];
    },
    /** Ekranni boshqaruvchi turi: query → lastActiveQarz → primaryTuri */
    currentTuri() {
      return this.turi || this.lastActiveQarz?.turi || this.primaryTuri || 'berish';
    },
    isOlish() { return this.currentTuri === 'olish'; },
    jamiQarzUzs() {
      // Jami qarz = QOLDIQ summasi (qaytarilgan/voz kechilgan chegirilgan), miqdor emas.
      return this.scopedQarzlar.reduce((s, q) => q.valyuta === 'UZS' ? s + (Number(q.qoldiq) || 0) : s, 0);
    },
    jamiQarzUsd() {
      return this.scopedQarzlar.reduce((s, q) => q.valyuta === 'USD' ? s + (Number(q.qoldiq) || 0) : s, 0);
    },
    lastBerilganSana() {
      return this.lastActiveQarz?.berilgan_sana || this.data?.qarzlar?.[0]?.berilgan_sana || null;
    },
    lastQaytarishSanasi() {
      return this.lastActiveQarz?.qaytarish_sanasi || null;
    },
    lastBolibTolash() {
      if (this.bolibTolashList.length) return this.bolibTolashList[0];
      const q = this.lastActiveQarz;
      return (q && (Number(q.bolib_tolash) === 1 || Number(q.oylar_soni) > 0)) ? q : null;
    },
    totalLabel() {
      const parts = [];
      if (this.jamiQarzUzs > 0) parts.push(this.formatMoney(this.jamiQarzUzs) + ' UZS');
      if (this.jamiQarzUsd > 0) parts.push(this.formatMoney(this.jamiQarzUsd) + ' USD');
      return parts.join(' • ');
    },
    newDebtUrl() {
      if (!this.data?.mijoz?.savdo_faoliyat_id) return '#';
      // currentTuri ishlatamiz — badge va Yangi qarz tugma rangi bilan mos
      const t = this.currentTuri || 'berish';
      const name = t === 'berish' ? 'qarz-daftari-faoliyat-id-berish-yangi' : 'qarz-daftari-faoliyat-id-olish-yangi';
      return this.localePath({ name, params: { id: this.data.mijoz.savdo_faoliyat_id } }) + `?mijoz_id=${this.data.mijoz.id}`;
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: "Qarz tafsiloti", back: "Orqaga", history: "Amaliyotlar tarixi", receipt: "Kvitansiya",
          jamiQarz: "Jami qarz",
          lastDateBerish: "Berilgan sana", lastDateOlish: "Olingan sana", lastReturnDate: "Qaytarish sanasi",
          installment: "Bo'lib to'lash", month: "oy",
          installmentTable: "Bo'lib to'lash jadvali",
          actions: "Amallar",
          demand: "Qaytarishni talab qilish", sending: "Yuborilmoqda...",
          closeDebt: "Qarzni yopish", forgive: "Qarzdan voz kechish",
          repay: "Qarzni qaytarish",
          active: "Aktiv", allClosed: "Barchasi yopilgan", noActiveDebts: "Aktiv qarzlar yo'q",
          newDebt: "Yangi qarz qo'shish",
          actionsApplyTo: "Eng oxirgi aktiv qarzga qo'llanadi",
          qarzOluvchi: "Qarz oluvchi", qarzBeruvchi: "Qarz beruvchi",
          errorTitle: "Mijoz topilmadi yoki kirish ruxsati yo'q",
          editTitle: "Qarz oluvchi ma'lumotlarini tahrirlash",
          fishLabel: "F.I.O", fishPlaceholder: "Familiya Ism Sharif",
          phoneLabel: "Telefon raqami", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Bekor qilish", save: "Saqlash", saving: "Saqlanmoqda...",
          fishRequired: "F.I.O kiritilishi shart",
          fishTooLong: "F.I.O 200 belgidan oshmasligi kerak",
          phoneInvalid: "Telefon formati noto'g'ri (+998XXXXXXXXX)",
          saved: "Ma'lumotlar yangilandi",
          saveError: "Saqlashda xatolik yuz berdi",
        },
        ru: {
          title: "Детали долга", back: "Назад", history: "История операций", receipt: "Квитанция",
          jamiQarz: "Общий долг",
          lastDateBerish: "Дата выдачи", lastDateOlish: "Дата получения", lastReturnDate: "Дата возврата",
          installment: "Рассрочка", month: "мес",
          installmentTable: "График рассрочки",
          actions: "Действия",
          demand: "Потребовать возврат", sending: "Отправка...",
          closeDebt: "Закрыть долг", forgive: "Простить долг",
          repay: "Вернуть долг",
          active: "Активный", allClosed: "Все закрыты", noActiveDebts: "Нет активных долгов",
          newDebt: "Добавить новый долг",
          actionsApplyTo: "Применяется к последнему активному долгу",
          qarzOluvchi: "Должник", qarzBeruvchi: "Кредитор",
          errorTitle: "Клиент не найден или нет доступа",
          editTitle: "Редактировать данные должника",
          fishLabel: "Ф.И.О", fishPlaceholder: "Фамилия Имя Отчество",
          phoneLabel: "Номер телефона", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Отмена", save: "Сохранить", saving: "Сохранение...",
          fishRequired: "Ф.И.О обязательно",
          fishTooLong: "Ф.И.О не должно превышать 200 символов",
          phoneInvalid: "Неверный формат телефона (+998XXXXXXXXX)",
          saved: "Данные обновлены",
          saveError: "Ошибка при сохранении",
        },
        kr: {
          title: "Қарз тафсилоти", back: "Орқага", history: "Амалиётлар тарихи", receipt: "Квитансия",
          jamiQarz: "Жами қарз",
          lastDateBerish: "Берилган сана", lastDateOlish: "Олинган сана", lastReturnDate: "Қайтариш санаси",
          installment: "Бўлиб тўлаш", month: "ой",
          installmentTable: "Бўлиб тўлаш жадвали",
          actions: "Амаллар",
          demand: "Қайтаришни талаб қилиш", sending: "Юборилмоқда...",
          closeDebt: "Қарзни ёпиш", forgive: "Қарздан воз кечиш",
          repay: "Қарзни қайтариш",
          active: "Актив", allClosed: "Барчаси ёпилган", noActiveDebts: "Актив қарзлар йўқ",
          newDebt: "Янги қарз қўшиш",
          actionsApplyTo: "Энг охирги актив қарзга қўлланади",
          qarzOluvchi: "Қарз олувчи", qarzBeruvchi: "Қарз берувчи",
          errorTitle: "Мижоз топилмади ёки рухсат йўқ",
          editTitle: "Қарз олувчи маълумотларини таҳрирлаш",
          fishLabel: "Ф.И.О", fishPlaceholder: "Фамилия Исм Шариф",
          phoneLabel: "Телефон рақами", phonePlaceholder: "+998XXXXXXXXX",
          cancel: "Бекор қилиш", save: "Сақлаш", saving: "Сақланмоқда...",
          fishRequired: "Ф.И.О киритилиши шарт",
          fishTooLong: "Ф.И.О 200 белгидан ошмаслиги керак",
          phoneInvalid: "Телефон формати нотўғри (+998XXXXXXXXX)",
          saved: "Маълумотлар янгиланди",
          saveError: "Сақлашда хатолик юз берди",
        },
      };
      return t[l] || t.uz;
    },
  },
  async mounted() { await this.load(); },
  methods: {
    formatMoney(n) { return n ? Math.round(parseFloat(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0'; },
    formatDate(d) {
      if (!d) return '—';
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return `${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.${dt.getFullYear()}`;
    },
    goBack() {
      // Deterministik parent — qarzlar ro'yxati (turi bo'yicha)
      if (this.turi) {
        this.$router.push(this.localePath({ name: 'qarz-daftari-qarzlar' }) + `?turi=${this.turi}`);
      } else {
        this.$router.push(this.localePath({ name: 'qarz-daftari' }));
      }
    },
    // ===== Qarz oluvchi (mijoz) ma'lumotlarini tahrirlash =====
    openEdit() {
      if (!this.data?.mijoz) return;
      this.editForm = { fish: this.data.mijoz.fish || '', telefon: this.data.mijoz.telefon || '' };
      this.showEdit = true;
    },
    closeEdit() { this.showEdit = false; },
    normalizePhone(raw) {
      // Faqat raqam va '+' qoldiramiz (bo'sh joy, chiziqcha, qavslarni olib tashlaymiz)
      let p = String(raw || '').replace(/[^\d+]/g, '');
      if (!p) return '';
      // '+' yo'q bo'lsa: 998... → +998..., 9 xonali lokal → +998 prefiks
      if (!p.startsWith('+')) {
        if (p.startsWith('998')) p = '+' + p;
        else if (p.length === 9) p = '+998' + p;
      }
      return p;
    },
    async saveEdit() {
      const fish = (this.editForm.fish || '').trim();
      const telefon = this.normalizePhone(this.editForm.telefon);
      // Backend validatsiyasiga mos client-side tekshiruv
      if (!fish) { this.$toast?.error(this.texts.fishRequired); return; }
      if (fish.length > 200) { this.$toast?.error(this.texts.fishTooLong); return; }
      if (telefon && !/^\+998\d{9}$/.test(telefon)) { this.$toast?.error(this.texts.phoneInvalid); return; }
      this.editLoading = true;
      try {
        await this.$axios.$put(`/qarz-daftari/mijozlar/${this.data.mijoz.id}`, { fish, telefon });
        // Lokal yangilash — sahifani qayta yuklamasdan darhol ko'rinadi
        this.data.mijoz.fish = fish;
        this.data.mijoz.telefon = telefon || null;
        this.$toast?.success(this.texts.saved);
        this.showEdit = false;
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.texts.saveError);
      } finally {
        this.editLoading = false;
      }
    },
    async load() {
      this.loading = true; this.loadError = false;
      try {
        const res = await this.$axios.$get(`/qarz-daftari/mijozlar/${this.$route.params.id}/history`, { silent: true });
        if (res?.success && res.data) {
          this.data = res.data;
          // Agar oxirgi aktiv qarz bo'lib to'lash bo'lsa — to'lovlar jadvalini yuklash
          await this.loadTolovlarIfNeeded();
        } else {
          this.loadError = true;
        }
      } catch (_) { this.loadError = true; } finally { this.loading = false; }
    },
    async loadTolovlarIfNeeded() {
      if (!this.data?.qarzlar?.length) { this.bolibTolashList = []; return; }
      const allQ = this.data.qarzlar;
      const turiFilter = this.$route.query?.turi || '';
      const btQarzlar = allQ.filter(q => {
        if (q.status !== 'aktiv') return false;
        if (turiFilter === 'berish' || turiFilter === 'olish') {
          if (q.turi !== turiFilter) return false;
        }
        return Number(q.bolib_tolash) === 1 || Number(q.oylar_soni) > 0;
      });
      if (!btQarzlar.length) { this.bolibTolashList = []; return; }
      const list = [];
      for (const q of btQarzlar) {
        try {
          const res = await this.$axios.$get(`/qarz-daftari/qarz/${q.id}/tolovlar`, { silent: true });
          const tolovlar = (res?.success && Array.isArray(res.data)) ? res.data : [];
          if (tolovlar.length) {
            list.push({ qarz_id: q.id, miqdor: q.miqdor, valyuta: q.valyuta, berilgan_sana: q.berilgan_sana, mahsulot_nomi: q.mahsulot_nomi, oylar_soni: q.oylar_soni, tolovlar });
          }
        } catch (_) {}
      }
      this.bolibTolashList = list;
    },
    async onTolandi(tolovId) {
      try {
        await this.$axios.$put(`/qarz-daftari/tolov/${tolovId}/tolandi`, {}, { silent: true });
        await this.load();
        this.$toast?.success(this.$i18n?.locale === 'ru' ? 'Платёж отмечен' : (this.$i18n?.locale === 'kr' ? "Тўлов қайд этилди" : "To'lov belgilandi"));
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || 'Xatolik');
      }
    },
    async talabQilish() {
      if (!this.lastActiveQarz) return;
      this.talabLoading = true;
      try {
        const res = await this.$axios.$post(`/qarz-daftari/qarz/${this.lastActiveQarz.id}/talab`, {}, { silent: true });
        const l = this.$i18n?.locale || 'uz';
        const phone = res?.data?.phone || '';
        const masked = phone ? phone.replace(/^(\+?\d{4})\d+(\d{2})$/, '$1***$2') : '';
        const okMsg = {
          uz: masked ? `Talab yuborildi. SMS ${masked} raqamiga jo'natildi.` : "Talab yuborildi va SMS jo'natildi",
          ru: masked ? `Запрос отправлен. SMS отправлено на ${masked}.` : 'Запрос отправлен и SMS доставлено',
          kr: masked ? `Талаб юборилди. SMS ${masked} рақамига жўнатилди.` : "Талаб юборилди ва SMS жўнатилди",
        };
        this.$toast?.success(okMsg[l] || okMsg.uz);
      } catch (e) {
        const code = e.response?.data?.code;
        const l = this.$i18n?.locale || 'uz';
        const errMap = {
          'no-phone': {
            uz: "Mijozning telefon raqami kiritilmagan. Avval telefon raqamini qo'shing.",
            ru: 'Номер телефона клиента не указан. Сначала добавьте номер.',
            kr: "Мижознинг телефон рақами киритилмаган. Аввал телефон рақамини қўшинг.",
          },
          'sms-failed': {
            uz: 'SMS paketingiz tugagan. Iltimos, paket sotib oling.',
            ru: 'SMS пакет закончился. Пожалуйста, купите пакет.',
            kr: 'SMS пакетингиз тугаган. Илтимос, пакет сотиб олинг.',
          },
          'no-sms-package': {
            uz: 'SMS paketingiz tugagan. Tariflar bo\'limidan paket sotib oling.',
            ru: 'SMS пакет закончился. Купите пакет в разделе Тарифы.',
            kr: 'SMS пакетингиз тугаган. Тарифлар бўлимидан пакет сотиб олинг.',
          },
          'not-active': {
            uz: 'Bu qarz aktiv emas',
            ru: 'Этот долг не активен',
            kr: 'Бу қарз актив эмас',
          },
          'wrong-type': {
            uz: 'Faqat siz bergan qarzlar uchun talab yuborish mumkin',
            ru: 'Запрос можно отправлять только по выданным долгам',
            kr: 'Фақат сиз берган қарзлар учун талаб юбориш мумкин',
          },
        };
        const fallback = e.response?.data?.message || 'Xatolik';
        this.$toast?.error(errMap[code]?.[l] || fallback);
        // SMS paketi tugagan YOKI pulli tarif kerak bo'lsa → tariflarga
        const requiredPlan = e.response?.data?.required_plan;
        const status = e.response?.status;
        if (code === 'no-sms-package' || code === 'sms-failed' || (status === 403 && requiredPlan)) {
          this.$router.push(this.localePath({ name: 'price' }));
        }
      } finally { this.talabLoading = false; }
    },
  },
};
</script>
