import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * wave D: SSR-HTML ekvivalentlik isboti. `normalizeHtml` — scoped `data-v-*` va `data-server-rendered` olib tashlanadi,
 * teglar orasidagi bo'shliq yig'iladi (tuzilma + class + matn solishtiriladi).
 * Fixture: `tests/fixtures/ssr/<name>.json` { "<case>": sha1 } — BO'LISHDAN OLDINGI (HEAD) holatdan olingan.
 * Yangilash: `UPDATE_SSR=1 VUE_TEST_RENDER=1 npx vitest run <fayl>`; `SSR_DUMP_DIR=<papka>` — to'liq HTML ham yoziladi (diff uchun).
 */
export const NL = String.fromCharCode(10);
export function normalizeHtml(html) {
  return String(html)
    .replace(/ data-v-[0-9a-f]+(="[^"]*")?/g, '')
    .replace(/ data-server-rendered="true"/g, '')
    .replace(/<!---->/g, '')
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><')
    .trim();
}
export const sha = (s) => crypto.createHash('sha1').update(s).digest('hex');

export function checkOrUpdate(name, caseName, html) {
  const norm = normalizeHtml(html);
  if (process.env.SSR_DUMP_DIR) {
    fs.mkdirSync(process.env.SSR_DUMP_DIR, { recursive: true });
    fs.writeFileSync(path.join(process.env.SSR_DUMP_DIR, `${name}.${caseName}.html`), norm.replace(/></g, '>' + NL + '<'));
  }
  const file = path.join(__dirname, '..', 'fixtures', 'ssr', `${name}.json`);
  const cur = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const h = sha(norm);
  if (process.env.UPDATE_SSR) {
    cur[caseName] = h;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(cur, null, 1));
    return { h, expected: h };
  }
  return { h, expected: cur[caseName] };
}
