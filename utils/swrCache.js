/**
 * SS-PERF (2026-10-01), 01.10 hujjati: "har bir sahifa ochilishidan oldin aylana aylanadi".
 *
 * Stale-while-revalidate uchun kichik XOTIRADAGI (in-memory) kesh. Sahifa qayta ochilganda
 * oxirgi ma'lumot DARHOL ko'rsatiladi (aylana yo'q), shu bilan birga fonda yangisi so'raladi
 * va kelgach almashtiriladi.
 *
 * Xavfsizlik:
 *  - faqat xotirada (localStorage/sessionStorage EMAS) — sahifa yangilanganda yo'qoladi;
 *  - kalit foydalanuvchi ID'si bilan — boshqa foydalanuvchi eski ma'lumotni ko'rmaydi;
 *  - logout'da tozalanadi (utils/session.js `clearUserSession`).
 */

/** Keshdagi yozuv ko'rsatilishi mumkin bo'lgan eng katta yosh (keyin baribir tarmoqdan) */
export const SWR_MAX_AGE_MS = 10 * 60 * 1000;
const MAX_ENTRIES = 50;

const entries = new Map(); // `${userId}|${key}` -> { data, at }

/**
 * @param {Object} auth - this.$auth
 * @param {string} key - mantiqiy kalit (masalan '/home/analytics')
 * @returns {string|null}
 */
function scopedKey(auth, key) {
  const user = auth && auth.loggedIn ? auth.user : null;
  const id = user && (user.id != null ? user.id : user.user_id);
  if (id == null || !key) return null;
  return `${id}|${key}`;
}

/**
 * Keshdan o'qish.
 * @param {Object} auth
 * @param {string} key
 * @param {number} [maxAgeMs]
 * @returns {*} saqlangan ma'lumot yoki null
 */
export function swrPeek(auth, key, maxAgeMs = SWR_MAX_AGE_MS) {
  const k = scopedKey(auth, key);
  if (!k) return null;
  const hit = entries.get(k);
  if (!hit) return null;
  if (Date.now() - hit.at > maxAgeMs) {
    entries.delete(k);
    return null;
  }
  return hit.data;
}

/**
 * Keshga yozish (yangi tarmoq javobidan keyin).
 * @param {Object} auth
 * @param {string} key
 * @param {*} data
 */
export function swrPut(auth, key, data) {
  const k = scopedKey(auth, key);
  if (!k || data == null) return;
  if (entries.size >= MAX_ENTRIES && !entries.has(k)) {
    const oldest = entries.keys().next().value;
    entries.delete(oldest);
  }
  entries.set(k, { data, at: Date.now() });
}

/** Barcha yozuvlarni o'chirish (logout / sessiya tugashi) */
export function swrClear() {
  entries.clear();
}

export default { swrPeek, swrPut, swrClear, SWR_MAX_AGE_MS };
