<template>
  <!-- 07.11 (imzolash spetsifikatsiyasi §4): yagona ELEKTRON IMZO oynasi. 1) hujjatning asosiy shartlari +
       majburiy rozilik belgisi + "Kod olish"; 2) POST /sign/challenge → kod Telegram/SMS orqali, 6 xonali kod,
       5 daqiqalik taymer, 60 s dan keyin "Qayta yuborish"; 3) amal `sign: { challenge_id, code }` bilan yuboriladi.
       Oyna layouts/default.vue'da bitta joyda chiziladi ($sign.state.request — plugins/sign.client.js). -->
  <div class="zs-overlay" role="dialog" aria-modal="true" :aria-label="T.title" @click.self="cancel">
    <div class="zs-card">
      <div class="zs-head">
        <div class="zs-head__icon" aria-hidden="true">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM19.5 7.125L16.862 4.487M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
        </div>
        <h3 class="zs-title">{{ T.title }}</h3>
        <button type="button" class="zs-close" :aria-label="T.cancel" :disabled="loading" @click="cancel">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- Hujjatning asosiy shartlari -->
      <dl class="zs-terms">
        <div v-for="row in rows" :key="row.label" class="zs-row">
          <dt>{{ row.label }}</dt>
          <dd>{{ row.value }}</dd>
        </div>
      </dl>

      <template v-if="step === 'review'">
        <label class="zs-consent">
          <input v-model="agreed" type="checkbox" :disabled="loading" />
          <span>{{ T.consent }}</span>
        </label>
        <p v-if="error" class="zs-error" role="alert">{{ error }}</p>
        <div class="zs-actions">
          <button type="button" class="zs-btn zs-btn--ghost" :disabled="loading" @click="cancel">{{ T.cancel }}</button>
          <button type="button" class="zs-btn zs-btn--primary" :disabled="!agreed || loading" @click="requestCode">
            {{ loading ? '...' : T.getCode }}
          </button>
        </div>
      </template>

      <template v-else>
        <p class="zs-sent">{{ sentText }}</p>
        <label class="zs-label" for="zs-code">{{ T.codeLabel }}</label>
        <input
          id="zs-code"
          ref="code"
          :value="code"
          class="zs-code"
          type="text"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="6"
          placeholder="••••••"
          :disabled="locked || loading || remaining <= 0"
          @input="onCodeInput"
          @keyup.enter="submit"
        />
        <div class="zs-timers">
          <span>{{ timerText }}</span>
          <button v-if="resendLeft <= 0" type="button" class="zs-link" :disabled="loading || locked" @click="resend">{{ T.resend }}</button>
          <span v-else>{{ resendText }}</span>
        </div>
        <p v-if="error" class="zs-error" role="alert">{{ error }}</p>
        <div class="zs-actions">
          <button type="button" class="zs-btn zs-btn--ghost" :disabled="loading" @click="cancel">{{ T.cancel }}</button>
          <button type="button" class="zs-btn zs-btn--primary" :disabled="!canSubmit" @click="submit">
            {{ loading ? '...' : T.sign }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { postSignChallenge } from '@/api/sign';
import {
  signTexts, fill, formatTimer, normalizeCode, isCodeComplete, buildChallengeBody, parseChallenge,
  signErrorOf, signErrorAction, signErrorText, SIGN_ERRORS, SIGN_RESEND_AFTER,
} from '@/utils/signFlow';

export default {
  name: 'SignModal',
  props: {
    /**
     * { purpose, contract?, act?, notification?, payload?,
     *   summary: { docType, lender, borrower, amount, currency, endDate, endDateLabel?: 'dueDate'|'newDueDate', number },
     *   submit: (sign) => Promise }
     */
    request: { type: Object, required: true },
  },
  data: () => ({
    step: 'review',
    agreed: false,
    loading: false,
    challenge: null,
    code: '',
    remaining: 0,
    resendLeft: 0,
    error: '',
    locked: false,
  }),
  computed: {
    T() {
      return signTexts(this.$i18n && this.$i18n.locale);
    },
    summary() {
      return this.request.summary || {};
    },
    rows() {
      const s = this.summary;
      const out = [];
      const add = (label, value) => {
        if (value != null && value !== '') {out.push({ label, value: String(value) });}
      };
      add(this.T.docType, (this.T.docTypes || {})[s.docType] || s.docType);
      add(this.T.number, s.number ? `№ ${s.number}` : '');
      add(this.T.lender, s.lender);
      add(this.T.borrower, s.borrower);
      if (s.amount != null && s.amount !== '') {
        const n = typeof this.$formatNumber === 'function' ? this.$formatNumber(s.amount) : s.amount;
        add(this.T.amount, `${n} ${s.currency || ''}`.trim());
      }
      if (s.endDate) {
        const d = typeof this.$formatDate === 'function' ? this.$formatDate(s.endDate) || s.endDate : s.endDate;
        add(this.T[s.endDateLabel === 'newDueDate' ? 'newDueDate' : 'dueDate'], d);
      }
      return out;
    },
    sentText() {
      if (!this.challenge) {return '';}
      const channel = this.challenge.channel === 'telegram' ? this.T.channelTelegram : this.T.channelSms;
      return fill(this.T.sentTo, { channel, dest: this.challenge.destination || '' });
    },
    timerText() {
      return fill(this.T.expiresIn, { t: formatTimer(this.remaining) });
    },
    resendText() {
      return fill(this.T.resendIn, { t: formatTimer(this.resendLeft) });
    },
    canSubmit() {
      return !this.loading && !this.locked && this.remaining > 0 && !!this.challenge && isCodeComplete(this.code);
    },
  },
  beforeDestroy() {
    this.stopTimer();
  },
  methods: {
    startTimer(ttl) {
      this.stopTimer();
      this.remaining = ttl;
      this.resendLeft = SIGN_RESEND_AFTER;
      this._timer = setInterval(() => this.tick(), 1000);
    },
    stopTimer() {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
    },
    tick() {
      if (this.resendLeft > 0) {this.resendLeft -= 1;}
      if (this.remaining > 0) {
        this.remaining -= 1;
        if (this.remaining === 0) {
          this.error = this.T.expired;
          this.resendLeft = 0;
        }
      }
      if (this.remaining <= 0 && this.resendLeft <= 0) {this.stopTimer();}
    },

    onCodeInput(e) {
      const v = normalizeCode(e && e.target ? e.target.value : e);
      this.code = v;
      if (e && e.target && e.target.value !== v) {e.target.value = v;}
      if (this.error && !this.locked && this.remaining > 0) {this.error = '';}
    },

    /** POST /sign/challenge. Rol/hujjat xatolari (403 only-lender ...) — oyna yopiladi, sahifa o'zi ko'rsatadi. */
    async requestCode() {
      if (!this.agreed || this.loading) {return;}
      this.loading = true;
      this.error = '';
      try {
        const res = await postSignChallenge(this.$axios, buildChallengeBody(this.request.purpose, this.request), { silent: true });
        const ch = parseChallenge(res);
        if (!ch) {
          this.error = this.T.challengeFailed;
          return;
        }
        this.challenge = ch;
        this.code = '';
        this.locked = false;
        this.step = 'code';
        this.startTimer(ch.expiresIn);
        this.$nextTick(() => this.$refs.code && this.$refs.code.focus && this.$refs.code.focus());
      } catch (e) {
        this.handleChallengeError(e);
      } finally {
        this.loading = false;
      }
    },

    handleChallengeError(e) {
      const s = signErrorOf(e);
      const status = e && e.response ? Number(e.response.status) : 0;
      if ((s && s.code === SIGN_ERRORS.LOCKED) || status === 429) {
        this.error = this.T.locked;
      } else if (s) {
        this.error = signErrorText(s, this.$i18n && this.$i18n.locale);
      } else if ([400, 403, 404, 409].includes(status)) {
        // rol / hujjat xatosi (only-lender, already-processed ...) — sahifaning o'z ishlovchisiga
        this.stopTimer();
        this.$emit('failed', e);
      } else {
        this.error = this.T.challengeFailed;
      }
    },

    resend() {
      if (this.resendLeft > 0 || this.loading || this.locked) {return;}
      this.agreed = true;
      return this.requestCode();
    },

    /** Amalni `sign: { challenge_id, code }` bilan yuborish. */
    async submit() {
      if (!this.canSubmit) {return;}
      this.loading = true;
      this.error = '';
      try {
        const result = await this.request.submit({ challenge_id: this.challenge.challengeId, code: normalizeCode(this.code) });
        this.stopTimer();
        this.$emit('done', result);
      } catch (e) {
        this.handleSubmitError(e);
      } finally {
        this.loading = false;
      }
    },

    handleSubmitError(e) {
      const s = signErrorOf(e);
      if (!s) {
        // imzodan boshqa xato (rol, 409 already-processed, tarmoq ...) — sahifaning o'z ishlovchisiga
        this.stopTimer();
        this.$emit('failed', e);
        return;
      }
      const text = signErrorText(s, this.$i18n && this.$i18n.locale);
      switch (signErrorAction(s.code)) {
        case 'retry':
          this.error = text;
          this.code = '';
          if (s.attemptsLeft === 0) {
            this.locked = true;
            this.stopTimer();
          }
          break;
        case 'restart':
          this.stopTimer();
          this.challenge = null;
          this.code = '';
          this.step = 'review';
          this.error = text;
          break;
        case 'locked':
          this.locked = true;
          this.stopTimer();
          this.resendLeft = 0;
          this.error = text;
          break;
        default: // 'close' — SIGN_DOC_CHANGED
          this.stopTimer();
          if (this.$toast) {this.$toast.error(text);}
          this.$emit('cancel', { reason: s.code });
      }
    },

    cancel() {
      if (this.loading) {return;}
      this.stopTimer();
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
.zs-overlay { position: fixed; inset: 0; z-index: 10050; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(17, 24, 39, 0.55); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); overflow-y: auto; }
.zs-card { width: 100%; max-width: 440px; background: #fff; border-radius: 18px; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2); padding: 20px; }
.zs-head { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.zs-head__icon { width: 40px; height: 40px; border-radius: 12px; background: #eef2ff; color: #4f46e5; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.zs-head__icon svg { width: 22px; height: 22px; }
.zs-title { flex: 1; font-size: 1.0625rem; font-weight: 800; color: #111827; }
.zs-close { width: 32px; height: 32px; border-radius: 8px; color: #9ca3af; display: flex; align-items: center; justify-content: center; }
.zs-close:hover { background: #f3f4f6; color: #4b5563; }
.zs-close svg { width: 18px; height: 18px; }
.zs-terms { border: 1px solid #eef2f7; border-radius: 12px; background: #f8fafc; padding: 4px 12px; margin-bottom: 14px; }
.zs-row { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid #eef2f7; font-size: 0.875rem; }
.zs-row:last-child { border-bottom: 0; }
.zs-row dt { color: #6b7280; }
.zs-row dd { color: #111827; font-weight: 600; text-align: right; overflow-wrap: anywhere; }
.zs-consent { display: flex; gap: 10px; align-items: flex-start; font-size: 0.875rem; color: #374151; cursor: pointer; line-height: 1.45; }
.zs-consent input { margin-top: 3px; width: 16px; height: 16px; flex-shrink: 0; }
.zs-sent { font-size: 0.875rem; color: #374151; margin-bottom: 10px; }
.zs-label { display: block; font-size: 0.8125rem; color: #6b7280; margin-bottom: 6px; }
.zs-code { width: 100%; height: 52px; border: 1px solid #d1d5db; border-radius: 12px; text-align: center; font-size: 1.5rem; letter-spacing: 0.5em; font-weight: 700; outline: none; }
.zs-code:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); }
.zs-code:disabled { background: #f3f4f6; color: #9ca3af; }
.zs-timers { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 8px; font-size: 0.8125rem; color: #6b7280; }
.zs-link { color: #4f46e5; font-weight: 600; }
.zs-link:disabled { color: #9ca3af; }
.zs-error { margin-top: 10px; padding: 8px 12px; border-radius: 10px; background: #fef2f2; color: #b91c1c; font-size: 0.8125rem; font-weight: 600; }
.zs-actions { display: flex; gap: 8px; margin-top: 16px; }
.zs-btn { flex: 1; padding: 10px 12px; border-radius: 12px; font-weight: 700; font-size: 0.875rem; }
.zs-btn--ghost { background: #f3f4f6; color: #374151; }
.zs-btn--primary { background: #4f46e5; color: #fff; }
.zs-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
