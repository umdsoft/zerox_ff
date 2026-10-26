/**
 * $fio(name) / $fioMatch(name, query) — shablon va skriptlarda (this.$fio, context.app.$fio).
 * Til har chaqiruvda app.i18n.locale dan o'qiladi (render ichida reaktiv, SSR da ham to'g'ri).
 * SSR+klient (ssr:false EMAS) — generate paytida shablon `$fio` ni topa olishi shart.
 */
import { fio, fioMatches, fioJoin } from '~/utils/fio';

export default ({ app }, inject) => {
  const loc = () => (app.i18n && app.i18n.locale) || 'uz';
  inject('fio', (name) => fio(name, loc()));
  inject('fioJoin', (...parts) => fioJoin(parts, loc()));
  inject('fioMatch', (name, query) => fioMatches(name, query, loc()));
};
