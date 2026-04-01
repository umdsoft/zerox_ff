<template>
  <div class="pb-8">
    <!-- Bo'limlar navigatsiyasi -->
    <div class="bg-white rounded-2xl shadow-sm mb-6 p-1.5 flex gap-1.5 overflow-x-auto">
      <nuxt-link :to="localePath({ name: 'finance-debts' })" class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap text-gray-600 hover:bg-gray-100">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        {{ $t('menu.debt_book') }}
      </nuxt-link>
      <nuxt-link :to="localePath({ name: 'finance-sms' })" class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap bg-blue-600 text-white">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        {{ $t('menu.sms') || 'SMS' }}
      </nuxt-link>
      <nuxt-link :to="localePath({ name: 'finance-debts-analytics' })" class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap text-gray-600 hover:bg-gray-100">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        {{ $t('finance.analytics') || 'Analitika' }}
      </nuxt-link>
    </div>

    <!-- Header -->
    <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ texts.title }}</h1>
          <p class="text-sm text-gray-500 mt-1">{{ texts.subtitle }}</p>
        </div>
        <nuxt-link
          :to="localePath({ name: 'price' })"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-xl transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          {{ texts.buyMore }}
        </nuxt-link>
      </div>
    </div>

    <!-- SMS Statistika kartochkalari -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Qoldiq -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3">
          <div :class="[
            'w-10 h-10 rounded-lg flex items-center justify-center',
            smsWarning === 'empty' ? 'bg-red-100' : smsWarning === 'critical' ? 'bg-orange-100' : 'bg-green-100'
          ]">
            <svg class="w-5 h-5" :class="[
              smsWarning === 'empty' ? 'text-red-600' : smsWarning === 'critical' ? 'text-orange-600' : 'text-green-600'
            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500">{{ texts.remaining }}</span>
        </div>
        <div class="text-2xl font-bold" :class="[
          smsWarning === 'empty' ? 'text-red-600' : smsWarning === 'critical' ? 'text-orange-600' : 'text-gray-900'
        ]">{{ sms.remaining }}</div>
        <div v-if="smsWarning" class="mt-1 text-xs font-medium" :class="[
          smsWarning === 'empty' ? 'text-red-500' : 'text-orange-500'
        ]">
          {{ smsWarning === 'empty' ? texts.smsEmpty : texts.smsLow }}
        </div>
      </div>

      <!-- Jami -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500">{{ texts.total }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ sms.total }}</div>
      </div>

      <!-- Ishlatilgan -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500">{{ texts.used }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ sms.used }}</div>
      </div>

      <!-- Shu oy -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500">{{ texts.thisMonth }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ stats.this_month }}</div>
      </div>
    </div>

    <!-- Progress bar -->
    <div v-if="sms.total > 0" class="bg-white rounded-xl shadow-sm p-5 mb-6">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-500">{{ texts.usageProgress }}</span>
        <span class="font-medium text-gray-700">{{ sms.used }}/{{ sms.total }} ({{ usagePercent }}%)</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="h-3 rounded-full transition-all"
          :class="[usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-yellow-500' : 'bg-blue-500']"
          :style="{ width: usagePercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- Qo'lda SMS yuborish -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ texts.sendManual }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ texts.phone }}</label>
          <input v-model="sendForm.phone" type="text" placeholder="+998 90 123 45 67"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ texts.template }}</label>
          <select v-model="sendForm.template"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="soft">{{ texts.tplSoft }}</option>
            <option value="medium">{{ texts.tplMedium }}</option>
            <option value="hard">{{ texts.tplHard }}</option>
          </select>
        </div>
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ texts.customMsg }}</label>
        <textarea v-model="sendForm.message" rows="2" :placeholder="texts.customMsgPlaceholder"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
      </div>
      <button @click="sendSms" :disabled="sending || !sendForm.phone"
        class="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
        {{ sending ? texts.sending : texts.sendBtn }}
      </button>
    </div>

    <!-- SMS tarix jadvali -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="p-6 pb-0">
        <h2 class="text-lg font-semibold text-gray-900">{{ texts.history }}</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full mt-4">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{{ texts.hDate }}</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{{ texts.hPhone }}</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{{ texts.hType }}</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{{ texts.hStatus }}</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{{ texts.hMessage }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in history" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(item.sent_at) }}</td>
              <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">{{ item.phone }}</td>
              <td class="px-6 py-3">
                <span :class="[
                  'inline-block px-2 py-0.5 text-xs font-medium rounded-full',
                  item.type === 'auto' ? 'bg-blue-100 text-blue-700' : item.type === 'manual' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                ]">{{ item.type === 'auto' ? texts.typeAuto : item.type === 'manual' ? texts.typeManual : item.type }}</span>
              </td>
              <td class="px-6 py-3">
                <span :class="[
                  'inline-block w-2 h-2 rounded-full mr-1',
                  item.status === 'sent' ? 'bg-green-500' : item.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                ]"></span>
                <span class="text-sm">{{ item.status === 'sent' ? texts.statusSent : item.status === 'failed' ? texts.statusFailed : texts.statusPending }}</span>
              </td>
              <td class="px-6 py-3 text-sm text-gray-500 max-w-xs truncate">{{ item.message }}</td>
            </tr>
            <tr v-if="history.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-400">{{ texts.noHistory }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 p-4 border-t border-gray-100">
        <button v-for="p in totalPages" :key="p"
          @click="loadHistory(p)"
          :class="['w-8 h-8 rounded-lg text-sm font-medium transition-colors',
            p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
        >{{ p }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import subscriptionMixin from '~/mixins/subscriptionMixin';

export default {
  middleware: 'auth',
  mixins: [subscriptionMixin],

  data() {
    return {
      sms: { total: 0, used: 0, remaining: 0 },
      smsWarning: null,
      stats: { this_month: 0, total_sent: 0 },
      history: [],
      page: 1,
      totalPages: 1,
      sendForm: { phone: '', template: 'soft', message: '', debt_id: null },
      sending: false,
    };
  },

  computed: {
    usagePercent() {
      if (!this.sms.total) return 0;
      return Math.min(100, Math.round((this.sms.used / this.sms.total) * 100));
    },
    texts() {
      const locale = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: 'SMS boshqaruvi',
          subtitle: 'SMS paket, tarix va statistikangizni kuzating',
          buyMore: "Qo'shimcha SMS olish",
          remaining: 'Qoldiq SMS',
          total: 'Jami paket',
          used: 'Ishlatilgan',
          thisMonth: 'Shu oy',
          smsEmpty: 'SMS paketingiz tugadi!',
          smsLow: 'SMS paketingiz tugamoqda',
          usageProgress: 'Foydalanish',
          sendManual: "Qo'lda SMS yuborish",
          phone: 'Telefon raqam',
          template: 'Shablon',
          tplSoft: 'Yumshoq',
          tplMedium: "O'rtacha",
          tplHard: 'Qattiq',
          customMsg: 'Maxsus matn (ixtiyoriy)',
          customMsgPlaceholder: 'Bo\'sh qoldirsangiz shablon ishlatiladi',
          sendBtn: 'SMS yuborish',
          sending: 'Yuborilmoqda...',
          history: 'SMS tarix',
          hDate: 'Sana',
          hPhone: 'Telefon',
          hType: 'Turi',
          hStatus: 'Holat',
          hMessage: 'Xabar',
          typeAuto: 'Avtomatik',
          typeManual: "Qo'lda",
          statusSent: 'Yuborildi',
          statusFailed: 'Xato',
          statusPending: 'Kutilmoqda',
          noHistory: 'SMS tarix bo\'sh',
        },
        ru: {
          title: 'Управление SMS',
          subtitle: 'Отслеживайте SMS пакет, историю и статистику',
          buyMore: 'Купить SMS',
          remaining: 'Остаток SMS',
          total: 'Всего пакет',
          used: 'Использовано',
          thisMonth: 'Этот месяц',
          smsEmpty: 'SMS пакет исчерпан!',
          smsLow: 'SMS пакет заканчивается',
          usageProgress: 'Использование',
          sendManual: 'Отправить SMS вручную',
          phone: 'Номер телефона',
          template: 'Шаблон',
          tplSoft: 'Мягкое',
          tplMedium: 'Среднее',
          tplHard: 'Строгое',
          customMsg: 'Свой текст (необязательно)',
          customMsgPlaceholder: 'Если пусто, используется шаблон',
          sendBtn: 'Отправить SMS',
          sending: 'Отправка...',
          history: 'История SMS',
          hDate: 'Дата',
          hPhone: 'Телефон',
          hType: 'Тип',
          hStatus: 'Статус',
          hMessage: 'Сообщение',
          typeAuto: 'Авто',
          typeManual: 'Вручную',
          statusSent: 'Отправлено',
          statusFailed: 'Ошибка',
          statusPending: 'Ожидание',
          noHistory: 'История SMS пуста',
        },
        kr: {
          title: 'SMS бошқаруви',
          subtitle: 'SMS пакет, тарих ва статистикангизни кузатинг',
          buyMore: 'Қўшимча SMS олиш',
          remaining: 'Қолдиқ SMS',
          total: 'Жами пакет',
          used: 'Ишлатилган',
          thisMonth: 'Шу ой',
          smsEmpty: 'SMS пакетингиз тугади!',
          smsLow: 'SMS пакетингиз тугамоқда',
          usageProgress: 'Фойдаланиш',
          sendManual: 'Қўлда SMS юбориш',
          phone: 'Телефон рақам',
          template: 'Шаблон',
          tplSoft: 'Юмшоқ',
          tplMedium: 'Ўртача',
          tplHard: 'Қаттиқ',
          customMsg: 'Махсус матн (ихтиёрий)',
          customMsgPlaceholder: 'Бўш қолдирсангиз шаблон ишлатилади',
          sendBtn: 'SMS юбориш',
          sending: 'Юборилмоқда...',
          history: 'SMS тарих',
          hDate: 'Сана',
          hPhone: 'Телефон',
          hType: 'Тури',
          hStatus: 'Ҳолат',
          hMessage: 'Хабар',
          typeAuto: 'Автоматик',
          typeManual: 'Қўлда',
          statusSent: 'Юборилди',
          statusFailed: 'Хато',
          statusPending: 'Кутилмоқда',
          noHistory: 'SMS тарих бўш',
        },
      };
      return t[locale] || t.uz;
    },
  },

  async mounted() {
    await this.loadSubscriptionData();
    if (!this.features.sms_history) {
      this.showUpgradeModal('sms_history');
      return this.$router.push(this.localePath({ name: 'finance-debts' }));
    }
    await Promise.all([this.loadSmsData(), this.loadHistory(1), this.loadStats()]);
  },

  methods: {
    formatDate(d) {
      if (!d) return '';
      const date = new Date(d);
      return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },

    async loadSmsData() {
      try {
        const res = await this.$axios.$get('/finance/subscription', { silent: true });
        if (res?.success) {
          this.sms = res.data.sms;
          this.smsWarning = res.data.sms.warning;
        }
      } catch (_) {}
    },

    async loadHistory(page) {
      try {
        this.page = page;
        const res = await this.$axios.$get(`/finance/subscription/sms-history?page=${page}&limit=20`, { silent: true });
        if (res?.success) {
          this.history = res.data;
          this.totalPages = res.pagination.totalPages;
        }
      } catch (_) {}
    },

    async loadStats() {
      try {
        const res = await this.$axios.$get('/finance/subscription/sms-stats', { silent: true });
        if (res?.success) {
          this.stats = res.data;
        }
      } catch (_) {}
    },

    async sendSms() {
      if (!this.sendForm.phone) return;
      this.sending = true;
      try {
        const res = await this.$axios.post('/finance/subscription/send-sms', {
          phone: this.sendForm.phone.replace(/\s/g, ''),
          template: this.sendForm.template,
          message: this.sendForm.message || null,
          debt_id: this.sendForm.debt_id,
        });
        if (res.data.success) {
          this.$toast.success(res.data.message);
          this.sendForm = { phone: '', template: 'soft', message: '', debt_id: null };
          await Promise.all([this.loadSmsData(), this.loadHistory(1)]);
        } else {
          this.$toast.error(res.data.message);
        }
      } catch (e) {
        this.$toast.error(e?.response?.data?.message || 'Xatolik');
      } finally {
        this.sending = false;
      }
    },
  },
};
</script>
