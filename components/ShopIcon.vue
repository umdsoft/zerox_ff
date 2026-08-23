<template>
  <!-- DRY: rangli do'kon (savdo faoliyati) ikonкаси. Ilgari qarzlar.vue va
       kiritish.vue'да inline SVG takrorlanardi. `cls` orqali o'lcham beriladi. -->
  <svg :class="cls" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="#fbbf24" />
    <path d="M3 9l1.5-4.5h15L21 9z" fill="#ef4444" />
    <path d="M7 9l.8-4.5M11 9l.4-4.5M13 9l-.4-4.5M17 9l-.8-4.5" stroke="#fff" stroke-width="0.8" />
    <rect x="10" y="13" width="4" height="7" fill="#2563eb" />
    <rect x="6" y="11.5" width="2.5" height="2.5" fill="#bfdbfe" />
    <rect x="15.5" y="11.5" width="2.5" height="2.5" fill="#bfdbfe" />
  </svg>
</template>

<script>
export default {
  name: 'ShopIcon',
  props: { cls: { type: String, default: 'w-5 h-5' } },
};
</script>
