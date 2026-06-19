<template>
  <div v-if="items.length" class="flex items-center gap-2">
    <!-- Kurslar (ixcham — kichik ekranlarda sig'sin) -->
    <div
      v-for="c in items"
      :key="c.ccy"
      class="flex items-center gap-1.5 rounded-lg bg-white bg-opacity-10 px-2 py-1 transition-colors hover:bg-opacity-20"
      :title="c.title"
    >
      <!-- Bayroq (inline SVG — Windows emoji-bayroqni ko'rsatmaydi) -->
      <span class="block h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black ring-opacity-10">
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
      <span class="whitespace-nowrap text-xs font-medium text-white">
        1 {{ c.ccy }} = <span class="font-bold tabular-nums">{{ c.rate }}</span>
        <span class="text-[10px] text-white text-opacity-70">so'm</span>
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
  },
  mounted() {
    this.load();
  },
  methods: {
    format(ccy, c, decimals) {
      const rate = Number(c.Rate) || 0;
      const diff = Number(c.Diff) || 0;
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
        // Sana endi inline ko'rsatilmaydi — tooltip'da qoladi
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
