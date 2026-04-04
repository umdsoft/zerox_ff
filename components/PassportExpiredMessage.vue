<template>
  <div class="pem-overlay" @click.self="close">
    <div class="pem-container">
      <!-- Close button -->
      <div style="display: flex; justify-content: flex-end; padding: 1rem 1.5rem 0;">
        <button @click="close" class="pem-close-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Icon (markazda) -->
      <div style="display: flex; justify-content: center; margin-bottom: 0.5rem;">
        <div class="pem-icon">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div style="padding: 1.25rem 1.5rem; text-align: center;">
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #111827; margin-bottom: 0.75rem;">{{ texts.title }}</h3>
        <p style="font-size: 0.9rem; color: #6b7280; line-height: 1.7;">{{ texts.message }}</p>
      </div>

      <!-- QR Codes (desktop) -->
      <div class="pem-qr-section">
        <p style="text-align: center; font-size: 0.8rem; color: #9ca3af; margin-bottom: 1rem;">{{ texts.scanQr }}</p>
        <div style="display: flex; justify-content: center; gap: 2rem;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
            <div style="width: 140px; height: 140px; padding: 8px; background: white; border: 2px solid #e5e7eb; border-radius: 1rem; display: flex; align-items: center; justify-content: center;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://play.google.com/store/apps/details?id=com.zeroxuz" alt="Google Play QR" style="width: 100%; height: 100%; object-fit: contain;" loading="lazy" />
            </div>
            <span style="font-size: 0.75rem; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: 0.5rem; background: #e8f5e9; color: #2e7d32;">Google Play</span>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem;">
            <div style="width: 140px; height: 140px; padding: 8px; background: white; border: 2px solid #e5e7eb; border-radius: 1rem; display: flex; align-items: center; justify-content: center;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://apps.apple.com/uz/app/zerox/id6446497826" alt="App Store QR" style="width: 100%; height: 100%; object-fit: contain;" loading="lazy" />
            </div>
            <span style="font-size: 0.75rem; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: 0.5rem; background: #e3f2fd; color: #1565c0;">App Store</span>
          </div>
        </div>
      </div>

      <!-- Store Links (mobile) -->
      <div class="pem-store-section">
        <a href="https://play.google.com/store/apps/details?id=com.zeroxuz" target="_blank" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1.25rem; background: #111827; color: white; border-radius: 0.75rem; text-decoration: none; margin-bottom: 0.75rem;">
          <svg style="width: 28px; height: 28px;" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
          <div><span style="font-size: 0.65rem; opacity: 0.8; text-transform: uppercase;">GET IT ON</span><br/><span style="font-size: 1rem; font-weight: 600;">Google Play</span></div>
        </a>
        <a href="https://apps.apple.com/uz/app/zerox/id6446497826" target="_blank" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1.25rem; background: #111827; color: white; border-radius: 0.75rem; text-decoration: none;">
          <svg style="width: 28px; height: 28px;" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          <div><span style="font-size: 0.65rem; opacity: 0.8; text-transform: uppercase;">Download on the</span><br/><span style="font-size: 1rem; font-weight: 600;">App Store</span></div>
        </a>
      </div>

      <!-- Footer -->
      <div style="padding: 1.25rem 1.5rem;">
        <button @click="close" style="width: 100%; padding: 0.875rem; background: #f3f4f6; color: #374151; font-weight: 600; font-size: 0.9375rem; border-radius: 0.75rem; border: none; cursor: pointer;">
          {{ texts.closeBtn }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PassportExpiredMessage',

  mounted() {
    console.log('[PassportExpiredMessage] MOUNTED');
  },

  computed: {
    texts() {
      const locale = this.$i18n?.locale || 'uz';
      const translations = {
        uz: {
          title: 'ID karta (pasport) muddati tugadi',
          message: "Hurmatli foydalanuvchi, ID karta (pasport) muddati o'tganligi sababli Siz tizimning asosiy funksiyalaridan foydalana olmaysiz. Iltimos, tizimdan to'liq foydalanish uchun quyidagi havola orqali mobil ilovani yuklab oling va qayta identifikatsiyadan o'ting.",
          scanQr: "QR kodni skanerlang yoki tugmani bosing",
          closeBtn: 'Yopish',
        },
        ru: {
          title: 'Срок действия ID-карты (паспорта) истёк',
          message: 'Уважаемый пользователь, Вы не можете использовать основные функции системы, потому что срок действия вашей ID-карты (паспорта) истек. Пожалуйста, загрузите мобильное приложение по ссылке ниже и пройдите повторную идентификацию, чтобы в полной мере использовать систему.',
          scanQr: 'Сканируйте QR-код или нажмите кнопку',
          closeBtn: 'Закрыть',
        },
        kr: {
          title: 'ID карта (паспорт) муддати тугади',
          message: 'Ҳурматли фойдаланувчи, ID карта (паспорт) муддати ўтганлиги сабабли Сиз тизимнинг асосий функцияларидан фойдалана олмайсиз. Илтимос, тизимдан тўлиқ фойдаланиш учун қуйидаги ҳавола орқали мобил иловани юклаб олинг ва қайта идентификациядан ўтинг.',
          scanQr: 'QR кодни сканерланг ёки тугмани босинг',
          closeBtn: 'Ёпиш',
        },
      };
      return translations[locale] || translations.uz;
    },
  },

  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style>
.pem-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 99999 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(4px);
}

.pem-container {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.pem-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
}

.pem-icon {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 1rem;
}

.pem-close-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  border-radius: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
}

/* QR — faqat desktop */
.pem-qr-section {
  padding: 0 1.5rem 1rem;
  display: none;
}
@media (min-width: 768px) {
  .pem-qr-section { display: block; }
  .pem-store-section { display: none !important; }
}

/* Store — faqat mobile */
.pem-store-section {
  padding: 0 1.5rem;
}
</style>
