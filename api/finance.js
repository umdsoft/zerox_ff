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
