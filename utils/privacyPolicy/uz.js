/**
 * ZeroX — Maxfiylik siyosati (o'zbek, lotin — ASOSIY matn).
 * Manba: "ZeroX" tizimidan foydalanish to'g'risidagi Ommaviy oferta (18.07.2025), O'zbekiston
 * Respublikasining "Shaxsga doir ma'lumotlar to'g'risida"gi O'RQ-547-son Qonuni va Tizimning
 * amaldagi funksiyalari (backend, sayt, mobil ilova, Telegram bot — 30.09.2026 holatiga).
 * Matnlar faqat interpolatsiya bilan chiqariladi (v-html yo'q).
 * Bo'lim bloklari: { p: 'matn' } — xatboshi, { list: ['...'] } — ro'yxat.
 * ⚠️ Bo'limlar soni, id'lari va bloklar tuzilishi 5 tilda (uz, ru, kr, en, kaa) BIR XIL bo'lishi shart.
 */
export default {
  docLabel: 'MAXFIYLIK SIYOSATI',
  title: "“ZeroX” tizimida shaxsga doir ma'lumotlarni qayta ishlash va himoya qilish to'g'risida",
  effectiveLabel: 'Kuchga kirgan sana',
  effectiveDate: '30.09.2026',
  operatorLabel: 'Operator',
  operator: '“ZEROX” MCHJ',
  tocTitle: 'MUNDARIJA',
  print: 'Chop etish',
  toTop: 'Yuqoriga',
  offerLink: 'Ommaviy oferta',
  homeLink: 'Bosh sahifa',
  intro: [
    "Mazkur Maxfiylik siyosati (keyingi o'rinlarda — “Siyosat”) “ZEROX” MCHJ (keyingi o'rinlarda — “Jamiyat”) tomonidan www.zerox.uz internet sayti, “ZeroX” mobil ilovasi (Android, iOS) va ZeroX Telegram boti (birgalikda — “Tizim”) orqali foydalanuvchilarning shaxsga doir ma'lumotlarini yig'ish, qayta ishlash, saqlash, himoya qilish va uchinchi shaxslarga berish tartibini belgilaydi.",
    "Siyosat O'zbekiston Respublikasining “Shaxsga doir ma'lumotlar to'g'risida”gi (O'RQ-547-son), “Axborotlashtirish to'g'risida”gi, “Elektron tijorat to'g'risida”gi qonunlari, boshqa amaldagi qonunchilik hujjatlari hamda “ZeroX” tizimidan foydalanish to'g'risidagi Ommaviy oferta (keyingi o'rinlarda — “Oferta”) asosida ishlab chiqilgan va Ofertaning ajralmas qismi hisoblanadi.",
    "Siyosat Tizim funksiyalaridan kelib chiqib tuzilgan: har bir funksiya (ro'yxatdan o'tish, MyID identifikatsiyasi, qarz shartnomalari, “Qarz daftari”, “Shaxsiy qarz”, “Shaxsiy moliya”, “Gap”, Telegram bot, to'lovlar, bildirishnomalar va boshqalar) bo'yicha qanday ma'lumotlar, qaysi maqsadda va qanday asosda qayta ishlanishi, kimga berilishi va qancha muddat saqlanishi alohida bo'limlarda bayon etilgan.",
  ],
  sections: [
    {
      id: 'pp1',
      title: '1. Umumiy qoidalar',
      blocks: [
        { p: "1.1. Siyosat Tizimda ro'yxatdan o'tgan yoki Tizimdan foydalanayotgan barcha jismoniy va yuridik shaxslarga (keyingi o'rinlarda — “Foydalanuvchi”) nisbatan qo'llaniladi." },
        { p: "1.2. Foydalanuvchi Tizimda ro'yxatdan o'tish jarayonida o'z mobil telefon raqamini kiritib, SMS orqali yuborilgan tasdiqlash kodini kiritgan paytdan boshlab mazkur Siyosat bilan tanishganligini va uning shartlarini to'liq qabul qilganligini, shuningdek o'z shaxsga doir ma'lumotlarini Siyosatda ko'rsatilgan maqsadlarda va tartibda qayta ishlashga rozilik berganligini tasdiqlaydi." },
        { p: "1.3. Ixtiyoriy funksiyalar (MyID identifikatsiyasi, Telegram bot, “Oila” byudjeti, “Gap”, ovozli xabarlar, geolokatsiya va boshqalar) bo'yicha rozilik Foydalanuvchi ushbu funksiyani o'zi ishga tushirgan paytda beriladi. Qarz shartnomasi funksiyalaridan foydalanish uchun Foydalanuvchi qo'shimcha ravishda Ofertani alohida tasdiqlaydi." },
        { p: "1.4. Foydalanuvchi Siyosat shartlariga rozi bo'lmasa, Tizimda ro'yxatdan o'tmasligi va undan foydalanmasligi lozim." },
        { p: "1.5. Siyosatda qo'llanilgan, lekin alohida izohlanmagan atamalar Oferta va O'zbekiston Respublikasi qonunchiligida belgilangan ma'nolarda qo'llaniladi. 3–14-bo'limlarda har bir funksiya bo'yicha ma'lumotlar tarkibi va maqsadlari, 15–21-bo'limlarda esa barcha funksiyalar uchun umumiy qoidalar bayon etilgan." },
      ],
    },
    {
      id: 'pp2',
      title: '2. Asosiy tushunchalar',
      blocks: [
        {
          list: [
            "Shaxsga doir ma'lumotlar — muayyan jismoniy shaxsga taalluqli bo'lgan yoki uni identifikatsiya qilish imkonini beradigan, elektron tarzda, qog'ozda va (yoki) boshqa moddiy jismda qayd etilgan axborot;",
            "Sub'yekt — shaxsga doir ma'lumotlar o'ziga taalluqli bo'lgan jismoniy shaxs;",
            "Mulkdor va operator — shaxsga doir ma'lumotlar bazasini egallovchi va ularni qayta ishlovchi “ZEROX” MCHJ;",
            "Qayta ishlash — shaxsga doir ma'lumotlarni yig'ish, tizimlashtirish, saqlash, o'zgartirish, to'ldirish, ulardan foydalanish, ularni berish, tarqatish, uzatish, egasizlantirish va yo'q qilish bo'yicha amallar majmui;",
            "Uchinchi shaxs — Jamiyat va Foydalanuvchidan tashqari har qanday shaxs;",
            "Kontragent — qarz shartnomasi, qarz daftari, shaxsiy qarz yoki boshqa yozuvda Foydalanuvchi bilan o'zaro munosabatda ko'rsatilgan boshqa shaxs;",
            "Transchegaraviy uzatish — shaxsga doir ma'lumotlarni O'zbekiston Respublikasi hududidan tashqaridagi shaxslarga yoki xizmatlarga uzatish;",
            "Egasizlantirish — ma'lumotlarni muayyan shaxsga tegishliligini aniqlab bo'lmaydigan holatga keltirish;",
            "Tizim — www.zerox.uz sayti, “ZeroX” mobil ilovasi, ZeroX Telegram boti va Telegram Mini App.",
          ],
        },
      ],
    },
    {
      id: 'pp3',
      title: "3. Ro'yxatdan o'tish, Tizimga kirish va sessiyalar",
      blocks: [
        { p: "3.1. Ro'yxatdan o'tish va Tizimga kirishda quyidagilar qayta ishlanadi:" },
        {
          list: [
            "mobil telefon raqami — hisobning asosiy identifikatori. Unga bir martalik tasdiqlash kodi SMS orqali yuboriladi; SMS xabarlar “Eskiz” (eskiz.uz) SMS provayderi orqali yetkaziladi va provayderga faqat telefon raqami hamda xabar matni uzatiladi;",
            "bir martalik tasdiqlash kodi — faqat telefon raqamini tasdiqlash uchun ishlatiladi va qisqa muddat amal qiladi;",
            "parol — faqat bcrypt algoritmi bilan olingan qaytarib bo'lmaydigan xesh ko'rinishida saqlanadi; asl parolni Jamiyat xodimlari ham ko'ra olmaydi;",
            "Tizimdagi ichki ID raqami, interfeys tili, ro'yxatdan o'tgan sana va hisob holati;",
            "yuridik shaxslar uchun (mobil ilovada “E-imzo” elektron raqamli imzo kaliti orqali) — tashkilot nomi, STIR, rahbarning F.I.Sh., manzil va aloqa telefon raqami.",
          ],
        },
        { p: "3.2. Sessiyalar va “Ulangan qurilmalar”. Tizimga kirilganda qisqa muddatli kirish tokeni (JWT, odatda 30 daqiqa) va yangilash tokeni (7 kungacha) beriladi. Har bir sessiya bo'yicha qurilma va brauzer ma'lumoti (user-agent: qurilma modeli, operatsion tizim, brauzer), IP-manzil, kirish manbai (sayt, ilova, Telegram Mini App), sessiya yaratilgan va oxirgi faollik vaqti saqlanadi. Foydalanuvchi “Ulangan qurilmalar” bo'limida faol sessiyalarini ko'rishi, istalgan qurilmadagi sessiyani yoki joriydan boshqa barcha sessiyalarni tugatishi mumkin; tugatilgan sessiya darhol amal qilishdan to'xtaydi." },
        { p: "3.3. Kirishlar tarixi va xavfsizlik jurnallari. Har bir kirishda IP-manzil, qurilma nomi, sana va vaqt hamda IP-manzil bo'yicha taxminiy aniqlangan hudud (shahar, viloyat) qayd etiladi; hududni aniqlash uchun IP-manzil tashqi “ip-api.com” xizmatiga yuboriladi (16- va 17-bo'limlar). Muvaffaqiyatsiz kirish urinishlari va so'rovlar chastotasi (rate limit) hisobni parolni tanlab topish va suiiste'molliklardan himoya qilish uchun qayd etiladi." },
        { p: "3.4. Parolni tiklash va telefon raqamini o'zgartirish SMS orqali yuborilgan tasdiqlash kodi bilan amalga oshiriladi. Mobil ilovadagi PIN-kod va biometrik kirish (barmoq izi, Face ID) faqat Foydalanuvchi qurilmasining o'zida tekshiriladi; biometrik ma'lumotlar Jamiyatga uzatilmaydi." },
        { p: "3.5. Maqsad — hisobni yaratish va yuritish, Foydalanuvchini autentifikatsiya qilish, ruxsatsiz kirishning oldini olish. Asos — Foydalanuvchi roziligi va Ofertani bajarish zarurati. Telefon raqamisiz Tizimdan foydalanish imkonsiz." },
      ],
    },
    {
      id: 'pp4',
      title: '4. Shaxsni identifikatsiya qilish (MyID)',
      blocks: [
        { p: "4.1. Qarz shartnomalarini rasmiylashtirish va boshqa yuridik ahamiyatga ega amallar uchun jismoniy shaxs “MyID” davlat identifikatsiya tizimi (UZINFOCOM) orqali identifikatsiyadan o'tadi. Yuz tasviri orqali biometrik tekshiruv (jonlilikni aniqlash va pasport ma'lumotlari bilan solishtirish) to'liq “MyID” tomonida amalga oshiriladi: Jamiyat yuz tasvirini (selfi, video) olmaydi va saqlamaydi. MyID Jamiyatga tekshiruv natijasini va quyidagi ma'lumotlarni taqdim etadi:" },
        {
          list: [
            "familiya, ism, otasining ismi;",
            "tug'ilgan sana, jinsi, millati va fuqaroligi;",
            "jismoniy shaxsning shaxsiy identifikatsiya raqami (JShShIR);",
            "pasport (ID karta) seriyasi va raqami, berilgan sanasi, kim tomonidan berilgani va amal qilish muddati;",
            "doimiy ro'yxatdan o'tgan manzili (viloyat, tuman, manzil).",
          ],
        },
        { p: "4.2. Ushbu ma'lumotlar Foydalanuvchi profilida saqlanadi va qarz shartnomalari, dalolatnomalar hamda boshqa hujjatlarda tomonni aniqlash uchun ishlatiladi (5-bo'lim). Bitta JShShIR faqat bitta hisobga bog'lanishi mumkin. Identifikatsiyadan so'ng F.I.Sh. rasmiy hisoblanadi va Foydalanuvchi tomonidan qo'lda tahrirlanmaydi; pasport ma'lumotlari faqat qayta “MyID” tekshiruvi orqali yangilanadi." },
        { p: "4.3. Har bir MyID sessiyasi bo'yicha audit yozuvi yuritiladi: sessiya identifikatori, amaliyot turi, natija holati va kodi, JShShIR, pasport seriyasi va raqami, tug'ilgan sana, IP-manzil, sana va vaqt. Sessiyani aniq shaxsga bog'lash uchun MyID'ga JShShIR va tug'ilgan sana yuborilishi mumkin. Bu yozuvlar identifikatsiya jarayonining qonuniyligini isbotlash va firibgarlikning oldini olish uchun saqlanadi." },
        { p: "4.4. MyID'dan o'tmagan Foydalanuvchi shaxsiy qarz hujjatlarida (kvitansiya, SMS) ko'rsatilishi uchun o'z F.I.Sh.ini bir marta o'zi kiritishi mumkin; bunday ma'lumot davlat tizimi orqali tasdiqlanmagan hisoblanadi va identifikatsiyadan so'ng MyID ma'lumotlari bilan almashtiriladi." },
        { p: "4.5. Asos — Foydalanuvchi roziligi (identifikatsiyani o'zi boshlaydi) va qarz shartnomasini tuzish uchun zarurat (Oferta 2.3–2.4-bandlari). Identifikatsiyadan o'tmagan Foydalanuvchi qarz shartnomasi funksiyalaridan foydalana olmaydi, Tizimning boshqa bo'limlaridan esa foydalanishi mumkin." },
      ],
    },
    {
      id: 'pp5',
      title: '5. Qarz shartnomalari',
      blocks: [
        { p: "5.1. Foydalanuvchilar o'rtasida elektron qarz shartnomasi tuzilganda quyidagi ma'lumotlar qayta ishlanadi:" },
        {
          list: [
            "tomonlar (qarz beruvchi va qarz oluvchi): F.I.Sh., jinsi, pasport ma'lumotlari, JShShIR, manzili, telefon raqami, Tizimdagi ID raqami; yuridik shaxs uchun — nomi, STIR va rahbari;",
            "shartnoma shartlari: summa, valyuta, berilgan va qaytarish sanalari, shartnoma raqami va holati, tuzilgan, tasdiqlangan va yopilgan vaqtlar;",
            "shartnoma bo'yicha amallar va dalolatnomalar: qarzni to'liq yoki qisman qaytarish, muddatni uzaytirish, qaytarishni talab qilish, qarzdan to'liq yoki qisman voz kechish, ularning tasdiqlanishi yoki rad etilishi, qoldiq summa va sanalar;",
            "ommaviy ofertani tasdiqlaganlik belgisi va tasdiqlangan vaqt — qarz shartnomasi amallari faqat ofertani tasdiqlagan Foydalanuvchiga ochiladi;",
            "kontragentni topish ma'lumotlari: kontragent Tizimdagi ID raqami va tug'ilgan sanasi (yuridik shaxs uchun — STIR) bo'yicha qidiriladi, natijada faqat uning F.I.Sh. (nomi) ko'rsatiladi.",
          ],
        },
        { p: "5.2. Shartnoma, dalolatnomalar va ilova hujjatlar PDF ko'rinishida Jamiyatning o'z PDF-xizmati tomonidan shakllantiriladi. Hujjatda tomonlarning yuqoridagi rekvizitlari aks etadi, hujjatni tekshirish uchun QR-kod joylashtirilishi mumkin. PDF-xizmat ma'lumotlarni faqat himoyalangan server-server kanali orqali va faqat hujjat uchun zarur maydonlar hajmida oladi (parol, balans, tokenlar hech qachon berilmaydi)." },
        { p: "5.3. Shartnoma tuzilishi, tasdiqlanishi, har bir so'rov va dalolatnoma haqida ikkinchi tomonga Tizim ichidagi bildirishnoma, push-bildirishnoma, Telegram xabari (bot ulangan bo'lsa) va ayrim hollarda SMS yuboriladi. Xabarda so'rov yuborgan tomonning F.I.Sh., summa va sanalar ko'rsatiladi." },
        { p: "5.4. Shartnomalar bo'yicha qaytarish intizomi asosida Foydalanuvchining Status (reyting) ko'rsatkichi avtomatik hisoblanadi (Oferta 4.1.18-bandi). Boshqa Foydalanuvchilarga faqat Oferta 4.2.5 va 8.2.1-bandlarida belgilangan umumlashtirilgan ma'lumot (Status, debitor va kreditor qarzdorliklarining, shu jumladan muddati o'tgan qarzlarning umumiy summasi) ko'rsatilishi mumkin; qarzlar kim bilan rasmiylashtirilgani oshkor qilinmaydi." },
        { p: "5.5. Maqsad — qarz munosabatlarini elektron shaklda rasmiylashtirish, saqlash va tomonlarga taqdim etish (Oferta 2.2, 4.2.1-bandlari). Asos — shartnomani tuzish va bajarish zarurati, Foydalanuvchi roziligi va qonunchilik talablari. Shartnomalar yuridik ahamiyatga ega hujjat sifatida 18-bo'limda ko'rsatilgan muddatlarda saqlanadi." },
      ],
    },
    {
      id: 'pp6',
      title: "6. “Qarz daftari” va “Nasiya”",
      blocks: [
        { p: "6.1. “Qarz daftari” savdo faoliyati yurituvchi Foydalanuvchiga (do'kon egasiga) mijozlarga nasiyaga berilgan tovarlar va qarzlarni hisobga olish imkonini beradi. Qayta ishlanadigan ma'lumotlar:" },
        {
          list: [
            "savdo faoliyati (do'kon): nomi, viloyati va tumani; ixtiyoriy ravishda — qarzni qaytarish uchun plastik karta raqami va karta egasining ismi, to'lov haqida xabar olish uchun Telegram telefon raqami;",
            "mijozlar (qarz oluvchilar): F.I.Sh. va telefon raqami — ularni do'kon egasi yoki uning xodimi kiritadi;",
            "qarz yozuvlari: summa, valyuta, tovar yoki izoh, berilgan va qaytarish sanalari, bo'lib to'lash jadvali, to'lovlar, qoldiq, holat (aktiv, yopilgan, voz kechilgan) va amallar tarixi;",
            "xodimlar: F.I.Sh., telefon raqami, parol xeshi (bcrypt), taklif tokenining xeshi, faollik holati; xodim faqat o'zi biriktirilgan do'kon ma'lumotlarini ko'radi va uning har bir amali xodim identifikatori bilan qayd etiladi;",
            "mijozlar shikoyatlari: shikoyat sababi, izohi, sanasi, shikoyatchining F.I.Sh. va telefon raqami.",
          ],
        },
        { p: "6.2. SMS xabarnomalar. Do'kon egasining tarifi va SMS paketiga ko'ra mijozga “Eskiz” orqali SMS yuboriladi: qarz rasmiylashtirilgani, to'lov qabul qilingani, qaytarish kuni eslatmasi (avtomatik, har bir mijozga bitta jamlangan eslatma) va qarzni qaytarish talabi. Talab SMS'ida do'kon nomi, do'kon egasi kiritgan karta raqami va Telegram telefon raqami ko'rsatiladi. Yuborilgan SMS'lar tarixi (qabul qiluvchi telefoni, matn, turi, holati, vaqti) do'kon egasining hisobida saqlanadi." },
        { p: "6.3. Mijozning o'z qarzini ko'rishi. Agar mijoz ko'rsatilgan telefon raqami bilan Tizimda ro'yxatdan o'tgan bo'lsa, u o'z hisobida ushbu do'kondagi qarzini (do'kon nomi, summa, sanalar, to'lovlar) ko'radi va noto'g'ri yozuv bo'yicha shikoyat yuborishi mumkin. Shikoyat do'kon egasiga Tizim ichidagi bildirishnoma va (Telegram ulangan bo'lsa) Telegram xabari sifatida shikoyatchining F.I.Sh. va telefon raqami bilan birga yetkaziladi." },
        { p: "6.4. “Nasiya” bo'limida (tarif doirasida) do'kon egasi nasiya savdo mijozlari to'g'risida F.I.Sh., telefon va qo'shimcha telefon, manzil, ish joyi, kafilning F.I.Sh. va telefoni, rasm, kredit limiti va izohlarni, shuningdek tovarlar, nasiya shartnomalari va to'lovlar haqidagi ma'lumotlarni kiritishi mumkin." },
        { p: "6.5. Ushbu bo'limda mijozlar, kafillar va xodimlar ma'lumotlarini do'kon egasi kiritadi va ularning qonuniy kiritilishi hamda zarur roziliklar olinishi uchun javobgar hisoblanadi (21-bo'lim). Jamiyat bu ma'lumotlarni faqat funksiyani ta'minlash maqsadida qayta ishlaydi. Qarz daftari ma'lumotlarini eksport qilish (Excel, PDF) faqat do'kon egasi tomonidan amalga oshiriladi. Asos — do'kon egasi bilan Oferta bo'yicha shartnomani bajarish zarurati." },
      ],
    },
    {
      id: 'pp7',
      title: "7. “Shaxsiy qarz”",
      blocks: [
        { p: "7.1. Foydalanuvchi o'zi bergan yoki olgan shaxsiy qarzlarni hisobga olishi mumkin. Qayta ishlanadigan ma'lumotlar:" },
        {
          list: [
            "kontragent: Foydalanuvchi kiritgan ism (F.I.Sh.) va telefon raqami, qarz manbai turi (bank, oila, do'st, ish beruvchi, boshqa);",
            "qarz shartlari: turi (berilgan yoki olingan), summa, valyuta, foiz stavkasi, boshlanish va qaytarish sanalari, qoldiq, holat, izohlar, to'lovlar tarixi;",
            "Foydalanuvchining to'lov rekvizitlari (ixtiyoriy): qarzni qaytarish uchun plastik karta raqami va egasining ismi, Telegram telefon raqami;",
            "qarzdor profillari va to'lov havolalari (tarifga bog'liq funksiya): qarzdor ismi, telefoni, jami va to'langan summalar;",
            "kontragent shikoyatlari: sababi, izohi va sanasi.",
          ],
        },
        { p: "7.2. Kontragentga ko'rinish (“ko'zgu” yozuv). Agar kontragent ko'rsatilgan telefon raqami bilan Tizimda ro'yxatdan o'tgan bo'lsa, yozuv uning hisobida ham aks etadi: u qarzni kiritgan Foydalanuvchining ismini, summani va sanalarni ko'radi, lekin yozuvni o'zgartira olmaydi. Noto'g'ri yozuv bo'yicha u shikoyat yuborishi mumkin; shikoyat qarz egasiga bildirishnoma va Telegram xabari sifatida yetkaziladi." },
        { p: "7.3. SMS va talablar. Foydalanuvchi so'rovi bilan kontragentga “Eskiz” orqali SMS yuborilishi mumkin (qarz qayd etilgani, to'lov, qaytarishni talab qilish). Talab SMS'ida Foydalanuvchining ismi, u kiritgan karta raqami va Telegram telefon raqami (kiritilmagan bo'lsa — hisob telefon raqami) ko'rsatiladi. Bu rekvizitlarni Foydalanuvchi ixtiyoriy ravishda kiritadi va talab yuborish orqali ularning kontragentga oshkor bo'lishiga rozilik beradi." },
        { p: "7.4. Ishonchlilik tavsiyasi. Qarz yozuvini ko'rishda Tizim shu shaxs (telefon raqami yoki ismi) bilan Foydalanuvchining o'zi ilgari qayd etgan qarzlar tarixidan (o'z vaqtida va kechiktirib qaytarilgan qarzlar ulushi) ishonchlilik darajasini (ishonchli, o'rtacha, xavfli) avtomatik hisoblaydi va faqat shu Foydalanuvchiga ko'rsatadi. Boshqa Foydalanuvchilarning yozuvlari hisobga olinmaydi; tavsiya axborot xarakteriga ega, huquqiy oqibat keltirib chiqarmaydi va boshqa shaxslarga berilmaydi." },
        { p: "7.5. Maqsad — shaxsiy qarzlarni hisobga olish, eslatish va kontragent bilan o'zaro hisob-kitobni osonlashtirish. Asos — Foydalanuvchi roziligi va Oferta bo'yicha xizmat ko'rsatish. Kontragent ma'lumotlarini kiritishda 21-bo'lim qoidalari qo'llaniladi." },
      ],
    },
    {
      id: 'pp8',
      title: "8. “Shaxsiy moliya” va “Oila” byudjeti",
      blocks: [
        { p: "8.1. “Shaxsiy moliya” bo'limida Foydalanuvchi kiritgan quyidagi ma'lumotlar qayta ishlanadi:" },
        {
          list: [
            "daromadlar va xarajatlar: summa, valyuta, sana, kategoriya, izoh va manba (qo'lda, chek, Gap, qarz to'lovi va h.k.);",
            "kategoriyalar, byudjetlar va xarajat limitlari, moliyaviy maqsadlar va ularga qo'yilgan mablag'lar;",
            "rejalashtirilgan to'lovlar va kutilayotgan daromadlar hamda ular bo'yicha eslatmalar;",
            "xarid cheklari: Foydalanuvchi skanerlagan fiskal chek QR-kodining parametrlari (terminal raqami, chek raqami, sana, fiskal belgi) Davlat soliq qo'mitasining OFD tizimiga (ofd.soliq.uz) yuboriladi, javobdagi chek ma'lumotlari (savdo nuqtasi, tovarlar, summa, sana) xarajat sifatida saqlanadi;",
            "tahlil va tavsiyalar: Tizim yuqoridagi ma'lumotlar asosida statistika va tavsiyalarni (limit oshgani, xarajatlar o'sgani va h.k.) avtomatik shakllantiradi va faqat Foydalanuvchining o'ziga ko'rsatadi.",
          ],
        },
        { p: "8.2. “Oila” byudjeti. Foydalanuvchi oila a'zosini telefon raqami orqali taklif qilishi mumkin; taklif qilingan shaxs taklifni qabul qilmaguncha hech qanday ma'lumot ulashilmaydi. Taklif qabul qilingach, tanlangan rolga (kuzatuvchi yoki kuzatuvdagi a'zo) ko'ra bir tomon ikkinchi tomonning ruxsat berilgan bo'limlari bo'yicha to'liq yoki umumlashtirilgan ma'lumotlarini ko'radi, oylik va kategoriya bo'yicha limitlar belgilanishi mumkin. Qayta ishlanadi: a'zolarning ID raqami, telefoni, qarindoshlik belgisi, roli, ruxsatlari, limitlari va bog'lanish holati." },
        { p: "8.3. Har bir tomon oila bog'lanishini istalgan vaqtda bekor qilishi mumkin; shundan so'ng ma'lumotlarni ulashish to'xtaydi. Oila bo'yicha bildirishnomalar Tizim ichida va Telegram orqali yuboriladi." },
        { p: "8.4. Maqsad — shaxsiy va oilaviy moliyani hisobga olish, rejalashtirish va tahlil qilish. Asos — Foydalanuvchi roziligi; oila byudjetida — ikkala tomonning roziligi." },
      ],
    },
    {
      id: 'pp9',
      title: "9. “Gap” (navbatli jamg'arma guruhlari)",
      blocks: [
        { p: "9.1. “Gap” funksiyasida tashkilotchi guruh yaratadi va a'zolarni telefon raqami orqali qo'shadi. Qayta ishlanadigan ma'lumotlar:" },
        {
          list: [
            "guruh: nomi, badal summasi va valyutasi, davriylik, boshlanish sanasi, tashkilotchi va a'zolar (ism, telefon raqami, Tizimda hisobi bo'lsa — ID), navbat tartibi va davralar jadvali;",
            "to'lov belgilari: har bir davrada kim to'lagani va kim qabul qilgani; to'lov “to'landi” deb belgilanganda u to'lovchining xarajatlarida va qabul qiluvchining daromadlarida avtomatik aks etadi;",
            "uchrashuv ma'lumotlari: manzil matni, xaritada belgilangan joy (koordinatalar), mablag'ni qabul qilish uchun karta raqami va egasining ismi, a'zolarning “Boraman / Bora olmayman” javoblari;",
            "a'zolarning tug'ilgan kunlari — faqat ular kiritilgan taqdirda, tabriklash uchun;",
            "bog'langan Telegram guruhlari: guruh identifikatori va nomi.",
          ],
        },
        { p: "9.2. Guruh ma'lumotlari (a'zolar ismlari, navbat, to'lov holati, uchrashuv joyi va karta raqami) shu Gap a'zolari va tashkilotchiga ko'rinadi. Tashkilotchi Gap'ni Telegram guruhiga bog'lasa, bot guruhga eslatmalar, navbat, to'lov holati va tabriklarni joylaydi — bu ma'lumotlar Telegram guruhining barcha ishtirokchilariga ko'rinadi." },
        { p: "9.3. Joylashuv. Uchrashuv joyini xaritada tanlash uchun “Yandex Xaritalar” xizmati ishlatiladi; qurilma geolokatsiyasi faqat Foydalanuvchi ruxsat bergan taqdirda va faqat xaritani joriy joyda ochish uchun so'raladi. Fon rejimida joylashuv kuzatilmaydi — faqat Foydalanuvchi tanlagan uchrashuv nuqtasi saqlanadi." },
        { p: "9.4. Maqsad — navbatli jamg'arma guruhini tashkil etish, to'lovlarni hisobga olish va a'zolarni xabardor qilish. Asos — tashkilotchi va a'zolarning roziligi; a'zolarni qo'shayotgan tashkilotchi ularning roziligini olgan bo'lishi kerak (21-bo'lim)." },
      ],
    },
    {
      id: 'pp10',
      title: '10. ZeroX Telegram boti va Mini App',
      blocks: [
        { p: "10.1. Foydalanuvchi Telegram botini o'z hisobiga bog'laganda va undan foydalanganda quyidagilar qayta ishlanadi:" },
        {
          list: [
            "Telegram identifikatori (ID), foydalanuvchi nomi (username), Telegramdagi ismi va bot tili;",
            "Foydalanuvchi “Kontaktni ulashish” tugmasi orqali ixtiyoriy yuborgan telefon raqami — hisobni bog'lash uchun, SMS tasdiqlash kodi bilan;",
            "Mini App PIN-kodi — faqat bcrypt xeshi ko'rinishida saqlanadi; noto'g'ri urinishlar soni va vaqtincha bloklanish muddati; PIN-kodni tiklash SMS kod orqali amalga oshiriladi;",
            "bot orqali kiritilgan yozuvlar (xarajat, daromad, qarz va boshqalar) va yuborilgan xabarlar jurnali (turi, qisqa matni, yuborilgan vaqti);",
            "bot qo'shilgan guruhlar: guruh identifikatori va nomi, guruh a'zolari o'zlari kiritgan tug'ilgan kunlar (Telegram ID va sana).",
          ],
        },
        { p: "10.2. Ovozli xabarlar. Foydalanuvchi botga ovozli xabar yuborib yozuv qo'shsa (funksiya yoqilgan bo'lsa), audio yozuv matnga aylantirish uchun OpenAI kompaniyasining nutqni tanish xizmatiga (Whisper API, AQSh) yuboriladi; olingan matn faqat yozuvni shakllantirish uchun ishlatiladi. Bu funksiyadan foydalanmaslik uchun yozuvni matn ko'rinishida kiritish kifoya." },
        { p: "10.3. Telegram xabarlari Telegram platformasi orqali yetkaziladi va Telegram'ning o'z maxfiylik siyosatiga ham bo'ysunadi. Foydalanuvchi botni istalgan vaqtda to'xtatishi (bloklashi) mumkin; shundan so'ng unga bot orqali xabar yuborilmaydi." },
        { p: "10.4. Maqsad — bot orqali hisob va yozuvlarni boshqarish, bildirishnomalar yuborish va Gap guruhlariga xizmat ko'rsatish. Asos — Foydalanuvchi roziligi (botni o'zi ishga tushiradi va hisobiga bog'laydi)." },
      ],
    },
    {
      id: 'pp11',
      title: "11. To'lovlar, “Mobil hisob” va tariflar",
      blocks: [
        { p: "11.1. Tizimdagi pullik xizmatlar (tariflar, SMS paketlari) “Mobil hisob” balansi orqali to'lanadi. Balans “Payme” va “Click” to'lov tizimlari orqali to'ldiriladi." },
        { p: "11.2. Bank karta rekvizitlari (karta raqami, amal qilish muddati, SMS-kod) faqat to'lov tizimining o'z sahifasida yoki ilovasida kiritiladi va Jamiyatga uzatilmaydi. Jamiyat to'lov tizimidan faqat tranzaksiya identifikatori, summa, holat, yaratilish, bajarilish yoki bekor qilinish vaqti va to'lov qaysi hisobga tegishli ekanligi haqidagi ma'lumotlarni oladi va saqlaydi." },
        { p: "11.3. Shuningdek qayta ishlanadi: balans va uning o'zgarishlari jurnali, boshqa Foydalanuvchiga uning ID raqami bo'yicha o'tkazmalar (summa, jo'natuvchi va qabul qiluvchi), faollashtirilgan tarif, uning muddati va holati, SMS paketlari va SMS qoldig'i, yuborilgan SMS'lar tarixi." },
        { p: "11.4. Maqsad — hisob-kitoblarni amalga oshirish, to'lovlarni tasdiqlash, nizolarni hal qilish, buxgalteriya va soliq hisobini yuritish. Asos — Ofertani bajarish va qonunchilik talablari. Tarif muddati tugashi haqidagi ogohlantirishlar 12-bo'limdagi kanallar orqali yuboriladi." },
      ],
    },
    {
      id: 'pp12',
      title: '12. Bildirishnomalar',
      blocks: [
        { p: "12.1. Tizim Foydalanuvchini quyidagi kanallar orqali xabardor qiladi:" },
        {
          list: [
            "Tizim ichidagi bildirishnomalar — turi, tegishli tomonlar, summa va vaqt Tizim bazasida saqlanadi; sayt yoki ilova ochiq bo'lganda ular real vaqt rejimida (WebSocket ulanishi orqali) yetkaziladi;",
            "push-bildirishnomalar — mobil ilova Google Firebase Cloud Messaging (FCM) xizmatidan qurilma tokenini oladi, token Foydalanuvchi hisobida saqlanadi va bildirishnoma matni FCM orqali qurilmaga yuboriladi;",
            "SMS — “Eskiz” provayderi orqali: tasdiqlash kodlari, qarz va to'lov xabarlari, eslatmalar;",
            "Telegram — bot bog'langan bo'lsa: qarz, Gap, oila va boshqa hodisalar haqidagi xabarlar.",
          ],
        },
        { p: "12.2. Xizmat xabarlari (tasdiqlash kodlari, shartnoma va to'lov bo'yicha xabarlar) Tizimdan foydalanishning ajralmas qismi hisoblanadi. Push-bildirishnomalarni Foydalanuvchi qurilma sozlamalarida, Telegram xabarlarini esa botni to'xtatish orqali o'chirishi mumkin. Reklama xabarlari faqat Foydalanuvchi roziligi bilan yuboriladi (Oferta 11.3-bandi) va ulardan istalgan vaqtda voz kechish mumkin." },
      ],
    },
    {
      id: 'pp13',
      title: "13. Mobil ilova: ruxsatlar va texnik ma'lumotlar",
      blocks: [
        { p: "13.1. Mobil ilova quyidagi ruxsatlarni faqat tegishli funksiyadan foydalanilganda so'raydi; ularni qurilma sozlamalarida istalgan vaqtda bekor qilish mumkin:" },
        {
          list: [
            "kamera — QR-kodlarni (chek, hujjat) skanerlash va “MyID” orqali yuz tekshiruvi uchun (tasvir MyID tomonidan qayta ishlanadi);",
            "joylashuv — faqat “Gap” uchrashuv joyini xaritada tanlashda; fon rejimida kuzatilmaydi;",
            "bildirishnomalar — push-xabarlarni ko'rsatish uchun;",
            "galereya (fotosuratlar) — Foydalanuvchi o'zi tanlagan rasmni biriktirish uchun;",
            "biometriya (barmoq izi, Face ID) — ilovaga kirishni tasdiqlash uchun; tekshiruv faqat qurilmada bajariladi.",
          ],
        },
        { p: "13.2. Texnik ma'lumotlar: IP-manzil, qurilma modeli va nomi, operatsion tizim va uning versiyasi, ilova versiyasi, til sozlamalari, so'rovlar va xatoliklar jurnallari. Ular xavfsizlik, sessiyalarni boshqarish va nosozliklarni bartaraf etish uchun ishlatiladi." },
        { p: "13.3. Ilova ishdan chiqishi (crash) va xatoliklar haqidagi hisobotlar Google Firebase Crashlytics xizmatiga avtomatik yuboriladi: qurilma modeli, operatsion tizim va ilova versiyasi, xatolik tavsifi va vaqti, ilova o'rnatilishining texnik identifikatori. Jamiyat bu hisobotlarga Foydalanuvchining moliyaviy yozuvlari yoki hujjat ma'lumotlarini ataylab kiritmaydi; ular faqat ilova barqarorligini ta'minlash uchun ishlatiladi." },
      ],
    },
    {
      id: 'pp14',
      title: "14. Sayt: cookie fayllari, brauzer xotirasi va analitika",
      blocks: [
        { p: "14.1. Sayt Tizimga kirish sessiyasini (kirish tokeni), tanlangan tilni va interfeys sozlamalarini saqlash uchun cookie fayllari hamda brauzer xotirasidan (localStorage, sessionStorage) foydalanadi. Ushbu zaruriy fayllarsiz shaxsiy kabinet ishlamaydi; ular o'chirilsa, Tizimga qayta kirish talab qilinishi mumkin." },
        { p: "14.2. Saytda quyidagi tashqi xizmatlar ulangan:" },
        {
          list: [
            "“Yandex.Metrika” — tashriflar, sahifalar, havolalar bo'yicha o'tishlar va bosishlar xaritasi statistikasi, shuningdek “Vebvizor” funksiyasi (sahifa bilan ishlash seansini, jumladan kursor harakatlari va sahifani aylantirishni yozib olish);",
            "Google Tag (Google Analytics) — Google'ning teg skripti; u brauzer, qurilma va tashrif haqidagi texnik ma'lumotlarni Google'ga uzatishi mumkin;",
            "Telegram WebApp SDK — sayt Telegram Mini App sifatida ochilganda Telegram bilan o'zaro ishlash uchun.",
          ],
        },
        { p: "14.3. Jamiyat analitika xizmatlariga telefon raqami, F.I.Sh. kabi identifikatsiyalovchi ma'lumotlarni ataylab uzatmaydi va olingan statistikadan umumlashtirilgan ko'rinishda foydalanadi. Bu xizmatlar o'z cookie fayllarini o'rnatadi va ma'lumotlarni O'zbekiston Respublikasidan tashqarida qayta ishlashi mumkin (17-bo'lim). Foydalanuvchi brauzer sozlamalari yoki kuzatuv bloklovchilari orqali analitika cookie fayllarini cheklashi mumkin; bu saytning asosiy funksiyalariga ta'sir qilmaydi." },
      ],
    },
    {
      id: 'pp15',
      title: '15. Qayta ishlash maqsadlari va huquqiy asoslari',
      blocks: [
        { p: '15.1. Umumlashtirilgan maqsadlar:' },
        {
          list: [
            "Foydalanuvchini ro'yxatdan o'tkazish, identifikatsiya va autentifikatsiya qilish, hisobni yuritish;",
            "Tizim funksiyalarini (3–14-bo'limlar) ko'rsatish, shu jumladan qarz shartnomalari va hujjatlarni rasmiylashtirish, saqlash va taqdim etish;",
            "Foydalanuvchining Status (ishonchlilik) ko'rsatkichini shakllantirish (Oferta 4.1.18-bandi);",
            "xabarnomalar yuborish (Tizim ichida, push, SMS, Telegram);",
            "to'lovlar va hisob-kitoblarni amalga oshirish;",
            "Tizim va Foydalanuvchilar xavfsizligini ta'minlash, firibgarlik va suiiste'molliklarning oldini olish;",
            "murojaat va shikoyatlarni ko'rib chiqish, texnik yordam ko'rsatish;",
            "Tizim sifatini yaxshilash uchun egasizlantirilgan statistik tahlil;",
            "qonunchilikda belgilangan majburiyatlarni bajarish;",
            "Foydalanuvchi roziligi bilan Jamiyatning yangi xizmatlari haqida axborot yuborish (Oferta 11.3-bandi).",
          ],
        },
        { p: "15.2. Huquqiy asoslar (O'RQ-547-son Qonun):" },
        {
          list: [
            "sub'yektning roziligi — ro'yxatdan o'tishda tasdiqlash kodini kiritish, Ofertani aksept qilish va ixtiyoriy funksiyalarni o'zi ishga tushirish orqali beriladi;",
            "Oferta va Foydalanuvchilar o'rtasida tuzilgan shartnomalarni tuzish va bajarish zarurati;",
            "O'zbekiston Respublikasi qonunchiligida belgilangan majburiyatlar (buxgalteriya va soliq hisobi, vakolatli organlarning qonuniy so'rovlari va boshqalar);",
            "Tizim va Foydalanuvchilar xavfsizligini ta'minlashdagi qonuniy manfaat.",
          ],
        },
        { p: "15.3. Jamiyat ma'lumotlarni to'plash maqsadlariga mos kelmaydigan yoki ortiqcha hajmda qayta ishlamaydi va Foydalanuvchi roziligisiz ularni boshqa maqsadlarda ishlatmaydi. Status va ishonchlilik ko'rsatkichlari axborot xarakteriga ega; Tizim faqat avtomatlashtirilgan qayta ishlash asosida Foydalanuvchi uchun yuridik oqibatlarga olib keluvchi qarorlar qabul qilmaydi." },
      ],
    },
    {
      id: 'pp16',
      title: "16. Ma'lumotlarni uchinchi shaxslarga berish",
      blocks: [
        { p: "16.1. Jamiyat Foydalanuvchilarning shaxsga doir ma'lumotlarini sotmaydi va reklama maqsadida uchinchi shaxslarga bermaydi." },
        { p: "16.2. Ma'lumotlar faqat quyidagi oluvchilarga va tegishli funksiya uchun zarur hajmda beriladi:" },
        {
          list: [
            "boshqa Foydalanuvchilar — funksiya mohiyatidan kelib chiqib: qarz shartnomasi tomonlariga — shartnoma rekvizitlari; qarz daftari mijoziga va shaxsiy qarz kontragentiga — yozuv, uni kiritgan shaxs yoki do'kon nomi va kiritilgan to'lov rekvizitlari; oila a'zolari va Gap ishtirokchilariga — ruxsat berilgan doirada; barcha Foydalanuvchilarga — Oferta 4.2.5-bandidagi umumlashtirilgan ma'lumot;",
            "“MyID” (UZINFOCOM) — identifikatsiya sessiyasi uchun JShShIR va tug'ilgan sana; “E-imzo” — yuridik shaxsni ro'yxatdan o'tkazishda;",
            "“Eskiz” SMS provayderi — qabul qiluvchi telefon raqami va SMS matni;",
            "“Payme” va “Click” to'lov tizimlari — to'lov summasi va Foydalanuvchi hisobining identifikatori;",
            "Google (Firebase Cloud Messaging, Firebase Crashlytics, Google Tag) — push-token va bildirishnoma matni, ilova xatolik hisobotlari, saytga tashrif texnik ma'lumotlari;",
            "Telegram — bot orqali yuboriladigan xabarlar matni va Telegram identifikatori;",
            "Yandex — sayt analitikasi (Yandex.Metrika) va xaritada joy tanlash (Yandex Xaritalar);",
            "OpenAI — faqat botga ovozli xabar yuborilganda, audio yozuv;",
            "ip-api.com — kirishlar tarixida taxminiy hududni aniqlash uchun IP-manzil;",
            "Davlat soliq qo'mitasining OFD tizimi — skanerlangan chekning fiskal parametrlari;",
            "server, hosting va zaxiralash xizmatlarini ko'rsatuvchi provayderlar — Jamiyat topshirig'i bilan va maxfiylik sharti bilan;",
            "sudlar, huquqni muhofaza qiluvchi va boshqa vakolatli davlat organlari — qonunchilikda nazarda tutilgan hollarda va tartibda (Oferta 4.2.9, 8.2.2-bandlari);",
            "Jamiyat qayta tashkil etilganda — uning huquqiy vorisiga, mazkur Siyosat shartlari saqlangan holda.",
          ],
        },
        { p: "16.3. Xizmat ko'rsatuvchi hamkorlar ma'lumotlarni faqat tegishli xizmatni ko'rsatish uchun qayta ishlaydi. Tashqi xizmatlar (Telegram, Google, Yandex, OpenAI, to'lov tizimlari) ma'lumotlarni o'z maxfiylik siyosatlariga muvofiq ham qayta ishlaydi." },
      ],
    },
    {
      id: 'pp17',
      title: "17. Ma'lumotlarni saqlash joyi va transchegaraviy uzatish",
      blocks: [
        { p: "17.1. O'zbekiston Respublikasi fuqarolarining shaxsga doir ma'lumotlari “Shaxsga doir ma'lumotlar to'g'risida”gi Qonunning 27¹-moddasiga muvofiq O'zbekiston Respublikasi hududida joylashgan serverlardagi Tizimning asosiy ma'lumotlar bazalarida to'planadi, tizimlashtiriladi va saqlanadi." },
        { p: "17.2. Ayrim funksiyalar xorijiy xizmatlar orqali ishlaydi, shu sababli ularga tegishli ma'lumotlar (16.2-bandda ko'rsatilgan hajmda) O'zbekiston Respublikasidan tashqariga uzatiladi yoki xorijda qayta ishlanishi mumkin:" },
        {
          list: [
            "Telegram — Telegram bot, Mini App va Gap guruhlari;",
            "Google — Firebase push-bildirishnomalari, Crashlytics xatolik hisobotlari, Google Tag;",
            "Yandex — Yandex.Metrika va Yandex Xaritalar;",
            "OpenAI (AQSh) — ovozli xabarlarni matnga aylantirish;",
            "ip-api.com — IP-manzil bo'yicha taxminiy hududni aniqlash.",
          ],
        },
        { p: "17.3. Transchegaraviy uzatish faqat tegishli funksiyani ko'rsatish uchun zarur minimal hajmda amalga oshiriladi; asosiy ma'lumotlar bazasining nusxasi xorijga uzatilmaydi. Foydalanuvchi mazkur funksiyalardan (Telegram bot, ovozli xabarlar, push-bildirishnomalar, xaritada joy tanlash) foydalanish orqali tegishli ma'lumotlarning transchegaraviy uzatilishiga rozilik beradi; rozilik bermaslik uchun bu funksiyalardan foydalanmaslik yoki ularni o'chirish mumkin. Sayt analitikasini 14.3-bandda ko'rsatilgan usullar bilan cheklash mumkin." },
      ],
    },
    {
      id: 'pp18',
      title: "18. Saqlash muddatlari va hisobni o'chirish",
      blocks: [
        { p: "18.1. Ma'lumotlar qayta ishlash maqsadlariga erishilgunga qadar va quyidagi muddatlarda saqlanadi:" },
        {
          list: [
            "hisob va profil ma'lumotlari — hisob faol bo'lgan davr mobaynida;",
            "qarz shartnomalari, dalolatnomalar, qarz daftari va shaxsiy qarz yozuvlari — yuridik ahamiyatga ega hujjatlar sifatida Oferta 7.5-bandi va qonunchilikda belgilangan muddatlarda, jumladan majburiyatlar bajarilganidan keyin da'vo muddati davomida;",
            "to'lov tranzaksiyalari va hisob-kitob hujjatlari — buxgalteriya va soliq qonunchiligida belgilangan muddatlarda;",
            "bir martalik SMS kodlar — ishlatilguncha yoki muddati tugaguncha; sessiya tokenlari — amal qilish muddati tugaguncha yoki sessiya tugatilguncha;",
            "kirishlar tarixi, MyID sessiyalari, audit va xavfsizlik jurnallari — xavfsizlikni ta'minlash va nizolarni hal qilish uchun zarur muddat davomida;",
            "Foydalanuvchi o'chirgan yozuvlar (masalan, mijoz yoki qarz yozuvi) — interfeysdan darhol olib tashlanadi, ammo hisob-kitoblar yaxlitligi va boshqa tomonlar huquqlarini himoya qilish uchun ma'lum muddat arxiv holatida saqlanishi mumkin.",
          ],
        },
        { p: "18.2. Hisobni o'chirish. Foydalanuvchi o'z hisobini va shaxsga doir ma'lumotlarini o'chirishni 24-bo'limdagi aloqa kanallari orqali so'rashi mumkin. Jamiyat so'rov yuboruvchining hisob egasi ekanligini tasdiqlaydi va faol yoki tasdiqlanishi kutilayotgan qarz shartnomalari hamda yopilmagan qarz daftari qoldiqlari mavjudligini tekshiradi; bunday majburiyatlar bo'lsa, ular yakunlanguncha hisob o'chirilmaydi." },
        { p: "18.3. So'rov qanoatlantirilganda Foydalanuvchining profil ma'lumotlari o'chiriladi yoki egasizlantiriladi, sessiyalari tugatiladi, push-token va Telegram bog'lanishi o'chiriladi. Boshqa Foydalanuvchilar bilan tuzilgan shartnomalar va hujjatlar, to'lov yozuvlari hamda qonunchilikka ko'ra saqlanishi shart bo'lgan ma'lumotlar boshqa tomonlarning huquqlari bilan bog'liq bo'lgani uchun 18.1-bandda ko'rsatilgan muddatlarda saqlanib qoladi." },
      ],
    },
    {
      id: 'pp19',
      title: "19. Ma'lumotlarni himoya qilish choralari",
      blocks: [
        { p: "19.1. Jamiyat shaxsga doir ma'lumotlarni ruxsatsiz kirish, o'zgartirish, oshkor qilish va yo'q qilishdan himoya qilish uchun huquqiy, tashkiliy va texnik choralarni ko'radi, jumladan:" },
        {
          list: [
            "sayt, ilova va server o'rtasida ma'lumotlarni shifrlangan ulanish (HTTPS/TLS) orqali uzatish;",
            "parollar, Telegram PIN-kodi va xodim parollarini faqat bcrypt xeshi, taklif tokenlarini esa SHA-256 xeshi ko'rinishida saqlash;",
            "qisqa muddatli kirish tokenlari, yangilash tokenlarini aylantirish (rotatsiya) va sessiyani masofadan bekor qilish imkoniyati;",
            "noto'g'ri kirish urinishlari va so'rovlar chastotasini cheklash, PIN-kod urinishlari oshganda vaqtincha bloklash;",
            "har bir so'rovda ma'lumotlarga egalik huquqini tekshirish, xodimlarning faqat o'z do'koni ma'lumotlariga kirishi, ichki xizmatlar (PDF-xizmat) uchun maxfiy kalit bilan himoyalangan kanallar;",
            "karta raqamlari va boshqa maxfiy qiymatlarni tizim jurnallariga yozmaslik, Tizim ma'muriyati amallarini audit jurnalida qayd etish;",
            "ma'lumotlarga kirishni vakolatli xodimlar doirasida cheklash, ularning maxfiylik majburiyati, monitoring va zaxira nusxalash.",
          ],
        },
        { p: "19.2. Foydalanuvchi o'z parolini, PIN-kodini va tasdiqlash kodlarini boshqa shaxslarga oshkor qilmaslik majburiyatini oladi (Oferta 4.1.6, 6.7-bandlari); ular Foydalanuvchi aybi bilan oshkor bo'lishi oqibatlari uchun Jamiyat javobgar emas. Ma'lumotlar xavfsizligi buzilishi aniqlanganda Jamiyat qonunchilikda belgilangan choralarni ko'radi va zarur hollarda Foydalanuvchilarni xabardor qiladi." },
      ],
    },
    {
      id: 'pp20',
      title: '20. Foydalanuvchining huquqlari',
      blocks: [
        { p: "20.1. Foydalanuvchi (sub'yekt) “Shaxsga doir ma'lumotlar to'g'risida”gi Qonunga muvofiq quyidagi huquqlarga ega:" },
        {
          list: [
            "o'z shaxsga doir ma'lumotlari qayta ishlanayotgani, ularning tarkibi, maqsadlari, manbalari, oluvchilari va saqlash muddatlari to'g'risida ma'lumot olish;",
            "o'z ma'lumotlari bilan tanishish — ularning aksariyati shaxsiy kabinetda ko'rinadi, qolganlari so'rov bo'yicha taqdim etiladi;",
            "noto'g'ri yoki eskirgan ma'lumotlarni tuzatish va yangilashni talab qilish (MyID orqali olingan ma'lumotlar qayta identifikatsiya orqali yangilanadi);",
            "ma'lumotlarni o'chirish, egasizlantirish yoki qayta ishlashni cheklashni talab qilish (18-bo'lim doirasida);",
            "qayta ishlashga bergan roziligini qaytarib olish — bunda tegishli funksiyalar yoki Tizim xizmatlarini ko'rsatish qisman yoki to'liq imkonsiz bo'lishi mumkin;",
            "reklama xabarlari va ixtiyoriy bildirishnomalardan voz kechish, ixtiyoriy funksiyalarni (Telegram bot, oila byudjeti, Gap, geolokatsiya) o'chirish;",
            "o'z huquqlari buzilgan deb hisoblasa, shaxsga doir ma'lumotlar sohasidagi vakolatli davlat organiga yoki sudga murojaat qilish.",
          ],
        },
        { p: "20.2. Ayrim huquqlarni Foydalanuvchi mustaqil amalga oshirishi mumkin: “Ulangan qurilmalar” bo'limida sessiyalarni tugatish, profil va to'lov rekvizitlarini tahrirlash, o'z yozuvlarini o'chirish, oila bog'lanishini bekor qilish, qurilma sozlamalarida ruxsatlarni bekor qilish. Boshqa huquqlarni amalga oshirish uchun 24-bo'limdagi aloqa kanallari orqali murojaat qilinadi; murojaatlar qonunchilikda belgilangan muddatlarda ko'rib chiqiladi." },
      ],
    },
    {
      id: 'pp21',
      title: "21. Foydalanuvchi kiritadigan boshqa shaxslarning ma'lumotlari",
      blocks: [
        { p: "21.1. Foydalanuvchi Tizimga uchinchi shaxslar (qarz daftari mijozlari, shaxsiy qarz kontragentlari, xodimlar, oila a'zolari, Gap ishtirokchilari, nasiya kafillari) ma'lumotlarini kiritganda, bunga ularning roziligini olganligini yoki boshqa qonuniy asosga ega ekanligini tasdiqlaydi va ma'lumotlarning to'g'ri va qonuniy kiritilishi uchun shaxsan javobgar bo'ladi." },
        { p: "21.2. Bunday ma'lumotlar faqat kiritgan Foydalanuvchiga va tegishli funksiya doirasida (masalan, telefon raqami egasiga “ko'zgu” yozuv yoki SMS ko'rinishida) ko'rsatiladi. O'z ma'lumotlari Tizimga uning roziligisiz kiritilgan deb hisoblagan shaxs Tizim ichidagi shikoyat funksiyasi yoki 24-bo'limdagi aloqa kanallari orqali murojaat qilishi mumkin; Jamiyat murojaatni ko'rib chiqib, asosli bo'lsa, ma'lumotlarni qayta ishlashni cheklaydi yoki ularni o'chiradi." },
      ],
    },
    {
      id: 'pp22',
      title: '22. Voyaga yetmaganlar',
      blocks: [
        { p: "Tizim O'zbekiston Respublikasi qonunchiligiga ko'ra to'liq muomala layoqatiga ega shaxslar uchun mo'ljallangan. Jamiyat 18 yoshga to'lmagan shaxslarning ma'lumotlarini ongli ravishda yig'maydi; bunday holat aniqlansa, ma'lumotlar o'chiriladi." },
      ],
    },
    {
      id: 'pp23',
      title: "23. Siyosatga o'zgartirishlar kiritish",
      blocks: [
        { p: "23.1. Jamiyat Siyosatga o'zgartirish va qo'shimchalar kiritish huquqiga ega, jumladan Tizimga yangi funksiyalar qo'shilganda. Yangi tahrir Tizimda (www.zerox.uz/privacy-policy) e'lon qilingan paytdan kuchga kiradi, agar unda boshqacha muddat ko'rsatilmagan bo'lsa." },
        { p: "23.2. Foydalanuvchi huquqlariga daxl qiluvchi muhim o'zgarishlar haqida Jamiyat Oferta 7.4-bandida belgilangan tartibda, kamida 10 (o'n) kun oldin shaxsiy kabinet yoki bildirishnoma orqali xabardor qiladi. O'zgarishlardan keyin Tizimdan foydalanishni davom ettirish yangi tahrirni qabul qilish hisoblanadi." },
      ],
    },
    {
      id: 'pp24',
      title: '24. Aloqa va Jamiyat rekvizitlari',
      blocks: [
        {
          list: [
            '“ZEROX” MCHJ',
            "Yuridik va pochta manzili: O'zbekiston Respublikasi, Xorazm viloyati, Urganch shahri, Tinchlik ko'chasi, 6-uy",
            'STIR: 309 053 853',
            'Sayt: www.zerox.uz',
            'Elektron pochta: info@zerox.uz',
            "Qo'llab-quvvatlash xizmati: Telegram — @ZeroXuzbot",
          ],
        },
        { p: "Shaxsga doir ma'lumotlar bo'yicha murojaatda Tizimdagi ID raqamingizni yoki ro'yxatdan o'tgan telefon raqamingizni ko'rsatish tavsiya etiladi; hisob egasi ekanligingizni tasdiqlash uchun qo'shimcha ma'lumot so'ralishi mumkin." },
      ],
    },
  ],
};
