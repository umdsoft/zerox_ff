import { describe, it, expect } from 'vitest';
import { renderToHtml } from './helpers/renderSsr';
import HistoryModal from '@/components/price/PriceSmsHistoryModal.vue';
import CategoryModal from '@/components/price/PriceSmsCategoryModal.vue';
import { getPriceTexts } from '@/utils/priceTexts';

// Egasi talabi: SMS tarixi modali va kategoriya oynasida "Tarif N" (poolLine) qatori ko'rsatilmaydi.
const texts = getPriceTexts('uz');
const cat = { type: 1, label: 'Muddati kelgan qarzdorlik', count: 11, poolLine: 'Tarif 11', borderClass: '', bgClass: '', iconBg: '', iconColor: '', iconPath: 'M0 0', numColor: '' };

describe('SMS modals: no "Tarif" pool line', () => {
  it('history modal shows label and count but not poolLine', async () => {
    const html = await renderToHtml(HistoryModal, { propsData: { texts, smsCats: [cat], smsTotalSent: 11 } });
    expect(html).toContain('Muddati kelgan qarzdorlik');
    expect(html).not.toContain('Tarif 11');
  });
  it('category modal shows title only, no count/poolLine subtitle', async () => {
    const html = await renderToHtml({ ...CategoryModal, components: { SmsMessageList: { render: (h) => h('div') } } }, { propsData: { smsCatOpen: cat } });
    expect(html).toContain('Muddati kelgan qarzdorlik');
    expect(html).not.toContain('Tarif 11');
    expect(html).not.toContain('11 ·');
  });
});
