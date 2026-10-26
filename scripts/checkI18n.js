#!/usr/bin/env node
/**
 * i18n tekshiruvi (jest'siz). Ishga tushirish:
 *   node scripts/checkI18n.js [--verbose] [--json] [--strict] [--root <frontend papkasi>]
 *
 * (a) lang/*.js ni o'qiydi, pages/ components/ layouts/ plugins/ mixins/ ... dagi $t('kalit') / t('kalit')
 *     literal kalitlarini topadi va hisobot beradi:
 *       - 5 tilning birortasida yo'q kalitlar (ishlatilgan) + 5 fayl kalitlari ittifoqidagi tengsizlik;
 *       - ru/en/kr/kaa qiymati uz bilan BIR XIL (tarjima qilinmagan ehtimoli; brend/kod WHITELIST dan tashqari);
 *       - yozuv (script) mosligi: ru/kr qiymatida lotin so'z, en/kaa qiymatida kirill, en da o'zbekcha o'/g' apostrof.
 * (b) shablon/skriptdagi qattiq yozilgan o'zbekcha literallar ($t() tashqarisida) va to'liq bo'lmagan
 *     mahalliy til xaritalari (uz: bor, lekin ru/kr/kaa/en dan biri yo'q).
 * --root: boshqa nusxa (masalan git HEAD snapshot) ni shu tekshiruv versiyasi bilan o'lchash uchun.
 * Chiqish kodi: 0; --strict bo'lsa va topilma bo'lsa 1.
 */
const fs = require('fs');
const path = require('path');

const rootArg = process.argv.indexOf('--root');
const ROOT = rootArg > -1 ? path.resolve(process.argv[rootArg + 1]) : path.resolve(__dirname, '..');
const LANGS = ['uz', 'ru', 'en', 'kr', 'kaa'];
const SCAN_DIRS = ['pages', 'components', 'layouts', 'plugins', 'mixins', 'utils', 'store', 'middleware', 'constants'];
const VERBOSE = process.argv.includes('--verbose');
const AS_JSON = process.argv.includes('--json');

// Brend / kod / xalqaro belgilar — uz bilan bir xil bo'lishi yoki lotin bo'lishi MUMKIN.
const WHITELIST_VALUES = new Set([
  'ZeroX', 'UZS', 'USD', 'EUR', 'RUB', 'SMS', 'QR', 'Excel', 'PDF', 'PIN', 'Free', 'Start', 'Premium', 'Telegram',
  'Payme', 'Click', 'Uzum', 'MyID', 'Google', 'Apple', 'App Store', 'Google Play', 'Android', 'iOS', 'ID', 'OK',
  'PINFL', 'Email', 'E-mail', 'CSV', 'Web', 'API', 'Pro', 'Plus', 'Standard', 'Basic', 'VIP', 'Instagram',
  'YouTube', '+998 XX XXX XX XX', 'Gap (Чёрная касса)', 'Facebook', 'WhatsApp', 'Uzcard', 'Humo', 'Visa', 'Mastercard', 'GPS', 'FAQ', 'OFD', 'URL',
]);
// Xalqaro so'zlar (internatsionalizm) — qoraqalpoq (kaa) va ingliz (en) tilida uz bilan BIR XIL yoziladi; qo'lda tekshirilgan.
const LOANWORDS_SAME = new Set([
  'Summa', 'Telefon', 'Limit', 'Dividend', 'kreditor', 'debitor', 'Kreditor', 'Debitor', 'Trend', 'Tariflar', 'Status', 'Pasport',
  'Pasport (ID karta)', 'May', 'Komissiya', 'Kirim', 'Keyingisi', 'Kategoriya', 'Karta', 'Internet', 'Ijara', 'Direktor', 'Biznes',
  'Bank', 'Balans', 'Aktiv seans', 'Aktiv seanslar', 'ball', 'Yanvar', 'Fevral', 'Mart', 'Aprel', 'Iyun', 'Iyul', 'Avgust', 'Noyabr',
  'Dekabr', 'Valyuta', 'Texnika', 'Sport', 'Siz', 'Men', 'Shtrix kod', 'Sayt', 'STIR', 'SMS xabarlar', 'Reyting', 'QR-kod', 'Pachka',
  'Modullar', 'Metr', 'Litr', 'Kilogram', 'Kredit', 'Kredit limiti', 'Kredit karta', 'Kommunal', 'Kalendar', 'Filtr', 'Erkin pul',
  'Bank krediti (annuitet)', 'Aktiv', 'Telefon (login)', 'Bank krediti', 'Avtomobil', 'Analitika', 'USD (dollar)',
]);
const WHITELIST_KEY_RE = [/(^|\.)(brand|logo|currency|code|iso)(\.|$)/i];
// Lotin so'zlar ru/kr qiymatida ruxsat etiladi (brend/kod/format).
const LATIN_OK_RE = /\b(X{2,}|ZeroX|UZS|USD|EUR|RUB|SMS|QR|Excel|PDF|PIN|PINFL|Free|Start|Premium|Telegram|Payme|Click|Uzum|MyID|Google|Apple|Play|App|Store|Android|iOS|ID|OK|Email|E-mail|CSV|Web|API|VIP|Instagram|YouTube|Facebook|WhatsApp|Uzcard|Humo|Visa|Mastercard|GPS|FAQ|OFD|URL|HTTP|HTTPS|www|zerox|uz|com|org|Wi-Fi|WiFi|kg|km|mb|Mb|MB|GB|px|DD|MM|YYYY|IP|USSD|EN|RU|KR|KAA|UZ|PNG|JPG|JPEG|SVG|XLSX|PRO|Pro|Plus|Basic|Standard|Gap|Bot|bot|Pay|Mini|MiniApp|iPhone|Safari|Chrome|Gmail|Yandex|Eskiz|SSL|VPN|NFC|ATM|HUMO|Mir|UnionPay|Paynet|ZeroXuzbot|zeroxuz_bot|Samsung|Gavhar|ZEROX|MAD|gap_ulash)\b/g;

function loadLang(code) {
  const src = fs.readFileSync(path.join(ROOT, 'lang', code + '.js'), 'utf8').replace(/^\s*export\s+default\s+/m, 'return ');
  // lang fayllari repo ichidagi ishonchli lokal fayllar
  return new Function(src)();
}
function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? prefix + '.' + k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (f.name === 'node_modules' || f.name === 'dist' || f.name === '.nuxt') continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p, out);
    else if (/\.(vue|js)$/.test(f.name)) out.push(p);
  }
  return out;
}

const langs = {};
for (const l of LANGS) langs[l] = flatten(loadLang(l));

// ---- (a) kalitlar ----
const KEY_RE = /(?<![\w$])\$?tc?e?(?:\?\.)?\(\s*(['"`])([A-Za-z0-9_]+(?:\.[A-Za-z0-9_-]+)+)\1(?!\s*\+)/g;
const used = new Map(); // key -> Set(files)
const files = SCAN_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  KEY_RE.lastIndex = 0;
  let m;
  while ((m = KEY_RE.exec(src))) {
    const k = m[2];
    if (!used.has(k)) used.set(k, new Set());
    used.get(k).add(path.relative(ROOT, f).replace(/\\/g, '/'));
  }
}
const missing = {};
for (const l of LANGS) missing[l] = [];
for (const k of used.keys()) for (const l of LANGS) if (!(k in langs[l])) missing[l].push(k);

const allKeys = new Set(LANGS.flatMap((l) => Object.keys(langs[l])));
const keyDiff = {}; // 5 fayl kalitlari ittifoqida shu tilda yo'q
for (const l of LANGS) keyDiff[l] = [...allKeys].filter((k) => !(k in langs[l]));

const identical = { ru: [], en: [], kr: [], kaa: [] };
for (const k of Object.keys(langs.uz)) {
  const uz = langs.uz[k];
  if (typeof uz !== 'string') continue;
  const words = uz.replace(/\{[^}]*\}/g, ' ').replace(/%[sd]/g, ' ');
  if (!/[A-Za-z]{3,}/.test(words)) continue;
  if (WHITELIST_VALUES.has(uz.trim()) || WHITELIST_KEY_RE.some((r) => r.test(k))) continue;
  for (const l of Object.keys(identical)) {
    if ((l === 'kaa' || l === 'en') && LOANWORDS_SAME.has(uz.trim())) continue;
    if (langs[l][k] === uz) identical[l].push(k);
  }
}

// yozuv mosligi
const scriptIssues = { ru: [], kr: [], en: [], kaa: [] };
const UZ_APOS_RE = /[A-Za-z][oOgG][‘’ʻʼ'`´][A-Za-z]/;
// ingliz matnida o'zbekcha so'z (apostrofsiz) qolib ketgan bo'lsa
const UZ_WORDS_RE = /\b(qarz\w*|shartnoma\w*|muddat\w*|berilgan|olingan|mijoz\w*|eslatma\w*|kiriting|yuborish|saqlash|tasdiqlash|hisobot\w*|foydalanuvchi\w*)\b/i;
for (const l of Object.keys(scriptIssues)) {
  for (const [k, v] of Object.entries(langs[l])) {
    if (typeof v !== 'string') continue;
    const plain = v.replace(/\{[^}]*\}/g, ' ').replace(/%[sd]/g, ' ').replace(/\+?\d*X{2,}/g, ' ').replace(LATIN_OK_RE, ' ');
    if (l === 'ru' || l === 'kr') {
      if (/[A-Za-z]{3,}/.test(plain)) scriptIssues[l].push(k + ' = ' + v.slice(0, 70));
    } else if (/[Ѐ-ӿ]{2,}/.test(v)) {
      scriptIssues[l].push(k + ' = ' + v.slice(0, 70));
    } else if ((l === 'en' || l === 'kaa') && UZ_APOS_RE.test(plain)) {
      scriptIssues[l].push(k + ' = ' + v.slice(0, 70));
    } else if (l === 'en' && UZ_WORDS_RE.test(plain)) {
      scriptIssues[l].push(k + ' = ' + v.slice(0, 70));
    }
  }
}

// ---- (b) qattiq o'zbekcha literallar ----
const APOS = "['‘’ʻʼ`´]";
const UZ_MARKERS = [
  new RegExp('[a-zA-Z][oOgG]' + APOS + '[a-zA-Z]'),
  /[ʻʼ]/,
  // qo'shimcha o'zbekcha so'zlar (matn sifatida: kamida ikki so'z yoki apostrofli so'z)
  /\b(yuklan\w*|topilma\w*|kontragent\w*|bosh sahifa|orqaga|davom etish|keyingi|oldingi|yopish|tahrirlash|qo'shish|izoh|qoldiq|undirilgan|qaytarilgan|shikoyat\w*|tugallangan|aktiv|faol|yuborildi|saqlandi|o'chirildi|xatolik|iltimos|kiriting|tanlang|ro'yxat\w*|sana\w*|qidirish|natija\w*|mavjud emas|yo'q)\b/i,
  new RegExp('\\b(qarz\\w*|shaxsiy|muddati\\w*|berilgan|olingan|jarayonda|to' + APOS + '?lov\\w*|mijoz\\w*|do' + APOS + 'kon\\w*|eslatma\\w*|tarif\\w*|kiritilgan|saqlash|bekor|tasdiqlash|yuborish|ro' + APOS + 'yxat\\w*|xatolik|muvaffaqiyat\\w*|hisob\\w*|foydalanuvchi\\w*|telefon raqam\\w*)\\b', 'i'),
];
function stripNoise(line) {
  return line
    .replace(/\$t[ce]?\(\s*(['"`])[^'"`]*\1/g, ' ')
    .replace(/\bt\(\s*(['"`])[A-Za-z0-9_.-]+\1/g, ' ');
}
const SKIP_FILES = /^(utils\/(privacyPolicy|pricingPlans)|components\/(OfferUz|OfferRu|OfferEn|pricing\/)|pages\/(price\/index|public-offer|privacy-policy))/;
// Qo'lda tekshirilgan soxta ijobiy (CSS sinf / kalit / texnik satr) — aniq matn ro'yxati.
const FALSE_POSITIVES = new Set(['box qarz']);
const hardcoded = [];
const incompleteMaps = [];
const branchIssues = []; // v-if="$apiLang() == 'uz'" (en/kaa ga ham uz ko'rsatadi) yoki locale branch'larida en/kaa yo'q
for (const f of files) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  if (SKIP_FILES.test(rel)) continue;
  const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
  let inBlock = false;
  let inStyle = false;
  let inHtmlComment = false;
  // Mahalliy til xaritasi: `uz:` qatori bilan BIR XIL chekinishdagi qo'shni qatorlarda ru/kr/kaa/en kalitlari bormi.
  const indentOf = (s) => s.match(/^\s*/)[0].length;
  const langKeyRe = /^\s*['"]?(uz|ru|kr|kaa|en)['"]?\s*:/;
  const siblingLangs = (i) => {
    const n = indentOf(lines[i]);
    const found = new Set();
    for (const dir of [-1, 1]) {
      for (let j = i + dir; j >= 0 && j < lines.length; j += dir) {
        if (!lines[j].trim()) continue;
        const ind = indentOf(lines[j]);
        if (ind < n) break;
        if (ind === n && langKeyRe.test(lines[j])) {
          for (const m of lines[j].matchAll(/(?:^|[\s{,])['"]?(uz|ru|kr|kaa|en)['"]?\s*:/g)) found.add(m[1]);
        }
      }
    }
    // uz qatorining o'zida inline berilgan boshqa tillar
    for (const m of lines[i].matchAll(/[\s{,]['"]?(ru|kr|kaa|en)['"]?\s*:/g)) found.add(m[1]);
    return found;
  };
  const mapComplete = (i) => { const s = siblingLangs(i); return ['ru', 'kr', 'kaa', 'en'].every((c) => s.has(c)); };
  const src = lines.join('\n');
  const hasEnBranch = /locale\s*===?\s*['"]en['"]/.test(src);
  const hasKaaBranch = /locale\s*===?\s*['"]kaa['"]/.test(src);
  let skipIndent = -1; // to'liq xarita tilidagi blokni (ko'p qatorli) o'tkazib yuborish
  lines.forEach((raw, i) => {
    let line = raw;
    if (/<style\b/.test(line)) inStyle = true;
    if (/<\/style>/.test(line)) { inStyle = false; return; }
    if (inStyle) return;
    if (skipIndent >= 0) {
      const ind = indentOf(line);
      if (!line.trim() || ind > skipIndent || (ind === skipIndent && /^\s*[}\]]/.test(line))) return;
      skipIndent = -1;
    }
    if (inBlock) {
      if (line.includes('*/')) { inBlock = false; line = line.slice(line.indexOf('*/') + 2); } else return;
    }
    if (inHtmlComment) {
      if (line.includes('-->')) { inHtmlComment = false; line = line.slice(line.indexOf('-->') + 3); } else return;
    }
    if (/<!--/.test(line) && !/-->/.test(line.slice(line.indexOf('<!--')))) { inHtmlComment = true; line = line.slice(0, line.indexOf('<!--')); }
    if (/^\s*(\/\/|\*|\/\*|<!--)/.test(line)) { if (/\/\*/.test(line) && !/\*\//.test(line)) inBlock = true; return; }
    line = line.replace(/\/\*.*?\*\//g, '').replace(/<!--.*?-->/g, '').replace(/(^|[\s;,)])\/\/ .*$/, '$1');
    if (/^\s*(import|export .* from|const .* = require)\b/.test(line)) return;
    if (/console\.(log|warn|error|debug|info)|logger\./.test(line)) return;
    line = stripNoise(line);
    // $t(..) || 'zaxira' — zaxira literal; kalit mavjudligi alohida tekshiriladi
    line = line.replace(/\|\|\s*(['"`])(?:\\.|(?!\1).)*\1/g, ' ');
    // bir qatorli to'liq xarita: { uz: '..', ru: '..', kr: '..', en: '..', kaa: '..' }[locale]
    if (['uz', 'ru', 'kr', 'kaa', 'en'].every((c) => new RegExp('(^|[\\s{,])' + c + '\\s*:').test(line))) return;
    if (langKeyRe.test(line)) {
      const isUz = /^\s*['"]?uz['"]?\s*:/.test(line);
      if (isUz && !mapComplete(i)) incompleteMaps.push({ file: rel, line: i + 1, text: line.trim().slice(0, 90) });
      // til-kalitli blok: faqat to'liq xaritada (yoki uz bo'lmagan tillarda) ichini o'tkazib yuboramiz
      if (!isUz || mapComplete(i)) {
        const opens = (line.match(/[{[]/g) || []).length - (line.match(/[}\]]/g) || []).length;
        if (opens > 0) skipIndent = indentOf(line);
        return;
      }
      // to'liq bo'lmagan xarita: uz qatori (va ichi) tekshiriladi
    }
    // if-zanjir: if (locale === 'uz') return ...; if (locale === 'kr') ...; — fayl en va kaa shoxlariga ham ega bo'lsa to'liq deb olinadi
    if (/\blocale\s*===?\s*'uz'/.test(line) && !/v-if|v-else-if/.test(line) && hasEnBranch && hasKaaBranch) return;
    // til tarmog'i (v-if): matn bloki faqat bir tilga bog'langan
    const br = line.match(/\b(v-if|v-else-if)="[^"]*(apiLang\(\)|locale)\s*===?\s*'(uz|ru|kr)'/);
    // logotip variantlari (logo_ru.svg / logo_kr.svg) va `!= 'ru'` juftligi bo'lgan satrlar til-matni emas
    const isLogo = br && /<img\s*$/.test(lines[i - 1] || '') && /logo/.test(lines[i + 1] || '');
    const hasNeRu = /locale\s*!=\s*'ru'/.test(src);
    if (br && !isLogo && !(hasNeRu && /locale\s*==\s*'ru'/.test(line))) {
      const viaApi = /apiLang\(\)\s*===?\s*'uz'/.test(line);
      if (viaApi || !(hasEnBranch && hasKaaBranch)) branchIssues.push({ file: rel, line: i + 1, text: line.trim().slice(0, 90) });
      if (/>\s*$/.test(line) && !/<\/\w+>\s*$/.test(line)) skipIndent = indentOf(line);
    }
    // aniq `uz` shoxi (en va kaa shoxlari ham mavjud fayl) — o'zbekcha matn to'g'ri joyda
    if (br && /'uz'/.test(br[0]) && !/apiLang/.test(br[0]) && hasEnBranch && hasKaaBranch) return;
    const chunks = [];
    let m;
    const strRe = /(['"`])((?:\\.|(?!\1).)*)\1/g;
    while ((m = strRe.exec(line))) chunks.push(m[2]);
    const tplRe = />([^<>{}]+)</g;
    while ((m = tplRe.exec(line))) chunks.push(m[1]);
    if (/\.vue$/.test(f)) {
      const tn = line.match(/^\s*([^<>{}='":;()]+)\s*$/);
      if (tn) chunks.push(tn[1]);
    }
    for (const c of chunks) {
      const s = c.trim();
      if (s.length < 3 || FALSE_POSITIVES.has(s)) continue;
      if (/localePath\(|\.qarz_soni|^m=[0-9a-f]{8}/.test(s)) continue; // route nomi / texnik satr (qo'lda tekshirilgan)
      // kod identifikatorlari / eksport fayl nomi (qo'lda tekshirilgan soxta ijobiy)
      if (/===|!==|=>|px-\d|rounded|\bflex\b|\bbg-[a-z]|&&|\|\||\?\.|\bdata\.|goManage\(|&from=|\$\{this\.|\.qarz\b|\bqarz\.|\.tolov|\btolov\b|encodeURI|\?mijoz=|\.berilgan|\bcell\.|\bm\.qarz|\bbt\.qarz|\.mijoz\b|\.xlsx|\$\{type/.test(s)) continue;
      if (/^(https?:|\/|#|\.)/.test(s)) continue;
      if (/^[\w\-./:#@?=&%[\]{}$,|]+$/.test(s) && !/[ʻʼ]/.test(s)) continue; // bitta token: kalit/class/url
      if (UZ_MARKERS.some((r) => r.test(s))) { hardcoded.push({ file: rel, line: i + 1, text: s.slice(0, 90) }); break; }
    }
  });
}

// Ongli ravishda o'zbekcha qoladigan joylar (hisobotda alohida ko'rsatiladi, hisobga olinmaydi):
const ALLOWLIST = [
  { re: /^components\/AdminMenu\.vue$/, why: "xodimlar uchun ichki admin panel (/chick) — faqat o'zbekcha" },
  { re: /^mixins\/(qarzTalabMixin|financeDemandMixin)\.js$/, why: "SMS matni (Eskiz shabloni) — SMS faqat o'zbek tilida yuboriladi" },
  { re: /^utils\/helpers\.js$/, why: "ishlatilmaydigan validatePassword xabari (o'lik kod)" },
  { re: /^constants\/index\.js$/, why: "ishlatilmaydigan CURRENCY_SYMBOLS (formatCurrency hech qayerda chaqirilmaydi)" },
];
const BRANCH_ALLOW = [{ re: /^components\/actModals\//, why: "huquqiy dalolatnoma matni — PDF faqat uz/ru/kr da (backend en/kaa ni uz ga xaritalaydi)" }];
const allowlisted = [];
for (let i = branchIssues.length - 1; i >= 0; i--) {
  const a = BRANCH_ALLOW.find((x) => x.re.test(branchIssues[i].file));
  if (a) allowlisted.push({ ...branchIssues.splice(i, 1)[0], why: a.why });
}
for (let i = hardcoded.length - 1; i >= 0; i--) {
  const a = ALLOWLIST.find((x) => x.re.test(hardcoded[i].file));
  if (a) allowlisted.push({ ...hardcoded.splice(i, 1)[0], why: a.why });
}

// ---- hisobot ----
const total = (o) => Object.values(o).reduce((a, b) => a + b.length, 0);
const summary = {
  usedKeys: used.size,
  missingUsedKeys: total(missing),
  missingByLang: Object.fromEntries(LANGS.map((l) => [l, missing[l].length])),
  keyUnionGaps: Object.fromEntries(LANGS.map((l) => [l, keyDiff[l].length])),
  identicalToUz: Object.fromEntries(Object.entries(identical).map(([l, a]) => [l, a.length])),
  identicalTotal: total(identical),
  scriptIssues: Object.fromEntries(Object.entries(scriptIssues).map(([l, a]) => [l, a.length])),
  scriptIssuesTotal: total(scriptIssues),
  hardcodedUzbek: hardcoded.length,
  allowlistedHardcoded: allowlisted.length,
  incompleteLocaleMaps: incompleteMaps.length,
  localeBranchIssues: branchIssues.length,
};
if (AS_JSON) {
  console.log(JSON.stringify({ summary, missing, identical, keyDiff, scriptIssues, hardcoded, allowlisted, incompleteMaps, branchIssues }, null, 1));
} else {
  console.log('== i18n check (' + ROOT + ') ==');
  console.log(JSON.stringify(summary));
  if (VERBOSE) {
    for (const l of LANGS) if (missing[l].length) console.log('\n[MISSING used keys in ' + l + ']\n  ' + missing[l].join('\n  '));
    for (const l of LANGS) if (keyDiff[l].length) console.log('\n[KEY-UNION gaps in ' + l + ']\n  ' + keyDiff[l].join('\n  '));
    for (const l of Object.keys(identical)) {
      if (identical[l].length) console.log('\n[IDENTICAL to uz in ' + l + ']\n  ' + identical[l].map((k) => k + ' = ' + String(langs.uz[k]).slice(0, 60)).join('\n  '));
    }
    for (const l of Object.keys(scriptIssues)) if (scriptIssues[l].length) console.log('\n[SCRIPT mismatch in ' + l + ']\n  ' + scriptIssues[l].join('\n  '));
    if (incompleteMaps.length) console.log('\n[INCOMPLETE local locale maps]\n  ' + incompleteMaps.map((h) => h.file + ':' + h.line + '  ' + h.text).join('\n  '));
    if (branchIssues.length) console.log('\n[LOCALE BRANCH issues: v-if uz/ru/kr shoxi (apiLang() uz = en/kaa ga ham uz) yoki en/kaa shoxi yo\'q]\n  ' + branchIssues.map((h) => h.file + ':' + h.line + '  ' + h.text).join('\n  '));
    if (allowlisted.length) console.log('\n[ALLOWLISTED (ongli ravishda o\'zbekcha)]\n  ' + allowlisted.map((h) => h.file + ':' + h.line + '  [' + h.why + ']').join('\n  '));
    if (hardcoded.length) console.log('\n[HARDCODED uzbek]\n  ' + hardcoded.map((h) => h.file + ':' + h.line + '  ' + h.text).join('\n  '));
  }
}
if (process.argv.includes('--strict') && (summary.missingUsedKeys || summary.identicalTotal || summary.hardcodedUzbek || summary.scriptIssuesTotal || summary.incompleteLocaleMaps || summary.localeBranchIssues)) process.exit(1);
