/** Obuna / tarif. */
/** GET /finance/subscription (sahifalarda odatda `{ silent: true }`) */
export const getSubscription = (axios, config) => axios.$get('/finance/subscription', config);

/** POST /finance/subscription/purchase-from-balance — tarifni Mobil hisob balansidan sotib olish */
export const purchasePlanFromBalance = (axios, data, config) => axios.post('/finance/subscription/purchase-from-balance', data, config);
/** POST /finance/subscription/purchase-addon-from-balance — qo'shimcha SMS paketi (balansdan) */
export const purchaseAddonFromBalance = (axios, data, config) => axios.post('/finance/subscription/purchase-addon-from-balance', data, config);

/** GET /finance/subscription/sms-stats */
export const getSubscriptionSmsStats = (axios, config) => axios.$get('/finance/subscription/sms-stats', config);
/** GET /finance/subscription/sms-history */
export const getSubscriptionSmsHistory = (axios, config) => axios.$get('/finance/subscription/sms-history', config);
/** POST /finance/payment/debt/:param/pay (to'liq response) */
export const postPaymentDebtPay = (axios, code, data, config) => axios.post(`/finance/payment/debt/${code}/pay`, data, config);
/** POST /finance/payment/create-sms-package (to'liq response) */
export const postPaymentCreateSmsPackage = (axios, data, config) => axios.post('/finance/payment/create-sms-package', data, config);
