/**
 * wave C: home — raw `$axios` chaqiruvlari shu yerga ko'chirildi (URL, metod, config sahifadagidek; `$get` -> data, `get` -> to'liq response).
 */

/** GET /dashboard/get-time */
export const getTime = (axios, config) => axios.$get('/dashboard/get-time', config);
/** GET /home/my?type=debitor */
export const getMyTypeDebitor = (axios, config) => axios.$get("/home/my?type=debitor", config);
/** GET /home/my?type=creditor */
export const getMyTypeCreditor = (axios, config) => axios.$get("/home/my?type=creditor", config);
/** GET /home/financial-health */
export const getFinancialHealth = (axios, config) => axios.$get('/home/financial-health', config);
/** GET /home/analytics */
export const getAnalytics = (axios, config) => axios.$get('/home/analytics', config);
/** GET /home/cs?status=:param */
export const getCsStatus = (axios, st, config) => axios.$get(`/home/cs?status=${st}`, config);
/** GET /home/hisob */
export const getHisob = (axios, config) => axios.$get("/home/hisob", config);
/** GET /home/by/:param?type=debitor (to'liq response) */
export const getByTypeDebitorById = (axios, id, config) => axios.get(`/home/by/${id}?type=debitor`, config);
/** GET /home/by/:param?type=creditor (to'liq response) */
export const getByTypeCreditorById = (axios, id, config) => axios.get(`/home/by/${id}?type=creditor`, config);
