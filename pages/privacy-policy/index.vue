<template>
  <div class="page">
    <div class="card__footer">
      <div class="market">
        <!-- Agar iOS Safari bo‘lsa yoki fallback majbur bo‘lsa, Google Viewer ishlatiladi -->
        <iframe
          v-if="effectiveSrc"
          :key="effectiveSrc"
          :src="effectiveSrc"
          title="PDF"
          class="pdf-frame"
          allow="fullscreen"
          referrerpolicy="no-referrer"
        ></iframe>

        <div v-else class="fallback">
          <p>{{ $t?.('pdf_not_supported') || 'PDFni brauzerda ko‘rsatib bo‘lmadi.' }}</p>
          <a class="btn" :href="rawPdfUrl" target="_blank" rel="noopener">
            {{ $t?.('open_pdf') || 'PDFni ochish' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const isIOS = () => {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export default {
  data: () => ({
    url: null,
    useGoogleViewer: false,   // iOS yoki muammo bo‘lsa true bo‘ladi
  }),
  computed: {
    rawPdfUrl() {
      // serverdagi asl PDF (o‘zgarmagan)
      return this.url
    },
    googleViewerUrl() {
      // Google Viewer: ko‘p mobil brauzerlar uchun ishonchli
      const encoded = encodeURIComponent(this.rawPdfUrl)
      return `https://docs.google.com/gview?embedded=1&url=${encoded}`
    },
    effectiveSrc() {
      // iOS/Safari’da ko‘pincha iframe+pdf ishlamaydi => Google Viewer
      return this.useGoogleViewer ? this.googleViewerUrl : this.rawPdfUrl
    },
  },
  mounted() {
    // Asl link
    this.url = `https://pdf.zerox.uz/policy.php?lang=${this.$route.query.lang}&download=0`

    // iOS/Safari uchun darhol Google Viewer’dan foydalanamiz
    if (isIOS()) {
      this.useGoogleViewer = true
    } else {
      // Android/WebView va boshqalar: avval native iframe’ni sinab ko‘ramiz,
      // agar 1.5s ichida yuklanmasa — Google Viewer fallback.
      // (Ko‘p webviewlarda Content-Disposition yoki mime muammosi bo‘lishi mumkin.)
      const timer = setTimeout(() => {
        // fallback’ga o‘tish
        this.useGoogleViewer = true
      }, 1500)

      // Agar iframe muvaffaqiyatli yuklansa — fallback’ni bekor qilamiz
      // onload’ni kuzatish uchun iframe’ga keyinroq kira olamiz:
      this.$nextTick(() => {
        const frame = this.$el.querySelector('.pdf-frame')
        if (frame) {
          frame.addEventListener('load', () => clearTimeout(timer), { once: true })
          frame.addEventListener('error', () => {
            clearTimeout(timer)
            this.useGoogleViewer = true
          }, { once: true })
        } else {
          clearTimeout(timer)
        }
      })
    }
  }
}
</script>

<style scoped>
/* Root konteyner — haqiqiy ekran balandligi */
.page {
  /* 100svh — mobil safe area / dynamic toolbarlar uchun ishonchliroq */
  height: 100svh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin: 0;
  padding: 0;
}

/* Har bir ota ham to‘liq balandlikni olsin */
.card__footer,
.market {
  flex: 1 1 auto;
  min-height: 0;           /* flex ichida child overflow ishlashi uchun */
  display: flex;
  flex-direction: column;
}

/* Iframe to‘liq joyni egallasin */
.pdf-frame {
  border: none;
  width: 100%;
  height: 100%;
  display: block;
}

/* Fallback UI */
.fallback {
  margin: auto;
  text-align: center;
}
.fallback .btn {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 6px;
  background: #1565d8;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}
</style>
