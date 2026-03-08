export default function ({ $auth, redirect, app }) {
    // Foydalanuvchi avtorizatsiya qilinmagan bo'lsa
    if (!$auth?.loggedIn) {
        app.i18n?.setLocaleCookie?.(app.i18n?.locale);
        return redirect(app.localePath?.({ name: 'auth-login' }) || '/auth/login');
    }
}