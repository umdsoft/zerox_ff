<template>
  <div>
    <div class="bottom-box mt-6 px-4 bg-white rounded-xl mb-1">
      <div class="flex flex-col-reverse md:flex-row items-center justify-between">
        <!-- Chap taraf -->
        <div class="bottom-left flex-1 py-4">
          <div class="text-bottom flex">
            <p class="text-xl font-bold text-t_black mr-1">ZeroX</p>
          </div>
          <p class="text-lg font-normal text-t_black mt-3 leading-tight">
            {{ $t("home.comfurt") }}
          </p>
          <p class="text-lg font-normal text-t_black leading-tight">
            {{ $t("home.sped") }}
          </p>
        </div>

        <!-- O‘ng taraf (rasm) -->
        <div>
          <div class="bottom-left mt-4 md:mt-0">
            <img width="90%" height="70%" src="@/assets/img/phone_1.png" alt="" />
          </div>
        </div>
      </div>

      <!-- Pastki qism -->
      <div class="pb-3 mt-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <!-- Iconlar -->
        <div class="social_icons flex justify-center md:justify-start space-x-2 mb-4 md:mb-0">
          <a href="https://instagram.com/zeroxuz">
            <img src="@/assets/img/instagram_icon.svg" alt="" class="p-2" />
          </a>
          <a href="https://t.me/ZeroxUZ">
            <img src="@/assets/img/telegram_logo.svg" alt="" class="p-2" />
          </a>
          <a href="https://youtube.com/channel/UCanYHFqJPnWAz-l162Aof4w">
            <img src="@/assets/img/youtube_icon.svg" alt="" class="p-2" />
          </a>
          <a href="https://www.facebook.com/ZeroxUZ/">
            <img src="@/assets/img/facebookIcon.svg" alt="" class="p-2" />
          </a>
          <a href="https://mobile.twitter.com/zeroxuz/">
            <img src="@/assets/img/twitter_icon.svg" alt="" class="p-2" />
          </a>
        </div>

        <!-- Yozuv -->
        <div class="text-center md:text-center md:mr-40 text-sm text-gray-700">
          <p>©2022-2025. {{ $t("a1.a85") }}.</p>
          <p>
            {{ $t("a1.a84") }}:
            <a href="mailto:info@zerox.uz" class="text-blue-600 hover:underline">
              info@zerox.uz
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "bottom",
};
</script>

<style lang="css" scoped>
div.bottom-box {
  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.06);
}

div.bottom-left {
  max-width: 473px;
}
</style>
