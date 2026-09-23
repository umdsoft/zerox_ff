// Loyihadagi BARCHA .vue fayllarni vue-template-compiler bilan tekshiradi.
// Sabab: gap/_id.vue da yopilmagan <div> bor edi va u faqat build paytida
// bilinardi. Bu skript deploy oldin ishga tushiriladi.
const fs = require('fs');
const path = require('path');
const c = require('vue-template-compiler');

function walk(d, out) {
  out = out || [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.nuxt' || e.name === '.git') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.vue')) out.push(p);
  }
  return out;
}

/**
 * Qo'shimcha qoida: TEG ATRIBUTLARI ICHIDAGI HTML izohi.
 *   <button
 *     type="button"
 *     <!-- izoh -->      <-- NOTO'G'RI
 *     class="...">
 * vue-template-compiler bunga XATO BERMAYDI (izohni atribut deb o'qiydi),
 * lekin render buziladi. 2026-09-21 da aynan shunday xato qo'lda topildi.
 */
function commentInsideTag(tpl) {
  const re = /<[a-zA-Z][a-zA-Z0-9-]*(?:\s+[^<>]*?)?\s<!--/;
  const m = re.exec(tpl);
  if (!m) return null;
  return tpl.slice(0, m.index).split('\n').length;
}

const root = process.argv[2] || '.';
const files = walk(root);
const bad = [];

for (const f of files) {
  try {
    const sfc = c.parseComponent(fs.readFileSync(f, 'utf8'));
    if (!sfc.template) continue;
    const tpl = sfc.template.content;

    const r = c.compile(tpl);
    if (r.errors && r.errors.length) {
      bad.push([f, String(r.errors[0].msg || r.errors[0])]);
      continue;
    }

    const line = commentInsideTag(tpl);
    if (line) {
      bad.push([f, 'teg ICHIDA HTML izohi (qator ~' + line + ') — izohni tegdan TASHQARIGA chiqaring']);
    }
  } catch (e) {
    bad.push([f, 'PARSE: ' + e.message]);
  }
}

console.log('Jami .vue fayl: ' + files.length);
if (bad.length) {
  console.log('XATOLI: ' + bad.length);
  for (const [f, m] of bad) console.log('  x ' + f.split(path.sep).join('/') + ' -- ' + m);
  process.exit(1);
}
console.log('Hammasi toza');
