import Vue from 'vue';
import { createRenderer } from 'vue-server-renderer';

/**
 * Komponentni SSR bilan HTML'ga render qiladi (faqat VUE_TEST_RENDER=1 da render funksiyasi mavjud).
 * Ro'yxatdan o'tmagan komponent ("Unknown custom element") yoki boshqa Vue ogohlantirishi -> XATO (wave C saboqi:
 * vitest faqat <script>ni yuklaganda shablon/ro'yxatga olish xatolari o'tib ketardi).
 * `stubs` — global (plagin) komponentlar, masalan `date-picker`.
 */
export async function renderToHtml(options, { propsData = {}, mocks = {}, stubs = [] } = {}) {
  const stubComponents = {};
  // stub'lar child komponentlarda ham ishlashi uchun GLOBAL ro'yxatga olinadi va ichki (slot) kontentni saqlaydi
  const globalPrev = {};
  stubs.forEach((n) => { stubComponents[n] = { render(h) { return h('div', { attrs: { 'data-stub': n } }, this.$slots.default); } }; });
  const prevWarn = Vue.config.warnHandler;
  const warnings = [];
  // child komponentlar ham `$t` kabi mock'larni ko'rishi uchun — vaqtincha Vue.prototype'ga (finally'da qaytariladi)
  const prevProto = {};
  Object.keys(mocks).forEach((k) => { prevProto[k] = Object.getOwnPropertyDescriptor(Vue.prototype, k); Vue.prototype[k] = mocks[k]; });
  Vue.config.warnHandler = (msg) => { warnings.push(msg); };
  stubs.forEach((n) => { globalPrev[n] = Vue.options.components[n]; Vue.component(n, stubComponents[n]); });
  try {
    const Ctor = Vue.extend({ ...options, components: { ...(options.components || {}), ...stubComponents } });
    const vm = new Ctor({
      propsData,
    });
    const html = await createRenderer().renderToString(vm);
    if (warnings.length) { throw new Error('Vue warnings:\n' + warnings.join('\n')); }
    return html;
  } finally {
    stubs.forEach((n) => { if (globalPrev[n]) { Vue.options.components[n] = globalPrev[n]; } else { delete Vue.options.components[n]; } });
    Object.keys(mocks).forEach((k) => { if (prevProto[k]) { Object.defineProperty(Vue.prototype, k, prevProto[k]); } else { delete Vue.prototype[k]; } });
    Vue.config.warnHandler = prevWarn;
  }
}

export const RENDER_ENABLED = Boolean(process.env.VUE_TEST_RENDER);
