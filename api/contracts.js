/**
 * Shartnoma ro'yxati sahifalari (debt-list, credit-list, expired, near-expiration, hisobot,
 * near-expiration-creditor-notification) uchun endpointlar. URL satrlari sahifalardagi bilan aynan bir xil.
 * Hammasi `axios.$get` (javob `data` qaytadi). `config` — ixtiyoriy (masalan `{ silent: true }`).
 */

/** GET /contract/return — debt-list (debitor), credit-list (creditor) */
export const getReturnList = (axios, { type, page, limit, start, end }, config) =>
  axios.$get(`/contract/return?type=${type}&page=${page}&limit=${limit}&start=${start}&end=${end}`, config);

/** GET /contract/exp-return */
export const getReturnExport = (axios, { type }, config) =>
  axios.$get(`/contract/exp-return?type=${type}`, config);

/** GET /contract/expired */
export const getExpiredList = (axios, { type, page, limit, start, end }, config) =>
  axios.$get(`/contract/expired?type=${type}&page=${page}&limit=${limit}&start=${start}&end=${end}`, config);

/** GET /contract/exp-expired */
export const getExpiredExport = (axios, { type }, config) =>
  axios.$get(`/contract/exp-expired?type=${type}`, config);

/** GET /contract/near — day/currency: allaqachon `|| ''` bilan tayyorlangan satrlar */
export const getNearList = (axios, { type, day, page, limit, currency }, config) =>
  axios.$get(`/contract/near?type=${type}&day=${day}&page=${page}&limit=${limit}&currency=${currency}`, config);

/** GET /contract/exp-near */
export const getNearExport = (axios, { type, day, currency }, config) =>
  axios.$get(`/contract/exp-near?type=${type}&day=${day}&currency=${currency}`, config);

/** GET /contract/report — hisobot */
export const getReportList = (axios, { type, status, page, limit, start, end }, config) =>
  axios.$get(`/contract/report?type=${type}&status=${status}&page=${page}&limit=${limit}&start=${start}&end=${end}`, config);

/** GET /contract/exp-report */
export const getReportExport = (axios, { type, status, start, end }, config) =>
  axios.$get(`/contract/exp-report?type=${type}&status=${status}&start=${start}&end=${end}`, config);

/** GET /contract/near-notification (kreditor eslatmalari) */
export const getNearNotificationList = (axios, { type, page, limit }, config) =>
  axios.$get(`/contract/near-notification?type=${type}&page=${page}&limit=${limit}`, config);

/** GET /contract/exp-near (kreditor eslatmalari sahifasi: day parametrisiz) */
export const getNearExportByCurrency = (axios, { type, currency }, config) =>
  axios.$get(`/contract/exp-near?type=${type}&currency=${currency}`, config);
