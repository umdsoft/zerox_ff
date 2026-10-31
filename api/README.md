# api/ — yupqa endpoint o'ramalari (wave-1)

- Har bir funksiya `$axios` (yoki `$api`) ni BIRINCHI argument sifatida oladi va axios promise'ni **o'zgartirmay** qaytaradi
  (`async` emas, qo'shimcha `try/catch` yo'q) — chaqiruvchi sahifa xatoni avvalgidek o'zi ushlaydi.
- `$get` (data qaytaradi) va `get` (to'liq response) — sahifada qanday bo'lsa, shunday saqlangan.
- URL satrlari, `silent` va boshqa config sahifadagi bilan aynan bir xil. `config` berilmasa, axios'ga 2-argument
  `undefined` uzatiladi (avvalgi chaqiruvga teng).
- `services/api.js` (`$api`) keshlaydigan URL'lar (masalan `/finance/expenses/categories`) bu yerda xom (raw) qoldirilgan:
  kesh semantikasi (TTL, invalidatsiya) farq qilgani uchun.
