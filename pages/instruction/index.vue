<template>
  <div class="bg-white rounded px-4 py-2">
    <div class="container">

      <!-- 📱 Mobil: faqat yuklab olish tugmasi -->
      <div class="md:hidden py-4 flex justify-center">
        <a
          :href="pdfUrl"
          download
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 active:scale-[.98] transition"
        >
          <!-- download icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>{{ downloadLabel }}</span>
        </a>
      </div>

      <!-- 💻 Planshet/desktop: iframe -->
      <div class="hidden md:block">
        <iframe
          v-if="$i18n.locale == 'uz'"
          src="https://pdf.zerox.uz/yoriqnoma.pdf"
          frameborder="0"
          width="100%"
          height="900"
        ></iframe>

        <iframe
          v-if="$i18n.locale == 'kr'"
          src="https://pdf.zerox.uz/йўриқнома.pdf"
          frameborder="0"
          width="100%"
          height="900"
        ></iframe>

        <iframe
          v-if="$i18n.locale == 'ru'"
          src="https://pdf.zerox.uz/инструкция.pdf"
          frameborder="0"
          width="100%"
          height="900"
        ></iframe>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  computed: {
    pdfUrl() {
      if (this.$i18n.locale === 'uz') return 'https://pdf.zerox.uz/yoriqnoma.pdf'
      if (this.$i18n.locale === 'kr') return 'https://pdf.zerox.uz/йўриқнома.pdf'
      return 'https://pdf.zerox.uz/инструкция.pdf'
    },
    downloadLabel() {
      if (this.$i18n.locale === 'ru') return 'Скачать'
      if (this.$i18n.locale === 'kr') return 'Юклаб олиш'
      return 'Yuklab olish'
    }
  }
}
</script>

<style lang="scss" scoped>
/* maxsus style kerak emas; hammasi tailwind bilan */
</style>
