<template>
  <div class="iden-modal-overlay" @click.self="removeIdenModal">
    <div class="iden-modal-card" role="dialog" aria-modal="true">
      <!-- Header -->
      <div class="iden-modal-header">
        <div class="iden-icon-wrap">
          <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <button @click="removeIdenModal" class="iden-close-btn" :aria-label="texts.closeBtn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="iden-modal-content">
        <h3 class="iden-modal-title">{{ texts.title }}</h3>
        <p class="iden-modal-text">{{ texts.message }}</p>
      </div>

      <!-- Store Buttons -->
      <div class="iden-store-section">
        <div class="iden-store-grid">
          <a
            href="https://play.google.com/store/apps/details?id=com.zeroxuz"
            target="_blank"
            rel="noopener noreferrer"
            class="iden-store-btn"
          >
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
            </svg>
            <div class="iden-store-text">
              <span class="iden-store-label">GET IT ON</span>
              <span class="iden-store-name">Google Play</span>
            </div>
          </a>

          <a
            href="https://apps.apple.com/uz/app/zerox/id6446497826"
            target="_blank"
            rel="noopener noreferrer"
            class="iden-store-btn"
          >
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div class="iden-store-text">
              <span class="iden-store-label">Download on the</span>
              <span class="iden-store-name">App Store</span>
            </div>
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div class="iden-modal-footer">
        <button @click="removeIdenModal" class="iden-btn-close">
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
          title: "Identifikatsiyadan o'ting",
          message: "Hurmatli foydalanuvchi, siz identifikatsiyadan o'tmaganligingiz sababli qarz shartnomasi tuza olmaysiz, biroq qarz daftari va tizimning boshqa funksiyalaridan foydalana olasiz. Iltimos, qarz shartnomasi tuzish uchun quyidagi havola orqali mobil ilovani yuklab oling va identifikatsiyadan o'ting.",
          closeBtn: "Yopish",
        },
        ru: {
          title: "Пройдите идентификацию",
          message: "Уважаемый пользователь, вы не можете заключить договор займа, потому что не прошли идентификацию. Однако вы можете пользоваться долговой книгой и другими функциями системы. Пожалуйста, скачайте мобильное приложение по ссылке ниже и пройдите идентификацию, чтобы заключить договор займа.",
          closeBtn: "Закрыть",
        },
        kr: {
          title: "Идентификациядан ўтинг",
          message: "Ҳурматли фойдаланувчи, сиз идентификациядан ўтмаганлигингиз сабабли қарз шартномаси туза олмайсиз, бироқ қарз дафтари ва тизимнинг бошқа функцияларидан фойдалана оласиз. Илтимос, қарз шартномаси тузиш учун қуйидаги ҳавола орқали мобил иловани юклаб олинг ва идентификациядан ўтинг.",
          closeBtn: "Ёпиш",
        },
      };
      return translations[locale] || translations.uz;
    },
  },
  mounted() {
    // Body scroll'ni bloklash modal ochiq vaqt
    document.body.style.overflow = 'hidden';
    // Esc tugmasi orqali yopish
    this._onKeyDown = (e) => { if (e.key === 'Escape') this.removeIdenModal(); };
    window.addEventListener('keydown', this._onKeyDown);
  },
  beforeDestroy() {
    document.body.style.overflow = '';
    if (this._onKeyDown) window.removeEventListener('keydown', this._onKeyDown);
  },
  methods: {
    removeIdenModal() {
      this.$emit("removeIdenModal");
    },
  },
};
</script>

<style lang="scss" scoped>
/*
  IdenMessage modal — class nomlari "iden-" prefix bilan,
  default.vue dagi global .modal-overlay (opacity: 0; visibility: hidden) bilan
  to'qnashuvni oldini olish uchun. Avval shu CSS to'qnashuvi sababli modal noto'g'ri
  ko'rinardi — endi tashqi CSS ta'sir qilmaydi.
*/
.iden-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999; /* sidebar (60), header, va boshqa modallardan yuqori */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  opacity: 1;
  visibility: visible;
  animation: idenFadeIn 0.2s ease-out;
}

@keyframes idenFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes idenSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.iden-modal-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: idenSlideUp 0.3s ease-out;
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
}

.iden-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
}

.iden-icon-wrap {
  width: 3.25rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 0.875rem;
}

.iden-close-btn {
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  background: #f3f4f6;
  border: none;
  border-radius: 0.625rem;
  cursor: pointer;
  transition: all 0.15s;
  padding: 0;

  &:hover {
    background: #e5e7eb;
    color: #111827;
  }
}

.iden-modal-content {
  padding: 1rem 1.5rem 1.25rem;
  text-align: center;
}

.iden-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem;
  line-height: 1.3;
}

.iden-modal-text {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.55;
  margin: 0;
}

.iden-store-section {
  padding: 0 1.5rem;
}

.iden-store-grid {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.iden-store-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: #111827;
  color: white;
  border-radius: 0.75rem;
  transition: all 0.2s;
  text-decoration: none;

  &:hover {
    background: #1f2937;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.iden-store-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.iden-store-label {
  font-size: 0.7rem;
  opacity: 0.85;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.iden-store-name {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
}

.iden-modal-footer {
  padding: 1.25rem 1.5rem 1.5rem;
}

.iden-btn-close {
  width: 100%;
  padding: 0.75rem;
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  font-size: 0.9375rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #e5e7eb;
  }
}

@media (max-width: 480px) {
  .iden-modal-card {
    max-width: 100%;
    margin: 0 0.5rem;
    border-radius: 1.25rem;
  }
}
</style>
