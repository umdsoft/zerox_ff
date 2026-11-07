/**
 * 07.11 (backend imzolash xavfsizligi F1–F7): qarz shartnomasi amallari ROL bo'yicha cheklandi.
 *
 * Bazada: `contracts.debitor` = QARZ BERUVCHI (lender), `contracts.creditor` = QARZ OLUVCHI (borrower).
 *  - qarz oluvchi: qaytarish (POST /contract/act type 1/2), muddat uzaytirish SO'ROVI (type 3);
 *  - qarz beruvchi: muddatni o'zi uzaytirish (deb-uzay), voz kechish (vos-kechish), talab qilish (talab),
 *    qaytarish / muddat so'rovini tasdiqlash yoki rad etish (/notification/toliq-qaytarish|qisman-qaytarish|time).
 *  - yangi shartnomani (PUT /notification/success) faqat QARSHI tomon tasdiqlaydi (yaratuvchi emas).
 *
 * Server mijoz yuborgan sender/reciver/res/status/type/summalarni e'tiborga olmaydi va rol mos kelmasa
 * 403/400/409 qaytaradi. Bu modul: (1) joriy foydalanuvchi rolini aniqlash, (2) server xato kodini
 * lokallashtirilgan matn kalitiga (lang/*.js `errors.*`) aylantirish.
 */

export const ROLE_LENDER = 'lender';
export const ROLE_BORROWER = 'borrower';

const sameId = (a, b) => a != null && b != null && a !== '' && b !== '' && String(a) === String(b);

/**
 * Joriy foydalanuvchining shartnoma (yoki bildirishnoma) bo'yicha roli.
 * `debitor`/`creditor` — id (raqam/satr) yoki `{ id | _id }` obyekt bo'lishi mumkin.
 * @returns {'lender'|'borrower'|null} null — foydalanuvchi tomon emas (yoki ma'lumot yo'q)
 */
export function contractRoleOf(contract, userId) {
  if (!contract || userId == null) {return null;}
  const idOf = (v) => {
    if (!v || typeof v !== 'object') {return v;}
    return v.id != null ? v.id : v._id;
  };
  if (sameId(idOf(contract.debitor), userId)) {return ROLE_LENDER;}
  if (sameId(idOf(contract.creditor), userId)) {return ROLE_BORROWER;}
  return null;
}

/** Server kodi → lang `errors.*` kaliti. `refresh` — bildirishnomalar ro'yxatini yangilash kerak. */
const CODE_MAP = {
  'only-lender': { key: 'errors.only_lender' },
  'only-borrower': { key: 'errors.only_borrower' },
  'invalid-end-date': { key: 'errors.invalid_end_date' },
  'creator-cannot-approve': { key: 'errors.creator_cannot_approve', refresh: true },
  'already-processed': { key: 'errors.already_processed', refresh: true },
  ALREADY_PROCESSED: { key: 'errors.already_processed', refresh: true },
  // PUT /notification/success: CAS muvaffaqiyatsiz (boshqa so'rov allaqachon tasdiqlagan/rad etgan) — 200 tanada
  'not-con-suc': { key: 'errors.already_processed', refresh: true },
  'notification-type-mismatch': { key: 'errors.notification_mismatch', refresh: true },
  'notification-act-mismatch': { key: 'errors.notification_mismatch', refresh: true },
  'act-type-mismatch': { key: 'errors.notification_mismatch', refresh: true },
  'act-mismatch': { key: 'errors.notification_mismatch', refresh: true },
  'act-required': { key: 'errors.notification_mismatch', refresh: true },
  'not-receiver': { key: 'errors.notification_mismatch', refresh: true },
  'notification-not-found': { key: 'errors.already_processed', refresh: true },
  'not-a-party': { key: 'errors.not_a_party' },
  'invalid-act-type': { key: 'errors.bad_request' },
  'invalid-stype': { key: 'errors.bad_request' },
};

/**
 * Axios xatosi (yoki 200 javob tanasi) → `{ key, refresh, status }` yoki null (tanish kod emas).
 * Backend `msg` ham, `message` ham ishlatadi — ikkalasi tekshiriladi (`code: 'FORBIDDEN'` umumiy, kalit emas).
 * Tanish kodsiz 409 — "allaqachon ko'rib chiqilgan" deb hisoblanadi.
 */
export function contractActionError(errOrData) {
  if (!errOrData) {return null;}
  const res = errOrData.response;
  let data = errOrData.isAxiosError ? null : errOrData; // 200 javob tanasi ({ success:false, msg })
  if (res) {data = res.data;}
  const status = res ? res.status : undefined;
  if (data && typeof data === 'object') {
    for (const k of [data.msg, data.message, data.code]) {
      if (typeof k === 'string' && Object.prototype.hasOwnProperty.call(CODE_MAP, k)) {
        return { ...CODE_MAP[k], refresh: !!CODE_MAP[k].refresh, status };
      }
    }
  }
  if (status === 409) {return { key: 'errors.already_processed', refresh: true, status };}
  return null;
}

/** Rol talabi bo'yicha foydalanuvchiga ko'rsatiladigan matn kaliti (null — ruxsat bor). */
export function roleDeniedKey(contract, userId, requiredRole) {
  if (!requiredRole || !contract) {return null;}
  const role = contractRoleOf(contract, userId);
  if (role === requiredRole) {return null;}
  if (role === null) {return 'errors.not_a_party';}
  return requiredRole === ROLE_LENDER ? 'errors.only_lender' : 'errors.only_borrower';
}
