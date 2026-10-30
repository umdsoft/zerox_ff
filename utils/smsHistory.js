/**
 * 30.10: SMS tarixi (Tariflar) uchun umumiy yordamchilar — SMS ro'yxati, "Yetkazilmagan" sahifasi,
 * sabab oynasi va type=49 bildirishnomasi bir xil mantiqdan foydalansin.
 */

export const SMS_KNOWN_TYPES = ['registration', 'auto', 'manual', 'qarz_tolandi', 'payment_link'];
const KNOWN_REASONS = [
  'subscriber_inactive', 'blocked', 'invalid_number', 'provider_rejected', 'not_delivered',
  'no_package', 'plan_required', 'send_error',
];
// Eskiz xom holati (delivery_raw) → sabab kodi (backend failure_reason bermagan eski yozuvlar uchun)
const RAW_TO_REASON = {
  UNDELIV: 'subscriber_inactive', UNDELIVERABLE: 'subscriber_inactive', UNDELIVERED: 'subscriber_inactive',
  REJECTD: 'blocked', REJECTED: 'blocked', EXPIRED: 'not_delivered',
};
// Eski sms_delivery.fail_* kodlari (smsDelivery listUndelivered `reason`)
const LEGACY_TO_REASON = {
  NO_PACKAGE: 'no_package', INVALID_PHONE: 'invalid_number', PROVIDER_400: 'provider_rejected', NO_TOKEN: 'send_error',
};

/** Tur kaliti → sms_delivery.type_* i18n kaliti (noma'lum tur — "SMS") */
export function smsTypeKey(type) {
  return `sms_delivery.type_${SMS_KNOWN_TYPES.includes(type) ? type : 'other'}`;
}

/** Sabab kodi → i18n kodi ('generic' — noma'lum) */
export function normalizeReason(code) {
  const c = String(code || '').trim();
  if (KNOWN_REASONS.includes(c)) { return c; }
  if (LEGACY_TO_REASON[c.toUpperCase()]) { return LEGACY_TO_REASON[c.toUpperCase()]; }
  if (RAW_TO_REASON[c.toUpperCase()]) { return RAW_TO_REASON[c.toUpperCase()]; }
  return 'generic';
}

/** sms-history qatori yetkazilmaganmi (yuborilmadi yoki operator yetkazmadi) */
export function isUndeliveredRow(row) {
  if (!row) { return false; }
  return row.status === 'failed' || row.delivery_status === 'undelivered' || !!row.failure_reason;
}

/** sms-history qatori uchun sabab kodi (failure_reason → delivery_raw → generic) */
export function rowReason(row) {
  if (!row) { return 'generic'; }
  if (row.failure_reason) { return normalizeReason(row.failure_reason); }
  if (row.delivery_raw) { return normalizeReason(row.delivery_raw); }
  return 'generic';
}

/** "/qarz-daftari/sms/undelivered" qatori uchun sabab kodi */
export function undeliveredRowReason(row) {
  if (!row) { return 'generic'; }
  if (row.failure_reason) { return normalizeReason(row.failure_reason); }
  if (row.state === 'undelivered') { return normalizeReason(row.raw) === 'generic' ? 'not_delivered' : normalizeReason(row.raw); }
  return normalizeReason(row.reason);
}

/** Amaliyot tafsiloti sahifasiga marshrut (qarz id + mijoz id); mijoz id bo'lmasa — qarz sahifasi */
export function operationRoute(localePath, qarzId, mijozId) {
  if (qarzId && mijozId) {
    return localePath({ name: 'qarz-daftari-tranzaksiya-id', params: { id: `berish-${qarzId}` }, query: { mijoz: String(mijozId) } });
  }
  return localePath({ name: 'qarz-daftari-qarz-id', params: { id: String(qarzId) } });
}

/**
 * Qarz uchun Amaliyot tafsiloti marshruti. Mijoz id yo'q bo'lsa — GET /qarz-daftari/qarz/:id dan olinadi;
 * mijoz tarixidan SHU qarzning "berish" amaliyoti topiladi (konsolidatsiyalangan qarzda to'g'ri summa uchun —
 * sintetik `berish-<qarzId>` faqat zaxira). Xato bo'lsa — qarz sahifasi.
 */
export async function resolveOperationRoute({ $axios, localePath }, qarzId, mijozId, nearDate) {
  if (!qarzId) { return null; }
  let mid = mijozId || null;
  try {
    if (!mid) {
      const res = await $axios.$get(`/qarz-daftari/qarz/${qarzId}`, { silent: true, background: true });
      const q = res && res.data;
      mid = (q && (q.mijoz_id || (q.mijoz && q.mijoz.id))) || null;
    }
    if (!mid) { return operationRoute(localePath, qarzId, null); }
    let opId = `berish-${qarzId}`;
    try {
      const h = await $axios.$get(`/qarz-daftari/mijozlar/${mid}/history`, { silent: true, background: true });
      const trs = (h && h.data && h.data.tranzaksiyalar) || [];
      const mine = trs.filter((t) => Number(t.qarz_id) === Number(qarzId) && t.turi === 'berish');
      if (mine.length) {
        const ref = nearDate ? new Date(nearDate).getTime() : NaN;
        const dist = (t) => (Number.isNaN(ref) ? 0 : Math.abs(new Date(t.created_at).getTime() - ref) || 0);
        mine.sort((a, b) => dist(a) - dist(b));
        opId = String(mine[0].id);
      }
    } catch (_) { /* sintetik id zaxira */ }
    return localePath({ name: 'qarz-daftari-tranzaksiya-id', params: { id: opId }, query: { mijoz: String(mid) } });
  } catch (_) {
    return operationRoute(localePath, qarzId, null);
  }
}

/** "Tarif N · Paket M" qatori (Paket faqat M > 0 bo'lsa). pools yo'q → ''. */
export function poolLine(t, plan, pkg) {
  if (plan === null || plan === undefined) { return ''; }
  const p = Number(plan) || 0;
  const k = Number(pkg) || 0;
  return k > 0 ? `${t('sms_hist.plan')} ${p} · ${t('sms_hist.package')} ${k}` : `${t('sms_hist.plan')} ${p}`;
}

/** sms-history qatorini yagona ko'rinishga keltiradi */
export function normalizeSmsRow(r) {
  return {
    id: r.id,
    phone: r.phone || '',
    name: r.debtor_name || '',
    type: r.type || '',
    message: r.message || '',
    date: r.sent_at || r.created_at || null,
    undelivered: isUndeliveredRow(r),
    reason: rowReason(r),
    pool: r.pool || null,
    debtId: r.debt_id || null,
    debtSource: r.debt_source || null,
  };
}
