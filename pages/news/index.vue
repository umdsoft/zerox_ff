<template>
  <div class="news px-10 py-10 rounded bg-white"> 
    <h2 class="font-bold text-3xl">{{ $t('home.we') }}</h2>
    <h3 class="my-4 text-1xl">
     {{$t('home.bankwe')}}
    </h3>

    <div class="flex justify-center">
      <img src="@/assets/img/phone.png" alt="phone" />
    </div>

    <p style="color: #37363c; text-align: justify">
      {{ $t('home.alls') }}
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style scoped></style>
