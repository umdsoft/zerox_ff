<template>
  <!-- SS2-1 (2026-09-20): footer QORA emas — shaxsiy kabinet foni (#EDF2F7) bilan
       bir xil. Ilgari bosh sahifa oxirida keskin qora blok paydo bo'lardi. -->
  <footer class="zx-footer text-gray-600 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-4 gap-8">
        <div class="md:col-span-2">
          <!-- Fon endi och rangli — logoni oqartirish (invert) SHART EMAS. -->
          <img src="@/assets/img/logo.svg" alt="ZeroX" class="h-10 mb-4" />
          <p class="text-sm mb-4 max-w-md">
            {{ texts.description }}
          </p>
          <div class="flex gap-4">
            <a href="https://t.me/ZeroxUZ" target="_blank" rel="noopener noreferrer" class="w-10 h-10 zx-footer-social zx-soc-tg rounded-lg flex items-center justify-center transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.154.234.17.33.015.097.034.318.019.49z"/>
              </svg>
            </a>
            <a href="https://instagram.com/zeroxuz" target="_blank" rel="noopener noreferrer" class="w-10 h-10 zx-footer-social zx-soc-ig rounded-lg flex items-center justify-center transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://twitter.com/zeroxuz" target="_blank" rel="noopener noreferrer" class="w-10 h-10 zx-footer-social zx-soc-x rounded-lg flex items-center justify-center transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://facebook.com/zeroxuz" target="_blank" rel="noopener noreferrer" class="w-10 h-10 zx-footer-social zx-soc-fb rounded-lg flex items-center justify-center transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="https://youtube.com/@zeroxuz" target="_blank" rel="noopener noreferrer" class="w-10 h-10 zx-footer-social zx-soc-yt rounded-lg flex items-center justify-center transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 class="text-gray-900 font-semibold mb-4">{{ texts.linksTitle }}</h4>
          <ul class="space-y-2 text-sm">
            <!-- SS2-2 (2026-09-20): ilgari `/#features` — bu PUBLIC landing sahifasiga
                 to'liq qayta yuklanish edi va foydalanuvchi shaxsiy kabinetdan CHIQIB ketardi.
                 Endi kabinet ichidagi alohida sahifalar (nuxt-link — SPA navigatsiyasi). -->
            <!-- SS-DEV (2026-09-24): "Modullar" — public landing footeri bilan bir xil ro'yxat.
                 Kabinet ichidagi /modullar sahifasi landing "Modullar" bo'limi bilan bir xil mazmunda. -->
            <li><nuxt-link :to="localePath({ name: 'modullar' })" class="hover:text-gray-900 transition-colors">{{ texts.modules }}</nuxt-link></li>
            <li><nuxt-link :to="localePath({ name: 'imkoniyatlar' })" class="hover:text-gray-900 transition-colors">{{ texts.features }}</nuxt-link></li>
            <li><nuxt-link :to="localePath({ name: 'qanday-ishlaydi' })" class="hover:text-gray-900 transition-colors">{{ texts.howItWorks }}</nuxt-link></li>
            <li><nuxt-link :to="localePath({ name: 'price' })" class="hover:text-gray-900 transition-colors">{{ texts.pricing }}</nuxt-link></li>
            <li><nuxt-link :to="localePath({ name: 'instruction' })" class="hover:text-gray-900 transition-colors">{{ texts.instruction }}</nuxt-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-gray-900 font-semibold mb-4">{{ texts.contactTitle }}</h4>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@zerox.uz
            </li>
            <li>
              <a href="https://t.me/zeroxuz_bot" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-gray-900 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.154.234.17.33.015.097.034.318.019.49z"/>
                </svg>
                @zeroxuz_bot
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-300 mt-8 pt-8 text-center text-sm">
        <p>&copy; 2022-{{ currentYear }}. "ZEROX" MChJ. {{ texts.rights }}</p>
      </div>
    </div>
  </footer>
</template>

<script>
/**
 * AppFooter — ZeroX sayt footeri.
 * Mazmuni public (login'dan oldingi) LandingPage footeri bilan bir xil,
 * shaxsiy kabinet bosh sahifasida ham ishlatish uchun alohida komponentga olingan.
 */
export default {
  name: 'AppFooter',

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },

    texts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz';
      const t = {
        uz: {
          description: "ZeroX - qarz munosabatlarini elektron ro'yxatga olish va tartibga solish tizimi.",
          linksTitle: 'Havolalar',
          contactTitle: 'Aloqa',
          modules: 'Modullar',
          features: 'Imkoniyatlar',
          howItWorks: 'Qanday ishlaydi',
          pricing: 'Tariflar',
          instruction: "Yo'riqnoma",
          rights: 'Barcha huquqlar himoyalangan.',
        },
        ru: {
          description: 'ZeroX — система электронного учета и регулирования долговых отношений.',
          linksTitle: 'Ссылки',
          contactTitle: 'Контакты',
          modules: 'Модули',
          features: 'Возможности',
          howItWorks: 'Как это работает',
          pricing: 'Тарифы',
          instruction: 'Инструкция',
          rights: 'Все права защищены.',
        },
        kr: {
          description: 'ZeroX - қарз муносабатларини электрон рўйхатга олиш ва тартибга солиш тизими.',
          linksTitle: 'Ҳаволалар',
          contactTitle: 'Алоқа',
          modules: 'Модуллар',
          features: 'Имкониятлар',
          howItWorks: 'Қандай ишлайди',
          pricing: 'Тарифлар',
          instruction: 'Йўриқнома',
          rights: 'Барча ҳуқуқлар ҳимояланган.',
        },
      };
      return t[l] || t.uz;
    },
  },
};
</script>

<style scoped>
/**
 * SS2-1 (2026-09-20): footer foni shaxsiy kabinet foni bilan AYNI (#EDF2F7 —
 * layouts/default.vue). Tailwind v2 (JIT o'chiq) da bunday o'zboshimcha rang
 * klassi generatsiya qilinmaydi, shuning uchun CSS orqali.
 */
.zx-footer {
  background-color: #EDF2F7;
  border-top: 1px solid #DDE3EA;
}
/**
 * SS15 (2026-09-21): ijtimoiy tarmoq tugmalari — kursor ustiga kelganda HAR BIRI
 * O'Z BREND RANGIGA kiradi, kursor ketgach neytral holatga qaytadi.
 *
 * 🔴 NEGA CSS bilan, Tailwind `hover:bg-*` bilan emas:
 * scoped uslub `.zx-footer-social[data-v-x]` (aniqlik 0,2,0) Tailwind'ning
 * `.hover:bg-blue-500:hover` (ham 0,2,0) bilan TENG, lekin komponent CSS'i
 * Tailwind'dan KEYIN ulanadi — shuning uchun kulrang fon hover'da ham g'olib
 * chiqardi. Ustiga `:hover{color:#fff}` bo'lgani uchun ikonka och fonda
 * butunlay KO'RINMAY qolardi.
 */
.zx-footer-social {
  background-color: #E2E8F0;
  color: #4A5568;
  transition: background-color .2s ease, color .2s ease;
}
.zx-footer-social:hover { color: #ffffff; }

.zx-soc-tg:hover { background-color: #229ED9; }   /* Telegram — havorang */
.zx-soc-ig:hover {                                 /* Instagram — brend gradienti */
  background-image: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4);
}
.zx-soc-x:hover  { background-color: #000000; }    /* X — qora */
.zx-soc-fb:hover { background-color: #1877F2; }    /* Facebook — ko'k */
.zx-soc-yt:hover { background-color: #FF0000; }    /* YouTube — qizil */
</style>
