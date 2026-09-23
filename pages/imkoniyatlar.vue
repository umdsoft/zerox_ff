<template>
  <!-- SS2-2 (2026-09-20): "Imkoniyatlar" — ilgari footerdagi havola PUBLIC landing
       sahifasiga (`/#features`) to'liq qayta yuklanish bilan o'tardi va foydalanuvchi
       shaxsiy kabinetdan CHIQIB ketardi. Endi bu kabinet ichidagi alohida sahifa:
       chap menyu, tepadagi panel va sessiya joyida qoladi. -->
  <div class="pb-8">
    <div class="mb-6">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        @click="$router.back()"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        {{ texts.back }}
      </button>
    </div>

    <div class="text-center mb-10">
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{{ texts.features.title }}</h1>
      <p class="text-base text-gray-600 max-w-2xl mx-auto">{{ texts.features.description }}</p>
    </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[0].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[0].desc }}</p>
        </div>

        <!-- Feature 2 -->
        <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[1].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[1].desc }}</p>
        </div>

        <!-- Feature 3 -->
        <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[2].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[2].desc }}</p>
        </div>

        <!-- Feature 4 -->
        <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[3].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[3].desc }}</p>
        </div>

        <!-- Feature 5 -->
        <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[4].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[4].desc }}</p>
        </div>

        <!-- Feature 6 -->
        <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
            <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ texts.features.items[5].title }}</h3>
          <p class="text-gray-600">{{ texts.features.items[5].desc }}</p>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'ImkoniyatlarPage',
  head() {
    return { title: this.texts.features.title + ' — ZeroX' };
  },
  computed: {
    texts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz';
      const t = {
        uz: {
            features: {
              title: "Nima uchun ZeroX?",
              description: "Qarz shartnomalarini rasmiylashtirish va boshqarishda eng ishonchli yechim",
              items: [
                { title: "Rasmiy shartnoma", desc: "Har bir qarz oldi-berdi jarayoni elektron shartnoma bilan rasmiylashtiriladi." },
                { title: "Ikki tomonlama tasdiqlash", desc: "Qarz beruvchi va qarz oluvchining ikkalasi ham shartnomani tasdiqlashi kerak." },
                { title: "Qarz tarixi", desc: "Shartnoma rasmiylashtirishdan oldin qarz oluvchining qarz tarixi bilan tanishib chiqing." },
                { title: "Qarzdorlar ro'yxati", desc: "Qarzdorlar ro'yxati va QR-kod orqali qarz oluvchi yoki qarz beruvchini tezda toping." },
                { title: "Muddatli eslatmalar", desc: "Qarzni qaytarish muddati yaqinlashganda avtomatik bildirishnoma. Hech qachon unutmaysiz." },
                { title: "Mobil ilova", desc: "iOS va Android uchun mobil ilovalar. Istalgan joydan shartnoma tuzing." }
              ]
            },
            howItWorks: {
              title: "Qanday ishlaydi?",
              description: "3 ta oddiy qadamda qarz shartnomangizni rasmiylashtiring",
              steps: [
                { title: "Ro'yxatdan o'ting", desc: "Telefon raqamingiz orqali ro'yxatdan o'ting va shaxsingizni tasdiqlang." },
                { title: "Shartnoma tuzing", desc: "Qarz beruvchi yoki qarz oluvchi sifatida shartnoma yarating. Qarz miqdori va qaytarish muddatini kiriting." },
                { title: "Tasdiqlang", desc: "Ikkinchi tomon shartnomani tasdiqlaydi va shu bilan shartnoma kuchga kiradi!" }
              ]
            },
        },
        ru: {
            features: {
              title: "Почему ZeroX?",
              description: "Самое надёжное решение для оформления и управления договорами займа",
              items: [
                { title: "Официальный договор", desc: "Каждая долговая операция оформляется электронным договором." },
                { title: "Двустороннее подтверждение", desc: "Договор должен быть подтвержден обеими сторонами — и заимодавцем, и заемщиком." },
                { title: "Долговая история", desc: "Перед оформлением договора ознакомьтесь с долговой историей заемщика." },
                { title: "Список должников", desc: "Используйте список должников или QR-код для быстрого поиска заемщика или заимодавца." },
                { title: "Напоминания о сроках", desc: "Автоматическое уведомление о приближении срока возврата долга. Никогда не забудете." },
                { title: "Мобильное приложение", desc: "Приложения для iOS и Android. Оформляйте договоры займа где угодно." }
              ]
            },
            howItWorks: {
              title: "Как это работает?",
              description: "Оформите договор займа всего за 3 простых шага",
              steps: [
                { title: "Зарегистрируйтесь", desc: "Зарегистрируйтесь по номеру телефона и подтвердите вашу личность." },
                { title: "Создайте договор", desc: "Создайте договор как заимодавца или заемщика. Укажите сумму займа и срок возврата." },
                { title: "Подтвердите", desc: "Вторая сторона подтверждает договор и договор вступает в силу!" }
              ]
            },
        },
        kr: {
            features: {
              title: "Нима учун ZeroX?",
              description: "Қарз шартномаларини расмийлаштириш ва бошқаришда энг ишончли ечим",
              items: [
                { title: "Расмий шартнома", desc: "Ҳар бир қарз олди-берди жараёни электрон шартнома билан расмийлаштирилади." },
                { title: "Икки томонлама тасдиқлаш", desc: "Қарз берувчи ва қарз олувчининг иккаласи ҳам шартномани тасдиқлаши керак." },
                { title: "Қарз тарихи", desc: "Шартнома расмийлаштиришдан олдин қарз олувчининг қарз тарихи билан танишиб чиқинг." },
                { title: "Қарздорлар рўйхати", desc: "Қарздорлар рўйхати ва QR-код орқали қарз олувчи ёки қарз берувчини тезда топинг." },
                { title: "Муддатли эслатмалар", desc: "Қарзни қайтариш муддати яқинлашганда автоматик билдиришнома. Ҳеч қачон унутмайсиз." },
                { title: "Мобил илова", desc: "iOS ва Android учун мобил иловалар. Исталган жойдан шартнома тузинг." }
              ]
            },
            howItWorks: {
              title: "Қандай ишлайди?",
              description: "3 та оддий қадамда қарз шартномангизни расмийлаштиринг",
              steps: [
                { title: "Рўйхатдан ўтинг", desc: "Телефон рақамингиз орқали рўйхатдан ўтинг ва шахсингизни тасдиқланг." },
                { title: "Шартнома тузинг", desc: "Қарз берувчи ёки қарз олувчи сифатида шартнома яратинг. Қарз миқдори ва қайтариш муддатини киритинг." },
                { title: "Тасдиқланг", desc: "Иккинчи томон шартномани тасдиқлайди ва шу билан шартнома кучга киради!" }
              ]
            },
        },
      };
      const base = t[l] || t.uz;
      const back = { uz: 'Orqaga', ru: 'Назад', kr: 'Орқага' }[l] || 'Orqaga';
      return Object.assign({ back }, base);
    },
  },
};
</script>
