import { describe, it, expect, afterEach } from 'vitest';
import { formatTashkentDateTime } from '@/utils/format';

// Eski (wave B) `formatDateTime` — characterization uchun AYNAN nusxa (soniyasiz va soniyali variant).
function legacy(dt, withSeconds) {
  if (!dt) return '-';
  const d = new Date(dt);
  if (isNaN(d)) return null;
  const x = new Date(d.getTime() + 5 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  const base = `${p(x.getUTCDate())}.${p(x.getUTCMonth() + 1)}.${x.getUTCFullYear()} ${p(x.getUTCHours())}:${p(x.getUTCMinutes())}`;
  return withSeconds ? `${base}:${p(x.getUTCSeconds())}` : base;
}

const ORIGINAL_TZ = process.env.TZ;
afterEach(() => { process.env.TZ = ORIGINAL_TZ; });
const inTz = (tz, fn) => { process.env.TZ = tz; return fn(); };

describe('characterization: eski formatDateTime (+5h)', () => {
  it("'Z' lahza: ikkala TZ da bir xil, IKKI MARTA siljish YO'Q", () => {
    for (const tz of ['Asia/Tashkent', 'UTC']) {
      expect(inTz(tz, () => legacy('2026-10-30T14:00:00.000Z'))).toBe('30.10.2026 19:00');
      expect(inTz(tz, () => legacy('2026-10-29T19:00:00.000Z'))).toBe('30.10.2026 00:00'); // DATE ustun (Toshkent yarim tun)
    }
  });
  it("zona'siz datetime: brauzer TZ ga bog'liq (UTC da +5 xato)", () => {
    expect(inTz('Asia/Tashkent', () => legacy('2026-10-30 14:00:00'))).toBe('30.10.2026 14:00');
    expect(inTz('UTC', () => legacy('2026-10-30 14:00:00'))).toBe('30.10.2026 19:00');
  });
  it("zona'siz sana-faqat: har ikki TZ da 05:00 (xato)", () => {
    for (const tz of ['Asia/Tashkent', 'UTC']) expect(inTz(tz, () => legacy('2026-10-30'))).toBe('30.10.2026 05:00');
  });
});

describe('formatTashkentDateTime: har doim Toshkent devor vaqti', () => {
  const cases = [
    ['2026-10-30T14:00:00.000Z', '30.10.2026 19:00', '30.10.2026 19:00:00'],
    ['2026-10-29T19:00:00.000Z', '30.10.2026 00:00', '30.10.2026 00:00:00'],
    ['2026-10-30 14:00:00', '30.10.2026 14:00', '30.10.2026 14:00:00'],
    ['2026-10-30T14:00:00', '30.10.2026 14:00', '30.10.2026 14:00:00'],
    ['2026-10-30', '30.10.2026 00:00', '30.10.2026 00:00:00'],
    ['2026-10-30T14:00:00+05:00', '30.10.2026 14:00', '30.10.2026 14:00:00'],
  ];
  for (const tz of ['Asia/Tashkent', 'UTC', 'America/New_York']) {
    it(`TZ=${tz}`, () => {
      for (const [src, a, b] of cases) {
        expect(inTz(tz, () => formatTashkentDateTime(src))).toBe(a);
        expect(inTz(tz, () => formatTashkentDateTime(src, { seconds: true }))).toBe(b);
      }
    });
  }
  it("'Z' lahza uchun eski natija bilan bir xil (regressiya yo'q)", () => {
    for (const tz of ['Asia/Tashkent', 'UTC']) {
      const s = '2026-10-30T14:05:09.000Z';
      expect(inTz(tz, () => formatTashkentDateTime(s))).toBe(inTz(tz, () => legacy(s)));
      expect(inTz(tz, () => formatTashkentDateTime(s, { seconds: true }))).toBe(inTz(tz, () => legacy(s, true)));
    }
  });
  it("bo'sh -> '-', yaroqsiz -> null", () => {
    expect(formatTashkentDateTime('')).toBe('-');
    expect(formatTashkentDateTime(null)).toBe('-');
    expect(formatTashkentDateTime('garbage')).toBeNull();
  });
});
