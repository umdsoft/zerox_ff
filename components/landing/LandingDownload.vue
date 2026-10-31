<template>
  <!-- Download Section - Premium Design -->
  <section id="download" class="download-section">
    <!-- Background Effects -->
    <div class="download-bg">
      <div class="download-bg-gradient"></div>
      <div class="download-bg-pattern"></div>
      <div class="download-bg-glow"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Content Side -->
        <div class="download-content">
          <!-- Badge -->
          <div class="download-badge">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
            </svg>
            <span>{{ texts.download.badge || 'Bepul yuklab oling' }}</span>
          </div>

          <h2 class="download-title">
            {{ texts.download.title }}
          </h2>

          <p class="download-description">
            {{ texts.download.description }}
          </p>

          <!-- App Stats -->
          <div class="download-stats">
            <div class="download-stat">
              <div class="download-stat-value">4.8</div>
              <div class="download-stat-stars">
                <svg v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <div class="download-stat-label">{{ texts.download.rating || 'Reyting' }}</div>
            </div>
            <div class="download-stat-divider"></div>
            <div class="download-stat">
              <div class="download-stat-value">1K+</div>
              <div class="download-stat-label">{{ texts.download.downloads || 'Yuklab olishlar' }}</div>
            </div>
            <div class="download-stat-divider"></div>
            <div class="download-stat">
              <div class="download-stat-value">100%</div>
              <div class="download-stat-label">{{ texts.download.free || 'Bepul' }}</div>
            </div>
          </div>

          <!-- Download Cards -->
          <div class="download-cards">
            <!-- Google Play Card -->
            <div class="download-card-premium">
              <div class="download-card-qr">
                <div class="download-card-qr-inner">
                  <client-only>
                    <vue-qr
                      :text="'https://play.google.com/store/apps/details?id=com.zeroxuz'"
                      :size="90"
                      :margin="0"
                      color-dark="#ffffff"
                      color-light="transparent"
                    />
                  </client-only>
                </div>
                <span class="download-card-qr-label">{{ texts.download.scanQr || 'QR kodni skanerlang' }}</span>
              </div>
              <div class="download-card-info">
                <a
                  href="https://play.google.com/store/apps/details?id=com.zeroxuz"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="download-card-btn download-card-btn-android"
                >
                  <svg class="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                  <div>
                    <span class="download-card-btn-label">GET IT ON</span>
                    <span class="download-card-btn-store">Google Play</span>
                  </div>
                </a>
                <div class="download-card-meta">
                  <span class="download-card-meta-item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Android 6.0+
                  </span>
                </div>
              </div>
            </div>

            <!-- App Store Card -->
            <div class="download-card-premium">
              <div class="download-card-qr">
                <div class="download-card-qr-inner">
                  <client-only>
                    <vue-qr
                      :text="'https://apps.apple.com/uz/app/zerox/id6446497826'"
                      :size="90"
                      :margin="0"
                      color-dark="#ffffff"
                      color-light="transparent"
                    />
                  </client-only>
                </div>
                <span class="download-card-qr-label">{{ texts.download.scanQr || 'QR kodni skanerlang' }}</span>
              </div>
              <div class="download-card-info">
                <a
                  href="https://apps.apple.com/uz/app/zerox/id6446497826"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="download-card-btn download-card-btn-ios"
                >
                  <svg class="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <span class="download-card-btn-label">Download on the</span>
                    <span class="download-card-btn-store">App Store</span>
                  </div>
                </a>
                <div class="download-card-meta">
                  <span class="download-card-meta-item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    iOS 13.0+
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Phone Mockup Side -->
        <div class="download-phone-wrapper">
          <div class="download-phone-glow"></div>
          <div class="download-phone">
            <!-- 03.10: telefon ramkasi ichida mobil ilovaning haqiqiy Bosh sahifasi (SS-PERF: lazy) -->
            <div class="download-phone-frame">
              <div class="download-phone-screen">
                <img src="@/assets/img/app-home-screen.jpg" alt="ZeroX Mobile App" class="download-phone-screen-img" loading="lazy" decoding="async" />
              </div>
              <span class="download-phone-camera" aria-hidden="true"></span>
            </div>
          </div>
          <!-- Floating Elements -->
          <div class="download-float download-float-1">
            <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>{{ texts.download.secure || 'Xavfsiz' }}</span>
          </div>
          <div class="download-float download-float-2">
            <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
            </svg>
            <span>{{ texts.download.fast || 'Tez' }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// wave D: components/LandingPage.vue dan ajratilgan bo'lim (markup baytma-bayt o'sha; matnlar `texts` prop orqali).
// SS-PERF (2026-09-25): vue-qr (~90 KB) async komponent — landing asosiy chunk'idan chiqarildi
const VueQr = () => import('vue-qr').then((m) => m.default || m);
export default {
  name: 'LandingDownload',
  components: { VueQr },
  props: {
    texts: { type: Object, required: true },
  },
};
</script>

<style lang="scss" scoped>
/* ========================================
   DOWNLOAD SECTION - PREMIUM DESIGN
   ======================================== */

.download-section {
  position: relative;
  padding: 4rem 0;
  overflow: hidden;
  display: flex;
  align-items: center;
}

/* Background Effects */
.download-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.download-bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 25%, #1e3a5f 50%, #0f172a 100%);
}

.download-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%);
}

.download-bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
  filter: blur(50px);
  animation: pulseGlow 8s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

/* Content Styling */
.download-content {
  color: white;
}

.download-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
}

.download-title {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.download-description {
  font-size: 1rem;
  color: rgba(191, 219, 254, 0.9);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 450px;
}

/* Stats */
.download-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.download-stat {
  text-align: center;
  flex: 1;
}

.download-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.download-stat-stars {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-top: 0.25rem;
}

.download-stat-label {
  font-size: 0.75rem;
  color: rgba(191, 219, 254, 0.7);
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.download-stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
}

/* Download Cards - Premium */
.download-cards {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.download-card-premium {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  padding: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(59, 130, 246, 0.15);
  }
}

.download-card-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: transparent;
  margin-bottom: 0.5rem;
}

.download-card-qr-inner {
  width: 90px;
  height: 90px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  .download-card-premium:hover & {
    transform: scale(1.05);
  }
}

.download-card-qr-label {
  font-size: 0.65rem;
  color: rgba(191, 219, 254, 0.6);
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.download-card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.download-card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  border-radius: 0.6rem;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  width: 100%;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &-android {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    &:hover {
      background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
      transform: scale(1.02);
    }
  }

  &-ios {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    &:hover {
      background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
      transform: scale(1.02);
    }
  }

  &-label {
    display: block;
    font-size: 0.6rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  &-store {
    display: block;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.1;
  }
}

.download-card-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.download-card-meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.65rem;
  color: rgba(191, 219, 254, 0.6);

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
}

/* Phone Mockup */
.download-phone-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.download-phone-glow {
  position: absolute;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
  filter: blur(40px);
  animation: phoneGlow 4s ease-in-out infinite;
}

@keyframes phoneGlow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.download-phone {
  position: relative;
  z-index: 1;
}

/* 03.10: CSS telefon ramkasi — ekranda mobil ilova Bosh sahifasi skrinshoti */
.download-phone-frame {
  position: relative;
  width: 250px;
  padding: 10px;
  border-radius: 44px;
  background: linear-gradient(145deg, #3a4150 0%, #12151c 55%, #262b36 100%);
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.08),
    0 0 0 1px rgba(148, 163, 184, 0.25),
    0 30px 60px rgba(0, 0, 0, 0.45);
  animation: phoneFloat 6s ease-in-out infinite;

  /* yon tugmalar */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 3px;
    border-radius: 2px;
    background: #2a2f3a;
  }

  &::before {
    right: -3px;
    top: 120px;
    height: 64px;
  }

  &::after {
    left: -3px;
    top: 100px;
    height: 40px;
  }
}

.download-phone-screen {
  position: relative;
  width: 230px;
  height: 484px;
  border-radius: 34px;
  overflow: hidden;
  background: #ffffff;
}

.download-phone-screen-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.download-phone-camera {
  position: absolute;
  top: 16px;
  left: 50%;
  width: 10px;
  height: 10px;
  margin-left: -5px;
  border-radius: 9999px;
  background: #0b0d12;
  box-shadow: inset 0 0 0 2px #1f2430;
}

@keyframes phoneFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Floating Elements */
.download-float {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
  z-index: 2;

  svg {
    width: 1rem;
    height: 1rem;
  }

  &-1 {
    top: 20%;
    right: 10%;
    animation: float1 5s ease-in-out infinite;
  }

  &-2 {
    bottom: 25%;
    left: 5%;
    animation: float2 6s ease-in-out infinite;
  }
}

@keyframes float1 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
}

@keyframes float2 {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(-3deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .download-title {
    font-size: 2.5rem;
  }

  .download-phone-wrapper {
    display: none;
  }
}

@media (max-width: 768px) {
  .download-section {
    padding: 3rem 0;
  }

  .download-title {
    font-size: 1.75rem;
  }

  .download-description {
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
  }

  .download-stats {
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .download-stat-divider {
    display: none;
  }

  .download-stat {
    min-width: calc(33% - 0.75rem);
  }

  .download-stat-value {
    font-size: 1.25rem;
  }

  .download-cards {
    flex-direction: column;
    gap: 0.75rem;
  }

  .download-card-premium {
    flex-direction: row;
    padding: 0.75rem;
  }

  .download-card-qr {
    margin-bottom: 0;
    margin-right: 0.75rem;
    padding: 0.5rem;
  }

  .download-card-qr-inner {
    width: 70px;
    height: 70px;
  }

  .download-card-qr-label {
    display: none;
  }

  .download-card-info {
    align-items: flex-start;
  }

  .download-card-btn {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .download-title {
    font-size: 1.5rem;
  }

  .download-description {
    font-size: 0.875rem;
  }

  .download-stats {
    padding: 0.75rem;
  }

  .download-stat-value {
    font-size: 1.125rem;
  }

  .download-card-qr-inner {
    width: 60px;
    height: 60px;
  }
}
</style>
