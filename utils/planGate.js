/**
 * 02.10: TARIF CHEKLOVI (plan-required) — umumiy yordamchilar (sof funksiyalar + taklif toast'i).
 *
 * Egasi qoidasi: pullik tarif muddati tugagach BARCHA pullik imkoniyatlar sayt va ilovada cheklanadi
 * (muddati tugagan tarif == Free). Backend:
 *  - foydalanuvchi boshlagan amal (talab SMS, qo'lda SMS, to'lov havolasi, eksport, reyting...) uchun
 *    403 { success:false, code:'plan-required', feature, required_plan, current_plan, expired, message };
 *  - avtomatik SMS (masalan, "to'lov qabul qilindi") uchun amal MUVAFFAQIYATLI (201), lekin javobda
 *    sms: { sent:false, reason:'PLAN_REQUIRED', message }.
 * Ikkala holatda ham foydalanuvchiga XATO emas, "Tariflar" tugmali taklif ko'rsatiladi (plugins/axios.js
 * `$planPrompt`). Server `message` i so'rov tilida keladi — bo'lsa o'shani ko'rsatamiz.
 */

export const PLAN_REQUIRED_CODE = 'plan-required'
export const PLAN_REQUIRED_SMS_REASON = 'PLAN_REQUIRED'
export const PLAN_PROMPT_DURATION_MS = 8000

/** Javob tanasi tarif cheklovi haqidami (yangi `code` yoki eski requireFeature `required_plan`) */
export function isPlanRequiredData (data) {
  if (!data || typeof data !== 'object') { return false }
  return data.code === PLAN_REQUIRED_CODE || (typeof data.required_plan === 'string' && !!data.required_plan)
}

/** Axios xatosi — 403 tarif cheklovimi */
export function isPlanRequiredError (err) {
  const res = err && err.response
  return !!res && res.status === 403 && isPlanRequiredData(res.data)
}

/** Muvaffaqiyatli javobdagi `sms` — tarif yo'qligi sababli yuborilmaganmi */
export function isPlanRequiredSms (sms) {
  return !!sms && typeof sms === 'object' && sms.sent === false && sms.reason === PLAN_REQUIRED_SMS_REASON
}

/**
 * Taklif matni: server `message` (so'rov tilida) ustun; aks holda i18n — muddati tugagan yoki umumiy.
 * @param {(key: string) => string} t
 * @param {{ message?: string, expired?: boolean }} [info]
 */
export function planPromptText (t, info) {
  const msg = info && typeof info.message === 'string' ? info.message.trim() : ''
  if (msg) { return msg }
  return t(info && info.expired ? 'plan_gate.expired' : 'plan_gate.required')
}

/**
 * "Tariflar" tugmali taklif toast'i (vue-toasted `action`).
 * @param {{ toast: object, t: (key: string) => string, go: () => void }} ctx
 * @param {{ message?: string, expired?: boolean }} [info]
 */
export function showPlanPrompt (ctx, info) {
  const { toast, t, go } = ctx || {}
  if (!toast) { return null }
  const show = typeof toast.info === 'function' ? toast.info : toast.show
  if (typeof show !== 'function') { return null }
  return show.call(toast, planPromptText(t, info), {
    duration: PLAN_PROMPT_DURATION_MS,
    action: {
      text: t('plan_gate.plans_btn'),
      onClick: (e, toastObject) => {
        try { toastObject && toastObject.goAway && toastObject.goAway(0) } catch (_) { /* jim */ }
        try { go && go() } catch (_) { /* jim */ }
      },
    },
  })
}
