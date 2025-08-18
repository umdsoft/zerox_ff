<template>
  <div>
    <div class="bottom-box mt-6 px-4 bg-white rounded-xl mb-1">
      <div class="flex flex-col-reverse md:flex-row lg:flex-row items-center justify-between">
        <div class="bottom-left flex-1 py-4">
          <div class="text-bottom flex">
            <p class="text-xl font-bold text-t_black mr-1">
              ZeroX
            </p>
          </div>
          <p class="text-lg font-normal text-t_black mt-3 leading-tight">
            {{ $t("home.comfurt") }}
          </p>
          <p class="text-lg font-normal text-t_black leading-tight">
            {{ $t("home.sped") }}
          </p>


        </div>
        <div>
          <div class="bottom-left mt-4">
            <img width="90%" height="70%" src="@/assets/img/phone_1.png" alt="" />
          </div>

        </div>
      </div>

      <div class="pb-3 mt-4 flex justify-between">
        <div class="social_icons mx-auto flex" style="margin-left: 0px">

          <a href="https://instagram.com/zeroxuz"><img src="@/assets/img/instagram_icon.svg" alt="" class="p-2" /></a>

          <a href="https://t.me/ZeroxUZ">
            <img src="@/assets/img/telegram_logo.svg" alt="" class="p-2" /></a>

          <a href="https://youtube.com/channel/UCanYHFqJPnWAz-l162Aof4w"><img src="@/assets/img/youtube_icon.svg" alt=""
              class="p-2" /></a>

          <a href="https://www.facebook.com/ZeroxUZ/"><img src="@/assets/img/facebookIcon.svg" alt="" class="p-2" /></a>
          <a href="https://mobile.twitter.com/zeroxuz/"><img src="@/assets/img/twitter_icon.svg" alt=""
              class="p-2" /></a>
        </div>

        <div class="mr-20">
          <p>©2022-2025. {{ $t("a1.a85") }}.</p>
          <p>{{ $t("a1.a84") }}: <a href="mailto:info@zerox.uz">info@zerox.uz</a></p>
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

div.cent {
  padding-bottom: 10px;
  width: 100%;
  display: grid;
  justify-content: center;
}

div.market {
  max-width: 310px;
}
</style>
