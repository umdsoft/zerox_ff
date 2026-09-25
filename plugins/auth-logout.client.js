/**
 * SS-SEC (2026-09-25): `$auth.logout()` o'rami — chiqishda refresh token (`zx_rt`) va
 * barcha per-user keshlar ham tozalanadi (utils/session.js). Ilgari AdminMenu/status
 * sahifasidagi to'g'ridan-to'g'ri `$auth.logout()` bularni qoldirib ketardi.
 * `auth.plugins` orqali ro'yxatga olinadi — `app.$auth` tayyor.
 */
import { clearUserSession } from '@/utils/session';

export default function ({ app }) {
  const $auth = app && app.$auth;
  if (!$auth || typeof $auth.logout !== 'function' || $auth.__zxLogoutWrapped) return;
  $auth.__zxLogoutWrapped = true;
  const original = $auth.logout.bind($auth);
  $auth.logout = async function (...args) {
    clearUserSession();
    try { if (app.$socketManager && app.$socketManager.disconnect) app.$socketManager.disconnect(); } catch (_) { /* jim */ }
    try {
      return await original(...args);
    } finally {
      clearUserSession(); // auth-next tozalashidan keyin ham (poyga bo'lmasin)
    }
  };
}
