/**
 * ZeroX — Shaxsiy qarzlarni KONTRAGENT bo'yicha guruhlash.
 *
 * SS-27 (2026-09-19): ilgari bu mantiq faqat `pages/finance/debts/index.vue`
 * ichidagi `groupedDebts` computed'ida yashagan edi. Endi guruh qatoriga
 * bosilganda alohida sahifa (`pages/finance/debts/group/_key.vue`) ochiladi va
 * o'sha sahifa ham aynan shu guruhlashni qayta hisoblashi kerak — shuning uchun
 * mantiq shu yerga ajratildi (DRY).
 *
 * Guruhlash qoidasi:
 *  - Do'kon qarzlari (`is_shop_debt === true`) — `source_name` bo'yicha bitta
 *    guruh (kind = 'shop').
 *  - Qolgan hammasi (o'z qarzlarim + telefon-ko'zgu qarzlar) — telefonning
 *    OXIRGI 9 raqami bo'yicha, telefon bo'lmasa `source_name` bo'yicha bitta
 *    shaxs guruhi (kind = 'person'). Olingan + berilgan + ko'zgu birlashadi.
 *
 * @module utils/debtGroups
 */

import { titleCaseName } from './helpers';

/**
 * Bitta qarz uchun guruh kalitini hisoblash.
 * @param {Object} debt - Qarz obyekti
 * @returns {string} Guruh kaliti (masalan "person|p|901234567")
 */
export function buildDebtGroupKey(debt) {
  if (!debt) return '';
  if (debt.is_shop_debt === true) {
    return 'shop|' + String(debt.source_name || '').trim().toLowerCase();
  }
  const digits = String(debt.phone || '').replace(/\D/g, '');
  const last9 = digits.length >= 9 ? digits.slice(-9) : '';
  return last9
    ? 'person|p|' + last9
    : 'person|n|' + String(debt.source_name || '').trim().toLowerCase();
}

/**
 * Qarzlar ro'yxatini kontragent bo'yicha guruhlash.
 * Har bir guruhda `displayType`/`displayAmount` ham hisoblanadi (aralash
 * bo'lsa — sof qoldiq: kimga kim qarzdor).
 *
 * @param {Array<Object>} debts - Qarzlar ro'yxati
 * @returns {Array<Object>} Guruhlar (kirish tartibi saqlanadi)
 */
export function groupDebtsByCounterparty(debts) {
  const map = {};
  const order = [];

  for (const debt of debts || []) {
    const isShop = debt.is_shop_debt === true;
    const key = buildDebtGroupKey(debt);
    let g = map[key];
    if (!g) {
      g = {
        key,
        kind: isShop ? 'shop' : 'person',
        // SS-13: FISh bazada BOSH HARFLARDA bo'lishi mumkin ("QURAMBOYEV JAMSHID") —
        // shaxs nomini "Sarlavha" ko'rinishiga keltiramiz. Do'kon nomi asl holida
        // qoladi (brend nomi o'zgarmasligi kerak).
        name: isShop ? (debt.source_name || '?') : (titleCaseName(debt.source_name) || '?'),
        phone: debt.phone || '',
        currency: debt.currency || 'UZS',
        items: [],
        borrowedTotal: 0,
        lentTotal: 0
      };
      map[key] = g;
      order.push(g);
    }
    if (!g.phone && debt.phone) g.phone = debt.phone;
    g.items.push(debt);
    const rem = Number(debt.remaining_amount || 0);
    if (debt.type === 'borrowed') g.borrowedTotal += rem;
    else g.lentTotal += rem;
  }

  return order.map((g) => {
    const mixed = g.borrowedTotal > 0 && g.lentTotal > 0;
    const net = g.lentTotal - g.borrowedTotal;
    let displayType;
    let displayAmount;
    if (g.kind === 'shop') {
      // Do'kon qarzi — foydalanuvchi qarzdor (borrowed): jami qoldiq.
      displayType = 'borrowed';
      displayAmount = g.borrowedTotal + g.lentTotal;
    } else if (mixed) {
      // Aralash — sof qoldiq (kimga kim qarzdor).
      displayType = net >= 0 ? 'lent' : 'borrowed';
      displayAmount = Math.abs(net);
    } else if (g.lentTotal > 0) {
      displayType = 'lent';
      displayAmount = g.lentTotal;
    } else {
      displayType = 'borrowed';
      displayAmount = g.borrowedTotal;
    }
    return { ...g, count: g.items.length, mixed, net, displayType, displayAmount };
  });
}

/**
 * Guruh kalitini URL uchun xavfsiz ko'rinishga keltirish.
 * Kalit ichida `|`, bo'shliq va apostrof bo'lishi mumkin.
 * @param {string} key - Guruh kaliti
 * @returns {string}
 */
export function encodeGroupKey(key) {
  try {
    return encodeURIComponent(String(key == null ? '' : key));
  } catch (_) {
    return String(key == null ? '' : key);
  }
}

/**
 * URL'dagi `key` parametri bo'yicha guruhni topish.
 *
 * ⚠️ vue-router param qiymatini bir marta dekodlab beradi, shuning uchun
 * `$route.params.key` `encodeGroupKey()` natijasiga teng bo'ladi. Ammo
 * foydalanuvchi havolani qo'lda ochsa/yangilasa — allaqachon dekodlangan
 * kalit kelishi mumkin. Ikkala holatni ham qo'llab-quvvatlaymiz.
 *
 * @param {Array<Object>} groups - groupDebtsByCounterparty() natijasi
 * @param {string} routeKey - $route.params.key
 * @returns {Object|null}
 */
export function findGroupByRouteKey(groups, routeKey) {
  const raw = String(routeKey == null ? '' : routeKey);
  if (!raw) return null;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch (_) {
    decoded = raw;
  }
  const list = groups || [];
  for (const g of list) {
    if (g.key === decoded || g.key === raw) return g;
  }
  return null;
}

export default {
  buildDebtGroupKey,
  groupDebtsByCounterparty,
  encodeGroupKey,
  findGroupByRouteKey
};
