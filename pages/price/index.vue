<template>
  <div class="pb-8">
    <!-- Header -->
    <div class="text-center mb-8 mt-4">
      <h1 class="text-3xl font-bold text-gray-900">{{ texts.title }}</h1>
      <p class="mt-3 text-gray-500 max-w-2xl mx-auto">{{ texts.subtitle }}</p>
    </div>

    <!-- Joriy tarif badge -->
    <div v-if="currentPlan !== 'free'" class="flex justify-center mb-6">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        {{ texts.currentPlan }}: {{ currentPlan === 'start' ? 'Start' : 'Premium' }}
        <span v-if="smsRemaining !== null" class="ml-1">({{ smsRemaining }} SMS {{ texts.remaining }})</span>
      </div>
    </div>

    <!-- Tarif kartochkalari -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">

      <!-- FREE -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div class="p-6 flex-1">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full uppercase">Free</span>
            <div class="mt-4">
              <span class="text-4xl font-bold text-gray-900">0</span>
              <span class="text-gray-500 ml-1">UZS</span>
            </div>
            <p class="mt-2 text-sm text-gray-500">{{ texts.freeDesc }}</p>
          </div>

          <ul class="mt-6 space-y-3">
            <li v-for="f in freeFeatures" :key="f" class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm text-gray-700">{{ f }}</span>
            </li>
            <li v-for="f in freeDisabled" :key="f" class="flex items-start gap-3 opacity-40">
              <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm text-gray-400 line-through">{{ f }}</span>
            </li>
          </ul>
        </div>

        <div class="p-6 pt-0">
          <button disabled class="w-full py-3 bg-gray-100 text-gray-500 font-semibold rounded-xl cursor-default">
            {{ currentPlan === 'free' ? texts.currentPlanBtn : texts.freeBtn }}
          </button>
        </div>
      </div>

      <!-- START -->
      <div class="bg-white rounded-2xl shadow-lg border-2 border-blue-500 overflow-hidden flex flex-col relative">
        <div class="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-wide">
          {{ texts.popular }}
        </div>
        <div class="p-6 pt-10 flex-1">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase">Start</span>
            <div class="mt-4">
              <span class="text-4xl font-bold text-gray-900">99 000</span>
              <span class="text-gray-500 ml-1">UZS</span>
            </div>
            <p class="mt-1 text-sm text-blue-600 font-medium">500 SMS {{ texts.included }}</p>
            <p class="mt-1 text-xs text-gray-400">{{ texts.perSms }}: 198 UZS</p>
          </div>

          <ul class="mt-6 space-y-3">
            <li v-for="f in startFeatures" :key="f" class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm text-gray-700">{{ f }}</span>
            </li>
            <li v-for="f in startDisabled" :key="f" class="flex items-start gap-3 opacity-40">
              <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm text-gray-400 line-through">{{ f }}</span>
            </li>
          </ul>
        </div>

        <div class="p-6 pt-0">
          <button
            v-if="currentPlan !== 'start' && currentPlan !== 'premium'"
            @click="purchasePlan('start')"
            :disabled="purchasing"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {{ purchasing ? texts.processing : texts.buyBtn }}
          </button>
          <button v-else-if="currentPlan === 'start'" disabled class="w-full py-3 bg-green-100 text-green-700 font-semibold rounded-xl cursor-default">
            {{ texts.currentPlanBtn }}
          </button>
          <button
            v-else
            disabled
            class="w-full py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-default"
          >
            {{ texts.hasHigherPlan }}
          </button>
        </div>
      </div>

      <!-- PREMIUM -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div class="p-6 flex-1">
          <div class="text-center">
            <span class="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full uppercase">Premium</span>
            <div class="mt-4">
              <span class="text-4xl font-bold text-gray-900">199 000</span>
              <span class="text-gray-500 ml-1">UZS</span>
            </div>
            <p class="mt-1 text-sm text-purple-600 font-medium">1 100 SMS {{ texts.included }}</p>
            <p class="mt-1 text-xs text-gray-400">{{ texts.perSms }}: 181 UZS</p>
          </div>

          <ul class="mt-6 space-y-3">
            <li v-for="f in premiumFeatures" :key="f" class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm text-gray-700">{{ f }}</span>
            </li>
          </ul>
        </div>

        <div class="p-6 pt-0">
          <button
            v-if="currentPlan !== 'premium'"
            @click="purchasePlan('premium')"
            :disabled="purchasing"
            class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {{ purchasing ? texts.processing : texts.buyBtn }}
          </button>
          <button v-else disabled class="w-full py-3 bg-green-100 text-green-700 font-semibold rounded-xl cursor-default">
            {{ texts.currentPlanBtn }}
          </button>
        </div>
      </div>
    </div>

    <!-- Qo'shimcha SMS paketlar -->
    <div v-if="currentPlan === 'start' || currentPlan === 'premium'" class="max-w-5xl mx-auto px-4 mt-12">
      <h2 class="text-xl font-bold text-gray-900 mb-4 text-center">{{ texts.addonTitle }}</h2>
      <p class="text-sm text-gray-500 text-center mb-6">{{ texts.addonDesc }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-for="pkg in addonPackages" :key="pkg.name"
          class="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-md transition-shadow">
          <div class="text-2xl font-bold text-gray-900">{{ pkg.sms }}</div>
          <div class="text-sm text-gray-500 mb-3">SMS</div>
          <div class="text-lg font-semibold text-blue-600 mb-4">{{ formatPrice(pkg.price) }} UZS</div>
          <button
            @click="purchaseAddon(pkg.name)"
            :disabled="purchasing"
            class="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {{ texts.buyAddon }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'auth',

  data() {
    return {
      currentPlan: 'free',
      smsRemaining: null,
      purchasing: false,
      addonPackages: [
        { name: 'small', sms: 200, price: 35000 },
        { name: 'medium', sms: 500, price: 75000 },
        { name: 'large', sms: 1000, price: 130000 },
      ],
    };
  },

  computed: {
    texts() {
      const locale = this.$i18n?.locale || 'uz';
      const t = {
        uz: {
          title: 'Qarz daftari tariflari',
          subtitle: "O'zingizga mos tarifni tanlang va qarzdorlarni samarali boshqaring",
          currentPlan: 'Joriy tarif',
          remaining: 'qoldi',
          freeDesc: 'Asosiy imkoniyatlar bepul',
          popular: 'Mashhur',
          included: 'kiritilgan',
          perSms: 'Bitta SMS',
          buyBtn: 'Sotib olish',
          freeBtn: 'Bepul',
          currentPlanBtn: 'Joriy tarif',
          hasHigherPlan: 'Yuqori tarif faol',
          processing: 'Jarayonda...',
          addonTitle: "Qo'shimcha SMS paketlar",
          addonDesc: "SMS tugasa, tarif o'zgartirmasdan qo'shimcha paket oling",
          buyAddon: 'Sotib olish',
          // Free features
          f_unlimited: 'Cheksiz qarz qo\'shish',
          f_payment: 'To\'lovlarni qayd etish',
          f_telegram: 'Telegram eslatma',
          f_reg_sms: 'Ro\'yxatga olish SMS (tizim)',
          f_self_sms: 'Eslatma SMS (o\'zi yuboradi)',
          // Start features
          f_auto_sms: 'Avtomatik SMS eslatma',
          f_manual_sms: 'Qo\'lda SMS yuborish',
          f_sms_history: 'SMS tarixi va statistika',
          f_templates: 'Eslatma shablonlari (3 xil)',
          f_rating: 'Qarzdor ishonchlilik reytingi',
          f_pay_link: 'Qarzdorga to\'lov havolasi',
          f_interest: 'Foiz avtomatik hisoblash',
          f_pdf: 'PDF hisobot',
          // Premium features
          f_excel: 'Excel eksport',
          f_analytics: 'Grafik va analitika',
          f_schedule: 'Eslatma jadvali sozlash',
          f_group: 'Guruh/oila daftari',
          f_support: 'Ustuvor qo\'llab-quvvatlash',
        },
        ru: {
          title: 'Тарифы долговой книги',
          subtitle: 'Выберите подходящий тариф и эффективно управляйте должниками',
          currentPlan: 'Текущий тариф',
          remaining: 'осталось',
          freeDesc: 'Основные возможности бесплатно',
          popular: 'Популярный',
          included: 'включено',
          perSms: 'Одно SMS',
          buyBtn: 'Купить',
          freeBtn: 'Бесплатно',
          currentPlanBtn: 'Текущий тариф',
          hasHigherPlan: 'Высший тариф активен',
          processing: 'Обработка...',
          addonTitle: 'Дополнительные SMS пакеты',
          addonDesc: 'Если SMS закончились, купите дополнительный пакет',
          buyAddon: 'Купить',
          f_unlimited: 'Неограниченное добавление долгов',
          f_payment: 'Учёт платежей',
          f_telegram: 'Telegram напоминания',
          f_reg_sms: 'SMS при регистрации долга',
          f_self_sms: 'SMS напоминание (отправляет сам)',
          f_auto_sms: 'Автоматические SMS напоминания',
          f_manual_sms: 'Ручная отправка SMS',
          f_sms_history: 'История и статистика SMS',
          f_templates: 'Шаблоны напоминаний (3 вида)',
          f_rating: 'Рейтинг надёжности должника',
          f_pay_link: 'Ссылка на оплату для должника',
          f_interest: 'Автоматический расчёт процентов',
          f_pdf: 'PDF отчёт',
          f_excel: 'Excel экспорт',
          f_analytics: 'Графики и аналитика',
          f_schedule: 'Настройка расписания напоминаний',
          f_group: 'Групповая/семейная книга',
          f_support: 'Приоритетная поддержка',
        },
        kr: {
          title: 'Қарз дафтари тарифлари',
          subtitle: 'Ўзингизга мос тарифни танланг ва қарздорларни самарали бошқаринг',
          currentPlan: 'Жорий тариф',
          remaining: 'қолди',
          freeDesc: 'Асосий имкониятлар бепул',
          popular: 'Машҳур',
          included: 'киритилган',
          perSms: 'Битта SMS',
          buyBtn: 'Сотиб олиш',
          freeBtn: 'Бепул',
          currentPlanBtn: 'Жорий тариф',
          hasHigherPlan: 'Юқори тариф фаол',
          processing: 'Жараёнда...',
          addonTitle: 'Қўшимча SMS пакетлар',
          addonDesc: 'SMS тугаса, тариф ўзгартирмасдан қўшимча пакет олинг',
          buyAddon: 'Сотиб олиш',
          f_unlimited: 'Чексиз қарз қўшиш',
          f_payment: 'Тўловларни қайд этиш',
          f_telegram: 'Telegram эслатма',
          f_reg_sms: 'Рўйхатга олиш SMS (тизим)',
          f_self_sms: 'Эслатма SMS (ўзи юборади)',
          f_auto_sms: 'Автоматик SMS эслатма',
          f_manual_sms: 'Қўлда SMS юбориш',
          f_sms_history: 'SMS тарихи ва статистика',
          f_templates: 'Эслатма шаблонлари (3 хил)',
          f_rating: 'Қарздор ишончлилик рейтинги',
          f_pay_link: 'Қарздорга тўлов ҳаволаси',
          f_interest: 'Фоиз автоматик ҳисоблаш',
          f_pdf: 'PDF ҳисобот',
          f_excel: 'Excel экспорт',
          f_analytics: 'График ва аналитика',
          f_schedule: 'Эслатма жадвали созлаш',
          f_group: 'Гуруҳ/оила дафтари',
          f_support: 'Устувор қўллаб-қувватлаш',
        },
      };
      return t[locale] || t.uz;
    },

    freeFeatures() {
      const t = this.texts;
      return [t.f_unlimited, t.f_payment, t.f_telegram, t.f_reg_sms, t.f_self_sms];
    },
    freeDisabled() {
      const t = this.texts;
      return [t.f_auto_sms, t.f_rating, t.f_pay_link, t.f_analytics];
    },
    startFeatures() {
      const t = this.texts;
      return [
        t.f_unlimited, t.f_payment, t.f_telegram, t.f_reg_sms, t.f_self_sms,
        t.f_auto_sms, t.f_manual_sms, t.f_sms_history, t.f_templates,
        t.f_rating, t.f_pay_link, t.f_interest, t.f_pdf,
      ];
    },
    startDisabled() {
      const t = this.texts;
      return [t.f_excel, t.f_analytics, t.f_schedule, t.f_group];
    },
    premiumFeatures() {
      const t = this.texts;
      return [
        t.f_unlimited, t.f_payment, t.f_telegram, t.f_reg_sms, t.f_self_sms,
        t.f_auto_sms, t.f_manual_sms, t.f_sms_history, t.f_templates,
        t.f_rating, t.f_pay_link, t.f_interest, t.f_pdf,
        t.f_excel, t.f_analytics, t.f_schedule, t.f_group, t.f_support,
      ];
    },
  },

  async mounted() {
    if (this.$auth.user.is_active == 1 && this.$auth.user.is_contract == 0) {
      return this.$router.push(this.localePath({ name: 'universal_contract' }));
    }
    await this.loadSubscription();
  },

  methods: {
    formatPrice(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },

    async loadSubscription() {
      try {
        const res = await this.$axios.$get('/finance/subscription', { silent: true });
        if (res?.success) {
          this.currentPlan = res.data.subscription.plan;
          this.smsRemaining = res.data.sms.remaining;
        }
      } catch (_) {}
    },

    async purchasePlan(plan) {
      this.purchasing = true;
      try {
        // Click/Payme to'lov URL olish
        const res = await this.$axios.post('/finance/payment/create-subscription', {
          plan,
          payment_method: 'click',
        });

        if (res.data.success && res.data.data?.payment_url) {
          // Click/Payme sahifasiga yo'naltirish
          window.location.href = res.data.data.payment_url;
          return;
        }
        this.$toast.error(res.data.message || 'Xatolik');
      } catch (e) {
        this.$toast.error('Xatolik yuz berdi');
      } finally {
        this.purchasing = false;
      }
    },

    async purchaseAddon(packageName) {
      this.purchasing = true;
      try {
        const res = await this.$axios.post('/finance/payment/create-sms-package', {
          package_name: packageName,
          payment_method: 'click',
        });

        if (res.data.success && res.data.data?.payment_url) {
          window.location.href = res.data.data.payment_url;
          return;
        }
        this.$toast.error(res.data.message || 'Xatolik');
      } catch (e) {
        this.$toast.error('Xatolik yuz berdi');
      } finally {
        this.purchasing = false;
      }
    },
  },
};
</script>
