<template>
  <div class="bg-white rounded px-4 py-2">
    <div class="container">
      <iframe v-if="$i18n.locale == 'uz'" src="https://pdf.zerox.uz/yoriqnoma.pdf" frameborder="0" width="100%" height="900"></iframe>
      <iframe v-if="$i18n.locale == 'kr'" src="https://pdf.zerox.uz/йўриқнома.pdf" frameborder="0" width="100%" height="900"></iframe>
      <iframe v-if="$i18n.locale == 'ru'" src="https://pdf.zerox.uz/инструкция.pdf" frameborder="0" width="100%" height="900"></iframe>
    </div>
  </div>
</template>

<script>

export default {

};
</script>
<style lang="scss" scoped>
</style>
