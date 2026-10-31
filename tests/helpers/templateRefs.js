import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { compile } from 'vue-template-compiler';
import Vue from 'vue';

/**
 * wave D: shablondagi "erkin" identifikatorlar (== `this.<nom>` ga murojaat) — komponentda e'lon qilinganini tekshirish uchun.
 * vitest faqat <script> yuklaganda child'ga o'tkazilmagan prop/metod xatosi (undefined) yashirin qoladi; bu tekshiruv uni ushlaydi
 * (SSR holatlariga bog'liq emas va `?.` kabi buble'ga mos kelmaydigan sintaksisda ham ishlaydi).
 */
const HELPERS = new Set(['_c', '_v', '_s', '_e', '_l', '_t', '_u', '_q', '_m', '_o', '_f', '_b', '_g', '_d', '_k', '_i', '_n', '_p', '_a']);
const JS_GLOBALS = new Set(['Math', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Date', 'JSON', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'undefined', 'NaN', 'Infinity', 'window', 'document', 'console', 'require', 'Symbol', 'Intl', 'encodeURIComponent', 'decodeURIComponent', 'navigator', 'location', 'localePath', 'beautySum', 'dateBeauty', 'Promise', 'RegExp', 'Error', 'arguments']);

export function freeIdentifiers(templateSource) {
  const res = compile(templateSource);
  if (res.errors && res.errors.length) { throw new Error('template compile errors: ' + res.errors.join('; ')); }
  const fns = [res.render, ...res.staticRenderFns];
  const out = new Set();
  for (const body of fns) {
    const ast = parse(`function __r(){ ${body} }`, { sourceType: 'script' });
    traverse(ast, {
      ReferencedIdentifier(path) {
        const n = path.node.name;
        if (path.scope.hasBinding(n)) { return; }
        if (HELPERS.has(n) || JS_GLOBALS.has(n) || n === '__r') { return; }
        out.add(n);
      },
    });
  }
  return out;
}

export function declaredNames(options) {
  const o = Vue.extend(options).options;
  const names = new Set();
  Object.keys(o.props || {}).forEach((k) => names.add(k));
  Object.keys(o.computed || {}).forEach((k) => names.add(k));
  Object.keys(o.methods || {}).forEach((k) => names.add(k));
  Object.keys(o.inject || {}).forEach((k) => names.add(k));
  if (typeof o.data === 'function') {
    const proxy = new Proxy({}, { get: (t, p) => (p === Symbol.toPrimitive ? undefined : (o.methods && o.methods[p]) || (() => ({}))) });
    try { Object.keys(o.data.call(proxy) || {}).forEach((k) => names.add(k)); } catch (e) { names.add('__DATA_ERROR__'); }
  }
  return names;
}

/** Shablonda ishlatilgan, lekin komponentda e'lon qilinmagan nomlar (`$`-/`_`-prefiksli global'lar hisobga olinmaydi). */
export function undeclaredRefs(templateSource, options) {
  const declared = declaredNames(options);
  return [...freeIdentifiers(templateSource)].filter((n) => !declared.has(n) && !n.startsWith('$') && !n.startsWith('_'));
}
