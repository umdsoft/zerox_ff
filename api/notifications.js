/** Bildirishnomalar. Hozircha sahifalarga ulanmagan (keyingi to'lqin). */
/** GET /notification/me (sahifalarda `{ falseLoading: true }`, Header'da `+ silent: true`) */
export const getMyNotifications = (axios, config) => axios.$get('/notification/me', config);
