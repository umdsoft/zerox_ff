/**
 * ZeroX — Qarz daftari: mijoz bo'yicha AMALIYOTLAR TARIXI (timeline) yig'ish.
 *
 * 29.09 (doc2 1-rasm): mijoz sahifasidagi yangi "Amaliyotlar tarixi" kartasi oxirgi amaliyotlarni
 * ko'rsatadi — to'liq tarix sahifasi (`pages/qarz-daftari/mijoz/_id/amaliyotlar.vue`) bilan AYNAN
 * bir xil qatorlar chiqishi uchun mantiq shu yerga ajratildi (DRY). Ikkala sahifa ham shu
 * funksiyalardan foydalanadi.
 *
 * @module utils/qarzDaftariTimeline
 */

/**
 * Qarzni id bo'yicha topish.
 * @param {Array<Object>} qarzlar
 * @param {number|string} id
 * @returns {Object|null}
 */
export function findQarz(qarzlar, id) {
  return (qarzlar || []).find((q) => Number(q.id) === Number(id)) || null;
}

/**
 * Bo'lib to'lash qarzimi. MySQL'dan bolib_tolash turli tipda kelishi mumkin (1/"1"/true...),
 * oylar_soni > 0 bo'lsa ham bo'lib to'lash deb qabul qilinadi.
 * @param {Object|null} qarz
 * @returns {boolean}
 */
export function isBolibTolashQarz(qarz) {
  if (!qarz) return false;
  return Number(qarz.bolib_tolash) === 1 || Number(qarz.oylar_soni) > 0;
}

/**
 * Amaliyotlar tarixi qatorlari — KAFOLATLI to'liqlik (amaliyotlar.vue'dagi mantiq aynan):
 *  1) real 'berish' tranzaksiyalari (xodim/konsolidatsiya berishlari ham);
 *  2) real 'berish' yozuvi YO'Q eski qarzlar uchun sintetik satr (`_derived`);
 *  3) qaytarish / voz_kechish eventlari;
 *  4) sana bo'yicha yangidan eskiga.
 *
 * @param {Array<Object>} scopedQarzlar - sahifa ko'rsatadigan qarzlar (turi bo'yicha filtrlangan)
 * @param {Array<Object>} tranzaksiyalar - GET /mijozlar/:id/history `tranzaksiyalar`
 * @returns {Array<Object>}
 */
export function buildQarzTimeline(scopedQarzlar, tranzaksiyalar) {
  const allTrs = tranzaksiyalar || [];
  const qarzlar = scopedQarzlar || [];
  const scopedIds = new Set(qarzlar.map((q) => Number(q.id)));

  const realBerish = allTrs.filter((t) => scopedIds.has(Number(t.qarz_id)) && t.turi === 'berish');
  const withBerish = new Set(realBerish.map((t) => Number(t.qarz_id)));

  const synthBerish = qarzlar
    .filter((q) => !withBerish.has(Number(q.id)))
    .map((q) => ({
      id: `berish-${q.id}`,
      qarz_id: q.id,
      turi: 'berish',
      summa: q.miqdor,
      valyuta: q.valyuta,
      izoh: q.mahsulot_nomi || null,
      created_at: q.created_at || q.berilgan_sana || '1970-01-01T00:00:00',
      _derived: true,
    }));

  const otherEvents = allTrs.filter((t) => scopedIds.has(Number(t.qarz_id)) && t.turi !== 'berish');

  const combined = [...realBerish, ...synthBerish, ...otherEvents];
  combined.sort((a, b) => {
    const ta = new Date(b.created_at).getTime();
    const tb = new Date(a.created_at).getTime();
    return (isNaN(ta) ? 0 : ta) - (isNaN(tb) ? 0 : tb);
  });
  return combined;
}

/**
 * Amaliyot turi (ko'rsatish uchun): 'berish' | 'olish' | 'qaytarish' | 'voz_kechish' | boshqa.
 * 'berish' tranzaksiyasi ota qarz 'olish' bo'lsa — "Qarz olindi".
 * @param {Object} tr
 * @param {Array<Object>} qarzlar
 * @returns {string}
 */
export function timelineKind(tr, qarzlar) {
  if (!tr) return '';
  if (tr.turi === 'berish') {
    const parent = findQarz(qarzlar, tr.qarz_id);
    return parent && parent.turi === 'olish' ? 'olish' : 'berish';
  }
  return tr.turi || '';
}

/** 'berish' izohi = shu berishdagi mahsulot nomi; boshqa amaliyotlarda mahsulot yo'q. */
export function trMahsulot(tr) {
  if (tr && tr.turi === 'berish') {
    return tr.izoh && String(tr.izoh).trim() ? String(tr.izoh).trim() : '';
  }
  return '';
}

/** Amaliyotni bajargan shaxs telefoni; sintetik satrda — qarz kirituvchisi. */
export function trBajaruvchiTel(tr, qarzlar) {
  if (tr && tr.bajaruvchi_telefon) return tr.bajaruvchi_telefon;
  const parent = findQarz(qarzlar, tr && tr.qarz_id);
  return (parent && parent.registrar_telefon) || '';
}

/** Vaqt bo'yicha (eskidan yangiga), teng bo'lsa id bo'yicha — barqaror tartib. */
function byCreatedAsc(a, b) {
  const ta = new Date(a && a.created_at).getTime();
  const tb = new Date(b && b.created_at).getTime();
  const diff = (isNaN(ta) ? 0 : ta) - (isNaN(tb) ? 0 : tb);
  return diff || (Number(a && a.id) || 0) - (Number(b && b.id) || 0);
}

/**
 * 01.10 (doc2 1/2-rasm): "Aktiv qarzlar" qatori → shu qarzning "Qarz berildi / olindi" AMALIYOTI
 * (tafsilot sahifasi `qarz-daftari/tranzaksiya/_id`). Mobil `qarzAmaliyot.ts creationParams` bilan
 * AYNAN bir xil qoida:
 *  - qarzda BITTA 'berish' yozuvi bo'lsa — aynan o'sha (summa, sana, kim bajargan — haqiqiy yozuv);
 *  - bir nechta (muddati o'tgan qarzlar KONSOLIDATSIYA qilingan) yoki umuman yo'q (eski yozuv) —
 *    qarzning O'ZIDAN: summa = qarzning JAMI miqdori (ro'yxat qatoridagi summa bilan bir xil),
 *    vaqt va bajaruvchi — birinchi yozuvdan. id = `berish-<qarzId>` (sintetik) — sahifa F5 da ham
 *    (loadFallback) aynan shu qarz-darajadagi ko'rinishni tiklaydi.
 *
 * @param {Object} qarz
 * @param {Array<Object>} tranzaksiyalar
 * @returns {Object|null} tranzaksiya (yangi obyekt; kirish o'zgarmaydi)
 */
export function creationTr(qarz, tranzaksiyalar) {
  if (!qarz) return null;
  const own = (Array.isArray(tranzaksiyalar) ? tranzaksiyalar : [])
    .filter((t) => t && Number(t.qarz_id) === Number(qarz.id) && t.turi === 'berish')
    .slice()
    .sort(byCreatedAsc);
  if (own.length === 1) return { ...own[0] };
  const first = own[0] || null;
  return {
    id: `berish-${qarz.id}`,
    qarz_id: qarz.id,
    turi: 'berish',
    summa: qarz.miqdor,
    valyuta: qarz.valyuta,
    izoh: qarz.mahsulot_nomi || null,
    created_at: (first && first.created_at) || qarz.created_at || qarz.berilgan_sana || null,
    berilgan_sana: qarz.berilgan_sana || null,
    qaytarish_sanasi: qarz.qaytarish_sanasi || null,
    bajaruvchi_telefon: (first && first.bajaruvchi_telefon) || qarz.registrar_telefon || null,
    _derived: true,
  };
}

/**
 * Tranzaksiya tafsiloti sahifasi (`qarz-daftari/tranzaksiya/_id`) uchun store payload'i —
 * sahifa so'rovsiz DARHOL chiziladi. Nusxa (spread) — Vuex strict rejimida reaktiv havola xato beradi.
 */
export function trStorePayload(tr, qarzlar, mijozId, turi) {
  const parent = findQarz(qarzlar, tr.qarz_id);
  return {
    tranzaksiya: { ...tr },
    qarz: parent ? { ...parent } : null,
    mijozId,
    turi,
    bolibTolash: isBolibTolashQarz(parent),
    bajaruvchi: trBajaruvchiTel(tr, qarzlar),
    mahsulot: trMahsulot(tr),
  };
}

export default {
  findQarz,
  isBolibTolashQarz,
  buildQarzTimeline,
  timelineKind,
  trMahsulot,
  trBajaruvchiTel,
  trStorePayload,
  creationTr,
};
