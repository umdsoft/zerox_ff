import { describe, it, expect } from 'vitest';
import * as F from '@/utils/format';
import * as Formatters from '@/utils/formatters';
import * as H from '@/utils/helpers';
import * as L from './legacyFormatters';

const SAMPLES = [
  undefined, null, '', ' ', 0, 1, -1, 12, 999, 1000, 1234, 1234.5, 1234.5678, 79000, '79000.00', '1 234,5', '1234,5',
  '  12 345  ', 'abc', '12abc', NaN, Infinity, -1500.4, -0.4, 1e21, '0', true,
];
const DATES = [
  undefined, null, '', 0, '2026-09-24', '2026-09-24 10:00:00', '2026-09-24T20:00:00Z', '2026-9-4', '24.09.2026',
  'garbage', new Date(2026, 8, 4, 10, 0), new Date(Date.UTC(2026, 8, 24, 20)), new Date('x'), 1790000000000, '2026-09-24x',
];
const safe = (fn, ...a) => { try { return fn(...a); } catch (e) { return `THROWS:${e.constructor.name}`; } };

describe('aliases keep old behaviour', () => {
  it('beautySum === legacy', () => { for (const v of SAMPLES) expect(safe(F.beautySum, v)).toBe(safe(L.legacyBeautySum, v)); });
  it('dateBeauty === legacy', () => { for (const v of DATES) expect(safe(F.dateBeauty, v)).toBe(safe(L.legacyDateBeauty, v)); });
  it('formatters.js aliases point at format.js', () => {
    expect(Formatters.formatAmount).toBe(F.formatAmountRaw);
    expect(Formatters.formatDate).toBe(F.formatDateLocalIso);
    expect(Formatters.getRelativeTime).toBe(F.relativeTimeLabel);
    expect(Formatters.default.formatAmount).toBe(F.formatAmountRaw);
  });
  it('formatters.js pinned outputs', () => {
    expect(Formatters.formatAmount(1234567)).toBe('1 234 567');
    expect(Formatters.formatAmount('abc')).toBe('abc');
    expect(Formatters.formatAmount('')).toBe('');
    expect(Formatters.formatAmount(null)).toBe('0');
    expect(Formatters.formatDate('2026-09-24T20:00:00Z')).toBe('24.09.2026');
    expect(Formatters.formatDate('')).toBe('');
    expect(Formatters.formatDate(new Date(2026, 8, 4, 1, 0))).toBe('04.09.2026');
    expect(Formatters.cleanPhoneNumber('+998 90 123 45 67')).toBe('+998901234567');
    expect(Formatters.isValidUzbekPhone('+998 90 123 45 67')).toBe(true);
    expect(Formatters.formatTime(125)).toBe('02:05');
    expect(Formatters.parseDate('')).toBeNull();
  });
  it('re-exports from helpers are the same function objects', () => {
    for (const k of ['formatNumber', 'formatMoney', 'formatMoneyCur', 'fmtDMY', 'fmtDMYHM', 'fmtHM', 'fmtBirthDate', 'formatDate', 'formatDateLocale']) {
      expect(F[k]).toBe(H[k]);
    }
  });
});

describe('local copies replaced by shared functions (identical on matrix)', () => {
  it('fmtNum x3 -> formatIntGrouped', () => {
    for (const v of SAMPLES) {
      expect(F.formatIntGrouped(v)).toBe(L.legacyFmtNum(v));
      expect(F.formatIntGrouped(v)).toBe(L.legacyFmtNumB(v));
    }
  });
  it('gap fmtDate x2 -> fmtIsoSliceDMY', () => {
    for (const v of DATES) expect(F.fmtIsoSliceDMY(v)).toBe(L.legacyGapFmtDate(v));
  });
});

describe('DIVERGENT local copies (NOT replaced; pinned so divergence stays visible)', () => {
  it('gap fmtDate vs fmtDMY differ for UTC instants near midnight', () => {
    expect(L.legacyGapFmtDate('2026-09-24T20:00:00Z')).toBe('24.09.2026');
    expect(H.fmtDMY('2026-09-24T20:00:00Z', '')).toBe('25.09.2026');
  });
  it('gap fmtDate returns raw for non-dash, fmtDMY parses', () => {
    expect(L.legacyGapFmtDate('24.09.2026')).toBe('24.09.2026');
    expect(L.legacyGapFmtDate('2026-9-4')).toBe('4.9.2026');
    expect(H.fmtDMY('2026-9-4', '')).toBe('04.09.2026');
  });
  it('gap-invite fmtDate: regex prefix, raw otherwise', () => {
    expect(L.legacyGapInviteFmtDate('2026-09-24T20:00:00Z')).toBe('24.09.2026');
    expect(L.legacyGapInviteFmtDate('2026-9-4')).toBe('2026-9-4');
    expect(L.legacyGapInviteFmtDate('')).toBe('');
    expect(L.legacyGapInviteFmtDate('24.09.2026')).toBe('24.09.2026');
  });
  it('price fmtDate: empty -> em dash, unparseable -> em dash (fmtDMY returns raw)', () => {
    expect(L.legacyPriceFmtDate('garbage')).toBe('—');
    expect(H.fmtDMY('garbage')).toBe('garbage');
    expect(L.legacyPriceFmtDate('')).toBe('—');
    expect(L.legacyPriceFmtDate('2026-09-24')).toBe('24.09.2026');
  });
  it('price formatPrice vs mobil-hisob formatPrice', () => {
    expect(L.legacyPriceFormatPrice(1234567)).toBe('1 234 567');
    expect(L.legacyMobilHisobFormatPrice('1 234 567 so\'m')).toBe('1 234 567');
    expect(L.legacyMobilHisobFormatPrice('12.5')).toBe('125');
    expect(() => L.legacyPriceFormatPrice(null)).toThrow();
    expect(() => L.legacyMobilHisobFormatPrice(null)).toThrow();
  });
  it('formatAmountRaw vs formatNumber', () => {
    expect(F.formatAmountRaw('')).toBe('');
    expect(H.formatNumber('')).toBe('0');
    expect(F.formatAmountRaw('abc')).toBe('abc');
    expect(H.formatNumber('abc')).toBe('0');
    expect(F.formatAmountRaw(1234.5678)).toBe(H.formatNumber(1234.5678));
  });
  it('beautySum truncates fraction, formatNumber keeps it', () => {
    expect(F.beautySum('1234.9')).toBe('1 234');
    expect(H.formatNumber('1234.9')).toBe('1 234.9');
  });
  it('relative time functions disagree', () => {
    const d = new Date(Date.now() - 2 * 86400000);
    expect(F.relativeTimeLabel(d)).toBe('2 kun oldin');
    expect(H.getRelativeTime(d)).toBe('2 kun oldin');
    const now = new Date();
    expect(F.relativeTimeLabel(now)).toBe('Bugun');
    expect(H.getRelativeTime(now)).toBe('Hozirgina');
  });
  it('+5 offset formatDateTime copies: seconds differ, bad input -> formatDate fallback', () => {
    const fd = (v) => H.fmtDMY(v, '-');
    expect(L.legacyKeyFormatDateTime('2026-09-24T20:00:30Z', fd)).toBe('25.09.2026 01:00');
    expect(L.legacyIdFormatDateTime('2026-09-24T20:00:30Z', fd)).toBe('25.09.2026 01:00:30');
    expect(L.legacyKeyFormatDateTime('', fd)).toBe('-');
    expect(L.legacyIdFormatDateTime('zzz', fd)).toBe('zzz');
  });
  it('toLocaleString based copies (ICU-dependent, only fallbacks pinned)', () => {
    expect(L.legacyUserFmt(null)).toBe('0');
    expect(L.legacyAnalyticsFormatMoney(0, true, '')).toBe('0 UZS');
    expect(L.legacyGoalsFormatMoney(0)).toBe('0 UZS');
    expect(L.legacyAnalyticsFormatMoney(1500000, true)).toBe('1.5M UZS');
    expect(L.legacyAnalyticsFormatMoney(2500, true, 'USD')).toBe('3K USD');
    expect(L.legacyGoalsFormatMoney(2500, true, 'USD')).not.toBe('3K USD');
    expect(L.legacyGoalsFormatMoney(1500000, true)).toBe('1.5M UZS');
  });
});

describe('wave B: groupThousands', () => {
  it('groups and is null-safe', () => {
    expect(F.groupThousands(1234567)).toBe('1 234 567');
    expect(F.groupThousands('79000')).toBe('79 000');
    expect(F.groupThousands(null)).toBe('0');
    expect(F.groupThousands(undefined)).toBe('0');
  });
});
