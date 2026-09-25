<template>
  <!-- SS-DEV (2026-09-24), hujjat-4 1-band: Telegram Mini App PIN-kod ekrani.
       Faqat Mini App ichida (plugin `pin_required` olganda) ochiladi. Oddiy brauzerda
       ticket bo'lmaydi — login sahifasiga qaytariladi. Raqamli klaviatura uslubidagi
       ixcham forma: o'rnatish (2 marta) / kiritish; 5 xato → 15 daqiqa blok (backend).
       SS-DEV (2026-09-26), 25.09 hujjat 6-band — "PIN-kodni unutdingizmi?": POST /telegram/auth/pin/forgot
       {ticket} → {success, phone_masked, ttl} → 6 raqamli SMS kod → yangi PIN (2 marta) →
       POST /telegram/auth/pin/reset {ticket, code, pin} → token+refresh (pin bilan bir xil) → kirish.
       Xato kodlari: INVALID_CODE, CODE_EXPIRED, TOO_MANY_ATTEMPTS, WEAK_PIN, RATE_LIMIT (429). -->
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
    <div class="w-full" style="max-width: 22rem">
      <div class="text-center mb-5">
        <img src="@/assets/img/logo.svg" alt="ZeroX" class="h-12 mx-auto" onerror="this.style.display='none'" />
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-6">
        <div class="flex justify-center mb-3">
          <span class="w-12 h-12 rounded-2xl flex items-center justify-center" style="background:#EFF6FF">
            <svg class="w-6 h-6" style="color:#2563EB" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
        </div>
        <h1 class="text-lg font-bold text-gray-900 text-center">{{ title }}</h1>
        <p class="text-xs text-gray-500 text-center mt-1 leading-relaxed">{{ subtitle }}</p>

        <!-- PIN nuqtalari -->
        <div class="flex items-center justify-center gap-3 my-5" aria-hidden="true">
          <span
            v-for="i in 6" :key="i"
            class="rounded-full transition-all duration-150"
            :style="dotStyle(i)"
          ></span>
        </div>

        <p v-if="error" class="text-xs text-center font-medium mb-3" style="color:#DC2626">{{ error }}</p>
        <p v-else-if="info" class="text-xs text-center text-gray-500 mb-3">{{ info }}</p>

        <!-- SS-DEV (2026-09-26): SMS kod bosqichida qayta yuborish -->
        <p v-if="stage === 'forgot_code'" class="text-xs text-center mb-3">
          <button v-if="resendLeft <= 0" type="button" class="text-blue-600 hover:underline font-medium" :disabled="busy" @click="forgotStart(true)">{{ t.resend }}</button>
          <span v-else class="text-gray-400">{{ t.resendIn }} {{ resendLeft }}s</span>
        </p>

        <!-- Raqamli klaviatura -->
        <div class="grid grid-cols-3 gap-2" :style="busy || locked ? 'opacity:.5;pointer-events:none' : ''">
          <button
            v-for="d in ['1','2','3','4','5','6','7','8','9']" :key="d"
            type="button" class="pin-key" @click="press(d)"
          >{{ d }}</button>
          <button type="button" class="pin-key pin-key-muted" @click="clearAll" :title="t.clear">
            <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <button type="button" class="pin-key" @click="press('0')">0</button>
          <button type="button" class="pin-key pin-key-muted" @click="backspace" :title="t.backspace">
            <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l-4-4m0 0l4-4m-4 4h12a2 2 0 012 2v0a2 2 0 01-2 2H8" /></svg>
          </button>
        </div>

        <button
          type="button"
          class="w-full mt-4 py-3 rounded-xl font-semibold text-white transition-colors"
          :style="canSubmit ? 'background:#2563EB' : 'background:#93C5FD;cursor:not-allowed'"
          :disabled="!canSubmit"
          @click="submit"
        >
          <span v-if="busy">{{ t.checking }}</span>
          <span v-else>{{ submitLabel }}</span>
        </button>

        <button v-if="stage === 'confirm'" type="button" class="w-full mt-2 text-xs text-gray-500 hover:text-gray-700" @click="restartSet">{{ t.startOver }}</button>
        <!-- SS-DEV (2026-09-26), 6-band: PIN'ni unutdim (faqat o'rnatilgan PIN'ni kiritish bosqichida) -->
        <button v-if="stage === 'enter' && pinSet" type="button" class="w-full mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium" :disabled="busy" @click="forgotStart(false)">{{ t.forgotLink }}</button>
        <button v-if="stage === 'forgot_code' || stage === 'forgot_pin' || stage === 'forgot_confirm'" type="button" class="w-full mt-2 text-xs text-gray-500 hover:text-gray-700" @click="cancelForgot">{{ t.forgotCancel }}</button>
      </div>

      <p class="text-xs text-gray-400 text-center mt-4 leading-relaxed">{{ t.footer }}</p>
    </div>
  </div>
</template>

<script>
const MIN = 4;
const MAX = 6;

export default {
  name: 'TelegramPinPage',
  auth: false,
  layout: 'empty',
  data() {
    return {
      ticket: null,
      pinSet: false,
      stage: 'enter',   // 'enter' | 'confirm' (o'rnatishda 2-marta) | 'forgot_code' | 'forgot_pin' | 'forgot_confirm'
      pin: '',
      firstPin: '',
      // SS-DEV (2026-09-26), 6-band: PIN tiklash holati
      forgotCode: '',
      forgotPhone: '',
      resendLeft: 0,
      resendTimer: null,
      error: '',
      info: '',
      busy: false,
      locked: false,
      lockTimer: null,
      lockLeft: 0,
    };
  },
  computed: {
    t() {
      const l = (this.$i18n && this.$i18n.locale) || 'uz';
      const m = {
        uz: {
          setTitle: "PIN-kodni o'rnating", enterTitle: 'PIN-kodni kiriting', confirmTitle: 'PIN-kodni takrorlang',
          setSub: "Telegram orqali kirishni himoyalash uchun 4–6 raqamli PIN-kod o'ylab toping. U har safar Mini App ochilganda so'raladi.",
          enterSub: 'Kabinetga kirish uchun Telegram PIN-kodingizni kiriting.',
          confirmSub: "Tasdiqlash uchun o'sha PIN-kodni yana bir marta kiriting.",
          nextBtn: 'Davom etish', confirmBtn: 'Tasdiqlash va kirish', enterBtn: 'Kirish', checking: 'Tekshirilmoqda…',
          mismatch: 'PIN-kodlar mos kelmadi. Qaytadan kiriting.', weak: 'Juda oddiy PIN (1234, 0000…). Boshqasini tanlang.',
          wrong: "PIN-kod noto'g'ri.", left: 'Qolgan urinish: ', locked: 'Juda ko\'p xato. Qayta urinish: ',
          expired: 'Sessiya muddati tugadi. Qayta ulanmoqda…', noTicket: 'Bu sahifa faqat Telegram ilovasi ichida ochiladi.',
          startOver: 'Boshqa PIN tanlash', clear: 'Tozalash', backspace: "O'chirish", minLen: 'Kamida 4 ta raqam',
          footer: 'PIN-kod Telegram hisobingiz begona qo\'lga tushganda ham ZeroX kabinetingizni himoya qiladi.',
          // SS-DEV (2026-09-26), 6-band: PIN tiklash
          forgotLink: 'PIN-kodni unutdingizmi?', forgotCancel: 'Bekor qilish', resend: 'Kodni qayta yuborish', resendIn: 'Qayta yuborish:',
          codeTitle: 'SMS kodni kiriting', codeSub: 'Tasdiqlash kodi {phone} raqamiga yuborildi. 6 raqamli kodni kiriting.',
          newPinTitle: 'Yangi PIN-kod', newPinSub: "4–6 raqamli yangi PIN-kod o'ylab toping.",
          newPinConfirmTitle: 'Yangi PIN-kodni takrorlang', newPinConfirmSub: 'Tasdiqlash uchun yangi PIN-kodni yana bir marta kiriting.',
          codeBtn: 'Davom etish', resetBtn: 'PIN-kodni yangilash va kirish', codeLen: '6 raqamli kod kiriting',
          codeSent: 'SMS kod yuborildi', invalidCode: "SMS kod noto'g'ri.", codeExpired: 'Kod muddati tugadi. Kodni qayta yuboring.',
          tooMany: "Juda ko'p urinish. Keyinroq qayta urinib ko'ring.", rateLimit: "Juda ko'p so'rov. Biroz kutib qayta urinib ko'ring.",
          resetOk: 'PIN-kod yangilandi',
        },
        ru: {
          setTitle: 'Установите PIN-код', enterTitle: 'Введите PIN-код', confirmTitle: 'Повторите PIN-код',
          setSub: 'Придумайте PIN-код из 4–6 цифр для защиты входа через Telegram. Он запрашивается при каждом открытии Mini App.',
          enterSub: 'Введите ваш Telegram PIN-код для входа в кабинет.',
          confirmSub: 'Введите тот же PIN-код ещё раз для подтверждения.',
          nextBtn: 'Продолжить', confirmBtn: 'Подтвердить и войти', enterBtn: 'Войти', checking: 'Проверка…',
          mismatch: 'PIN-коды не совпадают. Введите заново.', weak: 'Слишком простой PIN (1234, 0000…). Выберите другой.',
          wrong: 'Неверный PIN-код.', left: 'Осталось попыток: ', locked: 'Слишком много ошибок. Повтор через: ',
          expired: 'Сессия истекла. Переподключение…', noTicket: 'Эта страница открывается только внутри Telegram.',
          startOver: 'Выбрать другой PIN', clear: 'Очистить', backspace: 'Стереть', minLen: 'Минимум 4 цифры',
          footer: 'PIN-код защищает кабинет ZeroX, даже если ваш Telegram попал в чужие руки.',
          // SS-DEV (2026-09-26), 6-band: PIN tiklash
          forgotLink: 'Забыли PIN-код?', forgotCancel: 'Отмена', resend: 'Отправить код повторно', resendIn: 'Повторно через:',
          codeTitle: 'Введите SMS-код', codeSub: 'Код подтверждения отправлен на номер {phone}. Введите 6-значный код.',
          newPinTitle: 'Новый PIN-код', newPinSub: 'Придумайте новый PIN-код из 4–6 цифр.',
          newPinConfirmTitle: 'Повторите новый PIN-код', newPinConfirmSub: 'Введите новый PIN-код ещё раз для подтверждения.',
          codeBtn: 'Продолжить', resetBtn: 'Обновить PIN-код и войти', codeLen: 'Введите 6-значный код',
          codeSent: 'SMS-код отправлен', invalidCode: 'Неверный SMS-код.', codeExpired: 'Срок кода истёк. Отправьте код повторно.',
          tooMany: 'Слишком много попыток. Попробуйте позже.', rateLimit: 'Слишком много запросов. Подождите и попробуйте снова.',
          resetOk: 'PIN-код обновлён',
        },
        kr: {
          setTitle: 'PIN-кодни ўрнатинг', enterTitle: 'PIN-кодни киритинг', confirmTitle: 'PIN-кодни такрорланг',
          setSub: 'Telegram орқали киришни ҳимоялаш учун 4–6 рақамли PIN-код ўйлаб топинг. У ҳар сафар Mini App очилганда сўралади.',
          enterSub: 'Кабинетга кириш учун Telegram PIN-кодингизни киритинг.',
          confirmSub: 'Тасдиқлаш учун ўша PIN-кодни яна бир марта киритинг.',
          nextBtn: 'Давом этиш', confirmBtn: 'Тасдиқлаш ва кириш', enterBtn: 'Кириш', checking: 'Текширилмоқда…',
          mismatch: 'PIN-кодлар мос келмади. Қайтадан киритинг.', weak: 'Жуда оддий PIN (1234, 0000…). Бошқасини танланг.',
          wrong: 'PIN-код нотўғри.', left: 'Қолган уриниш: ', locked: 'Жуда кўп хато. Қайта уриниш: ',
          expired: 'Сессия муддати тугади. Қайта уланмоқда…', noTicket: 'Бу саҳифа фақат Telegram иловаси ичида очилади.',
          startOver: 'Бошқа PIN танлаш', clear: 'Тозалаш', backspace: 'Ўчириш', minLen: 'Камида 4 та рақам',
          footer: 'PIN-код Telegram ҳисобингиз бегона қўлга тушганда ҳам ZeroX кабинетингизни ҳимоя қилади.',
          // SS-DEV (2026-09-26), 6-band: PIN tiklash
          forgotLink: 'PIN-кодни унутдингизми?', forgotCancel: 'Бекор қилиш', resend: 'Кодни қайта юбориш', resendIn: 'Қайта юбориш:',
          codeTitle: 'SMS кодни киритинг', codeSub: 'Тасдиқлаш коди {phone} рақамига юборилди. 6 рақамли кодни киритинг.',
          newPinTitle: 'Янги PIN-код', newPinSub: '4–6 рақамли янги PIN-код ўйлаб топинг.',
          newPinConfirmTitle: 'Янги PIN-кодни такрорланг', newPinConfirmSub: 'Тасдиқлаш учун янги PIN-кодни яна бир марта киритинг.',
          codeBtn: 'Давом этиш', resetBtn: 'PIN-кодни янгилаш ва кириш', codeLen: '6 рақамли код киритинг',
          codeSent: 'SMS код юборилди', invalidCode: 'SMS код нотўғри.', codeExpired: 'Код муддати тугади. Кодни қайта юборинг.',
          tooMany: 'Жуда кўп уриниш. Кейинроқ қайта уриниб кўринг.', rateLimit: 'Жуда кўп сўров. Бироз кутиб қайта уриниб кўринг.',
          resetOk: 'PIN-код янгиланди',
        },
        // SS-DEV (2026-09-26): en/kaa
        en: {
          setTitle: "Set a PIN code", enterTitle: 'Enter your PIN code', confirmTitle: 'Repeat the PIN code',
          setSub: "Create a 4–6 digit PIN code to protect login via Telegram. It will be requested every time the Mini App is opened.",
          enterSub: 'Enter your Telegram PIN code to access your account.',
          confirmSub: "Enter the same PIN code once more to confirm.",
          nextBtn: 'Continue', confirmBtn: 'Confirm and log in', enterBtn: 'Log in', checking: 'Checking…',
          mismatch: 'The PIN codes do not match. Enter them again.', weak: 'The PIN is too simple (1234, 0000…). Choose another one.',
          wrong: "Incorrect PIN code.", left: 'Attempts left: ', locked: 'Too many errors. Try again in: ',
          expired: 'The session has expired. Reconnecting…', noTicket: 'This page opens only inside the Telegram app.',
          startOver: 'Choose another PIN', clear: 'Clear', backspace: "Delete", minLen: 'At least 4 digits',
          footer: 'The PIN code protects your ZeroX account even if your Telegram account falls into the wrong hands.',
        },
        kaa: {
          setTitle: "PIN-kodtı ornatıń", enterTitle: 'PIN-kodtı kiritiń', confirmTitle: 'PIN-kodtı tákirarlań',
          setSub: "Telegram arqalı kiriwdi qorǵaw ushın 4–6 sanlı PIN-kod oylap tabıń. Ol hár sapar Mini App ashılǵanda soraladı.",
          enterSub: 'Kabinetke kiriw ushın Telegram PIN-kodıńızdı kiritiń.',
          confirmSub: "Tastıyıqlaw ushın sol PIN-kodtı jáne bir ret kiritiń.",
          nextBtn: 'Dawam etiw', confirmBtn: 'Tastıyıqlaw hám kiriw', enterBtn: 'Kiriw', checking: 'Tekserilmekte…',
          mismatch: 'PIN-kodlar sáykes kelmedi. Qaytadan kiritiń.', weak: 'Júdá ápiwayı PIN (1234, 0000…). Basqasın saylań.',
          wrong: "PIN-kod nadurıs.", left: 'Qalǵan urınıs: ', locked: 'Júdá kóp qáte. Qayta urınıw: ',
          expired: 'Sessiya múddeti tamamlandı. Qayta jalǵanbaqta…', noTicket: 'Bul bet tek Telegram qosımshası ishinde ashıladı.',
          startOver: 'Basqa PIN saylaw', clear: 'Tazalaw', backspace: "Óshiriw", minLen: 'Keminde 4 san',
          footer: 'PIN-kod Telegram esabıńız bótenniń qolına túskende de ZeroX kabinetińizdi qorǵaydı.',
        },
      };
      return m[l] || m.uz;
    },
    title() {
      if (this.stage === 'confirm') return this.t.confirmTitle;
      if (this.stage === 'forgot_code') return this.t.codeTitle;
      if (this.stage === 'forgot_pin') return this.t.newPinTitle;
      if (this.stage === 'forgot_confirm') return this.t.newPinConfirmTitle;
      return this.pinSet ? this.t.enterTitle : this.t.setTitle;
    },
    subtitle() {
      if (this.stage === 'confirm') return this.t.confirmSub;
      if (this.stage === 'forgot_code') return String(this.t.codeSub).replace('{phone}', this.forgotPhone || '—');
      if (this.stage === 'forgot_pin') return this.t.newPinSub;
      if (this.stage === 'forgot_confirm') return this.t.newPinConfirmSub;
      return this.pinSet ? this.t.enterSub : this.t.setSub;
    },
    /** SS-DEV (2026-09-26): SMS kod bosqichida aynan 6 raqam, PIN bosqichlarida 4–6 */
    minLen() { return this.stage === 'forgot_code' ? 6 : MIN; },
    submitLabel() {
      if (this.stage === 'confirm') return this.t.confirmBtn;
      if (this.stage === 'forgot_code' || this.stage === 'forgot_pin') return this.t.codeBtn;
      if (this.stage === 'forgot_confirm') return this.t.resetBtn;
      return this.pinSet ? this.t.enterBtn : this.t.nextBtn;
    },
    canSubmit() {
      return !this.busy && !this.locked && this.pin.length >= this.minLen && !!this.ticket;
    },
  },
  mounted() {
    if (this.$auth && this.$auth.loggedIn) { this.goHome(); return; }
    const st = this.$tgAutologin && this.$tgAutologin.pinState();
    if (st) {
      this.ticket = st.ticket;
      this.pinSet = !!st.pinSet;
    } else if (this.$tgAutologin && this.$tgAutologin.isMiniApp()) {
      // Ticket yo'q/eskirgan — qayta so'raymiz (plugin sessionStorage'ni yangilaydi)
      this.refreshTicket();
    } else {
      this.$router.replace(this.localePath({ name: 'auth-login' }));
    }
    window.addEventListener('keydown', this.onKey);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKey);
    if (this.lockTimer) clearInterval(this.lockTimer);
    if (this.resendTimer) clearInterval(this.resendTimer);
  },
  methods: {
    goHome() {
      const home = (this.localePath && this.localePath('/')) || '/';
      try { window.location.replace(home); } catch (_) { this.$router.replace(home); }
    },
    dotStyle(i) {
      const filled = i <= this.pin.length;
      const active = i <= MAX;
      const size = filled ? '14px' : '12px';
      const bg = filled ? '#2563EB' : (i <= this.minLen ? '#CBD5E1' : '#E5E7EB');
      return `width:${size};height:${size};background:${bg};${active ? '' : 'display:none'}`;
    },
    haptic(kind) {
      try {
        const tg = window.Telegram && window.Telegram.WebApp;
        if (tg && tg.HapticFeedback) {
          if (kind === 'error') tg.HapticFeedback.notificationOccurred('error');
          else if (kind === 'ok') tg.HapticFeedback.notificationOccurred('success');
          else tg.HapticFeedback.impactOccurred('light');
        }
      } catch (_) {}
    },
    press(d) {
      if (this.busy || this.locked) return;
      if (this.pin.length >= MAX) return;
      this.error = '';
      this.pin += d;
      this.haptic('tap');
      if (this.pin.length === MAX) this.submit();
    },
    backspace() { if (!this.busy) { this.pin = this.pin.slice(0, -1); this.error = ''; } },
    clearAll() { if (!this.busy) { this.pin = ''; this.error = ''; } },
    onKey(e) {
      if (/^\d$/.test(e.key)) this.press(e.key);
      else if (e.key === 'Backspace') this.backspace();
      else if (e.key === 'Enter' && this.canSubmit) this.submit();
    },
    restartSet() { this.stage = 'enter'; this.firstPin = ''; this.pin = ''; this.error = ''; },
    isWeak(p) {
      if (/^(\d)\1+$/.test(p)) return true;
      return '0123456789'.includes(p) || '9876543210'.includes(p);
    },
    async refreshTicket() {
      this.info = this.t.expired;
      try { await this.$tgAutologin.run({}); } catch (_) {}
      const st = this.$tgAutologin && this.$tgAutologin.pinState();
      this.info = '';
      if (st) { this.ticket = st.ticket; this.pinSet = !!st.pinSet; }
      else { this.error = this.t.noTicket; }
    },
    startLock(seconds) {
      this.locked = true;
      this.lockLeft = Math.max(1, Number(seconds) || 900);
      const fmt = () => {
        const m = Math.floor(this.lockLeft / 60), s = this.lockLeft % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
      };
      this.error = this.t.locked + fmt();
      if (this.lockTimer) clearInterval(this.lockTimer);
      this.lockTimer = setInterval(() => {
        this.lockLeft -= 1;
        if (this.lockLeft <= 0) { clearInterval(this.lockTimer); this.locked = false; this.error = ''; this.pin = ''; return; }
        this.error = this.t.locked + fmt();
      }, 1000);
    },
    // ===== SS-DEV (2026-09-26), 6-band: PIN tiklash =====
    cancelForgot() {
      this.stage = 'enter'; this.pin = ''; this.forgotCode = ''; this.firstPin = ''; this.error = ''; this.info = '';
      if (this.resendTimer) { clearInterval(this.resendTimer); this.resendTimer = null; }
      this.resendLeft = 0;
    },
    startResend(seconds) {
      this.resendLeft = Math.max(0, Math.min(600, Number(seconds) || 60));
      if (this.resendTimer) clearInterval(this.resendTimer);
      this.resendTimer = setInterval(() => {
        this.resendLeft -= 1;
        if (this.resendLeft <= 0) { clearInterval(this.resendTimer); this.resendTimer = null; this.resendLeft = 0; }
      }, 1000);
    },
    /** Backend javobida yangi ticket kelsa — uni yangilab olamiz */
    adoptTicket(d) {
      if (d && d.ticket && typeof d.ticket === 'string') {
        this.ticket = d.ticket;
        try {
          const st = (this.$tgAutologin && this.$tgAutologin.pinState()) || {};
          window.sessionStorage.setItem('zx_tg_pin', JSON.stringify({ ...st, ticket: d.ticket, pinSet: st.pinSet !== false, exp: Date.now() + ((Number(d.ttl) || Number(d.ticket_ttl) || 300) - 15) * 1000 }));
        } catch (_) {}
      }
    },
    async forgotStart(resend) {
      if (this.busy || !this.ticket) return;
      this.busy = true; this.error = '';
      try {
        const res = await this.$axios.post('/telegram/auth/pin/forgot', { ticket: this.ticket }, {
          silent: true, validateStatus: (s) => s >= 200 && s < 500,
        });
        const d = res && res.data;
        if (d && d.success) {
          this.adoptTicket(d);
          this.forgotPhone = d.phone_masked || '';
          this.forgotCode = ''; this.firstPin = ''; this.pin = '';
          this.stage = 'forgot_code';
          this.info = this.t.codeSent;
          this.startResend(d.ttl || 60);
          this.haptic('ok');
          return;
        }
        const code = d && d.code;
        this.haptic('error');
        if (res.status === 429 || code === 'RATE_LIMIT') { this.error = this.t.rateLimit; if (d && d.retry_after) this.startResend(d.retry_after); return; }
        if (code === 'TOO_MANY_ATTEMPTS') { this.error = this.t.tooMany; return; }
        if (code === 'TICKET_INVALID') { this.$tgAutologin.clearPin(); this.ticket = null; await this.refreshTicket(); return; }
        this.error = (d && d.message) || 'Xatolik';
      } catch (e) {
        this.error = (e && e.message) || 'Xatolik';
      } finally { this.busy = false; }
    },
    async forgotReset() {
      this.busy = true; this.error = '';
      try {
        const res = await this.$axios.post('/telegram/auth/pin/reset', { ticket: this.ticket, code: this.forgotCode, pin: this.pin }, {
          silent: true, validateStatus: (s) => s >= 200 && s < 500,
        });
        const d = res && res.data;
        if (d && d.success && d.data && d.data.token) {
          this.haptic('ok');
          this.$tgAutologin.clearPin();
          await this.$tgAutologin.applyToken({ token: d.data.token, refreshToken: d.data.refreshToken || null });
          this.goHome();
          return;
        }
        this.adoptTicket(d);
        const code = d && d.code;
        this.haptic('error');
        this.pin = '';
        if (code === 'INVALID_CODE') { this.stage = 'forgot_code'; this.forgotCode = ''; this.firstPin = ''; this.error = this.t.invalidCode + (d.attempts_left != null ? ' ' + this.t.left + d.attempts_left : ''); return; }
        if (code === 'CODE_EXPIRED') { this.stage = 'forgot_code'; this.forgotCode = ''; this.firstPin = ''; this.error = this.t.codeExpired; this.resendLeft = 0; return; }
        if (code === 'TOO_MANY_ATTEMPTS') { this.cancelForgot(); this.error = this.t.tooMany; if (d.retry_after) this.startLock(d.retry_after); return; }
        if (code === 'WEAK_PIN') { this.stage = 'forgot_pin'; this.firstPin = ''; this.error = this.t.weak; return; }
        if (res.status === 429 || code === 'RATE_LIMIT') { this.error = this.t.rateLimit; return; }
        if (code === 'TICKET_INVALID') { this.$tgAutologin.clearPin(); this.ticket = null; this.cancelForgot(); await this.refreshTicket(); return; }
        this.error = (d && d.message) || 'Xatolik';
      } catch (e) {
        this.pin = '';
        this.error = (e && e.message) || 'Xatolik';
      } finally { this.busy = false; }
    },

    async submit() {
      if (!this.canSubmit) return;
      if (this.pin.length < this.minLen) { this.error = this.stage === 'forgot_code' ? this.t.codeLen : this.t.minLen; return; }

      // SS-DEV (2026-09-26), 6-band: PIN tiklash bosqichlari
      if (this.stage === 'forgot_code') {
        this.forgotCode = this.pin; this.pin = ''; this.stage = 'forgot_pin'; this.error = ''; this.info = '';
        return;
      }
      if (this.stage === 'forgot_pin') {
        if (this.isWeak(this.pin)) { this.error = this.t.weak; this.pin = ''; this.haptic('error'); return; }
        this.firstPin = this.pin; this.pin = ''; this.stage = 'forgot_confirm'; this.error = '';
        return;
      }
      if (this.stage === 'forgot_confirm') {
        if (this.pin !== this.firstPin) { this.error = this.t.mismatch; this.pin = ''; this.haptic('error'); return; }
        await this.forgotReset();
        return;
      }

      // O'RNATISH: 1-qadam — eslab qolamiz, 2-qadam — solishtiramiz
      if (!this.pinSet && this.stage === 'enter') {
        if (this.isWeak(this.pin)) { this.error = this.t.weak; this.pin = ''; this.haptic('error'); return; }
        this.firstPin = this.pin; this.pin = ''; this.stage = 'confirm'; this.error = '';
        return;
      }
      if (!this.pinSet && this.stage === 'confirm' && this.pin !== this.firstPin) {
        this.error = this.t.mismatch; this.pin = ''; this.haptic('error');
        return;
      }

      this.busy = true; this.error = '';
      try {
        const res = await this.$axios.post('/telegram/auth/pin', { ticket: this.ticket, pin: this.pin }, {
          silent: true, validateStatus: (s) => s >= 200 && s < 500,
        });
        const d = res && res.data;
        if (d && d.success && d.data && d.data.token) {
          this.haptic('ok');
          this.$tgAutologin.clearPin();
          await this.$tgAutologin.applyToken({ token: d.data.token, refreshToken: d.data.refreshToken || null });
          this.goHome();
          return;
        }
        const code = d && d.code;
        this.pin = '';
        this.haptic('error');
        if (code === 'PIN_LOCKED') { this.startLock(d.retry_after); return; }
        if (code === 'PIN_WRONG') { this.error = this.t.wrong + (d.attempts_left != null ? ' ' + this.t.left + d.attempts_left : ''); return; }
        if (code === 'WEAK_PIN') { this.restartSet(); this.error = this.t.weak; return; }
        if (code === 'TICKET_INVALID') { this.$tgAutologin.clearPin(); this.ticket = null; await this.refreshTicket(); return; }
        this.error = (d && d.message) || 'Xatolik';
      } catch (e) {
        this.pin = '';
        this.error = (e && e.message) || 'Xatolik';
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>

<style scoped>
.pin-key {
  height: 3.25rem;
  border-radius: 0.875rem;
  background: #F3F4F6;
  color: #111827;
  font-size: 1.25rem;
  font-weight: 600;
  transition: background 0.12s, transform 0.08s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.pin-key:active { background: #DBEAFE; transform: scale(0.97); }
.pin-key-muted { background: transparent; color: #6B7280; }
.pin-key-muted:active { background: #F3F4F6; }
</style>
