/**
 * SS-DEV (2026-09-24): PDF xizmati (pdf.zerox.uz) havolalari MUHITGA qarab.
 *
 * pdf.zerox.uz ham prod, ham test uchun xizmat qiladi, lekin har biri O'Z
 * bazasidan o'qiydi: `index.php` -> admin_zerox (prod), `index_test.php` ->
 * admin_zerox_test. Ilgari sayt har doim `index.php` ni chaqirar edi — test
 * saytida (backend tb.zerox.uz) test shartnomasi prod bazasida topilmas,
 * "Hujjat topilmadi" chiqardi. Mobil ilova bilan bir xil mantiq (constants.ts).
 *
 * Ishlatish: shablonlarda `${$pdfIndexUrl}?id=...` (template literal ichida).
 *
 * SS-AUDIT (2026-09-25): muhit aniqlash va URL qurish utils/helpers.js
 * (`pdfScriptUrl`) bilan BITTA joyda — ilgari bu yerda takrorlangan edi.
 */
import { pdfScriptUrl } from '@/utils/helpers';

export default function ({ $config }, inject) {
  inject('pdfIndexUrl', pdfScriptUrl('index', $config));
  inject('pdfActUrl', pdfScriptUrl('act', $config));
}
