<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 50 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="svgClass"
  >
    <g clip-path="url(#clip0)">
      <path
        d="M25 29C32.8906 29 39.2857 22.509 39.2857 14.5C39.2857 6.49102 32.8906 0 25 0C17.1094 0 10.7143 6.49102 10.7143 14.5C10.7143 22.509 17.1094 29 25 29ZM19.8996 34.4375C8.90625 34.4375 0 43.4773 0 54.6355C0 56.4934 1.48438 58 3.31473 58H46.6853C48.5156 58 50 56.4934 50 54.6355C50 43.4773 41.0938 34.4375 30.1004 34.4375H19.8996V34.4375Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="50" height="58" fill="white" />
      </clipPath>
    </defs>
  </svg>
</template>

<script>
export default {
  name: 'IconUserDefault',
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
