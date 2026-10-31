/**
 * Moliya: rejalangan to'lovlar / kutilayotgan daromadlar. Hammasi `axios.get/post/put/delete`
 * (to'liq response qaytadi — sahifalar `res.data.success` ni o'qiydi). URL'lar sahifalardagi bilan aynan bir xil.
 * `/finance/expenses/categories` `$api.getCached` orqali keshlanadi (services/api.js) — shu sabab bu yerda xom.
 */

// ---- rejalangan to'lovlar (finance/payments) ----
export const listScheduledPayments = (axios) => axios.get('/finance/scheduled-payments');
export const createScheduledPayment = (axios, payload) => axios.post('/finance/scheduled-payments', payload);
export const updateScheduledPayment = (axios, id, payload) => axios.put(`/finance/scheduled-payments/${id}`, payload);
export const confirmScheduledPayment = (axios, id) => axios.post(`/finance/scheduled-payments/${id}/confirm`);
export const skipScheduledPayment = (axios, id) => axios.post(`/finance/scheduled-payments/${id}/skip`);
export const deleteScheduledPayment = (axios, id) => axios.delete(`/finance/scheduled-payments/${id}`);
export const getScheduledPaymentHistory = (axios, id) => axios.get(`/finance/scheduled-payments/${id}/history`);
export const listExpenseCategories = (axios) => axios.get('/finance/expenses/categories');

// ---- kutilayotgan daromadlar (finance/expected-income) ----
export const listScheduledIncomes = (axios) => axios.get('/finance/scheduled-incomes');
export const createScheduledIncome = (axios, payload) => axios.post('/finance/scheduled-incomes', payload);
export const updateScheduledIncome = (axios, id, payload) => axios.put(`/finance/scheduled-incomes/${id}`, payload);
export const confirmScheduledIncome = (axios, id) => axios.post(`/finance/scheduled-incomes/${id}/confirm`);
export const skipScheduledIncome = (axios, id) => axios.post(`/finance/scheduled-incomes/${id}/skip`);
export const deleteScheduledIncome = (axios, id) => axios.delete(`/finance/scheduled-incomes/${id}`);
export const getScheduledIncomeHistory = (axios, id) => axios.get(`/finance/scheduled-incomes/${id}/history`);
export const listIncomeCategories = (axios) => axios.get('/finance/incomes/categories');

/** GET /finance/debts/allocation-params */
export const getDebtsAllocationParams = (axios, config) => axios.$get('/finance/debts/allocation-params', config);
/** GET /finance/expenses (to'liq response) */
export const getExpenses = (axios, config) => axios.get('/finance/expenses', config);
/** GET /finance/incomes (to'liq response) */
export const getIncomes = (axios, config) => axios.get('/finance/incomes', config);
/** POST /finance/family/:param/respond (to'liq response) */
export const postFamilyRespond = (axios, linkId, data, config) => axios.post(`/finance/family/${linkId}/respond`, data, config);
/** GET /finance/payout-card (to'liq response) */
export const getPayoutCard = (axios, config) => axios.get('/finance/payout-card', config);
/** GET /finance/export/trends (to'liq response) */
export const getExportTrends = (axios, config) => axios.get('/finance/export/trends', config);
/** GET /finance/export/finance-excel (to'liq response) */
export const getExportFinanceExcel = (axios, config) => axios.get('/finance/export/finance-excel', config);
/** GET /finance/budgets/limits-status (to'liq response) */
export const getBudgetsLimitsStatus = (axios, config) => axios.get('/finance/budgets/limits-status', config);
/** DELETE /finance/budgets/general (to'liq response) */
export const deleteBudgetsGeneral = (axios, config) => axios.delete('/finance/budgets/general', config);
/** GET /finance/debtors */
export const getDebtors = (axios, config) => axios.$get('/finance/debtors', config);
/** GET /finance/debtors/:param */
export const getDebtorsById = (axios, id, config) => axios.$get(`/finance/debtors/${id}`, config);
/** GET /finance/export/debt-analytics */
export const getExportDebtAnalytics = (axios, config) => axios.$get('/finance/export/debt-analytics', config);
/** GET /finance/export/monthly-report */
export const getExportMonthlyReport = (axios, config) => axios.$get('/finance/export/monthly-report', config);
/** GET /finance/expenses/:param (to'liq response) */
export const getExpensesByEditId = (axios, editId, config) => axios.get(`/finance/expenses/${editId}`, config);
/** GET /finance/incomes/:param (to'liq response) */
export const getIncomesByEditId = (axios, editId, config) => axios.get(`/finance/incomes/${editId}`, config);
/** GET /finance/daily-reminder */
export const getDailyReminder = (axios, config) => axios.$get('/finance/daily-reminder', config);

/** GET /finance/debt-reminder (shaxsiy qarz eslatmasi sozlamalari) */
export const getDebtReminder = (axios, config) => axios.$get('/finance/debt-reminder', config);
/** PUT /finance/debt-reminder */
export const putDebtReminder = (axios, data, config) => axios.$put('/finance/debt-reminder', data, config);
/** PUT /finance/daily-reminder */
export const putDailyReminder = (axios, data, config) => axios.$put('/finance/daily-reminder', data, config);
