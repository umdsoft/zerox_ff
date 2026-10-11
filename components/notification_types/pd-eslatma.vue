<template>
  <div>
    <p class="text-gray-700 mb-2">
      <b>{{ tx.title }}</b>
    </p>

    <p class="mt-2 text-gray-700">{{ tx.body }}</p>

    <div class="notification-actions">
      <div>
        <span><b>{{ $t('comp.time') }}:</b> {{ item.created }} {{ item && item.time ? item.time.slice(0, 5) : '' }}</span>
      </div>
      <div class="notification-actions__buttons">
        <button @click="openDebts" class="py-1 px-4 mx-2 rounded border border-blue-500 text-blue-600 hover:bg-blue-50">
          {{ tx.debts }}
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
 * pd-eslatma.vue — 11.10: SHAXSIY QARZ KIRITISH ESLATMASI (type = 45).
 * Backend `personalDebtReminder.cron`: belgilangan kun/vaqtda, so'nggi 2 hafta ichida shaxsiy qarz
 * kiritilmagan bo'lsa. «Shaxsiy qarz» — Shaxsiy qarz sahifasi; «Ok» — yopish. (qd-eslatma.vue kabi)
 */
import notificationMixin from '~/mixins/notificationMixin'

const TX = {
  uz: { title: 'Shaxsiy qarz eslatmasi', body: "So'nggi 2 hafta ichida shaxsiy qarz kiritilmadi. Bergan va olgan qarzlaringizni kiritib qo'ying.", debts: 'Shaxsiy qarz' },
  kr: { title: 'Шахсий қарз эслатмаси', body: 'Сўнгги 2 ҳафта ичида шахсий қарз киритилмади. Берган ва олган қарзларингизни киритиб қўйинг.', debts: 'Шахсий қарз' },
  ru: { title: 'Напоминание: личные долги', body: 'За последние 2 недели не внесено ни одного личного долга. Внесите выданные и взятые долги.', debts: 'Личные долги' },
  en: { title: 'Personal debt reminder', body: 'No personal debts have been entered in the last 2 weeks. Please add the debts you gave and took.', debts: 'Personal debts' },
  kaa: { title: 'Jeke qarız eskertpesi', body: 'Sońǵı 2 hápte ishinde jeke qarız kiritilmedi. Bergen hám alǵan qarızlarıńızdı kiritip qoyıń.', debts: 'Jeke qarız' },
}

export default {
  name: 'PdEslatma',
  mixins: [notificationMixin],
  computed: {
    tx() { return TX[(this.$i18n && this.$i18n.locale) || 'uz'] || TX.uz },
  },
  methods: {
    openDebts() {
      this.$router.push(this.localePath({ name: 'finance-debts' }))
    },
  },
}
</script>
