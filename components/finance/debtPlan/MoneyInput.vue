<template>
  <!-- 23.10 (egasi hujjati 22.10, 10-rasm): summa maydoni "90 000 000" ko'rinishida — yozish paytida
       minglik bo'shliq bilan formatlanadi, v-model esa XOM son (Number | null) qaytaradi. -->
  <input
    ref="input"
    :value="display"
    type="text"
    inputmode="decimal"
    autocomplete="off"
    :placeholder="placeholder"
    :class="inputClass"
    @input="onInput"
    @blur="onBlur"
  />
</template>

<script>
import { groupDigits, cleanMoney } from '@/utils/debtPlan'

export default {
  name: 'MoneyInput',
  props: {
    value: { type: [Number, String], default: null },
    placeholder: { type: String, default: '' },
    inputClass: { type: [String, Array, Object], default: '' },
    decimals: { type: Number, default: 2 },
  },
  data() {
    return { text: this.toText(this.value) }
  },
  computed: {
    display() { return groupDigits(this.text) },
  },
  watch: {
    value(v) {
      // Tashqaridan kelgan qiymat joriy matn bilan bir xil son bo'lsa — matnga tegmaymiz ("12." yozilayotgan bo'lishi mumkin)
      const cur = this.text === '' || this.text === '.' ? null : Number(this.text)
      const next = v === '' || v == null ? null : Number(String(v).replace(/\s/g, ''))
      if (cur !== next) this.text = this.toText(v)
    },
  },
  methods: {
    toText(v) {
      if (v === '' || v == null) return ''
      const n = Number(String(v).replace(/\s/g, '').replace(',', '.'))
      if (!isFinite(n)) return ''
      return String(Math.round(n * 100) / 100)
    },
    onInput(ev) {
      const el = ev.target
      const caret = el.selectionStart == null ? el.value.length : el.selectionStart
      // Kursor oldidagi "ma'noli" belgilar soni (raqam va nuqta) — formatlashdan keyin shu joyga qaytamiz
      const meaningful = el.value.slice(0, caret).replace(/[^\d.,]/g, '').length
      this.text = cleanMoney(el.value, this.decimals)
      const shown = groupDigits(this.text)
      el.value = shown
      let pos = 0
      let seen = 0
      while (pos < shown.length && seen < meaningful) {
        if (/[\d.]/.test(shown[pos])) seen += 1
        pos += 1
      }
      try { el.setSelectionRange(pos, pos) } catch (e) { /* type=text — qo'llab-quvvatlanadi */ }
      const n = this.text === '' || this.text === '.' ? null : Number(this.text)
      this.$emit('input', n != null && isFinite(n) ? n : null)
    },
    onBlur() {
      if (this.text.endsWith('.')) this.text = this.text.slice(0, -1)
      this.$emit('blur')
    },
  },
}
</script>
