/**
 * SS-DEV (2026-09-24): Qarz daftari TARIFLARI — yagona manba.
 * `pages/price/index.vue` (to'liq sahifa) va `components/LandingPage.vue` (#pricing
 * bo'limi) AYNAN shu ma'lumotni ko'rsatadi (11-rasm: landing'da "Tariflar" havolasi
 * bor edi, lekin bo'limning o'zi yo'q edi). Narxlar statik (backend'da tarif
 * katalogi endpointi yo'q; sotib olish `/price` sahifasida).
 */

/**
 * 13.10 ("Xatolar yangi sayt 13.10", 3-rasm): tarif kartalari IXCHAM — o'xshash funksiyalar
 * birlashtirildi (qarz + to'lov; avto eslatma + talab SMS), Shaxsiy moliya — bitta qator.
 * Tarif cheklovlari o'zgarmagan (backend PLAN_FEATURES bilan bir xil):
 * Free — qarz/to'lov + ro'yxatga olish SMS; Start+ — avto eslatma, talab SMS, SMS tarixi;
 * Premium — SMS ro'yxati (sms_list), tahlil + Excel. Shaxsiy moliya — to'liq bepul.
 */
export const PLAN_FEATURE_TEXTS = {
  uz: {
    f_qarz: "Qarz va to'lovlarni yuritish",
    f_reg_sms: "Qarz haqida SMS (ro'yxatga olish)",
    f_auto_sms: 'Avtomatik eslatma va talab SMS',
    f_sms_history: 'SMS tarixi va statistika',
    f_sms_list: "Batafsil SMS ro'yxati va qidiruv",
    included: 'SMS kiritilgan',
    popular: 'Ommabop',
  },
  ru: {
    f_qarz: 'Учёт долгов и платежей',
    f_reg_sms: 'SMS о долге (при регистрации)',
    f_auto_sms: 'Автонапоминание и SMS-требование',
    f_sms_history: 'История и статистика SMS',
    f_sms_list: 'Подробный список SMS и поиск',
    included: 'SMS включено',
    popular: 'Популярный',
  },
  kr: {
    f_qarz: 'Қарз ва тўловларни юритиш',
    f_reg_sms: 'Қарз ҳақида SMS (рўйхатга олиш)',
    f_auto_sms: 'Автоматик эслатма ва талаб SMS',
    f_sms_history: 'SMS тарихи ва статистика',
    f_sms_list: 'Батафсил SMS рўйхати ва қидирув',
    included: 'SMS киритилган',
    popular: 'Оммабоп',
  },
  // SS-DEV (2026-09-26): en/kaa
  en: {
    f_qarz: 'Debt and payment tracking',
    f_reg_sms: 'Debt SMS (on registration)',
    f_auto_sms: 'Auto reminder and demand SMS',
    f_sms_history: 'SMS history and statistics',
    f_sms_list: 'Detailed SMS list and search',
    included: 'SMS included',
    popular: 'Popular',
  },
  kaa: {
    f_qarz: 'Qarız hám tólemlerdi júrgiziw',
    f_reg_sms: 'Qarız haqqında SMS (dizimge alıw)',
    f_auto_sms: 'Avtomat eskertpe hám talap SMS',
    f_sms_history: 'SMS tariyxı hám statistika',
    f_sms_list: 'Tolıq SMS dizimi hám izlew',
    included: 'SMS kiritilgen',
    popular: 'Ommabap',
  },
};

/**
 * 26.10: FAQAT Tariflar sahifasi (`pages/price`) — mobil ilova (Types.tsx, "Qarz daftari tariflari") bilan
 * AYNAN bir xil BIR TEKIS ro'yxat: guruh sarlavhalarisiz, har bandda ✓/✗. Matnlar mobil i18n
 * (ZeroX_mobile/src/i18n/new/*.json) dan so'zma-so'z olingan. Landing (#pricing) variantsiz chaqiradi — O'ZGARMAGAN.
 */
export const TARIFFS_PAGE_TEXTS = {
  uz: {
    f_qarz: "Qarz va to‘lovlarni yuritish",
    f_reg_sms: "Qarz qayd etilganda qarzdorga avtomatik SMS xabar yuborish",
    f_finance: "Shaxsiy moliyani yuritish",
    f_auto_sms: "Avtomatik eslatma, talab va to‘lov SMS xabarlari",
    f_sms_history: "SMS xabarlar tarixi va statistika",
    f_sms_list: "SMS xabarlarning batafsil ro‘yxati va qidiruv",
    f_analytics: "Qarzlar tahlili va Excelga yuklab olish",
    sms100: "100 SMS kiritilgan",
    sms500: "500 SMS kiritilgan",
    sms1100: "1 100 SMS kiritilgan",
    popular: "Ommabop",
  },
  ru: {
    f_qarz: "Учёт долгов и платежей",
    f_reg_sms: "Автоматическая отправка SMS-сообщения должнику при оформлении долга",
    f_finance: "Ведение личных финансов",
    f_auto_sms: "Автонапоминания, SMS-сообщения о требовании и платеже",
    f_sms_history: "История SMS-сообщений и статистика",
    f_sms_list: "Подробный список SMS-сообщений и поиск",
    f_analytics: "Аналитика долгов и выгрузка в Excel",
    sms100: "Включено 100 SMS",
    sms500: "Включено 500 SMS",
    sms1100: "Включено 1 100 SMS",
    popular: "Популярный",
  },
  kr: {
    f_qarz: "Қарз ва тўловларни юритиш",
    f_reg_sms: "Қарз қайд этилганда қарздорга автоматик СМС хабар юбориш",
    f_finance: "Шахсий молияни юритиш",
    f_auto_sms: "Автоматик эслатма, талаб ва тўлов СМС хабарлари",
    f_sms_history: "СМС хабарлар тарихи ва статистика",
    f_sms_list: "СМС хабарларнинг батафсил рўйхати ва қидирув",
    f_analytics: "Қарзлар таҳлили ва Excelга юклаб олиш",
    sms100: "100 СМС киритилган",
    sms500: "500 СМС киритилган",
    sms1100: "1 100 СМС киритилган",
    popular: "Оммабоп",
  },
  en: {
    f_qarz: "Debt and payment tracking",
    f_reg_sms: "Automatic SMS message sent to the debtor when a debt is recorded",
    f_finance: "Personal finance management",
    f_auto_sms: "Auto reminder, demand and payment SMS messages",
    f_sms_history: "SMS message history and statistics",
    f_sms_list: "Detailed list of SMS messages and search",
    f_analytics: "Debt analytics and Excel download",
    sms100: "100 SMS included",
    sms500: "500 SMS included",
    sms1100: "1,100 SMS included",
    popular: "Popular",
  },
  kaa: {
    f_qarz: "Qarız hám tólemlerdi júrgiziw",
    f_reg_sms: "Qarız qayd etilgende qarızdarǵa avtomatikalıq SMS xabar jiberiw",
    f_finance: "Jeke qarjını júrgiziw",
    f_auto_sms: "Avtomat eskertpe, talap hám tólem SMS xabarları",
    f_sms_history: "SMS xabarlar tariyxı hám statistika",
    f_sms_list: "SMS xabarlardıń tolıq dizimi hám izlew",
    f_analytics: "Qarızlar analizi hám Excelge júklep alıw",
    sms100: "100 SMS kirgizilgen",
    sms500: "500 SMS kirgizilgen",
    sms1100: "1 100 SMS kirgizilgen",
    popular: "Ommabap",
  },
};

/** Mobil FEATURE_ROWS tartibi; level — band qaysi tarifdan boshlab mavjud (free 0, start 1, premium 2). */
const TARIFFS_PAGE_ROWS = [
  { key: 'f_qarz', level: 0 },
  { key: 'f_reg_sms', level: 0 },
  { key: 'f_finance', level: 0 },
  { key: 'f_auto_sms', level: 1 },
  { key: 'f_sms_history', level: 1 },
  { key: 'f_sms_list', level: 2 },
  { key: 'f_analytics', level: 2 },
];
const TARIFFS_PAGE_LEVEL = { free: 0, start: 1, premium: 2 };
const TARIFFS_PAGE_SMS_KEY = { free: 'sms100', start: 'sms500', premium: 'sms1100' };

export const VARIANT_TARIFFS = 'tariffs';

const ALL = ['f_qarz', 'f_reg_sms', 'f_auto_sms', 'f_sms_history', 'f_sms_list'];
// 29.09: "SMS xabarlar ro'yxati" (to'liq ro'yxat, qidiruv) — FAQAT Premium
// (backend PLAN_FEATURES.sms_list; mobil/sayt boshqa tariflarda "Tarif cheklovi" ko'rsatadi).
const START = ALL.filter((k) => k !== 'f_sms_list');

export const PLANS = [
  { key: 'free', name: 'Free', price: 0, sms: 100, popular: false, features: ['f_qarz', 'f_reg_sms'], disabled: ['f_auto_sms', 'f_sms_history', 'f_sms_list'] },
  { key: 'start', name: 'Start', price: 99000, sms: 500, popular: true, features: START, disabled: ['f_sms_list'] },
  { key: 'premium', name: 'Premium', price: 199000, sms: 1100, popular: false, features: ALL, disabled: [] },
];

/**
 * 11.10 (sayt hujjati, 6-rasm): tariflarga SHAXSIY QARZ va SHAXSIY MOLIYA funksiyalari ham qo'shildi.
 * 13.10: ixcham — shaxsiy qarz 3 qator (bepul / Start+ / Premium), shaxsiy moliya 1 qator.
 * Gating backend PLAN_FEATURES / smsPolicy bilan bir xil: talab va to'lov SMS'i — Start+,
 * qarzlar tahlili + Excel (analytics, excel_export) — faqat Premium. Shaxsiy moliya — to'liq bepul.
 */
export const GROUP_TEXTS = {
  uz: {
    g_daftari: 'Qarz daftari', g_pdebt: 'Shaxsiy qarz', g_finance: 'Shaxsiy moliya',
    p_records: 'Qarz yuritish, SMS va eslatma', p_demand: "Talab va to'lov SMS'lari",
    p_analytics: 'Qarzlar tahlili va Excel', m_all: 'Shaxsiy moliyani yuritish',
  },
  ru: {
    g_daftari: 'Книга долгов', g_pdebt: 'Личные долги', g_finance: 'Личные финансы',
    p_records: 'Учёт долгов, SMS и напоминания', p_demand: 'SMS-требование и SMS о платеже',
    p_analytics: 'Аналитика долгов и Excel', m_all: 'Ведение личных финансов',
  },
  kr: {
    g_daftari: 'Қарз дафтари', g_pdebt: 'Шахсий қарз', g_finance: 'Шахсий молия',
    p_records: 'Қарз юритиш, SMS ва эслатма', p_demand: 'Талаб ва тўлов SMSлари',
    p_analytics: 'Қарзлар таҳлили ва Excel', m_all: 'Шахсий молияни юритиш',
  },
  en: {
    g_daftari: 'Debt ledger', g_pdebt: 'Personal debts', g_finance: 'Personal finance',
    p_records: 'Debt tracking, SMS and reminders', p_demand: 'Demand and payment SMS',
    p_analytics: 'Debt analytics and Excel', m_all: 'Personal finance management',
  },
  kaa: {
    g_daftari: 'Qarız dápteri', g_pdebt: 'Jeke qarız', g_finance: 'Jeke qarjı',
    p_records: 'Qarız júrgiziw, SMS hám eskertpe', p_demand: 'Talap hám tólem SMS-leri',
    p_analytics: 'Qarızlar analizi hám Excel', m_all: 'Jeke qarjını júrgiziw',
  },
};

/** Har tarif uchun: shaxsiy qarz — bor/yo'q ro'yxati; shaxsiy moliya — bitta qator, hammada bor. */
const PLAN_GROUPS = {
  free: { pdebt: ['p_records'], pdebtOff: ['p_demand', 'p_analytics'] },
  start: { pdebt: ['p_records', 'p_demand'], pdebtOff: ['p_analytics'] },
  premium: { pdebt: ['p_records', 'p_demand', 'p_analytics'], pdebtOff: [] },
};

/**
 * Tarif kartasidagi qo'shimcha guruhlar (Shaxsiy qarz, Shaxsiy moliya).
 * @returns {{ key: string, title: string, items: { text: string, on: boolean }[] }[]}
 */
export function planGroups(planKey, locale) {
  const loc = GROUP_TEXTS[locale] ? locale : 'uz';
  const t = GROUP_TEXTS[loc];
  const g = PLAN_GROUPS[planKey] || PLAN_GROUPS.free;
  return [
    { key: 'pdebt', title: t.g_pdebt, items: [...g.pdebt.map((k) => ({ text: t[k], on: true })), ...g.pdebtOff.map((k) => ({ text: t[k], on: false }))] },
    { key: 'finance', title: t.g_finance, items: [{ text: t.m_all, on: true }] },
  ];
}

/** "Qarz daftari" guruhi sarlavhasi (mavjud ro'yxat ustida). */
export function daftariGroupTitle(locale) {
  return (GROUP_TEXTS[locale] || GROUP_TEXTS.uz).g_daftari;
}

/** Qarz shartnomasi narxi (Mobil hisobdan) — `/price` bilan bir xil. */
export const CONTRACT_PRICING = {
  uz: ["1 mln so'mgacha — 1 000 UZS", "1 mln dan 100 mln so'mgacha — 0.1%", "100 mln so'mdan ortiq — 100 000 UZS"],
  ru: ['до 1 млн сум — 1 000 UZS', 'от 1 до 100 млн сум — 0.1%', 'свыше 100 млн сум — 100 000 UZS'],
  kr: ["1 млн сўмгача — 1 000 UZS", "1 млн дан 100 млн сўмгача — 0.1%", "100 млн сўмдан ортиқ — 100 000 UZS"],
};

export function formatPlanPrice(n) {
  return Number(n || 0).toLocaleString('uz-UZ').replace(/,/g, ' ');
}

/**
 * Tariflar (matnlar tanlangan tilda).
 * @param {string} locale uz|ru|kr|en|kaa
 * @param {string} [variant] 'tariffs' — faqat Tariflar sahifasi matnlari; bo'sh — landing (o'zgarmagan)
 */
export function getPlans(locale, variant) {
  if (variant === VARIANT_TARIFFS) {
    return getTariffsPagePlans(locale);
  }
  const loc = PLAN_FEATURE_TEXTS[locale] ? locale : 'uz';
  const t = PLAN_FEATURE_TEXTS[loc];
  return PLANS.map((p) => ({
    ...p,
    priceText: formatPlanPrice(p.price),
    smsText: `${formatPlanPrice(p.sms)} ${t.included}`,
    popularText: t.popular,
    featureTexts: p.features.map((k) => t[k]),
    disabledTexts: p.disabled.map((k) => t[k]),
  }));
}

/** Tariflar sahifasi: mobil bilan bir xil bir tekis ro'yxat — items: [{ text, on }] (birinchi qator — "N SMS kiritilgan"). */
function getTariffsPagePlans(locale) {
  const t = TARIFFS_PAGE_TEXTS[locale] || TARIFFS_PAGE_TEXTS.uz;
  return PLANS.map((p) => {
    const level = TARIFFS_PAGE_LEVEL[p.key] || 0;
    return {
      ...p,
      priceText: formatPlanPrice(p.price),
      smsText: t[TARIFFS_PAGE_SMS_KEY[p.key]],
      popularText: t.popular,
      items: [
        { text: t[TARIFFS_PAGE_SMS_KEY[p.key]], on: true },
        ...TARIFFS_PAGE_ROWS.map((r) => ({ text: t[r.key], on: r.level <= level })),
      ],
    };
  });
}
