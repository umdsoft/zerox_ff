<template>
  <!-- 11.10 (sayt hujjati, 8-rasm): SHAXSIY QARZ kiritish eslatmasi — Qarz daftaridagi do'kon eslatmasi
       kabi (orqa fon blur). Yoqilsa, belgilangan kun va vaqtda, so'nggi 2 hafta ichida bitta ham shaxsiy
       qarz kiritilmagan bo'lsa bildirishnomalarga eslatma (Ok + Shaxsiy qarz). Avto-saqlanadi.
       GET/PUT /finance/debt-reminder  { enabled, time:'HH:MM', days:[0..6] } -->
  <div
    class="fixed inset-0 flex items-center justify-center p-4"
    style="z-index: 100; background-color: rgba(17, 24, 39, 0.45); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"
    @click.self="close"
  >
    <div
      class="w-full max-w-md overflow-y-auto rounded-2xl bg-gray-50 shadow-2xl"
      style="max-height: 92vh"
      role="dialog"
      aria-modal="true"
      :aria-label="tx.title"
    >
      <div class="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-4">
        <span class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="text-lg font-semibold leading-tight text-gray-900">{{ tx.title }}</h3>
          <p class="truncate text-sm text-gray-500">{{ tx.subtitle }}</p>
        </div>
        <button
          type="button"
          class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :aria-label="tx.close"
          :title="tx.close"
          @click="close"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="space-y-3 p-4 sm:p-5">
        <p class="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900">{{ tx.intro }}</p>

        <div v-if="loading" class="flex justify-center py-8">
          <svg class="h-6 w-6 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" /></svg>
        </div>

        <section v-else class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="min-w-0 flex-1">
              <h4 class="text-sm font-semibold text-gray-900">{{ sx.remTitle }}</h4>
            </div>
            <span v-if="status === 'saved'" class="text-xs font-medium text-emerald-600">{{ sx.remSaved }}</span>
            <button
              type="button"
              role="switch"
              :aria-checked="rem.enabled ? 'true' : 'false'"
              :aria-label="sx.remTitle"
              :class="rem.enabled ? 'bg-blue-600' : 'bg-gray-300'"
              class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              @click="toggleEnabled"
            >
              <span :class="rem.enabled ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"></span>
            </button>
          </div>

          <div :class="['mt-4 space-y-3', rem.enabled ? '' : 'pointer-events-none']" :style="rem.enabled ? '' : 'opacity: 0.45'">
            <div class="flex items-center justify-between gap-3">
              <label class="text-xs font-semibold text-gray-600" :for="timeId">{{ sx.remTime }}</label>
              <input
                :id="timeId"
                v-model="rem.time"
                type="time"
                step="300"
                class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold tabular-nums text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @change="schedule"
              />
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-xs font-semibold text-gray-600">{{ sx.remRepeat }}</span>
              <span class="truncate text-xs text-gray-500">{{ repeatLabel }}</span>
            </div>
            <div class="grid grid-cols-7 gap-1.5">
              <button
                v-for="w in week"
                :key="w.day"
                type="button"
                :aria-pressed="rem.days.includes(w.day) ? 'true' : 'false'"
                :class="['rounded-lg border py-2 text-xs font-semibold transition-colors', rem.days.includes(w.day) ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-400 hover:border-gray-300']"
                @click="toggleDay(w.day)"
              >{{ w.label }}</button>
            </div>
            <p v-if="rem.enabled && !rem.days.length" class="text-xs text-amber-600">{{ sx.remNoDays }}</p>
            <p class="text-xs leading-relaxed text-gray-400">{{ tx.hint }}</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { shopEditTexts } from '@/utils/shopEditTexts'

const TX = {
  uz: { title: 'Eslatma', subtitle: 'Shaxsiy qarz kiritishni eslatish', close: 'Yopish', intro: "Belgilangan kunlarda va vaqtda shaxsiy qarzlaringizni kiritishni eslatamiz.", hint: "Eslatma faqat so'nggi 2 hafta ichida bitta ham shaxsiy qarz kiritilmagan bo'lsa bildirishnomalarga yuboriladi.", error: 'Xatolik yuz berdi' },
  kr: { title: 'Эслатма', subtitle: 'Шахсий қарз киритишни эслатиш', close: 'Ёпиш', intro: 'Белгиланган кунларда ва вақтда шахсий қарзларингизни киритишни эслатамиз.', hint: 'Эслатма фақат сўнгги 2 ҳафта ичида битта ҳам шахсий қарз киритилмаган бўлса билдиришномаларга юборилади.', error: 'Хатолик юз берди' },
  ru: { title: 'Напоминание', subtitle: 'Напоминать о внесении личных долгов', close: 'Закрыть', intro: 'В выбранные дни и время мы напомним внести ваши личные долги.', hint: 'Напоминание отправляется в уведомления, только если за последние 2 недели не внесено ни одного личного долга.', error: 'Произошла ошибка' },
  en: { title: 'Reminder', subtitle: 'Remind to enter personal debts', close: 'Close', intro: 'On the selected days and time we will remind you to enter your personal debts.', hint: 'The reminder is sent to notifications only if no personal debt has been entered in the last 2 weeks.', error: 'Something went wrong' },
  kaa: { title: 'Eskertpe', subtitle: 'Jeke qarız kiritiwdi eskertiw', close: 'Jabıw', intro: 'Belgilengen kúnlerde hám waqıtta jeke qarızlarıńızdı kiritiwdi eskertemiz.', hint: 'Eskertpe tek sońǵı 2 hápte ishinde birde-bir jeke qarız kiritilmegen bolsa xabarlamalarǵa jiberiledi.', error: 'Qátelik júz berdi' },
}
const TX_FINANCE = {
  uz: { title: 'Eslatma', subtitle: 'Daromad va xarajat kiritishni eslatish', close: 'Yopish', intro: "Belgilangan kunlarda va vaqtda kunlik daromad va xarajatlaringizni kiritishni eslatamiz — Telegram bot va mobil ilova orqali.", hint: "Eslatma faqat o'sha kuni bitta ham daromad yoki xarajat kiritilmagan bo'lsa yuboriladi.", error: 'Xatolik yuz berdi' },
  kr: { title: 'Эслатма', subtitle: 'Даромад ва харажат киритишни эслатиш', close: 'Ёпиш', intro: 'Белгиланган кунларда ва вақтда кунлик даромад ва харажатларингизни киритишни эслатамиз — Telegram бот ва мобил илова орқали.', hint: 'Эслатма фақат ўша куни битта ҳам даромад ёки харажат киритилмаган бўлса юборилади.', error: 'Хатолик юз берди' },
  ru: { title: 'Напоминание', subtitle: 'Напоминать о вводе доходов и расходов', close: 'Закрыть', intro: 'В выбранные дни и время мы напомним внести доходы и расходы за день — через Telegram-бот и мобильное приложение.', hint: 'Напоминание отправляется, только если в этот день не внесено ни одного дохода или расхода.', error: 'Произошла ошибка' },
  en: { title: 'Reminder', subtitle: 'Remind to enter income and expenses', close: 'Close', intro: "On the selected days and time we will remind you to enter the day's income and expenses — via the Telegram bot and the mobile app.", hint: 'The reminder is sent only if no income or expense has been entered that day.', error: 'Something went wrong' },
  kaa: { title: 'Eskertpe', subtitle: 'Dáramat hám qárejet kiritiwdi eskertiw', close: 'Jabıw', intro: 'Belgilengen kúnlerde hám waqıtta kúndelikli dáramat hám qárejetlerińizdi kiritiwdi eskertemiz — Telegram bot hám mobil qosımsha arqalı.', hint: 'Eskertpe tek sol kúni birde-bir dáramat yamasa qárejet kiritilmegen bolsa jiberiledi.', error: 'Qátelik júz berdi' },
}
/** 13.10: bir xil oyna — shaxsiy qarz ('pdebt') va shaxsiy moliya ('finance') eslatmasi */
const KINDS = {
  pdebt: { endpoint: '/finance/debt-reminder', tx: TX },
  finance: { endpoint: '/finance/daily-reminder', tx: TX_FINANCE },
}
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
const SAVE_DELAY_MS = 500

export default {
  name: 'PersonalDebtReminderModal',
  props: {
    // 13.10 ("Shaxsiy moliya yangi sayt 12.10", 1–2-rasm): Shaxsiy moliya sahifasida ham shu oyna
    kind: { type: String, default: 'pdebt', validator: (v) => ['pdebt', 'finance'].includes(v) },
  },
  data() {
    return {
      loading: true,
      rem: { enabled: false, time: '21:00', days: [0, 1, 2, 3, 4, 5, 6] },
      savedKey: '',
      status: 'idle',
      timer: null,
      uid: Math.random().toString(36).slice(2, 8),
    }
  },
  computed: {
    locale() { return (this.$i18n && this.$i18n.locale) || 'uz' },
    cfg() { return KINDS[this.kind] || KINDS.pdebt },
    tx() { return this.cfg.tx[this.locale] || this.cfg.tx.uz },
    /** Hafta kunlari, vaqt va takrorlash matnlari — do'kon eslatmasi bilan bir xil */
    sx() { return shopEditTexts(this.locale) },
    timeId() { return `pd-rem-time-${this.uid}` },
    week() { return [1, 2, 3, 4, 5, 6, 0].map((day, i) => ({ day, label: this.sx.remDays[i] })) },
    repeatLabel() {
      const set = new Set(this.rem.days)
      if (set.size === 7) return this.sx.remEveryDay
      if (set.size === 5 && [1, 2, 3, 4, 5].every((d) => set.has(d))) return this.sx.remWorkdays
      if (set.size === 2 && set.has(0) && set.has(6)) return this.sx.remWeekend
      return this.week.filter((w) => set.has(w.day)).map((w) => w.label).join(', ')
    },
  },
  mounted() {
    document.addEventListener('keydown', this.onKeydown)
    this.load()
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
    clearTimeout(this.timer)
  },
  methods: {
    onKeydown(e) { if (e.key === 'Escape') this.close() },
    keyOf(r) { return JSON.stringify([!!r.enabled, r.time, [...r.days].sort()]) },
    async load() {
      try {
        const res = await this.$axios.$get(this.cfg.endpoint, { silent: true })
        const d = res && res.data
        if (d) {
          this.rem = { enabled: !!d.enabled, time: d.time || '21:00', days: Array.isArray(d.days) ? d.days : [] }
          this.savedKey = this.keyOf(this.rem)
        }
      } catch (_) {
        // yuklanmasa — standart qiymatlar (o'chirilgan, 21:00, har kuni)
      } finally {
        this.loading = false
      }
    },
    toggleEnabled() {
      this.rem.enabled = !this.rem.enabled
      if (this.rem.enabled && !this.rem.days.length) this.rem.days = [0, 1, 2, 3, 4, 5, 6]
      this.schedule()
    },
    toggleDay(day) {
      this.rem.days = this.rem.days.includes(day) ? this.rem.days.filter((d) => d !== day) : [...this.rem.days, day]
      this.schedule()
    },
    schedule() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => { this.save() }, SAVE_DELAY_MS)
    },
    async save() {
      clearTimeout(this.timer)
      this.timer = null
      const r = { enabled: this.rem.enabled, time: this.rem.time, days: [...this.rem.days] }
      if (this.keyOf(r) === this.savedKey) return true
      if ((r.enabled && !r.days.length) || !TIME_RE.test(r.time)) return false
      try {
        await this.$axios.$put(this.cfg.endpoint, r, { silent: true })
        this.savedKey = this.keyOf(r)
        this.status = 'saved'
        this.$emit('saved', r)
        return true
      } catch (e) {
        this.status = 'error'
        if (this.$toast && this.$toast.error) this.$toast.error((e && e.response && e.response.data && e.response.data.message) || this.tx.error)
        return false
      }
    },
    async close() {
      if (this.timer) await this.save()
      this.$emit('close')
    },
  },
}
</script>
