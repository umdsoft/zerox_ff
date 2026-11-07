/**
 * 07.11 (imzolash spetsifikatsiyasi §1, §2, §4): yuridik oqibatli shartnoma amallari bir martalik kod bilan
 * ELEKTRON IMZOLANADI. Oqim: imzo oynasi (shartlar + majburiy rozilik belgisi) → POST /sign/challenge →
 * 6 xonali kod (Telegram yoki SMS) → asosiy endpoint body'siga `sign: { challenge_id, code }`.
 * Rad etish (stype 2) va talab (/contract/talab) — kodsiz (rad etish tasdiqlash oynasi bilan).
 *
 * Bu modul — sof mantiq va matnlar (5 tilda): plugins/sign.client.js ($sign) va components/sign/SignModal.vue ishlatadi.
 */

/** Imzolanadigan amallar (backend `purpose`). */
export const SIGN_PURPOSES = Object.freeze({
  CONTRACT_CREATE: 'contract_create',
  CONTRACT_APPROVE: 'contract_approve',
  REPAYMENT_CONFIRM: 'repayment_confirm',
  TIME_CONFIRM: 'time_confirm',
  ACT_CREATE: 'act_create',
  DEBT_EXTEND: 'debt_extend',
  DEBT_FORGIVE: 'debt_forgive',
});

export const SIGN_CODE_LENGTH = 6;
export const SIGN_RESEND_AFTER = 60; // s
export const SIGN_DEFAULT_TTL = 300; // s (5 daqiqa)

/** Server imzo xato kodlari. */
export const SIGN_ERRORS = Object.freeze({
  REQUIRED: 'SIGN_REQUIRED', // 428
  INVALID: 'SIGN_INVALID', // 400 + attempts_left
  EXPIRED: 'SIGN_EXPIRED', // 410
  LOCKED: 'SIGN_LOCKED', // 429
  DOC_CHANGED: 'SIGN_DOC_CHANGED', // 409
});

const KNOWN_SIGN_CODES = Object.values(SIGN_ERRORS);

/**
 * Axios xatosidan imzo xatosini ajratadi.
 * @returns {null | { code, status, attemptsLeft, purpose }}
 */
export function signErrorOf(error) {
  const res = error && error.response;
  if (!res) {return null;}
  const data = res.data && typeof res.data === 'object' ? res.data : {};
  const code = [data.code, data.msg, data.message].find((c) => typeof c === 'string' && KNOWN_SIGN_CODES.includes(c));
  if (!code) {
    // 428 — faqat imzo talabi uchun ishlatiladi (kod bo'lmasa ham)
    if (Number(res.status) === 428) {return { code: SIGN_ERRORS.REQUIRED, status: 428, attemptsLeft: null, purpose: data.purpose || null };}
    return null;
  }
  const left = Number(data.attempts_left);
  return {
    code,
    status: Number(res.status),
    attemptsLeft: Number.isFinite(left) ? left : null,
    purpose: data.purpose || null,
  };
}

export const isSignRequiredError = (e) => {
  const s = signErrorOf(e);
  return !!s && s.code === SIGN_ERRORS.REQUIRED;
};

/**
 * Imzo xatosi bo'yicha oyna nima qiladi:
 *  - 'retry'   — kod maydonida qoladi (noto'g'ri kod);
 *  - 'restart' — kod qaytadan olinadi (muddati o'tgan / imzo talab qilindi);
 *  - 'locked'  — urinishlar tugadi, kod maydoni o'chiriladi;
 *  - 'close'   — hujjat o'zgargan: oyna yopiladi, sahifa ma'lumotni yangilashi kerak.
 */
export function signErrorAction(code) {
  switch (code) {
    case SIGN_ERRORS.INVALID: return 'retry';
    case SIGN_ERRORS.EXPIRED: return 'restart';
    case SIGN_ERRORS.REQUIRED: return 'restart';
    case SIGN_ERRORS.LOCKED: return 'locked';
    case SIGN_ERRORS.DOC_CHANGED: return 'close';
    default: return null;
  }
}

/** Kod: faqat raqamlar, ko'pi bilan 6 ta. */
export const normalizeCode = (v) => String(v == null ? '' : v).replace(/\D/g, '').slice(0, SIGN_CODE_LENGTH);
export const isCodeComplete = (v) => normalizeCode(v).length === SIGN_CODE_LENGTH;

/** 287 → "04:47" */
export function formatTimer(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * POST /sign/challenge tanasi. `ctx` — { contract, act, notification, payload }; bo'sh maydonlar yuborilmaydi.
 */
export function buildChallengeBody(purpose, ctx = {}) {
  const body = { purpose };
  ['contract', 'act', 'notification'].forEach((k) => {
    if (ctx[k] != null && ctx[k] !== '') {body[k] = ctx[k];}
  });
  if (ctx.payload && typeof ctx.payload === 'object') {body.payload = { ...ctx.payload };}
  return body;
}

/** Challenge javobini oyna holatiga (TTL, kanal) moslaydi. */
export function parseChallenge(res) {
  const d = res && typeof res === 'object' && res.data && !res.challenge_id ? res.data : res;
  if (!d || !d.challenge_id) {return null;}
  const ttl = Number(d.expires_in);
  return {
    challengeId: d.challenge_id,
    channel: d.channel === 'telegram' ? 'telegram' : 'sms',
    destination: d.destination_masked || '',
    expiresIn: Number.isFinite(ttl) && ttl > 0 ? ttl : SIGN_DEFAULT_TTL,
    docHash: d.doc_hash || '',
  };
}

/** Matn ichidagi {n}, {channel}, {dest} kabi o'rinlarni to'ldiradi. */
export function fill(tpl, vars = {}) {
  return String(tpl || '').replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? String(vars[k]) : m));
}

export const SIGN_TEXTS = {
  uz: {
    title: 'Elektron imzo',
    rejectTitle: 'Rad etishni tasdiqlang',
    rejectMessage: "Haqiqatan ham rad etmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.",
    rejectConfirm: 'Rad etish',
    docType: 'Hujjat',
    lender: 'Qarz beruvchi',
    borrower: 'Qarz oluvchi',
    amount: 'Summa',
    dueDate: 'Qaytarish muddati',
    newDueDate: 'Yangi muddat',
    number: 'Shartnoma raqami',
    consent: 'Shartlar bilan tanishdim va elektron imzo bilan imzolayman',
    getCode: 'Kod olish',
    sentTo: '{channel} orqali {dest} ga kod yuborildi',
    channelTelegram: 'Telegram',
    channelSms: 'SMS',
    codeLabel: '6 xonali kod',
    expiresIn: 'Kod amal qiladi: {t}',
    resendIn: 'Qayta yuborish: {t}',
    resend: 'Qayta yuborish',
    sign: 'Imzolash',
    cancel: 'Bekor qilish',
    invalid: "Kod noto'g'ri, {n} urinish qoldi",
    invalidNoCount: "Kod noto'g'ri",
    expired: "Kod muddati o'tdi, qaytadan oling",
    locked: "Urinishlar tugadi, keyinroq urinib ko'ring",
    docChanged: "Hujjat o'zgargan, qaytadan oching",
    required: 'Bu amal elektron imzo talab qiladi — kod oling',
    challengeFailed: "Kod yuborilmadi. Qayta urinib ko'ring",
    docTypes: {
      act: 'Dalolatnoma',
      contract: 'Qarz shartnomasi',
      contract_approve: 'Qarz shartnomasini tasdiqlash',
      refund_full: "Qarzni to'liq qaytarish dalolatnomasi",
      refund_partial: 'Qarzni qisman qaytarish dalolatnomasi',
      extension_request: "Muddatni uzaytirish so'rovi",
      extension: 'Qarz muddatini uzaytirish dalolatnomasi',
      forgiveness: 'Qarzdan voz kechish dalolatnomasi',
      repayment_confirm_full: "To'liq qaytarishni tasdiqlash",
      repayment_confirm_partial: 'Qisman qaytarishni tasdiqlash',
      time_confirm: 'Muddat uzaytirishni tasdiqlash',
    },
    eventsTitle: "Imzolash varag'i",
    eventSigned: 'imzoladi',
    eventRejected: 'rad etdi',
    eventSession: 'sessiya orqali tasdiqladi',
    methodTelegram: 'Telegram kodi',
    methodSms: 'SMS kodi',
    methodSession: 'Tizim sessiyasi',
  },
  kr: {
    title: 'Электрон имзо',
    rejectTitle: 'Рад этишни тасдиқланг',
    rejectMessage: 'Ҳақиқатан ҳам рад этмоқчимисиз? Бу амални ортга қайтариб бўлмайди.',
    rejectConfirm: 'Рад этиш',
    docType: 'Ҳужжат',
    lender: 'Қарз берувчи',
    borrower: 'Қарз олувчи',
    amount: 'Сумма',
    dueDate: 'Қайтариш муддати',
    newDueDate: 'Янги муддат',
    number: 'Шартнома рақами',
    consent: 'Шартлар билан танишдим ва электрон имзо билан имзолайман',
    getCode: 'Код олиш',
    sentTo: '{channel} орқали {dest} га код юборилди',
    channelTelegram: 'Telegram',
    channelSms: 'SMS',
    codeLabel: '6 хонали код',
    expiresIn: 'Код амал қилади: {t}',
    resendIn: 'Қайта юбориш: {t}',
    resend: 'Қайта юбориш',
    sign: 'Имзолаш',
    cancel: 'Бекор қилиш',
    invalid: 'Код нотўғри, {n} уриниш қолди',
    invalidNoCount: 'Код нотўғри',
    expired: 'Код муддати ўтди, қайтадан олинг',
    locked: 'Уринишлар тугади, кейинроқ уриниб кўринг',
    docChanged: 'Ҳужжат ўзгарган, қайтадан очинг',
    required: 'Бу амал электрон имзо талаб қилади — код олинг',
    challengeFailed: 'Код юборилмади. Қайта уриниб кўринг',
    docTypes: {
      act: 'Далолатнома',
      contract: 'Қарз шартномаси',
      contract_approve: 'Қарз шартномасини тасдиқлаш',
      refund_full: 'Қарзни тўлиқ қайтариш далолатномаси',
      refund_partial: 'Қарзни қисман қайтариш далолатномаси',
      extension_request: 'Муддатни узайтириш сўрови',
      extension: 'Қарз муддатини узайтириш далолатномаси',
      forgiveness: 'Қарздан воз кечиш далолатномаси',
      repayment_confirm_full: 'Тўлиқ қайтаришни тасдиқлаш',
      repayment_confirm_partial: 'Қисман қайтаришни тасдиқлаш',
      time_confirm: 'Муддат узайтиришни тасдиқлаш',
    },
    eventsTitle: 'Имзолаш варағи',
    eventSigned: 'имзолади',
    eventRejected: 'рад этди',
    eventSession: 'сессия орқали тасдиқлади',
    methodTelegram: 'Telegram коди',
    methodSms: 'SMS коди',
    methodSession: 'Тизим сессияси',
  },
  ru: {
    title: 'Электронная подпись',
    rejectTitle: 'Подтвердите отказ',
    rejectMessage: 'Вы действительно хотите отклонить? Это действие нельзя отменить.',
    rejectConfirm: 'Отклонить',
    docType: 'Документ',
    lender: 'Займодавец',
    borrower: 'Заёмщик',
    amount: 'Сумма',
    dueDate: 'Срок возврата',
    newDueDate: 'Новый срок',
    number: 'Номер договора',
    consent: 'Я ознакомился с условиями и подписываю электронной подписью',
    getCode: 'Получить код',
    sentTo: 'Код отправлен через {channel} на {dest}',
    channelTelegram: 'Telegram',
    channelSms: 'SMS',
    codeLabel: '6-значный код',
    expiresIn: 'Код действует: {t}',
    resendIn: 'Повторная отправка: {t}',
    resend: 'Отправить повторно',
    sign: 'Подписать',
    cancel: 'Отмена',
    invalid: 'Неверный код, осталось попыток: {n}',
    invalidNoCount: 'Неверный код',
    expired: 'Срок действия кода истёк, получите новый',
    locked: 'Попытки исчерпаны, попробуйте позже',
    docChanged: 'Документ изменился, откройте его заново',
    required: 'Это действие требует электронной подписи — получите код',
    challengeFailed: 'Не удалось отправить код. Попробуйте ещё раз',
    docTypes: {
      act: 'Акт',
      contract: 'Договор займа',
      contract_approve: 'Подтверждение договора займа',
      refund_full: 'Акт полного возврата долга',
      refund_partial: 'Акт частичного возврата долга',
      extension_request: 'Запрос на продление срока',
      extension: 'Акт продления срока займа',
      forgiveness: 'Акт прощения долга',
      repayment_confirm_full: 'Подтверждение полного возврата',
      repayment_confirm_partial: 'Подтверждение частичного возврата',
      time_confirm: 'Подтверждение продления срока',
    },
    eventsTitle: 'Лист подписания',
    eventSigned: 'подписал(а)',
    eventRejected: 'отклонил(а)',
    eventSession: 'подтвердил(а) через сессию',
    methodTelegram: 'код Telegram',
    methodSms: 'SMS-код',
    methodSession: 'Сессия системы',
  },
  en: {
    title: 'Electronic signature',
    rejectTitle: 'Confirm rejection',
    rejectMessage: 'Do you really want to reject? This action cannot be undone.',
    rejectConfirm: 'Reject',
    docType: 'Document',
    lender: 'Lender',
    borrower: 'Borrower',
    amount: 'Amount',
    dueDate: 'Due date',
    newDueDate: 'New due date',
    number: 'Contract number',
    consent: 'I have read the terms and sign with an electronic signature',
    getCode: 'Get code',
    sentTo: 'A code was sent via {channel} to {dest}',
    channelTelegram: 'Telegram',
    channelSms: 'SMS',
    codeLabel: '6-digit code',
    expiresIn: 'Code valid for: {t}',
    resendIn: 'Resend in: {t}',
    resend: 'Resend',
    sign: 'Sign',
    cancel: 'Cancel',
    invalid: 'Wrong code, {n} attempts left',
    invalidNoCount: 'Wrong code',
    expired: 'The code has expired, request a new one',
    locked: 'No attempts left, please try again later',
    docChanged: 'The document has changed, please open it again',
    required: 'This action requires an electronic signature — request a code',
    challengeFailed: 'The code could not be sent. Please try again',
    docTypes: {
      act: 'Act',
      contract: 'Loan agreement',
      contract_approve: 'Loan agreement approval',
      refund_full: 'Full repayment act',
      refund_partial: 'Partial repayment act',
      extension_request: 'Term extension request',
      extension: 'Loan term extension act',
      forgiveness: 'Debt forgiveness act',
      repayment_confirm_full: 'Full repayment confirmation',
      repayment_confirm_partial: 'Partial repayment confirmation',
      time_confirm: 'Term extension confirmation',
    },
    eventsTitle: 'Signature sheet',
    eventSigned: 'signed',
    eventRejected: 'rejected',
    eventSession: 'confirmed via session',
    methodTelegram: 'Telegram code',
    methodSms: 'SMS code',
    methodSession: 'System session',
  },
  kaa: {
    title: 'Elektron qol',
    rejectTitle: 'Biykar etiwdi tastıyıqlań',
    rejectMessage: 'Haqıyqatında da biykar etpekshisiz be? Bul ámeldi keyin qaytarıp bolmaydı.',
    rejectConfirm: 'Biykar etiw',
    docType: 'Hújjet',
    lender: 'Qarız beriwshi',
    borrower: 'Qarız alıwshı',
    amount: 'Summa',
    dueDate: 'Qaytarıw múddeti',
    newDueDate: 'Jańa múddet',
    number: 'Shártnama nomeri',
    consent: 'Shártler menen tanıstım hám elektron qol menen qol qoyaman',
    getCode: 'Kod alıw',
    sentTo: '{channel} arqalı {dest} nomerine kod jiberildi',
    channelTelegram: 'Telegram',
    channelSms: 'SMS',
    codeLabel: '6 xanalı kod',
    expiresIn: 'Kod ámel etedi: {t}',
    resendIn: 'Qayta jiberiw: {t}',
    resend: 'Qayta jiberiw',
    sign: 'Qol qoyıw',
    cancel: 'Biykarlaw',
    invalid: 'Kod qáte, {n} urınıw qaldı',
    invalidNoCount: 'Kod qáte',
    expired: 'Kodtıń múddeti ótti, qaytadan alıń',
    locked: 'Urınıwlar tamamlandı, keyinirek urınıp kóriń',
    docChanged: 'Hújjet ózgergen, qaytadan ashıń',
    required: 'Bul ámel elektron qoldı talap etedi — kod alıń',
    challengeFailed: 'Kod jiberilmedi. Qayta urınıp kóriń',
    docTypes: {
      act: 'Dalolatnama',
      contract: 'Qarız shártnaması',
      contract_approve: 'Qarız shártnamasın tastıyıqlaw',
      refund_full: 'Qarızdı tolıq qaytarıw dalolatnaması',
      refund_partial: 'Qarızdı bólekley qaytarıw dalolatnaması',
      extension_request: 'Múddetti uzaytıw sorawı',
      extension: 'Qarız múddetin uzaytıw dalolatnaması',
      forgiveness: 'Qarızdan bas tartıw dalolatnaması',
      repayment_confirm_full: 'Tolıq qaytarıwdı tastıyıqlaw',
      repayment_confirm_partial: 'Bólekley qaytarıwdı tastıyıqlaw',
      time_confirm: 'Múddet uzaytıwdı tastıyıqlaw',
    },
    eventsTitle: 'Qol qoyıw paraǵı',
    eventSigned: 'qol qoydı',
    eventRejected: 'biykar etti',
    eventSession: 'sessiya arqalı tastıyıqladı',
    methodTelegram: 'Telegram kodı',
    methodSms: 'SMS kodı',
    methodSession: 'Sistema sessiyası',
  },
};

export const signTexts = (locale) => SIGN_TEXTS[locale] || SIGN_TEXTS.uz;

/** Imzo xatosi → foydalanuvchi matni (shu tilda). */
export function signErrorText(err, locale) {
  const T = signTexts(locale);
  if (!err) {return '';}
  switch (err.code) {
    case SIGN_ERRORS.INVALID:
      return err.attemptsLeft != null ? fill(T.invalid, { n: err.attemptsLeft }) : T.invalidNoCount;
    case SIGN_ERRORS.EXPIRED: return T.expired;
    case SIGN_ERRORS.LOCKED: return T.locked;
    case SIGN_ERRORS.DOC_CHANGED: return T.docChanged;
    case SIGN_ERRORS.REQUIRED: return T.required;
    default: return '';
  }
}

/** Imzolash varag'i qatori: usul matni. */
export function signMethodText(method, locale) {
  const T = signTexts(locale);
  if (method === 'otp_telegram') {return T.methodTelegram;}
  if (method === 'otp_sms') {return T.methodSms;}
  return T.methodSession;
}

/** Imzolash varag'i qatori: harakat matni. */
export function signActionText(action, locale) {
  const T = signTexts(locale);
  if (action === 'reject') {return T.eventRejected;}
  if (action === 'session') {return T.eventSession;}
  return T.eventSigned;
}

/**
 * Komponentlar uchun yagona kirish: `$sign` bo'lsa imzo oynasi orqali, bo'lmasa (test/SSR) to'g'ridan-to'g'ri.
 * @returns {Promise<any|null>} submit natijasi; foydalanuvchi oynani yopsa — null
 */
export function signAndSend(vm, opts) {
  if (vm && vm.$sign && typeof vm.$sign.run === 'function') {return vm.$sign.run(opts);}
  return opts.submit(undefined);
}

/** Rad etish (stype 2) — kodsiz, lekin tasdiqlash oynasi bilan. `$sign` bo'lmasa — tasdiqlangan deb hisoblanadi. */
export function confirmReject(vm) {
  if (vm && vm.$sign && typeof vm.$sign.confirmReject === 'function') {return vm.$sign.confirmReject();}
  return Promise.resolve(true);
}
