<template>
  <div class="qr rounded bg-white py-8 px-2">
    <div
      @click="$router.go(-1)"
      class="mx-6 hidden lg:inline-flex items-center"
      style="cursor: pointer"
    >
      <svg
        class="h-5 w-5 text-blue-500"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      <p class="text-blue-500">{{ $t("back") }}</p>
    </div>

    <div ref="qrcode" class="flex justify-center flex-col items-center">
      <div
        style="width: 280px"
        class="mt-16 mb-4 mx-auto bg-gray-700 rounded-2xl px-2 pt-2 pb-2"
      >
        <div class="bg-white pb-4 rounded-2xl">
          <div
            class="text-6xl mb-8 text-center"
            style="font-family: serif; color: #2d62b6"
          >
            Zero<span class="text-red-500">X</span>
          </div>

          <div class="flex justify-center flex-col items-center">
            <Vqr
              :text="qrUrl"
              :logo="logo"
              qrcodeColor="#2D62B6"
              backgroundColor="#ffffffff"
              :size="260"
              :logoSize="40"
              :margin="10"
              :ratio="1"
              level="M"
            />
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
      <div
        @click="createPdfFile"
        style="cursor: pointer"
        class="
          bg-t_primary
          hover:bg-blue-700
          text-white
          py-2
          flex
          items-center
          px-8
          rounded
        "
      >
        <svg
          style="margin-right: 10px"
          width="15"
          height="15"
          viewBox="0 0 11 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="1.5" y1="10.5117" x2="9.5" y2="10.5117" stroke="white" />
          <path
            d="M4.95895 9.83399C5.15421 10.0293 5.47079 10.0293 5.66605 9.83399L8.84803 6.65201C9.0433 6.45675 9.0433 6.14017 8.84803 5.94491C8.65277 5.74964 8.33619 5.74964 8.14093 5.94491L5.3125 8.77333L2.48407 5.94491C2.28881 5.74964 1.97223 5.74964 1.77697 5.94491C1.5817 6.14017 1.5817 6.45675 1.77697 6.65201L4.95895 9.83399ZM4.8125 0L4.8125 9.48044H5.8125L5.8125 0L4.8125 0Z"
            fill="white"
          />
          <path
            d="M1 9.51172L1 10.5117"
            stroke="white"
            stroke-linecap="square"
          />
          <line
            x1="10"
            y1="9.51172"
            x2="10"
            y2="10.5117"
            stroke="white"
            stroke-linecap="square"
          />
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
   middleware:'auth',
  components: {
    Vqr,
  },
  data: () => ({
    logo: null,
    qrUrl: "",
  }),
  mounted() {
    if(this.$auth.user.is_active == 1 && this.$auth.user.is_contract == 0){
        this.$router.push("/universal_contract");
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
