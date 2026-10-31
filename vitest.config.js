import path from 'path';
import { defineConfig } from 'vitest/config';

// Sana formatlovchilar mahalliy vaqtga bog'liq — testlar TZ'ga tayanmasligi uchun qat'iy belgilanadi.
process.env.TZ = 'Asia/Tashkent';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    env: { TZ: 'Asia/Tashkent' },
  },
});
