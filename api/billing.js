/** Obuna / tarif. Hozircha sahifalarga ulanmagan (keyingi to'lqin) — faqat tasdiqlangan GET'lar. */
/** GET /finance/subscription (sahifalarda odatda `{ silent: true }`) */
export const getSubscription = (axios, config) => axios.$get('/finance/subscription', config);
