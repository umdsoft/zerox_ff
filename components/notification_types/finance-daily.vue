<template>
  <div>
    <p class="text-gray-700 mb-2">
      <b>{{ tx.title }}</b>
    </p>

    <p class="mt-2 text-gray-700">{{ tx.body }}</p>

    <div class="mt-3 flex flex-wrap gap-2">
      <button
        @click="go('finance-expenses-add')"
        class="py-1.5 px-4 rounded-lg text-sm font-semibold border transition bg-white border-gray-200 text-rose-600 hover:border-rose-500"
      >
        {{ $t('finance.add_expense') }}
      </button>
      <button
        @click="go('finance-income-add')"
        class="py-1.5 px-4 rounded-lg text-sm font-semibold border transition bg-white border-gray-200 text-emerald-600 hover:border-emerald-500"
      >
        {{ $t('finance.add_income') }}
      </button>
    </div>

    <div class="notification-actions">
      <div>
        <span><b>{{ $t('comp.time') }}:</b> {{ item.created }} {{ item && item.time ? item.time.slice(0, 5) : '' }}</span>
      </div>
      <div class="notification-actions__buttons">
        <button @click="ok(item.id)" class="bg-blue-500 py-1 px-4 mx-2 rounded text-white">
          Ok
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * finance-daily.vue — 13.10: SHAXSIY MOLIYA kunlik eslatmasi (type = 46).
 * Backend `financeReminder.cron`: foydalanuvchi belgilagan kun/vaqtda, o'sha kuni daromad yoki xarajat
 * kiritilmagan bo'lsa. (type 41 — 3 kunlik avtomatik eslatma — finance-inactivity.vue.)
 */
import notificationMixin from '~/mixins/notificationMixin'

const TX = {
  uz: { title: 'Shaxsiy moliya eslatmasi', body: "Bugun hali daromad va xarajat kiritilmadi. Bugungi daromad va xarajatlaringizni kiritib qo'ying." },
  kr: { title: 'Шахсий молия эслатмаси', body: 'Бугун ҳали даромад ва харажат киритилмади. Бугунги даромад ва харажатларингизни киритиб қўйинг.' },
  ru: { title: 'Напоминание: личные финансы', body: 'Сегодня ещё не внесено ни одного дохода и расхода. Внесите сегодняшние доходы и расходы.' },
  en: { title: 'Personal finance reminder', body: "No income or expense has been entered today. Please add today's income and expenses." },
  kaa: { title: 'Jeke qarjı eskertpesi', body: 'Búgin ele dáramat hám qárejet kiritilmedi. Búgingi dáramat hám qárejetlerińizdi kiritip qoyıń.' },
}

export default {
  name: 'FinanceDaily',
  mixins: [notificationMixin],
  computed: {
    tx() { return TX[(this.$i18n && this.$i18n.locale) || 'uz'] || TX.uz },
  },
  methods: {
    go(routeName) {
      this.$router.push(this.localePath({ name: routeName }))
    },
  },
}
</script>
