/**
 * wave C: pages/finance/debts/group/_key.vue — qator / tugma yordamchilari (sof funksiyalar, AYNAN ko'chirildi).
 */

/** Pastel tugma klassi; o'chiq holat — kulrang (Tailwind 2.2 `disabled:` varianti ishlamaydi). */
export function actBtnClass(active, isDisabled) {
  return ['inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
    isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : active];
}

/** Tugallangan + (voz kechish belgisi yoki izoh) -> kechirilgan qarz. */
export function isForgiven(debt) {
  if (!debt || debt.status !== 'completed') {return false;}
  const pays = Array.isArray(debt.payments) ? debt.payments : [];
  if (pays.some((p) => /^__forgive__/.test(String(p.notes || '')))) {return true;}
  return /Kechirilgan|voz kechildi/i.test(String(debt.notes || ''));
}

/** 'active' YOKI 'overdue' — ochiq qarz. */
export function isOpen(debt) {
  return !!debt && (debt.status === 'active' || debt.status === 'overdue');
}

/** Muddati o'tganmi (ochiq + due_date < hozir). `now` — testlar uchun. */
export function isOverdue(debt, now = new Date()) {
  if (!debt.due_date || !isOpen(debt)) {return false;}
  return new Date(debt.due_date) < now;
}

/** To'langan foiz (butun). */
export function getPaidPercent(debt) {
  if (!debt.amount || debt.amount <= 0) {return 0;}
  const paidAmount = debt.amount - (debt.remaining_amount || 0);
  return Math.round((paidAmount / debt.amount) * 100);
}
