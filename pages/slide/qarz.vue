<template>
  <div class="news px-10 py-10 rounded bg-white">
    <div @click="$router.go(-1)" class="my-2 mx-6 hidden lg:inline-flex items-center" style="margin-left: -10px;cursor: pointer">
          <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <polyline points="15 6 9 12 15 18" />
          </svg>
          <p class="text-blue-500" style="margin-left: -40px;">{{ $t("back") }}</p>
        </div>
    <div v-if="$i18n.locale == 'uz'">
      <!-- <div @click="$router.go(-1)" class="hidden lg:inline-flex items-center" style="cursor: pointer">
        <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <polyline points="15 6 9 12 15 18" />
        </svg>
        <p class="text-blue-500">{{ $t("mobil.bck") }}</p>
      </div> -->
      <h2 class="font-bold text-3xl text-center">
     
        Qarz
      </h2>
      <div class="flex justify-center mt-8">
        <img src="@/assets/qarz.png" alt="phone" />
      </div>

      <p class="text-justify">
        Bugungi kunda jismoniy va yuridik shaxslar o‘rtasidagi qarz munosabatlari natijasida yuzaga kelayotgan muammolar
        yildan-yilga ortib bormoqda. Qarz munosabatlarida fuqarolar tomonidan shartnomaning yozma shakliga rioya
        qilinmasligi qarz bilan bog‘liq muammolarning yuzaga kelishiga asosiy sabab hisoblanadi.
      </p>
      <p class="text-justify">
        Mazkur muammolarning oldini olish maqsadida jismoniy shaxslarning o‘zaro qarz munosabatlarini elektron tarzda
        ro‘yxatga olish va nazorat qilish tizimi - ZeroX ishlab chiqildi.
      </p>
      <p class="text-justify">
        Jismoniy shaxslar ZeroX mobil ilovasi va zerox.uz sayti orqali qarz shartnomalarini elektron tarzda
        rasmiylashtirishadi.
      </p>
      <p class="text-justify">
        ZeroX – ishonch kafolati.
      </p>
    </div>
    <div v-if="$i18n.locale == 'kr'">
      <h2 class="font-bold text-3xl text-center">
        Қарз
      </h2>
      <div class="flex justify-center mt-8">
        <img src="@/assets/qarz.png" alt="phone" />
      </div>

      <p class="text-justify">
        Бугунги кунда жисмоний ва юридик шахслар ўртасидаги қарз муносабатлари натижасида юзага келаётган муаммолар
        йилдан-йилга ортиб бормоқда. Қарз муносабатларида фуқаролар томонидан шартноманинг ёзма шаклига риоя
        қилинмаслиги қарз билан боғлиқ муаммоларнинг юзага келишига асосий сабаб ҳисобланади.
      </p>
      <p class="text-justify">
        Мазкур муаммоларнинг олдини олиш мақсадида жисмоний шахсларнинг ўзаро қарз муносабатларини электрон тарзда
        рўйхатга олиш ва назорат қилиш тизими - ZeroX ишлаб чиқилди.
      </p>
      <p class="text-justify">
        Жисмоний шахслар ZeroX мобил иловаси ва zerox.uz сайти орқали қарз шартномаларини электрон тарзда
        расмийлаштиришади.
      </p>
      <p class="text-justify">
        ZeroX – ишонч кафолати.
      </p>
    </div>
    <div v-if="$i18n.locale == 'ru'">
      <h2 class="font-bold text-3xl text-center">
        Долг
      </h2>
      <div class="flex justify-center mt-8">
        <img src="@/assets/qarz.png" alt="phone" />
      </div>

      <p class="text-justify">
        В настоящее время проблемы, возникающие в результате долговых отношений между физическими и юридическими лицами,
        с каждым годом увеличиваются. Основной причиной возникновения проблем, связанных с долгами, является
        несоблюдение гражданами письменной формы договора в долговых отношениях.
      </p>
      <p class="text-justify">
        С целью предотвращения этих проблем была разработана система электронного учета и контроля долговых отношений
        физических лиц - ZeroX.
      </p>
      <p class="text-justify">
        Физические лица оформляют договоры займа в электронном виде через мобильное приложение ZeroX и сайт zerox.uz.
      </p>
      <p class="text-justify">
        ZeroX - гарант доверия.
      </p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
p {
  text-indent: 40px;
}
</style>
