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
        Qarz shartnomasi
      </h2>
      <div class="flex justify-center mt-8">
        <img src="@/assets/shartnoma.png" alt="phone" />
      </div>

      <p class="text-justify">
        Jismoniy shaxslar ZeroX mobil ilovasi va zerox.uz sayti orqali qarz shartnomalarini elektron tarzda
        rasmiylashtirishadi. Natijada, tizimda qarz shartnomalarining bazasi shakllantiriladi. Foydalanuvchilar ushbu
        baza
        ma’lumotlari bilan rozilik asosida tanishgan holda shartnoma rasmiylashtirish yoki rasmiylashtirmaslikni
        mustaqil
        ravishda hal qilish imkoniga ega bo'lishadi.
      </p>
      <p class="text-justify">
        Qarzning qaytarilishi bilan bog‘liq muammolar yuzaga kelgan taqdirda qarz beruvchi ZeroX tizimida
        rasmiylashtirilgan qarz shartnomasi orqali sudga murojaat qilish uchun huquqiy asosga ega bo‘ladi. Bunda
        taraflar
        qarz shartnomasi va unga ilova hujjatlarni sayt yoki mobil ilova orqali elektron shaklda yuklab olishadi va
        keyinchalik ushbu hujjatlardan erkin shaklda foydalanish imkoniga ega bo‘lishadi.
      </p>
      <p class="text-justify">
        ZeroX – ishonch kafolati.
      </p>
    </div>
    <div v-if="$i18n.locale == 'kr'">
      <h2 class="font-bold text-3xl text-center">
        Қарз шартномаси
      </h2>
      <div class="flex justify-center mt-8">
        <img src="@/assets/shartnoma.png" alt="phone" />
      </div>

      <p class="text-justify">
        Жисмоний шахслар ZeroX мобил иловаси ва zerox.uz сайти орқали қарз шартномаларини электрон тарзда
        расмийлаштиришади. Натижада, тизимда қарз шартномаларининг базаси шакллантирилади. Фойдаланувчилар ушбу база
        маълумотлари билан розилик асосида танишган ҳолда шартнома расмийлаштириш ёки расмийлаштирмасликни мустақил
        равишда ҳал қилиш имконига эга бўлишади.
      </p>
      <p class="text-justify">
        Қарзнинг қайтарилиши билан боғлиқ муаммолар юзага келган тақдирда қарз берувчи ZeroX тизимида расмийлаштирилган
        қарз шартномаси орқали судга мурожаат қилиш учун ҳуқуқий асосга эга бўлади. Бунда тарафлар қарз шартномаси ва
        унга илова ҳужжатларни сайт ёки мобил илова орқали электрон шаклда юклаб олишади ва кейинчалик ушбу ҳужжатлардан
        эркин шаклда фойдаланиш имконига эга бўлишади.
      </p>
      <p class="text-justify">
        ZeroX – ишонч кафолати.
      </p>
    </div>
    <div v-if="$i18n.locale == 'ru'">
      <h2 class="font-bold text-3xl text-center">
        Договор займа
      </h2>
      <div class="flex justify-center mt-8">
        <img src="@/assets/shartnoma.png" alt="phone" />
      </div>

      <p class="text-justify">
        Физические лица оформляют договоры займа в электронном виде через мобильное приложение ZeroX и сайт zerox.uz. В
        результате в системе формируется база договоров займа. Пользователи, ознакомившись с данными этой базы на основе
        согласия, могут самостоятельно принять решение об оформлении договора или отказе от него.
      </p>
      <p class="text-justify">
        В случае возникновения проблем, связанных с возвратом займа, заимодавец имеет правовое основание обратиться в
        суд, используя договор займа, оформленный в системе ZeroX. При этом стороны могут скачать договор займа и
        прилагаемые к нему документы в электронном виде через сайт или мобильное приложение и в дальнейшем имеют
        возможность свободно использовать эти документы.
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
