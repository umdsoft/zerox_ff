/**
 * Quill Editor Plugin - Lazy Load
 * ~200KB kutubxonani faqat kerak bo'lganda yuklash
 */
import Vue from 'vue'

// Quill Editor komponentini lazy load qilish
const QuillEditor = () => ({
  component: import('vue-quill-editor').then(async (m) => {
    // CSS'ni ham yuklash
    await Promise.all([
      import('quill/dist/quill.core.css'),
      import('quill/dist/quill.snow.css'),
      import('quill/dist/quill.bubble.css'),
    ])
    const VueQuillEditor = m.default || m
    return VueQuillEditor.quillEditor
  }),
  loading: {
    template: '<div class="animate-pulse bg-gray-200 h-32 rounded"></div>',
  },
  delay: 0,
  timeout: 30000,
})

// Global komponent
Vue.component('quill-editor', QuillEditor)
