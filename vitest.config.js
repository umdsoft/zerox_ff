import path from 'path';
import { defineConfig } from 'vitest/config';
import * as templateCompiler from 'vue-template-compiler';

const { parseComponent } = templateCompiler;

// Sana formatlovchilar mahalliy vaqtga bog'liq — testlar TZ'ga tayanmasligi uchun qat'iy belgilanadi.
process.env.TZ = 'Asia/Tashkent';

/**
 * wave C: `.vue` fayllarini testlarda import qilish uchun minimal plagin — faqat `<script>` olinadi
 * (shablon/uslub kerak emas): sahifa/komponent opsiyalari obyekti `Vue.extend(...)` bilan metod/computed testi uchun.
 */
const vueScriptOnly = () => ({
  name: 'vue-script-only',
  enforce: 'pre',
  async transform(code, id) {
    if (!id.endsWith('.vue')) {return null;}
    const { script, template } = parseComponent(code);
    const src = script ? script.content : 'export default {}';
    if (!template || !process.env.VUE_TEST_RENDER) {return { code: src, map: null };}
    // VUE_TEST_RENDER=1: render funksiyasi ham qo'shiladi (SSR taqqoslash uchun); aks holda faqat <script>.
    // `@vue/component-compiler-utils` (vue-loader tranzitiv bog'liqligi) faqat shu rejimda yuklanadi.
    const { compileTemplate } = await import('@vue/component-compiler-utils');
    const { code: tplCode, errors } = compileTemplate({
      source: template.content, compiler: templateCompiler, filename: id, transformAssetUrls: false,
    });
    if (errors && errors.length) {throw new Error(`${id}: ${errors.join('; ')}`);}
    return {
      code: `${tplCode}
${src.replace('export default', 'const __opts =')}
__opts.render = render; __opts.staticRenderFns = staticRenderFns;
export default __opts;`,
      map: null,
    };
  },
});

export default defineConfig({
  plugins: [vueScriptOnly()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname),
    },
  },
  test: {
    environment: 'node',
    pool: 'forks', // process.env.TZ ni testda almashtirish (worker thread'da ishlamaydi)
    include: ['tests/**/*.test.js'],
    env: { TZ: 'Asia/Tashkent' },
  },
});
