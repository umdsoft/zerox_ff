<template>
  <!-- 23.10 ("Shaxsiy moliya yangi sayt 22.10", 4-rasm): faol Gap yo'q paytda — bo'lim nima beradi
       (imkoniyatlar ro'yxati) va "mutlaqo bepul" ekanligi. `compact` — tugallangan gaplar bor, faoli yo'q. -->
  <section class="gei bg-white rounded-2xl shadow-sm overflow-hidden" :class="{ 'gei--compact': compact }">
    <div class="gei-top">
      <div class="min-w-0">
        <span class="gei-free">🎁 {{ tx.free }}</span>
        <h3 class="text-xl font-bold text-gray-900 mt-3">{{ compact ? tx.titleNoActive : tx.title }}</h3>
        <p class="text-sm text-gray-500 mt-1 leading-relaxed max-w-2xl">{{ tx.lead }}</p>
      </div>
      <button type="button" class="gei-cta" @click="$emit('create')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        {{ $t('finance.gap_create') }}
      </button>
    </div>

    <ul class="gei-grid">
      <li v-for="f in tx.features" :key="f.icon" class="gei-card">
        <span class="gei-card__icon">{{ f.icon }}</span>
        <div class="min-w-0">
          <p class="font-semibold text-gray-900 text-sm">{{ f.t }}</p>
          <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ f.d }}</p>
        </div>
      </li>
    </ul>

    <div class="gei-steps">
      <p class="text-xs font-bold text-teal-800 uppercase tracking-wide">{{ tx.howTitle }}</p>
      <ol class="gei-steps__list">
        <li v-for="(st, i) in tx.steps" :key="'st' + i"><span class="gei-steps__n">{{ i + 1 }}</span><span>{{ st }}</span></li>
      </ol>
    </div>
  </section>
</template>

<script>
const TEXTS = {
  uz: {
    free: 'Mutlaqo bepul',
    title: 'Hali gap yo‘q — Gap bilan nimalar qila olasiz?',
    titleNoActive: 'Faol gap yo‘q — yangisini boshlang',
    lead: 'Gap (чёрная касса) — do‘stlar, qarindoshlar yoki hamkasblar bilan har oy teng summa yig‘ib, navbat bilan bittangizga berish. ZeroX hammasini hisoblab, eslatib va shaffof saqlab boradi. Bu bo‘limdan foydalanish mutlaqo bepul — hech qanday tarif yoki to‘lov talab qilinmaydi.',
    features: [
      { icon: '🔁', t: 'Navbat va jadval', d: 'Har davrda kim pul olishi va to‘lov sanalari avtomatik tuziladi.' },
      { icon: '👥', t: 'A’zolarni taklif qilish', d: 'Telefon raqami orqali qo‘shing — taklif sayt, ilova va Telegram orqali boradi.' },
      { icon: '✅', t: 'To‘lovlar nazorati', d: 'Kim to‘ladi, kim kechikdi — bir qarashda. Qabul qiluvchining kartasi ham ko‘rinadi.' },
      { icon: '📍', t: 'Uchrashuv joyi', d: 'Joy va xaritani belgilang, a’zolar «Boraman / Bora olmayman» deb javob beradi.' },
      { icon: '🔔', t: 'Eslatmalar', d: 'To‘lov kunidan oldin a’zolarga Telegram va ilova orqali avtomatik eslatma.' },
      { icon: '💬', t: 'Telegram guruh', d: 'Gapni Telegram guruhingizga ulang — navbat va to‘lovlar haqida xabarlar guruhga boradi.' },
    ],
    howTitle: 'Qanday boshlanadi',
    steps: ['«Gap yaratish» — nom, summa va to‘lov kunini kiriting', 'A’zolarni qo‘shing va navbatni belgilang', 'Har oy to‘lovlarni belgilab boring — qolganini ZeroX eslatadi'],
  },
  ru: {
    free: 'Совершенно бесплатно',
    title: 'Пока нет ни одного гапа — что даёт Гап?',
    titleNoActive: 'Нет активных гапов — начните новый',
    lead: 'Гап (чёрная касса) — друзья, родственники или коллеги каждый месяц вносят равную сумму и по очереди получают всю сумму. ZeroX всё считает, напоминает и сохраняет прозрачно. Пользоваться разделом совершенно бесплатно — никакой тариф или оплата не нужны.',
    features: [
      { icon: '🔁', t: 'Очередь и график', d: 'Кто получает деньги в каждом круге и даты взносов — составляются автоматически.' },
      { icon: '👥', t: 'Приглашение участников', d: 'Добавляйте по номеру телефона — приглашение придёт на сайт, в приложение и Telegram.' },
      { icon: '✅', t: 'Контроль взносов', d: 'Кто заплатил, кто опоздал — с одного взгляда. Видна и карта получателя.' },
      { icon: '📍', t: 'Место встречи', d: 'Укажите место и карту, участники ответят «Приду / Не приду».' },
      { icon: '🔔', t: 'Напоминания', d: 'Перед днём взноса — автоматическое напоминание участникам в Telegram и приложении.' },
      { icon: '💬', t: 'Telegram-группа', d: 'Подключите гап к вашей Telegram-группе — сообщения об очереди и взносах придут в группу.' },
    ],
    howTitle: 'Как начать',
    steps: ['«Создать гап» — укажите название, сумму и день взноса', 'Добавьте участников и задайте очередь', 'Каждый месяц отмечайте взносы — об остальном напомнит ZeroX'],
  },
  kr: {
    free: 'Мутлақо бепул',
    title: 'Ҳали гап йўқ — Гап билан нималар қила оласиз?',
    titleNoActive: 'Фаол гап йўқ — янгисини бошланг',
    lead: 'Гап (чёрная касса) — дўстлар, қариндошлар ёки ҳамкасблар билан ҳар ой тенг сумма йиғиб, навбат билан биттангизга бериш. ZeroX ҳаммасини ҳисоблаб, эслатиб ва шаффоф сақлаб боради. Бу бўлимдан фойдаланиш мутлақо бепул — ҳеч қандай тариф ёки тўлов талаб қилинмайди.',
    features: [
      { icon: '🔁', t: 'Навбат ва жадвал', d: 'Ҳар даврда ким пул олиши ва тўлов саналари автоматик тузилади.' },
      { icon: '👥', t: 'Аъзоларни таклиф қилиш', d: 'Телефон рақами орқали қўшинг — таклиф сайт, илова ва Telegram орқали боради.' },
      { icon: '✅', t: 'Тўловлар назорати', d: 'Ким тўлади, ким кечикди — бир қарашда. Қабул қилувчининг картаси ҳам кўринади.' },
      { icon: '📍', t: 'Учрашув жойи', d: 'Жой ва харитани белгиланг, аъзолар «Бораман / Бора олмайман» деб жавоб беради.' },
      { icon: '🔔', t: 'Эслатмалар', d: 'Тўлов кунидан олдин аъзоларга Telegram ва илова орқали автоматик эслатма.' },
      { icon: '💬', t: 'Telegram гуруҳ', d: 'Гапни Telegram гуруҳингизга уланг — навбат ва тўловлар ҳақида хабарлар гуруҳга боради.' },
    ],
    howTitle: 'Қандай бошланади',
    steps: ['«Гап яратиш» — ном, сумма ва тўлов кунини киритинг', 'Аъзоларни қўшинг ва навбатни белгиланг', 'Ҳар ой тўловларни белгилаб боринг — қолганини ZeroX эслатади'],
  },
  kaa: {
    free: 'Pútkilley biypul',
    title: 'Ele gap joq — Gap penen neler isley alasız?',
    titleNoActive: 'Aktiv gap joq — jańasın baslań',
    lead: 'Gap (чёрная касса) — doslar, aǵayinler yamasa kásiplesler menen hár ay teń summa jıynap, gezek penen birewińizge beriw. ZeroX hámmesin esaplap, eskertip hám ashıq saqlap baradı. Bul bólimnen paydalanıw pútkilley biypul — hesh qanday tarif yamasa tólem talap etilmeydi.',
    features: [
      { icon: '🔁', t: 'Gezek hám keste', d: 'Hár aylanıwda kim pul alıwı hám tólem sánesi avtomat dúziledi.' },
      { icon: '👥', t: 'Aǵzalardı usınıs etiw', d: 'Telefon nomeri arqalı qosıń — usınıs sayt, qosımsha hám Telegram arqalı baradı.' },
      { icon: '✅', t: 'Tólemler qadaǵalawı', d: 'Kim tóledi, kim keshikti — bir qarawda. Alıwshınıń kartası da kórinedi.' },
      { icon: '📍', t: 'Ushırasıw ornı', d: 'Orın hám kartanı belgileń, aǵzalar «Baraman / Bara almayman» dep juwap beredi.' },
      { icon: '🔔', t: 'Eskertpeler', d: 'Tólem kúninen aldın aǵzalarǵa Telegram hám qosımsha arqalı avtomat eskertpe.' },
      { icon: '💬', t: 'Telegram topar', d: 'Gaptı Telegram toparıńızǵa jalǵań — gezek hám tólemler haqqında xabarlar toparǵa baradı.' },
    ],
    howTitle: 'Qalay baslanadı',
    steps: ['«Gap jaratıw» — at, summa hám tólem kúnin kiritiń', 'Aǵzalardı qosıń hám gezekti belgileń', 'Hár ay tólemlerdi belgilep barıń — qalǵanın ZeroX eskertedi'],
  },
  en: {
    free: 'Completely free',
    title: 'No gaps yet — what can you do with Gap?',
    titleNoActive: 'No active gaps — start a new one',
    lead: 'Gap (a rotating savings circle) — friends, relatives or colleagues pay the same amount every month and take turns receiving the whole pot. ZeroX does the maths, sends reminders and keeps everything transparent. Using this section is completely free — no plan or payment required.',
    features: [
      { icon: '🔁', t: 'Turn order and schedule', d: 'Who receives the money in each round and the payment dates are generated automatically.' },
      { icon: '👥', t: 'Invite members', d: 'Add people by phone number — the invite reaches them on the website, app and Telegram.' },
      { icon: '✅', t: 'Payment tracking', d: 'See at a glance who paid and who is late. The recipient’s card is shown too.' },
      { icon: '📍', t: 'Meeting place', d: 'Set the venue and map; members reply «I’m going / I can’t go».' },
      { icon: '🔔', t: 'Reminders', d: 'Automatic reminders to members via Telegram and the app before each payment day.' },
      { icon: '💬', t: 'Telegram group', d: 'Link the gap to your Telegram group — turn and payment updates are posted there.' },
    ],
    howTitle: 'How to start',
    steps: ['«Create gap» — enter a name, amount and payment day', 'Add members and set the turn order', 'Mark payments each month — ZeroX reminds everyone about the rest'],
  },
}

export default {
  name: 'GapEmptyInfo',
  props: { compact: { type: Boolean, default: false } },
  computed: {
    tx() { return TEXTS[this.$i18n && this.$i18n.locale] || TEXTS.uz },
  },
}
</script>

<style scoped>
.gei-top { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 24px 24px 8px; }
.gei-free { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 9999px; background: linear-gradient(120deg, #0d9488 0%, #10b981 100%); color: #fff; font-size: 13px; font-weight: 800; letter-spacing: .2px; box-shadow: 0 8px 18px -10px rgba(13, 148, 136, 0.8); }
.gei-cta { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 12px; background: #0d9488; color: #fff; font-weight: 700; font-size: 14px; white-space: nowrap; transition: background .15s, transform .15s; }
.gei-cta:hover { background: #0f766e; transform: translateY(-1px); }
.gei-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding: 16px 24px; }
.gei-card { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border-radius: 14px; border: 1px solid #f0fdfa; background: #f8fffd; transition: border-color .15s, box-shadow .15s; }
.gei-card:hover { border-color: #99f6e4; box-shadow: 0 6px 16px -12px rgba(13, 148, 136, 0.6); }
.gei-card__icon { width: 38px; height: 38px; border-radius: 12px; background: #ccfbf1; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.gei-steps { margin: 0 24px 24px; padding: 14px 16px; border-radius: 14px; background: #f0fdfa; border: 1px dashed #5eead4; }
.gei-steps__list { display: flex; flex-wrap: wrap; gap: 8px 20px; margin-top: 8px; }
.gei-steps__list li { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #134e4a; }
.gei-steps__n { width: 22px; height: 22px; border-radius: 9999px; background: #0d9488; color: #fff; font-size: 12px; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.gei--compact { margin-bottom: 24px; }
@media (max-width: 1023px) { .gei-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 639px) {
  .gei-grid { grid-template-columns: minmax(0, 1fr); padding: 12px 16px; }
  .gei-top { padding: 18px 16px 4px; }
  .gei-steps { margin: 0 16px 18px; }
  .gei-cta { width: 100%; justify-content: center; }
}
</style>
