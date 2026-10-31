/**
 * wave C: `$axios` -> api/* ko'chirishida URL literallari YO'QOLMAGANini isbotlaydi.
 * Har bir o'zgargan fayl uchun:
 *   HEAD tomoni  = `git show HEAD:<fayl>` ichidagi URL-ga o'xshash literallar (+ o'sha HEAD fayli import qilgan api funksiyalari);
 *   YANGI tomon  = hozirgi fayldagi literallar + fayl import qilgan `@/api/*` funksiyalari ICHIDAGI literallar.
 * `${...}` har doim `${}` ga normallanadi. Farq bo'lsa (yo'qolgan / qo'shilgan) chiqadi va chiqish kodi 1.
 *
 * Ishga tushirish:  node scripts/compareApiUrls.js [--verbose]
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const parser = require('@babel/parser');
const { parseComponent } = require('vue-template-compiler');

const ROOT = path.join(__dirname, '..');
const VERBOSE = process.argv.includes('--verbose');
const URL_RE = /^\/?(user|notification|contract|finance|qarz-daftari|home|dashboard|pay|news|telegram|api)\//;

function scriptOf(file, text) {
  if (!file.endsWith('.vue')) {return text;}
  const sfc = parseComponent(text);
  return sfc.script ? sfc.script.content : '';
}

function walk(node, fn) {
  if (!node || typeof node.type !== 'string') {return;}
  fn(node);
  for (const k of Object.keys(node)) {
    if (k === 'loc') {continue;}
    const v = node[k];
    if (Array.isArray(v)) {v.forEach((c) => c && typeof c.type === 'string' && walk(c, fn));}
    else if (v && typeof v.type === 'string') {walk(v, fn);}
  }
}

function literalsIn(ast, filter) {
  const out = new Set();
  walk(ast, (n) => {
    if (filter && !filter(n)) {return;}
    let v = null;
    if (n.type === 'StringLiteral') {v = n.value;}
    else if (n.type === 'TemplateLiteral') {v = n.quasis.map((q) => q.value.cooked).join('${}');}
    if (v && URL_RE.test(v)) {out.add(v.replace(/\$\{[^}]*\}/g, '${}'));}
  });
  return out;
}

const parse = (code) => parser.parse(code, { sourceType: 'module', errorRecovery: true, plugins: ['jsx'] });

const apiCache = {};
function apiFunctions(mod) {
  if (apiCache[mod]) {return apiCache[mod];}
  const f = path.join(ROOT, 'api', `${mod  }.js`);
  const map = {};
  if (fs.existsSync(f)) {
    const ast = parse(fs.readFileSync(f, 'utf8'));
    for (const st of ast.program.body) {
      if (st.type !== 'ExportNamedDeclaration' || !st.declaration || st.declaration.type !== 'VariableDeclaration') {continue;}
      for (const d of st.declaration.declarations) {map[d.id.name] = literalsIn(d.init);}
    }
  }
  apiCache[mod] = map;
  return map;
}

function importedApiLiterals(ast) {
  const out = new Set();
  for (const st of ast.program.body) {
    if (st.type !== 'ImportDeclaration') {continue;}
    const m = /^[@~]\/api\/(\w+)$/.exec(st.source.value);
    if (!m) {continue;}
    const fns = apiFunctions(m[1]);
    for (const sp of st.specifiers) {
      if (sp.type === 'ImportSpecifier' && fns[sp.imported.name]) {fns[sp.imported.name].forEach((l) => out.add(l));}
    }
  }
  return out;
}

const changed = execFileSync('git', ['diff', '--name-only', 'HEAD'], { cwd: ROOT, encoding: 'utf8' })
  .split(/\r?\n/).filter((f) => /\.(vue|js)$/.test(f) && !f.startsWith('api/') && !f.startsWith('tests/') && fs.existsSync(path.join(ROOT, f)));

let totalHead = 0; let bad = 0; let checked = 0;
for (const file of changed) {
  let headText;
  try { headText = execFileSync('git', ['show', `HEAD:${file}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { continue; }
  const headAst = parse(scriptOf(file, headText));
  const headLits = new Set([...literalsIn(headAst), ...importedApiLiterals(headAst)]);
  const newAst = parse(scriptOf(file, fs.readFileSync(path.join(ROOT, file), 'utf8')));
  const newLits = new Set([...literalsIn(newAst), ...importedApiLiterals(newAst)]);
  if (!headLits.size && !newLits.size) {continue;}
  checked += 1; totalHead += headLits.size;
  const lost = [...headLits].filter((l) => !newLits.has(l));
  const added = [...newLits].filter((l) => !headLits.has(l));
  if (lost.length || added.length) {
    bad += 1;
    console.log(`DIFF ${file}`);
    lost.forEach((l) => console.log(`   - ${l}`));
    added.forEach((l) => console.log(`   + ${l}`));
  } else if (VERBOSE) {console.log(`ok   ${file} (${headLits.size})`);}
}
console.log(`\nfiles compared: ${checked}, URL literals at HEAD: ${totalHead}, files with differences: ${bad}`);
process.exit(bad ? 1 : 0);
