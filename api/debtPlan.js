/**
 * wave C: debtPlan — raw `$axios` chaqiruvlari shu yerga ko'chirildi (URL, metod, config sahifadagidek; `$get` -> data, `get` -> to'liq response).
 */

/** GET /finance/debt-plan/reminders/:param */
export const getDebtPlanRemindersByReminderId = (axios, reminderId, config) =>
  axios.$get(`/finance/debt-plan/reminders/${reminderId}`, config);
/** POST /finance/debt-plan/reminders/:param/pay */
export const postDebtPlanRemindersPay = (axios, reminderId, data, config) =>
  axios.$post(`/finance/debt-plan/reminders/${reminderId}/pay`, data, config);
/** GET /finance/debt-plan */
export const getDebtPlan = (axios, config) => axios.$get('/finance/debt-plan', config);
/** POST /finance/debt-plan/simulate */
export const postDebtPlanSimulate = (axios, data, config) => axios.$post('/finance/debt-plan/simulate', data, config);
/** PATCH /finance/debts/:param/plan */
export const patchDebtsPlan = (axios, debtId, data, config) => axios.$patch(`/finance/debts/${debtId}/plan`, data, config);
/** GET /finance/debt-plan/month */
export const getDebtPlanMonth = (axios, config) => axios.$get('/finance/debt-plan/month', config);
/** GET /finance/debt-plan/daily-limit */
export const getDebtPlanDailyLimit = (axios, config) => axios.$get('/finance/debt-plan/daily-limit', config);
/** GET /finance/debt-plan/suggestions */
export const getDebtPlanSuggestions = (axios, config) => axios.$get('/finance/debt-plan/suggestions', config);
/** PUT /finance/debt-plan */
export const putDebtPlan = (axios, data, config) => axios.$put('/finance/debt-plan', data, config);
