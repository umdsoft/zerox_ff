import { describe, it, expect } from 'vitest';
import {
  fmtDMY, fmtDMYHM, fmtHM, fmtBirthDate, formatMoneyCur, formatMoney, formatNumber, formatNumberGrouped,
  formatDate, parseDateSafe, formatDateLocale,
} from '@/utils/helpers';

describe('TZ pin', () => {
  it('runs in Asia/Tashkent (+5)', () => {
    expect(new Date(2026, 0, 1).getTimezoneOffset()).toBe(-300);
  });
});

describe('fmtDMY', () => {
  it('formats date-only ISO', () => expect(fmtDMY('2026-09-24')).toBe('24.09.2026'));
  it('formats SQL datetime in local time', () => expect(fmtDMY('2026-09-24 10:00:00')).toBe('24.09.2026'));
  it('UTC instant near midnight shifts to local (+5) day', () => expect(fmtDMY('2026-09-24T20:00:00Z')).toBe('25.09.2026'));
  it('formats Date objects', () => expect(fmtDMY(new Date(2026, 8, 4))).toBe('04.09.2026'));
  it('empty fallback defaults to em dash', () => {
    expect(fmtDMY('')).toBe('—');
    expect(fmtDMY(null)).toBe('—');
    expect(fmtDMY(undefined)).toBe('—');
    expect(fmtDMY(0)).toBe('—');
  });
  it('empty fallback is configurable', () => {
    expect(fmtDMY('', '')).toBe('');
    expect(fmtDMY(null, '-')).toBe('-');
  });
  it('unparseable returns raw value as string', () => {
    expect(fmtDMY('garbage')).toBe('garbage');
    expect(fmtDMY('garbage', '')).toBe('garbage');
  });
});

describe('fmtDMYHM / fmtHM', () => {
  it('formats date and time', () => expect(fmtDMYHM('2026-09-24 10:05:30')).toBe('24.09.2026 10:05'));
  it('UTC instant -> local', () => expect(fmtDMYHM('2026-09-24T20:00:00Z')).toBe('25.09.2026 01:00'));
  it('empty / garbage', () => {
    expect(fmtDMYHM('')).toBe('—');
    expect(fmtDMYHM('', '')).toBe('');
    expect(fmtDMYHM('zzz')).toBe('zzz');
  });
  it('fmtHM parse failure -> empty string', () => {
    expect(fmtHM('zzz')).toBe('');
    expect(fmtHM('2026-09-24 07:08:00')).toBe('07:08');
  });
});

describe('fmtBirthDate', () => {
  it('ISO', () => expect(fmtBirthDate('1995-11-25')).toBe('25.11.1995'));
  it('dotted/slashed, padded', () => {
    expect(fmtBirthDate('5/3/1995')).toBe('05.03.1995');
    expect(fmtBirthDate('25.11.1995')).toBe('25.11.1995');
  });
  it('empty default is hyphen; unknown format returned trimmed', () => {
    expect(fmtBirthDate('')).toBe('-');
    expect(fmtBirthDate(' xyz ')).toBe('xyz');
  });
});

describe('formatMoneyCur', () => {
  it('groups with spaces and appends currency', () => expect(formatMoneyCur(1500000, 'USD')).toBe('1 500 000 USD'));
  it('default currency UZS', () => expect(formatMoneyCur(79000)).toBe('79 000 UZS'));
  it('falsy value -> "0 CUR"', () => {
    expect(formatMoneyCur(0)).toBe('0 UZS');
    expect(formatMoneyCur(null, 'USD')).toBe('0 USD');
    expect(formatMoneyCur('', 'USD')).toBe('0 USD');
  });
  it('falsy currency falls back to UZS', () => {
    expect(formatMoneyCur(10, '')).toBe('10 UZS');
    expect(formatMoneyCur(10, null)).toBe('10 UZS');
  });
  it('keeps up to two decimals, rounds beyond', () => {
    expect(formatMoneyCur(1234.5)).toBe('1 234.5 UZS');
    expect(formatMoneyCur('79000.00')).toBe('79 000 UZS');
    expect(formatMoneyCur(1.239)).toBe('1.24 UZS');
  });
  it('negative', () => expect(formatMoneyCur(-1500)).toBe('-1 500 UZS'));
  it('NaN-like string -> "0"', () => expect(formatMoneyCur('abc')).toBe('0 UZS'));
});

describe('formatMoney / formatNumber / formatNumberGrouped', () => {
  it('formatMoney rounds, falsy -> 0', () => {
    expect(formatMoney('1234567.89')).toBe('1 234 568');
    expect(formatMoney('79000.00')).toBe('79 000');
    expect(formatMoney(null)).toBe('0');
    expect(formatMoney('x')).toBe('0');
  });
  it('formatNumber', () => {
    expect(formatNumber(1000000)).toBe('1 000 000');
    expect(formatNumber('1234.5')).toBe('1 234.5');
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber('abc')).toBe('0');
    expect(formatNumber(1234567, ',')).toBe('1,234,567');
  });
  it('formatNumberGrouped', () => {
    expect(formatNumberGrouped(1234.567)).toBe('1 234.57');
    expect(formatNumberGrouped(NaN)).toBe('0');
  });
});

describe('formatDate (helpers, UTC getters)', () => {
  it('ISO prefix string', () => expect(formatDate('2026-09-24T20:00:00Z')).toBe('24.09.2026'));
  it('empty -> ""', () => expect(formatDate('')).toBe(''));
  it('Date uses UTC getters', () => expect(formatDate(new Date(Date.UTC(2026, 8, 24, 20, 0, 0)))).toBe('24.09.2026'));
  it('invalid -> ""', () => expect(formatDate('garbage')).toBe(''));
  it('custom format with time', () => expect(formatDate(new Date(Date.UTC(2026, 8, 24, 20, 5)), 'dd.mm.yyyy HH:MM')).toBe('24.09.2026 20:05'));
});

describe('parseDateSafe / formatDateLocale', () => {
  it('parses date-only as local midnight', () => {
    const d = parseDateSafe('2026-09-24');
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 8, 24, 0]);
  });
  it('null for empty / invalid', () => {
    expect(parseDateSafe('')).toBeNull();
    expect(parseDateSafe('nope')).toBeNull();
    expect(parseDateSafe(new Date('x'))).toBeNull();
  });
  it('formatDateLocale fallbacks (locale text itself is ICU-dependent, not pinned)', () => {
    expect(formatDateLocale('')).toBe('-');
    expect(formatDateLocale('', '')).toBe('');
    expect(formatDateLocale('zzz')).toBe('zzz');
  });
});
