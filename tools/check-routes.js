// Nuxt 2 marshrut NOMLARINI generatsiya qiladi — `localePath({name:'...'})`
// da ishlatilgan nom haqiqatan mavjudligini build'gacha tekshirish uchun.
const { createRoutes } = require('@nuxt/utils');
const fs = require('fs');
const path = require('path');

function walk(dir, base, out) {
  out = out || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else if (e.name.endsWith('.vue')) out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out;
}

const files = walk('pages', '.'); // 'pages/...' — createRoutes srcDir'ga NISBATAN kutadi
const routes = createRoutes({ files, srcDir: process.cwd(), pagesDir: 'pages', routeNameSplitter: '-' });

const names = [];
(function flat(rs) {
  for (const r of rs) {
    if (r.name) names.push(r.name);
    if (r.children) flat(r.children);
  }
})(routes);

const want = process.argv.slice(2);
let bad = 0;
for (const w of want) {
  const ok = names.includes(w);
  if (!ok) bad++;
  console.log((ok ? 'OK  ' : 'YOQ ') + w);
}
if (!want.length) console.log('Jami marshrut: ' + names.length);
process.exit(bad ? 1 : 0);
