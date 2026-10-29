/**
 * 28.10 (sayt hujjati): bildirishnomalar (toast) yangi ko'rinishi — markaziy qatlam.
 *
 * Saytdagi BARCHA xabarlar (`this.$toast.success/error/info(...)`, axios interceptor, error-handler,
 * planGate) bitta `Vue.toasted` (@nuxtjs/toast → vue-toasted 1.x) obyekti orqali o'tadi. Ko'rinish
 * assets/css/toast.scss da; bu yerda faqat xatti-harakat (chaqiruv imzolari O'ZGARMAGAN):
 *   - turga qarab davomiylik (success/info 3s, warning 4s, error 5s) — chaqiruvda `duration` berilsa o'sha;
 *   - "yopish" (×) tugmasi — chaqiruvda o'z `action`i bo'lmasa (masalan "Tariflar" tugmali toast qoladi);
 *   - jarayon chizig'i uchun `--zt-dur` CSS o'zgaruvchisi (haqiqiy davomiylik bilan bir xil);
 *   - ARIA: error/warning → role="alert", qolganlari → role="status"; konteyner aria-live="polite";
 *   - `warning` / `warn` usuli (vue-toasted'da yo'q edi; `$toast?.warning` chaqiruvlari endi ishlaydi).
 * Takrorni yashiruvchi `installToastDedupe` bilan ketma-ketlikdan qat'i nazar birga ishlaydi
 * (u `null` qaytarsa — bezatiladigan narsa yo'q).
 */

export const TOAST_DURATION_MS = Object.freeze({
  default: 3000,
  success: 3000,
  info: 3000,
  warning: 4000,
  error: 5000,
})

const ASSERTIVE_TYPES = ['error', 'warning']

/**
 * Chaqiruv parametrlarini tayyorlaydi (sof funksiya — testlanadi). `options` obyekt bo'lmasa
 * (vue-toasted o'zi xato beradi) — o'zgartirilmaydi.
 * @param {string} type  success|error|info|warning|default
 * @param {unknown} options
 * @returns {{ options: unknown, type: string, duration: number|null, hasCloseButton: boolean }}
 */
export function prepareToastOptions (type, options) {
  if (options !== undefined && options !== null && typeof options !== 'object') {
    return { options, type, duration: null, hasCloseButton: false }
  }
  const opts = Object.assign({}, options || {})
  const effectiveType = opts.type || type || 'default'
  const hasOwnDuration = typeof opts.duration === 'number' && opts.duration > 0
  if (!hasOwnDuration) { opts.duration = TOAST_DURATION_MS[effectiveType] || TOAST_DURATION_MS.default }
  const hasCloseButton = !opts.action
  if (hasCloseButton) {
    opts.action = {
      text: '',
      class: 'zt-close',
      onClick: (e, toastObject) => { try { toastObject && toastObject.goAway && toastObject.goAway(0) } catch (_) { /* jim */ } },
    }
  }
  return { options: opts, type: effectiveType, duration: opts.duration, hasCloseButton }
}

function decorate (toastObject, { type, duration, hasCloseButton }, closeLabel) {
  const el = toastObject && toastObject.el
  if (!el || typeof el.setAttribute !== 'function') return
  el.setAttribute('role', ASSERTIVE_TYPES.includes(type) ? 'alert' : 'status')
  if (duration) el.style.setProperty('--zt-dur', duration + 'ms')
  if (!hasCloseButton) return
  const btn = el.querySelector('.zt-close')
  if (!btn) return
  btn.setAttribute('role', 'button')
  btn.setAttribute('tabindex', '0')
  btn.setAttribute('aria-label', closeLabel())
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      try { toastObject.goAway(0) } catch (_) { /* jim */ }
    }
  })
}

/**
 * @param {object} toast  Vue.toasted (app.$toast) — bir marta o'rnatiladi
 * @param {() => string} [closeLabel]  "Yopish" matni (til o'zgarsa ham joriy tilda)
 */
export function installToastUi (toast, closeLabel = () => 'Close') {
  if (!toast || toast.__zxUi) return toast

  for (const [kind, kindType] of [['show', 'default'], ['success', 'success'], ['info', 'info'], ['error', 'error']]) {
    const orig = toast[kind]
    if (typeof orig !== 'function') continue
    toast[kind] = function uiToast (message, options) {
      const prepared = prepareToastOptions(kindType, options)
      const result = orig.call(this, message, prepared.options)
      if (result && message) decorate(result, prepared, closeLabel)
      return result
    }
  }

  if (typeof toast.warning !== 'function') {
    toast.warning = function warningToast (message, options) {
      const opts = Object.assign({}, options && typeof options === 'object' ? options : {}, { type: 'warning' })
      return toast.show(message, opts)
    }
  }
  if (typeof toast.warn !== 'function') { toast.warn = toast.warning }

  try { if (toast.container) toast.container.setAttribute('aria-live', 'polite') } catch (_) { /* jim */ }
  try { Object.defineProperty(toast, '__zxUi', { value: true }) } catch (_) { toast.__zxUi = true }
  return toast
}
