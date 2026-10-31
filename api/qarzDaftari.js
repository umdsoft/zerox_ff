/** Qarz daftari. Hozircha sahifalarga ulanmagan (keyingi to'lqin). */
/** GET /qarz-daftari/savdo-faoliyat (sahifalarda `{ silent: true }`) */
export const listShops = (axios, config) => axios.$get('/qarz-daftari/savdo-faoliyat', config);
/** GET /qarz-daftari/dashboard */
export const getDashboard = (axios, config) => axios.$get('/qarz-daftari/dashboard', config);
