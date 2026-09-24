<template>
  <!-- SS-DEV (2026-09-24), hujjat-4 1-band: Telegram Mini App PIN-kod ekrani.
       Faqat Mini App ichida (plugin `pin_required` olganda) ochiladi. Oddiy brauzerda
       ticket bo'lmaydi — login sahifasiga qaytariladi. Raqamli klaviatura uslubidagi
       ixcham forma: o'rnatish (2 marta) / kiritish; 5 xato → 15 daqiqa blok (backend). -->
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
          <span v-else>{{ stage === 'confirm' ? t.confirmBtn : (pinSet ? t.enterBtn : t.nextBtn) }}</span>
        </button>

        <button v-if="stage === 'confirm'" type="button" class="w-full mt-2 text-xs text-gray-500 hover:text-gray-700" @click="restartSet">{{ t.startOver }}</button>
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
      stage: 'enter',   // 'enter' | 'confirm' (o'rnatishda 2-marta)
      pin: '',
      firstPin: '',
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
        },
      };
      return m[l] || m.uz;
    },
    title() {
      if (this.stage === 'confirm') return this.t.confirmTitle;
      return this.pinSet ? this.t.enterTitle : this.t.setTitle;
    },
    subtitle() {
      if (this.stage === 'confirm') return this.t.confirmSub;
      return this.pinSet ? this.t.enterSub : this.t.setSub;
    },
    canSubmit() {
      return !this.busy && !this.locked && this.pin.length >= MIN && !!this.ticket;
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
      const bg = filled ? '#2563EB' : (i <= MIN ? '#CBD5E1' : '#E5E7EB');
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
    async submit() {
      if (!this.canSubmit) return;
      if (this.pin.length < MIN) { this.error = this.t.minLen; return; }

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
