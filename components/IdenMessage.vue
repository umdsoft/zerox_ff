<template>
  <div class="message" style="">
    <div class="card show">
      <div class="card_header">
        <svg @click="removeIdenModal" style="margin: 2rem 30px 15px 0; cursor: pointer" class="h-6 w-6 text-black"
          width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
          stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>

      <div class="card_content px-10">
        <span v-if="$i18n.locale == 'uz'">Hurmatli foydalanuvchi, siz identifikatsiyadan o‘tmaganligingiz sababli
          tizimning asosiy funksiyalaridan foydalana olmaysiz. Iltimos, tizimdan to‘liq foydalanish uchun quyidagi
          havola orqali mobil ilovani yuklab oling va identifikatsiyadan o‘ting.</span>
        <span v-if="$i18n.locale == 'kr'">Ҳурматли фойдаланувчи, сиз идентификациядан ўтмаганлигингиз сабабли тизимнинг
          асосий функцияларидан фойдалана олмайсиз. Илтимос, тизимдан тўлиқ фойдаланиш учун қуйидаги ҳавола орқали мобил
          иловани юклаб олинг ва идентификациядан ўтинг.</span>
        <span v-if="$i18n.locale == 'ru'">Уважаемый пользователь, вы не можете использовать основные функции системы,
          потому что не прошли идентификацию. Пожалуйста, загрузите мобильное приложение по ссылке ниже и пройдите
          идентификацию, чтобы в полной мере использовать систему.</span>
      </div>

      <div class="card__footer mt-6">


       <div class="market">
          <div class="market-box flex justify-between mb-8">
            <div class="w-full max-w-xs flex flex-col items-center">
              <div class="flex justify-center">
                <img src="@/assets/qr.png" alt="QR Code" width="200px" height="200px" />
              </div>
              <div class="flex justify-center mt-2">
                <a href="https://play.google.com/store/apps/details?id=com.zeroxuz" target="_blank"><img src="@/assets/img/googlePlayBtn.svg" alt="" /></a>
                <a href="https://apps.apple.com/uz/app/zerox/id6446497826" target="_blank"> <img src="@/assets/img/appstoreBtn.svg" alt="" class="pl-2" /></a>
              </div>
            </div>



          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "idenMessage",

  methods: {
    toIdentification() {
      this.removeIdenModal();
      this.$router.push(this.localePath({ name: 'identification' }));
    },

    removeIdenModal() {
      this.$emit("removeIdenModal");
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.527);
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
}

.card {
  width: 550px;
  border-radius: 6px;
  transition: all easy 0.5s;
  height: 500px;
  transition: all 0.3s ease;
  text-align: center;
  opacity: 0;
  margin-top: 4rem;
  background: white;
}

.card__footer {
  display: flex;

  align-items: flex-end;
  justify-content: center;
}

.card_header {
  display: flex;
  justify-content: flex-end;
}

.show {
  opacity: 1;
}
</style>
