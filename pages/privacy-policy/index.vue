<template>
  <div class="flex flex-col h-screen bg-white">
    <div class="card__footer h-full">
      <div class="market h-full">
        <iframe :src="url" width="100%" style="height: 100%; border: none;" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isAffirmed: false,
    isBtnDisabled: true,
    url: null
  }),
  async mounted() {
    this.url = `https://pdf.zerox.uz/policy.php?&lang=${this.$route.query.lang}&download=0`
  },
  methods: {
    validate() {
      if (this.isAffirmed) {
        this.isBtnDisabled = false;
      } else {
        this.isBtnDisabled = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.card__footer, .market {
  height: 100%;
}
</style>