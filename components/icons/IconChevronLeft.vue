<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :class="svgClass"
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <polyline points="15 6 9 12 15 18" />
  </svg>
</template>

<script>
export default {
  name: 'IconChevronLeft',
  props: {
    width: {
      type: [Number, String],
      default: 24,
    },
    height: {
      type: [Number, String],
      default: 24,
    },
    svgClass: {
      type: [String, Array, Object],
      default: () => 'h-5 w-5 text-blue-500',
    },
  },
};
</script>
