<template>
  <div v-if="newsItem" class="news px-10 py-10 rounded bg-white">

    <h2 class="font-bold text-3xl text-center mb-6">
      {{ newsItem.title }}
    </h2>
  
    <div v-if="newsItem.img" class="flex justify-center mb-6">
      <img :src="`${$config.apiBaseUrl || 'https://app.zerox.uz'}${newsItem.img}`" loading="lazy" width="50%" alt="Yangilik rasmi" class="rounded-lg shadow-md" />
    </div>

    <div class="news-content" v-html="sanitizedDescription"></div>

  </div>
</template>

<script>
// =======================================================
// ===== 1-QO'SHIMCHA: Stillarni to'g'ri ko'rsatish uchun importlar =====
// =======================================================
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import dateformat from 'dateformat';
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      newsItem: null
    };
  },
  computed: {
    // XSS himoyasi: HTMLni DOMPurify bilan tozalash (hardened config)
    sanitizedDescription() {
      if (!this.newsItem || !this.newsItem.description) return '';
      return DOMPurify.sanitize(this.newsItem.description, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'pre', 'code', 'img', 'span', 'div'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'target'],
        ALLOW_DATA_ATTR: false,
        ALLOW_UNKNOWN_PROTOCOLS: false,
        FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style']
      });
    }
  },
  mounted() {
    this.getContractById(this.$route.params.id)
  },
  methods: {
    async getContractById(id) {
      try {
        const response = await this.$axios.get(`/news/${id}`)
        if (response.status === 200) {
          this.newsItem = response.data.data
        }
      }
      catch (e) {
        // Error handled silently
      }
    },
    dateFormat(date) {
      return dateformat(date, "dd.mm.yyyy");
    },
  },
};
</script>
<style scoped>
.news-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2.5rem; /* 40px */
  border-radius: 0.25rem;
}

/* ======================================================= */
/* === v-html KONTENTI UCHUN TO'LIQ STIL-PAKETI (START) === */
/* ======================================================= */

/* Umumiy matn uchun asosiy stillar */
.news-content {
  font-size: 16px;
  line-height: 1; /* Satrlar orasidagi masofa */
  color: #333;
}

/* Paragraflar (Abzats) */
.news-content::v-deep p {
  text-indent: 40px; /* Abzats boshi */
  margin-bottom: 1rem; /* Paragraflar orasida joy */
}

/* Sarlavhalar (H1, H2, H3...) */
.news-content::v-deep h1,
.news-content::v-deep h2,
.news-content::v-deep h3,
.news-content::v-deep h4 {
  font-weight: 600; /* Qalinroq shrift */
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-indent: 0; /* Sarlavhalarda abzats bo'lmaydi */
}

.news-content::v-deep h1 { font-size: 2em; }
.news-content::v-deep h2 { font-size: 1.75em; }
.news-content::v-deep h3 { font-size: 1.5em; }

/* Ro'yxatlar (<ul>, <ol>) */
.news-content::v-deep ul,
.news-content::v-deep ol {
  margin-left: 60px; /* Ro'yxatlar uchun chapdan joy */
  margin-bottom: 1rem;
}
.news-content::v-deep li {
  margin-bottom: 0.5rem; /* Ro'yxat elementlari orasida joy */
}

/* Havolalar (Linklar) */
.news-content::v-deep a {
  color: #2563eb; /* Moviy rang */
  text-decoration: underline;
  transition: color 0.2s;
}
.news-content::v-deep a:hover {
  color: #1d4ed8; /* To'qroq moviy */
}

/* Iqtibos (Blockquote) */
.news-content::v-deep blockquote {
  border-left: 4px solid #d1d5db; /* Chap tomonda chiziq */
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #6b7280; /* Kulrang matn */
  font-style: italic; /* Yotiq shrift */
  text-indent: 0;
}

/* Kod bloki (<pre>) */
.news-content::v-deep pre {
  background-color: #f3f4f6; /* Orqa fon rangi */
  color: #111827;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  white-space: pre-wrap;      /* Kod uzun bo'lsa, keyingi qatorga o'tadi */
  word-wrap: break-word;      /* So'zlar sig'masa, bo'linadi */
  font-family: 'Courier New', Courier, monospace; /* Monospace shrift */
}
/* ======================================================= */
/* === v-html KONTENTI UCHUN TO'LIQ STIL-PAKETI (END) === */
/* ======================================================= */
</style>