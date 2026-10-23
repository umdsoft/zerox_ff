<template>
  <!-- 23.10 ("Shaxsiy moliya yangi sayt 22.10", 5–9-rasmlar): Qarz shartnomasi amal sahifalari
       (talab qilish, muddat uzaytirish/so'rash, voz kechish, qaytarish) uchun UMUMIY tartib.
       Ilgari amal formasi ekran o'rtasida yolg'iz turardi — endi chapda shartnoma ma'lumoti
       (faqat ko'rish uchun), o'ngda amal formasi. Xatti-harakat (API) sahifaning o'zida qoladi. -->
  <div class="cal pb-8">
    <div class="cal-head">
      <PageBackButton @click="goBack" />
      <div class="cal-head__icon" :class="'cal-tone--' + tone">
        <slot name="icon" />
      </div>
      <div class="min-w-0">
        <h1 class="cal-head__title">{{ title }}</h1>
        <p v-if="subtitle" class="cal-head__sub">{{ subtitle }}</p>
      </div>
    </div>

    <div v-if="!contract" class="cal-card cal-empty">{{ loadingText }}</div>

    <div v-else class="cal-grid">
      <!-- Chap: shartnoma ma'lumoti -->
      <aside class="cal-card cal-summary">
        <div class="cal-summary__top">
          <div class="min-w-0">
            <p class="cal-kicker">{{ T.info }}</p>
            <a class="cal-number" :href="localePath('pdf-generate') + '?id=' + contract.uid" target="_blank" rel="noopener">
              № {{ contract.number }}
              <svg class="cal-ext" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <p class="cal-muted">{{ T.from }} {{ $formatDate(contract.contract_date || contract.created_at) }}</p>
          </div>
          <span class="cal-badge" :class="overdueDays > 0 ? 'cal-badge--red' : 'cal-badge--green'">
            {{ overdueDays > 0 ? T.overdue : T.active }}
          </span>
        </div>

        <!-- Summa va progress -->
        <div class="cal-amount">
          <p class="cal-muted">{{ T.residual }}</p>
          <p class="cal-amount__value">{{ $formatNumber(residual) }} <span>{{ contract.currency }}</span></p>
          <div class="cal-progress" role="progressbar" :aria-valuenow="paidPct" aria-valuemin="0" aria-valuemax="100">
            <div class="cal-progress__bar" :style="{ width: paidPct + '%' }"></div>
          </div>
          <div class="cal-progress__legend">
            <span>{{ T.returned }}: <b>{{ $formatNumber(returned) }}</b></span>
            <span>{{ paidPct }}%</span>
          </div>
        </div>

        <dl class="cal-list">
          <div class="cal-row">
            <dt>{{ T.lender }}</dt>
            <dd>{{ contract.debitor_name || '—' }}<span v-if="isMe(contract.debitor)" class="cal-me">{{ T.you }}</span></dd>
          </div>
          <div class="cal-row">
            <dt>{{ T.borrower }}</dt>
            <dd>{{ contract.creditor_name || '—' }}<span v-if="isMe(contract.creditor)" class="cal-me">{{ T.you }}</span></dd>
          </div>
          <div class="cal-row">
            <dt>{{ T.amount }}</dt>
            <dd>{{ $formatNumber(contract.amount) }} {{ contract.currency }}</dd>
          </div>
          <div class="cal-row">
            <dt>{{ T.due }}</dt>
            <dd>
              {{ $formatDate(contract.end_date) || '—' }}
              <span v-if="overdueDays > 0" class="cal-chip cal-chip--red">{{ T.overdueDays.replace('{n}', overdueDays) }}</span>
              <span v-else-if="daysLeft !== null" class="cal-chip">{{ T.daysLeft.replace('{n}', daysLeft) }}</span>
            </dd>
          </div>
        </dl>

        <p class="cal-note">
          <svg class="cal-note__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {{ T.note }}
        </p>
      </aside>

      <!-- O'ng: amal formasi -->
      <section class="cal-card cal-form">
        <slot />
      </section>
    </div>
  </div>
</template>

<script>
import PageBackButton from '@/components/ui/PageBackButton.vue';

const TEXTS = {
  uz: { info: "Shartnoma ma'lumotlari", from: 'Tuzilgan sana:', active: 'Faol', overdue: "Muddati o'tgan", residual: 'Qoldiq qarz', returned: 'Qaytarilgan', lender: 'Qarz beruvchi', borrower: 'Qarz oluvchi', amount: 'Qarz summasi', due: 'Qaytarish muddati', overdueDays: "{n} kun o'tgan", daysLeft: '{n} kun qoldi', you: 'Siz', note: "Ushbu ma'lumotlar faqat tanishish uchun — amal o'ng tomondagi forma orqali bajariladi.", loading: 'Yuklanmoqda...' },
  kr: { info: 'Шартнома маълумотлари', from: 'Тузилган сана:', active: 'Фаол', overdue: 'Муддати ўтган', residual: 'Қолдиқ қарз', returned: 'Қайтарилган', lender: 'Қарз берувчи', borrower: 'Қарз олувчи', amount: 'Қарз суммаси', due: 'Қайтариш муддати', overdueDays: '{n} кун ўтган', daysLeft: '{n} кун қолди', you: 'Сиз', note: 'Ушбу маълумотлар фақат танишиш учун — амал ўнг томондаги форма орқали бажарилади.', loading: 'Юкланмоқда...' },
  ru: { info: 'Сведения о договоре', from: 'Дата договора:', active: 'Активен', overdue: 'Просрочен', residual: 'Остаток долга', returned: 'Возвращено', lender: 'Займодавец', borrower: 'Заёмщик', amount: 'Сумма займа', due: 'Срок возврата', overdueDays: 'просрочено {n} дн.', daysLeft: 'осталось {n} дн.', you: 'Вы', note: 'Эти сведения только для ознакомления — действие выполняется через форму справа.', loading: 'Загрузка...' },
  kaa: { info: "Shártnama maǵlıwmatları", from: 'Dúzilgen sáne:', active: 'Aktiv', overdue: "Múddeti ótken", residual: 'Qaldıq qarız', returned: 'Qaytarılǵan', lender: 'Qarız beriwshi', borrower: 'Qarız alıwshı', amount: 'Qarız summası', due: 'Qaytarıw múddeti', overdueDays: "{n} kún ótken", daysLeft: '{n} kún qaldı', you: 'Siz', note: "Bul maǵlıwmatlar tek tanısıw ushın — ámel oń tárepdegi forma arqalı orınlanadı.", loading: 'Júklenbekte...' },
  en: { info: 'Contract details', from: 'Signed on:', active: 'Active', overdue: 'Overdue', residual: 'Remaining debt', returned: 'Returned', lender: 'Lender', borrower: 'Borrower', amount: 'Loan amount', due: 'Due date', overdueDays: '{n} days overdue', daysLeft: '{n} days left', you: 'You', note: 'These details are for reference only — the action is performed with the form on the right.', loading: 'Loading...' },
};

const DAY_MS = 86400000;

export default {
  name: 'ContractActionLayout',
  components: { PageBackButton },
  props: {
    contract: { type: Object, default: null },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    // Sarlavha ikonkasi rangi: red | blue | indigo | green | orange
    tone: { type: String, default: 'blue' },
  },
  computed: {
    T() {
      return TEXTS[this.$i18n.locale] || TEXTS.uz;
    },
    loadingText() {
      return this.T.loading;
    },
    amount() {
      return Number(this.contract && this.contract.amount) || 0;
    },
    residual() {
      const r = this.contract ? Number(this.contract.residual_amount) : NaN;
      return Number.isFinite(r) ? r : this.amount;
    },
    returned() {
      return Math.max(0, Math.round((this.amount - this.residual) * 100) / 100);
    },
    paidPct() {
      if (!(this.amount > 0)) return 0;
      return Math.min(100, Math.max(0, Math.round((this.returned / this.amount) * 100)));
    },
    /** Qaytarish muddatigacha kunlar (bugun = 0); sana bo'lmasa null. */
    dayDiff() {
      const shown = this.contract ? this.$formatDate(this.contract.end_date) : '';
      const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(shown || '');
      if (!m) return null;
      const due = Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
      const now = new Date();
      const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      return Math.round((due - today) / DAY_MS);
    },
    overdueDays() {
      return this.dayDiff !== null && this.dayDiff < 0 && this.residual > 0 ? -this.dayDiff : 0;
    },
    daysLeft() {
      return this.dayDiff !== null && this.dayDiff >= 0 ? this.dayDiff : null;
    },
  },
  methods: {
    isMe(id) {
      const u = this.$auth && this.$auth.user;
      return !!(u && id != null && Number(u.id) === Number(id));
    },
    // BackButton bilan bir xil: Qarz shartnomasi bo'limi → contract-dashboard
    goBack() {
      this.$router.push(this.localePath({ name: 'contract-dashboard' }));
    },
  },
};
</script>

<style scoped>
.cal-head { display: flex; align-items: center; gap: 14px; margin: 16px 0 20px; }
.cal-head__icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cal-head__icon >>> svg { width: 26px; height: 26px; }
.cal-head__title { font-size: 1.5rem; line-height: 1.2; font-weight: 800; color: #111827; }
.cal-head__sub { font-size: 0.875rem; color: #6b7280; margin-top: 2px; }
.cal-tone--red { background: #fef2f2; color: #dc2626; }
.cal-tone--blue { background: #eff6ff; color: #2563eb; }
.cal-tone--indigo { background: #eef2ff; color: #4f46e5; }
.cal-tone--green { background: #ecfdf5; color: #059669; }
.cal-tone--orange { background: #fff7ed; color: #ea580c; }

.cal-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 20px; align-items: start; }
@media (min-width: 1024px) {
  .cal-grid { grid-template-columns: minmax(320px, 5fr) minmax(0, 7fr); }
  .cal-summary { position: sticky; top: 16px; }
}
.cal-card { background: #fff; border-radius: 1rem; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04); border: 1px solid #eef2f7; }
.cal-empty { padding: 48px; text-align: center; color: #9ca3af; }
.cal-summary { padding: 22px; }
.cal-form { padding: 26px; }
@media (min-width: 1024px) { .cal-form { padding: 32px; } }

.cal-summary__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.cal-kicker { font-size: 0.75rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #94a3b8; }
.cal-number { display: inline-flex; align-items: center; gap: 6px; font-size: 1.125rem; font-weight: 800; color: #2563eb; margin-top: 4px; }
.cal-number:hover { text-decoration: underline; }
.cal-ext { width: 15px; height: 15px; }
.cal-muted { font-size: 0.8125rem; color: #6b7280; }
.cal-badge { font-size: 0.75rem; font-weight: 700; border-radius: 9999px; padding: 4px 10px; white-space: nowrap; }
.cal-badge--green { background: #ecfdf5; color: #047857; }
.cal-badge--red { background: #fef2f2; color: #b91c1c; }

.cal-amount { margin-top: 18px; padding: 16px; border-radius: 14px; background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%); border: 1px solid #e0e7ff; }
.cal-amount__value { font-size: 1.75rem; font-weight: 800; color: #0f172a; line-height: 1.2; margin-top: 2px; }
.cal-amount__value span { font-size: 0.875rem; font-weight: 600; color: #64748b; }
.cal-progress { height: 8px; border-radius: 9999px; background: #e2e8f0; overflow: hidden; margin-top: 12px; }
.cal-progress__bar { height: 100%; border-radius: 9999px; background: linear-gradient(90deg, #22c55e, #10b981); transition: width .3s ease; }
.cal-progress__legend { display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-top: 6px; }
.cal-progress__legend b { color: #0f172a; }

.cal-list { margin-top: 14px; }
.cal-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 10px 0; border-bottom: 1px dashed #e5e7eb; font-size: 0.875rem; }
.cal-row:last-child { border-bottom: none; }
.cal-row dt { color: #6b7280; flex-shrink: 0; }
.cal-row dd { color: #111827; font-weight: 600; text-align: right; min-width: 0; word-break: break-word; }
.cal-me { display: inline-block; margin-left: 6px; font-size: 0.6875rem; font-weight: 700; color: #2563eb; background: #eff6ff; border-radius: 6px; padding: 1px 6px; vertical-align: middle; }
.cal-chip { display: inline-block; margin-left: 6px; font-size: 0.6875rem; font-weight: 700; color: #475569; background: #f1f5f9; border-radius: 6px; padding: 1px 6px; }
.cal-chip--red { color: #b91c1c; background: #fef2f2; }

.cal-note { display: flex; gap: 8px; align-items: flex-start; margin-top: 14px; padding: 10px 12px; border-radius: 12px; background: #f8fafc; color: #64748b; font-size: 0.75rem; line-height: 1.45; }
.cal-note__icon { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }
</style>

<style>
/* Forma qismi (slot) uchun umumiy klasslar — slot ota sahifa scope'ida kompilyatsiya qilinadi,
   shu sabab scoped EMAS; nomlar `cal-f-` prefiksi bilan (to'qnashuv bo'lmasligi uchun). */
.cal-f-title { font-size: 1.0625rem; font-weight: 800; color: #111827; margin-bottom: 12px; }
.cal-f-intro { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.875rem; padding: 1.125rem 1.25rem; font-size: 0.9375rem; color: #374151; line-height: 1.65; }
.cal-f-intro a { color: #2563eb; font-weight: 700; }
.cal-f-intro a:hover { text-decoration: underline; }
.cal-f-intro p + p { margin-top: 6px; }
.cal-f-divider { margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; }
.cal-f-label { display: block; font-size: 0.8125rem; font-weight: 700; color: #4b5563; margin: 22px 0 8px; }
.cal-f-input { width: 100%; height: 50px; padding: 0 1rem; border: 1.5px solid #e2e8f0; border-radius: 0.75rem; font-size: 1.0625rem; font-weight: 600; color: #0f172a; background: #fff; transition: border-color .2s, box-shadow .2s; }
.cal-f-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12); }
.cal-f-input::placeholder { color: #94a3b8; font-weight: 400; }
.cal-f-hint { font-size: 0.75rem; color: #6b7280; margin-top: 6px; }
.cal-f-check { display: flex; align-items: flex-start; gap: 10px; margin-top: 22px; padding: 12px 14px; border-radius: 0.75rem; background: #f8fafc; border: 1px dashed #cbd5e1; }
.cal-f-check input { width: 20px; height: 20px; flex-shrink: 0; margin-top: 1px; cursor: pointer; }
.cal-f-check a { color: #2563eb; font-size: 0.875rem; font-weight: 600; text-decoration: underline; }
.cal-f-actions { display: flex; justify-content: flex-end; margin-top: 26px; }
.cal-f-submit { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-width: 220px; padding: 0.875rem 2rem; font-weight: 700; font-size: 0.9375rem; border-radius: 0.75rem; border: none; cursor: pointer; transition: background .2s, box-shadow .2s, transform .2s; color: #fff; background: #3b82f6; box-shadow: 0 6px 16px -6px rgba(59, 130, 246, 0.55); }
.cal-f-submit:hover:not(:disabled) { background: #2563eb; transform: translateY(-1px); }
.cal-f-submit--red { background: #ef4444; box-shadow: 0 6px 16px -6px rgba(239, 68, 68, 0.55); }
.cal-f-submit--red:hover:not(:disabled) { background: #dc2626; }
.cal-f-submit--green { background: #059669; box-shadow: 0 6px 16px -6px rgba(5, 150, 105, 0.55); }
.cal-f-submit--green:hover:not(:disabled) { background: #047857; }
.cal-f-submit:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none; }
.cal-f-submit svg { width: 20px; height: 20px; }
@media (max-width: 640px) { .cal-f-actions { justify-content: stretch; } .cal-f-submit { width: 100%; } }
.cal-f-seg { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 5px; border-radius: 0.875rem; background: #f1f5f9; margin-bottom: 18px; }
.cal-f-seg button { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 12px; border-radius: 0.625rem; font-weight: 700; font-size: 0.9375rem; color: #475569; background: transparent; border: none; cursor: pointer; transition: background .15s, color .15s, box-shadow .15s; }
.cal-f-seg button:hover { color: #0f172a; }
.cal-f-seg button.is-on { background: #fff; color: #0f172a; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12); }
.cal-f-seg button svg { width: 18px; height: 18px; }
.cal-form .form-date-picker .mx-datepicker { max-width: none !important; }
.cal-form .form-date-picker .mx-input { height: 50px; border: 1.5px solid #e2e8f0; border-radius: 0.75rem; box-shadow: none; font-size: 1rem; font-weight: 600; padding-left: 14px; }
.cal-form .form-date-picker .mx-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12); }
.cal-f-seg-desc { font-size: 0.8125rem; color: #6b7280; margin: -8px 0 16px; }
</style>
