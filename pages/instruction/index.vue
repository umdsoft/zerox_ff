<template>
  <div class="bg-white rounded px-4 py-2">
 
    <h1 class="font-mono-serif text-3xl text-center mt-8">
      {{ $t('instruc.tx') }}  
       
    </h1>
    
    <p style="text-align:justify" class="font-mono-serif mx-4 my-10">
      {{ $t('instruc.txt') }}
    </p>
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
