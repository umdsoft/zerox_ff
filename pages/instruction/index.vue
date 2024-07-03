<template>
  <div class="bg-white rounded px-4 py-2">

    <h1 class="font-mono-serif text-3xl text-center mt-8">
      {{ $t('instruc.tx') }}

    </h1>
    <div class="container">
      <iframe src="https://pdf.zerox.uz/yoriqnoma.pdf" frameborder="0" width="100%" height="900"></iframe>
    </div>
  </div>
</template>

<script>

export default {
   middleware:'auth',


  methods: {
    appro() {

    },
  },
};
</script>
<style lang="scss" scoped>
</style>
