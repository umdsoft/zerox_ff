<template>
  <span :class="displayClass" class="text-sm">
    {{ displayText }}
  </span>
</template>

<script>
/**
 * DaysDisplay Component
 * Qolgan kunlarni xavfsiz ko'rsatish (v-html o'rniga)
 *
 * Props:
 *   - endDate: Tugash sanasi (string yoki Date)
 *
 * Foydalanish:
 *   <DaysDisplay :end-date="item.end_date" />
 */
export default {
  name: 'DaysDisplay',

  props: {
    endDate: {
      type: [String, Date],
      required: true,
    },
  },

  computed: {
    /**
     * Qolgan kunlar sonini hisoblash
     * @returns {number} - Qolgan kunlar (manfiy bo'lsa o'tgan)
     */
    daysRemaining() {
      const restTimeMillisec = new Date(this.endDate) - Date.now();
      return restTimeMillisec / (24 * 60 * 60 * 1000);
    },

    /**
     * Ko'rsatiladigan matn
     * @returns {string}
     */
    displayText() {
      const days = this.daysRemaining;

      if (days < 0) {
        return this.$t('a1.a56') || 'Muddati o\'tgan';
      }

      if (days < 1 && days > 0) {
        return this.$t('a1.a55') || 'Bugun';
      }

      const roundedDays = Math.ceil(days);

      if (roundedDays >= 1 && roundedDays <= 4) {
        return `${roundedDays} ${this.$t('a1.a57') || 'kun'}`;
      }

      return `${roundedDays} ${this.$t('a1.a60') || 'kun'}`;
    },

    /**
     * CSS class - rang va stil
     * @returns {string}
     */
    displayClass() {
      const days = this.daysRemaining;

      // Muddati o'tgan
      if (days < 0) {
        return 'text-red-500 font-medium';
      }

      // Bugun
      if (days < 1) {
        return 'text-red-500 font-medium';
      }

      const roundedDays = Math.ceil(days);

      // 1-3 kun qolgan - qizil
      if (roundedDays >= 1 && roundedDays < 4) {
        return 'text-red-500 font-medium';
      }

      // 4 kun qolgan - orange
      if (roundedDays >= 4 && roundedDays < 5) {
        return 'text-orange-500 font-medium';
      }

      // 5+ kun - normal
      return 'text-gray-700';
    },
  },
};
</script>
