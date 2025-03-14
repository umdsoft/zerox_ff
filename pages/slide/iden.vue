<template>
  <div class="news px-10 py-10 rounded bg-white">
    <div v-if="$i18n.locale == 'uz'">
      <h2 class="font-bold text-3xl text-center">
        Identifikatsiya
      </h2>
      <div class="flex justify-center mt-8">
        <img src="@/assets/myid.png" alt="phone" />
      </div>

      <p class="text-justify">
        ZeroX tizimida jismoniy shaxslar MyID identifikatsiya tizimi orqali identifikatsiyadan o’tishadi.
      </p>
      <p class="text-justify">
        Bunda jismoniy shaxslar ro‘yxatdan o‘tish jarayonida o’zlari tomonidan kiritilgan hamda MyID identifikatsiya
        tizimi orqali tizimga yuklangan shaxsiy ma’lumotlar orqali identifikatsiya qilinadi va mazkur ma’lumotlar
        ularning o‘zi tomonidan tasarruf qilinadi.
      </p>
      <p class="text-justify">
        Tizim jismoniy shaxslarga tegishli shaxsiy ma’lumotlarning maxfiyligini va ularning roziligisiz ushbu
        ma’lumotlar boshqa shaxslarga oshkor qilinmasligini ta’minlaydi.
      </p>
      <p class="text-justify">
        Shuningdek, jismoniy shaxslarning shaxsiy ma’lumotlari va tizimda foydalanuvchilar tomonidan shakllantirilgan
        qarz bilan bog’liq ma’lumotlardan foydalanish tartibi ommaviy ofertada belgilanadi.
      </p>
      <p class="text-justify">
        ZeroX – ishonch kafolati.
      </p>
    </div>
    <div v-if="$i18n.locale == 'kr'">
      <h2 class="font-bold text-3xl text-center">
        Идентификация
      </h2>
      <div class="flex justify-center mt-8">
        <img src="@/assets/myid.png" alt="phone" />
      </div>

      <p class="text-justify">
        ZeroX тизимида жисмоний шахслар MyID идентификация тизими орқали идентификациядан ўтишади.
      </p>
      <p class="text-justify">
        Бунда жисмоний шахслар рўйхатдан ўтиш жараёнида ўзлари томонидан киритилган ҳамда MyID идентификация тизими
        орқали тизимга юкланган шахсий маълумотлар орқали идентификация қилинади ва мазкур маълумотлар уларнинг ўзи
        томонидан тасарруф қилинади.
      </p>
      <p class="text-justify">
        Тизим жисмоний шахсларга тегишли шахсий маълумотларнинг махфийлигини ва уларнинг розилигисиз ушбу маълумотлар
        бошқа шахсларга ошкор қилинмаслигини таъминлайди.
      </p>
      <p class="text-justify">
        Шунингдек, жисмоний шахсларнинг шахсий маълумотлари ва тизимда фойдаланувчилар томонидан шакллантирилган қарз
        билан боғлиқ маълумотлардан фойдаланиш тартиби оммавий офертада белгиланади.
      </p>
      <p class="text-justify">
        ZeroX – ишонч кафолати.
      </p>
    </div>
    <div v-if="$i18n.locale == 'ru'">
      <h2 class="font-bold text-3xl text-center">
        Идентификация
      </h2>
      <div class="flex justify-center mt-8">
        <img src="@/assets/myid.png" alt="phone" />
      </div>

      <p class="text-justify">
        В системе ZeroX физические лица проходят идентификацию через систему идентификации MyID.
      </p>
      <p class="text-justify">
        При этом физические лица идентифицируются по персональным данным, введенным ими в процессе регистрации и
        загруженным в систему через систему идентификации MyID, и эти данные находятся в их собственном распоряжении.
      </p>
      <p class="text-justify">
        Система обеспечивает конфиденциальность персональных данных, относящихся к физическим лицам, и гарантирует
        неразглашение этих данных другим лицам без их согласия.
      </p>
      <p class="text-justify">
        Также порядок использования персональных данных физических лиц и информации о задолженности, сформированной
        пользователями в системе, определяется публичной офертой.
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
