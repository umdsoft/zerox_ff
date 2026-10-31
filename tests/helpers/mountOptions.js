import Vue from 'vue';

/**
 * Render qilmasdan komponent nusxasi (data/computed/methods ishlaydi). `mocks` — `$axios`, `$auth`, `$toast`, ... kabi
 * global xossalar: nusxa darajasida (`vm.$axios`) beriladi, Vue.prototype ifloslanmaydi.
 */
export function createVm(options, { mocks = {}, propsData } = {}) {
  const Ctor = Vue.extend(options);
  return new Ctor({
    propsData,
    beforeCreate() {
      Object.keys(mocks).forEach((k) => { this[k] = mocks[k]; });
    },
  });
}
