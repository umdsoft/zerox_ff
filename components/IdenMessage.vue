<template>
  <div class="modal-overlay" @click.self="removeIdenModal">
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div class="icon-wrapper">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <button @click="removeIdenModal" class="close-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <h3 class="modal-title">{{ texts.title }}</h3>
        <p class="modal-text">{{ texts.message }}</p>
      </div>

      <!-- Store Buttons -->
      <div class="store-section">
        <div class="store-grid">
          <!-- Android -->
          <a
            href="https://play.google.com/store/apps/details?id=com.zeroxuz"
            target="_blank"
            class="store-btn"
          >
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
            </svg>
            <div class="store-text">
              <span class="store-label">GET IT ON</span>
              <span class="store-name">Google Play</span>
            </div>
          </a>

          <!-- iOS -->
          <a
            href="https://apps.apple.com/uz/app/zerox/id6446497826"
            target="_blank"
            class="store-btn"
          >
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div class="store-text">
              <span class="store-label">Download on the</span>
              <span class="store-name">App Store</span>
            </div>
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button @click="removeIdenModal" class="btn-close">
          {{ texts.closeBtn }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IdenMessage",

  computed: {
    texts() {
      const locale = this.$i18n?.locale || 'uz';
      const translations = {
        uz: {
          title: "Parolni tiklash",
          message: "Hurmatli foydalanuvchi, parolni ZeroX mobil ilovasi orqali tiklashingiz mumkin.",
          closeBtn: "Yopish"
        },
        ru: {
          title: "Восстановление пароля",
          message: "Уважаемый пользователь, вы можете восстановить пароль в мобильном приложении ZeroX.",
          closeBtn: "Закрыть"
        },
        kr: {
          title: "Паролни тиклаш",
          message: "Ҳурматли фойдаланувчи, паролни ZeroX мобил иловаси орқали тиклашингиз мумкин.",
          closeBtn: "Ёпиш"
        }
      };
      return translations[locale] || translations.uz;
    }
  },

  methods: {
    removeIdenModal() {
      this.$emit("removeIdenModal");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-container {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
}

.icon-wrapper {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 1rem;
}

.close-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  border-radius: 0.75rem;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
}

.modal-content {
  padding: 1.25rem 1.5rem;
  text-align: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.modal-text {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
}

.store-section {
  padding: 0 1.5rem;
}

.store-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.store-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #111827;
  color: white;
  border-radius: 0.75rem;
  transition: all 0.2s;
  text-decoration: none;

  &:hover {
    background: #1f2937;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.store-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.store-label {
  font-size: 0.7rem;
  opacity: 0.8;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.store-name {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.modal-footer {
  padding: 1.5rem;
}

.btn-close {
  width: 100%;
  padding: 0.875rem;
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 0.75rem;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
  }
}

@media (max-width: 480px) {
  .modal-container {
    max-width: 100%;
    margin: 0 1rem;
    border-radius: 1.25rem;
  }
}
</style>
