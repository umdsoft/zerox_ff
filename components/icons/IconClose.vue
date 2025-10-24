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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
</template>

<script>
export default {
  name: 'IconClose',
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
      default: () => 'h-6 w-6 text-black',
    },
  },
};
</script>
