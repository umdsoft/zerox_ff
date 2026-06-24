<template>
  <div
    v-if="items.length"
    class="flex flex-col justify-center gap-0.5 rounded-lg bg-white bg-opacity-10 px-2.5 py-1"
  >
    <!-- Sana (CBU) -->
    <div v-if="cbuDate" class="flex items-center gap-1 leading-tight text-[9px] font-medium text-white text-opacity-70">
      <svg class="h-2 w-2 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
      <span class="tabular-nums">{{ cbuDate }}</span>
    </div>

    <!-- Kurslar — ustma-ust (vertikal) -->
    <div v-for="c in items" :key="c.ccy" class="flex items-center gap-1.5 leading-tight" :title="c.title">
      <!-- Bayroq (inline SVG — Windows emoji-bayroqni ko'rsatmaydi) -->
      <span class="block h-2.5 w-3.5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black ring-opacity-10">
        <svg v-if="c.ccy === 'USD'" viewBox="0 0 24 16" preserveAspectRatio="none" class="block h-full w-full">
          <rect width="24" height="16" fill="#fff" />
          <rect width="24" height="1.23" y="1.23" fill="#b22234" />
          <rect width="24" height="1.23" y="3.69" fill="#b22234" />
          <rect width="24" height="1.23" y="6.15" fill="#b22234" />
          <rect width="24" height="1.23" y="8.62" fill="#b22234" />
          <rect width="24" height="1.23" y="11.08" fill="#b22234" />
          <rect width="24" height="1.23" y="13.54" fill="#b22234" />
          <rect width="10" height="8.62" fill="#3c3b6e" />
        </svg>
        <svg v-else viewBox="0 0 24 16" preserveAspectRatio="none" class="block h-full w-full">
          <rect width="24" height="5.34" y="0" fill="#fff" />
          <rect width="24" height="5.34" y="5.33" fill="#0039a6" />
          <rect width="24" height="5.34" y="10.66" fill="#d52b1e" />
        </svg>
      </span>

      <!-- Kurs: 1 USD = 12 086 so'm -->
      <span class="whitespace-nowrap text-[10px] font-medium text-white">
        1 {{ c.ccy }} = <span class="font-semibold tabular-nums">{{ c.rate }}</span>
        <span class="text-[8px] text-white text-opacity-70">so'm</span>
      </span>

      <!-- Kunlik o'zgarish — yashil (o'sgan) / qizil (pasaygan). Inline style (Tailwind purge'siz). -->
      <span
        v-if="c.diff !== 0"
        class="ml-auto flex items-center gap-0.5 pl-1 text-[9px] font-semibold leading-none tabular-nums"
        :style="c.diff > 0 ? 'color:#4ade80' : 'color:#f87171'"
      >
        <svg v-if="c.diff > 0" class="h-1.5 w-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5l7 9H5l7-9z" /></svg>
        <svg v-else class="h-1.5 w-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 19l-7-9h14l-7 9z" /></svg>
        {{ c.diffAbs }}
      </span>
    </div>
  </div>
</template>

<script>
// CBU (cbu.uz) kunlik valyuta kurslari — USD va RUB. CORS ochiq (Access-Control-Allow-Origin:*),
// shuning uchun to'g'ridan-to'g'ri client'dan olinadi. localStorage'da kunlik cache:
// bir kalendar kunida faqat 1 marta yangilanadi (kurslar kunlik chiqadi).
const CBU_URL = 'https://cbu.uz/uz/arkhiv-kursov-valyut/json/';
const CACHE_KEY = 'cbu_rates_v1';

export default {
  name: 'CurrencyRates',
  data() {
    return { usd: null, rub: null };
  },
  computed: {
    items() {
      const out = [];
      if (this.usd) out.push(this.format('USD', this.usd, 0));
      if (this.rub) out.push(this.format('RUB', this.rub, 2));
      return out;
    },
    cbuDate() {
      return (this.usd && this.usd.Date) || (this.rub && this.rub.Date) || '';
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    format(ccy, c, decimals) {
      const rate = Number(c.Rate) || 0;
      const diff = Number(c.Diff) || 0; // kunlik o'zgarish (+ o'sgan / - pasaygan)
      return {
        ccy,
        rate: new Intl.NumberFormat('ru-RU', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(rate),
        diff,
        diffAbs: new Intl.NumberFormat('ru-RU', {
          minimumFractionDigits: 0,
          maximumFractionDigits: decimals === 0 ? 0 : 1,
        }).format(Math.abs(diff)),
        title: `${c.CcyNm_UZ || ccy} · 1 ${ccy} (CBU ${c.Date || ''})`,
      };
    },
    todayKey() {
      const d = new Date();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${d.getFullYear()}-${mm}-${dd}`;
    },
    async load() {
      // 1) Cache'dan darhol ko'rsatamiz (tez render)
      let cached = null;
      try {
        cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
        if (cached) {
          this.usd = cached.usd || null;
          this.rub = cached.rub || null;
        }
      } catch (_) { /* yaroqsiz cache — e'tiborsiz */ }

      // 2) Bugun allaqachon yangilangan bo'lsa — qayta so'rov yo'q
      if (cached && cached.day === this.todayKey()) return;

      // 3) Yangi kurslarni olamiz
      await this.fetchFresh();
    },
    async fetchFresh() {
      try {
        const res = await fetch(CBU_URL, { headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const arr = await res.json();
        if (!Array.isArray(arr)) return;
        const usd = arr.find((x) => x.Ccy === 'USD');
        const rub = arr.find((x) => x.Ccy === 'RUB');
        if (usd) this.usd = usd;
        if (rub) this.rub = rub;
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ usd: this.usd, rub: this.rub, day: this.todayKey() })
        );
      } catch (_) {
        // Tarmoq xatosi — cache bo'lsa o'sha ko'rinadi, aks holda jim yashiriladi
      }
    },
  },
};
</script>
