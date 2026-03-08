<template>
  <div class="qr rounded bg-white w-full pt-3 pb-16 px-2">
    <BackButton />

    <div class="container">
      <iframe :src="url" frameborder="0" width="100%" height="900"></iframe>
    </div>

  </div>
</template>

<script>
import BackButton from '@/components/BackButton.vue';

export default {
  components: { BackButton },
  middleware: 'auth',
  data: () => ({
    url: null,
  }),
  async mounted() {
    try {
      this.url = this.$contractPdfUrl(this.$route.query.id);
    } catch (e) {
      this.$toast.error(this.$t('a1.a42'));
    }
  },

};
</script>

<style lang="css" scoped>
.introduction {
  max-width: 650px;
}

#webviewer {
  height: 100vh;
}

.qr-code {
  width: 180px;
  position: relative;
}

.qr-code-image {
  position: absolute;
  background-color: rgb(252, 249, 249);
  border-radius: 0.25rem;
  z-index: 50000;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

.pdf {
  width: 250px;
  height: 250px;
  box-shadow: 0px 4px 10px 3px rgba(0, 0, 0, 0.11);
  border-radius: 67px;
  background: #ffffff;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-title {
  text-align: center;
}

.qarz {
  margin: 20px 0;
}

.qarz .content-title {
  margin-bottom: 20px;
}

.qarz span {
  color: black;
  font-weight: 600;
}

.content-body p {
  font-size: 14px;
  text-align: justify;
  word-break: break-word;
  text-indent: 50px;
}

.qarz ul li p {
  font-size: 14px;
}

.rekvizit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rek-title {
  margin-bottom: 10px;
  text-align: center;
}

.rek-body {
  margin-bottom: 10px;
}

.rek-title h2:last-child {
  color: black;
  font-weight: 600;
}
</style>
