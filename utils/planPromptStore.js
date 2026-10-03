/**
 * 03.10 (sayt hujjati, 4-rasm): TARIF CHEKLOVI taklifi — MARKAZDAGI oyna holati.
 *
 * Ilgari `$planPrompt` faqat yuqori burchakdagi kichik toast edi ("Bu imkoniyat faqat pullik
 * tarifda mavjud… TARIFLAR") — egasi uni ko'rmay qolardi. Endi `layouts/default.vue` dagi
 * `PlanPromptModal` shu holatni chizadi. Oyna "xosti" (layout) o'rnatilmagan sahifada (admin/empty
 * layout) — `plugins/axios.js` avvalgi toast'ni ko'rsatadi (`hasPlanPromptHost`).
 */
import Vue from 'vue'

const state = Vue.observable({ open: false, text: '', hosts: 0 })

export const planPromptState = state

/** Markazdagi oynani chizadigan komponent o'rnatilganmi */
export function hasPlanPromptHost () {
  return state.hosts > 0
}

/** Xost (PlanPromptModal) o'rnatildi / olib tashlandi */
export function registerPlanPromptHost () { state.hosts += 1 }
export function unregisterPlanPromptHost () { state.hosts = Math.max(0, state.hosts - 1) }

/** Oynani ochish (matn — tayyor, tarjima qilingan) */
export function openPlanPrompt (text) {
  state.text = String(text || '')
  state.open = true
}

export function closePlanPrompt () {
  state.open = false
}
