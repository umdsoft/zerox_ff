<template>
  <!-- 01.10 (doc1 4-band, 5/6-rasm): ommaviy oferta TASDIQLASH oynasi — ilovadagi ekran ko'rinishida.
       Ilgari PDF <iframe> ichida edi: mobil kenglikda hujjat o'ngdan kesilib qolardi (5-rasm) va
       "oxirigacha o'qildi"ni aniqlab bo'lmasdi (boshqa domen PDF'i — skroll hodisasi kelmaydi).
       Endi matn (OfferUz/OfferRu/OfferEn — /public-offer sahifasidagi AYNAN shu matn) o'z skroll
       konteynerida; "tanishdim" belgisi faqat oxirigacha o'qilgach qo'yiladi. Mobil — to'liq ekran,
       desktop — markazda karta. Hodisalar (closeContractModal / removeContractModal) avvalgidek.
       03.10 (mobil doc 2-rasm — ilovadagi oferta sahifasi): hujjat boshida logo (chapda) + QR (o'ngda),
       pastda chiziq, rozilik belgisi va TO'LIQ KENGLIKDAGI ko'k "Tasdiqlash" tugmasi (barcha o'lchamlarda). -->
  <div class="ofm-overlay" role="dialog" aria-modal="true" :aria-label="texts.title" @click.self="decline">
    <div class="ofm-card">
      <!-- Yuqori panel: ORQAGA (tasdiqlamasdan chiqish) + sarlavha -->
      <div class="ofm-top">
        <button type="button" class="ofm-back" :title="texts.back" :aria-label="texts.back" :disabled="saving" @click="decline">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 class="ofm-top-title">{{ texts.title }}</h2>
        <span class="ofm-top-side" aria-hidden="true"></span>
      </div>
      <div class="ofm-progress" aria-hidden="true">
        <div class="ofm-progress-fill" :style="{ width: progress + '%' }"></div>
      </div>

      <!-- Hujjat matni — o'z skrolli -->
      <div ref="scroller" class="ofm-scroll" @scroll.passive="onScroll">
        <div class="ofm-doc">
          <div class="ofm-doc-head">
            <img :src="logoSrc" alt="ZeroX" class="ofm-logo" />
            <!-- 03.10: ilovadagi hujjat kabi o'ng tomonda QR (ommaviy oferta sahifasi havolasi) -->
            <div class="ofm-qr" aria-hidden="true">
              <vue-qr v-if="qrText" :text="qrText" :size="240" :margin="0" color-dark="#111827" color-light="#ffffff" />
            </div>
          </div>
          <div class="ofm-doc-title">
            <p>{{ texts.docLine1 }}</p>
            <p>{{ texts.docLine2 }}</p>
            <p class="ofm-doc-title-main">{{ texts.docLine3 }}</p>
          </div>

          <div class="ofm-doc-body">
            <OfferRu v-if="docLang === 'ru'" @hook:mounted="onDocReady" />
            <OfferEn v-else-if="docLang === 'kr'" @hook:mounted="onDocReady" />
            <OfferUz v-else @hook:mounted="onDocReady" />
          </div>
          <div v-if="!docReady" class="ofm-loading">
            <span class="ofm-spinner" aria-hidden="true"></span>
          </div>
          <!-- Hujjat oxiri belgisi (IntersectionObserver kuzatadi) -->
          <div ref="endMark" class="ofm-end" aria-hidden="true"></div>
        </div>
      </div>

      <!-- Pastki qism: rozilik belgisi + Tasdiqlash -->
      <div class="ofm-footer">
        <label :class="['ofm-check', readToEnd ? '' : 'ofm-check--locked']" @click="onCheckAreaClick">
          <input
            v-model="isAffirmed"
            type="checkbox"
            class="ofm-check-input"
            :aria-disabled="!readToEnd"
            @click="onCheckClick"
          />
          <span class="ofm-check-text">{{ texts.agree }}</span>
        </label>
        <button
          type="button"
          :class="['ofm-submit', canSubmit ? '' : 'ofm-submit--idle']"
          :aria-disabled="!canSubmit"
          @click="accept"
        >
          <span v-if="saving" class="ofm-spinner ofm-spinner--light" aria-hidden="true"></span>
          {{ $t('process.accept') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const END_TOLERANCE_PX = 24; // oxirgacha deb hisoblash uchun pastki chegara (yaxlitlash/zoom)
const WARN_THROTTLE_MS = 1500; // bir xil ogohlantirish ketma-ket chiqib ketmasin

export default {
  name: "idenMessage",
  components: {
    // vue-qr — faqat oyna ochilganda yuklanadi (IdenMessage/login bilan bir xil usul)
    VueQr: () => import('vue-qr'),
    // Uzun matnlar faqat oyna ochilganda yuklanadi (asosiy bundle og'irlashmasin)
    OfferUz: () => import('~/components/OfferUz.vue'),
    OfferRu: () => import('~/components/OfferRu.vue'),
    OfferEn: () => import('~/components/OfferEn.vue'),
  },
  data: () => ({
    isAffirmed: false,
    readToEnd: false,
    docReady: false,
    progress: 0,
    saving: false,
    lastWarnAt: 0,
    qrText: '',
  }),
  computed: {
    /** en/kaa — o'zbekcha (lotin) matn; ru — ruscha; kr — kirill ($apiLang bilan bir xil xarita) */
    docLang() {
      try {
        return this.$apiLang ? this.$apiLang() : (this.$i18n && this.$i18n.locale) || 'uz';
      } catch (_) {
        return 'uz';
      }
    },
    logoSrc() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz';
      if (l === 'ru') return require('@/assets/img/logo_ru.svg');
      if (l === 'kr') return require('@/assets/img/logo_kr.svg');
      return require('@/assets/img/logo.svg');
    },
    canSubmit() {
      return this.readToEnd && this.isAffirmed && !this.saving;
    },
    texts() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz';
      const t = {
        uz: {
          title: 'Ommaviy oferta', back: 'Orqaga',
          docLine1: '“ZEROX” MCHJ tomonidan yaratilgan',
          docLine2: '“ZeroX” tizimidan foydalanish to‘g‘risida',
          docLine3: 'OMMAVIY OFERTA',
          readToEnd: 'Iltimos, ofertani tasdiqlash uchun uni oxirigacha o‘qib chiqing.',
          checkFirst: 'Iltimos, ommaviy oferta bilan tanishganingizni belgilang.',
          agree: 'Ommaviy oferta bilan tanishdim. Shartnoma shartlariga roziman.',
        },
        ru: {
          title: 'Публичная оферта', back: 'Назад',
          docLine1: 'Созданная ООО «ZEROX»',
          docLine2: 'об использовании системы «ZeroX»',
          docLine3: 'ПУБЛИЧНАЯ ОФЕРТА',
          readToEnd: 'Пожалуйста, чтобы подтвердить оферту, прочитайте её до конца.',
          checkFirst: 'Пожалуйста, отметьте, что вы ознакомились с публичной офертой.',
          agree: 'С публичной офертой ознакомлен(а). С условиями договора согласен(на).',
        },
        kr: {
          title: 'Оммавий оферта', back: 'Орқага',
          docLine1: '“ZEROX” МЧЖ томонидан яратилган',
          docLine2: '“ZeroX” тизимидан фойдаланиш тўғрисида',
          docLine3: 'ОММАВИЙ ОФЕРТА',
          readToEnd: 'Илтимос, офертани тасдиқлаш учун уни охиригача ўқиб чиқинг.',
          checkFirst: 'Илтимос, оммавий оферта билан танишганингизни белгиланг.',
          agree: 'Оммавий оферта билан танишдим. Шартнома шартларига розиман.',
        },
        en: {
          title: 'Public offer', back: 'Back',
          docLine1: 'Created by “ZEROX” LLC',
          docLine2: 'on the use of the “ZeroX” system',
          docLine3: 'PUBLIC OFFER',
          readToEnd: 'Please read the offer to the end to confirm it.',
          checkFirst: 'Please confirm that you have read the public offer.',
          agree: 'I have read the public offer. I agree to the terms of the agreement.',
        },
        kaa: {
          title: 'Ǵalabalıq oferta', back: 'Artqa',
          docLine1: '“ZEROX” JShJ tárepinen jaratılǵan',
          docLine2: '“ZeroX” sistemasınan paydalanıw haqqında',
          docLine3: 'ǴALABALIQ OFERTA',
          readToEnd: 'Iltimas, ofertanı tastıyıqlaw ushın onı aqırına shekem oqıp shıǵıń.',
          checkFirst: 'Iltimas, ǵalabalıq oferta menen tanısqanıńızdı belgileń.',
          agree: 'Ǵalabalıq oferta menen tanıstım. Shártnama shártlerine razıman.',
        },
      };
      return t[l] || t.uz;
    },
  },
  watch: {
    // Darvoza yopiq bo'lsa rozilik belgisi hech qachon true qolmasin
    readToEnd(v) {
      if (!v) this.isAffirmed = false;
    },
  },
  mounted() {
    try {
      const path = this.localePath ? this.localePath({ name: 'public-offer' }) : '/public-offer';
      this.qrText = `${window.location.origin}${path}`;
    } catch (_) {
      this.qrText = '';
    }
    this.prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this.onKeydown);
    window.addEventListener('resize', this.evaluateScroll);
    if (typeof window.IntersectionObserver === 'function' && this.$refs.endMark) {
      this.endObserver = new window.IntersectionObserver((entries) => {
        if (this.docReady && entries.some((e) => e.isIntersecting)) this.markRead();
      }, { root: this.$refs.scroller, rootMargin: `0px 0px ${END_TOLERANCE_PX}px 0px` });
      this.endObserver.observe(this.$refs.endMark);
    }
  },
  beforeDestroy() {
    document.body.style.overflow = this.prevBodyOverflow || '';
    document.removeEventListener('keydown', this.onKeydown);
    window.removeEventListener('resize', this.evaluateScroll);
    if (this.endObserver) this.endObserver.disconnect();
  },
  methods: {
    /** Matn komponenti chizildi — o'lchovlar endi to'g'ri */
    onDocReady() {
      this.docReady = true;
      this.$nextTick(this.evaluateScroll);
    },
    onScroll() {
      this.evaluateScroll();
    },
    /** Skroll foizi + oxiriga yetildimi (hujjat ekranga sig'sa ham — o'qildi) */
    evaluateScroll() {
      const el = this.$refs.scroller;
      if (!el || !this.docReady) return;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= END_TOLERANCE_PX) {
        this.progress = 100;
        this.markRead();
        return;
      }
      this.progress = Math.max(this.progress, Math.min(100, Math.round((el.scrollTop / max) * 100)));
      if (el.scrollTop >= max - END_TOLERANCE_PX) this.markRead();
    },
    markRead() {
      this.progress = 100;
      this.readToEnd = true;
    },
    warn(msg) {
      const now = Date.now();
      if (now - this.lastWarnAt < WARN_THROTTLE_MS) return;
      this.lastWarnAt = now;
      if (this.$toast) this.$toast.error(msg);
    },
    /** Oxirigacha o'qilmagan — belgi QO'YILMAYDI (change hodisasi bo'lmaydi), ogohlantirish */
    onCheckClick(e) {
      if (this.readToEnd) return;
      e.preventDefault();
      this.warn(this.texts.readToEnd);
    },
    /** Label matni bosilganda ham xuddi shu (input'ning o'zi bosilgani onCheckClick'da) */
    onCheckAreaClick(e) {
      if (this.readToEnd || (e.target && e.target.tagName === 'INPUT')) return;
      e.preventDefault();
      this.warn(this.texts.readToEnd);
    },
    onKeydown(e) {
      if (e.key === 'Escape') this.decline();
    },
    /** Tasdiqlamasdan chiqish — saytning qolgan bo'limlari ochiq (faqat shartnoma amali so'raydi) */
    decline() {
      if (this.saving) return;
      this.closeContractModal();
    },
    async accept() {
      if (this.saving) return;
      if (!this.readToEnd) return this.warn(this.texts.readToEnd);
      if (!this.isAffirmed) return this.warn(this.texts.checkFirst);
      this.saving = true;
      try {
        const con = await this.$axios.put('/user/edit_contract', {}, { silent: true });
        if (con && con.data && con.data.msg === 'is_contract_true') {
          this.$toast.error(this.$t('a1.a102'));
        } else {
          this.$toast.success(this.$t('a1.a43'));
        }
        // is_contract=1 — foydalanuvchi ma'lumotini yangilaymiz (sahifani qayta yuklamasdan);
        // yangilab bo'lmasa — avvalgidek sahifa qayta yuklanadi.
        try {
          await this.$auth.fetchUser();
        } catch (_) {
          window.location.reload();
          return;
        }
        this.removeContractModal();
      } catch (_) {
        this.$toast.error(this.$t('a1.a42'));
      } finally {
        this.saving = false;
      }
    },
    removeContractModal() {
      this.$emit("removeContractModal");
    },
    closeContractModal() {
      this.$emit("closeContractModal");
    },
  },
};
</script>

<style scoped>
.ofm-overlay {
  position: fixed;
  inset: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.ofm-card {
  background: #ffffff;
  width: 100%;
  max-width: 860px;
  height: 92vh;
  max-height: 960px;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* --- Yuqori panel --- */
.ofm-top {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  flex-shrink: 0;
}
.ofm-back {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.ofm-back:hover { background: #f3f4f6; }
.ofm-back:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
.ofm-top-title {
  flex: 1;
  min-width: 0;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ofm-top-side { width: 40px; flex-shrink: 0; }

.ofm-progress { height: 3px; background: #eef2f7; flex-shrink: 0; }
.ofm-progress-fill { height: 100%; background: #2563eb; transition: width 0.2s ease; }

/* --- Hujjat --- */
.ofm-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden; /* 03.10: hujjat hech qachon o'ngdan kesilmasin (1-rasm) */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  background: #ffffff;
}
.ofm-doc {
  padding: 28px 48px 32px;
  color: #111827;
  font-size: 14px;
  line-height: 1.6;
  overflow-wrap: break-word;
  word-wrap: break-word;
}
.ofm-doc-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.ofm-logo { height: 72px; width: auto; max-width: 60%; }
.ofm-qr { width: 96px; height: 96px; flex-shrink: 0; }
.ofm-qr ::v-deep img { display: block; width: 100%; height: 100%; }
.ofm-doc-title { text-align: center; font-weight: 700; margin-bottom: 18px; }
.ofm-doc-title p { margin: 0; }
.ofm-doc-title-main { letter-spacing: 0.02em; }

/* Matn komponentlarining sahifa uslubi (kartalar, soyalar) hujjat ko'rinishiga keltiriladi */
.ofm-doc-body ::v-deep article { display: block; }
.ofm-doc-body ::v-deep article > * + * { margin-top: 14px; }
.ofm-doc-body ::v-deep section {
  background: transparent;
  border: 0;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
}
.ofm-doc-body ::v-deep h2 {
  font-size: 1em;
  font-weight: 700;
  justify-content: center;
  text-align: center;
  margin: 18px 0 8px;
}
.ofm-doc-body ::v-deep h2 > span:first-child { display: none; } /* ko'k chiziq — hujjatda yo'q */
.ofm-doc-body ::v-deep p { text-align: justify; text-indent: 3ch; margin: 0 0 6px; }
.ofm-doc-body ::v-deep ul,
.ofm-doc-body ::v-deep ol { list-style: none; padding: 0; margin: 0; }
.ofm-doc-body ::v-deep li + li { margin-top: 6px; }
.ofm-doc-body ::v-deep address { font-style: normal; }

.ofm-end { height: 1px; }

.ofm-loading { display: flex; justify-content: center; padding: 32px 0; }
.ofm-spinner {
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 3px solid #dbeafe;
  border-top-color: #2563eb;
  animation: ofm-spin 0.8s linear infinite;
}
.ofm-spinner--light { width: 18px; height: 18px; border-color: rgba(255, 255, 255, 0.45); border-top-color: #ffffff; }
@keyframes ofm-spin { to { transform: rotate(360deg); } }

/* --- Pastki qism (03.10: ilovadagidek — chiziq, rozilik belgisi, ostida to'liq kenglikdagi tugma) --- */
.ofm-footer {
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
  padding: 16px 24px calc(16px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
  background: #ffffff;
}
.ofm-check {
  flex: 0 0 auto; /* ustun (column) joylashuvda balandligi kontentga teng — Safari'da qisqarmasin */
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}
.ofm-check-input {
  width: 22px;
  height: 22px;
  margin-top: 1px;
  flex-shrink: 0;
  accent-color: #2563eb;
  cursor: pointer;
}
.ofm-check-text { font-size: 15px; line-height: 1.4; color: #1f2937; }
.ofm-check--locked .ofm-check-input { opacity: 0.5; }
.ofm-check--locked .ofm-check-text { color: #6b7280; }

.ofm-submit {
  flex-shrink: 0;
  width: 100%;
  height: 52px;
  padding: 0 28px;
  border: 0;
  border-radius: 14px;
  background: #2563eb;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.28);
  transition: background-color 0.15s ease, opacity 0.15s ease;
}
.ofm-submit:hover { background: #1d4ed8; }
.ofm-submit:focus-visible { outline: 2px solid #1d4ed8; outline-offset: 2px; }
.ofm-submit--idle { opacity: 0.55; box-shadow: none; }
.ofm-submit--idle:hover { background: #2563eb; }

/* --- Mobil: to'liq ekran (ilovadagi ekran kabi, 6-rasm) --- */
@media (max-width: 640px) {
  .ofm-overlay { padding: 0; align-items: stretch; }
  .ofm-card {
    max-width: none;
    height: 100%;
    max-height: none;
    border-radius: 0;
    box-shadow: none;
  }
  .ofm-top { padding: 10px 12px; }
  .ofm-doc { padding: 18px 16px 24px; font-size: 12.5px; line-height: 1.55; }
  .ofm-logo { height: 56px; }
  .ofm-qr { width: 72px; height: 72px; }
  .ofm-footer {
    padding: 14px 16px calc(14px + env(safe-area-inset-bottom, 0px));
  }
  .ofm-check-text { font-size: 16px; }
}
</style>
