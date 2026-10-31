<template>
  <!-- 23.10 ("Shaxsiy moliya yangi sayt 22.10", 2-rasm): Oila moliyasi TAKLIFI (type 48).
       Ro'yxat qatorida: family_member_id, fm_status, fm_role, fm_owner_name, fm_relation_label.
       "Ruxsat berish" / "Rad etish" — POST /finance/family/:id/respond (sahifa va Telegram tugmasi bilan
       bir xil mantiq; ko'rib chiqilgan taklif → 400 code 'already-handled' + joriy status). -->
  <div>
    <p class="text-gray-700 mb-2"><b>👨‍👩‍👧 {{ tx.nTitle }}</b></p>

    <p class="mt-2 text-gray-700 leading-relaxed">{{ bodyText }}</p>
    <p v-if="item.fm_relation_label" class="mt-1 text-sm text-gray-500">{{ tx.nRelation }}: <b class="text-gray-700">{{ item.fm_relation_label }}</b></p>

    <div class="mt-3 flex flex-wrap items-center gap-2">
      <template v-if="status === 'pending'">
        <button
          type="button"
          :disabled="busy"
          class="py-1.5 px-4 rounded-lg text-sm font-semibold border transition bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700" :class="{ 'opacity-60': busy }"
          @click="respond('accept')"
        >✓ {{ tx.nAllow }}</button>
        <button
          type="button"
          :disabled="busy"
          class="py-1.5 px-4 rounded-lg text-sm font-semibold border transition bg-white border-gray-200 text-gray-700 hover:border-rose-500 hover:text-rose-600" :class="{ 'opacity-60': busy }"
          @click="respond('reject')"
        >✕ {{ tx.nReject }}</button>
      </template>
      <span v-else-if="status === 'active'" class="py-1.5 px-3 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700">✓ {{ tx.nAccepted }}</span>
      <span v-else-if="status === 'rejected'" class="py-1.5 px-3 rounded-lg text-sm font-semibold bg-gray-100 text-gray-600">✕ {{ tx.nRejected }}</span>
      <span v-else class="py-1.5 px-3 rounded-lg text-sm font-semibold bg-gray-100 text-gray-500">{{ tx.nGone }}</span>
      <button
        type="button"
        class="py-1.5 px-4 rounded-lg text-sm font-semibold border transition bg-white border-gray-200 text-indigo-600 hover:border-indigo-500"
        @click="openFamily"
      >{{ tx.nOpen }} →</button>
    </div>

    <div class="notification-actions">
      <div>
        <span><b>{{ $t('comp.time') }}:</b> {{ item.created }} {{ item && item.time ? String(item.time).slice(0, 5) : '' }}</span>
      </div>
      <div class="notification-actions__buttons">
        <button class="bg-blue-500 py-1 px-4 mx-2 rounded text-white" @click="ok(item.id)">Ok</button>
      </div>
    </div>
  </div>
</template>

<script>
import notificationMixin from '~/mixins/notificationMixin'
import FAM_TEXTS from '@/utils/familyTexts'
import { postFamilyRespond } from '@/api/finance';

export default {
  name: 'FamilyInvite',
  mixins: [notificationMixin],
  data() {
    return { busy: false, localStatus: null }
  },
  computed: {
    tx() { return FAM_TEXTS[this.$i18n && this.$i18n.locale] || FAM_TEXTS.uz },
    linkId() { return this.item && (this.item.family_member_id || this.item.familyMemberId) },
    /** pending | active | rejected | revoked | null (taklif o'chirilgan) */
    status() {
      if (this.localStatus) return this.localStatus
      return (this.item && this.item.fm_status) || null
    },
    bodyText() {
      const name = (this.item && this.item.fm_owner_name) || this.tx.nSomeone
      const tpl = this.item && this.item.fm_role === 'watcher' ? this.tx.nWatcher : this.tx.nWatched
      return tpl.replace('{name}', name)
    },
  },
  methods: {
    async respond(action) {
      if (!this.linkId || this.busy) return
      this.busy = true
      try {
        const res = await postFamilyRespond(this.$axios, this.linkId, { action }, {
          silent: true, params: { lang: this.$i18n && this.$i18n.locale },
        })
        const d = res && res.data && res.data.data
        this.localStatus = (d && d.status) || (action === 'accept' ? 'active' : 'rejected')
        this.$toast && this.$toast.success(action === 'accept' ? this.tx.nAcceptedToast : this.tx.nRejectedToast)
      } catch (e) {
        const body = (e && e.response && e.response.data) || {}
        if (body.code === 'already-handled') {
          // Boshqa joyda (sahifa / Telegram / mobil) allaqachon javob berilgan — kartani yangilaymiz.
          this.localStatus = body.status || 'rejected'
          this.$toast && this.$toast.info(body.message || this.tx.nGone)
        } else if (body.code === 'not-found') {
          this.localStatus = 'revoked'
          this.$toast && this.$toast.info(body.message || this.tx.nGone)
        } else {
          this.$toast && this.$toast.error(body.message || this.tx.nError)
        }
      } finally {
        this.busy = false
      }
    },
    openFamily() {
      this.$router.push(this.localePath({ name: 'finance-family' }))
    },
  },
}
</script>
