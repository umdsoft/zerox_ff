<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 50 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="svgClass"
  >
    <path
      d="M25 29C32.8906 29 39.2857 22.509 39.2857 14.5C39.2857 6.49102 32.8906 0 25 0C17.1094 0 10.7143 6.49102 10.7143 14.5C10.7143 22.509 17.1094 29 25 29ZM35.692 32.693L30.3571 54.375L26.7857 38.9687L30.3571 32.625H19.6429L23.2143 38.9687L19.6429 54.375L14.308 32.693C6.35045 33.0781 0 39.6824 0 47.85V52.5625C0 55.5645 2.39955 58 5.35714 58H44.6429C47.6004 58 50 55.5645 50 52.5625V47.85C50 39.6824 43.6496 33.0781 35.692 32.693V32.693Z"
      fill="white"
    />
  </svg>
</template>

<script>
export default {
  name: 'IconUserBusiness',
  props: {
    width: {
      type: [Number, String],
      default: 50,
    },
    height: {
      type: [Number, String],
      default: 58,
    },
    svgClass: {
      type: [String, Array, Object],
      default: () => '',
    },
  },
};
</script>
