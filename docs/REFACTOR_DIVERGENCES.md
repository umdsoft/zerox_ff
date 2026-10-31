# Wave-1 refactor: farq qiladigan nusxalar (O'ZGARTIRILMAGAN)

Quyidagi formatlovchilar bir-biriga o'xshaydi, lekin xatti-harakati farq qiladi (xarakterlash testlari:
`tests/formatConsolidation.test.js`, `tests/helpersFormat.test.js`). Wave-1 ularni birlashtirmadi.
Vaqt mintaqasi testlarda `Asia/Tashkent` (+5) ga qotirilgan.

## utils/format.js — "bir xil nom, boshqa xatti-harakat"

| Funksiya | Farq |
|---|---|
| `formatters.formatAmount` (= `format.formatAmountRaw`) vs `helpers.formatNumber` | birinchisi `toString()` + regex: `''` -> `''`, `'abc'` -> `'abc'`; ikkinchisi `parseFloat`: ikkalasi ham `'0'` |
| `formatters.formatDate` (= `format.formatDateLocalIso`) vs `helpers.formatDate` | birinchisi MAHALLIY vaqt (`dateformat`), ikkinchisi UTC getter'lar, noto'g'ri sana -> `''` |
| `formatters.getRelativeTime` (= `format.relativeTimeLabel`) vs `helpers.getRelativeTime` | "Bugun/Kecha/N hafta oldin/sana" vs "Hozirgina/N daqiqa/soat oldin" |
| `Vue.prototype.beautySum` (= `format.beautySum`) vs `helpers.formatNumber` | `parseInt` — kasr qismi tushib qoladi (`'1234.9'` -> `'1 234'`) |
| `Vue.prototype.dateBeauty` (= `format.dateBeauty`) vs `helpers.fmtDMY` | `dateformat` mahalliy vaqt, xatoda `''`; `fmtDMY` bo'sh uchun `'—'`, parse bo'lmasa asl qiymat |
| `debtPlan.fmtSum` vs `helpers.formatMoney` | yaxlitlaydi va manfiy uchun U+2212 (`−`) ishlatadi |
| `debtPlan.groupDigits` / `cleanMoney` | kiritish maydoni uchun (kasr saqlanadi) — boshqalar bilan MOS EMAS |

## Sahifalardagi local nusxalar (almashtirilmadi)

| Fayl | Funksiya | Nima uchun almashtirilmadi |
|---|---|---|
| `pages/finance/gap/index.vue`, `gap/_id.vue` | `fmtDate` | ALMASHTIRILDI -> `format.fmtIsoSliceDMY` (ikki nusxa matritsada bir xil). `fmtDMY` bilan esa FARQ: `2026-09-24T20:00:00Z` -> `24.09.2026` (slice) vs `25.09.2026` (`fmtDMY`, +5) |
| `components/notification_types/gap-invite.vue` | `fmtDate` | regex prefiks; mos kelmasa `String(d)`. `2026-9-4` -> o'zgarishsiz (gap `fmtDate` esa `4.9.2026`) |
| `pages/price/index.vue` | `fmtDate` | bo'sh/noto'g'ri -> `'—'` (`fmtDMY` noto'g'ri qiymatni qaytaradi); `new Date(value)` (UTC-parse) |
| `pages/price/index.vue` | `formatPrice(n)` | `n.toString()` — `null` da xato tashlaydi |
| `pages/mobil-hisob/index.vue` | `formatPrice(value)` | raqamsiz belgilarni tozalaydi (`'12.5'` -> `'125'`) — boshqacha mazmun |
| `pages/user/index.vue` | `fmt` | `toLocaleString('uz-UZ')` — brauzer/ICU'ga bog'liq |
| `pages/finance/analytics/index.vue`, `goals/index.vue` | `formatMoney(value, short, currency)` | `toLocaleString`; ikkalasi ham bir-biridan farq qiladi (analytics: K/M, goals: faqat M) |
| `pages/finance/debts/group/_key.vue` vs `pages/finance/debts/_id.vue` | `formatDateTime` | ikkalasi `+5h` siljitadi; `_id` soniyani ham chiqaradi, `_key` chiqarmaydi |
| `pages/finance/goals/index.vue` | `formatDateTime` | `toLocaleDateString('uz-UZ', { timeZone: 'Asia/Tashkent' })` |
| `components/qarz-daftari/KvitansiyaView.vue` | `formatDateTime(d, createdAt)` | `created_at` bilan bir kunda bo'lsa soat:daqiqa qo'shadi |
| `pages/active-device/index.vue` | `formatDateTime` | `parseDateSafe` bo'lmasa `'—'` |
| `pages/financial-health/index.vue` | `fmt` | 1 xonali o'nlik, `en` dan boshqa tillarda vergul |
| `helpers.formatDateLocale` ishlatuvchilar | — | `toLocaleDateString('uz-UZ')` — ICU'ga bog'liq |

## Aniqlangan mavjud xatolar (o'zgartirilmadi, test bilan qotirilgan)

- `debtPlan.fmtMln(120000000, 'uz')` -> `'12 mln'` (kutilgan `'120 mln'`): `abs >= 1e8` da `toFixed(0)` dan keyin
  `.replace(/\.?0+$/, '')` butun sondagi nollarni ham olib tashlaydi (`'120'` -> `'12'`).
- `helpers.contractPdfUrl` `$config` qabul qilmaydi (`pdfScript(name)` config'siz) — muhitni `window.$nuxt.$config` dan oladi.
  SPA'da (ssr:false) ishlaydi; `pdfLink(file, params, $config)` esa `$config` ni aniq uzatadi.

## Bajarilmagan / keyingi to'lqin

- `$t(...) || '...'` — alohida shaklli 9 ta qoldi (ternary yoki `||` zanjiri / boshqa operator qo'shni): ro'yxat
  hisobotda. Boshqa 120 tasi (barcha 5 tilda bo'sh bo'lmagan satr) olib tashlandi.
- ~200 ta xom `this.$axios` chaqiruvi (`api/` ga ko'chirilmagan sahifalar); `api/{billing,user,notifications,qarzDaftari}.js`
  hozircha ulanmagan.
- Qo'sh toast, qo'lda yozilgan modallar, 800+ qatorli sahifalar — keyingi to'lqin.
