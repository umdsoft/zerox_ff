/** Qarz daftari. */
/** GET /qarz-daftari/savdo-faoliyat (sahifalarda `{ silent: true }`) */
export const listShops = (axios, config) => axios.$get('/qarz-daftari/savdo-faoliyat', config);
/** GET /qarz-daftari/dashboard */
export const getDashboard = (axios, config) => axios.$get('/qarz-daftari/dashboard', config);

/** GET /qarz-daftari/sms/undelivered */
export const getSmsUndelivered = (axios, config) => axios.$get('/qarz-daftari/sms/undelivered', config);
/** PUT /qarz-daftari/mijozlar/:param */
export const putMijozlarById = (axios, id, data, config) => axios.$put(`/qarz-daftari/mijozlar/${id}`, data, config);
/** POST /qarz-daftari/savdo-faoliyat/:param/mijozlar */
export const postSavdoFaoliyatMijozlar = (axios, faoliyatId, data, config) =>
  axios.$post(`/qarz-daftari/savdo-faoliyat/${faoliyatId}/mijozlar`, data, config);
/** GET /qarz-daftari/kalendar */
export const getKalendar = (axios, config) => axios.$get('/qarz-daftari/kalendar', config);
/** GET /qarz-daftari/kalendar/kun */
export const getKalendarKun = (axios, config) => axios.$get('/qarz-daftari/kalendar/kun', config);
/** GET /qarz-daftari/savdo-faoliyat/:param/xodimlar */
export const getSavdoFaoliyatXodimlar = (axios, id, config) => axios.$get(`/qarz-daftari/savdo-faoliyat/${id}/xodimlar`, config);
/** PUT /qarz-daftari/savdo-faoliyat/:param */
export const putSavdoFaoliyatById = (axios, id, data, config) => axios.$put(`/qarz-daftari/savdo-faoliyat/${id}`, data, config);
/** GET /qarz-daftari/savdo-faoliyat/:param/eslatma */
export const getSavdoFaoliyatEslatma = (axios, id, config) => axios.$get(`/qarz-daftari/savdo-faoliyat/${id}/eslatma`, config);
/** PUT /qarz-daftari/savdo-faoliyat/:param/eslatma */
export const putSavdoFaoliyatEslatma = (axios, id, data, config) => axios.$put(`/qarz-daftari/savdo-faoliyat/${id}/eslatma`, data, config);
/** POST /qarz-daftari/savdo-faoliyat */
export const postSavdoFaoliyat = (axios, data, config) => axios.$post('/qarz-daftari/savdo-faoliyat', data, config);
/** PUT /qarz-daftari/xodimlar/:param */
export const putXodimlarById = (axios, id, data, config) => axios.$put(`/qarz-daftari/xodimlar/${id}`, data, config);
/** POST /qarz-daftari/savdo-faoliyat/:param/xodimlar */
export const postSavdoFaoliyatXodimlar = (axios, faoliyatId, data, config) =>
  axios.$post(`/qarz-daftari/savdo-faoliyat/${faoliyatId}/xodimlar`, data, config);
/** GET /qarz-daftari/sms-history */
export const getSmsHistory = (axios, config) => axios.$get('/qarz-daftari/sms-history', config);
/** POST /qarz-daftari/qarz/:param/talab */
export const postQarzTalab = (axios, id, data, config) => axios.$post(`/qarz-daftari/qarz/${id}/talab`, data, config);
/** GET /qarz-daftari/savdo-faoliyat/:param/mijozlar */
export const getSavdoFaoliyatMijozlar = (axios, faoliyatId, config) =>
  axios.$get(`/qarz-daftari/savdo-faoliyat/${faoliyatId}/mijozlar`, config);
/** POST /qarz-daftari/qarz (to'liq response) */
export const postQarz = (axios, data, config) => axios.post('/qarz-daftari/qarz', data, config);
/** DELETE /qarz-daftari/xodimlar/:param (to'liq response) */
export const deleteXodimlarById = (axios, id, config) => axios.delete(`/qarz-daftari/xodimlar/${id}`, config);
/** GET /qarz-daftari/near-expiration */
export const getNearExpiration = (axios, config) => axios.$get('/qarz-daftari/near-expiration', config);
/** GET /qarz-daftari/mijozlar/:param/history */
export const getMijozlarHistory = (axios, id, config) => axios.$get(`/qarz-daftari/mijozlar/${id}/history`, config);
/** GET /qarz-daftari/mijozlar/:param/tavsiya */
export const getMijozlarTavsiya = (axios, id, config) => axios.$get(`/qarz-daftari/mijozlar/${id}/tavsiya`, config);
/** GET /qarz-daftari/qarz/:param/tolovlar */
export const getQarzTolovlar = (axios, id, config) => axios.$get(`/qarz-daftari/qarz/${id}/tolovlar`, config);
/** PUT /qarz-daftari/tolov/:param/tolandi */
export const putTolovTolandi = (axios, tolovId, data, config) => axios.$put(`/qarz-daftari/tolov/${tolovId}/tolandi`, data, config);
/** GET /qarz-daftari/qarz/:param */
export const getQarzById = (axios, id, config) => axios.$get(`/qarz-daftari/qarz/${id}`, config);
/** PUT /qarz-daftari/tolov/:param/tolandi (to'liq response) */
export const putTolovTolandiResponse = (axios, tolovId, data, config) => axios.put(`/qarz-daftari/tolov/${tolovId}/tolandi`, data, config);
/** GET /qarz-daftari/qarz/:param/kvitansiya */
export const getQarzKvitansiya = (axios, id, config) => axios.$get(`/qarz-daftari/qarz/${id}/kvitansiya`, config);
/** POST /qarz-daftari/qarz/:param/voz-kechish */
export const postQarzVozKechish = (axios, id, data, config) => axios.$post(`/qarz-daftari/qarz/${id}/voz-kechish`, data, config);
/** POST /qarz-daftari/qarz/:param/yopish */
export const postQarzYopish = (axios, id, data, config) => axios.$post(`/qarz-daftari/qarz/${id}/yopish`, data, config);
/** GET /qarz-daftari/qarzlar */
export const getQarzlar = (axios, config) => axios.$get('/qarz-daftari/qarzlar', config);
/** POST /qarz-daftari/xodim/login (to'liq response) */
export const postXodimLogin = (axios, data, config) => axios.post('/qarz-daftari/xodim/login', data, config);
