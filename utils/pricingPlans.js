/**
 * SS-DEV (2026-09-24): Qarz daftari TARIFLARI — yagona manba.
 * `pages/price/index.vue` (to'liq sahifa) va `components/LandingPage.vue` (#pricing
 * bo'limi) AYNAN shu ma'lumotni ko'rsatadi (11-rasm: landing'da "Tariflar" havolasi
 * bor edi, lekin bo'limning o'zi yo'q edi). Narxlar statik (backend'da tarif
 * katalogi endpointi yo'q; sotib olish `/price` sahifasida).
 */

export const PLAN_FEATURE_TEXTS = {
  uz: {
    f_qarz: "Qarz qo'shish",
    f_payment: "To'lovlarni qayd etish",
    f_reg_sms: "Ro'yxatga olish SMS (tizim)",
    f_auto_sms: 'Avtomatik SMS eslatma (muddat bugun)',
    f_manual_sms: "Qo'lda SMS yuborish (qaytarishni talab)",
    f_sms_history: 'SMS tarixi va statistika',
    f_sms_list: "SMS xabarlar ro'yxati (batafsil, qidiruv)",
    included: 'SMS kiritilgan',
    popular: 'Ommabop',
  },
  ru: {
    f_qarz: 'Добавление долгов',
    f_payment: 'Учёт платежей',
    f_reg_sms: 'SMS при регистрации долга',
    f_auto_sms: 'Автоматическое SMS-напоминание (срок сегодня)',
    f_manual_sms: 'Ручная отправка SMS (требование возврата)',
    f_sms_history: 'История и статистика SMS',
    f_sms_list: 'Список SMS-сообщений (подробно, поиск)',
    included: 'SMS включено',
    popular: 'Популярный',
  },
  kr: {
    f_qarz: 'Қарз қўшиш',
    f_payment: 'Тўловларни қайд этиш',
    f_reg_sms: 'Рўйхатга олиш SMS (тизим)',
    f_auto_sms: 'Автоматик SMS эслатма (муддат бугун)',
    f_manual_sms: 'Қўлда SMS юбориш (қайтаришни талаб)',
    f_sms_history: 'SMS тарихи ва статистика',
    f_sms_list: 'SMS хабарлар рўйхати (батафсил, қидирув)',
    included: 'SMS киритилган',
    popular: 'Оммабоп',
  },
  // SS-DEV (2026-09-26): en/kaa
  en: {
    f_qarz: 'Add debts',
    f_payment: 'Record payments',
    f_reg_sms: 'Registration SMS (system)',
    f_auto_sms: 'Automatic SMS reminder (due today)',
    f_manual_sms: 'Manual SMS sending (repayment demand)',
    f_sms_history: 'SMS history and statistics',
    f_sms_list: 'SMS message list (detailed, search)',
    included: 'SMS included',
    popular: 'Popular',
  },
  kaa: {
    f_qarz: 'Qarız qosıw',
    f_payment: 'Tólemlerdi dizimge alıw',
    f_reg_sms: 'Dizimge alıw SMS (sistema)',
    f_auto_sms: 'Avtomat SMS eslatpa (múddeti búgin)',
    f_manual_sms: 'Qolda SMS jiberiw (qaytarıwdı talap)',
    f_sms_history: 'SMS tariyxı hám statistika',
    f_sms_list: 'SMS xabarlar dizimi (tolıq, izlew)',
    included: 'SMS kiritilgen',
    popular: 'Ommabap',
  },
};

const ALL = ['f_qarz', 'f_payment', 'f_reg_sms', 'f_auto_sms', 'f_manual_sms', 'f_sms_history', 'f_sms_list'];
// 29.09: "SMS xabarlar ro'yxati" (to'liq ro'yxat, qidiruv) — FAQAT Premium
// (backend PLAN_FEATURES.sms_list; mobil/sayt boshqa tariflarda "Tarif cheklovi" ko'rsatadi).
const START = ALL.filter((k) => k !== 'f_sms_list');

export const PLANS = [
  { key: 'free', name: 'Free', price: 0, sms: 100, popular: false, features: ['f_qarz', 'f_payment', 'f_reg_sms'], disabled: ['f_auto_sms', 'f_manual_sms', 'f_sms_history', 'f_sms_list'] },
  { key: 'start', name: 'Start', price: 99000, sms: 500, popular: true, features: START, disabled: ['f_sms_list'] },
  { key: 'premium', name: 'Premium', price: 199000, sms: 1100, popular: false, features: ALL, disabled: [] },
];

/**
 * 11.10 (sayt hujjati, 6-rasm): tariflarga SHAXSIY QARZ va SHAXSIY MOLIYA funksiyalari ham qo'shildi.
 * Bepul funksiyalar — barcha tariflarda; pullik — faqat Start va Premium (backend PLAN_FEATURES /
 * smsPolicy bilan bir xil: talab va to'lov SMS'i manual_sms_send / auto_sms_reminder — Start+,
 * qarzlar tahlili + Excel (analytics, excel_export) — faqat Premium). Shaxsiy moliya — to'liq bepul.
 */
export const GROUP_TEXTS = {
  uz: {
    g_daftari: 'Qarz daftari', g_pdebt: 'Shaxsiy qarz', g_finance: 'Shaxsiy moliya',
    p_records: "Qarz berish, olish va to'lovlarni yuritish", p_reg_sms: "Qarz haqida SMS (ro'yxatga olish)",
    p_reminder: 'Qarz kiritish eslatmasi', p_demand: 'Qaytarishni talab qilish SMS',
    p_payment_sms: "To'lov va qoldiq qarz haqida SMS", p_analytics: 'Qarzlar tahlili va Excel hisobot',
    m_records: 'Daromad va xarajatlar, chek skanerlash', m_budget: 'Limitlar va moliyaviy maqsadlar',
    m_plan: "Rejalashtirilgan to'lovlar, oila moliyasi, Gap", m_analytics: 'Tahlil, hisobotlar va Excel',
  },
  ru: {
    g_daftari: 'Книга долгов', g_pdebt: 'Личные долги', g_finance: 'Личные финансы',
    p_records: 'Выдача, получение долгов и учёт платежей', p_reg_sms: 'SMS о долге (при регистрации)',
    p_reminder: 'Напоминание о внесении долгов', p_demand: 'SMS с требованием возврата',
    p_payment_sms: 'SMS о платеже и остатке долга', p_analytics: 'Аналитика долгов и отчёт Excel',
    m_records: 'Доходы и расходы, сканирование чеков', m_budget: 'Лимиты и финансовые цели',
    m_plan: 'Плановые платежи, семейные финансы, Гап', m_analytics: 'Аналитика, отчёты и Excel',
  },
  kr: {
    g_daftari: 'Қарз дафтари', g_pdebt: 'Шахсий қарз', g_finance: 'Шахсий молия',
    p_records: 'Қарз бериш, олиш ва тўловларни юритиш', p_reg_sms: 'Қарз ҳақида SMS (рўйхатга олиш)',
    p_reminder: 'Қарз киритиш эслатмаси', p_demand: 'Қайтаришни талаб қилиш SMS',
    p_payment_sms: 'Тўлов ва қолдиқ қарз ҳақида SMS', p_analytics: 'Қарзлар таҳлили ва Excel ҳисобот',
    m_records: 'Даромад ва харажатлар, чек сканерлаш', m_budget: 'Лимитлар ва молиявий мақсадлар',
    m_plan: 'Режалаштирилган тўловлар, оила молияси, Гап', m_analytics: 'Таҳлил, ҳисоботлар ва Excel',
  },
  en: {
    g_daftari: 'Debt ledger', g_pdebt: 'Personal debts', g_finance: 'Personal finance',
    p_records: 'Lending, borrowing and payment tracking', p_reg_sms: 'Debt SMS (on registration)',
    p_reminder: 'Debt entry reminder', p_demand: 'Repayment demand SMS',
    p_payment_sms: 'Payment and balance SMS', p_analytics: 'Debt analytics and Excel report',
    m_records: 'Income and expenses, receipt scanning', m_budget: 'Limits and financial goals',
    m_plan: 'Scheduled payments, family finance, Gap', m_analytics: 'Analytics, reports and Excel',
  },
  kaa: {
    g_daftari: 'Qarız dápteri', g_pdebt: 'Jeke qarız', g_finance: 'Jeke qarjı',
    p_records: 'Qarız beriw, alıw hám tólemlerdi júrgiziw', p_reg_sms: 'Qarız haqqında SMS (dizimge alıw)',
    p_reminder: 'Qarız kiritiw eskertpesi', p_demand: 'Qaytarıwdı talap etiw SMS',
    p_payment_sms: 'Tólem hám qaldıq qarız haqqında SMS', p_analytics: 'Qarızlar analizi hám Excel esabat',
    m_records: 'Dáramat hám qárejetler, chek skanerlew', m_budget: 'Limitler hám qarjılıq maqsetler',
    m_plan: 'Rejelestirilgen tólemler, shańaraq qarjısı, Gap', m_analytics: 'Analiz, esabatlar hám Excel',
  },
};

const PDEBT_FREE = ['p_records', 'p_reg_sms', 'p_reminder'];
const FINANCE_ALL = ['m_records', 'm_budget', 'm_plan', 'm_analytics'];
/** Har tarif uchun: shaxsiy qarz — bor/yo'q ro'yxati; shaxsiy moliya — hammasi bor. */
const PLAN_GROUPS = {
  free: { pdebt: PDEBT_FREE, pdebtOff: ['p_demand', 'p_payment_sms', 'p_analytics'] },
  start: { pdebt: [...PDEBT_FREE, 'p_demand', 'p_payment_sms'], pdebtOff: ['p_analytics'] },
  premium: { pdebt: [...PDEBT_FREE, 'p_demand', 'p_payment_sms', 'p_analytics'], pdebtOff: [] },
};

/**
 * Tarif kartasidagi qo'shimcha guruhlar (Shaxsiy qarz, Shaxsiy moliya).
 * @returns {{ key: string, title: string, items: { text: string, on: boolean }[] }[]}
 */
export function planGroups(planKey, locale) {
  const t = GROUP_TEXTS[locale] || GROUP_TEXTS.uz;
  const g = PLAN_GROUPS[planKey] || PLAN_GROUPS.free;
  return [
    { key: 'pdebt', title: t.g_pdebt, items: [...g.pdebt.map((k) => ({ text: t[k], on: true })), ...g.pdebtOff.map((k) => ({ text: t[k], on: false }))] },
    { key: 'finance', title: t.g_finance, items: FINANCE_ALL.map((k) => ({ text: t[k], on: true })) },
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
 * @param {string} locale uz|ru|kr
 */
export function getPlans(locale) {
  const t = PLAN_FEATURE_TEXTS[locale] || PLAN_FEATURE_TEXTS.uz;
  return PLANS.map((p) => ({
    ...p,
    priceText: formatPlanPrice(p.price),
    smsText: `${formatPlanPrice(p.sms)} ${t.included}`,
    popularText: t.popular,
    featureTexts: p.features.map((k) => t[k]),
    disabledTexts: p.disabled.map((k) => t[k]),
  }));
}
