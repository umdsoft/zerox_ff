<template>
  <!-- 11.10 (sayt hujjati, 9-rasm): "Foydalanish yo'riqnomasi" — YANGI yo'riqnoma (qarz shartnomasi, qarz daftari,
       shaxsiy qarz, shaxsiy moliya va boshqa funksiyalar). PDF saytning o'zida (static/docs) — bir xil domen,
       shuning uchun iframe'da ishonchli ochiladi (boshqa domendagi PDF X-Frame-Options/tarmoq sabab ochilmasdi).
       Kichik ekranda — "Ochish" va "Yuklab olish" tugmalari (mobil brauzerlar iframe ichida PDF ko'rsatmaydi). -->
  <div class="rounded-2xl bg-white shadow-sm">
    <div class="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
        </span>
        <div>
          <h1 class="text-lg font-semibold text-gray-900">{{ tx.title }}</h1>
          <p class="text-sm text-gray-500">{{ tx.subtitle }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <a
          :href="pdfUrl"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 md:hidden"
        >{{ tx.open }}</a>
        <a
          :href="pdfUrl"
          :download="fileName"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {{ tx.download }}
        </a>
      </div>
    </div>

    <div class="hidden p-3 md:block">
      <div class="relative overflow-hidden rounded-xl bg-gray-100" style="height: calc(100vh - 230px); min-height: 560px">
        <div v-if="!frameLoaded" class="absolute inset-0 flex items-center justify-center">
          <svg class="h-7 w-7 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" /></svg>
        </div>
        <iframe
          :src="pdfUrl"
          :title="tx.title"
          class="relative h-full w-full"
          frameborder="0"
          @load="frameLoaded = true"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
const GUIDE_PATH = '/docs/zerox-yoriqnoma.pdf'
const TX = {
  uz: { title: "Foydalanish yo'riqnomasi", subtitle: "Qarz shartnomasi, qarz daftari, shaxsiy qarz va shaxsiy moliya bo'yicha qo'llanma", open: 'Ochish', download: 'Yuklab olish' },
  kr: { title: 'Фойдаланиш йўриқномаси', subtitle: 'Қарз шартномаси, қарз дафтари, шахсий қарз ва шахсий молия бўйича қўлланма', open: 'Очиш', download: 'Юклаб олиш' },
  ru: { title: 'Инструкция по использованию', subtitle: 'Руководство: договор займа, книга долгов, личные долги и личные финансы', open: 'Открыть', download: 'Скачать' },
  en: { title: 'User guide', subtitle: 'Loan contracts, debt ledger, personal debts and personal finance', open: 'Open', download: 'Download' },
  kaa: { title: 'Paydalanıw qollanbası', subtitle: 'Qarız shártnaması, qarız dápteri, jeke qarız hám jeke qarjı boyınsha qollanba', open: 'Ashıw', download: 'Júklep alıw' },
}

export default {
  data() {
    return { frameLoaded: false, spinnerTimer: null }
  },
  mounted() {
    // Ba'zi brauzerlarda PDF iframe `load` hodisasini bermaydi — spinner abadiy qolmasin.
    this.spinnerTimer = setTimeout(() => { this.frameLoaded = true }, 5000)
  },
  beforeDestroy() {
    clearTimeout(this.spinnerTimer)
  },
  head() {
    return { title: this.tx.title }
  },
  computed: {
    tx() { return TX[(this.$i18n && this.$i18n.locale) || 'uz'] || TX.uz },
    // Yo'riqnoma hozircha o'zbek (lotin) tilida — barcha tillar uchun bitta fayl.
    pdfUrl() { return GUIDE_PATH },
    fileName() { return 'ZeroX-yoriqnoma.pdf' },
  },
}
</script>
