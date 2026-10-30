<template>
  <!-- SS-DEV (2026-09-26), 13-band: SMS BOSHQARUVI KOMPONENTI (Tariflar sahifasida).
       30.10: endi HAR DOIM ko'rinadi (tarifga bog'liq emas — ma'lumotlar pullik emas); SMS ro'yxati jadvali
       olib tashlandi — u "Batafsil" orqali alohida sahifada (/price/sms). Kartalar: Jami SMS / Qoldiq SMS /
       Sarflangan / Yetkazilmagan; har birida "Tarif N · Paket M" (backend sms.pools; yo'q bo'lsa — faqat umumiy son). -->
  <div class="zx-sms-manager">
    <div v-if="!ready" class="text-center py-6 text-sm text-gray-400">{{ texts.loading }}</div>
    <template v-else>
    <div class="mb-4">
      <h2 class="text-lg font-bold text-gray-900">{{ texts.title }}</h2>
      <p class="text-sm text-gray-500 mt-0.5">{{ texts.subtitle }}</p>
    </div>
    <!-- SMS Statistika kartochkalari -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Jami SMS -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500">{{ texts.total }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ totals.total }}</div>
        <div v-if="lineTotal" class="mt-1 text-xs text-gray-500">{{ lineTotal }}</div>
      </div>

      <!-- Qoldiq SMS -->
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
        ]">{{ totals.remaining }}</div>
        <div v-if="lineRemaining" class="mt-1 text-xs text-gray-500">{{ lineRemaining }}</div>
        <div v-if="smsWarning" class="mt-1 text-xs font-medium" :class="[
          smsWarning === 'empty' ? 'text-red-500' : 'text-orange-500'
        ]">
          {{ smsWarning === 'empty' ? texts.smsEmpty : texts.smsLow }}
        </div>
      </div>

      <!-- Sarflangan -->
      <div class="bg-white rounded-xl shadow-sm p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500">{{ texts.used }}</span>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ totals.used }}</div>
        <div v-if="lineUsed" class="mt-1 text-xs text-gray-500">{{ lineUsed }}</div>
      </div>

      <!-- Yetkazilmagan (ilgari "Shu oy") — bosilsa yetkazilmagan SMS'lar sahifasi ochiladi -->
      <nuxt-link
        :to="localePath({ name: 'price-sms-undelivered' })"
        class="block bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <span class="text-sm text-gray-500">{{ $t('sms_hist.undelivered') }}</span>
        </div>
        <div class="text-2xl font-bold" :class="undeliveredCount > 0 ? 'text-red-600' : 'text-gray-900'">{{ undeliveredCount }}</div>
        <div class="mt-1 text-xs text-gray-500">{{ $t('sms_hist.period') }}</div>
      </nuxt-link>
    </div>

    <!-- Foydalanish darajasi: umumiy progress + ikkala hovuz -->
    <div v-if="totals.total > 0" class="bg-white rounded-xl shadow-sm p-5 mb-2">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-500">{{ texts.usageProgress }}</span>
        <span class="font-medium text-gray-700">{{ totals.used }}/{{ totals.total }} ({{ usagePercent }}%)</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="h-3 rounded-full transition-all"
          :class="[usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-yellow-500' : 'bg-blue-500']"
          :style="{ width: usagePercent + '%' }"
        ></div>
      </div>
      <div v-if="pools" class="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600">
        <span>{{ $t('sms_hist.plan') }}: <b class="text-gray-800">{{ pools.plan.used }}/{{ pools.plan.total }}</b></span>
        <span v-if="pools.package.total > 0">{{ $t('sms_hist.package') }}: <b class="text-gray-800">{{ pools.package.used }}/{{ pools.package.total }}</b></span>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import { poolLine } from '@/utils/smsHistory';

/** pools.* maydonlarini sonlarga keltiradi; yo'q bo'lsa null */
function normPool(p, withExpiry) {
  if (!p || typeof p !== 'object') { return null; }
  const out = { total: Number(p.total) || 0, used: Number(p.used) || 0, remaining: Number(p.remaining) || 0 };
  if (withExpiry) { out.expires_at = p.expires_at || null; out.expiring_count = Number(p.expiring_count) || 0; }
  return out;
}

export default {
  name: 'FinanceSmsManager',

  data() {
    return {
      ready: false,
      sms: { total: 0, used: 0, remaining: 0 },
      smsWarning: null,
      poolsRaw: null,
      statsPoolsUsed: null,
      statsUsedTotal: null,
      undeliveredCount: 0,
    };
  },

  computed: {
    /** { plan:{total,used,remaining}, package:{...} } yoki null (backend hali bermagan) */
    pools() {
      const raw = this.poolsRaw;
      if (!raw) { return null; }
      const plan = normPool(raw.plan, true);
      if (!plan) { return null; }
      const pkg = normPool(raw.package, false) || { total: 0, used: 0, remaining: 0 };
      // sarflangan — statistikadagi pools_used bo'lsa shu (aniqroq), aks holda hovuz hisoblagichi
      const su = this.statsPoolsUsed;
      if (su && su.plan != null) { plan.used = Number(su.plan) || 0; }
      if (su && su.package != null) { pkg.used = Number(su.package) || 0; }
      return { plan, package: pkg };
    },
    /** Asosiy raqamlar: ikkala hovuz yig'indisi (pools yo'q bo'lsa — eski sms.total/used/remaining) */
    totals() {
      const p = this.pools;
      if (!p) {
        return { total: Number(this.sms.total) || 0, used: Number(this.sms.used) || 0, remaining: Number(this.sms.remaining) || 0 };
      }
      return {
        total: p.plan.total + p.package.total,
        used: this.statsUsedTotal != null ? this.statsUsedTotal : p.plan.used + p.package.used,
        remaining: p.plan.remaining + p.package.remaining,
      };
    },
    lineTotal() { return this.pools ? poolLine(this.$t.bind(this), this.pools.plan.total, this.pools.package.total) : ''; },
    lineRemaining() { return this.pools ? poolLine(this.$t.bind(this), this.pools.plan.remaining, this.pools.package.remaining) : ''; },
    lineUsed() { return this.pools ? poolLine(this.$t.bind(this), this.pools.plan.used, this.pools.package.used) : ''; },
    usagePercent() {
      if (!this.totals.total) { return 0; }
      return Math.min(100, Math.round((this.totals.used / this.totals.total) * 100));
    },
    texts() {
      const locale = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: 'SMS boshqaruvi',
          subtitle: 'SMS paket, tarix va statistikangizni kuzating',
          remaining: 'Qoldiq SMS',
          total: 'Jami SMS',
          used: 'Sarflangan',
          smsEmpty: 'SMS paketingiz tugadi!',
          smsLow: 'SMS paketingiz tugamoqda',
          usageProgress: 'Foydalanish darajasi',
          loading: 'Yuklanmoqda…',
        },
        ru: {
          title: 'Управление SMS',
          subtitle: 'Отслеживайте SMS пакет, историю и статистику',
          remaining: 'Остаток SMS',
          total: 'Всего SMS',
          used: 'Израсходовано',
          smsEmpty: 'SMS пакет исчерпан!',
          smsLow: 'SMS пакет заканчивается',
          usageProgress: 'Уровень использования',
          loading: 'Загрузка…',
        },
        kr: {
          title: 'SMS бошқаруви',
          subtitle: 'SMS пакет, тарих ва статистикангизни кузатинг',
          remaining: 'Қолдиқ SMS',
          total: 'Жами SMS',
          used: 'Сарфланган',
          smsEmpty: 'SMS пакетингиз тугади!',
          smsLow: 'SMS пакетингиз тугамоқда',
          usageProgress: 'Фойдаланиш даражаси',
          loading: 'Юкланмоқда…',
        },
        en: {
          title: 'SMS management',
          subtitle: 'Track your SMS package, history and statistics',
          remaining: 'Remaining SMS',
          total: 'Total SMS',
          used: 'Spent',
          smsEmpty: 'Your SMS package has run out!',
          smsLow: 'Your SMS package is running out',
          usageProgress: 'Usage level',
          loading: 'Loading…',
        },
        kaa: {
          title: 'SMS basqarıwı',
          subtitle: 'SMS paket, tariyx hám statistikańızdı baqlań',
          remaining: 'Qalǵan SMS',
          total: 'Jámi SMS',
          used: 'Jumsalǵan',
          smsEmpty: 'SMS paketińiz tamamlandı!',
          smsLow: 'SMS paketińiz tamamlanbaqta',
          usageProgress: 'Paydalanıw dárejesi',
          loading: 'Júklenbekte…',
        },
      };
      return t[locale] || t.uz;
    },
  },

  async mounted() {
    await Promise.all([this.loadSmsData(), this.loadStats(), this.loadUndelivered()]);
    this.ready = true;
  },

  methods: {
    async loadSmsData() {
      try {
        const res = await this.$axios.$get('/finance/subscription', { silent: true });
        if (res?.success && res.data?.sms) {
          this.sms = res.data.sms;
          this.smsWarning = res.data.sms.warning || null;
          this.poolsRaw = res.data.sms.pools || null;
        }
      } catch (_) { /* kartalar nol bilan qoladi */ }
    },

    async loadStats() {
      try {
        const res = await this.$axios.$get('/finance/subscription/sms-stats', { silent: true });
        if (res?.success && res.data) {
          this.statsPoolsUsed = res.data.pools_used || null;
          this.statsUsedTotal = res.data.used_total != null ? Number(res.data.used_total) : null;
        }
      } catch (_) { /* pools_used yo'q — hovuz hisoblagichi */ }
    },

    /** Yetkazilmagan SMS soni (joriy davr, scope=period) — faqat son kerak: limit=1 */
    async loadUndelivered() {
      try {
        const res = await this.$axios.$get('/qarz-daftari/sms/undelivered', { params: { scope: 'period', page: 1, limit: 1 }, silent: true, background: true });
        if (res?.success && res.data) { this.undeliveredCount = Number(res.data.count) || 0; }
      } catch (_) { this.undeliveredCount = 0; }
    },
  },
};
</script>
