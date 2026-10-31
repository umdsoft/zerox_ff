/**
 * wave C: pages/finance/gap/_id.vue — a'zo / tashkilotchi / tug'ilgan kun uchun sof funksiyalar (AYNAN ko'chirildi).
 */

/** SS-DEV (2026-09-30): asosiy tashkilotchi belgisi (user_id bo'yicha). */
export function isMainOrg(gap, m) {
  return !!(gap && m && m.user_id != null && m.user_id === gap.organizer_id);
}

/** 2-tashkilotchi: a'zolik id si, bo'lmasa user_id bo'yicha. */
export function isCoOrg(gap, m) {
  if (!gap || !m) {return false;}
  if (gap.co_organizer_member_id) {return m.id === gap.co_organizer_member_id;}
  return !!(gap.co_organizer_id && m.user_id === gap.co_organizer_id);
}

/** Minglik bo'shliq bilan (uz-UZ); bo'sh / musbat bo'lmagan / sonmas -> ''. */
export function formatThousands(v) {
  if (v === '' || v == null) {return '';}
  const n = Number(v);
  return isFinite(n) && n > 0 ? n.toLocaleString('uz-UZ').replace(/,/g, ' ') : '';
}

/** Tashkilotchi hamma uchun, oddiy a'zo faqat o'zi uchun kiritadi. */
export function canEditBirthday(gap, myId, b) {
  if (!gap) {return false;}
  return !!gap.is_organizer || (!!myId && b.user_id === myId);
}

/** "5-may 1990" ko'rinishi; sana yo'q -> ''. */
export function fmtBirthday(b, months) {
  if (!b || !b.birth_day) {return '';}
  const m = months[(b.birth_month || 1) - 1] || '';
  return `${b.birth_day}-${m}${b.birth_year ? ` ${  b.birth_year}` : ''}`;
}

/** Vue `v-model.number` bilan bir xil: parseFloat; son bo'lmasa asl qiymat. */
export function looseToNumber(value) {
  const n = parseFloat(value);
  return isNaN(n) ? value : n;
}
