import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { renderToHtml, RENDER_ENABLED } from './helpers/renderSsr';
import Result from '@/components/notification_types/debt-refund/debt-partialRefund/debt-partialRefund-result.vue';

// wave D: ikki "ro'yxatdan o'tmagan komponent" haqiqiy xato EMAS edi — o'lik markup:
//  - debt-partialRefund-result.vue `item.type == 15` tarmog'i: Notification.vue type 15 ni o'zi (`debt-partial-refund-reject`) ko'rsatadi,
//    result faqat type 11 uchun chaqiriladi -> tarmoq hech qachon bajarilmasdi.
//  - money/_type `<contract-give>` (`step == 1`): `step` hech qachon 1 bo'lmaydi, komponent repoda yo'q (5d731a2 da o'lik komponentlar tozalangan).
const read = (p) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');

describe('dead markup removed (no user-visible change)', () => {
  it('Notification.vue renders type 15 itself; result component only handles type 11', () => {
    const n = read('components/Notification.vue');
    expect(n).toMatch(/item\.type == 15 && \$auth\.user\.id === item\.reciver[\s\S]{0,200}<debt-partial-refund-reject/);
    expect(n).toMatch(/item\.type == 11 && \$auth\.user\.id === item\.reciver[\s\S]{0,200}<debt-partial-refund-result/);
    expect(read('components/notification_types/debt-refund/debt-partialRefund/debt-partialRefund-result.vue')).not.toContain('debt-partial-refund-reject');
  });
  it('money page has no <contract-give> and never sets step to 1', () => {
    const page = read('pages/money/_type/index.vue');
    expect(page).not.toContain('contract-give');
    expect(page).not.toMatch(/step\s*=\s*1\b/);
  });
  it.skipIf(!RENDER_ENABLED)('result component renders only the accept card for type 11 and nothing for 15', async () => {
    const mocks = { $t: (k) => k };
    const stubs = ['debt-partial-refund-accept', 'DebtPartialRefundAccept'];
    const h15 = await renderToHtml(Result, { mocks, stubs, propsData: { item: { type: 15 }, getNotifications: () => {} } });
    expect(h15).not.toContain('data-stub');
    const h11 = await renderToHtml(Result, { mocks, stubs, propsData: { item: { type: 11 }, getNotifications: () => {} } });
    expect(h11).toContain('data-stub');
  });
});
