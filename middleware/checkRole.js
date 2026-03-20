export default function ({ $auth, redirect, app }) {
  if ($auth.user && $auth.user.role !== 1) {
    redirect(app.localePath({ name: 'auth-login' }));
  }
}
