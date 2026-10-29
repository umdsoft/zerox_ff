/**
 * 28.10: bildirishnomalar (toast) yangi ko'rinishi/xatti-harakati — utils/toastUi.js.
 * `$toast` (@nuxtjs/toast) ni bir marta o'raydi; barcha sahifa va axios interceptor shu obyektdan foydalanadi.
 */
import { installToastUi } from '~/utils/toastUi'

export default function ({ app }) {
  installToastUi(app.$toast, () => {
    try { return app.i18n.t('common.close') } catch (_) { return 'Close' }
  })
}
