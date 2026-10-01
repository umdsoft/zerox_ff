<template>
  <div class="zx-pp">
    <!-- 29.09: Maxfiylik siyosati — ommaviy sahifa (mehmon ham ochadi; mobil ilova va do'konlar shu
         manzilga havola beradi: https://zerox.uz/privacy-policy). Ommaviy oferta — /public-offer. -->
    <header class="zx-pp__bar">
      <div class="zx-pp__bar-in">
        <nuxt-link :to="localePath({ name: 'index' })" class="zx-pp__logo" :aria-label="doc.homeLink">
          <img v-if="locale === 'ru'" src="@/assets/img/logo_ru.svg" alt="ZeroX" />
          <img v-else-if="locale === 'kr'" src="@/assets/img/logo_kr.svg" alt="ZeroX" />
          <img v-else src="@/assets/img/logo.svg" alt="ZeroX" />
        </nuxt-link>
        <div class="zx-pp__actions">
          <div class="zx-pp__langs" role="group" aria-label="Language">
            <button
              v-for="l in langs"
              :key="l.code"
              type="button"
              class="zx-pp__lang"
              :class="{ 'is-active': locale === l.code }"
              :aria-pressed="locale === l.code ? 'true' : 'false'"
              @click="changeLanguage(l.code)"
            >{{ l.label }}</button>
          </div>
          <button type="button" class="zx-pp__print" @click="printPage">{{ doc.print }}</button>
        </div>
      </div>
    </header>

    <main class="zx-pp__main">
      <section class="zx-pp__hero">
        <span class="zx-pp__chip">{{ doc.docLabel }}</span>
        <h1 class="zx-pp__title">{{ doc.title }}</h1>
        <dl class="zx-pp__meta">
          <div>
            <dt>{{ doc.effectiveLabel }}</dt>
            <dd>{{ doc.effectiveDate }}</dd>
          </div>
          <div>
            <dt>{{ doc.operatorLabel }}</dt>
            <dd>{{ doc.operator }}</dd>
          </div>
        </dl>
      </section>

      <div class="zx-pp__layout">
        <aside class="zx-pp__toc" aria-label="toc">
          <p class="zx-pp__toc-title">{{ doc.tocTitle }}</p>
          <ol>
            <li v-for="s in doc.sections" :key="s.id">
              <button type="button" class="zx-pp__toc-link" :class="{ 'is-active': activeId === s.id }" @click="go(s.id)">{{ s.title }}</button>
            </li>
          </ol>
        </aside>

        <article class="zx-pp__doc">
          <div class="zx-pp__intro">
            <p v-for="(para, i) in doc.intro" :key="'intro-' + i">{{ para }}</p>
          </div>

          <section v-for="s in doc.sections" :id="s.id" :key="s.id" class="zx-pp__section">
            <h2>{{ s.title }}</h2>
            <template v-for="(b, bi) in s.blocks">
              <p v-if="b.p" :key="s.id + '-p-' + bi">{{ b.p }}</p>
              <ul v-else-if="b.list" :key="s.id + '-l-' + bi">
                <li v-for="(item, ii) in b.list" :key="s.id + '-l-' + bi + '-' + ii">{{ item }}</li>
              </ul>
            </template>
          </section>

          <footer class="zx-pp__foot">
            <nuxt-link :to="localePath({ name: 'public-offer' })" class="zx-pp__foot-link">{{ doc.offerLink }}</nuxt-link>
            <nuxt-link :to="localePath({ name: 'index' })" class="zx-pp__foot-link">{{ doc.homeLink }}</nuxt-link>
            <button type="button" class="zx-pp__foot-link" @click="scrollTop">{{ doc.toTop }} ↑</button>
          </footer>
        </article>
      </div>
    </main>

    <p class="zx-pp__copy">© “ZEROX” • www.zerox.uz</p>
  </div>
</template>

<script>
import uzDoc from '~/utils/privacyPolicy/uz.js';

// uz — asosiy matn (darhol); boshqa tillar kerak bo'lganda alohida chunk sifatida yuklanadi.
const LOADERS = {
  ru: () => import('~/utils/privacyPolicy/ru.js'),
  kr: () => import('~/utils/privacyPolicy/kr.js'),
  en: () => import('~/utils/privacyPolicy/en.js'),
  kaa: () => import('~/utils/privacyPolicy/kaa.js'),
};

const PAGE_TITLES = {
  uz: 'Maxfiylik siyosati — ZeroX',
  ru: 'Политика конфиденциальности — ZeroX',
  kr: 'Махфийлик сиёсати — ZeroX',
  en: 'Privacy Policy — ZeroX',
  kaa: 'Qupıyalıq siyasatı — ZeroX',
};

export default {
  // Ochiq sahifa: global "auth" middleware har bir sahifaga login talab qiladi. Maxfiylik siyosati
  // ro'yxatdan o'tishdan OLDIN, mobil ilova va App Store/Google Play tekshiruvlari uchun akkauntsiz
  // ochilishi shart.
  auth: false,
  data() {
    return {
      doc: uzDoc,
      activeId: null,
      langs: [
        { code: 'uz', label: 'UZ' },
        { code: 'ru', label: 'RU' },
        { code: 'kr', label: 'ЎЗ' },
        { code: 'kaa', label: 'QQ' },
        { code: 'en', label: 'EN' },
      ],
    };
  },
  head() {
    return {
      title: PAGE_TITLES[this.locale] || PAGE_TITLES.uz,
      meta: [{ hid: 'description', name: 'description', content: this.doc.title }],
    };
  },
  computed: {
    locale() {
      return (this.$i18n && this.$i18n.locale) || 'uz';
    },
  },
  watch: {
    locale: { immediate: true, handler: 'loadDoc' },
  },
  mounted() {
    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') return;
    this._observer = new window.IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) this.activeId = visible[0].target.id;
    }, { rootMargin: '-80px 0px -60% 0px' });
    this.$nextTick(this.observeSections);
  },
  beforeDestroy() {
    if (this._observer) this._observer.disconnect();
  },
  methods: {
    async loadDoc(locale) {
      const loader = LOADERS[locale];
      if (!loader) {
        this.doc = uzDoc;
        this.$nextTick(this.observeSections);
        return;
      }
      try {
        const mod = await loader();
        // Til yuklanish paytida yana o'zgargan bo'lsa — eskirgan javobni qo'llamaymiz
        if (this.locale === locale) this.doc = (mod && mod.default) || uzDoc;
      } catch (_) {
        this.doc = uzDoc; // chunk yuklanmasa — asosiy (o'zbekcha) matn
      }
      this.$nextTick(this.observeSections);
    },
    observeSections() {
      if (!this._observer) return;
      this._observer.disconnect();
      this.doc.sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) this._observer.observe(el);
      });
    },
    changeLanguage(code) {
      if (code === this.locale) return;
      if (this.$i18n && typeof this.$i18n.setLocaleCookie === 'function') this.$i18n.setLocaleCookie(code);
      if (this.$i18n && typeof this.$i18n.setLocale === 'function') this.$i18n.setLocale(code);
    },
    printPage() {
      window.print();
    },
    scrollTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    go(id) {
      const el = document.getElementById(id);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.pageYOffset - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    },
  },
};
</script>

<style scoped>
.zx-pp {
  --pp-ink: #0f172a;
  --pp-text: #334155;
  --pp-muted: #64748b;
  --pp-line: #e2e8f0;
  --pp-brand: #2563eb;
  --pp-brand-soft: #eff6ff;
  min-height: 100vh;
  background: #f5f7fb;
  color: var(--pp-text);
}
.zx-pp__bar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--pp-line);
}
.zx-pp__bar-in {
  max-width: 1120px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.zx-pp__logo img { height: 36px; display: block; }
.zx-pp__actions { display: flex; align-items: center; gap: 10px; }
.zx-pp__langs {
  display: flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 3px;
}
.zx-pp__lang {
  border: 0;
  background: transparent;
  padding: 5px 9px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--pp-muted);
  cursor: pointer;
}
.zx-pp__lang.is-active { background: #fff; color: var(--pp-brand); box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12); }
.zx-pp__print {
  border: 1px solid var(--pp-line);
  background: #fff;
  border-radius: 10px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--pp-ink);
  cursor: pointer;
}
.zx-pp__print:hover { border-color: var(--pp-brand); color: var(--pp-brand); }

.zx-pp__main { max-width: 1120px; margin: 0 auto; padding: 28px 16px 24px; }
.zx-pp__hero {
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 55%, #4f46e5 100%);
  color: #fff;
  border-radius: 20px;
  padding: 28px 28px 24px;
  box-shadow: 0 12px 32px -18px rgba(37, 99, 235, 0.6);
}
.zx-pp__chip {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.12em;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.28);
  padding: 5px 10px;
  border-radius: 999px;
}
.zx-pp__title { margin-top: 12px; font-size: 26px; line-height: 1.25; font-weight: 800; max-width: 820px; }
.zx-pp__meta { margin-top: 18px; display: flex; flex-wrap: wrap; gap: 10px 28px; }
.zx-pp__meta dt { font-size: 12px; color: rgba(255, 255, 255, 0.72); }
.zx-pp__meta dd { font-size: 15px; font-weight: 700; margin: 2px 0 0; }

.zx-pp__layout { margin-top: 22px; display: grid; grid-template-columns: 1fr; gap: 20px; }
.zx-pp__toc { display: none; }
.zx-pp__doc {
  background: #fff;
  border: 1px solid var(--pp-line);
  border-radius: 18px;
  padding: 26px 24px;
  min-width: 0;
}
.zx-pp__intro p {
  font-size: 15px;
  line-height: 1.75;
  color: var(--pp-ink);
  margin: 0 0 12px;
  text-align: justify;
}
.zx-pp__section { padding-top: 22px; margin-top: 22px; border-top: 1px solid var(--pp-line); scroll-margin-top: 84px; }
.zx-pp__section h2 { font-size: 18px; font-weight: 800; color: var(--pp-ink); margin: 0 0 12px; }
.zx-pp__section p { font-size: 15px; line-height: 1.75; margin: 0 0 10px; text-align: justify; }
.zx-pp__section ul { margin: 4px 0 12px; padding: 0; list-style: none; }
.zx-pp__section li {
  position: relative;
  padding-left: 22px;
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 6px;
}
.zx-pp__section li::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 0.72em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--pp-brand);
}
.zx-pp__foot {
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px dashed var(--pp-line);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.zx-pp__foot-link {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--pp-line);
  background: var(--pp-brand-soft);
  color: var(--pp-brand);
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.zx-pp__foot-link:hover { border-color: var(--pp-brand); }
.zx-pp__copy { text-align: center; font-size: 12px; color: var(--pp-muted); padding: 8px 16px 28px; }

@media (min-width: 1024px) {
  .zx-pp__layout { grid-template-columns: 280px minmax(0, 1fr); align-items: start; }
  .zx-pp__toc {
    display: block;
    position: sticky;
    top: 76px;
    background: #fff;
    border: 1px solid var(--pp-line);
    border-radius: 16px;
    padding: 16px 12px;
    max-height: calc(100vh - 96px);
    overflow-y: auto;
  }
  .zx-pp__toc-title { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: var(--pp-muted); margin: 0 6px 8px; }
  .zx-pp__toc ol { list-style: none; margin: 0; padding: 0; }
  .zx-pp__toc-link {
    width: 100%;
    text-align: left;
    border: 0;
    background: transparent;
    padding: 7px 8px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.35;
    color: var(--pp-text);
    cursor: pointer;
  }
  .zx-pp__toc-link:hover { background: #f8fafc; color: var(--pp-brand); }
  .zx-pp__toc-link.is-active { background: var(--pp-brand-soft); color: var(--pp-brand); font-weight: 700; }
  .zx-pp__doc { padding: 34px 40px; }
  .zx-pp__title { font-size: 30px; }
}
@media (max-width: 480px) {
  .zx-pp__hero { padding: 22px 18px 18px; border-radius: 16px; }
  .zx-pp__title { font-size: 21px; }
  .zx-pp__doc { padding: 20px 16px; }
  .zx-pp__print { display: none; }
  .zx-pp__intro p, .zx-pp__section p { text-align: left; }
}
@media print {
  .zx-pp { background: #fff; }
  .zx-pp__bar, .zx-pp__toc, .zx-pp__foot, .zx-pp__copy { display: none !important; }
  .zx-pp__hero { background: none; color: #000; box-shadow: none; padding: 0; }
  .zx-pp__meta dt { color: #444; }
  .zx-pp__doc { border: 0; padding: 0; }
}
</style>
