<template>
  <div @click="$backWithLocale()" class="my-2 mx-6 hidden lg:inline-flex items-center" style="cursor:pointer">
    <IconChevronLeft />
    <p class="text-blue-500">{{ $t('back') }}</p>
  </div>
</template>

<script>
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue';

export default {
  name: 'BackButton',
  components: { IconChevronLeft },
};
</script>
