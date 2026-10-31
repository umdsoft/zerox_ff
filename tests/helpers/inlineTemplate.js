import { compile, parseComponent } from 'vue-template-compiler';
import fs from 'fs';
import path from 'path';

/**
 * wave D: shablonni bo'lishdan OLDIN/KEYIN bir xilligini isbotlash. Sahifa shablonidagi `<Child ... />` ishlatilishi child shablonining
 * ASL matni bilan almashtiriladi (usage'dagi v-if/v-else/v-show/class/key atributlari child ildiziga qo'shiladi; prop/.sync bog'lashlari tashlanadi),
 * so'ng ikkala tomon ham kanonik AST'ga (teg, atributlar, matn; bo'shliq/izohlar e'tiborsiz) keltirilib solishtiriladi.
 */
const ROOT = path.join(__dirname, '..', '..');
export const templateOf = (file) => parseComponent(fs.readFileSync(path.join(ROOT, file), 'utf8')).template.content;
const MERGE_ATTRS = /^(v-if|v-else-if|v-else|v-show|class|:class|key|:key)$/;

export function inlineChildren(tpl, children) {
  let out = tpl;
  for (const { tag, file } of children) {
    const re = new RegExp(`<${tag}(\\s[^>]*?)?\\s*/>`, 'g');
    const childTpl = templateOf(file).trim();
    out = out.replace(re, (m, attrs = '') => {
      const merged = [];
      const attrRe = /([:@#]?[\w.-]+)(?:="([^"]*)")?/g;
      let a;
      while ((a = attrRe.exec(attrs))) {
        const name = a[1];
        if (MERGE_ATTRS.test(name)) { merged.push(a[2] === undefined ? name : `${name}="${a[2]}"`); }
      }
      return childTpl.replace(/^<([\w-]+)/, (mm, t) => `<${t}${merged.length ? ' ' + merged.join(' ') : ''}`);
    });
  }
  return out;
}

const ws = (s) => String(s).replace(/\s+/g, ' ').trim();
function ser(node) {
  if (node.type === 3) { const t = ws(node.text); return t ? `"${t}"` : ''; }
  if (node.type === 2) { return `"${ws(node.text)}"`; }
  const attrs = (node.attrsList || []).map((a) => `${a.name}=${ws(a.value)}`).sort().join(' ');
  const kids = (node.children || []).map(ser).filter(Boolean).join('');
  const cond = node.ifConditions && node.ifConditions.length > 1 ? node.ifConditions.slice(1).map((c) => `|${c.exp}:${c.block === node ? '' : ser(c.block)}`).join('') : '';
  return `<${node.tag} ${attrs}>${kids}</${node.tag}>${cond}`;
}
export function canonical(tpl) {
  const r = compile(tpl, { preserveWhitespace: false, comments: false });
  if (r.errors && r.errors.length) { throw new Error(r.errors.join('; ')); }
  return ser(r.ast);
}
