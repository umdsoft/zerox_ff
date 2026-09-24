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
 */
export default function ({ $config }, inject) {
  const backend = String(($config && $config.backendURL) || '');
  const isTest = backend.includes('tb.zerox.uz');
  inject('pdfIndexUrl', isTest ? 'https://pdf.zerox.uz/index_test.php' : 'https://pdf.zerox.uz/index.php');
  inject('pdfActUrl', isTest ? 'https://pdf.zerox.uz/act_test.php' : 'https://pdf.zerox.uz/act.php');
}
