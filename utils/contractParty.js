/**
 * Shartnoma ro'yxatidagi qarama-qarshi tomonning to'liq ismi (F.I.Sh. bo'lsa shuni, aks holda `*_name`).
 * `isCreditor` — joriy foydalanuvchi kreditor bo'lsa, qarshi tomon = debitor.
 */
export function partyFullName(item, isCreditor) {
  if (isCreditor) {
    if (item.d_last_name && item.d_first_name) {
      return `${item.d_last_name} ${item.d_first_name} ${item.d_middle_name || ''}`.trim();
    }
    return item.debitor_name || '';
  }
  if (item.c_last_name && item.c_first_name) {
    return `${item.c_last_name} ${item.c_first_name} ${item.c_middle_name || ''}`.trim();
  }
  return item.creditor_name || '';
}
