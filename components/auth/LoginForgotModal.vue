<template>
  <!-- Forgot Password Modal -->
  <div class="iden-modal-overlay" @click.self="removeIdenModal">
    <div class="iden-modal-container">
      <div class="iden-modal-header">
        <div class="iden-icon-wrapper">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <button class="iden-close-btn" @click="removeIdenModal">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="iden-modal-content">
        <h3 class="iden-modal-title">{{ modalTexts.title }}</h3>
        <p class="iden-modal-text">{{ modalTexts.message }}</p>
      </div>
      <div class="iden-store-section">
        <!-- Android -->
        <div class="iden-store-item">
          <div class="iden-qr-wrapper">
            <client-only>
              <vue-qr
                :text="'https://play.google.com/store/apps/details?id=com.zeroxuz'"
                :size="100"
                :margin="0"
                color-dark="#111827"
                color-light="#ffffff"
              />
            </client-only>
          </div>
          <a href="https://play.google.com/store/apps/details?id=com.zeroxuz" target="_blank" rel="noopener noreferrer" class="iden-store-btn">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
            </svg>
            <div class="iden-store-text">
              <span class="iden-store-label">GET IT ON</span>
              <span class="iden-store-name">Google Play</span>
            </div>
          </a>
        </div>
        <!-- iOS -->
        <div class="iden-store-item">
          <div class="iden-qr-wrapper">
            <client-only>
              <vue-qr
                :text="'https://apps.apple.com/uz/app/zerox/id6446497826'"
                :size="100"
                :margin="0"
                color-dark="#111827"
                color-light="#ffffff"
              />
            </client-only>
          </div>
          <a href="https://apps.apple.com/uz/app/zerox/id6446497826" target="_blank" rel="noopener noreferrer" class="iden-store-btn">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div class="iden-store-text">
              <span class="iden-store-label">Download on the</span>
              <span class="iden-store-name">App Store</span>
            </div>
          </a>
        </div>
      </div>
      <div class="iden-modal-footer">
        <button class="iden-btn-close" @click="removeIdenModal">{{ modalTexts.closeBtn }}</button>
      </div>
    </div>
  </div>

</template>

<script>
// wave D: pages/auth/login.vue dan ajratilgan (markup baytma-bayt o'sha; holat sahifada: props pastga, hodisalar yuqoriga).
// SS-PERF (2026-09-25): vue-qr (~90 KB) async komponent — faqat QR render bo'lganda yuklanadi
const VueQr = () => import('vue-qr').then((m) => m.default || m);
export default {
  name: 'LoginForgotModal',
  components: { VueQr },
  props: {
    removeIdenModal: { type: Function, default: undefined },
    modalTexts: { type: null, default: undefined },
  },
};
</script>

<style lang="scss" scoped src="../../assets/page-styles/login.scss"></style>
