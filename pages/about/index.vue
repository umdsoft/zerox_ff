<template>
  <div class="bg-white rounded py-4">
    <h1 class="font-mono-serif text-3xl text-center mt-8">
      {{ $t("menu.about") }}
    </h1>

    <p style="text-align: justify" class="font-mono-serif py-10 px-8">
      Barcha xizmatlarni saytdan, mobil ilovasidan, yoki shunchaki sutkalik
      aloqa markaziga qo‘ng‘iroq qilib olish mumkin. Biz aynan shunday
      konsepsiyani tanladik, chunki u bugungi kunda o‘zini to‘liq oqlay oladi.
      Mamlakat aholisi yanada mobilroq bo‘lib qoldi, raqamli texnologiyalardan
      foydalanishni va ko‘pgina xizmatlarni masofadan va dunyoning istalgan
      nuqtasidan sutka davomida olishni afzal ko‘radi. Shaharda bizning odatiy
      bo‘limlarimiz yo‘q, biz mamlakat bo‘ylab millionlab qurilmalarda
      erishimlimiz. Har bir mijozga nisbatan individual yondashuvni saqlab va
      ma‘lumotlarga ishlov berishda xavfsizlikni kafolatlab, har qanday so‘rovga
      maksimal operativ tarzda ishlov berish uchun biz ulkan sa‘y-harakatlar
      qildik. Barcha xizmatlarni saytdan, mobil ilovasidan, yoki shunchaki
      sutkalik aloqa markaziga qo‘ng‘iroq qilib olish mumkin. Biz aynan shunday
      konsepsiyani tanladik, chunki u bugungi kunda o‘zini to‘liq oqlay oladi.
      Mamlakat aholisi yanada mobilroq bo‘lib qoldi, raqamli texnologiyalardan
      foydalanishni va ko‘pgina xizmatlarni masofadan va dunyoning istalgan
      nuqtasidan sutka davomida olishni afzal ko‘radi. Shaharda bizning odatiy
      bo‘limlarimiz yo‘q, biz mamlakat bo‘ylab millionlab qurilmalarda
      erishimlimiz. Har bir mijozga nisbatan individual yondashuvni saqlab va
      ma‘lumotlarga ishlov berishda xavfsizlikni kafolatlab, har qanday so‘rovga
      maksimal operativ tarzda ishlov berish uchun biz ulkan sa‘y-harakatlar
      qildik. Barcha xizmatlarni saytdan, mobil ilovasidan, yoki shunchaki
      sutkalik aloqa markaziga qo‘ng‘iroq qilib olish mumkin. Biz aynan shunday
      konsepsiyani tanladik, chunki u bugungi kunda o‘zini to‘liq oqlay oladi.
      Mamlakat aholisi yanada mobilroq bo‘lib qoldi, raqamli texnologiyalardan
      foydalanishni va ko‘pgina xizmatlarni masofadan va dunyoning istalgan
      nuqtasidan sutka davomida olishni afzal ko‘radi. Shaharda bizning odatiy
      bo‘limlarimiz yo‘q, biz mamlakat bo‘ylab millionlab qurilmalarda
      erishimlimiz. Har bir mijozga nisbatan individual yondashuvni saqlab va
      ma‘lumotlarga ishlov berishda xavfsizlikni kafolatlab, har qanday so‘rovga
      maksimal operativ tarzda ishlov berish uchun biz ulkan sa‘y-harakatlar
      qildik. Barcha xizmatlarni saytdan, mobil ilovasidan, yoki shunchaki
      sutkalik aloqa markaziga qo‘ng‘iroq qilib olish mumkin. Biz aynan shunday
      konsepsiyani tanladik, chunki u bugungi kunda o‘zini to‘liq oqlay oladi.
      Mamlakat aholisi yanada mobilroq bo‘lib qoldi, raqamli texnologiyalardan
      foydalanishni va ko‘pgina xizmatlarni masofadan va dunyoning istalgan
      nuqtasidan sutka davomida olishni afzal ko‘radi. Shaharda bizning odatiy
      bo‘limlarimiz yo‘q, biz mamlakat bo‘ylab millionlab qurilmalarda
      erishimlimiz. Har bir mijozga nisbatan individual yondashuvni saqlab va
      ma‘lumotlarga ishlov berishda xavfsizlikni kafolatlab, har qanday so‘rovga
      maksimal operativ tarzda ishlov berish uchun biz ulkan sa‘y-harakatlar
      qildik.
    </p>
  </div>
</template>

<script>
export default {
  middleware:'auth',
  created() {
    let links = [{ title: "Biz haqimizda", name: "about" }];
    this.$store.commit("changeBreadCrumb", links);
  },
};
</script>
