/**
 * SS-DEV (2026-09-30) — 30.09 hujjati 3-rasm: bir xil xato xabari IKKI MARTA chiqardi.
 *
 * ILDIZ SABAB: plugins/axios.js xato interceptor'i 4xx javobdagi `message` ni o'zi toast qiladi
 * ("Unknown errors" bloki), so'ng sahifaning `catch` bloki ham AYNAN shu `error.response.data.message`
 * ni toast qiladi (masalan pages/finance/debts/add.vue — "O'zingizning telefon raqamingizga qarz
 * yozib bo'lmaydi..."). Bu naqsh saytda o'nlab sahifada bor — har birini alohida tuzatish o'rniga
 * bitta joyda: bir xil turdagi (error/success/...) BIR XIL matn qisqa oraliqda qayta chiqarilsa —
 * e'tiborsiz qoldiriladi. Turli xabarlar va vaqt o'tgach takroriy xabar odatdagidek chiqadi.
 */

export const DEFAULT_WINDOW_MS = 2500

/**
 * Takrorni aniqlovchi (sof funksiya — testlanadi).
 * @param {number} windowMs
 * @param {() => number} now
 * @returns {(kind: string, message: unknown) => boolean} true — ko'rsatish kerak
 */
export function createDedupe (windowMs = DEFAULT_WINDOW_MS, now = () => Date.now()) {
  const last = new Map() // `${kind}|${text}` -> vaqt
  return (kind, message) => {
    const text = typeof message === 'string' ? message.trim() : ''
    if (!text) return true // matnsiz (obyekt/HTML) — tekshirmaymiz
    const key = `${kind}|${text}`
    const t = now()
    const prev = last.get(key)
    last.set(key, t)
    if (last.size > 50) {
      for (const [k, v] of last) { if (t - v > windowMs) last.delete(k) }
    }
    return !(prev !== undefined && t - prev < windowMs)
  }
}

/**
 * $toast (@nuxtjs/toast — vue-toasted) usullarini takrorga qarshi o'raydi. Bir marta o'rnatiladi
 * (app.$toast va komponentlardagi this.$toast — bitta obyekt).
 */
export function installToastDedupe (toast, windowMs = DEFAULT_WINDOW_MS) {
  if (!toast || toast.__zxDedupe) return toast
  const shouldShow = createDedupe(windowMs)
  for (const kind of ['error', 'success', 'info', 'show']) {
    const orig = toast[kind]
    if (typeof orig !== 'function') continue
    toast[kind] = function dedupedToast (message, ...rest) {
      if (!shouldShow(kind, message)) return null
      return orig.call(this, message, ...rest)
    }
  }
  try { Object.defineProperty(toast, '__zxDedupe', { value: true }) } catch (_) { toast.__zxDedupe = true }
  return toast
}
