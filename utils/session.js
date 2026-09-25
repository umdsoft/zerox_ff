/**
 * SS-SEC (2026-09-25): sessiya tozalash — BITTA joyda.
 *
 * Ilgari logout uch xil yo'ldan bo'lardi (cabinet handleLogout, AdminMenu/status `$auth.logout()`,
 * axios performSessionLogout) va faqat cabinet/axios per-user keshlarni tozalardi; `$auth.logout()`
 * to'g'ridan-to'g'ri chaqirilganda refresh token (`zx_rt`) va keshlar (balans, bildirishnomalar)
 * localStorage'da QOLIB KETARDI. Endi barcha yo'llar shu funksiyani chaqiradi
 * (plugins/auth-logout.client.js `$auth.logout` ni o'raydi).
 */
import { clearRefreshToken } from './tokenStorage';

/** Foydalanuvchiga tegishli localStorage kalitlari (til/tema saqlanadi) */
export const PER_USER_LOCAL_KEYS = [
  'user_balance',
  'user_notifications',
  'zx_xodim_session',
  'zx_owner_prev_token',
  'zx_goal_categories',
  'zx_goal_hidden',
  'contracts_cache',
  'contracts_cache_time',
  'refreshToken', // legacy
];

/** Foydalanuvchiga tegishli sessionStorage kalitlari */
export const PER_USER_SESSION_KEYS = [
  'sent_header_sync',
  'zx_tg_pin', // Telegram PIN ticket
];

/**
 * Refresh token + barcha per-user keshlarni tozalaydi. Xatosiz (best-effort).
 * @param {Object} [opts]
 * @param {boolean} [opts.keepXodimFlag] - xodim sessiya bayrog'ini saqlab qolish
 */
export function clearUserSession(opts = {}) {
  try { clearRefreshToken(); } catch (_) { /* jim */ }
  try {
    PER_USER_LOCAL_KEYS.forEach((k) => {
      if (opts.keepXodimFlag && k === 'zx_xodim_session') return;
      localStorage.removeItem(k);
    });
  } catch (_) { /* jim */ }
  try {
    PER_USER_SESSION_KEYS.forEach((k) => sessionStorage.removeItem(k));
  } catch (_) { /* jim */ }
}

export default { clearUserSession, PER_USER_LOCAL_KEYS, PER_USER_SESSION_KEYS };
