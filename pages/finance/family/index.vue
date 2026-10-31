<template>
  <div class="family-page pb-10">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-5">
      <!-- 30.09 (doc1 14-rasm): Qarz shartnomasi / Qarz daftaridagidek kvadrat "Orqaga" tugma -->
      <PageBackButton @click="goBack" />
      <div class="flex-1">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ $t('finance.family_title') }}</h1>
        <p class="text-gray-500 text-sm mt-0.5">{{ $t('finance.family_subtitle') }}</p>
      </div>
      <button class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors" @click="openInvite">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        {{ $t('finance.family_add_member') }}
      </button>
    </div>

    <!-- Hero -->
    <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-7 text-white mb-6 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-56 h-56 bg-white opacity-10 rounded-full -translate-y-1/3 translate-x-1/4"></div>
      <div class="relative z-10 flex items-start gap-4">
        <span class="text-5xl">👨‍👩‍👧‍👦</span>
        <div>
          <h2 class="text-xl md:text-2xl font-bold">{{ $t('finance.family_hero') }}</h2>
          <p class="text-indigo-100 mt-1 max-w-2xl">{{ $t('finance.family_hero_desc') }}</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>

    <template v-else>
    <FamilyPendingInvites
      v-if="pending.length"
      :pending="pending"
      :initials="initials"
      :pending-role-text="pendingRoleText"
      :perms-summary="permsSummary"
      :busy-id="busyId"
      :open-accept="openAccept"
      :respond="respond"
    />
    <FamilyBudgetAnalysis :go-budget="goBudget" />
    <FamilyWatchSection
      :ft="ft"
      :open-info="openInfo"
      :as-viewer="asViewer"
      :open-invite-as="openInviteAs"
      :initials="initials"
      :perms-summary="permsSummary"
      :format-money="formatMoney"
      :compact-money="compactMoney"
      :open-overview="openOverview"
      :open-edit-limit="openEditLimit"
      :ask-remove="askRemove"
    />
    <FamilyWatcherSection
      :ft="ft"
      :open-info="openInfo"
      :as-target="asTarget"
      :open-invite-as="openInviteAs"
      :initials="initials"
      :perms-summary="permsSummary"
      :open-edit-perms="openEditPerms"
      :ask-remove="askRemove"
      :format-money="formatMoney"
      :cat-label-by-id="catLabelById"
    />
      <!-- 23.10: umumiy "bo'sh holat" kartasi olib tashlandi — har bo'lim o'z bo'sh holatini ko'rsatadi -->

      <button class="sm:hidden fixed bottom-5 right-5 z-30 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center" @click="openInvite">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
      </button>
    </template>

    <!-- ===== Taklif / Tahrirlash modali ===== -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/50" @click="showForm = false"></div>
      <div class="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-modal shadow-xl flex flex-col" style="max-height: 90vh;">
        <!-- Header (qat'iy) -->
        <div class="px-5 pt-4 pb-2.5 border-b border-gray-100 flex-shrink-0">
          <h3 class="text-base font-bold text-gray-900">{{ accepting ? $t('finance.family_accept_title') : (editing ? $t('finance.family_edit_title') : $t('finance.family_invite_title')) }}</h3>
        </div>
        <!-- Skroll qismi -->
        <div class="px-5 py-3 overflow-y-auto flex-1 min-h-0">

        <!-- B33-2: qabul qilish rejimiда — kim taklif qilgani + izoh -->
        <div v-if="accepting" class="mb-3 bg-indigo-50 rounded-xl p-3">
          <p class="text-sm font-semibold text-indigo-800">{{ accepting.owner_name || '—' }}</p>
          <p class="text-xs text-indigo-600 mt-0.5">{{ pendingRoleText(accepting) }}</p>
        </div>

        <template v-if="!editingPermsOnly && !editingLimitOnly && !accepting">
        <!-- Rol -->
        <div class="mb-3">
          <label class="block text-sm font-semibold text-gray-700 mb-1.5">{{ $t('finance.family_role') }}</label>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" :class="['text-left p-2.5 rounded-xl border-2 transition', form.role === 'watched' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200']" @click="form.role = 'watched'">
              <p class="text-sm font-semibold text-gray-800">👀 {{ $t('finance.family_role_watched') }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ $t('finance.family_role_watched_desc') }}</p>
            </button>
            <button type="button" :class="['text-left p-2.5 rounded-xl border-2 transition', form.role === 'watcher' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200']" @click="form.role = 'watcher'">
              <p class="text-sm font-semibold text-gray-800">🛡️ {{ $t('finance.family_role_watcher') }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ $t('finance.family_role_watcher_desc') }}</p>
            </button>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-3 mb-3">
          <div v-if="!editing">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_phone') }}</label>
            <input :value="form.phone" type="tel" inputmode="tel" placeholder="+99897 734 50 30" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" @input="onFamilyPhoneInput" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_relation') }}</label>
            <input v-model="form.relation_label" type="text" :placeholder="$t('finance.family_relation_ph')" maxlength="50" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
        </template>

        <!-- Ruxsatlar — B33-5: FAQAT target (kuzatuvdagi a'zo) boshqaradi (permsEditable). R7: sliding toggle -->
        <div v-if="permsEditable" class="mb-4">
          <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_perms') }}</label>
          <p class="text-xs text-gray-400 mb-2">{{ accepting ? $t('finance.family_perm_hint_accept') : (editingPermsOnly ? $t('finance.family_perm_hint_target') : (form.role === 'watched' ? $t('finance.family_perm_hint_watched') : $t('finance.family_perm_hint_watcher'))) }}</p>
          <div class="grid sm:grid-cols-2 gap-2">
            <div v-for="s in sectionDefs" :key="s.key" class="p-3 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm text-gray-700">{{ s.icon }} {{ $t('finance.' + s.label) }}</span>
                <button type="button" :class="form.permissions[s.key].view ? 'bg-indigo-600' : 'bg-gray-300'"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none"
                  @click="form.permissions[s.key].view = !form.permissions[s.key].view">
                  <span :class="form.permissions[s.key].view ? 'translate-x-6' : 'translate-x-1'"
                    class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"></span>
                </button>
              </div>
              <div v-if="form.permissions[s.key].view" class="mt-2.5 flex gap-2">
                <button type="button" :class="['text-xs px-3 py-1 rounded-full border transition', form.permissions[s.key].detail === 'full' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:border-indigo-300']" @click="form.permissions[s.key].detail = 'full'">{{ $t('finance.family_detail_full') }}</button>
                <button type="button" :class="['text-xs px-3 py-1 rounded-full border transition', form.permissions[s.key].detail === 'summary' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:border-indigo-300']" @click="form.permissions[s.key].detail = 'summary'">{{ $t('finance.family_detail_summary') }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- "Limit o'rnatish" ruxsati — HAR IKKI rolда (watched'da ham):
             watcher: kuzatuvchi MENGA limit qo'yadi; watched: MEN a'zoga limit qo'yaman.
             Target taklifni qabul qilgach viewer (kuzatuvchi/owner) limit o'rnata oladi. R7: sliding toggle. -->
        <div v-if="permsEditable" class="mb-4">
          <div class="p-3 bg-gray-50 rounded-xl">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-gray-700">💸 {{ $t('finance.family_allow_set_limit') }}</span>
              <button type="button" :class="form.permissions.set_limit ? 'bg-indigo-600' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none"
                @click="form.permissions.set_limit = !form.permissions.set_limit">
                <span :class="form.permissions.set_limit ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"></span>
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-1.5">{{ $t((!accepting && !editingPermsOnly && form.role === 'watched') ? 'finance.family_allow_set_limit_hint_watched' : 'finance.family_allow_set_limit_hint') }}</p>
          </div>
        </div>

        <!-- LIMIT QIYMATLARI — B33-3: faqat "A'zo limiti" (editingLimitOnly) rejimida.
             Taklifда limit qiymati qo'yilmaydi; qabuldan keyin kuzatuvchi qo'yadi. -->
        <template v-if="editingLimitOnly">
          <!-- Umumiy oylik limit -->
          <div class="mb-3">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_overall_limit') }}</label>
            <p class="text-xs text-gray-400 mb-1.5">{{ $t('finance.family_limit_hint') }}</p>
            <div class="flex gap-2">
              <input :value="formatThousands(form.monthly_limit)" type="text" inputmode="numeric" placeholder="0" class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" @input="onLimitInput" />
              <select v-model="form.limit_currency" class="px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option value="UZS">UZS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <!-- Kategoriya bo'yicha limit -->
          <div class="mb-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">{{ $t('finance.family_cat_limits') }}</label>
            <div v-for="(cl, i) in form.category_limits" :key="'fcl'+i" class="flex gap-2 mb-2">
              <select v-model.number="cl.category_id" class="flex-1 min-w-0 px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none">
                <option :value="null" disabled>{{ $t('finance.choose_category') }}</option>
                <!-- R8: boshqa qatorlarda tanlangan kategoriyalar chiqmaydi (dublikat oldini olish) -->
                <option v-for="c in availableCatsFor(i)" :key="c.id" :value="c.id">{{ c.icon }} {{ catName(c.name) }}</option>
              </select>
              <input :value="formatThousands(cl.amount)" type="text" inputmode="numeric" placeholder="0" class="w-28 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none" @input="onCatLimitInput($event, i)" />
              <button type="button" class="px-2 text-gray-400 hover:text-red-600" @click="form.category_limits.splice(i,1)">✕</button>
            </div>
            <button type="button" :disabled="form.category_limits.length >= expenseCategories.length" class="text-sm text-indigo-600 font-medium disabled:opacity-40 disabled:cursor-not-allowed" @click="form.category_limits.push({ category_id: null, amount: '', currency: form.limit_currency })">+ {{ $t('finance.family_cat_limit_add') }}</button>
          </div>
        </template>

        </div>
        <!-- Footer (sticky) -->
        <div class="px-5 py-3 border-t border-gray-100 flex gap-2 flex-shrink-0">
          <button class="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition" @click="showForm = false">{{ $t('common.cancel') }}</button>
          <button :disabled="saving" class="flex-1 py-2.5 disabled:opacity-60 text-white rounded-xl font-semibold transition" :class="accepting ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'" @click="submitForm">{{ accepting ? $t('finance.family_accept') : (editing ? $t('common.save') : $t('finance.family_invite_btn')) }}</button>
        </div>
      </div>
    </div>

    <FamilyOverviewModal
      v-if="showOverview"
      :overview-name="overviewName"
      :overview-change-month="overviewChangeMonth"
      :overview-month-label="overviewMonthLabel"
      :overview-loading="overviewLoading"
      :overview="overview"
      :format-money="formatMoney"
      :overview-balance="overviewBalance"
      :overview-limit-info="overviewLimitInfo"
      :cat-label-by-id="catLabelById"
      :cat-name="catName"
      :pct="pct"
      :has-any-overview="hasAnyOverview"
    />

    <FamilyInfoModal v-if="infoKind" :info-kind-value.sync="infoKind" :ft="ft" />

    <FamilyRemoveModal v-if="showRemove" :saving="saving" :confirm-remove="confirmRemove" />
  </div>
</template>

<script>
import FamilyPendingInvites from '~/components/family/FamilyPendingInvites.vue';
import FamilyBudgetAnalysis from '~/components/family/FamilyBudgetAnalysis.vue';
import FamilyWatchSection from '~/components/family/FamilyWatchSection.vue';
import FamilyWatcherSection from '~/components/family/FamilyWatcherSection.vue';
import FamilyOverviewModal from '~/components/family/FamilyOverviewModal.vue';
import FamilyInfoModal from '~/components/family/FamilyInfoModal.vue';
import FamilyRemoveModal from '~/components/family/FamilyRemoveModal.vue';
import { formatNumberGrouped, initials } from '@/utils/helpers'; // SS-AUDIT (2026-09-25): umumiy formatlovchilar
import PageBackButton from '@/components/ui/PageBackButton.vue' // 30.09 (doc1 14-rasm)
import familyViewMixin from '~/mixins/familyViewMixin.js';
import familyFormatMixin from '~/mixins/familyFormatMixin.js';
export default {
  components: { FamilyPendingInvites, FamilyBudgetAnalysis, FamilyWatchSection, FamilyWatcherSection, FamilyOverviewModal, FamilyInfoModal, FamilyRemoveModal, PageBackButton },
  name: 'FinanceFamily',
  mixins: [familyViewMixin, familyFormatMixin],
  middleware: 'auth',
  data() {
    return {
      loading: true,
      asViewer: [],
      asTarget: [],
      pending: [],
      expenseCategories: [],
      busyId: null,
      showForm: false,
      editing: null,
      editingPermsOnly: false,
      editingLimitOnly: false,
      accepting: null, // B33-2: kelgan taklifni qabul qilishда ruxsat tanlash rejimi (link yoki null)
      saving: false,
      form: this.blankForm(),
      showOverview: false,
      overviewLoading: false,
      overview: null,
      overviewName: '',
      overviewLink: null,
      overviewYear: new Date().getFullYear(),
      overviewMonth: new Date().getMonth() + 1,
      showRemove: false,
      removeTarget: null,
      infoKind: null, // 23.10: 'watch' | 'watcher' — "i" tushuntirish oynasi
      sectionDefs: [
        { key: 'income', label: 'family_sec_income', icon: '➕' },
        { key: 'expense', label: 'family_sec_expense', icon: '➖' },
        { key: 'scheduled_income', label: 'family_sec_sched_income', icon: '⏳' },
        { key: 'scheduled_payment', label: 'family_sec_sched_payment', icon: '🗓' },
        { key: 'goals', label: 'family_sec_goals', icon: '🎯' }
      ]
    }
  },
  async mounted() {
    await Promise.all([this.load(), this.loadCategories()])
  },
  methods: {
    blankPermissions() {
      // Default: daromad/xarajat KO'RINADI va "To'liq (kategoriya bilan)" — a'zo
      // kategoriyalar tarkibini ko'rsin (foydalanuvchi so'rovi). Boshqalari yopiq.
      const p = {}
      ;['income', 'expense', 'scheduled_income', 'scheduled_payment', 'goals'].forEach(k => {
        const on = k === 'income' || k === 'expense'
        p[k] = { view: on, detail: on ? 'full' : 'summary' }
      })
      p.set_limit = false // B30-6: kuzatuvchiga limit o'rnatish huquqi (default: yo'q)
      return p
    },
    blankForm() {
      return { phone: '', relation_label: '', role: 'watched', permissions: this.blankPermissions(), category_limits: [], monthly_limit: '', limit_currency: 'UZS' }
    },
    goBack() { this.$router.push(this.localePath({ name: 'finance' })) },
    goBudget() { this.$router.push(this.localePath({ name: 'finance-family-budget' })) },
    // Ixcham summa (badge uchun): 1 500 000 -> "1.5 mln", 900 000 -> "900 ming"
    compactMoney(v) {
      const n = Number(v) || 0
      if (n >= 1e9) {return (n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1) + ' mlrd'}
      if (n >= 1e6) {return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + ' mln'}
      if (n >= 1e3) {return Math.round(n / 1e3) + ' ming'}
      return String(n)
    },
    async load() {
      try {
        this.loading = true
        const res = await this.$api.getFamily()
        if (res && res.data && res.data.success) {
          const d = res.data.data
          this.asViewer = d.as_viewer || []
          this.asTarget = d.as_target || []
          this.pending = d.pending || []
        }
      } catch (e) { console.error('Family load:', e) } finally { this.loading = false }
    },
    async loadCategories() {
      try {
        const res = await this.$api.getExpenseCategories()
        if (res && res.data && res.data.success) {this.expenseCategories = res.data.data}
      } catch (e) { /* ignore */ }
    },
    initials, // SS-AUDIT (2026-09-25): utils/helpers
    formatMoney: formatNumberGrouped, // SS-AUDIT (2026-09-25): utils/helpers
    openInfo(kind) { this.infoKind = kind },
    // 23.10: bo'sh bo'lim CTA — rol oldindan tanlangan taklif oynasi
    openInviteAs(role) { this.openInvite(); this.form.role = role === 'watcher' ? 'watcher' : 'watched' },
    openInvite() { this.editing = null; this.editingPermsOnly = false; this.editingLimitOnly = false; this.accepting = null; this.form = this.blankForm(); this.form.phone = this.formatUzPhone('998'); this.showForm = true },
    // B33-2: kelgan taklifni qabul qilishдан oldin — target QAYSI ma'lumotlarini ko'rsatishни tanlaydi
    openAccept(link) {
      this.editing = null; this.editingPermsOnly = false; this.editingLimitOnly = false
      this.accepting = link
      const perms = this.blankPermissions()
      const lp = link.permissions || {}
      Object.keys(perms).forEach(k => { if (k !== 'set_limit' && lp[k]) {perms[k] = { view: !!lp[k].view, detail: lp[k].detail === 'full' ? 'full' : 'summary' }} })
      perms.set_limit = !!lp.set_limit
      this.form = this.blankForm()
      this.form.permissions = perms
      this.form.role = link.role || 'watched'
      this.showForm = true
    },
    // B30-2: O'zbek telefon formati "+99897 734 50 30" (+998 prefiks bilan ochiladi)
    formatUzPhone(raw) {
      let d = String(raw == null ? '' : raw).replace(/\D/g, '')
      if (d.startsWith('998')) { /* ok */ }
      else if (d.startsWith('0')) {d = '998' + d.slice(1)}
      else if (d.length) {d = '998' + d}
      d = d.slice(0, 12)
      if (d.length <= 3) {return '+' + d}
      let out = '+' + d.slice(0, 5)
      if (d.length > 5) {out += ' ' + d.slice(5, 8)}
      if (d.length > 8) {out += ' ' + d.slice(8, 10)}
      if (d.length > 10) {out += ' ' + d.slice(10, 12)}
      return out
    },
    onFamilyPhoneInput(e) { this.form.phone = this.formatUzPhone(e && e.target ? e.target.value : '') },
    // Target o'z ruxsatlarini boshqaradi (faqat kim nimani ko'rishi)
    openEditPerms(link) {
      this.openEdit(link)
      this.editingPermsOnly = true
    },
    // Kuzatuvchi limit qo'yadi (faqat limit — umumiy/kategoriya)
    openEditLimit(link) {
      this.openEdit(link)
      this.editingLimitOnly = true
    },
    openEdit(link) {
      this.editing = link
      this.editingPermsOnly = false
      this.editingLimitOnly = false
      this.accepting = null
      const perms = this.blankPermissions()
      const lp = link.permissions || {}
      Object.keys(perms).forEach(k => { if (k !== 'set_limit' && lp[k]) {perms[k] = { view: !!lp[k].view, detail: lp[k].detail === 'full' ? 'full' : 'summary' }} })
      perms.set_limit = !!lp.set_limit // B30-6: mavjud ruxsatni saqlaymiz
      this.form = {
        phone: link.member_phone || '',
        relation_label: link.relation_label || '',
        role: link.role || 'watched',
        permissions: perms,
        category_limits: (link.category_limits || []).map(c => ({ category_id: c.category_id, amount: c.amount, currency: c.currency || 'UZS' })),
        monthly_limit: link.monthly_limit != null ? Number(link.monthly_limit) : '',
        limit_currency: link.limit_currency || 'UZS'
      }
      this.showForm = true
    },
    async submitForm() {
      // B33-2: kelgan taklifni QABUL QILISH — target tanlagan ruxsatlar bilan
      if (this.accepting) {
        this.saving = true
        try {
          const res = await this.$api.respondFamilyInvite(this.accepting.id, 'accept', this.form.permissions)
          if (res && res.data && res.data.success) {
            this.$toast.success(this.$t('finance.family_accepted'))
            this.showForm = false; this.accepting = null; await this.load()
          }
        } catch (e) {
          this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
        } finally { this.saving = false }
        return
      }
      if (!this.editing) {
        // B30-2: to'liq raqam bo'lishi shart (998 + 9 raqam) — prefiks yolg'iz yuborilmasin
        const core9 = String(this.form.phone).replace(/\D/g, '').slice(-9)
        if (core9.length < 9) { this.$toast.error(this.$t('finance.family_invite_err_phone')); return }
      }
      this.saving = true
      try {
        // Rejimga qarab payload: permsOnly (target ruxsat), limitOnly (kuzatuvchi limit), yoki to'liq
        let payload
        if (this.editingPermsOnly) {
          payload = { permissions: this.form.permissions }
        } else if (this.editingLimitOnly) {
          payload = {
            category_limits: this.dedupeCatLimits(this.form.category_limits),
            monthly_limit: this.form.monthly_limit === '' ? null : Number(this.form.monthly_limit),
            limit_currency: this.form.limit_currency
          }
        } else {
          payload = {
            relation_label: this.form.relation_label,
            role: this.form.role,
            permissions: this.form.permissions,
            category_limits: this.dedupeCatLimits(this.form.category_limits),
            monthly_limit: this.form.monthly_limit === '' ? null : Number(this.form.monthly_limit),
            limit_currency: this.form.limit_currency
          }
        }
        if (this.editing) {
          const res = await this.$api.updateFamilyMember(this.editing.id, payload)
          if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.family_updated')); this.showForm = false; await this.load() }
        } else {
          payload.phone = String(this.form.phone).trim()
          const res = await this.$api.inviteFamilyMember(payload)
          if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.family_invite_sent')); this.showForm = false; await this.load() }
        }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.saving = false }
    },
    async respond(link, action) {
      this.busyId = link.id
      try {
        const res = await this.$api.respondFamilyInvite(link.id, action)
        if (res && res.data && res.data.success) { this.$toast.success(action === 'accept' ? this.$t('finance.family_accepted') : this.$t('finance.family_rejected_done')); await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.busyId = null }
    },
    async openOverview(link) {
      this.overviewName = link.other_name || '—'
      this.overviewLink = link
      const now = new Date()
      this.overviewYear = now.getFullYear()
      this.overviewMonth = now.getMonth() + 1
      this.overview = null; this.showOverview = true
      await this.fetchOverview()
    },
    async fetchOverview() {
      if (!this.overviewLink) {return}
      this.overviewLoading = true
      try {
        const res = await this.$api.getFamilyOverview(this.overviewLink.id, { year: this.overviewYear, month: this.overviewMonth })
        if (res && res.data && res.data.success) {this.overview = res.data.data}
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error')); this.showOverview = false
      } finally { this.overviewLoading = false }
    },
    overviewChangeMonth(delta) {
      let m = this.overviewMonth + delta
      let y = this.overviewYear
      if (m > 12) { m = 1; y++ } else if (m < 1) { m = 12; y-- }
      this.overviewMonth = m; this.overviewYear = y
      this.fetchOverview()
    },
    askRemove(link) { this.removeTarget = link; this.showRemove = true },
    async confirmRemove() {
      if (!this.removeTarget) {return}
      this.saving = true
      try {
        const res = await this.$api.removeFamilyMember(this.removeTarget.id)
        if (res && res.data && res.data.success) { this.$toast.success(this.$t('finance.family_removed')); this.showRemove = false; this.removeTarget = null; await this.load() }
      } catch (e) {
        this.$toast.error((e.response && e.response.data && e.response.data.message) || this.$t('common.error'))
      } finally { this.saving = false }
    }
  }
}
</script>
