/** Foydalanuvchi. Hozircha sahifalarga ulanmagan (keyingi to'lqin). */
/** GET /user/me (sahifalarda config: `{ silent: true }` yoki `{ background: true }`) */
export const getMe = (axios, config) => axios.$get('/user/me', config);
