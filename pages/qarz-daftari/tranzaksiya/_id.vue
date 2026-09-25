<template>
  <!-- Amaliyot tafsiloti — ALOHIDA SAHIFA.
       SS11: ilgari bu blur'li modal edi. Endi oddiy sahifa: overlay ham,
       backdrop-filter ham YO'Q. Ko'rinish "Amaliyotlar tarixi" sahifasi
       uslubida — ixcham oq kartalar. -->
  <div class="pb-8">
    <!-- SS19 (2026-09-21): sun'iy `max-w-2xl mx-auto` cheklovi OLIB TASHLANDI —
         sahifa endi sayt (desktop) layoutining to'liq kengligidan foydalanadi. -->
    <div>
      <!-- Sarlavha: ← Orqaga + nom -->
      <div class="flex items-center gap-3 mb-4">
        <button
          type="button"
          @click="goBack"
          :title="texts.back"
          class="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-300 shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <!-- SS19: desktopda sarlavha sayt uslubida kattaroq -->
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
      </div>

      <!-- Xatolik (faqat to'g'ridan-to'g'ri URL ochilib, ma'lumot topilmaganda).
           SS19: xato/yuklanish bloklari markazda va tor qoladi (keng ekranda
           cho'zilib ketmasligi uchun) — faqat KONTENT keng bo'ladi. -->
      <div v-if="loadError" class="bg-white rounded-2xl shadow-sm px-5 py-12 text-center max-w-2xl mx-auto">
        <div class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <h2 class="text-base font-bold text-gray-900 mb-3">{{ texts.notFound }}</h2>
        <button type="button" @click="goBack" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm">{{ texts.back }}</button>
      </div>

      <!-- Yuklanmoqda — FAQAT sahifa to'g'ridan-to'g'ri URL bilan ochilganda
           (ro'yxatdan kelinganda ma'lumot store'da tayyor, bu blok ko'rinmaydi). -->
      <div v-else-if="!tranzaksiya" class="bg-white rounded-2xl shadow-sm px-5 py-16 text-center max-w-2xl mx-auto">
        <svg class="w-8 h-8 text-blue-500 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>

      <template v-else>
        <!-- SS19 (2026-09-21): desktopda 2 USTUN —
             CHAPDA rangli summa bloki + "Amaliyot ma'lumotlari",
             O'NGDA "Qarz ma'lumotlari" + bo'lib to'lash jadvali.
             Grid FAQAT o'ng ustunda kontent bo'lganda yoqiladi (qarz ma'lumotlari
             yoki bo'lib to'lash jadvali) — aks holda o'ng yarim bo'sh qolardi.
             `lg:` dan past ekranda grid yo'q → mobil ko'rinish avvalgidek. -->
        <!-- SS-DEV (2026-09-24), hujjat 2-rasm: chap ustun 2/5, o'ng ustun 3/5 —
             bo'lib to'lash jadvali ("To'lovni kiritish" tugmasi bilan) to'liq sig'sin. -->
        <div :class="['lg:gap-5 lg:items-start', hasRightColumn ? 'lg:grid lg:grid-cols-5' : '']">
          <!-- ===== CHAP USTUN ===== -->
          <div :class="hasRightColumn ? 'lg:col-span-2' : ''">
            <!-- SS-DEV (2026-09-24), hujjat 2-rasm: rangli blok ilgari och fon (bg-blue-50) bo'lib,
                 sahifa foniga qo'shilib ketardi. Endi to'q GRADIENT karta (turi bo'yicha ko'k /
                 yashil / qizil), ikonka yarim shaffof oq doirada, summa oq shriftda; izoh va
                 "Bo'lib to'lash" belgisi pastdagi OQ ichki blokda. Gradient inline style'da —
                 Tailwind 2.2 (JIT o'chiq). -->
            <div class="rounded-2xl p-5 mb-3 text-white shadow-lg overflow-hidden relative" :style="{ background: accent.grad }">
              <div class="absolute rounded-full" style="width: 160px; height: 160px; right: -50px; top: -60px; background: rgba(255,255,255,0.10);"></div>
              <div class="absolute rounded-full" style="width: 110px; height: 110px; left: -40px; bottom: -50px; background: rgba(255,255,255,0.08);"></div>
              <div class="relative">
                <div class="flex items-center gap-3">
                  <span class="w-12 h-12 rounded-full inline-flex items-center justify-center flex-shrink-0" style="background: rgba(255,255,255,0.22);">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" :d="accent.path"/>
                    </svg>
                  </span>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold uppercase tracking-wide" style="color: rgba(255,255,255,0.85);">{{ label }}</p>
                    <p class="text-2xl lg:text-3xl font-extrabold leading-tight break-words">
                      {{ sign }}{{ formatMoney(tranzaksiya.summa) }}
                      <span class="text-sm font-semibold" style="color: rgba(255,255,255,0.85);">{{ tranzaksiya.valyuta }}</span>
                    </p>
                  </div>
                </div>
                <div v-if="desc || bolibTolash" class="mt-4 bg-white rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <p v-if="desc" class="text-xs text-gray-600 leading-snug">{{ desc }}</p>
                  <span v-if="bolibTolash" class="inline-flex items-center flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-700 whitespace-nowrap">
                    {{ texts.bolibTolash }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Amaliyot ma'lumotlari -->
            <h3 class="text-sm lg:text-base font-bold text-gray-900 mb-2 px-1">{{ texts.amaliyotInfo }}</h3>
            <div class="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mb-3">
              <div class="flex items-start justify-between gap-3 px-4 py-3">
                <span class="text-sm text-gray-500 flex-shrink-0">{{ texts.sanaVaqt }}</span>
                <span class="text-sm font-semibold text-gray-900 text-right">{{ formatDateTime(tranzaksiya.created_at) }}</span>
              </div>
              <div class="flex items-start justify-between gap-3 px-4 py-3">
                <span class="text-sm text-gray-500 flex-shrink-0">{{ texts.kimBajargan }}</span>
                <span class="text-sm font-semibold text-gray-900 text-right break-all">{{ bajaruvchi || '—' }}</span>
              </div>
            </div>
            <!-- Kvitansiya + Ulashish (SS11-3).
                 SS-DEV (2026-09-23): tugmalar CHAP USTUNGA, "Kim bajargan" kartasi
                 OSTIGA ko'chirildi. Ilgari ular ikki ustunli griddan TASHQARIDA edi —
                 bo'lib to'lash jadvali uzun bo'lsa sahifaning eng pastiga tushib ketardi. -->
            <div class="grid grid-cols-2 gap-3 mt-3">
              <nuxt-link
                v-if="qarzId"
                :to="kvitansiyaPath"
                class="flex items-center justify-center gap-2 px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/></svg>
                {{ texts.kvitansiya }}
              </nuxt-link>
              <!-- ⚠️ Tailwind 2.2 (JIT o'chiq) `disabled:` variantini generatsiya QILMAYDI —
                   qarz aniqlanmagan holat oddiy klass bilan beriladi. -->
              <button
                v-else
                type="button"
                disabled
                class="flex items-center justify-center gap-2 px-3 py-3 bg-gray-100 text-gray-400 rounded-xl font-semibold text-sm cursor-not-allowed"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"/></svg>
                {{ texts.kvitansiya }}
              </button>
              <button
                type="button"
                @click="share"
                class="flex items-center justify-center gap-2 px-3 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl font-semibold text-sm transition-colors"
              >
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/></svg>
                {{ texts.ulashish }}
              </button>
            </div>
          </div>

          <!-- ===== O'NG USTUN ===== -->
          <div :class="hasRightColumn ? 'lg:col-span-3' : ''">
            <!-- Qarz ma'lumotlari — faqat qarz berish/olish amaliyoti uchun -->
            <template v-if="isBerish && qarz">
              <h3 class="text-sm lg:text-base font-bold text-gray-900 mb-2 px-1">{{ texts.qarzInfo }}</h3>
              <div class="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 mb-3">
                <div class="flex items-start justify-between gap-3 px-4 py-3">
                  <span class="text-sm text-gray-500 flex-shrink-0">{{ texts.qarzSummasi }}</span>
                  <span class="text-sm font-semibold text-gray-900 text-right">{{ formatMoney(qarz.miqdor) }} {{ qarz.valyuta }}</span>
                </div>
                <div class="flex items-start justify-between gap-3 px-4 py-3">
                  <span class="text-sm text-gray-500 flex-shrink-0">{{ texts.berilganSana }}</span>
                  <span class="text-sm font-semibold text-gray-900 text-right">{{ formatDate(qarz.berilgan_sana) }}</span>
                </div>
                <div class="flex items-start justify-between gap-3 px-4 py-3">
                  <span class="text-sm text-gray-500 flex-shrink-0">{{ texts.qaytarishSana }}</span>
                  <span v-if="qarz.qaytarish_sanasi" class="text-sm font-semibold text-gray-900 text-right">{{ formatDate(qarz.qaytarish_sanasi) }}</span>
                  <span v-else-if="bolibTolash" class="text-sm font-semibold text-purple-600 text-right">{{ texts.bolibTolash }}<span v-if="qarz.oylar_soni">: {{ qarz.oylar_soni }} {{ texts.oy }}</span></span>
                  <span v-else class="text-sm font-semibold text-gray-400 text-right">—</span>
                </div>
                <div class="flex items-start justify-between gap-3 px-4 py-3">
                  <span class="text-sm text-gray-500 flex-shrink-0">{{ texts.mahsulot }}</span>
                  <span class="text-sm font-semibold text-gray-900 text-right break-words">{{ mahsulot || '—' }}</span>
                </div>
                <div class="flex items-start justify-between gap-3 px-4 py-3">
                  <span class="text-sm text-gray-500 flex-shrink-0">{{ texts.holati }}</span>
                  <span class="text-right"><QarzDaftariStatusBadge :status="qarz.status" /></span>
                </div>
              </div>
            </template>

            <!-- Bo'lib to'lash jadvali (SS12).
                 Jadval FON rejimida yuklanadi — sahifa uni kutmaydi. -->
            <template v-if="bolibTolash">
              <h3 class="text-sm lg:text-base font-bold text-gray-900 mb-2 px-1">{{ texts.bolibTolashJadval }}</h3>
              <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-3">
                <!-- Yuklanayotganda bo'sh spinner emas, ixcham skeleton qatorlar -->
                <div v-if="tolovlarLoading" class="px-4 py-4">
                  <div v-for="n in 3" :key="n" class="h-4 bg-gray-100 rounded mb-3 animate-pulse"></div>
                  <p class="text-xs text-gray-400 text-center">{{ texts.jadvalYuklanmoqda }}</p>
                </div>
                <!-- SS-DEV (2026-09-24): `compact` — tor ustunda ustun paddinglari kichik,
                     "To'lovni kiritish" tugmasi asosiy o'lchamda ko'rinadi (2-rasm). -->
                <QarzDaftariBolibTolashJadval
                  v-else
                  compact
                  :tolovlar="tolovlar"
                  :valyuta="qarz ? qarz.valyuta : tranzaksiya.valyuta"
                  @tolandi="onTolandi"
                />
              </div>
            </template>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>

<script>
import { fmtDMY, fmtDMYHM, formatMoney } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
/**
 * Amaliyot tafsiloti sahifasi — /qarz-daftari/tranzaksiya/:id
 *
 * TEZLIK (SS11-1):
 * Ro'yxatdan kelinganda ma'lumot `qarzTranzaksiya` store'ida tayyor turadi,
 * shuning uchun sahifa DARHOL chiziladi — hech qanday so'rov kutilmaydi.
 * Faqat bo'lib to'lash jadvali fon rejimida (`background: true`) yuklanadi,
 * ya'ni global yuklash overlay'i (LoadingBar) CHIQMAYDI.
 *
 * FALLBACK (F5 / to'g'ridan-to'g'ri URL):
 * `?mijoz=<mijozId>` query'si orqali mijoz tarixini yuklab, kerakli
 * amaliyotni o'zi topadi.
 */
export default {
  middleware: 'auth',
  data() {
    return {
      tranzaksiya: null,
      qarz: null,
      mijozId: null,
      turi: '',
      bolibTolash: false,
      bajaruvchi: '',
      mahsulot: '',
      tolovlar: [],
      tolovlarLoading: false,
      loadError: false,
    };
  },
  computed: {
    qarzId() {
      return this.qarz?.id || this.tranzaksiya?.qarz_id || null;
    },
    kvitansiyaPath() {
      if (!this.qarzId) return '';
      return this.localePath({ name: 'qarz-daftari-qarz-id-kvitansiya', params: { id: this.qarzId } });
    },
    isBerish() { return this.tranzaksiya?.turi === 'berish'; },
    /**
     * SS19 (2026-09-21): desktopdagi 2 ustunli tartib FAQAT o'ng ustunda kontent
     * bo'lganda yoqiladi. "Qaytarish"/"voz kechish" amaliyotlarida na qarz
     * ma'lumotlari, na bo'lib to'lash jadvali bo'lmaydi — u holda grid yoqilsa
     * o'ng yarim bo'm-bo'sh qolardi, shuning uchun bitta ustun qoladi.
     */
    hasRightColumn() {
      return (this.isBerish && !!this.qarz) || !!this.bolibTolash;
    },
    sign() {
      const t = this.tranzaksiya?.turi;
      return (t === 'qaytarish' || t === 'voz_kechish') ? '−' : '+';
    },
    /** Amaliyot nomi — ota-qarz turini hisobga oladi ("Qarz olindi" vs "Qarz berildi") */
    label() {
      const t = this.tranzaksiya?.turi;
      if (t === 'berish') return this.qarz?.turi === 'olish' ? this.texts.amal_olish : this.texts.amal_berish;
      if (t === 'qaytarish') return this.texts.amal_qaytarish;
      if (t === 'voz_kechish') return this.texts.amal_voz_kechish;
      return t || '—';
    },
    desc() {
      const t = this.tranzaksiya?.turi;
      if (t === 'berish') return this.qarz?.turi === 'olish' ? this.texts.desc_olish : this.texts.desc_berish;
      if (t === 'qaytarish') return this.texts.desc_qaytarish;
      if (t === 'voz_kechish') return this.texts.desc_voz_kechish;
      return '';
    },
    /** Rang: qaytarildi=yashil, voz kechildi=qizil, berildi=ko'k.
     *  SS-DEV (2026-09-24): och `bg-*-50` klasslar o'rniga to'q GRADIENT (`grad`, inline). */
    accent() {
      const t = this.tranzaksiya?.turi;
      if (t === 'qaytarish') {
        return {
          grad: 'linear-gradient(135deg, #059669 0%, #0F766E 100%)',
          path: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
        };
      }
      if (t === 'voz_kechish') {
        return {
          grad: 'linear-gradient(135deg, #DC2626 0%, #9F1239 100%)',
          path: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636',
        };
      }
      return {
        grad: 'linear-gradient(135deg, #2563EB 0%, #4338CA 100%)',
        path: 'M12 6v12m6-6H6',
      };
    },
    /** Ulashish uchun matn */
    shareText() {
      const lines = [
        `${this.label}: ${this.sign}${this.formatMoney(this.tranzaksiya?.summa)} ${this.tranzaksiya?.valyuta || ''}`.trim(),
        `${this.texts.sanaVaqt}: ${this.formatDateTime(this.tranzaksiya?.created_at)}`,
      ];
      if (this.mahsulot) lines.push(`${this.texts.mahsulot}: ${this.mahsulot}`);
      if (this.bajaruvchi) lines.push(`${this.texts.kimBajargan}: ${this.bajaruvchi}`);
      return lines.join('\n');
    },
    texts() {
      const l = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: 'Amaliyot tafsiloti', back: 'Orqaga',
          notFound: "Amaliyot topilmadi yoki kirish ruxsati yo'q",
          amaliyotInfo: "Amaliyot ma'lumotlari",
          sanaVaqt: 'Sana va vaqt', kimBajargan: 'Kim bajargan',
          qarzInfo: "Qarz ma'lumotlari",
          qarzSummasi: 'Qarz summasi', berilganSana: 'Berilgan sana',
          qaytarishSana: 'Qaytarish sanasi', mahsulot: 'Mahsulot yoki xizmat', holati: 'Holati',
          bolibTolash: "Bo'lib to'lash", bolibTolashJadval: "Bo'lib to'lash jadvali", oy: 'oy',
          jadvalYuklanmoqda: "Jadval yuklanmoqda...",
          kvitansiya: 'Kvitansiya', ulashish: 'Ulashish',
          shareOk: 'Nusxa olindi', shareErr: "Ulashib bo'lmadi",
          amal_berish: 'Qarz berildi', amal_olish: 'Qarz olindi',
          amal_qaytarish: 'Qarz qaytarildi', amal_voz_kechish: 'Qarzdan voz kechildi',
          desc_berish: 'Mijozga yangi qarz berildi va daftarga qayd etildi.',
          desc_olish: 'Siz qarz oldingiz va daftarga qayd etildi.',
          desc_qaytarish: "Qarzning bir qismi yoki to'liq summasi qaytarildi.",
          desc_voz_kechish: 'Qarz summasidan voz kechildi va hisobdan chiqarildi.',
          tolovBelgilandi: "To'lov belgilandi", xatolik: 'Xatolik',
        },
        ru: {
          title: 'Детали операции', back: 'Назад',
          notFound: 'Операция не найдена или нет доступа',
          amaliyotInfo: 'Данные операции',
          sanaVaqt: 'Дата и время', kimBajargan: 'Кто выполнил',
          qarzInfo: 'Данные долга',
          qarzSummasi: 'Сумма долга', berilganSana: 'Дата выдачи',
          qaytarishSana: 'Дата возврата', mahsulot: 'Товар или услуга', holati: 'Статус',
          bolibTolash: 'Рассрочка', bolibTolashJadval: 'График рассрочки', oy: 'мес',
          jadvalYuklanmoqda: 'Загрузка графика...',
          kvitansiya: 'Квитанция', ulashish: 'Поделиться',
          shareOk: 'Скопировано', shareErr: 'Не удалось поделиться',
          amal_berish: 'Долг выдан', amal_olish: 'Долг получен',
          amal_qaytarish: 'Долг возвращён', amal_voz_kechish: 'Долг прощён',
          desc_berish: 'Клиенту выдан новый долг и записан в книгу.',
          desc_olish: 'Вы взяли в долг, операция записана в книгу.',
          desc_qaytarish: 'Возвращена часть или полная сумма долга.',
          desc_voz_kechish: 'Сумма долга прощена и списана.',
          tolovBelgilandi: 'Платёж отмечен', xatolik: 'Ошибка',
        },
        kr: {
          title: 'Амалиёт тафсилоти', back: 'Орқага',
          notFound: 'Амалиёт топилмади ёки рухсат йўқ',
          amaliyotInfo: 'Амалиёт маълумотлари',
          sanaVaqt: 'Сана ва вақт', kimBajargan: 'Ким бажарган',
          qarzInfo: 'Қарз маълумотлари',
          qarzSummasi: 'Қарз суммаси', berilganSana: 'Берилган сана',
          qaytarishSana: 'Қайтариш санаси', mahsulot: 'Маҳсулот ёки хизмат', holati: 'Ҳолати',
          bolibTolash: 'Бўлиб тўлаш', bolibTolashJadval: 'Бўлиб тўлаш жадвали', oy: 'ой',
          jadvalYuklanmoqda: 'Жадвал юкланмоқда...',
          kvitansiya: 'Квитансия', ulashish: 'Улашиш',
          shareOk: 'Нусха олинди', shareErr: 'Улашиб бўлмади',
          amal_berish: 'Қарз берилди', amal_olish: 'Қарз олинди',
          amal_qaytarish: 'Қарз қайтарилди', amal_voz_kechish: 'Қарздан воз кечилди',
          desc_berish: 'Мижозга янги қарз берилди ва дафтарга қайд этилди.',
          desc_olish: 'Сиз қарз олдингиз ва дафтарга қайд этилди.',
          desc_qaytarish: 'Қарзнинг бир қисми ёки тўлиқ суммаси қайтарилди.',
          desc_voz_kechish: 'Қарз суммасидан воз кечилди ва ҳисобдан чиқарилди.',
          tolovBelgilandi: 'Тўлов қайд этилди', xatolik: 'Хатолик',
        },
        // SS-DEV (2026-09-26): en/kaa
        en: {
          title: 'Transaction details', back: 'Back',
          notFound: "Transaction not found or access denied",
          amaliyotInfo: "Transaction information",
          sanaVaqt: 'Date and time', kimBajargan: 'Performed by',
          qarzInfo: "Debt information",
          qarzSummasi: 'Debt amount', berilganSana: 'Date given',
          qaytarishSana: 'Repayment date', mahsulot: 'Product or service', holati: 'Status',
          bolibTolash: "Instalments", bolibTolashJadval: "Instalment schedule", oy: 'months',
          jadvalYuklanmoqda: "Loading schedule...",
          kvitansiya: 'Receipt', ulashish: 'Share',
          shareOk: 'Copied', shareErr: "Could not share",
          amal_berish: 'Debt given', amal_olish: 'Debt received',
          amal_qaytarish: 'Debt repaid', amal_voz_kechish: 'Debt waived',
          desc_berish: 'A new debt was given to the customer and recorded in the ledger.',
          desc_olish: 'You received a debt and it was recorded in the ledger.',
          desc_qaytarish: "Part of the debt or the full amount was repaid.",
          desc_voz_kechish: 'The debt amount was waived and written off.',
          tolovBelgilandi: "Payment recorded", xatolik: 'Error',
        },
        kaa: {
          title: 'Ámeliyat detalları', back: 'Artqa',
          notFound: "Ámeliyat tabılmadı yamasa kiriw ruqsatı joq",
          amaliyotInfo: "Ámeliyat maǵlıwmatları",
          sanaVaqt: 'Sáne hám waqıt', kimBajargan: 'Kim orınlaǵan',
          qarzInfo: "Qarız maǵlıwmatları",
          qarzSummasi: 'Qarız summası', berilganSana: 'Berilgen sáne',
          qaytarishSana: 'Qaytarıw sánesi', mahsulot: 'Ónim yamasa xızmet', holati: 'Halatı',
          bolibTolash: "Bólip tólew", bolibTolashJadval: "Bólip tólew kestesi", oy: 'ay',
          jadvalYuklanmoqda: "Keste júklenbekte...",
          kvitansiya: 'Kvitanciya', ulashish: 'Bólisiw',
          shareOk: 'Nusqa alındı', shareErr: "Bólisip bolmadı",
          amal_berish: 'Qarız berildi', amal_olish: 'Qarız alındı',
          amal_qaytarish: 'Qarız qaytarıldı', amal_voz_kechish: 'Qarızdan waz keshildi',
          desc_berish: 'Klientke jańa qarız berildi hám dápterge jazıldı.',
          desc_olish: 'Siz qarız aldıńız hám dápterge jazıldı.',
          desc_qaytarish: "Qarızdıń bir bólegi yamasa tolıq summası qaytarıldı.",
          desc_voz_kechish: 'Qarız summasınan waz keshildi hám esaptan shıǵarıldı.',
          tolovBelgilandi: "Tólem belgilendi", xatolik: 'Qátelik',
        },
      };
      return t[l] || t.uz;
    },
  },
  /** created — ro'yxatdan kelgan ma'lumot DARHOL (birinchi renderdan oldin) o'rnatiladi */
  created() {
    this.hydrateFromStore();
  },
  async mounted() {
    if (!this.tranzaksiya) {
      // To'g'ridan-to'g'ri URL / F5 — ma'lumotni o'zimiz yuklaymiz
      await this.loadFallback();
    }
    if (this.bolibTolash && this.qarzId) {
      // Fon rejimi: global overlay chiqmaydi, sahifa allaqachon ko'rinib turadi
      await this.loadTolovlar(this.qarzId);
    }
  },
  methods: {
    formatMoney, // SS-AUDIT (2026-09-25): utils/helpers
    formatDate(d) { return fmtDMY(d) }, // SS-AUDIT (2026-09-25): utils/helpers (Safari-xavfsiz parse)
    formatDateTime(d) { return fmtDMYHM(d) }, // SS-AUDIT (2026-09-25): utils/helpers (Safari-xavfsiz parse)
    /**
     * Ota-qarz bo'lib to'lash asosida berilganmi.
     * MySQL'dan `bolib_tolash` turli tipda kelishi mumkin (1/0/"1"/true/null),
     * shu bois Number() bilan normallashtiramiz; oylar_soni > 0 ham hisobga olinadi.
     */
    isBolibTolashQarz(qarz) {
      if (!qarz) return false;
      if (Number(qarz.bolib_tolash) === 1) return true;
      return Number(qarz.oylar_soni) > 0;
    },
    /** Ro'yxat sahifasi tayyorlab qo'ygan ma'lumot (qo'shimcha so'rovsiz) */
    hydrateFromStore() {
      const p = this.$store.state.qarzTranzaksiya?.payload;
      const routeId = String(this.$route.params.id);
      if (!p || !p.tranzaksiya || String(p.tranzaksiya.id) !== routeId) return;
      this.tranzaksiya = p.tranzaksiya;
      this.qarz = p.qarz || null;
      this.mijozId = p.mijozId || null;
      this.turi = p.turi || '';
      this.bolibTolash = !!p.bolibTolash;
      this.bajaruvchi = p.bajaruvchi || '';
      this.mahsulot = p.mahsulot || '';
    },
    /**
     * F5 / to'g'ridan-to'g'ri URL uchun zaxira yuklash.
     * `?mijoz=` query'si yo'q bo'lsa amaliyotni topib bo'lmaydi — xato ko'rsatamiz
     * (JIM YIQILMAYDI).
     */
    async loadFallback() {
      const mijozId = this.$route.query?.mijoz;
      this.turi = this.$route.query?.turi || '';
      this.mijozId = mijozId || null;
      if (!mijozId) { this.loadError = true; return; }
      try {
        // `background: true` — global LoadingBar overlay'i chiqmasin: sahifa
        // o'zining ixcham spinner'ini ko'rsatib turibdi (ikkita spinner bo'lmasin).
        const res = await this.$axios.$get(`/qarz-daftari/mijozlar/${mijozId}/history`, { silent: true, background: true });
        if (!res?.success || !res.data) { this.loadError = true; return; }
        const rawId = String(this.$route.params.id);
        const qarzlar = res.data.qarzlar || [];
        const trs = res.data.tranzaksiyalar || [];

        let tr = trs.find((t) => String(t.id) === rawId) || null;
        // Ro'yxatdagi "sintetik" berish satri (eski qarzlarda real tranzaksiya yo'q):
        // uning id'si `berish-<qarzId>` ko'rinishida bo'ladi.
        if (!tr && rawId.indexOf('berish-') === 0) {
          const q = qarzlar.find((x) => String(x.id) === rawId.slice(7));
          if (q) {
            tr = {
              id: rawId, qarz_id: q.id, turi: 'berish',
              summa: q.miqdor, valyuta: q.valyuta,
              izoh: q.mahsulot_nomi || null,
              created_at: q.created_at || q.berilgan_sana || null,
              _derived: true,
            };
          }
        }
        if (!tr) { this.loadError = true; return; }

        const parent = qarzlar.find((q) => Number(q.id) === Number(tr.qarz_id)) || null;
        this.tranzaksiya = tr;
        this.qarz = parent;
        this.bolibTolash = this.isBolibTolashQarz(parent);
        this.bajaruvchi = tr.bajaruvchi_telefon || parent?.registrar_telefon || '';
        // Mahsulot faqat 'berish' amaliyotida bo'ladi (qaytarish izohi mahsulot emas)
        this.mahsulot = tr.turi === 'berish' && tr.izoh ? String(tr.izoh).trim() : '';
      } catch (_) {
        this.loadError = true;
      }
    },
    /**
     * Bo'lib to'lash jadvali — FON rejimida.
     * ⚠️ `silent: true` faqat toast'ni o'chiradi, global LoadingBar overlay'ini EMAS.
     * Overlay chiqmasligi uchun `background: true` SHART (plugins/axios.js →
     * shouldShowLoading).
     */
    async loadTolovlar(qarzId) {
      this.tolovlarLoading = true;
      try {
        const res = await this.$axios.$get(`/qarz-daftari/qarz/${qarzId}/tolovlar`, { silent: true, background: true });
        this.tolovlar = (res?.success && Array.isArray(res.data)) ? res.data : [];
      } catch (_) {
        this.tolovlar = [];
      } finally {
        this.tolovlarLoading = false;
      }
    },
    // SS-DEV (2026-09-24): "To'lovni kiritish" oynasidan summa keladi (sharshara backendda).
    async onTolandi(tolovId, summa) {
      try {
        const body = Number(summa) > 0 ? { summa: Number(summa) } : {};
        await this.$axios.$put(`/qarz-daftari/tolov/${tolovId}/tolandi`, body, { silent: true });
        this.$toast?.success(this.texts.tolovBelgilandi);
        if (this.qarzId) await this.loadTolovlar(this.qarzId);
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.texts.xatolik);
      }
    },
    goBack() {
      if (this.mijozId) {
        const q = this.turi ? `?turi=${this.turi}` : '';
        this.$router.push(this.localePath({ name: 'qarz-daftari-mijoz-id-amaliyotlar', params: { id: this.mijozId } }) + q);
        return;
      }
      this.$router.back();
    },
    /**
     * Ulashish — Web Share API, bo'lmasa clipboard, u ham bo'lmasa xato toast'i
     * (JIM YIQILMAYDI).
     */
    async share() {
      const text = this.shareText;
      try {
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({ title: this.texts.title, text });
          return;
        }
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          this.$toast?.success(this.texts.shareOk);
          return;
        }
        this.$toast?.error(this.texts.shareErr);
      } catch (e) {
        // Foydalanuvchi ulashishni bekor qilgan bo'lsa xato ko'rsatilmaydi
        if (e && e.name === 'AbortError') return;
        this.$toast?.error(this.texts.shareErr);
      }
    },
  },
};
</script>
