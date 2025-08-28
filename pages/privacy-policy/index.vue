<template>
  <div class="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
    <!-- HEADER -->
    <header class="sticky top-0 z-30 bg-white shadow">
      <div class="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-3">
          <div>
            <h1 class="text-lg font-bold">“ZeroX” tizimidan foydalanish to‘g‘risida</h1>
            <p class="text-sm font-semibold text-gray-500">OMMAVIY OFERTA</p>
          </div>
        </div>
        <div class="hidden sm:flex gap-2">
          <button @click="printPage"
            class="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium hover:border-blue-600 hover:text-blue-600">
            Chop etish
          </button>
          <button @click="scrollTop"
            class="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
            Yuqoriga
          </button>
        </div>
      </div>
    </header>

    <!-- BODY -->
    <main class="flex-1 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 px-4 py-6">
      <!-- TOC — tilga qarab matnlar o‘zgaradi, id lar esa o‘sha-o‘sha -->
      <aside
        class="lg:w-64 flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-24 self-start hidden lg:block">
        <h2 class="font-semibold mb-3">{{ toc.title }}</h2>
        <ol class="space-y-1 text-sm">
          <li v-for="item in toc.items" :key="item.id">
            <button type="button" class="toc-link" @click="go(item.id)">{{ item.text }}</button>
          </li>
        </ol>
      </aside>


      <OfferUz v-if="$i18n.locale == 'uz'" />
      <OfferRu v-if="$i18n.locale == 'ru'" />
      <OfferEn v-if="$i18n.locale == 'kr'" />
    </main>

    <!-- FOOTER -->
    <footer class="bg-white border-t border-gray-200 py-4">
      <div class="max-w-6xl mx-auto text-center text-sm text-gray-500">
        © ZEROX MCHJ • www.zerox.uz
      </div>
    </footer>
  </div>
</template>

<script>
import DocSection from '~/components/DocSection.vue'
import OfferUz from '~/components/OfferUz.vue'
import OfferRu from '~/components/OfferRu.vue'
import OfferEn from '~/components/OfferEn.vue'
export default {

  components: { DocSection, OfferUz, OfferRu, OfferEn },
  data() {
    return {
      lang: 'uz', // default til
      tocDict: {
        uz: {
          title: 'MUNDARIJA',
          items: [
            { id: 's1', text: '1. Atama va tushunchalar' },
            { id: 's2', text: '2. Ommaviy oferta predmeti' },
            { id: 's3', text: '3. Ommaviy ofertani aksept (qabul) qilish' },
            { id: 's4', text: '4. Taraflarning majburiyatlari' },
            { id: 's5', text: '5. Taraflarning huquqlari' },
            { id: 's6', text: '6. Taraflarning javobgarligi' },
            { id: 's7', text: '7. Ommaviy ofertaning amal qilishi, o‘zgartirish va chaqirib olish tartibi' },
            { id: 's8', text: '8. Maxfiylik' },
            { id: 's9', text: '9. Fors-major holatlari' },
            { id: 's10', text: '10. Tizim xizmatlaridan foydalanganlik uchun hisob-kitob' },
            { id: 's11', text: '11. Boshqa shartlar' },
            { id: 's12', text: '12. Nizolarni hal qilish tartibi' },
            { id: 's13', text: '13. Rekvizitlar' }
          ]
        },
        ru: {
          title: 'СОДЕРЖАНИЕ',
          items: [
            { id: 's1', text: '1. Термины и понятия' },
            { id: 's2', text: '2. Предмет публичной оферты' },
            { id: 's3', text: '3.	Акцепт (прием) публичной оферты' },
            { id: 's4', text: '4.	Обязательства сторон' },
            { id: 's5', text: '5.	Права Сторон' },
            { id: 's6', text: '6.	Ответственность Сторон' },
            { id: 's7', text: ' 7.	Порядок действия публичной Оферты, внесения изменений в ее условия и отзыва' },
            { id: 's8', text: '8.	Конфиденциальность' },
            { id: 's9', text: '9.	Форс-мажорные обстоятельства' },
            { id: 's10', text: '10. Расчет за пользование услугами Системы' },
            { id: 's11', text: '11. Прочие условия' },
            { id: 's12', text: '12. Порядок разрешения споров' },
            { id: 's13', text: '13.	Адрес и реквизиты Общества' }
          ]
        },
        kr: {
          title: 'МУНДАРИЖА',
          items: [
            { id: 's1', text: '1. Атама ва тушунчалар' },
            { id: 's2', text: '2. Оммавий оферта предмети' },
            { id: 's3', text: '3. Оммавий офертани акцепт (қабул) қилиш' },
            { id: 's4', text: '4. Тарафларнинг мажбуриятлари' },
            { id: 's5', text: '5. Тарафларнинг мажбуриятлари' },
            { id: 's6', text: '  6. Тарафларнинг жавобгарлиги' },
            { id: 's7', text: '7. Оммавий офертанинг амал қилиши, унинг шартларига ўзгартириш киритиш ва чақириб олиш тартиби' },
            { id: 's8', text: '8. Махфийлик' },
            { id: 's9', text: '9. Форс-мажор ҳолатлари' },
            { id: 's10', text: '10. Тизим хизматларидан фойдаланганлик учун ҳисоб-китоб' },
            { id: 's11', text: '11. Бошқа шартлар' },
            { id: 's12', text: '12. Низоларни ҳал қилиш тартиби' },
            { id: 's13', text: '13. Жамият манзили ва реквизитлари' }
          ]
        }
      }
    }
  },
  computed: {
    currentOfferComponent() {
      return this.$i18n.locale === 'ru' ? 'OfferRu' : this.lang === 'en' ? 'OfferEn' : 'OfferUz'
    },
    toc() {
      return this.tocDict[this.$i18n.locale]
    }
  },
  methods: {
    printPage() { window.print() },
    scrollTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) },

    // Hash qo'ymasdan, header balandligini hisobga olgan skroll
    go(id) {
      const el = document.getElementById(id)
      if (!el) return
      const header = document.querySelector('header')
      const headerH = header ? header.offsetHeight : 0
      const gap = 12 // tepa bo'shlig'i
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - gap
      window.scrollTo({ top: y, behavior: 'smooth' })
      // Agar avval hash bo'lgan bo'lsa, tozalaymiz — reloadda introdan boshlasin
      if (location.hash) {
        history.replaceState(null, '', location.pathname + location.search)
      }
    }
  },
  mounted() {
    // Sahifa hash bilan ochilsa ham tozalab, introdan boshlatamiz
    if (process.client && location.hash) {
      history.replaceState(null, '', location.pathname + location.search)
      this.$nextTick(() => window.scrollTo({ top: 0, behavior: 'auto' }))
    }
  }
}
</script>

<style>
/* TOC tugmalari */
.toc-link {
  /* Tailwind utility-larini SFC style ichida qo‘llash uchun oddiy CSSdan foydalanamiz */
  background: transparent;
  border: none;
  padding: 0;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.toc-link:hover,
.toc-link:focus {
  color: #2563eb;
  outline: none;
}

/* Paragraflar: justify + 3 probel (3ch) obzas */
.legal-body p {
  text-align: justify;
  line-height: 1.7;
  text-indent: 3ch;
}

/* Ro'yxatlar: markerlarsiz, obzas bilan */
.legal-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.legal-list>li {
  text-align: justify;
  line-height: 1.7;
  text-indent: 3ch;
  padding-left: 0;
}

.legal-list>li::marker {
  content: "";
}

/* Print soddalashtirish */
@media print {
  aside {
    display: none !important;
  }

  article>section,
  article>.doc-section {
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
