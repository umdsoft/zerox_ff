<template>
  <div>
    <!-- Type: registration (25) - Ro'yxatdan o'tish -->
    <!-- Type: password-reset (26) - Parol tiklash -->

    <div v-if="$i18n.locale == 'uz'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700">
          <b v-if="isRegistration">Tizimda ro'yxatdan o'tilganligi to'g'risida</b>
          <b v-else>Foydalanuvchi parolining qayta tiklanganligi to'g'risida</b>
        </p>
        <p class="mt-2">
          <template v-if="isRegistration">
            Tabriklaymiz! Siz tizimda muvaffaqiyatli ro'yxatdan o'tdingiz va tizim funksiyalaridan to'liq foydalanish
            imkoniga ega bo'ldingiz. Sizdan tizimga kirish parolini esda saqlashingizni va uni boshqa shaxslarga oshkor
            qilmasligingizni so'raymiz.
          </template>
          <template v-else>
            Siz MyID orqali qayta identifikatsiyadan o'tgan holda parolingizni tikladingiz. Ushbu jarayonda
            "UZINFOCOM Davlat axborot tizimlarini yaratish va qo'llab-quvvatlash bo'yicha yagona integrator" MCHJ
            tomonidan xizmat haqi olinishi sababli mobil hisobingizdan <b>2 500 UZS</b> yechildi.
          </template>
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time?.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">Ok</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'kr'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700">
          <b v-if="isRegistration">Тизимда рўйхатдан ўтилганлиги тўғрисида</b>
          <b v-else>Фойдаланувчи паролининг қайта тикланганлиги тўғрисида</b>
        </p>
        <p class="mt-2">
          <template v-if="isRegistration">
            Табриклаймиз! Сиз тизимда муваффақиятли рўйхатдан ўтдингиз ва тизим функцияларидан тўлиқ фойдаланиш имконига
            эга бўлдингиз. Сиздан тизимга кириш паролини эсда сақлашингизни ва уни бошқа шахсларга ошкор қилмаслигингизни
            сўраймиз.
          </template>
          <template v-else>
            Сиз MyID орқали қайта идентификациядан ўтган ҳолда паролингизни тикладингиз. Ушбу жараёнда
            "UZINFOCOM Давлат ахборот тизимларини яратиш ва қўллаб-қувватлаш бўйича ягона интегратор" МЧЖ
            томонидан хизмат ҳақи олиниши сабабли мобил ҳисобингиздан <b>2 500 UZS</b> ечилди.
          </template>
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time?.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">Ok</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$i18n.locale == 'ru'">
      <div v-if="$auth.user.id === item.reciver">
        <p class="text-gray-700">
          <b v-if="isRegistration">О регистрации в системе</b>
          <b v-else>О восстановлении пароля пользователя</b>
        </p>
        <p class="mt-2">
          <template v-if="isRegistration">
            Поздравляем! Вы успешно зарегистрировались в системе и получили полный доступ к функциям системы. Мы просим
            Вас запомнить пароль для входа в систему и не раскрывать его другим лицам.
          </template>
          <template v-else>
            Ваш пароль восстановлен после повторной идентификации через MyID. В процессе восстановления с вашего
            мобильного счета списано <b>2 500 сум</b> за услуги ООО «УЗИНФОКОМ - Единый интегратор по созданию и
            поддержке государственных информационных систем».
          </template>
        </p>
        <div class="notification-actions">
          <div>
            <span><b>{{ $t("comp.time") }}:</b> {{ item.created }} {{ item?.time?.slice(0, 5) }}</span>
          </div>
          <div class="notification-actions__buttons">
            <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">Ok</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notificationMixin from '~/mixins/notificationMixin';

export default {
  name: 'Infocom',
  mixins: [notificationMixin],

  props: {
    type: {
      type: String,
      default: 'registration', // 'registration' | 'password-reset'
      validator: (v) => ['registration', 'password-reset'].includes(v)
    }
  },

  computed: {
    isRegistration() {
      return this.type === 'registration';
    }
  }
};
</script>
