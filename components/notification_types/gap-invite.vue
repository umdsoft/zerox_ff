<template>
  <div>
    <!-- SS15: uchrashuv JOYI kiritilmagan bo'lsa bu taklif emas, faqat to'lov
         ogohlantirishi — sarlavha shunga mos bo'ladi. -->
    <p class="text-gray-700 mb-2">
      <b>{{ d && !d.venue ? $t('finance.gap_payment_notice_title') : $t('finance.gap_invite_title') }}</b>
    </p>

    <!-- Tafsilot yuklanmoqda -->
    <p v-if="loading" class="mt-2 text-sm text-gray-400">{{ $t('common.loading') }}</p>

    <!-- Tafsilot olinmadi (gap o'chirilgan / ruxsat yo'q) — matnsiz qolmasin -->
    <p v-else-if="!d" class="mt-2 text-sm text-gray-500">
      {{ $t('finance.gap_invite_gone') }}
    </p>

    <template v-else>
      <p class="mt-2 text-gray-700">
        <b>{{ d.gap_name }}</b> —
        {{ $t('finance.gap_round') }} <b>{{ d.round_no }}</b>.
        <span v-if="d.recipient_name">
          {{ $t('finance.gap_recipient') }}: <b>{{ d.recipient_name }}</b>.
        </span>
        <span v-if="d.due_date"> {{ $t('finance.gap_due') }}: <b>{{ fmtDate(d.due_date) }}</b>.</span>
      </p>

      <div class="mt-3 rounded-xl bg-gray-50 border border-gray-100 p-3 text-sm space-y-1">
        <p v-if="d.venue">
          <span class="text-gray-500">{{ $t('finance.gap_venue') }}:</span>
          <b class="text-gray-800">{{ d.venue }}</b>
          <a
            v-if="d.location"
            :href="d.location"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-500 ml-2 underline"
          >{{ $t('finance.gap_open_map') }}</a>
        </p>
        <p v-if="d.card_number" class="flex items-center flex-wrap gap-1">
          <span class="text-gray-500">{{ $t('finance.gap_card') }}:</span>
          <b class="text-gray-800" style="font-family: monospace; letter-spacing: 1px;">{{ fmtCard(d.card_number) }}</b>
          <span v-if="d.card_holder" class="text-gray-500"> ({{ d.card_holder }})</span>
          <!-- SS1 (2026-09-17): "Nusxa" matni olib tashlandi — faqat nusxalash ikonasi -->
          <button type="button" @click="copyCard(d.card_number)"
                  :title="$t('finance.gap_card_copy') || 'Nusxa'"
                  :aria-label="$t('finance.gap_card_copy') || 'Nusxa'"
                  class="ml-1 inline-flex items-center justify-center text-blue-600 p-1 rounded-md bg-blue-50 hover:bg-blue-100">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </button>
        </p>
        <p v-if="d.amount">
          <span class="text-gray-500">{{ $t('finance.amount') }}:</span>
          <b class="text-gray-800">{{ formatMoney(d.amount) }} {{ d.currency }}</b>
        </p>
      </div>

      <!-- Davomat javobi: tanlangan variant belgilanadi.
           SS15: FAQAT uchrashuv joyi kiritilgan bo'lsa — joy noma'lum bo'lsa
           a'zo "boraman" deb javob bera olmaydi. -->
      <div v-if="d.venue" class="mt-3 flex flex-wrap gap-2">
        <button
          :disabled="busy"
          @click="answer('going')"
          :class="[
            'py-1.5 px-4 rounded-lg text-sm font-semibold border transition disabled:opacity-60',
            attendance === 'going'
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-500'
          ]"
        >
          {{ $t('finance.gap_going') }}
        </button>
        <button
          :disabled="busy"
          @click="answer('not_going')"
          :class="[
            'py-1.5 px-4 rounded-lg text-sm font-semibold border transition disabled:opacity-60',
            attendance === 'not_going'
              ? 'bg-rose-600 border-rose-600 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:border-rose-500'
          ]"
        >
          {{ $t('finance.gap_not_going') }}
        </button>
      </div>
    </template>

    <div class="notification-actions">
      <div>
        <span><b>{{ $t('comp.time') }}:</b> {{ item.created }} {{ item && item.time ? item.time.slice(0, 5) : '' }}</span>
      </div>
      <div class="notification-actions__buttons">
        <button v-if="d" @click="openGap" class="bg-blue-500 py-1 px-4 rounded text-white">
          {{ $t('finance.gap_open') }}
        </button>
        <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
          Ok
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * gap-invite.vue — SS4: Gap davrasiga TAKLIF bildirishnomasi (type = 40).
 *
 * "Taklif yuborish" bosilganda backend a'zolarga Telegram xabari bilan BIRGA
 * ilova ichidagi bildirishnoma (notifications, type=40) yozadi. Bildirishnomalar
 * ro'yxati faqat gap_id/gap_round_id beradi — joy, karta va summa tafsiloti shu
 * yerda `GET /finance/gap/invite/:roundId` orqali olinadi.
 */
import notificationMixin from '~/mixins/notificationMixin'

export default {
  name: 'GapInvite',
  mixins: [notificationMixin],

  data() {
    return { d: null, loading: true, busy: false, attendance: null }
  },

  mounted() {
    this.load()
  },

  methods: {
    async load() {
      const roundId = this.item && this.item.gap_round_id
      if (!roundId) { this.loading = false; return }
      try {
        const res = await this.$api.getGapInvite(roundId)
        if (res && res.data && res.data.success) {
          this.d = res.data.data
          this.attendance = this.d.my_attendance || null
        }
      } catch (e) {
        // Gap o'chirilgan yoki a'zolikdan chiqarilgan — kartada tushuntiriladi.
        this.d = null
      } finally {
        this.loading = false
      }
    },

    async answer(status) {
      if (this.busy || !this.d) return
      this.busy = true
      try {
        const res = await this.$api.setGapAttendance(this.d.gap_id, this.d.round_id, status)
        if (res && res.data && res.data.success) {
          // SS-A: server BIRINCHI javobни saqlaydi — haqiqiy statusни ko'rsatamiz.
          const actual = (res.data.data && res.data.data.status) || status
          this.attendance = actual
          if (res.data.already) {
            this.$toast.info ? this.$toast.info('Javobingiz allaqachon qabul qilingan') : this.$toast.success('Javobingiz allaqachon qabul qilingan')
          } else {
            this.$toast.success(this.$t('messages.success'))
          }
        }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('messages.error_occurred'))
      } finally {
        this.busy = false
      }
    },

    openGap() {
      this.$router.push(this.localePath({ name: 'finance-gap-id', params: { id: this.d.gap_id } }))
    },

    // SS (2026-09-18): sanani "YYYY-MM-DD" → "DD.MM.YYYY" ko'rinishida chiqarish.
    fmtDate(d) {
      if (!d) return ''
      const m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})/)
      return m ? `${m[3]}.${m[2]}.${m[1]}` : String(d)
    },

    // SS11: plastik kartani 4 xonadan guruhlab: "8600 0000 0000 0000".
    fmtCard(c) {
      const digits = String(c || '').replace(/\D/g, '')
      if (!digits) return String(c || '')
      return digits.replace(/(.{4})(?=.)/g, '$1 ')
    },

    // SS11: kartani bir bosishда nusxalash.
    copyCard(c) {
      const digits = String(c || '').replace(/\D/g, '') || String(c || '')
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(digits)
        } else {
          const t = document.createElement('textarea')
          t.value = digits; document.body.appendChild(t); t.select()
          document.execCommand('copy'); document.body.removeChild(t)
        }
        this.$toast && this.$toast.success && this.$toast.success(this.$t('finance.gap_card_copied') || 'Karta raqami nusxalandi')
      } catch (e) { /* nusxalash imkonsiz — jim */ }
    }
  }
}
</script>

<style></style>
