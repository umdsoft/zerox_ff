<template>
  <div>
    <p class="text-gray-700 mb-2">
      <b>{{ $t('finance.inactivity_title') }}</b>
    </p>

    <p class="mt-2 text-gray-700">
      {{ $t('finance.inactivity_text') }}
    </p>

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
 * finance-inactivity.vue — SS20: "Shaxsiy moliya" faolsizlik eslatmasi (type = 41).
 *
 * Backend `financeInactivity.cron` (har kuni 10:00) uni ilgari daromad/xarajat
 * kiritib kelgan, ammo oxirgi 3 kun davomida hech narsa kiritmagan
 * foydalanuvchilarga yozadi. Hech qachon kiritmaganlarga xabar bormaydi.
 *
 * Kartada bitta aniq amal bor — xarajat yoki daromad qo'shish sahifasiga o'tish
 * (eslatmaning butun maqsadi shu).
 */
import notificationMixin from '~/mixins/notificationMixin'

export default {
  name: 'FinanceInactivity',
  // `item` va `getNotifications` proplari mixin'da e'lon qilingan — bu yerda
  // takrorlansa Vue "duplicate prop" ogohlantirishini beradi.
  mixins: [notificationMixin],
  methods: {
    go(routeName) {
      this.$router.push(this.localePath({ name: routeName }))
    },
  },
}
</script>
