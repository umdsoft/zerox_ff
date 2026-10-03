/**
 * 03.10 (sayt hujjati, 3-rasm): qarzni yopish / to'lovdagi "SMS yuborish" natijasi — sof funksiyalar.
 *
 * Backend javoblari:
 *   - POST /finance/debts/:id/payments, /:id/mirror-payment → `sms: { sent, reason?, message? }`
 *   - POST /finance/debts/allocate-payment                 → `sms: [{ currency, sent, reason?, message? }]`
 * `reason: 'PLAN_REQUIRED'` — tarifda `auto_sms_reminder` yo'q (amal BAJARILGAN, faqat SMS ketmagan).
 */
import { PLAN_REQUIRED_SMS_REASON } from '~/utils/planGate'

/** Javobdagi `sms` (obyekt / massiv / yo'q) → tekis ro'yxat */
export function smsList (sms) {
  if (!sms) { return [] }
  const arr = Array.isArray(sms) ? sms : [sms]
  return arr.filter((x) => x && typeof x === 'object')
}

/**
 * Natijalar yig'indisi.
 * @param {Array<{sent:boolean, reason?:string, message?:string}>} results
 * @returns {{ kind: 'none'|'sent'|'plan'|'failed', message: string }}
 *   'plan' — kamida bittasi tarif sababli ketmagan (ustun: foydalanuvchi tarifni ko'rishi kerak);
 *   'failed' — boshqa sabab bilan ketmagan (birinchi server matni); 'sent' — hammasi ketdi.
 */
export function smsOutcome (results) {
  const list = smsList(results)
  if (!list.length) { return { kind: 'none', message: '' } }
  const plan = list.find((x) => x.sent === false && x.reason === PLAN_REQUIRED_SMS_REASON)
  if (plan) { return { kind: 'plan', message: String(plan.message || '') } }
  const failed = list.find((x) => x.sent === false)
  if (failed) { return { kind: 'failed', message: String(failed.message || '') } }
  return { kind: 'sent', message: '' }
}

export const SMS_NOTICE_TEXTS = {
  uz: { sent: 'SMS xabarnoma yuborildi', failed: 'SMS yuborilmadi', unknown: "SMS natijasi noma'lum — SMS tarixini tekshiring" },
  ru: { sent: 'SMS-уведомление отправлено', failed: 'SMS не отправлено', unknown: 'Результат SMS неизвестен — проверьте историю SMS' },
  kr: { sent: 'SMS хабарнома юборилди', failed: 'SMS юборилмади', unknown: 'SMS натижаси номаълум — SMS тарихини текширинг' },
  en: { sent: 'SMS notification sent', failed: 'SMS was not sent', unknown: 'SMS result unknown — check the SMS history' },
  kaa: { sent: 'SMS xabarnama jiberildi', failed: 'SMS jiberilmedi', unknown: "SMS nátiyjesi belgisiz — SMS tariyxın tekseriń" },
}
