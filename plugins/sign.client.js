/**
 * 07.11 (imzolash spetsifikatsiyasi §4): `$sign` — yagona elektron imzo oynasi va rad etish tasdig'i.
 *
 *   const res = await this.$sign.run({ purpose, contract, act, notification, payload, summary, submit: (sign) => api(...) });
 *   // res === null — foydalanuvchi oynani yopdi (yoki hujjat o'zgargan); aks holda submit() natijasi.
 *   // submit() imzodan boshqa xato bilan yiqilsa (403 only-lender, 409 ...) — run() shu xato bilan reject bo'ladi.
 *
 *   if (!(await this.$sign.confirmReject())) return; // rad etish (stype 2) — kodsiz, tasdiqlash oynasi bilan
 *
 * Oynalar layouts/default.vue'da chiziladi (`$sign.state.request`, `$sign.state.confirm`).
 */
import Vue from 'vue';

export function createSignService() {
  const state = Vue.observable({ request: null, confirm: null });

  const api = {
    state,

    run(opts) {
      // bir vaqtda bitta imzo: oldingisi ochiq bo'lsa — u bekor qilinadi
      if (state.request) {api.cancel();}
      return new Promise((resolve, reject) => {
        state.request = { ...opts, _resolve: resolve, _reject: reject };
      });
    },
    /** SignModal @done */
    done(result) {
      const r = state.request;
      state.request = null;
      if (r) {r._resolve(result === undefined ? true : result);}
    },
    /** SignModal @failed — imzodan boshqa xato: chaqiruvchining catch'iga */
    fail(err) {
      const r = state.request;
      state.request = null;
      if (r) {r._reject(err);}
    },
    /** SignModal @cancel */
    cancel() {
      const r = state.request;
      state.request = null;
      if (r) {r._resolve(null);}
    },

    confirmReject(opts = {}) {
      if (state.confirm) {api.answer(false);}
      return new Promise((resolve) => {
        state.confirm = { ...opts, _resolve: resolve };
      });
    },
    answer(ok) {
      const c = state.confirm;
      state.confirm = null;
      if (c) {c._resolve(!!ok);}
    },
  };
  return api;
}

export default ({ app }, inject) => {
  const api = createSignService();
  inject('sign', api);
  // sahifadan chiqilganda ochiq oyna yopiladi (amal bekor)
  if (app.router) {
    app.router.afterEach(() => {
      if (api.state.request) {api.cancel();}
      if (api.state.confirm) {api.answer(false);}
    });
  }
};
