<template>
  <div class="qr rounded bg-white py-8 px-2">
    <div @click="$router.go(-1)" class="mx-6 hidden lg:inline-flex items-center" style="cursor: pointer">
      <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      <p class="text-blue-500">{{ $t("back") }}</p>
    </div>

    <div ref="qrcode" class="flex justify-center flex-col items-center">
      <div style="width: 280px" class="mt-16 mb-4 mx-auto bg-gray-700 rounded-2xl px-2 pt-2 pb-2">
        <div class="bg-white pb-4 rounded-2xl">
          <div class="text-6xl mb-4 ml-12 pt-3" style="font-family: serif; color: #2d62b6">


            <svg width="159" height="44" viewBox="0 0 159 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.47497 40.5302H18.8092C20.2118 40.5302 21.2523 40.4003 21.9325 40.1373C22.6127 39.876 23.1728 39.4685 23.6127 38.9133C24.0526 38.3581 24.4503 37.5789 24.8058 36.5741C25.1614 35.5692 25.5899 34.0108 26.0932 31.8956H29.1694V43.4181H0.160156V41.8792L21.6679 3.44799H10.2704C9.45383 3.44799 8.81098 3.51618 8.34021 3.65254C7.86944 3.7889 7.44575 3.99831 7.06913 4.28077C6.69251 4.56323 6.32077 4.97719 5.95389 5.52101C5.58701 6.06484 5.22013 6.8132 4.85488 7.76611C4.488 8.71901 4.10652 9.90731 3.7088 11.3294H0.632551V0.560059H28.9535V2.06653L7.47497 40.5302Z"
                fill="#0063B6" />
              <path
                d="M59.9091 38.0805C58.5698 39.4831 57.3393 40.5821 56.2192 41.3775C55.0991 42.173 53.8686 42.7964 52.5294 43.246C51.1901 43.6957 49.7145 43.9213 48.1025 43.9213C43.7909 43.9213 40.5361 42.6292 38.338 40.0432C36.14 37.4588 35.041 33.6439 35.041 28.5985C35.041 25.4801 35.6011 22.7269 36.7212 20.3406C37.8413 17.9542 39.437 16.1134 41.5101 14.8147C43.5831 13.5176 45.9678 12.8683 48.669 12.8683C50.7826 12.8683 52.5829 13.2027 54.0699 13.8731C55.5553 14.5436 56.7436 15.4591 57.6332 16.6198C58.5228 17.7822 59.2127 19.2464 59.7062 21.0159C60.198 22.7853 60.4756 25.0921 60.539 27.9395H40.7568V28.5044C40.7568 30.9751 41.0344 33.0514 41.588 34.7364C42.1432 36.4215 43.0522 37.7396 44.3201 38.6925C45.5863 39.6454 47.234 40.1211 49.2648 40.1211C50.9807 40.1211 52.5245 39.8029 53.8962 39.1633C55.2663 38.5253 56.6332 37.4831 57.9935 36.0383L59.9091 38.0805ZM54.6348 25.334C54.5098 23.0727 54.2274 21.2269 53.7874 19.7919C53.3475 18.3585 52.6884 17.2594 51.8086 16.4948C50.9287 15.7302 49.7778 15.3488 48.3541 15.3488C46.1983 15.3488 44.4759 16.2124 43.1886 17.9396C41.9013 19.6669 41.1432 22.1311 40.9127 25.334H54.6348Z"
                fill="#0063B6" />
              <path
                d="M74.6653 18.6149L75.1053 18.7091C76.2562 17.3065 77.3244 16.2026 78.3081 15.3958C79.2919 14.5907 80.3536 13.9673 81.4948 13.5274C82.636 13.0874 83.9282 12.8683 85.373 12.8683C86.5872 12.8683 87.6862 12.9316 88.67 13.0566V20.2789H85.1213C84.6197 19.149 84.0856 18.3276 83.5207 17.8146C82.9558 17.3016 82.1815 17.0452 81.1977 17.0452C80.4445 17.0452 79.6961 17.2643 78.9526 17.7042C78.2091 18.1442 77.4932 18.7821 76.8017 19.6198C76.1118 20.4574 75.6345 21.2415 75.3731 21.9753C75.1118 22.7074 74.9803 23.5759 74.9803 24.5808V35.5692C74.9803 37.4734 75.0955 38.7867 75.3261 39.5091C75.5566 40.2315 75.9381 40.7607 76.4721 41.0951C77.0062 41.4295 77.8065 41.6909 78.8747 41.8792V43.4181H66.2207V41.8792C67.0161 41.6275 67.5859 41.4084 67.9317 41.2201C68.2775 41.0318 68.5745 40.7704 68.8262 40.436C69.0778 40.1016 69.2661 39.5886 69.3911 38.8971C69.5161 38.2071 69.5794 37.1292 69.5794 35.6634V21.9736C69.5794 20.6344 69.5583 19.5565 69.5161 18.7399C69.4739 17.9234 69.3278 17.2692 69.0762 16.7773C68.8245 16.2854 68.4431 15.9186 67.9301 15.6783C67.4171 15.438 66.6898 15.2335 65.7483 15.0663V13.4332L73.0956 13.1199H75.0111L74.6653 18.6149Z"
                fill="#0063B6" />
              <path
                d="M105.498 43.9214C101.144 43.9214 97.8208 42.6389 95.5286 40.0757C93.2364 37.5124 92.0903 33.717 92.0903 28.6944C92.0903 25.2399 92.6926 22.3211 93.8955 19.9348C95.0984 17.5484 96.7477 15.7741 98.8402 14.6134C100.933 13.4511 103.319 12.8716 105.999 12.8716C110.478 12.8716 113.869 14.1751 116.173 16.7806C118.475 19.3861 119.627 23.1279 119.627 28.0044C119.627 31.48 119.051 34.4102 117.9 36.7965C116.749 39.1828 115.116 40.9669 113.002 42.1503C110.887 43.3305 108.387 43.9214 105.498 43.9214ZM98.0253 28.0337C98.0253 32.3453 98.7103 35.6585 100.082 37.9702C101.452 40.2835 103.415 41.4393 105.968 41.4393C107.371 41.4393 108.564 41.1 109.548 40.4182C110.532 39.738 111.332 38.8224 111.95 37.6715C112.567 36.5205 113.012 35.1861 113.285 33.6683C113.556 32.1505 113.692 30.5661 113.692 28.9119C113.692 25.8356 113.351 23.2821 112.671 21.2513C111.991 19.2221 111.064 17.7303 109.892 16.7774C108.72 15.8245 107.381 15.3488 105.873 15.3488C103.34 15.3488 101.399 16.4478 100.048 18.6458C98.6974 20.8438 98.0253 23.9737 98.0253 28.0337Z"
                fill="#0063B6" />
              <path
                d="M138.026 0.561646V2.10058C137.021 2.24668 136.299 2.51941 135.859 2.91713C135.419 3.31485 135.2 3.85867 135.2 4.55022C135.2 5.13624 135.398 5.86837 135.796 6.74823C136.193 7.62808 136.758 8.67352 137.49 9.88779L142.042 17.5175L146.533 10.2644C147.201 9.17676 147.705 8.30664 148.039 7.65892C148.373 7.00958 148.609 6.46576 148.745 6.02583C148.882 5.58591 148.95 5.13624 148.95 4.67521C148.95 4.02587 148.761 3.47718 148.385 3.02751C148.008 2.57785 147.38 2.26941 146.502 2.10058V0.561646H158.151V2.10058C157.377 2.3522 156.68 2.71745 156.063 3.19959C155.446 3.68172 154.786 4.38301 154.086 5.30345C153.385 6.22551 152.385 7.68003 151.088 9.66701L143.992 20.6555L151.968 33.7802C153.097 35.6438 153.909 36.9458 154.401 37.6893C154.893 38.4328 155.354 39.061 155.782 39.5723C156.211 40.0853 156.672 40.5301 157.164 40.9067C157.656 41.2834 158.268 41.608 159 41.8807V43.4197H145.216V41.8807C146.179 41.7135 146.89 41.4473 147.351 41.0804C147.81 40.7152 148.042 40.1649 148.042 39.4327C148.042 38.8467 147.89 38.1974 147.588 37.4863C147.284 36.7753 146.818 35.8955 146.19 34.8484L140.507 25.3664L134.51 35.1942C133.505 36.8484 133.004 38.2087 133.004 39.2753C133.004 39.9652 133.192 40.5317 133.568 40.9701C133.945 41.4084 134.573 41.7135 135.452 41.8807V43.4197H123.583V41.8807C124.358 41.6502 124.996 41.3743 125.499 41.0496C126 40.7249 126.483 40.3126 126.944 39.8094C127.403 39.3077 127.918 38.6681 128.483 37.8938C129.047 37.1195 129.947 35.7688 131.182 33.8436L138.593 22.2885L129.739 7.72061C128.901 6.38135 128.268 5.40734 127.84 4.80021C127.411 4.19308 127.013 3.70121 126.647 3.32459C126.28 2.94797 125.95 2.68173 125.658 2.52427C125.364 2.3668 125.03 2.22558 124.653 2.10058V0.561646H138.026Z"
                fill="#FF2D2D" />
            </svg>
          </div>

          <div class="flex justify-center flex-col items-center">
            <Vqr :text="qrUrl" :logo="logo" qrcodeColor="#2D62B6" backgroundColor="#ffffffff" :size="260" :logoSize="40"
              :margin="10" :ratio="1" level="M" />
          </div>

          <h2 class="text-center">
            {{ $t("transfer.id") }} : {{ $auth.user.uid }}
          </h2>
        </div>
        <div class="text-sm text-center text-white font-bold my-2">
          {{ this.$auth.user.last_name }} {{ this.$auth.user.first_name }}
          {{ this.$auth.user.middle_name }}
        </div>
      </div>
      <div style="max-width: 400px" class="text-center py-4">
        {{ $t("transfer.qr") }}
      </div>
    </div>
    <div class="flex align-bottom justify-center my-5">
      <div @click="createPdfFile" style="cursor: pointer" class="
          bg-t_primary
          hover:bg-blue-700
          text-white
          py-2
          flex
          items-center
          px-8
          rounded
        ">
        <svg style="margin-right: 10px" width="15" height="15" viewBox="0 0 11 12" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <line x1="1.5" y1="10.5117" x2="9.5" y2="10.5117" stroke="white" />
          <path
            d="M4.95895 9.83399C5.15421 10.0293 5.47079 10.0293 5.66605 9.83399L8.84803 6.65201C9.0433 6.45675 9.0433 6.14017 8.84803 5.94491C8.65277 5.74964 8.33619 5.74964 8.14093 5.94491L5.3125 8.77333L2.48407 5.94491C2.28881 5.74964 1.97223 5.74964 1.77697 5.94491C1.5817 6.14017 1.5817 6.45675 1.77697 6.65201L4.95895 9.83399ZM4.8125 0L4.8125 9.48044H5.8125L5.8125 0L4.8125 0Z"
            fill="white" />
          <path d="M1 9.51172L1 10.5117" stroke="white" stroke-linecap="square" />
          <line x1="10" y1="9.51172" x2="10" y2="10.5117" stroke="white" stroke-linecap="square" />
        </svg>
        {{ $t("transfer.download") }}
      </div>
    </div>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
import Vqr from "v-qr";
export default {
  middleware: 'auth',
  components: {
    Vqr,
  },
  data: () => ({
    logo: null,
    qrUrl: "",
  }),
  mounted() {
    if (this.$auth.user.is_active == 1 && this.$auth.user.is_contract == 0) {
      this.$router.push({ name: 'universal_contract___' + $i18n.locale });
    }
    this.qrUrl = `https://zerox.uz/user?id=${this.$auth.user.uid}`;
    this.logo =
      "data:image/png;base64,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";
  },
  methods: {
    async createPdfFile() {
      html2pdf(this.$refs.qrcode, {
        margin: [0.1, 0, 0.1, 0],
        filename: `${this.$auth.user.uid}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 10,
        },
        jsPDF: { unit: "in", format: "a5", orientation: "portrait" },
        pagebreak: { mode: "avoid", before: [".pagebreak"] },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.qr-code {
  width: 300px;
  position: relative;
}

.qr-code-image {
  position: absolute;
  background-color: rgb(252, 249, 249);
  border-radius: 0.25rem;
  z-index: 50;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}

.v-qrcode-wrap {
  border-radius: 1rem;
}
</style>
