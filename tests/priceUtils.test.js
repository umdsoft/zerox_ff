import { describe, it, expect } from 'vitest';
import {
  planPurchaseTarget, addonPurchaseTarget, topupAmountForShortfall, isValidTopup,
  topupReturnUrl, buildClickTopupUrl, buildPaymeTopupUrl, isSafePaymentUrl, toDate, fmtTariffDate, addOneMonth,
} from '@/utils/priceCheckout';
import { PRICE_TEXTS, getPriceTexts } from '@/utils/priceTexts';

describe('priceCheckout utils', () => {
  it('plan targets', () => {
    expect(planPurchaseTarget('start')).toEqual({ plan: 'start', price: 99000, smsCount: 500, label: 'Start' });
    expect(planPurchaseTarget('premium')).toEqual({ plan: 'premium', price: 199000, smsCount: 1100, label: 'Premium' });
    // noma'lum reja avvalgidek Start narxi, plan qiymati o'zgarishsiz
    expect(planPurchaseTarget('x')).toEqual({ plan: 'x', price: 99000, smsCount: 500, label: 'Start' });
  });
  it('addon target', () => {
    const t = addonPurchaseTarget({ name: 'medium', sms: 200, price: 40000 });
    expect(t).toEqual({ kind: 'addon', packageName: 'medium', price: 40000, smsCount: 200, label: '200 SMS' });
  });
  it('top-up urls', () => {
    const returnUrl = topupReturnUrl('');
    expect(returnUrl).toBe('https://zerox.uz/price');
    expect(buildClickTopupUrl({ uid: 9, amount: 5000, returnUrl })).toBe(
      'https://my.click.uz/services/pay?service_id=24899&merchant_id=17375&amount=5000&transaction_param=9&return_url=https://zerox.uz/price',
    );
    const url = buildPaymeTopupUrl({ uid: 9, amount: 5000, returnUrl });
    expect(url.startsWith('https://checkout.paycom.uz/')).toBe(true);
    expect(Buffer.from(url.split('/').pop(), 'base64').toString()).toBe('m=62fa657ea12ad7a48f4b2dd9;ac.user_id=9;a=500000;c=https://zerox.uz/price');
  });
  it('validation helpers', () => {
    expect(isValidTopup(1, 1000)).toBe(true);
    expect(isValidTopup(1, 999)).toBe(false);
    expect(isValidTopup(0, 5000)).toBe(false);
    expect(topupAmountForShortfall(0)).toBe(1000);
    expect(topupAmountForShortfall(54321)).toBe(54321);
    expect(isSafePaymentUrl('https://x')).toBe(true);
    expect(isSafePaymentUrl('HTTPS://x')).toBe(true);
    expect(isSafePaymentUrl('http://x')).toBe(false);
    expect(isSafePaymentUrl(undefined)).toBe(false);
  });
  it('dates', () => {
    expect(toDate('')).toBeNull();
    expect(toDate('garbage')).toBeNull();
    expect(fmtTariffDate(null)).toBe('—');
    expect(fmtTariffDate(new Date(2026, 8, 29))).toBe('29.09.2026');
    expect(addOneMonth(new Date(2026, 0, 31)).getDate()).toBe(28); // oy oxiri qisqartiriladi
    expect(addOneMonth(new Date(2026, 0, 15)).getMonth()).toBe(1);
  });
});

describe('priceTexts', () => {
  it('all 5 locales share the same keys; unknown locale -> uz', () => {
    const keys = Object.keys(PRICE_TEXTS.uz).sort();
    for (const l of ['ru', 'kr', 'en', 'kaa']) expect(Object.keys(PRICE_TEXTS[l]).sort()).toEqual(keys);
    expect(getPriceTexts('xx')).toBe(PRICE_TEXTS.uz);
    expect(getPriceTexts('ru')).toBe(PRICE_TEXTS.ru);
  });
});
