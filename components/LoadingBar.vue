<template>
  <div>
    <div v-if="loading" class="loading">
      <div class="loading__logo">
        <img src="./../assets/logo.png" alt="" />

        <svg
          width="40"
          height="40"
          viewBox="0 0 46 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25.4835 6.22519L31.9347 6.22518L6.78363 42.8016L0.402291 42.8016L25.4835 6.22519Z"
            fill="#2D62B6"
          />
          <path
            d="M38.8724 15.0968L45.3236 15.0968L20.1726 51.6732L13.7912 51.6732L38.8724 15.0968Z"
            fill="#2D62B6"
          />
          <path
            d="M26.3598 19.6683L31.8092 19.6684L19.6715 37.6202L13.9155 37.6202L26.3598 19.6683Z"
            fill="#FE5E58"
          />
        </svg>
      </div>
      <!-- <svg class="loader">
        <circle cx="50" cy="50" r="50"></circle>
    </svg> -->
      <div class="sk-chase">
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingBar",

  computed: {
    loading() {
      return this.$store.state.isLoading;
    },
  },
};
</script>

<style lang="scss">
.sk-chase {
  width: 60px;
  height: 60px;
  position: relative;
  animation: sk-chase 2.5s infinite linear both;
}

.sk-chase-dot {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  animation: sk-chase-dot 2s infinite ease-in-out both;
}

.sk-chase-dot:before {
  content: "";
  display: block;
  width: 20%;
  height: 20%;
  background-color: #2d62b6;
  border-radius: 100%;
  animation: sk-chase-dot-before 2s infinite ease-in-out both;
}

.sk-chase-dot:nth-child(1) {
  animation-delay: -1.1s;
}
.sk-chase-dot:nth-child(2) {
  animation-delay: -1s;
}
.sk-chase-dot:nth-child(3) {
  animation-delay: -0.9s;
}
.sk-chase-dot:nth-child(4) {
  animation-delay: -0.8s;
}
.sk-chase-dot:nth-child(5) {
  animation-delay: -0.7s;
}
.sk-chase-dot:nth-child(6) {
  animation-delay: -0.6s;
}
.sk-chase-dot:nth-child(1):before {
  animation-delay: -1.1s;
}
.sk-chase-dot:nth-child(2):before {
  animation-delay: -1s;
}
.sk-chase-dot:nth-child(3):before {
  animation-delay: -0.9s;
}
.sk-chase-dot:nth-child(4):before {
  animation-delay: -0.8s;
}
.sk-chase-dot:nth-child(5):before {
  animation-delay: -0.7s;
}
.sk-chase-dot:nth-child(6):before {
  animation-delay: -0.6s;
}

@keyframes sk-chase {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot {
  80%,
  100% {
    transform: rotate(360deg);
  }
}

@keyframes sk-chase-dot-before {
  50% {
    transform: scale(0.4);
  }
  100%,
  0% {
    transform: scale(1);
  }
}

.loading__logo {
  position: absolute;
}
.loading {
  position: fixed;
  width: 100vw;
  min-height: 100vh;
  top: 0;
  left: 0;
  background: rgba($color: rgb(96, 96, 96), $alpha: 1);
  z-index: 999999999999999999999999999999999999999999999999999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
