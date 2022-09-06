<template>
  <div class="qr rounded bg-white w-full pt-3 pb-16 px-2">
    <div
      @click="$router.go(-1)"
      class="my-2 mx-6 hidden lg:inline-flex items-center"
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

    <div class="container">
      <iframe :src="url" frameborder="0" width="100%" height="900"></iframe>
    </div>

    <div class="mt-4" style="display: flex; justify-content: center">
      <!-- <div
        style="cursor: pointer"
        class="
          bg-t_primary
          hover:bg-blue-700
          mt-6
          flex
          items-center
          text-white
          ml-4
          py-2
          px-8
          rounded
        "
      >
        <svg
          style="margin-right: 10px"
          width="15"
          height="15"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.25 9.05C9.775 9.05 9.35 9.2375 9.025 9.53125L4.56875 6.9375C4.6 6.79375 4.625 6.65 4.625 6.5C4.625 6.35 4.6 6.20625 4.56875 6.0625L8.975 3.49375C9.3125 3.80625 9.75625 4 10.25 4C11.2875 4 12.125 3.1625 12.125 2.125C12.125 1.0875 11.2875 0.25 10.25 0.25C9.2125 0.25 8.375 1.0875 8.375 2.125C8.375 2.275 8.4 2.41875 8.43125 2.5625L4.025 5.13125C3.6875 4.81875 3.24375 4.625 2.75 4.625C1.7125 4.625 0.875 5.4625 0.875 6.5C0.875 7.5375 1.7125 8.375 2.75 8.375C3.24375 8.375 3.6875 8.18125 4.025 7.86875L8.475 10.4688C8.44375 10.6 8.425 10.7375 8.425 10.875C8.425 11.8813 9.24375 12.7 10.25 12.7C11.2563 12.7 12.075 11.8813 12.075 10.875C12.075 9.86875 11.2563 9.05 10.25 9.05Z"
            fill="white"
          />
        </svg>
        Ulashish
      </div> -->
    </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
  data: () => ({
    contract: {},
    acts: [],
    count: null,
    url: null,
  }),
  created() {},
  async mounted() {



    try {
      this.url = `https://pdf.zerox.uz/index.php?id=${this.$route.query.id}&lang=uz`;
    } catch (e) {
  
    }

  
  },
  components: {

  },
  methods: {
     middleware:'auth',
    dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },
    async download() {
      const doc = new jsPDF();
      const html = this.$refs.content.innerHTML;
      doc.html(html, 15, 15);
      doc.save("output.pdf");
    },
    async getActs() {
      try {
        const response = await this.$axios.get(
          `/generatepdf/${this.contract._id}`
        );
        if (response.status == 200) {
          this.acts = response.data.acts;
          this.count = response.data.acts.length - 1;
      
        }
      } catch (e) {
     
      }
    },

    async createPdfFile() {
      html2pdf(this.$refs.document, {
        margin: [0.3, 0, 0.3, 0],
        filename: `${this.contract.number}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: "avoid", before: [".pagebreak"] },
      });
    },

    pdfDownload() {
      this.$store.dispatch("pdfDownload", this.contract);
    },
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