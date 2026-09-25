<template>
  <!-- SS2-2 (2026-09-20): "Qanday ishlaydi" — kabinet ichidagi alohida sahifa.
       Ilgari `/#how-it-works` public landing sahifasiga olib chiqib ketardi. -->
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
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{{ texts.howItWorks.title }}</h1>
      <p class="text-base text-gray-600 max-w-2xl mx-auto">{{ texts.howItWorks.description }}</p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div
        v-for="(step, i) in texts.howItWorks.steps"
        :key="i"
        class="relative text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
      >
        <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">{{ i + 1 }}</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ step.title }}</h3>
        <p class="text-gray-600 text-sm leading-relaxed">{{ step.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QandayIshlaydiPage',
  head() {
    return { title: this.texts.howItWorks.title + ' — ZeroX' };
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
        // SS-DEV (2026-09-26): en/kaa
        en: {
            features: {
              title: "Why ZeroX?",
              description: "The most reliable solution for formalising and managing loan agreements",
              items: [
                { title: "Official agreement", desc: "Every lending transaction is formalised with an electronic agreement." },
                { title: "Two-sided confirmation", desc: "Both the lender and the borrower must confirm the agreement." },
                { title: "Debt history", desc: "Review the borrower's debt history before formalising an agreement." },
                { title: "Debtor list", desc: "Quickly find a borrower or lender via the debtor list and QR code." },
                { title: "Due-date reminders", desc: "Automatic notifications when the repayment date approaches. You will never forget." },
                { title: "Mobile app", desc: "Mobile apps for iOS and Android. Conclude agreements from anywhere." }
              ]
            },
            howItWorks: {
              title: "How does it work?",
              description: "Formalise your loan agreement in 3 simple steps",
              steps: [
                { title: "Sign up", desc: "Register with your phone number and verify your identity." },
                { title: "Create an agreement", desc: "Create an agreement as a lender or borrower. Enter the loan amount and repayment date." },
                { title: "Confirm", desc: "The other party confirms the agreement, and it takes effect!" }
              ]
            },
        },
        kaa: {
            features: {
              title: "Ne ushın ZeroX?",
              description: "Qarız shártnamaların rásmiylestiriw hám basqarıwda eń isenimli sheshim",
              items: [
                { title: "Rásmiy shártnama", desc: "Hár bir qarız alıs-beris procesi elektron shártnama menen rásmiylestiriledi." },
                { title: "Eki tárepleme tastıyıqlaw", desc: "Qarız beriwshi hám qarız alıwshınıń ekewi de shártnamanı tastıyıqlawı kerek." },
                { title: "Qarız tariyxı", desc: "Shártnama rásmiylestiriwden aldın qarız alıwshınıń qarız tariyxı menen tanısıp shıǵıń." },
                { title: "Qarızdarlar dizimi", desc: "Qarızdarlar dizimi hám QR-kod arqalı qarız alıwshı yamasa qarız beriwshini tez tabıń." },
                { title: "Múddetli eslatpalar", desc: "Qarızdı qaytarıw múddeti jaqınlasqanda avtomat bildiriw. Hesh qashan umıtpaysız." },
                { title: "Mobil qosımsha", desc: "iOS hám Android ushın mobil qosımshalar. Qálegen jerden shártnama dúziń." }
              ]
            },
            howItWorks: {
              title: "Qalay isleydi?",
              description: "3 ápiwayı qádemde qarız shártnamańızdı rásmiylestiriń",
              steps: [
                { title: "Dizimnen ótiń", desc: "Telefon nomerińiz arqalı dizimnen ótiń hám shaxsıńızdı tastıyıqlań." },
                { title: "Shártnama dúziń", desc: "Qarız beriwshi yamasa qarız alıwshı sıpatında shártnama jaratıń. Qarız muǵdarı hám qaytarıw múddetin kiritiń." },
                { title: "Tastıyıqlań", desc: "Ekinshi tárep shártnamanı tastıyıqlaydı hám sonıń menen shártnama kúshke kiredi!" }
              ]
            },
        },
      };
      const base = t[l] || t.uz;
      const back = { uz: 'Orqaga', ru: 'Назад', kr: 'Орқага', en: 'Back', kaa: 'Artqa' }[l] || 'Orqaga'; // SS-DEV (2026-09-26): en/kaa
      return Object.assign({ back }, base);
    },
  },
};
</script>
