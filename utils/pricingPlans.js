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
 * 25.10: FAQAT Tariflar sahifasi (`pages/price`) uchun matn variantlari (mobil ilova matnlari bilan
 * bir xil). Landing (#pricing) `getPlans(locale)` ni variantsiz chaqiradi — uning matnlari O'ZGARMAGAN.
 */
export const TARIFFS_PAGE_FEATURE_TEXTS = {
  uz: {
    f_reg_sms: "Qarz qayd etilganda qarzdorga avtomatik SMS xabar yuborish",
    f_auto_sms: "Avtomatik eslatma, talab va to'lov SMS xabarlari",
    f_sms_history: 'SMS xabarlar tarixi va statistika',
    f_sms_list: "SMS xabarlarning batafsil ro'yxati va qidiruv",
  },
  ru: {
    f_reg_sms: 'Автоматическая отправка SMS должнику при записи долга',
    f_auto_sms: 'Автоматические SMS-сообщения: напоминания, требования и платежи',
    f_sms_history: 'История и статистика SMS-сообщений',
    f_sms_list: 'Подробный список SMS-сообщений и поиск',
  },
  kr: {
    f_reg_sms: 'Қарз қайд этилганда қарздорга автоматик SMS хабар юбориш',
    f_auto_sms: 'Автоматик эслатма, талаб ва тўлов SMS хабарлари',
    f_sms_history: 'SMS хабарлар тарихи ва статистика',
    f_sms_list: 'SMS хабарларнинг батафсил рўйхати ва қидирув',
  },
  en: {
    f_reg_sms: 'Automatic SMS to the debtor when a debt is recorded',
    f_auto_sms: 'Automatic reminder, demand and payment SMS messages',
    f_sms_history: 'SMS message history and statistics',
    f_sms_list: 'Detailed SMS message list and search',
  },
  kaa: {
    f_reg_sms: 'Qarız belgilengende qarızdarǵa avtomat SMS xabar jiberiw',
    f_auto_sms: 'Avtomat eskertpe, talap hám tólem SMS xabarları',
    f_sms_history: 'SMS xabarlar tariyxı hám statistika',
    f_sms_list: 'SMS xabarlardıń tolıq dizimi hám izlew',
  },
};

export const TARIFFS_PAGE_GROUP_TEXTS = {
  uz: { p_analytics: 'Qarzlar tahlili va Excelga yuklab olish' },
  ru: { p_analytics: 'Аналитика долгов и выгрузка в Excel' },
  kr: { p_analytics: 'Қарзлар таҳлили ва Excelга юклаб олиш' },
  en: { p_analytics: 'Debt analytics and Excel download' },
  kaa: { p_analytics: 'Qarızlar analizi hám Excelge júklep alıw' },
};

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
export function planGroups(planKey, locale, variant) {
  const loc = GROUP_TEXTS[locale] ? locale : 'uz';
  const t = variant === VARIANT_TARIFFS
    ? { ...GROUP_TEXTS[loc], ...TARIFFS_PAGE_GROUP_TEXTS[loc] }
    : GROUP_TEXTS[loc];
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
  const loc = PLAN_FEATURE_TEXTS[locale] ? locale : 'uz';
  const t = variant === VARIANT_TARIFFS
    ? { ...PLAN_FEATURE_TEXTS[loc], ...TARIFFS_PAGE_FEATURE_TEXTS[loc] }
    : PLAN_FEATURE_TEXTS[loc];
  return PLANS.map((p) => ({
    ...p,
    priceText: formatPlanPrice(p.price),
    smsText: `${formatPlanPrice(p.sms)} ${t.included}`,
    popularText: t.popular,
    featureTexts: p.features.map((k) => t[k]),
    disabledTexts: p.disabled.map((k) => t[k]),
  }));
}
