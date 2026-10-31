import { describe, it, expect, afterEach } from 'vitest';
import { pdfScriptUrl, contractPdfUrl, actPdfUrl, ofertaPdfUrl, pdfIsTestEnv, pdfLink } from '@/utils/helpers';

const TB = { backendURL: 'https://tb.zerox.uz' };
const PROD = { backendURL: 'https://app.zerox.uz' };

afterEach(() => { delete globalThis.window; });

describe('pdfScriptUrl', () => {
  it('prod config -> index.php / act.php', () => {
    expect(pdfScriptUrl('index', PROD)).toBe('https://pdf.zerox.uz/index.php');
    expect(pdfScriptUrl('act', PROD)).toBe('https://pdf.zerox.uz/act.php');
  });
  it('tb config -> *_test.php', () => {
    expect(pdfScriptUrl('index', TB)).toBe('https://pdf.zerox.uz/index_test.php');
    expect(pdfScriptUrl('act', TB)).toBe('https://pdf.zerox.uz/act_test.php');
  });
  it('no config, no window -> prod', () => {
    expect(pdfScriptUrl('index')).toBe('https://pdf.zerox.uz/index.php');
    expect(pdfIsTestEnv()).toBe(false);
  });
  it('no explicit config falls back to window.$nuxt.$config', () => {
    globalThis.window = { $nuxt: { $config: TB } };
    expect(pdfScriptUrl('index')).toBe('https://pdf.zerox.uz/index_test.php');
  });
  it('empty backendURL -> prod', () => expect(pdfScriptUrl('index', {})).toBe('https://pdf.zerox.uz/index.php'));
});

describe('contractPdfUrl (optional 4th arg config; falls back to window.$nuxt.$config)', () => {
  it('prod / no window', () => {
    expect(contractPdfUrl('abc')).toBe('https://pdf.zerox.uz/index.php?id=abc&lang=uz&download=0');
    expect(contractPdfUrl('abc', 'ru', 1)).toBe('https://pdf.zerox.uz/index.php?id=abc&lang=ru&download=1');
  });
  it('test env via window.$nuxt', () => {
    globalThis.window = { $nuxt: { $config: TB } };
    expect(contractPdfUrl('abc', 'kr')).toBe('https://pdf.zerox.uz/index_test.php?id=abc&lang=kr&download=0');
  });
});

describe('actPdfUrl / ofertaPdfUrl', () => {
  it('act encodes values and appends lang last', () => {
    expect(actPdfUrl({ id: 'a b', type: 'x&y' }, 'ru')).toBe('https://pdf.zerox.uz/act.php?id=a%20b&type=x%26y&lang=ru');
    expect(actPdfUrl({ id: null }, 'uz')).toBe('https://pdf.zerox.uz/act.php?id=&lang=uz');
  });
  it('oferta', () => expect(ofertaPdfUrl('u1', 'ru')).toBe('https://pdf.zerox.uz/oferta.php?id=u1&lang=ru&download=0'));
  it('test env via window', () => {
    globalThis.window = { $nuxt: { $config: TB } };
    expect(ofertaPdfUrl('u1', 'ru')).toBe('https://pdf.zerox.uz/oferta_test.php?id=u1&lang=ru&download=0');
  });
});

describe('pdfLink is byte-identical to the hand-written template literal', () => {
  const VALUES = ['U1', 'a b&c', 12345, 0, '', null, undefined, 'уз'];
  for (const [name, cfg] of [['prod', PROD], ['tb', TB], ['no config', undefined]]) {
    it(`canonical shape, ${name}`, () => {
      const $pdfIndexUrl = pdfScriptUrl('index', cfg);
      for (const uid of VALUES) {
        for (const lang of ['uz', 'ru', 'kr', undefined]) {
          const literal = `${$pdfIndexUrl}?id=${uid}&lang=${lang}&download=0`;
          expect(pdfLink('index', { id: uid, lang, download: 0 }, cfg)).toBe(literal);
        }
      }
    });
  }
  it('literal lang=uz shape', () => {
    expect(pdfLink('index', { id: 'X', lang: 'uz', download: 0 }, TB)).toBe('https://pdf.zerox.uz/index_test.php?id=X&lang=uz&download=0');
  });
  it('key order follows params order; act/oferta files', () => {
    expect(pdfLink('act', { b: 1, a: 2 }, PROD)).toBe('https://pdf.zerox.uz/act.php?b=1&a=2');
    expect(pdfLink('oferta', { id: 'u1', lang: 'ru', download: 0 }, PROD)).toBe(ofertaPdfUrl('u1', 'ru'));
  });
  it('matches contractPdfUrl for prod and for test (window stub)', () => {
    expect(pdfLink('index', { id: 'abc', lang: 'ru', download: 1 }, PROD)).toBe(contractPdfUrl('abc', 'ru', 1));
    globalThis.window = { $nuxt: { $config: TB } };
    expect(pdfLink('index', { id: 'abc', lang: 'ru', download: 0 }, TB)).toBe(contractPdfUrl('abc', 'ru', 0));
  });
  it('empty params -> trailing "?"', () => expect(pdfLink('index', {}, PROD)).toBe('https://pdf.zerox.uz/index.php?'));
});
