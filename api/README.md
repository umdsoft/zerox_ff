# api/ — yupqa endpoint o'ramalari (wave-1)

- Har bir funksiya `$axios` (yoki `$api`) ni BIRINCHI argument sifatida oladi va axios promise'ni **o'zgartirmay** qaytaradi
  (`async` emas, qo'shimcha `try/catch` yo'q) — chaqiruvchi sahifa xatoni avvalgidek o'zi ushlaydi.
- `$get` (data qaytaradi) va `get` (to'liq response) — sahifada qanday bo'lsa, shunday saqlangan.
- URL satrlari, `silent` va boshqa config sahifadagi bilan aynan bir xil. `config` berilmasa, axios'ga 2-argument
  `undefined` uzatiladi (avvalgi chaqiruvga teng).
- `services/api.js` (`$api`) keshlaydigan URL'lar (masalan `/finance/expenses/categories`) bu yerda xom (raw) qoldirilgan:
  kesh semantikasi (TTL, invalidatsiya) farq qilgani uchun.

## Wave B ulanishi
- `billing.getSubscription`, `user.getMe`, `notifications.getMyNotifications`, `qarzDaftari.listShops/getDashboard` sahifalarga ulandi
  (config bayt-ma-bayt avvalgidek: `silent`, `background`, `falseLoading`, `params`).

## Wave C: xom `$axios` ko'chirildi
- `api/` dan tashqarida (va `plugins/`, `services/api.js` dan tashqari) xom `$axios.<method>(...)` chaqiruvi QOLMADI (169 ta chaqiruv).
  Yangi modullar: `debtPlan.js`, `home.js`, `publicPages.js`; mavjudlariga qo'shildi: `billing`, `contracts`, `finance`, `notifications`, `qarzDaftari`, `user`.
- Funksiya imzosi: `(axios, ...urlParametrlar, [data], [config])`; `$get`/`get`, URL, config, `await` tartibi sahifadagidek. Bir xil URL+metodning
  `get` (to'liq response) varianti `...Response` qo'shimchasi bilan alohida (`$get` — data).
- Hujjatlangan ISTISNOLAR (xom `$axios` shunday qoladi / dinamik URL):
  - `services/api.js` — `$api` keshlash qatlami (149 chaqiruv, TTL/invalidatsiya shu yerda); `plugins/*` — interceptor/telegram-autologin.
  - `publicPages.getSearchByUrl` — URL literali chaqiruvchidan keladi (`SearchComponent` `url` prop) — dinamik passthrough.
- Tekshiruv: `node scripts/compareApiUrls.js` (har fayl: HEAD URL literallari == yangi fayl + import qilingan api funksiyalari literallari) va
  `tests/apiModules.test.js` (har funksiya: bitta chaqiruv, metod + URL + argument tartibi `tests/fixtures/apiCalls.json` bilan qotirilgan).
