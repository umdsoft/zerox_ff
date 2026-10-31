import sass from 'sass';
import postcss from 'postcss';
import { parseComponent } from 'vue-template-compiler';

/**
 * wave D: <style> bloklarini (scss/css) kompilyatsiya qilib, har bir qoida uchun "kontekst|selektor|deklaratsiyalar" qatorlarini beradi
 * (scope hash'i kompilyatsiyaga kirmaydi). Bo'lishdan oldin/keyin qoidalar to'plami solishtiriladi.
 */
export function compiledRules(vueSource) {
  const { styles } = parseComponent(vueSource);
  const out = [];
  for (const st of styles) {
    const css = st.lang === 'scss' ? sass.compileString(st.content).css : st.content;
    const root = postcss.parse(css);
    const walk = (node, ctx) => {
      node.each((n) => {
        if (n.type === 'rule') {
          const decls = [];
          n.each((d) => { if (d.type === 'decl') { decls.push(`${d.prop}:${d.value}${d.important ? '!important' : ''}`); } });
          out.push(`${ctx}|${n.selector.replace(/\s+/g, ' ')}|${decls.join(';')}`);
        } else if (n.type === 'atrule') {
          const c = `${ctx}@${n.name} ${n.params.replace(/\s+/g, ' ')}`;
          if (n.nodes) { walk(n, c + ' '); }
        }
      });
    };
    walk(root, '');
  }
  return out;
}
