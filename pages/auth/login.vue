<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Forgot Password Modal -->
    <div v-if="idenNotification" class="iden-modal-overlay" @click.self="removeIdenModal">
      <div class="iden-modal-container">
        <div class="iden-modal-header">
          <div class="iden-icon-wrapper">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <button @click="removeIdenModal" class="iden-close-btn">
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
            <a href="https://play.google.com/store/apps/details?id=com.zeroxuz" target="_blank" class="iden-store-btn">
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
            <a href="https://apps.apple.com/uz/app/zerox/id6446497826" target="_blank" class="iden-store-btn">
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
          <button @click="removeIdenModal" class="iden-btn-close">{{ modalTexts.closeBtn }}</button>
        </div>
      </div>
    </div>

    <!-- Left Panel - Form -->
    <div class="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-12">
      <div class="mx-auto w-full max-w-lg">
        <!-- Logo -->
        <div class="text-center mb-10">
          <nuxt-link :to="localePath({ name: 'index' })" class="inline-block">
            <img
              v-if="$i18n.locale == 'ru'"
              src="@/assets/img/logo_ru.svg"
              alt="ZeroX"
              class="h-32 mx-auto"
            />
            <img
              v-else-if="$i18n.locale == 'kr'"
              src="@/assets/img/logo_kr.svg"
              alt="ZeroX"
              class="h-32 mx-auto"
            />
            <img
              v-else
              src="@/assets/img/logo.svg"
              alt="ZeroX"
              class="h-32 mx-auto"
            />
          </nuxt-link>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900">{{ texts.title }}</h1>
            <p class="mt-2 text-gray-500">{{ texts.subtitle }}</p>
          </div>

          <form @submit.prevent="loginUser" class="space-y-6">
            <!-- Phone -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ texts.phoneLabel }}
              </label>
              <div class="relative">
                <input
                  v-model="login.phone"
                  @input="removeSpace"
                  @keydown.enter="loginUser"
                  v-mask="'+998 ## ### ## ##'"
                  type="tel"
                  class="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-sm outline-none transition-all duration-200"
                  :class="!$v.login.phone.required && check2 ? 'border-red-400 bg-red-50' : ''"
                  placeholder="+998 __ ___ __ __"
                />
                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none hidden">
                  <span class="text-gray-400">+998</span>
                </div>
              </div>
              <p v-if="!$v.login.phone.required && check2" class="mt-2 text-sm text-red-500 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ texts.phoneError }}
              </p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ texts.passwordLabel }}
              </label>
              <div class="relative">
                <input
                  ref="password"
                  v-model="login.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:shadow-sm outline-none transition-all duration-200"
                  :class="!$v.login.password.required && check2 ? 'border-red-400 bg-red-50' : ''"
                  :placeholder="texts.passwordPlaceholder"
                  @keyup="keyupPassword"
                  @keydown.enter="loginUser"
                />
                <button
                  type="button"
                  @click="togglePassword"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p v-if="!$v.login.password.required && check2" class="mt-2 text-sm text-red-500 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ texts.passwordError }}
              </p>
            </div>

            <!-- Forgot Password -->
            <div class="flex justify-end">
              <button type="button" @click="moddal()" class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                {{ texts.forgotPassword }}
              </button>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ texts.loginButton }}
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">{{ texts.or }}</span>
            </div>
          </div>

          <!-- Register Link -->
          <div class="text-center">
            <span class="text-gray-500">{{ texts.noAccount }}</span>
            <nuxt-link
              :to="localePath({ name: 'auth-register' })"
              class="ml-1 text-blue-600 hover:text-blue-700 font-semibold"
            >
              {{ texts.register }}
            </nuxt-link>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="mt-8 text-center">
          <nuxt-link
            :to="localePath({ name: 'index' })"
            class="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ texts.backHome }}
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- Right Panel - Testimonials Slider -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 items-center justify-center relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div class="absolute bottom-20 right-20 w-48 h-48 border-2 border-white rounded-full"></div>
        <div class="absolute top-1/2 left-1/4 w-24 h-24 border-2 border-white rounded-full"></div>
      </div>

      <div class="max-w-lg text-white text-center relative z-10">
        <!-- Title -->
        <h2 class="text-3xl font-bold mb-4">{{ texts.panel.title }}</h2>
        <p class="text-blue-100 text-lg mb-10">{{ texts.panel.subtitle }}</p>

        <!-- Testimonials Slider -->
        <div class="relative">
          <div class="testimonial-card bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div class="flex items-center justify-center mb-4">
              <div class="flex -space-x-1">
                <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <p class="text-white text-lg italic mb-6">"{{ currentTestimonial.text }}"</p>
            <div class="flex items-center justify-center">
              <div class="w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg" style="background-color: rgba(255,255,255,0.9)">
                {{ currentTestimonial.initials }}
              </div>
              <div class="ml-4 text-left">
                <p class="font-semibold">{{ currentTestimonial.name }}</p>
              </div>
            </div>
          </div>

          <!-- Slider Dots -->
          <div class="flex items-center justify-center space-x-2">
            <button
              v-for="(_, index) in testimonials"
              :key="index"
              @click="currentSlide = index"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="currentSlide === index ? 'bg-white w-6' : 'bg-white bg-opacity-40'"
            ></button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white border-opacity-20">
          <div class="text-center">
            <p class="text-3xl font-bold">1K+</p>
            <p class="text-blue-200 text-sm">{{ texts.panel.stats.users }}</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold">200+</p>
            <p class="text-blue-200 text-sm">{{ texts.panel.stats.contracts }}</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold">100%</p>
            <p class="text-blue-200 text-sm">{{ texts.panel.stats.satisfaction }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueTelInput } from "vue-tel-input";
import { required } from "vuelidate/lib/validators";
import VueQr from "vue-qr";

export default {
  name: 'LoginPage',
  auth: false,
  components: { VueTelInput, VueQr },

  data() {
    return {
      idenNotification: false,
      showPassword: false,
      isLoading: false,
      login: { phone: "", password: "" },
      check2: false,
      currentSlide: 0,
      slideInterval: null,
    };
  },

  created() {
    this.$store.commit("changeBreadCrumb", [{ title: this.$t('login.title') || "Kirish", name: "auth-login" }]);
  },

  mounted() {
    this.startSlider();
  },

  beforeDestroy() {
    if (this.slideInterval) clearInterval(this.slideInterval);
  },

  validations: {
    login: {
      phone: { required },
      password: { required },
    },
  },

  computed: {
    testimonials() {
      const locale = this.$i18n?.locale || 'uz';
      const data = {
        uz: [
          { text: "ZeroX orqali do'stimga qarz berdim. Shartnoma tuzildi, hamma narsa rasmiy. Endi hech qanday muammo yo'q.", name: "Aziz Karimov", role: "Tadbirkor", initials: "AK" },
          { text: "Oldin qarz berishdan qo'rqardim. Endi ZeroX bilan xavfsiz. Shartnoma ikki tomonlama tasdiqlanadi.", name: "Malika Rahimova", role: "Buxgalter", initials: "MR" },
          { text: "Mobil ilova juda qulay. Istalgan joydan shartnoma tuzish mumkin. Tavsiya qilaman!", name: "Jasur Toshmatov", role: "Dasturchi", initials: "JT" },
          { text: "To'lov muddati yaqinlashganda eslatma keladi. Hech qachon unutmayman. Zo'r xizmat!", name: "Nilufar Saidova", role: "O'qituvchi", initials: "NS" },
          { text: "Qarzdorlar ro'yxatini bir joyda ko'rish juda qulay. QR kod orqali tez qidirish ajoyib.", name: "Bobur Aliyev", role: "Savdogar", initials: "BA" },
          { text: "Bir yilda 20 dan ortiq shartnoma tuzdim. Barchasi rasmiylashtirilgan. Rahmat ZeroX!", name: "Sardor Qodirov", role: "Fermer", initials: "SQ" },
          { text: "Oilaviy qarz muammolarini hal qildik. Endi hamma narsa hujjatlashtirilgan.", name: "Gulnora Mahmudova", role: "Uy bekasi", initials: "GM" },
          { text: "Biznes uchun ajoyib platforma. Hamkorlar bilan qarz munosabatlarini boshqarish oson bo'ldi.", name: "Timur Nazarov", role: "Biznesmen", initials: "TN" },
          { text: "Xavfsizlik darajasi yuqori. Ma'lumotlarim himoyalangan. Ishonchli platforma.", name: "Kamola Umarova", role: "Advokat", initials: "KU" },
          { text: "3 yildan beri foydalanaman. Hech qanday muammo bo'lmadi. Eng yaxshi xizmat!", name: "Rustam Ergashev", role: "Menejer", initials: "RE" }
        ],
        ru: [
          { text: "Через ZeroX дал в долг другу. Договор оформлен, всё официально. Теперь никаких проблем.", name: "Азиз Каримов", role: "Предприниматель", initials: "АК" },
          { text: "Раньше боялся давать в долг. Теперь с ZeroX безопасно. Договор подтверждается двумя сторонами.", name: "Малика Рахимова", role: "Бухгалтер", initials: "МР" },
          { text: "Мобильное приложение очень удобное. Можно создать договор откуда угодно. Рекомендую!", name: "Жасур Тошматов", role: "Программист", initials: "ЖТ" },
          { text: "Приходит напоминание когда приближается срок оплаты. Никогда не забуду. Отличный сервис!", name: "Нилуфар Саидова", role: "Учитель", initials: "НС" },
          { text: "Очень удобно видеть список должников в одном месте. Быстрый поиск по QR-коду - супер.", name: "Бобур Алиев", role: "Торговец", initials: "БА" },
          { text: "За год оформил более 20 договоров. Всё документировано. Спасибо ZeroX!", name: "Сардор Кодиров", role: "Фермер", initials: "СК" },
          { text: "Решили семейные долговые вопросы. Теперь всё задокументировано.", name: "Гульнора Махмудова", role: "Домохозяйка", initials: "ГМ" },
          { text: "Отличная платформа для бизнеса. Управлять долговыми отношениями с партнёрами стало легко.", name: "Тимур Назаров", role: "Бизнесмен", initials: "ТН" },
          { text: "Высокий уровень безопасности. Мои данные защищены. Надёжная платформа.", name: "Камола Умарова", role: "Адвокат", initials: "КУ" },
          { text: "Пользуюсь уже 3 года. Никаких проблем не было. Лучший сервис!", name: "Рустам Эргашев", role: "Менеджер", initials: "РЭ" }
        ],
        kr: [
          { text: "ZeroX орқали дўстимга қарз бердим. Шартнома тузилди, ҳамма нарса расмий. Энди ҳеч қандай муаммо йўқ.", name: "Азиз Каримов", role: "Тадбиркор", initials: "АК" },
          { text: "Олдин қарз беришдан қўрқардим. Энди ZeroX билан хавфсиз. Шартнома икки томонлама тасдиқланади.", name: "Малика Раҳимова", role: "Бухгалтер", initials: "МР" },
          { text: "Мобил илова жуда қулай. Исталган жойдан шартнома тузиш мумкин. Тавсия қиламан!", name: "Жасур Тошматов", role: "Дастурчи", initials: "ЖТ" },
          { text: "Тўлов муддати яқинлашганда эслатма келади. Ҳеч қачон унутмайман. Зўр хизмат!", name: "Нилуфар Саидова", role: "Ўқитувчи", initials: "НС" },
          { text: "Қарздорлар рўйхатини бир жойда кўриш жуда қулай. QR код орқали тез қидириш ажойиб.", name: "Бобур Алиев", role: "Савдогар", initials: "БА" },
          { text: "Бир йилда 20 дан ортиқ шартнома туздим. Барчаси расмийлаштирилган. Раҳмат ZeroX!", name: "Сардор Қодиров", role: "Фермер", initials: "СҚ" },
          { text: "Оилавий қарз муаммоларини ҳал қилдик. Энди ҳамма нарса ҳужжатлаштирилган.", name: "Гулнора Маҳмудова", role: "Уй бекаси", initials: "ГМ" },
          { text: "Бизнес учун ажойиб платформа. Ҳамкорлар билан қарз муносабатларини бошқариш осон бўлди.", name: "Тимур Назаров", role: "Бизнесмен", initials: "ТН" },
          { text: "Хавфсизлик даражаси юқори. Маълумотларим ҳимояланган. Ишончли платформа.", name: "Камола Умарова", role: "Адвокат", initials: "КУ" },
          { text: "3 йилдан бери фойдаланаман. Ҳеч қандай муаммо бўлмади. Энг яхши хизмат!", name: "Рустам Эргашев", role: "Менежер", initials: "РЭ" }
        ]
      };
      return data[locale] || data.uz;
    },

    currentTestimonial() {
      return this.testimonials[this.currentSlide] || this.testimonials[0];
    },

    texts() {
      const locale = this.$i18n?.locale || 'uz';
      const translations = {
        uz: {
          title: 'Tizimga kirish',
          subtitle: 'Shaxsiy kabinetingizga kiring',
          phoneLabel: 'Telefon raqamingiz',
          phoneError: 'Telefon raqamini kiriting',
          passwordLabel: 'Parol',
          passwordPlaceholder: 'Parolingizni kiriting',
          passwordError: 'Parolni kiriting',
          forgotPassword: 'Parolni unutdingizmi?',
          loginButton: 'Kirish',
          or: 'yoki',
          noAccount: "Shaxsiy kabinetingiz yo'qmi?",
          register: "Ro'yxatdan o'tish",
          backHome: 'Bosh sahifaga qaytish',
          panel: {
            title: 'Xush kelibsiz!',
            subtitle: "1000+ foydalanuvchi bizga ishonadi",
            stats: {
              users: 'Foydalanuvchilar',
              contracts: 'Shartnomalar',
              satisfaction: 'Ishonchlilik'
            }
          }
        },
        ru: {
          title: 'Вход в систему',
          subtitle: 'Войдите в личный кабинет',
          phoneLabel: 'Номер телефона',
          phoneError: 'Введите номер телефона',
          passwordLabel: 'Пароль',
          passwordPlaceholder: 'Введите пароль',
          passwordError: 'Введите пароль',
          forgotPassword: 'Забыли пароль?',
          loginButton: 'Войти',
          or: 'или',
          noAccount: 'Нет личного кабинета?',
          register: 'Зарегистрироваться',
          backHome: 'На главную',
          panel: {
            title: 'Добро пожаловать!',
            subtitle: 'Более 1000 пользователей доверяют нам',
            stats: {
              users: 'Пользователей',
              contracts: 'Договоров',
              satisfaction: 'Надёжность'
            }
          }
        },
        kr: {
          title: 'Тизимга кириш',
          subtitle: 'Шахсий кабинетингизга киринг',
          phoneLabel: 'Телефон рақамингиз',
          phoneError: 'Телефон рақамини киритинг',
          passwordLabel: 'Парол',
          passwordPlaceholder: 'Паролингизни киритинг',
          passwordError: 'Паролни киритинг',
          forgotPassword: 'Паролни унутдингизми?',
          loginButton: 'Кириш',
          or: 'ёки',
          noAccount: "Шахсий кабинетингиз йўқми?",
          register: "Рўйхатдан ўтиш",
          backHome: 'Бош саҳифага қайтиш',
          panel: {
            title: 'Хуш келибсиз!',
            subtitle: "1000+ фойдаланувчи бизга ишонади",
            stats: {
              users: 'Фойдаланувчилар',
              contracts: 'Шартномалар',
              satisfaction: 'Ишончлилик'
            }
          }
        }
      };
      return translations[locale] || translations.uz;
    },

    modalTexts() {
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
    startSlider() {
      this.slideInterval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
      }, 5000);
    },

    moddal() {
      this.idenNotification = true;
    },
    removeIdenModal() { clearTimeout(this.timeoutFunc); this.idenNotification = false; },
    removeSpace(e) {
      if (typeof e === 'object' && e.target) {
        this.login.phone = e.target.value.trim();
      } else {
        this.login.phone = String(e).trim();
      }
    },
    keyupPassword(e) { e.target.value = e.target.value.trim(); },
    togglePassword() { this.showPassword = !this.showPassword; },

    /**
     * Login arxivini saqlash
     * IP va geo ma'lumotlarni backend tomonidan olish xavfsizroq
     * Tashqi API (ipapi.co) o'rniga backend'ga so'rov yuboramiz
     */
    async sendArchiveData() {
      try {
        await this.$axios.post("/user/archive", {
          device: "ZeroX Web",
          userAgent: navigator.userAgent || "Unknown",
          screenResolution: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
          language: navigator.language || "uz",
        });
      } catch (error) {
        // Archive xatosi login jarayonini to'xtatmasligi kerak - silent fail
      }
    },

    async loginUser() {
      // Agar allaqachon yuborilayotgan bo'lsa, qayta yuborishning oldini ol
      if (this.isLoading) return;

      this.$v.login.$touch();
      this.check2 = true;
      if (this.$v.login.$invalid) return;

      this.isLoading = true;
      try {
        const currentLanguage = this.$i18n?.locale || 'uz';
        const phone = this.login.phone.split("").filter(el => el !== " ").join("");

        const response = await this.$auth.loginWith("local", {
          data: { phone, password: this.login.password },
        });

        if (response.status == 200) {
          if (response.data.success === false) {
            const msg = response.data.message;
            if (msg === "user-nft") {
              this.$toast.error(this.$t("a1.a91"));
              return this.$router.push(this.localePath({ name: 'auth-register' }));
            }
            if (msg === "invalid-password") {
              return this.$toast.error(`${this.$t("menu.invalid_password")}${response.data.attemptsLeft}.`);
            }
            if (msg === "user-not-found") return this.$toast.error(this.$t("a1.a87"));
            if (msg === "error") return this.$toast.error(this.$t("debt_list.a70"));
          }
          if (response.data.blocked === true) return this.$toast.error(this.$t("menu.account_blocked"));

          if (response.data.success === true) {
            this.$i18n?.setLocaleCookie?.(currentLanguage);
            localStorage.setItem('app-language', currentLanguage);
            this.sendArchiveData();
            this.$router.push(this.localePath({ name: 'index' }));
          }
        }
      } catch (err) {
        // HTTP status kodiga qarab xabar ko'rsatish
        const status = err.response?.status;

        if (status === 429) {
          // Rate limiting - juda ko'p so'rov
          this.$toast.error(this.$t("errors.too_many_requests") || "Juda ko'p so'rov. Biroz kuting.");
        } else if (status === 401) {
          // Noto'g'ri login ma'lumotlari
          this.$toast.error(this.$t("login.wrong_credentials") || "Telefon raqami yoki parol noto'g'ri.");
        } else if (status === 400) {
          // Validation xatosi
          const message = err.response?.data?.message;
          this.$toast.error(message || this.$t("errors.validation_error") || "Ma'lumotlarni tekshiring.");
        } else if (!err.response) {
          // Network xatosi
          this.$toast.error(this.$t("errors.network_error") || "Internet aloqasini tekshiring.");
        } else {
          // Boshqa xatolar
          this.$toast.error(this.$t("errors.server_error") || "Server xatosi. Qayta urinib ko'ring.");
        }
      } finally {
        this.isLoading = false;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.phone-input {
  ::v-deep .vue-tel-input {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;

    input {
      @apply text-gray-900 placeholder-gray-400;
      padding: 1rem;
      font-size: 1rem;
      background: transparent !important;
    }

    .vti__dropdown {
      @apply bg-transparent;
      padding: 0.75rem;
    }

    .vti__dropdown-list {
      @apply rounded-xl shadow-lg border border-gray-200;
    }
  }
}

.testimonial-card {
  min-height: 200px;
  transition: all 0.3s ease;
}

/* Forgot Password Modal Styles */
.iden-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
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

.iden-modal-container {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: idenSlideUp 0.3s ease-out;
  overflow: hidden;
}

.iden-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0;
}

.iden-icon-wrapper {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 1rem;
}

.iden-close-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  border-radius: 0.75rem;
  transition: all 0.2s;
  cursor: pointer;
  background: transparent;
  border: none;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
}

.iden-modal-content {
  padding: 1.25rem 1.5rem;
  text-align: center;
}

.iden-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.iden-modal-text {
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
}

.iden-store-section {
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.iden-store-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
}

.iden-qr-wrapper {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.iden-store-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: #111827;
  color: white;
  border-radius: 0.75rem;
  transition: all 0.2s;
  text-decoration: none;
  flex: 1;

  &:hover {
    background: #1f2937;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.iden-store-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.iden-store-label {
  font-size: 0.65rem;
  opacity: 0.8;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.iden-store-name {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
}

.iden-modal-footer {
  padding: 1.5rem;
}

.iden-btn-close {
  width: 100%;
  padding: 0.875rem;
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  font-size: 0.9375rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;

  &:hover {
    background: #e5e7eb;
  }
}

@media (max-width: 480px) {
  .iden-modal-container {
    max-width: 100%;
    margin: 0 1rem;
    border-radius: 1.25rem;
  }

  .iden-qr-wrapper {
    display: none;
  }

  .iden-store-item {
    padding: 0;
    background: transparent;
    border: none;
  }

  .iden-store-btn {
    width: 100%;
    padding: 1rem 1.25rem;
  }
}
</style>
