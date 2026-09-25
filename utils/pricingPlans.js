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
    included: 'SMS kiritilgen',
    popular: 'Ommabap',
  },
};

const ALL = ['f_qarz', 'f_payment', 'f_reg_sms', 'f_auto_sms', 'f_manual_sms', 'f_sms_history'];

export const PLANS = [
  { key: 'free', name: 'Free', price: 0, sms: 100, popular: false, features: ['f_qarz', 'f_payment', 'f_reg_sms'], disabled: ['f_auto_sms', 'f_manual_sms', 'f_sms_history'] },
  { key: 'start', name: 'Start', price: 99000, sms: 500, popular: true, features: ALL, disabled: [] },
  { key: 'premium', name: 'Premium', price: 199000, sms: 1100, popular: false, features: ALL, disabled: [] },
];

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
