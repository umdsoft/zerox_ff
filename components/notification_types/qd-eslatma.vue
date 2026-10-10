<template>
  <div>
    <p class="text-gray-700 mb-2">
      <b>{{ tx.title }}</b>
    </p>

    <p class="mt-2 text-gray-700">
      {{ shop ? tx.body.replace('{shop}', shop) : tx.bodyNoShop }}
    </p>

    <div class="notification-actions">
      <div>
        <span><b>{{ $t('comp.time') }}:</b> {{ item.created }} {{ item && item.time ? item.time.slice(0, 5) : '' }}</span>
      </div>
      <div class="notification-actions__buttons">
        <button @click="openLedger" class="py-1 px-4 mx-2 rounded border border-blue-500 text-blue-600 hover:bg-blue-50">
          {{ tx.ledger }}
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
 * qd-eslatma.vue — 10.10: do'kon egasiga QARZ KIRITISH ESLATMASI (type = 44).
 * Backend `shopReminder.cron`: belgilangan kun/vaqtda, o'sha kuni do'konga qarz kiritilmagan bo'lsa.
 * «Qarz daftari» — shu do'kon tanlangan holda Qarz daftari sahifasi; «Ok» — yopish.
 */
import notificationMixin from '~/mixins/notificationMixin'

const DOKON_LS_KEY = 'zx_qd_dokon' // pages/qarz-daftari/index.vue bilan bir xil

const TX = {
  uz: { title: 'Qarz daftari eslatmasi', body: "«{shop}» do'koni uchun bugun hali qarz kiritilmadi. Bugungi qarzlarni kiritib qo'ying.", bodyNoShop: "Bugun hali qarz kiritilmadi. Bugungi qarzlarni kiritib qo'ying.", ledger: 'Qarz daftari' },
  kr: { title: 'Қарз дафтари эслатмаси', body: '«{shop}» дўкони учун бугун ҳали қарз киритилмади. Бугунги қарзларни киритиб қўйинг.', bodyNoShop: 'Бугун ҳали қарз киритилмади. Бугунги қарзларни киритиб қўйинг.', ledger: 'Қарз дафтари' },
  ru: { title: 'Напоминание: книга долгов', body: 'Сегодня в магазине «{shop}» ещё не внесено ни одного долга. Внесите сегодняшние долги.', bodyNoShop: 'Сегодня ещё не внесено ни одного долга. Внесите сегодняшние долги.', ledger: 'Книга долгов' },
  en: { title: 'Debt book reminder', body: "No debts have been entered for «{shop}» today. Please add today's debts.", bodyNoShop: "No debts have been entered today. Please add today's debts.", ledger: 'Debt book' },
  kaa: { title: 'Qarız dápteri eskertpesi', body: '«{shop}» dúkanı ushın búgin ele qarız kiritilmedi. Búgingi qarızlardı kiritip qoyıń.', bodyNoShop: 'Búgin ele qarız kiritilmedi. Búgingi qarızlardı kiritip qoyıń.', ledger: 'Qarız dápteri' },
}

export default {
  name: 'QdEslatma',
  mixins: [notificationMixin],
  computed: {
    tx() { return TX[(this.$i18n && this.$i18n.locale) || 'uz'] || TX.uz },
    shop() { return String((this.item && this.item.rem_faoliyat_nomi) || '').trim() },
  },
  methods: {
    openLedger() {
      const id = this.item && this.item.rem_faoliyat_id
      if (id) { try { localStorage.setItem(DOKON_LS_KEY, String(id)) } catch (_) {} }
      this.$router.push(this.localePath({ name: 'qarz-daftari' }))
    },
  },
}
</script>
