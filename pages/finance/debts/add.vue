<template>
  <div class="add-debt pb-8">
    <!-- Page Header -->
    <div class="mb-3">
      <nuxt-link :to="localePath({ name: 'finance-debts' })" class="text-blue-600 hover:text-blue-700 text-sm mb-1 inline-block">
        ← {{ $t('common.back') }}
      </nuxt-link>
      <h1 class="text-xl lg:text-2xl font-bold text-gray-900">{{ typeLocked ? (form.type === 'lent' ? $t('finance.debt_give') : $t('finance.debt_take')) : $t('finance.add_debt') }}</h1>
    </div>

    <!-- Form: to'liq kenglik, 2-ustun grid (bir oynaga sig'adi) -->
    <div class="bg-white rounded-2xl p-6 shadow-sm">
      <form @submit.prevent="submitForm">
        <!-- SS-G: "Qarz turi" tanlovi — faqat hero'dan KELMAGANDA ko'rsatiladi -->
        <div v-if="!typeLocked" class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ $t('finance.debt_type') }}</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.type = 'borrowed'"
              class="p-2.5 rounded-xl border-2 transition-all text-left flex items-center gap-2.5"
              :class="form.type === 'borrowed' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
              </div>
              <div class="min-w-0">
                <span class="font-semibold block leading-tight" :class="form.type === 'borrowed' ? 'text-red-700' : 'text-gray-700'">{{ $t('finance.borrowed') }}</span>
                <span class="text-xs text-gray-500 block leading-tight">{{ $t('finance.borrowed_desc') }}</span>
              </div>
            </button>

            <button
              type="button"
              @click="form.type = 'lent'"
              class="p-2.5 rounded-xl border-2 transition-all text-left flex items-center gap-2.5"
              :class="form.type === 'lent' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                </svg>
              </div>
              <div class="min-w-0">
                <span class="font-semibold block leading-tight" :class="form.type === 'lent' ? 'text-green-700' : 'text-gray-700'">{{ $t('finance.lent') }}</span>
                <span class="text-xs text-gray-500 block leading-tight">{{ $t('finance.lent_desc') }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Maydonlar: 2 ustun (md+) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          <!-- SS-11 (2026-09-18): FISH i yo'q (telefon orqali ro'yxatdan o'tgan) foydalanuvchi
               birinchi qarzда O'Z FISH ini kiritadi — SMS/hujjatda "kim berdi/oldi" ko'rinsin. -->
          <div v-if="needFish" class="md:col-span-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
            <label class="block text-sm font-semibold text-blue-800 mb-1">Sizning FISH ingiz *</label>
            <p class="text-xs text-blue-600 mb-2">Qarz haqidagi SMS va hujjatda sizning ismingiz ko‘rsatiladi. Bir marta kiritiladi.</p>
            <input v-model="myFish" type="text" maxlength="100" placeholder="Familiya Ism Otasining ismi" class="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white" />
          </div>
          <!-- Person Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.person_name') }} *</label>
            <input
              v-model="form.source_name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :placeholder="$t('finance.person_name_placeholder')"
            />
          </div>

          <!-- Phone (ixtiyoriy) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.debt_phone') }}</label>
            <input
              :value="form.phone"
              @input="onPhoneInput"
              type="tel"
              inputmode="tel"
              placeholder="+998 90 123 45 67"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.amount') }} *</label>
            <div class="relative">
              <input
                v-model="amountDisplay"
                type="text"
                inputmode="numeric"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16"
                placeholder="100 000"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{{ form.currency }}</span>
            </div>
          </div>

          <!-- Currency -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.currency') }}</label>
            <div class="flex gap-3">
              <button
                type="button"
                @click="form.currency = 'UZS'"
                class="flex-1 py-2.5 rounded-xl font-medium transition-colors"
                :class="form.currency === 'UZS' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >UZS</button>
              <button
                type="button"
                @click="form.currency = 'USD'"
                class="flex-1 py-2.5 rounded-xl font-medium transition-colors"
                :class="form.currency === 'USD' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >USD</button>
            </div>
          </div>

          <!-- Debt Date (o'zbekcha date-picker) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.debt_date') }} *</label>
            <date-picker
              v-model="form.start_date"
              value-type="YYYY-MM-DD"
              format="DD.MM.YYYY"
              :lang="dpLang"
              :editable="false"
              :clearable="false"
              placeholder="kun.oy.yil"
              class="w-full"
              input-class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Due Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.due_date') }}</label>
            <date-picker
              v-model="form.due_date"
              value-type="YYYY-MM-DD"
              format="DD.MM.YYYY"
              :lang="dpLang"
              :editable="false"
              :disabled-date="disabledDueDate"
              placeholder="kun.oy.yil"
              class="w-full"
              input-class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <!-- Description (to'liq kenglik, ixcham) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('finance.notes') }}</label>
            <textarea
              v-model="form.notes"
              rows="1"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              :placeholder="$t('finance.notes_placeholder')"
            ></textarea>
          </div>

          <!-- SMS xabarnoma toggle (to'liq kenglik) -->
          <div class="md:col-span-2">
            <div class="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-xl">
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-800">📩 {{ $t('finance.debt_notify_sms') }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ $t('finance.debt_notify_sms_hint') }}</p>
              </div>
              <button
                type="button"
                @click="form.notify_sms = !form.notify_sms"
                :class="form.notify_sms ? 'bg-blue-600' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none mt-0.5"
              >
                <span :class="form.notify_sms ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold transition-colors"
        >
          <span v-if="loading">{{ $t('common.loading') }}</span>
          <span v-else>{{ $t('common.save') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddDebt',
  middleware: 'auth',

  data() {
    // SS6: hero'dagi "Qarz berish"/"Qarz olish" tugmalari ?type= bilan turni oldindan tanlaydi
    const q = (this.$route && this.$route.query) || {}
    const qType = q.type || ''
    // SS-27 (2026-09-19): kontragent sahifasidan ("Qarz berish"/"Qarz olish") kelinganda
    // FISh va telefon oldindan to'ldiriladi — foydalanuvchi qayta yozmasin.
    const qName = String(q.name || '').trim().slice(0, 100)
    const qPhone = String(q.phone || '').replace(/[^\d+]/g, '').slice(0, 13)
    return {
      // SS-G (2026-09-18): hero'dan kelinganda tur ANIQ — "Qarz turi" tanlovi yashiriladi.
      typeLocked: (qType === 'lent' || qType === 'borrowed'),
      // SS-11: FISH i yo'q foydalanuvchi uchun "Sizning FISH" maydoni.
      needFish: false,
      myFish: '',
      form: {
        type: (qType === 'lent' || qType === 'borrowed') ? qType : 'borrowed',
        source_name: qName,
        phone: qPhone && qPhone.startsWith('+') ? qPhone : (qPhone ? '+' + qPhone : '+998'),
        amount: '',
        currency: 'UZS',
        source_type: 'other',
        start_date: new Date().toISOString().split('T')[0],
        due_date: '',
        notes: '',
        notify_sms: false
      },
      loading: false
    }
  },

  // SS-11: FISH i yo'q (telefon orqali ro'yxatdan o'tgan) foydalanuvchini aniqlaymiz.
  async created() {
    try {
      const res = await this.$api.getMe()
      const u = (res && res.data && (res.data.data || res.data)) || {}
      const fish = [u.last_name, u.first_name, u.middle_name].map((x) => String(x || '').trim()).filter(Boolean).join(' ')
      this.needFish = !fish
    } catch (_) { this.needFish = false }
  },

  computed: {
    // Datepicker o'zbek/rus lokali (дд.мм.гггг o'rniga o'zbekcha)
    dpLang() {
      const loc = (this.$i18n && this.$i18n.locale) || 'uz'
      return loc === 'kr' ? 'uz-Cyrl' : (loc === 'ru' ? 'ru' : 'uz-Latn')
    },
    // Summa mingtalik ajratgich bilan ko'rsatiladi (100 000), ichkarida toza raqam saqlanadi
    amountDisplay: {
      get() {
        if (this.form.amount === '' || this.form.amount == null) return ''
        return String(this.form.amount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      },
      set(val) {
        const raw = String(val).replace(/\D/g, '')
        this.form.amount = raw ? Number(raw) : ''
      }
    }
  },

  methods: {
    // Telefon: +998 avtomatik + guruhlab ("+998 90 123 45 67")
    formatUzPhone(raw) {
      let d = String(raw == null ? '' : raw).replace(/\D/g, '')
      if (!d.startsWith('998')) { d = d.startsWith('0') ? '998' + d.slice(1) : '998' + d }
      d = d.slice(0, 12)
      const rest = d.slice(3)
      let out = '+998'
      if (rest.length) out += ' ' + rest.slice(0, 2)
      if (rest.length > 2) out += ' ' + rest.slice(2, 5)
      if (rest.length > 5) out += ' ' + rest.slice(5, 7)
      if (rest.length > 7) out += ' ' + rest.slice(7, 9)
      return out
    },
    onPhoneInput(e) {
      this.form.phone = this.formatUzPhone(e && e.target ? e.target.value : '')
    },
    // SS-6 (2026-09-18): qaytarish muddati qarz sanasidan OLDIN bo'lolmaydi (kalendarda bloklanadi).
    disabledDueDate(date) {
      if (!this.form.start_date) return false
      const start = new Date(this.form.start_date + 'T00:00:00')
      return date < start
    },
    async submitForm() {
      try {
        // SS-6: himoya — muddat qarz sanasidan oldin bo'lsa saqlamaymiz.
        if (this.form.due_date && this.form.start_date && this.form.due_date < this.form.start_date) {
          this.$toast?.error('Qaytarish muddati qarz sanasidan oldin bo‘lishi mumkin emas')
          return
        }
        // SS-11: FISH i yo'q bo'lsa — avval o'z FISH ini saqlaymiz (bir marta), so'ng qarz.
        if (this.needFish) {
          const fish = String(this.myFish || '').trim()
          if (fish.length < 3) { this.$toast?.error('Iltimos, o‘z FISH ingizni kiriting'); return }
          this.loading = true
          await this.$api.setFish(fish)
          this.needFish = false
        }
        this.loading = true
        const res = await this.$api.createDebt(this.form)
        if (res?.data?.success) {
          this.$toast?.success(this.$t('finance.debt_added'))
          this.$router.push(this.localePath({ name: 'finance-debts' }))
        }
      } catch (error) {
        console.error('Create debt error:', error)
        this.$toast?.error(error.response?.data?.message || this.$t('errors.operationFailed'))
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
